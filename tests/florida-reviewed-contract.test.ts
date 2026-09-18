import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { getChargeExplanation } from "../shared/charge-explanations";
import { FLORIDA_REVIEWED_DEFINITIONS } from "../shared/florida-reviewed-batch";
import type { EvidenceBackedChargeDefinition } from "../shared/evidence-backed-charge-batch";
import {
  buildFloridaReviewedSourceRecords,
  findSubdivisionRange,
  floridaIdentityQuoteStatesName,
  floridaGradeQuoteStatesCategory,
  validateFloridaReviewedRefreshReceipt,
  type FloridaReviewedEligibility,
  type FloridaReviewedReport,
  type FloridaReviewedReceipt,
} from "../server/data/florida-reviewed-source-records";
import { loadFloridaAuthorityManifest } from "../server/data/florida-manifest-loader";
import {
  buildFloridaSourceDatabaseSeed,
  groupFloridaReviewedDependenciesForAuthority,
} from "../server/data/florida-source-database-seed";

const hashJson = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const hashText = (value: string) =>
  createHash("sha256").update(value).digest("hex");

function fixture() {
  const definition: EvidenceBackedChargeDefinition = {
    id: "fl-fs-example-offense",
    jurisdiction: "FL",
    code: "999.001",
    slug: "florida-example-offense",
    name: "Example offense",
    names: { es: "Delito de ejemplo", zh: "示例罪名" },
    category: "felony",
    categories: ["felony"],
    verifiedMonth: "2026-08",
    citations: [{
      citation: "Fla. Stat. § 999.001",
      url: "https://www.leg.state.fl.us/statutes/example",
    }],
    text: {
      en: { plainSummary: "English summary.", degreeContext: "Felony context." },
      es: { plainSummary: "Resumen en español.", degreeContext: "Contexto de delito grave." },
      zh: { plainSummary: "中文摘要。", degreeContext: "重罪背景。" },
    },
  };
  const offenseText = "A person commits the example offense when all elements are proved.";
  const gradeText = "The example offense is a felony.";
  const report: FloridaReviewedReport = {
    schemaVersion: 1,
    kind: "florida_source_first_review",
    sourceEvidence: {
      "fl:statute:999.001": {
        sourceKey: "fl:statute:999.001",
        section: "999.001",
        subdivision: null,
        citation: "Fla. Stat. § 999.001",
        title: "Example offense",
        sourceUrl: "https://www.leg.state.fl.us/statutes/example",
        text: offenseText,
        contentHash: hashText(offenseText),
        retrievedAt: "2026-08-25T00:00:00.000Z",
        effectiveDateStart: "2026-07-01",
        subdivisionRanges: [],
      },
      "fl:statute:999.002": {
        sourceKey: "fl:statute:999.002",
        section: "999.002",
        subdivision: null,
        citation: "Fla. Stat. § 999.002",
        title: "Classification",
        sourceUrl: "https://www.leg.state.fl.us/statutes/example-grade",
        text: gradeText,
        contentHash: hashText(gradeText),
        retrievedAt: "2026-08-25T00:00:00.000Z",
        effectiveDateStart: "2026-07-01",
        subdivisionRanges: [],
      },
    },
    drafts: [{
      id: definition.id,
      name: definition.name,
      code: definition.code,
      citation: definition.citations[0].citation,
      primarySourceKey: "fl:statute:999.001",
      identityEvidence: {
        sourceKey: "fl:statute:999.001",
        target: "title",
        text: "Example offense",
        start: 0,
        end: "Example offense".length,
        sourceHash: hashText(offenseText),
      },
      conductEvidence: [{
        sourceKey: "fl:statute:999.001",
        target: "text",
        text: offenseText,
        start: 0,
        end: offenseText.length,
        sourceHash: hashText(offenseText),
      }],
      gradeEvidence: [{
        sourceKey: "fl:statute:999.002",
        target: "text",
        text: "felony",
        start: gradeText.indexOf("felony"),
        end: gradeText.indexOf("felony") + "felony".length,
        sourceHash: hashText(gradeText),
        category: "felony",
      }],
      requiredDependencies: [
        { sourceKey: "fl:statute:999.001", role: "offense", contentHash: hashText(offenseText) },
        { sourceKey: "fl:statute:999.001", role: "grading", contentHash: hashText(offenseText) },
        { sourceKey: "fl:statute:999.002", role: "grading", contentHash: hashText(gradeText) },
        { sourceKey: "fl:statute:999.002", role: "definition", contentHash: hashText(gradeText) },
        { sourceKey: "fl:statute:999.002", role: "exception", contentHash: hashText(gradeText) },
        { sourceKey: "fl:statute:999.002", role: "justification", contentHash: hashText(gradeText) },
      ],
      conduct: "Pinned conduct.",
      grading: "Pinned grade.",
      interpretation: "No inferred interpretation.",
      legalReview: null,
    }],
  };
  const draft = report.drafts[0];
  const decision = {
    id: definition.id,
    status: "eligible" as const,
    reason: "Exact identity, grade, and dependencies approved.",
    draftHash: hashJson(draft),
    definitionHash: hashJson(definition),
    approvalHash: "",
  };
  decision.approvalHash = hashJson({
    id: decision.id,
    status: decision.status,
    reason: decision.reason,
    draftHash: decision.draftHash,
    definitionHash: decision.definitionHash,
  });
  const eligibility: FloridaReviewedEligibility = {
    schemaVersion: 1,
    reportHash: hashJson(report),
    decisions: [decision],
  };
  return { definition, report, eligibility };
}

describe("Florida reviewed source-first contract", () => {
  it("resolves duplicate statutory names by exact ID in every locale", () => {
    const ids = [
      "fl-fs-782-04-4-murder-in-the-third-degree",
      "fl-fs-782-04-5-murder-in-the-third-degree",
    ];
    for (const id of ids) {
      const definition = FLORIDA_REVIEWED_DEFINITIONS.find(row => row.id === id)!;
      for (const locale of ["en", "es", "zh"] as const) {
        const explanation = getChargeExplanation(
          definition.name,
          "FL",
          locale,
          definition.id,
        );
        expect(explanation?.slug).toBe(definition.slug);
        expect(explanation?.plainSummary).toBe(definition.text[locale].plainSummary);
      }
    }
    const sharedName = FLORIDA_REVIEWED_DEFINITIONS.find(row => row.id === ids[0])!.name;
    expect(getChargeExplanation(sharedName, "FL", "en", "fl-fs-not-a-real-id")).toBeNull();
  });

  it("preserves generic explanations for known legacy IDs without borrowing a source-first branch", () => {
    for (const locale of ["en", "es", "zh"]) {
      const explanation = getChargeExplanation(
        "Aggravated assault", "FL", locale, "fl-aggravated-assault",
      );
      expect(explanation?.slug).toBe("aggravated-assault");
      expect(explanation?.canonicalChargeId).toBeUndefined();
    }
    expect(getChargeExplanation("Aggravated assault", "FL", "en", "fl-unknown")).toBeNull();
  });

  it("accepts exact statutory known-as and is naming clauses without fuzzy aliases", () => {
    expect(floridaIdentityQuoteStatesName(
      "Trafficking in cocaine",
      "which felony shall be known as “trafficking in cocaine,”",
    )).toBe(true);
    expect(floridaIdentityQuoteStatesName(
      "Manslaughter",
      "The killing is manslaughter.",
    )).toBe(true);
    expect(floridaIdentityQuoteStatesName(
      "Trafficking in cocaine",
      "This provision concerns trafficking.",
    )).toBe(false);
  });

  it("bounds deep structural markers without matching inline references", () => {
    const text = [
      "(1)(a)\u2003",
      "An inline citation to (1)(c)4.a. is not a structural marker.",
      "(c)1.\u2003",
      "first",
      "4.a.\u2003",
      "target conduct",
      "b.\u2003",
      "outside letter branch",
      "5.\u2003",
      "outside numeric branch",
      "(d)1.\u2003",
      "outside paragraph",
    ].join("\n");
    const deep = findSubdivisionRange(text, "(1)(c)4.a.")[0];
    expect(text.slice(deep.start, deep.end)).toContain("target conduct");
    expect(text.slice(deep.start, deep.end)).not.toContain("outside letter branch");
    const numeric = findSubdivisionRange(text, "(1)(c)4.")[0];
    expect(text.slice(numeric.start, numeric.end)).toContain("outside letter branch");
    expect(text.slice(numeric.start, numeric.end)).not.toContain("outside numeric branch");
  });

  it("maps a shared operative grade quote by meaning rather than quote order", () => {
    const quote = "The offense is a felony or a misdemeanor according to the underlying offense.";
    expect(floridaGradeQuoteStatesCategory(quote, "felony")).toBe(true);
    expect(floridaGradeQuoteStatesCategory(quote, "misdemeanor")).toBe(true);
    expect(floridaGradeQuoteStatesCategory("the underlying offense", "felony")).toBe(false);
  });

  it("keeps the 25 reviewed legacy selections separate from additive IDs", () => {
    const seed = buildFloridaSourceDatabaseSeed(loadFloridaAuthorityManifest());
    const legacyIds = seed.selectableChargeIds.filter(id => !id.startsWith("fl-fs-"));
    expect(legacyIds).toHaveLength(25);
    expect(seed.selectableChargeIds.filter(id => id.startsWith("fl-fs-"))
      .every(id => !legacyIds.includes(id))).toBe(true);
  });

  it("assembles only an explicitly pinned, complete source-first definition", () => {
    const { definition, report, eligibility } = fixture();
    const records = buildFloridaReviewedSourceRecords([definition], report, eligibility);
    expect(records).toHaveLength(1);
    expect(records[0].dependencies.map(row => row.supportRole))
      .toEqual(["offense", "grading", "grading", "grading", "grading", "grading"]);
    const projected = groupFloridaReviewedDependenciesForAuthority(records[0]);
    expect(projected).toHaveLength(3);
    expect(projected.filter(row => row.document.sourceKey === "fl:statute:999.001")
      .map(row => row.supportRole)).toEqual(["offense", "grading"]);
    expect(projected.find(row => row.document.sourceKey === "fl:statute:999.002")
      ?.dependencyRoles)
      .toEqual(["grading", "definition", "exception", "justification"]);
  });

  it("rejects a supporting provision as primary offense authority", () => {
    const { definition, report, eligibility } = fixture();
    report.drafts[0].requiredDependencies[0].role = "grading";
    eligibility.reportHash = hashJson(report);
    expect(() => buildFloridaReviewedSourceRecords([definition], report, eligibility))
      .toThrow("approval binding failed");
  });

  it("does not let a new receipt extend the oldest retrieved body", () => {
    const { definition, report, eligibility } = fixture();
    const records = buildFloridaReviewedSourceRecords([definition], report, eligibility);
    const receipt: FloridaReviewedReceipt = {
      schemaVersion: 1,
      reportHash: hashJson(report),
      eligibilityHash: hashJson(eligibility),
      checkedAt: "2026-08-30T00:00:00.000Z",
      expiresAt: "2026-09-02T00:00:00.001Z",
      documents: records[0].dependencies.map(document => ({
        sourceKey: document.sourceKey,
        contentHash: document.contentHash,
        retrievedAt: document.retrievedAt,
      })),
    };
    expect(validateFloridaReviewedRefreshReceipt(
      receipt, report, eligibility, records, new Date("2026-08-31T00:00:00.000Z"),
    )).not.toBeNull();
  });
});