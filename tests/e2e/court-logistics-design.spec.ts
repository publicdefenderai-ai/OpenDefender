import { expect, test } from "@playwright/test";
import en from "../../client/src/locales/en";
import es from "../../client/src/locales/es";
import zh from "../../client/src/locales/zh";
import { courtLogisticsDesignCopy } from "../../client/src/locales/court-logistics-design";

function passages(value: unknown): string[] {
  return typeof value === "string" ? [value] : Object.values(value as object).flatMap(passages);
}

for (const language of ["en", "es", "zh"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Court Logistics content and paths in ${language}, ${theme}`, async ({ page }, info) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("public-defender-theme", theme);
      }, { language, theme });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/support/court-logistics");
      const main = page.locator(".court-logistics-page");
      const content = { en, es, zh }[language].translation.support.courtLogistics;
      const copy = courtLogisticsDesignCopy[language];
      await expect(main.getByRole("heading", { level: 1 })).toContainText(copy.title);
      await expect(main).toContainText(content.overview);
      const paths = main.getByRole("navigation", { name: copy.guides });
      for (const [name, path] of [[copy.date, "court-date-guide"], [copy.bail, "bail-preparation"], [copy.intake, "intake-form"]]) {
        const link = paths.getByRole("link", { name: new RegExp(name) });
        await expect(link).toHaveAttribute("href", "/support/court-logistics/" + path);
        await link.click();
        await expect(page).toHaveURL(new RegExp(path + "$"));
        await page.goBack();
      }
      await expect(main.locator('a[href="/court-locator"]').first()).toBeVisible();
      for (const action of Object.values(content.actions)) await expect(main).toContainText(action.description);
      for (const passage of [copy.intakeActionNote, copy.bailActionNote, copy.pfj, copy.intakeDetail]) {
        await expect(main).toContainText(passage);
      }
      const reminders = main.locator("#court-reminders");
      await main.locator('nav a[href="#court-reminders"]').click();
      await expect(reminders).toBeInViewport();
      await reminders.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(reminders.getByText(content.reminders.researchNote)).toBeVisible();
      await expect(reminders.getByRole("link", { name: content.reminders.bailProject.name })).toHaveAttribute("href", content.reminders.bailProject.url);
      for (const item of content.reminders.selfHelpItems) await expect(reminders).toContainText(item);
      const requirements = main.locator("#court-requirements");
      for (const section of [content.requirements.courtOrdered, content.requirements.communityService, content.requirements.propertyRetrieval, content.requirements.idReplacement]) {
        const toggle = requirements.getByRole("button", { name: section.title });
        await toggle.focus();
        await page.keyboard.press("Enter");
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        for (const passage of passages(section)) await expect(requirements).toContainText(passage);
      }
      for (const faq of Object.values(content.faq)) {
        await main.getByRole("button", { name: faq.question }).click();
        await expect(main).toContainText(faq.answer);
      }
      for (const resource of Object.values(content.resources)) await expect(main).toContainText(resource.description);
      for (const tip of Object.values(content.tips)) await expect(main).toContainText(tip);
      const image = main.locator(".court-logistics-hero img");
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await main.locator("h1,h2,p,a,button,li,summary").evaluateAll(nodes => nodes.filter(node => {
          const rect = node.getBoundingClientRect();
          return rect.width && (rect.left < -1 || rect.right > innerWidth + 1);
        }).map(node => node.textContent))).toEqual([]);
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: info.outputPath(`court-${width}.png`) });
      }
    });
  }
}
