/**
 * charge-citation-guard.test.ts
 *
 * Guards the contract of getVerifiedCitation() and isCitationVerified():
 *
 *  - Unaudited charges (no overlay entry, no dataConfidence: 'high') MUST
 *    return null / false so callers cannot accidentally surface generated
 *    statute codes to users as authoritative citations.
 *
 *  - Audited charges (overlay confidence: 'high') MUST return a non-null
 *    citation string / true so the "Read the Law" button continues to work.
 *
 * If these tests break, a code or confidence change has affected the guard.
 * Do NOT skip them — the whole point is to catch regressions early.
 */

import { describe, it, expect } from 'vitest';
import {
  getVerifiedCitation,
  isCitationVerified,
  criminalCharges,
  type CriminalCharge,
} from '../shared/criminal-charges';

// ── Synthetic unaudited charge ────────────────────────────────────────────────
// This object represents any charge whose `code` field was generated and has
// never been confirmed against a real statute.  It intentionally has no
// overlay entry in CHARGE_CITATIONS and no dataConfidence set.
const syntheticUnaudited: CriminalCharge = {
  id: '__test-unaudited-synthetic__',   // not present in CHARGE_CITATIONS
  name: 'Synthetic Unaudited Charge',
  code: '99-99-99',                     // generated value — never verified
  jurisdiction: 'ZZ',
  category: 'felony',
  description: 'Synthetic charge used in tests only',
  maxPenalty: 'N/A',
  commonDefenses: [],
  evidenceToGather: [],
  specificRights: [],
  urgentActions: [],
  // intentionally: no dataConfidence, no statuteCitations
};

// ── getVerifiedCitation ───────────────────────────────────────────────────────
describe('getVerifiedCitation — guards unverified codes from reaching users', () => {
  it('returns null for a charge with no overlay entry and no dataConfidence set', () => {
    expect(getVerifiedCitation(syntheticUnaudited)).toBeNull();
  });

  it('returns null for a charge with dataConfidence: "unverified"', () => {
    const c: CriminalCharge = { ...syntheticUnaudited, dataConfidence: 'unverified' };
    expect(getVerifiedCitation(c)).toBeNull();
  });

  it('returns null for a charge with dataConfidence: "low"', () => {
    const c: CriminalCharge = { ...syntheticUnaudited, dataConfidence: 'low' };
    expect(getVerifiedCitation(c)).toBeNull();
  });

  it('returns null for a charge with dataConfidence: "medium" and no overlay entry', () => {
    // medium means confirmed via secondary source only — not safe to show as authoritative
    const c: CriminalCharge = { ...syntheticUnaudited, dataConfidence: 'medium' };
    expect(getVerifiedCitation(c)).toBeNull();
  });

  it('returns null for a charge with dataConfidence: "high" but no statuteCitations populated', () => {
    // high confidence declared but no actual citation string — edge case
    const c: CriminalCharge = {
      ...syntheticUnaudited,
      id: '__test-high-no-statutes__',
      dataConfidence: 'high',
      // no statuteCitations array
    };
    expect(getVerifiedCitation(c)).toBeNull();
  });

  // ── Audited charges (must succeed) ─────────────────────────────────────────

  it('returns a citation string for al-murder-in-the-first-degree (overlay high)', () => {
    const charge = criminalCharges.find(c => c.id === 'al-murder-in-the-first-degree');
    expect(
      charge,
      'al-murder-in-the-first-degree not found in criminalCharges — charge ID may have changed',
    ).toBeDefined();
    const citation = getVerifiedCitation(charge!);
    expect(
      citation,
      'getVerifiedCitation returned null for al-murder-in-the-first-degree ' +
      '— overlay entry may have been removed or downgraded below high confidence',
    ).not.toBeNull();
    expect(typeof citation).toBe('string');
    expect((citation as string).length).toBeGreaterThan(0);
  });

  it('al-murder-in-the-first-degree citation includes expected statute reference', () => {
    const charge = criminalCharges.find(c => c.id === 'al-murder-in-the-first-degree')!;
    const citation = getVerifiedCitation(charge);
    // Verified: Ala. Code § 13A-6-2
    expect(citation).toMatch(/13A-6-2/);
  });

  it('returns a citation string for fl-murder-in-the-first-degree (overlay high)', () => {
    const charge = criminalCharges.find(c => c.id === 'fl-murder-in-the-first-degree');
    expect(charge, 'fl-murder-in-the-first-degree not found in criminalCharges').toBeDefined();
    const citation = getVerifiedCitation(charge!);
    expect(citation).not.toBeNull();
    expect(citation).toMatch(/Fla\. Stat\./);
  });

  it('returns a citation for an inline-only charge with dataConfidence: "high" and statuteCitations', () => {
    // Tests the fallback path (no overlay entry, but inline high+citations)
    const c: CriminalCharge = {
      ...syntheticUnaudited,
      id: '__test-high-with-statutes__',
      dataConfidence: 'high',
      statuteCitations: ['Test Stat. § 1-2-3'],
    };
    expect(getVerifiedCitation(c)).toBe('Test Stat. § 1-2-3');
  });
});

// ── isCitationVerified ────────────────────────────────────────────────────────
describe('isCitationVerified — boolean guard', () => {
  it('returns false for a charge with no overlay entry and no dataConfidence set', () => {
    expect(isCitationVerified(syntheticUnaudited)).toBe(false);
  });

  it('returns false for dataConfidence: "medium" with no overlay entry', () => {
    const c: CriminalCharge = { ...syntheticUnaudited, dataConfidence: 'medium' };
    expect(isCitationVerified(c)).toBe(false);
  });

  it('returns true for al-murder-in-the-first-degree (overlay high)', () => {
    const charge = criminalCharges.find(c => c.id === 'al-murder-in-the-first-degree');
    expect(charge).toBeDefined();
    expect(isCitationVerified(charge!)).toBe(true);
  });

  it('returns true for fl-murder-in-the-first-degree (overlay high)', () => {
    const charge = criminalCharges.find(c => c.id === 'fl-murder-in-the-first-degree');
    expect(charge).toBeDefined();
    expect(isCitationVerified(charge!)).toBe(true);
  });

  it('returns false for ar-trespassing (overlay confidence: medium — not high)', () => {
    // ar-trespassing is in CHARGE_CITATIONS but confidence is 'medium', not 'high'
    const charge = criminalCharges.find(c => c.id === 'ar-trespassing');
    expect(
      charge,
      'ar-trespassing not found in criminalCharges — charge ID may have changed',
    ).toBeDefined();
    expect(
      isCitationVerified(charge!),
      'isCitationVerified returned true for ar-trespassing whose overlay confidence is "medium" — ' +
      'either the confidence was promoted (update this test) or the guard logic changed',
    ).toBe(false);
  });
});
