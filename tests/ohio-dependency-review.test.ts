import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validateDependencyReview, renderDependencyReview, type DependencyReview } from "../scripts/data-review/ohio-verification/dependency-review";
const read = (path: string) => readFileSync(path, "utf8");
const prefix = "scripts/data-review/";
const recorded = JSON.parse(read(prefix + "ohio-verification/dependency-review.json")) as DependencyReview;
const base = read(prefix + "ohio-verification/batch-one.json");
const enumeration = read(prefix + "output/ohio-code-enumeration.json");
const catalog = JSON.parse(read(prefix + "output/ohio-catalog-reconciliation.json")).rows;
function fixture() {
  const review = structuredClone(recorded);
  const definitions = new Map(review.catalogBaseline.map(row => [row.id, { text: row.baselineDefinition,
    citationOverride: row.citationOverride, eligibility: row.existingEligibility }]));
  return { review, definitions, run: () => validateDependencyReview(review, base, enumeration, catalog, definitions) };
}
describe("Ohio dependency research handoff", () => {
  it("accounts for the full assignment and distinguishes existing data, research and approval", () => {
    const { run } = fixture();
    expect(run()).toEqual({ sectionsAccountedFor: 51, sharedResearchModules: 6, addedPinnedStatutes: 25,
      catalogEntriesWithProposals: 10, sourceBasedEntriesAlreadyPresent: 4, proposedSectionGroups: 6,
      attorneyQuestions: 6, agentResearchHolds: 3, dependenciesFullyClosed: 0, approvedForPublication: 0, runtimeChanges: 0 });
  });
  it.each(["source text", "quote", "source substitution", "lost reference", "missing section", "duplicate migration", "changed catalog", "changed citation", "eligibility drift", "publication", "closed dependency", "unaccounted hold", "external approval"])("rejects %s rather than silently carrying research forward", mutation => {
    const { review, definitions, run } = fixture();
    if (mutation === "source text") review.sources["1717.01"].text += "changed";
    if (mutation === "quote") review.catalogProposals[0].evidence[0].start++;
    if (mutation === "source substitution") review.holdReviews[0].evidence[0].section = "4301.99";
    if (mutation === "lost reference") review.coverage.find(row => row.referenceSignals.length)!.referenceSignals.pop();
    if (mutation === "missing section") review.coverage.pop();
    if (mutation === "duplicate migration") review.catalogProposals[0].legacyIds.push(review.catalogProposals[1].legacyIds[0]);
    if (mutation === "changed catalog") definitions.values().next().value!.text += "changed";
    if (mutation === "changed citation") definitions.values().next().value!.citationOverride = "wrong citation";
    if (mutation === "eligibility drift") definitions.values().next().value!.eligibility = "eligible";
    if (mutation === "publication") review.catalogProposals[0].status = "approved";
    if (mutation === "closed dependency") review.coverage[0].dependencyStatus = "complete";
    if (mutation === "unaccounted hold") review.holdReviews.pop();
    if (mutation === "external approval") review.externalAuthorities[0].verification = "pinned_approved";
    expect(run).toThrow();
  });
  it("rejects an updated upstream batch without pretending prior judgments cover it", () => {
    const { review, definitions } = fixture();
    expect(() => validateDependencyReview(review, base + " ", enumeration, catalog, definitions)).toThrow(/Changed base/);
  });
  it("preserves the two important non-citation discoveries", () => {
    const animal = recorded.catalogProposals.find(p => p.section === "959.13")!;
    expect(animal.evidence.some(e => e.section === "1717.01")).toBe(true);
    expect(animal.authorityIds).toContain("light");
    expect(recorded.externalAuthorities.find(a => a.id === "phelps")?.finding).toContain("severed");
    expect(recorded.holdReviews.find(h => h.sections.includes("3767.30"))?.proposal).toContain("procession conduct excluded");
  });
  it("keeps ambiguous names and variant boundaries out of automatic migration", () => {
    const open = recorded.catalogProposals.find(p => p.section === "4301.62")!;
    expect(open.proposedChange).toContain("do not silently alias");
    expect(open.grade).toBe("MM");
    expect(recorded.catalogProposals.find(p => p.section === "4301.69")?.scopeCandidates).toEqual(["E(1)"]);
    expect(recorded.catalogProposals.find(p => p.section === "3743.65")?.grade).toBe("B/G: M1; H: MM");
  });
  it("renders actual legal questions separately from missing-source work", () => {
    const { review, run } = fixture();
    const markdown = renderDependencyReview(review, run());
    const attorneyPart = markdown.split("## Attorney decisions")[1].split("## Research retained by the agent")[0];
    expect(attorneyPart.match(/\*\*Question:\*\*/g)).toHaveLength(6);
    expect(attorneyPart).not.toContain("Agent task:");
    expect(attorneyPart).toContain("Key statutory excerpt");
    expect(markdown).not.toContain("—");
  });
});
