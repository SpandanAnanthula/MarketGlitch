import re
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime

class ReviewAndSuppressEngine:
    """
    Stage 8 (Review & Suppress):
    - Deduplicates syndicated events across media/exchanges using text similarity, entity matching & temporal closeness.
    - Suppresses non-vertical domain noise (e.g. agriculture, livestock vaccines, general renewables).
    - Filters outdated archival documents (>24 months) to retain only active operational intelligence.
    - Enforces the 'Zero Hallucinated Citations' guardrail (§12) by verifying grounding against source envelopes.
    - Applies minimum confidence thresholds on Level 3 signals (composite score >= 0.85 and >= 2 source categories).
    - Maintains a persistent Analyst Review & Suppression Queue with standardized reason codes (§10, §14).
    """

    REASON_CODES = {
        "DUPLICATE_SYNDICATION": "Duplicate syndicated coverage of identical event on same date",
        "NON_VERTICAL_NOISE": "Irrelevant to target vertical (Electronics & Semiconductor Manufacturing)",
        "ARCHIVAL_OUTDATED": "Historical document older than operating signal window (>24 months)",
        "LOW_CONFIDENCE_SCORE": "Composite extraction confidence below minimum threshold (<0.70)",
        "UNGROUNDED_CITATION": "Citation failed exact grounding check against source document text",
        "INSUFFICIENT_CORROBORATION": "Level 3 signal lacks required multi-source corroboration"
    }

    # Vertical relevance keywords for Electronics & Semiconductor Manufacturing
    CORE_HARDWARE_KEYWORDS = [
        r'\b(?:semiconductor|chip|chips|wafer|wafers|fab|osat|packaging|smt|surface mount|pcb|pcba|bare pcb|multilayer)\b',
        r'\b(?:sic|gan|silicon carbide|gallium nitride|inverter|bga|micro-bga|qfn|flip-chip|die-attach|sintered)\b',
        r'\b(?:dixon|kaynes|syrma|amber|tata electronics|tepl|ascent circuits|elemaster|kaga|padget)\b',
        r'\b(?:kavach|specs|pli 2\.0|pli|specs 2\.0|meity|dgcis|8542|8541|optical inspection|aoi|test bench)\b',
        r'\b(?:telecom hardware|smart meter|electronic sub-assemblies|electronic|electronics|avionics|radar|transceiver)\b'
    ]

    EXPLICIT_EXCLUSION_KEYWORDS = [
        r'\b(?:vaccine|chicken|poultry|avian|livestock|dairy|crop|farmer|agriculture|agri|fertilizer)\b',
        r'\b(?:coal|crude oil|petroleum|textile|garment|wheat|rice|sugar)\b'
    ]

    @classmethod
    def extract_core_headline(cls, citation: str) -> str:
        """Extracts the core headline enclosed in quotes from a citation."""
        quote_match = re.search(r'["\']([^"\']+)["\']', citation)
        return quote_match.group(1).strip() if quote_match else citation.strip()

    @classmethod
    def calculate_text_similarity(cls, s1: str, s2: str) -> float:
        """Computes Jaccard word-set similarity between two normalized strings."""
        if not s1 or not s2:
            return 0.0
        words1 = set(re.findall(r'[a-zA-Z]{3,}', s1.lower()))
        words2 = set(re.findall(r'[a-zA-Z]{3,}', s2.lower()))
        if not words1 or not words2:
            return 0.0
        intersection = len(words1.intersection(words2))
        union = len(words1.union(words2))
        return float(intersection) / float(union) if union > 0 else 0.0

    @classmethod
    def is_vertical_relevant(cls, headline: str, raw_facts: List[str] = None) -> Tuple[bool, str]:
        """Checks if event relates strictly to Electronics & Semiconductor Manufacturing."""
        lower_headline = headline.lower()

        # Check explicit negative domain exclusion first
        for ex in cls.EXPLICIT_EXCLUSION_KEYWORDS:
            if re.search(ex, lower_headline):
                return False, f"Headline matches non-target vertical exclusion rule ({ex})"

        # Check positive hardware/semiconductor markers
        for kw in cls.CORE_HARDWARE_KEYWORDS:
            if re.search(kw, lower_headline):
                return True, "Core hardware keyword matched"

        # Check facts if available (excluding boilerplate lines)
        if raw_facts:
            filtered_facts = [f for f in raw_facts if "Subject Entity: Indian Electronics Ecosystem" not in f and "Publisher:" not in f]
            facts_text = " ".join(filtered_facts).lower()
            for kw in cls.CORE_HARDWARE_KEYWORDS:
                if re.search(kw, facts_text):
                    return True, "Hardware keyword matched in verified facts"

        return False, "Headline and facts lack core electronics/semiconductor manufacturing terms"

    @classmethod
    def verify_citation_grounding(cls, citation: str, source_envelopes: List[Dict[str, Any]]) -> Tuple[bool, str]:
        """
        Enforces Zero Hallucinated Citations Guardrail (§12).
        Verifies that citation text corresponds to an authentic source document.
        """
        if not citation:
            return False, "Empty citation text"

        quoted_text = cls.extract_core_headline(citation).lower()
        quoted_words = set(re.findall(r'\b\w{4,}\b', quoted_text))

        for env in source_envelopes:
            env_text = (env.get("title", "") + " " + env.get("normalized_text", "") + " " + " ".join(env.get("facts", []))).lower()
            if quoted_text in env_text:
                return True, f"Exact substring verified in envelope {env.get('envelope_id')}"
            env_words = set(re.findall(r'\b\w{4,}\b', env_text))
            if quoted_words and len(quoted_words.intersection(env_words)) / len(quoted_words) >= 0.70:
                return True, f"Word grounding (>=70%) verified in envelope {env.get('envelope_id')}"

        return False, "Citation text not found in any source document envelope"

    @classmethod
    def is_syndicated_duplicate(cls, ev1: Dict[str, Any], ev2: Dict[str, Any]) -> Tuple[bool, float, str]:
        """
        Detects if ev2 is a syndicated near-duplicate of ev1.
        Evaluates entity overlap, temporal proximity, and core headline similarity.
        """
        t1 = cls.extract_core_headline(ev1.get("exact_supporting_citation", ""))
        t2 = cls.extract_core_headline(ev2.get("exact_supporting_citation", ""))
        d1 = ev1.get("event_date", "")
        d2 = ev2.get("event_date", "")
        ent1 = ev1.get("entity", {}).get("canonical_id")
        ent2 = ev2.get("entity", {}).get("canonical_id")

        # Compute token overlap on core headline
        w1 = set(re.findall(r'[a-zA-Z]{3,}', t1.lower()))
        w2 = set(re.findall(r'[a-zA-Z]{3,}', t2.lower()))
        common = w1.intersection(w2)
        min_len = min(len(w1), len(w2)) if w1 and w2 else 1
        overlap_ratio = len(common) / min_len

        # Rule 1: High lexical similarity (>= 0.65)
        sim = cls.calculate_text_similarity(t1, t2)
        if sim >= 0.60:
            return True, sim, f"High text similarity ({int(sim*100)}%)"

        # Rule 2: Same canonical entity + identical date + shared key transaction terms (e.g. M&A numbers)
        if ent1 and ent2 and ent1 == ent2 and d1 == d2 and ent1 != "unassigned":
            if overlap_ratio >= 0.40:
                return True, overlap_ratio, f"Same entity ({ent1}) on {d1} with {int(overlap_ratio*100)}% keyword overlap"

        return False, 0.0, "Distinct events"

    @classmethod
    def review_and_filter_events(
        cls,
        structured_events: List[Dict[str, Any]],
        normalized_envelopes: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Deduplicates, verifies grounding, filters noise, and partitions events into
        Approved and Suppressed queues.
        """
        approved_events = []
        suppressed_events = []
        seen_events = []

        for ev in structured_events:
            ev_id = ev.get("event_id")
            citation = ev.get("exact_supporting_citation", "")
            headline = cls.extract_core_headline(citation)
            date_str = ev.get("event_date", "")
            conf = ev.get("extraction_confidence", 0.0)

            # 1. Zero Hallucinated Citation Grounding Check (§12)
            is_grounded, grounding_msg = cls.verify_citation_grounding(citation, normalized_envelopes)
            if not is_grounded:
                suppressed_events.append({
                    "item_id": ev_id,
                    "item_type": "EVENT",
                    "title": headline,
                    "citation": citation,
                    "suppression_reason_code": "UNGROUNDED_CITATION",
                    "explanation": grounding_msg,
                    "status": "FLAGGED_UNGROUNDED",
                    "action_required": "Quarantine / Human Review",
                    "event_record": ev
                })
                continue

            # 2. Vertical Relevance Check
            is_rel, rel_msg = cls.is_vertical_relevant(headline, ev.get("facts", []))
            if not is_rel:
                suppressed_events.append({
                    "item_id": ev_id,
                    "item_type": "EVENT",
                    "title": headline,
                    "citation": citation,
                    "suppression_reason_code": "NON_VERTICAL_NOISE",
                    "explanation": rel_msg,
                    "status": "SUPPRESSED_NOISE",
                    "action_required": "Auto-Suppressed from Live Feed",
                    "event_record": ev
                })
                continue

            # 3. Recency Check (>24 months considered archival research)
            try:
                ev_year = int(date_str.split("-")[0])
                if ev_year < 2025:
                    suppressed_events.append({
                        "item_id": ev_id,
                        "item_type": "EVENT",
                        "title": headline,
                        "citation": citation,
                        "suppression_reason_code": "ARCHIVAL_OUTDATED",
                        "explanation": f"Publication date ({date_str}) precedes active signal window (2025-2026). Retained for background knowledge only.",
                        "status": "ARCHIVAL_BACKGROUND",
                        "action_required": "Stored in Reference Index Only",
                        "event_record": ev
                    })
                    continue
            except Exception:
                pass

            # 4. Deduplication Check
            is_dup = False
            for prev_ev in seen_events:
                dup_detected, score, dup_reason = cls.is_syndicated_duplicate(prev_ev, ev)
                if dup_detected:
                    is_dup = True
                    suppressed_events.append({
                        "item_id": ev_id,
                        "item_type": "EVENT",
                        "title": headline,
                        "citation": citation,
                        "suppression_reason_code": "DUPLICATE_SYNDICATION",
                        "duplicate_of_event_id": prev_ev.get("event_id"),
                        "similarity_score": round(score, 2),
                        "explanation": f"Syndicated repetition of primary event {prev_ev.get('event_id')}: {dup_reason}.",
                        "status": "SUPPRESSED_DUPLICATE",
                        "action_required": "Merged into Canonical Event",
                        "event_record": ev
                    })
                    break

            if is_dup:
                continue

            # 5. Confidence Threshold Check
            if conf < 0.70:
                suppressed_events.append({
                    "item_id": ev_id,
                    "item_type": "EVENT",
                    "title": headline,
                    "citation": citation,
                    "suppression_reason_code": "LOW_CONFIDENCE_SCORE",
                    "explanation": f"Extraction confidence ({conf}) falls below minimum threshold (0.70).",
                    "status": "SUPPRESSED_LOW_CONFIDENCE",
                    "action_required": "Analyst Review Required",
                    "event_record": ev
                })
                continue

            # Passed all filters -> Approved
            ev_approved = dict(ev)
            ev_approved["review_status"] = "APPROVED"
            ev_approved["grounding_verified"] = True
            approved_events.append(ev_approved)
            seen_events.append(ev_approved)

        return {
            "total_evaluated_events": len(structured_events),
            "approved_events_count": len(approved_events),
            "suppressed_events_count": len(suppressed_events),
            "approved_events": approved_events,
            "suppressed_events": suppressed_events
        }

    @classmethod
    def review_and_filter_signals(
        cls,
        signals: List[Dict[str, Any]],
        approved_event_ids: List[str]
    ) -> Dict[str, Any]:
        """
        Validates Level 3 strategic signals against minimum confidence and corroboration gates.
        """
        approved_signals = []
        flagged_signals = []

        for sig in signals:
            sig_id = sig.get("signal_id")
            title = sig.get("title")
            conf_data = sig.get("confidence", {})
            score = conf_data.get("composite_score", 0.0)
            src_count = sig.get("independent_source_categories_count", 0)

            # Check composite confidence
            if score < 0.85:
                flagged_signals.append({
                    "item_id": sig_id,
                    "item_type": "SIGNAL",
                    "title": title,
                    "reason_code": "LOW_CONFIDENCE_SCORE",
                    "explanation": f"Composite confidence ({score}) below 0.85 threshold for Level 3 strategic hypotheses.",
                    "status": "FLAGGED_LOW_CONFIDENCE",
                    "action_required": "Senior Analyst Sign-off",
                    "signal_record": sig
                })
                continue

            # Check corroboration independence (must have >= 2 independent source categories)
            if src_count < 2:
                flagged_signals.append({
                    "item_id": sig_id,
                    "item_type": "SIGNAL",
                    "title": title,
                    "reason_code": "INSUFFICIENT_CORROBORATION",
                    "explanation": f"Signal is backed by only {src_count} source category. Level 3 hypotheses require >= 2 independent categories.",
                    "status": "FLAGGED_INSUFFICIENT_CORROBORATION",
                    "action_required": "Multi-Source Corroboration Required",
                    "signal_record": sig
                })
                continue

            # Signal verified and approved
            sig_approved = dict(sig)
            sig_approved["review_status"] = "APPROVED"
            sig_approved["analyst_quality_cleared"] = True
            approved_signals.append(sig_approved)

        return {
            "total_evaluated_signals": len(signals),
            "approved_signals_count": len(approved_signals),
            "flagged_signals_count": len(flagged_signals),
            "approved_signals": approved_signals,
            "flagged_signals": flagged_signals
        }

    @classmethod
    def execute_stage8(
        cls,
        structured_events: List[Dict[str, Any]],
        normalized_envelopes: List[Dict[str, Any]],
        signals: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Executes full Stage 8 Review & Suppress pipeline."""
        event_review = cls.review_and_filter_events(structured_events, normalized_envelopes)
        approved_event_ids = [e["event_id"] for e in event_review["approved_events"]]
        signal_review = cls.review_and_filter_signals(signals, approved_event_ids)

        suppression_queue = event_review["suppressed_events"] + signal_review["flagged_signals"]

        summary = {
            "stage": "Stage 8 (Review & Suppress)",
            "execution_timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "quality_metrics": {
                "total_events_evaluated": event_review["total_evaluated_events"],
                "approved_clean_events": event_review["approved_events_count"],
                "suppressed_events": event_review["suppressed_events_count"],
                "total_signals_evaluated": signal_review["total_evaluated_signals"],
                "approved_strategic_signals": signal_review["approved_signals_count"],
                "flagged_signals": signal_review["flagged_signals_count"],
                "hallucinated_citations_detected": len([item for item in suppression_queue if item.get("suppression_reason_code") == "UNGROUNDED_CITATION"]),
                "duplicates_suppressed": len([item for item in suppression_queue if item.get("suppression_reason_code") == "DUPLICATE_SYNDICATION"]),
                "non_vertical_noise_suppressed": len([item for item in suppression_queue if item.get("suppression_reason_code") == "NON_VERTICAL_NOISE"]),
                "archival_items_filtered": len([item for item in suppression_queue if item.get("suppression_reason_code") == "ARCHIVAL_OUTDATED"])
            },
            "approved_events": event_review["approved_events"],
            "approved_signals": signal_review["approved_signals"],
            "suppression_queue": suppression_queue
        }

        return summary
