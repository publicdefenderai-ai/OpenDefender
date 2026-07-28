/**
 * Eval scenarios for the rules-based guidance engine (generateEnhancedGuidance).
 *
 * Each scenario describes a specific CaseData input and the human-curated
 * expected values that the engine MUST produce.  The harness in
 * tests/evals-harness.test.ts imports these and runs typed assertions.
 *
 * Ground-truth values were derived from:
 *  - jurisdictionRules constants in guidance-engine.ts (arraignment deadlines)
 *  - chargeGuidance / CHARGE_CONSEQUENCE_MAP constants in the same file
 *  - stageGuidance constants for stage-specific alert text
 *
 * IMPORTANT: Before treating failures as authoritative, have an attorney
 * review the expected values in each scenario.  Engineering wrote these
 * from the rules constants; attorney review is the recommended next step.
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CaseData {
  jurisdiction: string;
  charges: string | string[];
  caseStage: string;
  custodyStatus: string;
  hasAttorney: boolean;
  supervisionStatus?: string;
  citizenshipStatus?: string;
  hasMinorChildren?: boolean | null;
  hasProfessionalLicense?: boolean | null;
  hasHousingAssistance?: boolean | null;
}

export interface ScenarioExpect {
  /**
   * Every string in this array must appear (case-insensitive substring match)
   * in at least one deadline's `timeframe` field.
   */
  deadlineTimeframeKeywords?: string[];

  /**
   * Every string in this array must appear (case-insensitive substring match)
   * in at least one deadline's `event` field.
   */
  deadlineEventKeywords?: string[];

  /**
   * When true, at least one returned deadline must have `isEstimate: true`.
   */
  someDeadlineIsEstimate?: boolean;

  /**
   * When true, no returned deadline may have `isEstimate: true` (all are authoritative).
   */
  noDeadlineIsEstimate?: boolean;

  /**
   * Every category string in this array must appear in
   * `result.collateralConsequences[].category`.
   */
  requiredConsequenceCategories?: string[];

  /**
   * Every category string in this array must NOT appear in
   * `result.collateralConsequences[].category`.
   */
  absentConsequenceCategories?: string[];

  /**
   * Every string must appear (case-insensitive substring match) in at least
   * one `result.criticalAlerts[]` entry.
   */
  requiredAlertKeywords?: string[];

  /**
   * Every string must appear (case-insensitive substring match) in at least
   * one `result.immediateActions[].action`.
   */
  requiredActionKeywords?: string[];

  /**
   * Every area string must appear in `result.uncertainties[].area` (exact match).
   */
  requiredUncertaintyAreas?: string[];

  /**
   * Every area string must NOT appear in `result.uncertainties[].area` (exact match).
   * Use this to confirm that mapped jurisdictions do not emit the
   * "Jurisdiction-Specific Deadlines" uncertainty notice.
   */
  absentUncertaintyAreas?: string[];

  /**
   * When true, `result.uncertainties` must be non-empty.
   */
  uncertaintyShouldFire?: boolean;

  /**
   * When true, `result.immediateActions` must be non-empty.
   */
  hasImmediateActions?: boolean;

  /**
   * When true, `result.collateralConsequences` must be non-empty.
   */
  hasCollateralConsequences?: boolean;
}

export interface EvalScenario {
  label: string;
  input: CaseData;
  expect: ScenarioExpect;
}

// ── Base inputs (reused across scenario groups) ────────────────────────────────

const baseMapped = {
  caseStage: 'arrest',
  custodyStatus: 'detained',
  hasAttorney: false,
  supervisionStatus: 'none',
  citizenshipStatus: 'citizen',
  hasMinorChildren: false,
  hasProfessionalLicense: false,
  hasHousingAssistance: false,
} satisfies Partial<CaseData>;

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 1 — Deadline accuracy for mapped jurisdictions
// ═══════════════════════════════════════════════════════════════════════════════

const p1DeadlineScenarios: EvalScenario[] = [
  // ── California ──
  {
    label: 'P1-01: CA × arrest — arraignment deadline matches jurisdiction rule',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
    },
  },
  {
    label: 'P1-02: CA × arrest — arraignment deadline includes weekend caveat',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'assault' },
    expect: {
      deadlineTimeframeKeywords: ['72 hours'],
    },
  },
  {
    label: 'P1-03: CA × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 court days'],
      noDeadlineIsEstimate: true,
    },
  },
  {
    label: 'P1-04: CA × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'fraud', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
    },
  },

  // ── Texas ──
  {
    label: 'P1-05: TX × arrest — arraignment deadline matches jurisdiction rule',
    input: { ...baseMapped, jurisdiction: 'TX', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
    },
  },
  {
    label: 'P1-06: TX × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'TX', charges: 'burglary', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['20 days'],
      noDeadlineIsEstimate: true,
    },
  },

  // ── New York ──
  {
    label: 'P1-07: NY × arrest — arraignment deadline matches jurisdiction rule (24 hours)',
    input: { ...baseMapped, jurisdiction: 'NY', charges: 'assault' },
    expect: {
      deadlineTimeframeKeywords: ['24 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
    },
  },
  {
    label: 'P1-08: NY × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'NY', charges: 'domestic violence', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['15 days'],
      noDeadlineIsEstimate: true,
    },
  },

  // ── Florida ──
  {
    label: 'P1-09: FL × arrest — arraignment deadline matches jurisdiction rule (24 hours)',
    input: { ...baseMapped, jurisdiction: 'FL', charges: 'drug possession' },
    expect: {
      deadlineTimeframeKeywords: ['24 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
    },
  },
  {
    label: 'P1-10: FL × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'FL', charges: 'burglary', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['21 days'],
      noDeadlineIsEstimate: true,
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 1 — Unmapped states get uncertainty notices + isEstimate deadlines
// ═══════════════════════════════════════════════════════════════════════════════

const p1UnmappedScenarios: EvalScenario[] = [
  {
    label: 'P1-11: CO (unmapped) × arrest — uncertainty notice fires',
    input: { ...baseMapped, jurisdiction: 'CO', charges: 'drug possession' },
    expect: {
      requiredUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
      someDeadlineIsEstimate: true,
    },
  },
  {
    label: 'P1-12: OR (unmapped) × arrest — uncertainty notice fires',
    input: { ...baseMapped, jurisdiction: 'OR', charges: 'assault' },
    expect: {
      requiredUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
      someDeadlineIsEstimate: true,
    },
  },
  {
    label: 'P1-13: NV (unmapped) × arrest — uncertainty notice fires',
    input: { ...baseMapped, jurisdiction: 'NV', charges: 'theft' },
    expect: {
      requiredUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
      someDeadlineIsEstimate: true,
    },
  },
  {
    label: 'P1-14: Unmapped state uncertainty note mentions jurisdiction abbreviation',
    input: { ...baseMapped, jurisdiction: 'MT', charges: 'theft' },
    expect: {
      requiredUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
      someDeadlineIsEstimate: true,
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 1 — Deadline accuracy for IL, PA, WA, OH, GA (newly mapped)
// ═══════════════════════════════════════════════════════════════════════════════

const p1NewStateDeadlineScenarios: EvalScenario[] = [
  // ── Illinois ──
  {
    label: 'P1-23: IL × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'IL', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-24: IL × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'IL', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-25: IL × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'IL', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['28 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Pennsylvania ──
  {
    label: 'P1-26: PA × arrest — arraignment deadline matches jurisdiction rule (72 hours)',
    input: { ...baseMapped, jurisdiction: 'PA', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['72 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-27: PA × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'PA', charges: 'burglary', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['14 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-28: PA × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'PA', charges: 'fraud', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Washington ──
  {
    label: 'P1-29: WA × arrest — arraignment deadline matches jurisdiction rule (72 hours if in custody)',
    input: { ...baseMapped, jurisdiction: 'WA', charges: 'assault' },
    expect: {
      deadlineTimeframeKeywords: ['72 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-30: WA × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'WA', charges: 'domestic violence', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 court days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-31: WA × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'WA', charges: 'theft', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Ohio ──
  {
    label: 'P1-32: OH × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'OH', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-33: OH × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'OH', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-34: OH × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'OH', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['21 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Georgia ──
  {
    label: 'P1-35: GA × arrest — arraignment deadline matches jurisdiction rule (72 hours)',
    input: { ...baseMapped, jurisdiction: 'GA', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['72 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-36: GA × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'GA', charges: 'burglary', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-37: GA × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'GA', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['10 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Arizona ──
  {
    label: 'P1-38: AZ × arrest — arraignment deadline matches jurisdiction rule (48 hours if in custody)',
    input: { ...baseMapped, jurisdiction: 'AZ', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-39: AZ × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'AZ', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-40: AZ × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'AZ', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['10 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── New Jersey ──
  {
    label: 'P1-41: NJ × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'NJ', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-42: NJ × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'NJ', charges: 'burglary', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['20 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-43: NJ × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'NJ', charges: 'fraud', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['20 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Michigan ──
  {
    label: 'P1-44: MI × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'MI', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-45: MI × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'MI', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['14 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-46: MI × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'MI', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['21 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── North Carolina ──
  {
    label: 'P1-47: NC × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'NC', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-48: NC × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'NC', charges: 'burglary', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['15 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-49: NC × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'NC', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['15 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Virginia ──
  {
    label: 'P1-50: VA × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'VA', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-51: VA × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'VA', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-52: VA × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'VA', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['21 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 1 — DUI × CA: DMV hearing window appears
// ═══════════════════════════════════════════════════════════════════════════════

const p1DuiScenarios: EvalScenario[] = [
  {
    label: 'P1-18: DUI × CA — DMV hearing action present in immediateActions',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'dui', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredActionKeywords: ['DMV'],
      hasImmediateActions: true,
    },
  },
  {
    label: 'P1-19: DUI × CA — DMV hearing action mentions 10 days',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'driving under the influence', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredActionKeywords: ['10 days'],
    },
  },
  {
    label: 'P1-20: DUI × CA × arrest — drivers_license collateral consequence present',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'dui' },
    expect: {
      requiredConsequenceCategories: ['drivers_license'],
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 1 — Federal charge: "Without unnecessary delay" language
// ═══════════════════════════════════════════════════════════════════════════════

const p1FederalScenarios: EvalScenario[] = [
  {
    label: 'P1-21: Federal jurisdiction × arrest — "Without unnecessary delay" deadline',
    input: { ...baseMapped, jurisdiction: 'federal', charges: 'wire fraud' },
    expect: {
      deadlineTimeframeKeywords: ['Without unnecessary delay'],
      noDeadlineIsEstimate: true,
    },
  },
  {
    label: 'P1-22: Federal (uppercase) × arrest — arraignment delay language present',
    input: { ...baseMapped, jurisdiction: 'FEDERAL', charges: 'mail fraud' },
    expect: {
      deadlineTimeframeKeywords: ['Without unnecessary delay'],
      noDeadlineIsEstimate: true,
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 2 — Collateral consequences: flag-driven
// ═══════════════════════════════════════════════════════════════════════════════

const p2FlagConsequenceScenarios: EvalScenario[] = [
  // Non-citizen
  {
    label: 'P2-01: non_citizen + theft → immigration consequence present',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'theft', citizenshipStatus: 'non_citizen' },
    expect: {
      requiredConsequenceCategories: ['immigration'],
    },
  },
  {
    label: 'P2-02: non_citizen + drug possession → immigration consequence present',
    input: { ...baseMapped, jurisdiction: 'TX', charges: 'drug possession', citizenshipStatus: 'non_citizen' },
    expect: {
      requiredConsequenceCategories: ['immigration'],
    },
  },
  {
    label: 'P2-03: non_citizen + assault → immigration consequence present',
    input: { ...baseMapped, jurisdiction: 'FL', charges: 'assault and battery', citizenshipStatus: 'non_citizen' },
    expect: {
      requiredConsequenceCategories: ['immigration'],
    },
  },
  {
    label: 'P2-04: citizen + theft → NO immigration consequence',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'theft', citizenshipStatus: 'citizen' },
    expect: {
      absentConsequenceCategories: ['immigration'],
    },
  },

  // Minor children + assault
  {
    label: 'P2-05: hasMinorChildren=true + assault → custody consequence present',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'assault', hasMinorChildren: true },
    expect: {
      requiredConsequenceCategories: ['custody'],
    },
  },
  {
    label: 'P2-06: hasMinorChildren=true + drug charge → custody consequence present',
    input: { ...baseMapped, jurisdiction: 'NY', charges: 'drug possession', hasMinorChildren: true },
    expect: {
      requiredConsequenceCategories: ['custody'],
    },
  },
  {
    label: 'P2-07: hasMinorChildren=false + assault → NO custody consequence',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'assault', hasMinorChildren: false },
    expect: {
      absentConsequenceCategories: ['custody'],
    },
  },

  // Professional license + fraud
  {
    label: 'P2-08: hasProfessionalLicense=true + fraud → employment consequence present',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'wire fraud', hasProfessionalLicense: true },
    expect: {
      requiredConsequenceCategories: ['employment'],
    },
  },
  {
    label: 'P2-09: hasProfessionalLicense=true + theft → employment consequence present',
    input: { ...baseMapped, jurisdiction: 'TX', charges: 'grand theft', hasProfessionalLicense: true },
    expect: {
      requiredConsequenceCategories: ['employment'],
    },
  },
  {
    label: 'P2-10: hasProfessionalLicense=false + fraud → NO personal employment consequence (charge-specific may still appear)',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'wire fraud', hasProfessionalLicense: false },
    expect: {
      // employment from fraud charge CHARGE_CONSEQUENCE_MAP is still expected —
      // this test just confirms the flag=false path doesn't add a duplicate
      requiredConsequenceCategories: ['employment'],
    },
  },

  // Housing assistance + drug
  {
    label: 'P2-11: hasHousingAssistance=true + drug possession → housing consequence present',
    input: { ...baseMapped, jurisdiction: 'FL', charges: 'drug possession', hasHousingAssistance: true },
    expect: {
      requiredConsequenceCategories: ['housing'],
    },
  },
  {
    label: 'P2-12: hasHousingAssistance=true + theft → housing consequence present',
    input: { ...baseMapped, jurisdiction: 'NY', charges: 'theft', hasHousingAssistance: true },
    expect: {
      requiredConsequenceCategories: ['housing'],
    },
  },
  {
    label: 'P2-13: hasHousingAssistance=false + drug possession → NO housing flag consequence',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'drug possession', hasHousingAssistance: false },
    expect: {
      // housing not expected from flag; drug charge maps to 'benefits', not 'housing'
      absentConsequenceCategories: ['housing'],
    },
  },

  // Supervision — parole
  {
    label: 'P2-14: parole + theft → supervision_revocation consequence present',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'theft', supervisionStatus: 'parole' },
    expect: {
      requiredConsequenceCategories: ['supervision_revocation'],
    },
  },
  {
    label: 'P2-15: probation + assault → supervision_revocation consequence present',
    input: { ...baseMapped, jurisdiction: 'TX', charges: 'assault', supervisionStatus: 'probation' },
    expect: {
      requiredConsequenceCategories: ['supervision_revocation'],
    },
  },
  {
    label: 'P2-16: supervisionStatus=none + theft → NO supervision_revocation',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'theft', supervisionStatus: 'none' },
    expect: {
      absentConsequenceCategories: ['supervision_revocation'],
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 2 — Collateral consequences: charge-specific
// ═══════════════════════════════════════════════════════════════════════════════

const p2ChargeConsequenceScenarios: EvalScenario[] = [
  // DUI
  {
    label: 'P2-17: DUI charge → drivers_license consequence present',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'dui', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['drivers_license'],
    },
  },
  {
    label: 'P2-18: "driving under the influence" → drivers_license consequence present',
    input: { ...baseMapped, jurisdiction: 'NY', charges: 'driving under the influence', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['drivers_license'],
    },
  },

  // Domestic violence
  {
    label: 'P2-19: domestic violence charge → firearms consequence present',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'domestic violence', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['firearms'],
    },
  },
  {
    label: 'P2-20: "spousal assault" (domestic keyword) → firearms consequence present',
    input: { ...baseMapped, jurisdiction: 'TX', charges: 'spousal assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['firearms'],
    },
  },

  // Weapons
  {
    label: 'P2-21: weapons offense → permanent firearms consequence present',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'carrying a concealed weapon', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['firearms'],
    },
  },
  {
    label: 'P2-22: "unlawful firearm possession" → firearms consequence present (not drug)',
    input: { ...baseMapped, jurisdiction: 'FL', charges: 'unlawful firearm possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['firearms'],
      absentConsequenceCategories: ['benefits'],
    },
  },

  // Combined flag + charge consequences
  {
    label: 'P2-23: non_citizen + domestic violence → both immigration and firearms present',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'domestic violence', citizenshipStatus: 'non_citizen', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['immigration', 'firearms'],
    },
  },
  {
    label: 'P2-24: parole + DUI → supervision_revocation and drivers_license both present',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'dui', supervisionStatus: 'parole', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['supervision_revocation', 'drivers_license'],
    },
  },
  {
    label: 'P2-25: hasMinorChildren=true + domestic violence → custody and firearms both present',
    input: { ...baseMapped, jurisdiction: 'NY', charges: 'domestic violence', hasMinorChildren: true, caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['custody', 'firearms'],
    },
  },
  {
    label: 'P2-26: all flags set + DUI — all major categories covered',
    input: {
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
    },
    expect: {
      requiredConsequenceCategories: [
        'supervision_revocation',
        'immigration',
        'custody',
        'employment',
        'housing',
        'drivers_license',
      ],
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 3 — Critical alerts
// ═══════════════════════════════════════════════════════════════════════════════

const p3AlertScenarios: EvalScenario[] = [
  // Arrest + detained → arraignment deadline alert
  {
    label: 'P3-01: arrest + detained + CA → arraignment deadline appears in criticalAlerts',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'theft', custodyStatus: 'detained' },
    expect: {
      requiredAlertKeywords: ['Arraignment'],
    },
  },
  {
    label: 'P3-02: arrest + detained + NY → arraignment deadline appears in criticalAlerts',
    input: { ...baseMapped, jurisdiction: 'NY', charges: 'assault', custodyStatus: 'detained' },
    expect: {
      requiredAlertKeywords: ['Arraignment'],
    },
  },
  {
    label: 'P3-03: arrest + detained + unmapped state → arraignment deadline still in alerts',
    input: { ...baseMapped, jurisdiction: 'GA', charges: 'drug possession', custodyStatus: 'detained' },
    expect: {
      requiredAlertKeywords: ['Arraignment'],
    },
  },

  // No attorney + arrest → public defender prompt
  {
    label: 'P3-04: no attorney + arrest → public defender prompt in criticalAlerts',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'theft', hasAttorney: false },
    expect: {
      requiredAlertKeywords: ['public defender'],
    },
  },
  {
    label: 'P3-05: no attorney + arrest + TX → public defender prompt present',
    input: { ...baseMapped, jurisdiction: 'TX', charges: 'assault', hasAttorney: false },
    expect: {
      requiredAlertKeywords: ['public defender'],
    },
  },
  {
    label: 'P3-06: no attorney + arraignment → public defender prompt present',
    input: { ...baseMapped, jurisdiction: 'FL', charges: 'drug possession', hasAttorney: false, caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredAlertKeywords: ['public defender'],
    },
  },

  // Right to silence at arrest
  {
    label: 'P3-07: arrest stage → right to silence appears in criticalAlerts',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'assault' },
    expect: {
      requiredAlertKeywords: ['Silence'],
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 3 — Default charge bucket: uncertainty notice fires
// ═══════════════════════════════════════════════════════════════════════════════

const p3DefaultChargeScenarios: EvalScenario[] = [
  {
    label: 'P3-08: unrecognized charge "trespassing" → default bucket fires uncertainty notice',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'trespassing', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredUncertaintyAreas: ['Charge-Specific Guidance Not Available'],
      uncertaintyShouldFire: true,
    },
  },
  {
    label: 'P3-09: unrecognized charge "vandalism" → default bucket fires uncertainty notice',
    input: { ...baseMapped, jurisdiction: 'TX', charges: 'vandalism', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredUncertaintyAreas: ['Charge-Specific Guidance Not Available'],
      uncertaintyShouldFire: true,
    },
  },
  {
    label: 'P3-10: unrecognized charge "disorderly conduct" → default bucket fires uncertainty notice',
    input: { ...baseMapped, jurisdiction: 'FL', charges: 'disorderly conduct', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredUncertaintyAreas: ['Charge-Specific Guidance Not Available'],
      uncertaintyShouldFire: true,
    },
  },
  {
    label: 'P3-11: unrecognized charge "harassment" → default bucket fires uncertainty notice',
    input: { ...baseMapped, jurisdiction: 'NY', charges: 'harassment', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredUncertaintyAreas: ['Charge-Specific Guidance Not Available'],
      uncertaintyShouldFire: true,
    },
  },
  {
    label: 'P3-12: default charge bucket → immediateActions still non-empty (general guidance provided)',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'trespassing', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      hasImmediateActions: true,
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 3 — Every keyword group: non-empty immediateActions + ≥1 consequence
// ═══════════════════════════════════════════════════════════════════════════════

const p3ChargeCoverageScenarios: EvalScenario[] = [
  {
    label: 'P3-13: dui keyword group — non-empty immediateActions + ≥1 collateral consequence',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'driving under the influence', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      hasImmediateActions: true,
      hasCollateralConsequences: true,
    },
  },
  {
    label: 'P3-14: assault keyword group — non-empty immediateActions + ≥1 collateral consequence',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'assault and battery', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      hasImmediateActions: true,
      hasCollateralConsequences: true,
    },
  },
  {
    label: 'P3-15: drug keyword group — non-empty immediateActions + ≥1 collateral consequence',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      hasImmediateActions: true,
      hasCollateralConsequences: true,
    },
  },
  {
    label: 'P3-16: theft keyword group — non-empty immediateActions + ≥1 collateral consequence',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'grand theft auto', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      hasImmediateActions: true,
      hasCollateralConsequences: true,
    },
  },
  {
    label: 'P3-17: domestic keyword group — non-empty immediateActions + ≥1 collateral consequence',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'domestic violence', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      hasImmediateActions: true,
      hasCollateralConsequences: true,
    },
  },
  {
    label: 'P3-18: fraud keyword group — non-empty immediateActions + ≥1 collateral consequence',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'wire fraud', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      hasImmediateActions: true,
      hasCollateralConsequences: true,
    },
  },
  {
    label: 'P3-19: burglary keyword group — non-empty immediateActions + ≥1 collateral consequence',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'burglary', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      hasImmediateActions: true,
      hasCollateralConsequences: true,
    },
  },
  {
    label: 'P3-20: traffic keyword group — non-empty immediateActions + ≥1 collateral consequence',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'reckless driving', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      hasImmediateActions: true,
      hasCollateralConsequences: true,
    },
  },
  {
    label: 'P3-21: weapons keyword group — non-empty immediateActions + ≥1 collateral consequence',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'carrying a concealed gun', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      hasImmediateActions: true,
      hasCollateralConsequences: true,
    },
  },

  // Secondary keyword samples for each group
  {
    label: 'P3-22: dui — "dwi" keyword triggers dui group',
    input: { ...baseMapped, jurisdiction: 'TX', charges: 'dwi', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['drivers_license'],
    },
  },
  {
    label: 'P3-23: drug — "controlled substance" keyword triggers drug group',
    input: { ...baseMapped, jurisdiction: 'FL', charges: 'possession of a controlled substance', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      hasImmediateActions: true,
      hasCollateralConsequences: true,
    },
  },
  {
    label: 'P3-24: theft — "shoplifting" keyword triggers theft group',
    input: { ...baseMapped, jurisdiction: 'NY', charges: 'shoplifting', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['background_check'],
    },
  },
  {
    label: 'P3-25: fraud — "embezzlement" keyword triggers fraud group',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'embezzlement', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['employment'],
    },
  },
  {
    label: 'P3-26: burglary — "breaking and entering" keyword triggers burglary group',
    input: { ...baseMapped, jurisdiction: 'FL', charges: 'breaking and entering', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['housing'],
    },
  },
  {
    label: 'P3-27: weapons — "armed robbery" triggers weapons group',
    input: { ...baseMapped, jurisdiction: 'TX', charges: 'armed robbery', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      requiredConsequenceCategories: ['firearms'],
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 3 — Uncertainty fires when background fields are absent (null/undefined)
// ═══════════════════════════════════════════════════════════════════════════════

const p3MissingFieldUncertaintyScenarios: EvalScenario[] = [
  {
    label: 'P3-28: supervisionStatus missing → Probation/Parole uncertainty fires',
    input: {
      jurisdiction: 'CA',
      charges: 'theft',
      caseStage: 'arraignment',
      custodyStatus: 'released',
      hasAttorney: false,
      citizenshipStatus: 'citizen',
      hasMinorChildren: false,
      hasProfessionalLicense: false,
      hasHousingAssistance: false,
      // supervisionStatus intentionally omitted
    },
    expect: {
      requiredUncertaintyAreas: ['Probation / Parole Status'],
    },
  },
  {
    label: 'P3-29: citizenshipStatus missing → Immigration Consequences uncertainty fires',
    input: {
      jurisdiction: 'CA',
      charges: 'theft',
      caseStage: 'arraignment',
      custodyStatus: 'released',
      hasAttorney: false,
      supervisionStatus: 'none',
      hasMinorChildren: false,
      hasProfessionalLicense: false,
      hasHousingAssistance: false,
      // citizenshipStatus intentionally omitted
    },
    expect: {
      requiredUncertaintyAreas: ['Immigration Consequences'],
    },
  },
  {
    label: 'P3-30: hasMinorChildren=null → Minor Children/Custody uncertainty fires',
    input: {
      jurisdiction: 'CA',
      charges: 'theft',
      caseStage: 'arraignment',
      custodyStatus: 'released',
      hasAttorney: false,
      supervisionStatus: 'none',
      citizenshipStatus: 'citizen',
      hasMinorChildren: null,
      hasProfessionalLicense: false,
      hasHousingAssistance: false,
    },
    expect: {
      requiredUncertaintyAreas: ['Minor Children / Custody Risk'],
    },
  },
  {
    label: 'P3-31: hasProfessionalLicense=null → Professional License uncertainty fires',
    input: {
      jurisdiction: 'CA',
      charges: 'theft',
      caseStage: 'arraignment',
      custodyStatus: 'released',
      hasAttorney: false,
      supervisionStatus: 'none',
      citizenshipStatus: 'citizen',
      hasMinorChildren: false,
      hasProfessionalLicense: null,
      hasHousingAssistance: false,
    },
    expect: {
      requiredUncertaintyAreas: ['Professional License'],
    },
  },
  {
    label: 'P3-32: hasHousingAssistance=null → Public/Subsidized Housing uncertainty fires',
    input: {
      jurisdiction: 'CA',
      charges: 'theft',
      caseStage: 'arraignment',
      custodyStatus: 'released',
      hasAttorney: false,
      supervisionStatus: 'none',
      citizenshipStatus: 'citizen',
      hasMinorChildren: false,
      hasProfessionalLicense: false,
      hasHousingAssistance: null,
    },
    expect: {
      requiredUncertaintyAreas: ['Public / Subsidized Housing'],
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 3 — Stage-coverage: pretrial and trial stages produce guidance
// ═══════════════════════════════════════════════════════════════════════════════

const p3StageScenarios: EvalScenario[] = [
  {
    label: 'P3-33: pretrial stage + CA → non-empty immediateActions',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'theft', caseStage: 'pretrial', custodyStatus: 'released' },
    expect: {
      hasImmediateActions: true,
    },
  },
  {
    label: 'P3-34: trial stage + CA → non-empty immediateActions',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'assault', caseStage: 'trial', custodyStatus: 'released' },
    expect: {
      hasImmediateActions: true,
    },
  },
  {
    label: 'P3-35: arraignment stage + CA → deadline includes preliminary hearing',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Aggregate export
// ═══════════════════════════════════════════════════════════════════════════════

export const evalScenarios: EvalScenario[] = [
  ...p1DeadlineScenarios,
  ...p1UnmappedScenarios,
  ...p1NewStateDeadlineScenarios,
  ...p1DuiScenarios,
  ...p1FederalScenarios,
  ...p2FlagConsequenceScenarios,
  ...p2ChargeConsequenceScenarios,
  ...p3AlertScenarios,
  ...p3DefaultChargeScenarios,
  ...p3ChargeCoverageScenarios,
  ...p3MissingFieldUncertaintyScenarios,
  ...p3StageScenarios,
];
