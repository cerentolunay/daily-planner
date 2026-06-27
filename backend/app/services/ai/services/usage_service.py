from sqlalchemy.orm import Session

from ....models.ai import AIUsageLog


def log_ai_usage(
    db: Session,
    *,
    user_id: str | None,
    provider: str,
    model: str,
    operation: str,
    input_chars: int,
    message_count: int,
    cache_hit: bool,
    used_fallback: bool,
    success: bool,
    error_code: str | None = None,
) -> None:
    db.add(
        AIUsageLog(
            user_id=user_id,
            provider=provider,
            model=model,
            operation=operation,
            input_chars=input_chars,
            message_count=message_count,
            cache_hit=cache_hit,
            used_fallback=used_fallback,
            success=success,
            error_code=error_code,
        )
    )
    db.commit()


def usage_summary(db: Session) -> dict:
    total = db.query(AIUsageLog).count()
    if total == 0:
        return {"total_requests": 0, "cache_hits": 0, "fallbacks": 0, "success_rate": 1}
    cache_hits = db.query(AIUsageLog).filter(AIUsageLog.cache_hit.is_(True)).count()
    fallbacks = db.query(AIUsageLog).filter(AIUsageLog.used_fallback.is_(True)).count()
    successes = db.query(AIUsageLog).filter(AIUsageLog.success.is_(True)).count()
    return {
        "total_requests": total,
        "cache_hits": cache_hits,
        "fallbacks": fallbacks,
        "success_rate": round(successes / total, 2),
    }
