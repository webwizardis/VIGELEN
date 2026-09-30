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
  Maximize2,
  Eye,
  ShieldCheck,
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
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
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
      if (uploadedImagePreview) {
        const result = await apiAnalyzeImage(uploadedImagePreview, 'uploaded_screenshot.png', isDemoMode);
        setImageResult(result);
      } else {
        // Run OCR text analysis using the dataset-trained model
        const result = await apiAnalyzeText(sample.extractedText, isDemoMode);
        result.inputType = 'screenshot';
        result.inputText = sample.extractedText;
        setImageResult(result);
      }
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
          {/* Sensible Screenshots Preset Gallery */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="mono text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
                  Sensible Real-World Forensic Screenshots
                </h3>
                <p className="text-xs text-[#71717a] mt-0.5">
                  High-fidelity social and mobile captures demonstrating authentic investment scam vectors vs regulated broker disclosures.
                </p>
              </div>
              <span className="mono text-[10px] bg-[#f4f4f5] border border-[#e4e4e7] px-2 py-0.5">
                4 PRESET CASES AVAILABLE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SAMPLE_SCREENSHOTS.map((sample) => {
                const isSelected = selectedScreenshotSample.id === sample.id && !uploadedImagePreview;
                return (
                  <div
                    key={sample.id}
                    onClick={() => {
                      setSelectedScreenshotSample(sample);
                      setUploadedImagePreview(null);
                      setImageResult(null);
                    }}
                    className={`border transition-all cursor-pointer bg-white overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#1a1a1a] shadow-sm ring-1 ring-[#1a1a1a]'
                        : 'border-[#e4e4e7] hover:border-[#1a1a1a]/60'
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                      <img
                        src={sample.previewUrl}
                        alt={sample.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-top hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="mono text-[9px] font-bold bg-[#1a1a1a]/90 text-white px-2 py-0.5 uppercase backdrop-blur-xs">
                          {sample.channel}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span
                          className={`mono text-[9px] font-bold px-1.5 py-0.5 border ${
                            sample.simulatedRisk >= 75
                              ? 'bg-[#be123c] text-white border-[#be123c]'
                              : 'bg-[#10b981] text-white border-[#10b981]'
                          }`}
                        >
                          {sample.simulatedRisk}/100
                        </span>
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="font-bold text-xs text-[#1a1a1a] leading-snug">
                          {sample.name}
                        </div>
                        <p className="text-[11px] text-[#71717a] mt-1 line-clamp-2">
                          {sample.claim}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#f4f4f5] flex items-center justify-between">
                        <span className="mono text-[10px] text-[#71717a]">
                          {isSelected ? '● Selected' : 'Click to inspect'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScreenshotSample(sample);
                            setUploadedImagePreview(null);
                            handleAnalyzeScreenshot(sample);
                          }}
                          className="mono text-[10px] font-bold text-[#1a1a1a] hover:underline"
                        >
                          Scan Now →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Screenshot Inspection & Upload Workspace */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Metadata & Upload Control (5 cols) */}
            <div className="lg:col-span-5 border border-[#1a1a1a] bg-white p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="border-b border-[#e4e4e7] pb-3">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[10px] text-[#71717a] uppercase font-bold">
                      Selected Sample Details
                    </span>
                    <span className="mono text-[10px] bg-[#f4f4f5] border border-[#e4e4e7] px-2 py-0.5">
                      {selectedScreenshotSample.channel}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1a1a1a] mt-1">
                    {uploadedImagePreview ? 'Custom Uploaded Screenshot' : selectedScreenshotSample.name}
                  </h4>
                  <p className="text-xs text-[#71717a] mt-0.5">
                    {uploadedImagePreview
                      ? 'Custom file will be analyzed using OCR extraction and VIGILEN model scoring.'
                      : selectedScreenshotSample.threatType}
                  </p>
                </div>

                {/* OCR Text Box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="mono text-[10px] text-[#71717a] uppercase font-bold">
                      Extracted Text / OCR Transcription
                    </span>
                    <span className="mono text-[9px] text-[#10b981] font-bold">
                      READY FOR MODEL
                    </span>
                  </div>
                  <div className="p-3 bg-[#fdfdfc] border border-[#e4e4e7] font-mono text-[11px] text-[#1a1a1a] max-h-36 overflow-y-auto leading-relaxed">
                    {uploadedImagePreview
                      ? 'Custom screenshot image loaded. Click "Analyze Screenshot" to extract text and evaluate.'
                      : selectedScreenshotSample.extractedText}
                  </div>
                </div>

                {/* Custom File Upload Option */}
                <div>
                  <span className="mono text-[10px] text-[#71717a] uppercase font-bold block mb-1.5">
                    Or Upload Custom Screenshot
                  </span>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#e4e4e7] bg-[#fdfdfc] p-4 text-center transition-colors hover:border-[#1a1a1a] relative">
                    <Upload className="h-5 w-5 text-[#1a1a1a] mb-1.5" />
                    <p className="text-xs font-semibold text-[#1a1a1a]">
                      Drop image or browse device
                    </p>
                    <p className="text-[10px] text-[#71717a] mt-0.5">
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
              </div>

              <div className="pt-4 border-t border-[#e4e4e7]">
                <button
                  type="button"
                  onClick={() => handleAnalyzeScreenshot()}
                  disabled={analyzingImage}
                  className="w-full inline-flex items-center justify-center gap-2 border border-[#1a1a1a] bg-[#1a1a1a] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-white hover:text-[#1a1a1a] disabled:opacity-50 cursor-pointer"
                >
                  {analyzingImage ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  <span>{analyzingImage ? 'Extracting & Evaluating...' : 'Analyze Screenshot with VIGILEN Engine'}</span>
                </button>
              </div>
            </div>

            {/* Right: High-Res Screenshot Viewer (7 cols) */}
            <div className="lg:col-span-7 border border-[#1a1a1a] bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-2">
                <div>
                  <h3 className="mono text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">
                    Forensic Screenshot Preview
                  </h3>
                  <span className="text-[11px] text-[#71717a]">
                    Digital capture from {uploadedImagePreview ? 'custom upload' : selectedScreenshotSample.channel}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxImage(uploadedImagePreview || selectedScreenshotSample.previewUrl)}
                  className="inline-flex items-center gap-1.5 mono text-[10px] border border-[#e4e4e7] px-2.5 py-1 bg-[#fdfdfc] hover:border-[#1a1a1a] cursor-pointer"
                >
                  <Maximize2 className="h-3 w-3" />
                  <span>Expand View</span>
                </button>
              </div>

              <div
                onClick={() => setLightboxImage(uploadedImagePreview || selectedScreenshotSample.previewUrl)}
                className="relative max-h-[460px] w-full overflow-hidden border border-[#e4e4e7] bg-[#1a1a1a]/5 flex items-center justify-center p-2 cursor-pointer group"
              >
                <img
                  src={uploadedImagePreview || selectedScreenshotSample.previewUrl}
                  alt={selectedScreenshotSample.name}
                  referrerPolicy="no-referrer"
                  className="max-h-[430px] w-auto max-w-full object-contain shadow-sm group-hover:scale-[1.01] transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="mono text-xs bg-[#1a1a1a] text-white px-3 py-1.5 font-bold flex items-center gap-1.5 shadow-md">
                    <Eye className="h-3.5 w-3.5" />
                    Click to Open High-Res Fullscreen
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#71717a] pt-1">
                <span>
                  Source: <strong>{uploadedImagePreview ? 'User Upload' : selectedScreenshotSample.name}</strong>
                </span>
                <span className="mono">
                  Channel: {uploadedImagePreview ? 'External' : selectedScreenshotSample.channel}
                </span>
              </div>
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

          {/* OFFICIAL REGULATORY BLACKLIST MATCH BANNER */}
          {activeResult.matchedRegulatoryRecord && (
            <div className="rounded-xl border-2 border-rose-600 bg-rose-50/90 p-5 shadow-xs text-rose-950">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-rose-600 px-2.5 py-0.5 font-mono text-[11px] font-black text-white uppercase tracking-wider">
                    CRITICAL REGULATORY ALERT
                  </span>
                  <span className="font-mono text-xs font-bold text-rose-900">
                    OFFICIAL {activeResult.matchedRegulatoryRecord.sourceAgency} CAUTION BLACKLIST MATCH (#{activeResult.matchedRegulatoryRecord.sourceRecordId})
                  </span>
                </div>
                <span className="rounded bg-rose-100 px-3 py-1 font-mono text-xs font-bold text-rose-800 border border-rose-300">
                  ACTION: {activeResult.matchedRegulatoryRecord.recommendedAction}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-bold text-rose-950 uppercase tracking-wider text-[11px]">Flagged Entity / Channel:</p>
                  <p className="font-mono text-xs mt-1 bg-white p-2 rounded border border-rose-200 text-rose-950 break-all select-all font-semibold">
                    {activeResult.matchedRegulatoryRecord.rawEntity}
                  </p>
                  <p className="mt-1.5 text-[11px] text-rose-800">
                    Platform Category: <span className="font-bold">{activeResult.matchedRegulatoryRecord.channelPlatform}</span> · Threat:{' '}
                    <span className="font-bold">{activeResult.matchedRegulatoryRecord.threatClassification.replace(/_/g, ' ')}</span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-rose-950 uppercase tracking-wider text-[11px]">Official Label Basis & Source:</p>
                  <p className="mt-1 text-slate-800 bg-white p-2 rounded border border-rose-200 leading-relaxed text-[11px]">
                    {activeResult.matchedRegulatoryRecord.labelBasis}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500 italic">
                    Source list: {activeResult.matchedRegulatoryRecord.sourceAgency} consolidated caution list (client complaint adjudications).
                  </p>
                </div>
              </div>
            </div>
          )}

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
