import { test, expect } from '@playwright/test';
import choices from '../fixtures/immigration-guide-choices';
import { immigrationSituationsCopy } from '../../client/src/locales/immigration-situations';
for (const language of ['en','es','zh'] as const) for (const theme of ['light','dark']) {
  test(`Immigration collection preserves all destinations: ${language}/${theme}`, async ({ page }, info) => {
    await page.addInitScript(({language,theme}) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('public-defender-theme', theme);
    }, {language,theme});
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({width:1280,height:900});
    await page.goto('/immigration-guidance#detailed-guides');
    const section = page.locator('#detailed-guides');
    await expect(section).toBeVisible();
    await expect(section.locator('.situations-art')).toHaveAttribute('aria-hidden','true');
    await expect(section.locator('.situations-group')).toHaveCount(3);
    await expect(section.locator('[aria-pressed]')).toHaveCount(9);
    await expect(section.locator('[aria-pressed=true]')).toHaveCount(1);
    for (const [index, choice] of choices[language].entries()) {
      const button = page.locator(`#situation-choice-${choice.slug}`);
      await expect(button).toContainText(choice.title);
      await expect(button).toContainText(choice.description);
      await button.focus(); await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-pressed','true');
      await expect(page.locator('#situation-reader-title')).toHaveText(choice.title);
      await expect(page.locator('#situation-reader-title')).toBeFocused();
      for (const topic of immigrationSituationsCopy[language].topics[index]) await expect(section.getByRole('listitem').filter({hasText:topic})).toBeVisible();
      await expect(page.getByTestId('open-situation-guide')).toHaveAttribute('href', `/immigration-guidance/${choice.slug}`);
      await section.getByRole('button',{name:immigrationSituationsCopy[language].back,exact:true}).click();
      await expect(button).toBeFocused();
    }
    // Collection selection must not hide the existing overview, notices, or phases.
    await expect(page.getByTestId('text-immigration-hero-title')).toBeVisible();
    await expect(page.locator('.immigration-phase')).toHaveCount(4);
    await expect(page.locator('#rapid-response')).toBeVisible();
    for (const width of [1280,320]) {
      await page.setViewportSize({width,height:900});
      await section.scrollIntoViewIfNeeded();
      const clipped = await section.evaluate(root=>[...root.querySelectorAll('h2,h3,h4,p,button,a,strong,small')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.left < -1 || r.right > innerWidth+1);}).map(el=>el.textContent));
      expect(clipped).toEqual([]);
      await section.screenshot({path:info.outputPath(`collection-${width}.png`)});
    }
    await page.getByTestId('open-situation-guide').click();
    await expect(page).toHaveURL(/\/immigration-guidance\/after-deportation$/);
    await expect(page.getByTestId('immigration-detail-title')).toBeVisible();
  });
}
