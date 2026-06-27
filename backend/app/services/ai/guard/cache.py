import hashlib
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from ....models.ai import AIAnalysisCache
from ..types import TaskExtractionResult


def input_hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def build_cache_key(provider: str, model: str, normalized_input: str) -> str:
    return hashlib.sha256(f"{provider}:{model}:{normalized_input}".encode("utf-8")).hexdigest()


class CacheGuard:
    def __init__(self, enabled: bool = True, ttl_days: int = 7) -> None:
        self.enabled = enabled
        self.ttl_days = ttl_days

    def get(self, db: Session, cache_key: str) -> TaskExtractionResult | None:
        if not self.enabled:
            return None
        row = db.query(AIAnalysisCache).filter(AIAnalysisCache.cache_key == cache_key).first()
        if not row or row.expires_at < datetime.utcnow():
            return None
        result = TaskExtractionResult.model_validate(row.result_json)
        result.cache_hit = True
        return result

    def set(self, db: Session, *, cache_key: str, provider: str, model: str, normalized_input: str, result: TaskExtractionResult) -> None:
        if not self.enabled:
            return
        payload = result.model_dump(mode="json")
        payload["cache_hit"] = False
        row = AIAnalysisCache(
            cache_key=cache_key,
            provider=provider,
            model=model,
            input_hash=input_hash(normalized_input),
            result_json=payload,
            expires_at=datetime.utcnow() + timedelta(days=self.ttl_days),
        )
        db.add(row)
        db.commit()
