/**
 * Task #311 — Confirm the PDF charge line shows the citation for verified
 * charges and nothing for unverified ones.
 *
 * Tests (all target lines 444–451 of client/src/lib/pdf-generator.ts):
 *
 *  A. verifiedCitation populated →
 *     row reads "Murder in the First Degree (Ala. Code § 13A-6-2) - FELONY"
 *
 *  B. verifiedCitation is null →
 *     row reads "Murder in the First Degree - FELONY" (no parenthetical)
 *
 *  C. verifiedCitation is absent (field omitted entirely) →
 *     row reads "Murder in the First Degree - FELONY" (no parenthetical)
 *
 *  D. Multiple charges — first charge carries the "Charges" label;
 *     subsequent charges carry an empty label.
 *
 *  E. Mixed charges — verified and unverified in the same PDF each
 *     render correctly.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── autoTable spy ─────────────────────────────────────────────────────────────
// We capture the `body` rows passed to autoTable so we can assert on the
// exact charge-summary text without parsing rendered PDF primitives.

const { capturedAutoTableBodies, mockDoc } = vi.hoisted(() => {
  const capturedAutoTableBodies: Array<Array<Array<string>>> = [];
  const mockDoc = {
    internal: { pageSize: { getWidth: () => 210, getHeight: () => 297 } },
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    setTextColor: vi.fn(),
    text: vi.fn(),
    splitTextToSize: vi.fn((t: string) => [t]),
    addPage: vi.fn(),
    lastAutoTable: { finalY: 50 },
    save: vi.fn(),
    getNumberOfPages: vi.fn(() => 1),
    setPage: vi.fn(),
    output: vi.fn(() => new Blob()),
    setDrawColor: vi.fn(),
    line: vi.fn(),
  };
  return { capturedAutoTableBodies, mockDoc };
});

vi.mock('jspdf', () => {
  function MockJsPDF(this: any) {
    Object.assign(this, mockDoc);
    (this as any).lastAutoTable = { finalY: 50 };
  }
  return { jsPDF: MockJsPDF };
});

vi.mock('jspdf-autotable', () => ({
  default: vi.fn((doc: any, opts: any) => {
    // Capture the body rows so tests can inspect them
    if (opts?.body) {
      capturedAutoTableBodies.push(opts.body);
    }
    doc.lastAutoTable = { finalY: 50 };
  }),
}));

vi.mock('@shared/charge-explanations', () => ({
  getChargeExplanation: vi.fn().mockReturnValue(null),
}));

vi.mock('@shared/legal-documents', () => ({
  getDocumentsForPhase: vi.fn().mockReturnValue([]),
  mapCaseStageToPhase: vi.fn().mockReturnValue('arrest'),
}));

// ── DOM globals required by the PDF download path ────────────────────────────
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
vi.stubGlobal('setTimeout', vi.fn());

// ── Import after mocks ────────────────────────────────────────────────────────
import { generateGuidancePDF } from '../client/src/lib/pdf-generator';

// ── Helpers ───────────────────────────────────────────────────────────────────

function clearCaptured() {
  capturedAutoTableBodies.length = 0;
}

/** Flattens all autoTable body cells into a single searchable string */
function allTableText(): string {
  return capturedAutoTableBodies.flat(2).join('\n');
}

/** Returns the first charge-summary row text (the cell after the "Charges" label) */
function chargeRows(): string[] {
  // The case-summary table is the first autoTable call.
  // Rows are [labelCell, valueCell]; we want the valueCell for charge rows.
  const firstTable = capturedAutoTableBodies[0] ?? [];
  return firstTable
    .filter(row => row[0] === 'Charges' || row[0] === '')
    .map(row => row[1]);
}

/** Minimal valid guidance object */
function makeGuidance(
  chargeClassifications?: Array<{
    name: string;
    classification: string;
    code: string;
    verifiedCitation?: string | null;
  }>,
) {
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
    chargeClassifications,
    caseData: {
      jurisdiction: 'AL',
      charges: 'murder-first-degree',
      caseStage: 'arraignment',
      custodyStatus: 'detained',
      hasAttorney: false,
    },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('generateGuidancePDF — charge summary row citation logic', () => {
  beforeEach(() => {
    clearCaptured();
    vi.clearAllMocks();
    mockDoc.splitTextToSize.mockImplementation((t: string) => [t]);
  });

  // ── A. verifiedCitation populated ─────────────────────────────────────────

  it('A: shows the citation parenthetical when verifiedCitation is populated', () => {
    generateGuidancePDF(
      makeGuidance([
        {
          name: 'murder-in-the-first-degree',
          classification: 'felony',
          code: 'Ala. Code § 13A-6-2',
          verifiedCitation: 'Ala. Code § 13A-6-2',
        },
      ]),
      'en',
    );

    const rows = chargeRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toBe(
      'Murder In The First Degree (Ala. Code § 13A-6-2) - FELONY',
    );
  });

  // ── B. verifiedCitation is explicitly null ─────────────────────────────────

  it('B: omits the citation parenthetical when verifiedCitation is null', () => {
    generateGuidancePDF(
      makeGuidance([
        {
          name: 'murder-in-the-first-degree',
          classification: 'felony',
          code: 'Ala. Code § 13A-6-2',
          verifiedCitation: null,
        },
      ]),
      'en',
    );

    const rows = chargeRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toBe('Murder In The First Degree - FELONY');
    expect(rows[0]).not.toContain('(');
  });

  // ── C. verifiedCitation field omitted entirely ─────────────────────────────

  it('C: omits the citation parenthetical when verifiedCitation is absent', () => {
    generateGuidancePDF(
      makeGuidance([
        {
          name: 'murder-in-the-first-degree',
          classification: 'felony',
          code: 'Ala. Code § 13A-6-2',
          // verifiedCitation intentionally omitted
        },
      ]),
      'en',
    );

    const rows = chargeRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toBe('Murder In The First Degree - FELONY');
    expect(rows[0]).not.toContain('(');
  });

  // ── D. Multiple charges — label appears only on the first row ──────────────

  it('D: first charge row carries the "Charges" label; subsequent rows carry an empty label', () => {
    generateGuidancePDF(
      makeGuidance([
        {
          name: 'murder-in-the-first-degree',
          classification: 'felony',
          code: 'Ala. Code § 13A-6-2',
          verifiedCitation: 'Ala. Code § 13A-6-2',
        },
        {
          name: 'assault-second-degree',
          classification: 'misdemeanor',
          code: 'Ala. Code § 13A-6-21',
          verifiedCitation: 'Ala. Code § 13A-6-21',
        },
      ]),
      'en',
    );

    const firstTable = capturedAutoTableBodies[0] ?? [];
    // Find the rows that belong to charge entries
    const chargeRowsRaw = firstTable.filter(
      row => row[0] === 'Charges' || row[0] === '',
    );

    expect(chargeRowsRaw).toHaveLength(2);
    expect(chargeRowsRaw[0][0]).toBe('Charges');
    expect(chargeRowsRaw[1][0]).toBe('');
  });

  // ── E. Mixed verified / unverified charges in the same PDF ─────────────────

  it('E: verified charge shows citation; unverified charge in same PDF does not', () => {
    generateGuidancePDF(
      makeGuidance([
        {
          name: 'murder-in-the-first-degree',
          classification: 'felony',
          code: 'Ala. Code § 13A-6-2',
          verifiedCitation: 'Ala. Code § 13A-6-2',
        },
        {
          name: 'assault-second-degree',
          classification: 'misdemeanor',
          code: 'Ala. Code § 13A-6-21',
          verifiedCitation: null,
        },
      ]),
      'en',
    );

    const rows = chargeRows();
    expect(rows).toHaveLength(2);
    // First charge — verified
    expect(rows[0]).toBe(
      'Murder In The First Degree (Ala. Code § 13A-6-2) - FELONY',
    );
    // Second charge — unverified
    expect(rows[1]).toBe('Assault Second Degree - MISDEMEANOR');
    expect(rows[1]).not.toContain('(');
  });
});
