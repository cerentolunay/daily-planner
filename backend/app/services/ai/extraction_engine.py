from typing import Iterable

from ...models.inbox_item import InboxItem
from .confidence import calculate_confidence
from .normalizer import normalize_deadline, normalize_description, normalize_subtasks
from .rule_engine import RuleEngine
from .suggestion_builder import build_result


class ExtractionEngine:
    def __init__(self) -> None:
        self.rules = RuleEngine()

    def analyze_text(self, text: str):
        return self._analyze([text])

    def analyze_thread(self, items: Iterable[InboxItem]):
        return self._analyze([item.raw_text for item in items])

    def _analyze(self, parts: list[str]):
        joined = "\n".join(parts)
        title, title_signals = self.rules.suggest_title(joined)
        deadline, deadline_signals = self.rules.find_deadline(joined)
        priority, priority_signals = self.rules.find_priority(joined)
        status, status_signals = self.rules.find_status(joined)
        project_hint, project_signals = self.rules.find_project(joined)
        subtasks, subtask_signals = self.rules.find_subtasks(joined)
        normalized_subtasks = normalize_subtasks(subtasks, title)

        confidence = calculate_confidence(
            title_found=bool(title),
            deadline_found=bool(deadline_signals),
            priority_found=bool(priority_signals),
            project_found=bool(project_signals),
            subtasks_found=bool(subtasks),
            multi_message=len(parts) > 1,
        )

        raw_signals = {
            "title": title_signals,
            "deadline": deadline_signals,
            "priority": priority_signals,
            "status": status_signals,
            "project": project_signals,
            "subtasks": subtask_signals,
        }

        return build_result(
            title=title,
            description=normalize_description(parts),
            project_hint=project_hint,
            deadline=normalize_deadline(deadline),
            priority=priority,
            status=status,
            subtasks=normalized_subtasks,
            confidence=confidence,
            raw_signals=raw_signals,
            source_count=len(parts),
        )
