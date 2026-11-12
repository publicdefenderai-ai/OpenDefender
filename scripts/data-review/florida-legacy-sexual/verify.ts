import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import definitions from "../../../shared/florida-legacy-sexual.json";
import plan from "./plan.json";
import sources from "./sources.json";
import previous from "../florida-legacy-property/sources.json";
import manifest from "../output/fl-source-manifest.json";
import dates from "../florida-persons/effective-dates.json";
import { floridaHash, validateFloridaDocument, type FloridaBatchDocument } from "../batch/florida-adapter";
import { findSubdivisionRange } from "../../../server/data/florida-reviewed-source-records";

const reused = ["775.082","775.083","741.28","741.2801"] as const;
const documents = Object.assign({}, ...reused.map(key => ({ [key]: previous[key] })), sources) as Record<string,FloridaBatchDocument>;

export function buildSexualBindings(docs = documents) {
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
        identity.catalogCode !== row.code || identity.catalogCategory !== row.category || identity.apiStatus !== "verified" ||
        !["exact_alias_rename","retain"].includes(identity.disposition) || primary.hashBasis !== "source_content" ||
        primary.contentHash !== docs[review.primary]?.contentHash || primary.sourceUrl !== row.citations[0].url)
      throw Error("Legacy identity or official primary text mismatch for " + row.id);
    const bound = review.bindings.map(({section,scope}) => {
      const doc = docs[section];
      if (!doc || doc.section !== section || !validateFloridaDocument(doc) || doc.edition !== "Florida Statutes 2026" ||
          doc.acquisitionKind !== "official_exact_section" || doc.acquiredFrom !== doc.sourceUrl ||
          !row.citations.some(c => c.url === doc.sourceUrl)) throw Error("Invalid source: " + section);
      const spans = scope === "whole" && section === "794.021" ? [{start:0,end:doc.text.length}] : findSubdivisionRange(doc.text,scope);
      if (spans.length !== 1) throw Error("Unbound subdivision: " + section + scope);
      const {start,end} = spans[0];
      used.add(section);
      return {section,scope,start,end,sourceHash:doc.contentHash,quoteHash:floridaHash(doc.text.slice(start,end))};
    });
    if (new Set(bound.map(s => s.section)).size !== row.citations.length || !bound.some(s => s.section === review.primary && s.scope === (review.subdivision ?? "(1)")))
      throw Error("Incomplete statutory coverage: " + row.id);
    return {id:row.id,definitionHash:floridaHash(JSON.stringify(row)),bound};
  });
  if (result.length !== 3 || plan.length !== 3 || new Set(result.map(r => r.id)).size !== 3 || used.size !== Object.keys(docs).length)
    throw Error("Incomplete legacy sexual-offense packet");
  return {effectiveDate:effective,records:result};
}
const here = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === here) {
  const output = path.join(path.dirname(here),"bindings.json");
  const text = JSON.stringify(buildSexualBindings(),null,2)+"\n";
  if (process.argv.includes("--write")) writeFileSync(output,text);
  else if (readFileSync(output,"utf8") !== text) throw Error("Florida evidence drift");
}
