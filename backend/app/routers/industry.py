from fastapi import APIRouter
from typing import List
from app.models.industry import TradeMetric, TenderItem, PolicyItem, PatentItem, IndustryOverview
from app.seeds.seeder import SEED_DATA
from app.services.ingestion_manager import IngestionManager

router = APIRouter(prefix="/api/industry", tags=["Industry Intelligence"])

@router.get("/verticals")
async def get_industry_verticals():
    """Returns the 5 supported launch verticals."""
    return [
        {
            "id": "electronics_semiconductors",
            "name": "Electronics & Semiconductor Manufacturing",
            "status": "active_demo",
            "description": "Cross-connects trade flows, GeM/CPPP tenders, IP India patents, and BSE filings."
        },
        {
            "id": "pharmaceuticals_healthcare",
            "name": "Pharmaceuticals & Healthcare",
            "status": "template_ready",
            "description": "CDSCO regulatory approvals, formulation trade, and clinical trial registries."
        },
        {
            "id": "renewable_energy",
            "name": "Renewable Energy (Solar & Wind)",
            "status": "template_ready",
            "description": "MNRE statistics, SECI auctions, and equipment supply chains."
        },
        {
            "id": "automotive_ev",
            "name": "Automotive & Electric Vehicles",
            "status": "template_ready",
            "description": "Vahan registrations, charging infrastructure tenders, and component tariffs."
        },
        {
            "id": "infrastructure_construction",
            "name": "Infrastructure & Construction",
            "status": "template_ready",
            "description": "CPPP mega-tenders, MoSPI project tracking, and material demand indicators."
        }
    ]

@router.get("/overview", response_model=IndustryOverview)
async def get_industry_overview(vertical: str = "electronics_semiconductors"):
    """Returns the macro overview for the selected vertical."""
    return SEED_DATA.get("industry", {})

@router.get("/trade", response_model=TradeMetric)
async def get_trade_analytics(hs_code: str = "8542"):
    """Returns official Commerce Analytics import/export time series."""
    return SEED_DATA.get("trade_analytics", {})

@router.get("/tenders", response_model=List[TenderItem])
async def get_public_tenders():
    """Returns active GeM and CPPP procurement bids with subsector tagging."""
    return SEED_DATA.get("tenders", [])

@router.get("/policy", response_model=List[PolicyItem])
async def get_policy_updates():
    """Returns Ministry and regulatory policy alerts with impact analysis."""
    return SEED_DATA.get("policies", [])

@router.get("/patents", response_model=List[PatentItem])
async def get_patent_publications():
    """Returns published IP India patent journal notices."""
    return SEED_DATA.get("patents", [])

@router.get("/live-research")
async def get_live_research_and_pib():
    """Returns live-scraped OpenAlex research and PIB cabinet alerts."""
    return await IngestionManager.get_live_policy_and_research()
