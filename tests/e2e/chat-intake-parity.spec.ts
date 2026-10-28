import { expect, test, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const chargeId = 'ny-possession-of-controlled-substance';
const charge = JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e',
  'import {getChargeById} from "./shared/criminal-charges.ts"; console.log(JSON.stringify(getChargeById(process.argv[1])))', chargeId], { encoding: 'utf8' }));
const guidance = { overview: 'Chat intake parity fixture.', criticalAlerts: [], immediateActions: [], nextSteps: [], deadlines: [], rights: [], resources: [], warnings: [], evidenceToGather: [], courtPreparation: [], avoidActions: [], timeline: [] };
const result = { success: true, sessionId: 'chat-parity-result', guidance };

async function setup(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/api/ai/status', route => route.fulfill({ json: { available: true } }));
  await page.route('**/api/captcha/config', route => route.fulfill({ json: { required: false } }));
  await page.route('**/api/criminal-charges?**', route => route.fulfill({ json: {
    success: true, charges: [charge], count: 1, totalAvailable: 1,
    pagination: { offset: 0, limit: 500, totalMatches: 1, nextOffset: null, snapshot: createHash('sha256').update(JSON.stringify([charge])).digest('hex') },
  } }));
}
async function choose(page: Page, id: string, name: string | RegExp) {
  await page.getByTestId(id).click();
  await page.getByRole('option', { name, exact: typeof name === 'string' }).click();
}
async function intake(page: Page, mode: string, known: boolean) {
  await page.getByTestId(`button-choose-${mode}`).click();
  await choose(page, 'select-jurisdiction', known ? 'New York' : 'Puerto Rico');
  if (!known) await expect(page.getByText('Limited coverage for U.S. territories')).toBeVisible();
  await page.getByTestId('button-next-jurisdiction').click();
  if (known) {
    await page.getByTestId(`checkbox-charge-${chargeId}`).locator('..').click();
  } else await page.locator('#charges-unknown').click();
  await page.getByTestId('button-next-case-details').click();
  await choose(page, 'select-case-stage', /Pre-trial/i);
  await choose(page, 'select-custody-status', /not in custody/i);
  await choose(page, 'select-has-attorney', 'No');
  await page.getByTestId('button-continue-status').click();
  if (known) {
    await choose(page, 'select-school-zone-status', /Yes/);
    await choose(page, 'select-supervision-status', 'Yes, probation');
    await choose(page, 'select-prior-convictions', 'Yes');
    await choose(page, 'select-citizenship-status', /Non-citizen/);
    for (const id of ['select-minor-children', 'select-professional-license', 'select-housing-assistance']) await choose(page, id, 'Yes');
  } else await expect(page.getByTestId('select-school-zone-status')).toHaveCount(0);
  await page.getByTestId('button-continue-background').click();
  if (known) {
    await page.getByTestId('button-select-concerns').click();
    await page.getByTestId('concern-option-housing').click();
    await page.getByTestId('concern-option-immigration').click();
    await page.getByTestId('button-select-concerns').click();
  }
  await page.locator('.case-intake .case-continue').click();
  if (known) {
    await expect(page.getByTestId('button-generate-guidance')).toBeDisabled();
    await page.getByTestId('urgency-housing-active').click();
    await page.getByTestId('urgency-immigration-emergency').click();
  }
  await expect(page.getByTestId('button-generate-guidance')).toBeEnabled();
}
for (const mode of ['ai', 'rules']) for (const known of [true, false]) {
  test(`identical submitted answers: ${mode}/${known ? 'NY charge and background' : 'unknown charges and territory'}`, async ({ page }, testInfo) => {
    await setup(page);
    const payloads: unknown[] = [];
    let wrongEndpoint = 0;
    await page.route('**/api/legal-guidance', route => { wrongEndpoint++; return route.abort(); });
    const endpoint = mode === 'ai' ? 'stream' : 'rules';
    await page.route(`**/api/legal-guidance/${endpoint}`, route => {
      payloads.push(route.request().postDataJSON());
      return mode === 'ai'
        ? route.fulfill({ contentType: 'text/event-stream', body: `data: ${JSON.stringify({ type: 'complete', ...result })}\n\n` })
        : route.fulfill({ json: result });
    });
    for (const surface of ['form', 'conversation']) {
      await page.goto(surface === 'form' ? '/case-guidance' : '/chat?flow=case-roadmap');
      if (surface === 'form') await page.getByTestId('button-start-guidance').click();
      await intake(page, mode, known);
      if (surface === 'conversation') {
        await expect(page.locator('.intake-exchange')).toHaveCount(6);
        await expect(page.locator('.intake-transcript')).not.toContainText('design.chat');
        await page.screenshot({ path: testInfo.outputPath('conversation-final-step.png'), fullPage: true });
      }
      await page.getByTestId('button-generate-guidance').click();
      await expect(page.getByTestId('guidance-dashboard')).toBeVisible();
    }
    expect(wrongEndpoint).toBe(0);
    expect(payloads).toHaveLength(2);
    expect(payloads[1]).toEqual(payloads[0]);
    expect(payloads[1]).toMatchObject({ guidanceMode: mode, consentGiven: true, jurisdiction: known ? 'NY' : 'PR', chargesUnknown: !known, charges: known ? [chargeId] : [], hasAttorney: false,
      ...(known ? { schoolZoneStatus: 'yes', supervisionStatus: 'probation', priorConvictions: true, citizenshipStatus: 'non_citizen', hasMinorChildren: true, hasProfessionalLicense: true, hasHousingAssistance: true, selectedConcerns: ['housing', 'immigration'], civilUrgency: { housing: 'active', immigration: 'emergency' } } : { selectedConcerns: [], civilUrgency: {}, schoolZoneStatus: '' }),
    });
  });
}

test('chat recovery survives reload and cancellation returns to chat', async ({ page }) => {
  await setup(page);
  await page.route('**/api/legal-guidance/rules', route => route.fulfill({ status: 503, json: { success: false } }));
  await page.route('**/api/session/clear', route => route.fulfill({ json: { success: true } }));
  await page.goto('/chat?flow=case-roadmap');
  await intake(page, 'rules', false);
  await page.getByTestId('button-generate-guidance').click();
  await expect(page.getByTestId('button-review-guidance-answers')).toBeVisible();
  await page.reload();
  await page.getByTestId('button-review-guidance-answers').click();
  await expect(page.getByTestId('qa-step-label')).toContainText('Step 7 of 7');
  await expect(page.locator('.intake-exchange')).toHaveCount(6);
  await page.getByTestId('button-prev-civil-emergencies').click();
  await page.getByTestId('button-prev-additional-details').click();
  await page.getByTestId('button-prev-background').click();
  await expect(page.getByTestId('select-case-stage')).toContainText(/Pre-trial/i);
  await page.getByTestId('button-cancel-qa').click();
  await expect(page).toHaveURL(/\/chat$/);
  expect(await page.evaluate(() => sessionStorage.getItem('open-defender:case-guidance-recovery'))).toBeNull();
});

test('chat final submission requires CAPTCHA and sends its verified token', async ({ page }) => {
  await setup(page);
  await page.route('**/api/captcha/config', route => route.fulfill({ json: { required: true, siteKey: 'test-site-key' } }));
  await page.route('https://challenges.cloudflare.com/**', route => route.fulfill({ contentType: 'application/javascript', body: `
    window.turnstile = { render: (_, options) => { window.verifyTestCaptcha = options.callback; return 'test-widget'; }, remove() {}, reset() {} };
    window.onTurnstileLoad?.();
  ` }));
  await page.addInitScript(() => sessionStorage.setItem('open-defender:case-guidance-recovery', JSON.stringify({
    reviewingTimedOutAnswers: true, guidanceTimedOut: false,
    pendingGuidanceData: { guidanceMode: 'ai', consentGiven: true, jurisdiction: 'PR', charges: [], chargesUnknown: true, caseStage: 'pretrial', custodyStatus: 'released', selectedConcerns: [], civilUrgency: {} },
  })));
  const requests: any[] = [];
  await page.route('**/api/legal-guidance/stream', route => {
    requests.push(route.request().postDataJSON());
    return route.fulfill({ contentType: 'text/event-stream', body: `data: ${JSON.stringify({ type: 'complete', ...result })}\n\n` });
  });
  await page.goto('/chat?flow=case-roadmap');
  await expect(page.getByTestId('button-generate-guidance')).toBeDisabled();
  expect(requests).toHaveLength(0);
  await expect.poll(() => page.evaluate(() => typeof (window as any).verifyTestCaptcha)).toBe('function');
  await page.evaluate(() => (window as any).verifyTestCaptcha('verified-test-token'));
  await page.getByTestId('button-generate-guidance').click();
  await expect(page.getByTestId('guidance-dashboard')).toBeVisible();
  expect(requests).toHaveLength(1);
  expect(requests[0].captchaToken).toBe('verified-test-token');
});

test('chat clear-session uses the shared confirmation and clears recovery data', async ({ page }) => {
  await setup(page);
  let clearCount = 0;
  await page.route('**/api/session/clear', route => {
    clearCount++;
    return route.fulfill({ json: { success: true } });
  });
  await page.goto('/chat?flow=case-roadmap');
  await page.getByTestId('button-choose-rules').click();
  await expect(page.getByTestId('select-jurisdiction')).toBeVisible();
  await page.getByTestId('button-open-clear-session').click();
  expect(clearCount).toBe(0);
  await page.getByTestId('button-confirm-clear-session').click();
  await expect(page).toHaveURL(/\/chat$/);
  expect(clearCount).toBe(1);
  expect(await page.evaluate(() => sessionStorage.getItem('open-defender:case-guidance-recovery'))).toBeNull();
});
