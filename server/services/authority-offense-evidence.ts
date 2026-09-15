import { createHash } from "node:crypto";

/**
 * This schema is deliberately separate from the source snapshot schema.
 * Snapshots answer “what did the government source say?”; this record answers
 * “which catalog row, if any, is supported by that source?”.
 */
export const AUTHORITY_EVIDENCE_SCHEMA_VERSION = 1 as const;
export const AUTHORITY_EVIDENCE_MAX_TEXT_LENGTH = 24_000;

export type AuthorityEvidenceSpanKind =
  | "title"
  | "offense"
  | "grading"
  | "penalty"
  | "currentness"
  | "subdivision";

export interface AuthorityEvidenceSpan {
  kind: AuthorityEvidenceSpanKind;
  quote: string;
  start: number;
  end: number;
}

export interface AuthorityEvidenceRecord {
  schemaVersion: typeof AUTHORITY_EVIDENCE_SCHEMA_VERSION;
  sectionIdentity: {
    sourceKey: string;
    lawId: string;
    section: string;
    subdivision: string | null;
    citation: string;
    sourceUrl: string;
  };
  officialTitle: string;
  boundedText: string;
  currentness: {
    effectiveDateStart: string | null;
    effectiveDateEnd: string | null;
    sourceEvidence: string | null;
  };
  gradingLanguage: string | null;
  penaltyLanguage: string | null;
  sourceHash: string;
  hashBasis: "source_content";
  evidenceSpans: AuthorityEvidenceSpan[];
}

export type AuthorityMappingClassification =
  | "exact_match"
  | "approved_alias"
  | "compound"
  | "shared_citation"
  | "missing_section"
  | "semantic_conflict"
  | "citation_identity_conflict"
  | "incomplete_evidence";

export interface AuthorityMappingDecision {
  schemaVersion: typeof AUTHORITY_EVIDENCE_SCHEMA_VERSION;
  classification: AuthorityMappingClassification;
  confidence: "high" | "medium" | "low";
  candidateSourceKeys: string[];
  candidateCitations: string[];
  candidateEvidence: AuthorityEvidenceRecord[];
  rationale: string;
  modelProposal?: AuthorityModelMappingProposal;
}

export interface AuthorityModelMappingProposal {
  sourceHash: string;
  proposedSourceKeys: string[];
  confidence: "high" | "medium" | "low";
  quotedSpans: AuthorityEvidenceSpan[];
}

export interface AuthorityEvidenceDocument {
  sourceKey: string;
  lawId: string;
  section: string;
  subdivision: string | null;
  citation: string;
  sourceUrl: string;
  officialTitle: string;
  text: string;
  contentHash: string;
  effectiveDateStart: string | null;
  effectiveDateEnd?: string | null;
  sourceEvidence?: string | null;
}

export interface AuthorityMappingInput {
  catalogLabel: string;
  catalogCode: string;
  references: Array<{
    section: string;
    subdivision: string | null;
  }>;
  documents: AuthorityEvidenceDocument[];
  codeIdentityMatches: boolean;
  approvedAlias: boolean;
  sharedCitation?: boolean;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function boundedText(text: string): string {
  return text.length <= AUTHORITY_EVIDENCE_MAX_TEXT_LENGTH
    ? text
    : text.slice(0, AUTHORITY_EVIDENCE_MAX_TEXT_LENGTH);
}

function addSpan(
  spans: AuthorityEvidenceSpan[],
  text: string,
  kind: AuthorityEvidenceSpanKind,
  quote: string | null,
): void {
  if (!quote) return;
  const start = text.indexOf(quote);
  if (start < 0) return;
  spans.push({ kind, quote, start, end: start + quote.length });
}

function findLine(text: string, patterns: RegExp[]): string | null {
  return text.split("\n").find((line) => patterns.some((pattern) => pattern.test(line))) ?? null;
}

export function buildAuthorityEvidence(
  document: AuthorityEvidenceDocument,
): AuthorityEvidenceRecord {
  const sourceHash = createHash("sha256").update(document.text).digest("hex");
  if (sourceHash !== document.contentHash) {
    throw new Error(
      `Authority evidence hash mismatch for ${document.citation}: expected ${document.contentHash}, got ${sourceHash}`,
    );
  }

  const spans: AuthorityEvidenceSpan[] = [];
  addSpan(spans, document.text, "title", findLine(document.text, [
    new RegExp(normalize(document.officialTitle).replace(/ /g, "\\s+"), "i"),
  ]));
  addSpan(spans, document.text, "currentness", document.sourceEvidence ??
    findLine(document.text, [/\beffective\b/i, /\beff\./i, /\bsource:/i]));
  addSpan(spans, document.text, "grading", findLine(document.text, [
    /\bclass\s+[a-f]\b/i,
    /\b(first|second|third|fourth|fifth)\s+degree\b/i,
    /\b(felony|misdemeanor)\b/i,
    /\bpunishable\b/i,
  ]));
  addSpan(spans, document.text, "penalty", findLine(document.text, [
    /\bpenalt(y|ies)\b/i,
    /\bsentenc(e|ing)\b/i,
    /\bimprison(ed|ment)?\b/i,
    /\bfine\b/i,
  ]));
  if (document.subdivision) {
    const escapedSubdivision = document.subdivision.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    addSpan(spans, document.text, "subdivision", findLine(document.text, [
      new RegExp(escapedSubdivision, "i"),
    ]));
  }
  addSpan(spans, document.text, "offense", boundedText(document.text));

  return {
    schemaVersion: AUTHORITY_EVIDENCE_SCHEMA_VERSION,
    sectionIdentity: {
      sourceKey: document.sourceKey,
      lawId: document.lawId,
      section: document.section,
      subdivision: document.subdivision,
      citation: document.citation,
      sourceUrl: document.sourceUrl,
    },
    officialTitle: document.officialTitle,
    boundedText: boundedText(document.text),
    currentness: {
      effectiveDateStart: document.effectiveDateStart,
      effectiveDateEnd: document.effectiveDateEnd ?? null,
      sourceEvidence: document.sourceEvidence ?? null,
    },
    gradingLanguage: spans.find((span) => span.kind === "grading")?.quote ?? null,
    penaltyLanguage: spans.find((span) => span.kind === "penalty")?.quote ?? null,
    sourceHash: document.contentHash,
    hashBasis: "source_content",
    evidenceSpans: spans,
  };
}

export function classifyAuthorityMapping(
  input: AuthorityMappingInput,
): AuthorityMappingDecision {
  const evidence = input.documents.map(buildAuthorityEvidence);
  const candidateSourceKeys = input.documents.map((document) => document.sourceKey);
  const candidateCitations = input.documents.map((document) => document.citation);
  const base = {
    schemaVersion: AUTHORITY_EVIDENCE_SCHEMA_VERSION,
    confidence: "high" as const,
    candidateSourceKeys,
    candidateCitations,
    candidateEvidence: evidence,
  };

  if (input.documents.length === 0) {
    return {
      ...base,
      classification: "missing_section",
      confidence: "low",
      rationale: "No complete official provision was retrieved for the catalog citation.",
    };
  }
  if (input.documents.length !== input.references.length) {
    return {
      ...base,
      classification: "incomplete_evidence",
      confidence: "low",
      rationale: "At least one cited official provision is missing or incomplete.",
    };
  }
  if (input.references.length > 1) {
    return {
      ...base,
      classification: "compound",
      rationale: "The catalog row cites multiple official provisions and needs compound-charge handling.",
    };
  }
  if (!input.codeIdentityMatches) {
    return {
      ...base,
      classification: "citation_identity_conflict",
      confidence: "low",
      rationale: "The catalog code does not identify the same official section set as the citation.",
    };
  }
  if (input.sharedCitation) {
    return {
      ...base,
      classification: "shared_citation",
      rationale: "Multiple catalog rows point to the same official provision; the candidate is shared, not silently deduplicated.",
    };
  }
  if (input.approvedAlias) {
    return {
      ...base,
      classification: "approved_alias",
      rationale: "The official title is present in the jurisdiction's charge-specific approved alias registry.",
    };
  }
  if (normalize(input.catalogLabel) === normalize(input.documents[0].officialTitle)) {
    return {
      ...base,
      classification: "exact_match",
      rationale: "The catalog label matches the official title after punctuation normalization.",
    };
  }
  return {
    ...base,
    classification: "semantic_conflict",
    confidence: "low",
    rationale: `The official title "${input.documents[0].officialTitle}" does not establish equivalence to the catalog label.`,
  };
}

export function annotateSharedAuthorityMappings<T extends {
  mapping?: AuthorityMappingDecision;
}>(
  records: T[],
): void {
  const counts = new Map<string, number>();
  for (const record of records) {
    for (const citation of record.mapping?.candidateCitations ?? []) {
      counts.set(citation, (counts.get(citation) ?? 0) + 1);
    }
  }
  for (const record of records) {
    if (!record.mapping || record.mapping.classification !== "semantic_conflict") continue;
    if (!record.mapping.candidateCitations.some((citation) => (counts.get(citation) ?? 0) > 1)) continue;
    record.mapping = {
      ...record.mapping,
      classification: "shared_citation",
      rationale: "Multiple catalog rows point to the same official provision; the candidate is shared, not silently deduplicated.",
    };
  }
}

export function validateAuthorityModelMappingProposal(
  proposal: AuthorityModelMappingProposal,
  evidence: AuthorityEvidenceRecord[],
): boolean {
  const matchingEvidence = evidence.filter((item) => item.sourceHash === proposal.sourceHash);
  const sourceKeys = new Set(matchingEvidence.map((item) => item.sectionIdentity.sourceKey));
  return matchingEvidence.length > 0 &&
    proposal.proposedSourceKeys.length > 0 &&
    proposal.proposedSourceKeys.every((sourceKey) => sourceKeys.has(sourceKey)) &&
    proposal.quotedSpans.length > 0 &&
    proposal.quotedSpans.every((span) => {
      const source = matchingEvidence
        .filter((item) => proposal.proposedSourceKeys.includes(item.sectionIdentity.sourceKey))
        .find((item) =>
        item.evidenceSpans.some((candidate) =>
          candidate.quote === span.quote &&
          candidate.start === span.start &&
          candidate.end === span.end,
        ));
      if (!source) return false;
      const start = source.boundedText.indexOf(span.quote);
      return start >= 0 && start === span.start && span.end === start + span.quote.length;
    });
}