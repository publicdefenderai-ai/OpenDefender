import { expect, test } from "@playwright/test";
import en from "../../client/src/locales/en";
import es from "../../client/src/locales/es";
import zh from "../../client/src/locales/zh";

for (const [language, locale] of Object.entries({ en, es, zh })) {
  test(`Unknown route offers working recovery destinations in ${language}`, async ({ page }) => {
    await page.addInitScript(lang => localStorage.setItem("i18nextLng", lang), language);
    const copy = locale.translation.missingPage;
    for (const theme of ["light", "dark"]) {
      await page.addInitScript(value => localStorage.setItem("public-defender-theme", value), theme);
      await page.goto("/missing-page-design-check");
      const section = page.getByRole("region", { name: copy.title });
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(section).toContainText(copy.description);
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 800 });
        expect(await section.locator("h1,p,a").evaluateAll(nodes => nodes.filter(node => {
          const rect = node.getBoundingClientRect();
          return rect.right > innerWidth + 1 || rect.left < -1;
        }).length)).toBe(0);
      }
      await section.getByRole("link", { name: copy.resources }).focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/directory$/);
      await page.goBack();
      await section.getByRole("link", { name: copy.home }).click();
      await expect(page).toHaveURL(/\/$/);
    }
  });
}
