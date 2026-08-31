import { expect, test, type Page } from "@playwright/test";

const SUPPORT_SECTION_NAV = "On this page";

const SUPPORT_PAGES = [
  {
    path: "/support",
    sections: ["support-start", "support-screener", "support-topics", "support-partners"],
    navigationTarget: "support-topics",
    scrollTargets: {
      desktop: ["support-topics", "support-start"],
      mobile: ["support-topics", "support-start"],
    },
  },
  {
    path: "/support/employment",
    sections: ["section-start-here", "section-resources", "section-faq", "section-tips"],
    navigationTarget: "section-resources",
    scrollTargets: {
      desktop: ["section-faq", "section-start-here"],
      mobile: ["section-tips", "section-start-here"],
    },
  },
  {
    path: "/support/finances",
    sections: ["quick-actions", "benefits", "court-fees", "resources", "faqs"],
    navigationTarget: "faqs",
    scrollTargets: {
      desktop: ["benefits", "quick-actions"],
      mobile: ["benefits", "quick-actions"],
    },
  },
] as const;

const TRANSLATED_SUPPORT_PAGES = [
  {
    path: "/support",
    sections: ["support-start", "support-screener", "support-topics", "support-partners"],
    navigationTarget: "support-topics",
    scrollTargets: {
      desktop: ["support-topics", "support-start"],
      mobile: ["support-topics", "support-start"],
    },
    labels: {
      es: ["¿No sabe por dónde empezar?", "¿Fue arrestado recientemente o le acaban de presentar cargos?", "Explorar temas de apoyo", "Socios comunitarios"],
      zh: ["不知道从哪里开始？", "刚刚被捕或最近被指控？", "浏览支持主题", "社区合作伙伴"],
    },
  },
  {
    path: "/support/employment",
    sections: ["section-start-here", "section-resources", "section-faq", "section-tips"],
    navigationTarget: "section-resources",
    scrollTargets: {
      desktop: ["section-faq", "section-start-here"],
      mobile: ["section-tips", "section-start-here"],
    },
    labels: {
      es: ["Comience Aquí", "Recursos Útiles", "Preguntas frecuentes", "Consejos Útiles"],
      zh: ["从这里开始", "有用资源", "常见问题", "实用建议"],
    },
  },
  {
    path: "/support/finances",
    sections: ["quick-actions", "benefits", "court-fees", "resources", "faqs"],
    navigationTarget: "faqs",
    scrollTargets: {
      desktop: ["benefits", "quick-actions"],
      mobile: ["benefits", "quick-actions"],
    },
    labels: {
      es: ["Acciones rápidas", "Beneficios", "Tarifas judiciales", "Recursos", "Preguntas frecuentes y consejos"],
      zh: ["快速操作", "福利", "法庭费用", "资源", "常见问题与建议"],
    },
  },
] as const;

const TRANSLATED_SUPPORT_LANGUAGES = [
  { name: "Spanish", code: "es", navigationLabel: "En esta página" },
  { name: "Chinese", code: "zh", navigationLabel: "本页内容" },
] as const;

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

function sectionNavigation(page: Page, navigationLabel = SUPPORT_SECTION_NAV) {
  return page.getByRole("navigation", { name: navigationLabel });
}

async function expectExactlyOneActiveSection(
  page: Page,
  expectedId?: string,
  navigationLabel = SUPPORT_SECTION_NAV,
) {
  const navigation = sectionNavigation(page, navigationLabel);
  const activeLink = navigation.locator('a[aria-current="location"]');

  await expect(activeLink).toHaveCount(1);
  if (expectedId) {
    await expect(activeLink).toHaveAttribute("href", `#${expectedId}`);
  }
}

async function scrollToAndCheckActiveSection(
  page: Page,
  sectionId: string,
  navigationLabel = SUPPORT_SECTION_NAV,
) {
  await page.evaluate((id) => {
    const section = document.getElementById(id);
    if (!section) throw new Error(`Missing section: ${id}`);

    const targetTop = section.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.2;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "instant" });
  }, sectionId);

  await expectExactlyOneActiveSection(page, sectionId, navigationLabel);
}

async function openAndCheckSectionNavigation(
  page: Page,
  supportPage: (typeof SUPPORT_PAGES)[number],
  viewportName: (typeof VIEWPORTS)[number]["name"],
) {
  await page.goto(supportPage.path);
  await expect(page.locator("main h1").first()).toBeVisible();

  const navigation = sectionNavigation(page);
  await expect(navigation).toBeVisible();
  await expect(navigation.locator("a")).toHaveCount(supportPage.sections.length);
  await expectExactlyOneActiveSection(page, supportPage.sections[0]);

  if (supportPage.path === "/support/finances") {
    for (const sectionId of supportPage.sections.slice(1)) {
      const panelButton = page.locator(`#${sectionId} > button`);
      if (await panelButton.getAttribute("aria-expanded") !== "true") {
        await panelButton.click();
      }
      await expect(panelButton).toHaveAttribute("aria-expanded", "true");
    }
    await page.waitForTimeout(500);
  }

  for (const sectionId of supportPage.scrollTargets[viewportName]) {
    await scrollToAndCheckActiveSection(page, sectionId);
  }

  const targetLink = navigation.locator(`a[href="#${supportPage.navigationTarget}"]`);
  await expect(targetLink).toHaveCount(1);
  await targetLink.click();

  await expect(page).toHaveURL(new RegExp(`${supportPage.path}#${supportPage.navigationTarget}$`));
  await expectExactlyOneActiveSection(page, supportPage.navigationTarget);
}

async function openAndCheckTranslatedSectionNavigation(
  page: Page,
  language: (typeof TRANSLATED_SUPPORT_LANGUAGES)[number],
  supportPage: (typeof TRANSLATED_SUPPORT_PAGES)[number],
  viewportName: (typeof VIEWPORTS)[number]["name"],
) {
  await page.goto("/");
  await page.evaluate((lng) => localStorage.setItem("i18nextLng", lng), language.code);
  await page.goto(supportPage.path);
  await expect(page.locator("main h1").first()).toBeVisible();

  const navigation = sectionNavigation(page, language.navigationLabel);
  await expect(navigation).toBeVisible();
  await expect(navigation.locator("a")).toHaveCount(supportPage.sections.length);
  await expect(navigation.locator("a")).toHaveText(supportPage.labels[language.code]);
  await expect(navigation.locator("a").evaluateAll((links) => links.map((link) => link.getAttribute("href")))).resolves.toEqual(
    supportPage.sections.map((sectionId) => `#${sectionId}`),
  );
  await expectExactlyOneActiveSection(page, supportPage.sections[0], language.navigationLabel);

  if (supportPage.path === "/support/finances") {
    for (const sectionId of supportPage.sections.slice(1)) {
      const panelButton = page.locator(`#${sectionId} > button`);
      if (await panelButton.getAttribute("aria-expanded") !== "true") {
        await panelButton.click();
      }
      await expect(panelButton).toHaveAttribute("aria-expanded", "true");
    }
    await page.waitForTimeout(500);
  }

  for (const sectionId of supportPage.scrollTargets[viewportName]) {
    await scrollToAndCheckActiveSection(page, sectionId, language.navigationLabel);
  }

  const targetLink = navigation.locator(`a[href="#${supportPage.navigationTarget}"]`);
  await expect(targetLink).toHaveCount(1);
  await targetLink.click();

  await expect(page).toHaveURL(new RegExp(`${supportPage.path}#${supportPage.navigationTarget}$`));
  await expectExactlyOneActiveSection(page, supportPage.navigationTarget, language.navigationLabel);
}

for (const viewport of VIEWPORTS) {
  test(`support section rail stays singular on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const supportPage of SUPPORT_PAGES) {
      await openAndCheckSectionNavigation(page, supportPage, viewport.name);
    }
  });

  test(`translated support section rail stays localized on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const language of TRANSLATED_SUPPORT_LANGUAGES) {
      for (const supportPage of TRANSLATED_SUPPORT_PAGES) {
        await openAndCheckTranslatedSectionNavigation(page, language, supportPage, viewport.name);
      }
    }
  });
}

test("support section rail keeps keyboard focus and native anchor navigation with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });

  for (const supportPage of SUPPORT_PAGES) {
    await page.goto(supportPage.path);

    const navigation = sectionNavigation(page);
    const targetLink = navigation.locator(`a[href="#${supportPage.navigationTarget}"]`);
    await targetLink.focus();
    await expect(targetLink).toBeFocused();
    await expect(targetLink).toHaveAttribute("href", `#${supportPage.navigationTarget}`);

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${supportPage.path}#${supportPage.navigationTarget}$`));
    await expectExactlyOneActiveSection(page, supportPage.navigationTarget);
  }
});