def confidence_label(score: int) -> str:
    if score >= 90:
        return "Çok emin"
    if score >= 75:
        return "Emin"
    if score >= 50:
        return "Kısmen emin"
    return "Emin değil"


def calculate_confidence(
    *,
    title_found: bool,
    deadline_found: bool,
    priority_found: bool,
    project_found: bool,
    subtasks_found: bool,
    multi_message: bool,
) -> int:
    score = 30
    if title_found:
        score += 20
    if deadline_found:
        score += 20
    if priority_found:
        score += 15
    if project_found:
        score += 15
    if subtasks_found:
        score += 20
    if multi_message:
        score += 10
    return max(30, min(98, score))
