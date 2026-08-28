import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "../db";
import {
  statuteChargeLinks,
  statuteIngestionRuns,
  statuteSourceSnapshots,
  statuteSources,
  statuteUpdateQueue,
} from "@shared/schema";
import {
  buildNewYorkSourceDatabaseSeed,
  type NewYorkAuthorityManifest,
  type NewYorkSourceDatabaseSeed,
} from "../data/new-york-source-database-seed";
import { errLog, opsLog } from "../utils/dev-logger";

export interface NewYorkSourceDatabaseResult {
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

export interface NewYorkSourceDatabaseStatus {
  sourceCount: number;
  snapshotCount: number;
  currentSnapshotCount: number;
  pendingReviewCount: number;
  linkedChargeCount: number;
  selectableChargeCount: number;
  catalogRecordCount: number;
  lastRun: {
    id: string;
    status: string;
    startedAt: Date;
    completedAt: Date | null;
    changeCount: number;
    errorCount: number;
  } | null;
}

export interface NewYorkChargeProvenance {
  chargeId: string;
  officialTitle: string;
  citation: string;
  sources: Array<{
    citation: string;
    section: string;
    sourceUrl: string;
    publisher: string;
    sourceType: string;
    retrievedAt: Date | null;
    manifestImportedAt: Date;
    effectiveDateStart: string | null;
    effectiveDateEnd: string | null;
    contentAvailable: boolean;
    contentHash: string;
    hashBasis: string;
    status: string;
    supportRole: string;
    subdivision: string | null;
  }>;
}

export async function getCurrentNewYorkSelectableChargeIds(): Promise<Set<string>> {
  const [latestRun] = await db
    .select({ metadata: statuteIngestionRuns.metadata })
    .from(statuteIngestionRuns)
    .where(and(
      eq(statuteIngestionRuns.jurisdiction, "NY"),
      eq(statuteIngestionRuns.status, "completed"),
    ))
    .orderBy(desc(statuteIngestionRuns.startedAt))
    .limit(1);
  if (!latestRun) return new Set();
  const metadata = latestRun.metadata as { selectableChargeIds?: unknown } | null;
  const manifestSelectableIds = new Set(
    Array.isArray(metadata?.selectableChargeIds)
      ? metadata.selectableChargeIds.filter((value): value is string => typeof value === "string")
      : [],
  );
  if (manifestSelectableIds.size === 0) return manifestSelectableIds;
  const catalogRecords = Array.isArray((metadata as { catalogRecords?: unknown } | null)?.catalogRecords)
    ? (metadata as {
        catalogRecords: Array<{
          chargeId?: unknown;
          disposition?: unknown;
          provisions?: unknown;
        }>;
      }).catalogRecords
    : [];
  const expectedLinks = new Map<string, Set<string>>();
  for (const record of catalogRecords) {
    if (
      typeof record.chargeId !== "string" ||
      !manifestSelectableIds.has(record.chargeId) ||
      !Array.isArray(record.provisions)
    ) continue;
    const required = new Set<string>();
    for (const provision of record.provisions as Array<{
      sourceKey?: unknown;
      supportRole?: unknown;
      citation?: unknown;
      subdivision?: unknown;
    }>) {
      if (
        typeof provision.sourceKey === "string" &&
        typeof provision.supportRole === "string" &&
        typeof provision.citation === "string"
      ) {
        required.add([
          provision.sourceKey,
          provision.supportRole,
          provision.citation,
          typeof provision.subdivision === "string" ? provision.subdivision : "",
        ].join("|"));
      }
    }
    expectedLinks.set(record.chargeId, required);
  }

  // A completed manifest is necessary but not sufficient: every published
  // charge must still have every manifest-required current link. This prevents a
  // metadata-only snapshot transition to pending_review from remaining
  // selectable while its provenance endpoint correctly returns no current
  // source.
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
      eq(statuteSourceSnapshots.jurisdiction, "NY"),
      eq(statuteSourceSnapshots.status, "current"),
    ));
  const currentByCharge = new Map<string, Set<string>>();
  for (const link of currentLinks) {
    const keys = currentByCharge.get(link.chargeId) ?? new Set<string>();
    keys.add([
      link.sourceKey,
      link.supportRole,
      link.citation,
      link.subdivision ?? "",
    ].join("|"));
    currentByCharge.set(link.chargeId, keys);
  }
  return new Set([...manifestSelectableIds].filter((id) => {
    const required = expectedLinks.get(id);
    const current = currentByCharge.get(id);
    return Boolean(required && required.size > 0 && current &&
      [...required].every((key) => current.has(key)));
  }));
}

export async function seedNewYorkSourceDatabase(
  manifest: NewYorkAuthorityManifest,
): Promise<NewYorkSourceDatabaseResult> {
  const seed = buildNewYorkSourceDatabaseSeed(manifest);
  const runId = randomUUID();
  let snapshotInserted = 0;
  let snapshotReused = 0;
  let changeCount = 0;
  let linkCount = 0;

  await db.insert(statuteIngestionRuns).values({
    id: runId,
    jurisdiction: "NY",
    operation: "seed",
    status: "in_progress",
    sourceCount: seed.sources.length,
    metadata: {
      sourcePolicy: "official_ny_senate_api",
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
        const [row] = await tx
          .insert(statuteSources)
          .values({
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
          })
          .onConflictDoUpdate({
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
          })
          .returning({ id: statuteSources.id });
        if (!row) throw new Error(`Unable to upsert NY source ${source.sourceKey}`);
        sourceIds.set(source.sourceKey, row.id);
      }

      const activeSnapshotIds = new Map<string, string>();
      const pendingSnapshotKeys = new Set<string>();
      for (const snapshot of seed.snapshots) {
        const sourceId = sourceIds.get(snapshot.sourceKey);
        if (!sourceId) throw new Error(`Missing NY source ${snapshot.sourceKey}`);

        const duplicate = await tx
          .select({
            id: statuteSourceSnapshots.id,
            status: statuteSourceSnapshots.status,
            metadata: statuteSourceSnapshots.metadata,
          })
          .from(statuteSourceSnapshots)
          .where(and(
            eq(statuteSourceSnapshots.sourceId, sourceId),
            eq(statuteSourceSnapshots.citation, snapshot.citation),
            eq(statuteSourceSnapshots.officialTitle, snapshot.officialTitle),
            eq(statuteSourceSnapshots.contentHash, snapshot.contentHash),
          ))
          .limit(1);
        const current = await tx
          .select({
            id: statuteSourceSnapshots.id,
            contentHash: statuteSourceSnapshots.contentHash,
            metadata: statuteSourceSnapshots.metadata,
          })
          .from(statuteSourceSnapshots)
          .where(and(
            eq(statuteSourceSnapshots.sourceId, sourceId),
            eq(statuteSourceSnapshots.status, "current"),
          ))
          .limit(1);

        let activeSnapshotId: string | undefined;
        const duplicateFingerprint = (duplicate[0]?.metadata as { fingerprint?: string } | null)?.fingerprint;
        const currentFingerprint = (current[0]?.metadata as { fingerprint?: string } | null)?.fingerprint;
        if (duplicate[0] && duplicateFingerprint === snapshot.metadata.fingerprint) {
          snapshotReused++;
          activeSnapshotId = duplicate[0].status === "current"
            ? duplicate[0].id
            : current[0]?.id ?? duplicate[0].id;
          if (duplicate[0].status !== "current") {
            pendingSnapshotKeys.add(
              `${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}`,
            );
          }
        } else if (duplicate[0] && !duplicateFingerprint) {
          // One-time metadata migration for snapshots created before the
          // complete fingerprint was introduced. The content/title identity
          // is unchanged, so enrich that row instead of violating the
          // existing content-hash uniqueness constraint.
          await tx.update(statuteSourceSnapshots)
            .set({
              sourceUrl: snapshot.sourceUrl,
              retrievedAt: snapshot.retrievedAt,
              manifestImportedAt: snapshot.manifestImportedAt,
              effectiveDateStart: snapshot.effectiveDateStart,
              effectiveDateEnd: snapshot.effectiveDateEnd,
              metadata: snapshot.metadata,
            })
            .where(eq(statuteSourceSnapshots.id, duplicate[0].id));
          snapshotReused++;
          activeSnapshotId = duplicate[0].status === "current"
            ? duplicate[0].id
            : current[0]?.id ?? duplicate[0].id;
          if (duplicate[0].status !== "current") {
            pendingSnapshotKeys.add(
              `${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}`,
            );
          }
        } else if (duplicate[0] && duplicate[0].status === "current") {
          // The legacy uniqueness key cannot distinguish a URL/currentness
          // change when title and source text are unchanged. Mark that
          // existing row pending in place so the source fails closed without
          // creating a duplicate that PostgreSQL would reject.
          await tx.update(statuteSourceSnapshots)
            .set({
              sourceUrl: snapshot.sourceUrl,
              retrievedAt: snapshot.retrievedAt,
              manifestImportedAt: snapshot.manifestImportedAt,
              effectiveDateStart: snapshot.effectiveDateStart,
              effectiveDateEnd: snapshot.effectiveDateEnd,
              status: "pending_review",
              requiresReview: true,
              metadata: snapshot.metadata,
            })
            .where(eq(statuteSourceSnapshots.id, duplicate[0].id));
          snapshotInserted++;
          changeCount++;
          const existingQueue = await tx
            .select({ id: statuteUpdateQueue.id })
            .from(statuteUpdateQueue)
            .where(and(
              eq(statuteUpdateQueue.jurisdiction, "NY"),
              eq(statuteUpdateQueue.citation, snapshot.citation),
              eq(statuteUpdateQueue.status, "pending"),
            ))
            .limit(1);
          if (!existingQueue[0]) {
            await tx.insert(statuteUpdateQueue).values({
              jurisdiction: "NY",
              citation: snapshot.citation,
              reason: "source_change",
              triggeredBy: runId,
              priority: "high",
              status: "pending",
              errorMessage: "Official NY source metadata changed; attorney review is required before promotion.",
            });
          }
          activeSnapshotId = duplicate[0].id;
          pendingSnapshotKeys.add(
            `${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}`,
          );
        } else if (duplicate[0]) {
          await tx.update(statuteSourceSnapshots)
            .set({
              sourceUrl: snapshot.sourceUrl,
              retrievedAt: snapshot.retrievedAt,
              manifestImportedAt: snapshot.manifestImportedAt,
              effectiveDateStart: snapshot.effectiveDateStart,
              effectiveDateEnd: snapshot.effectiveDateEnd,
              metadata: snapshot.metadata,
            })
            .where(eq(statuteSourceSnapshots.id, duplicate[0].id));
          snapshotReused++;
          activeSnapshotId = current[0]?.id ?? duplicate[0].id;
          if (current[0]) {
            pendingSnapshotKeys.add(
              `${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}`,
            );
          }
        } else if (current[0] && currentFingerprint !== snapshot.metadata.fingerprint) {
          const [pending] = await tx
            .insert(statuteSourceSnapshots)
            .values({
              sourceId,
              jurisdiction: "NY",
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
              supersedesSnapshotId: current[0].id,
              metadata: snapshot.metadata,
            })
            .returning({ id: statuteSourceSnapshots.id });
          if (!pending) throw new Error(`Unable to record changed NY snapshot ${snapshot.citation}`);
          snapshotInserted++;
          changeCount++;
          const existingQueue = await tx
            .select({ id: statuteUpdateQueue.id })
            .from(statuteUpdateQueue)
            .where(and(
              eq(statuteUpdateQueue.jurisdiction, "NY"),
              eq(statuteUpdateQueue.citation, snapshot.citation),
              eq(statuteUpdateQueue.status, "pending"),
            ))
            .limit(1);
          if (!existingQueue[0]) {
            await tx.insert(statuteUpdateQueue).values({
              jurisdiction: "NY",
              citation: snapshot.citation,
              reason: "source_change",
              triggeredBy: runId,
              priority: "high",
              status: "pending",
              errorMessage: "Official NY source content changed; attorney review is required before promotion.",
            });
          }
          activeSnapshotId = current[0].id;
          pendingSnapshotKeys.add(
            `${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}`,
          );
        } else {
          const [inserted] = await tx
            .insert(statuteSourceSnapshots)
            .values({
              sourceId,
              jurisdiction: "NY",
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
            })
            .returning({ id: statuteSourceSnapshots.id });
          if (!inserted) throw new Error(`Unable to insert NY snapshot ${snapshot.citation}`);
          snapshotInserted++;
          activeSnapshotId = inserted.id;
        }
        if (!activeSnapshotId) {
          throw new Error(`No active NY snapshot for ${snapshot.citation}`);
        }
        activeSnapshotIds.set(`${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}`, activeSnapshotId);
      }

      for (const link of seed.links) {
        const snapshot = seed.snapshots.find((candidate) =>
          candidate.sourceKey === link.snapshotKey &&
          candidate.citation === link.citation &&
          candidate.metadata.chargeId === link.chargeId,
        ) ?? seed.snapshots.find((candidate) =>
          candidate.sourceKey === link.snapshotKey && candidate.citation === link.citation,
        );
        if (!snapshot) throw new Error(`Missing NY snapshot for ${link.chargeId}`);
        const snapshotId = activeSnapshotIds.get(
          `${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}`,
        );
        if (!snapshotId) throw new Error(`Missing active NY snapshot for ${link.chargeId}`);
        if (pendingSnapshotKeys.has(
          `${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}`,
        )) {
          // Keep the previously published current link untouched while the
          // new source version waits for attorney review. This is especially
          // important when only citation/subdivision metadata changed.
          continue;
        }
        const inserted = await tx
          .insert(statuteChargeLinks)
          .values({
            chargeId: link.chargeId,
            snapshotId,
            supportRole: link.supportRole,
            citation: link.citation,
            subdivision: link.subdivision,
            isCurrent: true,
          })
          .onConflictDoUpdate({
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

      const desiredLinks = new Set(
        seed.links.flatMap((link) => {
          const snapshot = seed.snapshots.find((candidate) =>
            candidate.sourceKey === link.snapshotKey &&
            candidate.citation === link.citation &&
            candidate.metadata.chargeId === link.chargeId,
          ) ?? seed.snapshots.find((candidate) =>
            candidate.sourceKey === link.snapshotKey && candidate.citation === link.citation,
          );
          if (!snapshot || pendingSnapshotKeys.has(
            `${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}`,
          )) return [];
          return [
            `${link.chargeId}|${link.snapshotKey}|${link.supportRole}|${link.citation}|${link.subdivision ?? ""}`,
          ];
        }),
      );
      const manifestChargeIds = [...new Set(seed.catalogRecords.map((record) => record.chargeId))];
      if (manifestChargeIds.length > 0) {
        const existingLinks = await tx
          .select({
            id: statuteChargeLinks.id,
            chargeId: statuteChargeLinks.chargeId,
            supportRole: statuteChargeLinks.supportRole,
            sourceKey: statuteSources.sourceKey,
            citation: statuteChargeLinks.citation,
            subdivision: statuteChargeLinks.subdivision,
          })
          .from(statuteChargeLinks)
          .innerJoin(statuteSourceSnapshots, eq(statuteChargeLinks.snapshotId, statuteSourceSnapshots.id))
          .innerJoin(statuteSources, eq(statuteSourceSnapshots.sourceId, statuteSources.id))
          .where(and(
            eq(statuteChargeLinks.isCurrent, true),
            eq(statuteSourceSnapshots.jurisdiction, "NY"),
            inArray(statuteChargeLinks.chargeId, manifestChargeIds),
          ));
        const staleLinkIds = existingLinks
          .filter((link) => !desiredLinks.has(
            `${link.chargeId}|${link.sourceKey}|${link.supportRole}|${link.citation}|${link.subdivision ?? ""}`,
          ))
          .map((link) => link.id);
        if (staleLinkIds.length > 0) {
          await tx.update(statuteChargeLinks)
            .set({ isCurrent: false })
            .where(inArray(statuteChargeLinks.id, staleLinkIds));
        }
      }

      const withheldIds = seed.catalogRecords
        .filter((record) => record.disposition !== "retain" && record.disposition !== "exact_alias_rename")
        .map((record) => record.chargeId);
      if (withheldIds.length > 0) {
        await tx.update(statuteChargeLinks)
          .set({ isCurrent: false })
          .where(inArray(statuteChargeLinks.chargeId, withheldIds));
      }

      await tx.update(statuteIngestionRuns)
        .set({
          status: "completed",
          snapshotCount: snapshotInserted,
          linkCount,
          changeCount,
          completedAt: new Date(),
        })
        .where(eq(statuteIngestionRuns.id, runId));
    });

    const message = `New York source database seeded: ${seed.sources.length} sources, ${snapshotInserted} snapshots, ${linkCount} links, ${seed.selectableChargeIds.length} selectable charges, ${changeCount} changes queued for review.`;
    opsLog("new-york-source-db", message);
    return {
      success: true,
      runId,
      sourceCount: seed.sources.length,
      snapshotInserted,
      snapshotReused,
      changeCount,
      linkCount,
      errorCount: 0,
      selectableChargeCount: seed.selectableChargeIds.length,
      catalogRecordCount: seed.catalogRecords.length,
      message,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown New York source database error";
    await db.update(statuteIngestionRuns)
      .set({ status: "failed", errorCount: 1, errorMessage: message, completedAt: new Date() })
      .where(eq(statuteIngestionRuns.id, runId));
    errLog("New York source database seed failed", error);
    return {
      success: false,
      runId,
      sourceCount: seed.sources.length,
      snapshotInserted,
      snapshotReused,
      changeCount,
      linkCount,
      errorCount: 1,
      selectableChargeCount: seed.selectableChargeIds.length,
      catalogRecordCount: seed.catalogRecords.length,
      message,
    };
  }
}

export async function getNewYorkSourceDatabaseStatus(): Promise<NewYorkSourceDatabaseStatus> {
  const [sourceCount, snapshotCount, currentSnapshotCount, pendingReviewCount, linkedChargeCount, lastRun] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(statuteSources).where(and(
        eq(statuteSources.jurisdiction, "NY"),
        eq(statuteSources.isActive, true),
      )),
      db.select({ count: sql<number>`count(*)` }).from(statuteSourceSnapshots).where(
        eq(statuteSourceSnapshots.jurisdiction, "NY"),
      ),
      db.select({ count: sql<number>`count(*)` }).from(statuteSourceSnapshots).where(and(
        eq(statuteSourceSnapshots.jurisdiction, "NY"),
        eq(statuteSourceSnapshots.status, "current"),
      )),
      db.select({ count: sql<number>`count(*)` }).from(statuteSourceSnapshots).where(and(
        eq(statuteSourceSnapshots.jurisdiction, "NY"),
        eq(statuteSourceSnapshots.requiresReview, true),
      )),
      db.select({ count: sql<number>`count(distinct ${statuteChargeLinks.chargeId})` })
        .from(statuteChargeLinks)
        .innerJoin(statuteSourceSnapshots, eq(statuteChargeLinks.snapshotId, statuteSourceSnapshots.id))
        .where(and(
          eq(statuteSourceSnapshots.jurisdiction, "NY"),
          eq(statuteChargeLinks.isCurrent, true),
        )),
      db.select({
        id: statuteIngestionRuns.id,
        status: statuteIngestionRuns.status,
        startedAt: statuteIngestionRuns.startedAt,
        completedAt: statuteIngestionRuns.completedAt,
        changeCount: statuteIngestionRuns.changeCount,
        errorCount: statuteIngestionRuns.errorCount,
        metadata: statuteIngestionRuns.metadata,
      }).from(statuteIngestionRuns)
        .where(eq(statuteIngestionRuns.jurisdiction, "NY"))
        .orderBy(desc(statuteIngestionRuns.startedAt))
        .limit(1),
    ]);
  const metadata = lastRun[0]?.metadata as { selectableChargeCount?: number; catalogRecordCount?: number } | null;
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

export async function getNewYorkChargeProvenance(
  chargeId: string,
): Promise<NewYorkChargeProvenance | null> {
  const selectableIds = await getCurrentNewYorkSelectableChargeIds();
  if (!selectableIds.has(chargeId)) return null;

  const rows = await db
    .select({
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
    })
    .from(statuteChargeLinks)
    .innerJoin(statuteSourceSnapshots, eq(statuteChargeLinks.snapshotId, statuteSourceSnapshots.id))
    .innerJoin(statuteSources, eq(statuteSourceSnapshots.sourceId, statuteSources.id))
    .where(and(
      eq(statuteChargeLinks.chargeId, chargeId),
      eq(statuteChargeLinks.isCurrent, true),
      eq(statuteSourceSnapshots.jurisdiction, "NY"),
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

export const newYorkSourceDatabase = {
  seed: seedNewYorkSourceDatabase,
  getStatus: getNewYorkSourceDatabaseStatus,
  getChargeProvenance: getNewYorkChargeProvenance,
};