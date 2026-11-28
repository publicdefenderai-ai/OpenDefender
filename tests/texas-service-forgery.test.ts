import priorities from "../scripts/data-review/output/texas-service-forgery-priorities.json";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-service-forgery.json";
import evidence from "../scripts/data-review/output/texas-service-forgery-evidence.json";
import enactments from "../scripts/data-review/output/texas-service-forgery-enactments.json";
import { chargeCategories, criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed, parseTexasCitation } from "../server/data/texas-source-database-seed";

import courts from "../scripts/data-review/output/texas-service-forgery-courts.json";
const row=(suffix:string)=>rows.find(r=>r.id===`tx-pc-${suffix}`)!;
it("accounts separately for four service conduct branches and exact forgery grades",()=>{
 expect(rows).toHaveLength(49);expect(new Set(rows.map(r=>r.id)).size).toBe(49);
 expect(rows.filter(r=>r.references[0].section==="31.04")).toHaveLength(28);
 expect(rows.filter(r=>r.references[0].section==="32.21")).toHaveLength(21);
 expect(priorities.rows.map(r=>r.rank)).toEqual([121,150]);expect(priorities.rows.reduce((n,r)=>n+r.adult,0)).toBe(1268);
 const labels=["Class C","Class B","Class A","State jail","Third-degree","Second-degree","First-degree"];
 for(const kind of ["secured","diverted","rental","nonpayment"]){const r=rows.filter(r=>r.id.startsWith(`tx-pc-31-04-${kind}-`));expect(r).toHaveLength(7);r.forEach((x,i)=>expect(x.penalty.startsWith(labels[i])).toBe(true));}
});
it("preserves service intent, rental exclusions and the two different notice tracks",()=>{
 for(const r of rows.filter(r=>r.references[0].section==="31.04")){expect(r.conduct).toContain("intend to avoid payment AND know");expect(r.conduct).toContain("postdated-check defense");expect(r.conduct).toContain("permits the jury to decline");expect(r.conduct).toContain("fewer than three complete payments");expect(r.conduct).toContain("five business days, excluding Sundays");expect(r.penalty).toContain("if any offense element predates");}
 const r=row("31-04-nonpayment-100-750");expect(r.conduct).toContain("debt or inability to pay alone does not establish");expect(r.conduct).toContain("e-mail or text");expect(r.conduct).toContain("but not (c)’s separate notice conditions");expect(r.conduct).toContain("partial wages alone do not negate");
 expect(row("31-04-rental-under-100").conduct).toContain("excluded from this branch");expect(row("31-04-diverted-under-100").conduct).toContain("does not make all rent-to-own nonpayment a crime");
});
it("uses the current forgery ladder rather than the historical case grades",()=>{
 const ids=["under-100","100-750","750-2500","2500-30000","30000-150000","150000-plus"];
 const grades=["Class B","Class A","State jail","Third-degree","Second-degree","First-degree"];
 ids.forEach((v,i)=>expect(row("32-21-value-"+v).penalty.startsWith(grades[i])).toBe(true));
 expect(row("32-21-commercial").penalty).toMatch(/^Third-degree/);expect(row("32-21-currency").penalty).toMatch(/^Second-degree/);expect(row("32-21-ordinary").penalty).toMatch(/^State jail/);
 expect(row("32-21-value-150000-plus").conduct).toContain("$150,000 or more");
 for(const r of rows.filter(r=>r.references[0].section==="32.21")){expect(r.penalty).toContain("any offense element before that date");expect(r.penalty).toContain("former grade labels are not the current grades");}
});
it("requires the elderly victim finding and exempts the top value-ladder offense",()=>{
 expect(row("32-21-value-100-750-elderly").penalty).toMatch(/^State jail/);
 expect(row("32-21-currency-elderly").penalty).toMatch(/^First-degree/);
 expect(row("32-21-value-150000-plus-elderly")).toBeUndefined();
 for(const r of rows.filter(r=>r.id.endsWith("elderly"))){expect(r.conduct).toContain("AGAINST an elderly individual (age 65 or older)");expect(r.conduct).toContain("not merely involve an older witness");}
});
it("binds the 2026 majority, permissive presumptions and no automatic check-felony shortcut",()=>{
 const r=row("32-21-commercial");expect(r.conduct).toContain("not an automatic felony classification");expect(r.conduct).toContain("even without an objection");expect(r.conduct).toContain("egregious harm");expect(r.conduct).toContain("An uncharged greater offense");expect(r.conduct).toContain("must be pleaded");
 expect(row("32-21-value-under-100").conduct).toContain("not a universal rule");
 for(const r of rows.filter(r=>r.references[0].section==="32.21")){expect(r.conduct).toContain("Mere possession without that intent");expect(r.conduct).toContain("September 1, 2023");expect(r.conduct).toContain("optional jury inference");}
 expect(courts.documents.find(d=>d.id==="lennox-2026")!.text).toContain("A trial court must instruct on offense elements even absent objection");
 for(const d of [...enactments.documents,...courts.documents]){expect(createHash("sha256").update(d.text).digest("hex")).toBe(d.textSha256);for(const span of d.spans){expect(d.text.slice(span.start,span.end)).toBe(span.text);expect(createHash("sha256").update(span.text).digest("hex")).toBe(span.sha256);}}
 const bill=(id:string,sec:string)=>enactments.documents.find(d=>d.id===id)!.spans.find(s=>s.section===sec)!.text;
 for(const id of ["SB01379","HB03463"]){expect(bill(id,"2")).toContain("if any element");expect(bill(id,"3")).toContain("September 1, 2025");}
 expect(bill("HB01910","3")).toContain("September 1, 2023");
});
it("retires the legacy felony summary without aliasing saved users to a new charge",()=>{
 expect(getChargeById("tx-forgery")).toBeUndefined();
 for(const c of [{id:"tx-forgery",name:"Forgery",code:"32.21",classification:"felony"},{name:"Forgery",code:"32.21",classification:"felony"}])expect(resolveGuidanceCharge(c,"TX")).toBeUndefined();
 const m=loadTexasAuthorityManifest();expect(m.catalogRecords.find(r=>r.chargeId==="tx-forgery")).toMatchObject({disposition:"require_exact_reselection",provisions:[]});expect(buildTexasSourceDatabaseSeed(m).selectableChargeIds).not.toContain("tx-forgery");
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
    expect(chargeCategories["Theft Crimes"]).toContain(r.id);
    for(const lang of ["en","es","zh"]) expect(getChargeExplanation(r.name,"TX",lang,r.id)).toMatchObject({plainSummary:r.conduct,degreeContext:r.penalty,untranslated:lang!=="en",translationDraft:false});
    expect(resolveGuidanceCharge({id:r.id,name:r.name,code:r.code,classification:r.category},"TX")).toMatchObject({id:r.id});
    expect(resolveGuidanceCharge({name:r.name,code:r.code,classification:r.category},"TX")).toBeUndefined();
  }
});
