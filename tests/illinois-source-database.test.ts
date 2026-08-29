import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { criminalCharges } from "../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../shared/criminal-charge-citations";
import {
  buildIllinoisManifestRecord,
  buildIllinoisSourceDatabaseSeed,
  buildIllinoisSourceKey,
  buildIllinoisSourceUrl,
  parseIllinoisCitation,
  validateIllinoisManifestRecord,
  type IllinoisSourceDocument,
} from "../server/data/illinois-source-database-seed";
import { loadIllinoisAuthorityManifest } from "../server/data/illinois-manifest-loader";
import { extractIllinoisDocument } from "../scripts/data-review/import-illinois-source-database";

const importedAt = new Date("2026-08-28T00:00:00.000Z");

function document(section: string, title: string, subdivision?: string): IllinoisSourceDocument {
  const sourceUrl = buildIllinoisSourceUrl("720", "5", section);
  return {
    chapter: "720",
    act: "5",
    section,
    title,
    text: `(720 ILCS 5/${section})\nSec. ${section}. ${title}.\n${subdivision ?? "(a)"} Complete official statutory text.\n(Source: P.A. 99-1, eff. 1-1-16.)`,
    sourceUrl,
    retrievedAt: importedAt,
    effectiveDateStart: "2016-01-01",
    sourceEvidence: "(Source: P.A. 99-1, eff. 1-1-16.)",
  };
}

describe("Illinois authority manifest", () => {
  it("preserves every catalog row and publishes only exact current ILGA matches", () => {
    const manifest = loadIllinoisAuthorityManifest();
    const seed = buildIllinoisSourceDatabaseSeed(manifest);
    const ilCount = criminalCharges.filter((charge) => charge.jurisdiction === "IL").length;

    expect(ilCount).toBe(116);
    expect(manifest.catalogRecords).toHaveLength(ilCount);
    expect(new Set(manifest.catalogRecords.map((record) => record.chargeId)).size).toBe(ilCount);
    expect(seed.sources).toHaveLength(13);
    expect(seed.snapshots).toHaveLength(13);
    expect(seed.links).toHaveLength(13);
    expect(seed.selectableChargeIds).toHaveLength(13);
    expect(seed.selectableChargeIds).toContain("il-aggravated-assault");
    expect(seed.selectableChargeIds).not.toContain("il-murder-in-the-first-degree");
    expect(seed.selectableChargeIds).not.toContain("il-bank-robbery");
    expect(manifest.catalogRecords.filter((record) =>
      record.disposition === "require_exact_reselection")).toHaveLength(103);
  });

  it("parses exact ILCS identities and constructs per-section ILGA URLs", () => {
    expect(parseIllinoisCitation("720 ILCS 5/9-1(a)(3)")).toEqual([{
      chapter: "720",
      act: "5",
      section: "9-1",
      subdivision: "(a)(3)",
    }]);
    expect(parseIllinoisCitation("720 Ill. Comp. Stat. 5/8-4, 5/9-1")).toEqual([
      { chapter: "720", act: "5", section: "8-4", subdivision: null },
      { chapter: "720", act: "5", section: "9-1", subdivision: null },
    ]);
    expect(parseIllinoisCitation("18 U.S.C. § 2113")).toEqual([]);
    expect(parseIllinoisCitation("MPC § 210.2")).toEqual([]);
    expect(buildIllinoisSourceKey("720", "5", "9-1", "(a)(3)"))
      .toBe("il:statute:720-5/9-1:a_3");
    expect(buildIllinoisSourceUrl("720", "5", "9-1")).toBe(
      "https://www.ilga.gov/legislation/ilcs/documents/072000050K9-1.htm",
    );
  });

  it("extracts the complete official section and rejects missing sections or subdivisions", () => {
    const html = `<html><head><title>720 ILCS 5/12-3</title></head><body>
      <code>(720 ILCS 5/12-3)</code><br>
      <code>Sec. 12-3. Battery. </code><br>
      <code>(a) A person commits battery.</code><br>
      <code>(b) Sentence.</code><br>
      <code>(Source: P.A. 96-1551, eff. 7-1-11.)</code>
    </body></html>`;
    const url = buildIllinoisSourceUrl("720", "5", "12-3");
    expect(extractIllinoisDocument(html, "720", "5", "12-3", url, importedAt, "(a)"))
      .toMatchObject({
        chapter: "720",
        act: "5",
        section: "12-3",
        title: "Battery",
        sourceUrl: url,
        sourceEvidence: expect.stringContaining("Source"),
      });
    expect(extractIllinoisDocument(html, "720", "5", "12-3", url, importedAt, "(c)"))
      .toBeNull();
    expect(extractIllinoisDocument(html.replace("Sec. 12-3. Battery.", "Sec. 12-99. Missing."), "720", "5", "12-3", url, importedAt))
      .toBeNull();
  });

  it("stores official text hashes and withholds mismatched or federal records", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "il-aggravated-assault")!;
    const text = "(720 ILCS 5/12-2)\nSec. 12-2. Aggravated assault.\n(a) Complete official text.";
    const record = buildIllinoisManifestRecord(charge, [{
      ...document("12-2", "Aggravated assault", "(a)"),
      text,
    }], importedAt);
    expect(record.disposition).toBe("retain");
    expect(record.provisions[0]).toMatchObject({
      sourceKey: "il:statute:720-5/12-2",
      citation: "720 ILCS 5/12-2",
      content: text,
      contentHash: createHash("sha256").update(text).digest("hex"),
      hashBasis: "source_content",
    });
    expect(validateIllinoisManifestRecord(record)).toBeNull();

    const wrong = buildIllinoisManifestRecord(charge, [
      document("12-2", "Battery"),
    ], importedAt);
    expect(wrong.disposition).toBe("require_exact_reselection");
    expect(wrong.provisions).toEqual([]);

    const federal = criminalCharges.find((candidate) => candidate.id === "il-bank-robbery")!;
    const federalRecord = buildIllinoisManifestRecord(federal, [], importedAt);
    expect(federalRecord.disposition).toBe("require_exact_reselection");
    expect(federalRecord.provisions).toEqual([]);
  });

  it("rejects a tampered selectable manifest record at load time", () => {
    const manifest = JSON.parse(readFileSync(
      "scripts/data-review/output/il-source-manifest.json",
      "utf8",
    ));
    const record = manifest.catalogRecords.find(
      (candidate: { chargeId: string }) => candidate.chargeId === "il-aggravated-assault",
    );
    record.provisions[0].content += "\nTAMPERED";
    const directory = mkdtempSync(join(tmpdir(), "illinois-manifest-"));
    const manifestPath = join(directory, "manifest.json");
    writeFileSync(manifestPath, JSON.stringify(manifest));
    try {
      expect(() => loadIllinoisAuthorityManifest(manifestPath)).toThrow(
        "Manifest authority provision 1 is not an exact verified Illinois match",
      );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("never promotes the existing secondary citation URL", () => {
    const citation = CHARGE_CITATIONS["il-aggravated-assault"];
    expect(citation?.sourceUrl ?? "").toContain("justia.com");
    const manifest = loadIllinoisAuthorityManifest();
    const provision = manifest.catalogRecords.find(
      (record) => record.chargeId === "il-aggravated-assault",
    )?.provisions[0];
    expect(provision?.sourceUrl).toBe(buildIllinoisSourceUrl("720", "5", "12-2"));
    expect(provision?.sourceUrl).not.toContain("justia.com");
  });
});