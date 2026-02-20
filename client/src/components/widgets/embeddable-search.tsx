import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface SearchResult {
  document: {
    id: string;
    type: string;
    title: string;
    url: string;
  };
  score: number;
  highlights: { field: string; snippet: string }[];
}

interface EmbeddableSearchProps {
  baseUrl?: string;
  language?: "en" | "es";
  placeholder?: string;
  maxResults?: number;
  theme?: "light" | "dark";
  compact?: boolean;
}

export function EmbeddableSearch({
  baseUrl = "",
  language = "en",
  placeholder,
  maxResults = 5,
  theme = "light",
  compact = false
}: EmbeddableSearchProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["widget-search", debouncedQuery, language],
    queryFn: async () => {
      if (debouncedQuery.length < 2) return { results: [] };
      const res = await fetch(
        `${baseUrl}/api/v1/search?q=${encodeURIComponent(debouncedQuery)}&lang=${language}&limit=${maxResults}`
      );
      return res.json();
    },
    enabled: debouncedQuery.length >= 2
  });


  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-gray-900" : "bg-white";
  const textClass = isDark ? "text-white" : "text-gray-900";
  const borderClass = isDark ? "border-gray-700" : "border-gray-200";
  const mutedClass = isDark ? "text-gray-400" : "text-gray-500";

  return (
    <div
      className={`pdai-widget ${bgClass} ${textClass} rounded-lg border ${borderClass} shadow-sm ${compact ? "p-2" : "p-4"}`}
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${mutedClass}`} aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || (language === "es" ? "Buscar recursos legales..." : "Search legal resources...")}
          aria-label={language === "es" ? "Buscar recursos legales" : "Search legal resources"}
          className={`w-full pl-10 pr-10 py-2 rounded-md border ${borderClass} ${bgClass} ${textClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${mutedClass} hover:${textClass}`}
            aria-label={language === "es" ? "Borrar búsqueda" : "Clear search"}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {isLoading && debouncedQuery.length >= 2 && (
        <div className={`mt-2 text-sm ${mutedClass}`}>
          {language === "es" ? "Buscando..." : "Searching..."}
        </div>
      )}

      {data?.results?.length > 0 && (
        <ul className={`mt-2 space-y-1 ${compact ? "text-sm" : ""}`}>
          {data.results.map((result: SearchResult) => (
            <li key={result.document.id}>
              <a
                href={`${baseUrl}${result.document.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between p-2 rounded hover:bg-blue-50 ${isDark ? "hover:bg-gray-800" : ""} transition-colors`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{result.document.title}</div>
                  {result.highlights[0] && (
                    <div className={`text-xs ${mutedClass} truncate`}>
                      {result.highlights[0].snippet}
                    </div>
                  )}
                </div>
                <ExternalLink className={`h-3 w-3 ${mutedClass} flex-shrink-0 ml-2`} />
              </a>
            </li>
          ))}
        </ul>
      )}

      {debouncedQuery.length >= 2 && !isLoading && data?.results?.length === 0 && (
        <div className={`mt-2 text-sm ${mutedClass}`}>
          {language === "es" ? "No se encontraron resultados" : "No results found"}
        </div>
      )}

      <div className={`mt-3 pt-2 border-t ${borderClass} flex items-center justify-between`}>
        <span className={`text-xs ${mutedClass}`}>
          Powered by Public Defender AI
        </span>
        <a
          href={`${baseUrl}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          {language === "es" ? "Visitar sitio" : "Visit site"}
        </a>
      </div>
    </div>
  );
}
