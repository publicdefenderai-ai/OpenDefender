/**
 * A review ledger, never a publication script. Preserve all operative naming,
 * grading and cross-reference evidence instead of treating the first matching
 * sentence or the heading as a complete offense definition.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildOhioChapter2903Accounting } from "./account-chapter-2903";
import { OHIO_CHAPTER_2903_PILOT_CHARGES } from "../../../shared/ohio-chapter-2903-catalog";

const explicitUnits: Record<string, Array<{ name: string; conduct: string; anchor: string }>> = {
  "2903.06": [
    { name: "Aggravated vehicular homicide", conduct: "(A)(1) or (A)(2)", anchor: "(B)(1) Whoever violates division (A)(1) or (2)" },
    { name: "Vehicular homicide", conduct: "(A)(3)", anchor: "(C) Whoever violates division (A)(3)" },
    { name: "Vehicular manslaughter", conduct: "(A)(4)", anchor: "(D) Whoever violates division (A)(4)" },
  ],
  "2903.08": [
    { name: "Aggravated vehicular assault", conduct: "(A)(1)", anchor: "(B)(1) Whoever violates division (A)(1)" },
    { name: "Vehicular assault", conduct: "(A)(2) or (A)(3)", anchor: "(C)(1) Whoever violates division (A)(2) or (3)" },
  ],
  "2903.34": [
    { name: "Patient abuse", conduct: "(A)(1)", anchor: "(C) Whoever violates division (A)(1)" },
    { name: "Gross patient neglect", conduct: "(A)(2)", anchor: "(D) Whoever violates division (A)(2)" },
    { name: "Patient neglect", conduct: "(A)(3)", anchor: "(E) Whoever violates division (A)(3)" },
  ],
};

export function buildChapterPublicationReview(
  discovery: Parameters<typeof buildOhioChapter2903Accounting>[0],
) {
  const accounting = buildOhioChapter2903Accounting(discovery);
  const discoveredIds = new Set(discovery.sections.map(row => row.sectionId));
  const rows = accounting.rows.map(row => {
    const source = discovery.sections.find(source => source.sectionId === row.sectionId)!;
    const lines = source.normalizedText.split("\n");
    const quote = (text: string) => {
      const start = source.normalizedText.indexOf(text);
      if (start < 0) throw new Error(`Missing evidence for ${row.sectionId}`);
      return { text, start, end: start + text.length, sourceHash: row.evidenceSourceHash };
    };
    const namedUnits = (explicitUnits[row.sectionId] ?? []).map(unit => {
      const line = lines.find(line => line.startsWith(unit.anchor));
      if (!line || !line.toLowerCase().includes(`guilty of ${unit.name.toLowerCase()}`)) {
        throw new Error(`Named offense boundary changed for ${row.sectionId}: ${unit.name}`);
      }
      return { name: unit.name, conductDivisions: unit.conduct, evidence: quote(line) };
    });
    const references = [...new Set([...source.normalizedText.matchAll(/\b\d{4}\.\d{2,3}\b/g)]
      .map(match => match[0]).filter(section => section !== row.sectionId))].sort();
    const configured = OHIO_CHAPTER_2903_PILOT_CHARGES.filter(charge => charge.code === row.sectionId);
    return {
      section: row.sectionId, heading: row.exactTitle, sourceUrl: row.sourceUrl,
      sourceHash: row.evidenceSourceHash, effectiveDate: row.effectiveDate,
      disposition: row.disposition,
      sourceFirstConfiguredIds: configured.map(charge => charge.id),
      // The code configuration is not proof of current database/UI availability.
      status: configured.length ? "source_first_configured_requires_live_runtime_check"
        : row.disposition === "supporting_provision" ? "supporting_provision"
        : "withheld_from_source_first_publication",
      namedUnits,
      offenseAndGradingEvidence: lines.filter(line =>
        /Whoever violates|is guilty of|violation of this section is|\b(?:felony|misdemeanor) of the\b/i.test(line),
      ).map(quote),
      crossReferences: references.map(section => ({
        section, discoveredInChapter: discoveredIds.has(section),
        status: "dependency_requires_claim_specific_validation",
      })),
      remainingWork: configured.length ? ["Verify currentness, runtime availability and charge-specific guidance; no historical-law completeness claim."]
        : row.disposition === "supporting_provision" ? []
        : [
          "Resolve all applicable elements, grading conditions and penalty dependencies before activation.",
          "Reconcile legacy IDs without assuming shared citations establish equivalence.",
          ...(namedUnits.length ? ["Explicit statutory names and conduct groupings extracted; do not create one offense per subparagraph or mistake grades for new names."] : []),
          ...(row.sectionId === "2903.03" ? ["Include division (B) sexual-motivation allegation and § 2971.01 dependency; an ordinary first-degree sentencing range does not settle every specification."] : []),
          ...(row.sectionId === "2903.43" ? ["Use divisions (I)(1)-(2), not the administrative heading, to identify the fifth-degree felony and qualifying enrollment duties."] : []),
        ],
    };
  });
  return {
    schemaVersion: 1,
    reportKind: "chapter_publication_review_not_a_runtime_catalog",
    inputHash: createHash("sha256").update(JSON.stringify(discovery)).digest("hex"),
    summary: {
      examinedSections: rows.length,
      offenseCandidates: accounting.accounting.offenseCandidateSectionCount,
      supportingProvisions: accounting.accounting.supportingProvisionCount,
      structuralInterpretationSections: accounting.accounting.needsLegalInterpretationCount,
      sourceFirstConfiguredRecords: rows.reduce((sum, row) => sum + row.sourceFirstConfiguredIds.length, 0),
      withheldOffenseBearingSections: rows.filter(row => row.status === "withheld_from_source_first_publication").length,
      explicitlyGroupedNamedUnits: rows.reduce((sum, row) => sum + row.namedUnits.length, 0),
      namingTranscriptionReviewRequests: 0,
    },
    rows,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const discovery = JSON.parse(readFileSync("scripts/data-review/output/ohio-chapter-2903-discovery.json", "utf8"));
  const report = buildChapterPublicationReview(discovery);
  writeFileSync("scripts/data-review/output/ohio-chapter-2903-publication-review.json", JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report.summary, null, 2));
}