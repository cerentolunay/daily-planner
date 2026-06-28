from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..deps import get_current_user, get_db
from ...models.user import User
from ...schemas.inbox_item import (
    InboxItemCreate,
    InboxItemRead,
    InboxItemUpdate,
    InboxThreadCreate,
    InboxThreadRead,
    InboxThreadUpdate,
    TaskDraftRead,
)
from ...schemas.task import TaskRead
from ...services.ai.errors import AIError, ai_http_error
from ...services.inbox_service import (
    add_item_to_thread,
    analyze_item,
    analyze_thread,
    convert_item_to_tasks,
    convert_thread_to_task,
    create_inbox_item,
    create_thread,
    delete_inbox_item,
    delete_thread,
    get_inbox_item,
    get_inbox_items,
    get_thread,
    get_threads,
    remove_item_from_thread,
    update_inbox_item,
    update_thread,
)

router = APIRouter(prefix="/inbox", tags=["inbox"])
api_router = APIRouter(prefix="/api/inbox", tags=["api-inbox"])


class MobileInboxCreate(BaseModel):
    source: str = "manual"
    raw_text: str


def mobile_ai_fallback(item):
    title = item.raw_text.strip().splitlines()[0][:90] if item.raw_text.strip() else "Paylaşılan mesajdan görev"
    return {
        "tasks": [
            {
                "title": title,
                "description": item.raw_text,
                "dueDate": None,
                "priority": "medium",
                "tags": [item.source_type, "fallback"],
                "subtasks": [],
                "confidence": 20,
            }
        ],
        "used_fallback": True,
        "error": "AI analizi tamamlanamadı. Güvenli fallback önerisi gösteriliyor.",
    }


@router.get("/", response_model=list[InboxItemRead])
def list_inbox_items(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_inbox_items(db, current_user.id)


@router.post("/", response_model=InboxItemRead)
def create_new_inbox_item(item_in: InboxItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_inbox_item(db, item_in, current_user.id)


@router.get("/threads", response_model=list[InboxThreadRead])
def list_threads(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_threads(db, current_user.id)


@router.post("/threads", response_model=InboxThreadRead)
def create_new_thread(thread_in: InboxThreadCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_thread(db, thread_in, current_user.id)


@router.get("/threads/{thread_id}", response_model=InboxThreadRead)
def read_thread(thread_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    thread = get_thread(db, thread_id, current_user.id)
    if not thread:
        raise HTTPException(status_code=404, detail="Inbox thread not found")
    return thread


@router.patch("/threads/{thread_id}", response_model=InboxThreadRead)
def update_existing_thread(thread_id: UUID, thread_in: InboxThreadUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    thread = get_thread(db, thread_id, current_user.id)
    if not thread:
        raise HTTPException(status_code=404, detail="Inbox thread not found")
    return update_thread(db, thread, thread_in)


@router.delete("/threads/{thread_id}")
def delete_existing_thread(thread_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    thread = get_thread(db, thread_id, current_user.id)
    if not thread:
        raise HTTPException(status_code=404, detail="Inbox thread not found")
    delete_thread(db, thread)
    return {"detail": "Inbox thread deleted"}


@router.post("/threads/{thread_id}/items/{item_id}", response_model=InboxItemRead)
def add_existing_item_to_thread(thread_id: UUID, item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    thread = get_thread(db, thread_id, current_user.id)
    item = get_inbox_item(db, item_id, current_user.id)
    if not thread or not item:
        raise HTTPException(status_code=404, detail="Thread or inbox item not found")
    return add_item_to_thread(db, thread, item)


@router.delete("/threads/{thread_id}/items/{item_id}", response_model=InboxItemRead)
def remove_existing_item_from_thread(thread_id: UUID, item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    thread = get_thread(db, thread_id, current_user.id)
    item = get_inbox_item(db, item_id, current_user.id)
    if not thread or not item or item.thread_id != thread.id:
        raise HTTPException(status_code=404, detail="Thread item not found")
    return remove_item_from_thread(db, item)


@router.post("/threads/{thread_id}/analyze", response_model=TaskDraftRead)
async def analyze_existing_thread(thread_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    thread = get_thread(db, thread_id, current_user.id)
    if not thread:
        raise HTTPException(status_code=404, detail="Inbox thread not found")
    try:
        return await analyze_thread(db, thread)
    except AIError as error:
        raise ai_http_error(error)


@router.post("/threads/{thread_id}/convert-to-task", response_model=TaskRead)
async def convert_existing_thread_to_task(thread_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    thread = get_thread(db, thread_id, current_user.id)
    if not thread:
        raise HTTPException(status_code=404, detail="Inbox thread not found")
    try:
        return await convert_thread_to_task(db, thread)
    except AIError as error:
        raise ai_http_error(error)


@router.get("/{inbox_item_id}", response_model=InboxItemRead)
def read_inbox_item(inbox_item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = get_inbox_item(db, inbox_item_id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Inbox item not found")
    return item


@router.patch("/{inbox_item_id}", response_model=InboxItemRead)
def update_existing_inbox_item(inbox_item_id: UUID, item_in: InboxItemUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = get_inbox_item(db, inbox_item_id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Inbox item not found")
    return update_inbox_item(db, item, item_in)


@router.delete("/{inbox_item_id}")
def delete_existing_inbox_item(inbox_item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = get_inbox_item(db, inbox_item_id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Inbox item not found")
    delete_inbox_item(db, item)
    return {"detail": "Inbox item deleted"}


@router.post("/{inbox_item_id}/analyze", response_model=TaskDraftRead)
async def analyze_existing_item(inbox_item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = get_inbox_item(db, inbox_item_id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Inbox item not found")
    try:
        return await analyze_item(db, item)
    except AIError as error:
        raise ai_http_error(error)


@api_router.post("/", response_model=InboxItemRead)
def create_mobile_inbox_item(payload: MobileInboxCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    source = payload.source if payload.source in {"manual", "whatsapp", "android_share"} else "manual"
    return create_inbox_item(
        db,
        InboxItemCreate(
            source_type=source,
            content_type="text",
            raw_text=payload.raw_text,
            title="WhatsApp paylaşımı" if source in {"whatsapp", "android_share"} else "Manuel capture",
            status="pending",
            metadata_json={"platform": "mobile", "capture_method": source},
        ),
        current_user.id,
    )


@api_router.get("/", response_model=list[InboxItemRead])
def list_mobile_inbox_items(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_inbox_items(db, current_user.id)


@api_router.get("/{inbox_item_id}", response_model=InboxItemRead)
def read_mobile_inbox_item(inbox_item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = get_inbox_item(db, inbox_item_id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Inbox item not found")
    return item


@api_router.post("/{inbox_item_id}/analyze", response_model=InboxItemRead)
async def analyze_mobile_inbox_item(inbox_item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = get_inbox_item(db, inbox_item_id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Inbox item not found")
    try:
        draft = await analyze_item(db, item)
        item.ai_result_json = {
            "draft_id": str(draft.id),
            "tasks": [
                {
                    "title": draft.title,
                    "description": draft.description,
                    "dueDate": draft.deadline.isoformat() if draft.deadline else None,
                    "priority": draft.priority,
                    "tags": [value for value in [draft.project_hint, "smart-inbox"] if value],
                    "subtasks": draft.subtasks_json or [],
                    "confidence": draft.confidence,
                }
            ],
        }
        item.status = "processed"
        db.commit()
        db.refresh(item)
        return item
    except AIError:
        item.ai_result_json = mobile_ai_fallback(item)
        item.status = "failed"
        db.commit()
        db.refresh(item)
        return item


@api_router.post("/{inbox_item_id}/convert-to-tasks", response_model=list[TaskRead])
async def convert_mobile_inbox_item_to_tasks(inbox_item_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = get_inbox_item(db, inbox_item_id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Inbox item not found")
    return await convert_item_to_tasks(db, item)
