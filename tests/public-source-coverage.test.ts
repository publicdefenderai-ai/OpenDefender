import { describe, expect, it } from "vitest";
import { main as runCoverageCheck } from "../scripts/data-review/check-public-source-coverage";
import {
  buildPublicSourceCoverageReport,
  assertPublicSourceCoverageRegistry,
  CURRENT_PUBLIC_SOURCE_JURISDICTIONS,
  HIGH_PUBLIC_SOURCE_COVERAGE_TARGET,
  isPublicSourceCoverageTargetMet,
} from "../server/data/public-source-coverage";

describe("public-source coverage gate", () => {
  it("requires a committed manifest and seed command for every configured jurisdiction", () => {
    expect(() => assertPublicSourceCoverageRegistry()).not.toThrow();
  });

  it("accounts for every current jurisdiction and every catalog row", () => {
    const report = buildPublicSourceCoverageReport();

    expect(report.target).toEqual(HIGH_PUBLIC_SOURCE_COVERAGE_TARGET);
    expect(report.jurisdictions.map((row) => row.jurisdiction)).toEqual(
      [...CURRENT_PUBLIC_SOURCE_JURISDICTIONS],
    );
    expect(report.belowTargetJurisdictions).toEqual(["GA"]);

    for (const row of report.jurisdictions) {
      expect(row.catalogRows).toBeGreaterThan(0);
      expect(row.selectableRows + row.withheldRows).toBe(row.catalogRows);
      expect(row.withheldRows).toBe(row.catalogRows - row.selectableRows);
      expect(row.rowsWithExplicitWithheldReason).toBe(row.withheldRows);
      expect(row.catalogAccountingRate).toBe(1);
      expect(row.coveragePercentage).toBeCloseTo(
        (row.selectableRows / row.catalogRows) * 100,
      );
      expect(row.selectableCoveragePercentage).toBe(row.coveragePercentage);
      expect(row.officialResponsePercentage).toBeCloseTo(
        (row.rowsWithOfficialResponse / row.catalogRows) * 100,
      );
      expect(row.officialSourceAvailability).toMatch(
        /^(available|partial|unavailable)$/,
      );
      expect(row.gapCounts).toEqual(
        Object.fromEntries(row.gapBreakdown.map((gap) => [gap.kind, gap.rows])),
      );
      expect(row.gapBreakdown).toHaveLength(6);
      expect(row.manifestPath || row.jurisdiction === "CA").toBeTruthy();
      expect(row.seedScriptPath).toContain("scripts/data-review/seed-");
      expect(row.status).toBe(
        row.officialResponseRate >= HIGH_PUBLIC_SOURCE_COVERAGE_TARGET.officialResponseRate
          ? "meets_target"
          : "blocked",
      );
    }
  });

  it("returns a canonical, isolated readiness summary on repeated calls", () => {
    const first = buildPublicSourceCoverageReport();
    const expected = JSON.stringify(first);

    // Returned values must not retain references to module-level readiness
    // configuration or become sensitive to a consumer's iteration order.
    first.target.catalogAccountingRate = 0;
    first.jurisdictions
      .find((row) => row.jurisdiction === "GA")!
      .blocker!.summary = "mutated by caller";
    for (const row of first.jurisdictions) {
      for (const gap of row.gapBreakdown) gap.chargeIds.reverse();
    }

    const second = buildPublicSourceCoverageReport();
    expect(JSON.stringify(second)).toBe(expected);
    expect(buildPublicSourceCoverageReport()).toEqual(second);
    for (const row of second.jurisdictions) {
      for (const gap of row.gapBreakdown) {
        expect(gap.chargeIds).toEqual([...gap.chargeIds].sort());
      }
    }
  });

  it("keeps source access blockers concrete and separate from publication coverage", () => {
    const report = buildPublicSourceCoverageReport();
    const georgia = report.jurisdictions.find((row) => row.jurisdiction === "GA")!;
    const pennsylvania = report.jurisdictions.find((row) => row.jurisdiction === "PA")!;

    expect(georgia.status).toBe("blocked");
    expect(georgia.blocker?.kind).toBe("source_access");
    expect(georgia.blocker?.evidence).toContain("cookie/human-verification");
    expect(georgia.blocker?.evidence).toContain("omit pddocid/pddocfullpath");
    expect(pennsylvania.status).toBe("meets_target");
    expect(pennsylvania.blocker?.kind).toBe("source_access");
    expect(pennsylvania.blocker?.nextStep).toContain("official PA source probe");
    expect(georgia.officialSourceAvailability).toBe("unavailable");
    expect(pennsylvania.officialSourceAvailability).toBe("partial");

    for (const row of report.jurisdictions) {
      expect(row.publishableRate).toBeLessThanOrEqual(row.officialResponseRate);
      if (row.status === "blocked") expect(row.blocker).not.toBeNull();
    }
  });

  it("ranks every current low-publication jurisdiction by actionable coverage work", () => {
    const report = buildPublicSourceCoverageReport();

    expect(report.nextHighestValueCoverageTargets).toHaveLength(
      CURRENT_PUBLIC_SOURCE_JURISDICTIONS.length,
    );
    expect(report.nextHighestValueCoverageTargets[0]).toMatchObject({
      jurisdiction: "GA",
      kind: "source_access",
      rows: 129,
    });
    expect(report.nextHighestValueCoverageTargets.map((target) => target.rows)).toEqual(
      [129, 87, 102, 96, 92, 87, 78, 27, 21],
    );
    for (const target of report.nextHighestValueCoverageTargets) {
      expect(target.coveragePercentage).toBeGreaterThanOrEqual(0);
      expect(target.officialResponsePercentage).toBeGreaterThanOrEqual(0);
      expect(target.reason).toBeTruthy();
      expect(target.nextStep).toBeTruthy();
    }
  });

  it("fails the target when any withheld row lacks an explicit reason", () => {
    expect(
      isPublicSourceCoverageTargetMet({
        catalogAccountingRate: 1,
        officialResponseRate: 1,
        withheldRows: 2,
        rowsWithExplicitWithheldReason: 1,
      }),
    ).toBe(false);
    expect(
      isPublicSourceCoverageTargetMet({
        catalogAccountingRate: 1,
        officialResponseRate: 1,
        withheldRows: 2,
        rowsWithExplicitWithheldReason: 2,
      }),
    ).toBe(true);
  });

  it("blocks the coverage command while current jurisdictions are below target", () => {
    expect(runCoverageCheck([])).toBe(1);
  });
});