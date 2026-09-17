import { textHash, quoteLines, type BatchDocument, type EvidenceQuote } from "./source-batch";
import { extractOffenseUnits, type OhioBatchTarget } from "./ohio-review-report";

export interface SubstantiveCandidate {
  name: string;
  conduct: string;
  grading: string;
  evidenceQuotes: string[];
}
export interface SubstantiveFinding {
  section: string;
  sourceHash: string;
  classification: "routine_offense" | "supporting_or_procedure" | "specific_legal_question" | "technical_gap";
  candidates: SubstantiveCandidate[];
  resolution: string;
  question: string | null;
  relatedSections: string[];
  relatedSourceHashes?: Record<string, string>;
  evidenceQuotes?: string[];
}

function bindQuote(document: BatchDocument, quote: string): EvidenceQuote & { section: string } {
  const start = document.text.indexOf(quote);
  if (!quote.trim() || start < 0) throw new Error(`Review quote is not exact source text: ${document.section}: ${quote.slice(0, 100)}`);
  return { text: quote, start, end: start + quote.length, sourceHash: document.contentHash, section: document.section };
}

/**
 * Compile already analyzed, hash-bound findings. It does not infer legal approval
 * from a regex, a similar legacy label, or an unchanged source.
 */
export function compileOhioSubstantiveReview(input: {
  findings: SubstantiveFinding[];
  documents: Record<string, BatchDocument>;
  requiredSections: string[];
  targets: OhioBatchTarget[];
  existingSourceFirst: Array<{ id: string; code: string; name: string }>;
  now?: Date;
}) {
  const { documents, findings } = input;
  const seen = new Set<string>();
  const drafts: Array<Record<string, unknown>> = [];
  const manualQuestions: Array<Record<string, unknown>> = [];
  const technicalWork: Array<Record<string, unknown>> = [];
  const now = input.now ?? new Date();
  const sourceReferences = new Map<string, BatchDocument>();
  const rows = findings.map(finding => {
    if (!["routine_offense", "supporting_or_procedure", "specific_legal_question", "technical_gap"].includes(finding.classification)) throw new Error(`Unknown analysis classification: ${finding.section}`);
    if (seen.has(finding.section)) throw new Error(`Duplicate substantive finding: ${finding.section}`);
    seen.add(finding.section);
    const document = documents[finding.section];
    if (!document || textHash(document.text) !== document.contentHash || finding.sourceHash !== document.contentHash) {
      throw new Error(`Substantive review source changed or is unavailable: ${finding.section}`);
    }
    const age = now.getTime() - Date.parse(document.retrievedAt);
    if (!Number.isFinite(age) || age < 0 || age >= 7 * 24 * 60 * 60_000) {
      throw new Error(`Substantive review source is stale: ${finding.section}`);
    }
    sourceReferences.set(document.section, document);
    const bindFindingQuote = (quote: string) => {
      const source = [document, ...finding.relatedSections.map(section => documents[section]).filter(Boolean)]
        .find(source => source.text.includes(quote));
      if (!source) throw new Error(`Review quote has no exact primary/related source: ${finding.section}: ${quote.slice(0, 100)}`);
      return bindQuote(source, quote);
    };
    const candidates = finding.candidates ?? [];
    const quotes = [
      ...(finding.evidenceQuotes ?? []),
      ...candidates.flatMap(candidate => candidate.evidenceQuotes),
    ];
    if (!finding.resolution?.trim() || !quotes.length) throw new Error(`Finding needs a resolution and evidence: ${finding.section}`);
    const evidence = [...new Set(quotes)].map(bindFindingQuote);
    const existing = input.existingSourceFirst.filter(charge => charge.code === finding.section);
    const unavailableRelated = finding.relatedSections.filter(section => !documents[section]);
    for (const section of finding.relatedSections) {
      const related = documents[section];
      if (related) {
        if (textHash(related.text) !== related.contentHash) throw new Error(`Related evidence hash mismatch: ${section}`);
        if (finding.relatedSourceHashes?.[section] !== related.contentHash) throw new Error(`Related review source changed or was not bound: ${finding.section} -> ${section}`);
        const relatedAge = now.getTime() - Date.parse(related.retrievedAt);
        if (!Number.isFinite(relatedAge) || relatedAge < 0 || relatedAge >= 7 * 24 * 60 * 60_000) throw new Error(`Related review source stale: ${section}`);
        sourceReferences.set(section, related);
      }
    }
    if (finding.classification === "specific_legal_question") {
      if (!finding.question?.trim() || /^(?:confirm|review|check) (?:the |each |all )?(?:scope|grades?|references?|accuracy)/i.test(finding.question)) {
        throw new Error(`Legal question must describe a specific unresolved conflict: ${finding.section}`);
      }
      manualQuestions.push({
        section: finding.section, title: document.title, question: finding.question,
        sourceUrl: document.sourceUrl, sourceHash: document.contentHash, evidence,
        affectedTargets: input.targets.filter(target => target.sections.includes(finding.section)).map(target => target.id),
        decision: "", note: "",
      });
    } else if (finding.question) {
      throw new Error(`Non-legal finding must not masquerade as attorney work: ${finding.section}`);
    }
    if (finding.classification === "technical_gap" || unavailableRelated.length) {
      technicalWork.push({
        section: finding.section, resolution: finding.resolution,
        missingSources: unavailableRelated,
        owner: "agent_not_attorney",
      });
    }
    if (finding.classification !== "supporting_or_procedure" && !existing.length) {
      for (const candidate of candidates) {
        if (!candidate.name?.trim() || !candidate.conduct?.trim() || !candidate.grading?.trim() || !candidate.evidenceQuotes.length) {
          throw new Error(`Incomplete structured draft: ${finding.section}`);
        }
        const slug = candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        drafts.push({
          id: `oh-analysis-${finding.section.replace(".", "-")}-${slug}`,
          jurisdiction: "OH", section: finding.section, name: candidate.name,
          status: finding.classification === "specific_legal_question" ? "draft_with_specific_legal_hold"
            : finding.classification === "technical_gap" || unavailableRelated.length ? "draft_with_technical_hold"
            : "structured_source_first_draft",
          conduct: candidate.conduct, grading: candidate.grading,
          scopeAndExceptions: finding.resolution,
          source: { section: document.section, citation: `Ohio Rev. Code Ann. § ${document.section}`,
            title: document.title, url: document.sourceUrl, contentHash: document.contentHash },
          reviewedEvidence: candidate.evidenceQuotes.map(bindFindingQuote),
          // Preserve complete branches and exceptions. Never flatten them to a single maximum.
          fullSourceTextReference: document.section,
          literalGuiltClauses: extractOffenseUnits(document),
          gradingEvidence: quoteLines(document, /\b(?:felony|misdemeanor|mandatory prison|shall be punished)\b/i),
          relatedEvidence: finding.relatedSections.map(section => ({
            section, contentHash: documents[section]?.contentHash ?? null,
          })),
          legacyMigration: "none_legacy_ids_remain_withheld",
          runtimePublication: "not_approved",
        });
      }
    }
    return {
      ...finding, evidence,
      existingSourceFirstIds: existing.map(charge => charge.id),
      affectedTargets: input.targets.filter(target => target.sections.includes(finding.section)).map(target => target.id),
      runtimeAction: "none", unavailableRelated,
    };
  });
  const missing = input.requiredSections.filter(section => !seen.has(section));
  const extra = [...seen].filter(section => !input.requiredSections.includes(section));
  if (missing.length || extra.length) throw new Error(`Review coverage mismatch: missing ${missing.join(", ")}; extra ${extra.join(", ")}`);
  const duplicateDrafts = drafts.map(draft => draft.id).filter((id, index, ids) => ids.indexOf(id) !== index);
  if (duplicateDrafts.length) throw new Error(`Duplicate proposed offense identities: ${duplicateDrafts.join(", ")}`);
  return {
    schemaVersion: 1, kind: "substantive_source_analysis_not_runtime_approval",
    reviewScope: "existing_ohio_catalog_and_remaining_chapter_2903",
    generatedAt: now.toISOString(),
    readyForFocusedManualReview: technicalWork.length === 0,
    inputHash: textHash(JSON.stringify(findings)),
    summary: {
      analyzedSections: rows.length,
      routineOffenseSections: rows.filter(row => row.classification === "routine_offense").length,
      alreadySourceFirstSections: rows.filter(row => row.existingSourceFirstIds.length).length,
      supportingOrProcedureSections: rows.filter(row => row.classification === "supporting_or_procedure").length,
      specificLegalQuestions: manualQuestions.length,
      technicalWorkItems: technicalWork.length,
      preparedDrafts: drafts.length,
      remainingGenericReviewQuestions: 0,
      runtimeChargesAdded: 0,
    },
    rows, drafts, manualQuestions, technicalWork,
    // Full text is included once, rather than copied into every offense variant.
    sourceEvidence: Object.fromEntries([...sourceReferences].map(([section, document]) => [section, document])),
  };
}