import { describe, expect, it, vi } from "vitest";
import { buildCaliforniaSourceDatabaseSeed } from "../server/data/california-source-database-seed";
import {
  CALIFORNIA_IMPORT_BATCH_SIZE, californiaImportBatches,
  planCaliforniaSnapshots, writeCaliforniaImportBatches,
} from "../server/services/california-import-batches";
import { statuteSources, statuteSourceSnapshots, statuteChargeLinks } from "../shared/schema";

const seed = buildCaliforniaSourceDatabaseSeed(new Date("2026-11-02T00:00:00Z"));
const sourceIds = new Map(seed.sources.map(source => [source.sourceKey, `id:${source.sourceKey}`]));
function oldSnapshot(overrides: Partial<typeof statuteSourceSnapshots.$inferSelect> = {}) {
  const { sourceKey, ...snapshot } = seed.snapshots[0];
  return {
    ...snapshot, id: "old", sourceId: sourceIds.get(sourceKey)!, createdAt: new Date(0),
    ...overrides,
  };
}

describe("California batched import evidence decisions", () => {
  it("bounds batches without losing, duplicating or reordering inputs", () => {
    expect(californiaImportBatches([])).toEqual([]);
    const rows = Array.from({ length: 5733 }, (_, i) => i);
    const batches = californiaImportBatches(rows);
    expect(batches).toHaveLength(29);
    expect(batches.flat()).toEqual(rows);
    expect(batches.every(batch => batch.length <= CALIFORNIA_IMPORT_BATCH_SIZE)).toBe(true);
  });
  it("plans the full reference-only release without changing eligibility", () => {
    const plan = planCaliforniaSnapshots(seed, sourceIds, []);
    expect(plan.inserts).toHaveLength(5733);
    expect(plan.activeIds.size).toBe(5733);
    expect(plan.inserts.every(row => row.content === null && row.status === "current")).toBe(true);
    expect(plan.changes).toBe(0);
    expect(seed.selectableChargeIds).toHaveLength(703);
    expect(seed.catalogRecords).toHaveLength(703);
    expect(seed.audit.canonical).toMatchObject({
      recordCount: 724, selectableRecordCount: 703, withheldRecordCount: 21,
    });
  });
  it("reuses the exact current snapshot rather than rewriting it", () => {
    const plan = planCaliforniaSnapshots(seed, sourceIds, [oldSnapshot()]);
    expect(plan.reused).toBe(1);
    expect(plan.activeIds.get(seed.snapshots[0].sourceKey)).toBe("old");
    expect(plan.inserts).toHaveLength(5732);
  });
  it("holds a changed fingerprint and keeps links on the prior current snapshot", () => {
    const plan = planCaliforniaSnapshots(seed, sourceIds, [oldSnapshot({ contentHash: "prior-reviewed-hash" })]);
    expect(plan.changes).toBe(1);
    expect(plan.inserts[0]).toMatchObject({
      status: "pending_review", requiresReview: true, supersedesSnapshotId: "old",
    });
    expect(plan.activeIds.get(seed.snapshots[0].sourceKey)).toBe("old");
    expect(plan.changedCitations.has(seed.snapshots[0].citation)).toBe(true);
  });
  it("does not promote an already pending or rejected snapshot", () => {
    for (const status of ["pending_review", "rejected"]) {
      const plan = planCaliforniaSnapshots(seed, sourceIds, [
        oldSnapshot({ contentHash: "prior-reviewed-hash" }),
        oldSnapshot({ id: "held", status }),
      ]);
      expect(plan.activeIds.get(seed.snapshots[0].sourceKey)).toBe("old");
      expect(plan.inserts).toHaveLength(5732);
      expect(plan.changes).toBe(0);
      expect(() => planCaliforniaSnapshots(seed, sourceIds, [oldSnapshot({ status })]))
        .toThrow("No current California snapshot");
    }
  });
  it("fails closed for missing sources or ambiguous history", () => {
    expect(() => planCaliforniaSnapshots(seed, new Map(), [])).toThrow("Missing California source");
    expect(() => planCaliforniaSnapshots(seed, sourceIds, [oldSnapshot(), oldSnapshot({ id: "ambiguous" })]))
      .toThrow("Ambiguous");
  });
});

function mockTransaction() {
  const writes: Array<{ table: unknown; values: any[] }> = [];
  let reads = 0;
  const tx = {
    insert(table: unknown) {
      return {
        values(values: any[]) {
          writes.push({ table, values });
          const returning = async () => values.map((row, i) => table === statuteSources
            ? { id: `id:${row.sourceKey}`, sourceKey: row.sourceKey }
            : { id: `link:${i}` });
          return Object.assign(Promise.resolve({}), {
            onConflictDoUpdate: () => ({ returning }),
            onConflictDoNothing: () => ({ returning }),
          });
        },
      };
    },
    select: () => ({ from: () => ({ where: async () => { reads++; return []; } }) }),
  };
  return { tx: tx as unknown as Parameters<typeof writeCaliforniaImportBatches>[0], writes, reads: () => reads };
}

describe("California batch persistence", () => {
  it("uses 116 bounded data queries rather than per-record queries for this release", async () => {
    const mock = mockTransaction();
    const deadline = vi.fn();
    const result = await writeCaliforniaImportBatches(mock.tx, seed, "test-run", deadline);
    expect(result).toEqual({ snapshotInserted: 5733, snapshotReused: 0, changeCount: 0, linkCount: 5733 });
    expect(mock.writes.length + mock.reads()).toBe(116);
    expect(mock.writes.every(write => write.values.length <= 200)).toBe(true);
    const links = mock.writes.filter(write => write.table === statuteChargeLinks).flatMap(write => write.values);
    const snapshots = mock.writes.filter(write => write.table === statuteSourceSnapshots).flatMap(write => write.values);
    expect(links).toHaveLength(seed.links.length);
    expect(new Set(snapshots.map(row => row.id)).size).toBe(5733);
    const snapshotIds = new Set(snapshots.map(snapshot => snapshot.id));
    expect(links.every(link => snapshotIds.has(link.snapshotId))).toBe(true);
    expect(deadline).toHaveBeenCalledTimes(117);
  });
  it("stops before the next database operation when the execution budget expires", async () => {
    const mock = mockTransaction();
    const deadline = vi.fn().mockImplementationOnce(() => {}).mockImplementation(() => { throw new Error("budget"); });
    await expect(writeCaliforniaImportBatches(mock.tx, seed, "test-run", deadline)).rejects.toThrow("budget");
    expect(mock.writes).toHaveLength(1);
    expect(mock.reads()).toBe(0);
  });
});
