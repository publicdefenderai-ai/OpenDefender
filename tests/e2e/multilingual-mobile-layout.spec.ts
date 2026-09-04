import { expect, test, type Page } from "@playwright/test";

const MOBILE_VIEWPORT = { width: 375, height: 812 };

const LANGUAGES = [
  { code: "es", name: "Spanish" },
  { code: "zh", name: "Chinese" },
] as const;

// These are the public guidance and support routes covered by the multilingual
// mobile audit. Keep this list explicit so a new route can be added to the
// regression check when it receives the same review.
const AUDITED_ROUTES = [
  "/support",
  "/support/childcare",
  "/support/employment",
  "/support/finances",
  "/support/family-care",
  "/support/housing",
  "/support/mental-health",
  "/support/reputation",
  "/support/transportation",
  "/case-timeline",
  "/privacy-policy",
  "/rights-info",
] as const;

async function expectNoDocumentHorizontalOverflow(page: Page, route: string) {
  // This intentionally measures only the document. Tables and section rails
  // may scroll inside their own overflow containers without widening the page.
  const dimensions = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));

  expect(
    dimensions.documentScrollWidth,
    `${route} widened the document at ${dimensions.viewportWidth}px`,
  ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  expect(
    dimensions.bodyScrollWidth,
    `${route} widened the body at ${dimensions.viewportWidth}px`,
  ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
}

async function expectMobileNavigationTargets(page: Page, route: string) {
  const undersizedTargets = await page.evaluate(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[role="tab"], nav a[href^="#"]',
      ),
    ).filter((element) => {
      const style = window.getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden";
    });

    return targets
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          label: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80),
          role: element.getAttribute("role") ?? "section-navigation",
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      })
      .filter(({ width, height }) => width < 44 || height < 44);
  });

  expect(
    undersizedTargets,
    `${route} has undersized mobile tab or section-navigation targets`,
  ).toEqual([]);
}

for (const language of LANGUAGES) {
  test(`${language.name} public routes stay usable at 375px`, async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.addInitScript(
      (locale) => {
        window.localStorage.setItem("i18nextLng", locale);
      },
      language.code,
    );

    for (const route of AUDITED_ROUTES) {
      await page.goto(route);
      await expect(page.locator("main h1").first()).toBeVisible({
        timeout: 15_000,
      });
      await page.waitForTimeout(350);

      await expectNoDocumentHorizontalOverflow(page, route);
      await expectMobileNavigationTargets(page, route);
    }
  });
}