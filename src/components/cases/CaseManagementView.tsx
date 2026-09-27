import React, { useState } from 'react';
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  FileText,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChevronRight,
  Printer,
  Download,
  Share2,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  CreditCard,
  FileCheck,
} from 'lucide-react';
import {
  InvestigationCase,
  InvestigationEvidence,
  CasePriority,
  CaseStatus,
} from '../../types';
import { RiskTimeline } from './RiskTimeline';

interface CaseManagementViewProps {
  cases: InvestigationCase[];
  selectedCaseId?: string | null;
  onSelectCase?: (caseItem: InvestigationCase) => void;
  onAddCase?: (newCase: InvestigationCase) => void;
}

export const CaseManagementView: React.FC<CaseManagementViewProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  onAddCase,
}) => {
  const [activeCaseId, setActiveCaseId] = useState<string>(
    selectedCaseId || (cases.length > 0 ? cases[0].id : '')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CaseStatus>('ALL');

  // Exactly the 6 required tabs (Section 16): Overview, Evidence, Timeline, Risk Signals, Analysis, Report
  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Evidence' | 'Timeline' | 'Risk Signals' | 'Analysis' | 'Report'
  >('Overview');

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.entityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityBadge = (priority: CasePriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
            <Flame className="h-3 w-3 text-rose-600" />
            <span>Critical</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-700 border border-orange-200">
            <AlertTriangle className="h-3 w-3 text-orange-600" />
            <span>High Risk</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
            <span>Medium</span>
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            <span>Low Risk</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'UNDER_REVIEW':
        return (
          <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200">
            Under Review
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
            Flagged
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            Resolved
          </span>
        );
      case 'OPEN':
      default:
        return (
          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
            Open
          </span>
        );
    }
  };

  // Professional evidence items table (Section 17)
  const evidenceItems = [
    {
      id: 'ev-1',
      type: 'Analyzed Text',
      source: 'Telegram Channel Broadcast',
      timestamp: '2026-09-24 14:15',
      status: 'Verified',
      summary: 'Promised 45% return in 15 days with 100% money-back guarantee.',
    },
    {
      id: 'ev-2',
      type: 'Extracted Claims',
      source: 'Deterministic Claim Parser',
      timestamp: '2026-09-24 14:32',
      status: 'Flagged',
      summary: 'Explicit return guarantee with zero statutory risk disclosure.',
    },
    {
      id: 'ev-3',
      type: 'Uploaded Screenshot',
      source: 'Mobile App Capture (shot-1.png)',
      timestamp: '2026-09-24 14:35',
      status: 'Archived',
      summary: 'WhatsApp group invite containing direct payment link to individual VPA.',
    },
    {
      id: 'ev-4',
      type: 'Transaction Information',
      source: 'Core Banking Gateway Node',
      timestamp: '2026-09-24 14:40',
      status: 'Quarantined',
      summary: 'Outflow request of ₹25,000 to personal UPI handle vipcalls98@oksbi.',
    },
    {
      id: 'ev-5',
      type: 'Risk Signals',
      source: 'Linguistic & Heuristic Rulebase',
      timestamp: '2026-09-24 14:44',
      status: 'Active Alert',
      summary: 'Urgency tactics, unverified advisor credentials, high baseline deviation.',
    },
    {
      id: 'ev-6',
      type: 'Model Explanations',
      source: 'Feature Attribution Engine',
      timestamp: '2026-09-24 15:02',
      status: 'Computed',
      summary: 'Compound risk score driven primarily by promised return and VPA risk.',
    },
  ];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Investigate
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">Case Dossiers</span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Cases
            </h1>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl">
              Manage multi-event risk investigations, catalog evidentiary records, and export comprehensive audit reports.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <span className="rounded-lg bg-indigo-50 px-3 py-1.5 font-mono text-xs font-bold text-indigo-700 border border-indigo-200">
              {filteredCases.length} Active Investigations
            </span>
          </div>
        </div>
      </div>

      {/* Main Investigation Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Cases Sidebar List (4 cols) */}
        <div className="space-y-3 lg:col-span-4">
          {/* Search & Filter */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case ID, promoter or subject..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1">
              {(['ALL', 'OPEN', 'UNDER_REVIEW', 'FLAGGED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded px-2 py-0.5 text-[10px] font-bold transition-colors ${
                    statusFilter === st
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-2.5">
            {filteredCases.map((c) => {
              const isSelected = c.id === activeCase.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveCaseId(c.id);
                    onSelectCase?.(c);
                  }}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-indigo-700">
                      {c.caseNumber}
                    </span>
                    {getStatusBadge(c.status)}
                  </div>

                  <h3 className="mt-2 text-xs font-bold text-slate-900 line-clamp-1">
                    {c.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
                    {c.entityName}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>Evidence: <strong>{c.evidence.length || 4}</strong></span>
                      <span>·</span>
                      <span>Events: <strong>{c.riskProgression?.length || 5}</strong></span>
                    </div>
                    {getPriorityBadge(c.priority)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Case Details (8 cols) */}
        {activeCase && (
          <div className="space-y-5 lg:col-span-8">
            {/* Case Header Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-indigo-600">
                      {activeCase.caseNumber}
                    </span>
                    {getStatusBadge(activeCase.status)}
                    {getPriorityBadge(activeCase.priority)}
                  </div>
                  <h2 className="mt-1 font-display text-lg font-black text-slate-900">
                    {activeCase.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target Entity: <span className="font-semibold text-slate-700">{activeCase.entityName}</span> · Assigned Analyst: <span className="font-semibold text-slate-700">{activeCase.assignedAnalyst}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Risk Index
                    </span>
                    <p className="font-mono-numbers text-2xl font-black text-rose-600 leading-tight">
                      {activeCase.riskScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 6 Required Tabs (Section 16) */}
              <div className="mt-4 flex overflow-x-auto border-b border-slate-100 pb-1 gap-2">
                {[
                  'Overview',
                  'Evidence',
                  'Timeline',
                  'Risk Signals',
                  'Analysis',
                  'Report',
                ].map((tabName) => {
                  const isActive = activeTab === tabName;
                  return (
                    <button
                      key={tabName}
                      onClick={() => setActiveTab(tabName as typeof activeTab)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {tabName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'Overview' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                    Case Summary
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {activeCase.summary}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-slate-100 pt-4 text-xs">
                    <div>
                      <span className="text-slate-400">Created:</span>
                      <p className="font-semibold text-slate-800 font-mono mt-0.5">{activeCase.createdAt}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Updated:</span>
                      <p className="font-semibold text-slate-800 font-mono mt-0.5">{activeCase.updatedAt}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Evidence Count:</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{activeCase.evidence.length || 4} items</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Timeline Events:</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{activeCase.riskProgression?.length || 5} logged</p>
                    </div>
                  </div>
                </div>

                {/* Analyst Notes */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                    Analyst Notes
                  </h3>
                  <div className="space-y-2">
                    {activeCase.notes.map((note, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 border border-slate-100"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EVIDENCE (Section 17 - Professional Table) */}
            {activeTab === 'Evidence' && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Case Evidence Catalog
                    </h3>
                    <p className="text-xs text-slate-500">
                      Catalog of uploaded screenshots, analyzed text, extracted claims, transaction data, and risk signals.
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-indigo-700">
                    {evidenceItems.length} Records
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                        <th className="px-3 py-2.5">Type</th>
                        <th className="px-3 py-2.5">Source</th>
                        <th className="px-3 py-2.5">Timestamp</th>
                        <th className="px-3 py-2.5">Status</th>
                        <th className="px-3 py-2.5">Summary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {evidenceItems.map((ev) => (
                        <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-3 py-3 font-semibold text-slate-900 whitespace-nowrap">
                            {ev.type}
                          </td>
                          <td className="px-3 py-3 text-slate-600 whitespace-nowrap font-medium">
                            {ev.source}
                          </td>
                          <td className="px-3 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                            {ev.timestamp}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-700 border border-indigo-200">
                              {ev.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-slate-700 max-w-sm">
                            {ev.summary}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: TIMELINE (Section 15 - Risk Timeline) */}
            {activeTab === 'Timeline' && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <RiskTimeline caseData={activeCase} />
              </div>
            )}

            {/* TAB 4: RISK SIGNALS */}
            {activeTab === 'Risk Signals' && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Risk Signal Inferences
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3.5">
                    <span className="font-bold text-xs text-rose-800">Guaranteed Return Language</span>
                    <p className="mt-1 text-xs text-slate-600">45% assured profit in 15 days without risk disclosure.</p>
                  </div>
                  <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3.5">
                    <span className="font-bold text-xs text-rose-800">Unregistered Promoter</span>
                    <p className="mt-1 text-xs text-slate-600">SEBI intermediary check confirms zero advisory licensing.</p>
                  </div>
                  <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-3.5">
                    <span className="font-bold text-xs text-orange-800">Direct Personal Payment</span>
                    <p className="mt-1 text-xs text-slate-600">Solicitation to transfer ₹25,000 to individual VPA vipcalls98@oksbi.</p>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3.5">
                    <span className="font-bold text-xs text-amber-800">Outflow Velocity Outlier</span>
                    <p className="mt-1 text-xs text-slate-600">Debit request is 8.0x above investor 30-day baseline average.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: ANALYSIS */}
            {activeTab === 'Analysis' && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Cross-Signal Synthesis
                </h3>
                <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                  <p>
                    The evidence demonstrates a correlated multi-stage financial risk pattern. Phase 1 involved distribution of unrealistic profit claims via closed messaging channels. Phase 2 established artificial urgency through countdown assertions.
                  </p>
                  <p>
                    Phase 3 generated a transaction request to an individual peer VPA rather than an institutional escrow. The combination of unregistered promoter identity and personal payment destination validates the high risk classification.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 6: REPORT (Section 18 - Reporting) */}
            {activeTab === 'Report' && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      VIGILEN INVESTIGATION REPORT
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Case: {activeCase.caseNumber} · Generated: Today
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrintReport}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
                    >
                      <Printer className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Print</span>
                    </button>
                    <button
                      onClick={handlePrintReport}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export PDF</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-slate-700">
                  <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-slate-400 font-semibold">Case ID:</span>
                      <p className="font-mono font-bold text-slate-900 mt-0.5">{activeCase.caseNumber}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold">Timestamp:</span>
                      <p className="font-mono font-bold text-slate-900 mt-0.5">{activeCase.createdAt}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold">Risk Assessment:</span>
                    <p className="font-bold text-rose-700 text-sm mt-0.5">
                      {activeCase.priority} Risk ({activeCase.riskScore}/100) — Potentially suspicious characteristics detected.
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold">Explanation:</span>
                    <p className="mt-1 leading-relaxed">{activeCase.summary}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold">Verification Guidance:</span>
                    <ul className="mt-1 space-y-1 list-disc list-inside text-slate-600">
                      <li>Confirm promoter registration on scores.gov.in.</li>
                      <li>Withhold transfers to personal UPI handles.</li>
                      <li>Consult accredited registered advisors before investing.</li>
                    </ul>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80 text-[11px] text-slate-500">
                    <strong className="text-slate-700">Limitations & Disclaimer:</strong> VIGILEN reports provide prototype empirical risk classifications based on algorithmic analysis of submitted materials. This dossier does not constitute legal counsel or judicial proof of fraud.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
