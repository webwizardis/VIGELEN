import React, { useState } from 'react';
import { Settings, Shield, Bell, Lock, Database, Sliders, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [sensitivity, setSensitivity] = useState<'Standard' | 'Elevated' | 'Aggressive'>('Elevated');
  const [autoFlagUrgent, setAutoFlagUrgent] = useState(true);
  const [notifyOnHighRisk, setNotifyOnHighRisk] = useState(true);
  const [inMemoryOnly, setInMemoryOnly] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-wider">
            System
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">Configuration</span>
        </div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
          Configure risk scoring thresholds, analysis sensitivity parameters, and privacy defaults.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        {/* Risk Analysis Sensitivity */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Risk Scoring Calibration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Controls heuristic sensitivity when flagging investment language and transaction deviations.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(['Standard', 'Elevated', 'Aggressive'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSensitivity(lvl)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  sensitivity === lvl
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{lvl}</span>
                  {sensitivity === lvl && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                </div>
                <p className="mt-1 text-[11px] text-slate-600">
                  {lvl === 'Standard'
                    ? 'Flags clear violations and prominent guarantee phrases.'
                    : lvl === 'Elevated'
                    ? 'Recommended. Sensitive to subtle FOMO, unverified links, and outflow outliers.'
                    : 'Maximum caution. Flags any unregistered advisory reference.'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Automated Rules & Notifications
          </h2>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900">
                Auto-generate Case for Critical Risk Items
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Automatically instantiate an investigation dossier when score exceeds 85/100.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoFlagUrgent}
              onChange={(e) => setAutoFlagUrgent(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900">
                High-Risk Alert Drawer Notifications
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Send realtime notification badge when an evaluation identifies suspicious VPA handles.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyOnHighRisk}
              onChange={(e) => setNotifyOnHighRisk(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900">
                In-Memory Ephemeral Analysis Mode
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Never persist raw text or screenshot pixels to remote storage; discard after scoring.
              </p>
            </div>
            <input
              type="checkbox"
              checked={inMemoryOnly}
              onChange={(e) => setInMemoryOnly(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
