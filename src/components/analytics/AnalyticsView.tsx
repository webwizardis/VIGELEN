import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Filter,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingDown,
  PieChart,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Download,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Clock,
  MapPin,
  Flame,
  CheckCircle2,
  DollarSign,
  Share2,
  TrendingUp,
  Sliders,
  Globe,
  Zap,
  Info,
  X,
} from 'lucide-react';

interface IncidentRow {
  id: string;
  timestamp: string;
  category: string;
  channel: string;
  targetEntity: string;
  riskScore: number;
  preventedAmount: string;
  status: 'QUARANTINED' | 'ESCALATED' | 'UNDER_INQUEST' | 'INTERCEPTED';
  location: string;
}

export const AnalyticsView: React.FC = () => {
  // Slicers / Filters
  const [timeHorizon, setTimeHorizon] = useState<'24h' | '7d' | '30d' | '90d' | 'ytd'>('30d');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMetricTab, setActiveMetricTab] = useState<'volume' | 'loss' | 'risk'>('volume');
  const [currencyUnit, setCurrencyUnit] = useState<'INR' | 'USD'>('INR');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hoveredDonutIndex, setHoveredDonutIndex] = useState<number | null>(null);
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState<number | null>(null);
  const [drilldownIncident, setDrilldownIncident] = useState<IncidentRow | null>(null);

  // Trigger simulated refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setTimeHorizon('30d');
    setSelectedRegion('ALL');
    setSelectedCategory('ALL');
    setSelectedSeverity('ALL');
    setSearchQuery('');
  };

  // Top KPI metrics data
  const kpiData = {
    totalIngested: {
      value: '184,920',
      label: 'Signals Monitored',
      delta: '+14.2% MoM',
      deltaType: 'positive',
      subtext: '94.2k social, 90.7k txns',
      sparkline: [25, 34, 42, 38, 55, 62, 70, 68, 82, 94],
      accentColor: 'indigo',
    },
    flaggedThreats: {
      value: '4,185',
      label: 'High-Risk Outliers',
      delta: '+9.8% vs avg',
      deltaType: 'warning',
      subtext: '2.26% high-confidence flags',
      sparkline: [12, 18, 15, 24, 28, 35, 42, 39, 45, 52],
      accentColor: 'rose',
    },
    lossPrevented: {
      value: currencyUnit === 'INR' ? '₹612.4 Cr' : '$74.2 M',
      label: 'Capital Loss Mitigated',
      delta: '+24.6% YTD',
      deltaType: 'positive',
      subtext: '1,340 accounts/UPI IDs halted',
      sparkline: [40, 52, 60, 58, 72, 85, 92, 88, 105, 124],
      accentColor: 'emerald',
    },
    interceptionRate: {
      value: '96.8%',
      label: 'Interception Precision',
      delta: '+1.8% vs SLA (95%)',
      deltaType: 'positive',
      subtext: '1.4% false discovery rate',
      sparkline: [92, 93, 94, 94, 95, 95, 96, 96, 97, 96.8],
      accentColor: 'purple',
    },
    mtti: {
      value: '3.4 min',
      label: 'Mean Time to Intervene',
      delta: '-42% latency',
      deltaType: 'positive',
      subtext: 'Down from 5.8m benchmark',
      sparkline: [65, 58, 52, 48, 44, 40, 38, 36, 35, 34],
      accentColor: 'amber',
    },
  };

  // Categories distribution for Donut chart
  const scamCategories = [
    {
      id: 'VIP_PUMP',
      label: 'Telegram / WhatsApp VIP Pump & Dump',
      count: 3240,
      pct: 34,
      amount: '₹218.4 Cr',
      color: '#4f46e5', // Indigo
      bgClass: 'bg-indigo-500',
      lightBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'PRE_IPO',
      label: 'Pre-IPO & Unlisted Share Allocation Lures',
      count: 2280,
      pct: 24,
      amount: '₹164.2 Cr',
      color: '#10b981', // Emerald
      bgClass: 'bg-emerald-500',
      lightBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'CRYPTO_PONZI',
      label: 'Algorithmic Arbitrage / Crypto Ponzi',
      count: 1810,
      pct: 19,
      amount: '₹122.8 Cr',
      color: '#f43f5e', // Rose
      bgClass: 'bg-rose-500',
      lightBg: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'FAKE_APKS',
      label: 'Institutional Impersonation / Fake Broker APKs',
      count: 1420,
      pct: 15,
      amount: '₹78.5 Cr',
      color: '#a855f7', // Purple
      bgClass: 'bg-purple-500',
      lightBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'MICROCAP_HYPE',
      label: 'Microcap Social Influencer FOMO Breakouts',
      count: 730,
      pct: 8,
      amount: '₹28.5 Cr',
      color: '#f59e0b', // Amber
      bgClass: 'bg-amber-500',
      lightBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  // Ingress Channel Breakdown (Bar chart)
  const channelBreakdown = [
    { name: 'Telegram Private VIP Groups', volume: 42100, interceptedPct: 97.4, avgRisk: 86, color: 'bg-indigo-600' },
    { name: 'WhatsApp Business Broadcasts', volume: 35400, interceptedPct: 95.8, avgRisk: 82, color: 'bg-emerald-600' },
    { name: 'Spoofed Banking / Broking APKs', volume: 18900, interceptedPct: 98.1, avgRisk: 91, color: 'bg-rose-600' },
    { name: 'Social Microcap Influencer Feeds', volume: 14200, interceptedPct: 93.6, avgRisk: 74, color: 'bg-amber-500' },
    { name: 'Phishing KYC & Escrow Portals', volume: 9800, interceptedPct: 99.2, avgRisk: 95, color: 'bg-purple-600' },
    { name: 'SMS & Smishing Bulk Gateways', volume: 6400, interceptedPct: 98.7, avgRisk: 89, color: 'bg-cyan-600' },
  ];

  // Multi-Series Trends (Simulated time-series across 8 weeks)
  const timeSeriesData = [
    { period: 'W1', volume: 16800, flagged: 320, lossPrevented: 42, avgRisk: 64, event: null },
    { period: 'W2', volume: 19400, flagged: 410, lossPrevented: 58, avgRisk: 68, event: null },
    { period: 'W3', volume: 22600, flagged: 580, lossPrevented: 76, avgRisk: 74, event: 'SEBI Advisory' },
    { period: 'W4', volume: 21100, flagged: 490, lossPrevented: 69, avgRisk: 70, event: null },
    { period: 'W5', volume: 28900, flagged: 780, lossPrevented: 112, avgRisk: 83, event: 'VIP Syndicate Surge' },
    { period: 'W6', volume: 26500, flagged: 690, lossPrevented: 98, avgRisk: 79, event: null },
    { period: 'W7', volume: 31200, flagged: 890, lossPrevented: 134, avgRisk: 87, event: 'Pre-IPO Phishing Wave' },
    { period: 'W8', volume: 29800, flagged: 810, lossPrevented: 123, avgRisk: 84, event: null },
  ];

  // Regional Heatmap Breakdown
  const regionalData = [
    { region: 'Maharashtra (Mumbai / Pune)', code: 'MH', riskScore: 88, cases: 3120, capital: '₹194 Cr', status: 'CRITICAL', trend: '+18%' },
    { region: 'Karnataka (Bengaluru)', code: 'KA', riskScore: 82, cases: 2450, capital: '₹148 Cr', status: 'CRITICAL', trend: '+14%' },
    { region: 'Delhi NCR (Gurugram / Noida)', code: 'DL', riskScore: 79, cases: 1980, capital: '₹116 Cr', status: 'HIGH', trend: '+9%' },
    { region: 'Telangana (Hyderabad)', code: 'TS', riskScore: 73, cases: 1240, capital: '₹78 Cr', status: 'HIGH', trend: '+7%' },
    { region: 'Gujarat (Ahmedabad / Surat)', code: 'GJ', riskScore: 71, cases: 1110, capital: '₹64 Cr', status: 'HIGH', trend: '+5%' },
    { region: 'Cross-Border Mule Hubs (SE Asia / UAE)', code: 'INT', riskScore: 94, cases: 580, capital: '₹32 Cr', status: 'CRITICAL', trend: '+31%' },
  ];

  // Temporal Fraud Surge Heatmap Matrix (7 Days x 6 Time Slots)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = ['00-04h', '04-08h', '08-12h', '12-16h', '16-20h', '20-24h'];
  // Heatmap intensity values (0-100)
  const heatmapMatrix: number[][] = [
    [12, 18, 85, 72, 68, 34], // Mon: big spike at market open
    [15, 22, 92, 80, 75, 41], // Tue: sustained market pressure
    [14, 25, 96, 88, 82, 45], // Wed: midweek peak
    [18, 28, 94, 86, 79, 48], // Thu: expiry day surge
    [22, 32, 98, 90, 89, 62], // Fri: weekly close & weekend setup
    [35, 20, 48, 54, 88, 76], // Sat: crypto & Telegram priming
    [40, 24, 52, 60, 95, 84], // Sun: VIP breakout teasers before Monday
  ];

  // Top scam indicators frequency & correlation
  const topIndicators = [
    { name: 'Guaranteed Returns Promise (> 20% p.a.)', frequency: 5420, pct: 92, correlation: 0.94, rank: 1 },
    { name: 'Personal P2P UPI QR Payment Demand', frequency: 4680, pct: 81, correlation: 0.91, rank: 2 },
    { name: 'Artificial Urgency / Time-Limit Countdown', frequency: 3950, pct: 69, correlation: 0.86, rank: 3 },
    { name: 'Absence of Statutory SEBI / RBI Disclosure', frequency: 3620, pct: 63, correlation: 0.82, rank: 4 },
    { name: 'Unregistered Entity / Fake SEBI Stamp Assertion', frequency: 2840, pct: 49, correlation: 0.79, rank: 5 },
    { name: 'Multi-Level / Pyramid Referral Commission Lure', frequency: 2120, pct: 37, correlation: 0.75, rank: 6 },
    { name: 'Off-Market Unlisted Pre-IPO Escrow Lock-in', frequency: 1890, pct: 33, correlation: 0.88, rank: 7 },
    { name: 'Unauthorized Third-Party APK Download Link', frequency: 1540, pct: 27, correlation: 0.93, rank: 8 },
  ];

  // Incident ledger mock data
  const incidentLedger: IncidentRow[] = [
    {
      id: 'INC-2026-8941',
      timestamp: 'Today, 14:32:10',
      category: 'Telegram / WhatsApp VIP Pump',
      channel: 'Telegram VIP',
      targetEntity: 'KAVERI-ENERGY.BO (BSE: 543912)',
      riskScore: 96,
      preventedAmount: '₹34.8 Lakhs',
      status: 'QUARANTINED',
      location: 'Mumbai (MH)',
    },
    {
      id: 'INC-2026-8940',
      timestamp: 'Today, 13:15:44',
      category: 'Pre-IPO Allocation Lures',
      channel: 'Phishing Portal',
      targetEntity: 'Apex Mobility Pre-IPO Share Allocation',
      riskScore: 94,
      preventedAmount: '₹1.20 Cr',
      status: 'ESCALATED',
      location: 'Bengaluru (KA)',
    },
    {
      id: 'INC-2026-8939',
      timestamp: 'Today, 11:42:05',
      category: 'Crypto Ponzi Schemes',
      channel: 'WhatsApp Business',
      targetEntity: 'QuantumYield Daily Arbitrage Bot v4',
      riskScore: 91,
      preventedAmount: '₹45.0 Lakhs',
      status: 'INTERCEPTED',
      location: 'Delhi NCR',
    },
    {
      id: 'INC-2026-8938',
      timestamp: 'Today, 10:08:29',
      category: 'Fake Broker APKs',
      channel: 'Spoofed APK',
      targetEntity: 'HDFC Securities Pro Clone APK v3.1',
      riskScore: 97,
      preventedAmount: '₹82.5 Lakhs',
      status: 'QUARANTINED',
      location: 'Hyderabad (TS)',
    },
    {
      id: 'INC-2026-8937',
      timestamp: 'Yesterday, 19:54:12',
      category: 'Microcap Influencer Hype',
      channel: 'Instagram Reels / Telegram',
      targetEntity: 'ZENITH-SOLAR.NS (NSE: ZENITH)',
      riskScore: 78,
      preventedAmount: '₹18.2 Lakhs',
      status: 'UNDER_INQUEST',
      location: 'Ahmedabad (GJ)',
    },
    {
      id: 'INC-2026-8936',
      timestamp: 'Yesterday, 16:30:00',
      category: 'Telegram / WhatsApp VIP Pump',
      channel: 'Telegram VIP',
      targetEntity: 'ORBITAL-CHEM.BO (BSE: 532890)',
      riskScore: 89,
      preventedAmount: '₹62.0 Lakhs',
      status: 'INTERCEPTED',
      location: 'Overseas Mule Node',
    },
  ];

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidentLedger.filter((inc) => {
      if (selectedRegion !== 'ALL' && !inc.location.toLowerCase().includes(selectedRegion.toLowerCase())) {
        return false;
      }
      if (selectedCategory !== 'ALL' && inc.category !== selectedCategory) {
        return false;
      }
      if (selectedSeverity === 'CRITICAL' && inc.riskScore < 85) return false;
      if (selectedSeverity === 'HIGH' && (inc.riskScore < 70 || inc.riskScore >= 85)) return false;
      if (selectedSeverity === 'MODERATE' && (inc.riskScore < 40 || inc.riskScore >= 70)) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          inc.id.toLowerCase().includes(query) ||
          inc.targetEntity.toLowerCase().includes(query) ||
          inc.channel.toLowerCase().includes(query) ||
          inc.location.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedRegion, selectedCategory, selectedSeverity, searchQuery]);

  // Donut SVG helper math
  const donutCenter = 100;
  const donutRadius = 75;
  const donutStrokeWidth = 24;
  let cumulativeAngle = 0;

  const donutSlices = scamCategories.map((cat, idx) => {
    const angle = (cat.pct / 100) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = donutCenter + donutRadius * Math.cos(startRad);
    const y1 = donutCenter + donutRadius * Math.sin(startRad);
    const x2 = donutCenter + donutRadius * Math.cos(endRad);
    const y2 = donutCenter + donutRadius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;
    const pathData = `M ${x1} ${y1} A ${donutRadius} ${donutRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

    return {
      ...cat,
      index: idx,
      pathData,
      isHovered: hoveredDonutIndex === idx,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Power BI Executive Header Bar */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                Power BI Enterprise Surveillance Engine
              </span>
              <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-700">
                LIVE TELEMETRY
              </span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Financial Risk & Fraud Analytics
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Correlated temporal trajectories, threat ingress decomposition, regional exposure & automated intervention metrics.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Currency Unit Switcher */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5">
              <button
                onClick={() => setCurrencyUnit('INR')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                  currencyUnit === 'INR'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrencyUnit('USD')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                  currencyUnit === 'USD'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                $ USD
              </button>
            </div>

            {/* Refresh Action */}
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
              title="Refresh telemetry"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
              <span>Refresh</span>
            </button>

            {/* Export CSV / Report */}
            <button
              onClick={() => {
                const csvData =
                  'data:text/csv;charset=utf-8,ID,Timestamp,Category,RiskScore,Amount,Status\n' +
                  incidentLedger
                    .map((r) => `${r.id},${r.timestamp},"${r.category}",${r.riskScore},"${r.preventedAmount}",${r.status}`)
                    .join('\n');
                const encodedUri = encodeURI(csvData);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', `Vigilen_Risk_Report_${new Date().toISOString().slice(0, 10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Dataset</span>
            </button>
          </div>
        </div>

        {/* Global Slicers & Filter Controls Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Time Horizon Slicers */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
              {(['24h', '7d', '30d', '90d', 'ytd'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeHorizon(r)}
                  className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                    timeHorizon === r
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Region Slicer Dropdown */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="ALL">All Financial Regions</option>
              <option value="MH">Maharashtra (Mumbai)</option>
              <option value="KA">Karnataka (Bengaluru)</option>
              <option value="DL">Delhi-NCR</option>
              <option value="TS">Telangana (Hyderabad)</option>
              <option value="GJ">Gujarat (Ahmedabad)</option>
              <option value="INT">Cross-Border Mule Hubs</option>
            </select>

            {/* Threat Severity Slicer */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="ALL">All Risk Severities</option>
              <option value="CRITICAL">Critical Severity (85 - 100)</option>
              <option value="HIGH">High Severity (70 - 84)</option>
              <option value="MODERATE">Moderate Ambiguity (40 - 69)</option>
            </select>
          </div>

          {/* Quick Search & Filter Reset */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search instrument, syndicate, ID..."
                className="w-56 rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 shadow-xs focus:border-indigo-500 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {(selectedRegion !== 'ALL' || selectedCategory !== 'ALL' || selectedSeverity !== 'ALL' || searchQuery !== '') && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row 1: 5 Signature Vibrant Power BI KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Card 1: Total Threats Ingested */}
        <div className="relative overflow-hidden rounded-xl border border-blue-200/80 bg-white p-4.5 shadow-xs transition-all hover:shadow-md hover:border-blue-300">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{kpiData.totalIngested.label}</span>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-700 border border-blue-200">
              INGESTION
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono-numbers text-2xl font-black text-slate-900 tracking-tight">
              {kpiData.totalIngested.value}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              {kpiData.totalIngested.delta}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">{kpiData.totalIngested.subtext}</span>
            {/* Sparkline SVG */}
            <svg className="h-7 w-20 overflow-visible" viewBox="0 0 100 30">
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={kpiData.totalIngested.sparkline
                  .map((val, i) => `${i * 11},${30 - (val / 100) * 26}`)
                  .join(' ')}
              />
            </svg>
          </div>
        </div>

        {/* Card 2: High & Critical Threat Outliers */}
        <div className="relative overflow-hidden rounded-xl border border-rose-200/80 bg-white p-4.5 shadow-xs transition-all hover:shadow-md hover:border-rose-300">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-red-600" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{kpiData.flaggedThreats.label}</span>
            <span className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-700 border border-rose-200">
              FLAGGED
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono-numbers text-2xl font-black text-rose-600 tracking-tight">
              {kpiData.flaggedThreats.value}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
              <Flame className="h-3 w-3 mr-0.5 text-rose-500" />
              {kpiData.flaggedThreats.delta}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">{kpiData.flaggedThreats.subtext}</span>
            <svg className="h-7 w-20 overflow-visible" viewBox="0 0 100 30">
              <polyline
                fill="none"
                stroke="#e11d48"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={kpiData.flaggedThreats.sparkline
                  .map((val, i) => `${i * 11},${30 - (val / 60) * 26}`)
                  .join(' ')}
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Capital Loss Prevented */}
        <div className="relative overflow-hidden rounded-xl border border-emerald-200/80 bg-white p-4.5 shadow-xs transition-all hover:shadow-md hover:border-emerald-300">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{kpiData.lossPrevented.label}</span>
            <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700 border border-emerald-200">
              PROTECTED
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono-numbers text-2xl font-black text-emerald-600 tracking-tight">
              {kpiData.lossPrevented.value}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="h-3 w-3 mr-0.5" />
              {kpiData.lossPrevented.delta}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">{kpiData.lossPrevented.subtext}</span>
            <svg className="h-7 w-20 overflow-visible" viewBox="0 0 100 30">
              <polyline
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={kpiData.lossPrevented.sparkline
                  .map((val, i) => `${i * 11},${30 - (val / 130) * 26}`)
                  .join(' ')}
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Interception Precision */}
        <div className="relative overflow-hidden rounded-xl border border-purple-200/80 bg-white p-4.5 shadow-xs transition-all hover:shadow-md hover:border-purple-300">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{kpiData.interceptionRate.label}</span>
            <span className="rounded bg-purple-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-purple-700 border border-purple-200">
              PRECISION
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono-numbers text-2xl font-black text-purple-700 tracking-tight">
              {kpiData.interceptionRate.value}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
              <CheckCircle2 className="h-3 w-3 mr-0.5" />
              {kpiData.interceptionRate.delta}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">{kpiData.interceptionRate.subtext}</span>
            <svg className="h-7 w-20 overflow-visible" viewBox="0 0 100 30">
              <polyline
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={kpiData.interceptionRate.sparkline
                  .map((val, i) => `${i * 11},${30 - ((val - 90) / 10) * 26}`)
                  .join(' ')}
              />
            </svg>
          </div>
        </div>

        {/* Card 5: Mean Time to Intervene */}
        <div className="relative overflow-hidden rounded-xl border border-amber-200/80 bg-white p-4.5 shadow-xs transition-all hover:shadow-md hover:border-amber-300">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{kpiData.mtti.label}</span>
            <span className="rounded bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-700 border border-amber-200">
              SPEED
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono-numbers text-2xl font-black text-amber-700 tracking-tight">
              {kpiData.mtti.value}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              <Zap className="h-3 w-3 mr-0.5 text-amber-500" />
              {kpiData.mtti.delta}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">{kpiData.mtti.subtext}</span>
            <svg className="h-7 w-20 overflow-visible" viewBox="0 0 100 30">
              <polyline
                fill="none"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={kpiData.mtti.sparkline
                  .map((val, i) => `${i * 11},${(val / 70) * 26}`)
                  .join(' ')}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Row 2: Main Multi-Series Area & Bar Analytics Canvas (Power BI Style) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all">
        {/* Chart Header & Toggle Controls */}
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold text-slate-900">
                Temporal Trajectory & Interception Correlation
              </h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                8-Week Window
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluated communication volume vs autonomous risk containment with regulatory advisory triggers
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setActiveMetricTab('volume')}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                activeMetricTab === 'volume'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Signal Volume vs Flags
            </button>
            <button
              onClick={() => setActiveMetricTab('loss')}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                activeMetricTab === 'loss'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Capital Prevented (₹ Cr)
            </button>
            <button
              onClick={() => setActiveMetricTab('risk')}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                activeMetricTab === 'risk'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Average Risk Score
            </button>
          </div>
        </div>

        {/* Interactive SVG Chart Body */}
        <div className="relative pt-6">
          {/* Milestone Tag Callouts */}
          <div className="absolute top-2 left-1/3 flex items-center gap-1 rounded bg-amber-100/80 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300 shadow-xs">
            <AlertTriangle className="h-3 w-3 text-amber-600" />
            <span>W3: SEBI Public Cautionary Circular</span>
          </div>

          <div className="absolute top-2 right-1/4 flex items-center gap-1 rounded bg-rose-100/80 px-2 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-300 shadow-xs">
            <Flame className="h-3 w-3 text-rose-600" />
            <span>W5: Telegram VIP Syndicate Surge</span>
          </div>

          {/* Main Chart Graphic */}
          <div className="relative h-64 w-full">
            <svg
              className="h-full w-full overflow-visible"
              viewBox="0 0 800 240"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="indigoAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="emeraldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="roseBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              {[40, 90, 140, 190].map((y, idx) => (
                <line
                  key={idx}
                  x1="0"
                  y1={y}
                  x2="800"
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              ))}

              {/* Threshold line */}
              <line
                x1="0"
                y1="100"
                x2="800"
                y2="100"
                stroke="#94a3b8"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <text x="790" y="96" textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
                Baseline SLA Target
              </text>

              {/* Bars for Flagged Threats / Secondary Metric */}
              {timeSeriesData.map((d, i) => {
                const x = 50 + i * 100;
                const barHeight = (d.flagged / 1000) * 160;
                const y = 200 - barHeight;

                return (
                  <g key={i}>
                    <rect
                      x={x - 14}
                      y={y}
                      width="28"
                      height={barHeight}
                      rx="3"
                      fill="url(#roseBarGrad)"
                      className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      onMouseEnter={() => setHoveredTrendIdx(i)}
                      onMouseLeave={() => setHoveredTrendIdx(null)}
                    />
                  </g>
                );
              })}

              {/* Spline Area for Total Signal Volume or Loss */}
              {activeMetricTab !== 'risk' && (
                <>
                  <path
                    d={`M 50 ${200 - (timeSeriesData[0].volume / 35000) * 160} ` +
                      timeSeriesData
                        .slice(1)
                        .map((d, i) => `L ${50 + (i + 1) * 100} ${200 - (d.volume / 35000) * 160}`)
                        .join(' ') +
                      ` L 750 200 L 50 200 Z`}
                    fill={activeMetricTab === 'loss' ? 'url(#emeraldAreaGrad)' : 'url(#indigoAreaGrad)'}
                  />

                  {/* Main Line Stroke */}
                  <path
                    d={`M 50 ${200 - (timeSeriesData[0].volume / 35000) * 160} ` +
                      timeSeriesData
                        .slice(1)
                        .map((d, i) => `L ${50 + (i + 1) * 100} ${200 - (d.volume / 35000) * 160}`)
                        .join(' ')}
                    fill="none"
                    stroke={activeMetricTab === 'loss' ? '#059669' : '#4f46e5'}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Risk Score Line */}
              {activeMetricTab === 'risk' && (
                <path
                  d={`M 50 ${200 - (timeSeriesData[0].avgRisk / 100) * 170} ` +
                    timeSeriesData
                      .slice(1)
                      .map((d, i) => `L ${50 + (i + 1) * 100} ${200 - (d.avgRisk / 100) * 170}`)
                      .join(' ')}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              )}

              {/* Data points */}
              {timeSeriesData.map((d, i) => {
                const x = 50 + i * 100;
                const y =
                  activeMetricTab === 'risk'
                    ? 200 - (d.avgRisk / 100) * 170
                    : 200 - (d.volume / 35000) * 160;

                const isHovered = hoveredTrendIdx === i;

                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 7 : 4.5}
                      fill="#ffffff"
                      stroke={activeMetricTab === 'loss' ? '#059669' : '#4f46e5'}
                      strokeWidth="3"
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredTrendIdx(i)}
                      onMouseLeave={() => setHoveredTrendIdx(null)}
                    />
                    {isHovered && (
                      <circle cx={x} cy={y} r="12" fill="#4f46e5" fillOpacity="0.2" />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredTrendIdx !== null && (
              <div
                className="pointer-events-none absolute z-20 rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs"
                style={{
                  left: `${(hoveredTrendIdx / 7) * 80 + 5}%`,
                  top: '10px',
                }}
              >
                <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center justify-between gap-4">
                  <span>{timeSeriesData[hoveredTrendIdx].period} Telemetry Snapshot</span>
                  <span className="font-mono text-indigo-600 font-black">
                    Risk {timeSeriesData[hoveredTrendIdx].avgRisk}/100
                  </span>
                </div>
                <div className="mt-2 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Evaluated Signals:</span>
                    <span className="font-bold text-slate-800">
                      {timeSeriesData[hoveredTrendIdx].volume.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 text-rose-600">
                    <span>Flagged Threats:</span>
                    <span className="font-bold">
                      {timeSeriesData[hoveredTrendIdx].flagged.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 text-emerald-700">
                    <span>Loss Prevented:</span>
                    <span className="font-bold">
                      ₹{timeSeriesData[hoveredTrendIdx].lossPrevented} Cr
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-between border-t border-slate-200 pt-2 px-6 font-mono text-xs text-slate-500">
            {timeSeriesData.map((d, i) => (
              <span key={i} className="font-bold">
                {d.period}
              </span>
            ))}
          </div>

          {/* Chart Legend with Vibrant Badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 border-t border-slate-100 pt-3 text-xs font-semibold">
            <div className="flex items-center gap-2 text-indigo-700">
              <span className="h-3 w-3 rounded-full bg-indigo-600" />
              <span>Evaluated Signal Volume (Area Curve)</span>
            </div>
            <div className="flex items-center gap-2 text-rose-600">
              <span className="h-3 w-3 rounded-xs bg-rose-500" />
              <span>High-Risk Interventions (Stacked Bars)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="h-2 w-4 rounded-xs bg-emerald-500" />
              <span>Mitigated Exposure Trend (₹ Cr)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Split Grid — Interactive Donut Chart & Channel Decomposition */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Visual 1: Power BI Interactive Donut Chart for Scam Categories */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-indigo-600" />
                <h2 className="font-display text-base font-bold text-slate-900">
                  Threat Category Composition
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Breakdown of N = 9,480 verified financial solicitation threats
              </p>
            </div>
            <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-xs font-bold text-indigo-700">
              100% Normalized
            </span>
          </div>

          {/* Donut Graphic & Legend Side-by-Side */}
          <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            {/* SVG Donut */}
            <div className="relative flex h-52 w-52 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 200 200">
                {donutSlices.map((slice) => (
                  <path
                    key={slice.id}
                    d={slice.pathData}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth={slice.isHovered ? donutStrokeWidth + 4 : donutStrokeWidth}
                    strokeLinecap="round"
                    className="cursor-pointer transition-all duration-200 hover:opacity-90"
                    onMouseEnter={() => setHoveredDonutIndex(slice.index)}
                    onMouseLeave={() => setHoveredDonutIndex(null)}
                  />
                ))}
              </svg>

              {/* Center Metric */}
              <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
                {hoveredDonutIndex !== null ? (
                  <>
                    <span className="font-mono text-xl font-black text-slate-900">
                      {scamCategories[hoveredDonutIndex].pct}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      {scamCategories[hoveredDonutIndex].amount}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-mono text-xl font-black text-slate-900">9,480</span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      TOTAL CASES
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Vibrant Category Legend List */}
            <div className="flex-1 space-y-2.5 w-full">
              {scamCategories.map((cat, idx) => {
                const isHovered = hoveredDonutIndex === idx;
                return (
                  <div
                    key={cat.id}
                    onMouseEnter={() => setHoveredDonutIndex(idx)}
                    onMouseLeave={() => setHoveredDonutIndex(null)}
                    className={`cursor-pointer rounded-lg p-2 transition-all ${
                      isHovered ? 'bg-slate-100/90 scale-101 shadow-xs' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-semibold text-slate-800 line-clamp-1">{cat.label}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">{cat.pct}%</span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                          className="h-full rounded-full transition-all duration-300"
                        />
                      </div>
                      <span className="font-mono text-[10px] font-semibold text-slate-500">
                        {cat.count.toLocaleString()} cases · {cat.amount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Visual 2: Ingress Channel & Attack Vector Decomposition (Horizontal Bars) */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600" />
                <h2 className="font-display text-base font-bold text-slate-900">
                  Ingress Vector & Channel Containment
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Originating channel volumes and autonomous containment effectiveness
              </p>
            </div>
            <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-xs font-bold text-emerald-700">
              Avg 96.8% Intercept
            </span>
          </div>

          <div className="mt-4 space-y-3.5">
            {channelBreakdown.map((ch, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400">0{idx + 1}</span>
                    <span className="font-bold text-slate-800">{ch.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-500">{ch.volume.toLocaleString()} msgs</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.2 font-bold text-emerald-800">
                      {ch.interceptedPct}% blocked
                    </span>
                  </div>
                </div>

                {/* Progress Meter with Target Marker */}
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    style={{ width: `${(ch.volume / 45000) * 100}%` }}
                    className={`h-full ${ch.color} rounded-full transition-all duration-500`}
                  />
                  {/* SLA Target pin at 95% */}
                  <div className="absolute top-0 bottom-0 left-[95%] w-0.5 bg-slate-700/60 z-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Geographic Hotspots & Temporal Fraud Surge Heatmap */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Visual 1: Regional Risk Hotspots Table */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-600" />
                <h2 className="font-display text-base font-bold text-slate-900">
                  Geographic Risk Hotspots & Capital Exposure
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Regional syndication density across primary capital markets
              </p>
            </div>
            <Globe className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-4 space-y-2.5">
            {regionalData.map((reg) => (
              <div
                key={reg.code}
                onClick={() => setSelectedRegion(reg.code === selectedRegion ? 'ALL' : reg.code)}
                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                  selectedRegion === reg.code
                    ? 'border-indigo-500 bg-indigo-50/70 shadow-xs'
                    : 'border-slate-100 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-white px-2 py-0.5 font-mono text-[10px] font-black text-slate-800 border border-slate-200 shadow-2xs">
                      {reg.code}
                    </span>
                    <span className="font-bold text-slate-900">{reg.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-700">{reg.capital} prevented</span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                        reg.status === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {reg.riskScore}/100
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{reg.cases.toLocaleString()} Flagged Inquests</span>
                  <span className="font-mono text-emerald-600 font-semibold">{reg.trend} vs last cycle</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual 2: Temporal Fraud Surge Heatmap Matrix (7 Days x 6 Time Slots) */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <h2 className="font-display text-base font-bold text-slate-900">
                  Temporal Threat Surge Heatmap
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Concentration of coordinated syndicates by Day of Week & Trading Hours
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
              <span>Low</span>
              <span className="h-2 w-3 rounded-xs bg-sky-100" />
              <span className="h-2 w-3 rounded-xs bg-amber-300" />
              <span className="h-2 w-3 rounded-xs bg-rose-500" />
              <span>Critical</span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="mt-4">
            {/* Header Columns */}
            <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-[10px] font-bold text-slate-500">
              <div>Day</div>
              {timeSlots.map((slot) => (
                <div key={slot}>{slot}</div>
              ))}
            </div>

            {/* Day Rows */}
            <div className="mt-2 space-y-1.5">
              {daysOfWeek.map((day, dIdx) => (
                <div key={day} className="grid grid-cols-7 gap-1.5 items-center">
                  <span className="font-mono text-xs font-bold text-slate-700 text-center">
                    {day}
                  </span>
                  {timeSlots.map((slot, sIdx) => {
                    const val = heatmapMatrix[dIdx][sIdx];
                    let cellColor = 'bg-sky-50 text-slate-600 border border-slate-100';
                    if (val > 85) {
                      cellColor = 'bg-rose-500 text-white font-bold shadow-xs';
                    } else if (val > 65) {
                      cellColor = 'bg-amber-400 text-slate-900 font-bold';
                    } else if (val > 40) {
                      cellColor = 'bg-amber-100 text-amber-900 font-medium';
                    } else if (val > 20) {
                      cellColor = 'bg-sky-100 text-sky-900';
                    }

                    return (
                      <div
                        key={slot}
                        title={`${day} ${slot}: Incident Intensity ${val}/100`}
                        className={`flex h-8 items-center justify-center rounded-md font-mono text-[11px] transition-transform hover:scale-105 cursor-pointer ${cellColor}`}
                      >
                        {val}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footnote callout */}
            <div className="mt-4 rounded-lg bg-amber-50 p-2.5 text-[11px] text-amber-900 border border-amber-200">
              <span className="font-bold">Insight: </span>
              Heaviest syndication attacks coincide with pre-market opening (08:00 - 10:00 AM) and Sunday evening retail hype broadcasts.
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Top 8 Detected Fraud Indicators Pareto & Correlation Matrix */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-indigo-600" />
              <h2 className="font-display text-base font-bold text-slate-900">
                Top Detected Fraud Indicators Frequency & Correlation
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Occurrence frequency across evaluated communications and statistical correlation to verified scam outcomes
            </p>
          </div>
          <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-xs font-bold text-indigo-700">
            Pareto Ranked
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topIndicators.map((ind) => (
            <div
              key={ind.rank}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 transition-all hover:bg-white hover:shadow-xs hover:border-indigo-300"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-[10px] font-black text-indigo-800">
                  RANK 0{ind.rank}
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-700">
                  r = {ind.correlation}
                </span>
              </div>

              <p className="mt-2 text-xs font-bold text-slate-900 line-clamp-2 h-8">
                {ind.name}
              </p>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono font-semibold text-slate-800">
                    {ind.frequency.toLocaleString()} hits
                  </span>
                  <span className="font-mono font-bold text-indigo-600">{ind.pct}% of scams</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    style={{ width: `${ind.pct}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-rose-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 6: Interactive Drill-Down Telemetry Ledger Table (Power BI Grid) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-600" />
              <h2 className="font-display text-base font-bold text-slate-900">
                Real-Time Telemetry & Forensic Incident Ledger
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Live case feed with risk scores, quarantined capital, and enforcement routing status
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500">
            Showing <span className="font-bold text-slate-800">{filteredIncidents.length}</span> of{' '}
            <span className="font-bold text-slate-800">{incidentLedger.length}</span> recorded signals
          </div>
        </div>

        {/* Incident Grid */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Signal ID</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Target / Instrument</th>
                <th className="py-3 px-3">Channel / Vector</th>
                <th className="py-3 px-3 text-center">Risk Score</th>
                <th className="py-3 px-3 text-right">Prevented Loss</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredIncidents.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-slate-50/80 cursor-pointer"
                  onClick={() => setDrilldownIncident(row)}
                >
                  <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                    {row.id}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {row.timestamp}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900">{row.targetEntity}</span>
                    <span className="block text-[10px] text-slate-400">{row.location}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                      {row.channel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${
                        row.riskScore >= 90
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                      {row.riskScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-emerald-700">
                    {row.preventedAmount}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                        row.status === 'QUARANTINED'
                          ? 'bg-purple-100 text-purple-800'
                          : row.status === 'ESCALATED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDrilldownIncident(row);
                      }}
                      className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <span>Drilldown</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Drilldown Modal */}
      {drilldownIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
                <h3 className="font-display text-base font-bold text-slate-900">
                  Forensic Drilldown — {drilldownIncident.id}
                </h3>
              </div>
              <button
                onClick={() => setDrilldownIncident(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Composite Risk Score</span>
                  <p className="font-mono text-2xl font-black text-rose-600">
                    {drilldownIncident.riskScore} / 100
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Prevented Loss</span>
                  <p className="font-mono text-2xl font-black text-emerald-700">
                    {drilldownIncident.preventedAmount}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Target Entity:</span>
                  <span className="font-bold text-slate-900">{drilldownIncident.targetEntity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Detection Timestamp:</span>
                  <span className="font-mono text-slate-700">{drilldownIncident.timestamp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Channel / Vector:</span>
                  <span className="font-bold text-indigo-700">{drilldownIncident.channel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Regional Node:</span>
                  <span className="font-mono text-slate-700">{drilldownIncident.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Containment Action:</span>
                  <span className="font-bold text-purple-700">{drilldownIncident.status}</span>
                </div>
              </div>

              <div className="rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900 border border-indigo-200">
                <span className="font-bold">Intervention Note: </span>
                Autonomous escrow freeze triggered within 3.2 minutes of detection. Telemetry hash dispatched to SEBI / FIU-IND enforcement directory.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDrilldownIncident(null)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
