/**
 * Build an Illinois attorney-review queue from the committed, machine-
 * validated manifest. Only evidence-backed semantic conflicts and shared
 * citation clusters are included. This file never changes publication status.
 */
import fs from "node:fs";
import path from "node:path";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import type { AuthorityEvidenceRecord } from "../../server/services/authority-offense-evidence";
import type { AuthorityCatalogRecord } from "../../server/services/authority-source-database";

export const ILLINOIS_REVIEW_DECISION_OPTIONS = [
  "publish",
  "correct",
  "split",
  "reclassify",
  "deduplicate",
  "hold",
  "remove",
  "other",
] as const;

export type IllinoisReviewDecision =
  typeof ILLINOIS_REVIEW_DECISION_OPTIONS[number];

export interface IllinoisAttorneyReviewQueueRow {
  chargeId: string;
  catalogLabel: string;
  catalogCode: string;
  citation: string;
  officialSourceUrl: string | null;
  officialTitle: string | null;
  currentDisposition: AuthorityCatalogRecord["disposition"];
  currentDispositionReason: string;
  mappingClassification: string;
  mappingConfidence: string | null;
  mappingRationale: string | null;
  evidence: AuthorityEvidenceRecord[];
  reviewFocus: "shared-citation-cluster" | "official-title-mismatch";
  relatedChargeIds: string[];
  possibleDuplicate: boolean;
  reviewQuestion: string;
  recommendedAction: "deduplicate-or-split" | "correct-or-reclassify";
  approvedDisplayName: "";
  correctedCitation: "";
  correctedSubdivision: "";
  canonicalChargeId: "";
  decision: "";
  otherDetails: "";
  note: "";
}

export interface IllinoisAttorneyReviewQueue {
  jurisdiction: "IL";
  generatedAt: string;
  source: string;
  decisionOptions: readonly IllinoisReviewDecision[];
  rows: IllinoisAttorneyReviewQueueRow[];
}

type QueueManifest = {
  jurisdiction: "IL";
  generatedAt: string;
  source: string;
  catalogRecords: AuthorityCatalogRecord[];
};

function csvCell(value: string | null): string {
  return `"${(value ?? "").replace(/"/g, "\"\"")}"`;
}

function citationFor(record: AuthorityCatalogRecord): string {
  return CHARGE_CITATIONS[record.chargeId]?.citation ??
    record.mapping?.candidateCitations[0] ??
    "";
}

function evidenceFor(record: AuthorityCatalogRecord): AuthorityEvidenceRecord[] {
  return record.mapping?.candidateEvidence ?? [];
}

function reviewQuestion(
  focus: IllinoisAttorneyReviewQueueRow["reviewFocus"],
): string {
  return focus === "shared-citation-cluster"
    ? "Are these distinct Illinois offenses/subsections, or should one row be the canonical catalog entry?"
    : "Does the official Illinois title and quoted offense text cover this catalog offense, or should the row be renamed or reclassified?";
}

export function buildIllinoisAttorneyReviewQueue(
  manifest: QueueManifest,
): IllinoisAttorneyReviewQueue {
  const candidates = manifest.catalogRecords.filter((record) =>
    record.disposition === "require_exact_reselection" &&
    (record.mapping?.classification === "semantic_conflict" ||
      record.mapping?.classification === "shared_citation"),
  );
  const byCitation = new Map<string, string[]>();
  for (const record of manifest.catalogRecords) {
    for (const citation of record.mapping?.candidateCitations ?? []) {
      const group = byCitation.get(citation) ?? [];
      group.push(record.chargeId);
      byCitation.set(citation, group);
    }
  }

  const rows = candidates.map((record): IllinoisAttorneyReviewQueueRow => {
    const evidence = evidenceFor(record);
    const citations = record.mapping?.candidateCitations ?? [];
    const relatedChargeIds = [...new Set(citations.flatMap((citation) =>
      (byCitation.get(citation) ?? []).filter((chargeId) => chargeId !== record.chargeId),
    ))].sort();
    const possibleDuplicate = relatedChargeIds.length > 0 ||
      record.mapping?.classification === "shared_citation";
    const reviewFocus = possibleDuplicate
      ? "shared-citation-cluster"
      : "official-title-mismatch";
    return {
      chargeId: record.chargeId,
      catalogLabel: record.catalogLabel,
      catalogCode: record.catalogCode,
      citation: citationFor(record),
      officialSourceUrl: evidence[0]?.sectionIdentity.sourceUrl ?? null,
      officialTitle: evidence[0]?.officialTitle ?? record.canonicalTitle,
      currentDisposition: record.disposition,
      currentDispositionReason: record.dispositionReason,
      mappingClassification: record.mapping?.classification ?? "legacy_unclassified",
      mappingConfidence: record.mapping?.confidence ?? null,
      mappingRationale: record.mapping?.rationale ?? null,
      evidence,
      reviewFocus,
      relatedChargeIds,
      possibleDuplicate,
      reviewQuestion: reviewQuestion(reviewFocus),
      recommendedAction: reviewFocus === "shared-citation-cluster"
        ? "deduplicate-or-split"
        : "correct-or-reclassify",
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
    jurisdiction: "IL",
    generatedAt: manifest.generatedAt,
    source: manifest.source,
    decisionOptions: ILLINOIS_REVIEW_DECISION_OPTIONS,
    rows,
  };
}

export function writeIllinoisAttorneyReviewQueue(
  queue: IllinoisAttorneyReviewQueue,
  outputDirectory: string,
): void {
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(outputDirectory, "illinois-attorney-review-queue.json"),
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
    "mappingConfidence",
    "mappingRationale",
    "evidenceSection",
    "evidenceSubdivision",
    "evidenceCurrentness",
    "evidenceGrading",
    "evidencePenalty",
    "evidenceQuotedSpans",
    "evidenceSourceHash",
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
      row.mappingConfidence,
      row.mappingRationale,
      row.evidence.map((item) => item.sectionIdentity.section).join(";"),
      row.evidence.map((item) => item.sectionIdentity.subdivision ?? "").join(";"),
      row.evidence.map((item) => [
        item.currentness.effectiveDateStart
          ? `effective ${item.currentness.effectiveDateStart}`
          : "",
        item.currentness.sourceEvidence ?? "",
      ].filter(Boolean).join(" | ")).join(";"),
      row.evidence.map((item) => item.gradingLanguage ?? "").join(";"),
      row.evidence.map((item) => item.penaltyLanguage ?? "").join(";"),
      row.evidence.map((item) => item.evidenceSpans
        .map((span) => `${span.kind}: ${span.quote}`)
        .join(" | ")).join(";"),
      row.evidence.map((item) => item.sourceHash).join(";"),
      row.currentDispositionReason,
    ].map((value) => csvCell(value)).join(",")),
  ];
  fs.writeFileSync(
    path.join(outputDirectory, "illinois-attorney-review-queue.csv"),
    lines.join("\n") + "\n",
  );
}

if (process.argv[1] &&
    path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const manifestPath = path.resolve(
    process.cwd(),
    "scripts/data-review/output/il-source-manifest.json",
  );
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as QueueManifest;
  const queue = buildIllinoisAttorneyReviewQueue(manifest);
  writeIllinoisAttorneyReviewQueue(queue, path.dirname(manifestPath));
  console.log(JSON.stringify({
    jurisdiction: queue.jurisdiction,
    queuedRows: queue.rows.length,
    sharedCitationClusters: queue.rows.filter((row) => row.possibleDuplicate).length,
    decisionOptions: queue.decisionOptions,
  }, null, 2));
}