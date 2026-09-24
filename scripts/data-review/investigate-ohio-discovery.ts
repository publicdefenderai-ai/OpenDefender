/** Offline triage, not legal determinations or publication decisions. */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { classifyOhioOffenses, type OhioExternalGrade } from "./classify-ohio-offenses";
import { reconcileOhioCatalog, OHIO_MECHANICAL_VERDICTS, type OhioReconciliationRow } from "./reconcile-ohio-catalog";
import type { OhioCachedChapter, OhioSnapshotSection } from "./ohio-discovery/snapshot-accounting";

const OUTPUT = "scripts/data-review/output";
const sha = (text: string) => createHash("sha256").update(text).digest("hex");
const order = (a: string, b: string) => a.localeCompare(b, "en", { numeric: true });

/** Preserve exact offsets; snippets are search aids, never complete elements. */
export function evidence(text: string, pattern: RegExp) {
  const match = text.match(pattern);
  if (!match) return null;
  const start = match.index ?? 0;
  const end = Math.min(text.length, start + match[0].length + 180);
  return { start, end, text: text.slice(start, end) };
}

export function rangeEndpoint(section: string, clause: string): boolean {
  return [...clause.matchAll(/\b(\d+\.\d+)\s+(?:to|through)\s+(\d+\.\d+)\b/gi)]
    .some(match => match[1] === section || match[2] === section);
}

/** Deliberately broader than the classifier, and never used to approve a charge. */
export function groupCandidate(section: string, text: string, grades: OhioExternalGrade[]) {
  const prohibition = evidence(text, /\bno\s+(?!(?:later|less|more|liability)\b)(?:(?![.;](?!\d))[\s\S]){0,650}?\bshall\b|\b(?:shall|may)\s+not\b|\b(?:are|is)\s+(?:hereby\s+)?prohibited\b/i);
  const duty = evidence(text, /\b(?:shall|must)\b/i);
  const rangeReferences = grades.filter(grade => rangeEndpoint(section, grade.span.text));
  const group = grades.length > 0 && rangeReferences.length === grades.length
    ? "range_endpoint_context"
    : prohibition ? "broader_prohibition_wording"
    : duty ? "affirmative_duty_or_administration"
    : "other_dependency_context";
  return { group, rangeReferenceCount: rangeReferences.length,
    prohibitionSignal: prohibition, dutySignal: duty,
    // Prefix retains context even when neither heuristic matches.
    context: { start: 0, end: Math.min(text.length, 280), text: text.slice(0, 280) } };
}

/** Flag suspicious acquisition metadata without rewriting it. */
export function groupStatus(section: OhioSnapshotSection, asOf: string): string {
  if (!section.repealed) return "not_flagged";
  if (/\bformer\b.*\b(?:amended\s+and\s+)?renumbered\b/i.test(section.catchline) && section.text.trim()) {
    return "renumbering_history_with_body";
  }
  const date = section.catchline.match(/\brepealed\s+(?:effective\s+)?(\d{1,2})\/(\d{1,2})\/(\d{4})/i);
  if (date) {
    const iso = `${date[3]}-${date[1].padStart(2, "0")}-${date[2].padStart(2, "0")}`;
    if (iso > asOf.slice(0, 10)) return "future_repeal_date";
    return "dated_repeal_requires_version_check";
  }
  if (section.text.trim() && !/^\[?\s*(?:repealed|renumbered|reserved)(?:\s+(?:effective|as|by|to)\b|[.\]]|$)/i.test(section.catchline)) {
    return "status_keyword_in_other_context";
  }
  return "other_status_notice";
}

// Findings from reading the full cached provisions. Anchors fail on source drift.
// These describe research tasks; they do not resolve offense identity or eligibility.
const LEGACY: Record<string, { group: string; anchors: Array<[string, string]>; finding: string; next: string }> = {
  "955.22": { group: "grade_extraction_and_label_scope", anchors: [["955.22", "guilty of a misdemeanor"]], finding: "The body contains degree-specific guilt clauses; the current grader misses 'is guilty of a'. The old animal-at-large label also needs comparison against the acquired dog-act provision.", next: "Repair grade extraction, preserve divisions and effective versions, then review label scope." },
  "4510.11": { group: "grade_extraction", anchors: [["4510.11", "guilty of a misdemeanor of the first degree"]], finding: "A local grade exists despite the prohibition-only classification.", next: "Extract unnamed local grades with their divisions, conditions and spans; do not invent a statutory offense name." },
  "4513.02": { group: "grade_extraction_and_label_scope", anchors: [["4513.02", "guilty of a minor misdemeanor"]], finding: "A local grade exists. Unsafe vehicles and the legacy expired-inspection label must not be assumed equivalent.", next: "Repair grade extraction, then resolve the old label against conduct and charging-document terminology." },
  "4503.11": { group: "grade_extraction", anchors: [["4503.11", "guilty of a minor misdemeanor"]], finding: "The annual application/tax provision contains a local grade missed by the grader.", next: "Extract the grade and preserve the division (A) conduct before evaluating the expired-registration alias." },
  "4511.20": { group: "grade_extraction", anchors: [["4511.20", "guilty of a minor misdemeanor"]], finding: "The body states a baseline grade and escalating repeat-offense grades.", next: "Extract the local grades with the one-year predicate conditions, not a single unconditional penalty." },
  "3767.32": { group: "penalty_clause_grammar", anchors: [["3767.32", "No person, regardless of intent"], ["3767.99", "Whoever violates section 3767.13"]], finding: "Section 3767.99(C) names 3767.32, but an intervening natural-person clause prevents the current penalty matcher from retaining the link.", next: "Repair list/qualifier parsing and preserve which qualification applies to which target." },
  "2903.311": { group: "prohibition_wording", anchors: [["2903.311", "No administrator"], ["2903.311", "A violation of this section is a misdemeanor"]], finding: "The actor list and long lead-in miss the prohibition matcher; the body already states local grades.", next: "Expand conduct discovery with adversarial tests; keep this investigation separate from existing reviewed evidence." },
  "4509.101": { group: "legal_boundary_after_evidence", anchors: [["4509.101", "following civil penalties"], ["4509.101", "Nothing in this section shall be construed to be subject to section 4509.78"]], finding: "The cited provision expressly describes civil penalties and excludes 4509.78. A generic driving-without-insurance crime label is unsafe to infer from it.", next: "Attorney/product decision: keep a separate civil/administrative guidance path, or exclude from the criminal-charge selector, after version verification." },
  "2705.02": { group: "legal_boundary_after_evidence", anchors: [["2705.02", "may be punished as for a contempt"]], finding: "The provision describes contempt acts; ordinary felony/misdemeanor discovery is insufficient to characterize the proceeding.", next: "Attorney/product decision: model contempt with proceeding-specific questions rather than assigning a generic crime grade." },
  "2951.08": { group: "legal_boundary_after_evidence", anchors: [["2951.08", "may arrest the person under a community control sanction"]], finding: "The cited text sets arrest/procedure rules for community control; it does not by itself establish the legacy generic probation-violation charge.", next: "Attorney/product decision: route supervision violations by the proceeding and underlying order, with separate-charge possibilities preserved." },
  "4513.01": { group: "citation_scope", anchors: [["4513.01", "the definitions set forth in that section apply to this chapter"]], finding: "The legacy equipment citation points to definitions rather than equipment-specific conduct.", next: "Research conduct-specific equipment provisions; use an ambiguous-label selection flow instead of guessing one replacement." },
  "1533.08": { group: "citation_scope", anchors: [["1533.08", "for scientific study, school instruction, other educational uses, or rehabilitation"]], finding: "This is a specialized collection-permit provision, not a generic hunting/fishing license citation.", next: "Research ordinary hunting and fishing requirements separately, with exceptions and penalties; do not silently remap the combined label." },
  "4503.02": { group: "citation_scope", anchors: [["4503.02", "An annual license tax is hereby levied"]], finding: "The cited provision levies a tax; that alone does not identify the conduct meant by unregistered vehicle.", next: "Research the registration duty and penalty dependencies before suggesting a corrected citation." },
  "3321.38": { group: "special_penalty_and_actor", anchors: [["3321.38", "No parent, guardian, or other person"], ["3321.99", "may be fined not more than five hundred dollars"]], finding: "The duty addresses the adult responsible for a child. The linked penalty is expressed as a fine/community service rather than a standard degree.", next: "Capture the special penalty and actor; legal review should address the adult-offense versus child-proceeding distinction, not transcribe amounts." },
};

function counts(rows: Array<{ group: string }>) {
  return rows.reduce<Record<string, number>>((result, row) => {
    result[row.group] = (result[row.group] ?? 0) + 1; return result;
  }, {});
}

export function investigateOhioDiscovery(root = process.cwd()) {
  const read = (name: string) => fs.readFileSync(path.join(root, OUTPUT, name), "utf8");
  const inventoryText = read("ohio-offense-inventory.json");
  const reconciliationText = read("ohio-catalog-reconciliation.json");
  const inventory = JSON.parse(inventoryText);
  const reconciliation = JSON.parse(reconciliationText) as { rows: OhioReconciliationRow[] };
  const cacheDir = path.join(root, ".cache/ohio-chapters");
  const replay = classifyOhioOffenses({ cacheDir, enumerationPath: path.join(root, OUTPUT, "ohio-code-enumeration.json") });
  if (inventory.accounting.enumerationHash !== replay.accounting.enumerationHash ||
      JSON.stringify(inventory.sections) !== JSON.stringify(replay.sections.filter(row => row.classification !== "supporting")) ||
      JSON.stringify(inventory.accounting.unresolvedPenaltyTargets) !== JSON.stringify(replay.accounting.unresolvedPenaltyTargets)) {
    throw new Error("Investigation requires an inventory matching the validated snapshot and classifier");
  }
  const reconciled = reconcileOhioCatalog({
    inventoryPath: path.join(root, OUTPUT, "ohio-offense-inventory.json"),
    enumerationPath: path.join(root, OUTPUT, "ohio-code-enumeration.json"),
  });
  if (JSON.stringify(reconciliation.rows) !== JSON.stringify(reconciled.rows)) {
    throw new Error("Investigation requires reconciliation matching the inventory and current catalog");
  }
  const chapters = fs.readdirSync(cacheDir).filter(file => file.endsWith(".json")).sort()
    .map(file => JSON.parse(fs.readFileSync(path.join(cacheDir, file), "utf8")) as OhioCachedChapter);
  const sources = new Map(chapters.flatMap(chapter => chapter.sections.map(section => [section.section, section] as const)));
  const source = (number: string) => {
    const row = sources.get(number);
    if (!row) throw new Error(`Missing investigation evidence: ${number}`);
    return row;
  };
  const cite = (row: OhioSnapshotSection) => ({ section: row.section, catchline: row.catchline,
    sourceUrl: row.sourceUrl, contentHash: row.contentHash, effectiveDate: row.effectiveDate });
  const candidates = replay.sections.filter(row => row.classification === "penalty_linked_candidate").map(row => ({
    ...cite(source(row.section)), ...groupCandidate(row.section, source(row.section).text, row.externalGrades),
    penaltyEvidence: row.externalGrades, disposition: "engineering_investigation_not_approved",
  }));
  const legacy = reconciliation.rows.filter(row => row.verdict === "discovery_unresolved").map(row => {
    const plan = row.section ? LEGACY[row.section] : undefined;
    if (!plan) throw new Error(`Untriaged legacy discovery row: ${row.chargeId}`);
    const anchors = plan.anchors.map(([number, text]) => {
      const section = source(number);
      const start = section.text.indexOf(text);
      if (start < 0) throw new Error(`Investigation anchor changed: ${number}`);
      return { ...cite(section), span: { start, end: start + text.length, text } };
    });
    return { chargeId: row.chargeId, catalogLabel: row.catalogLabel, catalogCode: row.catalogCode,
      section: row.section, group: plan.group, finding: plan.finding, next: plan.next, evidence: anchors,
      disposition: "research_only_no_catalog_or_review_decision" };
  });
  const statusAudit = [...sources.values()].filter(row => row.repealed).sort((a, b) => order(a.section, b.section))
    .map(row => ({ ...cite(row), group: groupStatus(row, replay.accounting.enumerationGeneratedAt),
      recordedRepealed: row.repealed, textLength: row.text.length,
      context: { start: 0, end: Math.min(row.text.length, 200), text: row.text.slice(0, 200) } }));
  const unresolvedTargets = replay.accounting.unresolvedPenaltyTargets.map(row => ({ ...row,
    group: sources.has(row.section) ? groupStatus(source(row.section), replay.accounting.enumerationGeneratedAt)
      : row.references.every(grade => rangeEndpoint(row.section, grade.span.text)) ? "absent_range_endpoint" : "absent_direct_target",
    source: sources.has(row.section) ? cite(source(row.section)) : null,
  }));
  const remainingLegacy = reconciliation.rows.filter(row => !OHIO_MECHANICAL_VERDICTS.has(row.verdict) && row.verdict !== "discovery_unresolved")
    .map(row => ({ chargeId: row.chargeId, catalogLabel: row.catalogLabel, section: row.section,
      group: row.verdict, reason: row.reason, disposition: "existing_backlog_not_substantively_investigated_in_this_pass" }));
  return { schemaVersion: 1, kind: "ohio_discovery_investigation", publicationStatus: "research_only_not_published",
    inputs: { enumerationHash: replay.accounting.enumerationHash, enumerationGeneratedAt: replay.accounting.enumerationGeneratedAt,
      inventoryHash: sha(inventoryText), reconciliationHash: sha(reconciliationText) },
    limitations: ["Groups are research routing, not legal determinations; signal snippets may describe exceptions or administration.",
      "Range endpoints are not offense lists. No range is expanded or assigned a grade by this report.",
      "The status audit flags parser risks; it does not repair the snapshot or certify present-day or historical law.",
      "The 154-candidate, legacy-row and status-audit populations overlap and must not be summed as offenses.",
      "The rest of the legacy unresolved backlog is accounted for but not substantively investigated here."],
    totals: { candidates: candidates.length, candidateGroups: counts(candidates), legacyDiscoveryRows: legacy.length,
      legacyDistinctSections: new Set(legacy.map(row => row.section)).size, legacyGroups: counts(legacy),
      unresolvedTargets: unresolvedTargets.length, targetGroups: counts(unresolvedTargets),
      statusAudit: statusAudit.length, statusGroups: counts(statusAudit), remainingLegacy: remainingLegacy.length,
      remainingLegacyGroups: counts(remainingLegacy) },
    candidates, legacy, unresolvedTargets, statusAudit, remainingLegacy };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = investigateOhioDiscovery();
  fs.writeFileSync(path.join(OUTPUT, "ohio-discovery-investigation.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.totals, null, 2));
}
