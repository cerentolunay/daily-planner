from ...schemas.inbox_item import TaskExtractionResult
from .confidence import confidence_label


def build_result(
    *,
    title: str,
    description: str,
    project_hint: str | None,
    deadline,
    priority: str,
    status: str,
    subtasks: list[str],
    confidence: int,
    raw_signals: dict,
    source_count: int,
) -> TaskExtractionResult:
    return TaskExtractionResult(
        title=title,
        description=description,
        project_hint=project_hint,
        deadline=deadline,
        priority=priority,
        status=status,
        subtasks=subtasks,
        confidence=confidence,
        confidence_label=confidence_label(confidence),
        source_summary=f"{source_count} kaynak mesaj birlikte analiz edildi." if source_count > 1 else "1 kaynak mesaj analiz edildi.",
        raw_signals=raw_signals,
    )
