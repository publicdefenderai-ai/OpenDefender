import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Loader2, FileText, Scale, BookOpen, Building, AlertCircle, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SearchResponse, SearchContentType } from "@shared/search-types";
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
  legal_resource: FileText,
  court: Building,
  mock_qa: HelpCircle,
  rights_info: AlertCircle,
};

export function SiteSearch({ open, onOpenChange }: SiteSearchProps) {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const language = i18n.language === 'es' ? 'es' : 'en';

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

  const getTypeLabel = (type: SearchContentType) => {
    const labels = CONTENT_TYPE_LABELS[type];
    return language === 'es' ? labels.es : labels.en;
  };

  const hasResults = data && data.results && data.results.length > 0;
  const showNoResults = debouncedQuery.length >= 2 && !isLoading && !hasResults;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">
            {language === 'es' ? 'Buscar en el sitio' : 'Search this site'}
          </DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={language === 'es' ? 'Buscar términos legales, cargos, recursos...' : 'Search legal terms, charges, resources...'}
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
                {language === 'es' ? 'Buscando...' : 'Searching...'}
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
                  : `No results found for "${debouncedQuery}"`}
              </p>
              {data?.suggestions && data.suggestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'es' ? 'Intente buscar:' : 'Try searching for:'}
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
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-2">
                <p className="text-xs text-muted-foreground mb-3">
                  {language === 'es' 
                    ? `${data.totalCount} resultados en ${data.searchTimeMs}ms`
                    : `${data.totalCount} results in ${data.searchTimeMs}ms`}
                </p>
                
                {data.results.map((result) => {
                  const Icon = TYPE_ICONS[result.document.type];
                  const title = language === 'es' && result.document.titleEs 
                    ? result.document.titleEs 
                    : result.document.title;
                  
                  return (
                    <button
                      key={result.document.id}
                      onClick={() => handleResultClick(result.document.url)}
                      className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors border border-transparent hover:border-border"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 rounded bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground truncate">
                              {title}
                            </span>
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {getTypeLabel(result.document.type)}
                            </Badge>
                            {result.document.jurisdiction && (
                              <Badge variant="outline" className="text-xs shrink-0">
                                {result.document.jurisdiction}
                              </Badge>
                            )}
                          </div>
                          {result.highlights[0] && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {result.highlights[0].snippet}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {!debouncedQuery && (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {language === 'es' 
                  ? 'Escriba al menos 2 caracteres para buscar'
                  : 'Type at least 2 characters to search'}
              </p>
              <div className="mt-4 text-xs text-muted-foreground">
                <p>{language === 'es' ? 'Búsquedas populares:' : 'Popular searches:'}</p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {['bail', 'expungement', 'miranda rights', 'DUI'].map((term) => (
                    <Button
                      key={term}
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setQuery(term)}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t text-xs text-muted-foreground flex items-center justify-between">
          <span>
            {language === 'es' ? 'Presione ESC para cerrar' : 'Press ESC to close'}
          </span>
          <span>
            {language === 'es' ? 'Solo resultados del sitio' : 'Site content only'}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SearchButton() {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();
  const language = i18n.language === 'es' ? 'es' : 'en';

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
        aria-label={language === 'es' ? 'Buscar en el sitio' : 'Search site'}
      >
        <Search className="h-4 w-4" />
      </Button>
      <SiteSearch open={open} onOpenChange={setOpen} />
    </>
  );
}
