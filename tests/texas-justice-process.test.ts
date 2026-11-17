import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-justice-process.json";
import evidence from "../scripts/data-review/output/texas-justice-process-evidence.json";
import priorities from "../scripts/data-review/output/texas-justice-process-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import { getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord } from "../server/data/texas-source-database-seed";
const row=(suffix:string)=>rows.find(r=>r.id==="tx-pc-"+suffix)!;

import { extractDocument } from "../scripts/data-review/import-texas-source-database";

it("retains the three DPS rows once without assigning branch-level arrest counts", () => {
  expect(rows).toHaveLength(17);
  expect(new Set(rows.map(r=>r.id)).size).toBe(17);
  expect(priorities.sha256).toBe(first75.sha256);
  expect(priorities.rows.map(r=>r.rank)).toEqual([26,41,63]);
  expect(priorities.rows.reduce((sum,r)=>sum+r.adult,0)).toBe(14168);
  for (const {rank,...reported} of priorities.rows) expect(first75.top75[rank-1]).toEqual(reported);
});
it("separates pending investigations, later investigations, fabrication and the misdemeanor corpse-reporting duty", () => {
  expect(row("37-09-pending").conduct).toContain("pending or in progress");
  expect(row("37-09-subsequent").conduct).toContain("need not already be pending");
  for (const temporal of ["pending","subsequent"]) {
    expect(row("37-09-"+temporal).penalty).toContain("Third-degree felony");
    expect(row("37-09-"+temporal).conduct).toContain("§43.261(f)(3)");
    expect(row("37-09-"+temporal+"-corpse").penalty).toContain("Second-degree felony");
    expect(row("37-09-"+temporal+"-corpse").references.some(r=>r.section==="43.261")).toBe(false);
  }
  expect(row("37-09-fabricating").references[0].subdivision).toBe("(a)(2)");
  expect(row("37-09-fabricating").conduct).toContain("knowledge of its falsity");
  expect(row("37-09-unreported-corpse").penalty).toContain("Class A misdemeanor");
  expect(row("37-09-unreported-corpse").conduct).toContain("unaware of its existence or location");
});
it("keeps retaliation, obstruction, juror grading and disclosure separate", () => {
  for (const kind of ["retaliation","obstruction"]) {
    expect(row("36-06-"+kind).penalty).toContain("Third-degree felony");
    expect(row("36-06-"+kind+"-juror").penalty).toContain("Second-degree felony");
    expect(row("36-06-"+kind+"-juror").references[1].subdivision).toBe("(c)(1)");
  }
  expect(row("36-06-retaliation").conduct).toContain("in retaliation for or on account");
  expect(row("36-06-obstruction").conduct).toContain("to prevent or delay");
  expect(row("36-06-disclosure-injury").references[1].subdivision).toBe("(c)(2)");
  expect(row("36-06-disclosure").conduct).toContain("48 hours");
  expect(row("36-06-disclosure").conduct).toContain("four years");
  expect(row("36-06-disclosure").conduct).toContain("not automatic guilt");
  for (const r of rows.filter(r=>r.references[0].section==="36.06")) {
    expect(r.conduct).toContain("honorably-retired-peace-officer branch is limited");
    expect(r.conduct).toContain("September 1, 2025");
  }
});
it("requires criminal negligence and preserves speech, warning and presumption limitations", () => {
  for (let i=1;i<=5;i++) {
    const r=row("38-15-a-"+i);
    expect(r.references[0].subdivision).toBe(`(a)(${i})`);
    expect(r.penalty).toContain("Class B misdemeanor");
    expect(r.conduct).toContain("gross deviation");
    expect(r.conduct).toContain("speech only");
    expect(r.conduct.includes("warning defense")).toBe(i===1);
  }
  expect(row("38-15-a-1").conduct).toContain("qualifying radio/television stations and newspapers");
  expect(row("38-15-a-1").references).toContainEqual({code:"GV",section:"552.117",subdivision:"(a)",supportRole:"grading"});
  expect(row("38-15-a-4").conduct).toContain("with knowledge");
  expect(row("38-15-a-5").conduct).toContain("citizens-band");
  expect(row("38-15-a-5").conduct).toContain("reasonably believed");
});
it("retains adjacent amendment versions instead of silently choosing the first", () => {
  const html='<p class="left"><a name="2A.001"></a><a name="internal1"></a></p><p>Text of article as amended by Acts 2025, first.</p><p><a>Art. 2A.001. PEACE OFFICERS GENERALLY.</a> Version one. eff. September 1, 2025.</p><p class="left"><a name="2A.001"></a><a name="internal2"></a></p><p>Text of article as amended by Acts 2025, second.</p><p><a>Art. 2A.001. PEACE OFFICERS GENERALLY.</a> Version two. eff. September 1, 2025.</p><p class="left"><a name="2A.002"></a></p><p><a>Art. 2A.002. NEXT ARTICLE.</a> Must not include.</p>';
  const doc=extractDocument(html,"CR","2A.001","https://example.test",new Date("2026-11-17T00:00:00Z"))!;
  expect(doc.text).toContain("Version one");
  expect(doc.text).toContain("Version two");
  expect(doc.text).not.toContain("Must not include");
  const actual=evidence["CR:2A.001"];
  expect(actual.text.split("Art. 2A.001. PEACE OFFICERS GENERALLY. ")).toHaveLength(3);
  const r=row("38-15-a-1");
  const docs=r.references.map(ref=>{const d=(evidence as Record<string, typeof actual>)[ref.code+":"+ref.section];return {...d,retrievedAt:new Date(d.retrievedAt)};});
  const charge=getChargeById(r.id)!;
  const now=new Date(Math.max(...docs.map(d=>d.retrievedAt.getTime())));
  for (const bad of [actual.text.slice(actual.text.indexOf("Art. 2A.001. PEACE OFFICERS GENERALLY.")),actual.text.replace("Text of article as amended", "Unapproved text"),actual.text+" added classification"]) {
    expect(buildTexasManifestRecord(charge,docs.map(d=>d.code==="CR"?{...d,text:bad}:d),now).provisions).toHaveLength(0);
  }
  for (const r of rows.filter(r=>r.references.some(ref=>ref.code==="CR"))) expect(r.conduct).toMatch(/common to both|unchanged in both/);
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

it("exposes only verified publisher instruction mappings", () => {
  for (const [id,item] of [["37-09-pending","37.9"],["37-09-fabricating","37.10"],["37-09-subsequent","37.11"],["37-09-unreported-corpse","37.12"],["36-06-retaliation","36.9"],["36-06-obstruction","36.10"]]) expect(getInstructionRef(getChargeById("tx-pc-"+id)!)).toContain("CPJC "+item+":");
  expect(getInstructionRef(getChargeById("tx-pc-38-15-a-1")!)).toBeNull();
  expect(getInstructionRef(getChargeById("tx-pc-36-06-disclosure")!)).toBeNull();
});
