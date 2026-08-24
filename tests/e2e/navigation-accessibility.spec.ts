import { expect, test } from "@playwright/test";

test.describe("intent navigation and accessibility", () => {
  test("home path cards have no nested interactive controls", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /where do you want to start/i })).toBeVisible();

    const nestedInteractive = page.locator(
      '#paths a a, #paths a button, #paths button a, #paths button button, #paths [role="link"] a, #paths [role="link"] button'
    );
    await expect(nestedInteractive).toHaveCount(0);

    const startLink = page.getByRole("link", { name: "Start Here" });
    await startLink.focus();
    await expect(startLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/first-24-hours$/);
  });

  test("mobile navigation exposes the shared urgent-help paths", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "First 24 Hours" })).toHaveAttribute("href", "/first-24-hours");
    await expect(mobileNav.getByRole("link", { name: "Case Roadmap" })).toHaveAttribute("href", "/case-guidance");
    await expect(mobileNav.getByRole("link", { name: "Understand a case stage" })).toHaveAttribute("href", "/case-timeline");
    await expect(mobileNav.getByRole("link", { name: "Legal help" })).toHaveAttribute("href", "/legal-aid");
  });

  test("mobile navigation keeps full accessible names while fitting compact labels", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
    const stageLink = mobileNav.getByRole("link", { name: "Understand a case stage" });

    await expect(stageLink).toBeVisible();
    await expect(stageLink.locator("span").last()).toHaveText("Case stage");
    await expect(stageLink).toHaveAttribute("aria-label", "Understand a case stage");

    const navBox = await mobileNav.boundingBox();
    const viewport = page.viewportSize();
    expect(navBox).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(navBox!.x).toBeGreaterThanOrEqual(0);
    expect(navBox!.x + navBox!.width).toBeLessThanOrEqual(viewport!.width);
  });

  test("mobile page reserves space for the fixed navigation", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const main = page.locator("#main-content");
    await expect(main).toHaveClass(/mobile-nav-page-offset/);
    await expect(page.locator('[data-testid="chat-launcher"]')).toHaveCount(1);
  });

  test("desktop chat launcher keeps its established bottom offset", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const launcher = page.locator('[data-testid="chat-launcher"]');
    await expect(launcher).toBeVisible();
    await expect(launcher).toHaveCSS("bottom", "24px");
  });

  test("site search uses combobox and listbox keyboard semantics", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search site" }).click();

    const combobox = page.getByRole("combobox", { name: "Search" });
    await expect(combobox).toHaveAttribute("aria-autocomplete", "list");
    await expect(combobox).toHaveAttribute("aria-controls", "search-results");
    await combobox.fill("how accurate");

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible({ timeout: 15_000 });
    const sourceOption = listbox.getByRole("option").filter({ hasText: "Data Sources" }).first();
    await expect(sourceOption).toBeVisible();

    await combobox.press("ArrowDown");
    await expect(combobox).toHaveAttribute("aria-activedescendant", /search-result-\d+/);
    await expect(combobox).toBeFocused();
  });
});