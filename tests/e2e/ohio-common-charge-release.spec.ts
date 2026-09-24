import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
const updates = JSON.parse(readFileSync("shared/ohio-common-charge-updates.json", "utf8")) as Array<{ id: string; code: string; text: { en: { degreeContext: string } } }>;
const legacyIds = ["oh-open-container", "oh-alcohol-in-park", "oh-littering", "oh-animal-cruelty-misdemeanor", "oh-illegal-fireworks", "oh-minor-in-possession"];
const origin = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5001";
test("Ohio common charges use corrected catalog data and reject old saved IDs", async ({ page }) => {
  const response = await page.request.get("/api/criminal-charges?jurisdiction=OH&limit=500");
  expect(response.ok()).toBe(true);
  const body = await response.json();
  for (const row of updates) {
    const charge = body.charges.find((c: any) => c.id === row.id);
    expect(charge, row.code).toBeDefined();
    expect(charge.maxPenalty).toBe(row.text.en.degreeContext);
    const search = await page.request.get(`/api/v1/search?q=${row.code}&types=charge&limit=100`);
    expect(search.ok()).toBe(true);
    expect((await search.json()).results.some((r: any) => r.document.id === `charge-${row.id}`)).toBe(true);
  }
  const openContainer = updates.find(row => row.code === "4301.62")!;
  const supported = await page.request.post("/api/legal-guidance/rules", {
    headers: { Origin: origin }, data: { jurisdiction: "OH", charges: [openContainer.id], caseStage: "arrest", custodyStatus: "in_custody" },
  });
  expect(supported.ok()).toBe(true);
  const guidance = (await supported.json()).guidance;
  expect(guidance.generatedBy).toBe("rule-based");
  expect(guidance.chargeClassifications[0].maxPenalty).toBe(openContainer.text.en.degreeContext);
  for (const id of legacyIds) {
    expect(body.charges.some((c: any) => c.id === id)).toBe(false);
    const guidance = await page.request.post("/api/legal-guidance/rules", {
      headers: { Origin: origin }, data: { jurisdiction: "OH", charges: [id], caseStage: "arrest", custodyStatus: "in_custody" },
    });
    expect(guidance.status(), id).toBe(400);
    expect((await guidance.json()).requiresReselection).toBe(true);
  }
});

test("Ohio screener finds the corrected open-container charge by citation", async ({ page }) => {
  // Only service availability is simulated. Charge search uses the production API;
  // no AI request, credentials, or real case data are needed for selector coverage.
  await page.route("**/api/ai/status", route => route.fulfill({ json: { available: true } }));
  await page.goto("/case-guidance");
  await page.getByTestId("button-start-guidance").click();
  await page.getByTestId("button-choose-ai").click();
  await page.getByTestId("select-jurisdiction").click();
  await page.getByRole("option", { name: "Ohio", exact: true }).click();
  await page.getByTestId("button-next-jurisdiction").click();
  await page.locator("#charge-search").fill("4301.62");
  const row = updates.find(r => r.code === "4301.62")!;
  const choice = page.getByTestId(`checkbox-charge-${row.id}`);
  await expect(choice).toBeVisible();
  await choice.locator("..").click();
  await expect(choice).toBeChecked();
  await expect(page.getByTestId("ohio-partial-coverage-notice")).toBeVisible();
});
