/**
 * Classify every acquired Ohio Revised Code section and derive the statewide
 * offense inventory from the official text.
 *
 * This answers the question the project has never been able to answer for any
 * jurisdiction: how many criminal offenses does this state actually define, and
 * which of them does the catalog already carry? The denominator comes from the
 * code itself, so an offense the catalog never knew about shows up as a gap
 * rather than staying invisible.
 *
 * Classification is evidence-based, never inferred from a catchline:
 *
 *   named_offense                  a guilt clause states the offense's own name
 *   graded_prohibition             a prohibition graded in its own section, unnamed
 *   externally_graded_prohibition  a prohibition graded by the chapter penalty section
 *   prohibition_only               a prohibition with no grade located yet
 *   supporting                     definitions, penalties, and procedure
 *
 * Discovery and classification only. No catalog, eligibility, or approval file
 * is written.
 *
 * Run with:
 *   npx tsx scripts/data-review/classify-ohio-offenses.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractOhioOffences,
  extractOhioPenaltyLinkages,
  hasOhioGradingLanguage,
  hasOhioProhibition,
  normalizeOffenceName,
  type OhioExtractedOffence,
  type OhioOffenceGrade,
} from "./ohio-discovery/offense-extractor";

const ROOT = process.cwd();
const SECTION_CACHE_DIR = path.resolve(ROOT, ".cache/ohio-chapters");
const OUTPUT_PATH = path.resolve(ROOT, "scripts/data-review/output/ohio-offense-inventory.json");

export type OhioSectionClassification =
  | "named_offense"
  | "graded_prohibition"
  | "externally_graded_prohibition"
  | "prohibition_only"
  | "supporting";

export interface OhioExternalGrade extends OhioOffenceGrade {
  /** The penalty section that states this grade. */
  gradedBy: string;
}

export interface OhioClassifiedSection {
  section: string;
  chapter: string;
  titleNumber: string;
  catchline: string;
  sourceUrl: string;
  effectiveDate: string | null;
  contentHash: string;
  classification: OhioSectionClassification;
  repealed: boolean;
  offences: OhioExtractedOffence[];
  /** Grades supplied by a chapter penalty section for this section's conduct. */
  externalGrades: OhioExternalGrade[];
}

interface CachedChapter {
  chapterNumber: string;
  titleNumber: string;
  retrievedAt: string;
  sections: Array<{
    section: string;
    chapter: string;
    catchline: string;
    sourceUrl: string;
    effectiveDate: string | null;
    text: string;
    contentHash: string;
    repealed: boolean;
  }>;
}

function classify(
  offences: OhioExtractedOffence[],
  externalGrades: OhioExternalGrade[],
  text: string,
): OhioSectionClassification {
  if (offences.length > 0) return "named_offense";
  const prohibition = hasOhioProhibition(text);
  if (!prohibition) return "supporting";
  if (hasOhioGradingLanguage(text)) return "graded_prohibition";
  // Ohio's regulatory chapters state conduct here and punishment in the
  // chapter penalty section, so an external grade completes the offense.
  if (externalGrades.length > 0) return "externally_graded_prohibition";
  return "prohibition_only";
}

export function classifyOhioOffenses(): {
  sections: OhioClassifiedSection[];
  totals: Record<string, number>;
} {
  if (!fs.existsSync(SECTION_CACHE_DIR)) {
    throw new Error(`Acquire the Ohio code first; no cache at ${SECTION_CACHE_DIR}`);
  }
  const files = fs.readdirSync(SECTION_CACHE_DIR).filter(name => name.endsWith(".json"));
  if (files.length === 0) throw new Error("No acquired Ohio chapters found");

  const chapters = files.map(file => JSON.parse(
    fs.readFileSync(path.join(SECTION_CACHE_DIR, file), "utf8"),
  ) as CachedChapter);

  // First pass: read every penalty clause so conduct sections can be graded by
  // the chapter penalty section that punishes them.
  const externalGrades = new Map<string, OhioExternalGrade[]>();
  for (const chapter of chapters) {
    for (const section of chapter.sections) {
      if (section.repealed) continue;
      for (const linkage of extractOhioPenaltyLinkages(section.text, section.section)) {
        for (const target of linkage.targetSections) {
          const list = externalGrades.get(target) ?? [];
          list.push({ ...linkage.grade, gradedBy: section.section });
          externalGrades.set(target, list);
        }
      }
    }
  }

  const sections: OhioClassifiedSection[] = [];
  for (const chapter of chapters) {
    for (const section of chapter.sections) {
      // A repealed or reserved number stays in the denominator but can never
      // contribute an offense.
      const offences = section.repealed ? [] : extractOhioOffences(section.text, section.section);
      const external = section.repealed ? [] : externalGrades.get(section.section) ?? [];
      sections.push({
        section: section.section,
        chapter: section.chapter,
        titleNumber: chapter.titleNumber,
        catchline: section.catchline,
        sourceUrl: section.sourceUrl,
        effectiveDate: section.effectiveDate,
        contentHash: section.contentHash,
        classification: section.repealed
          ? "supporting"
          : classify(offences, external, section.text),
        repealed: section.repealed,
        offences,
        externalGrades: external,
      });
    }
  }

  sections.sort((a, b) =>
    a.section.localeCompare(b.section, "en", { numeric: true, sensitivity: "base" }));

  const totals: Record<string, number> = {
    sections: sections.length,
    repealedOrReserved: sections.filter(row => row.repealed).length,
    named_offense: 0,
    externally_graded_prohibition: 0,
    graded_prohibition: 0,
    prohibition_only: 0,
    supporting: 0,
  };
  for (const row of sections) totals[row.classification]++;

  const distinctNames = new Set<string>();
  let namedOffenceCount = 0;
  for (const row of sections) {
    for (const offence of row.offences) {
      namedOffenceCount++;
      distinctNames.add(normalizeOffenceName(offence.name));
    }
  }
  totals.namedOffences = namedOffenceCount;
  totals.distinctOffenceNames = distinctNames.size;
  totals.compoundSections = sections.filter(row => row.offences.length > 1).length;
  totals.namedOffencesWithGrade = sections.reduce(
    (sum, row) => sum + row.offences.filter(offence => offence.grades.length > 0).length,
    0,
  );

  return { sections, totals };
}

function main(): void {
  const { sections, totals } = classifyOhioOffenses();
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify({
    schemaVersion: 1,
    discoveryKind: "official_ohio_revised_code_offense_inventory",
    publicationStatus: "discovery_only_not_published",
    generatedAt: new Date().toISOString(),
    source: {
      publisher: "Ohio Legislative Service Commission",
      acquisitionKind: "official_whole_chapter",
    },
    method: {
      naming: "Offense names are read from the statute's own guilt clause, not the section catchline.",
      splitting: "A section stating several guilt clauses defines several offenses.",
      grading: "Grades are read only from a clause naming that offense; the longest matching name owns it.",
      limits: "A named offense is a publication candidate, not an approved catalog record.",
    },
    totals,
    // The complete section denominator lives in ohio-code-enumeration.json.
    // Only offence-bearing sections carry evidence worth committing here.
    sections: sections.filter(row => row.classification !== "supporting"),
  }, null, 2)}\n`);
  console.log(JSON.stringify(totals, null, 2));
  console.log(`\nWrote ${OUTPUT_PATH}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main();
}
