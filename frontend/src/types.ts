export interface CompanyProfile {
  workspace_id?: string;
  company_name: string;
  website?: string;
  email?: string;
  description: string;
  sector: string;
  subsector?: string;
  products: string[];
  regions: string[];
  customer_segments: string[];
  market_share?: string;
  annual_revenue?: string;
  growth_rate?: string;
}

export interface CompetitorCandidate {
  entity_id: string;
  company_name: string;
  subsector: string;
  headquarters: string;
  approx_revenue_inr_cr?: string;
  products: string[];
  relevance_score: number;
  reason_code: string;
  match_dimensions: string[];
  price_inr?: number;
  market_cap_crores?: number;
}

export interface CompetitorEvent {
  event_id: string;
  entity_id: string;
  entity_name: string;
  event_type: 'capex' | 'expansion' | 'hiring' | 'regulatory' | 'patent' | 'financial' | 'partnership' | 'trade' | 'tender';
  title: string;
  summary: string;
  event_date: string;
  source_name: string;
  source_url: string;
  confidence: 'High' | 'Medium' | 'Low';
  facts?: string[];
  inferences?: string[];
}

export interface TradeDataPoint {
  month: string;
  import_value_usd_m: number;
  export_value_usd_m: number;
  top_origin: string;
}

export interface TradeMetric {
  hs_code: string;
  commodity_title: string;
  annual_import_usd_b: number;
  annual_yoy_growth_percent: number;
  key_supplying_nations: string[];
  monthly_trend: TradeDataPoint[];
}

export interface TenderItem {
  tender_id: string;
  title: string;
  issuing_authority: string;
  portal: string;
  approx_value_inr_cr: number;
  published_date: string;
  closing_date: string;
  location: string;
  relevant_subsectors: string[];
  source_url: string;
}

export interface PolicyItem {
  policy_id: string;
  title: string;
  authority: string;
  summary: string;
  date_notified: string;
  impact_level: 'High' | 'Medium' | 'Low';
  relevant_subsectors: string[];
  source_url: string;
}

export interface PatentItem {
  patent_id: string;
  title: string;
  applicant: string;
  publication_date: string;
  ipc_code: string;
  summary: string;
  journal_source: string;
  source_url: string;
}

export interface SourceItem {
  source_id: string;
  name: string;
  publisher: string;
  domain: string;
  source_type: string;
  refresh_frequency: string;
  last_fetched_at: string;
  records_count: number;
  reliability_score: number;
  status: 'healthy' | 'periodic' | 'degraded';
  access_method: string;
}

export interface StrategicSignal {
  signal_id: string;
  workspace_id: string;
  signal_family: string;
  secondary_family?: string;
  title: string;
  subject_entity_ids: string[];
  subject_entity_names: string[];
  cluster_geography: string;
  corroborated_bundle_id: string;
  corroboration_strength: string;
  independent_source_categories_count: number;
  source_categories: string[];
  temporal_span_days: number;
  what_happened_facts: string[];
  why_it_may_matter_inferences: string[];
  who_what_could_be_affected: string[];
  suggested_next_investigation_action: string[];
  alternative_explanations: string[];
  data_gaps: string[];
  confidence: {
    source_reliability: number;
    evidence_directness: number;
    corroboration_independence: number;
    recency: number;
    entity_match_certainty: number;
    signal_rule_validity: number;
    composite_score: number;
    confidence_label: 'High' | 'Medium' | 'Low';
  };
  evidence_event_ids: string[];
  evidence_items?: Array<{
    event_id: string;
    event_type: string;
    event_date: string;
    publisher: string;
    source_category: string;
    subject_entity: string;
    exact_supporting_citation: string;
  }>;
  status: string;
  created_at: string;
}

export interface WorkspaceAlert {
  alert_id: string;
  workspace_id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  signal_family: string;
  title: string;
  primary_hypothesis: string;
  immediate_action: string;
  subject_entities: string[];
  created_at: string;
}

export type TimelineFilter = 'present_week' | 'past_week' | 'all';
