from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str
    postgres_user: str = "dailyplanner"
    postgres_password: str = "dailyplanner"
    postgres_db: str = "dailyplanner"
    ai_provider: str = "mock"
    ai_enabled: bool = True
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-1.5-flash"
    ai_daily_quota_free: int = 20
    ai_daily_quota_pro: int = 300
    ai_rate_limit_per_minute: int = 10
    ai_cache_enabled: bool = True
    ai_fallback_enabled: bool = True
    ai_max_messages_per_thread: int = 10
    ai_max_chars_per_request: int = 8000
    jwt_secret_key: str = "dailyplanner-dev-secret-change-me"
    jwt_access_token_expire_minutes: int = 60 * 24 * 7


@lru_cache()
def get_settings() -> Settings:
    return Settings()
