import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  Target,
  Layers,
  BookOpen,
  ArrowRight,
  Shield,
  GitBranch,
} from 'lucide-react';

interface ProjectModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModeModal: React.FC<ProjectModeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<'problem' | 'gap' | 'methodology' | 'future'>('problem');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-xs">
      <div className="flex h-[620px] w-full max-w-3xl flex-col rounded-lg border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                IFAME Research Documentation
              </h2>
              <p className="text-xs text-neutral-500">
                Introduction to Financial Markets & Economics (IFAME) Capstone Project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close project mode"
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-neutral-200 px-6 dark:border-neutral-800">
          <button
            onClick={() => setActiveSection('problem')}
            className={`border-b-2 py-2.5 px-3 text-xs font-medium transition-colors ${
              activeSection === 'problem'
                ? 'border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Problem & Objectives
          </button>
          <button
            onClick={() => setActiveSection('gap')}
            className={`border-b-2 py-2.5 px-3 text-xs font-medium transition-colors ${
              activeSection === 'gap'
                ? 'border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Research Gap & Proposed Framework
          </button>
          <button
            onClick={() => setActiveSection('methodology')}
            className={`border-b-2 py-2.5 px-3 text-xs font-medium transition-colors ${
              activeSection === 'methodology'
                ? 'border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Methodology & Datasets
          </button>
          <button
            onClick={() => setActiveSection('future')}
            className={`border-b-2 py-2.5 px-3 text-xs font-medium transition-colors ${
              activeSection === 'future'
                ? 'border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Limitations & Future Scope
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-4">
          {/* SECTION 1: PROBLEM STATEMENT & OBJECTIVES */}
          {activeSection === 'problem' && (
            <div className="space-y-4">
              <div className="rounded-md border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  The Core Research Problem
                </span>
                <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  "How can retail investors be protected from fake stock-market investment advice and social-media scams, while detecting suspicious financial transactions early and reducing potential financial losses?"
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider dark:text-neutral-100">
                  Formal Research Objectives (IFAME)
                </h3>
                <ol className="mt-2 space-y-2 list-decimal pl-4">
                  <li>
                    <strong>Detect Fraudulent Advice:</strong> Identify deceptive equity advice, guaranteed return claims, and social media investment lures using Natural Language Processing (NLP).
                  </li>
                  <li>
                    <strong>Behavioral Anomaly Surveillance:</strong> Identify anomalous financial transactions and mule-account outflows using machine learning and behavioral baseline deviation metrics.
                  </li>
                  <li>
                    <strong>Explainable Risk Architecture:</strong> Formulate transparent, interpretable risk scoring (SHAP feature attribution) rather than opaque black-box classifications.
                  </li>
                  <li>
                    <strong>Unified Multi-Signal Fusion:</strong> Connect content risk, investor susceptibility, and transaction deviations into a unified prototype index.
                  </li>
                  <li>
                    <strong>Rigorous Evaluation:</strong> Benchmark ensemble models against baseline logistic regression and tree ensembles using accuracy, precision, recall, F1, and ROC-AUC.
                  </li>
                  <li>
                    <strong>Ethical & Privacy Safeguards:</strong> Incorporate strict data minimization, zero-credential storage policies, and non-absolutist legal phrasing.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* SECTION 2: RESEARCH GAP */}
          {activeSection === 'gap' && (
            <div className="space-y-4">
              <div className="rounded-md border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Identified Research Gap in Financial Risk Literature
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                  Contemporary financial security platforms are siloed: content moderation tools operate strictly at the social platform layer without visibility into capital outflows, while core banking fraud engines evaluate transaction metadata without semantic context regarding the deceptive solicitations that instigated the transfer.
                </p>
              </div>

              <div className="rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  VIGILEN Conceptual Fusion Framework
                </span>
                <div className="mt-3 font-mono text-xs rounded bg-neutral-100 p-3 dark:bg-neutral-900 space-y-1">
                  <p>Social-Media & Investment Content Risk (NLP / Claims)</p>
                  <p className="text-neutral-400">+ Investor Susceptibility Profile (Diagnostic Assessment)</p>
                  <p className="text-neutral-400">+ Transaction Anomaly & Behavioral Deviation (XGBoost / Isolation Forest)</p>
                  <p className="text-neutral-400">+ Explainable AI (SHAP Tree Attribution)</p>
                  <div className="pt-2 border-t border-neutral-300 dark:border-neutral-700 font-bold text-emerald-600 dark:text-emerald-400">
                    = UNIFIED RETAIL INVESTOR PROTECTION & EARLY FRAUD PREVENTION
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-neutral-500">
                  Clearly labeled as this project's proposed research framework rather than an established industry standard.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: METHODOLOGY & DATASETS */}
          {activeSection === 'methodology' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Research Datasets
                </h3>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded border border-neutral-200 p-3 dark:border-neutral-800">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">SSIC-2025 Corpus</span>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      12,450 annotated messages from Telegram, WhatsApp, Twitter, and YouTube finance comments across Indian market contexts.
                    </p>
                  </div>
                  <div className="rounded border border-neutral-200 p-3 dark:border-neutral-800">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">TAB-48K Transaction Log</span>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      48,200 synthetic retail UPI and IMPS transactions modeling normal banking habits and anomalous investment outflow spikes.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Model Architectures Evaluated
                </h3>
                <p className="mt-1 text-xs">
                  We evaluated 7 machine-learning models: Logistic Regression baseline, Random Forest, XGBoost, LightGBM, Isolation Forest for unsupervised anomaly detection, TF-IDF + Logistic Regression NLP baseline, and the Proposed VIGILEN Multimodal Ensemble (achieving 0.978 ROC-AUC).
                </p>
              </div>
            </div>
          )}

          {/* SECTION 4: LIMITATIONS & FUTURE SCOPE */}
          {activeSection === 'future' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Current Prototype Limitations
                </h3>
                <ul className="mt-2 space-y-1.5 list-disc pl-4 text-xs">
                  <li>Evaluation currently relies on curated synthetic transaction benchmarks due to banking privacy regulations.</li>
                  <li>NLP heuristics currently prioritize English and Romanized Hindi (Hinglish); regional Indian dialects require expanded corpus expansion.</li>
                  <li>Prototype operates via API evaluation rather than live in-line banking core hooks.</li>
                </ul>
              </div>

              <div className="rounded-md border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Future Extensibility Roadmap
                </h3>
                <ul className="mt-2 space-y-1 list-disc pl-4 text-[11px] text-neutral-600 dark:text-neutral-400">
                  <li>Real-time automated social-media channel crawlers & sentiment scrapers</li>
                  <li>Multilingual scam detection across 12 Indian official languages</li>
                  <li>Voice-call & deepfake audio analysis for AI impersonation scams</li>
                  <li>Graph Neural Networks (GNNs) for mule account network clustering</li>
                  <li>Federated learning preserving cross-bank privacy without centralized data exposure</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-3 dark:border-neutral-800">
          <span className="text-[11px] font-mono text-neutral-400">
            IFAME 2025-2026 Academic Submission
          </span>
          <button
            onClick={onClose}
            className="rounded-md bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
