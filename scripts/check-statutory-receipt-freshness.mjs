import {validVerificationWindow} from "../shared/source-verification-policy.mjs";
/** Read-only deadline alarm plus Florida reviewed artifact binding. Neither is legal approval. */
import { californiaReceiptStatus } from "../shared/california-freshness-core.mjs";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { requiredReceipts } from "./data-review/publication-batches.mjs";
const hashJson = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
function floridaReviewedBindingMatches(root, receipt) {
  const report = JSON.parse(readFileSync(resolve(root, 'scripts/data-review/output/florida-reviewed-analysis.json'), 'utf8'));
  const eligibility = JSON.parse(readFileSync(resolve(root, 'shared/florida-reviewed-eligibility.json'), 'utf8'));
  if (receipt.reportHash !== hashJson(report) || eligibility.reportHash !== hashJson(report) || receipt.eligibilityHash !== hashJson(eligibility)) return false;
  const expected = Object.values(report.sourceEvidence ?? {}).map(d => ({sourceKey:d.sourceKey,contentHash:d.contentHash,retrievedAt:d.retrievedAt}));
  const actual = new Map((receipt.documents ?? []).map(d => [d.sourceKey,d]));
  const oldest = Math.min(...expected.map(d => Date.parse(d.retrievedAt)));
  return expected.length > 0 && actual.size === expected.length && receipt.documents.length === actual.size && Number.isFinite(oldest)
    && expected.every(d => Number.isFinite(Date.parse(d.retrievedAt)) && Date.parse(d.retrievedAt) <= Date.parse(receipt.checkedAt) && JSON.stringify(actual.get(d.sourceKey)) === JSON.stringify(d))
    && validVerificationWindow(receipt, new Date(oldest).toISOString());
}
export function checkStatutoryReceipts(root = process.cwd(), now = new Date()) {
  if (!Number.isFinite(now.getTime())) throw new Error("Invalid check time");
  const directory = resolve(root, "scripts/data-review/output");
  // Explicit required receipts catch deletion; discovery covers future receipts too.
  const names = [...new Set([...requiredReceipts, ...readdirSync(directory).filter(name => name.endsWith("-refresh-receipt.json"))])].sort();
  const receipts = names.map(name => {
    try {
      const receipt = JSON.parse(readFileSync(resolve(directory, name), "utf8"));
      if (name === "california-archive-refresh-receipt.json" && californiaReceiptStatus(receipt, now, receipt.method === "retained_section_comparison" ? JSON.parse(readFileSync(resolve(directory, "california-retained-refresh-comparison.json"), "utf8")) : undefined) === "invalid") throw new Error("Invalid California archive binding");
      const checkedAt = Date.parse(receipt.checkedAt), expiresAt = Date.parse(receipt.expiresAt);
      if (typeof receipt.checkedAt !== "string" || typeof receipt.expiresAt !== "string" || !Number.isFinite(checkedAt) || !Number.isFinite(expiresAt) || checkedAt > now.getTime() || expiresAt <= checkedAt || !validVerificationWindow(receipt)) throw new Error("Invalid receipt dates");
      const remainingHours = (expiresAt - now.getTime()) / 3_600_000;
      const dateStatus = remainingHours <= 0 ? "expired" : remainingHours <= (receipt.verificationPolicy === "quarterly-v1" ? 14 * 24 : 48) ? "due" : "current";
      let bindingStatus = 'not_checked';
      if (name === 'florida-reviewed-refresh-receipt.json') {
        try { bindingStatus = floridaReviewedBindingMatches(root, receipt) ? 'matched' : 'mismatched_or_missing'; }
        catch { bindingStatus = 'mismatched_or_missing'; }
      }
      return { name, expiresAt: receipt.expiresAt, remainingHours, dateStatus, bindingStatus, status: bindingStatus === 'mismatched_or_missing' ? 'binding_mismatch' : dateStatus };
    } catch {
      return { name, expiresAt: null, remainingHours: null, status: "invalid_or_missing" };
    }
  });
  return { scope: "deadline_alarm_with_florida_reviewed_binding_check_not_legal_approval", checkedAt: now.toISOString(), leadHours: 48, ok: receipts.every(row => row.status === "current"), receipts };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const report = checkStatutoryReceipts();
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.ok ? 0 : 1;
  } catch (error) {
    console.error(`Statutory receipt monitor failed: ${error.message}`);
    process.exitCode = 1;
  }
}
