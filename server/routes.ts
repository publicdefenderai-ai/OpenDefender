import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { courtListenerService } from "./services/courtlistener";
import { legalDataService } from "./services/legal-data";
import { recapService } from "./services/recap";
import { insertLegalCaseSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import { generateEnhancedGuidance } from "./services/guidance-engine.js";
import { getChargeById } from "../shared/criminal-charges.js";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Case Law Search API
  app.get("/api/case-law/search", async (req, res) => {
    try {
      const { q: query, jurisdiction } = req.query;
      
      if (!query) {
        return res.status(400).json({ success: false, error: "Query parameter required" });
      }

      const results = await legalDataService.searchCaseLaw(
        query as string,
        jurisdiction as string
      );
      
      res.json(results);
    } catch (error) {
      console.error("Case law search failed:", error);
      res.status(500).json({ success: false, error: "Search failed" });
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

  // Statutes Search API - Search federal statutes
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

  // Personalized Legal Guidance API
  app.post("/api/legal-guidance", async (req, res) => {
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
      const guidance = generateLegalGuidance(validatedData);
      
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

  // Delete Legal Guidance Session
  app.delete("/api/legal-guidance/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.deleteLegalCase(sessionId);
      res.json({ success: true, message: "Session deleted" });
    } catch (error) {
      console.error("Failed to delete legal guidance:", error);
      res.status(500).json({ success: false, error: "Failed to delete session" });
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
        date_to: dateTo
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
        dateTo: dateTo as string
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

  const httpServer = createServer(app);
  return httpServer;
}

function generateLegalGuidance(caseData: any) {
  // Use the enhanced guidance engine for comprehensive legal guidance
  const guidance = generateEnhancedGuidance(caseData);
  
  // Extract charge classifications
  const chargeIds = Array.isArray(caseData.charges) ? caseData.charges : [caseData.charges];
  const chargeClassifications = chargeIds
    .map((id: string) => {
      const charge = getChargeById(id);
      if (!charge) {
        console.warn(`Warning: Charge ID "${id}" not found in database`);
        return null;
      }
      return { name: charge.name, classification: charge.category, code: charge.code };
    })
    .filter(Boolean);
  
  // Log if we couldn't find all charges
  if (chargeClassifications.length !== chargeIds.length) {
    console.warn(`Warning: Could not find all charges. Found ${chargeClassifications.length} of ${chargeIds.length}`);
  }
  
  // Add charge classification to guidance
  return {
    ...guidance,
    chargeClassifications: chargeClassifications.length > 0 ? chargeClassifications : undefined
  };
}
