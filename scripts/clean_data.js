import fs from 'fs';
import path from 'path';

const rawPath = path.resolve('data/raw_intelligence_data.csv');
const rawContent = fs.readFileSync(rawPath, 'utf8');
const lines = rawContent.split('\n').filter(l => l.trim().length > 0);

console.log('Total raw lines:', lines.length);

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

const cleanedRows = [];
const tsRecords = [];

for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  if (cols.length < 5) continue;

  const [
    source,
    sourceId,
    recordType,
    entityRaw,
    entityType,
    dateOrPeriod,
    amount,
    textOrDesc,
    targetLabel,
    labelBasis,
    rawSource,
    notes
  ] = cols;

  let channelPlatform = entityType || 'Unknown';
  let normEntity = entityRaw ? entityRaw.replace(/^https?:\/\//i, '').replace(/\/+$/, '') : '';
  let threatClassification = 'Unknown';
  let riskScore = 95;
  let recommendedAction = 'BLOCK_AND_REPORT';
  let targetLabelNorm = '1.0';
  let normalizedRecordType = 'FLAGGED_MALICIOUS_ENTITY';

  if (source === 'NSE') {
    riskScore = 100;
    targetLabelNorm = '1.0';
    normalizedRecordType = 'FLAGGED_MALICIOUS_ENTITY';

    const lowerType = (entityType || '').toLowerCase();
    const lowerEnt = (entityRaw || '').toLowerCase();

    if (lowerType.includes('telegram') || lowerEnt.includes('t.me')) {
      channelPlatform = 'Telegram';
      threatClassification = 'Deceptive_Telegram_Trading_Channel';
    } else if (lowerType.includes('youtube') || lowerEnt.includes('youtube.com') || lowerEnt.includes('youtu.be')) {
      channelPlatform = 'YouTube';
      threatClassification = 'Unregistered_Advisory_YouTube';
    } else if (lowerType.includes('apk') || lowerEnt.includes('.apk')) {
      channelPlatform = 'Android_APK';
      threatClassification = 'Malicious_APK_Download';
    } else if (
      lowerType.includes('application') ||
      lowerType.includes('app name') ||
      lowerEnt.includes('play.google.com') ||
      lowerEnt.includes('apps.apple.com')
    ) {
      channelPlatform = 'Mobile_App';
      threatClassification = 'Fake_Stock_Broker_Clone_App';
    } else if (lowerType.includes('whatsapp') || lowerEnt.includes('whatsapp.com') || lowerEnt.includes('wa.me')) {
      channelPlatform = 'WhatsApp';
      threatClassification = 'Private_Pump_and_Dump_Group';
    } else if (lowerType.includes('instagram') || lowerEnt.includes('instagram.com')) {
      channelPlatform = 'Instagram';
      threatClassification = 'Social_Media_Trading_Impersonator';
    } else if (lowerType.includes('facebook') || lowerEnt.includes('facebook.com')) {
      channelPlatform = 'Facebook';
      threatClassification = 'Social_Media_Trading_Impersonator';
    } else if (lowerType.includes('x') || lowerEnt.includes('x.com')) {
      channelPlatform = 'X_Twitter';
      threatClassification = 'Unlicensed_Signal_Provider';
    } else if (lowerEnt.includes('superprofile.bio') || lowerEnt.includes('cosmofeed.com')) {
      channelPlatform = 'VIP_Payment_Gate';
      threatClassification = 'Unlicensed_VIP_Payment_Page';
    } else {
      channelPlatform = 'Website';
      threatClassification = 'Phishing_Clone_Website';
    }
    recommendedAction = 'IMMEDIATE_BLOCK_AND_INTERCEPT';
  } else if (source === 'RBI') {
    riskScore = 80;
    targetLabelNorm = '0.0';
    normalizedRecordType = 'REGULATORY_AGGREGATE_FRAUD';
    channelPlatform = 'Regulatory_Report';
    threatClassification = 'Banking_Fraud_Macro_Statistic';
    recommendedAction = 'APPLY_ENHANCED_DUE_DILIGENCE';
  } else if (source === 'SEBI') {
    riskScore = 30;
    targetLabelNorm = '0.0';
    normalizedRecordType = 'INVESTOR_DEMOGRAPHIC_METRIC';
    channelPlatform = 'Investor_Survey';
    threatClassification = 'Retail_Investor_Risk_Baseline';
    recommendedAction = 'ENFORCE_CAPITAL_PRESERVATION_SAFEGUARDS';
  }

  // Extract primary search keyword / domain token for matching
  let searchToken = normEntity.split('/')[0].replace(/^www\./i, '').toLowerCase();
  if (channelPlatform === 'Telegram' && normEntity.includes('/')) {
    searchToken = normEntity.split('/').pop().toLowerCase();
  }

  cleanedRows.push([
    `${source}-${sourceId}`,
    source,
    sourceId,
    normalizedRecordType,
    entityRaw,
    normEntity,
    channelPlatform,
    searchToken,
    threatClassification,
    riskScore,
    targetLabelNorm,
    dateOrPeriod || '2025-12',
    amount || '0',
    textOrDesc || '',
    labelBasis || '',
    recommendedAction
  ]);

  tsRecords.push({
    id: `${source}-${sourceId}`,
    sourceAgency: source,
    sourceRecordId: sourceId,
    normalizedRecordType,
    rawEntity: entityRaw,
    normalizedEntity: normEntity,
    channelPlatform,
    searchToken,
    threatClassification,
    riskScore,
    targetLabel: parseFloat(targetLabelNorm),
    dateOrPeriod: dateOrPeriod || '2025-12',
    amountInCrore: amount ? parseFloat(amount) : null,
    description: textOrDesc || '',
    labelBasis: labelBasis || '',
    recommendedAction,
    notes: notes || ''
  });
}

console.log('Processed cleaned records count:', cleanedRows.length);

const cleanedHeader = [
  'id',
  'source_agency',
  'source_record_id',
  'normalized_record_type',
  'raw_entity',
  'normalized_entity',
  'channel_platform',
  'search_token',
  'threat_classification',
  'risk_score',
  'target_label',
  'date_or_period',
  'amount_in_crore',
  'description',
  'label_basis',
  'recommended_action'
].join(',');

const escapeCSV = (v) => {
  if (v === null || v === undefined) return '';
  const str = String(v);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
};

const cleanedCsvContent = [cleanedHeader, ...cleanedRows.map(r => r.map(escapeCSV).join(','))].join('\n');
fs.writeFileSync(path.resolve('data/cleaned_intelligence_data.csv'), cleanedCsvContent, 'utf8');
console.log('Wrote data/cleaned_intelligence_data.csv successfully!');

// Also write a structured TypeScript file into src/data/cleanedIntelligence.ts
const tsContent = `// AUTO-GENERATED FROM /data/cleaned_intelligence_data.csv
// Official Regulatory Intelligence Dataset (NSE Blacklist, RBI Fraud Aggregates, SEBI Demographics)

export interface RegulatoryIntelligenceRecord {
  id: string;
  sourceAgency: 'NSE' | 'RBI' | 'SEBI';
  sourceRecordId: string;
  normalizedRecordType: 'FLAGGED_MALICIOUS_ENTITY' | 'REGULATORY_AGGREGATE_FRAUD' | 'INVESTOR_DEMOGRAPHIC_METRIC';
  rawEntity: string;
  normalizedEntity: string;
  channelPlatform: string;
  searchToken: string;
  threatClassification: string;
  riskScore: number;
  targetLabel: number;
  dateOrPeriod: string;
  amountInCrore: number | null;
  description: string;
  labelBasis: string;
  recommendedAction: string;
  notes?: string;
}

export const REGULATORY_INTELLIGENCE_RECORDS: RegulatoryIntelligenceRecord[] = ${JSON.stringify(tsRecords, null, 2)};

// Fast-lookup index of blacklisted tokens and normalized entities
export const BLACKLISTED_MALICIOUS_ENTITIES = REGULATORY_INTELLIGENCE_RECORDS.filter(
  (r) => r.normalizedRecordType === 'FLAGGED_MALICIOUS_ENTITY'
);

export const RBI_FRAUD_AGGREGATES = REGULATORY_INTELLIGENCE_RECORDS.filter(
  (r) => r.sourceAgency === 'RBI'
);

export const SEBI_DEMOGRAPHIC_METRICS = REGULATORY_INTELLIGENCE_RECORDS.filter(
  (r) => r.sourceAgency === 'SEBI'
);

// High-speed lookup by search token or partial matching
export function matchBlacklistedEntity(input: string): RegulatoryIntelligenceRecord | null {
  if (!input || typeof input !== 'string') return null;
  const cleaned = input.toLowerCase().trim();

  // 1. Direct match by search token or normalized entity
  for (const item of BLACKLISTED_MALICIOUS_ENTITIES) {
    const rawLower = item.rawEntity.toLowerCase();
    const normLower = item.normalizedEntity.toLowerCase();
    const token = item.searchToken.toLowerCase();

    // Check full string inclusions or domain matches
    if (token.length > 3 && (cleaned.includes(token) || token.includes(cleaned))) {
      return item;
    }
    if (normLower.length > 3 && cleaned.includes(normLower)) {
      return item;
    }
    if (rawLower.length > 3 && cleaned.includes(rawLower)) {
      return item;
    }
  }

  // 2. Specific app/brand names checking
  for (const item of BLACKLISTED_MALICIOUS_ENTITIES) {
    if (item.channelPlatform === 'Mobile_App' || item.channelPlatform === 'Android_APK') {
      const cleanName = item.rawEntity.replace(/[^a-zA-Z0-9]/g, ' ').toLowerCase();
      const words = cleanName.split(/\\s+/).filter(w => w.length >= 4);
      for (const w of words) {
        if (['application', 'app', 'link', 'download', 'website', 'trade'].includes(w)) continue;
        const regex = new RegExp(\`\\\\b\${w}\\\\b\`, 'i');
        if (regex.test(cleaned)) {
          return item;
        }
      }
    }
  }

  return null;
}
`;

fs.writeFileSync(path.resolve('src/data/cleanedIntelligence.ts'), tsContent, 'utf8');
console.log('Wrote src/data/cleanedIntelligence.ts successfully!');
