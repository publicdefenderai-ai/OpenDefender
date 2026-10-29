import { test, expect, type Page } from '@playwright/test';

async function setup(page: Page, language = 'en', theme = 'light') {
  await page.addInitScript(({ language, theme }) => {
    localStorage.setItem('i18nextLng', language);
    localStorage.setItem('public-defender-theme', theme);
  }, { language, theme });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/api/ai/status', route => route.fulfill({ json: { available: true } }));
  await page.route('**/api/captcha/config', route => route.fulfill({ json: { required: false } }));
}
for (const language of ['en', 'es', 'zh']) for (const theme of ['light', 'dark']) {
  test(`summary consent and upload fit 320px: ${language}/${theme}`, async ({ page }, testInfo) => {
    await setup(page, language, theme);
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/document-summarizer');
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('html')).toHaveClass(theme === 'dark' ? /dark/ : /light/);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('.document-tool-advisory')).toBeVisible();
    const colors = await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.style.transition = 'none';
      document.body.append(probe);
      const result: Record<string, string> = {};
      for (const token of ['primary', 'ring', 'border']) {
        probe.style.color = `var(--${token})`;
        result[token] = getComputedStyle(probe).color;
      }
      probe.remove();
      return result;
    });
    await expect(page.locator('.document-tool-advisory')).toHaveCSS('border-left-width', '3px');
    await expect(page.locator('.document-tool-advisory')).toHaveCSS('border-left-color', colors.primary);
    await expect(page.locator('.document-tool-label')).toHaveCSS('color', colors.primary);
    await expect(page.locator('.document-tool-related')).toHaveCSS('border-top-width', '1px');
    await expect(page.locator('.document-tool-related')).toHaveCSS('border-top-color', colors.border);
    await expect(page.locator('.document-tool-related a').first()).toHaveCSS('color', colors.primary);
    await expect(page.getByTestId('summary-consent-continue')).toBeDisabled();
    await expect(page.locator('input[type=file]')).toHaveCount(0);
    await page.screenshot({ path: testInfo.outputPath('consent-mobile.png'), fullPage: true });
    await page.getByRole('checkbox').check();
    await page.getByTestId('summary-consent-continue').click();
    await expect(page.getByTestId('summary-submit')).toBeDisabled();
    const input = page.locator('input[type=file]');
    await input.focus();
    await expect(input).toBeFocused();
    await expect(page.locator('.summary-upload')).toHaveCSS('outline-width', '2px');
    await expect(page.locator('.summary-upload')).toHaveCSS('outline-style', 'solid');
    await expect(page.locator('.summary-upload')).toHaveCSS('outline-color', colors.ring);
    await input.setInputFiles({ name: 'fictional-meeting.txt', mimeType: 'text/plain', buffer: Buffer.from('Fictional meeting note for a design test.') });
    await expect(page.getByTestId('summary-submit')).toBeEnabled();
    await expect(page.locator('.summary-upload')).toContainText('fictional-meeting.txt');
    await expect(page.locator('.document-tool-related a')).toHaveCount(3);
    await expect(page.locator('.document-tool-related a').nth(2)).toHaveAttribute('href', '/directory');
    const clipped = await page.locator('.document-tool-page').evaluate(root => [...root.querySelectorAll('h1,p,label,button,a')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
    }).map(el => el.textContent));
    expect(clipped).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('upload-mobile.png'), fullPage: true });
    await page.getByTestId('summary-reset').click();
    await expect(page.getByTestId('summary-consent-continue')).toBeDisabled();
  });
}

test('summary keeps upload payload, result warnings, follow-up questions and download', async ({ page }, testInfo) => {
  await setup(page);
  let uploadBody = '';
  await page.route('**/api/document-summary/summarize', route => {
    uploadBody = route.request().postData() || '';
    return route.fulfill({ json: { success: true, summary: {
      summary: 'A fictional meeting is scheduled.', keyPoints: ['Bring the original notice.'],
      importantDates: [{ date: '2030-01-10', description: 'Fictional test deadline', isDeadline: true }],
      legalTermsExplained: [{ term: 'Notice', explanation: 'Written information.' }],
      potentialConcerns: ['Confirm the address.'], recommendedActions: ['Review the original.'],
      documentType: 'general', pageCount: 1, extractedText: 'Fictional meeting note.',
      usageMetrics: { inputTokens: 1, outputTokens: 1, estimatedCost: 0 },
    } } });
  });
  let questionBody: any;
  await page.route('**/api/document-summary/chat', route => {
    questionBody = route.request().postDataJSON();
    return route.fulfill({ json: { success: true, answer: 'It describes a fictional meeting.', citations: [{ quote: 'Fictional meeting note.', context: 'Original note' }] } });
  });
  await page.goto('/document-summarizer');
  await page.getByRole('checkbox').check();
  await page.getByTestId('summary-consent-continue').click();
  await page.locator('input[type=file]').setInputFiles({ name: 'fictional-meeting.txt', mimeType: 'text/plain', buffer: Buffer.from('Fictional meeting note.') });
  await page.getByTestId('summary-submit').click();
  await expect(page.getByText('A fictional meeting is scheduled.')).toBeVisible();
  for (const field of ['document', 'consentGiven', 'language', 'summaryType']) expect(uploadBody).toContain(`name="${field}"`);
  expect(uploadBody).toContain('Fictional meeting note.');
  await expect(page.getByText('Fictional test deadline')).toBeVisible();
  await expect(page.getByText('Confirm the address.')).toBeVisible();
  await expect(page.getByText('Disclaimer', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Ask a question about the document' }).fill('What does this note describe?');
  await page.getByRole('textbox', { name: 'Ask a question about the document' }).press('Enter');
  await expect(page.getByText('It describes a fictional meeting.')).toBeVisible();
  expect(questionBody).toMatchObject({ question: 'What does this note describe?', extractedText: 'Fictional meeting note.', conversationHistory: [], language: 'en' });
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Summary', exact: true }).click();
  expect((await download).suggestedFilename()).toMatch(/^document-summary-.*\.txt$/);
  await page.screenshot({ path: testInfo.outputPath('summary-desktop.png'), fullPage: true });
  await page.getByTestId('button-theme').click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.screenshot({ path: testInfo.outputPath('summary-desktop-dark.png'), fullPage: true });
  await page.setViewportSize({ width: 320, height: 800 });
  const clipped = await page.locator('.document-summarizer').evaluate(root => [...root.querySelectorAll('p,button,input,h3')].filter(el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
  }).map(el => el.textContent));
  expect(clipped).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('summary-mobile-dark.png'), fullPage: true });
});
