import { expect, test } from "@playwright/test";
import en from "../../client/src/locales/en";
import es from "../../client/src/locales/es";
import zh from "../../client/src/locales/zh";

for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Court locator searches and status in ${language}, ${theme}`, async ({ page }, info) => {
      const copy = { en, es, zh }[language].translation.courtLocator;
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      await page.setViewportSize({ width: theme === "dark" ? 320 : 1280, height: 900 });
      let mode: "found" | "empty" | "error" = "found";
      await page.route("https://nominatim.openstreetmap.org/search?**", async route => {
        const query = new URL(route.request().url()).searchParams;
        if (!query.has("amenity")) {
          await route.fulfill({ json: [{ lat: "40", lon: "-75", address: { county: "Example County" } }] });
          return;
        }
        if (mode === "error") { await route.fulfill({ status: 503 }); return; }
        const base = { type: "courthouse", lat: "40.01", lon: "-75", address: { house_number: "1", road: "Court St", county: "Example County" } };
        await route.fulfill({ json: mode === "empty" ? [] : [
          { ...base, place_id: 1, name: "Example Municipal Court", extratags: { website: "https://example.org/court", phone: "212-555-0100", opening_hours: "Mo-Fr 08:30-16:00" } },
          { ...base, place_id: 2, name: "United States District Court" },
          { ...base, place_id: 3, name: "Remote courthouse", lat: "45" },
        ] });
      });
      await page.goto("/court-locator");
      const main = page.locator(".locator-page");
      const input = main.getByLabel(copy.design.zip, { exact: true });
      const search = main.getByTestId("button-search-courts");
      await expect(search).toBeDisabled();
      await input.fill("00a");
      await expect(input).toHaveValue("00");
      await input.fill("00123");
      await input.press("Enter");
      await expect(main.locator(".locator-result")).toHaveCount(2);
      await expect(main.getByTestId("button-call-1")).toHaveAttribute("href", "tel:2125550100");
      await expect(main.getByTestId("button-website-1")).toHaveAttribute("href", "https://example.org/court");
      await expect(main.getByTestId("button-directions-2")).toHaveAttribute("href", /40.01%2C-75/);
      await expect(main).toContainText("Mo-Fr 08:30-16:00");
      await expect(main).not.toContainText("Remote courthouse");
      await expect(main).toContainText(copy.design.notice);
      await expect(main.getByRole("link", { name: copy.design.federal })).toHaveAttribute("href", "https://www.uscourts.gov/federal-court-finder/find");
      for (const key of ["courtTypesCard", "courtHoursCard", "dataSourcesCard"] as const) {
        const summary = main.locator("summary").filter({ hasText: copy.courtInformation[key].title });
        await summary.focus();
        await page.keyboard.press("Enter");
        await expect(main.getByText(copy.courtInformation[key].description, { exact: true })).toBeVisible();
      }
      expect(await main.locator("h1,h2,p,a,label,input,button").evaluateAll(nodes => nodes.filter(node => {
        const r = node.getBoundingClientRect();
        return r.width && (r.left < -1 || r.right > innerWidth + 1);
      }).map(node => node.textContent))).toEqual([]);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: info.outputPath("locator.png") });
      mode = "empty";
      await search.click();
      await expect(main.getByRole("status")).toContainText(copy.results.noCourts);
      mode = "error";
      await search.click();
      await expect(main.getByRole("alert")).toHaveText(copy.design.unavailable);
      await expect(main.getByRole("status")).not.toContainText(copy.results.noCourts);
      mode = "found";
      await search.click();
      await expect(main.locator(".locator-result")).toHaveCount(2);
    });
  }
}
