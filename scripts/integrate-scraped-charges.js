import { promises as fs } from 'fs';

class ChargeIntegrator {
  constructor() {
    this.existingCharges = [];
    this.scrapedCharges = [];
    this.mergedCharges = [];
    this.chargeCategories = {};
  }

  async loadExistingCharges() {
    console.log('📖 Reading existing criminal charges...');
    
    try {
      const chargesContent = await fs.readFile('shared/criminal-charges.ts', 'utf-8');
      
      // Extract the charges array from the TypeScript file
      const chargesMatch = chargesContent.match(/export const criminalCharges: CriminalCharge\[\] = (\[[\s\S]*?\]);/);
      if (!chargesMatch) {
        throw new Error('Could not find criminalCharges array in file');
      }
      
      // Convert TypeScript to JSON-parseable format (simplified approach)
      // This is a basic approach - in production would use proper AST parsing
      let chargesStr = chargesMatch[1];
      
      // Simple regex-based cleanup for basic parsing
      chargesStr = chargesStr.replace(/'/g, '"'); // Single to double quotes
      chargesStr = chargesStr.replace(/(\w+):/g, '"$1":'); // Add quotes to object keys
      chargesStr = chargesStr.replace(/,(\s*[\}\]])/g, '$1'); // Remove trailing commas
      
      try {
        this.existingCharges = JSON.parse(chargesStr);
        console.log(`✅ Loaded ${this.existingCharges.length} existing charges`);
      } catch (parseError) {
        console.log('⚠️  Could not parse existing charges, starting fresh');
        this.existingCharges = [];
      }
      
      // Extract charge categories
      const categoriesMatch = chargesContent.match(/export const chargeCategories: Record<string, string\[\]> = (\{[\s\S]*?\});/);
      if (categoriesMatch) {
        let categoriesStr = categoriesMatch[1];
        categoriesStr = categoriesStr.replace(/'/g, '"');
        categoriesStr = categoriesStr.replace(/(\w+):/g, '"$1":');
        categoriesStr = categoriesStr.replace(/,(\s*[\}\]])/g, '$1');
        
        try {
          this.chargeCategories = JSON.parse(categoriesStr);
          console.log(`✅ Loaded ${Object.keys(this.chargeCategories).length} charge categories`);
        } catch (parseError) {
          console.log('⚠️  Could not parse charge categories, will rebuild');
          this.chargeCategories = {};
        }
      }
      
    } catch (error) {
      console.log(`⚠️  Could not read existing charges: ${error.message}`);
      this.existingCharges = [];
      this.chargeCategories = {};
    }
  }

  async loadScrapedCharges(filename) {
    console.log(`📖 Reading scraped charges from ${filename}...`);
    
    try {
      const content = await fs.readFile(filename, 'utf-8');
      this.scrapedCharges = JSON.parse(content);
      console.log(`✅ Loaded ${this.scrapedCharges.length} scraped charges`);
    } catch (error) {
      throw new Error(`Could not load scraped charges: ${error.message}`);
    }
  }

  mergeCharges() {
    console.log('🔄 Merging charges...');
    
    // Create a map of existing charges by ID for deduplication
    const existingChargesMap = new Map();
    this.existingCharges.forEach(charge => {
      existingChargesMap.set(charge.id, charge);
    });

    // Start with existing charges
    this.mergedCharges = [...this.existingCharges];
    let newChargesCount = 0;
    let updatedChargesCount = 0;

    // Add or update with scraped charges
    this.scrapedCharges.forEach(scrapedCharge => {
      if (existingChargesMap.has(scrapedCharge.id)) {
        // Update existing charge with scraped data (scraped data takes precedence)
        const existingIndex = this.mergedCharges.findIndex(c => c.id === scrapedCharge.id);
        if (existingIndex !== -1) {
          this.mergedCharges[existingIndex] = scrapedCharge;
          updatedChargesCount++;
        }
      } else {
        // Add new charge
        this.mergedCharges.push(scrapedCharge);
        newChargesCount++;
      }
    });

    console.log(`✅ Merge complete:`);
    console.log(`   - Existing charges: ${this.existingCharges.length}`);
    console.log(`   - New charges added: ${newChargesCount}`);
    console.log(`   - Existing charges updated: ${updatedChargesCount}`);
    console.log(`   - Total merged charges: ${this.mergedCharges.length}`);
  }

  buildChargeCategories() {
    console.log('🏗️  Building charge categories...');
    
    // Group charges by jurisdiction and crime type
    const jurisdictionMap = {};
    const categoryMap = {
      'Homicide Crimes': [],
      'Assault Crimes': [],
      'Sexual Crimes': [],
      'Theft Crimes': [],
      'Burglary Crimes': [],
      'Robbery Crimes': [],
      'Drug Crimes': [],
      'Weapons Crimes': [],
      'Fraud Crimes': [],
      'Public Order Crimes': [],
      'DUI/Traffic Crimes': [],
      'Federal Crimes': []
    };

    this.mergedCharges.forEach(charge => {
      // Group by jurisdiction
      if (!jurisdictionMap[charge.jurisdiction]) {
        jurisdictionMap[charge.jurisdiction] = [];
      }
      jurisdictionMap[charge.jurisdiction].push(charge.id);

      // Group by crime type based on charge name
      if (charge.name.toLowerCase().includes('murder') || 
          charge.name.toLowerCase().includes('homicide') || 
          charge.name.toLowerCase().includes('manslaughter')) {
        categoryMap['Homicide Crimes'].push(charge.id);
      } else if (charge.name.toLowerCase().includes('assault') || 
                 charge.name.toLowerCase().includes('menacing')) {
        categoryMap['Assault Crimes'].push(charge.id);
      } else if (charge.name.toLowerCase().includes('rape') || 
                 charge.name.toLowerCase().includes('sexual')) {
        categoryMap['Sexual Crimes'].push(charge.id);
      } else if (charge.name.toLowerCase().includes('theft') || 
                 charge.name.toLowerCase().includes('larceny') || 
                 charge.name.toLowerCase().includes('embezzlement') || 
                 charge.name.toLowerCase().includes('shoplifting')) {
        categoryMap['Theft Crimes'].push(charge.id);
      } else if (charge.name.toLowerCase().includes('burglary')) {
        categoryMap['Burglary Crimes'].push(charge.id);
      } else if (charge.name.toLowerCase().includes('robbery') || 
                 charge.name.toLowerCase().includes('carjacking')) {
        categoryMap['Robbery Crimes'].push(charge.id);
      } else if (charge.name.toLowerCase().includes('drug') || 
                 charge.name.toLowerCase().includes('controlled substance') || 
                 charge.name.toLowerCase().includes('trafficking') || 
                 charge.name.toLowerCase().includes('paraphernalia')) {
        categoryMap['Drug Crimes'].push(charge.id);
      } else if (charge.name.toLowerCase().includes('weapon') || 
                 charge.name.toLowerCase().includes('firearm') || 
                 charge.name.toLowerCase().includes('gun')) {
        categoryMap['Weapons Crimes'].push(charge.id);
      } else if (charge.name.toLowerCase().includes('fraud') || 
                 charge.name.toLowerCase().includes('forgery') || 
                 charge.name.toLowerCase().includes('identity theft')) {
        categoryMap['Fraud Crimes'].push(charge.id);
      } else if (charge.name.toLowerCase().includes('dui') || 
                 charge.name.toLowerCase().includes('driving') || 
                 charge.name.toLowerCase().includes('vehicular') || 
                 charge.name.toLowerCase().includes('hit and run')) {
        categoryMap['DUI/Traffic Crimes'].push(charge.id);
      } else if (charge.jurisdiction === 'Federal' || charge.code.startsWith('18 USC') || charge.code.startsWith('fed-')) {
        categoryMap['Federal Crimes'].push(charge.id);
      } else {
        categoryMap['Public Order Crimes'].push(charge.id);
      }
    });

    // Combine with existing categories and add jurisdiction-based categories
    this.chargeCategories = {
      ...categoryMap,
      ...jurisdictionMap
    };

    // Remove empty categories
    Object.keys(this.chargeCategories).forEach(key => {
      if (this.chargeCategories[key].length === 0) {
        delete this.chargeCategories[key];
      }
    });

    console.log(`✅ Built ${Object.keys(this.chargeCategories).length} charge categories`);
  }

  async writeUpdatedFile() {
    console.log('💾 Writing updated criminal charges file...');
    
    // Generate TypeScript content
    const tsContent = this.generateTypeScriptContent();
    
    // Create backup of existing file
    try {
      await fs.copyFile('shared/criminal-charges.ts', 'shared/criminal-charges.ts.backup');
      console.log('✅ Created backup of existing file');
    } catch (error) {
      console.log('⚠️  Could not create backup:', error.message);
    }
    
    // Write updated file
    await fs.writeFile('shared/criminal-charges.ts', tsContent);
    console.log('✅ Updated criminal charges file written');
  }

  generateTypeScriptContent() {
    // Generate the TypeScript file content
    const header = `// Criminal Charges Database - Comprehensive Coverage for All US Jurisdictions
// Generated: ${new Date().toISOString()}
// Total Charges: ${this.mergedCharges.length}
// Jurisdictions: All 50 states + DC + US territories

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
}

`;

    // Generate charges array
    const chargesArray = 'export const criminalCharges: CriminalCharge[] = [\n' +
      this.mergedCharges.map(charge => {
        return `  {
    id: '${charge.id}',
    name: '${charge.name}',
    code: '${charge.code}',
    jurisdiction: '${charge.jurisdiction}',
    category: '${charge.category}',
    description: '${charge.description.replace(/'/g, "\\'")}',
    maxPenalty: '${charge.maxPenalty}',
    commonDefenses: [${charge.commonDefenses.map(d => `'${d.replace(/'/g, "\\'")}'`).join(', ')}],
    evidenceToGather: [${charge.evidenceToGather.map(e => `'${e.replace(/'/g, "\\'")}'`).join(', ')}],
    specificRights: [${charge.specificRights.map(r => `'${r.replace(/'/g, "\\'")}'`).join(', ')}],
    urgentActions: [${charge.urgentActions.map(a => `'${a.replace(/'/g, "\\'")}'`).join(', ')}]
  }`;
      }).join(',\n') +
      '\n];\n\n';

    // Generate categories
    const categoriesObject = 'export const chargeCategories: Record<string, string[]> = {\n' +
      Object.entries(this.chargeCategories).map(([category, ids]) => {
        const idsString = ids.map(id => `'${id}'`).join(', ');
        return `  '${category}': [${idsString}]`;
      }).join(',\n') +
      '\n};\n\n';

    // Generate helper functions
    const helperFunctions = `// Helper functions for charge lookup
export function getChargeById(id: string): CriminalCharge | undefined {
  return criminalCharges.find(charge => charge.id === id);
}

export function getChargesByJurisdiction(jurisdiction: string): CriminalCharge[] {
  return criminalCharges.filter(charge => charge.jurisdiction === jurisdiction);
}

export function searchCharges(query: string): CriminalCharge[] {
  const lowercaseQuery = query.toLowerCase();
  return criminalCharges.filter(charge => 
    charge.name.toLowerCase().includes(lowercaseQuery) ||
    charge.code.toLowerCase().includes(lowercaseQuery) ||
    charge.description.toLowerCase().includes(lowercaseQuery)
  );
}

export function getChargesByCategory(category: string): CriminalCharge[] {
  const categoryIds = chargeCategories[category] || [];
  return categoryIds.map(id => getChargeById(id)).filter(charge => charge !== undefined) as CriminalCharge[];
}
`;

    return header + chargesArray + categoriesObject + helperFunctions;
  }

  async integrate(scrapedChargesFilename) {
    console.log('🚀 Starting Criminal Charges Integration...\n');
    
    try {
      await this.loadExistingCharges();
      await this.loadScrapedCharges(scrapedChargesFilename);
      this.mergeCharges();
      this.buildChargeCategories();
      await this.writeUpdatedFile();
      
      console.log('\n✅ Integration completed successfully!');
      console.log(`📊 Final Statistics:`);
      console.log(`   - Total charges: ${this.mergedCharges.length}`);
      console.log(`   - Categories: ${Object.keys(this.chargeCategories).length}`);
      console.log(`   - Jurisdictions: ${new Set(this.mergedCharges.map(c => c.jurisdiction)).size}`);
      
    } catch (error) {
      console.error('❌ Integration failed:', error.message);
      throw error;
    }
  }
}

export { ChargeIntegrator };

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  async function main() {
    const integrator = new ChargeIntegrator();
    const scrapedFile = process.argv[2] || 'scraped-criminal-charges-1758695218850.json';
    
    try {
      await integrator.integrate(scrapedFile);
    } catch (error) {
      console.error('❌ Integration failed:', error);
      process.exit(1);
    }
  }
  
  main();
}