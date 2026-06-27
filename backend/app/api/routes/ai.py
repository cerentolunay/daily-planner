from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..deps import get_db
from ...services.ai.errors import AIError, ai_http_error
from ...services.ai.gateway import AIGateway
from ...services.ai.services.usage_service import usage_summary
from ...services.ai.types import AIAnalyzeTextRequest, AIAnalyzeThreadRequest, AIUsageSummary, TaskExtractionResult

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/analyze/text", response_model=TaskExtractionResult)
async def analyze_text(payload: AIAnalyzeTextRequest, db: Session = Depends(get_db)):
    try:
        return await AIGateway(db).analyze_text(payload.text, payload.user_id)
    except AIError as error:
        raise ai_http_error(error)


@router.post("/analyze/thread", response_model=TaskExtractionResult)
async def analyze_thread(payload: AIAnalyzeThreadRequest, db: Session = Depends(get_db)):
    try:
        return await AIGateway(db).analyze_thread(payload.messages, payload.user_id)
    except AIError as error:
        raise ai_http_error(error)


@router.get("/usage/summary", response_model=AIUsageSummary)
def read_usage_summary(db: Session = Depends(get_db)):
    return usage_summary(db)
