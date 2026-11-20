import re
from typing import Optional, Dict, Any, List

# Full Canonical Entity Registry matching §10 (entities collection)
CANONICAL_ENTITIES_REGISTRY = {
    "comp_kaynes": {
        "canonical_entity_id": "comp_kaynes",
        "canonical_name": "Kaynes Technology India Ltd",
        "entity_type": "competitor",
        "subsector": "Integrated EMS & OSAT Packaging",
        "aliases": [
            "kaynes", "kaynes technology", "kaynes semicon", "kaynes tech",
            "kaynes technology india limited", "kaynes technology india ltd",
            "kaynes-technology", "kaynes semi"
        ],
        "identifiers": {
            "nse_symbol": "KAYNES.NS",
            "bse_scrip": "543664",
            "isin": "INE918Z01012",
            "cin": "L29128KA2008PLC045825"
        },
        "industry_tags": ["EMS", "OSAT Semiconductor Packaging", "Automotive ECUs", "Rail Kavach Electronics", "Industrial SMT"],
        "geography": {
            "headquarters": "Mysuru, Karnataka",
            "primary_state": "Karnataka",
            "operating_clusters": ["Bengaluru-Mysuru High-Tech Corridor", "Sanand-Dholera Semiconductor Corridor"]
        },
        "resolution_metadata": {
            "authority_confidence": 0.99,
            "verification_source": "BSE & NSE Listed Entity"
        }
    },
    "comp_dixon": {
        "canonical_entity_id": "comp_dixon",
        "canonical_name": "Dixon Technologies (India) Ltd",
        "entity_type": "competitor",
        "subsector": "EMS & Precision Electronics",
        "aliases": [
            "dixon", "dixon technologies", "padget electronics", "dixon tech",
            "dixon technologies india limited", "dixon technologies (india) ltd",
            "padget"
        ],
        "identifiers": {
            "nse_symbol": "DIXON.NS",
            "bse_scrip": "540699",
            "isin": "INE935N01020",
            "cin": "L32101UP1993PLC066581"
        },
        "industry_tags": ["EMS", "Consumer Durables", "Mobile Phones", "Telecom Hardware", "Automated SMT"],
        "geography": {
            "headquarters": "Noida, Uttar Pradesh",
            "primary_state": "Uttar Pradesh",
            "operating_clusters": ["Noida EMC 2.0 Electronics Cluster", "Tirupati Electronics Hub"]
        },
        "resolution_metadata": {
            "authority_confidence": 0.99,
            "verification_source": "BSE & NSE Listed Entity"
        }
    },
    "comp_syrma": {
        "canonical_entity_id": "comp_syrma",
        "canonical_name": "Syrma SGS Technology Ltd",
        "entity_type": "competitor",
        "subsector": "EMS & Custom Electronics Design",
        "aliases": [
            "syrma", "syrma sgs", "syrma technology", "syrma sgs technology limited",
            "syrma sgs technology ltd", "syrma kaga", "syrma-sgs"
        ],
        "identifiers": {
            "nse_symbol": "SYRMA.NS",
            "bse_scrip": "543573",
            "isin": "INE0BYW01018",
            "cin": "L31900TN2004PLC054523"
        },
        "industry_tags": ["EMS", "Precision Magnetics", "RFID & IoT Modules", "Medical Electronics Assembly", "Automotive PCB"],
        "geography": {
            "headquarters": "Chennai, Tamil Nadu",
            "primary_state": "Tamil Nadu",
            "operating_clusters": ["Tamil Nadu Electronics Corridor", "Bengaluru-Mysuru High-Tech Corridor", "Baddi Industrial Hub"]
        },
        "resolution_metadata": {
            "authority_confidence": 0.99,
            "verification_source": "BSE & NSE Listed Entity"
        }
    },
    "comp_amber": {
        "canonical_entity_id": "comp_amber",
        "canonical_name": "Amber Enterprises (Ascent Circuits)",
        "entity_type": "competitor",
        "subsector": "Bare PCB & Component Manufacturing",
        "aliases": [
            "amber", "amber enterprises", "ascent circuits", "il jin",
            "amber enterprises india limited", "ascent circuits pvt ltd", "ascent circuit"
        ],
        "identifiers": {
            "nse_symbol": "AMBER.NS",
            "bse_scrip": "540902",
            "isin": "INE371P01015",
            "cin": "L28910PB1990PLC010265"
        },
        "industry_tags": ["Bare Multilayer PCBs", "HDI PCBs", "HVAC Inverter Electronics", "Power Electronics"],
        "geography": {
            "headquarters": "Gurugram, Haryana",
            "primary_state": "Haryana / NCR",
            "operating_clusters": ["NCR Industrial & Auto Hub", "Tamil Nadu Electronics Corridor (Hosur)"]
        },
        "resolution_metadata": {
            "authority_confidence": 0.99,
            "verification_source": "BSE & NSE Listed Entity"
        }
    },
    "comp_tata_semi": {
        "canonical_entity_id": "comp_tata_semi",
        "canonical_name": "Tata Electronics Pvt Ltd",
        "entity_type": "ecosystem_anchor",
        "subsector": "Semiconductor Fab & OSAT",
        "aliases": [
            "tata electronics", "tepl", "tata semiconductor",
            "tata semiconductor fab", "tata osat", "tata electronics pvt ltd"
        ],
        "identifiers": {
            "cin": "U31900TN2020PTC135541",
            "parent_group": "Tata Group"
        },
        "industry_tags": ["Silicon Wafer Fab (28nm/40nm)", "Advanced Semiconductor Packaging", "Precision Machining Enclosures"],
        "geography": {
            "headquarters": "Hosur / Bengaluru",
            "primary_state": "Tamil Nadu / Karnataka",
            "operating_clusters": ["Sanand-Dholera Semiconductor Corridor", "Tamil Nadu Electronics Corridor (Hosur)"]
        },
        "resolution_metadata": {
            "authority_confidence": 0.98,
            "verification_source": "Ministry of Corporate Affairs (MCA) Registered"
        }
    }
}

# Entity Relationships Graph matching §10 (entity_relationships collection)
CANONICAL_RELATIONSHIPS = [
    {
        "relationship_id": "rel_amber_ascent",
        "from_entity_id": "comp_amber",
        "from_entity_name": "Amber Enterprises India Ltd",
        "relationship_type": "PARENT_SUBSIDIARY",
        "to_entity_id": "sub_ascent_circuits",
        "to_entity_name": "Ascent Circuits Pvt Ltd",
        "equity_stake": "98.5% Ownership",
        "evidence_event_ids": ["evt_amber_ascent_acquisition"],
        "valid_from": "2026-06-19",
        "confidence": 0.99,
        "relationship_summary": "Amber subsidiary IL JIN completed acquisition of 98.5% stake in Ascent Circuits for bare PCB supply integration."
    },
    {
        "relationship_id": "rel_syrma_kaga",
        "from_entity_id": "comp_syrma",
        "from_entity_name": "Syrma SGS Technology Ltd",
        "relationship_type": "JOINT_VENTURE",
        "to_entity_id": "sub_syrma_kaga",
        "to_entity_name": "Syrma Kaga Electronics",
        "equity_stake": "Joint Venture Subsidiary",
        "evidence_event_ids": ["evt_syrma_kaga_funding"],
        "valid_from": "2026-11-18",
        "confidence": 0.98,
        "relationship_summary": "Syrma SGS invested ₹14.99 Cr into Syrma Kaga Electronics to expand high-reliability electronics assembly with Japan's Kaga."
    },
    {
        "relationship_id": "rel_kaynes_vishay",
        "from_entity_id": "comp_kaynes",
        "from_entity_name": "Kaynes Technology India Ltd",
        "relationship_type": "STRATEGIC_JV",
        "to_entity_id": "partner_vishay_intertechnology",
        "to_entity_name": "Vishay Intertechnology (USA)",
        "equity_stake": "Manufacturing JV",
        "evidence_event_ids": ["evt_kaynes_vishay_jv"],
        "valid_from": "2026-11-14",
        "confidence": 0.98,
        "relationship_summary": "Formed strategic joint venture with Vishay Intertechnology for domestic power semiconductor packaging in India."
    },
    {
        "relationship_id": "rel_tata_ecosystem",
        "from_entity_id": "comp_tata_semi",
        "from_entity_name": "Tata Electronics Pvt Ltd",
        "relationship_type": "UPSTREAM_ECOSYSTEM_ANCHOR",
        "to_entity_id": "comp_kaynes",
        "to_entity_name": "Indian EMS Packaging Tier",
        "equity_stake": "Supply Chain Collaboration",
        "evidence_event_ids": ["evt_tata_dholera_equipment"],
        "valid_from": "2026-11-18",
        "confidence": 0.90,
        "relationship_summary": "Anchor fab provider in Dholera investing $5-6B in equipment, creating upstream silicon packaging demand for Indian EMS firms."
    }
]


class EntityResolutionEngine:
    """
    Stage 5 (Resolve): Matches text mentions, stock ticker symbols, exchange codes,
    and subsidiaries to canonical entities and manages entity relationship graphs.
    """

    @classmethod
    def resolve(cls, query_string: str) -> Optional[Dict[str, Any]]:
        """
        Resolves any raw company name, alias, ticker, or snippet to canonical entity.
        Returns canonical entity ID, name, identifiers, and resolution score.
        """
        if not query_string:
            return None

        clean_query = query_string.strip()
        lower = clean_query.lower()

        # 1. Exact Ticker / Identifier Matching
        upper = clean_query.upper()
        for entity_id, entity_data in CANONICAL_ENTITIES_REGISTRY.items():
            identifiers = entity_data.get("identifiers", {})
            if upper == identifiers.get("nse_symbol") or upper == identifiers.get("nse_symbol", "").replace(".NS", ""):
                return {
                    "canonical_entity_id": entity_id,
                    "canonical_name": entity_data["canonical_name"],
                    "match_type": "EXACT_TICKER_MATCH",
                    "matched_alias": identifiers["nse_symbol"],
                    "resolution_score": 1.0,
                    "entity_type": entity_data["entity_type"],
                    "subsector": entity_data["subsector"],
                    "identifiers": identifiers
                }
            if upper == identifiers.get("bse_scrip"):
                return {
                    "canonical_entity_id": entity_id,
                    "canonical_name": entity_data["canonical_name"],
                    "match_type": "EXACT_SCRIP_MATCH",
                    "matched_alias": identifiers["bse_scrip"],
                    "resolution_score": 1.0,
                    "entity_type": entity_data["entity_type"],
                    "subsector": entity_data["subsector"],
                    "identifiers": identifiers
                }

        # 2. Word Boundary Alias Matching
        best_match = None
        longest_alias_len = 0

        for entity_id, entity_data in CANONICAL_ENTITIES_REGISTRY.items():
            for alias in entity_data["aliases"]:
                pattern = r'\b' + re.escape(alias) + r'\b'
                if re.search(pattern, lower):
                    if len(alias) > longest_alias_len:
                        longest_alias_len = len(alias)
                        score = 0.98 if len(alias) >= 5 else 0.88
                        best_match = {
                            "canonical_entity_id": entity_id,
                            "canonical_name": entity_data["canonical_name"],
                            "match_type": "CANONICAL_ALIAS_MATCH",
                            "matched_alias": alias,
                            "resolution_score": score,
                            "entity_type": entity_data["entity_type"],
                            "subsector": entity_data["subsector"],
                            "identifiers": entity_data.get("identifiers", {})
                        }

        return best_match

    @classmethod
    def get_all_canonical_entities(cls) -> List[Dict[str, Any]]:
        """Returns the full persistent canonical entities collection (§10: entities)."""
        return list(CANONICAL_ENTITIES_REGISTRY.values())

    @classmethod
    def get_all_entity_relationships(cls) -> List[Dict[str, Any]]:
        """Returns the persistent entity relationships graph (§10: entity_relationships)."""
        return CANONICAL_RELATIONSHIPS

    @classmethod
    def get_entity_subgraph(cls, entity_id: str) -> Dict[str, Any]:
        """Returns the entity profile and all inbound/outbound graph relationships."""
        entity = CANONICAL_ENTITIES_REGISTRY.get(entity_id)
        if not entity:
            return {}
        
        relationships = [
            rel for rel in CANONICAL_RELATIONSHIPS
            if rel["from_entity_id"] == entity_id or rel["to_entity_id"] == entity_id
        ]
        return {
            "entity": entity,
            "relationships_count": len(relationships),
            "relationships": relationships
        }


# Backwards compatibility export
CANONICAL_ENTITIES = {k: {"canonical_name": v["canonical_name"], "aliases": v["aliases"], "subsector": v["subsector"]} 
                      for k, v in CANONICAL_ENTITIES_REGISTRY.items()}

def resolve_entity_from_text(text: str) -> Optional[dict]:
    resolved = EntityResolutionEngine.resolve(text)
    if resolved:
        return {
            "entity_id": resolved["canonical_entity_id"],
            "canonical_name": resolved["canonical_name"],
            "subsector": resolved["subsector"],
            "confidence": resolved["resolution_score"],
            "matched_alias": resolved["matched_alias"]
        }
    return None
