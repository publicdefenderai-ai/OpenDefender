import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { getChargeExplanation } from "../shared/charge-explanations";
import rows from "../shared/texas-ranked-burglary.json";
import evidence from "../scripts/data-review/output/texas-ranked-burglary-evidence.json";
import priorities from "../scripts/data-review/output/texas-ranked-burglary-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";

it("separates entry, purpose, premises and the special first-degree predicate", () => {
  const get = (suffix:string) => rows.find(r=>r.id==="tx-pc-30-02-"+suffix)!;
  expect(get("building").conduct).toContain("not then open to the public");
  expect(get("habitation").conduct).toContain("adapted for overnight accommodation");
  expect(get("other-felony").conduct).toContain("any party");
  expect(get("other-felony").penalty).toContain("Felony theft alone does not meet");
  expect(get("prescription").conduct).toContain("generally stored");
  expect(getInstructionRef(getChargeById(get("building").id)!)).toContain("entry-with-intent theory");
});

it("retains the vehicle ID, declines its old felony, and distinguishes deferred priors and separate location rules", () => {
  const old = {id:"tx-auto-burglary",code:"30.04",name:"Old answer",classification:"felony"};
  expect(resolveGuidanceCharge(old,"TX")).toBeUndefined();
  expect(resolveGuidanceCharge({...old,classification:"misdemeanor"},"TX")?.id).toBe(old.id);
  expect(resolveGuidanceCharge({...old,id:undefined},"TX")).toBeUndefined();
  const prior = rows.find(r=>r.id==="tx-pc-30-04-one-prior")!;
  expect(prior.conduct).toContain("deferred adjudication");
  expect(prior.penalty).toContain("minimum term of confinement of six months");
  const trespass = rows.filter(r=>r.id.startsWith("tx-pc-30-05"));
  expect(trespass.map(r=>r.id)).toEqual(["tx-pc-30-05-habitation","tx-pc-30-05-superfund","tx-pc-30-05-infrastructure"]);
  for (const row of trespass) expect(row.penalty).toContain("$200");
});

it("keeps the aggregate special-location rank partial and all older building labels held", () => {
  expect(priorities.sha256).toBe(first75.sha256);
  for (const {rank,...r} of priorities.rows.filter(row=>row.rank<=75)) expect(first75.top75[rank-1]).toEqual(r);
  const exact = new Set(rows.map(r=>r.dpsCode).filter(Boolean));
  const matched = priorities.rows.filter(row=>exact.has(row.code));
  expect(matched.map(r=>r.rank)).toEqual([38,39,47,102]);
  expect(matched.reduce((n,r)=>n+r.adult,0)).toBe(14959);
  expect(exact.has("57070019")).toBe(false);
  const manifest=loadTexasAuthorityManifest();
  for (const id of ["tx-burglary-in-the-first-degree","tx-burglary-in-the-second-degree","tx-residential-burglary","tx-commercial-burglary"]) {
    expect(manifest.catalogRecords.find(r=>r.chargeId===id)?.disposition).toBe("require_exact_reselection");
  }
});

it("binds each exact required role to its retained official evidence", () => {
  const manifest = loadTexasAuthorityManifest();
  const docs=new Map(Object.entries(evidence));
  for (const row of rows) {
    const record = manifest.catalogRecords.find(r=>r.chargeId===row.id)!;
    expect(record.provisions.map(p=>[p.lawId,p.section,p.subdivision,p.supportRole])).toEqual(row.references.map(r=>[r.code,r.section,r.subdivision,r.supportRole]));
    for (const p of record.provisions) {
      const doc=docs.get(p.lawId+":"+p.section)!;
      expect(p.content).toBe(doc.text);
      expect(p.contentHash).toBe(createHash("sha256").update(JSON.stringify(doc.text)).digest("hex"));
    }
    expect(getVerifiedCitation(getChargeById(row.id)!)).toBe(row.citation);
    expect(getChargeExplanation(row.name,"TX","es",row.id)).toMatchObject({plainSummary:row.conduct,untranslated:true});
  }
});
