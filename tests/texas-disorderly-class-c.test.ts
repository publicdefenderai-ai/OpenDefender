import courts from "../scripts/data-review/output/texas-disorderly-class-c-court-context.json";
import accounting from "../scripts/data-review/output/texas-disorderly-class-c-accounting.json";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-disorderly-class-c.json";
import evidence from "../scripts/data-review/output/texas-disorderly-class-c-evidence.json";
import enactments from "../scripts/data-review/output/texas-disorderly-class-c-enactments.json";
import { chargeCategories, criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed, parseTexasCitation } from "../server/data/texas-source-database-seed";

const row=(suffix:string)=>rows.find(r=>r.id===`tx-pc-42-01-${suffix}`)!;
it("accounts for the real statutory frontier without inventing a12 or clearing held a4",()=>{
 expect(rows).toHaveLength(10);expect(new Set(rows.map(r=>r.id)).size).toBe(10);
 expect(rows.map(r=>r.references[0].subdivision)).toEqual(["(a)(1)","(a)(2)","(a)(3)","(a)(5)","(a)(5)","(a)(6)","(a)(10)","(a)(11)(A)","(a)(11)(B)","(a)(11)(C)"]);
 expect(accounting.held.map(r=>r.subdivision)).toEqual(["(a)(4)"]);expect(accounting.absent).toEqual(["(a)(12)"]);
 const seed=buildTexasSourceDatabaseSeed(loadTexasAuthorityManifest());expect(seed.selectableChargeIds).not.toContain("tx-disorderly-conduct");expect(getChargeById("tx-disorderly-conduct")).toBeUndefined();
 expect(seed.selectableChargeIds).toContain("tx-pc-42-01-road-discharge");
});
it("keeps offense elements independent from offensive speech alone",()=>{
 expect(row("fighting-words").conduct).toContain("insults, or a listener’s offense alone are insufficient");
 expect(row("fighting-gesture").conduct).toContain("not automatically criminal");
 expect(row("chemical-odor").conduct).toContain("chemical means, a noxious AND unreasonable");
 expect(row("public-fight").conduct).toContain("Fighting WITH ANOTHER");
 expect(row("public-fight").references.some(r=>r.section==="9.31")).toBe(true);
 expect(row("public-exposure").conduct).toContain("reckless about whether another may be present");
 expect(row("public-exposure").references.some(r=>r.section==="21.08")).toBe(true);
});
it("limits the under12 school exception to the five enumerated subdivisions",()=>{
 for(const r of rows){const applies=["(a)(1)","(a)(2)","(a)(3)","(a)(5)","(a)(6)"].includes(r.references[0].subdivision);
 expect(r.conduct.includes("a student younger than 12")).toBe(applies);
 if(applies){expect(r.conduct).toContain("during regular school hours");expect(r.penalty).toContain("sixth grade or lower in 2011");expect(r.penalty).toContain("September 1, 2013");}}
 const bill=(id:string)=>enactments.documents.find(d=>d.id===id)!;
 expect(bill("HB00359").spans.find(s=>s.section==="6")!.text).toContain("sixth grade or a lower grade level");
 expect(bill("SB00393").spans.find(s=>s.section==="19")!.text).toContain("younger than 12 years of age");
});
it("binds noise locations, notice and permissive presumption without creating a universal decibel floor",()=>{
 for(const suffix of ["public-noise","residential-noise"]){const r=row(suffix);
 expect(r.conduct).toContain("exceeds 85 decibels AFTER notice");expect(r.conduct).toContain("Exactly 85 decibels");expect(r.conduct).toContain("not a universal 85-decibel minimum");expect(r.conduct).toContain("jury may, but is not bound to");expect(r.conduct).toContain("lawfully conducted space-flight");
 expect(r.references.some(r=>r.code==="CP"&&r.section==="100A.001")).toBe(true);
 expect(r.references.some(r=>r.section==="42.04")).toBe(true);expect(r.conduct).toContain("has not yet intentionally harmed");expect(r.conduct).toContain("manifestly unreasonable, or promptly obeyed");}
 expect(row("public-noise").conduct).toContain("other than a sport shooting range");expect(row("residential-noise").conduct).toContain("has no right to occupy");
 for(const r of rows.filter(r=>!r.id.endsWith("noise")))expect(r.references.some(ref=>ref.section==="42.04")).toBe(false);
});
it("keeps the three looking branches separate and requires the stated purpose",()=>{
 for(const suffix of ["dwelling","hotel-room","private-area"])expect(row("looking-"+suffix).conduct).toContain("LEWD OR UNLAWFUL PURPOSE");
 expect(row("looking-dwelling").conduct).toContain("entering another’s property AND looking into a dwelling");
 expect(row("looking-hotel-room").conduct).toContain("guest room not the actor’s own");
 expect(row("looking-private-area").conduct).toContain("area designed to give its user privacy");
});
it("uses Class C ordinary punishment and the exact three-conviction24month alternative",()=>{
 for(const r of rows){expect(r.category).toBe("misdemeanor");expect(r.penalty).toMatch(/^Class C misdemeanor/);expect(r.penalty).toContain("fine up to $500");expect(r.penalty).toContain("three prior convictions under §42.01 or §49.02");expect(r.penalty).toContain("each prior offense was committed in the 24 months");expect(r.penalty).toContain("up to 180 days");expect(r.penalty).toContain("not automatic reclassification");}
 expect(evidence["PE:12.43"].text).toContain("three times or three times for any combination");
});
it("retains accurately labeled majority sources and enactment spans",()=>{
 for(const d of [...courts.documents,...enactments.documents]){expect(createHash("sha256").update(d.text).digest("hex")).toBe(d.textSha256);for(const s of d.spans){expect(d.text.slice(s.start,s.end)).toBe(s.text);expect(createHash("sha256").update(s.text).digest("hex")).toBe(s.sha256);}}
 const coggin=courts.documents.find(d=>d.id==="coggin")!;expect(coggin.extraction).toContain("not a full opinion");expect(coggin.text).toContain("render a judgment of acquittal");expect(coggin.text).toContain("in a different context");
 const hill=courts.documents.find(d=>d.id==="hill")!;expect(hill.sourceUrl).toContain("tile.loc.gov");expect(hill.text).toContain("§ 42.01(a)(1)");
});
it("rebuilds exact records, rejects changed/missing evidence, and preserves saved-ID and language boundaries", () => {
  const sources=new Map(Object.entries(evidence)); const manifest=loadTexasAuthorityManifest();
  const generatedAt=new Date(Math.max(...Object.values(evidence).map(doc=>Date.parse(doc.retrievedAt))));
  for (const r of rows) {
    const charge=getChargeById(r.id)!;
    expect(charge.searchAliases).toContain(r.citation);
    expect(charge.searchAliases?.every(alias=>typeof alias==="string"&&alias.length>0)).toBe(true);
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
    expect(chargeCategories["Public Order"]).toContain(r.id);
    for(const lang of ["en","es","zh"]) expect(getChargeExplanation(r.name,"TX",lang,r.id)).toMatchObject({plainSummary:r.conduct,degreeContext:r.penalty,untranslated:lang!=="en",translationDraft:false});
    expect(resolveGuidanceCharge({id:r.id,name:r.name,code:r.code,classification:r.category},"TX")).toMatchObject({id:r.id});
    expect(resolveGuidanceCharge({name:r.name,code:r.code,classification:r.category},"TX")).toBeUndefined();
  }
});
