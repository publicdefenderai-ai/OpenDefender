import { expect, test, type Page } from "@playwright/test";

const PHONE_VIEWPORT = { width: 320, height: 812 } as const;

const LANGUAGES = [
  {
    code: "es",
    name: "Spanish",
    labels: {
      guidance: "Iniciar Evaluación Personalizada",
      timeline: "Elija su etapa actual",
      rights: "Vea la referencia rápida de derechos",
      resources: "Buscar ayuda por código postal",
      support: "Comience con el primer paso",
    },
  },
  {
    code: "zh",
    name: "Chinese",
    labels: {
      guidance: "开始使用",
      timeline: "选择您当前的阶段",
      rights: "查看权利速查参考",
      resources: "按邮政编码查找帮助",
      support: "从第一步开始",
    },
  },
] as const;

const ANCHORED_ACTIONS = [
  {
    route: "/case-timeline",
    testId: "button-start-timeline",
    labelKey: "timeline",
    hash: "#timeline-stages",
  },
  {
    route: "/rights-info",
    testId: "button-start-rights",
    labelKey: "rights",
    hash: "#quick-rights",
  },
  {
    // /resources is a compatibility redirect. Keep /legal-aid as the
    // canonical resources route so a route rename cannot hide a broken CTA.
    route: "/legal-aid",
    testId: "button-start-resources",
    labelKey: "resources",
    hash: "#resource-finders",
  },
] as const;

const SUPPORT_TEMPLATE_ROUTES = [
  "/support/employment",
  "/support/court-logistics",
  "/support/mental-health",
  "/support/transportation",
  "/support/childcare",
  "/support/housing",
  "/support/family-care",
  "/support/reputation",
  "/support/reentry",
  "/support/personal-health",
] as const;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type LocalizedCtaContext = {
  language: string;
  route: string;
  testId: string;
  label: string;
  expectedDestination: string;
};

async function installStableGuidanceStatus(page: Page) {
  await page.route("**/api/ai/status", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ available: true }),
    });
  });
}

function describeLocalizedCta(context: LocalizedCtaContext) {
  return `${context.language} ${context.route} CTA "${context.label}" ` +
    `(expected ${context.expectedDestination})`;
}

async function expectLocalizedMobileCta(
  page: Page,
  context: LocalizedCtaContext,
) {
  const cta = page.getByTestId(context.testId);
  const description = describeLocalizedCta(context);

  await expect(
    cta,
    `${description} is missing its localized primary CTA`,
  ).toBeVisible();
  await expect(
    cta,
    `${description} is not localized as expected`,
  ).toContainText(context.label);

  const metrics = await cta.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      text: element.textContent?.trim().replace(/\s+/g, " "),
    };
  });

  expect(
    metrics.left,
    `${description} "${metrics.text}" starts outside the phone viewport`,
  ).toBeGreaterThanOrEqual(-1);
  expect(
    metrics.right,
    `${description} "${metrics.text}" extends beyond the ${PHONE_VIEWPORT.width}px viewport`,
  ).toBeLessThanOrEqual(PHONE_VIEWPORT.width + 1);
  expect(
    metrics.scrollWidth,
    `${description} "${metrics.text}" clips or overflows its localized label`,
  ).toBeLessThanOrEqual(metrics.clientWidth + 1);
}

for (const language of LANGUAGES) {
  test.describe(`${language.name} mobile primary actions`, () => {
    test.use({ viewport: PHONE_VIEWPORT });

    test(`${language.name} guidance CTA opens the questionnaire without overflow`, async ({
      page,
    }) => {
      await installStableGuidanceStatus(page);
      await page.addInitScript(
        (locale) => window.localStorage.setItem("i18nextLng", locale),
        language.code,
      );
      await page.goto("/case-guidance");
      await expect(page.locator("h1").first()).toBeVisible();

      await expectLocalizedMobileCta(
        page,
        {
          language: language.name,
          route: "/case-guidance",
          testId: "button-start-guidance",
          label: language.labels.guidance,
          expectedDestination: "questionnaire",
        },
      );
      await page.getByTestId("button-start-guidance").click();
      await expect(
        page.getByTestId("qa-step-indicator"),
        `${language.name} /case-guidance CTA "${language.labels.guidance}" ` +
          "did not reach the questionnaire",
      ).toBeVisible();
    });

    test(`${language.name} anchored page CTAs reach their intended sections`, async ({
      page,
    }) => {
      await page.addInitScript(
        (locale) => window.localStorage.setItem("i18nextLng", locale),
        language.code,
      );

      for (const action of ANCHORED_ACTIONS) {
        await page.goto(action.route);
        await expect(page.locator("h1").first()).toBeVisible();
        await expectLocalizedMobileCta(
          page,
          {
            language: language.name,
            route: action.route,
            testId: action.testId,
            label: language.labels[action.labelKey],
            expectedDestination: `hash "${action.hash}"`,
          },
        );

        await page.getByTestId(action.testId).click();
        await expect(page).toHaveURL(
          new RegExp(
            `${escapeRegExp(action.route)}${escapeRegExp(action.hash)}$`,
          ),
          `${language.name} ${action.route} CTA "${language.labels[action.labelKey]}" ` +
            `did not reach expected hash "${action.hash}"`,
        );
        await expect(
          page.locator(action.hash),
          `${language.name} ${action.route} CTA "${language.labels[action.labelKey]}" ` +
            `expected hash "${action.hash}" section is not visible`,
        ).toBeVisible();
      }
    });

    test(`${language.name} support CTAs reach the start section on every template route`, async ({
      page,
    }) => {
      await page.addInitScript(
        (locale) => window.localStorage.setItem("i18nextLng", locale),
        language.code,
      );

      for (const route of SUPPORT_TEMPLATE_ROUTES) {
        await page.goto(route);
        await expect(page.locator("h1").first()).toBeVisible();
        await expectLocalizedMobileCta(
          page,
          {
            language: language.name,
            route,
            testId: "button-start-here",
            label: language.labels.support,
            expectedDestination: 'hash "#section-start-here"',
          },
        );

        await page.getByTestId("button-start-here").click();
        await expect(page).toHaveURL(
          new RegExp(`${escapeRegExp(route)}#section-start-here$`),
          `${language.name} ${route} CTA "${language.labels.support}" ` +
            'did not reach expected hash "#section-start-here"',
        );
        await expect(
          page.locator("#section-start-here"),
          `${language.name} ${route} CTA "${language.labels.support}" ` +
            'expected hash "#section-start-here" section is not visible',
        ).toBeVisible();
      }
    });
  });
}