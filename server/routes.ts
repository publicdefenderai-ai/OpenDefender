import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { courtListenerService } from "./services/courtlistener";
import { legalDataService } from "./services/legal-data";
import { insertLegalCaseSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import { generateEnhancedGuidance } from "./services/guidance-engine.js";

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

  // Statutes API
  app.get("/api/statutes/:jurisdiction", async (req, res) => {
    try {
      const { jurisdiction } = req.params;
      const statutes = await legalDataService.getStatutes(jurisdiction);
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

  // Personalized Legal Guidance API
  app.post("/api/legal-guidance", async (req, res) => {
    try {
      const sessionId = req.body.sessionId || randomUUID();
      const validatedData = insertLegalCaseSchema.parse({
        ...req.body,
        sessionId,
      });

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

  const httpServer = createServer(app);
  return httpServer;
}

function generateLegalGuidance(caseData: any) {
  // Use the enhanced guidance engine for comprehensive legal guidance
  return generateEnhancedGuidance(caseData);
}
