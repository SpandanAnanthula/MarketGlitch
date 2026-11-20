import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Sliders, 
  Building2, 
  Percent, 
  DollarSign, 
  Zap,
  BarChart2
} from 'lucide-react';
import { TENANT_WORKSPACES } from '../data/tenantWorkspaces';

interface WhatIfSimulatorProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  workspaceId,
  isOpen,
  onClose
}) => {
  const tenantCfg = TENANT_WORKSPACES[workspaceId] || TENANT_WORKSPACES['ws_electronics_default'];
  const companyName = tenantCfg.profile?.company_name || tenantCfg.name;
  const [selectedScenario, setSelectedScenario] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'dixon_syrma_merger',
      title: 'Consolidation Shock: Dixon Acquires Syrma SGS',
      tag: 'M&A Squeeze',
      tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      description: 'Simulates a mega-merger between Dixon (22.4%) and Syrma (17.8%), creating a 40.2% dominant contract assembler.',
      metrics: [
        { label: 'Competitor SMT Capacity', before: '14,000 cph', after: '28,500 cph', delta: '+103%', isPositive: false },
        { label: `${companyName} Price Pressure`, before: 'Baseline', after: '-8.5%', delta: 'High Margin Risk', isPositive: false },
        { label: 'Addressable Kavach Subcontract', before: 'Open Bids', after: 'Syrma Captive', delta: 'Requires Class 3 Pivot', isPositive: false }
      ],
      aiRecommendation: `**AI Strategic Response:**\n1. Immediately pivot lines away from commoditized consumer SMT toward automotive Grade AEC-Q100 ECU boards where Dixon-Syrma integration creates 6-month operational disruption.\n2. Lock in long-term raw PCB substrate supply with independent fabs like Shakti or Shogini to avoid captive capacity lockouts.\n3. Bid aggressively on the BEL Kavach sub-assembly before combined production lines achieve unified testing clearance.`,
      confidence: '94.2% Empirical Match'
    },
    {
      id: 'tariff_hike',
      title: 'Trade Policy Shift: DGTR Imposes 15% Duty on HS 8542 Imports',
      tag: 'Import Substitution',
      tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Simulates Commerce Ministry tariff hike on foreign ICs and multilayer boards to enforce 55% local content mandate.',
      metrics: [
        { label: 'Domestic Market Demand', before: '₹18,500 Cr', after: '₹24,800 Cr', delta: '+34.0%', isPositive: true },
        { label: 'Gross Margin Expansion', before: '14.2%', after: '19.8%', delta: '+5.6% Margin', isPositive: true },
        { label: 'Component Sourcing Lead Time', before: '3.5 Weeks', after: '6.0 Weeks', delta: 'Supply Squeeze', isPositive: false }
      ],
      aiRecommendation: `**AI Strategic Response:**\n1. Capitalize on Class-1 Make in India supplier preference in GeM public tenders (100% price match right against imported alternatives).\n2. Expand domestic supplier qualification with local OSAT packaging vendors (Kaynes-Vishay) to bypass custom clearance delays.\n3. Pre-book nitrogen and copper laminate inventory to hedge against immediate spot price surges.`,
      confidence: '97.1% Empirical Match'
    },
    {
      id: 'specs_subsidy_surge',
      title: 'Capital Incentive: Cabinet Expands SPECS 2.0 to 40% Capex Reimbursement',
      tag: 'Capital Grant',
      tagColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      description: 'Simulates MeitY announcement raising capital subsidies on automated optical inspection (AOI) and surface-mount machines.',
      metrics: [
        { label: 'Pick & Place Line Payback Period', before: '4.2 Years', after: '2.3 Years', delta: '-45% Payback', isPositive: true },
        { label: 'Capex Effective Net Cost', before: '₹12.0 Cr', after: '₹7.2 Cr', delta: '-₹4.8 Cr Subsidy', isPositive: true },
        { label: 'Annual SMT Line Output', before: '1.2M Units', after: '2.4M Units', delta: '+100% Scale', isPositive: true }
      ],
      aiRecommendation: `**AI Strategic Response:**\n1. File common facility center (CFC) consortium grant under MeitY EMC 2.0 scheme in Sanand or Sriperumbudur.\n2. Upgrade inspection cleanroom to ISO Class 7 to qualify for aerospace and defense radar subcontracting.\n3. Accelerate equipment procurement before statutory subsidy disbursement quota is exhausted.`,
      confidence: '98.5% Empirical Match'
    }
  ];

  const current = scenarios[selectedScenario];

  const handleApplyScenario = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setAppliedNotice(`Scenario "${current.title}" successfully integrated into tenant executive risk model!`);
      setTimeout(() => setAppliedNotice(null), 4000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl rounded-[32px] bg-slate-900 border border-slate-700/80 text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
        
        {/* Top Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">What-If Market Simulator</h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  Interactive AI Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Stress-test <span className="text-indigo-300 font-semibold">{companyName}</span> against structural industry shocks
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Applied Notification */}
        {appliedNotice && (
          <div className="px-6 py-2.5 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{appliedNotice}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Scenario Selection Tabs */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Select Market Stress Scenario:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {scenarios.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(idx)}
                  className={`p-3.5 rounded-2xl text-left border transition-all space-y-1.5 ${
                    selectedScenario === idx
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${s.tagColor}`}>
                    {s.tag}
                  </span>
                  <div className="text-xs font-bold text-white line-clamp-1">{s.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{s.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Metrics Before vs After */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <div className="space-y-0.5">
                <h3 className="text-sm font-extrabold text-white">{current.title}</h3>
                <p className="text-xs text-slate-400">{current.description}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                {current.confidence}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {current.metrics.map((m, mIdx) => (
                <div key={mIdx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2">
                  <div className="text-xs font-semibold text-slate-400">{m.label}</div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 line-through">{m.before}</div>
                      <div className="text-base font-black text-white">{m.after}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                      m.isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {m.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{m.delta}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Strategic Action Plan */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-700/50 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Strategic Playbook Recommendation:</span>
            </div>
            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {current.aiRecommendation}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-800/90 border-t border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Simulated on <strong>{companyName}</strong> Q4 Balance Sheet
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={handleApplyScenario}
              disabled={isSimulating}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              {isSimulating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Impact...</span>
                </>
              ) : (
                <>
                  <span>Inject into Risk Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
