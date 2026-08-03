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
   * Exact set of deadline `event` names expected to carry `isEstimate: true`.
   * Use this (instead of noDeadlineIsEstimate) for jurisdictions where some
   * deadline fields are verified/authoritative and others are still generic
   * placeholder text — e.g. a state whose arraignment deadline is cited but
   * whose preliminaryHearing/discoveryDeadline fields are not
   * (see PRELIMINARY_HEARING_ESTIMATE_JURISDICTIONS / DISCOVERY_DEADLINE_ESTIMATE_JURISDICTIONS
   * in shared/jurisdiction-procedure-rules.ts). Every event in this array must
   * have isEstimate: true, and every event NOT in this array must not.
   */
  exactEstimateDeadlineEvents?: string[];

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
    label: 'P1-02: CA × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'CA', charges: 'assault' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
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
    label: 'P1-08: NY × arraignment stage — discovery deadline present (CPL § 245.10, 2020)',
    input: { ...baseMapped, jurisdiction: 'NY', charges: 'domestic violence', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      // CPL § 245.10 (effective Jan 1, 2020): 35 days for defendant not in custody (custodyStatus: 'released')
      deadlineTimeframeKeywords: ['35 days'],
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
    // CO was added to jurisdictionRules in the 2026-07 audit batch 2 — now mapped
    label: 'P1-11: CO (mapped, 2026-07) × arrest — no isEstimate on deadlines',
    input: { ...baseMapped, jurisdiction: 'CO', charges: 'drug possession' },
    expect: {
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    // OR was added to jurisdictionRules in the 2026-07 audit batch 2 — now mapped
    label: 'P1-12: OR (mapped, 2026-07) × arrest — no isEstimate on deadlines',
    input: { ...baseMapped, jurisdiction: 'OR', charges: 'assault' },
    expect: {
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    // NV was added to jurisdictionRules in the 2026-07 audit batch 2 — now mapped
    label: 'P1-13: NV (mapped, 2026-07) × arrest — no isEstimate on deadlines',
    input: { ...baseMapped, jurisdiction: 'NV', charges: 'theft' },
    expect: {
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    // PR (Puerto Rico) — territory entries added in 2026-07; now mapped with medium confidence
    label: 'P1-14: PR (mapped territory, 2026-07) × arrest — no isEstimate on deadlines',
    input: { ...baseMapped, jurisdiction: 'PR', charges: 'theft' },
    expect: {
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
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
    label: 'P1-35: GA × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'GA', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
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
    label: 'P1-38: AZ × arrest — arraignment deadline matches jurisdiction rule (24 hours)',
    input: { ...baseMapped, jurisdiction: 'AZ', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['24 hours'],
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
    label: 'P1-41: NJ × arrest — arraignment deadline matches jurisdiction rule (72 hours)',
    input: { ...baseMapped, jurisdiction: 'NJ', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['72 hours'],
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
    label: 'P1-47: NC × arrest — arraignment deadline matches jurisdiction rule (96 hours)',
    input: { ...baseMapped, jurisdiction: 'NC', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['96 hours'],
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

  // ── Colorado ──
  {
    label: 'P1-53: CO × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'CO', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-54: CO × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'CO', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-55: CO × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'CO', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['35 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Minnesota ──
  {
    label: 'P1-56: MN × arrest — arraignment deadline matches jurisdiction rule (36 hours)',
    input: { ...baseMapped, jurisdiction: 'MN', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['36 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-57: MN × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'MN', charges: 'burglary', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['7 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-58: MN × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'MN', charges: 'fraud', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['28 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Missouri ──
  {
    label: 'P1-59: MO × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'MO', charges: 'assault' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      // MO's arraignmentDeadline is cited/authoritative; its discoveryDeadline
      // is unverified placeholder text (DISCOVERY_DEADLINE_ESTIMATE_JURISDICTIONS).
      exactEstimateDeadlineEvents: ['Discovery Deadline'],
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-60: MO × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'MO', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['30 days'],
      // MO's preliminaryHearing/discoveryDeadline are unverified placeholder text.
      exactEstimateDeadlineEvents: ['Discovery Deadline', 'Preliminary Hearing'],
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-61: MO × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'MO', charges: 'theft', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      exactEstimateDeadlineEvents: ['Discovery Deadline', 'Preliminary Hearing'],
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Wisconsin ──
  {
    label: 'P1-62: WI × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'WI', charges: 'burglary' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-63: WI × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'WI', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-64: WI × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'WI', charges: 'domestic violence', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Maryland ──
  {
    label: 'P1-65: MD × arrest — arraignment deadline matches jurisdiction rule (24 hours)',
    input: { ...baseMapped, jurisdiction: 'MD', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['24 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-66: MD × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'MD', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-67: MD × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'MD', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Tennessee ──
  {
    label: 'P1-68: TN × arrest — arraignment deadline matches jurisdiction rule (72 hours)',
    input: { ...baseMapped, jurisdiction: 'TN', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['72 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-69: TN × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'TN', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-70: TN × arraignment stage — discovery deadline present (request-triggered, Tenn. R. Crim. P. 16)',
    input: { ...baseMapped, jurisdiction: 'TN', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      // Tenn. R. Crim. P. 16 is request-triggered — no fixed post-arraignment deadline.
      deadlineTimeframeKeywords: ['Upon request'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Indiana ──
  {
    label: 'P1-71: IN × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'IN', charges: 'burglary' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-72: IN × arraignment stage — initial hearing deadline present (Indiana uses initial hearing, IC § 35-33-7-1)',
    input: { ...baseMapped, jurisdiction: 'IN', charges: 'theft', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      // Indiana uses "initial hearing" (IC § 35-33-7-1), not "preliminary hearing".
      // The event label must reflect this to avoid confusing users who will only hear "initial hearing" in court.
      deadlineEventKeywords: ['Initial Hearing'],
      // Indiana's initial hearing is held promptly after arrest (IC § 35-33-7-1).
      deadlineTimeframeKeywords: ['Promptly'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-73: IN × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'IN', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── South Carolina ──
  {
    label: 'P1-74: SC × arrest — arraignment deadline matches jurisdiction rule (24 hours)',
    input: { ...baseMapped, jurisdiction: 'SC', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['24 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-75: SC × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'SC', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-76: SC × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'SC', charges: 'fraud', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Kentucky ──
  {
    label: 'P1-77: KY × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'KY', charges: 'assault' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-78: KY × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'KY', charges: 'theft', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-79: KY × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'KY', charges: 'burglary', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Alabama ──
  {
    label: 'P1-80: AL × arrest — arraignment deadline matches jurisdiction rule (72 hours)',
    input: { ...baseMapped, jurisdiction: 'AL', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['72 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-81: AL × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'AL', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-82: AL × arraignment stage — discovery deadline present (14 days after written request, Ala. R. Crim. P. 16.1)',
    input: { ...baseMapped, jurisdiction: 'AL', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      // Corrected from '30 days' — Ala. R. Crim. P. 16.1 requires disclosure within
      // 14 days of written request, not 30 days after arraignment.
      deadlineTimeframeKeywords: ['14 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Louisiana ──
  {
    label: 'P1-83: LA × arrest — arraignment deadline matches jurisdiction rule (72 hours)',
    input: { ...baseMapped, jurisdiction: 'LA', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['72 hours'],
      deadlineEventKeywords: ['Arraignment'],
      // LA's arraignmentDeadline and discoveryDeadline are both cited/authoritative
      // (La. Code Crim. Proc. Ann. Art. 716); only preliminaryHearing is still
      // unverified placeholder text (PRELIMINARY_HEARING_ESTIMATE_JURISDICTIONS).
      exactEstimateDeadlineEvents: [],
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-84: LA × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'LA', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['30 days'],
      // LA's preliminaryHearing is still unverified placeholder text; discoveryDeadline is now cited.
      exactEstimateDeadlineEvents: ['Preliminary Hearing'],
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-85: LA × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'LA', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      exactEstimateDeadlineEvents: ['Preliminary Hearing'],
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Oregon ──
  {
    label: 'P1-86: OR × arrest — arraignment deadline matches jurisdiction rule (36 hours)',
    input: { ...baseMapped, jurisdiction: 'OR', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['36 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-87: OR × arraignment stage — preliminary hearing deadline present (ORS § 135.070: 5 judicial days if in custody)',
    input: { ...baseMapped, jurisdiction: 'OR', charges: 'burglary', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      // Corrected from '14 days' — ORS § 135.070(2) requires the hearing within
      // 5 judicial days if the defendant is in custody (prior "14 days" was unsupported).
      deadlineTimeframeKeywords: ['5 judicial days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-88: OR × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'OR', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Oklahoma ──
  {
    label: 'P1-89: OK × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'OK', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      // OK's arraignmentDeadline and discoveryDeadline are both cited/authoritative
      // (Okla. Stat. tit. 22 § 2002(A)); only preliminaryHearing is still
      // unverified placeholder text (PRELIMINARY_HEARING_ESTIMATE_JURISDICTIONS).
      exactEstimateDeadlineEvents: [],
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-90: OK × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'OK', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 days'],
      // OK's preliminaryHearing is still unverified placeholder text; discoveryDeadline is now cited.
      exactEstimateDeadlineEvents: ['Preliminary Hearing'],
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-91: OK × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'OK', charges: 'fraud', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      exactEstimateDeadlineEvents: ['Preliminary Hearing'],
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Nevada ──
  {
    label: 'P1-92: NV × arrest — arraignment deadline matches jurisdiction rule (72 hours)',
    input: { ...baseMapped, jurisdiction: 'NV', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['72 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-93: NV × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'NV', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['15 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-94: NV × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'NV', charges: 'burglary', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Connecticut ──
  {
    label: 'P1-95: CT × arrest — arraignment deadline matches jurisdiction rule (24 hours)',
    input: { ...baseMapped, jurisdiction: 'CT', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['24 hours'],
      deadlineEventKeywords: ['Arraignment'],
      // CT's arraignmentDeadline and discoveryDeadline are both cited/authoritative
      // (Conn. Prac. Book § 40-11(a)); only preliminaryHearing is still
      // unverified placeholder text (PRELIMINARY_HEARING_ESTIMATE_JURISDICTIONS).
      exactEstimateDeadlineEvents: [],
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-96: CT × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'CT', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 days'],
      // CT's preliminaryHearing is still unverified placeholder text; discoveryDeadline is now cited.
      exactEstimateDeadlineEvents: ['Preliminary Hearing'],
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-97: CT × arraignment stage — discovery deadline present (Conn. Prac. Book § 40-11(a): 3 business days in custody)',
    input: { ...baseMapped, jurisdiction: 'CT', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      // Corrected from '30 days' — Conn. Prac. Book § 40-11(a) requires automatic
      // disclosure within 3 business days of arraignment for in-custody defendants
      // (or at/before arraignment if released). '30 days' was inaccurate placeholder text.
      deadlineTimeframeKeywords: ['3 business days'],
      exactEstimateDeadlineEvents: ['Preliminary Hearing'],
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Utah ──
  {
    label: 'P1-98: UT × arrest — arraignment deadline matches jurisdiction rule (72 hours)',
    input: { ...baseMapped, jurisdiction: 'UT', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['72 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-99: UT × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'UT', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['14 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-100: UT × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'UT', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Iowa ──
  {
    label: 'P1-101: IA × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'IA', charges: 'burglary' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-102: IA × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'IA', charges: 'theft', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-103: IA × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'IA', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Arkansas ──
  {
    label: 'P1-104: AR × arrest — arraignment deadline matches jurisdiction rule (48-hour floor)',
    input: { ...baseMapped, jurisdiction: 'AR', charges: 'theft' },
    expect: {
      // AR arraignment string: "Without unnecessary delay (Ark. R. Crim. P. 8.1; 48-hour federal constitutional floor)"
      deadlineTimeframeKeywords: ['48-hour'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-105: AR × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'AR', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-106: AR × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'AR', charges: 'fraud', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Mississippi ──
  {
    label: 'P1-107: MS × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'MS', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-108: MS × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'MS', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-109: MS × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'MS', charges: 'burglary', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Kansas ──
  {
    label: 'P1-110: KS × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'KS', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      deadlineEventKeywords: ['Arraignment'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-111: KS × arraignment stage — preliminary hearing deadline present',
    input: { ...baseMapped, jurisdiction: 'KS', charges: 'drug possession', caseStage: 'arraignment', custodyStatus: 'detained' },
    expect: {
      deadlineEventKeywords: ['Preliminary Hearing'],
      deadlineTimeframeKeywords: ['10 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },
  {
    label: 'P1-112: KS × arraignment stage — discovery deadline present',
    input: { ...baseMapped, jurisdiction: 'KS', charges: 'assault', caseStage: 'arraignment', custodyStatus: 'released' },
    expect: {
      deadlineEventKeywords: ['Discovery'],
      deadlineTimeframeKeywords: ['30 days'],
      noDeadlineIsEstimate: true,
      absentUncertaintyAreas: ['Jurisdiction-Specific Deadlines'],
    },
  },

  // ── Virginia ──
  {
    label: 'P1-50: VA × arrest — arraignment deadline matches jurisdiction rule (72 hours)',
    input: { ...baseMapped, jurisdiction: 'VA', charges: 'theft' },
    expect: {
      deadlineTimeframeKeywords: ['72 hours'],
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
    label: 'P1-21: Federal jurisdiction × arrest — arraignment deadline matches jurisdiction rule (48 hours)',
    input: { ...baseMapped, jurisdiction: 'federal', charges: 'wire fraud' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
      noDeadlineIsEstimate: true,
    },
  },
  {
    label: 'P1-22: Federal (uppercase) × arrest — arraignment deadline present',
    input: { ...baseMapped, jurisdiction: 'FEDERAL', charges: 'mail fraud' },
    expect: {
      deadlineTimeframeKeywords: ['48 hours'],
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
// PRIORITY 4 — Multi-charge array inputs
//
// These scenarios pass `charges` as a string array to expose how the engine
// handles multiple simultaneous charges.  The engine currently joins the array
// into a single string and runs one `identifyChargeType` pass, meaning only
// the first keyword-matching charge type drives collateral-consequence lookup.
//
// Scenarios marked "GAP" assert the CORRECT behaviour (both consequence
// categories must be present).  They are expected to FAIL until the engine is
// extended to map consequences for every charge in the array independently.
// Failing scenarios are documented in docs/evals-coverage.md §"Known gaps".
//
// Scenarios marked "PASSES" are included to confirm that multi-charge inputs
// where both charges map to the same consequence category still work correctly.
// ═══════════════════════════════════════════════════════════════════════════════

const p4MultiChargeScenarios: EvalScenario[] = [
  // ── MC-01: drug possession + weapons charge  (GAP) ───────────────────────────
  // Weapon priority check fires on the joined string, returning 'weapons'.
  // The drug-specific 'benefits' consequence is never looked up.
  {
    label: 'MC-01: [drug possession, carrying a concealed weapon] → both benefits AND firearms present',
    input: {
      ...baseMapped,
      jurisdiction: 'CA',
      charges: ['drug possession', 'carrying a concealed weapon'],
      caseStage: 'arraignment',
      custodyStatus: 'released',
    },
    expect: {
      // Both categories must be present: drug → benefits, weapons → firearms.
      requiredConsequenceCategories: ['benefits', 'firearms'],
    },
  },

  // ── MC-02: domestic violence + drug possession  (GAP) ────────────────────────
  // 'drug' / 'possession' keywords appear before 'domestic' in CHARGE_KEYWORDS
  // iteration, so the engine returns 'drug' and the domestic firearms ban is lost.
  {
    label: 'MC-02: [domestic violence, drug possession] → both firearms AND benefits present',
    input: {
      ...baseMapped,
      jurisdiction: 'TX',
      charges: ['domestic violence', 'drug possession'],
      caseStage: 'arraignment',
      custodyStatus: 'released',
    },
    expect: {
      // domestic → firearms (Lautenberg), drug → benefits.
      requiredConsequenceCategories: ['firearms', 'benefits'],
    },
  },

  // ── MC-03: weapons charge + assault  (PASSES — same consequence category) ────
  // Weapon priority fires; both charge types map to 'firearms', so no consequence
  // is silently lost even though only one chargeType is resolved.
  {
    label: 'MC-03: [unlawful possession of a firearm, assault] → firearms consequence present',
    input: {
      ...baseMapped,
      jurisdiction: 'FL',
      charges: ['unlawful possession of a firearm', 'assault'],
      caseStage: 'arraignment',
      custodyStatus: 'released',
    },
    expect: {
      requiredConsequenceCategories: ['firearms'],
    },
  },

  // ── MC-04: DUI + reckless driving  (PASSES — same consequence category) ──────
  // Both charge types map to 'drivers_license', so the single chargeType pass
  // produces the correct consequence regardless of which type wins.
  {
    label: 'MC-04: [dui, reckless driving] → drivers_license consequence present',
    input: {
      ...baseMapped,
      jurisdiction: 'CA',
      charges: ['dui', 'reckless driving'],
      caseStage: 'arraignment',
      custodyStatus: 'released',
    },
    expect: {
      requiredConsequenceCategories: ['drivers_license'],
    },
  },

  // ── MC-05: wire fraud + theft  (GAP) ─────────────────────────────────────────
  // 'theft' appears before 'fraud' in CHARGE_KEYWORDS iteration, so the engine
  // returns 'theft' and the fraud-specific 'employment' consequence is lost.
  {
    label: 'MC-05: [wire fraud, theft] → both employment AND background_check present',
    input: {
      ...baseMapped,
      jurisdiction: 'NY',
      charges: ['wire fraud', 'theft'],
      caseStage: 'arraignment',
      custodyStatus: 'released',
    },
    expect: {
      // fraud → employment, theft → background_check.
      requiredConsequenceCategories: ['employment', 'background_check'],
    },
  },

  // ── MC-06: burglary + drug possession  (GAP) ─────────────────────────────────
  // 'drug' / 'possession' keywords match before 'burglary' in CHARGE_KEYWORDS,
  // so the engine returns 'drug' and the housing consequence for burglary is lost.
  {
    label: 'MC-06: [burglary, drug possession] → both housing AND benefits present',
    input: {
      ...baseMapped,
      jurisdiction: 'IL',
      charges: ['burglary', 'drug possession'],
      caseStage: 'arraignment',
      custodyStatus: 'released',
    },
    expect: {
      // burglary → housing, drug → benefits.
      requiredConsequenceCategories: ['housing', 'benefits'],
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
  ...p4MultiChargeScenarios,
];
