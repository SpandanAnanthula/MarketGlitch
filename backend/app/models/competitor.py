from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CompetitorCandidate(BaseModel):
    entity_id: str
    company_name: str
    subsector: str
    headquarters: str
    approx_revenue_inr_cr: Optional[str] = None
    products: List[str]
    relevance_score: float = Field(ge=0.0, le=1.0)
    reason_code: str
    match_dimensions: List[str] = Field(default_factory=list) # e.g. ["Product Overlap", "Geographic Adjacency", "Target OEM Customers"]

class WatchlistActionRequest(BaseModel):
    workspace_id: str = "ws_default"
    company_entity_id: str
    company_name: str
    relationship_type: str = "competitor" # competitor, partner, supplier, substitute
    action: str = "follow" # follow, dismiss, update_relationship

class CompetitorEvent(BaseModel):
    event_id: str
    entity_id: str
    entity_name: str
    event_type: str # capex, expansion, hiring, regulatory, patent, financial, partnership
    title: str
    summary: str
    event_date: str # YYYY-MM-DD
    source_name: str # e.g. "BSE Corporate Announcements", "GeM Tender Notice", "Company IR"
    source_url: str
    confidence: str = "High" # Low, Medium, High
