import { test, expect } from '@playwright/test';
import captured from '../fixtures/immigration-rights-published-content';
import { kyrScripts, redCardContent } from '../../shared/data/kyr-scripts';
import { immigrationRightsDesignCopy } from '../../client/src/locales/immigration-rights-design';
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim().toLowerCase();
for (const language of ['en', 'es', 'zh'] as const) for (const theme of ['light', 'dark']) {
  test(`Immigration rights content and tools: ${language}/${theme}`, async ({ page, context }, info) => {
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('public-defender-theme', theme);
    }, { language, theme });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/immigration-guidance/know-your-rights');
    const root = page.locator('.immigration-rights-page');
    const reading = root.locator('.immigration-rights-reading');
    const lang = language === 'es' ? 'es' : 'en';
    await expect(reading).toHaveAttribute('lang', lang);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(root.locator('h1')).toContainText(immigrationRightsDesignCopy[language].title);
    let allText = await reading.textContent() || '';
    for (const script of kyrScripts) {
      const button = root.locator(`#encounter-${script.id}-trigger`);
      if (await button.getAttribute('aria-expanded') !== 'true') {
        await button.focus(); await page.keyboard.press('Enter');
      }
      await expect(button).toHaveAttribute('aria-expanded', 'true');
      await expect(root.locator(`#encounter-${script.id}`)).toBeVisible();
      await expect(root.locator('.immigration-rights-scenario-body')).toHaveCount(1);
      allText += await reading.textContent();
    }
    for (const fragment of captured[language]) expect(normalize(allText), fragment).toContain(normalize(fragment));
    await expect(root.getByTestId('warrant-observations')).toContainText(lang === 'en' ? 'do not determine validity' : 'no determinan su validez');
    const nav = root.getByRole('navigation', { name: immigrationRightsDesignCopy[language].nav });
    await nav.getByRole('link', { name: immigrationRightsDesignCopy[language].warrants }).click();
    await expect(root.locator('#warrant-guide')).toBeInViewport();
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await root.locator('h1,h2,p,button,a,select').evaluateAll(elements => elements.filter(el => el.checkVisibility()).filter(el => { const r = el.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1; }).map(el => el.textContent?.slice(0, 100)));
      expect(overflow).toEqual([]);
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: info.outputPath(`rights-${width}.png`) });
    }
    const cards = root.locator('#rights-cards');
    const labels = language === 'es' ? ['Tarjeta de Billetera', 'Colgador de Puerta', 'Letrero de Ventana'] : language === 'zh' ? ['钱包卡', '门挂牌', '窗户标识'] : ['Wallet Card', 'Door Hanger', 'Window Sign'];
    for (const [index, card] of redCardContent.entries()) {
      await cards.getByRole('button', { name: labels[index], exact: true }).click();
      await expect(cards.getByText(card.instructions[language], { exact: true })).toBeVisible();
      const popupPromise = context.waitForEvent('page');
      await cards.getByRole('button', { name: /Print Card|Imprimir Tarjeta|打印卡片/ }).click();
      const popup = await popupPromise;
      await popup.waitForLoadState();
      for (const text of [...card.frontText.en, ...card.backText.en, ...card.frontText.es, ...card.backText.es]) await expect(popup.locator('body')).toContainText(text);
      await popup.close();
    }
  });
}
