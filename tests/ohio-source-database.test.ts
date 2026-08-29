import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { criminalCharges } from "../shared/criminal-charges";
import {
  buildOhioManifestRecord,
  buildOhioSourceDatabaseSeed,
  buildOhioSourceKey,
  buildOhioSourceUrl,
  parseOhioCitation,
  validateOhioManifestRecord,
  type OhioSourceDocument,
} from "../server/data/ohio-source-database-seed";
import { loadOhioAuthorityManifest } from "../server/data/ohio-manifest-loader";
import { extractOhioDocument } from "../scripts/data-review/import-ohio-source-database";

const importedAt = new Date("2026-08-28T00:00:00.000Z");

function document(section: string, title: string, body = "(A) Complete official statutory text."): OhioSourceDocument {
  const sourceUrl = buildOhioSourceUrl(section);
  return {
    section,
    title,
    text: `Section ${section} | ${title}.\nEffective: 2026-01-01\n${body}`,
    sourceUrl,
    retrievedAt: importedAt,
    effectiveDateStart: "2026-01-01",
  };
}

describe("Ohio authority manifest", () => {
  it("preserves every Ohio catalog row and publishes only exact current matches", () => {
    const manifest = loadOhioAuthorityManifest();
    const seed = buildOhioSourceDatabaseSeed(manifest);
    const ohioCount = criminalCharges.filter((charge) => charge.jurisdiction === "OH").length;

    expect(ohioCount).toBe(115);
    expect(manifest.catalogRecords).toHaveLength(ohioCount);
    expect(new Set(manifest.catalogRecords.map((record) => record.chargeId)).size).toBe(ohioCount);
    expect(seed.sources).toHaveLength(13);
    expect(seed.snapshots).toHaveLength(13);
    expect(seed.links).toHaveLength(13);
    expect(seed.selectableChargeIds).toHaveLength(13);
    expect(seed.selectableChargeIds).toContain("oh-aggravated-assault");
    expect(seed.selectableChargeIds).toContain("oh-criminal-trespass");
    expect(seed.selectableChargeIds).not.toContain("oh-murder-in-the-first-degree");
    expect(seed.selectableChargeIds).not.toContain("oh-bank-robbery");
    expect(manifest.catalogRecords.filter((record) =>
      record.disposition === "require_exact_reselection")).toHaveLength(102);
  });

  it("parses only exact Ohio Revised Code identities", () => {
    expect(parseOhioCitation("Ohio Rev. Code Ann. § 2911.21(A)(1)")).toEqual([{
      section: "2911.21",
      subdivision: "(A)(1)",
    }]);
    expect(parseOhioCitation("Ohio Rev. Code Ann. §§ 2923.02, 2911.02")).toEqual([
      { section: "2923.02", subdivision: null },
      { section: "2911.02", subdivision: null },
    ]);
    expect(parseOhioCitation("18 U.S.C. § 2113")).toEqual([]);
    expect(parseOhioCitation("MPC § 5.01 / OH attempt statute")).toEqual([]);
    expect(buildOhioSourceKey("2911.21", "(A)(1)")).toBe("oh:statute:2911.21:A_1");
    expect(buildOhioSourceUrl("2911.21")).toBe(
      "https://codes.ohio.gov/ohio-revised-code/section-2911.21",
    );
  });

  it("extracts the official catchline, effective date, and complete body", () => {
    const html = `<main><h1>Section 2911.21 <span class='codes-separator'>|</span> Criminal trespass.</h1>
      <div class="laws-section-info"><div class="laws-section-info-module"><div class="label">Effective:</div><div class="value">January 1, 2026</div></div></div>
      <section class="laws-body"><span><p>(A) No person shall trespass.</p><p>(1) Complete body.</p></span></section></main>`;
    const parsed = extractOhioDocument(
      html,
      "2911.21",
      buildOhioSourceUrl("2911.21"),
      importedAt,
    );
    expect(parsed).toMatchObject({
      section: "2911.21",
      title: "Criminal trespass",
      effectiveDateStart: "2026-01-01",
      sourceUrl: buildOhioSourceUrl("2911.21"),
    });
    expect(parsed?.text).toContain("(1) Complete body.");
    expect(extractOhioDocument(
      html.replace("Section 2911.21", "Number Not Found"),
      "2911.21",
      buildOhioSourceUrl("2911.21"),
      importedAt,
    )).toBeNull();
  });

  it("hashes official content and withholds mismatched, compound, and federal rows", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "oh-criminal-trespass")!;
    const text = "Section 2911.21 | Criminal trespass.\nEffective: 2026-01-01\n(A) Complete official text.";
    const record = buildOhioManifestRecord(charge, [{
      ...document("2911.21", "Criminal trespass"),
      text,
    }], importedAt);
    expect(record.disposition).toBe("retain");
    expect(record.provisions[0]).toMatchObject({
      sourceKey: "oh:statute:2911.21",
      citation: "Ohio Rev. Code Ann. § 2911.21",
      content: text,
      contentHash: createHash("sha256").update(text).digest("hex"),
      hashBasis: "source_content",
    });
    expect(validateOhioManifestRecord(record)).toBeNull();

    const wrongTitle = buildOhioManifestRecord(charge, [
      document("2911.21", "Burglary"),
    ], importedAt);
    expect(wrongTitle.disposition).toBe("require_exact_reselection");
    expect(wrongTitle.provisions).toEqual([]);

    const compound = criminalCharges.find((candidate) => candidate.id === "oh-attempted-robbery")!;
    expect(buildOhioManifestRecord(compound, [], importedAt).disposition)
      .toBe("require_exact_reselection");

    const federal = criminalCharges.find((candidate) => candidate.id === "oh-bank-robbery")!;
    expect(buildOhioManifestRecord(federal, [], importedAt).disposition)
      .toBe("require_exact_reselection");
  });

  it("rejects a tampered selectable manifest record at load time", () => {
    const manifest = JSON.parse(readFileSync(
      "scripts/data-review/output/oh-source-manifest.json",
      "utf8",
    ));
    const record = manifest.catalogRecords.find(
      (candidate: { chargeId: string }) => candidate.chargeId === "oh-criminal-trespass",
    );
    record.provisions[0].content += "\nTAMPERED";
    const directory = mkdtempSync(join(tmpdir(), "ohio-manifest-"));
    const manifestPath = join(directory, "manifest.json");
    writeFileSync(manifestPath, JSON.stringify(manifest));
    try {
      expect(() => loadOhioAuthorityManifest(manifestPath)).toThrow(
        "Manifest authority provision 1 is not an exact verified Ohio match",
      );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});