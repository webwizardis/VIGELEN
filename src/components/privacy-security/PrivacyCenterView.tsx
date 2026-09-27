import React from 'react';
import {
  Lock,
  ShieldAlert,
  KeyRound,
  FileLock2,
  EyeOff,
  Server,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export const PrivacyCenterView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">
          Privacy, Ethics & Data Minimization Center
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Academic data governance architecture, zero-credential storage guarantees, and ethical AI safeguards.
        </p>
      </div>

      {/* Mandatory High-Visibility Warning Banner */}
      <div className="rounded-lg border-2 border-amber-500/40 bg-amber-50/70 p-5 dark:border-amber-500/30 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Security Notice for Evaluators
            </h2>
            <p className="mt-1 text-xs text-amber-800 leading-relaxed dark:text-amber-300">
              VIGILEN is an academic research platform. <strong>NEVER</strong> enter real banking passwords, OTPs, UPI PINs, Card PINs, CVV codes, or net banking authentication credentials into this application. All analyses evaluate linguistic solicitations and synthetic transactional records.
            </p>
          </div>
        </div>
      </div>

      {/* 8-Pillar Security & Privacy Architecture */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Data Minimization */}
        <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-2 dark:border-neutral-800 dark:bg-neutral-900">
          <EyeOff className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
          <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            Data Minimization
          </h3>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Only text fragments, OCR extractions, and anonymized numerical transaction vectors are ingested. Zero PII storage.
          </p>
        </div>

        {/* Transport Encryption */}
        <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-2 dark:border-neutral-800 dark:bg-neutral-900">
          <FileLock2 className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
          <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            Transport Encryption
          </h3>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            All API payloads transit over TLS 1.3 with strict HTTPS transport security headers and sanitized payloads.
          </p>
        </div>

        {/* Transient In-Memory Processing */}
        <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-2 dark:border-neutral-800 dark:bg-neutral-900">
          <Server className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
          <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            Zero Persistent Credential Storage
          </h3>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Evaluated messages and transactions are processed in ephemeral memory sessions without permanent credential caching.
          </p>
        </div>

        {/* Ethical AI & Fair Scoring */}
        <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-2 dark:border-neutral-800 dark:bg-neutral-900">
          <UserCheck className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
          <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            Non-Absolutist Phrasing
          </h3>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Outputs use probabilistic classifications ("Potentially suspicious") to prevent unjustified defamation or false certainty.
          </p>
        </div>
      </div>

      {/* Sensitive Data Handling Policy */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 space-y-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Prohibited Data Intake Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-2.5 font-medium">Data Category</th>
                <th className="px-4 py-2.5 font-medium">System Intake Policy</th>
                <th className="px-4 py-2.5 font-medium">Mitigation Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              <tr>
                <td className="px-4 py-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  Passwords / PINs / OTPs
                </td>
                <td className="px-4 py-3 text-red-600 dark:text-red-400 font-medium">
                  Strictly Prohibited
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  Client input regex blocks submissions resembling 4-6 digit authentication secrets.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  Bank Account / PAN Numbers
                </td>
                <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-medium">
                  Masked / Tokenized
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  Sanitized before processing; replaced with synthetic entity tokens.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  Promotional Investment Messages
                </td>
                <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-medium">
                  Permitted for NLP Analysis
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  Evaluated for deceptive linguistic markers and statutory disclaimers.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
