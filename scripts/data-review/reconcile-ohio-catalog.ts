/**
 * Reconcile the existing Ohio catalog against the offense inventory derived
 * from official Revised Code text.
 *
 * The catalog's synthesized labels are the problem this project set out to fix:
 * a row citing section 2903.01 is called "Murder in the First Degree", but the
 * statute's own guilt clause says "aggravated murder". Ohio states the offense
 * name itself, so most of these are resolvable from the text without an
 * attorney transcribing anything.
 *
 * Verdicts are ordered by how much judgment they need:
 *
 *   exact_match         catalog label already equals the statutory name
 *   rename_single       one offense in the section; adopt its statutory name
 *   rename_compound     compound section, but the label matches one offense
 *   adopt_catchline     prohibition with no stated name; the catchline is the name
 *   label_conflict      the section's only offense does not describe the label
 *   compound_ambiguous  compound section, label matches none of the offenses
 *   discovery_unresolved present section needing further extraction/dependency analysis
 *   section_missing     the cited section is not in the official code
 *
 * Unresolved discovery is engineering/source work before legal referral.
 * Mechanical matches remain analysis proposals with supporting evidence. A rename is proposed
 * only when one name's content words contain the other's, so a label naming a
 * narrower offense than the section defines is escalated instead of merged.
 *
 * Run with:
 *   npx tsx scripts/data-review/reconcile-ohio-catalog.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { criminalCharges } from "../../shared/criminal-charges";
import { normalizeOffenceName } from "./ohio-discovery/offense-extractor";
import type { OhioClassifiedSection } from "./classify-ohio-offenses";

const ROOT = process.cwd();
const INVENTORY_PATH = path.resolve(ROOT, "scripts/data-review/output/ohio-offense-inventory.json");
const ENUMERATION_PATH = path.resolve(ROOT, "scripts/data-review/output/ohio-code-enumeration.json");
const OUTPUT_PATH = path.resolve(ROOT, "scripts/data-review/output/ohio-catalog-reconciliation.json");
const REVIEW_CSV_PATH = path.resolve(ROOT, "scripts/data-review/output/ohio-catalog-manual-review.csv");

export type OhioReconciliationVerdict =
  | "exact_match"
  | "rename_single"
  | "rename_compound"
  | "adopt_catchline"
  | "resolve_by_name"
  | "label_conflict"
  | "compound_ambiguous"
  | "citation_candidates"
  | "discovery_unresolved"
  | "section_missing";

export const OHIO_MECHANICAL_VERDICTS: ReadonlySet<OhioReconciliationVerdict> = new Set([
  "exact_match",
  "rename_single",
  "rename_compound",
  "adopt_catchline",
  "resolve_by_name",
]);

export interface OhioReconciliationRow {
  chargeId: string;
  catalogLabel: string;
  catalogCode: string;
  section: string | null;
  verdict: OhioReconciliationVerdict;
  statutoryName: string | null;
  officialCatchline: string | null;
  sourceUrl: string | null;
  candidateNames: string[];
  grades: string[];
  evidence: string | null;
  reason: string;
}

/**
 * Degree and severity wording differs between the catalog's synthesized labels
 * and Ohio's statutory names without changing which offense is meant.
 */
const LABEL_NOISE = new Set([
  "in", "the", "of", "a", "an", "and", "or", "degree",
  "first", "second", "third", "fourth", "fifth", "1st", "2nd", "3rd", "4th", "5th",
  "simple", "basic", "general",
]);

function contentWords(value: string): Set<string> {
  return new Set(
    normalizeOffenceName(value).split(" ").filter(word => word && !LABEL_NOISE.has(word)),
  );
}

/**
 * A rename is safe only when one name's content words contain the other's.
 * "Murder in the First Degree" against "aggravated murder" is the same offense
 * described differently. "Assault on Peace Officer" against "felonious assault"
 * is not: the catalog label carries "peace officer", which the statutory name
 * does not, so the citation itself may be wrong. Renaming that silently would
 * merge two distinct offenses inside published guidance.
 */
function isSafeRename(catalogLabel: string, statutoryName: string): boolean {
  const label = contentWords(catalogLabel);
  const statutory = contentWords(statutoryName);
  if (label.size === 0 || statutory.size === 0) return false;
  const labelInStatutory = [...label].every(word => statutory.has(word));
  const statutoryInLabel = [...statutory].every(word => label.has(word));
  return labelInStatutory || statutoryInLabel;
}

function gradeLabel(grade: { kind: string; degree: string | null; conditional: boolean }): string {
  const base = grade.kind === "minor_misdemeanor"
    ? "minor misdemeanor"
    : `${grade.kind}${grade.degree ? ` ${grade.degree} degree` : ""}`;
  return grade.conditional ? `${base} (conditional)` : base;
}

function sectionOf(code: unknown): string | null {
  const match = String(code ?? "").match(/(\d{3,4}\.\d{2,6})/);
  return match ? match[1] : null;
}

export function reconcileOhioCatalog(options: {
  inventoryPath?: string;
  enumerationPath?: string;
  catalog?: Array<{ id: string; name: string; code?: string; jurisdiction: string }>;
  cacheDir?: string;
} = {}): {
  rows: OhioReconciliationRow[];
  totals: Record<string, number>;
} {
  const inventoryPath = options.inventoryPath ?? INVENTORY_PATH;
  if (!fs.existsSync(inventoryPath)) {
    throw new Error(`Classify the Ohio code first; no inventory at ${inventoryPath}`);
  }
  const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8")) as {
    sections: OhioClassifiedSection[];
    accounting?: { enumerationHash: string };
  };
  const enumerationText = fs.readFileSync(options.enumerationPath ?? ENUMERATION_PATH, "utf8");
  if (inventory.accounting?.enumerationHash !== createHash("sha256").update(enumerationText).digest("hex")) {
    throw new Error("Reclassify Ohio before reconciliation: inventory is not bound to this enumeration");
  }
  const enumeration = JSON.parse(enumerationText) as {
    sections: Array<{ section: string; catchline: string; sourceUrl: string; repealed: boolean; contentHash: string }>;
  };
  const enumerated = new Map(enumeration.sections.map(row => [row.section, row]));
  const bySection = new Map(inventory.sections.map(row => [row.section, row]));
  const contexts = new Map<string, string>();
  let warnedMissingContext = false;
  const missingContext = (): null => {
    if (!warnedMissingContext) {
      console.warn("Ohio source cache is missing or incomplete; some reviewer evidence excerpts will be empty. Restore .cache/ohio-chapters with acquire-ohio-code.ts or reparse-ohio-snapshot.ts before using this artifact for review.");
      warnedMissingContext = true;
    }
    return null;
  };
  const chapterTexts = new Map<string, Array<{ section: string; text: string }>>();
  const contextFor = (number: string): string | null => {
    if (contexts.has(number)) return contexts.get(number)!;
    const chapter = number.split(".")[0];
    if (!chapterTexts.has(chapter)) {
      const cache = path.join(options.cacheDir ?? path.resolve(ROOT, ".cache/ohio-chapters"), `chapter-${chapter}.json`);
      if (!fs.existsSync(cache)) return missingContext();
      chapterTexts.set(chapter, JSON.parse(fs.readFileSync(cache, "utf8")).sections);
    }
    const source = chapterTexts.get(chapter)!.find(row => row.section === number);
    if (!source) return missingContext();
    if (createHash("sha256").update(source.text).digest("hex") !== enumerated.get(number)?.contentHash) {
      throw new Error(`Ohio reviewer context does not match enumeration: ${number}`);
    }
    const excerpt = source.text.slice(0, 600);
    contexts.set(number, excerpt);
    return excerpt || null;
  };

  // Many catalog rows carry a doctrinal placeholder such as
  // "MPC § 5.03 / OH conspiracy statute" instead of a citation. Ohio states
  // those offense names itself, so an exact, code-wide unique name match
  // recovers the real section from official text rather than from guesswork.
  const byOffenceName = new Map<string, Array<{ section: string; name: string; evidence: string }>>();
  for (const row of inventory.sections) {
    for (const offence of row.offences) {
      const key = normalizeOffenceName(offence.name);
      const list = byOffenceName.get(key) ?? [];
      list.push({ section: row.section, name: offence.name, evidence: offence.guiltClause.text });
      byOffenceName.set(key, list);
    }
  }

  const rows: OhioReconciliationRow[] = [];
  for (const charge of (options.catalog ?? criminalCharges).filter(row => row.jurisdiction === "OH")) {
    const section = sectionOf(charge.code);
    const base = {
      chargeId: charge.id,
      catalogLabel: charge.name,
      catalogCode: String(charge.code ?? ""),
      section,
      statutoryName: null as string | null,
      officialCatchline: null as string | null,
      sourceUrl: null as string | null,
      candidateNames: [] as string[],
      grades: [] as string[],
      evidence: null as string | null,
    };

    if (!section || !bySection.has(section)) {
      const present = section ? enumerated.get(section) : undefined;
      if (present) {
        const alternative = (byOffenceName.get(normalizeOffenceName(charge.name)) ?? []).filter(row => row.section !== section);
        rows.push({ ...base, verdict: alternative.length === 1 ? "citation_candidates" : "discovery_unresolved",
          candidateNames: alternative.length === 1 ? [`${alternative[0].name} (${alternative[0].section})`] : [],
          officialCatchline: present.catchline, sourceUrl: present.sourceUrl,
          evidence: contextFor(section!),
          reason: alternative.length === 1
            ? "The supplied citation exists but has no extracted offense. A unique exact statutory-name match exists elsewhere; review this suggestion without changing the supplied citation automatically."
            : present.repealed
            ? "The section exists in the snapshot but is marked repealed/reserved; investigate temporal applicability."
            : "The section exists in the snapshot but has no recognized offense signal. Investigate extraction and dependencies before any legal referral; omission is not proof that no offense exists.",
        });
        continue;
      }
      const named = byOffenceName.get(normalizeOffenceName(charge.name)) ?? [];
      if (named.length === 1) {
        const found = bySection.get(named[0].section)!;
        rows.push({
          ...base,
          verdict: "resolve_by_name",
          section: named[0].section,
          statutoryName: named[0].name,
          officialCatchline: found.catchline,
          sourceUrl: found.sourceUrl,
          candidateNames: found.offences.map(offence => offence.name),
          grades: (found.offences.find(offence =>
            normalizeOffenceName(offence.name) === normalizeOffenceName(named[0].name))?.grades ?? [])
            .map(gradeLabel),
          evidence: named[0].evidence,
          reason: `The catalog row had no usable citation. Exactly one section in the code states ` +
            `"${named[0].name}" in its own guilt clause, so section ${named[0].section} is that offense.`,
        });
        continue;
      }
      if (named.length > 1) {
        rows.push({
          ...base,
          verdict: "citation_candidates",
          candidateNames: named.map(entry => `${entry.name} (${entry.section})`),
          reason: `The catalog row has no usable citation and ${named.length} sections state an offense ` +
            `named "${charge.name}". Choose the intended section.`,
        });
        continue;
      }
      rows.push({
        ...base,
        verdict: "section_missing",
        reason: section
          ? `Section ${section} is not present in the official code inventory.`
          : `Catalog code "${charge.code ?? ""}" does not contain an Ohio section number, and no ` +
            `section states an offense named "${charge.name}".`,
      });
      continue;
    }

    const found = bySection.get(section)!;
    const candidates = found.offences.map(offence => offence.name);
    const externalGrades = found.externalGrades.map(gradeLabel);
    const enriched = {
      ...base,
      officialCatchline: found.catchline,
      sourceUrl: found.sourceUrl,
      candidateNames: candidates,
    };
    const label = normalizeOffenceName(charge.name);
    if (found.offences.length === 0) {
      const alternative = (byOffenceName.get(label) ?? []).filter(row => row.section !== section);
      if (alternative.length === 1) {
        rows.push({ ...enriched, verdict: "citation_candidates",
          candidateNames: [`${alternative[0].name} (${alternative[0].section})`],
          evidence: contextFor(section), reason: "A unique exact statutory-name match exists elsewhere. The supplied citation remains unchanged pending review; this is not a mechanical correction." });
        continue;
      }
    }
    const matched = found.offences.find(offence => normalizeOffenceName(offence.name) === label);

    if (matched) {
      rows.push({
        ...enriched,
        verdict: "exact_match",
        statutoryName: matched.name,
        grades: matched.grades.map(gradeLabel),
        evidence: matched.guiltClause.text,
        reason: "The catalog label already equals the statutory offense name.",
      });
      continue;
    }
    if (found.offences.length === 1) {
      const only = found.offences[0];
      if (isSafeRename(charge.name, only.name)) {
        rows.push({
          ...enriched,
          verdict: "rename_single",
          statutoryName: only.name,
          grades: only.grades.map(gradeLabel),
          evidence: only.guiltClause.text,
          reason: `Section ${section} states exactly one offense and the catalog label describes ` +
            "the same offense, so the statutory name governs.",
        });
      } else {
        rows.push({
          ...enriched,
          verdict: "label_conflict",
          statutoryName: only.name,
          grades: only.grades.map(gradeLabel),
          evidence: only.guiltClause.text,
          reason: `Section ${section} states only "${only.name}", which does not describe the catalog ` +
            `label "${charge.name}". Confirm whether the citation is wrong or the row should be renamed.`,
        });
      }
      continue;
    }
    if (found.offences.length > 1) {
      // A compound section only resolves itself when the catalog label is
      // recognisable in one of the statutory names; otherwise a person picks.
      const partial = found.offences.filter(offence => isSafeRename(charge.name, offence.name));
      if (partial.length === 1) {
        rows.push({
          ...enriched,
          verdict: "rename_compound",
          statutoryName: partial[0].name,
          grades: partial[0].grades.map(gradeLabel),
          evidence: partial[0].guiltClause.text,
          reason: `Section ${section} states several offenses; the catalog label matches exactly one.`,
        });
        continue;
      }
      rows.push({
        ...enriched,
        verdict: "compound_ambiguous",
        grades: [],
        evidence: found.offences.map(offence => offence.guiltClause.text).join(" | "),
        reason: `Section ${section} states ${found.offences.length} offenses and the catalog label matches ` +
          `${partial.length === 0 ? "none" : "more than one"} of them. Choose the intended offense.`,
      });
      continue;
    }
    if (found.classification === "externally_graded_prohibition" ||
        found.classification === "graded_prohibition") {
      rows.push({
        ...enriched,
        verdict: "adopt_catchline",
        statutoryName: found.catchline,
        grades: externalGrades,
        evidence: found.externalGrades[0]?.span.text ?? null,
        reason: `Section ${section} states a graded prohibition without naming the offense, ` +
          "so the official catchline is the display name.",
      });
      continue;
    }
    rows.push({
      ...enriched,
      verdict: "discovery_unresolved",
      grades: externalGrades,
      evidence: found.localGrades?.[0]?.context.text ?? found.externalGrades[0]?.context?.text ?? found.externalGrades[0]?.span.text ?? contextFor(section),
      reason: `Section ${section} ("${found.catchline}") has unresolved discovery signals ` +
        `(${found.classification}). Investigate conduct and penalty applicability before any legal referral. ` +
        "This is neither an automatic rename nor a finding that no offense exists.",
    });
  }

  rows.sort((a, b) => a.chargeId.localeCompare(b.chargeId));
  const totals: Record<string, number> = { catalogRows: rows.length };
  for (const row of rows) totals[row.verdict] = (totals[row.verdict] ?? 0) + 1;
  totals.mechanical = rows.filter(row => OHIO_MECHANICAL_VERDICTS.has(row.verdict)).length;
  totals.needsReview = rows.length - totals.mechanical;
  totals.discoveryWork = rows.filter(row => row.verdict === "discovery_unresolved").length;
  return { rows, totals };
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function writeOhioReconciliation(result = reconcileOhioCatalog()): void {
  const { rows, totals } = result;
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify({
    schemaVersion: 1,
    kind: "ohio_catalog_reconciliation",
    publicationStatus: "analysis_only_not_published",
    generatedAt: new Date().toISOString(),
    method: {
      naming: "Statutory names come from each section's own guilt clause.",
      mechanical: [...OHIO_MECHANICAL_VERDICTS],
      limits: "Verdicts are analysis proposals, not approved renames or publication. Discovery work needs engineering/source investigation before any legal referral.",
    },
    totals,
    rows,
  }, null, 2)}\n`);

  const review = rows.filter(row => !OHIO_MECHANICAL_VERDICTS.has(row.verdict));
  fs.writeFileSync(REVIEW_CSV_PATH, [
    ["chargeId", "catalogLabel", "catalogCode", "section", "verdict", "officialCatchline",
      "candidateNames", "sourceUrl", "reason", "evidence", "decision", "note"].join(","),
    ...review.map(row => [
      row.chargeId, row.catalogLabel, row.catalogCode, row.section ?? "", row.verdict,
      row.officialCatchline ?? "", row.candidateNames.join(" | "), row.sourceUrl ?? "",
      row.reason, row.evidence ?? "", "", "",
    ].map(csvCell).join(",")),
  ].join("\n") + "\n");

  console.log(JSON.stringify(totals, null, 2));
  console.log(`\nWrote ${OUTPUT_PATH}`);
  console.log(`Wrote ${REVIEW_CSV_PATH} (${review.length} unresolved rows, including ${totals.discoveryWork} discovery investigations; not an attorney assignment)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  writeOhioReconciliation();
}
