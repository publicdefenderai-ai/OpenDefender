import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import updates from "../shared/ohio-common-charge-updates.json";
import { getChargeById, isChargeIdRequiringReselection, classifyChargesForGuidance } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { search } from "../server/services/search-indexer";
import { OHIO_REVIEWED_SOURCES, validateOhioCommonCorrections, validateOhioReviewedRefreshReceipt, OHIO_REVIEWED_RECEIPT_PATH } from "../server/data/ohio-reviewed-source";
import { ohioRefreshExpiry } from "../scripts/data-review/refresh-ohio-reviewed-sources";
const evidence = JSON.parse(readFileSync("scripts/data-review/output/ohio-common-charge-evidence.json", "utf8"));
const legacyIds = ["oh-open-container", "oh-alcohol-in-park", "oh-littering", "oh-animal-cruelty-misdemeanor", "oh-illegal-fireworks", "oh-minor-in-possession"];
describe("Ohio common-charge correction delivery", () => {
  it("expires cached evidence from acquisition, not from a later cache check", () => {
    expect(ohioRefreshExpiry([{ retrievedAt: "2026-09-18T12:00:00Z" }, { retrievedAt: "2026-09-24T12:00:00Z" }])).toBe("2026-09-25T12:00:00.000Z");
    expect(() => ohioRefreshExpiry([{ retrievedAt: "invalid" }])).toThrow();
  });
  it.each(legacyIds)("requires explicit reselection for saved %s", id => {
    expect(isChargeIdRequiringReselection(id)).toBe(true);
    expect(getChargeById(id)).toBeUndefined();
    expect(classifyChargesForGuidance([id])).toEqual([]);
    expect(getChargeExplanation("Open container", "OH", "en", id)).toBeNull();
  });
  it.each(updates)("delivers corrected penalties and exceptions for $code to guidance in all locales", row => {
    const charge = getChargeById(row.id)!;
    expect(charge).toBeDefined();
    expect(classifyChargesForGuidance([row.id])[0].maxPenalty).toBe(row.text.en.degreeContext);
    for (const locale of ["en", "es", "zh"] as const) {
      const explanation = getChargeExplanation(row.name, "OH", locale, row.id)!;
      expect(explanation.plainSummary).toBe(row.text[locale].plainSummary);
      expect(explanation.degreeContext).toBe(row.text[locale].degreeContext);
    }
    const source = OHIO_REVIEWED_SOURCES.find(s => s.chargeId === row.id)!;
    expect(source.grading).toBe(charge.maxPenalty);
    expect(source.dependencies.some(d => d.section === "2929.28")).toBe(true);
  });
  it("finds exact citations and a common open-container label without reviving legacy IDs", () => {
    for (const row of updates) {
      const result = search({ query: row.code, language: "en", filters: { types: ["charge"], chargeIds: [`charge-${row.id}`] }, limit: 10 });
      expect(result.results.map(item => item.document.id)).toContain(`charge-${row.id}`);
    }
    const row = updates.find(row => row.code === "4301.62")!;
    const result = search({ query: "open container", language: "en", filters: { types: ["charge"], chargeIds: [`charge-${row.id}`] }, limit: 10 });
    expect(result.results.map(item => item.document.id)).toContain(`charge-${row.id}`);
  });
  it("preserves the different penalty ceilings rather than inheriting old generic values", () => {
    const penalty = (section: string) => updates.find(row => row.code === section)!.text.en.degreeContext;
    expect(penalty("3767.32")).toMatch(/60 days.*\$500/);
    expect(penalty("4301.62")).toMatch(/\$150.*no jail/);
    expect(penalty("4301.633")).toMatch(/180 days.*\$1,000/);
    expect(penalty("959.13")).toMatch(/90 days.*\$750/);
    expect(updates.find(row => row.code === "959.13")!.text.en.plainSummary).toContain("enclosure without exercise or fresh air");
  });
  it("rejects changed public wording, stale correction receipts and changed evidence", () => {
    const changed = structuredClone(updates);
    changed[0].text.en.degreeContext = "No possible jail";
    expect(() => validateOhioCommonCorrections(evidence, changed)).toThrow(/correction changed/);
    const badEvidence = structuredClone(evidence);
    badEvidence.documents["2929.28"].text += " alteration";
    expect(() => validateOhioCommonCorrections(badEvidence)).toThrow(/source changed/);
    const receipt = JSON.parse(readFileSync(OHIO_REVIEWED_RECEIPT_PATH, "utf8"));
    receipt.reportHash = evidence.baseReportHash;
    expect(validateOhioReviewedRefreshReceipt(receipt, new Date(receipt.checkedAt))).toContain("mismatched");
  });
});
