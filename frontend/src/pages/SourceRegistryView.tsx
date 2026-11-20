import React from 'react';
import { Database, CheckCircle, ShieldCheck, RefreshCw, ExternalLink } from 'lucide-react';
import { SourceItem } from '../types';

interface SourceRegistryViewProps {
  sources: SourceItem[];
}

export const SourceRegistryView: React.FC<SourceRegistryViewProps> = ({ sources }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Database className="h-4 w-4" />
          <span>§18 Governance • Public Data Access Registry</span>
        </div>
        <h1 className="text-xl font-black text-white tracking-tight">Active Public Source Connectors & Cadence</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          The platform ingests only verified government, regulatory, and public exchange feeds. Every record preserves source URLs, timestamps, and terms of redistribution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src) => (
          <div key={src.source_id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-sm text-white">{src.name}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Score: {src.reliability_score * 100}%
              </span>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <div>Publisher: <span className="text-slate-300 font-medium">{src.publisher}</span></div>
              <div>Domain: <span className="text-slate-300 font-mono">{src.domain}</span></div>
              <div>Refresh Frequency: <span className="text-emerald-400 font-medium">{src.refresh_frequency}</span></div>
              <div>Last Synced: <span className="text-slate-200 font-semibold">{src.last_fetched_at}</span></div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <span className="text-[11px] text-slate-500 font-medium">
                {src.access_method}
              </span>
              <a
                href={`https://${src.domain}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold text-[11px]"
              >
                <span>Portal Link</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
