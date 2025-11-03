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
export function generateStatuteCitation(jurisdiction: string, code: string): string | null {
  const pattern = STATE_CITATION_PATTERNS[jurisdiction];
  
  if (!pattern) {
    console.warn(`No citation pattern found for jurisdiction: ${jurisdiction}`);
    return null;
  }
  
  try {
    return pattern.pattern(code);
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
      // Texas URLs require chapter number (e.g., 19.02 → chapter 19)
      const chapter = code.split('.')[0];
      return `https://statutes.capitol.texas.gov/Docs/PE/htm/PE.${chapter}.htm#${code}`;
    
    case 'FL':
      // Florida URLs use chapter.section format
      return `https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=${code}.html`;
    
    case 'NY':
      return `https://www.nysenate.gov/legislation/laws/PEN/${code}`;
    
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
