import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildCaliforniaSourceDatabaseSeed } from "../server/data/california-source-database-seed";
import { PgDialect } from "drizzle-orm/pg-core";

const mocks = vi.hoisted(() => ({
  write: vi.fn(), check: vi.fn(), failureWriteThrows: false,
  saved: [] as any[], fresh: true,
  database: {} as any, failureCondition: undefined as any, failureNoRows: false,
}));
vi.mock("../server/db", () => ({ db: {} }));
vi.mock("../server/services/california-import-session", () => ({
  withCaliforniaImportSession: (work: any) => work(mocks.database, mocks.check),
}));
vi.mock("../server/services/california-import-batches", () => ({
  writeCaliforniaImportBatches: (...args: any[]) => mocks.write(...args),
}));
vi.mock("../shared/california-freshness", () => ({
  isCaliforniaEvidenceFresh: () => mocks.fresh,
  getCaliforniaEvidenceSummary: vi.fn(),
}));
import { seedCaliforniaSourceDatabase } from "../server/services/california-source-database";
const seed = buildCaliforniaSourceDatabaseSeed(new Date("2026-11-02T00:00:00Z"));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.fresh = true;
  mocks.saved = [];
  mocks.failureWriteThrows = false;
  mocks.failureNoRows = false;
  mocks.write.mockReset().mockResolvedValue({
    snapshotInserted: 5733, snapshotReused: 0, changeCount: 0, linkCount: 5733,
  });
  mocks.check.mockReset();
  mocks.database = {
    insert: () => ({ values: async (row: any) => { mocks.saved.push(row); } }),
    transaction: async (work: any) => {
      const staged: any[] = [];
      const tx = { update: () => ({ set: (row: any) => ({ where: async () => { staged.push(row); } }) }) };
      await work(tx);
      mocks.saved.push(...staged);
    },
    update: () => ({ set: (row: any) => ({ where: (condition: any) => ({
      returning: async () => {
        mocks.failureCondition = condition;
        if (mocks.failureWriteThrows) throw new Error("connection unavailable");
        if (mocks.failureNoRows) return [];
        mocks.saved.push(row);
        return [{ id: "test-run" }];
      },
    }) }) }),
  };
});

describe("California import completion and rollback reporting", () => {
  it("marks completion in the data transaction, not before the batch writes", async () => {
    mocks.write.mockImplementationOnce(async () => {
      expect(mocks.saved.map(row => row.status)).toEqual(["in_progress"]);
      return { snapshotInserted: 5733, snapshotReused: 0, changeCount: 0, linkCount: 5733 };
    });
    const result = await seedCaliforniaSourceDatabase(seed);
    expect(result.success).toBe(true);
    expect(mocks.saved.map(row => row.status)).toEqual(["in_progress", "completed"]);
    expect(mocks.saved[1]).toMatchObject({ snapshotCount: 5733, linkCount: 5733 });
  });
  it("reports zero committed counts on a write failure and records failure outside rollback", async () => {
    mocks.write.mockRejectedValueOnce(new Error("batch failed"));
    const result = await seedCaliforniaSourceDatabase(seed);
    expect(result).toMatchObject({ success: false, snapshotInserted: 0, linkCount: 0, errorCount: 1 });
    expect(mocks.saved.map(row => row.status)).toEqual(["in_progress", "failed"]);
    const condition = new PgDialect().sqlToQuery(mocks.failureCondition);
    expect(condition.sql).toContain('"statute_ingestion_runs"."status"');
    expect(condition.params).toContain("in_progress");
  });
  it("rolls back completion too if the deadline is crossed just before commit", async () => {
    mocks.check.mockImplementationOnce(() => {}).mockImplementationOnce(() => {})
      .mockImplementationOnce(() => { throw new Error("deadline"); });
    const result = await seedCaliforniaSourceDatabase(seed);
    expect(result).toMatchObject({ success: false, snapshotInserted: 0, linkCount: 0 });
    expect(mocks.saved.map(row => row.status)).toEqual(["in_progress", "failed"]);
  });
  it("does not commit when evidence expires while writing", async () => {
    mocks.write.mockImplementationOnce(async () => {
      mocks.fresh = false;
      return { snapshotInserted: 5733, snapshotReused: 0, changeCount: 0, linkCount: 5733 };
    });
    const result = await seedCaliforniaSourceDatabase(seed);
    expect(result.success).toBe(false);
    expect(mocks.saved.map(row => row.status)).toEqual(["in_progress", "failed"]);
  });
  it("explicitly reports an unsaved failure marker instead of claiming a clean failure", async () => {
    mocks.write.mockRejectedValueOnce(new Error("write failed"));
    mocks.failureWriteThrows = true;
    const result = await seedCaliforniaSourceDatabase(seed);
    expect(result.success).toBe(false);
    expect(result.message).toContain("Failure status could not be saved");
    expect(mocks.saved.map(row => row.status)).toEqual(["in_progress"]);
  });
  it("does not claim a recorded failure when the completion state is uncertain", async () => {
    mocks.write.mockRejectedValueOnce(new Error("commit acknowledgement lost"));
    mocks.failureNoRows = true;
    const result = await seedCaliforniaSourceDatabase(seed);
    expect(result.success).toBe(false);
    expect(result.message).toContain("do not retry without primary verification");
    expect(mocks.saved.map(row => row.status)).toEqual(["in_progress"]);
  });
});
