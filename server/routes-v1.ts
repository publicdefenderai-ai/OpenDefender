import type { Express, Request, Response } from "express";
import { Router as ExpressRouter } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { search, getSearchIndexStats } from "./services/search-indexer";
import { criminalCharges, getChargeById } from "../shared/criminal-charges";
import { devLog } from "./utils/dev-logger";
import { openApiSpec } from "./openapi";
import { diversionPrograms } from "../client/src/lib/diversion-programs-data";
import { legalGlossaryTerms } from "../client/src/lib/legal-glossary-data";
import { expungementRules } from "../client/src/lib/expungement-data";
import type { DiversionProgram, ExpungementRule, GlossaryTerm } from "@shared/schema";

const PUBLIC_API_CORS_OPTIONS = {
  origin: true,
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  maxAge: 86400,
};

const publicApiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: {
    success: false,
    error: 'Rate limit exceeded. Please try again shortly.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false, xForwardedForHeader: false }
});

function toCSV(data: any[], columns: string[]): string {
  const header = columns.join(',');
  const rows = data.map(item => 
    columns.map(col => {
      const val = item[col];
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')
  );
  return [header, ...rows].join('\n');
}

export function registerV1Routes(app: Express): void {
  const router = ExpressRouter();
  
  router.use(cors(PUBLIC_API_CORS_OPTIONS));
  router.use(publicApiRateLimiter);
  
  router.get('/openapi.json', (req: Request, res: Response) => {
    res.json(openApiSpec);
  });

  router.get('/search', (req: Request, res: Response) => {
    try {
      const q = req.query.q as string;
      const lang = (req.query.lang as string) || 'en';
      const types = req.query.types as string;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

      if (!q || q.length < 2 || q.length > 100) {
        return res.status(400).json({
          success: false,
          error: 'Query parameter "q" must be 2-100 characters'
        });
      }

      const searchResult = search({
        query: q,
        language: lang === 'es' ? 'es' : 'en',
        filters: types ? { types: types.split(',') as any[] } : undefined
      });

      res.json({
        success: true,
        results: searchResult.results.slice(0, limit),
        meta: {
          totalResults: searchResult.totalCount,
          queryTime: searchResult.searchTimeMs,
          suggestions: searchResult.suggestions
        }
      });
    } catch (error) {
      devLog('api-v1', `Search error: ${error}`);
      res.status(500).json({ success: false, error: 'Search failed' });
    }
  });

  router.get('/charges', (req: Request, res: Response) => {
    try {
      const jurisdiction = req.query.jurisdiction as string;
      const category = req.query.category as string;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = parseInt(req.query.offset as string) || 0;

      let filtered = criminalCharges;

      if (jurisdiction) {
        filtered = filtered.filter(c => 
          c.jurisdiction.toLowerCase() === jurisdiction.toLowerCase()
        );
      }

      if (category) {
        filtered = filtered.filter(c => c.category === category);
      }

      const total = filtered.length;
      const data = filtered.slice(offset, offset + limit);

      res.json({
        success: true,
        data,
        meta: { total, limit, offset }
      });
    } catch (error) {
      devLog('api-v1', `Charges error: ${error}`);
      res.status(500).json({ success: false, error: 'Failed to retrieve charges' });
    }
  });

  router.get('/charges/:id', (req: Request, res: Response) => {
    try {
      const charge = getChargeById(req.params.id);
      if (!charge) {
        return res.status(404).json({ success: false, error: 'Charge not found' });
      }
      res.json({ success: true, data: charge });
    } catch (error) {
      devLog('api-v1', `Charge lookup error: ${error}`);
      res.status(500).json({ success: false, error: 'Failed to retrieve charge' });
    }
  });

  router.get('/diversion-programs', (req: Request, res: Response) => {
    try {
      const state = req.query.state as string;
      const county = req.query.county as string;
      const type = req.query.type as string;

      let filtered = diversionPrograms;

      if (state) {
        filtered = filtered.filter((p: DiversionProgram) => 
          p.state?.toLowerCase() === state.toLowerCase()
        );
      }

      if (county) {
        filtered = filtered.filter((p: DiversionProgram) => 
          p.county?.toLowerCase().includes(county.toLowerCase())
        );
      }

      if (type) {
        filtered = filtered.filter((p: DiversionProgram) => 
          p.programTypes?.some(pt => pt.toLowerCase().includes(type.toLowerCase()))
        );
      }

      res.json({ success: true, data: filtered });
    } catch (error) {
      devLog('api-v1', `Diversion programs error: ${error}`);
      res.status(500).json({ success: false, error: 'Failed to retrieve programs' });
    }
  });

  router.get('/glossary', (req: Request, res: Response) => {
    try {
      const lang = (req.query.lang as string) || 'en';
      
      const terms = legalGlossaryTerms.map((term: any) => ({
        id: term.id,
        term: lang === 'es' && term.termEs ? term.termEs : term.term,
        definition: lang === 'es' && term.definitionEs ? term.definitionEs : term.definition,
        aliases: term.aliases || [],
        tags: term.tags || []
      }));

      res.json({ success: true, data: terms });
    } catch (error) {
      devLog('api-v1', `Glossary error: ${error}`);
      res.status(500).json({ success: false, error: 'Failed to retrieve glossary' });
    }
  });

  router.get('/expungement-rules', (req: Request, res: Response) => {
    try {
      const state = req.query.state as string;

      let filtered = expungementRules;

      if (state) {
        filtered = filtered.filter((r: ExpungementRule) => 
          r.state?.toLowerCase() === state.toLowerCase()
        );
      }

      res.json({ success: true, data: filtered });
    } catch (error) {
      devLog('api-v1', `Expungement rules error: ${error}`);
      res.status(500).json({ success: false, error: 'Failed to retrieve rules' });
    }
  });

  router.get('/export/charges', (req: Request, res: Response) => {
    try {
      const format = (req.query.format as string) || 'json';
      const jurisdiction = req.query.jurisdiction as string;

      let data = criminalCharges;
      if (jurisdiction) {
        data = data.filter(c => 
          c.jurisdiction.toLowerCase() === jurisdiction.toLowerCase()
        );
      }

      if (format === 'csv') {
        const csv = toCSV(data, ['id', 'name', 'jurisdiction', 'category', 'severity', 'statuteCitation', 'description']);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="criminal-charges.csv"');
        return res.send(csv);
      }

      res.json(data);
    } catch (error) {
      devLog('api-v1', `Export charges error: ${error}`);
      res.status(500).json({ success: false, error: 'Export failed' });
    }
  });

  router.get('/export/diversion-programs', (req: Request, res: Response) => {
    try {
      const format = (req.query.format as string) || 'json';

      if (format === 'csv') {
        const csv = toCSV(diversionPrograms, ['id', 'name', 'state', 'county', 'type', 'description']);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="diversion-programs.csv"');
        return res.send(csv);
      }

      res.json(diversionPrograms);
    } catch (error) {
      devLog('api-v1', `Export programs error: ${error}`);
      res.status(500).json({ success: false, error: 'Export failed' });
    }
  });

  router.get('/stats', (req: Request, res: Response) => {
    try {
      const stats = getSearchIndexStats();
      res.json({
        success: true,
        totalDocuments: stats.totalDocuments,
        byType: stats.documentsByType,
        jurisdictions: 51
      });
    } catch (error) {
      devLog('api-v1', `Stats error: ${error}`);
      res.status(500).json({ success: false, error: 'Failed to retrieve stats' });
    }
  });

  app.use('/api/v1', router);
  
  devLog('api-v1', 'Public API v1 routes registered at /api/v1');
}
