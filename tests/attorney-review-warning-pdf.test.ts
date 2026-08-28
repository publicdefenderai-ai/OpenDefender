/**
 * Task #444 — PDF-rendering tests: confirm the attorney-review warning appears
 * in generateGuidancePDF output when explanation.pendingAttorneyReview is true,
 * and is absent otherwise — regardless of dataConfidence level.
 *
 * Tests:
 *  B1  — low-confidence pending entry  → warning text rendered in PDF
 *  B2  — high-confidence pending entry → warning STILL rendered
 *        (the explicit flag is the sole gate; dataConfidence: 'high' does not suppress it)
 *  B3  — entry with pendingAttorneyReview: false → NO warning
 *  B4  — entry with pendingAttorneyReview absent → NO warning
 *  B5  — null explanation (no match)   → NO warning, no crash
 *  B6  — warning appears BEFORE plainSummary in rendered output
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── jsPDF mock ────────────────────────────────────────────────────────────────
// Captures every doc.text() call so we can assert on rendered strings.
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
    setDrawColor: vi.fn(),
    line: vi.fn(),
    // Required for Chinese PDF path (CJK font embedding)
    addFileToVFS: vi.fn(),
    addFont: vi.fn(),
  };
  return { capturedText, mockDoc };
});

vi.mock('jspdf', () => {
  function MockJsPDF(this: any) {
    Object.assign(this, mockDoc);
    (this as any).lastAutoTable = { finalY: 50 };
  }
  return { jsPDF: MockJsPDF };
});

vi.mock('jspdf-autotable', () => ({
  default: vi.fn((doc: any) => {
    doc.lastAutoTable = { finalY: 50 };
  }),
}));

// Control getChargeExplanation per-test to inject synthetic explanations.
const { mockGetChargeExplanation } = vi.hoisted(() => {
  const mockGetChargeExplanation = vi.fn().mockReturnValue(null);
  return { mockGetChargeExplanation };
});

vi.mock('@shared/charge-explanations', () => ({
  getChargeExplanation: mockGetChargeExplanation,
}));

vi.mock('@shared/legal-documents', () => ({
  getDocumentsForPhase: vi.fn().mockReturnValue([]),
  mapCaseStageToPhase: vi.fn().mockReturnValue('arrest'),
}));

// URL stub: must support both `new URL(path)` (used by loadCJKFont font fetching)
// and the static `URL.createObjectURL` / `URL.revokeObjectURL` (used by the PDF
// download path). Using a class instead of a plain object satisfies both.
vi.stubGlobal(
  'URL',
  class MockURL {
    href: string;
    constructor(url: string) { this.href = url; }
    static createObjectURL = vi.fn(() => 'blob:mock');
    static revokeObjectURL = vi.fn();
  },
);
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
vi.stubGlobal('setTimeout', vi.fn());

// Stub fetch so loadCJKFont doesn't hang waiting for real font files.
// Returns a tiny fake ArrayBuffer — the font data is only used by jsPDF.addFont
// which is itself mocked above.
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  })
));

// btoa is available in Node 18+ but stub it in case the version differs
if (typeof globalThis.btoa === 'undefined') {
  vi.stubGlobal('btoa', (s: string) => Buffer.from(s, 'binary').toString('base64'));
}

import { generateGuidancePDF } from '../client/src/lib/pdf-generator';

// ── Helpers ───────────────────────────────────────────────────────────────────

function clearCaptured() {
  capturedText.length = 0;
}

function allRenderedText(): string {
  return capturedText.flat().join('\n');
}

function makeGuidance(chargeName = 'loitering') {
  return {
    sessionId: 'test',
    overview: 'Test',
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
    chargeClassifications: [
      { id: 'ca-credit-card-fraud', name: chargeName, classification: 'misdemeanor', code: '484g' },
    ],
    caseData: {
      jurisdiction: 'CA',
      charges: chargeName,
      caseStage: 'arraignment',
      custodyStatus: 'released',
      hasAttorney: false,
    },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

/** Canonical fragment that must appear in any English pending-review warning */
const WARNING_FRAGMENT_EN = 'not yet been reviewed by a licensed criminal defense attorney';
/** Fragment for Spanish pending-review warning */
const WARNING_FRAGMENT_ES = 'aún no ha sido revisada por un abogado defensor penal autorizado';
/** Fragment for Chinese pending-review warning */
const WARNING_FRAGMENT_ZH = '尚未经持牌刑事辩护律师审查';

describe('B — generateGuidancePDF pending-attorney-review warning', () => {
  beforeEach(() => {
    clearCaptured();
    vi.clearAllMocks();
    mockDoc.splitTextToSize.mockImplementation((t: string) => [t]);
    mockDoc.text.mockImplementation((t: string | string[]) => { capturedText.push(t); });
    mockGetChargeExplanation.mockReturnValue(null);
  });

  const pendingExplanation = {
    slug: 'loitering',
    chargePattern: /loitering/i,
    pendingAttorneyReview: true,
    dataConfidence: 'low' as const,
    plainSummary: 'Loitering plain summary.',
    keyTerms: [],
  };

  const highConfidencePendingExplanation = {
    slug: 'forgery',
    chargePattern: /forgery/i,
    pendingAttorneyReview: true,
    dataConfidence: 'high' as const,
    plainSummary: 'Forgery plain summary.',
    keyTerms: [],
    sources: [{ citation: 'Cal. Penal Code § 470', jurisdiction: 'CA' }],
  };

  // B1: low-confidence pending entry → English warning rendered
  it('B1: low-confidence pending entry triggers English attorney-review warning in PDF', () => {
    mockGetChargeExplanation.mockReturnValue(pendingExplanation);
    generateGuidancePDF(makeGuidance('loitering'), 'en');
    expect(allRenderedText()).toContain(WARNING_FRAGMENT_EN);
  });

  // B2: high-confidence sourced but pending entry → English warning STILL rendered
  // Critical: dataConfidence: 'high' must NOT suppress the warning.
  it('B2: high-confidence-but-pending entry (e.g. forgery) also triggers English warning in PDF', () => {
    mockGetChargeExplanation.mockReturnValue(highConfidencePendingExplanation);
    generateGuidancePDF(makeGuidance('forgery'), 'en');
    expect(allRenderedText()).toContain(WARNING_FRAGMENT_EN);
  });

  // B3: Spanish PDF — pending entry shows Spanish warning
  it('B3: pending entry triggers Spanish attorney-review warning in Spanish PDF', () => {
    mockGetChargeExplanation.mockReturnValue(pendingExplanation);
    generateGuidancePDF(makeGuidance('loitering'), 'es');
    const text = allRenderedText();
    expect(text).toContain(WARNING_FRAGMENT_ES);
    // English text must NOT appear in a Spanish-language PDF
    expect(text).not.toContain(WARNING_FRAGMENT_EN);
  });

  // B4: Chinese PDF — pending entry shows Chinese warning
  it('B4: pending entry triggers Chinese attorney-review warning in Chinese PDF', async () => {
    mockGetChargeExplanation.mockReturnValue(pendingExplanation);
    await generateGuidancePDF(makeGuidance('loitering'), 'zh');
    const text = allRenderedText();
    expect(text).toContain(WARNING_FRAGMENT_ZH);
    // English text must NOT appear in a Chinese-language PDF
    expect(text).not.toContain(WARNING_FRAGMENT_EN);
  });

  // B5: non-pending entry with explicit false → no warning in any language
  it('B5: entry with pendingAttorneyReview: false does NOT trigger warning in PDF', () => {
    mockGetChargeExplanation.mockReturnValue({
      slug: 'robbery',
      chargePattern: /robbery/i,
      pendingAttorneyReview: false,
      dataConfidence: 'medium' as const,
      plainSummary: 'Robbery plain summary.',
      keyTerms: [],
    });
    generateGuidancePDF(makeGuidance('robbery'), 'en');
    const text = allRenderedText();
    expect(text).not.toContain(WARNING_FRAGMENT_EN);
    expect(text).not.toContain(WARNING_FRAGMENT_ES);
  });

  // B6: non-pending entry with no field → no warning
  it('B6: entry without pendingAttorneyReview field does NOT trigger warning in PDF', () => {
    mockGetChargeExplanation.mockReturnValue({
      slug: 'robbery',
      chargePattern: /robbery/i,
      // pendingAttorneyReview intentionally absent
      dataConfidence: 'medium' as const,
      plainSummary: 'Robbery plain summary.',
      keyTerms: [],
    });
    generateGuidancePDF(makeGuidance('robbery'), 'en');
    expect(allRenderedText()).not.toContain(WARNING_FRAGMENT_EN);
  });

  // B7: null explanation → no warning, no crash
  it('B7: null explanation does not render warning and does not throw', () => {
    mockGetChargeExplanation.mockReturnValue(null);
    expect(() => generateGuidancePDF(makeGuidance('unknown charge xyz'), 'en')).not.toThrow();
    expect(allRenderedText()).not.toContain(WARNING_FRAGMENT_EN);
  });

  // B8: warning must precede plainSummary text in output order
  it('B8: attorney-review warning appears before plainSummary in PDF output', () => {
    mockGetChargeExplanation.mockReturnValue({
      slug: 'marijuana-possession',
      chargePattern: /marijuana/i,
      pendingAttorneyReview: true,
      dataConfidence: 'low' as const,
      plainSummary: 'THE UNIQUE PLAIN SUMMARY TEXT FOR THIS TEST.',
      keyTerms: [],
    });

    generateGuidancePDF(makeGuidance('marijuana possession'), 'en');

    const text = allRenderedText();
    const warningPos = text.indexOf(WARNING_FRAGMENT_EN);
    const summaryPos = text.indexOf('THE UNIQUE PLAIN SUMMARY TEXT FOR THIS TEST.');

    expect(warningPos).toBeGreaterThan(-1);
    expect(summaryPos).toBeGreaterThan(-1);
    expect(warningPos).toBeLessThan(summaryPos);
  });
});
