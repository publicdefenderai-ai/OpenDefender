import { describe, expect, it } from "vitest";
import { criminalCharges } from "../shared/criminal-charges";
import { getChargeById, getChargesByJurisdiction } from "../shared/criminal-charges";
import { loadNewYorkAuthorityManifest } from "../server/data/new-york-manifest-loader";
import {
  buildNewYorkSourceDatabaseSeed,
  manifestRecordFromDocuments,
  buildPlaceholderNewYorkManifest,
  type NewYorkApiDocument,
  type NewYorkAuthorityManifest,
} from "../server/data/new-york-source-database-seed";

const importedAt = new Date("2026-08-27T20:00:00.000Z");

function document(
  lawId: string,
  section: string,
  title: string,
): NewYorkApiDocument {
  return {
    lawId,
    section,
    title,
    lawName: "New York Penal Law",
    text: `§ ${section} ${title}.\nA person is guilty when the statutory elements are met.`,
    activeDate: "2025-01-01",
    publishedDates: ["2025-01-01", "2026-01-01"],
    sourceUrl: `https://www.nysenate.gov/legislation/laws/${lawId}/${section}`,
    retrievedAt: importedAt,
  };
}

function manifest(...records: ReturnType<typeof manifestRecordFromDocuments>[]): NewYorkAuthorityManifest {
  return {
    jurisdiction: "NY",
    generatedAt: importedAt,
    source: "NY Open Legislation API (legislation.nysenate.gov)",
    catalogRecords: records,
  };
}

describe("New York authority manifest", () => {
  it("accounts for every catalog row, including placeholders", () => {
    const placeholder = buildPlaceholderNewYorkManifest(importedAt);
    expect(placeholder.catalogRecords).toHaveLength(
      criminalCharges.filter((charge) => charge.jurisdiction === "NY").length,
    );
    expect(new Set(placeholder.catalogRecords.map((record) => record.chargeId)).size).toBe(121);
    expect(placeholder.catalogRecords.every((record) =>
      record.disposition === "require_exact_reselection",
    )).toBe(true);
  });

  it("stores official text, currentness evidence, and auditable legal-field bases", () => {
    const charge = criminalCharges.find((candidate) =>
      candidate.id === "ny-possession-of-controlled-substance-third-degree",
    )!;
    const record = manifestRecordFromDocuments(
      charge,
      [document("PEN", "220.16", "Criminal possession of a controlled substance in the third degree")],
      importedAt,
    );
    const seed = buildNewYorkSourceDatabaseSeed(manifest(record));

    expect(record.disposition).toBe("retain");
    expect(record.provisions[0]).toMatchObject({
      section: "220.16",
      officialTitle: "Criminal possession of a controlled substance in the third degree",
      content: expect.stringContaining("statutory elements"),
      hashBasis: "source_content",
      effectiveDateStart: "2025-01-01",
    });
    expect(record.provisions[0].metadata).toMatchObject({
      elements: { basis: "verbatim_official_text" },
      mentalState: { basis: "verbatim_official_text" },
      grading: { basis: "verbatim_official_text" },
      penalty: { basis: "verbatim_official_text" },
      currentnessEvidence: {
        publishedDates: ["2025-01-01", "2026-01-01"],
      },
      attorneyReview: "pending",
    });
    expect(seed.sources[0]).toMatchObject({
      accessPolicy: "store_text",
      canStoreContent: true,
      lastRetrievedAt: importedAt,
      lastCheckedAt: importedAt,
    });
    expect(seed.selectableChargeIds).toEqual([charge.id]);
  });

  it("withholds compound attempts until the target offense mapping is exact", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "ny-attempted-murder")!;
    const record = manifestRecordFromDocuments(
      charge,
      [
        document("PEN", "110.00", "Attempt to commit a crime"),
        document("PEN", "125.25", "Murder in the second degree"),
      ],
      importedAt,
    );
    const seed = buildNewYorkSourceDatabaseSeed(manifest(record));
    expect(record.disposition).toBe("require_exact_reselection");
    expect(record.provisions).toEqual([]);
    expect(seed.selectableChargeIds).toEqual([]);
    expect(seed.links).toEqual([]);
  });

  it("withholds a compound charge when any required provision is unavailable", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "ny-attempted-murder")!;
    const record = manifestRecordFromDocuments(
      charge,
      [document("PEN", "110.00", "Attempt to commit a crime"), null],
      importedAt,
    );
    const seed = buildNewYorkSourceDatabaseSeed(manifest(record));

    expect(record.disposition).toBe("require_exact_reselection");
    expect(record.provisions).toEqual([]);
    expect(seed.selectableChargeIds).toEqual([]);
    expect(seed.links).toEqual([]);
  });

  it("fails closed on source errors and known mismatched labels", () => {
    const failedCharge = criminalCharges.find((candidate) => candidate.id === "ny-wire-fraud")!;
    const mismatchCharge = criminalCharges.find((candidate) => candidate.id === "ny-auto-burglary")!;
    const failed = manifestRecordFromDocuments(failedCharge, [], importedAt);
    const mismatch = manifestRecordFromDocuments(
      mismatchCharge,
      [document("PEN", "140.15", "Criminal trespass in the second degree")],
      importedAt,
    );
    const seed = buildNewYorkSourceDatabaseSeed(manifest(failed, mismatch));

    expect(failed.disposition).toBe("require_exact_reselection");
    expect(mismatch.disposition).toBe("require_exact_reselection");
    expect(seed.selectableChargeIds).toEqual([]);
    expect(seed.links).toEqual([]);
    expect(getChargeById("ny-auto-burglary")).toBeUndefined();
    expect(getChargesByJurisdiction("NY").some((candidate) => candidate.id === "ny-auto-burglary")).toBe(false);
  });

  it("does not accept an unreviewed title mismatch as an alias", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "ny-grand-theft-in-the-first-degree")!;
    const record = manifestRecordFromDocuments(
      charge,
      [document("PEN", "190.65", "A different offense")],
      importedAt,
    );

    expect(record.disposition).toBe("require_exact_reselection");
    expect(record.provisions).toEqual([]);
  });

  it("withholds aliases whose mapped provisions do not preserve the charged offense", () => {
    const riskyIds = [
      "ny-bank-robbery",
      "ny-felon-in-possession-of-firearm",
      "ny-attempted-murder",
      "ny-attempted-robbery",
      "ny-attempted-sexual-assault",
    ];
    const committed = loadNewYorkAuthorityManifest();
    const records = new Map(committed.catalogRecords.map((record) => [record.chargeId, record]));

    for (const id of riskyIds) {
      expect(records.get(id)?.disposition, `${id} must fail closed`).toBe("require_exact_reselection");
      expect(records.get(id)?.provisions, `${id} must not publish incomplete provisions`).toEqual([]);
      expect(getChargeById(id), `${id} must not be directly selectable`).toBeUndefined();
    }
  });

  it("does not publish a citation-only change onto an old current snapshot", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "ny-possession-of-controlled-substance-third-degree")!;
    const record = manifestRecordFromDocuments(
      charge,
      [document("PEN", "220.16", "Criminal possession of a controlled substance in the third degree")],
      importedAt,
    );
    const changed = {
      ...record,
      provisions: record.provisions.map((provision) => ({
        ...provision,
        citation: "N.Y. Penal Law § 220.16(a)",
        metadata: {
          ...provision.metadata,
          fingerprint: "citation-only-change",
        },
      })),
    };
    const seed = buildNewYorkSourceDatabaseSeed(manifest(changed));

    expect(seed.links[0].citation).toBe("N.Y. Penal Law § 220.16(a)");
    expect(seed.snapshots[0].metadata.fingerprint).toBe("citation-only-change");
  });

  it("returns official titles for explicit alias/rename records", () => {
    expect(getChargeById("ny-grand-theft-in-the-first-degree")?.name)
      .toBe("Grand larceny in the first degree");
    expect(getChargeById("ny-voluntary-manslaughter")?.name)
      .toBe("Manslaughter in the first degree");
    expect(getChargeById("ny-possession-of-controlled-substance-third-degree")?.name)
      .toBe("Criminal Possession of a Controlled Substance in the Third Degree");
  });

  it("keeps NYC records reference-only and never uses OpenLaws", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "ny-curfew-violation")!;
    const record = manifestRecordFromDocuments(charge, [], importedAt);
    const seed = buildNewYorkSourceDatabaseSeed(manifest(record));
    expect(record.disposition).toBe("retain");
    expect(seed.sources[0]).toMatchObject({
      accessPolicy: "reference_only",
      canStoreContent: false,
      lastRetrievedAt: null,
    });
    expect(JSON.stringify(seed).toLowerCase()).not.toContain("openlaws");
  });
});