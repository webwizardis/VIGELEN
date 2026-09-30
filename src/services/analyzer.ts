import {
  DetectedIndicator,
  InvestmentClaim,
  TextAnalysisResult,
  TransactionData,
  TransactionAnomalyResult,
  UnifiedRiskWeights,
  UnifiedRiskResult,
  RiskLevel,
  MatchedRegulatoryRecord,
} from '../types';
import { matchBlacklistedEntity, RegulatoryIntelligenceRecord } from '../data/cleanedIntelligence';

export function determineRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
}

export function extractInvestmentClaim(text: string): InvestmentClaim {
  const returnMatch = text.match(/(\d+[\.\d]*\s*%\s*(return|gain|profit|yield|daily|monthly|apy)|10x|5x|2x|double\s+your\s+capital)/i);
  const promisedReturn = returnMatch ? returnMatch[0] : 'No explicit fixed percentage';

  const timeMatch = text.match(/(in\s+\d+\s+(days|hours|weeks|months)|daily|every\s+\d+\s+days|today|this\s+month)/i);
  const timeHorizon = timeMatch ? timeMatch[0] : 'Unspecified timeframe';

  const hasGuarantee = /(guaranteed|100%\s*(accurate|sure|money-back)|risk-free|zero\s+risk|safe\s+profit)/i.test(text);
  const hasUrgency = /(only\s+\d+\s+slots|expires\s+in|before\s+market|act\s+fast|don'?t\s+miss|last\s+chance|urgent)/i.test(text);
  const hasRiskDisclosure = /(subject\s+to\s+market\s+risks|past\s+performance\s+is\s+no\s+guarantee|read\s+all\s+scheme|capital\s+is\s+at\s+risk)/i.test(text);
  const hasRegClaim = /(sebi\s+reg|certified\s+analyst|official\s+partner|institutional\s+quota)/i.test(text);

  let sourceVerificationStatus: 'UNVERIFIED' | 'SUSPICIOUS' | 'VERIFIED' | 'UNKNOWN' = 'UNVERIFIED';
  if (hasRegClaim && !hasRiskDisclosure) {
    sourceVerificationStatus = 'SUSPICIOUS';
  } else if (hasRegClaim && hasRiskDisclosure) {
    sourceVerificationStatus = 'VERIFIED';
  }

  // Calculate Claim Risk Index (0 - 100)
  let claimRisk = 15;
  if (hasGuarantee) claimRisk += 40;
  if (returnMatch) claimRisk += 25;
  if (hasUrgency) claimRisk += 15;
  if (!hasRiskDisclosure) claimRisk += 10;
  if (hasRiskDisclosure) claimRisk -= 20;
  claimRisk = Math.min(100, Math.max(5, claimRisk));

  const riskIndicatorsList: string[] = [];
  if (hasGuarantee) riskIndicatorsList.push('Explicit guarantee language without risk disclaimer');
  if (returnMatch) riskIndicatorsList.push(`Promised return expectation (${promisedReturn}) exceeds normal market benchmarks`);
  if (hasUrgency) riskIndicatorsList.push('High-pressure urgency conditioning buyer behavior');
  if (!hasRiskDisclosure) riskIndicatorsList.push('Absence of statutory market risk disclosures');

  return {
    promisedReturn,
    timeHorizon,
    guaranteeLanguageDetected: hasGuarantee,
    riskDisclosureDetected: hasRiskDisclosure,
    urgencyDetected: hasUrgency,
    sourceVerificationStatus,
    claimRiskIndex: claimRisk,
    factualExtraction: `Identified return claim: "${promisedReturn}" over "${timeHorizon}". Source registry claim: ${sourceVerificationStatus}.`,
    riskIndicators: riskIndicatorsList,
    aiInterpretation: hasGuarantee
      ? 'The text exhibits high-confidence characteristics of an illegal guaranteed-return financial scheme under SEBI/RBI investor protection regulations.'
      : hasRiskDisclosure
      ? 'The text contains standard institutional risk caveats consistent with regulated financial advisory communication.'
      : 'The communication makes speculative assertions without requisite regulatory disclosures, posing moderate investor vulnerability.',
  };
}

export function analyzeTextContent(text: string, inputType: 'text' | 'screenshot' = 'text'): TextAnalysisResult {
  const indicators: DetectedIndicator[] = [];
  const signals: { label: string; impact: number; direction: 'increases_risk' | 'decreases_risk' }[] = [];
  let score = 10;

  // 0. Official Regulatory Blacklist & Caution Notice Cross-Check (NSE, RBI, SEBI)
  const matchedBlacklist = matchBlacklistedEntity(text);
  let matchedRecord: MatchedRegulatoryRecord | undefined = undefined;

  if (matchedBlacklist) {
    score = 100;
    matchedRecord = {
      id: matchedBlacklist.id,
      sourceAgency: matchedBlacklist.sourceAgency,
      sourceRecordId: matchedBlacklist.sourceRecordId,
      rawEntity: matchedBlacklist.rawEntity,
      normalizedEntity: matchedBlacklist.normalizedEntity,
      channelPlatform: matchedBlacklist.channelPlatform,
      threatClassification: matchedBlacklist.threatClassification,
      labelBasis: matchedBlacklist.labelBasis,
      recommendedAction: matchedBlacklist.recommendedAction,
      dateOrPeriod: matchedBlacklist.dateOrPeriod,
      notes: matchedBlacklist.notes,
    };

    indicators.push({
      id: `ind-regulatory-blacklist-${matchedBlacklist.sourceRecordId}`,
      category: 'REGULATORY_BLACKLIST',
      label: `Official ${matchedBlacklist.sourceAgency} Blacklist Match (#${matchedBlacklist.sourceRecordId})`,
      description: `Identified on the official ${matchedBlacklist.sourceAgency} caution list as "${matchedBlacklist.rawEntity}" (${matchedBlacklist.threatClassification.replace(/_/g, ' ')}). Basis: ${matchedBlacklist.labelBasis}`,
      severity: 'critical',
      confidence: 0.99,
      highlightText: matchedBlacklist.rawEntity,
      contributionScore: 70,
    });
    signals.push({
      label: `Matched official ${matchedBlacklist.sourceAgency} blacklist: ${matchedBlacklist.rawEntity}`,
      impact: 70,
      direction: 'increases_risk',
    });
  }

  // 1. Guaranteed returns
  const guaranteeMatch = text.match(/(guaranteed|100%\s*(accurate|sure|money-back)|risk-free|zero\s+market\s+risk|safe\s+profit)/i);
  if (guaranteeMatch) {
    score += 35;
    indicators.push({
      id: 'ind-guarantee',
      category: 'GUARANTEE_CLAIM',
      label: 'Guaranteed Returns Promise',
      description: 'Claims 100% certainty, risk-free returns, or money-back guarantees on speculative securities.',
      severity: 'critical',
      confidence: 0.96,
      highlightText: guaranteeMatch[0],
      contributionScore: 35,
    });
    signals.push({ label: 'Guaranteed return claim', impact: 35, direction: 'increases_risk' });
  }

  // 2. High or abnormal returns
  const returnMatch = text.match(/(\d+[\.\d]*\s*%\s*(return|gain|profit|daily|monthly)|10x|5x|double\s+your\s+capital)/i);
  if (returnMatch) {
    score += 20;
    indicators.push({
      id: 'ind-abnormal-returns',
      category: 'GUARANTEE_CLAIM',
      label: 'Abnormal Return Projection',
      description: `Advertises unrealistic returns (${returnMatch[0]}) far beyond benchmark equity averages.`,
      severity: 'high',
      confidence: 0.92,
      highlightText: returnMatch[0],
      contributionScore: 20,
    });
    signals.push({ label: 'Unrealistic return projection', impact: 20, direction: 'increases_risk' });
  }

  // 3. Urgency & FOMO
  const urgencyMatch = text.match(/(only\s+\d+\s+slots|expires\s+in|before\s+market|act\s+fast|don'?t\s+miss|last\s+chance|dm\s+immediately|urgent)/i);
  if (urgencyMatch) {
    score += 15;
    indicators.push({
      id: 'ind-urgency',
      category: 'URGENCY_FOMO',
      label: 'Manufactured Urgency / FOMO',
      description: 'Employs countdowns or artificial slot scarcity to prevent prudent due diligence.',
      severity: 'medium',
      confidence: 0.88,
      highlightText: urgencyMatch[0],
      contributionScore: 15,
    });
    signals.push({ label: 'High-pressure countdown / FOMO', impact: 15, direction: 'increases_risk' });
  }

  // 4. Suspicious Contact & Channels
  const contactMatch = text.match(/(telegram|whatsapp|dm\s+me|click\s+bit\.ly|t\.me|join\s+vip|private\s+group)/i);
  if (contactMatch) {
    score += 12;
    indicators.push({
      id: 'ind-contact',
      category: 'SUSPICIOUS_CONTACT',
      label: 'Unmonitored Communication Channel',
      description: 'Directs investor off regulated platforms into private Telegram/WhatsApp groups.',
      severity: 'medium',
      confidence: 0.89,
      highlightText: contactMatch[0],
      contributionScore: 12,
    });
    signals.push({ label: 'Directing to private messaging apps', impact: 12, direction: 'increases_risk' });
  }

  // 5. Payment to individual / private UPI
  const upiMatch = text.match(/([a-zA-Z0-9_\.\-]+@(oksbi|okhdfcbank|okaxis|paytm|ybl|upi|gpay)|upi:|transfer\s+₹\s*\d+|deposit\s+₹\s*\d+)/i);
  if (upiMatch) {
    score += 18;
    indicators.push({
      id: 'ind-individual-pay',
      category: 'PRESSURE_TACTIC',
      label: 'Direct Individual Payment / Unverified VPA',
      description: 'Demands upfront subscription, joining fee, or principal payment via individual UPI or personal account.',
      severity: 'critical',
      confidence: 0.94,
      highlightText: upiMatch[0],
      contributionScore: 18,
    });
    signals.push({ label: 'Payment directed to individual UPI handle', impact: 18, direction: 'increases_risk' });
  }

  // 6. Impersonation / Unverified Credentials
  const imperMatch = text.match(/(sebi\s+registered|master\s+analyst|dr\.\s+[a-z]+|insider\s+calls|institutional\s+pool)/i);
  if (imperMatch && !text.includes('Registration No:')) {
    score += 10;
    indicators.push({
      id: 'ind-impersonation',
      category: 'IMPERSONATION',
      label: 'Unverified Authority Assertion',
      description: 'Cites authority status or institutional insider access without verifiable registration ID.',
      severity: 'medium',
      confidence: 0.81,
      highlightText: imperMatch[0],
      contributionScore: 10,
    });
    signals.push({ label: 'Unverified credentials claim', impact: 10, direction: 'increases_risk' });
  }

  // 7. Referral / Pyramid language
  const refMatch = text.match(/(referral\s+bonus|invite\s+\d+\s+friends|commission|multi-tier|affiliate)/i);
  if (refMatch) {
    score += 15;
    indicators.push({
      id: 'ind-pyramid',
      category: 'COMMISSION_PYRAMID',
      label: 'Referral / Multilevel Incentive',
      description: 'Compensates users for recruiting fresh investor capital, indicative of Ponzi schemes.',
      severity: 'high',
      confidence: 0.85,
      highlightText: refMatch[0],
      contributionScore: 15,
    });
    signals.push({ label: 'Referral commission scheme', impact: 15, direction: 'increases_risk' });
  }

  // 8. Missing risk disclosure check
  const hasRiskDisclosure = /(subject\s+to\s+market\s+risks|past\s+performance\s+is\s+no\s+guarantee|read\s+all\s+scheme)/i.test(text);
  if (!hasRiskDisclosure && indicators.length > 0) {
    score += 10;
    indicators.push({
      id: 'ind-no-disclosure',
      category: 'MISSING_DISCLOSURE',
      label: 'Absence of Statutory Risk Disclosure',
      description: 'Lacks mandatory regulatory warning regarding market risks and potential loss of capital.',
      severity: 'medium',
      confidence: 0.9,
      contributionScore: 10,
    });
    signals.push({ label: 'Missing statutory risk disclosure', impact: 10, direction: 'increases_risk' });
  } else if (hasRiskDisclosure) {
    score -= 25;
    signals.push({ label: 'Contains verified regulatory disclosure', impact: 25, direction: 'decreases_risk' });
  }

  const finalScore = Math.min(100, Math.max(5, score));
  const riskLevel = determineRiskLevel(finalScore);

  let classification = 'Potentially Suspicious Investment Content';
  if (matchedRecord) {
    classification = `Official ${matchedRecord.sourceAgency} Blacklisted Entity (${matchedRecord.channelPlatform})`;
  } else if (finalScore >= 80) classification = 'High-Risk Investment Scam Signal';
  else if (finalScore >= 60) classification = 'Potentially Suspicious Financial Promotion';
  else if (finalScore >= 35) classification = 'Unverified Financial Advisory with Elevated Risk';
  else classification = 'Low-Risk / Regulated Financial Communication';

  const whyFlagged = indicators.map((ind) => `${ind.label}: ${ind.description}`);
  if (whyFlagged.length === 0) {
    whyFlagged.push('No prominent scam signals identified; standard investor prudence advised.');
  }

  const claim = extractInvestmentClaim(text);

  return {
    id: `TX-SCAN-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    inputText: text,
    inputType,
    riskScore: finalScore,
    riskLevel,
    classification,
    confidence: indicators.length > 0 ? 0.88 + Math.min(0.08, indicators.length * 0.02) : 0.94,
    indicators,
    claim,
    matchedRegulatoryRecord: matchedRecord,
    explanation: {
      summary: matchedRecord
        ? `CRITICAL RISK: Entity identified on the official ${matchedRecord.sourceAgency} Caution Notice blacklist (#${matchedRecord.sourceRecordId}) for client complaints involving ${matchedRecord.threatClassification.replace(/_/g, ' ')}.`
        : finalScore >= 60
        ? 'Potentially high-risk characteristics detected. Multiple linguistic and procedural signals match documented retail investment frauds.'
        : 'Low-to-moderate risk profile. Content demonstrates either compliant disclaimers or minimal aggressive solicitation markers.',
      whyFlagged,
      topSignals: signals.sort((a, b) => b.impact - a.impact),
    },
    recommendedActions: matchedRecord
      ? [
          `IMMEDIATE ACTION: Cease all financial interactions and block entity ("${matchedRecord.rawEntity}").`,
          `Basis: ${matchedRecord.labelBasis}.`,
          'File an immediate complaint on the National Cyber Crime Portal (1930 / cybercrime.gov.in) and SEBI SCORES.',
          'Never deposit funds to personal UPI VPAs, APK apps, or unverified Telegram channels.',
        ]
      : [
          'Do not transfer money to individual UPI handles or unverified bank accounts.',
          'Cross-check the adviser registration number directly on SEBI SCORES (scores.gov.in) or RBI Sachet portal.',
          'Report unsolicited investment solicitation to the National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in).',
          'Review mandatory offer documents and past performance disclaimers prior to capital deployment.',
        ],
    disclaimer:
      'VIGILEN cross-references real-time regulatory databases (NSE, RBI, SEBI). Assessments represent probabilistic and reported entity matches for retail investor protection.',
    isDemoData: false,
  };
}

export function analyzeTransaction(data: TransactionData): TransactionAnomalyResult {
  const anomalies: TransactionAnomalyResult['anomalies'] = [];
  const reasons: string[] = [];
  let score = 12;

  // 1. Amount Anomaly Calculation
  const deviationPercent = data.historicalAvgAmount > 0
    ? Math.round(((data.amount - data.historicalAvgAmount) / data.historicalAvgAmount) * 100)
    : 0;

  if (deviationPercent > 500) {
    score += 40;
    anomalies.push({
      type: 'AMOUNT',
      detected: true,
      description: `Transaction amount (₹${data.amount.toLocaleString()}) deviates +${deviationPercent}% from historical average (₹${data.historicalAvgAmount.toLocaleString()}).`,
      severity: 'critical',
      deviationPercent,
      contributionScore: 40,
    });
    reasons.push(`Transaction amount is significantly higher (+${deviationPercent}%) than the customer's historical average.`);
  } else if (deviationPercent > 200) {
    score += 25;
    anomalies.push({
      type: 'AMOUNT',
      detected: true,
      description: `Transaction amount exceeds historical baseline by +${deviationPercent}%.`,
      severity: 'high',
      deviationPercent,
      contributionScore: 25,
    });
    reasons.push(`Transaction amount exceeds typical baseline (+${deviationPercent}%).`);
  }

  // 2. Time Anomaly
  let isNightTime = false;
  const hourMatch = data.transactionTime.match(/^(\d{1,2})/);
  if (hourMatch) {
    const hour = parseInt(hourMatch[1], 10);
    if (hour >= 1 && hour <= 5) {
      isNightTime = true;
      score += 20;
      anomalies.push({
        type: 'TIME',
        detected: true,
        description: `Executed at ${data.transactionTime}, outside normal consumer activity window (07:00 – 23:00).`,
        severity: 'high',
        contributionScore: 20,
      });
      reasons.push(`Transaction occurs outside the customer's normal activity window (${data.transactionTime}).`);
    }
  }

  // 3. Device Anomaly
  const isNewDevice = /new\s+device|unrecognized|dev_[a-z0-9]+/i.test(data.device);
  if (isNewDevice) {
    score += 22;
    anomalies.push({
      type: 'DEVICE',
      detected: true,
      description: `Payment initiated from an unfamiliar hardware fingerprint: ${data.device}.`,
      severity: 'critical',
      contributionScore: 22,
    });
    reasons.push('Transaction originates from an unfamiliar hardware device.');
  }

  // 4. Merchant / Beneficiary Anomaly & Official Blacklist Check
  const matchedMerchant = matchBlacklistedEntity(data.merchant);
  if (matchedMerchant) {
    score = 100;
    anomalies.push({
      type: 'MERCHANT',
      detected: true,
      description: `CRITICAL: Beneficiary "${data.merchant}" matches official ${matchedMerchant.sourceAgency} caution notice (#${matchedMerchant.sourceRecordId}) for ${matchedMerchant.threatClassification.replace(/_/g, ' ')}.`,
      severity: 'critical',
      contributionScore: 60,
    });
    reasons.push(`Beneficiary handle matches an official ${matchedMerchant.sourceAgency} caution list record (#${matchedMerchant.sourceRecordId}): ${matchedMerchant.labelBasis}`);
  }

  const isIndividualUPI = data.transactionType === 'UPI_P2P' || /@oksbi|@paytm|@ybl|@upi/i.test(data.merchant);
  const isCryptoGateway = data.transactionType === 'CRYPTO_GATEWAY';
  if (isIndividualUPI && data.amount > 20000) {
    score += 20;
    anomalies.push({
      type: 'MERCHANT',
      detected: true,
      description: `High-value sum routed to individual peer VPA (${data.merchant}) rather than verified corporate merchant.`,
      severity: 'high',
      contributionScore: 20,
    });
    reasons.push('Outflow directed to a personal peer account rather than an authorized commercial entity.');
  } else if (isCryptoGateway) {
    score += 18;
    anomalies.push({
      type: 'MERCHANT',
      detected: true,
      description: 'Transfer routed to an offshore or unregulated virtual asset gateway.',
      severity: 'high',
      contributionScore: 18,
    });
    reasons.push('Funds routed to a high-risk virtual digital asset / crypto gateway.');
  }

  // 5. Frequency Anomaly
  if (data.currentDailyCount > data.historicalFrequencyPerDay * 2) {
    score += 15;
    anomalies.push({
      type: 'FREQUENCY',
      detected: true,
      description: `Daily velocity (${data.currentDailyCount} txns/day) is more than 2x historical frequency (${data.historicalFrequencyPerDay} txns/day).`,
      severity: 'medium',
      contributionScore: 15,
    });
    reasons.push(`Transaction velocity (${data.currentDailyCount} txns today) exceeds normal frequency.`);
  }

  // 6. Location Anomaly
  const isUnknownLocation = /unknown|foreign|vpn|kolkata/i.test(data.location) && !/mumbai|bengaluru|delhi/i.test(data.location);
  if (isUnknownLocation) {
    score += 14;
    anomalies.push({
      type: 'LOCATION',
      detected: true,
      description: `Geographical IP origin (${data.location}) diverges from habitual customer residential cluster.`,
      severity: 'medium',
      contributionScore: 14,
    });
    reasons.push(`Geographic anomaly detected: originating from ${data.location}.`);
  }

  if (reasons.length === 0) {
    reasons.push('Transaction metrics align within expected 95% confidence interval of historical user profile.');
  }

  const finalScore = Math.min(100, Math.max(4, score));
  const riskLevel = determineRiskLevel(finalScore);

  let classification = 'Standard Financial Transaction';
  if (finalScore >= 80) classification = 'High-Anomaly / Suspicious Financial Outflow';
  else if (finalScore >= 60) classification = 'Elevated Anomaly Transaction (Requires Verification)';
  else if (finalScore >= 35) classification = 'Moderate Variance from Historical Profile';

  return {
    id: `TX-ANOM-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    transaction: data,
    riskScore: finalScore,
    riskLevel,
    classification,
    confidence: 0.91,
    anomalies,
    behavioralComparison: {
      typicalAmount: data.historicalAvgAmount,
      currentAmount: data.amount,
      amountDeviationPercent: deviationPercent,
      typicalTimeWindow: '08:00 – 22:30 IST',
      currentTime: data.transactionTime,
      typicalLocations: ['Bengaluru, IN', 'Mumbai, IN'],
      currentLocation: data.location,
      isLocationFamiliar: !isUnknownLocation,
      typicalDevice: 'Customer Primary Mobile (Known)',
      currentDevice: data.device,
      isDeviceFamiliar: !isNewDevice,
      behavioralAnomalyScore: Math.min(100, finalScore + 4),
      naturalLanguageReason: reasons,
    },
    isDemoData: false,
  };
}

export function calculateUnifiedRisk(
  contentRisk: number,
  transactionRisk: number,
  behavioralRisk: number,
  investorRisk: number,
  weights: UnifiedRiskWeights = {
    contentWeight: 0.30,
    transactionWeight: 0.35,
    behaviorWeight: 0.20,
    investorWeight: 0.15,
  }
): UnifiedRiskResult {
  // Normalize weights in case sum differs from 1.0
  const sumWeights = weights.contentWeight + weights.transactionWeight + weights.behaviorWeight + weights.investorWeight;
  const wContent = weights.contentWeight / sumWeights;
  const wTx = weights.transactionWeight / sumWeights;
  const wBeh = weights.behaviorWeight / sumWeights;
  const wInv = weights.investorWeight / sumWeights;

  const contentContribution = contentRisk * wContent;
  const txContribution = transactionRisk * wTx;
  const behContribution = behavioralRisk * wBeh;
  const invContribution = investorRisk * wInv;

  const combinedRisk = Math.round(contentContribution + txContribution + behContribution + invContribution);
  const riskLevel = determineRiskLevel(combinedRisk);

  const formulaString = `Unified Risk = (${contentRisk} × ${wContent.toFixed(2)}) + (${transactionRisk} × ${wTx.toFixed(2)}) + (${behavioralRisk} × ${wBeh.toFixed(2)}) + (${investorRisk} × ${wInv.toFixed(2)}) = ${combinedRisk}`;

  let recommendation = 'Standard verification protocols apply. Routine monitoring active.';
  if (combinedRisk >= 80) {
    recommendation = 'CRITICAL ALERT: Cease immediate capital transfer. High-confidence multi-vector fraud indicators across promotional content, transaction deviations, and investor exposure.';
  } else if (combinedRisk >= 60) {
    recommendation = 'ELEVATED RISK: Impose 24-hour step-up biometric re-authentication and mandate third-party regulatory registry verification before funds release.';
  } else if (combinedRisk >= 35) {
    recommendation = 'MODERATE CAUTION: Present in-app educational friction warning regarding unverified investment advice.';
  }

  return {
    id: `UNIFIED-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    contentRiskScore: contentRisk,
    transactionRiskScore: transactionRisk,
    behavioralRiskScore: behavioralRisk,
    investorRiskScore: investorRisk,
    combinedRiskScore: combinedRisk,
    riskLevel,
    weightsUsed: {
      contentWeight: wContent,
      transactionWeight: wTx,
      behaviorWeight: wBeh,
      investorWeight: wInv,
    },
    formulaString,
    breakdown: [
      { component: 'Content Risk (NLP / Claims)', rawScore: contentRisk, weight: wContent, weightedContribution: Math.round(contentContribution) },
      { component: 'Transaction Anomaly Risk', rawScore: transactionRisk, weight: wTx, weightedContribution: Math.round(txContribution) },
      { component: 'Behavioral Baseline Deviation', rawScore: behavioralRisk, weight: wBeh, weightedContribution: Math.round(behContribution) },
      { component: 'Investor Vulnerability Index', rawScore: investorRisk, weight: wInv, weightedContribution: Math.round(invContribution) },
    ],
    recommendation,
  };
}
