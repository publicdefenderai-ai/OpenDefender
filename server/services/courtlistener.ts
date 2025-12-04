interface CourtListenerAPI {
  searchOpinions(query: string, jurisdiction?: string): Promise<any>;
  semanticSearchOpinions(query: string, jurisdiction?: string, keywordFilter?: string): Promise<any>;
  hybridSearchOpinions(naturalLanguage: string, keywords: string, jurisdiction?: string): Promise<any>;
  getJudgeData(judgeId: string): Promise<any>;
  searchDockets(query: string): Promise<any>;
}

class CourtListenerService implements CourtListenerAPI {
  private baseUrl = 'https://www.courtlistener.com/api/rest/v4';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.COURTLISTENER_API_TOKEN || process.env.COURTLISTENER_API_KEY || '';
  }

  private async makeRequest(endpoint: string, params?: Record<string, string>) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Token ${this.apiKey}`;
    }

    try {
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        throw new Error(`CourtListener API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('CourtListener API request failed:', error);
      throw error;
    }
  }

  async searchOpinions(query: string, jurisdiction?: string) {
    const params: Record<string, string> = {
      q: query,
      format: 'json',
    };

    if (jurisdiction) {
      params.court = jurisdiction;
    }

    return this.makeRequest('/search/', params);
  }

  async semanticSearchOpinions(query: string, jurisdiction?: string, keywordFilter?: string) {
    const params: Record<string, string> = {
      q: query,
      search_type: 'semantic',
      format: 'json',
    };

    if (jurisdiction) {
      params.court = jurisdiction;
    }

    if (keywordFilter) {
      params.q = `"${keywordFilter}" ${query}`;
    }

    return this.makeRequest('/search/', params);
  }

  async hybridSearchOpinions(naturalLanguage: string, keywords: string, jurisdiction?: string) {
    const params: Record<string, string> = {
      q: `"${keywords}" ${naturalLanguage}`,
      search_type: 'semantic',
      format: 'json',
    };

    if (jurisdiction) {
      params.court = jurisdiction;
    }

    return this.makeRequest('/search/', params);
  }

  async getJudgeData(judgeId: string) {
    return this.makeRequest(`/people/${judgeId}/`);
  }

  async searchDockets(query: string) {
    const params = {
      q: query,
      type: 'r', // RECAP documents
      format: 'json',
    };

    return this.makeRequest('/search/', params);
  }

  async getCaseStatistics(jurisdiction: string) {
    // This would use CourtListener's bulk data or specific endpoints
    // to get case statistics for analysis
    try {
      const params = {
        court: jurisdiction,
        format: 'json',
        order_by: '-date_filed',
      };

      return this.makeRequest('/dockets/', params);
    } catch (error) {
      console.error('Failed to get case statistics:', error);
      return { results: [], count: 0 };
    }
  }
}

export const courtListenerService = new CourtListenerService();
