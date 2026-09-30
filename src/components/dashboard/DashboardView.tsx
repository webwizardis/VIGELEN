import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ArrowUpRight, Database, FileSpreadsheet, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SystemStatus } from '../../types';
import {
  REGULATORY_INTELLIGENCE_RECORDS,
  BLACKLISTED_MALICIOUS_ENTITIES,
  RBI_FRAUD_AGGREGATES,
  SEBI_DEMOGRAPHIC_METRICS,
} from '../../data/cleanedIntelligence';

interface DashboardViewProps {
  systemStatus?: SystemStatus;
  openCasesCount?: number;
  onNavigateToScamDetector: () => void;
  onNavigateToTransactionSecurity: () => void;
  onNavigateToCases: () => void;
  onNavigateToReports: () => void;
  onNavigateToLanding?: () => void;
  onNavigateToResearchLab?: () => void;
}

interface ActivityItem {
  id: string;
  vector: 'Investment' | 'Transaction' | 'Investigation';
  incidentSummary: string;
  riskAssessment: 'CRITICAL' | 'HIGH RISK' | 'MODERATE' | 'CLEARED';
  timestamp: string;
  targetTab: 'scam-detector' | 'transaction-security';
}

interface HistoricalRiskDataPoint {
  date: string;
  dayLabel: string;
  content: number;
  transaction: number;
  behavioral: number;
  composite: number;
}

// 30-Day Historical Risk Dataset
const generate30DayHistoricalData = (): HistoricalRiskDataPoint[] => {
  const baseData = [
    { day: 1, date: 'Aug 29', content: 28, transaction: 22, behavioral: 16 },
    { day: 2, date: 'Aug 30', content: 31, transaction: 25, behavioral: 19 },
    { day: 3, date: 'Aug 31', content: 35, transaction: 29, behavioral: 22 },
    { day: 4, date: 'Sep 01', content: 42, transaction: 34, behavioral: 25 },
    { day: 5, date: 'Sep 02', content: 48, transaction: 38, behavioral: 31 },
    { day: 6, date: 'Sep 03', content: 45, transaction: 44, behavioral: 36 },
    { day: 7, date: 'Sep 04', content: 52, transaction: 49, behavioral: 40 },
    { day: 8, date: 'Sep 05', content: 65, transaction: 55, behavioral: 48 },
    { day: 9, date: 'Sep 06', content: 78, transaction: 63, behavioral: 54 },
    { day: 10, date: 'Sep 07', content: 84, transaction: 71, behavioral: 62 },
    { day: 11, date: 'Sep 08', content: 76, transaction: 68, behavioral: 58 },
    { day: 12, date: 'Sep 09', content: 62, transaction: 59, behavioral: 50 },
    { day: 13, date: 'Sep 10', content: 54, transaction: 52, behavioral: 43 },
    { day: 14, date: 'Sep 11', content: 46, transaction: 48, behavioral: 39 },
    { day: 15, date: 'Sep 12', content: 38, transaction: 42, behavioral: 34 },
    { day: 16, date: 'Sep 13', content: 40, transaction: 45, behavioral: 36 },
    { day: 17, date: 'Sep 14', content: 47, transaction: 52, behavioral: 41 },
    { day: 18, date: 'Sep 15', content: 55, transaction: 60, behavioral: 49 },
    { day: 19, date: 'Sep 16', content: 61, transaction: 69, behavioral: 56 },
    { day: 20, date: 'Sep 17', content: 68, transaction: 82, behavioral: 73 },
    { day: 21, date: 'Sep 18', content: 72, transaction: 89, behavioral: 81 },
    { day: 22, date: 'Sep 19', content: 69, transaction: 81, behavioral: 75 },
    { day: 23, date: 'Sep 20', content: 58, transaction: 73, behavioral: 64 },
    { day: 24, date: 'Sep 21', content: 52, transaction: 64, behavioral: 55 },
    { day: 25, date: 'Sep 22', content: 59, transaction: 58, behavioral: 48 },
    { day: 26, date: 'Sep 23', content: 67, transaction: 62, behavioral: 53 },
    { day: 27, date: 'Sep 24', content: 75, transaction: 69, behavioral: 61 },
    { day: 28, date: 'Sep 25', content: 81, transaction: 77, behavioral: 70 },
    { day: 29, date: 'Sep 26', content: 88, transaction: 84, behavioral: 76 },
    { day: 30, date: 'Sep 27', content: 82, transaction: 79, behavioral: 71 },
  ];

  return baseData.map((d) => ({
    date: d.date,
    dayLabel: `Day ${d.day}`,
    content: d.content,
    transaction: d.transaction,
    behavioral: d.behavioral,
    composite: Math.round((d.content * 0.4 + d.transaction * 0.4 + d.behavioral * 0.2) * 10) / 10,
  }));
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToScamDetector,
  onNavigateToTransactionSecurity,
  onNavigateToCases,
  onNavigateToResearchLab,
}) => {
  const [timeRange, setTimeRange] = useState<'30D' | '14D' | '7D'>('30D');
  const [activeVector, setActiveVector] = useState<'all' | 'content' | 'transaction' | 'behavioral'>('all');

  const fullHistoricalData = useMemo(() => generate30DayHistoricalData(), []);

  const chartData = useMemo(() => {
    if (timeRange === '7D') return fullHistoricalData.slice(-7);
    if (timeRange === '14D') return fullHistoricalData.slice(-14);
    return fullHistoricalData;
  }, [timeRange, fullHistoricalData]);

  const activities: ActivityItem[] = [
    {
      id: 'act-1',
      vector: 'Investment',
      incidentSummary: 'Official NSE Match: t.me/SmartTradeSoftware (Record #817) flagged for illegal options advisory',
      riskAssessment: 'CRITICAL',
      timestamp: '10:32:04',
      targetTab: 'scam-detector',
    },
    {
      id: 'act-2',
      vector: 'Transaction',
      incidentSummary: 'Direct ₹45,000 transfer to tradekaropay.com (Official NSE Caution Blacklist #727)',
      riskAssessment: 'CRITICAL',
      timestamp: '09:14:22',
      targetTab: 'transaction-security',
    },
    {
      id: 'act-3',
      vector: 'Investment',
      incidentSummary: 'Malicious broker clone APK detected: MODMA.apk (NSE Record #775 / #786)',
      riskAssessment: 'CRITICAL',
      timestamp: 'Yesterday',
      targetTab: 'scam-detector',
    },
    {
      id: 'act-4',
      vector: 'Transaction',
      incidentSummary: 'Offshore payment gateway debit of ₹35,000 during off-hours (RBI Banking Frauds Watchlist)',
      riskAssessment: 'MODERATE',
      timestamp: '2 days ago',
      targetTab: 'transaction-security',
    },
    {
      id: 'act-5',
      vector: 'Investment',
      incidentSummary: 'SEBI registered research analyst report on public banking sector (Statutory Disclosures Verified)',
      riskAssessment: 'CLEARED',
      timestamp: '3 days ago',
      targetTab: 'scam-detector',
    },
  ];

  return (
    <div className="space-y-16 max-w-5xl">
      {/* Variation 12 Section Header */}
      <div className="section-header">
        <div className="mono text-[#2563eb] mb-4">
          — Capital Protection Engine
        </div>

        <h1 className="font-serif text-[3.2rem] sm:text-[4rem] lg:text-[4.5rem] font-semibold text-[#1a1a1a] leading-none tracking-tight mb-6">
          Financial Risk Intelligence
        </h1>

        <p className="text-base sm:text-lg text-[#71717a] leading-relaxed max-w-3xl">
          Comprehensive surveillance of fraudulent investment content, social media scam patterns, and transaction anomalies for retail capital protection.
        </p>

        <div className="actions flex flex-wrap gap-4 sm:gap-6 mt-10">
          <button
            onClick={onNavigateToScamDetector}
            className="btn btn-primary"
          >
            Check Content
          </button>

          <button
            onClick={onNavigateToTransactionSecurity}
            className="btn"
          >
            Check Transactions
          </button>

          <button
            onClick={onNavigateToCases}
            className="btn"
          >
            View Casebook
          </button>
        </div>
      </div>

      {/* Variation 12 Dashboard Grid (Metric Cards) */}
      <div className="dashboard-grid grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
        <div className="metric-card border-t border-[#1a1a1a] pt-4">
          <div className="mono text-[#71717a]">Content Scans</div>
          <div className="font-serif text-[3rem] font-semibold text-[#1a1a1a] my-2 leading-none">
            142
          </div>
          <div className="mono text-[#2563eb]">
            +14.2% Month Over Month
          </div>
        </div>

        <div className="metric-card border-t border-[#1a1a1a] pt-4">
          <div className="mono text-[#71717a]">Capital Protected</div>
          <div className="font-serif text-[3rem] font-semibold text-[#1a1a1a] my-2 leading-none">
            ₹42.8L
          </div>
          <div className="mono text-[#71717a]">
            Across 88 Inquiries
          </div>
        </div>

        <div className="metric-card border-t border-[#1a1a1a] pt-4">
          <div className="mono text-[#71717a]">High-Risk Alerts</div>
          <div className="font-serif text-[3rem] font-semibold text-[#be123c] my-2 leading-none">
            18
          </div>
          <div className="mono text-[#71717a]">
            Interceptions Generated
          </div>
        </div>
      </div>

      {/* Ground-Truth Regulatory Dataset Telemetry Banner (All CSV Data Ingested into Model) */}
      <div className="border border-[#1a1a1a] bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e4e4e7] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[#1a1a1a] text-white">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="mono text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
                  Ground-Truth Regulatory Intelligence (All CSV Data Ingested)
                </span>
                <span className="status-pill text-[#10b981] border-[#10b981] text-[0.6rem] py-0.5">
                  100% INGESTED
                </span>
              </div>
              <p className="text-xs text-[#71717a] mt-0.5">
                Processed, normalized, and actively indexed inside the Gemini AI prompt context and deterministic NLP rules engine.
              </p>
            </div>
          </div>

          {onNavigateToResearchLab && (
            <button
              onClick={onNavigateToResearchLab}
              className="mono text-xs border border-[#1a1a1a] px-3 py-1.5 bg-[#ffffff] hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer self-start md:self-auto inline-flex items-center gap-1.5 shrink-0"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Explore Cleaned & Raw CSVs</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 text-xs">
          <div className="border-l-2 border-[#1a1a1a] pl-3">
            <div className="mono text-[0.65rem] text-[#71717a]">Total Ingested Records</div>
            <div className="mono text-lg font-bold text-[#1a1a1a] mt-0.5">
              {REGULATORY_INTELLIGENCE_RECORDS.length} Records
            </div>
            <div className="text-[0.65rem] text-[#71717a]">Across NSE, RBI, SEBI</div>
          </div>

          <div className="border-l-2 border-[#be123c] pl-3">
            <div className="mono text-[0.65rem] text-[#71717a]">NSE Caution Blacklist</div>
            <div className="mono text-lg font-bold text-[#be123c] mt-0.5">
              {BLACKLISTED_MALICIOUS_ENTITIES.length} Entities
            </div>
            <div className="text-[0.65rem] text-[#71717a]">APKs, Telegram, Web Clones</div>
          </div>

          <div className="border-l-2 border-[#2563eb] pl-3">
            <div className="mono text-[0.65rem] text-[#71717a]">RBI Banking Frauds</div>
            <div className="mono text-lg font-bold text-[#2563eb] mt-0.5">
              ₹18,674 Cr
            </div>
            <div className="text-[0.65rem] text-[#71717a]">122 Reclassified Cases</div>
          </div>

          <div className="border-l-2 border-[#10b981] pl-3">
            <div className="mono text-[0.65rem] text-[#71717a]">SEBI 2025 Demographics</div>
            <div className="mono text-lg font-bold text-[#10b981] mt-0.5">
              85% Safety Mandate
            </div>
            <div className="text-[0.65rem] text-[#71717a]">Silver Gen & Gender Baseline</div>
          </div>
        </div>
      </div>

      {/* Historical Risk Scores (Recharts Integration matching Variation 12) */}
      <div className="border-t border-[#e4e4e7] pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="mono text-[#2563eb] mb-1">— Multi-Vector Telemetry</div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1a1a1a]">
              Historical Risk Scores
            </h2>
            <p className="text-xs text-[#71717a] mt-1">
              Cross-vector telemetry over the last 30 days based on content, transaction, and behavioral states.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto border border-[#1a1a1a] p-1 bg-[#ffffff]">
            {(['30D', '14D', '7D'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`mono px-3 py-1 text-[0.65rem] transition-colors cursor-pointer ${
                  timeRange === range
                    ? 'bg-[#1a1a1a] text-white font-bold'
                    : 'text-[#71717a] hover:text-[#1a1a1a]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Vector Toggle Filter Row */}
        <div className="flex items-center justify-between mb-4 border-b border-[#e4e4e7] pb-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="mono text-[#71717a]">Vector:</span>
            {(
              [
                { id: 'all', label: 'All Vectors' },
                { id: 'content', label: 'Content' },
                { id: 'transaction', label: 'Transaction' },
                { id: 'behavioral', label: 'Behavioral' },
              ] as const
            ).map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVector(v.id)}
                className={`mono transition-colors cursor-pointer pb-0.5 ${
                  activeVector === v.id
                    ? 'text-[#1a1a1a] border-b-2 border-[#1a1a1a] font-bold'
                    : 'text-[#71717a] hover:text-[#1a1a1a]'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <span className="mono text-[0.6rem] text-[#71717a] hidden sm:inline">
            Scale: 0 (Normal) to 100 (Critical)
          </span>
        </div>

        {/* Chart Canvas */}
        <div className="border border-[#e4e4e7] bg-[#ffffff] p-4 sm:p-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 12, right: 16, left: -20, bottom: 4 }}
              >
                <CartesianGrid
                  stroke="#e4e4e7"
                  strokeDasharray="2 2"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#71717a', fontFamily: 'Space Mono' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e4e4e7' }}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tick={{ fontSize: 10, fill: '#71717a', fontFamily: 'Space Mono' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="border border-[#1a1a1a] bg-[#ffffff] p-3 text-xs shadow-md font-mono min-w-44">
                          <p className="font-bold text-[#1a1a1a] border-b border-[#e4e4e7] pb-1 mb-2">
                            {label} Telemetry
                          </p>
                          <div className="space-y-1">
                            {payload.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px]">
                                <span className="flex items-center gap-1.5 text-[#71717a]">
                                  <span
                                    className="h-2 w-2 inline-block rounded-full"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span>{item.name}:</span>
                                </span>
                                <span className="font-bold text-[#1a1a1a]">
                                  {item.value} / 100
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: 16,
                    fontFamily: 'Space Mono',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                />

                {/* Content Risk Vector */}
                {(activeVector === 'all' || activeVector === 'content') && (
                  <Line
                    type="monotone"
                    dataKey="content"
                    name="Content Risk"
                    stroke="#1a1a1a"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: '#1a1a1a' }}
                    activeDot={{ r: 5, fill: '#1a1a1a' }}
                  />
                )}

                {/* Transaction Velocity Vector */}
                {(activeVector === 'all' || activeVector === 'transaction') && (
                  <Line
                    type="monotone"
                    dataKey="transaction"
                    name="Transaction Risk"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: '#2563eb' }}
                    activeDot={{ r: 5, fill: '#2563eb' }}
                  />
                )}

                {/* Behavioral Deviation Vector */}
                {(activeVector === 'all' || activeVector === 'behavioral') && (
                  <Line
                    type="monotone"
                    dataKey="behavioral"
                    name="Behavioral Risk"
                    stroke="#be123c"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: '#be123c' }}
                    activeDot={{ r: 5, fill: '#be123c' }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Variation 12 Table Container (Monitoring Feed [Live]) */}
      <div className="table-container mt-16 border-t border-[#e4e4e7] pt-12">
        <div className="mono text-[#1a1a1a] mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="indicator" />
            <span>Monitoring Feed [Live]</span>
          </span>
          <span className="text-[#71717a] font-normal">Active Surveillance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="mono border-b border-[#e4e4e7] text-[#71717a]">
                <th className="text-left py-3 px-3">Vector</th>
                <th className="text-left py-3 px-3">Incident Summary</th>
                <th className="text-left py-3 px-3">Risk Assessment</th>
                <th className="text-left py-3 px-3">Timestamp</th>
                <th className="text-right py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((item) => (
                <tr key={item.id} className="border-b border-[#e4e4e7] hover:bg-[#1a1a1a]/[0.015] transition-colors">
                  <td className="mono py-5 px-3 font-bold text-[#1a1a1a] whitespace-nowrap">
                    {item.vector}
                  </td>
                  <td className="py-5 px-3 text-sm text-[#1a1a1a] max-w-md">
                    {item.incidentSummary}
                  </td>
                  <td className="py-5 px-3 whitespace-nowrap">
                    {item.riskAssessment === 'CRITICAL' && (
                      <span className="status-pill bg-[#be123c] text-white border-transparent">
                        CRITICAL
                      </span>
                    )}
                    {item.riskAssessment === 'HIGH RISK' && (
                      <span className="status-pill text-[#be123c] border-[#be123c]">
                        HIGH RISK
                      </span>
                    )}
                    {item.riskAssessment === 'MODERATE' && (
                      <span className="status-pill text-[#71717a] border-[#e4e4e7]">
                        MODERATE
                      </span>
                    )}
                    {item.riskAssessment === 'CLEARED' && (
                      <span className="status-pill text-[#10b981] border-[#10b981]">
                        CLEARED
                      </span>
                    )}
                  </td>
                  <td className="mono py-5 px-3 text-[#71717a] whitespace-nowrap text-xs">
                    {item.timestamp}
                  </td>
                  <td className="py-5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={
                        item.targetTab === 'scam-detector'
                          ? onNavigateToScamDetector
                          : onNavigateToTransactionSecurity
                      }
                      className="mono text-[#1a1a1a] border border-[#1a1a1a] px-2.5 py-1 bg-white hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-xs"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
