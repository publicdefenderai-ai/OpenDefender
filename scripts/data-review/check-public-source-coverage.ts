/**
 * Check the measurable public-source coverage target for every current
 * jurisdiction. This reads committed manifests only; it never calls a live
 * legislative source.
 *
 * Usage:
 *   npx tsx scripts/data-review/check-public-source-coverage.ts
 *   npx tsx scripts/data-review/check-public-source-coverage.ts --json
 *   npx tsx scripts/data-review/check-public-source-coverage.ts --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildPublicSourceCoverageReport,
} from "../../server/data/public-source-coverage";

const OUTPUT_PATH = path.resolve(
  process.cwd(),
  "scripts/data-review/output/public-source-coverage-report.json",
);

export function main(args = process.argv.slice(2)): number {
  const report = buildPublicSourceCoverageReport();
  if (args.includes("--write")) {
    fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  }

  if (args.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(
      `High public-source target: ${report.target.catalogAccountingRate * 100}% catalog accounting, ` +
        `${report.target.officialResponseRate * 100}% official responses`,
    );
    for (const row of report.jurisdictions) {
      const blocker = row.blocker ? ` — blocker: ${row.blocker.summary}` : "";
      console.log(
        `${row.jurisdiction}: ${row.status}; ` +
          `official responses ${Math.round(row.officialResponseRate * 100)}%; ` +
          `publishable ${Math.round(row.publishableRate * 100)}%; ` +
          `withheld ${row.withheldRows}/${row.catalogRows}${blocker}`,
      );
    }
    if (args.includes("--write")) console.log(`Wrote ${OUTPUT_PATH}`);
  }

  if (report.belowTargetJurisdictions.length > 0) {
    console.error(
      `Jurisdictions below target (including documented blockers): ${report.belowTargetJurisdictions.join(", ")}`,
    );
    return 1;
  }
  return 0;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  process.exitCode = main();
}