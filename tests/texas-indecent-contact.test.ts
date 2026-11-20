import {createHash} from "node:crypto";
import {expect,it} from "vitest";
import rows from "../shared/texas-indecent-contact.json";
import evidence from "../scripts/data-review/output/texas-indecent-contact-evidence.json";
import transitions from "../scripts/data-review/output/texas-indecent-contact-transitions.json";
import priorities from "../scripts/data-review/output/texas-indecent-contact-priorities.json";
import {chargeCategories,getChargeById,getInstructionRef,getVerifiedCitation} from "../shared/criminal-charges";
import {getChargeExplanation} from "../shared/charge-explanations";
import {resolveGuidanceCharge} from "../shared/guidance-charge-resolution";
import {loadTexasAuthorityManifest} from "../server/data/texas-manifest-loader";
import {buildTexasManifestRecord,buildTexasSourceDatabaseSeed} from "../server/data/texas-source-database-seed";
const group=(section:string)=>rows.filter(r=>r.references[0].section===section);
it("accounts for30 individually scoped choices and keeps the generic exposure ID withheld",()=>{
 expect(rows).toHaveLength(30);expect(priorities.rows.map(r=>r.rank)).toEqual([84,123]);expect(priorities.rows.reduce((n,r)=>n+r.adult,0)).toBe(2176);
 expect(buildTexasSourceDatabaseSeed(loadTexasAuthorityManifest()).selectableChargeIds).not.toContain("tx-indecent-exposure");
});
it("retains public/nonpublic alternatives and the exact mental-state and contact definitions",()=>{
 expect(evidence["PE:21.07"].text).toContain("if not in a public place");expect(evidence["PE:21.01"].text).toContain("with intent to arouse or gratify");
 for(const r of group("21.07")){expect(r.conduct).toContain("if not public, the actor must be reckless");expect(r.penalty).toContain("any element occurred before that date");expect(r.category).toBe(r.id.endsWith("svp")?"felony":"misdemeanor");}
});
it("keeps all four exposure grades distinct and registration second-violation exception visible",()=>{
 expect(evidence["PE:21.08"].text).toContain("previously convicted two or more times");expect(evidence["CR:62.001"].text).toContain("but not if the second violation results in a deferred adjudication");
 for(const r of group("21.08")){expect(r.conduct).toContain("reckless about whether another person is present");if(!r.id.endsWith("svp"))expect(r.conduct).toContain("excludes a civilly committed sexually violent predator");expect(r.penalty).toContain("second violation results in deferred adjudication");expect(r.penalty).toContain("September 1, 2025");}
});
it("retains both2025 subsection variants and limits common choices outside both special scenarios",()=>{
 const text=evidence["PE:22.012"].text;expect(text).toContain("H.B. 2593");expect(text).toContain("S.B. 1610");expect(text).toContain("felony of the second degree if the victim is a disabled individual or an elderly individual");expect(text).toContain("felony of the third degree if the offense is committed by an actor who is committed");
 for(const r of group("22.012")){expect(r.conduct).toContain("without the other person’s consent");expect(r.conduct).toContain("intent to arouse or gratify");expect(r.conduct).toContain("exclude an elderly individual (65 or older)");expect(r.conduct).toContain("qualifying civil-commitment-facility");if(r.id.endsWith("provider-prior"))expect(r.penalty).toContain("Third-degree");else if(r.id.endsWith("provider"))expect(r.conduct).toContain("both during treatment/service");}
});
it("binds prospective transition clauses to enrolled acts without changing source retrieval dates",()=>{
 for(const doc of transitions.documents){expect(createHash("sha256").update(doc.text).digest("hex")).toBe(doc.textSha256);for(const s of doc.spans){expect(doc.text.slice(s.start,s.end)).toBe(s.text);expect(createHash("sha256").update(s.text).digest("hex")).toBe(s.sha256);}expect(doc.spans.some(s=>s.text.includes("if any element of the offense"))).toBe(true);}
 for(const r of group("22.012"))expect(r.penalty).toContain("September 1, 2023");
});
it("anchors exposure enhancements to 2023 and distinguishes the 2025 reenactment",()=>{
 const hb=transitions.documents.find(d=>d.id==="hb1730")!;
 expect(hb.spans.find(s=>s.section==="1")?.text).toContain("previously convicted two or more times");
 expect(hb.spans.find(s=>s.section==="2")?.text).toContain("if any element of the offense");
 expect(hb.spans.find(s=>s.section==="3")?.text).toContain("September 1, 2023");
 expect(transitions.documents.find(d=>d.id==="sb1179")?.spans.find(s=>s.section==="3")?.text).toContain("felony of the third degree");
 for(const r of group("21.08")){
  expect(r.penalty).toContain("apply to offenses committed on or after September 1, 2023");
  expect(r.penalty).toContain("reenacted the combined text effective September 1, 2025");
  expect(r.penalty).toContain("If any element occurred before September 1, 2023, earlier law governs");
  expect(r.penalty).not.toContain("; The charging date");
 }
});
it("maps the verified genital-exposure instruction only to its supported conduct",()=>{
 for(const r of rows){expect(chargeCategories["Sexual Offenses"]).toContain(r.id);const instruction=getInstructionRef(getChargeById(r.id)!);if(r.id.startsWith("tx-pc-21-08-genitals")){expect(instruction).toContain("CPJC 21.8: Indecent Exposure of Genitals");expect(instruction).toContain("grading separate");}else expect(instruction).toBeNull();}
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


