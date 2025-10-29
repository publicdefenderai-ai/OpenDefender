import { courtListenerService } from './courtlistener';
import { govInfoService } from './govinfo';
import { storage } from '../storage';

interface LegalDataService {
  searchCaseLaw(query: string, jurisdiction?: string): Promise<any>;
  getStatutes(jurisdiction: string, searchQuery?: string): Promise<any>;
  searchFederalStatutes(query: string, title?: string, section?: string): Promise<any>;
  getSentencingGuidelines(jurisdiction: string): Promise<any>;
  getLocalCourtInfo(jurisdiction: string): Promise<any>;
}

class LegalDataServiceImpl implements LegalDataService {
  async searchCaseLaw(query: string, jurisdiction?: string) {
    try {
      // Use CourtListener for case law search
      const results = await courtListenerService.searchOpinions(query, jurisdiction);
      
      return {
        success: true,
        results: results.results || [],
        count: results.count || 0,
        source: 'CourtListener',
      };
    } catch (error) {
      console.error('Case law search failed:', error);
      return {
        success: false,
        error: 'Failed to search case law',
        results: [],
        count: 0,
      };
    }
  }

  async getStatutes(jurisdiction: string, searchQuery?: string) {
    try {
      // Query statutes from storage (works for both federal and state)
      const statutes = await storage.getStatutes(jurisdiction, searchQuery);
      
      return {
        success: true,
        jurisdiction,
        count: statutes.length,
        statutes: statutes.map(statute => ({
          id: statute.id,
          citation: statute.citation,
          title: statute.title,
          summary: statute.summary,
          content: statute.content,
          penalties: statute.penalties,
          category: statute.category,
          relatedCharges: statute.relatedCharges,
          url: statute.url,
          source: statute.source,
          jurisdiction: statute.jurisdiction,
        })),
        source: jurisdiction.toLowerCase() === 'federal' ? 'GovInfo.gov' : 'State Laws Database',
      };
    } catch (error) {
      console.error('Statute search failed:', error);
      return {
        success: false,
        error: 'Failed to fetch statutes',
        statutes: [],
        count: 0,
      };
    }
  }

  async searchFederalStatutes(query: string, title?: string, section?: string) {
    try {
      const results = await govInfoService.searchUSCode(title || '18', section);
      
      if (!results) {
        return {
          success: false,
          error: 'GovInfo API unavailable',
          statutes: [],
        };
      }

      const statutes = results.packages.map(pkg => ({
        packageId: pkg.packageId,
        title: pkg.title,
        citation: this.extractCitation(pkg.title, pkg.packageId),
        url: `https://www.govinfo.gov/app/details/${pkg.packageId}`,
        dateIssued: pkg.dateIssued,
        source: 'GovInfo.gov',
      }));

      return {
        success: true,
        jurisdiction: 'federal',
        count: results.count,
        statutes,
        source: 'GovInfo.gov',
      };
    } catch (error) {
      console.error('Federal statute search failed:', error);
      return {
        success: false,
        error: 'Failed to search federal statutes',
        statutes: [],
      };
    }
  }

  private extractCitation(title: string, packageId: string): string {
    // Try to extract citation from title or packageId
    // packageId format: USCODE-2023-title18-partI-chap1-sec1
    const match = packageId.match(/title(\d+).*?sec(\d+)/i);
    if (match) {
      return `${match[1]} USC § ${match[2]}`;
    }
    return title;
  }

  async getSentencingGuidelines(jurisdiction: string) {
    try {
      // This would integrate with US Sentencing Commission API
      const mockGuidelines = {
        success: true,
        jurisdiction,
        guidelines: [
          {
            offense: 'Drug Trafficking',
            baseLevel: 12,
            enhancements: ['Criminal History', 'Leadership Role'],
            source: 'US Sentencing Commission',
          },
        ],
        source: 'US Sentencing Commission',
      };

      return mockGuidelines;
    } catch (error) {
      console.error('Sentencing guidelines fetch failed:', error);
      return {
        success: false,
        error: 'Failed to fetch sentencing guidelines',
        guidelines: [],
      };
    }
  }

  async getLocalCourtInfo(jurisdiction: string) {
    try {
      // This would scrape or use APIs from state court administration sites
      const mockCourtInfo = {
        success: true,
        jurisdiction,
        courts: [
          {
            name: 'Superior Court',
            address: '123 Court St, City, State 12345',
            phone: '(555) 123-4567',
            hours: 'Mon-Fri 9:00 AM - 5:00 PM',
            services: ['Criminal', 'Civil', 'Family'],
          },
        ],
        publicDefenders: [
          {
            office: 'Public Defender Office',
            phone: '(555) 987-6543',
            address: '456 Legal Ave, City, State 12345',
          },
        ],
      };

      return mockCourtInfo;
    } catch (error) {
      console.error('Local court info fetch failed:', error);
      return {
        success: false,
        error: 'Failed to fetch local court information',
        courts: [],
        publicDefenders: [],
      };
    }
  }

  async getDOJStatistics() {
    try {
      // This would integrate with DOJ APIs for crime statistics
      const mockStats = {
        success: true,
        statistics: {
          federalCases: 75000,
          convictionRate: 0.89,
          averageSentence: 36, // months
        },
        source: 'Department of Justice',
      };

      return mockStats;
    } catch (error) {
      console.error('DOJ statistics fetch failed:', error);
      return {
        success: false,
        error: 'Failed to fetch DOJ statistics',
        statistics: {},
      };
    }
  }
}

export const legalDataService = new LegalDataServiceImpl();
