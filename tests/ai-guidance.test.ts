/**
 * AI guidance response shape tests — Task #205
 *
 * Goal: catch a malformed or missing field in the Claude response (or the
 * fallback rules path) before it silently produces an empty dashboard for users.
 *
 * Strategy:
 *  - Use vi.hoisted() to create mock functions before module hoisting.
 *  - Mock @anthropic-ai/sdk with a regular-function constructor (arrow functions
 *    cannot be used with `new`).
 *  - Mock heavy service dependencies so no real network calls are made.
 *  - Test generateClaudeGuidance:
 *      • happy path  — valid mock response → all required dashboard fields present
 *      • malformed   — missing/wrong field  → function throws (not silent empty)
 *      • bad JSON    — unparseable text     → function throws
 *  - Test the fallback path: generateEnhancedGuidance produces the same required
 *    shape, matching what routes.ts uses when generateClaudeGuidance throws.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── vi.hoisted(): variables created here are available inside vi.mock factories ──
const { mockMessagesCreate } = vi.hoisted(() => ({
  mockMessagesCreate: vi.fn(),
}));

// ── @anthropic-ai/sdk mock ────────────────────────────────────────────────────
// Must use a regular function (not arrow) as the constructor so `new Anthropic()`
// works at module-init time inside claude-guidance.ts.
// MockAPIError must also be a static property of MockAnthropic so that
// `error instanceof Anthropic.APIError` in the outer catch of generateClaudeGuidance
// does not throw "Right-hand side of 'instanceof' is not an object".
vi.mock('@anthropic-ai/sdk', () => {
  class MockAPIError extends Error {
    status: number;
    constructor(status: number, msg: string) {
      super(msg);
      this.status = status;
    }
  }
  function MockAnthropic(this: any) {
    this.messages = { create: mockMessagesCreate };
  }
  (MockAnthropic as any).APIError = MockAPIError;
  return { default: MockAnthropic, APIError: MockAPIError };
});

// ── Heavy service dependency mocks ───────────────────────────────────────────
vi.mock('../server/services/locus-lookup', () => ({
  getLocusContext: vi.fn().mockResolvedValue(null),
  LOCUS_ATTRIBUTION: 'LOCUS test attribution',
}));

vi.mock('../server/services/cost-tracker', () => ({
  recordAICost: vi.fn().mockResolvedValue(undefined),
  isRequestCostAcceptable: vi.fn().mockReturnValue(true),
}));

vi.mock('../server/services/legal-accuracy-validator', () => ({
  validateLegalGuidance: vi.fn().mockResolvedValue({
    confidenceScore: 0.95,
    isValid: true,
    summary: 'Mock validation passed',
    checksPerformed: 2,
    checksPassed: 2,
    issues: [],
  }),
}));

vi.mock('../server/services/guidance-safety', () => ({
  scanGuidanceForDangerContent: vi.fn().mockReturnValue({ hasDangerContent: false, dangerFlags: [] }),
  stripDangerousItems: vi.fn().mockReturnValue({ immediateActions: [], avoidActions: [], strippedCount: 0 }),
}));

vi.mock('../client/src/lib/collateral-consequences-data', () => ({
  buildCollateralConsequenceContextBlock: vi.fn().mockReturnValue(''),
}));

vi.mock('@shared/diversion-availability', () => ({
  extractDiversionMentions: vi.fn().mockReturnValue([]),
  checkDiversionAvailability: vi.fn().mockReturnValue({ unavailable: [] }),
}));

vi.mock('@shared/jurisdiction-procedure-rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/jurisdiction-procedure-rules')>();
  return {
    ...actual,
    buildJurisdictionContextBlock: vi.fn().mockReturnValue(''),
  };
});

// ── Imports (after all vi.mock declarations) ──────────────────────────────────
import { generateClaudeGuidance } from '../server/services/claude-guidance';
import { generateEnhancedGuidance } from '../server/services/guidance-engine';

// ── Shared test fixtures ──────────────────────────────────────────────────────

// Minimal canned response that satisfies validateClaudeResponse() in full.
const VALID_CLAUDE_JSON = {
  overview: 'You have been charged with DUI in California. Here is what you need to know.',
  criticalAlerts: ['Do not speak to police without an attorney present.'],
  immediateActions: [
    { action: 'Request an attorney immediately.', urgency: 'urgent' },
    { action: 'Write down everything you remember about the arrest.', urgency: 'high' },
  ],
  nextSteps: ['Attend your arraignment hearing.', 'Review discovery with your attorney.'],
  deadlines: [
    {
      event: 'DMV hearing request',
      timeframe: '10 days from arrest',
      description: 'Request a DMV hearing within 10 days to contest the administrative license suspension.',
      priority: 'critical',
    },
  ],
  rights: ['You have the right to remain silent.', 'You have the right to an attorney.'],
  resources: [{ type: 'legal_aid', description: 'Public Defender Office', contact: 'Call 211' }],
  warnings: ['Do not discuss your case with anyone other than your attorney.'],
  evidenceToGather: ['Any dashcam or bodycam footage.'],
  courtPreparation: ['Dress professionally for all court appearances.'],
  avoidActions: ['Do not post about your case on social media.'],
  timeline: [
    { stage: 'Arraignment', description: 'First court appearance', timeframe: '48–72 hours', completed: false },
  ],
  mockQA: [],
  uncertainties: [],
  collateralConsequences: [],
};

// Build the Anthropic SDK message shape returned by messages.create().
function makeMockApiResponse(jsonPayload: object) {
  return {
    content: [{ type: 'text', text: JSON.stringify(jsonPayload) }],
    usage: {
      input_tokens: 500,
      output_tokens: 800,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    },
  };
}

const BASE_CASE = {
  jurisdiction: 'CA',
  charges: ['driving under the influence'],
  caseStage: 'arraignment',
  custodyStatus: 'released',
  hasAttorney: false,
  supervisionStatus: 'none',
  citizenshipStatus: 'citizen',
  hasMinorChildren: false,
  hasProfessionalLicense: false,
  hasHousingAssistance: false,
};

// Fields the guidance dashboard unconditionally renders — undefined here means
// a blank section with no visible error shown to the user.
const REQUIRED_ARRAY_FIELDS = [
  'criticalAlerts',
  'immediateActions',
  'nextSteps',
  'deadlines',
  'rights',
  'resources',
  'warnings',
  'evidenceToGather',
  'courtPreparation',
  'avoidActions',
  'timeline',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Happy path — generateClaudeGuidance parses a valid mock response correctly
// ─────────────────────────────────────────────────────────────────────────────
describe('generateClaudeGuidance — happy path (mocked Anthropic SDK)', () => {
  beforeEach(() => {
    mockMessagesCreate.mockResolvedValue(makeMockApiResponse(VALID_CLAUDE_JSON));
  });

  it('returns a non-empty overview string', async () => {
    const result = await generateClaudeGuidance(BASE_CASE as any, 'test-session-1');
    expect(typeof result.overview).toBe('string');
    expect(result.overview.length).toBeGreaterThan(0);
  });

  it('returns all required array fields as arrays', async () => {
    const result = await generateClaudeGuidance(BASE_CASE as any, 'test-session-2');
    for (const field of REQUIRED_ARRAY_FIELDS) {
      expect(Array.isArray((result as any)[field]), `${field} should be an array`).toBe(true);
    }
  });

  it('immediateActions items each have a non-empty action string and valid urgency', async () => {
    const result = await generateClaudeGuidance(BASE_CASE as any, 'test-session-3');
    const validUrgencies = ['urgent', 'high', 'medium', 'low'];
    for (const item of result.immediateActions) {
      expect(typeof item.action).toBe('string');
      expect(item.action.length).toBeGreaterThan(0);
      expect(validUrgencies).toContain(item.urgency);
    }
  });

  it('deadline items each have event, timeframe, description, and valid priority', async () => {
    const result = await generateClaudeGuidance(BASE_CASE as any, 'test-session-4');
    const validPriorities = ['critical', 'important', 'normal'];
    for (const d of result.deadlines) {
      expect(typeof d.event).toBe('string');
      expect(typeof d.timeframe).toBe('string');
      expect(typeof d.description).toBe('string');
      expect(validPriorities).toContain(d.priority);
    }
  });

  it('collateralConsequences and uncertainties are arrays (not undefined)', async () => {
    const result = await generateClaudeGuidance(BASE_CASE as any, 'test-session-5');
    expect(Array.isArray(result.collateralConsequences)).toBe(true);
    expect(Array.isArray(result.uncertainties)).toBe(true);
  });

  it('usageMetrics contains numeric inputTokens and outputTokens', async () => {
    const result = await generateClaudeGuidance(BASE_CASE as any, 'test-session-6');
    expect(typeof result.usageMetrics.inputTokens).toBe('number');
    expect(typeof result.usageMetrics.outputTokens).toBe('number');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Malformed responses — function must throw (never silently return empty fields)
// ─────────────────────────────────────────────────────────────────────────────
describe('generateClaudeGuidance — malformed responses throw rather than silently fail', () => {
  it('throws when overview is missing', async () => {
    const { overview: _dropped, ...noOverview } = VALID_CLAUDE_JSON;
    mockMessagesCreate.mockResolvedValue(makeMockApiResponse(noOverview));
    await expect(generateClaudeGuidance(BASE_CASE as any, 'bad-1')).rejects.toThrow(/overview/);
  });

  it('throws when criticalAlerts is not an array', async () => {
    mockMessagesCreate.mockResolvedValue(
      makeMockApiResponse({ ...VALID_CLAUDE_JSON, criticalAlerts: 'not an array' }),
    );
    await expect(generateClaudeGuidance(BASE_CASE as any, 'bad-2')).rejects.toThrow(/criticalAlerts/);
  });

  it('throws when immediateActions is not an array', async () => {
    mockMessagesCreate.mockResolvedValue(
      makeMockApiResponse({ ...VALID_CLAUDE_JSON, immediateActions: null }),
    );
    await expect(generateClaudeGuidance(BASE_CASE as any, 'bad-3')).rejects.toThrow(/immediateActions/);
  });

  it('throws when an immediateAction item has an invalid urgency value', async () => {
    mockMessagesCreate.mockResolvedValue(
      makeMockApiResponse({
        ...VALID_CLAUDE_JSON,
        immediateActions: [{ action: 'Do something', urgency: 'ASAP' }],
      }),
    );
    await expect(generateClaudeGuidance(BASE_CASE as any, 'bad-4')).rejects.toThrow(/urgency/);
  });

  it('throws when a deadline item has an invalid priority value', async () => {
    mockMessagesCreate.mockResolvedValue(
      makeMockApiResponse({
        ...VALID_CLAUDE_JSON,
        deadlines: [
          { event: 'Hearing', timeframe: '10 days', description: 'Desc', priority: 'SUPER_URGENT' },
        ],
      }),
    );
    await expect(generateClaudeGuidance(BASE_CASE as any, 'bad-5')).rejects.toThrow(/priority/);
  });

  it('throws when the response text is not valid JSON', async () => {
    mockMessagesCreate.mockResolvedValue({
      content: [{ type: 'text', text: 'This is plain prose, not JSON.' }],
      usage: { input_tokens: 100, output_tokens: 50, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 },
    });
    await expect(generateClaudeGuidance(BASE_CASE as any, 'bad-6')).rejects.toThrow();
  });

  it('throws when the Anthropic API call itself fails', async () => {
    mockMessagesCreate.mockRejectedValue(new Error('Network error'));
    await expect(generateClaudeGuidance(BASE_CASE as any, 'bad-7')).rejects.toThrow('Network error');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Fallback path — generateEnhancedGuidance produces the same required field shape
// This mirrors what routes.ts does when generateClaudeGuidance throws:
//   catch (aiError) { guidance = generateEnhancedGuidance(caseData); }
// ─────────────────────────────────────────────────────────────────────────────
describe('generateEnhancedGuidance (rules fallback) — response shape parity', () => {
  const fallbackCase = {
    jurisdiction: 'CA',
    charges: 'driving under the influence',
    caseStage: 'arraignment',
    custodyStatus: 'released',
    hasAttorney: false,
    supervisionStatus: 'none',
    citizenshipStatus: 'citizen',
    hasMinorChildren: false,
    hasProfessionalLicense: false,
    hasHousingAssistance: false,
  };

  it('returns all required array fields as arrays (same fields the dashboard renders)', () => {
    const result = generateEnhancedGuidance(fallbackCase as any);
    for (const field of REQUIRED_ARRAY_FIELDS) {
      expect(Array.isArray((result as any)[field]), `fallback: ${field} should be an array`).toBe(true);
    }
  });

  it('returns a non-empty overview string', () => {
    const result = generateEnhancedGuidance(fallbackCase as any);
    expect(typeof result.overview).toBe('string');
    expect(result.overview.length).toBeGreaterThan(0);
  });

  it('collateralConsequences and uncertainties are arrays (not undefined)', () => {
    const result = generateEnhancedGuidance(fallbackCase as any);
    expect(Array.isArray(result.collateralConsequences)).toBe(true);
    expect(Array.isArray(result.uncertainties)).toBe(true);
  });

  it('immediateActions items each have a non-empty action string and valid urgency', () => {
    const result = generateEnhancedGuidance(fallbackCase as any);
    const validUrgencies = ['urgent', 'high', 'medium', 'low'];
    for (const item of result.immediateActions) {
      expect(typeof item.action).toBe('string');
      expect(item.action.length).toBeGreaterThan(0);
      expect(validUrgencies).toContain(item.urgency);
    }
  });

  it('timeline items have all required fields', () => {
    const result = generateEnhancedGuidance(fallbackCase as any);
    for (const entry of result.timeline) {
      expect(typeof entry.stage).toBe('string');
      expect(typeof entry.description).toBe('string');
      expect(typeof entry.timeframe).toBe('string');
      expect(typeof entry.completed).toBe('boolean');
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Cross-path consistency — AI and fallback both satisfy the same field contract
// ─────────────────────────────────────────────────────────────────────────────
describe('AI path and fallback path share a consistent required field set', () => {
  it('every required dashboard field is present as an array in both paths', async () => {
    mockMessagesCreate.mockResolvedValue(makeMockApiResponse(VALID_CLAUDE_JSON));

    const aiResult = await generateClaudeGuidance(BASE_CASE as any, 'cross-1');
    const fallbackResult = generateEnhancedGuidance({
      ...BASE_CASE,
      charges: 'driving under the influence',
    } as any);

    for (const field of REQUIRED_ARRAY_FIELDS) {
      expect(
        Array.isArray((aiResult as any)[field]),
        `AI path: "${field}" should be an array`,
      ).toBe(true);
      expect(
        Array.isArray((fallbackResult as any)[field]),
        `Fallback path: "${field}" should be an array`,
      ).toBe(true);
    }

    expect(typeof aiResult.overview).toBe('string');
    expect(typeof fallbackResult.overview).toBe('string');
  });
});
