import axios from 'axios';

const CALAWS_BASE_URL = 'https://api.calilaws.com/v1';

interface CalLawsSection {
  code: string;
  section: string;
  title: string;
  content: string;
  division?: string;
  part?: string;
  chapter?: string;
  article?: string;
}

interface CalLawsSearchResult {
  sections: CalLawsSection[];
  count: number;
}

class CaliforniaLawsService {
  /**
   * Get sections from a specific California code
   * @param code - The code abbreviation (e.g., 'PEN' for Penal Code, 'HSC' for Health & Safety Code)
   * @param section - Optional specific section number
   */
  async getSections(code: string, section?: string): Promise<CalLawsSearchResult | null> {
    try {
      const params: any = { code: code.toUpperCase() };
      
      if (section) {
        params.section = section;
      }

      const response = await axios.get(`${CALAWS_BASE_URL}/sections`, {
        params,
        timeout: 15000,
      });

      return {
        sections: response.data || [],
        count: response.data?.length || 0,
      };
    } catch (error) {
      console.error(`California Laws API error for ${code} § ${section || 'all'}:`, error);
      return null;
    }
  }

  /**
   * Get a specific Penal Code section
   */
  async getPenalCodeSection(section: string): Promise<CalLawsSection | null> {
    const result = await this.getSections('PEN', section);
    return result?.sections?.[0] || null;
  }

  /**
   * Get all Penal Code sections for a specific division/part/chapter
   */
  async getPenalCodeByDivision(division: string): Promise<CalLawsSearchResult | null> {
    try {
      const response = await axios.get(`${CALAWS_BASE_URL}/sections`, {
        params: {
          code: 'PEN',
          division,
        },
        timeout: 15000,
      });

      return {
        sections: response.data || [],
        count: response.data?.length || 0,
      };
    } catch (error) {
      console.error(`California Penal Code division ${division} fetch failed:`, error);
      return null;
    }
  }

  /**
   * Search California laws by keyword
   */
  async searchSections(code: string, query: string): Promise<CalLawsSearchResult | null> {
    try {
      const response = await axios.get(`${CALAWS_BASE_URL}/sections`, {
        params: {
          code: code.toUpperCase(),
          q: query,
        },
        timeout: 15000,
      });

      return {
        sections: response.data || [],
        count: response.data?.length || 0,
      };
    } catch (error) {
      console.error(`California Laws search failed for "${query}" in ${code}:`, error);
      return null;
    }
  }

  /**
   * Get list of available codes
   */
  async getCodes(): Promise<string[] | null> {
    try {
      const response = await axios.get(`${CALAWS_BASE_URL}/codes`, {
        timeout: 15000,
      });

      return response.data || [];
    } catch (error) {
      console.error('California Laws codes list fetch failed:', error);
      return null;
    }
  }
}

export const californiaLawsService = new CaliforniaLawsService();
