import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-family-safety.json";
import evidence from "../scripts/data-review/output/texas-family-safety-evidence.json";
import priorities from "../scripts/data-review/output/texas-family-safety-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import { getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord } from "../server/data/texas-source-database-seed";
const row=(suffix:string)=>rows.find(r=>r.id==="tx-pc-"+suffix)!;

it("preserves four original DPS rows and accounts once for the shared emergency-assistance code", () => {
  expect(rows).toHaveLength(20);
  expect(new Set(rows.map(r=>r.id)).size).toBe(20);
  expect(priorities.sha256).toBe(first75.sha256);
  expect(priorities.rows.map(r=>r.rank)).toEqual([33,43,49,65]);
  expect(priorities.rows.reduce((sum,r)=>sum+r.adult,0)).toBe(15974);
  for (const {rank,...reported} of priorities.rows) expect(first75.top75[rank-1]).toEqual(reported);
  expect(priorities.rows[1].citation).toBe("42.061999999999998");
  expect(rows.filter(r=>r.dpsCode==="53990010").map(r=>r.references[0].section)).toEqual(["42.062","42.062"]);
  expect(row("22-04-bodily-intentional").references[1]).toMatchObject({section:"22.04",subdivision:"(f)"});
  expect(row("22-041-endanger").references[1]).toMatchObject({section:"22.041",subdivision:"(f)"});
});

it("separates result-level mental states, omission duties and direct-care injury grading", () => {
  expect(row("22-04-serious-intentional").penalty).toContain("First-degree felony");
  expect(row("22-04-serious-reckless").penalty).toContain("Second-degree felony");
  expect(row("22-04-bodily-intentional").penalty).toContain("Third-degree felony");
  expect(row("22-04-bodily-reckless").penalty).toContain("State jail felony");
  expect(row("22-04-negligent").conduct).toContain("by an act");
  expect(row("22-04-negligent").conduct).not.toContain("or by an omission");
  expect(row("22-04-institutional-negligent").references[0].subdivision).toBe("(a-1)(1), (a-1)(2), (a-1)(3)");
  expect(row("22-04-institutional-negligent").conduct).toContain("with criminal negligence");
  expect(row("22-04-institutional-negligent").conduct).toContain("resident");
  expect(row("22-04-institutional-bodily-intentional").penalty).toContain("Third-degree felony");
  const special=row("22-04-direct-care");
  expect(special.references[0].subdivision).toBe("(a)(3)");
  expect(special.penalty).toContain("Second-degree felony");
  expect(special.references).toContainEqual({code:"HS",section:"555.001",subdivision:"(2)",supportRole:"grading"});
  for (const r of rows.filter(r=>r.references[0].section==="22.04")) {
    expect(r.conduct).toContain("65 or older");
    expect(r.conduct).toContain("14 or younger");
    expect(r.penalty).toContain("concurrent");
    expect(r.references).toContainEqual({code:"IN",section:"1355.001",subdivision:"(3), (4)",supportRole:"grading"});
  }
});

it("distinguishes abandonment from endangerment and keeps the safe-delivery exception", () => {
  expect(row("22-041-abandon-return").penalty).toContain("State jail felony");
  expect(row("22-041-abandon-return").conduct).toContain("intended to return");
  expect(row("22-041-abandon-no-return").penalty).toContain("Third-degree felony");
  expect(row("22-041-abandon-imminent-danger").penalty).toContain("Second-degree felony");
  expect(row("22-041-abandon-imminent-danger").conduct).toContain("regardless of intent to return");
  const endanger=row("22-041-endanger");
  expect(endanger.conduct).toContain("imminent danger");
  expect(endanger.conduct).toContain("does not compel a finding");
  expect(endanger.conduct).toContain("organized athletic event");
  expect(endanger.references).toContainEqual({code:"PE",section:"2.05",subdivision:"(a)",supportRole:"grading"});
  for (const r of rows.filter(r=>r.references[0].section==="22.041")) {
    expect(r.conduct).toContain("§22.041(h)");
    expect(r.conduct).toContain("September 1, 2025");
    expect(r.references).toContainEqual({code:"FA",section:"262.302",subdivision:null,supportRole:"grading"});
  }
});

it("preserves repeated-assault requirements and both emergency-interference mental states", () => {
  const continuous=row("25-11-continuous");
  expect(continuous.conduct).toContain("twelve months or less");
  expect(continuous.conduct).toContain("two or more times");
  expect(continuous.conduct).toContain("Prior convictions are not required");
  expect(continuous.references).toContainEqual({code:"PE",section:"22.01",subdivision:"(a)(1)",supportRole:"grading"});
  expect(row("42-062-a").conduct).toContain("Knowingly preventing");
  expect(row("42-062-b").conduct).toContain("Recklessly making");
  for (const sub of ["a","b"]) {
    expect(row("42-062-"+sub).penalty).toContain("Class A misdemeanor");
    expect(row("42-062-"+sub+"-prior").penalty).toContain("State jail felony");
    expect(row("42-062-"+sub+"-prior").conduct).toContain("previous conviction under §42.062");
  }
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

it("labels verified instruction scope and leaves unverified mappings absent", () => {
  expect(getInstructionRef(getChargeById("tx-pc-25-11-continuous")!)).toContain("CPJC 25.22");
  expect(getInstructionRef(getChargeById("tx-pc-22-04-serious-intentional")!)).toContain("child/act/serious-bodily-injury theory only");
  expect(getInstructionRef(getChargeById("tx-pc-22-041-endanger")!)).toContain("child and act theory only");
  expect(getInstructionRef(getChargeById("tx-pc-42-062-a")!)).toBeNull();
  expect(getInstructionRef(getChargeById("tx-pc-22-04-institutional-negligent")!)).toBeNull();
});
