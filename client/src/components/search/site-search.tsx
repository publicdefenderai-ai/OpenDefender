import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Loader2, FileText, Scale, BookOpen, Building, HelpCircle, Shield, Briefcase, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SearchResponse, SearchResult, SearchContentType } from "@shared/search-types";

interface SiteSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TYPE_ICONS: Record<SearchContentType, typeof FileText> = {
  glossary: BookOpen,
  charge: Scale,
  diversion_program: Building,
  expungement: FileText,
  legal_resource: Briefcase,
  court: Building,
  mock_qa: HelpCircle,
  rights_info: Shield,
};

const TYPE_COLORS: Record<SearchContentType, string> = {
  rights_info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  legal_resource: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  expungement: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  diversion_program: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  glossary: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  court: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  mock_qa: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  charge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

const ALL_TYPES: SearchContentType[] = [
  'rights_info', 'legal_resource', 'expungement', 'diversion_program',
  'glossary', 'court', 'mock_qa', 'charge',
];

const PINNED_LAST = new Set<SearchContentType>(['charge', 'mock_qa']);

// Types that appear in the filter chips (main content types users care about)
const FILTER_TYPES: { type: SearchContentType; labelEn: string; labelEs: string; labelZh: string }[] = [
  { type: 'rights_info',       labelEn: 'Rights',     labelEs: 'Derechos',   labelZh: '权利' },
  { type: 'legal_resource',    labelEn: 'Resources',  labelEs: 'Recursos',   labelZh: '资源' },
  { type: 'expungement',       labelEn: 'Records',    labelEs: 'Registros',  labelZh: '记录' },
  { type: 'diversion_program', labelEn: 'Programs',   labelEs: 'Programas',  labelZh: '项目' },
];

const SECTION_LABELS: Record<SearchContentType, { en: string; es: string; zh: string }> = {
  rights_info:       { en: 'Know Your Rights', es: 'Conozca Sus Derechos', zh: '了解您的权利' },
  legal_resource:    { en: 'Resources & Support', es: 'Recursos y Apoyo', zh: '资源与支持' },
  expungement:       { en: 'Record Clearing', es: 'Eliminación de Antecedentes', zh: '记录清除' },
  diversion_program: { en: 'Diversion Programs', es: 'Programas de Diversión', zh: '转移计划' },
  glossary:          { en: 'Legal Terms', es: 'Términos Legales', zh: '法律术语' },
  court:             { en: 'Court Information', es: 'Información del Tribunal', zh: '法院信息' },
  mock_qa:           { en: 'Court Preparation', es: 'Preparación para el Tribunal', zh: '法庭准备' },
  charge:            { en: 'Criminal Charges', es: 'Cargos Criminales', zh: '刑事指控' },
};

const POPULAR_SEARCHES: Record<'en' | 'es' | 'zh', string[]> = {
  en: ['bail', 'expungement', 'on parole', 'miranda rights', 'housing', 'right to attorney', 'probation'],
  es: ['fianza', 'eliminación de antecedentes', 'libertad condicional', 'derechos miranda', 'vivienda', 'derecho a abogado'],
  zh: ['保释', '消除记录', '假释', '米兰达权利', '住房', '律师权利'],
};

// Convert a page URL to a short human-readable breadcrumb path.
// Strips hash fragments, then maps each path segment to a label.
const PATH_LABELS: Record<string, string> = {
  'support': 'Support',
  'rights-info': 'Rights',
  'immigration-guidance': 'Immigration',
  'for-advocates': 'Advocate Tools',
  'friends-family': 'Friends & Family',
  'attorney': 'Attorney Portal',
  'legal-glossary': 'Legal Terms',
  'diversion-programs': 'Diversion Programs',
  'record-expungement': 'Record Clearing',
  'case-timeline': 'Case Timeline',
  'warrants': 'Warrants',
  'legal-aid': 'Legal Aid',
  'court-locator': 'Court Locator',
  'case-guidance': 'Case Guidance',
  'mock-qa': 'Court Prep',
  'statutes': 'Statutes',
  'how-to': 'How It Works',
  'directory': 'Directory',
  'collateral-consequences': 'Collateral Consequences',
  'first-24-hours': 'First 24 Hours',
};

function urlToBreadcrumb(url: string): string {
  const path = url.split('#')[0].split('?')[0];
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return 'Home';
  return parts
    .map(p => PATH_LABELS[p] ?? p.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
    .join(' › ');
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightSnippet(snippet: string, matchedTerms: string[]): React.ReactNode[] {
  const clean = matchedTerms
    .map(t => t.toLowerCase().replace(/[^\w\s]/g, ' ').trim())
    .filter(t => t.length >= 2)
    .sort((a, b) => b.length - a.length);

  if (!clean.length) return [snippet];

  const pattern = new RegExp(
    `(${clean.map(t => escapeRegex(t)).join('|')})`,
    'gi'
  );
  const parts = snippet.split(pattern);

  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <mark
          key={i}
          className="bg-yellow-200/70 dark:bg-yellow-700/40 text-foreground rounded-sm px-0.5 not-italic font-medium"
        >
          {part}
        </mark>
      );
    }
    return part || null;
  });
}

// Find the first heading that contains any matched query term.
// Used to show a "See section: X" callout on relevant results.
function findMatchedHeading(headings: string[] | undefined, matchedTerms: string[]): string | null {
  if (!headings || headings.length === 0) return null;
  const termPatterns = matchedTerms
    .map(t => t.toLowerCase().replace(/[^\w\s]/g, ' ').trim())
    .filter(t => t.length >= 3);
  for (const heading of headings) {
    const lh = heading.toLowerCase();
    if (termPatterns.some(t => lh.includes(t))) return heading;
  }
  return null;
}

export function SiteSearch({ open, onOpenChange }: SiteSearchProps) {
  const { t: _t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [activeFilter, setActiveFilter] = useState<SearchContentType | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const language: 'en' | 'es' | 'zh' = i18n.language?.startsWith('es') ? 'es' : i18n.language?.startsWith('zh') ? 'zh' : 'en';

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setFocusedIndex(-1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!open) {
      setQuery("");
      setFocusedIndex(-1);
      setActiveFilter(null);
    }
  }, [open]);

  const { data, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ['/api/site-search', { q: debouncedQuery, lang: language }],
    queryFn: async () => {
      const params = new URLSearchParams({ q: debouncedQuery, lang: language });
      const res = await fetch(`/api/site-search?${params}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 60000,
  });

  const handleResultClick = useCallback((url: string) => {
    onOpenChange(false);
    setQuery("");
    setLocation(url);
  }, [onOpenChange, setLocation]);

  const getSectionLabel = (type: SearchContentType) => {
    const labels = SECTION_LABELS[type];
    return language === 'es' ? labels.es : language === 'zh' ? labels.zh : labels.en;
  };

  // Build sections sorted by top score, with pinned types last
  const allSections: Array<{ type: SearchContentType; results: SearchResult[] }> = [];
  if (data?.groupedResults) {
    const mainTypes = ALL_TYPES
      .filter(t => !PINNED_LAST.has(t) && (data.groupedResults[t]?.length ?? 0) > 0)
      .sort((a, b) => (data.groupedResults[b][0]?.score ?? 0) - (data.groupedResults[a][0]?.score ?? 0));
    const pinnedTypes = ALL_TYPES.filter(t => PINNED_LAST.has(t) && (data.groupedResults[t]?.length ?? 0) > 0);
    for (const type of [...mainTypes, ...pinnedTypes]) {
      allSections.push({ type, results: data.groupedResults[type] });
    }
  }

  // Apply type filter if one is active
  const sections = activeFilter
    ? allSections.filter(s => s.type === activeFilter || PINNED_LAST.has(s.type))
    : allSections;

  // Only show filter chips when there are 3+ sections with results (filtering is meaningful)
  const availableFilters = FILTER_TYPES.filter(f =>
    (data?.groupedResults[f.type]?.length ?? 0) > 0
  );
  const showFilters = !activeFilter && availableFilters.length >= 3;

  // "Best matches" flat section: top 4 non-charge/non-mock_qa results sorted by raw score,
  // shown only when 2+ different types are represented (otherwise the grouped view is enough).
  // Each result here is removed from its grouped section below to prevent duplication.
  const bestMatches: SearchResult[] = (() => {
    if (!data?.groupedResults) return [];
    const candidates = ALL_TYPES
      .filter(t => !PINNED_LAST.has(t))
      .flatMap(t => data.groupedResults[t] ?? [])
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
    const types = new Set(candidates.map(r => r.document.type));
    return candidates.length >= 3 && types.size >= 2 ? candidates : [];
  })();

  const bestMatchIds = new Set(bestMatches.map(r => r.document.id));

  // Grouped sections with best-match entries removed to avoid duplication
  const groupedSections = sections.map(s => ({
    ...s,
    results: s.results.filter(r => !bestMatchIds.has(r.document.id)),
  })).filter(s => s.results.length > 0);

  const flatResults = [
    ...bestMatches,
    ...groupedSections.flatMap(s => s.results),
  ];
  const totalFlat = flatResults.length;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (focusedIndex >= 0) {
        setFocusedIndex(-1);
        inputRef.current?.focus();
      } else {
        onOpenChange(false);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(focusedIndex + 1, totalFlat - 1);
      setFocusedIndex(next);
      resultRefs.current[next]?.scrollIntoView({ block: 'nearest' });
      resultRefs.current[next]?.focus();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (focusedIndex <= 0) {
        setFocusedIndex(-1);
        inputRef.current?.focus();
      } else {
        const prev = focusedIndex - 1;
        setFocusedIndex(prev);
        resultRefs.current[prev]?.scrollIntoView({ block: 'nearest' });
        resultRefs.current[prev]?.focus();
      }
      return;
    }
    if (e.key === 'Enter' && focusedIndex >= 0) {
      const result = flatResults[focusedIndex];
      if (result) handleResultClick(result.document.url);
    }
  }, [focusedIndex, totalFlat, flatResults, handleResultClick, onOpenChange]);

  useEffect(() => {
    resultRefs.current = resultRefs.current.slice(0, totalFlat);
  }, [totalFlat]);

  const hasResults = allSections.length > 0;
  const showNoResults = debouncedQuery.length >= 2 && !isLoading && !hasResults;

  let globalIdx = 0;

  // Shared result card renderer used in both the best-matches section and grouped sections
  function ResultCard({ result }: { result: SearchResult }) {
    const myIdx = globalIdx++;
    const isFocused = myIdx === focusedIndex;
    const Icon = TYPE_ICONS[result.document.type];
    const colorClass = TYPE_COLORS[result.document.type];

    const title =
      language === 'zh' && result.document.titleZh
        ? result.document.titleZh
        : language === 'es' && result.document.titleEs
        ? result.document.titleEs
        : result.document.title;

    const snippet = result.highlights[0]?.snippet ?? '';
    const breadcrumb = urlToBreadcrumb(result.document.url);
    const matchedHeading = findMatchedHeading(result.document.headings, result.matchedTerms);

    return (
      <button
        key={result.document.id}
        id={`search-result-${myIdx}`}
        role="option"
        aria-selected={isFocused}
        ref={el => { resultRefs.current[myIdx] = el; }}
        onClick={() => handleResultClick(result.document.url)}
        onFocus={() => setFocusedIndex(myIdx)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleResultClick(result.document.url);
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') handleKeyDown(e);
          if (e.key === 'Escape') { setFocusedIndex(-1); inputRef.current?.focus(); }
        }}
        className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors border ${
          isFocused
            ? 'bg-accent border-border ring-1 ring-ring/30'
            : 'border-transparent hover:bg-accent hover:border-border'
        }`}
      >
        <div className="flex items-start gap-2.5">
          <div className={`mt-0.5 p-1 rounded shrink-0 ${colorClass}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-medium text-sm text-foreground truncate">
                {title}
              </span>
              {result.document.jurisdiction && (
                <Badge variant="outline" className="text-xs shrink-0 h-4 px-1">
                  {result.document.jurisdiction}
                </Badge>
              )}
            </div>
            {/* Breadcrumb path */}
            <span className="text-xs text-muted-foreground/50 block mb-0.5 truncate">
              {breadcrumb}
            </span>
            {/* Content snippet with term highlighting */}
            {snippet && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {highlightSnippet(snippet, result.matchedTerms)}
              </p>
            )}
            {/* Section heading callout — only shown when a matched term lives in a specific section */}
            {matchedHeading && !snippet.toLowerCase().includes(matchedHeading.toLowerCase().slice(0, 10)) && (
              <span className="text-xs text-muted-foreground/60 mt-0.5 block truncate">
                {language === 'es' ? 'Ver sección:' : language === 'zh' ? '相关章节：' : 'See section:'}{' '}
                <span className="italic">{matchedHeading}</span>
              </span>
            )}
          </div>
        </div>
      </button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">
            {language === 'es' ? 'Buscar en el sitio' : language === 'zh' ? '搜索网站' : 'Search this site'}
          </DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={
                language === 'es' ? 'Buscar términos legales, recursos, cargos...' :
                language === 'zh' ? '搜索法律术语、资源、指控...' :
                'Search rights, resources, charges, legal terms...'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-10"
              autoComplete="off"
              aria-label={language === 'es' ? 'Buscar' : language === 'zh' ? '搜索' : 'Search'}
              aria-autocomplete="list"
              aria-controls="search-results"
              aria-activedescendant={focusedIndex >= 0 ? `search-result-${focusedIndex}` : undefined}
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => { setQuery(""); setFocusedIndex(-1); inputRef.current?.focus(); }}
                tabIndex={-1}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isLoading && debouncedQuery.length >= 2 && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                {language === 'es' ? 'Buscando...' : language === 'zh' ? '搜索中...' : 'Searching...'}
              </span>
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-destructive">
              {language === 'es' ? 'Error al buscar. Intente de nuevo.' : 'Search failed. Please try again.'}
            </div>
          )}

          {showNoResults && (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {language === 'es'
                  ? `No se encontraron resultados para "${debouncedQuery}"`
                  : language === 'zh'
                  ? `未找到"${debouncedQuery}"的结果`
                  : `No results found for "${debouncedQuery}"`}
              </p>
              {data?.suggestions && data.suggestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'es' ? 'Intente buscar:' : language === 'zh' ? '尝试搜索：' : 'Try searching for:'}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {data.suggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuery(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {hasResults && (
            <ScrollArea className="h-[460px]">
              {/* Meta bar: result count + typo correction notice */}
              <div className="px-4 pt-3 pb-1">
                <p className="text-xs text-muted-foreground">
                  {language === 'es'
                    ? `${data!.totalCount} resultados · ${data!.searchTimeMs}ms`
                    : language === 'zh'
                    ? `${data!.totalCount} 个结果 · ${data!.searchTimeMs}ms`
                    : `${data!.totalCount} results · ${data!.searchTimeMs}ms`}
                </p>
                {data!.correctedQuery && (
                  <p className="text-xs mt-0.5">
                    <span className="text-muted-foreground">
                      {language === 'es' ? 'Mostrando resultados para ' : language === 'zh' ? '显示以下内容的结果：' : 'Showing results for '}
                    </span>
                    <span className="font-semibold text-foreground italic">{data!.correctedQuery}</span>
                  </p>
                )}
              </div>

              {/* Type filter chips — only shown when 3+ types have results and no filter is active */}
              {showFilters && (
                <div className="px-4 pb-2 flex items-center gap-1.5 flex-wrap">
                  <SlidersHorizontal className="h-3 w-3 text-muted-foreground shrink-0" />
                  {availableFilters.map(f => {
                    const label = language === 'es' ? f.labelEs : language === 'zh' ? f.labelZh : f.labelEn;
                    return (
                      <button
                        key={f.type}
                        onClick={() => setActiveFilter(f.type)}
                        className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${TYPE_COLORS[f.type]} border-current/20 hover:opacity-80`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Active filter indicator with clear button */}
              {activeFilter && (
                <div className="px-4 pb-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {language === 'es' ? 'Filtrando:' : language === 'zh' ? '筛选：' : 'Filtering:'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[activeFilter]} border-current/20`}>
                    {(() => {
                      const f = FILTER_TYPES.find(x => x.type === activeFilter);
                      return f ? (language === 'es' ? f.labelEs : language === 'zh' ? f.labelZh : f.labelEn) : activeFilter;
                    })()}
                  </span>
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    {language === 'es' ? 'Ver todos' : language === 'zh' ? '查看全部' : 'Show all'}
                  </button>
                </div>
              )}

              <div id="search-results" role="listbox" className="px-4 pb-4 space-y-5">

                {/* Best matches flat section — top results across all types, no duplicates below */}
                {bestMatches.length > 0 && !activeFilter && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {language === 'es' ? 'Mejores Resultados' : language === 'zh' ? '最佳匹配' : 'Best Matches'}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <div className="space-y-1">
                      {bestMatches.map(result => <ResultCard key={result.document.id} result={result} />)}
                    </div>
                  </div>
                )}

                {/* Grouped sections (best-match entries already removed to avoid duplication) */}
                {groupedSections.map(({ type, results }, sectionIdx) => {
                  const Icon = TYPE_ICONS[type];
                  const colorClass = TYPE_COLORS[type];
                  const isCharges = type === 'charge';

                  return (
                    <div key={type}>
                      {isCharges && sectionIdx > 0 && (
                        <div className="flex items-center gap-2 mb-3 -mx-4 px-4 border-t pt-4">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {language === 'es' ? 'También encontrado' : language === 'zh' ? '相关刑事指控' : 'Also found'}
                          </span>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1 rounded ${colorClass}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {getSectionLabel(type)}
                        </span>
                        <span className="text-xs text-muted-foreground/60">
                          ({results.length})
                        </span>
                      </div>

                      <div className="space-y-1">
                        {results.map(result => <ResultCard key={result.document.id} result={result} />)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {!debouncedQuery && (
            <div className="p-6 text-center">
              <Search className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'es'
                  ? 'Escriba al menos 2 caracteres para buscar'
                  : language === 'zh'
                  ? '输入至少2个字符进行搜索'
                  : 'Type at least 2 characters to search'}
              </p>
              <div className="text-xs text-muted-foreground mb-2">
                {language === 'es' ? 'Búsquedas populares:' : language === 'zh' ? '热门搜索：' : 'Popular searches:'}
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {POPULAR_SEARCHES[language].map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t text-xs text-muted-foreground flex items-center justify-between">
          <span>
            {language === 'es'
              ? 'Flechas para navegar · ESC para cerrar'
              : language === 'zh'
              ? '方向键导航 · ESC关闭'
              : 'Arrow keys to navigate · ESC to close'}
          </span>
          <span>
            {language === 'es' ? 'Solo resultados del sitio' : language === 'zh' ? '仅限站内内容' : 'Site content only'}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SearchButton() {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();
  const language = i18n.language === 'es' ? 'es' : i18n.language?.startsWith('zh') ? 'zh' : 'en';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-9 w-9"
        aria-label={language === 'es' ? 'Buscar en el sitio' : language === 'zh' ? '搜索网站' : 'Search site'}
      >
        <Search className="h-4 w-4" />
      </Button>
      <SiteSearch open={open} onOpenChange={setOpen} />
    </>
  );
}
