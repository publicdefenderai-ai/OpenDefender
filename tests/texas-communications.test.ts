import courtContext from "../scripts/data-review/output/texas-communications-court-context.json";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-communications-stalking.json";
import evidence from "../scripts/data-review/output/texas-communications-evidence.json";
import priorities from "../scripts/data-review/output/texas-communications-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import { chargeCategories, criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { needsTexasChargeReselection } from "../shared/texas-reviewed";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";
const row=(suffix:string)=>rows.find(r=>r.id==="tx-pc-"+suffix)!;
it("accounts for one aggregate harassment priority and28 scoped choices",()=>{
 expect(rows).toHaveLength(28);expect(priorities.rows.map(r=>r.rank)).toEqual([60]);expect(priorities.rows[0].adult).toBe(2502);
 for(const {rank,...r}of priorities.rows)expect(r).toEqual(first75.top75[rank-1]);
});
it("preserves intent, public concern, child-harm intent and protected-victim grades",()=>{
 const text=evidence["PE:42.07"].text;expect(text).toContain("unless the communications are made in connection with a matter of public concern");expect(text).toContain("child under 18");expect(text).toContain("The term does not include a judge");
 expect(row("42-07-internet-publication").conduct).toContain("unless made in connection with a matter of public concern");
 expect(row("42-07-electronic-child-harm").conduct).toContain("intends that child to commit suicide");
 expect(row("42-07-judge").penalty).toContain("State jail");expect(row("42-07-judge-repeat").penalty).toContain("Third-degree");expect(row("42-07-court-employee").penalty).toContain("Class A");expect(row("42-07-court-employee-repeat").penalty).toContain("State jail");
 for(const r of rows.filter(r=>r.references[0].section==="42.07"))expect(r.conduct).toContain("conduct before those dates requires the applicable earlier version");
});
it("requires multiple stalking occasions, actual and objective effects and exact repeat predicates",()=>{
 const text=evidence["PE:42.072"].text;expect(text).toContain("on more than one occasion");expect(text).toContain("federally recognized Indian tribe");
 for(const r of rows.filter(r=>r.references[0].section==="42.072")){expect(r.conduct).toContain("Neither a single occasion nor only an objective reaction");if(r.id.endsWith("repeat")){expect(r.penalty).toContain("Second-degree");expect(r.conduct).toContain("substantially similar elements");}else expect(r.penalty).toContain("Third-degree");}
});
it("preserves online impersonation attribution, exclusions, emergency intent and provider defense",()=>{
 const text=evidence["PE:33.07"].text;expect(text).toContain("other than on or through an electronic mail program or message board program");expect(text).toContain("intent to solicit a response by emergency personnel");
 expect(row("33-07-website-message").conduct).toContain("electronic-mail/message-board-program exclusion");expect(row("33-07-false-attribution").penalty).toContain("Class A");expect(row("33-07-emergency-response").penalty).toContain("Third-degree");expect(row("33-07-emergency-response").conduct).toContain("not an invented requirement that a response actually occurs");
 for(const r of rows.filter(r=>r.references[0].section==="33.07"))expect(r.conduct).toContain("solely-employee conditions");
});
it("binds constitutional context to actual opinion text and distinguishes subjective threatening awareness",()=>{
 const ids=new Set(courtContext.documents.map(d=>d.id));
 for(const doc of courtContext.documents){expect(createHash("sha256").update(doc.text).digest("hex")).toBe(doc.textSha256);for(const span of doc.spans){expect(doc.text.slice(span.start,span.end)).toBe(span.text);expect(createHash("sha256").update(span.text).digest("hex")).toBe(span.sha256);}}
 for(const r of rows)for(const id of r.caseContextKeys)expect(ids.has(id)).toBe(true);
 const owens=courtContext.documents.find(d=>d.id==="owens")!.text.replace(/\s+/g," ");expect(owens).toContain("as-applied");
 const counterman=courtContext.documents.find(d=>d.id==="counterman")!.text.replace(/\s+/g," ");expect(counterman).toContain("consciously disregarded");
 expect(row("42-07-repeated-electronic").conduct).toContain("as-applied challenge");expect(row("42-07-threat").conduct).toContain("recklessness about the communication’s threatening character");
});
it("does not publish the unadapted stalking instruction or invent an instruction mapping",()=>{
 for(const r of rows){expect(getInstructionRef(getChargeById(r.id)!)).toBeNull();expect(chargeCategories["Public Order"]).toContain(r.id);}
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


