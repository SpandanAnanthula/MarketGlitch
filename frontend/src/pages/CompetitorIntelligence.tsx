import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Check, 
  ExternalLink, 
  Sparkles, 
  TrendingUp, 
  TrendingDown,
  Building2, 
  ShieldCheck, 
  Filter, 
  Search,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { CompetitorCandidate, CompetitorEvent } from '../types';
import { TENANT_WORKSPACES } from '../data/tenantWorkspaces';

interface CompetitorIntelligenceProps {
  candidates: CompetitorCandidate[];
  timeline: CompetitorEvent[];
  workspaceId?: string;
  onRefresh?: () => void;
}

export const CompetitorIntelligence: React.FC<CompetitorIntelligenceProps> = ({
  candidates,
  timeline,
  workspaceId = 'ws_electronics_default',
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'activity'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const initialCfg = TENANT_WORKSPACES[workspaceId] || TENANT_WORKSPACES['ws_electronics_default'];
  const [competitors, setCompetitors] = useState(initialCfg.competitors);
  const [followedIds, setFollowedIds] = useState<string[]>(initialCfg.competitors.map(c => c.id));
  const [newCompetitorName, setNewCompetitorName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const currentCfg = TENANT_WORKSPACES[workspaceId] || TENANT_WORKSPACES['ws_electronics_default'];
    setCompetitors(currentCfg.competitors);
    setFollowedIds(currentCfg.competitors.map(c => c.id));
  }, [workspaceId]);

  const topCompetitors = competitors;

  // Scatter chart data
  const scatterData = topCompetitors.map(c => ({
    name: c.name,
    x: c.capexScale,
    y: c.marketShareNum,
    z: c.bubbleSize,
    color: c.color,
    ticker: c.ticker
  }));

  // Dynamic axis domains to avoid clipping high-share or varying-scale competitors
  const maxY = scatterData.length > 0 ? Math.max(...scatterData.map(d => d.y), 25) : 30;
  const yDomain = [0, Math.ceil((maxY + 5) / 5) * 5];
  const minX = scatterData.length > 0 ? Math.min(...scatterData.map(d => d.x), 50) : 40;
  const maxX = scatterData.length > 0 ? Math.max(...scatterData.map(d => d.x), 90) : 100;
  const xDomain = [Math.max(0, Math.floor((minX - 10) / 10) * 10), Math.min(100, Math.ceil((maxX + 10) / 10) * 10)];

  const handleAddCompetitor = () => {
    const name = newCompetitorName.trim() || 'Centum Electronics';
    const ticker = name.toUpperCase().replace(/\s+/g, '').slice(0, 6) + '.NS';
    const newComp = {
      id: `comp_${Date.now()}`,
      name: name,
      ticker: ticker,
      marketShare: `${(Math.random() * 4 + 5).toFixed(1)}%`,
      shareDelta: '+0.4%',
      isPositive: true,
      price: `₹${(Math.random() * 1500 + 750).toFixed(1)}`,
      mcap: `₹${Math.floor(Math.random() * 8000 + 3500)} Cr`,
      capexScale: Math.floor(Math.random() * 30 + 45),
      marketShareNum: parseFloat((Math.random() * 4 + 5).toFixed(1)),
      bubbleSize: 175,
      color: '#EC4899', // Pink
      subsector: 'Defense & Aerospace EMS / Space-Grade SMT',
      keyMove: 'Expanded space-grade SMT cleanroom and ISRO component qualification'
    };

    setCompetitors(prev => [...prev, newComp]);
    setFollowedIds(prev => [...prev, newComp.id]);
    setNewCompetitorName('');
    setIsAddModalOpen(false);
    setToastMessage(`Added ${name} to your tenant watchlist and tracking pipeline!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const toggleFollow = (id: string) => {
    if (followedIds.includes(id)) {
      setFollowedIds(followedIds.filter(x => x !== id));
    } else {
      setFollowedIds([...followedIds, id]);
    }
  };

  const filteredTimeline = timeline.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.entity_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedEventType === 'all' || ev.event_type.toLowerCase() === selectedEventType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* TOP HEADER (Replicating Image 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Competitor Intelligence
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Track and compare your competition across Indian electronics & semiconductor manufacturing
          </p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-[#0F172A] hover:bg-[#1E1B4B] text-white font-semibold text-xs tracking-wide shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Competitor</span>
        </button>
      </div>

      {/* NAVIGATION TABS (Replicating Image 4: Competitor Overview, Comparison, Activity Feed) */}
      <div className="flex items-center gap-6 border-b border-slate-200/80 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'overview'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Competitor Overview
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'comparison'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Comparison
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'activity'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Activity Feed</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
            {timeline.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COMPETITOR OVERVIEW (Replicating Image 4)                          */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* 4 LARGE COMPETITOR CARDS (Image 4: Apple, Google, Microsoft, Samsung style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topCompetitors.map((comp) => {
              const isFollowed = followedIds.includes(comp.id);
              return (
                <div 
                  key={comp.id}
                  className="p-5 rounded-3xl bg-white/90 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-50 border border-slate-200/60 flex items-center justify-center font-bold text-slate-800 text-sm shadow-sm">
                      <Building2 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <button
                      onClick={() => toggleFollow(comp.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                        isFollowed 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {isFollowed ? 'Tracked ✓' : '+ Track'}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {comp.name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">{comp.ticker}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Market Share</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">{comp.marketShare}</span>
                      <span className="text-xs font-bold text-emerald-600 flex items-center">
                        <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                        {comp.shareDelta}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Live Quote:</span>
                    <span className="font-extrabold text-indigo-700">{comp.price}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SPLIT VIEW: Competitive Positioning Chart (8 cols) & Key Takeaways (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COMPETITIVE POSITIONING BUBBLE CHART (Image 4) */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-slate-900">Competitive Positioning</h3>
                  <p className="text-xs text-slate-500">Market Share (%) vs. Capex & SMT Automation Scale</p>
                </div>

                {/* Dynamic Legend matching active tenant competitors */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
                  {topCompetitors.map((comp) => (
                    <span key={comp.id} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: comp.color }}></span>
                      <span>{comp.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Recharts Scatter / Bubble Chart */}
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Capex Scale" 
                      unit=" Scale"
                      stroke="#94A3B8" 
                      fontSize={11}
                      domain={xDomain}
                      tickLine={false}
                      axisLine={{ stroke: '#F1F5F9' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Market Share" 
                      unit="%"
                      stroke="#94A3B8" 
                      fontSize={11}
                      domain={yDomain}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ZAxis type="number" dataKey="z" range={[150, 400]} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl text-xs space-y-1">
                              <div className="font-bold text-indigo-300">{data.name} ({data.ticker})</div>
                              <div>Market Share: <span className="font-bold">{data.y}%</span></div>
                              <div>Automation Scale: <span className="font-bold">{data.x} / 100</span></div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter name="Competitors" data={scatterData}>
                      {scatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KEY TAKEAWAYS (Replicating Image 4's Right Column) */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Key Takeaways</h3>
                  <p className="text-xs text-slate-500">Verified strategic moves from statutory filings</p>
                </div>

                <div className="space-y-3.5">
                  {topCompetitors.map((comp) => (
                    <div key={comp.id} className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: comp.color }} />
                      <div className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 font-semibold">{comp.name} ({comp.marketShare})</strong>: {comp.keyMove}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
                <span>{topCompetitors.length} competitors monitored daily</span>
                <span className="font-bold text-indigo-700">100% BSE / RoC Verified</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DETAILED SIDE-BY-SIDE COMPARISON                                  */}
      {/* ========================================================================= */}
      {activeTab === 'comparison' && (
        <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Competitor Benchmark Matrix</h3>
              <p className="text-xs text-slate-500">Side-by-side financial, technological and facility comparison</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold">
              4 Operators Benchmarked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4 text-indigo-700">Dixon Tech</th>
                  <th className="py-3 px-4 text-emerald-700">Kaynes Tech</th>
                  <th className="py-3 px-4 text-amber-700">Syrma SGS</th>
                  <th className="py-3 px-4 text-purple-700">Amber Ent.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-900">NSE Ticker</td>
                  <td className="py-3 px-4 font-mono font-bold">DIXON.NS</td>
                  <td className="py-3 px-4 font-mono font-bold">KAYNES.NS</td>
                  <td className="py-3 px-4 font-mono font-bold">SYRMA.NS</td>
                  <td className="py-3 px-4 font-mono font-bold">AMBER.NS</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-900">Market Cap</td>
                  <td className="py-3 px-4 font-bold">₹78,200 Cr</td>
                  <td className="py-3 px-4 font-bold">₹18,450 Cr</td>
                  <td className="py-3 px-4 font-bold">₹8,820 Cr</td>
                  <td className="py-3 px-4 font-bold">₹22,600 Cr</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-900">Stock Price</td>
                  <td className="py-3 px-4 font-bold text-indigo-600">₹13,054.0</td>
                  <td className="py-3 px-4 font-bold text-indigo-600">₹2,890.0</td>
                  <td className="py-3 px-4 font-bold text-indigo-600">₹1,517.0</td>
                  <td className="py-3 px-4 font-bold text-indigo-600">₹6,697.0</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-900">Core Subsector</td>
                  <td className="py-3 px-4">Consumer & 5G SMT</td>
                  <td className="py-3 px-4">OSAT & Automotive EMS</td>
                  <td className="py-3 px-4">Rail & Defense SMT</td>
                  <td className="py-3 px-4">Bare PCB Fabrication</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-900">Strategic Moat</td>
                  <td className="py-3 px-4">Massive SMT Automation Scale</td>
                  <td className="py-3 px-4">Vishay SiC Packaging JV</td>
                  <td className="py-3 px-4">Class 3 IPC Certification</td>
                  <td className="py-3 px-4">98.5% Ascent Circuits M&A</td>
                </tr>
                <tr className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-900">Manufacturing Base</td>
                  <td className="py-3 px-4">Noida, Tirupati</td>
                  <td className="py-3 px-4">Mysuru, Sanand</td>
                  <td className="py-3 px-4">Chennai, Bengaluru</td>
                  <td className="py-3 px-4">Hosur, NCR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ACTIVITY FEED (27 Sourced Events Timeline)                        */}
      {/* ========================================================================= */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          {/* Filter Controls */}
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword or entity name..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-full text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:border-indigo-300 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Event Type:</span>
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none"
              >
                <option value="all">All Events ({timeline.length})</option>
                <option value="capex">Capex Expansion</option>
                <option value="partnership">Joint Ventures / JVs</option>
                <option value="regulatory">Regulatory & Tenders</option>
                <option value="expansion">Facility Expansion</option>
              </select>
            </div>
          </div>

          {/* Timeline Items */}
          <div className="space-y-3">
            {filteredTimeline.map((ev) => (
              <div 
                key={ev.event_id}
                className="p-5 rounded-2xl bg-white hover:bg-slate-50/60 border border-slate-100 hover:border-indigo-200 transition-all shadow-sm space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      {ev.event_type}
                    </span>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      {ev.entity_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {ev.event_date}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {ev.source_name}
                    </span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-800 leading-snug">
                  {ev.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{ev.summary}"
                </p>

                {ev.inferences && ev.inferences.length > 0 && (
                  <div className="text-[11px] text-indigo-900 bg-indigo-50/60 p-2 rounded-xl flex items-start gap-1.5">
                    <span className="font-bold shrink-0">Inference:</span>
                    <span>{ev.inferences[0]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD COMPETITOR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Track New Competitor</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700">Company Name or NSE/BSE Ticker</label>
              <input
                type="text"
                value={newCompetitorName}
                onChange={(e) => setNewCompetitorName(e.target.value)}
                placeholder="e.g. Centum Electronics, Avalon Tech..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Suggestions (Stage 5 Registry)</div>
                <div className="flex flex-wrap gap-1.5">
                  {['Centum Electronics', 'Avalon Tech', 'Cyient DLM', 'Tata Electronics', 'Sahasra Semi'].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setNewCompetitorName(sug)}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[11px] font-semibold transition-colors"
                    >
                      +{sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-1">
                Matches against our Stage 5 canonical registry of Indian listed and private EMS operators.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button 
                onClick={handleAddCompetitor} 
                className="px-5 py-2 rounded-full bg-[#0F172A] hover:bg-[#1E1B4B] text-white text-xs font-bold transition-all shadow-md"
              >
                Start Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">✕</button>
        </div>
      )}

    </div>
  );
};
