import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import {
  buildFloridaReviewedSourceRecords,
  validateFloridaReviewedRefreshReceipt,
  type FloridaReviewedEligibility,
  type FloridaReviewedReceipt,
  type FloridaReviewedReport,
} from "../../server/data/florida-reviewed-source-records";

export type CoverageClassification =
  | "covered"
  | "partially_covered"
  | "not_yet_analyzed"
  | "blocked"
  | "not_standalone_offense";

type JsonObject = Record<string, any>;

export interface FloridaCoverageRow {
  rowKind: "section" | "scope";
  section: string;
  subdivision: string | null;
  citation: string;
  title: string | null;
  classification: CoverageClassification;
  classificationBasis: string;
  cacheStatus: "official_current_cache" | "not_cached" | "known_absent" | "historical_only";
  retrievedAt: string | null;
  contentHash: string | null;
  sourceUrl: string | null;
  selectableRecordIds: string[];
  analysisRecordIds: string[];
  analysisStatuses: string[];
  legacyCleanupQueueIds: string[];
  duplicateSameCitation: boolean;
  potentialScopeOverlap: boolean;
  priorityArea: boolean;
  actualOffenseCount: null;
}

export interface FloridaCoverageInventory {
  schemaVersion: 1;
  jurisdiction: "FL";
  inventoryAsOf: string | null;
  methodology: {
    unit: string;
    caveat: string;
    denominator: string;
    legacyCleanupQueue: string;
  };
  summary: {
    cachedOfficialSections: number;
    sectionRows: number;
    scopeRows: number;
    currentSelectableRecords: number;
    reviewedSelectableRecords: number;
    reviewedRuntimeStatus: "current" | "blocked";
    reviewedRuntimeBlockReason: string | null;
    legacySelectableRecords: number;
    legacyCleanupQueueRecords: number;
    distinctSelectableCitedScopes: number;
    actualOffenseCount: null;
    statewideSectionDenominator: null;
    completenessPercentage: null;
    classifications: Record<CoverageClassification, number>;
  };
  priorityAreas: string[];
  knownAbsences: Array<{
    section: string;
    cacheStatus: "known_absent" | "historical_only";
    basis: string;
  }>;
  inputs: Array<{ path: string; sha256: string }>;
  rows: FloridaCoverageRow[];
}

const PRIORITY_AREAS = ["784.045", "806.01", "812.014", "893.13", "893.147", "837.02"];
const KNOWN_ABSENCES = new Map<string, {
  cacheStatus: "known_absent" | "historical_only";
  basis: string;
}>([
  ["213.29", {
    cacheStatus: "known_absent",
    basis: "Explicit analyst hold: no current Florida Statutes 2026 document is in the reviewed cache.",
  }],
  ["386.04", {
    cacheStatus: "known_absent",
    basis: "The current manifest explicitly records that the Florida Legislature section could not be verified.",
  }],
  ["112.191", {
    cacheStatus: "historical_only",
    basis: "Explicit analyst note identifies the available firefighter provision as historical-only evidence.",
  }],
  ["381.986", {
    cacheStatus: "known_absent",
    basis: "Explicit current-cache inventory exception; no current official section body is available.",
  }],
]);

const sha256 = (value: string) =>
  createHash("sha256").update(value).digest("hex");

const readJson = (path: string): JsonObject => JSON.parse(readFileSync(path, "utf8"));

function packetEntries(packet: any): JsonObject[] {
  if (Array.isArray(packet)) return packet;
  if (!packet || typeof packet !== "object") return [];
  return ["entries", "records", "analysis"]
    .flatMap(key => Array.isArray(packet[key]) ? packet[key] : [])
    .concat(Array.isArray(packet.sectionNotes) ? packet.sectionNotes : []);
}

function sectionAndSubdivision(code: string): { section: string; subdivision: string | null } | null {
  const match = String(code).trim().match(/^(\d{3,4}\.\d{2,6})(.*)$/);
  if (!match) return null;
  return { section: match[1], subdivision: match[2].trim() || null };
}

function citation(section: string, subdivision: string | null): string {
  return `Fla. Stat. § ${section}${subdivision ?? ""}`;
}

function scopeKey(section: string, subdivision: string | null): string {
  return `${section}|${subdivision ?? ""}`;
}

function analysisClassification(
  entries: JsonObject[],
  currentReviewedIds: ReadonlySet<string>,
  reviewedRuntimeBlockReason: string | null,
): {
  classification: CoverageClassification;
  basis: string;
} {
  const eligible = entries.filter(entry => entry.status === "eligible");
  if (eligible.some(entry => currentReviewedIds.has(entry.id))) {
    return {
      classification: "covered",
      basis: "An explicit eligible analyst decision covers this cited scope; it does not establish unenumerated offenses.",
    };
  }
  if (eligible.length) {
    return {
      classification: "blocked",
      basis: reviewedRuntimeBlockReason
        ? `Explicit analysis is eligible, but the record is not a current runtime selection: ${reviewedRuntimeBlockReason}`
        : "Explicit analysis is eligible, but this exact record lacks current report, approval, and freshness validation.",
    };
  }
  if (entries.some(entry => entry.status === "held")) {
    return {
      classification: "blocked",
      basis: entries.find(entry => entry.status === "held")?.reason ||
        "An explicit analyst hold blocks this scope.",
    };
  }
  if (entries.some(entry => entry.status === "support_only")) {
    return {
      classification: "not_standalone_offense",
      basis: entries.find(entry => entry.status === "support_only")?.reason ||
        "Explicit analysis treats this provision as support rather than a standalone offense.",
    };
  }
  if (entries.some(entry => entry.status === "duplicate")) {
    return {
      classification: "partially_covered",
      basis: `${entries.find(entry => entry.status === "duplicate")?.reason ||
        "Explicit analysis identifies coverage in other records."} A duplicate disposition alone does not establish current coverage of this exact cited scope.`,
    };
  }
  return {
    classification: "not_yet_analyzed",
    basis: "No explicit analyst decision covers this scope.",
  };
}

function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join("|") : value == null ? "" : String(value);
  return `"${text.replace(/"/g, "\"\"")}"`;
}

export function buildFloridaCoverageInventory(
  root = process.cwd(),
  now = new Date(),
): FloridaCoverageInventory {
  const cachePath = resolve(root, "scripts/data-review/output/florida-batch-source-cache.json");
  const manifestPath = resolve(root, "scripts/data-review/output/fl-source-manifest.json");
  const eligibilityPath = resolve(root, "shared/florida-reviewed-eligibility.json");
  const reportPath = resolve(root, "scripts/data-review/output/florida-reviewed-analysis.json");
  const receiptPath = resolve(root, "scripts/data-review/output/florida-reviewed-refresh-receipt.json");
  const inputPaths = [cachePath, manifestPath, eligibilityPath];
  const definitionPaths: string[] = [];
  const analysisPaths: string[] = [];
  for (const part of ["a", "b", "c", "d", "e"]) {
    const definitionPath = resolve(root, `shared/florida-reviewed-data/${part}.json`);
    const analysisPath = resolve(root, `scripts/data-review/output/florida-reviewed-analysis-${part}.json`);
    if (existsSync(definitionPath)) definitionPaths.push(definitionPath);
    if (existsSync(analysisPath)) analysisPaths.push(analysisPath);
  }
  inputPaths.push(...definitionPaths, ...analysisPaths);
  for (const path of [cachePath, manifestPath, eligibilityPath]) {
    if (!existsSync(path)) throw new Error(`Required Florida coverage input is missing: ${path}`);
  }

  const cache = readJson(cachePath);
  const manifest = readJson(manifestPath);
  const eligibility = readJson(eligibilityPath);
  if (cache.schemaVersion !== 1 || cache.jurisdiction !== "FL" ||
      !cache.documents || Array.isArray(cache.documents)) {
    throw new Error("Florida official section cache has an invalid header");
  }
  if (manifest.jurisdiction !== "FL" || !Array.isArray(manifest.catalogRecords)) {
    throw new Error("Florida manifest has an invalid header");
  }
  if (!Array.isArray(eligibility.decisions)) {
    throw new Error("Florida eligibility ledger is invalid");
  }

  const definitions = definitionPaths.flatMap(path => {
    const value = readJson(path);
    return Array.isArray(value) ? value : [];
  });
  const analyses = analysisPaths.flatMap(path => packetEntries(readJson(path)));
  const definitionById = new Map(definitions.map((row: JsonObject) => [row.id, row]));
  let reviewedRuntimeBlockReason: string | null = null;
  let currentReviewedRecords: ReturnType<typeof buildFloridaReviewedSourceRecords> = [];
  if (!existsSync(reportPath)) {
    reviewedRuntimeBlockReason = "The assembled reviewed report is missing.";
  } else {
    inputPaths.push(reportPath);
    const report = readJson(reportPath) as FloridaReviewedReport;
    const records = buildFloridaReviewedSourceRecords(
      definitions,
      report,
      eligibility as FloridaReviewedEligibility,
    );
    if (!existsSync(receiptPath)) {
      reviewedRuntimeBlockReason = "The reviewed freshness receipt is missing.";
    } else {
      inputPaths.push(receiptPath);
      const receipt = readJson(receiptPath) as FloridaReviewedReceipt;
      reviewedRuntimeBlockReason = validateFloridaReviewedRefreshReceipt(
        receipt,
        report,
        eligibility as FloridaReviewedEligibility,
        records,
        now,
      );
      if (!reviewedRuntimeBlockReason) currentReviewedRecords = records;
    }
  }
  const currentReviewedIds = new Set(currentReviewedRecords.map(record => record.chargeId));
  const analysesByScope = new Map<string, JsonObject[]>();
  for (const entry of analyses) {
    const explicitScope = sectionAndSubdivision(entry.code ?? "");
    const definitionScope = sectionAndSubdivision(definitionById.get(entry.id)?.code ?? "");
    const resolvedScope = explicitScope ?? definitionScope;
    const section = resolvedScope?.section ?? String(entry.section ?? "");
    if (!section) continue;
    if (resolvedScope && entry.section && resolvedScope.section !== entry.section) {
      throw new Error(`Florida analysis code crosses its declared section: ${entry.id}`);
    }
    const subdivision = resolvedScope?.subdivision ?? null;
    const key = scopeKey(section, subdivision);
    analysesByScope.set(key, [...(analysesByScope.get(key) ?? []), entry]);
  }

  const selectableByScope = new Map<string, string[]>();
  const cleanupByScope = new Map<string, string[]>();
  for (const record of manifest.catalogRecords as JsonObject[]) {
    const parsed = sectionAndSubdivision(record.catalogCode ?? "");
    if (!parsed) continue;
    const key = scopeKey(parsed.section, parsed.subdivision);
    if (record.disposition === "retain" || record.disposition === "exact_alias_rename") {
      selectableByScope.set(key, [...(selectableByScope.get(key) ?? []), record.chargeId]);
    } else {
      cleanupByScope.set(key, [...(cleanupByScope.get(key) ?? []), record.chargeId]);
    }
  }
  for (const record of currentReviewedRecords) {
    const parsed = sectionAndSubdivision(record.code);
    if (!parsed) continue;
    const key = scopeKey(parsed.section, parsed.subdivision);
    selectableByScope.set(key, [...(selectableByScope.get(key) ?? []), record.chargeId]);
  }

  const allSections = new Set([
    ...Object.keys(cache.documents),
    ...KNOWN_ABSENCES.keys(),
    ...[...analysesByScope.keys()].map(key => key.split("|")[0]),
    ...[...selectableByScope.keys()].map(key => key.split("|")[0]),
    ...[...cleanupByScope.keys()].map(key => key.split("|")[0]),
  ]);
  const rows: FloridaCoverageRow[] = [];

  for (const section of [...allSections].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }))) {
    const document = cache.documents[section] as JsonObject | undefined;
    const absent = KNOWN_ABSENCES.get(section);
    const sectionAnalyses = [...analysesByScope.entries()]
      .filter(([key]) => key.startsWith(`${section}|`))
      .flatMap(([, entries]) => entries);
    const sectionSelectable = [...selectableByScope.entries()]
      .filter(([key]) => key.startsWith(`${section}|`))
      .flatMap(([, ids]) => ids);
    const sectionCleanup = [...cleanupByScope.entries()]
      .filter(([key]) => key.startsWith(`${section}|`))
      .flatMap(([, ids]) => ids);
    const hasCurrentReviewed = sectionAnalyses.some(entry =>
      entry.status === "eligible" && currentReviewedIds.has(entry.id));
    const hasDecision = sectionAnalyses.length > 0;
    const onlySupport = hasDecision && sectionAnalyses.every(entry =>
      entry.status === "support_only");
    const blockedOnly = hasDecision && sectionAnalyses.every(entry => entry.status === "held");
    let classification: CoverageClassification = "not_yet_analyzed";
    let basis = "Official text is cached, but no explicit analysis establishes offense coverage.";
    if (absent) {
      classification = "blocked";
      basis = absent.basis;
    } else if (onlySupport) {
      classification = "not_standalone_offense";
      basis = "All explicit section-level decisions classify this section as support-only.";
    } else if (hasCurrentReviewed || sectionSelectable.length || hasDecision) {
      classification = blockedOnly && !sectionSelectable.length
        ? "blocked"
        : "partially_covered";
      basis = sectionSelectable.length
        ? "One or more cited scopes map to selectable records; no statewide offense denominator or complete branch analysis proves the entire section covered."
        : "The section has analysis decisions, but no scope in this section is a current runtime selection.";
    }
    rows.push({
      rowKind: "section",
      section,
      subdivision: null,
      citation: citation(section, null),
      title: document?.title ?? null,
      classification,
      classificationBasis: basis,
      cacheStatus: absent?.cacheStatus ?? (document ? "official_current_cache" : "not_cached"),
      retrievedAt: document?.retrievedAt ?? null,
      contentHash: document?.contentHash ?? null,
      sourceUrl: document?.sourceUrl ?? null,
      selectableRecordIds: [...new Set(sectionSelectable)].sort(),
      analysisRecordIds: [...new Set(sectionAnalyses.map(entry => entry.id))].sort(),
      analysisStatuses: [...new Set(sectionAnalyses.map(entry => entry.status))].sort(),
      legacyCleanupQueueIds: [...new Set(sectionCleanup)].sort(),
      duplicateSameCitation: false,
      potentialScopeOverlap: false,
      priorityArea: PRIORITY_AREAS.includes(section),
      actualOffenseCount: null,
    });

    const scopeKeys = new Set([
      ...[...analysesByScope.keys()].filter(key => key.startsWith(`${section}|`)),
      ...[...selectableByScope.keys()].filter(key => key.startsWith(`${section}|`)),
      ...[...cleanupByScope.keys()].filter(key => key.startsWith(`${section}|`)),
    ]);
    for (const key of [...scopeKeys].sort()) {
      const subdivision = key.slice(key.indexOf("|") + 1) || null;
      const scopeAnalyses = analysesByScope.get(key) ?? [];
      const selectable = [...new Set(selectableByScope.get(key) ?? [])].sort();
      const cleanup = [...new Set(cleanupByScope.get(key) ?? [])].sort();
      const analyzed = analysisClassification(
        scopeAnalyses,
        currentReviewedIds,
        reviewedRuntimeBlockReason,
      );
      const classification = absent
        ? "blocked"
        : scopeAnalyses.length
          ? analyzed.classification
          : selectable.length
            ? "covered"
            : "not_yet_analyzed";
      const classificationBasis = absent?.basis ??
        (scopeAnalyses.length
          ? analyzed.basis
          : selectable.length
            ? "The current legacy manifest explicitly retains this exact cited scope; no broader section completeness is inferred."
            : "This legacy cleanup item has no explicit offense analysis and is not counted as a missing offense.");
      const duplicateSameCitation = selectable.length > 1 ||
        scopeAnalyses.some(entry => entry.status === "duplicate");
      const potentialScopeOverlap = !duplicateSameCitation &&
        selectable.length > 0 && cleanup.length > 0;
      rows.push({
        rowKind: "scope",
        section,
        subdivision,
        citation: citation(section, subdivision),
        title: document?.title ?? null,
        classification,
        classificationBasis,
        cacheStatus: absent?.cacheStatus ?? (document ? "official_current_cache" : "not_cached"),
        retrievedAt: document?.retrievedAt ?? null,
        contentHash: document?.contentHash ?? null,
        sourceUrl: document?.sourceUrl ?? null,
        selectableRecordIds: selectable,
        analysisRecordIds: [...new Set(scopeAnalyses.map(entry => entry.id))].sort(),
        analysisStatuses: [...new Set(scopeAnalyses.map(entry => entry.status))].sort(),
        legacyCleanupQueueIds: cleanup,
        duplicateSameCitation,
        potentialScopeOverlap,
        priorityArea: PRIORITY_AREAS.includes(section),
        actualOffenseCount: null,
      });
    }
  }

  const eligibleReviewed = currentReviewedRecords.length;
  const legacySelectable = manifest.catalogRecords.filter((row: JsonObject) =>
    row.disposition === "retain" || row.disposition === "exact_alias_rename").length;
  const cleanupCount = manifest.catalogRecords.length - legacySelectable;
  const classificationCounts = Object.fromEntries(
    ["covered", "partially_covered", "not_yet_analyzed", "blocked", "not_standalone_offense"]
      .map(status => [status, rows.filter(row => row.classification === status).length]),
  ) as Record<CoverageClassification, number>;
  const timestamps = Object.values(cache.documents)
    .map((document: any) => document.retrievedAt)
    .filter((value): value is string => typeof value === "string" && Number.isFinite(Date.parse(value)));

  return {
    schemaVersion: 1,
    jurisdiction: "FL",
    inventoryAsOf: timestamps.sort().at(-1) ?? null,
    methodology: {
      unit: "One section row plus cited subdivision/scope rows supported by manifest or explicit analyst records.",
      caveat: "This is an evidence and workflow inventory, not a keyword-derived list of Florida crimes. A published whole-section record does not prove every offense or branch in that section is covered.",
      denominator: "The cache is the current reviewed working set. The statewide section denominator and actual number of offenses are unknown, so no completeness percentage is reported.",
      legacyCleanupQueue: "require_exact_reselection/remove rows are reported separately as cleanup work and are not treated as a missing-offense count.",
    },
    summary: {
      cachedOfficialSections: Object.keys(cache.documents).length,
      sectionRows: rows.filter(row => row.rowKind === "section").length,
      scopeRows: rows.filter(row => row.rowKind === "scope").length,
      currentSelectableRecords: eligibleReviewed + legacySelectable,
      reviewedSelectableRecords: eligibleReviewed,
      reviewedRuntimeStatus: reviewedRuntimeBlockReason ? "blocked" : "current",
      reviewedRuntimeBlockReason,
      legacySelectableRecords: legacySelectable,
      legacyCleanupQueueRecords: cleanupCount,
      distinctSelectableCitedScopes: selectableByScope.size,
      actualOffenseCount: null,
      statewideSectionDenominator: null,
      completenessPercentage: null,
      classifications: classificationCounts,
    },
    priorityAreas: PRIORITY_AREAS,
    knownAbsences: [...KNOWN_ABSENCES].map(([section, value]) => ({ section, ...value })),
    inputs: inputPaths.map(path => ({
      path: path.slice(root.length + 1),
      sha256: sha256(readFileSync(path, "utf8")),
    })),
    rows,
  };
}

export function renderFloridaCoverageCsv(inventory: FloridaCoverageInventory): string {
  const keys: Array<keyof FloridaCoverageRow> = [
    "rowKind", "section", "subdivision", "citation", "title", "classification",
    "classificationBasis", "cacheStatus", "retrievedAt", "contentHash", "sourceUrl",
    "selectableRecordIds", "analysisRecordIds", "analysisStatuses",
    "legacyCleanupQueueIds", "duplicateSameCitation", "potentialScopeOverlap",
    "priorityArea", "actualOffenseCount",
  ];
  return [
    keys.map(csvCell).join(","),
    ...inventory.rows.map(row => keys.map(key => csvCell(row[key])).join(",")),
  ].join("\n") + "\n";
}

export function renderFloridaCoverageMarkdown(inventory: FloridaCoverageInventory): string {
  const priorityRows = inventory.rows.filter(row => row.priorityArea);
  return `# Florida coverage inventory

Inventory evidence as of: ${inventory.inventoryAsOf ?? "unknown"}

This is a technical evidence/workflow inventory, not a representation of all Florida criminal offenses. The statewide denominator and actual offense count are unknown; no completeness percentage is calculated. Cached, unreviewed sections are **not yet analyzed**. Legacy cleanup holds are not counted as missing offenses.

## Counts

| Measure | Count |
|---|---:|
| Cached official sections | ${inventory.summary.cachedOfficialSections} |
| Current selectable records | ${inventory.summary.currentSelectableRecords} |
| Reviewed selectable records | ${inventory.summary.reviewedSelectableRecords} |
| Legacy selectable records | ${inventory.summary.legacySelectableRecords} |
| Legacy cleanup queue | ${inventory.summary.legacyCleanupQueueRecords} |
| Distinct selectable cited scopes | ${inventory.summary.distinctSelectableCitedScopes} |
| Actual offense count | unknown |
| Statewide section denominator | unknown |

## Six priority areas and their explicit variants

| Citation | Kind | Classification | Selectable records | Analysis status | Remaining-branch note |
|---|---|---|---|---|---|
${priorityRows.map(row => `| ${row.citation} | ${row.rowKind} | ${row.classification} | ${row.selectableRecordIds.join(", ") || "—"} | ${row.analysisStatuses.join(", ") || "—"} | ${row.classificationBasis.replace(/\|/g, "\\|")} |`).join("\n")}

## Known absences

${inventory.knownAbsences.map(row => `- **§ ${row.section}** (${row.cacheStatus}): ${row.basis}`).join("\n")}

## Machine-readable detail

The JSON and CSV beside this report contain all ${inventory.summary.sectionRows} section rows and ${inventory.summary.scopeRows} cited-scope rows, including original retrieval timestamps and content hashes. A duplicate-citation flag is informational only: it does not merge, alias, or delete records (including the legacy/new § 831.01 forgery records).
`;
}

export function renderFloridaCoverageHtml(inventory: FloridaCoverageInventory): string {
  const priorityRows = inventory.rows.filter(row => row.priorityArea);
  const escape = (value: unknown) => String(value ?? "").replace(/[&<>"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;",
  })[character]!);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Florida coverage inventory</title><style>
body{font:15px/1.45 system-ui,sans-serif;color:#18212b;max-width:1200px;margin:2rem auto;padding:0 1rem}
h1,h2{color:#123b59} .notice{background:#fff7d6;border-left:5px solid #bd7b00;padding:1rem}
.cards{display:flex;gap:1rem;flex-wrap:wrap}.card{border:1px solid #ccd6df;border-radius:8px;padding:.8rem;min-width:150px}
.n{font-size:1.6rem;font-weight:700}table{border-collapse:collapse;width:100%;font-size:.88rem}
th,td{border:1px solid #ccd6df;padding:.45rem;text-align:left;vertical-align:top}th{background:#edf4f8}
.blocked{color:#8a1c1c}.covered{color:#17612d}code{white-space:nowrap}</style></head><body>
<h1>Florida coverage inventory</h1><p>Evidence as of ${escape(inventory.inventoryAsOf ?? "unknown")}</p>
<div class="notice"><strong>Scope warning.</strong> This is an evidence/workflow inventory, not a complete list of Florida crimes. Actual offense count and the statewide section denominator are unknown. No completeness percentage is reported.</div>
<h2>Counts</h2><div class="cards">
<div class="card"><div class="n">${inventory.summary.cachedOfficialSections}</div>cached official sections</div>
<div class="card"><div class="n">${inventory.summary.currentSelectableRecords}</div>current selectable records</div>
<div class="card"><div class="n">${inventory.summary.distinctSelectableCitedScopes}</div>selectable cited scopes</div>
<div class="card"><div class="n">${inventory.summary.legacyCleanupQueueRecords}</div>legacy cleanup items</div></div>
<h2>Priority areas and variants</h2><table><thead><tr><th>Citation</th><th>Kind</th><th>Status</th><th>Selectable records</th><th>Analysis</th><th>Evidence-limited conclusion</th></tr></thead><tbody>
${priorityRows.map(row => `<tr><td><code>${escape(row.citation)}</code></td><td>${row.rowKind}</td><td class="${row.classification}">${row.classification}</td><td>${escape(row.selectableRecordIds.join(", ") || "—")}</td><td>${escape(row.analysisStatuses.join(", ") || "—")}</td><td>${escape(row.classificationBasis)}</td></tr>`).join("")}
</tbody></table><h2>Known absences</h2><ul>${inventory.knownAbsences.map(row =>
    `<li><strong>§ ${escape(row.section)}</strong> (${row.cacheStatus}): ${escape(row.basis)}</li>`).join("")}</ul>
<p>See the accompanying JSON and CSV for all rows and original hash/retrieval provenance. Duplicate flags never perform an automatic merge or alias.</p></body></html>`;
}

export function writeFloridaCoverageInventory(root = process.cwd()): FloridaCoverageInventory {
  const inventory = buildFloridaCoverageInventory(root);
  const outputDir = resolve(root, "scripts/data-review/output");
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(resolve(outputDir, "florida-coverage-inventory.json"),
    `${JSON.stringify(inventory, null, 2)}\n`);
  writeFileSync(resolve(outputDir, "florida-coverage-inventory.csv"),
    renderFloridaCoverageCsv(inventory));
  writeFileSync(resolve(outputDir, "florida-coverage-inventory.md"),
    renderFloridaCoverageMarkdown(inventory));
  writeFileSync(resolve(outputDir, "florida-coverage-inventory.html"),
    renderFloridaCoverageHtml(inventory));
  return inventory;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const inventory = writeFloridaCoverageInventory();
  console.log(
    `Wrote Florida coverage inventory: ${inventory.summary.cachedOfficialSections} cached sections, ` +
    `${inventory.summary.currentSelectableRecords} selectable records, no completeness percentage`,
  );
}