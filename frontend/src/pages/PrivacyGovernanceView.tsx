import React, { useState } from 'react';
import { ShieldCheck, Lock, Users, AlertTriangle, CheckCircle, Database } from 'lucide-react';

export const PrivacyGovernanceView: React.FC = () => {
  const [optInBenchmark, setOptInBenchmark] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="h-4 w-4" />
          <span>§11 & §14 • Data Protection & Governance</span>
        </div>
        <h1 className="text-xl font-black text-white tracking-tight">Customer Data Isolation & DPDP Act 2023 Compliance</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Customer uploads remain strictly tenant-scoped by default. Anonymous benchmarking is governed by differential suppression and strict cohort thresholds.
        </p>
      </div>

      {/* Main Governance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opt-In Benchmarking Toggle (Section 11) */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Anonymized Business Benchmarking</h3>
                <p className="text-xs text-slate-400">Optional Network Effect Contribution</p>
              </div>
            </div>

            <button
              onClick={() => setOptInBenchmark(!optInBenchmark)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                optInBenchmark ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  optInBenchmark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Exact PRD Wording from Section 11 */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
            "Contribute anonymised business benchmarks (optional). We will use eligible data from your workspace to calculate aggregated market indicators. Other customers will see only thresholded, grouped statistics—not your records, company identity, customer names, suppliers or individual transactions. You can manage this permission in Workspace Settings."
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Status: {optInBenchmark ? 'Enrolled in k≥5 Aggregation' : 'Strict Private Mode (Zero Sharing)'}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              When enabled, only coarse statistics (e.g. median component procurement lead times) are computed.
            </p>
          </div>
        </div>

        {/* The k >= 5 Anonymity Rule Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">k ≥ 5 Minimum Cohort Safeguard</h3>
              <p className="text-xs text-slate-400">Differential Privacy & Anti-Re-identification</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The platform mathematically enforces that no aggregated benchmark is ever published unless at least <strong>5 independent organizations</strong> contribute to that category.
          </p>

          <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/15 space-y-2 text-xs text-slate-400">
            <div className="flex items-center justify-between text-purple-300 font-bold">
              <span>Current Electronics Benchmark Cohort</span>
              <span>7 Contributing Companies (Active)</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '70%' }} />
            </div>
            <p className="text-[10px] text-slate-500">
              Threshold met ($k \ge 5$). Coarse median price bands for SMT assembly components are visible.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Digital Personal Data Protection Act (DPDP Act) 2023 Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
