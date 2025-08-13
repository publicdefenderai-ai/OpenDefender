// CourtListener API integration
export interface CourtListenerOpinion {
  id: number;
  court: string;
  date_filed: string;
  case_name: string;
  snippet: string;
  download_url: string;
  absolute_url: string;
}

export interface CourtListenerJudge {
  id: number;
  name_full: string;
  date_dob: string;
  date_dod: string;
  court: string;
  position_type: string;
}

export const courtListenerApi = {
  baseUrl: 'https://www.courtlistener.com/api/rest/v4',

  async searchOpinions(query: string, court?: string): Promise<{
    count: number;
    results: CourtListenerOpinion[];
  }> {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
    });

    if (court) {
      params.append('court', court);
    }

    try {
      const response = await fetch(`${this.baseUrl}/search/?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`CourtListener API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CourtListener search failed:', error);
      return { count: 0, results: [] };
    }
  },

  async getJudge(judgeId: number): Promise<CourtListenerJudge | null> {
    try {
      const response = await fetch(`${this.baseUrl}/people/${judgeId}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`CourtListener API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CourtListener judge fetch failed:', error);
      return null;
    }
  },

  async searchDockets(query: string): Promise<any> {
    const params = new URLSearchParams({
      q: query,
      type: 'r', // RECAP documents
      format: 'json',
    });

    try {
      const response = await fetch(`${this.baseUrl}/search/?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`CourtListener API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CourtListener docket search failed:', error);
      return { count: 0, results: [] };
    }
  },
};
