import React, { useState } from 'react';
import {
  Search,
  Bell,
  X,
  Menu,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface TopNavProps {
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onNavigateTab?: (tab: string) => void;
  onToggleMobileNav?: () => void;
  // Tab Navigation Arrows
  onPrevTab?: () => void;
  onNextTab?: () => void;
  canPrevTab?: boolean;
  canNextTab?: boolean;
  prevTabLabel?: string;
  nextTabLabel?: string;
  currentTabLabel?: string;
  currentTabCategory?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  notifications,
  onOpenNotifications,
  onOpenSearch,
  onToggleMobileNav,
  onPrevTab,
  onNextTab,
  canPrevTab = true,
  canNextTab = true,
  prevTabLabel,
  nextTabLabel,
  currentTabLabel = 'Risk Dashboard',
  currentTabCategory = 'Operations',
}) => {
  const [helpOpen, setHelpOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#e4e4e7] bg-[#fdfdfc]/95 px-3 sm:px-6 md:px-8 backdrop-blur-sm gap-2">
        {/* Left Section: Mobile Menu + Station Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleMobileNav && (
            <button
              onClick={onToggleMobileNav}
              className="flex h-8 w-8 items-center justify-center border border-[#1a1a1a] bg-white text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white md:hidden cursor-pointer transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="mono text-[0.6rem] text-[#1a1a1a] font-bold">
              [ VIGILEN INTELLIGENCE ]
            </span>
            <span className="hidden lg:inline text-xs text-[#71717a]">·</span>
            <span className="hidden lg:inline mono text-[0.6rem] text-[#71717a]">
              {currentTabCategory}
            </span>
          </div>
        </div>

        {/* Center: TAB NAVIGATION ARROWS (Back & Forth) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Back Arrow */}
          <button
            onClick={onPrevTab}
            disabled={!canPrevTab}
            title={prevTabLabel ? `Previous Tab: ${prevTabLabel}` : 'No previous tab'}
            aria-label={prevTabLabel ? `Previous Tab: ${prevTabLabel}` : 'Previous Tab'}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center border border-[#1a1a1a] bg-white text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white disabled:border-[#e4e4e7] disabled:bg-[#f4f4f5] disabled:text-[#a1a1aa] disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>

          {/* Current Tab Label Pill */}
          <div className="hidden sm:flex items-center gap-1.5 border border-[#1a1a1a] bg-white px-2.5 py-1 text-center shadow-2xs min-w-[130px] justify-center">
            <span className="indicator" />
            <span className="mono text-[0.65rem] font-bold text-[#1a1a1a] uppercase truncate max-w-[150px]">
              {currentTabLabel}
            </span>
          </div>

          {/* Forth / Next Arrow */}
          <button
            onClick={onNextTab}
            disabled={!canNextTab}
            title={nextTabLabel ? `Next Tab: ${nextTabLabel}` : 'No next tab'}
            aria-label={nextTabLabel ? `Next Tab: ${nextTabLabel}` : 'Next Tab'}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center border border-[#1a1a1a] bg-white text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white disabled:border-[#e4e4e7] disabled:bg-[#f4f4f5] disabled:text-[#a1a1aa] disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right Section: Black & White Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 text-xs text-[#1a1a1a] border border-[#1a1a1a] bg-white px-2.5 py-1 hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="mono text-[0.65rem] hidden sm:inline">Search ⌘K</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            aria-label="View notifications"
            className="relative flex h-8 w-8 items-center justify-center border border-[#1a1a1a] bg-white text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
          >
            <Bell className="h-3.5 w-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1a1a1a] border border-white px-1 font-mono text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Protocol Guide Button */}
          <button
            onClick={() => setHelpOpen(true)}
            className="mono text-[0.65rem] border border-[#1a1a1a] bg-white px-2.5 py-1 text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer hidden md:inline-block font-bold"
          >
            Protocol Guide
          </button>

          {/* Live Indicator */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-[#e4e4e7]">
            <span className="indicator" />
            <span className="mono text-[0.6rem] text-[#1a1a1a] hidden sm:inline font-bold">
              LIVE
            </span>
          </div>
        </div>
      </header>

      {/* Protocol Guide Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg border border-[#1a1a1a] bg-[#ffffff] p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-4">
              <div>
                <div className="mono text-[#1a1a1a] mb-1 font-bold">— Surveillance Standards</div>
                <h3 className="font-serif text-2xl font-semibold text-[#1a1a1a]">
                  Vigilen Risk Protocols
                </h3>
              </div>
              <button
                onClick={() => setHelpOpen(false)}
                className="flex h-7 w-7 items-center justify-center border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white cursor-pointer transition-colors"
                aria-label="Close protocol guide"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs text-[#1a1a1a]/85 leading-relaxed">
              <p>
                <strong className="text-[#1a1a1a]">Vigilen Enterprise Risk Intelligence</strong> monitors high-velocity retail capital flows and fraudulent investment schemes before settlement occurs.
              </p>

              <div className="border border-[#1a1a1a] p-4 bg-[#fdfdfc] space-y-3">
                <div>
                  <div className="mono text-[#1a1a1a] font-bold mb-0.5">01. Investment Content Screening</div>
                  <p className="text-[11px] text-[#71717a]">Flags guaranteed yield solicitations, artificial time scarcity, and unregistered advisor credentials.</p>
                </div>
                <div>
                  <div className="mono text-[#1a1a1a] font-bold mb-0.5">02. Transaction Velocity Sentinel</div>
                  <p className="text-[11px] text-[#71717a]">Analyzes payment anomalies, sudden destination VPAs, and baseline deviation patterns.</p>
                </div>
                <div>
                  <div className="mono text-[#1a1a1a] font-bold mb-0.5">03. Regulatory Dossiers</div>
                  <p className="text-[11px] text-[#71717a]">Formats cryptographic, chronological audit records for filing and legal escalation.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setHelpOpen(false)}
                className="btn btn-primary"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
