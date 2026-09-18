import { describe, expect, it } from "vitest";
import {
  buildFloridaCoverageInventory,
  renderFloridaCoverageCsv,
} from "../scripts/data-review/build-florida-coverage-inventory";

describe("Florida coverage inventory", () => {
  const inventory = buildFloridaCoverageInventory();

  it("reports cached evidence without inventing a statewide completeness denominator", () => {
    expect(inventory.summary.cachedOfficialSections).toBe(1424);
    expect(inventory.summary.actualOffenseCount).toBeNull();
    expect(inventory.summary.statewideSectionDenominator).toBeNull();
    expect(inventory.summary.completenessPercentage).toBeNull();
    expect(inventory.rows.filter(row =>
      row.rowKind === "section" && row.classification === "not_yet_analyzed",
    ).length).toBeGreaterThan(1000);
  });

  it("keeps selectable records, cited scopes, and legacy cleanup items distinct", () => {
    expect(inventory.summary.currentSelectableRecords).toBe(
      inventory.summary.reviewedSelectableRecords +
      inventory.summary.legacySelectableRecords,
    );
    expect(inventory.summary.legacyCleanupQueueRecords).toBe(92);
    expect(inventory.summary.distinctSelectableCitedScopes)
      .toBeLessThanOrEqual(inventory.summary.currentSelectableRecords);
    expect(inventory.methodology.legacyCleanupQueue).toContain("not treated as a missing-offense count");
  });

  it("counts reviewed selections only through the report, approval, and freshness gate", () => {
    if (inventory.summary.reviewedRuntimeStatus === "current") {
      expect(inventory.summary.reviewedRuntimeBlockReason).toBeNull();
      expect(inventory.summary.reviewedSelectableRecords).toBeGreaterThan(0);
    } else {
      expect(inventory.summary.reviewedRuntimeBlockReason).toBeTruthy();
      expect(inventory.summary.reviewedSelectableRecords).toBe(0);
    }
  });

  it("includes variant rows and an honest unresolved section row for every priority area", () => {
    for (const section of inventory.priorityAreas) {
      const rows = inventory.rows.filter(row => row.section === section);
      expect(rows.some(row => row.rowKind === "section")).toBe(true);
      expect(rows.some(row => row.rowKind === "scope")).toBe(true);
      expect(rows.find(row => row.rowKind === "section")?.classification)
        .not.toBe("covered");
    }
  });

  it("preserves explicit current and historical absences", () => {
    expect(inventory.knownAbsences.map(row => row.section).sort())
      .toEqual(["112.191", "213.29", "381.986", "386.04"].sort());
    expect(inventory.rows.find(row => row.section === "112.191")?.cacheStatus)
      .toBe("historical_only");
    for (const section of ["213.29", "381.986", "386.04"]) {
      expect(inventory.rows.find(row => row.section === section)?.classification)
        .toBe("blocked");
    }
  });

  it("flags but does not destructively combine the legacy/new 831.01 citation", () => {
    const row = inventory.rows.find(row =>
      row.rowKind === "scope" && row.section === "831.01" && row.subdivision === null);
    expect(row?.duplicateSameCitation).toBe(true);
    expect(row?.selectableRecordIds).toContain("fl-forgery");
    expect(row?.selectableRecordIds).toContain("fl-fs-831-01-forgery");
  });

  it("keeps the three held E scopes distinct and blocked", () => {
    const expected = [
      ["893.13", "(3)"],
      ["893.147", "(4)(b)"],
      ["893.147", "(7)"],
    ];
    for (const [section, subdivision] of expected) {
      const row = inventory.rows.find(candidate =>
        candidate.rowKind === "scope" &&
        candidate.section === section &&
        candidate.subdivision === subdivision,
      );
      expect(row?.classification).toBe("blocked");
      expect(row?.selectableRecordIds).toEqual([]);
    }
  });

  it("does not label an uncached ordinary section as officially cached", () => {
    const uncached = inventory.rows.find(row =>
      row.rowKind === "section" &&
      row.retrievedAt === null &&
      !inventory.knownAbsences.some(absence => absence.section === row.section),
    );
    expect(uncached?.cacheStatus).toBe("not_cached");
  });

  it("emits provenance and safe CSV quoting", () => {
    const cached = inventory.rows.find(row =>
      row.rowKind === "section" && row.cacheStatus === "official_current_cache");
    expect(cached?.retrievedAt).toMatch(/Z$/);
    expect(cached?.contentHash).toMatch(/^[a-f0-9]{64}$/);
    const csv = renderFloridaCoverageCsv(inventory);
    expect(csv.split("\n")[0]).toContain("\"actualOffenseCount\"");
    expect(csv).toContain("\"Fla. Stat. § 831.01\"");
  });

  it("never treats a duplicate disposition as proof of a covered public scope", () => {
    for (const row of inventory.rows.filter(row => row.classification === "covered")) {
      expect(row.selectableRecordIds.length, row.citation).toBeGreaterThan(0);
    }
    const wholeTheft = inventory.rows.find(row =>
      row.rowKind === "scope" && row.section === "812.014" && row.subdivision === null);
    expect(wholeTheft?.classification).not.toBe("covered");
  });
});