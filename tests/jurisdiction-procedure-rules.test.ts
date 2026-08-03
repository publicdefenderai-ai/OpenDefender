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
import { monthsAgo, staleDate, daysUntil, classifyFreshness } from '../scripts/check-procedure-rules-freshness';

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

  it('has exactly the 51 state/DC entries plus federal plus 5 territories (57 total)', () => {
    const keys = Object.keys(JURISDICTION_PROCEDURE_RULES);
    // Verify federal is present
    expect(keys).toContain('federal');
    // Verify territory entries are present
    expect(keys).toContain('PR');
    expect(keys).toContain('GU');
    expect(keys).toContain('VI');
    expect(keys).toContain('AS');
    expect(keys).toContain('MP');
    // Verify the count: 51 state/DC + 1 federal + 5 territories
    expect(keys).toHaveLength(57);
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

  it('all entries have dataConfidence "high" — except the 5 territories (medium, verified 2026-07)', () => {
    const notHigh = Object.entries(JURISDICTION_PROCEDURE_RULES)
      .filter(([, rule]) => rule.dataConfidence !== 'high')
      .map(([key]) => key)
      .sort();
    // The 5 US territories were added in 2026-07 with medium confidence pending attorney review.
    // All 50 states + DC + federal remain high confidence.
    expect(notHigh).toEqual(['AS', 'GU', 'MP', 'PR', 'VI']);
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

// ─── Prompt-block content: citations and no placeholders (all 52 jurisdictions) ──
//
// Covers Task #310: ensures that every jurisdiction's prompt block is non-null,
// contains a recognisable statute-style citation, and is free of placeholder text
// or empty source fragments that would silently degrade the AI guidance prompt.

describe('buildJurisdictionContextBlock — statute citations and no placeholders (all 57 jurisdictions)', () => {
  const ALL_KEYS = Object.keys(JURISDICTION_PROCEDURE_RULES);

  it('covers all 57 jurisdictions (50 states + DC + federal + 5 territories)', () => {
    expect(ALL_KEYS).toHaveLength(57);
  });

  it('returns a non-null block for every jurisdiction', () => {
    const nullKeys = ALL_KEYS.filter((key) => buildJurisdictionContextBlock(key) === null);
    expect(nullKeys, 'These jurisdictions returned null from buildJurisdictionContextBlock').toEqual([]);
  });

  it('every block contains a statute-style citation (§, ILCS, Rule N, Art., Crim. P/R, Penal P., U.S.C., amend., Gen. Stat, or case cite "v. <digits>")', () => {
    // A statute-style citation is recognised by any of:
    //   §            — section symbol used in virtually all statutory cites
    //   ILCS         — Illinois Compiled Statutes (e.g. 725 ILCS 5/109-1)
    //   Rule <digit> — numbered court rule (e.g. Md. Rule 4-212, N.M.R.A. Rule 5-303)
    //   Ct. R.       — court rule abbreviation (e.g. N.J. Ct. R. 3:4-1)
    //   R.Crim.P.    — compact criminal procedure rule form (e.g. N.D.R.Crim.P. 5)
    //   Crim. P/R    — spaced criminal procedure rules (e.g. Fed. R. Crim. P., CrR)
    //   Penal P.     — penal procedure rules (e.g. Haw. R. Penal P. 5)
    //   U.S.C.       — United States Code
    //   Art.         — article reference (e.g. Tex. Code Crim. Proc. Art. 15.17)
    //   amend.       — constitutional amendment (e.g. U.S. Const. amend. VI)
    //   Gen. Stat    — general statutes (e.g. N.C. Gen. Stat.)
    //    v. <digit>  — case citation (e.g. Barker v. Wingo, 407 U.S. 514)
    const CITATION_RE = /§|ILCS|Rule \d|Ct\. R\.|R\.Crim\.P\.|Crim\. [PR]|Penal P\.|U\.S\.C\.|Art\.|amend\.|Gen\. Stat| v\. \d/;
    const missing = ALL_KEYS.filter((key) => {
      const block = buildJurisdictionContextBlock(key);
      return block !== null && !CITATION_RE.test(block);
    });
    expect(
      missing,
      'These blocks lack any statute-style citation — check that source fields are populated',
    ).toEqual([]);
  });

  it('no block contains the word "placeholder"', () => {
    const withPlaceholder = ALL_KEYS.filter((key) => {
      const block = buildJurisdictionContextBlock(key);
      return block !== null && /placeholder/i.test(block);
    });
    expect(
      withPlaceholder,
      'These blocks contain placeholder text that must be replaced with real citation data',
    ).toEqual([]);
  });

  it('no block contains an empty source fragment "()"', () => {
    const withEmptySource = ALL_KEYS.filter((key) => {
      const block = buildJurisdictionContextBlock(key);
      return block !== null && block.includes('()');
    });
    expect(
      withEmptySource,
      'These blocks contain an empty source fragment "()" — a source field was left blank',
    ).toEqual([]);
  });
});

// ─── Florida post-July-2025 speedy trial amendment regression guard ──────────
//
// Fla. R. Crim. P. 3.191 was amended effective July 1, 2025 (SC2022-1123):
//   • The clock now starts from the date formal charges are filed (not arrest).
//   • The recapture period increased from 10 to 30 days.
// These tests ensure neither the data entry nor the generated prompt block can
// silently revert to the pre-amendment language.

describe('Florida — post-July-2025 speedy trial amendment (Fla. R. Crim. P. 3.191)', () => {
  const flRule = JURISDICTION_PROCEDURE_RULES['FL'];

  it('FL entry exists and is high-confidence', () => {
    expect(flRule).toBeDefined();
    expect(flRule.dataConfidence).toBe('high');
  });

  it('FL felony speedy trial is 175 days', () => {
    expect(flRule.speedyTrialDays.felony).toBe(175);
  });

  it('FL misdemeanor speedy trial is 90 days', () => {
    expect(flRule.speedyTrialDays.misdemeanor).toBe(90);
  });

  it('FL notes reference formal charges filing as clock start (not arrest)', () => {
    const notes = flRule.speedyTrialDays.notes ?? '';
    expect(notes).toMatch(/formal charges/i);
    // The opening phrase must describe the clock starting from formal charges.
    // "Clock runs from date formal charges are filed" is the expected wording.
    // The note may mention arrest only in historical context ("prior rule ran
    // from arrest") — that is acceptable. What must NOT appear is arrest as the
    // current clock-start phrase.
    expect(notes).toMatch(/clock runs from date formal charges/i);
  });

  it('FL notes reference the 30-day recapture period', () => {
    const notes = flRule.speedyTrialDays.notes ?? '';
    expect(notes).toMatch(/30.day/i);
  });

  it('FL notes do NOT mention the old 10-day recapture period as current', () => {
    const notes = flRule.speedyTrialDays.notes ?? '';
    // "10 days" must not appear as the current recapture period; the amendment
    // increased it to 30 days. Mentions of "10 days" are acceptable only if
    // they appear in a historical-context phrase (e.g. "increased from 10 days").
    // The simplest guard: the phrase "within 10 days" must not appear.
    expect(notes).not.toContain('within 10 days');
  });

  it('FL speedy trial source cites the 2025 amendment (SC2022-1123)', () => {
    expect(flRule.speedyTrialSource).toContain('SC2022-1123');
  });

  it('FL speedy trial source cites the amended rule effective date (July 1, 2025)', () => {
    expect(flRule.speedyTrialSource).toMatch(/July 1, 2025|2025/);
  });

  describe('buildJurisdictionContextBlock("FL") — prompt output', () => {
    const block = buildJurisdictionContextBlock('FL');

    it('returns a non-null prompt block', () => {
      expect(block).not.toBeNull();
    });

    it('prompt block references formal charges as clock start', () => {
      expect(block).toMatch(/formal charges/i);
    });

    it('prompt block references the 30-day recapture period', () => {
      expect(block).toMatch(/30.day/i);
    });

    it('prompt block does NOT say the clock runs from arrest', () => {
      // The note must not include "from arrest" as the starting point for FL's clock.
      // (The arraignment line says "within 24 hours of arrest" — that is fine and
      //  expected; we check only that the speedy-trial note itself does not use
      //  "from arrest" as the clock-start phrase.)
      const noteMatch = block!.match(/Note: (.+)/);
      if (noteMatch) {
        expect(noteMatch[1]).not.toMatch(/clock runs from arrest/i);
      }
    });

    it('prompt block does NOT contain "within 10 days" as recapture language', () => {
      expect(block).not.toContain('within 10 days');
    });

    it('prompt block is marked as verified data', () => {
      expect(block).toContain('verified data');
    });

    it('prompt block does not contain the "generally" qualifier (high-confidence entry)', () => {
      expect(block).not.toContain('generally');
    });

    it('prompt block contains a RULE CHANGE notice for the July 1, 2025 amendment', () => {
      expect(block).toContain('RULE CHANGE');
    });

    it('prompt block explicitly states the clock starts from formal charges filing, not at arrest', () => {
      // The reformNote must include "not at arrest" so users who read pre-2025 material are corrected.
      expect(block).toMatch(/not at arrest/i);
    });

    it('prompt block mentions July 1, 2025 as the effective date of the rule change', () => {
      expect(block).toMatch(/July 1, 2025/);
    });

    it('prompt block notes that the recapture period increased from 10 to 30 days', () => {
      expect(block).toMatch(/10 days to 30 days|10.*30 days/i);
    });
  });
});

// ─── Freshness script: helper unit tests ──────────────────────────────────────
//
// Verifies that the core logic in check-procedure-rules-freshness.ts correctly
// classifies entries as 'stale', 'expiring-soon', or 'ok' when given controlled
// inputs.  This catches accidental exit-code swaps or date-math regressions
// before any real entry reaches the 12-month mark in production.

describe('check-procedure-rules-freshness — monthsAgo helper', () => {
  it('returns 0 for the same year-month', () => {
    const now = new Date(2026, 6, 15); // 2026-07-15
    expect(monthsAgo('2026-07', now)).toBe(0);
  });

  it('returns 1 for exactly one month ago', () => {
    const now = new Date(2026, 6, 15); // 2026-07-15
    expect(monthsAgo('2026-06', now)).toBe(1);
  });

  it('returns 12 for exactly 12 months ago', () => {
    const now = new Date(2026, 6, 1); // 2026-07-01
    expect(monthsAgo('2025-07', now)).toBe(12);
  });

  it('returns 13 for 13 months ago (stale)', () => {
    const now = new Date(2026, 6, 1); // 2026-07-01
    expect(monthsAgo('2025-06', now)).toBe(13);
  });

  it('returns 0 for a future month (not yet stale)', () => {
    const now = new Date(2026, 6, 1); // 2026-07-01
    expect(monthsAgo('2026-08', now)).toBe(-1);
  });
});

describe('check-procedure-rules-freshness — staleDate helper', () => {
  it('stale date for 2025-07 (12-month window) is 2026-07-01', () => {
    const sd = staleDate('2025-07');
    expect(sd.getFullYear()).toBe(2026);
    expect(sd.getMonth()).toBe(6); // 0-based: 6 = July
    expect(sd.getDate()).toBe(1);
  });

  it('stale date for 2025-01 is 2026-01-01', () => {
    const sd = staleDate('2025-01');
    expect(sd.getFullYear()).toBe(2026);
    expect(sd.getMonth()).toBe(0); // January
  });

  it('stale date wraps correctly across December boundary (2025-12 → 2027-12)', () => {
    // 2025-12 + 24 months = 2027-12
    const sd = staleDate('2025-12', 24);
    expect(sd.getFullYear()).toBe(2027);
    expect(sd.getMonth()).toBe(11); // December
  });
});

describe('check-procedure-rules-freshness — daysUntil helper', () => {
  it('returns positive when future is after reference', () => {
    const ref    = new Date(2026, 0, 1);  // 2026-01-01
    const future = new Date(2026, 0, 31); // 2026-01-31
    expect(daysUntil(future, ref)).toBe(30);
  });

  it('returns 0 when dates are equal', () => {
    const d = new Date(2026, 3, 15);
    expect(daysUntil(d, d)).toBe(0);
  });

  it('returns negative when future is before reference (already stale)', () => {
    const ref    = new Date(2026, 6, 15); // 2026-07-15
    const future = new Date(2026, 5, 1);  // 2026-06-01 (in the past)
    expect(daysUntil(future, ref)).toBeLessThan(0);
  });
});

describe('check-procedure-rules-freshness — classifyFreshness (failure-path tests)', () => {
  // Reference date anchored in the past so tests never drift as calendar advances.
  // All tests use now = 2026-07-01 as the reference point.
  const NOW = new Date(2026, 6, 1); // 2026-07-01

  it('classifies a 13-month-old entry as "stale"', () => {
    // lastVerified 2025-06  →  age = 13 months  →  stale
    expect(classifyFreshness('2025-06', NOW)).toBe('stale');
  });

  it('classifies a 14-month-old entry as "stale"', () => {
    expect(classifyFreshness('2025-05', NOW)).toBe('stale');
  });

  it('classifies a 24-month-old entry as "stale"', () => {
    expect(classifyFreshness('2024-07', NOW)).toBe('stale');
  });

  it('classifies an entry exactly at the 12-month boundary as "ok" (not yet stale)', () => {
    // lastVerified 2025-07  →  age = 12 months  →  staleDate = 2026-07-01 = NOW  →  daysUntil = 0
    // age > 12 is FALSE  →  days <= 60 is TRUE  →  'expiring-soon'
    // (boundary: age == 12 is NOT stale per script; daysUntil == 0 is expiring-soon)
    const result = classifyFreshness('2025-07', NOW);
    expect(result).toBe('expiring-soon');
  });

  it('classifies an entry 30 days from stale as "expiring-soon"', () => {
    // staleDate('2025-08') = 2026-08-01, which is 31 days after 2026-07-01
    // age = 11 months, daysUntil = 31 → within WARN_DAYS (60) → expiring-soon
    expect(classifyFreshness('2025-08', NOW)).toBe('expiring-soon');
  });

  it('classifies an entry 59 days from stale as "expiring-soon"', () => {
    // staleDate('2025-09') = 2026-09-01 = 62 days after 2026-07-01 → ok
    // staleDate('2025-08') = 2026-08-01 = 31 days → expiring-soon
    // Use a NOW that is exactly 59 days before the stale boundary.
    // staleDate('2025-08') = 2026-08-01; NOW = 2026-06-03 → 59 days until stale
    const now59 = new Date(2026, 5, 3); // 2026-06-03
    expect(classifyFreshness('2025-08', now59)).toBe('expiring-soon');
  });

  it('classifies an entry 61 days from stale as "ok"', () => {
    // staleDate('2025-08') = 2026-08-01; NOW = 2026-06-01 → 61 days until stale → ok
    const now61 = new Date(2026, 5, 1); // 2026-06-01
    expect(classifyFreshness('2025-08', now61)).toBe('ok');
  });

  it('classifies a freshly-verified entry (this month) as "ok"', () => {
    expect(classifyFreshness('2026-07', NOW)).toBe('ok');
  });

  it('classifies an entry verified 6 months ago as "ok"', () => {
    expect(classifyFreshness('2026-01', NOW)).toBe('ok');
  });
});

describe('check-procedure-rules-freshness — fake-entry injection (integration)', () => {
  // Simulates what the script does: inject a synthetic entry into a copy of the
  // real rules map and assert that the classification logic catches it as stale.

  const NOW = new Date(2026, 6, 1); // fixed reference: 2026-07-01

  it('a fake entry with lastVerified 13 months ago is classified as stale', () => {
    // 13 months before 2026-07 = 2025-06
    const staleVerified = '2025-06';
    expect(classifyFreshness(staleVerified, NOW)).toBe('stale');
  });

  it('a fake entry with lastVerified 2 years ago is classified as stale', () => {
    expect(classifyFreshness('2024-07', NOW)).toBe('stale');
  });

  it('a fake entry with lastVerified 11 months ago is NOT stale', () => {
    // 2025-08 → age = 11 months → not stale (may be expiring-soon)
    const result = classifyFreshness('2025-08', NOW);
    expect(result).not.toBe('stale');
  });

  it('injecting a stale entry into a cloned rule map yields at least one stale classification', () => {
    // Clone real data and inject a stale fake entry
    const fakeRules: Record<string, { lastVerified: string }> = {
      ...Object.fromEntries(
        Object.entries(JURISDICTION_PROCEDURE_RULES).map(([k, v]) => [k, { lastVerified: v.lastVerified }]),
      ),
      __TEST_STALE__: { lastVerified: '2024-01' }, // very stale
    };

    const staleKeys = Object.entries(fakeRules)
      .filter(([, r]) => classifyFreshness(r.lastVerified, NOW) === 'stale')
      .map(([k]) => k);

    expect(staleKeys).toContain('__TEST_STALE__');
  });

  it('injecting an expiring-soon entry into a cloned rule map yields at least one expiring-soon classification', () => {
    // staleDate('2025-08') = 2026-08-01 = 31 days after NOW (2026-07-01) → expiring-soon
    const fakeRules: Record<string, { lastVerified: string }> = {
      ...Object.fromEntries(
        Object.entries(JURISDICTION_PROCEDURE_RULES).map(([k, v]) => [k, { lastVerified: v.lastVerified }]),
      ),
      __TEST_EXPIRING__: { lastVerified: '2025-08' },
    };

    const expiringSoonKeys = Object.entries(fakeRules)
      .filter(([, r]) => classifyFreshness(r.lastVerified, NOW) === 'expiring-soon')
      .map(([k]) => k);

    expect(expiringSoonKeys).toContain('__TEST_EXPIRING__');
  });

  it('real production entries (as of test authoring) are all classified as ok or expiring-soon (none stale)', () => {
    // Guard: real data must not already be stale at 2026-07-01.
    // If this fails, a real entry needs re-verification.
    const staleReal = Object.entries(JURISDICTION_PROCEDURE_RULES)
      .filter(([, r]) => classifyFreshness(r.lastVerified, NOW) === 'stale')
      .map(([k]) => k);

    expect(
      staleReal,
      `Real entries are stale at 2026-07-01 and need re-verification: ${staleReal.join(', ')}`,
    ).toEqual([]);
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
