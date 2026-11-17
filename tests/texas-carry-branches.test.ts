import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import evidence from "../scripts/data-review/output/texas-carry-branches-evidence.json";
import rows from "../shared/texas-carry-branches.json";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";

it("binds the five distinct convictions to conduct within five years, independently of age", () => {
  const prior = rows.filter(row => row.code === "46.02(a)(2)(B)");
  expect(prior.map(row => row.references[5]).map(ref => ref.section + (ref.subdivision ?? "")))
    .toEqual(["22.01(a)(1)", "22.05", "22.07", "42.01(a)(7)", "42.01(a)(8)"]);
  for (const row of prior) {
    expect(row.conduct).toContain("already have been convicted");
    expect(row.conduct).toContain("prior offense must have been committed during the preceding five years");
    expect(row.conduct).toContain("neither inside nor directly en route");
    expect(row.references[1]).toMatchObject({section:"46.02", subdivision:"(b)", supportRole:"grading"});
  }
});

it("preserves each vehicle predicate, exceptions, and instruction limits", () => {
  const find = (suffix:string) => rows.find(r => r.id === "tx-pc-46-02-" + suffix)!;
  expect(find("vehicle-plain-view").conduct).toContain("age 21 or older");
  expect(find("vehicle-criminal-activity").conduct).toContain("regulating traffic or boating");
  expect(find("vehicle-prohibition-felony").conduct).toContain("premises where the person lives");
  expect(find("vehicle-prohibition-family").conduct).toContain("later of release");
  expect(find("vehicle-prohibition-order").conduct).toContain("before it expires");
  for (const row of rows.filter(r => r.id.includes("vehicle-prohibition"))) {
    expect(row.penalty).toMatch(/^Class A misdemeanor/);
    expect(row.references.find(ref => ref.section === "46.04")).toBeDefined();
  }
  expect(getInstructionRef(getChargeById(find("vehicle-criminal-activity").id)!)).toContain("motor vehicle only");
  expect(getInstructionRef(getChargeById(find("recent-assault").id)!)).toContain("misdemeanor bodily-injury predicate");
  expect(getInstructionRef(getChargeById(find("recent-deadly-conduct").id)!)).toBeNull();
  expect(getInstructionRef(getChargeById("tx-pc-46-02-a-5")!)).toContain("intentional public display");
});

it("replays official evidence for each choice and keeps generic saved weapons held", () => {
  const manifest = loadTexasAuthorityManifest();
  const docs = new Map(Object.entries(evidence));
  for (const row of rows) {
    const record = manifest.catalogRecords.find(r => r.chargeId === row.id)!;
    expect(record.provisions.map(p=>[p.lawId,p.section,p.subdivision,p.supportRole]))
      .toEqual(row.references.map(r=>[r.code,r.section,r.subdivision,r.supportRole]));
    for (const p of record.provisions) {
      const doc = docs.get(p.lawId+":"+p.section)!;
      expect(p.content).toBe(doc.text);
      expect(createHash("sha256").update(JSON.stringify(doc.text)).digest("hex")).toBe(p.contentHash);
    }
    expect(getVerifiedCitation(getChargeById(row.id)!)).toBe(row.citation);
    expect(getChargeExplanation(row.name,"TX","es",row.id)).toMatchObject({untranslated:true,plainSummary:row.conduct});
    expect(row.dpsCode).toBe("");
  }
  expect(manifest.catalogRecords.find(r=>r.chargeId==="tx-unlawful-carrying-of-weapon")?.disposition).toBe("require_exact_reselection");
});
