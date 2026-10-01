import { describe, expect, it, vi } from "vitest";
import { acquireOhioReviewedGroup, extractReviewedOhioRule, refreshOhioReviewedSources } from "../scripts/data-review/refresh-ohio-reviewed-sources";
import { textHash } from "../scripts/data-review/batch/source-batch";

const url = "https://codes.ohio.gov/ohio-administrative-code/rule-3701-12-01";
const html = '<h1>Rule 3701-12-01 | Definitions.</h1><div>Effective:</div><div>January 1, 2020</div><section class="laws-body"><p>As used in Chapter 3701-12 of the Administrative Code:</p><p>(M) &quot;Health maintenance organization&quot; means a test organization.</p></section>';
const now = new Date("2026-10-01T12:00:00Z");

describe("deliberate Ohio reviewed renewal", () => {
  it("does not allow forced renewal without acquisition", async () => {
    await expect(refreshOhioReviewedSources(["--force"])).rejects.toThrow("requires --acquire");
  });
  it("binds rule identity, normalized text and authentic retrieval time", () => {
    const row = extractReviewedOhioRule(html, url, now);
    expect(row.section).toBe("OAC:3701-12-01");
    expect(row.retrievedAt).toBe(now.toISOString());
    expect(row.contentHash).toBe(textHash(row.text));
    expect(row.text).toContain('\nEffective: 2020-01-01\nAs used in Chapter 3701-12');
  });
  it.each([
    html.replace('3701-12-01 |', '3701-12-02 |'),
    html.replace('January 1, 2020', 'January 1, 2030'),
    html.replace('January 1, 2020', 'invalid'),
    html.replace('As used in Chapter', 'Other Chapter'),
    html.replace('(M)', '(N)'),
    html.replace('class="laws-body"', 'class="other"'),
  ])("rejects wrong identity, future/malformed dates and incomplete bodies", input => {
    expect(() => extractReviewedOhioRule(input, url, now)).toThrow();
  });
  it("rejects an unrelated official URL", () => {
    expect(() => extractReviewedOhioRule(html, url + '0', now)).toThrow();
  });
});


describe("bounded chapter recovery", () => {
  const section = "4737.04";
  function failingBulk(message: string) {
    const metrics = { httpRequests: 0 };
    return Object.assign(async () => { metrics.httpRequests++; throw new Error(message); }, { metrics });
  }
  it("recovers an exact section after a malformed chapter and counts both requests", async () => {
    const exact = vi.fn().mockResolvedValue({ section });
    const result = await acquireOhioReviewedGroup(section, 2, failingBulk("Malformed section boundary in chapter 4737"), exact);
    expect(result).toEqual({ documents: [{ section }], requests: 2 });
    expect(exact).toHaveBeenCalledWith(section);
  });
  it.each(["Official chapter 4737: HTTP 429", "fetch failed"])('does not retry %s', async message => {
    const exact = vi.fn();
    await expect(acquireOhioReviewedGroup(section, 2, failingBulk(message), exact)).rejects.toMatchObject({ requestsUsed: 1 });
    expect(exact).not.toHaveBeenCalled();
  });
  it("honors the remaining request budget", async () => {
    const exact = vi.fn();
    await expect(acquireOhioReviewedGroup(section, 1, failingBulk("Malformed section boundary"), exact)).rejects.toMatchObject({ requestsUsed: 1 });
    expect(exact).not.toHaveBeenCalled();
  });
  it("retains exact-retrieval failure instead of falling back to old evidence", async () => {
    await expect(acquireOhioReviewedGroup(section, 2, failingBulk("Malformed section boundary"), vi.fn().mockRejectedValue(new Error("unavailable")))).rejects.toMatchObject({ message: "unavailable", requestsUsed: 2 });
  });
});
