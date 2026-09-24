import { readFileSync } from "node:fs";

// Tests of the committed evidence use its recorded validity interval. Production
// still uses the real clock; expiry tests supply times outside this interval.
const receipts = ["ohio-chapter-2903-refresh-receipt.json", "ohio-reviewed-refresh-receipt.json"]
  .map(name => JSON.parse(readFileSync(`scripts/data-review/output/${name}`, "utf8")));
const starts = receipts.map(receipt => Date.parse(receipt.checkedAt));
const ends = receipts.map(receipt => Date.parse(receipt.expiresAt));
const sharedStart = Math.max(...starts);
if (![...starts, ...ends].every(Number.isFinite) || sharedStart >= Math.min(...ends)) {
  throw new Error("Ohio test evidence receipts need an overlapping recorded validity interval");
}
export const ohioEvidenceTestTime = new Date(sharedStart);
