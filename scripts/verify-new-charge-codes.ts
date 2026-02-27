/**
 * T001: Verify New Charge Codes Against OpenLaws API
 * 
 * Verifies that the statute codes in verified-statute-codes.ts resolve to
 * real statutes via the OpenLaws API for the top 20 most populous states.
 * 
 * Usage: npx tsx scripts/verify-new-charge-codes.ts
 * 
 * Output: JSON report of verified, failed, and corrected codes
 */

import { openLawsClient } from '../server/services/openlaws-client';
import { verifiedStatuteCodes } from './verified-statute-codes';

const TOP_20_STATES = [
  'CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI',
  'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI'
];

const STATE_CITATION_PATTERNS: Record<string, (code: string) => string> = {
  CA: (code) => `Cal. Penal Code § ${code}`,
  TX: (code) => `Tex. Penal Code § ${code}`,
  FL: (code) => `Fla. Stat. § ${code}`,
  NY: (code) => `N.Y. Penal Law § ${code}`,
  PA: (code) => `18 Pa.C.S. § ${code}`,
  IL: (code) => `720 ILCS ${code}`,
  OH: (code) => `Ohio Rev. Code Ann. § ${code}`,
  GA: (code) => `Ga. Code Ann. § ${code}`,
  NC: (code) => `N.C. Gen. Stat. § ${code}`,
  MI: (code) => `Mich. Comp. Laws § ${code}`,
  NJ: (code) => `N.J. Stat. Ann. § ${code}`,
  VA: (code) => `Va. Code Ann. § ${code}`,
  WA: (code) => `Wash. Rev. Code § ${code}`,
  AZ: (code) => `Ariz. Rev. Stat. § ${code}`,
  MA: (code) => `Mass. Gen. Laws ch. ${code}`,
  TN: (code) => `Tenn. Code Ann. § ${code}`,
  IN: (code) => `Ind. Code § ${code}`,
  MO: (code) => `Mo. Rev. Stat. § ${code}`,
  MD: (code) => `Md. Code Ann., Crim. Law § ${code}`,
  WI: (code) => `Wis. Stat. § ${code}`,
};

interface VerificationResult {
  chargeType: string;
  jurisdiction: string;
  code: string;
  citation: string;
  status: 'verified' | 'not_found' | 'error' | 'skipped';
  resolvedTitle?: string;
  resolvedSection?: string;
  note?: string;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyCode(
  chargeType: string,
  jurisdiction: string,
  code: string
): Promise<VerificationResult> {
  const citationFn = STATE_CITATION_PATTERNS[jurisdiction];
  if (!citationFn) {
    return { chargeType, jurisdiction, code, citation: '', status: 'skipped', note: 'No citation pattern' };
  }

  const citation = citationFn(code);

  try {
    const result = await openLawsClient.searchByCitation(citation);
    if (result) {
      return {
        chargeType,
        jurisdiction,
        code,
        citation,
        status: 'verified',
        resolvedTitle: result.title,
        resolvedSection: result.section,
      };
    } else {
      return {
        chargeType,
        jurisdiction,
        code,
        citation,
        status: 'not_found',
        note: 'OpenLaws API returned no result',
      };
    }
  } catch (error: any) {
    return {
      chargeType,
      jurisdiction,
      code,
      citation,
      status: 'error',
      note: error?.message || 'Unknown error',
    };
  }
}

async function main() {
  console.log('🔍 Verifying New Charge Codes Against OpenLaws API\n');
  console.log('='.repeat(60));

  // Check OpenLaws availability
  try {
    const availability = await openLawsClient.checkAvailability();
    if (!availability.available) {
      console.error('❌ OpenLaws API not available:', availability.message);
      process.exit(1);
    }
    console.log(`✅ OpenLaws API connected (${availability.jurisdictionCount} jurisdictions)\n`);
  } catch (error) {
    console.error('❌ OpenLaws API connection failed:', error);
    process.exit(1);
  }

  const chargeTypes = Object.keys(verifiedStatuteCodes);
  console.log(`📋 Charge types to verify: ${chargeTypes.length}`);
  console.log(`🗺️  Jurisdictions per charge: ${TOP_20_STATES.length} (top 20 states)`);
  console.log(`📊 Total verifications: ${chargeTypes.length * TOP_20_STATES.length}\n`);

  const results: VerificationResult[] = [];
  const stats = { verified: 0, not_found: 0, error: 0, skipped: 0 };
  let processed = 0;
  const total = chargeTypes.length * TOP_20_STATES.length;

  for (const chargeType of chargeTypes) {
    const chargeCodes = verifiedStatuteCodes[chargeType];
    if (!chargeCodes) continue;

    process.stdout.write(`\n📌 ${chargeType.padEnd(35)}`);

    for (const jurisdiction of TOP_20_STATES) {
      const codeEntry = chargeCodes[jurisdiction];
      if (!codeEntry) {
        results.push({ chargeType, jurisdiction, code: '', citation: '', status: 'skipped', note: 'No code entry' });
        stats.skipped++;
        processed++;
        continue;
      }

      const result = await verifyCode(chargeType, jurisdiction, codeEntry.code);
      results.push(result);
      stats[result.status]++;
      processed++;

      process.stdout.write(result.status === 'verified' ? '✓' : result.status === 'not_found' ? '✗' : result.status === 'error' ? 'E' : '-');

      // Rate limit: max 4 req/s to stay safely under OpenLaws limit
      await delay(250);
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('📊 Verification Results Summary\n');
  console.log(`Total checked:   ${total}`);
  console.log(`✅ Verified:     ${stats.verified}`);
  console.log(`❌ Not found:    ${stats.not_found}`);
  console.log(`⚠️  Errors:       ${stats.error}`);
  console.log(`⏭️  Skipped:      ${stats.skipped}`);
  console.log('='.repeat(60));

  const notFound = results.filter(r => r.status === 'not_found');
  const errors = results.filter(r => r.status === 'error');

  if (notFound.length > 0) {
    console.log('\n❌ CODES NOT FOUND IN OPENLAWS:\n');
    console.log('-'.repeat(60));
    for (const r of notFound) {
      console.log(`  ${r.chargeType} [${r.jurisdiction}]: ${r.code} → "${r.citation}"`);
      if (r.note) console.log(`    Note: ${r.note}`);
    }
  }

  if (errors.length > 0) {
    console.log('\n⚠️  ERRORS DURING VERIFICATION:\n');
    for (const r of errors) {
      console.log(`  ${r.chargeType} [${r.jurisdiction}]: ${r.code} — ${r.note}`);
    }
  }

  if (notFound.length === 0 && errors.length === 0) {
    console.log('\n✅ All verified codes resolve to real statutes in OpenLaws!\n');
  } else {
    console.log(`\n⚠️  ${notFound.length} codes need attention.`);
    console.log('Review the list above and update verified-statute-codes.ts accordingly.\n');
  }

  // Write results to file
  const report = {
    timestamp: new Date().toISOString(),
    stats,
    notFound: notFound.map(r => ({ chargeType: r.chargeType, jurisdiction: r.jurisdiction, code: r.code, citation: r.citation })),
    errors: errors.map(r => ({ chargeType: r.chargeType, jurisdiction: r.jurisdiction, code: r.code, note: r.note })),
    verified: results.filter(r => r.status === 'verified').map(r => ({
      chargeType: r.chargeType,
      jurisdiction: r.jurisdiction,
      code: r.code,
      resolvedTitle: r.resolvedTitle,
      resolvedSection: r.resolvedSection,
    })),
  };

  const fs = await import('fs');
  fs.writeFileSync('scripts/verification-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Full report saved to scripts/verification-report.json\n');

  process.exit(notFound.length > 0 || errors.length > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
