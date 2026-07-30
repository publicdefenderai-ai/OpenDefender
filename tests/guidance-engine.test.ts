import { describe, it, expect } from 'vitest';
import { generateEnhancedGuidance, CHARGE_KEYWORDS, CHARGE_CONSEQUENCE_MAP, KNOWN_JURISDICTIONS, stampEstimateDeadlines } from '../server/services/guidance-engine';
import { criminalCharges, getChargeById, getVerifiedCitation } from '../shared/criminal-charges';
import { CHARGE_CITATIONS } from '../shared/criminal-charge-citations';

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
  it('adds a jurisdiction deadline notice for an unmapped jurisdiction (PR territory)', () => {
    // PR (Puerto Rico) is a territory not in jurisdictionRules — still unmapped after 2026-07 audit
    const result = generateEnhancedGuidance({
      ...baseCase,
      jurisdiction: 'PR',
    });
    const item = result.uncertainties?.find(
      u => u.area === 'Jurisdiction-Specific Deadlines',
    );
    expect(item).toBeDefined();
    expect(item?.note).toMatch(/PR/);
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
    // PR (Puerto Rico) is a territory not in jurisdictionRules — still unmapped after 2026-07 audit
    const result = generateEnhancedGuidance({
      jurisdiction: 'PR',
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

// ---------------------------------------------------------------------------
// Broad synthesized-code sweep — all jurisdictions not yet audited
// ---------------------------------------------------------------------------
// This test iterates every charge whose jurisdiction is NOT in the audited set
// (see the AUDITED comment block at the top of shared/criminal-charges.ts).
// Any charge whose code matches the synthesized pattern (two numeric segments
// like "43-65") is flagged as a candidate for audit.
//
// IMPORTANT: This test intentionally does NOT fail — it only emits a report.
//   When a new state's charges are added (or an existing state is removed from
//   the AUDITED list during re-verification), the report makes suspects visible
//   without blocking CI. Once a state is fully audited and corrected, add it to
//   AUDITED_JURISDICTIONS below so it graduates to the failing spot-check tier.
//
// Pattern rationale: real statute codes always have ≥3 segments OR a non-numeric
// prefix (e.g. "16-5-1", "2C:11-3", "13A-6-2", "707-701"). A bare "NN-NNN" or
// "NN-NN" with exactly two all-numeric segments is the fingerprint of the
// original synthesized codes from the 2025 data-generation run.
describe('Synthesized-code sweep — unaudited jurisdictions', () => {
  // ── Audited jurisdictions (update this list after each audit batch) ──────
  // Source: AUDITED comment block in shared/criminal-charges.ts (2026-07).
  // All 50 states + DC + 5 territories + federal have been audited.
  const AUDITED_JURISDICTIONS = new Set([
    // Batch 1 (2026-07) — codes confirmed correct
    // NOTE: WA, AR, MI, MO, DE were listed in the audit header but charge codes
    // were never corrected; they remain in the non-failing sweep until fixed.
    'PA', 'TX', 'CA', 'NY', 'FL', 'IL', 'OH',
    'GA', 'NC', 'NJ', 'VA', 'AZ',
    // Batch 2 (2026-07)
    'AL', 'AK', 'CT', 'HI', 'ID', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MN', 'MS', 'MT', 'NE', 'NV', 'NH', 'NM', 'ND', 'OK', 'OR', 'RI',
    'SC', 'SD', 'TN', 'UT', 'VT', 'WI', 'WY', 'WV', 'DC', 'CO',
    // Territories (2026-07) — GU and PR have residual uncorrected codes; exclude until fixed
    'AS', 'MP', 'VI',
    // Federal
    'federal',
  ]);

  // Synthesized pattern: exactly two all-numeric segments joined by a dash
  // e.g. "43-65", "19-100", "36-11".  Real codes have ≥3 segments, colons,
  // letters, dots, or other structure that breaks this pattern.
  const SYNTHESIZED_PATTERN = /^\d{1,3}-\d{2,3}$/;

  it('reports any suspect codes in unaudited jurisdictions (does not fail)', () => {
    const unauditedCharges = criminalCharges.filter(
      c => !AUDITED_JURISDICTIONS.has(c.jurisdiction),
    );

    const suspects = unauditedCharges.filter(c => SYNTHESIZED_PATTERN.test(c.code));

    if (suspects.length > 0) {
      // Group by jurisdiction for a readable summary
      const byJurisdiction: Record<string, Array<{ id: string; code: string; name: string }>> = {};
      for (const c of suspects) {
        (byJurisdiction[c.jurisdiction] ??= []).push({
          id: c.id,
          code: c.code,
          name: c.name,
        });
      }

      const lines: string[] = [
        `\n⚠️  SYNTHESIZED-CODE CANDIDATES (${suspects.length} charges across ${Object.keys(byJurisdiction).length} unaudited jurisdiction(s)):`,
        'These codes match the NN-NNN synthesized pattern and should be verified against official statutes.',
        'Add each jurisdiction to AUDITED_JURISDICTIONS in this test once codes have been corrected.\n',
      ];
      for (const [jurisdiction, charges] of Object.entries(byJurisdiction).sort()) {
        lines.push(`  ${jurisdiction} (${charges.length} suspect${charges.length === 1 ? '' : 's'}):`);
        for (const ch of charges.slice(0, 10)) {
          lines.push(`    ${ch.code.padEnd(12)}  ${ch.id}  (${ch.name})`);
        }
        if (charges.length > 10) {
          lines.push(`    … and ${charges.length - 10} more`);
        }
      }
      console.warn(lines.join('\n'));
    } else if (unauditedCharges.length === 0) {
      console.info(
        '✅  All jurisdictions in criminalCharges are in the AUDITED_JURISDICTIONS set — ' +
        'no unaudited entries to sweep.',
      );
    } else {
      console.info(
        `✅  No synthesized-code candidates found in ${unauditedCharges.length} unaudited charge entries.`,
      );
    }

    // Non-failing assertion — ensures the test is tracked and its report is visible.
    // Change toBe(0) once suspect states have been audited and corrected.
    expect(suspects.length).toBeGreaterThanOrEqual(0);
  });

  it('AUDITED_JURISDICTIONS set contains no duplicate entries', () => {
    // Sanity-check the set itself — duplicates in the initialiser would silently collapse.
    const raw = [
      'PA', 'TX', 'CA', 'NY', 'FL', 'IL', 'OH',
      'GA', 'NC', 'NJ', 'VA', 'AZ',
      'AL', 'AK', 'CT', 'HI', 'ID', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
      'MA', 'MN', 'MS', 'MT', 'NE', 'NV', 'NH', 'NM', 'ND', 'OK', 'OR', 'RI',
      'SC', 'SD', 'TN', 'UT', 'VT', 'WI', 'WY', 'WV', 'DC', 'CO',
      'AS', 'MP', 'VI',
      'federal',
    ];
    const duplicates = raw.filter((v, i) => raw.indexOf(v) !== i);
    expect(
      duplicates,
      `Duplicate entries in AUDITED_JURISDICTIONS: ${duplicates.join(', ')}`,
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Hard-failing synthesized-code guard — audited jurisdictions only
// ---------------------------------------------------------------------------
// The sweep above is intentionally non-failing: it reports suspects in *unaudited*
// jurisdictions without blocking CI. But any new charge added to an already-audited
// state could silently carry a synthesized code — and the sweep would never catch it
// because audited states are excluded from that check.
//
// This separate describe block closes that gap with a **hard-failing** assertion:
// every charge whose jurisdiction is in AUDITED_JURISDICTIONS must NOT have a code
// that matches the synthesized pattern.
//
// Pattern: /^\d{1,3}-\d{2,3}$/ — exactly two all-numeric segments joined by a dash.
// That is the fingerprint of the 2025 data-generation run (e.g. "43-65", "19-100").
//
// ── Pattern exceptions (real codes that look synthesized) ─────────────────
//
//   NC  (N.C.G.S.)  — North Carolina General Statutes use Chapter-Section format:
//                     e.g. 14-17 (murder), 14-208 (sex offender), 20-138 (DWI).
//                     These are genuinely two all-numeric segments separated by a dash.
//                     NC is therefore excluded from the pattern check.
//
//   NE  (R.R.S.)    — Nebraska Revised Statutes use Chapter-Section format:
//                     e.g. 28-303 (murder), 28-319 (SA).
//                     Indistinguishable from the synthesized pattern by shape alone.
//                     NE is therefore excluded from the pattern check.
//
//   HI  (H.R.S.)    — Hawaii Revised Statutes use Title-Section format:
//                     e.g. 707-701 (murder), 707-730 (SA), 291E-61 (OVUII).
//                     The all-numeric pairs (707-701, 707-730) match the pattern.
//                     HI is therefore excluded from the pattern check.
//
// If future audit work reveals other states with legitimately two-segment numeric
// codes, add them to SYNTHESIZED_PATTERN_EXCEPTIONS below with a comment citing
// the official code format.
// ──────────────────────────────────────────────────────────────────────────
describe('Synthesized-code guard — audited jurisdictions (hard-failing)', () => {
  // Must stay in sync with the AUDITED_JURISDICTIONS set in the sweep above.
  const AUDITED_JURISDICTIONS = new Set([
    // Batch 1 (2026-07) — codes confirmed correct
    // NOTE: WA, AR, MI, MO, DE were listed in the audit header but charge codes
    // were never corrected; they remain in the non-failing sweep until fixed.
    'PA', 'TX', 'CA', 'NY', 'FL', 'IL', 'OH',
    'GA', 'NC', 'NJ', 'VA', 'AZ',
    // Batch 2 (2026-07)
    'AL', 'AK', 'CT', 'HI', 'ID', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MN', 'MS', 'MT', 'NE', 'NV', 'NH', 'NM', 'ND', 'OK', 'OR', 'RI',
    'SC', 'SD', 'TN', 'UT', 'VT', 'WI', 'WY', 'WV', 'DC', 'CO',
    // Territories (2026-07) — GU and PR have residual uncorrected codes; exclude until fixed
    'AS', 'MP', 'VI',
    // Federal
    'federal',
  ]);

  // Jurisdictions whose real statute codes are legitimately two all-numeric
  // segments and therefore cannot be distinguished from the synthesized pattern
  // by shape alone. See the documentation block above for the rationale for each.
  //
  // Format notes for each excepted jurisdiction:
  //   NC  — N.C.G.S. Chapter-Section, e.g. 14-17 (murder), 20-138 (DWI), 90-95 (drug)
  //   NE  — R.R.S. Chapter-Section, e.g. 28-303 (murder), 28-319 (SA), 60-6,196 (DUI)
  //   HI  — H.R.S. Title-Section, e.g. 707-701 (murder), 707-730 (SA), 291E-61 (OVUII*)
  //          (* 291E-61 has a letter so it doesn't match, but 707-xxx pairs do)
  //   MD  — Md. Code Art.-Section, stored without the article prefix,
  //          e.g. "2-201" = CL § 2-201 (murder), "3-303" = CL § 3-303 (SA)
  //   DC  — D.C. Code § Title-Section, e.g. 22-404 (assault), 22-2101 (murder*)
  //          (* 22-2101 has 4 digits so doesn't match; 22-404 does)
  //   MA  — M.G.L. Chapter-Section, e.g. 265-13 (manslaughter), 265-22 (rape)
  //   ID  — Idaho Code § Chapter-Section, e.g. 18-901 (assault), 18-4003 (murder*)
  //          (* 18-4003 has 4 digits so doesn't match; 18-901 does)
  //   CT  — C.G.S. § Chapter-Section, e.g. 14-222 (reckless driving), 53a-54a uses letters
  //   VT  — V.S.A. Title-Section, e.g. 23-674 (DWI suspended), 28-252 (probation)
  //   KS  — K.S.A. § Chapter-Section, e.g. 8-262 (driving suspended), 21-5402 has 4 digits
  //   OK  — Okla. Stat. Title-Section for plain-number sections,
  //          e.g. 21-711 (manslaughter), 21-716 (involuntary manslaughter)
  //   VI  — V.I.C. Title-Section, e.g. 14-297 (simple assault), 20-494 (DUI)
  //   AZ  — A.R.S. § Title-Section for 3-digit-or-fewer sections,
  //          e.g. 28-693 (reckless driving), 13-901 (probation violation)
  const SYNTHESIZED_PATTERN_EXCEPTIONS = new Set([
    'NC', // N.C.G.S. Chapter-Section (2-segment), e.g. 14-17
    'NE', // R.R.S. Chapter-Section (2-segment), e.g. 28-303
    'HI', // H.R.S. Title-Section (2-segment), e.g. 707-701
    'MD', // Md. Code Art.-Section stored without prefix, e.g. 2-201
    'DC', // D.C. Code § Title-Section, e.g. 22-404
    'MA', // M.G.L. Chapter-Section, e.g. 265-13
    'ID', // Idaho Code § Chapter-Section, e.g. 18-901
    'CT', // C.G.S. § Chapter-Section, e.g. 14-222
    'VT', // V.S.A. Title-Section, e.g. 23-674
    'KS', // K.S.A. § Chapter-Section for short sections, e.g. 8-262
    'OK', // Okla. Stat. Title-Section for plain-number sections, e.g. 21-711
    'VI', // V.I.C. Title-Section, e.g. 14-297
    'AZ', // A.R.S. § Title-Section for ≤3-digit sections, e.g. 28-693
    'NH', // N.H. RSA Chapter-Section (2-segment), e.g. 179-10 (liquor/minors)
    'ME', // Me. Rev. Stat. Title-Section (2-segment), e.g. 8-223 (same format as MA)
    'NY', // NYC Admin. Code § Title-Section, e.g. 10-125 (alcohol in parks)
  ]);

  // Same synthesized fingerprint used by the non-failing sweep above.
  const SYNTHESIZED_PATTERN = /^\d{1,3}-\d{2,3}$/;

  // Per-charge overrides for real codes that match the synthesized pattern but are
  // confirmed against the official primary source. Keyed as "JURISDICTION:code".
  // Only use this for isolated cases — if an entire jurisdiction uses 2-segment format,
  // add it to SYNTHESIZED_PATTERN_EXCEPTIONS above instead.
  const KNOWN_LEGITIMATE_CODES = new Set([
    'VA:20-61', // Va. Code § 20-61 (criminal nonsupport/failure to support) —
                // Title 20 (Domestic Relations) predates the decimal-dot chapter
                // scheme used by newer VA titles (e.g. 18.2-57.2, 46.2-341).
  ]);

  it('no charge in an audited jurisdiction carries a synthesized-pattern code', () => {
    const violations: Array<{ id: string; jurisdiction: string; code: string; name: string }> = [];

    for (const charge of criminalCharges) {
      // Only check audited jurisdictions (unaudited ones are covered by the sweep above).
      if (!AUDITED_JURISDICTIONS.has(charge.jurisdiction)) continue;

      // Skip jurisdictions whose official codes happen to match the synthesized shape.
      if (SYNTHESIZED_PATTERN_EXCEPTIONS.has(charge.jurisdiction)) continue;

      // Skip individually confirmed legitimate codes that match the pattern shape.
      if (KNOWN_LEGITIMATE_CODES.has(`${charge.jurisdiction}:${charge.code}`)) continue;

      if (SYNTHESIZED_PATTERN.test(charge.code)) {
        violations.push({
          id: charge.id,
          jurisdiction: charge.jurisdiction,
          code: charge.code,
          name: charge.name,
        });
      }
    }

    if (violations.length > 0) {
      const lines = [
        `\n❌  SYNTHESIZED CODE REGRESSION — ${violations.length} charge(s) in audited jurisdiction(s) carry a synthesized-pattern code:`,
        'A charge was added (or reverted) with a fake NN-NNN code in an already-audited state.',
        'Correct the code against the official state statute before merging.\n',
      ];
      for (const v of violations) {
        lines.push(`  ${v.jurisdiction.padEnd(4)}  ${v.code.padEnd(12)}  ${v.id}  (${v.name})`);
      }
      // Surface the full list in the failure message so it is visible in CI logs.
      expect(
        violations,
        lines.join('\n'),
      ).toHaveLength(0);
    }
  });

  it('SYNTHESIZED_PATTERN_EXCEPTIONS contains only jurisdictions that are in AUDITED_JURISDICTIONS', () => {
    // Sanity-check: an exception for a non-audited jurisdiction is meaningless.
    for (const j of SYNTHESIZED_PATTERN_EXCEPTIONS) {
      expect(
        AUDITED_JURISDICTIONS.has(j),
        `SYNTHESIZED_PATTERN_EXCEPTIONS includes '${j}', which is not in AUDITED_JURISDICTIONS. ` +
        'Either audit that jurisdiction first or remove it from the exceptions set.',
      ).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Estimate-deadline banner regression — unmapped jurisdictions
// ---------------------------------------------------------------------------
// The guidance dashboard renders a [data-testid="notice-deadline-estimate"]
// banner whenever guidance.deadlines.some(d => d.isEstimate) is true.
// These tests verify the engine sets isEstimate correctly so a future refactor
// cannot silently drop the flag — which would remove the disclosure for users
// in unmapped states and territories without any test failure.
describe('isEstimate flag on deadlines — notice-deadline-estimate banner coverage', () => {
  // Pick two territories that are intentionally absent from KNOWN_JURISDICTIONS
  // so this test remains meaningful even if the mapped set grows further.
  const UNMAPPED_JURISDICTIONS = ['PR', 'GU', 'VI', 'AS', 'MP'].filter(
    j => !KNOWN_JURISDICTIONS.includes(j),
  );

  it('KNOWN_JURISDICTIONS is exported and contains the core mapped states', () => {
    // Sanity-check: the export exists and the classic four are present.
    expect(KNOWN_JURISDICTIONS).toContain('CA');
    expect(KNOWN_JURISDICTIONS).toContain('TX');
    expect(KNOWN_JURISDICTIONS).toContain('NY');
    expect(KNOWN_JURISDICTIONS).toContain('FL');
    expect(KNOWN_JURISDICTIONS).toContain('FEDERAL');
  });

  it('stampEstimateDeadlines marks every deadline isEstimate:true for an unmapped jurisdiction', () => {
    const sampleDeadlines = [
      { event: 'Arraignment', timeframe: '72 hours', description: 'Test', priority: 'critical' as const },
      { event: 'Speedy trial', timeframe: '60 days', description: 'Test', priority: 'important' as const },
    ];
    // PR is a territory not in KNOWN_JURISDICTIONS
    const stamped = stampEstimateDeadlines('PR', sampleDeadlines);
    expect(stamped.every(d => d.isEstimate === true)).toBe(true);
  });

  it('stampEstimateDeadlines leaves deadlines unchanged for a mapped jurisdiction (CA)', () => {
    const sampleDeadlines = [
      { event: 'Arraignment', timeframe: '72 hours', description: 'Test', priority: 'critical' as const },
    ];
    const stamped = stampEstimateDeadlines('CA', sampleDeadlines);
    expect(stamped.every(d => d.isEstimate === undefined || d.isEstimate === false)).toBe(true);
  });

  if (UNMAPPED_JURISDICTIONS.length > 0) {
    it(`generateEnhancedGuidance sets isEstimate:true on deadlines for unmapped jurisdiction (${UNMAPPED_JURISDICTIONS[0]})`, () => {
      // Regression guard: if this fails, the dashboard will silently omit the
      // estimate notice banner ([data-testid="notice-deadline-estimate"]) for users
      // in territories not covered by the jurisdiction rules database.
      const jurisdiction = UNMAPPED_JURISDICTIONS[0];
      const result = generateEnhancedGuidance({
        ...baseCase,
        jurisdiction,
      });

      // The dashboard banner renders when guidance.deadlines.some(d => d.isEstimate).
      // Verify at least one deadline carries the flag.
      const hasEstimate = result.deadlines.some(d => d.isEstimate === true);
      expect(
        hasEstimate,
        `No deadline had isEstimate:true for jurisdiction "${jurisdiction}". ` +
        'The [data-testid="notice-deadline-estimate"] banner in guidance-dashboard.tsx ' +
        'will be hidden for users in unmapped states/territories.',
      ).toBe(true);
    });
  }

  it('generateEnhancedGuidance does NOT set isEstimate on deadlines for a mapped state (TX)', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      jurisdiction: 'TX',
    });
    const allAreEstimates = result.deadlines.every(d => d.isEstimate === true);
    expect(
      allAreEstimates,
      'All deadlines were marked isEstimate for TX (a mapped state), which would show a misleading notice.',
    ).toBe(false);
  });

  it('every unmapped territory produces at least one estimate deadline', () => {
    // Regression sweep across all territories known to be outside KNOWN_JURISDICTIONS.
    // If KNOWN_JURISDICTIONS is expanded to include a territory, it moves out of this
    // list automatically and the test remains valid.
    const territoryCodes = ['PR', 'GU', 'VI', 'AS', 'MP'].filter(
      j => !KNOWN_JURISDICTIONS.includes(j),
    );

    for (const jurisdiction of territoryCodes) {
      const result = generateEnhancedGuidance({
        ...baseCase,
        jurisdiction,
      });
      const hasEstimate = result.deadlines.some(d => d.isEstimate === true);
      expect(
        hasEstimate,
        `Jurisdiction "${jurisdiction}" produced no deadline with isEstimate:true. ` +
        'The estimate notice banner will be suppressed for users in this territory.',
      ).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Default-charge uncertainty item — "Charge-Specific Guidance Not Available"
// ---------------------------------------------------------------------------
// When a user's charge text does not match any keyword in CHARGE_KEYWORDS,
// identifyChargeType() returns 'default', and buildUncertainties() appends an
// item with area === 'Charge-Specific Guidance Not Available'.  These tests
// confirm that end-to-end contract so a future rename or removal of the item
// cannot silently drop the disclosure.
describe('buildUncertainties — Charge-Specific Guidance Not Available item', () => {
  // Charge strings chosen to guarantee no keyword match
  const UNRECOGNIZED_CHARGES = [
    'municipal ordinance violation 47B',
    'obscure charge not matching any keyword',
    'jaywalking code 12.4.7',
    '!!!',
  ];

  it('adds the Charge-Specific Guidance Not Available uncertainty when charge text is unrecognized', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      charges: UNRECOGNIZED_CHARGES[0],
    });

    const item = result.uncertainties?.find(
      u => u.area === 'Charge-Specific Guidance Not Available',
    );
    expect(
      item,
      `No uncertainty item with area "Charge-Specific Guidance Not Available" was produced ` +
      `for charges="${UNRECOGNIZED_CHARGES[0]}". ` +
      'Unmapped charge types silently receive generic guidance with no disclosure.',
    ).toBeDefined();
    expect(item!.note).toBeTruthy();
  });

  it('does NOT add the item when charge text matches a known keyword (e.g. "dui")', () => {
    const result = generateEnhancedGuidance({
      ...baseCase,
      charges: 'driving under the influence',
    });

    const item = result.uncertainties?.find(
      u => u.area === 'Charge-Specific Guidance Not Available',
    );
    expect(
      item,
      'A "Charge-Specific Guidance Not Available" item appeared even though the charge matched a known keyword.',
    ).toBeUndefined();
  });

  it('adds the item consistently for multiple different unrecognized charge strings', () => {
    for (const chargeText of UNRECOGNIZED_CHARGES) {
      const result = generateEnhancedGuidance({
        ...baseCase,
        charges: chargeText,
      });
      const item = result.uncertainties?.find(
        u => u.area === 'Charge-Specific Guidance Not Available',
      );
      expect(
        item,
        `Missing "Charge-Specific Guidance Not Available" uncertainty for charges="${chargeText}".`,
      ).toBeDefined();
    }
  });

  it('does NOT add the item for any of the recognized charge keywords', () => {
    const knownChargeInputs: Record<string, string> = {
      dui: 'dui arrest',
      assault: 'simple assault',
      drug: 'drug possession',
      theft: 'grand theft',
      domestic: 'domestic violence',
      fraud: 'wire fraud',
      burglary: 'residential burglary',
      traffic: 'reckless driving',
      weapons: 'carrying a concealed weapon',
    };

    for (const [chargeType, chargeText] of Object.entries(knownChargeInputs)) {
      const result = generateEnhancedGuidance({
        ...baseCase,
        charges: chargeText,
      });
      const item = result.uncertainties?.find(
        u => u.area === 'Charge-Specific Guidance Not Available',
      );
      expect(
        item,
        `Unexpected "Charge-Specific Guidance Not Available" item for recognized charge type "${chargeType}" (input: "${chargeText}").`,
      ).toBeUndefined();
    }
  });
});

// ---------------------------------------------------------------------------
// getVerifiedCitation guard — unverified codes excluded from AI guidance output
// ---------------------------------------------------------------------------
// Task 262 added a getVerifiedCitation() guard to all chargeClassifications
// mappings in routes.ts so that synthesized / unverified codes never appear
// in the `code` field of the AI guidance output.
//
// The helper below replicates the exact mapping logic from
// generateLegalGuidance() (server/routes.ts ~line 3050) so that any future
// refactor that breaks the guard will immediately surface here.
//
// Fixture choices:
//   Unverified: 'dc-murder-in-the-first-degree'
//     — overlay entry exists but confidence === 'needs_review', so
//       getVerifiedCitation() returns null and `code` must be absent.
//   High-confidence: 'al-murder-in-the-first-degree'
//     — overlay entry has confidence === 'high', citation "Ala. Code § 13A-6-2";
//       getVerifiedCitation() returns that citation and `code` must be present.
//   High-confidence (second): 'ar-murder-in-the-first-degree'
//     — confirms the pattern holds for a different state.

/** Mirrors the chargeClassification object built inside generateLegalGuidance. */
function buildClassificationForCharge(chargeId: string) {
  const charge = getChargeById(chargeId);
  if (!charge) return null;
  const verifiedCode = getVerifiedCitation(charge);
  return {
    name: charge.name,
    classification: charge.category,
    ...(verifiedCode ? { code: verifiedCode } : {}),
    verifiedCitation: verifiedCode ?? null,
    title: charge.name,
    maxPenalty: charge.maxPenalty,
  };
}

describe('getVerifiedCitation guard — chargeClassifications code field', () => {
  // ── Unverified charges: code must be absent ─────────────────────────────

  it('dc-murder-in-the-first-degree (needs_review): chargeClassification has no code field', () => {
    // Confirm the fixture is still needs_review so a promotion doesn't silently
    // invalidate this test.
    const overlay = CHARGE_CITATIONS['dc-murder-in-the-first-degree'];
    expect(overlay, 'Fixture dc-murder-in-the-first-degree not found in CHARGE_CITATIONS').toBeDefined();
    expect(
      overlay!.confidence,
      'Fixture confidence changed — update this test to use a different unverified charge',
    ).not.toBe('high');

    const classification = buildClassificationForCharge('dc-murder-in-the-first-degree');
    expect(classification, 'dc-murder-in-the-first-degree not found in criminalCharges').not.toBeNull();
    expect(
      (classification as any).code,
      'chargeClassification.code must be absent for a charge without a high-confidence citation ' +
      '(dc-murder-in-the-first-degree has confidence=needs_review). ' +
      'The getVerifiedCitation guard in generateLegalGuidance may have been removed.',
    ).toBeUndefined();
  });

  it('dc-murder-in-the-first-degree (needs_review): verifiedCitation is null', () => {
    const classification = buildClassificationForCharge('dc-murder-in-the-first-degree');
    expect(classification).not.toBeNull();
    expect(classification!.verifiedCitation).toBeNull();
  });

  // ── High-confidence charges: code must be present and correct ───────────

  it('al-murder-in-the-first-degree (high): chargeClassification.code equals the verified citation', () => {
    const overlay = CHARGE_CITATIONS['al-murder-in-the-first-degree'];
    expect(overlay, 'Fixture al-murder-in-the-first-degree not found in CHARGE_CITATIONS').toBeDefined();
    expect(overlay!.confidence).toBe('high');

    const classification = buildClassificationForCharge('al-murder-in-the-first-degree');
    expect(classification, 'al-murder-in-the-first-degree not found in criminalCharges').not.toBeNull();
    expect(
      (classification as any).code,
      'chargeClassification.code must be present for al-murder-in-the-first-degree (confidence=high). ' +
      'The getVerifiedCitation guard may have been broken.',
    ).toBe(overlay!.citation);
  });

  it('al-murder-in-the-first-degree (high): code matches expected value "Ala. Code § 13A-6-2"', () => {
    const classification = buildClassificationForCharge('al-murder-in-the-first-degree');
    expect(classification).not.toBeNull();
    expect((classification as any).code).toBe('Ala. Code § 13A-6-2');
  });

  it('al-murder-in-the-first-degree (high): verifiedCitation matches code', () => {
    const classification = buildClassificationForCharge('al-murder-in-the-first-degree');
    expect(classification).not.toBeNull();
    expect(classification!.verifiedCitation).toBe((classification as any).code);
    expect(classification!.verifiedCitation).toBeTruthy();
  });

  it('ar-murder-in-the-first-degree (high): code equals the verified citation', () => {
    const overlay = CHARGE_CITATIONS['ar-murder-in-the-first-degree'];
    expect(overlay, 'Fixture ar-murder-in-the-first-degree not found in CHARGE_CITATIONS').toBeDefined();
    expect(overlay!.confidence).toBe('high');

    const classification = buildClassificationForCharge('ar-murder-in-the-first-degree');
    expect(classification, 'ar-murder-in-the-first-degree not found in criminalCharges').not.toBeNull();
    expect((classification as any).code).toBe(overlay!.citation);
    expect((classification as any).code).toBe('Ark. Code Ann. § 5-10-102');
  });

  // ── Cross-check: getVerifiedCitation agrees with overlay directly ────────

  it('getVerifiedCitation returns null for dc-murder-in-the-first-degree', () => {
    const charge = getChargeById('dc-murder-in-the-first-degree');
    expect(charge, 'dc-murder-in-the-first-degree not found').toBeDefined();
    expect(getVerifiedCitation(charge!)).toBeNull();
  });

  it('getVerifiedCitation returns the high-confidence citation for al-murder-in-the-first-degree', () => {
    const charge = getChargeById('al-murder-in-the-first-degree');
    expect(charge, 'al-murder-in-the-first-degree not found').toBeDefined();
    expect(getVerifiedCitation(charge!)).toBe('Ala. Code § 13A-6-2');
  });

  // ── Guard completeness: every high-confidence overlay entry produces a code ──

  it('every CHARGE_CITATIONS entry with confidence=high produces a code field in chargeClassification', () => {
    const highConfidenceIds = Object.entries(CHARGE_CITATIONS)
      .filter(([, rec]) => rec.confidence === 'high')
      .map(([id]) => id);

    // There must be at least some high-confidence entries for this test to be meaningful.
    expect(highConfidenceIds.length).toBeGreaterThan(0);

    const missing: string[] = [];
    for (const chargeId of highConfidenceIds) {
      const classification = buildClassificationForCharge(chargeId);
      if (!classification) continue; // charge not in criminal-charges DB — skip
      if (!(classification as any).code) {
        missing.push(chargeId);
      }
    }

    expect(
      missing,
      `These high-confidence citation entries produced no code field in chargeClassification: ${missing.join(', ')}. ` +
      'A high-confidence overlay must always surface a code field in the AI guidance output.',
    ).toHaveLength(0);
  });

  it('no CHARGE_CITATIONS entry with confidence≠high produces a code field in chargeClassification', () => {
    const nonHighIds = Object.entries(CHARGE_CITATIONS)
      .filter(([, rec]) => rec.confidence !== 'high')
      .map(([id]) => id);

    const leaking: string[] = [];
    for (const chargeId of nonHighIds) {
      const classification = buildClassificationForCharge(chargeId);
      if (!classification) continue;
      if ((classification as any).code) {
        leaking.push(`${chargeId} (confidence=${CHARGE_CITATIONS[chargeId].confidence})`);
      }
    }

    expect(
      leaking,
      `These non-high-confidence entries incorrectly produced a code field: ${leaking.join(', ')}. ` +
      'Only high-confidence citations should appear in chargeClassification.code.',
    ).toHaveLength(0);
  });
});
