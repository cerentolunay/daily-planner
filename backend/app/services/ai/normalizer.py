from datetime import datetime


def normalize_description(parts: list[str]) -> str:
    return "\n".join(part.strip() for part in parts if part and part.strip())


def normalize_deadline(deadline: datetime | None) -> datetime | None:
    return deadline


def normalize_subtasks(subtasks: list[str], title: str) -> list[str]:
    base = [subtask.strip().capitalize() for subtask in subtasks if subtask.strip()]
    if not base:
        base = [
            f"{title} için kapsamı netleştir",
            "Gerekli notları toparla",
            "Son kontrolü yap",
        ]
    return list(dict.fromkeys(base))[:8]
