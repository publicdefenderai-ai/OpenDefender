/**
 * Release-time contract check for Pennsylvania's official PAlegis.us
 * consolidated-statute page.
 *
 * This is intentionally a small set of representative probes, not a refresh.
 * It catches redirects, missing section markers, and HTML-template changes
 * before an importer run could turn many records into withheld authority. It
 * never uses a secondary source as a fallback.
 *
 * Run with:
 *   npm run review:pennsylvania-source
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  checkPennsylvaniaSourceContract,
} from "./import-pennsylvania-source-database";

export async function main(): Promise<void> {
  const result = await checkPennsylvaniaSourceContract();
  for (const page of result.pages) {
    const prefix = page.ok ? "[OK]" : "[FAIL]";
    const write = page.ok ? console.log : console.error;
    write(
      `${prefix} ${page.source}, Title ${page.reference.title} § ${page.reference.section}: ${page.requestedUrl}`,
    );
    for (const failure of page.failures) {
      if (!page.ok) console.error(`       ${failure}`);
    }
  }
  if (!result.ok) process.exitCode = 1;
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFile)) {
  main().catch((error) => {
    console.error("Pennsylvania source contract check failed:", error);
    process.exitCode = 1;
  });
}