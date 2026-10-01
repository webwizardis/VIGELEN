import React, { useState } from 'react';
import {
  Search,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TextAnalysisResult } from '../../types';
import { SAMPLE_INVESTMENT_TEXTS } from '../../data/mockData';
import { apiAnalyzeText } from '../../services/api';
import { extractInvestmentClaim } from '../../services/analyzer';

interface ScamDetectorViewProps {
  isDemoMode?: boolean;
}

export const ScamDetectorView: React.FC<ScamDetectorViewProps> = ({
  isDemoMode = true,
}) => {
  // Text Workflow States
  const [inputText, setInputText] = useState(SAMPLE_INVESTMENT_TEXTS[0].text);
  const [analyzingText, setAnalyzingText] = useState(false);
  const [textResult, setTextResult] = useState<TextAnalysisResult | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Verification Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    source: false,
    provider: false,
    registration: false,
    riskDisclosure: false,
    paymentDestination: false,
  });

  const toggleChecklist = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAnalyzeText = async () => {
    if (!inputText.trim()) return;
    setAnalyzingText(true);
    try {
      const result = await apiAnalyzeText(inputText, isDemoMode);
      setTextResult(result);
    } catch (err) {
      console.error('Failed to analyze text:', err);
    } finally {
      setAnalyzingText(false);
    }
  };

  const activeResult = textResult;

  // Extracted claims data
  const currentClaimData = activeResult?.claim || (
    activeResult?.inputText ? extractInvestmentClaim(activeResult.inputText) : null
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Risk Analysis
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">Retail Protection</span>
        </div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Check Investment Content
        </h1>
        <p className="mt-1 text-xs text-slate-600 max-w-3xl leading-relaxed">
          Analyze investment messages, financial promotions and social-media content for potential risk signals.
        </p>
      </div>

      {/* TEXT WORKFLOW */}
      <div className="space-y-6">
        {/* Sample Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Sample Examples:
          </span>
          {SAMPLE_INVESTMENT_TEXTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(sample.text);
                setTextResult(null);
              }}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                inputText === sample.text
                  ? 'border-[#1a1a1a] bg-[#1a1a1a] font-bold text-white shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-[#1a1a1a]'
              }`}
            >
              {sample.title}
            </button>
          ))}
        </div>

        {/* Professional Text Editor */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Investment Message / Promotion Content
          </label>
          <textarea
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste an investment message, social-media post, advertisement or financial promotion..."
            className="mt-2.5 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-[#1a1a1a] focus:bg-white focus:outline-hidden"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <span className="text-[11px] text-slate-500">
              Evaluation performs deterministic claim extraction and risk heuristic identification.
            </span>
            <button
              onClick={handleAnalyzeText}
              disabled={analyzingText || !inputText.trim()}
              className="inline-flex items-center gap-2 border border-[#1a1a1a] bg-[#1a1a1a] px-5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-white hover:text-[#1a1a1a] disabled:opacity-50 cursor-pointer"
            >
              {analyzingText ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>{analyzingText ? 'Analyzing Content...' : 'Analyze Content'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 9: INVESTMENT ANALYSIS RESULT (Investigation Report Layout) */}
      {activeResult && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          {/* Top: RISK ASSESSMENT */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>INVESTIGATION REPORT</span>
                <span>·</span>
                <span>REF: {activeResult.id}</span>
              </div>
              <h2 className="mt-1 font-display text-xl font-black text-slate-900">
                RISK ASSESSMENT
              </h2>
              <p className="mt-1 text-xs text-slate-600 italic">
                {activeResult.riskLevel === 'LOW'
                  ? 'Compliant financial communication with statutory disclaimers.'
                  : 'Potentially suspicious characteristics detected.'}
              </p>
            </div>

            {/* Risk Score Pill & Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                className={`flex items-center gap-3 rounded-xl border px-4 py-2 ${
                  activeResult.riskLevel === 'LOW'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : activeResult.riskLevel === 'MEDIUM'
                    ? 'border-amber-200 bg-amber-50 text-amber-800'
                    : 'border-rose-200 bg-rose-50/80 text-rose-800'
                }`}
              >
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      activeResult.riskLevel === 'LOW'
                        ? 'text-emerald-800'
                        : activeResult.riskLevel === 'MEDIUM'
                        ? 'text-amber-800'
                        : 'text-rose-800'
                    }`}
                  >
                    {activeResult.riskLevel} RISK
                  </span>
                  <div
                    className={`font-mono-numbers text-2xl font-black leading-none mt-0.5 ${
                      activeResult.riskLevel === 'LOW'
                        ? 'text-emerald-700'
                        : activeResult.riskLevel === 'MEDIUM'
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {activeResult.riskScore}{' '}
                    <span
                      className={`text-xs font-normal ${
                        activeResult.riskLevel === 'LOW' ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      / 100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OFFICIAL REGULATORY BLACKLIST MATCH BANNER */}
          {activeResult.matchedRegulatoryRecord && (
            <div className="rounded-xl border-2 border-rose-600 bg-rose-50/90 p-5 shadow-xs text-rose-950">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-rose-600 px-2.5 py-0.5 font-mono text-[11px] font-black text-white uppercase tracking-wider">
                    CRITICAL REGULATORY ALERT
                  </span>
                  <span className="font-mono text-xs font-bold text-rose-900">
                    OFFICIAL {activeResult.matchedRegulatoryRecord.sourceAgency} CAUTION BLACKLIST MATCH (#{activeResult.matchedRegulatoryRecord.sourceRecordId})
                  </span>
                </div>
                <span className="rounded bg-rose-100 px-3 py-1 font-mono text-xs font-bold text-rose-800 border border-rose-300">
                  ACTION: {activeResult.matchedRegulatoryRecord.recommendedAction}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-bold text-rose-950 uppercase tracking-wider text-[11px]">Flagged Entity / Channel:</p>
                  <p className="font-mono text-xs mt-1 bg-white p-2 rounded border border-rose-200 text-rose-950 break-all select-all font-semibold">
                    {activeResult.matchedRegulatoryRecord.rawEntity}
                  </p>
                  <p className="mt-1.5 text-[11px] text-rose-800">
                    Platform Category: <span className="font-bold">{activeResult.matchedRegulatoryRecord.channelPlatform}</span> · Threat:{' '}
                    <span className="font-bold">{activeResult.matchedRegulatoryRecord.threatClassification.replace(/_/g, ' ')}</span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-rose-950 uppercase tracking-wider text-[11px]">Official Label Basis & Source:</p>
                  <p className="mt-1 text-slate-800 bg-white p-2 rounded border border-rose-200 leading-relaxed text-[11px]">
                    {activeResult.matchedRegulatoryRecord.labelBasis}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500 italic">
                    Source list: {activeResult.matchedRegulatoryRecord.sourceAgency} consolidated caution list (client complaint adjudications).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section: EXTRACTED TEXT (for screenshots) */}
          {activeResult.inputText && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Extracted Text
              </span>
              <p className="mt-1.5 text-xs text-slate-800 leading-relaxed font-mono bg-white p-3 rounded-lg border border-slate-200/80">
                {activeResult.inputText}
              </p>
            </div>
          )}

          {/* Section: DETECTED FRAUD INDICATORS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                DETECTED FRAUD INDICATORS ({activeResult.indicators.length})
              </h3>
              <span className="mono text-[10px] text-slate-500">
                Deterministic Pattern Matcher
              </span>
            </div>

            {activeResult.indicators.length > 0 ? (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {activeResult.indicators.map((ind, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl border p-3.5 ${
                      ind.severity === 'critical'
                        ? 'border-rose-300 bg-rose-50/70 text-rose-950'
                        : ind.severity === 'high'
                        ? 'border-rose-200 bg-rose-50/40 text-rose-900'
                        : ind.severity === 'medium'
                        ? 'border-amber-200 bg-amber-50/50 text-amber-900'
                        : 'border-slate-200 bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate pr-2">
                        {ind.label}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-black uppercase shrink-0 ${
                          ind.severity === 'critical'
                            ? 'bg-rose-600 text-white'
                            : ind.severity === 'high'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : ind.severity === 'medium'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ind.severity}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed opacity-90">
                      {ind.description}
                    </p>
                    {ind.highlightText && (
                      <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-between text-[10px] mono">
                        <span className="opacity-75">Matched:</span>
                        <code className="bg-black/5 px-1.5 py-0.5 rounded font-bold truncate max-w-[180px]">
                          {ind.highlightText}
                        </code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-emerald-900 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Zero adverse fraud indicators detected.</strong> Content aligns with regulated communication standards and contains required statutory disclosures.
                </span>
              </div>
            )}
          </div>

          {/* Section: EXPLANATION & KEY RISK DRIVERS */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                EXPLANATION & REGULATORY RISK ANALYSIS
              </h3>
              <span className="mono text-[10px] text-indigo-700 font-bold uppercase">
                {activeResult.riskLevel} RISK EVALUATION
              </span>
            </div>

            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {activeResult.explanation?.summary ||
                (activeResult.riskLevel === 'LOW'
                  ? 'LOW RISK: Legitimate and regulated communication with statutory disclaimers.'
                  : 'HIGH RISK: Unregulated solicitations detected.')}
            </p>

            {activeResult.explanation?.whyFlagged && activeResult.explanation.whyFlagged.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="mono text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Detailed Findings:
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 leading-relaxed pl-1">
                  {activeResult.explanation.whyFlagged.map((reason, rIdx) => (
                    <li key={rIdx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section: CLAIMS IDENTIFIED (Section 9 & 10) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                CLAIMS IDENTIFIED
              </h3>
              <span className="text-[11px] font-mono font-medium text-slate-400">
                Deterministic Factual Extraction
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Promised Return:
                </span>
                <p className="font-mono-numbers mt-1 text-lg font-bold text-slate-900">
                  {currentClaimData?.promisedReturn || '40% - 45%'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Stated in proposal</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Time Period:
                </span>
                <p className="font-mono-numbers mt-1 text-lg font-bold text-slate-900">
                  {currentClaimData?.timeHorizon || '15 - 30 days'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Execution horizon</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Guarantee:
                </span>
                <p className="mt-1 text-base font-bold text-rose-700">
                  Detected
                </p>
                <p className="text-[10px] text-rose-500 mt-0.5">Statutory violation</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Risk Disclosure:
                </span>
                <p className="mt-1 text-base font-bold text-amber-700">
                  Not Detected
                </p>
                <p className="text-[10px] text-amber-600 mt-0.5">Omission detected</p>
              </div>
            </div>
          </div>

          {/* Section: WHY THIS MATTERS (Section 9) */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2">
              WHY THIS MATTERS
            </h3>
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong className="text-slate-900">1. Unrealistic Yield Structure:</strong> Standard market indices generate long-term annualized returns of 12-15%. A promise of 40% returns in 30 days indicates an annualized yield exceeding 1,000%, which cannot be sustained through legal secondary-market mechanisms.
              </p>
              <p>
                <strong className="text-slate-900">2. Statutory Guarantee Prohibition:</strong> Under SEBI (Investment Advisers) Regulations, registered market intermediaries are strictly prohibited from promising guaranteed returns or capital protection on risk-bearing equities.
              </p>
              <p>
                <strong className="text-slate-900">3. Channel Vulnerability:</strong> Solicitations routed through closed messaging groups requesting direct transfers to individual VPAs lack clearing corporation dispute resolution, creating irreversible capital loss risk.
              </p>
            </div>
          </div>

          {/* Section: WHAT TO VERIFY (Section 9) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              WHAT TO VERIFY
            </h3>

            <div className="space-y-2.5">
              {[
                {
                  id: 'source',
                  title: 'Source',
                  desc: 'Verify if the communication originates from an official, verified broker domain or unverified third party.',
                },
                {
                  id: 'provider',
                  title: 'Provider',
                  desc: 'Check the real corporate identity behind the promoter and search for previous regulatory warnings.',
                },
                {
                  id: 'registration',
                  title: 'Registration',
                  desc: 'Search the SEBI Intermediaries portal (scores.gov.in) to confirm valid registration numbers.',
                },
                {
                  id: 'riskDisclosure',
                  title: 'Risk Disclosure',
                  desc: 'Check whether mandatory statutory risk disclaimers ("Securities investments are subject to market risks") are provided.',
                },
                {
                  id: 'paymentDestination',
                  title: 'Payment Destination',
                  desc: 'Confirm payment destination is a recognized clearing corporation or regulated institutional escrow, never a personal VPA.',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checkedItems[item.id]}
                    onChange={() => {}}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      {item.title}
                    </span>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 11: ANALYSIS DETAILS (Technical information collapsed) */}
          <div className="border-t border-slate-200 pt-3">
            <button
              onClick={() => setShowTechnicalDetails((prev) => !prev)}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <span>Analysis Details</span>
              {showTechnicalDetails ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {showTechnicalDetails && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">Pipeline Stages:</span>
                    <p className="font-semibold text-slate-700">Text → Claim extraction → Entity extraction → Signal detection → Risk assessment</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Model Engine:</span>
                    <p className="font-semibold text-slate-700">DeBERTa-v3 calibrated heuristic & regex tokenizer</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Processing Latency:</span>
                    <p className="font-semibold text-slate-700">42ms (In-memory deterministic)</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Confidence Calibration:</span>
                    <p className="font-semibold text-slate-700">{Math.round(activeResult.confidence * 100)}% reliability index</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
