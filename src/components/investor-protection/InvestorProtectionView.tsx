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
} from 'lucide-react';
import { INVESTOR_ASSESSMENT_QUESTIONS, SCAM_JOURNEY_STAGES } from '../../data/mockData';
import { InvestorProfileResult } from '../../types';

export const InvestorProtectionView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assessment' | 'journey'>('assessment');

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
        'The answers indicate acute susceptibility to prevalent social media fraud, guaranteed return schemes, or unregistered entity solicitation.',
      vulnerabilityFactors: [
        'Guaranteed return offers violating securities regulations',
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
        'Some vulnerability indicators detected. Exercise structured verification prior to committing financial assets.',
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
    <div className="space-y-6">
      {/* View Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Protect
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">Retail Profile</span>
        </div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Risk Profile & Educational Safeguards
        </h1>
        <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
          Diagnostic vulnerability evaluation and step-by-step interactive simulation of deceptive investment lifecycles.
        </p>

        {/* Segmented Subtabs */}
        <div className="mt-5 flex border-b border-slate-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('assessment')}
              className={`flex items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-bold transition-colors ${
                activeTab === 'assessment'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Investor Risk Assessment</span>
            </button>

            <button
              onClick={() => setActiveTab('journey')}
              className={`flex items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-bold transition-colors ${
                activeTab === 'journey'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Scam Escalation Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: INVESTOR RISK ASSESSMENT */}
      {activeTab === 'assessment' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Assessment Form (2 Cols) */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900">
                  Investor Safety Diagnostic
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  6 Questions
                </span>
              </div>

              <div className="mt-4 space-y-6">
                {INVESTOR_ASSESSMENT_QUESTIONS.map((q, qIndex) => (
                  <div key={q.id} className="space-y-2">
                    <p className="text-xs font-bold text-slate-900">
                      {qIndex + 1}. {q.question}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {q.description}
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = answers[q.id] === optIdx;
                        return (
                          <label
                            key={optIdx}
                            className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-xs cursor-pointer transition-all ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900 shadow-2xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={isSelected}
                              onChange={() =>
                                setAnswers({ ...answers, [q.id]: optIdx })
                              }
                              className="accent-indigo-600"
                            />
                            <span>{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assessment Result Card (1 Col) */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Investor Risk Profile
                </h3>
                <p className="text-xs text-neutral-500">
                  Calculated from diagnostic inputs
                </p>
              </div>

              <div className="rounded-md border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
                <span className="text-xs text-neutral-500">Vulnerability Score</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span
                    className={`font-mono-numbers text-3xl font-extrabold ${
                      profile.profileLevel === 'HIGH_RISK'
                        ? 'text-red-600 dark:text-red-400'
                        : profile.profileLevel === 'MODERATE_RISK'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {profile.score}
                  </span>
                  <span className="text-xs text-neutral-400">/ 100</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div
                    style={{ width: `${profile.score}%` }}
                    className={`h-full ${
                      profile.profileLevel === 'HIGH_RISK'
                        ? 'bg-red-500'
                        : profile.profileLevel === 'MODERATE_RISK'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <p className="mt-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {profile.title}
                </p>
                <p className="mt-1 text-[11px] text-neutral-500 leading-relaxed">
                  {profile.description}
                </p>
              </div>

              {/* Actionable Educational Recommendations */}
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Recommended Educational Actions:
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                  {profile.safeActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Institutional Non-Advisory Guardrail */}
              <div className="rounded border border-neutral-200 bg-neutral-50 p-3 text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Regulatory Guardrail Notice:
                </span>
                <p className="mt-0.5">
                  VIGILEN provides risk diagnostics, not personalized financial or investment advice. Consult a SEBI/RBI registered investment adviser for asset allocation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCAM JOURNEY SIMULATOR */}
      {activeTab === 'journey' && (
        <div className="rounded-lg border border-neutral-200 bg-white p-6 space-y-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Educational Simulation
            </span>
            <h2 className="mt-1 font-display text-xl font-bold text-neutral-900 dark:text-neutral-50">
              How an Investment Scam Can Escalate
            </h2>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Walk through the 7 typical escalation phases of high-yield social media and investment scams to identify early intervention checkpoints.
            </p>
          </div>

          {/* Stepper Navigation */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7 border-y border-neutral-100 py-3 dark:border-neutral-800">
            {SCAM_JOURNEY_STAGES.map((stg, idx) => {
              const isCurrent = idx === currentStageIdx;
              const isPast = idx < currentStageIdx;
              return (
                <button
                  key={stg.step}
                  onClick={() => setCurrentStageIdx(idx)}
                  className={`flex flex-col items-start p-2 rounded text-left transition-colors ${
                    isCurrent
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                      : isPast
                      ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                      : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                  }`}
                >
                  <span className="font-mono text-[10px] font-semibold">
                    Step 0{stg.step}
                  </span>
                  <span className="text-xs font-medium truncate w-full mt-0.5">
                    {stg.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stage Details Card */}
          <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-5 space-y-5 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex flex-col justify-between gap-2 border-b border-neutral-200/60 pb-3 sm:flex-row sm:items-center dark:border-neutral-800">
              <div>
                <span className="font-mono text-xs text-neutral-500">
                  Phase {currentStage.step} of 7 · Channel: {currentStage.channel}
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {currentStage.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Escalation Risk: {currentStage.riskScore}/100
                </span>
              </div>
            </div>

            {/* Three Pillar Breakdown */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Scammer Tactic */}
              <div className="rounded-md border border-neutral-200/60 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                  What the Scammer is Attempting
                </span>
                <p className="mt-2 text-xs text-neutral-700 leading-relaxed dark:text-neutral-300">
                  {currentStage.scammerTactic}
                </p>
                <div className="mt-3 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 dark:border-neutral-800">
                  <strong>Target Vector:</strong> {currentStage.userPerspective}
                </div>
              </div>

              {/* Warning Signs */}
              <div className="rounded-md border border-neutral-200/60 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  Potential Warning Signs
                </span>
                <ul className="mt-2 space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                  {currentStage.warningSigns.map((sign, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500">⚠</span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Investor Verification Step */}
              <div className="rounded-md border border-neutral-200/60 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  What the Investor Could Verify
                </span>
                <p className="mt-2 text-xs text-neutral-700 leading-relaxed dark:text-neutral-300">
                  {currentStage.investorVerificationStep}
                </p>
                <div className="mt-3 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 dark:border-neutral-800">
                  <strong>Recourse:</strong> Cybercrime 1930 / SEBI SCORES Portal
                </div>
              </div>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStageIdx(Math.max(0, currentStageIdx - 1))}
                disabled={currentStageIdx === 0}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Previous Stage</span>
              </button>

              <span className="font-mono text-xs text-neutral-400">
                {currentStageIdx + 1} / {SCAM_JOURNEY_STAGES.length}
              </span>

              <button
                onClick={() =>
                  setCurrentStageIdx(
                    Math.min(SCAM_JOURNEY_STAGES.length - 1, currentStageIdx + 1)
                  )
                }
                disabled={currentStageIdx === SCAM_JOURNEY_STAGES.length - 1}
                className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
              >
                <span>Next Stage</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
