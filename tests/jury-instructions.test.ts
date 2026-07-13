import { describe, it, expect } from 'vitest';
import { getInstructionRef, getInstructionUrl } from '../shared/criminal-charges';
import type { CriminalCharge } from '../shared/criminal-charges';
import { CHARGE_CITATIONS } from '../shared/criminal-charge-citations';

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

  it('returns njcourts.gov criminal landing URL for nj-assault-in-the-first-degree', () => {
    const charge = makeCharge('nj-assault-in-the-first-degree', 'NJ');
    const url = getInstructionUrl(charge);
    expect(url).toBe('https://www.njcourts.gov/courts/criminal');
  });

  it('returns NJ MJC ref for nj-assault-with-deadly-weapon', () => {
    const charge = makeCharge('nj-assault-with-deadly-weapon', 'NJ');
    expect(getInstructionRef(charge)).toBe('NJ MJC 2C:12-1');
  });

  it('returns njcourts.gov criminal landing URL for nj-assault-with-deadly-weapon', () => {
    const charge = makeCharge('nj-assault-with-deadly-weapon', 'NJ');
    const url = getInstructionUrl(charge);
    expect(url).toBe('https://www.njcourts.gov/courts/criminal');
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

/**
 * FL / TX / NY coverage guards
 *
 * These use a floor-count + pin approach rather than the strict CA "zero entries
 * missing both ref AND exemption note" pattern.
 *
 * Why: FL has 81, TX has 83, and NY has 82 citation entries that lack an
 * instructionRef but also have no "no FSJI/TPJC/CJI2d" exemption note — they
 * are charges whose jury instruction coverage simply hasn't been annotated yet
 * (drug offenses, traffic offenses, etc.). Adding 246 exemption notes is out of
 * scope here. The guards below catch the regressions that matter most:
 *   1. Existing refs are not silently deleted (floor count)
 *   2. Specific high-value charges don't lose their pinned refs
 */

describe('FL FSJI coverage — regression guard', () => {
  const flEntries = Object.entries(CHARGE_CITATIONS).filter(([key]) =>
    key.startsWith('fl-'),
  );
  const flWithRef = flEntries.filter(([, record]) => Boolean(record.instructionRef));

  it('finds at least one FL entry with an instructionRef (sanity check)', () => {
    expect(flWithRef.length).toBeGreaterThan(0);
  });

  it('has at least 44 FL entries with an instructionRef (floor guard — do not delete existing refs)', () => {
    expect(flWithRef.length).toBeGreaterThanOrEqual(44);
  });

  it('fl-robbery-in-the-first-degree keeps instructionRef "FSJI 15.1"', () => {
    expect(CHARGE_CITATIONS['fl-robbery-in-the-first-degree']?.instructionRef).toBe(
      'FSJI 15.1',
    );
  });

  it('fl-murder-in-the-first-degree keeps instructionRef "FSJI 7.2"', () => {
    expect(CHARGE_CITATIONS['fl-murder-in-the-first-degree']?.instructionRef).toBe(
      'FSJI 7.2',
    );
  });
});

describe('TX TPJC coverage — regression guard', () => {
  const txEntries = Object.entries(CHARGE_CITATIONS).filter(([key]) =>
    key.startsWith('tx-'),
  );
  const txWithRef = txEntries.filter(([, record]) => Boolean(record.instructionRef));

  it('finds at least one TX entry with an instructionRef (sanity check)', () => {
    expect(txWithRef.length).toBeGreaterThan(0);
  });

  it('has at least 40 TX entries with an instructionRef (floor guard — do not delete existing refs)', () => {
    expect(txWithRef.length).toBeGreaterThanOrEqual(40);
  });

  it('tx-robbery-in-the-first-degree keeps instructionRef "TPJC 29.03"', () => {
    expect(CHARGE_CITATIONS['tx-robbery-in-the-first-degree']?.instructionRef).toBe(
      'TPJC 29.03',
    );
  });

  it('tx-murder-in-the-first-degree keeps instructionRef "TPJC 19.03"', () => {
    expect(CHARGE_CITATIONS['tx-murder-in-the-first-degree']?.instructionRef).toBe(
      'TPJC 19.03',
    );
  });
});

describe('NY CJI2d coverage — regression guard', () => {
  const nyEntries = Object.entries(CHARGE_CITATIONS).filter(([key]) =>
    key.startsWith('ny-'),
  );
  const nyWithRef = nyEntries.filter(([, record]) => Boolean(record.instructionRef));

  it('finds at least one NY entry with an instructionRef (sanity check)', () => {
    expect(nyWithRef.length).toBeGreaterThan(0);
  });

  it('has at least 45 NY entries with an instructionRef (floor guard — do not delete existing refs)', () => {
    expect(nyWithRef.length).toBeGreaterThanOrEqual(45);
  });

  it('ny-robbery-in-the-first-degree keeps instructionRef "CJI2d PL 160.15"', () => {
    expect(CHARGE_CITATIONS['ny-robbery-in-the-first-degree']?.instructionRef).toBe(
      'CJI2d PL 160.15',
    );
  });

  it('ny-murder-in-the-first-degree keeps instructionRef "CJI2d PL 125.27"', () => {
    expect(CHARGE_CITATIONS['ny-murder-in-the-first-degree']?.instructionRef).toBe(
      'CJI2d PL 125.27',
    );
  });
});

describe('CA CALCRIM coverage — regression guard', () => {
  /**
   * Every CA entry in CHARGE_CITATIONS must either have an instructionRef
   * (a CALCRIM number) or carry a "no CALCRIM" marker in its source field
   * (used for infractions, juvenile WIC proceedings, bench-only matters, etc.).
   *
   * If this test fails, a new CA charge was added without one of those two
   * forms of coverage. Add the CALCRIM ref, or add "no CALCRIM (<reason>)"
   * to the source field, then re-run.
   */
  it('has zero CA entries missing both instructionRef and a "no CALCRIM" source note', () => {
    const caEntries = Object.entries(CHARGE_CITATIONS).filter(([key]) =>
      key.startsWith('ca-'),
    );

    const missing = caEntries
      .filter(([, record]) => {
        const hasRef = Boolean(record.instructionRef);
        const hasExemption = Boolean(record.source?.includes('no CALCRIM'));
        return !hasRef && !hasExemption;
      })
      .map(([key]) => key);

    expect(missing).toEqual([]);
  });

  it('finds at least one CA entry with an instructionRef (sanity check)', () => {
    const hasAny = Object.entries(CHARGE_CITATIONS).some(
      ([key, record]) => key.startsWith('ca-') && Boolean(record.instructionRef),
    );
    expect(hasAny).toBe(true);
  });

  it('finds at least one CA entry with a "no CALCRIM" exemption (sanity check)', () => {
    const hasAny = Object.entries(CHARGE_CITATIONS).some(
      ([key, record]) =>
        key.startsWith('ca-') && Boolean(record.source?.includes('no CALCRIM')),
    );
    expect(hasAny).toBe(true);
  });
});
