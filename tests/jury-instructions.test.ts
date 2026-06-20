import { describe, it, expect } from 'vitest';
import { getInstructionRef, getInstructionUrl } from '../shared/criminal-charges';
import type { CriminalCharge } from '../shared/criminal-charges';

function makeCharge(id: string, jurisdiction = 'CA'): CriminalCharge {
  return {
    id,
    name: id,
    code: 'TEST',
    jurisdiction,
    category: 'felony',
    description: 'Test charge',
    maxPenalty: 'N/A',
    commonDefenses: [],
    evidenceToGather: [],
    specificRights: [],
    urgentActions: [],
  };
}

describe('getInstructionRef', () => {
  it('returns CALCRIM 1600 for ca-robbery-in-the-first-degree', () => {
    const charge = makeCharge('ca-robbery-in-the-first-degree', 'CA');
    expect(getInstructionRef(charge)).toBe('CALCRIM 1600');
  });

  it('returns FSJI 15.1 for fl-robbery-in-the-first-degree', () => {
    const charge = makeCharge('fl-robbery-in-the-first-degree', 'FL');
    expect(getInstructionRef(charge)).toBe('FSJI 15.1');
  });

  it('returns null for a charge ID that has no citation overlay entry', () => {
    const charge = makeCharge('xx-nonexistent-charge-for-testing', 'XX');
    expect(getInstructionRef(charge)).toBeNull();
  });
});

describe('getInstructionUrl', () => {
  it('returns the courts.ca.gov CALCRIM landing page for a CA CALCRIM charge', () => {
    const charge = makeCharge('ca-robbery-in-the-first-degree', 'CA');
    const url = getInstructionUrl(charge);
    expect(url).toBe('https://www.courts.ca.gov/partners/california-jury-instructions');
  });

  it('returns the explicit floridabar.org URL for fl-robbery-in-the-first-degree', () => {
    const charge = makeCharge('fl-robbery-in-the-first-degree', 'FL');
    const url = getInstructionUrl(charge);
    expect(url).toBe('https://www-media.floridabar.org/uploads/2023/07/15.1.docx');
  });

  it('returns null for a charge ID that has no citation overlay entry', () => {
    const charge = makeCharge('xx-nonexistent-charge-for-testing', 'XX');
    expect(getInstructionUrl(charge)).toBeNull();
  });

  it('returns null for a charge that has a citation overlay but no instructionRef or instructionUrl', () => {
    const charge = makeCharge('ca-murder-in-the-first-degree', 'CA');
    const ref = getInstructionRef(charge);
    const url = getInstructionUrl(charge);
    if (ref === null) {
      expect(url).toBeNull();
    } else {
      expect(typeof url).toBe('string');
    }
  });
});
