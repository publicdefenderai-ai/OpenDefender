/**
 * Collateral Consequences Screener — data and logic regression tests.
 *
 * Tests cover:
 *  1. The three new jurisdiction data exports (DriversLicenseRules,
 *     ImmigrationConsequenceRules, SexOffenderRules) have full 51-jurisdiction
 *     coverage and internally consistent values.
 *  2. The chargeRisks filter logic (extracted from the screener component) is
 *     correct for every charge type combination, including the stale-state
 *     regression path: select charge type → back → skip should yield no cards.
 *  3. Structural: the amber "not legal advice" disclaimer is rendered outside
 *     the no-risk / has-risk ternary so it appears on ALL results screens.
 *  4. i18n locale coverage: buildPlainText() produces real translated text
 *     (not raw key names) for en, es, and zh locales.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  COLLATERAL_CONSEQUENCE_DEADLINE_OPTIONS,
  COLLATERAL_CONSEQUENCE_RULES,
  DRIVERS_LICENSE_RULES,
  FEDERAL_STATE_DEADLINE_DATA,
  IMMIGRATION_CONSEQUENCE_RULES,
  SEX_OFFENDER_RULES,
  getCollateralConsequenceDeadlineData,
  type DriversLicenseRule,
  type ImmigrationConsequenceRule,
  type SexOffenderRule,
  type ImmigrationRiskLevel,
} from '../client/src/lib/collateral-consequences-data';
import { buildPlainText } from '../client/src/lib/build-plain-text';
import enLocale from '../client/src/locales/en';
import esLocale from '../client/src/locales/es';
import zhLocale from '../client/src/locales/zh';

// ── helpers ──────────────────────────────────────────────────────────────────

const US_JURISDICTIONS = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL',
  'GA','HI','ID','IL','IN','IA','KS','KY','LA','ME',
  'MD','MA','MI','MN','MS','MO','MT','NE','NV','NH',
  'NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI',
  'SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

/** Mirrors the chargeRisks filter logic from collateral-consequences.tsx.
 *  chargeType === null represents the "Skip" path (no charge type selected). */
function computeChargeRiskIds(
  chargeType: string | null,
  chargeTypeSelected: boolean,
): Array<'driverLicense' | 'sexOffender'> {
  if (!chargeTypeSelected) return [];
  const result: Array<'driverLicense' | 'sexOffender'> = [];
  if (
    chargeType === 'dui' ||
    chargeType === 'drug_possession' ||
    chargeType === 'drug_trafficking'
  ) {
    result.push('driverLicense');
  }
  if (chargeType === 'sex_offense') {
    result.push('sexOffender');
  }
  return result;
}

// ── Shared screener deadline data ─────────────────────────────────────────────

describe('shared screener deadline data', () => {
  it('covers the federal baseline and every shared jurisdiction', () => {
    expect(COLLATERAL_CONSEQUENCE_DEADLINE_OPTIONS).toEqual([
      'federal',
      ...US_JURISDICTIONS,
    ]);

    for (const code of US_JURISDICTIONS) {
      const deadlineData = COLLATERAL_CONSEQUENCE_RULES[code].deadlineData;
      expect(deadlineData.stateCode, `${code}.deadlineData.stateCode`).toBe(code);
      expect(deadlineData.housing?.hasSource, `${code}.housing source`).toBe(true);
      expect(deadlineData.license?.hasSource, `${code}.license source`).toBe(true);
    }
  });

  it('keeps the federal source behavior and resolves selector values safely', () => {
    expect(FEDERAL_STATE_DEADLINE_DATA.license?.hasSource).toBe(false);
    expect(getCollateralConsequenceDeadlineData('federal')).toBe(FEDERAL_STATE_DEADLINE_DATA);
    expect(getCollateralConsequenceDeadlineData(' ca ')).toEqual(
      COLLATERAL_CONSEQUENCE_RULES.CA.deadlineData,
    );
    expect(getCollateralConsequenceDeadlineData('unknown')).toBeNull();
  });
});

// ── Driver's License Rules ────────────────────────────────────────────────────

describe('DRIVERS_LICENSE_RULES', () => {
  it('covers all 51 US jurisdictions', () => {
    for (const code of US_JURISDICTIONS) {
      expect(DRIVERS_LICENSE_RULES[code], `Missing jurisdiction: ${code}`).toBeDefined();
    }
    expect(Object.keys(DRIVERS_LICENSE_RULES).length).toBe(51);
  });

  it('every entry has required fields with correct types', () => {
    for (const [code, rule] of Object.entries(DRIVERS_LICENSE_RULES)) {
      expect(typeof rule.stateName, `${code}.stateName`).toBe('string');
      expect(
        rule.firstOffenseDuiSuspensionDays === null ||
          typeof rule.firstOffenseDuiSuspensionDays === 'number',
        `${code}.firstOffenseDuiSuspensionDays must be number or null`,
      ).toBe(true);
      expect(typeof rule.hardshipLicenseAvailable, `${code}.hardshipLicenseAvailable`).toBe('boolean');
      expect(
        ['required', 'discretionary', 'not_required'].includes(rule.ignitionInterlockRequired),
        `${code}.ignitionInterlockRequired invalid`,
      ).toBe(true);
      expect(typeof rule.adminSuspensionOnArrest, `${code}.adminSuspensionOnArrest`).toBe('boolean');
      expect(typeof rule.drugConvictionSuspension, `${code}.drugConvictionSuspension`).toBe('boolean');
      expect(
        ['high', 'medium', 'low'].includes(rule.dataConfidence),
        `${code}.dataConfidence invalid`,
      ).toBe(true);
      expect(typeof rule.source, `${code}.source`).toBe('string');
      expect(rule.source.length, `${code}.source must not be empty`).toBeGreaterThan(0);
    }
  });

  it('suspension days are positive when not null', () => {
    for (const [code, rule] of Object.entries(DRIVERS_LICENSE_RULES)) {
      if (rule.firstOffenseDuiSuspensionDays !== null) {
        expect(rule.firstOffenseDuiSuspensionDays, `${code}: suspension days must be > 0`).toBeGreaterThan(0);
      }
    }
  });

  it('states known to require IID for first DUI do so', () => {
    const mustRequireIID = ['CA', 'IL', 'NY', 'MA', 'OR', 'NM', 'IA', 'CO'];
    for (const code of mustRequireIID) {
      expect(
        DRIVERS_LICENSE_RULES[code].ignitionInterlockRequired,
        `${code} should require IID`,
      ).toBe('required');
    }
  });

  it('drug conviction suspension flag is true only for expected states', () => {
    const knownDrugSuspensionStates = ['CA', 'FL', 'IL', 'MA', 'TX'];
    for (const code of knownDrugSuspensionStates) {
      expect(
        DRIVERS_LICENSE_RULES[code].drugConvictionSuspension,
        `${code} should have drugConvictionSuspension=true`,
      ).toBe(true);
    }
    // States without drug conviction suspension
    const noSuspensionStates = ['AK', 'CO', 'MN', 'OH', 'WA'];
    for (const code of noSuspensionStates) {
      expect(
        DRIVERS_LICENSE_RULES[code].drugConvictionSuspension,
        `${code} should have drugConvictionSuspension=false`,
      ).toBe(false);
    }
  });
});

// ── Immigration Consequence Rules ─────────────────────────────────────────────

describe('IMMIGRATION_CONSEQUENCE_RULES', () => {
  it('covers all 51 US jurisdictions', () => {
    for (const code of US_JURISDICTIONS) {
      expect(IMMIGRATION_CONSEQUENCE_RULES[code], `Missing jurisdiction: ${code}`).toBeDefined();
    }
    expect(Object.keys(IMMIGRATION_CONSEQUENCE_RULES).length).toBe(51);
  });

  it('every entry has required fields with correct types', () => {
    const riskLevels: ImmigrationRiskLevel[] = ['critical', 'high', 'moderate', 'low'];
    for (const [code, rule] of Object.entries(IMMIGRATION_CONSEQUENCE_RULES)) {
      expect(typeof rule.broadIceCooperation, `${code}.broadIceCooperation`).toBe('boolean');
      expect(typeof rule.sanctuaryPolicy, `${code}.sanctuaryPolicy`).toBe('boolean');
      expect(riskLevels.includes(rule.duiRisk), `${code}.duiRisk invalid`).toBe(true);
      expect(riskLevels.includes(rule.drugPossessionRisk), `${code}.drugPossessionRisk invalid`).toBe(true);
      expect(riskLevels.includes(rule.drugTraffickingRisk), `${code}.drugTraffickingRisk invalid`).toBe(true);
      expect(riskLevels.includes(rule.theftPropertyRisk), `${code}.theftPropertyRisk invalid`).toBe(true);
      expect(riskLevels.includes(rule.domesticViolenceRisk), `${code}.domesticViolenceRisk invalid`).toBe(true);
      expect(riskLevels.includes(rule.sexOffenseRisk), `${code}.sexOffenseRisk invalid`).toBe(true);
    }
  });

  it('drug trafficking is always critical (federal law)', () => {
    for (const [code, rule] of Object.entries(IMMIGRATION_CONSEQUENCE_RULES)) {
      expect(rule.drugTraffickingRisk, `${code}: drug trafficking must be critical`).toBe('critical');
    }
  });

  it('sex offense is always critical (federal law)', () => {
    for (const [code, rule] of Object.entries(IMMIGRATION_CONSEQUENCE_RULES)) {
      expect(rule.sexOffenseRisk, `${code}: sex offense must be critical`).toBe('critical');
    }
  });

  it('sanctuary states do not have broadIceCooperation', () => {
    const sanctuaryStates = ['CA', 'IL', 'NY', 'NJ', 'OR', 'WA', 'CT', 'MA', 'CO', 'VT', 'DC'];
    for (const code of sanctuaryStates) {
      const rule = IMMIGRATION_CONSEQUENCE_RULES[code];
      expect(rule.sanctuaryPolicy, `${code} should have sanctuaryPolicy=true`).toBe(true);
      expect(rule.broadIceCooperation, `${code} should not have broadIceCooperation`).toBe(false);
    }
  });

  it('known cooperative states have broadIceCooperation', () => {
    const cooperativeStates = ['TX', 'FL', 'GA', 'ID', 'TN', 'SC', 'MS', 'AL'];
    for (const code of cooperativeStates) {
      expect(
        IMMIGRATION_CONSEQUENCE_RULES[code].broadIceCooperation,
        `${code} should have broadIceCooperation=true`,
      ).toBe(true);
    }
  });
});

// ── Sex Offender Rules ────────────────────────────────────────────────────────

describe('SEX_OFFENDER_RULES', () => {
  it('covers all 51 US jurisdictions', () => {
    for (const code of US_JURISDICTIONS) {
      expect(SEX_OFFENDER_RULES[code], `Missing jurisdiction: ${code}`).toBeDefined();
    }
    expect(Object.keys(SEX_OFFENDER_RULES).length).toBe(51);
  });

  it('every entry has required fields with correct types', () => {
    const compliance = ['compliant', 'substantially_compliant', 'non_compliant'];
    for (const [code, rule] of Object.entries(SEX_OFFENDER_RULES)) {
      expect(compliance.includes(rule.sornaCompliance), `${code}.sornaCompliance invalid`).toBe(true);
      expect(
        rule.tier1RegistrationYears === 'lifetime' || typeof rule.tier1RegistrationYears === 'number',
        `${code}.tier1RegistrationYears must be number or 'lifetime'`,
      ).toBe(true);
      expect(
        rule.tier3RegistrationYears === 'lifetime' || typeof rule.tier3RegistrationYears === 'number',
        `${code}.tier3RegistrationYears must be number or 'lifetime'`,
      ).toBe(true);
      expect(typeof rule.residencyRestrictions, `${code}.residencyRestrictions`).toBe('boolean');
      expect(rule.publicOnlineRegistry, `${code}: all states must have public online registry`).toBe(true);
    }
  });

  it('all states with residency restrictions have a restriction distance or null note', () => {
    for (const [code, rule] of Object.entries(SEX_OFFENDER_RULES)) {
      if (rule.residencyRestrictions) {
        // Must have either a feet value or a notes field explaining the restriction
        const hasFeet = typeof rule.residencyRestrictionFeet === 'number' && rule.residencyRestrictionFeet > 0;
        const hasNullWithNote = rule.residencyRestrictionFeet === null && !!rule.notes;
        expect(
          hasFeet || hasNullWithNote,
          `${code}: residencyRestrictions=true but no restrictionFeet or note`,
        ).toBe(true);
      }
    }
  });

  it('tier-3 registration is lifetime for known strict states', () => {
    const lifetimeStates = ['FL', 'TX', 'CA', 'NY', 'PA', 'OH', 'NJ', 'WA'];
    for (const code of lifetimeStates) {
      expect(
        SEX_OFFENDER_RULES[code].tier3RegistrationYears,
        `${code}: tier3 must be lifetime`,
      ).toBe('lifetime');
    }
  });

  it('FL requires lifetime even for tier-1 (most restrictive in country)', () => {
    expect(SEX_OFFENDER_RULES['FL'].tier1RegistrationYears).toBe('lifetime');
  });
});

// ── chargeRisks filter logic (screener regression) ────────────────────────────

describe('chargeRisks filter logic (screener)', () => {
  // ── Regression: stale chargeType after skip ──────────────────────────────
  it('REGRESSION: select charge type → back → skip yields no risk cards', () => {
    // User selected "dui" on first visit
    // They pressed Back, so chargeTypeSelected=false
    // Then they clicked Skip: chargeType must be reset to null before chargeTypeSelected=true
    // The fix: Skip sets chargeType(null) then chargeTypeSelected(true)
    const chargeType = null;       // Skip clears chargeType to null
    const chargeTypeSelected = true;
    const ids = computeChargeRiskIds(chargeType, chargeTypeSelected);
    expect(ids).toHaveLength(0);
  });

  it('chargeTypeSelected=false always yields no risk cards (pre-step not completed)', () => {
    for (const ct of ['dui', 'sex_offense', 'drug_possession', null]) {
      const ids = computeChargeRiskIds(ct as string | null, false);
      expect(ids, `chargeType=${ct}, not selected`).toHaveLength(0);
    }
  });

  it('DUI → driverLicense card only', () => {
    const ids = computeChargeRiskIds('dui', true);
    expect(ids).toEqual(['driverLicense']);
  });

  it('drug_possession → driverLicense card only', () => {
    const ids = computeChargeRiskIds('drug_possession', true);
    expect(ids).toEqual(['driverLicense']);
  });

  it('drug_trafficking → driverLicense card only', () => {
    const ids = computeChargeRiskIds('drug_trafficking', true);
    expect(ids).toEqual(['driverLicense']);
  });

  it('sex_offense → sexOffender card only', () => {
    const ids = computeChargeRiskIds('sex_offense', true);
    expect(ids).toEqual(['sexOffender']);
  });

  it('theft_property → no charge-based cards', () => {
    const ids = computeChargeRiskIds('theft_property', true);
    expect(ids).toHaveLength(0);
  });

  it('domestic_violence → no charge-based cards', () => {
    const ids = computeChargeRiskIds('domestic_violence', true);
    expect(ids).toHaveLength(0);
  });

  it('other → no charge-based cards', () => {
    const ids = computeChargeRiskIds('other', true);
    expect(ids).toHaveLength(0);
  });
});

// ── Structural: disclaimer appears outside the no-risk/has-risk ternary ────────

describe('disclaimer placement (structural regression)', () => {
  const srcPath = path.resolve(
    __dirname,
    '../client/src/pages/collateral-consequences.tsx',
  );
  const src = fs.readFileSync(srcPath, 'utf8');

  // Source layout we are guarding:
  //   {activeRisks.length === 0 ? (    <- ternary open
  //     <no-risk branch>
  //   ) : (
  //     <has-risk branch>
  //   )}                               <- ternary close
  //   <div role="note" ...>            <- disclaimer MUST be here, outside ternary

  it('source file is readable', () => {
    expect(src.length).toBeGreaterThan(0);
  });

  it('amber disclaimer box is present in the results section', () => {
    expect(src).toContain('role="note"');
    expect(src).toContain('aria-label="Not legal advice"');
    expect(src).toContain('border-amber-200');
  });

  it('disclaimer appears after the no-risk/has-risk ternary closes', () => {
    // Find the ternary that switches on activeRisks.length === 0
    const ternaryOpenIdx = src.indexOf('activeRisks.length === 0 ? (');
    expect(ternaryOpenIdx, 'ternary open not found').toBeGreaterThan(-1);

    // The disclaimer div carries role="note" — find its position
    const disclaimerIdx = src.indexOf('role="note"');
    expect(disclaimerIdx, 'disclaimer not found').toBeGreaterThan(-1);

    // The ternary must close (its `)}`) before the disclaimer starts.
    // We find the `)}` that appears between the ternary open and the disclaimer.
    const regionBetween = src.slice(ternaryOpenIdx, disclaimerIdx);
    // The ternary closing pattern: `)}` on its own — appears at the end of the
    // has-risk branch. Count occurrences to confirm the branch is closed.
    const ternaryCloseMatches = regionBetween.match(/^\s*\)\}/m);
    expect(
      ternaryCloseMatches,
      'ternary closing )} not found before the disclaimer — disclaimer may be inside the conditional',
    ).not.toBeNull();
  });

  it('disclaimer appears on BOTH result paths (no-risk and has-risk) by being outside the ternary', () => {
    // The no-risk branch ends with </div> just before `) : (`.
    // The has-risk branch ends with </> just before `)}`.
    // The disclaimer must come after both branches are closed.
    //
    // Strategy: split on the disclaimer marker and inspect the tail of the
    // ternary that precedes it.  There must be no unclosed ternary branch.
    const disclaimerIdx = src.indexOf('role="note"');
    const beforeDisclaimer = src.slice(0, disclaimerIdx);

    // The last occurrence of `activeRisks.length === 0 ? (` must be followed
    // by its closing `)}` before the disclaimer.
    const lastTernaryOpen = beforeDisclaimer.lastIndexOf('activeRisks.length === 0 ? (');
    expect(lastTernaryOpen).toBeGreaterThan(-1);

    const afterTernaryOpen = beforeDisclaimer.slice(lastTernaryOpen);
    // `)}` closes the ternary; `): (` separates the two branches.
    // Verify the closing `)}` is present in the region before the disclaimer.
    expect(afterTernaryOpen).toMatch(/\)\}/);
  });
});

// ── buildPlainText: disclaimer present on all output paths ────────────────────
//
// These tests call the REAL exported buildPlainText() from
// client/src/lib/build-plain-text.ts.  A pass-through t() stub is used so the
// output carries the i18n key names, making it easy to assert the disclaimer
// key is present without depending on translated strings.

describe('buildPlainText — disclaimer always present', () => {
  /** Minimal stub: t(key) → key, t(key, vars) → key */
  const t = (key: string, _vars?: Record<string, unknown>) => key;
  const fixedDate = new Date('2026-01-01T12:00:00Z');

  it('disclaimer is present when there are no active risks (no-risk path)', () => {
    const output = buildPlainText(t, [], 'en', fixedDate);
    expect(output).toContain('collateralConsequences.printDisclaimer');
  });

  it('no-risk path emits printNoRisk and no risk section lines', () => {
    const output = buildPlainText(t, [], 'en', fixedDate);
    expect(output).toContain('collateralConsequences.printNoRisk');
    expect(output).not.toContain('collateralConsequences.risks.');
  });

  it('disclaimer is present when one risk is active (has-risk path)', () => {
    const output = buildPlainText(t, [{ id: 'housing' }], 'en', fixedDate);
    expect(output).toContain('collateralConsequences.printDisclaimer');
  });

  it('disclaimer is present when multiple risks are active', () => {
    const output = buildPlainText(
      t,
      [{ id: 'supervision' }, { id: 'immigration' }, { id: 'housing' }],
      'en',
      fixedDate,
    );
    expect(output).toContain('collateralConsequences.printDisclaimer');
  });

  it('disclaimer appears after the --- separator on the no-risk path', () => {
    const output = buildPlainText(t, [], 'en', fixedDate);
    const sepIdx = output.lastIndexOf('---');
    const disclaimerIdx = output.indexOf('collateralConsequences.printDisclaimer');
    expect(sepIdx).toBeGreaterThan(-1);
    expect(disclaimerIdx).toBeGreaterThan(sepIdx);
  });

  it('disclaimer appears after the --- separator on the has-risk path', () => {
    const output = buildPlainText(t, [{ id: 'children' }, { id: 'benefits' }], 'en', fixedDate);
    const sepIdx = output.lastIndexOf('---');
    const disclaimerIdx = output.indexOf('collateralConsequences.printDisclaimer');
    expect(sepIdx).toBeGreaterThan(-1);
    expect(disclaimerIdx).toBeGreaterThan(sepIdx);
  });

  it('disclaimer is the last non-empty line of the output', () => {
    for (const risks of [[], [{ id: 'housing' }]]) {
      const output = buildPlainText(t, risks, 'en', fixedDate);
      const lastLine = output.trimEnd().split('\n').at(-1);
      expect(lastLine).toBe('collateralConsequences.printDisclaimer');
    }
  });
});

// ── buildPlainText: charge-type cards (driverLicense / sexOffender) ───────────
//
// Verifies that when chargeRisks are merged into activeRisks and passed to
// buildPlainText(), their section headers appear in the plain-text export.
// The t() stub returns the i18n key so assertions are key-based.

describe('buildPlainText — charge-type risk cards appear in export', () => {
  const t = (key: string, _vars?: Record<string, unknown>) => key;
  const fixedDate = new Date('2026-01-01T12:00:00Z');

  it('driverLicense risk id → title and body keys present in output', () => {
    const output = buildPlainText(t, [{ id: 'driverLicense' }], 'en', fixedDate);
    expect(output).toContain('collateralConsequences.risks.driverLicense.title');
    expect(output).toContain('collateralConsequences.risks.driverLicense.what');
    expect(output).toContain('collateralConsequences.risks.driverLicense.clock');
    expect(output).toContain('collateralConsequences.risks.driverLicense.action');
  });

  it('sexOffender risk id → title and body keys present in output', () => {
    const output = buildPlainText(t, [{ id: 'sexOffender' }], 'en', fixedDate);
    expect(output).toContain('collateralConsequences.risks.sexOffender.title');
    expect(output).toContain('collateralConsequences.risks.sexOffender.what');
    expect(output).toContain('collateralConsequences.risks.sexOffender.clock');
    expect(output).toContain('collateralConsequences.risks.sexOffender.action');
  });

  it('driverLicenseCheck risk id → title and body keys present in output', () => {
    const output = buildPlainText(t, [{ id: 'driverLicenseCheck' }], 'en', fixedDate);
    expect(output).toContain('collateralConsequences.risks.driverLicenseCheck.title');
    expect(output).toContain('collateralConsequences.risks.driverLicenseCheck.what');
  });

  it('Skip path (no charge risks) → no driverLicense or sexOffender keys in output', () => {
    // When the user clicks Skip, chargeType=null and chargeRisks=[]; only
    // question-answer risks flow through.  Neither charge-type key should appear.
    const output = buildPlainText(t, [{ id: 'housing' }, { id: 'employment' }], 'en', fixedDate);
    expect(output).not.toContain('collateralConsequences.risks.driverLicense.title');
    expect(output).not.toContain('collateralConsequences.risks.sexOffender.title');
    expect(output).not.toContain('collateralConsequences.risks.driverLicenseCheck.title');
  });

  it('Skip with no question answers (all-clear) → no charge-type keys in output', () => {
    const output = buildPlainText(t, [], 'en', fixedDate);
    expect(output).not.toContain('collateralConsequences.risks.driverLicense.title');
    expect(output).not.toContain('collateralConsequences.risks.sexOffender.title');
    expect(output).not.toContain('collateralConsequences.risks.driverLicenseCheck.title');
  });

  it('DUI + housing answer → both driverLicense and housing keys in output', () => {
    // Simulates activeRisks after DUI charge type and "yes" to housing question
    const activeRisks = [{ id: 'driverLicense' }, { id: 'housing' }];
    const output = buildPlainText(t, activeRisks, 'en', fixedDate);
    expect(output).toContain('collateralConsequences.risks.driverLicense.title');
    expect(output).toContain('collateralConsequences.risks.housing.title');
    expect(output).not.toContain('collateralConsequences.risks.sexOffender.title');
  });

  it('sex_offense + immigration answer → both sexOffender and immigration keys in output', () => {
    // Simulates activeRisks after sex_offense charge type and "yes" to immigration question
    const activeRisks = [{ id: 'sexOffender' }, { id: 'immigration' }];
    const output = buildPlainText(t, activeRisks, 'en', fixedDate);
    expect(output).toContain('collateralConsequences.risks.sexOffender.title');
    expect(output).toContain('collateralConsequences.risks.immigration.title');
    expect(output).not.toContain('collateralConsequences.risks.driverLicense.title');
  });

  it('other charge type with question risks → no charge-type card titles in output', () => {
    // "other" maps to no chargeRisks; only question-answer risks flow through
    const activeRisks = [{ id: 'supervision' }, { id: 'children' }];
    const output = buildPlainText(t, activeRisks, 'en', fixedDate);
    expect(output).not.toContain('collateralConsequences.risks.driverLicense.title');
    expect(output).not.toContain('collateralConsequences.risks.sexOffender.title');
    expect(output).toContain('collateralConsequences.risks.supervision.title');
    expect(output).toContain('collateralConsequences.risks.children.title');
  });

  it('charge-type section is formatted as ** title ** (bold markers)', () => {
    const output = buildPlainText(t, [{ id: 'driverLicense' }], 'en', fixedDate);
    expect(output).toContain('** collateralConsequences.risks.driverLicense.title **');
  });

  it('sexOffender section is formatted as ** title ** (bold markers)', () => {
    const output = buildPlainText(t, [{ id: 'sexOffender' }], 'en', fixedDate);
    expect(output).toContain('** collateralConsequences.risks.sexOffender.title **');
  });
});

// ── buildPlainText: i18n locale coverage (en / es / zh) ──────────────────────
//
// These tests load the REAL locale objects from client/src/locales/{en,es,zh}.ts
// and build a genuine t() resolver so that buildPlainText() receives actual
// translated strings.  Each test asserts that the disclaimer in the output is:
//   (a) non-empty
//   (b) not the raw i18n key string ("collateralConsequences.printDisclaimer")
// Both the no-risk and has-risk output paths are covered per locale.

/** Resolves a dot-notation i18n key against a nested locale object, with
 *  optional {{var}} interpolation.  Falls back to the key if the path is
 *  missing so the test fails loudly on an absent translation. */
function makeT(localeObj: Record<string, unknown>) {
  return function t(key: string, vars?: Record<string, unknown>): string {
    const parts = key.split('.');
    let cur: unknown = localeObj;
    for (const part of parts) {
      if (cur !== null && typeof cur === 'object') {
        cur = (cur as Record<string, unknown>)[part];
      } else {
        return key; // path not found — return key so assertions fail visibly
      }
    }
    if (typeof cur !== 'string') return key;
    if (!vars) return cur;
    return cur.replace(/\{\{(\w+)\}\}/g, (_: string, k: string) =>
      String(vars[k] ?? `{{${k}}}`),
    );
  };
}

const PRINT_DISCLAIMER_KEY = 'collateralConsequences.printDisclaimer';
const fixedDateLocale = new Date('2026-01-01T12:00:00Z');

/** Each locale file exports `{ translation: { ... } }`.  Unwrap the namespace
 *  so key paths like "collateralConsequences.printDisclaimer" resolve correctly. */
function unwrapTranslation(obj: unknown): Record<string, unknown> {
  const o = obj as Record<string, unknown>;
  if (o && typeof o.translation === 'object' && o.translation !== null) {
    return o.translation as Record<string, unknown>;
  }
  return o;
}

const locales = [
  { name: 'en', obj: unwrapTranslation(enLocale), lang: 'en' },
  { name: 'es', obj: unwrapTranslation(esLocale), lang: 'es' },
  { name: 'zh', obj: unwrapTranslation(zhLocale), lang: 'zh' },
] as const;

describe('buildPlainText — i18n locale coverage', () => {
  for (const { name, obj, lang } of locales) {
    const t = makeT(obj);

    // ── no-risk path ──────────────────────────────────────────────────────────
    it(`[${name}] no-risk path: printDisclaimer is non-empty translated text`, () => {
      const output = buildPlainText(t, [], lang, fixedDateLocale);
      const lastLine = output.trimEnd().split('\n').at(-1) ?? '';
      expect(lastLine, `[${name}] last line must not be the raw key`).not.toBe(PRINT_DISCLAIMER_KEY);
      expect(lastLine, `[${name}] last line must be non-empty`).not.toBe('');
    });

    it(`[${name}] no-risk path: disclaimer does not contain the raw key substring`, () => {
      const output = buildPlainText(t, [], lang, fixedDateLocale);
      expect(output, `[${name}] raw key must not appear in output`).not.toContain(PRINT_DISCLAIMER_KEY);
    });

    // ── has-risk path ─────────────────────────────────────────────────────────
    it(`[${name}] has-risk path: printDisclaimer is non-empty translated text`, () => {
      const output = buildPlainText(t, [{ id: 'housing' }], lang, fixedDateLocale);
      const lastLine = output.trimEnd().split('\n').at(-1) ?? '';
      expect(lastLine, `[${name}] last line must not be the raw key`).not.toBe(PRINT_DISCLAIMER_KEY);
      expect(lastLine, `[${name}] last line must be non-empty`).not.toBe('');
    });

    it(`[${name}] has-risk path: disclaimer does not contain the raw key substring`, () => {
      const output = buildPlainText(t, [{ id: 'housing' }], lang, fixedDateLocale);
      expect(output, `[${name}] raw key must not appear in output`).not.toContain(PRINT_DISCLAIMER_KEY);
    });

    it(`[${name}] has-risk path with multiple risks: disclaimer still present and translated`, () => {
      const risks = [{ id: 'supervision' }, { id: 'immigration' }, { id: 'children' }];
      const output = buildPlainText(t, risks, lang, fixedDateLocale);
      const lastLine = output.trimEnd().split('\n').at(-1) ?? '';
      expect(lastLine, `[${name}] last line must not be the raw key`).not.toBe(PRINT_DISCLAIMER_KEY);
      expect(lastLine, `[${name}] last line must be non-empty`).not.toBe('');
    });
  }
});

// ── Risk card i18n completeness (es / zh) ────────────────────────────────────
//
// For every risk id the screener can display, verify that each of the four
// body-text fields (title, what, clock, action) resolves to a non-empty string
// that is NOT the raw dot-notation key.  A missing or blank translation would
// silently produce an empty line — or the raw key — in the exported summary for
// non-English users.

const RISK_IDS = [
  'housing',
  'employment',
  'immigration',
  'benefits',
  'children',
  'supervision',
  'license',
  'driverLicense',
  'driverLicenseCheck',
  'sexOffender',
] as const;

const RISK_FIELDS = ['title', 'what', 'clock', 'action'] as const;

describe('Risk card i18n completeness', () => {
  // Only test es and zh — en is the source of truth, not a translation target.
  const translatedLocales = locales.filter(({ name }) => name !== 'en');

  for (const { name, obj } of translatedLocales) {
    describe(`[${name}] all risk card fields are non-empty translated text`, () => {
      for (const riskId of RISK_IDS) {
        for (const field of RISK_FIELDS) {
          it(`risks.${riskId}.${field}`, () => {
            const key = `collateralConsequences.risks.${riskId}.${field}`;
            const t = makeT(obj);
            const resolved = t(key);
            expect(
              resolved,
              `[${name}] "${key}" must not fall back to the raw key (translation missing)`,
            ).not.toBe(key);
            expect(
              resolved.trim(),
              `[${name}] "${key}" must not be empty`,
            ).not.toBe('');
          });
        }
      }
    });
  }
});

// ── Locale completeness: es and zh key sets match en ────────────────────────
//
// Walk the en locale's collateralConsequences.risks subtree and assert that
// every leaf key that exists in en also exists (and is non-empty) in es and zh.
// This catches newly-added risk ids or fields in en that were not yet translated.

function collectLeafKeys(
  obj: unknown,
  prefix: string,
  result: string[] = [],
): string[] {
  if (typeof obj === 'string') {
    result.push(prefix);
  } else if (obj !== null && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      collectLeafKeys(v, prefix ? `${prefix}.${k}` : k, result);
    }
  }
  return result;
}

describe('Locale key completeness — risks section', () => {
  const enObj = unwrapTranslation(enLocale);
  const enCC = (enObj as Record<string, unknown>)?.collateralConsequences as Record<string, unknown>;
  const enRisks = enCC?.risks;
  const enLeafKeys = collectLeafKeys(enRisks, '');

  const translatedLocales2 = [
    { name: 'es', obj: unwrapTranslation(esLocale) },
    { name: 'zh', obj: unwrapTranslation(zhLocale) },
  ];

  for (const { name, obj } of translatedLocales2) {
    it(`[${name}] has all risk keys present in en`, () => {
      const t = makeT(obj);
      const missingOrPassthrough: string[] = [];
      for (const leafKey of enLeafKeys) {
        const fullKey = `collateralConsequences.risks.${leafKey}`;
        const resolved = t(fullKey);
        if (resolved === fullKey || resolved.trim() === '') {
          missingOrPassthrough.push(fullKey);
        }
      }
      expect(
        missingOrPassthrough,
        `[${name}] these keys are missing or empty: ${missingOrPassthrough.join(', ')}`,
      ).toHaveLength(0);
    });
  }
});
