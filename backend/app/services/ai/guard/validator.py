import json
import re
from datetime import datetime
from typing import Any

from ..confidence import confidence_label
from ..errors import AIError
from ..types import TaskExtractionResult

VALID_PRIORITIES = {"low", "medium", "high", "urgent"}
VALID_STATUSES = {"todo", "in_progress", "waiting", "done", "cancelled"}


class AIResultValidator:
    def parse_json(self, value: str | dict[str, Any]) -> dict[str, Any]:
        if isinstance(value, dict):
            return value
        text = value.strip()
        text = re.sub(r"^```(?:json)?", "", text).strip()
        text = re.sub(r"```$", "", text).strip()
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError as exc:
            raise AIError("AI_INVALID_JSON") from exc
        if not isinstance(parsed, dict):
            raise AIError("AI_INVALID_JSON")
        return parsed

    def validate(self, value: str | dict[str, Any], *, provider: str, used_fallback: bool = False, cache_hit: bool = False) -> TaskExtractionResult:
        data = self.parse_json(value)
        title = str(data.get("title") or "").strip()
        if not title:
            raise AIError("AI_VALIDATION_FAILED")

        priority = data.get("priority") if data.get("priority") in VALID_PRIORITIES else "medium"
        status = data.get("status") if data.get("status") in VALID_STATUSES else "todo"
        confidence = data.get("confidence", 50)
        try:
          confidence_int = int(confidence)
        except (TypeError, ValueError):
          confidence_int = 50
        confidence_int = max(0, min(100, confidence_int))

        deadline = data.get("deadline")
        parsed_deadline = None
        if deadline:
            try:
                parsed_deadline = datetime.fromisoformat(str(deadline).replace("Z", "+00:00"))
            except ValueError:
                parsed_deadline = None

        subtasks = data.get("subtasks")
        safe_subtasks = subtasks if isinstance(subtasks, list) else []

        return TaskExtractionResult(
            title=title,
            description=data.get("description"),
            project_hint=data.get("project_hint"),
            deadline=parsed_deadline,
            priority=priority,
            status=status,
            subtasks=[str(item).strip() for item in safe_subtasks if str(item).strip()][:20],
            confidence=confidence_int,
            confidence_label=confidence_label(confidence_int),
            source_summary=data.get("source_summary"),
            reasoning_summary=data.get("reasoning_summary"),
            raw_provider=provider,
            raw_response_json=data,
            used_fallback=used_fallback,
            cache_hit=cache_hit,
        )
