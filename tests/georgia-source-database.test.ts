import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { criminalCharges } from "../shared/criminal-charges";
import {
  buildGeorgiaManifestRecord,
  buildGeorgiaSourceDatabaseSeed,
  buildGeorgiaSourceKey,
  buildGeorgiaOfficialDocumentId,
  buildGeorgiaOfficialSectionUrl,
  parseGeorgiaCitation,
  validateGeorgiaManifestRecord,
} from "../server/data/georgia-source-database-seed";
import { loadGeorgiaAuthorityManifest } from "../server/data/georgia-manifest-loader";
import {
  buildGeorgiaAuthorityManifest,
  GEORGIA_OFFICIAL_SOURCE_LIMITATION,
} from "../scripts/data-review/import-georgia-source-database";

const importedAt = new Date("2026-08-29T00:00:00.000Z");

describe("Georgia authority manifest", () => {
  it("preserves every Georgia catalog row and publishes no unsupported authority", () => {
    const manifest = loadGeorgiaAuthorityManifest();
    const seed = buildGeorgiaSourceDatabaseSeed(manifest);
    const georgiaCount = criminalCharges.filter((charge) => charge.jurisdiction === "GA").length;

    expect(georgiaCount).toBe(129);
    expect(manifest.catalogRecords).toHaveLength(georgiaCount);
    expect(new Set(manifest.catalogRecords.map((record) => record.chargeId)).size).toBe(georgiaCount);
    expect(manifest.catalogRecords.every((record) =>
      record.disposition === "require_exact_reselection" &&
      record.provisions.length === 0 &&
      record.error === GEORGIA_OFFICIAL_SOURCE_LIMITATION,
    )).toBe(true);
    expect(seed.sources).toHaveLength(0);
    expect(seed.snapshots).toHaveLength(0);
    expect(seed.links).toHaveLength(0);
    expect(seed.selectableChargeIds).toHaveLength(0);
  });

  it("parses only one exact Georgia Code section identity", () => {
    expect(parseGeorgiaCitation("O.C.G.A. § 16-5-1")).toEqual([
      { section: "16-5-1", subdivision: null },
    ]);
    expect(parseGeorgiaCitation("Ga. Code Ann. § 16-5-1(b)")).toEqual([
      { section: "16-5-1", subdivision: "(b)" },
    ]);
    expect(parseGeorgiaCitation("O.C.G.A. §§ 16-5-1, 16-5-2")).toEqual([
      { section: "16-5-1", subdivision: null },
      { section: "16-5-2", subdivision: null },
    ]);
    expect(parseGeorgiaCitation("18 U.S.C. § 2113")).toEqual([]);
    expect(parseGeorgiaCitation("MPC § 5.01 / GA attempt statute")).toEqual([]);
    expect(buildGeorgiaSourceKey("16-5-1", "(b)")).toBe("ga:statute:16-5-1:b");
  });

  it("withholds federal, inferred, compound, mismatched, and secondary-only records", () => {
    const federal = criminalCharges.find((charge) => charge.id === "ga-bank-robbery")!;
    expect(buildGeorgiaManifestRecord(federal, [], importedAt).disposition)
      .toBe("require_exact_reselection");

    const compound = criminalCharges.find((charge) =>
      charge.code.includes("MPC") || charge.id.includes("attempt"),
    )!;
    expect(buildGeorgiaManifestRecord(compound, [], importedAt).disposition)
      .toBe("require_exact_reselection");

    const ordinary = criminalCharges.find((charge) => charge.id === "ga-murder-in-the-first-degree")!;
    const secondaryDocument = {
      section: "16-5-1",
      title: ordinary.name,
      text: "secondary summary",
      sourceUrl: "https://law.justia.com/codes/georgia/section-16-5-1/",
      retrievedAt: importedAt,
      effectiveDateStart: "2026-01-01",
    };
    const secondary = buildGeorgiaManifestRecord(ordinary, [secondaryDocument], importedAt);
    expect(secondary.disposition).toBe("require_exact_reselection");
    expect(secondary.provisions).toEqual([]);
    expect(validateGeorgiaManifestRecord(secondary)).toBeNull();

    const mismatch = buildGeorgiaManifestRecord(ordinary, [{
      ...secondaryDocument,
      sourceUrl: "https://www.legis.ga.gov/",
      title: "Aggravated assault",
    }], importedAt);
    expect(mismatch.disposition).toBe("require_exact_reselection");
  });

  it("requires an exact section contract, complete-text attestation, and currentness evidence", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "ga-murder-in-the-first-degree")!;
    const validDocument = {
      section: "16-5-1",
      title: charge.name,
      text: "Complete official section text.",
      sourceUrl: buildGeorgiaOfficialSectionUrl("16-5-1"),
      retrievedAt: importedAt,
      effectiveDateStart: "2026-01-01",
      completeText: true,
      officialDocumentId: buildGeorgiaOfficialDocumentId("16-5-1"),
    };
    expect(buildGeorgiaManifestRecord(charge, [validDocument], importedAt).disposition)
      .toBe("retain");

    expect(buildGeorgiaManifestRecord(charge, [{
      ...validDocument,
      sourceUrl: "https://www.legis.ga.gov/",
    }], importedAt).disposition).toBe("require_exact_reselection");
    expect(buildGeorgiaManifestRecord(charge, [{
      ...validDocument,
      section: "16-5-2",
    }], importedAt).disposition).toBe("require_exact_reselection");
    expect(buildGeorgiaManifestRecord(charge, [{
      ...validDocument,
      completeText: false,
    }], importedAt).disposition).toBe("require_exact_reselection");
    expect(buildGeorgiaManifestRecord(charge, [{
      ...validDocument,
      effectiveDateStart: null,
    }], importedAt).disposition).toBe("require_exact_reselection");
  });

  it("rejects tampered selectable records if a future official contract is added", () => {
    const manifest = JSON.parse(readFileSync(
      "scripts/data-review/output/ga-source-manifest.json",
      "utf8",
    ));
    const record = manifest.catalogRecords[0];
    record.disposition = "retain";
    record.apiStatus = "verified";
    record.canonicalTitle = "Murder in the First Degree";
    record.provisions = [{
      sourceKey: "ga:statute:16-5-1",
      lawId: "OCGA",
      section: "16-5-1",
      citation: "Ga. Code Ann. § 16-5-1",
      officialTitle: "Murder in the First Degree",
      sourceUrl: buildGeorgiaOfficialSectionUrl("16-5-1"),
      content: "official text",
      contentHash: "not-a-hash",
      hashBasis: "source_content",
      retrievedAt: importedAt.toISOString(),
      effectiveDateStart: "2026-01-01",
      effectiveDateEnd: null,
      supportRole: "offense",
      subdivision: null,
      metadata: {
        officialDocumentId: buildGeorgiaOfficialDocumentId("16-5-1"),
        completeText: true,
      },
    }];
    const directory = mkdtempSync(join(tmpdir(), "georgia-manifest-"));
    const manifestPath = join(directory, "manifest.json");
    writeFileSync(manifestPath, JSON.stringify(manifest));
    try {
      expect(() => loadGeorgiaAuthorityManifest(manifestPath)).toThrow(
        "Manifest authority provision 1 is not an exact verified Georgia match",
      );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});