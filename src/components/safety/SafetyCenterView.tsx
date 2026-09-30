import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  FileText,
  AlertOctagon,
  Lock,
  Globe,
  CornerDownLeft,
} from 'lucide-react';
import { apiVerifySource, VerificationSourceResult } from '../../services/api';

export const SafetyCenterView: React.FC = () => {
  // Section 19: VERIFY SOURCE WORKSPACE
  const [sourceType, setSourceType] = useState<
    'Website' | 'Investment platform' | 'Promoter' | 'Social account'
  >('Website');
  const [sourceInput, setSourceInput] = useState('mofslmaxs.com');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationSourceResult | null>(null);

  const samplePresets = [
    {
      type: 'Website' as const,
      input: 'mofslmaxs.com',
      label: 'mofslmaxs.com (Fake Clone)',
    },
    {
      type: 'Website' as const,
      input: 'https://www.motilaloswal.com',
      label: 'motilaloswal.com (Official Broker)',
    },
    {
      type: 'Website' as const,
      input: 'https://zerodha.com',
      label: 'zerodha.com (Official Broker)',
    },
    {
      type: 'Promoter' as const,
      input: 't.me/SmartTradeSoftware',
      label: 'SmartTrade (NSE Flagged #817)',
    },
    {
      type: 'Investment platform' as const,
      input: 'tradekaropay.com',
      label: 'tradekaropay (NSE Flagged #727)',
    },
  ];

  const handleVerify = async () => {
    const query = sourceInput.trim();
    if (!query || verifying) return;
    setVerifying(true);

    try {
      const res = await apiVerifySource(query, sourceType);
      setResult(res);
    } catch (err) {
      console.error('Source verification failed:', err);
    } finally {
      setVerifying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  return (
    <div className="space-y-12 max-w-5xl">
      {/* Editorial Header */}
      <div className="section-header">
        <div className="mono text-[#2563eb] mb-3">
          — Intermediary Defense & Google Search Grounding Engine
        </div>
        <h1 className="font-serif text-[2.8rem] sm:text-[3.6rem] font-semibold text-[#1a1a1a] leading-none tracking-tight mb-4">
          Safety Center & Website Verification
        </h1>
        <p className="text-sm sm:text-base text-[#71717a] leading-relaxed max-w-3xl">
          Identify genuine corporate domains, detect clone/phishing mimicry portals, and verify investment promoters directly against Google Search Grounding and official SEBI/NSE caution blacklists.
        </p>
      </div>

      {/* SECTION 19: VERIFY SOURCE WORKSPACE */}
      <div className="border border-[#1a1a1a] bg-white p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#e4e4e7] pb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="mono text-xs text-[#71717a] uppercase font-bold">Google Grounding & Regulatory Registry</span>
              <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] mt-0.5">
                Official Website & Entity Authenticator
              </h2>
            </div>
            <span className="mono text-[10px] border border-[#1a1a1a] px-2 py-0.5 bg-[#fdfdfc] text-[#1a1a1a] font-bold hidden sm:inline-block">
              Press Enter ↵ to Verify
            </span>
          </div>
          <p className="text-xs text-[#71717a] mt-1 leading-relaxed">
            Enter a website URL, domain name, or company to connect to Google&apos;s grounding engine and cross-reference with official broker registries.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="mono text-[11px] font-bold text-[#1a1a1a] uppercase block mb-2">
              Source Category:
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                ['Website', 'Investment platform', 'Promoter', 'Social account'] as const
              ).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSourceType(type)}
                  className={`border px-3.5 py-1.5 mono text-xs uppercase font-bold transition-all cursor-pointer ${
                    sourceType === type
                      ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white shadow-xs'
                      : 'border-[#e4e4e7] bg-white text-[#71717a] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mono text-[11px] font-bold text-[#1a1a1a] uppercase block mb-1.5">
              Enter {sourceType} URL, Domain Name, or Handle:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={sourceInput}
                  onChange={(e) => setSourceInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. mofslmaxs.com or https://www.motilaloswal.com (Press Enter)..."
                  className="w-full border border-[#1a1a1a] bg-[#fdfdfc] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:bg-white focus:outline-hidden font-mono"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 mono text-[10px] text-[#71717a] bg-white border border-[#e4e4e7] px-1.5 py-0.5 pointer-events-none">
                  <CornerDownLeft className="h-2.5 w-2.5" />
                  <span>Enter</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying || !sourceInput.trim()}
                className="btn btn-primary disabled:opacity-50 min-w-[140px]"
              >
                <Search className="h-3.5 w-3.5" />
                <span>{verifying ? 'Querying Google...' : 'Verify Source'}</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="mono text-[10px] text-[#71717a] uppercase font-bold">
              Test Presets:
            </span>
            {samplePresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSourceType(p.type);
                  setSourceInput(p.input);
                  setResult(null);
                }}
                className="border border-[#e4e4e7] bg-[#fdfdfc] px-2.5 py-1 mono text-[10px] text-[#71717a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Result Card Grounded in Google Engine */}
        {result && (
          <div className="border border-[#e4e4e7] bg-[#fdfdfc] p-6 sm:p-8 space-y-6">
            {/* Top Status Banner */}
            <div className="flex flex-col justify-between gap-3 border-b border-[#e4e4e7] pb-5 sm:flex-row sm:items-center">
              <div>
                <span className="mono text-[10px] text-[#71717a] uppercase font-bold">
                  Target Under Review
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#1a1a1a] mt-0.5 break-all">
                  {result.sourceProvided}
                </h3>
                <span className="mono text-xs text-[#71717a]">
                  Category: {result.sourceType} {result.officialEntityName ? `· Entity: ${result.officialEntityName}` : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`status-pill ${
                    result.verificationStatus === 'Verified'
                      ? 'text-[#10b981] border-[#10b981]'
                      : result.verificationStatus === 'Suspicious'
                      ? 'text-[#be123c] border-[#be123c]'
                      : 'text-[#ea580c] border-[#ea580c]'
                  }`}
                >
                  {result.verificationStatus.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Canonical Official Website Card (Primary Google Engine Output) */}
            {result.canonicalOfficialWebsite && (
              <div className={`border p-5 ${
                result.isOfficialWebsite
                  ? 'border-[#10b981] bg-emerald-50/40 text-[#065f46]'
                  : result.verificationStatus === 'Suspicious'
                  ? 'border-[#be123c] bg-rose-50/40 text-[#9f1239]'
                  : 'border-[#1a1a1a] bg-white text-[#1a1a1a]'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-current/20 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 shrink-0" />
                    <span className="mono text-xs font-bold uppercase tracking-wider">
                      Google Engine Canonical Website Identification
                    </span>
                  </div>
                  <span className="mono text-[10px] font-bold uppercase border border-current px-2 py-0.5">
                    {result.isOfficialWebsite ? 'Authentic Official Domain' : 'Clone / Mimicry / Unofficial'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold">Authentic Official Website:</span>
                    <a
                      href={result.canonicalOfficialWebsite.startsWith('http') ? result.canonicalOfficialWebsite : `https://${result.canonicalOfficialWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono font-bold text-sm underline hover:opacity-80 inline-flex items-center gap-1"
                    >
                      <span>{result.canonicalOfficialWebsite}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {result.summary && (
                    <p className="text-xs leading-relaxed opacity-90 pt-1 font-sans">
                      {result.summary}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Evidence Available */}
            <div>
              <h4 className="mono text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">
                Ground-Truth Evidence & Search Findings
              </h4>
              <div className="space-y-2">
                {result.evidenceAvailable.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-[#1a1a1a] bg-white p-3 border border-[#e4e4e7]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#10b981] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{ev}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <div>
                <h4 className="mono text-xs font-bold text-[#be123c] uppercase tracking-wider mb-2">
                  Identified Fraud & Regulatory Red Flags
                </h4>
                <div className="space-y-2">
                  {result.warnings.map((warn, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-[#be123c] bg-white p-3 border border-[#be123c]"
                    >
                      <XCircle className="h-4 w-4 text-[#be123c] shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{warn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Checklist */}
            <div>
              <h4 className="mono text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">
                Four-Pillar Regulatory Checklist
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {result.checklist.map((chk, i) => (
                  <div
                    key={i}
                    className="border border-[#e4e4e7] bg-white p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1a1a1a]">{chk.label}</span>
                      <span
                        className={`status-pill py-0.2 text-[9px] ${
                          chk.verified
                            ? 'text-[#10b981] border-[#10b981]'
                            : 'text-[#be123c] border-[#be123c]'
                        }`}
                      >
                        {chk.verified ? 'Verified' : 'Unconfirmed'}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-[#71717a] leading-normal">{chk.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grounding Sources from Google Search Engine */}
            {result.groundingSources && result.groundingSources.length > 0 && (
              <div>
                <h4 className="mono text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">
                  Google Search Grounding Citations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.groundingSources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-[#e4e4e7] bg-white px-3 py-1.5 mono text-[10px] text-[#1a1a1a] hover:border-[#1a1a1a] hover:underline"
                    >
                      <Globe className="h-3 w-3 text-[#2563eb]" />
                      <span className="truncate max-w-[200px]">{source.title || source.url}</span>
                      <ExternalLink className="h-2.5 w-2.5 text-[#71717a]" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Critical Standard Notice */}
            <div className="border border-[#1a1a1a] p-4 bg-white text-xs leading-relaxed text-[#1a1a1a]">
              <strong className="mono uppercase block mb-1">REGULATORY VERIFICATION STANDARD:</strong>
              Official broker domains in India always match registered corporate names approved by SEBI, BSE, and NSE. Always verify that bank accounts for investment settlement carry registered corporate broker names, never private individuals.
            </div>
          </div>
        )}
      </div>

      {/* General Investor Protection Principles */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="border border-[#e4e4e7] bg-white p-6">
          <ShieldAlert className="h-5 w-5 text-[#1a1a1a] mb-3" />
          <h3 className="mono text-xs font-bold text-[#1a1a1a] uppercase">1. Inspect Official Licenses</h3>
          <p className="mt-2 text-xs text-[#71717a] leading-relaxed">
            All legitimate Indian investment advisers and research analysts must hold a verifiable SEBI registration number (e.g. INH... or INA...).
          </p>
        </div>

        <div className="border border-[#e4e4e7] bg-white p-6">
          <AlertOctagon className="h-5 w-5 text-[#be123c] mb-3" />
          <h3 className="mono text-xs font-bold text-[#1a1a1a] uppercase">2. Avoid Guaranteed Yields</h3>
          <p className="mt-2 text-xs text-[#71717a] leading-relaxed">
            No regulated market entity can legally guarantee capital or promised returns on securities or derivatives.
          </p>
        </div>

        <div className="border border-[#e4e4e7] bg-white p-6">
          <Lock className="h-5 w-5 text-[#10b981] mb-3" />
          <h3 className="mono text-xs font-bold text-[#1a1a1a] uppercase">3. Regulated Bank Accounts</h3>
          <p className="mt-2 text-xs text-[#71717a] leading-relaxed">
            Transactions must always be settled through accredited clearing corporations or SEBI-registered broker accounts, never private VPAs.
          </p>
        </div>
      </div>
    </div>
  );
};
