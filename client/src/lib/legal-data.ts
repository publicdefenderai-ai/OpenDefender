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

  async getLegalGuidance(sessionId: string): Promise<{ success: boolean; guidance: LegalGuidance; case: any }> {
    const response = await apiRequest('GET', `/api/legal-guidance/${sessionId}`);
    return response.json();
  },

  async deleteLegalGuidance(sessionId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiRequest('DELETE', `/api/legal-guidance/${sessionId}`);
    return response.json();
  },
};
