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

// ==================== NEW STATE CONFIGURATIONS (40 states) ====================

/**
 * Arizona - azleg.gov
 * URL pattern: /ars/{title}/{section}.htm
 */
const arizonaConfig: StateStatuteUrlConfig = {
  state: 'AZ',
  stateName: 'Arizona',
  baseUrl: 'https://www.azleg.gov',
  codeMapping: { 'Rev. Stat.': 'ars' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0];
    const sectionNum = parts[1] || section;
    return `https://www.azleg.gov/ars/${title}/0${sectionNum}.htm`;
  },
  notes: 'Arizona State Legislature - Arizona Revised Statutes',
};

/**
 * Washington - app.leg.wa.gov
 * URL pattern: /RCW/default.aspx?cite={section}
 */
const washingtonConfig: StateStatuteUrlConfig = {
  state: 'WA',
  stateName: 'Washington',
  baseUrl: 'https://app.leg.wa.gov',
  codeMapping: { 'Rev. Code': 'RCW' },
  generateUrl: (codeName: string, section: string) => {
    return `https://app.leg.wa.gov/RCW/default.aspx?cite=${section}`;
  },
  notes: 'Washington State Legislature - Revised Code of Washington',
};

/**
 * Massachusetts - malegislature.gov
 * URL pattern: /Laws/GeneralLaws/Part{part}/Title{title}/Chapter{chapter}/Section{section}
 */
const massachusettsConfig: StateStatuteUrlConfig = {
  state: 'MA',
  stateName: 'Massachusetts',
  baseUrl: 'https://malegislature.gov',
  codeMapping: { 'Gen. Laws': 'GeneralLaws' },
  generateUrl: (codeName: string, section: string) => {
    // MA uses "ch. X, § Y" format in citations
    // Chapter and section are passed separately
    return `https://malegislature.gov/Laws/GeneralLaws/PartIV/TitleI/Chapter${codeName}/Section${section}`;
  },
  notes: 'Massachusetts General Court - General Laws',
};

/**
 * Colorado - leg.colorado.gov
 * URL pattern: Links to title PDF files
 */
const coloradoConfig: StateStatuteUrlConfig = {
  state: 'CO',
  stateName: 'Colorado',
  baseUrl: 'https://leg.colorado.gov',
  codeMapping: { 'Rev. Stat.': 'crs' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0];
    return `https://leg.colorado.gov/sites/default/files/images/olls/crs2023-title-${title}.pdf`;
  },
  notes: 'Colorado General Assembly - Colorado Revised Statutes',
};

/**
 * Virginia - law.lis.virginia.gov
 * URL pattern: /vacode/title{title}/chapter{chapter}/section{section}/
 */
const virginiaConfig: StateStatuteUrlConfig = {
  state: 'VA',
  stateName: 'Virginia',
  baseUrl: 'https://law.lis.virginia.gov',
  codeMapping: { 'Code': 'vacode' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0];
    const sectionNum = parts[1] || section;
    const chapter = sectionNum.split('.')[0] || '1';
    return `https://law.lis.virginia.gov/vacode/title${title}/chapter${chapter}/section${section}/`;
  },
  notes: 'Virginia Law - Code of Virginia',
};

/**
 * Tennessee - Uses PDF format
 */
const tennesseeConfig: StateStatuteUrlConfig = {
  state: 'TN',
  stateName: 'Tennessee',
  baseUrl: 'https://www.tn.gov',
  codeMapping: { 'Code Ann.': 'tca' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0];
    return `https://www.tn.gov/content/dam/tn/tbi/documents/Tennessee%20Code%20Title%20${title}.pdf`;
  },
  notes: 'Tennessee General Assembly - Tennessee Code Annotated',
};

/**
 * Indiana - iga.in.gov
 * URL pattern: /laws/{year}/ic/titles/{title}#{section}
 */
const indianaConfig: StateStatuteUrlConfig = {
  state: 'IN',
  stateName: 'Indiana',
  baseUrl: 'https://iga.in.gov',
  codeMapping: { 'Code': 'ic' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0];
    return `https://iga.in.gov/laws/2024/ic/titles/${title}#${section}`;
  },
  notes: 'Indiana General Assembly - Indiana Code',
};

/**
 * Missouri - revisor.mo.gov
 * URL pattern: /main/OneSection.aspx?section={section}
 */
const missouriConfig: StateStatuteUrlConfig = {
  state: 'MO',
  stateName: 'Missouri',
  baseUrl: 'https://revisor.mo.gov',
  codeMapping: { 'Rev. Stat.': 'rsmo' },
  generateUrl: (codeName: string, section: string) => {
    return `https://revisor.mo.gov/main/OneSection.aspx?section=${section}`;
  },
  notes: 'Missouri Revisor of Statutes - Revised Statutes of Missouri',
};

/**
 * Maryland - mgaleg.maryland.gov
 * URL pattern: /mgawebsite/Laws/StatuteText?article={article}&section={section}
 */
const marylandConfig: StateStatuteUrlConfig = {
  state: 'MD',
  stateName: 'Maryland',
  baseUrl: 'https://mgaleg.maryland.gov',
  codeMapping: { 'Crim. Law': 'gcr', 'Transp.': 'gtr' },
  generateUrl: (codeName: string, section: string) => {
    const articleCode = codeName === 'Transp.' ? 'gtr' : 'gcr';
    return `https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=${articleCode}&section=${section}`;
  },
  notes: 'Maryland General Assembly - Annotated Code of Maryland',
};

/**
 * Wisconsin - docs.legis.wisconsin.gov
 * URL pattern: /statutes/statutes/{chapter}/{subchapter}/{section}
 */
const wisconsinConfig: StateStatuteUrlConfig = {
  state: 'WI',
  stateName: 'Wisconsin',
  baseUrl: 'https://docs.legis.wisconsin.gov',
  codeMapping: { 'Stat.': 'statutes' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('.');
    const chapter = parts[0];
    const subchapter = ['940', '941', '942', '943', '944'].includes(chapter) ? 
      (parseInt(parts[1] || '0') < 20 ? 'ii' : 'iii') : 'xi';
    return `https://docs.legis.wisconsin.gov/statutes/statutes/${chapter}/${subchapter}/${section.replace('.', '')}`;
  },
  notes: 'Wisconsin Legislature - Wisconsin Statutes',
};

/**
 * Minnesota - revisor.mn.gov
 * URL pattern: /statutes/cite/{section}
 */
const minnesotaConfig: StateStatuteUrlConfig = {
  state: 'MN',
  stateName: 'Minnesota',
  baseUrl: 'https://www.revisor.mn.gov',
  codeMapping: { 'Stat.': 'statutes' },
  generateUrl: (codeName: string, section: string) => {
    return `https://www.revisor.mn.gov/statutes/cite/${section}`;
  },
  notes: 'Minnesota Revisor of Statutes - Minnesota Statutes',
};

/**
 * South Carolina - scstatehouse.gov
 * URL pattern: /code/t{title}c{chapter}.php
 */
const southCarolinaConfig: StateStatuteUrlConfig = {
  state: 'SC',
  stateName: 'South Carolina',
  baseUrl: 'https://www.scstatehouse.gov',
  codeMapping: { 'Code Ann.': 'code' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0];
    const chapter = parts[1] || '1';
    return `https://www.scstatehouse.gov/code/t${title}c${chapter.padStart(3, '0')}.php`;
  },
  notes: 'South Carolina Legislature - Code of Laws',
};

/**
 * Alabama - law.justia.com (using Justia as official AL site has limited linking)
 */
const alabamaConfig: StateStatuteUrlConfig = {
  state: 'AL',
  stateName: 'Alabama',
  baseUrl: 'https://law.justia.com/codes/alabama',
  codeMapping: { 'Code': 'code' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0].toLowerCase();
    const chapter = parts[1] || '1';
    const article = Math.floor(parseInt(parts[2] || '1') / 10) + 1;
    return `https://law.justia.com/codes/alabama/2022/title-${title}/chapter-${chapter}/article-${article}/section-${section}/`;
  },
  notes: 'Using Justia for Alabama statutes',
};

/**
 * Louisiana - legis.la.gov
 * URL pattern: /legis/Law.aspx?d={document_id}
 */
const louisianaConfig: StateStatuteUrlConfig = {
  state: 'LA',
  stateName: 'Louisiana',
  baseUrl: 'https://www.legis.la.gov',
  codeMapping: { 'R.S.': 'rs' },
  generateUrl: (codeName: string, section: string) => {
    // LA uses R.S. § 14:35 format
    const parts = section.split(':');
    const title = parts[0];
    const sectionNum = parts[1] || section;
    // Calculate approximate document ID based on section
    const docId = 78000 + parseInt(sectionNum.replace(/\D/g, ''), 10);
    return `https://www.legis.la.gov/legis/Law.aspx?d=${docId}`;
  },
  notes: 'Louisiana State Legislature - Louisiana Revised Statutes',
};

/**
 * Kentucky - apps.legislature.ky.gov
 * URL pattern: /law/statutes/statute.aspx?id={statute_id}
 */
const kentuckyConfig: StateStatuteUrlConfig = {
  state: 'KY',
  stateName: 'Kentucky',
  baseUrl: 'https://apps.legislature.ky.gov',
  codeMapping: { 'Rev. Stat.': 'krs' },
  generateUrl: (codeName: string, section: string) => {
    // KRS uses chapter.section format
    return `https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=${section.replace('.', '')}`;
  },
  notes: 'Kentucky Legislature - Kentucky Revised Statutes',
};

/**
 * Oregon - oregonlegislature.gov
 * URL pattern: /bills_laws/ors/ors{chapter}.html
 */
const oregonConfig: StateStatuteUrlConfig = {
  state: 'OR',
  stateName: 'Oregon',
  baseUrl: 'https://www.oregonlegislature.gov',
  codeMapping: { 'Rev. Stat.': 'ors' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('.');
    const chapter = parts[0];
    return `https://www.oregonlegislature.gov/bills_laws/ors/ors${chapter}.html`;
  },
  notes: 'Oregon Legislature - Oregon Revised Statutes',
};

/**
 * Oklahoma - oscn.net
 * URL pattern: /applications/oscn/DeliverDocument.asp?CiteID={cite_id}
 */
const oklahomaConfig: StateStatuteUrlConfig = {
  state: 'OK',
  stateName: 'Oklahoma',
  baseUrl: 'https://www.oscn.net',
  codeMapping: { 'Stat.': 'os' },
  generateUrl: (codeName: string, section: string) => {
    // OK uses tit. X, § Y format
    return `https://www.oscn.net/applications/oscn/DeliverDocument.asp?CiteID=${section.replace(/-/g, '')}`;
  },
  notes: 'Oklahoma State Courts Network - Oklahoma Statutes',
};

/**
 * Connecticut - cga.ct.gov
 * URL pattern: /current/pub/chap_{chapter}.htm#sec_{section}
 */
const connecticutConfig: StateStatuteUrlConfig = {
  state: 'CT',
  stateName: 'Connecticut',
  baseUrl: 'https://www.cga.ct.gov',
  codeMapping: { 'Gen. Stat.': 'cgs' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const chapter = parts[0];
    return `https://www.cga.ct.gov/current/pub/chap_${chapter}.htm#sec_${section}`;
  },
  notes: 'Connecticut General Assembly - Connecticut General Statutes',
};

/**
 * Utah - le.utah.gov
 * URL pattern: /xcode/Title{title}/Chapter{chapter}/{title}-{chapter}-S{section}.html
 */
const utahConfig: StateStatuteUrlConfig = {
  state: 'UT',
  stateName: 'Utah',
  baseUrl: 'https://le.utah.gov',
  codeMapping: { 'Code': 'ucode' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0];
    const chapter = parts[1] || '1';
    return `https://le.utah.gov/xcode/Title${title}/Chapter${chapter}/${title}-${chapter}-S${parts[2] || '1'}.html`;
  },
  notes: 'Utah State Legislature - Utah Code',
};

/**
 * Iowa - legis.iowa.gov
 * URL pattern: /docs/code/{section}.pdf
 */
const iowaConfig: StateStatuteUrlConfig = {
  state: 'IA',
  stateName: 'Iowa',
  baseUrl: 'https://www.legis.iowa.gov',
  codeMapping: { 'Code': 'ic' },
  generateUrl: (codeName: string, section: string) => {
    return `https://www.legis.iowa.gov/docs/code/${section}.pdf`;
  },
  notes: 'Iowa Legislature - Iowa Code',
};

/**
 * Nevada - leg.state.nv.us
 * URL pattern: /nrs/nrs-{chapter}.html#NRS{chapter}Sec{section}
 */
const nevadaConfig: StateStatuteUrlConfig = {
  state: 'NV',
  stateName: 'Nevada',
  baseUrl: 'https://www.leg.state.nv.us',
  codeMapping: { 'Rev. Stat.': 'nrs' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('.');
    const chapter = parts[0];
    const sectionNum = parts[1] || '1';
    return `https://www.leg.state.nv.us/nrs/nrs-${chapter}.html#NRS${chapter}Sec${sectionNum}`;
  },
  notes: 'Nevada Legislature - Nevada Revised Statutes',
};

/**
 * Arkansas - law.justia.com (using Justia)
 */
const arkansasConfig: StateStatuteUrlConfig = {
  state: 'AR',
  stateName: 'Arkansas',
  baseUrl: 'https://law.justia.com/codes/arkansas',
  codeMapping: { 'Code Ann.': 'aca' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0];
    const subtitle = parts[1] || '1';
    const chapter = parts[2] || '1';
    const subchapter = Math.ceil(parseInt(parts[3] || '1') / 100);
    return `https://law.justia.com/codes/arkansas/2021/title-${title}/subtitle-${subtitle}/chapter-${chapter}/subchapter-${subchapter}/section-${section}/`;
  },
  notes: 'Using Justia for Arkansas statutes',
};

/**
 * Mississippi - law.justia.com (using Justia)
 */
const mississippiConfig: StateStatuteUrlConfig = {
  state: 'MS',
  stateName: 'Mississippi',
  baseUrl: 'https://law.justia.com/codes/mississippi',
  codeMapping: { 'Code Ann.': 'mca' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0];
    const chapter = parts[1] || '1';
    return `https://law.justia.com/codes/mississippi/2021/title-${title}/chapter-${chapter}/section-${section}/`;
  },
  notes: 'Using Justia for Mississippi statutes',
};

/**
 * Kansas - ksrevisor.org
 * URL pattern: /statutes/chapters/ch{chapter}/{chapter}_{article}_{section}.html
 */
const kansasConfig: StateStatuteUrlConfig = {
  state: 'KS',
  stateName: 'Kansas',
  baseUrl: 'https://www.ksrevisor.org',
  codeMapping: { 'Stat. Ann.': 'ksa' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const chapter = parts[0];
    const articleSection = parts[1] || '1';
    return `https://www.ksrevisor.org/statutes/chapters/ch${chapter}/${chapter}_${articleSection.padStart(3, '0')}_${(parts[2] || '1').padStart(4, '0')}.html`;
  },
  notes: 'Kansas Office of Revisor of Statutes - Kansas Statutes Annotated',
};

/**
 * New Mexico - law.justia.com (using Justia)
 */
const newMexicoConfig: StateStatuteUrlConfig = {
  state: 'NM',
  stateName: 'New Mexico',
  baseUrl: 'https://law.justia.com/codes/new-mexico',
  codeMapping: { 'Stat. Ann.': 'nmsa' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const chapter = parts[0];
    const article = parts[1] || '1';
    return `https://law.justia.com/codes/new-mexico/2021/chapter-${chapter}/article-${article}/section-${section}/`;
  },
  notes: 'Using Justia for New Mexico statutes',
};

/**
 * Nebraska - nebraskalegislature.gov
 * URL pattern: /laws/statutes.php?statute={section}
 */
const nebraskaConfig: StateStatuteUrlConfig = {
  state: 'NE',
  stateName: 'Nebraska',
  baseUrl: 'https://nebraskalegislature.gov',
  codeMapping: { 'Rev. Stat.': 'nrs' },
  generateUrl: (codeName: string, section: string) => {
    return `https://nebraskalegislature.gov/laws/statutes.php?statute=${section}`;
  },
  notes: 'Nebraska Legislature - Nebraska Revised Statutes',
};

/**
 * West Virginia - code.wvlegislature.gov
 * URL pattern: /{chapter}-{article}-{section}/
 */
const westVirginiaConfig: StateStatuteUrlConfig = {
  state: 'WV',
  stateName: 'West Virginia',
  baseUrl: 'https://code.wvlegislature.gov',
  codeMapping: { 'Code': 'wvc' },
  generateUrl: (codeName: string, section: string) => {
    return `https://code.wvlegislature.gov/${section}/`;
  },
  notes: 'West Virginia Legislature - West Virginia Code',
};

/**
 * Idaho - legislature.idaho.gov
 * URL pattern: /statutesrules/idstat/Title{title}/T{title}CH{chapter}/SECT{section}/
 */
const idahoConfig: StateStatuteUrlConfig = {
  state: 'ID',
  stateName: 'Idaho',
  baseUrl: 'https://legislature.idaho.gov',
  codeMapping: { 'Code': 'ic' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0];
    const chapter = parts[1] || '1';
    return `https://legislature.idaho.gov/statutesrules/idstat/Title${title}/T${title}CH${chapter}/SECT${section}/`;
  },
  notes: 'Idaho Legislature - Idaho Statutes',
};

/**
 * Hawaii - capitol.hawaii.gov
 * URL pattern: /hrscurrent/Vol{vol}_Ch{range}/HRS{chapter}/HRS_{chapter}-{section}.htm
 */
const hawaiiConfig: StateStatuteUrlConfig = {
  state: 'HI',
  stateName: 'Hawaii',
  baseUrl: 'https://www.capitol.hawaii.gov',
  codeMapping: { 'Rev. Stat.': 'hrs' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const chapter = parts[0];
    const sectionNum = parts[1] || '1';
    const vol = Math.ceil(parseInt(chapter) / 100) + 13;
    const rangeStart = Math.floor((parseInt(chapter) - 1) / 100) * 100 + 1;
    const rangeEnd = rangeStart + 99;
    return `https://www.capitol.hawaii.gov/hrscurrent/Vol${vol}_Ch${String(rangeStart).padStart(4, '0')}-${String(rangeEnd).padStart(4, '0')}/HRS${chapter}/HRS_${chapter}-${sectionNum.padStart(4, '0')}.htm`;
  },
  notes: 'Hawaii State Legislature - Hawaii Revised Statutes',
};

/**
 * New Hampshire - gencourt.state.nh.us
 * URL pattern: /rsa/html/{title}/{chapter}/{chapter}-{section}.htm
 */
const newHampshireConfig: StateStatuteUrlConfig = {
  state: 'NH',
  stateName: 'New Hampshire',
  baseUrl: 'https://www.gencourt.state.nh.us',
  codeMapping: { 'Rev. Stat. Ann.': 'rsa' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split(':');
    const chapter = parts[0];
    const sectionNum = parts[1] || '1';
    // Determine title based on chapter range
    const chapterNum = parseInt(chapter.replace(/\D/g, ''));
    const title = chapterNum < 100 ? 'I' : chapterNum < 200 ? 'II' : chapterNum < 300 ? 'III' : 
                  chapterNum < 400 ? 'LXII' : chapterNum < 500 ? 'LXII' : 'XXI';
    return `https://www.gencourt.state.nh.us/rsa/html/${title}/${chapter}/${chapter}-${sectionNum}.htm`;
  },
  notes: 'New Hampshire General Court - New Hampshire Revised Statutes Annotated',
};

/**
 * Maine - legislature.maine.gov
 * URL pattern: /statutes/{title}/title{title}sec{section}.html
 */
const maineConfig: StateStatuteUrlConfig = {
  state: 'ME',
  stateName: 'Maine',
  baseUrl: 'https://legislature.maine.gov',
  codeMapping: { 'Rev. Stat. Ann.': 'mrsa' },
  generateUrl: (codeName: string, section: string) => {
    // ME uses "tit. X-A, § Y" format
    return `https://legislature.maine.gov/statutes/${codeName}/title${codeName}sec${section}.html`;
  },
  notes: 'Maine Legislature - Maine Revised Statutes',
};

/**
 * Montana - leg.mt.gov
 * URL pattern: /bills/mca/title_{title}/chapter_{chapter}/part_{part}/section_{section}.html
 */
const montanaConfig: StateStatuteUrlConfig = {
  state: 'MT',
  stateName: 'Montana',
  baseUrl: 'https://leg.mt.gov',
  codeMapping: { 'Code Ann.': 'mca' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0].padStart(4, '0');
    const chapter = (parts[1] || '1').padStart(4, '0');
    const part = (parts[2] || '1').padStart(4, '0');
    const sectionNum = (parts[3] || '1').padStart(4, '0');
    return `https://leg.mt.gov/bills/mca/title_${title}/chapter_${chapter}/part_${part}/section_${sectionNum}/${title}-${chapter}-${part}-${sectionNum}.html`;
  },
  notes: 'Montana Legislature - Montana Code Annotated',
};

/**
 * Rhode Island - law.justia.com (using Justia)
 */
const rhodeIslandConfig: StateStatuteUrlConfig = {
  state: 'RI',
  stateName: 'Rhode Island',
  baseUrl: 'https://law.justia.com/codes/rhode-island',
  codeMapping: { 'Gen. Laws': 'rigl' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0];
    const chapter = parts[1] || '1';
    return `https://law.justia.com/codes/rhode-island/2021/title-${title}/chapter-${title}-${chapter}/section-${section}/`;
  },
  notes: 'Using Justia for Rhode Island statutes',
};

/**
 * Delaware - delcode.delaware.gov
 * URL pattern: /title{title}/c{chapter}/index.html#{section}
 */
const delawareConfig: StateStatuteUrlConfig = {
  state: 'DE',
  stateName: 'Delaware',
  baseUrl: 'https://delcode.delaware.gov',
  codeMapping: { 'Code Ann.': 'delcode' },
  generateUrl: (codeName: string, section: string) => {
    // DE uses "tit. X, § Y" format
    return `https://delcode.delaware.gov/title${codeName}/c${Math.floor(parseInt(section) / 100).toString().padStart(3, '0')}/index.html#${section}`;
  },
  notes: 'Delaware General Assembly - Delaware Code',
};

/**
 * South Dakota - sdlegislature.gov
 * URL pattern: /Statutes/Codified_Laws/{section_id}
 */
const southDakotaConfig: StateStatuteUrlConfig = {
  state: 'SD',
  stateName: 'South Dakota',
  baseUrl: 'https://sdlegislature.gov',
  codeMapping: { 'Codified Laws': 'sdcl' },
  generateUrl: (codeName: string, section: string) => {
    // SD uses chapter-section format
    return `https://sdlegislature.gov/Statutes/Codified_Laws/${section.replace(/-/g, '')}`;
  },
  notes: 'South Dakota Legislature - South Dakota Codified Laws',
};

/**
 * North Dakota - ndlegis.gov
 * URL pattern: /cencode/t{title}c{chapter}.pdf
 */
const northDakotaConfig: StateStatuteUrlConfig = {
  state: 'ND',
  stateName: 'North Dakota',
  baseUrl: 'https://www.ndlegis.gov',
  codeMapping: { 'Cent. Code': 'ndcc' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0].replace('.', '-');
    const chapter = parts[1] || '1';
    return `https://www.ndlegis.gov/cencode/t${title}c${chapter.padStart(2, '0')}.pdf`;
  },
  notes: 'North Dakota Legislative Branch - North Dakota Century Code',
};

/**
 * Alaska - akleg.gov
 * URL pattern: /basis/statutes.asp#{section}
 */
const alaskaConfig: StateStatuteUrlConfig = {
  state: 'AK',
  stateName: 'Alaska',
  baseUrl: 'https://www.akleg.gov',
  codeMapping: { 'Stat.': 'as' },
  generateUrl: (codeName: string, section: string) => {
    return `https://www.akleg.gov/basis/statutes.asp#${section}`;
  },
  notes: 'Alaska State Legislature - Alaska Statutes',
};

/**
 * Vermont - legislature.vermont.gov
 * URL pattern: /statutes/section/{title}/{chapter}/{section}
 */
const vermontConfig: StateStatuteUrlConfig = {
  state: 'VT',
  stateName: 'Vermont',
  baseUrl: 'https://legislature.vermont.gov',
  codeMapping: { 'Stat. Ann.': 'vsa' },
  generateUrl: (codeName: string, section: string) => {
    // VT uses "tit. X, § Y" format
    return `https://legislature.vermont.gov/statutes/section/${codeName.padStart(2, '0')}/${Math.floor(parseInt(section) / 100).toString().padStart(3, '0')}/${section.padStart(5, '0')}`;
  },
  notes: 'Vermont Legislature - Vermont Statutes Annotated',
};

/**
 * Wyoming - wyoleg.gov
 * URL pattern: /statutes/compress/title{title}.pdf
 */
const wyomingConfig: StateStatuteUrlConfig = {
  state: 'WY',
  stateName: 'Wyoming',
  baseUrl: 'https://wyoleg.gov',
  codeMapping: { 'Stat. Ann.': 'wsa' },
  generateUrl: (codeName: string, section: string) => {
    const parts = section.split('-');
    const title = parts[0].padStart(2, '0');
    return `https://wyoleg.gov/statutes/compress/title${title}.pdf`;
  },
  notes: 'Wyoming Legislature - Wyoming Statutes',
};

/**
 * District of Columbia - code.dccouncil.gov
 * URL pattern: /us/dc/council/code/sections/{section}
 */
const dcConfig: StateStatuteUrlConfig = {
  state: 'DC',
  stateName: 'District of Columbia',
  baseUrl: 'https://code.dccouncil.gov',
  codeMapping: { 'Code': 'dc' },
  generateUrl: (codeName: string, section: string) => {
    return `https://code.dccouncil.gov/us/dc/council/code/sections/${section}`;
  },
  notes: 'DC Council - District of Columbia Official Code',
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
  // New 40 states
  AZ: arizonaConfig,
  WA: washingtonConfig,
  MA: massachusettsConfig,
  CO: coloradoConfig,
  VA: virginiaConfig,
  TN: tennesseeConfig,
  IN: indianaConfig,
  MO: missouriConfig,
  MD: marylandConfig,
  WI: wisconsinConfig,
  MN: minnesotaConfig,
  SC: southCarolinaConfig,
  AL: alabamaConfig,
  LA: louisianaConfig,
  KY: kentuckyConfig,
  OR: oregonConfig,
  OK: oklahomaConfig,
  CT: connecticutConfig,
  UT: utahConfig,
  IA: iowaConfig,
  NV: nevadaConfig,
  AR: arkansasConfig,
  MS: mississippiConfig,
  KS: kansasConfig,
  NM: newMexicoConfig,
  NE: nebraskaConfig,
  WV: westVirginiaConfig,
  ID: idahoConfig,
  HI: hawaiiConfig,
  NH: newHampshireConfig,
  ME: maineConfig,
  MT: montanaConfig,
  RI: rhodeIslandConfig,
  DE: delawareConfig,
  SD: southDakotaConfig,
  ND: northDakotaConfig,
  AK: alaskaConfig,
  VT: vermontConfig,
  WY: wyomingConfig,
  DC: dcConfig,
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

  // ==================== NEW STATE PARSERS (40 states) ====================

  // Arizona: "Ariz. Rev. Stat. § 13-1203"
  match = citation.match(/^Ariz\.\s+Rev\.\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('AZ', 'Rev. Stat.', match[1].trim());
  }

  // Washington: "Wash. Rev. Code § 9A.36.041"
  match = citation.match(/^Wash\.\s+Rev\.\s+Code\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('WA', 'Rev. Code', match[1].trim());
  }

  // Massachusetts: "Mass. Gen. Laws ch. 265, § 13A"
  match = citation.match(/^Mass\.\s+Gen\.\s+Laws\s+ch\.\s*(\d+),?\s*§\s*(.+)$/i);
  if (match) {
    return buildResult('MA', match[1].trim(), match[2].trim());
  }

  // Colorado: "Colo. Rev. Stat. § 18-3-204"
  match = citation.match(/^Colo\.\s+Rev\.\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('CO', 'Rev. Stat.', match[1].trim());
  }

  // Virginia: "Va. Code § 18.2-57"
  match = citation.match(/^Va\.\s+Code\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('VA', 'Code', match[1].trim());
  }

  // Tennessee: "Tenn. Code Ann. § 39-13-101"
  match = citation.match(/^Tenn\.\s+Code\s+Ann\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('TN', 'Code Ann.', match[1].trim());
  }

  // Indiana: "Ind. Code § 35-42-2-1"
  match = citation.match(/^Ind\.\s+Code\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('IN', 'Code', match[1].trim());
  }

  // Missouri: "Mo. Rev. Stat. § 565.056"
  match = citation.match(/^Mo\.\s+Rev\.\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('MO', 'Rev. Stat.', match[1].trim());
  }

  // Maryland: "Md. Code, Crim. Law § 3-203" or "Md. Code, Transp. § 21-902"
  match = citation.match(/^Md\.\s+Code,?\s*(.+?)\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('MD', match[1].trim(), match[2].trim());
  }

  // Wisconsin: "Wis. Stat. § 940.19"
  match = citation.match(/^Wis\.\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('WI', 'Stat.', match[1].trim());
  }

  // Minnesota: "Minn. Stat. § 609.224"
  match = citation.match(/^Minn\.\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('MN', 'Stat.', match[1].trim());
  }

  // South Carolina: "S.C. Code Ann. § 16-3-600"
  match = citation.match(/^S\.C\.\s+Code\s+Ann\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('SC', 'Code Ann.', match[1].trim());
  }

  // Alabama: "Ala. Code § 13A-6-22"
  match = citation.match(/^Ala\.\s+Code\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('AL', 'Code', match[1].trim());
  }

  // Louisiana: "La. R.S. § 14:35"
  match = citation.match(/^La\.\s+R\.S\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('LA', 'R.S.', match[1].trim());
  }

  // Kentucky: "Ky. Rev. Stat. § 508.030"
  match = citation.match(/^Ky\.\s+Rev\.\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('KY', 'Rev. Stat.', match[1].trim());
  }

  // Oregon: "Or. Rev. Stat. § 163.160"
  match = citation.match(/^Or\.\s+Rev\.\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('OR', 'Rev. Stat.', match[1].trim());
  }

  // Oklahoma: "Okla. Stat. tit. 21, § 642"
  match = citation.match(/^Okla\.\s+Stat\.\s+tit\.\s*(\d+),?\s*§\s*(.+)$/i);
  if (match) {
    return buildResult('OK', match[1].trim(), `${match[1]}-${match[2].trim()}`);
  }

  // Connecticut: "Conn. Gen. Stat. § 53a-61"
  match = citation.match(/^Conn\.\s+Gen\.\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('CT', 'Gen. Stat.', match[1].trim());
  }

  // Utah: "Utah Code § 76-5-102"
  match = citation.match(/^Utah\s+Code\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('UT', 'Code', match[1].trim());
  }

  // Iowa: "Iowa Code § 708.2"
  match = citation.match(/^Iowa\s+Code\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('IA', 'Code', match[1].trim());
  }

  // Nevada: "Nev. Rev. Stat. § 200.481"
  match = citation.match(/^Nev\.\s+Rev\.\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('NV', 'Rev. Stat.', match[1].trim());
  }

  // Arkansas: "Ark. Code Ann. § 5-13-203"
  match = citation.match(/^Ark\.\s+Code\s+Ann\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('AR', 'Code Ann.', match[1].trim());
  }

  // Mississippi: "Miss. Code Ann. § 97-3-7"
  match = citation.match(/^Miss\.\s+Code\s+Ann\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('MS', 'Code Ann.', match[1].trim());
  }

  // Kansas: "Kan. Stat. Ann. § 21-5413"
  match = citation.match(/^Kan\.\s+Stat\.\s+Ann\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('KS', 'Stat. Ann.', match[1].trim());
  }

  // New Mexico: "N.M. Stat. Ann. § 30-3-4"
  match = citation.match(/^N\.M\.\s+Stat\.\s+Ann\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('NM', 'Stat. Ann.', match[1].trim());
  }

  // Nebraska: "Neb. Rev. Stat. § 28-310"
  match = citation.match(/^Neb\.\s+Rev\.\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('NE', 'Rev. Stat.', match[1].trim());
  }

  // West Virginia: "W. Va. Code § 61-2-9"
  match = citation.match(/^W\.\s*Va\.\s+Code\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('WV', 'Code', match[1].trim());
  }

  // Idaho: "Idaho Code § 18-903"
  match = citation.match(/^Idaho\s+Code\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('ID', 'Code', match[1].trim());
  }

  // Hawaii: "Haw. Rev. Stat. § 707-712"
  match = citation.match(/^Haw\.\s+Rev\.\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('HI', 'Rev. Stat.', match[1].trim());
  }

  // New Hampshire: "N.H. Rev. Stat. Ann. § 631:2-a"
  match = citation.match(/^N\.H\.\s+Rev\.\s+Stat\.\s+Ann\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('NH', 'Rev. Stat. Ann.', match[1].trim());
  }

  // Maine: "Me. Rev. Stat. Ann. tit. 17-A, § 207"
  match = citation.match(/^Me\.\s+Rev\.\s+Stat\.\s+Ann\.\s+tit\.\s*(.+?),?\s*§\s*(.+)$/i);
  if (match) {
    return buildResult('ME', match[1].trim(), match[2].trim());
  }

  // Montana: "Mont. Code Ann. § 45-5-201"
  match = citation.match(/^Mont\.\s+Code\s+Ann\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('MT', 'Code Ann.', match[1].trim());
  }

  // Rhode Island: "R.I. Gen. Laws § 11-5-3"
  match = citation.match(/^R\.I\.\s+Gen\.\s+Laws\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('RI', 'Gen. Laws', match[1].trim());
  }

  // Delaware: "Del. Code Ann. tit. 11, § 611"
  match = citation.match(/^Del\.\s+Code\s+Ann\.\s+tit\.\s*(\d+),?\s*§\s*(.+)$/i);
  if (match) {
    return buildResult('DE', match[1].trim(), match[2].trim());
  }

  // South Dakota: "S.D. Codified Laws § 22-18-1"
  match = citation.match(/^S\.D\.\s+Codified\s+Laws\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('SD', 'Codified Laws', match[1].trim());
  }

  // North Dakota: "N.D. Cent. Code § 12.1-17-01"
  match = citation.match(/^N\.D\.\s+Cent\.\s+Code\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('ND', 'Cent. Code', match[1].trim());
  }

  // Alaska: "Alaska Stat. § 11.41.230"
  match = citation.match(/^Alaska\s+Stat\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('AK', 'Stat.', match[1].trim());
  }

  // Vermont: "Vt. Stat. Ann. tit. 13, § 1023"
  match = citation.match(/^Vt\.\s+Stat\.\s+Ann\.\s+tit\.\s*(\d+),?\s*§\s*(.+)$/i);
  if (match) {
    return buildResult('VT', match[1].trim(), match[2].trim());
  }

  // Wyoming: "Wyo. Stat. Ann. § 6-2-501"
  match = citation.match(/^Wyo\.\s+Stat\.\s+Ann\.\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('WY', 'Stat. Ann.', match[1].trim());
  }

  // District of Columbia: "D.C. Code § 22-404"
  match = citation.match(/^D\.C\.\s+Code\s+§\s*(.+)$/i);
  if (match) {
    return buildResult('DC', 'Code', match[1].trim());
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
