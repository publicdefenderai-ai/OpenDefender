/**
 * T004: Verify New Charge Codes for Remaining Jurisdictions
 *
 * Verifies statute codes in verified-statute-codes.ts for the 36 jurisdictions
 * NOT covered by verify-new-charge-codes.ts (top-20 states).
 *
 * Remaining jurisdictions: 30 smaller states + DC + 5 territories
 *
 * Usage: npx tsx scripts/verify-remaining-jurisdictions.ts
 *
 * Output: JSON report of verified, failed, and flagged codes
 */

import { openLawsClient } from '../server/services/openlaws-client';
import { verifiedStatuteCodes } from './verified-statute-codes';
import * as fs from 'fs';

const TOP_20_STATES = new Set([
  'CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI',
  'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI',
]);

const REMAINING_STATES = [
  'AL', 'AK', 'AR', 'CO', 'CT', 'DE', 'HI', 'ID', 'IA', 'KS',
  'KY', 'LA', 'ME', 'MN', 'MS', 'MT', 'NE', 'NV', 'NH', 'NM',
  'ND', 'OK', 'OR', 'RI', 'SC', 'SD', 'UT', 'VT', 'WV', 'WY',
  'DC',
];

const TERRITORIES = ['PR', 'VI', 'GU', 'AS', 'MP'];

const STATE_CITATION_PATTERNS: Record<string, (code: string) => string> = {
  AL: (code) => `Ala. Code § ${code}`,
  AK: (code) => `Alaska Stat. § ${code}`,
  AR: (code) => `Ark. Code Ann. § ${code}`,
  CO: (code) => `Colo. Rev. Stat. § ${code}`,
  CT: (code) => `Conn. Gen. Stat. § ${code}`,
  DE: (code) => `Del. Code Ann. tit. 11, § ${code}`,
  HI: (code) => `Haw. Rev. Stat. § ${code}`,
  ID: (code) => `Idaho Code § ${code}`,
  IA: (code) => `Iowa Code § ${code}`,
  KS: (code) => `Kan. Stat. Ann. § ${code}`,
  KY: (code) => `Ky. Rev. Stat. Ann. § ${code}`,
  LA: (code) => `La. Rev. Stat. Ann. § ${code}`,
  ME: (code) => `Me. Rev. Stat. Ann. tit. 17-A, § ${code}`,
  MN: (code) => `Minn. Stat. § ${code}`,
  MS: (code) => `Miss. Code Ann. § ${code}`,
  MT: (code) => `Mont. Code Ann. § ${code}`,
  NE: (code) => `Neb. Rev. Stat. § ${code}`,
  NV: (code) => `Nev. Rev. Stat. § ${code}`,
  NH: (code) => `N.H. Rev. Stat. Ann. § ${code}`,
  NM: (code) => `N.M. Stat. Ann. § ${code}`,
  ND: (code) => `N.D. Cent. Code § ${code}`,
  OK: (code) => `Okla. Stat. tit. 21, § ${code}`,
  OR: (code) => `Or. Rev. Stat. § ${code}`,
  RI: (code) => `R.I. Gen. Laws § ${code}`,
  SC: (code) => `S.C. Code Ann. § ${code}`,
  SD: (code) => `S.D. Codified Laws § ${code}`,
  UT: (code) => `Utah Code Ann. § ${code}`,
  VT: (code) => `Vt. Stat. Ann. tit. 13, § ${code}`,
  WV: (code) => `W. Va. Code § ${code}`,
  WY: (code) => `Wyo. Stat. Ann. § ${code}`,
  DC: (code) => `D.C. Code § ${code}`,
};

interface VerificationResult {
  chargeType: string;
  jurisdiction: string;
  code: string;
  citation: string;
  status: 'verified' | 'not_found' | 'error' | 'skipped' | 'territory';
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
    return {
      chargeType, jurisdiction, code, citation: '',
      status: 'territory',
      note: 'Territory — OpenLaws API indexing not available; codes are best-effort estimates',
    };
  }

  const citation = citationFn(code);

  try {
    const result = await openLawsClient.searchByCitation(citation);
    if (result) {
      return {
        chargeType, jurisdiction, code, citation,
        status: 'verified',
        resolvedTitle: result.title,
        resolvedSection: result.section,
      };
    } else {
      return {
        chargeType, jurisdiction, code, citation,
        status: 'not_found',
        note: 'OpenLaws API returned no result — code may still be correct (API coverage varies by jurisdiction)',
      };
    }
  } catch (error: any) {
    return {
      chargeType, jurisdiction, code, citation,
      status: 'error',
      note: error?.message || 'Unknown error',
    };
  }
}

async function main() {
  console.log('🔍 Verifying New Charge Codes: Remaining 36 Jurisdictions\n');
  console.log('='.repeat(60));

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
  const allJurisdictions = [...REMAINING_STATES, ...TERRITORIES];

  console.log(`📋 Charge types: ${chargeTypes.length}`);
  console.log(`🗺️  Jurisdictions: ${REMAINING_STATES.length} remaining states + ${TERRITORIES.length} territories = ${allJurisdictions.length} total`);
  console.log(`📊 Total verifications: ${chargeTypes.length * REMAINING_STATES.length} (territories flagged separately)\n`);

  const results: VerificationResult[] = [];
  const stats = { verified: 0, not_found: 0, error: 0, skipped: 0, territory: 0 };

  for (const chargeType of chargeTypes) {
    const chargeCodes = verifiedStatuteCodes[chargeType];
    if (!chargeCodes) continue;

    process.stdout.write(`\n📌 ${chargeType.padEnd(35)}`);

    for (const jurisdiction of allJurisdictions) {
      const codeEntry = chargeCodes[jurisdiction];
      if (!codeEntry) {
        results.push({ chargeType, jurisdiction, code: '', citation: '', status: 'skipped', note: 'No code entry' });
        stats.skipped++;
        process.stdout.write('-');
        continue;
      }

      const result = await verifyCode(chargeType, jurisdiction, codeEntry.code);
      results.push(result);
      stats[result.status]++;

      if (result.status === 'territory') {
        process.stdout.write('T');
      } else {
        process.stdout.write(result.status === 'verified' ? '✓' : result.status === 'not_found' ? '✗' : result.status === 'error' ? 'E' : '-');
      }

      if (result.status !== 'territory') {
        await delay(250);
      }
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('📊 Verification Results Summary\n');
  console.log(`✅ Verified:      ${stats.verified}`);
  console.log(`❌ Not found:     ${stats.not_found}`);
  console.log(`⚠️  Errors:        ${stats.error}`);
  console.log(`🏝️  Territories:   ${stats.territory}`);
  console.log(`⏭️  Skipped:       ${stats.skipped}`);

  const notFound = results.filter(r => r.status === 'not_found');
  const errors = results.filter(r => r.status === 'error');
  const territories = results.filter(r => r.status === 'territory');

  if (notFound.length > 0) {
    console.log('\n❌ CODES NOT FOUND IN OPENLAWS (may still be correct — API coverage varies):\n');
    console.log('-'.repeat(60));
    for (const r of notFound) {
      console.log(`  ${r.chargeType} [${r.jurisdiction}]: ${r.code}`);
      console.log(`    Citation: "${r.citation}"`);
    }
  }

  if (territories.length > 0) {
    console.log('\n🏝️  TERRITORY CODES (best-effort — not OpenLaws-verifiable):\n');
    for (const r of territories) {
      const code = verifiedStatuteCodes[r.chargeType]?.[r.jurisdiction]?.code;
      console.log(`  ${r.chargeType} [${r.jurisdiction}]: ${code}`);
    }
  }

  if (errors.length > 0) {
    console.log('\n⚠️  ERRORS DURING VERIFICATION:\n');
    for (const r of errors) {
      console.log(`  ${r.chargeType} [${r.jurisdiction}]: ${r.code} — ${r.note}`);
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    scope: 'remaining_36_jurisdictions',
    jurisdictionsChecked: REMAINING_STATES,
    territoriesFlagged: TERRITORIES,
    stats,
    notFound: notFound.map(r => ({ chargeType: r.chargeType, jurisdiction: r.jurisdiction, code: r.code, citation: r.citation, note: r.note })),
    territories: territories.map(r => ({ chargeType: r.chargeType, jurisdiction: r.jurisdiction, code: verifiedStatuteCodes[r.chargeType]?.[r.jurisdiction]?.code })),
    errors: errors.map(r => ({ chargeType: r.chargeType, jurisdiction: r.jurisdiction, code: r.code, note: r.note })),
    verified: results.filter(r => r.status === 'verified').map(r => ({
      chargeType: r.chargeType,
      jurisdiction: r.jurisdiction,
      code: r.code,
      resolvedTitle: r.resolvedTitle,
      resolvedSection: r.resolvedSection,
    })),
  };

  fs.writeFileSync('scripts/verification-report-remaining.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Full report saved to scripts/verification-report-remaining.json\n');

  const exitCode = errors.length > 0 ? 1 : 0;
  process.exit(exitCode);
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
