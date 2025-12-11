import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { courtListenerService } from "./services/courtlistener";
import { legalDataService } from "./services/legal-data";
import { recapService } from "./services/recap";
import { bjsStatisticsService } from "./services/bjs-statistics";
import { insertLegalCaseSchema, insertCaseFeedbackSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import { generateEnhancedGuidance } from "./services/guidance-engine.js";
import { generateClaudeGuidance, testClaudeConnection } from "./services/claude-guidance.js";
import { getChargeById, getChargesByJurisdiction, criminalCharges } from "../shared/criminal-charges.js";
import { validateLegalGuidance } from "./services/legal-accuracy-validator";
import { scrapingCoordinator } from "./services/scraping-coordinator";
import { auditRobotsTxt, printAuditSummary } from "./services/robots-audit";
import { statuteSeeder } from "./services/statute-seeder";
import { openLawsClient } from "./services/openlaws-client";
import rateLimit from "express-rate-limit";

export async function registerRoutes(app: Express): Promise<Server> {
  // Rate limiter for AI-powered endpoints (expensive operations)
  const aiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per 15 minutes
    message: {
      success: false,
      error: 'Too many guidance requests from this IP. Please try again in 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip rate limiting in development mode entirely
    skip: (req) => process.env.NODE_ENV === 'development',
    // Use a safer key generator that doesn't rely solely on IP
    validate: {
      trustProxy: false, // Disable trust proxy validation to avoid errors
      xForwardedForHeader: false
    }
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
      console.error("Failed to fetch legal resources:", error);
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
      console.error("Failed to fetch legal aid organizations:", error);
      res.status(500).json({ success: false, error: "Failed to fetch legal aid organizations" });
    }
  });

  // Criminal Charges API - Get charges by jurisdiction
  app.get("/api/criminal-charges", async (req, res) => {
    try {
      const { jurisdiction, search, category, limit } = req.query;
      
      let charges = jurisdiction 
        ? getChargesByJurisdiction(jurisdiction as string)
        : criminalCharges;
      
      // Filter by search term
      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        charges = charges.filter(charge => 
          charge.name.toLowerCase().includes(searchLower) ||
          charge.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by category (felony, misdemeanor, infraction)
      if (category && typeof category === 'string') {
        charges = charges.filter(charge => charge.category === category);
      }
      
      // Limit results
      const maxResults = Math.min(parseInt(limit as string) || 100, 500);
      charges = charges.slice(0, maxResults);
      
      // Return simplified charge data for the selector
      const simplifiedCharges = charges.map(charge => ({
        id: charge.id,
        code: charge.code,
        name: charge.name,
        category: charge.category,
        description: charge.description,
        maxPenalty: charge.maxPenalty,
      }));
      
      res.json({ 
        success: true, 
        charges: simplifiedCharges,
        count: simplifiedCharges.length,
        totalAvailable: jurisdiction 
          ? getChargesByJurisdiction(jurisdiction as string).length 
          : criminalCharges.length
      });
    } catch (error) {
      console.error("Failed to fetch criminal charges:", error);
      res.status(500).json({ success: false, error: "Failed to fetch criminal charges" });
    }
  });

  // Legal Aid Organizations Proximity Search API - Find organizations near a ZIP code
  app.get("/api/legal-aid-organizations/proximity", async (req, res) => {
    try {
      const { zipCode, radius = "50", organizationType } = req.query;
      
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

      // Calculate distances for all organizations
      const allOrgsWithDistance = allOrgs
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
      console.error("Failed to fetch organizations by proximity:", error);
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
      console.error("Failed to fetch court data:", error);
      res.status(500).json({ success: false, error: "Failed to fetch court data" });
    }
  });

  // Case Law Search API - supports both keyword and semantic search
  app.get("/api/case-law/search", async (req, res) => {
    try {
      const { q: query, jurisdiction, search_type } = req.query;
      
      if (!query) {
        return res.status(400).json({ success: false, error: "Query parameter required" });
      }

      const searchType = (search_type as string) === 'semantic' ? 'semantic' : 'keyword';
      
      const results = await legalDataService.searchCaseLaw(
        query as string,
        jurisdiction as string,
        searchType
      );
      
      res.json(results);
    } catch (error) {
      console.error("Case law search failed:", error);
      res.status(500).json({ success: false, error: "Search failed" });
    }
  });

  // Semantic Search API - natural language case law search
  app.get("/api/case-law/semantic-search", async (req, res) => {
    try {
      const { q: query, jurisdiction, keyword_filter } = req.query;
      
      if (!query) {
        return res.status(400).json({ success: false, error: "Query parameter required" });
      }

      const results = await legalDataService.semanticSearchCaseLaw(
        query as string,
        jurisdiction as string,
        keyword_filter as string
      );
      
      res.json(results);
    } catch (error) {
      console.error("Semantic search failed:", error);
      res.status(500).json({ success: false, error: "Semantic search failed" });
    }
  });

  // Hybrid Search API - combines keywords with natural language
  app.get("/api/case-law/hybrid-search", async (req, res) => {
    try {
      const { natural_language, keywords, jurisdiction } = req.query;
      
      if (!natural_language || !keywords) {
        return res.status(400).json({ 
          success: false, 
          error: "Both natural_language and keywords parameters required" 
        });
      }

      const results = await legalDataService.hybridSearchCaseLaw(
        natural_language as string,
        keywords as string,
        jurisdiction as string
      );
      
      res.json(results);
    } catch (error) {
      console.error("Hybrid search failed:", error);
      res.status(500).json({ success: false, error: "Hybrid search failed" });
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
      console.error("Federal statute search failed:", error);
      res.status(500).json({ success: false, error: "Search failed" });
    }
  });

  // Statute Database Seeding endpoints (must come before :jurisdiction)
  // Seed database with stateStatutesSeed data
  app.post("/api/statutes/seed", async (req, res) => {
    try {
      console.log('[API] Starting statute database seeding...');
      const result = await statuteSeeder.seedDatabase();
      res.json(result);
    } catch (error) {
      console.error("Seeding failed:", error);
      res.status(500).json({ success: false, error: "Seeding failed" });
    }
  });

  // Get seeding status
  app.get("/api/statutes/seed-status", async (req, res) => {
    try {
      const status = await statuteSeeder.getSeedingStatus();
      res.json({ success: true, ...status });
    } catch (error) {
      console.error("Failed to fetch seeding status:", error);
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
      console.error("Failed to fetch statutes:", error);
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
      console.error("Failed to fetch sentencing guidelines:", error);
      res.status(500).json({ success: false, error: "Failed to fetch sentencing guidelines" });
    }
  });

  // Local Resources API - Public Defenders
  app.get("/api/local-resources/public-defenders", async (req, res) => {
    try {
      const { zip } = req.query;
      
      if (!zip || typeof zip !== 'string' || zip.length !== 5) {
        return res.status(400).json({ success: false, error: "Valid 5-digit ZIP code required" });
      }

      // Mock data for demonstration - in production this would call a real API
      const mockResults = [
        {
          name: "County Public Defender Office",
          address: `123 Justice St, City ${zip}`,
          phone: "(555) 123-4567",
          hours: "Mon-Fri 8:00 AM - 5:00 PM",
          distance: "2.1 miles"
        },
        {
          name: "State Public Defender Regional Office",
          address: `456 Legal Ave, City ${zip}`,
          phone: "(555) 987-6543", 
          hours: "Mon-Fri 9:00 AM - 4:00 PM",
          distance: "5.3 miles"
        }
      ];

      res.json({ success: true, results: mockResults });
    } catch (error) {
      console.error("Failed to search public defenders:", error);
      res.status(500).json({ success: false, error: "Search failed" });
    }
  });

  // Local Resources API - Courthouses
  app.get("/api/local-resources/courthouses", async (req, res) => {
    try {
      const { zip } = req.query;
      
      if (!zip || typeof zip !== 'string' || zip.length !== 5) {
        return res.status(400).json({ success: false, error: "Valid 5-digit ZIP code required" });
      }

      // Mock data for demonstration - in production this would call a real API
      const mockResults = [
        {
          name: "County District Court",
          address: `789 Court St, City ${zip}`,
          phone: "(555) 234-5678",
          website: "https://example-court.gov",
          hours: "Mon-Fri 8:30 AM - 4:30 PM",
          distance: "1.8 miles"
        },
        {
          name: "Municipal Court Self-Help Center", 
          address: `321 City Hall Dr, City ${zip}`,
          phone: "(555) 345-6789",
          website: "https://example-city.gov/court",
          hours: "Mon-Thu 9:00 AM - 3:00 PM",
          distance: "3.2 miles"
        },
        {
          name: "Superior Court Complex",
          address: `654 Justice Blvd, City ${zip}`,
          phone: "(555) 456-7890",
          website: "https://example-superior.gov",
          hours: "Mon-Fri 8:00 AM - 5:00 PM",
          distance: "6.1 miles"
        }
      ];

      res.json({ success: true, results: mockResults });
    } catch (error) {
      console.error("Failed to search courthouses:", error);
      res.status(500).json({ success: false, error: "Search failed" });
    }
  });

  // Personalized Legal Guidance API (rate limited - expensive AI operations)
  app.post("/api/legal-guidance", aiRateLimiter, async (req, res) => {
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

      res.json({ 
        success: true, 
        sessionId,
        guidance: legalCase.guidance 
      });
    } catch (error) {
      console.error("Failed to generate legal guidance:", error);
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

      res.json({ 
        success: true, 
        guidance: legalCase.guidance,
        case: legalCase 
      });
    } catch (error) {
      console.error("Failed to fetch legal guidance:", error);
      res.status(500).json({ success: false, error: "Failed to fetch guidance" });
    }
  });

  // Case Feedback API - Submit feedback on precedent case helpfulness
  app.post("/api/case-feedback", async (req, res) => {
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
      
      console.log(`[Feedback] User ${isHelpful ? 'found helpful' : 'did not find helpful'}: ${caseName}`);
      
      res.json({ success: true, feedback });
    } catch (error) {
      console.error("Failed to submit case feedback:", error);
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
      console.error("Failed to get case feedback stats:", error);
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
      console.error("Failed to get session feedback:", error);
      res.status(500).json({ success: false, error: "Failed to get feedback" });
    }
  });

  // Privacy Consent Tracking - Record user consent (anonymous)
  app.post("/api/privacy-consent", async (req, res) => {
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
      
      console.log(`[Privacy] Consent recorded: ${consentType} v${consentVersion} - ${granted ? 'granted' : 'denied'}`);
      
      res.json({ success: true, recorded: true });
    } catch (error) {
      console.error("Failed to record privacy consent:", error);
      res.status(500).json({ success: false, error: "Failed to record consent" });
    }
  });

  // Privacy Consent Stats - Aggregate stats (no PII exposed)
  app.get("/api/privacy-consent/stats", async (req, res) => {
    try {
      const stats = await storage.getPrivacyConsentStats();
      res.json({ success: true, stats });
    } catch (error) {
      console.error("Failed to get privacy consent stats:", error);
      res.status(500).json({ success: false, error: "Failed to get stats" });
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
        model: "claude-sonnet-4-20250514",
        features: ["personalized-guidance", "natural-language-processing"]
      });
    } catch (error) {
      console.error("AI health check failed:", error);
      res.json({ 
        success: true, 
        available: false, 
        reason: "Connection test failed" 
      });
    }
  });

  // RECAP/Court Records Search API
  app.get("/api/court-records/search", async (req, res) => {
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
      console.error("Court records search failed:", error);
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
      console.error("Failed to fetch docket details:", error);
      res.status(500).json({ success: false, error: "Failed to fetch docket details" });
    }
  });

  // Statute Scraping API - Start scraping for a specific state
  app.post("/api/scrape/statutes/:stateCode", async (req, res) => {
    try {
      const { stateCode } = req.params;
      
      // Validate state code
      const validStates = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'];
      if (!validStates.includes(stateCode.toUpperCase())) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid state code. Currently supported: ${validStates.join(', ')}` 
        });
      }

      const result = await scrapingCoordinator.scrapeState(stateCode.toUpperCase());
      res.json(result);
    } catch (error) {
      console.error("Scraping failed:", error);
      res.status(500).json({ success: false, error: "Scraping failed" });
    }
  });

  // Get scraping status for a specific state
  app.get("/api/scrape/status/:stateCode", async (req, res) => {
    try {
      const { stateCode } = req.params;
      const status = await scrapingCoordinator.getLatestScrapeStatus(stateCode.toUpperCase());
      res.json({ success: true, status });
    } catch (error) {
      console.error("Failed to fetch scraping status:", error);
      res.status(500).json({ success: false, error: "Failed to fetch status" });
    }
  });

  // Get scraping history (all states or specific state)
  app.get("/api/scrape/history", async (req, res) => {
    try {
      const { stateCode } = req.query;
      const history = await scrapingCoordinator.getScrapeHistory(stateCode as string);
      res.json({ success: true, history });
    } catch (error) {
      console.error("Failed to fetch scraping history:", error);
      res.status(500).json({ success: false, error: "Failed to fetch history" });
    }
  });

  // Get scraping statistics
  app.get("/api/scrape/stats", async (req, res) => {
    try {
      const stats = await scrapingCoordinator.getScrapingStats();
      res.json({ success: true, stats });
    } catch (error) {
      console.error("Failed to fetch scraping stats:", error);
      res.status(500).json({ success: false, error: "Failed to fetch stats" });
    }
  });

  // Robots.txt audit - Check which states allow scraping
  app.get("/api/scrape/robots-audit", async (req, res) => {
    try {
      console.log('[API] Starting robots.txt audit...');
      const results = await auditRobotsTxt();
      printAuditSummary(results);
      res.json({ success: true, results });
    } catch (error) {
      console.error("Robots.txt audit failed:", error);
      res.status(500).json({ success: false, error: "Audit failed" });
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
      console.error("BJS statistics fetch failed:", error);
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
      console.error("BJS trends fetch failed:", error);
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
      console.error("OpenLaws status check failed:", error);
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
      console.error("OpenLaws citation search failed:", error);
      res.status(500).json({ success: false, error: "Search failed" });
    }
  });

  // OpenLaws API - Bulk import jurisdiction
  app.post("/api/openlaws/import/:jurisdictionCode", async (req, res) => {
    try {
      const { jurisdictionCode } = req.params;
      const result = await openLawsClient.bulkImportJurisdiction(jurisdictionCode.toUpperCase());
      res.json(result);
    } catch (error) {
      console.error("OpenLaws bulk import failed:", error);
      res.status(500).json({ success: false, error: "Import failed" });
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
        console.warn(`Warning: Charge ID "${id}" not found in database`);
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
    console.warn(`Warning: Could not find all charges. Found ${chargeClassifications.length} of ${chargeIds.length}`);
  }
  
  // Try Claude AI first if API key is available
  const useAI = !!process.env.ANTHROPIC_API_KEY;
  
  if (useAI && (caseData.incidentDescription || caseData.concernsQuestions)) {
    try {
      console.log('Generating AI-powered guidance with Claude...');
      const claudeGuidance = await generateClaudeGuidance(caseData);
      
      // Log usage metrics
      console.log(`Claude usage: ${claudeGuidance.usageMetrics.inputTokens} input + ${claudeGuidance.usageMetrics.outputTokens} output tokens`);
      console.log(`Estimated cost: $${claudeGuidance.usageMetrics.estimatedCost.toFixed(4)}`);
      
      return {
        ...claudeGuidance,
        chargeClassifications: chargeClassifications.length > 0 ? chargeClassifications : undefined,
        generatedBy: 'claude-ai'
      };
    } catch (error) {
      console.error('Claude AI failed, falling back to rule-based system:', error);
      // Fall through to rule-based system
    }
  }
  
  // Fallback to rule-based guidance engine
  console.log('Generating rule-based guidance...');
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
    
    console.log(`[Guidance] Rule-based validation complete - Confidence: ${(validationResult.confidenceScore * 100).toFixed(1)}%`);
  } catch (validationError) {
    console.warn('[Guidance] Rule-based validation failed:', validationError);
  }
  
  return {
    ...guidance,
    chargeClassifications: chargeClassifications.length > 0 ? chargeClassifications : undefined,
    validation,
    generatedBy: 'rule-based'
  };
}
