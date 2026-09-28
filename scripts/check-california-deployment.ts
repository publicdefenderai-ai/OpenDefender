/** Read-only public release check. No admin token, seed operation or case data. */
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CALIFORNIA_CANONICAL_RECORDS, getCaliforniaRecordEvidenceStatus } from "../shared/california-authority";
import { getCaliforniaEvidenceSummary } from "../shared/california-freshness";

export function assessCaliforniaDeployment(status: any, selector: any, now = new Date()) {
  const expected = getCaliforniaEvidenceSummary(now);
  const expectedIds = CALIFORNIA_CANONICAL_RECORDS.filter(row => row.selectable && getCaliforniaRecordEvidenceStatus(row, now) === "current").map(row => row.canonicalId).sort();
  const actualIds = Array.isArray(selector?.charges) ? selector.charges.map((row: any) => row?.id).sort() : [];
  const problems: string[] = [];
  if (expected.status !== "current") problems.push("Local reviewed receipt is not current; do not deploy it as approved evidence.");
  if (expected.expiresAt && Date.parse(expected.expiresAt) - now.getTime() <= 48 * 3_600_000) problems.push("Receipt needs renewal before release: 48 hours or less remain.");
  if (status?.success !== true || status?.archiveEvidence?.status !== "current") problems.push("Published server does not report current California archive evidence.");
  for (const key of ["checkedAt", "expiresAt", "archiveSha256", "observedArchiveSha256", "method"] as const) {
    if (status?.archiveEvidence?.[key] !== expected[key]) problems.push(`Published receipt differs from this checkout: ${key}.`);
  }
  if (JSON.stringify(status?.archiveEvidence?.heldSourceKeys) !== JSON.stringify(expected.heldSourceKeys)) problems.push("Published source holds differ from this checkout.");
  if (status?.lastRun?.status !== "completed" || !(status?.linkedChargeCount > 0)) problems.push("California source database has no completed, linked seed.");
  if (selector?.success !== true || selector?.totalAvailable !== expectedIds.length ||
      JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) problems.push("Public selector IDs do not match the configured California release.");
  return { ok: problems.length === 0, checkedAt: now.toISOString(), expectedCount: expectedIds.length,
    actualCount: actualIds.length, expectedReceipt: expected, problems };
}
export async function checkCaliforniaDeployment() {
  const responses = await Promise.all([
    "/api/statutes/sources/california/status",
    "/api/criminal-charges?jurisdiction=CA&limit=500",
  ].map(async path => {
    const response = await fetch(`https://opendefender.net${path}`, { redirect: "error", cache: "no-store", signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`Public deployment check failed: HTTP ${response.status}`);
    return response.json();
  }));
  return assessCaliforniaDeployment(responses[0], responses[1]);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  checkCaliforniaDeployment().then(report => {
    console.log(JSON.stringify(report, null, 2)); process.exitCode = report.ok ? 0 : 1;
  }).catch(error => { console.error(error.message); process.exitCode = 1; });
}
