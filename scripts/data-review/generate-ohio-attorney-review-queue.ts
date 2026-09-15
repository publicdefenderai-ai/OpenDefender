/**
 * Build a focused Ohio attorney-review queue from the machine-validated
 * manifest. This does not publish or remove anything. It groups rows that
 * share a citation and exposes only the facts an attorney needs to decide
 * whether the catalog identity is correct.
 */
import fs from "node:fs";
import path from "node:path";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  buildOhioSourceUrl,
  parseOhioCitation,
} from "../../server/data/ohio-source-database-seed";
import type { AuthorityCatalogRecord } from "../../server/services/authority-source-database";

export const OHIO_REVIEW_DECISION_OPTIONS = [
  "publish",
  "correct",
  "split",
  "reclassify",
  "deduplicate",
  "hold",
  "remove",
  "other",
] as const;

export type OhioReviewDecision = typeof OHIO_REVIEW_DECISION_OPTIONS[number];

export interface OhioAttorneyReviewQueueRow {
  chargeId: string;
  catalogLabel: string;
  catalogCode: string;
  citation: string;
  officialSourceUrl: string | null;
  officialTitle: string | null;
  currentDisposition: AuthorityCatalogRecord["disposition"];
  currentDispositionReason: string;
  mappingClassification: string;
  reviewFocus:
    | "shared-citation-cluster"
    | "official-title-mismatch"
    | "citation-identity-mismatch"
    | "source-or-text-gap"
    | "other";
  relatedChargeIds: string[];
  possibleDuplicate: boolean;
  reviewQuestion: string;
  recommendedAction:
    | "deduplicate-or-split"
    | "correct-or-reclassify"
    | "correct-or-hold"
    | "hold-or-remove"
    | "other";
  approvedDisplayName: "";
  correctedCitation: "";
  correctedSubdivision: "";
  canonicalChargeId: "";
  decision: "";
  otherDetails: "";
  note: "";
}

export interface OhioAttorneyReviewQueue {
  jurisdiction: "OH";
  generatedAt: string;
  source: "Ohio Laws: codes.ohio.gov";
  decisionOptions: readonly OhioReviewDecision[];
  rows: OhioAttorneyReviewQueueRow[];
}

type QueueManifest = {
  jurisdiction: "OH";
  generatedAt: string;
  source: "Ohio Laws: codes.ohio.gov";
  catalogRecords: AuthorityCatalogRecord[];
};

function classifyFocus(
  record: AuthorityCatalogRecord,
  possibleDuplicate: boolean,
): OhioAttorneyReviewQueueRow["reviewFocus"] {
  if (possibleDuplicate) return "shared-citation-cluster";
  if (record.dispositionReason.includes("official Ohio title")) {
    return "official-title-mismatch";
  }
  if (record.dispositionReason.includes("catalog code")) {
    return "citation-identity-mismatch";
  }
  if (
    record.apiStatus === "api_error" ||
    record.apiStatus === "placeholder" ||
    record.dispositionReason.includes("section") ||
    record.dispositionReason.includes("subdivision")
  ) {
    return "source-or-text-gap";
  }
  return "other";
}

function reviewQuestion(
  focus: OhioAttorneyReviewQueueRow["reviewFocus"],
): string {
  switch (focus) {
    case "shared-citation-cluster":
      return "Are these distinct Ohio offenses/subsections, or should one row be the canonical catalog entry?";
    case "official-title-mismatch":
      return "Does the official Ohio title cover this catalog offense, or should the row be renamed or reclassified?";
    case "citation-identity-mismatch":
      return "What exact Ohio Revised Code section and subsection supports this row, if any?";
    case "source-or-text-gap":
      return "Can the exact current official provision be identified, or should this row remain held or removed?";
    default:
      return "What legal outcome best describes this row?";
  }
}

function recommendedAction(
  focus: OhioAttorneyReviewQueueRow["reviewFocus"],
): OhioAttorneyReviewQueueRow["recommendedAction"] {
  switch (focus) {
    case "shared-citation-cluster":
      return "deduplicate-or-split";
    case "official-title-mismatch":
      return "correct-or-reclassify";
    case "citation-identity-mismatch":
      return "correct-or-hold";
    case "source-or-text-gap":
      return "hold-or-remove";
    default:
      return "other";
  }
}

function csvCell(value: string | null): string {
  return `"${(value ?? "").replace(/"/g, "\"\"")}"`;
}

export function buildOhioAttorneyReviewQueue(
  manifest: QueueManifest,
): OhioAttorneyReviewQueue {
  const withheld = manifest.catalogRecords.filter((record) =>
    record.disposition === "require_exact_reselection" &&
    (!record.mapping || [
      "semantic_conflict",
      "shared_citation",
    ].includes(record.mapping.classification)),
  );
  const byCitation = new Map<string, string[]>();
  for (const record of manifest.catalogRecords) {
    const references = parseOhioCitation(CHARGE_CITATIONS[record.chargeId]?.citation ?? "");
    const key = references.length === 1
      ? `${references[0].section}:${references[0].subdivision ?? ""}`
      : `catalog:${record.catalogCode}`;
    const group = byCitation.get(key) ?? [];
    group.push(record.chargeId);
    byCitation.set(key, group);
  }

  const rows = withheld.map((record): OhioAttorneyReviewQueueRow => {
    const references = parseOhioCitation(CHARGE_CITATIONS[record.chargeId]?.citation ?? "");
    const key = references.length === 1
      ? `${references[0].section}:${references[0].subdivision ?? ""}`
      : `catalog:${record.catalogCode}`;
    const relatedChargeIds = (byCitation.get(key) ?? [])
      .filter((chargeId) => chargeId !== record.chargeId)
      .sort();
    const possibleDuplicate = relatedChargeIds.length > 0;
    const focus = classifyFocus(record, possibleDuplicate);
    return {
      chargeId: record.chargeId,
      catalogLabel: record.catalogLabel,
      catalogCode: record.catalogCode,
      citation: CHARGE_CITATIONS[record.chargeId]?.citation ?? "",
      officialSourceUrl: references[0]
        ? buildOhioSourceUrl(references[0].section)
        : null,
      officialTitle: record.canonicalTitle,
      currentDisposition: record.disposition,
      currentDispositionReason: record.dispositionReason,
      mappingClassification: record.mapping?.classification ?? "legacy_unclassified",
      reviewFocus: focus,
      relatedChargeIds,
      possibleDuplicate,
      reviewQuestion: reviewQuestion(focus),
      recommendedAction: recommendedAction(focus),
      approvedDisplayName: "",
      correctedCitation: "",
      correctedSubdivision: "",
      canonicalChargeId: "",
      decision: "",
      otherDetails: "",
      note: "",
    };
  });

  return {
    jurisdiction: "OH",
    generatedAt: manifest.generatedAt,
    source: manifest.source,
    decisionOptions: OHIO_REVIEW_DECISION_OPTIONS,
    rows,
  };
}

export function writeOhioAttorneyReviewQueue(
  queue: OhioAttorneyReviewQueue,
  outputDirectory: string,
): void {
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(outputDirectory, "ohio-attorney-review-queue.json"),
    JSON.stringify(queue, null, 2) + "\n",
  );
  const headers = [
    "chargeId",
    "catalogLabel",
    "catalogCode",
    "citation",
    "officialSourceUrl",
    "officialTitle",
    "reviewFocus",
    "relatedChargeIds",
    "possibleDuplicate",
    "reviewQuestion",
    "recommendedAction",
    "approvedDisplayName",
    "correctedCitation",
    "correctedSubdivision",
    "canonicalChargeId",
    "decision",
    "otherDetails",
    "note",
    "mappingClassification",
    "currentDispositionReason",
  ];
  const lines = [
    headers.map(csvCell).join(","),
    ...queue.rows.map((row) => [
      row.chargeId,
      row.catalogLabel,
      row.catalogCode,
      row.citation,
      row.officialSourceUrl,
      row.officialTitle,
      row.reviewFocus,
      row.relatedChargeIds.join(";"),
      String(row.possibleDuplicate),
      row.reviewQuestion,
      row.recommendedAction,
      row.approvedDisplayName,
      row.correctedCitation,
      row.correctedSubdivision,
      row.canonicalChargeId,
      row.decision,
      row.otherDetails,
      row.note,
      row.mappingClassification,
      row.currentDispositionReason,
    ].map(csvCell).join(",")),
  ];
  fs.writeFileSync(
    path.join(outputDirectory, "ohio-attorney-review-queue.csv"),
    lines.join("\n") + "\n",
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const manifestPath = path.resolve(
    process.cwd(),
    "scripts/data-review/output/oh-source-manifest.json",
  );
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as QueueManifest;
  const outputDirectory = path.dirname(manifestPath);
  const queue = buildOhioAttorneyReviewQueue(manifest);
  writeOhioAttorneyReviewQueue(queue, outputDirectory);
  console.log(JSON.stringify({
    jurisdiction: queue.jurisdiction,
    queuedRows: queue.rows.length,
    sharedCitationClusters: queue.rows.filter((row) => row.possibleDuplicate).length,
    decisionOptions: queue.decisionOptions,
    outputDirectory,
  }, null, 2));
}