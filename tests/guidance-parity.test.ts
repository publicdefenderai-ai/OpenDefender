import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  GUIDANCE_SECTION_ORDER,
  GUIDANCE_SURFACE_TREATMENT,
  normalizeGuidance,
  type GuidanceViewModel,
} from '../shared/guidance-view-model';
import { buildGuidanceChatSummary } from '../shared/guidance-chat-summary';
import { GuidancePrintPlan } from '../client/src/components/legal/guidance-print-plan';
import { renderGuidanceRichText } from '../client/src/components/legal/guidance-rich-text';

const { rendered, mockDoc, mockGetChargeExplanation } = vi.hoisted(() => {
  const rendered: string[] = [];
  const mockDoc = {
    internal: { pageSize: { getWidth: () => 210, getHeight: () => 297 } },
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    setTextColor: vi.fn(),
    setDrawColor: vi.fn(),
    text: vi.fn((text: string | string[]) => rendered.push(Array.isArray(text) ? text.join(' ') : text)),
    splitTextToSize: vi.fn((text: string) => [text]),
    getTextWidth: vi.fn((text: string) => text.length),
    textWithLink: vi.fn((text: string) => { rendered.push(text); }),
    addPage: vi.fn(),
    line: vi.fn(),
    lastAutoTable: { finalY: 50 },
    getNumberOfPages: vi.fn(() => 1),
    setPage: vi.fn(),
    output: vi.fn(() => new Blob()),
  };
  return { rendered, mockDoc, mockGetChargeExplanation: vi.fn(() => null) };
});

vi.mock('jspdf', () => {
  function MockJsPDF(this: any) {
    Object.assign(this, mockDoc);
    this.lastAutoTable = { finalY: 50 };
  }
  return { jsPDF: MockJsPDF };
});

vi.mock('jspdf-autotable', () => ({
  default: vi.fn((doc: any, options: any) => {
    rendered.push(JSON.stringify(options.head ?? []), JSON.stringify(options.body ?? []));
    doc.lastAutoTable = { finalY: 50 };
  }),
}));

vi.mock('@shared/charge-explanations', () => ({ getChargeExplanation: mockGetChargeExplanation }));
vi.mock('@shared/legal-documents', () => ({
  getDocumentsForPhase: vi.fn(() => []),
  mapCaseStageToPhase: vi.fn(() => 'arrest'),
}));

vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() });
vi.stubGlobal('document', {
  createElement: vi.fn(() => ({ href: '', setAttribute: vi.fn(), style: {}, click: vi.fn() })),
  body: { appendChild: vi.fn(), removeChild: vi.fn() },
});
vi.stubGlobal('setTimeout', vi.fn());

import { generateGuidancePDF } from '../client/src/lib/pdf-generator';

function completeGuidance(): GuidanceViewModel {
  return normalizeGuidance({
    sessionId: 'parity-session',
    generatedAt: '2026-08-19T12:00:00.000Z',
    overview: 'PARITY_OVERVIEW',
    criticalAlerts: ['PARITY_ALERT'],
    immediateActions: [{ action: 'PARITY_ACTION', urgency: 'urgent' }],
    nextSteps: ['PARITY_NEXT'],
    deadlines: [{ event: 'PARITY_DEADLINE', timeframe: 'PARITY_TIME', description: 'PARITY_DEADLINE_DESCRIPTION', priority: 'critical' }],
    rights: ['PARITY_RIGHT'],
    resources: [{ type: 'PARITY_RESOURCE', description: 'PARITY_RESOURCE_DESCRIPTION', contact: 'PARITY_CONTACT', hours: 'PARITY_RESOURCE_HOURS', website: 'https://parity.example' }],
    warnings: ['PARITY_WARNING'],
    evidenceToGather: ['PARITY_EVIDENCE'],
    courtPreparation: ['PARITYCOURTPREP'],
    avoidActions: ['PARITY_AVOID'],
    timeline: [{ stage: 'PARITY_STAGE', description: 'PARITY_TIMELINE_DESCRIPTION', timeframe: 'PARITY_STAGE_TIME', completed: false }],
    chargeClassifications: [{ name: 'parity-charge', classification: 'felony', code: '' }],
    collateralConsequences: [{ category: 'other', consequence: 'PARITY_COLLATERAL', timing: 'PARITY_COLLATERAL_TIME', actionNote: 'PARITY_COLLATERAL_ACTION' }],
    mockQA: [{ question: 'PARITY_QUESTION', suggestedResponse: 'PARITY_RESPONSE', explanation: 'PARITY_EXPLANATION' }],
    uncertainties: [{ area: 'PARITY_UNCERTAINTY', note: 'PARITY_UNCERTAINTY_NOTE' }],
    caseData: { jurisdiction: 'CA', charges: 'parity-charge', caseStage: 'arraignment', custodyStatus: 'released', hasAttorney: false },
  });
}

describe('normalized guidance surface parity', () => {
  beforeEach(() => {
    rendered.length = 0;
    vi.clearAllMocks();
    mockGetChargeExplanation.mockReturnValue(null);
    mockDoc.text.mockImplementation((text: string | string[]) => rendered.push(Array.isArray(text) ? text.join(' ') : text));
    mockDoc.splitTextToSize.mockImplementation((text: string) => [text]);
  });

  it('normalizes every list and case-data field to safe defaults', () => {
    const normalized = normalizeGuidance({ overview: 123, immediateActions: null });
    expect(normalized.overview).toBe('');
    for (const field of [
      'criticalAlerts', 'immediateActions', 'nextSteps', 'deadlines', 'rights',
      'resources', 'warnings', 'evidenceToGather', 'courtPreparation',
      'avoidActions', 'timeline', 'chargeClassifications', 'mockQA',
      'collateralConsequences', 'uncertainties',
    ] as const) {
      expect(normalized[field]).toEqual([]);
    }
    expect(normalized.caseData).toEqual({
      jurisdiction: '', charges: '', caseStage: '', custodyStatus: '',
      hasAttorney: false, selectedConcerns: undefined,
    });
  });

  it('uses explicit treatment instead of guessing whether an action is practical', () => {
    const guidance = normalizeGuidance({
      immediateActions: [
        { action: 'UNCLASSIFIED_ACTION', urgency: 'high' },
        { action: 'PRACTICAL_ACTION', urgency: 'low', treatment: 'practical' },
      ],
    });

    expect(guidance.immediateActions).toEqual([
      { action: 'UNCLASSIFIED_ACTION', urgency: 'high', treatment: 'legal-information' },
      { action: 'PRACTICAL_ACTION', urgency: 'low', treatment: 'practical' },
    ]);
  });

  it('documents treatment for every canonical section on all four surfaces', () => {
    expect(Object.keys(GUIDANCE_SURFACE_TREATMENT)).toEqual([...GUIDANCE_SECTION_ORDER]);
    for (const section of GUIDANCE_SECTION_ORDER) {
      expect(GUIDANCE_SURFACE_TREATMENT[section]).toEqual({
        dashboard: 'shown', chat: 'shown', pdf: 'shown', print: 'shown',
      });
    }
  });

  it('chat includes every safety-critical value in canonical order', () => {
    const summary = buildGuidanceChatSummary(completeGuidance());
    const safetyValues = ['PARITY_ALERT', 'PARITY_ACTION', 'PARITY_DEADLINE', 'PARITY_WARNING', 'PARITY_AVOID'];
    safetyValues.forEach(value => expect(summary).toContain(value));
    [
      'PARITY_COLLATERAL_ACTION', 'PARITY_EXPLANATION',
      'PARITY_RESOURCE_HOURS', 'https://parity.example',
    ].forEach(value => expect(summary).toContain(value));

    const orderedValues = [
      'PARITY_ALERT', 'PARITY_OVERVIEW', 'parity-charge', 'PARITY_ACTION',
      'PARITY_STAGE', 'PARITY_DEADLINE', 'PARITY_RIGHT', 'PARITY_NEXT',
      'PARITY_EVIDENCE', 'PARITY_WARNING', 'PARITYCOURTPREP',
      'PARITY_COLLATERAL', 'PARITY_QUESTION', 'PARITY_AVOID',
      'PARITY_UNCERTAINTY', 'PARITY_RESOURCE',
    ];
    let previous = -1;
    for (const value of orderedValues) {
      const position = summary.toLowerCase().indexOf(value.toLowerCase());
      expect(position, `${value} missing or out of order`).toBeGreaterThan(previous);
      previous = position;
    }
  });

  it('keeps explicitly practical actions distinct from case information in chat and print', () => {
    const guidance = normalizeGuidance({
      ...completeGuidance(),
      immediateActions: [
        { action: 'PRACTICAL_ACTION', urgency: 'low', treatment: 'practical' },
        { action: 'LEGAL_INFORMATION_ACTION', urgency: 'high' },
      ],
    });

    const chat = buildGuidanceChatSummary(guidance);
    expect(chat).toContain('Practical steps you can take');
    expect(chat).toContain('Case information to review');
    expect(chat).toContain('PRACTICAL_ACTION');
    expect(chat).toContain('LEGAL_INFORMATION_ACTION');

    const print = renderToStaticMarkup(React.createElement(GuidancePrintPlan, { guidance }));
    expect(print).toContain('Practical steps you can take');
    expect(print).toContain('Case information to review');
    expect(print).toContain('not personal instructions');
  });

  it('renders the shared practical starter plan and support destinations in chat, print, and PDF', async () => {
    const guidance = completeGuidance();
    expect(guidance.practicalStarterSteps).toEqual(['organize', 'calendar', 'everydaySupport']);
    expect(guidance.practicalSupportLinks.map(link => link.href)).toEqual(['/resources', '/court-locator', '/support']);

    const chat = buildGuidanceChatSummary(guidance);
    expect(chat).toContain('Put your court papers');
    expect(chat).toContain('Find legal help');
    expect(chat).toContain('Get life and family support');

    const print = renderToStaticMarkup(React.createElement(GuidancePrintPlan, { guidance }));
    expect(print).toContain('Put your court papers');
    expect(print).toContain('href="/resources"');
    expect(print).toContain('href="/support"');

    rendered.length = 0;
    await generateGuidancePDF(guidance, 'en');
    const pdf = rendered.join('\n');
    expect(pdf).toContain('Put your court papers');
    expect(pdf).toContain('Find legal help');
    expect(pdf).toContain('Get life and family support');
  });

  it('keeps the shared practical PDF plan when generated immediate actions are empty', async () => {
    const guidance = normalizeGuidance({
      ...completeGuidance(),
      immediateActions: [],
    });

    rendered.length = 0;
    await generateGuidancePDF(guidance, 'en');
    const pdf = rendered.join('\n');
    expect(pdf).toContain('Put your court papers');
    expect(pdf).toContain('Find legal help');
    expect(pdf).toContain('Find your court');
    expect(pdf).toContain('Get life and family support');
  });

  it('dashboard exposes a stable marker for every canonical section', () => {
    const dashboard = fs.readFileSync('client/src/components/legal/guidance-dashboard.tsx', 'utf8');
    for (const section of GUIDANCE_SECTION_ORDER) {
      expect(dashboard).toContain(`data-guidance-section="${section}"`);
    }
  });

  it('renders a complete print-only plan independent of accordion state', () => {
    const markup = renderToStaticMarkup(React.createElement(GuidancePrintPlan, { guidance: completeGuidance() }));
    let previous = -1;
    for (const section of GUIDANCE_SECTION_ORDER) {
      const position = markup.indexOf(`data-guidance-section="${section}"`);
      expect(position, `${section} missing or out of order in print plan`).toBeGreaterThan(previous);
      previous = position;
    }
    [
      'PARITY_COLLATERAL_ACTION', 'PARITY_RESPONSE', 'PARITY_EXPLANATION',
      'PARITY_RESOURCE_HOURS', 'https://parity.example',
    ].forEach(value => expect(markup).toContain(value));
    const css = fs.readFileSync('client/src/index.css', 'utf8');
    expect(css).toContain('.guidance-print-plan');
  });

  it('never prints an internal charge code unless it has a verified citation', () => {
    const guidance = normalizeGuidance({
      ...completeGuidance(),
      chargeClassifications: [{
        name: 'Unverified charge',
        classification: 'misdemeanor',
        code: 'UNVERIFIED_INTERNAL_CODE',
        verifiedCitation: null,
      }],
    });
    const markup = renderToStaticMarkup(React.createElement(GuidancePrintPlan, { guidance }));
    expect(markup).toContain('Unverified charge');
    expect(markup).not.toContain('UNVERIFIED_INTERNAL_CODE');
  });

  it('normalizes Claude title-based charges for chat and PDF without exposing internal codes', async () => {
    const guidance = normalizeGuidance({
      ...completeGuidance(),
      chargeClassifications: [{
        title: 'Claude Title Charge',
        classification: 'felony',
        code: 'CLAUDE_INTERNAL_CODE',
        verifiedCitation: null,
      }],
    });

    expect(guidance.chargeClassifications).toHaveLength(1);
    expect(guidance.chargeClassifications[0].name).toBe('Claude Title Charge');

    const chat = buildGuidanceChatSummary(guidance);
    expect(chat).toContain('Claude Title Charge: felony');
    expect(chat).not.toContain('CLAUDE_INTERNAL_CODE');

    rendered.length = 0;
    await generateGuidancePDF(guidance, 'en');
    const pdf = rendered.join('\n');
    expect(pdf).toContain('Claude title charge');
    expect(pdf).not.toContain('CLAUDE_INTERNAL_CODE');
  });

  it('exports every normalized case-plan field through the PDF download path', async () => {
    await generateGuidancePDF(completeGuidance(), 'en');
    const output = rendered.join('\n');
    [
      'PARITY_ALERT', 'PARITY_OVERVIEW', 'Parity Charge', 'PARITY_ACTION',
      'PARITY_STAGE', 'PARITY_DEADLINE', 'PARITY_RIGHT', 'PARITY_NEXT',
      'PARITY_EVIDENCE', 'PARITY_WARNING', 'PARITYCOURTPREP',
      'PARITY_COLLATERAL', 'PARITY_COLLATERAL_ACTION',
      'PARITY_QUESTION', 'PARITY_RESPONSE', 'PARITY_EXPLANATION',
      'PARITY_AVOID', 'PARITY_UNCERTAINTY', 'PARITY_RESOURCE',
      'PARITY_RESOURCE_HOURS', 'https://parity.example',
    ].forEach(value => expect(output).toContain(value));
    expect(output).toContain('General educational information; not legal advice.');
    expect(output).toContain('https://opendefender.ai/disclaimers');
    expect(output).toContain('https://opendefender.ai/data-sources');
    expect(mockDoc.textWithLink).toHaveBeenCalledWith(
      'https://opendefender.ai/disclaimers',
      expect.any(Number),
      expect.any(Number),
      { url: 'https://opendefender.ai/disclaimers' },
    );
    expect(mockDoc.textWithLink).toHaveBeenCalledWith(
      'https://opendefender.ai/data-sources',
      expect.any(Number),
      expect.any(Number),
      { url: 'https://opendefender.ai/data-sources' },
    );
    expect(output).toContain('Page 1 of 1');
    expect(mockDoc.output).toHaveBeenCalledWith('blob');
  });

  it('prints the state-coverage limitation when a charge has no verified overlay', async () => {
    mockGetChargeExplanation.mockReturnValue({
      plainSummary: 'Neutral charge summary.',
      degreeContext: 'Neutral degree context.',
      keyTerms: [],
      jurisdictionDetailMissing: true,
    } as any);

    await generateGuidancePDF(completeGuidance(), 'en');
    expect(rendered.join('\n')).toContain('State-specific detail not yet verified');
  });

  it('renders generated Markdown in browser print and removes it from PDF text', async () => {
    const guidance = normalizeGuidance({
      ...completeGuidance(),
      overview: 'Review **this warning** and [legal help](/resources).',
      rights: ['**Right to counsel** before answering questions.'],
      warnings: ['**Do not discuss your case** on social media.'],
      evidenceToGather: ['Preserve [case records](/support/evidence) for your attorney.'],
    });

    const markup = renderToStaticMarkup(React.createElement(GuidancePrintPlan, { guidance }));
    expect(markup).toContain('<strong class="font-semibold">this warning</strong>');
    expect(markup).toContain('href="/resources"');
    expect(markup).not.toContain('**');
    expect(renderToStaticMarkup(React.createElement('p', null, renderGuidanceRichText('**Bold** and *italic*'))))
      .toContain('<em>italic</em>');

    rendered.length = 0;
    await generateGuidancePDF(guidance, 'en');
    const pdf = rendered.join('\n');
    expect(pdf).toContain('Review this warning and legal help (opendefender.ai/resources).');
    expect(pdf).toContain('Right to counsel');
    expect(pdf).not.toContain('**');
    expect(pdf).not.toContain('[case records](/support/evidence)');
  });

  it('deduplicates repeated warnings while preserving distinct local subjects', () => {
    const guidance = normalizeGuidance({
      ...completeGuidance(),
      warnings: [
        'Court rules and deadlines vary by county. Verify all deadlines with your local court.',
        'Court rules and deadlines vary by county. Verify all deadlines with your local court.',
        'Bail schedules vary by county and should be confirmed before arraignment.',
        'A separate DMV administrative deadline may apply and should be confirmed with the DMV.',
      ],
      uncertainties: [
        {
          area: 'Jurisdiction-Specific Deadlines',
          note: 'Specific court deadlines and procedures for this state were not available. The timeframes shown are general estimates. Verify all deadlines with a local attorney.',
        },
        {
          area: 'County Bail Amounts',
          note: 'Bail schedules vary by county and may differ from statewide figures. Confirm the amount with your attorney.',
        },
        {
          area: 'County Sentencing Practices',
          note: 'Local sentencing practices vary by county. Ask an attorney about the practices in your court.',
        },
      ],
    });

    expect(guidance.warnings).toEqual([
      'Court rules and deadlines vary by county. Verify all deadlines with your local court.',
      'Bail schedules vary by county and should be confirmed before arraignment.',
      'A separate DMV administrative deadline may apply and should be confirmed with the DMV.',
    ]);
    expect(guidance.uncertainties).toHaveLength(3);
    expect(guidance.uncertainties.map(item => item.area)).toEqual([
      'Jurisdiction-Specific Deadlines',
      'County Bail Amounts',
      'County Sentencing Practices',
    ]);
  });
});
