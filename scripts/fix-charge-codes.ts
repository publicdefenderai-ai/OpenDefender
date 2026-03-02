/**
 * Auto-fix Charge Codes Script
 * 
 * This script reads the validation output and updates criminal-charges.ts
 * to match the verified statute database citations.
 * 
 * Usage: npx tsx scripts/fix-charge-codes.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { db } from '../server/db';
import { statutes } from '../shared/schema';
import { criminalCharges } from '../shared/criminal-charges';

interface FixMapping {
  chargeId: string;
  oldCode: string;
  newCode: string;
}

function extractSectionFromCitation(citation: string): string | null {
  if (citation.includes('ILCS')) {
    const ilcsMatch = citation.match(/ILCS\s+([\d\w\-.:\/]+)/);
    return ilcsMatch ? ilcsMatch[1] : null;
  }
  // Massachusetts: preserve chapter-section format (e.g., "ch. 265, § 13A" → "265-13A")
  if (citation.includes('Mass. Gen. Laws ch.')) {
    const maMatch = citation.match(/ch\.\s*([\d\w\-]+)(?:,?\s*§\s*([\d\w\-]+(?:\([A-Za-z0-9]+\))*))?/);
    if (maMatch) {
      return maMatch[2] ? `${maMatch[1]}-${maMatch[2]}` : maMatch[1];
    }
    return null;
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

async function generateFixes(): Promise<FixMapping[]> {
  console.log('📊 Loading database statutes...');
  const dbStatutes = await db.select().from(statutes);
  console.log(`   Found ${dbStatutes.length} statutes in database\n`);

  const statutesByJurisdictionAndTitle = new Map<string, typeof dbStatutes[0]>();
  
  for (const statute of dbStatutes) {
    const titleKey = `${statute.jurisdiction}:${normalizeChargeName(statute.title)}`;
    statutesByJurisdictionAndTitle.set(titleKey, statute);
  }

  const fixes: FixMapping[] = [];

  for (const charge of criminalCharges) {
    const titleKey = `${charge.jurisdiction}:${normalizeChargeName(charge.name)}`;
    const matchingStatute = statutesByJurisdictionAndTitle.get(titleKey);
    
    if (matchingStatute) {
      const dbSection = extractSectionFromCitation(matchingStatute.citation);
      if (dbSection && dbSection !== charge.code) {
        fixes.push({
          chargeId: charge.id,
          oldCode: charge.code,
          newCode: dbSection
        });
      }
    }
  }

  return fixes;
}

async function applyFixes(fixes: FixMapping[]): Promise<void> {
  const filePath = path.join(process.cwd(), 'shared', 'criminal-charges.ts');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  let appliedCount = 0;
  
  for (const fix of fixes) {
    const idPattern = new RegExp(`(id:\\s*['"]${fix.chargeId}['"][^}]*?code:\\s*['"])${escapeRegex(fix.oldCode)}(['"])`, 'g');
    const newContent = content.replace(idPattern, `$1${fix.newCode}$2`);
    
    if (newContent !== content) {
      content = newContent;
      appliedCount++;
      console.log(`✅ Fixed ${fix.chargeId}: '${fix.oldCode}' → '${fix.newCode}'`);
    } else {
      const altPattern = new RegExp(`(id:\\s*['"]${fix.chargeId}['"])([\\s\\S]*?)(code:\\s*['"])${escapeRegex(fix.oldCode)}(['"])`, 'g');
      const altNewContent = content.replace(altPattern, `$1$2$3${fix.newCode}$4`);
      
      if (altNewContent !== content) {
        content = altNewContent;
        appliedCount++;
        console.log(`✅ Fixed ${fix.chargeId}: '${fix.oldCode}' → '${fix.newCode}'`);
      } else {
        console.log(`⚠️  Could not fix ${fix.chargeId} (pattern not found)`);
      }
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`\n📝 Applied ${appliedCount} of ${fixes.length} fixes to criminal-charges.ts`);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function main(): Promise<void> {
  console.log('🔧 Charge Code Auto-Fixer\n');
  console.log('=' .repeat(60));
  
  const fixes = await generateFixes();
  console.log(`\n📋 Found ${fixes.length} codes to fix\n`);
  
  if (fixes.length === 0) {
    console.log('✅ No fixes needed!');
    process.exit(0);
  }
  
  console.log('Applying fixes...\n');
  await applyFixes(fixes);
  
  console.log('\n✅ Done! Run the validator again to confirm all fixes applied.');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
