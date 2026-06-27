from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from pydantic import ConfigDict


class InboxItemBase(BaseModel):
    source_type: str = "whatsapp_paste"
    raw_text: str
    detected_title: Optional[str] = None
    detected_deadline: Optional[str] = None
    detected_project: Optional[str] = None
    detected_priority: Optional[str] = None
    status: str = "pending"


class InboxItemCreate(InboxItemBase):
    pass


class InboxItemUpdate(BaseModel):
    source_type: Optional[str] = None
    raw_text: Optional[str] = None
    detected_title: Optional[str] = None
    detected_deadline: Optional[str] = None
    detected_project: Optional[str] = None
    detected_priority: Optional[str] = None
    status: Optional[str] = None


class InboxItemRead(InboxItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
