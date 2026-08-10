/**
 * Background-flags validation for the legal-guidance request body.
 *
 * civilUrgency, supervisionStatus, priorConvictions, citizenshipStatus,
 * hasMinorChildren, hasProfessionalLicense, and hasHousingAssistance are not
 * columns on legal_cases, so insertLegalCaseSchema (Zod, derived from the DB
 * table) strips them — they used to be re-read straight off req.body after
 * that and passed unvalidated into the guidance engine and the Claude prompt.
 * That's both a prompt-injection surface (arbitrary strings reaching Claude)
 * and an accuracy risk (a malformed value silently confuses the rules engine
 * or gets echoed into guidance as if it were a real fact).
 *
 * Every one of these fields is either a boolean/null or a small closed set of
 * known strings — there is no legitimate free-text case. extractBackgroundFlags
 * validates each field independently against its known shape: a field that's
 * missing or already valid passes through untouched; a field that's present
 * but doesn't match (wrong type, unrecognized string, injected text, an
 * oversized payload, whatever) is dropped and logged, not sent onward. One bad
 * field never blocks the rest of a request — every field the user is asking
 * about, a defendant mid-intake, shouldn't lose their whole guidance request
 * over one malformed field.
 */

import { opsLog } from './dev-logger';

export const SUPERVISION_STATUS_VALUES = ['none', 'probation', 'parole', 'both', 'unsure'] as const;
export const CITIZENSHIP_STATUS_VALUES = ['citizen', 'non_citizen', 'prefer_not'] as const;
export const CIVIL_URGENCY_FIELDS = ['housing', 'employment', 'dependents', 'immigration'] as const;
export const CIVIL_URGENCY_LEVELS = ['none', 'active', 'emergency'] as const;

export type SupervisionStatus = typeof SUPERVISION_STATUS_VALUES[number];
export type CitizenshipStatus = typeof CITIZENSHIP_STATUS_VALUES[number];
export type CivilUrgencyField = typeof CIVIL_URGENCY_FIELDS[number];
export type CivilUrgencyLevel = typeof CIVIL_URGENCY_LEVELS[number];

export interface BackgroundFlags {
  civilUrgency?: Partial<Record<CivilUrgencyField, CivilUrgencyLevel>>;
  supervisionStatus?: SupervisionStatus;
  priorConvictions?: boolean | null;
  citizenshipStatus?: CitizenshipStatus;
  hasMinorChildren?: boolean | null;
  hasProfessionalLicense?: boolean | null;
  hasHousingAssistance?: boolean | null;
}

function isBooleanOrNull(value: unknown): value is boolean | null {
  return value === null || typeof value === 'boolean';
}

/**
 * Reads the background-flag fields off a raw request body, keeping only
 * values that match their known shape. Invalid fields are logged by name
 * (never by value — the value may be attacker-supplied or just noisy) and
 * omitted, which every downstream consumer already treats the same as "the
 * user didn't answer this question."
 */
export function extractBackgroundFlags(body: Record<string, unknown>): BackgroundFlags {
  const flags: BackgroundFlags = {};
  const dropped: string[] = [];

  if (body.supervisionStatus !== undefined) {
    if ((SUPERVISION_STATUS_VALUES as readonly unknown[]).includes(body.supervisionStatus)) {
      flags.supervisionStatus = body.supervisionStatus as SupervisionStatus;
    } else {
      dropped.push('supervisionStatus');
    }
  }

  if (body.citizenshipStatus !== undefined) {
    if ((CITIZENSHIP_STATUS_VALUES as readonly unknown[]).includes(body.citizenshipStatus)) {
      flags.citizenshipStatus = body.citizenshipStatus as CitizenshipStatus;
    } else {
      dropped.push('citizenshipStatus');
    }
  }

  for (const key of ['priorConvictions', 'hasMinorChildren', 'hasProfessionalLicense', 'hasHousingAssistance'] as const) {
    const value = body[key];
    if (value === undefined) continue;
    if (isBooleanOrNull(value)) {
      flags[key] = value;
    } else {
      dropped.push(key);
    }
  }

  if (body.civilUrgency !== undefined) {
    if (typeof body.civilUrgency === 'object' && body.civilUrgency !== null && !Array.isArray(body.civilUrgency)) {
      const cleaned: Partial<Record<CivilUrgencyField, CivilUrgencyLevel>> = {};
      let hadInvalidEntry = false;
      for (const [key, value] of Object.entries(body.civilUrgency as Record<string, unknown>)) {
        if (
          (CIVIL_URGENCY_FIELDS as readonly string[]).includes(key) &&
          (CIVIL_URGENCY_LEVELS as readonly unknown[]).includes(value)
        ) {
          cleaned[key as CivilUrgencyField] = value as CivilUrgencyLevel;
        } else {
          hadInvalidEntry = true;
        }
      }
      if (Object.keys(cleaned).length > 0) {
        flags.civilUrgency = cleaned;
      }
      if (hadInvalidEntry) {
        dropped.push('civilUrgency (one or more entries)');
      }
    } else {
      dropped.push('civilUrgency');
    }
  }

  if (dropped.length > 0) {
    // opsLog, not devLog: this must stay visible in production, not just dev —
    // field names only, never the invalid value itself (may be attacker input).
    opsLog(
      'background-flags',
      `Dropped invalid field(s) — not sent to the guidance engine or Claude: ${dropped.join(', ')}`,
    );
  }

  return flags;
}
