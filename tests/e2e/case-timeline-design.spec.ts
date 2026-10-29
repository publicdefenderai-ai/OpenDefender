import { test, expect } from '@playwright/test';
import en from '../../client/src/locales/en';
import es from '../../client/src/locales/es';
import zh from '../../client/src/locales/zh';

const stages = ['arrest', 'booking', 'firstAppearance', 'pretrial', 'discovery', 'trial', 'sentencing'] as const;
for (const [language, locale] of Object.entries({ en, es, zh })) for (const theme of ['light', 'dark']) {
  test(`Timeline stages and state selection: ${language}/${theme}`, async ({ page }, info) => {
    const copy = locale.translation.caseTimeline;
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('public-defender-theme', theme);
    }, { language, theme });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/case-timeline');
    await expect(page.locator('.timeline-intro h1')).toHaveText(copy.design.heading);
    await expect(page.locator('#main-content > div').first()).toHaveCSS('opacity', '1');
    const panel = page.locator('#timeline-panel');
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const stage of stages) {
        if (width === 1280) {
          const button = page.locator('.timeline-stage-nav').getByRole('button', { name: copy.stages[stage].title, exact: true });
          await button.focus();
          await page.keyboard.press('Enter');
          await expect(button).toHaveAttribute('aria-current', 'step');
          await expect(button).toBeFocused();
        } else await page.locator('#timeline-stage-select').selectOption(stage);
        await expect(panel.locator('h2')).toHaveText(copy.stages[stage].title);
        for (const text of [copy.stages[stage].description, copy.stages[stage].timeframe, ...copy.stages[stage].rights, ...copy.stages[stage].tips]) {
          await expect(panel).toContainText(text);
        }
        if (stage === 'arrest') await expect(page.getByTestId('timeline-previous')).toBeDisabled();
        else await expect(page.getByTestId('timeline-previous')).toBeEnabled();
        if (stage === 'sentencing') await expect(page.getByTestId('timeline-next')).toBeDisabled();
        else await expect(page.getByTestId('timeline-next')).toBeEnabled();
        const overflow = await panel.evaluate(root => [...root.querySelectorAll('p,h2,h3,li,a,button,summary')].filter(el => {
          const r = el.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
        }).map(el => el.textContent));
        expect(overflow).toEqual([]);
      }
      await page.screenshot({ path: info.outputPath(`timeline-${width}.png`), fullPage: true });
    }
    await page.getByTestId('timeline-previous').click();
    await expect(panel.locator('h2')).toBeFocused();
    await expect(panel.locator('h2')).toHaveText(copy.stages.trial.title);
    await page.locator('#timeline-stage-select').selectOption('booking');
    await panel.locator('[role=combobox]').click();
    await page.getByRole('option', { name: 'California', exact: true }).click();
    await expect(panel).toContainText('bail and pretrial release');
    await expect(panel).toContainText('California');
    await page.locator('#timeline-stage-select').selectOption('firstAppearance');
    await expect(panel).toContainText('arraignment procedures');
    expect(await page.evaluate(() => localStorage.getItem('od_selected_jurisdiction'))).toBe('california');
    await page.reload();
    await page.locator('#timeline-stage-select').selectOption('booking');
    await expect(panel).toContainText('California');
    await panel.locator('[role=combobox]').click();
    await page.getByRole('option', { name: 'All states', exact: true }).click();
    await expect(panel).not.toContainText('Rules for');
    await expect(page.locator('.timeline-caveat')).toContainText(copy.disclaimer.text);
    await expect(page.locator('.timeline-caveat')).toContainText(copy.disclaimer.deadlines);
    await expect(page.locator('.timeline-caveat a')).toHaveAttribute('href', '/data-sources');
    await expect(page.locator('.timeline-guide-links a[href="/bail"]')).toBeVisible();
    await expect(page.locator('.timeline-guide-links a[href="/plea-agreements"]')).toBeVisible();
    await expect(page.locator('.timeline-guides')).toContainText(locale.translation.process.legalDisclaimer.text);
  });
}

test('timeline retains supporting resources after guide extraction', async ({ page }) => {
  await page.goto('/case-timeline');
  await expect(page.getByRole('link', { name: /Re-entry Resources/ })).toHaveAttribute('href', '/support/reentry');
  await page.locator('.timeline-stage-nav button').last().click();
  await expect(page.locator('#timeline-panel a[href="/support/finances"]')).toBeVisible();
});
