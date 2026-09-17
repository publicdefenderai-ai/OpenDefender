import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS, ohioChapter2903Evidence } from "./ohio-chapter-2903-source";

export const OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH = resolve(
  process.cwd(),
  "scripts/data-review/output/ohio-chapter-2903-refresh-receipt.json",
);
const MAX_RECEIPT_AGE_MS = 7 * 24 * 60 * 60 * 1000;
/** No scheduler exists for this bounded pilot; run the refresh script manually
 * before this receipt expires. Expiry is intentionally a publication gate,
 * not an automatic lifetime approval of the pinned source text. */
export const OHIO_CHAPTER_2903_MANUAL_REFRESH_REQUIRED =
  "Run scripts/data-review/refresh-ohio-chapter-2903-pilot.ts manually before the seven-day receipt expires; a changed source requires reviewed pin updates and is never auto-approved.";

interface ReceiptDocument {
  section: string;
  title: string;
  sourceUrl: string;
  contentHash: string;
  effectiveDateStart: string;
}
interface Receipt {
  schemaVersion: number;
  checkedAt: string;
  expiresAt: string;
  documents: ReceiptDocument[];
}

function expectedDocuments(): ReceiptDocument[] {
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
    actual.some((document, index) =>
      JSON.stringify(document) !== JSON.stringify(expected[index]))
  ) return "Ohio Chapter 2903 refresh receipt does not attest to every pinned official dependency";
  return null;
}

export function getOhioChapter2903RefreshStatus(now = new Date()): {
  fresh: boolean;
  reason: string | null;
} {
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