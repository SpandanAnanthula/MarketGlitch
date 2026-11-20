from fastapi import APIRouter
from typing import List
from app.models.competitor import CompetitorCandidate, WatchlistActionRequest, CompetitorEvent
from app.services.ingestion_manager import IngestionManager
from app.database import get_db, db_instance

router = APIRouter(prefix="/api/competitors", tags=["Competitor Intelligence"])

# In-memory watchlist store for demo session
_watchlist: dict[str, dict] = {
    "comp_dixon": {"entity_id": "comp_dixon", "company_name": "Dixon Technologies (India) Ltd", "relationship_type": "competitor", "status": "active"},
    "comp_kaynes": {"entity_id": "comp_kaynes", "company_name": "Kaynes Technology India Ltd", "relationship_type": "competitor", "status": "active"}
}

@router.get("/discover")
async def discover_competitors(sector: str = "Electronics & Semiconductor Manufacturing"):
    """
    Returns AI-recommended competitor candidates with Reason Codes, Match Dimensions,
    and live NSE market quotes.
    """
    return await IngestionManager.get_enriched_competitor_candidates()

@router.get("/watchlist")
async def get_watchlist(workspace_id: str = "ws_default"):
    """Returns the current tracked watchlist for the workspace."""
    db = get_db()
    if db_instance.is_connected and db is not None:
        cursor = db.competitor_watchlists.find({"workspace_id": workspace_id, "status": "active"})
        items = await cursor.to_list(length=100)
        for item in items:
            item.pop("_id", None)
        if items:
            return items
    return list(_watchlist.values())

@router.post("/watchlist/action")
async def watchlist_action(req: WatchlistActionRequest):
    """Adds, updates, or dismisses a competitor from the watchlist."""
    db = get_db()
    
    if req.action == "follow":
        _watchlist[req.company_entity_id] = {
            "entity_id": req.company_entity_id,
            "company_name": req.company_name,
            "relationship_type": req.relationship_type,
            "status": "active"
        }
        if db_instance.is_connected and db is not None:
            await db.competitor_watchlists.update_one(
                {"workspace_id": req.workspace_id, "company_entity_id": req.company_entity_id},
                {"$set": {"company_name": req.company_name, "relationship_type": req.relationship_type, "status": "active"}},
                upsert=True
            )
    elif req.action == "dismiss":
        _watchlist.pop(req.company_entity_id, None)
        if db_instance.is_connected and db is not None:
            await db.competitor_watchlists.update_one(
                {"workspace_id": req.workspace_id, "company_entity_id": req.company_entity_id},
                {"$set": {"status": "dismissed"}}
            )
            
    return {"status": "success", "watchlist": list(_watchlist.values())}

@router.get("/timeline", response_model=List[CompetitorEvent])
async def get_competitor_timeline():
    """
    Returns the multi-source verified chronological event feed.
    Merges live Google News/RSS scraper events with canonical BSE/PIB disclosures.
    Every event has a clickable source citation and confidence level.
    """
    return await IngestionManager.get_live_competitor_timeline()
