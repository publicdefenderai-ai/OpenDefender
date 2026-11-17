import { expect, test } from "@playwright/test";
import en from "../../client/src/locales/en";
import es from "../../client/src/locales/es";
import zh from "../../client/src/locales/zh";
import { privacySupplementCopy } from "../../client/src/pages/privacy-supplement-copy";

function textFragments(value: unknown): string[] {
  if (typeof value === "string") return [value.trim()];
  return value && typeof value === "object" ? Object.values(value).flatMap(textFragments) : [];
}

for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Privacy Policy content and AI inventory in ${language}, ${theme}`, async ({ page }) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      await page.goto("/privacy-policy");
      const article = page.locator(".privacy-reader");
      const policy = { en, es, zh }[language].translation.privacyPolicy;
      const supplement = privacySupplementCopy[language];
      const documentCopy = policy.documentSummarizer;
      const published = [policy.hero, policy.principles, policy.caseData, documentCopy.title,
        documentCopy.summary, documentCopy.noStorage, documentCopy.summaryNotStored, documentCopy.aiProcessing,
        documentCopy.supportedFiles, policy.technical, policy.rights, policy.changes, policy.contact, supplement];
      for (const text of published.flatMap(textFragments)) await expect(article).toContainText(text);
      const index = article.getByRole("navigation", { name: policy.reader.index });
      const inventory = article.getByRole("table", { name: supplement.inventory.title });
      await expect(article.locator('a[href="https://www.anthropic.com/legal/commercial-terms"]')).toHaveCount(2);
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 800 });
        await article.locator("summary").focus();
        await page.keyboard.press("Enter");
        expect(await index.getByRole("link").allTextContents()).toEqual(await article.getByRole("heading", { level: 2 }).allTextContents());
        await expect(index.getByRole("link")).toHaveCount(12);
        await index.getByRole("link", { name: supplement.inventory.title }).focus();
        await page.keyboard.press("Enter");
        await expect(article.getByRole("heading", { name: supplement.inventory.title })).toBeFocused();
        await expect(inventory.getByRole("columnheader")).toHaveCount(3);
        for (const [feature, sent, retention] of supplement.inventory.rows) {
          const row = inventory.getByRole("row").filter({ has: page.getByRole("rowheader", { name: feature }) });
          if (width === 320) {
            const rowWidth = (await row.boundingBox())!.width;
            expect((await row.getByRole("rowheader").boundingBox())!.width).toBeGreaterThan(rowWidth * 0.95);
          }
          await expect(row).toContainText(sent);
          await expect(row).toContainText(retention);
        }
        expect(await article.locator("p, li, h1, h2, h3, th, td, a").evaluateAll(nodes =>
          nodes.filter(node => node.getBoundingClientRect().right > innerWidth + 1).length)).toBe(0);
        await article.locator("summary").click();
      }
    });
  }
}
