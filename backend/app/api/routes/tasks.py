from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from ..deps import get_current_user, get_db
from ...models.user import User
from ...services.project_service import get_project
from ...services.task_service import (
    get_tasks,
    get_task,
    create_task,
    update_task,
    delete_task,
    create_subtask,
    update_subtask,
    get_subtask,
    delete_subtask,
)
from ...schemas.task import SubtaskCreate, SubtaskRead, SubtaskUpdate, TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/", response_model=list[TaskRead])
def list_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_tasks(db, current_user.id)


@router.post("/", response_model=TaskRead)
def create_new_task(task_in: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if task_in.project_id and not get_project(db, task_in.project_id, current_user.id):
        raise HTTPException(status_code=404, detail="Project not found")
    return create_task(db, task_in, current_user.id)


@router.get("/{task_id}", response_model=TaskRead)
def read_task(task_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = get_task(db, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=TaskRead)
def update_existing_task(task_id: UUID, task_in: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = get_task(db, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task_in.project_id and not get_project(db, task_in.project_id, current_user.id):
        raise HTTPException(status_code=404, detail="Project not found")
    return update_task(db, task, task_in)


@router.delete("/{task_id}")
def delete_existing_task(task_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = get_task(db, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    delete_task(db, task)
    return {"detail": "Task deleted"}


@router.post("/{task_id}/subtasks", response_model=SubtaskRead)
def create_task_subtask(task_id: UUID, subtask_in: SubtaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = get_task(db, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return create_subtask(db, task, subtask_in.title, subtask_in.position)


@router.patch("/{task_id}/subtasks/{subtask_id}", response_model=SubtaskRead)
def update_task_subtask(task_id: UUID, subtask_id: UUID, subtask_in: SubtaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = get_task(db, task_id, current_user.id)
    subtask = get_subtask(db, subtask_id, current_user.id)
    if not task or not subtask or subtask.task_id != task.id:
        raise HTTPException(status_code=404, detail="Subtask not found")
    return update_subtask(db, subtask, subtask_in.model_dump(exclude_unset=True))


@router.delete("/{task_id}/subtasks/{subtask_id}")
def delete_task_subtask(task_id: UUID, subtask_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = get_task(db, task_id, current_user.id)
    subtask = get_subtask(db, subtask_id, current_user.id)
    if not task or not subtask or subtask.task_id != task.id:
        raise HTTPException(status_code=404, detail="Subtask not found")
    delete_subtask(db, subtask)
    return {"detail": "Subtask deleted"}
