import receipt from "../../scripts/data-review/output/california-archive-refresh-receipt.json";

// Structural tests use the committed receipt's validity interval. Production
// continues to use the real clock; expiry tests explicitly use expiresAt.
const start = Date.parse(receipt.checkedAt);
const end = Date.parse(receipt.expiresAt);
if (![start, end].every(Number.isFinite) || start >= end) {
  throw new Error("California test evidence needs a valid recorded receipt interval");
}
export const californiaEvidenceTestTime = new Date(start + (end - start) / 2);
