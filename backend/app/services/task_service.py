from sqlalchemy.orm import Session
from uuid import UUID
from ..models.task import Subtask, Task
from ..schemas.task import TaskCreate, TaskUpdate


def get_tasks(db: Session, user_id: UUID):
    return db.query(Task).filter(Task.user_id == user_id).order_by(Task.created_at.desc()).all()


def get_task(db: Session, task_id: UUID, user_id: UUID):
    return db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()


def create_task(db: Session, task_in: TaskCreate, user_id: UUID):
    payload = task_in.model_dump()
    subtasks = payload.pop("subtasks", [])
    task = Task(**payload, user_id=user_id)
    db.add(task)
    db.flush()
    for index, subtask in enumerate(subtasks):
        db.add(Subtask(user_id=user_id, task_id=task.id, position=subtask.get("position", index), title=subtask["title"], is_completed=subtask.get("is_completed", False)))
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task: Task, task_in: TaskUpdate):
    for field, value in task_in.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task):
    db.delete(task)
    db.commit()


def create_subtask(db: Session, task: Task, title: str, position: int | None = None):
    next_position = position if position is not None else len(task.subtasks)
    subtask = Subtask(user_id=task.user_id, task_id=task.id, title=title, position=next_position)
    db.add(subtask)
    db.commit()
    db.refresh(subtask)
    return subtask


def update_subtask(db: Session, subtask: Subtask, values: dict):
    for field, value in values.items():
        setattr(subtask, field, value)
    db.commit()
    db.refresh(subtask)
    return subtask


def get_subtask(db: Session, subtask_id: UUID, user_id: UUID):
    return db.query(Subtask).filter(Subtask.id == subtask_id, Subtask.user_id == user_id).first()


def delete_subtask(db: Session, subtask: Subtask):
    db.delete(subtask)
    db.commit()
