import { test, expect, type Page } from '@playwright/test';
import en from '../../client/src/locales/en';
import es from '../../client/src/locales/es';
import zh from '../../client/src/locales/zh';

const pdPattern = '**/api/local-resources/public-defenders?*';
const laPattern = '**/api/legal-aid-organizations/proximity?*';
const office = { id: 'fictional-pd', name: 'Fictional Defense Office', address: '123 Example Street', county: 'Example', phone: '555-0100', email: 'office@example.invalid', services: ['Criminal defense'], distanceValue: 2.5 };
const organization = { id: 'fictional-aid', name: 'Fictional Legal Aid', address: '456 Example Street', city: 'Example City', state: 'CA', zipCode: '90210', county: 'Example', phone: '555-0200', email: 'aid@example.invalid', services: ['Civil legal aid'], distance: 3.45, organizationType: 'civil_legal_aid' };
async function setup(page: Page, language = 'en', theme = 'light') {
  await page.addInitScript(({ language, theme }) => {
    localStorage.setItem('i18nextLng', language);
    localStorage.setItem('public-defender-theme', theme);
    window.open = ((url: string) => { (window as any).directionsUrl = url; return null; }) as typeof window.open;
  }, { language, theme });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/legal-aid');
  await expect(page.locator('.legal-finder')).toBeVisible();
  await expect(page.locator('#main-content > div').first()).toHaveCSS('opacity', '1');
}
for (const [language, locale] of Object.entries({ en, es, zh })) for (const theme of ['light', 'dark']) {
  test(`inline legal finder contracts and layout: ${language}/${theme}`, async ({ page }, info) => {
    const requests: string[] = [];
    await page.route(pdPattern, route => { requests.push(route.request().url()); return route.fulfill({ json: { success: true, results: [office] } }); });
    await page.route(laPattern, route => { requests.push(route.request().url()); return route.fulfill({ json: { success: true, organizations: [organization, { ...organization, id: 'excluded', name: 'Excluded defense office', organizationType: 'public_defender' }] } }); });
    await page.setViewportSize({ width: 1280, height: 900 });
    await setup(page, language, theme);
    await expect(page.locator('.legal-intro h1')).toHaveText(locale.translation.resources.design.heading);
    await expect(page.locator('.legal-tools a')).toHaveCount(6);
    await page.screenshot({ path: info.outputPath('finder-desktop.png'), fullPage: true });
    await page.setViewportSize({ width: 320, height: 850 });
    const input = page.locator('#legal-help-zip');
    await expect(input).toHaveAccessibleName(locale.translation.resources.design.zip);
    await input.fill('12');
    await input.press('Enter');
    await expect(page.locator('#legal-finder-error')).toHaveText(locale.translation.home.publicDefenderSearch.error);
    expect(requests).toHaveLength(0);
    await input.fill('abc90210xyz');
    await expect(input).toHaveValue('90'); // Native maxlength runs before the existing digit sanitizer.
    await input.fill('90210');
    await input.press('Enter');
    await expect(page.locator('.legal-result')).toContainText(office.name);
    await expect(page.locator('.legal-result')).toContainText('2.5');
    await expect(page.locator('.legal-result a[href="tel:555-0100"]')).toBeVisible();
    await expect(page.locator('.legal-result a[href="mailto:office@example.invalid"]')).toBeVisible();
    await page.locator('.legal-result button').click();
    expect(await page.evaluate(() => (window as any).directionsUrl)).toBe('https://maps.google.com/maps?daddr=123%20Example%20Street');
    const pdUrl = new URL(requests[0]);
    expect(pdUrl.searchParams.get('zip')).toBe('90210');
    await page.getByTestId('card-legal-aid').check();
    await expect(input).toHaveValue('');
    await input.fill('10001');
    await input.press('Enter');
    await expect(page.locator('.legal-result')).toContainText(organization.name);
    await expect(page.locator('.legal-result')).toContainText('456 Example Street, Example City, CA, 90210');
    await expect(page.locator('.legal-result')).toContainText('3.5');
    await expect(page.locator('.legal-result')).toHaveCount(1);
    const laUrl = new URL(requests[1]);
    expect(laUrl.searchParams.get('zipCode')).toBe('10001');
    expect(laUrl.searchParams.get('radius')).toBe('50');
    await page.getByTestId('card-public-defender').check();
    await expect(input).toHaveValue('90210');
    await expect(page.locator('.legal-result')).toContainText(office.name);
    await input.fill('10001');
    await expect(page.locator('.legal-result')).toHaveCount(0);
    const clipped = await page.locator('.legal-resources-page').evaluate(root => [...root.querySelectorAll('h1,h2,h3,h4,p,li,a,input,button,label')].filter(el => {
      const r = el.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
    }).map(el => el.textContent));
    expect(clipped).toEqual([]);
    await page.screenshot({ path: info.outputPath('finder-mobile.png'), fullPage: true });
    await expect(page.locator('.legal-counsel')).toContainText('How to find the assigned counsel program near you');
    await expect(page.locator('.legal-counsel a[href="https://www.nlada.org"]')).toHaveCount(1);
    await expect(page.locator('.legal-counsel a[href="https://www.americanbar.org/groups/legal_services/flh-home/"]')).toHaveCount(1);
  });
}

for (const kind of ['pd', 'la'] as const) {
  test(`finder loading, empty, unavailable, retry and missing distance: ${kind}`, async ({ page }) => {
    let fulfill: (() => Promise<void>) | undefined;
    const pattern = kind === 'pd' ? pdPattern : laPattern;
    await page.route(pattern, route => { fulfill = () => route.fulfill({ json: kind === 'pd' ? { success: true, results: [] } : { success: true, organizations: [] } }); });
    await setup(page);
    await page.getByTestId(kind === 'pd' ? 'card-public-defender' : 'card-legal-aid').check();
    await page.locator('#legal-help-zip').fill('90210');
    await page.locator('.legal-fields button').click();
    await expect(page.locator('.legal-fields button')).toBeDisabled();
    await expect(page.locator('#legal-help-zip')).toBeDisabled();
    await expect(page.locator('.legal-results')).toHaveAttribute('aria-busy', 'true');
    await expect.poll(() => !!fulfill).toBe(true);
    await fulfill!();
    const copy = kind === 'pd' ? en.translation.home.publicDefenderSearch : en.translation.home.legalAidSearch;
    await expect(page.locator('.legal-search-status')).toHaveText(copy.noResults);
    await page.unroute(pattern);
    await page.route(pattern, route => route.fulfill({ status: 503, json: { success: false } }));
    await page.locator('.legal-fields button').click();
    await expect(page.getByRole('alert')).toHaveText(copy.errorGeneral);
    await expect(page.locator('.legal-search-status')).toBeEmpty();
    await expect(page.locator('#legal-help-zip')).toHaveAttribute('aria-invalid', 'false');
    await page.unroute(pattern);
    await page.route(pattern, route => route.fulfill({ json: kind === 'pd' ? { success: true, results: [{ ...office, distanceValue: undefined }] } : { success: true, organizations: [{ ...organization, distance: undefined }] } }));
    await page.locator('.legal-fields button').click();
    await expect(page.locator('.legal-result')).toHaveCount(1);
    await expect(page.locator('.legal-result')).not.toContainText(en.translation.home.publicDefenderSearch.milesAway);
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
}
