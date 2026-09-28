import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
const additions = JSON.parse(readFileSync("shared/california-specialized-property-additions.json", "utf8")) as Array<{id: string; code: string; summary: string; penalty: string; categories: string[]}>;

test("all specialized-property additions reach the API and representative rules guidance", async ({ request }) => {
  const response = await request.get("/api/criminal-charges?jurisdiction=CA&limit=500");
  expect(response.ok()).toBe(true);
  const body = await response.json();
  // One of 191 configured records depends on the changed PEN:30515 definition.
  expect(body.charges).toHaveLength(190);
  expect(body.charges.some((row: any) => row.id === "ca-possession-of-prohibited-weapon")).toBe(false);
  for (const a of additions) {
    expect(body.charges.find((r: any) => r.id === a.id), a.id).toMatchObject({ description: a.summary, maxPenalty: a.penalty, categories: a.categories });
  }
  const ids = ["ca-pen-490-4-a-2", "ca-pen-498-b-5", "ca-pen-502-6-a", "ca-pen-487j"];
  const responseGuidance = await request.post("/api/legal-guidance/rules", {
    headers: { Origin: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5001" },
    data: { jurisdiction: "CA", charges: ids, caseStage: "arrest", custodyStatus: "in_custody" },
  });
  expect(responseGuidance.ok()).toBe(true);
  const guidance = (await responseGuidance.json()).guidance;
  for (const id of ids) expect(guidance.chargeClassifications.find((r: any) => r.id === id)).toMatchObject({ maxPenalty: additions.find(a => a.id === id)!.penalty, categories: additions.find(a => a.id === id)!.categories });
});
for (const [id, citation] of [["ca-pen-490-4-a-2", "490.4(a)(2)"], ["ca-pen-502-6-a", "502.6(a)"]]) {
  test(`exact citation selects ${id}`, async ({ page }) => {
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
