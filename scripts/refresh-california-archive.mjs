/** Compare fresh publisher bytes with the reviewed archive; never overwrite the retained archive. */
import { createHash } from "node:crypto";
import { writeFileSync, renameSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CALIFORNIA_ARCHIVE, CALIFORNIA_MAX_AGE_MS } from "../shared/california-freshness-core.mjs";

export async function compareArchiveResponse(response, expected = CALIFORNIA_ARCHIVE) {
  if (response.status !== 200 || response.redirected || !response.body) throw new Error("Expected a direct HTTP 200 archive response");
  const hash = createHash("sha256");
  let bytes = 0;
  for await (const chunk of response.body) {
    bytes += chunk.length;
    if (bytes > expected.bytes) throw new Error("Archive exceeds reviewed size; changed or invalid response requires review");
    hash.update(chunk);
  }
  const declared = response.headers.get("content-length");
  if (declared !== null && Number(declared) !== bytes) throw new Error("Incomplete archive response");
  const sha256 = hash.digest("hex");
  return { matched: bytes === expected.bytes && sha256 === expected.sha256, bytes, sha256 };
}

export async function refreshCaliforniaArchive(destination, fetchArchive = fetch, now = () => new Date()) {
  function save(receipt) {
    const temporary = `${destination}.${process.pid}.tmp`;
    writeFileSync(temporary, JSON.stringify(receipt, null, 2) + "\n", { mode: 0o600 });
    renameSync(temporary, destination);
  }
  const startedAt = now().toISOString();
  const base = { schemaVersion: 1, method: "full_archive_comparison", sourceUrl: CALIFORNIA_ARCHIVE.url,
    archiveSha256: CALIFORNIA_ARCHIVE.sha256, archiveBytes: CALIFORNIA_ARCHIVE.bytes };
  // A crash or failed retrieval must not leave a newly approved receipt behind.
  save({ ...base, status: "unverified", attemptedAt: startedAt });
  const response = await fetchArchive(CALIFORNIA_ARCHIVE.url, {
    redirect: "error", cache: "no-store", signal: AbortSignal.timeout(30 * 60 * 1000),
    headers: { "Cache-Control": "no-cache", "Accept-Encoding": "identity" },
  });
  const comparison = await compareArchiveResponse(response);
  if (!comparison.matched) {
    save({ ...base, status: "changed", attemptedAt: startedAt, observedSha256: comparison.sha256, observedBytes: comparison.bytes });
    throw new Error("Publisher archive differs: review changed sources before approving a new baseline. Receipt withheld.");
  }
  // Bound the check to request start, not download completion.
  const checkedAt = startedAt;
  const receipt = { ...base, status: "matched", checkedAt,
    expiresAt: new Date(Date.parse(checkedAt) + CALIFORNIA_MAX_AGE_MS).toISOString() };
  save(receipt);
  return receipt;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const receipt = await refreshCaliforniaArchive(resolve("scripts/data-review/output/california-archive-refresh-receipt.json"));
    console.log(`California archive unchanged; evidence deadline ${receipt.expiresAt}. Commit and deploy the receipt.`);
  } catch (error) {
    console.error(`California refresh failed: ${error.message}. Commit/deploy the withheld receipt if replacing a live receipt; do not extend dates manually.`);
    process.exitCode = 1;
  }
}
