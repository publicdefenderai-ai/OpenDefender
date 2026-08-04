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
 *  6. Runtime no-added-facts check: Claude's response is scanned for words that
 *     don't trace back to any provided field (findAddedWords). A response that
 *     fails this check is never returned to the caller — this is a backstop
 *     against prompt-instruction drift or an adversarial field value talking
 *     Claude into fabricating a detail, not just a documented rule.
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

// ─── No-added-facts runtime check ──────────────────────────────────────────────
//
// The system prompt tells Claude not to fabricate — this section is the
// enforcement layer that checks whether it actually complied, before the
// response ever reaches an advocate. It is intentionally lenient (a word-set
// comparison, not semantic verification): the goal is to catch new *domain
// facts* — names, places, employers, numbers — that never appeared in any
// input field, while tolerating normal rephrasing.

/**
 * Common prose connectives and structural words a professional writer adds
 * when turning short field values into full sentences. None of these count
 * as a "fact" on their own, so they're excluded from both sides of the
 * comparison to avoid flooding the result with noise.
 */
const PROSE_STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'in', 'to', 'for', 'with', 'on', 'at', 'by', 'is',
  'are', 'was', 'were', 'has', 'have', 'had', 'that', 'this', 'their', 'they', 'he', 'she',
  'his', 'her', 'it', 'its', 'been', 'be', 'as', 'from', 'not', 'no', 'but', 'also', 'who',
  'which', 'where', 'when', 'will', 'would', 'may', 'can', 'could', 'should', 'both',
  'each', 'any', 'all', 'one', 's', 'currently',
  'serves', 'including', 'provide', 'provides', 'provided',
  'works', 'worked', 'lives', 'lived', 'resides', 'resided', 'supports', 'supported',
  'demonstrates', 'demonstrated', 'indicates', 'indicated', 'noted', 'notes',
  'described', 'describes', 'maintains', 'maintained', 'according', 'further',
  'primary', 'additional', 'several', 'within', 'through', 'during', 'since', 'over',
  'more', 'most', 'well', 'long', 'time', 'year', 'years', 'month', 'months', 'day',
  'days', 'number', 'member', 'members', 'local', 'family', 'community', 'stable',
  'status', 'full', 'part', 'home', 'house', 'housing', 'employment', 'employed',
  'role', 'position', 'relationship', 'documentation', 'treatment', 'care',
  'context', 'background', 'reference', 'references', 'character',
  // Claude always refers to "the client" — suppress this universal prose word.
  'client',
]);

/**
 * Spelled-out numbers Claude commonly substitutes for a digit in the input
 * (e.g. field says "8 years", prose says "eight years"). Canonicalizing both
 * to digit form during tokenization prevents this from reading as a fabricated
 * new number.
 */
const NUMBER_WORD_TO_DIGIT: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6',
  seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12',
  thirteen: '13', fourteen: '14', fifteen: '15', sixteen: '16', seventeen: '17',
  eighteen: '18', nineteen: '19', twenty: '20', thirty: '30', forty: '40',
  fifty: '50', sixty: '60', seventy: '70', eighty: '80', ninety: '90',
};

/**
 * Splits text into a comparable set of lowercase tokens: strips punctuation,
 * drops stop-words and words of 2 characters or fewer, and canonicalizes
 * spelled-out numbers to digit form. Pure-digit tokens (e.g. "8", "2024") are
 * kept regardless of length since a short number can still be a real fact.
 */
function tokenize(text: string): Set<string> {
  const tokens = new Set<string>();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);

  for (const w of words) {
    if (/^\d+$/.test(w)) {
      tokens.add(w);
      continue;
    }
    if (w.length <= 2 || PROSE_STOP_WORDS.has(w)) continue;
    tokens.add(NUMBER_WORD_TO_DIGIT[w] ?? w);
  }
  return tokens;
}

/**
 * Returns tokens present in `output` that are not derivable from any value
 * in `inputFields`. An empty array means every meaningful word in the output
 * traces back to something the advocate actually typed. This is the runtime
 * enforcement of GUARDRAIL 1 (SYSTEM_PROMPT rule 1) — a non-empty result means
 * Claude's response should not be trusted and must not reach the caller.
 */
export function findAddedWords(
  output: string,
  inputFields: Partial<Record<string, string>>,
): string[] {
  const inputTokens = new Set<string>();
  for (const value of Object.values(inputFields)) {
    if (value) {
      for (const tok of tokenize(value)) inputTokens.add(tok);
    }
  }
  const outputTokens = tokenize(output);
  return [...outputTokens].filter((tok) => !inputTokens.has(tok));
}

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

    const polishedText = block.text.trim();

    // Runtime enforcement of "use only what is provided" — reject rather than
    // silently return a response that contains a word not traceable to any
    // field the advocate actually entered. Only a count is logged below, never
    // the flagged words or field/output content — see GUARDRAIL 4.
    const addedWords = findAddedWords(polishedText, filled);
    if (addedWords.length > 0) {
      devLog(
        'mitigation-polish',
        `Rejected response: ${addedWords.length} word(s) not traceable to any input field`,
      );
      return {
        success: false,
        error: 'AI safety check failed: the draft may include details that were not in your inputs. Please try again.',
      };
    }

    return { success: true, polishedText };
  } catch (err) {
    errLog('mitigation-polish: Claude call failed', err);
    return {
      success: false,
      error: 'AI service unavailable. Please try again in a moment.',
    };
  }
}
