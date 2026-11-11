import { expect, test } from "@playwright/test";
import published from "../fixtures/personal-health-published";

for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Personal Health planning and printable messages in ${language}, ${theme}`, async ({ page }, info) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
        window.print = () => {};
        Object.defineProperty(navigator, "clipboard", {
          value: { writeText: async (text: string) => { document.documentElement.dataset.copied = text; } },
        });
      }, { language, theme });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/support/personal-health");
      const main = page.locator(".personal-health-page");
      const data = published[language];
      const treatment = data.treatmentConnection;
      for (const action of Object.values(data.actions)) {
        await expect(main).toContainText(action.title);
        await expect(main).toContainText(action.description);
      }
      for (const step of [data.medicationSection.step1, data.medicationSection.step2, data.medicationSection.step3]) {
        await expect(main).toContainText(step.title);
        await expect(main).toContainText(step.body);
      }
      for (const resource of Object.values(data.resources)) await expect(main).toContainText(resource.description);
      for (const faq of Object.values(data.faq)) {
        await main.getByRole("button", { name: faq.question }).click();
        await expect(main).toContainText(faq.answer);
      }
      const boxes = main.getByRole("checkbox");
      await expect(boxes).toHaveCount(treatment.checklistItems.length);
      await boxes.first().check();
      await main.locator('a[href="#health-messages"]').click();
      const select = main.locator("#health-template");
      const field = main.locator("#health-message");
      const messages = [
        [treatment.scriptTitle, treatment.scriptBody],
        [treatment.letterLabel, treatment.letterBody],
        [treatment.attorneyLabel, treatment.attorneyBody],
      ];
      for (const [index, [label, body]] of messages.entries()) {
        await select.selectOption(String(index));
        await expect(field).toHaveValue(body);
        const edited = body + "\n\n<personal note>";
        await field.fill(edited);
        await main.getByRole("button", { name: treatment.copyButton, exact: true }).click();
        await expect.poll(() => page.evaluate(() => document.documentElement.dataset.copied)).toBe(edited);
        const opening = page.waitForEvent("popup");
        await main.getByRole("button", { name: treatment.printButton, exact: true }).click();
        const popup = await opening;
        await expect(popup.locator("h1")).toHaveText(label);
        expect(await popup.locator("p").textContent()).toBe(edited);
        await popup.close();
      }
      await select.selectOption("0");
      await expect(field).toHaveValue(messages[0][1] + "\n\n<personal note>");
      await expect(boxes.first()).toBeChecked();
      const art = main.locator(".personal-health-hero img");
      await expect.poll(() => art.evaluate((img: HTMLImageElement) => img.naturalWidth > 0)).toBe(true);
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(() => window.scrollTo(0, 0));
        const clipped = await main.locator("h1,h2,p,select,textarea,label,button,a").evaluateAll(nodes => nodes.filter(node => {
          const bounds = node.getBoundingClientRect();
          return bounds.width && (bounds.left < -1 || bounds.right > innerWidth + 1);
        }).map(node => node.textContent));
        expect(clipped).toEqual([]);
        await page.screenshot({ path: info.outputPath(`personal-health-${width}.png`) });
      }
    });
  }
}
