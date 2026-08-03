/**
 * Mitigation Builder — AI Narrative Polish Service
 *
 * Converts structured form fields into court-ready narrative prose using Claude.
 *
 * GUARDRAILS (agreed in planning):
 *  1. System prompt explicitly forbids adding any detail not present verbatim in inputs.
 *  2. Prohibited phrases list: language implying guilt, regret, or admission.
 *  3. Empty fields are filtered server-side — never sent to Claude.
 *  4. No data is logged, cached, or stored after the response is returned.
 *  5. Output must be labeled DRAFT by the caller before display.
 */

import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_MODEL_SONNET } from '../config/ai-model';
import { errLog, devLog } from '../utils/dev-logger';

const apiKey = process.env.ANTHROPIC_API_KEY;
let anthropic: Anthropic | null = null;
if (apiKey) {
  anthropic = new Anthropic({ apiKey, timeout: 60_000 });
} else {
  errLog('ANTHROPIC_API_KEY not set — mitigation polish will be unavailable');
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MitigationFields {
  clientName?: string;
  caseContext?: string;
  yearsInCommunity?: string;
  familyNearby?: string;
  communityInvolvement?: string;
  housingStatus?: string;
  housingDuration?: string;
  dependentsAtHome?: string;
  employmentStatus?: string;
  employer?: string;
  employmentDuration?: string;
  employerNote?: string;
  mentalHealthTreatment?: string;
  substanceTreatment?: string;
  treatmentDocumentation?: string;
  caregiverStatus?: string;
  numberOfDependents?: string;
  providerStatus?: string;
  familyContext?: string;
  references?: string;
  additionalContext?: string;
}

export interface PolishResult {
  success: true;
  polishedText: string;
}

export interface PolishError {
  success: false;
  error: string;
}

// ─── Whitelist ────────────────────────────────────────────────────────────────

/**
 * Exhaustive list of field keys the polisher is allowed to read.
 * ANY key not in this list is silently dropped before the Claude call,
 * regardless of what the HTTP request body contains.
 * This is the authoritative trust boundary for prompt construction.
 */
export const MITIGATION_FIELD_WHITELIST = [
  'clientName',
  'caseContext',
  'yearsInCommunity',
  'familyNearby',
  'communityInvolvement',
  'housingStatus',
  'housingDuration',
  'dependentsAtHome',
  'employmentStatus',
  'employer',
  'employmentDuration',
  'employerNote',
  'mentalHealthTreatment',
  'substanceTreatment',
  'treatmentDocumentation',
  'caregiverStatus',
  'numberOfDependents',
  'providerStatus',
  'familyContext',
  'references',
  'additionalContext',
] as const;

export type MitigationFieldKey = typeof MITIGATION_FIELD_WHITELIST[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Keep only whitelisted fields that have a non-empty string value.
 * Iterates the whitelist — never Object.entries(fields) — so unknown
 * keys on the input object are structurally impossible to reach Claude.
 *
 * Exported for unit testing (prompt-construction and no-added-facts tests).
 */
export function filterFilled(fields: MitigationFields): Partial<Record<MitigationFieldKey, string>> {
  const out: Partial<Record<MitigationFieldKey, string>> = {};
  for (const key of MITIGATION_FIELD_WHITELIST) {
    const v = fields[key];
    if (typeof v === 'string' && v.trim() !== '') {
      out[key] = v.trim();
    }
  }
  return out;
}

const FIELD_LABELS: Record<MitigationFieldKey, string> = {
  clientName: 'Client name / identifier',
  caseContext: 'Proceeding context',
  yearsInCommunity: 'Time in community',
  familyNearby: 'Family members in the area',
  communityInvolvement: 'Civic / community involvement',
  housingStatus: 'Housing status',
  housingDuration: 'Duration at current address',
  dependentsAtHome: 'Dependents at home',
  employmentStatus: 'Employment status',
  employer: 'Employer',
  employmentDuration: 'Duration of employment',
  employerNote: 'Employer relationship / willingness to retain',
  mentalHealthTreatment: 'Mental health treatment',
  substanceTreatment: 'Substance use treatment',
  treatmentDocumentation: 'Treatment documentation available',
  caregiverStatus: 'Primary caregiver role',
  numberOfDependents: 'Number and ages of dependents',
  providerStatus: 'Financial provider role',
  familyContext: 'Additional family context',
  references: 'Character references',
  additionalContext: 'Additional context / background',
};

/** Build the user-facing field list that becomes the locked input for Claude.
 *  Iterates the whitelist in order so the prompt is deterministic.
 *
 * Exported for unit testing (prompt-construction and no-added-facts tests). */
export function buildFieldList(filled: Partial<Record<MitigationFieldKey, string>>): string {
  return MITIGATION_FIELD_WHITELIST
    .filter((k) => k !== 'clientName' && k !== 'caseContext' && filled[k]) // metadata handled separately; skip empty
    .map((k) => `${FIELD_LABELS[k]}: ${filled[k]}`)
    .join('\n');
}

// ─── System prompt ─────────────────────────────────────────────────────────────

/** Exported for guardrail-phrase tests — confirms the prompt text hasn't drifted. */
export const SYSTEM_PROMPT = `You are a legal writing assistant helping a criminal defense advocate draft a mitigation memorandum for court.

YOUR STRICT RULES — violating any one is a critical error:

1. USE ONLY WHAT IS PROVIDED. You may not add, invent, infer, assume, extrapolate, or embellish any fact, circumstance, detail, emotion, or history that is not stated verbatim in the input fields below. If a field was not provided, that domain does not appear in your output.

2. PROHIBITED LANGUAGE. Never use — even indirectly or by synonym:
   - Language implying guilt, admission, or responsibility for any offense: "despite," "although the incident," "acknowledges wrongdoing," "regrets," "takes responsibility," "at the time of the offense," "the conduct in question," or any similar phrasing.
   - Language implying remorse, shame, apology, contrition, or acceptance of guilt.
   - Conclusory legal arguments (e.g., "poses no flight risk," "no danger to the community").
   - Any fact not explicitly given to you.

3. NARRATIVE STYLE. Write clear, professional, third-person prose suitable for a bail or sentencing memorandum. Each domain with data gets its own short paragraph (2–5 sentences). Do not use bullet points, headers, or section labels — the caller will add those.

4. OUTPUT FORMAT. Return only the prose paragraphs, separated by blank lines, one per domain that had data. Do not include a title, preamble, or closing statement. Do not label domains. Do not add a disclaimer — the caller will add one.

5. NO PADDING. Do not add filler sentences. Every sentence must carry information directly from the provided fields.`;

// ─── Main export ──────────────────────────────────────────────────────────────

export async function polishMitigationNarrative(
  fields: MitigationFields,
): Promise<PolishResult | PolishError> {
  if (!anthropic) {
    return { success: false, error: 'AI service is not configured on this server.' };
  }

  const filled = filterFilled(fields);

  // Need at least one narrative field (beyond metadata) to polish
  const narrativeFields = Object.entries(filled).filter(
    ([k]) => k !== 'clientName' && k !== 'caseContext',
  );
  if (narrativeFields.length === 0) {
    return { success: false, error: 'Please fill in at least one domain before polishing.' };
  }

  const fieldList = buildFieldList(filled);
  const clientLabel = filled.clientName ? `Client: ${filled.clientName}` : '';
  const contextLabel = filled.caseContext ? `Proceeding: ${filled.caseContext}` : '';

  const userPrompt = [
    'Below are the ONLY facts you may use. Do not add anything else.',
    '',
    clientLabel,
    contextLabel,
    '',
    'PROVIDED FIELDS:',
    fieldList,
    '',
    'Write the mitigation narrative paragraphs now.',
  ]
    .filter((line) => line !== null)
    .join('\n')
    .trim();

  devLog('mitigation-polish', `Calling Claude with ${narrativeFields.length} filled fields`);

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL_SONNET,
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const block = message.content.find((b) => b.type === 'text');
    if (!block || block.type !== 'text') {
      return { success: false, error: 'No text response from AI.' };
    }

    return { success: true, polishedText: block.text.trim() };
  } catch (err) {
    errLog('mitigation-polish: Claude call failed', err);
    return {
      success: false,
      error: 'AI service unavailable. Please try again in a moment.',
    };
  }
}
