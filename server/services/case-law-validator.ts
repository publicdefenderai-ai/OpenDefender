/**
 * Case Law Validator Service (Tier 2 Validation)
 * 
 * Cross-references AI-generated guidance against real court cases from CourtListener
 * to validate legal claims with actual precedents.
 * 
 * Features:
 * - Semantic search for similar cases
 * - Relevance scoring based on jurisdiction, charge category, and case stage
 * - Court weight hierarchy (appellate > trial)
 * - In-memory caching to minimize API calls
 * - Rate limiting to respect CourtListener API limits
 */

import { courtListenerService } from './courtlistener';
import { getChargeById } from '@shared/criminal-charges';
import { devLog, opsLog, errLog } from '../utils/dev-logger';

export interface PrecedentCase {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  courtLevel: 'supreme' | 'appellate' | 'trial' | 'unknown';
  jurisdiction: string;
  dateFiled: string;
  outcome?: string;
  relevanceScore: number;
  matchedChargeCategories: string[];
  excerpt?: string;
  url?: string;
  absoluteUrl?: string;
}

export interface CaseLawValidationResult {
  isAvailable: boolean;
  precedentsFound: number;
  precedents: PrecedentCase[];
  confidenceBoost: number;
  tier2Score: number;
  summary: string;
  corroboratingCases: number;
  contraryIndications: number;
  issues: Array<{
    type: 'no_precedents' | 'weak_precedents' | 'contrary_precedent' | 'jurisdiction_mismatch';
    severity: 'warning' | 'info';
    message: string;
  }>;
}

interface CacheEntry {
  result: CaseLawValidationResult;
  timestamp: number;
}

const STATE_TO_COURT_PREFIX: Record<string, string> = {
  'CA': 'ca',
  'NY': 'ny',
  'TX': 'tex',
  'FL': 'fla',
  'IL': 'ill',
  'PA': 'pa',
  'OH': 'ohio',
  'GA': 'ga',
  'NC': 'nc',
  'MI': 'mich',
  'NJ': 'nj',
  'VA': 'va',
  'WA': 'wash',
  'AZ': 'ariz',
  'MA': 'mass',
  'TN': 'tenn',
  'IN': 'ind',
  'MO': 'mo',
  'MD': 'md',
  'WI': 'wis',
  'CO': 'colo',
  'MN': 'minn',
  'SC': 'sc',
  'AL': 'ala',
  'LA': 'la',
  'KY': 'ky',
  'OR': 'or',
  'OK': 'okla',
  'CT': 'conn',
  'UT': 'utah',
  'IA': 'iowa',
  'NV': 'nev',
  'AR': 'ark',
  'MS': 'miss',
  'KS': 'kan',
  'NM': 'nm',
  'NE': 'neb',
  'ID': 'idaho',
  'WV': 'wva',
  'HI': 'haw',
  'NH': 'nh',
  'ME': 'me',
  'MT': 'mont',
  'RI': 'ri',
  'DE': 'del',
  'SD': 'sd',
  'ND': 'nd',
  'AK': 'alaska',
  'DC': 'dc',
  'VT': 'vt',
  'WY': 'wyo',
  'federal': 'scotus,ca1,ca2,ca3,ca4,ca5,ca6,ca7,ca8,ca9,ca10,ca11,cadc,cafc',
};

const CHARGE_CATEGORY_KEYWORDS: Record<string, string[]> = {
  'assault': ['assault', 'battery', 'bodily harm', 'violence', 'attack'],
  'robbery': ['robbery', 'armed robbery', 'theft with force', 'mugging'],
  'burglary': ['burglary', 'breaking and entering', 'unlawful entry', 'trespass'],
  'theft': ['theft', 'larceny', 'stealing', 'shoplifting', 'grand theft'],
  'drug': ['drug', 'controlled substance', 'narcotics', 'possession', 'trafficking'],
  'dui': ['dui', 'dwi', 'drunk driving', 'intoxicated', 'impaired driving'],
  'fraud': ['fraud', 'wire fraud', 'mail fraud', 'identity theft', 'forgery'],
  'homicide': ['murder', 'manslaughter', 'homicide', 'killing'],
  'sex_offense': ['sexual assault', 'rape', 'indecent', 'child pornography'],
  'weapons': ['firearm', 'weapon', 'gun', 'concealed carry'],
  'domestic': ['domestic violence', 'domestic assault', 'protective order'],
  'public_order': ['disorderly conduct', 'public intoxication', 'trespass', 'loitering'],
};

const COURT_WEIGHT: Record<string, number> = {
  'supreme': 1.0,
  'appellate': 0.85,
  'trial': 0.6,
  'unknown': 0.5,
};

class CaseLawValidator {
  private cache: Map<string, CacheEntry> = new Map();
  private cacheMaxAge = 6 * 60 * 60 * 1000; // 6 hours
  private lastRequestTime = 0;
  private minRequestInterval = 500; // 500ms between requests (120 req/min = 2 req/sec)

  private getCacheKey(jurisdiction: string, charges: string[], caseStage?: string): string {
    const sortedCharges = [...charges].sort().join(',');
    return `${jurisdiction}:${sortedCharges}:${caseStage || 'unknown'}`;
  }

  private async throttleRequest(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.minRequestInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minRequestInterval - elapsed));
    }
    this.lastRequestTime = Date.now();
  }

  private determineCourtLevel(courtName: string): 'supreme' | 'appellate' | 'trial' | 'unknown' {
    const lower = courtName.toLowerCase();
    if (lower.includes('supreme') || lower.includes('scotus')) return 'supreme';
    if (lower.includes('appellate') || lower.includes('circuit') || lower.includes('court of appeals') || lower.includes('ca1') || lower.includes('ca2')) return 'appellate';
    if (lower.includes('district') || lower.includes('superior') || lower.includes('county') || lower.includes('municipal')) return 'trial';
    return 'unknown';
  }

  private extractChargeCategory(chargeId: string): string[] {
    const categories: string[] = [];
    const charge = getChargeById(chargeId);
    
    if (!charge) return categories;
    
    const chargeText = `${charge.name} ${charge.description || ''}`.toLowerCase();
    
    for (const [category, keywords] of Object.entries(CHARGE_CATEGORY_KEYWORDS)) {
      if (keywords.some(keyword => chargeText.includes(keyword))) {
        categories.push(category);
      }
    }
    
    return categories.length > 0 ? categories : ['general'];
  }

  private buildSearchQuery(charges: string[], caseStage?: string): { query: string; keywords: string; statuteCitations: string[]; statuteSearchTerms: string[] } {
    const chargeCategories = new Set<string>();
    const chargeNames: string[] = [];
    const statuteCitations: string[] = [];
    const statuteSearchTerms: string[] = [];
    const legalTerms: string[] = [];
    
    for (const chargeId of charges) {
      const charge = getChargeById(chargeId);
      if (charge) {
        chargeNames.push(charge.name);
        this.extractChargeCategory(chargeId).forEach(cat => chargeCategories.add(cat));
        
        // Extract statute citation if available (e.g., "245" from charge code)
        if (charge.code) {
          statuteCitations.push(charge.code);
          
          // Build searchable statute terms based on jurisdiction
          const searchTerm = this.buildStatuteSearchTerm(charge.jurisdiction, charge.code);
          if (searchTerm) {
            statuteSearchTerms.push(searchTerm);
          }
        }
      }
    }
    
    // Add relevant legal synonyms from category keywords (pick top 2 per category)
    for (const category of Array.from(chargeCategories)) {
      const categoryKeywords = CHARGE_CATEGORY_KEYWORDS[category];
      if (categoryKeywords) {
        // Add first 2 keywords that aren't already in charge names
        const newTerms = categoryKeywords
          .filter(kw => !chargeNames.some(name => name.toLowerCase().includes(kw)))
          .slice(0, 2);
        legalTerms.push(...newTerms);
      }
    }
    
    // Build primary keywords from charge names (limit to 3)
    const keywords = chargeNames.slice(0, 3).join(' ');
    
    // Build enriched query: charge names + legal synonyms
    let query = chargeNames.join(' ');
    
    // Add legal synonyms for broader matching
    if (legalTerms.length > 0) {
      query += ` ${legalTerms.slice(0, 4).join(' ')}`;
    }
    
    // Add case stage context
    if (caseStage) {
      const stageKeywords: Record<string, string> = {
        'arraignment': 'arraignment plea',
        'pre_trial': 'pretrial motion discovery',
        'trial': 'trial verdict jury',
        'sentencing': 'sentencing penalty guidelines',
        'appeal': 'appeal reversal affirm',
        'bail': 'bail bond detention hearing',
      };
      if (stageKeywords[caseStage]) {
        query += ` ${stageKeywords[caseStage]}`;
      }
    }
    
    return { query, keywords, statuteCitations, statuteSearchTerms };
  }
  
  // Build searchable statute terms from jurisdiction and code
  private buildStatuteSearchTerm(jurisdiction: string, code: string): string | null {
    // Map jurisdictions to their statute naming conventions
    const statutePatterns: Record<string, string> = {
      'CA': `Penal Code ${code}`,
      'NY': `Penal Law ${code}`,
      'TX': `Penal Code ${code}`,
      'FL': `Statutes ${code}`,
      'IL': `Criminal Code ${code}`,
      'PA': `Crimes Code ${code}`,
      'OH': `Revised Code ${code}`,
      'GA': `Code ${code}`,
      'NC': `General Statutes ${code}`,
      'MI': `Compiled Laws ${code}`,
      'NJ': `Statutes ${code}`,
      'VA': `Code ${code}`,
      'WA': `RCW ${code}`,
      'AZ': `Revised Statutes ${code}`,
      'MA': `General Laws ${code}`,
      'federal': `USC ${code}`,
    };
    
    return statutePatterns[jurisdiction] || null;
  }
  
  // Fallback search using simpler keyword-only approach
  private buildFallbackQuery(charges: string[]): string {
    const terms: string[] = [];
    
    for (const chargeId of charges) {
      const charge = getChargeById(chargeId);
      if (charge) {
        // Extract core legal terms from charge name
        const name = charge.name.toLowerCase();
        
        // Add the primary charge category term
        for (const [category, keywords] of Object.entries(CHARGE_CATEGORY_KEYWORDS)) {
          if (keywords.some(kw => name.includes(kw))) {
            // Use the most common/searchable term from the category
            terms.push(keywords[0]);
            break;
          }
        }
      }
    }
    
    // Return unique terms
    return Array.from(new Set(terms)).slice(0, 3).join(' ');
  }

  private calculateRelevanceScore(
    opinion: any,
    targetJurisdiction: string,
    chargeCategories: string[],
    caseStage?: string,
    providedSemanticScore?: number,
    statuteCodes?: string[]
  ): number {
    let score = 0;
    const weights = { semantic: 0.45, chargeCategory: 0.25, stage: 0.15, statute: 0.15 };
    
    // Use provided semantic score or conservative default of 0.1 when missing
    const semanticScore = providedSemanticScore ?? 0.1;
    score += semanticScore * weights.semantic;
    
    // Charge category match
    const opinionText = `${opinion.caseName || ''} ${opinion.snippet || ''}`.toLowerCase();
    let categoryMatches = 0;
    for (const category of chargeCategories) {
      const keywords = CHARGE_CATEGORY_KEYWORDS[category] || [];
      if (keywords.some(kw => opinionText.includes(kw))) {
        categoryMatches++;
      }
    }
    const categoryScore = chargeCategories.length > 0 
      ? categoryMatches / chargeCategories.length 
      : 0.5;
    score += categoryScore * weights.chargeCategory;
    
    // Case stage match
    if (caseStage) {
      const stageKeywords: Record<string, string[]> = {
        'arraignment': ['arraignment', 'plea', 'initial appearance'],
        'pre_trial': ['pretrial', 'motion', 'discovery', 'suppress'],
        'trial': ['trial', 'verdict', 'jury', 'evidence'],
        'sentencing': ['sentencing', 'sentence', 'penalty', 'guidelines'],
        'appeal': ['appeal', 'reversed', 'affirmed', 'remand'],
        'bail': ['bail', 'bond', 'detention', 'release'],
      };
      const stageKws = stageKeywords[caseStage] || [];
      const stageMatch = stageKws.some(kw => opinionText.includes(kw)) ? 1 : 0.3;
      score += stageMatch * weights.stage;
    } else {
      score += 0.5 * weights.stage;
    }
    
    // Statute citation match (boost for cases mentioning the specific statute code)
    if (statuteCodes && statuteCodes.length > 0) {
      let statuteMatch = 0;
      for (const code of statuteCodes) {
        // Look for the statute code in the opinion text (e.g., "245", "13A-9-20")
        if (opinionText.includes(code.toLowerCase())) {
          statuteMatch = 1;
          break;
        }
      }
      score += statuteMatch * weights.statute;
    } else {
      // No statute codes to match, give neutral score
      score += 0.5 * weights.statute;
    }
    
    // Apply court weight multiplier
    const courtLevel = this.determineCourtLevel(opinion.court || '');
    score *= COURT_WEIGHT[courtLevel];
    
    return Math.min(score, 1);
  }

  private extractJurisdictionFromCourt(courtName: string): string {
    const lower = courtName.toLowerCase();
    
    // Federal courts
    if (lower.includes('supreme court of the united states') || lower.includes('scotus')) return 'federal';
    if (lower.match(/circuit|federal|u\.?s\.? district/)) return 'federal';
    
    // State courts - check for state names
    for (const [state, prefix] of Object.entries(STATE_TO_COURT_PREFIX)) {
      if (lower.includes(prefix) || lower.includes(state.toLowerCase())) {
        return state;
      }
    }
    
    return 'unknown';
  }

  async validateWithCaseLaw(
    guidance: any,
    context: {
      jurisdiction: string;
      charges: string | string[];
      caseStage?: string;
    }
  ): Promise<CaseLawValidationResult> {
    const chargeArray = Array.isArray(context.charges) ? context.charges : [context.charges];
    const cacheKey = this.getCacheKey(context.jurisdiction, chargeArray, context.caseStage);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheMaxAge) {
      devLog('case-law', 'Returning cached result');
      return cached.result;
    }
    
    const result: CaseLawValidationResult = {
      isAvailable: false,
      precedentsFound: 0,
      precedents: [],
      confidenceBoost: 0,
      tier2Score: 0,
      summary: '',
      corroboratingCases: 0,
      contraryIndications: 0,
      issues: [],
    };
    
    try {
      await this.throttleRequest();
      
      // Build search query from charges and case stage
      const { query, keywords, statuteCitations, statuteSearchTerms } = this.buildSearchQuery(chargeArray, context.caseStage);
      
      // Get court filter for jurisdiction
      const courtFilter = STATE_TO_COURT_PREFIX[context.jurisdiction] || undefined;
      
      // Build enhanced query with statute terms if available
      let enhancedQuery = query;
      if (statuteSearchTerms.length > 0) {
        // Add statute terms to query (e.g., "Penal Code 245")
        enhancedQuery = `${query} ${statuteSearchTerms.slice(0, 2).join(' ')}`;
      }
      
      devLog('case-law', `Searching CourtListener: "${enhancedQuery}" in ${context.jurisdiction}`);
      if (statuteSearchTerms.length > 0) {
        devLog('case-law', `Statute search terms: ${statuteSearchTerms.join(', ')}`);
      }
      
      // Use hybrid search for best results
      let searchResult = await courtListenerService.hybridSearchOpinions(
        enhancedQuery,
        keywords,
        courtFilter
      );
      
      // Fallback 1: Try without jurisdiction filter if no results
      if ((!searchResult || !searchResult.results || searchResult.results.length === 0) && courtFilter) {
        devLog('case-law', `No results with jurisdiction filter, trying broader search...`);
        await this.throttleRequest();
        searchResult = await courtListenerService.hybridSearchOpinions(
          enhancedQuery,
          keywords,
          undefined // No jurisdiction filter
        );
      }
      
      // Fallback 2: Try statute-specific search if we have statute terms
      if ((!searchResult || !searchResult.results || searchResult.results.length === 0) && statuteSearchTerms.length > 0) {
        const statuteQuery = statuteSearchTerms.join(' ');
        devLog('case-law', `Trying statute-specific search: "${statuteQuery}"`);
        await this.throttleRequest();
        searchResult = await courtListenerService.searchOpinions(
          statuteQuery,
          courtFilter
        );
      }
      
      // Fallback 3: Try simpler category-based query
      if (!searchResult || !searchResult.results || searchResult.results.length === 0) {
        const fallbackQuery = this.buildFallbackQuery(chargeArray);
        if (fallbackQuery && fallbackQuery !== keywords) {
          devLog('case-law', `Trying category fallback query: "${fallbackQuery}"`);
          await this.throttleRequest();
          searchResult = await courtListenerService.semanticSearchOpinions(
            fallbackQuery,
            courtFilter,
            undefined
          );
        }
      }
      
      if (!searchResult || !searchResult.results || searchResult.results.length === 0) {
        result.summary = 'No relevant case law found for this charge and jurisdiction.';
        result.issues.push({
          type: 'no_precedents',
          severity: 'info',
          message: 'Unable to find case law precedents. Guidance based on statute data only.',
        });
        this.cache.set(cacheKey, { result, timestamp: Date.now() });
        return result;
      }
      
      result.isAvailable = true;
      
      // Extract charge categories for relevance scoring
      const chargeCategories = chargeArray.flatMap(c => this.extractChargeCategory(c));
      
      // Process and score results (limit to top 10)
      const opinions = searchResult.results.slice(0, 10);
      
      devLog('case-law', `Processing ${opinions.length} results from CourtListener`);
      
      for (const opinion of opinions) {
        // Use actual semantic score from CourtListener if available, otherwise use conservative default of 0.1
        const semanticScore = opinion.score ?? opinion.semanticScore ?? 0.1;
        
        const relevanceScore = this.calculateRelevanceScore(
          opinion,
          context.jurisdiction,
          chargeCategories,
          context.caseStage,
          semanticScore,
          statuteCitations // Pass statute codes for matching
        );
        
        devLog('case-law', `Case "${opinion.caseName || 'Unknown'}" scored ${(relevanceScore * 100).toFixed(1)}% (semantic: ${(semanticScore * 100).toFixed(1)}%)`);
        
        // Lowered threshold to include more cases (was 0.3, now 0.2)
        if (relevanceScore < 0.2) continue;
        
        const courtLevel = this.determineCourtLevel(opinion.court || '');
        const opinionJurisdiction = this.extractJurisdictionFromCourt(opinion.court || '');
        
        // Check for jurisdiction match
        const jurisdictionMatch = opinionJurisdiction === context.jurisdiction || 
                                  opinionJurisdiction === 'federal' ||
                                  opinionJurisdiction === 'unknown';
        
        const precedent: PrecedentCase = {
          id: opinion.id?.toString() || `cl-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          caseName: opinion.caseName || opinion.case_name || 'Unknown Case',
          citation: opinion.citation?.[0] || opinion.docketNumber || '',
          court: opinion.court || 'Unknown Court',
          courtLevel,
          jurisdiction: opinionJurisdiction,
          dateFiled: opinion.dateFiled || opinion.date_filed || '',
          relevanceScore,
          matchedChargeCategories: chargeCategories.filter(cat => {
            const keywords = CHARGE_CATEGORY_KEYWORDS[cat] || [];
            const text = `${opinion.caseName || ''} ${opinion.snippet || ''}`.toLowerCase();
            return keywords.some(kw => text.includes(kw));
          }),
          excerpt: opinion.snippet || opinion.text?.slice(0, 300) || undefined,
          url: opinion.frontend_url || undefined,
          absoluteUrl: opinion.absolute_url ? `https://www.courtlistener.com${opinion.absolute_url}` : undefined,
        };
        
        if (!jurisdictionMatch && result.precedents.length < 5) {
          result.issues.push({
            type: 'jurisdiction_mismatch',
            severity: 'info',
            message: `Case "${precedent.caseName}" is from ${opinionJurisdiction}, not ${context.jurisdiction}.`,
          });
        }
        
        result.precedents.push(precedent);
        
        // Track corroborating vs contrary cases - lowered threshold from 0.6 to 0.4
        if (relevanceScore > 0.4) {
          result.corroboratingCases++;
        }
      }
      
      result.precedentsFound = result.precedents.length;
      
      // Calculate Tier 2 score based on precedent quality
      if (result.precedents.length > 0) {
        // Weighted average of relevance scores, with court level weight
        const weightedSum = result.precedents.reduce((sum, p) => {
          return sum + p.relevanceScore * COURT_WEIGHT[p.courtLevel];
        }, 0);
        const totalWeight = result.precedents.reduce((sum, p) => {
          return sum + COURT_WEIGHT[p.courtLevel];
        }, 0);
        
        result.tier2Score = totalWeight > 0 ? weightedSum / totalWeight : 0;
        
        // Allow confidence boost with at least 1 corroborating case (was 2)
        if (result.corroboratingCases >= 2) {
          result.confidenceBoost = Math.min(0.15, result.tier2Score * 0.2);
        } else if (result.corroboratingCases >= 1) {
          // Boost for 1 corroborating case, higher if appellate
          const baseBoost = result.precedents[0]?.courtLevel === 'appellate' ? 0.1 : 0.05;
          result.confidenceBoost = Math.min(baseBoost, result.tier2Score * 0.15);
        }
        
        result.summary = `Found ${result.precedentsFound} relevant case${result.precedentsFound !== 1 ? 's' : ''} ` +
          `with ${result.corroboratingCases} corroborating precedent${result.corroboratingCases !== 1 ? 's' : ''}.`;
      } else {
        result.summary = 'Case law search completed but no highly relevant precedents found.';
        result.issues.push({
          type: 'weak_precedents',
          severity: 'warning',
          message: 'Found cases but none with strong relevance to your specific situation.',
        });
      }
      
      // Cache the result
      this.cache.set(cacheKey, { result, timestamp: Date.now() });
      
      opsLog('case-law', `Found ${result.precedentsFound} precedents, Tier 2 score: ${(result.tier2Score * 100).toFixed(1)}%`);
      
      return result;
      
    } catch (error) {
      errLog('[CaseLawValidator] Error querying CourtListener', error);
      result.summary = 'Case law validation temporarily unavailable.';
      result.issues.push({
        type: 'no_precedents',
        severity: 'info',
        message: 'Unable to query case law database. Validation based on statute data only.',
      });
      return result;
    }
  }

  clearCache(): void {
    this.cache.clear();
    devLog('case-law', 'Cache cleared');
  }

  getCacheStats(): { size: number; maxAge: string } {
    return {
      size: this.cache.size,
      maxAge: `${this.cacheMaxAge / (60 * 60 * 1000)} hours`,
    };
  }
}

export const caseLawValidator = new CaseLawValidator();
