import { describe, expect, it } from "vitest";
import {
  parseFloridaCommissionTable,
  type CommissionEntry,
} from "../scripts/data-review/import-commission-citations";
import { extractFloridaDocument, extractLatestFloridaEffectiveDate } from "../scripts/data-review/import-florida-source-database";
import {
  parseVerificationReport,
  promoteEntry,
} from "../scripts/data-review/promote-verified-citations";

const IMPORTED_AT = new Date("2026-08-30T00:00:00.000Z");

describe("source importer parser fixtures", () => {
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