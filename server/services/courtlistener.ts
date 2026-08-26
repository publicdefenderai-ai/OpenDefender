import { errLog } from '../utils/dev-logger';
import { recordProviderMetric, type MetricsOutcome } from './operations-metrics';

interface CourtListenerAPI {
  searchOpinions(query: string, jurisdiction?: string, signal?: AbortSignal): Promise<any>;
  semanticSearchOpinions(query: string, jurisdiction?: string, keywordFilter?: string, signal?: AbortSignal): Promise<any>;
  hybridSearchOpinions(naturalLanguage: string, keywords: string, jurisdiction?: string, signal?: AbortSignal): Promise<any>;
  getJudgeData(judgeId: string, signal?: AbortSignal): Promise<any>;
  searchDockets(query: string, signal?: AbortSignal): Promise<any>;
}

class CourtListenerService implements CourtListenerAPI {
  private baseUrl = 'https://www.courtlistener.com/api/rest/v4';
  private apiKey: string;
  private requestTimeoutMs = 8_000;

  constructor() {
    this.apiKey = process.env.COURTLISTENER_API_TOKEN || process.env.COURTLISTENER_API_KEY || '';
  }

  private async makeRequest(endpoint: string, params?: Record<string, string>, externalSignal?: AbortSignal) {
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

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.requestTimeoutMs);
    const abortExternalRequest = () => controller.abort();
    const startedAt = Date.now();
    externalSignal?.addEventListener('abort', abortExternalRequest, { once: true });

    try {
      const response = await fetch(url.toString(), { headers, signal: controller.signal });
      if (!response.ok) {
        throw new Error(`CourtListener API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      void recordProviderMetric({
        provider: 'CourtListener',
        operation: 'api_request',
        outcome: 'success',
        durationMs: Date.now() - startedAt,
      });
      return data;
    } catch (error) {
      const timedOut = controller.signal.aborted && !externalSignal?.aborted;
      const outcome: MetricsOutcome = timedOut
        ? 'timeout'
        : externalSignal?.aborted
          ? 'cancelled'
          : 'failure';
      void recordProviderMetric({
        provider: 'CourtListener',
        operation: 'api_request',
        outcome,
        durationMs: Date.now() - startedAt,
      });
      errLog('CourtListener provider request failed', {
        endpoint,
        reason: outcome,
      });
      if (timedOut) {
        throw new Error('CourtListener API request timed out');
      }
      throw error;
    } finally {
      clearTimeout(timer);
      externalSignal?.removeEventListener('abort', abortExternalRequest);
    }
  }

  async searchOpinions(query: string, jurisdiction?: string, signal?: AbortSignal) {
    const params: Record<string, string> = {
      q: query,
      format: 'json',
    };

    if (jurisdiction) {
      params.court = jurisdiction;
    }

    return this.makeRequest('/search/', params, signal);
  }

  async semanticSearchOpinions(query: string, jurisdiction?: string, keywordFilter?: string, signal?: AbortSignal) {
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

    return this.makeRequest('/search/', params, signal);
  }

  async hybridSearchOpinions(naturalLanguage: string, keywords: string, jurisdiction?: string, signal?: AbortSignal) {
    const params: Record<string, string> = {
      q: `"${keywords}" ${naturalLanguage}`,
      search_type: 'semantic',
      format: 'json',
    };

    if (jurisdiction) {
      params.court = jurisdiction;
    }

    return this.makeRequest('/search/', params, signal);
  }

  async getJudgeData(judgeId: string, signal?: AbortSignal) {
    return this.makeRequest(`/people/${judgeId}/`, undefined, signal);
  }

  async searchDockets(query: string, signal?: AbortSignal) {
    const params = {
      q: query,
      type: 'r', // RECAP documents
      format: 'json',
    };

    return this.makeRequest('/search/', params, signal);
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
      errLog('Failed to get case statistics', error);
      return { results: [], count: 0 };
    }
  }
}

export const courtListenerService = new CourtListenerService();
