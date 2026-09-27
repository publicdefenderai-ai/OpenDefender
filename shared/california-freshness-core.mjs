/** Archive currency is a bounded check, not a guarantee against intervening amendments. */
export const CALIFORNIA_ARCHIVE = Object.freeze({
  url: "https://downloads.leginfo.legislature.ca.gov/pubinfo_2025.zip",
  sha256: "dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4",
  bytes: 1279738518,
  acquiredAt: "2026-09-24T22:10:49.174Z",
});
export const CALIFORNIA_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export function californiaReceiptStatus(receipt, now = new Date()) {
  if (!receipt || typeof receipt !== "object") return "invalid";
  const checked = Date.parse(receipt.checkedAt), expires = Date.parse(receipt.expiresAt);
  if (receipt.schemaVersion !== 1 || receipt.status !== "matched" ||
      receipt.sourceUrl !== CALIFORNIA_ARCHIVE.url ||
      receipt.archiveSha256 !== CALIFORNIA_ARCHIVE.sha256 ||
      receipt.archiveBytes !== CALIFORNIA_ARCHIVE.bytes ||
      typeof receipt.checkedAt !== "string" || typeof receipt.expiresAt !== "string" ||
      !Number.isFinite(checked) || !Number.isFinite(expires) || !Number.isFinite(now.getTime()) ||
      checked < Date.parse(CALIFORNIA_ARCHIVE.acquiredAt) || checked > now.getTime() ||
      expires - checked !== CALIFORNIA_MAX_AGE_MS ||
      !["original_acquisition", "full_archive_comparison"].includes(receipt.method) ||
      (receipt.method === "original_acquisition" && checked !== Date.parse(CALIFORNIA_ARCHIVE.acquiredAt))) return "invalid";
  return now.getTime() >= expires ? "stale" : "current";
}
