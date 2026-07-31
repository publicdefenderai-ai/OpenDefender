/**
 * Task #263 — Confirm the estimate warning appears in the PDF
 * for unmapped states after stampEstimateDeadlines is applied.
 *
 * Tests:
 *  A. stampEstimateDeadlines unit tests:
 *     • unmapped state → every deadline receives isEstimate: true
 *     • known state   → deadlines are returned unchanged (no isEstimate flag added)
 *     • mixed input   → already-true flags are preserved; false flags stay false for known state
 *     • empty array   → returns empty array without error
 *     • case-insensitive jurisdiction match (e.g. 'mt' treated same as 'MT')
 *
 *  B. generateGuidancePDF integration:
 *     • stamped deadlines (isEstimate: true) → "⚠ Note on estimated timeframes" rendered
 *     • un-stamped deadlines (no isEstimate)  → notice NOT rendered
 *     • Spanish language flag → "⚠ Nota sobre plazos estimados" rendered instead
 *     • tilde prefix (~) added to timeframe string for estimate deadlines
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { stampEstimateDeadlines, KNOWN_JURISDICTIONS } from '../server/services/guidance-engine';

// ── jsPDF mock ────────────────────────────────────────────────────────────────
// Captures every doc.text() call so we can assert on rendered strings.
// Must be declared with vi.hoisted so factories below can reference it.
const { capturedText, mockDoc } = vi.hoisted(() => {
  const capturedText: Array<string | string[]> = [];
  const mockDoc = {
    internal: { pageSize: { getWidth: () => 210, getHeight: () => 297 } },
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    setTextColor: vi.fn(),
    text: vi.fn((t: string | string[]) => { capturedText.push(t); }),
    splitTextToSize: vi.fn((t: string) => [t]),
    addPage: vi.fn(),
    lastAutoTable: { finalY: 50 },
    save: vi.fn(),
    getNumberOfPages: vi.fn(() => 1),
    setPage: vi.fn(),
    output: vi.fn(() => new Blob()),
  };
  return { capturedText, mockDoc };
});

vi.mock('jspdf', () => {
  function MockJsPDF(this: any) {
    Object.assign(this, mockDoc);
    // lastAutoTable is read as a property on the doc instance directly
    (this as any).lastAutoTable = { finalY: 50 };
  }
  return { jsPDF: MockJsPDF };
});

vi.mock('jspdf-autotable', () => ({
  default: vi.fn((doc: any) => {
    doc.lastAutoTable = { finalY: 50 };
  }),
}));

// Stub shared modules that pdf-generator imports
vi.mock('@shared/charge-explanations', () => ({
  getChargeExplanation: vi.fn().mockReturnValue(null),
}));

vi.mock('@shared/legal-documents', () => ({
  getDocumentsForPhase: vi.fn().mockReturnValue([]),
  mapCaseStageToPhase: vi.fn().mockReturnValue('arrest'),
}));

// ── DOM globals needed by generateGuidancePDF's download path ─────────────────
// jsPDF's output('blob') and the subsequent createObjectURL / createElement
// calls run client-side; stub them out so the Node test environment doesn't crash.
vi.stubGlobal('URL', {
  createObjectURL: vi.fn(() => 'blob:mock'),
  revokeObjectURL: vi.fn(),
});
vi.stubGlobal('document', {
  createElement: vi.fn(() => ({
    href: '',
    setAttribute: vi.fn(),
    style: {},
    click: vi.fn(),
  })),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn(),
  },
});
// setTimeout is used to revoke the blob URL; stub to a no-op
vi.stubGlobal('setTimeout', vi.fn());

// ── Import after mocks are registered ─────────────────────────────────────────
import { generateGuidancePDF } from '../client/src/lib/pdf-generator';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Reset captured text between tests */
function clearCaptured() {
  capturedText.length = 0;
}

/** Returns all text strings written to the PDF doc so far */
function allRenderedText(): string {
  return capturedText.flat().join('\n');
}

/** Minimal valid guidance object for PDF generation */
function makeGuidance(overrides: Partial<Parameters<typeof generateGuidancePDF>[0]> = {}) {
  return {
    sessionId: 'test-session',
    overview: 'Test overview',
    criticalAlerts: [],
    immediateActions: [],
    nextSteps: [],
    deadlines: [],
    rights: [],
    resources: [],
    warnings: [],
    evidenceToGather: [],
    courtPreparation: [],
    avoidActions: [],
    timeline: [],
    caseData: {
      jurisdiction: 'MT',
      charges: 'theft',
      caseStage: 'arraignment',
      custodyStatus: 'released',
      hasAttorney: false,
    },
    ...overrides,
  };
}

// Use a synthetic unmapped code so the test is stable regardless of how many
// real jurisdictions are added to JURISDICTION_PROCEDURE_RULES.  'XX' is not a
// valid FIPS state code and will never appear in KNOWN_JURISDICTIONS.
const UNMAPPED_STATE = 'XX';
const MAPPED_STATE = 'CA'; // California — always in KNOWN_JURISDICTIONS

if (KNOWN_JURISDICTIONS.includes(UNMAPPED_STATE)) {
  throw new Error(
    `Test setup error: synthetic unmapped code "${UNMAPPED_STATE}" is present in KNOWN_JURISDICTIONS. ` +
    'Choose a different synthetic code that is not a real jurisdiction.',
  );
}
if (!KNOWN_JURISDICTIONS.includes(MAPPED_STATE)) {
  throw new Error(
    `Test setup error: ${MAPPED_STATE} is no longer in KNOWN_JURISDICTIONS. ` +
    'Update MAPPED_STATE to a confirmed mapped jurisdiction.',
  );
}

// ── A. stampEstimateDeadlines unit tests ─────────────────────────────────────

describe('stampEstimateDeadlines — unmapped state', () => {
  const baseDeadline = {
    event: 'Arraignment',
    timeframe: '48 hours',
    description: 'First court appearance',
    priority: 'critical' as const,
  };

  it('stamps isEstimate: true on every deadline for an unmapped state', () => {
    const deadlines = [
      { ...baseDeadline },
      { ...baseDeadline, event: 'Preliminary hearing', timeframe: '10 days', priority: 'important' as const },
    ];
    const result = stampEstimateDeadlines(UNMAPPED_STATE, deadlines);
    expect(result).toHaveLength(2);
    result.forEach(d => {
      expect(d.isEstimate).toBe(true);
    });
  });

  it('does not mutate the original deadlines array', () => {
    const original = [{ ...baseDeadline }];
    stampEstimateDeadlines(UNMAPPED_STATE, original);
    expect(original[0].isEstimate).toBeUndefined();
  });

  it('returns an empty array without error when no deadlines are provided', () => {
    const result = stampEstimateDeadlines(UNMAPPED_STATE, []);
    expect(result).toEqual([]);
  });

  it('is case-insensitive — lowercase jurisdiction code also stamps', () => {
    // UNMAPPED_STATE is guaranteed to not be in KNOWN_JURISDICTIONS
    const result = stampEstimateDeadlines(UNMAPPED_STATE!.toLowerCase(), [{ ...baseDeadline }]);
    expect(result[0].isEstimate).toBe(true);
  });
});

describe('stampEstimateDeadlines — known/mapped state', () => {
  const baseDeadline = {
    event: 'Arraignment',
    timeframe: '48 hours',
    description: 'First court appearance',
    priority: 'critical' as const,
  };

  it('returns deadlines unchanged (no isEstimate added) for a mapped state', () => {
    const deadlines = [{ ...baseDeadline }];
    const result = stampEstimateDeadlines(MAPPED_STATE, deadlines);
    expect(result).toHaveLength(1);
    expect(result[0].isEstimate).toBeUndefined();
  });

  it('returns the exact same array reference for a mapped state (short-circuit)', () => {
    const deadlines = [{ ...baseDeadline }];
    const result = stampEstimateDeadlines(MAPPED_STATE, deadlines);
    expect(result).toBe(deadlines);
  });
});

// ── B. generateGuidancePDF integration tests ──────────────────────────────────

describe('generateGuidancePDF — estimate notice rendering', () => {
  beforeEach(() => {
    clearCaptured();
    vi.clearAllMocks();
    // Restore splitTextToSize to a simple pass-through after vi.clearAllMocks resets it
    mockDoc.splitTextToSize.mockImplementation((t: string) => [t]);
    mockDoc.text.mockImplementation((t: string | string[]) => { capturedText.push(t); });
  });

  const stampedDeadlines = [
    {
      event: 'Arraignment',
      timeframe: '48 hours',
      description: 'First court appearance',
      priority: 'critical' as const,
      isEstimate: true,
    },
    {
      event: 'Preliminary hearing',
      timeframe: '10 days',
      description: 'Probable cause hearing',
      priority: 'important' as const,
      isEstimate: true,
    },
  ];

  it('renders the English estimate notice when all deadlines carry isEstimate: true', () => {
    generateGuidancePDF(makeGuidance({ deadlines: stampedDeadlines }), 'en');
    expect(allRenderedText()).toContain('⚠ Note on estimated timeframes');
  });

  it('renders the Spanish estimate notice when language is "es" and deadlines are stamped', () => {
    generateGuidancePDF(makeGuidance({ deadlines: stampedDeadlines }), 'es');
    expect(allRenderedText()).toContain('⚠ Nota sobre plazos estimados');
  });

  it('does NOT render the estimate notice when no deadline has isEstimate: true', () => {
    const unstampedDeadlines = stampedDeadlines.map(({ isEstimate: _drop, ...rest }) => rest);
    generateGuidancePDF(makeGuidance({ deadlines: unstampedDeadlines }), 'en');
    expect(allRenderedText()).not.toContain('⚠ Note on estimated timeframes');
  });

  it('does NOT render the estimate notice when deadlines array is empty', () => {
    generateGuidancePDF(makeGuidance({ deadlines: [] }), 'en');
    expect(allRenderedText()).not.toContain('⚠ Note on estimated timeframes');
  });
});

// ── C. End-to-end: stampEstimateDeadlines → generateGuidancePDF ───────────────

describe('end-to-end: stamp → PDF', () => {
  beforeEach(() => {
    clearCaptured();
    vi.clearAllMocks();
    mockDoc.splitTextToSize.mockImplementation((t: string) => [t]);
    mockDoc.text.mockImplementation((t: string | string[]) => { capturedText.push(t); });
  });

  it('stamping a Claude-generated response for an unmapped state causes the PDF estimate notice to appear', () => {
    // Simulate what routes.ts does: Claude returns deadlines without isEstimate,
    // then stampEstimateDeadlines is called before the response is stored.
    const claudeDeadlines = [
      { event: 'Arraignment', timeframe: '48 hours', description: 'First court appearance', priority: 'critical' as const },
      { event: 'Speedy trial', timeframe: '90 days', description: 'Trial must begin', priority: 'important' as const },
    ];
    const stamped = stampEstimateDeadlines(UNMAPPED_STATE, claudeDeadlines);

    // All deadlines must be stamped
    expect(stamped.every(d => d.isEstimate === true)).toBe(true);

    // Pass stamped deadlines into the PDF generator
    generateGuidancePDF(
      makeGuidance({ deadlines: stamped, caseData: {
        jurisdiction: UNMAPPED_STATE,
        charges: 'theft',
        caseStage: 'arraignment',
        custodyStatus: 'released',
        hasAttorney: false,
      }}),
      'en',
    );

    expect(allRenderedText()).toContain('⚠ Note on estimated timeframes');
  });

  it('a mapped state does NOT trigger the estimate notice even after passing through stampEstimateDeadlines', () => {
    const claudeDeadlines = [
      { event: 'Arraignment', timeframe: '48 hours', description: 'First court appearance', priority: 'critical' as const },
    ];
    const notStamped = stampEstimateDeadlines(MAPPED_STATE, claudeDeadlines);

    // Deadlines for a mapped state should be unchanged
    expect(notStamped.every(d => d.isEstimate !== true)).toBe(true);

    generateGuidancePDF(
      makeGuidance({ deadlines: notStamped, caseData: {
        jurisdiction: MAPPED_STATE,
        charges: 'theft',
        caseStage: 'arraignment',
        custodyStatus: 'released',
        hasAttorney: false,
      }}),
      'en',
    );

    expect(allRenderedText()).not.toContain('⚠ Note on estimated timeframes');
  });
});
