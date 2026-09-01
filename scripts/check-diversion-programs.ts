/**
 * Diversion Program Link Checker
 *
 * Reads all contact.url values from diversion-programs-data.ts and makes
 * HEAD (then GET fallback) requests to each URL. Reports live / redirected /
 * broken links so they can be corrected before the next data refresh.
 *
 * Usage:
 *   npx tsx scripts/check-diversion-programs.ts
 *   npx tsx scripts/check-diversion-programs.ts --report   # writes JSON report
 *
 * Exit codes: 0 = all live, 1 = one or more broken links found
 */

import { diversionPrograms } from "../client/src/lib/diversion-programs-data";
import * as fs from "fs";
import * as path from "path";

const TIMEOUT_MS = 12_000;
const REPORT_FLAG = process.argv.includes("--report");

interface CheckResult {
  id: string;
  name: string;
  state: string;
  url: string;
  method: "HEAD" | "GET";
  status: number | "TIMEOUT" | "ERROR";
  ok: boolean;
  note?: string;
}

type DiversionProgramWithUrl = (typeof diversionPrograms)[number] & {
  contact: { url: string };
};

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
      // Server rejects HEAD — try GET
      const controller2 = new AbortController();
      const timer2 = setTimeout(() => controller2.abort(), TIMEOUT_MS);
      try {
        const getRes = await fetch(url, { ...opts, method: "GET", signal: controller2.signal });
        clearTimeout(timer2);
        const isBotBlock = getRes.status === 403 || getRes.status === 999;
        const isOk = (getRes.status >= 200 && getRes.status < 400) || isBotBlock;
        return { method: "GET", status: getRes.status, ok: isOk, note: isBotBlock ? `${getRes.status} – bot-blocked (likely live)` : undefined };
      } catch {
        clearTimeout(timer2);
        return { method: "GET", status: "ERROR", ok: false, note: "GET failed after HEAD 405/406" };
      }
    }

    // 403 and 999 from government/court sites are almost always CDN bot-blocks —
    // the page is live and accessible in a real browser.
    const isBotBlock = headRes.status === 403 || headRes.status === 999;
    const isOk = (headRes.status >= 200 && headRes.status < 400) || isBotBlock;
    const note = isBotBlock ? `${headRes.status} – bot-blocked (likely live)` : undefined;
    return { method: "HEAD", status: headRes.status, ok: isOk, note };
  } catch (err: unknown) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      return { method: "HEAD", status: "TIMEOUT", ok: false, note: `Timed out after ${TIMEOUT_MS}ms` };
    }
    return { method: "HEAD", status: "ERROR", ok: false, note: String(err) };
  }
}

async function main() {
  const withUrl = diversionPrograms.filter(
    (program): program is DiversionProgramWithUrl => {
      const contact = program.contact;
      return (
        typeof contact === "object" &&
        contact !== null &&
        "url" in contact &&
        typeof contact.url === "string" &&
        contact.url.length > 0
      );
    },
  );

  console.log(`\nOpenDefender – Diversion Program Link Checker`);
  console.log(`Checking ${withUrl.length} program URLs…\n`);

  const results: CheckResult[] = [];
  let broken = 0;

  for (const program of withUrl) {
    const url = program.contact.url;
    const { method, status, ok, note } = await checkUrl(url);

    const result: CheckResult = {
      id: program.id,
      name: program.name,
      state: program.state,
      url,
      method,
      status,
      ok,
      note,
    };
    results.push(result);

    const icon = ok ? "✅" : "❌";
    const noteStr = note ? `  (${note})` : "";
    console.log(`${icon} [${program.state}] ${program.name}`);
    console.log(`   ${method} ${status}  →  ${url}${noteStr}`);

    if (!ok) broken++;
  }

  console.log(`\n─────────────────────────────────────────────`);
  console.log(`Total checked : ${results.length}`);
  console.log(`Live          : ${results.length - broken}`);
  console.log(`Broken        : ${broken}`);
  console.log(`─────────────────────────────────────────────\n`);

  if (REPORT_FLAG) {
    const reportPath = path.join("scripts", "output", "diversion-link-report.json");
    fs.mkdirSync(path.join("scripts", "output"), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify({ generated: new Date().toISOString(), results }, null, 2));
    console.log(`Report written → ${reportPath}\n`);
  }

  process.exit(broken > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
