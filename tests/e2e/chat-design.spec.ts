import { expect, test, type Page } from '@playwright/test';

async function setup(page: Page, language = 'en', theme = 'light') {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(({ language, theme }) => {
    localStorage.setItem('i18nextLng', language);
    localStorage.setItem('public-defender-theme', theme);
  }, { language, theme });
  await page.route('**/api/captcha/config', route => route.fulfill({ json: { required: false } }));
  await page.goto('/chat');
  await expect(page.getByTestId('quick-reply-urgent-no')).toBeVisible();
}
async function bounds(page: Page) {
  const clipped = await page.locator('.design-chat button:visible, .chat-bubble, .chat-composer, .chat-replies').evaluateAll(nodes => nodes.filter(node => {
    const r = node.getBoundingClientRect();
    return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
  }).map(node => node.textContent));
  expect(clipped).toEqual([]);
}
for (const language of ['en', 'es', 'zh']) for (const theme of ['light', 'dark']) {
  test(`chat choices, canonical intake and summary at 320px: ${language}/${theme}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await setup(page, language, theme);
    await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
    await expect(page.getByTestId('button-close-chat')).toBeVisible();
    await expect(page.getByTestId('input-chat-message')).toHaveCount(0);
    await bounds(page);
    await page.getByTestId('quick-reply-urgent-no').click();
    await expect(page.getByTestId('chat-typing')).toBeVisible();
    await page.getByTestId('quick-reply-menu-case-roadmap').click();
    await expect(page.getByTestId('button-choose-ai')).toBeVisible();
    await page.getByTestId('button-choose-rules').click();
    await page.getByTestId('select-jurisdiction').click();
    await page.getByRole('option').filter({ hasText: /Oregon|Oregón|俄勒冈/ }).click();
    await page.getByTestId('button-next-jurisdiction').click();
    await expect(page.getByTestId('qa-step-label')).toContainText(/(?:Step |Paso |第)3/);
    await expect(page.locator('.intake-transcript')).toContainText(/Oregon|Oregón|俄勒冈/);
    await page.screenshot({ path: testInfo.outputPath('chat-mobile.png') });
    await page.getByTestId('button-theme').click();
    await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme === 'light' ? 'dark' : 'light'}\\b`));
    await page.getByTestId('button-cancel-qa').click();
    await page.getByTestId('button-close-chat').click();
    await expect(page).not.toHaveURL(/\/chat$/);
  });
}
for (const theme of ['light', 'dark']) {
  test(`desktop conversation uses available width and retains typing pause: ${theme}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await setup(page, 'en', theme);
    const log = page.getByRole('log');
    expect((await log.boundingBox())!.width).toBeGreaterThan(1200);
    const start = Date.now();
    await page.getByTestId('quick-reply-urgent-no').click();
    await expect(page.getByTestId('chat-typing')).toBeVisible();
    await expect(page.getByTestId('quick-reply-menu-case-roadmap')).toBeVisible();
    expect(Date.now() - start).toBeGreaterThanOrEqual(900);
    await expect(page.getByTestId('input-chat-message')).toHaveCount(0);
    await bounds(page);
    await page.screenshot({ path: testInfo.outputPath('chat-desktop.png') });
  });
}
