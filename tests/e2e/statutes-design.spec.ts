import { expect, test } from "@playwright/test";

for (const language of ["en", "es", "zh"]) {
  for (const theme of ["light", "dark"]) {
    test(`statute reader in ${language}, ${theme}`, async ({ page }, info) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      const base = { title: "Fixture law", citation: "18 USC 1343", penalties: "Fixture penalty", summary: "Fixture summary" };
      await page.route("**/api/statutes/federal**", route => route.fulfill({ json: {
        success: true, statutes: [base, { penalties: "Uncited penalty" }],
      } }));
      await page.route("**/api/openlaws/citation/**", route => route.fulfill({ json: { success: true, statute: { content: "Fixture full text" } } }));
      await page.goto("/statutes");
      const opening = page.locator(".statutes-opening");
      await expect(opening.locator("dt")).toHaveText(["18", "U.S.C.", "§ 1343"]);
      const row = page.getByTestId("card-statute-18-usc-1343");
      const labels = {
        en: ["Summary", "Penalties", "Untitled statute", "Related pages"],
        es: ["Resumen", "Sanciones", "Ley sin título", "Páginas relacionadas"],
        zh: ["摘要", "处罚", "未命名法规", "相关页面"],
      }[language]!;
      await expect(page.getByRole("navigation", { name: labels[3] })).toBeVisible();
      await expect(page.getByText(labels[2], { exact: true })).toBeVisible();
      await expect(row.getByRole("heading", { name: labels[0] })).toBeVisible();
      await expect(row).toContainText(base.summary);
      await expect(row).not.toContainText(base.penalties);
      await expect(page.getByText("Uncited penalty")).toBeVisible();
      await row.getByRole("button").click();
      await expect(row.getByRole("heading", { name: labels[1] })).toBeVisible();
      await expect(row).toContainText(base.penalties);
      await expect(row).toContainText("Fixture full text");
      const query = page.getByTestId("input-search-statutes");
      await query.fill("fraud");
      await Promise.all([page.waitForRequest(req => req.url().endsWith("/api/statutes/federal?q=fraud")), query.press("Enter")]);
      await page.getByTestId("tab-lookup").click();
      await expect(query).toHaveCount(0);
      await expect(page.getByTestId("input-citation-lookup")).toBeVisible();
      await page.getByTestId("tab-state").click();
      await expect(query).toHaveValue("fraud");
      await expect(page.getByTestId("select-state")).toBeVisible();
      await page.getByTestId("tab-federal").click();
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.locator(".statutes-width *").evaluateAll(nodes => nodes.some(node => {
          const rect = node.getBoundingClientRect();
          return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
        }))).toBe(false);
        if (language === "en" && theme === "light") {
          info.snapshotSuffix = "";
          await expect(opening).toHaveScreenshot(`citation-opening-${width}.png`, { maxDiffPixelRatio: 0.015 });
        }
        await info.attach(`Statutes at ${width}px`, { body: await page.screenshot(), contentType: "image/png" });
      }
    });
  }
}
