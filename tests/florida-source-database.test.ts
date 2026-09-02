import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  criminalCharges,
  getChargeById,
  getVerifiedSourceUrl,
} from "../shared/criminal-charges";
import { loadFloridaAuthorityManifest } from "../server/data/florida-manifest-loader";
import {
  buildFloridaManifestRecord,
  buildFloridaSourceDatabaseSeed,
  type FloridaSourceDocument,
} from "../server/data/florida-source-database-seed";
import { extractFloridaDocument } from "../scripts/data-review/import-florida-source-database";
import { CHARGE_CITATIONS } from "../shared/criminal-charge-citations";

const importedAt = new Date("2026-08-28T00:00:00.000Z");

function document(section: string, title: string): FloridaSourceDocument {
  return {
    section,
    title,
    text: `F.S. ${section}. ${title}.\nA person commits an offense when the statutory elements are met.`,
    sourceUrl: `https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0782/Sections/0782.04.html`,
    retrievedAt: importedAt,
    effectiveDateStart: null,
  };
}

describe("Florida authority manifest", () => {
  it("commits every Florida catalog row and preserves fail-closed dispositions", () => {
    const manifest = loadFloridaAuthorityManifest();
    const seed = buildFloridaSourceDatabaseSeed(manifest);
    const flCount = criminalCharges.filter((charge) => charge.jurisdiction === "FL").length;

    expect(manifest.catalogRecords).toHaveLength(flCount);
    expect(new Set(manifest.catalogRecords.map((record) => record.chargeId)).size).toBe(flCount);
    expect(manifest.catalogRecords).toHaveLength(117);
    expect(seed.sources).toHaveLength(25);
    expect(seed.snapshots).toHaveLength(25);
    expect(seed.links).toHaveLength(25);
    expect(seed.selectableChargeIds).toHaveLength(25);
    expect(seed.selectableChargeIds).toContain("fl-aggravated-assault");
    const robbery = manifest.catalogRecords.find(
      (record) => record.chargeId === "fl-robbery-in-the-first-degree",
    );
    expect(robbery).toMatchObject({
      catalogCode: "812.13(2)(a)",
      disposition: "exact_alias_rename",
      canonicalTitle: "Robbery",
    });
    expect(seed.selectableChargeIds).toContain("fl-robbery-in-the-first-degree");
    expect(CHARGE_CITATIONS["fl-robbery-in-the-first-degree"]).toMatchObject({
      instructionRef: "FSJI 15.1",
      instructionUrl: expect.any(String),
    });
    expect(seed.selectableChargeIds).not.toEqual(expect.arrayContaining([
      "fl-attempted-murder",
      "fl-noise-violation",
      "fl-bank-robbery",
      "fl-resisting-arrest",
      "fl-sexual-assault-in-the-second-degree",
    ]));
    expect(manifest.catalogRecords.filter((record) =>
      record.disposition === "require_exact_reselection")).toHaveLength(92);
  });

  it("stores official Online Sunshine identity, raw-text hashes, and pending review metadata", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "fl-aggravated-assault")!;
    const text = "F.S. 784.021. Aggravated assault.\nA person commits an offense.";
    const record = buildFloridaManifestRecord(
      charge,
      [{
        ...document("784.021", "Aggravated assault"),
        text,
      }],
      importedAt,
    );
    const seed = buildFloridaSourceDatabaseSeed({
      jurisdiction: "FL",
      generatedAt: importedAt,
      source: "Florida Legislature Online Sunshine (leg.state.fl.us/statutes)",
      catalogRecords: [record],
    });

    expect(record.disposition).toBe("retain");
    expect(record.provisions[0]).toMatchObject({
      section: "784.021",
      officialTitle: "Aggravated assault",
      content: text,
      hashBasis: "source_content",
    });
    expect(record.provisions[0].contentHash).toBe(
      createHash("sha256").update(text).digest("hex"),
    );
    expect(seed.sources[0]).toMatchObject({
      publisher: "Florida Legislature Online Sunshine",
      canonicalUrl: expect.stringContaining("leg.state.fl.us/statutes"),
      accessPolicy: "store_text",
      canStoreContent: true,
    });
    expect(seed.snapshots[0].metadata.attorneyReview).toBe("pending");
    expect(seed.selectableChargeIds).toEqual(["fl-aggravated-assault"]);
  });

  it("accepts explicit aliases and verifies every provision in a compound charge", () => {
    const aliasCharge = criminalCharges.find((candidate) =>
      candidate.id === "fl-murder-in-the-first-degree")!;
    const alias = buildFloridaManifestRecord(
      aliasCharge,
      [document("782.04", "Murder")],
      importedAt,
    );
    expect(alias.disposition).toBe("exact_alias_rename");
    expect(alias.provisions).toHaveLength(1);

    const bareCode = criminalCharges.find((candidate) =>
      candidate.id === "fl-bank-robbery")!;
    const bareCodeRecord = buildFloridaManifestRecord(
      bareCode,
      [document("812.13", "Robbery")],
      importedAt,
    );
    expect(bareCodeRecord.disposition).toBe("require_exact_reselection");
    expect(bareCodeRecord.provisions).toEqual([]);

    const attemptedCharge = criminalCharges.find((candidate) =>
      candidate.id === "fl-attempted-murder")!;
    const attempted = buildFloridaManifestRecord(
      attemptedCharge,
      [
        document("777.04", "Attempts, solicitation, and conspiracy"),
        document("782.04", "Murder"),
      ],
      importedAt,
    );
    expect(attempted.disposition).toBe("require_exact_reselection");
    expect(attempted.provisions).toEqual([]);

    const incompleteAttempt = buildFloridaManifestRecord(
      attemptedCharge,
      [document("777.04", "Attempts, solicitation, and conspiracy")],
      importedAt,
    );
    expect(incompleteAttempt.disposition).toBe("require_exact_reselection");
    expect(incompleteAttempt.provisions).toEqual([]);
  });

  it("withholds missing and unreviewed citations instead of guessing", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "fl-aggravated-assault")!;
    const missing = buildFloridaManifestRecord(charge, [], importedAt);
    expect(missing.disposition).toBe("require_exact_reselection");
    expect(missing.provisions).toEqual([]);

    const mismatch = buildFloridaManifestRecord(
      charge,
      [document("784.021", "A different Florida offense")],
      importedAt,
    );
    expect(mismatch.disposition).toBe("require_exact_reselection");
    expect(mismatch.provisions).toEqual([]);
  });

  it("withholds catalog codes that point to a different offense or statute", () => {
    const mismatches = [
      ["fl-bank-robbery", "812.13", "Robbery"],
      ["fl-resisting-arrest", "843.02", "Resisting officer without violence to his or her person"],
      ["fl-sexual-assault-in-the-second-degree", "800.04", "Lewd or lascivious offenses committed upon or in the presence of persons less than 16 years of age"],
      ["fl-petty-theft", "812.014", "Theft"],
      ["fl-assault-on-peace-officer", "784.07", "Assault or battery of law enforcement officers and other specified personnel; reclassification of offenses; minimum sentences"],
      ["fl-embezzlement", "812.014", "Theft"],
    ] as const;
    for (const [chargeId, section, title] of mismatches) {
      const charge = criminalCharges.find((candidate) => candidate.id === chargeId)!;
      const record = buildFloridaManifestRecord(charge, [document(section, title)], importedAt);
      expect(record.disposition, chargeId).toBe("require_exact_reselection");
      expect(record.provisions, chargeId).toEqual([]);
    }
  });

  it("does not trust a tampered selectable manifest record at load time", () => {
    const manifest = loadFloridaAuthorityManifest();
    const tampered = JSON.parse(JSON.stringify(manifest));
    const record = tampered.catalogRecords.find(
      (candidate: { chargeId: string }) => candidate.chargeId === "fl-aggravated-assault",
    );
    record.provisions[0].section = "784.999";
    const directory = mkdtempSync(join(tmpdir(), "florida-manifest-"));
    const path = join(directory, "manifest.json");
    writeFileSync(path, JSON.stringify(tampered));
    try {
      expect(() => loadFloridaAuthorityManifest(path)).toThrow(
        "Manifest authority provision 1 is not an exact verified match",
      );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("parses Online Sunshine section HTML and exposes the official catalog link", () => {
    const html = `<div class="Section"><span class="SectionNumber">784.021&#x2003;</span><span class="Catchline"><span xml:space="preserve" class="CatchlineText">Aggravated assault.</span></span><span class="SectionBody"><div class="Subsection"><span class="Number">(1)&#x2003;</span><span class="Text">An assault:</span><div class="Paragraph"><span class="Number">(a)&#x2003;</span><span class="Text">With a deadly weapon.</span></div></div></span><div class="History"><span class="HistoryText">s. 1, ch. 1.</span></div></div></body>`;
    const parsed = extractFloridaDocument(
      html,
      "784.021",
      "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute",
      importedAt,
    );
    expect(parsed).toMatchObject({
      section: "784.021",
      title: "Aggravated assault",
      sourceUrl: expect.stringContaining("leg.state.fl.us"),
    });
    expect(extractFloridaDocument(
      html,
      "784.021",
      "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute",
      importedAt,
      "(1)(a)",
    )).not.toBeNull();
    expect(extractFloridaDocument(
      html,
      "784.021",
      "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute",
      importedAt,
      "(2)(a)",
    )).toBeNull();

    const nestedHtml = `<div class="Section"><span class="SectionNumber">812.014&#x2003;</span><span class="Catchline"><span class="CatchlineText">Theft.</span></span><div class="Subsection"><div class="Paragraph"><div class="SubParagraph"><span class="Number">(2)(a)1.&#x2003;</span><span class="Text">Nested provision.</span></div></div></div></div></body>`;
    expect(extractFloridaDocument(
      nestedHtml,
      "812.014",
      "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute",
      importedAt,
      "(2)(a)",
    )).not.toBeNull();
    expect(extractFloridaDocument(
      nestedHtml,
      "812.014",
      "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute",
      importedAt,
      "(2)(b)",
    )).toBeNull();
    expect(getVerifiedSourceUrl(getChargeById("fl-aggravated-assault")!))
      .toBe(CHARGE_CITATIONS["fl-aggravated-assault"]?.sourceUrl);
  });
});