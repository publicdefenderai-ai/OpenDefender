import { test, expect } from "@playwright/test";
import published from "../fixtures/mental-health-published";

for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Mental Health support and treatment messages in ${language}, ${theme}`, async ({ page }, info) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
        window.print = () => {};
        Object.defineProperty(navigator, "clipboard", {
          value: {writeText: async (text: string) => { document.documentElement.dataset.copied = text; }},
        });
      }, {language, theme});
      await page.setViewportSize({width: 1280, height: 900});
      await page.emulateMedia({reducedMotion: "reduce"});
      await page.goto("/support/mental-health");
      const main = page.locator(".mental-health-page");
      const crisis = main.locator("#crisis-support");
      await expect(crisis).toBeVisible();
      await expect(crisis.locator('a[href="sms:988"]')).toBeVisible();
      if (language === "es") {
        const note = crisis.getByText(/llame al 988 y presione 2/);
        await expect(note).toContainText("envíe AYUDA al 988");
        await expect(note).toContainText("seleccione «Español»");
      }
      if (language === "zh") {
        await expect(crisis.getByText(/如需中文口译，请拨打 988/)).toContainText("仅提供英语和西班牙语支持");
      }
      expect(await crisis.evaluate(el =>
        Boolean(el.compareDocumentPosition(document.getElementById("section-start-here")!) & Node.DOCUMENT_POSITION_FOLLOWING)
      )).toBe(true);

      const baseline = published.translations[language];
      for (const faq of Object.values(baseline.faq)) {
        const button = main.getByRole("button", {name: faq.question});
        await button.focus();
        await page.keyboard.press("Enter");
        await expect(main).toContainText(faq.answer);
      }
      for (const text of baseline.texts) await expect(main).toContainText(text);
      for (const link of published.links) await expect(main.locator(`a[href="${link}"]`).first()).toBeVisible();

      const tools = baseline.tools;
      for (const [label, body] of [[tools.letterLabel, tools.letterBody], [tools.attorneyLabel, tools.attorneyBody]]) {
        const group = main.getByRole("group", {name: label, exact: true});
        await group.getByRole("button", {name: tools.copyButton}).click();
        await expect.poll(() => page.evaluate(() => document.documentElement.dataset.copied)).toBe(body);
        const opened = page.waitForEvent("popup");
        await group.getByRole("button", {name: tools.printButton}).click();
        const printed = await opened;
        await expect(printed.locator("h1")).toHaveText(label);
        await expect(printed.locator("p")).toHaveText(body);
        await printed.close();
      }
      const art = main.locator(".mental-health-hero img");
      await expect.poll(() => art.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      for (const width of [1280, 320]) {
        await page.setViewportSize({width, height: 900});
        await main.locator('.mental-health-paths a[href="#treatment-connection"]').click();
        await expect(main.locator("#treatment-connection")).toBeInViewport();
        const clipped = await main.locator("p,h1,h2,button,a,pre").evaluateAll(nodes => nodes.filter(node => {
          const rect = node.getBoundingClientRect();
          return rect.width && (rect.left < -1 || rect.right > innerWidth + 1);
        }).map(node => node.textContent));
        expect(clipped).toEqual([]);
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({path: info.outputPath(`mental-health-${width}.png`)});
      }
    });
  }
}
