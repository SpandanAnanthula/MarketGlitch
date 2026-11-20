import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Radio } from 'lucide-react';

interface LiveIntelligenceTickerProps {
  timelineFilter: string;
  onExploreSignal?: () => void;
}

export const LiveIntelligenceTicker: React.FC<LiveIntelligenceTickerProps> = ({
  timelineFilter,
  onExploreSignal
}) => {
  const alerts = [
    { source: 'BSE / NSE', title: 'Tata Electronics accelerates $5B–$6B equipment orders for Dholera wafer fab cleanrooms', time: '2h ago', badge: 'Capex Ramp', color: 'text-indigo-400' },
    { source: 'GeM Portal', title: 'BEL Kavach Train Collision Avoidance ₹42.5 Cr SMT tender active (GEM/2026/B/8912401)', time: '3h ago', badge: 'Active Tender', color: 'text-emerald-400' },
    { source: 'Joint Venture', title: 'Kaynes Technology & Vishay finalize OSAT cleanroom for automotive SiC power modules', time: '4h ago', badge: 'M&A / JV', color: 'text-purple-400' },
    { source: 'BSE India', title: 'Dixon Technologies lines up ₹1,000 Cr high-speed automated SMT line capex across Noida', time: '5h ago', badge: 'SMT Capex', color: 'text-sky-400' },
    { source: 'NSE India', title: 'Syrma SGS invests ₹14.99 Cr into high-reliability defense PCB assembly subsidiary', time: '7h ago', badge: 'Defense EMS', color: 'text-teal-400' },
    { source: 'GeM Portal', title: 'CESL ₹12.8 Cr Silicon Carbide (SiC) Power Module Test Bench Tender Published (GEM/2026/B/8771902)', time: '1d ago', badge: 'EV Procurement', color: 'text-amber-400' },
    { source: 'DPIIT / MoC', title: 'Revised Public Procurement mandate enforces 55% local content for railway & defense SMT', time: '1d ago', badge: 'Statutory Mandate', color: 'text-amber-400' },
    { source: 'CPPP Defense', title: 'DRDO DEAL ₹8.5 Cr X-Band GaN Power Amplifier micro-packaging contract active', time: '2d ago', badge: 'Defense RFQ', color: 'text-rose-400' },
    { source: 'DGCIS Trade', title: 'Semiconductor imports under HS 8542 reached $1,465M in November (+18.6% YoY run-rate)', time: '2d ago', badge: 'Trade Flow', color: 'text-sky-400' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % alerts.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [alerts.length]);

  const active = alerts[currentIndex];

  return (
    <div className="bg-slate-900 border-b border-slate-800/90 text-white px-4 py-2 flex items-center justify-between text-xs overflow-hidden select-none">
      <div className="flex items-center gap-3 overflow-hidden flex-1">
        
        {/* Pulsing Live Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>LIVE INTEL</span>
        </div>

        {/* Ticker Content with Slide Animation */}
        <div className="flex items-center gap-2.5 truncate animate-fadeIn key={currentIndex}">
          <span className="px-1.5 py-0.2 rounded-md bg-slate-800 text-[10px] font-bold text-indigo-300 border border-slate-700">
            {active.source}
          </span>
          <span className="text-slate-300 truncate font-medium">
            {active.title}
          </span>
          <span className="text-slate-500 text-[10px] shrink-0 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-600" />
            {active.time}
          </span>
        </div>
      </div>

      {onExploreSignal && (
        <button
          onClick={onExploreSignal}
          title="Open real-time Corroborated Strategic Signals feed"
          className="ml-3 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-[11px] font-bold text-indigo-300 hover:text-white transition-all shrink-0 group shadow-sm hover:shadow"
        >
          <Sparkles className="w-3 h-3 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>Strategic Signals Feed</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};
