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

  it.each([
    ['Aggravated Criminal Sexual Assault', 'sexual-assault'],
    ['Armed Career Criminal Act (Federal Three-Strikes)', 'recidivist-enhancement'],
    ['Domestic Assault in the Third Degree', 'domestic-violence'],
    ['Domestic Violence - Simple Assault', 'domestic-violence'],
    ['Driving Under Suspension', 'driving-while-suspended'],
    ['Providing False Information to Police', 'failure-to-identify'],
    ['Juvenile Firearm Possession', 'juvenile-proceedings'],
    ['Shoplifting - Retail Theft', 'shoplifting'],
    ['Theft of Services (Fare Evasion)', 'theft'],
    ['Simple Possession of Marijuana', 'marijuana-possession'],
    ['Sexual Assault in the First Degree', 'sexual-assault'],
    ['Sexual Assault in the Second Degree', 'sexual-assault'],
    ['Sexual Assault in the Third Degree', 'sexual-assault'],
    ['Unlawful Possession of Cannabis', 'marijuana-possession'],
    ['Statutory Rape', 'sex-offenses-against-minors'],
    ['Use of Firearm During Crime of Violence or Drug Trafficking (Federal)', 'weapons-charges'],
  ])('resolves %s to the intended %s explanation', (chargeName, expectedSlug) => {
    expect(getChargeExplanation(chargeName)?.slug).toBe(expectedSlug);
  });
});