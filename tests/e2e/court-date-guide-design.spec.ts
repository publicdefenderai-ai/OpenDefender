import { expect, test } from "@playwright/test";
import en from "../../client/src/locales/en";
import es from "../../client/src/locales/es";
import zh from "../../client/src/locales/zh";

function passages(value: unknown): string[] {
  return typeof value === "string" ? [value] : Object.values(value as object).flatMap(passages);
}

for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Court date guide in ${language}, ${theme}`, async ({ page }) => {
      const copy = { en, es, zh }[language].translation.courtDateGuide;
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/support/court-logistics/court-date-guide");
      const guide = page.locator(".court-date-page");
      await expect(guide.getByRole("heading", { level: 1 })).toContainText(copy.design.accent);
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await guide.locator("h1,h2,p,li,label,a,summary").evaluateAll(nodes =>
          nodes.filter(node => {
            const r = node.getBoundingClientRect();
            return r.width && (r.left < -1 || r.right > innerWidth + 1);
          }).map(node => node.textContent))).toEqual([]);
      }
      for (const link of await guide.locator('a[href^="#"]').all()) {
        const hash = await link.getAttribute("href");
        await link.click();
        await expect(page).toHaveURL(new RegExp(hash + "$"));
        await expect(guide.locator(hash! + " h2")).toBeInViewport();
      }
      for (const summary of await guide.locator("summary").all()) {
        await summary.focus();
        await page.keyboard.press("Enter");
      }
      for (const text of passages(copy.sections)) await expect(guide.getByText(text, { exact: true }).first()).toBeVisible();
      const checks = guide.getByRole("checkbox");
      await expect(checks).toHaveCount(6);
      await checks.first().focus();
      await page.keyboard.press("Space");
      await expect(checks.first()).toBeChecked();
      await expect(checks.nth(1)).not.toBeChecked();
      await page.reload();
      await expect(checks.first()).not.toBeChecked();
      await expect(guide.locator('a[href="https://bailproject.org"]')).toHaveCount(2);
      for (const href of ["/support/court-logistics", "/support/transportation", "/support/court-logistics/intake-form"]) {
        await expect(guide.locator(`nav a[href="${href}"]`)).toBeVisible();
      }
    });
  }
}
