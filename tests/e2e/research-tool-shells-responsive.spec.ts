import { expect, test, type Page } from "@playwright/test";

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

const LOCALIZED_STATUTE_OUTAGES = [
  {
    code: "es",
    name: "Spanish",
    message:
      "El proveedor del texto oficial no está disponible temporalmente. Vuelva a intentar la consulta de citas más tarde.",
  },
  {
    code: "zh",
    name: "Chinese",
    message: "官方文本服务商暂时不可用。请稍后重试引文查询。",
  },
] as const;

const LOCALIZED_STATUTE_ERRORS = [
  {
    code: "es",
    name: "Spanish",
    invalidCitation:
      "No se reconoce ese formato de cita. Pruebe un formato estándar y vuelva a buscar.",
    citationNotFound:
      'No se encontró ningún estatuto para "Cal. Penal Code § 999999". Intente ajustar el formato de la cita o compruebe que sea correcto.',
  },
  {
    code: "zh",
    name: "Chinese",
    invalidCitation: "无法识别该引文格式。请尝试标准格式后重新搜索。",
    citationNotFound:
      "未找到“Cal. Penal Code § 999999”对应的法规。请调整引文格式或检查引文是否正确。",
  },
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

  await stubCitationProviderOutage(page);
}

async function stubCitationProviderOutage(page: Page) {
  await page.route("**/api/openlaws/citation/**", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        error: "OpenLaws provider unavailable",
      }),
    });
  });
}

async function stubStatuteCardProviderOutage(page: Page) {
  await page.unroute("**/api/statutes/federal**");
  await page.route("**/api/statutes/federal**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        jurisdiction: "federal",
        count: 1,
        statutes: [
          {
            title: "Battery",
            citation: "Cal. Penal Code § 242",
            summary: "Responsive shell fixture",
          },
        ],
        source: "responsive-shell-fixture",
      }),
    });
  });
}

async function stubCitationNotFound(page: Page) {
  await page.unroute("**/api/openlaws/citation/**");
  await page.route("**/api/openlaws/citation/**", async (route) => {
    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        error: "Statute not found",
      }),
    });
  });
}

async function stubCitationInvalid(page: Page) {
  await page.unroute("**/api/openlaws/citation/**");
  await page.route("**/api/openlaws/citation/**", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        error: "Invalid citation format",
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
      await page.getByTestId("tab-lookup").click();
      await page.getByTestId("input-citation-lookup").fill("Cal. Penal Code § 242");
      await page.getByTestId("button-citation-lookup").click();
      await expect(
        page.getByText(
          "The official-text provider is temporarily unavailable. Please try the citation lookup again later.",
        ),
      ).toBeVisible();
      await expectNoHorizontalOverflow(page);

      await stubStatuteCardProviderOutage(page);
      await page.goto("/statutes");
      await expect(page.getByTestId("button-full-text-cal--penal-code---242")).toBeVisible();
      await page.getByTestId("button-full-text-cal--penal-code---242").click();
      await expect(
        page.getByText(
          "The official-text provider is temporarily unavailable. Please try the citation lookup again later.",
        ),
      ).toBeVisible();
      await expectNoHorizontalOverflow(page);

      await stubCitationNotFound(page);
      await page.goto("/statutes");
      await page.getByTestId("tab-lookup").click();
      await page.getByTestId("input-citation-lookup").fill("Cal. Penal Code § 999999");
      await page.getByTestId("button-citation-lookup").click();
      await expect(
        page.getByText(
          'No statute found for "Cal. Penal Code § 999999". Try adjusting the citation format or check that the citation is correct.',
        ),
      ).toBeVisible();
      await expect(
        page.getByText(
          "The official-text provider is temporarily unavailable. Please try the citation lookup again later.",
        ),
      ).toHaveCount(0);
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

    for (const language of LOCALIZED_STATUTE_OUTAGES) {
      test(
        `${language.name} live statute outage guidance remains visible without overflow`,
        async ({ page }) => {
          await page.addInitScript(
            (locale) => window.localStorage.setItem("i18nextLng", locale),
            language.code,
          );
          await stubCitationProviderOutage(page);

          await page.goto("/statutes");
          await expectEditorialOpening(page);
          await page.getByTestId("tab-lookup").click();
          await page
            .getByTestId("input-citation-lookup")
            .fill("Cal. Penal Code § 242");
          await page.getByTestId("button-citation-lookup").click();

          await expect(page.getByText(language.message)).toBeVisible();
          await expectNoHorizontalOverflow(page);
        },
      );
    }

    for (const language of LOCALIZED_STATUTE_ERRORS) {
      test(
        `${language.name} invalid and missing citation guidance remains visible without overflow`,
        async ({ page }) => {
          await page.addInitScript(
            (locale) => window.localStorage.setItem("i18nextLng", locale),
            language.code,
          );

          await stubCitationInvalid(page);
          await page.goto("/statutes");
          await expectEditorialOpening(page);
          await page.getByTestId("tab-lookup").click();
          await page.getByTestId("input-citation-lookup").fill("not a citation");
          await page.getByTestId("button-citation-lookup").click();
          await expect(page.getByText(language.invalidCitation)).toBeVisible();
          await expectNoHorizontalOverflow(page);

          await stubCitationNotFound(page);
          await page.getByTestId("input-citation-lookup").fill("Cal. Penal Code § 999999");
          await page.getByTestId("button-citation-lookup").click();
          await expect(page.getByText(language.citationNotFound)).toBeVisible();
          await expectNoHorizontalOverflow(page);
        },
      );
    }
  });
}