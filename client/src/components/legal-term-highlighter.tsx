import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { legalGlossaryTerms } from "@/lib/legal-glossary-data";
import { BookOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TermMatch {
  term: string;
  id: string;
  definition: string;
  definitionEs?: string;
  start: number;
  end: number;
}

const spanishDefinitions: Record<string, string> = {
  "arraignment": "Una audiencia judicial donde el acusado es informado formalmente de los cargos en su contra y se le pide que declare (culpable, no culpable, o no lo contesto).",
  "bail": "Dinero o propiedad entregada al tribunal como garantía para asegurar que el acusado se presente al juicio.",
  "bench-warrant": "Una orden judicial emitida por un juez para arrestar a una persona que no se presentó al tribunal.",
  "burden-of-proof": "La obligación de probar una alegación. En casos penales, la fiscalía debe probar la culpabilidad 'más allá de toda duda razonable.'",
  "continuance": "Un aplazamiento de una audiencia o juicio a una fecha posterior. Cualquier parte puede solicitarlo, pero el juez debe aprobarlo.",
  "defendant": "La persona acusada de cometer un delito. Tiene derecho a representación legal y se presume inocente hasta que se demuestre su culpabilidad.",
  "discovery": "El proceso previo al juicio donde ambas partes intercambian evidencia, listas de testigos y otra información relevante.",
  "expungement": "El proceso legal de sellar o destruir antecedentes penales para que no sean accesibles en verificaciones de antecedentes.",
  "felony": "Un delito grave generalmente castigado con prisión por más de un año. Ejemplos: homicidio, robo, tráfico de drogas.",
  "grand-jury": "Un grupo de 16-23 ciudadanos que determinan si hay causa probable para acusar formalmente a una persona de un delito.",
  "habeas-corpus": "Una acción legal que requiere que una persona arrestada sea presentada ante un juez para determinar si su detención es legal.",
  "indictment": "Una acusación formal de un delito grave emitida por un gran jurado, indicando que hay suficiente evidencia para justificar un juicio.",
  "jurisdiction": "La autoridad legal de un tribunal para escuchar y decidir un caso. Puede estar limitada por geografía o materia.",
  "miranda-rights": "Derechos que la policía debe leer a los sospechosos antes de un interrogatorio, incluyendo el derecho a guardar silencio y el derecho a un abogado.",
  "misdemeanor": "Un delito menor generalmente castigado con multas, servicio comunitario, libertad condicional o prisión por menos de un año.",
  "no-contest": "Una declaración donde el acusado ni admite ni niega culpabilidad pero acepta el castigo. No puede usarse en su contra en procedimientos civiles.",
  "parole": "La liberación anticipada supervisada de un preso antes de completar su sentencia completa, sujeta a ciertas condiciones.",
  "plea-bargain": "Un acuerdo entre la fiscalía y la defensa donde el acusado se declara culpable de un cargo reducido a cambio de evitar un juicio.",
  "probable-cause": "Una creencia razonable de que se ha cometido un delito y que una persona específica lo cometió. Requerido para arrestos y registros.",
  "probation": "Un período de supervisión ordenado por el tribunal que se cumple en la comunidad en lugar de prisión.",
  "public-defender": "Un abogado proporcionado por el gobierno sin costo para representar a acusados que no pueden pagar su propio abogado.",
  "reasonable-doubt": "El estándar de evidencia requerido para una condena penal. La evidencia debe ser tan convincente que una persona razonable no dudaría en confiar en ella.",
  "recidivism": "La tendencia de un criminal convicto a reincidir. Se mide como el porcentaje de ex-presos que son arrestados nuevamente.",
  "restitution": "Pago hecho por un acusado para compensar a las víctimas por pérdidas causadas por el delito.",
  "search-warrant": "Una orden judicial que autoriza a la policía a registrar un lugar específico en busca de evidencia de un delito.",
  "statute-of-limitations": "El plazo dentro del cual se deben presentar cargos penales. Varía según la jurisdicción y el tipo de delito.",
  "subpoena": "Un documento legal que ordena a una persona comparecer ante el tribunal o presentar documentos.",
  "suspended-sentence": "Una pena que se impone pero no se ejecuta inmediatamente, a menudo combinada con libertad condicional.",
  "venue": "La ubicación geográfica específica donde se juzga un caso. Generalmente, los casos penales se juzgan en el condado donde ocurrió el presunto delito.",
  "voir-dire": "El proceso de selección de un jurado mediante preguntas a los posibles jurados sobre sus antecedentes y posibles prejuicios.",
};

function buildTermMatcher() {
  const entries: { pattern: string; id: string; term: string }[] = [];

  for (const glossaryTerm of legalGlossaryTerms) {
    entries.push({
      pattern: glossaryTerm.term,
      id: glossaryTerm.id,
      term: glossaryTerm.term,
    });
    if (glossaryTerm.aliases) {
      for (const alias of glossaryTerm.aliases) {
        entries.push({
          pattern: alias,
          id: glossaryTerm.id,
          term: glossaryTerm.term,
        });
      }
    }
  }

  entries.sort((a, b) => b.pattern.length - a.pattern.length);
  return entries;
}

const termEntries = buildTermMatcher();

function findTermsInText(text: string): TermMatch[] {
  const matches: TermMatch[] = [];
  const usedRanges: [number, number][] = [];

  for (const entry of termEntries) {
    const escapedPattern = entry.pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedPattern}\\b`, "gi");
    let match;

    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      const overlaps = usedRanges.some(
        ([usedStart, usedEnd]) => start < usedEnd && end > usedStart
      );

      if (!overlaps) {
        const glossaryTerm = legalGlossaryTerms.find((t) => t.id === entry.id);
        if (glossaryTerm) {
          matches.push({
            term: glossaryTerm.term,
            id: glossaryTerm.id,
            definition: glossaryTerm.definition,
            definitionEs: spanishDefinitions[glossaryTerm.id],
            start,
            end,
          });
          usedRanges.push([start, end]);
        }
        break;
      }
    }
  }

  matches.sort((a, b) => a.start - b.start);
  return matches;
}

function LegalTermPopover({
  term,
  definition,
  definitionEs,
  children,
}: {
  term: string;
  definition: string;
  definitionEs?: string;
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language === "es";
  const displayDefinition = isSpanish && definitionEs ? definitionEs : definition;

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <span
          className="legal-term-highlight"
          role="button"
          tabIndex={0}
          aria-label={`${term}: ${displayDefinition}`}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="legal-term-tooltip max-w-xs p-3 z-[100]"
        sideOffset={6}
      >
        <div className="flex items-start gap-2">
          <BookOpen className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold text-xs text-blue-700 dark:text-blue-300 mb-1">
              {term}
            </p>
            <p className="text-xs leading-relaxed text-popover-foreground">
              {displayDefinition}
            </p>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function LegalTextHighlighter({
  text,
  className,
  as: Component = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "p" | "div" | "li";
}) {
  const matches = useMemo(() => findTermsInText(text), [text]);

  if (matches.length === 0) {
    return <Component className={className}>{text}</Component>;
  }

  const segments: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of matches) {
    if (match.start > lastIndex) {
      segments.push(text.slice(lastIndex, match.start));
    }

    segments.push(
      <LegalTermPopover
        key={`${match.id}-${match.start}`}
        term={match.term}
        definition={match.definition}
        definitionEs={match.definitionEs}
      >
        {text.slice(match.start, match.end)}
      </LegalTermPopover>
    );

    lastIndex = match.end;
  }

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }

  return <Component className={className}>{segments}</Component>;
}

export function LegalHighlightProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TooltipProvider delayDuration={200}>{children}</TooltipProvider>;
}
