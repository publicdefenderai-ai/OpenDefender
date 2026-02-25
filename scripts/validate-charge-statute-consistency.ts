/**
 * Charge-Statute Consistency Validator
 * 
 * This script cross-validates charge codes in criminal-charges.ts against
 * statute citations in the database to ensure data consistency.
 * 
 * Usage: npx tsx scripts/validate-charge-statute-consistency.ts
 * 
 * Exit codes:
 *   0 - All validations passed
 *   1 - Mismatches found (prints report)
 */

import { db } from '../server/db';
import { statutes } from '../shared/schema';
import { criminalCharges } from '../shared/criminal-charges';
import { eq, sql } from 'drizzle-orm';

interface ValidationResult {
  chargeId: string;
  chargeName: string;
  jurisdiction: string;
  chargeCode: string;
  expectedCitation: string | null;
  dbCitation: string | null;
  dbSection: string | null;
  status: 'match' | 'mismatch' | 'no_db_record' | 'skipped';
  reason?: string;
}

interface ValidationStats {
  total: number;
  matches: number;
  mismatches: number;
  noDbRecord: number;
  skipped: number;
}

const STATE_CITATION_PATTERNS: Record<string, (code: string) => string> = {
  'AL': (code) => `Ala. Code § ${code}`,
  'AK': (code) => `Alaska Stat. § ${code}`,
  'AZ': (code) => `Ariz. Rev. Stat. Ann. § ${code}`,
  'AR': (code) => `Ark. Code Ann. § ${code}`,
  'CA': (code) => `Cal. Penal Code § ${code}`,
  'CO': (code) => `Colo. Rev. Stat. § ${code}`,
  'CT': (code) => `Conn. Gen. Stat. § ${code}`,
  'DE': (code) => `Del. Code Ann. tit. 11, § ${code}`,
  'DC': (code) => `D.C. Code § ${code}`,
  'FL': (code) => `Fla. Stat. § ${code}`,
  'GA': (code) => `Ga. Code § ${code}`,
  'HI': (code) => `Haw. Rev. Stat. § ${code}`,
  'ID': (code) => `Idaho Code § ${code}`,
  'IL': (code) => `720 ILCS ${code}`,
  'IN': (code) => `Ind. Code § ${code}`,
  'IA': (code) => `Iowa Code § ${code}`,
  'KS': (code) => `Kan. Stat. Ann. § ${code}`,
  'KY': (code) => `Ky. Rev. Stat. § ${code}`,
  'LA': (code) => `La. Rev. Stat. Ann. § ${code}`,
  'ME': (code) => `Me. Rev. Stat. tit. 17-A, § ${code}`,
  'MD': (code) => `Md. Code, Crim. Law § ${code}`,
  'MA': (code) => `Mass. Gen. Laws ch. ${code}`,
  'MI': (code) => `Mich. Comp. Laws § ${code}`,
  'MN': (code) => `Minn. Stat. § ${code}`,
  'MS': (code) => `Miss. Code Ann. § ${code}`,
  'MO': (code) => `Mo. Rev. Stat. § ${code}`,
  'MT': (code) => `Mont. Code Ann. § ${code}`,
  'NE': (code) => `Neb. Rev. Stat. § ${code}`,
  'NV': (code) => `Nev. Rev. Stat. § ${code}`,
  'NH': (code) => `N.H. Rev. Stat. Ann. § ${code}`,
  'NJ': (code) => `N.J. Stat. Ann. § ${code}`,
  'NM': (code) => `N.M. Stat. Ann. § ${code}`,
  'NY': (code) => `N.Y. Penal Law § ${code}`,
  'NC': (code) => `N.C. Gen. Stat. § ${code}`,
  'ND': (code) => `N.D. Cent. Code § ${code}`,
  'OH': (code) => `Ohio Rev. Code § ${code}`,
  'OK': (code) => `Okla. Stat. tit. 21, § ${code}`,
  'OR': (code) => `Or. Rev. Stat. § ${code}`,
  'PA': (code) => `18 Pa.C.S. § ${code}`,
  'RI': (code) => `R.I. Gen. Laws § ${code}`,
  'SC': (code) => `S.C. Code Ann. § ${code}`,
  'SD': (code) => `S.D. Codified Laws § ${code}`,
  'TN': (code) => `Tenn. Code Ann. § ${code}`,
  'TX': (code) => `Tex. Penal Code § ${code}`,
  'UT': (code) => `Utah Code Ann. § ${code}`,
  'VT': (code) => `Vt. Stat. Ann. tit. 13, § ${code}`,
  'VA': (code) => `Va. Code Ann. § ${code}`,
  'WA': (code) => `Wash. Rev. Code § ${code}`,
  'WV': (code) => `W. Va. Code § ${code}`,
  'WI': (code) => `Wis. Stat. § ${code}`,
  'WY': (code) => `Wyo. Stat. Ann. § ${code}`,
  'US': (code) => `18 USC § ${code}`,
};

function extractSectionFromCitation(citation: string): string | null {
  if (citation.includes('ILCS')) {
    const ilcsMatch = citation.match(/ILCS\s+([\d\w\-.:\/()]+)/);
    return ilcsMatch ? ilcsMatch[1] : null;
  }
  if (citation.includes('Mass. Gen. Laws ch.')) {
    const maMatch = citation.match(/ch\.\s*([\d\w\-]+)/);
    return maMatch ? maMatch[1] : null;
  }
  const match = citation.match(/§\s*([\d\w\-.:\/]+(?:\([A-Za-z0-9]+\))*\d*)/);
  return match ? match[1] : null;
}

function normalizeChargeName(name: string): string {
  return name.toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

async function validateChargeStatuteConsistency(): Promise<void> {
  console.log('🔍 Charge-Statute Consistency Validator\n');
  console.log('=' .repeat(60));
  
  const stats: ValidationStats = {
    total: 0,
    matches: 0,
    mismatches: 0,
    noDbRecord: 0,
    skipped: 0
  };
  
  const results: ValidationResult[] = [];
  const mismatches: ValidationResult[] = [];
  
  console.log('📊 Loading database statutes...');
  const dbStatutes = await db.select().from(statutes);
  console.log(`   Found ${dbStatutes.length} statutes in database\n`);
  
  const statutesByJurisdictionAndSection = new Map<string, typeof dbStatutes[0]>();
  const statutesByJurisdictionAndTitle = new Map<string, typeof dbStatutes[0]>();
  
  for (const statute of dbStatutes) {
    const section = extractSectionFromCitation(statute.citation);
    if (section) {
      const key = `${statute.jurisdiction}:${section}`;
      statutesByJurisdictionAndSection.set(key, statute);
    }
    if (statute.section) {
      const sectionKey = `${statute.jurisdiction}:${statute.section}`;
      if (!statutesByJurisdictionAndSection.has(sectionKey)) {
        statutesByJurisdictionAndSection.set(sectionKey, statute);
      }
    }
    const titleKey = `${statute.jurisdiction}:${normalizeChargeName(statute.title)}`;
    statutesByJurisdictionAndTitle.set(titleKey, statute);
  }
  
  console.log('🔄 Validating charges against database...\n');
  
  for (const charge of criminalCharges) {
    stats.total++;
    
    if (!STATE_CITATION_PATTERNS[charge.jurisdiction]) {
      results.push({
        chargeId: charge.id,
        chargeName: charge.name,
        jurisdiction: charge.jurisdiction,
        chargeCode: charge.code,
        expectedCitation: null,
        dbCitation: null,
        dbSection: null,
        status: 'skipped',
        reason: 'Unknown jurisdiction pattern'
      });
      stats.skipped++;
      continue;
    }
    
    const expectedCitation = STATE_CITATION_PATTERNS[charge.jurisdiction](charge.code);
    const lookupKey = `${charge.jurisdiction}:${charge.code}`;
    const dbStatute = statutesByJurisdictionAndSection.get(lookupKey);
    
    const titleKey = `${charge.jurisdiction}:${normalizeChargeName(charge.name)}`;
    const statuteByTitle = statutesByJurisdictionAndTitle.get(titleKey);
    
    if (statuteByTitle && !dbStatute) {
      const dbSection = extractSectionFromCitation(statuteByTitle.citation);
      if (dbSection === charge.code || statuteByTitle.section === charge.code) {
        results.push({
          chargeId: charge.id,
          chargeName: charge.name,
          jurisdiction: charge.jurisdiction,
          chargeCode: charge.code,
          expectedCitation,
          dbCitation: statuteByTitle.citation,
          dbSection,
          status: 'match'
        });
        stats.matches++;
      } else {
        const result: ValidationResult = {
          chargeId: charge.id,
          chargeName: charge.name,
          jurisdiction: charge.jurisdiction,
          chargeCode: charge.code,
          expectedCitation,
          dbCitation: statuteByTitle.citation,
          dbSection,
          status: 'mismatch',
          reason: `Charge code '${charge.code}' should be '${dbSection}' to match DB statute`
        };
        results.push(result);
        mismatches.push(result);
        stats.mismatches++;
      }
      continue;
    }
    
    if (!dbStatute) {
      results.push({
        chargeId: charge.id,
        chargeName: charge.name,
        jurisdiction: charge.jurisdiction,
        chargeCode: charge.code,
        expectedCitation,
        dbCitation: null,
        dbSection: null,
        status: 'no_db_record',
        reason: 'No matching statute in database'
      });
      stats.noDbRecord++;
      continue;
    }
    
    const dbSection = extractSectionFromCitation(dbStatute.citation);
    
    if (dbSection === charge.code || dbStatute.section === charge.code) {
      results.push({
        chargeId: charge.id,
        chargeName: charge.name,
        jurisdiction: charge.jurisdiction,
        chargeCode: charge.code,
        expectedCitation,
        dbCitation: dbStatute.citation,
        dbSection,
        status: 'match'
      });
      stats.matches++;
    } else {
      const result: ValidationResult = {
        chargeId: charge.id,
        chargeName: charge.name,
        jurisdiction: charge.jurisdiction,
        chargeCode: charge.code,
        expectedCitation,
        dbCitation: dbStatute.citation,
        dbSection,
        status: 'mismatch',
        reason: `Code '${charge.code}' does not match DB section '${dbSection}'`
      };
      results.push(result);
      mismatches.push(result);
      stats.mismatches++;
    }
  }
  
  console.log('📊 Validation Results\n');
  console.log('=' .repeat(60));
  console.log(`Total charges validated:  ${stats.total}`);
  console.log(`✅ Matches:               ${stats.matches}`);
  console.log(`❌ Mismatches:            ${stats.mismatches}`);
  console.log(`⚠️  No DB record:          ${stats.noDbRecord}`);
  console.log(`⏭️  Skipped:               ${stats.skipped}`);
  console.log('=' .repeat(60));
  
  if (mismatches.length > 0) {
    console.log('\n❌ MISMATCHES FOUND:\n');
    console.log('-'.repeat(60));
    
    for (const m of mismatches) {
      console.log(`Charge: ${m.chargeId}`);
      console.log(`  Name: ${m.chargeName}`);
      console.log(`  Jurisdiction: ${m.jurisdiction}`);
      console.log(`  Charge Code: '${m.chargeCode}'`);
      console.log(`  DB Citation: ${m.dbCitation}`);
      console.log(`  DB Section: '${m.dbSection}'`);
      console.log(`  Expected Citation: ${m.expectedCitation}`);
      console.log(`  Issue: ${m.reason}`);
      console.log('-'.repeat(60));
    }
    
    console.log(`\n🔧 To fix mismatches, update the 'code' field in shared/criminal-charges.ts`);
    console.log(`   to match the section number in the database statute citation.\n`);
    
    process.exit(1);
  }
  
  console.log('\n✅ All charge codes are consistent with database statutes!\n');
  process.exit(0);
}

validateChargeStatuteConsistency().catch((error) => {
  console.error('❌ Validation failed with error:', error);
  process.exit(1);
});
