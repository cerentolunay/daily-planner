from fastapi import HTTPException


ERROR_MESSAGES = {
    "AI_PROVIDER_NOT_CONFIGURED": "AI sağlayıcısı yapılandırılmamış. Lütfen GEMINI_API_KEY ayarını kontrol et.",
    "AI_QUOTA_EXCEEDED": "Bugünkü AI analiz hakkın doldu.",
    "AI_RATE_LIMITED": "Çok hızlı istek gönderiyorsun. Biraz sonra tekrar dene.",
    "AI_PROVIDER_TIMEOUT": "AI sağlayıcısından zamanında yanıt alınamadı.",
    "AI_INVALID_JSON": "AI geçerli JSON döndürmedi.",
    "AI_VALIDATION_FAILED": "AI sonucu güvenli şekilde doğrulanamadı.",
    "AI_UNKNOWN_ERROR": "AI analizi sırasında beklenmeyen bir sorun oluştu.",
}


class AIError(Exception):
    def __init__(self, code: str, message: str | None = None) -> None:
        self.code = code
        self.message = message or ERROR_MESSAGES.get(code, ERROR_MESSAGES["AI_UNKNOWN_ERROR"])
        super().__init__(self.message)


def ai_http_error(error: AIError, status_code: int = 400) -> HTTPException:
    return HTTPException(status_code=status_code, detail={"error": error.code, "message": error.message})
