from uuid import UUID

from sqlalchemy.orm import Session, joinedload

from ..models.inbox_item import InboxItem, InboxThread, TaskDraft
from ..models.task import Subtask, Task
from ..schemas.inbox_item import InboxItemCreate, InboxItemUpdate, InboxThreadCreate, InboxThreadUpdate, TaskDraftCreate, TaskDraftUpdate
from .ai.gateway import AIGateway


def get_inbox_items(db: Session):
    return db.query(InboxItem).order_by(InboxItem.created_at.desc()).all()


def get_inbox_item(db: Session, inbox_item_id: UUID):
    return db.query(InboxItem).filter(InboxItem.id == inbox_item_id).first()


def create_inbox_item(db: Session, inbox_item_in: InboxItemCreate):
    item = InboxItem(**inbox_item_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_inbox_item(db: Session, item: InboxItem, inbox_item_in: InboxItemUpdate):
    for field, value in inbox_item_in.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_inbox_item(db: Session, item: InboxItem):
    db.delete(item)
    db.commit()


def get_threads(db: Session):
    return db.query(InboxThread).options(joinedload(InboxThread.items)).order_by(InboxThread.created_at.desc()).all()


def get_thread(db: Session, thread_id: UUID):
    return db.query(InboxThread).options(joinedload(InboxThread.items)).filter(InboxThread.id == thread_id).first()


def create_thread(db: Session, thread_in: InboxThreadCreate):
    payload = thread_in.model_dump()
    item_ids = payload.pop("item_ids", [])
    thread = InboxThread(**payload)
    db.add(thread)
    db.flush()
    if item_ids:
        db.query(InboxItem).filter(InboxItem.id.in_(item_ids)).update({"thread_id": thread.id}, synchronize_session=False)
    db.commit()
    db.refresh(thread)
    return get_thread(db, thread.id)


def update_thread(db: Session, thread: InboxThread, thread_in: InboxThreadUpdate):
    for field, value in thread_in.model_dump(exclude_unset=True).items():
        setattr(thread, field, value)
    db.commit()
    db.refresh(thread)
    return thread


def delete_thread(db: Session, thread: InboxThread):
    db.query(InboxItem).filter(InboxItem.thread_id == thread.id).update({"thread_id": None}, synchronize_session=False)
    db.delete(thread)
    db.commit()


def add_item_to_thread(db: Session, thread: InboxThread, item: InboxItem):
    item.thread_id = thread.id
    db.commit()
    db.refresh(item)
    return item


def remove_item_from_thread(db: Session, item: InboxItem):
    item.thread_id = None
    db.commit()
    db.refresh(item)
    return item


def analysis_to_draft_payload(result, thread_id: UUID | None = None):
    return {
        "thread_id": thread_id,
        "title": result.title,
        "description": result.description,
        "project_hint": result.project_hint,
        "deadline": result.deadline,
        "priority": result.priority,
        "status": result.status,
        "confidence": result.confidence,
        "analysis_json": result.model_dump(mode="json"),
        "subtasks_json": result.subtasks,
    }


async def analyze_item(db: Session, item: InboxItem):
    result = await AIGateway(db).analyze_text(item.raw_text)
    item.detected_title = result.title
    item.detected_deadline = result.deadline.isoformat() if result.deadline else None
    item.detected_project = result.project_hint
    item.detected_priority = result.priority
    item.status = "analyzed"
    draft = TaskDraft(**analysis_to_draft_payload(result, item.thread_id))
    db.add(draft)
    db.commit()
    db.refresh(item)
    db.refresh(draft)
    return draft


async def analyze_thread(db: Session, thread: InboxThread):
    result = await AIGateway(db).analyze_thread([item.raw_text for item in thread.items])
    thread.summary = result.source_summary
    thread.project_hint = result.project_hint
    thread.deadline_hint = result.deadline
    thread.priority_hint = result.priority
    thread.confidence = result.confidence
    thread.status = "reviewed"
    draft = TaskDraft(**analysis_to_draft_payload(result, thread.id))
    db.add(draft)
    for item in thread.items:
        item.status = "analyzed"
    db.commit()
    db.refresh(draft)
    return draft


def get_task_drafts(db: Session):
    return db.query(TaskDraft).order_by(TaskDraft.created_at.desc()).all()


def get_task_draft(db: Session, draft_id: UUID):
    return db.query(TaskDraft).filter(TaskDraft.id == draft_id).first()


def create_task_draft(db: Session, draft_in: TaskDraftCreate):
    draft = TaskDraft(**draft_in.model_dump())
    db.add(draft)
    db.commit()
    db.refresh(draft)
    return draft


def update_task_draft(db: Session, draft: TaskDraft, draft_in: TaskDraftUpdate):
    for field, value in draft_in.model_dump(exclude_unset=True).items():
        setattr(draft, field, value)
    db.commit()
    db.refresh(draft)
    return draft


def delete_task_draft(db: Session, draft: TaskDraft):
    db.delete(draft)
    db.commit()


def convert_draft_to_task(db: Session, draft: TaskDraft):
    task = Task(
        title=draft.title,
        description=draft.description,
        deadline=draft.deadline,
        priority=draft.priority,
        status=draft.status,
        source_type="smart_inbox",
        source_text=draft.description,
        source_thread_id=draft.thread_id,
    )
    db.add(task)
    db.flush()
    for index, title in enumerate(draft.subtasks_json or []):
        db.add(Subtask(task_id=task.id, title=title, position=index))
    if draft.thread_id:
        thread = get_thread(db, draft.thread_id)
        if thread:
            thread.status = "converted"
            for item in thread.items:
                item.status = "converted"
    db.delete(draft)
    db.commit()
    db.refresh(task)
    return task


async def convert_thread_to_task(db: Session, thread: InboxThread):
    draft = await analyze_thread(db, thread)
    return convert_draft_to_task(db, draft)
