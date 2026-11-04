import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS, ohioChapter2903Evidence } from "./ohio-chapter-2903-source";

export const OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH = resolve(
  process.cwd(),
  "scripts/data-review/output/ohio-chapter-2903-refresh-receipt.json",
);
const MAX_RECEIPT_AGE_MS = 7 * 24 * 60 * 60 * 1000;
/** Offline receipts are for review tooling only. Published runtime uses the
 * shared database receipt; a scheduled comparison never approves new pins. */
export const OHIO_CHAPTER_2903_MANUAL_REFRESH_REQUIRED =
  "Check the Ohio pilot operator status and scheduled refresh before the seven-day receipt expires; changed sources require explicit review and are never auto-approved.";

export interface ReceiptDocument {
  section: string;
  title: string;
  sourceUrl: string;
  contentHash: string;
  effectiveDateStart: string;
}
export interface Receipt {
  schemaVersion: number;
  checkedAt: string;
  expiresAt: string;
  documents: ReceiptDocument[];
}

export function expectedDocuments(): ReceiptDocument[] {
  const bySection = new Map<string, ReceiptDocument>();
  for (const record of OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS) {
    for (const { document } of ohioChapter2903Evidence(record)) {
      bySection.set(document.section, {
        section: document.section,
        title: document.title,
        sourceUrl: document.sourceUrl,
        contentHash: document.contentHash,
        effectiveDateStart: document.effectiveDateStart,
      });
    }
  }
  return [...bySection.values()].sort((a, b) => a.section.localeCompare(b.section));
}

export function ohioPilotPinset(): string {
  return createHash("sha256").update(JSON.stringify(expectedDocuments())).digest("hex");
}

export function validateOhioChapter2903RefreshReceipt(
  value: unknown,
  now = new Date(),
): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "Ohio Chapter 2903 official-source refresh receipt is missing or malformed";
  }
  const receipt = value as Partial<Receipt>;
  const checkedAt = new Date(receipt.checkedAt ?? "");
  const expiresAt = new Date(receipt.expiresAt ?? "");
  if (
    receipt.schemaVersion !== 1 ||
    ("status" in receipt && receipt.status === "blocked") ||
    !Array.isArray(receipt.documents) ||
    receipt.documents.some((document) => !document || typeof document.section !== "string") ||
    Number.isNaN(checkedAt.getTime()) ||
    Number.isNaN(expiresAt.getTime()) ||
    checkedAt > now ||
    expiresAt <= now ||
    expiresAt <= checkedAt ||
    expiresAt.getTime() - checkedAt.getTime() > MAX_RECEIPT_AGE_MS
  ) return "Ohio Chapter 2903 official-source refresh receipt is missing, malformed, or expired";

  const actual = [...receipt.documents].sort((a, b) => a.section.localeCompare(b.section));
  const expected = expectedDocuments();
  if (
    actual.length !== expected.length ||
    actual.some((document, index) => {
      // PostgreSQL jsonb deliberately reorders object keys. Compare values,
      // not serialization order, while rejecting unrecognized receipt fields.
      const keys = Object.keys(expected[index]) as (keyof ReceiptDocument)[];
      return Object.keys(document).length !== keys.length ||
        keys.some(key => document[key] !== expected[index][key]);
    })
  ) return "Ohio Chapter 2903 refresh receipt does not attest to every pinned official dependency";
  return null;
}

export function getOhioChapter2903RefreshStatus(now = new Date()): {
  fresh: boolean;
  reason: string | null;
} {
  if (process.env.NODE_ENV === "production") {
    return { fresh: false, reason: "Published Ohio freshness requires the shared database receipt" };
  }
  try {
    const receipt = JSON.parse(readFileSync(OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, "utf8"));
    const reason = validateOhioChapter2903RefreshReceipt(receipt, now);
    return { fresh: reason === null, reason };
  } catch {
    return { fresh: false, reason: "Ohio Chapter 2903 official-source refresh receipt is unavailable" };
  }
}

export function isOhioChapter2903PilotFresh(now = new Date()): boolean {
  return getOhioChapter2903RefreshStatus(now).fresh;
}