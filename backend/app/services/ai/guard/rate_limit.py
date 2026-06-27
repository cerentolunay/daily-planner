from collections import defaultdict, deque
from datetime import datetime, timedelta

from ..errors import AIError

_rate_windows: dict[str, deque[datetime]] = defaultdict(deque)


class RateLimitGuard:
    def __init__(self, per_minute: int) -> None:
        self.per_minute = per_minute

    def check(self, user_id: str | None = None) -> None:
        key = user_id or "anonymous"
        now = datetime.utcnow()
        window = _rate_windows[key]
        while window and window[0] < now - timedelta(minutes=1):
            window.popleft()
        if len(window) >= self.per_minute:
            raise AIError("AI_RATE_LIMITED")
        window.append(now)
