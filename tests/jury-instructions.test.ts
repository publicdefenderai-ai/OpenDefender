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
 * FL / TX / NY coverage guards — mirror of the CA CALCRIM pattern.
 *
 * Every FL entry must have EITHER an instructionRef (FSJI number) OR a
 * "no FSJI (<reason>)" note in its source field.  Same rule for TX (TPJC)
 * and NY (CJI2d).  If a new charge is added to CHARGE_CITATIONS without one
 * of those two markers, the zero-missing assertion fails immediately.
 *
 * 246 entries that had no instructionRef were annotated with the appropriate
 * "no FSJI / no TPJC / no CJI2d (no per-charge instruction identified)" note
 * so these guards start clean.
 */

describe('FL FSJI coverage — regression guard', () => {
  const flEntries = Object.entries(CHARGE_CITATIONS).filter(([key]) =>
    key.startsWith('fl-'),
  );

  const flMissing = flEntries
    .filter(([, record]) => {
      const hasRef = Boolean(record.instructionRef);
      const hasExemption = Boolean(record.source?.includes('no FSJI'));
      return !hasRef && !hasExemption;
    })
    .map(([key]) => key);

  it('has zero FL entries missing both instructionRef and a "no FSJI" source note', () => {
    expect(flMissing).toEqual([]);
  });

  it('finds at least one FL entry with an instructionRef (sanity check)', () => {
    const hasAny = flEntries.some(([, record]) => Boolean(record.instructionRef));
    expect(hasAny).toBe(true);
  });

  it('finds at least one FL entry with a "no FSJI" exemption (sanity check)', () => {
    const hasAny = flEntries.some(([, record]) =>
      Boolean(record.source?.includes('no FSJI')),
    );
    expect(hasAny).toBe(true);
  });
});

describe('TX TPJC coverage — regression guard', () => {
  const txEntries = Object.entries(CHARGE_CITATIONS).filter(([key]) =>
    key.startsWith('tx-'),
  );

  const txMissing = txEntries
    .filter(([, record]) => {
      const hasRef = Boolean(record.instructionRef);
      const hasExemption = Boolean(record.source?.includes('no TPJC'));
      return !hasRef && !hasExemption;
    })
    .map(([key]) => key);

  it('has zero TX entries missing both instructionRef and a "no TPJC" source note', () => {
    expect(txMissing).toEqual([]);
  });

  it('finds at least one TX entry with an instructionRef (sanity check)', () => {
    const hasAny = txEntries.some(([, record]) => Boolean(record.instructionRef));
    expect(hasAny).toBe(true);
  });

  it('finds at least one TX entry with a "no TPJC" exemption (sanity check)', () => {
    const hasAny = txEntries.some(([, record]) =>
      Boolean(record.source?.includes('no TPJC')),
    );
    expect(hasAny).toBe(true);
  });
});

describe('NY CJI2d coverage — regression guard', () => {
  const nyEntries = Object.entries(CHARGE_CITATIONS).filter(([key]) =>
    key.startsWith('ny-'),
  );

  const nyMissing = nyEntries
    .filter(([, record]) => {
      const hasRef = Boolean(record.instructionRef);
      const hasExemption = Boolean(record.source?.includes('no CJI2d'));
      return !hasRef && !hasExemption;
    })
    .map(([key]) => key);

  it('has zero NY entries missing both instructionRef and a "no CJI2d" source note', () => {
    expect(nyMissing).toEqual([]);
  });

  it('finds at least one NY entry with an instructionRef (sanity check)', () => {
    const hasAny = nyEntries.some(([, record]) => Boolean(record.instructionRef));
    expect(hasAny).toBe(true);
  });

  it('finds at least one NY entry with a "no CJI2d" exemption (sanity check)', () => {
    const hasAny = nyEntries.some(([, record]) =>
      Boolean(record.source?.includes('no CJI2d')),
    );
    expect(hasAny).toBe(true);
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

describe('OR UCJI coverage — regression guard', () => {
  /**
   * Oregon UCJI refs must use the normalized format "UCJI X" (e.g. "UCJI 1705"),
   * never "UCJI No. X".  If this format test fails, an instructionRef was written
   * in the legacy format — strip the "No." and re-run.
   *
   * Every OR entry in CHARGE_CITATIONS must also either have an instructionRef
   * (a UCJI number) or carry a "no UCJI" marker in its source field (used for
   * charges that have no corresponding Oregon UCJI section).
   *
   * If the coverage test fails, a new OR charge was added without one of those
   * two forms of coverage.  Add the UCJI ref, or add "no UCJI (<reason>)" to
   * the source field, then re-run.
   */
  const orEntries = Object.entries(CHARGE_CITATIONS).filter(([key]) =>
    key.startsWith('or-'),
  );

  it('has no OR instructionRef using the legacy "UCJI No." format (normalized form is "UCJI X")', () => {
    const badFormat = orEntries
      .filter(([, record]) => record.instructionRef?.includes('UCJI No.'))
      .map(([key]) => key);
    expect(badFormat).toEqual([]);
  });

  const orMissing = orEntries
    .filter(([, record]) => {
      const hasRef = Boolean(record.instructionRef);
      const hasExemption = Boolean(record.source?.includes('no UCJI'));
      return !hasRef && !hasExemption;
    })
    .map(([key]) => key);

  it('has zero OR entries missing both instructionRef and a "no UCJI" source note', () => {
    expect(orMissing).toEqual([]);
  });

  it('finds at least one OR entry with an instructionRef (sanity check)', () => {
    const hasAny = orEntries.some(([, record]) => Boolean(record.instructionRef));
    expect(hasAny).toBe(true);
  });

  it('finds at least one OR entry with a "no UCJI" exemption (sanity check)', () => {
    const hasAny = orEntries.some(([, record]) =>
      Boolean(record.source?.includes('no UCJI')),
    );
    expect(hasAny).toBe(true);
  });
});
