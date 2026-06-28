from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from ..deps import get_current_user, get_db
from ...models.user import User
from ...services.project_service import (
    get_projects,
    get_project,
    create_project,
    update_project,
    delete_project,
)
from ...schemas.project import ProjectCreate, ProjectRead, ProjectUpdate

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_projects(db, current_user.id)


@router.post("/", response_model=ProjectRead)
def create_new_project(project_in: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_project(db, project_in, current_user.id)


@router.get("/{project_id}", response_model=ProjectRead)
def read_project(project_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/{project_id}", response_model=ProjectRead)
def update_existing_project(project_id: UUID, project_in: ProjectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return update_project(db, project, project_in)


@router.delete("/{project_id}")
def delete_existing_project(project_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    delete_project(db, project)
    return {"detail": "Project deleted"}
