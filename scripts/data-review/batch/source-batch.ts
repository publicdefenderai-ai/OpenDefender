import { createHash } from "node:crypto";

/** Acquisition is evidence, never permission to publish or change a charge. */
export interface BatchDocument {
  section: string;
  title: string;
  sourceUrl: string;
  text: string;
  contentHash: string;
  retrievedAt: string;
  effectiveDateStart: string;
  acquiredFrom?: string;
}

export interface SourceFailure {
  section: string;
  checkedAt: string;
  message: string;
}

export interface SourceCache {
  schemaVersion: 1;
  documents: Record<string, BatchDocument>;
  failures: Record<string, SourceFailure>;
}

export interface SourceAdapter {
  validate(document: BatchDocument): boolean;
  references(document: BatchDocument): string[];
  acquire(section: string): Promise<BatchDocument>;
  /** Some official publishers return an entire chapter in one HTTP response. */
  acquireGroup?(section: string, requestBudget: number): Promise<{ documents: BatchDocument[]; requests: number }>;
}

export const textHash = (text: string) => createHash("sha256").update(text).digest("hex");

export function freshDocument(
  document: BatchDocument | undefined, now: Date, maxAgeMs: number, adapter: SourceAdapter,
): document is BatchDocument {
  if (!document || !adapter.validate(document) || textHash(document.text) !== document.contentHash) return false;
  const age = now.getTime() - Date.parse(document.retrievedAt);
  return Number.isFinite(age) && age >= 0 && age < maxAgeMs;
}

export interface BatchOptions {
  roots: string[];
  cache: SourceCache;
  adapter: SourceAdapter;
  now: Date;
  maxAgeMs: number;
  maxRequests: number;
  /** A bounded evidence graph, not a claim that every reference is legally applicable. */
  maxDepth: number;
  acquire: boolean;
  retryFailures?: boolean;
  force?: boolean;
  pinnedHashes?: Record<string, string>;
  checkpoint?: (cache: SourceCache) => void;
  onPinnedFailure?: (section: string, reason: string) => void;
}

export async function runSourceBatch(options: BatchOptions) {
  const { adapter, cache, now } = options;
  const documents = new Map<string, BatchDocument>();
  const statuses: Record<string, string> = {};
  const edges: Record<string, string[]> = {};
  const changedPinnedSources: string[] = [];
  const metrics = { requests: 0, reused: 0, acquired: 0, bulkDocumentsCached: 0, failed: 0, cachedFailures: 0, deferred: 0 };
  const seen = new Set<string>();
  let frontier = [...new Set(options.roots)].sort();
  for (let depth = 0; depth <= options.maxDepth && frontier.length; depth++) {
    const next = new Set<string>();
    for (const section of frontier) {
      if (seen.has(section)) continue;
      seen.add(section);
      let document = cache.documents[section];
      const failure = cache.failures[section];
      const failureAge = failure ? now.getTime() - Date.parse(failure.checkedAt) : Infinity;
      if (failure && failureAge >= 0 && failureAge < 30 * 60_000 && !options.retryFailures && !options.force) {
        statuses[section] = "cached_acquisition_failure";
        metrics.cachedFailures++;
        continue;
      }
      if (!options.force && !failure && freshDocument(document, now, options.maxAgeMs, adapter)) {
        metrics.reused++;
        statuses[section] = "reused_fresh_evidence";
      } else if (!options.acquire || metrics.requests >= options.maxRequests) {
        statuses[section] = options.acquire ? "request_budget_deferred" : "acquisition_required";
        metrics.deferred++;
        continue;
      } else {
        metrics.requests++;
        try {
          if (adapter.acquireGroup) {
            const group = await adapter.acquireGroup(section, options.maxRequests - metrics.requests + 1);
            metrics.requests += group.requests - 1;
            for (const sibling of group.documents) {
              if (!freshDocument(sibling, new Date(), options.maxAgeMs, adapter)) {
                throw new Error("Invalid grouped source identity, hash or currentness");
              }
              cache.documents[sibling.section] = sibling;
              delete cache.failures[sibling.section];
              if (options.pinnedHashes?.[sibling.section] && options.pinnedHashes[sibling.section] !== sibling.contentHash) {
                if (!changedPinnedSources.includes(sibling.section)) changedPinnedSources.push(sibling.section);
                options.onPinnedFailure?.(sibling.section, "Official chapter text differs from the approved pin");
              }
            }
            metrics.bulkDocumentsCached += group.documents.length;
            document = group.documents.find(sibling => sibling.section === section)!;
            if (!document) throw new Error(`Official chapter does not provide current text for ${section}`);
          } else document = await adapter.acquire(section);
          // Acquisition timestamps may be later than the fixed batch start.
          if (document.section !== section || !freshDocument(document, new Date(), options.maxAgeMs, adapter)) {
            throw new Error("Invalid section identity, source hash, currentness or extraction");
          }
          cache.documents[section] = document;
          delete cache.failures[section];
          metrics.acquired++;
          statuses[section] = "acquired_evidence";
        } catch (error) {
          if (adapter.acquireGroup && error && typeof error === "object" &&
              "requestsUsed" in error && Number.isInteger(error.requestsUsed) &&
              Number(error.requestsUsed) >= 0) {
            metrics.requests += Number(error.requestsUsed) - 1;
          }
          const message = error instanceof Error ? error.message : String(error);
          cache.failures[section] = { section, checkedAt: new Date().toISOString(), message };
          // Never fall back to old text after a failed refresh.
          delete cache.documents[section];
          statuses[section] = "acquisition_failure";
          metrics.failed++;
          if (options.pinnedHashes?.[section]) options.onPinnedFailure?.(section, message);
          options.checkpoint?.(cache);
          continue;
        }
        options.checkpoint?.(cache);
      }
      if (options.pinnedHashes?.[section] && options.pinnedHashes[section] !== document.contentHash) {
        if (!changedPinnedSources.includes(section)) changedPinnedSources.push(section);
        statuses[section] = "changed_pinned_source";
        options.onPinnedFailure?.(section, "Official text differs from the approved pin");
      }
      documents.set(section, document);
      edges[section] = [...new Set(adapter.references(document))].sort();
      for (const reference of edges[section]) if (!seen.has(reference)) next.add(reference);
    }
    frontier = [...next].sort();
  }
  const unexpandedReferences = [...new Set(Object.values(edges).flat())]
    .filter(section => !documents.has(section)).sort();
  return { documents, statuses, edges, metrics, changedPinnedSources, unexpandedReferences };
}

export interface EvidenceQuote {
  text: string;
  start: number;
  end: number;
  sourceHash: string;
}

export function quoteLines(document: BatchDocument, pattern: RegExp): EvidenceQuote[] {
  const quotes: EvidenceQuote[] = [];
  let offset = 0;
  for (const text of document.text.split("\n")) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) quotes.push({
      text, start: offset, end: offset + text.length, sourceHash: document.contentHash,
    });
    offset += text.length + 1;
  }
  return quotes;
}