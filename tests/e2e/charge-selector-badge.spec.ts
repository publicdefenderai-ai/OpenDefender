import { test, expect } from "@playwright/test";

/**
 * End-to-end tests for the JuryInstructionBadge inside the ChargeSelector
 * component (client/src/components/chat/charge-selector.tsx).
 *
 * The ChargeSelector is rendered in the chat interface (/chat) after the user
 * selects a jurisdiction and submits the concerns step. It shows a list of
 * charge options; each option that has an `instructionRef` in the citations
 * overlay renders a JuryInstructionBadge with data-testid:
 *   link-instruction-selector-<charge-id>
 *
 * Navigation path to reach the ChargeSelector:
 *   /chat → click "Not right now" (urgent-no) → click "Case Roadmap & Charges"
 *   (menu-case-roadmap) → select California → click Continue on concerns →
 *   ChargeSelector appears.
 */

async function navigateToChargeSelector(page: any) {
  await page.goto("http://localhost:5000/chat");

  // Welcome / emergency check quick replies appear
  const urgentNo = page.getByTestId("quick-reply-urgent-no");
  await urgentNo.waitFor({ state: "visible", timeout: 15000 });
  await urgentNo.click();

  // main_menu PATHWAY_MENU_REPLIES appear; "Case Roadmap & Charges" leads to
  // state_selection (handleQuickReply case 'main_menu', value 'menu_case_roadmap')
  const caseRoadmap = page.getByTestId("quick-reply-menu-case-roadmap");
  await caseRoadmap.waitFor({ state: "visible", timeout: 10000 });
  await caseRoadmap.click();

  // StateSelector appears — click California
  const caOption = page.getByTestId("state-option-CA");
  await caOption.waitFor({ state: "visible", timeout: 10000 });
  await caOption.click();

  // Concerns step appears; click Continue with no concerns selected
  const continueBtn = page.getByRole("button", { name: /continue/i });
  await continueBtn.waitFor({ state: "visible", timeout: 10000 });
  await continueBtn.click();

  // ChargeSelector should now be visible
  const selectorToggle = page.getByTestId("button-charge-selector-toggle");
  await selectorToggle.waitFor({ state: "visible", timeout: 15000 });
}

test.describe("Jury instruction badge — ChargeSelector (chat interface)", () => {
  test("shows CALCRIM 1600 badge for CA robbery in the first degree in the charge list", async ({
    page,
  }) => {
    await navigateToChargeSelector(page);

    // Search for the charge in the ChargeSelector search box
    const searchInput = page.getByTestId("input-charge-search");
    await searchInput.waitFor({ state: "visible" });
    await searchInput.fill("robbery in the first degree");

    // The charge option button for CA robbery must appear in the list
    const chargeOption = page.getByTestId(
      "charge-option-ca-robbery-in-the-first-degree"
    );
    await chargeOption.waitFor({ state: "visible", timeout: 10000 });
    await expect(chargeOption).toBeVisible();

    // The JuryInstructionBadge link must be inside that charge option
    // (data-testid uses prefix "link-instruction-selector" from ChargeSelector)
    const badgeLink = page.getByTestId(
      "link-instruction-selector-ca-robbery-in-the-first-degree"
    );
    await expect(badgeLink).toBeVisible();
    await expect(badgeLink).toHaveText("CALCRIM 1600");
  });

  test("badge links to the correct courts.ca.gov URL for CA robbery", async ({
    page,
  }) => {
    await navigateToChargeSelector(page);

    const searchInput = page.getByTestId("input-charge-search");
    await searchInput.waitFor({ state: "visible" });
    await searchInput.fill("robbery in the first degree");

    const badgeLink = page.getByTestId(
      "link-instruction-selector-ca-robbery-in-the-first-degree"
    );
    await badgeLink.waitFor({ state: "visible", timeout: 10000 });

    await expect(badgeLink).toHaveAttribute(
      "href",
      "https://www.courts.ca.gov/partners/california-jury-instructions"
    );
    await expect(badgeLink).toHaveAttribute("target", "_blank");
  });

  test("does NOT render a badge for charge options that have no instructionRef", async ({
    page,
  }) => {
    await navigateToChargeSelector(page);

    // Wait for the charge list to load (no search — show all CA charges)
    const anyChargeOption = page
      .locator('[data-testid^="charge-option-"]')
      .first();
    await anyChargeOption.waitFor({ state: "visible", timeout: 15000 });

    // Count all charge options and all badge links in the visible list.
    // Not every charge has an instructionRef, so badge count < charge option count.
    const chargeOptions = page.locator('[data-testid^="charge-option-"]');
    const badgeLinks = page.locator(
      '[data-testid^="link-instruction-selector-"]'
    );

    const optionCount = await chargeOptions.count();
    const badgeCount = await badgeLinks.count();

    // Sanity: there are charges in the list
    expect(optionCount).toBeGreaterThan(0);

    // At least one charge option has no badge (confirming conditional rendering)
    expect(badgeCount).toBeLessThan(optionCount);
  });
});
