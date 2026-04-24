import axios from 'axios';
import { devLog, errLog } from '../utils/dev-logger';

const GOVINFO_BASE_URL = 'https://api.govinfo.gov';
const API_KEY = process.env.GOVINFO_API_KEY;

interface GovInfoPackage {
  packageId: string;
  title: string;
  collection: string;
  dateIssued?: string;
  docClass?: string;
  lastModified?: string;
}

interface GovInfoSearchResult {
  count: number;
  offsetMark: string;
  nextPage?: string;
  previousPage?: string;
  packages: GovInfoPackage[];
}

interface GovInfoPackageDetails {
  title: string;
  dateIssued?: string;
  download?: {
    txtLink?: string;
    pdfLink?: string;
    xmlLink?: string;
  };
  details?: {
    collectionCode: string;
    collectionName: string;
    category: string;
    docClass: string;
  };
  relatedLink?: string;
  members?: any[];
}

/**
 * Result of a structured US Code section lookup.
 * status:
 *   'active'    — section exists in the current edition
 *   'repealed'  — section exists but heading contains "Repealed" or "Reserved"
 *   'not_found' — 404 from GovInfo (section number not in that title)
 */
export interface USCodeSection {
  title: string;
  section: string;
  heading: string;
  status: 'active' | 'repealed' | 'not_found';
  packageId: string;
  granuleId: string;
  /** Canonical uscode.house.gov URL for the section */
  sourceUrl: string;
  lastModified?: string;
}

class GovInfoService {
  private apiKey: string;
  /** Cache: title number → latest packageId (e.g. "18" → "USCODE-2022-title18") */
  private packageIdCache: Map<string, string> = new Map();

  constructor() {
    if (!API_KEY) {
      devLog('govinfo', 'GOVINFO_API_KEY not set - GovInfo integration will not work');
      this.apiKey = '';
    } else {
      this.apiKey = API_KEY;
    }
  }

  /**
   * Discover the most recent USCODE package ID for the given title number.
   * Uses the collections endpoint and filters by title in the packageId.
   * Result is cached per title so repeat calls are free.
   */
  private async getLatestUSCodePackageId(title: string): Promise<string | null> {
    const cacheKey = `title${title}`;
    if (this.packageIdCache.has(cacheKey)) {
      return this.packageIdCache.get(cacheKey)!;
    }

    try {
      // Collections endpoint returns packages added/modified since startDate.
      // "2018-01-01" is early enough to capture any current edition.
      const response = await axios.get(
        `${GOVINFO_BASE_URL}/collections/USCODE/2018-01-01`,
        {
          headers: { 'X-Api-Key': this.apiKey },
          params: { pageSize: 100, offset: 0 },
          timeout: 15000,
        }
      );

      const packages: GovInfoPackage[] = response.data.packages || [];

      // Filter to packages for this specific title, e.g. "USCODE-2022-title18"
      const titlePackages = packages.filter((p) =>
        p.packageId?.toLowerCase().includes(`-title${title.padStart(2, '0')}`) ||
        p.packageId?.toLowerCase().includes(`-title${title}`)
      );

      if (titlePackages.length === 0) {
        devLog('govinfo', `No USCODE packages found for title ${title}`);
        return null;
      }

      // Pick the most recently issued package
      titlePackages.sort((a, b) => {
        const da = new Date(a.dateIssued || '2000-01-01').getTime();
        const db = new Date(b.dateIssued || '2000-01-01').getTime();
        return db - da;
      });

      const packageId = titlePackages[0].packageId;
      this.packageIdCache.set(cacheKey, packageId);
      devLog('govinfo', `Latest USCODE package for title ${title}: ${packageId}`);
      return packageId;
    } catch (error) {
      errLog(`GovInfo collections lookup failed for title ${title}`, error);
      return null;
    }
  }

  /**
   * Look up a specific U.S. Code section by title and section number.
   *
   * Parses citation strings like "18 U.S.C. § 1111" or "21 U.S.C. § 841(a)(1)".
   * Strips subsection designators so "841(a)(1)" → looks up granule "section841".
   *
   * Returns null on network/auth errors. Returns USCodeSection with status
   * 'not_found' when GovInfo returns 404. Returns 'repealed' when the section
   * heading contains "Repealed" or "Reserved".
   */
  async getUSCodeSection(title: string, section: string): Promise<USCodeSection | null> {
    if (!this.apiKey) {
      errLog('GovInfo API key not configured — set GOVINFO_API_KEY in .env');
      return null;
    }

    // Normalize section: strip subsection designators and trailing letters
    // e.g. "841(a)(1)" → "841", "1111A" → "1111A" (letter suffixes kept — GovInfo uses them)
    const baseSection = section.replace(/\s*\([^)]*\)/g, '').trim();

    try {
      const packageId = await this.getLatestUSCodePackageId(title);
      if (!packageId) {
        return {
          title,
          section: baseSection,
          heading: '',
          status: 'not_found',
          packageId: '',
          granuleId: '',
          sourceUrl: '',
        };
      }

      // GovInfo granule ID format: {packageId}-section{section}
      const granuleId = `${packageId}-section${baseSection}`;

      const response = await axios.get(
        `${GOVINFO_BASE_URL}/packages/${packageId}/granules/${granuleId}/summary`,
        {
          headers: { 'X-Api-Key': this.apiKey },
          timeout: 15000,
        }
      );

      const data = response.data;
      const heading: string = data.title || data.heading || '';
      const headingLower = heading.toLowerCase();
      const isRepealed =
        headingLower.includes('repealed') || headingLower.includes('reserved');

      return {
        title,
        section: baseSection,
        heading,
        status: isRepealed ? 'repealed' : 'active',
        packageId,
        granuleId,
        sourceUrl: `https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title${title}-section${baseSection}`,
        lastModified: data.lastModified,
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          title,
          section: baseSection,
          heading: '',
          status: 'not_found',
          packageId: '',
          granuleId: '',
          sourceUrl: '',
        };
      }
      errLog(`GovInfo section lookup failed: ${title} U.S.C. § ${baseSection}`, error);
      return null;
    }
  }

  /**
   * Convenience wrapper: parse a federal citation string and look up the section.
   * Accepts formats like:
   *   "18 U.S.C. § 1111"
   *   "21 U.S.C. § 841(a)(1)"
   *   "18 USC 1111"
   * Returns null if the string can't be parsed or the API is unavailable.
   */
  async lookupFederalCitation(citation: string): Promise<USCodeSection | null> {
    // Match patterns like "18 U.S.C. § 1111" or "18 USC 1111"
    const match = citation.match(/(\d+)\s+U\.?S\.?C\.?\s+§?\s*([\dA-Za-z().\-]+)/i);
    if (!match) {
      devLog('govinfo', `Cannot parse federal citation: ${citation}`);
      return null;
    }

    const title = match[1];
    const section = match[2].trim();
    return this.getUSCodeSection(title, section);
  }

  /**
   * Search for packages in GovInfo collections
   */
  async search(query: string, collection?: string, pageSize: number = 100): Promise<GovInfoSearchResult | null> {
    if (!this.apiKey) {
      errLog('GovInfo API key not configured');
      return null;
    }

    try {
      const searchPayload: any = {
        query,
        pageSize,
        offsetMark: '*',
        sorts: [
          {
            field: 'score',
            sortOrder: 'DESC',
          },
        ],
      };

      // Add collection filter if specified
      if (collection) {
        searchPayload.query = `${query} AND collection:${collection}`;
      }

      const response = await axios.post(
        `${GOVINFO_BASE_URL}/search`,
        searchPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': this.apiKey,
          },
          timeout: 15000,
        }
      );

      return {
        count: response.data.count || 0,
        offsetMark: response.data.offsetMark || '*',
        nextPage: response.data.nextPage,
        previousPage: response.data.previousPage,
        packages: response.data.packages || [],
      };
    } catch (error) {
      errLog('GovInfo search failed', error);
      return null;
    }
  }

  /**
   * Get details for a specific package
   */
  async getPackageDetails(packageId: string): Promise<GovInfoPackageDetails | null> {
    if (!this.apiKey) {
      errLog('GovInfo API key not configured');
      return null;
    }

    try {
      const response = await axios.get(
        `${GOVINFO_BASE_URL}/packages/${packageId}/summary`,
        {
          headers: { 'X-Api-Key': this.apiKey },
          timeout: 15000,
        }
      );

      return response.data;
    } catch (error) {
      errLog(`GovInfo package details fetch failed for ${packageId}`, error);
      return null;
    }
  }

  /**
   * Get the text content of a package
   */
  async getPackageText(packageId: string): Promise<string | null> {
    if (!this.apiKey) {
      errLog('GovInfo API key not configured');
      return null;
    }

    try {
      const response = await axios.get(
        `${GOVINFO_BASE_URL}/packages/${packageId}/htm`,
        {
          headers: { 'X-Api-Key': this.apiKey },
          timeout: 30000,
          responseType: 'text',
        }
      );

      return response.data;
    } catch (error) {
      errLog(`GovInfo package text fetch failed for ${packageId}`, error);
      return null;
    }
  }

  /**
   * Search for U.S. Code sections (Title 18 - Crimes and Criminal Procedure)
   */
  async searchUSCode(title: string = '18', section?: string): Promise<GovInfoSearchResult | null> {
    let query = `collection:USCODE AND title:${title}`;
    
    if (section) {
      query += ` AND section:${section}`;
    }

    return await this.search(query, 'USCODE');
  }

  /**
   * Search for Public Laws
   */
  async searchPublicLaws(query: string): Promise<GovInfoSearchResult | null> {
    return await this.search(query, 'PLAW');
  }

  /**
   * Search Statutes at Large
   */
  async searchStatutes(query: string): Promise<GovInfoSearchResult | null> {
    return await this.search(query, 'STATUTE');
  }

  /**
   * Get related documents for a package (bills, laws, USC references, etc.)
   */
  async getRelatedDocuments(packageId: string): Promise<any> {
    if (!this.apiKey) {
      errLog('GovInfo API key not configured');
      return null;
    }

    try {
      const response = await axios.get(
        `${GOVINFO_BASE_URL}/related/${packageId}`,
        {
          headers: { 'X-Api-Key': this.apiKey },
          timeout: 15000,
        }
      );

      return response.data;
    } catch (error) {
      errLog(`GovInfo related documents fetch failed for ${packageId}`, error);
      return null;
    }
  }
}

export const govInfoService = new GovInfoService();
