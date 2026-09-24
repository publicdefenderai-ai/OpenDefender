/** Offline, self-contained validation of recorded research. Never alters runtime data. */
import fs from "node:fs";
import { validateDependencyReview, renderDependencyReview, type DependencyReview } from "./ohio-verification/dependency-review";
const read = (p: string) => fs.readFileSync(p, "utf8");
const root = "scripts/data-review/";
const review = JSON.parse(read(root + "ohio-verification/dependency-review.json")) as DependencyReview;
const definitions = new Map<string, { text: string; citationOverride: string | null; eligibility: string }>();
const legacy = read("shared/criminal-charges.ts");
const citations = read("shared/criminal-charge-citations.ts").split("\n");
const eligibility = JSON.parse(read("shared/ohio-reviewed-eligibility.json")).decisions as Array<{ id: string; status: string }>;
for (const row of review.catalogBaseline) {
  let text: string | undefined;
  if (row.kind === "existing_source_based_definition") {
    if (!["shared/ohio-reviewed-data/a.json", "shared/ohio-reviewed-data/b.json", "shared/ohio-reviewed-data/c.json"].includes(row.path)) throw new Error("Unexpected catalog file");
    const source = (JSON.parse(read(row.path)) as Array<{ id: string }>).find(item => item.id === row.id);
    if (source) text = JSON.stringify(source);
  } else if (row.kind === "legacy_definition" && row.path === "shared/criminal-charges.ts") {
    const escaped = row.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = legacy.match(new RegExp(`\\{\\s*id: ['"]${escaped}['"][\\s\\S]*?\\n  \\}`))?.[0];
  }
  if (!text) throw new Error(`Missing catalog definition: ${row.id}`);
  definitions.set(row.id, { text, citationOverride: citations.find(line => line.includes(`"${row.id}"`))?.trim() ?? null,
    eligibility: eligibility.find(item => item.id === row.id)?.status ?? "not_assessed_by_this_review" });
}
const totals = validateDependencyReview(review, read(root + "ohio-verification/batch-one.json"),
  read(root + "output/ohio-code-enumeration.json"), JSON.parse(read(root + "output/ohio-catalog-reconciliation.json")).rows, definitions);
fs.writeFileSync(root + "output/ohio-dependency-review.md", renderDependencyReview(review, totals));
console.log(JSON.stringify(totals, null, 2));
