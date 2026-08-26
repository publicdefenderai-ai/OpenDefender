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
    await expect(page.getByRole("heading", { name: "Quick-Reference Cards" })).toBeVisible();

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