import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  extractExactFloridaDocument, extractFloridaEdition, floridaChapterUrl, floridaSectionPattern, floridaSectionUrl,
  type FloridaBatchCache,
} from "./batch/florida-adapter";
import { extractFloridaChapterDocuments } from "./batch/florida-bulk-source";

const OUTPUT = path.join(process.cwd(), "scripts/data-review/output");
const CACHE_PATH = path.join(OUTPUT, "florida-batch-source-cache.json");
const RAW_PATH = path.join(OUTPUT, "florida-batch-exact-raw-cache.json");
const CHAPTER_RAW_PATH = path.join(OUTPUT, "florida-batch-chapter-raw-cache.json");
const LEDGER_PATH = path.join(OUTPUT, "florida-batch-acquisition-ledger.json");
const DEFAULT_SECTIONS = [
  "320.02", "320.07", "379.354", "403.413", "562.111", "562.12",
  "790.22", "790.221", "790.23",
  "794.011", "794.05", "790.01", "790.15", "831.01", "856.021", "856.011",
  "790.001", "943.10", "395.002", "1003.21", "212.15", "627.733", "901.31",
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const write = (filename: string, value: unknown) =>
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`);

export function floridaRecoveryCachePolicy(args: string[]) {
  const reparseRaw = args.includes("--reparse-raw");
  const wholeChapter = args.includes("--whole-chapter");
  const refresh = args.includes("--refresh");
  if (reparseRaw && wholeChapter) {
    throw new Error("--reparse-raw and --whole-chapter cannot be combined");
  }
  if (reparseRaw && refresh) {
    throw new Error("--refresh and --reparse-raw cannot be combined");
  }
  return {
    reparseRaw,
    wholeChapter,
    refresh,
    reuseFreshDocument: !refresh,
    reuseSavedRawResponse: !refresh && !reparseRaw,
  };
}

export async function main() {
  const args = process.argv.slice(2);
  const sectionArg = args.find(arg => arg.startsWith("--sections="))?.slice("--sections=".length);
  const sections = [...new Set((sectionArg ? sectionArg.split(",") : DEFAULT_SECTIONS).map(value => value.trim()))];
  if (!sections.length || sections.some(section => !floridaSectionPattern.test(section))) {
    throw new Error("Exact recovery requires comma-separated Florida section identifiers");
  }
  const maxRequests = Math.min(30, Number(args.find(arg => arg.startsWith("--max-requests="))?.split("=")[1] ?? 30));
  const {
    reparseRaw, wholeChapter, refresh, reuseFreshDocument, reuseSavedRawResponse,
  } = floridaRecoveryCachePolicy(args);
  const cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")) as FloridaBatchCache;
  const raw = fs.existsSync(RAW_PATH)
    ? JSON.parse(fs.readFileSync(RAW_PATH, "utf8"))
    : { schemaVersion: 1, jurisdiction: "FL", responses: {} };
  const ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, "utf8"));
  const chapterRaw = fs.existsSync(CHAPTER_RAW_PATH)
    ? JSON.parse(fs.readFileSync(CHAPTER_RAW_PATH, "utf8"))
    : { schemaVersion: 1, jurisdiction: "FL", responses: {} };
  const startedAt = new Date().toISOString();
  let requests = 0;
  let acquired = 0;
  let reused = 0;
  let failed = 0;
  let stoppedForRateBlock = false;

  for (const section of sections) {
    if (requests >= maxRequests || stoppedForRateBlock) break;
    const current = cache.documents[section];
    const age = current ? Date.now() - Date.parse(current.retrievedAt) : Infinity;
    if (reuseFreshDocument && current?.edition === "Florida Statutes 2026" && Number.isFinite(age) &&
        age >= 0 && age < 7 * 24 * 60 * 60_000) {
      reused++;
      continue;
    }
    if (reuseSavedRawResponse && raw.responses[section]?.status === 200) {
      const receipt = raw.responses[section];
      const edition = extractFloridaEdition(receipt.html);
      const document = edition === "Florida Statutes 2026"
        ? extractExactFloridaDocument(receipt.html, section, receipt.sourceUrl, new Date(receipt.retrievedAt), edition)
        : null;
      if (document) {
        cache.documents[section] = document;
        delete cache.failures[section];
        acquired++;
        write(CACHE_PATH, cache);
        continue;
      }
    }
    if (reparseRaw && raw.responses[section]?.status === 200) {
      const receipt = raw.responses[section];
      const edition = extractFloridaEdition(receipt.html);
      const document = edition === "Florida Statutes 2026"
        ? extractExactFloridaDocument(receipt.html, section, receipt.sourceUrl, new Date(receipt.retrievedAt), edition)
        : null;
      if (document) {
        cache.documents[section] = document;
        delete cache.failures[section];
        acquired++;
      } else {
        failed++;
      }
      write(CACHE_PATH, cache);
      continue;
    }
    if (requests) await sleep(2_000);
    const sourceUrl = wholeChapter ? floridaChapterUrl(section) : floridaSectionUrl(section);
    const checkedAt = new Date();
    let response: Response;
    try {
      response = await fetch(sourceUrl, {
        redirect: "manual", signal: AbortSignal.timeout(30_000),
        headers: {
          Accept: "text/html",
          "User-Agent": wholeChapter
            ? "OpenDefender-FloridaEvidenceBatch/1.0"
            : "OpenDefender-FloridaExactRecovery/1.0",
        },
      });
      requests++;
      const html = await response.text();
      // Persist the publisher response before any extraction or identity decision.
      const rawReceipt = {
        sourceUrl, retrievedAt: checkedAt.toISOString(), status: response.status,
        html, contentHash: createHash("sha256").update(html).digest("hex"),
      };
      if (wholeChapter) {
        chapterRaw.responses[section] = rawReceipt;
        write(CHAPTER_RAW_PATH, chapterRaw);
      } else {
        const previous = raw.responses[section];
        if (previous) {
          (raw.repeatRetrievals ??= {});
          (raw.repeatRetrievals[section] ??= []).push(
            previous.contentHash === rawReceipt.contentHash
              ? {
                  sourceUrl: rawReceipt.sourceUrl,
                  retrievedAt: rawReceipt.retrievedAt,
                  status: rawReceipt.status,
                  contentHash: rawReceipt.contentHash,
                  bodyReference: `responses.${section}.html`,
                }
              : rawReceipt,
          );
        } else {
          raw.responses[section] = rawReceipt;
        }
        write(RAW_PATH, raw);
      }
      if (!response.ok) throw new Error(`Official exact-section source HTTP ${response.status}`);
      const edition = extractFloridaEdition(html);
      if (edition !== "Florida Statutes 2026") {
        throw new Error(`Expected live selected Florida Statutes 2026 edition; received ${edition ?? "no edition label"}`);
      }
      const document = wholeChapter
        ? extractFloridaChapterDocuments(html, section, checkedAt).find(candidate => candidate.section === section)
        : extractExactFloridaDocument(html, section, sourceUrl, checkedAt, edition);
      if (!document) throw new Error("Existing exact-section parser rejected official response");
      cache.documents[section] = document;
      delete cache.failures[section];
      acquired++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      cache.failures[section] = { section, checkedAt: checkedAt.toISOString(), message, attemptedUrl: sourceUrl };
      // These targets were blocked or edition-obsolete; a failed refresh cannot retain old text.
      delete cache.documents[section];
      failed++;
      const status = (wholeChapter ? chapterRaw : raw).responses[section]?.status;
      if (status === 403 || status === 429) stoppedForRateBlock = true;
    }
    write(CACHE_PATH, cache);
  }

  ledger.runs.push({
    command: [
      "npx tsx scripts/data-review/florida-exact-recovery.ts",
      reparseRaw ? "--reparse-raw" : wholeChapter ? "--whole-chapter" : "",
      refresh ? "--refresh" : "",
      `--sections=${sections.join(",")}`,
      reparseRaw ? "" : `--max-requests=${maxRequests}`,
    ].filter(Boolean).join(" "),
    startedAt, finishedAt: new Date().toISOString(),
    mode: wholeChapter ? "official_whole_chapter_recovery" : "official_exact_section_recovery",
    sectionsRequested: sections, actualHttpRequests: requests, acquired, reused, failed, stoppedForRateBlock,
    reparsedPreviouslyCachedRawResponses: reparseRaw, explicitRefresh: refresh,
    rawResponseCache: path.relative(process.cwd(), wholeChapter ? CHAPTER_RAW_PATH : RAW_PATH),
  });
  ledger.totalCollectorHttpRequests += requests;
  write(LEDGER_PATH, ledger);
  console.log(JSON.stringify({
    requestedSections: sections.length, actualHttpRequests: requests, acquired, reused, failed,
    stoppedForRateBlock, cumulativeCollectorHttpRequests: ledger.totalCollectorHttpRequests,
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch(error => { console.error(error); process.exitCode = 1; });
}