/**
 * Guidance Route — HTTP response envelope tests (Task #209)
 *
 * Goal: Verify that the /api/legal-guidance/rules HTTP route returns a
 * correctly-shaped JSON envelope so a regression in the route layer is caught
 * before users see a broken or empty guidance dashboard.
 *
 * The rules route (POST /api/legal-guidance/rules) is the primary target
 * because it:
 *   - Has the lightest middleware stack (searchRateLimiter, which skips in dev)
 *   - Makes no storage write — pure request-in / JSON-out
 *   - Is the guaranteed fallback path when AI is unavailable
 *
 * The tests go through the REAL route handler (via registerRoutes) so any
 * future change to the response envelope breaks a test immediately.
 *
 * Heavy service dependencies are mocked to prevent DB connections and API
 * calls, while keeping the actual route logic, schema validation, and
 * response shaping untouched.
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';

// ── Required top-level fields the guidance dashboard reads ────────────────────
const REQUIRED_GUIDANCE_FIELDS = [
  'overview',
  'criticalAlerts',
  'immediateActions',
  'nextSteps',
  'deadlines',
  'rightsReminders',
  'uncertainties',
  'collateralConsequences',
  'usageMetrics',
];

// ── Controlled mock return value for generateEnhancedGuidance ─────────────────
const MOCK_RULES_GUIDANCE = {
  overview: 'You have been charged with a criminal offense in California.',
  criticalAlerts: [],
  immediateActions: [{ action: 'Contact an attorney', urgency: 'urgent' }],
  nextSteps: [{ step: 'Attend arraignment', timeframe: 'within 48 hours' }],
  deadlines: [],
  rightsReminders: ['You have the right to remain silent.'],
  uncertainties: [],
  collateralConsequences: [],
  usageMetrics: {
    inputTokens: 0,
    outputTokens: 0,
    estimatedCost: 0,
    processingTime: 0,
    model: 'rule-based',
    cacheHit: false,
    cacheCreationTokens: 0,
    cacheReadTokens: 0,
  },
};

// ── Heavy service mocks — prevents DB connections and API calls ───────────────
// Storage (db connection)
vi.mock('../server/storage', () => ({
  storage: {
    createLegalCase: vi.fn().mockImplementation(async (legalCase: { guidance?: unknown; sessionId?: string }) => ({
      id: 'test-id',
      guidance: legalCase.guidance ?? {},
      sessionId: legalCase.sessionId ?? 'sess',
    })),
    getLegalCase: vi.fn().mockResolvedValue(null),
    getLegalCasesBySession: vi.fn().mockResolvedValue([]),
    deleteLegalCase: vi.fn().mockResolvedValue(undefined),
    deleteExpiredCases: vi.fn().mockResolvedValue(0),
    createLegalResource: vi.fn().mockResolvedValue({}),
    getLegalResources: vi.fn().mockResolvedValue([]),
    createCourtData: vi.fn().mockResolvedValue({}),
    getCourtData: vi.fn().mockResolvedValue([]),
    createCaseFeedback: vi.fn().mockResolvedValue({}),
    createGuidanceFlag: vi.fn().mockResolvedValue({}),
    getGlossaryTerms: vi.fn().mockResolvedValue([]),
    getGlossaryTerm: vi.fn().mockResolvedValue(null),
    createUser: vi.fn().mockResolvedValue({}),
    getUserById: vi.fn().mockResolvedValue(null),
    getUserByUsername: vi.fn().mockResolvedValue(null),
    updateUser: vi.fn().mockResolvedValue({}),
  },
}));

// Services that initialize external connections at import time
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
    isValid: true, confidenceScore: 1, issues: [], checksPerformed: 0, checksPassed: 0, summary: '',
  }),
}));
vi.mock('../server/config/ai-model', () => ({
  CLAUDE_MODEL_SONNET_DISPLAY_NAME: 'Claude Sonnet (test)',
}));

// Route-specific service mocks
vi.mock('../server/services/guidance-engine', () => ({
  generateEnhancedGuidance: vi.fn().mockReturnValue(MOCK_RULES_GUIDANCE),
  stampEstimateDeadlines: vi.fn().mockImplementation((_jurisdiction: string, deadlines: unknown) => deadlines),
}));
vi.mock('../server/services/pii-redactor', () => ({
  redactCaseDetails: vi.fn().mockImplementation((data: unknown) => ({
    redactedDetails: data,
    stats: { total: 0 },
  })),
  isPIIRedactionEnabled: vi.fn().mockReturnValue(false),
}));
vi.mock('../server/services/cost-tracker', () => ({
  isAIAvailable: vi.fn().mockReturnValue(true),
  isServiceAvailable: vi.fn().mockReturnValue(true),
  recordAICost: vi.fn().mockResolvedValue(undefined),
  getAICostStatus: vi.fn().mockReturnValue({
    daily: { limit: 10, spent: 0, remaining: 10 },
  }),
}));
vi.mock('../server/services/authority-eligibility', () => ({
  getCurrentAuthoritySelectableChargeIds: vi.fn().mockResolvedValue(
    new Set(['ca-gross-vehicular-manslaughter-191-5-a']),
  ),
  filterAuthorityBackedCharges: vi.fn().mockImplementation((items: Array<{ id: string }>) => items),
}));
vi.mock('../server/services/captcha-verification', () => ({
  isCaptchaRequired: vi.fn().mockReturnValue(false),
  verifyCaptcha: vi.fn().mockResolvedValue({ success: true }),
  getCaptchaSiteKey: vi.fn().mockReturnValue(null),
}));
vi.mock('../server/services/claude-guidance', () => ({
  generateClaudeGuidance: vi.fn(),
  streamClaudeGuidance: vi.fn(),
  testClaudeConnection: vi.fn().mockResolvedValue({ ok: true }),
  clearSessionCache: vi.fn(),
  getGuidanceCacheKey: vi.fn().mockReturnValue('test-cache-key'),
  startOptionalSourceEnrichment: vi.fn(),
}));
vi.mock('../shared/playbooks/index', () => ({
  getPlaybooks: vi.fn().mockReturnValue([]),
  getPlaybook: vi.fn().mockReturnValue(null),
}));

// ── Build the test Express app once using the real registerRoutes ─────────────
let testApp: express.Express;

beforeAll(async () => {
  const { registerRoutes } = await import('../server/routes');
  testApp = express();
  testApp.use(express.json());
  await registerRoutes(testApp);
}, 30_000);

// ── Minimal valid request body (rules route schema) ───────────────────────────
const VALID_BODY = {
  jurisdiction: 'CA',
  charges: [],
  caseStage: 'arraignment',
};

const CANONICAL_SUBDIVISION_CHARGE = 'ca-gross-vehicular-manslaughter-191-5-a';
const EXPECTED_CHARGE_IDENTITY = [{
  id: CANONICAL_SUBDIVISION_CHARGE,
  name: 'Gross Vehicular Manslaughter While Intoxicated',
  title: 'Gross Vehicular Manslaughter While Intoxicated',
  code: 'Cal. Penal Code § 191.5(a)',
  verifiedCitation: 'Cal. Penal Code § 191.5(a)',
}];

const MOCK_AI_GUIDANCE_WITH_DRIFTING_CHARGE = {
  ...MOCK_RULES_GUIDANCE,
  overview: 'Mock AI guidance with intentionally incorrect charge metadata.',
  chargeClassifications: [{
    id: 'ai-invented-charge-id',
    name: 'AI-Invented Charge Name',
    title: 'AI-Invented Charge Title',
    classification: 'AI-invented classification',
    code: 'AI § 999.9',
    verifiedCitation: 'AI § 999.9',
    maxPenalty: 'AI-invented penalty',
  }],
  usageMetrics: {
    ...MOCK_RULES_GUIDANCE.usageMetrics,
    model: 'claude-test',
  },
};

function parseSseEvents(body: string): Array<Record<string, any>> {
  return body
    .split('\n\n')
    .filter((event) => event.startsWith('data: '))
    .map((event) => JSON.parse(event.slice('data: '.length)));
}

function chargeIdentity(guidance: Record<string, any>) {
  return guidance.chargeClassifications.map((classification: Record<string, any>) => ({
    id: classification.id,
    name: classification.name,
    title: classification.title,
    code: classification.code,
    verifiedCitation: classification.verifiedCitation,
  }));
}

// =============================================================================
describe('POST /api/legal-guidance/rules — response envelope shape', () => {
  it('returns 200 with { success: true, sessionId, guidance } envelope', async () => {
    const res = await request(testApp)
      .post('/api/legal-guidance/rules')
      .send(VALID_BODY)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(typeof res.body.sessionId).toBe('string');
    expect(res.body.sessionId.length).toBeGreaterThan(0);
    expect(res.body.guidance).toBeDefined();
    expect(typeof res.body.guidance).toBe('object');
  });

  it('guidance object includes all required dashboard top-level fields', async () => {
    const res = await request(testApp)
      .post('/api/legal-guidance/rules')
      .send(VALID_BODY)
      .expect(200);

    for (const field of REQUIRED_GUIDANCE_FIELDS) {
      expect(res.body.guidance, `missing guidance field: ${field}`).toHaveProperty(field);
    }
  });

  it('guidance includes generatedBy and generatedAt route-injected fields', async () => {
    const res = await request(testApp)
      .post('/api/legal-guidance/rules')
      .send(VALID_BODY)
      .expect(200);

    expect(res.body.guidance.generatedBy).toBe('rule-based');
    expect(typeof res.body.guidance.generatedAt).toBe('string');
    // generatedAt should be a valid ISO timestamp
    expect(() => new Date(res.body.guidance.generatedAt)).not.toThrow();
    expect(new Date(res.body.guidance.generatedAt).getTime()).toBeGreaterThan(0);
  });

  it('returns canonical California subdivision identity and citation in guidance classifications', async () => {
    const res = await request(testApp)
      .post('/api/legal-guidance/rules')
      .send({
        ...VALID_BODY,
        charges: ['ca-gross-vehicular-manslaughter-191-5-a'],
      })
      .expect(200);

    expect(res.body.guidance.chargeClassifications).toEqual([
      expect.objectContaining({
        id: 'ca-gross-vehicular-manslaughter-191-5-a',
        name: 'Gross Vehicular Manslaughter While Intoxicated',
        code: 'Cal. Penal Code § 191.5(a)',
        verifiedCitation: 'Cal. Penal Code § 191.5(a)',
      }),
    ]);
    expect(res.body.guidance.chargeClassifications[0].id).not.toBe('ca-vehicular-homicide');
  });

  it('uses a client-supplied sessionId when one is provided', async () => {
    const sessionId = 'client-session-abc-123';
    const res = await request(testApp)
      .post('/api/legal-guidance/rules')
      .send({ ...VALID_BODY, sessionId })
      .expect(200);

    expect(res.body.sessionId).toBe(sessionId);
  });

  it('generates a UUID sessionId when none is supplied', async () => {
    const res = await request(testApp)
      .post('/api/legal-guidance/rules')
      .send(VALID_BODY)
      .expect(200);

    // UUID v4 pattern
    expect(res.body.sessionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});

// =============================================================================
describe('legal guidance routes: canonical charge parity', () => {
  it('returns the same canonical subdivision identity from ordinary, streaming, and rules routes without AI', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '');

    const { generateClaudeGuidance, streamClaudeGuidance } = await import('../server/services/claude-guidance');
    (generateClaudeGuidance as ReturnType<typeof vi.fn>).mockClear();
    (streamClaudeGuidance as ReturnType<typeof vi.fn>).mockClear();

    try {
      const body = {
        ...VALID_BODY,
        charges: [CANONICAL_SUBDIVISION_CHARGE],
      };

      const ordinaryResponse = await request(testApp)
        .post('/api/legal-guidance')
        .send(body)
        .expect(200);
      const rulesResponse = await request(testApp)
        .post('/api/legal-guidance/rules')
        .send(body)
        .expect(200);
      const streamResponse = await request(testApp)
        .post('/api/legal-guidance/stream')
        .send(body)
        .expect(200);

      const streamCompleteEvent = parseSseEvents(streamResponse.text)
        .find((event) => event.type === 'complete');
      expect(streamCompleteEvent).toBeDefined();
      expect(streamCompleteEvent?.success).toBe(true);

      const routeIdentities = [
        chargeIdentity(ordinaryResponse.body.guidance),
        chargeIdentity(rulesResponse.body.guidance),
        chargeIdentity(streamCompleteEvent?.guidance),
      ];

      for (const identity of routeIdentities) {
        expect(identity).toEqual(EXPECTED_CHARGE_IDENTITY);
      }
      expect(routeIdentities[1]).toEqual(routeIdentities[0]);
      expect(routeIdentities[2]).toEqual(routeIdentities[0]);
      expect(generateClaudeGuidance).not.toHaveBeenCalled();
      expect(streamClaudeGuidance).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('keeps catalog-owned charge identity when AI returns a drifting title or citation', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-anthropic-key');

    const { generateClaudeGuidance, streamClaudeGuidance } = await import('../server/services/claude-guidance');
    (generateClaudeGuidance as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      MOCK_AI_GUIDANCE_WITH_DRIFTING_CHARGE,
    );
    (streamClaudeGuidance as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      MOCK_AI_GUIDANCE_WITH_DRIFTING_CHARGE,
    );

    try {
      const body = {
        ...VALID_BODY,
        charges: [CANONICAL_SUBDIVISION_CHARGE],
        // The ordinary route only uses AI when there is personalized case
        // context; the stream route is AI-enabled for every valid request.
        incidentDescription: 'Mock case context for the AI route test.',
      };

      const ordinaryResponse = await request(testApp)
        .post('/api/legal-guidance')
        .send(body)
        .expect(200);
      const streamResponse = await request(testApp)
        .post('/api/legal-guidance/stream')
        .send(body)
        .expect(200);

      const streamCompleteEvent = parseSseEvents(streamResponse.text)
        .find((event) => event.type === 'complete');
      expect(streamCompleteEvent?.success).toBe(true);

      for (const guidance of [
        ordinaryResponse.body.guidance,
        streamCompleteEvent?.guidance,
      ]) {
        expect(guidance.generatedBy).toBe('claude-ai');
        expect(chargeIdentity(guidance)).toEqual(EXPECTED_CHARGE_IDENTITY);
        expect(JSON.stringify(guidance)).not.toContain('ai-invented-charge-id');
        expect(JSON.stringify(guidance)).not.toContain('AI § 999.9');
      }

      expect(generateClaudeGuidance).toHaveBeenCalledTimes(1);
      expect(streamClaudeGuidance).toHaveBeenCalledTimes(1);
    } finally {
      (generateClaudeGuidance as ReturnType<typeof vi.fn>).mockClear();
      (streamClaudeGuidance as ReturnType<typeof vi.fn>).mockClear();
      vi.unstubAllEnvs();
    }
  });
});

// =============================================================================
describe('POST /api/legal-guidance/stream: exact California subdivision identity', () => {
  it('keeps the canonical charge identity and citation in the complete SSE event without calling AI', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '');

    try {
      const res = await request(testApp)
        .post('/api/legal-guidance/stream')
        .send({
          ...VALID_BODY,
          charges: [CANONICAL_SUBDIVISION_CHARGE],
        })
        .expect(200);

      const events = parseSseEvents(res.text);
      const completeEvent = events.find((event) => event.type === 'complete');

      expect(completeEvent).toBeDefined();
      expect(events.at(-1)?.type).toBe('complete');
      expect(completeEvent?.success).toBe(true);

      const guidance = completeEvent?.guidance;
      expect(guidance.chargeClassifications).toEqual([
        expect.objectContaining({
          id: CANONICAL_SUBDIVISION_CHARGE,
          name: 'Gross Vehicular Manslaughter While Intoxicated',
          code: 'Cal. Penal Code § 191.5(a)',
          verifiedCitation: 'Cal. Penal Code § 191.5(a)',
        }),
      ]);
      expect(JSON.stringify(guidance)).not.toContain('ca-vehicular-homicide');

      const { streamClaudeGuidance } = await import('../server/services/claude-guidance');
      expect(streamClaudeGuidance).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllEnvs();
    }
  });
});

// =============================================================================
describe('POST /api/legal-guidance/rules — error handling', () => {
  it('returns a structured JSON error (not a stack trace) when guidance generation fails', async () => {
    const { generateEnhancedGuidance } = await import('../server/services/guidance-engine');
    (generateEnhancedGuidance as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error('Engine failure');
    });

    const res = await request(testApp)
      .post('/api/legal-guidance/rules')
      .send(VALID_BODY)
      .expect(500);

    // Must be structured JSON — not a raw stack trace string
    expect(res.body.success).toBe(false);
    expect(typeof res.body.error).toBe('string');
    expect(res.body.error).not.toMatch(/at Object\.|at async|Error:/);
    // No stack trace properties leaked
    expect(res.body.stack).toBeUndefined();
  });

  it('returns 400 with a structured error when all provided charge IDs are unrecognized', async () => {
    const res = await request(testApp)
      .post('/api/legal-guidance/rules')
      .send({ ...VALID_BODY, charges: ['nonexistent-charge-id-xyz'] })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(typeof res.body.error).toBe('string');
  });

  it('returns 500 with structured JSON when the request body fails schema validation', async () => {
    const res = await request(testApp)
      .post('/api/legal-guidance/rules')
      .send({ charges: [] }) // missing jurisdiction and caseStage
      .expect(500);

    expect(res.body.success).toBe(false);
    expect(typeof res.body.error).toBe('string');
    expect(res.body.stack).toBeUndefined();
  });
});
