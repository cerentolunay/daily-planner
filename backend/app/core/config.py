from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    postgres_user: str = "dailyplanner"
    postgres_password: str = "dailyplanner"
    postgres_db: str = "dailyplanner"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
