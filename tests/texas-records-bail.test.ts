import priorities from "../scripts/data-review/output/texas-records-bail-priorities.json";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-records-bail.json";
import evidence from "../scripts/data-review/output/texas-records-bail-evidence.json";
import enactments from "../scripts/data-review/output/texas-records-bail-enactments.json";
import { chargeCategories, criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed, parseTexasCitation } from "../server/data/texas-source-database-seed";

const records = rows.filter(r => r.references[0].section === "37.10");
it("accounts for48 exact subdivisions and keeps legacy identities withheld",()=>{
 expect(priorities.rows.map(r=>r.rank)).toEqual([91,92,95,110]);expect(priorities.rows.reduce((n,r)=>n+r.adult,0)).toBe(4577);
 expect(rows).toHaveLength(48);expect(new Set(rows.map(r=>r.id)).size).toBe(48);expect(records).toHaveLength(42);
 const manifest=loadTexasAuthorityManifest();const seed=buildTexasSourceDatabaseSeed(manifest);
 for(const id of ["tx-failure-to-appear","tx-false-info-to-police"]){expect(seed.selectableChargeIds).not.toContain(id);expect(manifest.catalogRecords.find(r=>r.chargeId===id)?.disposition).toBe("require_exact_reselection");}
});
it("checks each of six record acts against seven independent grade scopes",()=>{
 for(let act=1;act<=6;act++){
 const actRows=records.filter(r=>r.references[0].subdivision===`(a)(${act})`);expect(actRows).toHaveLength(7);
 for(const [suffix,grade] of [["ordinary","Class A"],["ordinary-harm","State jail"],["issued-document","Third-degree"],["issued-document-harm","Second-degree"],["expert-report","Third-degree"],["testing-device-report","Third-degree"],["search-warrant","Third-degree"]]) expect(actRows.find(r=>r.id.endsWith("-"+suffix))?.penalty.startsWith(grade)).toBe(true);
 }
 expect(evidence["PE:37.10"].text).toContain("unless the actor's intent is to defraud or harm another");
});
it("keeps recipient materiality and bail release conditions in their own scopes",()=>{
 const reports=rows.filter(r=>r.references[0].section==="37.08");expect(reports).toHaveLength(3);
 for(const r of reports){expect(r.conduct).toContain("material to a criminal investigation");expect(r.penalty.startsWith("Class B")).toBe(true);}
 const bail=rows.filter(r=>r.references[0].section==="38.10");expect(bail).toHaveLength(3);
 expect(bail.map(r=>r.penalty.split(":")[0])).toEqual(["Class A misdemeanor","Class C misdemeanor","Third-degree felony"]);
 for(const r of bail){expect(r.conduct).toMatch(/reasonable excuse/i);expect(r.references.some(ref=>ref.subdivision==="(b)")).toBe(true);}
});
it("retains independently hashed enactment spans and actual forensic/warrant chronology",()=>{
 for(const d of enactments.documents){expect(createHash("sha256").update(d.text).digest("hex")).toBe(d.textSha256);for(const s of d.spans){expect(d.text.slice(s.start,s.end)).toBe(s.text);expect(createHash("sha256").update(s.text).digest("hex")).toBe(s.sha256);}}
 const bill=(id:string)=>enactments.documents.find(d=>d.id===id)!.text;
 expect(bill("HB01813")).toContain("September 1, 2009");expect(bill("HB00644")).toContain("September 1, 2015");
 for(const r of records){if(r.id.endsWith("expert-report")||r.id.endsWith("testing-device-report"))expect(r.penalty).toContain("September 1, 2009");if(r.id.endsWith("search-warrant"))expect(r.penalty).toContain("September 1, 2015");}
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
    expect(chargeCategories["Public Order"]).toContain(r.id);
    for(const lang of ["en","es","zh"]) expect(getChargeExplanation(r.name,"TX",lang,r.id)).toMatchObject({plainSummary:r.conduct,degreeContext:r.penalty,untranslated:lang!=="en",translationDraft:false});
    expect(resolveGuidanceCharge({id:r.id,name:r.name,code:r.code,classification:r.category},"TX")).toMatchObject({id:r.id});
    expect(resolveGuidanceCharge({name:r.name,code:r.code,classification:r.category},"TX")).toBeUndefined();
  }
});
