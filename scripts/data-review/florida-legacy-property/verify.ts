import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findSubdivisionRange } from "../../../server/data/florida-reviewed-source-records";
import { floridaHash, validateFloridaDocument, type FloridaBatchDocument } from "../batch/florida-adapter";
import plan from "./plan.json";
import retained from "./sources.json";
import manifest from "../output/fl-source-manifest.json";
import definitions from "../../../shared/florida-legacy-property.json";
import effectiveDates from "../florida-persons/effective-dates.json";

export function buildLegacyPropertyBindings(sourceDocs = retained, records = plan) {
  const sources: Record<string, FloridaBatchDocument> = sourceDocs as Record<string, FloridaBatchDocument>;
  const used = new Set<string>();
  if (records.length !== 6 || definitions.length !== 6 || new Set(records.map(row => row.id)).size !== 6)
    throw Error("Expected six distinct legacy property identities");
  for (const [section, source] of Object.entries(sources)) {
    if (section !== source.section || !validateFloridaDocument(source) || source.acquisitionKind !== "official_exact_section" ||
        source.edition !== "Florida Statutes 2026" || source.sourceUrl !== source.acquiredFrom)
      throw Error("Invalid retained Florida source " + section);
  }
  const effectiveDate = effectiveDates.find(row => row.chapter === "2026-86");
  if (!effectiveDate || effectiveDate.effectiveDate !== "2026-07-01" ||
      floridaHash(effectiveDate.effectiveDateQuote) !== effectiveDate.quoteSha256)
    throw Error("Missing dated domestic reclassification authority");
  const bindings = records.map(row => {
    const d = definitions.find(item => item.id === row.id);
    const m = manifest.catalogRecords.find(item => item.chargeId === row.id);
    const p = m?.provisions.find(item => item.section === row.primary && item.subdivision === row.subdivision);
    if (!d || !m || !p || m.apiStatus !== "verified" || !["retain","exact_alias_rename"].includes(m.disposition) ||
        m.catalogLabel !== d.name || m.catalogCategory !== d.category || m.catalogCode !== d.code ||
        d.code !== row.primary + (row.subdivision ?? "") || p.hashBasis !== "source_content" ||
        p.contentHash !== sources[row.primary]?.contentHash || p.sourceUrl !== d.citations[0].url)
      throw Error("Legacy Florida identity or source drift: " + row.id);
    const urls = new Set(d.citations.map(citation => citation.url));
    const spans = row.bindings.map(({ section, scope }) => {
      const source = sources[section];
      if (!source || !urls.has(source.sourceUrl)) throw Error("Missing citation for " + section);
      const ranges = findSubdivisionRange(source.text, scope);
      if (ranges.length !== 1) throw Error("Unbound statutory subdivision: " + section + scope);
      const { start, end } = ranges[0];
      used.add(section);
      return { section, scope, start, end, sourceHash: source.contentHash, quoteHash: floridaHash(source.text.slice(start, end)) };
    });
    if (new Set(row.bindings.map(b => b.section)).size !== urls.size ||
        !spans.some(b => b.section === row.primary && b.scope === "(1)") ||
        (row.subdivision && !spans.some(b => b.section === row.primary && b.scope === row.subdivision)))
      throw Error("Incomplete primary or dependency coverage: " + row.id);
    return { id: d.id, officialTitle: p.officialTitle, citation: d.citations[0].citation, definitionHash: floridaHash(JSON.stringify(d)), spans };
  });
  if (used.size !== Object.keys(sources).length) throw Error("Unused source document");
  return { domesticEnhancementEffectiveDate: effectiveDate, records: bindings };
}

const here = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === here) {
  const file = path.join(path.dirname(here), "bindings.json");
  const content = JSON.stringify(buildLegacyPropertyBindings(), null, 2) + "\n";
  if (process.argv[2] === "--write") writeFileSync(file, content);
  else if (readFileSync(file, "utf8") !== content) throw Error("Florida property bindings drift");
}
