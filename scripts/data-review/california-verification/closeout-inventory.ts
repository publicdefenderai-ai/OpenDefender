/** Offline accounting over retained packets. No legal interpretation or activation. */
import fs from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const output = "scripts/data-review/output/";
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
type Row = Record<string, any>;
type Reference = { file: string; field: string; index: number };
type Comparison = {
  family: string;
  instructionId: string;
  status: string;
  chargeIds: string[];
  sourceKeys: string[];
  history: Array<{ reference: Reference; status: string; chargeIds: string[] }>;
};

// Explicit, chronological packet order. Do not scan arbitrary files or ingest
// attorney questions, rationale, decisions, prose, or private review materials.
export const findingPackets = [
  "violence-detention", "sexual-offenses", "registration-exploitation",
  "weapons-threats", "weapons-eligibility", "justice-custody",
  "vehicle-identification", "property-arson", "financial-tax", "public-order",
  "repeat-theft-assembly", "financial-identity", "officials-custody",
  "theft-animal", "trespass",
];

export function buildCloseoutInventory() {
  const bindings: Record<string, string> = {};
  const load = (name: string): Row => {
    const file = `california-${name}.json`;
    const text = fs.readFileSync(output + file, "utf8");
    bindings[file] = hash(text);
    return JSON.parse(text);
  };
  const comparisons = new Map<string, Comparison>();
  function apply(family: string, name: string, field: string, overlay = false) {
    const rows = load(name)[field] as Row[];
    const seen = new Set<string>();
    rows.forEach((row, index) => {
      const instructionId = String(row.instructionId ?? row.instruction ?? row.id);
      if (seen.has(instructionId)) throw new Error(`Duplicate instruction in ${name}`);
      seen.add(instructionId);
      const key = `${family}:${instructionId}`;
      const old = comparisons.get(key);
      if (overlay !== Boolean(old)) throw new Error(`Unexpected overlay identity: ${key}`);
      const chargeIds = row.chargeIds ?? row.boundedChargeIds ?? (row.chargeId ? [row.chargeId] : []);
      const reference = { file: `california-${name}.json`, field, index };
      comparisons.set(key, {
        family, instructionId, status: row.status, chargeIds,
        sourceKeys: row.sourceKeys ?? old?.sourceKeys ?? [],
        history: [...(old?.history ?? []), { reference, status: row.status, chargeIds }],
      });
    });
  }
  apply("people-weapons", "weapons-eligibility-review", "crosswalk");
  apply("people-weapons", "priority-person-review", "peopleWeaponsRows", true);
  apply("homicide-gangs", "priority-person-review", "benchmarkRows");
  apply("justice-property", "theft-animal-review", "crosswalk");
  // Only overlay older reconciliation rows still unmatched in the later packet.
  // The animal publication must not be replaced by its older unpublished status.
  const gap = load("gap-reconciliation");
  gap.rows.forEach((row: Row, index: number) => {
    const key = `justice-property:${row.instructionId}`;
    const current = comparisons.get(key);
    if (!current) throw new Error(`Missing prior justice comparison: ${key}`);
    if (current.chargeIds.length) return;
    current.status = row.status;
    current.chargeIds = row.chargeIds;
    current.history.push({ reference: { file: "california-gap-reconciliation.json", field: "rows", index }, status: row.status, chargeIds: row.chargeIds });
  });
  apply("justice-property", "theft-conduct-review", "dispositions", true);
  apply("drugs", "drug-successor-review", "crosswalk");
  apply("driving-vessels", "vehicle-identification-review", "crosswalk");

  // These are historical finding identities, not newly adjudicated open issues.
  // A later status is retained alongside the earlier status, never erased.
  const findings = new Map<string, {
    id: string; sourceKeys: string[];
    occurrences: Array<{ reference: Reference; status: string; chargeIds: string[] }>;
  }>();
  for (const packet of findingPackets) {
    const name = `${packet}-review`;
    const data = load(name);
    for (const field of ["remainingFindings", "remaining", "findingProgress", "supersededFindings"]) {
      (data[field] ?? []).forEach((row: Row, index: number) => {
        if (typeof row.id !== "string" || typeof row.status !== "string") {
          throw new Error(`Invalid finding identity in ${name}/${field}`);
        }
        const item = findings.get(row.id) ?? { id: row.id, sourceKeys: [], occurrences: [] };
        item.sourceKeys = [...new Set([...item.sourceKeys, ...(row.keys ?? [])])].sort();
        item.occurrences.push({
          reference: { file: `california-${name}.json`, field, index },
          status: row.status,
          chargeIds: row.chargeId ? [row.chargeId] : [],
        });
        findings.set(row.id, item);
      });
    }
  }
  // Explicit successor links, never inferred solely from a shared section number.
  // These avoid redoing published work while leaving residual scope unclosed.
  const successorPlan: Array<[string, string, string[]]> = [
    ["elder-financial-branches", "financial-identity-review", ["ca-pen-368-d-1", "ca-pen-368-d-2", "ca-pen-368-e-1", "ca-pen-368-e-2"]],
    ["custody-controlled-substances", "officials-custody-review", ["ca-pen-4573-6-a", "ca-pen-4573-a"]],
    ["custody-capital-and-gassing-branches", "officials-custody-review", ["ca-pen-4500", "ca-pen-243-9-a", "ca-pen-4501-1-a"]],
    ["justice-remaining-branches", "officials-custody-review", ["ca-pen-67-5-a", "ca-pen-67-5-b", "ca-pen-68-a", "ca-pen-86", "ca-pen-93-a", "ca-pen-76-a-1", "ca-pen-76-a-2"]],
    ["property-repeat-theft-and-vehicle-taking", "repeat-theft-assembly-review", ["ca-pen-666-a", "ca-pen-666-1-a-1", "ca-veh-10851-a"]],
    ["public-order-assembly-and-adjacent-branches", "repeat-theft-assembly-review", ["ca-pen-403", "ca-pen-404-6-a", "ca-pen-404-6-c", "ca-pen-405", "ca-pen-408", "ca-pen-409", "ca-pen-416-a"]],
    ["registration-special-duties", "registration-exploitation-review", ["ca-pen-290-b", "ca-pen-290-012-a", "ca-pen-290-011-a", "ca-pen-290-012-b"]],
    ["sexual-family-open-branches", "registration-exploitation-review", ["ca-pen-243-4-b", "ca-pen-243-4-c", "ca-pen-243-4-d", "ca-pen-288-3-a", "ca-pen-311-11-a-1"]],
    ["access-card-multiple-person-branch", "theft-animal-review", ["ca-pen-484e-b"]],
  ];
  const successorPublications = successorPlan.map(([findingId, name, ids]) => {
    if (!findings.has(findingId)) throw new Error(`Unknown successor finding: ${findingId}`);
    const data = load(name);
    return {
      findingId,
      status: "later_bounded_publication_present_residual_scope_not_closed",
      records: ids.map(id => {
        const index = data.records.findIndex((row: Row) => row.id === id);
        if (index < 0) throw new Error(`Unknown successor record: ${id}`);
        return { id, definitionSha256: data.records[index].definitionSha256,
          reference: { file: `california-${name}.json`, field: "records", index } };
      }),
    };
  });
  // Only a neutral publication marker is copied, never decision reasoning.
  const decisionFile = "shared/california-attorney-decisions.json";
  const decisionText = fs.readFileSync(decisionFile, "utf8");
  const publishedDecisions = JSON.parse(decisionText) as Row[];
  const resolvedIndex = publishedDecisions.findIndex(row => row.id === "ca-pen-237-a");
  if (resolvedIndex < 0) throw new Error("Missing published false-imprisonment successor");
  const recordedResolution = {
    findingId: "felony-false-imprisonment-fine",
    status: "published_decision_recorded_do_not_reopen",
    chargeId: "ca-pen-237-a", file: decisionFile, index: resolvedIndex,
    fileSha256: hash(decisionText),
  };
  const priority = load("priority-person-review");
  const snapshot = load("major-omission-catalog-snapshot");
  const additionalIds = priority.records.map((row: Row) => row.id);
  if (new Set(additionalIds).size !== additionalIds.length || additionalIds.some((id: string) => snapshot.records.some((row: Row) => row.canonicalId === id))) {
    throw new Error("Priority additions overlap historical catalog");
  }
  const rows = [...comparisons.values()];
  const statusCounts = (items: Array<{ status: string }>) =>
    Object.fromEntries([...new Set(items.map(row => row.status))].sort().map(status => [status, items.filter(row => row.status === status).length]));
  return {
    schemaVersion: 1,
    scope: "retained_packet_closeout_accounting_not_new_legal_review",
    baseline: {
      mergedPr: 57,
      configuredChoices: snapshot.configuredChoices + additionalIds.length,
      liveAvailability: "not_measured",
      statewideCompleteness: "not_claimed",
    },
    bindings,
    counts: {
      comparisonEntries: rows.length,
      byFamily: Object.fromEntries([...new Set(rows.map(row => row.family))].map(family => {
        const selected = rows.filter(row => row.family === family);
        return [family, { entries: selected.length, statuses: statusCounts(selected) }];
      })),
      historicalFindingIdentities: findings.size,
      otherCodeProbes: priority.otherCodeProbes.length,
      withheldCanonicalLabels: snapshot.records.filter((row: Row) => !row.selectable).length,
    },
    withheldCanonicalLabels: snapshot.records.filter((row: Row) => !row.selectable).map((row: Row) => ({
      id: row.canonicalId, lawCode: row.lawCode, code: row.code,
      status: "configured_identity_withheld_not_a_missing_offense_count",
    })),
    comparisons: rows,
    historicalFindings: [...findings.values()],
    successorPublications,
    recordedResolutions: [recordedResolution],
    otherCodeProbes: priority.otherCodeProbes.map((row: Row, index: number) => ({
      key: row.key, label: row.label, status: row.status, chargeIds: row.chargeIds,
      reference: { file: "california-priority-person-review.json", field: "otherCodeProbes", index },
    })),
    nextWork: [
      { id: "weapons-public-conduct", instructionIds: ["1153", "1161", "1162", "2501", "2502", "2530", "2560", "2561", "2915", "2916"], scope: "Compare the remaining specific branches, public-conduct gaps and existing-choice conduct once; preserve weapon-specific holds. Instruction entries are not a proposed charge count." },
      { id: "other-code", sourceKeys: priority.otherCodeProbes.filter((row: Row) => row.status === "unpublished_priority").map((row: Row) => row.key), scope: "One grouped review of seven retained candidate sections. Discovery evidence is not publication approval; unknown severity is not a minor omission." },
      { id: "successor-accounting", scope: "Check historical finding identities against later published batches and existing private decisions before assigning new research. Do not reopen resolved attorney decisions or silently mark broad families complete." },
      { id: "release-parity", scope: "Keep deployment, runtime receipt policy and live selection checks separate from this catalog inventory. No renewal, source activation or database work occurs here." },
    ],
    limits: [
      "Comparison entries overlap statutory sections and can describe theories, defenses or enhancements; they are not counts of missing charges.",
      "A bounded match is not exhaustive coverage of an instruction or statutory family.",
      "Historical finding identities may already have partial or complete successor work; no current unresolved count is inferred from their number.",
      "Previously documented minor deferrals and consequential holds remain distinct. No unknown-severity candidate is demoted to minor.",
      "This report projects only neutral status, identities and references. Attorney questions and deliberative prose are not copied.",
      "The first-pass inventory does not cover every ordinance, regulation or criminally enforceable statutory provision. No statewide percentage is available.",
    ],
  };
}

export type CloseoutInventory = ReturnType<typeof buildCloseoutInventory>;
export function validateCloseoutInventory(packet: CloseoutInventory) {
  if (JSON.stringify(packet) !== JSON.stringify(buildCloseoutInventory())) {
    throw new Error("Closeout inventory drift");
  }
  return packet.counts;
}
export function renderCloseoutInventory(packet = buildCloseoutInventory()) {
  validateCloseoutInventory(packet);
  const lines = [
    "# California first-pass closeout inventory", "",
    `Frozen PR 57 baseline: ${packet.baseline.configuredChoices} configured choices. Live availability is not measured.`, "",
    ...packet.limits.map(text => `- ${text}`), "",
    "## Retained comparison coverage", "",
    "| Family | Comparison entries |", "| --- | ---: |",
    ...Object.entries(packet.counts.byFamily).map(([family, count]) => `| ${family} | ${count.entries} |`), "",
    "## Next combined work", "",
    ...packet.nextWork.map(work => `- **${work.id}**: ${work.scope}`), "",
    "## Remaining priority probes", "",
    ...packet.comparisons.filter(row => ["unpublished_priority", "existing_choice_missing_sibling", "existing_choice_requires_conduct_comparison"].includes(row.status)).map(row => `- ${row.family}, instruction ${row.instructionId}: ${row.status}; existing choices: ${row.chargeIds.join(", ") || "none mapped"}.`),
    ...packet.otherCodeProbes.map(row => `- ${row.key}: ${row.label}; ${row.status}.`), "",
    "## Other retained partial or missing comparisons", "",
    ...packet.comparisons.filter(row => ["unpublished_branch", "unpublished_branch_requires_substantive_review", "benchmark_source_absent", "partial_catalog_match"].includes(row.status)).map(row => `- ${row.family}, instruction ${row.instructionId}: ${row.status}; no closure is inferred.`), "",
    "## Existing successor work: do not start again", "",
    ...packet.recordedResolutions.map(row => `- ${row.findingId}: published decision recorded; do not reopen (${row.chargeId}).`),
    ...packet.successorPublications.map(row => `- ${row.findingId}: later bounded publication for ${row.records.map(record => record.id).join(", ")}; residual scope stays open.`), "",
    "## Withheld canonical labels", "",
    "These configured identities remain withheld independently of runtime receipt expiry. They are not a count of missing statutory offenses.", "",
    ...packet.withheldCanonicalLabels.map(row => `- ${row.id}: ${row.lawCode} ${row.code}.`), "",
    "## Historical finding register", "",
    "These are successor-check tasks, not a new legal-review assignment. Status histories and exact packet references are in the companion JSON. Existing decisions remain controlling for their reviewed scope.", "",
    ...packet.historicalFindings.map(row => `- ${row.id}: ${row.sourceKeys.join(", ") || "see referenced packet"}; ${row.occurrences.length} retained status entries.`), "",
    "Reproduce offline: `node --import tsx scripts/data-review/california-verification/closeout-inventory.ts`.", "",
  ];
  return lines.join("\n").replace(/[\u2013\u2014]/g, ":");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const packet = buildCloseoutInventory();
  fs.writeFileSync(output + "california-closeout-inventory.json", JSON.stringify(packet, null, 2) + "\n");
  fs.writeFileSync(output + "california-closeout-inventory.md", renderCloseoutInventory(packet));
  console.log(JSON.stringify(packet.counts));
}
