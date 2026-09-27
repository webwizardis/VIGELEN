import React from 'react';
import { X, Printer, Shield, FileText, CheckCircle2 } from 'lucide-react';
import { TextAnalysisResult } from '../../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TextAnalysisResult | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen || !result) return null;

  const handlePrint = () => {
    window.print();
  };

  const isCritical = result.riskLevel === 'CRITICAL';
  const isHigh = result.riskLevel === 'HIGH';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-xs">
      <div className="flex h-[620px] w-full max-w-2xl flex-col rounded-lg border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
        {/* Header - Not printed */}
        <div className="no-print flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-neutral-500" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
              Risk Audit Report Preview
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close report"
              className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-8 text-neutral-900 dark:text-neutral-100 space-y-6">
          {/* Document Header */}
          <div className="flex items-start justify-between border-b border-neutral-300 pb-4 dark:border-neutral-800">
            <div>
              <div className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
                <Shield className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />
                <span>VIGILEN RISK AUDIT DOSSIER</span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-500">
                Financial Risk Intelligence · Multimodal Threat & Linguistic Assessment
              </p>
            </div>
            <div className="text-right text-xs font-mono text-neutral-500">
              <p>Ref: {result.id}</p>
              <p>{result.timestamp}</p>
            </div>
          </div>

          {/* Risk Level & Score Badge */}
          <div className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                Risk Classification
              </span>
              <p className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                {result.classification}
              </p>
              <p className="text-xs text-neutral-500 font-mono">
                Model Confidence: {Math.round(result.confidence * 100)}%
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                Risk Score
              </span>
              <p
                className={`font-mono-numbers text-3xl font-extrabold ${
                  isCritical
                    ? 'text-rose-700'
                    : isHigh
                    ? 'text-red-700'
                    : 'text-emerald-700'
                }`}
              >
                {result.riskScore} <span className="text-xs text-neutral-400 font-normal">/ 100</span>
              </p>
              <span className="text-xs font-bold uppercase">{result.riskLevel} RISK</span>
            </div>
          </div>

          {/* Evaluated Content Snapshot */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Evaluated Communication Excerpt
            </h3>
            <div className="mt-1.5 rounded border border-neutral-200 bg-neutral-50/70 p-3 font-mono text-xs leading-relaxed text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
              "{result.inputText}"
            </div>
          </div>

          {/* Detected Indicators */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Detected Risk Indicators ({result.indicators.length})
            </h3>
            <div className="mt-2 divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
              {result.indicators.map((ind) => (
                <div key={ind.id} className="py-2 text-xs flex justify-between">
                  <div>
                    <span className="font-semibold">{ind.label}:</span>{' '}
                    <span className="text-neutral-600 dark:text-neutral-400">{ind.description}</span>
                  </div>
                  <span className="font-mono text-neutral-500 shrink-0 ml-3">
                    Severity: {ind.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Verification Steps */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Recommended Verification Protocols
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
              {result.recommendedActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Scientific Disclaimer */}
          <div className="border-t border-neutral-300 pt-4 text-[10px] text-neutral-500 dark:border-neutral-800 leading-relaxed">
            <p className="font-semibold uppercase tracking-wider">
              Legal Status & Academic Disclaimer:
            </p>
            <p className="mt-1">
              {result.disclaimer} Generated by VIGILEN Financial Risk Intelligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
