import comparison from "../scripts/data-review/output/california-retained-refresh-comparison.json";
import receipt from "../scripts/data-review/output/california-archive-refresh-receipt.json";
import { californiaReceiptStatus } from "./california-freshness-core.mjs";
export function getCaliforniaEvidenceStatus(now = new Date(), requiredKeys: readonly string[] = []): "current" | "stale" | "invalid" {
  return californiaReceiptStatus(receipt, now, comparison, requiredKeys);
}
export function isCaliforniaEvidenceFresh(now = new Date()): boolean {
  return getCaliforniaEvidenceStatus(now) === "current";
}

/** Public deployment diagnostics: dates and hash of public statutory evidence only. */
export function getCaliforniaEvidenceSummary(now = new Date()) {
  const data: Record<string, unknown> = receipt;
  return {
    status: getCaliforniaEvidenceStatus(now),
    checkedAt: typeof data.checkedAt === "string" ? data.checkedAt : null,
    expiresAt: typeof data.expiresAt === "string" ? data.expiresAt : null,
    archiveSha256: typeof data.archiveSha256 === "string" ? data.archiveSha256 : null,
    heldSourceKeys: Array.isArray(data.heldSourceKeys) ? data.heldSourceKeys.filter((key): key is string => typeof key === "string") : [],
    observedArchiveSha256: typeof data.observedArchiveSha256 === "string" ? data.observedArchiveSha256 : null,
    method: typeof data.method === "string" ? data.method : null,
  };
}
