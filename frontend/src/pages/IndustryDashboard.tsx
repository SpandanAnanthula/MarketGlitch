import React, { useState } from 'react';
import { 
  Globe2, 
  TrendingUp, 
  FileText, 
  Landmark, 
  Lightbulb, 
  ExternalLink, 
  MapPin, 
  Calendar,
  Layers,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { TradeMetric, TenderItem, PolicyItem, PatentItem } from '../types';

interface IndustryDashboardProps {
  trade: TradeMetric | null;
  tenders: TenderItem[];
  policies: PolicyItem[];
  patents: PatentItem[];
}

export const IndustryDashboard: React.FC<IndustryDashboardProps> = ({
  trade,
  tenders,
  policies,
  patents
}) => {
  const [subTab, setSubTab] = useState<'trade' | 'tenders' | 'policy' | 'patents'>('trade');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Level 2 Identity */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Globe2 className="h-4 w-4" />
            <span>Level 2 • Industry Intelligence</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">Macro Pulse: Trade, Tenders & Technology Watch</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Consolidating Commerce Department customs trade flows, GeM/CPPP government procurement bids, and MeitY industrial incentives.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Sector Size</div>
            <div className="text-sm font-black text-white mt-0.5">₹1,85,000 Cr</div>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-[10px] text-emerald-400 font-semibold uppercase">YoY CAGR</div>
            <div className="text-sm font-black text-emerald-300 mt-0.5">+22.4%</div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-800 gap-2">
        {[
          { id: 'trade', label: 'Trade Analytics (HS 8542)', icon: BarChart3, count: 'Commerce Portal' },
          { id: 'tenders', label: 'Government Tenders', icon: FileText, count: `${tenders.length} Active Bids` },
          { id: 'policy', label: 'Policy & PLI Watch', icon: Landmark, count: `${policies.length} Policies` },
          { id: 'patents', label: 'IP India Patents', icon: Lightbulb, count: `${patents.length} Published` },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition ${
                isActive
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab Content */}
      {subTab === 'trade' && trade && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Area */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Monthly Import/Export Volume (USD Millions)</h3>
                  <p className="text-xs text-slate-400">HS Code 8542 — Electronic Integrated Circuits & Microassemblies</p>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  +18.6% YoY Growth
                </span>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trade.monthly_trend}>
                    <defs>
                      <linearGradient id="importGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="exportGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} unit="M$" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '11px', color: '#f8fafc' }}
                    />
                    <Area type="monotone" dataKey="import_value_usd_m" name="Imports ($M)" stroke="#22c55e" fillOpacity={1} fill="url(#importGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="export_value_usd_m" name="Exports ($M)" stroke="#38bdf8" fillOpacity={1} fill="url(#exportGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Supplying Nations Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Top Supplying Nations</h3>
                <p className="text-xs text-slate-400">Share of raw IC imports by value</p>
              </div>

              <div className="space-y-3 pt-2">
                {trade.key_supplying_nations.map((nat, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
                    <span className="font-semibold text-slate-200">{nat.split('(')[0]}</span>
                    <span className="text-emerald-400 font-bold">{nat.match(/\((.*?)\)/)?.[1] || ''}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <span className="text-slate-300 font-semibold">Strategic Sourcing Shift:</span> Taiwan share grew from 19% to 24% over the last two quarters due to local OSAT packaging MoUs.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab: Tenders */}
      {subTab === 'tenders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {tenders.map((tender) => (
              <div
                key={tender.tender_id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {tender.portal} Verified
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{tender.tender_id}</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-400 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
                    Est. Value: ₹{tender.approx_value_inr_cr} Cr
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white">{tender.title}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-400">
                  <div>Authority: <span className="text-slate-200 font-medium">{tender.issuing_authority}</span></div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    <span>{tender.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-500" />
                    <span>Closes: <span className="text-rose-400 font-medium">{tender.closing_date}</span></span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                  <div className="flex gap-1.5">
                    {tender.relevant_subsectors.map((sec, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                        {sec}
                      </span>
                    ))}
                  </div>
                  <a
                    href={tender.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <span>View Bid on {tender.portal}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab: Policy */}
      {subTab === 'policy' && (
        <div className="space-y-4">
          {policies.map((pol) => (
            <div
              key={pol.policy_id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {pol.authority}
                  </span>
                  <span className="text-xs text-slate-400">Notified: {pol.date_notified}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  Impact: {pol.impact_level}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{pol.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{pol.summary}</p>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                <div className="flex gap-1.5">
                  {pol.relevant_subsectors.map((sec, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                      {sec}
                    </span>
                  ))}
                </div>
                <a
                  href={pol.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <span>Read Official Notification</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-tab: Patents */}
      {subTab === 'patents' && (
        <div className="space-y-4">
          {patents.map((pat) => (
            <div
              key={pat.patent_id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                    IP India Gazette
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{pat.patent_id}</span>
                </div>
                <span className="text-xs text-slate-400">Class: <span className="font-mono text-slate-300">{pat.ipc_code}</span></span>
              </div>

              <h3 className="text-sm font-bold text-white">{pat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{pat.summary}</p>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                <div className="text-slate-400">
                  Applicant: <span className="text-slate-200 font-semibold">{pat.applicant}</span>
                </div>
                <a
                  href={pat.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <span>{pat.journal_source}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
