import priorities from "../scripts/data-review/output/texas-deadly-fluid-priorities.json";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-deadly-fluid.json";
import evidence from "../scripts/data-review/output/texas-deadly-fluid-evidence.json";
import enactments from "../scripts/data-review/output/texas-deadly-fluid-enactments.json";
import { chargeCategories, criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed, parseTexasCitation } from "../server/data/texas-source-database-seed";

const row=(suffix:string)=>rows.find(r=>r.id===`tx-pc-${suffix}`)!;
it("accounts for19 distinct scopes without changing or substituting legacy identities",()=>{
 expect(rows).toHaveLength(19);expect(new Set(rows.map(r=>r.id)).size).toBe(19);
 expect(rows.filter(r=>r.references[0].section==="22.05")).toHaveLength(5);
 expect(rows.filter(r=>r.references[0].section==="22.11")).toHaveLength(14);
 expect(priorities.rows.map(r=>r.rank)).toEqual([76,81,82]);expect(priorities.rows.reduce((n,r)=>n+r.adult,0)).toBe(4565);
 expect(rows.filter(r=>r.category==="misdemeanor")).toHaveLength(1);
});
it("distinguishes actual discharge and occupancy recklessness from the pointing presumption",()=>{
 const a=row("22-05-reckless-danger");expect(a.conduct).toContain("ANOTHER in IMMINENT danger of SERIOUS bodily injury");expect(a.penalty).toMatch(/^Class A/);expect(a.conduct).toContain("Actual injury and use of a firearm are not required");
 expect(a.conduct).toContain("whether or not the actor believed it loaded");expect(a.conduct).toContain("does not apply to a peace officer lawfully discharging");expect(a.conduct).toContain("not proof of actual discharge");
 for(const suffix of ["habitation","building","vehicle"]){const r=row("22-05-discharge-"+suffix);expect(r.penalty).toMatch(/^Third-degree/);expect(r.conduct).toContain("AND being reckless as to whether it is occupied");expect(r.conduct).toContain("does not require proof that someone was actually inside");expect(r.references.some(ref=>ref.section==="30.01")).toBe(true);}
});
it("limits the new officer exception to b1 and preserves the consent and gang boundaries",()=>{
 const r=row("22-05-discharge-individual");expect(r.conduct).toContain("actual official duty AND reasonably believed");expect(r.conduct).toContain("not extended to (b)(2)");expect(r.conduct).toContain("occupancy-recklessness");
 for(const r of rows.filter(r=>r.references[0].section==="22.05")){expect(r.conduct).toContain("Consent alone is not a general defense");expect(r.conduct).toContain("occupation, recognized medical treatment");expect(r.conduct).toContain("initiation or continued membership");expect(r.references.some(ref=>ref.section==="22.06")).toBe(true);expect(r.penalty).toContain("If any element occurred before");}
});
it("binds contact, purpose and each facility or public-service nexus separately",()=>{
 const fluids=rows.filter(r=>r.references[0].section==="22.11");
 for(const r of fluids){expect(r.conduct).toContain("intent to assault, harass, annoy, alarm, abuse, torment or embarrass");expect(r.conduct).toContain("Actual contact and the specified intent are required");expect(r.conduct).toContain("advance warning");expect(r.penalty).toMatch(/^Third-degree/);}
 expect(row("22-11-confined-listed").conduct).toContain("recipient need not be a public servant");
 expect(row("22-11-contractor-duty-listed").conduct).toContain("KNOWING the person or employee is authorized");
 expect(row("22-11-tcco-duty-listed").conduct).toContain("AT a civil commitment facility");
 for(const suffix of ["tcco-retaliation-listed","contractor-retaliation-listed"]){expect(row("22-11-"+suffix).conduct).toContain("import (i)");expect(row("22-11-"+suffix).conduct).toContain("applicable duty or retaliation nexus");}
 expect(row("22-11-public-duty-listed").conduct).toContain("does not require the actor to be confined");expect(row("22-11-public-retaliation-listed").conduct).toContain("does not require contemporaneous duty");
});
it("preserves the separate permissive uniform presumptions and correct civil-facility definition",()=>{
 for(const r of rows.filter(r=>r.references[0].section==="22.11"&&!r.id.includes("confined"))){expect(r.conduct).toContain("beyond a reasonable doubt");expect(r.references.some(ref=>ref.section==="2.05")).toBe(true);}
 for(const r of rows.filter(r=>r.references[0].subdivision?.startsWith("(a)(2)")))expect(r.conduct).toContain("§1.07(a)(8-a)");
 expect(evidence["PE:1.07"].text).toContain('(8-a) "Civil commitment facility"');
});
it("does not misdate animal substances or retroactively broaden fluids and intent",()=>{
 const bill=(id:string,section:string)=>enactments.documents.find(d=>d.id===id)!.spans.find(s=>s.section===section)!.text;
 expect(bill("SB01576","29")).toContain("or an animal");expect(bill("SB01610","6")).toContain("any other fluid or liquid");
 expect(bill("SB01610","37")).toContain("if any element");expect(bill("SB01610","43")).toContain("September 1, 2025");expect(bill("SB01637","2")).toContain("if any element");
 for(const r of rows.filter(r=>r.references[0].section==="22.11")){expect(r.penalty).toContain("NOT first added in 2025");expect(r.penalty).toContain("annoy/abuse/torment/embarrass");if(r.id.endsWith("other-liquid"))expect(r.penalty).toContain("not backdated");}
 for(const d of enactments.documents){expect(createHash("sha256").update(d.text).digest("hex")).toBe(d.textSha256);for(const s of d.spans){expect(d.text.slice(s.start,s.end)).toBe(s.text);expect(createHash("sha256").update(s.text).digest("hex")).toBe(s.sha256);}}
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
    expect(chargeCategories["Violent Crimes"]).toContain(r.id);
    for(const lang of ["en","es","zh"]) expect(getChargeExplanation(r.name,"TX",lang,r.id)).toMatchObject({plainSummary:r.conduct,degreeContext:r.penalty,untranslated:lang!=="en",translationDraft:false});
    expect(resolveGuidanceCharge({id:r.id,name:r.name,code:r.code,classification:r.category},"TX")).toMatchObject({id:r.id});
    expect(resolveGuidanceCharge({name:r.name,code:r.code,classification:r.category},"TX")).toBeUndefined();
  }
});
