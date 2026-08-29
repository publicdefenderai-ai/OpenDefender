import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { criminalCharges } from "../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../shared/criminal-charge-citations";
import { loadPennsylvaniaAuthorityManifest } from "../server/data/pennsylvania-manifest-loader";
import {
  buildPennsylvaniaManifestRecord,
  buildPennsylvaniaOfficialSourceUrl,
  buildPennsylvaniaSourceDatabaseSeed,
  buildPennsylvaniaSourceKey,
  buildPennsylvaniaSourceUrl,
  parsePennsylvaniaCitation,
  validatePennsylvaniaManifestRecord,
  type PennsylvaniaSourceDocument,
} from "../server/data/pennsylvania-source-database-seed";
import {
  checkPennsylvaniaSourceContract,
  extractPennsylvaniaDocument,
  fetchPennsylvaniaDocument,
  PENNSYLVANIA_RETRIEVAL_SOURCE,
  PENNSYLVANIA_SOURCE_CONTRACT_REFERENCE,
  PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES,
  validatePennsylvaniaSourceContract,
} from "../scripts/data-review/import-pennsylvania-source-database";

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
  });
});