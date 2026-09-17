/**
 * Explicit acquisition only. This never changes the runtime catalog or renews
 * publication approval. Review the evidence before wiring any new record.
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { extractOhioDocument } from "./import-ohio-source-database";

async function main() {
  const manslaughter = process.argv.includes("--manslaughter");
  const assault = process.argv.includes("--assault");
  const assaultDefinitions = process.argv.includes("--assault-definitions");
  const feloniousDefinitions = process.argv.includes("--felonious-assault-definitions");
  const simpleAssault = process.argv.includes("--simple-assault");
  const sections = simpleAssault ? [
    "2903.13", "2903.10", "2903.33", "3937.41", "742.01", "4765.01",
    "146.01", "2967.27", "2967.01", "2305.234", "3727.01", "2941.25",
    "3311.77", "3319.08", "3319.22", "3319.311", "3301.07", "3301.071",
  ] : feloniousDefinitions ? ["2929.01"] : assaultDefinitions ? ["109.54", "2935.081"] : assault ? [
    "2903.11", "2903.12", "2901.01", "2935.01", "109.541",
    "2907.01", "4501.01", "2941.1423", "2941.1425", "2941.1426",
  ] : manslaughter ? [
    "2903.03", "2903.04", "2971.01", "2971.03", "2941.147",
    "2941.148", "4510.02", "4511.19", "2929.13",
  ] : [
    "2903.03", "2903.041", "2903.05", "2903.14",
    "2901.22", "2903.09", "2923.11",
    "2929.14", "2929.144", "2929.18", "2929.24", "2929.28",
  ];
  const documents = [];
  const failures: Array<{ section: string; sourceUrl: string; error: string }> = [];
  for (const section of sections) {
    const sourceUrl = `https://codes.ohio.gov/ohio-revised-code/section-${section}`;
    const retrievedAt = new Date();
    try {
    const response = await fetch(sourceUrl, {
      signal: AbortSignal.timeout(30_000), redirect: simpleAssault ? "manual" : "error",
      headers: { Accept: "text/html" },
    });
    if (!response.ok) throw new Error(`${section}: HTTP ${response.status}${simpleAssault && response.headers.get("location") ? ` -> ${response.headers.get("location")}` : ""}`);
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
    } catch (error) {
      // This new acquisition-only ledger has no runtime consumers. Preserve
      // partial findings, explicitly fail the run, and never weaken the atomic
      // behavior of existing evidence files that already have reviewed pins.
      if (!simpleAssault) throw error;
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ section, sourceUrl, error: message });
      console.error(message);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  writeFileSync(simpleAssault
    ? "scripts/data-review/output/ohio-simple-assault-evidence.json"
    : feloniousDefinitions
    ? "scripts/data-review/output/ohio-felonious-assault-definition-evidence.json"
    : assaultDefinitions
    ? "scripts/data-review/output/ohio-assault-definition-evidence.json"
    : assault
    ? "scripts/data-review/output/ohio-assault-support-evidence.json"
    : manslaughter
    ? "scripts/data-review/output/ohio-manslaughter-support-evidence.json"
    : "scripts/data-review/output/ohio-homicide-support-evidence.json",
    JSON.stringify({
      publicationStatus: "acquisition_only_requires_review",
      documents,
      ...(simpleAssault ? { requestedSections: sections, failures } : {}),
    }, null, 2) + "\n");
  if (failures.length) process.exitCode = 1;
}
main().catch(error => { console.error(error); process.exitCode = 1; });