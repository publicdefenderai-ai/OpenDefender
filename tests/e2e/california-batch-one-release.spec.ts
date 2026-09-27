import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
const corrections = ["shared/california-batch-one-corrections.json", "shared/california-batch-two-corrections.json", "shared/california-batch-three-corrections.json", "shared/california-batch-four-corrections.json"].flatMap(path => JSON.parse(readFileSync(path, "utf8"))) as Array<{ id: string; categories: string[]; penalty: { en: string } }>;

test("California corrections reach the production catalog and rules guidance", async ({ request }) => {
  const response = await request.get("/api/criminal-charges?jurisdiction=CA&limit=500");
  expect(response.ok()).toBe(true);
  const body = await response.json();
  for (const row of corrections) {
    const charge = body.charges.find((item: any) => item.id === row.id);
    expect(charge, row.id).toBeDefined();
    expect(charge.maxPenalty).toBe(row.penalty.en);
    expect(charge.categories).toEqual(row.categories);
  }
  const row = corrections.find(item => item.id === "ca-assault-with-deadly-weapon")!;
  const responseGuidance = await request.post("/api/legal-guidance/rules", {
    headers: { Origin: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5001" },
    data: { jurisdiction: "CA", charges: [row.id], caseStage: "arrest", custodyStatus: "in_custody" },
  });
  expect(responseGuidance.ok()).toBe(true);
  const guidance = (await responseGuidance.json()).guidance;
  expect(guidance.generatedBy).toBe("rule-based");
  expect(guidance.chargeClassifications[0].maxPenalty).toBe(row.penalty.en);
  const ids = ["ca-petty-theft", "ca-possession-of-controlled-substance", "ca-dui-third-offense", "ca-grand-theft-firearm-487-d2", "ca-attempted-robbery", "ca-rape-261-a2", "ca-vehicular-manslaughter-192-c1", "ca-vehicular-manslaughter-191-5-b", "ca-unlawful-sexual-intercourse-261-5-d"];
  const classified = await request.post("/api/legal-guidance/rules", {
    headers: { Origin: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5001" },
    data: { jurisdiction: "CA", charges: ids, caseStage: "arrest", custodyStatus: "in_custody" },
  });
  expect(classified.ok()).toBe(true);
  const classes = (await classified.json()).guidance.chargeClassifications;
  for (const id of ids) {
    const item = classes.find((charge: any) => charge.id === id);
    expect(item.categories).toEqual(corrections.find(correction => correction.id === id)!.categories);
    expect(item.maxPenalty).toBe(corrections.find(correction => correction.id === id)!.penalty.en);
  }
});

test("California screener finds the precise deadly-weapon charge by citation", async ({ page }) => {
  await page.route("**/api/ai/status", route => route.fulfill({ json: { available: true } }));
  await page.goto("/case-guidance");
  await page.getByTestId("button-start-guidance").click();
  await page.getByTestId("button-choose-ai").click();
  await page.getByTestId("select-jurisdiction").click();
  await page.getByRole("option", { name: "California", exact: true }).click();
  await page.getByTestId("button-next-jurisdiction").click();
  await page.locator("#charge-search").fill("245(a)(1)");
  const choice = page.getByTestId("checkbox-charge-ca-assault-with-deadly-weapon");
  await expect(choice).toBeVisible();
  await choice.locator("..").click();
  await expect(choice).toBeChecked();
});

for (const [id, search, label] of [
  ["ca-unlawful-sexual-intercourse-261-5-c", "261.5(c)", "Misdemeanor / Felony"],
  ["ca-vehicular-manslaughter-192-c1", "192(c)(1)", "Misdemeanor / Felony"],
  ["ca-petty-theft", "Petty Theft", "Misdemeanor / Infraction / Felony"],
  ["ca-possession-of-controlled-substance", "11350", "Misdemeanor / Felony"],
  ["ca-driving-without-license", "12500(a)", "Infraction / Misdemeanor"],
  ["ca-dui-23152-f", "23152(f)", "Misdemeanor / Felony"],
  ["ca-grand-theft-agricultural-487-b1a", "487(b)(1)(A)", "Misdemeanor / Felony"],
]) {
  test(`California selector preserves classification alternatives for ${id}`, async ({ page }) => {
    await page.route("**/api/ai/status", route => route.fulfill({ json: { available: true } }));
    await page.goto("/case-guidance");
    await page.getByTestId("button-start-guidance").click();
    await page.getByTestId("button-choose-ai").click();
    await page.getByTestId("select-jurisdiction").click();
    await page.getByRole("option", { name: "California", exact: true }).click();
    await page.getByTestId("button-next-jurisdiction").click();
    await page.locator("#charge-search").fill(search);
    const choice = page.getByTestId(`checkbox-charge-${id}`);
    await expect(choice).toBeVisible();
    await expect(choice.locator("..")).toContainText(label);
  });
}
