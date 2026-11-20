from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CompanyProfile(BaseModel):
    workspace_id: str = "ws_default"
    company_name: str
    website: Optional[str] = None
    description: str
    sector: str = "Electronics & Semiconductor Manufacturing"
    subsector: Optional[str] = "Electronics Manufacturing Services (EMS)"
    products: List[str] = Field(default_factory=list)
    regions: List[str] = Field(default_factory=lambda: ["India", "South Asia"])
    customer_segments: List[str] = Field(default_factory=lambda: ["Automotive Tier-1", "Industrial OEMs", "Consumer Electronics"])
    identifiers: dict = Field(default_factory=dict) # GSTIN, CIN if provided
    profile_status: str = "confirmed" # draft, confirmed
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OnboardingExtractRequest(BaseModel):
    company_name: str
    website: Optional[str] = None
    description: Optional[str] = None
    sector: Optional[str] = "Electronics & Semiconductor Manufacturing"

class OnboardingExtractResponse(BaseModel):
    company_name: str
    website: Optional[str]
    description: str
    sector: str
    subsector: str
    suggested_products: List[str]
    suggested_regions: List[str]
    suggested_customer_segments: List[str]
    extraction_confidence: float = 0.95
