/**
 * Task #444: Data-layer tests: verify that every new charge-explanation entry
 * carries an explicit pendingAttorneyReview: true flag, and that pre-existing
 * entries do not.
 *
 * No jsPDF mocks here: we call the real getChargeExplanation against the live
 * shared/charge-explanations.ts so the field values are authoritative.
 *
 * Tests:
 *  A1-A3: new entries (sourced to medium confidence in task #448) have pendingAttorneyReview: true
 *  A4-A5: new sourced (high-confidence) entries also have the flag
 *            (sourced ≠ reviewed; dataConfidence reflects source quality only)
 *  A6-A7: pre-existing entries do NOT have pendingAttorneyReview
 *  A8: the CA stop-and-identify error is fixed (California is NOT named as
 *            a stop-and-identify state in the failure-to-identify entry)
 */

import { describe, it, expect } from 'vitest';
import { getChargeExplanation } from '../shared/charge-explanations';

describe('A: charge-explanations pendingAttorneyReview field', () => {

  // ── new low-confidence entries ─────────────────────────────────────────────

  it('A1: loitering (sourced, medium confidence) has pendingAttorneyReview: true', () => {
    const expl = getChargeExplanation('loitering');
    expect(expl).not.toBeNull();
    expect(expl!.pendingAttorneyReview).toBe(true);
    // Task #448 sourcing pass: anchor-state statutes added, low -> medium
    expect(expl!.dataConfidence).toBe('medium');
  });

  it('A2: rape (sourced, medium confidence) has pendingAttorneyReview: true', () => {
    const expl = getChargeExplanation('rape');
    expect(expl).not.toBeNull();
    expect(expl!.pendingAttorneyReview).toBe(true);
    expect(expl!.dataConfidence).toBe('medium');
  });

  it('A3: perjury (sourced, medium confidence) has pendingAttorneyReview: true', () => {
    const expl = getChargeExplanation('perjury');
    expect(expl).not.toBeNull();
    expect(expl!.pendingAttorneyReview).toBe(true);
    expect(expl!.dataConfidence).toBe('medium');
  });

  // ── new sourced (high-confidence) entries: pending review despite sourcing ──

  it('A4: forgery (sourced, high confidence) still has pendingAttorneyReview: true', () => {
    const expl = getChargeExplanation('forgery');
    expect(expl).not.toBeNull();
    expect(expl!.pendingAttorneyReview).toBe(true);
    // dataConfidence remains high because statutory sources are verified
    expect(expl!.dataConfidence).toBe('high');
  });

  it('A5: failure to appear (sourced, high confidence) still has pendingAttorneyReview: true', () => {
    const expl = getChargeExplanation('failure to appear');
    expect(expl).not.toBeNull();
    expect(expl!.pendingAttorneyReview).toBe(true);
    expect(expl!.dataConfidence).toBe('high');
  });

  // ── pre-existing entries: must NOT carry the flag ──────────────────────────

  it('A6: pre-existing robbery entry does NOT have pendingAttorneyReview', () => {
    const expl = getChargeExplanation('robbery');
    expect(expl).not.toBeNull();
    expect(expl!.pendingAttorneyReview).toBeFalsy();
  });

  it('A7: pre-existing DUI entry does NOT have pendingAttorneyReview', () => {
    const expl = getChargeExplanation('DUI');
    expect(expl).not.toBeNull();
    expect(expl!.pendingAttorneyReview).toBeFalsy();
  });

  // ── factual-error fix: CA stop-and-identify ────────────────────────────────

  it('A8: failure-to-identify entry does not incorrectly name California as a stop-and-identify state', () => {
    const expl = getChargeExplanation('failure to identify');
    expect(expl).not.toBeNull();
    // The old incorrect example said "California requires identification".
    // California does NOT have a stop-and-identify statute.
    const allText = JSON.stringify(expl);
    // Must not say California requires identification
    expect(allText).not.toMatch(/california require/i);
    // The corrected text should note CA does NOT require it
    expect(allText).toMatch(/california.*does not|california.*no.*stop|california.*not.*stop/i);
  });

});
