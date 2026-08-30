/**
 * Promote Verified Citations
 *
 * Reads a charge-citations report (produced by verify-charge-citations.ts)
 * and updates shared/criminal-charge-citations.ts:
 *
 *   status === 'verified'  → confidence: "high", source: "OpenLaws verified YYYY-MM"
 *   status === 'not_found' → confidence: "needs_review", source: "OpenLaws not_found — needs manual review"
 *   status === 'repealed'  → confidence: "low", source: "REPEALED per OpenLaws YYYY-MM"
 *   status === 'api_error' → no change (retry next run)
 *
 * Also writes needs-manual-review-batch-N.json with all not_found entries as a
 * work queue for human review.
 *
 * Usage:
 *   npx tsx scripts/data-review/promote-verified-citations.ts
 *   npx tsx scripts/data-review/promote-verified-citations.ts --dry-run
 *   npx tsx scripts/data-review/promote-verified-citations.ts --batch 1
 *   npx tsx scripts/data-review/promote-verified-citations.ts --batch 1 --dry-run
 *
 * Run after verify-charge-citations.ts has produced its report.
 * Called automatically by the quarterly-data-review workflow after verification.
 */

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'node:url';

const DRY_RUN = process.argv.includes('--dry-run');

const batchArgIdx = process.argv.indexOf('--batch');
const BATCH: number | null = batchArgIdx !== -1 ? parseInt(process.argv[batchArgIdx + 1] ?? '0', 10) : null;
if (BATCH !== null && (isNaN(BATCH) || BATCH < 1 || BATCH > 10)) {
  console.error('--batch must be a number 1–10');
  process.exit(1);
}

export interface VerificationResult {
  chargeId: string;
  chargeName: string;
  jurisdiction: string;
  citation: string | null;
  currentConfidence: string;
  status: string;
  needsManualReview: boolean;
  reason?: string;
  checkedAt?: string;
}

export interface Report {
  runAt: string;
  totalChecked: number;
  okCount: number;
  needsReviewCount: number;
  results: VerificationResult[];
}

function escapeForSearch(id: string): string {
  return id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Finds the entry block for a charge ID in the overlay source.
 * Returns { start, end, text } of the entry, or null if not found.
 */
function findEntryBlock(source: string, chargeId: string): { start: number; end: number; text: string } | null {
  const start = source.indexOf(`"${chargeId}": {`);
  if (start === -1) return null;
  const end = source.indexOf('},', start);
  if (end === -1) return null;
  return { start, end, text: source.slice(start, end + 2) };
}

/**
 * Promotes a single entry from medium → high, and updates the source field.
 */
export function promoteEntry(source: string, chargeId: string, verifiedMonth: string): {
  source: string;
  promoted: boolean;
} {
  const block = findEntryBlock(source, chargeId);
  if (!block) return { source, promoted: false };

  // Only promote if currently at medium
  if (!block.text.includes('confidence: "medium"')) {
    return { source, promoted: false };
  }

  let updatedEntry = block.text
    .replace('confidence: "medium"', 'confidence: "high"')
    .replace(/lastVerified: "[^"]*"/, `lastVerified: "${verifiedMonth}"`);

  // Update source field to record OpenLaws verification date
  if (updatedEntry.includes('source:')) {
    updatedEntry = updatedEntry.replace(/source: "[^"]*"/, `source: "OpenLaws verified ${verifiedMonth}"`);
  }

  return {
    source: source.slice(0, block.start) + updatedEntry + source.slice(block.end + 2),
    promoted: true,
  };
}

/**
 * Demotes a single entry to a target confidence level and updates the source field.
 * Used for not_found → needs_review and repealed → low.
 */
export function demoteEntry(
  source: string,
  chargeId: string,
  targetConfidence: 'needs_review' | 'low',
  newSource: string,
  verifiedMonth: string
): { source: string; demoted: boolean } {
  const block = findEntryBlock(source, chargeId);
  if (!block) return { source, demoted: false };

  // Only demote if currently at medium (don't clobber an already-reviewed entry)
  if (!block.text.includes('confidence: "medium"')) {
    return { source, demoted: false };
  }

  let updatedEntry = block.text
    .replace('confidence: "medium"', `confidence: "${targetConfidence}"`)
    .replace(/lastVerified: "[^"]*"/, `lastVerified: "${verifiedMonth}"`);

  // Update source field
  if (updatedEntry.includes('source:')) {
    updatedEntry = updatedEntry.replace(/source: "[^"]*"/, `source: "${newSource}"`);
  }

  return {
    source: source.slice(0, block.start) + updatedEntry + source.slice(block.end + 2),
    demoted: true,
  };
}

export function parseVerificationReport(value: unknown): Report {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid citation verification report: expected an object');
  }

  const report = value as Record<string, unknown>;
  if (
    typeof report.runAt !== 'string' ||
    !Number.isInteger(report.totalChecked) ||
    !Number.isInteger(report.okCount) ||
    !Number.isInteger(report.needsReviewCount) ||
    !Array.isArray(report.results)
  ) {
    throw new Error('Invalid citation verification report: missing required report fields');
  }

  const results = report.results.map((value, index): VerificationResult => {
    if (!value || typeof value !== 'object') {
      throw new Error(`Invalid citation verification result at index ${index}`);
    }

    const result = value as Record<string, unknown>;
    if (
      typeof result.chargeId !== 'string' ||
      typeof result.chargeName !== 'string' ||
      typeof result.jurisdiction !== 'string' ||
      (typeof result.citation !== 'string' && result.citation !== null) ||
      typeof result.currentConfidence !== 'string' ||
      typeof result.status !== 'string' ||
      typeof result.needsManualReview !== 'boolean'
    ) {
      throw new Error(`Invalid citation verification result at index ${index}: missing required fields`);
    }

    return {
      chargeId: result.chargeId,
      chargeName: result.chargeName,
      jurisdiction: result.jurisdiction,
      citation: result.citation,
      currentConfidence: result.currentConfidence,
      status: result.status,
      needsManualReview: result.needsManualReview,
      ...(typeof result.reason === 'string' ? { reason: result.reason } : {}),
      ...(typeof result.checkedAt === 'string' ? { checkedAt: result.checkedAt } : {}),
    };
  });

  return {
    runAt: report.runAt,
    totalChecked: report.totalChecked as number,
    okCount: report.okCount as number,
    needsReviewCount: report.needsReviewCount as number,
    results,
  };
}

function main(): void {
  // Determine report path — batch-specific or shared
  const reportFilename = BATCH !== null
    ? `charge-citations-batch-${BATCH}-report.json`
    : 'charge-citations-report.json';
  const outputDir = path.join(process.cwd(), 'scripts/data-review/output');
  const reportPath = path.join(outputDir, reportFilename);
  const overlayPath = path.join(process.cwd(), 'shared/criminal-charge-citations.ts');

  if (!fs.existsSync(reportPath)) {
    console.error(`Report not found at ${reportPath}`);
    if (BATCH !== null) {
      console.error(`Run: npx tsx scripts/data-review/verify-charge-citations.ts --batch ${BATCH}`);
    } else {
      console.error('Run verify-charge-citations.ts first to generate the report.');
    }
    process.exit(1);
  }

  if (!fs.existsSync(overlayPath)) {
    console.error(`Overlay file not found at ${overlayPath}`);
    process.exit(1);
  }

  const report = parseVerificationReport(JSON.parse(fs.readFileSync(reportPath, 'utf-8')));
  const verifiedMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const verified    = report.results.filter(r => r.status === 'verified');
  const notFoundItems = report.results.filter(r => r.status === 'not_found');
  const repealed    = report.results.filter(r => r.status === 'repealed');
  const apiErrors   = report.results.filter(r => r.status === 'api_error');

  console.log(`\n=== Citation Promotion ===`);
  console.log(`Report:      ${reportFilename} (from ${report.runAt})`);
  console.log(`Mode:        ${DRY_RUN ? 'DRY-RUN (no writes)' : 'LIVE'}`);
  if (BATCH !== null) console.log(`Batch:       ${BATCH} of 10`);
  console.log(`Verified:    ${verified.length} → promote to high`);
  console.log(`Not found:   ${notFoundItems.length} → demote to needs_review`);
  console.log(`Repealed:    ${repealed.length} → demote to low`);
  console.log(`API errors:  ${apiErrors.length} → no change (retry next run)`);
  console.log('');

  const totalActionable = verified.length + notFoundItems.length + repealed.length;
  if (totalActionable === 0) {
    console.log('Nothing to update. Exiting.');
    return;
  }

  let source = fs.readFileSync(overlayPath, 'utf-8');
  let promotedCount = 0;
  let demotedNeedsReviewCount = 0;
  let demotedLowCount = 0;
  const notFoundInOverlay: string[] = [];

  // ── Promote verified entries ──────────────────────────────────────────────
  console.log('--- Promotions (medium → high) ---');
  for (const result of verified) {
    const { chargeId, chargeName, jurisdiction } = result;
    const label = `${chargeName} (${jurisdiction})`;

    if (DRY_RUN) {
      const block = findEntryBlock(source, chargeId);
      if (!block) {
        console.log(`  DRY-RUN SKIP (not in overlay): ${label}`);
        notFoundInOverlay.push(chargeId);
      } else {
        console.log(`  DRY-RUN WOULD PROMOTE: ${label}`);
        promotedCount++;
      }
      continue;
    }

    const { source: updatedSource, promoted } = promoteEntry(source, chargeId, verifiedMonth);
    if (promoted) {
      source = updatedSource;
      promotedCount++;
      console.log(`  PROMOTED: ${label}`);
    } else {
      const block = findEntryBlock(source, chargeId);
      if (!block) {
        console.log(`  SKIP (not in overlay): ${label}`);
        notFoundInOverlay.push(chargeId);
      } else {
        console.log(`  SKIP (already high or no medium field): ${label}`);
      }
    }
  }

  // ── Demote not_found → needs_review ──────────────────────────────────────
  console.log('\n--- Not found (medium → needs_review) ---');
  for (const result of notFoundItems) {
    const { chargeId, chargeName, jurisdiction } = result;
    const label = `${chargeName} (${jurisdiction})`;

    if (DRY_RUN) {
      const block = findEntryBlock(source, chargeId);
      if (!block) {
        console.log(`  DRY-RUN SKIP (not in overlay): ${label}`);
      } else {
        console.log(`  DRY-RUN WOULD DEMOTE to needs_review: ${label}`);
        demotedNeedsReviewCount++;
      }
      continue;
    }

    const { source: updatedSource, demoted } = demoteEntry(
      source, chargeId, 'needs_review',
      'OpenLaws not_found — needs manual review',
      verifiedMonth
    );
    if (demoted) {
      source = updatedSource;
      demotedNeedsReviewCount++;
      console.log(`  DEMOTED to needs_review: ${label}`);
    } else {
      console.log(`  SKIP (not in overlay or not at medium): ${label}`);
    }
  }

  // ── Demote repealed → low ─────────────────────────────────────────────────
  console.log('\n--- Repealed (medium → low) ---');
  for (const result of repealed) {
    const { chargeId, chargeName, jurisdiction } = result;
    const label = `${chargeName} (${jurisdiction})`;

    if (DRY_RUN) {
      const block = findEntryBlock(source, chargeId);
      if (!block) {
        console.log(`  DRY-RUN SKIP (not in overlay): ${label}`);
      } else {
        console.log(`  DRY-RUN WOULD DEMOTE to low: ${label}`);
        demotedLowCount++;
      }
      continue;
    }

    const { source: updatedSource, demoted } = demoteEntry(
      source, chargeId, 'low',
      `REPEALED per OpenLaws ${verifiedMonth}`,
      verifiedMonth
    );
    if (demoted) {
      source = updatedSource;
      demotedLowCount++;
      console.log(`  DEMOTED to low (repealed): ${label}`);
    } else {
      console.log(`  SKIP (not in overlay or not at medium): ${label}`);
    }
  }

  // ── Write overlay file ────────────────────────────────────────────────────
  if (!DRY_RUN) {
    const totalWrites = promotedCount + demotedNeedsReviewCount + demotedLowCount;
    if (totalWrites > 0) {
      fs.writeFileSync(overlayPath, source, 'utf-8');
      console.log(`\n✅ Wrote ${totalWrites} update(s) to ${overlayPath}`);
      console.log(`   Promoted to high:         ${promotedCount}`);
      console.log(`   Demoted to needs_review:  ${demotedNeedsReviewCount}`);
      console.log(`   Demoted to low (repealed): ${demotedLowCount}`);
    } else {
      console.log('\nNo entries updated (all already at target confidence or not found in overlay).');
    }
  } else {
    console.log(`\nDRY-RUN summary:`);
    console.log(`  Would promote to high:         ${promotedCount}`);
    console.log(`  Would demote to needs_review:  ${demotedNeedsReviewCount}`);
    console.log(`  Would demote to low (repealed): ${demotedLowCount}`);
  }

  // ── Write needs-manual-review work queue ──────────────────────────────────
  if (notFoundItems.length > 0) {
    const reviewQueueFilename = BATCH !== null
      ? `needs-manual-review-batch-${BATCH}.json`
      : 'needs-manual-review.json';
    const reviewQueuePath = path.join(outputDir, reviewQueueFilename);
    const reviewQueue = notFoundItems.map(r => ({
      chargeId: r.chargeId,
      chargeName: r.chargeName,
      jurisdiction: r.jurisdiction,
      citation: r.citation,
      reason: r.reason,
      checkedAt: r.checkedAt ?? report.runAt,
    }));
    if (!DRY_RUN) {
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(reviewQueuePath, JSON.stringify(reviewQueue, null, 2));
      console.log(`\n📋 Manual review work queue: ${reviewQueuePath}`);
    }
    console.log(`\n⚠️  ${notFoundItems.length} citation(s) need human review (OpenLaws not_found):`);
    console.log('   For each: verify citation on state legislature website, then either');
    console.log('   correct the citation and re-run, or manually set confidence to "high"');
    console.log('   with source: "Manual review verified YYYY-MM".');
    for (const item of notFoundItems.slice(0, 5)) {
      console.log(`   [${item.jurisdiction}] ${item.chargeName}: ${item.citation}`);
    }
    if (notFoundItems.length > 5) console.log(`   ... and ${notFoundItems.length - 5} more (see ${reviewQueueFilename}).`);
  }

  if (apiErrors.length > 0) {
    console.log(`\nℹ️  ${apiErrors.length} API error(s) — left unchanged, retry next run.`);
  }

  if (notFoundInOverlay.length > 0) {
    console.log('\nℹ️  Verified by OpenLaws but not found in overlay (may be inline in criminal-charges.ts):');
    for (const id of notFoundInOverlay) console.log(`  ${id}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
