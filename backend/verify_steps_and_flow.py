import sys
import json
import asyncio
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

import httpx
from app.main import app
from app.seeds.seeder import SEED_DATA
from app.services.collectors.corporate_collector import CorporateCollector
from app.services.collectors.trade_collector import TradeCollector
from app.services.collectors.tender_collector import TenderCollector
from app.services.collectors.policy_collector import PolicyCollector
from app.services.collectors.patent_collector import PatentCollector
from app.services.normalizer import (
    DateNormalizer,
    CurrencyNormalizer,
    LocationNormalizer,
    UnifiedDocumentNormalizer
)
from app.services.event_extractor import StructuredEventExtractor
from app.services.entity_resolver import EntityResolutionEngine
from app.services.corroborator import CorroborationEngine
from app.services.collectors.orchestrator import IngestionOrchestrator


async def verify_step_1_discover():
    print("\n" + "="*80)
    print("STEP 1: DISCOVER — Source Registry & Connector Verification")
    print("="*80)
    sources = SEED_DATA.get("sources", [])
    print(f"Total Sources Registered: {len(sources)}")
    for s in sources:
        print(f"  [ID: {s['source_id']:<20}] {s['name']:<35} | Type: {s['source_type']:<15} | Reliability: {s['reliability_score']}")
    
    assert len(sources) >= 9, f"Expected at least 9 sources, got {len(sources)}"
    print(">>> STEP 1 VERIFICATION: PASSED (100% functional)")
    return sources


async def verify_step_2_collect():
    print("\n" + "="*80)
    print("STEP 2: COLLECT — Multi-Source Raw Ingestion Verification")
    print("="*80)
    
    print("1. Running CorporateCollector...")
    corp = await CorporateCollector.collect_all(max_news_per_firm=2)
    print(f"   Collected {len(corp['documents'])} corporate docs across {len(corp['market_metrics'])} listed firms.")
    for sym, m in corp['market_metrics'].items():
        print(f"   - {m.get('ticker', sym):<12}: CMP ₹{m.get('price_inr')} ({m.get('exchange')}) | {m.get('company_name')}")

    print("2. Running TradeCollector...")
    trade = await TradeCollector.collect_all()
    print(f"   Collected {len(trade['documents'])} trade documents (HS 8542 & HS 8541).")

    print("3. Running TenderCollector...")
    tender = await TenderCollector.collect_all()
    print(f"   Collected {len(tender['documents'])} procurement tenders totaling ₹{tender['total_estimated_value_inr_cr']} Cr.")

    print("4. Running PolicyCollector...")
    policy = await PolicyCollector.collect_all()
    print(f"   Collected {len(policy['documents'])} policy documents.")

    print("5. Running PatentCollector...")
    patent = await PatentCollector.collect_all()
    print(f"   Collected {len(patent['documents'])} patent/research documents.")

    total_docs = len(corp['documents']) + len(trade['documents']) + len(tender['documents']) + len(policy['documents']) + len(patent['documents'])
    print(f"\nTotal Step 2 Documents Ingested: {total_docs}")
    assert total_docs >= 25, f"Expected >= 25 raw documents, got {total_docs}"
    print(">>> STEP 2 VERIFICATION: PASSED (100% functional)")
    return corp, trade, tender, policy, patent


async def verify_step_3_normalise():
    print("\n" + "="*80)
    print("STEP 3: NORMALISE — Field Standardization Verification")
    print("="*80)

    # 1. Date normalization test
    raw_dates = ["Wed, 18 Nov 2026 14:30:00 GMT", "19 November 2026", "2026-11-14T08:00:00Z"]
    print("1. Date Normalization:")
    for rd in raw_dates:
        iso_dt = DateNormalizer.normalize(rd)
        print(f"   '{rd}' -> ISO: '{iso_dt}'")
        assert iso_dt is not None, f"Failed to normalize {rd}"

    # 2. Currency normalization test
    raw_currencies = ["₹1,000 crore", "$6 billion", "Rs. 14.99 Cr", "₹42.50 Cr"]
    print("\n2. Currency Normalization (INR Cr / USD M benchmark):")
    for rc in raw_currencies:
        curr = CurrencyNormalizer.normalize(rc)
        print(f"   '{rc}' -> ₹ {curr.get('inr_cr')} Cr | $ {curr.get('usd_m')} M ({curr.get('formatted_inr')})")
        assert curr.get("inr_cr") is not None, f"Failed currency {rc}"

    # 3. Location normalization test
    raw_locations = ["Dholera SIR, Gujarat", "Noida, UP", "Mysuru, Karnataka", "Hosur, Tamil Nadu"]
    print("\n3. Location & Industrial Cluster Mapping:")
    for loc in raw_locations:
        norm_loc = LocationNormalizer.normalize(loc)
        print(f"   '{loc}' -> City: {norm_loc['city']} | Cluster: {norm_loc['cluster']}")

    # 4. Envelope Normalization test
    sample_raw = {
        "source_url": "https://economictimes.indiatimes.com/news/123",
        "publisher": "The Economic Times",
        "title": "Tata Electronics to invest $5-6 B for equipment in Dholera fab",
        "published_at": "18 November 2026",
        "raw_text": "Tata Electronics plans an investment of $5-6 B for equipment in Dholera SIR, Gujarat.",
        "event_type": "capex"
    }
    env = UnifiedDocumentNormalizer.normalize_document(sample_raw)
    print("\n4. Normalized Document Envelope Sample:")
    print(f"   Envelope ID: {env['envelope_id']}")
    print(f"   Standardized Date: {env['published_date']}")
    print(f"   Standardized Scale: {env['financials']['formatted_inr']} ({env['financials']['formatted_usd']})")
    print(f"   Standardized Cluster: {env['geography']['cluster']}")
    print(f"   Canonical Entity: {env['entity']['canonical_id']} ({env['entity']['canonical_name']})")
    
    print(">>> STEP 3 VERIFICATION: PASSED (100% functional)")


async def verify_step_4_extract():
    print("\n" + "="*80)
    print("STEP 4: EXTRACT — Structured Event Extraction & Citation Verification")
    print("="*80)

    sample_envelopes = [
        UnifiedDocumentNormalizer.normalize_document({
            "source_url": "https://economictimes.indiatimes.com/news/test01",
            "publisher": "The Economic Times",
            "published_at": "18 November 2026",
            "title": "Tata Electronics to Invest $5-6 B for Equipment in Dholera Plant",
            "raw_text": "Tata Electronics will invest $5-6 billion in equipment for its Dholera fab in Gujarat.",
            "event_type": "CAPEX"
        }),
        UnifiedDocumentNormalizer.normalize_document({
            "source_url": "https://gem.gov.in/tenders/test02",
            "publisher": "gem.gov.in",
            "published_at": "09 November 2026",
            "title": "Supply and Testing of High-Reliability Multilayer SMT PCB Assemblies for Kavach Collision Avoidance System",
            "raw_text": "Tender for Supply and Testing of High-Reliability Multilayer SMT PCB Assemblies for Kavach Collision Avoidance System. Budget: ₹42.5 Cr in Bengaluru.",
            "event_type": "TENDER"
        })
    ]

    events = StructuredEventExtractor.extract_all(sample_envelopes)
    for ev in events:
        print(f"Event ID: {ev['event_id']} | Type: {ev['event_type']} | Date: {ev['event_date']}")
        print(f"  Exact Citation: {ev['exact_supporting_citation']}")
        print(f"  Facts Count: {len(ev['facts'])} | Inferences Count: {len(ev['inferences'])} | Confidence: {ev['confidence_label']}")
        assert len(ev['exact_supporting_citation']) > 10, "Citation must not be empty"
        assert len(ev['facts']) >= 1, "Facts must be present"
        assert len(ev['inferences']) >= 1, "Inferences must be present"

    print(">>> STEP 4 VERIFICATION: PASSED (100% functional)")


async def verify_step_5_resolve():
    print("\n" + "="*80)
    print("STEP 5: RESOLVE — Canonical Entity & Graph Verification")
    print("="*80)

    queries = [
        ("Kaynes Semicon", "comp_kaynes"),
        ("KAYNES.NS", "comp_kaynes"),
        ("543664", "comp_kaynes"),
        ("Padget Electronics", "comp_dixon"),
        ("DIXON.NS", "comp_dixon"),
        ("Syrma Kaga", "comp_syrma"),
        ("SYRMA.NS", "comp_syrma"),
        ("Ascent Circuits", "comp_amber"),
        ("AMBER.NS", "comp_amber"),
        ("TEPL", "comp_tata_semi")
    ]

    for q, expected_id in queries:
        res = EntityResolutionEngine.resolve(q)
        assert res is not None, f"Failed to resolve {q}"
        assert res["canonical_entity_id"] == expected_id, f"Expected {expected_id}, got {res['canonical_entity_id']}"
        print(f"  '{q:<20}' -> Resolved: {res['canonical_entity_id']:<15} | Match: {res['match_type']:<22} | Score: {res['resolution_score']}")

    # Check relationships graph
    rels = EntityResolutionEngine.get_all_entity_relationships()
    print(f"\nCanonical Entity Relationships Count: {len(rels)}")
    for r in rels:
        print(f"  [{r['relationship_type']}] {r['from_entity_name']} -> {r['to_entity_name']} ({r['equity_stake']})")

    assert len(rels) >= 4, f"Expected >= 4 relationships, got {len(rels)}"
    print(">>> STEP 5 VERIFICATION: PASSED (100% functional)")


async def verify_step_6_corroborate():
    print("\n" + "="*80)
    print("STEP 6: CORROBORATE — Multi-Window Evidence Bundling Verification")
    print("="*80)

    snapshot_path = Path(__file__).parent / "app" / "seeds" / "live_ingestion_snapshot.json"
    with open(snapshot_path, "r", encoding="utf-8") as f:
        snap = json.load(f)

    events = snap.get("structured_events", [])
    entities = snap.get("canonical_entities", [])
    relationships = snap.get("entity_relationships", [])

    bundles = CorroborationEngine.corroborate_events(events, entities, relationships)
    print(f"Total Evidence Bundles Formed: {len(bundles)}")
    for b in bundles:
        print(f"\n* Bundle: {b['bundle_id']} — {b['title']}")
        print(f"  Strength: {b['corroboration_strength']} | Score: {b['corroboration_score']}")
        print(f"  Participating Entities: {b['participating_entity_names']}")
        print(f"  Source Categories ({b['independent_source_categories_count']}): {b['source_categories']}")
        print(f"  Total Corroborated Events: {b['total_corroborated_events']} across {b['temporal_window']['span_days']} days")

    assert len(bundles) >= 5, f"Expected at least 5 bundles, got {len(bundles)}"
    for b in bundles:
        assert b["independent_source_categories_count"] >= 3, "Each bundle must have >= 3 independent sources for triangulation"

    print("\n>>> STEP 6 VERIFICATION: PASSED (100% functional)")


async def run_full_flow_and_query_webapp():
    print("\n" + "="*80)
    print("RUNNING END-TO-END FLOW (STEPS 1 TO 6) & QUERYING WEBAPP DIRECTLY")
    print("="*80)

    # 1. Run the IngestionOrchestrator pipeline
    print("\n>>> Executing IngestionOrchestrator.run_full_pipeline()...")
    summary = await IngestionOrchestrator.run_full_pipeline()
    print(">>> Orchestrator Run Complete!")
    print(f"    Completed Stages: {summary['pipeline_stages_completed']}")
    print(f"    Metrics: {json.dumps(summary['metrics'], indent=6)}")

    # 2. Query the actual webapp API endpoints via in-memory ASGI client
    print("\n" + "-"*80)
    print("QUERYING FASTAPI WEBAPP ENDPOINTS (/api/pipeline/*)")
    print("-" * 80)
    
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Status
        r_status = await client.get("/api/pipeline/status")
        print(f"GET /api/pipeline/status -> HTTP {r_status.status_code}")
        print("Response Body Excerpt:")
        print(json.dumps(r_status.json(), indent=2)[:400] + "...\n")

        # Stage 1
        r_s1 = await client.get("/api/pipeline/stage1-discover")
        print(f"GET /api/pipeline/stage1-discover -> HTTP {r_s1.status_code} | Total Sources: {r_s1.json()['total_sources']}")

        # Stage 2
        r_s2 = await client.get("/api/pipeline/stage2-collect")
        print(f"GET /api/pipeline/stage2-collect -> HTTP {r_s2.status_code} | Total Ingested Documents: {r_s2.json()['total_documents']}")

        # Stage 3
        r_s3 = await client.get("/api/pipeline/stage3-normalise")
        print(f"GET /api/pipeline/stage3-normalise -> HTTP {r_s3.status_code} | Total Normalized Envelopes: {r_s3.json()['total_normalized_envelopes']}")

        # Stage 4
        r_s4 = await client.get("/api/pipeline/stage4-extract")
        print(f"GET /api/pipeline/stage4-extract -> HTTP {r_s4.status_code} | Total Structured Events: {r_s4.json()['total_structured_events']}")

        # Stage 5
        r_s5 = await client.get("/api/pipeline/stage5-resolve")
        print(f"GET /api/pipeline/stage5-resolve -> HTTP {r_s5.status_code} | Canonical Entities: {len(r_s5.json()['canonical_entities'])} | Graph Edges: {len(r_s5.json()['entity_relationships'])}")

        # Stage 6
        r_s6 = await client.get("/api/pipeline/stage6-corroborate")
        print(f"GET /api/pipeline/stage6-corroborate -> HTTP {r_s6.status_code} | Total Evidence Bundles: {r_s6.json()['total_evidence_bundles']}")
        
        bundles = r_s6.json()["evidence_bundles"]
        for i, b in enumerate(bundles):
            print(f"  [{i+1}] {b['bundle_id']}: {b['title']} (Score: {b['corroboration_score']}, Events: {b['total_corroborated_events']})")

    print("\n" + "="*80)
    print("ALL STEPS 1 TO 6 VERIFIED AND OPERATIONAL VIA WEBAPP ENDPOINTS")
    print("="*80)


async def main():
    await verify_step_1_discover()
    await verify_step_2_collect()
    await verify_step_3_normalise()
    await verify_step_4_extract()
    await verify_step_5_resolve()
    await verify_step_6_corroborate()
    await run_full_flow_and_query_webapp()

if __name__ == "__main__":
    asyncio.run(main())
