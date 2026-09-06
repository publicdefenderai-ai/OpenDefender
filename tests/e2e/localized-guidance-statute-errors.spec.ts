import { expect, test, type Page } from "@playwright/test";

const MOBILE_VIEWPORT = { width: 320, height: 812 } as const;

const LOCALIZED_ERRORS = [
  {
    code: "es",
    name: "Spanish",
    readLaw: "Leer la ley",
    hideStatuteText: "Ocultar texto del estatuto",
    fetching: "Obteniendo el estatuto de OpenLaws...",
    source: "Fuente: OpenLaws · Texto del estatuto en vivo",
    viewOnOpenLaws: "Ver en OpenLaws",
    invalidCitation:
      "No se reconoce ese formato de cita. Pruebe un formato estándar y vuelva a buscar.",
    citationNotFound:
      'No se encontró ningún estatuto para "Fla. Stat. § 782.04(1)". Intente ajustar el formato de la cita o compruebe que sea correcto.',
  },
  {
    code: "zh",
    name: "Chinese",
    readLaw: "阅读法律",
    hideStatuteText: "隐藏法规文本",
    fetching: "正在从 OpenLaws 获取法规……",
    source: "来源：OpenLaws · 实时法规文本",
    viewOnOpenLaws: "在 OpenLaws 中查看",
    invalidCitation: "无法识别该引文格式。请尝试标准格式后重新搜索。",
    citationNotFound:
      "未找到“Fla. Stat. § 782.04(1)”对应的法规。请调整引文格式或检查引文是否正确。",
  },
] as const;

async function mockGuidanceStream(page: Page) {
  const guidance = {
    overview: "Test overview for localized live statute errors.",
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
    timeline: [],
    chargeClassifications: [
      {
        id: "fl-murder-in-the-first-degree",
        code: "782.04(1)",
        name: "Murder in the First Degree",
        classification: "felony",
      },
    ],
  };

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
        sessionId: "test-session-localized-statute-errors",
        guidance,
      })}\n\n`,
    });
  });
}

async function mockCitationError(page: Page, status: 400 | 404, error: string) {
  await page.route("**/api/openlaws/citation/**", async (route) => {
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify({ success: false, error }),
    });
  });
}

async function mockVerifiedCitation(page: Page) {
  await page.route("**/api/openlaws/citation/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        statute: {
          title: "Murder in the First Degree",
          citation: "Fla. Stat. § 782.04(1)",
          content:
            "A person is guilty of murder in the first degree if the killing is premeditated.",
          jurisdiction: "FL",
          section: "782.04(1)",
          url: "https://openlaws.example/statutes/fl/782.04/1",
        },
      }),
    });
  });
}

async function mockDelayedCitation(page: Page) {
  await page.route("**/api/openlaws/citation/**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        statute: {
          title: "Murder in the First Degree",
          citation: "Fla. Stat. § 782.04(1)",
          content:
            "A person is guilty of murder in the first degree if the killing is premeditated.",
          jurisdiction: "FL",
          section: "782.04(1)",
          url: "https://openlaws.example/statutes/fl/782.04/1",
        },
      }),
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
  await page.waitForTimeout(300);
  const dimensions = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const overflowingElements = Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          testId: element.dataset.testid ?? "",
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
    dimensions.documentScrollWidth,
    JSON.stringify(dimensions),
  ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  expect(
    dimensions.bodyScrollWidth,
    JSON.stringify(dimensions),
  ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
}

async function expectReadableWithinMobileViewport(
  page: Page,
  element: ReturnType<Page["locator"]>,
) {
  const dimensions = await element.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return {
      viewportWidth: window.innerWidth,
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      scrollWidth: node.scrollWidth,
      clientWidth: node.clientWidth,
    };
  });

  expect(dimensions.left, JSON.stringify(dimensions)).toBeGreaterThanOrEqual(0);
  expect(dimensions.right, JSON.stringify(dimensions)).toBeLessThanOrEqual(
    dimensions.viewportWidth,
  );
  expect(dimensions.scrollWidth, JSON.stringify(dimensions)).toBeLessThanOrEqual(
    dimensions.clientWidth + 1,
  );
}

for (const language of LOCALIZED_ERRORS) {
  for (const errorCase of [
    {
      name: "invalid citation",
      status: 400 as const,
      error: "Invalid citation format",
      message: language.invalidCitation,
    },
    {
      name: "not-found citation",
      status: 404 as const,
      error: "Statute not found",
      message: language.citationNotFound,
    },
  ]) {
    test(
      `${language.name} ${errorCase.name} guidance remains readable on mobile`,
      async ({ page }) => {
        await page.setViewportSize(MOBILE_VIEWPORT);
        await page.addInitScript(
          (locale) => window.localStorage.setItem("i18nextLng", locale),
          language.code,
        );
        await mockGuidanceStream(page);
        await mockCitationError(page, errorCase.status, errorCase.error);

        await openQAFlow(page);
        await selectJurisdiction(page);
        await selectCharge(page);
        await completeStatus(page);

        await expect(page.getByTestId("button-close-dashboard")).toBeVisible({
          timeout: 30_000,
        });
        await expect(page.getByRole("button", { name: language.readLaw })).toBeVisible();
        await page.getByRole("button", { name: language.readLaw }).click();
        await expect(page.getByText(errorCase.message)).toBeVisible();
        await expectNoHorizontalOverflow(page);
      },
    );
  }
}

for (const language of LOCALIZED_ERRORS) {
  test(
    `${language.name} guidance opens verified live statute text on mobile`,
    async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.addInitScript(
        (locale) => window.localStorage.setItem("i18nextLng", locale),
        language.code,
      );
      await mockGuidanceStream(page);
      await mockVerifiedCitation(page);

      await openQAFlow(page);
      await selectJurisdiction(page);
      await selectCharge(page);
      await completeStatus(page);

      await expect(page.getByTestId("button-close-dashboard")).toBeVisible({
        timeout: 30_000,
      });
      const statuteToggle = page.getByTestId("live-statute-toggle");
      await expect(statuteToggle).toHaveAccessibleName(language.readLaw);
      await statuteToggle.click();
      await expect(statuteToggle).toHaveAccessibleName(language.hideStatuteText);

      const statuteCard = page
        .getByText(language.source)
        .locator("..")
        .locator("..");
      await expect(statuteCard).toContainText("Murder in the First Degree");
      await expect(statuteCard).toContainText("Fla. Stat. § 782.04(1)");
      await expect(statuteCard).toContainText(
        "A person is guilty of murder in the first degree if the killing is premeditated.",
      );
      await expect(
        statuteCard.getByRole("link", { name: language.viewOnOpenLaws }),
      ).toHaveAttribute("href", "https://openlaws.example/statutes/fl/782.04/1");
      await expectReadableWithinMobileViewport(page, statuteCard);

      await statuteToggle.click();
      await expect(statuteToggle).toHaveAccessibleName(language.readLaw);
    },
  );
}

for (const language of LOCALIZED_ERRORS) {
  test(
    `${language.name} guidance localizes the live statute loading label`,
    async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.addInitScript(
        (locale) => window.localStorage.setItem("i18nextLng", locale),
        language.code,
      );
      await mockGuidanceStream(page);
      await mockDelayedCitation(page);

      await openQAFlow(page);
      await selectJurisdiction(page);
      await selectCharge(page);
      await completeStatus(page);

      await expect(page.getByTestId("button-close-dashboard")).toBeVisible({
        timeout: 30_000,
      });
      const statuteToggle = page.getByTestId("live-statute-toggle");
      await expect(statuteToggle).toHaveAccessibleName(language.readLaw);
      await statuteToggle.click();

      const statutePanel = page.getByTestId("live-statute-panel");
      await expect(statutePanel).toContainText(language.fetching);
    },
  );
}
