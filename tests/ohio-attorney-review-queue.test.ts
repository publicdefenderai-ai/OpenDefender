import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildOhioAttorneyReviewQueue } from "../scripts/data-review/generate-ohio-attorney-review-queue";

describe("Ohio attorney review queue", () => {
  it("includes only unresolved rows and preserves an Other decision", () => {
    const manifest = JSON.parse(readFileSync(
      "scripts/data-review/output/oh-source-manifest.json",
      "utf8",
    ));
    const queue = buildOhioAttorneyReviewQueue(manifest);
    expect(queue.rows).toHaveLength(102);
    expect(queue.rows.every((row) => row.currentDisposition === "require_exact_reselection")).toBe(true);
    expect(queue.decisionOptions).toContain("other");
  });

  it("clusters shared citations without deciding that they are duplicates", () => {
    const manifest = JSON.parse(readFileSync(
      "scripts/data-review/output/oh-source-manifest.json",
      "utf8",
    ));
    const queue = buildOhioAttorneyReviewQueue(manifest);
    const dui = queue.rows.find((row) => row.chargeId === "oh-dui-first-offense");
    expect(dui?.possibleDuplicate).toBe(true);
    expect(dui?.relatedChargeIds).toContain("oh-ovi");
    expect(dui?.reviewFocus).toBe("shared-citation-cluster");
    expect(dui?.recommendedAction).toBe("deduplicate-or-split");
  });
});