/**
 * Jury Instruction Link Checker
 *
 * Reads all instructionUrl values from shared/criminal-charge-citations.ts and
 * makes HEAD (then GET fallback) requests to each unique URL. Reports live /
 * redirected / broken links so they can be corrected before the next review cycle.
 *
 * Background: Florida Bar instruction documents live at date-stamped URLs like
 *   https://www-media.floridabar.org/uploads/2025/02/14.1.docx
 * When the Bar revises an instruction, the old URL returns 404 while the new
 * version appears at a different path. The CDN returns 403 to curl's default
 * User-Agent, so this script sends a browser-like UA to get accurate results.
 *
 * Usage:
 *   npx tsx scripts/check-jury-instruction-links.ts
 *   npx tsx scripts/check-jury-instruction-links.ts --report   # writes JSON report
 *   npx tsx scripts/check-jury-instruction-links.ts --fl-only  # Florida Bar URLs only
 *
 * Exit codes: 0 = all live, 1 = one or more broken links found
 *
 * Recommended cadence: quarterly (Florida Bar typically revises instructions
 * 1-2 times per year; other jurisdictions vary).
 */

import { CHARGE_CITATIONS } from "../shared/criminal-charge-citations";
import * as fs from "fs";
import * as path from "path";

const TIMEOUT_MS = 15_000;
const REPORT_FLAG = process.argv.includes("--report");
const FL_ONLY_FLAG = process.argv.includes("--fl-only");

// Government/court CDN bot-blocks — a 403 here almost always means the page is
// live but blocks automated scrapers. We treat these as "likely live."
// NOTE: floridabar.org is NOT in this set — with a proper browser UA it returns
// 200 for valid docs and 404 for missing ones, so 403 there is a real failure.
const BOT_BLOCK_HOSTS = new Set([
  "www.courts.ca.gov",
  "courts.ca.gov",
  "www.nycourts.gov",
  "nycourts.gov",
]);

interface CheckResult {
  chargeKey: string;
  url: string;
  method: "HEAD" | "GET";
  status: number | "TIMEOUT" | "ERROR";
  ok: boolean;
  note?: string;
}

function isBotBlockHost(url: string): boolean {
  try {
    return BOT_BLOCK_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

async function checkUrl(url: string): Promise<{
  method: "HEAD" | "GET";
  status: number | "TIMEOUT" | "ERROR";
  ok: boolean;
  note?: string;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const opts: RequestInit = {
    signal: controller.signal,
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  };

  try {
    const headRes = await fetch(url, { ...opts, method: "HEAD" });
    clearTimeout(timer);

    if (headRes.status === 405 || headRes.status === 406) {
      // Server rejects HEAD — fall back to GET
      const controller2 = new AbortController();
      const timer2 = setTimeout(() => controller2.abort(), TIMEOUT_MS);
      try {
        const getRes = await fetch(url, {
          ...opts,
          method: "GET",
          signal: controller2.signal,
        });
        clearTimeout(timer2);
        const botBlock =
          (getRes.status === 403 || getRes.status === 999) &&
          isBotBlockHost(url);
        const isOk =
          (getRes.status >= 200 && getRes.status < 400) || botBlock;
        return {
          method: "GET",
          status: getRes.status,
          ok: isOk,
          note: botBlock ? `${getRes.status} – bot-blocked (likely live)` : undefined,
        };
      } catch {
        clearTimeout(timer2);
        return {
          method: "GET",
          status: "ERROR",
          ok: false,
          note: "GET failed after HEAD 405/406",
        };
      }
    }

    const botBlock =
      (headRes.status === 403 || headRes.status === 999) &&
      isBotBlockHost(url);
    const isOk = (headRes.status >= 200 && headRes.status < 400) || botBlock;
    const note = botBlock
      ? `${headRes.status} – bot-blocked (likely live)`
      : undefined;
    return { method: "HEAD", status: headRes.status, ok: isOk, note };
  } catch (err: unknown) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      return {
        method: "HEAD",
        status: "TIMEOUT",
        ok: false,
        note: `Timed out after ${TIMEOUT_MS}ms`,
      };
    }
    return { method: "HEAD", status: "ERROR", ok: false, note: String(err) };
  }
}

async function main() {
  // Collect all entries that have an instructionUrl
  const allEntries = Object.entries(CHARGE_CITATIONS).filter(
    ([, rec]) => rec.instructionUrl
  );

  // Optionally filter to Florida Bar URLs only
  const entries = FL_ONLY_FLAG
    ? allEntries.filter(([, rec]) =>
        rec.instructionUrl!.includes("floridabar.org")
      )
    : allEntries;

  if (entries.length === 0) {
    console.log("\nNo instructionUrl entries found. Nothing to check.\n");
    process.exit(0);
  }

  // Deduplicate URLs while keeping all charge keys that share a URL
  const urlToKeys = new Map<string, string[]>();
  for (const [key, rec] of entries) {
    const url = rec.instructionUrl!;
    if (!urlToKeys.has(url)) urlToKeys.set(url, []);
    urlToKeys.get(url)!.push(key);
  }

  const scope = FL_ONLY_FLAG ? "Florida Bar" : "all jurisdictions";
  console.log(`\nOpenDefender – Jury Instruction Link Checker`);
  console.log(`Scope         : ${scope}`);
  console.log(`Charge entries: ${entries.length} (with instructionUrl)`);
  console.log(`Unique URLs   : ${urlToKeys.size}`);
  console.log(`─────────────────────────────────────────────\n`);

  const results: CheckResult[] = [];
  let broken = 0;

  for (const [url, keys] of urlToKeys) {
    const { method, status, ok, note } = await checkUrl(url);

    // Record one result per charge key (useful for --report output)
    for (const key of keys) {
      results.push({ chargeKey: key, url, method, status, ok, note });
    }

    const icon = ok ? "✅" : "❌";
    const noteStr = note ? `  (${note})` : "";
    const keysStr =
      keys.length === 1
        ? keys[0]
        : `${keys[0]} (+${keys.length - 1} more)`;
    console.log(`${icon} ${keysStr}`);
    console.log(`   ${method} ${status}  →  ${url}${noteStr}`);

    if (!ok) broken++;
  }

  const uniqueChecked = urlToKeys.size;
  const uniqueBroken = broken;
  const uniqueLive = uniqueChecked - uniqueBroken;

  console.log(`\n─────────────────────────────────────────────`);
  console.log(`Unique URLs checked : ${uniqueChecked}`);
  console.log(`Live                : ${uniqueLive}`);
  console.log(`Broken              : ${uniqueBroken}`);
  console.log(`─────────────────────────────────────────────`);

  if (uniqueBroken > 0) {
    console.log(`\n⚠️  Broken URLs — update instructionUrl in shared/criminal-charge-citations.ts:\n`);
    for (const r of results.filter((r) => !r.ok)) {
      // Print each broken URL once
      console.log(`  ❌ ${r.url}`);
      console.log(`     Status : ${r.status}${r.note ? ` (${r.note})` : ""}`);
      console.log(`     Charge : ${r.chargeKey}`);
    }

    console.log(`\nTo find the new URL for a Florida Bar instruction:`);
    console.log(
      `  Visit https://www.floridabar.org/rules/florida-standard-jury-instructions/`
    );
    console.log(
      `  and search for the instruction number. The CDN path changes with each revision.\n`
    );
  } else {
    console.log(`\n✅ All instruction links are live.\n`);
  }

  if (REPORT_FLAG) {
    const reportPath = path.join(
      "scripts",
      "output",
      "jury-instruction-link-report.json"
    );
    fs.mkdirSync(path.join("scripts", "output"), { recursive: true });
    fs.writeFileSync(
      reportPath,
      JSON.stringify(
        {
          generated: new Date().toISOString(),
          scope,
          totalEntries: entries.length,
          uniqueUrlsChecked: uniqueChecked,
          uniqueUrlsLive: uniqueLive,
          uniqueUrlsBroken: uniqueBroken,
          results,
        },
        null,
        2
      )
    );
    console.log(`Report written → ${reportPath}\n`);
  }

  process.exit(uniqueBroken > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
