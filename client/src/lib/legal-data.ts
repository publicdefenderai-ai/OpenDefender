import { apiRequest } from "./queryClient";

export interface LegalResource {
  id: string;
  title: string;
  category: string;
  content: string;
  jurisdiction?: string;
  source: string;
  url?: string;
  lastUpdated: Date;
  isActive: boolean;
}

export interface CourtData {
  id: string;
  courtId: string;
  courtName: string;
  jurisdiction: string;
  address?: string;
  phone?: string;
  website?: string;
  hours?: Record<string, string>;
  services?: string[];
  lastUpdated: Date;
}

export interface LegalGuidance {
  overview: string;
  criticalAlerts: string[];
  immediateActions: Array<{
    action: string;
    urgency: 'urgent' | 'high' | 'medium' | 'low';
  }>;
  nextSteps: string[];
  deadlines: Array<{
    event: string;
    timeframe: string;
    description: string;
    priority: 'critical' | 'important' | 'normal';
    daysFromNow?: number;
  }>;
  rights: string[];
  resources: Array<{
    type: string;
    description: string;
    contact: string;
    hours?: string;
    website?: string;
  }>;
  warnings: string[];
  evidenceToGather: string[];
  courtPreparation: string[];
  avoidActions: string[];
  timeline: Array<{
    stage: string;
    description: string;
    timeframe: string;
    completed: boolean;
  }>;
  validation?: {
    confidenceScore: number;
    isValid: boolean;
    summary: string;
    checksPerformed: number;
    checksPassed: number;
    issues: Array<{
      type: string;
      severity: 'error' | 'warning' | 'info';
      message: string;
      suggestion?: string;
    }>;
  };
  chargeClassifications?: Array<{
    name: string;
    classification: string;
    code: string;
  }>;
  mockQA?: Array<{
    question: string;
    suggestedResponse: string;
    explanation: string;
    category?: 'identity' | 'charges' | 'circumstances' | 'plea' | 'procedural' | 'general';
  }>;
  collateralConsequences?: Array<{
    category: string;
    consequence: string;
    timing: string;
    actionNote: string;
  }>;
  uncertainties?: Array<{
    area: string;
    note: string;
  }>;
}

export const legalDataApi = {
  async getLegalResources(jurisdiction?: string, category?: string): Promise<{ success: boolean; resources: LegalResource[] }> {
    const params = new URLSearchParams();
    if (jurisdiction) params.append('jurisdiction', jurisdiction);
    if (category) params.append('category', category);
    
    const response = await apiRequest('GET', `/api/legal-resources?${params.toString()}`);
    return response.json();
  },

  async getCourtData(jurisdiction: string): Promise<{ success: boolean; courts: CourtData[]; localInfo?: any }> {
    const response = await apiRequest('GET', `/api/court-data/${jurisdiction}`);
    return response.json();
  },

  async searchCaseLaw(query: string, jurisdiction?: string): Promise<any> {
    const params = new URLSearchParams({ q: query });
    if (jurisdiction) params.append('jurisdiction', jurisdiction);
    
    const response = await apiRequest('GET', `/api/case-law/search?${params.toString()}`);
    return response.json();
  },

  async getStatutes(jurisdiction: string): Promise<any> {
    const response = await apiRequest('GET', `/api/statutes/${jurisdiction}`);
    return response.json();
  },

  async getSentencingGuidelines(jurisdiction: string): Promise<any> {
    const response = await apiRequest('GET', `/api/sentencing-guidelines/${jurisdiction}`);
    return response.json();
  },

  async generateLegalGuidance(caseData: any): Promise<{ success: boolean; sessionId: string; guidance: LegalGuidance }> {
    const response = await apiRequest('POST', '/api/legal-guidance', caseData);
    return response.json();
  },

  async streamLegalGuidance(
    caseData: any,
    onProgress: (charsReceived: number, progress: number) => void
  ): Promise<{ success: boolean; sessionId: string; guidance: LegalGuidance }> {
    const response = await fetch('/api/legal-guidance/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData),
    });

    if (!response.ok || !response.body) {
      throw new Error(`HTTP ${response.status}: Failed to start guidance stream`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let totalChars = 0;
    const estimatedTotal = 13000; // ~3500 tokens × ~3.7 chars avg

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE messages are separated by double newline
      const messages = buffer.split('\n\n');
      buffer = messages.pop() ?? '';

      for (const message of messages) {
        const line = message.trim();
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr) continue;

        let event: any;
        try { event = JSON.parse(jsonStr); } catch { continue; }

        if (event.type === 'chunk') {
          totalChars += (event.text as string).length;
          const progress = Math.min(92, Math.round((totalChars / estimatedTotal) * 100));
          onProgress(totalChars, progress);
        } else if (event.type === 'complete') {
          onProgress(totalChars, 100);
          return event as { success: boolean; sessionId: string; guidance: LegalGuidance };
        } else if (event.type === 'error') {
          throw new Error((event.error as string) || 'Streaming guidance failed');
        }
      }
    }

    throw new Error('Guidance stream ended without a complete event');
  },

  async getLegalGuidance(sessionId: string): Promise<{ success: boolean; guidance: LegalGuidance; case: any }> {
    const response = await apiRequest('GET', `/api/legal-guidance/${sessionId}`);
    return response.json();
  },

  async deleteLegalGuidance(sessionId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiRequest('DELETE', `/api/legal-guidance/${sessionId}`);
    return response.json();
  },
};
