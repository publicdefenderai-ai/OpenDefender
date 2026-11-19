import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-prohibited-possession.json";
import evidence from "../scripts/data-review/output/texas-prohibited-possession-evidence.json";
import priorities from "../scripts/data-review/output/texas-prohibited-possession-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import { criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { needsTexasChargeReselection } from "../shared/texas-reviewed";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";
const row=(suffix:string)=>rows.find(r=>r.id==="tx-pc-"+suffix)!;
it("accounts for two DPS codes and 26 individually supported choices",()=>{
 expect(rows).toHaveLength(26);expect(new Set(rows.map(r=>r.id)).size).toBe(26);
 expect(priorities.rows.map(r=>r.rank)).toEqual([31,57]);expect(priorities.rows.reduce((n,r)=>n+r.adult,0)).toBe(8527);
 for(const {rank,...r} of priorities.rows)expect(r).toEqual(first75.top75[rank-1]);
});
it("binds the later release anniversary and distinct post-window residence rule",()=>{
 const text=evidence["PE:46.04"].text;expect(text).toContain("whichever date is later");expect(text).toContain("any location other than the premises at which the person lives");
 expect(row("46-04-felony-window").conduct).toContain("whichever date is later");expect(row("46-04-felony-after-window").conduct).toContain("lives");
 expect(row("46-04-family-assault-window").penalty).toContain("Class A");expect(row("46-04-gang-vehicle").penalty).toContain("Class A");
 for(const r of rows.filter(r=>r.id.startsWith("tx-pc-46-"))){expect(r.penalty).toContain("46.11");expect(r.references.some(p=>p.section==="46.11")).toBe(true);}
});
it("preserves the 2025 special death range and limits employee escalations to three substance branches",()=>{
 const text=evidence["PE:38.11"].text;expect(text).toContain("less than 15 years");expect(text).toContain("$250,000");expect(text).toContain("Subsection (a)(1), (b), or (c)");expect(text).toContain("September 1, 2025");
 const death=rows.filter(r=>r.id.endsWith("employee-death"));expect(death).toHaveLength(3);
 for(const r of death){expect(r.penalty).toContain("15 to 99 years or life");expect(r.penalty).toContain("$250,000");expect(r.conduct).toContain("September 1, 2025");}
 for(const r of rows.filter(r=>r.id.startsWith("tx-pc-38-11")&&!r.id.includes("employee")))expect(r.penalty).toContain("Third-degree");
});
it("keeps prescription, clergy, officer and device authorizations branch-specific",()=>{
 const text=evidence["PE:38.11"].text;expect(text).toContain("four ounces or less");expect(text).toContain("unless the device or component is authorized by the Texas Civil Commitment Office");
 expect(row("38-11-take-inside-ordinary").conduct).toContain("four ounces");expect(row("38-11-civil-device").conduct).toContain("Texas Civil Commitment Office");
 expect(row("38-11-provide-tobacco").conduct).toContain("rule");
 expect(row("38-11-possess-weapon").references.some(r=>r.code==="CR"&&r.section==="2A.001")).toBe(true);
 for(const id of ["acquire-device","relay-device","pay-service"])expect(row("38-11-"+id).conduct).toContain("intent");
});
it("publishes only the verified home and within-period instruction, not stale contraband commentary",()=>{
 for(const r of rows){const instruction=getInstructionRef(getChargeById(r.id)!);if(r.id==="tx-pc-46-04-felony-window"){expect(instruction).toContain("CPJC 46.3");expect(instruction).toContain("home and within-period theory only");}else expect(instruction).toBeNull();}
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
