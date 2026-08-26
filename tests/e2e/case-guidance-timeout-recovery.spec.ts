import { expect, test } from "@playwright/test";

const guidance = {
  overview: "Timeout recovery interaction test result.",
  criticalAlerts: [],
  immediateActions: [],
  nextSteps: [],
  deadlines: [],
  rights: [],
  resources: [],
  warnings: [],
  evidenceToGather: [],
  courtPreparation: [],
  avoidActions: [],
  timeline: [],
  chargeClassifications: [],
};

async function completeScreener(page: import("@playwright/test").Page) {
  await page.getByTestId("button-start-guidance").click();
  await page
    .getByRole("button", { name: /Personalized AI Guidance.*Continue with AI Guidance/i })
    .click();

  await page.getByTestId("select-jurisdiction").click();
  await page.getByRole("option", { name: "California" }).click();
  await page.getByTestId("button-next-jurisdiction").click();

  await page
    .getByRole("checkbox", { name: "I don't know what charges I'm facing", exact: true })
    .click();
  await page.getByTestId("button-next-case-details").click();

  await page.getByTestId("select-case-stage").click();
  await page.getByRole("option", { name: /Pre-trial/i }).click();
  await page.getByTestId("select-custody-status").click();
  await page.getByRole("option", { name: /not in custody/i }).click();
  await page.getByTestId("select-has-attorney").click();
  await page.getByRole("option", { name: /^No$/ }).click();
  await page.getByTestId("button-continue-status").click();

  await page.getByTestId("button-continue-background").click();
  await page.getByRole("button", { name: /^Next/ }).click();
  await page.getByRole("button", { name: /Get My Case Support/i }).click();
}

test.describe("case guidance timeout recovery", () => {
  test("keeps answers after a rejected retry and ignores rapid duplicate activation", async ({ page }) => {
    test.setTimeout(60_000);

    await page.route("**/api/captcha/config", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ required: false, siteKey: null }),
      });
    });

    let streamRequestCount = 0;
    let releaseFirstRequest: (() => void) | undefined;
    let retryBody: Record<string, unknown> | undefined;
    await page.route("**/api/legal-guidance/stream", async (route) => {
      streamRequestCount += 1;
      if (streamRequestCount === 1) {
        await new Promise<void>((resolve) => {
          releaseFirstRequest = resolve;
        });
        return;
      }

      retryBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({ success: false, error: "CAPTCHA rejected" }),
      });
    });

    await page.clock.install();
    await page.goto("/case-guidance");
    await completeScreener(page);

    await page.clock.runFor(120_000);
    await expect(page.getByRole("alert")).toContainText("Your answers are still here");
    await expect(page.getByTestId("button-retry-ai-guidance")).toBeEnabled();
    await expect(page.getByTestId("button-use-rules-guidance")).toBeVisible();
    await expect(page.getByTestId("button-review-guidance-answers")).toBeVisible();

    await page.getByTestId("button-retry-ai-guidance").dblclick();
    await expect.poll(() => streamRequestCount).toBe(2);
    expect(retryBody).toMatchObject({
      jurisdiction: "CA",
      charges: [],
      chargesUnknown: true,
      caseStage: "pretrial",
      guidanceMode: "ai",
    });

    await expect(page.getByRole("alert")).toContainText("retry could not be completed");
    await expect(page.getByTestId("button-review-guidance-answers")).toBeVisible();
    await page.getByTestId("button-review-guidance-answers").click();

    const unknownCharges = page.getByRole("checkbox", {
      name: "I don't know what charges I'm facing",
      exact: true,
    });
    for (let step = 0; step < 7 && (await unknownCharges.count()) === 0; step += 1) {
      await page.getByRole("button", { name: /^Back/ }).click();
    }
    await expect(unknownCharges).toBeChecked();
    await page.getByRole("button", { name: /^Back/ }).click();
    await expect(page.getByTestId("select-jurisdiction")).toContainText("California");

    releaseFirstRequest?.();
  });
});