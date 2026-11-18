import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-robbery-restraint.json";
import evidence from "../scripts/data-review/output/texas-robbery-restraint-evidence.json";
import priorities from "../scripts/data-review/output/texas-robbery-restraint-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import { criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { needsTexasChargeReselection } from "../shared/texas-reviewed";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";
const row=(id:string)=>rows.find(r=>r.id===id)!;
it("accounts for the ranked identities while preserving whole-statute robbery IDs",()=>{
 expect(rows).toHaveLength(13);expect(new Set(rows.map(r=>r.id)).size).toBe(13);
 expect(priorities.rows.map(r=>r.rank)).toEqual([52,61,66]);
 expect(priorities.rows.reduce((n,r)=>n+r.adult,0)).toBe(7883);
 for(const {rank,...r} of priorities.rows)expect(r).toEqual(first75.top75[rank-1]);
 for(const id of ["tx-robbery-in-the-first-degree","tx-robbery-in-the-second-degree"]){
  expect(criminalCharges.filter(c=>c.id===id)).toHaveLength(1);
  expect(needsTexasChargeReselection({id,name:"Older saved title"},"TX")).toBe(false);
  expect(resolveGuidanceCharge({id,name:"Older saved title",code:"29.03",classification:"felony"},"TX")?.id).toBe(id);
 }
});
it("binds both robbery culpability alternatives without inventing weapon or injury requirements",()=>{
 const text=evidence["PE:29.02"].text;
 expect(text).toContain("intentionally, knowingly, or recklessly causes bodily injury");
 expect(text).toContain("intentionally or knowingly threatens");
 const r=row("tx-robbery-in-the-second-degree");
 expect(r.conduct).toContain("recklessly");expect(r.conduct).toContain("threat");
 expect(r.penalty).toContain("two to 20");
 const aggravated=row("tx-robbery-in-the-first-degree");
 for(const word of ["serious bodily injury","deadly weapon","65","disabled"])expect(aggravated.conduct).toContain(word);
 expect(aggravated.penalty).toContain("99");expect(aggravated.penalty).toContain("Jury-recommended");
 expect(evidence["PE:29.03"].text).toContain("65 years of age or older");
});
it("retains restraint geography, child defenses and role-specific grades",()=>{
 const t=evidence["PE:20.01"].text;
 expect(t).toContain("outside of the state and outside a 120-mile radius");
 const statute=evidence["PE:20.02"].text;
 for(const phrase of ["relative of the child","not more than three years older","lawful arrest or detaining"] )expect(statute).toContain(phrase);
 for(const r of rows.filter(r=>r.id.startsWith("tx-pc-20-02"))){expect(r.conduct).toContain("120");expect(r.conduct).toContain("three years");}
 expect(row("tx-pc-20-02-ordinary").penalty).toContain("Class A");
 expect(row("tx-pc-20-02-child").penalty).toContain("State jail");
 expect(row("tx-pc-20-02-peace-officer").conduct).toContain("both retained versions");
 expect(row("tx-pc-20-02-custody").conduct).toContain("actor");
});
it("preserves the new jugging offense date and actual instrument and predicate requirements",()=>{
 const t=evidence["PE:29.04"].text;
 expect(t).toContain("September 1, 2025");expect(t).toContain("two or more criminal instruments");
 expect(evidence["PE:16.01"].text).toContain("specially designed, made, or adapted");
 for(const r of rows.filter(r=>r.id.startsWith("tx-pc-29-04"))){expect(r.conduct).toContain("two");expect(r.conduct).toContain("September 1, 2025");expect(r.conduct).toContain("without substantially deviating");}
 expect(row("tx-pc-29-04-vehicle").penalty).toContain("Third-degree");
 expect(row("tx-pc-29-04-robbery").penalty).toContain("First-degree");
});
it("uses verified instruction theories without implying a verified jugging instruction",()=>{
 for(const r of rows.filter(r=>r.id.startsWith("tx-pc-20-02")))expect(getInstructionRef(getChargeById(r.id)!)).toContain("child-acquiescence alternatives and grading separate");
 expect(getInstructionRef(getChargeById("tx-robbery-in-the-first-degree")!)).toContain("serious-injury theory only");
 expect(getInstructionRef(getChargeById("tx-robbery-in-the-second-degree")!)).toContain("threat theory only");
 for(const r of rows.filter(r=>r.id.startsWith("tx-pc-29-04")))expect(getInstructionRef(getChargeById(r.id)!)).toBeNull();
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
    if (r.id.startsWith("tx-pc-")) expect(resolveGuidanceCharge({name:r.name,code:r.code,classification:r.category},"TX")).toBeUndefined();
  }
});
