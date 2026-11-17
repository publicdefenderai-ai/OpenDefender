import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-ranked-delivery.json";
import evidence from "../scripts/data-review/output/texas-ranked-delivery-evidence.json";
import priorities from "../scripts/data-review/output/texas-ranked-delivery-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import { getChargeById, getInstructionRef, getVerifiedCitation, criminalCharges } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { texasHeldDeliveryIds, needsTexasChargeReselection } from "../shared/texas-reviewed";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";

it("ties fourteen distinct current weight branches to their exact DPS code and annual count", () => {
  expect(rows).toHaveLength(14);
  expect(new Set(rows.map(row=>row.id)).size).toBe(14);
  expect(priorities.sha256).toBe(first75.sha256);
  expect(priorities.rows.map(row=>row.rank)).toEqual([32,74,77,87,115,135,165,184,196,220,229,280,286,369]);
  expect(priorities.rows.reduce((sum,row)=>sum+row.adult,0)).toBe(13199);
  for (const {rank,...reported} of priorities.rows) {
    if (rank <=75) expect(first75.top75[rank-1]).toEqual(reported);
    const match=rows.find(row=>row.dpsCode===reported.code)!;
    expect(match.references[1].section+match.references[1].subdivision).toBe(reported.citation);
  }
});

it("preserves the different fentanyl-group grades, fines, ranges and weight boundaries", () => {
  const byCode=new Map(rows.map(row=>[row.code,row]));
  expect(byCode.get("481.112(b)")?.penalty).toContain("State jail felony");
  expect(byCode.get("481.1123(b)")?.penalty).toContain("Third-degree felony");
  expect(byCode.get("481.112(d)")?.penalty).toContain("five to 99 years or life");
  expect(byCode.get("481.1123(d)")?.penalty).toContain("ten to 99 years or life");
  expect(byCode.get("481.1123(d)")?.penalty).toContain("$20,000");
  expect(byCode.get("481.112(e)")?.penalty).toContain("$100,000");
  expect(byCode.get("481.112(f)")?.penalty).toContain("15 to 99 years or life");
  expect(byCode.get("481.112(f)")?.penalty).toContain("$250,000");
  expect(byCode.get("481.1123(e)")?.penalty).toContain("15 to 99 years or life");
  expect(byCode.get("481.1123(e)")?.penalty).toContain("$200,000");
  expect(byCode.get("481.1123(f)")?.penalty).toContain("20 to 99 years or life");
  expect(byCode.get("481.1123(f)")?.penalty).toContain("$500,000");
  expect(byCode.get("481.113(d)")?.conduct).toContain("four to under 400 grams");
  expect(byCode.get("481.113(e)")?.conduct).toContain("400 grams or more");
  expect(byCode.get("481.113(e)")?.penalty).toContain("$100,000");
  for (const row of rows.filter(row=>row.code.startsWith("481.1123"))) {
    expect(row.conduct).toContain("September 1, 2023 amendment");
  }
});

it("limits child and consumption-result enhancements to the eligible ordinary grades", () => {
  for (const row of rows) {
    expect(row.conduct).toContain("offer-to-sell conviction requires corroboration");
    expect(row.references).toContainEqual({code:"HS",section:"481.182",subdivision:null,supportRole:"grading"});
    expect(row.penalty).toContain("drug-free-zone");
    expect(row.penalty).toContain("consecutively");
    const lower = ["481.112(b)","481.112(c)","481.1123(b)","481.1123(c)","481.113(b)","481.113(c)"].includes(row.code);
    expect(row.references.some(ref=>ref.section==="481.140")).toBe(lower);
    expect(row.references.some(ref=>ref.section==="481.141")).toBe(lower);
    if (lower) {
      expect(row.penalty).toContain("same criminal episode");
      expect(row.penalty).toContain("under 18");
      expect(row.penalty).toContain("substance manufactured or delivered");
    } else expect(row.penalty).not.toContain("raises punishment by one degree");
  }
});

it("replays every individual conduct, grading and penalty link through the actual manifest builder", () => {
  const sources=new Map(Object.entries(evidence));
  const manifest=loadTexasAuthorityManifest();
  const generatedAt=new Date(Math.max(...Object.values(evidence).map(doc=>Date.parse(doc.retrievedAt))));
  for (const row of rows) {
    const charge=getChargeById(row.id)!;
    const documents=row.references.map(ref=>{
      const doc=sources.get(ref.code+":"+ref.section)!;
      expect(doc.textSha256).toBe(createHash("sha256").update(doc.text).digest("hex"));
      expect(doc.snapshotHash).toBe(createHash("sha256").update(JSON.stringify(doc.text)).digest("hex"));
      expect(doc.sourceUrl).toBe(`https://tcss.legis.texas.gov/resources/${ref.code}/htm/${ref.code}.${ref.section.split('.')[0]}.htm#${ref.section}`);
      return {...doc,retrievedAt:new Date(doc.retrievedAt)};
    });
    const actual=buildTexasManifestRecord(charge,documents,generatedAt);
    expect(actual).toEqual(manifest.catalogRecords.find(record=>record.chargeId===row.id));
    expect(actual.provisions.map(p=>[p.lawId,p.section,p.subdivision,p.supportRole])).toEqual(row.references.map(ref=>[ref.code,ref.section,ref.subdivision,ref.supportRole]));
    expect(buildTexasManifestRecord(charge,documents.slice(1),generatedAt).provisions).toHaveLength(0);
    expect(buildTexasManifestRecord(charge,documents.map((doc,i)=>i===0?{...doc,text:doc.text+" changed"}:doc),generatedAt).provisions).toHaveLength(0);
    expect(getVerifiedCitation(charge)).toBe(row.citation);
    expect(getInstructionRef(charge)).toContain("CPJC 81.13");
    expect(getInstructionRef(charge)).toContain("transfer theory only");
    for (const locale of ["en","es","zh"]) expect(getChargeExplanation(row.name,"TX",locale,row.id)).toMatchObject({plainSummary:row.conduct,degreeContext:row.penalty,untranslated:locale!=="en",translationDraft:false});
  }
});

it("requires reselection of old distribution/manufacture labels rather than restoring their generic ceilings", () => {
  const manifest=loadTexasAuthorityManifest();
  const selectable=buildTexasSourceDatabaseSeed(manifest).selectableChargeIds;
  for (const id of texasHeldDeliveryIds) {
    const charge=criminalCharges.find(row=>row.id===id)!;
    expect(selectable).not.toContain(id);
    expect(getChargeById(id)).toBeUndefined();
    expect(getChargeExplanation(charge.name,"TX","en",id)).toBeNull();
    expect(needsTexasChargeReselection({name:charge.name,code:charge.code},"Texas")).toBe(true);
    expect(resolveGuidanceCharge({id,name:charge.name,code:charge.code,classification:"felony"},"TX")).toBeUndefined();
    expect(needsTexasChargeReselection({name:charge.name,code:charge.code},"TX")).toBe(true);
    const record=manifest.catalogRecords.find(r=>r.chargeId===id)!;
    expect(()=>buildTexasSourceDatabaseSeed({...manifest,catalogRecords:[{...record,disposition:"retain"}]})).toThrow("requires exact reselection");
  }
  for (const section of ["481.112","481.1123","481.113"]) {
    expect(resolveGuidanceCharge({name:"Manufacturing",code:section,classification:"felony"},"TX")).toBeUndefined();
  }
  expect(needsTexasChargeReselection({id:rows[0].id,name:rows[0].name,code:rows[0].code},"TX")).toBe(false);
});
