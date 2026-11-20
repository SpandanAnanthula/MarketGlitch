from pydantic import BaseModel, Field
from typing import List, Optional

class TradeDataPoint(BaseModel):
    month: str # e.g. "2026-01", "2026-02"
    import_value_usd_m: float
    export_value_usd_m: float
    top_origin: str

class TradeMetric(BaseModel):
    hs_code: str # e.g. "8542"
    commodity_title: str
    annual_import_usd_b: float
    annual_yoy_growth_percent: float
    key_supplying_nations: List[str]
    monthly_trend: List[TradeDataPoint]

class TenderItem(BaseModel):
    tender_id: str
    title: str
    issuing_authority: str
    portal: str = "GeM" # GeM, CPPP
    approx_value_inr_cr: float
    published_date: str
    closing_date: str
    location: str
    relevant_subsectors: List[str]
    source_url: str

class PolicyItem(BaseModel):
    policy_id: str
    title: str
    authority: str # MeitY, DPIIT, MoCI
    summary: str
    date_notified: str
    impact_level: str = "High" # High, Medium, Low
    relevant_subsectors: List[str]
    source_url: str

class PatentItem(BaseModel):
    patent_id: str
    title: str
    applicant: str
    publication_date: str
    ipc_code: str
    summary: str
    journal_issue: str
    source_url: str

class IndustryOverview(BaseModel):
    industry_id: str
    name: str
    market_size_inr_cr: str
    cagr_growth: str
    key_drivers: List[str]
    active_competitors_tracked: int
