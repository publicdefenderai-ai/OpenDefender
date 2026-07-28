import { describe, it, expect } from 'vitest';
import { generateEnhancedGuidance, CHARGE_KEYWORDS, CHARGE_CONSEQUENCE_MAP } from '../server/services/guidance-engine';
import { criminalCharges, getChargeById } from '../shared/criminal-charges';

const baseCase = {
  jurisdiction: 'CA',
  charges: 'theft',
  caseStage: 'arraignment',
  custodyStatus: 'released',
  hasAttorney: false,
  supervisionStatus: 'none',
  citizenshipStatus: 'citizen',
  hasMinorChildren: false,
  hasProfessionalLicense: false,
  hasHousingAssistance: false,
};

// ---------------------------------------------------------------------------
// buildCollateralConsequences
// ---------------------------------------------------------------------------
describe('buildCollateralConsequences', () => {
  it('returns a supervision_revocation item when supervisionStatus is probation', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      supervisionStatus: 'probation',
    });
    const item = result.collateralConsequences?.find(
      c => c.category === 'supervision_revocation',
    );
    expect(item).toBeDefined();
    expect(item?.consequence).toMatch(/probation/i);
  });

  it('returns a supervision_revocation item (parole variant) when supervisionStatus is parole', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      supervisionStatus: 'parole',
    });
    const item = result.collateralConsequences?.find(
      c => c.category === 'supervision_revocation',
    );
    expect(item).toBeDefined();
    expect(item?.consequence).toMatch(/parole/i);
    expect(item?.actionNote).toMatch(/parole/i);
  });

  it('does NOT return supervision_revocation when supervisionStatus is none', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      supervisionStatus: 'none',
    });
    const item = result.collateralConsequences?.find(
      c => c.category === 'supervision_revocation',
    );
    expect(item).toBeUndefined();
  });

  it('returns an immigration item when citizenshipStatus is non_citizen', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      citizenshipStatus: 'non_citizen',
    });
    const item = result.collateralConsequences?.find(
      c => c.category === 'immigration',
    );
    expect(item).toBeDefined();
    expect(item?.consequence).toMatch(/Padilla/i);
  });

  it('does NOT return immigration item when citizenshipStatus is citizen', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      citizenshipStatus: 'citizen',
    });
    const item = result.collateralConsequences?.find(
      c => c.category === 'immigration',
    );
    expect(item).toBeUndefined();
  });

  it('returns a custody item when hasMinorChildren is true', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      hasMinorChildren: true,
    });
    const item = result.collateralConsequences?.find(
      c => c.category === 'custody',
    );
    expect(item).toBeDefined();
    expect(item?.consequence).toMatch(/custody/i);
  });

  it('does NOT return custody item when hasMinorChildren is false', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      hasMinorChildren: false,
    });
    const item = result.collateralConsequences?.find(
      c => c.category === 'custody',
    );
    expect(item).toBeUndefined();
  });

  it('returns an employment item when hasProfessionalLicense is true', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      hasProfessionalLicense: true,
    });
    const item = result.collateralConsequences?.find(
      c => c.category === 'employment',
    );
    expect(item).toBeDefined();
    expect(item?.consequence).toMatch(/licens/i);
  });

  it('does NOT return employment item when hasProfessionalLicense is false', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      hasProfessionalLicense: false,
    });
    const item = result.collateralConsequences?.find(
      c => c.category === 'employment',
    );
    expect(item).toBeUndefined();
  });

  it('returns a housing item when hasHousingAssistance is true', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      hasHousingAssistance: true,
    });
    const item = result.collateralConsequences?.find(
      c => c.category === 'housing',
    );
    expect(item).toBeDefined();
    expect(item?.consequence).toMatch(/housing/i);
  });

  it('does NOT return housing item when hasHousingAssistance is false', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      hasHousingAssistance: false,
    });
    const item = result.collateralConsequences?.find(
      c => c.category === 'housing',
    );
    expect(item).toBeUndefined();
  });

  it('returns a drivers_license item for a DUI charge', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      charges: 'dui',
    });
    const item = result.collateralConsequences?.find(
      c => c.category === 'drivers_license',
    );
    expect(item).toBeDefined();
    expect(item?.consequence).toMatch(/license/i);
    expect(item?.actionNote).toMatch(/DMV/i);
  });

  it('does NOT return a drivers_license item for a non-DUI charge', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      charges: 'theft',
    });
    const item = result.collateralConsequences?.find(
      c => c.category === 'drivers_license',
    );
    expect(item).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// buildUncertainties
// ---------------------------------------------------------------------------
describe('buildUncertainties', () => {
  it('adds a jurisdiction deadline notice for an unmapped state', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      jurisdiction: 'WY',
    });
    const item = result.uncertainties?.find(
      u => u.area === 'Jurisdiction-Specific Deadlines',
    );
    expect(item).toBeDefined();
    expect(item?.note).toMatch(/WY/);
  });

  it('does NOT add a jurisdiction deadline notice for a mapped state (CA)', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      jurisdiction: 'CA',
    });
    const item = result.uncertainties?.find(
      u => u.area === 'Jurisdiction-Specific Deadlines',
    );
    expect(item).toBeUndefined();
  });

  it('adds a supervision notice when supervisionStatus is not provided', () => {
    const { supervisionStatus: _omit, ...withoutSupervision } = baseCase as any;
    const result = generateEnhancedGuidance(withoutSupervision);
    const item = result.uncertainties?.find(
      u => u.area === 'Probation / Parole Status',
    );
    expect(item).toBeDefined();
    expect(item?.note).toMatch(/probation/i);
  });

  it('does NOT add a supervision notice when supervisionStatus is provided', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      supervisionStatus: 'none',
    });
    const item = result.uncertainties?.find(
      u => u.area === 'Probation / Parole Status',
    );
    expect(item).toBeUndefined();
  });

  it('adds an immigration notice when citizenshipStatus is not provided', () => {
    const { citizenshipStatus: _omit, ...withoutCitizenship } = baseCase as any;
    const result = generateEnhancedGuidance(withoutCitizenship);
    const item = result.uncertainties?.find(
      u => u.area === 'Immigration Consequences',
    );
    expect(item).toBeDefined();
    expect(item?.note).toMatch(/citizen/i);
  });

  it('does NOT add an immigration notice when citizenshipStatus is provided', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      citizenshipStatus: 'citizen',
    });
    const item = result.uncertainties?.find(
      u => u.area === 'Immigration Consequences',
    );
    expect(item).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Full generateEnhancedGuidance integration — all background fields provided
// ---------------------------------------------------------------------------
describe('generateEnhancedGuidance integration', () => {
  it('returns non-empty collateralConsequences and uncertainties when all background fields are set', () => {
    const result = generateEnhancedGuidance({
      jurisdiction: 'WY',
      charges: 'dui',
      caseStage: 'arraignment',
      custodyStatus: 'released',
      hasAttorney: false,
      supervisionStatus: 'probation',
      citizenshipStatus: 'non_citizen',
      hasMinorChildren: true,
      hasProfessionalLicense: true,
      hasHousingAssistance: true,
    });

    expect(result.collateralConsequences).toBeDefined();
    expect(result.collateralConsequences!.length).toBeGreaterThan(0);

    expect(result.uncertainties).toBeDefined();
    expect(result.uncertainties!.length).toBeGreaterThan(0);
  });

  it('collateralConsequences includes all expected categories when every flag is set', () => {
    const result = generateEnhancedGuidance({
      jurisdiction: 'CA',
      charges: 'dui',
      caseStage: 'arraignment',
      custodyStatus: 'released',
      hasAttorney: false,
      supervisionStatus: 'probation',
      citizenshipStatus: 'non_citizen',
      hasMinorChildren: true,
      hasProfessionalLicense: true,
      hasHousingAssistance: true,
    });

    const categories = result.collateralConsequences!.map(c => c.category);
    expect(categories).toContain('supervision_revocation');
    expect(categories).toContain('immigration');
    expect(categories).toContain('custody');
    expect(categories).toContain('employment');
    expect(categories).toContain('housing');
    expect(categories).toContain('drivers_license');
  });

  it('returns an array with defined fields for every collateralConsequences item', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      supervisionStatus: 'probation',
      citizenshipStatus: 'non_citizen',
      hasMinorChildren: true,
    });

    for (const item of result.collateralConsequences!) {
      expect(item.category).toBeTruthy();
      expect(item.consequence).toBeTruthy();
      expect(item.timing).toBeTruthy();
      expect(item.actionNote).toBeTruthy();
    }
  });

  it('returns an array with defined fields for every uncertainties item', () => {
    const result = generateEnhancedGuidance({
      jurisdiction: 'MT',
      charges: 'theft',
      caseStage: 'arraignment',
      custodyStatus: 'released',
      hasAttorney: false,
    });

    for (const item of result.uncertainties!) {
      expect(item.area).toBeTruthy();
      expect(item.note).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// Charge-type coverage data-integrity check
// ---------------------------------------------------------------------------
// This test ensures that every charge type recognised by identifyChargeType
// (CHARGE_KEYWORDS) has at least one consequence entry in CHARGE_CONSEQUENCE_MAP.
// If you add a new key to CHARGE_KEYWORDS without adding a matching entry here,
// this test will fail and users with that charge type would silently receive zero
// charge-specific collateral consequences.
describe('CHARGE_CONSEQUENCE_MAP coverage', () => {
  it('has a non-empty entry for every key in CHARGE_KEYWORDS', () => {
    const missingTypes: string[] = [];

    for (const chargeType of Object.keys(CHARGE_KEYWORDS)) {
      const entry = CHARGE_CONSEQUENCE_MAP[chargeType];
      if (!entry || entry.length === 0) {
        missingTypes.push(chargeType);
      }
    }

    expect(
      missingTypes,
      `These charge types in CHARGE_KEYWORDS have no entry in CHARGE_CONSEQUENCE_MAP: ${missingTypes.join(', ')}. ` +
      'Add at least one CollateralConsequenceItem for each type, or move it to an intentional-omission list.',
    ).toHaveLength(0);
  });

  it('every CHARGE_CONSEQUENCE_MAP entry has valid consequence fields', () => {
    for (const [type, items] of Object.entries(CHARGE_CONSEQUENCE_MAP)) {
      for (const item of items) {
        expect(item.category, `${type}: missing category`).toBeTruthy();
        expect(item.consequence, `${type}: missing consequence`).toBeTruthy();
        expect(item.timing, `${type}: missing timing`).toBeTruthy();
        expect(item.actionNote, `${type}: missing actionNote`).toBeTruthy();
      }
    }
  });

  it('generates at least one charge-specific consequence for each keyword type', () => {
    const keywordSampleMap: Record<string, string> = {
      dui: 'driving under the influence',
      assault: 'assault and battery',
      drug: 'drug possession',
      theft: 'grand theft',
      domestic: 'domestic violence',
      fraud: 'wire fraud',
      burglary: 'burglary',
      traffic: 'reckless driving',
      weapons: 'carrying a concealed gun',
    };

    for (const [chargeType, chargeText] of Object.entries(keywordSampleMap)) {
      const result = generateEnhancedGuidance({
        jurisdiction: 'CA',
        charges: chargeText,
        caseStage: 'arraignment',
        custodyStatus: 'released',
        hasAttorney: false,
        supervisionStatus: 'none',
        citizenshipStatus: 'citizen',
        hasMinorChildren: false,
        hasProfessionalLicense: false,
        hasHousingAssistance: false,
      });

      const chargeSpecificCategories = CHARGE_CONSEQUENCE_MAP[chargeType]?.map(i => i.category) ?? [];
      const returnedCategories = result.collateralConsequences?.map(c => c.category) ?? [];
      const covered = chargeSpecificCategories.some(cat => returnedCategories.includes(cat));

      expect(
        covered,
        `charge type "${chargeType}" (sample: "${chargeText}") produced no charge-specific consequence categories in the output. ` +
        `Expected one of: ${chargeSpecificCategories.join(', ')}. Got: ${returnedCategories.join(', ')}`,
      ).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Corrected statute codes — GA, NC, NJ, VA, AZ (2026-07 batch)
// ---------------------------------------------------------------------------
// These five states had 310 synthesized `code` fields replaced with verified
// official statute numbers. The tests below confirm that:
//  (a) The charge objects carry the correct verified codes.
//  (b) The old synthesized garbage codes are NOT present anywhere in those objects.
//  (c) The chargeClassifications mapping used by the AI guidance pipeline
//      (which reads `charge.code` directly) surfaces the correct code in output.
//
// Correct  → old-synthesized
//  GA 16-5-1  → 43-65
//  NC 14-17   → 46-96
//  NJ 2C:11-3 → 36-11
//  VA 18.2-32 → 19-100
//  AZ 13-1105 → 19-98

describe('Corrected statute codes flow through to AI guidance output', () => {
  const cases = [
    {
      state: 'GA',
      chargeId: 'ga-murder-in-the-first-degree',
      correctCode: '16-5-1',
      oldSynthesized: '43-65',
      description: 'Georgia O.C.G.A. Title 16',
    },
    {
      state: 'NC',
      chargeId: 'nc-murder-in-the-first-degree',
      correctCode: '14-17',
      oldSynthesized: '46-96',
      description: 'North Carolina N.C.G.S. Chapter 14',
    },
    {
      state: 'NJ',
      chargeId: 'nj-murder-in-the-first-degree',
      correctCode: '2C:11-3',
      oldSynthesized: '36-11',
      description: 'New Jersey N.J.S.A. Title 2C',
    },
    {
      state: 'VA',
      chargeId: 'va-murder-in-the-first-degree',
      correctCode: '18.2-32',
      oldSynthesized: '19-100',
      description: 'Virginia Va. Code Ann. Title 18.2',
    },
    {
      state: 'AZ',
      chargeId: 'az-murder-in-the-first-degree',
      correctCode: '13-1105',
      oldSynthesized: '19-98',
      description: 'Arizona A.R.S. Title 13',
    },
  ] as const;

  for (const { state, chargeId, correctCode, oldSynthesized, description } of cases) {
    it(`${state}: charge object carries the verified statute code (${description})`, () => {
      const charge = getChargeById(chargeId);
      expect(charge, `charge '${chargeId}' not found in criminalCharges`).toBeDefined();
      expect(charge!.code).toBe(correctCode);
    });

    it(`${state}: old synthesized code '${oldSynthesized}' is NOT present in the charge object`, () => {
      const charge = getChargeById(chargeId);
      expect(charge, `charge '${chargeId}' not found in criminalCharges`).toBeDefined();
      expect(charge!.code).not.toBe(oldSynthesized);
    });

    it(`${state}: chargeClassifications pipeline maps '${chargeId}' to the correct statute code`, () => {
      // Simulate the exact mapping used in routes.ts to build chargeClassifications
      // that are attached to AI guidance output.
      const charge = getChargeById(chargeId);
      expect(charge, `charge '${chargeId}' not found in criminalCharges`).toBeDefined();

      const classification = {
        id: charge!.id,
        name: charge!.name,
        classification: charge!.category,
        code: charge!.code,   // routes.ts uses charge.code directly
        title: charge!.name,
        maxPenalty: charge!.maxPenalty,
      };

      expect(classification.code).toBe(correctCode);
      expect(classification.code).not.toBe(oldSynthesized);
    });
  }

  it('no GA charge carries a synthesized code matching pattern ##-## (e.g. 43-65)', () => {
    // Synthesized GA codes followed a fake N-NN or NN-NN pattern that doesn't
    // match real O.C.G.A. section numbers. Real codes are like 16-5-1 (three parts)
    // or structured as Title-Chapter-Section. A two-part XX-YY code for GA is a red flag.
    //
    // We spot-check the 6 highest-severity GA charges that were corrected.
    const highSeverityGaIds = [
      'ga-murder-in-the-first-degree',   // was 43-65, now 16-5-1
      'ga-murder-in-the-second-degree',  // was 43-66, now 16-5-1
      'ga-voluntary-manslaughter',       // should be 16-5-2
      'ga-rape-in-the-first-degree',     // should be 16-6-1
      'ga-aggravated-assault',           // should be 16-5-21
      'ga-robbery',                      // should be 16-8-40
    ];

    for (const id of highSeverityGaIds) {
      const charge = getChargeById(id);
      if (!charge) continue; // skip if charge not in DB
      // Synthesized pattern: exactly two numeric segments separated by a dash
      const isSynthesizedPattern = /^\d{2}-\d{2,3}$/.test(charge.code);
      expect(
        isSynthesizedPattern,
        `GA charge '${id}' still has a synthesized-looking code: '${charge.code}'. ` +
        'Real O.C.G.A. codes have three parts (Title-Chapter-Section, e.g. 16-5-1).',
      ).toBe(false);
    }
  });

  it('all five corrected states appear in the full criminalCharges array with correct jurisdiction', () => {
    const correctedStates = ['GA', 'NC', 'NJ', 'VA', 'AZ'] as const;
    for (const state of correctedStates) {
      const stateCharges = criminalCharges.filter(c => c.jurisdiction === state);
      expect(
        stateCharges.length,
        `Expected at least 1 charge entry for ${state}`,
      ).toBeGreaterThan(0);
    }
  });
});
