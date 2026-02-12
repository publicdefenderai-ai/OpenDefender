import axios, { AxiosInstance } from 'axios';
import { eq, ilike } from 'drizzle-orm';
import { db } from '../db';
import { statutes } from '@shared/schema';
import { devLog, opsLog, errLog } from '../utils/dev-logger';

/**
 * OpenLaws API Client
 * Integrates with OpenLaws API for comprehensive 50-state statute coverage
 * 
 * API Documentation: https://docs.openlaws.us/version-104/api-reference
 * Coverage: 50 states + DC + Puerto Rico + Federal (4.3M+ statute sections)
 * 
 * Updated December 2025 to use working hierarchical division endpoints
 * Uses generic breadth-first search to find sections across all jurisdictions
 */

export interface OpenLawsConfig {
  apiKey?: string;
  baseUrl: string;
  timeout: number;
}

export interface OpenLawsJurisdiction {
  name: string;
  key: string;
  state: string;
  abbreviation: string;
  postal_abbreviation: string;
  laws: OpenLawsLaw[];
}

export interface OpenLawsLaw {
  key: string;
  jurisdiction_key: string;
  law_type: 'statutes' | 'regulations' | 'constitution';
  name: string;
  aliases: string[] | null;
}

export interface OpenLawsDivision {
  jurisdiction_key: string;
  law_key: string;
  path: string;
  label: string;
  division_type: string;
  identifier: string;
  name: string;
  display_name: string;
  openlaws_web_url: string;
  effective_date_start: string;
  effective_date_end: string;
  plaintext_content: string | null;
  markdown_content: string | null;
  is_repealed: boolean | null;
  display_children?: Array<{
    display_name: string;
    path: string;
  }>;
}

export interface OpenLawsStatute {
  id: string;
  citation: string;
  jurisdiction: string;
  title: string;
  content: string;
  effectiveDate?: string;
  url?: string;
  chapter?: string;
  section: string;
  path?: string;
}

export interface OpenLawsSearchResult {
  results: OpenLawsStatute[];
  total: number;
  page: number;
  perPage: number;
}

// Mapping of state codes to their statute law keys
const STATE_STATUTE_KEYS: Record<string, string> = {
  'AL': 'AL-STAT', 'AK': 'AK-STAT', 'AZ': 'AZ-STAT', 'AR': 'AR-STAT',
  'CA': 'CA-STAT', 'CO': 'CO-STAT', 'CT': 'CT-STAT', 'DE': 'DE-STAT',
  'FL': 'FL-STAT', 'GA': 'GA-STAT', 'HI': 'HI-STAT', 'ID': 'ID-STAT',
  'IL': 'IL-STAT', 'IN': 'IN-STAT', 'IA': 'IA-STAT', 'KS': 'KS-STAT',
  'KY': 'KY-STAT', 'LA': 'LA-STAT', 'ME': 'ME-STAT', 'MD': 'MD-STAT',
  'MA': 'MA-STAT', 'MI': 'MI-STAT', 'MN': 'MN-STAT', 'MS': 'MS-STAT',
  'MO': 'MO-STAT', 'MT': 'MT-STAT', 'NE': 'NE-STAT', 'NV': 'NV-STAT',
  'NH': 'NH-STAT', 'NJ': 'NJ-STAT', 'NM': 'NM-STAT', 'NY': 'NY-STAT',
  'NC': 'NC-STAT', 'ND': 'ND-STAT', 'OH': 'OH-STAT', 'OK': 'OK-STAT',
  'OR': 'OR-STAT', 'PA': 'PA-STAT', 'RI': 'RI-STAT', 'SC': 'SC-STAT',
  'SD': 'SD-STAT', 'TN': 'TN-STAT', 'TX': 'TX-STAT', 'UT': 'UT-STAT',
  'VT': 'VT-STAT', 'VA': 'VA-STAT', 'WA': 'WA-STAT', 'WV': 'WV-STAT',
  'WI': 'WI-STAT', 'WY': 'WY-STAT', 'DC': 'DC-STAT', 'PR': 'PR-STAT',
  'FED': 'FED-USC'
};

// State abbreviation mappings for citation parsing
const STATE_ABBREV_MAP: Record<string, string> = {
  'Cal.': 'CA', 'California': 'CA', 'CA': 'CA',
  'Tex.': 'TX', 'Texas': 'TX', 'TX': 'TX',
  'Fla.': 'FL', 'Florida': 'FL', 'FL': 'FL',
  'N.Y.': 'NY', 'New York': 'NY', 'NY': 'NY',
  'Pa.': 'PA', 'Pennsylvania': 'PA', 'PA': 'PA',
  'Ill.': 'IL', 'Illinois': 'IL', 'IL': 'IL',
  'Ohio': 'OH', 'OH': 'OH',
  'Ga.': 'GA', 'Georgia': 'GA', 'GA': 'GA',
  'N.C.': 'NC', 'North Carolina': 'NC', 'NC': 'NC',
  'Mich.': 'MI', 'Michigan': 'MI', 'MI': 'MI',
  'Ariz.': 'AZ', 'Arizona': 'AZ', 'AZ': 'AZ',
  'Mass.': 'MA', 'Massachusetts': 'MA', 'MA': 'MA',
  'Wash.': 'WA', 'Washington': 'WA', 'WA': 'WA',
  'Colo.': 'CO', 'Colorado': 'CO', 'CO': 'CO',
  'Md.': 'MD', 'Maryland': 'MD', 'MD': 'MD',
  'Minn.': 'MN', 'Minnesota': 'MN', 'MN': 'MN',
  'Mo.': 'MO', 'Missouri': 'MO', 'MO': 'MO',
  'Wis.': 'WI', 'Wisconsin': 'WI', 'WI': 'WI',
  'Ind.': 'IN', 'Indiana': 'IN', 'IN': 'IN',
  'Tenn.': 'TN', 'Tennessee': 'TN', 'TN': 'TN',
  'Va.': 'VA', 'Virginia': 'VA', 'VA': 'VA',
  'La.': 'LA', 'Louisiana': 'LA', 'LA': 'LA',
  'Ky.': 'KY', 'Kentucky': 'KY', 'KY': 'KY',
  'S.C.': 'SC', 'South Carolina': 'SC', 'SC': 'SC',
  'Ala.': 'AL', 'Alabama': 'AL', 'AL': 'AL',
  'Or.': 'OR', 'Oregon': 'OR', 'OR': 'OR',
  'Okla.': 'OK', 'Oklahoma': 'OK', 'OK': 'OK',
  'Conn.': 'CT', 'Connecticut': 'CT', 'CT': 'CT',
  'Iowa': 'IA', 'IA': 'IA',
  'Utah': 'UT', 'UT': 'UT',
  'Nev.': 'NV', 'Nevada': 'NV', 'NV': 'NV',
  'Ark.': 'AR', 'Arkansas': 'AR', 'AR': 'AR',
  'Miss.': 'MS', 'Mississippi': 'MS', 'MS': 'MS',
  'Kan.': 'KS', 'Kansas': 'KS', 'KS': 'KS',
  'N.M.': 'NM', 'New Mexico': 'NM', 'NM': 'NM',
  'Neb.': 'NE', 'Nebraska': 'NE', 'NE': 'NE',
  'W.Va.': 'WV', 'West Virginia': 'WV', 'WV': 'WV',
  'Idaho': 'ID', 'ID': 'ID',
  'Haw.': 'HI', 'Hawaii': 'HI', 'HI': 'HI',
  'N.H.': 'NH', 'New Hampshire': 'NH', 'NH': 'NH',
  'Me.': 'ME', 'Maine': 'ME', 'ME': 'ME',
  'R.I.': 'RI', 'Rhode Island': 'RI', 'RI': 'RI',
  'Mont.': 'MT', 'Montana': 'MT', 'MT': 'MT',
  'Del.': 'DE', 'Delaware': 'DE', 'DE': 'DE',
  'S.D.': 'SD', 'South Dakota': 'SD', 'SD': 'SD',
  'N.D.': 'ND', 'North Dakota': 'ND', 'ND': 'ND',
  'Alaska': 'AK', 'AK': 'AK',
  'Vt.': 'VT', 'Vermont': 'VT', 'VT': 'VT',
  'Wyo.': 'WY', 'Wyoming': 'WY', 'WY': 'WY',
  'D.C.': 'DC', 'District of Columbia': 'DC', 'DC': 'DC',
  'P.R.': 'PR', 'Puerto Rico': 'PR', 'PR': 'PR',
  'U.S.C.': 'FED', 'USC': 'FED', 'FED': 'FED', 'Federal': 'FED',
};

export class OpenLawsClient {
  private axios: AxiosInstance;
  private apiKey?: string;
  private isConfigured: boolean = false;
  private jurisdictionCache: OpenLawsJurisdiction[] | null = null;

  constructor(config: OpenLawsConfig) {
    this.apiKey = config.apiKey || process.env.OPENLAWS_API_KEY;
    this.isConfigured = !!this.apiKey;

    this.axios = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
    });
  }

  /**
   * Check if OpenLaws API is configured and available
   */
  async checkAvailability(): Promise<{ available: boolean; message: string; jurisdictionCount?: number }> {
    if (!this.isConfigured) {
      return {
        available: false,
        message: 'OpenLaws API key not configured. Set OPENLAWS_API_KEY environment variable.',
      };
    }

    try {
      const jurisdictions = await this.getJurisdictions();
      return {
        available: true,
        message: `OpenLaws API available. Found ${jurisdictions.length} jurisdictions.`,
        jurisdictionCount: jurisdictions.length,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return {
            available: false,
            message: 'OpenLaws API key is invalid or expired.',
          };
        }
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
          return {
            available: false,
            message: 'OpenLaws API is unreachable. Service may be down or URL is incorrect.',
          };
        }
      }
      return {
        available: false,
        message: `OpenLaws API check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get all jurisdictions (cached)
   */
  async getJurisdictions(): Promise<OpenLawsJurisdiction[]> {
    if (this.jurisdictionCache) {
      return this.jurisdictionCache;
    }

    if (!this.isConfigured) {
      throw new Error('OpenLaws API not configured');
    }

    const response = await this.axios.get('/jurisdictions');
    this.jurisdictionCache = response.data || [];
    return this.jurisdictionCache!;
  }

  /**
   * Get laws for a specific jurisdiction
   */
  async getLaws(jurisdictionKey: string): Promise<OpenLawsLaw[]> {
    if (!this.isConfigured) {
      throw new Error('OpenLaws API not configured');
    }

    const response = await this.axios.get(`/jurisdictions/${jurisdictionKey}/laws`);
    return response.data || [];
  }

  /**
   * Get divisions (chapters/titles/sections) for a law with optional depth
   * Note: Root level (no path) returns an array, nested paths return an object
   */
  async getDivisions(
    jurisdictionKey: string,
    lawKey: string,
    path?: string,
    depth: number = 1
  ): Promise<OpenLawsDivision> {
    if (!this.isConfigured) {
      throw new Error('OpenLaws API not configured');
    }

    const basePath = `/jurisdictions/${jurisdictionKey}/laws/${lawKey}/divisions`;
    const fullPath = path ? `${basePath}/${path}` : basePath;
    
    const response = await this.axios.get(fullPath, {
      params: { depth }
    });
    
    // Root level returns an array, convert to object format for consistency
    if (Array.isArray(response.data)) {
      return {
        jurisdiction_key: jurisdictionKey,
        law_key: lawKey,
        path: '',
        label: 'root',
        division_type: 'root',
        identifier: '',
        name: lawKey,
        display_name: lawKey,
        openlaws_web_url: '',
        effective_date_start: '',
        effective_date_end: '',
        plaintext_content: null,
        markdown_content: null,
        is_repealed: null,
        display_children: response.data.map((d: any) => ({
          display_name: d.display_name || d.name,
          path: d.path
        }))
      };
    }
    
    return response.data;
  }

  /**
   * Get full statute text by path
   * Returns the division with markdown_content and plaintext_content
   */
  async getStatuteByPath(
    jurisdictionKey: string,
    lawKey: string,
    path: string
  ): Promise<OpenLawsDivision | null> {
    if (!this.isConfigured) {
      throw new Error('OpenLaws API not configured');
    }

    try {
      const response = await this.axios.get(
        `/jurisdictions/${jurisdictionKey}/laws/${lawKey}/divisions/${path}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Parse a citation to extract jurisdiction and section number
   * Handles multiple formats:
   * - Standard: "Cal. Penal Code § 187"
   * - NJ style with colon: "N.J.S.A. 2C:15-1"
   * - Kansas style with hyphen: "K.S.A. 21-5413"
   * - Subsections: "Cal. Penal Code § 459(a)"
   * - Federal: "18 U.S.C. § 1001"
   * - Simple: "FL Stat 784.03"
   */
  parseCitation(citation: string): { jurisdiction: string; section: string; codeHint?: string } | null {
    const normalized = citation.trim();
    
    // Pattern 1: Federal "18 U.S.C. § 1001" or "Title 18, § 1001"
    const federalPattern = /(?:Title\s+)?(\d+)\s*U\.?S\.?C\.?A?\.?\s*§?\s*(\d+(?:[a-zA-Z])?)/i;
    const federalMatch = normalized.match(federalPattern);
    if (federalMatch) {
      return {
        jurisdiction: 'FED',
        section: federalMatch[2],
        codeHint: `title_${federalMatch[1]}`
      };
    }

    // Pattern 2: New Jersey style "N.J.S.A. 2C:15-1" or "N.J. Stat. Ann. § 2C:15-1"
    const njPattern = /N\.?J\.?\s*(?:S\.?A\.?|Stat\.?\s*Ann\.?)\s*§?\s*([0-9A-Za-z]+:[0-9-]+(?:\([a-z0-9]+\))?)/i;
    const njMatch = normalized.match(njPattern);
    if (njMatch) {
      return {
        jurisdiction: 'NJ',
        section: njMatch[1]
      };
    }

    // Pattern 3: Kansas style "K.S.A. 21-5413"
    const ksPattern = /K\.?S\.?A\.?\s*§?\s*(\d+-\d+(?:\([a-z0-9]+\))?)/i;
    const ksMatch = normalized.match(ksPattern);
    if (ksMatch) {
      return {
        jurisdiction: 'KS',
        section: ksMatch[1]
      };
    }

    // Pattern 4: DC Code "D.C. Code § 22-2101"
    const dcPattern = /D\.?C\.?\s*(?:Code|Law)?\s*§?\s*(\d+-\d+(?:\.\d+)?(?:\([a-z0-9]+\))?)/i;
    const dcMatch = normalized.match(dcPattern);
    if (dcMatch) {
      return {
        jurisdiction: 'DC',
        section: dcMatch[1]
      };
    }

    // Pattern 5: Puerto Rico style "33 L.P.R.A. § 4013"
    const prPattern = /(\d+)\s*L\.?P\.?R\.?A\.?\s*§?\s*(\d+)/i;
    const prMatch = normalized.match(prPattern);
    if (prMatch) {
      return {
        jurisdiction: 'PR',
        section: prMatch[2],
        codeHint: `title_${prMatch[1]}`
      };
    }

    // Pattern 6: Simple "FL Stat 784.03" or "TX Penal Code 22.01"
    const simplePattern = /^([A-Z]{2})\s+(?:Penal\s+Code|Stat(?:utes)?|Code|Law)\.?\s*§?\s*([\d.:a-zA-Z-]+(?:\([a-z0-9]+\))?)/i;
    const simpleMatch = normalized.match(simplePattern);
    if (simpleMatch) {
      const stateCode = simpleMatch[1].toUpperCase();
      if (STATE_STATUTE_KEYS[stateCode]) {
        const codeMatch = normalized.match(/Penal/i);
        return {
          jurisdiction: stateCode,
          section: simpleMatch[2],
          codeHint: codeMatch ? 'penal' : undefined
        };
      }
    }

    // Pattern 7: Standard state citation "Cal. Penal Code § 187" with subsection support
    // Capture state abbreviation separately from code type
    const stateCodePattern = /^([A-Za-z.]+)\s+(?:(Penal|Criminal|Vehicle|Health|Family|Civil|Bus(?:iness)?|Gov(?:'t)?|Educ|Prob|Welf|Lab(?:or)?|Rev|Tax)\s*)?(?:Code|Stat(?:utes)?|Law|Ann(?:otated)?)?\.?\s*§?\s*([\d.:a-zA-Z-]+(?:\([a-z0-9]+\))?)/i;
    const stateCodeMatch = normalized.match(stateCodePattern);
    if (stateCodeMatch) {
      const stateAbbrev = stateCodeMatch[1].trim();
      const stateCode = STATE_ABBREV_MAP[stateAbbrev] || STATE_ABBREV_MAP[stateAbbrev.replace(/\./g, '')];
      
      if (stateCode) {
        return {
          jurisdiction: stateCode,
          section: stateCodeMatch[3],
          codeHint: stateCodeMatch[2] ? stateCodeMatch[2].toLowerCase() : undefined
        };
      }
    }

    // Pattern 8: Two-letter state code at start with flexible section format
    const twoLetterMatch = normalized.match(/^([A-Z]{2})\b/);
    if (twoLetterMatch) {
      const stateCode = twoLetterMatch[1];
      if (STATE_STATUTE_KEYS[stateCode]) {
        // Match section numbers with dots, colons, hyphens, and subsections
        const sectionMatch = normalized.match(/§?\s*([\d.:a-zA-Z-]+(?:\([a-z0-9]+\))?)/);
        if (sectionMatch && sectionMatch[1] !== stateCode) {
          return {
            jurisdiction: stateCode,
            section: sectionMatch[1]
          };
        }
      }
    }

    devLog('openlaws', `Could not parse citation: ${citation}`);
    return null;
  }

  /**
   * Check if a path or name matches a section identifier
   * Uses word boundary matching to avoid false positives
   */
  private matchesSection(pathOrName: string, sectionNum: string): boolean {
    const lowerPath = pathOrName.toLowerCase();
    const baseSectionNum = sectionNum.split('(')[0].trim(); // Remove subsection like (a)
    
    // Normalize section number for path matching (dots, colons, hyphens -> underscore)
    const normalizedSection = baseSectionNum
      .replace(/[.:]/g, '_')
      .replace(/-/g, '_');
    
    // Pattern 1: Exact section path match with word boundary
    // e.g., "section_187" at end of path or followed by non-alphanumeric
    const exactPathPatterns = [
      new RegExp(`section_${normalizedSection}(?:[^0-9a-z]|$)`, 'i'),
      new RegExp(`sec_${normalizedSection}(?:[^0-9a-z]|$)`, 'i'),
    ];
    
    for (const pattern of exactPathPatterns) {
      if (pattern.test(lowerPath)) {
        return true;
      }
    }

    // Pattern 2: Section number in display name with word boundary
    // e.g., "Section 187" or "§ 187"
    const displayPatterns = [
      new RegExp(`section\\s+${baseSectionNum}(?:[^0-9]|$)`, 'i'),
      new RegExp(`§\\s*${baseSectionNum}(?:[^0-9]|$)`, 'i'),
    ];
    
    for (const pattern of displayPatterns) {
      if (pattern.test(lowerPath)) {
        return true;
      }
    }

    // Pattern 3: For hyphenated/colon-delimited sections (e.g., "22-2101", "2C:15-1")
    // Match the full pattern with flexible separators
    if (baseSectionNum.includes('-') || baseSectionNum.includes(':')) {
      const flexPattern = baseSectionNum
        .replace(/[:-]/g, '[_:-]')
        .replace(/\./g, '[._]?');
      const flexRegex = new RegExp(`(?:section_?|sec_?)?${flexPattern}(?:[^0-9a-z]|$)`, 'i');
      if (flexRegex.test(lowerPath)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Search for a statute section using level-by-level traversal:
   * 1. Find the right code/compilation based on code hint
   * 2. Traverse level by level, fetching all children at each depth
   * 3. Check for section matches at each level
   */
  async findSectionInLaw(
    jurisdictionKey: string,
    lawKey: string,
    sectionNum: string,
    codeHint?: string,
    maxDepth: number = 6
  ): Promise<OpenLawsDivision | null> {
    if (!this.isConfigured) {
      throw new Error('OpenLaws API not configured');
    }

    try {
      // Phase 1: Get root divisions and find matching compilation
      const root = await this.getDivisions(jurisdictionKey, lawKey, undefined, 2);
      
      if (!root.display_children || root.display_children.length === 0) {
        devLog('openlaws', `No divisions found for ${jurisdictionKey}/${lawKey}`);
        return null;
      }

      // Prioritize compilations matching the code hint
      const sortedChildren = this.prioritizeByHint(root.display_children, codeHint);
      
      // Phase 2: Search through compilations (prioritized by hint)
      // If hint matches, only search top 2; otherwise search top 5
      const compilationsToSearch = codeHint 
        ? sortedChildren.slice(0, 2) 
        : sortedChildren.slice(0, 5);
      
      let totalApiCalls = 0;
      const maxApiCalls = 50; // Limit total API calls across all compilations
      
      for (const compilation of compilationsToSearch) {
        if (totalApiCalls >= maxApiCalls) break;
        
        devLog('openlaws', `Searching in ${compilation.display_name}...`);
        
        // Level-by-level search within this compilation
        let currentLevel: string[] = [compilation.path];
        
        for (let depth = 0; depth < maxDepth && currentLevel.length > 0 && totalApiCalls < maxApiCalls; depth++) {
          const nextLevel: string[] = [];
          
          for (const path of currentLevel) {
            if (totalApiCalls >= maxApiCalls) break;
            
            try {
              totalApiCalls++;
              const division = await this.getDivisions(jurisdictionKey, lawKey, path, 2);
              
              if (division.display_children) {
                for (const child of division.display_children) {
                  // Check if this child is our section
                  if (this.matchesSection(child.path, sectionNum) || 
                      this.matchesSection(child.display_name, sectionNum)) {
                    // Found it! Fetch full content
                    const fullSection = await this.getStatuteByPath(jurisdictionKey, lawKey, child.path);
                    if (fullSection && (fullSection.markdown_content || fullSection.plaintext_content)) {
                      devLog('openlaws', `Found section ${sectionNum} at depth ${depth + 1}: ${child.path}`);
                      return fullSection;
                    }
                  }
                  
                  // Add to next level for continued search
                  nextLevel.push(child.path);
                }
              }
            } catch (error) {
              // Ignore errors for individual paths
            }
            
            // Rate limiting
            if (totalApiCalls % 5 === 0) {
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          }
          
          currentLevel = nextLevel;
        }
      }

      devLog('openlaws', `Section ${sectionNum} not found after ${totalApiCalls} API calls`);
      return null;
    } catch (error) {
      errLog(`[OpenLaws] Error searching for section ${sectionNum}`, error);
      return null;
    }
  }

  /**
   * Prioritize children based on code hint (e.g., "penal", "vehicle")
   */
  private prioritizeByHint(
    children: Array<{ display_name: string; path: string }>,
    codeHint?: string
  ): Array<{ display_name: string; path: string }> {
    if (!codeHint) return children;

    const hintLower = codeHint.toLowerCase();
    const prioritized: typeof children = [];
    const rest: typeof children = [];

    for (const child of children) {
      const nameLower = child.display_name.toLowerCase();
      const pathLower = child.path.toLowerCase();

      if (nameLower.includes(hintLower) || pathLower.includes(hintLower)) {
        prioritized.push(child);
      } else {
        rest.push(child);
      }
    }

    return [...prioritized, ...rest];
  }

  /**
   * Search for a statute by citation string
   * Uses generic BFS to find the section in any jurisdiction
   */
  async searchByCitation(citation: string): Promise<OpenLawsStatute | null> {
    if (!this.isConfigured) {
      throw new Error('OpenLaws API not configured');
    }

    const parsed = this.parseCitation(citation);
    if (!parsed) {
      return null;
    }

    const { jurisdiction, section, codeHint } = parsed;
    const lawKey = STATE_STATUTE_KEYS[jurisdiction];
    if (!lawKey) {
      devLog('openlaws', `Unknown jurisdiction: ${jurisdiction}`);
      return null;
    }

    try {
      const division = await this.findSectionInLaw(jurisdiction, lawKey, section, codeHint);
      if (division) {
        return this.divisionToStatute(division, citation);
      }
      return null;
    } catch (error) {
      errLog(`[OpenLaws] Error searching for citation "${citation}"`, error);
      return null;
    }
  }

  /**
   * Convert an OpenLaws division to our statute format
   */
  private divisionToStatute(division: OpenLawsDivision, citation: string): OpenLawsStatute {
    // Clean up markdown content (remove pincite markers)
    let content = division.markdown_content || division.plaintext_content || '';
    content = content.replace(/\{\{<\s*pincite[^>]*>\}\}/g, '');
    content = content.replace(/\{\s*\.parens-\w+\s*\}/g, '');
    content = content.replace(/^\d+\.\s+/gm, ''); // Remove numbered list prefixes
    content = content.trim();

    return {
      id: division.path,
      citation: citation,
      jurisdiction: division.jurisdiction_key,
      title: division.display_name || division.name,
      content: content,
      effectiveDate: division.effective_date_start !== '-Infinity' ? division.effective_date_start : undefined,
      url: division.openlaws_web_url,
      section: division.identifier,
      path: division.path,
    };
  }

  /**
   * Hybrid statute lookup: database first, then OpenLaws API fallback
   * This is the recommended method for statute retrieval
   */
  async getStatuteByCitation(
    citation: string,
    options: { importIfFound?: boolean } = {}
  ): Promise<OpenLawsStatute | null> {
    // Step 1: Check database first (fast path)
    try {
      const dbStatute = await db.query.statutes.findFirst({
        where: eq(statutes.citation, citation),
      });
      
      if (dbStatute && dbStatute.content) {
        devLog('openlaws', `Found in database: ${citation}`);
        return {
          id: String(dbStatute.id),
          citation: dbStatute.citation,
          jurisdiction: dbStatute.jurisdiction,
          title: dbStatute.title,
          content: dbStatute.content,
          url: dbStatute.url || undefined,
          section: dbStatute.section || '',
        };
      }
    } catch (error) {
      errLog(`[OpenLaws] Database lookup error`, error);
      // Continue to API fallback
    }

    // Step 2: Not in database, try OpenLaws API
    if (!this.isConfigured) {
      devLog('openlaws', `API not configured, database lookup only`);
      return null;
    }

    devLog('openlaws', `Not in database, searching API: ${citation}`);
    const apiResult = await this.searchByCitation(citation);
    
    // Step 3: Optionally import to database for future lookups
    if (apiResult && options.importIfFound) {
      try {
        await this.importStatute(apiResult);
        opsLog('openlaws', `Imported to database: ${citation}`);
      } catch (error) {
        errLog(`[OpenLaws] Import error`, error);
      }
    }

    return apiResult;
  }

  /**
   * Get live statute text for a California Penal Code section
   * Convenience method for common use case
   */
  async getCaliforniaPenalCode(section: string): Promise<OpenLawsStatute | null> {
    return this.getStatuteByCitation(`Cal. Penal Code § ${section}`);
  }

  /**
   * Get live statute text for a Texas Penal Code section
   */
  async getTexasPenalCode(section: string): Promise<OpenLawsStatute | null> {
    return this.searchByCitation(`Tex. Penal Code § ${section}`);
  }

  /**
   * Get live statute text for a Florida Statute section
   */
  async getFloridaStatute(section: string): Promise<OpenLawsStatute | null> {
    return this.searchByCitation(`Fla. Stat. § ${section}`);
  }

  /**
   * Get live statute text for a federal USC section
   */
  async getFederalStatute(title: number, section: string): Promise<OpenLawsStatute | null> {
    return this.searchByCitation(`${title} U.S.C. § ${section}`);
  }

  /**
   * Fetch with exponential backoff retry logic for 429/5xx errors
   */
  private async fetchWithRetry(
    url: string,
    params: any,
    maxRetries: number = 3
  ): Promise<any> {
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await this.axios.get(url, { params });
        return response;
      } catch (error) {
        lastError = error;

        if (axios.isAxiosError(error)) {
          const status = error.response?.status;

          if (status === 429 || (status && status >= 500)) {
            const backoffMs = Math.pow(2, attempt) * 1000;
            devLog('openlaws', `${status} error, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, backoffMs));
            continue;
          }

          if (status && status >= 400 && status < 500) {
            throw error;
          }
        }

        devLog('openlaws', `Network error, retrying (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw lastError;
  }

  /**
   * Import statute from OpenLaws API into our database (upsert)
   */
  async importStatute(openLawsStatute: OpenLawsStatute): Promise<boolean> {
    try {
      const level = openLawsStatute.jurisdiction === 'FED' ? 'federal' : 'state';

      await db.insert(statutes).values({
        title: openLawsStatute.title,
        citation: openLawsStatute.citation,
        jurisdiction: openLawsStatute.jurisdiction,
        level: level,
        chapter: openLawsStatute.chapter || null,
        section: openLawsStatute.section,
        content: openLawsStatute.content,
        url: openLawsStatute.url || null,
        sourceApi: 'openlaws',
        isActive: true,
      }).onConflictDoUpdate({
        target: [statutes.citation, statutes.jurisdiction],
        set: {
          title: openLawsStatute.title,
          content: openLawsStatute.content,
          level: level,
          chapter: openLawsStatute.chapter || null,
          section: openLawsStatute.section,
          url: openLawsStatute.url || null,
          sourceApi: 'openlaws',
          lastUpdated: new Date(),
        },
      });
      
      opsLog('openlaws', `Imported statute: ${openLawsStatute.citation} (${openLawsStatute.jurisdiction})`);
      return true;
    } catch (error) {
      errLog(`[OpenLaws] Error importing statute ${openLawsStatute.citation}`, error);
      return false;
    }
  }
}

// Create singleton instance
export const openLawsClient = new OpenLawsClient({
  baseUrl: process.env.OPENLAWS_API_URL || 'https://api.openlaws.us/api/v1',
  timeout: 30000,
});
