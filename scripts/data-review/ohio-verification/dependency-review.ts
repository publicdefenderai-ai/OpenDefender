import { createHash } from "node:crypto";
import type { VerificationBatch } from "./verify-batch";
import { extractOhioCrossReferences } from "../ohio-discovery/offense-extractor";

export interface DependencyEvidence { section: string; sourceHash: string; start: number; end: number; text: string }
interface ResearchItem { evidence: DependencyEvidence[]; authorityIds?: string[] }
export interface DependencyReview {
  schemaVersion: number; kind: string; asOf: string; researchedOn: string;
  publicationStatus: string; baseBatchHash: string; enumerationHash: string;
  sources: VerificationBatch["sources"];
  modules: Array<ResearchItem & { id: string; title: string; sections: string[]; finding: string; remaining: string; status: string }>;
  externalAuthorities: Array<{ id: string; title: string; url: string; pinpoint: string; finding: string; excerpt: string; limit: string; checkedOn: string; verification: string }>;
  holdReviews: Array<ResearchItem & { id: string; sections: string[]; status: string; finding: string; proposal: string; question: string; publicationStatus: string }>;
  catalogProposals: Array<ResearchItem & { section: string; title: string; legacyIds: string[]; scopeCandidates: string[]; grade: string; proposedChange: string; penaltyFinding: string; exceptions: string; remaining: string; status: string }>;
  catalogBaseline: Array<{ id: string; section: string; kind: string; path: string; definitionHash: string; baselineDefinition: string; citationOverride: string | null; existingEligibility: string; runtimeAvailability: string }>;
  coverage: Array<{ section: string; moduleIds: string[]; proposalSection: string | null; holdIds: string[]; remaining: string; referenceSignals: Array<{ section: string; sourceUrl: string | null; sourceHash: string | null; status: string }>; dependencyStatus: string; publicationStatus: string }>;
  limitations: string[];
}
export const hashReviewText = (text: string) => createHash("sha256").update(text).digest("hex");
function requireTrue(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const sameSet = (a: string[], b: string[]) => a.length === new Set(a).size && b.length === new Set(b).size && a.length === b.length && a.every(id => b.includes(id));

/** Validate authored research without granting legal or publication approval. No cache/network needed. */
export function validateDependencyReview(review: DependencyReview, baseText: string, enumerationText: string,
  catalog: Array<{ chargeId: string; section: string | null }>, currentDefinitions: Map<string, { text: string; citationOverride: string | null; eligibility: string }>) {
  const base = JSON.parse(baseText) as VerificationBatch;
  const enumeration = JSON.parse(enumerationText) as { sections: Array<{ section: string; contentHash: string; sourceUrl: string; effectiveDate: string | null; repealed: boolean; sourceStatus?: { kind: string; asOf: string } }> };
  requireTrue(review.schemaVersion === 1 && review.kind === "ohio_dependency_review" && review.publicationStatus === "analysis_only_not_approved", "Invalid research/publication boundary");
  requireTrue(review.baseBatchHash === hashReviewText(baseText) && review.enumerationHash === hashReviewText(enumerationText) && base.enumerationHash === review.enumerationHash, "Changed base batch or enumeration; re-review instead of rebinding");
  requireTrue(review.asOf === base.asOf && /^\d{4}-\d{2}-\d{2}$/.test(review.researchedOn) && review.researchedOn >= review.asOf, "Invalid review date");
  const assigned = base.findings.map(row => row.section);
  requireTrue(sameSet(review.coverage.map(row => row.section), assigned), "Incomplete or duplicate section accounting");
  for (const [name, rows] of [["module", review.modules], ["authority", review.externalAuthorities], ["hold", review.holdReviews], ["baseline", review.catalogBaseline]] as const) {
    requireTrue(rows.length === new Set(rows.map(row => row.id)).size, `Duplicate ${name} identity`);
  }
  requireTrue(review.catalogProposals.length === new Set(review.catalogProposals.map(row => row.section)).size, "Duplicate catalog proposal");
  requireTrue(!Object.keys(review.sources).some(section => base.sources[section]), "Do not shadow a base authority");
  const sources = { ...base.sources, ...review.sources };
  const enumerated = new Map(enumeration.sections.map(row => [row.section, row]));
  for (const [section, source] of Object.entries(sources)) {
    const expected = enumerated.get(section);
    requireTrue(expected && source.section === section && source.contentHash === hashReviewText(source.text) && expected.contentHash === source.contentHash && expected.sourceUrl === source.sourceUrl && expected.effectiveDate === source.effectiveDate, `Changed authority: ${section}`);
    requireTrue(!expected.repealed && expected.sourceStatus?.asOf === review.asOf && !["uncertain", "not_yet_effective"].includes(expected.sourceStatus?.kind ?? "") && (!source.effectiveDate || source.effectiveDate <= review.asOf), `Ineligible authority: ${section}`);
  }
  for (const item of [...review.modules, ...review.holdReviews, ...review.catalogProposals]) {
    requireTrue(item.evidence.length > 0, "Missing statutory evidence");
    for (const span of item.evidence) {
      const source = sources[span.section];
      requireTrue(source && span.sourceHash === source.contentHash && Number.isInteger(span.start) && Number.isInteger(span.end) && span.start >= 0 && span.end > span.start && span.end <= source.text.length && source.text.slice(span.start, span.end) === span.text, `Invalid evidence span: ${span.section}`);
    }
    requireTrue((item.authorityIds ?? []).every(id => review.externalAuthorities.some(a => a.id === id)), "Unknown external authority");
  }
  for (const source of review.externalAuthorities) {
    requireTrue(source.verification === "research_reference_not_pinned_source" && source.checkedOn === review.researchedOn && source.limit.trim() && source.finding.trim() && source.pinpoint.trim() && source.url.startsWith("https://"), "External research cannot become pinned publication evidence");
  }
  const expectedHolds = [...new Set(base.findings.flatMap(row => row.hold ? [row.hold] : []))];
  requireTrue(sameSet(review.holdReviews.map(row => row.id), expectedHolds), "Incomplete hold accounting");
  for (const hold of review.holdReviews) {
    requireTrue(sameSet(hold.sections, base.findings.filter(row => row.hold === hold.id).map(row => row.section)) && ["agent_research", "attorney_judgment"].includes(hold.status) && hold.publicationStatus === "not_approved" && hold.question.trim() && hold.finding.trim() && hold.proposal.trim(), `Invalid hold disposition: ${hold.id}`);
  }
  for (const module of review.modules) {
    requireTrue(module.sections.length > 0 && new Set(module.sections).size === module.sections.length && module.sections.every(s => assigned.includes(s)) && module.status === "research_recorded_not_release_approval" && module.finding.trim() && module.remaining.trim(), `Invalid shared module: ${module.id}`);
  }
  const expectedCatalog = catalog.filter(row => row.section !== null && assigned.includes(row.section));
  requireTrue(sameSet(review.catalogBaseline.map(row => row.id), expectedCatalog.map(row => row.chargeId)), "Incomplete catalog baseline");
  requireTrue(sameSet(review.catalogProposals.flatMap(row => row.legacyIds), expectedCatalog.map(row => row.chargeId)), "Incomplete or duplicate catalog disposition");
  for (const row of review.catalogBaseline) {
    const current = currentDefinitions.get(row.id);
    requireTrue(current && row.definitionHash === hashReviewText(row.baselineDefinition) && hashReviewText(current.text) === row.definitionHash && current.citationOverride === row.citationOverride && current.eligibility === row.existingEligibility && expectedCatalog.some(item => item.chargeId === row.id && item.section === row.section), `Changed catalog baseline: ${row.id}`);
  }
  for (const proposal of review.catalogProposals) {
    requireTrue(proposal.status === "proposal_not_approved" && proposal.scopeCandidates.length > 0 && proposal.remaining.trim() && proposal.proposedChange.trim() && proposal.penaltyFinding.trim() && proposal.exceptions.trim() && proposal.evidence.some(span => span.section === proposal.section) && sameSet(proposal.legacyIds, expectedCatalog.filter(row => row.section === proposal.section).map(row => row.chargeId)), `Invalid catalog proposal: ${proposal.section}`);
  }
  for (const row of review.coverage) {
    requireTrue(row.dependencyStatus === "partial_research_not_closed" && row.publicationStatus === "not_approved" && row.remaining.trim() && sameSet(row.moduleIds, review.modules.filter(m => m.sections.includes(row.section)).map(m => m.id)) && sameSet(row.holdIds, review.holdReviews.filter(h => h.sections.includes(row.section)).map(h => h.id)) && row.proposalSection === (review.catalogProposals.some(p => p.section === row.section) ? row.section : null), `Invalid section disposition: ${row.section}`);
    const expectedReferences = [...new Set(extractOhioCrossReferences(base.sources[row.section].text, row.section))];
    requireTrue(sameSet(row.referenceSignals.map(ref => ref.section), expectedReferences) && row.remaining === base.findings.find(f => f.section === row.section)?.limits, `Lost baseline research requirement: ${row.section}`);
    for (const ref of row.referenceSignals) {
      const expected = enumerated.get(ref.section);
      requireTrue(ref.sourceHash === (expected?.contentHash ?? null) && ref.sourceUrl === (expected?.sourceUrl ?? null) && ref.status === (base.sources[ref.section] ? "included_authority_not_dependency_closure" : expected ? "cached_needs_substantive_review" : "missing_from_snapshot"), `Changed reference signal: ${ref.section}`);
    }
  }
  return { sectionsAccountedFor: review.coverage.length, sharedResearchModules: review.modules.length,
    addedPinnedStatutes: Object.keys(review.sources).length, catalogEntriesWithProposals: review.catalogBaseline.length,
    sourceBasedEntriesAlreadyPresent: review.catalogBaseline.filter(row => row.kind === "existing_source_based_definition").length,
    proposedSectionGroups: review.catalogProposals.length, attorneyQuestions: review.holdReviews.filter(row => row.status === "attorney_judgment").length,
    agentResearchHolds: review.holdReviews.filter(row => row.status === "agent_research").length,
    dependenciesFullyClosed: 0, approvedForPublication: 0, runtimeChanges: 0 };
}

export function renderDependencyReview(review: DependencyReview, totals: ReturnType<typeof validateDependencyReview>) {
  const links = (item: ResearchItem) => [...new Set(item.evidence.map(e => e.section))].map(s => `[§${s}](https://codes.ohio.gov/ohio-revised-code/section-${s})`).join(", ");
  const authorities = (item: ResearchItem) => (item.authorityIds ?? []).map(id => {
    const a = review.externalAuthorities.find(a => a.id === id)!;
    return `- [${a.title}](${a.url}), ${a.pinpoint}. ${a.finding} **Limit:** ${a.limit}`;
  });
  const lines = ["# Ohio dependency research and catalog proposals", "", `Statutory snapshot: ${review.asOf}. Research recorded: ${review.researchedOn}.`, "",
    `**${totals.catalogEntriesWithProposals} catalog entries, ${totals.proposedSectionGroups} proposed section groups, ${totals.sharedResearchModules} shared research modules.**`, "",
    "No live changes or publication approvals. Four source-based entries already existed; this report proposes consolidating and improving records, not counting them as new charges.", "",
    "## What this changes for the platform", "",
    "The proposed changes connect a charge name and citation to the correct conduct, degree, exceptions and remaining questions. They are not yet importable runtime records. Existing saved IDs must not silently change meaning.", ""];
  for (const p of review.catalogProposals) {
    lines.push(`### §${p.section}: ${p.title}`, "", `IDs: ${p.legacyIds.map(id => `\`${id}\``).join(", ")}.`, "",
      `**Proposed change:** ${p.proposedChange}`, "", `**Scope candidates:** ${p.scopeCandidates.join(", ")}. **Grade:** ${p.grade}.`, "",
      `**Penalty finding:** ${p.penaltyFinding}`, "", `**Exceptions and dependencies:** ${p.exceptions}`, "", `**Before implementation:** ${p.remaining}`, "",
      `Sources: ${links(p)}; shared sentencing sources below.`, ...authorities(p), "");
  }
  lines.push("## Shared research", "");
  for (const m of review.modules) lines.push(`### ${m.title}`, "", `Applies as a research topic to ${m.sections.length} assigned sections. This is not complete dependency closure.`, "", m.finding, "", `**Remaining:** ${m.remaining}`, "", `Sources: ${links(m)}.`, "");
  lines.push("## Attorney decisions", "", "These six questions concern held expansion candidates. They do not block work on the ten catalog entries above. No transcription or 51-section audit is requested. A response can approve the proposed interpretation, correct it, or keep it held with a reason; none grants publication approval. External case/history references still require release-quality source pinning and subsequent-treatment checks.", "");
  for (const h of review.holdReviews.filter(h => h.status === "attorney_judgment")) {
    lines.push(`### ${h.sections.map(s => `§${s}`).join(", ")}`, "", h.finding, "", `**Proposed treatment:** ${h.proposal}`, "", `**Question:** ${h.question}`, "", `Statutes: ${links(h)}.`, ...authorities(h), "");
    for (const span of h.evidence.slice(0, 2)) {
      const excerpt = span.text.length > 900 ? span.text.slice(0, 900) + " [excerpt ends; see linked statute]" : span.text;
      lines.push(`Key statutory excerpt, §${span.section}:`, "", `> ${excerpt.replace(/\n/g, " ").trimEnd()}`, "");
    }
  }
  lines.push("## Research retained by the agent", "");
  for (const h of review.holdReviews.filter(h => h.status === "agent_research")) lines.push(`### §${h.sections.join(", §")}`, "", h.finding, "", h.proposal, "", h.question, "", `Sources: ${links(h)}.`, ...authorities(h), "");
  lines.push("## Accounting and limits", "", `All ${totals.sectionsAccountedFor} assigned sections retain their prior limits and reference signals in the JSON ledger. None is marked dependency-complete merely because a shared module applies.`, "", ...review.limitations.map(l => `- ${l}`), "",
    "This ledger is review input. Future migration requires evidence-bound decisions, independent checking, appropriate translations, charge-document matching, source freshness and runtime validation.", "");
  return lines.join("\n");
}
