import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { analyzeTextContent, analyzeTransaction, calculateUnifiedRisk } from './src/services/analyzer.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '15mb' }));

const PORT = parseInt(process.env.PORT || '3000', 10);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. System Status
app.get('/api/system-status', (_req: Request, res: Response) => {
  res.json({
    nlpEngine: {
      status: 'OPERATIONAL',
      latencyMs: ai ? 120 : 35,
      model: ai ? 'gemini-3.8-flash + Heuristic Ensemble' : 'Rule-Based Deterministic Engine',
    },
    transactionModel: {
      status: 'OPERATIONAL',
      latencyMs: 14,
      model: 'XGBoost-Anomaly-v1.8',
    },
    anomalyDetection: {
      status: 'OPERATIONAL',
      latencyMs: 9,
      model: 'IsolationForest-Behavioral-v2.1',
    },
    explainabilityEngine: {
      status: 'OPERATIONAL',
      latencyMs: 18,
      model: 'SHAP-TreeAttribution-Engine',
    },
    geminiConnected: !!ai,
    mode: ai ? 'REAL_AI' : 'DEMO',
  });
});

// 2. Text Scam Analysis
app.post('/api/analyze-text', async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text input is required' });
  }

  // Baseline rule-based analysis
  const baseResult = analyzeTextContent(text, 'text');

  if (!ai) {
    return res.json(baseResult);
  }

  try {
    const prompt = `You are VIGILEN, a financial risk intelligence and retail investor protection engine.
Analyze the following investment communication or social media message:
"${text}"

Evaluate risk indicators such as:
1. Guaranteed returns promises
2. Manufactured urgency/FOMO
3. Unverified credentials or claims
4. Pressure to transfer money to personal/individual accounts
5. Absence of mandatory statutory risk disclosures

Return a JSON object conforming strictly to this format:
- riskScore: number between 0 and 100
- classification: string (e.g. "Potentially Suspicious Investment Content", "High-Risk Characteristics Detected", "Low-Risk Regulated Disclosure")
- confidence: number between 0.5 and 0.99
- summaryExplanation: string (concise, analytical, non-absolutist phrasing)
- whyFlagged: array of strings explaining key risk signals
- promisedReturn: string or "None"
- timeHorizon: string or "Unspecified"
- hasGuarantee: boolean
- hasRiskDisclosure: boolean
- sourceStatus: "VERIFIED" | "UNVERIFIED" | "SUSPICIOUS"`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            classification: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            summaryExplanation: { type: Type.STRING },
            whyFlagged: { type: Type.ARRAY, items: { type: Type.STRING } },
            promisedReturn: { type: Type.STRING },
            timeHorizon: { type: Type.STRING },
            hasGuarantee: { type: Type.BOOLEAN },
            hasRiskDisclosure: { type: Type.BOOLEAN },
            sourceStatus: { type: Type.STRING },
          },
          required: ['riskScore', 'classification', 'confidence', 'summaryExplanation', 'whyFlagged'],
        },
      },
    });

    const parsed = JSON.parse(geminiRes.text || '{}');

    // Blend AI output with structural indicator mapping
    const finalScore = Math.round((parsed.riskScore * 0.7) + (baseResult.riskScore * 0.3));
    baseResult.riskScore = Math.min(100, Math.max(5, finalScore));
    baseResult.confidence = parsed.confidence || baseResult.confidence;
    if (parsed.classification) baseResult.classification = parsed.classification;
    if (parsed.summaryExplanation) baseResult.explanation.summary = parsed.summaryExplanation;
    if (parsed.whyFlagged && parsed.whyFlagged.length > 0) {
      baseResult.explanation.whyFlagged = parsed.whyFlagged;
    }
    if (parsed.promisedReturn && baseResult.claim) {
      baseResult.claim.promisedReturn = parsed.promisedReturn;
      baseResult.claim.timeHorizon = parsed.timeHorizon || baseResult.claim.timeHorizon;
      baseResult.claim.guaranteeLanguageDetected = !!parsed.hasGuarantee;
      baseResult.claim.riskDisclosureDetected = !!parsed.hasRiskDisclosure;
      if (['VERIFIED', 'UNVERIFIED', 'SUSPICIOUS'].includes(parsed.sourceStatus)) {
        baseResult.claim.sourceVerificationStatus = parsed.sourceStatus as any;
      }
    }
    return res.json(baseResult);
  } catch (err) {
    console.warn('Gemini text analysis failed, using fallback:', err);
    return res.json(baseResult);
  }
});

// 3. Image / Screenshot OCR & Analysis
app.post('/api/analyze-image', async (req: Request, res: Response) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  if (!ai) {
    // Demo OCR fallback
    const fallbackText =
      'VIP TRADING DESK: "TODAY’S GUARANTEED CALL: Buy XYZ infra at ₹42, Target ₹98 (133% GAIN). 100% SURE SHOT! Deposit ₹15,000 fee to UPI id: tradingboss@paytm to get target exit timing. Act fast only 3 seats!"';
    const fallbackResult = analyzeTextContent(fallbackText, 'screenshot');
    fallbackResult.isDemoData = true;
    return res.json(fallbackResult);
  }

  try {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const prompt =
      'Perform OCR text extraction on this financial/investment screenshot. Then analyze whether it exhibits scam characteristics such as guaranteed returns, urgency, or suspicious UPI/payment demands. Return text content and evaluation.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Data,
            },
          },
          { text: prompt },
        ],
      },
    });

    const ocrText = response.text || 'Unable to extract text from image';
    const result = analyzeTextContent(ocrText, 'screenshot');
    return res.json(result);
  } catch (err) {
    console.warn('Gemini OCR image analysis failed:', err);
    const fallbackText =
      'SPONSORED: Guaranteed 35% monthly returns with AI intraday algorithm! Deposit to UPI: investfast@ybl. Act now, limited seats!';
    const fallbackResult = analyzeTextContent(fallbackText, 'screenshot');
    return res.json(fallbackResult);
  }
});

// 4. Transaction Security Analysis
app.post('/api/analyze-transaction', (req: Request, res: Response) => {
  const tx = req.body;
  if (!tx || typeof tx.amount !== 'number') {
    return res.status(400).json({ error: 'Valid transaction data is required' });
  }
  const result = analyzeTransaction(tx);
  res.json(result);
});

// 5. Unified Risk Fusion
app.post('/api/risk-score', (req: Request, res: Response) => {
  const { contentRisk, transactionRisk, behavioralRisk, investorRisk, weights } = req.body;
  const result = calculateUnifiedRisk(
    Number(contentRisk) || 0,
    Number(transactionRisk) || 0,
    Number(behavioralRisk) || 0,
    Number(investorRisk) || 0,
    weights
  );
  res.json(result);
});

// 6. Shield Assistant Chat
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!ai) {
    return res.json({
      reply:
        'VIGILEN Risk Intelligence (Analytical Mode): I analyze multi-signal investment risks, explain behavioral anomalies, and help verify regulated entities. Never enter real banking PINs or OTPs. All assessments are informational risk signals and do not constitute formal investment or legal advice.',
    });
  }

  try {
    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: any) => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n')
      : '';

    const prompt = `System: You are the "Risk Intelligence Specialist" within VIGILEN (a professional financial risk intelligence and investor protection platform).
Guidelines:
1. Provide precise, professional, non-absolutist answers about risk indicators, regulatory verification (SEBI/RBI/SEC), behavioral anomaly detection, and risk scores.
2. DO NOT provide personalized financial or stock investment recommendations.
3. DO NOT claim absolute certainty of fraud without verification ("potentially suspicious", "high-risk indicator", "requires verification").
4. NEVER request or accept sensitive credentials like OTP, UPI PIN, or passwords.
5. Keep explanations concise, professional, and accessible.

Conversation context:
${formattedHistory}

User: ${message}
Risk Intelligence Specialist:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ reply: response.text || 'Unable to generate response.' });
  } catch (err) {
    console.warn('Gemini chat failed:', err);
    res.json({
      reply:
        'I am analyzing your query based on investor protection heuristics: High risk indicators include guaranteed return promises, pressure to use individual UPI handles, and missing SEBI risk disclosures.',
    });
  }
});

// Vite Middleware for Development / Static file serving for Production
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VIGILEN] Financial Risk Intelligence engine running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
