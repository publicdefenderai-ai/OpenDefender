import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  connect: vi.fn(), query: vi.fn(), end: vi.fn(), config: vi.fn(), database: {},
}));
vi.mock("pg", () => ({
  Client: class {
    constructor(config: unknown) { mocks.config(config); }
    connect = mocks.connect;
    query = mocks.query;
    end = mocks.end;
  },
}));
vi.mock("drizzle-orm/node-postgres", () => ({ drizzle: () => mocks.database }));
vi.mock("../server/db", () => ({
  pool: { options: { connectionString: "postgresql://example.invalid/test", ssl: { rejectUnauthorized: true } } },
}));
import { CALIFORNIA_IMPORT_LIMITS, withCaliforniaImportSession } from "../server/services/california-import-session";

beforeEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
  mocks.connect.mockResolvedValue(undefined);
  mocks.end.mockResolvedValue(undefined);
  mocks.query.mockReset().mockResolvedValue({ rows: [] })
    .mockResolvedValueOnce({ rows: [{ acquired: true }] });
});

describe("California import session ownership and time limits", () => {
  it("uses the runtime target and bounded disposable connection, then closes it", async () => {
    const work = vi.fn(async (database, check) => { check(); return database; });
    expect(await withCaliforniaImportSession(work)).toBe(mocks.database);
    expect(mocks.config).toHaveBeenCalledWith(expect.objectContaining({
      connectionString: "postgresql://example.invalid/test",
      ssl: { rejectUnauthorized: true },
      connectionTimeoutMillis: 5000, query_timeout: 20000,
      statement_timeout: 15000, idle_in_transaction_session_timeout: 30000,
    }));
    expect(mocks.query.mock.calls[1][1]).toEqual(["CA", "in_progress"]);
    expect(mocks.end).toHaveBeenCalledOnce();
  });
  it("rejects a concurrent importer without starting work or waiting on its lock", async () => {
    mocks.query.mockReset().mockResolvedValueOnce({ rows: [{ acquired: false }] });
    const work = vi.fn();
    await expect(withCaliforniaImportSession(work)).rejects.toThrow("already holds");
    expect(work).not.toHaveBeenCalled();
    expect(mocks.query).toHaveBeenCalledOnce();
    expect(mocks.end).toHaveBeenCalledOnce();
  });
  it("blocks unresolved legacy runs without automatically marking them failed", async () => {
    mocks.query.mockResolvedValueOnce({ rows: [{ id: "unresolved" }] });
    const work = vi.fn();
    await expect(withCaliforniaImportSession(work)).rejects.toThrow("unresolved California import");
    expect(work).not.toHaveBeenCalled();
    expect(mocks.query.mock.calls.every(([query]) => !/update|delete|insert/i.test(query))).toBe(true);
    expect(mocks.end).toHaveBeenCalledOnce();
  });
  it("closes the connection after work errors or connection errors", async () => {
    await expect(withCaliforniaImportSession(async () => { throw new Error("write failed"); }))
      .rejects.toThrow("write failed");
    expect(mocks.end).toHaveBeenCalledOnce();
    mocks.end.mockClear();
    mocks.connect.mockRejectedValueOnce(new Error("connect failed"));
    await expect(withCaliforniaImportSession(vi.fn())).rejects.toThrow("connect failed");
    expect(mocks.end).toHaveBeenCalledOnce();
  });
  it("checks the total budget without racing a still-running transaction", async () => {
    vi.useFakeTimers();
    try {
      await expect(withCaliforniaImportSession(async (_db, check) => {
        vi.advanceTimersByTime(CALIFORNIA_IMPORT_LIMITS.totalMs);
        check();
      })).rejects.toThrow("two-minute execution budget");
      expect(mocks.end).toHaveBeenCalledOnce();
    } finally { vi.useRealTimers(); }
  });
});
