import { describe, expect, it } from "vitest";
import {
  criminalCharges,
  getChargeById,
  getChargesByJurisdiction,
  getVerifiedSourceUrl,
} from "../shared/criminal-charges";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import {
  buildTexasManifestRecord,
  buildTexasSourceDatabaseSeed,
  type TexasSourceDocument,
} from "../server/data/texas-source-database-seed";
import { extractLatestEffectiveDate } from "../scripts/data-review/import-texas-source-database";

const importedAt = new Date("2026-08-28T00:00:00.000Z");

function document(code: string, section: string, title: string): TexasSourceDocument {
  return {
    code,
    section,
    title,
    text: `Sec. ${section}. ${title}.\nA person commits an offense when the statutory elements are met.`,
    sourceUrl: `https://tcss.legis.texas.gov/resources/${code}/htm/${code}.${section.split(".")[0]}.htm#${section}`,
    retrievedAt: importedAt,
    effectiveDateStart: "September 1, 2025",
  };
}

describe("Texas authority manifest", () => {
  it("commits every Texas catalog row and preserves fail-closed dispositions", () => {
    const manifest = loadTexasAuthorityManifest();
    const seed = buildTexasSourceDatabaseSeed(manifest);
    const txCount = criminalCharges.filter((charge) => charge.jurisdiction === "TX").length;

    expect(manifest.catalogRecords).toHaveLength(txCount);
    expect(new Set(manifest.catalogRecords.map((record) => record.chargeId)).size).toBe(txCount);
    expect(seed.sources).toHaveLength(30);
    expect(seed.snapshots).toHaveLength(33);
    expect(seed.links).toHaveLength(33);
    expect(seed.selectableChargeIds).toHaveLength(33);
    expect(seed.selectableChargeIds).toContain("tx-aggravated-assault");
    expect(seed.selectableChargeIds).not.toContain("tx-bank-robbery");
    expect(seed.selectableChargeIds).not.toContain("tx-wire-fraud");
    expect(manifest.catalogRecords.filter((record) =>
      record.disposition === "require_exact_reselection")).toHaveLength(78);
  });

  it("stores TCSS text, hashes, currentness evidence, and official source identity", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "tx-aggravated-assault")!;
    const record = buildTexasManifestRecord(
      charge,
      [document("PE", "22.02", "AGGRAVATED ASSAULT.")],
      importedAt,
    );
    const seed = buildTexasSourceDatabaseSeed({
      jurisdiction: "TX",
      generatedAt: importedAt,
      source: "Texas Legislative Council TCSS static HTML (tcss.legis.texas.gov/resources)",
      catalogRecords: [record],
    });

    expect(record.disposition).toBe("retain");
    expect(record.provisions[0]).toMatchObject({
      section: "22.02",
      officialTitle: "AGGRAVATED ASSAULT.",
      content: expect.stringContaining("statutory elements"),
      hashBasis: "source_content",
      effectiveDateStart: "September 1, 2025",
    });
    expect(seed.sources[0]).toMatchObject({
      publisher: "Texas Legislative Council TCSS",
      canonicalUrl: "https://tcss.legis.texas.gov/resources/PE/htm/PE.22.htm#22.02",
      accessPolicy: "store_text",
      canStoreContent: true,
    });
    expect(seed.selectableChargeIds).toEqual(["tx-aggravated-assault"]);
  });

  it("extracts the latest complete effective date from amended TCSS text", () => {
    expect(extractLatestEffectiveDate(
      "Acts 1973, eff. Jan. 1, 1974. Acts 2023, eff. September 1, 2023. Acts 2025, eff. September 1, 2025.",
    )).toBe("September 1, 2025");
    expect(extractLatestEffectiveDate("No effective date is included.")).toBeNull();
  });

  it("never commits truncated effective-date fragments", () => {
    const fullDate = /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}$/;
    const retained = loadTexasAuthorityManifest().catalogRecords
      .filter((record) => record.disposition === "retain" || record.disposition === "exact_alias_rename");
    for (const record of retained) {
      for (const provision of record.provisions) {
        if (provision.effectiveDateStart) expect(provision.effectiveDateStart).toMatch(fullDate);
      }
    }
    expect(retained.find((record) => record.chargeId === "tx-aggravated-assault")
      ?.provisions[0]?.effectiveDateStart).toBe("September 1, 2025");
  });

  it("rejects federal citations, missing provisions, and unreviewed title mismatches", () => {
    const federalCharge = criminalCharges.find((candidate) => candidate.id === "tx-wire-fraud")!;
    const missing = buildTexasManifestRecord(federalCharge, [], importedAt);
    expect(missing.disposition).toBe("require_exact_reselection");
    expect(missing.provisions).toEqual([]);

    const mismatchCharge = criminalCharges.find((candidate) => candidate.id === "tx-aggravated-assault")!;
    const mismatch = buildTexasManifestRecord(
      mismatchCharge,
      [document("PE", "22.02", "A DIFFERENT TEXAS OFFENSE.")],
      importedAt,
    );
    expect(mismatch.disposition).toBe("require_exact_reselection");
    expect(mismatch.provisions).toEqual([]);
  });

  it("exposes official names for reviewed aliases and TCSS URLs in the shared catalog helpers", () => {
    expect(getChargeById("tx-involuntary-manslaughter")?.name).toBe("Manslaughter");
    expect(getChargeById("tx-identity-theft")?.name)
      .toBe("Fraudulent Use or Possession of Identifying Information");
    expect(getChargesByJurisdiction("TX").find((charge) =>
      charge.id === "tx-auto-burglary")?.name).toBe("Burglary of Vehicles");
    expect(getVerifiedSourceUrl(getChargeById("tx-aggravated-assault")!))
      .toBe("https://tcss.legis.texas.gov/resources/PE/htm/PE.22.htm#22.02");
  });
});