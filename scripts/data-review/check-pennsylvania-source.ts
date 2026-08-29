/**
 * Release-time contract check for Pennsylvania's official PAlegis.us
 * consolidated-statute page.
 *
 * This is intentionally a one-page probe, not a refresh. It catches redirects,
 * missing section markers, and HTML-template changes before an importer run
 * could turn many records into withheld authority. It never uses a secondary
 * source as a fallback.
 *
 * Run with:
 *   npm run review:pennsylvania-source
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  checkPennsylvaniaSourceContract,
  PENNSYLVANIA_SOURCE_CONTRACT_REFERENCE,
} from "./import-pennsylvania-source-database";

export async function main(): Promise<void> {
  const result = await checkPennsylvaniaSourceContract();
  const reference = PENNSYLVANIA_SOURCE_CONTRACT_REFERENCE;
  if (!result.ok) {
    console.error(`[FAIL] ${result.source} — Title ${reference.title} § ${reference.section}`);
    for (const failure of result.failures) console.error(`       ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log(`[OK] ${result.source} — Title ${reference.title} § ${reference.section}`);
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFile)) {
  main().catch((error) => {
    console.error("Pennsylvania source contract check failed:", error);
    process.exitCode = 1;
  });
}