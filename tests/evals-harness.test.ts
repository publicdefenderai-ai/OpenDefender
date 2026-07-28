/**
 * Content accuracy eval harness for the rules-based guidance engine.
 *
 * This file runs every scenario from tests/fixtures/evals-scenarios.ts
 * against generateEnhancedGuidance() and asserts that the human-curated
 * expected values are met.
 *
 * It is intentionally separate from the structural/schema tests in
 * guidance-engine.test.ts.  Those tests verify the engine runs without
 * throwing and produces the right shape; these tests verify the *content*
 * produced is factually correct for each combination of jurisdiction,
 * charge type, case stage, and background flags.
 *
 * Run via: npx vitest run tests/evals-harness.test.ts
 *
 * IMPORTANT: Expected values were derived from the rules constants in
 * guidance-engine.ts.  Attorney review of the ground-truth values is a
 * recommended next step before treating failures as authoritative.
 */

import { describe, it, expect } from 'vitest';
import { generateEnhancedGuidance } from '../server/services/guidance-engine';
import { evalScenarios, type EvalScenario } from './fixtures/evals-scenarios';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Case-insensitive substring check. Returns true if `text` contains `keyword`. */
function containsKeyword(text: string, keyword: string): boolean {
  return text.toLowerCase().includes(keyword.toLowerCase());
}

/** Returns true if any string in `items` contains `keyword` (case-insensitive). */
function anyContains(items: string[], keyword: string): boolean {
  return items.some(item => containsKeyword(item, keyword));
}

// ── Assertion runner ──────────────────────────────────────────────────────────

function runScenario(scenario: EvalScenario): void {
  const { label, input, expect: ex } = scenario;
  const result = generateEnhancedGuidance(input as any);

  const deadlines = result.deadlines ?? [];
  const consequences = result.collateralConsequences ?? [];
  const alerts = result.criticalAlerts ?? [];
  const actions = result.immediateActions ?? [];
  const uncertainties = result.uncertainties ?? [];

  // ── Deadline timeframe keywords ──────────────────────────────────────────
  if (ex.deadlineTimeframeKeywords) {
    for (const keyword of ex.deadlineTimeframeKeywords) {
      const found = deadlines.some(d => containsKeyword(d.timeframe, keyword));
      expect(
        found,
        `[${label}]\n` +
        `  Expected at least one deadline timeframe to contain: "${keyword}"\n` +
        `  Actual timeframes: ${JSON.stringify(deadlines.map(d => d.timeframe))}`,
      ).toBe(true);
    }
  }

  // ── Deadline event keywords ───────────────────────────────────────────────
  if (ex.deadlineEventKeywords) {
    for (const keyword of ex.deadlineEventKeywords) {
      const found = deadlines.some(d => containsKeyword(d.event, keyword));
      expect(
        found,
        `[${label}]\n` +
        `  Expected at least one deadline event to contain: "${keyword}"\n` +
        `  Actual events: ${JSON.stringify(deadlines.map(d => d.event))}`,
      ).toBe(true);
    }
  }

  // ── isEstimate on deadlines ───────────────────────────────────────────────
  if (ex.someDeadlineIsEstimate === true) {
    const hasEstimate = deadlines.some(d => d.isEstimate === true);
    expect(
      hasEstimate,
      `[${label}]\n` +
      `  Expected at least one deadline to have isEstimate=true (unmapped jurisdiction)\n` +
      `  Deadlines: ${JSON.stringify(deadlines.map(d => ({ event: d.event, isEstimate: d.isEstimate })))}`,
    ).toBe(true);
  }

  if (ex.noDeadlineIsEstimate === true) {
    const estimateDeadlines = deadlines.filter(d => d.isEstimate === true);
    expect(
      estimateDeadlines,
      `[${label}]\n` +
      `  Expected NO deadlines to have isEstimate=true (mapped jurisdiction should be authoritative)\n` +
      `  Estimated deadlines: ${JSON.stringify(estimateDeadlines.map(d => d.event))}`,
    ).toHaveLength(0);
  }

  // ── Required consequence categories ──────────────────────────────────────
  if (ex.requiredConsequenceCategories) {
    const actualCategories = consequences.map(c => c.category);
    for (const category of ex.requiredConsequenceCategories) {
      expect(
        actualCategories,
        `[${label}]\n` +
        `  Expected collateralConsequences to include category: "${category}"\n` +
        `  Actual categories: ${JSON.stringify(actualCategories)}`,
      ).toContain(category);
    }
  }

  // ── Absent consequence categories ────────────────────────────────────────
  if (ex.absentConsequenceCategories) {
    const actualCategories = consequences.map(c => c.category);
    for (const category of ex.absentConsequenceCategories) {
      expect(
        actualCategories,
        `[${label}]\n` +
        `  Expected collateralConsequences NOT to include category: "${category}"\n` +
        `  Actual categories: ${JSON.stringify(actualCategories)}`,
      ).not.toContain(category);
    }
  }

  // ── Required alert keywords ───────────────────────────────────────────────
  if (ex.requiredAlertKeywords) {
    for (const keyword of ex.requiredAlertKeywords) {
      const found = anyContains(alerts, keyword);
      expect(
        found,
        `[${label}]\n` +
        `  Expected at least one criticalAlert to contain: "${keyword}"\n` +
        `  Actual alerts: ${JSON.stringify(alerts)}`,
      ).toBe(true);
    }
  }

  // ── Required action keywords ──────────────────────────────────────────────
  if (ex.requiredActionKeywords) {
    const actionTexts = actions.map(a => a.action);
    for (const keyword of ex.requiredActionKeywords) {
      const found = anyContains(actionTexts, keyword);
      expect(
        found,
        `[${label}]\n` +
        `  Expected at least one immediateAction to contain: "${keyword}"\n` +
        `  Actual actions: ${JSON.stringify(actionTexts)}`,
      ).toBe(true);
    }
  }

  // ── Required uncertainty areas ────────────────────────────────────────────
  if (ex.requiredUncertaintyAreas) {
    const actualAreas = uncertainties.map(u => u.area);
    for (const area of ex.requiredUncertaintyAreas) {
      expect(
        actualAreas,
        `[${label}]\n` +
        `  Expected uncertainties to include area: "${area}"\n` +
        `  Actual areas: ${JSON.stringify(actualAreas)}`,
      ).toContain(area);
    }
  }

  // ── Absent uncertainty areas ──────────────────────────────────────────────
  if (ex.absentUncertaintyAreas) {
    const actualAreas = uncertainties.map(u => u.area);
    for (const area of ex.absentUncertaintyAreas) {
      expect(
        actualAreas,
        `[${label}]\n` +
        `  Expected uncertainties NOT to include area: "${area}"\n` +
        `  Actual areas: ${JSON.stringify(actualAreas)}`,
      ).not.toContain(area);
    }
  }

  // ── uncertaintyShouldFire ─────────────────────────────────────────────────
  if (ex.uncertaintyShouldFire === true) {
    expect(
      uncertainties.length,
      `[${label}]\n` +
      `  Expected uncertainties to be non-empty but got []`,
    ).toBeGreaterThan(0);
  }

  // ── hasImmediateActions ───────────────────────────────────────────────────
  if (ex.hasImmediateActions === true) {
    expect(
      actions.length,
      `[${label}]\n` +
      `  Expected immediateActions to be non-empty but got []`,
    ).toBeGreaterThan(0);
  }

  // ── hasCollateralConsequences ─────────────────────────────────────────────
  if (ex.hasCollateralConsequences === true) {
    expect(
      consequences.length,
      `[${label}]\n` +
      `  Expected collateralConsequences to be non-empty but got []`,
    ).toBeGreaterThan(0);
  }
}

// ── Test suite ────────────────────────────────────────────────────────────────

describe('Content accuracy evals — rules-based guidance engine', () => {
  // Sanity check: confirm scenarios loaded
  it('scenario fixture file contains at least 50 scenarios', () => {
    expect(
      evalScenarios.length,
      `Expected at least 50 eval scenarios, found ${evalScenarios.length}`,
    ).toBeGreaterThanOrEqual(50);
  });

  // Each scenario gets its own named test for clear failure attribution.
  for (const scenario of evalScenarios) {
    it(scenario.label, () => {
      runScenario(scenario);
    });
  }
});

// ── Group-level describe blocks for readable output ───────────────────────────

describe('P1 — Deadline accuracy: mapped jurisdictions', () => {
  const p1 = evalScenarios.filter(s => s.label.startsWith('P1-0') || s.label.startsWith('P1-1'));
  for (const scenario of p1) {
    it(`${scenario.label} [grouped]`, () => {
      runScenario(scenario);
    });
  }
});

describe('P1 — Deadline accuracy: unmapped states fire isEstimate', () => {
  const p1u = evalScenarios.filter(s => s.label.match(/P1-1[1-7]/));
  for (const scenario of p1u) {
    it(`${scenario.label} [grouped]`, () => {
      runScenario(scenario);
    });
  }
});

describe('P1 — DUI/DMV deadline and federal language', () => {
  const p1df = evalScenarios.filter(s => s.label.match(/P1-(18|19|20|21|22)/));
  for (const scenario of p1df) {
    it(`${scenario.label} [grouped]`, () => {
      runScenario(scenario);
    });
  }
});

describe('P2 — Collateral consequences: flag-driven (immigration, custody, employment, housing, supervision)', () => {
  const p2f = evalScenarios.filter(s => s.label.startsWith('P2-0') || s.label.startsWith('P2-1'));
  for (const scenario of p2f) {
    it(`${scenario.label} [grouped]`, () => {
      runScenario(scenario);
    });
  }
});

describe('P2 — Collateral consequences: charge-specific (DUI, domestic, weapons, combined)', () => {
  const p2c = evalScenarios.filter(s => s.label.match(/P2-(17|18|19|20|21|22|23|24|25|26)/));
  for (const scenario of p2c) {
    it(`${scenario.label} [grouped]`, () => {
      runScenario(scenario);
    });
  }
});

describe('P3 — Critical alerts: arraignment deadline and public defender', () => {
  const p3a = evalScenarios.filter(s => s.label.match(/P3-0[1-7]/));
  for (const scenario of p3a) {
    it(`${scenario.label} [grouped]`, () => {
      runScenario(scenario);
    });
  }
});

describe('P3 — Default charge bucket fires uncertainty notice', () => {
  const p3d = evalScenarios.filter(s => s.label.match(/P3-(08|09|10|11|12)/));
  for (const scenario of p3d) {
    it(`${scenario.label} [grouped]`, () => {
      runScenario(scenario);
    });
  }
});

describe('P3 — All keyword groups produce immediateActions and ≥1 consequence', () => {
  const p3k = evalScenarios.filter(s => s.label.match(/P3-(13|14|15|16|17|18|19|20|21|22|23|24|25|26|27)/));
  for (const scenario of p3k) {
    it(`${scenario.label} [grouped]`, () => {
      runScenario(scenario);
    });
  }
});

describe('P3 — Missing background fields fire uncertainty notices', () => {
  const p3m = evalScenarios.filter(s => s.label.match(/P3-(28|29|30|31|32)/));
  for (const scenario of p3m) {
    it(`${scenario.label} [grouped]`, () => {
      runScenario(scenario);
    });
  }
});

// ── Canary: rule-change regression detection ──────────────────────────────────
//
// PURPOSE
// -------
// The P1 deadline scenarios are the authoritative source of truth for what the
// engine should output for each jurisdiction.  They are parameterised against
// the *keyword* expected from `jurisdictionRules` in guidance-engine.ts.
//
// This means:
//   - If an engineer updates `jurisdictionRules.IL.arraignmentDeadline` from
//     "Within 48 hours" to "Within 24 hours", the P1-23 scenario (which asserts
//     `deadlineTimeframeKeywords: ['48 hours']`) will FAIL immediately.
//   - The failure surfaces the discrepancy before it reaches users.
//   - The fix is: update the scenario expected value *and* get attorney review
//     of the new rule text, then re-run the harness.
//
// The tests below verify the canary mechanism is live — they confirm that the
// actual engine output matches the P1 keyword, AND that a deliberately wrong
// keyword is absent.  If the engine output ever stops containing the canonical
// keyword (because the rule constant changed), BOTH the P1 scenario and these
// canary assertions will fail, making the regression impossible to miss.
//
// HOW TO USE WHEN A RULE CHANGES
// --------------------------------
// 1.  Update `jurisdictionRules` in server/services/guidance-engine.ts.
// 2.  Run `npx vitest run tests/evals-harness.test.ts`.
// 3.  Failing P1 scenarios identify every scenario whose expected keyword no
//     longer matches.  Update those `deadlineTimeframeKeywords` values to the
//     new string.
// 4.  Update the canary assertion below (expectedKeyword / wrongKeyword) to
//     match the new canonical value.
// 5.  Obtain attorney review of the updated rule text before merging.

describe('Canary — P1 deadline scenarios catch rule-constant changes', () => {
  // ── IL arraignment: canonical value is "48 hours" ─────────────────────────
  // If jurisdictionRules.IL.arraignmentDeadline changes, P1-23 will fail AND
  // this canary will fail.  Both failures must be resolved together.
  it('IL arraignment deadline output contains canonical keyword "48 hours"', () => {
    const result = generateEnhancedGuidance({
      jurisdiction: 'IL',
      charges: 'theft',
      caseStage: 'arrest',
      custodyStatus: 'detained',
      hasAttorney: false,
    } as any);

    const deadlines = result.deadlines ?? [];
    const arraignment = deadlines.filter(d =>
      d.event.toLowerCase().includes('arraignment'),
    );

    const canonicalKeyword = '48 hours';
    const found = arraignment.some(d =>
      d.timeframe.toLowerCase().includes(canonicalKeyword.toLowerCase()),
    );

    expect(
      found,
      `[Canary: IL arraignment]\n` +
      `  The canonical P1-23 keyword "${canonicalKeyword}" was NOT found in any ` +
      `arraignment deadline timeframe.\n` +
      `  Actual arraignment timeframes: ${JSON.stringify(arraignment.map(d => d.timeframe))}\n` +
      `\n` +
      `  ► This means jurisdictionRules.IL.arraignmentDeadline no longer contains\n` +
      `    "${canonicalKeyword}".  Update the rule constant, update the P1-23\n` +
      `    scenario's deadlineTimeframeKeywords, update the canonicalKeyword in\n` +
      `    this canary, and obtain attorney review before merging.`,
    ).toBe(true);
  });

  it('IL arraignment deadline does NOT contain wrong keyword "24 hours" (canary sensitivity check)', () => {
    // Asserts the test is actually sensitive: if the rule were changed to
    // "Within 24 hours", the keyword "48 hours" would disappear from the output
    // and the P1-23 scenario would fail.  This test confirms those two values
    // are distinguishable by the harness.
    const result = generateEnhancedGuidance({
      jurisdiction: 'IL',
      charges: 'theft',
      caseStage: 'arrest',
      custodyStatus: 'detained',
      hasAttorney: false,
    } as any);

    const deadlines = result.deadlines ?? [];
    const arraignment = deadlines.filter(d =>
      d.event.toLowerCase().includes('arraignment'),
    );

    // "24 hours" must NOT appear as the sole timeframe: IL is a 48-hour state.
    // If this assertion ever fails it means IL was changed to a 24-hour rule
    // and P1-23 also needs to be updated.
    const wrongKeyword = '24 hours';
    const wrongFound = arraignment.some(
      d =>
        d.timeframe.toLowerCase().includes(wrongKeyword) &&
        !d.timeframe.toLowerCase().includes('48'),
    );

    expect(
      wrongFound,
      `[Canary: IL arraignment sensitivity]\n` +
      `  The wrong keyword "${wrongKeyword}" (without "48 hours") was found in an ` +
      `IL arraignment timeframe, indicating jurisdictionRules.IL.arraignmentDeadline\n` +
      `  may have been updated without updating P1-23 and this canary.\n` +
      `  Actual arraignment timeframes: ${JSON.stringify(arraignment.map(d => d.timeframe))}`,
    ).toBe(false);
  });

  // ── NY arraignment: canonical value is "24 hours" ─────────────────────────
  // Mirrors the IL canary for a jurisdiction whose rule differs ("24 hours")
  // so we confirm both 48-hour and 24-hour canonical values are under guard.
  it('NY arraignment deadline output contains canonical keyword "24 hours"', () => {
    const result = generateEnhancedGuidance({
      jurisdiction: 'NY',
      charges: 'assault',
      caseStage: 'arrest',
      custodyStatus: 'detained',
      hasAttorney: false,
    } as any);

    const deadlines = result.deadlines ?? [];
    const arraignment = deadlines.filter(d =>
      d.event.toLowerCase().includes('arraignment'),
    );

    const canonicalKeyword = '24 hours';
    const found = arraignment.some(d =>
      d.timeframe.toLowerCase().includes(canonicalKeyword.toLowerCase()),
    );

    expect(
      found,
      `[Canary: NY arraignment]\n` +
      `  The canonical P1-07 keyword "${canonicalKeyword}" was NOT found in any ` +
      `arraignment deadline timeframe.\n` +
      `  Actual arraignment timeframes: ${JSON.stringify(arraignment.map(d => d.timeframe))}\n` +
      `\n` +
      `  ► This means jurisdictionRules.NY.arraignmentDeadline no longer contains\n` +
      `    "${canonicalKeyword}".  Update the rule constant, update the P1-07\n` +
      `    scenario's deadlineTimeframeKeywords, update the canonicalKeyword in\n` +
      `    this canary, and obtain attorney review before merging.`,
    ).toBe(true);
  });
});
