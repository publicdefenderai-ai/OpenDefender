import { expect, test } from "@playwright/test";
import published from "../fixtures/family-care-published";

for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Family care guidance and caregiver handoffs in ${language}, ${theme}`, async ({ page }, info) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
        window.print = () => {};
        Object.defineProperty(navigator, "clipboard", {
          value: { writeText: async (value: string) => { document.documentElement.dataset.clipboard = value; } },
        });
      }, { language, theme });

      await page.setViewportSize({ width: 1280, height: 1000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/support/family-care");
      const main = page.locator(".family-care-page");
      const messages = main.locator("#family-care-comms");
      const baseline = published[language];
      const guidance = baseline.familyCare;
      const copy = guidance.commsSection;

      for (const faq of Object.values(guidance.faq)) {
        const question = main.getByRole("button", { name: faq.question });
        await question.focus();
        await page.keyboard.press("Enter");
        await expect(main).toContainText(faq.answer);
      }
      for (const url of baseline.links) {
        await expect(main.locator(`a[href="${url}"]`).first()).toBeVisible();
      }

      let observed = await main.innerText();
      const letters = [copy.emailTemplates.primaryHelper, copy.emailTemplates.secondaryHelper, copy.emailTemplates.provider];
      for (const letter of letters) {
        const group = messages.getByRole("group", { name: letter.label });
        await expect(group.locator("pre")).toHaveText(letter.body);
        await group.getByRole("button", { name: copy.copyButton, exact: true }).click();
        const expected = letter.subject ? `${letter.subject}\n\n${letter.body}` : letter.body;
        await expect.poll(() => page.evaluate(() => document.documentElement.dataset.clipboard)).toBe(expected);
        observed += "\n" + await main.innerText();
        const opened = page.waitForEvent("popup");
        await group.getByRole("button", { name: copy.printButton, exact: true }).click();
        const print = await opened;
        await expect(print.locator("h1")).toHaveText(letter.label);
        await expect(print.locator(".body")).toHaveText(letter.body);
        await expect(print.locator(".note")).toHaveText(copy.personalizeNote);
        await print.close();
      }
      await messages.getByRole("tab", { name: copy.callScripts.title }).click();
      for (const script of [copy.callScripts.family, copy.callScripts.aaa]) {
        const toggle = messages.getByRole("button", { name: script.label });
        await toggle.click();
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await expect(messages.locator("pre")).toHaveText(script.script);
        await messages.getByRole("button", { name: copy.copyButton, exact: true }).click();
        await expect.poll(() => page.evaluate(() => document.documentElement.dataset.clipboard)).toBe(script.script);
        observed += "\n" + await main.innerText();
      }
      const normalized = observed.replace(/\s+/g, " ");
      for (const text of [...baseline.strings, ...baseline.literal]) {
        expect(normalized).toContain(text.replace(/\s+/g, " "));
      }

      await page.evaluate(() => document.fonts.ready);
      const art = main.locator(".family-care-hero img");
      await expect.poll(() => art.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(560);
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 900 });
        await main.locator('.family-care-paths a[href="#family-care-comms"]').click();
        await expect(messages).toBeInViewport();
        const clipped = await main.locator("h1,h2,p,pre,a,button").evaluateAll(nodes => nodes.filter(node => {
          const bounds = node.getBoundingClientRect();
          return bounds.width && (bounds.left < -1 || bounds.right > innerWidth + 1);
        }).map(node => node.textContent));
        expect(clipped).toEqual([]);
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: info.outputPath(`family-care-${width}.png`) });
      }
    });
  }
}
