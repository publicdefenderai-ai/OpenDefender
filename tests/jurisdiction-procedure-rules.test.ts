/**
 * Regression guard: JURISDICTION_PROCEDURE_RULES coverage
 *
 * Ensures that every US state + DC has an entry in the procedure rules table
 * and that each entry is well-formed.  If a state's entry is accidentally
 * deleted — or a new territory is added without a rule — this test catches it
 * immediately rather than silently falling back to federal defaults.
 */

import { describe, it, expect } from 'vitest';
import { JURISDICTION_PROCEDURE_RULES, buildJurisdictionContextBlock } from '../shared/jurisdiction-procedure-rules';
import type { JurisdictionProcedureRule } from '../shared/jurisdiction-procedure-rules';

// ─── Expected keys ────────────────────────────────────────────────────────────

const EXPECTED_STATE_KEYS: readonly string[] = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC',
] as const; // 50 states + DC = 51 entries

// ─── Coverage: all 51 state/DC keys present ───────────────────────────────────

describe('JURISDICTION_PROCEDURE_RULES — key coverage', () => {
  it('contains entries for all 50 US states + DC (51 total)', () => {
    const missing = EXPECTED_STATE_KEYS.filter(
      (key) => !(key in JURISDICTION_PROCEDURE_RULES),
    );
    expect(missing).toEqual([]);
  });

  it('has exactly the 51 state/DC entries plus a federal entry (52 total)', () => {
    const keys = Object.keys(JURISDICTION_PROCEDURE_RULES);
    // Verify federal is present
    expect(keys).toContain('federal');
    // Verify the count: 51 state/DC + 1 federal
    expect(keys).toHaveLength(52);
  });

  // Sanity check: spot-test a few well-known entries
  it('contains CA', () => expect(JURISDICTION_PROCEDURE_RULES).toHaveProperty('CA'));
  it('contains NY', () => expect(JURISDICTION_PROCEDURE_RULES).toHaveProperty('NY'));
  it('contains TX', () => expect(JURISDICTION_PROCEDURE_RULES).toHaveProperty('TX'));
  it('contains DC', () => expect(JURISDICTION_PROCEDURE_RULES).toHaveProperty('DC'));
  it('contains WY', () => expect(JURISDICTION_PROCEDURE_RULES).toHaveProperty('WY'));
});

// ─── Data confidence: no 'low' entries ────────────────────────────────────────

describe('JURISDICTION_PROCEDURE_RULES — dataConfidence never "low"', () => {
  it('has no entry with dataConfidence "low"', () => {
    const lowConfidence = Object.entries(JURISDICTION_PROCEDURE_RULES)
      .filter(([, rule]) => rule.dataConfidence === 'low')
      .map(([key]) => key);

    expect(lowConfidence).toEqual([]);
  });

  it('every entry has dataConfidence of "medium" or "high"', () => {
    const invalid = Object.entries(JURISDICTION_PROCEDURE_RULES)
      .filter(([, rule]) => rule.dataConfidence !== 'medium' && rule.dataConfidence !== 'high')
      .map(([key]) => key);

    expect(invalid).toEqual([]);
  });

  it('at least one entry has dataConfidence "high" (sanity check)', () => {
    const hasHigh = Object.values(JURISDICTION_PROCEDURE_RULES).some(
      (rule) => rule.dataConfidence === 'high',
    );
    expect(hasHigh).toBe(true);
  });

  it('all entries have dataConfidence "high" — full verification completed 2026-07', () => {
    const notHigh = Object.entries(JURISDICTION_PROCEDURE_RULES)
      .filter(([, rule]) => rule.dataConfidence !== 'high')
      .map(([key]) => key);
    expect(notHigh).toEqual([]);
  });
});

// ─── Field presence and types ─────────────────────────────────────────────────

describe('JURISDICTION_PROCEDURE_RULES — required numeric fields', () => {
  const entries = Object.entries(JURISDICTION_PROCEDURE_RULES);

  it('every entry has arraignmentHours as a finite number', () => {
    const bad = entries
      .filter(([, rule]) => typeof rule.arraignmentHours !== 'number' || !isFinite(rule.arraignmentHours))
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });

  it('every entry has bailHearingHours as a finite number', () => {
    const bad = entries
      .filter(([, rule]) => typeof rule.bailHearingHours !== 'number' || !isFinite(rule.bailHearingHours))
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });

  it('every entry has speedyTrialDays as an object', () => {
    const bad = entries
      .filter(([, rule]) => typeof rule.speedyTrialDays !== 'object' || rule.speedyTrialDays === null)
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });

  it('every entry has speedyTrialDays.felony as a number or null', () => {
    const bad = entries
      .filter(([, rule]) => {
        const v = rule.speedyTrialDays.felony;
        return v !== null && typeof v !== 'number';
      })
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });

  it('every entry has speedyTrialDays.misdemeanor as a number or null', () => {
    const bad = entries
      .filter(([, rule]) => {
        const v = rule.speedyTrialDays.misdemeanor;
        return v !== null && typeof v !== 'number';
      })
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });

  it('arraignmentHours is a positive number for every entry', () => {
    const bad = entries
      .filter(([, rule]) => rule.arraignmentHours <= 0)
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });

  it('bailHearingHours is a positive number for every entry', () => {
    const bad = entries
      .filter(([, rule]) => rule.bailHearingHours <= 0)
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });

  it('speedyTrialDays.felony, when non-null, is a positive number', () => {
    const bad = entries
      .filter(([, rule]) => {
        const v = rule.speedyTrialDays.felony;
        return v !== null && v <= 0;
      })
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });

  it('speedyTrialDays.misdemeanor, when non-null, is a positive number', () => {
    const bad = entries
      .filter(([, rule]) => {
        const v = rule.speedyTrialDays.misdemeanor;
        return v !== null && v <= 0;
      })
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });
});

// ─── String fields: non-empty ─────────────────────────────────────────────────

describe('JURISDICTION_PROCEDURE_RULES — required string fields', () => {
  const entries = Object.entries(JURISDICTION_PROCEDURE_RULES);

  it('every entry has a non-empty arraignmentSource string', () => {
    const bad = entries
      .filter(([, rule]) => typeof rule.arraignmentSource !== 'string' || rule.arraignmentSource.trim() === '')
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });

  it('every entry has a non-empty bailHearingSource string', () => {
    const bad = entries
      .filter(([, rule]) => typeof rule.bailHearingSource !== 'string' || rule.bailHearingSource.trim() === '')
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });

  it('every entry has a non-empty speedyTrialSource string', () => {
    const bad = entries
      .filter(([, rule]) => typeof rule.speedyTrialSource !== 'string' || rule.speedyTrialSource.trim() === '')
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });

  it('every entry has a lastVerified field matching YYYY-MM format', () => {
    const bad = entries
      .filter(([, rule]) => !/^\d{4}-\d{2}$/.test(rule.lastVerified))
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });
});

// ─── buildJurisdictionContextBlock: no 'generally' for newly-promoted states ──
//
// Covers Task #255: all 29 states that were previously medium-confidence and
// have since been promoted to high must produce prompt blocks with no qualifier.

const NEWLY_PROMOTED_STATES = [
  'MN', 'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'UT', 'IA',
  'NV', 'MS', 'KS', 'NM', 'NE', 'WV', 'ID', 'HI', 'NH', 'ME',
  'MT', 'RI', 'DE', 'SD', 'ND', 'AK', 'VT', 'WY', 'DC',
] as const;

describe('buildJurisdictionContextBlock — no "generally" for newly-promoted high-confidence states', () => {
  it('returns a non-null block for every newly-promoted state', () => {
    const nullStates = NEWLY_PROMOTED_STATES.filter(
      (abbr) => buildJurisdictionContextBlock(abbr) === null,
    );
    expect(nullStates, 'These states returned null (should be high-confidence)').toEqual([]);
  });

  it('contains no "generally" qualifier in the prompt block for any newly-promoted state', () => {
    const withGenerally = NEWLY_PROMOTED_STATES.filter((abbr) => {
      const block = buildJurisdictionContextBlock(abbr);
      return block !== null && block.includes('generally');
    });
    expect(
      withGenerally,
      'These states still include the "generally" qualifier — they must be dataConfidence "high"',
    ).toEqual([]);
  });

  // Spot-check 5 individual states to confirm full-confidence language
  for (const abbr of ['MN', 'SC', 'AL', 'DC', 'WY'] as const) {
    it(`${abbr} prompt block omits "generally" and includes "verified data"`, () => {
      const block = buildJurisdictionContextBlock(abbr);
      expect(block).not.toBeNull();
      expect(block).not.toContain('generally');
      expect(block).toContain('verified data');
    });
  }
});

describe('buildJurisdictionContextBlock — all high-confidence states omit "generally"', () => {
  it('no high-confidence state produces a prompt block containing "generally"', () => {
    const bad = Object.entries(JURISDICTION_PROCEDURE_RULES)
      .filter(([, rule]) => rule.dataConfidence === 'high')
      .filter(([key]) => {
        const block = buildJurisdictionContextBlock(key);
        return block !== null && block.includes('generally');
      })
      .map(([key]) => key);
    expect(bad, 'High-confidence states must not include "generally" in their prompt block').toEqual([]);
  });
});

// ─── Freshness: no entry older than 12 months ─────────────────────────────────

describe('JURISDICTION_PROCEDURE_RULES — lastVerified freshness (≤ 12 months)', () => {
  /**
   * Computes the number of whole calendar months between two YYYY-MM dates.
   * Returns a positive number when `verifiedYM` is in the past relative to `nowYM`.
   */
  function monthsAgo(verifiedYM: string, nowYM: string): number {
    const [vy, vm] = verifiedYM.split('-').map(Number);
    const [ny, nm] = nowYM.split('-').map(Number);
    return (ny - vy) * 12 + (nm - vm);
  }

  it('every entry has a lastVerified date no more than 12 months old', () => {
    // Use the current calendar year/month so the check stays accurate in CI.
    const now = new Date();
    const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const stale = Object.entries(JURISDICTION_PROCEDURE_RULES)
      .filter(([, rule]) => monthsAgo(rule.lastVerified, currentYM) > 12)
      .map(([key, rule]) => `${key} (lastVerified: ${rule.lastVerified}, age: ${monthsAgo(rule.lastVerified, currentYM)} months)`);

    expect(
      stale,
      `The following jurisdictions have procedure rules that are more than 12 months old and need re-verification:\n  ${stale.join('\n  ')}`,
    ).toEqual([]);
  });
});
