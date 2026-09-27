import React, { useState } from 'react';
import {
  CreditCard,
  Clock,
  Smartphone,
  MapPin,
  TrendingUp,
  RefreshCw,
  FolderPlus,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Info,
} from 'lucide-react';
import { TransactionData, TransactionAnomalyResult } from '../../types';
import { SAMPLE_TRANSACTION_PRESETS } from '../../data/mockData';
import { apiAnalyzeTransaction } from '../../services/api';

interface TransactionSecurityViewProps {
  isDemoMode?: boolean;
  onSendToUnifiedRisk?: (txRisk: number, behRisk: number) => void;
  onAttachToCase?: (result: TransactionAnomalyResult) => void;
}

export const TransactionSecurityView: React.FC<TransactionSecurityViewProps> = ({
  isDemoMode = true,
  onSendToUnifiedRisk,
  onAttachToCase,
}) => {
  // Inputs (Section 12): Amount, Time, Merchant, Transaction Type, Location, Device
  // Historical info: Typical Amount, Typical Time, Known Merchant, Known Device
  const [formData, setFormData] = useState<TransactionData>({
    amount: 78000,
    currency: 'INR',
    transactionTime: '03:12',
    merchant: 'vipcalls98@oksbi',
    transactionType: 'UPI_P2P',
    location: 'Kolkata, IN (IP Geo)',
    device: 'Apple iPhone 15 Pro (New Device ID)',
    accountAgeMonths: 24,
    historicalAvgAmount: 3200,
    historicalFrequencyPerDay: 3.2,
    currentDailyCount: 7,
  });

  const [historicalInfo, setHistoricalInfo] = useState({
    typicalAmount: 3200,
    typicalTime: '09:00 AM – 10:00 PM',
    knownMerchant: 'No (First-time peer transfer)',
    knownDevice: 'No (New hardware identifier)',
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TransactionAnomalyResult | null>(null);

  const handleSelectPreset = (preset: typeof SAMPLE_TRANSACTION_PRESETS[0]) => {
    setFormData(preset.data);
    setHistoricalInfo({
      typicalAmount: preset.data.historicalAvgAmount,
      typicalTime: '09:00 AM – 10:00 PM',
      knownMerchant: preset.data.merchant.includes('official') ? 'Yes' : 'No (First-time peer transfer)',
      knownDevice: preset.data.device.includes('New') ? 'No (New hardware identifier)' : 'Yes (Primary device)',
    });
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await apiAnalyzeTransaction(formData, isDemoMode);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Failed to analyze transaction:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Run initial analysis automatically on mount
  React.useEffect(() => {
    if (!analysisResult) {
      apiAnalyzeTransaction(formData, isDemoMode).then((res) => setAnalysisResult(res));
    }
  }, []);

  const deviationRatio =
    historicalInfo.typicalAmount > 0
      ? (formData.amount / historicalInfo.typicalAmount).toFixed(1)
      : '1.0';

  return (
    <div className="space-y-6">
      {/* Page Header (Section 12) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Risk Analysis
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">Behavioral Outliers</span>
        </div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Check Transaction
        </h1>
        <p className="mt-1 text-xs text-slate-600 max-w-3xl leading-relaxed">
          Review transaction characteristics and identify unusual behavior.
        </p>

        {/* Preset Selector */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <span className="text-xs font-semibold text-slate-500">
            Sample Scenarios:
          </span>
          {SAMPLE_TRANSACTION_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="rounded-lg border border-[#e4e4e7] bg-white px-3 py-1.5 text-xs font-medium text-[#1a1a1a] transition-colors hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Grid: Transaction Characteristics & Historical Baselines (Section 12) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Inputs Form (2 Cols) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Transaction Characteristics
            </h2>
            <span className="text-[11px] font-mono font-medium text-slate-400">
              Payment Parameters
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Amount (₹)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Time (24h format, e.g. 03:12)
              </label>
              <input
                type="text"
                value={formData.transactionTime}
                onChange={(e) =>
                  setFormData({ ...formData, transactionTime: e.target.value })
                }
                placeholder="03:12"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Merchant */}
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Merchant / Payee Destination
              </label>
              <input
                type="text"
                value={formData.merchant}
                onChange={(e) =>
                  setFormData({ ...formData, merchant: e.target.value })
                }
                placeholder="vipcalls98@oksbi"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Transaction Type
              </label>
              <select
                value={formData.transactionType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transactionType: e.target.value as TransactionData['transactionType'],
                  })
                }
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-hidden"
              >
                <option value="UPI_P2P">UPI P2P (Peer-to-Peer Transfer)</option>
                <option value="UPI_P2M">UPI P2M (Peer-to-Merchant)</option>
                <option value="IMPS_NEFT">IMPS / NEFT Bank Transfer</option>
                <option value="CARD_ONLINE">Card Online / Payment Gateway</option>
                <option value="CARD_POS">Card Point of Sale (POS)</option>
                <option value="CRYPTO_GATEWAY">Crypto / Virtual Asset Gateway</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Device */}
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Device
              </label>
              <input
                type="text"
                value={formData.device}
                onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-[11px] text-slate-500">
              Evaluates parameter deviation relative to customer's historical account profile.
            </span>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="inline-flex items-center gap-2 border border-[#1a1a1a] bg-[#1a1a1a] px-5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-white hover:text-[#1a1a1a] disabled:opacity-50 cursor-pointer"
            >
              {analyzing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              <span>{analyzing ? 'Analyzing Behavior...' : 'Analyze Transaction'}</span>
            </button>
          </div>
        </div>

        {/* Historical Information Card (Section 12) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Historical Information
              </h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Account Baseline
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Typical Amount
                </span>
                <p className="font-mono-numbers mt-0.5 text-base font-bold text-slate-900">
                  ₹{historicalInfo.typicalAmount.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">30-day average transaction</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Typical Time
                </span>
                <p className="font-mono mt-0.5 text-sm font-bold text-slate-900">
                  {historicalInfo.typicalTime}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Active hours baseline</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Known Merchant
                </span>
                <p className="mt-0.5 text-sm font-bold text-slate-900">
                  {historicalInfo.knownMerchant}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Known Device
                </span>
                <p className="mt-0.5 text-sm font-bold text-slate-900">
                  {historicalInfo.knownDevice}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Deviation Ratio:</span>
              <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {deviationRatio}x Typical Outflow
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 13: TRANSACTION RESULT */}
      {analysisResult && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          {/* Top: TRANSACTION RISK */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>TRANSACTION EVALUATION</span>
                <span>·</span>
                <span>REF: {analysisResult.id}</span>
              </div>
              <h2 className="mt-1 font-display text-xl font-black text-slate-900">
                TRANSACTION RISK
              </h2>
              <p className="mt-1 text-xs text-slate-600 italic">
                "Suspicious characteristics detected."
              </p>
            </div>

            {/* Score Badge & Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-2">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                    {analysisResult.riskScore >= 75
                      ? 'HIGH RISK'
                      : analysisResult.riskScore >= 50
                      ? 'MODERATE RISK'
                      : 'LOW RISK'}
                  </span>
                  <div className="font-mono-numbers text-2xl font-black text-amber-700 leading-none mt-0.5">
                    {analysisResult.riskScore} <span className="text-xs font-normal text-amber-600">/ 100</span>
                  </div>
                </div>
              </div>

              {onAttachToCase && (
                <button
                  onClick={() => onAttachToCase(analysisResult)}
                  className="inline-flex items-center gap-1.5 border border-[#1a1a1a] bg-[#1a1a1a] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-white hover:text-[#1a1a1a] cursor-pointer"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>Link to Case</span>
                </button>
              )}

              {onSendToUnifiedRisk && (
                <button
                  onClick={() =>
                    onSendToUnifiedRisk(
                      analysisResult.riskScore,
                      analysisResult.behavioralComparison.behavioralAnomalyScore
                    )
                  }
                  className="inline-flex items-center gap-1.5 border border-[#1a1a1a] bg-white px-3.5 py-2 text-xs font-bold text-[#1a1a1a] shadow-2xs transition-colors hover:bg-[#1a1a1a] hover:text-white cursor-pointer"
                >
                  <Sliders className="h-4 w-4 text-[#1a1a1a]" />
                  <span>Send to Risk Intelligence</span>
                </button>
              )}
            </div>
          </div>

          {/* Section: ANOMALIES DETECTED (Section 13) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              ANOMALIES DETECTED
            </h3>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Amount deviation */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Amount deviation
                  </span>
                  <span className="rounded bg-rose-100 px-1.5 py-0.2 font-mono text-[10px] font-black text-rose-700">
                    High
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-600">
                  ₹{formData.amount.toLocaleString()} is {deviationRatio}x above 30-day baseline average (₹{historicalInfo.typicalAmount.toLocaleString()}).
                </p>
              </div>

              {/* New device */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    New device
                  </span>
                  <span className="rounded bg-amber-100 px-1.5 py-0.2 font-mono text-[10px] font-black text-amber-800">
                    Medium
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-600">
                  Unrecognized hardware identifier without prior login or transaction history.
                </p>
              </div>

              {/* Unusual time */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Unusual time
                  </span>
                  <span className="rounded bg-amber-100 px-1.5 py-0.2 font-mono text-[10px] font-black text-amber-800">
                    Medium
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-600">
                  Executed at {formData.transactionTime}, outside habitual customer window ({historicalInfo.typicalTime}).
                </p>
              </div>

              {/* Unknown merchant */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Unknown merchant
                  </span>
                  <span className="rounded bg-rose-100 px-1.5 py-0.2 font-mono text-[10px] font-black text-rose-700">
                    High
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-600">
                  First-time peer-to-peer VPA transfer lacking merchant escrow or SEBI clearing registration.
                </p>
              </div>
            </div>
          </div>

          {/* Section: BEHAVIORAL COMPARISON (Section 13) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                BEHAVIORAL COMPARISON
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Current transaction vs typical behavior
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Amount comparison */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Amount Comparison
                </span>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current:</span>
                    <span className="font-mono font-bold text-rose-700">
                      ₹{formData.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Typical:</span>
                    <span className="font-mono font-bold text-slate-700">
                      ₹{historicalInfo.typicalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time comparison */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Time Comparison
                </span>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current time:</span>
                    <span className="font-mono font-bold text-amber-700">
                      {formData.transactionTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Typical:</span>
                    <span className="font-mono font-bold text-slate-700">
                      {historicalInfo.typicalTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Device comparison */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Hardware Identity
                </span>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Device:</span>
                    <span className="font-bold text-rose-700">
                      New
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Typical:</span>
                    <span className="font-bold text-slate-700">
                      Primary Registered
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: WHY THIS WAS FLAGGED (Section 13) */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2">
              WHY THIS WAS FLAGGED
            </h3>
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong className="text-slate-900">1. Outflow Outlier:</strong> The attempted debit of ₹{formData.amount.toLocaleString()} is substantially greater than the customer's habitual ₹{historicalInfo.typicalAmount.toLocaleString()} median, representing a high outlier event.
              </p>
              <p>
                <strong className="text-slate-900">2. High-Risk Beneficiary Channel:</strong> The payment is directed to an individual UPI handle without statutory institutional clearing or verified business registration.
              </p>
              <p>
                <strong className="text-slate-900">3. Compound Behavioral Inconsistency:</strong> The conjunction of new hardware identity, off-peak nocturnal execution ({formData.transactionTime}), and high-value single debit matches established financial loss risk heuristics.
              </p>
            </div>
            <p className="mt-3 text-[11px] text-slate-500 border-t border-indigo-100 pt-2 font-medium">
              Assessment note: Suspicious characteristics detected. Not a verified confirmation of fraud without corroborating beneficiary audit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
