/**
 * CALCRIM Link Checker
 *
 * Verifies that the courts.ca.gov CALCRIM landing page URL used across all
 * 105 California charge entries in shared/criminal-charge-citations.ts remains
 * live and reachable. Also checks the full-edition PDF URL when it can be
 * resolved.
 *
 * Healthy = final HTTP 200 (redirect: "follow" means 301→200 counts as 200).
 * Anything else — including 403, 404, timeouts — is flagged as broken.
 *
 * Run quarterly or after any courts.ca.gov URL migration notice.
 *
 * Usage:
 *   npx tsx scripts/check-calcrim-links.ts
 *   npx tsx scripts/check-calcrim-links.ts --report   # writes JSON report
 *
 * Exit codes: 0 = all URLs healthy, 1 = one or more broken
 */

import * as fs from "fs";
import * as path from "path";

const TIMEOUT_MS = 15_000;
const REPORT_FLAG = process.argv.includes("--report");

interface UrlTarget {
  label: string;
  url: string;
  actionOnFailure: string;
}

interface CheckResult {
  label: string;
  url: string;
  method: "HEAD" | "GET";
  status: number | "TIMEOUT" | "ERROR";
  ok: boolean;
  note?: string;
}

/**
 * Checks a single URL. Healthy = final status 200.
 * redirect: "follow" means any redirect chain resolving to 200 passes.
 * Falls back from HEAD to GET when the server rejects HEAD (405/406).
 */
async function checkUrl(
  url: string
): Promise<{ method: "HEAD" | "GET"; status: number | "TIMEOUT" | "ERROR"; ok: boolean; note?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const opts: RequestInit = {
    signal: controller.signal,
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; OpenDefender-LinkChecker/1.0; +https://opendefender.ai)",
    },
  };

  try {
    const headRes = await fetch(url, { ...opts, method: "HEAD" });
    clearTimeout(timer);

    if (headRes.status === 405 || headRes.status === 406) {
      const controller2 = new AbortController();
      const timer2 = setTimeout(() => controller2.abort(), TIMEOUT_MS);
      try {
        const getRes = await fetch(url, { ...opts, method: "GET", signal: controller2.signal });
        clearTimeout(timer2);
        return { method: "GET", status: getRes.status, ok: getRes.status === 200 };
      } catch {
        clearTimeout(timer2);
        return { method: "GET", status: "ERROR", ok: false, note: "GET failed after HEAD 405/406" };
      }
    }

    return { method: "HEAD", status: headRes.status, ok: headRes.status === 200 };
  } catch (err: unknown) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      return { method: "HEAD", status: "TIMEOUT", ok: false, note: `Timed out after ${TIMEOUT_MS}ms` };
    }
    return { method: "HEAD", status: "ERROR", ok: false, note: String(err) };
  }
}

const TARGETS: UrlTarget[] = [
  {
    label: "CALCRIM landing page (used by all 105 CA charges)",
    url: "https://www.courts.ca.gov/partners/california-jury-instructions",
    actionOnFailure:
      "Update the instructionUrl field for all 105 CA entries in " +
      "shared/criminal-charge-citations.ts to the new courts.ca.gov URL.",
  },
  {
    label: "CALCRIM 2024 full-edition PDF",
    url: "https://www.courts.ca.gov/partners/documents/calcrim-2024.pdf",
    actionOnFailure:
      "A newer CALCRIM edition PDF has likely been published. Find the current PDF " +
      "URL on courts.ca.gov and update the TARGETS array in this script. " +
      "See also the backlog task: 'Add a 2026-edition CALCRIM URL when courts.ca.gov publishes it'.",
  },
];

async function main() {
  console.log(`\nOpenDefender – CALCRIM Link Checker`);
  console.log(`Healthy = HTTP 200 (redirect-followed). Anything else = broken.`);
  console.log(`Checking ${TARGETS.length} courts.ca.gov URL(s)…\n`);

  const results: CheckResult[] = [];
  let broken = 0;

  for (const target of TARGETS) {
    const { method, status, ok, note } = await checkUrl(target.url);

    const result: CheckResult = {
      label: target.label,
      url: target.url,
      method,
      status,
      ok,
      note,
    };
    results.push(result);

    const icon = ok ? "✅" : "❌";
    const noteStr = note ? `\n   ℹ️  ${note}` : "";
    console.log(`${icon} ${target.label}`);
    console.log(`   ${method} ${status}  →  ${target.url}${noteStr}`);
    if (!ok) {
      console.log(`   🔧 ${target.actionOnFailure}`);
    }
    console.log();

    if (!ok) broken++;
  }

  console.log(`─────────────────────────────────────────────`);
  console.log(`Total checked : ${results.length}`);
  console.log(`Live          : ${results.length - broken}`);
  console.log(`Broken        : ${broken}`);
  console.log(`─────────────────────────────────────────────`);

  if (broken > 0) {
    console.log(`\n⚠️  ${broken} broken URL(s) found. See 🔧 action(s) above.\n`);
  } else {
    console.log(`\n✅ All CALCRIM URLs are live. No action required.\n`);
  }

  if (REPORT_FLAG) {
    const reportPath = path.join("scripts", "output", "calcrim-link-report.json");
    fs.mkdirSync(path.join("scripts", "output"), { recursive: true });
    fs.writeFileSync(
      reportPath,
      JSON.stringify({ generated: new Date().toISOString(), results }, null, 2)
    );
    console.log(`Report written → ${reportPath}\n`);
  }

  process.exit(broken > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
