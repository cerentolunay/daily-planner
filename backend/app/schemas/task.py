from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: Optional[UUID] = None
    deadline: Optional[datetime] = None
    priority: str = "medium"
    status: str = "todo"
    source_type: str = "manual"
    source_text: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    project_id: Optional[UUID] = None
    deadline: Optional[datetime] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    source_type: Optional[str] = None
    source_text: Optional[str] = None


class TaskRead(TaskBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True
