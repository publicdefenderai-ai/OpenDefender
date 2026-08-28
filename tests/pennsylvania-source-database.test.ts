import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { criminalCharges } from "../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../shared/criminal-charge-citations";
import { loadPennsylvaniaAuthorityManifest } from "../server/data/pennsylvania-manifest-loader";
import {
  buildPennsylvaniaManifestRecord,
  buildPennsylvaniaSourceDatabaseSeed,
  buildPennsylvaniaSourceKey,
  buildPennsylvaniaSourceUrl,
  parsePennsylvaniaCitation,
  validatePennsylvaniaManifestRecord,
  type PennsylvaniaSourceDocument,
} from "../server/data/pennsylvania-source-database-seed";
import { extractPennsylvaniaDocument } from "../scripts/data-review/import-pennsylvania-source-database";

const importedAt = new Date("2026-08-28T00:00:00.000Z");

function document(section: string, title: string): PennsylvaniaSourceDocument {
  return {
    section,
    title,
    text: `§ ${section}. ${title}.\nA person commits an offense when the statutory elements are met. This is complete official section text for the test.`,
    sourceUrl: buildPennsylvaniaSourceUrl("18", section),
    retrievedAt: importedAt,
    effectiveDateStart: null,
  };
}

describe("Pennsylvania authority manifest", () => {
  it("preserves every Pennsylvania catalog row and fails closed until official text is verified", () => {
    const manifest = loadPennsylvaniaAuthorityManifest();
    const seed = buildPennsylvaniaSourceDatabaseSeed(manifest);
    const count = criminalCharges.filter((charge) => charge.jurisdiction === "PA").length;
    expect(count).toBe(112);
    expect(manifest.catalogRecords).toHaveLength(count);
    expect(new Set(manifest.catalogRecords.map((record) => record.chargeId)).size).toBe(count);
    expect(manifest.catalogRecords.every((record) =>
      record.disposition === "require_exact_reselection" &&
      record.provisions.length === 0)).toBe(true);
    expect(seed.sources).toEqual([]);
    expect(seed.snapshots).toEqual([]);
    expect(seed.links).toEqual([]);
    expect(seed.selectableChargeIds).toEqual([]);
  });

  it("parses consolidated citations and applies Pennsylvania chapter traversal", () => {
    expect(parsePennsylvaniaCitation("18 Pa.C.S. § 2502(a)")).toEqual([
      { title: "18", section: "2502", subdivision: "(a)" },
    ]);
    expect(parsePennsylvaniaCitation("18 Pa. Cons. Stat. §§ 901, 3701")).toEqual([
      { title: "18", section: "901", subdivision: null },
      { title: "18", section: "3701", subdivision: null },
    ]);
    expect(parsePennsylvaniaCitation("35 Pa. Stat. § 780-113(a)(16)")).toEqual([]);
    expect(parsePennsylvaniaCitation("18 U.S.C. § 2113")).toEqual([]);
    expect(buildPennsylvaniaSourceUrl("18", "2502")).toContain("&chpt=25&sctn=2");
    expect(buildPennsylvaniaSourceUrl("18", "3124.1")).toContain("&chpt=31&sctn=24.1");
    expect(buildPennsylvaniaSourceKey("18", "3124.1", "(a)")).toBe("pa:18:3124.1:a");
  });

  it("stores verbatim official text and content hashes for a verified exact mapping", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "pa-aggravated-assault")!;
    const text = "§ 2702. Aggravated assault.\nA person commits an offense when the statutory elements are met.";
    const record = buildPennsylvaniaManifestRecord(charge, [{
      ...document("2702", "Aggravated assault"),
      text,
    }], importedAt);
    expect(record.disposition).toBe("retain");
    expect(record.provisions[0]).toMatchObject({
      sourceKey: "pa:18:2702",
      citation: "18 Pa. Cons. Stat. § 2702",
      content: text,
      hashBasis: "source_content",
    });
    expect(record.provisions[0].contentHash).toBe(createHash("sha256").update(text).digest("hex"));
    expect(buildPennsylvaniaSourceDatabaseSeed({
      jurisdiction: "PA",
      generatedAt: importedAt,
      source: "Pennsylvania General Assembly Consolidated Statutes (legis.state.pa.us)",
      catalogRecords: [record],
    }).sources[0]).toMatchObject({
      publisher: "Pennsylvania General Assembly",
      accessPolicy: "store_text",
      canStoreContent: true,
    });
  });

  it("rejects a tampered citation even when every other authority field is valid", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "pa-aggravated-assault")!;
    const record = buildPennsylvaniaManifestRecord(charge, [document("2702", "Aggravated assault")], importedAt);
    const tampered = {
      ...record,
      provisions: [{ ...record.provisions[0], citation: "18 Pa. Cons. Stat. § 2703" }],
    };
    expect(validatePennsylvaniaManifestRecord(tampered)).toContain("not an exact verified Pennsylvania match");
  });

  it("accepts explicit aliases but withholds mismatches and incomplete compounds", () => {
    const murder = criminalCharges.find((candidate) => candidate.id === "pa-murder-in-the-first-degree")!;
    expect(buildPennsylvaniaManifestRecord(murder, [document("2502", "Murder")], importedAt).disposition)
      .toBe("exact_alias_rename");

    const attempted = criminalCharges.find((candidate) => candidate.id === "pa-attempted-robbery")!;
    const complete = buildPennsylvaniaManifestRecord(
      attempted,
      [document("901", "Criminal attempt"), document("3701", "Robbery")],
      importedAt,
    );
    expect(complete.disposition).toBe("require_exact_reselection");
    expect(complete.provisions).toEqual([]);
    expect(buildPennsylvaniaManifestRecord(attempted, [document("901", "Criminal attempt")], importedAt).provisions)
      .toEqual([]);

    const federal = criminalCharges.find((candidate) => candidate.id === "pa-bank-robbery")!;
    expect(buildPennsylvaniaManifestRecord(federal, [], importedAt).disposition).toBe("require_exact_reselection");
  });

  it("extracts a section from official HTML and rejects missing or error pages", () => {
    const html = `<html><body><table><tr><td>§ 2502. Murder.</td></tr><tr><td>(a) A person is guilty of murder.</td></tr></table></body></html>`;
    expect(extractPennsylvaniaDocument(
      html,
      "2502",
      buildPennsylvaniaSourceUrl("18", "2502"),
      importedAt,
    )).toMatchObject({ section: "2502", title: "Murder" });
    expect(extractPennsylvaniaDocument(html, "2503", "https://example.invalid", importedAt)).toBeNull();
    expect(extractPennsylvaniaDocument(
      "<html><body>Page cannot be found</body></html>",
      "2502",
      "https://example.invalid",
      importedAt,
    )).toBeNull();
  });

  it("keeps the official wrapper URL canonical when section content comes from a frame", () => {
    const wrapperUrl = buildPennsylvaniaSourceUrl("18", "2502");
    const frameUrl = "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?frame=2502";
    const parsed = extractPennsylvaniaDocument(
      "<html><body><p>§ 2502. Murder.</p><p>(a) A person is guilty of murder under these statutory elements and penalties.</p></body></html>",
      "2502",
      frameUrl,
      importedAt,
    );
    expect(parsed).toMatchObject({ sourceUrl: frameUrl });
    const record = buildPennsylvaniaManifestRecord(
      criminalCharges.find((candidate) => candidate.id === "pa-murder-in-the-first-degree")!,
      [{ ...parsed!, sourceUrl: wrapperUrl }],
      importedAt,
    );
    expect(record.provisions[0].sourceUrl).toBe(wrapperUrl);
    expect(validatePennsylvaniaManifestRecord(record)).toBeNull();
  });

  it("uses the existing citation overlay as input without trusting its secondary source URLs", () => {
    expect(CHARGE_CITATIONS["pa-sexual-assault-in-the-second-degree"]?.sourceUrl)
      .toContain("openlaws.us");
    expect(parsePennsylvaniaCitation(
      CHARGE_CITATIONS["pa-sexual-assault-in-the-second-degree"]?.citation ?? "",
    )).toEqual([{ title: "18", section: "3124.1", subdivision: null }]);
  });
});