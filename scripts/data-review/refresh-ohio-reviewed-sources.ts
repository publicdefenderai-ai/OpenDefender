/**
 * Refresh the finite, already-reviewed Ohio dependency set. Acquisition only
 * compares official text with reviewed hashes; it can never update those pins
 * or grant publication approval.
 */
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  OHIO_REVIEWED_MAX_AGE_MS,
  OHIO_REVIEWED_RECEIPT_PATH,
  OHIO_REVIEWED_SOURCES,
  ohioReviewedExpectedDocuments,
} from "../../server/data/ohio-reviewed-source";
import { createOhioAdapter } from "./batch/ohio-adapter";
import { createOhioBulkAcquirer } from "./batch/ohio-bulk-source";
import { runSourceBatch, type SourceCache } from "./batch/source-batch";

const output = resolve("scripts/data-review/output");
const cachePath = resolve(output, "ohio-batch-source-cache.json");
const evidencePath = resolve(output, "ohio-reviewed-refresh-evidence.json");
const atomicJson = (path: string, value: unknown) => {
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, JSON.stringify(value, null, 2) + "\n");
  renameSync(temporary, path);
};

export async function refreshOhioReviewedSources(args = process.argv.slice(2)) {
  for (const arg of args) {
    if (arg !== "--acquire" && !/^--max-requests=\d+$/.test(arg)) {
      throw new Error(`Unknown option ${arg}`);
    }
  }
  const maxRequests = Number(args.find(arg => arg.startsWith("--max-requests="))?.split("=")[1] ?? 80);
  if (!Number.isInteger(maxRequests) || maxRequests < 0 || maxRequests > 300) {
    throw new Error("Ohio reviewed refresh request budget must be between 0 and 300");
  }
  const now = new Date();
  const cache: SourceCache = existsSync(cachePath)
    ? JSON.parse(readFileSync(cachePath, "utf8"))
    : { schemaVersion: 1, documents: {}, failures: {} };
  // Supplemental reviewed authorities (including OAC 3701-12-01) participate
  // in the same seven-day cache boundary without being misrouted to ORC.
  for (const name of [
    "ohio-substantive-supplemental-evidence.json",
    "ohio-substantive-review-authorities.json",
  ]) {
    const value = JSON.parse(readFileSync(resolve(output, name), "utf8")) as {
      documents?: SourceCache["documents"];
    };
    Object.assign(cache.documents, value.documents ?? {});
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
      throw Object.assign(new Error(
        "A stale administrative-rule dependency requires a deliberate OAC refresh; it cannot be fetched through the ORC adapter.",
      ), { requestsUsed: 0 });
    }
    void requestBudget;
    return bulk(section);
  };
  const batch = await runSourceBatch({
    roots: expected.map(document => document.section), cache, adapter, now,
    maxAgeMs: OHIO_REVIEWED_MAX_AGE_MS, maxRequests, maxDepth: 0,
    acquire: args.includes("--acquire"), pinnedHashes: pins,
  });
  const blocked = expected.filter(document =>
    batch.documents.get(document.section)?.contentHash !== document.contentHash);
  const evidence = {
    schemaVersion: 1, kind: "acquisition_comparison_not_approval",
    checkedAt: now.toISOString(), reportChargeIds: OHIO_REVIEWED_SOURCES.map(row => row.chargeId),
    metrics: batch.metrics, statuses: batch.statuses,
    changedPinnedSources: batch.changedPinnedSources,
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
  atomicJson(OHIO_REVIEWED_RECEIPT_PATH, {
    schemaVersion: 1, reportHash:
      JSON.parse(readFileSync(resolve("shared/ohio-reviewed-eligibility.json"), "utf8")).reportHash,
    checkedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + OHIO_REVIEWED_MAX_AGE_MS).toISOString(),
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