from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status

_attempts: dict[str, deque[datetime]] = defaultdict(deque)


def check_auth_rate_limit(key: str, limit: int = 10, window_seconds: int = 60):
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(seconds=window_seconds)
    attempts = _attempts[key]
    while attempts and attempts[0] < window_start:
        attempts.popleft()
    if len(attempts) >= limit:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar dene.")
    attempts.append(now)
