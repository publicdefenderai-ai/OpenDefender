import { expect, test, type Page } from "@playwright/test";

const MOBILE_VIEWPORT = { width: 320, height: 812 } as const;

const PROGRESS_SCENARIOS = [
  {
    name: "0%",
    completed: [false, false],
    percent: 0,
  },
  {
    name: "50%",
    completed: [true, false],
    percent: 50,
  },
  {
    name: "100%",
    completed: [true, true],
    percent: 100,
  },
] as const;

async function mockGuidanceStream(
  page: Page,
  timeline: Array<{ stage: string; completed: boolean }>,
) {
  await page.route("**/api/legal-guidance/stream", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      body: `data: ${JSON.stringify({
        type: "complete",
        success: true,
        sessionId: "test-session-progress-mobile-overflow",
        guidance: {
          overview: "Progress indicator mobile overflow regression.",
          criticalAlerts: [],
          immediateActions: [],
          nextSteps: [],
          deadlines: [],
          rights: [],
          resources: [],
          warnings: [],
          evidenceToGather: [],
          courtPreparation: [],
          avoidActions: [],
          timeline: timeline.map((item) => ({
            ...item,
            description: `${item.stage} description`,
            timeframe: "Now",
          })),
          chargeClassifications: [
            {
              id: "fl-murder-in-the-first-degree",
              code: "782.04(1)",
              name: "Murder in the First Degree",
              classification: "felony",
            },
          ],
        },
      })}\n\n`,
    });
  });
}

async function openQAFlow(page: Page) {
  await page.goto("/case-guidance");
  await page.getByTestId("button-start-guidance").click();
  await page.getByTestId("button-choose-ai").click();
}

async function selectJurisdiction(page: Page) {
  await page.getByTestId("select-jurisdiction").click();
  await page.locator('[role="option"]').filter({ hasText: "Florida" }).click();
  await page.getByTestId("button-next-jurisdiction").click();
}

async function selectCharge(page: Page) {
  await page.locator("#charge-search").fill("murder in the first degree");
  const charge = page.getByTestId("checkbox-charge-fl-murder-in-the-first-degree");
  await charge.waitFor({ state: "visible" });
  await charge.locator("..").click();
  await page.getByTestId("button-next-case-details").click();
}

async function completeStatus(page: Page) {
  await page.getByTestId("select-case-stage").click();
  await page.locator('[role="option"]').first().click();
  await page.getByTestId("select-custody-status").click();
  await page.locator('[role="option"]').first().click();
  await page.getByTestId("select-has-attorney").click();
  await page.locator('[role="option"]').filter({ hasText: /^No$/ }).click();
  await page.getByTestId("button-continue-status").click();
  await page.getByTestId("button-continue-background").click();
  await page.locator('button:has(svg.lucide-arrow-right)').last().click();
  await page.locator('button:has(svg.lucide-arrow-right)').last().click();
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));

  expect(
    dimensions.documentScrollWidth,
    JSON.stringify(dimensions),
  ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  expect(
    dimensions.bodyScrollWidth,
    JSON.stringify(dimensions),
  ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
}

test.describe("shared progress indicator on mobile", () => {
  for (const scenario of PROGRESS_SCENARIOS) {
    test(`case guidance timeline stays within the viewport at ${scenario.name}`, async ({
      page,
    }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await mockGuidanceStream(
        page,
        scenario.completed.map((completed, index) => ({
          stage: `Timeline stage ${index + 1}`,
          completed,
        })),
      );

      await openQAFlow(page);
      await selectJurisdiction(page);
      await selectCharge(page);
      await completeStatus(page);

      const timelineSection = page.locator(
        'div[data-guidance-section="timeline"]',
      );
      await expect(timelineSection).toBeVisible();
      const progress = timelineSection.getByRole("progressbar");
      await expect(progress).toHaveAttribute(
        "aria-valuenow",
        String(scenario.percent),
      );
      const indicator = progress.locator(":scope > div");
      const expectedTranslation =
        scenario.percent === 100 ? "0" : `-${100 - scenario.percent}`;
      await expect(indicator).toHaveAttribute(
        "style",
        new RegExp(`translateX\\(${expectedTranslation}%\\)`),
      );
      await expectNoHorizontalOverflow(page);
    });
  }
});