import { expect, test } from "@playwright/test";
import en from "../../client/src/locales/en";
import es from "../../client/src/locales/es";
import zh from "../../client/src/locales/zh";
import { getExpungementByState } from "../../shared/expungement-data";

const scenarios = [
  { state: "CA", type: "arrest", sentence: "complete", result: "A" },
  { state: "AK", type: "arrest", sentence: "complete", result: "B" },
  { state: "AK", type: "misdemeanor", sentence: "probation", result: "C" },
  { state: "AK", type: "felony", sentence: "complete", result: "D" },
] as const;

for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Clearance answers and results in ${language}, ${theme}`, async ({ page }, info) => {
      const copy = { en, es, zh }[language].translation.screener;
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: theme === "light" ? 1280 : 320, height: 900 });
      await page.goto("/support/reputation/eligibility?state=invalid");
      const main = page.locator(".clearance-page");
      const next = main.getByRole("button", { name: copy.next, exact: true });
      const back = main.getByRole("button", { name: copy.back, exact: true });
      const state = main.getByRole("combobox");
      await expect(state.locator("option")).toHaveCount(52);
      await expect(next).toBeDisabled();
      for (const scenario of scenarios) {
        await state.selectOption(scenario.state);
        await next.click();
        const record = main.getByRole("radio", { name: copy.step2.options[scenario.type], exact: true });
        await expect(main.getByRole("heading", { name: copy.step2.question })).toBeFocused();
        await expect(main.getByRole("radio")).toHaveCount(4);
        await record.focus();
        await page.keyboard.press("Space");
        await expect(record).toBeChecked();
        if (scenario.result === "A") {
          await page.screenshot({ path: info.outputPath("record-options.png") });
          await back.click();
          await expect(state).toHaveValue(scenario.state);
          await next.click();
          await expect(record).toBeChecked();
        }
        await next.click();
        await expect(main.getByRole("radio")).toHaveCount(4);
        await main.getByRole("radio", { name: copy.step3.options.gt7 }).check();
        await next.click();
        await expect(main.getByRole("radio")).toHaveCount(3);
        await main.getByRole("radio", { name: copy.step4.options[scenario.sentence] }).check();
        await main.getByRole("button", { name: copy.seeResult }).click();
        await expect(main.getByRole("heading", { name: copy.results[scenario.result].title })).toBeFocused();
        await expect(main).toContainText(copy.results[scenario.result].message);
        const rule = getExpungementByState(scenario.state)!;
        await expect(main).toContainText(rule.overview);
        for (const source of rule.sources) await expect(main).toContainText(source);
        await expect(main).toContainText(copy.disclaimer);
        expect(await main.locator("a,h2,p,button,span").evaluateAll(nodes => nodes.filter(node => {
          const rect = node.getBoundingClientRect();
          return rect.width && (rect.left < -1 || rect.right > innerWidth + 1);
        }).map(node => node.textContent))).toEqual([]);
        await back.click();
        await expect(main.getByRole("radio", { checked: true })).toHaveValue(scenario.sentence);
        await main.getByRole("button", { name: copy.seeResult }).click();
        await main.getByRole("button", { name: copy.startOver }).click();
        await expect(state).toHaveValue("");
        await expect(next).toBeDisabled();
      }
      await page.goto("/support/reputation/eligibility?state=ca");
      await expect(main.getByRole("heading", { name: copy.step2.question })).toBeVisible();
      await back.click();
      await expect(state).toHaveValue("CA");
    });
  }
}
