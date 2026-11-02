import { Client } from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

export type CaliforniaImportDatabase = NodePgDatabase<typeof schema>;

export const CALIFORNIA_IMPORT_LIMITS = {
  connectionMs: 5_000,
  queryMs: 20_000,
  statementMs: 15_000,
  idleTransactionMs: 30_000,
  totalMs: 120_000,
} as const;

export class CaliforniaImportBlockedError extends Error {}

/**
 * A disposable connection: never change timeouts on the application's shared
 * pool or leave session locks/settings behind on a pooled connection.
 */
export async function withCaliforniaImportSession<T>(
  work: (database: CaliforniaImportDatabase, checkDeadline: () => void) => Promise<T>,
): Promise<T> {
  const { pool } = await import("../db");
  // Preserve the existing runtime connection precedence; no alternate URL.
  const client = new Client({
    ...pool.options,
    connectionTimeoutMillis: CALIFORNIA_IMPORT_LIMITS.connectionMs,
    query_timeout: CALIFORNIA_IMPORT_LIMITS.queryMs,
    statement_timeout: CALIFORNIA_IMPORT_LIMITS.statementMs,
    idle_in_transaction_session_timeout: CALIFORNIA_IMPORT_LIMITS.idleTransactionMs,
    application_name: "california-reference-import",
  });
  const deadline = Date.now() + CALIFORNIA_IMPORT_LIMITS.totalMs;
  let locked = false;
  try {
    await client.connect();
    const result = await client.query<{ acquired: boolean }>(
      "SELECT pg_try_advisory_lock(70117, 3) AS acquired",
    );
    locked = result.rows[0]?.acquired === true;
    if (!locked) {
      throw new CaliforniaImportBlockedError("A California import already holds the import lock.");
    }
    // Legacy importers do not take this lock. Do not assume their persisted
    // in-progress rows are orphaned, and never repair them automatically.
    const previous = await client.query(
      "SELECT id FROM statute_ingestion_runs WHERE jurisdiction = $1 AND status = $2 LIMIT 1",
      ["CA", "in_progress"],
    );
    if (previous.rows.length) {
      throw new CaliforniaImportBlockedError(
        "An unresolved California import exists. Verify primary activity and resolve it explicitly before retrying.",
      );
    }
    const database = drizzle({ client, schema });
    return await work(database, () => {
      if (Date.now() >= deadline) {
        throw new Error("California import exceeded its two-minute execution budget; transaction must roll back.");
      }
    });
  } finally {
    // Closing releases the session lock and any uncommitted transaction.
    // Do not queue an unlock query behind a timed-out statement.
    await client.end();
  }
}
