import priorities from "../scripts/data-review/output/texas-roadway-duties-priorities.json";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-roadway-duties.json";
import evidence from "../scripts/data-review/output/texas-roadway-duties-evidence.json";
import enactments from "../scripts/data-review/output/texas-roadway-duties-enactments.json";
import { chargeCategories, criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed, parseTexasCitation } from "../server/data/texas-source-database-seed";

const row=(suffix:string)=>rows.find(r=>r.id===`tx-trc-${suffix}`)!;
it("independently accounts for 22 roadway scopes and grade ladders",()=>{
 expect(rows).toHaveLength(22);expect(new Set(rows.map(r=>r.id)).size).toBe(22);
 expect(rows.filter(r=>r.references[0].section==="545.421")).toHaveLength(2);
 expect(rows.filter(r=>r.references[0].section==="550.025")).toHaveLength(4);
 expect(rows.filter(r=>r.references[0].section==="504.945")).toHaveLength(16);
 expect(rows.every(r=>r.category==="misdemeanor")).toBe(true);
 expect(priorities.rows.map(r=>r.rank)).toEqual([78,80,114]);expect(priorities.rows.reduce((n,r)=>n+r.adult,0)).toBe(3908);
 expect(row("545-421-ordinary").penalty).toMatch(/^Class B/);expect(row("545-421-imminent-danger").penalty).toMatch(/^Class A/);
 for(const k of ["notify","license"]){expect(row(`550-025-${k}-under-200`).penalty).toMatch(/^Class C/);expect(row(`550-025-${k}-200-plus`).penalty).toMatch(/^Class B/);}
 for(const k of ["wrong-vehicle","wrong-period","blur","device","angle","state-name"]){expect(row(`504-945-${k}`).penalty).toContain("maximum fine of $200");expect(row(`504-945-${k}-owner-alteration`).penalty).toMatch(/^Class B/);}
 expect(row("504-945-fictitious").penalty).toMatch(/^Class B/);
 expect(row("504-945-number-color-ordinary").penalty).toContain("maximum fine of $300");expect(row("504-945-number-color-one-prior").penalty).toContain("maximum fine of $600");expect(row("504-945-number-color-two-priors").penalty).toMatch(/^Class B/);
});
it("retains police identity, highway scope and permissive inference limits",()=>{
 for(const r of rows.slice(0,2)){expect(r.conduct).toContain("WILFULLY");expect(r.conduct).toContain("badge prominently displayed");expect(r.conduct).toContain("law-enforcement-agency insignia");expect(r.conduct).toContain("actually engaged in highway work");expect(r.conduct).toContain("not an automatic substitute");expect(r.references.some(x=>x.section==="542.004")).toBe(true);}
 const r=row("545-421-imminent-danger");expect(r.conduct).toContain("ANOTHER in IMMINENT danger of SERIOUS bodily injury");expect(r.conduct).toContain("permits, but does not require");expect(r.references.some(x=>x.section==="2.05")).toBe(true);
});
it("keeps collision notification, license and damage predicates distinct",()=>{
 expect(row("550-025-notify-under-200").conduct).toContain("REASONABLE STEPS");expect(row("550-025-license-under-200").conduct).toContain("ONLY IF REQUESTED AND AVAILABLE");
 for(const r of rows.slice(2,6)){expect(r.conduct).toContain("ALL FIXTURES AND LANDSCAPING");expect(r.conduct).toContain("does not resolve a structure-only valuation question");expect(r.conduct).toContain("private residential access is excluded");}
});
it("does not apply the owner upgrade to the separate plate-color ladder",()=>{
 for(const r of rows.filter(x=>x.id.includes("number-color"))){expect(r.conduct).toContain("rather than (b)’s $200 or owner-alteration scheme");expect(r.conduct).toContain("same-subsection repeat rule");expect(r.conduct).toContain("court MAY dismiss");expect(r.conduct).toContain("conditions are cumulative");expect(r.penalty).toContain("if any offense element predates");}
 expect(row("504-945-fictitious").conduct).toContain("not automatically fictitious");expect(row("504-945-wrong-vehicle").conduct).toContain("not blanket exceptions");
});
it("binds enactments without confusing amendments with the origins of existing grades",()=>{
 for(const d of enactments.documents){expect(createHash("sha256").update(d.text).digest("hex")).toBe(d.textSha256);for(const s of d.spans){expect(d.text.slice(s.start,s.end)).toBe(s.text);expect(createHash("sha256").update(s.text).digest("hex")).toBe(s.sha256);}}
 expect(enactments.documents.map(d=>d.id).sort()).toEqual(["HB01831","HB02190","HB02195","HB02357"]);
 expect(row("545-421-ordinary").penalty).toContain("danger and presumption provisions predate");expect(row("504-945-fictitious").penalty).toContain("rule predates H.B. 2195");expect(row("550-025-notify-under-200").penalty).toContain("did not create these grades");
});
it("rebuilds exact records, rejects changed/missing evidence, and preserves saved-ID and language boundaries", () => {
  const sources=new Map(Object.entries(evidence)); const manifest=loadTexasAuthorityManifest();
  const generatedAt=new Date(Math.max(...Object.values(evidence).map(doc=>Date.parse(doc.retrievedAt))));
  for (const r of rows) {
    const charge=getChargeById(r.id)!;
    const docs=r.references.map(ref=>{
      const d=sources.get(ref.code+":"+ref.section)!;
      expect(d.textSha256).toBe(createHash("sha256").update(d.text).digest("hex"));
      expect(d.snapshotHash).toBe(createHash("sha256").update(JSON.stringify(d.text)).digest("hex"));
      return {...d,retrievedAt:new Date(d.retrievedAt)};
    });
    expect(buildTexasManifestRecord(charge,docs,generatedAt)).toEqual(manifest.catalogRecords.find(record=>record.chargeId===r.id));
    expect(buildTexasManifestRecord(charge,docs.slice(1),generatedAt).provisions).toHaveLength(0);
    expect(buildTexasManifestRecord(charge,docs.map((d,i)=>i===0?{...d,text:d.text+" changed"}:d),generatedAt).provisions).toHaveLength(0);
    expect(getVerifiedCitation(charge)).toBe(r.citation);expect(getInstructionRef(charge)).toBeNull();
    expect(chargeCategories["DUI & Traffic"]).toContain(r.id);
    for(const lang of ["en","es","zh"]) expect(getChargeExplanation(r.name,"TX",lang,r.id)).toMatchObject({plainSummary:r.conduct,degreeContext:r.penalty,untranslated:lang!=="en",translationDraft:false});
    expect(resolveGuidanceCharge({id:r.id,name:r.name,code:r.code,classification:r.category},"TX")).toMatchObject({id:r.id});
    expect(resolveGuidanceCharge({name:r.name,code:r.code,classification:r.category},"TX")).toBeUndefined();
  }
});
