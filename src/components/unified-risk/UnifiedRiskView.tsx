import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { UnifiedRiskWeights, UnifiedRiskResult } from '../../types';
import { calculateUnifiedRisk } from '../../services/analyzer';

interface UnifiedRiskViewProps {
  initialContentRisk?: number;
  initialTransactionRisk?: number;
  initialBehavioralRisk?: number;
  initialInvestorRisk?: number;
  onNavigateToRiskProfile?: () => void;
}

export const UnifiedRiskView: React.FC<UnifiedRiskViewProps> = ({
  initialContentRisk = 87,
  initialTransactionRisk = 82,
  initialBehavioralRisk = 78,
  initialInvestorRisk = 70,
  onNavigateToRiskProfile,
}) => {
  // Inputs (Section 14): Content Risk, Transaction Risk, Behavioral Risk, Investor Risk
  const [contentRisk, setContentRisk] = useState(initialContentRisk);
  const [transactionRisk, setTransactionRisk] = useState(initialTransactionRisk);
  const [behavioralRisk, setBehavioralRisk] = useState(initialBehavioralRisk);
  const [investorRisk, setInvestorRisk] = useState(initialInvestorRisk);

  React.useEffect(() => {
    setInvestorRisk(initialInvestorRisk);
  }, [initialInvestorRisk]);

  // Configurable Weights
  const [weights, setWeights] = useState<UnifiedRiskWeights>({
    contentWeight: 0.30,
    transactionWeight: 0.35,
    behaviorWeight: 0.20,
    investorWeight: 0.15,
  });

  // Calculate Unified Result dynamically
  const unifiedResult: UnifiedRiskResult = calculateUnifiedRisk(
    contentRisk,
    transactionRisk,
    behavioralRisk,
    investorRisk,
    weights
  );

  const isCritical = unifiedResult.combinedRiskScore >= 80;
  const isHigh = unifiedResult.combinedRiskScore >= 60;
  const isMedium = unifiedResult.combinedRiskScore >= 35;

  const handleResetWeights = () => {
    setWeights({
      contentWeight: 0.30,
      transactionWeight: 0.35,
      behaviorWeight: 0.20,
      investorWeight: 0.15,
    });
  };

  const handleLoadScenario = (c: number, t: number, b: number, i: number) => {
    setContentRisk(c);
    setTransactionRisk(t);
    setBehavioralRisk(b);
    setInvestorRisk(i);
  };

  return (
    <div className="space-y-6">
      {/* Page Header (Section 14) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Insights
              </span>
              <span className="text-slate-300">·</span>
              <span className="rounded bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-800">
                Prototype Risk Model
              </span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Risk Intelligence
            </h1>
            <p className="mt-1 text-xs text-slate-600 max-w-3xl leading-relaxed">
              Combine multiple signals into one transparent prototype risk assessment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 italic max-w-xs text-right hidden sm:block">
              Not presented as a regulatory standard. Intended for transparent prototyping.
            </span>
          </div>
        </div>

        {/* Preset Scenarios */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <span className="text-xs font-semibold text-slate-500">
            Prototype Scenarios:
          </span>
          <button
            onClick={() => handleLoadScenario(87, 82, 78, 70)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            VIP Telegram Stock Syndicate (Score: ~81)
          </button>
          <button
            onClick={() => handleLoadScenario(70, 85, 80, 50)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            Pre-IPO Phishing Escrow (Score: ~74)
          </button>
          <button
            onClick={() => handleLoadScenario(20, 15, 10, 25)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            Verified Broker Transaction (Score: ~17)
          </button>
        </div>
      </div>

      {/* Main Grid: Output Score & 4 Inputs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Output: VIGILEN RISK SCORE (Section 14) (5 cols) */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                PROTOTYPE RISK SCORE
              </span>
              <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-700 border border-indigo-200">
                Multi-Signal Composite
              </span>
            </div>

            <div className="mt-6 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                VIGILEN RISK SCORE
              </span>
              <div className="mt-2 flex items-baseline justify-center gap-2">
                <span
                  className={`font-mono-numbers text-5xl font-black ${
                    isCritical
                      ? 'text-rose-600'
                      : isHigh
                      ? 'text-orange-600'
                      : isMedium
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {unifiedResult.combinedRiskScore}
                </span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
              <p
                className={`mt-1 text-xs font-bold uppercase tracking-wider ${
                  isCritical
                    ? 'text-rose-700'
                    : isHigh
                    ? 'text-orange-700'
                    : isMedium
                    ? 'text-amber-800'
                    : 'text-emerald-800'
                }`}
              >
                {unifiedResult.riskLevel} RISK LEVEL
              </p>
            </div>

            {/* Gauge Bar */}
            <div className="mt-6">
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  style={{ width: `${unifiedResult.combinedRiskScore}%` }}
                  className={`h-full transition-all duration-300 ${
                    isCritical
                      ? 'bg-rose-500'
                      : isHigh
                      ? 'bg-orange-500'
                      : isMedium
                      ? 'bg-amber-400'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-mono text-slate-400">
                <span>0 (Compliant)</span>
                <span>50 (Moderate)</span>
                <span>100 (Critical)</span>
              </div>
            </div>

            {/* Calculation Formula string (Section 14) */}
            <div className="mt-6 rounded-lg bg-slate-50 p-3.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Calculation
              </span>
              <p className="font-mono mt-1 text-xs text-slate-800 font-semibold break-words">
                {unifiedResult.formulaString}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Linear weighted sum of normalized heuristic scores.
              </p>
            </div>
          </div>

          {/* Confidence and Limitations Notice (Section 14) */}
          <div className="rounded-lg bg-amber-50/70 p-3.5 border border-amber-200/80 text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="h-4 w-4 text-amber-700 shrink-0" />
              <span>Confidence & Model Limitations:</span>
            </div>
            <p className="mt-1 text-[11px] text-amber-800 leading-relaxed">
              This score represents a prototype weighted index combining text claims, transaction volume, behavioral deviations, and investor susceptibility. It is not an official regulatory determination.
            </p>
          </div>
        </div>

        {/* Inputs & Weights Configuration (7 cols) */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Score Components & Configurable Weights
              </h2>
              <p className="text-xs text-slate-500">
                Adjust input scores and model weighting to inspect risk impact
              </p>
            </div>
            <button
              onClick={handleResetWeights}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Weights</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Input 1: Content Risk */}
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">1. Content Risk</span>
                  <p className="text-[11px] text-slate-500">Promised returns, urgency, guarantee claims</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-black text-slate-900">{contentRisk}</span>
                  <span className="text-xs text-slate-400"> / 100</span>
                  <span className="ml-2 font-mono text-[11px] text-indigo-600 font-bold">
                    (Weight: {Math.round(weights.contentWeight * 100)}%)
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={contentRisk}
                onChange={(e) => setContentRisk(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Input 2: Transaction Risk */}
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">2. Transaction Risk</span>
                  <p className="text-[11px] text-slate-500">Outflow magnitude, unverified merchant VPA</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-black text-slate-900">{transactionRisk}</span>
                  <span className="text-xs text-slate-400"> / 100</span>
                  <span className="ml-2 font-mono text-[11px] text-indigo-600 font-bold">
                    (Weight: {Math.round(weights.transactionWeight * 100)}%)
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={transactionRisk}
                onChange={(e) => setTransactionRisk(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Input 3: Behavioral Risk */}
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">3. Behavioral Risk</span>
                  <p className="text-[11px] text-slate-500">Timing outlier, new device fingerprint</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-black text-slate-900">{behavioralRisk}</span>
                  <span className="text-xs text-slate-400"> / 100</span>
                  <span className="ml-2 font-mono text-[11px] text-indigo-600 font-bold">
                    (Weight: {Math.round(weights.behaviorWeight * 100)}%)
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={behavioralRisk}
                onChange={(e) => setBehavioralRisk(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Input 4: Investor Risk */}
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">4. Investor Risk Profile</span>
                    {onNavigateToRiskProfile && (
                      <button
                        type="button"
                        onClick={onNavigateToRiskProfile}
                        className="mono text-[10px] text-indigo-700 underline font-bold cursor-pointer hover:text-indigo-900"
                      >
                        [Open Risk Profile Tab →]
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">Retail experience level and verification habits</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-black text-slate-900">{investorRisk}</span>
                  <span className="text-xs text-slate-400"> / 100</span>
                  <span className="ml-2 font-mono text-[11px] text-indigo-600 font-bold">
                    (Weight: {Math.round(weights.investorWeight * 100)}%)
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={investorRisk}
                onChange={(e) => setInvestorRisk(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          {/* Breakdown Table (Section 14) */}
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              Score Component Breakdown
            </h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-mono text-[11px]">
                  <th className="py-1.5">Component</th>
                  <th className="py-1.5">Raw Score</th>
                  <th className="py-1.5">Weight</th>
                  <th className="py-1.5 text-right">Weighted Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {unifiedResult.breakdown.map((b) => (
                  <tr key={b.component}>
                    <td className="py-2 font-sans font-semibold text-slate-800">{b.component}</td>
                    <td className="py-2 text-slate-600">{b.rawScore}/100</td>
                    <td className="py-2 text-slate-600">{Math.round(b.weight * 100)}%</td>
                    <td className="py-2 text-right font-bold text-indigo-700">
                      +{b.weightedContribution.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
