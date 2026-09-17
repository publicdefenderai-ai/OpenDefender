import { describe, expect, it } from 'vitest';
import { getChargeExplanation } from '../shared/charge-explanations';
import { criminalCharges } from '../shared/criminal-charges';

describe('charge explanation catalog coverage', () => {
  it('has an explanation for every distinct charge name within its catalog jurisdiction', () => {
    // A jurisdiction-specific statutory name must not require a generic
    // explanation that could accidentally export that state's law elsewhere.
    const charges = [...new Map(criminalCharges.map(charge =>
      [`${charge.jurisdiction}:${charge.name}`, charge])).values()];
    const unmatchedChargeNames = charges.filter(
      charge => getChargeExplanation(charge.name, charge.jurisdiction) === null,
    ).map(charge => `${charge.jurisdiction}: ${charge.name}`).sort();

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
    ['Aggravated murder', 'aggravated-murder'],
    ['Murder', 'murder'],
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
    ['Unlawful Possession of Cannabis in the Second Degree', 'marijuana-possession'],
    ['Statutory Rape', 'sex-offenses-against-minors'],
    ['Use of Firearm During Crime of Violence or Drug Trafficking (Federal)', 'weapons-charges'],
  ])('resolves %s to the intended %s explanation', (chargeName, expectedSlug) => {
    expect(getChargeExplanation(chargeName)?.slug).toBe(expectedSlug);
  });

  it.each(['Aggravated murder', 'Murder'])('localizes %s without assigning a legacy degree', (name) => {
    const english = getChargeExplanation(name, 'OH', 'en');
    for (const language of ['es', 'zh']) {
      const localized = getChargeExplanation(name, 'OH', language);
      expect(localized?.slug).toBe(english?.slug);
      expect(localized?.plainSummary).not.toBe(english?.plainSummary);
      expect(localized?.translationDraft).toBe(true);
      expect(localized?.pendingAttorneyReview).toBe(true);
    }
  });
});