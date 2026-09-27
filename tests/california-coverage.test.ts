import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { buildCaliforniaCoverage, validateCaliforniaSourceExpansion } from "../scripts/data-review/california-verification/coverage";
const expansion = () => JSON.parse(fs.readFileSync("scripts/data-review/output/california-catalog-source-expansion.json", "utf8"));

describe("California catalog coverage boundaries", () => {
  it("accounts for every catalog record without equating acquisition with correction", () => {
    const report = buildCaliforniaCoverage();
    expect(report.accounting).toMatchObject({ canonicalRecords: 120, configuredSelectable: 99, withheldCanonicalLabels: 21, boundedCorrectionPass: 60, awaitingCorrectionPass: 39, acquiredSelectablePrimarySections: 69, selectableRecordsWithAllPrimaryTextAcquired: 99, totalAcquiredSectionsIncludingDependencies: 129, totalAcquiredVersionsIncludingDependencies: 131 });
    expect(report.accounting.boundedCorrectionPass + report.accounting.awaitingCorrectionPass).toBe(report.accounting.configuredSelectable);
    expect(report.records.filter(row => row.status === "withheld_canonical_label")).toHaveLength(21);
    expect(JSON.parse(fs.readFileSync("scripts/data-review/output/california-catalog-coverage.json", "utf8"))).toEqual(report);
  });
  it("groups all 39 remaining records exactly once and does not split shared primary sources", () => {
    const report = buildCaliforniaCoverage();
    const ids = report.groups.flatMap(group => group.recordIds);
    expect(ids).toHaveLength(39);
    expect(new Set(ids).size).toBe(39);
    expect([...ids].sort()).toEqual(report.records.filter(row => row.status === "awaiting_statutory_correction_pass").map(row => row.id).sort());
    const sources = report.groups.flatMap(group => group.primaryKeys);
    expect(new Set(sources).size).toBe(sources.length);
    for (const group of report.groups) {
      const expected = new Set(report.records.filter(row => group.recordIds.includes(row.id)).flatMap(row => row.primaryKeys));
      expect([...expected].sort()).toEqual(group.primaryKeys);
    }
  });
  it("does not convert the code-section universe into an offense denominator or live availability claim", () => {
    const report = buildCaliforniaCoverage();
    expect(report.statutoryUniverse).toHaveLength(30);
    expect(report.accounting.statewideOffenseDenominator).toBeNull();
    expect(report.accounting.statewideCoveragePercent).toBeNull();
    expect(report.accounting.liveDeploymentParity).toBe("not_verified_by_this_offline_report");
    expect(report.recommendedReuseBatch).toHaveLength(0);
  });
  it("rejects modified acquired text", () => {
    const source = expansion();
    const key = Object.keys(source.documents)[0];
    source.documents[key][0].contentXml += "changed";
    expect(() => validateCaliforniaSourceExpansion(source)).toThrow("Expansion source changed");
  });
  it("rejects a same-section cross-code substitution", () => {
    const source = expansion();
    const key = Object.keys(source.documents)[0];
    source.documents[key][0].lawCode = "WRONG";
    expect(() => validateCaliforniaSourceExpansion(source)).toThrow("Expansion source changed");
  });
  it("rejects an expansion from another archive", () => {
    const source = expansion();
    source.archive.sha256 = "0".repeat(64);
    expect(() => validateCaliforniaSourceExpansion(source)).toThrow("Source expansion provenance changed");
  });
});
