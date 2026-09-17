import { textHash } from "./source-batch";
import type { buildOhioBatchReview } from "./ohio-review-report";

type ReviewReport = ReturnType<typeof buildOhioBatchReview>;
export interface ReviewDecision {
  evidenceFingerprint: string;
  decision: "" | "publish_candidate" | "correct" | "split" | "reclassify" | "deduplicate" | "hold" | "remove";
  exactSubdivisions: string;
  note: string;
}
export interface ReviewLedger {
  schemaVersion: 1;
  /** Never consumed as runtime approval. A reviewed pin/catalog change is a separate action. */
  decisions: Record<string, ReviewDecision>;
}

export interface ReferenceLedger {
  schemaVersion: 1;
  decisions: Record<string, {
    sourceHash: string;
    references: Record<string, { decision: "include" | "exclude"; reason: string }>;
  }>;
}

export function selectedReferences(
  section: string, sourceHash: string, defaults: string[], allReferences: string[],
  ledger: ReferenceLedger,
) {
  const entry = ledger.decisions[section];
  if (!entry || entry.sourceHash !== sourceHash) return defaults;
  const selected = new Set(defaults);
  for (const [reference, choice] of Object.entries(entry.references)) {
    if (!allReferences.includes(reference) || !choice.reason.trim() ||
        !["include", "exclude"].includes(choice.decision)) {
      throw new Error(`Invalid reference decision at ${section} -> ${reference}`);
    }
    if (choice.decision === "include") selected.add(reference);
    else selected.delete(reference);
  }
  return [...selected].sort();
}

export function groupFingerprint(group: ReviewReport["groups"][number]) {
  return textHash(JSON.stringify({
    section: group.section, sourceHash: group.sourceHash,
    targets: group.targets.map(target => [target.id, target.label, target.sections, target.reason]),
    references: group.references.map(reference => [reference.section, reference.sourceHash]),
    candidates: group.namedOffenseCandidates, questions: group.manualQuestions,
  }));
}

/** Keep notes and original evidence fingerprints even when evidence changes or a group disappears. */
export function reconcileReviewLedger(report: ReviewReport, previous?: ReviewLedger) {
  if (previous && (previous.schemaVersion !== 1 || !previous.decisions ||
      typeof previous.decisions !== "object" || Array.isArray(previous.decisions))) {
    throw new Error("Invalid review ledger; refusing to overwrite reviewer decisions");
  }
  const ledger: ReviewLedger = previous ?? { schemaVersion: 1, decisions: {} };
  const reviewState = report.groups.filter(group => group.manualQuestions.length).map(group => {
    const currentFingerprint = groupFingerprint(group);
    const decision = ledger.decisions[group.section] ??= {
      evidenceFingerprint: currentFingerprint, decision: "", exactSubdivisions: "", note: "",
    };
    if (!decision || typeof decision.evidenceFingerprint !== "string" ||
        !["", "publish_candidate", "correct", "split", "reclassify", "deduplicate", "hold", "remove"].includes(decision.decision) || typeof decision.note !== "string" ||
        typeof decision.exactSubdivisions !== "string") {
      throw new Error(`Invalid reviewer decision for ${group.section}; refusing to overwrite it`);
    }
    // Empty templates contain no review work to invalidate.
    if (!decision.decision && !decision.note && !decision.exactSubdivisions) {
      decision.evidenceFingerprint = currentFingerprint;
    }
    const evidenceChanged = decision.evidenceFingerprint !== currentFingerprint;
    return {
      section: group.section, currentFingerprint,
      status: evidenceChanged ? "evidence_changed_review_again"
        : decision.decision ? "decision_recorded_not_published" : "awaiting_review",
      decision: { ...decision },
    };
  });
  return { ledger, reviewState };
}