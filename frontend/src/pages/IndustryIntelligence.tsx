import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Globe2, 
  Layers, 
  Zap, 
  FileText, 
  ShieldCheck, 
  ArrowUpRight, 
  Building2, 
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TradeMetric, PolicyItem, PatentItem, TenderItem } from '../types';

interface IndustryIntelligenceProps {
  trade: TradeMetric | null;
  tenders: TenderItem[];
  policies: PolicyItem[];
  patents: PatentItem[];
}

export const IndustryIntelligence: React.FC<IndustryIntelligenceProps> = ({
  trade,
  tenders,
  policies,
  patents
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'segments' | 'forecast'>('overview');

  // Trade data for sparkline chart
  const tradeSparkline = trade?.monthly_trend.map(m => ({
    month: m.month.split(' ')[0],
    imports: m.import_value_usd_m,
    exports: m.export_value_usd_m
  })) || [
    { month: 'Jun', imports: 1120, exports: 184 },
    { month: 'Jul', imports: 1210, exports: 198 },
    { month: 'Aug', imports: 1295, exports: 224 },
    { month: 'Sep', imports: 1340, exports: 251 },
    { month: 'Oct', imports: 1412, exports: 289 },
    { month: 'Nov', imports: 1465, exports: 312 }
  ];

  // ISM 2026-2030 Projections
  const forecastData = [
    { year: '2024', domestic_production_usd_b: 15.2, imports_usd_b: 22.4 },
    { year: '2025', domestic_production_usd_b: 21.0, imports_usd_b: 24.1 },
    { year: '2026 (E)', domestic_production_usd_b: 32.5, imports_usd_b: 26.8 },
    { year: '2027 (P)', domestic_production_usd_b: 48.0, imports_usd_b: 25.2 },
    { year: '2028 (P)', domestic_production_usd_b: 65.0, imports_usd_b: 22.0 },
    { year: '2030 (Goal)', domestic_production_usd_b: 110.0, imports_usd_b: 18.5 }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* TOP HEADER (Replicating Image 6) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Industry Intelligence
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Deep dive into Indian electronics, semiconductor trade flows, and manufacturing policies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
            HS 8542 & 8541 Verified
          </span>
        </div>
      </div>

      {/* NAVIGATION TABS (Replicating Image 6: Overview, Trends, Segments, Forecast) */}
      <div className="flex items-center gap-6 border-b border-slate-200/80 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'overview'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'trends'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Trade & Trends
        </button>
        <button
          onClick={() => setActiveTab('segments')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'segments'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Segments
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'forecast'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Forecast
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW (Replicating Image 6 Layout Exactly)                      */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT & MIDDLE COLUMNS (8 Cols): Metric Card, Key Trends, Top Subsectors */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ROW 1: Market Size Card & Key Trends Card Side-by-Side (Image 6) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Card 1: Industry Market Size (Image 6) */}
              <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-500">Industry Market Size</div>
                  <div className="text-3xl font-black text-slate-900">$1.2T</div>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+8.4% YoY</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    India IC Imports: $14.8B (HS 8542) • +18.6% YoY
                  </div>
                </div>

                {/* Curved area sparkline chart (Image 6) */}
                <div className="h-24 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={tradeSparkline}>
                      <defs>
                        <linearGradient id="sizeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#818CF8" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="imports" 
                        stroke="#0284C7" 
                        strokeWidth={2.5} 
                        fillOpacity={1} 
                        fill="url(#sizeGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Card 2: Key Trends (Image 6) */}
              <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4">
                <div className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Key Trends
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800">
                        Accelerating Dholera Fab Tooling
                      </div>
                      <div className="text-[11px] text-slate-500 leading-snug">
                        $5B–$6B equipment orders pull cleanroom sub-tier suppliers
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800">
                        55% Local Content Mandate
                      </div>
                      <div className="text-[11px] text-slate-500 leading-snug">
                        Class 1 domestic preference drives high-mix defense & railway SMT
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Globe2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800">
                        SiC & GaN Power Packaging Localization
                      </div>
                      <div className="text-[11px] text-slate-500 leading-snug">
                        Automotive EV inverter assemblers pivot to local OSAT JVs
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 2: Top Subsectors Progress Bars (Image 6: Top Industries) */}
            <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Top Indian Electronics Subsectors</h3>
                <span className="text-xs font-semibold text-slate-400">Domestic Production Share</span>
              </div>

              <div className="space-y-4 pt-1">
                {/* Subsector 1 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>High-Speed SMT PCB Assembly</span>
                    <span className="text-indigo-600">38%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 w-[38%]"></div>
                  </div>
                </div>

                {/* Subsector 2 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Bare Multilayer PCB Fabrication</span>
                    <span className="text-indigo-600">28%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 w-[28%]"></div>
                  </div>
                </div>

                {/* Subsector 3 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Discrete Semiconductor & OSAT Packaging</span>
                    <span className="text-indigo-600">24%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 w-[24%]"></div>
                  </div>
                </div>

                {/* Subsector 4 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Passive Components & Magnetics</span>
                    <span className="text-indigo-600">10%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-slate-300 w-[10%]"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (4 Cols: Skyscraper Architectural Card matching Image 6) */}
          <div className="lg:col-span-4 rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 to-indigo-950 text-white p-6 relative flex flex-col justify-between shadow-lg min-h-[460px]">
            {/* Ambient Graphic Background */}
            <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 50% 30%, #818CF8, transparent)" }}></div>
            
            <div className="relative z-10 space-y-4">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider text-indigo-200">
                Strategic Outlook 2026-2030
              </span>
              <h3 className="text-xl font-black leading-tight text-white">
                India Semiconductor Mission (ISM) Wave 2.0
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                The government's ₹76,000 Cr incentive scheme shifts from anchor fab subsidies to domestic packaging, compound semiconductors, and equipment component manufacturing.
              </p>
            </div>

            <div className="relative z-10 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
              <div className="text-[11px] font-semibold text-indigo-200">Key Milestone Ahead:</div>
              <div className="text-xs font-bold text-white leading-snug">
                Tata-PSMC Dholera commercial wafer pilot expected Q4 2026.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TRADE & TRENDS (HS 8542 & HS 8541 Import Analytics)               */}
      {/* ========================================================================= */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Trade Trend Curve (8 Cols) */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">HS 8542: Electronic Integrated Circuits</h3>
                  <p className="text-xs text-slate-500">Monthly import vs. export value ($ Million USD)</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                  DGCIS Official Data
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tradeSparkline}>
                    <defs>
                      <linearGradient id="importGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="exportGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderRadius: '16px', color: '#fff', fontSize: '12px' }} 
                      formatter={(val: any, name: any) => [`$${val} M`, name === 'imports' ? 'Imports' : 'Exports']}
                    />
                    <Area type="monotone" dataKey="imports" stroke="#6366F1" strokeWidth={2.5} fill="url(#importGrad)" name="imports" />
                    <Area type="monotone" dataKey="exports" stroke="#10B981" strokeWidth={2.5} fill="url(#exportGrad)" name="exports" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Supplying Nations Breakdown (4 Cols) */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4">
              <div className="pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Key Origin Nations</h3>
                <p className="text-xs text-slate-500">Market share of Indian semiconductor imports</p>
              </div>

              <div className="space-y-3">
                {[
                  { nation: 'China', share: '38%', bar: '38%', color: 'bg-rose-500' },
                  { nation: 'Taiwan', share: '24%', bar: '24%', color: 'bg-indigo-600' },
                  { nation: 'Vietnam', share: '15%', bar: '15%', color: 'bg-emerald-500' },
                  { nation: 'Singapore', share: '9%', bar: '9%', color: 'bg-amber-500' },
                  { nation: 'Others', share: '14%', bar: '14%', color: 'bg-slate-400' }
                ].map((n, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>{n.nation}</span>
                      <span className="font-bold text-slate-900">{n.share}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${n.color}`} style={{ width: n.bar }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SEGMENTS (EMS, OSAT, Bare PCBs)                                   */}
      {/* ========================================================================= */}
      {activeTab === 'segments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              High-Speed SMT
            </span>
            <h3 className="text-lg font-bold text-slate-900">Integrated EMS</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dominated by Dixon, Kaynes, Syrma, and Foxconn. High capital investment in high-speed pick-and-place surface mount automation lines.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <div>Market Size: <strong>₹62,000 Cr</strong></div>
              <div>Domestic Content: <strong>32%–45%</strong></div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
              Bare Multilayer PCB
            </span>
            <h3 className="text-lg font-bold text-slate-900">PCB Fabrication</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consolidation underway with Amber acquiring 98.5% Ascent Circuits. Key bottlenecks in copper clad laminate sourcing and HDI micro-vias.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <div>Market Size: <strong>₹18,500 Cr</strong></div>
              <div>Domestic Content: <strong>22%–30%</strong></div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
              OSAT & Discrete Packaging
            </span>
            <h3 className="text-lg font-bold text-slate-900">Power Modules & OSAT</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Emerging high-margin segment driven by SiC/GaN discrete power packaging for EV inverters and solar converters.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <div>Market Size: <strong>₹8,400 Cr</strong></div>
              <div>Domestic Content: <strong>15%–25%</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FORECAST (ISM 2026-2030 Projections)                               */}
      {/* ========================================================================= */}
      {activeTab === 'forecast' && (
        <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">India Semiconductor Mission (ISM) 2030 Trajectory</h3>
              <p className="text-xs text-slate-500">Projected Domestic Production vs. Import Dependency ($ Billion USD)</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">
              MeitY & DPIIT Target
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData}>
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '16px', color: '#fff', fontSize: '12px' }} 
                  formatter={(val: any, name: any) => [`$${val}B`, name === 'domestic_production_usd_b' ? 'Domestic Output' : 'Imports']}
                />
                <Bar dataKey="domestic_production_usd_b" fill="#6366F1" radius={[6, 6, 0, 0]} name="domestic_production_usd_b" />
                <Bar dataKey="imports_usd_b" fill="#CBD5E1" radius={[6, 6, 0, 0]} name="imports_usd_b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
};
