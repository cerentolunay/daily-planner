from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from pydantic import ConfigDict


class SubtaskBase(BaseModel):
    title: str
    is_completed: bool = False
    position: int = 0


class SubtaskCreate(SubtaskBase):
    pass


class SubtaskUpdate(BaseModel):
    title: Optional[str] = None
    is_completed: Optional[bool] = None
    position: Optional[int] = None


class SubtaskRead(SubtaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    task_id: UUID
    created_at: datetime
    updated_at: datetime


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: Optional[UUID] = None
    deadline: Optional[datetime] = None
    priority: str = "medium"
    status: str = "todo"
    source_type: str = "manual"
    source_text: Optional[str] = None
    source_thread_id: Optional[UUID] = None
    source_inbox_item_id: Optional[UUID] = None


class TaskCreate(TaskBase):
    subtasks: list[SubtaskCreate] = []


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    project_id: Optional[UUID] = None
    deadline: Optional[datetime] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    source_type: Optional[str] = None
    source_text: Optional[str] = None
    source_thread_id: Optional[UUID] = None
    source_inbox_item_id: Optional[UUID] = None


class TaskRead(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime
    subtasks: list[SubtaskRead] = []
