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

    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Urgent help" })).toHaveAttribute("href", "/first-24-hours");
    await expect(page.getByRole("link", { name: "Case Roadmap" })).toHaveAttribute("href", "/case-guidance");
    await expect(page.getByRole("link", { name: "Understand a case stage" })).toHaveAttribute("href", "/case-timeline");
    await expect(page.getByRole("link", { name: "Legal help" })).toHaveAttribute("href", "/legal-aid");
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