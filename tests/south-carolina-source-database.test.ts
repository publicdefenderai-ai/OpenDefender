import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { criminalCharges } from "../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../shared/criminal-charge-citations";
import {
  buildSouthCarolinaManifestRecord,
  buildSouthCarolinaSourceDatabaseSeed,
  buildSouthCarolinaSourceKey,
  buildSouthCarolinaSourceUrl,
  parseSouthCarolinaCitation,
  validateSouthCarolinaManifestRecord,
  type SouthCarolinaSourceDocument,
} from "../server/data/south-carolina-source-database-seed";
import { loadSouthCarolinaAuthorityManifest } from "../server/data/south-carolina-manifest-loader";
import {
  extractSouthCarolinaDocument,
  refreshSouthCarolinaManifest,
} from "../scripts/data-review/import-south-carolina-source-database";

const importedAt = new Date("2026-08-28T00:00:00.000Z");

function document(section: string, title: string, subdivision?: string): SouthCarolinaSourceDocument {
  return {
    section,
    title,
    text: `SECTION ${section}. ${title}\n${subdivision ?? "(A)"} A person commits an offense when the statutory elements are met.\nHISTORY: 1976 Act No. 445, Section 1.`,
    sourceUrl: buildSouthCarolinaSourceUrl(section),
    retrievedAt: importedAt,
    effectiveDateStart: null,
  };
}

describe("South Carolina authority manifest", () => {
  it("preserves all 128 catalog rows and only publishes complete official matches", () => {
    const manifest = loadSouthCarolinaAuthorityManifest();
    const seed = buildSouthCarolinaSourceDatabaseSeed(manifest);
    const count = criminalCharges.filter((charge) => charge.jurisdiction === "SC").length;

    expect(count).toBe(128);
    expect(manifest.catalogRecords).toHaveLength(count);
    expect(new Set(manifest.catalogRecords.map((record) => record.chargeId)).size).toBe(count);
    expect(seed.sources).toHaveLength(2);
    expect(seed.snapshots).toHaveLength(2);
    expect(seed.links).toHaveLength(2);
    expect(seed.selectableChargeIds).toHaveLength(2);
    expect(manifest.catalogRecords.filter((record) =>
      record.disposition === "require_exact_reselection")).toHaveLength(126);
    expect(manifest.catalogRecords.filter((record) =>
      record.disposition === "require_exact_reselection").every((record) => record.provisions.length === 0)).toBe(true);
    expect(seed.selectableChargeIds).not.toContain("sc-murder-in-the-first-degree");
    expect(seed.selectableChargeIds).not.toContain("sc-voluntary-manslaughter");
    expect(seed.selectableChargeIds).toContain("sc-shoplifting");
  });

  it("accepts only exact South Carolina Code citations and constructs official chapter URLs", () => {
    expect(parseSouthCarolinaCitation("S.C. Code Ann. § 16-3-600(A)(1)")).toEqual([
      { section: "16-3-600", subdivision: "(A)(1)" },
    ]);
    expect(parseSouthCarolinaCitation("S.C. Code Ann. §§ 16-3-600(A), 16-3-652")).toEqual([
      { section: "16-3-600", subdivision: "(A)" },
      { section: "16-3-652", subdivision: null },
    ]);
    expect(parseSouthCarolinaCitation("18 U.S.C. § 2113")).toEqual([]);
    expect(parseSouthCarolinaCitation("MPC § 210.2")).toEqual([]);
    expect(buildSouthCarolinaSourceKey("16-3-600", "(A)(1)")).toBe("sc:statute:16-3-600:A_1");
    expect(buildSouthCarolinaSourceUrl("16-3-600")).toBe(
      "https://www.scstatehouse.gov/code/t16c003.php",
    );
  });

  it("extracts one section from a long chapter page and rejects missing history or subdivisions", () => {
    const html = `<html><body>
      <span class="SectionNumber">SECTION 16-3-50.</span>
      Manslaughter.<br><br>(A) Complete official statutory text.<br><br>
      HISTORY: 1962 Code Section 16-51.<br><br>
      <span class="SectionNumber">SECTION 16-3-60.</span>
      Involuntary manslaughter; "criminal negligence" defined.<br><br>
      (A) Complete second section.<br><br>HISTORY: 1962 Code Section 16-52.
    </body></html>`;
    const url = buildSouthCarolinaSourceUrl("16-3-50");
    expect(extractSouthCarolinaDocument(html, "16-3-50", url, importedAt)).toMatchObject({
      section: "16-3-50",
      title: "Manslaughter",
      sourceUrl: url,
    });
    expect(extractSouthCarolinaDocument(html, "16-3-50", url, importedAt, "(B)")).toBeNull();
    expect(extractSouthCarolinaDocument(
      html.replace("HISTORY: 1962 Code Section 16-51.", ""),
      "16-3-50",
      url,
      importedAt,
    )).toBeNull();
  });

  it("stores complete official text and rejects wrong, compound, and incomplete mappings", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "sc-shoplifting")!;
    const text = "SECTION 16-13-110. Shoplifting\nA person commits shoplifting.\nHISTORY: 1962 Code Section 16-149.";
    const record = buildSouthCarolinaManifestRecord(charge, [{
      ...document("16-13-110", "Shoplifting"),
      text,
    }], importedAt);
    expect(record.disposition).toBe("retain");
    expect(record.provisions[0]).toMatchObject({
      sourceKey: "sc:statute:16-13-110",
      citation: "S.C. Code Ann. § 16-13-110",
      content: text,
      hashBasis: "source_content",
      contentHash: createHash("sha256").update(text).digest("hex"),
    });
    expect(validateSouthCarolinaManifestRecord(record)).toBeNull();

    const wrongSection = buildSouthCarolinaManifestRecord(
      charge,
      [document("16-13-30", "Petit larceny; grand larceny")],
      importedAt,
    );
    expect(wrongSection.disposition).toBe("require_exact_reselection");
    expect(wrongSection.provisions).toEqual([]);

    const federal = criminalCharges.find((candidate) => candidate.id === "sc-bank-robbery")!;
    const federalRecord = buildSouthCarolinaManifestRecord(federal, [], importedAt);
    expect(federalRecord.disposition).toBe("require_exact_reselection");
    expect(federalRecord.provisions).toEqual([]);

    const incomplete = buildSouthCarolinaManifestRecord(charge, [], importedAt, "Official source unavailable");
    expect(incomplete.disposition).toBe("require_exact_reselection");
    expect(incomplete.provisions).toEqual([]);
  });

  it("rejects a tampered selectable manifest record at load time", () => {
    const manifest = JSON.parse(readFileSync(
      "scripts/data-review/output/sc-source-manifest.json",
      "utf8",
    ));
    const record = manifest.catalogRecords.find(
      (candidate: { chargeId: string }) => candidate.chargeId === "sc-shoplifting",
    );
    record.provisions[0].content += "\nTAMPERED";
    const directory = mkdtempSync(join(tmpdir(), "south-carolina-manifest-"));
    const manifestPath = join(directory, "manifest.json");
    writeFileSync(manifestPath, JSON.stringify(manifest));
    try {
      expect(() => loadSouthCarolinaAuthorityManifest(manifestPath)).toThrow(
        "Manifest authority provision 1 is not an exact verified South Carolina match",
      );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("uses the existing citation overlay only as input and never promotes its secondary URL", () => {
    const citation = CHARGE_CITATIONS["sc-shoplifting"];
    expect(citation?.citation).toContain("S.C. Code Ann.");
    expect(citation?.sourceUrl ?? "").toContain("justia.com");
    const manifest = loadSouthCarolinaAuthorityManifest();
    const provision = manifest.catalogRecords.find(
      (record) => record.chargeId === "sc-shoplifting",
    )?.provisions[0];
    expect(provision?.sourceUrl).toBe(buildSouthCarolinaSourceUrl("16-13-110"));
    expect(provision?.sourceUrl).not.toContain("justia.com");
    expect(provision?.sourceUrl).not.toContain("openlaws.us");
  });

  it("preserves the previous manifest during an all-transport source outage", async () => {
    const directory = mkdtempSync(join(tmpdir(), "south-carolina-refresh-"));
    const outputPath = join(directory, "sc-source-manifest.json");
    const previous = readFileSync(
      "scripts/data-review/output/sc-source-manifest.json",
      "utf8",
    );
    writeFileSync(outputPath, previous);
    let requestCount = 0;

    try {
      const summary = await refreshSouthCarolinaManifest({
        outputPath,
        fetchImpl: (async () => {
          requestCount++;
          throw new Error("simulated connection reset");
        }) as typeof fetch,
        rateLimitMs: 0,
        retryDelayMs: 0,
      });

      expect(requestCount).toBeGreaterThan(0);
      expect(summary).toMatchObject({
        wroteManifest: false,
        preservedManifest: true,
        officialPageFailures: 0,
        contentContractFailures: 0,
      });
      expect(summary.alert).toMatchObject({
        type: "transport-outage",
        failureKind: "transport",
      });
      expect(readFileSync(outputPath, "utf8")).toBe(previous);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});