import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-child-sexual-offenses.json";
import evidence from "../scripts/data-review/output/texas-child-sexual-evidence.json";
import priorities from "../scripts/data-review/output/texas-child-sexual-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import { chargeCategories, criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { needsTexasChargeReselection } from "../shared/texas-reviewed";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";
const row=(suffix:string)=>rows.find(r=>r.id==="tx-pc-"+suffix)!;
it("accounts for three DPS priorities and thirty individually supported records",()=>{
 expect(rows).toHaveLength(30);expect(new Set(rows.map(r=>r.id)).size).toBe(30);
 expect(priorities.rows.map(r=>r.rank)).toEqual([69,71,75]);expect(priorities.rows.reduce((s,r)=>s+r.adult,0)).toBe(5309);
 for(const {rank,...r} of priorities.rows)expect(r).toEqual(first75.top75[rank-1]);
});
it("distinguishes sexual contact and exposure grades, intent and statutory defenses",()=>{
 const source=evidence["PE:21.11"].text;expect(source).toContain("including touching through clothing");expect(source).toContain("knowing the child is present");expect(source).toContain("or (B)");
 expect(row("21-11-contact").penalty).toContain("Second-degree");
 for(const id of ["exposure","cause-exposure"]){expect(row("21-11-"+id).penalty).toContain("Third-degree");expect(row("21-11-"+id).penalty).toContain("does not automatically include this exposure branch");}
 expect(row("21-11-exposure").conduct).toContain("knowing the child is present");
});
it("does not import the close-in-age defense into aggravated cases or substitute ordinary age for the 25-year threshold",()=>{
 expect(evidence["PE:22.011"].text).toContain("or (ii)");expect(evidence["PE:22.011"].text).toContain("14 years of age or older");
 expect(evidence["PE:22.021"].text).toContain("younger than 10 years");expect(evidence["PE:22.021"].text).toContain("manner described by Subsection (a)(2)(A)");
 for(const r of rows.filter(r=>r.id.startsWith("tx-pc-22-021-"))){expect(r.conduct).toContain("not the spouse or close-in-age");if(r.id.includes("under10")||r.id.includes("under14-extra"))expect(r.penalty).toContain("25 to 99");else expect(r.penalty).toContain("five to 99");}
});
it("preserves all three saved identities once, removes old defense boilerplate, and qualifies whole-section grades",()=>{
 for(const id of ["tx-statutory-rape","tx-sexual-assault-in-the-first-degree","tx-sexual-assault-in-the-second-degree"]){const r=rows.find(r=>r.id===id)!;expect(criminalCharges.filter(c=>c.id===id)).toHaveLength(1);expect(getChargeById(id)!.description).toBe(r.conduct);expect(getChargeById(id)!.commonDefenses).toEqual([]);}
 expect(rows.find(r=>r.id==="tx-sexual-assault-in-the-second-degree")!.penalty).toContain("state jail");expect(rows.find(r=>r.id==="tx-sexual-assault-in-the-first-degree")!.penalty).toContain("25-year minimum");
});
it("links only verified instruction theories, not all five acts or special sentencing",()=>{
 const linked=rows.filter(r=>getInstructionRef(getChargeById(r.id)!));expect(linked).toHaveLength(8);
 for(const r of linked)expect(getInstructionRef(getChargeById(r.id)!)).toContain("underlying conduct only");
 expect(getInstructionRef(getChargeById("tx-statutory-rape")!)).toContain("sexual-organ penetration theory only");
 for(const r of rows.filter(r=>/^tx-pc-22-021-[bcde]-/.test(r.id)))expect(getInstructionRef(getChargeById(r.id)!)).toBeNull();
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


it("places all reviewed choices in the established sexual-offenses group",()=>{
 for(const r of rows)expect(chargeCategories["Sexual Offenses"]).toContain(r.id);
 for(const r of rows.filter(r=>r.id.endsWith("extra")))expect(r.conduct).toContain("fear that any person will become a victim of listed trafficking, or fear that death");
});
