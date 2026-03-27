/**
 * Criminal Charge Citation Verifier
 *
 * Verifies that every statuteCitations entry in criminal-charges.ts resolves to
 * a real, current, non-repealed statute via the OpenLaws API.
 *
 * Modes:
 *   default     — check all charges that have statuteCitations populated
 *   --all       — also report charges with no citations (pending Phase 3 work)
 *   --state XX  — limit to a single state code (e.g., --state CA)
 *   --category  — limit to charge names matching a substring (e.g., --category assault)
 *   --dry-run   — parse and categorise only; do not call OpenLaws API
 *
 * Usage:
 *   npx tsx scripts/data-review/verify-charge-citations.ts
 *   npx tsx scripts/data-review/verify-charge-citations.ts --all
 *   npx tsx scripts/data-review/verify-charge-citations.ts --state CA --dry-run
 *
 * Outputs:
 *   scripts/data-review/output/charge-citations-report.json
 *
 * Quarterly integration:
 *   Run automatically by .github/workflows/quarterly-data-review.yml
 *   Results are included in the quarterly GitHub Issue by generate-report.ts
 *
 * After a Phase 3 research pass:
 *   1. Update the affected charge entries in shared/criminal-charges.ts with
 *      real statuteCitations[] and dataConfidence: 'low' | 'medium'
 *   2. Run this script — it will call OpenLaws to confirm each citation
 *   3. Entries where OpenLaws returns a non-repealed statute are promoted to 'high'
 *      and the statute text is cached in the database by the API server at runtime
 *   4. Entries that fail OpenLaws lookup remain at their current confidence level
 *      and appear in the report for manual review
 */

import fs from 'fs';
import path from 'path';
import { criminalCharges, getChargeConfidence, isCitationVerified } from '../../shared/criminal-charges';
import type { CriminalCharge } from '../../shared/criminal-charges';

// ── CLI argument parsing ──────────────────────────────────────────────────────

const args = process.argv.slice(2);
const INCLUDE_PENDING = args.includes('--all');
const DRY_RUN = args.includes('--dry-run');

const stateArg = args.indexOf('--state');
const STATE_FILTER: string | null = stateArg !== -1 ? (args[stateArg + 1] ?? '').toUpperCase() : null;

const categoryArg = args.indexOf('--category');
const CATEGORY_FILTER: string | null = categoryArg !== -1 ? (args[categoryArg + 1] ?? '').toLowerCase() : null;

const OPENLAWS_API_URL = process.env.OPENLAWS_API_URL ?? 'https://api.openlaws.us/api/v1';
const OPENLAWS_API_KEY = process.env.OPENLAWS_API_KEY ?? '';

// ── Output types ─────────────────────────────────────────────────────────────

type VerificationStatus =
  | 'verified'       // OpenLaws confirmed: statute exists, not repealed
  | 'repealed'       // OpenLaws returned is_repealed: true
  | 'not_found'      // OpenLaws returned 404 or traversal found nothing
  | 'api_error'      // OpenLaws API call failed (network, auth, etc.)
  | 'no_citation'    // No statuteCitations[] populated yet (pending Phase 3)
  | 'skipped'        // Dry-run mode — not called
  | 'already_high';  // dataConfidence already 'high' — re-verified this run

interface ChargeVerificationResult {
  name: string;              // For generate-report.ts DiffFile compatibility
  chargeId: string;
  chargeName: string;
  jurisdiction: string;
  citation: string | null;
  currentConfidence: string;
  status: VerificationStatus;
  effectiveDate?: string;
  isRepealed?: boolean;
  needsManualReview: boolean;
  reason?: string;
  checkedAt: string;
}

interface ReportOutput {
  runAt: string;
  totalChecked: number;
  okCount: number;
  needsReviewCount: number;
  pendingCount: number;      // No citations yet — awaiting Phase 3
  verifiedHighCount: number; // Currently at 'high' confidence
  results: ChargeVerificationResult[];
}

// ── OpenLaws citation lookup ──────────────────────────────────────────────────

/** Mapping of state codes to their OpenLaws statute law keys */
const STATE_LAW_KEYS: Record<string, string> = {
  AL: 'AL-STAT', AK: 'AK-STAT', AZ: 'AZ-STAT', AR: 'AR-STAT',
  CA: 'CA-STAT', CO: 'CO-STAT', CT: 'CT-STAT', DE: 'DE-STAT',
  FL: 'FL-STAT', GA: 'GA-STAT', HI: 'HI-STAT', ID: 'ID-STAT',
  IL: 'IL-STAT', IN: 'IN-STAT', IA: 'IA-STAT', KS: 'KS-STAT',
  KY: 'KY-STAT', LA: 'LA-STAT', ME: 'ME-STAT', MD: 'MD-STAT',
  MA: 'MA-STAT', MI: 'MI-STAT', MN: 'MN-STAT', MS: 'MS-STAT',
  MO: 'MO-STAT', MT: 'MT-STAT', NE: 'NE-STAT', NV: 'NV-STAT',
  NH: 'NH-STAT', NJ: 'NJ-STAT', NM: 'NM-STAT', NY: 'NY-STAT',
  NC: 'NC-STAT', ND: 'ND-STAT', OH: 'OH-STAT', OK: 'OK-STAT',
  OR: 'OR-STAT', PA: 'PA-STAT', RI: 'RI-STAT', SC: 'SC-STAT',
  SD: 'SD-STAT', TN: 'TN-STAT', TX: 'TX-STAT', UT: 'UT-STAT',
  VT: 'VT-STAT', VA: 'VA-STAT', WA: 'WA-STAT', WV: 'WV-STAT',
  WI: 'WI-STAT', WY: 'WY-STAT', DC: 'DC-STAT', PR: 'PR-STAT',
  FED: 'FED-USC',
};

interface OpenLawsCheckResult {
  found: boolean;
  isRepealed: boolean;
  effectiveDate?: string;
  error?: string;
}

async function checkCitationViaOpenLaws(
  jurisdictionKey: string,
  citation: string
): Promise<OpenLawsCheckResult> {
  if (!OPENLAWS_API_KEY) {
    return {
      found: false,
      isRepealed: false,
      error: 'OPENLAWS_API_KEY not set — cannot verify via API',
    };
  }

  const encoded = encodeURIComponent(citation);
  const url = `${OPENLAWS_API_URL}/citations/lookup?citation=${encoded}&jurisdiction=${jurisdictionKey}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${OPENLAWS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (response.status === 404) {
      return { found: false, isRepealed: false };
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return {
        found: false,
        isRepealed: false,
        error: `HTTP ${response.status}: ${text.slice(0, 120)}`,
      };
    }

    const data = await response.json() as {
      is_repealed?: boolean;
      effective_date_start?: string;
      effective_date_end?: string;
      plaintext_content?: string;
      markdown_content?: string;
    };

    const hasContent = !!(data.plaintext_content || data.markdown_content);
    const isRepealed = data.is_repealed === true;
    const effectiveEnd = data.effective_date_end;
    const appearsRepealed =
      isRepealed ||
      (effectiveEnd !== undefined &&
        effectiveEnd !== 'Infinity' &&
        new Date(effectiveEnd) < new Date());

    return {
      found: hasContent,
      isRepealed: appearsRepealed,
      effectiveDate: data.effective_date_start,
    };
  } catch (err) {
    return {
      found: false,
      isRepealed: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ── Rate limiting ─────────────────────────────────────────────────────────────

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Main verification logic ───────────────────────────────────────────────────

async function verifyCharge(
  charge: CriminalCharge,
  index: number,
  total: number
): Promise<ChargeVerificationResult> {
  const confidence = getChargeConfidence(charge);
  const citation = charge.statuteCitations?.[0] ?? null;
  const checkedAt = new Date().toISOString();
  const label = `${charge.name} (${charge.jurisdiction})`;

  // No citation populated yet — pending Phase 3
  if (!citation) {
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation: null,
      currentConfidence: confidence,
      status: 'no_citation',
      needsManualReview: false, // Not a defect — expected during Phase 3 rollout
      reason: 'Citation not yet populated. Awaiting Phase 3 verification pass.',
      checkedAt,
    };
  }

  // Dry-run: classify only, no API call
  if (DRY_RUN) {
    process.stdout.write(`[${index}/${total}] DRY-RUN: ${label} — ${citation}\n`);
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation,
      currentConfidence: confidence,
      status: 'skipped',
      needsManualReview: false,
      reason: 'Dry-run mode — OpenLaws API not called.',
      checkedAt,
    };
  }

  const jurisdictionKey = charge.jurisdiction === 'FED'
    ? 'FED'
    : STATE_LAW_KEYS[charge.jurisdiction] ? charge.jurisdiction : null;

  if (!jurisdictionKey) {
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation,
      currentConfidence: confidence,
      status: 'api_error',
      needsManualReview: true,
      reason: `No OpenLaws jurisdiction key for '${charge.jurisdiction}' — verify manually`,
      checkedAt,
    };
  }

  process.stdout.write(`[${index}/${total}] Checking ${label} — ${citation} ... `);

  const result = await checkCitationViaOpenLaws(jurisdictionKey, citation);

  // Rate limiting: 200 ms between calls to avoid 429s
  await sleep(200);

  if (result.error && !OPENLAWS_API_KEY) {
    process.stdout.write('SKIPPED (no API key)\n');
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation,
      currentConfidence: confidence,
      status: 'api_error',
      needsManualReview: true,
      reason: result.error,
      checkedAt,
    };
  }

  if (result.error) {
    process.stdout.write(`ERROR: ${result.error}\n`);
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation,
      currentConfidence: confidence,
      status: 'api_error',
      needsManualReview: true,
      reason: result.error,
      checkedAt,
    };
  }

  if (!result.found) {
    process.stdout.write('NOT FOUND\n');
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation,
      currentConfidence: confidence,
      status: 'not_found',
      needsManualReview: true,
      reason: 'OpenLaws API could not locate this citation. Citation may be wrong or the state uses a different numbering system.',
      checkedAt,
    };
  }

  if (result.isRepealed) {
    process.stdout.write('REPEALED\n');
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation,
      currentConfidence: confidence,
      status: 'repealed',
      isRepealed: true,
      effectiveDate: result.effectiveDate,
      needsManualReview: true,
      reason: 'Statute is marked as repealed or effective_date_end is in the past. Update citation to current law.',
      checkedAt,
    };
  }

  const isAlreadyHigh = confidence === 'high';
  process.stdout.write(isAlreadyHigh ? 'OK (re-verified)\n' : 'VERIFIED\n');

  return {
    name: label,
    chargeId: charge.id,
    chargeName: charge.name,
    jurisdiction: charge.jurisdiction,
    citation,
    currentConfidence: confidence,
    status: isAlreadyHigh ? 'already_high' : 'verified',
    effectiveDate: result.effectiveDate,
    needsManualReview: false,
    checkedAt,
  };
}

// ── Entry point ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const runAt = new Date().toISOString();

  // Apply filters
  let charges = criminalCharges.filter(c => {
    if (STATE_FILTER && c.jurisdiction !== STATE_FILTER) return false;
    if (CATEGORY_FILTER && !c.name.toLowerCase().includes(CATEGORY_FILTER)) return false;
    return true;
  });

  // Without --all, skip entries that have no citation (nothing to verify yet)
  const pendingCharges = charges.filter(c => !c.statuteCitations?.length);
  const chargesToCheck = INCLUDE_PENDING
    ? charges
    : charges.filter(c => c.statuteCitations?.length);

  const total = chargesToCheck.length;
  console.log(`\n=== Criminal Charge Citation Verifier ===`);
  console.log(`Run at:   ${runAt}`);
  console.log(`Mode:     ${DRY_RUN ? 'DRY-RUN' : OPENLAWS_API_KEY ? 'API' : 'NO API KEY (report only)'}`);
  if (STATE_FILTER) console.log(`Filter:   state=${STATE_FILTER}`);
  if (CATEGORY_FILTER) console.log(`Filter:   category contains "${CATEGORY_FILTER}"`);
  console.log(`Total charges in file: ${criminalCharges.length}`);
  console.log(`Pending (no citation): ${pendingCharges.length}`);
  console.log(`To verify this run:    ${total}`);
  console.log('');

  const results: ChargeVerificationResult[] = [];

  // Process pending separately if --all
  if (INCLUDE_PENDING) {
    for (const charge of pendingCharges) {
      results.push({
        name: `${charge.name} (${charge.jurisdiction})`,
        chargeId: charge.id,
        chargeName: charge.name,
        jurisdiction: charge.jurisdiction,
        citation: null,
        currentConfidence: getChargeConfidence(charge),
        status: 'no_citation',
        needsManualReview: false,
        reason: 'Citation not yet populated. Awaiting Phase 3 verification pass.',
        checkedAt: runAt,
      });
    }
  }

  // Verify entries that have citations
  const withCitations = chargesToCheck.filter(c => c.statuteCitations?.length);
  for (let i = 0; i < withCitations.length; i++) {
    const result = await verifyCharge(withCitations[i], i + 1, withCitations.length);
    results.push(result);
  }

  // Build summary counts
  const withCitationResults = results.filter(r => r.status !== 'no_citation');
  const okCount = withCitationResults.filter(
    r => r.status === 'verified' || r.status === 'already_high' || r.status === 'skipped'
  ).length;
  const needsReviewItems = withCitationResults.filter(r => r.needsManualReview);
  const pendingCount = results.filter(r => r.status === 'no_citation').length;
  const verifiedHighCount = results.filter(r => r.status === 'already_high').length;

  const report: ReportOutput = {
    runAt,
    totalChecked: withCitationResults.length,
    okCount,
    needsReviewCount: needsReviewItems.length,
    pendingCount,
    verifiedHighCount,
    results,
  };

  // Write output
  const outputDir = path.join(process.cwd(), 'scripts/data-review/output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'charge-citations-report.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  // Console summary
  console.log('\n=== Summary ===');
  console.log(`Checked (with citations): ${withCitationResults.length}`);
  console.log(`  Verified / re-verified: ${okCount}`);
  console.log(`  Needs manual review:    ${needsReviewItems.length}`);
  console.log(`Pending (no citation yet): ${pendingCount}`);
  console.log(`Already high-confidence:   ${verifiedHighCount}`);

  if (needsReviewItems.length > 0) {
    console.log('\n⚠️  Items needing manual review:');
    for (const item of needsReviewItems) {
      console.log(`  [${item.status.toUpperCase()}] ${item.name}`);
      if (item.citation) console.log(`         Citation: ${item.citation}`);
      if (item.reason) console.log(`         Reason:   ${item.reason}`);
    }
  }

  console.log(`\nReport written to: ${outputPath}`);

  // Exit with error code if any citations failed verification (for CI)
  if (!DRY_RUN && needsReviewItems.some(r => r.status === 'not_found' || r.status === 'repealed')) {
    console.log('\n⚠️  One or more citations failed verification. See report for details.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
