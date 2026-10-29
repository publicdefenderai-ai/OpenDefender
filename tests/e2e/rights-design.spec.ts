import { test, expect } from '@playwright/test';
import en from '../../client/src/locales/en';
import es from '../../client/src/locales/es';
import zh from '../../client/src/locales/zh';

// Translation keys rendered by the pre-refresh detailed sections.
const retainedKeys = {
  "miranda": [
    "title",
    "completeWarning",
    "warning1",
    "warning2",
    "warning3",
    "warning4",
    "warning5",
    "warning6",
    "whenApply",
    "apply1",
    "apply2",
    "apply3",
    "apply4",
    "alertTitle",
    "alertText"
  ],
  "arrest": [
    "title",
    "keyPoints",
    "c1",
    "c2",
    "c3",
    "c4",
    "c5",
    "policePowers",
    "power1",
    "power2",
    "power3",
    "power4"
  ],
  "court": [
    "title",
    "constitutional",
    "right1",
    "right2",
    "right3",
    "right4",
    "right5",
    "burdenProof",
    "burden1",
    "burden2",
    "burden3",
    "burden4",
    "etiquetteTitle",
    "etiquetteText"
  ],
  "prison": [
    "title",
    "continuing",
    "right1",
    "right2",
    "right3",
    "right4",
    "right5",
    "right6",
    "afterRelease",
    "after1",
    "after2",
    "after3",
    "after4",
    "after5",
    "collateralTitle",
    "collateralText"
  ]
} as const;

for (const [language, locale] of Object.entries({ en, es, zh })) for (const theme of ['light', 'dark']) {
  test(`Rights disclosures, illustration and responsive content: ${language}/${theme}`, async ({ page }, info) => {
    const copy = locale.translation.rights;
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('public-defender-theme', theme);
    }, { language, theme });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/rights-info');
    await expect(page.getByTestId('heading-rights-title')).toBeVisible();
    await expect(page.locator('#main-content > div').first()).toHaveCSS('opacity', '1');
    const explainer = page.locator('.rights-explainer');
    await expect(explainer.locator('h2')).toHaveText(copy.design.explainer.title);
    const controls = explainer.locator('.rights-explainer-controls button');
    await expect(controls.nth(0)).toBeDisabled();
    expect(await explainer.locator('.rights-explainer-art span').first().evaluate(el => parseFloat(getComputedStyle(el).transitionDuration))).toBeLessThan(0.001);
    for (let step = 0; step < 4; step++) {
      await expect(explainer.locator('.rights-explainer-panel')).toContainText(copy.design.explainer.steps[step].body);
      if (step < 3) { await controls.nth(1).focus(); await page.keyboard.press('Enter'); }
    }
    await expect(controls.nth(1)).toBeDisabled();
    await page.setViewportSize({ width: 320, height: 900 });
    const labelsOverlap = await explainer.locator('.rights-explainer-art b').evaluateAll(labels => {
      const [a, b] = labels.map(el => el.getBoundingClientRect());
      return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    });
    expect(labelsOverlap).toBe(false);
    await controls.nth(0).click();
    await expect(explainer.locator('.rights-explainer-art')).toHaveAttribute('data-step', '2');
    await controls.nth(2).click();
    await expect(explainer.locator('.rights-explainer-art')).toHaveAttribute('data-step', '0');
    await explainer.locator('summary').click();
    for (const step of copy.design.explainer.steps) await expect(explainer.locator('.rights-transcript')).toContainText(step.body);
    await expect(explainer).toContainText(copy.design.explainer.note);
    await expect(explainer.locator('.rights-explainer-sources a')).toHaveCount(2);
    for (const key of ['silent', 'attorney', 'phoneCall', 'knowCharges'] as const) {
      const detail = page.locator(`#right-${key}`);
      await detail.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(detail).toHaveAttribute('open', '');
      await expect(detail).toContainText(copy.quickRights[key].description);
      await expect(detail).toContainText(copy.quickRights[key].detailedExplanation);
    }
    // Every existing string used in these detailed components must remain visible.
    for (const topic of ['miranda', 'arrest', 'court', 'prison'] as const) {
      await page.getByTestId(`tab-${topic}`).click();
      const panel = page.locator(`#rights-${topic}`);
      for (const key of retainedKeys[topic]) await expect(panel).toContainText((copy.detailedRights[topic] as Record<string, string>)[key]);
    }
    await page.getByTestId('tab-search').click();
    await expect(page.locator('#constitutional-rights > div > details[open]')).toHaveCount(5);
    for (const scenario of ['Stop and Frisk', 'Vehicle Search', 'Home Search', 'Search of Your Person', 'Phone Search']) {
      await page.getByRole('button').filter({ hasText: scenario }).first().click();
    }
    await expect(page.getByText(/This does not lower the probable-cause standard/)).toBeVisible();
    await expect(page.getByText(/foregone-conclusion doctrine/)).toBeVisible();
    await expect(page.locator('.rights-closing')).toContainText(copy.disclaimer.text);
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const clipped = await page.locator('.rights-page').evaluate(root => [...root.querySelectorAll('p,h1,h2,h3,h4,li,summary,a,button')].filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
      }).map(el => el.textContent));
      expect(clipped).toEqual([]);
      await page.screenshot({ path: info.outputPath(`rights-${width}.png`), fullPage: true });
    }
    await page.goto('/rights-info#rights-search');
    await expect(page.locator('#rights-search')).toHaveAttribute('open', '');
    await expect(page.locator('#rights-search')).toBeInViewport();
    await page.getByTestId('button-open-printable-rights-cards').click();
    await expect(page).toHaveURL(/\/quick-reference-cards$/);
  });
}

test('illustration moves only on request and replays without autoplay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/rights-info');
  const art = page.locator('.rights-explainer-art');
  const controls = page.locator('.rights-explainer-controls button');
  await expect(art).toHaveAttribute('data-step', '0');
  await expect(art.locator('span').first()).toHaveCSS('transition-duration', '0.6s');
  await controls.nth(1).click();
  await expect(art.locator('span').first()).toHaveCSS('left', '12px');
  await page.clock.install();
  await page.clock.fastForward(10000);
  await expect(art).toHaveAttribute('data-step', '1');
  await controls.nth(2).click();
  await expect(art).toHaveAttribute('data-step', '0');
});
