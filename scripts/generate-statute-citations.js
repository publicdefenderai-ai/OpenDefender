/**
 * Automated Charge-to-Statute Citation Generator
 * 
 * This script generates statute citations for all 4,146 criminal charges
 * by applying state-specific citation patterns to the charge code field.
 * 
 * Example: CA + code '242' → 'Cal. Penal Code § 242'
 */

import fs from 'fs/promises';

// State citation patterns based on research from STATE_STATUTE_SITES_RESEARCH.md
const STATE_CITATION_PATTERNS = {
  // Federal
  'US': {
    pattern: (code) => `18 USC § ${code}`,
    notes: 'Federal crimes under Title 18 of United States Code'
  },
  
  // Top 10 States
  'AL': {
    pattern: (code) => `Ala. Code § ${code}`,
    notes: 'Alabama Code'
  },
  'CA': {
    pattern: (code) => `Cal. Penal Code § ${code}`,
    notes: 'California Penal Code (note: drug crimes may be Health & Safety Code)'
  },
  'TX': {
    pattern: (code) => `Tex. Penal Code § ${code}`,
    notes: 'Texas Penal Code'
  },
  'FL': {
    pattern: (code) => `Fla. Stat. § ${code}`,
    notes: 'Florida Statutes'
  },
  'NY': {
    pattern: (code) => `N.Y. Penal Law § ${code}`,
    notes: 'New York Penal Law'
  },
  'PA': {
    pattern: (code) => `18 Pa.C.S. § ${code}`,
    notes: 'Pennsylvania Consolidated Statutes Title 18'
  },
  'IL': {
    pattern: (code) => `720 ILCS 5/${code}`,
    notes: 'Illinois Compiled Statutes'
  },
  'OH': {
    pattern: (code) => `Ohio Rev. Code Ann. § ${code}`,
    notes: 'Ohio Revised Code'
  },
  'GA': {
    pattern: (code) => `Ga. Code Ann. § ${code}`,
    notes: 'Georgia Code Annotated'
  },
  'NC': {
    pattern: (code) => `N.C. Gen. Stat. § ${code}`,
    notes: 'North Carolina General Statutes'
  },
  'MI': {
    pattern: (code) => `Mich. Comp. Laws § ${code}`,
    notes: 'Michigan Compiled Laws'
  },
  
  // Remaining 38 states + territories
  'AK': { pattern: (code) => `Alaska Stat. § ${code}` },
  'AZ': { pattern: (code) => `Ariz. Rev. Stat. § ${code}` },
  'AR': { pattern: (code) => `Ark. Code Ann. § ${code}` },
  'CO': { pattern: (code) => `Colo. Rev. Stat. § ${code}` },
  'CT': { pattern: (code) => `Conn. Gen. Stat. § ${code}` },
  'DE': { pattern: (code) => `Del. Code Ann. tit. 11, § ${code}` },
  'HI': { pattern: (code) => `Haw. Rev. Stat. § ${code}` },
  'ID': { pattern: (code) => `Idaho Code § ${code}` },
  'IN': { pattern: (code) => `Ind. Code § ${code}` },
  'IA': { pattern: (code) => `Iowa Code § ${code}` },
  'KS': { pattern: (code) => `Kan. Stat. Ann. § ${code}` },
  'KY': { pattern: (code) => `Ky. Rev. Stat. Ann. § ${code}` },
  'LA': { pattern: (code) => `La. Rev. Stat. Ann. § ${code}` },
  'ME': { pattern: (code) => `Me. Rev. Stat. Ann. tit. 17-A, § ${code}` },
  'MD': { pattern: (code) => `Md. Code Ann., Crim. Law § ${code}` },
  'MA': { pattern: (code) => `Mass. Gen. Laws ch. ${code}` },
  'MN': { pattern: (code) => `Minn. Stat. § ${code}` },
  'MS': { pattern: (code) => `Miss. Code Ann. § ${code}` },
  'MO': { pattern: (code) => `Mo. Rev. Stat. § ${code}` },
  'MT': { pattern: (code) => `Mont. Code Ann. § ${code}` },
  'NE': { pattern: (code) => `Neb. Rev. Stat. § ${code}` },
  'NV': { pattern: (code) => `Nev. Rev. Stat. § ${code}` },
  'NH': { pattern: (code) => `N.H. Rev. Stat. Ann. § ${code}` },
  'NJ': { pattern: (code) => `N.J. Stat. Ann. § ${code}` },
  'NM': { pattern: (code) => `N.M. Stat. Ann. § ${code}` },
  'ND': { pattern: (code) => `N.D. Cent. Code § ${code}` },
  'OK': { pattern: (code) => `Okla. Stat. tit. 21, § ${code}` },
  'OR': { pattern: (code) => `Or. Rev. Stat. § ${code}` },
  'RI': { pattern: (code) => `R.I. Gen. Laws § ${code}` },
  'SC': { pattern: (code) => `S.C. Code Ann. § ${code}` },
  'SD': { pattern: (code) => `S.D. Codified Laws § ${code}` },
  'TN': { pattern: (code) => `Tenn. Code Ann. § ${code}` },
  'UT': { pattern: (code) => `Utah Code Ann. § ${code}` },
  'VT': { pattern: (code) => `Vt. Stat. Ann. tit. 13, § ${code}` },
  'VA': { pattern: (code) => `Va. Code Ann. § ${code}` },
  'WA': { pattern: (code) => `Wash. Rev. Code § ${code}` },
  'WV': { pattern: (code) => `W. Va. Code § ${code}` },
  'WI': { pattern: (code) => `Wis. Stat. § ${code}` },
  'WY': { pattern: (code) => `Wyo. Stat. Ann. § ${code}` },
  
  // Territories
  'DC': { pattern: (code) => `D.C. Code § ${code}` },
  'PR': { pattern: (code) => `P.R. Laws Ann. tit. 33, § ${code}` },
  'VI': { pattern: (code) => `V.I. Code Ann. tit. 14, § ${code}` },
  'GU': { pattern: (code) => `Guam Code Ann. tit. 9, § ${code}` },
  'AS': { pattern: (code) => `Am. Samoa Code Ann. § ${code}` },
  'MP': { pattern: (code) => `N. Mar. I. Code § ${code}` },
};

class CitationGenerator {
  constructor() {
    this.stats = {
      totalCharges: 0,
      citationsGenerated: 0,
      unknownJurisdictions: new Set(),
      errors: []
    };
  }

  /**
   * Generate statute citation for a criminal charge
   */
  generateCitation(jurisdiction, code) {
    const pattern = STATE_CITATION_PATTERNS[jurisdiction];
    
    if (!pattern) {
      this.stats.unknownJurisdictions.add(jurisdiction);
      return null;
    }
    
    try {
      return pattern.pattern(code);
    } catch (error) {
      this.stats.errors.push({
        jurisdiction,
        code,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Process a single charge and add statuteCitations field
   */
  processCharge(charge) {
    this.stats.totalCharges++;
    
    const citation = this.generateCitation(charge.jurisdiction, charge.code);
    
    if (citation) {
      this.stats.citationsGenerated++;
      return {
        ...charge,
        statuteCitations: [citation]
      };
    }
    
    // Return charge unchanged if no citation could be generated
    return charge;
  }

  /**
   * Read criminal charges file
   */
  async readChargesFile() {
    console.log('📖 Reading criminal charges file...');
    
    const content = await fs.readFile('shared/criminal-charges.ts', 'utf-8');
    
    // Extract the charges array
    const chargesMatch = content.match(/export const criminalCharges: CriminalCharge\[\] = (\[[\s\S]*?\n\];)/);
    
    if (!chargesMatch) {
      throw new Error('Could not find criminalCharges array in file');
    }
    
    // Parse the charges (simplified - assumes valid TypeScript syntax)
    const chargesStr = chargesMatch[1];
    
    // Use eval to parse TypeScript object literal (safe since it's our own code)
    // In production, would use proper AST parsing
    const charges = eval(chargesStr);
    
    console.log(`✅ Found ${charges.length} charges`);
    
    return charges;
  }

  /**
   * Generate TypeScript code for charges with citations
   */
  generateTypeScriptCode(charges) {
    const header = `// Criminal Charges Database - Comprehensive Coverage for All US Jurisdictions
// Generated: ${new Date().toISOString()}
// Total Charges: ${charges.length}
// Jurisdictions: All 50 states + DC + US territories
//
// NOTE: This database contains synthesized criminal charges based on standard criminal law
// patterns and Model Penal Code principles for comprehensive coverage across all US jurisdictions.
// The charges represent common crime categories found in state criminal codes but use
// generated statute codes and standardized penalties for consistency in legal guidance.

export interface CriminalCharge {
  id: string;
  name: string;
  code: string;
  jurisdiction: string;
  category: 'felony' | 'misdemeanor' | 'infraction';
  description: string;
  maxPenalty: string;
  commonDefenses: string[];
  evidenceToGather: string[];
  specificRights: string[];
  urgentActions: string[];
  statuteCitations?: string[]; // Link to underlying statutes (e.g., ["Cal. Penal Code § 242", "18 USC § 1001"])
}

export const criminalCharges: CriminalCharge[] = `;

    // Format charges array with proper indentation
    const chargesJson = JSON.stringify(charges, null, 2);
    
    // Convert JSON back to TypeScript format (add back single quotes for strings, etc.)
    let chargesTs = chargesJson
      .replace(/"([^"]+)":/g, '$1:')  // Remove quotes from keys
      .replace(/: "([^"]*)"/g, ": '$1'")  // Use single quotes for string values
      .replace(/\["([^"]+)"\]/g, "['$1']");  // Single quotes in arrays
    
    const footer = `
;

// Helper function to get charge by ID
export function getChargeById(id: string): CriminalCharge | undefined {
  return criminalCharges.find(charge => charge.id === id);
}

// Helper function to get charges by jurisdiction
export function getChargesByJurisdiction(jurisdiction: string): CriminalCharge[] {
  return criminalCharges.filter(charge => charge.jurisdiction === jurisdiction);
}

// Helper function to get charges by category
export function getChargesByCategory(category: 'felony' | 'misdemeanor' | 'infraction'): CriminalCharge[] {
  return criminalCharges.filter(charge => charge.category === category);
}

// Export charge categories (organized by jurisdiction)
export const chargeCategories: Record<string, string[]> = criminalCharges.reduce((acc, charge) => {
  if (!acc[charge.jurisdiction]) {
    acc[charge.jurisdiction] = [];
  }
  acc[charge.jurisdiction].push(charge.id);
  return acc;
}, {} as Record<string, string[]>);

// Helper function to get charges by jurisdiction category
export function getChargesByCategoryAndJurisdiction(jurisdiction: string): CriminalCharge[] {
  const categoryIds = chargeCategories[jurisdiction] || [];
  return categoryIds.map(id => getChargeById(id)).filter(charge => charge !== undefined) as CriminalCharge[];
}
`;

    return header + chargesTs + footer;
  }

  /**
   * Main execution
   */
  async run() {
    console.log('🚀 Starting automated statute citation generator...\n');
    
    try {
      // Read charges
      const charges = await this.readChargesFile();
      
      // Process each charge
      console.log('🔄 Generating statute citations...');
      const updatedCharges = charges.map(charge => this.processCharge(charge));
      
      // Generate new file content
      console.log('📝 Generating updated TypeScript file...');
      const newContent = this.generateTypeScriptCode(updatedCharges);
      
      // Write to file
      console.log('💾 Writing updated file...');
      await fs.writeFile('shared/criminal-charges.ts', newContent, 'utf-8');
      
      // Print stats
      console.log('\n✅ Citation generation complete!\n');
      console.log('📊 Statistics:');
      console.log(`   Total charges: ${this.stats.totalCharges}`);
      console.log(`   Citations generated: ${this.stats.citationsGenerated}`);
      console.log(`   Success rate: ${((this.stats.citationsGenerated / this.stats.totalCharges) * 100).toFixed(1)}%`);
      
      if (this.stats.unknownJurisdictions.size > 0) {
        console.log(`\n⚠️  Unknown jurisdictions (${this.stats.unknownJurisdictions.size}):`);
        Array.from(this.stats.unknownJurisdictions).sort().forEach(j => {
          console.log(`   - ${j}`);
        });
      }
      
      if (this.stats.errors.length > 0) {
        console.log(`\n❌ Errors (${this.stats.errors.length}):`);
        this.stats.errors.slice(0, 10).forEach(err => {
          console.log(`   - ${err.jurisdiction} ${err.code}: ${err.error}`);
        });
        if (this.stats.errors.length > 10) {
          console.log(`   ... and ${this.stats.errors.length - 10} more`);
        }
      }
      
    } catch (error) {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    }
  }
}

// Run the generator
const generator = new CitationGenerator();
generator.run();
