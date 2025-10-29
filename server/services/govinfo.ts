import axios from 'axios';

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

class GovInfoService {
  private apiKey: string;

  constructor() {
    if (!API_KEY) {
      console.warn('GOVINFO_API_KEY not set - GovInfo integration will not work');
      this.apiKey = '';
    } else {
      this.apiKey = API_KEY;
    }
  }

  /**
   * Search for packages in GovInfo collections
   */
  async search(query: string, collection?: string, pageSize: number = 100): Promise<GovInfoSearchResult | null> {
    if (!this.apiKey) {
      console.error('GovInfo API key not configured');
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
      console.error('GovInfo search failed:', error);
      return null;
    }
  }

  /**
   * Get details for a specific package
   */
  async getPackageDetails(packageId: string): Promise<GovInfoPackageDetails | null> {
    if (!this.apiKey) {
      console.error('GovInfo API key not configured');
      return null;
    }

    try {
      const response = await axios.get(
        `${GOVINFO_BASE_URL}/packages/${packageId}/summary?api_key=${this.apiKey}`,
        {
          timeout: 15000,
        }
      );

      return response.data;
    } catch (error) {
      console.error(`GovInfo package details fetch failed for ${packageId}:`, error);
      return null;
    }
  }

  /**
   * Get the text content of a package
   */
  async getPackageText(packageId: string): Promise<string | null> {
    if (!this.apiKey) {
      console.error('GovInfo API key not configured');
      return null;
    }

    try {
      const response = await axios.get(
        `${GOVINFO_BASE_URL}/packages/${packageId}/htm?api_key=${this.apiKey}`,
        {
          timeout: 30000,
          responseType: 'text',
        }
      );

      return response.data;
    } catch (error) {
      console.error(`GovInfo package text fetch failed for ${packageId}:`, error);
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
      console.error('GovInfo API key not configured');
      return null;
    }

    try {
      const response = await axios.get(
        `${GOVINFO_BASE_URL}/related/${packageId}?api_key=${this.apiKey}`,
        {
          timeout: 15000,
        }
      );

      return response.data;
    } catch (error) {
      console.error(`GovInfo related documents fetch failed for ${packageId}:`, error);
      return null;
    }
  }
}

export const govInfoService = new GovInfoService();
