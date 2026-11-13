import { expect, test } from "@playwright/test";
import en from "../../client/src/locales/en";
import es from "../../client/src/locales/es";
import zh from "../../client/src/locales/zh";

for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Bail preparation content, drafts and printing in ${language}, ${theme}`, async ({ page }, info) => {
      const copy = { en, es, zh }[language].translation.bailPrep;
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
        Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => document.body.dataset.copied = text } });
        window.print = () => { document.body.dataset.printed = "true"; };
      }, { language, theme });
      await page.goto("/support/court-logistics/bail-preparation");
      const screen = page.locator(".bail-prep-screen");
      const print = page.locator(".bail-prep-print");
      await expect(screen.getByRole("heading", { level: 1 })).toHaveText(copy.heroTitle);
      for (const text of [copy.heroSubtitle, ...Object.values(copy.overview), ...Object.values(copy.whatJudgesConsider.factors).flatMap(Object.values)]) {
        await expect(screen).toContainText(text);
      }
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await screen.locator("p,dt,dd,input,label,select,textarea,h1,h2,a,button").evaluateAll(nodes =>
          nodes.every(node => { const r = node.getBoundingClientRect(); return !r.width || (r.left >= -1 && r.right <= innerWidth + 1); })
        )).toBe(true);
      }
      await screen.getByRole("link", { name: copy.design.start }).click();
      await expect(screen.locator("#documentation h2")).toBeInViewport();
      const checks = screen.getByRole("checkbox");
      await expect(checks).toHaveCount(16);
      await checks.first().focus();
      await page.keyboard.press("Space");
      await screen.getByRole("button", { name: copy.printChecklist.button }).click();
      await page.emulateMedia({ media: "print" });
      await expect(print).toBeVisible();
      await expect(screen).toBeHidden();
      await expect(print.locator("li").first()).toContainText("☑");
      for (const group of ["employment", "housing", "communityTies", "supportNetwork"] as const) {
        for (const item of copy.documentation[group].items) await expect(print).toContainText(item);
      }
      await expect(print).toContainText(copy.printChecklist.disclaimer);
      const pdf = await page.pdf({ format: "Letter", margin: { top: "0.5in", bottom: "0.5in", left: "0.5in", right: "0.5in" } });
      expect(pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)).toHaveLength(1);
      await info.attach("Checklist", { body: pdf, contentType: "application/pdf" });
      await page.emulateMedia({ media: "screen" });
      for (const key of ["employer", "character", "family"] as const) {
        await screen.getByRole("combobox").selectOption(key);
        const editor = screen.getByRole("textbox", { name: copy.templates[key].label });
        await expect(editor).toHaveValue(copy.templates[key].body);
        const draft = "<example>\n" + copy.templates[key].label;
        await editor.fill(draft);
        await screen.getByRole("button", { name: copy.templates.copyButton, exact: true }).click();
        await expect(page.locator("body")).toHaveAttribute("data-copied", draft);
        await screen.getByRole("button", { name: copy.templates.printButton, exact: true }).click();
        await page.emulateMedia({ media: "print" });
        await expect(print.locator("h1")).toHaveText(copy.templates[key].label);
        await expect(print.locator(".bail-prep-letter")).toHaveText(draft);
        await expect(print).toContainText(copy.templates.printNote);
        await page.emulateMedia({ media: "screen" });
      }
      await screen.getByRole("combobox").selectOption("employer");
      await expect(screen.getByRole("textbox")).toHaveValue("<example>\n" + copy.templates.employer.label);
      for (const release of Object.values(copy.releaseTypes.types)) {
        await screen.getByText(release.title, { exact: true }).click();
        await expect(screen.getByText(release.body, { exact: true })).toBeVisible();
      }
      for (const help of Object.values(copy.bailHelp.resources)) await expect(screen).toContainText(help.description);
      for (const href of ["/first-24-hours", "/support/court-logistics", "/friends-family", "/legal-aid", "https://bailproject.org", "https://www.communityjusticeexchange.org/en/nbfn-directory"]) {
        await expect(screen.locator(`a[href="${href}"]`).first()).toBeVisible();
      }
      await page.reload();
      await expect(checks.first()).not.toBeChecked();
      await expect(screen.getByRole("textbox")).toHaveValue(copy.templates.employer.body);
    });
  }
}
