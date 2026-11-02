import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { Client } from "pg";
import { generateDrizzleJson, generateMigration } from "drizzle-kit/api";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import * as schema from "../shared/schema";
import { buildCaliforniaSourceDatabaseSeed } from "../server/data/california-source-database-seed";
import { seedCaliforniaSourceDatabase } from "../server/services/california-source-database";
import { withCaliforniaImportSession, CALIFORNIA_IMPORT_LIMITS } from "../server/services/california-import-session";
import { sql } from "drizzle-orm";

// Only replace the app's connection factory, never PostgreSQL/Drizzle/import logic.
// No app database module or credential is evaluated by this test.
vi.mock("../server/db", async () => {
  const socket = process.env.CA_REHEARSAL_SOCKET;
  if (!socket) return { pool: undefined, db: {} };
  const path = await import("node:path");
  const { existsSync } = await import("node:fs");
  if (!socket || !path.resolve(socket).startsWith(path.resolve("generated-artifacts/ca-pg-")) ||
      !existsSync(path.join(socket, "../DISPOSABLE"))) {
    throw new Error("Use the owner-approved disposable cluster runner, not an application database");
  }
  const { Pool } = await import("pg");
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const schema = await import("../shared/schema");
  const pool = new Pool({ host: socket, port: 55483, user: "ca_rehearsal", database: "postgres" });
  return { pool, db: drizzle({ client: pool, schema }) };
});

const enabled = !!process.env.CA_REHEARSAL_SOCKET;
describe.skipIf(!enabled)("California real PostgreSQL rehearsal", () => {
  let observer: Client;
  const seed = buildCaliforniaSourceDatabaseSeed();
  const results: Array<{ scenario: string; elapsedMs: number }> = [];
  const receiptPath = "scripts/data-review/output/california-archive-refresh-receipt.json";
  const receiptBefore = readFileSync(receiptPath, "utf8");
  const realQuery = Client.prototype.query as (
    this: Client, text: string | object, values?: any[]
  ) => Promise<any>;
  let intercept: ((client: Client, text: string, execute: () => Promise<any>) => Promise<any>) | undefined;
  let spy: ReturnType<typeof vi.spyOn>;
  const query = (text: string, params?: any[]) => observer.query(text, params);
  const counts = async () => (await query(`SELECT
    (SELECT count(*)::int FROM statute_sources) AS sources,
    (SELECT count(*)::int FROM statute_source_snapshots) AS snapshots,
    (SELECT count(*)::int FROM statute_charge_links) AS links,
    (SELECT count(*)::int FROM statute_update_queue) AS queue`)).rows[0];
  async function measured<T>(scenario: string, work: () => Promise<T>) {
    const start = performance.now();
    try { return await work(); }
    finally {
      const elapsedMs = Math.round(performance.now() - start);
      results.push({ scenario, elapsedMs });
      console.log(`REHEARSAL ${scenario}: ${elapsedMs}ms`);
    }
  }
  async function reset() {
    intercept = undefined;
    await query("TRUNCATE statute_sources, statute_source_snapshots, statute_charge_links, statute_update_queue, statute_ingestion_runs CASCADE");
  }
  async function failedCleanly(result: Awaited<ReturnType<typeof seedCaliforniaSourceDatabase>>) {
    expect(result).toMatchObject({ success: false, snapshotInserted: 0, linkCount: 0 });
    expect(await counts()).toEqual({ sources: 0, snapshots: 0, links: 0, queue: 0 });
    const row = (await query("SELECT status FROM statute_ingestion_runs WHERE id=$1", [result.runId])).rows[0];
    expect(["failed", "in_progress"]).toContain(row.status);
    expect((await query("SELECT count(*)::int AS n FROM statute_ingestion_runs WHERE status='completed'")).rows[0].n).toBe(0);
  }

  beforeAll(async () => {
    observer = new Client({ host: process.env.CA_REHEARSAL_SOCKET, port: 55483,
      user: "ca_rehearsal", database: "postgres" });
    await observer.connect();
    expect((await query("SHOW listen_addresses")).rows[0].listen_addresses).toBe("");
    const tables = {
      statuteSources: schema.statuteSources, statuteSourceSnapshots: schema.statuteSourceSnapshots,
      statuteChargeLinks: schema.statuteChargeLinks, statuteIngestionRuns: schema.statuteIngestionRuns,
      statuteUpdateQueue: schema.statuteUpdateQueue,
    };
    // Generate DDL from the actual five application tables, including indexes/FKs.
    for (const statement of await generateMigration(generateDrizzleJson({}), generateDrizzleJson(tables))) {
      await query(statement);
    }
    spy = vi.spyOn(Client.prototype, "query").mockImplementation(function(this: Client, ...args: any[]) {
      const text = typeof args[0] === "string" ? args[0] : args[0].text;
      const execute = () => (realQuery as any).apply(this, args);
      return this === observer || !intercept ? execute() : intercept(this, text, execute);
    } as any);
  }, 30_000);

  afterAll(async () => {
    intercept = undefined;
    spy?.mockRestore();
    expect(readFileSync(receiptPath, "utf8")).toBe(receiptBefore);
    writeFileSync(path.join(process.env.CA_REHEARSAL_OUTPUT!, "results.json"),
      JSON.stringify({ postgres: (await query("SELECT version() AS version")).rows[0].version,
        limits: CALIFORNIA_IMPORT_LIMITS, sourceCount: seed.sources.length, results,
        receiptUnchanged: true }, null, 2));
    await observer.end();
    const { pool } = await import("../server/db");
    await pool.end();
  });

  it("imports 5733 references, preserves receipts/holds, and repeats idempotently", async () => {
    await reset();
    expect(seed.sources).toHaveLength(5733);
    const first = await measured("fresh-5733", () => seedCaliforniaSourceDatabase(seed));
    expect(first).toMatchObject({ success: true, snapshotInserted: 5733, linkCount: 5733, changeCount: 0 });
    const before = await counts();
    const repeatSeed = buildCaliforniaSourceDatabaseSeed(new Date(seed.generatedAt.getTime() + 1_000));
    const repeat = await measured("repeat-5733", () => seedCaliforniaSourceDatabase(repeatSeed));
    expect(repeat).toMatchObject({ success: true, snapshotInserted: 0, snapshotReused: 5733, linkCount: 0 });
    expect(await counts()).toEqual(before);
    expect((await query(`SELECT count(*)::int AS n FROM statute_sources
      WHERE last_retrieved_at IS NOT NULL OR last_checked_at IS NOT NULL OR can_store_content
      OR access_policy <> 'reference_only' OR reuse_status <> 'not_cleared'`)).rows[0].n).toBe(0);
    expect((await query(`SELECT count(*)::int AS n FROM statute_source_snapshots
      WHERE retrieved_at IS NOT NULL OR content IS NOT NULL OR hash_basis <> 'reference_metadata'
      OR manifest_imported_at <> $1`, [seed.generatedAt])).rows[0].n).toBe(0);
    const runs = (await query("SELECT status, metadata FROM statute_ingestion_runs")).rows;
    expect(runs.every(r => r.status === "completed")).toBe(true);
    expect(runs[0].metadata.selectableChargeIds).toEqual(seed.selectableChargeIds);
    expect(runs[0].metadata.catalogRecords).toEqual(JSON.parse(JSON.stringify(seed.catalogRecords)));
    const historical = new Date("2026-08-27T12:00:00Z");
    await query("UPDATE statute_sources SET last_retrieved_at=$1, last_checked_at=$1 WHERE source_key=$2",
      [historical, seed.sources[0].sourceKey]);
    expect((await measured("preserve-existing-dates", () => seedCaliforniaSourceDatabase(repeatSeed))).success).toBe(true);
    expect((await query("SELECT last_retrieved_at, last_checked_at FROM statute_sources WHERE source_key=$1",
      [seed.sources[0].sourceKey])).rows[0])
      .toEqual({ last_retrieved_at: historical, last_checked_at: historical });
  }, 60_000);

  it("preserves changed pending/rejected fingerprints and their old current links", async () => {
    await reset();
    expect((await seedCaliforniaSourceDatabase(seed)).success).toBe(true);
    const changed = structuredClone(seed);
    changed.snapshots[0].contentHash += "-changed";
    const baseline = (await query("SELECT id FROM statute_source_snapshots WHERE source_id=(SELECT id FROM statute_sources WHERE source_key=$1)", [seed.sources[0].sourceKey])).rows[0].id;
    const first = await measured("changed-fingerprint", () => seedCaliforniaSourceDatabase(changed));
    expect(first).toMatchObject({ success: true, changeCount: 1, snapshotInserted: 1, linkCount: 0 });
    const pending = (await query("SELECT * FROM statute_source_snapshots WHERE content_hash=$1", [changed.snapshots[0].contentHash])).rows[0];
    expect(pending).toMatchObject({ status: "pending_review", requires_review: true, supersedes_snapshot_id: baseline });
    for (const status of ["pending_review", "rejected"]) {
      await query("UPDATE statute_source_snapshots SET status=$1 WHERE id=$2", [status, pending.id]);
      const before = await counts();
      const repeat = await measured(`repeat-${status}`, () => seedCaliforniaSourceDatabase(changed));
      expect(repeat).toMatchObject({ success: true, snapshotInserted: 0, changeCount: 0, linkCount: 0 });
      expect(await counts()).toEqual(before);
      expect((await query("SELECT status FROM statute_source_snapshots WHERE id=$1", [pending.id])).rows[0].status).toBe(status);
      expect((await query("SELECT snapshot_id FROM statute_charge_links WHERE snapshot_id=$1", [pending.id])).rows).toHaveLength(0);
      expect((await query("SELECT count(*)::int AS n FROM statute_charge_links WHERE snapshot_id=$1 AND is_current", [baseline])).rows[0].n).toBeGreaterThan(0);
    }
  }, 60_000);

  it("rejects both multiple-current and duplicate-fingerprint ambiguous histories atomically", async () => {
    await reset();
    expect((await seedCaliforniaSourceDatabase(seed)).success).toBe(true);
    const row = (await query("SELECT * FROM statute_source_snapshots WHERE status='current' LIMIT 1")).rows[0];
    for (const kind of ["multiple-current", "duplicate-fingerprint"]) {
      const copy = { ...row, id: `synthetic-${kind}`, citation: `${row.citation} synthetic`,
        status: kind === "multiple-current" ? "current" : "rejected" };
      const keys = Object.keys(copy);
      await query(`INSERT INTO statute_source_snapshots (${keys.join(",")}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(",")})`, Object.values(copy));
      const before = await counts();
      const result = await measured(kind, () => seedCaliforniaSourceDatabase(seed));
      expect(result.success).toBe(false);
      expect(result.message).toContain("Ambiguous");
      expect(await counts()).toEqual(before);
      await query("DELETE FROM statute_source_snapshots WHERE id=$1", [copy.id]);
    }
  }, 60_000);

  it("blocks a concurrent session, releases its lock on close, and leaves legacy markers untouched", async () => {
    await reset();
    await measured("advisory-lock", () => withCaliforniaImportSession(async () => {
      await expect(seedCaliforniaSourceDatabase(seed)).rejects.toThrow("already holds");
      expect((await query("SELECT * FROM statute_ingestion_runs")).rows).toHaveLength(0);
    }));
    await withCaliforniaImportSession(async () => {});
    await query("INSERT INTO statute_ingestion_runs(id,jurisdiction,operation,status) VALUES ('synthetic-legacy','CA','seed','in_progress')");
    const before = (await query("SELECT * FROM statute_ingestion_runs")).rows;
    await measured("legacy-block", async () => {
      await expect(seedCaliforniaSourceDatabase(seed)).rejects.toThrow("unresolved California");
    });
    expect((await query("SELECT * FROM statute_ingestion_runs")).rows).toEqual(before);
  });

  it("rolls back earlier batches and the completion marker on a late failure", async () => {
    for (const phase of ["snapshot", "completion"]) {
      await reset();
      let fired = false;
      intercept = async (_client, text, execute) => {
        const value = await execute();
        if (!fired && (phase === "snapshot" ? text.startsWith('insert into "statute_source_snapshots"') :
          text.startsWith('update "statute_ingestion_runs"'))) {
          fired = true;
          // Fail only after the database actually accepted the write.
          throw new Error(`synthetic ${phase} failure after real write`);
        }
        return value;
      };
      const result = await measured(`rollback-${phase}`, () => seedCaliforniaSourceDatabase(seed));
      intercept = undefined;
      expect(fired).toBe(true);
      await failedCleanly(result);
    }
  }, 60_000);

  it("rolls back changed snapshots and their review queue along with completion", async () => {
    await reset();
    expect((await seedCaliforniaSourceDatabase(seed)).success).toBe(true);
    const before = await counts();
    const changed = structuredClone(seed);
    changed.snapshots[0].contentHash += "-rollback";
    let fired = false;
    intercept = async (_client, text, execute) => {
      const result = await execute();
      if (!fired && text.startsWith('update "statute_ingestion_runs"')) {
        fired = true;
        throw new Error("synthetic failure after changed completion");
      }
      return result;
    };
    const result = await measured("rollback-review-queue", () => seedCaliforniaSourceDatabase(changed));
    intercept = undefined;
    expect(result).toMatchObject({ success: false, changeCount: 0, snapshotInserted: 0, linkCount: 0 });
    expect(await counts()).toEqual(before);
    expect((await query("SELECT * FROM statute_source_snapshots WHERE content_hash=$1",
      [changed.snapshots[0].contentHash])).rows).toHaveLength(0);
    expect((await query("SELECT status FROM statute_ingestion_runs WHERE id=$1", [result.runId])).rows[0].status).toBe("failed");
  }, 45_000);

  it("enforces the real statement and client query timeouts with database sleeps", async () => {
    for (const kind of ["statement", "query"]) {
      await reset();
      let fired = false;
      let timeoutError: any;
      intercept = async (client, text, execute) => {
        if (!fired && text.startsWith('insert into "statute_source_snapshots"')) {
          fired = true;
          if (kind === "query") await realQuery.call(client, "SET LOCAL statement_timeout=0");
          try {
            await realQuery.call(client, "SELECT pg_sleep(40)");
          } catch (error) {
            timeoutError = error;
            throw error;
          }
        }
        return execute();
      };
      const start = performance.now();
      const result = await measured(`timeout-${kind}`, () => seedCaliforniaSourceDatabase(seed));
      intercept = undefined;
      expect(performance.now() - start).toBeGreaterThanOrEqual(kind === "query" ? 19_900 : 14_900);
      expect(timeoutError?.message).toMatch(kind === "query" ? /timeout/i : /statement timeout/i);
      if (kind === "statement") expect(timeoutError.code).toBe("57014");
      await failedCleanly(result);
    }
  }, 75_000);

  it("enforces the real idle transaction timeout and closes the lock-holding session", async () => {
    await reset();
    let fired = false;
    let idleCode: string | undefined;
    intercept = async (client, text, execute) => {
      if (!fired && text.startsWith('insert into "statute_source_snapshots"')) {
        fired = true;
        expect(client.listenerCount("error")).toBeGreaterThan(0);
        client.on("error", error => { idleCode ??= (error as any).code; });
        await new Promise(resolve => setTimeout(resolve, 31_000));
      }
      return execute();
    };
    const result = await measured("timeout-idle", () => seedCaliforniaSourceDatabase(seed));
    intercept = undefined;
    expect(idleCode).toBe("25P03");
    await failedCleanly(result);
    // The unresolved marker deliberately continues to block a retry.
    await expect(seedCaliforniaSourceDatabase(seed)).rejects.toThrow("unresolved California");
  }, 45_000);

  it("rolls back completion after the actual two-minute total budget", async () => {
    await reset();
    let fired = false;
    intercept = async (client, text, execute) => {
      const value = await execute();
      if (!fired && text.startsWith('update "statute_ingestion_runs"')) {
        fired = true;
        // Individually below query/statement limits; active, not idle.
        for (let i = 0; i < 9; i++) await realQuery.call(client, "SELECT pg_sleep(14)");
      }
      return value;
    };
    const start = performance.now();
    const result = await measured("timeout-total", () => seedCaliforniaSourceDatabase(seed));
    intercept = undefined;
    expect(performance.now() - start).toBeGreaterThanOrEqual(120_000);
    expect(result.message).toContain("two-minute execution budget");
    await failedCleanly(result);
  }, 150_000);

  it("does not overwrite completion when COMMIT succeeds but its acknowledgement is lost", async () => {
    await reset();
    let fired = false;
    intercept = async (client, text, execute) => {
      if (!fired && text.toLowerCase() === "commit") {
        // Drop the actual wire acknowledgement only after PostgreSQL emitted
        // CommandComplete(COMMIT). No query result or transaction is mocked.
        const stream = (client as any).connection.stream;
        const emit = stream.emit;
        let buffered = Buffer.alloc(0);
        stream.emit = function(event: string, ...args: any[]) {
          if (event !== "data") return emit.call(this, event, ...args);
          buffered = Buffer.concat([buffered, args[0]]);
          while (buffered.length >= 5) {
            const size = buffered.readInt32BE(1) + 1;
            if (buffered.length < size) break;
            const frame = buffered.subarray(0, size);
            buffered = buffered.subarray(size);
            if (frame[0] === 67 && frame.subarray(5).toString() === "COMMIT\0") {
              fired = true;
              this.destroy();
              return true;
            }
            emit.call(this, "data", frame);
          }
          return true;
        };
      }
      return execute();
    };
    const result = await measured("uncertain-commit", () => seedCaliforniaSourceDatabase(seed));
    intercept = undefined;
    expect(fired).toBe(true);
    expect(result.success).toBe(false);
    expect(result.message).toContain("do not retry without primary verification");
    expect((await query("SELECT status, snapshot_count, link_count FROM statute_ingestion_runs WHERE id=$1", [result.runId])).rows[0])
      .toEqual({ status: "completed", snapshot_count: 5733, link_count: 5733 });
    expect(await counts()).toEqual({ sources: 5733, snapshots: 5733, links: 5733, queue: 0 });
    await withCaliforniaImportSession(async database => {
      expect((await database.execute(sql`SELECT 1 AS n`)).rows[0].n).toBe(1);
    });
  }, 45_000);
});
