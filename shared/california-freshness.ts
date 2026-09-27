import receipt from "../scripts/data-review/output/california-archive-refresh-receipt.json";
import { californiaReceiptStatus } from "./california-freshness-core.mjs";
export function getCaliforniaEvidenceStatus(now = new Date()) {
  return californiaReceiptStatus(receipt, now);
}
export function isCaliforniaEvidenceFresh(now = new Date()): boolean {
  return getCaliforniaEvidenceStatus(now) === "current";
}
