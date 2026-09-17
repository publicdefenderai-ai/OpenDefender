import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ASSAULT_ACQUISITION_PATH, buildSimpleAssaultReview } from "../scripts/data-review/review-ohio-simple-assault";
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } from "../server/data/ohio-chapter-2903-source";

const acquisition = JSON.parse(readFileSync(ASSAULT_ACQUISITION_PATH, "utf8"));
describe("Ohio simple-assault review boundary", () => {
  it("preserves both conduct paths, ten grading/sentencing groups and the full local definitions", () => {
    const review = buildSimpleAssaultReview(acquisition);
    expect(review.rows).toHaveLength(14);
    const source = acquisition.documents.find((row: {section: string}) => row.section === "2903.13");
    for (const row of review.rows) {
      expect(source.text.slice(row.evidence.start, row.evidence.end)).toBe(row.evidence.quote);
    }
    expect(review.rows[0].evidence.quote).toContain("knowingly cause or attempt");
    expect(review.rows[1].evidence.quote).toContain("recklessly cause serious physical harm");
    expect(review.rows.at(-1)!.evidence.quote).toContain('(26) "Co-worker"');
  });
  it("retains hospital training and knowledge conditions, distinct priors, and the limited mandatory F4 branch", () => {
    const rows = buildSimpleAssaultReview(acquisition).rows;
    const evidence = (subdivision: string) => rows.find(row => row.subdivision === subdivision)!.evidence.quote;
    expect(evidence("(C)(8)")).toContain("hospital offers de-escalation or crisis intervention training");
    expect(evidence("(C)(8)")).toContain("knows or has reasonable cause to know");
    expect(evidence("(C)(8)")).toContain("offenses committed against hospital personnel");
    expect(evidence("(C)(9)")).toContain("offenses committed against justice system personnel");
    expect(evidence("(C)(6)")).toContain("under division (C)(5)(a)");
    expect(evidence("(C)(6)")).toContain("at least twelve months");
    expect(evidence("(C)(10)")).toContain("except as otherwise provided in division (C)(6)");
    expect(evidence("(D)")).toContain("same conduct involving the same victim");
  });
  it("does not treat retrieval success or historical secondary text as publication approval", () => {
    const review = buildSimpleAssaultReview(acquisition);
    expect(review.status).toBe("withheld_from_source_first_publication");
    expect(review.unresolvedAuthority[0].section).toBe("3727.01");
    expect(review.unresolvedAuthority[0].secondaryStatus).toContain("not_current_authority");
    const optimisticAcquisition = structuredClone(acquisition);
    optimisticAcquisition.failures = [];
    expect(buildSimpleAssaultReview(optimisticAcquisition).status).toBe(review.status);
    expect(OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.some(row => row.offense.section === "2903.13")).toBe(false);
  });
  it("rejects corrupted or changed primary text even when acquisition recalculates its hash", () => {
    const changed = structuredClone(acquisition);
    const source = changed.documents.find((row: {section: string}) => row.section === "2903.13");
    source.text = source.text.replace("recklessly", "negligently");
    expect(() => buildSimpleAssaultReview(changed)).toThrow();
    source.contentHash = createHash("sha256").update(source.text).digest("hex");
    expect(() => buildSimpleAssaultReview(changed)).toThrow("renewed independent review");
  });
});