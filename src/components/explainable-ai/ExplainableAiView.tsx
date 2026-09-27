import React, { useState } from 'react';
import {
  Cpu,
  BarChart,
  Sliders,
  CheckCircle2,
  Info,
  HelpCircle,
  TrendingUp,
  Sparkles,
  Layers,
} from 'lucide-react';

export const ExplainableAiView: React.FC = () => {
  const [modelType, setModelType] = useState<'text' | 'transaction'>('transaction');

  // Text Model SHAP Signals
  const textSignals = [
    { feature: 'Explicit Guaranteed Return Assertion ("45% in 15 days")', shapValue: 0.34, direction: 'positive', category: 'Linguistic Anchor' },
    { feature: 'Demand for Upfront Personal UPI Transfer (@oksbi)', shapValue: 0.28, direction: 'positive', category: 'Payment Rail' },
    { feature: 'High-Pressure Urgency ("Only 5 slots before market")', shapValue: 0.16, direction: 'positive', category: 'Psychological FOMO' },
    { feature: 'Private Telegram/WhatsApp Channel Lure', shapValue: 0.12, direction: 'positive', category: 'Distribution Channel' },
    { feature: 'Unverified Authority Assertion ("Master Analyst")', shapValue: 0.08, direction: 'positive', category: 'Credential Signal' },
    { feature: 'Absence of Statutory Market Risk Disclosure', shapValue: 0.07, direction: 'positive', category: 'Compliance' },
    { feature: 'Formal Prospectus or Registration Hyperlink', shapValue: -0.22, direction: 'negative', category: 'Safety Signal' },
  ];

  // Transaction Model SHAP Signals
  const transactionSignals = [
    { feature: 'Amount Deviation vs Historical Baseline (+2,556%)', shapValue: 0.38, direction: 'positive', category: 'Volume Deviation' },
    { feature: 'Unfamiliar Device Fingerprint (iPhone 15 Pro, New Hardware ID)', shapValue: 0.24, direction: 'positive', category: 'Hardware Identity' },
    { feature: 'Nocturnal Activity Window (02:45 AM IST)', shapValue: 0.18, direction: 'positive', category: 'Temporal Anomaly' },
    { feature: 'Peer-to-Peer Unregistered Beneficiary Handle', shapValue: 0.15, direction: 'positive', category: 'Beneficiary Entity' },
    { feature: 'Daily Outflow Velocity (7 txns vs 3.2 baseline)', shapValue: 0.11, direction: 'positive', category: 'Velocity' },
    { feature: 'Divergent IP Geolocation Cluster (Kolkata vs Mumbai)', shapValue: 0.09, direction: 'positive', category: 'Geographic Outlier' },
    { feature: 'Account Age Longevity (> 24 Months)', shapValue: -0.14, direction: 'negative', category: 'Account Trust' },
  ];

  const activeSignals = modelType === 'text' ? textSignals : transactionSignals;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">
          Explainable AI (XAI) & Attribution
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Transparent model interpretability via SHAP (SHapley Additive exPlanations) feature attribution.
        </p>
      </div>

      {/* Model Selection Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg dark:bg-neutral-900">
          <button
            onClick={() => setModelType('transaction')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
              modelType === 'transaction'
                ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <span>Transaction Fraud Model (Tree SHAP)</span>
          </button>
          <button
            onClick={() => setModelType('text')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
              modelType === 'text'
                ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <span>Text Scam Model (Attention & Signal SHAP)</span>
          </button>
        </div>
      </div>

      {/* Triad Distinction Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            1. Model Prediction
          </span>
          <p className="font-mono-numbers mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {modelType === 'transaction' ? '84 / 100' : '91 / 100'}
          </p>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            {modelType === 'transaction'
              ? 'High Outflow Anomaly (Requires Step-Up Friction)'
              : 'Potential Investment Scam Pattern'}
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            2. Model Confidence
          </span>
          <p className="font-mono-numbers mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            91.4%
          </p>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            Posterior probability based on cross-validated ensemble weights
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            3. Feature Contribution
          </span>
          <p className="font-mono-numbers mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Σ(φᵢ) = +0.81
          </p>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            Net additive push relative to base expectation E[f(x)] = 0.05
          </p>
        </div>
      </div>

      {/* SHAP Feature Contribution Waterfall Visualization */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 space-y-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col justify-between gap-2 border-b border-neutral-100 pb-3 sm:flex-row sm:items-center dark:border-neutral-800">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              SHAP Value Feature Attribution Breakdown
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Red bars increase anomaly/scam risk probability; green bars mitigate risk.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            Kernel: TreeExplainer v0.42
          </span>
        </div>

        {/* Feature Contribution Bars */}
        <div className="space-y-4">
          {activeSignals.map((item, index) => {
            const isPositive = item.direction === 'positive';
            const widthPct = Math.round(Math.abs(item.shapValue) * 100 * 2.2);

            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {item.feature}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="text-[11px] text-neutral-400">{item.category}</span>
                  </div>
                  <span
                    className={`font-mono font-semibold ${
                      isPositive
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {isPositive ? `+${item.shapValue.toFixed(2)}` : `${item.shapValue.toFixed(2)}`}
                  </span>
                </div>

                {/* Visual Bar */}
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <div
                    style={{ width: `${Math.min(100, widthPct)}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      isPositive ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Scientific Interpretability Note */}
        <div className="rounded-md border border-neutral-100 bg-neutral-50 p-4 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 leading-relaxed">
          <div className="flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
            <Info className="h-4 w-4" />
            <span>Ethical Interpretation Boundary:</span>
          </div>
          <p className="mt-1">
            SHAP feature attribution scores explain <em>why the model arrived at its probabilistic prediction</em>, identifying which input attributes exerted the greatest mathematical leverage. They do not constitute formal courtroom evidence or proof of deliberate fraudulent intent.
          </p>
        </div>
      </div>
    </div>
  );
};
