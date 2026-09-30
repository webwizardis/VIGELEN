import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  CreditCard,
  FolderOpen,
  Sliders,
  ShieldCheck,
  FlaskConical,
  FileCheck,
  Settings,
  Lock,
  LayoutDashboard,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { NavTabId } from '../layout/Sidebar';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTabId) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchItems = [
    {
      title: 'Risk Dashboard',
      subtitle: 'Primary capital protection analytics & telemetry overview',
      category: 'Operations',
      tab: 'dashboard' as NavTabId,
      icon: <LayoutDashboard className="h-4 w-4 text-[#1a1a1a]" />,
    },
    {
      title: 'Platform Overview',
      subtitle: 'Architectural specifications & risk intelligence layers',
      category: 'Operations',
      tab: 'landing' as NavTabId,
      icon: <Globe className="h-4 w-4 text-[#1a1a1a]" />,
    },
    {
      title: 'Investment Content Screening',
      subtitle: 'Analyze solicitations, chat tips & guaranteed return claims',
      category: 'Core Screening',
      tab: 'scam-detector' as NavTabId,
      icon: <Search className="h-4 w-4 text-[#2563eb]" />,
    },
    {
      title: 'Transaction Security',
      subtitle: 'Detect high-velocity anomalous transfers and illicit VPAs',
      category: 'Core Screening',
      tab: 'transaction-security' as NavTabId,
      icon: <CreditCard className="h-4 w-4 text-[#2563eb]" />,
    },
    {
      title: 'Investor Risk Profile',
      subtitle: 'Evaluate susceptibility factors & defensive thresholds',
      category: 'Investor Protection',
      tab: 'risk-profile' as NavTabId,
      icon: <ShieldCheck className="h-4 w-4 text-[#2563eb]" />,
    },
    {
      title: 'Safety Center',
      subtitle: 'Broker verification & official registry lookups',
      category: 'Investor Protection',
      tab: 'safety-center' as NavTabId,
      icon: <ShieldCheck className="h-4 w-4 text-[#2563eb]" />,
    },
    {
      title: 'Active Case Dossiers',
      subtitle: 'Investigation evidence compilation and timeline logs',
      category: 'Intelligence',
      tab: 'cases' as NavTabId,
      icon: <FolderOpen className="h-4 w-4 text-[#1a1a1a]" />,
    },
    {
      title: 'Audit Reports & Exports',
      subtitle: 'Generate formatted evidence summaries for filing',
      category: 'Intelligence',
      tab: 'reports' as NavTabId,
      icon: <FileCheck className="h-4 w-4 text-[#1a1a1a]" />,
    },
    {
      title: 'Unified Risk Model',
      subtitle: 'Cross-vector Bayesian risk calculation engine',
      category: 'Intelligence',
      tab: 'unified-risk' as NavTabId,
      icon: <Sliders className="h-4 w-4 text-[#1a1a1a]" />,
    },
    {
      title: 'Model Research Lab',
      subtitle: 'Benchmarking datasets & heuristic accuracy tests',
      category: 'Intelligence',
      tab: 'research-lab' as NavTabId,
      icon: <FlaskConical className="h-4 w-4 text-[#1a1a1a]" />,
    },
    {
      title: 'Settings & Sensitivity',
      subtitle: 'Calibrate risk tolerances and alert triggers',
      category: 'System',
      tab: 'settings' as NavTabId,
      icon: <Settings className="h-4 w-4 text-[#71717a]" />,
    },
    {
      title: 'Privacy Protocol',
      subtitle: 'Cryptographic non-custodial data safeguards',
      category: 'System',
      tab: 'privacy' as NavTabId,
      icon: <Lock className="h-4 w-4 text-[#71717a]" />,
    },
  ];

  const filtered = searchItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-[#1a1a1a]/40 p-4 backdrop-blur-xs">
      <div className="flex w-full max-w-xl flex-col border border-[#1a1a1a] bg-[#fdfdfc] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Box */}
        <div className="flex items-center gap-3 border-b border-[#e4e4e7] px-5 py-4 bg-white">
          <Search className="h-4 w-4 text-[#71717a] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filtered.length > 0) {
                e.preventDefault();
                onNavigate(filtered[0].tab);
                onClose();
              }
            }}
            placeholder="Type command, module, or investigation search..."
            className="flex-1 bg-transparent text-sm text-[#1a1a1a] placeholder:text-[#71717a] font-sans focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#71717a] hover:text-[#1a1a1a] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center mono text-xs text-[#71717a]">
              No matching modules found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigate(item.tab);
                  onClose();
                }}
                className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-white border border-transparent hover:border-[#e4e4e7] group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#e4e4e7] bg-[#fdfdfc]">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#1a1a1a] group-hover:text-[#1a1a1a] transition-colors truncate">
                        {item.title}
                      </span>
                      <span className="mono text-[0.6rem] text-[#71717a]">
                        [{item.category}]
                      </span>
                    </div>
                    <p className="text-[11px] text-[#71717a] truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mono text-[0.65rem] text-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                  <span>Jump</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#e4e4e7] bg-white px-5 py-3 text-[11px] text-[#71717a]">
          <span className="mono text-[0.65rem]">Navigate with ⌘K</span>
          <span className="mono text-[0.65rem]">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
