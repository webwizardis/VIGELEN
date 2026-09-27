import React, { useState, useEffect } from 'react';
import { TopNav } from './components/layout/TopNav';
import { Sidebar, NavTabId, NAV_TAB_LIST } from './components/layout/Sidebar';
import { IntelSidebar } from './components/layout/IntelSidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ScamDetectorView } from './components/scam-detector/ScamDetectorView';
import { TransactionSecurityView } from './components/transaction-security/TransactionSecurityView';
import { CaseManagementView } from './components/cases/CaseManagementView';
import { UnifiedRiskView } from './components/unified-risk/UnifiedRiskView';
import { InvestorProtectionView } from './components/investor-protection/InvestorProtectionView';
import { SafetyCenterView } from './components/safety/SafetyCenterView';
import { ResearchLabView } from './components/research-lab/ResearchLabView';
import { SettingsView } from './components/settings/SettingsView';
import { PrivacyCenterView } from './components/privacy-security/PrivacyCenterView';
import { ReportsView } from './components/reports/ReportsView';
import { LandingSection } from './components/landing/LandingSection';
import { ShieldAssistantModal } from './components/assistant/ShieldAssistantModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { QuickSearchModal } from './components/common/QuickSearchModal';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  InvestigationCase,
  NotificationItem,
  SystemStatus,
  TextAnalysisResult,
  TransactionAnomalyResult,
} from './types';
import { INITIAL_INVESTIGATION_CASES, DEFAULT_SYSTEM_STATUS } from './data/mockData';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTabId>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [intelSidebarOpen, setIntelSidebarOpen] = useState(true);
  const [cases, setCases] = useState<InvestigationCase[]>(INITIAL_INVESTIGATION_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(INITIAL_INVESTIGATION_CASES[0]?.id || '');
  const [systemStatus] = useState<SystemStatus>(DEFAULT_SYSTEM_STATUS);

  // Assistant & Utility Modals
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'High Risk Transfer Intercepted',
      description: '₹85,000 transfer to an unverified beneficiary handle was intercepted.',
      timestamp: '10 mins ago',
      type: 'HIGH_RISK',
      read: false,
      linkTab: 'transaction-security',
    },
    {
      id: 'notif-2',
      title: 'Urgent Advisory Flagged',
      description: 'Telegram forward promising 45% weekly returns identified.',
      timestamp: '1 hour ago',
      type: 'SUSPICIOUS_TRANSACTION',
      read: false,
      linkTab: 'scam-detector',
    },
    {
      id: 'notif-3',
      title: 'Dossier Ready for Submission',
      description: 'Casebook #VGL-2026-0842 compiled with chronological audit logs.',
      timestamp: '3 hours ago',
      type: 'INFO',
      read: true,
      linkTab: 'cases',
    },
  ]);

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Tab sequential navigation calculations
  const currentTabIndex = NAV_TAB_LIST.findIndex((t) => t.id === currentTab);
  const canPrevTab = currentTabIndex > 0;
  const canNextTab = currentTabIndex < NAV_TAB_LIST.length - 1;
  const prevTab = canPrevTab ? NAV_TAB_LIST[currentTabIndex - 1] : null;
  const nextTab = canNextTab ? NAV_TAB_LIST[currentTabIndex + 1] : null;
  const currentMeta = NAV_TAB_LIST[currentTabIndex] || NAV_TAB_LIST[0];

  const handlePrevTab = () => {
    if (canPrevTab && prevTab) {
      setCurrentTab(prevTab.id);
    }
  };

  const handleNextTab = () => {
    if (canNextTab && nextTab) {
      setCurrentTab(nextTab.id);
    }
  };

  // Keyboard shortcut listener for Command+K and Tab navigation arrows ([ and ])
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }

      // Check if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
      if (isInput) return;

      if ((e.altKey && e.key === 'ArrowLeft') || e.key === '[') {
        e.preventDefault();
        if (canPrevTab && prevTab) setCurrentTab(prevTab.id);
      } else if ((e.altKey && e.key === 'ArrowRight') || e.key === ']') {
        e.preventDefault();
        if (canNextTab && nextTab) setCurrentTab(nextTab.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canPrevTab, canNextTab, prevTab, nextTab]);

  // Sync scroll on tab switch
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTop = 0;
  }, [currentTab]);

  const handleAttachContentToCase = (result: TextAnalysisResult) => {
    if (cases.length > 0) {
      const updated = [...cases];
      const newEvidence = {
        id: `ev-${Date.now()}`,
        type: 'CONTENT' as const,
        title: `Content Extraction: ${result.explanation?.summary?.slice(0, 30) || 'Flagged Message'}`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        summary: result.explanation?.summary || 'Guaranteed returns / deceptive advisory signals',
        riskScore: result.riskScore,
        tags: result.indicators.map((i) => i.label),
      };
      updated[0].evidence.unshift(newEvidence);
      updated[0].updatedAt = 'Just now';
      setCases(updated);
      setSelectedCaseId(updated[0].id);
      setCurrentTab('cases');
    }
  };

  const handleAttachTransactionToCase = (result: TransactionAnomalyResult) => {
    if (cases.length > 0) {
      const updated = [...cases];
      const detectedAnomalies = result.anomalies.filter((a) => a.detected);
      const newEvidence = {
        id: `ev-${Date.now()}`,
        type: 'TRANSACTION' as const,
        title: `Transaction Anomaly (Risk ${result.riskScore}/100)`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        summary: result.behavioralComparison?.naturalLanguageReason?.[0] || 'Velocity anomaly flagged pre-transfer',
        riskScore: result.riskScore,
        tags: detectedAnomalies.map((a) => a.description),
      };
      updated[0].evidence.unshift(newEvidence);
      updated[0].updatedAt = 'Just now';
      setCases(updated);
      setSelectedCaseId(updated[0].id);
      setCurrentTab('cases');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#fdfdfc] text-[#1a1a1a] transition-colors flex flex-col font-sans">
      {/* Top Utility Header with Back & Forth Tab Navigation Arrows */}
      <TopNav
        notifications={notifications}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onNavigateTab={(tab) => setCurrentTab(tab as NavTabId)}
        onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
        onPrevTab={handlePrevTab}
        onNextTab={handleNextTab}
        canPrevTab={canPrevTab}
        canNextTab={canNextTab}
        prevTabLabel={prevTab?.label}
        nextTabLabel={nextTab?.label}
        currentTabLabel={currentMeta.shortLabel}
        currentTabCategory={currentMeta.category}
        intelSidebarOpen={intelSidebarOpen}
        onToggleIntelSidebar={() => setIntelSidebarOpen((prev) => !prev)}
      />

      {/* Main 3-Column Workspace: Sidebar | Main Content | Intel Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar (280px) */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          mobileOpen={mobileNavOpen}
          setMobileOpen={setMobileNavOpen}
          casesCount={cases.length}
        />

        {/* Center Primary Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-14">
          <div className="max-w-5xl">
            {/* View Switching */}
            {currentTab === 'dashboard' && (
              <DashboardView
                systemStatus={systemStatus}
                openCasesCount={cases.length}
                onNavigateToScamDetector={() => setCurrentTab('scam-detector')}
                onNavigateToTransactionSecurity={() => setCurrentTab('transaction-security')}
                onNavigateToCases={() => setCurrentTab('cases')}
                onNavigateToReports={() => setCurrentTab('reports')}
                onNavigateToLanding={() => setCurrentTab('landing')}
              />
            )}

            {currentTab === 'landing' && (
              <LandingSection
                onPrimaryAction={() => setCurrentTab('scam-detector')}
                onSecondaryAction={() => setCurrentTab('transaction-security')}
                onSelectFeature={(featId) => {
                  if (featId === 'scam-detector') setCurrentTab('scam-detector');
                  else if (featId === 'transaction-security') setCurrentTab('transaction-security');
                  else if (featId === 'cases') setCurrentTab('cases');
                }}
              />
            )}

            {currentTab === 'scam-detector' && (
              <ScamDetectorView
                onOpenReport={() => setCurrentTab('reports')}
                onAttachToCase={handleAttachContentToCase}
              />
            )}

            {currentTab === 'transaction-security' && (
              <TransactionSecurityView
                onAttachToCase={handleAttachTransactionToCase}
              />
            )}

            {currentTab === 'cases' && (
              <CaseManagementView
                cases={cases}
                selectedCaseId={selectedCaseId}
                onSelectCase={(c) => setSelectedCaseId(c.id)}
                onAddCase={(newCase) => {
                  setCases((prev) => [newCase, ...prev]);
                  setSelectedCaseId(newCase.id);
                }}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView
                cases={cases}
                onNavigateToCase={(caseId) => {
                  setSelectedCaseId(caseId);
                  setCurrentTab('cases');
                }}
              />
            )}

            {currentTab === 'unified-risk' && (
              <UnifiedRiskView />
            )}

            {currentTab === 'risk-profile' && <InvestorProtectionView />}

            {currentTab === 'safety-center' && <SafetyCenterView />}

            {currentTab === 'research-lab' && <ResearchLabView />}

            {currentTab === 'settings' && <SettingsView />}

            {currentTab === 'privacy' && <PrivacyCenterView />}

            {/* TAB NAVIGATION PAGER (Move Back and Forth Between Tabs in Black & White) */}
            <div className="mt-16 pt-8 border-t border-[#e4e4e7] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevTab}
                disabled={!canPrevTab}
                className="btn btn-secondary w-full sm:w-auto disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Previous: {prevTab ? prevTab.shortLabel : 'Start'}</span>
              </button>

              <div className="flex items-center gap-2 mono text-xs text-[#71717a]">
                <span>Tab {currentTabIndex + 1} of {NAV_TAB_LIST.length}</span>
                <span>·</span>
                <span className="text-[#1a1a1a] font-bold">{currentMeta.label}</span>
              </div>

              <button
                type="button"
                onClick={handleNextTab}
                disabled={!canNextTab}
                className="btn btn-primary w-full sm:w-auto disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Next: {nextTab ? nextTab.shortLabel : 'End'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </main>

        {/* Right Intelligence Column (Intel Desk Feature) */}
        {intelSidebarOpen && (
          <IntelSidebar
            openCasesCount={cases.length}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}
      </div>

      {/* Variation 12 Status Footer Bar */}
      <div className="footer-bar">
        <div className="meta-group flex items-center gap-8">
          <div className="mono flex items-center gap-2">
            <span className="indicator" />
            <span>Surveillance System Active</span>
          </div>
          <div className="mono hidden sm:inline-block text-[#71717a]">
            Network Latency: 14ms
          </div>
          <div className="mono hidden sm:inline-block text-[#71717a]">
            Registry: v4.2-PROD
          </div>
        </div>
        <div className="mono text-[#71717a]">
          Vigilen &copy; 2024 Regulatory Systems
        </div>
      </div>

      {/* Floating Query Trigger Button in Black and White */}
      <button
        onClick={() => setAssistantOpen(true)}
        aria-label="Risk Intelligence Guidance"
        className="fixed bottom-14 right-8 z-40 btn btn-primary shadow-lg text-[0.7rem] py-2 px-4 cursor-pointer"
      >
        <span>Risk Guidance</span>
      </button>

      {/* Modals & Drawers */}
      <ShieldAssistantModal
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />

      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectNotification={(tab) => setCurrentTab(tab as NavTabId)}
      />

      <QuickSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
}

export default App;
