import uuid
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .base import Base


class InboxItem(Base):
    __tablename__ = "inbox_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_type = Column(String(50), nullable=False, default="whatsapp_paste")
    raw_text = Column(Text, nullable=False)
    detected_title = Column(String(255), nullable=True)
    detected_deadline = Column(String(120), nullable=True)
    detected_project = Column(String(120), nullable=True)
    detected_priority = Column(String(20), nullable=True)
    status = Column(String(20), nullable=False, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
