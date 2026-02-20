import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  aliases?: string[];
}

interface GlossaryWidgetProps {
  baseUrl?: string;
  language?: "en" | "es";
  theme?: "light" | "dark";
  initialTerms?: number;
  showSearch?: boolean;
}

export function GlossaryWidget({
  baseUrl = "",
  language = "en",
  theme = "light",
  initialTerms = 5,
  showSearch = true
}: GlossaryWidgetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["widget-glossary", language],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/v1/glossary?lang=${language}`);
      return res.json();
    }
  });

  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-gray-900" : "bg-white";
  const textClass = isDark ? "text-white" : "text-gray-900";
  const borderClass = isDark ? "border-gray-700" : "border-gray-200";
  const mutedClass = isDark ? "text-gray-400" : "text-gray-600";
  const hoverClass = isDark ? "hover:bg-gray-800" : "hover:bg-gray-50";

  const terms: GlossaryTerm[] = data?.data || [];
  
  const filteredTerms = searchQuery
    ? terms.filter(t => 
        t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.aliases?.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : terms;

  const displayTerms = showAll ? filteredTerms : filteredTerms.slice(0, initialTerms);

  return (
    <div
      className={`pdai-widget ${bgClass} ${textClass} rounded-lg border ${borderClass} shadow-sm overflow-hidden`}
      style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "400px" }}
    >
      <div className={`px-4 py-3 border-b ${borderClass} flex items-center gap-2`}>
        <BookOpen className="h-5 w-5 text-blue-600" />
        <h3 className="font-bold">
          {language === "es" ? "Glosario Legal" : "Legal Glossary"}
        </h3>
      </div>

      {showSearch && (
        <div className={`px-4 py-2 border-b ${borderClass}`}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "es" ? "Buscar términos..." : "Search terms..."}
            aria-label={language === "es" ? "Buscar términos legales" : "Search legal terms"}
            className={`w-full px-3 py-1.5 text-sm rounded border ${borderClass} ${bgClass} ${textClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      )}

      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className={`p-4 text-sm ${mutedClass}`}>
            {language === "es" ? "Cargando..." : "Loading..."}
          </div>
        ) : displayTerms.length === 0 ? (
          <div className={`p-4 text-sm ${mutedClass}`}>
            {language === "es" ? "No se encontraron términos" : "No terms found"}
          </div>
        ) : (
          <ul>
            {displayTerms.map((term) => (
              <li key={term.id} className={`border-b ${borderClass} last:border-b-0`}>
                <button
                  onClick={() => setExpandedTerm(expandedTerm === term.id ? null : term.id)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between ${hoverClass} transition-colors`}
                >
                  <span className="font-medium">{term.term}</span>
                  {expandedTerm === term.id ? (
                    <ChevronUp className={`h-4 w-4 ${mutedClass}`} />
                  ) : (
                    <ChevronDown className={`h-4 w-4 ${mutedClass}`} />
                  )}
                </button>
                {expandedTerm === term.id && (
                  <div className={`px-4 pb-3 text-sm ${mutedClass}`}>
                    <p>{term.definition}</p>
                    {term.aliases && term.aliases.length > 0 && (
                      <p className="mt-2 text-xs">
                        <span className="font-medium">
                          {language === "es" ? "También conocido como: " : "Also known as: "}
                        </span>
                        {term.aliases.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!showAll && filteredTerms.length > initialTerms && (
        <div className={`px-4 py-2 border-t ${borderClass}`}>
          <button
            onClick={() => setShowAll(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            {language === "es" 
              ? `Ver ${filteredTerms.length - initialTerms} más...` 
              : `Show ${filteredTerms.length - initialTerms} more...`}
          </button>
        </div>
      )}

      <div className={`px-4 py-3 border-t ${borderClass} ${isDark ? "bg-gray-800" : "bg-gray-50"} flex items-center justify-between`}>
        <span className={`text-xs ${mutedClass}`}>
          Powered by Public Defender AI
        </span>
        <a
          href={`${baseUrl}/legal-glossary`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
        >
          {language === "es" ? "Ver todo" : "View all"}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
