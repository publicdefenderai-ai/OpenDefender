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
