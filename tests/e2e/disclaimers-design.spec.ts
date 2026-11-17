import { expect, test } from "@playwright/test";
import en from "../../client/src/locales/en";
import es from "../../client/src/locales/es";
import zh from "../../client/src/locales/zh";

for (const [language, locale] of Object.entries({ en, es, zh })) {
  for (const theme of ["light", "dark"]) {
    test(`Notice contents and full article in ${language}, ${theme}`, async ({ page }) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      await page.goto("/terms");
      await expect(page).toHaveURL(/\/disclaimers$/);
      const article = page.locator(".notice-page");
      const { reader, ...published } = locale.translation.disclaimers;
      for (const block of Object.values(published)) {
        for (const fragment of Object.values(block)) await expect(article).toContainText(fragment);
      }
      const headings = article.getByRole("heading", { level: 2 });
      await expect(headings).toHaveCount(18);
      const summary = article.locator("summary");
      await expect(summary).toContainText(reader.contents.replace("{{count}}", "18"));
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 800 });
        await summary.focus();
        await page.keyboard.press("Enter");
        const index = article.getByRole("navigation", { name: reader.index });
        expect(await index.getByRole("link").allTextContents()).toEqual(await headings.allTextContents());
        expect(await article.locator("p, li, h1, h2, a").evaluateAll(nodes =>
          nodes.filter(node => node.getBoundingClientRect().right > innerWidth + 1).length)).toBe(0);
        const last = index.getByRole("link").last();
        await last.focus();
        await page.keyboard.press("Enter");
        await expect(headings.last()).toBeFocused();
        await summary.click();
      }
      expect(await article.locator("section a").evaluateAll(nodes => nodes.map(node => node.getAttribute("href"))))
        .toEqual(["/privacy-policy", "https://huggingface.co/datasets/LocalLaws/LOCUS-v1",
          "https://creativecommons.org/licenses/by-nc/4.0/", "/privacy-policy", "https://github.com/publicdefenderai-ai/OpenDefender"]);
    });
  }
}
