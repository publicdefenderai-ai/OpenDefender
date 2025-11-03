import axios from 'axios';

const LEGISCAN_BASE_URL = 'https://api.legiscan.com/';
const API_KEY = process.env.LEGISCAN_API_KEY;

interface LegiScanBillSummary {
  bill_id: number;
  bill_number: string;
  title: string;
  description: string;
  state: string;
  state_id: number;
  status: number;
  status_desc: string;
  url: string;
  change_hash: string;
  last_action_date: string;
  last_action: string;
}

interface LegiScanSearchResult {
  summary: {
    count: number;
    page: number;
    relevancy: number;
  };
  [key: string]: LegiScanBillSummary | any;
}

interface LegiScanBillDetail {
  bill_id: number;
  bill_number: string;
  title: string;
  description: string;
  state: string;
  session: {
    session_id: number;
    session_name: string;
    session_title: string;
    year_start: number;
    year_end: number;
  };
  status: number;
  status_desc: string;
  url: string;
  state_link: string;
  change_hash: string;
  created: string;
  updated: string;
  history: Array<{
    date: string;
    action: string;
    chamber: string;
    chamber_id: number;
    importance: number;
  }>;
  sponsors: Array<{
    people_id: number;
    person_hash: string;
    party_id: number;
    party: string;
    role_id: number;
    role: string;
    name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix: string;
    sponsor_type_id: number;
    sponsor_order: number;
  }>;
  texts: Array<{
    doc_id: number;
    date: string;
    type: string;
    type_id: number;
    mime: string;
    mime_id: number;
    url: string;
    state_link: string;
  }>;
}

class LegiScanService {
  private apiKey: string;

  constructor() {
    if (!API_KEY) {
      console.warn('LEGISCAN_API_KEY not set - LegiScan integration will not work');
      this.apiKey = '';
    } else {
      this.apiKey = API_KEY;
    }
  }

  /**
   * Search for bills across all states or specific state
   * @param query - Search query (supports full-text search syntax)
   * @param state - Two-letter state code (e.g., 'CA', 'TX') or 'ALL' for national search
   * @param year - Year filter: 1 = prior year, 2 = current year, 3 = prior + current, 4 = all years
   */
  async searchBills(query: string, state: string = 'ALL', year: number = 2): Promise<LegiScanSearchResult | null> {
    if (!this.apiKey) {
      console.error('LegiScan API key not configured');
      return null;
    }

    try {
      const response = await axios.get(LEGISCAN_BASE_URL, {
        params: {
          key: this.apiKey,
          op: 'search',
          state,
          query,
          year,
        },
        timeout: 15000,
      });

      if (response.data.status === 'OK') {
        return response.data.searchresult;
      } else {
        console.error('LegiScan search error:', response.data);
        return null;
      }
    } catch (error) {
      console.error('LegiScan search failed:', error);
      return null;
    }
  }

  /**
   * Search for enacted bills that modify criminal statutes
   * @param state - Two-letter state code or 'ALL'
   * @param year - Year filter
   */
  async searchEnactedCriminalBills(state: string = 'ALL', year: number = 2): Promise<LegiScanBillSummary[]> {
    // Search for bills with "criminal code", "penal code", or "criminal law" that are enacted
    const queries = [
      '"criminal code" AND status:passed',
      '"penal code" AND status:passed',
      '"criminal law" AND status:passed',
    ];

    const allResults: LegiScanBillSummary[] = [];
    const seenBillIds = new Set<number>();

    for (const query of queries) {
      const result = await this.searchBills(query, state, year);
      
      if (result) {
        // Extract bill summaries (skip 'summary' key)
        Object.keys(result).forEach(key => {
          if (key !== 'summary') {
            const bill = result[key] as LegiScanBillSummary;
            if (!seenBillIds.has(bill.bill_id)) {
              seenBillIds.add(bill.bill_id);
              allResults.push(bill);
            }
          }
        });
      }

      // Rate limiting - wait 1 second between queries
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return allResults;
  }

  /**
   * Get detailed information about a specific bill
   * @param billId - LegiScan bill ID
   */
  async getBillDetails(billId: number): Promise<LegiScanBillDetail | null> {
    if (!this.apiKey) {
      console.error('LegiScan API key not configured');
      return null;
    }

    try {
      const response = await axios.get(LEGISCAN_BASE_URL, {
        params: {
          key: this.apiKey,
          op: 'getBill',
          id: billId,
        },
        timeout: 15000,
      });

      if (response.data.status === 'OK') {
        return response.data.bill;
      } else {
        console.error('LegiScan getBill error:', response.data);
        return null;
      }
    } catch (error) {
      console.error(`LegiScan getBill failed for bill ${billId}:`, error);
      return null;
    }
  }

  /**
   * Get master list of all bills for a state session
   * Used for change detection - compare change_hash to detect updates
   * @param state - Two-letter state code
   * @param sessionId - Optional specific session ID
   */
  async getMasterList(state: string, sessionId?: number): Promise<any> {
    if (!this.apiKey) {
      console.error('LegiScan API key not configured');
      return null;
    }

    try {
      const params: any = {
        key: this.apiKey,
        op: 'getMasterListRaw',
        state,
      };

      if (sessionId) {
        params.id = sessionId;
      }

      const response = await axios.get(LEGISCAN_BASE_URL, {
        params,
        timeout: 30000, // Longer timeout for large master lists
      });

      if (response.data.status === 'OK') {
        return response.data.masterlist;
      } else {
        console.error('LegiScan getMasterList error:', response.data);
        return null;
      }
    } catch (error) {
      console.error(`LegiScan getMasterList failed for ${state}:`, error);
      return null;
    }
  }

  /**
   * Get list of available sessions for a state
   * @param state - Two-letter state code
   */
  async getSessionList(state: string): Promise<any> {
    if (!this.apiKey) {
      console.error('LegiScan API key not configured');
      return null;
    }

    try {
      const response = await axios.get(LEGISCAN_BASE_URL, {
        params: {
          key: this.apiKey,
          op: 'getSessionList',
          state,
        },
        timeout: 15000,
      });

      if (response.data.status === 'OK') {
        return response.data.sessions;
      } else {
        console.error('LegiScan getSessionList error:', response.data);
        return null;
      }
    } catch (error) {
      console.error(`LegiScan getSessionList failed for ${state}:`, error);
      return null;
    }
  }

  /**
   * Monitor changes for a specific state
   * Returns bills that have changed since last check (detected via change_hash)
   * @param state - Two-letter state code
   * @param previousHashes - Map of bill_id -> change_hash from previous check
   */
  async detectChanges(state: string, previousHashes: Map<number, string>): Promise<LegiScanBillSummary[]> {
    const masterList = await this.getMasterList(state);
    
    if (!masterList) {
      return [];
    }

    const changedBills: LegiScanBillSummary[] = [];

    Object.keys(masterList).forEach(key => {
      const bill = masterList[key];
      const previousHash = previousHashes.get(bill.bill_id);

      // Bill is new or changed
      if (!previousHash || previousHash !== bill.change_hash) {
        changedBills.push(bill);
      }
    });

    return changedBills;
  }
}

export const legiScanService = new LegiScanService();
