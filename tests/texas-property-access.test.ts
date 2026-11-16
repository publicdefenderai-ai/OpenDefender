import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import { getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import rows from "../shared/texas-property-access.json";
import evidence from "../scripts/data-review/output/texas-property-access-evidence.json";
import benchmark from "../scripts/data-review/output/texas-2025-arrest-priorities.json";

it("keeps the ambiguous historical theft ID unavailable and resolves every new branch separately", () => {
  const id = "tx-theft-under-2500";
  expect(getChargeById(id)).toBeUndefined();
  expect(getChargeExplanation("Theft (Under $2,500)", "TX", "en", id)).toBeNull();
  expect(resolveGuidanceCharge({ id, code: "31.03", name: "Theft", classification: "misdemeanor" }, "TX")).toBeUndefined();
  for (const code of ["31.03", "30.05", "31.07"]) {
    expect(resolveGuidanceCharge({code, name:"Property", classification:"misdemeanor"}, "TX")).toBeUndefined();
  }
  const manifest = loadTexasAuthorityManifest();
  expect(manifest.catalogRecords.find(r => r.chargeId === id)?.disposition).toBe("require_exact_reselection");
  const docs = new Map(Object.entries(evidence));
  for (const row of rows) {
    const charge = getChargeById(row.id)!;
    expect(getVerifiedCitation(charge)).toBe(row.citation);
    expect(getInstructionRef(charge)).toMatch(/CPJC (30\.15|31\.[29])/);
    const record = manifest.catalogRecords.find(r => r.chargeId === row.id)!;
    expect(record.provisions.map(p => [p.lawId,p.section,p.subdivision,p.supportRole]))
      .toEqual(row.references.map(r => [r.code,r.section,r.subdivision,r.supportRole]));
    for (const p of record.provisions) {
      const doc = docs.get(p.lawId + ":" + p.section)!;
      expect(p.content).toBe(doc.text);
      expect(createHash("sha256").update(JSON.stringify(doc.text)).digest("hex")).toBe(p.contentHash);
    }
    for (const language of ["en", "es", "zh"]) {
      expect(getChargeExplanation(row.name, "TX", language, row.id)).toMatchObject({
        plainSummary: row.conduct, degreeContext: row.penalty, untranslated: language !== "en", translationDraft: false,
      });
    }
  }
});

it("binds ranked and adjacent branches to the correct punishment and applicable limits", () => {
  const ranked = benchmark.top25.filter(r => rows.some(row => row.dpsCode === r.code));
  expect(ranked.map(r => [r.code, r.adult])).toEqual([["57070020",30751],["24110003",8401]]);
  expect(rows.map(r => r.code)).toEqual(["31.03(e)(1)", "31.03(e)(2)(B)", "31.03(e)(3)", "30.05(d)(1)", "31.07(b)"]);
  expect(rows[0].penalty).toContain("fine up to $500");
  expect(rows[1].conduct).toContain("previous conviction");
  expect(rows[2].conduct).toContain("at least $750 and below $2,500");
  expect(rows[3].penalty).toContain("$200 Class C ceiling");
  expect(rows[4].conduct).toContain("know the owner did not effectively consent");
});
