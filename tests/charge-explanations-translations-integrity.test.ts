/**
 * Data-integrity tests for charge-explanations-translations.ts.
 *
 * These tests enforce the structural contract that getChargeExplanation() relies on:
 * positional key-term overlay.  If a translation's keyTerms array is shorter or
 * longer than the English source, the wrong legal explanation will be shown for
 * one or more terms — a safety-critical error for legal-guidance software.
 *
 * Tests:
 *  I1  — Every English slug has both ES and ZH translation entries
 *  I2  — Every ES keyTerms array has the same length as the English source
 *  I3  — Every ZH keyTerms array has the same length as the English source
 *  I4  — getChargeExplanation('murder', undefined, 'es') returns Spanish plainSummary
 *  I5  — getChargeExplanation('murder', undefined, 'zh') returns Chinese plainSummary
 *  I6  — getChargeExplanation('murder', undefined, 'en') returns English (no overlay)
 *  I7  — translationDraft is true for ES results (machine-translated, unreviewed)
 *  I8  — translationDraft is true for ZH results
 *  I9  — getChargeExplanation with ES for 'battery' returns exactly 2 translated key terms
 *  I10 — getChargeExplanation with ES for 'domestic violence' returns exactly 2 translated key terms
 */

import { describe, it, expect } from 'vitest';
import { chargeExplanations, getChargeExplanation } from '../shared/charge-explanations';
import { CHARGE_EXPLANATION_TRANSLATIONS } from '../shared/charge-explanations-translations';

// ── helpers ──────────────────────────────────────────────────────────────────

function enKeyTermCount(slug: string): number {
  const entry = chargeExplanations.find(e => e.slug === slug);
  return entry?.keyTerms.length ?? -1;
}

// ── I1: every slug has both translations ─────────────────────────────────────

describe('I — charge-explanations-translations structural integrity', () => {

  it('I1: every English slug has both an ES and ZH translation entry', () => {
    const missing: string[] = [];
    for (const entry of chargeExplanations) {
      const t = CHARGE_EXPLANATION_TRANSLATIONS[entry.slug];
      if (!t?.es) missing.push(`${entry.slug}: missing ES`);
      if (!t?.zh) missing.push(`${entry.slug}: missing ZH`);
    }
    expect(missing, `Missing translations:\n${missing.join('\n')}`).toEqual([]);
  });

  // ── I2: ES keyTerms count must match English exactly ─────────────────────

  it('I2: every ES keyTerms array has the same length as the English source', () => {
    const mismatches: string[] = [];
    for (const entry of chargeExplanations) {
      const t = CHARGE_EXPLANATION_TRANSLATIONS[entry.slug];
      if (!t?.es) continue;
      const enCount  = entry.keyTerms.length;
      const esCount  = t.es.keyTerms.length;
      if (esCount !== enCount) {
        mismatches.push(
          `${entry.slug}: EN has ${enCount} terms but ES has ${esCount}`
        );
      }
    }
    expect(mismatches, `ES keyTerms count mismatches:\n${mismatches.join('\n')}`).toEqual([]);
  });

  // ── I3: ZH keyTerms count must match English exactly ─────────────────────

  it('I3: every ZH keyTerms array has the same length as the English source', () => {
    const mismatches: string[] = [];
    for (const entry of chargeExplanations) {
      const t = CHARGE_EXPLANATION_TRANSLATIONS[entry.slug];
      if (!t?.zh) continue;
      const enCount  = entry.keyTerms.length;
      const zhCount  = t.zh.keyTerms.length;
      if (zhCount !== enCount) {
        mismatches.push(
          `${entry.slug}: EN has ${enCount} terms but ZH has ${zhCount}`
        );
      }
    }
    expect(mismatches, `ZH keyTerms count mismatches:\n${mismatches.join('\n')}`).toEqual([]);
  });

  // ── I4–I6: getChargeExplanation language overlay ─────────────────────────

  it('I4: getChargeExplanation with "es" returns Spanish plainSummary for murder', () => {
    const result = getChargeExplanation('first degree murder', undefined, 'es');
    expect(result).not.toBeNull();
    // Spanish text contains a Spanish word not in the English summary
    expect(result!.plainSummary).toMatch(/asesinato|grado|fiscal|planeado/i);
    // Should not be the English summary verbatim
    expect(result!.plainSummary).not.toContain('First degree murder is the most serious');
  });

  it('I5: getChargeExplanation with "zh" returns Chinese plainSummary for murder', () => {
    const result = getChargeExplanation('first degree murder', undefined, 'zh');
    expect(result).not.toBeNull();
    // Must contain CJK characters
    expect(/[\u4e00-\u9fff]/.test(result!.plainSummary)).toBe(true);
  });

  it('I6: getChargeExplanation with "en" (or no language) returns English for murder', () => {
    const resultEn  = getChargeExplanation('first degree murder', undefined, 'en');
    const resultDef = getChargeExplanation('first degree murder');
    expect(resultEn!.plainSummary).toContain('First degree murder is the most serious');
    expect(resultDef!.plainSummary).toContain('First degree murder is the most serious');
    // translationDraft must be absent (undefined) in English mode
    expect(resultEn!.translationDraft).toBeUndefined();
    expect(resultDef!.translationDraft).toBeUndefined();
  });

  // ── I7–I8: draft flag is set on all machine-translated results ────────────

  it('I7: translationDraft is true for ES results (all unreviewed)', () => {
    const result = getChargeExplanation('robbery', undefined, 'es');
    expect(result).not.toBeNull();
    expect(result!.translationDraft).toBe(true);
  });

  it('I8: translationDraft is true for ZH results (all unreviewed)', () => {
    const result = getChargeExplanation('robbery', undefined, 'zh');
    expect(result).not.toBeNull();
    expect(result!.translationDraft).toBe(true);
  });

  // ── I9–I10: representative slug cardinality checks ────────────────────────

  it('I9: ES battery overlay returns exactly 2 key terms (matching EN count)', () => {
    const result = getChargeExplanation('battery', undefined, 'es');
    expect(result).not.toBeNull();
    expect(result!.keyTerms).toHaveLength(2);
  });

  it('I10: ES domestic violence overlay returns exactly 2 key terms (matching EN count)', () => {
    const result = getChargeExplanation('domestic violence', undefined, 'es');
    expect(result).not.toBeNull();
    expect(result!.keyTerms).toHaveLength(2);
  });

});
