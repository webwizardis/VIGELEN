import React, { useState } from 'react';
import {
  FileCheck,
  Printer,
  Download,
  Search,
  Eye,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FileText,
} from 'lucide-react';
import { InvestigationCase } from '../../types';

interface ReportsViewProps {
  cases: InvestigationCase[];
  onNavigateToCase?: (caseId: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ cases, onNavigateToCase }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Investigate
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">Formal Dossiers</span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Reports
            </h1>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              Generate, preview, and export comprehensive risk audit reports for regulatory filing, dispute handling, or investor records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
            >
              <Printer className="h-4 w-4 text-indigo-600" />
              <span>Print Report</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Select Report & Report Dossier */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Case Reports Selector (4 cols) */}
        <div className="space-y-3 lg:col-span-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              Select Investigation Case
            </h3>
            <div className="space-y-2">
              {cases.map((c) => {
                const isSelected = c.id === activeCase?.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-indigo-700">
                        {c.caseNumber}
                      </span>
                      <span className="rounded bg-rose-50 px-1.5 py-0.2 font-mono text-[10px] font-bold text-rose-700 border border-rose-200">
                        Score: {c.riskScore}/100
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-slate-900 line-clamp-1">
                      {c.title}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {c.createdAt}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Full Investigation Report (Section 18) (8 cols) */}
        {activeCase && (
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
              {/* Document Letterhead */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                      <FileCheck className="h-4 w-4" />
                    </div>
                    <span className="font-display text-lg font-black tracking-tight text-slate-900">
                      VIGILEN RISK AUDIT REPORT
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Financial Risk Intelligence · Retail Investor Protection Protocol
                  </p>
                </div>
                <div className="text-right text-xs font-mono text-slate-500">
                  <p className="font-bold text-slate-800">Case ID: {activeCase.caseNumber}</p>
                  <p>Timestamp: {activeCase.createdAt}</p>
                  <p>Status: {activeCase.status}</p>
                </div>
              </div>

              {/* Case Input & Target Entity */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Investigated Input & Entity
                </span>
                <p className="font-display text-sm font-bold text-slate-900 mt-1">
                  {activeCase.title}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Promoter / Target Entity: <strong>{activeCase.entityName}</strong>
                </p>
              </div>

              {/* Risk Assessment */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                      Risk Assessment
                    </span>
                    <h3 className="font-display text-lg font-black text-rose-700 mt-0.5">
                      {activeCase.priority} Risk ({activeCase.riskScore} / 100)
                    </h3>
                  </div>
                  <span className="rounded bg-rose-100 px-2 py-1 font-mono text-xs font-bold text-rose-800">
                    POTENTIALLY SUSPICIOUS
                  </span>
                </div>
                <p className="mt-2 text-xs text-rose-900 leading-relaxed">
                  "Potentially suspicious characteristics detected across communication claims, payee destination, and baseline account behavior."
                </p>
              </div>

              {/* Risk Signals */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Risk Signals Identified
                </h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs">
                    <span className="font-bold text-rose-700">Guaranteed Return Language:</span>
                    <p className="text-slate-600 mt-0.5">Explicit 45% return promise violating statutory advisor standards.</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs">
                    <span className="font-bold text-orange-700">Urgency & Artificial FOMO:</span>
                    <p className="text-slate-600 mt-0.5">Countdown pressure alleging only limited enrollment slots remain.</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs">
                    <span className="font-bold text-amber-700">Unverified Regulatory Status:</span>
                    <p className="text-slate-600 mt-0.5">Zero matching registration record on official SEBI databases.</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs">
                    <span className="font-bold text-rose-700">Direct Personal Payee Handle:</span>
                    <p className="text-slate-600 mt-0.5">Transfer requested to personal UPI VPA without institutional clearing.</p>
                  </div>
                </div>
              </div>

              {/* Evidence Catalog */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Cataloged Evidence ({activeCase.evidence.length || 4} items)
                </h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Evidence Item</th>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2">Timestamp</th>
                        <th className="px-3 py-2">Risk Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeCase.evidence.map((ev) => (
                        <tr key={ev.id}>
                          <td className="px-3 py-2 font-medium text-slate-800">{ev.title}</td>
                          <td className="px-3 py-2 text-slate-500">{ev.type}</td>
                          <td className="px-3 py-2 font-mono text-[11px] text-slate-400">{ev.timestamp}</td>
                          <td className="px-3 py-2 font-mono font-bold text-rose-600">{ev.riskScore}/100</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Explanation in Plain Language */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                  Explanation
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeCase.summary} The convergence of high claimed return percentages, absence of mandatory statutory risk warnings, and solicitation toward private payment channels matches historical investment fraud typologies.
                </p>
              </div>

              {/* Verification Guidance */}
              <div className="rounded-xl bg-indigo-50/60 p-4 border border-indigo-100 text-xs">
                <h4 className="font-bold text-indigo-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Recommended Verification Guidance
                </h4>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  <li>Verify intermediary registration number on official regulator portals before transferring capital.</li>
                  <li>Refuse payments to individual savings accounts or personal VPAs claiming to hold escrow.</li>
                  <li>Report unverified unsolicited stock tips to cybercell fraud reporting portals.</li>
                </ul>
              </div>

              {/* Limitations & Disclaimer (Section 18) */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 text-[11px] text-slate-500 space-y-1.5">
                <p>
                  <strong className="text-slate-700">Limitations:</strong> VIGILEN algorithmic scores and indicators are calibrated against historical risk patterns and benchmark heuristics. They are generated automatically for pre-loss advisory insight.
                </p>
                <p>
                  <strong className="text-slate-700">Disclaimer:</strong> This report is for educational and retail risk prevention purposes only and does not constitute formal legal counsel, credit rating, or judicial determination of fraud.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
