from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class InboxItemBase(BaseModel):
    source_type: str = "manual"
    content_type: str = "text"
    raw_text: str
    title: Optional[str] = None
    source_name: Optional[str] = None
    source_url: Optional[str] = None
    metadata_json: Optional[dict[str, Any]] = None
    ai_result_json: Optional[dict[str, Any]] = None
    detected_title: Optional[str] = None
    detected_deadline: Optional[str] = None
    detected_project: Optional[str] = None
    detected_priority: Optional[str] = None
    status: str = "unprocessed"
    thread_id: Optional[UUID] = None


class InboxItemCreate(InboxItemBase):
    pass


class InboxItemUpdate(BaseModel):
    source_type: Optional[str] = None
    content_type: Optional[str] = None
    raw_text: Optional[str] = None
    title: Optional[str] = None
    source_name: Optional[str] = None
    source_url: Optional[str] = None
    metadata_json: Optional[dict[str, Any]] = None
    ai_result_json: Optional[dict[str, Any]] = None
    detected_title: Optional[str] = None
    detected_deadline: Optional[str] = None
    detected_project: Optional[str] = None
    detected_priority: Optional[str] = None
    status: Optional[str] = None
    thread_id: Optional[UUID] = None


class InboxItemRead(InboxItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    source: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class InboxThreadBase(BaseModel):
    title: str
    summary: Optional[str] = None
    project_hint: Optional[str] = None
    deadline_hint: Optional[datetime] = None
    priority_hint: Optional[str] = None
    confidence: float = 30
    status: str = "open"


class InboxThreadCreate(InboxThreadBase):
    item_ids: list[UUID] = []


class InboxThreadUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    project_hint: Optional[str] = None
    deadline_hint: Optional[datetime] = None
    priority_hint: Optional[str] = None
    confidence: Optional[float] = None
    status: Optional[str] = None


class InboxThreadRead(InboxThreadBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime
    items: list[InboxItemRead] = []


class TaskExtractionResult(BaseModel):
    title: str
    description: Optional[str] = None
    project_hint: Optional[str] = None
    deadline: Optional[datetime] = None
    priority: str = "medium"
    status: str = "todo"
    subtasks: list[str] = []
    confidence: int
    confidence_label: str
    source_summary: str
    raw_signals: dict[str, Any] = {}


class TaskDraftBase(BaseModel):
    thread_id: Optional[UUID] = None
    title: str
    description: Optional[str] = None
    project_hint: Optional[str] = None
    deadline: Optional[datetime] = None
    priority: str = "medium"
    status: str = "todo"
    confidence: float = 30
    analysis_json: Optional[dict[str, Any]] = None
    subtasks_json: Optional[list[str]] = None


class TaskDraftCreate(TaskDraftBase):
    pass


class TaskDraftUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    project_hint: Optional[str] = None
    deadline: Optional[datetime] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    confidence: Optional[float] = None
    analysis_json: Optional[dict[str, Any]] = None
    subtasks_json: Optional[list[str]] = None


class TaskDraftRead(TaskDraftBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime
