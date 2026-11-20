import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  Plus, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { CompetitorCandidate, CompetitorEvent } from '../types';
import { api } from '../services/api';

interface CompetitorWorkspaceProps {
  candidates: CompetitorCandidate[];
  timeline: CompetitorEvent[];
  onRefresh: () => void;
}

export const CompetitorWorkspace: React.FC<CompetitorWorkspaceProps> = ({
  candidates,
  timeline,
  onRefresh
}) => {
  const [followedIds, setFollowedIds] = useState<string[]>(['comp_dixon', 'comp_kaynes']);

  const handleAction = async (candidate: CompetitorCandidate, action: 'follow' | 'dismiss') => {
    if (action === 'follow') {
      setFollowedIds([...followedIds, candidate.entity_id]);
    } else {
      setFollowedIds(followedIds.filter(id => id !== candidate.entity_id));
    }
    await api.watchlistAction(candidate.entity_id, candidate.company_name, action);
    onRefresh();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Level 1 Identity */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Level 1 • Company & Competitor Intelligence</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">Competitor Discovery & Sourced Event Timeline</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Every candidate is recommended with explicit business reason codes. Observed moves are backed by verified BSE, GeM, and regulatory records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
            <span className="text-slate-400">Tracked Watchlist: </span>
            <span className="font-bold text-emerald-400">{followedIds.length} Companies</span>
          </div>
        </div>
      </div>

      {/* Grid: Recommended Competitors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <span>AI-Recommended Competitors ({candidates.length})</span>
            </h2>
            <p className="text-xs text-slate-400">Filtered for your sector, operating geography, and target customer overlap.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {candidates.map((comp) => {
            const isFollowed = followedIds.includes(comp.entity_id);
            return (
              <div
                key={comp.entity_id}
                className={`p-5 rounded-2xl border transition-all ${
                  isFollowed
                    ? 'bg-slate-900/90 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">{comp.company_name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {comp.subsector}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      HQ: <span className="text-slate-300 font-medium">{comp.headquarters}</span> • Approx Rev: <span className="text-slate-300 font-medium">{comp.approx_revenue_inr_cr}</span>
                    </p>
                  </div>

                  {isFollowed ? (
                    <button
                      onClick={() => handleAction(comp, 'dismiss')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Tracking</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(comp, 'follow')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Track</span>
                    </button>
                  )}
                </div>

                {/* Reason Code (Crucial PRD requirement from 4 & Zero-Hallucination Guardrail) */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Why Recommended:</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {comp.reason_code}
                  </p>
                </div>

                {/* Match Dimensions */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {comp.match_dimensions.map((dim, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/60 text-slate-400 text-[10px] font-medium"
                    >
                      {dim}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sourced Event Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span>Verified Competitor Event Timeline</span>
            </h2>
            <p className="text-xs text-slate-400">Chronological feed of verified corporate actions, plant groundbreakings, and hiring signals.</p>
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Zero Unverified Rumors</span>
          </span>
        </div>

        <div className="space-y-3">
          {timeline.map((evt) => (
            <div
              key={evt.event_id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition space-y-2"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-xs text-white">{evt.entity_name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    evt.event_type === 'capex' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                    evt.event_type === 'expansion' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
                    evt.event_type === 'hiring' ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20' :
                    'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                  }`}>
                    {evt.event_type}
                  </span>
                  <span className="text-[11px] text-slate-500">• {evt.event_date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Confidence: {evt.confidence}
                  </span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-200">{evt.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{evt.summary}</p>

              {/* Source Link */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60">
                <span className="flex items-center gap-1">
                  Source: <span className="text-slate-400 font-medium">{evt.source_name}</span>
                </span>
                <a
                  href={evt.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  <span>View Original Record</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
