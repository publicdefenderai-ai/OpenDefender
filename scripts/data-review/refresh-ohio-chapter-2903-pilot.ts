/**
 * Manually renew the short-lived receipt for the bounded Ohio Chapter 2903
 * pilot. This never updates pinned source text: any official change fails
 * closed and requires a separate reviewed source/catalog update.
 */
import { renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH,
} from "../../server/data/ohio-chapter-2903-refresh";
import { compareOhioChapter2903Sources } from "../../server/data/ohio-chapter-2903-comparison";

function writeReceipt(path: string, value: unknown): void {
  const temporaryPath = `${path}.${process.pid}.tmp`;
  writeFileSync(temporaryPath, JSON.stringify(value, null, 2) + "\n");
  renameSync(temporaryPath, path);
}

export async function refreshOhioChapter2903Pilot(
  fetchPage: typeof fetch = fetch,
  receiptPath = OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH,
): Promise<void> {
  try {
    const comparison = await compareOhioChapter2903Sources(fetchPage);
    if (comparison.errors.length > 0 || !comparison.receipt) {
      throw new Error(
        `Official Ohio refresh failed; pinned pilot was not updated and its prior receipt was revoked. ${
          comparison.errors.join("; ")
        }`,
      );
    }
    writeReceipt(receiptPath, comparison.receipt);
    console.log(`Ohio Chapter 2903 pilot receipt renewed through ${comparison.receipt.expiresAt}.`);
  } catch (error) {
    // A known failed refresh must not leave the previous "fresh" approval
    // usable until its scheduled expiry. Preserve source evidence, not approval.
    writeReceipt(receiptPath, {
      schemaVersion: 1,
      status: "blocked",
      checkedAt: new Date().toISOString(),
      documents: [],
      reason: "Official refresh failed; previously issued receipt revoked.",
    });
    throw error;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const localReceipt = process.argv.includes("--local-receipt");
  if (localReceipt && process.env.NODE_ENV === "production") {
    console.error("--local-receipt is not permitted in production.");
    process.exitCode = 1;
  } else if (localReceipt) {
    refreshOhioChapter2903Pilot().catch((error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
  } else {
    import("../../server/services/ohio-pilot-refresh-service")
      .then(({ runOhioPilotRefresh }) =>
        runOhioPilotRefresh({ force: true, triggeredBy: "cli" }))
      .then(result => {
        console.log(JSON.stringify(result, null, 2));
        if (!result.healthy) process.exitCode = 1;
      })
      .catch((error) => {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
      })
      .finally(async () => {
        const { pool } = await import("../../server/db");
        await pool.end();
      });
  }
}