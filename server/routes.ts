import type { Express, Request, Response, NextFunction } from "express";
import { CLAUDE_MODEL_SONNET_DISPLAY_NAME } from "./config/ai-model";
import fs from "fs";
import path from "path";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { courtListenerService } from "./services/courtlistener";
import { legalDataService } from "./services/legal-data";
import { recapService } from "./services/recap";
import { bjsStatisticsService } from "./services/bjs-statistics";
import { insertLegalCaseSchema, insertCaseFeedbackSchema, insertGuidanceFlagSchema } from "@shared/schema";
import { randomUUID, timingSafeEqual } from "crypto";
import { generateEnhancedGuidance, stampEstimateDeadlines } from "./services/guidance-engine.js";
import { generateClaudeGuidance, streamClaudeGuidance, testClaudeConnection, clearSessionCache } from "./services/claude-guidance.js";
import { redactCaseDetails } from "./services/pii-redactor.js";
import { getChargeById, getChargesByJurisdiction, criminalCharges, chargeCategories, getInstructionRef, getInstructionUrl, getVerifiedCitation } from "../shared/criminal-charges.js";
import { translateChargeName, translateDescription } from "../shared/charge-translations.js";
import { validateLegalGuidance } from "./services/legal-accuracy-validator";
import { statuteSeeder } from "./services/statute-seeder";
import { openLawsClient } from "./services/openlaws-client";
import rateLimit from "express-rate-limit";
import { devLog, opsLog, errLog } from "./utils/dev-logger";
import { attorneySessionManager } from "./services/attorney-docs/session-manager";
import { attorneyVerificationRequestSchema } from "../shared/attorney/attestation-schema";
import { getTemplates, getTemplate, generateDocument, getGeneratedDocument, clearSessionDocuments } from "./services/attorney-docs/document-generator";
import { getPlaybooks, getPlaybook } from "../shared/playbooks/index";
import { generateDocx } from "./services/attorney-docs/docx-generator";
import { search, buildSearchIndex, getSearchIndexStats } from "./services/search-indexer";
import { z } from "zod";
import multer from "multer";
import { summarizeDocument, validateFile, getSupportedFileTypes, createSummaryBatch, getSummaryBatchStatus, cancelSummaryBatch, redactDocumentPII } from "./services/document-summarizer";
import { requireCaptcha } from "./middleware/captcha-middleware";
import { getCaptchaSiteKey, isCaptchaRequired } from "./services/captcha-verification";
import { requireServiceBudget } from "./middleware/budget-gate";
import { getAICostStatus } from "./services/cost-tracker";
import { locusSearch, normalizeStateCode } from "./services/locus-lookup";
import { polishMitigationNarrative, MITIGATION_FIELD_WHITELIST } from "./services/mitigation-polisher";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============================================================================
  // SECURITY: Guidance Session Ownership Map
  // Maps case sessionId → express session ID to enforce ownership on retrieval.
  // In-memory only — consistent with the 24-hour ephemeral architecture.
  // Cases created before a server restart lose their binding and are accessible
  // only by UUID knowledge (compensating control: rate limiting + 128-bit entropy).
  // Full DB-backed binding is tracked in: docs/security-controls.md
  // ============================================================================
  const guidanceSessionOwners = new Map<string, string>();

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

  // Strict rate limiter for batch document submissions (expensive, multi-doc operations)
  const batchSubmitRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 batch submissions per hour per IP
    message: {
      success: false,
      error: 'Too many batch submissions. Please try again later.'
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

  // Rate limiter for document chat (30 messages per 15 min per IP)
  const docChatRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: {
      success: false,
      error: 'Too many document questions from this IP. Please wait 15 minutes before asking more.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'development',
    validate: { trustProxy: false, xForwardedForHeader: false },
  });

  // Rate limiter for anonymous guidance flags (10 per hour per IP)
  const flagRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { success: false, error: 'Too many flag requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false, xForwardedForHeader: false }
  });

  // Rate limiter for client-side error reports (60 per hour per IP)
  // Generous enough to catch cascading render errors, tight enough to block spam.
  const clientErrorRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 60,
    message: { success: false },
    standardHeaders: false,
    legacyHeaders: false,
    validate: { trustProxy: false, xForwardedForHeader: false },
  });

  // Rate limiter for equity audit (2 per hour — AI cost control)
  const equityAuditLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 2,
    message: { success: false, error: 'Equity audit rate limit reached. Try again in 1 hour.' },
    validate: { trustProxy: false, xForwardedForHeader: false },
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
   * Middleware to protect administrative endpoints with token authentication.
   * Set ADMIN_TOKEN environment variable to enable protection.
   * If not set, admin endpoints are disabled in production for security.
   *
   * SECURITY: Uses timing-safe comparison to prevent timing-oracle attacks.
   * SECURITY: ADMIN_DISABLE_AUTH=true is blocked outright in production.
   */
  const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
    // S4: Block ADMIN_DISABLE_AUTH in production unconditionally.
    if (process.env.ADMIN_DISABLE_AUTH === 'true') {
      if (process.env.NODE_ENV === 'production') {
        errLog('ADMIN_DISABLE_AUTH=true is set in production — blocking request and alerting');
        return res.status(503).json({ success: false, error: 'Admin access misconfigured.' });
      }
      devLog('security', 'Admin endpoint accessed with auth disabled via ADMIN_DISABLE_AUTH=true');
      return next();
    }

    // S2: Single token source — ADMIN_TOKEN — used by all admin endpoints.
    const adminToken = process.env.ADMIN_TOKEN;
    if (!adminToken) {
      return res.status(403).json({
        success: false,
        error: 'Administrative endpoints are not available.'
      });
    }

    // Accept token via Authorization: Bearer <token> or X-Admin-Api-Key: <token>
    const providedKey = req.headers['authorization']?.replace('Bearer ', '')
      ?? (req.headers['x-admin-api-key'] as string)
      ?? '';

    // S1: Timing-safe comparison — prevents byte-by-byte timing oracle attacks.
    const tokenBuf = Buffer.from(adminToken);
    const keyBuf = Buffer.from(providedKey);
    const lengthMatch = tokenBuf.length === keyBuf.length;
    // Always run timingSafeEqual to avoid leaking length via branch timing.
    const valueMatch = timingSafeEqual(
      tokenBuf,
      lengthMatch ? keyBuf : tokenBuf,
    );
    if (!lengthMatch || !valueMatch) {
      opsLog('security', `Unauthorized admin access attempt from ${req.ip}`);
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Valid admin token required.'
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
      if (state && (typeof state !== 'string' || state.length > 50)) {
        return res.status(400).json({ success: false, error: "Invalid state parameter" });
      }
      if (organizationType && (typeof organizationType !== 'string' || organizationType.length > 100)) {
        return res.status(400).json({ success: false, error: "Invalid organizationType parameter" });
      }
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
      const { jurisdiction, search, category, group, limit, language } = req.query;
      const isSpanish = language === 'es';
      
      let charges = jurisdiction 
        ? getChargesByJurisdiction(jurisdiction as string)
        : criminalCharges;
      
      // Filter by search term (search in both English and Spanish)
      if (search && typeof search === 'string' && search.length > 100) {
        return res.status(400).json({ success: false, error: "Search term too long" });
      }
      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        charges = charges.filter(charge => {
          if (charge.name.toLowerCase().includes(searchLower) ||
              charge.description.toLowerCase().includes(searchLower) ||
              charge.code.toLowerCase().includes(searchLower)) {
            return true;
          }
          
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

      // Filter by named charge group (e.g. "Public Order", "Violent Crimes")
      if (group && typeof group === 'string' && chargeCategories[group]) {
        const groupIds = new Set(chargeCategories[group]);
        charges = charges.filter(charge => groupIds.has(charge.id));
      }
      
      // Limit results
      const maxResults = Math.min(parseInt(limit as string, 10) || 200, 500);
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
        
        const instructionRef = getInstructionRef(charge);
        const instructionUrl = getInstructionUrl(charge);
        const verifiedCitation = getVerifiedCitation(charge);
        return {
          id: charge.id,
          // Only include `code` when the citation has been verified against a primary source.
          // Synthesized codes must not appear in the API response — callers should rely on
          // `citation` (the human-readable verified form) instead.
          ...(verifiedCitation ? { code: charge.code } : {}),
          /** Verified statute citation (e.g. "Cal. Penal Code § 212.5(a)"), or null when
           *  no high-confidence citation has been confirmed for this entry. */
          citation: verifiedCitation ?? null,
          name,
          category: charge.category,
          description,
          maxPenalty: charge.maxPenalty,
          ...(instructionRef ? { instructionRef } : {}),
          ...(instructionUrl ? { instructionUrl } : {}),
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
          'User-Agent': 'OpenDefender/1.0'
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
      if (isNaN(radiusMiles) || radiusMiles <= 0 || radiusMiles > 500) {
        return res.status(400).json({ success: false, error: "Invalid radius: must be a number between 1 and 500 miles" });
      }
      
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

  // LOCUS Municipal Ordinance Lookup
  // Queries LOCUS-v1 (LocalLaws/UC Berkeley, CC-BY-NC-4.0) for local ordinance text
  // relevant to charges commonly prosecuted under city/county code.
  app.get("/api/local-ordinance", searchRateLimiter, async (req, res) => {
    try {
      const { state, query } = req.query;

      if (!state || typeof state !== 'string') {
        return res.status(400).json({ success: false, error: 'state parameter required (2-letter postal code)' });
      }
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, error: 'query parameter required' });
      }

      const stateCode = normalizeStateCode(state);
      if (!stateCode) {
        return res.status(400).json({ success: false, error: 'Unrecognized state value' });
      }

      const sanitizedQuery = query.slice(0, 100).trim();
      if (!sanitizedQuery) {
        return res.status(400).json({ success: false, error: 'query must not be empty' });
      }

      const result = await locusSearch(sanitizedQuery, stateCode);

      res.json({
        success: true,
        found: result !== null,
        result: result ?? null,
        attribution: 'LOCUS-v1 (LocalLaws / UC Berkeley, CC-BY-NC-4.0) · https://huggingface.co/datasets/LocalLaws/LOCUS-v1',
      });
    } catch (error) {
      errLog('LOCUS ordinance lookup route error', error);
      res.status(500).json({ success: false, error: 'Lookup failed' });
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
  app.get("/api/statutes/seed-status", searchRateLimiter, async (req, res) => {
    try {
      const status = await statuteSeeder.getSeedingStatus();
      res.json({ success: true, ...status });
    } catch (error) {
      errLog("Failed to fetch seeding status", error);
      res.status(500).json({ success: false, error: "Failed to fetch status" });
    }
  });

  // ============================================================================
  // ADMIN: Key verification endpoint
  // A lightweight endpoint used by all admin pages to validate the admin key
  // without depending on any specific data store or feature endpoint.
  // Returns 200 OK if the x-admin-api-key header matches ADMIN_TOKEN; 401 otherwise.
  app.get("/api/admin/verify-key", adminRateLimiter, requireAdminAuth, (_req, res) => {
    res.json({ ok: true });
  });

  // ADMIN: Citation Review API
  // All endpoints require x-admin-api-key header.
  // ============================================================================

  const REVIEW_STATE_PATH = path.join(process.cwd(), "scripts/data-review/citation-review-state.json");

  function loadReviewState(): Record<string, any> {
    try {
      if (!fs.existsSync(REVIEW_STATE_PATH)) return { schemaVersion: 1, reviews: {} };
      return JSON.parse(fs.readFileSync(REVIEW_STATE_PATH, "utf-8"));
    } catch {
      return { schemaVersion: 1, reviews: {} };
    }
  }

  function saveReviewState(state: Record<string, any>): void {
    const reviewed = Object.values(state.reviews as Record<string, any>).filter(
      (r: any) => r.status !== "pending"
    ).length;
    state.lastUpdated = new Date().toISOString();
    state.totalReviewed = reviewed;
    fs.writeFileSync(REVIEW_STATE_PATH, JSON.stringify(state, null, 2));
  }

  // GET /api/admin/citation-review/charges
  // Returns all charge entries grouped by slug, with review state merged in.
  // Optional query params: ?slug=murder-in-the-first-degree  ?state=AL  ?status=pending
  app.get("/api/admin/citation-review/charges", adminRateLimiter, requireAdminAuth, (req, res) => {
    try {
      const { CHARGE_CITATIONS } = require("../shared/criminal-charge-citations.js");
      const reviewState = loadReviewState();
      const reviews = reviewState.reviews as Record<string, any>;

      const filterSlug = req.query.slug as string | undefined;
      const filterState = (req.query.state as string | undefined)?.toUpperCase();
      const filterStatus = req.query.status as string | undefined;

      // Build structured response: array of entries with review state merged
      const entries = Object.entries(CHARGE_CITATIONS as Record<string, any>)
        .map(([id, rec]: [string, any]) => {
          const m = id.match(/^([a-z]{2,3})-(.+)$/);
          const jurisdiction = m ? m[1].toUpperCase() : id;
          const slug = m ? m[2] : id;
          const review = reviews[id] ?? { status: "pending" };
          return {
            id,
            jurisdiction,
            slug,
            citation: rec.citation,
            alternateCitations: rec.alternateCitations,
            confidence: rec.confidence,
            lastVerified: rec.lastVerified,
            source: rec.source,
            reviewStatus: review.status ?? "pending",
            reviewedAt: review.reviewedAt ?? null,
            correctedCitation: review.correctedCitation ?? null,
            sourceUrl: review.sourceUrl ?? null,
            notes: review.notes ?? null,
          };
        })
        .filter((e) => {
          if (filterSlug && e.slug !== filterSlug) return false;
          if (filterState && e.jurisdiction !== filterState) return false;
          if (filterStatus && e.reviewStatus !== filterStatus) return false;
          return true;
        });

      // Group by slug for the review UI
      const bySlug: Record<string, any> = {};
      for (const entry of entries) {
        if (!bySlug[entry.slug]) bySlug[entry.slug] = [];
        bySlug[entry.slug].push(entry);
      }

      res.json({ success: true, entries, bySlug, total: entries.length });
    } catch (err) {
      errLog("Failed to load citation charges", err);
      res.status(500).json({ success: false, error: "Failed to load citation data" });
    }
  });

  // GET /api/admin/citation-review/progress
  // Returns review progress summary.
  app.get("/api/admin/citation-review/progress", adminRateLimiter, requireAdminAuth, (req, res) => {
    try {
      const { CHARGE_CITATIONS } = require("../shared/criminal-charge-citations.js");
      const reviewState = loadReviewState();
      const reviews = reviewState.reviews as Record<string, any>;
      const total = Object.keys(CHARGE_CITATIONS).length;
      const reviewed = Object.values(reviews).filter((r: any) => r.status !== "pending").length;
      const verified = Object.values(reviews).filter((r: any) => r.status === "verified").length;
      const corrected = Object.values(reviews).filter((r: any) => r.status === "corrected").length;
      const flagged = Object.values(reviews).filter((r: any) => r.status === "flagged").length;

      // Unique slugs
      const slugSet = new Set(
        Object.keys(CHARGE_CITATIONS).map((id) => id.replace(/^[a-z]{2,3}-/, ""))
      );
      const reviewedSlugs = new Set<string>();
      const pendingSlugs = new Set<string>();
      for (const [id] of Object.entries(CHARGE_CITATIONS)) {
        const slug = id.replace(/^[a-z]{2,3}-/, "");
        const r = reviews[id];
        if (r && r.status !== "pending") reviewedSlugs.add(slug);
        else pendingSlugs.add(slug);
      }

      res.json({
        success: true,
        total,
        reviewed,
        pending: total - reviewed,
        verified,
        corrected,
        flagged,
        percentComplete: ((reviewed / total) * 100).toFixed(1),
        uniqueChargeSlugs: slugSet.size,
        lastUpdated: reviewState.lastUpdated ?? null,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to load progress" });
    }
  });

  // POST /api/admin/citation-review/submit
  // Submit review decisions for one or more entries.
  // Body: { reviews: [{ id, status, correctedCitation?, sourceUrl?, notes? }] }
  app.post("/api/admin/citation-review/submit", adminRateLimiter, requireAdminAuth, (req, res) => {
    try {
      const { reviews: incoming } = req.body as {
        reviews: Array<{
          id: string;
          status: "verified" | "corrected" | "flagged" | "pending";
          correctedCitation?: string;
          sourceUrl?: string;
          notes?: string;
        }>;
      };

      if (!Array.isArray(incoming) || incoming.length === 0) {
        return res.status(400).json({ success: false, error: "reviews array required" });
      }

      const state = loadReviewState();
      if (!state.reviews) state.reviews = {};

      for (const item of incoming) {
        if (!item.id || !item.status) continue;
        if (!["verified", "corrected", "flagged", "pending"].includes(item.status)) continue;
        state.reviews[item.id] = {
          status: item.status,
          reviewedAt: new Date().toISOString(),
          correctedCitation: item.correctedCitation ?? null,
          sourceUrl: item.sourceUrl ?? null,
          notes: item.notes ?? null,
        };
      }

      saveReviewState(state);
      opsLog("citation-review", `Saved ${incoming.length} review(s)`);
      res.json({ success: true, saved: incoming.length });
    } catch (err) {
      errLog("Failed to save citation reviews", err);
      res.status(500).json({ success: false, error: "Failed to save review data" });
    }
  });

  // GET /api/admin/citation-review/slugs
  // Returns all unique charge slugs with per-slug progress, for the sidebar nav.
  app.get("/api/admin/citation-review/slugs", adminRateLimiter, requireAdminAuth, (req, res) => {
    try {
      const { CHARGE_CITATIONS } = require("../shared/criminal-charge-citations.js");
      const reviewState = loadReviewState();
      const reviews = reviewState.reviews as Record<string, any>;

      const slugMap: Record<string, { total: number; reviewed: number; verified: number; flagged: number }> = {};
      for (const id of Object.keys(CHARGE_CITATIONS)) {
        const slug = id.replace(/^[a-z]{2,3}-/, "");
        if (!slugMap[slug]) slugMap[slug] = { total: 0, reviewed: 0, verified: 0, flagged: 0 };
        slugMap[slug].total++;
        const r = reviews[id];
        if (r && r.status !== "pending") {
          slugMap[slug].reviewed++;
          if (r.status === "verified") slugMap[slug].verified++;
          if (r.status === "flagged") slugMap[slug].flagged++;
        }
      }

      const slugs = Object.entries(slugMap)
        .map(([slug, stats]) => ({ slug, ...stats }))
        .sort((a, b) => a.slug.localeCompare(b.slug));

      res.json({ success: true, slugs });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to load slugs" });
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
      
      if (!zip || typeof zip !== 'string' || !/^\d{5}$/.test(zip)) {
        return res.status(400).json({ success: false, error: "Valid 5-digit ZIP code required" });
      }

      const geocodeUrl = `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=us&format=json&limit=1&addressdetails=1`;
      const geocodeResponse = await fetch(geocodeUrl, {
        headers: { 'User-Agent': 'OpenDefender/1.0' }
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

      // Include all public defender types: federal PD, local/county PD, and court-appointed programs
      const [federalOrgs, countyOrgs, courtOrgs] = await Promise.all([
        storage.getLegalAidOrganizations(userState, 'public_defender'),
        storage.getLegalAidOrganizations(userState, 'county_public_defender'),
        storage.getLegalAidOrganizations(userState, 'court_appointed_program'),
      ]);
      const allOrgs = [...federalOrgs, ...countyOrgs, ...courtOrgs];

      const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 3959;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      };

      const orgTypeLabel = (type: string): string => {
        switch (type) {
          case 'county_public_defender': return 'Local Public Defender';
          case 'court_appointed_program': return 'Court-Appointed Program';
          default: return 'Federal Public Defender';
        }
      };

      const results = allOrgs
        .filter(org => org.latitude && org.longitude)
        .map(org => ({
          name: org.name,
          orgType: org.organizationType,
          orgTypeLabel: orgTypeLabel(org.organizationType),
          address: [org.address, org.city, org.state, org.zipCode].filter(Boolean).join(', '),
          phone: org.phone || null,
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
        source: "OpenDefender Legal Aid Database",
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
      
      if (!zip || typeof zip !== 'string' || !/^\d{5}$/.test(zip)) {
        return res.status(400).json({ success: false, error: "Valid 5-digit ZIP code required" });
      }

      const geocodeUrl = `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=us&format=json&limit=1`;
      const geocodeResponse = await fetch(geocodeUrl, {
        headers: { 'User-Agent': 'OpenDefender/1.0' }
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
        headers: { 'User-Agent': 'OpenDefender/1.0' }
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
  app.post("/api/legal-guidance", requireServiceBudget('claude-guidance'), aiRateLimiter, aiDailyLimiter, requireCaptcha, async (req, res) => {
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

      // Generate personalized guidance based on case details.
      // These fields are not DB columns on legal_cases, so Zod strips them from
      // validatedData. Re-inject from req.body so the AI prompt sees the full picture
      // (probation status, priors, immigration, dependents, license, subsidized housing).
      const guidance = await generateLegalGuidance({
        ...validatedData,
        // Normalise blank caseStage (screener export before stage selection) to a safe
        // default so neither the rules engine nor Claude receives an empty string.
        caseStage: validatedData.caseStage || 'arrest',
        // Signal to buildUserPrompt that the stage was not explicitly chosen — lets
        // Claude avoid fabricating stage-specific deadlines.
        caseStageWasBlank: !validatedData.caseStage,
        chargesUnknown: req.body.chargesUnknown === true,
        civilUrgency: req.body.civilUrgency,
        supervisionStatus: req.body.supervisionStatus,
        priorConvictions: req.body.priorConvictions,
        citizenshipStatus: req.body.citizenshipStatus,
        hasMinorChildren: req.body.hasMinorChildren,
        hasProfessionalLicense: req.body.hasProfessionalLicense,
        hasHousingAssistance: req.body.hasHousingAssistance,
      });
      
      // C-1: Strip incidentDescription before storing — raw user narrative may
      // contain PII (names, addresses, witnesses) that must not persist even in
      // session memory after guidance generation is complete.
      const { incidentDescription: _dropped, ...storableData } = validatedData;
      const legalCase = await storage.createLegalCase({
        ...storableData,
        guidance,
        // DB-backed ownership binding: store the express session ID so retrieval
        // can enforce ownership even across server restarts (survives in-memory Map loss).
        expressSessionId: req.sessionID || null,
      });

      // Also maintain the fast in-memory ownership Map for sub-millisecond lookups.
      if (req.sessionID) {
        guidanceSessionOwners.set(sessionId, req.sessionID);
      }

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

  // Streaming Legal Guidance (SSE) — identical middleware, streams tokens as they arrive
  app.post("/api/legal-guidance/stream", requireServiceBudget('claude-guidance'), aiRateLimiter, aiDailyLimiter, requireCaptcha, async (req, res) => {
    // Set SSE headers before writing anything
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const sendEvent = (data: object) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
      const sessionId = req.body.sessionId || randomUUID();

      const transformedData = {
        ...req.body,
        sessionId,
        charges: Array.isArray(req.body.charges)
          ? req.body.charges
          : typeof req.body.charges === 'string'
            ? [req.body.charges]
            : req.body.charges,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      const validatedData = insertLegalCaseSchema.parse(transformedData);
      // Same field-restoration pattern as the non-streaming route above:
      // preserve background answers Zod stripped so the prompt has them.
      const caseDataWithFlags = {
        ...validatedData,
        // Normalise blank caseStage (screener export before stage selection) to a safe
        // default so neither the rules engine nor Claude receives an empty string.
        caseStage: validatedData.caseStage || 'arrest',
        // Signal to buildUserPrompt that the stage was not explicitly chosen — lets
        // Claude avoid fabricating stage-specific deadlines.
        caseStageWasBlank: !validatedData.caseStage,
        chargesUnknown: req.body.chargesUnknown === true,
        civilUrgency: req.body.civilUrgency,
        supervisionStatus: req.body.supervisionStatus,
        priorConvictions: req.body.priorConvictions,
        citizenshipStatus: req.body.citizenshipStatus,
        hasMinorChildren: req.body.hasMinorChildren,
        hasProfessionalLicense: req.body.hasProfessionalLicense,
        hasHousingAssistance: req.body.hasHousingAssistance,
      };

      // Charge lookup (same guard logic as generateLegalGuidance)
      const chargeIds = Array.isArray(caseDataWithFlags.charges) ? caseDataWithFlags.charges : [caseDataWithFlags.charges];
      const chargeClassifications = chargeIds
        .map((id: string) => {
          const charge = getChargeById(id);
          if (!charge) return null;
          const verifiedCode = getVerifiedCitation(charge);
          return {
            id: charge.id,
            name: charge.name,
            classification: charge.category,
            // code carries the verified citation when available (used by AI prompt)
            ...(verifiedCode ? { code: verifiedCode } : {}),
            // verifiedCitation is the dedicated field consumed by the PDF generator
            verifiedCitation: verifiedCode ?? null,
            title: charge.name,
            maxPenalty: charge.maxPenalty,
          };
        })
        .filter(Boolean);

      if (chargeClassifications.length === 0 && chargeIds.length > 0 && chargeIds[0] !== '') {
        sendEvent({ type: 'error', error: 'None of the provided charge IDs were recognized.' });
        return res.end();
      }

      const useAI = !!process.env.ANTHROPIC_API_KEY;
      let guidance: any;

      if (useAI) {
        try {
          guidance = await streamClaudeGuidance(
            caseDataWithFlags as any,
            (text) => sendEvent({ type: 'chunk', text }),
            sessionId
          );
          // Stamp isEstimate on deadlines for unmapped jurisdictions — Claude doesn't
          // set this flag itself, so we apply it here before the guidance is stored or sent.
          if (Array.isArray(guidance.deadlines)) {
            guidance = { ...guidance, deadlines: stampEstimateDeadlines(caseDataWithFlags.jurisdiction, guidance.deadlines) };
          }
          guidance = { ...guidance, chargeClassifications: chargeClassifications.length > 0 ? chargeClassifications : undefined, generatedBy: 'claude-ai' };
          opsLog('ai', `Stream tokens: ${guidance.usageMetrics?.inputTokens}+${guidance.usageMetrics?.outputTokens}, Cost: $${guidance.usageMetrics?.estimatedCost?.toFixed(4)}`);
        } catch (aiError) {
          errLog('Claude stream failed, falling back to rule-based', aiError);
          // Fall back to rule-based (no streaming chunks for this path)
          guidance = generateEnhancedGuidance(caseDataWithFlags as any);
          guidance = { ...guidance, chargeClassifications: chargeClassifications.length > 0 ? chargeClassifications : undefined, generatedBy: 'rule-based' };
        }
      } else {
        guidance = generateEnhancedGuidance(caseDataWithFlags as any);
        guidance = { ...guidance, chargeClassifications: chargeClassifications.length > 0 ? chargeClassifications : undefined, generatedBy: 'rule-based' };
      }

      // C-1: Strip incidentDescription before storing (same fix as non-stream route)
      const { incidentDescription: _droppedStream, ...storableStreamData } = validatedData;
      const legalCase = await storage.createLegalCase({
        ...storableStreamData,
        guidance,
        // DB-backed ownership binding (same pattern as non-stream route).
        expressSessionId: req.sessionID || null,
      });

      // Also maintain the fast in-memory ownership Map for sub-millisecond lookups.
      if (req.sessionID) {
        guidanceSessionOwners.set(sessionId, req.sessionID);
      }

      const guidanceWithTimestamp = {
        ...(typeof legalCase.guidance === 'object' ? legalCase.guidance : {}),
        generatedAt: new Date().toISOString(),
      };

      sendEvent({ type: 'complete', success: true, sessionId, guidance: guidanceWithTimestamp });
      res.end();
    } catch (error) {
      errLog('Failed to stream legal guidance', error);
      sendEvent({ type: 'error', error: 'Failed to generate guidance. Please try again.' });
      res.end();
    }
  });

  // Rules-Based Legal Guidance — no AI, no streaming, no Claude call
  // Uses the same guidance-engine.ts rules engine that backs the AI fallback path.
  // Applies the same schema validation and charge-lookup pipeline as the stream endpoint
  // so the response shape is equivalent and the dashboard renders identically.
  // No CAPTCHA required (no AI service involved); standard rate limits apply.
  app.post("/api/legal-guidance/rules", searchRateLimiter, async (req, res) => {
    try {
      const sessionId = req.body.sessionId || randomUUID();

      // Mirror the same normalization + schema validation used by existing guidance routes.
      const transformedData = {
        ...req.body,
        sessionId,
        charges: Array.isArray(req.body.charges)
          ? req.body.charges
          : typeof req.body.charges === 'string'
            ? [req.body.charges]
            : req.body.charges,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      const validatedData = insertLegalCaseSchema.parse(transformedData);

      // Re-inject fields Zod strips (not DB columns) so the engine has the
      // full picture, matching the pattern in the stream route above.
      const caseDataWithFlags = {
        ...validatedData,
        // Normalise blank caseStage (screener export before stage selection) to a safe
        // default so neither the rules engine nor Claude receives an empty string.
        caseStage: validatedData.caseStage || 'arrest',
        // Signal to buildUserPrompt that the stage was not explicitly chosen — lets
        // Claude avoid fabricating stage-specific deadlines.
        caseStageWasBlank: !validatedData.caseStage,
        chargesUnknown: req.body.chargesUnknown === true,
        civilUrgency: req.body.civilUrgency,
        supervisionStatus: req.body.supervisionStatus,
        priorConvictions: req.body.priorConvictions,
        citizenshipStatus: req.body.citizenshipStatus,
        hasMinorChildren: req.body.hasMinorChildren,
        hasProfessionalLicense: req.body.hasProfessionalLicense,
        hasHousingAssistance: req.body.hasHousingAssistance,
      };

      // Charge classification — same guard logic as the stream route.
      const chargeIds = Array.isArray(caseDataWithFlags.charges)
        ? caseDataWithFlags.charges
        : [caseDataWithFlags.charges];

      const chargeClassifications = chargeIds
        .map((id: string) => {
          const charge = getChargeById(id);
          if (!charge) return null;
          const verifiedCode = getVerifiedCitation(charge);
          return {
            id: charge.id,
            name: charge.name,
            classification: charge.category,
            // code carries the verified citation when available (used by AI prompt)
            ...(verifiedCode ? { code: verifiedCode } : {}),
            // verifiedCitation is the dedicated field consumed by the PDF generator
            verifiedCitation: verifiedCode ?? null,
            title: charge.name,
            maxPenalty: charge.maxPenalty,
          };
        })
        .filter(Boolean);

      if (chargeClassifications.length === 0 && chargeIds.length > 0 && chargeIds[0] !== '') {
        return res.status(400).json({ success: false, error: 'None of the provided charge IDs were recognized.' });
      }

      // Apply PII redaction before running the rules engine — the engine output
      // may echo back free-text fields (incidentDescription, policeStatement, etc.)
      // that the user entered, so we scrub them first as a privacy safeguard.
      const { redactedDetails } = redactCaseDetails(caseDataWithFlags as any);
      const rawGuidance = generateEnhancedGuidance(redactedDetails as any);

      const guidance = {
        ...rawGuidance,
        chargeClassifications: chargeClassifications.length > 0 ? chargeClassifications : undefined,
        generatedBy: 'rule-based' as const,
        generatedAt: new Date().toISOString(),
      };

      res.json({
        success: true,
        sessionId,
        guidance,
      });
    } catch (error) {
      errLog('Failed to generate rules-based guidance', error);
      res.status(500).json({ success: false, error: 'Failed to generate guidance' });
    }
  });

  // Get Legal Guidance by Session
  // Ownership check: compare the requesting session against the one recorded at creation.
  // Returns 403 (not 404) on mismatch to avoid confirming session existence.
  // Falls through for cases not in the Map (pre-restart survivability); those cases
  // remain protected by UUID entropy + rate limiting (see docs/security-controls.md).
  app.get("/api/legal-guidance/:sessionId", searchRateLimiter, async (req, res) => {
    try {
      const { sessionId } = req.params;

      // Tier-1: fast in-memory ownership check (populated at creation time).
      // If express-session middleware is absent, req.sessionID is undefined and
      // the check is skipped entirely (fail-safe fallback to UUID-as-token security).
      const recordedOwner = guidanceSessionOwners.get(sessionId);
      if (recordedOwner && req.sessionID && req.sessionID !== recordedOwner) {
        opsLog('security', `Guidance session ownership mismatch (in-memory): ${sessionId.slice(0, 8)}…`);
        return res.status(403).json({ success: false, code: 'SESSION_EXPIRED', error: 'Your session has expired.' });
      }

      const legalCase = await storage.getLegalCase(sessionId);
      
      if (!legalCase) {
        return res.status(404).json({ success: false, error: "Session not found or expired" });
      }

      // Tier-2: DB-backed ownership check — catches cases created before this server
      // process started (in-memory Map entry would be absent after a restart).
      // Only enforced when both the stored column and the current session ID are present.
      if (legalCase.expressSessionId && req.sessionID && req.sessionID !== legalCase.expressSessionId) {
        opsLog('security', `Guidance session ownership mismatch (DB): ${sessionId.slice(0, 8)}…`);
        return res.status(403).json({ success: false, code: 'SESSION_EXPIRED', error: 'Your session has expired.' });
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
      
      // Check for duplicate feedback (one vote per session per case) — O(1) index lookup
      const alreadyVoted = (storage as any).hasSessionVotedOnCase?.(sessionId, caseId)
        ?? (await storage.getCaseFeedbackBySession(sessionId)).some(f => f.caseId === caseId);
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
  const privacyConsentSchema = z.object({
    sessionId: z.string().min(10).max(100),
    consentType: z.string().min(1).max(50),
    consentVersion: z.string().min(1).max(20),
    granted: z.boolean(),
  });

  app.post("/api/privacy-consent", writeRateLimiter, async (req, res) => {
    try {
      const parsed = privacyConsentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request: " + parsed.error.issues.map(i => i.message).join(", ")
        });
      }
      const { sessionId, consentType, consentVersion, granted } = parsed.data;
      
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
      errLog("Failed to clear session:", error);
      res.status(500).json({ success: false, error: "Failed to clear session" });
    }
  });

  // Claude AI Health Check — cached 5 minutes to prevent repeated live Claude calls
  const HEALTH_CACHE_TTL_MS = 5 * 60 * 1000;
  let healthCache: { available: boolean; checkedAt: number } | null = null;

  app.get("/api/ai/health", searchRateLimiter, async (req, res) => {
    try {
      const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
      if (!hasApiKey) {
        return res.json({
          success: true,
          available: false,
          reason: "API key not configured"
        });
      }

      // Return cached result if still fresh
      if (healthCache && Date.now() - healthCache.checkedAt < HEALTH_CACHE_TTL_MS) {
        return res.json({
          success: true,
          available: healthCache.available,
          model: CLAUDE_MODEL_SONNET_DISPLAY_NAME,
          features: ["personalized-guidance", "natural-language-processing"],
          cached: true,
        });
      }

      const isConnected = await testClaudeConnection();
      healthCache = { available: isConnected, checkedAt: Date.now() };

      res.json({
        success: true,
        available: isConnected,
        model: CLAUDE_MODEL_SONNET_DISPLAY_NAME,
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
        startYear ? parseInt(startYear as string, 10) : undefined,
        endYear ? parseInt(endYear as string, 10) : undefined
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
      const currentYear = new Date().getFullYear();
      const yearArray = years
        ? (years as string).split(',').map(y => {
            const yr = parseInt(y.trim(), 10);
            if (isNaN(yr) || yr < 1900 || yr > currentYear) {
              throw new Error(`Invalid year: ${y}`);
            }
            return yr;
          })
        : [currentYear - 5, currentYear - 1];
      
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
      const rawCitation = decodeURIComponent(req.params.citation);
      // Accept only characters found in valid legal citations; reject anything else.
      if (!/^[A-Za-z0-9\s§.()\-:,/]+$/.test(rawCitation) || rawCitation.length > 120) {
        return res.status(400).json({ success: false, error: "Invalid citation format" });
      }
      const citation = rawCitation;
      const statute = await openLawsClient.searchByCitation(citation);
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
  app.post("/api/attorney/session/cleanup", writeRateLimiter, async (req, res) => {
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
  app.delete("/api/attorney/session", writeRateLimiter, async (req, res) => {
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

  app.post("/api/attorney/documents/generate", requireAttorneySession, requireServiceBudget('attorney-docs'), aiRateLimiter, aiDailyLimiter, requireCaptcha, async (req, res) => {
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
  // Attorney Playbooks API (Read-only, no AI generation)
  // ============================================================================

  // List playbooks (optionally filtered by category)
  app.get("/api/attorney/playbooks", requireAttorneySession, (req, res) => {
    try {
      const { category } = req.query;
      const playbooks = getPlaybooks(category as string | undefined);
      res.json({ success: true, playbooks });
    } catch (error) {
      errLog("Failed to fetch playbooks", error);
      res.status(500).json({ success: false, error: "Failed to fetch playbooks" });
    }
  });

  // Get single playbook by ID
  app.get("/api/attorney/playbooks/:playbookId", requireAttorneySession, (req, res) => {
    try {
      const playbook = getPlaybook(req.params.playbookId);
      if (!playbook) {
        return res.status(404).json({ success: false, error: "Playbook not found" });
      }
      res.json({ success: true, playbook });
    } catch (error) {
      errLog("Failed to fetch playbook", error);
      res.status(500).json({ success: false, error: "Failed to fetch playbook" });
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

  // Multi-file upload for batch summarization (max 10 documents, 10MB each)
  const batchDocumentUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB per file
      files: 10,                   // max 10 documents per batch
    },
    fileFilter: (req, file, cb) => {
      const error = validateFile(file.mimetype, 0);
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
   * Generate a personalized letter using Claude AI (non-legal life support tool).
   * Takes a letter type + situation answers, returns a drafted letter with placeholders.
   * No personal data is collected — placeholders ([YOUR NAME], etc.) are filled by the user.
   */
  app.post(
    '/api/generate-letter',
    requireServiceBudget('letter-generator'),
    aiRateLimiter,
    aiDailyLimiter,
    requireCaptcha,  // H-4: prevent automated abuse of this AI endpoint
    async (req: Request, res: Response) => {
      try {
        const bodySchema = z.object({
          letterType: z.enum([
            'employer-court-dates',
            'employer-explain-absence',
            'employer-record-disclosure',
            'landlord-payment-plan',
            'landlord-situation-notice',
            'utility-hardship',
          ]),
          answers: z.record(z.string().max(500)).refine(
            (obj) => Object.keys(obj).length <= 8,
            'Too many answer fields'
          ),
          language: z.enum(['en', 'es', 'zh']).default('en'),
        });

        const parseResult = bodySchema.safeParse(req.body);
        if (!parseResult.success) {
          return res.status(400).json({
            success: false,
            error: 'Invalid request: ' + parseResult.error.issues.map((i) => i.message).join(', '),
          });
        }

        // H-4: Redact any PII a user may have entered in answer fields before
        // they reach Claude. The letter generator uses placeholders, but users
        // sometimes fill in real names/addresses in the context fields.
        const sanitizedAnswers = Object.fromEntries(
          Object.entries(parseResult.data.answers).map(([k, v]) => [k, redactDocumentPII(v)])
        );

        const { generateLetter } = await import('./services/letter-generator.js');
        const result = await generateLetter({ ...parseResult.data, answers: sanitizedAnswers });

        return res.json({ success: true, ...result });
      } catch (err) {
        errLog('Letter generator failed', err);
        return res.status(500).json({ success: false, error: 'Failed to generate letter. Please try again.' });
      }
    }
  );

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
  app.post("/api/document-summary/summarize", requireServiceBudget('document-summarizer'), aiRateLimiter, aiDailyLimiter, (req, res, next) => {
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

      const language = (req.body.language as 'en' | 'es' | 'zh') || 'en';
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
  app.post("/api/attorney/document-summary/summarize", requireAttorneySession, requireServiceBudget('document-summarizer'), aiRateLimiter, aiDailyLimiter, (req, res, next) => {
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

      const language = (req.body.language as 'en' | 'es' | 'zh') || 'en';
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

  // ============================================================================
  // Batch Document Summarization API
  // Asynchronous multi-document summarization at ~50% cost via Anthropic Batch API.
  // Submit → receive batchId → poll for status → retrieve results when ended.
  // ============================================================================

  /**
   * Submit a batch of documents for asynchronous summarization (public).
   * Accepts up to 10 files via multipart/form-data field "documents".
   */
  app.post("/api/document-summary/batch",
    requireServiceBudget('document-summarizer'),
    batchSubmitRateLimiter,
    requireCaptcha,
    (req, res, next) => {
      batchDocumentUpload.array('documents')(req, res, (err) => {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, error: 'One or more files exceed the 10MB limit.' });
        }
        if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ success: false, error: 'Maximum 10 documents per batch.' });
        }
        if (err) {
          return res.status(400).json({ success: false, error: err.message || 'Invalid file upload.' });
        }
        next();
      });
    },
    async (req: Request, res: Response) => {
      try {
        const files = req.files as Express.Multer.File[] | undefined;
        if (!files || files.length === 0) {
          return res.status(400).json({ success: false, error: 'No documents provided.' });
        }

        const consentGiven = req.body.consentGiven === 'true' || req.body.consentGiven === true;
        if (!consentGiven) {
          (req as any).files = null;
          return res.status(400).json({ success: false, error: 'Consent required before processing documents.' });
        }

        const language = (req.body.language as 'en' | 'es') || 'en';
        const summaryType = req.body.summaryType || 'general';

        const documents = files.map((f) => ({
          file: f.buffer,
          mimeType: f.mimetype,
          filename: f.originalname,
          language,
          summaryType,
        }));

        const result = await createSummaryBatch(documents);
        (req as any).files = null;

        res.json({
          success: true,
          ...result,
          message: 'Batch submitted. Poll /api/document-summary/batch/:batchId for status and results.',
          privacyConfirmation: {
            documentsStored: false,
            message: 'Your documents have not been stored. Only anonymized batch metadata is retained temporarily.',
          },
        });
      } catch (error) {
        (req as any).files = null;
        errLog('[BatchSummary] Submission error:', error);
        const message = error instanceof Error ? error.message : 'Failed to submit batch.';
        res.status(500).json({ success: false, error: message });
      }
    }
  );

  /**
   * Poll for batch status and retrieve results when complete (public).
   * Ownership note: batchId is generated by the Anthropic Batches API (opaque UUID).
   * No user-derived content is stored here — the endpoint only proxies Anthropic
   * batch status. Session-ownership binding is not required; rate limiting is sufficient.
   */
  app.get("/api/document-summary/batch/:batchId",
    searchRateLimiter,
    async (req: Request, res: Response) => {
      try {
        const { batchId } = req.params;
        if (!batchId || typeof batchId !== 'string') {
          return res.status(400).json({ success: false, error: 'Invalid batch ID.' });
        }

        const status = await getSummaryBatchStatus(batchId);
        res.json({ success: true, ...status });
      } catch (error) {
        errLog('[BatchSummary] Status error:', error);
        const message = error instanceof Error ? error.message : 'Failed to retrieve batch status.';
        res.status(500).json({ success: false, error: message });
      }
    }
  );

  /**
   * Submit a batch of documents for asynchronous summarization (attorney).
   */
  app.post("/api/attorney/document-summary/batch",
    requireAttorneySession,
    requireServiceBudget('document-summarizer'),
    batchSubmitRateLimiter,
    requireCaptcha,
    (req, res, next) => {
      batchDocumentUpload.array('documents')(req, res, (err) => {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, error: 'One or more files exceed the 10MB limit.' });
        }
        if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ success: false, error: 'Maximum 10 documents per batch.' });
        }
        if (err) {
          return res.status(400).json({ success: false, error: err.message || 'Invalid file upload.' });
        }
        next();
      });
    },
    async (req: Request, res: Response) => {
      try {
        const files = req.files as Express.Multer.File[] | undefined;
        if (!files || files.length === 0) {
          return res.status(400).json({ success: false, error: 'No documents provided.' });
        }

        const language = (req.body.language as 'en' | 'es') || 'en';
        const summaryType = req.body.summaryType || 'legal_document';

        const documents = files.map((f) => ({
          file: f.buffer,
          mimeType: f.mimetype,
          filename: f.originalname,
          language,
          summaryType,
        }));

        const result = await createSummaryBatch(documents);
        (req as any).files = null;

        res.json({
          success: true,
          ...result,
          message: 'Batch submitted. Poll /api/attorney/document-summary/batch/:batchId for status and results.',
        });
      } catch (error) {
        (req as any).files = null;
        errLog('[AttorneyBatchSummary] Submission error:', error);
        const message = error instanceof Error ? error.message : 'Failed to submit batch.';
        res.status(500).json({ success: false, error: message });
      }
    }
  );

  /**
   * Poll for batch status and retrieve results when complete (attorney).
   */
  app.get("/api/attorney/document-summary/batch/:batchId",
    requireAttorneySession,
    searchRateLimiter,
    async (req: Request, res: Response) => {
      try {
        const { batchId } = req.params;
        if (!batchId || typeof batchId !== 'string') {
          return res.status(400).json({ success: false, error: 'Invalid batch ID.' });
        }

        const status = await getSummaryBatchStatus(batchId);
        res.json({ success: true, ...status });
      } catch (error) {
        errLog('[AttorneyBatchSummary] Status error:', error);
        const message = error instanceof Error ? error.message : 'Failed to retrieve batch status.';
        res.status(500).json({ success: false, error: message });
      }
    }
  );

  // ============================================================================
  // DOCUMENT Q&A — Conversational follow-up on summarized documents
  // ============================================================================

  /**
   * Document Q&A endpoint.
   * The client holds the PII-redacted extracted text in session state and sends
   * it back with each question. Nothing is stored server-side.
   *
   * Abuse protections:
   * - requireServiceBudget: daily dollar cap (same pool as summarizer)
   * - aiRateLimiter: 10 req / 15 min per IP (shared with other AI endpoints)
   * - aiDailyLimiter: 20 AI requests / day per IP (shared budget)
   * - docChatRateLimiter: 30 chat messages / 15 min per IP (chat-specific)
   * - Hard limits on question length (600 chars) and history turns (8 pairs)
   * - extractedText server-side cap at 80k chars regardless of what client sends
   * - Input sanitized via z.string().max() + server-side trim
   */
  app.post(
    '/api/document-summary/chat',
    requireServiceBudget('document-summarizer'),
    aiRateLimiter,
    aiDailyLimiter,
    docChatRateLimiter,
    requireCaptcha,  // H-3: prevent automated abuse of this general-purpose AI text endpoint
    async (req: Request, res: Response) => {
      try {
        const bodySchema = z.object({
          question: z.string().min(1).max(600),
          extractedText: z.string().min(50).max(85_000),
          conversationHistory: z.array(
            z.object({
              role: z.enum(['user', 'assistant']),
              content: z.string().max(4000),
            })
          ).max(16),
          documentType: z.string().max(50).default('general'),
          language: z.enum(['en', 'es', 'zh']).default('en'),
        });

        const parseResult = bodySchema.safeParse(req.body);
        if (!parseResult.success) {
          return res.status(400).json({
            success: false,
            error: 'Invalid request: ' + parseResult.error.issues.map(i => i.message).join(', '),
          });
        }

        const { question, extractedText: rawExtractedText, conversationHistory, documentType, language } = parseResult.data;

        // H-3: Re-redact client-supplied extractedText before passing to AI.
        // The client may not have sent back what the server returned — re-redacting
        // server-side ensures PII cannot reach Claude via a crafted request.
        const extractedText = redactDocumentPII(rawExtractedText);

        const { answerDocumentQuestion } = await import('./services/document-summarizer');

        const result = await answerDocumentQuestion({
          extractedText,
          question,
          conversationHistory,
          documentType,
          language,
        });

        res.json({ success: true, ...result });
      } catch (error) {
        errLog('[DocumentQA] Error:', error);
        const message = error instanceof Error ? error.message : 'Failed to answer question';
        res.status(500).json({ success: false, error: message });
      }
    }
  );

  // ============================================================================
  // GUIDANCE FLAGS — Anonymous quality feedback (zero PII stored)
  // ============================================================================

  app.post("/api/guidance/flag", flagRateLimiter, async (req: Request, res: Response) => {
    try {
      const schema = insertGuidanceFlagSchema.extend({
        flagReason: z.enum(['inaccurate', 'unclear', 'missing_info', 'other']),
        confidenceBucket: z.enum(['high', 'medium', 'low']).optional(),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, error: 'Invalid flag data.' });
      }

      // Hash session ID if provided — never store raw session IDs
      let sessionIdHash: string | undefined;
      if (parsed.data.sessionIdHash) {
        const { createHash } = await import('crypto');
        sessionIdHash = createHash('sha256').update(parsed.data.sessionIdHash).digest('hex');
      }

      const flag = await storage.createGuidanceFlag({
        ...parsed.data,
        sessionIdHash,
      });

      opsLog('guidance-flag', `Flag submitted: ${parsed.data.flagReason} | ${parsed.data.jurisdiction ?? 'unknown'} | confidence: ${parsed.data.confidenceBucket ?? 'unknown'}`);
      res.json({ success: true, id: flag.id });
    } catch (error) {
      errLog('[GuidanceFlag] Error storing flag:', error);
      res.status(500).json({ success: false, error: 'Failed to record flag.' });
    }
  });

  // Sink for client-side render errors caught by ErrorBoundary.
  // Fire-and-forget: always returns 204 so a slow/failing sink never blocks the boundary UI.
  // Truncates long fields before logging; does not persist to DB.
  app.post("/api/client-error", clientErrorRateLimiter, async (req: Request, res: Response) => {
    try {
      const body = req.body ?? {};
      const truncate = (s: unknown, max: number): string =>
        typeof s === 'string' ? s.slice(0, max) : '';
      const payload = {
        message: truncate(body.message, 500),
        stack: truncate(body.stack, 2000),
        componentStack: truncate(body.componentStack, 2000),
        url: truncate(body.url, 500),
        userAgent: truncate(body.userAgent, 200),
      };
      errLog('[ClientError] render crash', payload);
    } catch (error) {
      // Never fail on the reporting path — the client is already in an error state.
      errLog('[ClientError] reporting handler threw', error);
    }
    res.status(204).end();
  });

  // Admin-only: view flag data. Protected by requireAdminAuth middleware.
  app.get("/api/admin/guidance-flags", requireAdminAuth, adminRateLimiter, async (req: Request, res: Response) => {
    try {
      const [flags, summary] = await Promise.all([
        storage.getGuidanceFlags(200),
        storage.getGuidanceFlagSummary(),
      ]);
      res.json({ success: true, summary, flags });
    } catch (error) {
      errLog('[Admin] Error fetching flags:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve flags.' });
    }
  });

  // Admin-only: run a demographic equity audit. Protected by requireAdminAuth middleware.
  // Runs two paired case scenarios through the AI and returns outputs + metrics for human review.
  // Rate-limited to 2 requests per hour to control AI cost.
  app.post("/api/admin/equity-audit", requireAdminAuth, adminRateLimiter, equityAuditLimiter, async (req: Request, res: Response) => {
    const { scenarioPairId } = req.body || {};
    if (!scenarioPairId || typeof scenarioPairId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing scenarioPairId. Available: pair-1 through pair-5.',
      });
    }

    const { EQUITY_TEST_SCENARIOS, extractEquityMetrics } = await import('./services/equity-test-scenarios.js');
    const pair = EQUITY_TEST_SCENARIOS.find(p => p.id === scenarioPairId);
    if (!pair) {
      return res.status(404).json({
        success: false,
        error: `Scenario pair "${scenarioPairId}" not found. Available: ${EQUITY_TEST_SCENARIOS.map(p => p.id).join(', ')}.`,
      });
    }

    try {
      opsLog('equity-audit', `Running equity audit for scenario: ${pair.id} — ${pair.label}`);

      const [resultA, resultB] = await Promise.all([
        generateClaudeGuidance(pair.scenarioA.caseDetails as any),
        generateClaudeGuidance(pair.scenarioB.caseDetails as any),
      ]);

      const metricsA = extractEquityMetrics(resultA);
      const metricsB = extractEquityMetrics(resultB);

      const disparity = {
        immediateActionsDiff: metricsA.immediateActionsCount - metricsB.immediateActionsCount,
        rightsDiff: metricsA.rightsCount - metricsB.rightsCount,
        deadlinesDiff: metricsA.deadlinesCount - metricsB.deadlinesCount,
        warningsDiff: metricsA.warningsCount - metricsB.warningsCount,
        overviewLengthDiff: metricsA.overviewLength - metricsB.overviewLength,
        bothHaveAttorneyRecommendation: metricsA.hasAttorneyRecommendation && metricsB.hasAttorneyRecommendation,
        flag: Math.abs(metricsA.immediateActionsCount - metricsB.immediateActionsCount) > 2 ||
              Math.abs(metricsA.rightsCount - metricsB.rightsCount) > 2 ||
              Math.abs(metricsA.deadlinesCount - metricsB.deadlinesCount) > 2 ||
              (!metricsA.hasAttorneyRecommendation || !metricsB.hasAttorneyRecommendation),
      };

      res.json({
        success: true,
        pair: {
          id: pair.id,
          label: pair.label,
          demographicVariable: pair.demographicVariable,
          description: pair.description,
        },
        scenarioA: {
          label: pair.scenarioA.label,
          inputs: pair.scenarioA.caseDetails,
          metrics: metricsA,
          guidance: resultA,
        },
        scenarioB: {
          label: pair.scenarioB.label,
          inputs: pair.scenarioB.caseDetails,
          metrics: metricsB,
          guidance: resultB,
        },
        disparity,
        reviewNote: disparity.flag
          ? 'FLAG: Significant metric disparity detected. Human review required before next deployment.'
          : 'Metrics within acceptable range. Review outputs qualitatively for tone and completeness.',
      });
    } catch (error) {
      errLog('[equity-audit] Error running equity audit:', error);
      res.status(500).json({ success: false, error: 'Failed to run equity audit. Check server logs.' });
    }
  });

  // ============================================================================
  // Mitigation Builder — AI Narrative Polish
  // POST /api/mitigation/polish
  //
  // Passes advocate-entered fields to Claude and returns court-ready prose.
  // GUARDRAILS:
  //  • System prompt forbids adding any detail not present in the inputs.
  //  • Empty fields are filtered before the Claude call — never inferred.
  //  • No data is logged, cached, or stored after the response is returned.
  //  • Rate-limited to protect API cost.
  // ============================================================================
  app.post(
    "/api/mitigation/polish",
    requireServiceBudget("claude-guidance"),
    aiRateLimiter,
    aiDailyLimiter,
    async (req, res) => {
      try {
        const rawBody = req.body ?? {};

        // Reject requests that contain keys outside the allowed schema.
        // This closes the prompt-injection vector where unknown keys could
        // carry extra narrative content into the Claude call.
        const unknownKeys = Object.keys(rawBody).filter(
          (k) => !(MITIGATION_FIELD_WHITELIST as readonly string[]).includes(k)
        );
        if (unknownKeys.length > 0) {
          return res.status(400).json({
            success: false,
            error: `Unknown field(s): ${unknownKeys.join(", ")}. Only mitigation form fields are accepted.`,
          });
        }

        // Validate: each present field must be a string within the length cap.
        for (const key of MITIGATION_FIELD_WHITELIST) {
          if (key in rawBody && typeof rawBody[key] !== "string") {
            return res.status(400).json({ success: false, error: `Field '${key}' must be a string.` });
          }
          // Hard cap per field to prevent prompt injection via very large inputs
          if (typeof rawBody[key] === "string" && (rawBody[key] as string).length > 2000) {
            return res.status(400).json({ success: false, error: `Field '${key}' exceeds maximum length.` });
          }
        }

        // Build a clean, whitelist-only object — never pass rawBody directly.
        const fields: Record<string, string> = {};
        for (const key of MITIGATION_FIELD_WHITELIST) {
          if (typeof rawBody[key] === "string") {
            fields[key] = rawBody[key] as string;
          }
        }

        const result = await polishMitigationNarrative(fields);
        if (!result.success) {
          return res.status(422).json(result);
        }

        // No data stored or logged — respond and discard
        return res.json(result);
      } catch (error) {
        errLog("mitigation/polish: unexpected error", error);
        return res.status(500).json({ success: false, error: "An unexpected error occurred." });
      }
    }
  );

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
      const verifiedCode = getVerifiedCitation(charge);
      return {
        name: charge.name,
        classification: charge.category,
        // code carries the verified citation when available (used by AI prompt)
        ...(verifiedCode ? { code: verifiedCode } : {}),
        // verifiedCitation is the dedicated field consumed by the PDF generator
        verifiedCitation: verifiedCode ?? null,
        title: charge.name,
        maxPenalty: charge.maxPenalty,
      };
    })
    .filter(Boolean);
  
  // Log if we couldn't find all charges
  if (chargeClassifications.length !== chargeIds.length) {
    opsLog('guidance', `Warning: Could not find all charges. Found ${chargeClassifications.length} of ${chargeIds.length}`);
  }

  // Guard: if every charge ID was unrecognized, abort rather than generating
  // context-free guidance that could mislead the user.
  if (chargeClassifications.length === 0 && chargeIds.length > 0) {
    throw new Error(`None of the provided charge IDs were recognized: ${chargeIds.join(', ')}`);
  }

  // Try Claude AI first if API key is available
  const useAI = !!process.env.ANTHROPIC_API_KEY;

  if (useAI && (caseData.incidentDescription || (caseData.selectedConcerns && caseData.selectedConcerns.length > 0))) {
    try {
      devLog('guidance', 'Generating AI-powered guidance with Claude...');
      // Pass sessionId so the guidance cache supports precise per-session invalidation
      const claudeGuidance = await generateClaudeGuidance(caseData, caseData.sessionId);
      
      // Log usage metrics (safe aggregates only)
      opsLog('ai', `Tokens: ${claudeGuidance.usageMetrics.inputTokens}+${claudeGuidance.usageMetrics.outputTokens}, Cost: $${claudeGuidance.usageMetrics.estimatedCost.toFixed(4)}`);
      
      // Stamp isEstimate on deadlines for unmapped jurisdictions — Claude doesn't
      // set this flag itself, so we apply it here before the guidance is returned.
      const stampedDeadlines = Array.isArray(claudeGuidance.deadlines)
        ? stampEstimateDeadlines(caseData.jurisdiction, claudeGuidance.deadlines)
        : claudeGuidance.deadlines;
      return {
        ...claudeGuidance,
        deadlines: stampedDeadlines,
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
