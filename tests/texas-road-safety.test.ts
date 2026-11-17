import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-road-safety.json";
import evidence from "../scripts/data-review/output/texas-road-safety-evidence.json";
import priorities from "../scripts/data-review/output/texas-road-safety-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import { getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";
const row=(suffix:string)=>rows.find(r=>r.id==="tx-tn-"+suffix)!;

import { needsTexasChargeReselection, texasHeldRoadId } from "../shared/texas-reviewed";
import { criminalCharges, chargeCategories } from "../shared/criminal-charges";
import { readFileSync } from "node:fs";

it("accounts for three DPS rows and preserves the exact reckless-driving identity", () => {
  expect(rows).toHaveLength(16);
  expect(new Set(rows.map(r=>r.id)).size).toBe(16);
  expect(priorities.rows.map(r=>r.rank)).toEqual([36,42,72]);
  expect(priorities.rows.reduce((sum,r)=>sum+r.adult,0)).toBe(11549);
  for(const {rank,...reported} of priorities.rows) expect(first75.top75[rank-1]).toEqual(reported);
  const reckless=getChargeById("tx-reckless-driving")!;
  expect(criminalCharges.filter(r=>r.id===reckless.id)).toHaveLength(1);
  expect(reckless.maxPenalty).toContain("30 days");
  expect(reckless.maxPenalty).toContain("$200");
  expect(reckless.maxPenalty).not.toContain("Up to 1 year");
  expect(reckless.description).toContain("wilful or wanton");
  expect(reckless.description).toContain("excludes private residential");
  for(const r of rows) {
    expect(chargeCategories["DUI & Traffic"]).toContain(r.id);
    expect(chargeCategories["DUI/Traffic Crimes"]).toContain(r.id);
  }
});
it("separates racing grades and preserves causation and collateral provisions", () => {
  for(const [suffix,grade] of [["ordinary","Class B"],["one-prior","Class A"],["intoxicated","Class A"],["open-container","Class A"],["two-priors","State jail felony"],["bodily-injury","Third-degree felony"],["serious-or-death","Second-degree felony"]]) {
    const r=row("545-420-"+suffix);
    expect(r.penalty).toContain(grade);
    expect(r.conduct).toContain("Rapid acceleration alone does not automatically");
    expect(r.penalty).toContain("early-reinstatement");
    expect(r.penalty).toContain("ten hours");
    expect(r.penalty).toContain("removal/storage");
  }
  expect(row("545-420-intoxicated").references).toContainEqual({code:"PE",section:"49.01",subdivision:"(2)",supportRole:"grading"});
  expect(row("545-420-open-container").references).toContainEqual({code:"PE",section:"49.031",subdivision:"(a)(1)",supportRole:"grading"});
  expect(row("545-420-bodily-injury").conduct).toContain("as a result of");
});
it("does not flatten the special injury penalty into ordinary felony or misdemeanor ranges", () => {
  expect(row("550-021-death").penalty).toContain("Second-degree felony");
  expect(row("550-021-serious-injury").penalty).toContain("Third-degree felony");
  const special=row("550-021-other-injury");
  expect(special.category).toBe("felony");
  expect(special.penalty).toContain("up to five years");
  expect(special.penalty).toContain("up to one year");
  expect(special.penalty).toContain("$5,000");
  expect(special.penalty).toContain("does not make this a misdemeanor");
  expect(special.references[1].subdivision).toBe("(c)(2)");
  for(const r of rows.filter(r=>r.references[0].section==="550.021")) {
    expect(r.conduct).toContain("knowing of the collision");
    expect(r.conduct).toContain("reasonably likely to result in injury");
    expect(r.conduct).toContain("fault for causing");
    expect(r.conduct).toContain("liability insurer");
    expect(r.penalty).toContain("§521.341(6)");
  }
});
it("keeps $200 inclusive, attended and unattended duties, and freeway relocation distinct", () => {
  for(const s of ["550-022","550-024"]) {
    expect(row(s+"-under-200").penalty).toContain("Class C");
    expect(row(s+"-under-200").conduct).toContain("less than $200");
    expect(row(s+"-200-plus").penalty).toContain("Class B");
    expect(row(s+"-200-plus").conduct).toContain("$200 or more");
  }
  expect(row("550-022-200-plus").conduct).toContain("Damage to all vehicles");
  expect(row("550-024-200-plus").conduct).toContain("written notice");
  expect(row("550-024-200-plus").conduct).toContain("does not replace");
  expect(row("550-022-freeway-relocation").references[1].subdivision).toBe("(c-1)");
  expect(row("550-022-freeway-relocation").conduct).toContain("every involved vehicle");
  expect(row("550-022-freeway-relocation").conduct).toContain("not require towing");
});
it("withholds the historical generic hit-and-run identity across seed, saved guidance, explanations and PDF routing", () => {
  const manifest=loadTexasAuthorityManifest();
  expect(buildTexasSourceDatabaseSeed(manifest).selectableChargeIds).not.toContain(texasHeldRoadId);
  expect(getChargeById(texasHeldRoadId)).toBeUndefined();
  expect(getChargeExplanation("Hit and Run","TX","en",texasHeldRoadId)).toBeNull();
  for(const old of [{id:texasHeldRoadId,name:"Hit and Run",code:"550.021"},{name:"Different AI wording",code:"550.021"},{name:"Collision",code:"Tex. Transp. Code § 550.021(c)(2)"}]) {
    expect(needsTexasChargeReselection(old,"TX")).toBe(true);
    expect(resolveGuidanceCharge({...old,classification:"misdemeanor"},"TX")).toBeUndefined();
  }
  expect(needsTexasChargeReselection({id:row("550-021-death").id,name:"Collision",code:"550.021(a)"},"TX")).toBe(false);
  expect(needsTexasChargeReselection({name:"Different wording",code:"550.021"},"FL")).toBe(false);
  const held=manifest.catalogRecords.find(r=>r.chargeId===texasHeldRoadId)!;
  expect(()=>buildTexasSourceDatabaseSeed({...manifest,catalogRecords:[{...held,disposition:"retain"}]})).toThrow("requires exact reselection");
  const pdf=readFileSync("client/src/lib/pdf-generator.ts","utf8");
  expect(pdf).toContain('isTexasAmbiguousCollision(charge, caseData.jurisdiction) ? "collision"');
  expect(pdf).toContain("Select the exact Texas collision charge");
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
    if (r.id !== "tx-reckless-driving") expect(resolveGuidanceCharge({name:r.name,code:r.code,classification:r.category},"TX")).toBeUndefined();
  }
});

it("limits publisher instructions to verified injury-collision conduct", () => {
  for(const suffix of ["death","serious-injury","other-injury"]) expect(getInstructionRef(getChargeById(row("550-021-"+suffix).id)!)).toContain("CPJC 80.2");
  expect(getInstructionRef(getChargeById("tx-reckless-driving")!)).toBeNull();
  expect(getInstructionRef(getChargeById(row("545-420-ordinary").id)!)).toBeNull();
  expect(getInstructionRef(getChargeById(row("550-022-200-plus").id)!)).toBeNull();
});
