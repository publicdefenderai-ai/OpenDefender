/** Archive currency is a bounded check, not a guarantee against intervening amendments. */
// @ts-check
import retainedPins from "./california-retained-pins.json" with { type: "json" };
export const CALIFORNIA_ARCHIVE = Object.freeze({
  url: "https://downloads.leginfo.legislature.ca.gov/pubinfo_2025.zip",
  sha256: "dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4",
  bytes: 1279738518,
  acquiredAt: "2026-09-24T22:10:49.174Z",
});
export const CALIFORNIA_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
/**
 * @param {unknown} input
 * @param {Date} [now]
 * @param {unknown} [comparison]
 * @param {readonly string[]} [requiredKeys]
 * @returns {"current" | "stale" | "invalid"}
 */
export function californiaReceiptStatus(input, now = new Date(), comparison, requiredKeys = []) {
  if (!input || typeof input !== "object") return "invalid";
  const receipt = /** @type {Record<string, unknown>} */ (input);
  if (typeof receipt.checkedAt !== "string" || typeof receipt.expiresAt !== "string" || typeof receipt.method !== "string") return "invalid";
  const checked = Date.parse(receipt.checkedAt), expires = Date.parse(receipt.expiresAt);
  if (receipt.schemaVersion !== 1 || receipt.status !== "matched" ||
      receipt.sourceUrl !== CALIFORNIA_ARCHIVE.url ||
      receipt.archiveSha256 !== CALIFORNIA_ARCHIVE.sha256 ||
      receipt.archiveBytes !== CALIFORNIA_ARCHIVE.bytes ||
      typeof receipt.checkedAt !== "string" || typeof receipt.expiresAt !== "string" ||
      !Number.isFinite(checked) || !Number.isFinite(expires) || !Number.isFinite(now.getTime()) ||
      checked < Date.parse(CALIFORNIA_ARCHIVE.acquiredAt) || checked > now.getTime() ||
      expires - checked !== CALIFORNIA_MAX_AGE_MS ||
      !["original_acquisition", "full_archive_comparison", "retained_section_comparison"].includes(receipt.method) ||
      (receipt.method === "original_acquisition" && checked !== Date.parse(CALIFORNIA_ARCHIVE.acquiredAt))) return "invalid";
  if (receipt.method === "retained_section_comparison" && !validRetainedComparison(receipt, comparison)) return "invalid";
  if (requiredKeys.some(key => !Object.hasOwn(retainedPins, key) ||
      (Array.isArray(receipt.heldSourceKeys) && receipt.heldSourceKeys.includes(key)))) return "invalid";
  return now.getTime() >= expires ? "stale" : "current";
}

/** @param {Record<string, unknown>} receipt @param {unknown} input */
function validRetainedComparison(receipt, input) {
  if (!input || typeof input !== "object") return false;
  const report = /** @type {Record<string, any>} */ (input);
  const pins = /** @type {Record<string, {hash: string, versions: number}>} */ (retainedPins);
  if (report.schemaVersion !== 1 ||
      report.baselineArchiveSha256 !== CALIFORNIA_ARCHIVE.sha256 ||
      report.candidate?.sourceUrl !== CALIFORNIA_ARCHIVE.url ||
      typeof report.candidate?.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(report.candidate.sha256) ||
      report.candidate.sha256 !== receipt.observedArchiveSha256 ||
      !(Number.isSafeInteger(report.candidate.bytes) && report.candidate.bytes > 0) ||
      typeof report.candidate.retrievedAt !== "string" ||
      Date.parse(report.candidate.retrievedAt) !== Date.parse(String(receipt.checkedAt)) ||
      !Array.isArray(report.sections) || report.sections.length !== Object.keys(pins).length) return false;
  if (!Array.isArray(receipt.heldSourceKeys) || receipt.heldSourceKeys.some(key => typeof key !== "string" || !Object.hasOwn(pins, key)) ||
      new Set(receipt.heldSourceKeys).size !== receipt.heldSourceKeys.length ||
      JSON.stringify(report.heldSourceKeys) !== JSON.stringify(receipt.heldSourceKeys) ||
      report.allUnchanged !== (receipt.heldSourceKeys.length === 0) || receipt.heldSourceKeys.length >= Object.keys(pins).length) return false;
  const held = new Set(receipt.heldSourceKeys);
  const seen = new Set();
  for (const row of report.sections) {
    if (!row || typeof row.key !== "string" || seen.has(row.key) || !Object.hasOwn(pins, row.key)) return false;
    seen.add(row.key);
    const pin = pins[row.key];
    if (row.expectedHash !== pin.hash || row.expectedVersions !== pin.versions) return false;
    if (held.has(row.key)) {
      if (row.status !== "changed_or_missing") return false;
    } else if (row.status !== "unchanged" || row.observedHash !== pin.hash || row.observedVersions !== pin.versions) return false;
  }
  return true;
}
