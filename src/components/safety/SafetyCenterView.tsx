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
} from 'lucide-react';

interface VerificationResult {
  sourceProvided: string;
  sourceType: 'Website' | 'Investment platform' | 'Promoter' | 'Social account';
  verificationStatus: 'Unverified' | 'Suspicious' | 'Caution' | 'Under Investigation';
  evidenceAvailable: string[];
  warnings: string[];
  checklist: { label: string; verified: boolean; note: string }[];
}

export const SafetyCenterView: React.FC = () => {
  // Section 19: VERIFY SOURCE
  const [sourceType, setSourceType] = useState<
    'Website' | 'Investment platform' | 'Promoter' | 'Social account'
  >('Promoter');
  const [sourceInput, setSourceInput] = useState('Dr. Sharma VIP Wealth Desk');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const samplePresets = [
    {
      type: 'Promoter' as const,
      input: 'Dr. Sharma VIP Wealth Desk (Telegram)',
    },
    {
      type: 'Investment platform' as const,
      input: 'QuantumYield Arbitrage Bot Cloud',
    },
    {
      type: 'Website' as const,
      input: 'unlistedretail-allot.com',
    },
    {
      type: 'Social account' as const,
      input: '@crorepatitraders_daily (Instagram)',
    },
  ];

  const handleVerify = () => {
    if (!sourceInput.trim()) return;
    setVerifying(true);

    setTimeout(() => {
      setVerifying(false);
      setResult({
        sourceProvided: sourceInput,
        sourceType,
        verificationStatus: 'Suspicious',
        evidenceAvailable: [
          'Negative match on official SEBI Intermediaries Registry (scores.gov.in)',
          'No valid Corporate Identification Number (CIN) or physical office address',
          'Associated with 3 consumer complaints regarding non-refunded advisory fees',
        ],
        warnings: [
          'Unregistered Investment Adviser: Offering customized stock calls without statutory registration.',
          'Solicits direct UPI transfers to an unverified private beneficiary account.',
          'Claims guaranteed 45% return, which is explicitly prohibited under securities regulations.',
        ],
        checklist: [
          {
            label: 'SEBI Registration Status',
            verified: false,
            note: 'Zero matching license found in official regulatory directory.',
          },
          {
            label: 'Physical Corporate Identity',
            verified: false,
            note: 'No registered office address or corporate filings verified.',
          },
          {
            label: 'Institutional Payment Escrow',
            verified: false,
            note: 'Requests payments to personal savings accounts / VPAs.',
          },
          {
            label: 'Statutory Risk Disclosures',
            verified: false,
            note: 'Fails to disclose mandatory market risk disclaimers.',
          },
        ],
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Protect
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">Retail Defense</span>
        </div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Safety Center & Source Verification
        </h1>
        <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
          Verify investment platforms, promoters, websites, and social accounts against registered public records and caution lists.
        </p>
      </div>

      {/* SECTION 19: VERIFY SOURCE WORKSPACE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            VERIFY SOURCE
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Check the credentials and risk profile of any entity or channel offering financial schemes.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700">
              Source Category:
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                ['Promoter', 'Investment platform', 'Website', 'Social account'] as const
              ).map((type) => (
                <button
                  key={type}
                  onClick={() => setSourceType(type)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    sourceType === type
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">
              Enter {sourceType} Name, URL, or Handle:
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                value={sourceInput}
                onChange={(e) => setSourceInput(e.target.value)}
                placeholder="e.g. Platform name, Telegram channel, website URL, or promoter name..."
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-hidden"
              />
              <button
                onClick={handleVerify}
                disabled={verifying || !sourceInput.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                <span>{verifying ? 'Checking Records...' : 'Verify Source'}</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-400">
              Quick Test:
            </span>
            {samplePresets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSourceType(p.type);
                  setSourceInput(p.input);
                  setResult(null);
                }}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-white hover:text-indigo-600"
              >
                {p.input}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Result (Section 19) */}
        {result && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-6 space-y-6">
            {/* Top Status */}
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Source Provided
                </span>
                <h3 className="font-display text-base font-bold text-slate-900 mt-0.5">
                  {result.sourceProvided}
                </h3>
                <span className="text-xs text-slate-500">
                  Category: {result.sourceType}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-rose-100 px-3 py-1 font-mono text-xs font-black text-rose-800 border border-rose-200">
                  {result.verificationStatus.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Evidence Available */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Evidence Available
              </h4>
              <div className="space-y-1.5">
                {result.evidenceAvailable.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Warnings
              </h4>
              <div className="space-y-1.5">
                {result.warnings.map((warn, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200"
                  >
                    <XCircle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{warn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Checklist (Section 19) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Verification Checklist
              </h4>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {result.checklist.map((chk, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-200 bg-white p-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{chk.label}</span>
                      <span
                        className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                          chk.verified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {chk.verified ? 'Verified' : 'Unconfirmed'}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">{chk.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Standard Notice (Section 19) */}
            <div className="rounded-lg bg-amber-50 p-3.5 border border-amber-200 text-xs text-amber-900">
              <strong className="font-bold">IMPORTANT VERIFICATION STANDARD:</strong>
              <p className="mt-1 text-[11px] text-amber-800 leading-relaxed">
                Do not claim that a source is legitimate unless reliable evidence is actually available. The absence of negative news does not constitute verification of regulatory authorization.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* General Investor Protection Principles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <ShieldAlert className="h-5 w-5 text-indigo-600 mb-2" />
          <h3 className="text-xs font-bold text-slate-900">1. Inspect Official Licenses</h3>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            All legitimate Indian investment advisers and research analysts must hold a verifiable SEBI registration number (e.g. INH... or INA...).
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <AlertOctagon className="h-5 w-5 text-rose-600 mb-2" />
          <h3 className="text-xs font-bold text-slate-900">2. Avoid Guaranteed Yields</h3>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            No regulated market entity can legally guarantee capital or promised returns on securities or derivatives.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <Lock className="h-5 w-5 text-emerald-600 mb-2" />
          <h3 className="text-xs font-bold text-slate-900">3. Regulated Bank Accounts</h3>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            Transactions must always be settled through accredited clearing corporations or SEBI-registered broker accounts, never private VPAs.
          </p>
        </div>
      </div>
    </div>
  );
};
