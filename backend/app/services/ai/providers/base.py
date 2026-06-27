from abc import ABC, abstractmethod


class AIProvider(ABC):
    name: str
    model: str

    @abstractmethod
    async def extract_task_from_text(self, text: str) -> dict:
        pass

    @abstractmethod
    async def extract_task_from_thread(self, messages: list[str]) -> dict:
        pass
