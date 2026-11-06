import { test, expect } from '@playwright/test';
import { getNrrcResources } from '../../client/src/lib/nrrc-resources';
for (const language of ['en', 'es', 'zh']) {
  test(`NRRC research links are localized and reachable on relevant pages: ${language}`, async ({page}) => {
    await page.addInitScript(language => localStorage.setItem('i18nextLng', language), language);
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.setViewportSize({width: 320, height: 900});
    const {copy, resources} = getNrrcResources(language);
    await page.goto('/directory');
    for (const resource of resources) {
      const link = page.locator(`.directory-resource[href="${resource.link}"]`);
      await expect(link).toContainText(resource.title);
      await expect(link).toContainText(copy.note);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    const placements = [
      ['/support/reentry', ['home', 'consequences', 'housing']],
      ['/support/housing', ['housing', 'consequences']],
      ['/support/finances', ['consequences']],
      ['/support/reputation', ['consequences']],
      ['/collateral-consequences', ['consequences']],
    ] as const;
    for (const [path, ids] of placements) {
      await page.goto(path);
      const section = page.getByTestId('nrrc-resources');
      await expect(section).toBeVisible();
      await expect(section).toContainText(copy.note);
      await expect(section.locator('a')).toHaveCount(ids.length);
      for (const resource of resources) {
        const link = section.locator(`a[href="${resource.link}"]`);
        if ((ids as readonly string[]).includes(resource.id)) {
          await expect(link).toBeVisible();
          await expect(link).toHaveAttribute('target', '_blank');
          await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        } else {
          await expect(link).toHaveCount(0);
        }
      }
      expect(await section.evaluate(el => [...el.querySelectorAll('a,p,h2')].every(node => { const rect=node.getBoundingClientRect(); return rect.left >= -1 && rect.right <= innerWidth+1; }))).toBe(true);
    }
  });
}
