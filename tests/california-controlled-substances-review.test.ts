import { describe, expect, it } from "vitest";
import additions from "../shared/california-controlled-substances-additions.json";
import { readCaliforniaControlledSubstancesReview, readCaliforniaControlledSubstancesAcquisition, readCaliforniaDrugBenchmark, validateCaliforniaControlledSubstancesReview, validateDrugBenchmark } from "../scripts/data-review/california-verification/controlled-substances-review";
import { getCaliforniaPrimaryCategory, getCaliforniaCanonicalRecord, getCaliforniaRecordEvidenceStatus } from "../shared/california-authority";
import { criminalCharges, getChargeById, classifyChargesForGuidance } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { buildCaliforniaSourceDatabaseSeed } from "../server/data/california-source-database-seed";
import receipt from "../scripts/data-review/output/california-archive-refresh-receipt.json";
const byCode = (code: string) => additions.find(a=>a.code===code)!;

describe("California drug batch and independent miss detection", () => {
  it("accounts for the whole chapter, independent out-of-chapter probes and explicit gaps", () => {
    expect(validateCaliforniaControlledSubstancesReview()).toEqual({additions:27,candidateSections:104,reviewedPrimarySections:20,existingPrimarySections:6,remainingResearchSections:77,absentBenchmarkSections:1,benchmarkInstructions:46,reusedSections:23,newSections:98,newVersions:99,configuredSelectable:319});
    const review = readCaliforniaControlledSubstancesReview();
    for (const key of ["HSC:11358","HSC:11359","HSC:11360","HSC:11366.8","HSC:11370.6","HSC:11383","HSC:11383.5"]) expect(review.sections.find(s=>s.key===key)?.status).toBe("substantive_research_open");
    expect(review.sections.find(s=>s.key==="BPC:4326")).toMatchObject({status:"benchmark_source_absent",versions:[],evidence:null});
    expect(review.crosswalk.find(c=>c.instruction==="2331")).toMatchObject({status:"publication_gap",chargeIds:[]});
    expect(review.crosswalk.find(c=>c.instruction==="2305")?.status).toBe("non_offense_instruction");
    expect(review.crosswalk.find(c=>c.instruction==="2380")?.status).toBe("partial_catalog_match");
  });
  it("rejects missing sections, edited definitions, missing dependencies and invented dispositions", () => {
    const missing = readCaliforniaControlledSubstancesReview(); missing.sections.pop();
    expect(()=>validateCaliforniaControlledSubstancesReview(missing)).toThrow("section accounting");
    const prose = structuredClone(additions); prose[0].penalty = "No incarceration";
    expect(()=>validateCaliforniaControlledSubstancesReview(undefined,prose)).toThrow("definition changed");
    const dependencies = readCaliforniaControlledSubstancesReview(); dependencies.records[0].sources.pop();
    expect(()=>validateCaliforniaControlledSubstancesReview(dependencies)).toThrow("Incomplete drug dependencies");
    const cleared = readCaliforniaControlledSubstancesReview(); cleared.sections.find(s=>s.key==="HSC:11358")!.status="addition_branches_reviewed_other_branches_open";
    expect(()=>validateCaliforniaControlledSubstancesReview(cleared)).toThrow("section disposition");
    const excerpt = readCaliforniaControlledSubstancesReview(); excerpt.records[0].primaryEvidence.text="unbound";
    expect(()=>validateCaliforniaControlledSubstancesReview(excerpt)).toThrow("source excerpt");
    const source = readCaliforniaControlledSubstancesAcquisition(); source.documents["HSC:11377"][0].contentXml+="tampered";
    expect(()=>validateCaliforniaControlledSubstancesReview(undefined,undefined,source)).toThrow("provenance");
  });
  it("uses only the common sedative exclusion without silently picking a source version", () => {
    const review = readCaliforniaControlledSubstancesReview();
    const decision = review.sourceVersionDecisions[0];
    expect(new Set(decision.excerpts.map(e=>e.versionId)).size).toBe(2);
    expect(decision.excerpts[0].text).toBe(decision.excerpts[2].text);
    expect(decision.excerpts[1].text).toBe(decision.excerpts[3].text);
    expect(byCode("11377(a)").sourceEffectiveDates["HSC:11375"]).toBeNull();
    expect(additions.some(a=>a.code.startsWith("11375"))).toBe(false);
    decision.excerpts.splice(2);
    expect(()=>validateCaliforniaControlledSubstancesReview(review)).toThrow("exception version");
  });
  it("binds the complete independent instruction inventory and refuses to clear benchmark gaps", () => {
    const benchmark = readCaliforniaDrugBenchmark(); benchmark.pages[0].text += "changed";
    expect(()=>validateDrugBenchmark(benchmark)).toThrow("benchmark page");
    const missing = readCaliforniaControlledSubstancesReview().crosswalk; missing.pop();
    expect(()=>validateDrugBenchmark(undefined,missing)).toThrow("inventory");
    const cleared = readCaliforniaControlledSubstancesReview().crosswalk; cleared.find(r=>r.instruction==="2441")!.status="catalog_branch_matches_found";
    expect(()=>validateDrugBenchmark(undefined,cleared)).toThrow("gap silently cleared");
    const wrongMatch = readCaliforniaControlledSubstancesReview().crosswalk; wrongMatch.find(r=>r.instruction==="2303")!.chargeIds=[];
    expect(()=>validateDrugBenchmark(undefined,wrongMatch)).toThrow("match drift");
  });
  it("preserves critical conduct, drug, age, county, fine and incarceration boundaries", () => {
    expect(byCode("11365(a)").summary).toContain("Mere presence or knowledge without assistance is insufficient");
    expect(byCode("11365(a)").penalty).toContain("15 to 180 days");
    expect(byCode("11365(a)").penalty).toContain("$30 to $500");
    expect(byCode("11368").penalty).toContain("6 months to 364 days");
    expect(byCode("11368").summary).toContain("Intent to defraud is not a separate required element");
    expect(byCode("11370.1(a)").summary).toContain("Lawful fentanyl possession");
    expect(byCode("11370.1(a)").summary).toContain("loaded, operable firearm");
    expect(byCode("11379(a)").summary).toContain("moving drugs solely for personal use is not enough");
    expect(byCode("11379(b)").summary).toContain("Crossing any county boundary is not enough");
    expect(byCode("11379(b)").penalty).toContain("3, 6, or 9");
    expect(byCode("11379.2").summary).toContain("anabolic steroids");
    expect(byCode("11357(b)(2)").penalty).toContain("excludes this subdivision");
    expect(byCode("11357(c)").penalty).toContain("First offense: a fine up to $250");
    expect(byCode("11361(b)").summary).toContain("Sale or an offer to sell");
    expect(byCode("11361(a)").summary).toContain("cannabis-product");
    expect(byCode("11550(a)").summary).toContain("subdivision (e) is outside this entry");
    for (const a of additions.filter(a=>["11351.5","11353(a)","11355","11361(a)"].includes(a.code))) expect(a.penalty).toContain("$20,000");
  });
  it("projects all exact identities, non-English notices, guidance and source expiry", () => {
    const now = new Date(receipt.checkedAt), seed=buildCaliforniaSourceDatabaseSeed(now);
    for (const a of additions) {
      const record=getCaliforniaCanonicalRecord(a.id)!;
      expect(record.citation).toContain(`Health & Safety Code § ${a.code}`);
      expect(getChargeById(a.id)).toMatchObject({code:a.code,name:a.title,maxPenalty:a.penalty,categories:a.categories});
      expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({id:a.id,maxPenalty:a.penalty});
      expect(seed.links.filter(l=>l.chargeId===a.id)).toHaveLength(a.supportingKeys.length+1);
      expect(getCaliforniaRecordEvidenceStatus(record,now)).toBe("current");
      expect(getCaliforniaRecordEvidenceStatus(record,new Date(receipt.expiresAt))).not.toBe("current");
      for (const language of ["en","es","zh"]) expect(getChargeExplanation("incorrect name","CA",language,a.id)).toMatchObject({canonicalChargeId:a.id,plainSummary:a.summary,degreeContext:a.penalty,untranslated:language!=="en",translationDraft:false});
    }
  });
});

describe("California primary display tier", () => {
  it("uses highest listed exposure independently of order and keeps alternatives intact", () => {
    for (const categories of [["misdemeanor","felony"],["felony","misdemeanor"],["infraction","misdemeanor","felony"],["misdemeanor","infraction"]]) expect(getCaliforniaPrimaryCategory(categories)).toBe(categories.includes("felony")?"felony":"misdemeanor");
    for (const id of ["ca-pen-241-1","ca-pen-490-4-a-1","ca-pen-487h-a","ca-hsc-11355"]) {
      const charge=getChargeById(id)!;
      expect(charge.category).toBe("felony");
      expect(criminalCharges.find(c=>c.id===id)?.category).toBe("felony");
      expect(charge.categories).toContain("misdemeanor");
      expect(charge.categories).toContain("felony");
    }
    expect(getCaliforniaPrimaryCategory(undefined,"Misdemeanor or felony")).toBe("felony");
    expect(getChargeById("ca-hsc-11357-c")?.category).toBe("misdemeanor");
  });
});
