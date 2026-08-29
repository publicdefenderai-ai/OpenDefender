import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  statuteChargeLinks,
  statuteIngestionRuns,
  statuteSourceReviewDecisions,
  statuteSourceSnapshots,
  statuteSources,
  statuteUpdateQueue,
} from "@shared/schema";
import { db } from "../db";
import { errLog, opsLog } from "../utils/dev-logger";

export type AuthoritySupportRole =
  | "offense"
  | "grading"
  | "penalty"
  | "currentness"
  | "jury_instruction";

export interface AuthorityProvisionSeed {
  sourceKey: string;
  lawId: string;
  section: string;
  citation: string;
  officialTitle: string;
  sourceUrl: string;
  content: string | null;
  contentHash: string;
  hashBasis: "source_content" | "reference_metadata";
  retrievedAt: Date | null;
  effectiveDateStart: string | null;
  effectiveDateEnd: string | null;
  supportRole: AuthoritySupportRole;
  subdivision: string | null;
  metadata: Record<string, unknown>;
}

export interface AuthorityCatalogRecord {
  chargeId: string;
  catalogLabel: string;
  catalogCode: string;
  catalogCategory: string;
  disposition: "retain" | "exact_alias_rename" | "require_exact_reselection" | "remove";
  dispositionReason: string;
  canonicalTitle: string | null;
  provisions: AuthorityProvisionSeed[];
  apiStatus: "verified" | "api_error" | "placeholder";
  error?: string;
}

export interface AuthoritySourceSeed {
  sourceKey: string;
  jurisdiction: string;
  publisher: string;
  sourceType: "statute";
  canonicalUrl: string;
  apiIdentifier: string | null;
  accessPolicy: "reference_only" | "store_text";
  reuseStatus: "permitted" | "restricted" | "not_cleared";
  canStoreContent: boolean;
  lastRetrievedAt: Date | null;
  lastCheckedAt: Date | null;
  metadata: Record<string, unknown>;
}

export interface AuthoritySnapshotSeed {
  sourceKey: string;
  jurisdiction: string;
  citation: string;
  section: string;
  officialTitle: string;
  sourceUrl: string;
  content: string | null;
  contentHash: string;
  hashBasis: "source_content" | "reference_metadata";
  retrievedAt: Date | null;
  manifestImportedAt: Date;
  effectiveDateStart: string | null;
  effectiveDateEnd: string | null;
  status: "current";
  requiresReview: false;
  supersedesSnapshotId: null;
  metadata: Record<string, unknown>;
}

export interface AuthorityChargeLinkSeed {
  chargeId: string;
  snapshotKey: string;
  supportRole: AuthoritySupportRole;
  citation: string;
  subdivision: string | null;
}

export interface AuthoritySourceDatabaseSeed {
  jurisdiction: string;
  sourcePolicy: string;
  sources: AuthoritySourceSeed[];
  snapshots: AuthoritySnapshotSeed[];
  links: AuthorityChargeLinkSeed[];
  catalogRecords: AuthorityCatalogRecord[];
  selectableChargeIds: string[];
  generatedAt: Date;
}

export interface AuthoritySourceDatabaseResult {
  success: boolean;
  runId: string;
  sourceCount: number;
  snapshotInserted: number;
  snapshotReused: number;
  changeCount: number;
  linkCount: number;
  errorCount: number;
  selectableChargeCount: number;
  catalogRecordCount: number;
  message: string;
}

export interface PendingAuthoritySourceSnapshot {
  id: string;
  sourceKey: string;
  jurisdiction: string;
  publisher: string;
  citation: string;
  section: string;
  officialTitle: string;
  sourceUrl: string;
  contentHash: string;
  hashBasis: string;
  retrievedAt: Date | null;
  manifestImportedAt: Date;
  effectiveDateStart: string | null;
  effectiveDateEnd: string | null;
  supersedesSnapshotId: string | null;
  metadata: unknown;
  predecessor: {
    id: string;
    contentHash: string;
    hashBasis: string;
    citation: string;
    section: string;
    officialTitle: string;
    sourceUrl: string;
    retrievedAt: Date | null;
    manifestImportedAt: Date;
    effectiveDateStart: string | null;
    effectiveDateEnd: string | null;
    status: "current" | "superseded";
  } | null;
}

export type AuthoritySourceReviewDecision = "approve" | "reject";

export interface AuthoritySourceReviewInput {
  jurisdiction: string;
  snapshotId: string;
  decision: AuthoritySourceReviewDecision;
  reviewer: string;
  note?: string;
}

export interface AuthoritySourceReviewResult {
  decision: AuthoritySourceReviewDecision;
  snapshot: PendingAuthoritySourceSnapshot & {
    status: "current" | "superseded";
    requiresReview: boolean;
  };
  affectedChargeIds: string[];
  restoredLinkCount: number;
  auditId: string;
}

export class AuthoritySourceReviewError extends Error {
  constructor(
    message: string,
    public readonly statusCode: 400 | 404 | 409,
  ) {
    super(message);
    this.name = "AuthoritySourceReviewError";
  }
}

function linkKey(
  chargeId: string,
  sourceKey: string,
  supportRole: string,
  citation: string,
  subdivision: string | null,
): string {
  return [chargeId, sourceKey, supportRole, citation, subdivision ?? ""].join("|");
}

export async function getCurrentAuthoritySelectableChargeIds(
  jurisdiction: string,
): Promise<Set<string>> {
  const [latestRun] = await db
    .select({ metadata: statuteIngestionRuns.metadata })
    .from(statuteIngestionRuns)
    .where(and(
      eq(statuteIngestionRuns.jurisdiction, jurisdiction),
      eq(statuteIngestionRuns.status, "completed"),
    ))
    .orderBy(desc(statuteIngestionRuns.startedAt))
    .limit(1);
  if (!latestRun) return new Set();

  const metadata = latestRun.metadata as {
    selectableChargeIds?: unknown;
    catalogRecords?: unknown;
  } | null;
  const selectable = new Set(
    Array.isArray(metadata?.selectableChargeIds)
      ? metadata.selectableChargeIds.filter((value): value is string => typeof value === "string")
      : [],
  );
  if (selectable.size === 0) return selectable;

  const expected = new Map<string, Set<string>>();
  if (Array.isArray(metadata?.catalogRecords)) {
    for (const value of metadata.catalogRecords) {
      const record = value as { chargeId?: unknown; provisions?: unknown };
      if (typeof record.chargeId !== "string" || !selectable.has(record.chargeId) ||
          !Array.isArray(record.provisions)) continue;
      const required = new Set<string>();
      for (const item of record.provisions) {
        const provision = item as {
          sourceKey?: unknown;
          supportRole?: unknown;
          citation?: unknown;
          subdivision?: unknown;
        };
        if (typeof provision.sourceKey === "string" &&
            typeof provision.supportRole === "string" &&
            typeof provision.citation === "string") {
          required.add(linkKey(
            record.chargeId,
            provision.sourceKey,
            provision.supportRole,
            provision.citation,
            typeof provision.subdivision === "string" ? provision.subdivision : null,
          ));
        }
      }
      expected.set(record.chargeId, required);
    }
  }

  const currentLinks = await db
    .select({
      chargeId: statuteChargeLinks.chargeId,
      sourceKey: statuteSources.sourceKey,
      supportRole: statuteChargeLinks.supportRole,
      citation: statuteChargeLinks.citation,
      subdivision: statuteChargeLinks.subdivision,
    })
    .from(statuteChargeLinks)
    .innerJoin(statuteSourceSnapshots, eq(statuteChargeLinks.snapshotId, statuteSourceSnapshots.id))
    .innerJoin(statuteSources, eq(statuteSourceSnapshots.sourceId, statuteSources.id))
    .where(and(
      eq(statuteChargeLinks.isCurrent, true),
      eq(statuteSourceSnapshots.jurisdiction, jurisdiction),
      eq(statuteSourceSnapshots.status, "current"),
    ));
  const actual = new Map<string, Set<string>>();
  for (const link of currentLinks) {
    const values = actual.get(link.chargeId) ?? new Set<string>();
    values.add(linkKey(
      link.chargeId,
      link.sourceKey,
      link.supportRole,
      link.citation,
      link.subdivision,
    ));
    actual.set(link.chargeId, values);
  }

  return new Set([...selectable].filter((chargeId) => {
    const required = expected.get(chargeId);
    const current = actual.get(chargeId);
    return Boolean(required?.size && current &&
      [...required].every((key) => current.has(key)));
  }));
}

export async function seedAuthoritySourceDatabase(
  seed: AuthoritySourceDatabaseSeed,
): Promise<AuthoritySourceDatabaseResult> {
  const runId = randomUUID();
  let snapshotInserted = 0;
  let snapshotReused = 0;
  let changeCount = 0;
  let linkCount = 0;

  await db.insert(statuteIngestionRuns).values({
    id: runId,
    jurisdiction: seed.jurisdiction,
    operation: "seed",
    status: "in_progress",
    sourceCount: seed.sources.length,
    metadata: {
      sourcePolicy: seed.sourcePolicy,
      generatedAt: seed.generatedAt.toISOString(),
      catalogRecordCount: seed.catalogRecords.length,
      selectableChargeCount: seed.selectableChargeIds.length,
      selectableChargeIds: seed.selectableChargeIds,
      catalogRecords: seed.catalogRecords,
    },
  });

  try {
    await db.transaction(async (tx) => {
      const sourceIds = new Map<string, string>();
      for (const source of seed.sources) {
        const [row] = await tx.insert(statuteSources).values({
          sourceKey: source.sourceKey,
          jurisdiction: source.jurisdiction,
          publisher: source.publisher,
          sourceType: source.sourceType,
          canonicalUrl: source.canonicalUrl,
          apiIdentifier: source.apiIdentifier,
          accessPolicy: source.accessPolicy,
          reuseStatus: source.reuseStatus,
          canStoreContent: source.canStoreContent,
          lastRetrievedAt: source.lastRetrievedAt,
          lastCheckedAt: source.lastCheckedAt,
          metadata: source.metadata,
          isActive: true,
        }).onConflictDoUpdate({
          target: statuteSources.sourceKey,
          set: {
            canonicalUrl: source.canonicalUrl,
            apiIdentifier: source.apiIdentifier,
            accessPolicy: source.accessPolicy,
            reuseStatus: source.reuseStatus,
            canStoreContent: source.canStoreContent,
            lastRetrievedAt: source.lastRetrievedAt,
            lastCheckedAt: source.lastCheckedAt,
            metadata: source.metadata,
            isActive: true,
          },
        }).returning({ id: statuteSources.id });
        if (!row) throw new Error(`Unable to upsert ${seed.jurisdiction} source ${source.sourceKey}`);
        sourceIds.set(source.sourceKey, row.id);
      }

      const activeSnapshotIds = new Map<string, string>();
      const pendingSnapshotKeys = new Set<string>();
      for (const snapshot of seed.snapshots) {
        const sourceId = sourceIds.get(snapshot.sourceKey);
        if (!sourceId) throw new Error(`Missing ${seed.jurisdiction} source ${snapshot.sourceKey}`);
        const [duplicate] = await tx.select({
          id: statuteSourceSnapshots.id,
          status: statuteSourceSnapshots.status,
          metadata: statuteSourceSnapshots.metadata,
        }).from(statuteSourceSnapshots).where(and(
          eq(statuteSourceSnapshots.sourceId, sourceId),
          eq(statuteSourceSnapshots.citation, snapshot.citation),
          eq(statuteSourceSnapshots.officialTitle, snapshot.officialTitle),
          eq(statuteSourceSnapshots.contentHash, snapshot.contentHash),
        )).limit(1);
        const [current] = await tx.select({
          id: statuteSourceSnapshots.id,
          metadata: statuteSourceSnapshots.metadata,
        }).from(statuteSourceSnapshots).where(and(
          eq(statuteSourceSnapshots.sourceId, sourceId),
          eq(statuteSourceSnapshots.status, "current"),
        )).limit(1);
        const key = `${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}`;
        const fingerprint = snapshot.metadata.fingerprint;
        const duplicateFingerprint = (duplicate?.metadata as { fingerprint?: string } | null)?.fingerprint;
        const currentFingerprint = (current?.metadata as { fingerprint?: string } | null)?.fingerprint;

        // Recover rows that were marked pending by an earlier metadata-only
        // refresh. The verified title and content hash still match, and there
        // is no competing current row, so the corrected evidence is safe to
        // promote without treating it as a statutory text change.
        if (duplicate && !current && duplicate.status !== "current") {
          await tx.update(statuteSourceSnapshots).set({
            sourceUrl: snapshot.sourceUrl,
            retrievedAt: snapshot.retrievedAt,
            manifestImportedAt: snapshot.manifestImportedAt,
            effectiveDateStart: snapshot.effectiveDateStart,
            effectiveDateEnd: snapshot.effectiveDateEnd,
            status: "current",
            requiresReview: false,
            supersedesSnapshotId: null,
            metadata: snapshot.metadata,
          }).where(eq(statuteSourceSnapshots.id, duplicate.id));
          snapshotReused++;
          activeSnapshotIds.set(key, duplicate.id);
          continue;
        }
        if (duplicate && duplicateFingerprint === fingerprint) {
          snapshotReused++;
          activeSnapshotIds.set(key, duplicate.status === "current" ? duplicate.id : current?.id ?? duplicate.id);
          if (duplicate.status !== "current") pendingSnapshotKeys.add(key);
          continue;
        }
        // A parser or metadata correction must not look like a statutory
        // source change when the verified title and content hash are stable.
        // Refresh the current row in place so corrected currentness evidence
        // remains available without bypassing review for actual text changes.
        if (duplicate && (!current || duplicate.status === "current")) {
          await tx.update(statuteSourceSnapshots).set({
            sourceUrl: snapshot.sourceUrl,
            retrievedAt: snapshot.retrievedAt,
            manifestImportedAt: snapshot.manifestImportedAt,
            effectiveDateStart: snapshot.effectiveDateStart,
            effectiveDateEnd: snapshot.effectiveDateEnd,
            status: "current",
            requiresReview: false,
            supersedesSnapshotId: null,
            metadata: snapshot.metadata,
          }).where(eq(statuteSourceSnapshots.id, duplicate.id));
          snapshotReused++;
          activeSnapshotIds.set(key, duplicate.id);
          continue;
        }
        if (duplicate && duplicate.status === "current") {
          await tx.update(statuteSourceSnapshots).set({
            sourceUrl: snapshot.sourceUrl,
            retrievedAt: snapshot.retrievedAt,
            manifestImportedAt: snapshot.manifestImportedAt,
            effectiveDateStart: snapshot.effectiveDateStart,
            effectiveDateEnd: snapshot.effectiveDateEnd,
            status: "pending_review",
            requiresReview: true,
            metadata: snapshot.metadata,
          }).where(eq(statuteSourceSnapshots.id, duplicate.id));
          activeSnapshotIds.set(key, duplicate.id);
          pendingSnapshotKeys.add(key);
          snapshotInserted++;
          changeCount++;
          await queueAuthorityChange(tx, seed.jurisdiction, snapshot.citation, runId, duplicate.id,
            `Official ${seed.jurisdiction} source metadata changed; attorney review is required before promotion.`);
          continue;
        }
        if (duplicate) {
          snapshotReused++;
          activeSnapshotIds.set(key, current?.id ?? duplicate.id);
          if (current) pendingSnapshotKeys.add(key);
          continue;
        }
        if (current && currentFingerprint !== fingerprint) {
          const restorableLinks = await tx.select({
            chargeId: statuteChargeLinks.chargeId,
            supportRole: statuteChargeLinks.supportRole,
            citation: statuteChargeLinks.citation,
            subdivision: statuteChargeLinks.subdivision,
          }).from(statuteChargeLinks).where(and(
            eq(statuteChargeLinks.snapshotId, current.id),
            eq(statuteChargeLinks.isCurrent, true),
          ));
          const [pending] = await tx.insert(statuteSourceSnapshots).values({
            sourceId,
            jurisdiction: snapshot.jurisdiction,
            citation: snapshot.citation,
            section: snapshot.section,
            officialTitle: snapshot.officialTitle,
            sourceUrl: snapshot.sourceUrl,
            content: snapshot.content,
            contentHash: snapshot.contentHash,
            hashBasis: snapshot.hashBasis,
            retrievedAt: snapshot.retrievedAt,
            manifestImportedAt: snapshot.manifestImportedAt,
            effectiveDateStart: snapshot.effectiveDateStart,
            effectiveDateEnd: snapshot.effectiveDateEnd,
            status: "pending_review",
            requiresReview: true,
            supersedesSnapshotId: current.id,
            metadata: {
              ...snapshot.metadata,
              authorityReview: {
                restorableLinks,
              },
            },
          }).returning({ id: statuteSourceSnapshots.id });
          if (!pending) throw new Error(`Unable to record changed ${seed.jurisdiction} snapshot ${snapshot.citation}`);
          activeSnapshotIds.set(key, current.id);
          pendingSnapshotKeys.add(key);
          snapshotInserted++;
          changeCount++;
          await queueAuthorityChange(tx, seed.jurisdiction, snapshot.citation, runId, pending.id,
            `Official ${seed.jurisdiction} source content changed; attorney review is required before promotion.`);
          continue;
        }
        const [inserted] = await tx.insert(statuteSourceSnapshots).values({
          sourceId,
          jurisdiction: snapshot.jurisdiction,
          citation: snapshot.citation,
          section: snapshot.section,
          officialTitle: snapshot.officialTitle,
          sourceUrl: snapshot.sourceUrl,
          content: snapshot.content,
          contentHash: snapshot.contentHash,
          hashBasis: snapshot.hashBasis,
          retrievedAt: snapshot.retrievedAt,
          manifestImportedAt: snapshot.manifestImportedAt,
          effectiveDateStart: snapshot.effectiveDateStart,
          effectiveDateEnd: snapshot.effectiveDateEnd,
          status: "current",
          requiresReview: false,
          supersedesSnapshotId: null,
          metadata: snapshot.metadata,
        }).returning({ id: statuteSourceSnapshots.id });
        if (!inserted) throw new Error(`Unable to insert ${seed.jurisdiction} snapshot ${snapshot.citation}`);
        activeSnapshotIds.set(key, inserted.id);
        snapshotInserted++;
      }

      for (const link of seed.links) {
        const snapshot = seed.snapshots.find((candidate) =>
          candidate.sourceKey === link.snapshotKey &&
          candidate.citation === link.citation,
        );
        if (!snapshot) throw new Error(`Missing ${seed.jurisdiction} snapshot for ${link.chargeId}`);
        const snapshotId = activeSnapshotIds.get(
          `${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}`,
        );
        if (!snapshotId) throw new Error(`Missing active ${seed.jurisdiction} snapshot for ${link.chargeId}`);
        if (pendingSnapshotKeys.has(
          `${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}`,
        )) continue;
        const inserted = await tx.insert(statuteChargeLinks).values({
          chargeId: link.chargeId,
          snapshotId,
          supportRole: link.supportRole,
          citation: link.citation,
          subdivision: link.subdivision,
          isCurrent: true,
        }).onConflictDoUpdate({
          target: [
            statuteChargeLinks.chargeId,
            statuteChargeLinks.snapshotId,
            statuteChargeLinks.supportRole,
          ],
          set: {
            citation: link.citation,
            subdivision: link.subdivision,
            isCurrent: true,
          },
        });
        if ((inserted.rowCount ?? 0) > 0) linkCount++;
      }

      const desiredLinks = new Set(seed.links.flatMap((link) => {
        const snapshot = seed.snapshots.find((candidate) =>
          candidate.sourceKey === link.snapshotKey && candidate.citation === link.citation);
        if (!snapshot || pendingSnapshotKeys.has(
          `${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}`,
        )) return [];
        return [linkKey(link.chargeId, link.snapshotKey, link.supportRole, link.citation, link.subdivision)];
      }));
      const manifestChargeIds = [...new Set(seed.catalogRecords.map((record) => record.chargeId))];
      if (manifestChargeIds.length > 0) {
        const existing = await tx.select({
          id: statuteChargeLinks.id,
          chargeId: statuteChargeLinks.chargeId,
          supportRole: statuteChargeLinks.supportRole,
          sourceKey: statuteSources.sourceKey,
          citation: statuteChargeLinks.citation,
          subdivision: statuteChargeLinks.subdivision,
        }).from(statuteChargeLinks)
          .innerJoin(statuteSourceSnapshots, eq(statuteChargeLinks.snapshotId, statuteSourceSnapshots.id))
          .innerJoin(statuteSources, eq(statuteSourceSnapshots.sourceId, statuteSources.id))
          .where(and(
            eq(statuteChargeLinks.isCurrent, true),
            eq(statuteSourceSnapshots.jurisdiction, seed.jurisdiction),
            inArray(statuteChargeLinks.chargeId, manifestChargeIds),
          ));
        const staleIds = existing.filter((link) => !desiredLinks.has(
          linkKey(link.chargeId, link.sourceKey, link.supportRole, link.citation, link.subdivision),
        )).map((link) => link.id);
        if (staleIds.length > 0) {
          await tx.update(statuteChargeLinks).set({ isCurrent: false })
            .where(inArray(statuteChargeLinks.id, staleIds));
        }
      }
      const withheldIds = seed.catalogRecords
        .filter((record) => record.disposition !== "retain" && record.disposition !== "exact_alias_rename")
        .map((record) => record.chargeId);
      if (withheldIds.length > 0) {
        await tx.update(statuteChargeLinks).set({ isCurrent: false })
          .where(inArray(statuteChargeLinks.chargeId, withheldIds));
      }
      await tx.update(statuteIngestionRuns).set({
        status: "completed",
        snapshotCount: snapshotInserted,
        linkCount,
        changeCount,
        completedAt: new Date(),
      }).where(eq(statuteIngestionRuns.id, runId));
    });
    const message = `${seed.jurisdiction} source database seeded: ${seed.sources.length} sources, ${snapshotInserted} snapshots, ${linkCount} links, ${seed.selectableChargeIds.length} selectable charges, ${changeCount} changes queued for review.`;
    opsLog("authority-source-db", message);
    return {
      success: true, runId, sourceCount: seed.sources.length, snapshotInserted,
      snapshotReused, changeCount, linkCount, errorCount: 0,
      selectableChargeCount: seed.selectableChargeIds.length,
      catalogRecordCount: seed.catalogRecords.length, message,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : `Unknown ${seed.jurisdiction} source database error`;
    await db.update(statuteIngestionRuns).set({
      status: "failed", errorCount: 1, errorMessage: message, completedAt: new Date(),
    }).where(eq(statuteIngestionRuns.id, runId));
    errLog(`${seed.jurisdiction} source database seed failed`, error);
    return {
      success: false, runId, sourceCount: seed.sources.length, snapshotInserted,
      snapshotReused, changeCount, linkCount, errorCount: 1,
      selectableChargeCount: seed.selectableChargeIds.length,
      catalogRecordCount: seed.catalogRecords.length,
      message: `${seed.jurisdiction} source database seed failed: ${message}`,
    };
  }
}

async function queueAuthorityChange(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  jurisdiction: string,
  citation: string,
  runId: string,
  snapshotId: string,
  message: string,
): Promise<void> {
  const [existing] = await tx.select({ id: statuteUpdateQueue.id })
    .from(statuteUpdateQueue).where(and(
      eq(statuteUpdateQueue.jurisdiction, jurisdiction),
      eq(statuteUpdateQueue.citation, citation),
      eq(statuteUpdateQueue.status, "pending"),
    )).limit(1);
  if (!existing) {
    await tx.insert(statuteUpdateQueue).values({
      jurisdiction,
      citation,
      snapshotId,
      reason: "source_change",
      triggeredBy: runId,
      priority: "high",
      status: "pending",
      errorMessage: message,
    });
  }
}

export async function getAuthoritySourceDatabaseStatus(jurisdiction: string) {
  const [sourceCount, snapshotCount, currentSnapshotCount, pendingReviewCount, linkedChargeCount, lastRun] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(statuteSources)
        .where(eq(statuteSources.jurisdiction, jurisdiction)),
      db.select({ count: sql<number>`count(*)` }).from(statuteSourceSnapshots)
        .where(eq(statuteSourceSnapshots.jurisdiction, jurisdiction)),
      db.select({ count: sql<number>`count(*)` }).from(statuteSourceSnapshots)
        .where(and(eq(statuteSourceSnapshots.jurisdiction, jurisdiction),
          eq(statuteSourceSnapshots.status, "current"))),
      db.select({ count: sql<number>`count(*)` }).from(statuteSourceSnapshots)
        .where(and(eq(statuteSourceSnapshots.jurisdiction, jurisdiction),
          eq(statuteSourceSnapshots.requiresReview, true))),
      db.select({ count: sql<number>`count(distinct ${statuteChargeLinks.chargeId})` })
        .from(statuteChargeLinks)
        .innerJoin(statuteSourceSnapshots, eq(statuteChargeLinks.snapshotId, statuteSourceSnapshots.id))
        .where(and(eq(statuteSourceSnapshots.jurisdiction, jurisdiction),
          eq(statuteChargeLinks.isCurrent, true))),
      db.select({
        id: statuteIngestionRuns.id,
        status: statuteIngestionRuns.status,
        startedAt: statuteIngestionRuns.startedAt,
        completedAt: statuteIngestionRuns.completedAt,
        changeCount: statuteIngestionRuns.changeCount,
        errorCount: statuteIngestionRuns.errorCount,
        metadata: statuteIngestionRuns.metadata,
      }).from(statuteIngestionRuns).where(eq(statuteIngestionRuns.jurisdiction, jurisdiction))
        .orderBy(desc(statuteIngestionRuns.startedAt)).limit(1),
    ]);
  const metadata = lastRun[0]?.metadata as {
    selectableChargeCount?: number;
    catalogRecordCount?: number;
  } | null;
  return {
    sourceCount: Number(sourceCount[0]?.count ?? 0),
    snapshotCount: Number(snapshotCount[0]?.count ?? 0),
    currentSnapshotCount: Number(currentSnapshotCount[0]?.count ?? 0),
    pendingReviewCount: Number(pendingReviewCount[0]?.count ?? 0),
    linkedChargeCount: Number(linkedChargeCount[0]?.count ?? 0),
    selectableChargeCount: Number(metadata?.selectableChargeCount ?? 0),
    catalogRecordCount: Number(metadata?.catalogRecordCount ?? 0),
    lastRun: lastRun[0] ? {
      id: lastRun[0].id,
      status: lastRun[0].status,
      startedAt: lastRun[0].startedAt,
      completedAt: lastRun[0].completedAt,
      changeCount: lastRun[0].changeCount,
      errorCount: lastRun[0].errorCount,
    } : null,
  };
}

/**
 * Return review-safe metadata for pending snapshots. Source text is excluded
 * deliberately: reviewers need the exact hash, title, and official link before
 * deciding, while the authority content remains server-side.
 */
export async function getPendingAuthoritySourceSnapshots(
  jurisdiction: string,
): Promise<PendingAuthoritySourceSnapshot[]> {
  const rows = await db.select({
    id: statuteSourceSnapshots.id,
    sourceKey: statuteSources.sourceKey,
    jurisdiction: statuteSourceSnapshots.jurisdiction,
    publisher: statuteSources.publisher,
    citation: statuteSourceSnapshots.citation,
    section: statuteSourceSnapshots.section,
    officialTitle: statuteSourceSnapshots.officialTitle,
    sourceUrl: statuteSourceSnapshots.sourceUrl,
    contentHash: statuteSourceSnapshots.contentHash,
    hashBasis: statuteSourceSnapshots.hashBasis,
    retrievedAt: statuteSourceSnapshots.retrievedAt,
    manifestImportedAt: statuteSourceSnapshots.manifestImportedAt,
    effectiveDateStart: statuteSourceSnapshots.effectiveDateStart,
    effectiveDateEnd: statuteSourceSnapshots.effectiveDateEnd,
    supersedesSnapshotId: statuteSourceSnapshots.supersedesSnapshotId,
    metadata: statuteSourceSnapshots.metadata,
  }).from(statuteSourceSnapshots)
    .innerJoin(statuteSources, eq(statuteSourceSnapshots.sourceId, statuteSources.id))
    .where(and(
      eq(statuteSourceSnapshots.jurisdiction, jurisdiction),
      eq(statuteSourceSnapshots.status, "pending_review"),
      eq(statuteSourceSnapshots.requiresReview, true),
    ))
    .orderBy(desc(statuteSourceSnapshots.manifestImportedAt));

  const predecessorIds = rows
    .map((row) => row.supersedesSnapshotId)
    .filter((id): id is string => Boolean(id));
  const predecessors = predecessorIds.length === 0
    ? []
    : await db.select({
      id: statuteSourceSnapshots.id,
      contentHash: statuteSourceSnapshots.contentHash,
      hashBasis: statuteSourceSnapshots.hashBasis,
      citation: statuteSourceSnapshots.citation,
      section: statuteSourceSnapshots.section,
      officialTitle: statuteSourceSnapshots.officialTitle,
      sourceUrl: statuteSourceSnapshots.sourceUrl,
      retrievedAt: statuteSourceSnapshots.retrievedAt,
      manifestImportedAt: statuteSourceSnapshots.manifestImportedAt,
      effectiveDateStart: statuteSourceSnapshots.effectiveDateStart,
      effectiveDateEnd: statuteSourceSnapshots.effectiveDateEnd,
      status: statuteSourceSnapshots.status,
    }).from(statuteSourceSnapshots).where(and(
      eq(statuteSourceSnapshots.jurisdiction, jurisdiction),
      inArray(statuteSourceSnapshots.id, predecessorIds),
    ));
  const predecessorById = new Map(predecessors.map((predecessor) => [predecessor.id, predecessor]));

  return rows.map((row) => ({
    ...row,
    predecessor: row.supersedesSnapshotId
      ? (() => {
        const predecessor = predecessorById.get(row.supersedesSnapshotId);
        return predecessor
          ? { ...predecessor, status: predecessor.status as "current" | "superseded" }
          : null;
      })()
      : null,
  }));
}

export async function getAuthoritySourceReviewDecisions(
  jurisdiction: string,
) {
  return db.select({
    id: statuteSourceReviewDecisions.id,
    snapshotId: statuteSourceReviewDecisions.snapshotId,
    jurisdiction: statuteSourceReviewDecisions.jurisdiction,
    decision: statuteSourceReviewDecisions.decision,
    reviewer: statuteSourceReviewDecisions.reviewer,
    note: statuteSourceReviewDecisions.note,
    snapshotHash: statuteSourceReviewDecisions.snapshotHash,
    previousSnapshotId: statuteSourceReviewDecisions.previousSnapshotId,
    decidedAt: statuteSourceReviewDecisions.decidedAt,
  }).from(statuteSourceReviewDecisions)
    .where(eq(statuteSourceReviewDecisions.jurisdiction, jurisdiction))
    .orderBy(desc(statuteSourceReviewDecisions.decidedAt));
}

/**
 * Promote or reject one exact pending snapshot. Every state transition,
 * affected-link update, queue completion, and audit record is committed in a
 * single transaction so a reviewer can never publish a partially restored
 * charge.
 */
export async function reviewAuthoritySourceSnapshot(
  input: AuthoritySourceReviewInput,
): Promise<AuthoritySourceReviewResult> {
  if (!input.snapshotId || input.snapshotId.length > 200) {
    throw new AuthoritySourceReviewError("Invalid snapshotId", 400);
  }
  if (!input.jurisdiction || input.jurisdiction.length > 10) {
    throw new AuthoritySourceReviewError("Invalid jurisdiction", 400);
  }
  if (input.decision !== "approve" && input.decision !== "reject") {
    throw new AuthoritySourceReviewError("Decision must be approve or reject", 400);
  }
  if (!input.reviewer.trim() || input.reviewer.length > 200) {
    throw new AuthoritySourceReviewError("Reviewer is required", 400);
  }
  if ((input.note ?? "").length > 10000) {
    throw new AuthoritySourceReviewError("Review note is too long", 400);
  }

  return db.transaction(async (tx) => {
    // Serialize decisions within a jurisdiction. Pending snapshots can be
    // created by successive imports before either is reviewed; locking before
    // the read ensures only one can replace a given current predecessor.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(
      hashtextextended(${input.jurisdiction}, 0)
    )`);

    const [pending] = await tx.select({
      id: statuteSourceSnapshots.id,
      sourceKey: statuteSources.sourceKey,
      jurisdiction: statuteSourceSnapshots.jurisdiction,
      publisher: statuteSources.publisher,
      citation: statuteSourceSnapshots.citation,
      section: statuteSourceSnapshots.section,
      officialTitle: statuteSourceSnapshots.officialTitle,
      sourceUrl: statuteSourceSnapshots.sourceUrl,
      contentHash: statuteSourceSnapshots.contentHash,
      hashBasis: statuteSourceSnapshots.hashBasis,
      retrievedAt: statuteSourceSnapshots.retrievedAt,
      manifestImportedAt: statuteSourceSnapshots.manifestImportedAt,
      effectiveDateStart: statuteSourceSnapshots.effectiveDateStart,
      effectiveDateEnd: statuteSourceSnapshots.effectiveDateEnd,
      status: statuteSourceSnapshots.status,
      requiresReview: statuteSourceSnapshots.requiresReview,
      supersedesSnapshotId: statuteSourceSnapshots.supersedesSnapshotId,
      metadata: statuteSourceSnapshots.metadata,
    }).from(statuteSourceSnapshots)
      .innerJoin(statuteSources, eq(statuteSourceSnapshots.sourceId, statuteSources.id))
      .where(and(
        eq(statuteSourceSnapshots.id, input.snapshotId),
        eq(statuteSourceSnapshots.jurisdiction, input.jurisdiction),
      )).limit(1);

    if (!pending) {
      throw new AuthoritySourceReviewError("Pending snapshot not found", 404);
    }
    if (pending.status !== "pending_review" || !pending.requiresReview) {
      throw new AuthoritySourceReviewError(
        "Snapshot has already been reviewed or is not pending review",
        409,
      );
    }

    const previous = pending.supersedesSnapshotId
      ? (await tx.select({
        id: statuteSourceSnapshots.id,
        status: statuteSourceSnapshots.status,
      }).from(statuteSourceSnapshots).where(
        eq(statuteSourceSnapshots.id, pending.supersedesSnapshotId),
      ).limit(1))[0]
      : undefined;
    if (input.decision === "approve" &&
        (!previous || previous.status !== "current")) {
      throw new AuthoritySourceReviewError(
        "Pending snapshot does not have a current predecessor to replace",
        409,
      );
    }

    const predecessorLinks = previous
      ? await tx.select({
        id: statuteChargeLinks.id,
        chargeId: statuteChargeLinks.chargeId,
        supportRole: statuteChargeLinks.supportRole,
        citation: statuteChargeLinks.citation,
        subdivision: statuteChargeLinks.subdivision,
        isCurrent: statuteChargeLinks.isCurrent,
      }).from(statuteChargeLinks).where(
        eq(statuteChargeLinks.snapshotId, previous.id),
      )
      : [];
    const storedRestorableLinks = (
      pending.metadata as { authorityReview?: { restorableLinks?: unknown } } | null
    )?.authorityReview?.restorableLinks;
    const previousLinks = Array.isArray(storedRestorableLinks)
      ? storedRestorableLinks.filter((link): link is {
        chargeId: string;
        supportRole: string;
        citation: string;
        subdivision: string | null;
      } => Boolean(link && typeof link === "object" &&
        typeof (link as { chargeId?: unknown }).chargeId === "string" &&
        typeof (link as { supportRole?: unknown }).supportRole === "string" &&
        typeof (link as { citation?: unknown }).citation === "string" &&
        ((link as { subdivision?: unknown }).subdivision === null ||
          typeof (link as { subdivision?: unknown }).subdivision === "string")))
      : predecessorLinks.filter((link) => link.isCurrent).map((link) => ({
        chargeId: link.chargeId,
        supportRole: link.supportRole,
        citation: link.citation,
        subdivision: link.subdivision,
      }));
    const restorablePredecessorIds = predecessorLinks
      .filter((link) => previousLinks.some((candidate) =>
        candidate.chargeId === link.chargeId &&
        candidate.supportRole === link.supportRole &&
        candidate.citation === link.citation &&
        candidate.subdivision === link.subdivision,
      ))
      .map((link) => link.id);

    if (input.decision === "approve" && previous) {
      const [retiredPrevious] = await tx.update(statuteSourceSnapshots).set({
        status: "superseded",
        requiresReview: false,
      }).where(and(
        eq(statuteSourceSnapshots.id, previous.id),
        eq(statuteSourceSnapshots.status, "current"),
      )).returning({ id: statuteSourceSnapshots.id });
      if (!retiredPrevious) {
        throw new AuthoritySourceReviewError(
          "The current predecessor changed before this review completed",
          409,
        );
      }
    }

    // Conditional update makes duplicate/concurrent reviewer submissions
    // fail closed rather than applying links twice.
    const [reviewedSnapshot] = await tx.update(statuteSourceSnapshots).set({
      status: input.decision === "approve" ? "current" : "superseded",
      requiresReview: false,
    }).where(and(
      eq(statuteSourceSnapshots.id, pending.id),
      eq(statuteSourceSnapshots.status, "pending_review"),
      eq(statuteSourceSnapshots.requiresReview, true),
    )).returning({
      id: statuteSourceSnapshots.id,
      status: statuteSourceSnapshots.status,
      requiresReview: statuteSourceSnapshots.requiresReview,
    });
    if (!reviewedSnapshot) {
      throw new AuthoritySourceReviewError(
        "Snapshot was reviewed by another reviewer",
        409,
      );
    }

    let restoredLinkCount = 0;
    if (previous) {
      if (input.decision === "approve") {
        if (restorablePredecessorIds.length > 0) {
          await tx.update(statuteChargeLinks).set({ isCurrent: false }).where(
            inArray(statuteChargeLinks.id, restorablePredecessorIds),
          );
        }
      }

      if (input.decision === "approve") {
        // The predecessor's links are the authoritative set of affected
        // charge/support-role relationships. No unrelated jurisdiction links
        // are touched.
        for (const link of previousLinks) {
          const inserted = await tx.insert(statuteChargeLinks).values({
            chargeId: link.chargeId,
            snapshotId: pending.id,
            supportRole: link.supportRole,
            citation: link.citation,
            subdivision: link.subdivision,
            isCurrent: true,
          }).onConflictDoUpdate({
            target: [
              statuteChargeLinks.chargeId,
              statuteChargeLinks.snapshotId,
              statuteChargeLinks.supportRole,
            ],
            set: {
              citation: link.citation,
              subdivision: link.subdivision,
              isCurrent: true,
            },
          });
          if ((inserted.rowCount ?? 0) > 0) {
            restoredLinkCount++;
          }
        }
      }
      if (input.decision === "reject") {
        if (restorablePredecessorIds.length > 0) {
          await tx.update(statuteChargeLinks).set({ isCurrent: true }).where(
            inArray(statuteChargeLinks.id, restorablePredecessorIds),
          );
        }
        restoredLinkCount = previousLinks.length;
      }
    }

    await tx.update(statuteUpdateQueue).set({
      status: "completed",
      completedAt: new Date(),
      errorMessage: input.decision === "reject"
        ? input.note || "Pending source snapshot rejected; prior current snapshot retained."
        : null,
    }).where(and(
      eq(statuteUpdateQueue.jurisdiction, input.jurisdiction),
      eq(statuteUpdateQueue.citation, pending.citation),
      eq(statuteUpdateQueue.snapshotId, pending.id),
      eq(statuteUpdateQueue.status, "pending"),
    ));

    const [audit] = await tx.insert(statuteSourceReviewDecisions).values({
      snapshotId: pending.id,
      jurisdiction: pending.jurisdiction,
      decision: input.decision,
      reviewer: input.reviewer.trim(),
      note: input.note ?? "",
      snapshotHash: pending.contentHash,
      previousSnapshotId: pending.supersedesSnapshotId,
    }).returning({
      id: statuteSourceReviewDecisions.id,
    });
    if (!audit) throw new Error("Unable to record source review decision");

    return {
      decision: input.decision,
      snapshot: {
        id: pending.id,
        sourceKey: pending.sourceKey,
        jurisdiction: pending.jurisdiction,
        publisher: pending.publisher,
        citation: pending.citation,
        section: pending.section,
        officialTitle: pending.officialTitle,
        sourceUrl: pending.sourceUrl,
        contentHash: pending.contentHash,
        hashBasis: pending.hashBasis,
        retrievedAt: pending.retrievedAt,
        manifestImportedAt: pending.manifestImportedAt,
        effectiveDateStart: pending.effectiveDateStart,
        effectiveDateEnd: pending.effectiveDateEnd,
        supersedesSnapshotId: pending.supersedesSnapshotId,
        metadata: pending.metadata,
        predecessor: null,
        status: reviewedSnapshot.status as "current" | "superseded",
        requiresReview: reviewedSnapshot.requiresReview,
      },
      affectedChargeIds: [...new Set(previousLinks.map((link) => link.chargeId))],
      restoredLinkCount,
      auditId: audit.id,
    };
  });
}

export async function getAuthorityChargeProvenance(
  jurisdiction: string,
  chargeId: string,
): Promise<{
  chargeId: string;
  officialTitle: string;
  citation: string;
  sources: Array<Record<string, unknown>>;
} | null> {
  if (!(await getCurrentAuthoritySelectableChargeIds(jurisdiction)).has(chargeId)) return null;
  const rows = await db.select({
    chargeId: statuteChargeLinks.chargeId,
    officialTitle: statuteSourceSnapshots.officialTitle,
    citation: statuteSourceSnapshots.citation,
    section: statuteSourceSnapshots.section,
    sourceUrl: statuteSourceSnapshots.sourceUrl,
    publisher: statuteSources.publisher,
    sourceType: statuteSources.sourceType,
    retrievedAt: statuteSourceSnapshots.retrievedAt,
    manifestImportedAt: statuteSourceSnapshots.manifestImportedAt,
    effectiveDateStart: statuteSourceSnapshots.effectiveDateStart,
    effectiveDateEnd: statuteSourceSnapshots.effectiveDateEnd,
    contentAvailable: sql<boolean>`${statuteSourceSnapshots.content} is not null`,
    contentHash: statuteSourceSnapshots.contentHash,
    hashBasis: statuteSourceSnapshots.hashBasis,
    status: statuteSourceSnapshots.status,
    supportRole: statuteChargeLinks.supportRole,
    subdivision: statuteChargeLinks.subdivision,
  }).from(statuteChargeLinks)
    .innerJoin(statuteSourceSnapshots, eq(statuteChargeLinks.snapshotId, statuteSourceSnapshots.id))
    .innerJoin(statuteSources, eq(statuteSourceSnapshots.sourceId, statuteSources.id))
    .where(and(
      eq(statuteChargeLinks.chargeId, chargeId),
      eq(statuteChargeLinks.isCurrent, true),
      eq(statuteSourceSnapshots.jurisdiction, jurisdiction),
      eq(statuteSourceSnapshots.status, "current"),
    ));
  if (rows.length === 0) return null;
  return {
    chargeId,
    officialTitle: rows[0].officialTitle,
    citation: rows[0].citation,
    sources: rows,
  };
}