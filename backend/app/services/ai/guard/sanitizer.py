from ..errors import AIError


class Sanitizer:
    def __init__(self, max_chars: int) -> None:
        self.max_chars = max_chars

    def clean_text(self, text: str) -> str:
        if not text or not text.strip():
            raise AIError("AI_VALIDATION_FAILED", "Analiz edilecek metin boş olamaz.")
        cleaned = " ".join(text.replace("\x00", " ").split())
        return cleaned[: self.max_chars]

    def clean_messages(self, messages: list[str], max_messages: int) -> list[str]:
        cleaned = [self.clean_text(message) for message in messages if message and message.strip()]
        if not cleaned:
            raise AIError("AI_VALIDATION_FAILED", "Analiz edilecek mesaj bulunamadı.")
        return cleaned[:max_messages]
