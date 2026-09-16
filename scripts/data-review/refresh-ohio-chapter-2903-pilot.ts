/**
 * Manually renew the short-lived receipt for the bounded Ohio Chapter 2903
 * pilot. This never updates pinned source text: any official change fails
 * closed and requires a separate reviewed source/catalog update.
 */
import { createHash } from "node:crypto";
import { renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH,
} from "../../server/data/ohio-chapter-2903-refresh";
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } from "../../server/data/ohio-chapter-2903-source";
import { extractOhioDocument } from "./import-ohio-source-database";

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

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
  const expected = new Map<string, (typeof OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS)[number]["offense"]>();
  for (const record of OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS) {
    for (const document of [record.offense, record.penalty, record.penaltyFine]) {
      if (!document) continue;
      expected.set(document.section, document);
    }
  }
  const checkedAt = new Date();
  const documents = [];
  for (const document of [...expected.values()].sort((a, b) => a.section.localeCompare(b.section))) {
    const response = await fetchPage(document.sourceUrl, {
      signal: AbortSignal.timeout(30_000),
      headers: { Accept: "text/html, */*" },
      redirect: "error",
    });
    const html = await response.text();
    if (!response.ok) throw new Error(`Official Ohio refresh failed for ${document.section}: HTTP ${response.status}`);
    const extracted = extractOhioDocument(html, document.section, document.sourceUrl, checkedAt);
    const contentHash = extracted && createHash("sha256").update(extracted.text).digest("hex");
    if (
      !extracted ||
      contentHash !== document.contentHash ||
      extracted.title !== document.title ||
      extracted.effectiveDateStart !== document.effectiveDateStart
    ) {
      throw new Error(
        `Official Ohio source changed or could not be extracted for ${document.section}; pinned pilot was not updated and its prior receipt was revoked.`,
      );
    }
    documents.push({
      section: document.section,
      title: document.title,
      sourceUrl: document.sourceUrl,
      contentHash: document.contentHash,
      effectiveDateStart: document.effectiveDateStart,
    });
  }
  writeReceipt(receiptPath, {
    schemaVersion: 1,
    checkedAt: checkedAt.toISOString(),
    expiresAt: new Date(checkedAt.getTime() + MAX_AGE_MS).toISOString(),
    documents,
  });
  console.log(`Ohio Chapter 2903 pilot receipt renewed through ${new Date(checkedAt.getTime() + MAX_AGE_MS).toISOString()}.`);
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
  refreshOhioChapter2903Pilot().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}