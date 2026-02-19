import type { Express, Request, Response, NextFunction } from "express";
import { CLAUDE_MODEL_DISPLAY_NAME } from "./config/ai-model";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { courtListenerService } from "./services/courtlistener";
import { legalDataService } from "./services/legal-data";
import { recapService } from "./services/recap";
import { bjsStatisticsService } from "./services/bjs-statistics";
import { insertLegalCaseSchema, insertCaseFeedbackSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import { generateEnhancedGuidance } from "./services/guidance-engine.js";
import { generateClaudeGuidance, testClaudeConnection, clearSessionCache } from "./services/claude-guidance.js";
import { getChargeById, getChargesByJurisdiction, criminalCharges } from "../shared/criminal-charges.js";
import { translateChargeName, translateDescription } from "../shared/charge-translations.js";
import { validateLegalGuidance } from "./services/legal-accuracy-validator";
import { statuteSeeder } from "./services/statute-seeder";
import { openLawsClient } from "./services/openlaws-client";
import rateLimit from "express-rate-limit";
import { devLog, opsLog, errLog } from "./utils/dev-logger";
import { attorneySessionManager } from "./services/attorney-docs/session-manager";
import { attorneyVerificationRequestSchema } from "../shared/attorney/attestation-schema";
import { getTemplates, getTemplate, generateDocument, getGeneratedDocument, clearSessionDocuments } from "./services/attorney-docs/document-generator";
import { generateDocx } from "./services/attorney-docs/docx-generator";
import { search, buildSearchIndex, getSearchIndexStats } from "./services/search-indexer";
import { z } from "zod";
import multer from "multer";
import { summarizeDocument, validateFile, getSupportedFileTypes } from "./services/document-summarizer";
import { requireCaptcha } from "./middleware/captcha-middleware";
import { getCaptchaSiteKey, isCaptchaRequired } from "./services/captcha-verification";
import { requireBudget } from "./middleware/budget-gate";
import { getAICostStatus } from "./services/cost-tracker";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============================================================================
  // SECURITY: Rate Limiters
  // ============================================================================

  // Rate limiter for AI-powered endpoints (expensive operations)
  const aiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per 15 minutes
    message: {
      success: false,
      error: 'Too many guidance requests from this IP. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'development',
    validate: { trustProxy: false, xForwardedForHeader: false }
  });

  // Rate limiter for search endpoints (moderate cost)
  const searchRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
    message: {
      success: false,
      error: 'Too many search requests. Please try again shortly.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'development',
    validate: { trustProxy: false, xForwardedForHeader: false }
  });

  // Rate limiter for write operations (feedback, consent)
  const writeRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // 10 writes per minute
    message: {
      success: false,
      error: 'Too many requests. Please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'development',
    validate: { trustProxy: false, xForwardedForHeader: false }
  });

  // Strict rate limiter for admin operations
  const adminRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 admin operations per hour
    message: {
      success: false,
      error: 'Too many administrative requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false, xForwardedForHeader: false }
  });

  // Daily rate limiter for AI endpoints (20 requests per day per IP)
  const aiDailyLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 20, // 20 AI requests per day per IP
    message: {
      success: false,
      error: 'Daily limit reached. You have used all 20 AI requests for today. Please try again tomorrow.',
      code: 'DAILY_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'development',
    validate: { trustProxy: false, xForwardedForHeader: false }
  });

  // Rate limiter for attorney verification (10 attempts per hour per IP)
  const attorneyVerificationRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 verification attempts per hour
    message: {
      success: false,
      error: 'Too many verification attempts. Please try again in an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'development',
    validate: { trustProxy: false, xForwardedForHeader: false }
  });

  // ============================================================================
  // SECURITY: Input Validation Helpers
  // ============================================================================

  /**
   * Validate search query parameters for length constraints.
   * Prevents DoS via extremely long query strings.
   */
  const MAX_QUERY_LENGTH = 500;
  const MIN_QUERY_LENGTH = 2;

  function validateSearchQuery(query: unknown): { valid: boolean; error?: string } {
    if (typeof query !== 'string') {
      return { valid: false, error: 'Query parameter must be a string' };
    }
    if (query.length < MIN_QUERY_LENGTH) {
      return { valid: false, error: `Query must be at least ${MIN_QUERY_LENGTH} characters` };
    }
    if (query.length > MAX_QUERY_LENGTH) {
      return { valid: false, error: `Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters` };
    }
    return { valid: true };
  }

  // ============================================================================
  // SECURITY: Admin API Key Authentication Middleware
  // ============================================================================

  /**
   * Middleware to protect administrative endpoints with API key authentication.
   * Set ADMIN_API_KEY environment variable to enable protection.
   * If not set, admin endpoints are disabled in production for security.
   */
  const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
    const adminApiKey = process.env.ADMIN_API_KEY;

    // In development without ADMIN_API_KEY, allow access with warning
    if (!adminApiKey) {
      if (process.env.NODE_ENV === 'development') {
        devLog('security', 'Admin endpoint accessed without ADMIN_API_KEY set (dev mode)');
        return next();
      }
      // In production, require the key to be set
      return res.status(503).json({
        success: false,
        error: 'Administrative endpoints are disabled. Set ADMIN_API_KEY to enable.'
      });
    }

    // Check for API key in header
    const providedKey = req.headers['x-admin-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

    if (!providedKey || providedKey !== adminApiKey) {
      opsLog('security', `Unauthorized admin access attempt from ${req.ip}`);
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Valid admin API key required.'
      });
    }

    next();
  };

  // ============================================================================
  // CAPTCHA Configuration Endpoint
  // ============================================================================

  /**
   * Get CAPTCHA configuration for frontend
   * Returns the site key (safe to expose) and whether CAPTCHA is required
   */
  app.get("/api/captcha/config", (req, res) => {
    res.json({
      success: true,
      required: isCaptchaRequired(),
      siteKey: getCaptchaSiteKey(),
      provider: 'turnstile'
    });
  });

  // Legal Resources API
  app.get("/api/legal-resources", async (req, res) => {
    try {
      const { jurisdiction, category } = req.query;
      const resources = await storage.getLegalResources(
        jurisdiction as string,
        category as string
      );
      res.json({ success: true, resources });
    } catch (error) {
      errLog("Failed to fetch legal resources", error);
      res.status(500).json({ success: false, error: "Failed to fetch legal resources" });
    }
  });

  // Legal Aid Organizations API - Get organizations by state and/or type
  app.get("/api/legal-aid-organizations", async (req, res) => {
    try {
      const { state, organizationType } = req.query;
      const organizations = await storage.getLegalAidOrganizations(
        state as string,
        organizationType as string
      );
      res.json({ 
        success: true, 
        organizations,
        count: organizations.length,
        sources: ["EOIR", "LSC", "usa.gov"]
      });
    } catch (error) {
      errLog("Failed to fetch legal aid organizations", error);
      res.status(500).json({ success: false, error: "Failed to fetch legal aid organizations" });
    }
  });

  // Criminal Charges API - Get charges by jurisdiction
  app.get("/api/criminal-charges", async (req, res) => {
    try {
      const { jurisdiction, search, category, limit, language } = req.query;
      const isSpanish = language === 'es';
      
      let charges = jurisdiction 
        ? getChargesByJurisdiction(jurisdiction as string)
        : criminalCharges;
      
      // Filter by search term (search in both English and Spanish)
      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        charges = charges.filter(charge => {
          // Search in English
          if (charge.name.toLowerCase().includes(searchLower) ||
              charge.description.toLowerCase().includes(searchLower)) {
            return true;
          }
          
          // Search in Spanish - use direct fields or translate on-the-fly
          const nameEs = charge.nameEs || translateChargeName(charge.name) || '';
          const descriptionEs = charge.descriptionEs || translateDescription(charge.description) || '';
          
          return nameEs.toLowerCase().includes(searchLower) ||
                 descriptionEs.toLowerCase().includes(searchLower);
        });
      }
      
      // Filter by category (felony, misdemeanor, infraction)
      if (category && typeof category === 'string') {
        charges = charges.filter(charge => charge.category === category);
      }
      
      // Limit results
      const maxResults = Math.min(parseInt(limit as string) || 100, 500);
      charges = charges.slice(0, maxResults);
      
      // Return simplified charge data for the selector with localized fields
      const simplifiedCharges = charges.map(charge => {
        let name = charge.name;
        let description = charge.description;
        
        if (isSpanish) {
          // Use direct field translations if available, otherwise use translation functions
          name = charge.nameEs || translateChargeName(charge.name) || charge.name;
          description = charge.descriptionEs || translateDescription(charge.description) || charge.description;
        }
        
        return {
          id: charge.id,
          code: charge.code,
          name,
          category: charge.category,
          description,
          maxPenalty: charge.maxPenalty,
        };
      });
      
      res.json({ 
        success: true, 
        charges: simplifiedCharges,
        count: simplifiedCharges.length,
        totalAvailable: jurisdiction 
          ? getChargesByJurisdiction(jurisdiction as string).length 
          : criminalCharges.length
      });
    } catch (error) {
      errLog("Failed to fetch criminal charges", error);
      res.status(500).json({ success: false, error: "Failed to fetch criminal charges" });
    }
  });

  // Legal Aid Organizations Proximity Search API - Find organizations near a ZIP code
  app.get("/api/legal-aid-organizations/proximity", async (req, res) => {
    try {
      const { zipCode, radius = "50", organizationType, services } = req.query;
      
      if (!zipCode) {
        return res.status(400).json({ success: false, error: "ZIP code required" });
      }

      // Geocode the ZIP code using Nominatim (with address details to get state)
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=us&format=json&limit=1&addressdetails=1`;
      const geocodeResponse = await fetch(geocodeUrl, {
        headers: {
          'User-Agent': 'PublicDefenderAI/1.0'
        }
      });
      
      if (!geocodeResponse.ok) {
        return res.status(500).json({ success: false, error: "Geocoding failed" });
      }

      const geocodeData = await geocodeResponse.json();
      
      if (!geocodeData || geocodeData.length === 0) {
        return res.status(404).json({ success: false, error: "ZIP code not found" });
      }

      const { lat: userLat, lon: userLon, address } = geocodeData[0];
      const radiusMiles = parseFloat(radius as string);
      
      // Extract state abbreviation from geocode result
      // Nominatim provides ISO3166-2-lvl4 like "US-CA" or full state name
      let userState: string | undefined;
      if (address?.['ISO3166-2-lvl4']) {
        // Extract state code from "US-CA" format
        userState = address['ISO3166-2-lvl4'].split('-')[1];
      } else if (address?.state) {
        // Fallback: map full state name to abbreviation
        const stateMap: Record<string, string> = {
          'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
          'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
          'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
          'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
          'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
          'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
          'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
          'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
          'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
          'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
          'District of Columbia': 'DC'
        };
        userState = stateMap[address.state];
      }

      // Get all organizations (optionally filtered by type AND state)
      const allOrgs = await storage.getLegalAidOrganizations(
        userState, // Filter by the ZIP code's state
        organizationType as string
      );

      // Haversine formula to calculate distance
      const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      };

      // Filter by services if provided (comma-separated list)
      let filteredOrgs = allOrgs;
      if (services && typeof services === 'string') {
        const requestedServices = services.split(',').map(s => s.trim().toLowerCase());
        filteredOrgs = allOrgs.filter(org => {
          if (!org.services || org.services.length === 0) return false;
          const orgServices = org.services.map(s => s.toLowerCase());
          return requestedServices.some(rs => 
            orgServices.some(os => os.includes(rs) || rs.includes(os))
          );
        });
        // Fallback: if no matches with services filter, include all orgs
        if (filteredOrgs.length === 0) {
          filteredOrgs = allOrgs;
        }
      }

      // Calculate distances for all organizations
      const allOrgsWithDistance = filteredOrgs
        .filter(org => org.latitude && org.longitude) // Only include orgs with coordinates
        .map(org => {
          const distance = calculateDistance(
            parseFloat(userLat),
            parseFloat(userLon),
            parseFloat(org.latitude!),
            parseFloat(org.longitude!)
          );
          return { ...org, distance };
        })
        .sort((a, b) => a.distance - b.distance);

      // First try to find organizations within the radius
      let organizationsWithDistance = allOrgsWithDistance.filter(org => org.distance <= radiusMiles);

      // Fallback: If no organizations within radius, return the closest one
      if (organizationsWithDistance.length === 0 && allOrgsWithDistance.length > 0) {
        organizationsWithDistance = [allOrgsWithDistance[0]]; // Return just the closest
      }

      res.json({
        success: true,
        organizations: organizationsWithDistance,
        count: organizationsWithDistance.length,
        zipCode,
        state: userState,
        radius: radiusMiles,
        fallbackUsed: organizationsWithDistance.length === 1 && allOrgsWithDistance.length > 0 && organizationsWithDistance[0].distance > radiusMiles
      });
    } catch (error) {
      errLog("Failed to fetch organizations by proximity", error);
      res.status(500).json({ success: false, error: "Proximity search failed" });
    }
  });

  // Court Data API
  app.get("/api/court-data/:jurisdiction", async (req, res) => {
    try {
      const { jurisdiction } = req.params;
      const courts = await storage.getCourtData(jurisdiction);
      const localInfo = await legalDataService.getLocalCourtInfo(jurisdiction);
      
      res.json({ 
        success: true, 
        courts,
        localInfo: localInfo.success ? localInfo : null
      });
    } catch (error) {
      errLog("Failed to fetch court data", error);
      res.status(500).json({ success: false, error: "Failed to fetch court data" });
    }
  });

  // Case Law Search API - supports both keyword and semantic search
  app.get("/api/case-law/search", searchRateLimiter, async (req, res) => {
    try {
      const { q: query, jurisdiction, search_type } = req.query;

      if (!query) {
        return res.status(400).json({ success: false, error: "Query parameter required" });
      }

      const validation = validateSearchQuery(query);
      if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.error });
      }

      const searchType = (search_type as string) === 'semantic' ? 'semantic' : 'keyword';

      const results = await legalDataService.searchCaseLaw(
        query as string,
        jurisdiction as string,
        searchType
      );

      res.json(results);
    } catch (error) {
      errLog("Case law search failed", error);
      res.status(500).json({ success: false, error: "Search failed" });
    }
  });

  // Semantic Search API - natural language case law search
  app.get("/api/case-law/semantic-search", searchRateLimiter, async (req, res) => {
    try {
      const { q: query, jurisdiction, keyword_filter } = req.query;

      if (!query) {
        return res.status(400).json({ success: false, error: "Query parameter required" });
      }

      const validation = validateSearchQuery(query);
      if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.error });
      }

      const results = await legalDataService.semanticSearchCaseLaw(
        query as string,
        jurisdiction as string,
        keyword_filter as string
      );

      res.json(results);
    } catch (error) {
      errLog("Semantic search failed", error);
      res.status(500).json({ success: false, error: "Semantic search failed" });
    }
  });

  // Hybrid Search API - combines keywords with natural language
  app.get("/api/case-law/hybrid-search", searchRateLimiter, async (req, res) => {
    try {
      const { natural_language, keywords, jurisdiction } = req.query;

      if (!natural_language || !keywords) {
        return res.status(400).json({
          success: false,
          error: "Both natural_language and keywords parameters required"
        });
      }

      const nlValidation = validateSearchQuery(natural_language);
      if (!nlValidation.valid) {
        return res.status(400).json({ success: false, error: `natural_language: ${nlValidation.error}` });
      }

      const kwValidation = validateSearchQuery(keywords);
      if (!kwValidation.valid) {
        return res.status(400).json({ success: false, error: `keywords: ${kwValidation.error}` });
      }

      const results = await legalDataService.hybridSearchCaseLaw(
        natural_language as string,
        keywords as string,
        jurisdiction as string
      );

      res.json(results);
    } catch (error) {
      errLog("Hybrid search failed", error);
      res.status(500).json({ success: false, error: "Hybrid search failed" });
    }
  });

  // ============================================================================
  // SITE-WIDE SEARCH API
  // ============================================================================

  // Initialize search index on startup
  buildSearchIndex();

  // Site-wide search - searches all site content (glossary, charges, programs, etc.)
  app.get("/api/site-search", searchRateLimiter, async (req, res) => {
    try {
      const { q: query, lang, types, jurisdiction, limit, offset } = req.query;
      
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Query parameter 'q' is required" });
      }

      const language = (lang === 'es' ? 'es' : lang === 'zh' ? 'zh' : 'en') as 'en' | 'es' | 'zh';
      const typeFilters = types ? (types as string).split(',') : undefined;
      
      const searchResult = search({
        query: query.trim(),
        language,
        filters: {
          types: typeFilters as any,
          jurisdiction: jurisdiction as string,
        },
        limit: limit ? parseInt(limit as string, 10) : 20,
        offset: offset ? parseInt(offset as string, 10) : 0,
      });

      res.json({
        success: true,
        ...searchResult,
      });
    } catch (error) {
      errLog("Site search failed", error);
      res.status(500).json({ success: false, error: "Search failed" });
    }
  });

  // Get search index statistics
  app.get("/api/site-search/stats", async (req, res) => {
    try {
      const stats = getSearchIndexStats();
      res.json({ success: true, ...stats });
    } catch (error) {
      errLog("Failed to get search stats", error);
      res.status(500).json({ success: false, error: "Failed to get stats" });
    }
  });

  // Statutes Search API - Search federal statutes (must come before :jurisdiction)
  app.get("/api/statutes/search/federal", async (req, res) => {
    try {
      const { q: query, title, section } = req.query;
      const results = await legalDataService.searchFederalStatutes(
        (query as string) || '',
        title as string,
        section as string
      );
      res.json(results);
    } catch (error) {
      errLog("Federal statute search failed", error);
      res.status(500).json({ success: false, error: "Search failed" });
    }
  });

  // Statute Database Seeding endpoints (must come before :jurisdiction)
  // Seed database with stateStatutesSeed data
  // SECURITY: Protected with admin auth and rate limiting
  app.post("/api/statutes/seed", adminRateLimiter, requireAdminAuth, async (req, res) => {
    try {
      devLog('api', 'Starting statute database seeding...');
      const result = await statuteSeeder.seedDatabase();
      res.json(result);
    } catch (error) {
      errLog("Seeding failed", error);
      res.status(500).json({ success: false, error: "Seeding failed" });
    }
  });

  // Get seeding status
  app.get("/api/statutes/seed-status", async (req, res) => {
    try {
      const status = await statuteSeeder.getSeedingStatus();
      res.json({ success: true, ...status });
    } catch (error) {
      errLog("Failed to fetch seeding status", error);
      res.status(500).json({ success: false, error: "Failed to fetch status" });
    }
  });

  // Statutes API - Get by jurisdiction with optional search
  app.get("/api/statutes/:jurisdiction", async (req, res) => {
    try {
      const { jurisdiction } = req.params;
      const { q: searchQuery } = req.query;
      const statutes = await legalDataService.getStatutes(jurisdiction, searchQuery as string);
      res.json(statutes);
    } catch (error) {
      errLog("Failed to fetch statutes", error);
      res.status(500).json({ success: false, error: "Failed to fetch statutes" });
    }
  });

  // Sentencing Guidelines API
  app.get("/api/sentencing-guidelines/:jurisdiction", async (req, res) => {
    try {
      const { jurisdiction } = req.params;
      const guidelines = await legalDataService.getSentencingGuidelines(jurisdiction);
      res.json(guidelines);
    } catch (error) {
      errLog("Failed to fetch sentencing guidelines", error);
      res.status(500).json({ success: false, error: "Failed to fetch sentencing guidelines" });
    }
  });

  // Local Resources API - Public Defenders (uses real legal-aid-organizations database)
  app.get("/api/local-resources/public-defenders", async (req, res) => {
    try {
      const { zip } = req.query;
      
      if (!zip || typeof zip !== 'string' || zip.length !== 5) {
        return res.status(400).json({ success: false, error: "Valid 5-digit ZIP code required" });
      }

      const geocodeUrl = `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=us&format=json&limit=1&addressdetails=1`;
      const geocodeResponse = await fetch(geocodeUrl, {
        headers: { 'User-Agent': 'PublicDefenderAI/1.0' }
      });

      if (!geocodeResponse.ok) {
        return res.status(500).json({ success: false, error: "Location lookup failed" });
      }

      const geocodeData = await geocodeResponse.json();
      if (!geocodeData || geocodeData.length === 0) {
        return res.status(404).json({ success: false, error: "ZIP code not found" });
      }

      const { lat: userLat, lon: userLon, address } = geocodeData[0];

      let userState: string | undefined;
      if (address?.['ISO3166-2-lvl4']) {
        userState = address['ISO3166-2-lvl4'].split('-')[1];
      }

      const allOrgs = await storage.getLegalAidOrganizations(userState, 'public_defender');

      const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 3959;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      };

      const results = allOrgs
        .filter(org => org.latitude && org.longitude)
        .map(org => ({
          name: org.name,
          address: [org.address, org.city, org.state, org.zipCode].filter(Boolean).join(', '),
          phone: org.phone || 'Contact for information',
          website: org.website || null,
          hours: 'Mon-Fri 8:00 AM - 5:00 PM',
          services: org.services || [],
          eligibility: org.eligibility || null,
          distance: `${calculateDistance(parseFloat(userLat), parseFloat(userLon), parseFloat(org.latitude!), parseFloat(org.longitude!)).toFixed(1)} miles`,
          distanceValue: calculateDistance(parseFloat(userLat), parseFloat(userLon), parseFloat(org.latitude!), parseFloat(org.longitude!))
        }))
        .sort((a, b) => a.distanceValue - b.distanceValue)
        .slice(0, 10);

      res.json({
        success: true,
        results,
        count: results.length,
        source: "Public Defender AI Legal Aid Database",
        zipCode: zip,
        state: userState
      });
    } catch (error) {
      errLog("Failed to search public defenders", error);
      res.status(500).json({ success: false, error: "Search failed" });
    }
  });

  // Local Resources API - Courthouses (uses OpenStreetMap Nominatim for real courthouse data)
  app.get("/api/local-resources/courthouses", async (req, res) => {
    try {
      const { zip } = req.query;
      
      if (!zip || typeof zip !== 'string' || zip.length !== 5) {
        return res.status(400).json({ success: false, error: "Valid 5-digit ZIP code required" });
      }

      const geocodeUrl = `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=us&format=json&limit=1`;
      const geocodeResponse = await fetch(geocodeUrl, {
        headers: { 'User-Agent': 'PublicDefenderAI/1.0' }
      });

      if (!geocodeResponse.ok) {
        return res.status(500).json({ success: false, error: "Location lookup failed" });
      }

      const geocodeData = await geocodeResponse.json();
      if (!geocodeData || geocodeData.length === 0) {
        return res.status(404).json({ success: false, error: "ZIP code not found" });
      }

      const { lat, lon } = geocodeData[0];

      const searchUrl = `https://nominatim.openstreetmap.org/search?q=courthouse&format=json&limit=10&addressdetails=1&viewbox=${parseFloat(lon)-0.5},${parseFloat(lat)+0.5},${parseFloat(lon)+0.5},${parseFloat(lat)-0.5}&bounded=0`;
      const searchResponse = await fetch(searchUrl, {
        headers: { 'User-Agent': 'PublicDefenderAI/1.0' }
      });

      const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 3959;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      };

      let results: any[] = [];

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        results = searchData
          .filter((place: any) => place.type === 'courthouse' || place.class === 'amenity' || place.display_name?.toLowerCase().includes('court'))
          .map((place: any) => {
            const dist = calculateDistance(parseFloat(lat), parseFloat(lon), parseFloat(place.lat), parseFloat(place.lon));
            const addr = place.address || {};
            const addressParts = [addr.house_number, addr.road, addr.city || addr.town || addr.village, addr.state, addr.postcode].filter(Boolean);
            return {
              name: place.display_name?.split(',')[0] || 'Courthouse',
              address: addressParts.join(', ') || place.display_name?.split(',').slice(0, 3).join(',').trim(),
              phone: 'Contact courthouse for information',
              website: null,
              hours: 'Mon-Fri 8:30 AM - 4:30 PM (typical hours, verify with courthouse)',
              distance: `${dist.toFixed(1)} miles`,
              distanceValue: dist
            };
          })
          .sort((a: any, b: any) => a.distanceValue - b.distanceValue)
          .slice(0, 10);
      }

      res.json({
        success: true,
        results,
        count: results.length,
        source: "OpenStreetMap",
        zipCode: zip,
        note: results.length === 0 ? "No courthouses found near this ZIP code. Try contacting your local bar association for court information." : undefined
      });
    } catch (error) {
      errLog("Failed to search courthouses", error);
      res.status(500).json({ success: false, error: "Search failed" });
    }
  });

  // Personalized Legal Guidance API (rate limited - expensive AI operations)
  app.post("/api/legal-guidance", requireBudget, aiRateLimiter, aiDailyLimiter, requireCaptcha, async (req, res) => {
    try {
      const sessionId = req.body.sessionId || randomUUID();
      
      // Transform the data to match schema expectations
      const transformedData = {
        ...req.body,
        sessionId,
        charges: Array.isArray(req.body.charges) 
          ? req.body.charges 
          : typeof req.body.charges === 'string' 
            ? [req.body.charges] 
            : req.body.charges,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      };
      
      const validatedData = insertLegalCaseSchema.parse(transformedData);

      // Generate personalized guidance based on case details
      const guidance = await generateLegalGuidance(validatedData);
      
      const legalCase = await storage.createLegalCase({
        ...validatedData,
        guidance,
      });

      // Add generation timestamp to guidance for transparency
      const guidanceWithTimestamp = {
        ...(typeof legalCase.guidance === 'object' ? legalCase.guidance : {}),
        generatedAt: new Date().toISOString()
      };

      res.json({ 
        success: true, 
        sessionId,
        guidance: guidanceWithTimestamp
      });
    } catch (error) {
      errLog("Failed to generate legal guidance", error);
      res.status(500).json({ success: false, error: "Failed to generate guidance" });
    }
  });

  // Get Legal Guidance by Session
  app.get("/api/legal-guidance/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const legalCase = await storage.getLegalCase(sessionId);
      
      if (!legalCase) {
        return res.status(404).json({ success: false, error: "Session not found or expired" });
      }

      // Add creation timestamp for transparency
      const guidanceWithTimestamp = {
        ...(typeof legalCase.guidance === 'object' ? legalCase.guidance : {}),
        generatedAt: legalCase.createdAt?.toISOString() || new Date().toISOString()
      };

      res.json({ 
        success: true, 
        guidance: guidanceWithTimestamp,
        case: legalCase 
      });
    } catch (error) {
      errLog("Failed to fetch legal guidance", error);
      res.status(500).json({ success: false, error: "Failed to fetch guidance" });
    }
  });

  // Case Feedback API - Submit feedback on precedent case helpfulness
  app.post("/api/case-feedback", writeRateLimiter, async (req, res) => {
    try {
      // Use Zod schema for validation
      const parseResult = insertCaseFeedbackSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const errorMessages = parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        return res.status(400).json({ 
          success: false, 
          error: `Validation failed: ${errorMessages.join(', ')}` 
        });
      }
      
      const { sessionId, caseId, caseName, jurisdiction, chargeCategory, isHelpful, caseStage } = parseResult.data;
      
      // Additional security checks beyond schema validation
      if (sessionId.length < 10 || sessionId.length > 100) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid session ID format" 
        });
      }
      
      // Check for duplicate feedback (one vote per session per case)
      const existingFeedback = await storage.getCaseFeedbackBySession(sessionId);
      const alreadyVoted = existingFeedback.some(f => f.caseId === caseId);
      if (alreadyVoted) {
        return res.status(409).json({ 
          success: false, 
          error: "Feedback already submitted for this case" 
        });
      }
      
      const feedback = await storage.createCaseFeedback({
        sessionId,
        caseId,
        caseName,
        jurisdiction,
        chargeCategory: chargeCategory || null,
        isHelpful,
        caseStage: caseStage || null,
      });
      
      opsLog('feedback', `Vote received: ${isHelpful ? 'helpful' : 'not helpful'}`);
      
      res.json({ success: true, feedback });
    } catch (error) {
      errLog("Failed to submit case feedback", error);
      res.status(500).json({ success: false, error: "Failed to submit feedback" });
    }
  });

  // Get Case Feedback Stats - Aggregated helpfulness stats for a case
  app.get("/api/case-feedback/stats/:caseId", async (req, res) => {
    try {
      const { caseId } = req.params;
      const stats = await storage.getCaseFeedbackStats(caseId);
      
      res.json({ success: true, stats });
    } catch (error) {
      errLog("Failed to get case feedback stats", error);
      res.status(500).json({ success: false, error: "Failed to get feedback stats" });
    }
  });

  // Get User's Case Feedback by Session
  app.get("/api/case-feedback/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const feedback = await storage.getCaseFeedbackBySession(sessionId);
      
      res.json({ success: true, feedback });
    } catch (error) {
      errLog("Failed to get session feedback", error);
      res.status(500).json({ success: false, error: "Failed to get feedback" });
    }
  });

  // Privacy Consent Tracking - Record user consent (anonymous)
  app.post("/api/privacy-consent", writeRateLimiter, async (req, res) => {
    try {
      const { sessionId, consentType, consentVersion, granted } = req.body;
      
      if (!sessionId || !consentType || !consentVersion || granted === undefined) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing required fields: sessionId, consentType, consentVersion, granted" 
        });
      }
      
      // Hash the session ID for privacy (we don't store the actual session ID)
      const crypto = await import('crypto');
      const sessionHash = crypto.createHash('sha256').update(sessionId).digest('hex');
      
      // Optionally hash the IP for audit purposes
      const ip = req.ip || req.socket.remoteAddress || '';
      const ipHash = ip ? crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16) : null;
      
      const consent = await storage.recordPrivacyConsent({
        sessionHash,
        consentType,
        consentVersion,
        granted,
        ipHash,
        userAgent: req.headers['user-agent'] || null,
      });
      
      opsLog('privacy', `Consent recorded: ${consentType} v${consentVersion} - ${granted ? 'granted' : 'denied'}`);
      
      res.json({ success: true, recorded: true });
    } catch (error) {
      errLog("Failed to record privacy consent", error);
      res.status(500).json({ success: false, error: "Failed to record consent" });
    }
  });

  // Privacy Consent Stats - Aggregate stats (no PII exposed)
  app.get("/api/privacy-consent/stats", async (req, res) => {
    try {
      const stats = await storage.getPrivacyConsentStats();
      res.json({ success: true, stats });
    } catch (error) {
      errLog("Failed to get privacy consent stats", error);
      res.status(500).json({ success: false, error: "Failed to get stats" });
    }
  });

  // Session Data Cleanup - Delete all data for a session (privacy feature)
  app.delete("/api/session/:sessionId", writeRateLimiter, async (req, res) => {
    try {
      const { sessionId } = req.params;

      if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ success: false, error: "Valid session ID required" });
      }

      // Delete session data from storage
      await storage.deleteSessionData(sessionId);

      // Clear AI guidance cache (uses singleton already imported at top)
      clearSessionCache(sessionId);

      res.json({
        success: true,
        message: "Session data deleted",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      errLog("Failed to delete session data", error);
      res.status(500).json({ success: false, error: "Failed to delete session data" });
    }
  });

  // Clear Session - Clear all cached guidance data (privacy feature)
  app.post("/api/session/clear", writeRateLimiter, (_req, res) => {
    try {
      // Clear all AI guidance cache
      clearSessionCache();

      res.json({
        success: true,
        message: "Session cleared",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to clear session:", error);
      res.status(500).json({ success: false, error: "Failed to clear session" });
    }
  });

  // Claude AI Health Check
  app.get("/api/ai/health", async (req, res) => {
    try {
      const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
      if (!hasApiKey) {
        return res.json({ 
          success: true, 
          available: false, 
          reason: "API key not configured" 
        });
      }

      const isConnected = await testClaudeConnection();
      res.json({ 
        success: true, 
        available: isConnected,
        model: CLAUDE_MODEL_DISPLAY_NAME,
        features: ["personalized-guidance", "natural-language-processing"]
      });
    } catch (error) {
      errLog("AI health check failed", error);
      res.json({ 
        success: true, 
        available: false, 
        reason: "Connection test failed" 
      });
    }
  });

  // AI Availability Status (for frontend banners)
  app.get("/api/ai/status", (req, res) => {
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
    const costStatus = getAICostStatus();

    res.json({
      success: true,
      available: hasApiKey && costStatus.available,
      reason: !hasApiKey
        ? 'AI service not configured'
        : costStatus.message || undefined,
      budget: {
        dailyBudget: costStatus.dailyBudget,
        remainingBudget: costStatus.remainingBudget,
        requestCount: costStatus.requestCount,
      },
    });
  });

  // RECAP/Court Records Search API
  app.get("/api/court-records/search", searchRateLimiter, async (req, res) => {
    try {
      const {
        q: searchTerm,
        case_name: caseName,
        docket_number: docketNumber,
        court,
        date_from: dateFrom,
        date_to: dateTo,
        search_type: searchType
      } = req.query;

      if (!searchTerm && !caseName && !docketNumber) {
        return res.status(400).json({
          success: false,
          error: "At least one search parameter required (search term, case name, or docket number)"
        });
      }

      // Validate search parameters that are provided
      if (searchTerm) {
        const validation = validateSearchQuery(searchTerm);
        if (!validation.valid) {
          return res.status(400).json({ success: false, error: validation.error });
        }
      }
      if (caseName && typeof caseName === 'string' && caseName.length > MAX_QUERY_LENGTH) {
        return res.status(400).json({ success: false, error: `Case name exceeds maximum length of ${MAX_QUERY_LENGTH} characters` });
      }

      const results = await recapService.searchUnifiedCourtRecords({
        searchTerm: searchTerm as string,
        caseName: caseName as string,
        docketNumber: docketNumber as string,
        court: court as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        searchType: (searchType as string) === 'semantic' ? 'semantic' : 'keyword'
      });

      res.json({ 
        success: true, 
        ...results,
        message: results.hasRecapAccess 
          ? 'Showing results from RECAP Archive (free) and case law database'
          : 'Limited results - API token required for full RECAP access'
      });
    } catch (error) {
      errLog("Court records search failed", error);
      res.status(500).json({ success: false, error: "Search failed" });
    }
  });

  // Get RECAP Docket Details
  app.get("/api/court-records/docket/:docketId", async (req, res) => {
    try {
      const { docketId } = req.params;
      
      if (!docketId || isNaN(Number(docketId))) {
        return res.status(400).json({ success: false, error: "Valid docket ID required" });
      }

      const docket = await recapService.getDocket(Number(docketId));
      const documents = await recapService.getDocketDocuments(Number(docketId));

      res.json({ 
        success: true, 
        docket,
        documents: documents.results,
        documentCount: documents.count
      });
    } catch (error) {
      errLog("Failed to fetch docket details", error);
      res.status(500).json({ success: false, error: "Failed to fetch docket details" });
    }
  });


  // BJS Statistics API - Get crime statistics
  app.get("/api/statistics/bjs/crime", async (req, res) => {
    try {
      const { startYear, endYear } = req.query;
      const stats = await bjsStatisticsService.getCrimeStatistics(
        startYear ? parseInt(startYear as string) : undefined,
        endYear ? parseInt(endYear as string) : undefined
      );
      res.json({ success: true, ...stats });
    } catch (error) {
      errLog("BJS statistics fetch failed", error);
      res.status(500).json({ success: false, error: "Failed to fetch BJS crime statistics" });
    }
  });

  // BJS Statistics API - Get victimization trends
  app.get("/api/statistics/bjs/trends", async (req, res) => {
    try {
      const { years } = req.query;
      const yearArray = years 
        ? (years as string).split(',').map(y => parseInt(y)) 
        : [new Date().getFullYear() - 5, new Date().getFullYear() - 1];
      
      const trends = await bjsStatisticsService.getVictimizationTrends(yearArray);
      res.json({ success: true, ...trends });
    } catch (error) {
      errLog("BJS trends fetch failed", error);
      res.status(500).json({ success: false, error: "Failed to fetch victimization trends" });
    }
  });

  // BJS Statistics API - Health check
  app.get("/api/statistics/bjs/health", async (req, res) => {
    try {
      const health = await bjsStatisticsService.checkHealth();
      res.json(health);
    } catch (error) {
      res.status(500).json({ healthy: false, message: "Health check failed" });
    }
  });

  // OpenLaws API - Check availability
  app.get("/api/openlaws/status", async (req, res) => {
    try {
      const status = await openLawsClient.checkAvailability();
      res.json(status);
    } catch (error) {
      errLog("OpenLaws status check failed", error);
      res.status(500).json({ available: false, message: "Status check failed" });
    }
  });

  // OpenLaws API - Search by citation
  app.get("/api/openlaws/citation/:citation", async (req, res) => {
    try {
      const { citation } = req.params;
      const statute = await openLawsClient.searchByCitation(decodeURIComponent(citation));
      if (statute) {
        res.json({ success: true, statute });
      } else {
        res.status(404).json({ success: false, error: "Statute not found" });
      }
    } catch (error) {
      errLog("OpenLaws citation search failed", error);
      res.status(500).json({ success: false, error: "Search failed" });
    }
  });

  // OpenLaws API - Bulk import jurisdiction (disabled - method not implemented)
  // TODO: Implement bulkImportJurisdiction in openlaws-client if needed

  // ============================================================================
  // Attorney Document Generation API
  // ============================================================================

  // Create verified attorney session
  app.post("/api/attorney/verify", attorneyVerificationRateLimiter, async (req, res) => {
    try {
      const validation = attorneyVerificationRequestSchema.safeParse(req.body);

      if (!validation.success) {
        const errorMessages = validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        return res.status(400).json({
          success: false,
          error: `Validation failed: ${errorMessages.join(', ')}`
        });
      }

      const session = attorneySessionManager.createSession(validation.data);

      if (!session) {
        return res.status(400).json({
          success: false,
          error: 'Failed to create attorney session'
        });
      }

      // Set httpOnly cookie with session ID
      res.cookie(attorneySessionManager.getCookieName(), session.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: attorneySessionManager.getSessionTTL(),
        path: '/'
      });

      res.json({
        success: true,
        sessionId: session.sessionId,
        expiresAt: session.expiresAt
      });
    } catch (error) {
      errLog("Attorney verification failed", error);
      res.status(500).json({ success: false, error: "Verification failed" });
    }
  });

  // Validate existing attorney session
  app.get("/api/attorney/session", async (req, res) => {
    try {
      const sessionId = req.cookies?.[attorneySessionManager.getCookieName()];

      if (!sessionId) {
        return res.json({
          success: true,
          isVerified: false,
          error: 'No session found'
        });
      }

      const session = attorneySessionManager.validateSession(sessionId);

      if (!session) {
        // Clear invalid/expired cookie
        res.clearCookie(attorneySessionManager.getCookieName(), { path: '/' });
        return res.json({
          success: true,
          isVerified: false,
          error: 'Session expired or invalid'
        });
      }

      res.json({
        success: true,
        isVerified: true,
        expiresAt: session.expiresAt,
        timeRemaining: attorneySessionManager.getTimeRemaining(sessionId)
      });
    } catch (error) {
      errLog("Attorney session validation failed", error);
      res.status(500).json({ success: false, error: "Session validation failed" });
    }
  });

  // Cleanup attorney session on page unload (via sendBeacon)
  // sendBeacon sends a POST with cookies but no custom headers,
  // so this is a separate endpoint from the DELETE route.
  app.post("/api/attorney/session/cleanup", async (req, res) => {
    try {
      const sessionId = req.cookies?.[attorneySessionManager.getCookieName()];

      if (sessionId) {
        const clearedDocs = clearSessionDocuments(sessionId);
        if (clearedDocs > 0) {
          opsLog('attorney-session', `Cleared ${clearedDocs} document(s) on page unload`);
        }
        attorneySessionManager.terminateSession(sessionId, 'user');
      }

      res.clearCookie(attorneySessionManager.getCookieName(), { path: '/' });
      res.status(200).json({ success: true });
    } catch (error) {
      errLog("Attorney session cleanup failed:", error);
      res.status(500).json({ success: false });
    }
  });

  // Terminate attorney session
  app.delete("/api/attorney/session", async (req, res) => {
    try {
      const sessionId = req.cookies?.[attorneySessionManager.getCookieName()];

      if (sessionId) {
        // Clear generated documents for this session before terminating
        const clearedDocs = clearSessionDocuments(sessionId);
        if (clearedDocs > 0) {
          opsLog('attorney-session', `Cleared ${clearedDocs} document(s) on session termination`);
        }
        attorneySessionManager.terminateSession(sessionId, 'user');
      }

      // Clear cookie regardless
      res.clearCookie(attorneySessionManager.getCookieName(), { path: '/' });

      res.json({
        success: true,
        message: 'Session terminated'
      });
    } catch (error) {
      errLog("Attorney session termination failed", error);
      res.status(500).json({ success: false, error: "Session termination failed" });
    }
  });

  // ============================================================================
  // Attorney Session Middleware
  // ============================================================================

  /**
   * Middleware to validate attorney session for protected endpoints
   */
  const requireAttorneySession = (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.cookies?.[attorneySessionManager.getCookieName()];

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        error: 'Attorney session required'
      });
    }

    const session = attorneySessionManager.validateSession(sessionId);

    if (!session) {
      res.clearCookie(attorneySessionManager.getCookieName(), { path: '/' });
      return res.status(401).json({
        success: false,
        error: 'Session expired or invalid'
      });
    }

    // Attach session info to request for use in handlers
    (req as any).attorneySession = session;
    next();
  };

  // ============================================================================
  // Attorney Document Templates API
  // ============================================================================

  // List available templates
  app.get("/api/attorney/templates", requireAttorneySession, async (req, res) => {
    try {
      const { category } = req.query;
      const templates = getTemplates(category as string);

      res.json({
        success: true,
        templates
      });
    } catch (error) {
      errLog("Failed to fetch templates", error);
      res.status(500).json({ success: false, error: "Failed to fetch templates" });
    }
  });

  // Get specific template
  app.get("/api/attorney/templates/:templateId", requireAttorneySession, async (req, res) => {
    try {
      const { templateId } = req.params;
      const { jurisdiction } = req.query;

      const template = getTemplate(templateId, jurisdiction as string);

      if (!template) {
        return res.status(404).json({
          success: false,
          error: 'Template not found'
        });
      }

      res.json({
        success: true,
        template
      });
    } catch (error) {
      errLog("Failed to fetch template", error);
      res.status(500).json({ success: false, error: "Failed to fetch template" });
    }
  });

  // Generate document (AI sections) - rate limited
  const generateDocumentSchema = z.object({
    templateId: z.string(),
    jurisdiction: z.string(),
    courtType: z.enum(["state", "federal", "immigration"]).optional(),
    district: z.string().optional(),
    formData: z.record(z.string(), z.string())
  });

  app.post("/api/attorney/documents/generate", requireAttorneySession, requireBudget, aiRateLimiter, aiDailyLimiter, requireCaptcha, async (req, res) => {
    try {
      const validation = generateDocumentSchema.safeParse(req.body);

      if (!validation.success) {
        const errorMessages = validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        return res.status(400).json({
          success: false,
          error: `Validation failed: ${errorMessages.join(', ')}`
        });
      }

      const { templateId, jurisdiction, courtType, district, formData } = validation.data;
      const session = (req as any).attorneySession;

      const document = await generateDocument({
        templateId,
        jurisdiction,
        courtType,
        district,
        formData,
        sessionId: session.sessionId
      });

      res.json({
        success: true,
        document: {
          documentId: document.documentId,
          templateId: document.templateId,
          templateName: document.templateName,
          jurisdiction: document.jurisdiction,
          courtType: document.courtType,
          district: document.district,
          sections: document.sections,
          generatedAt: document.generatedAt.toISOString(),
          expiresAt: document.expiresAt.toISOString()
        }
      });
    } catch (error: any) {
      errLog("Document generation failed:", error.message);
      res.status(500).json({
        success: false,
        error: error.message || "Document generation failed"
      });
    }
  });

  // Export document to DOCX
  app.post("/api/attorney/documents/export", requireAttorneySession, async (req, res) => {
    try {
      const { documentId, formData } = req.body;

      if (!documentId) {
        return res.status(400).json({
          success: false,
          error: 'Document ID required'
        });
      }

      const document = getGeneratedDocument(documentId);

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found or expired'
        });
      }

      // Generate DOCX
      const docxBuffer = await generateDocx(document, formData || {});

      // Set headers for file download
      const filename = `${document.templateName.replace(/\s+/g, '_')}_${document.documentId.substring(0, 8)}.docx`;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', docxBuffer.length);

      res.send(docxBuffer);
    } catch (error: any) {
      errLog("Document export failed:", error.message);
      res.status(500).json({ success: false, error: "Document export failed" });
    }
  });

  // Get generated document by ID
  app.get("/api/attorney/documents/:documentId", requireAttorneySession, async (req, res) => {
    try {
      const { documentId } = req.params;

      const document = getGeneratedDocument(documentId);

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found or expired'
        });
      }

      res.json({
        success: true,
        document: {
          documentId: document.documentId,
          templateId: document.templateId,
          templateName: document.templateName,
          jurisdiction: document.jurisdiction,
          courtType: document.courtType,
          district: document.district,
          sections: document.sections,
          generatedAt: document.generatedAt.toISOString(),
          expiresAt: document.expiresAt.toISOString()
        }
      });
    } catch (error) {
      errLog("Failed to fetch document", error);
      res.status(500).json({ success: false, error: "Failed to fetch document" });
    }
  });

  // ============================================================================
  // Document Summarization API (Session-based, no storage)
  // ============================================================================

  /**
   * Configure multer for in-memory file handling only.
   * Files are NEVER written to disk - processed in memory and discarded.
   * Maximum file size: 10MB
   */
  const documentUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max
      files: 1, // Only one file at a time
    },
    fileFilter: (req, file, cb) => {
      const error = validateFile(file.mimetype, 0); // Size check done by limits
      if (error && error.code === 'UNSUPPORTED_TYPE') {
        cb(new Error(error.message));
      } else {
        cb(null, true);
      }
    },
  });

  /**
   * Get supported file types for document summarization
   * Public endpoint - no auth required
   */
  app.get("/api/document-summary/supported-types", (req, res) => {
    res.json({
      success: true,
      supportedTypes: getSupportedFileTypes(),
      maxFileSizeMB: 10,
      privacyNotice: {
        weStore: false,
        anthropicTrains: false,
        anthropicRetention: "Anthropic may temporarily retain data for up to 30 days for operational and safety purposes, then it is automatically deleted.",
        recommendation: "For maximum privacy, avoid including unnecessary personal information in documents you upload."
      }
    });
  });

  /**
   * Summarize a document using Claude AI
   *
   * PRIVACY GUARANTEES:
   * - Document is processed in memory only - never saved to disk or database
   * - No caching of documents or summaries
   * - Response is returned and all data is garbage collected
   * - Anthropic does not use API data for training
   * - Anthropic may retain data for up to 30 days for operational purposes
   */
  app.post("/api/document-summary/summarize", requireBudget, aiRateLimiter, aiDailyLimiter, (req, res, next) => {
    documentUpload.single('document')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              error: 'File too large. Maximum size is 10MB.'
            });
          }
          return res.status(400).json({
            success: false,
            error: `Upload error: ${err.message}`
          });
        }
        return res.status(400).json({
          success: false,
          error: err.message || 'Invalid file'
        });
      }
      next();
    });
  }, async (req: Request, res: Response) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'No document provided'
        });
      }

      // Validate consent was given
      const consentGiven = req.body.consentGiven === 'true' || req.body.consentGiven === true;
      if (!consentGiven) {
        // Clear file from memory immediately
        (req as any).file = null;
        return res.status(400).json({
          success: false,
          error: 'Consent required before processing document'
        });
      }

      // Verify CAPTCHA token
      const captchaToken = req.body.captchaToken || req.body['captcha-token'];
      if (isCaptchaRequired() && !captchaToken) {
        (req as any).file = null;
        return res.status(400).json({
          success: false,
          error: 'CAPTCHA verification required',
          code: 'CAPTCHA_REQUIRED'
        });
      }

      if (captchaToken) {
        const { verifyCaptcha } = await import('./services/captcha-verification');
        const captchaResult = await verifyCaptcha(captchaToken, req.ip || req.socket.remoteAddress);
        if (!captchaResult.success) {
          (req as any).file = null;
          return res.status(403).json({
            success: false,
            error: captchaResult.error || 'CAPTCHA verification failed',
            code: 'CAPTCHA_FAILED'
          });
        }
      }

      const language = (req.body.language as 'en' | 'es') || 'en';
      const summaryType = req.body.summaryType || 'general';

      devLog('doc-summary', `Processing ${file.originalname} (${file.size} bytes)`);

      // Summarize the document (no storage, processed in memory)
      const summary = await summarizeDocument({
        file: file.buffer,
        mimeType: file.mimetype,
        filename: file.originalname,
        language,
        summaryType,
      });

      // IMPORTANT: Clear file buffer from memory after processing
      // This ensures the document is not retained in server memory
      (req as any).file = null;

      // Log anonymized metrics only (no content)
      opsLog('doc-summary', `Completed: type=${summary.documentType}, pages=${summary.pageCount || 'N/A'}, tokens=${summary.usageMetrics.inputTokens}+${summary.usageMetrics.outputTokens}`);

      res.json({
        success: true,
        summary,
        privacyConfirmation: {
          documentStored: false,
          summaryStored: false,
          message: "Your document and this summary have not been stored. This data exists only in your browser session."
        }
      });

    } catch (error) {
      // Clear file from memory on error
      (req as any).file = null;

      errLog('[DocumentSummary] Error:', error);

      const message = error instanceof Error ? error.message : 'Failed to summarize document';
      res.status(500).json({
        success: false,
        error: message
      });
    }
  });

  /**
   * Attorney-specific document summarization endpoint
   * Requires valid attorney session, uses same privacy guarantees
   */
  app.post("/api/attorney/document-summary/summarize", requireAttorneySession, requireBudget, aiRateLimiter, aiDailyLimiter, (req, res, next) => {
    documentUpload.single('document')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              error: 'File too large. Maximum size is 10MB.'
            });
          }
        }
        return res.status(400).json({
          success: false,
          error: err.message || 'Invalid file'
        });
      }
      next();
    });
  }, async (req: Request, res: Response) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'No document provided'
        });
      }

      // Verify CAPTCHA token (required even for attorneys to prevent session abuse)
      const captchaToken = req.body.captchaToken || req.body['captcha-token'];
      if (isCaptchaRequired() && !captchaToken) {
        (req as any).file = null;
        return res.status(400).json({
          success: false,
          error: 'CAPTCHA verification required',
          code: 'CAPTCHA_REQUIRED'
        });
      }

      if (captchaToken) {
        const { verifyCaptcha } = await import('./services/captcha-verification');
        const captchaResult = await verifyCaptcha(captchaToken, req.ip || req.socket.remoteAddress);
        if (!captchaResult.success) {
          (req as any).file = null;
          return res.status(403).json({
            success: false,
            error: captchaResult.error || 'CAPTCHA verification failed',
            code: 'CAPTCHA_FAILED'
          });
        }
      }

      const language = (req.body.language as 'en' | 'es') || 'en';
      const summaryType = req.body.summaryType || 'legal_document';

      devLog('attorney-doc-summary', `Processing ${file.originalname} (${file.size} bytes)`);

      const summary = await summarizeDocument({
        file: file.buffer,
        mimeType: file.mimetype,
        filename: file.originalname,
        language,
        summaryType,
      });

      // Clear file buffer
      (req as any).file = null;

      opsLog('attorney-doc-summary', `Completed: type=${summary.documentType}, pages=${summary.pageCount || 'N/A'}`);

      res.json({
        success: true,
        summary,
        privacyConfirmation: {
          documentStored: false,
          summaryStored: false,
        }
      });

    } catch (error) {
      (req as any).file = null;
      errLog('[AttorneyDocSummary] Error:', error);

      const message = error instanceof Error ? error.message : 'Failed to summarize document';
      res.status(500).json({
        success: false,
        error: message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function generateLegalGuidance(caseData: any) {
  // Extract charge classifications first
  const chargeIds = Array.isArray(caseData.charges) ? caseData.charges : [caseData.charges];
  const chargeClassifications = chargeIds
    .map((id: string) => {
      const charge = getChargeById(id);
      if (!charge) {
        opsLog('guidance', `Warning: Charge ID "${id}" not found in database`);
        return null;
      }
      return { 
        name: charge.name, 
        classification: charge.category, 
        code: charge.code,
        title: charge.name,
        maxPenalty: charge.maxPenalty 
      };
    })
    .filter(Boolean);
  
  // Log if we couldn't find all charges
  if (chargeClassifications.length !== chargeIds.length) {
    opsLog('guidance', `Warning: Could not find all charges. Found ${chargeClassifications.length} of ${chargeIds.length}`);
  }
  
  // Try Claude AI first if API key is available
  const useAI = !!process.env.ANTHROPIC_API_KEY;
  
  if (useAI && (caseData.incidentDescription || (caseData.selectedConcerns && caseData.selectedConcerns.length > 0))) {
    try {
      devLog('guidance', 'Generating AI-powered guidance with Claude...');
      const claudeGuidance = await generateClaudeGuidance(caseData);
      
      // Log usage metrics (safe aggregates only)
      opsLog('ai', `Tokens: ${claudeGuidance.usageMetrics.inputTokens}+${claudeGuidance.usageMetrics.outputTokens}, Cost: $${claudeGuidance.usageMetrics.estimatedCost.toFixed(4)}`);
      
      return {
        ...claudeGuidance,
        chargeClassifications: chargeClassifications.length > 0 ? chargeClassifications : undefined,
        generatedBy: 'claude-ai'
      };
    } catch (error) {
      errLog('Claude AI failed, falling back to rule-based system', error);
      // Fall through to rule-based system
    }
  }
  
  // Fallback to rule-based guidance engine
  devLog('guidance', 'Generating rule-based guidance...');
  const guidance = generateEnhancedGuidance(caseData);
  
  // Run validation for rule-based guidance as well
  let validation;
  try {
    const validationResult = await validateLegalGuidance(guidance, {
      jurisdiction: caseData.jurisdiction,
      charges: caseData.charges,
      caseStage: caseData.caseStage,
    });
    
    validation = {
      confidenceScore: validationResult.confidenceScore,
      isValid: validationResult.isValid,
      summary: validationResult.summary,
      checksPerformed: validationResult.checksPerformed,
      checksPassed: validationResult.checksPassed,
      issues: validationResult.issues.map(issue => ({
        type: issue.type,
        severity: issue.severity,
        message: issue.message,
        suggestion: issue.suggestion,
      })),
    };
    
    opsLog('guidance', `Validation: ${(validationResult.confidenceScore * 100).toFixed(1)}% confidence`);
  } catch (validationError) {
    devLog('guidance', 'Rule-based validation failed', validationError);
  }
  
  return {
    ...guidance,
    chargeClassifications: chargeClassifications.length > 0 ? chargeClassifications : undefined,
    validation,
    generatedBy: 'rule-based'
  };
}
