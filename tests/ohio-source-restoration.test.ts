import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import corrections from "../shared/ohio-source-corrections.json";
import { isChargeIdRequiringReselection, getSelectableCharges } from "../shared/criminal-charges";
import holds from "../shared/ohio-source-change-holds.json";
import { OHIO_REVIEWED_DEFINITIONS } from "../shared/ohio-reviewed-batch";
import { getChargeExplanation } from "../shared/charge-explanations";
import { OHIO_REVIEWED_SOURCES, validateOhioSourceCorrections, validateOhioReviewedRefreshReceipt } from "../server/data/ohio-reviewed-source";
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS, ohioChapter2903Evidence } from "../server/data/ohio-chapter-2903-source";
import { buildOhioRestorationReceipts } from "../scripts/data-review/restore-ohio-reviewed-receipts";
const packet = JSON.parse(readFileSync("scripts/data-review/output/ohio-source-correction-evidence.json", "utf8"));
const historical = JSON.parse(readFileSync("scripts/data-review/output/ohio-substantive-review.json", "utf8"));
const now = new Date("2026-11-04T12:00:00Z");
function freshEvidence() {
  const documents: Record<string, any> = {};
  for (const row of OHIO_REVIEWED_SOURCES) for (const d of [row.offense, ...row.dependencies]) documents[d.section] = {...d, retrievedAt: now.toISOString()};
  for (const row of OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS) for (const {document: d} of ohioChapter2903Evidence(row)) documents[d.section] = {...d, retrievedAt: now.toISOString()};
  return {documents};
}
describe("Ohio source correction restoration", () => {
  it("accounts for all 18 records and preserves the existing hold", () => {
    expect(packet.records).toHaveLength(18);
    expect(corrections).toHaveLength(11);
    expect(holds.some(h => h.sections.includes("1509.01"))).toBe(true);
    expect(OHIO_REVIEWED_SOURCES).toHaveLength(104);
    expect(OHIO_REVIEWED_SOURCES.some(r => r.chargeId === "oh-orc-2911-21-criminal-trespass")).toBe(false);
    validateOhioSourceCorrections();
  });
  it("requires explicit reselection from the superseded legacy menacing record", () => {
    expect(isChargeIdRequiringReselection("oh-menacing")).toBe(true);
    expect(getSelectableCharges().some(r => r.id === "oh-menacing")).toBe(false);
    expect(getSelectableCharges().some(r => r.id === "oh-orc-2903-22-menacing")).toBe(true);
  });
  it("preserves the operative dangerous-drug quotes for both hazing records", () => {
    const old = JSON.parse(readFileSync("scripts/data-review/output/ohio-hazing-and-protection-evidence.json", "utf8"))
      .documents.find((d: any) => d.section === "4729.01");
    const records = OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.filter(r => r.chargeId.includes("hazing"));
    expect(records).toHaveLength(2);
    for (const row of records) {
      const d = ohioChapter2903Evidence(row).find(({document}) => document.section === "4729.01")!.document;
      expect(d.effectiveDateStart).toBe("2026-10-09");
      for (const span of d.quotedSpans.filter(s => s.kind === "offense")) expect(old.text).toContain(span.quote);
    }
  });
  it("does not change fields outside the explicit product corrections", () => {
    for (const c of corrections) {
      const row = OHIO_REVIEWED_DEFINITIONS.find(r => r.id === c.id)!;
      expect(row.text.en).toEqual({...c.baselineEnglish, ...c.englishFieldChanges});
    }
    for (const r of packet.records.filter((r: any) => r.classification === "dependency_evidence_only")) {
      expect(corrections.some(c => c.id === r.id)).toBe(false);
    }
  });
  it("labels changed English fallback in both supported non-English locales", () => {
    for (const c of corrections) for (const lang of ["es", "zh"]) {
      const row = OHIO_REVIEWED_DEFINITIONS.find(r => r.id === c.id)!;
      const explanation = getChargeExplanation(row.name, "OH", lang, row.id)!;
      expect(explanation.plainSummary).toBe(row.text.en.plainSummary);
      expect(explanation.degreeContext).toBe(row.text.en.degreeContext);
      expect(explanation.untranslated).toBe(true);
      expect(explanation.translationDraft).toBe(false);
    }
  });
  it("rejects orphaned records and corrupt quote bindings", () => {
    const orphan = structuredClone(packet); orphan.records[0].id = "oh-orc-unknown";
    expect(() => validateOhioSourceCorrections(orphan)).toThrow(/Unaccounted/);
    const quote = structuredClone(packet); quote.records[0].evidenceSpans[0].start++;
    expect(() => validateOhioSourceCorrections(quote)).toThrow(/quote changed/);
    const hash = structuredClone(packet); hash.documents["2903.06"].text += " altered";
    expect(() => validateOhioSourceCorrections(hash)).toThrow(/source/);
  });
  it("proves the extra 2913.04 change is typography and publisher metadata only", () => {
    expect(packet.documents["2913.04"].text).toBe(
      historical.sourceEvidence["2913.04"].text.replace("(C) E xcept", "(C) Except") + "\nLast updated October 29, 2026 at 4:16 PM");
  });
  it("keeps common source identities consistent across every record", () => {
    const hashes = new Map<string, string>();
    for (const r of OHIO_REVIEWED_SOURCES) for (const d of [r.offense, ...r.dependencies]) {
      if (hashes.has(d.section)) expect(d.contentHash).toBe(hashes.get(d.section));
      hashes.set(d.section, d.contentHash);
    }
  });
  it("binds receipt expiry to the oldest genuine acquisition, not the replay date", () => {
    const input = freshEvidence(); input.documents["2903.06"].retrievedAt = "2026-11-03T12:00:00Z";
    const result = buildOhioRestorationReceipts(input, now);
    expect(result.reviewedReceipt.expiresAt).toBe("2026-11-10T12:00:00.000Z");
    expect(validateOhioReviewedRefreshReceipt(result.reviewedReceipt, now)).toBeNull();
    expect(validateOhioReviewedRefreshReceipt(result.reviewedReceipt, new Date(result.reviewedReceipt.expiresAt))).not.toBeNull();
  });
  it("rejects unavailable, changed, stale and future acquisition evidence", () => {
    for (const change of ["missing", "changed", "stale", "future"] as const) {
      const input = freshEvidence();
      if (change === "missing") delete input.documents["2903.06"];
      if (change === "changed") input.documents["2903.06"].text += " changed";
      if (change === "stale") input.documents["2903.06"].retrievedAt = "2026-10-01T00:00:00Z";
      if (change === "future") input.documents["2903.06"].retrievedAt = "2027-01-01T00:00:00Z";
      expect(() => buildOhioRestorationReceipts(input, now)).toThrow(/2903.06/);
    }
  });
});
