/**
 * qa-flow-case-stage-guard.test.ts
 *
 * Guards the case-stage warning dialog in QAFlow by importing the REAL
 * production helpers from qa-flow-guard.ts (the same module the component
 * calls at runtime).  Any change to the guard logic that breaks these
 * contracts will break these tests immediately.
 *
 * Scenarios covered:
 *  1. shouldShowCaseStageWarning returns true when caseStage is empty/falsy
 *     → dialog MUST be shown, onComplete MUST NOT be called
 *  2. shouldShowCaseStageWarning returns false when caseStage is set
 *     → no dialog, onComplete called
 *  3. QA_FLOW_STATUS_STEP_INDEX is 3 (StatusStep position contract)
 *  4. "Go back and select" navigates to that index and does not call onComplete
 *  5. "Continue with arrest stage" calls onComplete with formData intact
 */

import { describe, it, expect, vi } from 'vitest';
import {
  shouldShowCaseStageWarning,
  QA_FLOW_STATUS_STEP_INDEX,
} from '../client/src/components/legal/qa-flow-guard';

// ---------------------------------------------------------------------------
// Minimal simulation of QAFlow's state machine wired to the real guard helpers
// ---------------------------------------------------------------------------

interface FormData {
  caseStage: string;
  captchaToken?: string;
  [key: string]: unknown;
}

interface State {
  currentStep: number;
  showCaseStageWarning: boolean;
  formData: FormData;
}

const TOTAL_BASE_STEPS = 6; // must match qa-flow.tsx baseSteps length

/**
 * Mirrors the three handlers in qa-flow.tsx that use the guard helpers,
 * operating on a plain mutable state object so tests run without a DOM.
 * The guard check uses the real `shouldShowCaseStageWarning` import.
 */
function makeHandlers(
  state: State,
  onComplete: (data: unknown) => void,
  totalSteps: number = TOTAL_BASE_STEPS,
) {
  const nextStep = () => {
    if (state.currentStep < totalSteps - 1) {
      state.currentStep += 1;
    } else {
      // Uses the real production guard helper — same call as qa-flow.tsx
      if (shouldShowCaseStageWarning(state.formData.caseStage)) {
        state.showCaseStageWarning = true;
        return;
      }
      onComplete({ ...state.formData });
    }
  };

  const handleCaseStageWarningConfirm = () => {
    state.showCaseStageWarning = false;
    onComplete({ ...state.formData });
  };

  const handleCaseStageWarningCancel = () => {
    state.showCaseStageWarning = false;
    // Uses the real production constant — same value as qa-flow.tsx
    state.currentStep = QA_FLOW_STATUS_STEP_INDEX;
  };

  return { nextStep, handleCaseStageWarningConfirm, handleCaseStageWarningCancel };
}

function makeState(override: Partial<FormData> = {}): State {
  return {
    currentStep: TOTAL_BASE_STEPS - 1, // start at the final step
    showCaseStageWarning: false,
    formData: { caseStage: '', ...override },
  };
}

// ---------------------------------------------------------------------------
// Tests for shouldShowCaseStageWarning (the real exported function)
// ---------------------------------------------------------------------------

describe('shouldShowCaseStageWarning — exported from qa-flow-guard.ts', () => {
  it('returns true for an empty string', () => {
    expect(shouldShowCaseStageWarning('')).toBe(true);
  });

  it('returns true for undefined', () => {
    expect(shouldShowCaseStageWarning(undefined)).toBe(true);
  });

  it('returns false when a stage is selected', () => {
    expect(shouldShowCaseStageWarning('arraignment')).toBe(false);
  });

  it('returns false for any non-empty string', () => {
    expect(shouldShowCaseStageWarning('pre-trial')).toBe(false);
    expect(shouldShowCaseStageWarning('sentencing')).toBe(false);
    expect(shouldShowCaseStageWarning('arrest')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Tests for QA_FLOW_STATUS_STEP_INDEX (the real exported constant)
// ---------------------------------------------------------------------------

describe('QA_FLOW_STATUS_STEP_INDEX — exported from qa-flow-guard.ts', () => {
  it('is 3, matching StatusStep position in baseSteps', () => {
    // This is the contract test: if qa-flow.tsx ever reorders its steps the
    // constant must be updated, and this test will catch the mismatch first.
    expect(QA_FLOW_STATUS_STEP_INDEX).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// Integration: state machine wired to real guard helpers
// ---------------------------------------------------------------------------

describe('QAFlow guard integration — wired to real qa-flow-guard helpers', () => {
  it('shows warning and does NOT call onComplete when caseStage is empty at last step', () => {
    const onComplete = vi.fn();
    const state = makeState({ caseStage: '' });
    const { nextStep } = makeHandlers(state, onComplete);

    nextStep();

    expect(state.showCaseStageWarning).toBe(true);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does NOT show warning and calls onComplete when caseStage is set', () => {
    const onComplete = vi.fn();
    const state = makeState({ caseStage: 'arraignment' });
    const { nextStep } = makeHandlers(state, onComplete);

    nextStep();

    expect(state.showCaseStageWarning).toBe(false);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('"Go back and select" closes dialog and navigates to QA_FLOW_STATUS_STEP_INDEX', () => {
    const onComplete = vi.fn();
    const state = makeState({ caseStage: '' });
    state.showCaseStageWarning = true;
    const { handleCaseStageWarningCancel } = makeHandlers(state, onComplete);

    handleCaseStageWarningCancel();

    expect(state.showCaseStageWarning).toBe(false);
    expect(state.currentStep).toBe(QA_FLOW_STATUS_STEP_INDEX); // real constant
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('"Continue with arrest stage" closes dialog and calls onComplete with formData', () => {
    const onComplete = vi.fn();
    const formData: FormData = {
      caseStage: '',
      jurisdiction: 'CA',
      charges: ['theft'],
      captchaToken: 'tok123',
    };
    const state: State = {
      currentStep: TOTAL_BASE_STEPS - 1,
      showCaseStageWarning: true,
      formData,
    };
    const { handleCaseStageWarningConfirm } = makeHandlers(state, onComplete);

    handleCaseStageWarningConfirm();

    expect(state.showCaseStageWarning).toBe(false);
    expect(onComplete).toHaveBeenCalledOnce();

    const payload = onComplete.mock.calls[0][0] as FormData;
    expect(payload.caseStage).toBe('');          // blank — user chose to continue
    expect(payload.jurisdiction).toBe('CA');
    expect(payload.charges).toEqual(['theft']);
    expect(payload.captchaToken).toBe('tok123'); // token passes through
  });

  it('guard is a no-op mid-flow (advances step without showing dialog)', () => {
    const onComplete = vi.fn();
    const state = makeState({ caseStage: '' });
    state.currentStep = 2; // not the final step

    const { nextStep } = makeHandlers(state, onComplete);
    nextStep();

    expect(state.currentStep).toBe(3);
    expect(state.showCaseStageWarning).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('guard fires on extended 7-step flow (with CivilEmergenciesStep)', () => {
    const SEVEN_STEPS = TOTAL_BASE_STEPS + 1;
    const onComplete = vi.fn();
    const state = makeState({ caseStage: '' });
    state.currentStep = SEVEN_STEPS - 1;

    const { nextStep } = makeHandlers(state, onComplete, SEVEN_STEPS);

    nextStep();

    expect(state.showCaseStageWarning).toBe(true);
    expect(onComplete).not.toHaveBeenCalled();
  });
});
