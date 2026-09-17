import { createHash } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_MODEL_SONNET } from "../config/ai-model";

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

export const AUTHORITY_MODEL_REVIEW_SCHEMA_VERSION = 1 as const;
export const AUTHORITY_MODEL_REVIEW_MAX_CASES_PER_REQUEST = 4;
export const AUTHORITY_MODEL_REVIEW_MAX_PROMPT_LENGTH = 24_000;

/**
 * This is the only evidence shape that may be sent to the optional model
 * review. In particular, it intentionally does not include boundedText,
 * official titles, or source URLs.
 */
export interface AuthorityModelEvidenceCandidate {
  sourceHash: string;
  sourceKey: string;
  quotedSpans: AuthorityEvidenceSpan[];
}

export interface AuthorityModelMappingReviewCase {
  caseId: string;
  catalogLabel: string;
  catalogCode: string;
  mappingClassification: AuthorityMappingClassification;
  deterministicConfidence: "high" | "medium" | "low";
  evidence: AuthorityEvidenceRecord[];
}

export interface AuthorityModelMappingReviewOutcome {
  caseId: string;
  status: "accepted" | "rejected";
  deterministicConfidence: "high" | "medium" | "low";
  proposal?: AuthorityModelMappingProposal;
  rejectionReason?: string;
}

export interface AuthorityModelMappingReview {
  schemaVersion: typeof AUTHORITY_MODEL_REVIEW_SCHEMA_VERSION;
  candidates: number;
  accepted: number;
  rejected: number;
  outcomes: AuthorityModelMappingReviewOutcome[];
}

export interface AuthorityModelResponse {
  text: string;
  stopReason?: string | null;
}

export interface AuthorityModelClientCredentials {
  apiKey: string;
  baseURL?: string;
}

export function resolveAuthorityModelClientCredentials(
  environment: Record<string, string | undefined> = process.env,
): AuthorityModelClientCredentials {
  const integrationKey = environment.AI_INTEGRATIONS_ANTHROPIC_API_KEY;
  if (integrationKey) {
    return {
      apiKey: integrationKey,
      ...(environment.AI_INTEGRATIONS_ANTHROPIC_BASE_URL
        ? { baseURL: environment.AI_INTEGRATIONS_ANTHROPIC_BASE_URL }
        : {}),
    };
  }
  if (environment.ANTHROPIC_API_KEY) {
    return { apiKey: environment.ANTHROPIC_API_KEY };
  }
  throw new Error(
    "Authority model review requires a configured Anthropic model key; no key was found.",
  );
}

export function createAuthorityModelResponseGenerator(
  environment: Record<string, string | undefined> = process.env,
): {
  model: string;
  generate: (prompt: string) => Promise<AuthorityModelResponse>;
} {
  const credentials = resolveAuthorityModelClientCredentials(environment);
  const model = environment.AUTHORITY_MODEL_REVIEW_MODEL ?? CLAUDE_MODEL_SONNET;
  const client = new Anthropic({
    ...credentials,
    timeout: 120_000,
  });
  return {
    model,
    generate: async (prompt: string): Promise<AuthorityModelResponse> => {
      const response = await client.messages.create({
        model,
        max_tokens: 4096,
        temperature: 0,
        system:
          "You are assisting a legal-data auditor. Return only the requested JSON. " +
          "Do not treat suggestions as legal approval or publication decisions.",
        messages: [{ role: "user", content: prompt }],
      });
      return {
        text: response.content
          .filter((block): block is Anthropic.TextBlock => block.type === "text")
          .map((block) => block.text)
          .join("\n"),
        stopReason: response.stop_reason,
      };
    },
  };
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
  if (
    !/^[a-f0-9]{64}$/.test(proposal.sourceHash) ||
    !["high", "medium", "low"].includes(proposal.confidence) ||
    !Array.isArray(proposal.proposedSourceKeys) ||
    !Array.isArray(proposal.quotedSpans)
  ) return false;

  const matchingEvidence = evidence.filter((item) => item.sourceHash === proposal.sourceHash);
  const sourceKeys = new Set(matchingEvidence.map((item) => item.sectionIdentity.sourceKey));
  return matchingEvidence.length > 0 &&
    proposal.proposedSourceKeys.length > 0 &&
    proposal.proposedSourceKeys.every((sourceKey) => sourceKeys.has(sourceKey)) &&
    proposal.quotedSpans.length > 0 &&
    proposal.quotedSpans.every((span) => {
      if (
        !span ||
        typeof span !== "object" ||
        !["title", "offense", "grading", "penalty", "currentness", "subdivision"].includes(span.kind) ||
        typeof span.quote !== "string" ||
        span.quote.length === 0 ||
        !Number.isInteger(span.start) ||
        !Number.isInteger(span.end) ||
        span.start < 0 ||
        span.end <= span.start
      ) return false;
      const source = matchingEvidence
        .filter((item) => proposal.proposedSourceKeys.includes(item.sectionIdentity.sourceKey))
        .find((item) =>
        item.evidenceSpans.some((candidate) =>
          candidate.kind === span.kind &&
          candidate.quote === span.quote &&
          candidate.start === span.start &&
          candidate.end === span.end,
        ));
      if (!source) return false;
      const start = source.boundedText.indexOf(span.quote);
      return start >= 0 && start === span.start && span.end === start + span.quote.length;
    });
}

function modelEvidenceFor(
  evidence: AuthorityEvidenceRecord,
): AuthorityModelEvidenceCandidate {
  return {
    sourceHash: evidence.sourceHash,
    sourceKey: evidence.sectionIdentity.sourceKey,
    // The complete offense span can be the entire bounded source document.
    // Keep the model review limited to the short, pre-extracted spans.
    quotedSpans: evidence.evidenceSpans.filter((span) => span.kind !== "offense"),
  };
}

function validationEvidenceFor(
  evidence: AuthorityEvidenceRecord[],
): AuthorityEvidenceRecord[] {
  const modelEvidence = new Set(
    evidence.flatMap((item) => modelEvidenceFor(item).quotedSpans.map((span) =>
      `${item.sourceHash}:${span.kind}:${span.start}:${span.end}:${span.quote}`,
    )),
  );
  return evidence.map((item) => ({
    ...item,
    evidenceSpans: item.evidenceSpans.filter((span) => modelEvidence.has(
      `${item.sourceHash}:${span.kind}:${span.start}:${span.end}:${span.quote}`,
    )),
  }));
}

/**
 * Build a JSON prompt from a deliberately redacted view of the official
 * evidence. The source hash and source key let a reviewer trace a proposal
 * back to the official snapshot, while the quoted spans give the model only
 * bounded evidence to reason over.
 */
export function buildAuthorityModelMappingReviewPrompt(
  cases: AuthorityModelMappingReviewCase[],
): string {
  const payload = cases.map((reviewCase) => ({
    caseId: reviewCase.caseId,
    catalogLabel: reviewCase.catalogLabel,
    catalogCode: reviewCase.catalogCode,
    mappingClassification: reviewCase.mappingClassification,
    deterministicConfidence: reviewCase.deterministicConfidence,
    evidence: reviewCase.evidence.map(modelEvidenceFor),
  }));
  return [
    "Return JSON only in the form {\"proposals\":[...]} with no markdown.",
    "Suggest mappings for unresolved catalog rows using only the supplied quoted official evidence.",
    "Do not invent source keys, hashes, quotes, offsets, or confidence values.",
    "A proposal is audit-only. It must not be treated as approval or publication.",
    "Each proposal must contain caseId and proposal, where proposal has sourceHash,",
    "proposedSourceKeys, confidence, and quotedSpans.",
    JSON.stringify({ cases: payload }),
  ].join("\n");
}

function parseJsonResponse(rawResponse: string): unknown {
  const cleaned = rawResponse
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

function batchReviewCases(
  cases: AuthorityModelMappingReviewCase[],
): AuthorityModelMappingReviewCase[][] {
  const batches: AuthorityModelMappingReviewCase[][] = [];
  let current: AuthorityModelMappingReviewCase[] = [];
  for (const reviewCase of cases) {
    const candidate = [...current, reviewCase];
    if (
      current.length > 0 &&
      (candidate.length > AUTHORITY_MODEL_REVIEW_MAX_CASES_PER_REQUEST ||
        buildAuthorityModelMappingReviewPrompt(candidate).length >
          AUTHORITY_MODEL_REVIEW_MAX_PROMPT_LENGTH)
    ) {
      batches.push(current);
      current = [reviewCase];
    } else {
      current = candidate;
    }
  }
  if (current.length > 0) batches.push(current);
  return batches;
}

function isProposal(value: unknown): value is AuthorityModelMappingProposal {
  if (!value || typeof value !== "object") return false;
  const proposal = value as Record<string, unknown>;
  return typeof proposal.sourceHash === "string" &&
    Array.isArray(proposal.proposedSourceKeys) &&
    Array.isArray(proposal.quotedSpans) &&
    ["high", "medium", "low"].includes(proposal.confidence as string);
}

/**
 * Parse and validate model output without mutating a deterministic mapping.
 * Invalid JSON, unknown cases, duplicate cases, and proposals that fail the
 * hash/span validator are retained as rejected audit outcomes.
 */
export function parseAuthorityModelMappingReviewResponse(
  rawResponse: string,
  cases: AuthorityModelMappingReviewCase[],
  options: { truncated?: boolean } = {},
): AuthorityModelMappingReview {
  const byCaseId = new Map(cases.map((reviewCase) => [reviewCase.caseId, reviewCase]));
  const outcomes: AuthorityModelMappingReviewOutcome[] = [];
  let parsed: unknown;
  try {
    parsed = parseJsonResponse(rawResponse);
  } catch {
    return {
      schemaVersion: AUTHORITY_MODEL_REVIEW_SCHEMA_VERSION,
      candidates: cases.length,
      accepted: 0,
      rejected: cases.length,
      outcomes: cases.map((reviewCase) => ({
        caseId: reviewCase.caseId,
        status: "rejected",
        deterministicConfidence: reviewCase.deterministicConfidence,
        rejectionReason: options.truncated
          ? "Model response was truncated before complete JSON."
          : "Model response was not valid JSON.",
      })),
    };
  }

  const proposals = parsed && typeof parsed === "object" &&
    Array.isArray((parsed as { proposals?: unknown }).proposals)
    ? (parsed as { proposals: unknown[] }).proposals
    : [];
  const seen = new Set<string>();
  const outcomeByCaseId = new Map<string, AuthorityModelMappingReviewOutcome>();
  for (const item of proposals) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as Record<string, unknown>;
    const caseId = typeof candidate.caseId === "string" ? candidate.caseId : null;
    const reviewCase = caseId ? byCaseId.get(caseId) : undefined;
    const proposal = candidate.proposal;
    if (!caseId || !reviewCase) {
      continue;
    }
    if (seen.has(caseId)) {
      outcomeByCaseId.set(caseId, {
        caseId: reviewCase.caseId,
        status: "rejected",
        deterministicConfidence: reviewCase.deterministicConfidence,
        rejectionReason: "Model returned more than one proposal for this case.",
      });
      continue;
    }
    if (!isProposal(proposal)) {
      seen.add(caseId);
      outcomeByCaseId.set(caseId, {
        caseId: reviewCase.caseId,
        status: "rejected",
        deterministicConfidence: reviewCase.deterministicConfidence,
        rejectionReason: "Model returned a malformed proposal.",
      });
      continue;
    }
    const validCaseId = caseId;
    seen.add(validCaseId);
    const valid = validateAuthorityModelMappingProposal(
      proposal,
      validationEvidenceFor(reviewCase.evidence),
    );
    outcomeByCaseId.set(caseId, valid
      ? {
          caseId: reviewCase.caseId,
          status: "accepted",
          deterministicConfidence: reviewCase.deterministicConfidence,
          proposal,
        }
      : {
          caseId: reviewCase.caseId,
          status: "rejected",
          deterministicConfidence: reviewCase.deterministicConfidence,
          rejectionReason: "Proposal failed hash-bound quoted-span validation.",
        });
  }

  for (const reviewCase of cases) {
    if (!outcomeByCaseId.has(reviewCase.caseId)) {
      outcomeByCaseId.set(reviewCase.caseId, {
        caseId: reviewCase.caseId,
        status: "rejected",
        deterministicConfidence: reviewCase.deterministicConfidence,
        rejectionReason: options.truncated
          ? "Model response reached its output limit before this proposal was returned."
          : "Model did not return a proposal for this unresolved mapping.",
      });
    }
  }
  outcomes.push(...cases.map((reviewCase) => outcomeByCaseId.get(reviewCase.caseId)!));
  return {
    schemaVersion: AUTHORITY_MODEL_REVIEW_SCHEMA_VERSION,
    candidates: cases.length,
    accepted: outcomes.filter((outcome) => outcome.status === "accepted").length,
    rejected: outcomes.filter((outcome) => outcome.status === "rejected").length,
    outcomes,
  };
}

export async function reviewAuthorityMappingsWithModel(
  cases: AuthorityModelMappingReviewCase[],
  generateResponse: (prompt: string) => Promise<string | AuthorityModelResponse>,
): Promise<AuthorityModelMappingReview> {
  if (cases.length === 0) {
    return {
      schemaVersion: AUTHORITY_MODEL_REVIEW_SCHEMA_VERSION,
      candidates: 0,
      accepted: 0,
      rejected: 0,
      outcomes: [],
    };
  }
  const batchReviews: AuthorityModelMappingReview[] = [];
  for (const batch of batchReviewCases(cases)) {
    const generated = await generateResponse(buildAuthorityModelMappingReviewPrompt(batch));
    const response = typeof generated === "string"
      ? { text: generated, stopReason: null }
      : generated;
    batchReviews.push(parseAuthorityModelMappingReviewResponse(
      response.text,
      batch,
      { truncated: response.stopReason === "max_tokens" || response.stopReason === "length" },
    ));
  }
  const outcomes = cases.map((reviewCase) =>
    batchReviews.flatMap((review) => review.outcomes)
      .find((outcome) => outcome.caseId === reviewCase.caseId)!,
  );
  return {
    schemaVersion: AUTHORITY_MODEL_REVIEW_SCHEMA_VERSION,
    candidates: cases.length,
    accepted: outcomes.filter((outcome) => outcome.status === "accepted").length,
    rejected: outcomes.filter((outcome) => outcome.status === "rejected").length,
    outcomes,
  };
}
