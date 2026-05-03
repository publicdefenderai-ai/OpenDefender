import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Loader2, FileText, Scale, BookOpen, Building, AlertCircle, HelpCircle, Shield, Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SearchResponse, SearchResult, SearchContentType } from "@shared/search-types";
import { CONTENT_TYPE_LABELS } from "@shared/search-types";

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

// Stable fallback type order — actual display order is score-driven (see sections build below)
const ALL_TYPES: SearchContentType[] = [
  'rights_info', 'legal_resource', 'expungement', 'diversion_program',
  'glossary', 'court', 'mock_qa', 'charge',
];

// These types always appear last regardless of score
const PINNED_LAST = new Set<SearchContentType>(['charge', 'mock_qa']);

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

export function SiteSearch({ open, onOpenChange }: SiteSearchProps) {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const language = i18n.language?.startsWith('es') ? 'es' : i18n.language?.startsWith('zh') ? 'zh' : 'en';

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
    }
  }, [onOpenChange]);

  const getSectionLabel = (type: SearchContentType) => {
    const labels = SECTION_LABELS[type];
    return language === 'es' ? labels.es : language === 'zh' ? labels.zh : labels.en;
  };

  // Build sections ordered by each group's top result score — most relevant section first.
  // Charges and court-prep are always pinned last so the app never feels like a charge lookup tool.
  const sections: Array<{ type: SearchContentType; results: SearchResult[] }> = [];
  if (data?.groupedResults) {
    const mainTypes = ALL_TYPES
      .filter(t => !PINNED_LAST.has(t) && (data.groupedResults[t]?.length ?? 0) > 0)
      .sort((a, b) => (data.groupedResults[b][0]?.score ?? 0) - (data.groupedResults[a][0]?.score ?? 0));
    const pinnedTypes = ALL_TYPES.filter(t => PINNED_LAST.has(t) && (data.groupedResults[t]?.length ?? 0) > 0);
    for (const type of [...mainTypes, ...pinnedTypes]) {
      sections.push({ type, results: data.groupedResults[type] });
    }
  }

  const hasResults = sections.length > 0;
  const showNoResults = debouncedQuery.length >= 2 && !isLoading && !hasResults;

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
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setQuery("")}
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
              <div className="px-4 pt-3 pb-2">
                <p className="text-xs text-muted-foreground">
                  {language === 'es'
                    ? `${data!.totalCount} resultados · ${data!.searchTimeMs}ms`
                    : language === 'zh'
                    ? `${data!.totalCount} 个结果 · ${data!.searchTimeMs}ms`
                    : `${data!.totalCount} results · ${data!.searchTimeMs}ms`}
                </p>
              </div>

              <div className="px-4 pb-4 space-y-5">
                {sections.map(({ type, results }, sectionIdx) => {
                  const Icon = TYPE_ICONS[type];
                  const colorClass = TYPE_COLORS[type];
                  const isCharges = type === 'charge';

                  return (
                    <div key={type}>
                      {/* Section divider before charges */}
                      {isCharges && sectionIdx > 0 && (
                        <div className="flex items-center gap-2 mb-3 -mx-4 px-4 border-t pt-4">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {language === 'es' ? 'También encontrado' : language === 'zh' ? '相关刑事指控' : 'Also found'}
                          </span>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                      )}

                      {/* Section heading */}
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

                      {/* Results in this section */}
                      <div className="space-y-1">
                        {results.map((result) => {
                          const title =
                            language === 'zh' && result.document.titleZh
                              ? result.document.titleZh
                              : language === 'es' && result.document.titleEs
                              ? result.document.titleEs
                              : result.document.title;

                          return (
                            <button
                              key={result.document.id}
                              onClick={() => handleResultClick(result.document.url)}
                              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-accent transition-colors border border-transparent hover:border-border"
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
                                  {result.highlights[0] && (
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                      {result.highlights[0].snippet}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
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
                {['bail', 'property', 'expungement', 'miranda rights', 'housing', 'fines', 'DUI'].map((term) => (
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
            {language === 'es' ? 'Presione ESC para cerrar' : language === 'zh' ? '按ESC关闭' : 'Press ESC to close'}
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
