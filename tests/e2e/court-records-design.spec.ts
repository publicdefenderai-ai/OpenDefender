import { expect, test } from "@playwright/test";
import en from "../../client/src/locales/en";
import es from "../../client/src/locales/es";
import zh from "../../client/src/locales/zh";

for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Records search modes and responses in ${language}, ${theme}`, async ({ page }, info) => {
      const copy = { en, es, zh }[language].translation.courtRecords;
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      const requests: URLSearchParams[] = [];
      let state: "matches" | "partial" | "empty" | "failure" = "matches";
      await page.route("**/api/court-records/search?**", async route => {
        requests.push(new URL(route.request().url()).searchParams);
        if (state === "failure") { await route.fulfill({ status: 503 }); return; }
        const docket = { id: 1, case_name: "Example docket", docket_number: "1:24-cv-15", court_id: "demo", nature_of_suit: "Fixture type",
          date_filed: "2024-01-02", assigned_to_str: "Example judge", absolute_url: "/docket/1/example/" };
        const opinion = { id: 2, caseNameFull: "Example opinion", citation: ["Fixture citation"], dateFiled: "2024-03-01",
          snippet: "Example excerpt", absolute_url: "/opinion/2/example/" };
        await route.fulfill({ json: { success: true, hasRecapAccess: state === "matches",
          partialFailure: state === "partial", failedServices: { recap: state === "partial" },
          recap: state === "matches" ? { count: 1, results: [docket] } : { count: 0, results: [] },
          opinions: state !== "empty" ? { count: 1, results: [opinion] } : { count: 0, results: [] } } });
      });
      await page.setViewportSize({ width: theme === "dark" ? 320 : 1280, height: 900 });
      await page.goto("/court-records");
      const main = page.locator(".records-page");
      const submit = main.getByTestId("button-search");
      await expect(submit).toBeDisabled();
      await main.getByLabel(copy.searchParams.searchTerm, { exact: true }).fill("example");
      await main.getByLabel(copy.searchParams.caseName, { exact: true }).fill("Example case");
      await main.getByLabel(copy.searchParams.docketNumber, { exact: true }).fill("1:24-cv-15");
      expect(requests).toHaveLength(0);
      await main.getByTestId("input-docket-number").press("Enter");
      await expect(main.getByTestId("button-view-recap-0")).toHaveAttribute("href","https://www.courtlistener.com/docket/1/example/");
      await expect(main.getByTestId("button-view-opinion-0")).toHaveAttribute("href","https://www.courtlistener.com/opinion/2/example/");
      expect(Object.fromEntries(requests[0])).toEqual({ q: "example", case_name: "Example case", docket_number: "1:24-cv-15" });
      for (const text of ["Fixture type", "Example judge", "Fixture citation", "Example excerpt", copy.design.fullAccess]) await expect(main).toContainText(text);
      expect(await main.locator("a,h1,h2,label,input:not([aria-hidden='true']),button,p").evaluateAll(nodes => nodes.filter(node => {
        const rect = node.getBoundingClientRect();
        return rect.width && (rect.left < -1 || rect.right > innerWidth + 1);
      }).map(node => [node.tagName, node.id, node.textContent]))).toEqual([]);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: info.outputPath("records.png") });
      await main.getByRole("switch").focus();
      await page.keyboard.press("Space");
      await expect(main.getByTestId("input-search-term")).toHaveAttribute("placeholder", copy.searchParams.semanticSearchPlaceholder);
      state = "partial";
      await submit.click();
      await expect(main.getByRole("alert")).toContainText(copy.partialFailure.recapFailed);
      await expect(main.getByTestId("text-opinion-name-0")).toHaveText("Example opinion");
      await expect(main).toContainText(copy.design.limitedAccess);
      expect(requests.at(-1)?.get("search_type")).toBe("semantic");
      state = "failure";
      await submit.click();
      await expect(main.getByRole("alert")).toHaveText(copy.results.searchFailed);
      state = "empty";
      await submit.click();
      await expect(main.getByText(copy.results.noResults, { exact: true })).toBeVisible();
      await expect(main.getByRole("alert")).toHaveCount(0);
      await main.getByRole("button", { name: { en, es, zh }[language].translation.common.back }).click();
      await expect(submit).toBeDisabled();
      for (const href of ["/court-locator", "/data-sources", "/recap-extensions"]) {
        await expect(main.locator(`a[href="${href}"]`).first()).toBeVisible();
      }
    });
  }
}
