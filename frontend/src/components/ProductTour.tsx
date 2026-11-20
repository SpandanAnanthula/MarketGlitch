import React, { useState } from 'react';
import { Sparkles, Check, ChevronRight, X, ShieldCheck, Compass, Clock, Zap } from 'lucide-react';

interface ProductTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: string) => void;
}

export const ProductTour: React.FC<ProductTourProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to MarketGlitch / MarketMind",
      subtitle: "The AI Strategist for Indian Electronics & Semiconductor Manufacturing",
      highlight: "Idea Clarity: Who it's for & What it does in one line",
      content: "MarketGlitch gives Indian manufacturers an AI strategist that watches competitors, tenders, and trade policy — so you never miss a move.",
      badge: "Platform Mission",
      icon: Sparkles
    },
    {
      title: "Step 1: Multi-Tenant Workspace Switching",
      subtitle: "Strict Tenant Isolation (§10)",
      highlight: "Enterprise Account Separation",
      content: "Use the top header dropdown to switch between 3 complete manufacturing environments: Bharat EMS (Integrated SMT), NexGen EV (800V SiC Inverters), and Shakti Circuits (16-Layer Bare PCBs). All competitors, tenders, and metrics adapt dynamically.",
      badge: "A/B Testing Ready",
      icon: Compass
    },
    {
      title: "Step 2: Verifiable Timeline Scope Filter",
      subtitle: "Audit Cutoff & Live Updates (§18)",
      highlight: "Prove Live Ingestion to Mentors & Judges",
      content: "Toggle between 'Present Week' (live streaming updates up to Nov 20, 2026) and 'Past Week' (strict audit cutoff at Nov 12, 2026). Watch the Market Activity Curve and competitor filings update dynamically.",
      badge: "Mentor Feedback Implemented",
      icon: Clock
    },
    {
      title: "Step 3: Zero-Hallucination KPI Drilldowns",
      subtitle: "100% Grounded in Official Statutory Feeds (§12)",
      highlight: "Click Any KPI Tile on the Dashboard",
      content: "Click on any of the 6 Executive KPI tiles to inspect the exact considered events, BSE statutory filings, GeM tenders, and DGCIS trade series backing each number.",
      badge: "Audit Proof",
      icon: ShieldCheck
    },
    {
      title: "Step 4: AI Strategist & What-If Simulator",
      subtitle: "Autonomous Signal Discovery & Strategic Simulation",
      highlight: "Real AI Reasoning Tailored to Your Industry",
      content: "Open the floating 'Ask AI Strategist' assistant in the bottom-right corner to ask complex bidding questions, or click 'What-If Market Simulator' on the dashboard to test market consolidation shocks.",
      badge: "Killer Feature",
      icon: Zap
    }
  ];

  const step = steps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 text-slate-800 shadow-2xl overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-200">{step.badge}</div>
              <h3 className="text-sm font-extrabold text-white">{step.title}</h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
              {step.subtitle}
            </span>
            <div className="text-sm font-black text-slate-900 leading-snug">
              {step.highlight}
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {step.content}
          </p>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  currentStep === idx ? 'w-6 bg-indigo-600' : 'w-1.5 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>{currentStep === steps.length - 1 ? 'Start Exploring' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
