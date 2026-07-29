/**
 * Procedure Rules Freshness Checker
 *
 * Scans every entry in JURISDICTION_PROCEDURE_RULES and reports:
 *   • Entries already stale  (lastVerified > 12 months ago)
 *   • Entries expiring soon  (will become stale within the next 60 days)
 *
 * Run this quarterly so the team can re-verify entries *before* they expire
 * rather than discovering staleness after the vitest freshness guard fails.
 *
 * Usage:
 *   npx tsx scripts/check-procedure-rules-freshness.ts
 *   npx tsx scripts/check-procedure-rules-freshness.ts --report   # also writes JSON to scripts/output/
 *
 * Exit codes:
 *   0 — all entries are current (nothing stale; warnings printed for expiring-soon)
 *   1 — one or more entries are already stale (> 12 months since lastVerified)
 */

import { JURISDICTION_PROCEDURE_RULES } from '../shared/jurisdiction-procedure-rules';
import type { JurisdictionProcedureRule } from '../shared/jurisdiction-procedure-rules';
import * as fs from 'fs';
import * as path from 'path';

// ─── Configuration ────────────────────────────────────────────────────────────

const STALE_MONTHS   = 12;  // an entry is stale once lastVerified is this many months old
const WARN_DAYS      = 60;  // warn when an entry will become stale within this many days
const REPORT_FLAG    = process.argv.includes('--report');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the number of whole calendar months between a YYYY-MM date and now.
 * Positive = in the past.
 */
function monthsAgo(verifiedYM: string, now: Date): number {
  const [vy, vm] = verifiedYM.split('-').map(Number);
  return (now.getFullYear() - vy) * 12 + (now.getMonth() + 1 - vm);
}

/**
 * Returns the Date on which a YYYY-MM lastVerified entry will become stale
 * (i.e. the first day of the month exactly STALE_MONTHS later).
 */
function staleDate(verifiedYM: string): Date {
  const [vy, vm] = verifiedYM.split('-').map(Number);
  const staleMonth = vm - 1 + STALE_MONTHS; // 0-based month arithmetic
  const staleYear  = vy + Math.floor(staleMonth / 12);
  const staleM     = staleMonth % 12;
  return new Date(staleYear, staleM, 1);
}

/** Days between two Dates (positive when `future` is after `reference`). */
function daysUntil(future: Date, reference: Date): number {
  return Math.round((future.getTime() - reference.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Report types ─────────────────────────────────────────────────────────────

interface EntryReport {
  key: string;
  lastVerified: string;
  dataConfidence: JurisdictionProcedureRule['dataConfidence'];
  ageMonths: number;
  daysUntilStale: number;   // negative when already stale
  status: 'stale' | 'expiring-soon' | 'ok';
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  const now = new Date();
  const nowLabel = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   OpenDefender — Procedure Rules Freshness Check           ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\nReport date : ${nowLabel}`);
  console.log(`Stale after : ${STALE_MONTHS} months`);
  console.log(`Warn window : ${WARN_DAYS} days before stale\n`);

  const entries = Object.entries(JURISDICTION_PROCEDURE_RULES);
  const reports: EntryReport[] = entries.map(([key, rule]) => {
    const age   = monthsAgo(rule.lastVerified, now);
    const sd    = staleDate(rule.lastVerified);
    const days  = daysUntil(sd, now);
    let status: EntryReport['status'];
    if (age > STALE_MONTHS) {
      status = 'stale';
    } else if (days <= WARN_DAYS) {
      status = 'expiring-soon';
    } else {
      status = 'ok';
    }
    return {
      key,
      lastVerified: rule.lastVerified,
      dataConfidence: rule.dataConfidence,
      ageMonths: age,
      daysUntilStale: days,
      status,
    };
  });

  const stale        = reports.filter(r => r.status === 'stale');
  const expiringSoon = reports.filter(r => r.status === 'expiring-soon');
  const ok           = reports.filter(r => r.status === 'ok');

  // ── Already stale ──────────────────────────────────────────────────────────
  if (stale.length > 0) {
    console.log(`❌  STALE (${stale.length} entries — lastVerified > ${STALE_MONTHS} months ago)\n`);
    for (const r of stale.sort((a, b) => a.daysUntilStale - b.daysUntilStale)) {
      const overdue = Math.abs(r.daysUntilStale);
      console.log(`   [${r.key.padEnd(8)}] lastVerified: ${r.lastVerified}  age: ${r.ageMonths} months  (${overdue} days overdue)`);
    }
    console.log('');
  } else {
    console.log(`✅  No stale entries.\n`);
  }

  // ── Expiring soon ──────────────────────────────────────────────────────────
  if (expiringSoon.length > 0) {
    console.log(`⚠️   EXPIRING SOON (${expiringSoon.length} entries — will become stale within ${WARN_DAYS} days)\n`);
    for (const r of expiringSoon.sort((a, b) => a.daysUntilStale - b.daysUntilStale)) {
      console.log(`   [${r.key.padEnd(8)}] lastVerified: ${r.lastVerified}  age: ${r.ageMonths} months  (stale in ${r.daysUntilStale} day${r.daysUntilStale === 1 ? '' : 's'})`);
    }
    console.log('');
  } else {
    console.log(`✅  No entries expiring within ${WARN_DAYS} days.\n`);
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('─────────────────────────────────────────────────────────────');
  console.log(`Total entries  : ${reports.length}`);
  console.log(`Current (ok)   : ${ok.length}`);
  console.log(`Expiring soon  : ${expiringSoon.length}`);
  console.log(`Stale          : ${stale.length}`);
  console.log('─────────────────────────────────────────────────────────────\n');

  if (stale.length > 0) {
    console.log('ACTION REQUIRED: Re-verify the stale entries above and update');
    console.log('  their `lastVerified` field in shared/jurisdiction-procedure-rules.ts.');
    console.log('  The vitest freshness guard (tests/jurisdiction-procedure-rules.test.ts)');
    console.log(`  will fail in CI until all entries are within ${STALE_MONTHS} months.\n`);
  }

  if (expiringSoon.length > 0 && stale.length === 0) {
    console.log('HEADS UP: Re-verify the entries marked "expiring soon" before the next');
    console.log('  quarter to avoid a CI failure when they cross the 12-month threshold.\n');
  }

  // ── Optional JSON report ───────────────────────────────────────────────────
  if (REPORT_FLAG) {
    const outDir  = path.join('scripts', 'output');
    const outFile = path.join(outDir, 'procedure-rules-freshness-report.json');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(
      outFile,
      JSON.stringify(
        {
          generated: now.toISOString(),
          summary: {
            total: reports.length,
            stale: stale.length,
            expiringSoon: expiringSoon.length,
            ok: ok.length,
          },
          stale,
          expiringSoon,
        },
        null,
        2,
      ),
    );
    console.log(`Report written → ${outFile}\n`);
  }

  process.exit(stale.length > 0 ? 1 : 0);
}

main();
