import { expect, test } from "@playwright/test";
import { LEGAL_DOCUMENTS } from "../../shared/legal-documents";
import en from "../../client/src/locales/en";
import es from "../../client/src/locales/es";
import zh from "../../client/src/locales/zh";

for (const [language, locale] of Object.entries({ en, es, zh })) {
  for (const theme of ["light", "dark"]) {
    test(`document library in ${language}, ${theme}`, async ({ page }) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
        Object.defineProperty(navigator, "share", { value: async (data: ShareData) => {
          document.body.dataset.shared = data.url;
        } });
      }, { language, theme });
      await page.goto("/document-library");
      const root = page.locator(".library-reader");
      const rows = root.locator("details");
      await expect(rows).toHaveCount(18);
      for (const doc of LEGAL_DOCUMENTS) {
        const row = root.locator(`#${doc.slug}`);
        await row.locator("summary").click();
        const getText = (key: string) => key.split(".").reduce((obj, part) => obj[part], locale.translation as any) as string;
        for (const key of [doc.titleKey, doc.descriptionKey, doc.purposeKey, doc.whatToDoKey,
          ...doc.sections.flatMap(section => [section.labelKey, section.explanationKey])]) {
          await expect(row).toContainText(getText(key));
        }
        await row.locator("summary").click();
      }
      const search = root.getByRole("searchbox");
      await search.fill("i-862");
      await expect(rows).toHaveCount(1);
      const slug = "notice-to-appear-i862";
      const row = root.locator(`#${slug}`);
      await row.locator("summary").focus();
      await page.keyboard.press("Enter");
      await row.getByTestId(`button-share-${slug}`).click();
      await expect(page.locator("body")).toHaveAttribute("data-shared", new URL(`/document-library#${slug}`, page.url()).href);
      await root.getByTestId("select-category-filter").selectOption("criminal");
      await expect(rows).toHaveCount(0);
      await expect(root.getByRole("status")).toHaveText(locale.translation.documentLibrary.noDocuments);
      await root.getByRole("button", { name: locale.translation.documentLibrary.reader.clear }).click();
      await expect(rows).toHaveCount(18);
      await expect(search).toBeFocused();
      await root.getByTestId("select-category-filter").selectOption("immigration");
      await root.getByTestId("select-phase-filter").selectOption("arraignment");
      await expect(rows).toHaveCount(LEGAL_DOCUMENTS.filter(d => d.category === "immigration" && d.phases.includes("arraignment")).length);
      await page.goto("/document-library#citation-ticket");
      await expect(root.locator("#citation-ticket")).toHaveAttribute("open", "");
      await page.reload();
      await expect(root.locator("#citation-ticket summary")).toBeFocused();
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await root.locator("p, summary, select, input, a").evaluateAll(nodes => nodes.some(node => {
          const rect = node.getBoundingClientRect();
          return rect.left < -1 || rect.right > innerWidth + 1;
        }))).toBe(false);
      }
      await expect(root.getByTestId("button-get-guidance")).toHaveAttribute("href", "/chat");
    });
  }
}
