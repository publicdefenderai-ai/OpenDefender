import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import definitions from "../../../shared/florida-legacy-remaining.json";
import plan from "./plan.json";
import sources from "./sources.json";
import previous from "../florida-legacy-property/sources.json";
import manifest from "../output/fl-source-manifest.json";
import dates from "../florida-roadway/effective-dates.json";
import { floridaHash, validateFloridaDocument, type FloridaBatchDocument } from "../batch/florida-adapter";
import { findSubdivisionRange } from "../../../server/data/florida-reviewed-source-records";

const reused = ["775.082","775.083","741.28","741.2801"] as const;
const documents = Object.assign({}, ...reused.map(key => ({ [key]: previous[key] })), sources) as Record<string,FloridaBatchDocument>;

function legacyBodyMatches(primary: {contentHash: string; content: string | null}, doc: FloridaBatchDocument | undefined, id: string) {
  if (!doc || !primary.content || floridaHash(primary.content) !== primary.contentHash) return false;
  if (primary.contentHash === doc.contentHash) return true;
  // The old heading included the publisher's superscript footnote marker.
  return id === "fl-minor-in-possession" && doc.section === "562.111" &&
    primary.contentHash === "af564468b310202fd814de9dfe8dc55d4851e642d070f54e197acc4a3b2a1a93" &&
    doc.contentHash === "b9ec030d7760a85a292dd31158c56277a6cff580b84ab82f5a55001c2b29b051" &&
    primary.content === "1" + doc.text;
}

export function buildRemainingBindings(docs = documents) {
  const used = new Set<string>();
  const effective = dates.find(row => row.chapter === "2026-86");
  if (effective?.effectiveDate !== "2026-07-01" || floridaHash(effective.effectiveDateQuote) !== effective.quoteSha256)
    throw Error("Domestic enhancement effective-date evidence unavailable");
  const result = definitions.map(row => {
    const review = plan.find(item => item.id === row.id);
    const identity = manifest.catalogRecords.find(item => item.chargeId === row.id);
    const primary = identity?.provisions[0];
    if (!review || !identity || !primary || primary.section !== review.primary || primary.subdivision !== review.subdivision ||
        row.code !== review.primary + (review.subdivision ?? "") || identity.catalogLabel !== row.legacyLabel ||
        identity.catalogCode !== row.code || identity.catalogCategory !== row.legacyCategory || identity.apiStatus !== "verified" ||
        !["exact_alias_rename","retain"].includes(identity.disposition) || primary.hashBasis !== "source_content" ||
        !legacyBodyMatches(primary, docs[review.primary], row.id) || primary.sourceUrl !== row.citations[0].url)
      throw Error("Legacy identity or official primary text mismatch for " + row.id);
    const bound = review.bindings.map(({section,scope}) => {
      const doc = docs[section];
      if (!doc || doc.section !== section || !validateFloridaDocument(doc) || doc.edition !== "Florida Statutes 2026" ||
          doc.acquisitionKind !== "official_exact_section" || doc.acquiredFrom !== doc.sourceUrl ||
          !row.citations.some(c => c.url === doc.sourceUrl)) throw Error("Invalid source: " + section);
      const spans = scope === "whole" && ["843.02","782.071","831.01"].includes(section) ? [{start:0,end:doc.text.length}] : findSubdivisionRange(doc.text,scope);
      if (spans.length !== 1) throw Error("Unbound subdivision: " + section + scope);
      const {start,end} = spans[0];
      used.add(section);
      return {section,scope,start,end,sourceHash:doc.contentHash,quoteHash:floridaHash(doc.text.slice(start,end))};
    });
    if (new Set(bound.map(s => s.section)).size !== row.citations.length || !bound.some(s => s.section === review.primary && (review.subdivision ? s.scope === review.subdivision : ["whole","(1)"].includes(s.scope))))
      throw Error("Incomplete statutory coverage: " + row.id);
    return {id:row.id, legacyHash:primary.contentHash, definitionHash:floridaHash(JSON.stringify(row)),bound};
  });
  if (result.length !== 13 || plan.length !== 13 || new Set(result.map(r => r.id)).size !== 13 || used.size !== Object.keys(docs).length)
    throw Error("Incomplete legacy remaining choices");
  const homicidePrior = dates.find(d => d.chapter === "2025-121");
  if (homicidePrior?.effectiveDate !== "2025-10-01" || floridaHash(homicidePrior.effectiveDateQuote) !== homicidePrior.quoteSha256)
    throw Error("Missing vehicular homicide prior effective date");
  return {effectiveDates:[effective,homicidePrior],records:result};
}
const here = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === here) {
  const output = path.join(path.dirname(here),"bindings.json");
  const text = JSON.stringify(buildRemainingBindings(),null,2)+"\n";
  if (process.argv.includes("--write")) writeFileSync(output,text);
  else if (readFileSync(output,"utf8") !== text) throw Error("Florida evidence drift");
}
