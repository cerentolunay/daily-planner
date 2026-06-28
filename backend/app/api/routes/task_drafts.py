from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..deps import get_current_user, get_db
from ...models.user import User
from ...schemas.inbox_item import TaskDraftCreate, TaskDraftRead, TaskDraftUpdate
from ...schemas.task import TaskRead
from ...services.inbox_service import (
    convert_draft_to_task,
    create_task_draft,
    delete_task_draft,
    get_task_draft,
    get_task_drafts,
    update_task_draft,
)

router = APIRouter(prefix="/task-drafts", tags=["task-drafts"])


@router.get("/", response_model=list[TaskDraftRead])
def list_task_drafts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_task_drafts(db, current_user.id)


@router.post("/", response_model=TaskDraftRead)
def create_new_task_draft(draft_in: TaskDraftCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_task_draft(db, draft_in, current_user.id)


@router.get("/{draft_id}", response_model=TaskDraftRead)
def read_task_draft(draft_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    draft = get_task_draft(db, draft_id, current_user.id)
    if not draft:
        raise HTTPException(status_code=404, detail="Task draft not found")
    return draft


@router.patch("/{draft_id}", response_model=TaskDraftRead)
def update_existing_task_draft(draft_id: UUID, draft_in: TaskDraftUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    draft = get_task_draft(db, draft_id, current_user.id)
    if not draft:
        raise HTTPException(status_code=404, detail="Task draft not found")
    return update_task_draft(db, draft, draft_in)


@router.delete("/{draft_id}")
def delete_existing_task_draft(draft_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    draft = get_task_draft(db, draft_id, current_user.id)
    if not draft:
        raise HTTPException(status_code=404, detail="Task draft not found")
    delete_task_draft(db, draft)
    return {"detail": "Task draft deleted"}


@router.post("/{draft_id}/convert-to-task", response_model=TaskRead)
def convert_existing_task_draft(draft_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    draft = get_task_draft(db, draft_id, current_user.id)
    if not draft:
        raise HTTPException(status_code=404, detail="Task draft not found")
    return convert_draft_to_task(db, draft)
