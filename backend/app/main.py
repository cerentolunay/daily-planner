from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from .api.routes.health import router as health_router
from .api.routes.auth import router as auth_router
from .api.routes.tasks import router as tasks_router
from .api.routes.projects import router as projects_router
from .api.routes.inbox import api_router as api_inbox_router
from .api.routes.inbox import router as inbox_router
from .api.routes.task_drafts import router as task_drafts_router
from .api.routes.ai import router as ai_router
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
app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(projects_router)
app.include_router(inbox_router)
app.include_router(api_inbox_router)
app.include_router(task_drafts_router)
app.include_router(ai_router)


@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)
    with engine.begin() as connection:
        for table in ["projects", "tasks", "subtasks", "inbox_items", "inbox_threads", "task_drafts"]:
            connection.execute(text(f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS user_id UUID"))
        connection.execute(text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS source_thread_id UUID"))
        connection.execute(text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS source_inbox_item_id UUID"))
        connection.execute(text("ALTER TABLE inbox_items ADD COLUMN IF NOT EXISTS ai_result_json JSONB"))
        connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN NOT NULL DEFAULT FALSE"))
