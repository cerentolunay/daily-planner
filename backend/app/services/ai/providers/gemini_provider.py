import asyncio
from datetime import datetime
from pathlib import Path

from ..errors import AIError
from .base import AIProvider


PROMPT_DIR = Path(__file__).resolve().parents[1] / "prompts"

WEEKDAYS_TR = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]


def read_prompt(name: str) -> str:
    return (PROMPT_DIR / name).read_text(encoding="utf-8")


def current_date_block() -> str:
    now = datetime.now()
    weekday = WEEKDAYS_TR[now.weekday()]
    return f"BUGÜNÜN TARİHİ: {now.strftime('%Y-%m-%d %H:%M')} ({weekday})"


class GeminiProvider(AIProvider):
    name = "gemini"

    def __init__(self, api_key: str | None, model: str) -> None:
        self.api_key = api_key
        self.model = model

    def _client(self):
        if not self.api_key or self.api_key == "your_api_key_here":
            raise AIError("AI_PROVIDER_NOT_CONFIGURED")
        try:
            from google import genai
        except Exception as exc:
            raise AIError("AI_PROVIDER_NOT_CONFIGURED", "Gemini SDK yüklü değil. google-genai dependency ayarını kontrol et.") from exc
        return genai.Client(api_key=self.api_key)

    async def extract_task_from_text(self, text: str) -> dict:
        prompt = "\n\n".join(
            [
                read_prompt("system_rules.md"),
                current_date_block(),
                read_prompt("task_extraction.md"),
                "KULLANICI MESAJI:",
                text,
            ]
        )
        return await self._generate(prompt)

    async def extract_task_from_thread(self, messages: list[str]) -> dict:
        message_block = "\n".join(f"Mesaj {index + 1}: {message}" for index, message in enumerate(messages))
        prompt = "\n\n".join(
            [
                read_prompt("system_rules.md"),
                current_date_block(),
                read_prompt("thread_extraction.md"),
                "KULLANICI MESAJLARI:",
                message_block,
            ]
        )
        return await self._generate(prompt)

    async def _generate(self, prompt: str) -> dict:
        client = self._client()

        def call_provider():
            response = client.models.generate_content(
                model=self.model,
                contents=prompt,
            )
            return getattr(response, "text", "") or ""

        try:
            return {"raw_text": await asyncio.wait_for(asyncio.to_thread(call_provider), timeout=20)}
        except asyncio.TimeoutError as exc:
            raise AIError("AI_PROVIDER_TIMEOUT") from exc
        except AIError:
            raise
        except Exception as exc:
            raise AIError("AI_UNKNOWN_ERROR", "Gemini analizi sırasında bir sorun oluştu.") from exc
