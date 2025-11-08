/**
 * Statute Citation Generator Service
 * 
 * Generates statute citations for criminal charges based on jurisdiction and code.
 * Used to link charges to their underlying legal statutes.
 * 
 * Example: generateCitation('CA', '242') → 'Cal. Penal Code § 242'
 */

// State citation patterns based on research from STATE_STATUTE_SITES_RESEARCH.md
export interface CitationPattern {
  pattern: (code: string) => string;
  officialSite?: string;
  notes?: string;
}

export const STATE_CITATION_PATTERNS: Record<string, CitationPattern> = {
  // Federal
  'US': {
    pattern: (code) => `18 USC § ${code}`,
    officialSite: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title18',
    notes: 'Federal crimes under Title 18 of United States Code'
  },
  
  // Top 10 States (Priority Implementation)
  'AL': {
    pattern: (code) => `Ala. Code § ${code}`,
    officialSite: 'http://alisondb.legislature.state.al.us/alison/CodeOfAlabama/1975/coatoc.htm',
    notes: 'Alabama Code'
  },
  'CA': {
    pattern: (code) => `Cal. Penal Code § ${code}`,
    officialSite: 'https://leginfo.legislature.ca.gov/faces/codesTOCSelected.xhtml?tocCode=PEN',
    notes: 'California Penal Code (note: drug crimes may be Health & Safety Code)'
  },
  'TX': {
    pattern: (code) => `Tex. Penal Code § ${code}`,
    officialSite: 'https://statutes.capitol.texas.gov/?link=PE',
    notes: 'Texas Penal Code'
  },
  'FL': {
    pattern: (code) => `Fla. Stat. § ${code}`,
    officialSite: 'https://www.leg.state.fl.us/Statutes/',
    notes: 'Florida Statutes'
  },
  'NY': {
    pattern: (code) => `N.Y. Penal Law § ${code}`,
    officialSite: 'https://www.nysenate.gov/legislation/laws/PEN/-CH40',
    notes: 'New York Penal Law'
  },
  'PA': {
    pattern: (code) => `18 Pa.C.S. § ${code}`,
    officialSite: 'https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=18',
    notes: 'Pennsylvania Consolidated Statutes Title 18'
  },
  'IL': {
    pattern: (code) => `720 ILCS 5/${code}`,
    officialSite: 'https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ChapterID=53&ActID=1876',
    notes: 'Illinois Compiled Statutes'
  },
  'OH': {
    pattern: (code) => `Ohio Rev. Code Ann. § ${code}`,
    officialSite: 'https://codes.ohio.gov/ohio-revised-code',
    notes: 'Ohio Revised Code'
  },
  'GA': {
    pattern: (code) => `Ga. Code Ann. § ${code}`,
    officialSite: 'https://law.justia.com/codes/georgia/title-16/',
    notes: 'Georgia Code Annotated (Note: Georgia has no free .gov site)'
  },
  'NC': {
    pattern: (code) => `N.C. Gen. Stat. § ${code}`,
    officialSite: 'https://www.ncleg.gov/Laws/GeneralStatuteSections/Chapter14',
    notes: 'North Carolina General Statutes'
  },
  'MI': {
    pattern: (code) => `Mich. Comp. Laws § ${code}`,
    officialSite: 'http://legislature.mi.gov/doc.aspx?mcl-chap750',
    notes: 'Michigan Compiled Laws'
  },
  
  // Remaining states + territories
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

/**
 * Generate statute citation for a criminal charge
 * @param jurisdiction - Two-letter state code or 'US' for federal
 * @param code - Statute section number from charge
 * @returns Formal statute citation or null if pattern not found
 */
/**
 * Normalize charge code for specific state citation patterns
 * @param jurisdiction - Two-letter state code
 * @param code - Raw code from charge database
 * @returns Normalized code ready for citation pattern
 */
function normalizeCode(jurisdiction: string, code: string): string {
  switch (jurisdiction) {
    case "IL":
      // Illinois codes like "720-5/9-1" should become "9-1" for the pattern
      // Pattern already includes "720 ILCS 5/" prefix
      if (code.startsWith("720-5/")) {
        return code.substring(6); // Remove "720-5/" prefix
      }
      return code;
    
    case "MA":
      // Massachusetts uses chapter numbers, code might include "ch." prefix
      return code.replace(/^ch\.?\s*/i, "");
    
    case "OK":
      // Oklahoma Title 21 codes might include "21-" prefix
      return code.replace(/^21-/, "");
    
    default:
      return code;
  }
}


export function generateStatuteCitation(jurisdiction: string, code: string): string | null {
  const pattern = STATE_CITATION_PATTERNS[jurisdiction];
  
  if (!pattern) {
    console.warn(`No citation pattern found for jurisdiction: ${jurisdiction}`);
    return null;
  }
  
  try {
    const normalizedCode = normalizeCode(jurisdiction, code);
    return pattern.pattern(normalizedCode);
  } catch (error) {
    console.error(`Error generating citation for ${jurisdiction} ${code}:`, error);
    return null;
  }
}

/**
 * Generate multiple statute citations for a charge
 * (Handles cases where charge may reference multiple statutes)
 * @param jurisdiction - Two-letter state code or 'US' for federal
 * @param codes - Array of statute section numbers
 * @returns Array of formal statute citations
 */
export function generateStatuteCitations(jurisdiction: string, codes: string[]): string[] {
  return codes
    .map(code => generateStatuteCitation(jurisdiction, code))
    .filter((citation): citation is string => citation !== null);
}

/**
 * Get official .gov website URL for a jurisdiction's criminal code
 * @param jurisdiction - Two-letter state code or 'US' for federal
 * @returns Official website URL or null
 */
export function getOfficialStatuteSite(jurisdiction: string): string | null {
  const pattern = STATE_CITATION_PATTERNS[jurisdiction];
  return pattern?.officialSite || null;
}

/**
 * Get specific statute URL if available
 * (Currently only implemented for states with clean URL patterns)
 * @param jurisdiction - Two-letter state code or 'US' for federal
 * @param code - Statute section number
 * @returns Direct URL to statute or null
 */
export function getStatuteUrl(jurisdiction: string, code: string): string | null {
  // Implement state-specific URL builders for states with clean URL patterns
  
  switch (jurisdiction) {
    case 'US':
      return `https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title18-section${code}`;
    
    case 'CA':
      return `https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=${code}&lawCode=PEN`;
    
    case 'TX':
      // Texas: Official site serves chapter pages with anchor fragments
      // e.g., 19.02 → PE.19.htm#19.02, 481.115 → HS.481.htm#481.115
      if (code.startsWith('481.')) {
        const chapter = code.split('.')[0];
        return `https://statutes.capitol.texas.gov/Docs/HS/htm/HS.${chapter}.htm#${code}`;
      }
      const chapter = code.split('.')[0];
      return `https://statutes.capitol.texas.gov/Docs/PE/htm/PE.${chapter}.htm#${code}`;
    
    case 'FL':
      // Florida URLs: http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0782/0782.html
      if (code.includes('.')) {
        const [chapterStr] = code.split('.');
        const chapterNum = parseInt(chapterStr, 10);
        const chapterPadded = chapterStr.padStart(4, '0'); // e.g., 782 → 0782, 39 → 0039
        const rangeStart = Math.floor(chapterNum / 100) * 100; // e.g., 782 → 700, 39 → 0
        const rangeEnd = rangeStart + 99; // e.g., 799, 99
        const chapterRange = `${String(rangeStart).padStart(4, '0')}-${String(rangeEnd).padStart(4, '0')}`; // e.g., 0700-0799, 0000-0099
        return `http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=${chapterRange}/${chapterPadded}/${chapterPadded}.html`;
      }
      return `https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=${code}.html`;
    
    case 'NY':
      return `https://www.nysenate.gov/legislation/laws/PEN/${code}`;
    
    case 'IL':
      // Illinois: 720 ILCS 5/article-section format
      // Handle both "5/9-1" and "720-5/9-1" formats
      let ilCode = code;
      if (code.startsWith('720-5/')) {
        ilCode = code.substring(6); // Remove "720-5/" prefix
      } else if (code.startsWith('5/')) {
        ilCode = code.substring(2); // Remove "5/" prefix
      }
      return `https://www.ilga.gov/legislation/ilcs/fulltext.asp?DocName=072000050K${ilCode}`;
    
    case 'PA':
      // Pennsylvania: Different Titles (18, 35, 75)
      // Determine title and extract the section code
      let title = '18';
      let sectionCode = code;
      
      if (code.startsWith('35-')) {
        title = '35';
        sectionCode = code.replace('35-', '');
        // Title 35 uses hyphenated format: 780-113(a)(16) or 780-113.1(a)(16)
        // Split on hyphen: chapter-section(subsection)
        const parts = sectionCode.split('(')[0].split('-'); // Remove subsection, then split
        if (parts.length >= 2) {
          const chapter = parts[0];
          let section = parts[1];
          
          // Handle decimal sections (e.g., 113.1 → 113.001)
          if (section.includes('.')) {
            const [mainSec, decimal] = section.split('.');
            section = `${mainSec}.${decimal.padStart(3, '0')}`;
            return `https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/${title}/00.${chapter}.${section}..HTM`;
          }
          
          return `https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/${title}/00.${chapter}.${section}..HTM`;
        }
        // Fallback if format is unexpected
        return `https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/${title}/00.${sectionCode.split('(')[0]}..HTM`;
      } else if (code.startsWith('75-')) {
        title = '75';
        sectionCode = code.replace('75-', '');
      }
      
      // Remove subsection markers like (a) for Title 18 and 75
      const baseCode = sectionCode.split('(')[0];
      
      // Handle decimal statutes (e.g., 2709.1 → 00.027.009.001..HTM)
      if (baseCode.includes('.')) {
        const parts = baseCode.split('.');
        const mainCode = parts[0]; // e.g., "2709"
        const decimal = parts.slice(1).join('.'); // e.g., "1" or "1.2"
        
        // Split main code into chapter and section
        if (mainCode.length >= 3) {
          const chapterLen = mainCode.length - 2;
          const chapter = mainCode.substring(0, chapterLen);
          const section = mainCode.substring(chapterLen);
          // Add decimal parts
          return `https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/${title}/00.${chapter.padStart(3, '0')}.${section.padStart(3, '0')}.${decimal.padStart(3, '0')}..HTM`;
        }
      }
      
      // Numeric code - split into chapter and section
      if (baseCode.length >= 3) {
        // 3-digit (908 → ch 9, sec 08, or 143 → ch 1, sec 43)
        // 4-digit (2502 → ch 25, sec 02, or 3802 → ch 38, sec 02)
        const chapterLen = baseCode.length - 2;
        const chapter = baseCode.substring(0, chapterLen);
        const section = baseCode.substring(chapterLen);
        return `https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/${title}/00.${chapter.padStart(3, '0')}.${section.padStart(3, '0')}..HTM`;
      }
      
      // Fallback for shorter codes or unusual formats
      return `https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/${title}/00.${baseCode.padStart(3, '0')}..HTM`;
    
    case 'OH':
      return `https://codes.ohio.gov/ohio-revised-code/section-${code}`;
    
    case 'NC':
      return `https://www.ncleg.gov/EnactedLegislation/Statutes/PDF/BySection/Chapter_14/GS_${code}.pdf`;
    
    case 'MI':
      return `http://legislature.mi.gov/doc.aspx?mcl-${code}`;
    
    // Add more states as URL patterns are confirmed
    default:
      return null;
  }
}

/**
 * Enrich a criminal charge with statute citation information
 * @param charge - Criminal charge object
 * @returns Charge with added statute citation fields
 */
export function enrichChargeWithStatuteCitation(charge: {
  jurisdiction: string;
  code: string;
  [key: string]: any;
}) {
  const citation = generateStatuteCitation(charge.jurisdiction, charge.code);
  const officialSite = getOfficialStatuteSite(charge.jurisdiction);
  const statuteUrl = getStatuteUrl(charge.jurisdiction, charge.code);
  
  return {
    ...charge,
    statuteCitation: citation,
    statuteOfficialSite: officialSite,
    statuteUrl: statuteUrl,
  };
}
