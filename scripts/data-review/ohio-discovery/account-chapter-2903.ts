/**
 * A source-first, non-publication accounting of the 40 section pages found by
 * the Chapter 2903 discovery crawl.  This module deliberately does not read
 * the charge catalog or any runtime source database.
 *
 * Interpretive dispositions below are bound to a normalized official-text
 * hash.  An amended page, parser change, missing quote, or unknown section
 * stops the replay rather than carrying a stale interpretation forward.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type ChapterDisposition =
  | "offense_candidate"
  | "supporting_provision"
  | "needs_legal_interpretation";

interface DiscoverySection {
  sectionId: string;
  title: string;
  sourceUrl: string;
  retrievedAt: string;
  effectiveDate: string;
  normalizedText: string;
  normalizedTextSha256: string;
  status: "success" | "failed";
}

interface Discovery {
  generatedAt: string;
  chapter: { chapterNumber: string; title: string; sourceUrl: string };
  sections: DiscoverySection[];
  scope: { chapterSectionEnumeration: { status: string } };
}

interface InterpretiveDefinition {
  sourceHash: string;
  disposition: ChapterDisposition;
  basis: string;
  legalQuestion?: string;
}

export interface ChapterAccountingRow {
  sectionId: string;
  exactTitle: string;
  disposition: ChapterDisposition;
  decisionBasis: string;
  legalQuestion: string | null;
  evidenceSourceHash: string;
  sourceUrl: string;
  effectiveDate: string;
  titleEvidence: string;
  operativeEvidence: string;
  guiltEvidence: string | null;
  gradingEvidence: string | null;
  structuralAlternativeOrSubdivisionReferences: string[];
  sentencingCrossReferences: string[];
}

export interface ChapterAccountingReport {
  schemaVersion: "ohio-chapter-2903-source-accounting-v1";
  reportKind: "source_first_chapter_accounting_not_a_charge_catalog";
  publicationStatus: "not_published_no_catalog_or_runtime_change";
  chapter: {
    number: string;
    exactTitle: string;
    sourceUrl: string;
    discoveryGeneratedAt: string;
  };
  accounting: {
    enumeratedSectionCount: number;
    offenseCandidateSectionCount: number;
    supportingProvisionCount: number;
    needsLegalInterpretationCount: number;
    publishedOffenseCount: number;
    publishedOffenseCountExplanation: string;
    namingReviewCount: number;
    namingReviewCountExplanation: string;
  };
  replayMetrics: {
    expectedSectionCount: number;
    discoveredSectionCount: number;
    definitionsMatched: number;
    hashesValidated: number;
    titleQuotesValidated: number;
    operativeQuotesValidated: number;
    gradingQuotesValidated: number;
    sourceInputSha256: string;
    failClosed: true;
  };
  rows: ChapterAccountingRow[];
}

const DEFINITIONS: Record<string, InterpretiveDefinition> = {
  "2903.01": { sourceHash: "3cb91ef5b68bb598e5892cca22005f824b332612a9fb7c98cc99bccf727f6c5e", disposition: "offense_candidate", basis: "An operative prohibition and section-level guilt statement appear in the official text; the stated punishment is cross-referenced to R.C. 2929.02." },
  "2903.02": { sourceHash: "2f7644b0d621de04b47839e3e1422e153e12f02345234ffdf08ffb6ef5026d44", disposition: "offense_candidate", basis: "An operative prohibition and section-level guilt statement appear in the official text; the stated punishment is cross-referenced to R.C. 2929.02." },
  "2903.03": { sourceHash: "9a7b0826d368fe364e75fe9fa57fd3bb324c41e93f42731def486db7489e98cf", disposition: "offense_candidate", basis: "The official text contains a conduct prohibition and expressly calls a violation voluntary manslaughter, a felony of the first degree." },
  "2903.04": { sourceHash: "73275f6642f5cfd9ba70481ef972ca800719b8c264bb6a087d1b310b918a538e", disposition: "offense_candidate", basis: "The official text contains operative prohibitions and expressly grades violations of divisions (A) and (B)." },
  "2903.05": { sourceHash: "5df14364b0e49f3d4af23a6f9815779fb50695ca54d6c439af2a4c26035b6905", disposition: "offense_candidate", basis: "The official text contains an operative prohibition and expressly calls a violation negligent homicide with a degree." },
  "2903.06": { sourceHash: "1a341a6b549ac2caa86dbd3d2e2833a8d8db9d2b55d65436d2c94453a9c52ead", disposition: "needs_legal_interpretation", basis: "The official text couples four conduct divisions with three named labels and conditional grades; it supplies offense and grading language but not a safe publication-unit rule.", legalQuestion: "Do divisions (A)(1) through (A)(4), the named labels in (B) through (D), and their conditional degree enhancements represent publishable alternatives, separate offenses, or sentencing variants? Do not infer one catalog row per subparagraph." },
  "2903.08": { sourceHash: "260d4f92320f029f51741f7eb6bfde2ed0c037cb4042fca6729f1c98c6210dab", disposition: "needs_legal_interpretation", basis: "The official text couples conduct divisions to two labels and conditional grades; it supplies offense and grading language but not a safe publication-unit rule.", legalQuestion: "Should division (A)(1)'s aggravated vehicular assault and divisions (A)(2)-(3)'s vehicular assault be represented as alternatives, separate offenses, or sentencing variants, including the conditional grades in (B) and (C)? Do not infer one catalog row per subparagraph." },
  "2903.09": { sourceHash: "0dc125e0785220b45e409f3479968a69349d024634d81eb534f00044f0fcc8d9", disposition: "supporting_provision", basis: "The section expressly begins as a definition applicable to listed sections; it contains no section-level guilt-and-grade clause." },
  "2903.10": { sourceHash: "6bc43e91a7ee073e39769251a269daa021e3984e3e81e683ef71c9e35080691d", disposition: "supporting_provision", basis: "The section expressly defines terms for sections 2903.13 and 2903.16; it contains no section-level guilt-and-grade clause." },
  "2903.11": { sourceHash: "9c6ca00f4b327dd1ac586055e19212c1572fc312d99266fc0076829a827cf96b", disposition: "offense_candidate", basis: "The official text contains an operative prohibition and an express felonious-assault guilt and degree clause." },
  "2903.12": { sourceHash: "1c06d4dfeeaf9d67b2d426acd447eacd0b5ed1e44fa1943e128c3ce849603fe0", disposition: "offense_candidate", basis: "The official text contains an operative prohibition and an express aggravated-assault guilt and degree clause." },
  "2903.13": { sourceHash: "86af661766f63d91804a7a68dc55f484abbc092cc3885f2d0f6b11234e143a1b", disposition: "offense_candidate", basis: "The official text contains operative prohibitions and an express assault guilt and grading clause." },
  "2903.14": { sourceHash: "37db823060f05b58b8604dd229c3786fd821ff531ab35d0a49830ca5d0a8525e", disposition: "offense_candidate", basis: "The official text contains an operative prohibition and expressly calls a violation negligent assault, a misdemeanor of the third degree." },
  "2903.15": { sourceHash: "b72b7210bf3e957763eb7b32ba232f1eb9933896fbe5fa48eb4a55b699543eeb", disposition: "offense_candidate", basis: "The official text contains an operative prohibition and expressly grades permitting child abuse by harm outcome." },
  "2903.16": { sourceHash: "ddd8c72616633332a42876f5f464189901f7a3faaf5c5bab38c860a7c6e6e024", disposition: "offense_candidate", basis: "The official text contains operative prohibitions and expressly names and grades violations of divisions (A) and (B)." },
  "2903.18": { sourceHash: "208605832ba16f42c0ba2080b846292031a113f90d30dd55b3a32f514b6ccbb5", disposition: "offense_candidate", basis: "The official text contains operative prohibitions and an express strangulation guilt and grading clause." },
  "2903.21": { sourceHash: "cef9db2d74c2976f77c2cefc9e546cf86dd5cfcb81e22fc1122610a3658c5523", disposition: "offense_candidate", basis: "The official text contains an operative prohibition and an express aggravated-menacing guilt and grading clause." },
  "2903.22": { sourceHash: "c3af2204e56ff6f479d231c982b013394a78a4a32c37e831a66179234df45cb9", disposition: "offense_candidate", basis: "The official text contains operative prohibitions and an express menacing guilt and grading clause." },
  "2903.31": { sourceHash: "7f4690e77bee0030614db737c65db3c4a58183e30a8f13eaaff37b8faa8f0b6c", disposition: "offense_candidate", basis: "The official text contains operative prohibitions and expressly calls violations hazing with division-specific grades." },
  "2903.32": { sourceHash: "4cd954daba7862a6db757da4ba5f76100cb27092144013444168086e2f43ad68", disposition: "offense_candidate", basis: "The official text contains operative prohibitions and expressly calls a violation female genital mutilation, a felony of the second degree." },
  "2903.33": { sourceHash: "0d09cd93d6fdabbf5a26c6f1fad5e45c51d8731d3b82b2f5cda099170ae2105e", disposition: "supporting_provision", basis: "The section expressly supplies definitions for sections 2903.33 to 2903.36; it contains no section-level guilt-and-grade clause." },
  "2903.34": { sourceHash: "8df500096822e831191ea80f206b632e8afc3be318486634b0e4fef624a26745", disposition: "offense_candidate", basis: "The official text contains operative prohibitions and expressly names and grades patient abuse, gross patient neglect, and patient neglect." },
  "2903.35": { sourceHash: "f91e65890dfca634a6dcd57bb360cbe725723ce1ef95a13692dfd82b32350ddf", disposition: "offense_candidate", basis: "The official text contains an operative prohibition and expressly calls a violation filing a false patient abuse or neglect complaint, a misdemeanor of the first degree." },
  "2903.36": { sourceHash: "72b99064c754ea0459a5e7efb95a4eea20ebb7f466a53b999213d28aa04ba4fd", disposition: "supporting_provision", basis: "The section supplies a retaliation/whistleblower protection rule and no section-level guilt-and-grade clause." },
  "2903.37": { sourceHash: "93ed03ce5b97d52132f68c6898c12bd181acc77e4f5ac9c1263ed45f0004bddc", disposition: "supporting_provision", basis: "The section provides a licensing consequence upon conviction rather than a new operative prohibition with a guilt-and-grade clause." },
  "2903.041": { sourceHash: "ed38ff453938ad9f09639bab5fe866ce247c6d307c4f67edcb311c47ac4bc89d", disposition: "offense_candidate", basis: "The official text contains an operative prohibition and expressly calls a violation reckless homicide, a felony of the third degree." },
  "2903.41": { sourceHash: "13143f8dd952a4568a6f320d4a94d7d3490fa989ac97af00a18e6bd05f9820d1", disposition: "supporting_provision", basis: "The section defines terms used by the violent-offender-database provisions and contains no section-level guilt-and-grade clause." },
  "2903.42": { sourceHash: "5db38c4f9fde8cd28b7977ae0ce9cce2afd162aa149e86d5649f4c90ac6e8c77", disposition: "supporting_provision", basis: "The section establishes database enrollment and rebuttal procedures after a qualifying offense; it contains no new guilt-and-grade clause." },
  "2903.43": { sourceHash: "52cd8cfb17d93c0187bfccd5e93f3c779ff815640505f71a9b3714bd635ff7eb", disposition: "supporting_provision", basis: "The section governs enrollment duties of offenders already subject to VOD duties; it contains no new guilt-and-grade clause." },
  "2903.44": { sourceHash: "04d54f974fd9a9fb668df67ac5dad0432446853cf5a957553ac1ab81e50eefe6", disposition: "supporting_provision", basis: "The section governs enrollment by out-of-state offenders already subject to VOD duties; it contains no new guilt-and-grade clause." },
  "2903.081": { sourceHash: "8af09772290467cf53fbf4fdf7b435b842cad032a2a351f7ab1ee6a25301c5e6", disposition: "supporting_provision", basis: "The section governs warning signs and a construction-zone consequence by reference to another offense; it contains no section-level guilt-and-grade clause." },
  "2903.211": { sourceHash: "64bad11ca2ff1a554a3a7060b8fb3997bad8969c7fafd7abe7acc35cdb710c15", disposition: "offense_candidate", basis: "The official text contains an operative prohibition and an express menacing-by-stalking guilt and grading clause." },
  "2903.212": { sourceHash: "ae60d1e3ab21aec8ec492f99e4bea392f9cbc3ed234f85fdbc71d61b49cc93a3", disposition: "supporting_provision", basis: "The section sets bail treatment when a person is charged with a separately identified violation; it contains no new guilt-and-grade clause." },
  "2903.213": { sourceHash: "3b51cc9a971d786c8d7f62e1e06fe45a62ad7667af1d4be4e723f127153e8540", disposition: "supporting_provision", basis: "The section establishes a motion and hearing procedure for a protection order after a separately alleged offense; it contains no new guilt-and-grade clause." },
  "2903.214": { sourceHash: "71f05a1894e7b479baf2a0e991fa8e91a1aecaa7c61b0803d613e13d87461f40", disposition: "supporting_provision", basis: "The section establishes a civil protection-order petition procedure; it contains no section-level guilt-and-grade clause." },
  "2903.215": { sourceHash: "c6454b43122b4decb9f19fafc2d1976e31011484953f4d0b7d8d811863e1c0ec", disposition: "supporting_provision", basis: "The section authorizes organization-filed protection-order requests based on separately identified violations; it contains no new guilt-and-grade clause." },
  "2903.216": { sourceHash: "6a0abc54e0f3e4dd8ffb95a60d38d676a318d167888f86da101f961c390c9bef", disposition: "offense_candidate", basis: "The official text contains operative prohibitions and an express illegal-use-of-a-tracking-device-or-application guilt and grading clause." },
  "2903.311": { sourceHash: "aa51560429acf06f95a139b02b0445bc9aa7f8fd29959788a0f2edeeeba34747", disposition: "offense_candidate", basis: "The official text contains an operative reporting prohibition and expressly grades a violation by harm outcome." },
  "2903.341": { sourceHash: "fcde948735bd831e024954ac644feaf73bcd6697a7d1073d2a0b5f25c3f40a96", disposition: "offense_candidate", basis: "The official text contains operative prohibitions and an express patient-endangerment guilt and grading clause." },
  "2903.421": { sourceHash: "61a3b527fcae7461bc717158959f342e40a200690e5037b8b7b60c4f61bf5445", disposition: "supporting_provision", basis: "The section governs the VOD presumption and hearing procedure for a qualifying out-of-state offender; it contains no new guilt-and-grade clause." },
};

const EXPECTED_SECTION_COUNT = 40;
const sha256 = (value: string): string => createHash("sha256").update(value).digest("hex");
const unique = (values: string[]): string[] => [...new Set(values)];

function sourceLines(section: DiscoverySection): string[] {
  return section.normalizedText.split("\n").map((line) => line.trim()).filter(Boolean);
}

function requireQuote(section: DiscoverySection, predicate: (line: string) => boolean, purpose: string): string {
  const quote = sourceLines(section).find(predicate);
  if (!quote || !section.normalizedText.includes(quote)) {
    throw new Error(`Fail closed: ${section.sectionId} has no validated ${purpose} quote.`);
  }
  return quote;
}

function titleEvidence(section: DiscoverySection): string {
  const quote = requireQuote(section, (line) => line.startsWith(`Section ${section.sectionId} | `), "title");
  const expected = `Section ${section.sectionId} | ${section.title}.`;
  if (quote !== expected) {
    throw new Error(`Fail closed: ${section.sectionId} title is not routine-extracted from its official heading.`);
  }
  return quote;
}

function operativeEvidence(section: DiscoverySection, disposition: ChapterDisposition): string {
  if (disposition === "supporting_provision") {
    const quote = sourceLines(section).find((line) =>
      !line.startsWith(`Section ${section.sectionId} |`) && !line.startsWith("Effective:"),
    );
    if (!quote || !section.normalizedText.includes(quote)) {
      throw new Error(`Fail closed: ${section.sectionId} has no validated supporting-provision quote.`);
    }
    return quote;
  }
  return requireQuote(section, (line) =>
    /\bno\b.*\bshall\b/i.test(line),
  "operative prohibition");
}

function guiltEvidence(section: DiscoverySection): string | null {
  return sourceLines(section).find((line) =>
    /^(?:\([A-Za-z0-9]+\))+.*\bwhoever violates.*\bguilty\b/i.test(line),
  ) ?? null;
}

function gradingEvidence(section: DiscoverySection): string {
  const direct = sourceLines(section).find((line) =>
    /\b(whoever violates|a violation of (this section|division)).*\b(punished as provided|felony|misdemeanor)\b/i.test(line),
  );
  if (direct) return direct;
  return requireQuote(section, (line) =>
    /\bpunished as provided\b|\b(is|are) a (felony|misdemeanor)\b|\b(felony|misdemeanor) of the\b/i.test(line),
  "grading");
}

function structuralReferences(section: DiscoverySection): { alternatives: string[]; sentencing: string[] } {
  const lines = sourceLines(section);
  const alternatives = unique(lines.filter((line) =>
    /\bdivisions?\b/i.test(line) && (/\bor\b/i.test(line) || /\beither\b/i.test(line) || /violates division/i.test(line)),
  ));
  const sentencing = unique(lines.flatMap((line) => {
    if (!/punished as provided|section 2929\./i.test(line)) return [];
    return [...line.matchAll(/section (2929\.\d{2,3})/gi)].map((match) => `R.C. ${match[1]}`);
  }));
  return { alternatives, sentencing };
}

function assertDiscovery(discovery: Discovery): void {
  if (discovery.chapter.chapterNumber !== "2903" || discovery.scope.chapterSectionEnumeration.status !== "complete") {
    throw new Error("Fail closed: input is not a complete Chapter 2903 discovery result.");
  }
  if (discovery.sections.length !== EXPECTED_SECTION_COUNT) {
    throw new Error(`Fail closed: expected ${EXPECTED_SECTION_COUNT} section records, received ${discovery.sections.length}.`);
  }
  const ids = new Set<string>();
  for (const section of discovery.sections) {
    if (section.status !== "success" || ids.has(section.sectionId)) {
      throw new Error(`Fail closed: duplicate or unsuccessful section ${section.sectionId}.`);
    }
    ids.add(section.sectionId);
    const definition = DEFINITIONS[section.sectionId];
    if (!definition) throw new Error(`Fail closed: no hash-bound definition for ${section.sectionId}.`);
    const calculated = sha256(section.normalizedText);
    if (calculated !== section.normalizedTextSha256 || calculated !== definition.sourceHash) {
      throw new Error(`Fail closed: normalized official source hash changed for ${section.sectionId}.`);
    }
  }
  if (Object.keys(DEFINITIONS).length !== ids.size || Object.keys(DEFINITIONS).some((id) => !ids.has(id))) {
    throw new Error("Fail closed: definitions and discovered section identities do not match exactly.");
  }
}

export function buildOhioChapter2903Accounting(discovery: Discovery): ChapterAccountingReport {
  assertDiscovery(discovery);
  let titleQuotesValidated = 0;
  let operativeQuotesValidated = 0;
  let gradingQuotesValidated = 0;
  const rows = [...discovery.sections]
    .sort((left, right) => left.sectionId.localeCompare(right.sectionId, undefined, { numeric: true }))
    .map((section) => {
      const definition = DEFINITIONS[section.sectionId];
      const title = titleEvidence(section);
      titleQuotesValidated += 1;
      const operative = operativeEvidence(section, definition.disposition);
      operativeQuotesValidated += 1;
      const guilt = definition.disposition === "supporting_provision" ? null : guiltEvidence(section);
      const grading = definition.disposition === "supporting_provision" ? null : gradingEvidence(section);
      if (grading) gradingQuotesValidated += 1;
      const structure = structuralReferences(section);
      return {
        sectionId: section.sectionId,
        exactTitle: section.title,
        disposition: definition.disposition,
        decisionBasis: definition.basis,
        legalQuestion: definition.legalQuestion ?? null,
        evidenceSourceHash: definition.sourceHash,
        sourceUrl: section.sourceUrl,
        effectiveDate: section.effectiveDate,
        titleEvidence: title,
        operativeEvidence: operative,
        guiltEvidence: guilt,
        gradingEvidence: grading,
        structuralAlternativeOrSubdivisionReferences: structure.alternatives,
        sentencingCrossReferences: structure.sentencing,
      };
    });
  const count = (disposition: ChapterDisposition) => rows.filter((row) => row.disposition === disposition).length;
  return {
    schemaVersion: "ohio-chapter-2903-source-accounting-v1",
    reportKind: "source_first_chapter_accounting_not_a_charge_catalog",
    publicationStatus: "not_published_no_catalog_or_runtime_change",
    chapter: {
      number: discovery.chapter.chapterNumber,
      exactTitle: discovery.chapter.title,
      sourceUrl: discovery.chapter.sourceUrl,
      discoveryGeneratedAt: discovery.generatedAt,
    },
    accounting: {
      enumeratedSectionCount: rows.length,
      offenseCandidateSectionCount: count("offense_candidate"),
      supportingProvisionCount: count("supporting_provision"),
      needsLegalInterpretationCount: count("needs_legal_interpretation"),
      publishedOffenseCount: 0,
      publishedOffenseCountExplanation: "This accounting creates no catalog or runtime records. A candidate section is not a published offense.",
      namingReviewCount: 0,
      namingReviewCountExplanation: "Titles are routine-extracted from each official section heading. The two unresolved rows concern statutory publication-unit and grading structure, not title naming.",
    },
    replayMetrics: {
      expectedSectionCount: EXPECTED_SECTION_COUNT,
      discoveredSectionCount: discovery.sections.length,
      definitionsMatched: rows.length,
      hashesValidated: rows.length,
      titleQuotesValidated,
      operativeQuotesValidated,
      gradingQuotesValidated,
      sourceInputSha256: sha256(JSON.stringify(discovery.sections.map((section) => ({
        sectionId: section.sectionId,
        normalizedTextSha256: section.normalizedTextSha256,
      })))),
      failClosed: true,
    },
    rows,
  };
}

function csvCell(value: string | number | null | string[]): string {
  const raw = Array.isArray(value) ? value.join(" | ") : value === null ? "" : String(value);
  return `"${raw.replace(/"/g, "\"\"")}"`;
}

export function accountingCsv(report: ChapterAccountingReport): string {
  const headings = [
    "sectionId", "exactTitle", "disposition", "decisionBasis", "legalQuestion", "evidenceSourceHash",
    "sourceUrl", "effectiveDate", "titleEvidence", "operativeEvidence", "guiltEvidence", "gradingEvidence",
    "structuralAlternativeOrSubdivisionReferences", "sentencingCrossReferences",
  ];
  return [
    headings.join(","),
    ...report.rows.map((row) => headings.map((heading) =>
      csvCell(row[heading as keyof ChapterAccountingRow] as string | number | null | string[]),
    ).join(",")),
    "",
  ].join("\n");
}

export function runOhioChapter2903Accounting(
  inputPath = path.resolve(process.cwd(), "scripts/data-review/output/ohio-chapter-2903-discovery.json"),
  outputDirectory = path.resolve(process.cwd(), "scripts/data-review/output"),
): ChapterAccountingReport {
  const discovery = JSON.parse(fs.readFileSync(inputPath, "utf8")) as Discovery;
  const report = buildOhioChapter2903Accounting(discovery);
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, "ohio-chapter-2903-accounting.json"), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDirectory, "ohio-chapter-2903-accounting.csv"), accountingCsv(report));
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  try {
    const report = runOhioChapter2903Accounting();
    console.log(JSON.stringify({
      outputs: [
        "scripts/data-review/output/ohio-chapter-2903-accounting.json",
        "scripts/data-review/output/ohio-chapter-2903-accounting.csv",
      ],
      accounting: report.accounting,
      replayMetrics: report.replayMetrics,
      substantiveBlockers: report.rows.filter((row) => row.disposition === "needs_legal_interpretation")
        .map((row) => ({ sectionId: row.sectionId, legalQuestion: row.legalQuestion })),
    }, null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}