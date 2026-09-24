/** Offline validation of recorded substantive analysis; no source fetching or approval. */
import fs from "node:fs";
import path from "node:path";
import { validateOhioSnapshot, type OhioCachedChapter, type OhioEnumeration } from "./ohio-discovery/snapshot-accounting";
import { verifyOhioBatch, renderOhioBatch, type VerificationBatch } from "./ohio-verification/verify-batch";

const root = process.cwd();
const output = path.join(root, "scripts/data-review/output");
const enumerationText = fs.readFileSync(path.join(output, "ohio-code-enumeration.json"), "utf8");
const cache = path.join(root, ".cache/ohio-chapters");
if (!fs.existsSync(cache)) throw new Error("Restore the Ohio chapter cache before verifying recorded findings");
const chapters = fs.readdirSync(cache).filter(name => name.endsWith(".json"))
  .map(name => JSON.parse(fs.readFileSync(path.join(cache, name), "utf8")) as OhioCachedChapter);
validateOhioSnapshot(chapters, JSON.parse(enumerationText) as OhioEnumeration);
const batch = JSON.parse(fs.readFileSync(path.join(root, "scripts/data-review/ohio-verification/batch-one.json"), "utf8")) as VerificationBatch;
const sources = new Map(chapters.flatMap(chapter => chapter.sections.map(section => [section.section, section] as const)));
const catalog = JSON.parse(fs.readFileSync(path.join(output, "ohio-catalog-reconciliation.json"), "utf8")).rows;
const report = verifyOhioBatch(batch, sources, enumerationText, catalog);
fs.writeFileSync(path.join(output, "ohio-penalty-verification-batch-one.json"), JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(path.join(output, "ohio-penalty-verification-batch-one.md"), renderOhioBatch(report));
console.log(JSON.stringify(report.totals, null, 2));
