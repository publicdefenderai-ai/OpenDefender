/**
 * Script to correctly classify criminal charges as felony or misdemeanor
 * Based on standard criminal law classifications across US jurisdictions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ChargeClassifier {
  /**
   * Determines if a charge should be classified as felony or misdemeanor
   * Based on charge name and standard criminal law classifications
   */
  classifyCharge(chargeName) {
    const name = chargeName.toLowerCase();
    
    // FELONIES - Serious crimes with 1+ year prison time
    
    // All Homicides are felonies
    if (name.includes('murder') || name.includes('manslaughter') || 
        name.includes('homicide') || name.includes('killing')) {
      return 'felony';
    }
    
    // All Sexual Crimes are felonies
    if (name.includes('rape') || name.includes('sexual assault') || 
        name.includes('sexual abuse') || name.includes('sexual exploitation') ||
        name.includes('statutory rape')) {
      return 'felony';
    }
    
    // All Burglary is felony (breaking and entering with intent)
    if (name.includes('burglary')) {
      return 'felony';
    }
    
    // All Robbery is felony (theft with force/threat)
    if (name.includes('robbery') || name.includes('carjacking')) {
      return 'felony';
    }
    
    // Serious Assault crimes are felonies
    if (name.includes('assault in the first degree') || 
        name.includes('assault in the second degree') ||
        name.includes('aggravated assault') ||
        name.includes('assault with deadly weapon') ||
        name.includes('assault on peace officer') ||
        name.includes('assault on police')) {
      return 'felony';
    }
    
    // Grand Theft is felony
    if (name.includes('grand theft')) {
      return 'felony';
    }
    
    // Serious Drug Crimes are felonies
    if (name.includes('drug trafficking') || 
        name.includes('distribution of controlled substance') ||
        name.includes('manufacturing controlled substance') ||
        name.includes('possession with intent to distribute') ||
        name.includes('maintaining drug house')) {
      return 'felony';
    }
    
    // All Fraud crimes are typically felonies
    if (name.includes('fraud') || name.includes('forgery') || 
        name.includes('embezzlement') || name.includes('identity theft')) {
      return 'felony';
    }
    
    // Weapon offenses - felonies
    if (name.includes('felon in possession') || 
        name.includes('possession of prohibited weapon') ||
        name.includes('discharge of firearm')) {
      return 'felony';
    }
    
    // DUI Third Offense is typically felony
    if (name.includes('dui third') || name.includes('dui fourth') ||
        name.includes('dui with injury') || name.includes('dui causing death')) {
      return 'felony';
    }
    
    // Stalking (especially interstate) is felony
    if (name.includes('stalking') && (name.includes('aggravated') || name.includes('interstate'))) {
      return 'felony';
    }
    
    // Federal crimes are typically felonies
    if (name.includes('interstate') || name.includes('wire fraud') || 
        name.includes('mail fraud') || name.includes('money laundering') ||
        name.includes('tax evasion') || name.includes('perjury') ||
        name.includes('obstruction of justice')) {
      return 'felony';
    }
    
    // Child-related crimes are felonies
    if (name.includes('child') && (name.includes('abuse') || name.includes('exploitation'))) {
      return 'felony';
    }
    
    // MISDEMEANORS - Less serious crimes with up to 1 year jail time
    
    // Simple Assault (Third Degree) is misdemeanor
    if (name.includes('assault in the third degree') || name.includes('simple assault')) {
      return 'misdemeanor';
    }
    
    // Petty Theft is misdemeanor
    if (name.includes('petty theft') || name.includes('shoplifting')) {
      return 'misdemeanor';
    }
    
    // Public Order crimes are misdemeanors
    if (name.includes('disorderly conduct') || name.includes('disturbing the peace') ||
        name.includes('public intoxication') || name.includes('loitering')) {
      return 'misdemeanor';
    }
    
    // First and Second DUI typically misdemeanors
    if (name.includes('dui first') || name.includes('dui second')) {
      return 'misdemeanor';
    }
    
    // Simple drug possession (personal use) is misdemeanor
    if (name.includes('possession of controlled substance') && 
        !name.includes('intent to distribute')) {
      return 'misdemeanor';
    }
    
    if (name.includes('possession of drug paraphernalia')) {
      return 'misdemeanor';
    }
    
    // Traffic and driving offenses (minor) are misdemeanors
    if (name.includes('reckless driving') || name.includes('driving while suspended')) {
      return 'misdemeanor';
    }
    
    // Trespassing (simple) is misdemeanor
    if (name.includes('trespassing') || name.includes('criminal trespass')) {
      return 'misdemeanor';
    }
    
    // Minor vandalism is misdemeanor
    if (name.includes('vandalism') || name.includes('graffiti')) {
      return 'misdemeanor';
    }
    
    // Menacing/Threatening (without weapon) is misdemeanor
    if (name.includes('menacing')) {
      return 'misdemeanor';
    }
    
    // Hit and Run (property damage only) is misdemeanor
    // Note: With injury it would be felony, but we default to misdemeanor
    if (name.includes('hit and run') && !name.includes('injury')) {
      return 'misdemeanor';
    }
    
    // Unlawful carrying of weapon (without other aggravating factors) is often misdemeanor
    if (name.includes('unlawful carrying of weapon') && !name.includes('prohibited')) {
      return 'misdemeanor';
    }
    
    // Context-dependent crimes - use conservative classification
    
    // Domestic Violence Assault - varies by degree
    // First/Second degree = felony, Third degree = misdemeanor
    if (name.includes('domestic violence')) {
      if (name.includes('first degree') || name.includes('second degree') ||
          name.includes('aggravated')) {
        return 'felony';
      }
      return 'misdemeanor'; // Third degree or unspecified
    }
    
    // Theft by Receiving - depends on value, default to misdemeanor unless specified
    if (name.includes('theft by receiving')) {
      return 'misdemeanor';
    }
    
    // Default: if we don't have specific information, maintain current classification
    // This is a fallback - all common charges should be explicitly handled above
    console.warn(`Warning: No specific classification rule for "${chargeName}" - defaulting to felony (review needed)`);
    return 'felony';
  }

  /**
   * Process the criminal-charges.ts file and update classifications
   */
  updateChargeClassifications() {
    const filePath = path.join(__dirname, '..', 'shared', 'criminal-charges.ts');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Track statistics
    const stats = {
      totalCharges: 0,
      felonies: 0,
      misdemeanors: 0,
      changed: 0
    };
    
    // Use regex to find and replace charge classifications
    // Match pattern: name: 'ChargeName', ... category: 'felony' or 'misdemeanor',
    const chargePattern = /(name:\s*'([^']+)'[\s\S]*?category:\s*')([^']+)(')/g;
    
    content = content.replace(chargePattern, (match, prefix, chargeName, oldCategory, suffix) => {
      stats.totalCharges++;
      const newCategory = this.classifyCharge(chargeName);
      
      if (newCategory === 'felony') stats.felonies++;
      else if (newCategory === 'misdemeanor') stats.misdemeanors++;
      
      if (oldCategory !== newCategory) {
        stats.changed++;
        console.log(`Changed: "${chargeName}" from ${oldCategory} to ${newCategory}`);
      }
      
      return prefix + newCategory + suffix;
    });
    
    // Write updated content back to file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log('\n=== Classification Update Complete ===');
    console.log(`Total charges processed: ${stats.totalCharges}`);
    console.log(`Felonies: ${stats.felonies}`);
    console.log(`Misdemeanors: ${stats.misdemeanors}`);
    console.log(`Changes made: ${stats.changed}`);
    
    return stats;
  }
}

// Run the classification update
const classifier = new ChargeClassifier();
classifier.updateChargeClassifications();
