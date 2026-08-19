import { describe, expect, it } from 'vitest';
import { getChargeExplanation } from '../shared/charge-explanations';
import { criminalCharges } from '../shared/criminal-charges';

describe('charge explanation catalog coverage', () => {
  it('has an explanation for every distinct charge name in the catalog', () => {
    const chargeNames = [...new Set(criminalCharges.map((charge) => charge.name))].sort();
    const unmatchedChargeNames = chargeNames.filter(
      (chargeName) => getChargeExplanation(chargeName) === null,
    );

    expect(
      unmatchedChargeNames,
      [
        'Every charge in shared/criminal-charges.ts must have a matching explanation.',
        'Add an entry to shared/charge-explanations.ts for:',
        ...unmatchedChargeNames.map((chargeName) => `  - ${chargeName}`),
      ].join('\n'),
    ).toEqual([]);
  });
});