/**
 * Promote Verified Citations
 *
 * Reads charge-citations-report.json (produced by verify-charge-citations.ts)
 * and updates shared/criminal-charge-citations.ts:
 *   - confidence: "medium" → confidence: "high"
 *   - lastVerified: updated to current YYYY-MM
 *
 * Only entries with status === 'verified' are promoted.
 * Entries with status 'not_found', 'repealed', or 'api_error' are left unchanged
 * and must be corrected manually before the next verification run.
 *
 * Usage:
 *   npx tsx scripts/data-review/promote-verified-citations.ts
 *   npx tsx scripts/data-review/promote-verified-citations.ts --dry-run
 *
 * Run after verify-charge-citations.ts has produced its report.
 * Called automatically by the quarterly-data-review workflow after verification.
 */

import fs from 'fs';
import path from 'path';

const DRY_RUN = process.argv.includes('--dry-run');

interface VerificationResult {
  chargeId: string;
  chargeName: string;
  jurisdiction: string;
  citation: string | null;
  currentConfidence: string;
  status: string;
  needsManualReview: boolean;
  reason?: string;
}

interface Report {
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
 * Promotes a single entry in the overlay source from medium → high.
 * Uses positional string replacement within the entry block to avoid
 * touching entries with the same substring in their ID.
 */
function promoteEntry(source: string, chargeId: string, verifiedMonth: string): {
  source: string;
  promoted: boolean;
} {
  const entryStart = source.indexOf(`"${chargeId}": {`);
  if (entryStart === -1) {
    return { source, promoted: false };
  }

  // Find the closing },  for this entry (first occurrence after entry start)
  const entryEnd = source.indexOf('},', entryStart);
  if (entryEnd === -1) {
    return { source, promoted: false };
  }

  const entryText = source.slice(entryStart, entryEnd + 2);

  // Only promote if currently at medium — skip if already high or missing the field
  if (!entryText.includes('confidence: "medium"')) {
    return { source, promoted: false };
  }

  const updatedEntry = entryText
    .replace('confidence: "medium"', 'confidence: "high"')
    .replace(/lastVerified: "[^"]*"/, `lastVerified: "${verifiedMonth}"`);

  const updatedSource =
    source.slice(0, entryStart) + updatedEntry + source.slice(entryEnd + 2);

  return { source: updatedSource, promoted: true };
}

function main(): void {
  const reportPath = path.join(
    process.cwd(),
    'scripts/data-review/output/charge-citations-report.json'
  );
  const overlayPath = path.join(process.cwd(), 'shared/criminal-charge-citations.ts');

  if (!fs.existsSync(reportPath)) {
    console.error(`Report not found at ${reportPath}`);
    console.error('Run verify-charge-citations.ts first to generate the report.');
    process.exit(1);
  }

  if (!fs.existsSync(overlayPath)) {
    console.error(`Overlay file not found at ${overlayPath}`);
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8')) as Report;
  const verifiedMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const verified = report.results.filter(r => r.status === 'verified');
  const needsReview = report.results.filter(r => r.needsManualReview);

  console.log(`\n=== Citation Promotion ===`);
  console.log(`Report from: ${report.runAt}`);
  console.log(`Mode:        ${DRY_RUN ? 'DRY-RUN (no writes)' : 'LIVE'}`);
  console.log(`Verified:    ${verified.length} entry/entries to promote`);
  console.log(`Needs review: ${needsReview.length} entry/entries (skipped — manual action required)`);
  console.log('');

  if (verified.length === 0) {
    console.log('Nothing to promote. Exiting.');
    return;
  }

  let source = fs.readFileSync(overlayPath, 'utf-8');
  let promotedCount = 0;
  const notFound: string[] = [];

  for (const result of verified) {
    const { chargeId, chargeName, jurisdiction } = result;
    const label = `${chargeName} (${jurisdiction})`;

    if (DRY_RUN) {
      const entryStart = source.indexOf(`"${chargeId}": {`);
      if (entryStart === -1) {
        console.log(`  DRY-RUN SKIP (not in overlay): ${label} [${chargeId}]`);
        notFound.push(chargeId);
      } else {
        console.log(`  DRY-RUN WOULD PROMOTE: ${label} [${chargeId}]`);
        promotedCount++;
      }
      continue;
    }

    const { source: updatedSource, promoted } = promoteEntry(source, chargeId, verifiedMonth);

    if (promoted) {
      source = updatedSource;
      promotedCount++;
      console.log(`  PROMOTED: ${label} [${chargeId}]`);
    } else {
      const entryStart = source.indexOf(`"${chargeId}": {`);
      if (entryStart === -1) {
        console.log(`  SKIP (not in overlay): ${label} [${chargeId}]`);
        notFound.push(chargeId);
      } else {
        console.log(`  SKIP (already high or no medium field): ${label} [${chargeId}]`);
      }
    }
  }

  if (!DRY_RUN && promotedCount > 0) {
    fs.writeFileSync(overlayPath, source, 'utf-8');
    console.log(`\n✅ Wrote ${promotedCount} promotion(s) to ${overlayPath}`);
  } else if (DRY_RUN) {
    console.log(`\nDRY-RUN: would promote ${promotedCount} entry/entries`);
  } else {
    console.log('\nNo entries promoted (all already high or not found in overlay).');
  }

  if (needsReview.length > 0) {
    console.log('\n⚠️  Entries that need manual review (NOT promoted):');
    for (const item of needsReview) {
      console.log(`  [${item.status.toUpperCase()}] ${item.chargeName} (${item.jurisdiction})`);
      if (item.citation) console.log(`         Citation: ${item.citation}`);
      if (item.reason)   console.log(`         Reason:   ${item.reason}`);
    }
    console.log('\nFor each flagged entry: find the correct current statute, update');
    console.log('criminal-charge-citations.ts manually, then re-run the verifier.');
  }

  if (notFound.length > 0) {
    console.log('\nℹ️  Verified by OpenLaws but not found in overlay (may be in base criminal-charges.ts):');
    for (const id of notFound) console.log(`  ${id}`);
  }
}

main();
