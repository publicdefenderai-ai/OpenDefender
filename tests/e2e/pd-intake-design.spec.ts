import { expect, test } from "@playwright/test";
import en from "../../client/src/locales/en";
import es from "../../client/src/locales/es";
import zh from "../../client/src/locales/zh";

for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Paper intake form in ${language}, ${theme}`, async ({ page }, info) => {
      const copy = { en, es, zh }[language].translation.pdIntakeForm;
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      await page.goto("/support/court-logistics/intake-form");
      const form = page.locator(".pd-intake-page");
      await expect(form.getByRole("heading", { level: 1 })).toHaveText(copy.title);
      await expect(form).toContainText(copy.privacyNote);
      await expect(form.locator("input, textarea, form, select, [contenteditable=true]")).toHaveCount(0);
      const print = form.getByRole("button", { name: copy.printButton });
      await page.evaluate(() => { window.print = () => document.body.setAttribute("data-print-called", "true"); });
      await print.click();
      await expect(page.locator("body")).toHaveAttribute("data-print-called", "true");
      await page.setViewportSize({ width: 320, height: 820 });
      await form.locator("summary").focus();
      await page.keyboard.press("Enter");
      for (const [id, section] of Object.entries(copy.sections)) {
        const target = form.locator("#intake-" + id);
        await form.locator('a[href="#intake-' + id + '"]').click();
        await expect(target.locator("h2")).toBeInViewport();
        for (const text of Object.values(section)) await expect(target).toContainText(text);
      }
      expect(await form.locator("h2,li,p,a").evaluateAll(nodes => nodes.every(node => {
        const rect = node.getBoundingClientRect();
        return !rect.width || (rect.left >= -1 && rect.right <= innerWidth + 1);
      }))).toBe(true);
      await page.emulateMedia({ media: "print" });
      await expect(print).toBeHidden();
      await expect(form.locator("details")).toBeHidden();
      await expect(form.locator("article")).toHaveCount(4);
      for (const option of Object.values(copy.options)) await expect(form.getByText(option, { exact: true }).first()).toBeVisible();
      await expect(form.locator("article").last()).toContainText(copy.formFooter);
      for (const format of ["Letter", "A4"] as const) {
        const path = info.outputPath(format + ".pdf");
        const pdf = await page.pdf({ path, format, margin: { top: "0.5in", bottom: "0.5in", left: "0.5in", right: "0.5in" } });
        expect(pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)).toHaveLength(4);
        await info.attach(format, { path, contentType: "application/pdf" });
      }
    });
  }
}
