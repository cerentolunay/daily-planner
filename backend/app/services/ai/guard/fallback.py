from ..extraction_engine import ExtractionEngine
from ..types import TaskExtractionResult


class FallbackEngine:
    def analyze_text(self, text: str, provider: str = "rule_based") -> TaskExtractionResult:
        legacy = ExtractionEngine().analyze_text(text)
        return TaskExtractionResult(
            title=legacy.title,
            description=legacy.description,
            project_hint=legacy.project_hint,
            deadline=legacy.deadline,
            priority=legacy.priority,
            status=legacy.status,
            subtasks=legacy.subtasks,
            confidence=legacy.confidence,
            confidence_label=legacy.confidence_label,
            source_summary=legacy.source_summary,
            reasoning_summary="Gemini yerine hızlı kural tabanlı analiz kullanıldı.",
            raw_provider=provider,
            raw_response_json=legacy.model_dump(mode="json"),
            used_fallback=True,
            cache_hit=False,
        )

    def analyze_thread(self, messages: list[str], provider: str = "rule_based") -> TaskExtractionResult:
        return self.analyze_text("\n".join(messages), provider=provider)
