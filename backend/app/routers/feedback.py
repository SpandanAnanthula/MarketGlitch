from fastapi import APIRouter, HTTPException
from typing import Optional
from app.services.feedback_engine import FeedbackEngine, FeedbackSubmissionRequest

router = APIRouter(prefix="/api/feedback", tags=["Stage 10: Feedback & Learning"])

@router.post("/submit")
async def submit_feedback(req: FeedbackSubmissionRequest):
    """
    Submits user feedback (useful / not_useful / incorrect) on a strategic signal or event.
    Stores records in the 'feedback' collection and updates workspace relevance weights (§10 & §14).
    """
    try:
        record = FeedbackEngine.submit_feedback(req.dict())
        return {
            "status": "SUCCESS",
            "message": "Feedback recorded and closed-loop ranking weight updated",
            "feedback": record
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/workspace/{workspace_id}")
async def get_workspace_feedback(workspace_id: str):
    """Returns feedback history for a specific workspace."""
    return FeedbackEngine.get_workspace_feedback(workspace_id)

@router.get("/analytics")
async def get_feedback_analytics(workspace_id: Optional[str] = None):
    """Returns precision rates, rating distribution, and active learning adjustments."""
    return FeedbackEngine.get_feedback_analytics(workspace_id)
