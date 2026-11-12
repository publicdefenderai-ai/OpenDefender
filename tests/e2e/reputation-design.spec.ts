import { expect, test } from "@playwright/test";
import published, { publishedLinks } from "../fixtures/reputation-published";

function fragments(value: unknown): string[] {
  return typeof value === "string" ? [value] : Object.values(value as object).flatMap(fragments);
}

for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Reputation guidance and letters in ${language}, ${theme}`, async ({ page }, info) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
        window.print = () => {};
        Object.defineProperty(navigator, "clipboard", {
          value: { writeText: async (text: string) => { document.documentElement.dataset.clipboard = text; } },
        });
      }, { language, theme });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/support/reputation#clean-slate");
      const main = page.locator(".reputation-page");
      await expect(main.locator("#clean-slate")).toBeInViewport();
      const data = published[language];
      const copy = data.commsSection;
      for (const [id, guidance] of [
        ["clean-slate", data.cleanSlate], ["fcra-rights", data.fcraRights],
        ["rap-sheet", data.rapSheet], ["certificates-of-relief", data.certificatesOfRelief],
      ] as const) {
        const section = main.locator(`#${id}`);
        await main.locator(`nav a[href="#${id}"]`).click();
        await expect(section).toBeInViewport();
        for (const summary of await section.locator("summary").all()) {
          await summary.focus();
          await page.keyboard.press("Enter");
        }
        for (const text of fragments(guidance)) await expect(section).toContainText(text);
      }
      for (const href of publishedLinks) {
        await expect(main.locator(`a[href="${href}"]`).first()).toBeVisible();
      }
      for (const resource of Object.values(data.resources)) await expect(main).toContainText(resource.description);
      for (const tip of Object.values(data.tips)) await expect(main).toContainText(tip);
      for (const faq of Object.values(data.faq)) {
        await main.getByRole("button", { name: faq.question }).click();
        await expect(main).toContainText(faq.answer);
      }
      for (const action of Object.values(data.actions)) await expect(main).toContainText(action.description);
      const messages = main.locator("#reputation-comms");
      const choice = messages.getByRole("combobox");
      for (const key of ["closeFriend", "professional", "mugshot"] as const) {
        const letter = copy.emailTemplates[key];
        await choice.selectOption(key);
        const body = messages.getByRole("textbox");
        await expect(body).toHaveValue(letter.body);
        const edited = letter.body + "\n<draft>";
        await body.fill(edited);
        await messages.getByRole("button", { name: copy.copyButton }).click();
        await expect.poll(() => page.evaluate(() => document.documentElement.dataset.clipboard)).toBe(letter.subject + "\n\n" + edited);
        const popup = page.waitForEvent("popup");
        await messages.getByRole("button", { name: copy.printButton }).click();
        const print = await popup;
        await expect(print.locator(".subject")).toHaveText(letter.subject);
        await expect(print.locator(".body")).toHaveText(edited);
        await expect(print.locator("draft")).toHaveCount(0);
        await print.close();
      }
      await choice.selectOption("closeFriend");
      await expect(messages.getByRole("textbox")).toHaveValue(copy.emailTemplates.closeFriend.body + "\n<draft>");
      await messages.getByRole("tab", { name: copy.callScripts.title }).click();
      for (const script of [copy.callScripts.unexpected, copy.callScripts.interview]) {
        await messages.getByRole("button", { name: script.label }).click();
        await expect(messages.locator("pre")).toHaveText(script.script);
      }
      const art = main.locator(".reputation-hero img");
      await expect.poll(() => art.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await main.locator("h1,h2,p,summary,a,button,pre").evaluateAll(nodes => nodes.filter(node => {
          const rect = node.getBoundingClientRect();
          return rect.width && (rect.left < -1 || rect.right > innerWidth + 1);
        }).map(node => node.textContent))).toEqual([]);
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: info.outputPath(`reputation-${width}.png`) });
      }
    });
  }
}
