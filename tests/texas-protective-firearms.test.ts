import transition from "../scripts/data-review/output/texas-protective-duration-transition.json";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-protective-firearms.json";
import evidence from "../scripts/data-review/output/texas-protective-firearms-evidence.json";
import courts from "../scripts/data-review/output/texas-protective-firearms-court-context.json";
import { getChargeById, getVerifiedCitation, getInstructionRef } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord } from "../server/data/texas-source-database-seed";

it("publishes five distinct finite-term categories with actual notice and officer conditions",()=>{
 expect(rows).toHaveLength(5);expect(new Set(rows.map(r=>r.id)).size).toBe(5);
 expect(evidence["PE:46.04"].text).toContain("after receiving notice of the order and before expiration");
 expect(evidence["PE:46.04"].text).toContain("sworn, full-time paid employee");
 for(const r of rows){expect(r.name).toContain("finite-term");expect(r.conduct).toContain("receipt of notice");expect(r.conduct).toContain("not an added statutory element or proof of constitutional validity");expect(r.penalty).toContain("Class A");expect(r.penalty).toContain("46.11");expect(getInstructionRef(getChargeById(r.id)!)).toBeNull();}
});
it("does not confuse present emergency duration or foreign recognition with mere status",()=>{
 const emergency=rows.find(r=>r.id.endsWith("emergency-order"))!;
 expect(evidence["CR:17.292"].text).toContain("not less than 61 days");expect(evidence["CR:17.292"].text).toContain("121st day");expect(emergency.conduct).toContain("61–91 days");expect(emergency.conduct).toContain("91–121 days");
 expect(evidence["FA:88.003"].text).toContain("reasonable notice and an opportunity to be heard");expect(evidence["FA:88.004"].text).toContain("registration or filing of an order in this state is not required");
 const foreign=rows.find(r=>r.id.endsWith("foreign-order"))!;expect(foreign.conduct).toContain("not irrebuttable validity");expect(foreign.conduct).toContain("reasonable opportunity to comply");
});
it("retains agreed, default, modification and lifetime boundaries without inventing blanket invalidity",()=>{
 expect(evidence["FA:85.005"].text).toContain("regardless of whether the court makes the findings");expect(evidence["FA:85.006"].text).toContain("proof of service was filed");expect(evidence["CR:7B.007"].text).toContain("duration of the lives");
 for(const r of rows){expect(r.conduct).toContain("lifetime, indefinite and ex-parte-only");expect(r.conduct).toContain("not declared lawful to disregard");}
});
it("binds actual majority opinions and exact quoted spans",()=>{
 for(const d of courts.documents){expect(createHash("sha256").update(d.text).digest("hex")).toBe(d.textSha256);for(const s of d.spans){expect(d.text.slice(s.start,s.end)).toBe(s.text);expect(createHash("sha256").update(s.text).digest("hex")).toBe(s.sha256);}}
 const noyes=courts.documents.find(d=>d.id==="noyes")!.text.replace(/\s+/g," ");expect(noyes).toContain("vacate the judgment");expect(noyes).toContain("remand the case");
 expect(courts.documents.find(d=>d.id==="rahimi")!.text).toContain("credible threat");
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

it("preserves the three event-based duration rules and Chapter 7B precedence", () => {
  const source=evidence["FA:85.025"].text;
  expect(source).toContain("final decree of dissolution of the marriage is approved and signed");
  expect(source).toContain("final order in the suit is rendered");
  expect(source).toContain("final disposition of the criminal case");
  for (const id of ["dissolution-order", "family-order"]) {
    const r=rows.find(row=>row.id.endsWith(id))!;
    for (const part of ["Under (a-2)", "Under (a-3)", "Under (a-4)", "applicant’s family or household", "Penal Code Title 5", "§25.11", "not from issuance", "orders rendered on or after September 1, 2025"])
      expect(r.conduct).toContain(part);
    expect(getChargeById(r.id)!.description).toBe(r.conduct);
  }
  const chapter=rows.find(r=>r.id.endsWith("chapter7b-order"))!;
  expect(chapter.conduct).toContain("(a-2), (a-3) and (a-4)");
  expect(chapter.conduct).toContain("must not replace article 7B.007’s controlling duration rules");
});
it("binds the official rendition-date applicability rather than automatically extending older orders", () => {
  expect(createHash("sha256").update(transition.text).digest("hex")).toBe(transition.textSha256);
  for (const span of transition.spans) {
    expect(transition.text.slice(span.start,span.end)).toBe(span.text);
    expect(createHash("sha256").update(span.text).digest("hex")).toBe(span.sha256);
  }
  expect(transition.spans.find(s=>s.section==="11")!.text).toContain("apply only to a protective order rendered on or after");
  expect(transition.spans.find(s=>s.section==="11")!.text).toContain("law in effect on the date the order is rendered");
  expect(transition.spans.find(s=>s.section==="12")!.text).toContain("September 1, 2025");
});
