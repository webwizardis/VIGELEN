import React, { useState } from 'react';
import {
  ShieldCheck,
  Compass,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  Shield,
  Layers,
  FileCheck,
  Users,
  PieChart,
} from 'lucide-react';
import { INVESTOR_ASSESSMENT_QUESTIONS, SCAM_JOURNEY_STAGES } from '../../data/mockData';
import { InvestorProfileResult } from '../../types';
import { SEBI_DEMOGRAPHIC_METRICS } from '../../data/cleanedIntelligence';

interface InvestorProtectionViewProps {
  onApplyToUnifiedRisk?: (score: number) => void;
  onNavigateToScamDetector?: () => void;
  onNavigateToTransactionSecurity?: () => void;
}

export const InvestorProtectionView: React.FC<InvestorProtectionViewProps> = ({
  onApplyToUnifiedRisk,
  onNavigateToScamDetector,
  onNavigateToTransactionSecurity,
}) => {
  const [activeTab, setActiveTab] = useState<'assessment' | 'journey' | 'sebi-demographics'>('assessment');
  const [selectedCohort, setSelectedCohort] = useState<'Silver Gen' | 'Millennials' | 'Gen Z' | 'Gen X'>('Silver Gen');

  // Assessment Question Answers: key = questionId, value = optionIndex
  const [answers, setAnswers] = useState<Record<string, number>>({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
    q6: 0,
  });

  // Calculate assessment profile
  const totalRiskPoints = Object.entries(answers).reduce((acc, [qId, optIdx]) => {
    const q = INVESTOR_ASSESSMENT_QUESTIONS.find((item) => item.id === qId);
    if (!q || q.options[optIdx] === undefined) return acc;
    return acc + q.options[optIdx].riskPoints;
  }, 0);

  // Maximum points = 30 + 25 + 25 + 35 + 25 + 20 = 160
  const normalizedScore = Math.min(100, Math.round((totalRiskPoints / 160) * 100));

  let profile: InvestorProfileResult;
  if (normalizedScore >= 60) {
    profile = {
      score: normalizedScore,
      profileLevel: 'HIGH_RISK',
      title: 'High Vulnerability Exposure',
      description:
        'Diagnostic answers indicate elevated susceptibility to prevalent social media fraud, guaranteed return schemes, or unregistered entity solicitation.',
      vulnerabilityFactors: [
        'Guaranteed return offers violating statutory securities regulations',
        'Directives to transfer capital to personal or unverified peer accounts',
        'High-pressure artificial urgency preventing deliberate due diligence',
      ],
      safeActions: [
        'Immediately halt any pending bank transfers or UPI payments.',
        'Cross-verify the entity registration number on the official SEBI SCORES portal (scores.gov.in).',
        'Verify that the recipient bank account PAN matches a registered corporate brokerage, not an individual.',
        'Report unauthorized solicitations to National Cyber Crime helpline 1930.',
      ],
    };
  } else if (normalizedScore >= 30) {
    profile = {
      score: normalizedScore,
      profileLevel: 'MODERATE_RISK',
      title: 'Moderate Caution Recommended',
      description:
        'Select vulnerability indicators detected. Exercise structured verification prior to committing financial assets.',
      vulnerabilityFactors: [
        'Informal recommendations from social media or video platforms',
        'Incomplete statutory documentation or absence of formal prospectus',
      ],
      safeActions: [
        'Demand formal Key Information Memorandum (KIM) and fee breakdown before payment.',
        'Ensure all recommendations include past-performance risk disclaimers.',
        'Use regulated demat transfer accounts rather than third-party portals.',
      ],
    };
  } else {
    profile = {
      score: normalizedScore,
      profileLevel: 'LOW_RISK',
      title: 'Prudent Investor Profile',
      description:
        'High compliance with standard investor protection checks. Continual diligence recommended for complex instruments.',
      vulnerabilityFactors: ['Market systemic volatility applies to all genuine investments.'],
      safeActions: [
        'Maintain independent diversified asset allocation.',
        'Verify periodic CDSL/NSDL consolidated account statements.',
      ],
    };
  }

  // Journey Simulator State
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const currentStage = SCAM_JOURNEY_STAGES[currentStageIdx];

  return (
    <div className="space-y-12 max-w-5xl">
      {/* Editorial Header */}
      <div className="section-header">
        <div className="mono text-[#2563eb] mb-3">
          — Retail Investor Protection & Vulnerability Profiling
        </div>

        <h1 className="font-serif text-[2.8rem] sm:text-[3.6rem] font-semibold text-[#1a1a1a] leading-none tracking-tight mb-4">
          Investor Risk Profile & Safeguards
        </h1>

        <p className="text-sm sm:text-base text-[#71717a] leading-relaxed max-w-3xl">
          Empirical vulnerability diagnostics, SEBI 2025 demographic benchmarks, and chronological simulation of high-yield investment scam lifecycles.
        </p>

        {/* Subtab Segmented Navigation Buttons */}
        <div className="flex flex-wrap gap-2 pt-6 border-b border-[#e4e4e7]">
          <button
            type="button"
            onClick={() => setActiveTab('assessment')}
            className={`px-4 py-2.5 mono text-xs uppercase tracking-wider font-bold transition-all border cursor-pointer ${
              activeTab === 'assessment'
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                : 'bg-white text-[#71717a] border-[#e4e4e7] hover:text-[#1a1a1a] hover:border-[#1a1a1a]'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>1. Risk Assessment</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('journey')}
            className={`px-4 py-2.5 mono text-xs uppercase tracking-wider font-bold transition-all border cursor-pointer ${
              activeTab === 'journey'
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                : 'bg-white text-[#71717a] border-[#e4e4e7] hover:text-[#1a1a1a] hover:border-[#1a1a1a]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Compass className="h-3.5 w-3.5" />
              <span>2. Scam Escalation Simulator</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sebi-demographics')}
            className={`px-4 py-2.5 mono text-xs uppercase tracking-wider font-bold transition-all border cursor-pointer ${
              activeTab === 'sebi-demographics'
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                : 'bg-white text-[#71717a] border-[#e4e4e7] hover:text-[#1a1a1a] hover:border-[#1a1a1a]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5" />
              <span>3. SEBI 2025 Demographics</span>
            </span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: INVESTOR RISK ASSESSMENT */}
      {activeTab === 'assessment' && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Assessment Form (7 Cols) */}
          <div className="space-y-6 lg:col-span-7">
            <div className="border border-[#e4e4e7] bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-4 mb-6">
                <div>
                  <div className="mono text-xs text-[#71717a] uppercase font-bold">Diagnostic Survey</div>
                  <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] mt-0.5">
                    Retail Vulnerability Index
                  </h2>
                </div>
                <span className="mono text-xs border border-[#1a1a1a] px-2 py-0.5 bg-[#fdfdfc] text-[#1a1a1a] font-bold">
                  6 Questions
                </span>
              </div>

              <div className="space-y-8">
                {INVESTOR_ASSESSMENT_QUESTIONS.map((q, qIndex) => (
                  <div key={q.id} className="space-y-3 border-b border-[#f4f4f5] pb-6 last:border-b-0 last:pb-0">
                    <div>
                      <span className="mono text-[10px] text-[#71717a] uppercase font-bold">
                        Question 0{qIndex + 1}
                      </span>
                      <p className="font-serif text-lg font-semibold text-[#1a1a1a] mt-0.5 leading-snug">
                        {q.question}
                      </p>
                      <p className="text-xs text-[#71717a] mt-1 leading-relaxed">
                        {q.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = answers[q.id] === optIdx;
                        return (
                          <label
                            key={optIdx}
                            className={`flex items-start gap-3 border p-3 text-xs cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#1a1a1a] bg-[#fdfdfc] shadow-xs text-[#1a1a1a] font-medium'
                                : 'border-[#e4e4e7] bg-white hover:border-[#1a1a1a] text-[#71717a]'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={isSelected}
                              onChange={() => setAnswers({ ...answers, [q.id]: optIdx })}
                              className="accent-[#1a1a1a] mt-0.5"
                            />
                            <div className="flex-1">
                              <span className={isSelected ? 'text-[#1a1a1a] font-semibold' : 'text-[#71717a]'}>
                                {opt.label}
                              </span>
                            </div>
                            <span className="mono text-[10px] text-[#71717a] shrink-0">
                              +{opt.riskPoints} pts
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assessment Result Card (5 Cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="border border-[#1a1a1a] bg-white p-6 sm:p-8 space-y-6 sticky top-20">
              <div className="border-b border-[#e4e4e7] pb-4">
                <span className="mono text-xs text-[#71717a] uppercase font-bold">Evaluation Outcome</span>
                <h3 className="font-serif text-2xl font-semibold text-[#1a1a1a] mt-0.5">
                  Calculated Risk Profile
                </h3>
              </div>

              {/* Big Score Display */}
              <div className="border border-[#e4e4e7] bg-[#fdfdfc] p-6 text-center space-y-3">
                <span className="mono text-[11px] text-[#71717a] uppercase font-bold tracking-wider">
                  Vulnerability Score
                </span>

                <div className="flex items-baseline justify-center gap-1.5">
                  <span
                    className={`font-serif text-6xl font-bold leading-none ${
                      profile.profileLevel === 'HIGH_RISK'
                        ? 'text-[#be123c]'
                        : profile.profileLevel === 'MODERATE_RISK'
                        ? 'text-[#ea580c]'
                        : 'text-[#10b981]'
                    }`}
                  >
                    {profile.score}
                  </span>
                  <span className="mono text-sm text-[#71717a]">/ 100</span>
                </div>

                <div className="h-2 w-full overflow-hidden border border-[#1a1a1a] bg-[#e4e4e7]">
                  <div
                    style={{ width: `${profile.score}%` }}
                    className={`h-full transition-all duration-300 ${
                      profile.profileLevel === 'HIGH_RISK'
                        ? 'bg-[#be123c]'
                        : profile.profileLevel === 'MODERATE_RISK'
                        ? 'bg-[#ea580c]'
                        : 'bg-[#10b981]'
                    }`}
                  />
                </div>

                <div className="pt-2">
                  <span
                    className={`status-pill ${
                      profile.profileLevel === 'HIGH_RISK'
                        ? 'text-[#be123c] border-[#be123c]'
                        : profile.profileLevel === 'MODERATE_RISK'
                        ? 'text-[#ea580c] border-[#ea580c]'
                        : 'text-[#10b981] border-[#10b981]'
                    }`}
                  >
                    {profile.title}
                  </span>
                </div>

                <p className="text-xs text-[#71717a] leading-relaxed pt-2">
                  {profile.description}
                </p>
              </div>

              {/* Vulnerability Factors */}
              <div>
                <h4 className="mono text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">
                  Key Vulnerability Factors
                </h4>
                <ul className="space-y-1.5 text-xs text-[#71717a]">
                  {profile.vulnerabilityFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#be123c] font-bold">·</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Safe Actions */}
              <div>
                <h4 className="mono text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">
                  Recommended Educational Actions
                </h4>
                <ul className="space-y-2 text-xs text-[#1a1a1a]">
                  {profile.safeActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 border-l-2 border-[#1a1a1a] pl-2.5 py-0.5">
                      <span className="text-xs leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Transfer to Unified Risk Model CTA */}
              {onApplyToUnifiedRisk && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onApplyToUnifiedRisk(normalizedScore)}
                    className="btn btn-primary w-full"
                  >
                    <span>Apply Score ({normalizedScore}/100) to Unified Model</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <p className="mono text-[10px] text-[#71717a] text-center mt-2">
                    Feeds directly into the composite 4-vector risk calculation
                  </p>
                </div>
              )}

              {/* Institutional Guardrail */}
              <div className="border border-[#e4e4e7] p-3 text-[11px] text-[#71717a] bg-[#fdfdfc] leading-relaxed">
                <span className="mono font-bold text-[#1a1a1a] block mb-0.5">
                  Statutory Disclaimer
                </span>
                VIGILEN diagnostics evaluate behavioural indicators against official SEBI and RBI fraud patterns. These do not constitute regulated investment advisory.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SCAM ESCALATION SIMULATOR */}
      {activeTab === 'journey' && (
        <div className="border border-[#1a1a1a] bg-white p-6 sm:p-8 space-y-8">
          <div>
            <span className="mono text-[#2563eb] text-xs font-bold uppercase">
              Chronological Simulator
            </span>
            <h2 className="font-serif text-3xl font-semibold text-[#1a1a1a] mt-1">
              How an Investment Scam Escalates
            </h2>
            <p className="text-xs sm:text-sm text-[#71717a] mt-1 max-w-2xl leading-relaxed">
              Step through the 7 typical chronological phases of high-yield social media schemes to understand psychological levers and defensive checkpoints.
            </p>
          </div>

          {/* Stepper Navigation */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7 border-y border-[#e4e4e7] py-4">
            {SCAM_JOURNEY_STAGES.map((stg, idx) => {
              const isCurrent = idx === currentStageIdx;
              const isPast = idx < currentStageIdx;
              return (
                <button
                  key={stg.step}
                  onClick={() => setCurrentStageIdx(idx)}
                  className={`flex flex-col items-start p-3 text-left transition-all border cursor-pointer ${
                    isCurrent
                      ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white shadow-xs'
                      : isPast
                      ? 'border-[#e4e4e7] bg-[#fdfdfc] text-[#1a1a1a] hover:border-[#1a1a1a]'
                      : 'border-transparent text-[#71717a] hover:bg-[#fdfdfc]'
                  }`}
                >
                  <span className="mono text-[10px] font-bold">
                    Phase 0{stg.step}
                  </span>
                  <span className="text-xs font-semibold truncate w-full mt-1">
                    {stg.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stage Details Card */}
          <div className="border border-[#e4e4e7] bg-[#fdfdfc] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col justify-between gap-3 border-b border-[#e4e4e7] pb-4 sm:flex-row sm:items-center">
              <div>
                <span className="mono text-xs text-[#71717a]">
                  Phase {currentStage.step} of 7 · Channel Vector: {currentStage.channel}
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#1a1a1a] mt-0.5">
                  {currentStage.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="status-pill text-[#be123c] border-[#be123c]">
                  Escalation Risk: {currentStage.riskScore}/100
                </span>
              </div>
            </div>

            {/* Three Pillar Breakdown */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Scammer Tactic */}
              <div className="border border-[#e4e4e7] bg-white p-5 flex flex-col justify-between">
                <div>
                  <span className="mono text-[10px] font-bold text-[#be123c] uppercase">
                    1. Scammer Strategy
                  </span>
                  <p className="mt-2 text-xs text-[#1a1a1a] leading-relaxed">
                    {currentStage.scammerTactic}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e4e4e7] mono text-[10px] text-[#71717a]">
                  <strong>Victim Vector:</strong> {currentStage.userPerspective}
                </div>
              </div>

              {/* Warning Signs */}
              <div className="border border-[#e4e4e7] bg-white p-5 flex flex-col justify-between">
                <div>
                  <span className="mono text-[10px] font-bold text-[#ea580c] uppercase">
                    2. Warning Signs
                  </span>
                  <ul className="mt-2 space-y-1.5 text-xs text-[#1a1a1a]">
                    {currentStage.warningSigns.map((sign, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#ea580c]">⚠</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e4e4e7] mono text-[10px] text-[#71717a]">
                  Pre-transfer psychological cues
                </div>
              </div>

              {/* Investor Verification Step */}
              <div className="border border-[#e4e4e7] bg-white p-5 flex flex-col justify-between">
                <div>
                  <span className="mono text-[10px] font-bold text-[#10b981] uppercase">
                    3. Verification Step
                  </span>
                  <p className="mt-2 text-xs text-[#1a1a1a] leading-relaxed">
                    {currentStage.investorVerificationStep}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e4e4e7] mono text-[10px] text-[#71717a]">
                  National Helpline: 1930 / scores.gov.in
                </div>
              </div>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-[#e4e4e7]">
              <button
                type="button"
                onClick={() => setCurrentStageIdx(Math.max(0, currentStageIdx - 1))}
                disabled={currentStageIdx === 0}
                className="btn btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Previous Phase</span>
              </button>

              <span className="mono text-xs text-[#71717a]">
                Phase {currentStageIdx + 1} of {SCAM_JOURNEY_STAGES.length}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentStageIdx(
                    Math.min(SCAM_JOURNEY_STAGES.length - 1, currentStageIdx + 1)
                  )
                }
                disabled={currentStageIdx === SCAM_JOURNEY_STAGES.length - 1}
                className="btn btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Next Phase</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SEBI 2025 DEMOGRAPHIC RISK BENCHMARKS */}
      {activeTab === 'sebi-demographics' && (
        <div className="space-y-8">
          {/* Top Metric Highlights */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-[#1a1a1a] bg-white p-5">
              <span className="mono text-[10px] text-[#71717a]">SEBI Record #4</span>
              <p className="font-serif text-xl font-semibold text-[#1a1a1a] mt-1">Silver Generation</p>
              <div className="mt-3 flex items-baseline gap-1.5 text-[#10b981]">
                <span className="font-serif text-4xl font-bold leading-none">85%</span>
                <span className="mono text-xs text-[#71717a]">capital safety</span>
              </div>
              <p className="text-xs text-[#71717a] mt-2 leading-normal">
                Seniors demand absolute capital preservation and are targeted via pension schemes.
              </p>
            </div>

            <div className="border border-[#e4e4e7] bg-white p-5">
              <span className="mono text-[10px] text-[#71717a]">SEBI Record #5</span>
              <p className="font-serif text-xl font-semibold text-[#1a1a1a] mt-1">Gender Risk Variance</p>
              <div className="mt-3 flex items-baseline gap-1.5 text-[#2563eb]">
                <span className="font-serif text-4xl font-bold leading-none">82% vs 78%</span>
              </div>
              <p className="text-xs text-[#71717a] mt-2 leading-normal">
                82% of female investors prefer low-risk instruments vs 78% of male investors.
              </p>
            </div>

            <div className="border border-[#e4e4e7] bg-white p-5">
              <span className="mono text-[10px] text-[#71717a]">SEBI Record #1</span>
              <p className="font-serif text-xl font-semibold text-[#1a1a1a] mt-1">Millennial Cohort</p>
              <div className="mt-3 flex items-baseline gap-1.5 text-[#1a1a1a]">
                <span className="font-serif text-4xl font-bold leading-none">11%</span>
                <span className="mono text-xs text-[#71717a]">market participation</span>
              </div>
              <p className="text-xs text-[#71717a] mt-2 leading-normal">
                Highest equity adoption rate across all demographics; targeted via Telegram options channels.
              </p>
            </div>

            <div className="border border-[#e4e4e7] bg-white p-5">
              <span className="mono text-[10px] text-[#71717a]">SEBI Record #3</span>
              <p className="font-serif text-xl font-semibold text-[#1a1a1a] mt-1">Gen Z Cohort</p>
              <div className="mt-3 flex items-baseline gap-1.5 text-[#71717a]">
                <span className="font-serif text-4xl font-bold leading-none">5%</span>
                <span className="mono text-xs text-[#71717a]">direct equities</span>
              </div>
              <p className="text-xs text-[#71717a] mt-2 leading-normal">
                Rapidly onboarding via discount brokers; vulnerable to unverified social influencers.
              </p>
            </div>
          </div>

          {/* Interactive Cohort Explorer */}
          <div className="border border-[#1a1a1a] bg-white p-6 sm:p-8 space-y-6">
            <div>
              <span className="mono text-[#2563eb] text-xs font-bold uppercase">
                Demographic Profiler
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#1a1a1a] mt-0.5">
                Cohort Susceptibility & Automated Rules
              </h3>
              <p className="text-xs sm:text-sm text-[#71717a] mt-1 leading-relaxed max-w-3xl">
                Select an investor demographic cohort to observe empirical securities participation rates, prevalent scam patterns, and automated VIGILEN interception rules.
              </p>
            </div>

            {/* Cohort Selector Buttons */}
            <div className="flex flex-wrap gap-2">
              {(['Silver Gen', 'Millennials', 'Gen Z', 'Gen X'] as const).map((cohort) => (
                <button
                  key={cohort}
                  type="button"
                  onClick={() => setSelectedCohort(cohort)}
                  className={`border px-4 py-2 text-xs mono font-bold uppercase transition-all cursor-pointer ${
                    selectedCohort === cohort
                      ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                      : 'border-[#e4e4e7] bg-white text-[#71717a] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                  }`}
                >
                  {cohort} {cohort === 'Silver Gen' ? '(Age 55+)' : cohort === 'Millennials' ? '(Age 28-43)' : cohort === 'Gen Z' ? '(Age 18-27)' : '(Age 44-54)'}
                </button>
              ))}
            </div>

            {/* Cohort Breakdown Card */}
            <div className="border border-[#e4e4e7] bg-[#fdfdfc] p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="mono text-[10px] text-[#71717a] uppercase font-bold">
                  Securities Participation
                </span>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-[#e4e4e7]">
                    <span className="text-[#71717a]">Overall Market:</span>
                    <span className="mono font-bold text-[#1a1a1a]">
                      {selectedCohort === 'Millennials' ? '11%' : selectedCohort === 'Gen Z' ? '9%' : selectedCohort === 'Gen X' ? '8%' : '6%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#e4e4e7]">
                    <span className="text-[#71717a]">Mutual Funds / ETFs:</span>
                    <span className="mono font-bold text-[#1a1a1a]">
                      {selectedCohort === 'Millennials' ? '8%' : selectedCohort === 'Gen Z' ? '6%' : selectedCohort === 'Gen X' ? '6%' : '4%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#71717a]">Direct Equities:</span>
                    <span className="mono font-bold text-[#1a1a1a]">
                      {selectedCohort === 'Millennials' ? '6%' : selectedCohort === 'Gen Z' ? '5%' : selectedCohort === 'Gen X' ? '4%' : '3%'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="mono text-[10px] text-[#71717a] uppercase font-bold">
                  Prevalent Threat Vector
                </span>
                <p className="mt-3 text-xs text-[#1a1a1a] leading-relaxed">
                  {selectedCohort === 'Silver Gen'
                    ? 'Senior citizens are predominantly targeted via fake PMS clones (e.g. Motilal/CRTrade clones), fake institutional quota IPOs, and unverified phone/WhatsApp advisors offering "safe guaranteed fixed pensions".'
                    : selectedCohort === 'Millennials'
                    ? 'Targeted by high-pressure Telegram options channels, algorithmic intraday bots, and pre-IPO discount links promising 40%+ weekly gains.'
                    : selectedCohort === 'Gen Z'
                    ? 'Targeted through social media influencers, Instagram trading courses, fake crypto staking bots, and unauthorized APK links.'
                    : 'Targeted via unregistered wealth management schemes, unlisted pre-IPO allotments, and tax-saving corporate bond clones.'}
                </p>
              </div>

              <div>
                <span className="mono text-[10px] text-[#71717a] uppercase font-bold">
                  VIGILEN Defensive Rule
                </span>
                <div className="mt-3 border border-[#1a1a1a] bg-white p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                    <span className="mono text-[11px] font-bold text-[#1a1a1a]">
                      {selectedCohort === 'Silver Gen'
                        ? 'Zero-Guaranteed-Return Mandate'
                        : selectedCohort === 'Millennials'
                        ? 'High-Velocity Outflow Intercept'
                        : 'Unregistered Handle Shield'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71717a] leading-relaxed">
                    {selectedCohort === 'Silver Gen'
                      ? 'Automatically triggers critical warning on any communication lacking statutory SEBI risk disclosures or demanding peer UPI transfers.'
                      : selectedCohort === 'Millennials'
                      ? 'Requires step-up authentication when transfer velocity exceeds 2x daily baseline to first-time beneficiaries.'
                      : 'Cross-checks social handles and Telegram URLs against the 270+ official NSE caution blacklist.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Official SEBI Survey Data Table */}
          <div className="border border-[#e4e4e7] bg-white p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
              <span className="mono text-xs font-bold text-[#1a1a1a] uppercase">
                Ground-Truth Dataset: SEBI Investor Survey 2025
              </span>
              <span className="mono text-[10px] text-[#71717a]">
                5 Ingested Benchmarks
              </span>
            </div>
            <div className="space-y-2">
              {SEBI_DEMOGRAPHIC_METRICS.map((metric) => (
                <div key={metric.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-[#e4e4e7] bg-[#fdfdfc] text-xs gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="mono text-[10px] border border-[#1a1a1a] px-2 py-0.5 bg-white font-bold text-[#1a1a1a]">
                      {metric.id}
                    </span>
                    <span className="font-serif font-bold text-base text-[#1a1a1a]">
                      {metric.rawEntity}
                    </span>
                  </div>
                  <div className="mono text-[11px] bg-white px-3 py-1.5 border border-[#e4e4e7] text-[#1a1a1a]">
                    {metric.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
