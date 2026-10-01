import React, { useState, useEffect } from 'react';
import { TopNav } from './components/layout/TopNav';
import { Sidebar, NavTabId, NAV_TAB_LIST } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ScamDetectorView } from './components/scam-detector/ScamDetectorView';
import { TransactionSecurityView } from './components/transaction-security/TransactionSecurityView';
import { SafetyCenterView } from './components/safety/SafetyCenterView';
import { ResearchLabView } from './components/research-lab/ResearchLabView';
import { SettingsView } from './components/settings/SettingsView';
import { PrivacyCenterView } from './components/privacy-security/PrivacyCenterView';
import { LandingSection } from './components/landing/LandingSection';
import { ShieldAssistantModal } from './components/assistant/ShieldAssistantModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { QuickSearchModal } from './components/common/QuickSearchModal';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  NotificationItem,
  SystemStatus,
} from './types';
import { DEFAULT_SYSTEM_STATUS } from './data/mockData';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTabId>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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
      title: 'Model Registry Calibrated',
      description: 'Supervised 80/20 benchmark weights refreshed with latest regulatory intelligence.',
      timestamp: 'Yesterday',
      type: 'MODEL_EVAL',
      read: true,
      linkTab: 'research-lab',
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

      if (e.key === '[') {
        handlePrevTab();
      } else if (e.key === ']') {
        handleNextTab();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTabIndex]);

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
      />

      {/* Main Workspace: Left Sidebar + Center Primary Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar (280px) */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          mobileOpen={mobileNavOpen}
          setMobileOpen={setMobileNavOpen}
        />

        {/* Center Primary Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-14">
          <div className="max-w-5xl mx-auto">
            {/* View Switching */}
            {currentTab === 'dashboard' && (
              <DashboardView
                systemStatus={systemStatus}
                onNavigateToScamDetector={() => setCurrentTab('scam-detector')}
                onNavigateToTransactionSecurity={() => setCurrentTab('transaction-security')}
                onNavigateToLanding={() => setCurrentTab('landing')}
                onNavigateToResearchLab={() => setCurrentTab('research-lab')}
              />
            )}

            {currentTab === 'landing' && (
              <LandingSection
                onPrimaryAction={() => setCurrentTab('scam-detector')}
                onSecondaryAction={() => setCurrentTab('transaction-security')}
                onSelectFeature={(featId) => {
                  if (featId === 'scam-detector') setCurrentTab('scam-detector');
                  else if (featId === 'transaction-security') setCurrentTab('transaction-security');
                  else if (featId === 'safety-center') setCurrentTab('safety-center');
                  else if (featId === 'research-lab') setCurrentTab('research-lab');
                }}
              />
            )}

            {currentTab === 'scam-detector' && (
              <ScamDetectorView />
            )}

            {currentTab === 'transaction-security' && (
              <TransactionSecurityView />
            )}

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
            Registry: v4.2-PROTOTYPE
          </div>
        </div>
        <div className="mono text-[#71717a]">
          VIGELEN — FINANCIAL RISK ANALYSIS PROTOTYPE
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
        onSelectTab={(tab: NavTabId) => setCurrentTab(tab)}
      />
    </div>
  );
}

export default App;
