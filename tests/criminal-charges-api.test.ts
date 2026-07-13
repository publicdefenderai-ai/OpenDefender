import { describe, it, expect } from 'vitest';
import { getChargesByJurisdiction, getInstructionRef, getInstructionUrl } from '../shared/criminal-charges';

function buildApiShape(jurisdiction: string) {
  return getChargesByJurisdiction(jurisdiction).map(charge => {
    const instructionRef = getInstructionRef(charge);
    const instructionUrl = getInstructionUrl(charge);
    return {
      id: charge.id,
      code: charge.code,
      name: charge.name,
      category: charge.category,
      ...(instructionRef ? { instructionRef } : {}),
      ...(instructionUrl ? { instructionUrl } : {}),
    };
  });
}

describe('/api/criminal-charges?jurisdiction=CA — instructionRef/instructionUrl field shape', () => {
  const caCharges = buildApiShape('CA');

  it('returns at least one CA charge', () => {
    expect(caCharges.length).toBeGreaterThan(0);
  });

  it('ca-robbery-in-the-first-degree is present in the CA charge list', () => {
    const robbery = caCharges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(robbery, 'ca-robbery-in-the-first-degree missing from /api/criminal-charges?jurisdiction=CA').toBeDefined();
  });

  it('ca-robbery-in-the-first-degree has instructionRef: "CALCRIM 1600"', () => {
    const robbery = caCharges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(robbery).toBeDefined();
    expect((robbery as any).instructionRef).toBe('CALCRIM 1600');
  });

  it('ca-robbery-in-the-first-degree has a non-null instructionUrl', () => {
    const robbery = caCharges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(robbery).toBeDefined();
    expect((robbery as any).instructionUrl).toBeTruthy();
  });

  it('at least one CA charge in the API response has both instructionRef and instructionUrl', () => {
    const withBoth = caCharges.filter(c => (c as any).instructionRef && (c as any).instructionUrl);
    expect(
      withBoth.length,
      'No CA charges have both instructionRef and instructionUrl — citation overlay may be disconnected from the charges list',
    ).toBeGreaterThan(0);
  });

  it('ca-robbery-in-the-first-degree instructionUrl points to courts.ca.gov', () => {
    const robbery = caCharges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(robbery).toBeDefined();
    expect((robbery as any).instructionUrl).toMatch(/courts\.ca\.gov/);
  });
});
