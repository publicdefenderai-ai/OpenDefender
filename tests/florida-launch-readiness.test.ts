import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildFloridaLaunchReadiness } from '../scripts/data-review/florida-launch/readiness';

describe('Florida first-launch readiness accounting', () => {
  it('partitions raw identities without counting excluded or expired records as available', () => {
    const result = buildFloridaLaunchReadiness(new Date('2026-11-17T18:00:00Z'));
    const count = result.counts;
    expect(count.rawCatalogRows).toBe(count.configuredChoices + count.rawExcludedRows);
    expect(count.configuredChoices).toBe(count.legacyChoices + count.separatelyReviewedChoices + count.publicationChoices);
    expect(count.offlineEligible + count.configuredWithheld).toBe(count.configuredChoices);
    expect(result.reviewed.current).toBe(false);
    expect(result.reviewed.expired).toBe(true);
    expect(result.reviewed.reportHashMatches).toBe(false);
    expect(result.reviewed.eligibilityHashMatches).toBe(false);
    expect(result.reviewed.withheldIds).toHaveLength(101);
    expect(new Set(result.reviewed.requiredSections).size).toBe(result.reviewed.requiredSections.length);
    expect(result.excludedLegacy).toHaveLength(92);
    expect(result.benchmark.absentSections).toBe(0);
    expect(result.benchmark.scopeReviewedCitations).toHaveLength(11);
    expect(result.benchmark.statewideDenominator).toBeNull();
  });
  it('recomputes deadlines at the requested clock without rewriting approvals', () => {
    const receipt = 'scripts/data-review/output/florida-reviewed-refresh-receipt.json';
    const before = readFileSync(receipt);
    const result = buildFloridaLaunchReadiness(new Date('2030-01-01T00:00:00Z'));
    expect(result.families.every(family => family.offlineEligible === 0)).toBe(true);
    expect(result.counts.offlineEligible).toBe(result.counts.legacyChoices);
    expect(readFileSync(receipt)).toEqual(before);
  });
});
