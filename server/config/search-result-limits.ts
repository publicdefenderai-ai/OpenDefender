export interface SearchResultLimitPolicy {
  readonly default: number;
  readonly max: number;
}

export const SEARCH_RESULT_LIMITS = {
  chargeOnly: {
    default: 50,
    max: 500,
  },
  mixedContent: {
    default: 20,
    max: 100,
  },
} as const satisfies Record<'chargeOnly' | 'mixedContent', SearchResultLimitPolicy>;

export function getSearchResultLimitPolicy(types?: string): SearchResultLimitPolicy {
  return types === 'charge'
    ? SEARCH_RESULT_LIMITS.chargeOnly
    : SEARCH_RESULT_LIMITS.mixedContent;
}

export function getSearchResultLimitDescription(): string {
  const chargeOnly = SEARCH_RESULT_LIMITS.chargeOnly;
  const mixedContent = SEARCH_RESULT_LIMITS.mixedContent;

  return `Maximum requested results after relevance grouping. Charge-only searches (types=charge) default to ${chargeOnly.default} results and allow up to ${chargeOnly.max} results. Mixed-content searches default to ${mixedContent.default} results and accept a requested limit up to ${mixedContent.max}, but the shared search service returns only its relevance-grouped result set, which may be smaller than requested.`;
}