import {createHash} from "node:crypto";
import {expect,it} from "vitest";
import rows from "../shared/texas-sexual-commerce.json";
import evidence from "../scripts/data-review/output/texas-sexual-commerce-evidence.json";
import enactments from "../scripts/data-review/output/texas-sexual-commerce-enactments.json";
import priorities from "../scripts/data-review/output/texas-sexual-commerce-priorities.json";
import {chargeCategories,getChargeById,getInstructionRef,getVerifiedCitation} from "../shared/criminal-charges";
import {getChargeExplanation} from "../shared/charge-explanations";
import {resolveGuidanceCharge} from "../shared/guidance-charge-resolution";
import {loadTexasAuthorityManifest} from "../server/data/texas-manifest-loader";
import {buildTexasManifestRecord,buildTexasSourceDatabaseSeed} from "../server/data/texas-source-database-seed";
const row=(id:string)=>rows.find(r=>r.id===id)!;
const bill=(id:string,section:string)=>enactments.documents.find(d=>d.id===id)!.spans.find(s=>s.section===section)!.text;
it("accounts for21 choices and preserves the held ambiguous legacy role",()=>{
 expect(rows).toHaveLength(21);expect(priorities.rows.map(r=>r.rank)).toEqual([101,120]);expect(priorities.rows.reduce((n,r)=>n+r.adult,0)).toBe(1899);
 expect(buildTexasSourceDatabaseSeed(loadTexasAuthorityManifest()).selectableChargeIds).not.toContain("tx-solicitation");
});
it("distinguishes receiving-fee role, victim defense and deferred-prior/no-double-use rules",()=>{
 expect(evidence["PE:43.02"].text).toContain("knowingly offers or agrees to receive a fee");expect(evidence["PE:43.02"].text).toContain("because the actor was the victim");
 for(const r of rows.filter(r=>r.references[0].section==="43.02")){expect(r.conduct).toContain("receiving-fee offense");expect(r.conduct).toContain("causal connection");expect(r.conduct).toContain("deferred adjudication");expect(r.conduct).toContain("but not both");}
 expect(row("tx-pc-43-02-one-two-priors").penalty).toContain("Class A");expect(row("tx-pc-43-02-three-priors").penalty).toContain("State jail");
});
it("retains statutory supervision requirements instead of presenting custody maxima as unconditional",()=>{
 expect(evidence["CR:42A.515"].text).toContain("shall suspend");expect(evidence["CR:42A.515"].text).toContain("jury");
 expect(row("tx-pc-43-02-ordinary").penalty).toContain("requires suspension");expect(row("tx-pc-43-02-three-priors").penalty).toContain("unless the defendant previously");
 expect(row("tx-pc-43-04").penalty).toContain("victim-only finding exception");expect(row("tx-pc-43-04").penalty).toContain("Deferred adjudication is a separate question");
});
it("separates actual, represented and believed minors and punishment-only school enhancement",()=>{
 for(const tag of ["actual","represented","believed"]){const r=row("tx-pc-43-021-minor-"+tag);expect(r.penalty).toContain("Second-degree");const school=row(r.id+"-school");expect(school.penalty).toContain("Underlying second-degree felony");expect(school.penalty).toContain("Punished as a first-degree");}
 expect(row("tx-pc-43-021-minor-represented").conduct).toContain("does not require proof that the person actually is a minor");expect(row("tx-pc-43-021-adult-prior-school").penalty).toContain("Punished as a second-degree");
 expect(evidence["PE:43.021"].text).toContain("punishment prescribed for the next highest category");
 for(const r of rows.filter(r=>r.references[0].section==="43.021")){expect(r.penalty).toContain("not simply an under-18 label");expect(r.penalty).toContain("School-enhanced repeat and minor cases");}
});
it("protects the actual enactment chronology against misleading latest-date inferences",()=>{
 expect(bill("HB01540","29")).toContain("state jail felony [ Class A misdemeanor ]");expect(bill("HB01540","61")).toContain("1,000 feet");expect(bill("SB01831","9")).toContain("1,000 feet");expect(bill("SB01527","2.04")).toContain("redesignated as Section 43.021(b-1)");expect(bill("HB01778","2.01")).toContain("person with respect to whom");
 expect(bill("SB01802","3")).toContain("third degree [ state jail felony ]");expect(bill("SB01653","1")).toContain("[ engaging in prostitution ]");
 for(const r of rows.filter(r=>r.references[0].section==="43.021")){expect(r.penalty).toContain("began September 1, 2021, not 2025");expect(r.penalty).toContain("enacted in 2021 and relocated");}
 expect(row("tx-pc-43-032").penalty).toContain("period entirely on or after");expect(row("tx-pc-43-032").penalty).not.toContain("If any element");
 for(const d of enactments.documents){expect(createHash("sha256").update(d.text).digest("hex")).toBe(d.textSha256);for(const s of d.spans){expect(d.text.slice(s.start,s.end)).toBe(s.text);expect(createHash("sha256").update(s.text).digest("hex")).toBe(s.sha256);}}
});
it("preserves promotion personal-service exclusion and continuous-offense count constraints",()=>{
 expect(evidence["PE:43.03"].text).toContain("acting other than as a prostitute receiving compensation");
 for(const r of rows.filter(r=>r.references[0].section==="43.03"))expect(r.conduct).toContain("excluded personal-services role");
 const r=row("tx-pc-43-032");expect(r.conduct).toContain("30 or more days");expect(r.conduct).toContain("two or more times");expect(r.conduct).toContain("must unanimously agree");expect(r.conduct).toContain("same-victim restrictions");expect(row("tx-pc-43-04").conduct).toContain("two or more persons");
 for(const r of rows){expect(chargeCategories["Sexual Offenses"]).toContain(r.id);expect(getInstructionRef(getChargeById(r.id)!)).toBeNull();}
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


