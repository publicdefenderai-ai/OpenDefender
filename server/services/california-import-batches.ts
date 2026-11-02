import { and, eq, inArray, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  statuteSources, statuteSourceSnapshots, statuteChargeLinks, statuteUpdateQueue,
} from "@shared/schema";
import type { db } from "../db";
import type { CaliforniaSourceDatabaseSeed } from "../data/california-source-database-seed";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type Snapshot = typeof statuteSourceSnapshots.$inferSelect;
export const CALIFORNIA_IMPORT_BATCH_SIZE = 200;

export function californiaImportBatches<T>(rows: readonly T[]): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < rows.length; i += CALIFORNIA_IMPORT_BATCH_SIZE) {
    batches.push(rows.slice(i, i + CALIFORNIA_IMPORT_BATCH_SIZE));
  }
  return batches;
}

/**
 * Keep the old importer’s evidence decisions, but plan them in memory after
 * bounded reads. Never promote changed or previously withheld fingerprints.
 */
export function planCaliforniaSnapshots(
  seed: CaliforniaSourceDatabaseSeed,
  sourceIds: Map<string, string>,
  existing: Snapshot[],
) {
  const bySource = new Map<string, Snapshot[]>();
  for (const row of existing) {
    const rows = bySource.get(row.sourceId) ?? [];
    rows.push(row);
    bySource.set(row.sourceId, rows);
  }
  const inserts: Array<typeof statuteSourceSnapshots.$inferInsert> = [];
  const activeIds = new Map<string, string>();
  const changedCitations = new Map<string, string>();
  let reused = 0;
  let changes = 0;
  for (const snapshot of seed.snapshots) {
    const sourceId = sourceIds.get(snapshot.sourceKey);
    if (!sourceId) throw new Error(`Missing California source: ${snapshot.sourceKey}`);
    if (activeIds.has(snapshot.sourceKey)) throw new Error("Duplicate California snapshot source key.");
    const rows = bySource.get(sourceId) ?? [];
    const duplicates = rows.filter(row => row.contentHash === snapshot.contentHash);
    const currentRows = rows.filter(row => row.status === "current");
    if (duplicates.length > 1 || currentRows.length > 1) {
      throw new Error("Ambiguous California snapshot history; manual review required.");
    }
    const duplicate = duplicates[0];
    const current = currentRows[0];
    let activeId = duplicate?.status === "current" ? duplicate.id : current?.id;
    if (duplicate) {
      reused++;
    } else {
      const changed = !!current && current.contentHash !== snapshot.contentHash;
      const id = randomUUID();
      const { sourceKey: _sourceKey, ...values } = snapshot;
      inserts.push({
        ...values, id, sourceId,
        status: changed ? "pending_review" : "current",
        requiresReview: changed,
        supersedesSnapshotId: changed ? current.id : null,
      });
      if (changed) {
        changes++;
        changedCitations.set(snapshot.citation, snapshot.sourceUrl);
      } else {
        activeId = id;
      }
    }
    if (!activeId) throw new Error(`No current California snapshot for ${snapshot.citation}`);
    activeIds.set(snapshot.sourceKey, activeId);
  }
  return { inserts, activeIds, changedCitations, reused, changes };
}

export async function writeCaliforniaImportBatches(
  tx: Transaction,
  seed: CaliforniaSourceDatabaseSeed,
  runId: string,
  checkDeadline: () => void,
) {
  const sourceIds = new Map<string, string>();
  for (const batch of californiaImportBatches(seed.sources)) {
    checkDeadline();
    const rows = await tx.insert(statuteSources).values(batch.map(source => ({
      sourceKey: source.sourceKey, jurisdiction: source.jurisdiction,
      publisher: source.publisher, sourceType: source.sourceType,
      canonicalUrl: source.canonicalUrl, apiIdentifier: source.apiIdentifier,
      accessPolicy: source.accessPolicy, reuseStatus: source.reuseStatus,
      canStoreContent: source.canStoreContent, metadata: source.metadata, isActive: true,
    }))).onConflictDoUpdate({
      target: statuteSources.sourceKey,
      set: {
        canonicalUrl: sql`excluded.canonical_url`,
        apiIdentifier: sql`excluded.api_identifier`,
        accessPolicy: sql`excluded.access_policy`,
        reuseStatus: sql`excluded.reuse_status`,
        canStoreContent: sql`excluded.can_store_content`,
        metadata: sql`excluded.metadata`,
        isActive: true,
      },
    }).returning({ id: statuteSources.id, sourceKey: statuteSources.sourceKey });
    for (const row of rows) sourceIds.set(row.sourceKey, row.id);
  }
  const existing: Snapshot[] = [];
  for (const ids of californiaImportBatches([...sourceIds.values()])) {
    checkDeadline();
    existing.push(...await tx.select().from(statuteSourceSnapshots).where(and(
      eq(statuteSourceSnapshots.jurisdiction, "CA"),
      inArray(statuteSourceSnapshots.sourceId, ids),
    )));
  }
  const plan = planCaliforniaSnapshots(seed, sourceIds, existing);
  for (const batch of californiaImportBatches(plan.inserts)) {
    checkDeadline();
    await tx.insert(statuteSourceSnapshots).values(batch);
  }
  const queuedCitations = new Set<string>();
  for (const citations of californiaImportBatches([...plan.changedCitations.keys()])) {
    checkDeadline();
    const rows = await tx.select({ citation: statuteUpdateQueue.citation })
      .from(statuteUpdateQueue).where(and(
        eq(statuteUpdateQueue.jurisdiction, "CA"),
        eq(statuteUpdateQueue.status, "pending"),
        inArray(statuteUpdateQueue.citation, citations),
      ));
    for (const row of rows) queuedCitations.add(row.citation);
  }
  const queue = [...plan.changedCitations].filter(([citation]) => !queuedCitations.has(citation))
    .map(([citation, sourceUrl]) => ({
      jurisdiction: "CA", citation, reason: "source_change", triggeredBy: runId,
      priority: "high", status: "pending",
      errorMessage: `Reference fingerprint changed for ${sourceUrl}; human review required before promotion.`,
    }));
  for (const batch of californiaImportBatches(queue)) {
    checkDeadline();
    await tx.insert(statuteUpdateQueue).values(batch);
  }
  let linkCount = 0;
  for (const batch of californiaImportBatches(seed.links)) {
    checkDeadline();
    const rows = await tx.insert(statuteChargeLinks).values(batch.map(link => {
      const snapshotId = plan.activeIds.get(link.snapshotKey);
      if (!snapshotId) throw new Error(`Missing California snapshot for ${link.chargeId}`);
      return {
        chargeId: link.chargeId, snapshotId, supportRole: link.supportRole,
        citation: link.citation, subdivision: link.subdivision, isCurrent: true,
      };
    })).onConflictDoNothing({
      target: [statuteChargeLinks.chargeId, statuteChargeLinks.snapshotId, statuteChargeLinks.supportRole],
    }).returning({ id: statuteChargeLinks.id });
    linkCount += rows.length;
  }
  checkDeadline();
  return {
    snapshotInserted: plan.inserts.length, snapshotReused: plan.reused,
    changeCount: plan.changes, linkCount,
  };
}
