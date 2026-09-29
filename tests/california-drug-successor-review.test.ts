import {describe,expect,it} from "vitest";
import additions from "../shared/california-drug-successor-additions.json";
import receipt from "../scripts/data-review/output/california-archive-refresh-receipt.json";
import {readCaliforniaDrugSuccessorReview,readCaliforniaDrugSuccessorAcquisition,validateCaliforniaDrugSuccessorReview} from "../scripts/data-review/california-verification/drug-successor-review";
import {getChargeById,classifyChargesForGuidance,chargeCategories} from "../shared/criminal-charges";
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from "../shared/california-authority";
import {getChargeExplanation} from "../shared/charge-explanations";
import {buildCaliforniaSourceDatabaseSeed} from "../server/data/california-source-database-seed";
const row=(code:string)=>additions.find(a=>a.code===code)!;

describe("California combined drug successor",()=>{
  it("reuses primary sources and accounts for every previous benchmark gap without clearing unrelated holds",()=>{
    expect(validateCaliforniaDrugSuccessorReview()).toEqual({additions:18,primarySections:14,reusedSections:38,newSections:1,newVersions:1,newBenchmarkMatches:16,configuredSelectable:319});
    const review=readCaliforniaDrugSuccessorReview();
    expect(review.crosswalk).toHaveLength(46);
    expect(review.crosswalk.filter(r=>r.status==="partial_catalog_match")).toHaveLength(4);
    expect(review.crosswalk.filter(r=>r.status==="benchmark_source_absent")).toHaveLength(2);
    expect(review.crosswalk.find(r=>r.instruction==="2307")?.status).toBe("penalty_context_only");
    expect(Object.keys(readCaliforniaDrugSuccessorAcquisition().documents)).toEqual(["BPC:26032"]);
  });
  it("rejects missing sources, altered definitions, wrong instruction mappings and silent hold clearance",()=>{
    const lost=readCaliforniaDrugSuccessorReview();lost.sections.pop();
    expect(()=>validateCaliforniaDrugSuccessorReview(lost)).toThrow("section accounting");
    const changed=structuredClone(additions);changed[0].penalty="No incarceration";
    expect(()=>validateCaliforniaDrugSuccessorReview(undefined,changed)).toThrow("definition changed");
    const missing=readCaliforniaDrugSuccessorReview();missing.records[0].sources.pop();
    expect(()=>validateCaliforniaDrugSuccessorReview(missing)).toThrow("Incomplete successor dependencies");
    const bad=readCaliforniaDrugSuccessorReview();bad.crosswalk.find(r=>r.instruction==="2352")!.chargeIds=["ca-hsc-11358"];
    expect(()=>validateCaliforniaDrugSuccessorReview(bad)).toThrow("benchmark match");
    const cleared=readCaliforniaDrugSuccessorReview();cleared.crosswalk.find(r=>r.instruction==="2412")!.status="bounded_successor_matches";
    expect(()=>validateCaliforniaDrugSuccessorReview(cleared)).toThrow("benchmark match");
    const excerpt=readCaliforniaDrugSuccessorReview();excerpt.records[0].primaryEvidence.text="unbound";
    expect(()=>validateCaliforniaDrugSuccessorReview(excerpt)).toThrow("excerpt");
    const acquisition=readCaliforniaDrugSuccessorAcquisition();acquisition.documents["BPC:26032"][0].contentXml+="changed";
    expect(()=>validateCaliforniaDrugSuccessorReview(undefined,undefined,acquisition)).toThrow("provenance");
  });
  it("preserves cannabis authorization, quantities and conditional penalties",()=>{
    for(const code of ["11358","11359","11360(a)"]) {
      expect(row(code).supportingKeys).toContain("BPC:26032");
      expect(row(code).summary).toContain("Lawful adult-use, medical and licensed commercial activity");
      expect(row(code).categories).toEqual(["misdemeanor","felony"]);
      expect(row(code).penalty).toContain("6 months");
    }
    expect(row("11358").summary).toContain("Exactly six plants");
    expect(row("11358").penalty).toContain("an environmental concern alone is insufficient");
    for(const code of ["11359","11360(a)"])expect(row(code).penalty).toContain("$20,000");
    expect(row("11360(a)").penalty).toContain("4 grams, not the 8-gram");
    expect(row("11360(a)").summary).toContain("infraction must not be assigned the (a) penalty");
    expect(row("11360(a)").summary).toContain("Transport requires a sale purpose");
  });
  it("distinguishes offer, manufacture, transfer, false-compartment and armed-use theories",()=>{
    expect(row("11379.6(e)").penalty).toContain("3, 4 or 5 years");
    expect(row("11379.6(e)").penalty).toContain("not substituted for this offer branch");
    expect(row("11379.6(e)").summary).toContain("although CALCRIM 2331 still cites (c)");
    for(const code of ["11383","11383.5"])expect(row(code).penalty).toContain("2, 4 or 6 years");
    for(const code of ["11383.6","11383.7"]) {
      expect(row(code).penalty).toContain("16 months, 2 years or 3 years");
      expect(row(code).summary).toContain("knowing");
    }
    expect(row("11366.8(a)").summary).toContain("unchanged factory space is not enough");
    expect(row("11366.8(b)").categories).toEqual(["felony"]);
    expect(row("11550(e)(1)").summary).toContain("being under the influence, not merely possessing a drug");
    expect(row("11550(e)(1)").penalty).toContain("second or later conviction");
    expect(row("11366.7(b)").penalty).toContain("$25,000");
  });
  it("keeps monetary thresholds and the two attorney-fee rules distinct",()=>{
    expect(row("11370.6(a)").summary).toContain("Exactly $100,000 is insufficient");
    expect(row("11370.6(a)").summary).toContain("act in substantial furtherance");
    expect(row("11370.6(a)").summary).toContain("additionally requires intent");
    for(const letter of ["a","b","c","d"]) {
      const a=row(`11370.9(${letter})`);
      expect(a.summary).toContain("within 30 days");
      expect(a.summary).toContain("exactly $25,000 is insufficient");
      expect(a.summary).toContain("excludes the specified criminal-defense");
      expect(a.penalty).toContain("whichever is greater");
      expect(a.penalty).toContain("alone or with imprisonment");
    }
  });
  it("delivers all choices and preserves currentness, translations and charging-paper aliases",()=>{
    const now=new Date(receipt.checkedAt),seed=buildCaliforniaSourceDatabaseSeed(now);
    for(const a of additions) {
      const record=getCaliforniaCanonicalRecord(a.id)!;
      expect(chargeCategories["Drug Offenses"]).toContain(a.id);
      expect(getChargeById(a.id)).toMatchObject({code:a.code,name:a.title,maxPenalty:a.penalty,categories:a.categories});
      expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({id:a.id,maxPenalty:a.penalty,categories:a.categories});
      expect(seed.links.filter(l=>l.chargeId===a.id)).toHaveLength(a.supportingKeys.length+1);
      expect(getCaliforniaRecordEvidenceStatus(record,now)).toBe("current");
      expect(getCaliforniaRecordEvidenceStatus(record,new Date(receipt.expiresAt))).not.toBe("current");
      for(const language of ["en","es","zh"])expect(getChargeExplanation("wrong title","CA",language,a.id)).toMatchObject({canonicalChargeId:a.id,plainSummary:a.summary,degreeContext:a.penalty,untranslated:language!=="en"});
    }
    expect(getChargeById("ca-hsc-11383-5")?.searchAliases).toContain("ephedrine possession with intent to manufacture");
  });
});
