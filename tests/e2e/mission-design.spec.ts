import { expect, test } from "@playwright/test";
import en from "../../client/src/locales/en";
import es from "../../client/src/locales/es";
import zh from "../../client/src/locales/zh";

for (const [language, locale] of Object.entries({ en, es, zh })) {
  for (const theme of ["light", "dark"]) {
    test(`Mission article in ${language}, ${theme}`, async ({ page }) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem("public-defender-theme", theme);
        localStorage.setItem("i18nextLng", language);
      }, { language, theme });
      await page.goto("/mission-statement");
      const article = page.locator(".mission-page");
      const copy = locale.translation.missionStatement;
      const goals = [copy.goals.expandAccess, copy.goals.supportDefenders, copy.goals.empowerDecisions, copy.goals.increaseFairness];
      for (const width of [1280, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        await expect(article.getByRole("heading", { level: 1 })).toContainText(copy.reader.accent);
        if (width > 700) await expect(article.locator(".mission-book")).toBeVisible();
        else await expect(article.locator(".mission-book")).toBeHidden();
        const spills = await article.locator("p, h1, h2, h3, a").evaluateAll(elements =>
          elements.filter(el => el.getBoundingClientRect().right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 1).map(el => el.textContent));
        expect(spills).toEqual([]);
      }
      await expect(article.getByRole("listitem")).toHaveCount(4);
      for (const fragment of [copy.hero.subtitle1, copy.hero.subtitle2, copy.publicGood.text,
        copy.philosophy.opening, copy.philosophy.body, copy.principles.description, copy.principles.disclaimer,
        ...goals.flatMap(goal => [goal.title, goal.description])]) {
        await expect(article).toContainText(fragment);
      }
      const links = article.getByRole("link");
      expect(await links.evaluateAll(items => items.map(el => el.getAttribute("href"))))
        .toEqual(["/privacy-policy", "/data-sources", "/disclaimers", "/directory"]);
      await links.last().focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/directory$/);
    });
  }
}
