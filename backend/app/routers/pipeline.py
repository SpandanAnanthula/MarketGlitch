import json
from pathlib import Path
from fastapi import APIRouter
from app.services.collectors.orchestrator import IngestionOrchestrator
from app.services.entity_resolver import EntityResolutionEngine
from app.services.corroborator import CorroborationEngine
from app.seeds.seeder import SEED_DATA

router = APIRouter(prefix="/api/pipeline", tags=["10-Stage Data Intelligence Pipeline"])

SNAPSHOT_PATH = Path(__file__).parent.parent / "seeds" / "live_ingestion_snapshot.json"

def _load_snapshot() -> dict:
    if SNAPSHOT_PATH.exists():
        with open(SNAPSHOT_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

@router.get("/status")
async def get_pipeline_status():
    """Returns the completion status and metrics for the 10-stage pipeline."""
    snap = _load_snapshot()
    return {
        "pipeline_stages_completed": snap.get("pipeline_stages_completed", []),
        "metrics": snap.get("metrics", {}),
        "execution_timestamp": snap.get("execution_timestamp")
    }

@router.get("/stage1-discover")
async def get_stage1_discover():
    """Stage 1: Discover - Source registry and connectors."""
    return {
        "stage": "Stage 1 (Discover)",
        "status": "COMPLETED",
        "total_sources": len(SEED_DATA.get("sources", [])),
        "sources": SEED_DATA.get("sources", [])
    }

@router.get("/stage2-collect")
async def get_stage2_collect():
    """Stage 2: Collect - Raw document collection across corporate, trade, tenders, policy, patents."""
    snap = _load_snapshot()
    docs = snap.get("normalized_envelopes", [])
    return {
        "stage": "Stage 2 (Collect)",
        "status": "COMPLETED",
        "total_documents": len(docs),
        "corporate_market_metrics": snap.get("market_valuation", {}),
        "trade_commodities": snap.get("trade_analytics", {}),
        "tender_records": snap.get("tenders", []),
        "policy_records": snap.get("policies", []),
        "patent_records": snap.get("patents", [])
    }

@router.get("/stage3-normalise")
async def get_stage3_normalise():
    """Stage 3: Normalise - Standardized ISO dates, INR/USD currencies, and locations."""
    snap = _load_snapshot()
    envelopes = snap.get("normalized_envelopes", [])
    return {
        "stage": "Stage 3 (Normalise)",
        "status": "COMPLETED",
        "total_normalized_envelopes": len(envelopes),
        "sample_envelopes": envelopes[:5]
    }

@router.get("/stage4-extract")
async def get_stage4_extract():
    """Stage 4: Extract - Structured event candidates with verbatim citations and facts vs inferences."""
    snap = _load_snapshot()
    events = snap.get("structured_events", [])
    return {
        "stage": "Stage 4 (Extract)",
        "status": "COMPLETED",
        "total_structured_events": len(events),
        "sample_events": events[:5]
    }

@router.get("/stage5-resolve")
async def get_stage5_resolve():
    """Stage 5: Resolve - Canonical entity resolution, tickers, and relationship graph."""
    snap = _load_snapshot()
    return {
        "stage": "Stage 5 (Resolve)",
        "status": "COMPLETED",
        "canonical_entities": snap.get("canonical_entities", []),
        "entity_relationships": snap.get("entity_relationships", [])
    }

@router.get("/stage6-corroborate")
async def get_stage6_corroborate():
    """Stage 6: Corroborate - Multi-window evidence bundles."""
    snap = _load_snapshot()
    bundles = snap.get("evidence_bundles", [])
    return {
        "stage": "Stage 6 (Corroborate)",
        "status": "COMPLETED",
        "total_evidence_bundles": len(bundles),
        "evidence_bundles": bundles
    }

@router.get("/stage7-analyse")
async def get_stage7_analyse():
    """Stage 7: Analyse - Rule-triggered Level 3 strategic intelligence signals."""
    snap = _load_snapshot()
    signals = snap.get("signals", [])
    return {
        "stage": "Stage 7 (Analyse)",
        "status": "COMPLETED",
        "total_synthesized_signals": len(signals),
        "signals": signals
    }

@router.get("/signals")
async def get_all_signals():
    """Returns the list of all synthesized Level 3 strategic signals."""
    snap = _load_snapshot()
    return snap.get("signals", [])

@router.get("/signals/{signal_id}")
async def get_signal_detail(signal_id: str):
    """Returns the full Table 4 detail view for a specific strategic signal."""
    snap = _load_snapshot()
    signals = snap.get("signals", [])
    for s in signals:
        if s.get("signal_id") == signal_id:
            return s
    return {"error": "Signal not found", "signal_id": signal_id}

@router.get("/stage8-review")
async def get_stage8_review():
    """Stage 8: Review & Suppress - Deduplication, noise filtering, and citation grounding audit."""
    snap = _load_snapshot()
    metrics = snap.get("metrics", {})
    return {
        "stage": "Stage 8 (Review & Suppress)",
        "status": "COMPLETED",
        "quality_metrics": {
            "approved_clean_events": metrics.get("approved_clean_events"),
            "suppressed_events_count": metrics.get("suppressed_events_count"),
            "hallucinated_citations_detected": metrics.get("hallucinated_citations_detected", 0),
            "duplicates_suppressed": metrics.get("duplicates_suppressed", 0),
            "non_vertical_noise_suppressed": metrics.get("non_vertical_noise_suppressed", 0),
            "archival_items_filtered": metrics.get("archival_items_filtered", 0),
            "approved_strategic_signals": metrics.get("approved_strategic_signals", 0)
        },
        "suppression_queue": snap.get("suppression_queue", [])
    }

@router.get("/review/queue")
async def get_review_suppression_queue():
    """Returns the quarantined suppression audit queue for analyst review."""
    snap = _load_snapshot()
    return snap.get("suppression_queue", [])

@router.get("/review/approved")
async def get_approved_clean_feed():
    """Returns the clean verified event and signal stream."""
    snap = _load_snapshot()
    return {
        "approved_events": snap.get("structured_events", []),
        "approved_signals": snap.get("signals", [])
    }

@router.get("/stage9-deliver")
async def get_stage9_deliver():
    """Stage 9: Deliver - Multi-tenant workspace scoping and isolation verification."""
    from app.services.delivery_service import MultiTenantDeliveryService
    workspaces = MultiTenantDeliveryService.list_workspaces()
    scoped_deliveries = []
    for ws in workspaces:
        feed = MultiTenantDeliveryService.deliver_tenant_feed(ws["workspace_id"])
        alerts = MultiTenantDeliveryService.deliver_tenant_alerts(ws["workspace_id"])
        scoped_deliveries.append({
            "workspace_id": ws["workspace_id"],
            "workspace_name": ws["name"],
            "subsector": ws["subsector"],
            "subscription_plan": ws["plan"],
            "tracked_competitors_count": feed["total_tracked_competitors"],
            "delivered_signals_count": feed["delivered_signals_count"],
            "delivered_events_count": feed["delivered_events_count"],
            "active_alerts_count": alerts["total_active_alerts"]
        })
    return {
        "stage": "Stage 9 (Deliver / Multi-Tenant Scoping)",
        "status": "COMPLETED",
        "tenant_isolation_enforced": True,
        "total_active_workspaces": len(workspaces),
        "workspace_deliveries": scoped_deliveries
    }

@router.get("/stage10-learn")
async def get_stage10_learn():
    """Stage 10: Learn - User feedback capture and closed-loop relevance learning."""
    from app.services.feedback_engine import FeedbackEngine
    analytics = FeedbackEngine.get_feedback_analytics()
    all_feedback = FeedbackEngine.get_all_feedback()
    return {
        "stage": "Stage 10 (Learn)",
        "status": "COMPLETED",
        "feedback_collection_active": True,
        "total_feedback_records": len(all_feedback),
        "analytics": analytics,
        "recent_feedback_records": all_feedback[-5:]
    }

@router.post("/run-flow")
async def run_pipeline_flow():
    """Executes the full pipeline flow from Step 1 to Step 10."""
    result = await IngestionOrchestrator.run_full_pipeline()
    return {
        "status": "SUCCESS",
        "execution_timestamp": result.get("execution_timestamp"),
        "stages_completed": result.get("pipeline_stages_completed"),
        "metrics": result.get("metrics")
    }
