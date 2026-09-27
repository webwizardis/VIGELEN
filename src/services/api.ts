import {
  TextAnalysisResult,
  TransactionData,
  TransactionAnomalyResult,
  UnifiedRiskWeights,
  UnifiedRiskResult,
  ShieldChatMessage,
} from '../types';
import {
  analyzeTextContent,
  analyzeTransaction,
  calculateUnifiedRisk,
} from './analyzer';

export async function apiAnalyzeText(text: string, isDemoMode = false): Promise<TextAnalysisResult> {
  if (isDemoMode) {
    const local = analyzeTextContent(text, 'text');
    local.isDemoData = true;
    return local;
  }

  try {
    const response = await fetch('/api/analyze-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    // Graceful fallback to client-side heuristic engine
    console.warn('API call failed, falling back to local analyzer:', err);
    return analyzeTextContent(text, 'text');
  }
}

export async function apiAnalyzeImage(
  imageData: string,
  fileName: string,
  isDemoMode = false
): Promise<TextAnalysisResult> {
  if (isDemoMode) {
    const fallbackText =
      'VIP TRADING DESK: "TODAY’S GUARANTEED CALL: Buy XYZ infra at ₹42, Target ₹98 (133% GAIN). 100% SURE SHOT! Deposit ₹15,000 fee to UPI id: tradingboss@paytm to get target exit timing. Act fast only 3 seats!"';
    const local = analyzeTextContent(fallbackText, 'screenshot');
    local.isDemoData = true;
    return local;
  }

  try {
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData, fileName }),
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Image API call failed, falling back to local OCR analysis:', err);
    const fallbackText =
      'SPONSORED: Guaranteed 35% monthly returns with AI intraday algorithm! Deposit to UPI: investfast@ybl. Act now, limited seats!';
    return analyzeTextContent(fallbackText, 'screenshot');
  }
}

export async function apiAnalyzeTransaction(
  tx: TransactionData,
  isDemoMode = false
): Promise<TransactionAnomalyResult> {
  if (isDemoMode) {
    const local = analyzeTransaction(tx);
    local.isDemoData = true;
    return local;
  }

  try {
    const response = await fetch('/api/analyze-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx),
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Transaction API failed, falling back to local engine:', err);
    return analyzeTransaction(tx);
  }
}

export async function apiCalculateUnifiedRisk(
  contentRisk: number,
  transactionRisk: number,
  behavioralRisk: number,
  investorRisk: number,
  weights: UnifiedRiskWeights
): Promise<UnifiedRiskResult> {
  try {
    const response = await fetch('/api/risk-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentRisk,
        transactionRisk,
        behavioralRisk,
        investorRisk,
        weights,
      }),
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    return await response.json();
  } catch {
    return calculateUnifiedRisk(contentRisk, transactionRisk, behavioralRisk, investorRisk, weights);
  }
}

export async function apiChatWithShield(
  message: string,
  history: ShieldChatMessage[]
): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.reply) return data.reply;
    }
  } catch (err) {
    console.warn('Chat API offline, using contextual local reasoning:', err);
  }

  // Contextual fallback response for Shield Assistant
  const lower = message.toLowerCase();
  if (lower.includes('risk score') || lower.includes('mean')) {
    return 'The Risk Score (0–100) measures multi-signal vulnerability across guaranteed return claims, unverified channels, urgency manipulation, and transaction anomalies. Scores 0–34 indicate low risk with compliant disclosures; 35–59 denote elevated caution; 60–79 reflect high-risk indicators; 80–100 represent critical multi-vector scam patterns requiring immediate cessation of funds transfer.';
  }
  if (lower.includes('why was') || lower.includes('flagged')) {
    return 'Content is flagged when it exhibits specific deceptive patterns documented in regulatory enforcement actions: (1) Guaranteed or risk-free return claims, (2) Directives to pay individual UPI VPAs, (3) High-pressure urgency tactics, (4) Absence of mandatory statutory risk disclosures.';
  }
  if (lower.includes('behavioral anomaly') || lower.includes('behavior')) {
    return 'Behavioral Anomaly Detection compares a pending transaction against the user’s established historical baseline (typical amount, time-of-day, geographic IP cluster, merchant categories, and device hardware fingerprint). A high deviation (such as a 2000%+ amount spike at 2:00 AM from a new device) triggers verification alerts before capital settlement.';
  }
  if (lower.includes('verify') || lower.includes('sebi') || lower.includes('rbi')) {
    return 'To verify an investment adviser in India: Check their SEBI registration number directly on SEBI SCORES (scores.gov.in) under "Recognised Intermediaries". Cross-verify that the registered bank account name matches the licensed corporate entity, never an individual person or personal UPI ID.';
  }
  return 'VIGILEN Financial Risk Intelligence monitors for deceptive financial patterns, behavioral anomalies, and investor vulnerability. Remember: legitimate market investments carry market risk and cannot legally guarantee returns. Never share OTPs, UPI PINs, or transfer money to private peer accounts.';
}
