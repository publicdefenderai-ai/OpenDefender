import { textHash, type BatchDocument } from "./source-batch";
import type { SubstantiveCandidate, SubstantiveFinding } from "./substantive-review";

export interface ResolvedReview {
  question: string;
  decision: string;
  note: string;
  disposition: "apply_interpretation_to_draft";
  interpretation: string;
  authorityUrls: string[];
  submission: { filePath: string; contentHash: string; importedAt: string };
}
export interface SubstantiveResponseLedger {
  schemaVersion: 1;
  submission: ResolvedReview["submission"];
  decisions: Array<Omit<ResolvedReview, "submission"> & {
    section: string;
    sourceHash: string;
    findingHash: string;
    officialSource: string;
    reviewedSourceHashes: Record<string, string>;
    candidates: SubstantiveCandidate[];
    relatedSections: string[];
    evidenceQuotes: string[];
  }>;
}

/**
 * Apply deliberately curated responses, never infer approval from arbitrary CSV
 * prose. The original findings stay unchanged. New/changed evidence requires
 * deliberate reconciliation, not automatic rebinding of an old decision.
 */
export function applyOhioReviewResponses(
  findings: SubstantiveFinding[],
  documents: Record<string, BatchDocument>,
  ledger: SubstantiveResponseLedger,
): SubstantiveFinding[] {
  if (ledger.schemaVersion !== 1 || !/^[a-f0-9]{64}$/.test(ledger.submission.contentHash) ||
      !ledger.submission.filePath || !Number.isFinite(Date.parse(ledger.submission.importedAt))) {
    throw new Error("Invalid substantive response submission");
  }
  const decisions = new Map<string, SubstantiveResponseLedger["decisions"][number]>();
  for (const entry of ledger.decisions) {
    if (decisions.has(entry.section)) throw new Error(`Duplicate review response: ${entry.section}`);
    const original = findings.find(finding => finding.section === entry.section);
    if (!original || original.classification !== "specific_legal_question" ||
        original.question !== entry.question || original.sourceHash !== entry.sourceHash ||
        textHash(JSON.stringify(original)) !== entry.findingHash) {
      throw new Error(`Review response no longer matches its finding: ${entry.section}`);
    }
    if (!entry.decision.trim() || !entry.interpretation.trim() ||
        entry.disposition !== "apply_interpretation_to_draft" ||
        documents[entry.section]?.sourceUrl !== entry.officialSource) {
      throw new Error(`Incomplete or mismatched review disposition: ${entry.section}`);
    }
    if (JSON.stringify(entry.candidates.map(candidate => candidate.name)) !==
        JSON.stringify(original.candidates.map(candidate => candidate.name)) ||
        original.relatedSections.some(section => !entry.relatedSections.includes(section))) {
      throw new Error(`Review response cannot silently change identities or drop evidence: ${entry.section}`);
    }
    const required = new Set([entry.section, ...entry.relatedSections]);
    if (Object.keys(entry.reviewedSourceHashes).some(section => !required.has(section))) {
      throw new Error(`Unexpected authority binding: ${entry.section}`);
    }
    for (const section of required) {
      const source = documents[section];
      if (!source || textHash(source.text) !== source.contentHash ||
          entry.reviewedSourceHashes[section] !== source.contentHash) {
        throw new Error(`Reviewed authority changed or is unavailable: ${entry.section} -> ${section}`);
      }
    }
    decisions.set(entry.section, entry);
  }
  return findings.map(original => {
    const entry = decisions.get(original.section);
    if (!entry) return original;
    return {
      ...original,
      classification: "routine_offense",
      question: null,
      resolution: entry.interpretation,
      candidates: entry.candidates,
      relatedSections: entry.relatedSections,
      relatedSourceHashes: Object.fromEntries(entry.relatedSections.map(section => [section, entry.reviewedSourceHashes[section]])),
      evidenceQuotes: entry.evidenceQuotes,
      legalReview: {
        question: entry.question, decision: entry.decision, note: entry.note,
        disposition: entry.disposition, interpretation: entry.interpretation,
        authorityUrls: entry.authorityUrls, submission: ledger.submission,
      },
    };
  });
}