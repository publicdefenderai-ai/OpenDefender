import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { allTexasCharges } from "./helpers/texas-catalog";
const rows = JSON.parse(readFileSync("shared/texas-assault-public-intoxication.json", "utf8")) as Array<{
  id: string; name: string; conduct: string; penalty: string; category: string;
}>;
test("Texas selector distinguishes ordinary family assault, felony predicates and public danger", async ({ request }) => {
  const charges = await allTexasCharges(request);
  for (const row of rows) {
    const charge = charges.find((value: { id: string }) => value.id === row.id);
    if (row.id === "tx-public-intoxication") {
      expect(charge.instructionRef).toBeUndefined();
      expect(charge.instructionUrl).toBeUndefined();
    } else {
      expect(charge.instructionRef).toContain(row.id.includes("family-breath") ? "CPJC 22.4" : "CPJC 22.1");
      expect(charge.instructionUrl).toContain(row.id.includes("family-breath") ? "CPJC22-4.htm" : "CPJC22-1.htm");
    }
    expect(charge).toMatchObject({ name: row.name, description: row.conduct, maxPenalty: row.penalty, category: row.category });
  }
  expect(charges.some((row: {id: string}) => row.id === "tx-domestic-violence-assault")).toBe(false);
});
