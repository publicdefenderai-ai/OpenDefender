/**
 * One resumable acquisition + deterministic evidence-review pass.
 * No paid model calls, approval mutations, database writes, or deployment.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
import { loadOhioAuthorityManifest } from "../../server/data/ohio-manifest-loader";
import {
  OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS, ohioChapter2903Evidence,
} from "../../server/data/ohio-chapter-2903-source";
import {
  getOhioChapter2903RefreshStatus, OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH,
} from "../../server/data/ohio-chapter-2903-refresh";
import { buildChapterPublicationReview } from "./ohio-discovery/review-chapter-2903";
import { createOhioAdapter, importOhioEvidence, OHIO_SOURCE_MAX_AGE_MS, sectionReferences } from "./batch/ohio-adapter";
import { runSourceBatch, type SourceCache } from "./batch/source-batch";
import { buildOhioBatchReview, ohioTargets, reviewCsv, reviewMarkdown } from "./batch/ohio-review-report";
import { reconcileReviewLedger, selectedReferences, type ReferenceLedger, type ReviewLedger } from "./batch/review-ledger";
import { checkOhioChapterIndex } from "./batch/ohio-index";
import { createOhioBulkAcquirer } from "./batch/ohio-bulk-source";

const directory = resolve("scripts/data-review/output");
function atomicJson(path: string, value: unknown) {
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, JSON.stringify(value, null, 2) + "\n");
  renameSync(temporary, path);
}

export async function runOhioEvidenceBatch(args = process.argv.slice(2)) {
  const startedAt = new Date();
  const started = performance.now();
  const numberOption = (name: string, fallback: number, max: number) => {
    const argument = args.find(arg => arg.startsWith(`${name}=`));
    const value = argument ? Number(argument.split("=")[1]) : fallback;
    if (!Number.isInteger(value) || value < 0 || value > max) throw new Error(`Invalid ${name}`);
    return value;
  };
  for (const arg of args) if (!["--acquire", "--retry-failures", "--force"].includes(arg) &&
      !/^--(?:max-requests|depth)=\d+$/.test(arg)) throw new Error(`Unknown option ${arg}`);
  const maxRequests = numberOption("--max-requests", 300, 2000);
  const maxDepth = numberOption("--depth", 2, 3);
  mkdirSync(directory, { recursive: true });
  const cachePath = resolve(directory, "ohio-batch-source-cache.json");
  const cache: SourceCache = existsSync(cachePath)
    ? JSON.parse(readFileSync(cachePath, "utf8")) : { schemaVersion: 1, documents: {}, failures: {} };
  if (cache.schemaVersion !== 1 || !cache.documents || !cache.failures) throw new Error("Invalid batch cache");
  const rejectedCacheEntries = importOhioEvidence(directory, cache);
  const manifest = loadOhioAuthorityManifest();
  const discovery = JSON.parse(readFileSync(resolve(directory, "ohio-chapter-2903-discovery.json"), "utf8"));
  const chapter = buildChapterPublicationReview(discovery); // exact enumeration + evidence hashes checked here
  const indexPath = resolve(directory, "ohio-batch-chapter-index.json");
  const indexCheck = await checkOhioChapterIndex(
    discovery.sections.map((section: { sectionId: string }) => section.sectionId),
    existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, "utf8")) : undefined,
    args.includes("--acquire") && maxRequests > 0, startedAt, OHIO_SOURCE_MAX_AGE_MS,
  );
  if (indexCheck.receipt) atomicJson(indexPath, indexCheck.receipt);
  else if (existsSync(indexPath)) unlinkSync(indexPath); // failed refresh cannot retain a usable old index
  const targets = ohioTargets(manifest.catalogRecords, chapter.rows);
  const pinnedHashes: Record<string, string> = {};
  const receiptFresh = getOhioChapter2903RefreshStatus(startedAt).fresh;
  for (const record of OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS) {
    for (const { document } of ohioChapter2903Evidence(record)) {
      pinnedHashes[document.section] = document.contentHash;
      // Pins provide approval identity, NOT a new acquisition timestamp.
      if (!cache.documents[document.section]) cache.documents[document.section] = {
        ...document, retrievedAt: new Date(document.retrievedAt).toISOString(),
        effectiveDateStart: document.effectiveDateStart!,
      };
    }
  }
  atomicJson(cachePath, cache);
  let revokedReceipt = false;
  const referenceLedgerPath = resolve(directory, "ohio-batch-reference-decisions.json");
  const referenceLedger: ReferenceLedger = existsSync(referenceLedgerPath)
    ? JSON.parse(readFileSync(referenceLedgerPath, "utf8")) : { schemaVersion: 1, decisions: {} };
  if (referenceLedger.schemaVersion !== 1 || !referenceLedger.decisions) throw new Error("Invalid reference ledger");
  if (!existsSync(referenceLedgerPath)) atomicJson(referenceLedgerPath, referenceLedger);
  const adapter = createOhioAdapter();
  const bulkAcquirer = createOhioBulkAcquirer(indexCheck.receipt);
  let individualHttpRequests = 0;
  const acquireGroup = async (section: string, requestBudget: number) => {
    const before = bulkAcquirer.metrics.httpRequests;
    let group;
    try {
      group = await bulkAcquirer(section);
    } catch (error) {
      if (bulkAcquirer.metrics.httpRequests - before >= requestBudget) throw error;
      individualHttpRequests++;
      return { documents: [await adapter.acquire(section)], requests: bulkAcquirer.metrics.httpRequests - before + 1 };
    }
    if (group.documents.some(document => document.section === section)) return group;
    // Some official chapter pages omit a section that still has its own current page.
    if (bulkAcquirer.metrics.httpRequests - before >= requestBudget) return group;
    individualHttpRequests++;
    return { documents: [...group.documents, await adapter.acquire(section)],
      requests: bulkAcquirer.metrics.httpRequests - before + 1 };
  };
  adapter.acquireGroup = async (section, requestBudget) => {
    const before = bulkAcquirer.metrics.httpRequests + individualHttpRequests;
    try {
      const result = await acquireGroup(section, requestBudget);
      return { ...result, requests: bulkAcquirer.metrics.httpRequests + individualHttpRequests - before };
    } catch (error) {
      throw Object.assign(new Error(error instanceof Error ? error.message : String(error)), {
        requestsUsed: bulkAcquirer.metrics.httpRequests + individualHttpRequests - before,
      });
    }
  };
  const defaultReferences = adapter.references;
  adapter.references = document => selectedReferences(
    document.section, document.contentHash, defaultReferences(document),
    sectionReferences(document.text).filter(section => section !== document.section), referenceLedger,
  );
  const batch = await runSourceBatch({
    roots: [...targets.flatMap(target => target.sections), ...Object.keys(pinnedHashes)], cache,
    adapter, now: startedAt, maxAgeMs: OHIO_SOURCE_MAX_AGE_MS,
    acquire: args.includes("--acquire"), retryFailures: args.includes("--retry-failures"),
    force: args.includes("--force"), maxRequests: Math.max(0, maxRequests - indexCheck.requests), maxDepth, pinnedHashes,
    checkpoint: next => {
      atomicJson(cachePath, next);
      const acquired = Object.keys(next.documents).length;
      console.log(`[ohio-batch] checkpoint: ${acquired} cached documents; ${Object.keys(next.failures).length} source failures`);
    },
    onPinnedFailure: (section, reason) => {
      revokedReceipt = true;
      atomicJson(OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, {
        schemaVersion: 1, checkedAt: new Date().toISOString(),
        expiresAt: new Date(0).toISOString(), documents: [], status: "blocked",
        reason: `Batch detected a pinned-source problem at ${section}: ${reason}`,
      });
    },
  });
  const report = buildOhioBatchReview(targets, batch, referenceLedger);
  const ledgerPath = resolve(directory, "ohio-batch-review-decisions.json");
  const previousLedger: ReviewLedger | undefined = existsSync(ledgerPath)
    ? JSON.parse(readFileSync(ledgerPath, "utf8")) : undefined;
  const { ledger, reviewState } = reconcileReviewLedger(report, previousLedger);
  atomicJson(ledgerPath, ledger);
  const receipt = {
    schemaVersion: 1, startedAt: startedAt.toISOString(), finishedAt: new Date().toISOString(),
    elapsedSeconds: Math.round((performance.now() - started) / 100) / 10,
    inputHash: report.inputHash, scope: "current_ohio_catalog_plus_remaining_chapter_2903",
    options: { acquire: args.includes("--acquire"), maxRequests, maxDepth },
    metrics: { ...batch.metrics, indexRequests: indexCheck.requests,
      sourceHttpRequests: bulkAcquirer.metrics.httpRequests,
      individualHttpRequests,
      totalHttpRequests: bulkAcquirer.metrics.httpRequests + individualHttpRequests + indexCheck.requests },
    rejectedCacheEntries, changedPinnedSources: batch.changedPinnedSources,
    unexpandedReferences: batch.unexpandedReferences,
    publicationReceiptFreshAtStart: receiptFresh, publicationReceiptRevoked: revokedReceipt,
    paidModelCalls: 0, actualAgentCost: "not_available_to_this_script",
    newChargesPublished: 0, summary: report.summary,
    coverage: {
      chapterEnumerationAsOf: discovery.generatedAt,
      enumeratedChapterSections: discovery.sections.length,
      chapterIndexAsOf: indexCheck.receipt?.retrievedAt ?? null,
      chapterIndexStatus: indexCheck.status,
      addedSections: indexCheck.added, removedSections: indexCheck.removed,
      statewideSectionEnumeration: "not_completed",
    },
  };
  atomicJson(resolve(directory, "ohio-batch-review.json"), report);
  atomicJson(resolve(directory, "ohio-batch-review-state.json"), reviewState);
  atomicJson(resolve(directory, "ohio-batch-run-receipt.json"), receipt);
  writeFileSync(resolve(directory, "ohio-batch-manual-review.md"),
    reviewMarkdown(report) + `\n## Coverage currentness\n\nThe original Chapter 2903 enumeration is from ${discovery.generatedAt}. Index check: ${indexCheck.status}; evidence date: ${indexCheck.receipt?.retrievedAt ?? "unavailable"}. Added sections: ${indexCheck.added.join(", ") || "none detected"}; removed sections: ${indexCheck.removed.join(", ") || "none detected"}. A changed or unavailable index is an explicit coverage blocker. Other Ohio chapters remain a statewide discovery gap.\n`);
  writeFileSync(resolve(directory, "ohio-batch-manual-review.csv"), reviewCsv(report));
  // Immutable run packets keep previous receipts and returned review templates auditable.
  const runDirectory = resolve(directory, "ohio-batch-runs", startedAt.toISOString().replace(/[:.]/g, "-"));
  mkdirSync(runDirectory, { recursive: true });
  atomicJson(resolve(runDirectory, "receipt.json"), receipt);
  atomicJson(resolve(runDirectory, "review.json"), report);
  writeFileSync(resolve(runDirectory, "manual-review.csv"), reviewCsv(report));
  console.log(JSON.stringify(receipt, null, 2));
  if (batch.metrics.failed || batch.metrics.cachedFailures || batch.metrics.deferred ||
      batch.changedPinnedSources.length || batch.unexpandedReferences.length ||
      !["reused_fresh_index", "acquired_index"].includes(indexCheck.status)) process.exitCode = 2;
  return receipt;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runOhioEvidenceBatch().catch(error => { console.error(error); process.exitCode = 1; });
}