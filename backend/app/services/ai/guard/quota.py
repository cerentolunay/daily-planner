from collections import defaultdict
from datetime import date

from ..errors import AIError

_quota_counts: dict[tuple[str, str], int] = defaultdict(int)


class QuotaGuard:
    def __init__(self, daily_limit: int) -> None:
        self.daily_limit = daily_limit

    def check(self, user_id: str | None = None) -> None:
        key = (user_id or "anonymous", date.today().isoformat())
        if _quota_counts[key] >= self.daily_limit:
            raise AIError("AI_QUOTA_EXCEEDED")
        _quota_counts[key] += 1
