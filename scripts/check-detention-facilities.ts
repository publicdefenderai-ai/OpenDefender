/**
 * Detention Facility & Hotline Verifier
 *
 * Audits the contact data shown on /find-detained:
 *
 *   1. URL checks — HEAD/GET the ICE Online Detainee Locator URL and any other
 *      external links embedded in the page.
 *
 *   2. Hotline cross-reference — fetches the ICE ERO contact page and the NIJC
 *      website and scans the HTML for the phone numbers currently hardcoded in
 *      find-detained.tsx. Flags if those numbers no longer appear on the source
 *      pages.
 *
 *   3. Facility manual-review table — phone numbers cannot be verified
 *      programmatically. This section prints every facility with its stored
 *      phone, address, and type so a human reviewer can cross-check against
 *      ICE's official facility list at ice.gov/detention-facilities.
 *
 * Usage:
 *   npx tsx scripts/check-detention-facilities.ts
 *   npx tsx scripts/check-detention-facilities.ts --report   # writes JSON
 *
 * Exit codes: 0 = all automated checks passed, 1 = one or more failures
 *
 * What this script CANNOT catch (manual review required):
 *   - A facility phone number that has changed but still connects somewhere
 *   - Facility closures or contract terminations with no public announcement
 *   - Visitation schedule changes (stored inline in the data file)
 *   - Bond amount range accuracy (requires checking ICE bond policy)
 */

import { detentionFacilities } from "../shared/data/detention-facilities";
import * as fs from "fs";
import * as path from "path";

const TIMEOUT_MS = 15_000;
const REPORT_FLAG = process.argv.includes("--report");

// ── Types ─────────────────────────────────────────────────────────────────────

interface UrlCheckResult {
  label: string;
  url: string;
  method: "HEAD" | "GET";
  status: number | "TIMEOUT" | "ERROR";
  ok: boolean;
  note?: string;
}

interface HotlineCheckResult {
  label: string;
  number: string;
  sourceUrl: string;
  foundOnPage: boolean | "FETCH_FAILED";
  note?: string;
}

interface FacilityRow {
  id: string;
  name: string;
  type: string;
  state: string;
  city: string;
  address: string;
  zip: string;
  phone: string;
  detaineePhone?: string;
  fieldOffice: string;
  reviewNote: string;
}

interface Report {
  generated: string;
  urlChecks: UrlCheckResult[];
  hotlineChecks: HotlineCheckResult[];
  facilities: FacilityRow[];
  summary: {
    urlsChecked: number;
    urlsFailed: number;
    hotlinesChecked: number;
    hotlinesMissingFromSource: number;
    facilitiesNeedingManualReview: number;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchWithTimeout(
  url: string,
  method: "HEAD" | "GET",
  abortMs = TIMEOUT_MS
): Promise<{ ok: boolean; status: number | "TIMEOUT" | "ERROR"; text?: string; note?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), abortMs);

  try {
    const res = await fetch(url, {
      method,
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OpenDefender-LinkChecker/1.0; +https://opendefender.app)",
        Accept: "text/html,application/xhtml+xml,*/*",
      },
    });
    clearTimeout(timer);

    const isBotBlock = res.status === 403 || res.status === 999;
    const isOk = (res.status >= 200 && res.status < 400) || isBotBlock;
    const note = isBotBlock ? `${res.status} – bot-blocked (likely live)` : undefined;
    const text = method === "GET" ? await res.text().catch(() => "") : undefined;
    return { ok: isOk, status: res.status, text, note };
  } catch (err: unknown) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      return { ok: false, status: "TIMEOUT", note: `Timed out after ${abortMs}ms` };
    }
    return { ok: false, status: "ERROR", note: String(err) };
  }
}

async function checkUrl(label: string, url: string): Promise<UrlCheckResult> {
  // Try HEAD first; fall back to GET if the server rejects HEAD
  let result = await fetchWithTimeout(url, "HEAD");

  if (result.status === 405 || result.status === 406) {
    result = await fetchWithTimeout(url, "GET");
    return { label, url, method: "GET", status: result.status, ok: result.ok, note: result.note };
  }

  return { label, url, method: "HEAD", status: result.status, ok: result.ok, note: result.note };
}

/**
 * Fetch a page and check whether a normalised version of the phone number
 * (digits only) appears anywhere in the response HTML.
 */
async function checkHotlineOnPage(
  label: string,
  number: string,
  sourceUrl: string
): Promise<HotlineCheckResult> {
  const result = await fetchWithTimeout(sourceUrl, "GET", 20_000);

  if (!result.ok || !result.text) {
    return {
      label,
      number,
      sourceUrl,
      foundOnPage: "FETCH_FAILED",
      note: result.note ?? `HTTP ${result.status}`,
    };
  }

  // Strip formatting from the stored number and search for digit sequences
  const digitsOnly = number.replace(/\D/g, "");
  // Match the digits with any common separators (-, ., space, parens)
  const regex = new RegExp(digitsOnly.split("").join("[^\\d]{0,2}"), "g");
  const found = regex.test(result.text);

  return {
    label,
    number,
    sourceUrl,
    foundOnPage: found,
    note: found
      ? "Number found in page source"
      : "Number NOT found — verify manually at source URL",
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\nOpenDefender — Detention Facility & Hotline Verifier");
  console.log("=".repeat(55));

  // ── 1. URL checks ────────────────────────────────────────────────────────
  console.log("\n[1/3] Checking external URLs…\n");

  const urlsToCheck: Array<{ label: string; url: string }> = [
    {
      label: "ICE Online Detainee Locator",
      url: "https://locator.ice.gov/odls/",
    },
    {
      label: "ICE Detention Facilities (reference page)",
      url: "https://www.ice.gov/detention-facilities",
    },
    {
      label: "ICE ERO Contact / Detention Reporting",
      url: "https://www.ice.gov/contact/ero",
    },
    {
      label: "NIJC (National Immigrant Justice Center)",
      url: "https://immigrantjustice.org/contact",
    },
  ];

  const urlResults: UrlCheckResult[] = [];
  let urlFailures = 0;

  for (const { label, url } of urlsToCheck) {
    const result = await checkUrl(label, url);
    urlResults.push(result);

    const icon = result.ok ? "✅" : "❌";
    const noteStr = result.note ? `  (${result.note})` : "";
    console.log(`${icon} ${label}`);
    console.log(`   ${result.method} ${result.status}  →  ${url}${noteStr}`);

    if (!result.ok) urlFailures++;
  }

  // ── 2. Hotline cross-reference ───────────────────────────────────────────
  console.log("\n[2/3] Cross-referencing hardcoded hotline numbers…\n");

  // Numbers hardcoded in find-detained.tsx (notFoundSteps + Important Numbers cards)
  const hotlinesToCheck: Array<{ label: string; number: string; sourceUrl: string }> = [
    {
      label: "ICE Detention Reporting Line",
      number: "1-888-351-4024",
      sourceUrl: "https://www.ice.gov/contact/ero",
    },
    {
      label: "NIJC Legal Help Line",
      number: "312-660-1370",
      sourceUrl: "https://immigrantjustice.org/contact",
    },
  ];

  const hotlineResults: HotlineCheckResult[] = [];
  let hotlineMismatches = 0;

  for (const { label, number, sourceUrl } of hotlinesToCheck) {
    const result = await checkHotlineOnPage(label, number, sourceUrl);
    hotlineResults.push(result);

    let icon: string;
    if (result.foundOnPage === "FETCH_FAILED") {
      icon = "⚠️ ";
    } else if (result.foundOnPage) {
      icon = "✅";
    } else {
      icon = "❌";
      hotlineMismatches++;
    }

    console.log(`${icon} ${label}`);
    console.log(`   Stored number : ${number}`);
    console.log(`   Source page   : ${sourceUrl}`);
    console.log(`   ${result.note ?? ""}`);
    console.log();
  }

  // ── 3. Facility manual-review table ─────────────────────────────────────
  console.log("[3/3] Facility phone numbers — requires manual review\n");
  console.log(
    "  Cross-check each entry against ICE's official facility list:"
  );
  console.log("  https://www.ice.gov/detention-facilities\n");

  const facilityRows: FacilityRow[] = detentionFacilities.map((f) => ({
    id: f.id,
    name: f.name,
    type: f.type,
    state: f.state,
    city: f.city,
    address: f.address,
    zip: f.zipCode,
    phone: f.phone,
    detaineePhone: f.detaineePhone,
    fieldOffice: f.fieldOffice,
    reviewNote:
      "Verify phone, address, and facility status against ice.gov/detention-facilities",
  }));

  // Group by state for readability
  const byState: Record<string, FacilityRow[]> = {};
  for (const row of facilityRows) {
    if (!byState[row.state]) byState[row.state] = [];
    byState[row.state].push(row);
  }

  for (const [state, rows] of Object.entries(byState).sort()) {
    console.log(`  ${state}`);
    for (const row of rows) {
      const detaineeNote = row.detaineePhone ? `  |  Detainee line: ${row.detaineePhone}` : "";
      console.log(`    [${row.type}] ${row.name}`);
      console.log(`         ${row.address}, ${row.city} ${row.zip}`);
      console.log(`         Phone: ${row.phone}${detaineeNote}`);
      console.log(`         ICE Field Office: ${row.fieldOffice}`);
    }
    console.log();
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  const totalFailed = urlFailures + hotlineMismatches;

  console.log("─".repeat(55));
  console.log("AUTOMATED CHECKS");
  console.log(`  URLs checked        : ${urlResults.length}`);
  console.log(`  URLs failed         : ${urlFailures}`);
  console.log(`  Hotlines checked    : ${hotlineResults.length}`);
  console.log(
    `  Numbers not found   : ${hotlineMismatches}${hotlineMismatches > 0 ? " ← VERIFY IMMEDIATELY" : ""}`
  );
  console.log();
  console.log("MANUAL REVIEW REQUIRED");
  console.log(`  Facility records    : ${facilityRows.length}`);
  console.log(`  Phone numbers       : ${facilityRows.reduce((n, f) => n + 1 + (f.detaineePhone ? 1 : 0), 0)}`);
  console.log(`  Recommended source  : https://www.ice.gov/detention-facilities`);
  console.log("─".repeat(55));

  if (REPORT_FLAG) {
    const report: Report = {
      generated: new Date().toISOString(),
      urlChecks: urlResults,
      hotlineChecks: hotlineResults,
      facilities: facilityRows,
      summary: {
        urlsChecked: urlResults.length,
        urlsFailed: urlFailures,
        hotlinesChecked: hotlineResults.length,
        hotlinesMissingFromSource: hotlineMismatches,
        facilitiesNeedingManualReview: facilityRows.length,
      },
    };

    const reportPath = path.join("scripts", "output", "detention-facilities-report.json");
    fs.mkdirSync(path.join("scripts", "output"), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nReport written → ${reportPath}\n`);
  }

  process.exit(totalFailed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
