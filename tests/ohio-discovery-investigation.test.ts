import { describe, expect, it } from "vitest";
import { evidence, groupCandidate, groupStatus, rangeEndpoint } from "../scripts/data-review/investigate-ohio-discovery";
import type { OhioExternalGrade } from "../scripts/data-review/classify-ohio-offenses";
import type { OhioSnapshotSection } from "../scripts/data-review/ohio-discovery/snapshot-accounting";

const grade = (text: string): OhioExternalGrade => ({ kind: "misdemeanor", degree: "fourth",
  conditional: false, gradedBy: "907.99", sourceHash: "fixture", sourceUrl: "https://codes.ohio.gov/ohio-revised-code/section-907.99",
  span: { text, start: 0, end: text.length } });
const section = (catchline: string, text = "Operative provision."): OhioSnapshotSection => ({
  section: "128.96", chapter: "128", catchline, text, repealed: true,
  sourceUrl: "https://codes.ohio.gov/ohio-revised-code/section-128.96", contentHash: "fixture", effectiveDate: null,
});

describe("Ohio discovery research routing", () => {
  it("keeps statutory ranges separate from direct citations without treating section numbers as decimals", () => {
    expect(rangeEndpoint("4507.081", "sections 4507.01 to 4507.081")).toBe(true);
    expect(rangeEndpoint("4507.08", "sections 4507.01 to 4507.081")).toBe(false);
    expect(rangeEndpoint("4507.10", "section 4507.10 or 4507.37")).toBe(false);
    expect(rangeEndpoint("907.35", "sections 907.27 through 907.35")).toBe(true);
  });
  it("routes definitions mentioned only as range endpoints to context investigation", () => {
    const row = groupCandidate("907.01", "Seeds shall not be regarded as hybrids.", [grade("Whoever violates sections 907.01 to 907.17")]);
    expect(row.group).toBe("range_endpoint_context");
    expect(row.prohibitionSignal).not.toBeNull();
  });
  it("does not erase a direct link when the same section is also a range endpoint", () => {
    const row = groupCandidate("907.01", "No seed seller shall mislabel seed.", [
      grade("Whoever violates sections 907.01 to 907.17"), grade("Whoever violates section 907.01"),
    ]);
    expect(row.group).toBe("broader_prohibition_wording");
    expect(row.rangeReferenceCount).toBe(1);
  });
  it("distinguishes research signals without declaring duties or administrative language crimes", () => {
    expect(groupCandidate("1.01", "No physician shall give a false certificate.", []).group).toBe("broader_prohibition_wording");
    expect(groupCandidate("1.01", "The agency shall keep records.", []).group).toBe("affirmative_duty_or_administration");
    expect(groupCandidate("1.01", "The agency may adopt rules.", []).group).toBe("other_dependency_context");
  });
  it("preserves exact source offsets including whitespace", () => {
    const text = "(A) A person\nshall not use information.\n(B) Exceptions follow.";
    const span = evidence(text, /shall not/)!;
    expect(span.text).toBe(text.slice(span.start, span.end));
    expect(span.start).toBe(text.indexOf("shall not"));
  });
  it("does not join unrelated sentences into a prohibition but permits decimal citations", () => {
    expect(groupCandidate("1.01", "There is no fee. The board shall file a report.", []).group).toBe("affirmative_duty_or_administration");
    expect(groupCandidate("1.01", "No physician under section 1.02 shall falsify a report.", []).group).toBe("broader_prohibition_wording");
  });
  it("flags former-number history rather than asserting repeal", () => {
    expect(groupStatus(section("[Former R.C. 128.32, amended and renumbered] Immunity"), "2026-09-23")).toBe("renumbering_history_with_body");
    expect(groupStatus(section("[Renumbered as 128.96]", ""), "2026-09-23")).toBe("other_status_notice");
  });
  it("compares repeal dates to the pinned snapshot date, not the computer clock", () => {
    expect(groupStatus(section("[Repealed effective 10/09/2026] Education"), "2026-09-23")).toBe("future_repeal_date");
    expect(groupStatus(section("[Repealed effective 2/11/2022] Definitions"), "2026-09-23")).toBe("dated_repeal_requires_version_check");
    expect(groupStatus(section("Testing [repealed 4/3/2033]"), "2026-09-23")).toBe("future_repeal_date");
  });
  it("flags incidental status words without altering source metadata", () => {
    const row = section("Lots may be revised and renumbered");
    expect(groupStatus(row, "2026-09-23")).toBe("status_keyword_in_other_context");
    expect(groupStatus(section("Repealed laws have no effect on actions taken"), "2026-09-23")).toBe("status_keyword_in_other_context");
    expect(row.repealed).toBe(true);
    expect(groupStatus({ ...row, repealed: false }, "2026-09-23")).toBe("not_flagged");
  });
});
