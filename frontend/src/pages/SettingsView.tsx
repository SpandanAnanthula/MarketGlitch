import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  ShieldCheck, 
  Users, 
  Check, 
  AlertTriangle, 
  Lock, 
  Database,
  Building2,
  Trash2
} from 'lucide-react';

interface SettingsViewProps {
  workspaceName?: string;
  userEmail?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  workspaceName = "Bharat EMS Solutions Pvt Ltd",
  userEmail = "contact@bharat-ems.in"
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'team'>('profile');
  
  // Notification toggle states
  const [notifyCapex, setNotifyCapex] = useState(true);
  const [notifyTenders, setNotifyTenders] = useState(true);
  const [notifyDigest, setNotifyDigest] = useState(false);

  // Stage 8 Suppression Queue items
  const suppressedItems = [
    {
      id: 'sup_01',
      title: 'PIB Veterinary Foot-and-Mouth Disease Vaccine Facility in Bareilly',
      reason: 'NON_VERTICAL_NOISE',
      reasonBadge: 'bg-rose-50 text-rose-700 border-rose-200/60',
      action: 'Suppressed from Electronics Vertical',
      date: 'Nov 19, 2026'
    },
    {
      id: 'sup_02',
      title: 'Amber Ascent Circuits Syndicated News Wire (Wire Duplication)',
      reason: 'DUPLICATE_SYNDICATION',
      reasonBadge: 'bg-amber-50 text-amber-700 border-amber-200/60',
      action: 'Merged into Primary BSE Filing',
      date: 'Nov 19, 2026'
    },
    {
      id: 'sup_03',
      title: '2023 Legacy Research on Gallium Arsenide Thin Films',
      reason: 'ARCHIVAL_OUTDATED',
      reasonBadge: 'bg-slate-100 text-slate-700 border-slate-200/60',
      action: 'Moved to Background Index',
      date: 'Nov 18, 2026'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* TOP HEADER (Replicating Image 11) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings & Governance
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Manage your profile, alert preferences, and Stage 8 source integrity guardrails
        </p>
      </div>

      {/* TABS (Replicating Image 11: Profile, Notifications, Security, Team) */}
      <div className="flex items-center gap-6 border-b border-slate-200/80 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'profile'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'notifications'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Stage 8 Governance</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'team'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Team & Tenants
        </button>
      </div>

      {/* TAB 1: PROFILE (Replicating Image 11) */}
      {activeTab === 'profile' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-6 max-w-3xl">
          <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              UY
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Uttam Yamagowni</h2>
              <div className="text-xs font-semibold text-indigo-600">{workspaceName}</div>
              <div className="text-xs text-slate-400 font-mono">{userEmail}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Display Name</label>
              <input type="text" value="Uttam Yamagowni" readOnly className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Corporate Email</label>
              <input type="email" value={userEmail} readOnly className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Tenant Workspace ID (Multi-Tenant)</label>
              <input type="text" value="ws_electronics_default" readOnly className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NOTIFICATIONS (Replicating Image 11's Toggle Switches) */}
      {activeTab === 'notifications' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-6 max-w-3xl">
          <div className="space-y-1 pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
            <p className="text-xs text-slate-500">Configure alert thresholds for statutory filings and public tenders</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">Critical Capex & Disruption Alerts</div>
                <div className="text-[11px] text-slate-500">Immediate push for Capex moves &gt; ₹500 Cr (e.g. Dixon ₹1,000 Cr)</div>
              </div>
              <button 
                onClick={() => setNotifyCapex(!notifyCapex)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${notifyCapex ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${notifyCapex ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">GeM & CPPP Public Tender Alerts</div>
                <div className="text-[11px] text-slate-500">Alerts when tenders matching your PCB / SMT capability are notified</div>
              </div>
              <button 
                onClick={() => setNotifyTenders(!notifyTenders)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${notifyTenders ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${notifyTenders ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">Weekly Executive Briefing Digest</div>
                <div className="text-[11px] text-slate-500">Consolidated Monday 08:00 AM summary of peer moves and tariff changes</div>
              </div>
              <button 
                onClick={() => setNotifyDigest(!notifyDigest)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${notifyDigest ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${notifyDigest ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STAGE 8 GOVERNANCE & SUPPRESSION QUEUE */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Zero Hallucinated Citations Guardrail Enforced (100% Grounded)</span>
              </div>
              <p className="text-xs text-emerald-800">
                100% of generated insights and strategic signals are mathematically verified against raw statutory source documents.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-white text-emerald-700 font-black text-xs border border-emerald-200">
              0 Hallucinations
            </span>
          </div>

          {/* Suppression Audit Queue */}
          <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Suppression Audit Queue</h3>
                <p className="text-xs text-slate-500">Filtered noise, duplicate syndication, and non-vertical news</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold">
                {suppressedItems.length} Items Quarantined
              </span>
            </div>

            <div className="space-y-3">
              {suppressedItems.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-1 max-w-xl">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500">Action: {item.action} • {item.date}</div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.reasonBadge}`}>
                    {item.reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TEAM & TENANTS */}
      {activeTab === 'team' && (
        <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4 max-w-3xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Workspace Members</h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold">
              3 Seats Active
            </span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Uttam Yamagowni', email: 'contact@bharat-ems.in', role: 'Tenant Admin', isYou: true },
              { name: 'R. S. Narayanan', email: 'vp.operations@bharat-ems.in', role: 'Operations Lead', isYou: false },
              { name: 'Ananya Sharma', email: 'procurement@bharat-ems.in', role: 'Procurement Manager', isYou: false }
            ].map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{m.name}</span>
                    {m.isYou && <span className="text-[10px] text-indigo-600 font-bold">(You)</span>}
                  </div>
                  <div className="text-[11px] text-slate-400">{m.email}</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-700 font-semibold border border-slate-200">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
