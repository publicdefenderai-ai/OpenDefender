import { expect, test, type Page } from "@playwright/test";

const validChargeId = "ca-robbery-in-the-first-degree";
const supportedLegacyId = "ca-vehicular-homicide";
const supportedCanonicalId = "ca-gross-vehicular-manslaughter-191-5-a";
const multiSupportedLegacyCases = [
  {
    legacyId: supportedLegacyId,
    canonicalIds: [
      supportedCanonicalId,
      "ca-vehicular-manslaughter-191-5-b",
    ],
    selectedCanonicalId: supportedCanonicalId,
  },
  {
    legacyId: "ca-sexual-assault-in-the-second-degree",
    canonicalIds: [
      "ca-sexual-penetration-289-a1a",
      "ca-sexual-penetration-289-a1b",
    ],
    selectedCanonicalId: "ca-sexual-penetration-289-a1b",
  },
] as const;

const additionalSupportedLegacyCases = [
  {
    label: "sexual-assault",
    legacyId: "ca-sexual-assault-in-the-second-degree",
    canonicalIds: [
      "ca-sexual-penetration-289-a1a",
      "ca-sexual-penetration-289-a1b",
    ],
    selectedCanonicalId: "ca-sexual-penetration-289-a1b",
  },
  {
    label: "fraud",
    legacyId: "ca-insurance-fraud",
    canonicalIds: [
      "ca-insurance-fraud-550-a1",
      "ca-insurance-fraud-550-b1",
    ],
    selectedCanonicalId: "ca-insurance-fraud-550-b1",
  },
  {
    label: "DUI",
    legacyId: "ca-dui-first-offense",
    canonicalIds: [
      "ca-dui-23152-a",
      "ca-dui-23152-b",
      "ca-dui-23152-f",
      "ca-dui-23152-g",
    ],
    selectedCanonicalId: "ca-dui-23152-f",
  },
  {
    label: "procedural",
    legacyId: "ca-failure-to-appear",
    canonicalIds: [
      "ca-failure-to-appear-1320-a",
      "ca-failure-to-appear-1320-b",
    ],
    selectedCanonicalId: "ca-failure-to-appear-1320-b",
  },
] as const;

/**
 * The current selector intentionally does not expose legacy California IDs.
 * This fixture simulates an older saved screener by adding those IDs to the
 * submitted answers just before the request leaves the browser. The timeout
 * recovery path then receives the same data a restored saved case would have.
 */
async function openRecoveryWithSavedCharges(
  page: Page,
  legacyIds: string[],
): Promise<{
  releaseInitialRequest: () => void;
  getInitialBody: () => Record<string, unknown> | undefined;
  getRetryBody: () => Record<string, unknown> | undefined;
}> {
  await page.route("**/api/captcha/config", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ required: false, siteKey: null }),
    });
  });

  let streamRequestCount = 0;
  let releaseInitialRequest: (() => void) | undefined;
  let initialBody: Record<string, unknown> | undefined;
  let retryBody: Record<string, unknown> | undefined;
  await page.route("**/api/legal-guidance/stream", async (route) => {
    streamRequestCount += 1;
    if (streamRequestCount === 1) {
      initialBody = route.request().postDataJSON() as Record<string, unknown>;
      await new Promise<void>((resolve) => {
        releaseInitialRequest = resolve;
      });
      try {
        await route.fulfill({
          status: 504,
          contentType: "application/json",
          body: JSON.stringify({ success: false, error: "Request timed out" }),
        });
      } catch {
        // The browser normally aborts this request when the app timeout fires.
      }
      return;
    }

    retryBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 403,
      contentType: "application/json",
      body: JSON.stringify({ success: false, error: "Retry fixture response" }),
    });
  });

  await page.addInitScript(({ legacyIds: ids, seedId }) => {
    // QAFlow keeps the submitted charges array in the pending recovery data.
    // Mutating that shared array while JSON.stringify prepares the request
    // gives this browser test a realistic persisted legacy selection without
    // making stale IDs selectable in the production UI.
    const originalStringify = JSON.stringify;
    let hasInjectedSavedLegacyIds = false;
    JSON.stringify = function stringifyWithSavedLegacyIds(
      value: unknown,
      replacer?: ((key: string, value: unknown) => unknown) | null,
      space?: string | number,
    ) {
      const payload = value as {
        jurisdiction?: unknown;
        charges?: unknown;
      } | null;
      if (
        payload &&
        payload.jurisdiction === "CA" &&
        Array.isArray(payload.charges) &&
        payload.charges.includes(seedId) &&
        !hasInjectedSavedLegacyIds
      ) {
        hasInjectedSavedLegacyIds = true;
        payload.charges.splice(
          0,
          payload.charges.length,
          ...ids,
          ...payload.charges.filter((chargeId: string) => !ids.includes(chargeId)),
        );
      }
      return originalStringify.call(JSON, value, replacer, space);
    };
  }, { legacyIds, seedId: validChargeId });

  await page.clock.install();
  await page.goto("/case-guidance");
  await page.getByTestId("button-start-guidance").click();
  await page
    .getByRole("button", { name: /Personalized AI Guidance.*Continue with AI Guidance/i })
    .click();

  await page.getByTestId("select-jurisdiction").click();
  await page.getByRole("option", { name: "California" }).click();
  await page.getByTestId("button-next-jurisdiction").click();

  const searchInput = page.locator("#charge-search");
  await searchInput.fill("first-degree robbery");
  await page
    .getByTestId(`checkbox-charge-${validChargeId}`)
    .waitFor({ state: "visible", timeout: 15_000 });
  await page.getByTestId(`checkbox-charge-${validChargeId}`).locator("..").click();
  await page.getByTestId("button-next-case-details").click();

  await page.getByTestId("select-case-stage").click();
  await page.getByRole("option", { name: /Pre-trial/i }).click();
  await page.getByTestId("select-custody-status").click();
  await page.getByRole("option", { name: /not in custody/i }).click();
  await page.getByTestId("select-has-attorney").click();
  await page.getByRole("option", { name: /^No$/ }).click();
  await page.getByTestId("button-continue-status").click();
  await page.getByTestId("button-continue-background").click();
  await page.getByRole("button", { name: /^Next/ }).click();
  await page.getByRole("button", { name: /Get My Case Support/i }).click();

  await page.clock.runFor(120_000);
  await expect(page.getByRole("alert")).toContainText("Your answers are still here");
  await page.getByTestId("button-review-guidance-answers").click();

  // Review starts on the final civil-emergencies step. Use each step's
  // stable back control after the first unlabelled civil-emergencies button;
  // a broad role locator can race the animated step transition.
  await expect(page.getByTestId("qa-step-circle-7")).toHaveClass(/bg-gray-700/);
  await page.getByRole("button", { name: /^Back/ }).click();
  await expect(page.getByTestId("qa-step-circle-6")).toHaveClass(/bg-gray-700/);
  await page.getByRole("button", { name: /^Back/ }).click();
  await expect(page.getByTestId("qa-step-circle-5")).toHaveClass(/bg-gray-700/);
  await page.getByTestId("button-prev-background").click();
  await expect(page.getByTestId("qa-step-circle-4")).toHaveClass(/bg-gray-700/);
  await page.getByTestId("button-prev-status").click();
  await expect(page.getByTestId("qa-step-circle-3")).toHaveClass(/bg-gray-700/);
  await expect(page.getByTestId("button-next-case-details")).toBeVisible();

  return {
    releaseInitialRequest: () => releaseInitialRequest?.(),
    getInitialBody: () => initialBody,
    getRetryBody: () => retryBody,
  };
}

async function submitRemainingSteps(page: Page) {
  await page.getByTestId("button-next-case-details").click();
  await page.getByTestId("select-case-stage").click();
  await page.getByRole("option", { name: /Pre-trial/i }).click();
  await page.getByTestId("select-custody-status").click();
  await page.getByRole("option", { name: /not in custody/i }).click();
  await page.getByTestId("select-has-attorney").click();
  await page.getByRole("option", { name: /^No$/ }).click();
  await page.getByTestId("button-continue-status").click();
  await page.getByTestId("button-continue-background").click();
  await page.getByRole("button", { name: /^Next/ }).click();
  await page.getByRole("button", { name: /Get My Case Support/i }).click();
}

test.describe("saved California legacy charge recovery", () => {
  test("opens exact choices and stores only the selected canonical replacement", async ({ page }) => {
    test.setTimeout(60_000);

    const recovery = await openRecoveryWithSavedCharges(page, [supportedLegacyId]);
    await expect.poll(() => recovery.getInitialBody()?.charges).toEqual([
      supportedLegacyId,
      validChargeId,
    ]);
    const options = page.getByTestId(`legacy-charge-options-${supportedLegacyId}`);
    await expect(options).toBeVisible();
    await expect(page.getByTestId(`button-reselect-${supportedCanonicalId}`)).toBeVisible();

    await page.getByTestId(`button-reselect-${supportedCanonicalId}`).click();
    await expect(options).toHaveCount(0);
    await expect(page.getByTestId(`button-remove-charge-${validChargeId}`)).toBeVisible();
    await expect(page.getByTestId(`button-remove-charge-${supportedCanonicalId}`)).toBeVisible();

    recovery.releaseInitialRequest();
    await submitRemainingSteps(page);
    await expect.poll(recovery.getRetryBody).toMatchObject({
      charges: [validChargeId, supportedCanonicalId],
    });
  });

  test("resolves multiple legacy families independently and preserves all saved charges", async ({
    page,
  }) => {
    test.setTimeout(60_000);

    const legacyIds = multiSupportedLegacyCases.map(({ legacyId }) => legacyId);
    const recovery = await openRecoveryWithSavedCharges(page, legacyIds);
    await expect.poll(() => recovery.getInitialBody()?.charges).toEqual([
      ...legacyIds,
      validChargeId,
    ]);

    for (const { legacyId, canonicalIds } of multiSupportedLegacyCases) {
      await expect(page.getByTestId(`legacy-charge-options-${legacyId}`)).toBeVisible();
      for (const canonicalId of canonicalIds) {
        await expect(page.getByTestId(`button-reselect-${canonicalId}`)).toBeVisible();
      }
    }

    const firstCase = multiSupportedLegacyCases[0];
    const secondCase = multiSupportedLegacyCases[1];
    await page
      .getByTestId(`button-reselect-${firstCase.selectedCanonicalId}`)
      .click();

    await expect(
      page.getByTestId(`legacy-charge-options-${firstCase.legacyId}`),
    ).toHaveCount(0);
    await expect(
      page.getByTestId(`legacy-charge-options-${secondCase.legacyId}`),
    ).toBeVisible();
    await expect(page.getByTestId(`button-remove-charge-${validChargeId}`)).toBeVisible();
    await expect(
      page.getByTestId(`button-remove-charge-${firstCase.selectedCanonicalId}`),
    ).toBeVisible();
    await expect(
      page.getByTestId(`button-remove-charge-${secondCase.legacyId}`),
    ).toHaveCount(0);

    await page
      .getByTestId(`button-reselect-${secondCase.selectedCanonicalId}`)
      .click();
    await expect(
      page.getByTestId(`legacy-charge-options-${secondCase.legacyId}`),
    ).toHaveCount(0);
    await expect(page.getByTestId(`button-remove-charge-${validChargeId}`)).toBeVisible();
    for (const { selectedCanonicalId } of multiSupportedLegacyCases) {
      await expect(
        page.getByTestId(`button-remove-charge-${selectedCanonicalId}`),
      ).toBeVisible();
    }

    recovery.releaseInitialRequest();
    await submitRemainingSteps(page);
    await expect.poll(recovery.getRetryBody).toMatchObject({
      charges: [
        validChargeId,
        firstCase.selectedCanonicalId,
        secondCase.selectedCanonicalId,
      ],
    });
  });

  for (const {
    label,
    legacyId,
    canonicalIds,
    selectedCanonicalId,
  } of additionalSupportedLegacyCases) {
    test(`opens the current ${label} exact-choice panel and preserves unrelated charges`, async ({
      page,
    }) => {
      test.setTimeout(60_000);

      const recovery = await openRecoveryWithSavedCharges(page, [legacyId]);
      await expect.poll(() => recovery.getInitialBody()?.charges).toEqual([
        legacyId,
        validChargeId,
      ]);

      const options = page.getByTestId(`legacy-charge-options-${legacyId}`);
      await expect(options).toBeVisible();
      for (const canonicalId of canonicalIds) {
        await expect(page.getByTestId(`button-reselect-${canonicalId}`)).toBeVisible();
      }

      await page.getByTestId(`button-reselect-${selectedCanonicalId}`).click();
      await expect(options).toHaveCount(0);
      await expect(page.getByTestId(`button-remove-charge-${legacyId}`)).toHaveCount(0);
      await expect(page.getByTestId(`button-remove-charge-${validChargeId}`)).toBeVisible();
      await expect(
        page.getByTestId(`button-remove-charge-${selectedCanonicalId}`),
      ).toBeVisible();

      recovery.releaseInitialRequest();
      await submitRemainingSteps(page);
      await expect.poll(recovery.getRetryBody).toMatchObject({
        charges: [validChargeId, selectedCanonicalId],
      });
    });
  }

  test("does not silently convert unsupported, enhancement, juvenile, or non-criminal legacy IDs", async ({
    page,
  }) => {
    test.setTimeout(60_000);

    const unsupportedLegacyIds = [
      "ca-wire-fraud",
      "ca-gang-enhancement",
      "ca-juvenile-delinquency-felony",
      "ca-animal-at-large",
    ];
    const recovery = await openRecoveryWithSavedCharges(page, unsupportedLegacyIds);
    await expect.poll(() => recovery.getInitialBody()?.charges).toEqual([
      ...unsupportedLegacyIds,
      validChargeId,
    ]);

    await expect(page.getByTestId("legacy-charge-reselection-notice")).toBeVisible();
    for (const legacyId of unsupportedLegacyIds) {
      await expect(page.getByTestId(`legacy-charge-options-${legacyId}`)).toHaveCount(0);
    }

    // Continuing explicitly discards unresolved legacy records; it does not
    // map them to a guessed current offense.
    await page.getByTestId("button-next-case-details").click();
    await expect(page.getByTestId("button-prev-status")).toBeVisible();
    await page.getByTestId("button-prev-status").click();
    await expect(page.getByTestId("legacy-charge-reselection-notice")).toHaveCount(0);
    await expect(page.getByTestId(`checkbox-charge-${validChargeId}`)).toBeChecked();

    recovery.releaseInitialRequest();
  });
});