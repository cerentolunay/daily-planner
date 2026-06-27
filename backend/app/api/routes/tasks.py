from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import get_db
from ...services.task_service import (
    get_tasks,
    get_task,
    create_task,
    update_task,
    delete_task,
)
from ...schemas.task import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/", response_model=list[TaskRead])
def list_tasks(db: Session = Depends(get_db)):
    return get_tasks(db)


@router.post("/", response_model=TaskRead)
def create_new_task(task_in: TaskCreate, db: Session = Depends(get_db)):
    return create_task(db, task_in)


@router.get("/{task_id}", response_model=TaskRead)
def read_task(task_id: str, db: Session = Depends(get_db)):
    task = get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=TaskRead)
def update_existing_task(task_id: str, task_in: TaskUpdate, db: Session = Depends(get_db)):
    task = get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return update_task(db, task, task_in)


@router.delete("/{task_id}")
def delete_existing_task(task_id: str, db: Session = Depends(get_db)):
    task = get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    delete_task(db, task)
    return {"detail": "Task deleted"}
