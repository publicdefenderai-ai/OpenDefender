/**
 * Guidance Session Ownership — HTTP enforcement tests (Task #174)
 *
 * Goal: Verify that GET /api/legal-guidance/:sessionId enforces session
 * ownership so a caller who only knows the UUID cannot read another user's
 * legal guidance, for as long as the owning session is still live.
 *
 * Enforcement is in-memory only (guidanceSessionOwners Map, populated at
 * creation time), by design — this project intentionally does not persist
 * session bindings or legal case data beyond the running process (see
 * MemStorage in server/storage.ts). A restart clears the Map, and any case
 * created before it falls back to UUID-as-token security (128-bit entropy +
 * rate limiting). That's an accepted tradeoff: users are warned before
 * navigating away from unsaved guidance and offered an export, so nothing
 * depends on the binding surviving a restart.
 *
 * Tests use a real express-session middleware to produce genuine req.sessionID
 * values, and a stateful storage mock backing GET/POST /api/legal-guidance.
 */

import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import { randomUUID } from 'crypto';

// ── Hoisted shared state — accessible inside vi.mock factories ────────────────
const { caseStore } = vi.hoisted(() => ({
  caseStore: {} as Record<string, any>,
}));

// ── Storage mock — in-memory, mirroring the real MemStorage backing ───────────
vi.mock('../server/storage', () => ({
  storage: {
    createLegalCase: vi.fn().mockImplementation(async (data: any) => {
      const record = {
        id: randomUUID(),
        sessionId: data.sessionId,
        guidance: data.guidance ?? { overview: 'test guidance' },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 86_400_000),
        jurisdiction: data.jurisdiction ?? 'CA',
        charges: data.charges ?? [],
        caseStage: data.caseStage ?? 'arraignment',
        custodyStatus: null,
        hasAttorney: null,
        consentGiven: null,
        incidentDescription: null,
        selectedConcerns: null,
      };
      caseStore[data.sessionId] = record;
      return record;
    }),
    getLegalCase: vi.fn().mockImplementation(async (sessionId: string) => {
      return caseStore[sessionId] ?? null;
    }),
    getLegalResources: vi.fn().mockResolvedValue([]),
    createLegalResource: vi.fn().mockResolvedValue({}),
    getCourtData: vi.fn().mockResolvedValue([]),
    createCourtData: vi.fn().mockResolvedValue({}),
    getLegalAidOrganizations: vi.fn().mockResolvedValue([]),
    createLegalAidOrganization: vi.fn().mockResolvedValue({}),
    bulkCreateLegalAidOrganizations: vi.fn().mockResolvedValue([]),
    getStatutes: vi.fn().mockResolvedValue([]),
    createStatute: vi.fn().mockResolvedValue({}),
    createCaseFeedback: vi.fn().mockResolvedValue({}),
    getCaseFeedbackStats: vi.fn().mockResolvedValue({ helpful: 0, notHelpful: 0 }),
    getCaseFeedbackBySession: vi.fn().mockResolvedValue([]),
    recordPrivacyConsent: vi.fn().mockResolvedValue({}),
    getPrivacyConsentStats: vi.fn().mockResolvedValue({ total: 0, granted: 0, denied: 0, byType: {} }),
    createGuidanceFlag: vi.fn().mockResolvedValue({}),
    getGuidanceFlags: vi.fn().mockResolvedValue([]),
    getGuidanceFlagSummary: vi.fn().mockResolvedValue({ total: 0, byReason: {}, byJurisdiction: {}, byConfidence: {} }),
    getUser: vi.fn().mockResolvedValue(null),
    getUserByUsername: vi.fn().mockResolvedValue(null),
    createUser: vi.fn().mockResolvedValue({}),
    deleteLegalCase: vi.fn().mockResolvedValue(undefined),
    deleteSessionData: vi.fn().mockResolvedValue(undefined),
  },
}));

// ── Heavy service mocks — prevent DB / API calls ──────────────────────────────
vi.mock('../server/services/courtlistener', () => ({
  courtListenerService: { searchOpinions: vi.fn(), getOpinion: vi.fn() },
}));
vi.mock('../server/services/legal-data', () => ({
  legalDataService: { getLegalResources: vi.fn(), getStatutes: vi.fn() },
}));
vi.mock('../server/services/recap', () => ({
  recapService: { fetchDocument: vi.fn() },
}));
vi.mock('../server/services/bjs-statistics', () => ({
  bjsStatisticsService: { getCrimeStats: vi.fn(), getArrestStats: vi.fn() },
}));
vi.mock('../server/services/openlaws-client', () => ({
  openLawsClient: { searchStatutes: vi.fn(), getStatute: vi.fn() },
}));
vi.mock('../server/services/statute-seeder', () => ({
  statuteSeeder: { seedStatutes: vi.fn(), getSeededStatutes: vi.fn() },
}));
vi.mock('../server/services/attorney-docs/session-manager', () => ({
  attorneySessionManager: {
    createSession: vi.fn(),
    getSession: vi.fn(),
    deleteSession: vi.fn(),
    verifySession: vi.fn(),
  },
}));
vi.mock('../server/services/attorney-docs/document-generator', () => ({
  getTemplates: vi.fn().mockReturnValue([]),
  getTemplate: vi.fn().mockReturnValue(null),
  generateDocument: vi.fn(),
  getGeneratedDocument: vi.fn().mockReturnValue(null),
  clearSessionDocuments: vi.fn(),
}));
vi.mock('../server/services/attorney-docs/docx-generator', () => ({
  generateDocx: vi.fn().mockResolvedValue(Buffer.from('')),
}));
vi.mock('../server/services/document-summarizer', () => ({
  summarizeDocument: vi.fn(),
  validateFile: vi.fn().mockReturnValue({ valid: true }),
  getSupportedFileTypes: vi.fn().mockReturnValue([]),
  createSummaryBatch: vi.fn(),
  getSummaryBatchStatus: vi.fn(),
  cancelSummaryBatch: vi.fn(),
  redactDocumentPII: vi.fn(),
}));
vi.mock('../server/services/search-indexer', () => ({
  search: vi.fn().mockResolvedValue([]),
  buildSearchIndex: vi.fn(),
  getSearchIndexStats: vi.fn().mockReturnValue({ totalDocuments: 0 }),
}));
vi.mock('../server/services/locus-lookup', () => ({
  locusSearch: vi.fn().mockResolvedValue([]),
  normalizeStateCode: vi.fn().mockReturnValue('CA'),
}));
vi.mock('../server/services/legal-accuracy-validator', () => ({
  validateLegalGuidance: vi.fn().mockResolvedValue({
    isValid: true,
    confidenceScore: 1,
    issues: [],
    checksPerformed: 0,
    checksPassed: 0,
    summary: '',
  }),
}));
vi.mock('../server/config/ai-model', () => ({
  CLAUDE_MODEL_SONNET_DISPLAY_NAME: 'Claude Sonnet (test)',
}));
vi.mock('../server/services/guidance-engine', () => ({
  generateEnhancedGuidance: vi.fn().mockReturnValue({
    overview: 'Test guidance overview',
    criticalAlerts: [],
    immediateActions: [],
    nextSteps: [],
    deadlines: [],
    rightsReminders: [],
    uncertainties: [],
    collateralConsequences: [],
    usageMetrics: { inputTokens: 0, outputTokens: 0, estimatedCost: 0, processingTime: 0, model: 'rule-based', cacheHit: false, cacheCreationTokens: 0, cacheReadTokens: 0 },
  }),
  stampEstimateDeadlines: vi.fn().mockImplementation((_j: any, d: any) => d),
}));
vi.mock('../server/services/pii-redactor', () => ({
  redactCaseDetails: vi.fn().mockImplementation((data: unknown) => ({
    redactedDetails: data,
    stats: { total: 0 },
  })),
  isPIIRedactionEnabled: vi.fn().mockReturnValue(false),
}));
vi.mock('../server/services/cost-tracker', () => ({
  isAIAvailable: vi.fn().mockReturnValue(false),
  isServiceAvailable: vi.fn().mockReturnValue(true),
  recordAICost: vi.fn().mockResolvedValue(undefined),
  getAICostStatus: vi.fn().mockReturnValue({
    daily: { limit: 10, spent: 0, remaining: 10 },
  }),
}));
vi.mock('../server/services/captcha-verification', () => ({
  isCaptchaRequired: vi.fn().mockReturnValue(false),
  verifyCaptcha: vi.fn().mockResolvedValue({ success: true }),
  getCaptchaSiteKey: vi.fn().mockReturnValue(null),
}));
vi.mock('../server/services/claude-guidance', () => ({
  generateClaudeGuidance: vi.fn().mockRejectedValue(new Error('no API key')),
  streamClaudeGuidance: vi.fn().mockRejectedValue(new Error('no API key')),
  testClaudeConnection: vi.fn().mockResolvedValue({ ok: false }),
  clearSessionCache: vi.fn(),
}));
vi.mock('../shared/playbooks/index', () => ({
  getPlaybooks: vi.fn().mockReturnValue([]),
  getPlaybook: vi.fn().mockReturnValue(null),
}));
vi.mock('../server/middleware/budget-gate', () => ({
  requireServiceBudget: vi.fn().mockReturnValue((_req: any, _res: any, next: any) => next()),
}));

// ── Build test app once (real routes + real session middleware) ────────────────
let testApp: express.Express;

beforeAll(async () => {
  const { registerRoutes } = await import('../server/routes');
  testApp = express();
  testApp.use(express.json());
  testApp.use(session({
    name: 'od.sid',
    secret: 'test-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, sameSite: 'lax' },
  }));
  await registerRoutes(testApp);
}, 30_000);

// Reset case store between tests to prevent cross-test contamination
afterEach(() => {
  for (const key of Object.keys(caseStore)) {
    delete caseStore[key];
  }
});

// ── Helper: extract express session ID from Set-Cookie header ─────────────────
function extractSessionId(setCookieHeader: string | string[] | undefined): string | null {
  const header = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader;
  if (!header) return null;
  // express-session cookie value format: "od.sid=s%3A<id>.<sig>; ..."
  const match = header.match(/od\.sid=s%3A([^.]+)\./);
  return match ? match[1] : null;
}

// ── Valid case body for POST /api/legal-guidance ──────────────────────────────
const VALID_CASE_BODY = {
  jurisdiction: 'CA',
  charges: [],
  caseStage: 'arraignment',
};

// =============================================================================
describe('GET /api/legal-guidance/:sessionId — ownership enforcement', () => {

  it('allows access when the requesting session created the case (in-memory Map tier)', async () => {
    // Use a persistent agent so the session cookie is sent on subsequent requests
    const agent = request.agent(testApp);

    // POST to create the case — this binds the express session ID to the case in the Map
    const postRes = await agent
      .post('/api/legal-guidance')
      .send(VALID_CASE_BODY);

    expect(postRes.status).toBe(200);
    const { sessionId } = postRes.body;
    expect(typeof sessionId).toBe('string');

    // GET with the same agent (same session cookie) → should be allowed
    const getRes = await agent.get(`/api/legal-guidance/${sessionId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.success).toBe(true);
  });

  it('returns 403 (not 404) when a different session tries to retrieve guidance', async () => {
    // Agent A creates the case
    const agentA = request.agent(testApp);
    const postRes = await agentA
      .post('/api/legal-guidance')
      .send(VALID_CASE_BODY);

    expect(postRes.status).toBe(200);
    const { sessionId } = postRes.body;

    // Agent B (different session, fresh request) tries to retrieve
    const agentB = request.agent(testApp);
    const getRes = await agentB.get(`/api/legal-guidance/${sessionId}`);
    // Must be 403, not 404 — 404 would reveal whether the case exists
    expect(getRes.status).toBe(403);
    expect(getRes.body.success).toBe(false);
    expect(getRes.body.code).toBe('SESSION_EXPIRED');
  });

  it('falls back to UUID-as-token access when no in-memory binding is recorded (e.g. after a restart)', async () => {
    // No session persistence, by design: a case with no entry in
    // guidanceSessionOwners — because the process restarted since it was
    // created, or the record was seeded directly like this fixture — is
    // accessible to anyone who has the UUID. This is the accepted fallback,
    // not a bug; see the file-level docstring above.
    const caseSessionId = randomUUID();

    caseStore[caseSessionId] = {
      id: randomUUID(),
      sessionId: caseSessionId,
      guidance: { overview: 'guidance from before a restart' },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86_400_000),
      jurisdiction: 'CA',
      charges: [],
      caseStage: 'arraignment',
      custodyStatus: null,
      hasAttorney: null,
      consentGiven: null,
      incidentDescription: null,
      selectedConcerns: null,
    };

    // Any request with knowledge of the UUID should succeed (UUID-as-token fallback)
    const res = await request.agent(testApp).get(`/api/legal-guidance/${caseSessionId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
