import { expect, test, type Page } from '@playwright/test';
import published from '../fixtures/attorney-access-published-content';
const explanatoryCopy = {
  en: ['Please verify your bar membership to access document generation tools.', 'Confirm the required attestations to access attorney document tools.'],
  es: ['Por favor verifique su membresía al colegio de abogados para acceder a las herramientas de generación de documentos.', 'Confirme las certificaciones requeridas para acceder a las herramientas de documentos para abogados.'],
  zh: ['请验证您的律师执照以使用文件生成工具。', '确认所需的认证声明以使用律师文件工具。'],
};
async function mockAccess(page: Page, enabled = true, verified = false) {
  await page.route('**/api/attorney/config', r => r.fulfill({ json: { success: true, enabled } }));
  await page.route('**/api/attorney/session', r => r.fulfill({ json: { success: true, isVerified: verified,
    expiresAt: new Date(Date.now() + 3600_000).toISOString(), timeRemaining: 3600 } }));
  await page.route('**/api/attorney/templates**', r => r.fulfill({ json: { success: true, templates: [] } }));
}
for (const language of ['en', 'es', 'zh'] as const) for (const theme of ['light', 'dark']) {
  test(`attorney access: ${language}/${theme}`, async ({ page }, info) => {
    await page.addInitScript(({language, theme}) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('public-defender-theme', theme);
    }, {language, theme});
    await mockAccess(page);
    let submissions: unknown[] = [];
    await page.route('**/api/attorney/verify', async r => {
      submissions.push(r.request().postDataJSON());
      await r.fulfill(submissions.length === 1
        ? {status: 400, json: { success: false, error: 'Verification unavailable. Please retry.' }}
        : {json: { success: true, expiresAt: new Date(Date.now()+3600_000).toISOString() }});
    });
    await page.goto('/attorney/verify');
    const root = page.locator('.attorney-access-width');
    // The old English-only subtitle is intentionally replaced by the existing locale copy.
    for (const text of published[language].filter(text => text !== explanatoryCopy.en[0])) await expect(root).toContainText(text);
    await expect(root.locator('.attorney-access-heading p')).toHaveText(explanatoryCopy[language][0]);
    await expect(root.locator('.attorney-access-description')).toHaveText(explanatoryCopy[language][1]);
    await expect(root.locator('.attorney-access-heading p[lang], .attorney-access-description[lang]')).toHaveCount(0);
    await expect(root).not.toContainText('Enter your bar association information');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(root.getByRole('checkbox')).toHaveCount(3);
    await expect(root.getByRole('textbox')).toHaveCount(0);
    await expect(root.locator('a[href="/attorney"]')).toBeVisible();
    await expect(root.locator('a[href="/disclaimers"]')).toHaveAttribute('target', '_blank');
    await root.locator('button[type=submit]').click();
    expect(submissions).toHaveLength(0);
    await expect(root.getByRole('checkbox').first()).toBeFocused();
    await expect(root).toContainText('You must confirm you are a licensed attorney acting on behalf of a client');
    for (const box of await root.getByRole('checkbox').all()) { await box.focus(); await page.keyboard.press('Space'); }
    for (const width of [1280, 320]) {
      await page.setViewportSize({width,height:900});
      expect(await root.locator('*').evaluateAll(nodes => nodes.filter(n => {
        const r=n.getBoundingClientRect(); return r.width>0 && (r.left < -1 || r.right > innerWidth+1);
      }).map(n => ({tag:n.tagName, cls:n.className, type:n.getAttribute('type'),left:n.getBoundingClientRect().left,right:n.getBoundingClientRect().right})))) .toEqual([]);
      await info.attach(`${language}-${theme}-${width}`, {body:await page.screenshot({fullPage:true}),contentType:'image/png'});
      if (language==='en' && theme==='light' && width===1280) await page.screenshot({path:'/tmp/od-attorney-access-desktop.png',fullPage:true});
      if (language==='zh' && theme==='dark' && width===320) await page.screenshot({path:'/tmp/od-attorney-access-mobile.png',fullPage:true});
    }
    await root.locator('button[type=submit]').click();
    await expect(root.getByRole('alert').filter({hasText:'Verification unavailable'})).toBeVisible();
    for (const box of await root.getByRole('checkbox').all()) await expect(box).toBeChecked();
    expect(submissions[0]).toEqual({attestations:{isLicensedAttorney:true,actingOnBehalfOfClient:true,understandsPrivilegeRequirements:true,acceptsDisclosures:true}});
    await root.locator('button[type=submit]').click();
    await expect(page).toHaveURL(/\/attorney\/documents$/);
    expect(submissions).toHaveLength(2);
  });
}
test('disabled portal still redirects without offering attestations', async ({page}) => {
  await mockAccess(page,false);
  await page.goto('/attorney/verify');
  await expect(page).toHaveURL(/\/directory$/);
  await expect(page.locator('.attorney-access')).toHaveCount(0);
});
test('verified session still proceeds to documents', async ({page}) => {
  await mockAccess(page,true,true);
  await page.goto('/attorney/verify');
  await expect(page).toHaveURL(/\/attorney\/documents$/);
});
test('pending verification disables submit and retains all attestations', async ({page}) => {
  await mockAccess(page);
  let release!: () => void;
  const wait = new Promise<void>(r=>release=r);
  await page.route('**/api/attorney/verify', async r => { await wait; await r.fulfill({status:400,json:{success:false,error:'Try again'}}); });
  await page.goto('/attorney/verify');
  const root=page.locator('.attorney-access-width');
  await expect(root.getByRole('checkbox')).toHaveCount(3);
  for (const box of await root.getByRole('checkbox').all()) await box.check();
  await root.locator('button[type=submit]').click();
  await expect(root.locator('button[type=submit]')).toBeDisabled();
  await expect(root.locator('button[type=submit]')).toContainText('Verifying');
  release(); await expect(root.locator('button[type=submit]')).toBeEnabled();
});
