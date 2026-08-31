import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  criminalCharges,
  getVerifiedCitation,
  SOUTH_CAROLINA_EXACT_SOURCE_CHARGE_IDS,
} from "../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../shared/criminal-charge-citations";
import {
  buildSouthCarolinaManifestRecord,
  buildSouthCarolinaSourceDatabaseSeed,
  buildSouthCarolinaSourceKey,
  buildSouthCarolinaSourceUrl,
  parseSouthCarolinaCitation,
  validateSouthCarolinaManifestRecord,
  type SouthCarolinaAuditFindingCode,
  type SouthCarolinaSourceDocument,
} from "../server/data/south-carolina-source-database-seed";
import { loadSouthCarolinaAuthorityManifest } from "../server/data/south-carolina-manifest-loader";
import {
  assertSouthCarolinaManifestIsCurrent,
  extractSouthCarolinaDocument,
  findSouthCarolinaManifestDrift,
  getSouthCarolinaCatalogReferenceInventory,
  inspectSouthCarolinaDocument,
  refreshSouthCarolinaManifest,
} from "../scripts/data-review/import-south-carolina-source-database";

const importedAt = new Date("2026-08-28T00:00:00.000Z");

function readFixture(name: string): string {
  return readFileSync(join("tests", "fixtures", "south-carolina", name), "utf8");
}

const correctedSouthCarolinaSections: Record<string, string> = {
  "sc-criminally-negligent-homicide": "16-3-60",
  "sc-vehicular-homicide": "56-5-2910",
  "sc-assault-on-peace-officer": "16-9-320",
  "sc-identity-theft": "16-13-510",
  "sc-embezzlement": "16-13-230",
  "sc-auto-burglary": "16-13-160",
  "sc-felon-in-possession-of-firearm": "16-23-500",
  "sc-possession-of-prohibited-weapon": "16-23-230",
  "sc-wire-fraud": "16-13-240",
  "sc-mail-fraud": "16-13-240",
  "sc-tax-fraud": "12-54-44",
  "sc-illegal-fireworks": "23-35-130",
  "sc-public-intoxication": "16-17-530",
  "sc-dui-second-offense": "56-5-2933",
  "sc-dui-third-offense": "56-5-2933",
  "sc-failure-to-appear": "17-15-90",
  "sc-contempt-of-court": "14-25-65",
  "sc-expired-registration": "56-3-110",
  "sc-truancy": "59-65-20",
  "sc-hunting-fishing-no-license": "50-9-10",
  "sc-solicitation": "16-15-90",
  "sc-fake-id": "56-1-510",
  "sc-criminal-attempt": "16-1-80",
  "sc-conspiracy": "16-17-410",
  "sc-aiding-and-abetting": "16-1-40",
  "sc-attempted-murder": "16-3-29",
  "sc-recidivist-enhancement": "17-25-45",
  "sc-firearm-in-felony-enhancement": "16-23-490",
  "sc-drug-school-zone-enhancement": "44-53-445",
  "sc-juvenile-transfer-adult-court": "63-19-1210",
  "sc-money-laundering": "44-53-475",
};

const correctedSouthCarolinaScope: Record<string, { officialTitle: string; catalogDescription: string }> = {
  "sc-criminally-negligent-homicide": {
    officialTitle: "criminal negligence",
    catalogDescription: "death",
  },
  "sc-vehicular-homicide": {
    officialTitle: "reckless vehicular homicide",
    catalogDescription: "reckless",
  },
  "sc-assault-on-peace-officer": {
    officialTitle: "assaulting officer",
    catalogDescription: "law enforcement officer",
  },
  "sc-auto-burglary": {
    officialTitle: "breaking into motor vehicles",
    catalogDescription: "vehicle",
  },
  "sc-felon-in-possession-of-firearm": {
    officialTitle: "unlawful possession of a firearm",
    catalogDescription: "firearm",
  },
  "sc-illegal-fireworks": {
    officialTitle: "fireworks illegal",
    catalogDescription: "fireworks",
  },
  "sc-money-laundering": {
    officialTitle: "financial transactions",
    catalogDescription: "financial transaction",
  },
  "sc-attempted-murder": {
    officialTitle: "attempted murder",
    catalogDescription: "killing",
  },
};

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
    expect(seed.sources).toHaveLength(37);
    expect(seed.snapshots).toHaveLength(41);
    expect(seed.links).toHaveLength(41);
    expect(seed.selectableChargeIds).toHaveLength(41);
    expect(manifest.catalogRecords.filter((record) =>
      record.disposition === "require_exact_reselection")).toHaveLength(87);
    expect(manifest.catalogRecords.filter((record) =>
      record.disposition === "require_exact_reselection").every((record) => record.provisions.length === 0)).toBe(true);
    expect(seed.selectableChargeIds).not.toContain("sc-murder-in-the-first-degree");
    expect(seed.selectableChargeIds).toContain("sc-voluntary-manslaughter");
    expect(seed.selectableChargeIds).not.toContain("sc-vehicular-homicide");
    expect(seed.selectableChargeIds).not.toContain("sc-auto-burglary");
    expect(seed.selectableChargeIds).not.toContain("sc-money-laundering");
    expect(seed.selectableChargeIds).toContain("sc-shoplifting");
    expect(seed.selectableChargeIds).toContain("sc-attempted-murder");
    expect(new Set(seed.selectableChargeIds)).toEqual(SOUTH_CAROLINA_EXACT_SOURCE_CHARGE_IDS);
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

  it("keeps each corrected catalog citation on its exact current section", () => {
    const manifest = loadSouthCarolinaAuthorityManifest();

    for (const [chargeId, section] of Object.entries(correctedSouthCarolinaSections)) {
      const charge = criminalCharges.find((candidate) => candidate.id === chargeId);
      const citation = CHARGE_CITATIONS[chargeId]?.citation ?? "";
      const parsed = parseSouthCarolinaCitation(citation);
      const record = manifest.catalogRecords.find((candidate) => candidate.chargeId === chargeId);

      expect(charge?.code, chargeId).toBe(section);
      expect(parsed[0]?.section, chargeId).toBe(section);
      expect(parsed).toHaveLength(1);
      expect(record?.sourceAudit.references[0]?.section, chargeId).toBe(section);
      expect(record?.auditFindings.some((finding) => finding.code === "catalog_code_mismatch"), chargeId)
        .toBe(false);
    }
  });

  it("withholds assault rows until each statutory grade and subdivision is reviewed", () => {
    const manifest = loadSouthCarolinaAuthorityManifest();
    const expectedReferences: Record<string, { section: string; subdivision: string }> = {
      // South Carolina § 16-3-600 uses B for high and aggravated assault,
      // C for first degree, D for second degree, and E for third degree.
      "sc-assault-in-the-first-degree": { section: "16-3-600", subdivision: "(C)" },
      "sc-assault-in-the-second-degree": { section: "16-3-600", subdivision: "(D)" },
      "sc-assault-in-the-third-degree": { section: "16-3-600", subdivision: "(E)" },
      "sc-assault-with-deadly-weapon": { section: "16-3-600", subdivision: "(E)(1)" },
      // The felony offense in § 16-9-320 is subsection B; the bare section
      // is compound and must not authorize the felony catalog row.
      "sc-assault-on-peace-officer": { section: "16-9-320", subdivision: "(B)" },
    };

    for (const [chargeId, expected] of Object.entries(expectedReferences)) {
      const charge = criminalCharges.find((candidate) => candidate.id === chargeId);
      const record = manifest.catalogRecords.find((candidate) => candidate.chargeId === chargeId);
      const parsed = parseSouthCarolinaCitation(CHARGE_CITATIONS[chargeId]?.citation ?? "");

      expect(parsed, chargeId).toEqual([expected]);
      expect(record?.sourceAudit.references[0], chargeId).toMatchObject(expected);
      expect(record?.disposition, chargeId).toBe("require_exact_reselection");
      expect(record?.provisions, chargeId).toHaveLength(0);
      expect(record?.auditFindings.some((finding) => finding.code === "official_title_mismatch"), chargeId)
        .toBe(true);
      expect(SOUTH_CAROLINA_EXACT_SOURCE_CHARGE_IDS.has(chargeId), chargeId).toBe(false);
      expect(getVerifiedCitation(charge!), chargeId).toBeNull();
    }
  });

  it("does not map armed robbery to South Carolina common-law robbery", () => {
    const manifest = loadSouthCarolinaAuthorityManifest();
    const charge = criminalCharges.find((candidate) =>
      candidate.id === "sc-robbery-in-the-second-degree");
    const record = manifest.catalogRecords.find((candidate) =>
      candidate.chargeId === "sc-robbery-in-the-second-degree");

    expect(charge?.description).toContain("Armed robbery");
    expect(record?.sourceAudit.references[0]).toMatchObject({
      section: "16-11-325",
      subdivision: null,
      officialTitle: "Common law robbery classified as felony; penalty",
    });
    expect(record?.disposition).toBe("require_exact_reselection");
    expect(record?.provisions).toHaveLength(0);
    expect(SOUTH_CAROLINA_EXACT_SOURCE_CHARGE_IDS.has(charge!.id)).toBe(false);
    expect(getVerifiedCitation(charge!)).toBeNull();
  });

  it("does not map DUI offenses to the distinct unlawful-alcohol-concentration statute", () => {
    const manifest = loadSouthCarolinaAuthorityManifest();
    const expectedRows = [
      { chargeId: "sc-dui-second-offense", subdivision: "(b)" },
      { chargeId: "sc-dui-third-offense", subdivision: "(c)" },
    ];

    for (const { chargeId, subdivision } of expectedRows) {
      const charge = criminalCharges.find((candidate) => candidate.id === chargeId);
      const record = manifest.catalogRecords.find((candidate) => candidate.chargeId === chargeId);

      expect(charge?.description).toContain("under influence");
      expect(record?.sourceAudit.references[0]).toMatchObject({
        section: "56-5-2933",
        subdivision,
        officialTitle: "Driving with an unlawful alcohol concentration; penalties; enrollment in Alcohol and Drug Safety Action Program; prosecution",
      });
      expect(record?.disposition, chargeId).toBe("require_exact_reselection");
      expect(record?.provisions, chargeId).toHaveLength(0);
      expect(SOUTH_CAROLINA_EXACT_SOURCE_CHARGE_IDS.has(chargeId), chargeId).toBe(false);
      expect(getVerifiedCitation(charge!), chargeId).toBeNull();
    }
  });

  it("withholds aliases whose official scope is narrower, broader, or compound", () => {
    const manifest = loadSouthCarolinaAuthorityManifest();
    const expectedRows = [
      { chargeId: "sc-sexual-exploitation-of-minor", title: "First degree sexual exploitation" },
      { chargeId: "sc-drug-trafficking", title: "Possession, manufacture, and trafficking" },
      { chargeId: "sc-unlawful-carrying-of-weapon", title: "Unlawful carrying of handgun" },
      { chargeId: "sc-discharge-of-firearm-in-city", title: "Discharging firearms at or into dwellings" },
      { chargeId: "sc-possession-of-prohibited-weapon", title: "machine gun, military firearm, or sawed-off shotgun" },
      { chargeId: "sc-tax-fraud", title: "every tax or revenue law" },
      { chargeId: "sc-false-info-to-police", title: "false complaint to law enforcement officer" },
      { chargeId: "sc-indecent-exposure", title: "Indecent exposure; breastfeeding" },
      { chargeId: "sc-fake-id", title: "Unlawful use of license; fraudulent application" },
      { chargeId: "sc-illegal-fireworks", title: "Manufacture, storage, transportation or possession" },
      { chargeId: "sc-hunting-fishing-no-license", title: "Unlicensed activities; violations; penalties" },
      { chargeId: "sc-drug-school-zone-enhancement", title: "Distribution of controlled substance within proximity of school" },
    ];

    for (const { chargeId, title } of expectedRows) {
      const charge = criminalCharges.find((candidate) => candidate.id === chargeId);
      const record = manifest.catalogRecords.find((candidate) => candidate.chargeId === chargeId);
      const officialTitle = record?.sourceAudit.references[0]?.officialTitle ?? "";

      expect(officialTitle, chargeId).toContain(title);
      expect(record?.disposition, chargeId).toBe("require_exact_reselection");
      expect(record?.provisions, chargeId).toHaveLength(0);
      expect(SOUTH_CAROLINA_EXACT_SOURCE_CHARGE_IDS.has(chargeId), chargeId).toBe(false);
      expect(getVerifiedCitation(charge!), chargeId).toBeNull();
    }
  });

  it("does not treat a corrected section as an exact offense when its scope is broader or narrower", () => {
    const manifest = loadSouthCarolinaAuthorityManifest();

    for (const [chargeId, scope] of Object.entries(correctedSouthCarolinaScope)) {
      const charge = criminalCharges.find((candidate) => candidate.id === chargeId);
      const record = manifest.catalogRecords.find((candidate) => candidate.chargeId === chargeId);
      const officialTitle = record?.sourceAudit.references[0]?.officialTitle?.toLowerCase() ?? "";

      expect(officialTitle, chargeId).toContain(scope.officialTitle);
      expect(charge?.description.toLowerCase(), chargeId).toContain(scope.catalogDescription);
    }

    expect(manifest.catalogRecords.find((record) => record.chargeId === "sc-vehicular-homicide")?.disposition)
      .toBe("require_exact_reselection");
    expect(manifest.catalogRecords.find((record) => record.chargeId === "sc-auto-burglary")?.disposition)
      .toBe("require_exact_reselection");
    expect(manifest.catalogRecords.find((record) => record.chargeId === "sc-money-laundering")?.disposition)
      .toBe("require_exact_reselection");
    expect(manifest.catalogRecords.find((record) => record.chargeId === "sc-attempted-murder")?.disposition)
      .toBe("retain");
  });

  it("never exposes an SC citation for a manifest-withheld row", () => {
    const manifest = loadSouthCarolinaAuthorityManifest();
    const retainedIds = new Set(
      manifest.catalogRecords
        .filter((record) => record.disposition === "retain" || record.disposition === "exact_alias_rename")
        .map((record) => record.chargeId),
    );

    for (const charge of criminalCharges.filter((candidate) => candidate.jurisdiction === "SC")) {
      const citation = getVerifiedCitation(charge);
      if (retainedIds.has(charge.id)) {
        expect(citation, charge.id).toBe(CHARGE_CITATIONS[charge.id]?.citation);
      } else {
        expect(citation, charge.id).toBeNull();
      }
    }
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

  it("records independent section, history, and subdivision audit findings", () => {
    const inspection = inspectSouthCarolinaDocument(
      `<span class="SectionNumber">SECTION 16-3-50.</span>
       Manslaughter.<br><br>(A) Complete official statutory text.`,
      "16-3-50",
      buildSouthCarolinaSourceUrl("16-3-50"),
      importedAt,
      "(B)",
    );
    expect(inspection.sectionExtractionStatus).toBe("incomplete");
    expect(inspection.officialTitle).toBe("Manslaughter");
    expect(inspection.contentEvidence).toBe(true);
    expect(inspection.historyEvidence).toBe(false);
    expect(inspection.contentHash).toMatch(/^[a-f0-9]{64}$/);
    expect(inspection.findings.map((finding) => finding.code)).toEqual([
      "history_missing",
      "subdivision_not_found",
    ]);
  });

  it("supports the official styled section markers used by current SC chapter pages", () => {
    const inspection = inspectSouthCarolinaDocument(
      readFixture("official-section-with-style-span.html"),
      "44-53-415",
      buildSouthCarolinaSourceUrl("44-53-415"),
      importedAt,
    );

    expect(inspection).toMatchObject({
      sectionExtractionStatus: "complete",
      officialTitle: "Maintaining premises for drug activity",
      historyEvidence: true,
      contentEvidence: true,
      contentHash: expect.stringMatching(/^[a-f0-9]{64}$/),
    });
    expect(inspection.document?.text).toContain("(A) A person who knowingly permits");
    expect(inspection.findings.map((finding) => finding.code)).toEqual([
      "official_source_verified",
    ]);
  });

  it("reports a found section with content but no history as incomplete", () => {
    const inspection = inspectSouthCarolinaDocument(
      readFixture("official-section-without-history.html"),
      "16-3-50",
      buildSouthCarolinaSourceUrl("16-3-50"),
      importedAt,
    );

    expect(inspection.document).toBeNull();
    expect(inspection.sectionExtractionStatus).toBe("incomplete");
    expect(inspection.contentEvidence).toBe(true);
    expect(inspection.historyEvidence).toBe(false);
    expect(inspection.findings.map((finding) => finding.code)).toEqual([
      "history_missing",
    ]);
  });

  it("reports an unsupported subdivision without promoting the section", () => {
    const inspection = inspectSouthCarolinaDocument(
      readFixture("official-section-without-subdivision.html"),
      "16-13-240",
      buildSouthCarolinaSourceUrl("16-13-240"),
      importedAt,
      "(A)",
    );

    expect(inspection.document).toBeNull();
    expect(inspection.sectionExtractionStatus).toBe("incomplete");
    expect(inspection.contentEvidence).toBe(true);
    expect(inspection.historyEvidence).toBe(true);
    expect(inspection.findings.map((finding) => finding.code)).toEqual([
      "subdivision_not_found",
    ]);
  });

  it("keeps an absent official section distinct from incomplete evidence", () => {
    const inspection = inspectSouthCarolinaDocument(
      readFixture("official-section-absent.html"),
      "44-53-415",
      buildSouthCarolinaSourceUrl("44-53-415"),
      importedAt,
    );

    expect(inspection).toMatchObject({
      document: null,
      sectionExtractionStatus: "section_not_found",
      officialTitle: null,
      historyEvidence: false,
      contentEvidence: false,
      contentHash: null,
    });
    expect(inspection.findings.map((finding) => finding.code)).toEqual([
      "section_not_found",
    ]);
  });

  it("does not treat a history-only section as statutory content", () => {
    const inspection = inspectSouthCarolinaDocument(
      `<span class="SectionNumber">SECTION 16-3-50.</span>
       Manslaughter.<br><br>HISTORY: 1962 Code Section 16-51.`,
      "16-3-50",
      buildSouthCarolinaSourceUrl("16-3-50"),
      importedAt,
    );
    expect(inspection.document).toBeNull();
    expect(inspection.sectionExtractionStatus).toBe("incomplete");
    expect(inspection.historyEvidence).toBe(true);
    expect(inspection.contentEvidence).toBe(false);
    expect(inspection.contentHash).toBeNull();
    expect(inspection.findings.map((finding) => finding.code)).toEqual(["content_missing"]);
  });

  it("commits one detailed audit entry for every catalog row and parsed reference", () => {
    const manifest = loadSouthCarolinaAuthorityManifest();
    const findingCodes: SouthCarolinaAuditFindingCode[] = [
      "official_source_verified",
      "citation_not_parseable",
      "catalog_code_mismatch",
      "official_fetch_failure",
      "section_not_found",
      "content_missing",
      "history_missing",
      "subdivision_not_found",
      "official_title_mismatch",
    ];
    const references = manifest.catalogRecords.flatMap((record) => record.sourceAudit.references);
    const findings = manifest.catalogRecords.flatMap((record) => record.auditFindings);

    expect(manifest.audit).toMatchObject({
      schemaVersion: 1,
      catalogRowCount: 128,
      parsedReferenceCount: 130,
      successfulOfficialRetrievals: 130,
      completeSectionExtractions: 127,
    });
    expect(manifest.catalogRecords.every((record) => {
      const parsed = parseSouthCarolinaCitation(CHARGE_CITATIONS[record.chargeId]?.citation ?? "");
      return record.sourceAudit.references.length === parsed.length &&
        record.sourceAudit.references.every((reference, index) =>
          reference.section === parsed[index].section &&
          reference.subdivision === parsed[index].subdivision &&
          reference.officialUrl === buildSouthCarolinaSourceUrl(reference.section),
        );
    })).toBe(true);
    expect(references).toHaveLength(130);
    expect(references.filter((reference) => reference.fetchStatus === "success")).toHaveLength(130);
    expect(references.filter((reference) => reference.sectionExtractionStatus === "complete")).toHaveLength(127);
    expect(references.filter((reference) => reference.sectionExtractionStatus === "section_not_found")).toHaveLength(2);
    expect(references.filter((reference) => reference.contentHash !== null)).toHaveLength(128);
    expect(findings.some((finding) => finding.code === "catalog_code_mismatch")).toBe(true);
    expect(findings.some((finding) => finding.code === "official_title_mismatch")).toBe(true);
    expect(findings.some((finding) => finding.code === "section_not_found")).toBe(true);
    expect(findings.some((finding) => finding.code === "subdivision_not_found")).toBe(true);
    expect(manifest.catalogRecords.find((record) => record.chargeId === "sc-criminally-negligent-homicide")?.auditFindings.map(
      (finding) => finding.code,
    )).toEqual(["official_source_verified"]);
    expect(manifest.catalogRecords.find((record) => record.chargeId === "sc-criminally-negligent-homicide"))
      .toMatchObject({
        disposition: "exact_alias_rename",
        dispositionReason: "The official South Carolina title is supported by an explicit reviewed alias mapping.",
      });
    expect(manifest.catalogRecords.find((record) => record.chargeId === "sc-maintaining-drug-house"))
      .toMatchObject({
        disposition: "require_exact_reselection",
        dispositionReason: "The official South Carolina chapter page did not contain section 44-53-415.",
        provisions: [],
      });
    expect(Object.keys(manifest.audit!.findingCounts).sort()).toEqual([...findingCodes].sort());
    expect(manifest.audit!.mechanical.findingCodes).not.toContain("catalog_code_mismatch");
    expect(manifest.audit!.structural.findingCodes).toContain("catalog_code_mismatch");
  });

  it("detects catalog, parsed-reference, official-URL, and audit drift", () => {
    const manifest = loadSouthCarolinaAuthorityManifest();
    expect(findSouthCarolinaManifestDrift(manifest)).toEqual([]);
    expect(() => assertSouthCarolinaManifestIsCurrent(manifest)).not.toThrow();
    expect(getSouthCarolinaCatalogReferenceInventory()).toHaveLength(128);

    const staleRow = structuredClone(manifest);
    staleRow.catalogRecords[0].catalogLabel = "Changed catalog label";
    expect(() => assertSouthCarolinaManifestIsCurrent(staleRow)).toThrow(
      /catalog row sc-murder-in-the-first-degree catalogLabel changed/i,
    );
    expect(() => assertSouthCarolinaManifestIsCurrent(staleRow)).toThrow(/Regenerate/i);

    const staleReference = structuredClone(manifest);
    staleReference.catalogRecords[0].sourceAudit.references[0].section = "16-3-11";
    expect(() => assertSouthCarolinaManifestIsCurrent(staleReference)).toThrow(
      /parsed reference inventory/i,
    );
    expect(() => assertSouthCarolinaManifestIsCurrent(staleReference)).toThrow(/Regenerate/i);

    const staleUrl = structuredClone(manifest);
    staleUrl.catalogRecords[0].sourceAudit.references[0].officialUrl = "https://example.test/stale";
    expect(() => assertSouthCarolinaManifestIsCurrent(staleUrl)).toThrow(
      /official URL/i,
    );
    expect(() => assertSouthCarolinaManifestIsCurrent(staleUrl)).toThrow(/Regenerate/i);

    const staleAudit = structuredClone(manifest);
    staleAudit.audit!.parsedReferenceCount++;
    expect(() => assertSouthCarolinaManifestIsCurrent(staleAudit)).toThrow(
      /audit count parsedReferenceCount/i,
    );
    expect(() => assertSouthCarolinaManifestIsCurrent(staleAudit)).toThrow(/Regenerate/i);

    const citation = CHARGE_CITATIONS["sc-murder-in-the-first-degree"]!;
    const originalCitation = citation.citation;
    try {
      citation.citation = "S.C. Code Ann. § 16-3-11";
      expect(() => assertSouthCarolinaManifestIsCurrent(manifest)).toThrow(
        /parsed reference inventory/i,
      );
      expect(() => assertSouthCarolinaManifestIsCurrent(manifest)).toThrow(/Regenerate/i);
    } finally {
      citation.citation = originalCitation;
    }
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