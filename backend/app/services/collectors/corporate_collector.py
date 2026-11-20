import hashlib
from datetime import datetime
from app.services.scrapers.google_news_scraper import fetch_company_news
from app.services.scrapers.yahoo_finance_scraper import fetch_competitor_market_data
from app.services.entity_resolver import resolve_entity_from_text, CANONICAL_ENTITIES

class CorporateCollector:
    """
    Stage 2 (Collect): Ingests corporate disclosures, business press releases,
    and market metrics across target Indian electronics & semiconductor firms.
    """

    TARGET_COMPANIES = [
        {"entity_id": "comp_kaynes", "query": "Kaynes Technology", "name": "Kaynes Technology India Ltd"},
        {"entity_id": "comp_dixon", "query": "Dixon Technologies", "name": "Dixon Technologies (India) Ltd"},
        {"entity_id": "comp_syrma", "query": "Syrma SGS Technology", "name": "Syrma SGS Technology Ltd"},
        {"entity_id": "comp_amber", "query": "Amber Enterprises Ascent Circuits", "name": "Amber Enterprises (Ascent Circuits)"},
        {"entity_id": "comp_tata_semi", "query": "Tata Electronics semiconductor", "name": "Tata Electronics Pvt Ltd"}
    ]

    @classmethod
    async def collect_all(cls, max_news_per_firm: int = 4) -> dict:
        collected_documents = []
        structured_events = []
        market_metrics = {}

        for company in cls.TARGET_COMPANIES:
            entity_id = company["entity_id"]
            name = company["name"]
            query = company["query"]

            # 1. Collect real-time news & corporate actions
            raw_items = await fetch_company_news(query, max_items=max_news_per_firm)
            for it in raw_items:
                url = it["source_url"]
                content_hash = hashlib.sha256(url.encode()).hexdigest()[:16]
                doc_id = f"doc_corp_{content_hash}"
                event_id = f"evt_{content_hash}"

                # Raw Source Document Envelope (§10: source_documents)
                doc_envelope = {
                    "document_id": doc_id,
                    "source_id": "src_business_press_rss",
                    "publisher": it["source_name"],
                    "url": url,
                    "title": it["raw_title"],
                    "published_at": it["published_date"],
                    "fetched_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
                    "content_hash": content_hash,
                    "text_extract": it["raw_title"],
                    "event_type": it["event_type"],
                    "licence_metadata": "Public news metadata citation",
                    "entity_id": entity_id,
                    "entity_name": name
                }
                collected_documents.append(doc_envelope)

                # Normalized Event Envelope (§10: events)
                resolved = resolve_entity_from_text(it["raw_title"])
                resolved_id = resolved["entity_id"] if resolved else entity_id
                resolved_name = resolved["canonical_name"] if resolved else name

                event_envelope = {
                    "event_id": event_id,
                    "source_document_id": doc_id,
                    "entity_id": resolved_id,
                    "entity_name": resolved_name,
                    "event_type": it["event_type"],
                    "title": it["raw_title"],
                    "event_date": it["published_date"],
                    "source_name": it["source_name"],
                    "source_url": url,
                    "extraction_confidence": 0.95 if it["event_type"] in ["capex", "expansion", "partnership"] else 0.85,
                    "confidence_label": "High" if it["event_type"] in ["capex", "expansion", "partnership"] else "Medium",
                    "evidence_snippet": f"Observed via {it['source_name']}: '{it['raw_title']}'"
                }
                structured_events.append(event_envelope)

            # 2. Collect financial/valuation metrics
            quote = await fetch_competitor_market_data(entity_id)
            if quote:
                market_metrics[entity_id] = {
                    "company_name": name,
                    "ticker": quote.get("ticker"),
                    "price_inr": quote.get("regular_price"),
                    "exchange": quote.get("exchange"),
                    "currency": quote.get("currency")
                }

        return {
            "total_documents_collected": len(collected_documents),
            "documents": collected_documents,
            "events": structured_events,
            "market_metrics": market_metrics
        }
