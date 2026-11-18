import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-card-identity-fraud.json";
import evidence from "../scripts/data-review/output/texas-card-identity-fraud-evidence.json";
import priorities from "../scripts/data-review/output/texas-card-identity-fraud-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import { criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { needsTexasChargeReselection } from "../shared/texas-reviewed";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";
const row=(suffix:string)=>rows.find(r=>r.id==="tx-pc-"+suffix)!;

it("accounts for the two DPS codes once and all bounded conduct choices",()=>{
 expect(rows).toHaveLength(28);expect(new Set(rows.map(r=>r.id)).size).toBe(28);
 expect(priorities.rows.map(r=>r.rank)).toEqual([54,58]);
 expect(priorities.rows.reduce((n,r)=>n+r.adult,0)).toBe(5594);
 for(const {rank,...r} of priorities.rows)expect(r).toEqual(first75.top75[rank-1]);
 expect(rows.filter(r=>r.code.startsWith("32.31("))).toHaveLength(12);
 expect(rows.filter(r=>r.code.startsWith("32.51("))).toHaveLength(12);
 expect(rows.filter(r=>r.code.startsWith("32.315("))).toHaveLength(4);
});
it("does not flatten distinct card conduct or elderly grading",()=>{
 expect(row("32-31-1-a").conduct).toContain("knowing");
 expect(row("32-31-1-b").conduct).toContain("notice-based presumptions");
 expect(row("32-31-4").conduct).toContain("receiving alternative");
 expect(row("32-31-9").conduct).toContain("other than the cardholder’s signature");
 expect(row("32-31-11").conduct).toContain("in writing");
 for(const r of rows.filter(r=>r.code.startsWith("32.31("))){
  expect(r.penalty).toContain("State jail felony");expect(r.penalty).toContain("65 or older");
  expect(r.penalty).toContain("two to ten years");
 }
});
it("separates items from persons and documents, and preserves consent distinctions",()=>{
 for(const r of rows.filter(r=>r.code.startsWith("32.51("))){
  expect(r.conduct).toContain("not automatically the number of documents or people");
  expect(r.conduct).toContain("not two separate items");
  expect(r.conduct).toContain("three-person intent presumption");
 }
 expect(row("32-51-person-under-5").conduct).toContain("without that person’s consent");
 expect(row("32-51-deceased-under-5").conduct).toContain("without legal authorization");
 expect(row("32-51-child-under-5").conduct).toContain("does not make absence");
 for(const [suffix,grade] of [["under-5","State jail"],["5-to-9","Third-degree"],["10-to-49","Second-degree"],["50-plus","First-degree"]]){
  expect(row("32-51-person-"+suffix).penalty.startsWith(grade)).toBe(true);
  expect(row("32-315-"+suffix).penalty.startsWith(grade)).toBe(true);
 }
 expect(row("32-51-person-50-plus").penalty).toContain("not this already first-degree");
});
it("does not import identity-information enhancements or presumptions into card-data offenses",()=>{
 for(const r of rows.filter(r=>r.code.startsWith("32.315("))){
  expect(r.conduct).toContain("lack of consent");expect(r.conduct).toContain("not intent");
  expect(r.conduct).toContain("not counterfeit cards");
  expect(r.penalty).toContain("does not supply §32.51");
 }
});
it("requires exact reselection for legacy fraud including differently named code-only saves",()=>{
 const m=loadTexasAuthorityManifest();const seed=buildTexasSourceDatabaseSeed(m);
 for(const [id,code] of [["tx-identity-theft","32.51"],["tx-credit-card-fraud","32.31"]]){
  expect(seed.selectableChargeIds).not.toContain(id);expect(getChargeById(id)).toBeUndefined();
  expect(getChargeExplanation("Old fraud", "TX", "en", id)).toBeNull();
  expect(resolveGuidanceCharge({id,name:"Old fraud",code,classification:"felony"},"TX")).toBeUndefined();
  expect(needsTexasChargeReselection({name:"Different AI name",code},"TX")).toBe(true);
  const forged=structuredClone(m);const r=forged.catalogRecords.find(r=>r.chargeId===id)!;r.disposition="retain";
  expect(()=>buildTexasSourceDatabaseSeed(forged)).toThrow("fraud identity requires exact reselection");
 }
 expect(needsTexasChargeReselection({name:"Identity theft",code:"32.51"},"CA")).toBe(false);
});
it("keeps publisher mappings within verified conduct and ordinary grade scope",()=>{
 expect(getInstructionRef(getChargeById("tx-pc-32-31-1-a")!)).toContain("32.11");
 expect(getInstructionRef(getChargeById("tx-pc-32-31-1-b")!)).toBeNull();
 expect(getInstructionRef(getChargeById("tx-pc-32-51-person-under-5")!)).toContain("32.41");
 expect(getInstructionRef(getChargeById("tx-pc-32-51-person-5-to-9")!)).toContain("32.42");
 expect(getInstructionRef(getChargeById("tx-pc-32-51-child-under-5")!)).toBeNull();
 expect(getInstructionRef(getChargeById("tx-pc-32-315-under-5")!)).toContain("digital-imprint");
});
it("rebuilds individually supported identities and fails closed on altered or missing evidence", () => {
  const sources=new Map(Object.entries(evidence));
  const manifest=loadTexasAuthorityManifest();
  const generatedAt=new Date(Math.max(...Object.values(evidence).map(doc=>Date.parse(doc.retrievedAt))));
  for (const r of rows) {
    const charge=getChargeById(r.id)!;
    const docs=r.references.map(ref=>{
      const d=sources.get(ref.code+":"+ref.section)!;
      expect(d.textSha256).toBe(createHash("sha256").update(d.text).digest("hex"));
      expect(d.snapshotHash).toBe(createHash("sha256").update(JSON.stringify(d.text)).digest("hex"));
      expect(d.sourceUrl).toBe(`https://tcss.legis.texas.gov/resources/${ref.code}/htm/${ref.code}.${ref.section.split('.')[0]}.htm#${ref.section}`);
      return {...d,retrievedAt:new Date(d.retrievedAt)};
    });
    const actual=buildTexasManifestRecord(charge,docs,generatedAt);
    expect(actual).toEqual(manifest.catalogRecords.find(record=>record.chargeId===r.id));
    expect(actual.provisions.map(p=>[p.lawId,p.section,p.subdivision,p.supportRole])).toEqual(r.references.map(ref=>[ref.code,ref.section,ref.subdivision,ref.supportRole]));
    expect(buildTexasManifestRecord(charge,docs.slice(1),generatedAt).provisions).toHaveLength(0);
    expect(buildTexasManifestRecord(charge,docs.map((d,i)=>i===0?{...d,text:d.text+" changed"}:d),generatedAt).provisions).toHaveLength(0);
    expect(getVerifiedCitation(charge)).toBe(r.citation);
    for (const lang of ["en","es","zh"]) expect(getChargeExplanation(r.name,"TX",lang,r.id)).toMatchObject({plainSummary:r.conduct,degreeContext:r.penalty,untranslated:lang!=="en",translationDraft:false});
    expect(resolveGuidanceCharge({id:r.id,name:r.name,code:r.code,classification:r.category},"TX")).toMatchObject({id:r.id});
    expect(resolveGuidanceCharge({name:r.name,code:r.code,classification:r.category},"TX")).toBeUndefined();
  }
});
