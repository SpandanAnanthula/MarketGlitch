from fastapi import APIRouter, Query
from typing import Optional
from app.services.delivery_service import MultiTenantDeliveryService

router = APIRouter(prefix="/api/deliver", tags=["Stage 9: Tenant Delivery & Export"])

@router.get("/workspaces")
async def list_workspaces():
    """Returns all registered customer workspaces."""
    return MultiTenantDeliveryService.list_workspaces()

@router.get("/workspaces/{workspace_id}")
async def get_workspace_profile(workspace_id: str):
    """Returns workspace metadata and subscription tier."""
    ws = MultiTenantDeliveryService.get_workspace(workspace_id)
    if not ws:
        return {"error": "Workspace not found", "workspace_id": workspace_id}
    return ws

@router.get("/feed")
@router.get("/{workspace_id}/feed")
async def get_tenant_feed(
    workspace_id: str = "ws_electronics_default",
    timeline: Optional[str] = Query(None, description="Timeline filter: present_week | past_week | all")
):
    """
    Delivers a personalized intelligence feed strictly scoped by 'workspace_id' and optional 'timeline'.
    Filters events and Level 3 signals based on the tenant's tracked competitor watchlist and temporal cutoff.
    """
    return MultiTenantDeliveryService.deliver_tenant_feed(workspace_id, timeline_filter=timeline)

@router.get("/alerts")
@router.get("/{workspace_id}/alerts")
async def get_tenant_alerts(workspace_id: str = "ws_electronics_default"):
    """
    Returns active alerts and high-severity notification cards scoped to the workspace.
    """
    return MultiTenantDeliveryService.deliver_tenant_alerts(workspace_id)

@router.get("/export")
async def export_executive_briefing(
    workspace_id: str = Query("ws_electronics_default", description="Tenant workspace ID"),
    format_type: str = Query("json", description="Export format: json or csv")
):
    """
    Generates an executive intelligence briefing report for management export.
    """
    return MultiTenantDeliveryService.export_executive_report(workspace_id, format_type)
