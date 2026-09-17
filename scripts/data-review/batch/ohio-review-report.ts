import { quoteLines, textHash, type BatchDocument, type runSourceBatch } from "./source-batch";
import { sectionReferences } from "./ohio-adapter";
import type { ReferenceLedger } from "./review-ledger";

export interface OhioBatchTarget {
  id: string;
  label: string;
  sections: string[];
  status: "configured" | "withheld";
  origin: "catalog" | "chapter_discovery";
  reason: string;
}

type BatchResult = Awaited<ReturnType<typeof runSourceBatch>>;
const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

export function extractOffenseUnits(document: BatchDocument) {
  const clauses = quoteLines(document, /\b(?:is|are|shall be) guilty of\b/i);
  return clauses.flatMap(evidence => {
    // Extract only a literal named offense, not an inferred name from a heading.
    const match = evidence.text.match(/\b(?:is|are|shall be) guilty of\s+(.+?)(?=,|;|\.|\s+and (?:shall|is|the|may)\b|$)/i);
    if (!match || /^(?:a |an |the )?(?:felony|misdemeanor|violation|offense)\b/i.test(match[1])) return [];
    return [{
      name: match[1].trim(),
      conductReference: evidence.text.match(/Whoever violates (.+?) of this section/i)?.[1] ?? null,
      evidence,
    }];
  });
}

export function buildOhioBatchReview(targets: OhioBatchTarget[], batch: BatchResult, referenceLedger?: ReferenceLedger) {
  const primarySections = [...new Set(targets.flatMap(target => target.sections))].sort();
  const groups = primarySections.map(section => {
    const affected = targets.filter(target => target.sections.includes(section));
    const document = batch.documents.get(section);
    const units = document ? extractOffenseUnits(document) : [];
    const references = document ? sectionReferences(document.text).filter(reference => reference !== section) : [];
    const selectedReferences = batch.edges[section] ?? [];
    const unavailableReferences = selectedReferences.filter(reference => !batch.documents.has(reference));
    const decisions = referenceLedger?.decisions[section];
    const exclusions = decisions?.sourceHash === document?.contentHash
      ? Object.keys(decisions?.references ?? {}).filter(reference => decisions?.references[reference].decision === "exclude") : [];
    const untriagedReferences = references.filter(reference => !selectedReferences.includes(reference) && !exclusions.includes(reference));
    const held = affected.filter(target => target.status === "withheld");
    const literalMatches = held.filter(target =>
      units.some(unit => normalize(unit.name) === normalize(target.label)),
    ).map(target => target.id);
    const questions: Array<{ kind: string; question: string }> = [];
    if (held.length && document) {
      const unmatched = held.filter(target => target.origin === "catalog" && !literalMatches.includes(target.id));
      if (unmatched.length) questions.push({
        kind: "legacy_identity",
        question: `Resolve ${unmatched.map(target => target.id).join(", ")}: retain a distinct supported scope, correct the citation, split, map to a source-first record, hold, or remove. A shared section or a similar name is not proof of equivalence.`,
      });
      if (units.length > 1) questions.push({
        kind: "conduct_and_grading",
        question: "Confirm each quoted statutory offense's conduct subdivisions and applicable grading branches. Do not turn sentencing enhancements into separate offenses.",
      });
      else questions.push({
        kind: "claim_scope",
        question: "Confirm the proposed charge's precise conduct scope, applicable exceptions, grading and incorporated definitions against the supplied full text before publication.",
      });
      if (untriagedReferences.length) questions.push({
        kind: "reference_applicability",
        question: `Determine which additional textual references affect this charge's claims: ${untriagedReferences.join(", ")}. These are leads, not automatically required dependencies; record include/exclude decisions in the reference ledger.`,
      });
    }
    return {
      section, sourceUrl: document?.sourceUrl ?? null, title: document?.title ?? null,
      sourceHash: document?.contentHash ?? null, effectiveDate: document?.effectiveDateStart ?? null,
      evidenceStatus: batch.statuses[section] ?? "not_acquired",
      targets: affected, literalNameMatches: literalMatches,
      // These are review candidates, not runtime records or automatic approvals.
      namedOffenseCandidates: units,
      gradingEvidence: document ? quoteLines(document, /\b(?:felony|misdemeanor|mandatory prison|shall be punished)\b/i) : [],
      definitionEvidence: document ? quoteLines(document, /\b(?:means|same meaning|does not include|as used in)\b/i) : [],
      references: references.map(reference => ({
        section: reference,
        sourceHash: batch.documents.get(reference)?.contentHash ?? null,
        status: batch.statuses[reference] ?? "not_acquired",
        selection: selectedReferences.includes(reference) ? "incorporation_or_review_selection"
          : exclusions.includes(reference) ? "reviewed_exclusion" : "untriaged_textual_lead",
        selectionReason: decisions?.sourceHash === document?.contentHash ? decisions?.references[reference]?.reason ?? null : null,
        applicability: "textual_reference_not_a_claim_of_legal_applicability",
      })),
      technicalBlockers: [
        ...(!document ? ["Primary official text unavailable"] : []),
        ...(batch.changedPinnedSources.includes(section) ? ["Approved source pin changed; publication receipt revoked"] : []),
        ...unavailableReferences.map(reference => `Selected reference ${reference} needs source acquisition`),
      ],
      manualQuestions: questions,
      decision: "",
      approvedSubdivisions: "",
      reviewerNote: "",
    };
  });
  const targetResults = targets.map(target => {
    const groupsForTarget = groups.filter(group => target.sections.includes(group.section));
    const primaryMissing = !target.sections.length || groupsForTarget.some(group => !group.sourceHash);
    return {
      ...target,
      reviewStatus: target.status === "configured" ? "existing_configuration_unchanged"
        : primaryMissing ? "technical_source_blocker"
        : "evidence_prepared_not_approved",
      evidenceSections: groupsForTarget.map(group => group.section),
    };
  });
  return {
    schemaVersion: 1,
    publicationStatus: "review_only_no_catalog_or_database_changes",
    inputHash: textHash(JSON.stringify({
      targets,
      sourceHashes: [...batch.documents.values()].map(document => [document.section, document.contentHash]).sort(),
    })),
    summary: {
      catalogRecords: targets.filter(target => target.origin === "catalog").length,
      withheldCatalogRecords: targets.filter(target => target.origin === "catalog" && target.status === "withheld").length,
      remainingChapterSections: targets.filter(target => target.origin === "chapter_discovery").length,
      primarySections: primarySections.length,
      sourceDocuments: batch.documents.size,
      reviewGroups: groups.filter(group => group.manualQuestions.length).length,
      literalNameMatches: new Set(groups.flatMap(group => group.literalNameMatches)).size,
      namedOffenseCandidates: groups.reduce((sum, group) => sum + group.namedOffenseCandidates.length, 0),
      targetsWithPrimarySourceBlockers: targetResults.filter(target => target.reviewStatus === "technical_source_blocker").length,
      groupsWithTechnicalBlockers: groups.filter(group => group.technicalBlockers.length).length,
    },
    targets: targetResults,
    groups,
  };
}

export function ohioTargets(
  records: Array<{ chargeId: string; catalogLabel: string; catalogCode: string; disposition: string; dispositionReason: string; mapping?: { candidateCitations?: string[] } }>,
  chapterRows: Array<{ section: string; heading: string; status: string }>,
): OhioBatchTarget[] {
  return [
    ...records.map(record => ({
      id: record.chargeId, label: record.catalogLabel,
      sections: [...new Set([
        ...sectionReferences(record.catalogCode),
        ...(record.mapping?.candidateCitations ?? []).flatMap(sectionReferences),
      ])].sort(),
      status: record.disposition === "retain" ? "configured" as const : "withheld" as const,
      origin: "catalog" as const, reason: record.dispositionReason,
    })),
    ...chapterRows.filter(row => row.status === "withheld_from_source_first_publication").map(row => ({
      id: `ohio-section-${row.section}`, label: row.heading, sections: [row.section],
      status: "withheld" as const, origin: "chapter_discovery" as const,
      reason: "Enumerated offense-bearing section without a source-first record",
    })),
  ];
}

export function reviewMarkdown(report: ReturnType<typeof buildOhioBatchReview>): string {
  const s = report.summary;
  const lines = [
    "# Ohio consolidated evidence and manual-review report", "",
    "**Review only. No new charges were approved or published by this batch.**", "",
    "## Scope", "",
    `- ${s.catalogRecords} current catalog records, including ${s.withheldCatalogRecords} withheld records.`,
    `- ${s.remainingChapterSections} remaining offense-bearing sections in the committed Chapter 2903 enumeration.`,
    "- This is NOT a complete statewide offense inventory. Other Ohio chapters have not been exhaustively enumerated at section level.",
    "- A collected reference is not a determination that it applies to a particular charge. Acquisition is technical work; deciding whether an untriaged reference applies is legal review.",
    "- Canonical-name candidates are copied from hash-bound guilt clauses, not inferred from catalog labels.",
    "- Existing configured charges retain their separate attorney and Spanish/Chinese fluent-speaker sign-off requirements.", "",
    "## Results", "",
    `- ${s.sourceDocuments} distinct source documents; ${s.primarySections} primary sections.`,
    `- ${s.namedOffenseCandidates} literal named-offense candidates; ${s.literalNameMatches} withheld record names matched literally.`,
    `- ${s.reviewGroups} section-level review groups (not one review task per catalog row).`,
    `- ${s.targetsWithPrimarySourceBlockers} targets lack primary text; ${s.groupsWithTechnicalBlockers} groups have technical blockers.`,
    "", "## Legal review", "",
    "Decisions: publish candidate / correct citation or scope / split / reclassify / deduplicate / hold / remove. A decision must identify exact subdivisions and supporting evidence. This report never consumes decisions automatically.", "",
  ];
  for (const group of report.groups.filter(group => group.manualQuestions.length)) {
    lines.push(`### § ${group.section} — ${group.title}`, "",
      `Source: ${group.sourceUrl}`, `Evidence SHA-256: ${group.sourceHash}`, "",
      `Affected records: ${group.targets.map(target => target.id).join(", ")}`, "",
    );
    for (const question of group.manualQuestions) lines.push(`- **${question.kind}:** ${question.question}`);
    if (group.namedOffenseCandidates.length) {
      lines.push("", "Statutory named-offense evidence:");
      for (const unit of group.namedOffenseCandidates) {
        lines.push(`- **${unit.name}** (${unit.conductReference ?? "conduct scope requires selection"})`, `  > ${unit.evidence.text}`);
      }
    }
    if (group.technicalBlockers.length) lines.push("", "Technical work (not a legal decision):", ...group.technicalBlockers.map(blocker => `- ${blocker}`));
    lines.push("", "Decision: ______  Exact subdivisions: ______  Reviewer note: ______", "");
  }
  const missing = report.targets.filter(target => target.reviewStatus === "technical_source_blocker");
  const blocked = report.groups.filter(group => group.technicalBlockers.length);
  if (blocked.length) {
    lines.push("## All technical blockers", "");
    for (const group of blocked) lines.push(
      `### § ${group.section} — ${group.title ?? "source unavailable"}`,
      ...group.technicalBlockers.map(blocker => `- ${blocker}`), "",
    );
  }
  if (missing.length) lines.push("## Primary-source collection blockers", "",
    ...missing.map(target => `- ${target.id}: ${target.sections.join(", ") || "no parseable section identity"}`), "");
  return lines.join("\n") + "\n";
}

export function reviewCsv(report: ReturnType<typeof buildOhioBatchReview>): string {
  // Prevent spreadsheet-formula execution if source or reviewer text starts with a formula prefix.
  const cell = (value: string) => `"${(/^[=+@\-\t\r]/.test(value) ? "'" + value : value).replace(/"/g, '""')}"`;
  const rows = [["section", "official_title", "source_url", "source_hash", "affected_ids",
    "named_candidates", "legal_questions", "technical_blockers", "decision", "exact_subdivisions", "reviewer_note"]];
  for (const group of report.groups.filter(group => group.manualQuestions.length || group.technicalBlockers.length)) {
    rows.push([
      group.section, group.title ?? "", group.sourceUrl ?? "", group.sourceHash ?? "",
      group.targets.map(target => target.id).join("; "),
      group.namedOffenseCandidates.map(unit => unit.name).join("; "),
      group.manualQuestions.map(question => question.question).join("\n"),
      group.technicalBlockers.join("\n"), "", "", "",
    ]);
  }
  return rows.map(row => row.map(cell).join(",")).join("\n") + "\n";
}