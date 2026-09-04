import { expect, test, type Page } from "@playwright/test";

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  // Wait for the authored intro and route transitions to settle before
  // measuring transformed elements.
  await page.waitForTimeout(500);

  const layout = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const overflowingElements = Array.from(
      document.querySelectorAll<HTMLElement>("body *"),
    )
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: element.className,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
        };
      })
      .filter(({ left, right }) => left < -1 || right > viewportWidth + 1)
      .slice(0, 5);

    return {
      viewportWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      overflowingElements,
    };
  });

  expect(
    layout.documentScrollWidth,
    `Document overflow at ${layout.viewportWidth}px: ${JSON.stringify(layout)}`,
  ).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(
    layout.bodyScrollWidth,
    `Body overflow at ${layout.viewportWidth}px: ${JSON.stringify(layout)}`,
  ).toBeLessThanOrEqual(layout.viewportWidth + 1);
}

async function stubInitialServiceRequests(page: Page) {
  // These routes cover the shared startup requests and the successful statute
  // response used by the normal shell test. Outage-specific provider fixtures
  // are installed separately by stubResearchServiceOutages.
  await page.route("**/api/attorney/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ isVerified: false }),
    });
  });
  await page.route("**/api/ai/status", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ available: true }),
    });
  });
  await page.route("**/api/captcha/config", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ required: false, siteKey: null }),
    });
  });
  await page.route("**/api/statutes/federal**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        jurisdiction: "federal",
        count: 0,
        statutes: [],
        source: "responsive-shell-fixture",
      }),
    });
  });
}


async function stubResearchServiceOutages(page: Page) {
  await page.unroute("**/api/statutes/federal**");
  await page.route("**/api/statutes/federal**", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        error: "Statute service unavailable",
      }),
    });
  });

  await page.route("**/api/court-records/search**", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        error: "Court records service unavailable",
      }),
    });
  });
}

async function expectEditorialOpening(page: Page) {
  const opening = page.locator("section.editorial-page-intro");
  await expect(opening).toHaveCount(1);
  await expect(opening.locator("h1")).toBeVisible();
  await expect(opening.locator("p")).toBeVisible();
}

async function expectPrimaryToolSurface(page: Page, route: string) {
  switch (route) {
    case "/legal-glossary":
      await expect(page.getByTestId("input-glossary-search")).toBeVisible();
      await expect(
        page.locator("section.editorial-reading .editorial-card").first(),
      ).toBeVisible();
      return;
    case "/document-summarizer":
      await expect(
        page.locator("section.editorial-workspace .w-full.max-w-3xl").first(),
      ).toBeVisible();
      await expect(page.getByRole("checkbox")).toBeVisible();
      await expect(page.getByRole("button", { name: /continue/i })).toBeDisabled();
      return;
    case "/court-records":
      await expect(page.getByTestId("input-search-term")).toBeVisible();
      await expect(
        page.locator("div.editorial-workspace > .editorial-card").first(),
      ).toBeVisible();
      return;
    case "/statutes":
      await expect(page.getByTestId("input-search-statutes")).toBeVisible();
      await expect(page.getByTestId("tab-federal")).toBeVisible();
      await expect(page.locator("main.editorial-workspace > .editorial-surface")).toBeVisible();
      return;
    default:
      throw new Error(`Unhandled research tool route: ${route}`);
  }
}

for (const viewport of VIEWPORTS) {
  test.describe(`research tool shells at ${viewport.name} width`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        window.localStorage.setItem("i18nextLng", "en");
      });
      await stubInitialServiceRequests(page);
    });

    test("render their editorial openings and initial tool surfaces without overflow", async ({ page }) => {
      const routes = [
        "/legal-glossary",
        "/document-summarizer",
        "/court-records",
        "/statutes",
      ] as const;

      for (const route of routes) {
        await page.goto(route);
        await expectEditorialOpening(page);
        await expectPrimaryToolSurface(page, route);
        await expectNoHorizontalOverflow(page);
        await expect(page).toHaveScreenshot(`${route.slice(1)}-${viewport.name}.png`, {
          animations: "disabled",
          caret: "hide",
        });
      }
    });

    test("explain research service outages without overflow", async ({ page }) => {
      await stubResearchServiceOutages(page);

      await page.goto("/statutes");
      await expectEditorialOpening(page);
      await expect(
        page.getByText("Statute search is temporarily unavailable. Please try again later."),
      ).toBeVisible();
      await expectNoHorizontalOverflow(page);

      await page.goto("/court-records");
      await expectEditorialOpening(page);
      await page.getByTestId("input-search-term").fill("service outage fixture");
      await page.getByTestId("button-search").click();
      await expect(
        page.getByText("Search failed. Please try again or refine your search criteria."),
      ).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });
  });
}