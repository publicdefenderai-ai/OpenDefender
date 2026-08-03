/**
 * qa-flow-guard.ts
 *
 * Pure, side-effect-free helpers that govern the case-stage warning guard in
 * QAFlow.  Keeping them here (separate from the React component) lets the test
 * suite import and exercise the real production logic without needing a DOM or
 * React Testing Library setup.
 *
 * IMPORTANT: These helpers are the single source of truth for the guard.
 * The component (qa-flow.tsx) imports and calls them; tests import and verify
 * them.  Any change here that breaks the guard will immediately break tests.
 */

/**
 * The position of the StatusStep within QAFlow's `baseSteps` array.
 * Used by `handleCaseStageWarningCancel` to navigate the user back to the
 * step where they can select a case stage.
 *
 * baseSteps order (must stay in sync with qa-flow.tsx):
 *   0 — ConsentStep
 *   1 — JurisdictionStep
 *   2 — CaseDetailsStep
 *   3 — StatusStep        ← this constant
 *   4 — BackgroundStep
 *   5 — AdditionalDetailsStep
 */
export const QA_FLOW_STATUS_STEP_INDEX = 3;

/**
 * Returns `true` when the case-stage warning guard should activate, i.e. the
 * user is trying to submit without having selected a case stage.
 *
 * @param caseStage - the current value of formData.caseStage
 */
export function shouldShowCaseStageWarning(caseStage: string | undefined): boolean {
  return !caseStage;
}
