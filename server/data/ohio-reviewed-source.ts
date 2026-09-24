import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { OHIO_REVIEWED_DEFINITIONS } from "@shared/ohio-reviewed-batch";
import sourceChangeHolds from "@shared/ohio-source-change-holds.json";
import updates from "@shared/ohio-common-charge-updates.json";
import originalCommonDefinitions from "@shared/ohio-reviewed-data/c.json";
import eligibility from "@shared/ohio-reviewed-eligibility.json";

export const OHIO_REVIEWED_REPORT_PATH = resolve(
  process.cwd(), "scripts/data-review/output/ohio-substantive-review.json",
);
export const OHIO_REVIEWED_RECEIPT_PATH = resolve(
  process.cwd(), "scripts/data-review/output/ohio-reviewed-refresh-receipt.json",
);
export const OHIO_REVIEWED_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type EvidenceSpan = {
  text: string; start: number; end: number; sourceHash: string; section: string;
};
export interface OhioReviewedDocument {
  section: string;
  title: string;
  sourceUrl: string;
  text: string;
  contentHash: string;
  retrievedAt: string;
  effectiveDateStart: string;
}
export interface OhioReviewedSource {
  chargeId: string;
  canonicalTitle: string;
  section: string;
  conduct: string;
  grading: string;
  interpretation: string;
  offense: OhioReviewedDocument;
  evidence: EvidenceSpan[];
  dependencies: OhioReviewedDocument[];
  reviewedLegalDecision: Record<string, unknown> | null;
}

type ReviewReport = {
  schemaVersion: number;
  kind: string;
  focusedReviewComplete: boolean;
  drafts: Array<{
    id: string; section: string; name: string; conduct: string; grading: string;
    scopeAndExceptions: string; reviewedEvidence: EvidenceSpan[];
    relatedEvidence: Array<{ section: string; contentHash: string | null }>;
    legalReview: Record<string, unknown> | null;
  }>;
  resolvedReviews: Array<Record<string, unknown>>;
  sourceEvidence: Record<string, OhioReviewedDocument>;
};

const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const report = JSON.parse(readFileSync(OHIO_REVIEWED_REPORT_PATH, "utf8")) as ReviewReport;

function validateReviewInputs(): void {
  if (
    report.schemaVersion !== 1 ||
    report.kind !== "substantive_source_analysis_not_runtime_approval" ||
    !report.focusedReviewComplete ||
    report.drafts.length !== 125 ||
    report.resolvedReviews.length !== 3
  ) throw new Error("The bounded Ohio substantive review is incomplete or has changed shape");
  if (eligibility.schemaVersion !== 1 ||
      eligibility.reportHash !== hash(JSON.stringify(report)) ||
      eligibility.decisions.length !== report.drafts.length) {
    throw new Error("Ohio reviewed eligibility is not bound to the current substantive report");
  }
  const decisionIds = new Set(eligibility.decisions.map(row => row.id));
  const definitionIds = new Set(OHIO_REVIEWED_DEFINITIONS.map(row => row.id));
  for (const draft of report.drafts) {
    const id = draft.id.replace(/^oh-analysis-/, "oh-orc-");
    if (!decisionIds.has(id) || !definitionIds.has(id)) {
      throw new Error(`Ohio reviewed draft is not completely accounted: ${id}`);
    }
    const primary = report.sourceEvidence[draft.section];
    if (!primary || hash(primary.text) !== primary.contentHash ||
        draft.reviewedEvidence.some(span =>
          report.sourceEvidence[span.section]?.contentHash !== span.sourceHash ||
          report.sourceEvidence[span.section]?.text.slice(span.start, span.end) !== span.text)) {
      throw new Error(`Ohio reviewed evidence changed: ${id}`);
    }
  }
}
validateReviewInputs();
if (new Set(sourceChangeHolds.map(row => row.id)).size !== sourceChangeHolds.length ||
    sourceChangeHolds.some(hold => !hold.reason.trim() || !hold.sections.length ||
      !report.drafts.some(draft => draft.id.replace(/^oh-analysis-/, "oh-orc-") === hold.id &&
        hold.sections.every(section => section === draft.section || draft.relatedEvidence.some(ref => ref.section === section))))) {
  throw new Error("Invalid Ohio source-change hold accounting");
}

// Corrections supplement the preserved historical report, never rewrite it.
const commonEvidence = JSON.parse(readFileSync(resolve(process.cwd(),
  "scripts/data-review/output/ohio-common-charge-evidence.json"), "utf8")) as {
  schemaVersion: number; kind: string; baseReportHash: string;
  records: Array<{ chargeId: string; section: string; definitionHash: string; baselineDefinitionHash: string;
    dependencies: string[]; conduct: string; grading: string; interpretation: string }>;
  documents: Record<string, OhioReviewedDocument>;
};
export function validateOhioCommonCorrections(evidence = commonEvidence, definitions = updates): void {
  const expectedSections = ["3767.32", "4301.62", "4301.633", "959.13"];
  if (evidence.schemaVersion !== 1 || evidence.kind !== "ohio_common_charge_corrections" ||
      evidence.baseReportHash !== eligibility.reportHash || evidence.records.length !== 4 ||
      definitions.length !== 4 || new Set(evidence.records.map(row => row.section)).size !== 4 ||
      new Set(definitions.map(row => row.id)).size !== 4) throw new Error("Invalid common-charge correction accounting");
  for (const row of evidence.records) {
    const definition = definitions.find(d => d.id === row.chargeId);
    const original = originalCommonDefinitions.find(d => d.id === row.chargeId);
    if (!definition || !original || !expectedSections.includes(row.section) ||
        definition.code !== row.section || definition.name !== original.name ||
        hash(JSON.stringify(original)) !== row.baselineDefinitionHash ||
        hash(JSON.stringify(definition)) !== row.definitionHash ||
        definition.text.en.plainSummary !== row.conduct || definition.text.en.degreeContext !== row.grading ||
        !row.interpretation.trim() || row.dependencies.length === 0 ||
        new Set(row.dependencies).size !== row.dependencies.length || row.dependencies.includes(row.section)) {
      throw new Error(`Common-charge correction changed: ${row.chargeId}`);
    }
    for (const section of [row.section, ...row.dependencies]) {
      const document = evidence.documents[section];
      if (!document || document.section !== section || hash(document.text) !== document.contentHash ||
          document.sourceUrl !== `https://codes.ohio.gov/ohio-revised-code/section-${section}` ||
          !document.text.startsWith(`Section ${section} |`) ||
          !document.text.includes(`Effective: ${document.effectiveDateStart}\n`) ||
          !Number.isFinite(Date.parse(document.retrievedAt)) ||
          (report.sourceEvidence[section] && report.sourceEvidence[section].contentHash !== document.contentHash)) {
        throw new Error(`Common-charge source changed: ${section}`);
      }
    }
  }
}
validateOhioCommonCorrections();
// Changing summaries, supporting evidence or scope invalidates a prior receipt.
export const OHIO_REVIEWED_CURRENT_REVIEW_HASH = hash(JSON.stringify({
  base: eligibility.reportHash, commonEvidence, sourceChangeHolds,
}));


const eligible = new Set(eligibility.decisions
  .filter(row => row.status === "eligible" && !sourceChangeHolds.some(hold => hold.id === row.id))
  .map(row => row.id));

export const OHIO_REVIEWED_SOURCES: readonly OhioReviewedSource[] = report.drafts
  .filter(draft => eligible.has(draft.id.replace(/^oh-analysis-/, "oh-orc-")))
  .map(draft => {
    const chargeId = draft.id.replace(/^oh-analysis-/, "oh-orc-");
    const offense = report.sourceEvidence[draft.section];
    const namedBySource = normalize(draft.name) === normalize(offense.title) ||
      draft.reviewedEvidence.some(span =>
        span.section === draft.section &&
        span.text.toLowerCase().includes(`guilty of ${draft.name.toLowerCase()}`));
    if (!namedBySource) throw new Error(`Ohio canonical identity gate failed: ${chargeId}`);
    const dependencies = [...new Set(draft.relatedEvidence.map(row => row.section))]
      .map(section => report.sourceEvidence[section])
      .filter((document): document is OhioReviewedDocument => Boolean(document));
    if (draft.relatedEvidence.some(row =>
      !row.contentHash || report.sourceEvidence[row.section]?.contentHash !== row.contentHash)) {
      throw new Error(`Ohio dependency changed or is unavailable: ${chargeId}`);
    }
    const correction = commonEvidence.records.find(row => row.chargeId === chargeId);
    if (correction) {
      for (const section of correction.dependencies) {
        const document = commonEvidence.documents[section];
        if (!dependencies.some(d => d.section === section)) dependencies.push(document);
      }
    }
    return {
      chargeId, canonicalTitle: draft.name[0].toUpperCase() + draft.name.slice(1),
      section: draft.section, conduct: correction?.conduct ?? draft.conduct, grading: correction?.grading ?? draft.grading,
      interpretation: correction?.interpretation ?? draft.scopeAndExceptions, offense, evidence: draft.reviewedEvidence,
      dependencies, reviewedLegalDecision: draft.legalReview,
    };
  });

export interface OhioReviewedReceiptDocument {
  section: string; title: string; sourceUrl: string; contentHash: string;
  effectiveDateStart: string;
}
export function ohioReviewedExpectedDocuments(): OhioReviewedReceiptDocument[] {
  const documents = new Map<string, OhioReviewedDocument>();
  for (const source of OHIO_REVIEWED_SOURCES) {
    documents.set(source.offense.section, source.offense);
    for (const dependency of source.dependencies) documents.set(dependency.section, dependency);
  }
  return [...documents.values()].map(document => ({
    section: document.section, title: document.title, sourceUrl: document.sourceUrl,
    contentHash: document.contentHash, effectiveDateStart: document.effectiveDateStart,
  })).sort((a, b) => a.section.localeCompare(b.section));
}

export function validateOhioReviewedRefreshReceipt(value: unknown, now = new Date()): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "Ohio reviewed refresh receipt is missing or malformed";
  }
  const receipt = value as {
    schemaVersion?: number; checkedAt?: string; expiresAt?: string;
    reportHash?: string; documents?: OhioReviewedReceiptDocument[];
  };
  const checkedAt = new Date(receipt.checkedAt ?? "");
  const expiresAt = new Date(receipt.expiresAt ?? "");
  if (receipt.schemaVersion !== 1 || receipt.reportHash !== OHIO_REVIEWED_CURRENT_REVIEW_HASH ||
      !Array.isArray(receipt.documents) || Number.isNaN(checkedAt.getTime()) ||
      Number.isNaN(expiresAt.getTime()) || checkedAt > now || expiresAt <= now ||
      expiresAt <= checkedAt ||
      expiresAt.getTime() - checkedAt.getTime() > OHIO_REVIEWED_MAX_AGE_MS) {
    return "Ohio reviewed refresh receipt is malformed, mismatched, or expired";
  }
  const actual = [...receipt.documents].sort((a, b) => a.section.localeCompare(b.section));
  const expected = ohioReviewedExpectedDocuments();
  return JSON.stringify(actual) === JSON.stringify(expected) ? null :
    "Ohio reviewed receipt does not attest to every approved dependency";
}

export function isOhioReviewedSourceFresh(now = new Date()): boolean {
  try {
    return validateOhioReviewedRefreshReceipt(
      JSON.parse(readFileSync(OHIO_REVIEWED_RECEIPT_PATH, "utf8")), now,
    ) === null;
  } catch {
    return false;
  }
}