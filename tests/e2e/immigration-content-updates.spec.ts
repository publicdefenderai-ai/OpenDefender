import { expect, test } from '@playwright/test';
import en from '../../client/src/locales/en';
import es from '../../client/src/locales/es';
import zh from '../../client/src/locales/zh';
import { immigrationUpdates } from '../../client/src/locales/immigration-updates';
import { kyrScripts } from '../../shared/data/kyr-scripts';

for (const [lang, locale] of Object.entries({ en, es, zh })) {
  test(`immigration status, workplace and detention qualifications render in ${lang}`, async ({ page }) => {
    await page.addInitScript(lang => localStorage.setItem('i18nextLng', lang), lang);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const copy = immigrationUpdates[lang as keyof typeof immigrationUpdates];
    const t = locale.translation.immigration;
    await page.goto('/immigration-guidance/daca-tps');
    for (const paragraph of copy.framework) await expect(page.getByText(paragraph, { exact: true })).toBeVisible();
    await expect(page.getByText(copy.currentTps, { exact: true })).toBeVisible();
    await expect(page.getByText(t.daca.dacaSection.renewalText, { exact: true })).toBeVisible();
    await page.goto('/immigration-guidance/workplace-raids');
    await expect(page.getByText(t.raids.employer.must3, { exact: true })).toBeVisible();
    await expect(page.getByText(t.raids.yourRights.refuseText, { exact: true })).toBeVisible();
    await page.goto('/immigration-guidance/bond-hearings');
    await expect(page.getByText(copy.postOrder, { exact: true })).toBeVisible();
    await expect(page.getByText(t.bond.eligibility.mandatory5, { exact: true })).toBeVisible();
    await expect(page.getByText(t.bond.resources.raicesText, { exact: true })).toBeVisible();
    await expect(page.locator('#main-content')).not.toContainText('immigration.bond.');
  });
}
for (const lang of ['en', 'es'] as const) {
  test(`warrant information has no automated verdict and encounter caveats remain visible: ${lang}`, async ({ page }) => {
    await page.addInitScript(lang => localStorage.setItem('i18nextLng', lang), lang);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/immigration-guidance/know-your-rights');
    await expect(page.getByTestId('warrant-observations')).toContainText(lang === 'en' ? 'do not determine validity' : 'no determinan su validez');
    await expect(page.getByRole('button', { name: /Warrant Checker|Verificador de Órdenes/ })).toHaveCount(0);
    await expect(page.getByText(/THIS IS NOT A VALID JUDICIAL WARRANT|ESTO NO ES UNA ORDEN JUDICIAL VÁLIDA/)).toHaveCount(0);
    for (const id of ['traffic', 'workplace', 'public']) {
      const script = kyrScripts.find(s => s.id === id)!;
      await page.getByRole('button', { name: script.scenario[lang] }).click();
      for (const tip of script.tips[lang]) await expect(page.getByRole('listitem').filter({ hasText: tip })).toBeVisible();
    }
  });
  test(`locator documents both search routes and excluded records: ${lang}`, async ({ page }, testInfo) => {
    await page.addInitScript(lang => localStorage.setItem('i18nextLng', lang), lang);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/immigration-guidance/find-detained');
    const body = page.locator('#main-content');
    await expect(body).toContainText(lang === 'en' ? 'A-Number AND country of birth' : 'Número A Y país de nacimiento');
    await expect(body).toContainText('001234567');
    await expect(body).toContainText(lang === 'en' ? 'People under 18 are not listed' : 'Los menores de 18 años no aparecen');
    await expect(body).toContainText(lang === 'en' ? 'CBP custody for less than 48 hours' : 'menos de 48 horas bajo custodia de CBP');
    await expect(body).toContainText(lang === 'en' ? 'excluding federal holidays' : 'excepto feriados federales');
    await expect(page.getByTestId('link-ice-detention-reporting')).toHaveAttribute('href', 'tel:18883514024');
    await page.screenshot({ path: testInfo.outputPath(`locator-${lang}.png`), fullPage: true });
  });
}
