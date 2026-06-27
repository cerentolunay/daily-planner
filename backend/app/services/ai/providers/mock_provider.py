from ..extraction_engine import ExtractionEngine
from .base import AIProvider


class MockProvider(AIProvider):
    name = "mock"
    model = "rule-based-mock"

    async def extract_task_from_text(self, text: str) -> dict:
        result = ExtractionEngine().analyze_text(text)
        payload = result.model_dump(mode="json")
        payload["reasoning_summary"] = "MockProvider rule-based analiz sonucunu AI formatında döndürdü."
        return payload

    async def extract_task_from_thread(self, messages: list[str]) -> dict:
        return await self.extract_task_from_text("\n".join(messages))
