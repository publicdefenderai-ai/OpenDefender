import { expect, test, type Page } from '@playwright/test';

// Test-only generated content. Production questions, generators and eligibility are not bypassed.
const guidance = {
  overview: 'Design fixture: a complete roadmap for testing presentation.',
  caseData: { jurisdiction: 'OR', caseStage: 'pretrial', custodyStatus: 'released', hasAttorney: false, charges: '' },
  generatedAt: '2026-10-27T12:00:00Z',
  immediateActions: [{ action: 'Fixture practical step', urgency: 'high', treatment: 'practical' }, ...['urgent', 'high', 'medium', 'low'].map(urgency => ({ action: `Fixture legal information ${urgency}`, urgency, treatment: 'legal-information' }))],
  criticalAlerts: ['Fixture critical warning'], warnings: ['Fixture caution'],
  rights: ['Fixture rights reminder'],
  resources: [{ type: 'Fixture resource', description: 'Fixture resource description', contact: 'https://example.org' }],
  timeline: [{ stage: 'Fixture stage', description: 'Fixture stage description', timeframe: 'Varies', completed: false, isEstimate: true }],
  deadlines: [{ event: 'Fixture deadline', timeframe: 'Confirm locally', description: 'Fixture deadline details', priority: 'high', isEstimate: true }],
  uncertainties: [{ area: 'Fixture uncertainty', note: 'Fixture uncertainty details' }],
  evidenceToGather: ['Fixture document'], courtPreparation: ['Fixture preparation'], avoidActions: ['Fixture avoid action'], nextSteps: ['Fixture next step'],
};
async function setup(page: Page, language = 'en', theme = 'light') {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(({ language, theme }) => {
    localStorage.setItem('i18nextLng', language);
    localStorage.setItem('public-defender-theme', theme);
  }, { language, theme });
  await page.route('**/api/ai/status', route => route.fulfill({ json: { available: true } }));
  await page.route('**/api/captcha/config', route => route.fulfill({ json: { required: false } }));
  await page.route('**/api/legal-guidance/design-results', route => route.fulfill({ json: { success: true, guidance } }));
}
async function settlePage(page: Page) {
  await expect.poll(() => page.locator('main').last().evaluate(node => {
    for (let parent: Element | null = node; parent; parent = parent.parentElement) {
      if (Number(getComputedStyle(parent).opacity) < 1) return false;
    }
    return true;
  })).toBe(true);
}
async function checkBounds(page: Page, selector: string) {
  const clipped = await page.locator(selector).evaluateAll(nodes => nodes.filter(n => {
    const r = n.getBoundingClientRect();
    return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
  }).map(n => n.textContent?.slice(0, 100)));
  expect(clipped).toEqual([]);
}
for (const language of ['en', 'es', 'zh']) for (const theme of ['light', 'dark']) {
  test(`results navigation, content and printing at 320px: ${language}/${theme}`, async ({ page }, testInfo) => {
    await setup(page, language, theme);
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto('/case-guidance?session=design-results');
    const dashboard = page.getByTestId('guidance-dashboard');
    await expect(dashboard).toBeVisible();
    await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
    await expect(dashboard).not.toContainText('design.guidance');
    const urgencyLabels = { en: ['Urgent', 'High priority', 'Medium priority', 'Low priority'], es: ['Urgente', 'Prioridad alta', 'Prioridad media', 'Prioridad baja'], zh: ['紧急', '高优先级', '中优先级', '低优先级'] };
    for (const [index, label] of urgencyLabels[language as keyof typeof urgencyLabels].entries()) await expect(page.getByTestId(`badge-legal-information-${index}`)).toHaveText(label);
    const titles = { en: 'Case Roadmap: OR', es: 'Hoja de ruta del caso: OR', zh: '案件路线图：OR' };
    await expect(dashboard.getByRole('heading', { level: 1 })).toHaveText(titles[language as keyof typeof titles]);
    const notice = page.getByTestId('guidance-privacy-notice');
    await expect(notice).toHaveAttribute('role', 'note');
    await expect(notice).toHaveCSS('border-left-width', '4px');
    await expect(notice).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(page.getByTestId('guidance-privilege-warning')).toHaveCSS('font-size', '14px');
    await expect(page.getByTestId('guidance-privilege-warning')).toHaveCSS('font-weight', '600');
    expect(await dashboard.locator('[class*="uppercase"]').count()).toBe(0);

    await expect(page.getByTestId('critical-alert-0')).toHaveText('Fixture critical warning');
    await expect(page.getByTestId('text-guidance-overview')).toHaveText(guidance.overview);
    const destinations = ['guidance-overview', 'practical-action-plan', 'guidance-timeline', 'guidance-rights', 'guidance-resources'];
    const links = page.locator('.guidance-section-nav button');
    await expect(links).toHaveCount(destinations.length);
    for (let i = 0; i < destinations.length; i++) {
      await links.nth(i).click();
      await expect(page.locator(`#${destinations[i]}`)).toBeFocused();
    }
    const checkbox = page.getByTestId('checkbox-practical-action-0');
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('data-state', 'checked');
    await checkBounds(page, '.guidance-results :is(button,p,h1,h2,h3,nav,[role=checkbox])');
    await expect(dashboard).toContainText('Fixture uncertainty details');
    await page.getByTestId('collapsible-uncertainties').click();
    await expect(dashboard).not.toContainText('Fixture uncertainty details');
    if (language === 'en') await notice.screenshot({ path: testInfo.outputPath(`privilege-notice-${theme}.png`) });
    await page.evaluate(() => scrollTo(0, 0));
    await settlePage(page);
    if (language === 'en') await page.screenshot({ path: testInfo.outputPath(`case-results-${theme}-mobile.png`) });
    await page.emulateMedia({ media: 'print' });
    await expect(dashboard).toBeHidden();
    const plan = page.getByTestId('print-guidance-plan');
    await expect(plan).toBeVisible();
    for (const text of [guidance.overview, 'Fixture critical warning', 'Fixture rights reminder', 'Fixture resource description', 'Fixture uncertainty details']) await expect(plan).toContainText(text);
  });
}
test('desktop export retains confirmation and produces PDF', async ({ page }, testInfo) => {
  await setup(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/case-guidance?session=design-results');
  await expect(page.getByTestId('guidance-dashboard')).toBeVisible();
  await settlePage(page);
  await page.screenshot({ path: testInfo.outputPath('case-results-desktop.png') });
  await page.getByTestId('button-export-pdf').click();
  await expect(page.getByRole('alertdialog')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('button-confirm-export').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  expect(Buffer.concat(chunks).subarray(0, 5).toString()).toBe('%PDF-');
});
test('expired session remains recoverable', async ({ page }, testInfo) => {
  await setup(page);
  await page.route('**/api/legal-guidance/expired', route => route.fulfill({ status: 403, json: { code: 'SESSION_EXPIRED', error: 'Session expired' } }));
  await page.goto('/case-guidance?session=expired');
  await expect(page.getByRole('heading', { name: 'Your session has expired' })).toBeVisible();
  await page.getByRole('button', { name: 'Start a new screener' }).click();
  await expect(page.getByTestId('qa-step-label')).toContainText('Step 1');
});
for (const language of ['en', 'es', 'zh']) for (const theme of ['light', 'dark']) {
  test(`recovery and loading controls at 320px: ${language}/${theme}`, async ({ page }, testInfo) => {
    await setup(page, language, theme);
    await page.setViewportSize({ width: 320, height: 844 });
    await page.addInitScript(() => sessionStorage.setItem('open-defender:case-guidance-recovery', JSON.stringify({
      pendingGuidanceData: { jurisdiction: 'OR', charges: [], chargesUnknown: true, caseStage: 'pretrial', custodyStatus: 'released', hasAttorney: false, guidanceMode: 'ai' },
      guidanceTimedOut: true, guidanceRecoveryError: false, guidanceRecoveryOffline: false, reviewingTimedOutAnswers: false,
    })));
    let releaseRequest: (() => void) | undefined;
    await page.route('**/api/legal-guidance/stream', async route => {
      await new Promise<void>(resolve => { releaseRequest = resolve; });
      await route.abort().catch(() => {});
    });
    await page.goto('/case-guidance');
    await expect(page.getByTestId('guidance-recovery-notice')).toBeVisible();
    for (const id of ['button-retry-ai-guidance', 'button-use-rules-guidance', 'button-review-guidance-answers']) await expect(page.getByTestId(id)).toBeVisible();
    await checkBounds(page, '.case-state-workspace :is(button,p,h1,[role=alert])');
    await settlePage(page);
    const symbol = await page.locator('.case-recovery-notice > svg').boundingBox();
    const title = await page.locator('.case-recovery-notice h1').boundingBox();
    expect(symbol!.y + symbol!.height).toBeLessThanOrEqual(title!.y);
    if (language === 'en') await page.screenshot({ path: testInfo.outputPath(`case-recovery-${theme}-mobile.png`) });
    await page.getByTestId('button-retry-ai-guidance').click();
    await expect(page.getByTestId('guidance-loading')).toBeVisible();
    await expect(page.getByRole('status').filter({ hasText: /./ }).first()).toBeVisible();
    await expect(page.locator('.case-loading-ring')).toHaveCSS('animation-name', 'none');
    await checkBounds(page, '.case-state-workspace :is(button,p,h1,[role=progressbar])');
    await page.getByTestId('button-cancel-guidance-request').click();
    await expect(page.getByTestId('guidance-loading')).toBeHidden();
    releaseRequest?.();
  });
}

for (const [language, title] of Object.entries({ en: 'Guidance: Example charge in OR', es: 'Orientación: Example charge en OR', zh: '案件指引：Example charge（OR）' })) {
  test(`charge-specific heading uses the selected language: ${language}`, async ({ page }) => {
    await setup(page, language);
    await page.route('**/api/legal-guidance/design-results', route => route.fulfill({ json: { success: true, guidance: { ...guidance, chargeClassifications: [{ name: 'Example charge', classification: 'Example', code: '' }] } } }));
    await page.goto('/case-guidance?session=design-results');
    await expect(page.getByTestId('guidance-dashboard').getByRole('heading', { level: 1 })).toHaveText(title);
  });
}

for (const hasAttorney of [true, false, null]) {
  test(`reader preserves qualifications across web, printed pages and downloaded PDF (counsel: ${hasAttorney})`, async ({ page }, testInfo) => {
    const { PDFParse } = await import('pdf-parse');
    const known = hasAttorney !== null;
    const charge = { id: 'ca-petty-theft', code: '484', name: 'Petty Theft', classification: 'misdemeanor' };
    const plan = {
      ...guidance,
      caseData: { jurisdiction: 'CA', caseStage: known ? 'arrest' : 'unsure', custodyStatus: known ? 'released' : 'unsure', hasAttorney },
      chargeClassifications: known ? [charge] : [],
      mockQA: [{ question: 'Practice question fixture', suggestedResponse: 'Nested answer fixture', explanation: 'Attached qualification fixture' }],
      collateralConsequences: [{ category: 'housing', consequence: 'Housing possibility fixture', timing: 'Only if condition applies', actionNote: 'Housing detail fixture' }],
    };
    await setup(page);
    await page.route('**/api/criminal-charges?**', route => route.fulfill({ json: {
      success: true, charges: [charge], count: 1, totalAvailable: 1,
      pagination: { offset: 0, limit: 500, totalMatches: 1, snapshot: 'a'.repeat(64), nextOffset: null },
    } }));
    await page.route('**/api/legal-guidance/design-results', route => route.fulfill({ json: { success: true, guidance: plan } }));
    await page.goto('/case-guidance?session=design-results');
    const screen = page.getByTestId('guidance-dashboard');
    const counsel = hasAttorney === null ? 'If you have a lawyer' : hasAttorney ? 'Your lawyer can go over' : 'Before court, you can ask';
    const fragments = [plan.overview, ...plan.criticalAlerts, plan.deadlines[0].description, ...plan.avoidActions,
      ...plan.courtPreparation, ...plan.evidenceToGather, ...plan.rights, ...plan.warnings, ...plan.nextSteps,
      plan.uncertainties[0].note, ...Object.values(plan.mockQA[0]), plan.collateralConsequences[0].timing,
      plan.collateralConsequences[0].actionNote, plan.resources[0].description, 'No confirmed hearing date', counsel];
    if (known) fragments.push('Theft by trick', 'repeat-theft', 'Which release conditions apply', 'Which statute and classification');
    await expect(screen.getByRole('heading', { name: 'Prepare for Court', exact: true })).toBeVisible();
    if (!known) {
      await expect(screen.getByText('Current', { exact: true })).toHaveCount(0);
      await expect(screen.getByText('Documents you may receive', { exact: true })).toHaveCount(0);
    }
    await screen.getByTestId('button-toggle-dynamic-response-0').click();
    for (const fragment of fragments) await expect(screen).toContainText(fragment);
    await screen.getByTestId('button-toggle-dynamic-response-0').click();
    await screen.getByTestId('collapsible-uncertainties').click();

    async function verifyDocument(bytes: Buffer) {
      const parser = new PDFParse({ data: new Uint8Array(bytes) });
      try {
        const document = (await parser.getText()).text.replace(/\s+/g, ' ');
        for (const fragment of fragments) expect(document).toContain(fragment);
      } finally {
        await parser.destroy();
      }
    }

    await page.emulateMedia({ media: 'print' });
    await expect(screen).toBeHidden();
    await verifyDocument(await page.pdf({ path: testInfo.outputPath('browser-print.pdf'), format: 'Letter' }));
    await page.emulateMedia({ media: 'screen' });
    await page.getByTestId('button-export-pdf').click();
    const pending = page.waitForEvent('download');
    await page.getByTestId('button-confirm-export').click();
    const download = await pending;
    const path = testInfo.outputPath('export.pdf');
    await download.saveAs(path);
    const { readFile } = await import('node:fs/promises');
    await verifyDocument(await readFile(path));
  });
}
