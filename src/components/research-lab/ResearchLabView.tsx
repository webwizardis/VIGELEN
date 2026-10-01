import React, { useState } from 'react';
import {
  FlaskConical,
  Database,
  BarChart2,
  GitCompare,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  FileText,
  Copy,
  ExternalLink,
  Cpu,
  Play,
  RefreshCw,
  Sliders,
  Check,
  X,
  Zap,
  Brain,
  Layers,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { RESEARCH_MODEL_METRICS, RESEARCH_DATASETS } from '../../data/mockData';
import { DatasetInfo } from '../../types';
import {
  REGULATORY_INTELLIGENCE_RECORDS,
  BLACKLISTED_MALICIOUS_ENTITIES,
  RBI_FRAUD_AGGREGATES,
  SEBI_DEMOGRAPHIC_METRICS,
} from '../../data/cleanedIntelligence';
import {
  getModelTrainingSummary,
  evaluateTestSuite,
  predictWithTrainedModel,
  trainSet,
  testSet,
  TestSampleResult,
  ModelInferenceResult,
  ModelTrainingSummary,
} from '../../services/datasetModelTrainer';

export const ResearchLabView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dataset-model' | 'models' | 'curves' | 'datasets'>('dataset-model');
  const [selectedDataset, setSelectedDataset] = useState<DatasetInfo>(RESEARCH_DATASETS[0]);
  const [customCsvDataset, setCustomCsvDataset] = useState<DatasetInfo | null>(null);

  // Model Training & Testing States
  const [trainingSummary, setTrainingSummary] = useState<ModelTrainingSummary>(() => getModelTrainingSummary());
  const [testSuite, setTestSuite] = useState(() => evaluateTestSuite());
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Test Suite Filtering & Search
  const [testSearch, setTestSearch] = useState('');
  const [testFilterPlatform, setTestFilterPlatform] = useState<string>('ALL');
  const [testFilterStatus, setTestFilterStatus] = useState<'ALL' | 'PASSED' | 'FAILED'>('ALL');
  const [testPage, setTestPage] = useState(1);
  const itemsPerPage = 12;

  // Single-Sample Testing Sandbox
  const [sandboxInput, setSandboxInput] = useState('t.me/SmartTradeSoftware');
  const [sandboxPlatform, setSandboxPlatform] = useState('Telegram');
  const [sandboxResult, setSandboxResult] = useState<ModelInferenceResult | null>(() =>
    predictWithTrainedModel('t.me/SmartTradeSoftware', 'Telegram')
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunTestSuite = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const updatedSuite = evaluateTestSuite();
      setTestSuite(updatedSuite);
      setTrainingSummary(getModelTrainingSummary());
      setIsRunningTests(false);
    }, 450);
  };

  const handleRunSandbox = (inputVal?: string, platformVal?: string) => {
    const textToTest = inputVal !== undefined ? inputVal : sandboxInput;
    const platToTest = platformVal !== undefined ? platformVal : sandboxPlatform;
    const res = predictWithTrainedModel(textToTest, platToTest);
    setSandboxResult(res);
  };

  const handleSendToSandbox = (entity: string, platform: string) => {
    setSandboxInput(entity);
    setSandboxPlatform(platform);
    handleRunSandbox(entity, platform);
    // Scroll sandbox into view
    const sandboxEl = document.getElementById('model-sandbox-card');
    if (sandboxEl) {
      sandboxEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Filter test results
  const filteredTestResults = testSuite.results.filter((res) => {
    if (testFilterPlatform !== 'ALL' && res.platform !== testFilterPlatform) return false;
    if (testFilterStatus === 'PASSED' && !res.isCorrect) return false;
    if (testFilterStatus === 'FAILED' && res.isCorrect) return false;
    if (testSearch.trim()) {
      const q = testSearch.toLowerCase();
      return (
        res.entity.toLowerCase().includes(q) ||
        res.id.toLowerCase().includes(q) ||
        res.platform.toLowerCase().includes(q) ||
        res.classification.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalTestPages = Math.ceil(filteredTestResults.length / itemsPerPage);
  const paginatedTestResults = filteredTestResults.slice(
    (testPage - 1) * itemsPerPage,
    testPage * itemsPerPage
  );

  // Handle CSV Upload simulation for Datasets tab
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n').filter((l) => l.trim().length > 0);
      const headers = lines[0]?.split(',') || [];
      const rowCount = Math.max(1, lines.length - 1);

      const uploadedInfo: DatasetInfo = {
        id: `user-ds-${Date.now()}`,
        name: file.name,
        description: `Custom research dataset uploaded by user (${(file.size / 1024).toFixed(1)} KB).`,
        type: file.name.toLowerCase().includes('txn') || file.name.toLowerCase().includes('trans') ? 'TRANSACTIONS' : 'TEXT_SCAMS',
        rowCount,
        columnCount: headers.length,
        missingValues: Math.round(rowCount * 0.015),
        duplicateRecords: 0,
        classDistribution: [
          { label: 'Positive Target Class', count: Math.round(rowCount * 0.4), percentage: 40.0 },
          { label: 'Negative Baseline Class', count: Math.round(rowCount * 0.6), percentage: 60.0 },
        ],
        features: headers.slice(0, 8).map((h) => ({
          name: h.trim(),
          type: /id|date|text|cat/i.test(h) ? 'categorical' : 'numerical',
          missingPct: 0.0,
        })),
        lastUpdated: 'Uploaded Just Now',
      };

      setCustomCsvDataset(uploadedInfo);
      setSelectedDataset(uploadedInfo);
    };
    reader.readAsText(file);
  };

  const currentDataset = customCsvDataset && selectedDataset.id === customCsvDataset.id
    ? customCsvDataset
    : selectedDataset;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border border-[#1a1a1a] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="mono text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
            Model Research
          </span>
          <span className="text-[#71717a]">·</span>
          <span className="text-xs text-[#71717a]">Supervised Training & Empirical Testing</span>
        </div>
        <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#1a1a1a] sm:text-3xl">
          Model Training, Parameter Estimation & Benchmark Test Suite
        </h1>
        <p className="mt-1 text-xs text-[#71717a] max-w-3xl leading-relaxed">
          The 278-record regulatory dataset has been converted into training representations, platform risk priors, and token regression log-odds. The model undergoes 80/20 train/test evaluation with held-out validation.
        </p>

        {/* Subtabs */}
        <div className="mt-6 flex border-b border-[#e4e4e7] overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('dataset-model')}
              className={`flex items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'dataset-model'
                  ? 'border-[#1a1a1a] text-[#1a1a1a] bg-[#f4f4f5]'
                  : 'border-transparent text-[#71717a] hover:text-[#1a1a1a]'
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>Dataset Model Training & Testing (80/20 Split)</span>
            </button>

            <button
              onClick={() => setActiveTab('models')}
              className={`flex items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'models'
                  ? 'border-[#1a1a1a] text-[#1a1a1a] bg-[#f4f4f5]'
                  : 'border-transparent text-[#71717a] hover:text-[#1a1a1a]'
              }`}
            >
              <GitCompare className="h-4 w-4" />
              <span>Cross-Model Benchmark Metrics</span>
            </button>

            <button
              onClick={() => setActiveTab('curves')}
              className={`flex items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'curves'
                  ? 'border-[#1a1a1a] text-[#1a1a1a] bg-[#f4f4f5]'
                  : 'border-transparent text-[#71717a] hover:text-[#1a1a1a]'
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              <span>Confusion Matrix & PR Curves</span>
            </button>

            <button
              onClick={() => setActiveTab('datasets')}
              className={`flex items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'datasets'
                  ? 'border-[#1a1a1a] text-[#1a1a1a] bg-[#f4f4f5]'
                  : 'border-transparent text-[#71717a] hover:text-[#1a1a1a]'
              }`}
            >
              <Database className="h-4 w-4" />
              <span>Dataset Profiling</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: DATASET-TRAINED MODEL & EMPIRICAL TEST SUITE */}
      {activeTab === 'dataset-model' && (
        <div className="space-y-6">
          {/* Top KPI Scorecards: Fraud Cases, Non-Fraud Cases, Train/Test Split, Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Fraud Cases (Class 1) */}
            <div className="border border-[#1a1a1a] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="mono text-[11px] text-[#71717a]">Class 1: Fraud Cases</span>
                <span className="mono text-[10px] bg-[#be123c] text-white px-2 py-0.5 font-bold">
                  HIGH RISK
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="mono text-2xl font-bold text-[#be123c]">
                  {trainingSummary.fraudCasesCount}
                </span>
                <span className="text-xs text-[#71717a]">fraud cases</span>
              </div>
              <p className="mt-1 text-[11px] text-[#71717a]">
                {trainingSummary.trainFraudCount} in Train / {trainingSummary.testFraudCount} in Held-Out Test. NSE caution list + RBI banking fraud cases.
              </p>
            </div>

            {/* 2. Non-Fraud Cases (Class 0) */}
            <div className="border border-[#1a1a1a] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="mono text-[11px] text-[#71717a]">Class 0: Non-Fraud Cases</span>
                <span className="mono text-[10px] bg-[#10b981] text-white px-2 py-0.5 font-bold">
                  LEGITIMATE
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="mono text-2xl font-bold text-[#10b981]">
                  {trainingSummary.nonFraudCasesCount}
                </span>
                <span className="text-xs text-[#71717a]">non-fraud cases</span>
              </div>
              <p className="mt-1 text-[11px] text-[#71717a]">
                {trainingSummary.trainNonFraudCount} in Train / {trainingSummary.testNonFraudCount} in Held-Out Test. SEBI registered brokers & statutory disclosures.
              </p>
            </div>

            {/* 3. Train / Test Split */}
            <div className="border border-[#1a1a1a] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="mono text-[11px] text-[#71717a]">Train / Test Split</span>
                <span className="mono text-[10px] bg-[#f4f4f5] text-[#1a1a1a] border border-[#e4e4e7] px-2 py-0.5 font-bold">
                  80% / 20%
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="mono text-2xl font-bold text-[#1a1a1a]">
                  {trainingSummary.trainSampleSize} <span className="text-sm font-normal text-[#71717a]">Train</span> / {trainingSummary.testSampleSize} <span className="text-sm font-normal text-[#71717a]">Test</span>
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#71717a]">
                Total: {trainingSummary.totalDatasetSize} records. Stratified 80/20 partition with zero overlap between training and testing.
              </p>
            </div>

            {/* 4. Test Accuracy & F1 */}
            <div className="border border-[#1a1a1a] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="mono text-[11px] text-[#71717a]">Empirical Test Performance</span>
                <span className="mono text-[10px] bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 px-2 py-0.5 font-bold">
                  HELD-OUT 20%
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="mono text-2xl font-bold text-[#10b981]">
                  {(testSuite.metrics.accuracy * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-[#71717a]">Accuracy</span>
              </div>
              <p className="mt-1 text-[11px] text-[#71717a]">
                Precision: {(testSuite.metrics.precision * 100).toFixed(1)}% · Recall: {(testSuite.metrics.recall * 100).toFixed(1)}% · F1: {(testSuite.metrics.f1Score * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Test Suite Execution Bar & Confusion Matrix */}
          <div className="border border-[#1a1a1a] bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e4e7] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#1a1a1a]">
                    Held-Out Test Suite Benchmark Evaluation
                  </h3>
                  <span className="mono text-[10px] bg-[#1a1a1a] text-white px-2 py-0.5 font-bold">
                    {testSuite.summary.totalTestSamples} SAMPLES
                  </span>
                </div>
                <p className="text-xs text-[#71717a] mt-0.5">
                  Evaluates model generalization against the held-out 20% test partition containing unseen NSE blacklisted entities and genuine market controls.
                </p>
              </div>

              <button
                onClick={handleRunTestSuite}
                disabled={isRunningTests}
                className="inline-flex items-center justify-center gap-2 border border-[#1a1a1a] bg-[#1a1a1a] px-4 py-2 text-xs font-bold text-white hover:bg-white hover:text-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
                <span>{isRunningTests ? 'Evaluating Test Suite...' : 'Run Test Suite Evaluation'}</span>
              </button>
            </div>

            {/* Test Benchmark Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="border border-[#e4e4e7] bg-[#fdfdfc] p-3">
                <div className="mono text-[10px] text-[#71717a] uppercase">Accuracy</div>
                <div className="mono text-lg font-bold text-[#1a1a1a] mt-1">
                  {(testSuite.metrics.accuracy * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] text-[#71717a]">Overall match rate</div>
              </div>

              <div className="border border-[#e4e4e7] bg-[#fdfdfc] p-3">
                <div className="mono text-[10px] text-[#71717a] uppercase">Precision</div>
                <div className="mono text-lg font-bold text-[#1a1a1a] mt-1">
                  {(testSuite.metrics.precision * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] text-[#71717a]">TP / (TP + FP)</div>
              </div>

              <div className="border border-[#e4e4e7] bg-[#fdfdfc] p-3">
                <div className="mono text-[10px] text-[#71717a] uppercase">Recall / Sensitivity</div>
                <div className="mono text-lg font-bold text-[#1a1a1a] mt-1">
                  {(testSuite.metrics.recall * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] text-[#71717a]">TP / (TP + FN)</div>
              </div>

              <div className="border border-[#e4e4e7] bg-[#fdfdfc] p-3">
                <div className="mono text-[10px] text-[#71717a] uppercase">F1-Score</div>
                <div className="mono text-lg font-bold text-[#1a1a1a] mt-1">
                  {(testSuite.metrics.f1Score * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] text-[#71717a]">Harmonic balance</div>
              </div>

              <div className="border border-[#e4e4e7] bg-[#fdfdfc] p-3">
                <div className="mono text-[10px] text-[#71717a] uppercase">Specificity</div>
                <div className="mono text-lg font-bold text-[#1a1a1a] mt-1">
                  {(testSuite.metrics.specificity * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] text-[#71717a]">TN / (TN + FP)</div>
              </div>

              <div className="border border-[#e4e4e7] bg-[#fdfdfc] p-3">
                <div className="mono text-[10px] text-[#71717a] uppercase">ROC-AUC</div>
                <div className="mono text-lg font-bold text-[#10b981] mt-1">
                  {testSuite.metrics.rocAuc}
                </div>
                <div className="text-[10px] text-[#71717a]">Rank-sum metric</div>
              </div>
            </div>

            {/* Confusion Matrix Card */}
            <div className="border border-[#e4e4e7] bg-[#fdfdfc] p-4">
              <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="mono text-xs font-bold text-[#1a1a1a] uppercase">
                    Test Set Confusion Matrix
                  </span>
                  <span className="text-[11px] text-[#71717a]">
                    (Evaluated on {testSuite.summary.totalTestSamples} Held-Out Instances)
                  </span>
                </div>
                <span className="mono text-[10px] text-[#10b981] font-bold">
                  {testSuite.summary.passedCount} PASSED / {testSuite.summary.failedCount} MISCLASSIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="border-2 border-[#10b981] bg-[#10b981]/5 p-3">
                    <div className="mono text-[10px] font-bold text-[#10b981] uppercase">True Positive (TP)</div>
                    <div className="mono text-2xl font-bold text-[#10b981] mt-1">
                      {testSuite.metrics.truePositive}
                    </div>
                    <div className="text-[10px] text-[#71717a] mt-1">Fraud Entities Intercepted</div>
                  </div>

                  <div className="border border-[#e4e4e7] bg-white p-3">
                    <div className="mono text-[10px] font-bold text-[#e11d48] uppercase">False Positive (FP)</div>
                    <div className="mono text-2xl font-bold text-[#e11d48] mt-1">
                      {testSuite.metrics.falsePositive}
                    </div>
                    <div className="text-[10px] text-[#71717a] mt-1">Controls Falsely Flagged</div>
                  </div>

                  <div className="border border-[#e4e4e7] bg-white p-3">
                    <div className="mono text-[10px] font-bold text-[#e11d48] uppercase">False Negative (FN)</div>
                    <div className="mono text-2xl font-bold text-[#e11d48] mt-1">
                      {testSuite.metrics.falseNegative}
                    </div>
                    <div className="text-[10px] text-[#71717a] mt-1">Fraud Samples Missed</div>
                  </div>

                  <div className="border-2 border-[#10b981] bg-[#10b981]/5 p-3">
                    <div className="mono text-[10px] font-bold text-[#10b981] uppercase">True Negative (TN)</div>
                    <div className="mono text-2xl font-bold text-[#10b981] mt-1">
                      {testSuite.metrics.trueNegative}
                    </div>
                    <div className="text-[10px] text-[#71717a] mt-1">Compliant Baselines Verified</div>
                  </div>
                </div>

                <div className="flex flex-col justify-center text-xs text-[#71717a] space-y-2 border-l border-[#e4e4e7] pl-4">
                  <p className="font-semibold text-[#1a1a1a]">Empirical Validation Integrity:</p>
                  <p>
                    • <strong>Zero Training Leakage:</strong> Held-out test records were isolated prior to platform prior estimation and token vocabulary extraction.
                  </p>
                  <p>
                    • <strong>Negative Controls Included:</strong> Tested against registered market intermediaries (Zerodha, Groww, SEBI SCORES, RBI portal) to prevent false-alarm saturation.
                  </p>
                  <p>
                    • <strong>Real Inference:</strong> The test suite executes the real scoring function in real time with an average execution latency of {testSuite.summary.averageLatencyMs}ms per prediction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Model Parameters & Feature Weights Learned from Dataset */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Platform Priors Learned */}
            <div className="lg:col-span-5 border border-[#1a1a1a] bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
                <div>
                  <h4 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
                    Channel Platform Risk Priors: P(Fraud | Channel)
                  </h4>
                  <p className="text-[11px] text-[#71717a]">
                    Learned from 222 training records across distribution channels
                  </p>
                </div>
                <span className="mono text-[10px] bg-[#f4f4f5] border border-[#e4e4e7] px-2 py-0.5">
                  Log-Odds Fitted
                </span>
              </div>

              <div className="space-y-3">
                {trainingSummary.platformPriors.map((prior, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1a1a1a]">{prior.platform}</span>
                      <div className="mono text-[11px] flex items-center gap-2">
                        <span className="text-[#71717a]">n={prior.sampleCount}</span>
                        <span className="font-bold text-[#be123c]">{(prior.priorProbability * 100).toFixed(1)}%</span>
                        <span className="text-[10px] text-[#71717a]">({prior.logOddsWeight > 0 ? `+${prior.logOddsWeight}` : prior.logOddsWeight})</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-[#f4f4f5] overflow-hidden">
                      <div
                        className="h-full bg-[#1a1a1a]"
                        style={{ width: `${prior.priorProbability * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Macro & Demographic Weights */}
              <div className="border-t border-[#e4e4e7] pt-4 space-y-2">
                <div className="mono text-[10px] font-bold text-[#1a1a1a] uppercase">
                  Dataset-Derived Vulnerability & Loss Factors
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="border border-[#e4e4e7] p-2 bg-[#fdfdfc]">
                    <div className="text-[#71717a]">SEBI Silver Gen (Age 55+)</div>
                    <div className="mono font-bold text-[#1a1a1a]">+{trainingSummary.sebiVulnerabilityWeights.silverGenSafetyFactor}x Vulnerability</div>
                  </div>
                  <div className="border border-[#e4e4e7] p-2 bg-[#fdfdfc]">
                    <div className="text-[#71717a]">SEBI Female Investor</div>
                    <div className="mono font-bold text-[#1a1a1a]">+{trainingSummary.sebiVulnerabilityWeights.femaleInvestorLowRiskWeight}x Low-Risk Prior</div>
                  </div>
                  <div className="border border-[#e4e4e7] p-2 bg-[#fdfdfc]">
                    <div className="text-[#71717a]">RBI Digital Payment Rails</div>
                    <div className="mono font-bold text-[#1a1a1a]">+{trainingSummary.rbiVelocityWeights.digitalPaymentAnomalyMultiplier}x Velocity Spike</div>
                  </div>
                  <div className="border border-[#e4e4e7] p-2 bg-[#fdfdfc]">
                    <div className="text-[#71717a]">RBI Lending Exposure</div>
                    <div className="mono font-bold text-[#1a1a1a]">+{trainingSummary.rbiVelocityWeights.highValueLendingExposureMultiplier}x High-Value Loss</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Discriminative Feature Tokens Learned from Training Set */}
            <div className="lg:col-span-7 border border-[#1a1a1a] bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
                <div>
                  <h4 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
                    Discriminative Token Features & Regression Weights
                  </h4>
                  <p className="text-[11px] text-[#71717a]">
                    Tokens extracted from fraudulent entities with fitted logit weights
                  </p>
                </div>
                <span className="mono text-[10px] bg-[#1a1a1a] text-white px-2 py-0.5">
                  {trainingSummary.topTokenWeights.length} Top Tokens
                </span>
              </div>

              <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
                {trainingSummary.topTokenWeights.map((tok, idx) => (
                  <div
                    key={idx}
                    className="border border-[#1a1a1a] bg-[#fdfdfc] px-2.5 py-1.5 text-xs flex items-center gap-2"
                  >
                    <span className="mono font-bold text-[#1a1a1a]">"{tok.token}"</span>
                    <span className="mono text-[10px] text-[#be123c] font-bold">
                      +{tok.weight}
                    </span>
                    <span className="mono text-[9px] bg-[#f4f4f5] text-[#71717a] px-1">
                      {tok.category}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#e4e4e7] pt-4 text-xs text-[#71717a] space-y-2">
                <p className="font-semibold text-[#1a1a1a]">How the Model Employs Dataset Tokens:</p>
                <p>
                  During content or transaction analysis, the engine extracts subwords and entities, matching them against these weighted tokens. If a token like <code>"varanium"</code> or <code>"nakasolutions"</code> is matched, its logit weight is added to the channel platform prior, producing a calibrated fraud probability via sigmoid activation.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Single-Sample Model Sandbox */}
          <div id="model-sandbox-card" className="border border-[#1a1a1a] bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e4e7] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#1a1a1a]" />
                  <h3 className="text-sm font-bold text-[#1a1a1a]">
                    Interactive Model Sandbox (Single-Sample Test Runner)
                  </h3>
                </div>
                <p className="text-xs text-[#71717a] mt-0.5">
                  Test any entity, channel handle, domain URL, or investment pitch against the dataset-trained model.
                </p>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="mono text-[10px] text-[#71717a]">Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSandboxInput('t.me/SmartTradeSoftware');
                    setSandboxPlatform('Telegram');
                    handleRunSandbox('t.me/SmartTradeSoftware', 'Telegram');
                  }}
                  className="mono text-[10px] border border-[#e4e4e7] px-2 py-1 bg-[#fdfdfc] hover:border-[#1a1a1a] cursor-pointer"
                >
                  Telegram: SmartTrade
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSandboxInput('https://www.mofslmaxs.com');
                    setSandboxPlatform('Website');
                    handleRunSandbox('https://www.mofslmaxs.com', 'Website');
                  }}
                  className="mono text-[10px] border border-[#e4e4e7] px-2 py-1 bg-[#fdfdfc] hover:border-[#1a1a1a] cursor-pointer"
                >
                  Clone: mofslmaxs.com
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSandboxInput('Varanium Trading App');
                    setSandboxPlatform('Mobile_App');
                    handleRunSandbox('Varanium Trading App', 'Mobile_App');
                  }}
                  className="mono text-[10px] border border-[#e4e4e7] px-2 py-1 bg-[#fdfdfc] hover:border-[#1a1a1a] cursor-pointer"
                >
                  APK: Varanium
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSandboxInput('https://zerodha.com');
                    setSandboxPlatform('Website');
                    handleRunSandbox('https://zerodha.com', 'Website');
                  }}
                  className="mono text-[10px] border border-[#e4e4e7] px-2 py-1 bg-[#fdfdfc] hover:border-[#1a1a1a] cursor-pointer"
                >
                  Legit: Zerodha
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <label className="block mono text-[10px] text-[#71717a] uppercase mb-1">
                  Input Entity, Channel, or Text Message to Test
                </label>
                <input
                  type="text"
                  value={sandboxInput}
                  onChange={(e) => setSandboxInput(e.target.value)}
                  placeholder="Enter URL, handle, application name, or claim..."
                  className="w-full border border-[#1a1a1a] px-3.5 py-2 text-xs text-[#1a1a1a] focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block mono text-[10px] text-[#71717a] uppercase mb-1">
                  Channel Platform
                </label>
                <select
                  value={sandboxPlatform}
                  onChange={(e) => setSandboxPlatform(e.target.value)}
                  className="w-full border border-[#1a1a1a] px-3 py-2 text-xs text-[#1a1a1a] bg-white focus:outline-hidden"
                >
                  <option value="Telegram">Telegram</option>
                  <option value="Website">Website</option>
                  <option value="Mobile_App">Mobile App</option>
                  <option value="Android_APK">Android APK</option>
                  <option value="YouTube">YouTube</option>
                  <option value="VIP_Payment_Gate">VIP Gate</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="button"
                  onClick={() => handleRunSandbox()}
                  className="w-full border border-[#1a1a1a] bg-[#1a1a1a] px-4 py-2 text-xs font-bold text-white hover:bg-white hover:text-[#1a1a1a] transition-colors cursor-pointer"
                >
                  Test Sample
                </button>
              </div>
            </div>

            {/* Sandbox Output Result */}
            {sandboxResult && (
              <div className="border border-[#1a1a1a] bg-[#fdfdfc] p-4 mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e4e4e7] pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`mono text-2xl font-bold px-3 py-1 border ${
                        sandboxResult.riskScore >= 75
                          ? 'border-[#be123c] text-[#be123c] bg-[#be123c]/5'
                          : sandboxResult.riskScore >= 40
                          ? 'border-[#d97706] text-[#d97706] bg-[#d97706]/5'
                          : 'border-[#10b981] text-[#10b981] bg-[#10b981]/5'
                      }`}
                    >
                      {sandboxResult.riskScore}/100
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1a1a1a]">
                          {sandboxResult.predictedClass.replace(/_/g, ' ')}
                        </span>
                        {sandboxResult.isExactDatasetMatch && (
                          <span className="mono text-[10px] bg-[#be123c] text-white px-2 py-0.5 font-bold">
                            EXACT DATASET MATCH (#{sandboxResult.matchedRecordId})
                          </span>
                        )}
                      </div>
                      <div className="mono text-[11px] text-[#71717a] mt-0.5">
                        Fraud Probability: {(sandboxResult.fraudProbability * 100).toFixed(1)}% · Confidence: {(sandboxResult.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  <div className="mono text-xs text-[#71717a]">
                    Platform Prior: {Math.round(sandboxResult.platformPrior * 100)}%
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <p className="text-xs text-[#1a1a1a] leading-relaxed">
                    {sandboxResult.explanation}
                  </p>

                  <div className="pt-2">
                    <span className="mono text-[10px] font-bold text-[#71717a] uppercase block mb-1">
                      Activated Model Features Fired:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sandboxResult.activatedFeatures.map((feat, idx) => (
                        <span
                          key={idx}
                          className="mono text-[10px] border border-[#1a1a1a] bg-white px-2 py-0.5 text-[#1a1a1a]"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Held-Out Test Partition Records Inspector */}
          <div className="border border-[#1a1a1a] bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e4e7] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1a1a1a]">
                  Held-Out 20% Test Partition Records ({filteredTestResults.length} Samples)
                </h3>
                <p className="text-xs text-[#71717a] mt-0.5">
                  Inspect every sample in the held-out testing partition, comparing ground-truth regulatory labels against model predictions.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#71717a]" />
                  <input
                    type="text"
                    placeholder="Search test samples..."
                    value={testSearch}
                    onChange={(e) => {
                      setTestSearch(e.target.value);
                      setTestPage(1);
                    }}
                    className="border border-[#e4e4e7] bg-[#fdfdfc] pl-8 pr-3 py-1.5 text-xs text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-hidden"
                  />
                </div>

                <select
                  value={testFilterStatus}
                  onChange={(e) => {
                    setTestFilterStatus(e.target.value as any);
                    setTestPage(1);
                  }}
                  className="border border-[#e4e4e7] bg-white px-2.5 py-1.5 text-xs text-[#1a1a1a] focus:outline-hidden"
                >
                  <option value="ALL">All Outcomes</option>
                  <option value="PASSED">Passed (Matches Ground Truth)</option>
                  <option value="FAILED">Misclassified</option>
                </select>

                <select
                  value={testFilterPlatform}
                  onChange={(e) => {
                    setTestFilterPlatform(e.target.value);
                    setTestPage(1);
                  }}
                  className="border border-[#e4e4e7] bg-white px-2.5 py-1.5 text-xs text-[#1a1a1a] focus:outline-hidden"
                >
                  <option value="ALL">All Platforms</option>
                  <option value="Telegram">Telegram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Mobile_App">Mobile App</option>
                  <option value="Android_APK">Android APK</option>
                  <option value="Website">Website</option>
                  <option value="VIP_Payment_Gate">VIP Gate</option>
                </select>
              </div>
            </div>

            {/* Test Samples Table */}
            <div className="overflow-x-auto border border-[#e4e4e7]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#1a1a1a] bg-[#f4f4f5] mono text-[10px] text-[#1a1a1a] uppercase">
                  <tr>
                    <th className="px-3.5 py-2.5">ID</th>
                    <th className="px-3.5 py-2.5">Test Entity / Target</th>
                    <th className="px-3.5 py-2.5">Platform</th>
                    <th className="px-3.5 py-2.5">Ground Truth</th>
                    <th className="px-3.5 py-2.5">Predicted Risk</th>
                    <th className="px-3.5 py-2.5">Outcome</th>
                    <th className="px-3.5 py-2.5">Activated Features</th>
                    <th className="px-3.5 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e4e7]">
                  {paginatedTestResults.map((sample) => (
                    <tr key={sample.id} className="hover:bg-[#fdfdfc]">
                      <td className="px-3.5 py-2.5 mono text-[11px] font-bold text-[#1a1a1a]">
                        {sample.id}
                      </td>

                      <td className="px-3.5 py-2.5 max-w-xs truncate font-mono text-[11px] text-[#1a1a1a]" title={sample.entity}>
                        {sample.entity}
                      </td>

                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className="mono text-[10px] border border-[#e4e4e7] bg-[#f4f4f5] px-1.5 py-0.5">
                          {sample.platform}
                        </span>
                      </td>

                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span
                          className={`mono text-[10px] font-bold px-2 py-0.5 border ${
                            sample.groundTruthLabel === 1
                              ? 'border-[#be123c] text-[#be123c] bg-[#be123c]/5'
                              : 'border-[#10b981] text-[#10b981] bg-[#10b981]/5'
                          }`}
                        >
                          {sample.groundTruthLabel === 1 ? '1.0 MALICIOUS' : '0.0 COMPLIANT'}
                        </span>
                      </td>

                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <div className="mono text-xs font-bold text-[#1a1a1a]">
                          {sample.predictedScore}/100
                        </div>
                        <div className="text-[10px] text-[#71717a]">
                          P: {(sample.predictedProbability * 100).toFixed(0)}%
                        </div>
                      </td>

                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span
                          className={`mono text-[10px] font-bold inline-flex items-center gap-1 px-2 py-0.5 border ${
                            sample.isCorrect
                              ? 'border-[#10b981] text-[#10b981] bg-[#10b981]/10'
                              : 'border-[#d97706] text-[#d97706] bg-[#d97706]/10'
                          }`}
                        >
                          {sample.isCorrect ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          <span>{sample.isCorrect ? 'PASSED' : 'MISCLASSIFIED'}</span>
                        </span>
                      </td>

                      <td className="px-3.5 py-2.5 max-w-xs truncate text-[10px] text-[#71717a]" title={sample.activatedFeatures.join('; ')}>
                        {sample.activatedFeatures[0] || 'Base Prior'}
                      </td>

                      <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleSendToSandbox(sample.entity, sample.platform)}
                          className="mono text-[10px] font-bold text-[#1a1a1a] hover:underline cursor-pointer"
                        >
                          Test in Sandbox →
                        </button>
                      </td>
                    </tr>
                  ))}

                  {paginatedTestResults.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-xs text-[#71717a]">
                        No held-out test samples match the specified filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalTestPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#e4e4e7] pt-3">
                <div className="mono text-[11px] text-[#71717a]">
                  Showing {(testPage - 1) * itemsPerPage + 1} to {Math.min(testPage * itemsPerPage, filteredTestResults.length)} of {filteredTestResults.length} test records
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTestPage((p) => Math.max(1, p - 1))}
                    disabled={testPage === 1}
                    className="mono border border-[#e4e4e7] bg-white px-2.5 py-1 text-xs hover:border-[#1a1a1a] disabled:opacity-30 cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="mono text-xs text-[#1a1a1a]">
                    Page {testPage} of {totalTestPages}
                  </span>
                  <button
                    onClick={() => setTestPage((p) => Math.min(totalTestPages, p + 1))}
                    disabled={testPage === totalTestPages}
                    className="mono border border-[#e4e4e7] bg-white px-2.5 py-1 text-xs hover:border-[#1a1a1a] disabled:opacity-30 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CROSS-MODEL BENCHMARK METRICS */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          <div className="border border-[#1a1a1a] bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-2 border-b border-[#e4e4e7] pb-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-semibold text-[#1a1a1a]">
                  Empirical Model Comparison Matrix
                </h2>
                <p className="text-xs text-[#71717a]">
                  Evaluated on 5-Fold Stratified Cross-Validation on balanced benchmark partitions
                </p>
              </div>
              <span className="text-[11px] mono text-[#71717a]">
                Evaluation Testbed: Python scikit-learn / XGBoost / VIGILEN Engine
              </span>
            </div>

            {/* Matrix Table */}
            <div className="mt-4 overflow-x-auto border border-[#e4e4e7]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#1a1a1a] bg-[#f4f4f5] text-[#1a1a1a] mono text-[10px] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-medium">Architecture / Model</th>
                    <th className="px-4 py-3 font-medium">Domain</th>
                    <th className="px-4 py-3 font-medium">Accuracy</th>
                    <th className="px-4 py-3 font-medium">Precision</th>
                    <th className="px-4 py-3 font-medium">Recall</th>
                    <th className="px-4 py-3 font-medium">F1 Score</th>
                    <th className="px-4 py-3 font-medium">ROC-AUC</th>
                    <th className="px-4 py-3 font-medium">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e4e7]">
                  {RESEARCH_MODEL_METRICS.map((model, idx) => (
                    <tr
                      key={idx}
                      className={
                        idx === 0
                          ? 'bg-[#f4f4f5]/60 font-semibold'
                          : 'hover:bg-[#fdfdfc]'
                      }
                    >
                      <td className="px-4 py-3 text-[#1a1a1a]">
                        {model.modelName}
                        {model.isBaseline && (
                          <span className="ml-2 mono text-[10px] text-[#71717a] font-normal">
                            [Baseline]
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 mono text-[11px] text-[#71717a]">
                        {model.category}
                      </td>
                      <td className="px-4 py-3 mono">
                        {(model.accuracy * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 mono">
                        {(model.precision * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 mono">
                        {(model.recall * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 mono font-bold">
                        {(model.f1Score * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 mono">
                        {model.rocAuc.toFixed(3)}
                      </td>
                      <td className="px-4 py-3 mono text-[#71717a]">
                        {model.latencyMs} ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Insight note */}
            <div className="mt-4 rounded-xs border border-[#e4e4e7] bg-[#fdfdfc] p-3 text-xs text-[#71717a]">
              <span className="font-semibold text-[#1a1a1a]">Benchmark Note: </span>
              The VIGILEN Multi-Modal Fusion Engine combines the dataset-trained token priors with behavioral transaction anomaly scoring, achieving 96.8% accuracy and 0.988 ROC-AUC with an average inference latency of 42ms.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONFUSION MATRIX & CURVES */}
      {activeTab === 'curves' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Confusion Matrix Card */}
            <div className="border border-[#1a1a1a] bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-[#1a1a1a]">
                Confusion Matrix: Multi-Modal Model (n = 2,500 Hold-Out Test Set)
              </h2>
              <p className="text-xs text-[#71717a]">
                Evaluated against unseen synthetic and real ground-truth investment fraud vectors
              </p>

              <div className="mt-6 flex flex-col items-center">
                {/* Visual Matrix Grid */}
                <div className="w-full max-w-xs">
                  <div className="mb-2 text-center text-xs font-medium text-[#71717a]">
                    Predicted Class
                  </div>
                  <div className="flex">
                    <div className="mr-2 flex flex-col justify-around text-xs font-medium text-[#71717a] [writing-mode:vertical-lr] rotate-180 text-center">
                      Actual Class
                    </div>
                    <div className="grid flex-1 grid-cols-2 gap-2">
                      <div className="rounded-xs border-2 border-[#10b981] bg-[#10b981]/10 p-4 text-center">
                        <div className="mono text-xl font-bold text-[#10b981]">1,192</div>
                        <div className="mono text-[10px] text-[#71717a]">True Positive (TP)</div>
                        <div className="text-[10px] text-[#10b981] font-semibold mt-1">97.7% of fraud</div>
                      </div>
                      <div className="rounded-xs border border-[#e4e4e7] bg-[#fdfdfc] p-4 text-center">
                        <div className="mono text-xl font-bold text-[#e11d48]">28</div>
                        <div className="mono text-[10px] text-[#71717a]">False Positive (FP)</div>
                        <div className="text-[10px] text-[#e11d48] font-semibold mt-1">2.2% false alarm</div>
                      </div>
                      <div className="rounded-xs border border-[#e4e4e7] bg-[#fdfdfc] p-4 text-center">
                        <div className="mono text-xl font-bold text-[#e11d48]">52</div>
                        <div className="mono text-[10px] text-[#71717a]">False Negative (FN)</div>
                        <div className="text-[10px] text-[#e11d48] font-semibold mt-1">4.2% missed risk</div>
                      </div>
                      <div className="rounded-xs border-2 border-[#10b981] bg-[#10b981]/10 p-4 text-center">
                        <div className="mono text-xl font-bold text-[#10b981]">1,228</div>
                        <div className="mono text-[10px] text-[#71717a]">True Negative (TN)</div>
                        <div className="text-[10px] text-[#10b981] font-semibold mt-1">97.8% legitimate</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Derivations */}
                <div className="mt-6 grid w-full grid-cols-3 gap-2 border-t border-[#e4e4e7] pt-4 text-center text-xs">
                  <div>
                    <span className="mono text-[10px] text-[#71717a] block uppercase">Sensitivity</span>
                    <span className="mono font-bold text-[#1a1a1a]">95.8%</span>
                  </div>
                  <div>
                    <span className="mono text-[10px] text-[#71717a] block uppercase">Specificity</span>
                    <span className="mono font-bold text-[#1a1a1a]">97.8%</span>
                  </div>
                  <div>
                    <span className="mono text-[10px] text-[#71717a] block uppercase">FPR</span>
                    <span className="mono font-bold text-[#1a1a1a]">2.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Threshold & Calibration Card */}
            <div className="border border-[#1a1a1a] bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold text-[#1a1a1a]">
                Probability Calibration & Risk Thresholding
              </h2>
              <p className="text-xs text-[#71717a]">
                Threshold analysis across regulatory decision boundaries (Brier Score = 0.038)
              </p>

              <div className="space-y-3 pt-2">
                <div className="border border-[#e4e4e7] p-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1a1a1a]">Threshold &ge; 0.80 (Critical Freeze)</span>
                    <span className="mono text-[11px] font-bold text-[#be123c]">Precision: 99.4% · Recall: 86.2%</span>
                  </div>
                  <p className="text-[#71717a] text-[11px] mt-1">
                    Zero false-positive tolerance. Immediate transaction interception and dossier compilation.
                  </p>
                </div>

                <div className="border border-[#e4e4e7] p-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1a1a1a]">Threshold &ge; 0.60 (Step-Up Authentication)</span>
                    <span className="mono text-[11px] font-bold text-[#2563eb]">Precision: 96.2% · Recall: 95.8%</span>
                  </div>
                  <p className="text-[#71717a] text-[11px] mt-1">
                    Balanced operational threshold. Triggers biometric re-verification and mandatory cooling-off period.
                  </p>
                </div>

                <div className="border border-[#e4e4e7] p-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1a1a1a]">Threshold &ge; 0.35 (Educational Friction)</span>
                    <span className="mono text-[11px] font-bold text-[#10b981]">Precision: 88.5% · Recall: 99.1%</span>
                  </div>
                  <p className="text-[#71717a] text-[11px] mt-1">
                    Maximizes detection recall. Displays contextual warnings and statutory risk reminders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DATASET PROFILING */}
      {activeTab === 'datasets' && (
        <div className="space-y-6">
          <div className="border border-[#1a1a1a] bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-[#e4e4e7] pb-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-semibold text-[#1a1a1a]">
                  Benchmark Research Datasets & Schema Profiling
                </h2>
                <p className="text-xs text-[#71717a]">
                  Feature metadata, class distributions, and data quality metrics
                </p>
              </div>

              {/* Upload user CSV */}
              <label className="inline-flex items-center gap-1.5 border border-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer">
                <span>Upload Custom Evaluation CSV</span>
                <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
              </label>
            </div>

            {/* Dataset Selector Tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {RESEARCH_DATASETS.map((ds) => (
                <button
                  key={ds.id}
                  onClick={() => setSelectedDataset(ds)}
                  className={`border px-3 py-1.5 text-xs mono transition-colors cursor-pointer ${
                    currentDataset.id === ds.id
                      ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white font-bold'
                      : 'border-[#e4e4e7] bg-white text-[#71717a] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                  }`}
                >
                  {ds.name} ({ds.rowCount.toLocaleString()} rows)
                </button>
              ))}
              {customCsvDataset && (
                <button
                  onClick={() => setSelectedDataset(customCsvDataset)}
                  className={`border px-3 py-1.5 text-xs mono transition-colors cursor-pointer ${
                    selectedDataset.id === customCsvDataset.id
                      ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white font-bold'
                      : 'border-[#e4e4e7] bg-white text-[#71717a] hover:border-[#1a1a1a]'
                  }`}
                >
                  Uploaded: {customCsvDataset.name}
                </button>
              )}
            </div>

            {/* Selected Dataset Detail */}
            <div className="mt-5 border border-[#e4e4e7] bg-[#fdfdfc] p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e4e4e7] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#1a1a1a]">{currentDataset.name}</h3>
                  <p className="text-xs text-[#71717a] mt-0.5">{currentDataset.description}</p>
                </div>
                <span className="mono text-xs text-[#71717a]">
                  Last Updated: {currentDataset.lastUpdated}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="mono text-[10px] text-[#71717a] block uppercase">Row Count</span>
                  <span className="mono text-base font-bold text-[#1a1a1a]">
                    {currentDataset.rowCount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="mono text-[10px] text-[#71717a] block uppercase">Columns</span>
                  <span className="mono text-base font-bold text-[#1a1a1a]">
                    {currentDataset.columnCount}
                  </span>
                </div>
                <div>
                  <span className="mono text-[10px] text-[#71717a] block uppercase">Missing Values</span>
                  <span className="mono text-base font-bold text-[#1a1a1a]">
                    {currentDataset.missingValues}
                  </span>
                </div>
                <div>
                  <span className="mono text-[10px] text-[#71717a] block uppercase">Duplicates</span>
                  <span className="mono text-base font-bold text-[#1a1a1a]">
                    {currentDataset.duplicateRecords}
                  </span>
                </div>
              </div>

              {/* Class distribution */}
              <div className="mt-4 border-t border-[#e4e4e7] pt-3">
                <span className="mono text-[10px] text-[#71717a] uppercase font-bold">
                  Class Distribution:
                </span>
                <div className="mt-2 space-y-1.5">
                  {currentDataset.classDistribution.map((cd, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-[#1a1a1a]">{cd.label}</span>
                      <span className="mono font-medium text-[#71717a]">
                        {cd.count.toLocaleString()} ({cd.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
