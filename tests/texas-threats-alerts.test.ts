import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-threats-alerts.json";
import evidence from "../scripts/data-review/output/texas-threats-alerts-evidence.json";
import priorities from "../scripts/data-review/output/texas-threats-alerts-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import { criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { needsTexasChargeReselection } from "../shared/texas-reviewed";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";
const row=(suffix:string)=>rows.find(r=>r.id==="tx-pc-"+suffix)!;
it("accounts for two ranked threat codes and sixteen individually graded choices",()=>{
 expect(rows).toHaveLength(16);expect(new Set(rows.map(r=>r.id)).size).toBe(16);
 expect(priorities.rows.map(r=>r.rank)).toEqual([44,45]);
 expect(priorities.rows.reduce((n,r)=>n+r.adult,0)).toBe(8268);
 for(const {rank,...r} of priorities.rows)expect(r).toEqual(first75.top75[rank-1]);
});
it("retains threat intent, the exact loss threshold and special officer grading",()=>{
 const t=evidence["PE:22.07"].text;
 expect(t).toContain("with intent to");expect(t).toContain("pecuniary loss of $1,500 or more");expect(t).toContain("amount of economic loss suffered by the owner");
 expect(row("22-07-interruption-loss").conduct).toContain("not an invented $2,500");
 expect(row("22-07-ordinary-fear").penalty).toContain("Class B");expect(row("22-07-family").penalty).toContain("Class A");
 expect(row("22-07-public-servant").conduct).toContain("does not import the official-duty/retaliation condition");
 expect(row("22-07-public-servant").conduct).toContain("even if that officer role is not included");
 for(const id of ["peace-officer","judge"])expect(row("22-07-"+id).penalty).toContain("State jail");
 expect(row("22-07-peace-officer").conduct).toContain("common to both retained versions");
 expect(row("22-07-family").references).toContainEqual({code:"FA",section:"71.004",subdivision:null,supportRole:"grading"});
 for(const id of ["public-service","public-fear","government"])expect(row("22-07-"+id).penalty).toContain("Third-degree");
});
it("does not substitute actual response for the false-alarm would-ordinarily elements",()=>{
 const t=evidence["PE:42.06"].text;expect(t).toContain("knows is false or baseless and that would ordinarily");
 expect(t).toContain("public or private institution of higher education");expect(t).toContain("public primary or secondary school");
 expect(row("42-06-ordinary").conduct).toContain("mistaken report without the required knowledge is not enough");
 expect(row("42-06-institution-service").conduct).toContain("private primary/secondary school status alone is not listed");
});
it("requires actual response, injury recklessness, two priors and lawful direct serious harm",()=>{
 const t=evidence["PE:42.0601"].text;
 for(const text of ["two or more times","direct result of lawful conduct","the report causes an emergency response","reckless with regard"])expect(t).toContain(text);
 expect(row("42-0601-repeat").conduct).toContain("one conviction alone does not");
 expect(row("42-0601-injury-death").conduct).toContain("criminal offense");expect(row("42-0601-injury-death").conduct).toContain("direct result of lawful conduct");
 expect(row("42-0601-injury-death").conduct).toContain("ordinary bodily injury alone");
 for(const r of rows.filter(r=>r.id.startsWith("tx-pc-42-0601")))expect(r.conduct).toContain("September 1, 2021");
});
it("rejects the old section-wide identity through saved guidance, explanation and forged eligibility",()=>{
 const id="tx-terroristic-threat";const m=loadTexasAuthorityManifest();
 expect(getChargeById(id)).toBeUndefined();expect(getChargeExplanation("Terroristic Threat","TX","en",id)).toBeNull();
 expect(needsTexasChargeReselection({name:"Changed AI name",code:"22.07"},"TX")).toBe(true);
 expect(resolveGuidanceCharge({id,name:"Terroristic Threat",code:"22.07",classification:"misdemeanor"},"TX")).toBeUndefined();
 expect(buildTexasSourceDatabaseSeed(m).selectableChargeIds).not.toContain(id);
 const forged=structuredClone(m);forged.catalogRecords.find(r=>r.chargeId===id)!.disposition="retain";
 expect(()=>buildTexasSourceDatabaseSeed(forged)).toThrow("terroristic-threat identity requires exact reselection");
});
it("limits the verified instruction to the individual-fear conduct theory",()=>{
 for(const r of rows){const applicable=r.references[0].section==="22.07"&&r.references[0].subdivision==="(a)(2)";
 const instruction=getInstructionRef(getChargeById(r.id)!);if(applicable){expect(instruction).toContain("CPJC 22.28");expect(instruction).toContain("special grading separate");}else expect(instruction).toBeNull();}
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
