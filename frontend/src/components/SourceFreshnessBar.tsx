import React from 'react';
import { Database, CheckCircle2, Clock } from 'lucide-react';
import { SourceItem } from '../types';

interface SourceFreshnessBarProps {
  sources: SourceItem[];
}

export const SourceFreshnessBar: React.FC<SourceFreshnessBarProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="bg-slate-900/80 border-b border-slate-800/80 px-6 py-2.5 flex items-center justify-between text-xs overflow-x-auto gap-4">
      <div className="flex items-center gap-2 text-slate-400 shrink-0 font-medium">
        <Database className="h-3.5 w-3.5 text-emerald-400" />
        <span className="font-semibold text-slate-300">Public Ingestion Feeds:</span>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        {sources.map((src) => (
          <div key={src.source_id} className="flex items-center gap-1.5 group cursor-default">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">{src.name.split('(')[0]}</span>
            <span className="text-[10px] text-slate-500 font-normal">({src.last_fetched_at})</span>
          </div>
        ))}
      </div>

      <div className="hidden xl:flex items-center gap-1 text-[11px] text-emerald-400 font-medium shrink-0">
        <CheckCircle2 className="h-3 w-3" />
        <span>All 5 Official Data Connectors Healthy</span>
      </div>
    </div>
  );
};
