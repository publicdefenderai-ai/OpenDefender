import { createHash } from "node:crypto";
import { it, expect } from "vitest";
import { getChargeById, getVerifiedCitation, getInstructionRef } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { isTexasHeldTheftSelection } from "../shared/texas-reviewed";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import rows from "../shared/texas-ranked-arrest.json";
import evidence from "../scripts/data-review/output/texas-ranked-arrest-evidence.json";
import ranking from "../scripts/data-review/output/texas-2025-arrest-priorities.json";

it("preserves both vehicle amendments, the appellate reconciliation and the instruction's motor-vehicle scope", () => {
  const section = evidence["PE:38.04"].text;
  expect(section.match(/\(b\) An offense under this section is a Class A misdemeanor/g)).toHaveLength(2);
  const row = rows.find(r => r.id === "tx-pc-38-04-vehicle")!;
  expect(row.penalty).toContain("without requiring a prior");
  expect(getChargeExplanation(row.name, "TX", "en", row.id)?.sources?.some(source => source.url?.includes("03-18-00709-cr-opinion.pdf"))).toBe(true);
  expect(getInstructionRef(getChargeById(row.id)!)).toContain("motor vehicle");
  expect(getInstructionRef(getChargeById("tx-evading-arrest")!)).toBeNull();
  const ids = rows.filter(r => r.dpsCode).map(r => r.dpsCode);
  expect(ranking.top25.filter(r => ids.includes(r.code)).reduce((n,r) => n+r.adult,0)).toBe(50462);
});

it("keeps force and unlawful-search language scoped and separates a refusal from lying to police", () => {
  expect(rows.find(r => r.id === "tx-pc-38-03-c")?.penalty).toContain("does not list transportation alone");
  expect(rows.find(r => r.id === "tx-failure-to-identify")?.conduct).toContain("lawfully arrested");
  const falseId = rows.find(r => r.dpsCode === "48990009")!;
  expect(falseId.conduct).toContain("valid arrest warrant");
  expect(falseId.conduct).toContain("good cause to believe");
  expect(falseId.code).toBe("38.02(d)(2)");
  expect(falseId.penalty).toContain("Class A misdemeanor");
  for (const code of ["38.03","38.04","38.02"]) {
    expect(resolveGuidanceCharge({code,name:"Historical answer",classification:"misdemeanor"},"TX")).toBeUndefined();
  }
  expect(isTexasHeldTheftSelection({name:"A different old label",code:"31.03"},"TX")).toBe(true);
  expect(isTexasHeldTheftSelection({name:"A different old label",code:"31.03(e)(3)"},"TX")).toBe(false);
  expect(isTexasHeldTheftSelection({name:"A different old label",code:"31.03"},"FL")).toBe(false);
});

it("reproduces every required source binding and keeps unreviewed translations marked", () => {
  const manifest = loadTexasAuthorityManifest();
  const docs = new Map(Object.entries(evidence));
  for (const row of rows) {
    const record = manifest.catalogRecords.find(r => r.chargeId === row.id)!;
    expect(record.provisions.map(p => [p.lawId,p.section,p.subdivision,p.supportRole]))
      .toEqual(row.references.map(r => [r.code,r.section,r.subdivision,r.supportRole]));
    for (const p of record.provisions) {
      const source = docs.get(p.lawId + ":" + p.section)!;
      expect(p.content).toBe(source.text);
      expect(createHash("sha256").update(JSON.stringify(source.text)).digest("hex")).toBe(p.contentHash);
    }
    expect(getVerifiedCitation(getChargeById(row.id)!)).toBe(row.citation);
    for (const language of ["en", "es", "zh"]) {
      expect(getChargeExplanation(row.name,"TX",language,row.id)).toMatchObject({
        plainSummary:row.conduct, degreeContext:row.penalty, untranslated:language !== "en", translationDraft:false,
      });
    }
  }
  expect(manifest.catalogRecords.find(r => r.chargeId === "tx-resisting-arrest")?.disposition).toBe("require_exact_reselection");
});
