export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IndicatorCategory =
  | 'GUARANTEE_CLAIM'
  | 'URGENCY_FOMO'
  | 'UNVERIFIED_SOURCE'
  | 'PRESSURE_TACTIC'
  | 'SUSPICIOUS_CONTACT'
  | 'COMMISSION_PYRAMID'
  | 'IMPERSONATION'
  | 'MISSING_DISCLOSURE'
  | 'REGULATORY_BLACKLIST';

export interface MatchedRegulatoryRecord {
  id: string;
  sourceAgency: 'NSE' | 'RBI' | 'SEBI';
  sourceRecordId: string;
  rawEntity: string;
  normalizedEntity: string;
  channelPlatform: string;
  threatClassification: string;
  labelBasis: string;
  recommendedAction: string;
  dateOrPeriod?: string;
  notes?: string;
}

export interface DetectedIndicator {
  id: string;
  category: IndicatorCategory;
  label: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  highlightText?: string;
  contributionScore: number; // For XAI attribution (0-100)
}

export interface InvestmentClaim {
  promisedReturn: string;
  timeHorizon: string;
  guaranteeLanguageDetected: boolean;
  riskDisclosureDetected: boolean;
  urgencyDetected: boolean;
  sourceVerificationStatus: 'UNVERIFIED' | 'SUSPICIOUS' | 'VERIFIED' | 'UNKNOWN';
  claimRiskIndex: number; // 0-100
  factualExtraction: string;
  riskIndicators: string[];
  aiInterpretation: string;
}

export interface TextAnalysisResult {
  id: string;
  timestamp: string;
  inputText: string;
  inputType: 'text' | 'screenshot' | 'claim';
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  classification: string;
  confidence: number; // 0.0 to 1.0
  indicators: DetectedIndicator[];
  claim?: InvestmentClaim;
  matchedRegulatoryRecord?: MatchedRegulatoryRecord;
  explanation: {
    summary: string;
    whyFlagged: string[];
    topSignals: { label: string; impact: number; direction: 'increases_risk' | 'decreases_risk' }[];
  };
  recommendedActions: string[];
  disclaimer: string;
  isDemoData: boolean;
}

export interface TransactionData {
  id?: string;
  amount: number;
  currency: string;
  transactionTime: string; // HH:mm or ISO
  merchant: string;
  transactionType: 'UPI_P2P' | 'UPI_P2M' | 'IMPS_NEFT' | 'CARD_ONLINE' | 'CARD_POS' | 'CRYPTO_GATEWAY';
  location: string;
  device: string;
  accountAgeMonths: number;
  historicalAvgAmount: number;
  historicalFrequencyPerDay: number;
  currentDailyCount: number;
}

export interface TransactionAnomalyResult {
  id: string;
  timestamp: string;
  transaction: TransactionData;
  riskScore: number;
  riskLevel: RiskLevel;
  classification: string;
  confidence: number;
  anomalies: {
    type: 'AMOUNT' | 'TIME' | 'LOCATION' | 'MERCHANT' | 'DEVICE' | 'FREQUENCY';
    detected: boolean;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    deviationPercent?: number;
    contributionScore: number;
  }[];
  behavioralComparison: {
    typicalAmount: number;
    currentAmount: number;
    amountDeviationPercent: number;
    typicalTimeWindow: string;
    currentTime: string;
    typicalLocations: string[];
    currentLocation: string;
    isLocationFamiliar: boolean;
    typicalDevice: string;
    currentDevice: string;
    isDeviceFamiliar: boolean;
    behavioralAnomalyScore: number;
    naturalLanguageReason: string[];
  };
  isDemoData: boolean;
}

export interface UnifiedRiskWeights {
  contentWeight: number; // e.g. 0.30
  transactionWeight: number; // e.g. 0.35
  behaviorWeight: number; // e.g. 0.20
  investorWeight: number; // e.g. 0.15
}

export interface UnifiedRiskResult {
  id: string;
  timestamp: string;
  contentRiskScore: number;
  transactionRiskScore: number;
  behavioralRiskScore: number;
  investorRiskScore: number;
  combinedRiskScore: number;
  riskLevel: RiskLevel;
  weightsUsed: UnifiedRiskWeights;
  formulaString: string;
  breakdown: {
    component: string;
    rawScore: number;
    weight: number;
    weightedContribution: number;
  }[];
  recommendation: string;
}

export interface InvestorAssessmentQuestion {
  id: string;
  question: string;
  description: string;
  options: {
    label: string;
    riskPoints: number; // higher = higher risk
  }[];
}

export interface InvestorProfileResult {
  score: number; // 0 - 100
  profileLevel: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK';
  title: string;
  description: string;
  vulnerabilityFactors: string[];
  safeActions: string[];
}

export interface ScamJourneyStage {
  step: number;
  title: string;
  channel: string;
  userPerspective: string;
  scammerTactic: string;
  warningSigns: string[];
  investorVerificationStep: string;
  riskScore: number;
}

export interface ModelMetric {
  modelName: string;
  category: 'NLP' | 'TRANSACTION' | 'ANOMALY';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  latencyMs: number;
  isBaseline?: boolean;
}

export interface DatasetInfo {
  id: string;
  name: string;
  description: string;
  type: 'TEXT_SCAMS' | 'TRANSACTIONS' | 'INVESTOR_SURVEYS';
  rowCount: number;
  columnCount: number;
  missingValues: number;
  duplicateRecords: number;
  classDistribution: { label: string; count: number; percentage: number }[];
  features: { name: string; type: 'categorical' | 'numerical' | 'text'; missingPct: number }[];
  lastUpdated: string;
}

export interface ScamCaseStudy {
  id: string;
  title: string;
  year: number;
  location: string;
  scamMechanism: string;
  financialImpact: string;
  victimVulnerability: string;
  warningIndicators: string[];
  regulatoryResponse: string;
  lessonsLearned: string[];
  officialSourceCitation: string;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'HIGH_RISK' | 'SUSPICIOUS_TRANSACTION' | 'MODEL_EVAL' | 'DATASET_UPDATE' | 'INFO';
  read: boolean;
  linkTab?: string;
}

export interface ShieldChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  suggestedFollowUps?: string[];
}

export interface SystemStatus {
  nlpEngine: { status: 'OPERATIONAL' | 'DEGRADED'; latencyMs: number; model: string };
  transactionModel: { status: 'OPERATIONAL' | 'DEGRADED'; latencyMs: number; model: string };
  anomalyDetection: { status: 'OPERATIONAL' | 'DEGRADED'; latencyMs: number; model: string };
  explainabilityEngine: { status: 'OPERATIONAL' | 'DEGRADED'; latencyMs: number; model: string };
  geminiConnected: boolean;
  mode: 'DEMO' | 'REAL_AI';
}

export type CaseStatus =
  | 'OPEN'
  | 'UNDER_REVIEW'
  | 'NEEDS_VERIFICATION'
  | 'FLAGGED'
  | 'RESOLVED'
  | 'FALSE_POSITIVE'
  | 'CLOSED';
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface InvestigationEvidence {
  id: string;
  type: 'CONTENT' | 'TRANSACTION' | 'BEHAVIORAL' | 'DOCUMENT' | 'USER_REPORT';
  title: string;
  timestamp: string;
  summary: string;
  riskScore: number;
  tags: string[];
  rawDetails?: Record<string, unknown>;
}

export type RiskEventType =
  | 'CONTENT_ANALYSIS'
  | 'CLAIM_DETECTION'
  | 'TRANSACTION_ANALYSIS'
  | 'BEHAVIORAL_ANOMALY'
  | 'REGULATORY_VERIFICATION'
  | 'ALERT_TRIGGERED'
  | 'INTERVENTION';

export interface RiskProgressionEvent {
  id: string;
  timestamp: string;
  timeLabel: string;
  eventType: RiskEventType;
  title: string;
  description: string;
  actor: string;
  riskScore: number;
  deltaScore: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  keySignals: string[];
  metrics?: { label: string; value: string; color?: string }[];
  evidenceSnippet?: string;
  statusLabel?: string;
}

export interface InvestigationTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  type: 'ALERT' | 'STATUS_CHANGE' | 'NOTE' | 'EVIDENCE_ADDED' | 'VERIFICATION';
}

export interface InvestigationCase {
  id: string;
  caseNumber: string;
  title: string;
  entityName: string;
  createdAt: string;
  updatedAt: string;
  status: CaseStatus;
  priority: CasePriority;
  riskScore: number;
  assignedAnalyst: string;
  summary: string;
  category: string;
  evidence: InvestigationEvidence[];
  timeline: InvestigationTimelineEvent[];
  riskProgression?: RiskProgressionEvent[];
  notes: string[];
}


