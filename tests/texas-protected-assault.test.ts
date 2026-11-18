import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-protected-assault.json";
import evidence from "../scripts/data-review/output/texas-protected-assault-evidence.json";
import priorities from "../scripts/data-review/output/texas-protected-assault-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import { criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { needsTexasChargeReselection } from "../shared/texas-reviewed";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";
const row=(suffix:string)=>rows.find(r=>r.id==="tx-pc-"+suffix)!;


it("accounts for three ranked codes and twenty-four distinct roles/conduct branches",()=>{
 expect(rows).toHaveLength(24);expect(new Set(rows.map(r=>r.id)).size).toBe(24);
 expect(priorities.rows.map(r=>r.rank)).toEqual([51,64,73]);
 expect(priorities.rows.reduce((n,r)=>n+r.adult,0)).toBe(7593);
 for(const {rank,...r} of priorities.rows)expect(r).toEqual(first75.top75[rank-1]);
});
it("distinguishes public-servant and specific peace-officer/judge grades",()=>{
 expect(row("22-01-public-servant").penalty).toContain("Third-degree felony");
 expect(row("22-01-public-servant").conduct).toContain("excludes the more specific");
 for(const id of ["peace-officer","judge"]){
  expect(row("22-01-"+id).penalty).toContain("Second-degree felony");
  expect(row("22-01-"+id).conduct).toContain("lawfully discharging");
 }
 expect(row("22-01-peace-officer").conduct).toContain("Other peace-officer categories remain unresolved");
 expect(row("22-01-peace-officer").references).toContainEqual({code:"CR",section:"2A.001",subdivision:"(1)-(4) in both published versions",supportRole:"grading"});
});
it("preserves pregnancy knowledge, coercive purpose and role/location requirements",()=>{
 expect(row("22-01-pregnant").conduct).toContain("knows the person is pregnant");
 expect(row("22-01-pregnant").conduct).toContain("does not require a purpose");
 expect(row("22-01-forced-abortion-injury").conduct).toContain("coercive purpose is required");
 expect(row("22-01-hospital").conduct).toContain("on hospital property");
 expect(row("22-01-security").conduct).toContain("commissioned security officer");
 expect(row("22-01-utility").conduct).toContain("knows or reasonably should know");
 expect(row("22-01-utility").references.filter(r=>r.code==="UT")).toHaveLength(6);
});
it("does not give civil-commitment threats/contact their ordinary misdemeanor grades",()=>{
 const civil=rows.filter(r=>r.id.includes("-civil-"));expect(civil).toHaveLength(6);
 for(const r of civil){expect(r.penalty).toContain("Third-degree felony");expect(r.conduct).toContain("actor must be committed");expect(r.conduct).toContain("not automatic guilt");expect(r.references).toContainEqual({code:"PE",section:"1.07",subdivision:"(a)(8-a)",supportRole:"grading"});}
 expect(row("22-01-civil-office-2").conduct).toContain("Recklessness alone does not satisfy");
 expect(row("22-01-civil-contractor-3").conduct).toContain("Bodily injury is not required");
});
it("keeps ordinary and special threat/contact grading separate",()=>{
 for(const i of [2,3]){
  expect(row("22-01-ordinary-"+i).penalty).toContain("Class C misdemeanor");
  expect(row("22-01-sports-"+i).penalty).toContain("Class B misdemeanor");
  expect(row("22-01-sports-"+i).conduct).toContain("actor is not a sports participant");
  expect(row("22-01-forced-abortion-"+i).penalty).toContain("Class A misdemeanor");
 }
 expect(row("22-01-elderly-disabled-contact").penalty).toContain("Class A misdemeanor");
 expect(row("22-01-elderly-disabled-contact").conduct).toContain("not automatically to the threat branch");
 expect(row("22-01-elderly-disabled-contact").references.filter(r=>["1355.001","112.042","591.003","261.001","92.001","571.003"].includes(r.section))).toHaveLength(6);
 for(const r of rows)expect(r.conduct).toContain("unavailable for the specified criminal-street-gang");
});
it("preserves the legacy officer hold and rejects stale saved/PDF identities",()=>{
 const id="tx-assault-on-peace-officer";const m=loadTexasAuthorityManifest();
 expect(buildTexasSourceDatabaseSeed(m).selectableChargeIds).not.toContain(id);
 expect(getChargeById(id)).toBeUndefined();expect(getChargeExplanation("Assault on Peace Officer","TX","en",id)).toBeNull();
 expect(resolveGuidanceCharge({id,name:"Assault on Peace Officer",code:"22.01(b)(1)",classification:"felony"},"TX")).toBeUndefined();
 expect(needsTexasChargeReselection({name:"Different AI name",code:"22.01(b)(1)"},"TX")).toBe(true);
 const forged=structuredClone(m);forged.catalogRecords.find(r=>r.chargeId===id)!.disposition="retain";
 expect(()=>buildTexasSourceDatabaseSeed(forged)).toThrow("officer-assault identity requires exact reselection");
});
it("uses only underlying assault instructions, not an unsupported protected-role instruction",()=>{
 for(const r of rows){const a=r.references[0].subdivision;expect(getInstructionRef(getChargeById(r.id)!)).toContain(a==="(a)(1)"?"CPJC 22.1":a==="(a)(2)"?"CPJC 22.2":"CPJC 22.3");expect(getInstructionRef(getChargeById(r.id)!)).toContain("underlying conduct only");}
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
