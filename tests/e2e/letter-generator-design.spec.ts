import { test, expect, type Page } from '@playwright/test';

const types = [
  { id: 'employer-court-dates', keys: ['Frequency', 'Whose case', 'Documentation'], options: [4, 2, 3], optional: true },
  { id: 'employer-explain-absence', keys: ['Duration', 'Reason to share', 'Current status'], options: [4, 4, 3], optional: true },
  { id: 'employer-record-disclosure', keys: ['Type of role', 'Time since offense', 'General category', 'Steps since then'], options: [0, 4, 5, 4] },
  { id: 'landlord-payment-plan', keys: ['How far behind', 'Reason', 'Partial payment', 'Catch-up plan'], options: [4, 4, 3, 0] },
  { id: 'landlord-situation-notice', keys: ['What to communicate', 'Current status', 'What you are asking'], options: [4, 3, 3], optional: true },
  { id: 'utility-hardship', keys: ['Utility type', 'Current situation', 'Reason', 'What I am requesting'], options: [5, 4, 4, 4] },
];
const draft = 'Dear [Name],\n\nFictional request: A & B <planning>.\n<b>Keep these literal characters.</b>\n<script>window.printInjected = true</script>\n\nThank you.';
const response = { success: true, letter: draft, subject: 'Fictional <request>', tips: ['Check every detail before sending.'] };
async function setup(page: Page, language = 'en', theme = 'light') {
  await page.addInitScript(({ language, theme }) => {
    localStorage.setItem('i18nextLng', language);
    localStorage.setItem('public-defender-theme', theme);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (value: string) => { (window as any).copiedLetter = value; } } });
  }, { language, theme });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/api/captcha/config', route => route.fulfill({ json: { required: false } }));
  await page.goto('/letter-generator');
  await expect(page.getByTestId('letter-type-employer-court-dates')).toBeVisible();
  await expect(page.locator('#main-content > div').first()).toHaveCSS('opacity', '1');
}
async function bounds(page: Page) {
  const clipped = await page.locator('.letter-workspace').evaluate(root => [...root.querySelectorAll('button,p,h2,input,select,textarea,pre')].filter(el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
  }).map(el => el.textContent));
  expect(clipped).toEqual([]);
}
async function fill(page: Page, def: typeof types[number]) {
  const fields = page.locator('.letter-intake select,.letter-intake input[type=text]');
  await expect(fields).toHaveCount(def.keys.length);
  const answers: Record<string,string> = {};
  for (let i = 0; i < def.keys.length; i++) {
    const field = fields.nth(i);
    // Every field must have a real associated label, including native selects.
    expect(await field.evaluate(el => (el as HTMLInputElement).labels?.length)).toBe(1);
    if (def.options[i]) {
      await expect(field.locator('option')).toHaveCount(def.options[i] + 1);
      await field.selectOption({ index: 1 });
    } else await field.fill('Fictional context');
    answers[def.keys[i]] = await field.inputValue();
  }
  await expect(page.locator('.letter-intake textarea')).toHaveCount(def.optional ? 1 : 0);
  return answers;
}
for (const language of ['en', 'es', 'zh']) for (const theme of ['light', 'dark']) {
  test(`all letter choices and questions at 320px: ${language}/${theme}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await setup(page, language, theme);
    await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
    await expect(page.locator('.letter-purpose')).toHaveCount(6);
    await expect(page.locator('.document-tool-advisory')).toHaveCSS('border-left-width', '3px');
    await bounds(page);
    await page.screenshot({ path: testInfo.outputPath('choices-mobile.png'), fullPage: true });
    for (const def of types) {
      await page.getByTestId(`letter-type-${def.id}`).click();
      await expect(page.locator('[data-letter-heading]')).toBeFocused();
      await expect(page.getByTestId('letter-generate')).toBeDisabled();
      await fill(page, def);
      await expect(page.getByTestId('letter-generate')).toBeEnabled();
      await bounds(page);
      if (def.id === 'employer-record-disclosure') await page.screenshot({ path: testInfo.outputPath('disclosure-mobile.png'), fullPage: true });
      await page.getByTestId('letter-back').click();
      await expect(page.locator('[data-letter-heading]')).toBeFocused();
    }
    await expect(page.locator('.document-tool-related a')).toHaveCount(3);
  });
}
for (const def of types) {
  test(`letter request and result preserve ${def.id}`, async ({ page }, testInfo) => {
    await setup(page);
    let body: any;
    await page.route('**/api/generate-letter', route => {
      body = route.request().postDataJSON();
      return route.fulfill({ json: response });
    });
    if (def.id === types[0].id) await page.screenshot({ path: testInfo.outputPath('choices-desktop.png'), fullPage: true });
    await page.getByTestId(`letter-type-${def.id}`).click();
    if (def.id.startsWith('employer-')) await expect(page.getByText('Check your employee handbook first.')).toBeVisible();
    if (def.id === 'employer-record-disclosure') await expect(page.getByText(/This letter intentionally discloses/)).toBeVisible();
    const answers = await fill(page, def);
    await page.getByTestId('letter-generate').click();
    await expect(page.getByTestId('letter-draft')).toHaveText(draft);
    expect(body).toEqual({ letterType: def.id, answers, language: 'en' });
    await expect(page.locator('[data-letter-heading]')).toBeFocused();
    await expect(page.getByText('Check every detail before sending.')).toBeVisible();
    await expect(page.getByText(/This letter is a general-purpose draft, not legal advice/)).toBeVisible();
    await page.getByTestId('letter-copy').click();
    expect(await page.evaluate(() => (window as any).copiedLetter)).toBe(`Subject: ${response.subject}\n\n${draft}`);
    if (def.id === types[0].id) {
      const popupPromise = page.waitForEvent('popup');
      await page.getByTestId('letter-print').click();
      const print = await popupPromise;
      await expect(print.locator('.body')).toHaveText(draft);
      await expect(print.locator('.subject')).toHaveText(`Subject: ${response.subject}`);
      await expect(print.locator('.note')).toContainText('does not constitute legal advice');
      await expect(print.locator('.body b,.body script')).toHaveCount(0);
      expect(await print.evaluate(() => (window as any).printInjected)).toBeUndefined();
      await expect(print.locator('.body')).toHaveCSS('white-space', 'pre-wrap');
      await print.screenshot({ path: testInfo.outputPath('print.png'), fullPage: true });
      await print.close();
      await page.screenshot({ path: testInfo.outputPath('result-desktop.png'), fullPage: true });
      await page.getByTestId('button-theme').click();
      await page.setViewportSize({ width: 320, height: 800 });
      await bounds(page);
      await page.screenshot({ path: testInfo.outputPath('result-mobile-dark.png'), fullPage: true });
    }
    await page.getByTestId('letter-reset').click();
    await expect(page.locator('.letter-purpose')).toHaveCount(6);
    await page.getByTestId(`letter-type-${def.id}`).click();
    await expect(page.getByTestId('letter-generate')).toBeDisabled();
  });
}

test('failed generation retains answers and requires a fresh CAPTCHA', async ({ page }) => {
  let calls = 0;
  await setup(page);
  await page.route('**/api/captcha/config', route => route.fulfill({ json: { required: true, siteKey: 'test-key' } }));
  await page.route('https://challenges.cloudflare.com/**', route => route.fulfill({ contentType: 'application/javascript', body: `
    window.turnstile = { render: (_, options) => { window.verifyLetterCaptcha = options.callback; return 'test-widget'; }, remove() {}, reset() {} }; window.onTurnstileLoad?.();
  ` }));
  await page.reload();
  await page.route('**/api/generate-letter', route => {
    calls++;
    expect(route.request().postDataJSON().captchaToken).toBe(calls === 1 ? 'first-token' : 'second-token');
    return calls === 1 ? route.fulfill({ status: 503, json: { error: 'Fictional test error' } }) : route.fulfill({ json: response });
  });
  await page.getByTestId(`letter-type-${types[0].id}`).click();
  const answers = await fill(page, types[0]);
  await expect(page.getByTestId('letter-generate')).toBeDisabled();
  await expect.poll(() => page.evaluate(() => typeof (window as any).verifyLetterCaptcha)).toBe('function');
  await page.evaluate(() => (window as any).verifyLetterCaptcha('first-token'));
  await page.getByTestId('letter-generate').click();
  await expect(page.getByText('Fictional test error')).toBeVisible();
  await expect(page.getByTestId('letter-generate')).toBeDisabled();
  expect(await page.locator('.letter-intake select').first().inputValue()).toBe(answers.Frequency);
  await page.evaluate(() => (window as any).verifyLetterCaptcha('second-token'));
  await page.getByTestId('letter-generate').click();
  await expect(page.getByTestId('letter-draft')).toHaveText(draft);
  expect(calls).toBe(2);
});
