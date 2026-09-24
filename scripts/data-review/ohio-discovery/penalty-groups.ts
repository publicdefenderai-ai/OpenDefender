/** Assemble shared authorities once, without turning research into approvals. */
import { createHash } from "node:crypto";
import type { OhioClassifiedSection, OhioExternalGrade, OhioPenaltyRangeEvidence } from "../classify-ohio-offenses";
import type { OhioReconciliationRow } from "../reconcile-ohio-catalog";
import type { OhioSnapshotSection } from "./snapshot-accounting";
import type { OhioTextSpan } from "./offense-extractor";

export function groupOhioPenaltyResearch(sections: OhioClassifiedSection[], ranges: OhioPenaltyRangeEvidence[],
  sources: Map<string, OhioSnapshotSection>, catalog: OhioReconciliationRow[]) {
  const groups = new Map<string, { id: string; penaltySection: string; sourceUrl: string; sourceHash: string;
    context: OhioTextSpan; targets: Map<string, { directEvidence: OhioExternalGrade[]; rangeIds: string[] }>;
    ranges: OhioPenaltyRangeEvidence[]; needsResearch: boolean }>();
  const groupFor = (penaltySection: string, sourceHash: string, context: OhioTextSpan) => {
    const source = sources.get(penaltySection);
    if (!source || source.contentHash !== sourceHash ||
        createHash("sha256").update(source.text).digest("hex") !== sourceHash ||
        source.text.slice(context.start, context.end) !== context.text) {
      throw new Error(`Shared penalty evidence does not match source: ${penaltySection}`);
    }
    const id = `${penaltySection}:${sourceHash}:${context.start}-${context.end}`;
    if (!groups.has(id)) groups.set(id, { id, penaltySection, sourceUrl: source.sourceUrl, sourceHash,
      context, targets: new Map(), ranges: [], needsResearch: false });
    return groups.get(id)!;
  };
  const targetFor = (group: ReturnType<typeof groupFor>, section: string) => {
    if (!group.targets.has(section)) group.targets.set(section, { directEvidence: [], rangeIds: [] });
    return group.targets.get(section)!;
  };
  for (const row of sections) for (const grade of row.externalGrades) {
    if (!grade.context) throw new Error(`Reclassify before grouping penalty evidence: ${row.section}`);
    const group = groupFor(grade.gradedBy, grade.sourceHash, grade.context);
    targetFor(group, row.section).directEvidence.push(grade);
    group.needsResearch ||= Boolean(grade.requiresApplicabilityReview) || row.classification === "penalty_linked_candidate";
  }
  for (const range of ranges) {
    const group = groupFor(range.penaltySection, range.sourceHash, range.context);
    group.needsResearch = true;
    group.ranges.push(range);
    for (const section of range.members) targetFor(group, section).rangeIds.push(range.id);
  }
  const bySection = new Map(sections.map(row => [row.section, row]));
  const packets = [...groups.values()].filter(group => group.needsResearch).map(group => {
    const targets = [...group.targets].sort(([a], [b]) => a.localeCompare(b)).map(([section, relations]) => {
      const source = sources.get(section), classified = bySection.get(section);
      if (!source || !classified || createHash("sha256").update(source.text).digest("hex") !== classified.contentHash) {
        throw new Error(`Missing or changed penalty target evidence: ${section}`);
      }
      const signal = source.text.match(/\bno\s+(?!(?:later|less|more|liability)\b)(?:(?![.;](?!\d))[\s\S]){0,650}?\bshall\b|\b(?:shall|may)\s+not\b/i);
      const start = signal?.index ?? 0;
      const end = Math.min(source.text.length, start + Math.max(600, signal?.[0].length ?? 0));
      return { section, catchline: source.catchline, sourceUrl: source.sourceUrl, sourceHash: source.contentHash,
        classification: classified.classification, sourceStatus: classified.sourceStatus,
        context: { start, end, text: source.text.slice(start, end) }, excerptKind: signal ? "conduct_search_hit" : "section_prefix",
        ...relations, catalogChargeIds: catalog.filter(row => row.section === section).map(row => row.chargeId),
        disposition: "evidence_assembled_applicability_unresolved" };
    });
    const catalogChargeIds = [...new Set(targets.flatMap(target => target.catalogChargeIds))].sort();
    const reasons = [...new Set(targets.flatMap(target => target.directEvidence.flatMap(grade => grade.targetScope?.reviewReasons ?? [])))].sort();
    return { id: group.id, penaltySection: group.penaltySection, sourceUrl: group.sourceUrl, sourceHash: group.sourceHash,
      context: group.context, reviewReasons: reasons, ranges: group.ranges, targets, catalogChargeIds,
      disposition: "engineering_shared_source_review_not_attorney_assignment",
      next: "Read the full penalty source once, then resolve each target's conduct, division, actor, exceptions and temporal applicability. Excerpts are navigation aids, not complete elements or punishments." };
  }).sort((a, b) => b.catalogChargeIds.length - a.catalogChargeIds.length || b.targets.length - a.targets.length || a.id.localeCompare(b.id));
  const sourceBatches = new Map<string, { penaltySection: string; sourceUrl: string; sourceHash: string;
    clauseIds: string[]; targetSections: string[]; catalogChargeIds: string[] }>();
  for (const packet of packets) {
    const key = `${packet.penaltySection}:${packet.sourceHash}`;
    if (!sourceBatches.has(key)) sourceBatches.set(key, { penaltySection: packet.penaltySection,
      sourceUrl: packet.sourceUrl, sourceHash: packet.sourceHash, clauseIds: [], targetSections: [], catalogChargeIds: [] });
    const batch = sourceBatches.get(key)!;
    batch.clauseIds.push(packet.id);
    batch.targetSections = [...new Set([...batch.targetSections, ...packet.targets.map(row => row.section)])].sort();
    batch.catalogChargeIds = [...new Set([...batch.catalogChargeIds, ...packet.catalogChargeIds])].sort();
  }
  const batches = [...sourceBatches.values()].sort((a, b) => b.catalogChargeIds.length - a.catalogChargeIds.length ||
    b.targetSections.length - a.targetSections.length || a.penaltySection.localeCompare(b.penaltySection));
  const targetRelationships = packets.reduce((sum, group) => sum + group.targets.length, 0);
  return { totals: { sourceBatches: batches.length, clauseGroups: packets.length, targetRelationships,
    repeatedClauseReadsAvoidable: targetRelationships - packets.filter(group => group.targets.length > 0).length,
    affectedSections: new Set(packets.flatMap(group => group.targets.map(target => target.section))).size,
    affectedCatalogRows: new Set(packets.flatMap(group => group.catalogChargeIds)).size }, groups: packets, sourceBatches: batches };
}
