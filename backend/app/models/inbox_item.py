import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base


class InboxItem(Base):
    __tablename__ = "inbox_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    source_type = Column(String(50), nullable=False, default="manual")
    content_type = Column(String(50), nullable=False, default="text")
    raw_text = Column(Text, nullable=False)
    title = Column(String(255), nullable=True)
    source_name = Column(String(120), nullable=True)
    source_url = Column(Text, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    ai_result_json = Column(JSON, nullable=True)
    detected_title = Column(String(255), nullable=True)
    detected_deadline = Column(String(120), nullable=True)
    detected_project = Column(String(120), nullable=True)
    detected_priority = Column(String(20), nullable=True)
    status = Column(String(20), nullable=False, default="unprocessed")
    thread_id = Column(UUID(as_uuid=True), ForeignKey("inbox_threads.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="inbox_items")
    thread = relationship("InboxThread", back_populates="items")

    @property
    def source(self):
        return self.source_type


class InboxThread(Base):
    __tablename__ = "inbox_threads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    project_hint = Column(String(120), nullable=True)
    deadline_hint = Column(DateTime(timezone=True), nullable=True)
    priority_hint = Column(String(20), nullable=True)
    confidence = Column(Float, nullable=False, default=30)
    status = Column(String(20), nullable=False, default="open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="inbox_threads")
    items = relationship("InboxItem", back_populates="thread")


class TaskDraft(Base):
    __tablename__ = "task_drafts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    thread_id = Column(UUID(as_uuid=True), ForeignKey("inbox_threads.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    project_hint = Column(String(120), nullable=True)
    deadline = Column(DateTime(timezone=True), nullable=True)
    priority = Column(String(20), nullable=False, default="medium")
    status = Column(String(20), nullable=False, default="todo")
    confidence = Column(Float, nullable=False, default=30)
    analysis_json = Column(JSON, nullable=True)
    subtasks_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="task_drafts")
    thread = relationship("InboxThread")
