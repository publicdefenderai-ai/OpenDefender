import axios, { AxiosInstance } from 'axios';
import { db } from '../db';
import { statutes } from '@shared/schema';

/**
 * OpenLaws API Client
 * Integrates with OpenLaws API for comprehensive 50-state statute coverage
 * 
 * API Documentation: https://openlaws.apidocumentation.com/
 * Coverage: 50 states + DC + Puerto Rico + Federal (4.3M+ statute sections)
 */

export interface OpenLawsConfig {
  apiKey?: string;
  baseUrl: string;
  timeout: number;
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
}

export interface OpenLawsSearchResult {
  results: OpenLawsStatute[];
  total: number;
  page: number;
  perPage: number;
}

export class OpenLawsClient {
  private axios: AxiosInstance;
  private apiKey?: string;
  private isConfigured: boolean = false;

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
  async checkAvailability(): Promise<{ available: boolean; message: string }> {
    if (!this.isConfigured) {
      return {
        available: false,
        message: 'OpenLaws API key not configured. Set OPENLAWS_API_KEY environment variable.',
      };
    }

    try {
      // Try to fetch jurisdictions list as a health check
      const response = await this.axios.get('/jurisdictions', { timeout: 5000 });
      return {
        available: true,
        message: `OpenLaws API available. Found ${response.data?.length || 0} jurisdictions.`,
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
   * Validate and lookup a citation using OpenLaws validation endpoint
   * Uses POST /citations/validate for proper citation validation
   * Example: "Cal. Penal Code § 242"
   */
  async validateCitation(citation: string): Promise<{
    valid: boolean;
    canonical_citation?: string;
    division_id?: string;
    authoritative_url?: string;
    error?: string;
  }> {
    if (!this.isConfigured) {
      throw new Error('OpenLaws API not configured');
    }

    try {
      // Normalize citation to Bluebook format
      const normalizedCitation = this.normalizeCitation(citation);
      
      const response = await this.axios.post('/citations/validate', {
        citation: normalizedCitation,
      });
      
      return {
        valid: true,
        canonical_citation: response.data?.canonical_citation || response.data?.citation,
        division_id: response.data?.division_id || response.data?.id,
        authoritative_url: response.data?.authoritative_url || response.data?.url,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { valid: false, error: 'Citation not found' };
      }
      console.error(`[OpenLaws] Error validating citation "${citation}":`, error);
      return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Search for statutes by citation using path-encoded request
   * Example: "Cal. Penal Code § 242"
   */
  async searchByCitation(citation: string): Promise<OpenLawsStatute | null> {
    if (!this.isConfigured) {
      throw new Error('OpenLaws API not configured');
    }

    try {
      // Normalize and encode the citation for URL path
      const normalizedCitation = this.normalizeCitation(citation);
      const encodedCitation = encodeURIComponent(normalizedCitation);
      
      const response = await this.axios.get(`/citations/${encodedCitation}`);
      return response.data || null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Citation not found - not necessarily an error
        return null;
      }
      console.error(`[OpenLaws] Error searching for citation "${citation}":`, error);
      return null;
    }
  }

  /**
   * Normalize citation to Bluebook format for API queries
   * Handles common variations in state abbreviations and section symbols
   */
  private normalizeCitation(citation: string): string {
    let normalized = citation.trim();
    
    // Normalize section symbols
    normalized = normalized.replace(/§§?/g, '§');
    normalized = normalized.replace(/\bsection\b/gi, '§');
    normalized = normalized.replace(/\bsec\.\b/gi, '§');
    
    // Normalize common state abbreviations to Bluebook format
    const stateNormalizations: Record<string, string> = {
      'Cal.': 'Cal.',
      'California': 'Cal.',
      'Tex.': 'Tex.',
      'Texas': 'Tex.',
      'Fla.': 'Fla.',
      'Florida': 'Fla.',
      'N.Y.': 'N.Y.',
      'New York': 'N.Y.',
    };
    
    for (const [variant, canonical] of Object.entries(stateNormalizations)) {
      if (normalized.includes(variant)) {
        normalized = normalized.replace(variant, canonical);
      }
    }
    
    return normalized;
  }

  /**
   * Search for statutes by keyword across jurisdictions
   */
  async searchByKeyword(
    keyword: string,
    jurisdiction?: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<OpenLawsSearchResult> {
    if (!this.isConfigured) {
      throw new Error('OpenLaws API not configured');
    }

    try {
      const response = await this.axios.get('/search', {
        params: {
          q: keyword,
          jurisdiction,
          page,
          per_page: perPage,
        },
      });
      
      return {
        results: response.data.results || [],
        total: response.data.total || 0,
        page: response.data.page || page,
        perPage: response.data.per_page || perPage,
      };
    } catch (error) {
      console.error(`[OpenLaws] Error searching for keyword "${keyword}":`, error);
      return { results: [], total: 0, page, perPage };
    }
  }

  /**
   * Get all statutes for a specific jurisdiction with pagination and retry logic
   * Follows OpenLaws API pagination using meta.pagination.next_page
   */
  async getStatutesByJurisdiction(
    jurisdictionCode: string,
    maxPages: number = 100
  ): Promise<OpenLawsStatute[]> {
    if (!this.isConfigured) {
      throw new Error('OpenLaws API not configured');
    }

    const allStatutes: OpenLawsStatute[] = [];
    let currentPage = 1;
    let nextPageUrl: string | null = null;

    try {
      console.log(`[OpenLaws] Fetching statutes for jurisdiction: ${jurisdictionCode}`);

      while (currentPage <= maxPages) {
        console.log(`[OpenLaws] Fetching page ${currentPage} for ${jurisdictionCode}...`);

        // Retry logic with exponential backoff
        const response = await this.fetchWithRetry(
          nextPageUrl || '/divisions',
          nextPageUrl ? {} : {
            jurisdiction: jurisdictionCode,
            type: 'statute',
            page: currentPage,
            per_page: 100,
          }
        );

        if (!response) {
          console.error(`[OpenLaws] Failed to fetch page ${currentPage} after retries`);
          throw new Error(`Pagination failed at page ${currentPage}`);
        }

        // Extract statutes from response
        const pageStatutes = response.data?.results || response.data || [];
        if (pageStatutes.length === 0) {
          break; // No more statutes
        }
        allStatutes.push(...pageStatutes);

        // Check for next page using OpenLaws pagination structure
        nextPageUrl = response.data?.meta?.pagination?.next_page ||
                      response.data?.pagination?.next_page ||
                      response.data?.next_page ||
                      null;

        if (!nextPageUrl) {
          break; // No more pages
        }

        currentPage++;

        // Rate limiting: wait 200ms between requests (5 requests/second)
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      console.log(`[OpenLaws] Fetched ${allStatutes.length} statutes for ${jurisdictionCode}`);
      return allStatutes;
    } catch (error) {
      console.error(`[OpenLaws] Error fetching jurisdiction ${jurisdictionCode}:`, error);
      throw error; // Throw instead of returning partial data
    }
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

          // Retry on 429 (rate limit) or 5xx (server errors)
          if (status === 429 || (status && status >= 500)) {
            const backoffMs = Math.pow(2, attempt) * 1000; // Exponential: 1s, 2s, 4s
            console.warn(`[OpenLaws] ${status} error, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, backoffMs));
            continue;
          }

          // Don't retry on 4xx client errors (except 429)
          if (status && status >= 400 && status < 500) {
            throw error;
          }
        }

        // Network/timeout errors - retry
        console.warn(`[OpenLaws] Network error, retrying (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw lastError;
  }

  /**
   * Import statute from OpenLaws API into our database (upsert)
   * Uses composite key (citation + jurisdiction) to handle state/federal overlaps
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
        target: [statutes.citation, statutes.jurisdiction], // Composite key
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
      
      console.log(`[OpenLaws] Imported statute: ${openLawsStatute.citation} (${openLawsStatute.jurisdiction})`);
      return true;
    } catch (error) {
      console.error(`[OpenLaws] Error importing statute ${openLawsStatute.citation}:`, error);
      return false;
    }
  }

  /**
   * Bulk import statutes for a jurisdiction with rate limiting and retry logic
   */
  async bulkImportJurisdiction(
    jurisdictionCode: string,
    maxPages: number = 100,
    batchSize: number = 50
  ): Promise<{
    success: boolean;
    imported: number;
    failed: number;
    total: number;
  }> {
    console.log(`[OpenLaws] Starting bulk import for ${jurisdictionCode}...`);
    
    const statutesData = await this.getStatutesByJurisdiction(jurisdictionCode, maxPages);
    let imported = 0;
    let failed = 0;

    // Process in batches to avoid overwhelming the database
    for (let i = 0; i < statutesData.length; i += batchSize) {
      const batch = statutesData.slice(i, i + batchSize);
      console.log(`[OpenLaws] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(statutesData.length / batchSize)}`);

      for (const statute of batch) {
        const success = await this.importStatute(statute);
        if (success) {
          imported++;
        } else {
          failed++;
        }
      }

      // Rate limiting between batches: wait 500ms
      if (i + batchSize < statutesData.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`[OpenLaws] Bulk import complete: ${imported} imported, ${failed} failed out of ${statutesData.length} total`);
    return { 
      success: failed === 0, 
      imported, 
      failed,
      total: statutesData.length,
    };
  }
}

// Create singleton instance (will not work until API key is provided)
// Note: OpenLaws API uses /api/v1 prefix, not /v1
export const openLawsClient = new OpenLawsClient({
  baseUrl: process.env.OPENLAWS_API_URL || 'https://api.openlaws.us/api/v1',
  timeout: 30000,
});
