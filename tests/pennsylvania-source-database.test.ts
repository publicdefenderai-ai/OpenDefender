import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { criminalCharges } from "../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../shared/criminal-charge-citations";
import { loadPennsylvaniaAuthorityManifest } from "../server/data/pennsylvania-manifest-loader";
import {
  buildPennsylvaniaManifestRecord,
  buildPennsylvaniaOfficialSourceUrl,
  buildPennsylvaniaSourceDatabaseSeed,
  buildPennsylvaniaSourceKey,
  buildPennsylvaniaSourceUrl,
  getPennsylvaniaReferences,
  PENNSYLVANIA_APPROVED_UNCONSOLIDATED_LEGACY_PROVISIONS,
  parsePennsylvaniaCitation,
  validatePennsylvaniaManifestRecord,
  type PennsylvaniaSourceDocument,
} from "../server/data/pennsylvania-source-database-seed";
import {
  checkPennsylvaniaSourceContract,
  extractPennsylvaniaDocument,
  extractPennsylvaniaLegacyDocument,
  fetchPennsylvaniaDocument,
  refreshPennsylvaniaManifest,
  PENNSYLVANIA_RETRIEVAL_SOURCE,
  PENNSYLVANIA_SOURCE_CONTRACT_REFERENCE,
  PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES,
  validatePennsylvaniaSourceContract,
} from "../scripts/data-review/import-pennsylvania-source-database";

const importedAt = new Date("2026-08-28T00:00:00.000Z");

function document(section: string, title: string, lawTitle = "18"): PennsylvaniaSourceDocument {
  return {
    section,
    title,
    text: `§ ${section}. ${title}.\nA person commits an offense when the statutory elements are met. This is complete official section text for the test.`,
    sourceUrl: buildPennsylvaniaSourceUrl(lawTitle, section),
    retrievedAt: importedAt,
    effectiveDateStart: null,
  };
}

describe("Pennsylvania authority manifest", () => {
  it("preserves every Pennsylvania catalog row and publishes only exact official matches", () => {
    const manifest = loadPennsylvaniaAuthorityManifest();
    const seed = buildPennsylvaniaSourceDatabaseSeed(manifest);
    const count = criminalCharges.filter((charge) => charge.jurisdiction === "PA").length;
    expect(count).toBe(112);
    expect(manifest.catalogRecords).toHaveLength(count);
    expect(new Set(manifest.catalogRecords.map((record) => record.chargeId)).size).toBe(count);
    const selectable = manifest.catalogRecords.filter((record) =>
      record.disposition === "retain" || record.disposition === "exact_alias_rename");
    const withheld = manifest.catalogRecords.filter((record) =>
      record.disposition === "require_exact_reselection");
    expect(selectable).toHaveLength(25);
    expect(selectable.every((record) => record.provisions.length > 0)).toBe(true);
    expect(withheld).toHaveLength(87);
    expect(withheld.every((record) => record.provisions.length === 0)).toBe(true);
    expect(seed.sources).toHaveLength(25);
    expect(seed.snapshots).toHaveLength(25);
    expect(seed.links).toHaveLength(25);
    expect(seed.selectableChargeIds).toHaveLength(25);
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
    expect(parsePennsylvaniaCitation("3 P.S. § 459-305")).toEqual([]);
    expect(parsePennsylvaniaCitation("24 P.S. § 13-1333")).toEqual([]);
    expect(parsePennsylvaniaCitation("47 P.S. § 4-406")).toEqual([]);
    expect(parsePennsylvaniaCitation("18 U.S.C. § 2113")).toEqual([]);
    expect(parsePennsylvaniaCitation("47 Pa. Cons. Stat. § 4-406")).toEqual([
      { title: "47", section: "4-406", subdivision: null },
    ]);
    expect(buildPennsylvaniaSourceUrl("18", "2502")).toContain("&chpt=25&sctn=2");
    expect(buildPennsylvaniaSourceUrl("18", "3124.1")).toContain("&chpt=31&sctn=24.1");
    expect(buildPennsylvaniaSourceUrl("47", "4-406")).toContain("&chpt=4&sctn=406");
    expect(buildPennsylvaniaOfficialSourceUrl("18", "2502")).toBe(
      "https://www.palegis.us/statutes/consolidated/view-statute?txtType=HTM&ttl=18&div=0&chpt=25&sctn=2&subsctn=0",
    );
    expect(buildPennsylvaniaSourceKey("18", "3124.1", "(a)")).toBe("pa:18:3124.1:a");
  });

  it("keeps representative hyphenated sections exact across parsing and official URL routing", () => {
    const references = [
      { title: "3", section: "459-305", chapter: "459", routedSection: "305" },
      { title: "24", section: "13-1333", chapter: "13", routedSection: "1333" },
      { title: "47", section: "4-406", chapter: "4", routedSection: "406" },
    ];

    for (const reference of references) {
      expect(parsePennsylvaniaCitation(
        `${reference.title} Pa. Cons. Stat. § ${reference.section}`,
      )).toEqual([{
        title: reference.title,
        section: reference.section,
        subdivision: null,
      }]);
      expect(buildPennsylvaniaSourceUrl(reference.title, reference.section)).toBe(
        `https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=${reference.title}&div=0&chpt=${reference.chapter}&sctn=${reference.routedSection}&subsctn=0`,
      );
      expect(buildPennsylvaniaOfficialSourceUrl(reference.title, reference.section)).toBe(
        `https://www.palegis.us/statutes/consolidated/view-statute?txtType=HTM&ttl=${reference.title}&div=0&chpt=${reference.chapter}&sctn=${reference.routedSection}&subsctn=0`,
      );
      if (reference.title === "3" || reference.title === "24") {
        expect(PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES).not.toContainEqual({
          title: reference.title,
          section: reference.section,
          subdivision: null,
        });
      } else {
        expect(PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES).toContainEqual({
          title: reference.title,
          section: reference.section,
          subdivision: null,
        });
      }
    }
  });

  it("keeps hyphenated catalog codes aligned to their cited sections", () => {
    const expected = [
      { chargeId: "pa-animal-at-large", code: "459-305", citation: "3 P.S. § 459-305" },
      { chargeId: "pa-truancy", code: "13-1333", citation: "24 P.S. § 13-1333" },
      { chargeId: "pa-alcohol-in-park", code: "4-406", citation: "47 P.S. § 4-406" },
    ];

    for (const item of expected) {
      const charge = criminalCharges.find((candidate) => candidate.id === item.chargeId)!;
      expect(charge.code).toBe(item.code);
      expect(CHARGE_CITATIONS[charge.id]?.citation).toBe(item.citation);
      expect(parsePennsylvaniaCitation(item.citation)).toEqual([]);
    }
  });

  it("withholds legacy mappings until attorney review confirms the charge match", () => {
    const manifest = loadPennsylvaniaAuthorityManifest();
    for (const [chargeId, approved] of Object.entries(
      PENNSYLVANIA_APPROVED_UNCONSOLIDATED_LEGACY_PROVISIONS,
    )) {
      const record = manifest.catalogRecords.find((candidate) => candidate.chargeId === chargeId)!;
      expect(getPennsylvaniaReferences(chargeId)).toEqual([{
        title: approved.title,
        section: approved.section,
        subdivision: approved.subdivision,
        sourceKind: "unconsolidated",
      }]);
      expect(approved.publicationApproved).toBe(false);
      expect(record.disposition).toBe("require_exact_reselection");
      expect(record.apiStatus).toBe("verified");
      expect(record.canonicalTitle).toBeNull();
      expect(record.provisions).toHaveLength(0);
      expect(record.dispositionReason).toContain("attorney review");
      expect(validatePennsylvaniaManifestRecord(record)).toBeNull();

      const charge = criminalCharges.find((candidate) => candidate.id === chargeId)!;
      const fetched = document(approved.section, approved.sectionTitle, approved.title);
      expect(buildPennsylvaniaManifestRecord(charge, [fetched], importedAt)).toMatchObject({
        disposition: "require_exact_reselection",
        provisions: [],
        apiStatus: "verified",
      });
    }
  });

  it("rejects an attorney-unapproved legacy record at validation, loading, and seed boundaries", () => {
    const manifest = loadPennsylvaniaAuthorityManifest();
    const approved = PENNSYLVANIA_APPROVED_UNCONSOLIDATED_LEGACY_PROVISIONS["pa-animal-at-large"];
    const withheld = manifest.catalogRecords.find((record) => record.chargeId === approved.chargeId)!;
    const content = `Section 305. ${approved.sectionTitle}. Confinement and control. Housing.`;
    const selectableRecord = {
      ...withheld,
      disposition: "exact_alias_rename" as const,
      canonicalTitle: approved.sectionTitle,
      provisions: [{
        sourceKey: buildPennsylvaniaSourceKey(approved.title, approved.section, approved.subdivision),
        lawId: approved.title,
        section: approved.section,
        citation: `${approved.title} P.S. § ${approved.section}`,
        officialTitle: approved.sectionTitle,
        sourceUrl: approved.canonicalUrl,
        content,
        contentHash: createHash("sha256").update(content).digest("hex"),
        hashBasis: "source_content" as const,
        retrievedAt: importedAt,
        effectiveDateStart: null,
        effectiveDateEnd: null,
        supportRole: "offense" as const,
        subdivision: approved.subdivision,
        metadata: {},
      }],
      apiStatus: "verified" as const,
    };
    expect(validatePennsylvaniaManifestRecord(selectableRecord)).toContain("not attorney-approved");
    expect(buildPennsylvaniaSourceDatabaseSeed({
      ...manifest,
      catalogRecords: [selectableRecord],
    })).toMatchObject({
      sources: [],
      snapshots: [],
      links: [],
      selectableChargeIds: [],
    });

    const temporaryDirectory = mkdtempSync(join(tmpdir(), "pa-manifest-"));
    const temporaryManifest = join(temporaryDirectory, "manifest.json");
    writeFileSync(temporaryManifest, JSON.stringify({
      ...manifest,
      catalogRecords: manifest.catalogRecords.map((record) =>
        record.chargeId === approved.chargeId ? selectableRecord : record),
    }));
    try {
      expect(() => loadPennsylvaniaAuthorityManifest(temporaryManifest)).toThrow(
        "not attorney-approved",
      );
    } finally {
      rmSync(temporaryDirectory, { recursive: true, force: true });
    }
  });

  it("rejects a legacy provision when its exact official URL or content is not supplied", () => {
    const approved = PENNSYLVANIA_APPROVED_UNCONSOLIDATED_LEGACY_PROVISIONS["pa-animal-at-large"];
    const charge = criminalCharges.find((candidate) => candidate.id === approved.chargeId)!;
    const wrongUrl = buildPennsylvaniaSourceUrl(approved.title, approved.section);
    const wrongUrlRecord = buildPennsylvaniaManifestRecord(charge, [{
      ...document(approved.section, approved.sectionTitle, approved.title),
      sourceUrl: wrongUrl,
    }], importedAt);
    expect(wrongUrlRecord.disposition).toBe("require_exact_reselection");
    expect(wrongUrlRecord.provisions).toEqual([]);

    const wrongContent = `<html><body>Section 305. ${approved.sectionTitle}.<br>Unrelated neighboring provision.</body></html>`;
    expect(extractPennsylvaniaLegacyDocument(
      wrongContent,
      approved,
      approved.canonicalUrl,
      importedAt,
    )).toBeNull();
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

  it("rejects secondary source URLs before they can create a selectable record", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "pa-aggravated-assault")!;
    const record = buildPennsylvaniaManifestRecord(charge, [{
      ...document("2702", "Aggravated assault"),
      sourceUrl: "https://law.justia.com/codes/pennsylvania/section-2702/",
    }], importedAt);
    expect(record.disposition).toBe("require_exact_reselection");
    expect(record.provisions).toEqual([]);
    expect(record.dispositionReason).toContain("exact official consolidated-statute URL");
  });

  it("keeps a supported section selectable only when its section and subdivision match", () => {
    const charge = criminalCharges.find((candidate) => candidate.id === "pa-murder-in-the-first-degree")!;
    const record = buildPennsylvaniaManifestRecord(
      charge,
      [document("2502", "Murder")],
      importedAt,
    );
    expect(record.disposition).toBe("exact_alias_rename");
    expect(validatePennsylvaniaManifestRecord(record)).toBeNull();

    const wrongSection = {
      ...record,
      provisions: [{ ...record.provisions[0], section: "2503" }],
    };
    expect(validatePennsylvaniaManifestRecord(wrongSection)).toContain("not an exact verified Pennsylvania match");

    const wrongSubdivision = {
      ...record,
      provisions: [{ ...record.provisions[0], subdivision: "(b)" }],
    };
    expect(validatePennsylvaniaManifestRecord(wrongSubdivision)).toContain("not an exact verified Pennsylvania match");
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

    const unconsolidated = criminalCharges.find(
      (candidate) => candidate.id === "pa-distribution-of-controlled-substance",
    )!;
    expect(buildPennsylvaniaManifestRecord(unconsolidated, [], importedAt).disposition)
      .toBe("require_exact_reselection");
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
    expect(extractPennsylvaniaDocument(
      "<html><body>Section 2502.0 - Title 18 - CRIMES AND OFFENSES<br>§ 2502.  Murder.<br>(a) A criminal homicide constitutes murder.</body></html>",
      "2502",
      buildPennsylvaniaSourceUrl("18", "2502"),
      importedAt,
    )).toMatchObject({ section: "2502", title: "Murder" });
    expect(extractPennsylvaniaDocument(
      "<html><body><h1>Section 2502.0 - Title 18 - CRIMES AND OFFENSES</h1><div>&sect; 2502.&nbsp;&nbsp;Murder.</div><div>(a) A criminal homicide constitutes murder.</div></body></html>",
      "2502",
      buildPennsylvaniaOfficialSourceUrl("18", "2502"),
      importedAt,
    )).toMatchObject({ section: "2502", title: "Murder" });
  });

  it("extracts approved legacy content only when every source-content check passes", () => {
    const approved = PENNSYLVANIA_APPROVED_UNCONSOLIDATED_LEGACY_PROVISIONS["pa-animal-at-large"];
    const html = `<html><body><h1>Section 305 - Act of Dec. 7, 1982 - DOG LAW</h1><div>Section 305. Confinement and housing of dogs not part of a<br>kennel.</div><div>(a) Confinement and control.--It shall be unlawful for the owner or keeper of any dog.</div><div>(b) Housing.--It shall be unlawful for the owner or keeper of a dog.</div></body></html>`;
    expect(extractPennsylvaniaLegacyDocument(
      html,
      approved,
      approved.canonicalUrl,
      importedAt,
    )).toMatchObject({
      section: "459-305",
      title: approved.sectionTitle,
      sourceUrl: approved.canonicalUrl,
    });
    expect(extractPennsylvaniaLegacyDocument(
      html.replace("Confinement and control", "Different heading"),
      approved,
      approved.canonicalUrl,
      importedAt,
    )).toBeNull();
  });

  it("retrieves an approved legacy page only from its exact PAlegis URL", async () => {
    const approved = PENNSYLVANIA_APPROVED_UNCONSOLIDATED_LEGACY_PROVISIONS["pa-animal-at-large"];
    const reference = getPennsylvaniaReferences(approved.chargeId)[0];
    const html = `<html><body><div>Section 305. Confinement and housing of dogs not part of a<br>kennel.</div><div>(a) Confinement and control.--It shall be unlawful for the owner or keeper of any dog.</div><div>(b) Housing.--It shall be unlawful for the owner or keeper of a dog.</div></body></html>`;
    const originalFetch = globalThis.fetch;
    const requestedUrls: string[] = [];
    globalThis.fetch = (async (input: string | URL | Request) => {
      requestedUrls.push(String(input));
      return new Response(html, {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    }) as typeof fetch;
    try {
      const parsed = await fetchPennsylvaniaDocument(reference, importedAt);
      expect(requestedUrls).toEqual([approved.retrievalUrl]);
      expect(parsed).toMatchObject({
        title: approved.sectionTitle,
        section: approved.section,
        sourceUrl: approved.canonicalUrl,
      });
    } finally {
      globalThis.fetch = originalFetch;
    }

    globalThis.fetch = (async () => ({
      ok: true,
      status: 200,
      url: "https://law.justia.com/codes/pennsylvania/section-459-305/",
      headers: new Headers({ "content-type": "text/html" }),
      text: async () => html,
    })) as typeof fetch;
    try {
      await expect(fetchPennsylvaniaDocument(reference, importedAt)).resolves.toBeNull();
    } finally {
      globalThis.fetch = originalFetch;
    }
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

  it("retrieves migrated PAlegis HTML while retaining the legacy canonical URL", async () => {
    const officialUrl = buildPennsylvaniaOfficialSourceUrl("18", "2502");
    const canonicalUrl = buildPennsylvaniaSourceUrl("18", "2502");
    const originalFetch = globalThis.fetch;
    const requestedUrls: string[] = [];
    globalThis.fetch = (async (input: string | URL | Request) => {
      requestedUrls.push(String(input));
      return new Response(
        "<html><body><h1>Section 2502.0 - Title 18 - CRIMES AND OFFENSES</h1><div>&sect; 2502.&nbsp;&nbsp;Murder.</div><div>(a) A criminal homicide constitutes murder under these statutory elements and penalties.</div></body></html>",
        { status: 200, headers: { "content-type": "text/html" } },
      );
    }) as typeof fetch;
    try {
      const parsed = await fetchPennsylvaniaDocument(
        { title: "18", section: "2502", subdivision: null },
        importedAt,
      );
      expect(requestedUrls).toEqual([officialUrl]);
      expect(parsed).toMatchObject({
        section: "2502",
        title: "Murder",
        sourceUrl: canonicalUrl,
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("checks one representative PAlegis page per title without following redirects", async () => {
    const originalFetch = globalThis.fetch;
    const requestedUrls: string[] = [];
    let requestInit: RequestInit | undefined;
    globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
      const requestedUrl = String(input);
      requestedUrls.push(requestedUrl);
      requestInit = init;
      const reference = PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES.find(
        (candidate) => buildPennsylvaniaOfficialSourceUrl(candidate.title, candidate.section) === requestedUrl,
      )!;
      return new Response(
        `<html><body><h1>Section ${reference.section}.0 - Title ${reference.title} - REPRESENTATIVE</h1><div>&sect; ${reference.section}.&nbsp;&nbsp;Representative section.</div><div>A person commits an offense when the statutory elements are met. This is complete official section text for the contract test.</div></body></html>`,
        {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        },
      );
    }) as typeof fetch;
    try {
      const result = await checkPennsylvaniaSourceContract();
      expect(result).toMatchObject({
        ok: true,
        source: PENNSYLVANIA_RETRIEVAL_SOURCE,
        requestedUrl: buildPennsylvaniaOfficialSourceUrl(
          PENNSYLVANIA_SOURCE_CONTRACT_REFERENCE.title,
          PENNSYLVANIA_SOURCE_CONTRACT_REFERENCE.section,
        ),
      });
      expect(result.pages).toHaveLength(PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES.length);
      expect(requestedUrls).toEqual(PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES.map((reference) =>
        buildPennsylvaniaOfficialSourceUrl(reference.title, reference.section),
      ));
      expect(requestInit?.redirect).toBe("manual");
      expect(requestInit?.headers).toMatchObject({ Accept: "text/html" });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("reports the affected official URL when one title's page contract fails", async () => {
    const brokenReference = PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES.find((reference) => reference.title === "42")!;
    const brokenUrl = buildPennsylvaniaOfficialSourceUrl(brokenReference.title, brokenReference.section);
    const result = await checkPennsylvaniaSourceContract(async (input) => {
      const requestedUrl = String(input);
      const reference = PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES.find(
        (candidate) => buildPennsylvaniaOfficialSourceUrl(candidate.title, candidate.section) === requestedUrl,
      )!;
      const html = reference === brokenReference
        ? "<html><body><h1>Updated statute viewer</h1></body></html>"
        : `<html><body><h1>Section ${reference.section}.0 - Title ${reference.title} - REPRESENTATIVE</h1><div>&sect; ${reference.section}.&nbsp;&nbsp;Representative section.</div><div>A person commits an offense when the statutory elements are met. This is complete official section text for the contract test.</div></body></html>`;
      return new Response(html, {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    });

    expect(result.ok).toBe(false);
    expect(result.pages).toHaveLength(PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES.length);
    expect(result.failures.some((failure) =>
      failure.includes(`Title 42 § ${brokenReference.section}`) &&
      failure.includes(brokenUrl),
    )).toBe(true);
  });

  it("retries transport failures and reports timeout diagnostics without accepting content", async () => {
    let attempts = 0;
    const result = await checkPennsylvaniaSourceContract(async () => {
      attempts++;
      const error = new Error("connect timed out");
      Object.assign(error, { code: "ETIMEDOUT" });
      throw error;
    }, {
      maxRetries: 2,
      timeoutMs: 25,
      retryTransportDelay: () => 0,
    });

    expect(attempts).toBe(PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES.length * 3);
    expect(result.ok).toBe(false);
    expect(result.pages[0]).toMatchObject({
      failureKind: "transport",
      diagnostics: [
        { attempt: 1, kind: "timeout", retrying: true },
        { attempt: 2, kind: "timeout", retrying: true },
        { attempt: 3, kind: "timeout", retrying: false },
      ],
    });
    expect(result.pages[0].failures[0]).toContain("Retry from the supported Pennsylvania refresh environment");
    expect(result.pages[0].failures[0]).toContain("no source content was accepted");
  });

  it("retries a transient connection failure on the same PAlegis URL", async () => {
    const attemptsByUrl = new Map<string, number>();
    const requestedUrls: string[] = [];
    const result = await checkPennsylvaniaSourceContract(async (input) => {
      const requestedUrl = String(input);
      requestedUrls.push(requestedUrl);
      const attempts = (attemptsByUrl.get(requestedUrl) ?? 0) + 1;
      attemptsByUrl.set(requestedUrl, attempts);
      if (attempts === 1) {
        throw new Error("socket reset by peer");
      }
      const reference = PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES.find(
        (candidate) => buildPennsylvaniaOfficialSourceUrl(candidate.title, candidate.section) === requestedUrl,
      )!;
      return new Response(
        `<html><body><h1>Section ${reference.section}.0 - Title ${reference.title} - REPRESENTATIVE</h1><div>&sect; ${reference.section}.&nbsp;&nbsp;Representative section.</div><div>A person commits an offense when the statutory elements are met. This is complete official section text for the contract test.</div></body></html>`,
        { status: 200, headers: { "content-type": "text/html" } },
      );
    }, {
      maxRetries: 1,
      retryTransportDelay: () => 0,
    });

    expect(result.ok).toBe(true);
    expect(requestedUrls).toEqual(PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES.flatMap((reference) => {
      const requestedUrl = buildPennsylvaniaOfficialSourceUrl(reference.title, reference.section);
      return [requestedUrl, requestedUrl];
    }));
    expect(result.pages[0].diagnostics).toEqual([
      expect.objectContaining({ attempt: 1, kind: "connection", retrying: true }),
      expect.objectContaining({ attempt: 2, kind: "http", status: 200, retrying: false }),
    ]);
  });

  it("preserves the last manifest when every refresh failure is transport-only", async () => {
    const temporaryDirectory = mkdtempSync(join(tmpdir(), "pa-refresh-"));
    const temporaryManifest = join(temporaryDirectory, "manifest.json");
    const committedManifest = readFileSync(
      "scripts/data-review/output/pa-source-manifest.json",
      "utf8",
    );
    writeFileSync(temporaryManifest, committedManifest);

    try {
      const result = await refreshPennsylvaniaManifest({
        importedAt,
        outputPath: temporaryManifest,
        rateLimitMs: 0,
        fetchImpl: async () => {
          throw new Error("temporary PAlegis connection outage");
        },
        requestOptions: {
          maxRetries: 0,
          retryTransportDelay: () => 0,
        },
      });

      expect(result).toMatchObject({
        preservedManifest: true,
        wroteManifest: false,
        transportFailures: expect.any(Number),
        officialPageFailures: 0,
        contentContractFailures: 0,
      });
      expect(result.transportFailures).toBeGreaterThan(0);
      expect(readFileSync(temporaryManifest, "utf8")).toBe(committedManifest);
    } finally {
      rmSync(temporaryDirectory, { recursive: true, force: true });
    }
  });

  it("replaces the manifest after a refresh retrieves verified official content", async () => {
    const temporaryDirectory = mkdtempSync(join(tmpdir(), "pa-refresh-"));
    const temporaryManifest = join(temporaryDirectory, "manifest.json");
    const existingManifest = loadPennsylvaniaAuthorityManifest();
    const documentsBySourceKey = new Map(
      existingManifest.catalogRecords.flatMap((record) =>
        record.provisions.map((provision) => [provision.sourceKey, provision] as const),
      ),
    );
    const referencesByUrl = new Map(
      criminalCharges
        .filter((charge) => charge.jurisdiction === "PA")
        .flatMap((charge) => getPennsylvaniaReferences(charge.id))
        .flatMap((reference) => [
          [buildPennsylvaniaOfficialSourceUrl(reference.title, reference.section), reference] as const,
          [buildPennsylvaniaSourceUrl(reference.title, reference.section), reference] as const,
        ]),
    );

    const htmlForRequest = (input: string): string => {
      const url = new URL(input);
      const title = url.searchParams.get("ttl") ?? "";
      const chapter = url.searchParams.get("chpt") ?? "";
      const section = url.searchParams.get("sctn") ?? "";
      const reference = referencesByUrl.get(input);
      const requestedSection = reference?.section ?? section;
      const matchingProvision = [...documentsBySourceKey.values()].find((provision) =>
        provision.lawId === title &&
        (() => {
          const sourceUrl = new URL(provision.sourceUrl);
          return sourceUrl.searchParams.get("chpt") === chapter &&
            sourceUrl.searchParams.get("sctn") === section;
        })(),
      );
      if (!matchingProvision) {
        const approved = Object.values(PENNSYLVANIA_APPROVED_UNCONSOLIDATED_LEGACY_PROVISIONS)
          .find((candidate) => candidate.retrievalUrl === input);
        if (approved) {
          return `<html><body><div>Section ${approved.section.split("-").at(-1)}. ${approved.sectionTitle}.</div><div>${approved.requiredContent.join(" ")}.</div></body></html>`;
        }
        return `<html><body><h1>Section ${requestedSection}.0 - Title ${title} - TEST</h1><div>§ ${requestedSection}. Representative official section.</div><div>This is complete official section text for the refresh test and contains the requested statutory content.</div></body></html>`;
      }
      return `<html><body><h1>Section ${requestedSection}.0 - Title ${title} - TEST</h1><div>§ ${requestedSection}. ${matchingProvision.officialTitle}.</div><div>${matchingProvision.content}</div></body></html>`;
    };

    try {
      const result = await refreshPennsylvaniaManifest({
        importedAt,
        outputPath: temporaryManifest,
        rateLimitMs: 0,
        requestOptions: { maxRetries: 0 },
        fetchImpl: async (input) => new Response(htmlForRequest(String(input)), {
          status: 200,
          headers: { "content-type": "text/html" },
        }),
      });

      expect(result).toMatchObject({
        preservedManifest: false,
        wroteManifest: true,
        transportFailures: 0,
        officialPageFailures: 0,
        contentContractFailures: 0,
      });
      const refreshedManifest = JSON.parse(readFileSync(temporaryManifest, "utf8"));
      expect(refreshedManifest.generatedAt).toBe(importedAt.toISOString());
      expect(refreshedManifest.catalogRecords).toHaveLength(existingManifest.catalogRecords.length);
      expect(refreshedManifest.catalogRecords.filter((record: { disposition: string }) =>
        record.disposition === "retain" || record.disposition === "exact_alias_rename",
      )).toHaveLength(25);
    } finally {
      rmSync(temporaryDirectory, { recursive: true, force: true });
    }
  });

  it("flags redirects and never treats a legacy or secondary response as official", () => {
    const requestedUrl = buildPennsylvaniaOfficialSourceUrl("18", "2502");
    const result = validatePennsylvaniaSourceContract({
      requestedUrl,
      responseStatus: 302,
      responseUrl: requestedUrl,
      redirectLocation: "https://www.legis.state.pa.us/legacy-statute",
      contentType: "text/html",
      html: "",
    });
    expect(result.ok).toBe(false);
    expect(result.failures.join(" ")).toContain("unexpected redirect");
    expect(result.failures.join(" ")).toContain("official PAlegis.us");
  });

  it("flags missing section markers and changed PAlegis HTML structure", () => {
    const requestedUrl = buildPennsylvaniaOfficialSourceUrl("18", "2502");
    const result = validatePennsylvaniaSourceContract({
      requestedUrl,
      responseStatus: 200,
      responseUrl: requestedUrl,
      redirectLocation: null,
      contentType: "text/html",
      html: "<html><body><main><h1>Updated statute viewer</h1><p>Content moved.</p></main></body></html>",
    });
    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(expect.arrayContaining([
      "PAlegis HTML structure changed: expected an HTML/body shell and a Title 18 section heading",
      "PAlegis page is missing the expected § 2502 section marker",
    ]));
  });

  it("uses the existing citation overlay as input without trusting its secondary source URLs", () => {
    expect(CHARGE_CITATIONS["pa-sexual-assault-in-the-second-degree"]?.sourceUrl)
      .toContain("openlaws.us");
    expect(parsePennsylvaniaCitation(
      CHARGE_CITATIONS["pa-sexual-assault-in-the-second-degree"]?.citation ?? "",
    )).toEqual([{ title: "18", section: "3124.1", subdivision: null }]);
    expect(parsePennsylvaniaCitation("35 Pa. Stat. § 780-113(a)(30)")).toEqual([]);
    expect(parsePennsylvaniaCitation("72 P.S. § 7354")).toEqual([]);
  });
});