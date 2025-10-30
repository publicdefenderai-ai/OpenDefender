import { courtListenerService } from './courtlistener';
import { govInfoService } from './govinfo';
import { californiaLawsService } from './california-laws';
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
      // First, query statutes from local storage
      const localStatutes = await storage.getStatutes(jurisdiction, searchQuery);
      
      // For California, also try fetching from California Laws API if search query provided
      let apiStatutes: any[] = [];
      if (jurisdiction.toUpperCase() === 'CA' && searchQuery) {
        try {
          const caResult = await californiaLawsService.searchSections('PEN', searchQuery);
          if (caResult && caResult.sections.length > 0) {
            // Transform CA API results to our statute format
            apiStatutes = caResult.sections.map(section => ({
              citation: `Cal. Penal Code § ${section.section}`,
              title: section.title || `Section ${section.section}`,
              summary: section.content?.substring(0, 200) + '...' || '',
              content: section.content,
              penalties: 'See statute text for penalty details',
              category: 'criminal',
              relatedCharges: [],
              url: `https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=${section.section}`,
              source: 'California Legislature',
              jurisdiction: 'CA',
            }));
          }
        } catch (apiError) {
          console.log('CA Laws API supplemental search failed, using local data only:', apiError);
        }
      }
      
      // Combine local and API results, removing duplicates by citation
      const allStatutes = [...localStatutes.map(s => ({
        id: s.id,
        citation: s.citation,
        title: s.title,
        summary: s.summary,
        content: s.content,
        penalties: s.penalties,
        category: s.category,
        relatedCharges: s.relatedCharges,
        url: s.url,
        source: s.source,
        jurisdiction: s.jurisdiction,
      }))];
      
      // Add API statutes that aren't already in local data
      const localCitations = new Set(allStatutes.map(s => s.citation));
      apiStatutes.forEach(apiStat => {
        if (!localCitations.has(apiStat.citation)) {
          allStatutes.push(apiStat);
        }
      });
      
      return {
        success: true,
        jurisdiction,
        count: allStatutes.length,
        statutes: allStatutes,
        source: jurisdiction.toLowerCase() === 'federal' 
          ? 'GovInfo.gov' 
          : jurisdiction.toUpperCase() === 'CA' && apiStatutes.length > 0
          ? 'State Laws Database + California Legislature API'
          : 'State Laws Database',
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
