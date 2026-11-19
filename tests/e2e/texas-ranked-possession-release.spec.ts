import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
const rows = JSON.parse(readFileSync("shared/texas-ranked-possession.json", "utf8")) as Array<{
  id: string; name: string; conduct: string; penalty: string; category: string;
}>;
test("Texas selector distinguishes six possession branches and preserves the marijuana ID", async ({ request }) => {
  const result = await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(result.ok()).toBe(true);
  const { charges } = await result.json();
  for (const row of rows) {
    const charge = charges.find((value: { id: string }) => value.id === row.id);
    expect(charge.instructionRef).toContain(row.id === "tx-possession-of-marijuana" ? "CPJC 81.8" : "CPJC 81.10");
    expect(charge).toMatchObject({ name: row.name, description: row.conduct, maxPenalty: row.penalty, category: row.category });
  }
  expect(charges.some((row: {id: string}) => row.id === "tx-possession-of-controlled-substance")).toBe(false);
});

test("Texas selector keeps value-based theft and repeat theft distinct", async ({ request }) => {
  const response = await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(response.ok()).toBe(true);
  const { charges } = await response.json();
  for (const [id, category, code] of [
    ["tx-pc-31-03-e-2-a", "misdemeanor", "31.03(e)(2)(A)"],
    ["tx-pc-31-03-e-4-d", "felony", "31.03(e)(4)(D)"],
  ]) {
    const selected = charges.find((row: {id:string}) => row.id === id);
    expect(selected).toMatchObject({id, category, code});
    expect(selected.instructionRef).toContain("CPJC 31.2");
  }
  expect(charges.some((row: {id:string}) => row.id === "tx-theft-under-2500")).toBe(false);
});

test("Texas property choices replace the ambiguous under-$2,500 guidance", async ({ request }) => {
  const response = await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(response.ok()).toBe(true);
  const { charges } = await response.json();
  for (const [id, code] of [
    ["tx-pc-31-03-e-1", "31.03(e)(1)"], ["tx-pc-31-03-e-2-b", "31.03(e)(2)(B)"],
    ["tx-pc-31-03-e-3", "31.03(e)(3)"], ["tx-criminal-trespass", "30.05(d)(1)"],
    ["tx-pc-31-07-unauthorized-use", "31.07(b)"],
  ]) expect(charges.find((r:{id:string}) => r.id === id)).toMatchObject({id,code});
  expect(charges.some((r:{id:string}) => r.id === "tx-theft-under-2500")).toBe(false);
});

test("Texas selector separates force, flight and identification branches", async ({request}) => {
  const result = await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(result.ok()).toBe(true);
  const { charges } = await result.json();
  for (const [id, code] of [
    ["tx-pc-38-03-c","38.03(c)"], ["tx-pc-38-03-d","38.03(d)"],
    ["tx-evading-arrest","38.04(b)"], ["tx-pc-38-04-prior","38.04(b)(1)"],
    ["tx-pc-38-04-vehicle","38.04(b)(2)(A)"], ["tx-failure-to-identify","38.02(c)(1)"],
    ["tx-pc-38-02-fugitive-refusal","38.02(d)(1)"], ["tx-pc-38-02-false","38.02(c)(2)"],
    ["tx-pc-38-02-fugitive-false","38.02(d)(2)"],
  ]) expect(charges.find((r:{id:string}) => r.id === id)).toMatchObject({id,code});
  expect(charges.some((r:{id:string}) => r.id === "tx-resisting-arrest")).toBe(false);
});

test("Texas selector requires a specific weapons branch and returns the three ranked charge families", async ({ request }) => {
  const response = await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(response.ok()).toBe(true);
  const { charges } = await response.json();
  const reviewed = JSON.parse(readFileSync("shared/texas-priority-closeout.json", "utf8"));
  for (const {id, code, category, penalty} of reviewed) {
    expect(charges.find((r: {id: string}) => r.id === id)).toMatchObject({id, code, category, maxPenalty: penalty});
  }
  expect(charges.find((r: {id: string}) => r.id === "tx-unlawful-carrying-of-weapon")).toBeUndefined();
});

test("Texas offers only the reviewed handgun carrying branches", async ({request}) => {
  const response = await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(response.ok()).toBe(true);
  const {charges} = await response.json();
  const reviewed = JSON.parse(readFileSync("shared/texas-carry-branches.json", "utf8"));
  for (const row of reviewed) {
    expect(charges.find((charge: {id: string}) => charge.id === row.id)).toMatchObject({
      id: row.id, code: row.code, category: row.category, maxPenalty: row.penalty,
    });
  }
  expect(charges.some((charge: {code: string}) => charge.code === "46.02(a)(2)(A)")).toBe(false);
  expect(charges.some((charge: {id: string}) => charge.id === "tx-unlawful-carrying-of-weapon")).toBe(false);
});

test("Texas selector returns the reviewed theft and criminal-mischief loss branches", async ({request}) => {
  const response = await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(response.ok()).toBe(true);
  const {charges} = await response.json();
  const reviewed = JSON.parse(readFileSync("shared/texas-property-loss.json","utf8"));
  for (const row of reviewed) {
    expect(charges.find((r: {id:string})=>r.id===row.id))
      .toMatchObject({id:row.id,code:row.code,maxPenalty:row.penalty,category:row.category});
  }
});

test("Texas selector exposes specific burglary and trespass branches and preserves the legacy holds", async ({request}) => {
  const response = await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(response.ok()).toBe(true);
  const {charges} = await response.json();
  const reviewed = JSON.parse(readFileSync("shared/texas-ranked-burglary.json","utf8"));
  for (const row of reviewed) {
    expect(charges.find((r: {id:string}) => r.id===row.id)).toMatchObject({
      id:row.id, code:row.code, category:row.category, maxPenalty:row.penalty,
    });
  }
  expect(charges.some((r: {id:string}) => r.id==="tx-commercial-burglary")).toBe(false);
});

test("Texas selector exposes source-bound possession grades and the residential treatment center choice", async ({request}) => {
  const response=await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(response.ok()).toBe(true);
  const {charges}=await response.json();
  const reviewed=JSON.parse(readFileSync("shared/texas-possession-weights.json","utf8"));
  for (const row of reviewed) {
    expect(charges.find((r:{id:string})=>r.id===row.id)).toMatchObject({
      id:row.id,code:row.code,category:row.category,maxPenalty:row.penalty,
    });
  }
  expect(charges.find((r:{id:string})=>r.id==="tx-pc-30-05-shelter")).toBeUndefined();
});

test("Texas manufacturing and delivery choices preserve group-specific weight penalties", async ({request}) => {
  const response=await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(response.ok()).toBe(true);
  const {charges}=await response.json();
  const delivery=JSON.parse(readFileSync("shared/texas-ranked-delivery.json","utf8"));
  for (const row of delivery) {
    const choice=charges.find((charge:{id:string})=>charge.id===row.id);
    expect(choice).toMatchObject({id:row.id,name:row.name,code:row.code,description:row.conduct,maxPenalty:row.penalty,category:"felony"});
    expect(choice.instructionRef).toContain("transfer theory only");
    expect(choice.searchAliases).toContain(row.dpsCode);
  }
  for (const id of ["tx-possession-with-intent-to-distribute","tx-distribution-of-controlled-substance","tx-manufacturing-controlled-substance","tx-drug-trafficking"]) {
    expect(charges.some((charge:{id:string})=>charge.id===id)).toBe(false);
  }
});

test("Texas family-safety choices distinguish mental states, duties and repeat grades", async ({request}) => {
  const result=await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(result.ok()).toBe(true);
  const {charges}=await result.json();
  const family=JSON.parse(readFileSync("shared/texas-family-safety.json","utf8"));
  for (const r of family) {
    const choice=charges.find((c:{id:string})=>c.id===r.id);
    expect(choice).toMatchObject({id:r.id,name:r.name,code:r.code,description:r.conduct,maxPenalty:r.penalty,category:r.category});
  }
  expect(charges.find((c:{id:string})=>c.id==="tx-pc-22-041-endanger").instructionRef).toContain("child and act theory only");
  expect(charges.find((c:{id:string})=>c.id==="tx-pc-25-11-continuous").instructionRef).toContain("CPJC 25.22");
});

test("Texas justice-process choices preserve ordinary, corpse and juror grades and speech defenses", async ({request}) => {
  const response=await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(response.ok()).toBe(true);
  const {charges}=await response.json();
  const reviewed=JSON.parse(readFileSync("shared/texas-justice-process.json","utf8"));
  for (const row of reviewed) expect(charges.find((r:{id:string})=>r.id===row.id)).toMatchObject({name:row.name,code:row.code,description:row.conduct,maxPenalty:row.penalty,category:row.category});
  expect(charges.find((r:{id:string})=>r.id==="tx-pc-38-15-a-1").description).toContain("speech only");
  expect(charges.find((r:{id:string})=>r.id==="tx-pc-37-09-unreported-corpse").category).toBe("misdemeanor");
  expect(charges.find((r:{id:string})=>r.id==="tx-pc-36-06-obstruction-juror").maxPenalty).toContain("Second-degree felony");
});

test("Texas road-safety choices correct reckless driving and replace generic hit-and-run", async ({request}) => {
  const response=await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(response.ok()).toBe(true);
  const {charges}=await response.json();
  const reviewed=JSON.parse(readFileSync("shared/texas-road-safety.json","utf8"));
  for(const row of reviewed) expect(charges.find((r:{id:string})=>r.id===row.id)).toMatchObject({name:row.name,code:row.code,description:row.conduct,maxPenalty:row.penalty,category:row.category});
  expect(charges.find((r:{id:string})=>r.id==="tx-hit-and-run")).toBeUndefined();
  expect(charges.find((r:{id:string})=>r.id==="tx-reckless-driving").maxPenalty).toContain("30 days");
  expect(charges.find((r:{id:string})=>r.id==="tx-tn-550-021-other-injury").maxPenalty).toContain("$5,000");
});


test("Texas fraud selector distinguishes quantities, duties and legacy identities", async ({request})=>{
 const response=await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");expect(response.ok()).toBe(true);
 const {charges}=await response.json();
 const rows=JSON.parse(readFileSync("shared/texas-card-identity-fraud.json","utf8"));
 for(const r of rows)expect(charges.find((c:{id:string})=>c.id===r.id)).toMatchObject({id:r.id,code:r.code,description:r.conduct,maxPenalty:r.penalty});
 expect(charges.some((c:{id:string})=>["tx-identity-theft","tx-credit-card-fraud"].includes(c.id))).toBe(false);
});


test("Texas protected assault selector preserves injury, threat and contact grades", async ({request})=>{
 const response=await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");expect(response.ok()).toBe(true);
 const {charges}=await response.json();const rows=JSON.parse(readFileSync("shared/texas-protected-assault.json","utf8"));
 for(const r of rows)expect(charges.find((c:{id:string})=>c.id===r.id)).toMatchObject({id:r.id,code:r.code,description:r.conduct,maxPenalty:r.penalty,category:r.category});
 expect(charges.some((c:{id:string})=>c.id==="tx-assault-on-peace-officer")).toBe(false);
});


test("Texas robbery IDs stay unique and restraint/jugging branches retain exact guidance", async ({request})=>{
 const response=await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");expect(response.ok()).toBe(true);
 const {charges}=await response.json();const rows=JSON.parse(readFileSync("shared/texas-robbery-restraint.json","utf8"));
 for(const r of rows){expect(charges.filter((c:{id:string})=>c.id===r.id)).toHaveLength(1);expect(charges.find((c:{id:string})=>c.id===r.id)).toMatchObject({id:r.id,name:r.name,code:r.code,description:r.conduct,maxPenalty:r.penalty,category:r.category});}
 for(const id of ["tx-bank-robbery","tx-attempted-robbery"])expect(charges.some((c:{id:string})=>c.id===id)).toBe(false);
});


test("Texas threats and false alerts expose exact intent and grading while withholding the old blanket ID", async ({request})=>{
 const response=await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");expect(response.ok()).toBe(true);
 const {charges}=await response.json();const rows=JSON.parse(readFileSync("shared/texas-threats-alerts.json","utf8"));
 for(const r of rows)expect(charges.find((c:{id:string})=>c.id===r.id)).toMatchObject({id:r.id,name:r.name,code:r.code,description:r.conduct,maxPenalty:r.penalty,category:r.category});
 expect(charges.some((c:{id:string})=>c.id==="tx-terroristic-threat")).toBe(false);
});
