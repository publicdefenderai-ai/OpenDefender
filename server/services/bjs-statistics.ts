import axios from 'axios';
import { isViolentCrime, CRIME_CATEGORIES } from '@shared/bjs-code-mappings';

/**
 * Bureau of Justice Statistics (BJS) API Integration
 * Provides access to National Crime Victimization Survey (NCVS) data
 * 
 * API Documentation: https://bjs.ojp.gov/national-crime-victimization-survey-ncvs-api
 * No API key required for basic access
 */

const BJS_BASE_URL = 'https://api.ojp.gov/bjsdataset/v1';

// NCVS Dataset IDs (updated July 2025)
const DATASETS = {
  PERSONAL_VICTIMIZATION: 'gcuy-rt5g',
  PERSONAL_POPULATION: 'r4j4-fdwx',
  HOUSEHOLD_VICTIMIZATION: 'gkck-euys',
  HOUSEHOLD_POPULATION: 'ya4e-n9zp',
};

interface BJSQueryParams {
  year?: number | number[];
  limit?: number;
  offset?: number;
}

interface CrimeStatistics {
  totalVictimizations: number;
  violentCrimeCount: number;
  propertyCrimeCount: number;
  byType: {
    rape: number;
    robbery: number;
    assault: number;
    theft: number;
    burglary: number;
    motorVehicleTheft: number;
  };
  yearRange: {
    start: number;
    end: number;
  };
  metadata: {
    source: string;
    dataType: string;
    note: string;
  };
  lastUpdated: string;
}

class BJSStatisticsService {
  /**
   * Fetch data from BJS API
   */
  private async fetchDataset(
    datasetId: string,
    params: BJSQueryParams = {}
  ): Promise<any[]> {
    try {
      const queryParams: any = {
        $limit: params.limit || 50000, // Default to 50k records (API default is 1000)
      };

      // Add year filter if specified
      if (params.year) {
        if (Array.isArray(params.year)) {
          queryParams.$where = `year in (${params.year.map(y => `"${y}"`).join(', ')})`;
        } else {
          queryParams.year = params.year.toString();
        }
      }

      if (params.offset) {
        queryParams.$offset = params.offset;
      }

      const url = `${BJS_BASE_URL}/${datasetId}.json`;
      
      console.log(`Fetching BJS dataset ${datasetId} with params:`, queryParams);
      
      const response = await axios.get(url, {
        params: queryParams,
        timeout: 30000, // 30 second timeout
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`BJS API error for dataset ${datasetId}:`, {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      } else {
        console.error(`BJS API fetch failed for ${datasetId}:`, error);
      }
      throw error;
    }
  }

  /**
   * Get aggregated crime statistics from NCVS data
   */
  async getCrimeStatistics(
    startYear?: number,
    endYear?: number
  ): Promise<CrimeStatistics> {
    try {
      const currentYear = new Date().getFullYear();
      const start = startYear || currentYear - 5; // Default to last 5 years
      const end = endYear || currentYear - 1; // Latest complete year

      const years = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      );

      // Fetch personal victimization data
      const victimizationData = await this.fetchDataset(
        DATASETS.PERSONAL_VICTIMIZATION,
        { year: years, limit: 100000 }
      );

      // Fetch household property victimization data
      const propertyData = await this.fetchDataset(
        DATASETS.HOUSEHOLD_VICTIMIZATION,
        { year: years, limit: 100000 }
      );

      // Aggregate statistics by crime type
      const crimeStats = {
        rape: 0,
        robbery: 0,
        assault: 0,
        theft: 0,
        burglary: 0,
        motorVehicleTheft: 0,
      };

      // Apply NCVS weighting to get accurate statistics
      // Use wgtviccy or newwgt field for proper victimization counts
      let totalWeightedVictimizations = 0;

      // Count personal victimizations by type using newoff code with weighting
      victimizationData.forEach((record: any) => {
        const offenseCode = record.newoff;
        const weight = parseFloat(record.wgtviccy || record.newwgt || '1');
        
        totalWeightedVictimizations += weight;
        
        if (CRIME_CATEGORIES.RAPE_SEXUAL_ASSAULT.includes(offenseCode)) {
          crimeStats.rape += weight;
        } else if (CRIME_CATEGORIES.ROBBERY.includes(offenseCode)) {
          crimeStats.robbery += weight;
        } else if (CRIME_CATEGORIES.ASSAULT.includes(offenseCode)) {
          crimeStats.assault += weight;
        } else if (CRIME_CATEGORIES.THEFT.includes(offenseCode)) {
          crimeStats.theft += weight;
        }
      });

      // Count property crimes with weighting
      // Note: Property data structure may differ - using basic weighting
      propertyData.forEach((record: any) => {
        const weight = parseFloat(record.wgtviccy || record.newwgt || '1');
        totalWeightedVictimizations += weight;
        
        // Property crimes: burglary, motor vehicle theft, other theft
        const crimeCode = record.newcrime;
        if (crimeCode === '1') {
          crimeStats.burglary += weight;
        } else if (crimeCode === '2') {
          crimeStats.motorVehicleTheft += weight;
        } else {
          crimeStats.theft += weight;
        }
      });

      const totalVictimizations = Math.round(totalWeightedVictimizations);
      
      // Calculate weighted crime totals (not rates - rates require population denominators)
      const violentCrimes = Math.round(crimeStats.rape + crimeStats.robbery + crimeStats.assault);
      const propertyCrimes = Math.round(crimeStats.theft + crimeStats.burglary + crimeStats.motorVehicleTheft);

      // Round all crime stats for cleaner output
      const roundedStats = {
        rape: Math.round(crimeStats.rape),
        robbery: Math.round(crimeStats.robbery),
        assault: Math.round(crimeStats.assault),
        theft: Math.round(crimeStats.theft),
        burglary: Math.round(crimeStats.burglary),
        motorVehicleTheft: Math.round(crimeStats.motorVehicleTheft),
      };

      return {
        totalVictimizations,
        violentCrimeCount: violentCrimes,
        propertyCrimeCount: propertyCrimes,
        byType: roundedStats,
        yearRange: {
          start,
          end,
        },
        metadata: {
          source: 'Bureau of Justice Statistics - National Crime Victimization Survey',
          dataType: 'Weighted victimization estimates',
          note: 'Statistics are weighted using NCVS survey weights for national representativeness',
        },
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to get crime statistics:', error);
      throw new Error('Failed to fetch BJS crime statistics');
    }
  }

  /**
   * Get victimization trends over time
   */
  async getVictimizationTrends(years: number[]): Promise<any> {
    try {
      const data = await this.fetchDataset(
        DATASETS.PERSONAL_VICTIMIZATION,
        { year: years, limit: 100000 }
      );

      // Group by year and crime type
      const trendsByYear: Record<number, any> = {};

      data.forEach((record: any) => {
        const year = parseInt(record.year);
        if (!trendsByYear[year]) {
          trendsByYear[year] = {
            year,
            total: 0,
            violent: 0,
            property: 0,
          };
        }

        const offenseCode = record.newoff;
        const weight = parseFloat(record.wgtviccy || record.newwgt || '1');
        
        // Apply weighting for trends
        trendsByYear[year].total += weight;
        
        // Codes 1-4 are violent crimes (rape, sexual assault, robbery, assault)
        if (isViolentCrime(offenseCode)) {
          trendsByYear[year].violent += weight;
        } else {
          trendsByYear[year].property += weight;
        }
      });

      return {
        trends: Object.values(trendsByYear).sort((a: any, b: any) => a.year - b.year),
        source: 'Bureau of Justice Statistics - NCVS',
      };
    } catch (error) {
      console.error('Failed to get victimization trends:', error);
      throw new Error('Failed to fetch victimization trends');
    }
  }

  /**
   * Get demographic breakdown of victimizations
   */
  async getDemographicBreakdown(year: number): Promise<any> {
    try {
      // Fetch both victimization and population data
      const [victimizations, population] = await Promise.all([
        this.fetchDataset(DATASETS.PERSONAL_VICTIMIZATION, { year, limit: 50000 }),
        this.fetchDataset(DATASETS.PERSONAL_POPULATION, { year, limit: 200000 }),
      ]);

      const demographics = {
        byAge: {} as Record<string, number>,
        byGender: {} as Record<string, number>,
        byRace: {} as Record<string, number>,
        totalVictims: victimizations.length,
        totalPopulation: population.length,
      };

      victimizations.forEach((record: any) => {
        // Age groups
        const ageGroup = record.agegroup || 'Unknown';
        demographics.byAge[ageGroup] = (demographics.byAge[ageGroup] || 0) + 1;

        // Gender
        const gender = record.sex || 'Unknown';
        demographics.byGender[gender] = (demographics.byGender[gender] || 0) + 1;

        // Race
        const race = record.race || 'Unknown';
        demographics.byRace[race] = (demographics.byRace[race] || 0) + 1;
      });

      return {
        year,
        demographics,
        source: 'Bureau of Justice Statistics - NCVS',
      };
    } catch (error) {
      console.error('Failed to get demographic breakdown:', error);
      throw new Error('Failed to fetch demographic data');
    }
  }

  /**
   * Check API health status
   */
  async checkHealth(): Promise<{ healthy: boolean; message: string }> {
    try {
      // Try to fetch a small sample from the API
      const testData = await this.fetchDataset(
        DATASETS.PERSONAL_VICTIMIZATION,
        { limit: 10, year: new Date().getFullYear() - 1 }
      );

      return {
        healthy: true,
        message: `BJS API healthy. Sample data retrieved: ${testData.length} records`,
      };
    } catch (error) {
      return {
        healthy: false,
        message: `BJS API health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}

export const bjsStatisticsService = new BJSStatisticsService();
