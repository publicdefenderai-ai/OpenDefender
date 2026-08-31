import { expect, test, type Page } from "@playwright/test";

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

type BrowserDiagnostics = {
  consoleErrors: string[];
  pageErrors: string[];
};

function watchBrowserDiagnostics(page: Page): BrowserDiagnostics {
  const diagnostics: BrowserDiagnostics = { consoleErrors: [], pageErrors: [] };

  page.on("console", (message) => {
    if (message.type() === "error") {
      const location = message.location().url;
      diagnostics.consoleErrors.push(
        location ? `${message.text()} (${location})` : message.text(),
      );
    }
  });
  page.on("pageerror", (error) => {
    diagnostics.pageErrors.push(error.message);
  });

  return diagnostics;
}

async function expectHealthyLayout(
  page: Page,
  route: string,
  diagnostics: BrowserDiagnostics,
) {
  const viewport = page.viewportSize();
  const layout = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const overflowingElements = Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          (rect.left < -1 || rect.right > viewportWidth + 1)
        );
      })
      .slice(0, 5)
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        className: element.className,
        left: Math.round(element.getBoundingClientRect().left),
        right: Math.round(element.getBoundingClientRect().right),
      }));

    return {
      viewportWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      overflowingElements,
    };
  });

  expect(
    layout.documentScrollWidth,
    `Horizontal overflow on ${route} at ${viewport?.width}px: ${JSON.stringify(layout)}`,
  ).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(
    diagnostics.consoleErrors,
    `Browser console errors on ${route} at ${viewport?.width}px`,
  ).toEqual([]);
  expect(
    diagnostics.pageErrors,
    `Browser page errors on ${route} at ${viewport?.width}px`,
  ).toEqual([]);
}

function row(page: Page, label: string) {
  return page.getByText(label, { exact: true }).locator("..");
}

async function establishVerifiedAttorneySession(page: Page) {
  await page.goto("/attorney/verify");

  const verification = await page.evaluate(async () => {
    const response = await fetch("/api/attorney/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        attestations: {
          isLicensedAttorney: true,
          actingOnBehalfOfClient: true,
          understandsPrivilegeRequirements: true,
          acceptsDisclosures: true,
        },
      }),
    });

    return {
      status: response.status,
      body: await response.json(),
    };
  });

  expect(
    verification.status,
    `Attorney verification failed: ${JSON.stringify(verification.body)}`,
  ).toBe(200);
  expect(verification.body.success).toBe(true);
}

for (const viewport of VIEWPORTS) {
  test.describe(`professional workspaces at ${viewport.name} width`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeEach(async ({ page }) => {
      // The public advocate experience still mounts the shared attorney
      // session provider. Keep this expected disabled-portal response from
      // becoming a noisy 404 in the browser console.
      await page.route("**/api/attorney/session", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ isVerified: false }),
        });
      });
    });

    test("advocate hub supports keyboard and tool navigation", async ({ page }) => {
      const diagnostics = watchBrowserDiagnostics(page);

      await page.goto("/for-advocates");
      await expect(
        page.getByRole("heading", {
          name: "Tools for Public Defenders, Social Workers & Case Advocates",
        }),
      ).toBeVisible();

      const beforePlea = page.getByRole("link", { name: "Before the Plea" });
      await beforePlea.focus();
      await expect(beforePlea).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/for-advocates#before-plea$/);
      await expect(page.locator("#before-plea")).toBeVisible();

      await page
        .getByRole("link", { name: /First Contact Intake Checklist/ })
        .click();
      await expect(page).toHaveURL(/\/for-advocates\/intake-checklist$/);
      await expect(
        page.getByRole("heading", { name: "First Contact Intake Checklist" }),
      ).toBeVisible();

      await expectHealthyLayout(page, "/for-advocates", diagnostics);
    });

    test("intake checklist preserves accordion, tri-state flags, and output order", async ({
      page,
    }) => {
      const diagnostics = watchBrowserDiagnostics(page);

      await page.goto("/for-advocates/intake-checklist");
      await expect(
        page.getByRole("heading", { name: "First Contact Intake Checklist" }),
      ).toBeVisible();

      const caseSection = page.getByRole("button", {
        name: "Case & Identification",
      });
      const clientInput = page.getByPlaceholder("e.g. J. Smith or leave blank");
      await expect(clientInput).toBeVisible();
      await caseSection.click();
      await expect(clientInput).toBeHidden();
      await caseSection.click();
      await expect(clientInput).toBeVisible();

      await clientInput.fill("Responsive Intake Client");
      await page
        .getByPlaceholder("e.g. Burglary in the second degree")
        .fill("Robbery");

      const supervisionSection = page.getByRole("button", {
        name: "Supervision & Record",
      });
      await supervisionSection.click();
      const probationRow = row(page, "Currently on probation?");
      await probationRow.getByRole("button", { name: "Yes", exact: true }).click();
      const supervisionWarning = page.getByText(/Active supervision\./).first();
      await expect(supervisionWarning).toBeVisible();

      const output = page.locator("pre");
      await expect(output).toContainText("On probation: yes");
      const yesOutput = await output.innerText();
      expect(yesOutput.indexOf("FLAGS REQUIRING IMMEDIATE ATTENTION")).toBeGreaterThanOrEqual(0);
      expect(yesOutput.indexOf("CASE INFORMATION")).toBeGreaterThan(
        yesOutput.indexOf("FLAGS REQUIRING IMMEDIATE ATTENTION"),
      );
      expect(yesOutput.indexOf("Responsive Intake Client")).toBeGreaterThan(
        yesOutput.indexOf("CASE INFORMATION"),
      );
      expect(yesOutput.indexOf("Robbery")).toBeGreaterThan(
        yesOutput.indexOf("Responsive Intake Client"),
      );

      await probationRow.getByRole("button", { name: "Unknown", exact: true }).click();
      await expect(supervisionWarning).toBeHidden();
      await expect(output).toContainText("On probation: unknown");

      await probationRow.getByRole("button", { name: "No", exact: true }).click();
      await expect(output).toContainText("On probation: no");
      await expect(supervisionWarning).toBeHidden();

      await expectHealthyLayout(page, "/for-advocates/intake-checklist", diagnostics);
    });

    test("mitigation builder keeps form entry and output order without AI generation", async ({
      page,
    }) => {
      const diagnostics = watchBrowserDiagnostics(page);
      let polishRequests = 0;
      page.on("request", (request) => {
        if (request.url().endsWith("/api/mitigation/polish")) {
          polishRequests += 1;
        }
      });

      await page.goto("/for-advocates/mitigation-builder");
      await expect(
        page.getByRole("heading", { name: "Mitigation Builder" }),
      ).toBeVisible();

      const communitySection = page.getByRole("button", { name: "Community Ties" });
      const yearsInput = page.getByPlaceholder("e.g. 12 years in [city/neighborhood]");
      await expect(yearsInput).toBeVisible();
      await communitySection.click();
      await expect(yearsInput).toBeHidden();
      await communitySection.click();
      await expect(yearsInput).toBeVisible();

      await page
        .getByLabel("Client name or identifier")
        .fill("Responsive Mitigation Client");
      await page.getByPlaceholder("e.g. 2024-CR-00512").fill("CR-2026-0042");
      await page
        .getByPlaceholder("e.g. Bail hearing, diversion application, sentencing memo")
        .fill("Bail hearing");
      await yearsInput.fill("12 years in the neighborhood");
      await page
        .getByPlaceholder(/Volunteer at local food pantry/)
        .fill("Coaches youth soccer");

      const output = page.locator("pre");
      await expect(output).toContainText("Responsive Mitigation Client");
      await expect(output).toContainText("12 years in the neighborhood");
      const outputText = await output.innerText();
      expect(outputText).toContain("MITIGATION SUMMARY — DRAFT");
      expect(outputText.indexOf("Client: Responsive Mitigation Client")).toBeGreaterThan(
        outputText.indexOf("MITIGATION SUMMARY — DRAFT"),
      );
      expect(outputText.indexOf("COMMUNITY TIES")).toBeGreaterThan(
        outputText.indexOf("Client: Responsive Mitigation Client"),
      );
      expect(outputText.indexOf("12 years in the neighborhood")).toBeGreaterThan(
        outputText.indexOf("COMMUNITY TIES"),
      );
      await expect(
        page.getByRole("button", { name: "Generate narrative" }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Generate narrative" })).toBeEnabled();
      expect(polishRequests, "The responsive check must not invoke paid AI generation").toBe(0);

      await expectHealthyLayout(page, "/for-advocates/mitigation-builder", diagnostics);
    });

    test("attorney workspace URLs remain reachable without starting generation", async ({
      page,
    }) => {
      test.skip(
        process.env.ATTORNEY_PORTAL_ENABLED === "true",
        "Disabled-portal redirect coverage is only valid when the portal is disabled",
      );
      const diagnostics = watchBrowserDiagnostics(page);

      for (const route of ["/attorney/documents", "/attorney/playbooks"]) {
        await page.goto(route);
        await expect(page).toHaveURL(/\/directory$/);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expectHealthyLayout(page, route, diagnostics);
      }
    });
  });
}


for (const viewport of VIEWPORTS) {
  test.describe(`verified attorney workspaces at ${viewport.name} width`, () => {
    test.skip(
      process.env.ATTORNEY_PORTAL_ENABLED !== "true",
      "Authenticated attorney workspace coverage requires ATTORNEY_PORTAL_ENABLED=true",
    );
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeEach(async ({ page }) => {
      // AttorneyProvider intentionally ends sessions on a real document unload.
      // Keep this multi-route test in one authenticated session so it can
      // exercise each workspace instead of logging out between page.goto calls.
      await page.addInitScript(() => {
        Object.defineProperty(navigator, "sendBeacon", {
          configurable: true,
          value: () => true,
        });
      });
    });

    test("opens documents, a template wizard, playbooks, and a playbook detail without generation", async ({
      page,
    }) => {
      const diagnostics = watchBrowserDiagnostics(page);
      let generationRequests = 0;
      page.on("request", (request) => {
        if (
          request.method() === "POST" &&
          request.url().endsWith("/api/attorney/documents/generate")
        ) {
          generationRequests += 1;
        }
      });

      await establishVerifiedAttorneySession(page);

      await page.goto("/attorney/documents");
      await expect(
        page.getByRole("heading", { name: "Document Generation" }),
      ).toBeVisible();
      const firstTemplate = page.getByRole("link", { name: /^Draft / }).first();
      await expect(firstTemplate).toBeVisible();
      await expectHealthyLayout(page, "/attorney/documents", diagnostics);

      await firstTemplate.click();
      await expect(page).toHaveURL(/\/attorney\/documents\/[^/]+$/);
      await expect(
        page.getByRole("heading", { name: "Filing Context" }),
      ).toBeVisible();
      await expectHealthyLayout(page, "/attorney/documents/:templateId", diagnostics);

      await page.goto("/attorney/playbooks");
      await expect(
        page.getByRole("heading", { name: "Case Playbooks" }),
      ).toBeVisible();
      const arraignmentPlaybook = page.getByText("Arraignment & First Appearance", {
        exact: true,
      });
      await expect(arraignmentPlaybook).toBeVisible();
      await expectHealthyLayout(page, "/attorney/playbooks", diagnostics);

      await arraignmentPlaybook.click();
      await expect(page).toHaveURL(/\/attorney\/playbooks\/arraignment$/);
      await expect(
        page.getByRole("heading", { name: "Arraignment & First Appearance" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /^Stages?$/ }),
      ).toBeVisible();
      await expectHealthyLayout(page, "/attorney/playbooks/:playbookId", diagnostics);

      expect(
        generationRequests,
        "Workspace navigation must not invoke paid document generation",
      ).toBe(0);
    });
  });
}