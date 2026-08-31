import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('external validation resilience', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn((_url: string, options: RequestInit) => new Promise((_resolve, reject) => {
      options.signal?.addEventListener('abort', () => {
        const error = new Error('aborted');
        error.name = 'AbortError';
        reject(error);
      }, { once: true });
    })));
  });

  afterEach(() => {
    vi.stubGlobal('fetch', originalFetch);
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('aborts a CourtListener request that exceeds its provider timeout', async () => {
    const { courtListenerService } = await import('../server/services/courtlistener');
    const request = courtListenerService.searchOpinions('private case details');

    const rejected = expect(request).rejects.toThrow('timed out');
    await vi.advanceTimersByTimeAsync(8_000);
    await rejected;

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/search/'),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});

vi.mock('../server/storage', () => ({
  storage: {
    getStatutes: vi.fn().mockResolvedValue([]),
  },
}));

const searchByCitation = vi.fn();
const validateWithCaseLaw = vi.fn();

vi.mock('../server/services/openlaws-client', () => ({
  openLawsClient: { searchByCitation },
}));

vi.mock('../server/services/case-law-validator', () => ({
  caseLawValidator: { validateWithCaseLaw },
}));

describe('fast legal validation', () => {
  it('returns a pending source-enrichment status without calling external providers', async () => {
    vi.useRealTimers();
    const { validateLegalGuidance } = await import('../server/services/legal-accuracy-validator');

    const result = await validateLegalGuidance(
      {
        overview: 'General legal information.',
        criticalAlerts: [],
        immediateActions: [],
        nextSteps: [],
        deadlines: [],
        rights: [],
        warnings: [],
      },
      { jurisdiction: 'CA', charges: ['unknown-charge'], caseStage: 'arrest' },
      { includeExternalSources: false },
    );

    expect(result.sourceEnrichment).toMatchObject({
      status: 'pending',
      providers: ['CourtListener', 'OpenLaws'],
    });
    expect(searchByCitation).not.toHaveBeenCalled();
    expect(validateWithCaseLaw).not.toHaveBeenCalled();
  // The validator dynamically imports the full charge catalog; its cold
  // module load can exceed 15 seconds during post-merge test concurrency even
  // though the validation operation itself completes in milliseconds.
  }, 30_000);
});