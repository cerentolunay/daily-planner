"""auth user codes

Revision ID: 0001_auth_user_codes
Revises:
Create Date: 2026-06-28
"""

from alembic import op

revision = "0001_auth_user_codes"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(120) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        )
        """
    )
    op.execute("CREATE INDEX IF NOT EXISTS ix_users_email ON users (email)")
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS auth_codes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) NOT NULL,
            purpose VARCHAR(40) NOT NULL,
            code_hash VARCHAR(255) NOT NULL,
            attempts INTEGER NOT NULL DEFAULT 0,
            locked_until TIMESTAMPTZ NULL,
            expires_at TIMESTAMPTZ NOT NULL,
            consumed_at TIMESTAMPTZ NULL,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        )
        """
    )
    op.execute("CREATE INDEX IF NOT EXISTS ix_auth_codes_email ON auth_codes (email)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_auth_codes_purpose ON auth_codes (purpose)")
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN NOT NULL DEFAULT FALSE")
    for table in ["projects", "tasks", "subtasks", "inbox_items", "inbox_threads", "task_drafts"]:
        op.execute(f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS user_id UUID")
        op.execute(f"CREATE INDEX IF NOT EXISTS ix_{table}_user_id ON {table} (user_id)")
    op.execute("ALTER TABLE inbox_items ADD COLUMN IF NOT EXISTS ai_result_json JSONB")


def downgrade():
    for table in ["projects", "tasks", "subtasks", "inbox_items", "inbox_threads", "task_drafts"]:
        op.execute(f"DROP INDEX IF EXISTS ix_{table}_user_id")
        op.execute(f"ALTER TABLE {table} DROP COLUMN IF EXISTS user_id")
    op.execute("ALTER TABLE inbox_items DROP COLUMN IF EXISTS ai_result_json")
    op.execute("DROP INDEX IF EXISTS ix_auth_codes_purpose")
    op.execute("DROP INDEX IF EXISTS ix_auth_codes_email")
    op.execute("DROP TABLE IF EXISTS auth_codes")
    op.execute("DROP INDEX IF EXISTS ix_users_email")
    op.execute("DROP TABLE IF EXISTS users")
