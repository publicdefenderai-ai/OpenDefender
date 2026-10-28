import { expect, test, type Page } from '@playwright/test';

async function checkStep(page: Page, step: number) {
  await expect(page.getByTestId('qa-step-label')).toContainText(new RegExp(`(?:Step |Paso |第)${step}(?: of 7| de 7|步，共7步)`));
  await expect(page.getByTestId('qa-step-label')).toBeFocused();
  await expect(page.locator('.case-intake')).not.toContainText('design.case');
  const overflow = await page.locator('.case-intake :is(button,p,h3,label,[role=combobox])').evaluateAll(nodes => nodes.filter(n => {
    const r = n.getBoundingClientRect();
    return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
  }).map(n => n.textContent));
  expect(overflow).toEqual([]);
}
for (const surface of ['form', 'conversation']) {
for (const language of ['en', 'es', 'zh']) {
  for (const theme of ['light', 'dark']) {
    test(`seven-step intake and both choices at 320px: ${surface}/${language}/${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem('i18nextLng', language);
        localStorage.setItem('public-defender-theme', theme);
      }, { language, theme });
      await page.route('**/api/ai/status', route => route.fulfill({ json: { available: true } }));
      await page.route('**/api/captcha/config', route => route.fulfill({ json: { required: false } }));
      for (const mode of ['ai', 'rules']) {
        await page.goto(surface === 'form' ? '/case-guidance' : '/chat?flow=case-roadmap');
        await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
        if (surface === 'form') {
          await expect(page.getByTestId('heading-case-title')).not.toContainText('design.case');
          await page.getByTestId('button-start-guidance').click();
        }
        await checkStep(page, 1);
        await expect(page.locator('.case-option-label')).toHaveCount(2);
        await page.getByTestId(`button-choose-${mode}`).focus();
        await page.keyboard.press('Enter');
        await checkStep(page, 2);
        await expect(page.getByTestId('button-next-jurisdiction')).toBeDisabled();
        await page.getByTestId('select-jurisdiction').click();
        await page.getByRole('option').filter({ hasText: /California|加利福尼亚/ }).click();
        await page.getByTestId('button-next-jurisdiction').click();
        await checkStep(page, 3);
        await page.locator('#charges-unknown').click();
        await page.getByTestId('button-next-case-details').click();
        await checkStep(page, 4);
        for (const id of ['select-case-stage', 'select-custody-status', 'select-has-attorney']) {
          await page.getByTestId(id).click();
          await page.getByRole('option').first().click();
        }
        await page.getByTestId('button-continue-status').click();
        await checkStep(page, 5);
        await page.getByTestId('button-continue-background').click();
        await checkStep(page, 6);
        await page.locator('.case-intake .case-continue').click();
        await checkStep(page, 7);
        await page.getByTestId('button-prev-civil-emergencies').click();
        await checkStep(page, 6);
        await page.getByTestId('button-prev-additional-details').click();
        await page.getByTestId('button-prev-background').click();
        await page.getByTestId('button-prev-status').click();
        await checkStep(page, 3);
        await expect(page.locator('#charges-unknown')).toHaveAttribute('data-state', 'checked');
        await page.getByTestId('button-prev-case-details').click();
        await expect(page.getByTestId('select-jurisdiction')).not.toHaveText('');
        await page.getByTestId('button-prev-jurisdiction').click();
        await checkStep(page, 1);
        await page.getByTestId('button-cancel-qa').click();
        await expect(page.getByTestId(surface === 'form' ? 'button-start-guidance' : 'quick-reply-urgent-no')).toBeVisible();
      }
    });
  }
}

}
