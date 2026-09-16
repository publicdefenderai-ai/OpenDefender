import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildIllinoisAttorneyReviewQueue } from "../scripts/data-review/generate-illinois-attorney-review-queue";

describe("Illinois attorney review queue", () => {
  it("includes only unresolved semantic and shared-citation mappings", () => {
    const manifest = JSON.parse(readFileSync(
      "scripts/data-review/output/il-source-manifest.json",
      "utf8",
    ));
    const queue = buildIllinoisAttorneyReviewQueue(manifest);
    expect(queue.rows).toHaveLength(39);
    expect(queue.rows.every((row) =>
      row.currentDisposition === "require_exact_reselection",
    )).toBe(true);
    expect(queue.rows.every((row) =>
      ["semantic_conflict", "shared_citation"].includes(row.mappingClassification),
    )).toBe(true);
    expect(queue.rows.every((row) =>
      row.evidence.length > 0 &&
      row.evidence[0].evidenceSpans.some((span) => span.kind === "currentness") &&
      row.evidence[0].evidenceSpans.some((span) => span.kind === "offense"),
    )).toBe(true);
    expect(queue.decisionOptions).toContain("publish");
    expect(queue.decisionOptions).toContain("hold");
  });

  it("keeps shared citation clusters visible without silently deduplicating", () => {
    const manifest = JSON.parse(readFileSync(
      "scripts/data-review/output/il-source-manifest.json",
      "utf8",
    ));
    const queue = buildIllinoisAttorneyReviewQueue(manifest);
    const distribution = queue.rows.find((row) =>
      row.chargeId === "il-distribution-of-controlled-substance",
    );
    expect(distribution?.possibleDuplicate).toBe(true);
    expect(distribution?.relatedChargeIds).toContain("il-manufacturing-controlled-substance");
    expect(distribution?.reviewFocus).toBe("shared-citation-cluster");
  });
});