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
