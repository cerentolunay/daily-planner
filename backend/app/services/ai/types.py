from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator

Priority = Literal["low", "medium", "high", "urgent"]
TaskStatus = Literal["todo", "in_progress", "waiting", "done", "cancelled"]
ConfidenceLabel = Literal["Emin değil", "Kısmen emin", "Emin", "Çok emin"]


class TaskExtractionResult(BaseModel):
    title: str
    description: str | None = None
    project_hint: str | None = None
    deadline: datetime | None = None
    priority: Priority = "medium"
    status: TaskStatus = "todo"
    subtasks: list[str] = []
    confidence: int = Field(ge=0, le=100)
    confidence_label: ConfidenceLabel = "Kısmen emin"
    source_summary: str | None = None
    reasoning_summary: str | None = None
    raw_provider: str = "mock"
    raw_response_json: dict[str, Any] | None = None
    used_fallback: bool = False
    cache_hit: bool = False

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("title cannot be empty")
        return value.strip()

    @field_validator("subtasks")
    @classmethod
    def limit_subtasks(cls, value: list[str]) -> list[str]:
        return [item.strip() for item in value if item and item.strip()][:20]


class AIAnalyzeTextRequest(BaseModel):
    text: str
    user_id: str | None = None


class AIAnalyzeThreadRequest(BaseModel):
    messages: list[str]
    user_id: str | None = None


class AIUsageSummary(BaseModel):
    total_requests: int
    cache_hits: int
    fallbacks: int
    success_rate: float
