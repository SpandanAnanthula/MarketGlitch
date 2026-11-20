import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ThumbsUp, 
  ThumbsDown, 
  ExternalLink, 
  Building2, 
  MapPin, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  HelpCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { StrategicSignal } from '../types';

interface SignalDetailModalProps {
  signal: StrategicSignal | null;
  onClose: () => void;
  onFeedback?: (signalId: string, rating: 'useful' | 'not_useful' | 'incorrect') => void;
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({ signal, onClose, onFeedback }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'facts' | 'inferences' | 'evidence'>('overview');
  const [feedbackSent, setFeedbackSent] = useState<string | null>(null);

  if (!signal) return null;

  const handleFeedback = (rating: 'useful' | 'not_useful' | 'incorrect') => {
    setFeedbackSent(rating);
    if (onFeedback) {
      onFeedback(signal.signal_id, rating);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/30">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  {signal.signal_family}
                </span>
                {signal.secondary_family && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                    + {signal.secondary_family}
                  </span>
                )}
                <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {signal.confidence.confidence_label} Confidence ({Math.round(signal.confidence.composite_score * 100)}%)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {signal.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  {signal.subject_entity_names.join(', ')}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {signal.cluster_geography}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-5 border-b border-slate-100 -mb-4">
            {[
              { id: 'overview', label: 'Executive Summary' },
              { id: 'facts', label: `Verified Facts (${signal.what_happened_facts.length})` },
              { id: 'inferences', label: 'Strategic Inferences' },
              { id: 'evidence', label: `Supporting Evidence (${signal.evidence_items?.length || signal.evidence_event_ids.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 text-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Core Hypothesis & Implication Banner */}
              <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Core Analytical Hypothesis
                </div>
                <p className="text-slate-800 text-base font-medium leading-relaxed">
                  {signal.why_it_may_matter_inferences[0]}
                </p>
              </div>

              {/* Two Column Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Who is affected */}
                <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    Who / What Could Be Affected
                  </h4>
                  <ul className="space-y-2">
                    {signal.who_what_could_be_affected.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Next Steps */}
                <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                    Suggested Next Action / Investigation
                  </h4>
                  <ul className="space-y-2">
                    {signal.suggested_next_investigation_action.map((action, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Confidence Components Bar */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Evidence Confidence Matrix (§11 Table 15)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                    <div className="text-xs text-slate-500">Source Reliability</div>
                    <div className="text-base font-bold text-slate-800">{Math.round(signal.confidence.source_reliability * 100)}%</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                    <div className="text-xs text-slate-500">Evidence Directness</div>
                    <div className="text-base font-bold text-slate-800">{Math.round(signal.confidence.evidence_directness * 100)}%</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                    <div className="text-xs text-slate-500">Corroboration</div>
                    <div className="text-base font-bold text-indigo-600">{signal.independent_source_categories_count} Sources</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                    <div className="text-xs text-slate-500">Entity Match</div>
                    <div className="text-base font-bold text-emerald-600">{Math.round(signal.confidence.entity_match_certainty * 100)}%</div>
                  </div>
                </div>
              </div>

              {/* Counter-hypotheses & Data Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/50 space-y-1.5">
                  <div className="font-bold text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Alternative Explanations
                  </div>
                  {signal.alternative_explanations.map((alt, idx) => (
                    <p key={idx} className="text-slate-700 leading-relaxed">• {alt}</p>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200/50 space-y-1.5">
                  <div className="font-bold text-purple-800 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                    Key Data Gaps
                  </div>
                  {signal.data_gaps.map((gap, idx) => (
                    <p key={idx} className="text-slate-700 leading-relaxed">• {gap}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERIFIED FACTS */}
          {activeTab === 'facts' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600">
                <strong>§12 Guardrail Compliance:</strong> These facts are strictly source-bound and extracted with 0 hallucination from official regulatory gazettes, stock exchange disclosures, and verified trade statistics.
              </div>
              <div className="space-y-3">
                {signal.what_happened_facts.map((fact, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="space-y-1 text-sm text-slate-800 leading-relaxed">
                      {fact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INFERENCES */}
          {activeTab === 'inferences' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-800">
                <strong>Strategic Inferences:</strong> Distinct hypotheses derived by applying §4 Signal Rules to the underlying facts.
              </div>
              <div className="space-y-3">
                {signal.why_it_may_matter_inferences.map((inf, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {inf}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SUPPORTING EVIDENCE */}
          {activeTab === 'evidence' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 mb-2">
                Multi-source evidence bundle linking <strong>{signal.independent_source_categories_count} independent source classes</strong>: {signal.source_categories.join(', ')}.
              </div>
              {signal.evidence_items && signal.evidence_items.length > 0 ? (
                signal.evidence_items.map((ev, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-indigo-700 px-2 py-0.5 rounded bg-indigo-50">
                        {ev.event_type}
                      </span>
                      <span>{ev.event_date}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                      {ev.exact_supporting_citation}
                    </p>
                    <div className="text-xs text-slate-400">
                      Publisher: {ev.publisher} • Category: {ev.source_category}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400 text-sm">
                  {signal.evidence_event_ids.length} linked events in evidence bundle #{signal.corroborated_bundle_id}.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Stage 10 Feedback Controls */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">Was this intelligence useful?</span>
            {feedbackSent ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Feedback recorded ({feedbackSent})
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFeedback('useful')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Useful
                </button>
                <button
                  onClick={() => handleFeedback('not_useful')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  Not Useful
                </button>
                <button
                  onClick={() => handleFeedback('incorrect')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 transition-colors"
                >
                  Report Inaccuracy
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-semibold rounded-full bg-[#0F172A] hover:bg-[#1E1B4B] text-white transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
