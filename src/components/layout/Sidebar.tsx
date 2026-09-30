import React from 'react';
import { X } from 'lucide-react';

export type NavTabId =
  | 'dashboard'
  | 'landing'
  | 'scam-detector'
  | 'transaction-security'
  | 'risk-profile'
  | 'safety-center'
  | 'cases'
  | 'reports'
  | 'unified-risk'
  | 'research-lab'
  | 'settings'
  | 'privacy';

export interface NavTabMeta {
  id: NavTabId;
  label: string;
  shortLabel: string;
  category: string;
}

export const NAV_TAB_LIST: NavTabMeta[] = [
  { id: 'dashboard', label: 'Risk Dashboard', shortLabel: 'Dashboard', category: 'Operations' },
  { id: 'landing', label: 'Platform Overview', shortLabel: 'Overview', category: 'Operations' },
  { id: 'scam-detector', label: 'Investment Content', shortLabel: 'Content Scan', category: 'Core Screening' },
  { id: 'transaction-security', label: 'Transaction Security', shortLabel: 'Transactions', category: 'Core Screening' },
  { id: 'risk-profile', label: 'Investor Risk Profile', shortLabel: 'Risk Profile', category: 'Investor Protection' },
  { id: 'safety-center', label: 'Safety Center', shortLabel: 'Safety', category: 'Investor Protection' },
  { id: 'cases', label: 'Case Management', shortLabel: 'Casebook', category: 'Intelligence & Cases' },
  { id: 'reports', label: 'Audit Reports', shortLabel: 'Reports', category: 'Intelligence & Cases' },
  { id: 'unified-risk', label: 'Unified Risk Model', shortLabel: 'Unified Model', category: 'Intelligence & Cases' },
  { id: 'research-lab', label: 'Model Lab', shortLabel: 'Model Lab', category: 'Intelligence & Cases' },
  { id: 'settings', label: 'System Settings', shortLabel: 'Settings', category: 'System' },
  { id: 'privacy', label: 'Privacy & Security', shortLabel: 'Privacy', category: 'System' },
];

interface SidebarProps {
  currentTab: NavTabId;
  setCurrentTab: (tab: NavTabId) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  casesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  mobileOpen,
  setMobileOpen,
  casesCount = 3,
}) => {
  const navSections = [
    {
      title: 'Operations',
      items: [
        { id: 'dashboard' as NavTabId, label: 'Risk Dashboard' },
        { id: 'landing' as NavTabId, label: 'Platform Overview' },
      ],
    },
    {
      title: 'Core Screening',
      items: [
        { id: 'scam-detector' as NavTabId, label: 'Investment Content' },
        { id: 'transaction-security' as NavTabId, label: 'Transaction Security' },
      ],
    },
    {
      title: 'Investor Protection',
      items: [
        { id: 'risk-profile' as NavTabId, label: 'Investor Risk Profile' },
        { id: 'safety-center' as NavTabId, label: 'Safety Center' },
      ],
    },
    {
      title: 'Intelligence & Cases',
      items: [
        {
          id: 'cases' as NavTabId,
          label: `Cases [${String(casesCount).padStart(2, '0')}]`,
        },
        { id: 'reports' as NavTabId, label: 'Audit Reports' },
        { id: 'unified-risk' as NavTabId, label: 'Unified Risk Model' },
        { id: 'research-lab' as NavTabId, label: 'Model Lab' },
      ],
    },
  ];

  const handleSelectTab = (tab: NavTabId) => {
    setCurrentTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#1a1a1a]/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Variation 12 Aside Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 flex-col justify-between border-r border-[#e4e4e7] bg-[#fdfdfc] p-8 transition-transform duration-200 md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-9 overflow-y-auto">
          {/* Logo Section */}
          <div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleSelectTab('dashboard')}
                className="font-serif text-[1.8rem] italic font-semibold text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-2 mb-3 text-left w-full hover:opacity-90 transition-opacity cursor-pointer"
              >
                Vigilen
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="p-1 text-[#71717a] hover:text-[#1a1a1a] md:hidden cursor-pointer -mt-4"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mono text-[0.55rem] text-[#71717a] tracking-widest">
              Intelligence v4.2
            </div>
          </div>

          {/* Navigation Sections */}
          {navSections.map((sec) => (
            <div key={sec.title} className="nav-section">
              <h4 className="mono text-[#71717a] mb-4">{sec.title}</h4>
              <ul className="list-none flex flex-col gap-3">
                {sec.items.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full text-left text-[0.85rem] flex justify-between items-center transition-colors cursor-pointer py-0.5 ${
                          isActive
                            ? 'font-bold text-[#1a1a1a]'
                            : 'text-[#71717a] hover:text-[#1a1a1a]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && <span className="indicator" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Navigation Links */}
        <div className="nav-section border-t border-[#e4e4e7] pt-4 mt-6">
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => handleSelectTab('settings')}
              className={`mono transition-colors cursor-pointer ${
                currentTab === 'settings'
                  ? 'text-[#1a1a1a] font-bold underline'
                  : 'text-[#71717a] hover:text-[#1a1a1a]'
              }`}
            >
              Settings
            </button>
            <span className="text-[#e4e4e7]">·</span>
            <button
              onClick={() => handleSelectTab('privacy')}
              className={`mono transition-colors cursor-pointer ${
                currentTab === 'privacy'
                  ? 'text-[#1a1a1a] font-bold underline'
                  : 'text-[#71717a] hover:text-[#1a1a1a]'
              }`}
            >
              Privacy
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
