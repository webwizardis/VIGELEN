import React, { useState } from 'react';
import {
  BookOpen,
  Shield,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Building2,
  Scale,
  PhoneCall,
  Search,
} from 'lucide-react';
import { DOCUMENTED_CASE_STUDIES } from '../../data/mockData';
import { ScamCaseStudy } from '../../types';

export const CaseStudiesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cases' | 'safety'>('cases');
  const [selectedCase, setSelectedCase] = useState<ScamCaseStudy>(DOCUMENTED_CASE_STUDIES[0]);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">
          Case Studies & Regulatory Safety Center
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Documented regulatory enforcement precedents and statutory investor verification protocols.
        </p>
      </div>

      {/* Segmented Subtabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg dark:bg-neutral-900">
          <button
            onClick={() => setActiveTab('cases')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'cases'
                ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Documented Scam Case Studies</span>
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'safety'
                ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Official Regulatory Verification Directory</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CASE STUDIES */}
      {activeTab === 'cases' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Case Studies List (1 Col) */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Enforcement Orders & Precedents
            </h2>
            <div className="space-y-2">
              {DOCUMENTED_CASE_STUDIES.map((cs) => {
                const isSelected = selectedCase.id === cs.id;
                return (
                  <div
                    key={cs.id}
                    onClick={() => setSelectedCase(cs)}
                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-50 dark:border-neutral-100 dark:bg-neutral-800'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-mono">{cs.year}</span>
                      <span>{cs.location}</span>
                    </div>
                    <h3 className="mt-1 text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {cs.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-neutral-500 line-clamp-2">
                      {cs.scamMechanism}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Case Deep Dive (2 Cols) */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-lg border border-neutral-200 bg-white p-6 space-y-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="border-b border-neutral-100 pb-4 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="font-mono">{selectedCase.year}</span>
                  <span>·</span>
                  <span>{selectedCase.location}</span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Verified Regulatory Source
                  </span>
                </div>
                <h2 className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-50">
                  {selectedCase.title}
                </h2>
                <p className="mt-1 font-mono text-[11px] text-neutral-400">
                  Citation: {selectedCase.officialSourceCitation}
                </p>
              </div>

              {/* Financial Impact & Vulnerability */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-neutral-100 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-950">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                    Documented Financial Loss
                  </span>
                  <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                    {selectedCase.financialImpact}
                  </p>
                </div>

                <div className="rounded-md border border-neutral-100 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-950">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                    Exploited Vulnerability
                  </span>
                  <p className="mt-1 text-xs text-neutral-700 dark:text-neutral-300">
                    {selectedCase.victimVulnerability}
                  </p>
                </div>
              </div>

              {/* Mechanism */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Modus Operandi / Scam Mechanism
                </h3>
                <p className="mt-1.5 text-xs text-neutral-700 leading-relaxed dark:text-neutral-300">
                  {selectedCase.scamMechanism}
                </p>
              </div>

              {/* Warning Indicators */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Documented Warning Indicators
                </h3>
                <ul className="mt-2 space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                  {selectedCase.warningIndicators.map((ind, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500">⚠</span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Regulatory Response */}
              <div className="rounded-md border border-neutral-100 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-950">
                <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Regulatory & Legal Enforcement
                </h3>
                <p className="mt-1 text-xs text-neutral-700 leading-relaxed dark:text-neutral-300">
                  {selectedCase.regulatoryResponse}
                </p>
              </div>

              {/* Lessons Learned */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Lessons for Retail Investor Protection
                </h3>
                <ul className="mt-2 space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                  {selectedCase.lessonsLearned.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OFFICIAL REGULATORY DIRECTORY */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 space-y-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                Official Regulatory Verification Directories (India & Global)
              </h2>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Direct statutory portals for cross-checking financial market intermediaries and reporting unauthorized transactions.
              </p>
            </div>

            {/* Official Resources Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* SEBI SCORES */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                    SEBI SCORES
                  </span>
                  <Building2 className="h-4 w-4 text-neutral-500" />
                </div>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                  Securities and Exchange Board of India complaints redress system & Intermediary Registry search.
                </p>
                <div className="mt-3 text-[11px] font-mono text-neutral-500">
                  Portal: scores.gov.in
                </div>
              </div>

              {/* RBI Sachet */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                    RBI Sachet Portal
                  </span>
                  <Scale className="h-4 w-4 text-neutral-500" />
                </div>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                  Reserve Bank of India portal for tracking unregistered deposit-taking entities and illegal lending apps.
                </p>
                <div className="mt-3 text-[11px] font-mono text-neutral-500">
                  Portal: sachet.rbi.org.in
                </div>
              </div>

              {/* Cybercrime Helpline 1930 */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                    National Cyber Crime 1930
                  </span>
                  <PhoneCall className="h-4 w-4 text-red-500" />
                </div>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                  Immediate 24x7 financial fraud helpline to freeze fraudulent transactions and mule accounts.
                </p>
                <div className="mt-3 text-[11px] font-mono text-neutral-500">
                  Helpline: Dial 1930 / cybercrime.gov.in
                </div>
              </div>
            </div>

            {/* Investor Safety Verification Checklist */}
            <div className="rounded-md border border-neutral-100 bg-neutral-50 p-5 space-y-3 dark:border-neutral-800 dark:bg-neutral-950">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Four-Point Investor Verification Protocol:
              </h3>
              <ol className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300 list-decimal pl-4">
                <li>
                  <strong>Verify Registration ID:</strong> Request the official registration number (e.g. INH... for Research Analyst, INA... for Investment Adviser) and verify it directly on the regulator’s master directory.
                </li>
                <li>
                  <strong>Escrow Account Check:</strong> Confirm that payments are directed exclusively to the licensed corporate name, never an individual person or personal UPI handle.
                </li>
                <li>
                  <strong>Reject Guaranteed Returns:</strong> Under securities regulations, no registered market intermediary is permitted to guarantee fixed percentage profits on equities or derivatives.
                </li>
                <li>
                  <strong>Check Official ASBA for IPOs:</strong> Never transfer funds to third-party accounts for IPO shares. Applications must occur through official ASBA mechanisms in your banking app.
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
