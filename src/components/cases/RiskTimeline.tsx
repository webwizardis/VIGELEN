import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  FileText,
  Search,
  CreditCard,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { InvestigationCase, RiskProgressionEvent, RiskEventType } from '../../types';

interface RiskTimelineProps {
  caseData: InvestigationCase;
  onEventClick?: (event: RiskProgressionEvent) => void;
}

export const RiskTimeline: React.FC<RiskTimelineProps> = ({ caseData, onEventClick }) => {
  const events: RiskProgressionEvent[] = caseData.riskProgression || [];
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [activeFilter, setActiveFilter] = useState<'ALL' | RiskEventType>('ALL');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlaybackIndex, setCurrentPlaybackIndex] = useState<number>(0);

  // Sync selected event when caseData changes
  useEffect(() => {
    if (events.length > 0) {
      setSelectedEventId(events[0].id);
      setCurrentPlaybackIndex(0);
      setIsPlaying(false);
    }
  }, [caseData.id]);

  // Automated step-through simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && events.length > 0) {
      timer = setInterval(() => {
        setCurrentPlaybackIndex((prev) => {
          const next = prev + 1;
          if (next >= events.length) {
            setIsPlaying(false);
            return prev;
          }
          setSelectedEventId(events[next].id);
          return next;
        });
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, events.length]);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const filteredEvents = events.filter((e) => {
    if (activeFilter === 'ALL') return true;
    return e.eventType === activeFilter;
  });

  const getEventBadgeStyle = (type: RiskEventType) => {
    switch (type) {
      case 'CONTENT_ANALYSIS':
        return {
          icon: <FileText className="h-4 w-4" />,
          label: 'Content Analysis',
          badgeClass: 'bg-violet-100 text-violet-800 border-violet-200',
          dotClass: 'bg-violet-500 ring-violet-200',
          gradientClass: 'from-violet-500 to-indigo-600',
        };
      case 'CLAIM_DETECTION':
        return {
          icon: <Search className="h-4 w-4" />,
          label: 'Claim Detection',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          dotClass: 'bg-amber-500 ring-amber-200',
          gradientClass: 'from-amber-500 to-orange-600',
        };
      case 'TRANSACTION_ANALYSIS':
        return {
          icon: <CreditCard className="h-4 w-4" />,
          label: 'Transaction Analysis',
          badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
          dotClass: 'bg-sky-500 ring-sky-200',
          gradientClass: 'from-sky-500 to-blue-600',
        };
      case 'BEHAVIORAL_ANOMALY':
        return {
          icon: <Layers className="h-4 w-4" />,
          label: 'Behavioral Anomaly',
          badgeClass: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
          dotClass: 'bg-fuchsia-500 ring-fuchsia-200',
          gradientClass: 'from-fuchsia-500 to-pink-600',
        };
      case 'REGULATORY_VERIFICATION':
        return {
          icon: <ShieldCheck className="h-4 w-4" />,
          label: 'Regulatory Registry',
          badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
          dotClass: 'bg-teal-500 ring-teal-200',
          gradientClass: 'from-teal-500 to-emerald-600',
        };
      case 'ALERT_TRIGGERED':
      case 'INTERVENTION':
      default:
        return {
          icon: <ShieldAlert className="h-4 w-4" />,
          label: 'Intervention / Alert',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
          dotClass: 'bg-rose-500 ring-rose-200',
          gradientClass: 'from-rose-500 to-red-600',
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-rose-600';
    if (score >= 70) return 'text-orange-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-rose-500';
    if (score >= 70) return 'bg-orange-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  // Compute SVG chart coordinates
  const svgWidth = 840;
  const svgHeight = 160;
  const paddingX = 50;
  const paddingY = 25;

  const points = events.map((ev, index) => {
    const x =
      events.length > 1
        ? paddingX + (index / (events.length - 1)) * (svgWidth - 2 * paddingX)
        : svgWidth / 2;
    // Invert y: 100 risk is near top (paddingY), 0 risk is near bottom (svgHeight - paddingY)
    const y =
      svgHeight - paddingY - (ev.riskScore / 100) * (svgHeight - 2 * paddingY);
    return { ...ev, x, y };
  });

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    // Generate smooth cubic bezier curve
    const prev = points[i - 1];
    const cX1 = prev.x + (pt.x - prev.x) / 2;
    const cY1 = prev.y;
    const cX2 = prev.x + (pt.x - prev.x) / 2;
    const cY2 = pt.y;
    return `${acc} C ${cX1} ${cY1}, ${cX2} ${cY2}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${
          points[0].x
        } ${svgHeight - paddingY} Z`
      : '';

  const maxScore = Math.max(...events.map((e) => e.riskScore), 0);
  const startScore = events[0]?.riskScore || 0;
  const totalDelta = maxScore - startScore;

  return (
    <div className="space-y-6">
      {/* Visual Header / Summary Banner in Bright Light Mode */}
      <div className="rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-xs">
                <Sparkles className="h-3 w-3" />
                <span>Multi-Signal Event Timeline</span>
              </span>
              <span className="text-xs font-semibold text-indigo-700">
                {caseData.caseNumber}
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-xs text-neutral-600 font-medium">
                {caseData.entityName}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-neutral-900">
              Risk Progression & Signal Convergence
            </h2>
            <p className="mt-0.5 text-xs text-neutral-600 max-w-2xl">
              Chronological sequence demonstrating how initial content scans, quantitative claim extractions, and transactional anomalies compound into elevated threat scores.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-white/80 bg-white/90 px-3.5 py-2 shadow-xs">
              <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                Progression Delta
              </p>
              <p className="font-mono text-base font-bold text-rose-600">
                +{totalDelta} pts
              </p>
            </div>
            <div className="rounded-lg border border-white/80 bg-white/90 px-3.5 py-2 shadow-xs">
              <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                Peak Risk Score
              </p>
              <p className="font-mono text-base font-bold text-neutral-900">
                {maxScore} <span className="text-xs font-normal text-neutral-400">/100</span>
              </p>
            </div>
            <div className="rounded-lg border border-white/80 bg-white/90 px-3.5 py-2 shadow-xs">
              <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                Events Analyzed
              </p>
              <p className="font-mono text-base font-bold text-indigo-600">
                {events.length} Stages
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Risk Progression Chart (Visual Graph of Risk Over Time) */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col justify-between gap-3 border-b border-neutral-100 pb-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-neutral-900">
                Continuous Risk Progression Curve
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Click any node on the timeline curve to inspect evidence artifacts and attributed model decisions.
            </p>
          </div>

          {/* Simulation Controls (Play / Step) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (currentPlaybackIndex >= events.length - 1) {
                  setCurrentPlaybackIndex(0);
                  setSelectedEventId(events[0]?.id || '');
                }
                setIsPlaying(!isPlaying);
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors ${
                isPlaying
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isPlaying ? 'Pause Simulation' : 'Play Timeline'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentPlaybackIndex(0);
                if (events[0]) setSelectedEventId(events[0].id);
              }}
              title="Reset to initial stage"
              className="rounded-lg border border-neutral-200 bg-neutral-50 p-1.5 text-neutral-600 hover:bg-neutral-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* SVG Curve Container */}
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[650px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-44 overflow-visible select-none"
            >
              <defs>
                {/* Vibrant Gradient for Area Fill */}
                <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                </linearGradient>

                {/* Line Gradient */}
                <linearGradient id="riskLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="30%" stopColor="#8b5cf6" />
                  <stop offset="65%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>

              {/* Horizontal Reference Grid Lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={svgWidth - paddingX}
                y2={paddingY}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={paddingY + 3}
                textAnchor="end"
                className="text-[9px] fill-neutral-400 font-mono"
              >
                100
              </text>

              <line
                x1={paddingX}
                y1={svgHeight / 2}
                x2={svgWidth - paddingX}
                y2={svgHeight / 2}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={svgHeight / 2 + 3}
                textAnchor="end"
                className="text-[9px] fill-neutral-400 font-mono"
              >
                50
              </text>

              <line
                x1={paddingX}
                y1={svgHeight - paddingY}
                x2={svgWidth - paddingX}
                y2={svgHeight - paddingY}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={svgHeight - paddingY + 3}
                textAnchor="end"
                className="text-[9px] fill-neutral-400 font-mono"
              >
                0
              </text>

              {/* Area Under Curve */}
              {areaD && <path d={areaD} fill="url(#riskAreaGrad)" />}

              {/* Smooth Spline Curve */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#riskLineGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Interactive Node Points */}
              {points.map((pt) => {
                const isSelected = pt.id === selectedEventId;
                const { label } = getEventBadgeStyle(pt.eventType);

                return (
                  <g
                    key={pt.id}
                    onClick={() => {
                      setSelectedEventId(pt.id);
                      if (onEventClick) onEventClick(pt);
                    }}
                    className="cursor-pointer transition-transform duration-150 hover:scale-110"
                  >
                    {/* Active highlight pulse ring */}
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="14"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                        className="animate-ping opacity-60"
                      />
                    )}

                    {/* Outer circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? '9' : '6.5'}
                      fill="#ffffff"
                      stroke={
                        pt.riskScore >= 85
                          ? '#e11d48'
                          : pt.riskScore >= 70
                          ? '#ea580c'
                          : pt.riskScore >= 40
                          ? '#d97706'
                          : '#10b981'
                      }
                      strokeWidth={isSelected ? '3.5' : '2.5'}
                      className="shadow-md"
                    />

                    {/* Inner dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? '4' : '2.5'}
                      fill={
                        pt.riskScore >= 85
                          ? '#e11d48'
                          : pt.riskScore >= 70
                          ? '#ea580c'
                          : pt.riskScore >= 40
                          ? '#d97706'
                          : '#10b981'
                      }
                    />

                    {/* Node Score Label */}
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      className={`text-[11px] font-bold font-mono ${
                        isSelected ? 'fill-indigo-900 font-extrabold' : 'fill-neutral-700'
                      }`}
                    >
                      {pt.riskScore}
                    </text>

                    {/* Timestamp label underneath */}
                    <text
                      x={pt.x}
                      y={svgHeight - paddingY + 16}
                      textAnchor="middle"
                      className={`text-[10px] font-mono ${
                        isSelected ? 'fill-indigo-700 font-bold' : 'fill-neutral-500'
                      }`}
                    >
                      {pt.timeLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Step-by-Step Progress Track */}
        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-neutral-800">Timeline Phase:</span>
            <span>
              Step {events.findIndex((e) => e.id === selectedEventId) + 1} of {events.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const idx = events.findIndex((e) => e.id === selectedEventId);
                if (idx > 0) {
                  setSelectedEventId(events[idx - 1].id);
                  setCurrentPlaybackIndex(idx - 1);
                }
              }}
              disabled={events.findIndex((e) => e.id === selectedEventId) === 0}
              className="inline-flex items-center gap-1 rounded border border-neutral-200 bg-white px-2 py-1 text-[11px] font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-3 w-3" />
              <span>Previous Stage</span>
            </button>
            <button
              onClick={() => {
                const idx = events.findIndex((e) => e.id === selectedEventId);
                if (idx < events.length - 1) {
                  setSelectedEventId(events[idx + 1].id);
                  setCurrentPlaybackIndex(idx + 1);
                }
              }}
              disabled={events.findIndex((e) => e.id === selectedEventId) === events.length - 1}
              className="inline-flex items-center gap-1 rounded border border-neutral-200 bg-white px-2 py-1 text-[11px] font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
            >
              <span>Next Stage</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-xs font-semibold text-neutral-700">Filter Event Types:</span>
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'ALL'
                ? 'bg-neutral-900 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            All Events ({events.length})
          </button>
          <button
            onClick={() => setActiveFilter('CONTENT_ANALYSIS')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'CONTENT_ANALYSIS'
                ? 'bg-violet-600 text-white'
                : 'bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100'
            }`}
          >
            Content Analysis
          </button>
          <button
            onClick={() => setActiveFilter('CLAIM_DETECTION')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'CLAIM_DETECTION'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            Claim Detection
          </button>
          <button
            onClick={() => setActiveFilter('TRANSACTION_ANALYSIS')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'TRANSACTION_ANALYSIS'
                ? 'bg-sky-600 text-white'
                : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
            }`}
          >
            Transaction Analysis
          </button>
          <button
            onClick={() => setActiveFilter('BEHAVIORAL_ANOMALY')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'BEHAVIORAL_ANOMALY'
                ? 'bg-fuchsia-600 text-white'
                : 'bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200 hover:bg-fuchsia-100'
            }`}
          >
            Behavioral Check
          </button>
          <button
            onClick={() => setActiveFilter('REGULATORY_VERIFICATION')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'REGULATORY_VERIFICATION'
                ? 'bg-teal-600 text-white'
                : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
            }`}
          >
            Regulatory Verification
          </button>
        </div>
      </div>

      {/* Main Dual Grid: Sequence Event Cards (Left) & Active Event Deep-Dive (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sequence List (7 cols) */}
        <div className="space-y-3 lg:col-span-7">
          {filteredEvents.map((ev, idx) => {
            const isSelected = selectedEvent && selectedEvent.id === ev.id;
            const badge = getEventBadgeStyle(ev.eventType);

            return (
              <div
                key={ev.id}
                onClick={() => {
                  setSelectedEventId(ev.id);
                  if (onEventClick) onEventClick(ev);
                }}
                className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-500 bg-white ring-2 ring-indigo-200 shadow-md'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xs'
                }`}
              >
                {/* Event Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${badge.badgeClass}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                    <span className="font-mono text-xs text-neutral-400">
                      {ev.timestamp}
                    </span>
                  </div>

                  {/* Score Delta Pill */}
                  <div className="flex items-center gap-1.5 text-right">
                    <span
                      className={`font-mono text-xs font-bold ${
                        ev.deltaScore > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {ev.deltaScore > 0 ? `+${ev.deltaScore}` : ev.deltaScore} pts
                    </span>
                    <div className="rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-xs font-bold text-neutral-800">
                      {ev.riskScore}/100
                    </div>
                  </div>
                </div>

                {/* Event Title */}
                <h4 className="mt-2 text-sm font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                  {ev.title}
                </h4>

                <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                  {ev.description}
                </p>

                {/* Key Extracted Signals */}
                {ev.keySignals && ev.keySignals.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {ev.keySignals.map((signal, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center rounded-md bg-neutral-50 px-2 py-0.5 text-[10px] font-medium text-neutral-700 border border-neutral-200/80"
                      >
                        #{signal}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer metadata */}
                <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2 text-[11px] text-neutral-400">
                  <span>Engine: {ev.actor}</span>
                  <span className="font-medium text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    <span>Inspect Artifact</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Event Artifact Inspector (5 cols) */}
        <div className="lg:col-span-5">
          {selectedEvent ? (
            <div className="sticky top-20 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              <div className="border-b border-neutral-100 pb-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${
                      getEventBadgeStyle(selectedEvent.eventType).badgeClass
                    }`}
                  >
                    {getEventBadgeStyle(selectedEvent.eventType).icon}
                    <span>{getEventBadgeStyle(selectedEvent.eventType).label}</span>
                  </span>
                  <span className="font-mono text-xs font-semibold text-neutral-500">
                    {selectedEvent.timestamp}
                  </span>
                </div>

                <h3 className="mt-2 text-base font-bold text-neutral-900">
                  {selectedEvent.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Actor: <span className="font-medium text-neutral-800">{selectedEvent.actor}</span>
                </p>
              </div>

              {/* Risk Impact Meter */}
              <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-neutral-600">
                    Risk Assessment at this Node
                  </span>
                  <span className={`font-mono text-2xl font-extrabold ${getScoreColor(selectedEvent.riskScore)}`}>
                    {selectedEvent.riskScore}
                    <span className="text-xs font-normal text-neutral-400">/100</span>
                  </span>
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                  <div
                    style={{ width: `${selectedEvent.riskScore}%` }}
                    className={`h-full transition-all duration-300 ${getScoreBg(selectedEvent.riskScore)}`}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Delta Contribution:</span>
                  <span className="font-mono font-bold text-rose-600">
                    +{selectedEvent.deltaScore} points
                  </span>
                </div>
              </div>

              {/* Evidence Snippet Quotation */}
              {selectedEvent.evidenceSnippet && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Captured Raw Evidence Excerpt
                  </h4>
                  <div className="mt-1.5 rounded-lg border-l-4 border-indigo-500 bg-indigo-50/60 p-3 text-xs leading-relaxed font-mono text-neutral-800">
                    "{selectedEvent.evidenceSnippet}"
                  </div>
                </div>
              )}

              {/* Quantitative Metrics Grid */}
              {selectedEvent.metrics && selectedEvent.metrics.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Extracted Quantitative Parameters
                  </h4>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {selectedEvent.metrics.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="rounded-lg border border-neutral-100 bg-neutral-50 p-2.5"
                      >
                        <p className="text-[10px] uppercase font-semibold text-neutral-400">
                          {m.label}
                        </p>
                        <p className={`font-mono text-xs font-bold mt-0.5 ${m.color || 'text-neutral-900'}`}>
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status & Next Step */}
              {selectedEvent.statusLabel && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Audit Status: {selectedEvent.statusLabel}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-emerald-700">
                    Verified through automated heuristic rules and cross-referenced with institutional registries.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-xs text-neutral-400">
              Select an event from the timeline sequence to view extracted evidence details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
