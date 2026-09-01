import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { criminalCharges } from "../shared/criminal-charges";
import {
  buildNorthCarolinaSourceDatabaseSeed,
  buildNorthCarolinaSourceKey,
  buildNorthCarolinaSourceUrl,
  parseNorthCarolinaCitation,
  validateNorthCarolinaManifestRecord,
} from "../server/data/north-carolina-source-database-seed";
import { loadNorthCarolinaAuthorityManifest } from "../server/data/north-carolina-manifest-loader";
import {
  inspectNorthCarolinaDocument,
} from "../scripts/data-review/import-north-carolina-source-database";

describe("North Carolina authority manifest", () => {
  it("preserves every catalog row and only publishes complete exact matches", () => {
    const manifest = loadNorthCarolinaAuthorityManifest();
    const seed = buildNorthCarolinaSourceDatabaseSeed(manifest);
    const count = criminalCharges.filter((charge) => charge.jurisdiction === "NC").length;

    expect(count).toBe(130);
    expect(manifest.catalogRecords).toHaveLength(count);
    expect(new Set(manifest.catalogRecords.map((record) => record.chargeId)).size).toBe(count);
    expect(manifest.audit.catalogRowCount).toBe(count);
    expect(manifest.audit.parsedReferenceCount).toBe(133);
    expect(seed.selectableChargeIds).toHaveLength(6);
    expect(manifest.catalogRecords.filter((record) =>
      record.disposition === "require_exact_reselection",
    )).toHaveLength(124);
    expect(manifest.catalogRecords
      .filter((record) => record.disposition === "require_exact_reselection")
      .every((record) => record.provisions.length === 0)).toBe(true);
  });

  it("parses only exact N.C. General Statutes citations", () => {
    expect(parseNorthCarolinaCitation("N.C. Gen. Stat. § 14-17(b)")).toEqual([
      { section: "14-17", subdivision: "(b)" },
    ]);
    expect(parseNorthCarolinaCitation("N.C. Gen. Stat. §§ 14-2.5, 14-87")).toEqual([
      { section: "14-2.5", subdivision: null },
      { section: "14-87", subdivision: null },
    ]);
    expect(parseNorthCarolinaCitation("N.C. Gen. Stat. § 58-2-161")).toEqual([
      { section: "58-2-161", subdivision: null },
    ]);
    expect(parseNorthCarolinaCitation("MPC § 5.01 / NC attempt statute")).toEqual([]);
    expect(buildNorthCarolinaSourceKey("14-17", "(b)")).toBe("nc:statute:14-17:b");
    expect(buildNorthCarolinaSourceUrl("50B-4.1")).toBe(
      "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_50B/GS_50B-4.1.html",
    );
  });

  it("requires complete official content and codification history", () => {
    const url = buildNorthCarolinaSourceUrl("14-17");
    const html = `<html><body>
      <p><span>&sect; 14-17. Murder in the first and second degree defined; punishment.</span></p>
      <p><span>(a) Complete official statutory text.</span></p>
      <p><span>(1893, c. 85; 2023-123, s. 2(a).)</span></p>
    </body></html>`;
    const inspection = inspectNorthCarolinaDocument(
      html,
      "14-17",
      url,
      new Date("2026-08-31T00:00:00.000Z"),
    );
    expect(inspection.sectionExtractionStatus).toBe("complete");
    expect(inspection.historyEvidence).toBe(true);
    expect(inspection.contentEvidence).toBe(true);
    expect(inspection.contentHash).toBe(
      createHash("sha256").update(inspection.document!.text).digest("hex"),
    );

    const noHistory = inspectNorthCarolinaDocument(
      html.replace("(1893, c. 85; 2023-123, s. 2(a).)", ""),
      "14-17",
      url,
      new Date("2026-08-31T00:00:00.000Z"),
    );
    expect(noHistory.document).toBeNull();
    expect(noHistory.findings.map((finding) => finding.code)).toContain("history_missing");
  });

  it("rejects a tampered selectable provision at manifest validation", () => {
    const manifest = loadNorthCarolinaAuthorityManifest();
    const record = manifest.catalogRecords.find((candidate) => candidate.disposition === "retain")!;
    const tampered = structuredClone(record);
    tampered.provisions[0].contentHash = "0".repeat(64);
    expect(validateNorthCarolinaManifestRecord(tampered)).toMatch(
      /not an exact verified North Carolina match/i,
    );
  });
});