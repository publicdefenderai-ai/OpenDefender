import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { getChargeExplanation } from "../shared/charge-explanations";
import loss from "../shared/texas-property-loss.json";
import evidence from "../scripts/data-review/output/texas-property-loss-evidence.json";
import ranking from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import first25 from "../scripts/data-review/output/texas-2025-arrest-priorities.json";

it("selects six codes from the extended, identically ranked DPS workbook", () => {
  expect(ranking.sha256).toBe(first25.sha256);
  expect(ranking.top75.slice(0,25)).toEqual(first25.top25);
  expect(new Set(ranking.top75.map(r=>r.code)).size).toBe(75);
  const reviewed = new Set(loss.map(row => row.dpsCode).filter(Boolean));
  const mapped = ranking.top75.map((row,i) => ({...row,rank:i+1})).filter(r => reviewed.has(r.code));
  expect(mapped.map(r=>r.rank)).toEqual([28,30,48,59,67,68]);
  expect(mapped.reduce((n,r)=>n+r.adult,0)).toBe(23371);
});

it("binds the financial-loss boundaries and the distinct firearm theft provision", () => {
  const bands = loss.filter(r=>r.code.startsWith("28.03("));
  expect(bands.map(r => r.references[1].subdivision)).toEqual(
    ["(b)(1)(A)", "(b)(2)", "(b)(3)(A)", "(b)(4)(A)", "(b)(5)(A)", "(b)(6)(A)", "(b)(7)"]);
  expect(bands.map(r=>r.name.slice(r.name.indexOf("financial loss ")+15,-1))).toEqual([
    "under $100","$100 to under $750","$750 to under $2,500","$2,500 to under $30,000",
    "$30,000 to under $150,000","$150,000 to under $300,000","$300,000 or more"]);
  for (const row of bands) expect(row.conduct).toContain("above $750 and below $2,500");
  expect(loss.find(r=>r.dpsCode==="23990008")?.references).toContainEqual({
    code:"PE",section:"46.01",subdivision:"(3)",supportRole:"grading"});
  expect(getChargeById("tx-criminal-mischief")?.maxPenalty).toContain("first-degree felony");
  expect(resolveGuidanceCharge({code:"28.03",name:"old answer",classification:"misdemeanor"},"TX")).toBeUndefined();
  expect(resolveGuidanceCharge({id:"tx-criminal-mischief",code:"28.03",name:"old answer",classification:"misdemeanor"},"TX")?.id).toBe("tx-criminal-mischief");
});

it("requires each official conduct, grading and punishment link and accurately marks translations", () => {
  const docs = new Map(Object.entries(evidence));
  const manifest = loadTexasAuthorityManifest();
  for (const row of loss) {
    const record = manifest.catalogRecords.find(r=>r.chargeId===row.id)!;
    expect(record.provisions.map(p=>[p.section,p.subdivision,p.supportRole])).toEqual(
      row.references.map(ref=>[ref.section,ref.subdivision,ref.supportRole]));
    for (const p of record.provisions) {
      const source = docs.get("PE:"+p.section)!;
      expect(p.content).toBe(source.text);
      expect(p.contentHash).toBe(createHash("sha256").update(JSON.stringify(source.text)).digest("hex"));
    }
    const charge = getChargeById(row.id)!;
    expect(getVerifiedCitation(charge)).toBe(row.citation);
    if (row.code.startsWith("31.")) expect(getInstructionRef(charge)).toContain("CPJC 31.2");
    else expect(getInstructionRef(charge)).toBeNull();
    expect(getChargeExplanation(row.name,"TX","zh",row.id)).toMatchObject({plainSummary:row.conduct,untranslated:true});
  }
});
