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
