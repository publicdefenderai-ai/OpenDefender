/** Offline research inventory. Does not refresh sources or change release eligibility. */
import { createHash } from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { CALIFORNIA_CANONICAL_RECORDS, CALIFORNIA_LEGACY_DISPOSITIONS } from "../../../shared/california-authority";
import batch from "./batch-one.json";

export function buildCaliforniaBaseline() {
  const ids = batch.groups.flatMap(group => group.chargeIds);
  if (ids.length !== 25 || new Set(ids).size !== ids.length) throw new Error("Expected 25 distinct batch records");
  const records = ids.map(id => {
    const record = CALIFORNIA_CANONICAL_RECORDS.find(row => row.canonicalId === id);
    if (!record?.selectable) throw new Error(`Batch record missing or no longer selectable: ${id}`);
    return {
      group: batch.groups.find(group => group.chargeIds.includes(id))!.id,
      canonicalId: id,
      catalogSha256: createHash("sha256").update(JSON.stringify(record)).digest("hex"),
      lawCode: record.lawCode,
      code: record.code,
      title: record.officialTitle,
      gradingToVerify: record.grading,
      penaltyToVerify: record.penalty,
      declaredCurrentness: record.currentness,
      declaredAttorneyReview: record.attorneyReview,
      sources: record.sources,
      verificationStatus: "not_yet_verified_in_this_batch",
    };
  });
  const sourceRequests = new Map<string, { lawCode: string; section: string; url: string; chargeIds: string[] }>();
  for (const record of records) {
    for (const source of record.sources.filter(source => source.kind === "statute")) {
      const url = new URL(source.url);
      const lawCode = url.searchParams.get("lawCode");
      const section = url.searchParams.get("sectionNum")?.replace(/\.$/, "");
      if (!lawCode || !section) throw new Error(`Unparseable official source for ${record.canonicalId}`);
      const key = `${lawCode}:${section}`;
      const request = sourceRequests.get(key) ?? { lawCode, section, url: source.url, chargeIds: [] };
      if (!request.chargeIds.includes(record.canonicalId)) request.chargeIds.push(record.canonicalId);
      sourceRequests.set(key, request);
    }
  }
  return {
    schemaVersion: 1,
    scope: "Offline catalog baseline and research queue; no legal verification or release approval",
    selectionBasis: batch.selectionBasis,
    accounting: {
      legacyRows: CALIFORNIA_LEGACY_DISPOSITIONS.length,
      legacyDispositions: CALIFORNIA_LEGACY_DISPOSITIONS.reduce<Record<string, number>>((counts, row) => {
        counts[row.disposition] = (counts[row.disposition] ?? 0) + 1; return counts;
      }, {}),
      canonicalRows: CALIFORNIA_CANONICAL_RECORDS.length,
      configuredSelectableRows: CALIFORNIA_CANONICAL_RECORDS.filter(row => row.selectable).length,
      batchRows: records.length,
      distinctDeclaredStatuteSources: sourceRequests.size,
      newlyVerifiedRows: 0,
      deployedAvailability: "public_ui_displayed_99_california_choices_on_2026-09-24; full_id_and_guidance_parity_not_yet_verified",
    },
    limitations: [
      "Declared currentness is historical catalog metadata, not a new source check or a statute-specific effective date.",
      "Source requests reflect existing links only. Missing sentencing, definitions, exceptions and case-law dependencies must be added through review.",
      "Configured selectable records are not necessarily deployed, verified, attorney-approved, or distinct statutory offenses.",
      "The priority checklist is not a count of all California offenses or a statistical coverage measure.",
    ],
    groups: batch.groups,
    sourceRequests: [...sourceRequests.values()].sort((a,b) => `${a.lawCode}:${a.section}`.localeCompare(`${b.lawCode}:${b.section}`)),
    records,
  };
}

export function renderCaliforniaBaseline(report: ReturnType<typeof buildCaliforniaBaseline>) {
  return [
    "# California verification: first-batch baseline", "",
    "Generated from the committed catalog. This is a research queue, not legal approval or a publication change.", "",
    `Configured: ${report.accounting.configuredSelectableRows} selectable records out of ${report.accounting.canonicalRows} canonical records; ${report.accounting.legacyRows} legacy dispositions. These populations overlap.`, "",
    `Batch: ${report.accounting.batchRows} existing records sharing ${report.accounting.distinctDeclaredStatuteSources} declared statute sources. Additional dependencies remain to be identified. Newly verified: 0.`, "",
    report.selectionBasis, "",
    ...report.limitations.map(text => `- ${text}`), "",
    "| Group | Existing ID | Citation to verify | Existing title |",
    "| --- | --- | --- | --- |",
    ...report.records.map(row => `| ${row.group} | ${row.canonicalId} | ${row.lawCode} ${row.code} | ${row.title} |`), "",
    "## Shared research questions", "",
    ...report.groups.flatMap(group => [`### ${group.id}`, "", ...group.researchQuestions.map(question => `- ${question}`), ""]),
  ].join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const report = buildCaliforniaBaseline();
  fs.writeFileSync(new URL("../output/california-batch-one-baseline.json", import.meta.url), JSON.stringify(report, null, 2) + "\n");
  fs.writeFileSync(new URL("../output/california-batch-one-baseline.md", import.meta.url), renderCaliforniaBaseline(report));
  console.log(JSON.stringify(report.accounting));
}
