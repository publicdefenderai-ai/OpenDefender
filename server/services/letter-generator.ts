import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_MODEL_SONNET as CLAUDE_MODEL } from '../config/ai-model';
import { recordAICost } from './cost-tracker';
import { errLog } from '../utils/dev-logger';

const apiKey = process.env.ANTHROPIC_API_KEY;
let anthropic: Anthropic | null = null;
if (apiKey) {
  anthropic = new Anthropic({ apiKey, timeout: 60000 });
}

export type LetterType =
  | 'employer-court-dates'
  | 'employer-explain-absence'
  | 'employer-record-disclosure'
  | 'landlord-payment-plan'
  | 'landlord-situation-notice'
  | 'utility-hardship';

export interface LetterRequest {
  letterType: LetterType;
  answers: Record<string, string>;
  language?: 'en' | 'es';
}

export interface LetterResult {
  letter: string;
  subject?: string;
  tips: string[];
}

const LETTER_CONTEXTS: Record<LetterType, string> = {
  'employer-court-dates':
    'The user needs to request time off from their employer for court appearances. Write a professional letter that is direct about the need for time off without over-sharing legal details.',
  'employer-explain-absence':
    'The user needs to explain a recent absence to their employer that was related to a legal matter. The letter should be professional and brief — honest without over-sharing.',
  'employer-record-disclosure':
    'The user is applying for a job and wants to proactively and professionally disclose a criminal record. The letter should be confident, forward-looking, and focused on who they are today — not on defending the past.',
  'landlord-payment-plan':
    'The user needs to request a rent payment plan or deferral from their landlord. The letter should be professional and honest about the situation, and propose a concrete, realistic plan.',
  'landlord-situation-notice':
    'The user wants to proactively inform their landlord of changed circumstances — possibly related to a legal matter — to maintain a good relationship and avoid surprises.',
  'utility-hardship':
    'The user needs to contact a utility company to request hardship assistance, a payment plan, or a deferral to avoid service disconnection.',
};

function buildSystemPrompt(language: string): string {
  const inSpanish = language === 'es';
  const langInstruction = inSpanish
    ? 'IMPORTANT: Write the entire letter and all tips in Spanish (Español). Use clear, professional Spanish.'
    : '';

  return `You are a communication coach helping people in difficult circumstances write professional, clear letters to employers, landlords, and utility companies. You are NOT providing legal advice. You are helping with practical written communication.

${langInstruction}

RULES:
1. Write at a clear, professional tone — not overly formal, not overly casual.
2. The letter should be 2–4 short paragraphs. Concise and purposeful.
3. Use [YOUR NAME], [DATE], [RECIPIENT NAME], [COMPANY NAME], [ADDRESS], and similar placeholders wherever personal details belong. The user fills these in before sending.
4. Do NOT make legal claims. Do not use legal jargon. Do not give legal advice.
5. Do NOT ask for more information about the legal situation than was shared.
6. Focus on the practical ask — what the person needs and why it is reasonable.
7. The tone must be dignified. Never groveling, never aggressive.
8. Keep each sentence short. 6th–8th grade reading level.

OUTPUT FORMAT — return valid JSON only, no markdown, no extra text:
{
  "subject": "A clear subject line (or null if not applicable, e.g. for in-person conversations)",
  "letter": "The full letter text. Use \\n for line breaks. Include a salutation and sign-off.",
  "tips": ["2–3 short practical tips for the user about personalizing or sending this letter"]
}`;
}

function buildUserPrompt(letterType: LetterType, answers: Record<string, string>): string {
  const context = LETTER_CONTEXTS[letterType];
  const answerBlock = Object.entries(answers)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  return `Context: ${context}\n\nUser's situation:\n${answerBlock}\n\nWrite the letter now.`;
}

export async function generateLetter(request: LetterRequest): Promise<LetterResult> {
  if (!anthropic) {
    throw new Error('AI service not configured');
  }

  const { letterType, answers, language = 'en' } = request;
  const systemPrompt = buildSystemPrompt(language);
  const userPrompt = buildUserPrompt(letterType, answers);

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const inputTokens = message.usage.input_tokens;
  const outputTokens = message.usage.output_tokens;
  const cost =
    (inputTokens / 1_000_000) * 3.0 + (outputTokens / 1_000_000) * 15.0;
  await recordAICost(cost, 'letter-generator');

  const rawText =
    message.content[0].type === 'text' ? message.content[0].text : '';

  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned) as {
    subject?: string | null;
    letter: string;
    tips: string[];
  };

  return {
    letter: parsed.letter,
    subject: parsed.subject || undefined,
    tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 3) : [],
  };
}
