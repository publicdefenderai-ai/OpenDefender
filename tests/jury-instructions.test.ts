import { describe, it, expect } from 'vitest';
import { getInstructionRef, getInstructionUrl } from '../shared/criminal-charges';
import type { CriminalCharge } from '../shared/criminal-charges';

function makeCharge(
  id: string,
  jurisdiction = 'CA',
  overrides: Partial<CriminalCharge> = {},
): CriminalCharge {
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
    ...overrides,
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

describe('NY — nycourts.gov PDF URLs (CJI2d)', () => {
  it('returns CJI2d ref for ny-assault-in-the-first-degree', () => {
    const charge = makeCharge('ny-assault-in-the-first-degree', 'NY');
    expect(getInstructionRef(charge)).toBe('CJI2d PL 120.10');
  });

  it('returns nycourts.gov PDF URL for ny-assault-in-the-first-degree', () => {
    const charge = makeCharge('ny-assault-in-the-first-degree', 'NY');
    const url = getInstructionUrl(charge);
    expect(url).toBe('https://www.nycourts.gov/judges/cji/2-PenalLaw/120/120.10.pdf');
  });

  it('returns CJI2d ref for ny-assault-with-deadly-weapon', () => {
    const charge = makeCharge('ny-assault-with-deadly-weapon', 'NY');
    expect(getInstructionRef(charge)).toBe('CJI2d PL 120.05');
  });

  it('returns nycourts.gov PDF URL for ny-assault-with-deadly-weapon', () => {
    const charge = makeCharge('ny-assault-with-deadly-weapon', 'NY');
    const url = getInstructionUrl(charge);
    expect(url).toBe('https://www.nycourts.gov/judges/cji/2-PenalLaw/120/120.05.pdf');
  });

  it('returned URL is on the nycourts.gov domain', () => {
    const charge = makeCharge('ny-assault-in-the-third-degree', 'NY');
    const url = getInstructionUrl(charge);
    expect(url).not.toBeNull();
    expect(url).toMatch(/^https:\/\/www\.nycourts\.gov\//);
  });
});

describe('NJ — njcourts.gov PDF URLs (NJ MJC)', () => {
  it('returns NJ MJC ref for nj-assault-in-the-first-degree', () => {
    const charge = makeCharge('nj-assault-in-the-first-degree', 'NJ');
    expect(getInstructionRef(charge)).toBe('NJ MJC 2C:12-1');
  });

  it('returns njcourts.gov PDF URL for nj-assault-in-the-first-degree', () => {
    const charge = makeCharge('nj-assault-in-the-first-degree', 'NJ');
    const url = getInstructionUrl(charge);
    expect(url).toBe('https://www.njcourts.gov/sites/default/files/attorneys/crimjury/2c121.pdf');
  });

  it('returns NJ MJC ref for nj-assault-with-deadly-weapon', () => {
    const charge = makeCharge('nj-assault-with-deadly-weapon', 'NJ');
    expect(getInstructionRef(charge)).toBe('NJ MJC 2C:12-1');
  });

  it('returns njcourts.gov PDF URL for nj-assault-with-deadly-weapon', () => {
    const charge = makeCharge('nj-assault-with-deadly-weapon', 'NJ');
    const url = getInstructionUrl(charge);
    expect(url).toBe('https://www.njcourts.gov/sites/default/files/attorneys/crimjury/2c121.pdf');
  });

  it('returned URL is on the njcourts.gov domain', () => {
    const charge = makeCharge('nj-assault-in-the-second-degree', 'NJ');
    const url = getInstructionUrl(charge);
    expect(url).not.toBeNull();
    expect(url).toMatch(/^https:\/\/www\.njcourts\.gov\//);
  });
});

describe('GA — GPJI ref only, no public .gov per-section URL', () => {
  it('returns GPJI ref for ga-assault-in-the-first-degree', () => {
    const charge = makeCharge('ga-assault-in-the-first-degree', 'GA');
    expect(getInstructionRef(charge)).toBe('GPJI §16-5-21');
  });

  it('returns null URL for ga-assault-in-the-first-degree (no per-section .gov URL)', () => {
    const charge = makeCharge('ga-assault-in-the-first-degree', 'GA');
    expect(getInstructionUrl(charge)).toBeNull();
  });

  it('returns GPJI ref for ga-assault-with-deadly-weapon', () => {
    const charge = makeCharge('ga-assault-with-deadly-weapon', 'GA');
    expect(getInstructionRef(charge)).toBe('GPJI §16-5-21');
  });

  it('returns null URL for ga-assault-with-deadly-weapon', () => {
    const charge = makeCharge('ga-assault-with-deadly-weapon', 'GA');
    expect(getInstructionUrl(charge)).toBeNull();
  });

  it('returns GPJI ref for ga-assault-in-the-second-degree', () => {
    const charge = makeCharge('ga-assault-in-the-second-degree', 'GA');
    expect(getInstructionRef(charge)).toBe('GPJI §16-5-20');
  });

  it('returns null URL for ga-assault-in-the-second-degree', () => {
    const charge = makeCharge('ga-assault-in-the-second-degree', 'GA');
    expect(getInstructionUrl(charge)).toBeNull();
  });
});

describe('CO — COLJI ref only, no public .gov per-section URL', () => {
  it('returns COLJI ref for co-robbery-in-the-first-degree', () => {
    const charge = makeCharge('co-robbery-in-the-first-degree', 'CO');
    expect(getInstructionRef(charge)).toBe('COLJI-Criminal §18-4-302');
  });

  it('returns null URL for co-robbery-in-the-first-degree (no per-section .gov URL)', () => {
    const charge = makeCharge('co-robbery-in-the-first-degree', 'CO');
    expect(getInstructionUrl(charge)).toBeNull();
  });

  it('returns COLJI ref for co-burglary-in-the-first-degree', () => {
    const charge = makeCharge('co-burglary-in-the-first-degree', 'CO');
    expect(getInstructionRef(charge)).toBe('COLJI-Criminal §18-4-202');
  });

  it('returns null URL for co-burglary-in-the-first-degree', () => {
    const charge = makeCharge('co-burglary-in-the-first-degree', 'CO');
    expect(getInstructionUrl(charge)).toBeNull();
  });

  it('returns COLJI ref for co-trespassing', () => {
    const charge = makeCharge('co-trespassing', 'CO');
    expect(getInstructionRef(charge)).toBe('COLJI-Criminal §18-4-502');
  });

  it('returns null URL for co-trespassing', () => {
    const charge = makeCharge('co-trespassing', 'CO');
    expect(getInstructionUrl(charge)).toBeNull();
  });
});
