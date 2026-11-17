import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import rows from "../shared/texas-possession-weights.json";
import priorities from "../scripts/data-review/output/texas-possession-weights-priorities.json";
import first75 from "../scripts/data-review/output/texas-2025-arrest-priorities-top75.json";
import evidence from "../scripts/data-review/output/texas-possession-weights-evidence.json";

it("binds the seven arrest codes to the section and ranking reported by DPS", () => {
  expect(priorities.sha256).toBe(first75.sha256);
  expect(priorities.rows.map(r=>r.rank)).toEqual([29,34,46,55,70,88,113]);
  expect(priorities.rows.reduce((sum,r)=>sum+r.adult,0)).toBe(22824);
  for (const {rank,...reported} of priorities.rows) {
    if (rank<=75) expect(first75.top75[rank-1]).toEqual(reported);
    const matched=rows.filter(r=>r.dpsCode===reported.code);
    expect(matched.length).toBeGreaterThan(0);
    for (const r of matched) expect(r.references[1].section+r.references[1].subdivision).toBe(reported.citation);
  }
});

it("preserves weight boundaries, elevated fines, conditional supervision and separate overdose defenses", () => {
  const byCode = new Map(rows.map(r=>[r.code,r]));
  expect(byCode.get("481.116(d)")?.conduct).toContain("4 to under 400 grams");
  expect(byCode.get("481.117(b)")?.conduct).toContain("under 28 grams");
  expect(byCode.get("481.117(b)")?.conduct).toContain("first caller");
  expect(byCode.get("481.117(c)")?.conduct).not.toContain("first caller");
  expect(byCode.get("481.115(f)")?.penalty).toContain("ten to 99 years or life");
  expect(byCode.get("481.115(f)")?.penalty).toContain("$100,000");
  expect(byCode.get("481.116(e)")?.penalty).toContain("$50,000");
  for (const sec of ["481.1161","481.121"]) {
    const ordinary=byCode.get(sec+"(b)(3)")!;
    expect(ordinary.conduct).toContain("over four ounces through five pounds");
    expect(ordinary.penalty).toContain("one pound or less");
    expect(ordinary.penalty).toContain("above one pound");
    expect(ordinary.references).toContainEqual({code:"CR",section:"42A.551",subdivision:"(a), (b), (c), (d), (e)",supportRole:"penalty"});
  }
  const zone=byCode.get("481.134(f)")!;
  expect(zone.conduct).toContain("inside a private residence when no minor was present");
  expect(zone.references).toContainEqual({code:"HS",section:"481.121",subdivision:"(b)(1)",supportRole:"grading"});
  for (const sub of ["(1)","(2)"]) expect(byCode.get("481.1161(b)"+sub)?.references.some(ref=>ref.section==="481.134")).toBe(false);
  const dangerous=rows.filter(r=>r.dpsCode==="35990133");
  expect(dangerous.map(r=>r.references[0].subdivision)).toEqual(["(a)","(b)"]);
  expect(dangerous[0].conduct).toContain("overdose defense");
  expect(dangerous[1].conduct).not.toContain("overdose defense");
});

it("includes the treatment-center grade while retaining the separate shelter hold", () => {
  const row=rows.find(r=>r.code==="30.05(d)(3)(D)")!;
  expect(row.conduct).toContain("actually operating as a residential treatment center");
  expect(row.references).toContainEqual({code:"HR",section:"42.002",subdivision:"(4)",supportRole:"grading"});
  expect(evidence["PE:30.05"].text).toContain("(D) the offense is committed on the property of or within a general residential operation operating as a residential treatment center");
  expect(getChargeById("tx-trespass-after-warning")?.maxPenalty).toContain("general residential operation");
  expect(getChargeById("tx-pc-30-05-shelter")).toBeUndefined();
});

it("keeps all evidence and instruction scopes explicit and translations honest", () => {
  const docs=new Map(Object.entries(evidence));
  const manifest=loadTexasAuthorityManifest();
  for (const row of rows) {
    const record=manifest.catalogRecords.find(r=>r.chargeId===row.id)!;
    expect(record.provisions.map(p=>[p.lawId,p.section,p.subdivision,p.supportRole])).toEqual(row.references.map(r=>[r.code,r.section,r.subdivision,r.supportRole]));
    for (const p of record.provisions) {
      const source=docs.get(p.lawId+":"+p.section)!;
      expect(p.contentHash).toBe(createHash("sha256").update(JSON.stringify(source.text)).digest("hex"));
    }
    const charge=getChargeById(row.id)!;
    expect(getVerifiedCitation(charge)).toBe(row.citation);
    if (row.code.startsWith("481.121")) expect(getInstructionRef(charge)).toContain("CPJC 81.9");
    if (row.code.startsWith("483.")) expect(getInstructionRef(charge)).toBeNull();
    expect(getChargeExplanation(row.name,"TX","es",row.id)).toMatchObject({plainSummary:row.conduct,untranslated:true});
  }
});
