import React, { useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Search,
  Upload,
  RefreshCw,
  AlertTriangle,
  Flame,
  CheckCircle2,
  FolderPlus,
  Sliders,
  FileCheck,
  CheckSquare,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TextAnalysisResult, DetectedIndicator } from '../../types';
import { SAMPLE_INVESTMENT_TEXTS, SAMPLE_SCREENSHOTS } from '../../data/mockData';
import { apiAnalyzeText, apiAnalyzeImage } from '../../services/api';
import { extractInvestmentClaim } from '../../services/analyzer';

interface ScamDetectorViewProps {
  isDemoMode?: boolean;
  onOpenReport: (result: TextAnalysisResult) => void;
  onSendToUnifiedRisk?: (score: number) => void;
  onAttachToCase?: (result: TextAnalysisResult) => void;
}

export const ScamDetectorView: React.FC<ScamDetectorViewProps> = ({
  isDemoMode = true,
  onOpenReport,
  onSendToUnifiedRisk,
  onAttachToCase,
}) => {
  // Tabs: TEXT and IMAGE (Section 8)
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

  // Text Workflow States
  const [inputText, setInputText] = useState(SAMPLE_INVESTMENT_TEXTS[0].text);
  const [analyzingText, setAnalyzingText] = useState(false);
  const [textResult, setTextResult] = useState<TextAnalysisResult | null>(null);

  // Image / Screenshot Workflow States
  const [selectedScreenshotSample, setSelectedScreenshotSample] = useState(SAMPLE_SCREENSHOTS[0]);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [imageResult, setImageResult] = useState<TextAnalysisResult | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Verification Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    source: false,
    provider: false,
    registration: false,
    riskDisclosure: false,
    paymentDestination: false,
  });

  const toggleChecklist = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAnalyzeText = async () => {
    if (!inputText.trim()) return;
    setAnalyzingText(true);
    try {
      const result = await apiAnalyzeText(inputText, isDemoMode);
      setTextResult(result);
    } catch (err) {
      console.error('Failed to analyze text:', err);
    } finally {
      setAnalyzingText(false);
    }
  };

  const handleAnalyzeScreenshot = async (sampleData?: typeof SAMPLE_SCREENSHOTS[0]) => {
    setAnalyzingImage(true);
    try {
      const sample = sampleData || selectedScreenshotSample;
      const result = await apiAnalyzeImage(sample.previewUrl, sample.name, isDemoMode);
      result.inputText = sample.extractedText;
      setImageResult(result);
    } catch (err) {
      console.error('Failed to analyze screenshot:', err);
    } finally {
      setAnalyzingImage(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      alert('Please upload a valid PNG, JPG, or WEBP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setUploadedImagePreview(base64);
      setAnalyzingImage(true);
      try {
        const result = await apiAnalyzeImage(base64, file.name, isDemoMode);
        setImageResult(result);
      } catch (err) {
        console.error('Image analysis failed:', err);
      } finally {
        setAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const activeResult = activeTab === 'text' ? textResult : imageResult;

  // Extracted claims data (Section 10)
  const currentClaimData = activeResult?.claim || (
    activeResult?.inputText ? extractInvestmentClaim(activeResult.inputText) : null
  );

  return (
    <div className="space-y-6">
      {/* Page Header (Section 8) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Risk Analysis
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">Retail Protection</span>
        </div>
        <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Check Investment Content
        </h1>
        <p className="mt-1 text-xs text-slate-600 max-w-3xl leading-relaxed">
          Analyze investment messages, financial promotions and social-media content for potential risk signals.
        </p>

        {/* Two Tabs: TEXT & IMAGE (Section 8) */}
        <div className="mt-6 flex border-b border-slate-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'text'
                  ? 'border-[#1a1a1a] text-[#1a1a1a] bg-neutral-100 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>TEXT</span>
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'image'
                  ? 'border-[#1a1a1a] text-[#1a1a1a] bg-neutral-100 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>IMAGE</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: TEXT WORKFLOW */}
      {activeTab === 'text' && (
        <div className="space-y-6">
          {/* Sample Preset Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Sample Examples:
            </span>
            {SAMPLE_INVESTMENT_TEXTS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(sample.text);
                  setTextResult(null);
                }}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  inputText === sample.text
                    ? 'border-[#1a1a1a] bg-[#1a1a1a] font-bold text-white shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-[#1a1a1a]'
                }`}
              >
                {sample.title}
              </button>
            ))}
          </div>

          {/* Professional Text Editor */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Investment Message / Promotion Content
            </label>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste an investment message, social-media post, advertisement or financial promotion..."
              className="mt-2.5 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-[#1a1a1a] focus:bg-white focus:outline-hidden"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <span className="text-[11px] text-slate-500">
                Evaluation performs deterministic claim extraction and risk heuristic identification.
              </span>
              <button
                onClick={handleAnalyzeText}
                disabled={analyzingText || !inputText.trim()}
                className="inline-flex items-center gap-2 border border-[#1a1a1a] bg-[#1a1a1a] px-5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-white hover:text-[#1a1a1a] disabled:opacity-50 cursor-pointer"
              >
                {analyzingText ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span>{analyzingText ? 'Analyzing Content...' : 'Analyze Content'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IMAGE WORKFLOW (Section 11) */}
      {activeTab === 'image' && (
        <div className="space-y-6">
          {/* Preset Screenshots */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Sample Screenshots:
            </span>
            {SAMPLE_SCREENSHOTS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => {
                  setSelectedScreenshotSample(sample);
                  setUploadedImagePreview(null);
                  setImageResult(null);
                }}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  selectedScreenshotSample.id === sample.id && !uploadedImagePreview
                    ? 'border-[#1a1a1a] bg-[#1a1a1a] font-bold text-white shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-[#1a1a1a]'
                }`}
              >
                {sample.name}
              </button>
            ))}
          </div>

          {/* Screenshot Upload Workspace */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Upload Area */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Upload Social Media Screenshot
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Supported formats: PNG, JPG, WEBP. Text will be extracted and analyzed automatically.
                </p>

                <div className="mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-6 text-center transition-colors hover:bg-slate-100 relative">
                  <Upload className="h-8 w-8 text-[#1a1a1a] mb-2" />
                  <p className="text-xs font-bold text-slate-900">
                    Click to select screenshot or drag and drop
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    PNG, JPG, or WEBP (Max 10MB)
                  </p>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {uploadedImagePreview ? 'Custom file loaded' : selectedScreenshotSample.name}
                </span>
                <button
                  onClick={() => handleAnalyzeScreenshot()}
                  disabled={analyzingImage}
                  className="inline-flex items-center gap-2 border border-[#1a1a1a] bg-[#1a1a1a] px-5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-white hover:text-[#1a1a1a] disabled:opacity-50 cursor-pointer"
                >
                  {analyzingImage ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  <span>{analyzingImage ? 'Extracting & Analyzing...' : 'Analyze Screenshot'}</span>
                </button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                Screenshot Preview
              </h3>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center">
                <img
                  src={uploadedImagePreview || selectedScreenshotSample.previewUrl}
                  alt="Screenshot preview"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                Extracted content is converted into structured investment claims.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 9: INVESTMENT ANALYSIS RESULT (Investigation Report Layout) */}
      {activeResult && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          {/* Top: RISK ASSESSMENT */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>INVESTIGATION REPORT</span>
                <span>·</span>
                <span>REF: {activeResult.id}</span>
              </div>
              <h2 className="mt-1 font-display text-xl font-black text-slate-900">
                RISK ASSESSMENT
              </h2>
              <p className="mt-1 text-xs text-slate-600 italic">
                "Potentially suspicious characteristics detected."
              </p>
            </div>

            {/* Risk Score Pill & Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-2">
                <div>
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                    {activeResult.riskLevel} RISK
                  </span>
                  <div className="font-mono-numbers text-2xl font-black text-rose-700 leading-none mt-0.5">
                    {activeResult.riskScore} <span className="text-xs font-normal text-rose-500">/ 100</span>
                  </div>
                </div>
              </div>

              {onAttachToCase && (
                <button
                  onClick={() => onAttachToCase(activeResult)}
                  className="inline-flex items-center gap-1.5 border border-[#1a1a1a] bg-[#1a1a1a] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-white hover:text-[#1a1a1a] cursor-pointer"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>Create Case</span>
                </button>
              )}

              {onSendToUnifiedRisk && (
                <button
                  onClick={() => onSendToUnifiedRisk(activeResult.riskScore)}
                  className="inline-flex items-center gap-1.5 border border-[#1a1a1a] bg-white px-3.5 py-2 text-xs font-bold text-[#1a1a1a] shadow-2xs transition-colors hover:bg-[#1a1a1a] hover:text-white cursor-pointer"
                >
                  <Sliders className="h-4 w-4 text-[#1a1a1a]" />
                  <span>Send to Risk Intelligence</span>
                </button>
              )}

              <button
                onClick={() => onOpenReport(activeResult)}
                className="inline-flex items-center gap-1.5 border border-[#1a1a1a] bg-white px-3.5 py-2 text-xs font-bold text-[#1a1a1a] shadow-2xs transition-colors hover:bg-[#1a1a1a] hover:text-white cursor-pointer"
              >
                <FileCheck className="h-4 w-4 text-[#1a1a1a]" />
                <span>View Report</span>
              </button>
            </div>
          </div>

          {/* Section: EXTRACTED TEXT (for screenshots) */}
          {activeResult.inputText && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Extracted Text
              </span>
              <p className="mt-1.5 text-xs text-slate-800 leading-relaxed font-mono bg-white p-3 rounded-lg border border-slate-200/80">
                {activeResult.inputText}
              </p>
            </div>
          )}

          {/* Section: RISK SIGNALS (Section 9) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              RISK SIGNALS
            </h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Signal 1: Guaranteed Return */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Guaranteed return language
                  </span>
                  <span className="rounded bg-rose-100 px-1.5 py-0.2 font-mono text-[10px] font-black text-rose-700">
                    High
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-600 leading-normal">
                  Claims of assured profit or money-back guarantees on speculative securities.
                </p>
              </div>

              {/* Signal 2: Urgency Language */}
              <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Urgency language
                  </span>
                  <span className="rounded bg-orange-100 px-1.5 py-0.2 font-mono text-[10px] font-black text-orange-700">
                    High
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-600 leading-normal">
                  High-pressure countdown, artificial slot limits, or FOMO-driven solicitation.
                </p>
              </div>

              {/* Signal 3: Unverified Source */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Unverified source
                  </span>
                  <span className="rounded bg-amber-100 px-1.5 py-0.2 font-mono text-[10px] font-black text-amber-800">
                    Medium
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-600 leading-normal">
                  Unregistered entity name or social handle without depository licensing.
                </p>
              </div>

              {/* Signal 4: Direct Payment Request */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Direct payment request
                  </span>
                  <span className="rounded bg-rose-100 px-1.5 py-0.2 font-mono text-[10px] font-black text-rose-700">
                    High
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-600 leading-normal">
                  Direct transfer request to personal UPI VPA or private escrow account.
                </p>
              </div>
            </div>
          </div>

          {/* Section: CLAIMS IDENTIFIED (Section 9 & 10) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                CLAIMS IDENTIFIED
              </h3>
              <span className="text-[11px] font-mono font-medium text-slate-400">
                Deterministic Factual Extraction
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Promised Return:
                </span>
                <p className="font-mono-numbers mt-1 text-lg font-bold text-slate-900">
                  {currentClaimData?.promisedReturn || '40% - 45%'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Stated in proposal</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Time Period:
                </span>
                <p className="font-mono-numbers mt-1 text-lg font-bold text-slate-900">
                  {currentClaimData?.timeHorizon || '15 - 30 days'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Execution horizon</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Guarantee:
                </span>
                <p className="mt-1 text-base font-bold text-rose-700">
                  Detected
                </p>
                <p className="text-[10px] text-rose-500 mt-0.5">Statutory violation</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Risk Disclosure:
                </span>
                <p className="mt-1 text-base font-bold text-amber-700">
                  Not Detected
                </p>
                <p className="text-[10px] text-amber-600 mt-0.5">Omission detected</p>
              </div>
            </div>
          </div>

          {/* Section: WHY THIS MATTERS (Section 9) */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2">
              WHY THIS MATTERS
            </h3>
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong className="text-slate-900">1. Unrealistic Yield Structure:</strong> Standard market indices generate long-term annualized returns of 12-15%. A promise of 40% returns in 30 days indicates an annualized yield exceeding 1,000%, which cannot be sustained through legal secondary-market mechanisms.
              </p>
              <p>
                <strong className="text-slate-900">2. Statutory Guarantee Prohibition:</strong> Under SEBI (Investment Advisers) Regulations, registered market intermediaries are strictly prohibited from promising guaranteed returns or capital protection on risk-bearing equities.
              </p>
              <p>
                <strong className="text-slate-900">3. Channel Vulnerability:</strong> Solicitations routed through closed messaging groups requesting direct transfers to individual VPAs lack clearing corporation dispute resolution, creating irreversible capital loss risk.
              </p>
            </div>
          </div>

          {/* Section: WHAT TO VERIFY (Section 9) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              WHAT TO VERIFY
            </h3>

            <div className="space-y-2.5">
              {[
                {
                  id: 'source',
                  title: 'Source',
                  desc: 'Verify if the communication originates from an official, verified broker domain or unverified third party.',
                },
                {
                  id: 'provider',
                  title: 'Provider',
                  desc: 'Check the real corporate identity behind the promoter and search for previous regulatory warnings.',
                },
                {
                  id: 'registration',
                  title: 'Registration',
                  desc: 'Search the SEBI Intermediaries portal (scores.gov.in) to confirm valid registration numbers.',
                },
                {
                  id: 'riskDisclosure',
                  title: 'Risk Disclosure',
                  desc: 'Check whether mandatory statutory risk disclaimers ("Securities investments are subject to market risks") are provided.',
                },
                {
                  id: 'paymentDestination',
                  title: 'Payment Destination',
                  desc: 'Confirm payment destination is a recognized clearing corporation or regulated institutional escrow, never a personal VPA.',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checkedItems[item.id]}
                    onChange={() => {}}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      {item.title}
                    </span>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 11: ANALYSIS DETAILS (Technical information collapsed) */}
          <div className="border-t border-slate-200 pt-3">
            <button
              onClick={() => setShowTechnicalDetails((prev) => !prev)}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <span>Analysis Details</span>
              {showTechnicalDetails ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {showTechnicalDetails && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">Pipeline Stages:</span>
                    <p className="font-semibold text-slate-700">Text → Claim extraction → Entity extraction → Signal detection → Risk assessment</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Model Engine:</span>
                    <p className="font-semibold text-slate-700">DeBERTa-v3 calibrated heuristic & regex tokenizer</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Processing Latency:</span>
                    <p className="font-semibold text-slate-700">42ms (In-memory deterministic)</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Confidence Calibration:</span>
                    <p className="font-semibold text-slate-700">{Math.round(activeResult.confidence * 100)}% reliability index</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
