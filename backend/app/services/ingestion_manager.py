import logging
from datetime import datetime
from app.services.scrapers.google_news_scraper import fetch_company_news
from app.services.scrapers.yahoo_finance_scraper import fetch_competitor_market_data
from app.services.scrapers.openalex_scraper import fetch_semiconductor_research
from app.services.scrapers.pib_scraper import fetch_pib_policy_alerts
from app.services.entity_resolver import resolve_entity_from_text, CANONICAL_ENTITIES
from app.seeds.seeder import SEED_DATA
from app.database import get_db, db_instance

logger = logging.getLogger("uvicorn")

class IngestionManager:
    """
    Implements the 10-Stage Data & Intelligence Pipeline (§9)
    Discovers, collects, normalizes, extracts, and resolves multi-source events.
    """

    @classmethod
    async def get_live_competitor_timeline(cls) -> list[dict]:
        """
        Combines verified canonical seed events with live-scraped events from Google News RSS.
        Deduplicates by URL and normalizes into strict CompetitorEvent schema.
        """
        # Start with verified seed events
        canonical_events = list(SEED_DATA.get("competitor_events", []))
        seen_urls = {e["source_url"] for e in canonical_events}
        
        # Ingest live feeds for priority competitors
        priority_companies = [
            ("Dixon Technologies", "comp_dixon"),
            ("Kaynes Technology", "comp_kaynes"),
            ("Syrma SGS", "comp_syrma"),
            ("Amber Enterprises", "comp_amber"),
            ("Tata Electronics", "comp_tata_semi")
        ]

        live_events = []
        for company_query, expected_id in priority_companies[:3]: # Scrape top 3 to keep response snappy
            raw_items = await fetch_company_news(company_query, max_items=2)
            for item in raw_items:
                url = item["source_url"]
                if url in seen_urls:
                    continue
                seen_urls.add(url)
                
                # Resolve entity
                resolved = resolve_entity_from_text(item["raw_title"])
                entity_id = resolved["entity_id"] if resolved else expected_id
                entity_name = resolved["canonical_name"] if resolved else CANONICAL_ENTITIES[expected_id]["canonical_name"]

                event_id = f"evt_live_{abs(hash(url)) % 1000000:06d}"
                live_event = {
                    "event_id": event_id,
                    "entity_id": entity_id,
                    "entity_name": entity_name,
                    "event_type": item["event_type"],
                    "title": item["raw_title"],
                    "summary": f"Discovered from {item['source_name']} covering recent industrial and manufacturing developments.",
                    "event_date": item["published_date"],
                    "source_name": f"{item['source_name']} (Live Web Feed)",
                    "source_url": url,
                    "confidence": "High" if item["event_type"] in ["capex", "expansion", "partnership"] else "Medium"
                }
                live_events.append(live_event)

        # Merge and sort chronologically descending
        combined = live_events + canonical_events
        combined.sort(key=lambda x: x["event_date"], reverse=True)
        return combined

    @classmethod
    async def get_enriched_competitor_candidates(cls) -> list[dict]:
        """
        Enriches competitor candidate cards with live NSE quote metrics from Yahoo Finance.
        """
        candidates = list(SEED_DATA.get("competitor_candidates", []))
        for cand in candidates:
            market_data = await fetch_competitor_market_data(cand["entity_id"])
            if market_data and market_data.get("regular_price"):
                cand["live_stock_price_inr"] = market_data["regular_price"]
                cand["exchange"] = market_data["exchange"]
        return candidates

    @classmethod
    async def get_live_policy_and_research(cls) -> dict:
        """
        Fetches live PIB alerts and OpenAlex research papers to complement MeitY and IP India gazettes.
        """
        pib_alerts = await fetch_pib_policy_alerts("semiconductors OR electronics", max_items=3)
        openalex_papers = await fetch_semiconductor_research("semiconductor packaging India", per_page=3)
        return {
            "pib_alerts": pib_alerts,
            "openalex_papers": openalex_papers
        }
