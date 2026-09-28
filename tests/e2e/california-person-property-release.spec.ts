import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
const additions = JSON.parse(readFileSync("shared/california-person-property-additions.json", "utf8")) as Array<{id: string; code: string; title: string; summary: string; penalty: string; categories: string[]}>;

test("all person/property additions reach the production API and rules guidance", async ({ request }) => {
  const response = await request.get("/api/criminal-charges?jurisdiction=CA&limit=500");
  expect(response.ok()).toBe(true);
  const body = await response.json();
  // One of 174 configured records depends on the changed PEN:30515 definition.
  expect(body.charges).toHaveLength(173);
  expect(body.charges.some((row: any) => row.id === "ca-possession-of-prohibited-weapon")).toBe(false);
  for (const addition of additions) {
    const charge = body.charges.find((r: any) => r.id === addition.id);
    expect(charge, addition.id).toBeDefined();
    expect(charge.description).toBe(addition.summary);
    expect(charge.maxPenalty).toBe(addition.penalty);
    expect(charge.categories).toEqual(addition.categories);
  }
  const ids = ["ca-pen-245-b", "ca-pen-245-a-2", "ca-pen-246-3-b", "ca-pen-470b"];
  const responseGuidance = await request.post("/api/legal-guidance/rules", {
    headers: { Origin: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5001" },
    data: { jurisdiction: "CA", charges: ids, caseStage: "arrest", custodyStatus: "in_custody" },
  });
  expect(responseGuidance.ok()).toBe(true);
  const guidance = (await responseGuidance.json()).guidance;
  expect(guidance.generatedBy).toBe("rule-based");
  for (const id of ids) {
    const actual = guidance.chargeClassifications.find((r: any) => r.id === id);
    expect(actual.maxPenalty).toBe(additions.find(a => a.id === id)!.penalty);
    expect(actual.categories).toEqual(additions.find(a => a.id === id)!.categories);
  }
});
for (const [id, citation] of [["ca-pen-245-a-2", "245(a)(2)"], ["ca-pen-471-5", "471.5"]]) {
  test(`charging-document citation finds ${id}`, async ({ page }) => {
    await page.route("**/api/ai/status", route => route.fulfill({ json: { available: true } }));
    await page.goto("/case-guidance");
    await page.getByTestId("button-start-guidance").click();
    await page.getByTestId("button-choose-ai").click();
    await page.getByTestId("select-jurisdiction").click();
    await page.getByRole("option", { name: "California", exact: true }).click();
    await page.getByTestId("button-next-jurisdiction").click();
    await page.locator("#charge-search").fill(citation);
    const choice = page.getByTestId(`checkbox-charge-${id}`);
    await expect(choice).toBeVisible();
    await choice.locator("..").click();
    await expect(choice).toBeChecked();
  });
}
