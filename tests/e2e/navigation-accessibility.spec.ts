import { expect, test, type Page } from "@playwright/test";

const MOBILE_LANGUAGES = ["en", "es", "zh"] as const;
const PHONE_VIEWPORTS = [
  { width: 390, height: 844, name: "portrait" },
  { width: 667, height: 375, name: "narrow landscape" },
] as const;

async function expectNoHorizontalOverflow(page: Page, width: number) {
  // Let route transition animations finish before measuring transformed bounds.
  await page.waitForTimeout(500);
  const dimensions = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const overflowing = Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { tag: element.tagName, className: element.className, right: Math.round(rect.right), left: Math.round(rect.left) };
      })
      .filter(({ right, left }) => right > viewportWidth + 1 || left < -1)
      .sort((a, b) => b.right - a.right)
      .slice(0, 3);

    return {
      bodyWidth: document.body.scrollWidth,
      documentWidth: document.documentElement.clientWidth,
      viewportWidth,
      overflowing,
    };
  });
  expect(dimensions.bodyWidth, `${page.url()} overflow details: ${JSON.stringify(dimensions.overflowing)}`).toBeLessThanOrEqual(width);
  expect(dimensions.bodyWidth).toBeLessThanOrEqual(dimensions.documentWidth);
}

test.describe("intent navigation and accessibility", () => {
  test("home path cards have no nested interactive controls", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /where do you want to start/i })).toBeVisible();

    const nestedInteractive = page.locator(
      '#paths a a, #paths a button, #paths button a, #paths button button, #paths [role="link"] a, #paths [role="link"] button'
    );
    await expect(nestedInteractive).toHaveCount(0);

    const startLink = page.getByRole("link", { name: "Start Here" });
    await startLink.focus();
    await expect(startLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/first-24-hours$/);
  });

  test("mobile navigation exposes the shared urgent-help paths", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "First 24 Hours" })).toHaveAttribute("href", "/first-24-hours");
    await expect(mobileNav.getByRole("link", { name: "Case Roadmap" })).toHaveAttribute("href", "/case-guidance");
    await expect(mobileNav.getByRole("link", { name: "Understand a case stage" })).toHaveAttribute("href", "/case-timeline");
    await expect(mobileNav.getByRole("link", { name: "Legal help" })).toHaveAttribute("href", "/legal-aid");
  });

  test("mobile navigation keeps full accessible names while fitting compact labels", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
    const stageLink = mobileNav.getByRole("link", { name: "Understand a case stage" });

    await expect(stageLink).toBeVisible();
    await expect(stageLink.locator("span").last()).toHaveText("Case stage");
    await expect(stageLink).toHaveAttribute("aria-label", "Understand a case stage");

    const navBox = await mobileNav.boundingBox();
    const viewport = page.viewportSize();
    expect(navBox).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(navBox!.x).toBeGreaterThanOrEqual(0);
    expect(navBox!.x + navBox!.width).toBeLessThanOrEqual(viewport!.width);
  });

  test("mobile page reserves space for the fixed navigation", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const main = page.locator("#main-content");
    await expect(main).toHaveClass(/mobile-nav-page-offset/);
    const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
    const launcher = page.locator('[data-testid="chat-launcher"]');
    await expect(launcher).toHaveCount(1);
    await expect(mobileNav).toHaveCSS("position", "fixed");

    const viewport = page.viewportSize();
    const navBox = await mobileNav.boundingBox();
    const launcherBox = await launcher.boundingBox();
    expect(viewport).not.toBeNull();
    expect(navBox).not.toBeNull();
    expect(launcherBox).not.toBeNull();
    expect(navBox!.y + navBox!.height).toBeCloseTo(viewport!.height, 0);
    expect(launcherBox!.y + launcherBox!.height).toBeLessThan(navBox!.y);
  });

  test("mobile chat initializes its welcome prompt without update-loop errors", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto("/chat");

    const log = page.getByRole("log", { name: "Chat messages" });
    await expect(log).toContainText("I'm an AI assistant");
    await expect(page.getByRole("button", { name: "Yes, I need help right now" })).toBeVisible();
    await expect(page.getByRole("button", { name: "No, I have time to talk" })).toBeVisible();

    const viewport = page.viewportSize();
    const dimensions = await page.evaluate(() => ({
      bodyWidth: document.body.scrollWidth,
      documentWidth: document.documentElement.clientWidth,
    }));
    expect(viewport).not.toBeNull();
    expect(dimensions.bodyWidth).toBeLessThanOrEqual(viewport!.width);
    expect(dimensions.bodyWidth).toBe(dimensions.documentWidth);
    expect(consoleErrors.some((message) => message.includes("Maximum update depth exceeded"))).toBe(false);
  });

  test("desktop chat launcher keeps its established bottom offset", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const launcher = page.locator('[data-testid="chat-launcher"]');
    await expect(launcher).toBeVisible();
    await expect(launcher).toHaveCSS("bottom", "24px");
  });

  test("site search uses combobox and listbox keyboard semantics", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search site" }).click();

    const combobox = page.getByRole("combobox", { name: "Search" });
    await expect(combobox).toHaveAttribute("aria-autocomplete", "list");
    await expect(combobox).toHaveAttribute("aria-controls", "search-results");
    await combobox.fill("how accurate");

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible({ timeout: 15_000 });
    const sourceOption = listbox.getByRole("option").filter({ hasText: "Data Sources" }).first();
    await expect(sourceOption).toBeVisible();

    await combobox.press("ArrowDown");
    await expect(combobox).toHaveAttribute("aria-activedescendant", /search-result-\d+/);
    await expect(combobox).toBeFocused();
  });

  test("release search keeps withheld authority charges out of results", async ({ page }) => {
    test.skip(!process.env.RELEASE_CHECK_PORT, "Release-only authority eligibility regression");

    const withheldResponse = await page.request.get(
      "/api/site-search?q=minor&types=charge&limit=50",
    );
    expect(withheldResponse.ok()).toBe(true);
    const withheldPayload = await withheldResponse.json();
    expect(
      withheldPayload.results.some(
        (result: { document?: { id?: string } }) =>
          result.document?.id === "charge-ny-minor-in-possession",
      ),
    ).toBe(false);

    const retainedResponse = await page.request.get(
      "/api/site-search?q=grand%20larceny&types=charge&limit=50",
    );
    expect(retainedResponse.ok()).toBe(true);
    const retainedPayload = await retainedResponse.json();
    expect(
      retainedPayload.results.some(
        (result: { document?: { id?: string } }) =>
          result.document?.id === "charge-ny-grand-theft-in-the-first-degree",
      ),
    ).toBe(true);
  });

  test("mobile resource tools render their initial states without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });

    await page.goto("/legal-glossary");
    await expect(page.getByRole("heading", { name: "Legal Glossary" })).toBeVisible();
    await expect(page.getByPlaceholder(/search legal terms/i)).toBeVisible();

    await page.goto("/document-summarizer");
    await expect(page.getByRole("heading", { name: "Document Summarizer" }).first()).toBeVisible();
    await expect(page.getByRole("checkbox")).toBeVisible();
    await expect(page.getByRole("button", { name: /continue/i })).toBeDisabled();

    const dimensions = await page.evaluate(() => ({
      bodyWidth: document.body.scrollWidth,
      documentWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.bodyWidth).toBeLessThanOrEqual(360);
    expect(dimensions.bodyWidth).toBe(dimensions.documentWidth);
  });

  test("mobile legal-help ZIP dialogs stack controls and validate short ZIPs locally", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/legal-aid");

    await page.getByTestId("card-public-defender").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByTestId("card-public-defender")).toBeFocused();
    await page.getByTestId("card-public-defender").click();
    await expect(dialog).toBeVisible();

    const zipInput = page.getByTestId("input-pd-zip-code-resources");
    await zipInput.fill("12");
    await page.getByTestId("button-search-pd-resources").click();
    await expect(dialog).toContainText(/five digit|5-digit|zip/i);

    await expectNoHorizontalOverflow(page, 360);
  });

  test("mobile release matrix covers supported languages and both phone orientations", async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto("/");

    const layoutRoutes = [
      "/legal-glossary",
      "/document-summarizer",
      "/immigration-guidance",
      "/statutes",
      "/support/reputation/eligibility",
    ];

    for (const language of MOBILE_LANGUAGES) {
      await page.evaluate((lng) => localStorage.setItem("i18nextLng", lng), language);
      await page.setViewportSize(PHONE_VIEWPORTS[0]);

      for (const route of layoutRoutes) {
        await page.goto(route);
        await expect(page.locator("main h1").first()).toBeVisible({ timeout: 15_000 });
        await expectNoHorizontalOverflow(page, PHONE_VIEWPORTS[0].width);
      }
    }

    await page.evaluate(() => localStorage.setItem("i18nextLng", "en"));
    for (const viewport of PHONE_VIEWPORTS) {
      await page.setViewportSize(viewport);
      for (const route of layoutRoutes) {
        await page.goto(route);
        await expect(page.locator("main h1").first()).toBeVisible({ timeout: 15_000 });
        await expectNoHorizontalOverflow(page, viewport.width);
      }
    }
  });

  test("record-clearance screener keeps incomplete, progressing, result, and reset states usable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/support/reputation/eligibility");

    const next = page.getByRole("button", { name: "Next" });
    await expect(next).toBeDisabled();
    await page.locator("select").selectOption("CA");
    await expect(next).toBeEnabled();
    await next.click();

    await page.getByRole("button", { name: "Misdemeanor conviction" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "More than 7 years ago" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Yes, everything is complete" }).click();
    await page.getByRole("button", { name: "See My Result" }).click();

    await expect(page.getByText(/may be eligible|may apply|not eligible/i).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Start Over" })).toBeVisible();
    await page.getByRole("button", { name: "Start Over" }).click();
    await expect(page.getByRole("button", { name: "Next" })).toBeDisabled();
    await expectNoHorizontalOverflow(page, 390);
  });
});