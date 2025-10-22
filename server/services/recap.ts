import axios from 'axios';

const COURTLISTENER_BASE_URL = 'https://www.courtlistener.com/api/rest/v4';
const COURTLISTENER_TOKEN = process.env.COURTLISTENER_API_TOKEN;

if (!COURTLISTENER_TOKEN) {
  console.warn('Warning: COURTLISTENER_API_TOKEN not set. RECAP features will be limited.');
}

interface CourtListenerSearchParams {
  q?: string;
  case_name?: string;
  docket_number?: string;
  court?: string;
  filed_after?: string;
  filed_before?: string;
  type?: 'r' | 'o' | 'oa'; // r=RECAP, o=opinions, oa=oral arguments
  order_by?: string;
}

interface RecapDocket {
  id: number;
  absolute_url: string;
  case_name: string;
  case_name_short: string;
  court: string;
  court_id: string;
  docket_number: string;
  date_filed: string;
  date_last_filing: string;
  jurisdiction_type: string;
  nature_of_suit: string;
  cause: string;
  assigned_to_str: string;
  referred_to_str: string;
  pacer_case_id: string;
}

interface RecapDocument {
  id: number;
  docket_entry_id: number;
  description: string;
  entry_number: number;
  date_filed: string;
  absolute_url: string;
  filepath_local: string;
  is_available: boolean;
  is_free_on_pacer: boolean;
  page_count: number;
}

interface Opinion {
  id: number;
  absolute_url: string;
  case_name: string;
  case_name_short: string;
  court: string;
  court_id: string;
  docket_number: string;
  date_filed: string;
  citation: string[];
  status: string;
  snippet: string;
}

interface SearchResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export class RecapService {
  private headers: Record<string, string>;

  constructor() {
    this.headers = COURTLISTENER_TOKEN
      ? { 'Authorization': `Token ${COURTLISTENER_TOKEN}` }
      : {};
  }

  async searchRECAPDockets(params: CourtListenerSearchParams): Promise<SearchResponse<RecapDocket>> {
    try {
      const response = await axios.get(`${COURTLISTENER_BASE_URL}/dockets/`, {
        headers: this.headers,
        params: {
          ...params,
          format: 'json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching RECAP dockets:', error);
      throw new Error('Failed to search RECAP archive');
    }
  }

  async searchOpinions(params: CourtListenerSearchParams): Promise<SearchResponse<Opinion>> {
    try {
      const response = await axios.get(`${COURTLISTENER_BASE_URL}/search/`, {
        headers: this.headers,
        params: {
          ...params,
          type: 'o',
          format: 'json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching opinions:', error);
      throw new Error('Failed to search case law opinions');
    }
  }

  async getDocket(docketId: number): Promise<RecapDocket> {
    try {
      const response = await axios.get(`${COURTLISTENER_BASE_URL}/dockets/${docketId}/`, {
        headers: this.headers,
        params: { format: 'json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching docket:', error);
      throw new Error('Failed to fetch docket details');
    }
  }

  async getDocketDocuments(docketId: number): Promise<SearchResponse<RecapDocument>> {
    try {
      const response = await axios.get(`${COURTLISTENER_BASE_URL}/recap-documents/`, {
        headers: this.headers,
        params: {
          docket_id: docketId,
          format: 'json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching docket documents:', error);
      throw new Error('Failed to fetch docket documents');
    }
  }

  async searchUnifiedCourtRecords(query: {
    searchTerm?: string;
    caseName?: string;
    docketNumber?: string;
    court?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const params: CourtListenerSearchParams = {
      q: query.searchTerm,
      case_name: query.caseName,
      docket_number: query.docketNumber,
      court: query.court,
      filed_after: query.dateFrom,
      filed_before: query.dateTo,
      order_by: '-date_filed'
    };

    // Search both RECAP dockets and opinions in parallel
    const [recapResults, opinionResults] = await Promise.allSettled([
      this.searchRECAPDockets(params),
      this.searchOpinions(params)
    ]);

    return {
      recap: recapResults.status === 'fulfilled' ? recapResults.value : { count: 0, results: [] },
      opinions: opinionResults.status === 'fulfilled' ? opinionResults.value : { count: 0, results: [] },
      hasRecapAccess: !!COURTLISTENER_TOKEN
    };
  }

  checkRECAPAvailability(document: any): boolean {
    return document.is_available === true || document.filepath_local != null;
  }

  getPACERUrl(pacerCaseId: string, court: string): string {
    const courtCode = court.toLowerCase();
    return `https://ecf.${courtCode}.uscourts.gov/cgi-bin/DktRpt.pl?${pacerCaseId}`;
  }

  getRECAPUrl(absoluteUrl: string): string {
    return `https://www.courtlistener.com${absoluteUrl}`;
  }
}

export const recapService = new RecapService();
