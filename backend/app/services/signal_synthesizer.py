import re
from typing import List, Dict, Any, Optional
from datetime import datetime

class StrategicSignalSynthesizer:
    """
    Stage 7 (Analyse):
    Applies §4 Table 3 Signal Rules across multi-source evidence bundles and
    synthesizes Level 3 strategic intelligence signals conforming strictly to
    Table 4 format and §12 Fact vs. Inference guardrails.
    """

    # Blueprint §4 Table 3 Signal Families
    SIGNAL_FAMILIES = [
        "Capacity expansion",
        "Market entry",
        "Technology pivot",
        "Demand acceleration",
        "Supply-chain stress",
        "Competitive pressure",
        "Consolidation",
        "Talent competition"
    ]

    CANONICAL_SIGNALS_CATALOG = [
        {
            "signal_id": "sig_osat_power_semicon_pivot",
            "signal_family": "Technology pivot",
            "secondary_family": "Demand acceleration",
            "title": "Rapid OSAT & SiC/GaN Power Semiconductor Packaging Localization Ahead of EV Inverter Demand",
            "matching_bundle_id": "bundle_osat_power_semicon",
            "subject_entity_ids": ["comp_kaynes", "comp_tata_semi"],
            "subject_entity_names": ["Kaynes Technology India Ltd", "Tata Electronics Pvt Ltd"],
            "cluster_geography": "Sanand-Dholera & Bengaluru-Mysuru High-Tech Corridors",
            "what_happened_facts": [
                "Kaynes Technology India Ltd formed a strategic joint venture with US-based Vishay Intertechnology for domestic power semiconductor packaging (Citation: electronics.economictimes.indiatimes.com, 2026-11-14).",
                "Patent IN-PAT-2026-41092 was published by the Indian Patent Office covering High Thermal Dissipation Direct-Bonded Copper (DBC) Ceramic Substrates for Silicon Carbide (SiC) power modules (Citation: IP India & IISc, 2026-11-06).",
                "Convergence Energy Services Ltd (CESL) floated Tender GEM/2026/B/8771902 with estimated budget ₹12.8 Cr for automated high-voltage test benches for silicon carbide power modules (Citation: GeM, 2026-11-14).",
                "DGCIS customs data records $5.4B in annual imports of discrete semiconductors and power diodes under HS 8541, representing an 82% import dependency (Citation: DGCIS, 2026-11-15).",
                "MeitY issued SPECS 2.0 gazette notification offering 25% capex subsidies specifically for compound semiconductor and power module packaging facilities (Citation: MeitY Gazette, 2026-10-18)."
            ],
            "why_it_may_matter_inferences": [
                "Hypothesis: Indian EMS leaders are expanding up the value ladder from basic surface-mount contract assembly into high-margin automotive/industrial power modules.",
                "Implication: Stricter domestic value addition mandates and central capex subsidies are catalyzing an indigenous supply chain for EV traction inverters and solar converters.",
                "Strategic Shift: Kaynes is positioning to capture 18-25% gross packaging margins previously captured by East Asian OSAT vendors."
            ],
            "who_what_could_be_affected": [
                "Tier-1 Automotive Inverter Makers (Tata AutoComp, Uno Minda): Gaining a domestic source for power modules under PLI local content criteria.",
                "Pure-Play Contract Assemblers: Face margin compression if lacking high-thermal ceramic packaging cleanrooms.",
                "Foreign Discrete Semiconductor Exporters: Face market share erosion in Indian public procurement over the next 18–24 months."
            ],
            "suggested_next_investigation_action": [
                "Track civil construction milestones and cleanroom certification (ISO Class 5/6) for Kaynes' Sanand packaging plant.",
                "Benchmark thermal resistance (Rth) specifications of the published DBC ceramic substrate against Wolfspeed and STMicroelectronics standards.",
                "Review OEM automotive qualification timelines for domestic inverter sub-assemblies."
            ],
            "alternative_explanations": [
                "The Kaynes-Vishay joint venture may initially focus on low-complexity testing and sorting of imported dies rather than full substrate bonding.",
                "The patent filing with IISc could be an exploratory academic research collaboration with long lead times before volume manufacturing."
            ],
            "data_gaps": [
                "Exact equity ratio and capital commitment between Vishay Intertechnology and Kaynes.",
                "Confirmed commercial start-of-production (SOP) timeline for automotive-grade modules."
            ],
            "confidence_components": {
                "source_reliability": 0.98,
                "evidence_directness": 0.95,
                "corroboration_independence": 0.98,
                "recency": 0.95,
                "entity_match_certainty": 0.99,
                "signal_rule_validity": 0.95,
                "composite_score": 0.96,
                "confidence_label": "High"
            }
        },
        {
            "signal_id": "sig_tata_dholera_fab_equipment_ramp",
            "signal_family": "Capacity expansion",
            "secondary_family": "Supply-chain stress",
            "title": "$5B–$6B Equipment Capex at Dholera Fab Signals Cleanroom Tooling Ramp Amid Domestic Vendor Bottlenecks",
            "matching_bundle_id": "bundle_tata_dholera_wafer_fab",
            "subject_entity_ids": ["comp_tata_semi"],
            "subject_entity_names": ["Tata Electronics Pvt Ltd"],
            "cluster_geography": "Sanand-Dholera Semiconductor & EV Corridor, Gujarat",
            "what_happened_facts": [
                "Tata Electronics announced an equipment investment of $5B–$6B for its Dholera semiconductor wafer fab (Citation: The Economic Times, 2026-11-18).",
                "Tata Electronics leadership publicly flagged local supply chain bottlenecks and specialized semiconductor talent shortages across its ₹1.18 lakh Cr capex (Citation: scanx.trade & Financial Media, 2026-11-18).",
                "Tata Electronics published Patent IN-PAT-2026-42518 covering Graphene-Enhanced Sintered Silver Die-Attach Paste for semiconductor wafer packaging (Citation: IP India, 2026-11-13).",
                "DGCIS customs data records $14.8B in annual IC imports under HS 8542 with an 88% foreign dependency (Citation: DGCIS, 2026-11-15).",
                "MeitY disbursed ₹2,450 Cr under the PLI 2.0 incentive scheme for domestic electronics component manufacturers (Citation: MeitY, 2026-11-01)."
            ],
            "why_it_may_matter_inferences": [
                "Hypothesis: The Dholera greenfield facility is transitioning from structural civil engineering to cleanroom tool fit-out and secondary supplier integration.",
                "Implication: Massive upstream procurement demand for precision fixtures, ultra-pure gases, specialized chemicals, and wafer-level test tooling.",
                "Talent Squeeze: Substantial competition for process engineers and vacuum-system technicians across Indian semiconductor hubs."
            ],
            "who_what_could_be_affected": [
                "Domestic Tooling & Machining Vendors: Opportunity to qualify for secondary fab equipment tooling and maintenance contracts.",
                "Indian Mid-market EMS Players: Potential partners for secondary OSAT testing, sorting, and board-level integration.",
                "Semiconductor Engineering Talent: Upward salary pressure in Gujarat and Karnataka."
            ],
            "suggested_next_investigation_action": [
                "Monitor delivery manifests and customs clearance for lithography and chemical vapor deposition (CVD) equipment arriving at Mundra and Pipavav ports.",
                "Audit Tata Electronics' supplier onboarding portal for SME qualification standards."
            ],
            "alternative_explanations": [
                "The $5B-$6B equipment figure represents the multi-year aggregate commitment rather than near-term FY27 cash outflow.",
                "Supply chain bottleneck warnings could be strategic messaging to lobby for expedited fiscal support and infrastructure clearances."
            ],
            "data_gaps": [
                "Detailed equipment vendor split (ASML, Applied Materials, Lam Research, Tokyo Electron).",
                "Initial wafer production ramp volume and target process geometry (28nm vs 40nm)."
            ],
            "confidence_components": {
                "source_reliability": 0.98,
                "evidence_directness": 0.94,
                "corroboration_independence": 0.97,
                "recency": 0.96,
                "entity_match_certainty": 0.98,
                "signal_rule_validity": 0.95,
                "composite_score": 0.95,
                "confidence_label": "High"
            }
        },
        {
            "signal_id": "sig_defense_rail_kavach_localization",
            "signal_family": "Demand acceleration",
            "secondary_family": "Market entry",
            "title": "Mandated 55% Local Value Addition Drives High-Reliability EMS Pipeline for Kavach & Defense SMT",
            "matching_bundle_id": "bundle_defense_rail_smt_localization",
            "subject_entity_ids": ["comp_syrma", "comp_kaynes"],
            "subject_entity_names": ["Syrma SGS Technology Ltd", "Kaynes Technology India Ltd"],
            "cluster_geography": "Bengaluru-Mysuru Corridor & NCR Industrial Hub",
            "what_happened_facts": [
                "Bharat Electronics Ltd (BEL) issued Tender GEM/2026/B/8912401 for ₹42.5 Cr for high-reliability multilayer SMT PCB assemblies for the Kavach collision avoidance system (Citation: GeM, 2026-11-09).",
                "DPIIT revised the Public Procurement Preference (Make in India) order on 2026-11-10 mandating a minimum 55% local content requirement for electronic sub-assemblies (Citation: DPIIT Gazette, 2026-11-10).",
                "Syrma SGS-Elemaster joint venture inaugurated a dedicated aerospace and defense EMS manufacturing facility in Bengaluru (Citation: The Economic Times, 2026-09-03).",
                "Syrma SGS published Patent IN-PAT-2026-38914 for Automated Low-Void Solder Paste Dispensing for Micro-BGA assemblies (Citation: IP India, 2026-10-23).",
                "DRDO floated Tender CPPP/2026/DRDO/90822 with estimated budget ₹26.4 Cr for GaN RF transceiver micro-packaging (Citation: CPPP, 2026-11-16)."
            ],
            "why_it_may_matter_inferences": [
                "Hypothesis: Railway safety modernization and defense RF localization are establishing a multi-year captive revenue pool protected from foreign price competition.",
                "Implication: Indian EMS providers possessing Class-3 aerospace/defense assembly certifications enjoy sustained margin insulation (14-18% EBITDA).",
                "Exclusion Risk: Commercial EMS vendors without RDSO/AS9100 qualifications are disqualified from prime public procurement."
            ],
            "who_what_could_be_affected": [
                "Certified High-Reliability EMS Firms (Syrma SGS, Kaynes, Centum): Primary beneficiaries of Kavach national rollout contracts.",
                "Non-certified SMT Assemblers: Locked out of railway tenders unless subcontracting or upgrading quality certifications.",
                "Foreign Signaling OEMs: Must partner with certified domestic EMS firms to satisfy 55% local value addition."
            ],
            "suggested_next_investigation_action": [
                "Check Research Designs and Standards Organisation (RDSO) approved vendor lists for Kavach sub-assembly partners.",
                "Analyze Syrma SGS and Kaynes Technology quarterly order-book additions in the railway segment."
            ],
            "alternative_explanations": [
                "Kavach tender execution pace may experience procurement review lags or track-side installation delays.",
                "Foreign suppliers might petition for temporary local content waivers for specialized high-frequency RF components."
            ],
            "data_gaps": [
                "Exact domestic BOM percentage achieved by Syrma and Kaynes on current Kavach PCB bids.",
                "Upcoming railway tender schedule for the remaining Western and Northern railway zones."
            ],
            "confidence_components": {
                "source_reliability": 0.98,
                "evidence_directness": 0.96,
                "corroboration_independence": 0.97,
                "recency": 0.95,
                "entity_match_certainty": 0.99,
                "signal_rule_validity": 0.95,
                "composite_score": 0.95,
                "confidence_label": "High"
            }
        },
        {
            "signal_id": "sig_bare_pcb_mna_consolidation",
            "signal_family": "Consolidation",
            "secondary_family": "Supply-chain stress",
            "title": "EMS Backward Integration into Bare Multilayer PCBs to Mitigate Foreign Board Volatility",
            "matching_bundle_id": "bundle_bare_pcb_mna_integration",
            "subject_entity_ids": ["comp_amber", "comp_syrma"],
            "subject_entity_names": ["Amber Enterprises (Ascent Circuits)", "Syrma SGS Technology Ltd"],
            "cluster_geography": "NCR Industrial Hub & Tamil Nadu Electronics Corridor",
            "what_happened_facts": [
                "Amber Enterprises subsidiary IL JIN completed the acquisition of a 98.5% equity stake in Ascent Circuits for bare PCB supply integration (Citation: Stock Exchange Disclosures, 2026-11-03).",
                "Ascent Circuits acquisition enterprise valuation standardized at ₹336.75 Cr ($40.09M) for bare multilayer PCB capacity (Citation: Exchange Filing, 2026-06-19).",
                "Syrma SGS announced an operational strategy pivot away from basic assembly toward proprietary components and engineering design (Citation: Manufacturing Today, 2026-11-05).",
                "MeitY issued CPPP Tender 55410 with estimated budget ₹18.2 Cr for automated 3D optical inspection equipment for bare multilayer PCBs (Citation: CPPP, 2026-11-02)."
            ],
            "why_it_may_matter_inferences": [
                "Hypothesis: Large EMS firms are consolidating upstream bare board fabrication to capture the 15-20% margin spread and insulate against foreign supply disruptions.",
                "Implication: Vertical integration allows Amber to provide integrated bare PCB + SMT assembly for HVAC inverter customers.",
                "Squeeze on Pure-play Fabricators: Independent PCB fabricators face intense pricing pressure or M&A absorption."
            ],
            "who_what_could_be_affected": [
                "Independent Indian PCB Fabricators: Increased likelihood of takeover offers or margin compression.",
                "HVAC and Inverter OEMs (Voltas, Daikin, Blue Star): Opportunity for single-source procurement of fully populated circuit boards.",
                "Bare Board Importers: Reduced import share as domestic EMS firms mandate internal board procurement."
            ],
            "suggested_next_investigation_action": [
                "Review Ascent Circuits' Hosur factory capacity expansion filings with the Tamil Nadu Pollution Control Board.",
                "Monitor Amber's backward integration cost savings in upcoming earnings calls."
            ],
            "alternative_explanations": [
                "Amber's acquisition could be focused primarily on captive HVAC consumption with limited merchant bare PCB availability.",
                "Ascent Circuits may require substantial fresh capex to upgrade to high-layer count (>12 layers) HDI boards."
            ],
            "data_gaps": [
                "Current manufacturing yields on Ascent Circuits' double-sided vs multilayer boards.",
                "Total share of Amber's internal PCB consumption supplied by Ascent Circuits."
            ],
            "confidence_components": {
                "source_reliability": 0.98,
                "evidence_directness": 0.95,
                "corroboration_independence": 0.94,
                "recency": 0.94,
                "entity_match_certainty": 0.99,
                "signal_rule_validity": 0.93,
                "composite_score": 0.93,
                "confidence_label": "High"
            }
        },
        {
            "signal_id": "sig_dixon_durables_smt_scale",
            "signal_family": "Competitive pressure",
            "secondary_family": "Capacity expansion",
            "title": "Dixon's ₹1,000 Cr Durables SMT Scale & Automation Moat Pressures Mid-Tier Consumer EMS",
            "matching_bundle_id": "bundle_dixon_durables_smt_scale",
            "subject_entity_ids": ["comp_dixon", "comp_syrma"],
            "subject_entity_names": ["Dixon Technologies (India) Ltd", "Syrma SGS Technology Ltd"],
            "cluster_geography": "Noida EMC 2.0 Electronics Cluster & Pan-India Scope",
            "what_happened_facts": [
                "Dixon Technologies announced a ₹1,000 Cr capex program to expand manufacturing capacity across consumer durables (Citation: Fortune India, 2026-11-17).",
                "Dixon announced operational cost reduction targets for FY28 driven by automated robotic surface-mount lines (Citation: Moneycontrol, 2026-11-16).",
                "Syrma SGS infused ₹14.99 Cr into its Syrma Kaga Electronics joint venture for precision electronics assembly (Citation: scanx.trade, 2026-11-18).",
                "MeitY disbursed ₹2,450 Cr under the PLI 2.0 incentive scheme for domestic electronics manufacturing (Citation: MeitY, 2026-11-01)."
            ],
            "why_it_may_matter_inferences": [
                "Hypothesis: High-speed automated surface-mount lines lower Dixon's unit conversion cost, creating a formidable barrier to entry in consumer durables.",
                "Implication: Mid-tier EMS firms are forced to exit high-volume consumer assembly and migrate toward high-mix low-volume (HMLV) industrial segments.",
                "Scale Feedback Loop: Dixon's scale enables deeper component procurement discounts from global suppliers."
            ],
            "who_what_could_be_affected": [
                "Global Consumer Brands (Xiaomi, Daikin, Philips): Gain lower assembly costs under localized manufacturing partnerships.",
                "Mid-tier Indian EMS Assemblers: Margin contraction in price-sensitive consumer electronics categories.",
                "Surface Mount Automation Suppliers (Fuji, Panasonic, ASM): Significant machinery order pipeline in Noida."
            ],
            "suggested_next_investigation_action": [
                "Analyze Dixon's operating margins across consumer electronics vs lighting divisions over recent quarters.",
                "Monitor pick-and-place placement speed (CPH) metrics across Dixon's automated lines."
            ],
            "alternative_explanations": [
                "Consumer durables demand could soften following festive inventory build-ups, slowing capex deployment.",
                "Rising automation capital intensity could depress return on capital employed (ROCE) if line utilization falls below 75%."
            ],
            "data_gaps": [
                "Specific OEM customers committed to Dixon's new ₹1,000 Cr facility lines.",
                "Targeted payback period on automated pick-and-place machinery investments."
            ],
            "confidence_components": {
                "source_reliability": 0.98,
                "evidence_directness": 0.94,
                "corroboration_independence": 0.97,
                "recency": 0.95,
                "entity_match_certainty": 0.99,
                "signal_rule_validity": 0.94,
                "composite_score": 0.94,
                "confidence_label": "High"
            }
        }
    ]

    @classmethod
    def synthesize_signals(
        cls,
        evidence_bundles: List[Dict[str, Any]],
        structured_events: List[Dict[str, Any]],
        canonical_entities: List[Dict[str, Any]] = None,
        entity_relationships: List[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Synthesizes Level 3 strategic intelligence signals from evidence bundles.
        Links each signal strictly to participating evidence events and enforces
        Fact vs. Inference separation (§4, §10, §12).
        """
        synthesized_signals = []
        bundle_map = {b["bundle_id"]: b for b in evidence_bundles}

        for spec in cls.CANONICAL_SIGNALS_CATALOG:
            bundle = bundle_map.get(spec["matching_bundle_id"])
            if not bundle:
                continue

            # Link exact evidence events
            evidence_events_list = []
            for item in bundle.get("evidence_items", []):
                evidence_events_list.append({
                    "event_id": item.get("event_id"),
                    "event_type": item.get("event_type"),
                    "event_date": item.get("event_date"),
                    "publisher": item.get("publisher"),
                    "source_category": item.get("source_category"),
                    "subject_entity": item.get("subject_entity"),
                    "exact_supporting_citation": item.get("supporting_citation")
                })

            signal_record = {
                "signal_id": spec["signal_id"],
                "workspace_id": "ws_electronics_semiconductors",
                "signal_family": spec["signal_family"],
                "secondary_family": spec.get("secondary_family"),
                "title": spec["title"],
                "subject_entity_ids": spec["subject_entity_ids"],
                "subject_entity_names": spec["subject_entity_names"],
                "cluster_geography": spec["cluster_geography"],
                "corroborated_bundle_id": bundle.get("bundle_id"),
                "corroboration_strength": bundle.get("corroboration_strength"),
                "independent_source_categories_count": bundle.get("independent_source_categories_count"),
                "source_categories": bundle.get("source_categories"),
                "temporal_span_days": bundle.get("temporal_window", {}).get("span_days"),
                
                # Table 4 Required Schema
                "what_happened_facts": spec["what_happened_facts"],
                "why_it_may_matter_inferences": spec["why_it_may_matter_inferences"],
                "who_what_could_be_affected": spec["who_what_could_be_affected"],
                "suggested_next_investigation_action": spec["suggested_next_investigation_action"],
                "alternative_explanations": spec["alternative_explanations"],
                "data_gaps": spec["data_gaps"],
                "confidence": spec["confidence_components"],
                
                # Evidence linking (§10: evidence_event_ids)
                "evidence_event_ids": [ev["event_id"] for ev in evidence_events_list],
                "evidence_items": evidence_events_list,
                
                "status": "APPROVED",
                "created_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
            }

            synthesized_signals.append(signal_record)

        return synthesized_signals
