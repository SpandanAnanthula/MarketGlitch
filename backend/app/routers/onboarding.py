from fastapi import APIRouter, HTTPException
from app.models.company import OnboardingExtractRequest, OnboardingExtractResponse, CompanyProfile
from app.seeds.seeder import SEED_DATA
from app.database import get_db, db_instance
from datetime import datetime

router = APIRouter(prefix="/api/onboarding", tags=["Onboarding & Company Profiling"])

# Pre-configured tenant workspace profiles for multi-tenant scoping (§10)
WORKSPACE_PROFILES = {
    "ws_electronics_default": {
        "workspace_id": "ws_electronics_default",
        "company_name": "Bharat EMS Solutions Pvt Ltd",
        "website": "https://bharat-ems.in",
        "email": "contact@bharat-ems.in",
        "description": "Indian manufacturer of high-density interconnect SMT PCB assemblies and consumer electronics for Tier-1 suppliers.",
        "sector": "Electronics & Semiconductor Manufacturing",
        "subsector": "Integrated EMS & Surface Mount Assembly",
        "products": [
            "High-Density SMT PCB Assemblies",
            "Automotive ECU Control Modules",
            "Smart Energy Meter Boards",
            "Telecom Line Cards"
        ],
        "regions": ["Karnataka", "Tamil Nadu", "Maharashtra", "NCR"],
        "customer_segments": ["Consumer Durables OEMs", "Automotive Tier-1", "Defense & Aerospace Contractors"],
        "market_share": "18.5%",
        "annual_revenue": "₹1,250 Cr",
        "growth_rate": "12.3% YoY"
    },
    "ws_auto_inverters": {
        "workspace_id": "ws_auto_inverters",
        "company_name": "NexGen EV Inverters & Power Modules Ltd",
        "website": "https://nexgen-inverters.in",
        "email": "strategy@nexgen-inverters.in",
        "description": "Specialized manufacturer of 800V Silicon Carbide (SiC) traction inverter modules, high-voltage gate drivers, and EV motor controllers.",
        "sector": "Electronics & Semiconductor Manufacturing",
        "subsector": "Automotive Power Electronics & Inverters",
        "products": [
            "800V SiC Traction Inverters",
            "Bidirectional On-Board Chargers (OBC)",
            "DC-DC Automotive Converters",
            "Direct Bonded Copper (DBC) Power Stacks"
        ],
        "regions": ["Pune", "Chennai", "Sanand", "Bengaluru"],
        "customer_segments": ["Electric Vehicle OEMs (2W/4W/Bus)", "Charging Infrastructure Providers", "Renewable Solar Inverter Brands"],
        "market_share": "14.2%",
        "annual_revenue": "₹680 Cr",
        "growth_rate": "28.4% YoY"
    },
    "ws_bare_pcb_tech": {
        "workspace_id": "ws_bare_pcb_tech",
        "company_name": "Shakti Multilayer Circuits & PCB Fab",
        "website": "https://shakticircuits.in",
        "email": "procurement@shakticircuits.in",
        "description": "Pioneering domestic fabrication of up to 16-layer High-Density Interconnect (HDI) bare printed circuit boards, Class 3 IPC mil-spec standards.",
        "sector": "Electronics & Semiconductor Manufacturing",
        "subsector": "Bare Multilayer PCB Fabrication",
        "products": [
            "16-Layer Rigid-Flex Bare PCBs",
            "High-Frequency PTFE Laminate Boards",
            "High-Tg FR-4 Automotive Substrates",
            "Impedance-Controlled Backplanes"
        ],
        "regions": ["Gujarat (Sanand)", "Maharashtra (Pune)", "Andhra Pradesh (Sri City)", "Telangana"],
        "customer_segments": ["EMS Assemblers (Captive & Merchant)", "Railways & Kavach Suppliers", "Satellite & Defense Electronics Labs"],
        "market_share": "9.8%",
        "annual_revenue": "₹340 Cr",
        "growth_rate": "19.6% YoY"
    }
}

_active_profile = WORKSPACE_PROFILES["ws_electronics_default"]

@router.post("/extract", response_model=OnboardingExtractResponse)
async def extract_company_profile(req: OnboardingExtractRequest):
    """
    Simulates / performs AI company profile extraction from company name, description, or URL.
    Returns structured draft profile with confidence score.
    """
    name = req.company_name.strip()
    desc = req.description or f"Manufacturer in the {req.sector} sector."
    
    # Sensible intelligent defaults based on sector
    if "electronics" in req.sector.lower() or "semiconductor" in req.sector.lower():
        subsector = "Electronics Manufacturing Services (EMS)"
        products = ["Industrial SMT PCB Assembly", "Automotive Sensor Modules", "Power Management Boards"]
        regions = ["Tamil Nadu", "Karnataka", "Maharashtra", "NCR"]
        segments = ["Automotive Tier-1", "Industrial OEMs", "Smart Infrastructure"]
    else:
        subsector = f"{req.sector} Component Manufacturing"
        products = ["Core Product Line A", "Engineered Subassembly B"]
        regions = ["All India"]
        segments = ["B2B Industrial", "Enterprise Customers"]

    return OnboardingExtractResponse(
        company_name=name,
        website=req.website,
        description=desc,
        sector=req.sector or "Electronics & Semiconductor Manufacturing",
        subsector=subsector,
        suggested_products=products,
        suggested_regions=regions,
        suggested_customer_segments=segments,
        extraction_confidence=0.96
    )

@router.post("/save-profile")
async def save_company_profile(profile: CompanyProfile):
    """Saves the user-confirmed company profile under their workspace_id."""
    global _active_profile
    _active_profile = profile.model_dump()
    
    db = get_db()
    if db_instance.is_connected and db is not None:
        await db.company_profiles.update_one(
            {"workspace_id": profile.workspace_id},
            {"$set": profile.model_dump()},
            upsert=True
        )
    return {"status": "success", "message": "Company profile saved successfully", "profile": _active_profile}

@router.get("/current-profile")
async def get_current_profile(workspace_id: str = "ws_electronics_default"):
    """Fetches the current active company profile for the tenant workspace (§10)."""
    db = get_db()
    if db_instance.is_connected and db is not None:
        found = await db.company_profiles.find_one({"workspace_id": workspace_id})
        if found:
            found.pop("_id", None)
            return found
    if workspace_id in WORKSPACE_PROFILES:
        return WORKSPACE_PROFILES[workspace_id]
    return _active_profile
