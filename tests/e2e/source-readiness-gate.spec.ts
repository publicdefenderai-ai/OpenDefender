import { expect, test, type Page } from "@playwright/test";
import { CURRENT_PUBLIC_SOURCE_JURISDICTIONS } from "../../shared/public-source-coverage";

const ADMIN_TOKEN = process.env.RELEASE_CHECK_ADMIN_TOKEN?.trim();

const CURRENT_JURISDICTIONS = CURRENT_PUBLIC_SOURCE_JURISDICTIONS;
const EXPECTED_TARGET_ORDER = ["GA", "PA", "SC", "OH", "IL", "FL", "TX", "NY", "CA"] as const;
const EXPECTED_GATE_LABELS: Record<(typeof CURRENT_JURISDICTIONS)[number], "Ready" | "Blocked"> = {
  CA: "Ready",
  FL: "Ready",
  GA: "Blocked",
  IL: "Ready",
  NY: "Ready",
  OH: "Ready",
  PA: "Ready",
  SC: "Ready",
  TX: "Ready",
};
const SOURCE_GAP_KINDS = [
  "source_access",
  "missing_import",
  "stale_record",
  "incomplete_text",
  "technical_seed_failure",
  "identity_review",
] as const;

type SourceGapKind = (typeof SOURCE_GAP_KINDS)[number];
type SourceReadinessGap = {
  kind: SourceGapKind;
  rows: number;
  summary: string;
  nextStep: string;
};
type SourceReadinessRow = {
  jurisdiction: string;
  catalogRows: number;
  selectableRows: number;
  withheldRows: number;
  rowsWithOfficialResponse: number;
  rowsWithExplicitWithheldReason: number;
  coveragePercentage: number;
  officialResponsePercentage: number;
  officialSourceAvailability: "available" | "partial" | "unavailable";
  gapBreakdown: SourceReadinessGap[];
  gapCounts: Record<SourceGapKind, number>;
  status: "meets_target" | "blocked" | "below_target";
};
type SourceReadinessTarget = {
  jurisdiction: string;
  rows: number;
  coveragePercentage: number;
  officialResponsePercentage: number;
  kind: SourceGapKind;
  reason: string;
  nextStep: string;
};
type SourceReadinessReport = {
  success?: boolean;
  target: {
    catalogAccountingRate: number;
    officialResponseRate: number;
  };
  jurisdictions: SourceReadinessRow[];
  belowTargetJurisdictions: string[];
  nextHighestValueCoverageTargets: SourceReadinessTarget[];
};

function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function sourceGapLabel(kind: string): string {
  return kind
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function sourceAvailabilityLabel(value: SourceReadinessRow["officialSourceAvailability"]): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

async function expectUnavailableState(page: Page) {
  const table = page.getByRole("table", { name: "Source readiness by current jurisdiction" });
  await expect(page.getByTestId("source-readiness-unavailable")).toBeVisible();
  await expect(table).toHaveCount(0);
}

test.describe("source readiness expansion gate", () => {
  test("renders the complete authenticated report and fails closed for unsafe responses", async ({ page }) => {
    test.skip(!ADMIN_TOKEN, "Release-only test: requires the in-memory release admin token fixture");

    const adminToken = ADMIN_TOKEN!;
    const reportResponse = await page.request.get("/api/admin/source-coverage", {
      headers: { "x-admin-api-key": adminToken },
    });
    expect(reportResponse.ok()).toBe(true);
    const report = await reportResponse.json() as SourceReadinessReport;

    expect(report.success).toBe(true);
    expect(report.target).toEqual({
      catalogAccountingRate: 1,
      officialResponseRate: 0.9,
    });
    expect(report.jurisdictions.map((row) => row.jurisdiction)).toEqual([...CURRENT_JURISDICTIONS]);
    expect(report.belowTargetJurisdictions).toEqual(["GA"]);
    expect(report.nextHighestValueCoverageTargets.map((target) => target.jurisdiction))
      .toEqual([...EXPECTED_TARGET_ORDER]);

    await page.goto("/admin/attorney-review");
    await expect(page.getByRole("heading", { name: "Attorney Review — Admin Access" })).toBeVisible();
    await page.getByPlaceholder("Admin API key (ADMIN_TOKEN)").fill(adminToken);
    await page.getByRole("button", { name: "Access Checklist" }).click();

    const readinessTable = page.getByRole("table", {
      name: "Source readiness by current jurisdiction",
    });
    await expect(readinessTable).toBeVisible();
    await expect(page.getByRole("heading", { name: "Source readiness gate" })).toBeVisible();
    await expect(page.getByText("catalog accounting is 100.0%", { exact: false })).toBeVisible();
    await expect(page.getByText("official-source response is at least 90.0%", { exact: false })).toBeVisible();

    const readyCount = report.jurisdictions.filter((row) => row.status === "meets_target").length;
    const blockedCount = report.jurisdictions.filter((row) => row.status === "blocked").length;
    const summary = page.locator("section[aria-labelledby='source-readiness-heading'] > div").first();
    await expect(summary.getByText(String(readyCount), { exact: true })).toBeVisible();
    await expect(summary.getByText(String(blockedCount), { exact: true })).toBeVisible();

    const rows = readinessTable.locator("tbody tr");
    await expect(rows).toHaveCount(CURRENT_JURISDICTIONS.length);

    for (const expectedRow of report.jurisdictions) {
      const row = rows.filter({ has: page.getByRole("rowheader", { name: expectedRow.jurisdiction }) });
      await expect(row).toHaveCount(1);

      const cells = row.locator("th, td");
      await expect(cells).toHaveCount(8);
      await expect(cells.nth(0)).toHaveText(expectedRow.jurisdiction);
      await expect(cells.nth(1)).toHaveText(formatCount(expectedRow.catalogRows));
      await expect(cells.nth(2)).toHaveText(formatCount(expectedRow.selectableRows));
      await expect(cells.nth(3)).toHaveText(formatCount(expectedRow.withheldRows));
      await expect(cells.nth(4)).toHaveText(formatPercent(expectedRow.coveragePercentage));
      await expect(cells.nth(5)).toContainText(sourceAvailabilityLabel(expectedRow.officialSourceAvailability));
      await expect(cells.nth(5)).toContainText(`${formatPercent(expectedRow.officialResponsePercentage)} response`);

      const positiveGaps = expectedRow.gapBreakdown.filter((gap) => gap.rows > 0);
      if (positiveGaps.length === 0) {
        await expect(cells.nth(6)).toHaveText("None");
      } else {
        for (const gap of positiveGaps) {
          await expect(cells.nth(6)).toContainText(`${sourceGapLabel(gap.kind)}: ${formatCount(gap.rows)}`);
        }
      }

      const expectedGateLabel = EXPECTED_GATE_LABELS[
        expectedRow.jurisdiction as (typeof CURRENT_JURISDICTIONS)[number]
      ];
      await expect(cells.nth(7)).toHaveText(expectedGateLabel);

      expect(new Set(expectedRow.gapBreakdown.map((gap) => gap.kind)))
        .toEqual(new Set(SOURCE_GAP_KINDS));
      for (const kind of SOURCE_GAP_KINDS) {
        expect(expectedRow.gapCounts[kind]).toBe(
          expectedRow.gapBreakdown.find((gap) => gap.kind === kind)?.rows,
        );
      }
      expect(expectedRow.rowsWithExplicitWithheldReason).toBe(expectedRow.withheldRows);
    }

    const targetList = page.getByRole("heading", { name: "Ranked next-highest-value targets" })
      .locator("..")
      .locator("..")
      .getByRole("list");
    await expect(targetList.getByRole("listitem")).toHaveCount(report.nextHighestValueCoverageTargets.length);
    for (const [index, target] of report.nextHighestValueCoverageTargets.entries()) {
      const item = targetList.getByRole("listitem").nth(index);
      await expect(item).toContainText(target.jurisdiction);
      await expect(item).toContainText(`${formatCount(target.rows)} withheld`);
      await expect(item).toContainText(`${formatPercent(target.coveragePercentage)} coverage`);
      await expect(item).toContainText(sourceGapLabel(target.kind));
      await expect(item).toContainText(target.reason);
      await expect(item).toContainText(`Next step: ${target.nextStep}`);
    }

    // The first page load above authenticates against the real admin boundary.
    // Keep later reloads focused on source-readiness responses without spending
    // the strict admin rate-limit budget on repeated auth/status requests.
    await page.route("**/api/admin/verify-key", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
    await page.route("**/api/admin/attorney-review-status", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, items: {} }),
      });
    });

    await page.route("**/api/admin/source-coverage", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: "Source coverage report is unavailable",
        }),
      });
    }, { times: 1 });
    await page.reload();
    await expectUnavailableState(page);

    await page.route("**/api/admin/source-coverage", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          target: { catalogAccountingRate: 1, officialResponseRate: "0.9" },
          jurisdictions: report.jurisdictions,
          belowTargetJurisdictions: report.belowTargetJurisdictions,
          nextHighestValueCoverageTargets: report.nextHighestValueCoverageTargets,
        }),
      });
    }, { times: 1 });
    await page.reload();
    await expectUnavailableState(page);

    await page.route("**/api/admin/source-coverage", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ...report,
          jurisdictions: report.jurisdictions.slice(0, -1),
        }),
      });
    }, { times: 1 });
    await page.reload();
    await expectUnavailableState(page);
  });
});