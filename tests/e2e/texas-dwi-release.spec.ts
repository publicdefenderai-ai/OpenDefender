import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
const reviewed = JSON.parse(readFileSync("shared/texas-dwi-reviewed.json", "utf8")) as {
  records: Array<{id: string; name: string; summary: string}>;
};

test("Texas selector distinguishes all four DWI scopes with their reviewed penalties", async ({ request }) => {
  const result = await request.get("/api/criminal-charges?jurisdiction=TX&limit=500");
  expect(result.ok()).toBe(true);
  const { charges, pagination } = await result.json();
  expect(pagination.nextOffset).toBeNull();
  for (const row of reviewed.records) {
    const charge = charges.find((value: { id: string }) => value.id === row.id);
    expect(charge?.name).toBe(row.name);
    expect(charge.maxPenalty).toContain(row.summary);
    expect(charge.maxPenalty).toContain("§709.001");
  }
  expect(charges.some((value: { id: string }) => value.id === "tx-dui-third-offense")).toBe(false);
});
