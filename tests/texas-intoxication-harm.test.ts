import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-intoxication-harm.json";
import evidence from "../scripts/data-review/output/texas-intoxication-harm-evidence.json";
import priorities from "../scripts/data-review/output/texas-intoxication-harm-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import { criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { needsTexasChargeReselection } from "../shared/texas-reviewed";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";
const row=(suffix:string)=>rows.find(r=>r.id==="tx-pc-"+suffix)!;
it("preserves the DPS child-passenger count without assigning it to harm subdivisions",()=>{
 expect(rows).toHaveLength(15);expect(new Set(rows.map(r=>r.id)).size).toBe(15);
 expect(priorities.rows.map(r=>r.rank)).toEqual([62]);expect(priorities.rows[0].adult).toBe(2400);
 for(const {rank,...r} of priorities.rows)expect(r).toEqual(first75.top75[rank-1]);
});
it("separates child-passenger ordinary grading from the two statutory prior alternatives",()=>{
 expect(evidence["PE:49.045"].text).toContain("younger than 15 years");expect(evidence["PE:49.09"].text).toContain("49.045");
 expect(row("49-045-ordinary").penalty).toContain("180 days to two years");
 for(const id of ["prior-manslaughter","two-priors"]){expect(row("49-045-"+id).penalty).toContain("Third-degree");expect(row("49-045-"+id).penalty).toContain("at least 10 days");}
 expect(row("49-045-prior-manslaughter").conduct).toContain("substantially similar elements");expect(row("49-045-two-priors").conduct).toContain("two prior qualifying");
});
it("requires causal serious injury and the exact traumatic-brain-injury result",()=>{
 const source=evidence["PE:49.07"].text;expect(source).toContain("by reason of that intoxication");expect(source).toContain("protracted loss or impairment");
 expect(row("49-07-ordinary").conduct).toContain("not merely coincide");expect(row("49-07-ordinary").conduct).toContain("public-place condition attaches to the motor-vehicle");
 expect(evidence["PE:49.09"].text).toContain("traumatic brain injury that results in a persistent vegetative state");
 expect(row("49-07-persistent-vegetative-state").conduct).toContain("coma");expect(row("49-07-persistent-vegetative-state").conduct).toContain("first-degree officer/judge branch controls");
 for(const id of ["firefighter","ems"])expect(row("49-07-"+id).penalty).toContain("Second-degree");
 for(const id of ["peace-officer","judge"])expect(row("49-07-"+id).penalty).toContain("First-degree");
});
it("retains both 2025 versions and does not silently clear the Chapter 51 branch",()=>{
 const source=evidence["PE:49.09"].text;expect(source).toContain("S.B. 745");expect(source).toContain("H.B. 2017");expect(source).toContain("more than one person during the same criminal transaction");expect(source).toContain("violation of Chapter 51");
 for(const r of rows.filter(r=>r.references[0].section==="49.08")){expect(r.conduct).toContain("not cleared by this choice");expect(r.conduct).toContain("not declared invalid");}
 expect(row("49-08-multiple-deaths").conduct).toContain("September 1, 2025");expect(row("49-08-peace-officer").conduct).toContain("any legally qualifying peace officer");
});
it("preserves the old manslaughter identity once and corrects conditional penalties and mandatory consequences",()=>{
 const old=rows.find(r=>r.id==="tx-vehicular-homicide")!;
 expect(criminalCharges.filter(r=>r.id===old.id)).toHaveLength(1);expect(getChargeById(old.id)!.description).toBe(old.conduct);
 expect(old.penalty).toContain("first-degree punishment");
 expect(evidence["CR:42A.401"].text).toContain("not less than 30 days");expect(evidence["CR:42A.401"].text).toContain("not less than 120 days");
 expect(evidence["CR:42.0375"].text).toContain("19 years of age or older");
 for(const r of rows.filter(r=>r.references[0].section==="49.07"))expect(r.penalty).toContain("at least 30 days");
 for(const r of rows.filter(r=>r.references[0].section==="49.08")){expect(r.penalty).toContain("at least 120 days");expect(r.penalty).toContain("until the child turns 18 or graduates from high school, whichever is later");expect(r.penalty).not.toContain("through age 18");expect(r.penalty).toContain("not once the recipient is 19");expect(r.penalty).toContain("not an automatic stacking requirement");}
});
it("limits publisher instructions to verified motor-vehicle conduct, leaving special grading separate",()=>{
 for(const r of rows){const instruction=getInstructionRef(getChargeById(r.id)!);expect(instruction).toContain("underlying conduct only: motor-vehicle/public-place; enhanced grading separate");expect(instruction).toContain(r.references[0].section==="49.045"?"49.17":r.references[0].section==="49.07"?"49.26":"49.25");}
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

it("names deputies and qualifying reserves without broadening the retained four officer classes",()=>{
 const source=evidence["CR:2A.001"].text;
 for(const phrase of ["reserve deputy sheriff", "deputy constable", "reserve municipal police officer", "reserve officer corps"])expect(source).toContain(phrase);
 for(const r of rows.filter(r=>r.id.endsWith("peace-officer"))){expect(r.name).toContain("deputy or qualifying reserve");expect(r.conduct).toContain("required permanent peace-officer license");expect(r.conduct).toContain("Public Safety Commission and DPS director");expect(r.conduct).toContain("actual official duty");}
});
