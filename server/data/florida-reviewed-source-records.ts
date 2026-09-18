import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  FLORIDA_REVIEWED_DEFINITIONS,
} from "@shared/florida-reviewed-batch";
import eligibilityFile from "@shared/florida-reviewed-eligibility.json";
import type { EvidenceBackedChargeDefinition } from "@shared/evidence-backed-charge-batch";
import type { AuthoritySupportRole } from "../services/authority-source-database";

export const FLORIDA_REVIEWED_REPORT_PATH = resolve(
  process.cwd(), "scripts/data-review/output/florida-reviewed-analysis.json",
);
export const FLORIDA_REVIEWED_ANALYSIS_PATHS = ["a", "b", "c", "d", "e"].map(part =>
  resolve(process.cwd(), `scripts/data-review/output/florida-reviewed-analysis-${part}.json`));
export const FLORIDA_REVIEWED_SOURCE_CACHE_PATH = resolve(
  process.cwd(), "scripts/data-review/output/florida-batch-source-cache.json",
);
export const FLORIDA_REVIEWED_RECEIPT_PATH = resolve(
  process.cwd(), "scripts/data-review/output/florida-reviewed-refresh-receipt.json",
);
export const FLORIDA_REVIEWED_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface FloridaReviewedSubdivisionRange {
  subdivision: string;
  start: number;
  end: number;
}

export interface FloridaReviewedDocument {
  sourceKey: string;
  section: string;
  subdivision: string | null;
  citation: string;
  title: string;
  sourceUrl: string;
  text: string;
  contentHash: string;
  retrievedAt: string;
  effectiveDateStart: string | null;
  subdivisionRanges: FloridaReviewedSubdivisionRange[];
}

export interface FloridaReviewedEvidenceSpan {
  sourceKey: string;
  target: "title" | "text";
  text: string;
  start: number;
  end: number;
  sourceHash: string;
}

export type FloridaReviewedDependencyRole =
  | "offense"
  | "grading"
  | "penalty"
  | "definition"
  | "exception"
  | "justification";

export interface FloridaReviewedDependency {
  sourceKey: string;
  role: FloridaReviewedDependencyRole;
  contentHash: string;
}

export interface FloridaReviewedDraft {
  id: string;
  name: string;
  code: string;
  citation: string;
  primarySourceKey: string;
  identityEvidence: FloridaReviewedEvidenceSpan;
  conductEvidence: FloridaReviewedEvidenceSpan[];
  gradeEvidence: Array<FloridaReviewedEvidenceSpan & {
    category: EvidenceBackedChargeDefinition["category"];
  }>;
  requiredDependencies: FloridaReviewedDependency[];
  conduct: string;
  grading: string;
  interpretation: string;
  legalReview: Record<string, unknown> | null;
}

export interface FloridaReviewedReport {
  schemaVersion: 1;
  kind: "florida_source_first_review";
  drafts: FloridaReviewedDraft[];
  sourceEvidence: Record<string, FloridaReviewedDocument>;
  technicalHolds?: Array<{ id: string; reason: string }>;
}

export interface FloridaReviewedEligibilityDecision {
  id: string;
  status: "eligible" | "held" | "duplicate";
  reason: string;
  draftHash: string;
  definitionHash: string;
  approvalHash: string;
}

export interface FloridaReviewedEligibility {
  schemaVersion: 1;
  reportHash: string;
  decisions: FloridaReviewedEligibilityDecision[];
}

export interface FloridaReviewedReceipt {
  schemaVersion: 1;
  reportHash: string;
  eligibilityHash: string;
  checkedAt: string;
  expiresAt: string;
  documents: Array<{
    sourceKey: string;
    contentHash: string;
    retrievedAt: string;
  }>;
}

export interface FloridaReviewedSourceRecord {
  chargeId: string;
  canonicalTitle: string;
  code: string;
  citation: string;
  conduct: string;
  grading: string;
  interpretation: string;
  offense: FloridaReviewedDocument;
  identityEvidence: FloridaReviewedEvidenceSpan;
  conductEvidence: FloridaReviewedEvidenceSpan[];
  gradeEvidence: FloridaReviewedDraft["gradeEvidence"];
  dependencies: Array<FloridaReviewedDocument & {
    dependencyRole: FloridaReviewedDependencyRole;
    supportRole: AuthoritySupportRole;
  }>;
  reviewedLegalDecision: Record<string, unknown> | null;
}

const hashJson = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const hashText = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const normalizeSubdivision = (value: string | null) =>
  (value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
const expectedSourceKey = (section: string, subdivision: string | null) => {
  const suffix = subdivision
    ? `:${subdivision.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}`
    : "";
  return `fl:statute:${section}${suffix}`;
};
const authorityRole = (role: FloridaReviewedDependencyRole): AuthoritySupportRole =>
  role === "definition" || role === "exception" || role === "justification"
    ? "grading"
    : role;
const normalizeIdentityText = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export function floridaIdentityQuoteStatesName(name: string, quote: string): boolean {
  const normalizedName = normalizeIdentityText(name);
  const normalizedQuote = normalizeIdentityText(quote);
  return [
    `offense of ${normalizedName}`,
    `commits ${normalizedName}`,
    `commits a ${normalizedName}`,
    `commits an ${normalizedName}`,
    `commits the ${normalizedName}`,
    `commit ${normalizedName}`,
    `guilty of ${normalizedName}`,
    `guilty of a ${normalizedName}`,
    `guilty of an ${normalizedName}`,
    `guilty of the ${normalizedName}`,
    `known as ${normalizedName}`,
    `is ${normalizedName}`,
    `is a ${normalizedName}`,
    `is an ${normalizedName}`,
    `is the ${normalizedName}`,
    `constitutes ${normalizedName}`,
  ].some(phrase => normalizedQuote.includes(phrase));
}

function validateSpan(
  span: FloridaReviewedEvidenceSpan,
  document: FloridaReviewedDocument,
  requireSubdivision: string | null,
): boolean {
  const body = span.target === "title" ? document.title : document.text;
  if (span.sourceKey !== document.sourceKey || span.sourceHash !== document.contentHash ||
      !Number.isInteger(span.start) || !Number.isInteger(span.end) ||
      span.start < 0 || span.end <= span.start || body.slice(span.start, span.end) !== span.text) {
    return false;
  }
  if (!requireSubdivision) return true;
  if (span.target !== "text") return false;
  const wanted = normalizeSubdivision(requireSubdivision);
  const deterministic = findSubdivisionRange(document.text, requireSubdivision)[0];
  if (!deterministic) return false;
  return document.subdivisionRanges.some(range =>
    normalizeSubdivision(range.subdivision) === wanted &&
    range.start === deterministic.start && range.end === deterministic.end &&
    span.start >= range.start && span.end <= range.end &&
    range.start >= 0 && range.end <= document.text.length && range.end > range.start);
}

/**
 * Pure fail-closed assembler. Collection output never grants eligibility:
 * every eligible row must be independently and exactly pinned by the ledger.
 */
export function buildFloridaReviewedSourceRecords(
  definitions: readonly EvidenceBackedChargeDefinition[],
  report: FloridaReviewedReport,
  eligibility: FloridaReviewedEligibility,
): FloridaReviewedSourceRecord[] {
  if (report.schemaVersion !== 1 || report.kind !== "florida_source_first_review" ||
      eligibility.schemaVersion !== 1 || eligibility.reportHash !== hashJson(report)) {
    throw new Error("Florida reviewed report or eligibility binding is invalid");
  }
  const definitionMap = new Map(definitions.map(row => [row.id, row]));
  const draftMap = new Map(report.drafts.map(row => [row.id, row]));
  const decisions = new Map(eligibility.decisions.map(row => [row.id, row]));
  const technicalHolds = new Map(
    (report.technicalHolds ?? []).map(row => [row.id, row]),
  );
  if (definitionMap.size !== definitions.length || draftMap.size !== report.drafts.length ||
      decisions.size !== eligibility.decisions.length ||
      technicalHolds.size !== (report.technicalHolds?.length ?? 0) ||
      definitionMap.size !== decisions.size ||
      [...draftMap.keys()].some(id => !definitionMap.has(id) || !decisions.has(id)) ||
      [...technicalHolds.keys()].some(id => !definitionMap.has(id) || draftMap.has(id)) ||
      [...decisions.values()].some(decision =>
        decision.status === "eligible" && !draftMap.has(decision.id))) {
    throw new Error("Florida reviewed drafts, definitions, and decisions require complete unique accounting");
  }
  for (const [id, definition] of definitionMap) {
    if (draftMap.has(id)) continue;
    const decision = decisions.get(id);
    const technicalHold = technicalHolds.get(id);
    if (!decision || decision.status !== "held" || !technicalHold ||
        decision.reason !== technicalHold.reason ||
        decision.draftHash !== hashJson({ id, technicalHold }) ||
        decision.definitionHash !== hashJson(definition) ||
        decision.approvalHash !== hashJson({
          id: decision.id,
          status: decision.status,
          reason: decision.reason,
          draftHash: decision.draftHash,
          definitionHash: decision.definitionHash,
        })) {
      throw new Error(`Florida technical hold is not stably accounted: ${id}`);
    }
  }

  const records: FloridaReviewedSourceRecord[] = [];
  for (const draft of report.drafts) {
    const definition = definitionMap.get(draft.id);
    const decision = decisions.get(draft.id);
    if (!definition || !decision || definition.id !== draft.id ||
        definition.name !== draft.name || definition.code !== draft.code ||
        definition.jurisdiction !== "FL" || !definition.id.startsWith("fl-fs-") ||
        definition.citations[0]?.citation !== draft.citation ||
        decision.draftHash !== hashJson(draft) ||
        decision.definitionHash !== hashJson(definition) ||
        decision.approvalHash !== hashJson({
          id: decision.id,
          status: decision.status,
          reason: decision.reason,
          draftHash: decision.draftHash,
          definitionHash: decision.definitionHash,
        })) {
      throw new Error(`Florida reviewed draft approval binding failed: ${draft.id}`);
    }
    if (decision.status !== "eligible") continue;

    const offense = report.sourceEvidence[draft.primarySourceKey];
    const dependencies = new Map(
      draft.requiredDependencies.map(row => [`${row.sourceKey}|${row.role}`, row]),
    );
    const offenseDependencies = draft.requiredDependencies.filter(row => row.role === "offense");
    const primaryOffenseDependency = offenseDependencies[0];
    const citation = draft.citation.match(
      /^Fla\.\s+Stat\.\s+§\s+(\d{3,4}\.\d{2,6})(.*)$/i,
    );
    const citedSubdivision = citation?.[2]?.trim() || null;
    if (!offense || dependencies.size !== draft.requiredDependencies.length ||
        offenseDependencies.length !== 1 ||
        primaryOffenseDependency?.sourceKey !== draft.primarySourceKey ||
        primaryOffenseDependency.contentHash !== offense.contentHash ||
        offense.citation !== draft.citation || offense.contentHash !== hashText(offense.text) ||
        offense.sourceKey !== draft.primarySourceKey ||
        !citation || citation[1] !== offense.section ||
        normalizeSubdivision(citedSubdivision) !== normalizeSubdivision(offense.subdivision) ||
        draft.code !== `${offense.section}${offense.subdivision ?? ""}` ||
        offense.sourceKey !== expectedSourceKey(offense.section, offense.subdivision) ||
        !offense.sourceUrl.startsWith("https://www.leg.state.fl.us/statutes/") ||
        !Number.isFinite(Date.parse(offense.retrievedAt)) ||
        !validateSpan(
          draft.identityEvidence,
          offense,
          draft.identityEvidence.target === "text" ? offense.subdivision : null,
        )) {
      throw new Error(`Florida reviewed offense identity or primary authority failed: ${draft.id}`);
    }
    for (const secondary of definition.citations.slice(1)) {
      const secondaryMatch = secondary.citation.match(
        /^Fla\.\s+Stat\.\s+§\s+(\d{3,4}\.\d{2,6})$/i,
      );
      const supporting = draft.requiredDependencies.find(dependency => {
        const document = report.sourceEvidence[dependency.sourceKey];
        return dependency.role !== "offense" &&
          document?.section === secondaryMatch?.[1] &&
          document.sourceUrl === secondary.url &&
          document.subdivision === null;
      });
      if (!secondaryMatch || !supporting) {
        throw new Error(
          `Florida public secondary citation lacks a declared whole-section supporting role: ${draft.id}`,
        );
      }
    }
    const normalizedTitle = normalizeIdentityText(offense.title);
    const normalizedName = normalizeIdentityText(draft.name);
    if (normalizedTitle !== normalizedName &&
        !floridaIdentityQuoteStatesName(draft.name, draft.identityEvidence.text)) {
      throw new Error(`Florida reviewed heading/guilt-clause identity failed: ${draft.id}`);
    }
    if (!draft.conductEvidence.length || draft.conductEvidence.some(span =>
      span.sourceKey !== offense.sourceKey ||
      !validateSpan(span, offense, offense.subdivision))) {
      throw new Error(`Florida reviewed conduct is not bound to the cited offense scope: ${draft.id}`);
    }
    const possibleCategories = definition.categories ?? [definition.category];
    if (draft.gradeEvidence.length < possibleCategories.length ||
        possibleCategories.some(category => !draft.gradeEvidence.some(span =>
          span.category === category &&
          span.target === "text" &&
          Boolean(report.sourceEvidence[span.sourceKey]) &&
          validateSpan(
            span,
            report.sourceEvidence[span.sourceKey],
            report.sourceEvidence[span.sourceKey].subdivision,
          )))) {
      throw new Error(`Florida semantic grade requires pinned quoted evidence: ${draft.id}`);
    }

    const resolved = draft.requiredDependencies.map(dependency => {
      const document = report.sourceEvidence[dependency.sourceKey];
      if (!document || dependency.contentHash !== document.contentHash ||
          document.contentHash !== hashText(document.text) ||
          document.sourceKey !== expectedSourceKey(document.section, document.subdivision) ||
          !document.sourceUrl.startsWith("https://www.leg.state.fl.us/statutes/") ||
          !Number.isFinite(Date.parse(document.retrievedAt)) ||
          ![
            "offense", "grading", "penalty", "definition", "exception", "justification",
          ].includes(dependency.role)) {
        throw new Error(`Florida required dependency changed or is unavailable: ${draft.id}`);
      }
      return {
        ...document,
        dependencyRole: dependency.role,
        supportRole: authorityRole(dependency.role),
      };
    });
    records.push({
      chargeId: draft.id,
      canonicalTitle: draft.name,
      code: draft.code,
      citation: draft.citation,
      conduct: draft.conduct,
      grading: draft.grading,
      interpretation: draft.interpretation,
      offense,
      identityEvidence: draft.identityEvidence,
      conductEvidence: draft.conductEvidence,
      gradeEvidence: draft.gradeEvidence,
      dependencies: resolved,
      reviewedLegalDecision: draft.legalReview,
    });
  }
  return records;
}

export interface FloridaReviewedAnalysisEntry {
  id: string;
  section: string;
  status: "eligible" | "held" | "duplicate" | "support_only";
  reason: string;
  identity: {
    kind: "official_heading" | "operative_guilt_clause";
    quote: string;
    sourceHash: string;
  } | null;
  conductQuotes: string[];
  gradingQuotes: string[];
  requiredSections: Array<{
    section: string;
    role: FloridaReviewedDependencyRole;
    contentHash: string;
  }>;
  notes: string;
}

export interface FloridaReviewedCacheDocument {
  section: string;
  title: string;
  text: string;
  contentHash: string;
  sourceUrl: string;
  acquiredFrom: string;
  retrievedAt: string;
  effectiveDateStart: string | null;
  edition: string;
  currentnessProvenance: string;
  acquisitionKind:
    | "official_whole_chapter"
    | "official_exact_section"
    | "existing_manifest_seed";
}

export interface FloridaReviewedSourceCache {
  schemaVersion: 1;
  jurisdiction: "FL";
  documents: Record<string, FloridaReviewedCacheDocument>;
}

export interface FloridaReviewedAssemblyResult {
  report: FloridaReviewedReport;
  technicalHolds: Array<{ id: string; reason: string }>;
}

export function findSubdivisionRange(
  text: string,
  subdivision: string | null,
): FloridaReviewedSubdivisionRange[] {
  if (!subdivision) return [];
  const markers = [...text.matchAll(
    /^(\(\d+\)(?:\([a-z]+\))?(?:\d+\.)?(?:[a-z]+\.)?|\([a-z]+\)(?:\d+\.)?(?:[a-z]+\.)?|\d+\.(?:[a-z]+\.)?|[a-z]+\.)[\t\u2000-\u206f ]*$/gm,
  )].map(match => ({
    label: match[1].toLowerCase(),
    start: match.index,
    after: match.index + match[0].length,
  }));
  const topEnd = (index: number) =>
    markers.slice(index + 1).find(marker => /^\(\d+\)/.test(marker.label))?.start ?? text.length;
  const rangeCitation = subdivision.match(/^\(([a-z0-9]+)\)\s*-\s*\(([a-z0-9]+)\)$/i);
  if (rangeCitation) {
    const startIndex = markers.findIndex(marker =>
      marker.label.startsWith(`(${rangeCitation[1].toLowerCase()})`));
    const endIndex = markers.findIndex((marker, index) =>
      index >= startIndex &&
      marker.label.startsWith(`(${rangeCitation[2].toLowerCase()})`));
    if (startIndex < 0 || endIndex < startIndex) return [];
    return [{
      subdivision,
      start: markers[startIndex].start,
      end: topEnd(endIndex),
    }];
  }
  const match = subdivision.match(
    /^\((\d+)\)(?:\(([a-z]+)\))?(?:(\d+)\.)?(?:([a-z]+)\.)?$/i,
  );
  if (!match) return [];
  const [, top, alpha, number, letter] = match;
  const topIndex = markers.findIndex(marker => marker.label.startsWith(`(${top})`));
  if (topIndex < 0) return [];
  const parentEnd = topEnd(topIndex);
  let start = markers[topIndex].start;
  let end = parentEnd;
  let searchAfter = topIndex;
  if (alpha) {
    const combined = markers[topIndex].label.startsWith(
      `(${top})(${alpha.toLowerCase()})`,
    );
    if (!combined) {
      const childIndex = markers.findIndex((marker, index) =>
        index > topIndex && marker.start < parentEnd &&
        marker.label.startsWith(`(${alpha.toLowerCase()})`));
      if (childIndex < 0) return [];
      start = markers[childIndex].start;
      searchAfter = childIndex;
    }
    end = markers.slice(searchAfter + 1).find(marker =>
      marker.start < parentEnd && /^\([a-z]+\)/.test(marker.label))?.start ?? parentEnd;
  }
  if (number) {
    const itemIndex = markers[searchAfter].label.match(
      new RegExp(`(?:^|\\))${number}\\.`),
    )
      ? searchAfter
      : markers.findIndex((marker, index) =>
        index > searchAfter && marker.start < end &&
        (marker.label.startsWith(`${number}.`) ||
          marker.label.includes(`)${number}.`)));
    if (itemIndex < 0) return [];
    start = markers[itemIndex].start;
    end = markers.slice(itemIndex + 1).find(marker =>
      marker.start < end &&
      (marker.label.match(/^(?:\([a-z]+\))?\d+\./) !== null))?.start ?? end;
    searchAfter = itemIndex;
  }
  if (letter) {
    const wanted = `${letter.toLowerCase()}.`;
    const itemIndex = markers[searchAfter].label.endsWith(wanted)
      ? searchAfter
      : markers.findIndex((marker, index) =>
        index > searchAfter && marker.start < end && marker.label === wanted);
    if (itemIndex < 0) return [];
    start = markers[itemIndex].start;
    end = markers.slice(itemIndex + 1).find(marker =>
      marker.start < end && /^[a-z]+\.$/.test(marker.label))?.start ?? end;
  }
  return [{ subdivision, start, end }];
}

function uniqueSpan(
  body: string,
  quote: string,
  bounds?: { start: number; end: number },
): { start: number; end: number } | null {
  const startAt = bounds?.start ?? 0;
  const endAt = bounds?.end ?? body.length;
  const first = body.indexOf(quote, startAt);
  if (first < startAt || first + quote.length > endAt || !quote.length) return null;
  const second = body.indexOf(quote, first + 1);
  return second >= 0 && second < endAt
    ? null
    : { start: first, end: first + quote.length };
}

function quoteLocationProblem(
  body: string,
  quote: string,
  bounds?: { start: number; end: number },
): string | null {
  if (!quote.length) return "empty quote";
  const locations: number[] = [];
  for (let at = body.indexOf(quote); at >= 0; at = body.indexOf(quote, at + 1)) {
    locations.push(at);
  }
  if (!locations.length) return "quote absent from source";
  const scoped = locations.filter(at =>
    at >= (bounds?.start ?? 0) && at + quote.length <= (bounds?.end ?? body.length));
  if (!scoped.length) return bounds
    ? "quote exists only outside cited subdivision"
    : "quote absent from target";
  if (scoped.length > 1) return "quote is non-unique in required scope";
  return null;
}

export function floridaGradeQuoteStatesCategory(
  quote: string,
  category: EvidenceBackedChargeDefinition["category"],
): boolean {
  return category === "felony"
    ? /\bfelon(?:y|ies)\b/i.test(quote)
    : category === "misdemeanor"
      ? /\bmisdemeanor(?:s)?\b/i.test(quote)
      : /\binfraction(?:s)?\b|\bnoncriminal violation\b/i.test(quote);
}

function floridaOfficialSectionUrl(section: string): string {
  const [chapterText, subsection] = section.split(".");
  const chapter = Number(chapterText);
  const rangeStart = Math.floor(chapter / 100) * 100;
  const range = `${String(rangeStart).padStart(4, "0")}-${String(rangeStart + 99).padStart(4, "0")}`;
  const chapterPath = String(chapter).padStart(4, "0");
  return `https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=${range}/${chapterPath}/Sections/${chapterPath}.${subsection}.html`;
}

function cacheDocumentHasExactOfficialIdentity(
  document: FloridaReviewedCacheDocument,
): boolean {
  const heading = document.text.match(
    /^([1-9]\d{0,3}\.\d{2,6})\s*\n+(.+?)\n+—/,
  );
  return document.sourceUrl === floridaOfficialSectionUrl(document.section) &&
    heading?.[1] === document.section &&
    heading?.[2]?.replace(/[.;\s]+$/, "").trim() === document.title;
}

/**
 * Adapts explicit analyst decisions and the official cache to the runtime
 * report. It deliberately emits no eligibility ledger or freshness receipt.
 * Anything that cannot be proved from exact current evidence is a technical
 * hold for the manual review packet.
 */
export function assembleFloridaReviewedReport(
  definitions: readonly EvidenceBackedChargeDefinition[],
  analyses: readonly FloridaReviewedAnalysisEntry[],
  cache: FloridaReviewedSourceCache,
  now = new Date(),
): FloridaReviewedAssemblyResult {
  if (cache.schemaVersion !== 1 || cache.jurisdiction !== "FL" ||
      !cache.documents || Array.isArray(cache.documents)) {
    throw new Error("Florida reviewed source cache header is invalid");
  }
  const technicalHolds: FloridaReviewedAssemblyResult["technicalHolds"] = [];
  const drafts: FloridaReviewedDraft[] = [];
  const sourceEvidence: Record<string, FloridaReviewedDocument> = {};
  const analysisById = new Map(analyses.map(entry => [entry.id, entry]));
  if (analysisById.size !== analyses.length) {
    throw new Error("Florida reviewed analyst entries must have unique IDs");
  }

  for (const definition of definitions) {
    const analysis = analysisById.get(definition.id);
    const hold = (reason: string) => technicalHolds.push({ id: definition.id, reason });
    if (!analysis || analysis.status !== "eligible") {
      hold(analysis?.reason || "No explicit eligible analyst decision exists");
      continue;
    }
    if (!analysis.identity || !Array.isArray(analysis.conductQuotes) ||
        !Array.isArray(analysis.gradingQuotes) ||
        !Array.isArray(analysis.requiredSections) ||
        typeof analysis.reason !== "string" || !analysis.reason.trim() ||
        typeof analysis.notes !== "string" ||
        !definition.citations[0]) {
      hold("Eligible analyst entry or localized definition is malformed");
      continue;
    }
    const sectionMatch = definition.code.match(/^(\d{3,4}\.\d{2,6})(.*)$/);
    const section = sectionMatch?.[1];
    const subdivision = sectionMatch?.[2]?.trim() || null;
    const primary = section ? cache.documents[section] : undefined;
    const ranges = primary ? findSubdivisionRange(primary.text, subdivision) : [];
    const bounds = subdivision ? ranges[0] : undefined;
    const current = (document: FloridaReviewedCacheDocument | undefined) => {
      const retrievedAt = Date.parse(document?.retrievedAt ?? "");
      return document?.edition === "Florida Statutes 2026" &&
        (document.acquisitionKind === "official_whole_chapter" ||
          document.acquisitionKind === "official_exact_section") &&
        cacheDocumentHasExactOfficialIdentity(document) &&
        document.contentHash === hashText(document.text) &&
        Number.isFinite(retrievedAt) && retrievedAt <= now.getTime() &&
        now.getTime() - retrievedAt <= FLORIDA_REVIEWED_MAX_AGE_MS;
    };
    if (!section || analysis.section !== section || !primary || !current(primary) ||
        (subdivision && !bounds)) {
      hold("Exact current primary section or deterministic cited-subdivision boundary is unavailable");
      continue;
    }
    if (definition.citations[0].citation !== `Fla. Stat. § ${definition.code}` ||
        definition.citations[0].url !== primary.sourceUrl) {
      hold("Public primary citation/code or URL does not exactly match the cited official source");
      continue;
    }
    const required = analysis.requiredSections;
    const offenseDependencies = required.filter(row => row.role === "offense");
    if (offenseDependencies.length !== 1 || offenseDependencies[0].section !== section) {
      hold("Exactly one matching primary offense dependency is required");
      continue;
    }
    const secondaryProblems = definition.citations.slice(1).flatMap(citation => {
      const match = citation.citation.match(
        /^Fla\.\s+Stat\.\s+§\s+(\d{3,4}\.\d{2,6})$/i,
      );
      if (!match) return [`${citation.citation}: secondary citation is not whole-section exact`];
      const dependency = required.find(row =>
        row.section === match[1] && row.role !== "offense");
      const document = cache.documents[match[1]];
      if (!dependency) {
        return [`${citation.citation}: no declared supporting dependency role`];
      }
      if (document?.sourceUrl !== citation.url) {
        return [`${citation.citation}: public URL does not match the required official source`];
      }
      return [];
    });
    if (secondaryProblems.length) {
      hold(`Public secondary citations failed: ${secondaryProblems.join("; ")}`);
      continue;
    }
    const resolved = required.map(row => ({ row, document: cache.documents[row.section] }));
    const dependencyProblems = resolved.flatMap(({ row, document }) => {
      if (!document) return [`${row.section} (${row.role}): missing`];
      if (document.section !== row.section) {
        return [`${row.section} (${row.role}): cache identity mismatch`];
      }
      if (document.contentHash !== row.contentHash) {
        return [`${row.section} (${row.role}): analyst/cache hash mismatch`];
      }
      if (!current(document)) {
        return [
          `${row.section} (${row.role}): not current official Florida Statutes 2026 evidence`,
        ];
      }
      return [];
    });
    if (new Set(required.map(row => `${row.section}|${row.role}`)).size !== required.length) {
      dependencyProblems.push("duplicate section/role dependency");
    }
    if (dependencyProblems.length) {
      hold(`Required dependencies failed: ${dependencyProblems.join("; ")}`);
      continue;
    }

    const primaryKey = expectedSourceKey(section, subdivision);
    const identityTarget = analysis.identity.kind === "official_heading" ? "title" : "text";
    const identityBody = identityTarget === "title" ? primary.title : primary.text;
    const identityBounds = identityTarget === "text" ? bounds : undefined;
    const identityLocation = uniqueSpan(identityBody, analysis.identity.quote, identityBounds);
    const conductLocations = analysis.conductQuotes.map(quote =>
      uniqueSpan(primary.text, quote, bounds));
    const normalizedName = normalizeIdentityText(definition.name);
    const literalIdentity = analysis.identity.kind === "official_heading"
      ? normalizeIdentityText(primary.title) === normalizedName &&
        analysis.identity.quote === primary.title
      : floridaIdentityQuoteStatesName(definition.name, analysis.identity.quote);
    const identityProblems: string[] = [];
    if (analysis.identity.sourceHash !== primary.contentHash) {
      identityProblems.push("identity source hash does not match primary");
    }
    if (!literalIdentity) {
      identityProblems.push(
        analysis.identity.kind === "official_heading"
          ? "identity is not the exact official heading/name"
          : "identity quote lacks an exact statutory naming phrase",
      );
    }
    if (!identityLocation) {
      identityProblems.push(
        `identity ${quoteLocationProblem(identityBody, analysis.identity.quote, identityBounds)}`,
      );
    }
    if (!analysis.conductQuotes.length) {
      identityProblems.push("no conduct quote supplied");
    }
    analysis.conductQuotes.forEach((quote, index) => {
      if (!conductLocations[index]) {
        identityProblems.push(
          `conduct quote ${index + 1} ${quoteLocationProblem(primary.text, quote, bounds)}`,
        );
      }
    });
    if (identityProblems.length) {
      hold(`Identity/conduct evidence failed: ${identityProblems.join("; ")}`);
      continue;
    }

    const documents = new Map<string, FloridaReviewedDocument>();
    for (const { row, document } of resolved) {
      if (!document) continue;
      const isPrimary = row.role === "offense";
      const documentSubdivision = isPrimary ? subdivision : null;
      const sourceKey = expectedSourceKey(row.section, documentSubdivision);
      const reviewedDocument: FloridaReviewedDocument = {
        sourceKey,
        section: row.section,
        subdivision: documentSubdivision,
        citation: `Fla. Stat. § ${row.section}${documentSubdivision ?? ""}`,
        title: document.title,
        sourceUrl: document.sourceUrl,
        text: document.text,
        contentHash: document.contentHash,
        retrievedAt: document.retrievedAt,
        effectiveDateStart: document.effectiveDateStart,
        subdivisionRanges: isPrimary ? ranges : [],
      };
      const existing = documents.get(sourceKey);
      if (existing) {
        if (existing.section !== reviewedDocument.section ||
            existing.subdivision !== reviewedDocument.subdivision ||
            existing.citation !== reviewedDocument.citation ||
            existing.sourceUrl !== reviewedDocument.sourceUrl ||
            existing.contentHash !== reviewedDocument.contentHash ||
            existing.text !== reviewedDocument.text) {
          hold(`Source ${sourceKey} resolves to inconsistent physical evidence`);
          documents.clear();
          break;
        }
        if (isPrimary) documents.set(sourceKey, reviewedDocument);
      } else {
        documents.set(sourceKey, reviewedDocument);
      }
    }
    if (!documents.size) continue;

    const gradeProblems: string[] = [];
    const gradeLocations = analysis.gradingQuotes.map((quote, quoteIndex) => {
      const matches = [...documents.values()].flatMap(document => {
        const location = uniqueSpan(document.text, quote,
          document.sourceKey === primaryKey ? bounds : undefined);
        return location ? [{ document, location, quote }] : [];
      });
      const physical = new Map<string, typeof matches>();
      for (const candidate of matches) {
        const key = [
          candidate.document.section,
          candidate.document.contentHash,
          candidate.location.start,
          candidate.location.end,
        ].join("|");
        physical.set(key, [...(physical.get(key) ?? []), candidate]);
      }
      if (!physical.size) {
        const sourceProblems = [...documents.values()].map(document => {
          const problem = quoteLocationProblem(
            document.text,
            quote,
            document.sourceKey === primaryKey ? bounds : undefined,
          );
          return `${document.section}${document.subdivision ?? ""}: ${problem}`;
        });
        gradeProblems.push(
          `grade quote ${quoteIndex + 1} has no unique match (${sourceProblems.join(", ")})`,
        );
        return null;
      }
      if (physical.size > 1) {
        gradeProblems.push(
          `grade quote ${quoteIndex + 1} matches different physical passages: ${
            [...physical.keys()].join(", ")
          }`,
        );
        return null;
      }
      const candidates = [...physical.values()][0];
      return candidates.find(candidate => candidate.document.sourceKey === primaryKey) ??
        candidates[0];
    });
    const categories = definition.categories ?? [definition.category];
    const categoryLocations = categories.map(category => {
      const match = gradeLocations.find(candidate =>
        candidate && floridaGradeQuoteStatesCategory(candidate.quote, category));
      if (!match) gradeProblems.push(`no grade quote expressly states category ${category}`);
      return match ? { category, match } : null;
    });
    if (gradeProblems.length || gradeLocations.some(row => !row) ||
        categoryLocations.some(row => !row)) {
      hold(`Semantic grade evidence failed: ${gradeProblems.join("; ")}`);
      continue;
    }
    // One operative quote may expressly state multiple possible classes. Reuse
    // that exact span rather than assigning classes by analyst quote order.
    const gradeEvidence = categoryLocations.map(row => ({
      sourceKey: row!.match.document.sourceKey,
      target: "text" as const,
      text: row!.match.quote,
      start: row!.match.location.start,
      end: row!.match.location.end,
      sourceHash: row!.match.document.contentHash,
      category: row!.category,
    }));
    drafts.push({
      id: definition.id,
      name: definition.name,
      code: definition.code,
      citation: definition.citations[0].citation,
      primarySourceKey: primaryKey,
      identityEvidence: {
        sourceKey: primaryKey,
        target: identityTarget,
        text: analysis.identity.quote,
        start: identityLocation!.start,
        end: identityLocation!.end,
        sourceHash: primary.contentHash,
      },
      conductEvidence: analysis.conductQuotes.map((quote, index) => ({
        sourceKey: primaryKey,
        target: "text" as const,
        text: quote,
        start: conductLocations[index]!.start,
        end: conductLocations[index]!.end,
        sourceHash: primary.contentHash,
      })),
      gradeEvidence,
      requiredDependencies: resolved.map(({ row }) => {
        const sourceKey = expectedSourceKey(row.section, row.role === "offense" ? subdivision : null);
        return { sourceKey, role: row.role, contentHash: row.contentHash };
      }),
      conduct: analysis.conductQuotes.join("\n"),
      grading: analysis.gradingQuotes.join("\n"),
      interpretation: analysis.notes,
      legalReview: null,
    });
    for (const document of documents.values()) sourceEvidence[document.sourceKey] = document;
  }
  return {
    report: {
      schemaVersion: 1,
      kind: "florida_source_first_review",
      drafts,
      sourceEvidence,
      ...(technicalHolds.length ? { technicalHolds } : {}),
    },
    technicalHolds,
  };
}

export function validateFloridaReviewedRefreshReceipt(
  receipt: FloridaReviewedReceipt,
  report: FloridaReviewedReport,
  eligibility: FloridaReviewedEligibility,
  records: readonly FloridaReviewedSourceRecord[],
  now = new Date(),
): string | null {
  const checkedAt = new Date(receipt.checkedAt);
  const expiresAt = new Date(receipt.expiresAt);
  const expected = new Map(records.flatMap(record =>
    record.dependencies.map(document => [document.sourceKey, {
      sourceKey: document.sourceKey,
      contentHash: document.contentHash,
      retrievedAt: document.retrievedAt,
    }] as const)));
  const actual = new Map(receipt.documents?.map(document => [document.sourceKey, document]) ?? []);
  const oldestRetrieval = Math.min(...[...expected.values()].map(document =>
    Date.parse(document.retrievedAt)));
  if (receipt.schemaVersion !== 1 || receipt.reportHash !== hashJson(report) ||
      receipt.eligibilityHash !== hashJson(eligibility) ||
      Number.isNaN(checkedAt.getTime()) || Number.isNaN(expiresAt.getTime()) ||
      checkedAt > now || expiresAt <= now || expiresAt <= checkedAt ||
      expiresAt.getTime() - checkedAt.getTime() > FLORIDA_REVIEWED_MAX_AGE_MS ||
      (expected.size > 0 && (!Number.isFinite(oldestRetrieval) ||
        expiresAt.getTime() > oldestRetrieval + FLORIDA_REVIEWED_MAX_AGE_MS)) ||
      actual.size !== expected.size ||
      receipt.documents.length !== actual.size ||
      [...expected].some(([key, value]) => JSON.stringify(actual.get(key)) !== JSON.stringify(value))) {
    return "Florida reviewed freshness receipt is malformed, mismatched, stale, or incomplete";
  }
  return null;
}

function loadReviewedInputs(): {
  report: FloridaReviewedReport;
  eligibility: FloridaReviewedEligibility;
  receipt: FloridaReviewedReceipt | null;
  hasRuntimeReport: boolean;
} {
  const hasReport = existsSync(FLORIDA_REVIEWED_REPORT_PATH);
  const hasReceipt = existsSync(FLORIDA_REVIEWED_RECEIPT_PATH);
  if (!hasReport && !hasReceipt) {
    return {
      report: { schemaVersion: 1, kind: "florida_source_first_review", drafts: [], sourceEvidence: {} },
      eligibility: {
        schemaVersion: 1,
        reportHash: hashJson({
          schemaVersion: 1,
          kind: "florida_source_first_review",
          drafts: [],
          sourceEvidence: {},
        }),
        decisions: [],
      },
      receipt: null,
      hasRuntimeReport: false,
    };
  }
  if (!hasReport) throw new Error("Florida reviewed report is required when reviewed data is present");
  return {
    report: JSON.parse(readFileSync(FLORIDA_REVIEWED_REPORT_PATH, "utf8")) as FloridaReviewedReport,
    eligibility: eligibilityFile as FloridaReviewedEligibility,
    receipt: hasReceipt
      ? JSON.parse(readFileSync(FLORIDA_REVIEWED_RECEIPT_PATH, "utf8")) as FloridaReviewedReceipt
      : null,
    hasRuntimeReport: true,
  };
}

const loaded = loadReviewedInputs();
export const FLORIDA_REVIEWED_SOURCE_RECORDS = buildFloridaReviewedSourceRecords(
  loaded.hasRuntimeReport ? FLORIDA_REVIEWED_DEFINITIONS : [],
  loaded.report,
  loaded.eligibility,
);

export function isFloridaReviewedSourceFresh(now = new Date()): boolean {
  return FLORIDA_REVIEWED_SOURCE_RECORDS.length === 0 || Boolean(
    loaded.receipt &&
    validateFloridaReviewedRefreshReceipt(
      loaded.receipt, loaded.report, loaded.eligibility,
      FLORIDA_REVIEWED_SOURCE_RECORDS, now,
    ) === null,
  );
}