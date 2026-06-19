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

    // The "Official Jury Instructions" label must appear (it shows in both the
    // charge list and the selected-charges section, so use .first())
    const instructionLabel = page
      .locator("text=Official Jury Instructions")
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

    // The "Official Jury Instructions" row must NOT be present at all
    await expect(
      page.locator("text=Official Jury Instructions")
    ).not.toBeVisible();

    // No instruction link testids should exist
    const instructionLinks = page.locator('[data-testid^="link-instruction-"]');
    await expect(instructionLinks).toHaveCount(0);
  });
});
