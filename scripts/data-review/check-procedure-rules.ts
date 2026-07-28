/**
 * Quarterly Procedure Rules Freshness Check
 *
 * Reads every entry in JURISDICTION_PROCEDURE_RULES, computes the age of its
 * lastVerified date, and flags any entry that has not been re-verified within
 * the past 12 months.
 *
 * lastVerified is stored as 'YYYY-MM'. The check treats the first day of that
 * month as the verification date. An entry is considered stale when today is
 * more than 12 months past that date.
 *
 * Outputs: scripts/data-review/output/procedure-rules-diff.json
 *
 * Run manually: npx tsx scripts/data-review/check-procedure-rules.ts
 *
 * Exit codes:
 *   0 — all entries verified within the last 12 months
 *   1 — one or more entries are stale (or an unexpected error occurred)
 *
 * When the report flags an entry:
 *   1. Verify the jurisdiction's procedure rules against the cited statute/source
 *   2. Update the entry in shared/jurisdiction-procedure-rules.ts
 *   3. Bump lastVerified to the current YYYY-MM
 *   4. Re-run this script to confirm it passes
 *   5. Commit the correction with a message referencing the quarterly check
 */

import fs from 'fs';
import path from 'path';
import { JURISDICTION_PROCEDURE_RULES } from '../../shared/jurisdiction-procedure-rules.js';

interface ProcedureRuleCheckResult {
  jurisdiction: string;
  lastVerified: string;         // YYYY-MM as stored in the data
  ageMonths: number;            // full calendar months since lastVerified
  dataConfidence: 'high' | 'medium' | 'low';
  stale: boolean;               // true when ageMonths > 12
  checkedAt: string;            // ISO timestamp of this run
  reason?: string;
}

/**
 * Compute how many full calendar months have elapsed between a 'YYYY-MM'
 * date and today.  The check is deliberately conservative: if `lastVerified`
 * is '2025-07' and today is '2026-07', that is exactly 12 months — not stale.
 * The entry becomes stale only when today is in '2026-08' or later.
 */
function ageInMonths(lastVerified: string, now: Date): number {
  const [yearStr, monthStr] = lastVerified.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10); // 1-based

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1; // 1-based

  return (nowYear - year) * 12 + (nowMonth - month);
}

function main() {
  const now = new Date();
  const checkedAt = now.toISOString();
  const STALE_THRESHOLD_MONTHS = 12;

  const jurisdictions = Object.keys(JURISDICTION_PROCEDURE_RULES);
  console.log(`Checking ${jurisdictions.length} jurisdiction procedure rule entries...`);

  const results: ProcedureRuleCheckResult[] = jurisdictions.map((jurisdiction) => {
    const rule = JURISDICTION_PROCEDURE_RULES[jurisdiction];
    const { lastVerified, dataConfidence } = rule;

    if (!lastVerified || !/^\d{4}-\d{2}$/.test(lastVerified)) {
      return {
        jurisdiction,
        lastVerified: lastVerified ?? '(missing)',
        ageMonths: Infinity,
        dataConfidence,
        stale: true,
        checkedAt,
        reason: `lastVerified is missing or not in YYYY-MM format: "${lastVerified}"`,
      };
    }

    const age = ageInMonths(lastVerified, now);
    const stale = age > STALE_THRESHOLD_MONTHS;

    return {
      jurisdiction,
      lastVerified,
      ageMonths: age,
      dataConfidence,
      stale,
      checkedAt,
      ...(stale && {
        reason: `Last verified ${age} month(s) ago (${lastVerified}); threshold is ${STALE_THRESHOLD_MONTHS} months. Re-verify against cited sources and update lastVerified.`,
      }),
    };
  });

  const stale = results.filter(r => r.stale);
  const fresh = results.filter(r => !r.stale);

  console.log(`\nResults: ${fresh.length} fresh, ${stale.length} stale (threshold: ${STALE_THRESHOLD_MONTHS} months)`);

  if (stale.length > 0) {
    console.log('\nStale entries requiring re-verification:');
    stale.forEach(r =>
      console.log(`  ⚠  [${r.jurisdiction}] ${r.reason}`)
    );
  } else {
    console.log('\nAll entries are within the 12-month freshness window. ✓');
  }

  // Soonest-expiring fresh entries — useful for planning the next review cycle
  const soonestExpiring = [...fresh]
    .sort((a, b) => b.ageMonths - a.ageMonths)
    .slice(0, 5);

  if (soonestExpiring.length > 0) {
    console.log('\nSoonest to expire (top 5):');
    soonestExpiring.forEach(r => {
      const monthsRemaining = STALE_THRESHOLD_MONTHS - r.ageMonths;
      console.log(`  [${r.jurisdiction}] verified ${r.lastVerified} (${r.ageMonths} months ago; expires in ~${monthsRemaining} month(s))`);
    });
  }

  const output = {
    runAt: checkedAt,
    totalChecked: results.length,
    freshCount: fresh.length,
    staleCount: stale.length,
    staleThresholdMonths: STALE_THRESHOLD_MONTHS,
    results,
  };

  const outputDir = path.join(process.cwd(), 'scripts/data-review/output');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'procedure-rules-diff.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nOutput written to ${outputPath}`);

  // Exit 1 when stale entries exist so CI flags the run
  process.exit(stale.length > 0 ? 1 : 0);
}

main();
