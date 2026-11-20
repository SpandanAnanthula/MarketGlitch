import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SourceFreshnessBar } from './components/SourceFreshnessBar';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { LoginPage } from './pages/LoginPage';
import { CompetitorIntelligence } from './pages/CompetitorIntelligence';
import { IndustryIntelligence } from './pages/IndustryIntelligence';
import { OpportunityTracker } from './pages/OpportunityTracker';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { MyCompany } from './pages/MyCompany';
import { DataSources } from './pages/DataSources';
import { MyData } from './pages/MyData';
import { SettingsView } from './pages/SettingsView';
import { OnboardingModal } from './pages/OnboardingModal';
import { AiStrategyChat } from './components/AiStrategyChat';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { LiveIntelligenceTicker } from './components/LiveIntelligenceTicker';
import { ProductTour } from './components/ProductTour';
import { ErrorBoundary } from './components/ErrorBoundary';
import { KpiDetailModal } from './components/KpiDetailModal';
import { api } from './services/api';
import { TENANT_WORKSPACES } from './data/tenantWorkspaces';
import { 
  CompanyProfile, 
  CompetitorCandidate, 
  CompetitorEvent, 
  TradeMetric, 
  TenderItem, 
  PolicyItem, 
  PatentItem, 
  SourceItem,
  StrategicSignal,
  WorkspaceAlert,
  TimelineFilter
} from './types';
import { LogIn, LayoutDashboard, X } from 'lucide-react';

export function App() {
  // Session & Tenant State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>('ws_electronics_default');
  const [userEmail, setUserEmail] = useState<string>('contact@bharat-ems.in');
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('present_week');
  
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [isSignalsModalOpen, setIsSignalsModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Intelligence State
  const [currentProfile, setCurrentProfile] = useState<CompanyProfile | null>(TENANT_WORKSPACES['ws_electronics_default'].profile);
  const [signals, setSignals] = useState<StrategicSignal[]>([]);
  const [alerts, setAlerts] = useState<WorkspaceAlert[]>([]);
  const [candidates, setCandidates] = useState<CompetitorCandidate[]>([]);
  const [timeline, setTimeline] = useState<CompetitorEvent[]>([]);
  const [trade, setTrade] = useState<TradeMetric | null>(null);
  const [tenders, setTenders] = useState<TenderItem[]>([]);
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [patents, setPatents] = useState<PatentItem[]>([]);
  const [sources, setSources] = useState<SourceItem[]>([]);

  // Workspace Name Mapping
  const workspaceNames: Record<string, string> = {
    'ws_electronics_default': 'Bharat EMS Solutions Pvt Ltd',
    'ws_auto_inverters': 'NexGen EV Inverters & Power Modules',
    'ws_bare_pcb_tech': 'Shakti Multilayer Circuits & PCB Fab'
  };

  const loadData = async (wsId: string = currentWorkspaceId, tl: TimelineFilter = timelineFilter) => {
    try {
      const cfg = TENANT_WORKSPACES[wsId] || TENANT_WORKSPACES['ws_electronics_default'];
      const [prof, sigs, alrts, cand, time, tr, tend, pol, pat, src] = await Promise.all([
        api.getCurrentProfile(wsId),
        api.getDeliveryFeed(wsId, tl),
        api.getDeliveryAlerts(wsId),
        api.getCompetitorCandidates(),
        api.getCompetitorTimeline(),
        api.getTradeAnalytics(),
        api.getTenders(),
        api.getPolicyUpdates(),
        api.getPatents(),
        api.getSources()
      ]);
      setCurrentProfile(prof || cfg.profile);
      setSignals(sigs);
      setAlerts(alrts);
      setCandidates(cand);
      setTimeline(time);
      setTrade(tr);
      setTenders(tend);
      setPolicies(pol);
      setPatents(pat);
      setSources(src);
    } catch (e) {
      console.error("Failed loading intelligence data:", e);
    }
  };

  useEffect(() => {
    loadData(currentWorkspaceId, timelineFilter);
  }, [currentWorkspaceId, timelineFilter]);

  const handleWorkspaceChange = (newWsId: string) => {
    setCurrentWorkspaceId(newWsId);
    const cfg = TENANT_WORKSPACES[newWsId];
    if (cfg) {
      setUserEmail(cfg.email);
      setCurrentProfile(cfg.profile);
    }
  };

  const handleTimelineChange = (newTimeline: TimelineFilter) => {
    setTimelineFilter(newTimeline);
    loadData(currentWorkspaceId, newTimeline);
  };

  const handleLogin = (wsId: string, email: string) => {
    setCurrentWorkspaceId(wsId);
    const cfg = TENANT_WORKSPACES[wsId];
    setUserEmail(email || cfg?.email || 'contact@bharat-ems.in');
    if (cfg) {
      setCurrentProfile(cfg.profile);
    }
    setIsLoggedIn(true);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleFeedback = async (signalId: string, rating: 'useful' | 'not_useful' | 'incorrect') => {
    try {
      await api.submitFeedback({
        workspace_id: currentWorkspaceId,
        signal_id: signalId,
        rating
      });
    } catch (err) {
      console.warn("Feedback recorded in session:", err);
    }
  };

  // If viewing the Login Page
  if (!isLoggedIn) {
    return (
      <ErrorBoundary>
        <div className="relative">
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={() => setIsLoggedIn(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-lg hover:bg-indigo-600 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Switch to Executive Dashboard View</span>
            </button>
          </div>
          <LoginPage onLogin={handleLogin} />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen overflow-hidden bg-[#F6F8FD] flex flex-col text-slate-800 font-sans selection:bg-indigo-500/20 selection:text-indigo-800">
        
        {/* ONLY THIS BAR IS LOCKED AT THE TOP */}
        <div className="sticky top-0 z-30 shrink-0 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/70">
          <Header
            currentWorkspaceId={currentWorkspaceId}
            onSelectWorkspace={handleWorkspaceChange}
            currentTimeline={timelineFilter}
            onSelectTimeline={handleTimelineChange}
            alerts={alerts}
            userInitials={TENANT_WORKSPACES[currentWorkspaceId]?.initials || userEmail.slice(0, 2).toUpperCase()}
            onNavigateSettings={() => setCurrentTab('settings')}
            onOpenTour={() => setIsTourOpen(true)}
            onLogout={handleLogout}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>

        {/* Main Layout Container (Sidebar locked on left on desktop, drawer on mobile) */}
        <div className="flex-1 flex overflow-hidden min-h-0 relative">
          
          {/* Desktop Navigation Sidebar (Locked Pinned Left) */}
          <div className="hidden md:flex shrink-0">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              workspaceName={workspaceNames[currentWorkspaceId]}
              userName={userEmail.split('@')[0]}
              userInitials={TENANT_WORKSPACES[currentWorkspaceId]?.initials || userEmail.slice(0, 2).toUpperCase()}
              onLogout={handleLogout}
            />
          </div>

          {/* Mobile Sliding Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="relative w-72 max-w-[80vw] bg-white h-full z-10 shadow-2xl flex flex-col animate-slideRight">
                <div className="p-3 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Navigation Menu</span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <Sidebar
                    currentTab={currentTab}
                    onSelectTab={(tab) => {
                      setCurrentTab(tab);
                      setIsMobileMenuOpen(false);
                    }}
                    workspaceName={workspaceNames[currentWorkspaceId]}
                    userName={userEmail.split('@')[0]}
                    userInitials={TENANT_WORKSPACES[currentWorkspaceId]?.initials || userEmail.slice(0, 2).toUpperCase()}
                    onLogout={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Page Viewport (Scrolls vertically, all content scrolls away) */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-4">
              
              {/* Real-time Animated Intelligence Ticker (Scrolls away with page) */}
              <div className="rounded-2xl overflow-hidden shadow-xs border border-slate-800/80">
                <LiveIntelligenceTicker
                  timelineFilter={timelineFilter}
                  onExploreSignal={() => setIsSignalsModalOpen(true)}
                />
              </div>

              {/* Public Ingestion Freshness Bar (Scrolls away with page) */}
              <div className="rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 bg-white">
                <SourceFreshnessBar sources={sources} />
              </div>

              {/* 1. EXECUTIVE DASHBOARD (Image 12, 1, 8) */}
              {(currentTab === 'dashboard' || currentTab === 'overview') && (
                <ExecutiveDashboard
                  signals={signals}
                  timeline={timeline}
                  competitors={candidates}
                  workspaceName={workspaceNames[currentWorkspaceId]}
                  workspaceId={currentWorkspaceId}
                  timelineFilter={timelineFilter}
                  onSelectTimeline={handleTimelineChange}
                  onExploreStrategic={() => setCurrentTab('strategic')}
                  onOpenWhatIf={() => setIsWhatIfOpen(true)}
                  onFeedback={handleFeedback}
                />
              )}

            {/* 2. MY COMPANY (Image 10) */}
            {currentTab === 'my-company' && (
              <MyCompany
                profile={currentProfile}
                workspaceId={currentWorkspaceId}
                onEditProfile={() => setIsOnboardingOpen(true)}
              />
            )}

            {/* 3. COMPETITOR INTELLIGENCE (Image 4) */}
            {currentTab === 'competitors' && (
              <CompetitorIntelligence
                candidates={candidates}
                timeline={timeline.filter(t => {
                  if (timelineFilter === 'present_week') return t.event_date >= '2026-11-13' && t.event_date <= '2026-11-20';
                  if (timelineFilter === 'past_week') return t.event_date <= '2026-11-12';
                  return true;
                })}
                workspaceId={currentWorkspaceId}
                onRefresh={() => loadData(currentWorkspaceId, timelineFilter)}
              />
            )}

            {/* 4. INDUSTRY INTELLIGENCE (Image 6) */}
            {currentTab === 'industry' && (
              <IndustryIntelligence
                trade={trade}
                tenders={tenders.filter(t => {
                  if (timelineFilter === 'present_week') return t.published_date >= '2026-11-13';
                  if (timelineFilter === 'past_week') return t.published_date <= '2026-11-12';
                  return true;
                })}
                policies={policies}
                patents={patents}
              />
            )}

            {/* 5. STRATEGIC INTELLIGENCE (Stage 7 Signals) */}
            {currentTab === 'strategic' && (
              <ExecutiveDashboard
                signals={signals}
                timeline={timeline}
                competitors={candidates}
                workspaceName={workspaceNames[currentWorkspaceId]}
                workspaceId={currentWorkspaceId}
                timelineFilter={timelineFilter}
                onSelectTimeline={handleTimelineChange}
                onFeedback={handleFeedback}
              />
            )}

            {/* 6. OPPORTUNITY TRACKER (Image 7) */}
            {currentTab === 'opportunities' && (
              <OpportunityTracker
                tenders={tenders.filter(t => {
                  if (timelineFilter === 'present_week') return t.published_date >= '2026-11-13';
                  if (timelineFilter === 'past_week') return t.published_date <= '2026-11-12';
                  return true;
                })}
                workspaceId={currentWorkspaceId}
              />
            )}

            {/* 7. REPORTS & ANALYTICS (Image 9) */}
            {currentTab === 'reports' && (
              <ReportsAnalytics
                workspaceName={workspaceNames[currentWorkspaceId]}
              />
            )}

            {/* 8. DATA SOURCES (Image 5) */}
            {currentTab === 'sources' && (
              <DataSources
                sources={sources}
              />
            )}

            {/* 9. MY DATA (Image 3) */}
            {currentTab === 'my-data' && (
              <MyData />
            )}

            {/* 10. SETTINGS & GOVERNANCE (Image 11) */}
            {currentTab === 'settings' && (
              <SettingsView
                workspaceName={workspaceNames[currentWorkspaceId]}
                userEmail={userEmail}
              />
            )}

          </div>
        </main>
      </div>

      {/* Floating AI Strategist Assistant */}
      <AiStrategyChat
        workspaceId={currentWorkspaceId}
        workspaceName={workspaceNames[currentWorkspaceId]}
        timelineFilter={timelineFilter}
        onOpenWhatIf={() => setIsWhatIfOpen(true)}
      />

      {/* What-If Scenario Simulator Modal */}
      <WhatIfSimulator
        workspaceId={currentWorkspaceId}
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />

      {/* 30-Second Guided Product Tour for Reviewers */}
      <ProductTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectTab={setCurrentTab}
      />

      {/* Onboarding Dialog Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaved={(newProf) => {
          setCurrentProfile(newProf);
          loadData();
        }}
      />

      {/* Direct Strategic Signals Feed Modal from Ticker */}
      {isSignalsModalOpen && (
        <KpiDetailModal
          modalType="signals"
          onClose={() => setIsSignalsModalOpen(false)}
          timelineFilter={timelineFilter}
          workspaceId={currentWorkspaceId}
          workspaceName={workspaceNames[currentWorkspaceId]}
          signals={signals.filter(sig => {
            if (timelineFilter === 'present_week') return sig.signal_id !== 'sig_bare_pcb_mna_consolidation';
            if (timelineFilter === 'past_week') return ['sig_defense_rail_kavach_localization', 'sig_bare_pcb_mna_consolidation'].includes(sig.signal_id);
            return true;
          })}
          timeline={timeline}
          competitors={candidates}
          onSelectSignal={() => setIsSignalsModalOpen(false)}
        />
      )}
    </div>
  </ErrorBoundary>
  );
}

export default App;
