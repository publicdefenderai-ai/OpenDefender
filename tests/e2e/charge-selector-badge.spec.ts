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
 *   (menu-case-roadmap) → select a state → click Continue on concerns →
 *   ChargeSelector appears.
 */

async function navigateToChargeSelector(page: any, stateCode = "CA") {
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

  // StateSelector appears — choose the requested jurisdiction
  const stateOption = page.getByTestId(`state-option-${stateCode}`);
  await stateOption.waitFor({ state: "visible", timeout: 10000 });
  await stateOption.click();

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
    await searchInput.fill("first-degree robbery");

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
    await searchInput.fill("first-degree robbery");

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

  test("shows complete current-source provenance for a selectable NY charge and still allows selection", async ({
    page,
  }) => {
    await navigateToChargeSelector(page, "NY");

    const searchInput = page.getByTestId("input-charge-search");
    await searchInput.waitFor({ state: "visible" });
    await searchInput.fill("grand larceny in the first degree");

    const chargeOption = page.getByTestId(
      "charge-option-ny-grand-theft-in-the-first-degree",
    );
    await chargeOption.waitFor({ state: "visible", timeout: 10000 });

    const provenanceToggle = page.getByTestId(
      "button-charge-provenance-ny-grand-theft-in-the-first-degree",
    );
    await provenanceToggle.click();

    const provenance = page.getByTestId(
      "charge-provenance-ny-grand-theft-in-the-first-degree",
    );
    await expect(provenance).toBeVisible();
    await expect(provenance).toContainText("Official title");
    await expect(provenance).toContainText("Grand larceny in the first degree");
    await expect(provenance).toContainText("Official citation");
    await expect(provenance).toContainText("N.Y. Penal Law § 155.42");
    await expect(provenance).toContainText("Currentness");
    await expect(provenance).toContainText("Retrieved");
    await expect(provenance).toContainText("Manifest imported");
    await expect(provenance).toContainText("Source content");
    await expect(provenance).toContainText("Available");
    await expect(provenance).toContainText("Content hash");
    await expect(provenance).toContainText(
      "7107b3a2eb979185064b65a098e4333c28c20988db17da9fd523e8f180cada44",
    );

    const sourceLink = page.getByTestId(
      "link-charge-provenance-source-ny-grand-theft-in-the-first-degree-0",
    );
    await expect(sourceLink).toBeVisible();
    await expect(sourceLink).toHaveAttribute(
      "href",
      "https://www.nysenate.gov/legislation/laws/PEN/155.42",
    );
    await expect(sourceLink).toHaveAttribute("target", "_blank");

    // The disclosure is inline; selecting the charge must not navigate away.
    await chargeOption.click();
    await expect(chargeOption).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(/\/chat$/);
    await expect(provenance).toBeVisible();
  });

  test("fails closed when a withheld NY charge has no current provenance", async ({
    page,
  }) => {
    await page.route(/\/api\/criminal-charges\?/, async (route) => {
      const requestUrl = new URL(route.request().url());
      if (requestUrl.searchParams.get("jurisdiction") !== "NY") {
        await route.continue();
        return;
      }

      const upstream = await route.fetch();
      const body = await upstream.json();
      await route.fulfill({
        response: upstream,
        json: {
          ...body,
          charges: [
            ...body.charges,
            {
              id: "ny-auto-burglary",
              citation: null,
              name: "Auto Burglary",
              category: "felony",
              description: "Withheld fixture with no current official source.",
              maxPenalty: "Unavailable",
            },
          ],
          count: body.count + 1,
        },
      });
    });

    await navigateToChargeSelector(page, "NY");

    const searchInput = page.getByTestId("input-charge-search");
    await searchInput.waitFor({ state: "visible" });
    await searchInput.fill("auto burglary");

    const chargeOption = page.getByTestId("charge-option-ny-auto-burglary");
    await chargeOption.waitFor({ state: "visible", timeout: 10000 });

    const provenanceToggle = page.getByTestId(
      "button-charge-provenance-ny-auto-burglary",
    );
    await provenanceToggle.click();

    const provenance = page.getByTestId("charge-provenance-ny-auto-burglary");
    await expect(provenance).toContainText(
      "Current source unavailable. This charge cannot be selected until current authority is restored.",
    );
    await expect(provenance).not.toContainText("Official citation");
    await expect(provenance).not.toContainText("Content hash");
    await expect(
      provenance.locator('[data-testid^="link-charge-provenance-source-"]'),
    ).toHaveCount(0);

    // The failed provenance lookup removes any selection and disables the row.
    await expect(chargeOption).toBeDisabled();
    await expect(chargeOption).toHaveAttribute("aria-pressed", "false");
  });
});
