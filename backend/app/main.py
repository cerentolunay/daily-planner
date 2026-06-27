from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes.health import router as health_router
from .api.routes.tasks import router as tasks_router
from .api.routes.projects import router as projects_router
from .api.routes.inbox import router as inbox_router
from .api.routes.task_drafts import router as task_drafts_router
from .models import Base
from .core.database import engine

app = FastAPI(title="DailyPlanner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(tasks_router)
app.include_router(projects_router)
app.include_router(inbox_router)
app.include_router(task_drafts_router)


@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)
