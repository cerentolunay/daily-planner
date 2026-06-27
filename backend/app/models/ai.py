import uuid
from datetime import datetime, timedelta

from sqlalchemy import Boolean, Column, DateTime, Integer, JSON, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from .base import Base


def default_cache_expiry():
    return datetime.utcnow() + timedelta(days=7)


class AIAnalysisCache(Base):
    __tablename__ = "ai_analysis_cache"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cache_key = Column(String(128), nullable=False, unique=True, index=True)
    provider = Column(String(50), nullable=False)
    model = Column(String(120), nullable=False)
    input_hash = Column(String(128), nullable=False)
    result_json = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False, default=default_cache_expiry)


class AIUsageLog(Base):
    __tablename__ = "ai_usage_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(120), nullable=True)
    provider = Column(String(50), nullable=False)
    model = Column(String(120), nullable=False)
    operation = Column(String(50), nullable=False)
    input_chars = Column(Integer, nullable=False, default=0)
    message_count = Column(Integer, nullable=False, default=1)
    cache_hit = Column(Boolean, nullable=False, default=False)
    used_fallback = Column(Boolean, nullable=False, default=False)
    success = Column(Boolean, nullable=False, default=True)
    error_code = Column(String(80), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
