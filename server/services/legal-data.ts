import { courtListenerService } from './courtlistener';
import { govInfoService } from './govinfo';
import { storage } from '../storage';
import { errLog } from '../utils/dev-logger';

interface LegalDataService {
  searchCaseLaw(query: string, jurisdiction?: string, searchType?: 'keyword' | 'semantic'): Promise<any>;
  semanticSearchCaseLaw(query: string, jurisdiction?: string, keywordFilter?: string): Promise<any>;
  hybridSearchCaseLaw(naturalLanguage: string, keywords: string, jurisdiction?: string): Promise<any>;
  getStatutes(jurisdiction: string, searchQuery?: string): Promise<any>;
  searchFederalStatutes(query: string, title?: string, section?: string): Promise<any>;
  getSentencingGuidelines(jurisdiction: string): Promise<any>;
  getLocalCourtInfo(jurisdiction: string): Promise<any>;
}

class LegalDataServiceImpl implements LegalDataService {
  async searchCaseLaw(query: string, jurisdiction?: string, searchType: 'keyword' | 'semantic' = 'keyword') {
    try {
      let results;
      if (searchType === 'semantic') {
        results = await courtListenerService.semanticSearchOpinions(query, jurisdiction);
      } else {
        results = await courtListenerService.searchOpinions(query, jurisdiction);
      }
      
      return {
        success: true,
        results: results.results || [],
        count: results.count || 0,
        source: 'CourtListener',
        searchType,
      };
    } catch (error) {
      errLog('Case law search failed', error);
      return {
        success: false,
        error: 'Failed to search case law',
        results: [],
        count: 0,
      };
    }
  }

  async semanticSearchCaseLaw(query: string, jurisdiction?: string, keywordFilter?: string) {
    try {
      const results = await courtListenerService.semanticSearchOpinions(query, jurisdiction, keywordFilter);
      
      return {
        success: true,
        results: results.results || [],
        count: results.count || 0,
        source: 'CourtListener Semantic Search',
        searchType: 'semantic',
      };
    } catch (error) {
      errLog('Semantic case law search failed', error);
      return {
        success: false,
        error: 'Failed to perform semantic search',
        results: [],
        count: 0,
      };
    }
  }

  async hybridSearchCaseLaw(naturalLanguage: string, keywords: string, jurisdiction?: string) {
    try {
      const results = await courtListenerService.hybridSearchOpinions(naturalLanguage, keywords, jurisdiction);
      
      return {
        success: true,
        results: results.results || [],
        count: results.count || 0,
        source: 'CourtListener Hybrid Search',
        searchType: 'hybrid',
        keywords,
        naturalLanguage,
      };
    } catch (error) {
      errLog('Hybrid case law search failed', error);
      return {
        success: false,
        error: 'Failed to perform hybrid search',
        results: [],
        count: 0,
      };
    }
  }

  async getStatutes(jurisdiction: string, searchQuery?: string) {
    try {
      // Query statutes from local storage (seed data)
      const statutes = await storage.getStatutes(jurisdiction, searchQuery);
      
      return {
        success: true,
        jurisdiction,
        count: statutes.length,
        statutes: statutes.map(s => ({
          id: s.id,
          citation: s.citation,
          title: s.title,
          summary: s.summary,
          content: s.content,
          penalties: s.penalties,
          category: s.category,
          relatedCharges: s.relatedCharges,
          url: s.url,
          source: s.sourceApi || 'seed_data',
          jurisdiction: s.jurisdiction,
        })),
        source: jurisdiction.toLowerCase() === 'federal' 
          ? 'GovInfo.gov + Seed Data' 
          : 'State Laws Seed Data',
      };
    } catch (error) {
      errLog('Statute search failed', error);
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
      errLog('Federal statute search failed', error);
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
      return {
        success: true,
        jurisdiction,
        guidelines: [],
        source: 'US Sentencing Commission',
        note: 'Sentencing guidelines vary by jurisdiction and case specifics. Consult the US Sentencing Commission (ussc.gov) or a licensed attorney for guidance specific to your case.',
      };
    } catch (error) {
      errLog('Sentencing guidelines fetch failed', error);
      return {
        success: false,
        error: 'Failed to fetch sentencing guidelines',
        guidelines: [],
      };
    }
  }

  async getLocalCourtInfo(jurisdiction: string) {
    try {
      return {
        success: true,
        jurisdiction,
        courts: [],
        publicDefenders: [],
        note: 'Use the court locator or public defender search features on this site to find real court and public defender information by ZIP code.',
      };
    } catch (error) {
      errLog('Local court info fetch failed', error);
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
      // Import dynamically to avoid circular dependencies
      const { bjsStatisticsService } = await import('./bjs-statistics');
      
      // Get real crime statistics from BJS API
      const stats = await bjsStatisticsService.getCrimeStatistics();
      
      return {
        success: true,
        statistics: {
          totalVictimizations: stats.totalVictimizations,
          violentCrimes: stats.violentCrimeCount,
          propertyCrimes: stats.propertyCrimeCount,
          byType: stats.byType,
          yearRange: stats.yearRange,
        },
        source: stats.metadata.source,
        note: stats.metadata.note,
      };
    } catch (error) {
      errLog('BJS statistics fetch failed', error);
      return {
        success: false,
        error: 'Failed to fetch crime statistics',
        statistics: {},
      };
    }
  }
}

export const legalDataService = new LegalDataServiceImpl();
