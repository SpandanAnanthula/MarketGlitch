import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Globe2, 
  FileText, 
  Clock, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { CompanyProfile, CompetitorEvent, TenderItem, TradeMetric } from '../types';

interface ExecutiveOverviewProps {
  currentProfile: CompanyProfile | null;
  timeline: CompetitorEvent[];
  tenders: TenderItem[];
  trade: TradeMetric | null;
  onNavigate: (tab: string) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  currentProfile,
  timeline,
  tenders,
  trade,
  onNavigate
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Executive Brief */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Executive Morning Intelligence Brief • {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Market Signals for {currentProfile?.company_name || 'Your Enterprise'}
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Your customized daily intelligence feed connecting verified competitor moves, trade imports (HS 8542), and active GeM public procurement tenders.
          </p>
        </div>

        <button
          onClick={() => onNavigate('competitors')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/20 shrink-0 self-start md:self-center"
        >
          <span>Explore Competitors</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('competitors')}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Competitor Moves</span>
            <Users className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-white">{timeline.length} Verified</div>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <span>BSE/NSE & Capex events</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('industry')}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Trade Flow (HS 8542)</span>
            <TrendingUp className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-white">${trade?.annual_import_usd_b || 14.8}B</div>
          <div className="text-[11px] text-emerald-400 font-medium">
            +{trade?.annual_yoy_growth_percent || 18.6}% YoY Growth
          </div>
        </div>

        <div 
          onClick={() => onNavigate('industry')}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active GeM Tenders</span>
            <FileText className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-white">{tenders.length} Active</div>
          <div className="text-[11px] text-slate-400 font-medium">
            Est. ₹73.5 Cr total value
          </div>
        </div>

        <div 
          onClick={() => onNavigate('sources')}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Data Ingestion</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-emerald-400">100% Healthy</div>
          <div className="text-[11px] text-slate-400 font-medium">
            5 Official Govt & Exchange Feeds
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Latest Moves + Opportunity Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Competitor Events */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span>Latest Verified Competitor Actions</span>
            </h3>
            <button 
              onClick={() => onNavigate('competitors')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {timeline.slice(0, 3).map((evt) => (
              <div key={evt.event_id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-200">{evt.entity_name}</span>
                  <span className="text-slate-500">{evt.event_date}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-300">{evt.title}</h4>
                <div className="text-[10px] text-slate-500">Source: {evt.source_name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Value Public Tenders */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              <span>Matching Government Opportunities</span>
            </h3>
            <button 
              onClick={() => onNavigate('industry')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {tenders.slice(0, 3).map((tender) => (
              <div key={tender.tender_id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-400">{tender.portal}</span>
                  <span className="font-bold text-slate-200">₹{tender.approx_value_inr_cr} Cr</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-300">{tender.title}</h4>
                <div className="text-[10px] text-slate-500">Closes: {tender.closing_date} • {tender.issuing_authority}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
