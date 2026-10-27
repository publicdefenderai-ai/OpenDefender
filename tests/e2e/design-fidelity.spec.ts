import { expect, test } from '@playwright/test';

test.describe('approved homepage presentation', () => {
  for (const width of [320, 390, 1440]) {
    test(`doorway, equal actions and four paths at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/');
      const art = page.locator('.design-open-door');
      await expect(art).toBeVisible();
      await expect(art).toHaveCSS('height', `${width <= 360 ? 100 : width <= 700 ? 125 : 310}px`);
      const cutout = await art.evaluate(element => {
        const style = getComputedStyle(element, '::after');
        return { height: parseFloat(style.height), origin: style.transformOrigin };
      });
      expect(cutout.origin).toBe('0px 0px');
      expect(cutout.height).toBeCloseTo((width <= 360 ? 100 : width <= 700 ? 125 : 310) * .8, 0);
      const actions = await page.locator('.design-urgent-button, .design-how-button').evaluateAll(elements => elements.map(element => {
        const rect = element.getBoundingClientRect();
        return { width: rect.width, height: rect.height, top: rect.top };
      }));
      expect(actions).toHaveLength(2);
      expect(actions[0].width).toBeCloseTo(actions[1].width, 0);
      expect(actions[0].height).toBeCloseTo(actions[1].height, 0);
      expect(actions[0].top).toBeCloseTo(actions[1].top, 0);
      await expect(page.locator('#paths .design-path')).toHaveCount(4);
      expect(await page.locator('#paths .design-path').evaluateAll(elements => elements.map(element => element.getAttribute('href')))).toEqual([
        '/first-24-hours', '/case-guidance', '/immigration-guidance', '/support',
      ]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }

  test('mobile theme is available before opening the menu, and menu restores focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const trigger = page.getByTestId('button-menu');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByTestId('button-theme')).toBeVisible();
    await trigger.click();
    const nav = page.getByRole('navigation', { name: 'Site menu' });
    await expect(nav.getByRole('link', { name: 'How to use this site' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'All resources', exact: true })).toBeVisible();
    await expect(nav.locator('details[open]')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(nav).toHaveCount(0);
  });
});
