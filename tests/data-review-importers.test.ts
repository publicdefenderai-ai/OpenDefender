import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  parseFloridaCommissionTable,
  type CommissionEntry,
} from "../scripts/data-review/import-commission-citations";
import {
  buildOfficialComparisonReport,
  fetchOfficialDocuments,
  isOfficialPromotionEligible,
  loadOfficialFixture,
  parseCitationSections,
  parseMichiganOfficialDocument,
  parseMinnesotaOfficialDocument,
  parseVirginiaOfficialDocument,
} from "../scripts/data-review/official-code-verifier";
import { extractFloridaDocument, extractLatestFloridaEffectiveDate } from "../scripts/data-review/import-florida-source-database";
import {
  parseVerificationReport,
  promoteEntry,
} from "../scripts/data-review/promote-verified-citations";

const IMPORTED_AT = new Date("2026-08-30T00:00:00.000Z");

describe("source importer parser fixtures", () => {
  it("replays official MN, VA, and MI fixtures with source hashes and currentness evidence", () => {
    const fixtureDir = "tests/fixtures/official-code";
    for (const state of ["MN", "VA", "MI"] as const) {
      const documents = loadOfficialFixture(state, fixtureDir);
      expect(documents.size).toBeGreaterThan(0);
      for (const document of documents.values()) {
        expect(document.sourceHash).toMatch(/^[a-f0-9]{64}$/);
        expect(document.currentness.status).toBe(state === "MN" ? "stale" : "verified");
        expect(document.text.length).toBeGreaterThan(20);
        expect(document.sourceTransport).toBe("fixture");
      }
    }
  });

  it("does not turn subsection qualifiers into fake statute sections", () => {
    expect(parseCitationSections("Minn. Stat. §§ 609.17, subd. 4, 609.24")).toEqual([
      "609.17",
      "609.24",
    ]);
  });

  it("surfaces Michigan TLS failures without weakening certificate verification", async () => {
    const result = await fetchOfficialDocuments("MI", ["750.321"], {
      fetchImpl: async () => {
        throw new Error("fetch failed: UNABLE_TO_VERIFY_LEAF_SIGNATURE");
      },
    });
    expect(result.documents.size).toBe(0);
    expect(result.errors["750.321"]).toContain("UNABLE_TO_VERIFY_LEAF_SIGNATURE");
  });

  it("detects stale cached documents and replaces them instead of replaying them", async () => {
    const cacheDir = mkdtempSync(join("/tmp", "official-code-cache-"));
    const cachePath = join(cacheDir, "mn-609_185.json");
    writeFileSync(cachePath, JSON.stringify({
      cacheSchemaVersion: 1,
      state: "MN",
      section: "609.185",
      sourceUrl: "https://www.revisor.mn.gov/statutes/cite/609.185",
      retrievedAt: "2020-01-01T00:00:00.000Z",
      html: "<p>2020 Minnesota Statutes</p><h1>609.185 Old title.</h1>",
    }));
    let requests = 0;
    try {
      const result = await fetchOfficialDocuments("MN", ["609.185"], {
        cacheDir,
        fetchImpl: async () => {
          requests += 1;
          return new Response("<p>2026 Minnesota Statutes</p><h1>609.185 Current title.</h1>");
        },
      });
      expect(requests).toBe(1);
      expect(result.cacheStatus["609.185"]).toMatchObject({
        status: "refreshed",
        previousStatus: "stale",
      });
      expect(result.documents.get("609.185")?.currentness).toMatchObject({
        status: "verified",
        editionYear: 2026,
      });
    } finally {
      rmSync(cacheDir, { recursive: true, force: true });
    }
  });

  it("extracts official titles from each state adapter and preserves Michigan's independent instruction source", () => {
    expect(parseMinnesotaOfficialDocument(
      "<p>2024 Minnesota Statutes</p><h1>609.185 MURDER IN THE FIRST DEGREE.</h1><p>Elements.</p>",
      "609.185",
    ).title).toBe("MURDER IN THE FIRST DEGREE");
    expect(parseVirginiaOfficialDocument(
      "<div id=\"printStuff\"><div id=\"printHeader\">Code of Virginia</div><div id=\"printDate\">9/15/2026</div></div><article id=\"vacode\"><h2><span>§ 18.2-32</span>. First and second degree murder defined; punishment.</h2><section class=\"body editable\"><p>Elements.</p></section></article>",
      "18.2-32",
    )).toMatchObject({
      title: "First and second degree murder defined; punishment",
      currentness: {
        status: "verified",
        editionYear: 2026,
        evidence: "printDate 9/15/2026",
      },
    });
    expect(parseMichiganOfficialDocument(
      "<p>Michigan Compiled Laws, current through 2026 Michigan Public Acts</p><h1>750.316 Murder.</h1><p>Elements.</p>",
      "750.316",
      undefined,
      undefined,
      { reference: "CJI2d 16.1", sourceUrl: "https://www.courts.michigan.gov/rules-administrative-orders-and-jury-instructions/current-rules-and-jury-instructions/model-criminal-jury-instructions2/" },
    ).instructionEvidence).toMatchObject({
      reference: "CJI2d 16.1",
      independentSource: true,
    });
  });

  it("ranks exact mappings, likely aliases, shared citations, and unresolved results with reason codes", () => {
    const documents = loadOfficialFixture("VA", "tests/fixtures/official-code");
    const report = buildOfficialComparisonReport("VA", [
      { id: "va-murder-in-the-first-degree", name: "Murder in the first degree", citation: "Va. Code Ann. § 18.2-32" },
      { id: "va-murder-in-the-second-degree", name: "Murder in the second degree", citation: "Va. Code Ann. § 18.2-32" },
      { id: "va-trespassing", name: "Trespassing", citation: "Va. Code Ann. § 18.2-119" },
      { id: "va-land-entry", name: "Land entry", citation: "Va. Code Ann. § 18.2-119" },
      { id: "va-missing", name: "Missing section", citation: "Va. Code Ann. § 18.2-999" },
    ], documents);

    expect(report.summary.compoundOrSharedCitations).toBe(1);
    expect(report.mappings.find((mapping) => mapping.chargeId === "va-trespassing")).toMatchObject({
      mappingClass: "exact",
      reasonCode: "official_section_and_title_match",
      sourceHash: expect.stringMatching(/^[a-f0-9]{64}$/),
    });
    expect(report.mappings.find((mapping) => mapping.chargeId === "va-missing")).toMatchObject({
      mappingClass: "unresolved",
      reasonCode: "official_section_not_found",
    });
    expect(report.unresolved).toEqual([
      expect.objectContaining({ chargeId: "va-missing", reasonCode: "official_section_not_found" }),
    ]);
    expect(isOfficialPromotionEligible(report.mappings.find((mapping) =>
      mapping.chargeId === "va-trespassing"))).toBe(true);
    expect(isOfficialPromotionEligible(report.mappings.find((mapping) =>
      mapping.chargeId === "va-land-entry"))).toBe(false);
  });

  it("parses Florida commission rows and tolerates missing optional descriptions", () => {
    const html = `
      <table>
        <tr><th>Statute</th><th>Description</th><th>Degree</th><th>Level</th></tr>
        <tr><td>782.04(1)(a)</td><td>Murder in the first degree</td><td>F-1</td><td>10</td></tr>
        <tr><td>784.021</td><td>Aggravated assault</td><td>F-3</td><td>6</td></tr>
        <tr><td>777.04(1)</td><td></td><td></td><td></td></tr>
        <tr><td>not a statute</td><td>Ignore this row</td></tr>
      </table>
    `;

    const parsed = parseFloridaCommissionTable(html);

    expect(parsed.get("782.04")).toEqual<CommissionEntry>({
      section: "782.04",
      description: "Murder in the first degree",
      classification: "FL Criminal Punishment Code",
      sourceUrl: "https://www.flsenate.gov/Laws/Statutes/2024/782.04",
    });
    expect(parsed.get("784.021")?.description).toBe("Aggravated assault");
    expect(parsed.get("777.04")).toMatchObject({
      section: "777.04",
      description: "",
    });
    expect(parsed.has("not a statute")).toBe(false);
  });

  it("keeps Florida statute extraction deterministic when optional history and effective-date fields are absent", () => {
    const html = `
      <div class="Section">
        <span class="SectionNumber">784.021&#x2003;</span>
        <span class="Catchline"><span class="CatchlineText">Aggravated assault.</span></span>
        <span class="SectionBody"><div class="Subsection"><span class="Number">(1)</span><span class="Text">An assault.</span></div></span>
      </div>
      </body>
    `;

    const parsed = extractFloridaDocument(
      html,
      "784.021",
      "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute",
      IMPORTED_AT,
    );

    expect(parsed).toMatchObject({
      section: "784.021",
      title: "Aggravated assault",
      effectiveDateStart: null,
    });
    expect(extractLatestFloridaEffectiveDate("No effective date is present here.")).toBeNull();
    expect(extractLatestFloridaEffectiveDate("Effective someday, 2026.")).toBeNull();
  });

  it("validates generated citation reports while preserving optional review fields when present", () => {
    const report = parseVerificationReport({
      runAt: "2026-08-30T00:00:00.000Z",
      totalChecked: 2,
      okCount: 1,
      needsReviewCount: 1,
      results: [
        {
          chargeId: "ca-example",
          chargeName: "Example charge",
          jurisdiction: "CA",
          citation: "Cal. Penal Code § 1",
          currentConfidence: "medium",
          status: "verified",
          needsManualReview: false,
          reason: "Verified against the official source.",
          checkedAt: "2026-08-30T00:00:00.000Z",
        },
        {
          chargeId: "tx-example",
          chargeName: "Example Texas charge",
          jurisdiction: "TX",
          citation: null,
          currentConfidence: "medium",
          status: "api_error",
          needsManualReview: false,
          reason: 42,
          checkedAt: { malformed: true },
        },
      ],
    });

    expect(report.results[0]).toMatchObject({
      chargeId: "ca-example",
      reason: "Verified against the official source.",
      checkedAt: "2026-08-30T00:00:00.000Z",
    });
    expect(report.results[1]).not.toHaveProperty("reason");
    expect(report.results[1]).not.toHaveProperty("checkedAt");
  });

  it("rejects malformed required report fields instead of silently reducing coverage", () => {
    expect(() => parseVerificationReport({
      runAt: "2026-08-30T00:00:00.000Z",
      totalChecked: 1,
      okCount: 1,
      needsReviewCount: 0,
      results: [{
        chargeId: "ca-example",
        chargeName: "Example charge",
        jurisdiction: "CA",
        citation: "Cal. Penal Code § 1",
        currentConfidence: "medium",
        status: "verified",
        needsManualReview: "false",
      }],
    })).toThrow("missing required fields");
  });

  it("applies a verified JSON result to the intended overlay entry only", () => {
    const report = parseVerificationReport({
      runAt: "2026-08-30T00:00:00.000Z",
      totalChecked: 1,
      okCount: 1,
      needsReviewCount: 0,
      results: [{
        chargeId: "ca-example",
        chargeName: "Example charge",
        jurisdiction: "CA",
        citation: "Cal. Penal Code § 1",
        currentConfidence: "medium",
        status: "verified",
        needsManualReview: false,
      }],
    });
    const overlay = [
      'const citations = {',
      '  "ca-example": { citation: "Cal. Penal Code § 1", confidence: "medium", lastVerified: "2026-01", source: "old" },',
      '  "ca-other": { citation: "Cal. Penal Code § 2", confidence: "medium", lastVerified: "2026-01", source: "old" },',
      '};',
    ].join("\n");

    const promoted = promoteEntry(overlay, report.results[0].chargeId, "2026-08");

    expect(promoted.promoted).toBe(true);
    expect(promoted.source).toContain('"ca-example": { citation: "Cal. Penal Code § 1", confidence: "high"');
    expect(promoted.source).toContain('lastVerified: "2026-08"');
    expect(promoted.source).toContain('"ca-other": { citation: "Cal. Penal Code § 2", confidence: "medium"');
  });
});