/** Replay genuine official acquisitions against reviewed pins; no network or database access.
 * A mismatch aborts before either receipt is written. This command never changes pins.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { OHIO_REVIEWED_CURRENT_REVIEW_HASH, OHIO_REVIEWED_RECEIPT_PATH, ohioReviewedExpectedDocuments, validateOhioReviewedRefreshReceipt } from "../../server/data/ohio-reviewed-source";
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS, ohioChapter2903Evidence } from "../../server/data/ohio-chapter-2903-source";
import { OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, validateOhioChapter2903RefreshReceipt } from "../../server/data/ohio-chapter-2903-refresh";

type Document = ReturnType<typeof ohioReviewedExpectedDocuments>[number] & { text: string; retrievedAt: string };
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
export function buildOhioRestorationReceipts(evidence: { documents: Record<string, Document> }, now = new Date()) {
  const reviewed = ohioReviewedExpectedDocuments();
  const pilotMap = new Map<string, (typeof reviewed)[number]>();
  for (const record of OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS) {
    for (const { document: d } of ohioChapter2903Evidence(record)) {
      pilotMap.set(d.section, { section: d.section, title: d.title, sourceUrl: d.sourceUrl,
        contentHash: d.contentHash, effectiveDateStart: d.effectiveDateStart });
    }
  }
  const pilot = [...pilotMap.values()].sort((a, b) => a.section.localeCompare(b.section));
  const receiptFor = (expected: typeof reviewed) => {
    const times = expected.map(pin => {
      const doc = evidence.documents[pin.section];
      const acquired = Date.parse(doc?.retrievedAt);
      if (!doc || !Number.isFinite(acquired) || acquired > now.getTime() || acquired + MAX_AGE <= now.getTime() ||
          Object.entries(pin).some(([key, value]) => doc[key as keyof Document] !== value) ||
          createHash("sha256").update(doc.text).digest("hex") !== pin.contentHash ||
          !/^\d{4}-\d{2}-\d{2}$/.test(doc.effectiveDateStart) || Date.parse(doc.effectiveDateStart) > now.getTime()) {
        throw new Error(`Ohio restoration evidence missing, stale, future or changed: ${pin.section}`);
      }
      return acquired;
    });
    return { schemaVersion: 1, checkedAt: now.toISOString(),
      expiresAt: new Date(Math.min(now.getTime(), ...times) + MAX_AGE).toISOString(), documents: expected };
  };
  const pilotReceipt = receiptFor(pilot);
  const reviewedReceipt = { ...receiptFor(reviewed), reportHash: OHIO_REVIEWED_CURRENT_REVIEW_HASH };
  const errors = [validateOhioChapter2903RefreshReceipt(pilotReceipt, now), validateOhioReviewedRefreshReceipt(reviewedReceipt, now)].filter(Boolean);
  if (errors.length) throw new Error(errors.join("; "));
  return { pilotReceipt, reviewedReceipt };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const path = process.argv.find(arg => arg.startsWith("--evidence="))?.slice("--evidence=".length);
  if (!path) throw new Error("Provide --evidence=<local official acquisition file>; never a database export");
  const result = buildOhioRestorationReceipts(JSON.parse(readFileSync(path, "utf8")));
  if (process.argv.includes("--write-receipts")) {
    writeFileSync(OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, JSON.stringify(result.pilotReceipt, null, 2) + "\n");
    writeFileSync(OHIO_REVIEWED_RECEIPT_PATH, JSON.stringify(result.reviewedReceipt, null, 2) + "\n");
  }
  console.log(JSON.stringify({ mode: process.argv.includes("--write-receipts") ? "local_receipts_written_no_deployment" : "validation_only",
    pilotDocuments: result.pilotReceipt.documents.length, reviewedDocuments: result.reviewedReceipt.documents.length,
    pilotExpiresAt: result.pilotReceipt.expiresAt, reviewedExpiresAt: result.reviewedReceipt.expiresAt }, null, 2));
}
