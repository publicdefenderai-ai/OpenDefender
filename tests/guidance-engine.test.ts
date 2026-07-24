import { describe, it, expect } from 'vitest';
import { generateEnhancedGuidance } from '../server/services/guidance-engine';

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
