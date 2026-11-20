import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BarChart3, 
  Compass, 
  Target, 
  FileText, 
  Database, 
  FolderLock, 
  Settings, 
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  workspaceName?: string;
  userName?: string;
  userInitials?: string;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab,
  workspaceName = "Bharat EMS Solutions",
  userName = "Uttam Yamagowni",
  userInitials = "UY",
  onLogout
}) => {
  const navSections = [
    {
      title: null,
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'my-company', label: 'My Company', icon: Building2 }
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'competitors', label: 'Competitors', icon: Users, badge: '5 Tracked' },
        { id: 'industry', label: 'Industry Intelligence', icon: BarChart3 },
        { id: 'strategic', label: 'Strategic Intelligence', icon: Compass, badge: '5 Signals', badgeColor: 'bg-indigo-100 text-indigo-700' },
        { id: 'opportunities', label: 'Opportunities', icon: Target, badge: '₹99.9 Cr', badgeColor: 'bg-emerald-100 text-emerald-700' }
      ]
    },
    {
      title: 'WORKSPACE',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: FileText },
        { id: 'sources', label: 'Data Sources', icon: Database, badge: '9 Active' },
        { id: 'my-data', label: 'My Data', icon: FolderLock }
      ]
    },
    {
      title: 'PREFERENCES',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-72 bg-[#F8F9FE]/95 backdrop-blur-xl border-r border-slate-200/80 p-5 flex flex-col justify-between shrink-0 select-none h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Logo (MarketMind India) */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
              MarketMind
            </span>
            <span className="text-[10px] font-semibold text-indigo-600 mt-1">India AI Intelligence</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && (
                <div className="px-3 text-[10px] font-bold tracking-wider text-slate-600 uppercase mb-1.5 text-left">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-2xl text-xs transition-all text-left ${
                        isActive
                          ? 'bg-indigo-100/90 text-indigo-700 font-bold shadow-sm shadow-indigo-100'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 text-left flex-1">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="text-left leading-tight truncate block">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          item.badgeColor || (isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500')
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Card Profile & Sign Out Footer (Matching Image 12 & 3) */}
      <div className="pt-4 border-t border-slate-200/80">
        <div className="p-2.5 rounded-2xl bg-white/80 border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {userInitials}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-800 truncate">{userName}</div>
              <div className="text-[10px] text-slate-600 truncate">{workspaceName}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign out to Login Page"
            className="flex items-center gap-1 px-2 py-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shrink-0 text-xs font-bold border border-transparent hover:border-rose-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[11px]">Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
