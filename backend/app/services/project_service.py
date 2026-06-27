from sqlalchemy.orm import Session
from uuid import UUID
from ..models.project import Project
from ..schemas.project import ProjectCreate, ProjectUpdate


def get_projects(db: Session):
    return db.query(Project).all()


def get_project(db: Session, project_id: UUID):
    return db.query(Project).filter(Project.id == project_id).first()


def create_project(db: Session, project_in: ProjectCreate):
    project = Project(**project_in.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def update_project(db: Session, project: Project, project_in: ProjectUpdate):
    for field, value in project_in.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project):
    db.delete(project)
    db.commit()
