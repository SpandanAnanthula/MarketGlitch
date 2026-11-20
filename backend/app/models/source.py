from pydantic import BaseModel
from typing import Optional

class SourceItem(BaseModel):
    source_id: str
    name: str
    publisher: str
    domain: str
    source_type: str # government_portal, trade_database, exchange_filings, tender_board, patent_journal
    refresh_frequency: str # daily, weekly, monthly, continuous
    last_fetched_at: str
    records_count: int
    reliability_score: float = 0.98
    status: str = "healthy" # healthy, periodic, manual_import_fallback
    access_method: str = "API & Official Snapshot"
