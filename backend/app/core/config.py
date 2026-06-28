from functools import lru_cache
from pathlib import Path

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "postgresql+psycopg://dailyplanner:dailyplanner@postgres:5432/dailyplanner"
    database_url_file: str | None = None
    postgres_user: str = "dailyplanner"
    postgres_password: str = "dailyplanner"
    postgres_db: str = "dailyplanner"
    ai_provider: str = "mock"
    ai_enabled: bool = True
    gemini_api_key: str | None = None
    gemini_api_key_file: str | None = None
    gemini_model: str = "gemini-1.5-flash"
    ai_daily_quota_free: int = 20
    ai_daily_quota_pro: int = 300
    ai_rate_limit_per_minute: int = 10
    ai_cache_enabled: bool = True
    ai_fallback_enabled: bool = True
    ai_max_messages_per_thread: int = 10
    ai_max_chars_per_request: int = 8000
    jwt_secret_key: str = "dailyplanner-dev-secret-change-me"
    jwt_secret_key_file: str | None = None
    jwt_access_token_expire_minutes: int = 60
    jwt_refresh_token_expire_minutes: int = 60 * 24 * 30
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_password_file: str | None = None
    smtp_from_email: str = "noreply@dailyplanner.local"
    smtp_from_name: str = "DailyPlanner"
    smtp_use_tls: bool = True
    auth_code_expire_minutes: int = 10
    auth_code_resend_seconds: int = 60
    auth_code_max_attempts: int = 5
    auth_code_lock_minutes: int = 15

    @model_validator(mode="after")
    def load_secret_files(self):
        for value_field, file_field in [
            ("database_url", "database_url_file"),
            ("gemini_api_key", "gemini_api_key_file"),
            ("jwt_secret_key", "jwt_secret_key_file"),
            ("smtp_password", "smtp_password_file"),
        ]:
            secret_path = getattr(self, file_field)
            if secret_path:
                path = Path(secret_path)
                if path.exists():
                    setattr(self, value_field, path.read_text(encoding="utf-8").strip())
        return self


@lru_cache()
def get_settings() -> Settings:
    return Settings()
