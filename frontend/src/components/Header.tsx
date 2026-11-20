import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  ChevronDown, 
  Building2, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  Calendar,
  Sparkles,
  Clock,
  LogOut
} from 'lucide-react';
import { WorkspaceAlert, TimelineFilter } from '../types';

interface HeaderProps {
  currentWorkspaceId: string;
  onSelectWorkspace: (wsId: string) => void;
  currentTimeline?: TimelineFilter;
  onSelectTimeline?: (timeline: TimelineFilter) => void;
  alerts: WorkspaceAlert[];
  userInitials?: string;
  onNavigateSettings?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentWorkspaceId, 
  onSelectWorkspace,
  currentTimeline = 'present_week',
  onSelectTimeline,
  alerts = [],
  userInitials = "UY",
  onNavigateSettings,
  onLogout
}) => {
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isTimelineDropdownOpen, setIsTimelineDropdownOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const workspaces = [
    { id: 'ws_electronics_default', name: 'Bharat EMS Solutions Pvt Ltd', tier: 'Enterprise Tier', subsector: 'Integrated EMS & SMT' },
    { id: 'ws_auto_inverters', name: 'NexGen EV Inverters & Modules', tier: 'Professional Tier', subsector: 'Automotive Power Electronics' },
    { id: 'ws_bare_pcb_tech', name: 'Shakti Multilayer Circuits & Fab', tier: 'Growth Tier', subsector: 'Bare PCB Fabrication' }
  ];

  const timelineOptions: Array<{ id: TimelineFilter; label: string; range: string; tag: string; isLive: boolean; description: string }> = [
    { 
      id: 'present_week', 
      label: 'Present Week (Nov 13 – Nov 20, 2026)', 
      range: '13–20 Nov 2026', 
      tag: 'Live Stream', 
      isLive: true,
      description: 'Active live feed (15 events, 3 signals, CESL SiC tender, Tata Dholera $5B capex)'
    },
    { 
      id: 'past_week', 
      label: 'Past Week (Nov 06 – Nov 12, 2026)', 
      range: '06–12 Nov 2026', 
      tag: 'Historical View', 
      isLive: false,
      description: 'Historical audit cutoff (11 events, 2 signals, BEL Kavach ₹42.5 Cr tender, DBC patent)'
    },
    { 
      id: 'all', 
      label: 'All Time (Full Q4 2026 Ingestion)', 
      range: 'All Q4 2026', 
      tag: 'Full Window', 
      isLive: false,
      description: 'Complete multi-source database (27 events, 5 strategic signals, 4 tenders)'
    }
  ];

  const currentWs = workspaces.find(w => w.id === currentWorkspaceId) || workspaces[0];
  const activeTimeline = timelineOptions.find(t => t.id === currentTimeline) || timelineOptions[0];

  return (
    <header className="h-16 px-6 bg-white/70 backdrop-blur-md border-b border-slate-200/70 flex items-center justify-between gap-4 z-20">
      {/* Search Input (Replicating Image 12 & Image 3) */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search competitors, tenders, HS codes, patents..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100/70 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-300 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Timeline Filter + Workspace Dropdown + Alerts + Settings + Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* TIMELINE / DATE FILTER DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => {
              setIsTimelineDropdownOpen(!isTimelineDropdownOpen);
              setIsWorkspaceDropdownOpen(false);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
              activeTimeline.isLive 
                ? 'bg-emerald-50/80 border-emerald-200/80 text-emerald-900 hover:bg-emerald-100/70 shadow-sm' 
                : 'bg-indigo-50/80 border-indigo-200/80 text-indigo-900 hover:bg-indigo-100/70'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${activeTimeline.isLive ? 'text-emerald-600' : 'text-indigo-600'}`} />
            <div className="flex items-center gap-1.5">
              {activeTimeline.isLive && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
              <span className="font-bold">{activeTimeline.range}</span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/70 font-extrabold text-slate-600 hidden md:inline">
                {activeTimeline.tag}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isTimelineDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
              <div className="px-3.5 py-1.5 flex items-center justify-between border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Timeline Filter (§18 Live Ingestion)
                </span>
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
              </div>

              {timelineOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    if (onSelectTimeline) onSelectTimeline(opt.id);
                    setIsTimelineDropdownOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 text-left text-xs transition-colors flex items-start justify-between gap-2 ${
                    currentTimeline === opt.id ? 'bg-indigo-50/70 text-indigo-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{opt.label}</span>
                      {opt.isLive && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-800 font-extrabold uppercase">
                          Live Now
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal leading-snug">
                      {opt.description}
                    </div>
                  </div>
                  {currentTimeline === opt.id && <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />}
                </button>
              ))}

              <div className="mt-1 px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500">
                💡 Select any timeline to dynamically scope signals, events, charts, and metrics to that cutoff.
              </div>
            </div>
          )}
        </div>

        {/* Workspace Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen);
              setIsTimelineDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-200/60 border border-slate-200/60 text-xs font-semibold text-slate-800 transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="max-w-[120px] sm:max-w-[160px] truncate">{currentWs.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isWorkspaceDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Switch Workspace (§10 Tenant Scoped)
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    onSelectWorkspace(ws.id);
                    setIsWorkspaceDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs transition-colors flex items-center justify-between ${
                    currentWorkspaceId === ws.id ? 'bg-indigo-50/80 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900">{ws.name}</div>
                    <div className="text-[10px] text-slate-400">{ws.subsector}</div>
                  </div>
                  {currentWorkspaceId === ws.id && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors relative"
            title="Notifications & Alerts"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                <span className="text-xs font-bold text-slate-900">Workspace Alerts ({alerts.length})</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">Live</span>
              </div>
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {alerts.length > 0 ? (
                  alerts.slice(0, 3).map((alt) => (
                    <div key={alt.alert_id} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={`font-bold px-1.5 py-0.2 rounded ${alt.severity === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'}`}>
                          {alt.severity} PRIORITY
                        </span>
                        <span className="text-slate-400">{alt.created_at.split(' ')[0]}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 leading-snug">{alt.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{alt.immediate_action}</div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs text-slate-400">No active alerts for this workspace.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button 
          onClick={onNavigateSettings}
          title="Tenant Settings & Audits"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
          {userInitials}
        </div>

        {/* Prominent Log Out Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Log out and return to Login Page"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 text-xs font-bold text-slate-700 hover:text-rose-600 transition-all shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        )}
      </div>
    </header>
  );
};
