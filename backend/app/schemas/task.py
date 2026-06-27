from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from pydantic import ConfigDict


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
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime
