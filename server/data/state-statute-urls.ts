/**
 * State Statute URL Mapping
 * 
 * Maps state codes to their official legislature website URL patterns
 * for generating direct links to statute text from citation data.
 * 
 * Each state has different URL structures - this mapping provides:
 * 1. Base URL for the state's online statute database
 * 2. URL pattern for constructing links from citation components
 * 3. Code name mappings (e.g., "Penal Code" -> "pen" for CA)
 * 
 * Sources: Official state legislature websites, verified Nov 2025
 */

export interface StateStatuteUrlConfig {
  state: string;
  stateName: string;
  baseUrl: string;
  /** Function to generate URL from citation components */
  generateUrl: (codeName: string, section: string) => string;
  /** Map of code display names to URL slugs */
  codeMapping: Record<string, string>;
  /** Notes about the URL structure or limitations */
  notes?: string;
}

/**
 * California - leginfo.legislature.ca.gov
 * URL pattern: /faces/codes_displaySection.xhtml?sectionNum={section}&lawCode={code}
 */
const californiaConfig: StateStatuteUrlConfig = {
  state: 'CA',
  stateName: 'California',
  baseUrl: 'https://leginfo.legislature.ca.gov',
  codeMapping: {
    'Penal Code': 'PEN',
    'Health & Safety Code': 'HSC',
    'Health and Safety Code': 'HSC',
    'Vehicle Code': 'VEH',
    'Welfare & Institutions Code': 'WIC',
    'Welfare and Institutions Code': 'WIC',
    'Business & Professions Code': 'BPC',
    'Business and Professions Code': 'BPC',
    'Family Code': 'FAM',
    'Civil Code': 'CIV',
  },
  generateUrl: (codeName: string, section: string) => {
    const codeSlug = californiaConfig.codeMapping[codeName] || 'PEN';
    // Remove any subsection letters for base lookup
    const baseSection = section.replace(/[a-z]$/i, '');
    return `https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=${baseSection}&lawCode=${codeSlug}`;
  },
  notes: 'California Legislative Information - official state statute database',
};

/**
 * Texas - statutes.capitol.texas.gov
 * URL pattern: /Docs/{code}/htm/{code}.{chapter}.htm (chapter-based)
 * Matches existing seed data URLs
 */
const texasConfig: StateStatuteUrlConfig = {
  state: 'TX',
  stateName: 'Texas',
  baseUrl: 'https://statutes.capitol.texas.gov',
  codeMapping: {
    'Penal Code': 'PE',
    'Transportation Code': 'TN',
    'Family Code': 'FA',
    'Health & Safety Code': 'HS',
    'Health and Safety Code': 'HS',
    'Code of Criminal Procedure': 'CR',
    'Government Code': 'GV',
  },
  generateUrl: (codeName: string, section: string) => {
    // Texas uses chapter.section format (e.g., 22.01)
    // Extract chapter number (first part before dot)
    const chapter = section.split('.')[0];
    const codeSlug = texasConfig.codeMapping[codeName] || 'PE';
    
    // Use chapter-level URLs to match seed data pattern
    // e.g., /Docs/PE/htm/PE.22.htm for section 22.01
    return `https://statutes.capitol.texas.gov/Docs/${codeSlug}/htm/${codeSlug}.${chapter}.htm`;
  },
  notes: 'Texas Constitution and Statutes - official state statute database. Uses chapter-level URLs.',
};

/**
 * Florida - leg.state.fl.us
 * URL pattern: /Statutes/index.cfm?App_mode=Display_Statute&URL={range}/{chapter}/{chapter}.html
 * Note: Links to chapter-level pages as section-level URLs are unreliable
 */
const floridaConfig: StateStatuteUrlConfig = {
  state: 'FL',
  stateName: 'Florida',
  baseUrl: 'http://www.leg.state.fl.us',
  codeMapping: {
    'Statutes': 'statutes',
  },
  generateUrl: (codeName: string, section: string) => {
    // Florida uses chapter.section format (e.g., 784.03)
    // Extract chapter number (first part before dot)
    const parts = section.split('.');
    const chapter = parseInt(parts[0], 10);
    
    // Determine century range (e.g., 784 -> 0700-0799)
    const rangeStart = Math.floor(chapter / 100) * 100;
    const rangeEnd = rangeStart + 99;
    const range = `${String(rangeStart).padStart(4, '0')}-${String(rangeEnd).padStart(4, '0')}`;
    
    // Format chapter with leading zeros
    const chapterStr = String(chapter).padStart(4, '0');
    
    return `http://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=${range}/${chapterStr}/${chapterStr}.html`;
  },
  notes: 'Florida Statutes - links to chapter pages. Official state legislature site.',
};

/**
 * New York - nysenate.gov
 * URL pattern: /legislation/laws/{CODE}/{section}
 */
const newYorkConfig: StateStatuteUrlConfig = {
  state: 'NY',
  stateName: 'New York',
  baseUrl: 'https://www.nysenate.gov',
  codeMapping: {
    'Penal Law': 'PEN',
    'Vehicle and Traffic Law': 'VAT',
    'Veh. & Traf. Law': 'VAT',
    'Criminal Procedure Law': 'CPL',
    'Crim. Proc. Law': 'CPL',
    'Family Court Act': 'FCT',
    'General Business Law': 'GBS',
    'Domestic Relations Law': 'DOM',
    'Public Health Law': 'PBH',
  },
  generateUrl: (codeName: string, section: string) => {
    const codeSlug = newYorkConfig.codeMapping[codeName] || 'PEN';
    return `https://www.nysenate.gov/legislation/laws/${codeSlug}/${section}`;
  },
  notes: 'New York State Senate - official laws database',
};

/**
 * Pennsylvania - legis.state.pa.us
 * URL pattern: /cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl={title}&div=0&chpt={chapter}&sctn={section}
 * Handles multiple titles: 18 (Crimes), 35 (Health/Safety), 42 (Judiciary), 75 (Vehicles)
 */
const pennsylvaniaConfig: StateStatuteUrlConfig = {
  state: 'PA',
  stateName: 'Pennsylvania',
  baseUrl: 'https://www.legis.state.pa.us',
  codeMapping: {
    '18': '18', // Crimes Code
    '35': '35', // Health and Safety Code
    '42': '42', // Judiciary and Judicial Procedure
    '75': '75', // Vehicle Code
    '23': '23', // Domestic Relations
    'Crimes Code': '18',
    'Vehicle Code': '75',
    'Judicial Code': '42',
    'Domestic Relations': '23',
    'Health and Safety': '35',
  },
  generateUrl: (codeName: string, section: string) => {
    const title = pennsylvaniaConfig.codeMapping[codeName] || '18';
    // PA uses § format like § 2701 (simple assault) or 780-113 (controlled substances)
    // Handle hyphenated sections (e.g., 780-113)
    const baseSection = section.replace(/\([^)]*\)/g, '').trim(); // Remove subsection parentheticals
    const sectionNum = baseSection.replace(/-/g, ''); // Remove hyphens for URL
    return `https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=${title}&div=0&chpt=0&sctn=${sectionNum}&subsctn=0`;
  },
  notes: 'Pennsylvania General Assembly - consolidated statutes. Supports titles 18, 35, 42, 75.',
};

/**
 * Illinois - ilga.gov
 * URL pattern varies by act type:
 * - Criminal Code (720 ILCS 5): /legislation/ilcs/ilcs4.asp?DocName=072000050HArt%2E+{article}&ActID=1876&ChapterID=53
 * - Vehicle Code (625 ILCS 5): /legislation/ilcs/ilcs3.asp?ActID=1815&ChapterID=49
 * - Controlled Substances (720 ILCS 570): /legislation/ilcs/ilcs3.asp?ActID=1941&ChapterID=53
 */
interface IllinoisActMapping {
  actId: string;
  chapterId: string;
  type: 'ilcs3' | 'ilcs4';
}

const illinoisActMappings: Record<string, IllinoisActMapping> = {
  '720-5': { actId: '1876', chapterId: '53', type: 'ilcs4' },       // Criminal Code
  '625-5': { actId: '1815', chapterId: '49', type: 'ilcs3' },       // Vehicle Code
  '720-550': { actId: '1937', chapterId: '53', type: 'ilcs3' },     // Cannabis Control Act
  '720-570': { actId: '1941', chapterId: '53', type: 'ilcs3' },     // Controlled Substances Act
  '750-60': { actId: '2100', chapterId: '59', type: 'ilcs3' },      // Domestic Violence Act
};

const illinoisConfig: StateStatuteUrlConfig = {
  state: 'IL',
  stateName: 'Illinois',
  baseUrl: 'https://www.ilga.gov',
  codeMapping: {
    'Criminal Code': '720-5',
    'Vehicle Code': '625-5',
    'Cannabis Control Act': '720-550',
    'Controlled Substances Act': '720-570',
    'Domestic Violence Act': '750-60',
  },
  generateUrl: (codeName: string, section: string) => {
    // Illinois ILCS format: 720 ILCS 5/12-1 -> section = "720-5/12-1"
    // Parse the section to extract chapter, act, and article
    const parts = section.split('/');
    const chapterAct = parts[0]; // e.g., "720-5"
    const sectionPart = parts[1] || ''; // e.g., "12-1" or "12-3.05"
    
    const mapping = illinoisActMappings[chapterAct];
    if (!mapping) {
      // Fallback to main search page
      return `https://www.ilga.gov/legislation/ilcs/ilcs.asp`;
    }

    if (mapping.type === 'ilcs4') {
      // Criminal Code uses article-based URLs
      // Extract article number from section (e.g., "12-1" -> article 12)
      const articleMatch = sectionPart.match(/^(\d+)/);
      const article = articleMatch ? articleMatch[1] : '1';
      const chapterNum = chapterAct.split('-')[0]; // "720"
      const actNum = chapterAct.split('-')[1]; // "5"
      const docName = `0${chapterNum}000${actNum}0HArt%2E+${article}`;
      return `https://www.ilga.gov/legislation/ilcs/ilcs4.asp?DocName=${docName}&ActID=${mapping.actId}&ChapterID=${mapping.chapterId}`;
    } else {
      // Other acts use simpler ilcs3 URLs
      return `https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=${mapping.actId}&ChapterID=${mapping.chapterId}`;
    }
  },
  notes: 'Illinois General Assembly - ILCS database with article-level URLs for Criminal Code.',
};

/**
 * Ohio - codes.ohio.gov
 * URL pattern: /ohio-revised-code/section-{section}
 * Note: Ohio URLs use dots in section numbers (matching seed data)
 */
const ohioConfig: StateStatuteUrlConfig = {
  state: 'OH',
  stateName: 'Ohio',
  baseUrl: 'https://codes.ohio.gov',
  codeMapping: {
    'Revised Code': 'ohio-revised-code',
  },
  generateUrl: (codeName: string, section: string) => {
    // Ohio uses section format like 2903.11
    // URL format keeps dots: section-2903.11
    return `https://codes.ohio.gov/ohio-revised-code/section-${section}`;
  },
  notes: 'Ohio Laws and Administrative Rules - official database',
};

/**
 * Georgia - Official GA legislature site has dynamic loading that prevents direct linking
 * Using Justia as reliable alternative (matches existing seed data)
 * URL pattern: /codes/georgia/{year}/title-{title}/chapter-{chapter}/article-{article}/section-{section}/
 * Note: Some sections have /part-N/ between article and section for subdivided articles
 */

// Georgia section-to-article mapping derived from authoritative seed data
// Format: "title-chapter-section" -> { article: string, part?: string }
const georgiaArticleMapping: Record<string, { article: string; part?: string }> = {
  // Title 16, Chapter 5 (Crimes Against the Person)
  '16-5-21': { article: '2' },     // Aggravated Assault
  '16-5-23': { article: '2' },     // Simple Battery
  '16-5-23.1': { article: '2' },   // Family Violence Battery
  '16-5-90': { article: '3' },     // Stalking
  
  // Title 16, Chapter 6 (Sexual Offenses)
  '16-6-9': { article: '2' },      // Prostitution
  
  // Title 16, Chapter 7 (Damage to Property)
  '16-7-1': { article: '1' },      // Burglary
  '16-7-21': { article: '2' },     // Criminal Trespass
  '16-7-23': { article: '2' },     // Criminal Damage 2nd Degree
  
  // Title 16, Chapter 8 (Theft)
  '16-8-2': { article: '1' },      // Theft by Taking
  '16-8-3': { article: '1' },      // Theft by Deception
  '16-8-18': { article: '1' },     // Theft of Motor Vehicle
  '16-8-41': { article: '2' },     // Armed Robbery
  
  // Title 16, Chapter 9 (Forgery and Fraud)
  '16-9-1': { article: '1' },      // Forgery 1st Degree
  '16-9-121': { article: '6' },    // Identity Fraud
  
  // Title 16, Chapter 10 (Offenses Against Public Administration)
  '16-10-24': { article: '2' },    // Obstruction of Officer
  
  // Title 16, Chapter 11 (Offenses Against Public Order)
  '16-11-39': { article: '2' },    // Disorderly Conduct
  '16-11-126': { article: '4', part: '2' },  // Carrying Concealed Weapon
  
  // Title 16, Chapter 13 (Controlled Substances)
  '16-13-30': { article: '2', part: '1' },   // Possession
  '16-13-31': { article: '2', part: '4' },   // Trafficking
  
  // Title 40, Chapter 6 (Motor Vehicles)
  '40-6-391': { article: '15' },   // DUI
};

const georgiaConfig: StateStatuteUrlConfig = {
  state: 'GA',
  stateName: 'Georgia',
  baseUrl: 'https://law.justia.com/codes/georgia',
  codeMapping: {
    'Code': 'title',
  },
  generateUrl: (codeName: string, section: string) => {
    // Georgia uses Title-Chapter-Section format (e.g., § 16-5-1, § 16-8-18)
    const parts = section.split('-');
    const title = parts[0];
    const chapter = parts[1] || '1';
    const sectionNum = parts.slice(2).join('-'); // Handle sections like 16-5-23.1
    
    // Look up exact article mapping from seed data
    const fullSection = `${title}-${chapter}-${sectionNum}`;
    const mapping = georgiaArticleMapping[fullSection];
    
    if (mapping) {
      // Use authoritative mapping from seed data
      let url = `https://law.justia.com/codes/georgia/2021/title-${title}/chapter-${chapter}/article-${mapping.article}`;
      if (mapping.part) {
        url += `/part-${mapping.part}`;
      }
      url += `/section-${section}/`;
      return url;
    }
    
    // Fallback: Default article patterns based on chapter analysis
    // Article 1 is typically general provisions, Article 2 is often specific offenses
    const defaultArticle = chapter;
    return `https://law.justia.com/codes/georgia/2021/title-${title}/chapter-${chapter}/article-${defaultArticle}/section-${section}/`;
  },
  notes: 'Uses Justia for Georgia - official GA legislature site uses dynamic loading that prevents direct section linking. Section-to-article mapping derived from authoritative seed data.',
};

/**
 * North Carolina - ncleg.gov
 * URL pattern: /EnactedLegislation/Statutes/PDF/BySection/Chapter_{chapter}/GS_{section}.pdf
 * Note: URLs link to PDF format and use base section (no subsections like (c) or (c)(2))
 */
const northCarolinaConfig: StateStatuteUrlConfig = {
  state: 'NC',
  stateName: 'North Carolina',
  baseUrl: 'https://www.ncleg.gov',
  codeMapping: {
    'General Statutes': 'GS',
  },
  generateUrl: (codeName: string, section: string) => {
    // NC uses format like § 14-33 (chapter-section)
    // Strip subsection suffixes like (c), (c)(2), (h) - they reference the same PDF
    const baseSection = section.replace(/\([^)]+\)/g, '');
    const parts = baseSection.split('-');
    const chapter = parts[0];
    return `https://www.ncleg.gov/EnactedLegislation/Statutes/PDF/BySection/Chapter_${chapter}/GS_${baseSection}.pdf`;
  },
  notes: 'North Carolina General Assembly - official statutes (PDF format)',
};

/**
 * Michigan - legislature.mi.gov
 * URL pattern: /mileg.aspx?page=getObject&objectName=mcl-{section-with-hyphens}
 * Note: Section dots converted to hyphens (750.81 -> 750-81), subsections stripped
 */
const michiganConfig: StateStatuteUrlConfig = {
  state: 'MI',
  stateName: 'Michigan',
  baseUrl: 'http://www.legislature.mi.gov',
  codeMapping: {
    'Compiled Laws': 'mcl',
    'Penal Code': 'mcl',
    'Vehicle Code': 'mcl',
  },
  generateUrl: (codeName: string, section: string) => {
    // Michigan uses MCL format like 750.81 (chapter.section)
    // Strip subsection suffixes like (2) - they reference the same law
    const baseSection = section.replace(/\([^)]+\)/g, '');
    // Convert dots to hyphens for URL format (750.81 -> 750-81)
    const hyphenatedSection = baseSection.replace(/\./g, '-');
    return `http://www.legislature.mi.gov/mileg.aspx?page=getObject&objectName=mcl-${hyphenatedSection}`;
  },
  notes: 'Michigan Legislature - Michigan Compiled Laws (using mileg.aspx object API)',
};

/**
 * Federal - uscode.house.gov
 * URL pattern: /view.xhtml?req=(title:{title}%20section:{section})
 */
const federalConfig: StateStatuteUrlConfig = {
  state: 'FED',
  stateName: 'Federal',
  baseUrl: 'https://uscode.house.gov',
  codeMapping: {
    'U.S.C.': 'usc',
    'USC': 'usc',
  },
  generateUrl: (codeName: string, section: string) => {
    // Federal uses Title X, Section Y format
    // Most criminal statutes are Title 18
    return `https://uscode.house.gov/view.xhtml?req=(title:18%20section:${section})&f=treesort&num=0`;
  },
  notes: 'U.S. Code from the Office of Law Revision Counsel',
};

/**
 * All state configurations
 */
export const stateStatuteConfigs: Record<string, StateStatuteUrlConfig> = {
  CA: californiaConfig,
  TX: texasConfig,
  FL: floridaConfig,
  NY: newYorkConfig,
  PA: pennsylvaniaConfig,
  IL: illinoisConfig,
  OH: ohioConfig,
  GA: georgiaConfig,
  NC: northCarolinaConfig,
  MI: michiganConfig,
  FED: federalConfig,
};

/**
 * Parse a citation string into components
 * Examples:
 * - "Cal. Penal Code § 242" -> { state: 'CA', code: 'Penal Code', section: '242', baseSection: '242' }
 * - "Tex. Penal Code § 22.01" -> { state: 'TX', code: 'Penal Code', section: '22.01', baseSection: '22.01' }
 * - "Fla. Stat. § 784.03" -> { state: 'FL', code: 'Statutes', section: '784.03', baseSection: '784.03' }
 * - "Fla. Stat. § 812.014(2)(c)" -> { state: 'FL', code: 'Statutes', section: '812.014(2)(c)', baseSection: '812.014' }
 * - "Cal. Penal Code § 243(e)(1)" -> { state: 'CA', code: 'Penal Code', section: '243(e)(1)', baseSection: '243' }
 */
export interface ParsedCitation {
  state: string;
  code: string;
  section: string;
  /** Base section without subsection suffixes (e.g., '243' from '243(e)(1)') */
  baseSection: string;
  /** Subsection suffix if any (e.g., '(e)(1)' from '243(e)(1)') */
  subsection?: string;
  originalCitation: string;
}

/**
 * Extract base section number from section with possible subsections
 * Examples:
 * - "242" -> { base: "242", subsection: undefined }
 * - "243(e)(1)" -> { base: "243", subsection: "(e)(1)" }
 * - "812.014(2)(c)" -> { base: "812.014", subsection: "(2)(c)" }
 * - "22.01" -> { base: "22.01", subsection: undefined }
 * - "16-5-23" -> { base: "16-5-23", subsection: undefined } (Georgia full section)
 * - "780-113(a)(30)" -> { base: "780-113", subsection: "(a)(30)" }
 */
function extractBaseSection(section: string): { base: string; subsection?: string } {
  // Match base section (numbers with optional dots and hyphens) and optional subsection (parenthetical)
  // For Georgia: 16-5-23 is a complete section reference (Title 16, Chapter 5, Section 23)
  const match = section.match(/^([\d]+(?:[.-][\d]+)*)((?:\([^)]+\))*)$/);
  if (match) {
    const base = match[1];
    const subsection = match[2] && match[2].trim() ? match[2].trim() : undefined;
    return { base, subsection };
  }
  return { base: section };
}

const stateAbbreviations: Record<string, string> = {
  'Cal.': 'CA',
  'Tex.': 'TX',
  'Fla.': 'FL',
  'N.Y.': 'NY',
  'Pa.': 'PA',
  'Ill.': 'IL',
  'Ohio': 'OH',
  'Ga.': 'GA',
  'N.C.': 'NC',
  'Mich.': 'MI',
  '18 U.S.C.': 'FED',
};

export function parseCitation(citation: string): ParsedCitation | null {
  // Helper to build ParsedCitation with baseSection extraction
  function buildResult(state: string, code: string, section: string): ParsedCitation {
    const { base, subsection } = extractBaseSection(section);
    return {
      state,
      code,
      section,
      baseSection: base,
      subsection,
      originalCitation: citation,
    };
  }

  // Try California format: "Cal. Penal Code § 242" or "Cal. Health & Safety Code § 11350"
  let match = citation.match(/^Cal\.\s+(.+?)\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('CA', match[1].trim(), match[2].trim());
  }

  // Try Texas format: "Tex. Penal Code § 22.01"
  match = citation.match(/^Tex\.\s+(.+?)\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('TX', match[1].trim(), match[2].trim());
  }

  // Try Florida format: "Fla. Stat. § 784.03" or "Fla. Stat. § 812.014(2)(c)"
  match = citation.match(/^Fla\.\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('FL', 'Statutes', match[1].trim());
  }

  // Try New York format: "N.Y. Penal Law § 120.00"
  match = citation.match(/^N\.Y\.\s+(.+?)\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('NY', match[1].trim(), match[2].trim());
  }

  // Try Pennsylvania format: "18 Pa.C.S. § 2701", "35 Pa.C.S. § 780-113", "75 Pa.C.S. § 3802"
  match = citation.match(/^(\d+)\s+Pa\.C\.S\.\s+§\s*(.+)$/i);
  if (match) {
    const title = match[1];
    const section = match[2].trim();
    // Map title number to code name
    const codeNames: Record<string, string> = {
      '18': '18', // Crimes Code
      '35': '35', // Health and Safety
      '42': '42', // Judiciary
      '75': '75', // Vehicle Code
      '23': '23', // Domestic Relations
    };
    return buildResult('PA', codeNames[title] || title, section);
  }

  // Try Illinois format: "720 ILCS 5/12-1"
  match = citation.match(/^(\d+)\s+ILCS\s+(\d+)\/(.+)$/i);
  if (match) {
    return buildResult('IL', 'Criminal Code', `${match[1]}-${match[2]}/${match[3]}`);
  }

  // Try Ohio format: "Ohio Rev. Code § 2903.11"
  match = citation.match(/^Ohio\s+Rev\.\s+Code\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('OH', 'Revised Code', match[1].trim());
  }

  // Try Georgia format: "Ga. Code § 16-5-1" or "O.C.G.A. § 16-5-1"
  match = citation.match(/^(?:Ga\.\s+Code|O\.C\.G\.A\.)\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('GA', 'Code', match[1].trim());
  }

  // Try North Carolina format: "N.C. Gen. Stat. § 14-33"
  match = citation.match(/^N\.C\.\s+Gen\.\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('NC', 'General Statutes', match[1].trim());
  }

  // Try Michigan format: "Mich. Comp. Laws § 750.81"
  match = citation.match(/^Mich\.\s+Comp\.\s+Laws\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('MI', 'Compiled Laws', match[1].trim());
  }

  // Try Federal format: "18 U.S.C. § 1111"
  match = citation.match(/^18\s+U\.S\.C\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('FED', 'U.S.C.', match[1].trim());
  }

  return null;
}

/**
 * Generate a URL for a given citation
 * Returns null if the citation cannot be parsed or the state is not supported
 */
export function generateStatuteUrl(citation: string): string | null {
  const parsed = parseCitation(citation);
  if (!parsed) {
    console.warn(`[StatuteUrls] Could not parse citation: ${citation}`);
    return null;
  }

  const config = stateStatuteConfigs[parsed.state];
  if (!config) {
    console.warn(`[StatuteUrls] No URL config for state: ${parsed.state}`);
    return null;
  }

  try {
    return config.generateUrl(parsed.code, parsed.section);
  } catch (error) {
    console.error(`[StatuteUrls] Error generating URL for ${citation}:`, error);
    return null;
  }
}

/**
 * Generate URLs for all statutes in the seed data
 * Returns a map of citation -> URL
 */
export function generateAllStatuteUrls(
  statutes: Array<{ citation: string; jurisdiction: string }>
): Map<string, string> {
  const urlMap = new Map<string, string>();

  for (const statute of statutes) {
    const url = generateStatuteUrl(statute.citation);
    if (url) {
      urlMap.set(statute.citation, url);
    }
  }

  return urlMap;
}

/**
 * Verify generated URLs against existing seed data URLs
 * Returns a list of mismatches for debugging
 */
export interface UrlVerificationResult {
  citation: string;
  existingUrl: string;
  generatedUrl: string | null;
  matches: boolean;
  notes?: string;
}

export function verifyStatuteUrls(
  statutes: Array<{ citation: string; jurisdiction: string; url?: string | null }>
): {
  total: number;
  matched: number;
  mismatched: number;
  unparseable: number;
  mismatches: UrlVerificationResult[];
} {
  const results: UrlVerificationResult[] = [];
  let matched = 0;
  let mismatched = 0;
  let unparseable = 0;

  for (const statute of statutes) {
    const existingUrl = statute.url || '';
    const generatedUrl = generateStatuteUrl(statute.citation);

    if (!generatedUrl) {
      unparseable++;
      results.push({
        citation: statute.citation,
        existingUrl,
        generatedUrl: null,
        matches: false,
        notes: 'Could not parse citation',
      });
      continue;
    }

    // Normalize URLs for comparison (lowercase, remove trailing slashes)
    const normalizedExisting = existingUrl.toLowerCase().replace(/\/$/, '');
    const normalizedGenerated = generatedUrl.toLowerCase().replace(/\/$/, '');

    // Check if they match or are equivalent (same base URL pattern)
    const matches = normalizedExisting === normalizedGenerated ||
      // Allow matches where seed uses chapter-level URL and generator produces same
      normalizedExisting.includes(normalizedGenerated.split('?')[0]) ||
      normalizedGenerated.includes(normalizedExisting.split('?')[0]);

    if (matches) {
      matched++;
    } else {
      mismatched++;
      results.push({
        citation: statute.citation,
        existingUrl,
        generatedUrl,
        matches: false,
        notes: 'URL pattern differs',
      });
    }
  }

  return {
    total: statutes.length,
    matched,
    mismatched,
    unparseable,
    mismatches: results.filter(r => !r.matches),
  };
}
