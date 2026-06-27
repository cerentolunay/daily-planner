from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from pydantic import ConfigDict


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    color: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None


class ProjectRead(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime
