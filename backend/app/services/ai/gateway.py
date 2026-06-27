from sqlalchemy.orm import Session

from .config import get_ai_settings
from .errors import AIError
from .guard.cache import CacheGuard, build_cache_key
from .guard.fallback import FallbackEngine
from .guard.quota import QuotaGuard
from .guard.rate_limit import RateLimitGuard
from .guard.sanitizer import Sanitizer
from .guard.validator import AIResultValidator
from .providers.gemini_provider import GeminiProvider
from .providers.mock_provider import MockProvider
from .services.usage_service import log_ai_usage
from .types import TaskExtractionResult


class AIGateway:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.settings = get_ai_settings()
        self.sanitizer = Sanitizer(self.settings.ai_max_chars_per_request)
        self.validator = AIResultValidator()
        self.cache = CacheGuard(enabled=self.settings.ai_cache_enabled)
        self.quota = QuotaGuard(self.settings.ai_daily_quota_free)
        self.rate_limit = RateLimitGuard(self.settings.ai_rate_limit_per_minute)
        self.fallback = FallbackEngine()

    async def analyze_text(self, text: str, user_id: str | None = None) -> TaskExtractionResult:
        normalized = self.sanitizer.clean_text(text)
        return await self._run("text", [normalized], user_id)

    async def analyze_thread(self, messages: list[str], user_id: str | None = None) -> TaskExtractionResult:
        normalized_messages = self.sanitizer.clean_messages(messages, self.settings.ai_max_messages_per_thread)
        return await self._run("thread", normalized_messages, user_id)

    async def _run(self, operation: str, messages: list[str], user_id: str | None) -> TaskExtractionResult:
        provider = self._provider()
        normalized_input = "\n".join(messages)
        cache_key = build_cache_key(provider.name, provider.model, normalized_input)
        input_chars = len(normalized_input)

        cached = self.cache.get(self.db, cache_key)
        if cached:
            self._log(user_id, provider.name, provider.model, operation, input_chars, len(messages), cached, True)
            return cached

        self.quota.check(user_id)
        self.rate_limit.check(user_id)

        try:
            if not self.settings.ai_enabled:
                raise AIError("AI_PROVIDER_NOT_CONFIGURED", "AI özelliği backend ayarında kapalı.")
            raw = await (
                provider.extract_task_from_thread(messages)
                if operation == "thread"
                else provider.extract_task_from_text(messages[0])
            )
            raw_payload = raw.get("raw_text") if isinstance(raw, dict) and "raw_text" in raw else raw
            result = self.validator.validate(raw_payload, provider=provider.name)
        except AIError as error:
            if error.code in {"AI_QUOTA_EXCEEDED", "AI_RATE_LIMITED"} or not self.settings.ai_fallback_enabled:
                self._log_error(user_id, provider.name, provider.model, operation, input_chars, len(messages), error.code)
                raise
            result = self._fallback_result(operation, messages, provider.name)
        except Exception:
            if not self.settings.ai_fallback_enabled:
                self._log_error(user_id, provider.name, provider.model, operation, input_chars, len(messages), "AI_UNKNOWN_ERROR")
                raise AIError("AI_UNKNOWN_ERROR")
            result = self._fallback_result(operation, messages, provider.name)

        self.cache.set(self.db, cache_key=cache_key, provider=provider.name, model=provider.model, normalized_input=normalized_input, result=result)
        self._log(user_id, provider.name, provider.model, operation, input_chars, len(messages), result, False)
        return result

    def _provider(self):
        provider_name = self.settings.ai_provider.lower()
        if provider_name == "gemini":
            return GeminiProvider(self.settings.gemini_api_key, self.settings.gemini_model)
        return MockProvider()

    def _fallback_result(self, operation: str, messages: list[str], provider_name: str) -> TaskExtractionResult:
        if operation == "thread":
            return self.fallback.analyze_thread(messages, provider=f"{provider_name}:fallback")
        return self.fallback.analyze_text(messages[0], provider=f"{provider_name}:fallback")

    def _log(self, user_id: str | None, provider: str, model: str, operation: str, input_chars: int, message_count: int, result: TaskExtractionResult, cache_hit: bool) -> None:
        log_ai_usage(
            self.db,
            user_id=user_id,
            provider=provider,
            model=model,
            operation=operation,
            input_chars=input_chars,
            message_count=message_count,
            cache_hit=cache_hit or result.cache_hit,
            used_fallback=result.used_fallback,
            success=True,
        )

    def _log_error(self, user_id: str | None, provider: str, model: str, operation: str, input_chars: int, message_count: int, error_code: str) -> None:
        log_ai_usage(
            self.db,
            user_id=user_id,
            provider=provider,
            model=model,
            operation=operation,
            input_chars=input_chars,
            message_count=message_count,
            cache_hit=False,
            used_fallback=False,
            success=False,
            error_code=error_code,
        )
