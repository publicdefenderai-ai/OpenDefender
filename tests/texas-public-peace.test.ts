import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import rows from "../shared/texas-public-peace.json";
import evidence from "../scripts/data-review/output/texas-public-peace-evidence.json";
import enactments from "../scripts/data-review/output/texas-public-peace-enactments.json";
import priorities from "../scripts/data-review/output/texas-public-peace-priorities.json";
import { chargeCategories, criminalCharges, getChargeById, getInstructionRef, getVerifiedCitation } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed, parseTexasCitation } from "../server/data/texas-source-database-seed";
const row = (id: string) => rows.find(r => r.id === id)!;
const bill = (id: string, section: string) => enactments.documents.find(d => d.id === id)!.spans.find(s => s.section === section)!.text;
const obstruction = rows.filter(r => r.references[0].section === "42.03");

it("accounts for25 choices without presenting arrests as subdivision counts", () => {
  expect(rows).toHaveLength(25); expect(new Set(rows.map(r => r.id)).size).toBe(25);
  expect(priorities.rows.map(r => r.rank)).toEqual([99,118,122]);
  expect(priorities.rows.reduce((n,r) => n+r.adult,0)).toBe(2712);
  expect(obstruction).toHaveLength(21);
  expect(rows.filter(r => r.category === "felony")).toHaveLength(15);
});
it("requires exact reselection for the retired section-wide identity and preserves the municipal hold", () => {
  const manifest = loadTexasAuthorityManifest();
  const seed = buildTexasSourceDatabaseSeed(manifest);
  for (const id of ["tx-disorderly-conduct", "tx-discharge-of-firearm-in-city", "tx-noise-violation", "tx-panhandling"]) expect(seed.selectableChargeIds).not.toContain(id);
  const legacy = criminalCharges.find(c => c.id === "tx-disorderly-conduct")!;
  expect(buildTexasManifestRecord(legacy, [], new Date()).provisions).toHaveLength(0);
  expect(getChargeById(legacy.id)).toBeUndefined();
  for (const jurisdiction of ["TX","Texas"]) {
    expect(resolveGuidanceCharge({id:legacy.id,name:legacy.name,code:legacy.code,classification:"misdemeanor"},jurisdiction)).toBeUndefined();
    expect(resolveGuidanceCharge({name:legacy.name,code:legacy.code,classification:"misdemeanor"},jurisdiction)).toBeUndefined();
  }
  expect(manifest.catalogRecords.find(r=>r.chargeId===legacy.id)?.disposition).toBe("require_exact_reselection");
});
it("keeps firearm discharge, alarming display and road discharge at their own grades", () => {
  expect(evidence["PE:42.01"].text).toContain("unless committed under Subsection (a)(7) or (a)(8)");
  expect(row("tx-pc-42-01-public-discharge").penalty).toMatch(/^Class B/);
  expect(row("tx-pc-42-01-alarming-display").penalty).toMatch(/^Class B/);
  expect(row("tx-pc-42-01-road-discharge").penalty).toMatch(/^Class C/);
  expect(row("tx-pc-42-01-alarming-display").conduct).toContain("does not by itself establish");
  expect(row("tx-pc-42-01-public-discharge").conduct).toContain("other than a public road");
  expect(row("tx-pc-42-01-road-discharge").penalty).toContain("each prior offense was committed in the 24 months");
});
it("retains the range definition and narrow wild-animal and employee conditions", () => {
  expect(parseTexasCitation("Tex. Loc. Gov’t Code § 250.001(a)(2)")).toEqual([{code:"LG",section:"250.001",subdivision:"(a)(2)"}]);
  expect(evidence["LG:250.001"].text).toContain("not fewer than 20 different individuals");
  for (const id of ["tx-pc-42-01-public-discharge","tx-pc-42-01-road-discharge"]) expect(row(id).conduct).toContain("reasonable fear of bodily injury");
  expect(row("tx-pc-42-01-road-discharge").conduct).toContain("mortally injured or behaving consistently with disease");
  expect(bill("HB03065","3")).toContain("Subsection (a)(9) does not apply");
  expect(bill("HB03065","4")).toContain("if any element of the offense");
  expect(row("tx-pc-42-01-road-discharge").penalty).toContain("no element before September 1, 2023");
});
it("requires reckless discharge inside a qualifying municipality rather than any city gun possession", () => {
  const r=row("tx-pc-42-12");
  expect(r.conduct).toContain("100,000 or more"); expect(r.conduct).toContain("corporate limits");
  expect(r.conduct).toContain("most recent federal decennial census");
  expect(r.penalty).toMatch(/^Class A/); expect(r.penalty).toContain("September 1, 1995");
  expect(evidence["GV:311.005"].text).toContain('"Population" means the population shown by the most recent federal decennial census');
});
it("binds three obstruction conduct theories with privilege, reasonable-order and expressive-conduct safeguards", () => {
  expect(new Set(obstruction.map(r=>r.references[0].subdivision))).toEqual(new Set(["(a)(1)","(a)(2)(A)","(a)(2)(B)"]));
  for (const r of obstruction) {
    expect(r.conduct).toContain("Without legal privilege or authority");
    expect(r.conduct).toContain("has not yet intentionally harmed");
    expect(r.conduct).toContain("manifestly unreasonable order, and prompt compliance");
    expect(r.references.some(ref=>ref.section==="42.04")).toBe(true);
    if(r.id.includes("-order-")) expect(r.conduct).toContain("reasonable request or order");
  }
});
it("requires knowing emergency-access obstruction and operating audible OR visual signals", () => {
  for (const r of obstruction.filter(r=>r.id.endsWith("emergency-vehicle"))) {
    expect(r.conduct).toContain("knowingly prevents"); expect(r.conduct).toContain("audible OR visual");
    expect(r.conduct).toContain("Vehicle status alone is insufficient"); expect(r.penalty).toMatch(/^State jail/);
    expect(r.references.some(ref=>ref.section==="546.004")).toBe(true);
  }
  for (const r of obstruction.filter(r=>r.id.endsWith("emergency-facility"))) expect(r.conduct).toContain("Not every clinic or office qualifies");
  expect(evidence["PE:42.03"].text).toContain("actor knowingly");
  expect(evidence["TN:546.003"].text).toContain("audible or visual signals");
});
it("requires all three exhibition acts and preserves ordinary, prior, intoxication and injury branches", () => {
  for (const r of obstruction.filter(r=>r.id.includes("exhibition"))) {
    expect(r.conduct).toContain("at least two people assembled to watch");
    expect(r.conduct).toContain("All three acts are required");
    expect(r.conduct).toContain("AND steers to rotate");
    expect(r.penalty).toContain("forfeiture requires the separate Chapter 59 process");
    expect(r.penalty.startsWith("Class A")).toBe(r.id.endsWith("-exhibition"));
  }
  for (const r of obstruction.filter(r=>r.id.endsWith("exhibition-prior"))) expect(r.conduct).toContain("not every driving conviction qualifies");
  for (const r of obstruction.filter(r=>r.id.endsWith("exhibition-injury"))) expect(r.conduct).toContain("need not be serious bodily injury");
});
it("anchors grades to2021 enactments and prosecution/forfeiture changes to2023", () => {
  expect(bill("HB00009","2")).toContain("state jail felony");
  expect(bill("SB01495","1")).toContain("Class A misdemeanor");
  for (const id of ["HB00009","SB01495"]) expect(bill(id,"4")).toContain("September 1, 2021");
  expect(bill("HB04595","17.002")).toContain("(c-1)");
  expect(bill("HB01442","2")).toContain("but not both");
  expect(bill("HB01442","1")).toContain("any offense punishable under Section 42.03(d) or (e)");
  for (const r of obstruction) { expect(r.penalty).toContain("began September 1, 2021");expect(r.penalty).toContain("did not first create the 2021 grades"); }
  for (const d of enactments.documents) {
    expect(createHash("sha256").update(d.text).digest("hex")).toBe(d.textSha256);
    for(const s of d.spans) {expect(d.text.slice(s.start,s.end)).toBe(s.text);expect(createHash("sha256").update(s.text).digest("hex")).toBe(s.sha256);}
  }
});
it("applies the ten-day custody condition only to granted supervision on state-jail obstruction", () => {
  expect(evidence["CR:42A.517"].text).toContain("A court granting community supervision");
  for (const r of obstruction) {
    expect(r.penalty.includes("at least ten days")).toBe(r.category==="felony");
    if(r.category==="felony") {expect(r.penalty).toContain("not an unconditional prison minimum");expect(r.references.some(ref=>ref.section==="42A.517")).toBe(true);}
  }
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
    expect(chargeCategories["Public Order"]).toContain(r.id);
    for(const lang of ["en","es","zh"]) expect(getChargeExplanation(r.name,"TX",lang,r.id)).toMatchObject({plainSummary:r.conduct,degreeContext:r.penalty,untranslated:lang!=="en",translationDraft:false});
    expect(resolveGuidanceCharge({id:r.id,name:r.name,code:r.code,classification:r.category},"TX")).toMatchObject({id:r.id});
    expect(resolveGuidanceCharge({name:r.name,code:r.code,classification:r.category},"TX")).toBeUndefined();
  }
});
