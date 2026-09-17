/**
 * Explicit acquisition only. This never changes the runtime catalog or renews
 * publication approval. Review the evidence before wiring any new record.
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { extractOhioDocument } from "./import-ohio-source-database";

async function main() {
  const sections = [
    "2903.03", "2903.041", "2903.05", "2903.14",
    "2901.22", "2903.09", "2923.11",
    "2929.14", "2929.144", "2929.18", "2929.24", "2929.28",
  ];
  const documents = [];
  for (const section of sections) {
    const sourceUrl = `https://codes.ohio.gov/ohio-revised-code/section-${section}`;
    const retrievedAt = new Date();
    const response = await fetch(sourceUrl, {
      signal: AbortSignal.timeout(30_000), redirect: "error",
      headers: { Accept: "text/html" },
    });
    if (!response.ok) throw new Error(`${section}: HTTP ${response.status}`);
    const document = extractOhioDocument(await response.text(), section, sourceUrl, retrievedAt);
    if (!document) throw new Error(`${section}: official extraction failed`);
    documents.push({
      section, title: document.title, sourceUrl,
      retrievedAt: retrievedAt.toISOString(),
      effectiveDateStart: document.effectiveDateStart,
      text: document.text,
      contentHash: createHash("sha256").update(document.text).digest("hex"),
    });
    console.log(`${section}: ${document.title} (${document.effectiveDateStart})`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  writeFileSync("scripts/data-review/output/ohio-homicide-support-evidence.json",
    JSON.stringify({ publicationStatus: "acquisition_only_requires_review", documents }, null, 2) + "\n");
}
main().catch(error => { console.error(error); process.exitCode = 1; });