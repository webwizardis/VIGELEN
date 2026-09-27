import React, { useState } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { NavTabId } from './Sidebar';

interface IntelSidebarProps {
  openCasesCount?: number;
  onNavigateTab: (tab: NavTabId) => void;
}

export const IntelSidebar: React.FC<IntelSidebarProps> = ({
  openCasesCount = 3,
  onNavigateTab,
}) => {
  const [activeRange, setActiveRange] = useState<'7D' | '30D' | 'ALL'>('30D');

  const distribution = {
    '7D': { low: 48, moderate: 26, high: 21, critical: 5 },
    '30D': { low: 184, moderate: 92, high: 74, critical: 18 },
    ALL: { low: 412, moderate: 198, high: 165, critical: 42 },
  }[activeRange];

  const total =
    distribution.low + distribution.moderate + distribution.high + distribution.critical;

  return (
    <aside className="w-80 shrink-0 flex-col gap-6 border-l border-[#e4e4e7] bg-[#fdfdfc] p-6 overflow-y-auto hidden xl:flex">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center border border-[#1a1a1a] bg-white text-[#1a1a1a]">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <span className="mono text-xs font-bold tracking-tight text-[#1a1a1a]">
            Risk Telemetry Desk
          </span>
        </div>
        <span className="flex items-center gap-1.5 border border-[#1a1a1a] bg-white px-2 py-0.5 text-[10px] font-bold text-[#1a1a1a] mono">
          <span className="indicator" />
          <span>LIVE</span>
        </span>
      </div>

      {/* Stat 1: Evaluations */}
      <div className="border border-[#e4e4e7] bg-white p-4">
        <div className="flex items-center justify-between text-xs font-semibold text-[#71717a]">
          <span className="mono text-[0.65rem]">Evaluated Inquiries</span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-[#1a1a1a] mono">
            <TrendingUp className="h-3 w-3" />
            <span>+18.4%</span>
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-3xl font-semibold text-[#1a1a1a]">
            142
          </span>
          <span className="mono text-[0.65rem] text-[#71717a]">scans completed</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-[#71717a] border-t border-[#e4e4e7] pt-2.5">
          <span className="mono text-[0.6rem]">Pre-transfer heuristics</span>
          <span className="mono text-[0.65rem] text-[#1a1a1a] font-bold">99.8% safe</span>
        </div>
      </div>

      {/* Stat 2: Active Dossiers */}
      <div className="border border-[#1a1a1a] bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="mono text-[0.65rem] text-[#71717a] uppercase font-bold">Active Dossiers</span>
          <span className="border border-[#1a1a1a] bg-[#1a1a1a] text-white px-1.5 py-0.2 mono text-[9px] font-bold uppercase">
            Priority
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-3xl font-semibold text-[#1a1a1a]">
            {String(openCasesCount).padStart(2, '0')}
          </span>
          <span className="mono text-[0.65rem] text-[#71717a]">under active review</span>
        </div>
        <button
          onClick={() => onNavigateTab('cases')}
          className="mt-3 flex w-full items-center justify-between border border-[#1a1a1a] bg-white px-3 py-1.5 mono text-[0.7rem] font-bold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
        >
          <span>Open Casebook</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Stat 3: Risk Distribution Bar */}
      <div className="border border-[#e4e4e7] bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="mono text-[0.65rem] font-bold text-[#1a1a1a] uppercase">Risk Distribution</span>
          <div className="flex border border-[#1a1a1a] p-0.5 bg-white">
            {(['7D', '30D', 'ALL'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                className={`px-2 py-0.5 mono text-[9px] font-bold transition-all cursor-pointer ${
                  activeRange === r
                    ? 'bg-[#1a1a1a] text-white'
                    : 'text-[#71717a] hover:text-[#1a1a1a]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Stacked Segmented Bar */}
        <div className="h-2 w-full overflow-hidden border border-[#1a1a1a] bg-[#e4e4e7] flex">
          <div
            style={{ width: `${(distribution.low / total) * 100}%` }}
            className="bg-[#10b981] transition-all duration-300"
            title={`Low Risk: ${distribution.low}`}
          />
          <div
            style={{ width: `${(distribution.moderate / total) * 100}%` }}
            className="bg-[#f59e0b] transition-all duration-300"
            title={`Moderate: ${distribution.moderate}`}
          />
          <div
            style={{ width: `${(distribution.high / total) * 100}%` }}
            className="bg-[#ea580c] transition-all duration-300"
            title={`High: ${distribution.high}`}
          />
          <div
            style={{ width: `${(distribution.critical / total) * 100}%` }}
            className="bg-[#be123c] transition-all duration-300"
            title={`Critical: ${distribution.critical}`}
          />
        </div>

        {/* Legend grid */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between border border-[#e4e4e7] bg-[#fdfdfc] p-1.5">
            <span className="flex items-center gap-1.5 mono text-[10px] text-[#1a1a1a]">
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              <span>Low</span>
            </span>
            <span className="font-bold text-[#1a1a1a] mono text-[10px]">{distribution.low}</span>
          </div>

          <div className="flex items-center justify-between border border-[#e4e4e7] bg-[#fdfdfc] p-1.5">
            <span className="flex items-center gap-1.5 mono text-[10px] text-[#1a1a1a]">
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
              <span>Mod</span>
            </span>
            <span className="font-bold text-[#1a1a1a] mono text-[10px]">{distribution.moderate}</span>
          </div>

          <div className="flex items-center justify-between border border-[#e4e4e7] bg-[#fdfdfc] p-1.5">
            <span className="flex items-center gap-1.5 mono text-[10px] text-[#1a1a1a]">
              <span className="h-2 w-2 rounded-full bg-[#ea580c]" />
              <span>High</span>
            </span>
            <span className="font-bold text-[#1a1a1a] mono text-[10px]">{distribution.high}</span>
          </div>

          <div className="flex items-center justify-between border border-[#e4e4e7] bg-[#fdfdfc] p-1.5">
            <span className="flex items-center gap-1.5 mono text-[10px] text-[#1a1a1a]">
              <span className="h-2 w-2 rounded-full bg-[#be123c]" />
              <span>Crit</span>
            </span>
            <span className="font-bold text-[#1a1a1a] mono text-[10px]">{distribution.critical}</span>
          </div>
        </div>
      </div>

      {/* Stat 4: Protection Policy */}
      <div className="border border-[#1a1a1a] bg-[#ffffff] p-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1a1a1a]">
          <ShieldAlert className="h-3.5 w-3.5 text-[#1a1a1a]" />
          <span className="mono text-[0.65rem] uppercase">Statutory Policy</span>
        </div>
        <blockquote className="mt-2 text-xs italic text-[#1a1a1a]/85 leading-relaxed font-serif">
          &ldquo;Never transfer funds to personal UPI VPAs, private accounts, or unverified handlers claiming guaranteed returns.&rdquo;
        </blockquote>
      </div>

      {/* Stat 5: Registry Checksums */}
      <div className="border border-[#e4e4e7] bg-white p-4 text-xs space-y-2">
        <div className="flex items-center justify-between text-[#71717a]">
          <span className="flex items-center gap-1.5 mono text-[0.6rem]">
            <Lock className="h-3 w-3 text-[#1a1a1a]" />
            <span>Cryptographic Checksum</span>
          </span>
          <span className="mono text-[9px] text-[#1a1a1a] border border-[#1a1a1a] px-1 font-bold">
            SHA-256 Valid
          </span>
        </div>
        <div className="flex items-center justify-between text-[#71717a]">
          <span className="mono text-[0.6rem]">Model Registry</span>
          <span className="mono text-[9px] text-[#1a1a1a] border border-[#1a1a1a] px-1 font-bold">
            v4.2-PROD
          </span>
        </div>
      </div>
    </aside>
  );
};
