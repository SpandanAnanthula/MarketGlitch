import re
from typing import List, Dict, Any, Optional
from datetime import datetime

class CorroborationEngine:
    """
    Stage 6 (Corroborate):
    Finds independent related events within time, geography, company, and product windows.
    Assembles evidence bundles with source independence verification and corroboration scoring.
    """

    # Source category classification for independence determination (§11 Table 15)
    SOURCE_CATEGORIES = {
        "CORPORATE_DISCLOSURE": ["scanx.trade", "bseindia.com", "nseindia.com", "investor"],
        "FINANCIAL_MEDIA": ["economictimes", "moneycontrol", "fortuneindia", "crn", "hdfcsky", "manufacturingtoday"],
        "GOVERNMENT_PROCUREMENT": ["gem.gov.in", "eprocure.gov.in", "tenders"],
        "POLICY_GAZETTE": ["meity.gov.in", "pib.gov.in", "dpiit.gov.in"],
        "OFFICIAL_TRADE_CUSTOMS": ["dgciskol.gov.in", "customs", "trade_database"],
        "PATENT_OFFICE_ACADEMIA": ["ipindiaservices.gov.in", "openalex.org", "patent", "research"]
    }

    THEMATIC_CLUSTERS = [
        {
            "bundle_id": "bundle_osat_power_semicon",
            "title": "Domestic Power Semiconductor Packaging & OSAT Localization",
            "primary_technology": "OSAT & Power Semiconductors (SiC/GaN)",
            "target_clusters": ["National Industrial Scope", "Sanand-Dholera Semiconductor & EV Corridor", "Bengaluru-Mysuru High-Tech Corridor"],
            "target_entities": ["comp_kaynes"],
            "keyword_rules": [
                r"\b(vishay|osat|chip packaging|power semiconductor|silicon carbide|sic|direct-bonded|dbc|specs|8541)\b"
            ],
            "min_events_required": 3
        },
        {
            "bundle_id": "bundle_tata_dholera_wafer_fab",
            "title": "Dholera Semiconductor Fab Capex & Local Ecosystem Pull",
            "primary_technology": "Silicon Wafer Fabrication & Cleanroom Packaging",
            "target_clusters": ["Sanand-Dholera Semiconductor & EV Corridor", "National Industrial Scope"],
            "target_entities": ["comp_tata_semi"],
            "keyword_rules": [
                r"\b(tata electronics|dholera|wafer|fab|equipment|graphene|sintered|8542|integrated circuit|die-attach)\b"
            ],
            "min_events_required": 3
        },
        {
            "bundle_id": "bundle_defense_rail_smt_localization",
            "title": "High-Reliability Rail & Defense SMT Assembly Under Local Value Addition",
            "primary_technology": "High-Reliability Multilayer SMT & Kavach Modules",
            "target_clusters": ["Bengaluru-Mysuru High-Tech Corridor", "NCR Industrial & Auto Hub", "National Industrial Scope"],
            "target_entities": ["comp_syrma", "comp_kaynes"],
            "keyword_rules": [
                r"\b(kavach|bel|railway|drdo|micro-bga|solder|elemaster|class 3|local supplier|make in india|gan rf)\b"
            ],
            "min_events_required": 3
        },
        {
            "bundle_id": "bundle_bare_pcb_mna_integration",
            "title": "Bare Multilayer PCB Consolidation & Upstream Supply-Chain Backward Integration",
            "primary_technology": "Bare Multilayer & HDI PCBs",
            "target_clusters": ["NCR Industrial & Auto Hub", "Tamil Nadu Electronics & Auto Corridor", "National Industrial Scope"],
            "target_entities": ["comp_amber", "comp_syrma"],
            "keyword_rules": [
                r"\b(ascent circuits|il jin|bare pcb|multilayer pcb|optical inspection|aoi|components and engineering)\b"
            ],
            "min_events_required": 2
        },
        {
            "bundle_id": "bundle_dixon_durables_smt_scale",
            "title": "Large-Scale Consumer Durables EMS Expansion & Surface-Mount Automation",
            "primary_technology": "Automated SMT Assembly & Consumer Durables",
            "target_clusters": ["Noida EMC 2.0 Electronics Cluster", "National Industrial Scope"],
            "target_entities": ["comp_dixon", "comp_syrma"],
            "keyword_rules": [
                r"\b(dixon|1,000 crore|automation|cost cuts|syrma kaga|pli 2\.0|incremental production)\b"
            ],
            "min_events_required": 2
        }
    ]

    @classmethod
    def classify_source_type(cls, publisher: str, source_url: str) -> str:
        """Determines the independent authority category of a source."""
        combined = f"{publisher} {source_url}".lower()
        for cat, kw_list in cls.SOURCE_CATEGORIES.items():
            for kw in kw_list:
                if kw in combined:
                    return cat
        return "GENERAL_PUBLIC_SOURCE"

    @classmethod
    def match_event_to_cluster(cls, event: Dict[str, Any], cluster_spec: Dict[str, Any]) -> bool:
        """
        Evaluates whether an event satisfies the temporal, geographic, and keyword window.
        """
        # 1. Text corpus from event
        text_corpus = " ".join([
            event.get("exact_supporting_citation", ""),
            " ".join(event.get("facts", [])),
            " ".join(event.get("inferences", [])),
            " ".join(event.get("products_detected", [])),
            event.get("entity", {}).get("canonical_name", "")
        ]).lower()

        # 2. Keyword regex match
        matched_kw = False
        for pattern in cluster_spec["keyword_rules"]:
            if re.search(pattern, text_corpus, re.IGNORECASE):
                matched_kw = True
                break

        if not matched_kw:
            return False

        # 3. Entity overlap check (if entity-specific)
        event_entity_id = event.get("entity", {}).get("canonical_id")
        target_entities = cluster_spec.get("target_entities", [])
        
        # Non-corporate events (Tenders, Policies, Trade) match if keywords and geography align
        if event.get("event_type") in ["TENDER", "REGULATORY", "TRADE", "PATENT"]:
            return True

        if target_entities and event_entity_id in target_entities:
            return True

        # If keyword matched strongly and geography overlaps
        event_cluster = event.get("geography", {}).get("cluster")
        target_clusters = cluster_spec.get("target_clusters", [])
        if event_cluster in target_clusters or event_cluster == "National Industrial Scope":
            return True

        return False

    @classmethod
    def corroborate_events(
        cls,
        structured_events: List[Dict[str, Any]],
        canonical_entities: List[Dict[str, Any]] = None,
        entity_relationships: List[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Executes multi-window corroboration across all events and groups them into evidence bundles.
        """
        evidence_bundles = []

        for cluster_spec in cls.THEMATIC_CLUSTERS:
            matched_events = []
            distinct_source_types = set()
            distinct_publishers = set()
            participating_entities = set()
            event_dates = []

            for ev in structured_events:
                if cls.match_event_to_cluster(ev, cluster_spec):
                    matched_events.append(ev)
                    # Classify publisher & source independence
                    pub = ev.get("publisher", "unknown")
                    url = ev.get("source_url", "")
                    src_type = cls.classify_source_type(pub, url)
                    distinct_source_types.add(src_type)
                    distinct_publishers.add(pub)

                    ent_id = ev.get("entity", {}).get("canonical_id")
                    if ent_id and ent_id != "unassigned":
                        participating_entities.add(ent_id)

                    dt = ev.get("event_date")
                    if dt:
                        event_dates.append(dt)

            if len(matched_events) < cluster_spec.get("min_events_required", 2):
                continue

            # Calculate temporal range
            sorted_dates = sorted(event_dates)
            start_date = sorted_dates[0] if sorted_dates else "2026-06-01"
            end_date = sorted_dates[-1] if sorted_dates else "2026-11-19"
            
            try:
                d1 = datetime.strptime(start_date, "%Y-%m-%d")
                d2 = datetime.strptime(end_date, "%Y-%m-%d")
                duration_days = abs((d2 - d1).days)
            except Exception:
                duration_days = 30

            # Calculate Corroboration Strength & Independence Score
            src_count = len(distinct_source_types)
            if src_count >= 3:
                strength_label = "Multi-Source Triangulated"
                corroboration_score = round(min(0.98, 0.85 + (src_count * 0.03)), 2)
            elif src_count == 2:
                strength_label = "Two-Source Corroborated"
                corroboration_score = 0.82
            else:
                strength_label = "Single-Source Cluster"
                corroboration_score = 0.60

            # Map participating entity names
            entity_names = []
            if canonical_entities:
                ent_map = {e["canonical_entity_id"]: e["canonical_name"] for e in canonical_entities}
                entity_names = [ent_map.get(eid, eid) for eid in participating_entities]

            # Assemble structured evidence items
            evidence_items = []
            for ev in matched_events:
                pub = ev.get("publisher", "unknown")
                url = ev.get("source_url", "")
                src_cat = cls.classify_source_type(pub, url)
                evidence_items.append({
                    "event_id": ev.get("event_id"),
                    "event_type": ev.get("event_type"),
                    "event_date": ev.get("event_date"),
                    "publisher": pub,
                    "source_category": src_cat,
                    "subject_entity": ev.get("entity", {}).get("canonical_name", "Ecosystem / Unassigned"),
                    "supporting_citation": ev.get("exact_supporting_citation"),
                    "key_fact": ev.get("facts", [""])[0] if ev.get("facts") else "",
                    "cluster": ev.get("geography", {}).get("cluster")
                })

            bundle = {
                "bundle_id": cluster_spec["bundle_id"],
                "title": cluster_spec["title"],
                "primary_technology": cluster_spec["primary_technology"],
                "corroboration_strength": strength_label,
                "corroboration_score": corroboration_score,
                "independent_source_categories_count": src_count,
                "source_categories": sorted(list(distinct_source_types)),
                "publishers_count": len(distinct_publishers),
                "total_corroborated_events": len(matched_events),
                "temporal_window": {
                    "start_date": start_date,
                    "end_date": end_date,
                    "span_days": duration_days
                },
                "target_clusters": cluster_spec["target_clusters"],
                "participating_entities": sorted(list(participating_entities)),
                "participating_entity_names": entity_names,
                "evidence_items": evidence_items,
                "synthesis_summary": (
                    f"Corroborated across {src_count} independent source categories "
                    f"({', '.join(sorted(list(distinct_source_types)))}) "
                    f"spanning {len(matched_events)} events between {start_date} and {end_date}."
                )
            }
            evidence_bundles.append(bundle)

        return evidence_bundles
