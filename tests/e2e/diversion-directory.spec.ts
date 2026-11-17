import { expect, test } from "@playwright/test";
import { diversionPrograms } from "../../shared/diversion-programs-data";

for (const language of ["en", "es", "zh"]) {
  for (const theme of ["light", "dark"]) {
    test(`Diversion directory in ${language}, ${theme}`, async ({ page }) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      await page.goto("/diversion-programs");
      const directory = page.locator(".diversion-directory");
      await expect(directory.getByRole("status")).toContainText(String(diversionPrograms.length));
      const program = diversionPrograms.find(p => p.state === "CA" && p.contact && typeof p.contact === "object" && "url" in p.contact && p.eligibilityNotes)!;
      const contact = program.contact as { url: string };
      await directory.getByTestId("select-state-filter").selectOption(program.state);
      await directory.getByTestId("select-program-type-filter").selectOption(program.programTypes[0]);
      const row = directory.getByRole("article").filter({ has: page.getByRole("heading", { name: program.name, exact: true }) });
      await row.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(row.getByText(program.eligibilityNotes!, { exact: true })).toBeVisible();
      await expect(row.locator('a[target="_blank"]')).toHaveAttribute("href", contact.url);
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 800 });
        expect(await row.evaluate(el => el.getBoundingClientRect().right)).toBeLessThanOrEqual(width);
        expect(await directory.getByTestId("select-program-type-filter").evaluate(el => el.getBoundingClientRect().right)).toBeLessThanOrEqual(width);
      }
      await directory.getByTestId("input-location-search").fill("no matching location xyz");
      await expect(directory.getByRole("article")).toHaveCount(0);
      await directory.getByTestId("button-clear-filters").click();
      await expect(directory.getByTestId("select-state-filter")).toHaveValue("");
      await expect(directory.getByTestId("select-program-type-filter")).toHaveValue("");
      await expect(directory.getByRole("status")).toContainText(String(diversionPrograms.length));
    });
  }
}

test("ZIP lookup discloses statewide expansion", async ({ page }) => {
  await page.route("https://nominatim.openstreetmap.org/**", route => route.fulfill({
    json: [{ lat: "34", lon: "-118", address: { state: "California" } }],
  }));
  await page.goto("/diversion-programs");
  await page.getByTestId("input-location-search").fill("90001");
  await expect(page.locator(".diversion-count")).toContainText("California");
  await expect(page.locator(".diversion-result")).toHaveCount(diversionPrograms.filter(p => p.state === "CA").length);
});
