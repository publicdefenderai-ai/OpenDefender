import { expect, test } from "@playwright/test";

const destinations = {
  "before-plea": ["/for-advocates/intake-checklist", "/collateral-consequences", "/support/court-logistics/bail-preparation", "/diversion-programs"],
  "life-stabilization": ["/support", "/support/court-logistics", "/support/mental-health", "/immigration-guidance"],
  reputation: ["/for-advocates/mitigation-builder", "/support/reputation/eligibility", "/support/reputation#rap-sheet", "/support/reputation#certificates-of-relief", "/support/reputation#fcra-rights"],
  "client-education": ["/first-24-hours", "/case-timeline", "/rights-info", "/friends-family"],
  "find-help": ["/legal-aid"],
};

for (const language of ["en", "es", "zh"]) {
  for (const theme of ["light", "dark"]) {
    test(`advocate hub destinations and navigation in ${language}, ${theme}`, async ({ page }) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      await page.goto("/for-advocates");
      const hub = page.locator(".advocate-hub");
      await expect(hub).toHaveAttribute("lang", "en");
      await expect(hub.getByRole("heading", { level: 1 })).toHaveText("Tools for your practice");
      await expect(hub.getByRole("link", { name: "Open intake checklist" })).toHaveAttribute("href", "/for-advocates/intake-checklist");
      await expect(hub.getByRole("link", { name: "Open mitigation builder" })).toHaveAttribute("href", "/for-advocates/mitigation-builder");
      await expect(hub.getByRole("link", { name: "learn more about the project" })).toHaveAttribute("href", "/mission-statement");

      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 900 });
        for (const [id, urls] of Object.entries(destinations)) {
          const jump = hub.locator(`nav a[href="#${id}"]`);
          await jump.focus();
          await page.keyboard.press("Enter");
          const category = hub.locator(`#${id}`);
          await expect(category).toBeFocused();
          await expect(category.getByRole("heading", { level: 2 })).toBeInViewport();
          expect(await category.locator("a").evaluateAll(links => links.map(link => link.getAttribute("href")))).toEqual(urls);
        }
        expect(await hub.locator("a, h1, h2, h3, summary").evaluateAll(nodes => nodes.some(node => {
          const rect = node.getBoundingClientRect();
          return rect.left < -1 || rect.right > innerWidth + 1;
        }))).toBe(false);
      }
      const planned = hub.locator("details");
      await expect(planned.getByText("Pretrial Release Arguments")).toBeHidden();
      await planned.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(planned.getByText("Immigration Intersection Screen")).toBeVisible();
      await expect(planned.getByRole("link")).toHaveCount(0);
      await hub.getByRole("link", { name: "Open mitigation builder" }).click();
      await expect(page).toHaveURL(/\/for-advocates\/mitigation-builder$/);
    });
  }
}
