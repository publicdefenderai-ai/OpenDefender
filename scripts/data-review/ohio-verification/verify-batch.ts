import { createHash } from "node:crypto";
import type { OhioSnapshotSection } from "../ohio-discovery/snapshot-accounting";
import { extractOhioCrossReferences, type OhioTextSpan } from "../ohio-discovery/offense-extractor";
import type { OhioReconciliationRow } from "../reconcile-ohio-catalog";

export interface VerificationBatch {
  schemaVersion: number;
  kind: string;
  asOf: string;
  publicationStatus: string;
  enumerationHash: string;
  assignment: { priorityPenaltySources: string[]; sourceBatchSections: string[]; additionalFineSections: string[] };
  limitations: string[];
  sources: Record<string, { section: string; sourceUrl: string; contentHash: string; effectiveDate: string | null; text: string }>;
  findings: Array<{ section: string; sourceHash: string; conductFinding: string; penaltySection: string;
    mappings: Array<{ conductScope: string; penaltyDivision: string; grade: string; qualification: string;
      additionalPenalty: boolean; evidence: OhioTextSpan }>;
    limits: string; hold: string | null; publicationStatus: string }>;
}
const sha = (text: string) => createHash("sha256").update(text).digest("hex");

/** Validate recorded judgments; never regenerate them from changed source text. */
export function verifyOhioBatch(batch: VerificationBatch, sources: Map<string, OhioSnapshotSection>,
  enumerationText: string, catalog: OhioReconciliationRow[] = []) {
  if (batch.publicationStatus !== "analysis_only_not_approved" || batch.schemaVersion !== 1) throw new Error("Invalid batch publication boundary");
  if (sha(enumerationText) !== batch.enumerationHash) throw new Error("Batch enumeration changed; re-review evidence rather than rebinding hashes");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(batch.asOf)) throw new Error("Missing explicit assessment date");
  const assigned = [...batch.assignment.sourceBatchSections, ...batch.assignment.additionalFineSections];
  if (new Set(assigned).size !== assigned.length || new Set(batch.findings.map(row => row.section)).size !== batch.findings.length ||
      assigned.length !== batch.findings.length || assigned.some(section => !batch.findings.some(row => row.section === section))) {
    throw new Error("Incomplete or duplicate batch assignment");
  }
  for (const [section, evidence] of Object.entries(batch.sources)) {
    const current = sources.get(section);
    if (!current || evidence.section !== section || sha(evidence.text) !== evidence.contentHash ||
        sha(current.text) !== evidence.contentHash || current.contentHash !== evidence.contentHash ||
        current.sourceUrl !== evidence.sourceUrl || current.effectiveDate !== evidence.effectiveDate) {
      throw new Error(`Changed or missing authority: ${section}`);
    }
    if (current.repealed || ["not_yet_effective", "uncertain"].includes(current.sourceStatus?.kind ?? "") ||
        (current.effectiveDate && current.effectiveDate > batch.asOf)) throw new Error(`Ineligible source version: ${section}`);
  }
  const rows = batch.findings.map(finding => {
    const primary = batch.sources[finding.section], penalty = batch.sources[finding.penaltySection];
    if (!primary || !penalty || finding.sourceHash !== primary.contentHash || !finding.mappings.length ||
        finding.publicationStatus !== "not_approved" || !finding.conductFinding || !finding.limits) {
      throw new Error(`Incomplete finding or invalid publication boundary: ${finding.section}`);
    }
    for (const mapping of finding.mappings) {
      const degreeWords = ["", "first", "second", "third", "fourth", "fifth"];
      const gradeText = /^[MF][1-5]$/.test(mapping.grade)
        ? `${mapping.grade[0] === "M" ? "misdemeanor" : "felony"} of the ${degreeWords[Number(mapping.grade[1])]} degree`
        : mapping.grade === "MM" ? "minor misdemeanor"
        : mapping.grade === "fine_only" ? "shall be fined"
        : mapping.grade === "misdemeanor_unspecified_degree" ? "guilty of a misdemeanor,"
        : mapping.grade === "felony_unspecified_degree" ? "guilty of a felony and" : null;
      if (!gradeText || !mapping.evidence.text.toLowerCase().includes(gradeText)) {
        throw new Error(`Grade not supported by recorded penalty span: ${finding.section}`);
      }
      const span = mapping.evidence;
      if (!Number.isInteger(span.start) || !Number.isInteger(span.end) || span.start < 0 || span.end <= span.start ||
          penalty.text.slice(span.start, span.end) !== span.text || !span.text.trimStart().startsWith(`(${mapping.penaltyDivision})`) ||
          !span.text.includes(finding.section) || !mapping.conductScope || !mapping.grade ||
          (mapping.additionalPenalty && !mapping.qualification)) throw new Error(`Invalid penalty evidence: ${finding.section}`);
    }
    const references = [...new Set(extractOhioCrossReferences(primary.text, finding.section))].sort();
    const dependencies = references.map(section => ({ section, sourceUrl: sources.get(section)?.sourceUrl ?? null,
      sourceHash: sources.get(section)?.contentHash ?? null,
      status: batch.sources[section] ? "included_authority_not_dependency_closure" : sources.has(section) ? "cached_needs_substantive_review" : "missing_from_snapshot" }));
    const catalogRows = catalog.filter(row => row.section === finding.section).map(row => ({ chargeId: row.chargeId,
      label: row.catalogLabel, reconciliationVerdict: row.verdict,
      disposition: "source_mapping_available_no_automatic_rename_or_publication" }));
    return { ...finding, sourceUrl: primary.sourceUrl, catchline: sources.get(finding.section)?.catchline ?? "",
      penaltySourceHash: penalty.contentHash, penaltySourceUrl: penalty.sourceUrl, dependencies, catalogRows,
      verificationStatus: finding.hold ? "source_analysis_recorded_with_specific_hold" : "source_mapping_recorded_pending_release_validation",
      remainingReleaseRequirements: ["Resolve relevant incorporated statutes, administrative rules, local exceptions and case law.",
        "Confirm applicable date, sentencing dependencies and offense/variant boundaries.",
        "Complete independent review, charging-document search/alias checks and publication approval."] };
  });
  return { schemaVersion: 1, kind: "ohio_penalty_verification_report", asOf: batch.asOf,
    publicationStatus: "analysis_only_not_approved", assignment: batch.assignment,
    evidenceBinding: { enumerationHash: batch.enumerationHash, findingsHash: sha(JSON.stringify(batch)) },
    totals: { analyzedSections: rows.length, penaltyMappings: rows.reduce((sum, row) => sum + row.mappings.length, 0),
      pinnedAuthorities: Object.keys(batch.sources).length, specificHoldSections: rows.filter(row => row.hold).length,
      legacyRowsCovered: new Set(rows.flatMap(row => row.catalogRows.map(item => item.chargeId))).size,
      approvedForPublication: 0 }, limitations: batch.limitations, rows };
}

export function renderOhioBatch(report: ReturnType<typeof verifyOhioBatch>): string {
  const lines = ["# Ohio substantive verification — batch one", "",
    `**${report.totals.analyzedSections} section analyses; ${report.totals.penaltyMappings} penalty mappings; ${report.totals.pinnedAuthorities} pinned authorities.**`, "",
    "Recorded statutory analysis, not attorney approval or completed release validation. No catalog or production changes.", "",
    "A mapped grade is not a complete sentence or a decision about a particular defendant. Each section below retains exceptions, scope limits and release requirements.", "",
    "## Findings", ""];
  for (const row of report.rows) {
    lines.push(`### §${row.section} — ${row.catchline}`, "", row.conductFinding, "",
      `Sources: [conduct](${row.sourceUrl}), [penalty](${row.penaltySourceUrl}).`, "",
      "| Conduct scope | Grade stated | Penalty provision | Conditions / additional consequences |",
      "| --- | --- | --- | --- |");
    const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");
    for (const mapping of row.mappings) lines.push(`| ${cell(mapping.conductScope)} | ${cell(mapping.grade)} | ${row.penaltySection}(${mapping.penaltyDivision}) | ${cell(mapping.qualification || "No further qualification recorded in this mapping; see source and limits below.")} |`);
    lines.push("", `**Limits:** ${row.limits}`, "");
    if (row.hold) lines.push(`**Specific hold:** ${row.hold}.`, "");
    if (row.catalogRows.length) lines.push(`Linked legacy IDs: ${row.catalogRows.map(item => item.chargeId).join(", ")}.`, "");
    if (row.dependencies.length) lines.push(`Referenced-section signals (not a complete dependency inventory): ${row.dependencies.map(item => `${item.section} (${item.status})`).join("; ")}.`, "");
  }
  lines.push("## Release requirements", "", ...report.rows[0].remainingReleaseRequirements.map(text => `- ${text}`), "",
    "M1–M4 and F3–F5 identify stated degrees; MM means minor misdemeanor. Unspecified-degree labels deliberately preserve the source instead of inferring a degree from a fine or jail term.", "");
  return lines.join("\n");
}
