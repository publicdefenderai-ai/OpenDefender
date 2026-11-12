import { expect, test } from "@playwright/test";
import published, { publishedLinks } from "../fixtures/reentry-published";

function passages(value: unknown): string[] {
  return typeof value === "string" ? [value] : Object.values(value as object).flatMap(passages);
}

for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Reentry topics and published guidance in ${language}, ${theme}`, async ({ page }, info) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/support/reentry");
      const content = page.locator(".reentry-page");
      const topics = content.locator(".reentry-topic");
      await expect(topics).toHaveCount(5);
      await expect(content.locator(".reentry-topic[open]")).toHaveCount(1);
      await expect(topics.first()).toHaveJSProperty("open", true);
      await content.locator('nav a[href="#reentry-topics"]').click();
      await expect(topics.first()).toBeInViewport();
      for (const topic of (await topics.all()).slice(1)) {
        await topic.locator("summary").focus();
        await page.keyboard.press("Enter");
        await expect(topic).toHaveJSProperty("open", true);
      }
      for (const href of publishedLinks) {
        await expect(content.locator(`a[href="${href}"]`).first()).toBeVisible();
      }
      const data = published[language];
      for (const text of passages([data.overview, data.actions, data.resources, data.topics])) {
        await expect(content).toContainText(text);
      }
      for (const faq of Object.values(data.faq)) {
        await content.getByRole("button", { name: faq.question }).click();
        await expect(content).toContainText(faq.answer);
      }
      await expect(content.getByTestId("nrrc-resources").getByRole("link")).toHaveCount(3);
      const art = content.locator(".reentry-hero img");
      await expect.poll(() => art.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 900 });
        const overflow = await content.locator("h1,h2,p,summary,li,button,a").evaluateAll(nodes =>
          nodes.filter(node => {
            const r = node.getBoundingClientRect();
            return r.width && (r.left < -1 || r.right > innerWidth + 1);
          }).map(node => node.textContent)
        );
        expect(overflow).toEqual([]);
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: info.outputPath(`reentry-${width}.png`) });
      }
    });
  }
}
