/**
 * Refresh the finite, already-reviewed Ohio dependency set. Acquisition only
 * compares official text with reviewed hashes; it can never update those pins
 * or grant publication approval.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  OHIO_REVIEWED_MAX_AGE_MS,
  OHIO_REVIEWED_CURRENT_REVIEW_HASH,
  OHIO_REVIEWED_RECEIPT_PATH,
  OHIO_REVIEWED_SOURCES,
  ohioReviewedExpectedDocuments,
} from "../../server/data/ohio-reviewed-source";
import { createOhioAdapter } from "./batch/ohio-adapter";
import { createOhioBulkAcquirer } from "./batch/ohio-bulk-source";
import { runSourceBatch, type SourceCache, type SourceAdapter, type BatchDocument, textHash } from "./batch/source-batch";

const output = resolve("scripts/data-review/output");
const cachePath = resolve(".cache/ohio-reviewed-refresh.json");
const historicalCachePath = resolve(output, "ohio-batch-source-cache.json");
const evidencePath = resolve(output, "ohio-reviewed-refresh-evidence.json");
const atomicJson = (path: string, value: unknown) => {
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, JSON.stringify(value, null, 2) + "\n");
  renameSync(temporary, path);
};

const decode = (html: string) => html.replace(/<\/(?:p|div)>/gi, " ").replace(/<[^>]+>/g, "").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([a-f0-9]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&(quot|apos|nbsp|lt|gt|amp);/g, (_, name: string) =>
    ({ quot: '"', apos: "'", nbsp: " ", lt: "<", gt: ">", amp: "&" }[name]!))
  .replace(/\s+/g, " ").trim();

/** The existing OAC evidence normalization; new text still must match its reviewed pin. */
export function extractReviewedOhioRule(html: string, sourceUrl: string, retrievedAt: Date): BatchDocument {
  if (sourceUrl !== "https://codes.ohio.gov/ohio-administrative-code/rule-3701-12-01") throw new Error("Wrong administrative-rule URL");
  const heading = decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  const bodyHtml = html.match(/<section class="laws-body"[^>]*>([\s\S]*?)<\/section>/i)?.[1];
  const effectiveText = decode(html.match(/Effective:\s*<\/div>\s*<div[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? "");
  if (!/^Rule 3701-12-01\s*\|\s*Definitions\./.test(heading) || !bodyHtml || !Number.isFinite(Date.parse(effectiveText))) throw new Error("Wrong or incomplete administrative rule");
  const effectiveDateStart = new Date(effectiveText).toISOString().slice(0, 10);
  if (!Number.isFinite(retrievedAt.getTime()) || effectiveDateStart > retrievedAt.toISOString().slice(0, 10)) throw new Error("Administrative rule is not effective yet");
  const body = decode(bodyHtml);
  if (!body.startsWith("As used in Chapter 3701-12 of the Administrative Code:") || !body.includes('(M) "Health maintenance organization"')) throw new Error("Missing rule scope or definition");
  const text = `${heading}\nEffective: ${effectiveDateStart}\n${body}`;
  return { section: "OAC:3701-12-01", title: "Definitions", sourceUrl, acquiredFrom: sourceUrl,
    effectiveDateStart, retrievedAt: retrievedAt.toISOString(), text, contentHash: textHash(text) };
}

export async function acquireOhioReviewedGroup(
  section: string, requestBudget: number,
  bulk: ReturnType<typeof createOhioBulkAcquirer>, acquireExact: SourceAdapter["acquire"],
) {
  const before = bulk.metrics.httpRequests;
  try {
    return await bulk(section);
  } catch (error) {
    const requestsUsed = bulk.metrics.httpRequests - before;
    // A malformed chapter boundary is not evidence that an individual section
    // changed. Retrieve that exact official section, still under the same pins.
    // Do not retry publisher throttling or network failures here.
    if (!(error instanceof Error) || !error.message.startsWith("Malformed section boundary") || requestsUsed >= requestBudget) {
      throw Object.assign(error instanceof Error ? error : new Error(String(error)), { requestsUsed });
    }
    try {
      return { documents: [await acquireExact(section)], requests: requestsUsed + 1 };
    } catch (exactError) {
      throw Object.assign(exactError instanceof Error ? exactError : new Error(String(exactError)), { requestsUsed: requestsUsed + 1 });
    }
  }
}

export function ohioRefreshExpiry(documents: Array<{ retrievedAt: string }>): string {
  const times = documents.map(document => Date.parse(document.retrievedAt));
  if (!times.length || times.some(time => !Number.isFinite(time))) throw new Error("Missing source acquisition time");
  return new Date(Math.min(...times) + OHIO_REVIEWED_MAX_AGE_MS).toISOString();
}

export async function refreshOhioReviewedSources(args = process.argv.slice(2)) {
  for (const arg of args) {
    if (arg !== "--acquire" && arg !== "--force" && arg !== "--retry-failures" && !/^--max-requests=\d+$/.test(arg)) {
      throw new Error(`Unknown option ${arg}`);
    }
  }
  if (args.includes("--force") && !args.includes("--acquire")) {
    throw new Error("--force requires --acquire; renewal requires actual retrieval");
  }
  const maxRequests = Number(args.find(arg => arg.startsWith("--max-requests="))?.split("=")[1] ?? 80);
  if (!Number.isInteger(maxRequests) || maxRequests < 0 || maxRequests > 300) {
    throw new Error("Ohio reviewed refresh request budget must be between 0 and 300");
  }
  const now = new Date();
  const cache: SourceCache = existsSync(cachePath)
    ? JSON.parse(readFileSync(cachePath, "utf8"))
    : JSON.parse(readFileSync(historicalCachePath, "utf8"));
  // Supplemental reviewed authorities (including OAC 3701-12-01) participate
  // in the same seven-day cache boundary without being misrouted to ORC.
  for (const name of [
    "ohio-common-charge-evidence.json",
    "ohio-substantive-supplemental-evidence.json",
    "ohio-substantive-review-authorities.json",
  ]) {
    const value = JSON.parse(readFileSync(resolve(output, name), "utf8")) as {
      documents?: SourceCache["documents"];
    };
    for (const [section, document] of Object.entries(value.documents ?? {})) {
      if (!cache.documents[section] || Date.parse(document.retrievedAt) > Date.parse(cache.documents[section].retrievedAt)) {
        cache.documents[section] = document;
      }
    }
  }
  const expected = ohioReviewedExpectedDocuments();
  const pins = Object.fromEntries(expected.map(document => [document.section, document.contentHash]));
  const adapter = createOhioAdapter();
  const validateOrc = adapter.validate;
  const expectedBySection = new Map(expected.map(document => [document.section, document]));
  adapter.validate = document => {
    if (!document.section.startsWith("OAC:")) return validateOrc(document);
    const pinned = expectedBySection.get(document.section);
    return Boolean(pinned &&
      document.title === pinned.title &&
      document.sourceUrl === pinned.sourceUrl &&
      document.contentHash === pinned.contentHash &&
      document.effectiveDateStart === pinned.effectiveDateStart);
  };
  const bulk = createOhioBulkAcquirer(undefined);
  adapter.acquireGroup = async (section, requestBudget) => {
    if (section.startsWith("OAC:")) {
      const pinned = expectedBySection.get(section);
      if (!pinned || section !== "OAC:3701-12-01") throw new Error("Unrecognized administrative-rule dependency");
      const retrievedAt = new Date();
      const response = await fetch(pinned.sourceUrl, {
        redirect: "error", signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) throw new Error(`Official administrative rule: HTTP ${response.status}`);
      return { documents: [extractReviewedOhioRule(await response.text(), pinned.sourceUrl, retrievedAt)], requests: 1 };
    }
    return acquireOhioReviewedGroup(section, requestBudget, bulk, adapter.acquire);
  };
  const batch = await runSourceBatch({
    roots: expected.map(document => document.section), cache, adapter, now,
    maxAgeMs: OHIO_REVIEWED_MAX_AGE_MS, maxRequests, maxDepth: 0,
    acquire: args.includes("--acquire"), force: args.includes("--force"), retryFailures: args.includes("--retry-failures"), pinnedHashes: pins,
  });
  mkdirSync(resolve(".cache"), { recursive: true });
  atomicJson(cachePath, cache); // Retain successful acquisitions even when another dependency fails.
  const blocked = expected.filter(document =>
    batch.documents.get(document.section)?.contentHash !== document.contentHash);
  const evidence = {
    schemaVersion: 1, kind: "acquisition_comparison_not_approval",
    checkedAt: now.toISOString(), reportChargeIds: OHIO_REVIEWED_SOURCES.map(row => row.chargeId),
    metrics: batch.metrics, statuses: batch.statuses,
    changedPinnedSources: batch.changedPinnedSources,
    acquisitionFailures: Object.fromEntries(Object.entries(cache.failures).filter(([section]) => expectedBySection.has(section))),
    blockedDependencies: blocked.map(document => document.section),
  };
  atomicJson(evidencePath, evidence);
  if (blocked.length || batch.changedPinnedSources.length) {
    atomicJson(OHIO_REVIEWED_RECEIPT_PATH, {
      schemaVersion: 1, status: "blocked", checkedAt: now.toISOString(),
      reason: "A reviewed source changed, is stale, or is unavailable; pins were not updated.",
      documents: [],
    });
    throw new Error(`Ohio reviewed refresh blocked: ${blocked.map(row => row.section).join(", ")}`);
  }
  for (const [section, document] of batch.documents) cache.documents[section] = document;
  mkdirSync(resolve(".cache"), { recursive: true });
  atomicJson(cachePath, cache);
  atomicJson(OHIO_REVIEWED_RECEIPT_PATH, {
    schemaVersion: 1, reportHash:
      OHIO_REVIEWED_CURRENT_REVIEW_HASH,
    checkedAt: now.toISOString(),
    // A cache check must not grant another seven days to older acquisitions.
    expiresAt: ohioRefreshExpiry(expected.map(document => batch.documents.get(document.section)!)),
    documents: expected,
    metrics: batch.metrics,
  });
  console.log(JSON.stringify(evidence, null, 2));
  return evidence;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  refreshOhioReviewedSources().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}