import { expect, test } from "@playwright/test";

const PRINT_CARD_TITLES = [
  "If You Are Stopped by Police",
  "Arraignment",
  "Bail Hearing",
  "Pretrial / Discovery",
  "Plea Hearing",
  "Sentencing",
];

test.describe("quick-reference card printing", () => {
  test("print media includes every rights card without site navigation", async ({ page }) => {
    await page.goto("/quick-reference-cards");
    await expect(page.getByRole("heading", { name: "Know your rights. Be prepared." })).toBeVisible();

    await page.emulateMedia({ media: "print" });

    const printCards = page.getByTestId("printable-card");
    await expect(page.getByTestId("print-all-cards")).toBeVisible();
    await expect(printCards).toHaveCount(PRINT_CARD_TITLES.length);

    for (const [index, title] of PRINT_CARD_TITLES.entries()) {
      const card = printCards.nth(index);
      await expect(card).toBeVisible();
      await expect(card).toContainText(title);
    }

    const printState = await page.evaluate(() => {
      const visible = (selector: string) =>
        (() => {
          const element = document.querySelector(selector);
          return Boolean(
            element &&
              getComputedStyle(element).display !== "none" &&
              element.getClientRects().length > 0,
          );
        })();
      const measurableCards = Array.from(
        document.querySelectorAll<HTMLElement>('[data-testid="printable-card"]'),
      ).every((card) => {
        const { width, height } = card.getBoundingClientRect();
        return width > 0 && height > 0;
      });

      return {
        printLayoutVisible: visible("#print-all-cards"),
        headerVisible: visible("header"),
        footerVisible: visible("footer"),
        navVisible: visible("nav"),
        printButtonVisible: visible('[data-testid="button-print-all-cards"]'),
        measurableCards,
      };
    });

    expect(printState).toEqual({
      printLayoutVisible: true,
      headerVisible: false,
      footerVisible: false,
      navVisible: false,
      printButtonVisible: false,
      measurableCards: true,
    });
  });
});
for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`all six cards retain their text on screen and paper in ${language}, ${theme}`, async ({ page }, info) => {
      const { default: locale } = await import(`../../client/src/locales/${language}`);
      const copy = locale.translation.quickRef;
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      await page.goto("/quick-reference-cards");
      const reader = page.locator(".reference-reader");
      const cards = reader.locator('[role="tabpanel"] article:visible');
      await expect(cards).toHaveCount(1);
      await reader.getByRole("tab", { name: copy.tabs.court }).click();
      await expect(cards).toHaveCount(5);
      await page.emulateMedia({ media: "print" });
      await expect(cards).toHaveCount(0);
      const printed = page.getByTestId("printable-card");
      await expect(printed).toHaveCount(6);
      const names = ["police", "arraignment", "bail", "pretrial", "plea", "sentencing"];
      for (const [index, name] of names.entries()) {
        for (const text of Object.values(copy[name]) as string[]) await expect(printed.nth(index)).toContainText(text);
      }
      if (theme === "light") await page.pdf({ path: info.outputPath(`cards-${language}.pdf`), format: "Letter" });
      await page.emulateMedia({ media: "screen" });
      await page.evaluate(() => { window.print = () => { document.documentElement.dataset.printCalled = "true"; }; });
      await page.getByTestId("button-print-all-cards").click();
      await expect(page.locator("html")).toHaveAttribute("data-print-called", "true");
      await expect(cards).toHaveCount(6);
      await page.setViewportSize({ width: 320, height: 800 });
      expect(await reader.locator("article, h1, li, [role=tab], button").evaluateAll(nodes =>
        nodes.some(node => node.getBoundingClientRect().right > innerWidth + 1))).toBe(false);
      for (const [index, name] of names.entries()) {
        for (const text of Object.values(copy[name]) as string[]) await expect(cards.nth(index)).toContainText(text);
      }
    });
  }
}
