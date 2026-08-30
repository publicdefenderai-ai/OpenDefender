import { describe, expect, it } from "vitest";
import { main as runCoverageCheck } from "../scripts/data-review/check-public-source-coverage";
import {
  buildPublicSourceCoverageReport,
  CURRENT_PUBLIC_SOURCE_JURISDICTIONS,
  HIGH_PUBLIC_SOURCE_COVERAGE_TARGET,
  isPublicSourceCoverageTargetMet,
} from "../server/data/public-source-coverage";

describe("public-source coverage gate", () => {
  it("accounts for every current jurisdiction and every catalog row", () => {
    const report = buildPublicSourceCoverageReport();

    expect(report.target).toEqual(HIGH_PUBLIC_SOURCE_COVERAGE_TARGET);
    expect(report.jurisdictions.map((row) => row.jurisdiction)).toEqual(
      [...CURRENT_PUBLIC_SOURCE_JURISDICTIONS],
    );
    expect(report.belowTargetJurisdictions).toEqual(["GA", "PA"]);

    for (const row of report.jurisdictions) {
      expect(row.catalogRows).toBeGreaterThan(0);
      expect(row.selectableRows + row.withheldRows).toBe(row.catalogRows);
      expect(row.withheldRows).toBe(row.catalogRows - row.selectableRows);
      expect(row.rowsWithExplicitWithheldReason).toBe(row.withheldRows);
      expect(row.catalogAccountingRate).toBe(1);
      expect(row.status).toBe(
        row.officialResponseRate >= HIGH_PUBLIC_SOURCE_COVERAGE_TARGET.officialResponseRate
          ? "meets_target"
          : "blocked",
      );
    }
  });

  it("keeps source access blockers concrete and separate from publication coverage", () => {
    const report = buildPublicSourceCoverageReport();
    const georgia = report.jurisdictions.find((row) => row.jurisdiction === "GA")!;
    const pennsylvania = report.jurisdictions.find((row) => row.jurisdiction === "PA")!;

    expect(georgia.status).toBe("blocked");
    expect(georgia.blocker?.kind).toBe("source_access");
    expect(georgia.blocker?.evidence).toContain("no public official section document");
    expect(pennsylvania.status).toBe("blocked");
    expect(pennsylvania.blocker?.kind).toBe("source_access");
    expect(pennsylvania.blocker?.nextStep).toContain("official PA source probe");

    for (const row of report.jurisdictions) {
      expect(row.publishableRate).toBeLessThanOrEqual(row.officialResponseRate);
      if (row.status === "blocked") expect(row.blocker).not.toBeNull();
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