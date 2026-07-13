import { test, expect } from "@playwright/test";

/**
 * End-to-end tests for the jury instruction row in the QA flow (Case Details step).
 *
 * Positive test: FL "Robbery in the First Degree" has
 *   instructionRef: "FSJI 15.1"
 *   instructionUrl: "https://www-media.floridabar.org/uploads/2023/07/15.1.docx"
 * The "Official Jury Instructions" label plus a clickable link should render.
 *
 * Negative test: Puerto Rico "Accessory After the Fact" has no instructionRef
 * in criminal-charge-citations.ts, so the instruction row must be absent.
 *
 * Implementation note: charge checkboxes have `pointer-events-none` — the click
 * handler lives on the parent <div> container. Tests click the parent via XPath.
 */

async function openQAFlow(page: any) {
  await page.goto("http://localhost:5000/case-guidance");
  const btn = page.getByTestId("button-start-guidance");
  await expect(btn).toBeVisible({ timeout: 15000 });
  await btn.click();
}

async function completeConsentStep(page: any) {
  await page
    .getByTestId("checkbox-consent")
    .waitFor({ state: "visible" });
  await page.getByTestId("checkbox-consent").click();
  await page.getByTestId("button-next-consent").click();
}

/**
 * Select a jurisdiction. Radix UI SelectContent renders items with role="option".
 * stateLabel is the display text, e.g. "Florida" for FL, "Puerto Rico" for PR.
 */
async function selectJurisdiction(page: any, stateLabel: string) {
  const trigger = page.getByTestId("select-jurisdiction");
  await trigger.waitFor({ state: "visible" });
  await trigger.click();
  const option = page
    .locator('[role="option"]')
    .filter({ hasText: stateLabel })
    .first();
  await option.waitFor({ state: "visible" });
  await option.click();
  await page.getByTestId("button-next-jurisdiction").click();
}

/**
 * Click the row that contains a charge checkbox. The Checkbox component has
 * pointer-events-none; the parent <div> carries the onClick handler. We locate
 * the parent via XPath.
 */
async function clickChargeRow(page: any, chargeId: string) {
  const checkbox = page.getByTestId(`checkbox-charge-${chargeId}`);
  await checkbox.waitFor({ state: "visible", timeout: 15000 });
  // Click the parent container div which owns the onClick handler
  await page
    .locator(`xpath=//button[@data-testid="checkbox-charge-${chargeId}"]/..`)
    .click();
}

test.describe("Jury instruction display — QA flow Case Details step", () => {
  test("shows 'Official Jury Instructions' label and link for FL robbery in the first degree", async ({
    page,
  }) => {
    await openQAFlow(page);
    await completeConsentStep(page);
    await selectJurisdiction(page, "Florida");

    // Case Details step: search for and select FL robbery
    const searchInput = page.locator("#charge-search");
    await searchInput.waitFor({ state: "visible" });
    await searchInput.fill("robbery in the first degree");

    // Click the FL robbery row (charge.id = "fl-robbery-in-the-first-degree")
    await clickChargeRow(page, "fl-robbery-in-the-first-degree");

    // The "Jury Instruction:" label must appear in the selected-charge card
    // (it appears in both the charge list and selected section, so use .first())
    const instructionLabel = page
      .locator("text=Jury Instruction")
      .first();
    await instructionLabel.waitFor({ state: "visible" });
    await expect(instructionLabel).toBeVisible();

    // The instruction link must show "FSJI 15.1" pointing to the Florida Bar PDF
    const instructionLink = page.getByTestId(
      "link-instruction-fl-robbery-in-the-first-degree"
    );
    await expect(instructionLink).toBeVisible();
    await expect(instructionLink).toHaveText("FSJI 15.1");
    await expect(instructionLink).toHaveAttribute(
      "href",
      "https://www-media.floridabar.org/uploads/2023/07/15.1.docx"
    );
    await expect(instructionLink).toHaveAttribute("target", "_blank");
  });

  test("shows CALCRIM 1600 badge and courts.ca.gov link for CA robbery in the first degree", async ({
    page,
  }) => {
    await openQAFlow(page);
    await completeConsentStep(page);
    await selectJurisdiction(page, "California");

    // Case Details step: search for and select CA robbery
    const searchInput = page.locator("#charge-search");
    await searchInput.waitFor({ state: "visible" });
    await searchInput.fill("robbery in the first degree");

    // Click the CA robbery row (charge.id = "ca-robbery-in-the-first-degree")
    await clickChargeRow(page, "ca-robbery-in-the-first-degree");

    // The "Jury Instruction:" label must appear in the selected-charge card
    const instructionLabel = page
      .locator("text=Jury Instruction")
      .first();
    await instructionLabel.waitFor({ state: "visible" });
    await expect(instructionLabel).toBeVisible();

    // The instruction link must show "CALCRIM 1600" pointing to courts.ca.gov
    const instructionLink = page.getByTestId(
      "link-instruction-ca-robbery-in-the-first-degree"
    );
    await expect(instructionLink).toBeVisible();
    await expect(instructionLink).toHaveText("CALCRIM 1600");
    await expect(instructionLink).toHaveAttribute(
      "href",
      "https://www.courts.ca.gov/partners/california-jury-instructions"
    );
    await expect(instructionLink).toHaveAttribute("target", "_blank");
  });

  test("does NOT show the jury instruction row for a charge with no instructionRef", async ({
    page,
  }) => {
    await openQAFlow(page);
    await completeConsentStep(page);

    // Puerto Rico territory charges have no instructionRef in citations data
    await selectJurisdiction(page, "Puerto Rico");

    // Case Details step: search for a territory charge
    const searchInput = page.locator("#charge-search");
    await searchInput.waitFor({ state: "visible" });
    await searchInput.fill("accessory after the fact");

    // Click the first available charge row
    const firstCheckbox = page
      .locator('[data-testid^="checkbox-charge-"]')
      .first();
    await firstCheckbox.waitFor({ state: "visible", timeout: 15000 });
    const chargeId = await firstCheckbox.getAttribute("data-testid");
    const id = chargeId!.replace("checkbox-charge-", "");
    await clickChargeRow(page, id);

    // The selected-charge card (blue background) must appear
    const selectedCard = page.locator(".bg-blue-50").first();
    await selectedCard.waitFor({ state: "visible" });

    // The "Jury Instruction:" row must NOT be present at all
    await expect(
      page.locator("text=Jury Instruction")
    ).not.toBeVisible();

    // No instruction link testids should exist
    const instructionLinks = page.locator('[data-testid^="link-instruction-"]');
    await expect(instructionLinks).toHaveCount(0);
  });
});

/**
 * Helpers shared by the guidance-dashboard describe block below.
 */

/**
 * Register a Playwright route intercept that returns a minimal valid SSE
 * completion event so tests never hit the real AI endpoint.
 *
 * The guidance dashboard looks up each charge by `code` in the criminalCharges
 * array to find its `instructionRef`. Passing a real FL robbery code produces
 * a badge; passing an unknown code (no DB entry) leaves `instructionRef`
 * undefined and the badge must be absent.
 */
async function mockGuidanceStream(
  page: any,
  chargeClassifications: Array<{ id?: string; code: string; name: string; classification: string }>
) {
  const guidance = {
    overview: "Test overview for guidance dashboard jury instruction test.",
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
    chargeClassifications,
  };
  const event = {
    type: "complete",
    success: true,
    sessionId: "test-session-jury-dashboard",
    guidance,
  };
  const body = `data: ${JSON.stringify(event)}\n\n`;

  await page.route("**/api/legal-guidance/stream", async (route: any) => {
    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      body,
    });
  });
}

/** Fill and advance past the Status step (case stage + custody + attorney). */
async function completeStatusStep(page: any) {
  const caseStageSelect = page.getByTestId("select-case-stage");
  await caseStageSelect.waitFor({ state: "visible" });
  await caseStageSelect.click();
  await page
    .locator('[role="option"]')
    .filter({ hasText: "Just arrested" })
    .first()
    .click();

  const custodySelect = page.getByTestId("select-custody-status");
  await custodySelect.waitFor({ state: "visible" });
  await custodySelect.click();
  await page
    .locator('[role="option"]')
    .filter({ hasText: "Released on bail" })
    .first()
    .click();

  const attorneySelect = page.getByTestId("select-has-attorney");
  await attorneySelect.waitFor({ state: "visible" });
  await attorneySelect.click();
  await page
    .locator('[role="option"]')
    .filter({ hasText: /^No$/ })
    .first()
    .click();

  await page.getByTestId("button-continue-status").click();
}

/** Advance past the Background step (all fields optional — just click Continue). */
async function completeBackgroundStep(page: any) {
  const continueBtn = page.getByTestId("button-continue-background");
  await continueBtn.waitFor({ state: "visible" });
  await continueBtn.click();
}

/**
 * Submit the Additional Details step with no concerns selected.
 * The submit button text is "Get My Case Support" (from i18n additionalDetails.submit).
 */
async function submitAdditionalDetailsStep(page: any) {
  const submitBtn = page.getByRole("button", { name: /Get My Case Support/i });
  await submitBtn.waitFor({ state: "visible" });
  await submitBtn.click();
}

test.describe("Jury instruction badge — guidance dashboard", () => {
  /**
   * Positive: FL robbery has instructionRef "FSJI 15.1" in criminal-charge-citations.ts.
   * After a full QA flow (stream mocked), the guidance dashboard must render:
   *   data-testid="link-instruction-dashboard-fl-robbery-in-the-first-degree"
   * pointing to the Florida Bar PDF.
   */
  test("renders badge with link for FL robbery in the guidance dashboard", async ({
    page,
  }) => {
    await mockGuidanceStream(page, [
      {
        id: "fl-robbery-in-the-first-degree",
        code: "812.13",
        name: "Robbery in the First Degree",
        classification: "felony",
      },
    ]);

    await openQAFlow(page);
    await completeConsentStep(page);
    await selectJurisdiction(page, "Florida");

    // Case Details: search for and select FL robbery
    const searchInput = page.locator("#charge-search");
    await searchInput.waitFor({ state: "visible" });
    await searchInput.fill("robbery in the first degree");
    await clickChargeRow(page, "fl-robbery-in-the-first-degree");
    await page.getByTestId("button-next-case-details").click();

    await completeStatusStep(page);
    await completeBackgroundStep(page);
    await submitAdditionalDetailsStep(page);

    // Wait for the guidance dashboard to appear
    const closeDashboardBtn = page.getByTestId("button-close-dashboard");
    await closeDashboardBtn.waitFor({ state: "visible", timeout: 30000 });

    // The jury instruction badge must be present in the dashboard
    const badgeLink = page.getByTestId(
      "link-instruction-dashboard-fl-robbery-in-the-first-degree"
    );
    await expect(badgeLink).toBeVisible();
    await expect(badgeLink).toHaveText("FSJI 15.1");
    await expect(badgeLink).toHaveAttribute(
      "href",
      "https://www-media.floridabar.org/uploads/2023/07/15.1.docx"
    );
    await expect(badgeLink).toHaveAttribute("target", "_blank");
  });

  /**
   * Negative: a charge code that does not exist in criminalCharges results in
   * dbCharge = undefined, so instructionRef stays undefined and the badge must
   * not appear anywhere in the guidance dashboard.
   */
  test("does NOT render a badge in the guidance dashboard for a charge with no instructionRef", async ({
    page,
  }) => {
    // "test-unknown-charge-no-instruction" is intentionally absent from
    // criminalCharges, so the dashboard's dbCharge lookup returns undefined
    // and instructionRef is undefined → badge conditional is false.
    await mockGuidanceStream(page, [
      {
        code: "test-unknown-charge-no-instruction",
        name: "Test Misdemeanor Charge",
        classification: "misdemeanor",
      },
    ]);

    await openQAFlow(page);
    await completeConsentStep(page);
    // Use Puerto Rico — a jurisdiction with no instructionRef entries — so the
    // selected charge also carries no badge in the Case Details step.
    await selectJurisdiction(page, "Puerto Rico");

    // Select any available PR charge and advance past Case Details
    const searchInput = page.locator("#charge-search");
    await searchInput.waitFor({ state: "visible" });
    await searchInput.fill("accessory after the fact");
    const firstCheckbox = page
      .locator('[data-testid^="checkbox-charge-"]')
      .first();
    await firstCheckbox.waitFor({ state: "visible", timeout: 15000 });
    const chargeAttr = await firstCheckbox.getAttribute("data-testid");
    const chargeId = chargeAttr!.replace("checkbox-charge-", "");
    await clickChargeRow(page, chargeId);
    await page.getByTestId("button-next-case-details").click();

    await completeStatusStep(page);
    await completeBackgroundStep(page);
    await submitAdditionalDetailsStep(page);

    // Wait for the guidance dashboard to appear
    const closeDashboardBtn = page.getByTestId("button-close-dashboard");
    await closeDashboardBtn.waitFor({ state: "visible", timeout: 30000 });

    // The "Understanding Your Charges" card must render (the mock charge shows up)
    const chargeSection = page
      .locator('[data-testid^="charge-explanation-"]')
      .first();
    await expect(chargeSection).toBeVisible();

    // No dashboard jury instruction badge must be present
    const dashboardBadges = page.locator(
      '[data-testid^="link-instruction-dashboard-"]'
    );
    await expect(dashboardBadges).toHaveCount(0);
  });
});
