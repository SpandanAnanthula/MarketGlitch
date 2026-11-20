import re
from typing import Dict, Any, List, Optional
from datetime import datetime

class StructuredEventExtractor:
    """
    Stage 4 (Extract): Extracts structured event candidates with exact supporting
    text citations, fact-vs-inference separation, and entity links (§9 & §12).
    """

    PRODUCT_KEYWORD_PATTERNS = [
        (r'\b(?:smt|surface mount|pcb|pcba|bare pcb|multilayer)\b', "SMT & High-Density PCB Assembly"),
        (r'\b(?:osat|semiconductor packaging|bga|micro-bga|qfn|flip-chip)\b', "OSAT Semiconductor Packaging"),
        (r'\b(?:sic|silicon carbide|gan|gallium nitride|power module|inverter)\b', "SiC/GaN Power Electronics"),
        (r'\b(?:silicon fab|fab|28nm|40nm|wafer)\b', "Silicon Wafer Fabrication"),
        (r'\b(?:kavach|railways|collision avoidance)\b', "Rail Safety & Kavach Electronics"),
        (r'\b(?:aoi|optical inspection|flying probe|tester|testing bench)\b', "Inspection & Quality Testing Equipment"),
        (r'\b(?:ecu|sensor|iot module|automotive module)\b', "Automotive ECU & Sensor Modules"),
        (r'\b(?:pli|subsidy|specs|incentive|cashback)\b', "Industrial PLI / Capex Subsidy")
    ]

    @classmethod
    def extract_products(cls, text: str) -> List[str]:
        found = set()
        lower = text.lower()
        for pattern, label in cls.PRODUCT_KEYWORD_PATTERNS:
            if re.search(pattern, lower):
                found.add(label)
        return list(found) if found else ["General Electronics Component"]

    @classmethod
    def extract_event(cls, normalized_envelope: dict) -> dict:
        title = normalized_envelope.get("title", "")
        publisher = normalized_envelope.get("publisher", "Official Record")
        event_date = normalized_envelope.get("published_date", datetime.utcnow().strftime("%Y-%m-%d"))
        financials = normalized_envelope.get("financials")
        geography = normalized_envelope.get("geography", {})
        entity = normalized_envelope.get("entity", {})
        raw_event_type = normalized_envelope.get("event_type", "general_industry").upper()

        # Map to 6 core canonical categories + trade/tender
        if raw_event_type == "POLICY":
            canonical_event_type = "REGULATORY"
        elif raw_event_type in ["CAPEX", "EXPANSION", "HIRING", "PARTNERSHIP", "REGULATORY", "PATENT", "TENDER", "TRADE"]:
            canonical_event_type = raw_event_type
        elif "invest" in title.lower() or "capex" in title.lower() or "fund" in title.lower():
            canonical_event_type = "CAPEX"
        elif "partner" in title.lower() or "jv" in title.lower():
            canonical_event_type = "PARTNERSHIP"
        elif "hire" in title.lower() or "talent" in title.lower():
            canonical_event_type = "HIRING"
        elif "patent" in title.lower():
            canonical_event_type = "PATENT"
        else:
            canonical_event_type = "EXPANSION"

        # 1. Exact Supporting Text Citation (Verbatim quotation from the source)
        exact_citation = f"\"{title}\" — Published by {publisher} on {event_date}."

        # 2. Extracted Products and Technologies
        products_detected = cls.extract_products(title + " " + str(normalized_envelope.get("facts", [])))

        # 3. Facts vs. Inferences Separation (§9 Stage 4 & §12 Guardrails)
        facts = [
            f"Event Publisher: {publisher} (Source: {normalized_envelope.get('url', 'N/A')})",
            f"Event Date: {event_date}",
            f"Subject Entity: {entity.get('canonical_name', 'Indian Industry Macro')}",
            f"Primary Citation: {title}"
        ]

        if financials:
            facts.append(f"Standardized Value: {financials['formatted_inr']} ({financials['formatted_usd']})")

        if geography.get("cluster") and geography.get("cluster") != "National Industrial Scope":
            facts.append(f"Operating Cluster: {geography['city']} ({geography['cluster']})")

        # Inferences strictly delineated from facts
        inferences = []
        if canonical_event_type == "CAPEX":
            inferences.append("Indicates physical plant capacity addition or machinery procurement; monitor subsequent hiring and testing equipment tenders.")
        elif canonical_event_type == "PARTNERSHIP":
            inferences.append("Indicates strategic technology access or supply chain localization; potential shift in component sourcing.")
        elif canonical_event_type == "HIRING":
            inferences.append("Specialized talent recruitment signals impending line commercialization or facility commissioning.")
        elif canonical_event_type == "TENDER":
            inferences.append("Public procurement opportunity; indicates active demand from state or defense buyers.")
        elif canonical_event_type == "REGULATORY":
            inferences.append("Policy subsidy reduces domestic capex cost; strengthens price competitiveness against imports.")
        elif canonical_event_type == "TRADE":
            inferences.append("Macro customs movement shows domestic demand trajectory and import dependence shifts.")

        # 4. Confidence scoring
        confidence_score = 0.95 if (financials or entity.get("resolved")) else 0.85
        confidence_label = "High" if confidence_score >= 0.90 else "Medium"

        return {
            "event_id": f"evt_ext_{normalized_envelope.get('envelope_id', '0')[-8:]}",
            "source_document_id": normalized_envelope.get("envelope_id"),
            "source_url": normalized_envelope.get("url"),
            "publisher": publisher,
            "entity": entity,
            "event_type": canonical_event_type,
            "event_date": event_date,
            "exact_supporting_citation": exact_citation,
            "quantities_and_scale": financials,
            "products_detected": products_detected,
            "geography": geography,
            "facts": facts,
            "inferences": inferences,
            "extraction_confidence": confidence_score,
            "confidence_label": confidence_label
        }

    @classmethod
    def extract_all(cls, normalized_envelopes: List[dict]) -> List[dict]:
        return [cls.extract_event(env) for env in normalized_envelopes]
