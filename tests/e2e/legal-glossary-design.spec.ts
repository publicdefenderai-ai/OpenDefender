import { expect, test } from "@playwright/test";
import { legalGlossaryTerms } from "../../shared/legal-glossary-data";

for (const language of ["en", "es", "zh"]) {
  for (const theme of ["light", "dark"]) {
    test(`glossary terms, search and navigation in ${language}, ${theme}`, async ({ page }) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      await page.goto("/legal-glossary?search=prosecutor");
      const root = page.locator(".glossary-reader");
      const search = root.getByRole("searchbox");
      const rows = root.locator("details");
      await expect(search).toHaveValue("prosecutor");
      await expect(root.locator("#prosecutor")).toBeVisible();
      await root.getByTestId("button-clear-filters").click();
      await expect(search).toBeFocused();
      await expect(rows).toHaveCount(legalGlossaryTerms.length);
      for (const term of legalGlossaryTerms) {
        const row = root.locator(`#${term.slug}`);
        await row.locator("summary").click();
        await expect(row.locator("summary")).toHaveText(term.term);
        await expect(row.locator('p[lang="en"]')).toHaveText(term.definition);
        for (const alias of term.aliases ?? []) await expect(row).toContainText(alias);
        for (const tag of term.tags ?? []) await expect(row.getByRole("button", { name: tag, exact: true })).toBeVisible();
        if (term.learnMoreUrl) await expect(row.getByRole("link")).toHaveAttribute("href", term.learnMoreUrl);
        await row.locator("summary").click();
      }
      for (const query of [" Form I-200 ", "judicial warrant", "fourth amendment"]) {
        await search.fill(query);
        await expect(root.locator("#administrative-warrant")).toBeVisible();
      }
      await search.fill("");
      await root.getByTestId("button-letter-b").click();
      await root.getByRole("combobox").selectOption("bond");
      await expect(root.locator("#bail")).toBeVisible();
      await expect(root.locator("#arraignment")).toHaveCount(0);
      await search.fill("nonexistent-legal-term");
      await expect(rows).toHaveCount(0);
      await page.goto("/legal-glossary#arraignment");
      await expect(root.locator("#arraignment summary")).toBeFocused();
      await expect(root.locator("#arraignment")).toHaveAttribute("open", "");
      await root.locator("#arraignment").getByRole("button", { name: "procedure", exact: true }).click();
      await expect(root.getByRole("combobox")).toHaveValue("procedure");
      await expect(root.getByRole("combobox")).toBeFocused();
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await root.locator("input, select, summary, p, h1, button, a").evaluateAll(nodes =>
          nodes.some(node => node.getBoundingClientRect().right > innerWidth + 1))).toBe(false);
      }
      expect(await root.locator("nav a").evaluateAll(links => links.map(link => link.getAttribute("href"))))
        .toEqual(["/document-library", "/rights-info", "/directory", "/case-guidance", "/"]);
    });
  }
}
