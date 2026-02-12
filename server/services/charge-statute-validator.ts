/**
 * Charge-Statute Consistency Validator Service
 * 
 * Validates that criminal charge codes in shared/criminal-charges.ts
 * match the statute citations in the database.
 * 
 * This runs on server startup and logs warnings for any inconsistencies.
 */

import { db } from '../db';
import { statutes } from '@shared/schema';
import { criminalCharges } from '@shared/criminal-charges';
import { devLog, opsLog, errLog } from '../utils/dev-logger';

interface ValidationResult {
  matches: number;
  mismatches: number;
  noDbRecord: number;
  total: number;
  issues: Array<{
    chargeId: string;
    chargeName: string;
    jurisdiction: string;
    oldCode: string;
    expectedCode: string;
  }>;
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
  const match = citation.match(/§\s*([\d\w\-.:\/]+(?:\([A-Za-z0-9]+\))?)/);
  return match ? match[1] : null;
}

function normalizeChargeName(name: string): string {
  return name.toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

export async function validateChargeStatuteConsistency(): Promise<ValidationResult> {
  const dbStatutes = await db.select().from(statutes);
  
  const statutesByJurisdictionAndSection = new Map<string, typeof dbStatutes[0]>();
  const statutesByJurisdictionAndTitle = new Map<string, typeof dbStatutes[0]>();
  
  for (const statute of dbStatutes) {
    const section = extractSectionFromCitation(statute.citation);
    if (section) {
      const key = `${statute.jurisdiction}:${section}`;
      statutesByJurisdictionAndSection.set(key, statute);
    }
    const titleKey = `${statute.jurisdiction}:${normalizeChargeName(statute.title)}`;
    statutesByJurisdictionAndTitle.set(titleKey, statute);
  }
  
  const result: ValidationResult = {
    matches: 0,
    mismatches: 0,
    noDbRecord: 0,
    total: 0,
    issues: []
  };
  
  for (const charge of criminalCharges) {
    result.total++;
    
    if (!STATE_CITATION_PATTERNS[charge.jurisdiction]) {
      continue;
    }
    
    const lookupKey = `${charge.jurisdiction}:${charge.code}`;
    const dbStatute = statutesByJurisdictionAndSection.get(lookupKey);
    
    const titleKey = `${charge.jurisdiction}:${normalizeChargeName(charge.name)}`;
    const statuteByTitle = statutesByJurisdictionAndTitle.get(titleKey);
    
    if (statuteByTitle && !dbStatute) {
      const dbSection = extractSectionFromCitation(statuteByTitle.citation);
      if (dbSection && dbSection !== charge.code) {
        result.mismatches++;
        result.issues.push({
          chargeId: charge.id,
          chargeName: charge.name,
          jurisdiction: charge.jurisdiction,
          oldCode: charge.code,
          expectedCode: dbSection
        });
      }
      continue;
    }
    
    if (!dbStatute) {
      result.noDbRecord++;
      continue;
    }
    
    const dbSection = extractSectionFromCitation(dbStatute.citation);
    
    if (dbSection === charge.code) {
      result.matches++;
    } else if (dbSection) {
      result.mismatches++;
      result.issues.push({
        chargeId: charge.id,
        chargeName: charge.name,
        jurisdiction: charge.jurisdiction,
        oldCode: charge.code,
        expectedCode: dbSection
      });
    }
  }
  
  return result;
}

export async function runStartupValidation(): Promise<void> {
  opsLog('validator', 'Running charge-statute consistency check...');
  
  try {
    const result = await validateChargeStatuteConsistency();
    
    if (result.mismatches === 0) {
      opsLog('validator', `All ${result.matches} charge codes are consistent with database statutes`);
    } else {
      opsLog('validator', `Found ${result.mismatches} charge-statute mismatches:`);
      for (const issue of result.issues.slice(0, 5)) {
        opsLog('validator', `  - ${issue.chargeId}: code '${issue.oldCode}' should be '${issue.expectedCode}'`);
      }
      if (result.issues.length > 5) {
        opsLog('validator', `  ... and ${result.issues.length - 5} more. Run 'npx tsx scripts/validate-charge-statute-consistency.ts' for full report.`);
      }
      opsLog('validator', `Run 'npx tsx scripts/fix-charge-codes.ts' to auto-fix these issues.`);
    }
    
    opsLog('validator', `Stats: ${result.matches} matches, ${result.noDbRecord} charges without DB records`);
  } catch (error) {
    errLog('[Validator] Failed to run consistency check', error);
  }
}
