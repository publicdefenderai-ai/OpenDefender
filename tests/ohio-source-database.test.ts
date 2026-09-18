import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  CHARGE_ID_ALIASES,
  classifyChargesForGuidance,
  criminalCharges,
  getChargeById,
  getChargesByJurisdiction,
  getSelectableCharges,
  isChargeIdRequiringReselection,
  normalizeChargeId,
} from "../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../shared/criminal-charge-citations";
import {
  OHIO_CHAPTER_2903_LEGACY_IDS_REQUIRING_RESELECTION,
  OHIO_CHAPTER_2903_PILOT_CHARGES,
} from "../shared/ohio-chapter-2903-catalog";
import {
  OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS,
  ohioChapter2903Evidence,
  validateOhioChapter2903Document,
} from "../server/data/ohio-chapter-2903-source";
import { OHIO_REVIEWED_SOURCES } from "../server/data/ohio-reviewed-source";
import { validateOhioChapter2903RefreshReceipt } from "../server/data/ohio-chapter-2903-refresh";
import {
  buildOhioChapter2903PilotManifestRecords,
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
import { getOhioLegacyManifestCharges } from "../scripts/data-review/import-ohio-source-database";

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

    expect(ohioCount).toBe(239);
    expect(manifest.catalogRecords).toHaveLength(ohioCount);
    expect(new Set(manifest.catalogRecords.map((record) => record.chargeId)).size).toBe(ohioCount);
    expect(seed.sources).toHaveLength(251);
    expect(seed.snapshots).toHaveLength(251);
    expect(seed.links).toHaveLength(688);
    expect(seed.selectableChargeIds).toHaveLength(134);
    expect(seed.catalogRecords.filter(record =>
      record.provisions.some(provision =>
        provision.metadata.sourceFirstBatch === "ohio_reviewed_125",
      ))).toHaveLength(105);
    expect(seed.selectableChargeIds).toEqual(expect.arrayContaining(
      OHIO_REVIEWED_SOURCES.map(source => source.chargeId),
    ));
    expect(seed.selectableChargeIds).toContain("oh-orc-2903-12-aggravated-assault");
    expect(seed.selectableChargeIds).not.toContain("oh-aggravated-assault");
    expect(seed.selectableChargeIds).toContain("oh-criminal-trespass");
    expect(seed.selectableChargeIds).not.toContain("oh-murder-in-the-first-degree");
    expect(seed.selectableChargeIds).not.toContain("oh-bank-robbery");
    expect(manifest.catalogRecords.filter((record) =>
      record.disposition === "require_exact_reselection")).toHaveLength(105);
  });

  it("adds only exact source-first statutory names and leaves degree-labelled legacy IDs for reselection", () => {
    const manifest = loadOhioAuthorityManifest();
    // Keep this assertion scoped to the independently pinned Chapter 2903
    // pilot. The reviewed 105-record batch has its own accounting/gates.
    const sourceFirstIds = OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS
      .map(record => record.chargeId);

    expect(sourceFirstIds).toEqual([
      "oh-orc-2903-01-aggravated-murder",
      "oh-orc-2903-02-murder",
      "oh-orc-2903-041-reckless-homicide",
      "oh-orc-2903-05-negligent-homicide",
      "oh-orc-2903-14-negligent-assault",
      "oh-orc-2903-03-voluntary-manslaughter",
      "oh-orc-2903-04-involuntary-manslaughter",
      "oh-orc-2903-12-aggravated-assault",
      "oh-orc-2903-11-felonious-assault",
      "oh-orc-2903-21-aggravated-menacing",
      "oh-orc-2903-15-permitting-child-abuse",
      "oh-orc-2903-18-strangulation",
      "oh-orc-2903-31-hazing",
      "oh-orc-2903-311-reckless-failure-to-immediately-report-knowledge-of-hazing",
      "oh-orc-2903-32-female-genital-mutilation",
      "oh-orc-2903-34-a1-patient-abuse",
      "oh-orc-2903-34-a2-gross-patient-neglect",
      "oh-orc-2903-34-a3-patient-neglect",
      "oh-orc-2903-35-filing-false-patient-abuse-or-neglect-complaints",
    ]);
    expect(sourceFirstIds).toHaveLength(19);
    expect(sourceFirstIds).not.toEqual(expect.arrayContaining(
      OHIO_REVIEWED_SOURCES.map(source => source.chargeId),
    ));
    expect(getChargeById(sourceFirstIds[0])?.name).toBe("Aggravated murder");
    expect(getChargeById(sourceFirstIds[1])?.name).toBe("Murder");
    expect(getSelectableCharges().map((charge) => charge.id)).toEqual(
      expect.arrayContaining(sourceFirstIds),
    );
    expect(getChargesByJurisdiction("OH").map((charge) => charge.id)).toEqual(
      expect.arrayContaining(sourceFirstIds),
    );
    expect(classifyChargesForGuidance(sourceFirstIds.slice(0, 2))).toEqual([
      expect.objectContaining({
        id: "oh-orc-2903-01-aggravated-murder",
        name: "Aggravated murder",
        verifiedCitation: "Ohio Rev. Code Ann. § 2903.01",
      }),
      expect.objectContaining({
        id: "oh-orc-2903-02-murder",
        name: "Murder",
        verifiedCitation: "Ohio Rev. Code Ann. § 2903.02",
      }),
    ]);

    for (const legacyId of OHIO_CHAPTER_2903_LEGACY_IDS_REQUIRING_RESELECTION) {
      expect(CHARGE_ID_ALIASES[legacyId], `${legacyId} must not alias a new source-first ID`)
        .toBeUndefined();
      expect(normalizeChargeId(legacyId)).toBe(legacyId);
      expect(isChargeIdRequiringReselection(legacyId)).toBe(true);
      expect(getChargeById(legacyId)).toBeUndefined();
      expect(getSelectableCharges().some((charge) => charge.id === legacyId)).toBe(false);
      expect(getChargesByJurisdiction("OH").some((charge) => charge.id === legacyId)).toBe(false);
      const legacyRecord = manifest.catalogRecords.find((record) => record.chargeId === legacyId);
      expect(legacyRecord?.disposition).toBe("require_exact_reselection");
      expect(legacyRecord?.provisions).toEqual([]);
    }
  });

  it("keeps the importer legacy-only and composes the pilot only after a current receipt", () => {
    const legacyImportIds = getOhioLegacyManifestCharges().map((charge) => charge.id);
    expect(legacyImportIds).toHaveLength(115);
    expect(legacyImportIds).not.toEqual(expect.arrayContaining(
      OHIO_CHAPTER_2903_PILOT_CHARGES.map((charge) => charge.id),
    ));

    const expectedReceipt = {
      schemaVersion: 1,
      checkedAt: "2026-09-16T22:58:10.000Z",
      expiresAt: "2026-09-23T22:58:10.000Z",
      documents: [
        ...new Map(OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.flatMap((record) =>
          ohioChapter2903Evidence(record).map(({ document }) => [
            document.section,
            {
              section: document.section,
              title: document.title,
              sourceUrl: document.sourceUrl,
              contentHash: document.contentHash,
              effectiveDateStart: document.effectiveDateStart,
            },
          ] as const),
        )).values(),
      ].sort((a, b) => a.section.localeCompare(b.section)),
    };
    expect(validateOhioChapter2903RefreshReceipt(expectedReceipt, new Date("2026-09-17T00:00:00.000Z"))).toBeNull();
    expect(validateOhioChapter2903RefreshReceipt(expectedReceipt, new Date("2026-09-24T00:00:00.000Z")))
      .toMatch(/expired/);
    const afterAnyCurrentReceipt = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000);
    expect(loadOhioAuthorityManifest(undefined, afterAnyCurrentReceipt).catalogRecords)
      .toHaveLength(115);

    const currentManifest = loadOhioAuthorityManifest();
    expect(buildOhioSourceDatabaseSeed(currentManifest, afterAnyCurrentReceipt)
      .selectableChargeIds).not.toEqual(expect.arrayContaining(
        OHIO_CHAPTER_2903_PILOT_CHARGES.map((charge) => charge.id),
      ));
  });

  it("pins complete official offense and sentencing extracts, including the separate penalty dependency", () => {
    const pilotRecords = buildOhioChapter2903PilotManifestRecords(
      new Date("2026-09-16T22:58:10.000Z"),
    );
    const seed = buildOhioSourceDatabaseSeed(loadOhioAuthorityManifest());

    for (const source of OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS) {
      expect(validateOhioChapter2903Document(source.offense)).toBeNull();
      expect(validateOhioChapter2903Document(source.penalty)).toBeNull();
      if (source.penaltyFine) expect(validateOhioChapter2903Document(source.penaltyFine)).toBeNull();

      const record = pilotRecords.find((candidate) => candidate.chargeId === source.chargeId)!;
      expect(record).toBeDefined();
      expect(record.canonicalTitle).toBe(source.canonicalTitle);
      expect(record.mapping?.classification).toBe("exact_match");
      expect(record.provisions.map((provision) => provision.supportRole)).toEqual([
        "offense",
        "penalty",
        ...(source.penaltyFine ? ["penalty"] : []),
        ...(source.additionalEvidence ?? []).map(() => "offense"),
        ...(source.additionalPenalties ?? []).map(() => "penalty"),
      ]);
      expect(record.provisions[0].citation).toBe(source.offense.citation);
      expect(record.provisions[1].citation).toBe(source.penalty.citation);
      if (source.penaltyFine) expect(record.provisions[2].citation).toBe(source.penaltyFine.citation);
      expect(record.provisions[1].content).toContain(
        source.penalty.quotedSpans.find((span) => span.kind === "penalty")!.quote,
      );
      expect(record.provisions[1].metadata.sourceExtraction).toMatchObject({
        sourceHash: source.penalty.contentHash,
        quotedSpans: source.penalty.quotedSpans,
      });
      expect(seed.links.filter((link) => link.chargeId === source.chargeId)).toEqual([
        expect.objectContaining({
          supportRole: "offense",
          citation: source.offense.citation,
        }),
        expect.objectContaining({
          supportRole: "penalty",
          citation: source.penalty.citation,
        }),
        ...(source.penaltyFine ? [expect.objectContaining({
          supportRole: "penalty",
          citation: source.penaltyFine.citation,
        })] : []),
        ...(source.additionalEvidence ?? []).map(document => expect.objectContaining({
          supportRole: "offense", citation: document.citation,
        })),
        ...(source.additionalPenalties ?? []).map(document => expect.objectContaining({
          supportRole: "penalty", citation: document.citation,
        })),
      ]);
      expect(validateOhioManifestRecord(record)).toBeNull();
    }
  });

  it("fails closed when a pinned source quote, content hash, or penalty link is tampered", () => {
    const source = OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS[0];
    expect(validateOhioChapter2903Document({
      ...source.offense,
      text: source.offense.text.replace("prior calculation and design", "changed words"),
    })).toMatch(/Content hash/);

    const record = structuredClone(buildOhioChapter2903PilotManifestRecords(
      new Date("2026-09-16T22:58:10.000Z"),
    )[0]);
    record.provisions[1].citation = "Ohio Rev. Code Ann. § 2929.02(B)(1)";
    expect(validateOhioManifestRecord(record)).toMatch(/pinned official evidence/);
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
    const compoundReferences = parseOhioCitation(CHARGE_CITATIONS[compound.id].citation);
    const partialCompound = buildOhioManifestRecord(compound, [
      document(compoundReferences[1].section, "Robbery"),
    ], importedAt);
    expect(partialCompound.mapping?.classification).toBe("incomplete_evidence");
    expect(partialCompound.mapping?.candidateEvidence[0].sectionIdentity.section)
      .toBe(compoundReferences[1].section);

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