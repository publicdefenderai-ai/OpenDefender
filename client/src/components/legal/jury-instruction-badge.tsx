import { BookOpen, ExternalLink, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface JuryInstructionBadgeProps {
  instructionRef: string;
  instructionUrl?: string;
  instructionPaywall?: string;
  chargeId?: string;
  dataTestIdPrefix?: string;
  onLinkClick?: (e: React.MouseEvent) => void;
  variant?: "default" | "pill";
  label?: string;
  tooltipText?: string;
  tooltipAriaLabel?: string;
  className?: string;
}

/**
 * Shared jury instruction badge used across charge cards and the embeddable widget.
 *
 * variant="default" — indigo inline layout (guidance-dashboard, qa-flow, charge-selector)
 * variant="pill"    — compact blue pill (embeddable-search widget)
 */
export function JuryInstructionBadge({
  instructionRef,
  instructionUrl,
  instructionPaywall,
  chargeId,
  dataTestIdPrefix,
  onLinkClick,
  variant = "default",
  label = "Jury Instruction",
  tooltipText = "These are the exact legal standards a jury must follow when deciding your case. They spell out what the prosecution must prove for each charge.",
  tooltipAriaLabel = "What is a jury instruction?",
  className,
}: JuryInstructionBadgeProps) {
  const testIdSuffix = chargeId ?? "";
  const prefix = dataTestIdPrefix ?? "link-instruction";

  if (variant === "pill") {
    return (
      <div className={`mt-1 flex items-center gap-1 flex-wrap${className ? ` ${className}` : ""}`}>
        {instructionUrl ? (
          <a
            href={instructionUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onLinkClick}
            data-testid={testIdSuffix ? `${prefix}-${testIdSuffix}` : undefined}
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 hover:bg-blue-100 transition-colors"
            aria-label={`${label}: ${instructionRef}`}
          >
            <BookOpen className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            {instructionRef}
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">
            <BookOpen className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            {instructionRef}
            {instructionPaywall && (
              <span className="text-blue-500 font-normal ml-0.5">(via {instructionPaywall})</span>
            )}
          </span>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onLinkClick}
                className="inline-flex items-center text-blue-400 hover:text-blue-600 flex-shrink-0"
                aria-label={tooltipAriaLabel}
              >
                <HelpCircle className="h-3 w-3" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">
              {tooltipText}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 flex-wrap${className ? ` ${className}` : ""}`}>
      <BookOpen className="h-3 w-3 text-indigo-500 dark:text-indigo-400 flex-shrink-0" aria-hidden="true" />
      <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex-shrink-0">
        {label}:
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 flex-shrink-0"
              onClick={onLinkClick}
              aria-label={tooltipAriaLabel}
            >
              <HelpCircle className="h-3 w-3" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs">
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {instructionUrl ? (
        <a
          href={instructionUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLinkClick}
          data-testid={testIdSuffix ? `${prefix}-${testIdSuffix}` : undefined}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 hover:underline font-medium inline-flex items-center gap-0.5"
          aria-label={`View official jury instruction ${instructionRef}`}
        >
          {instructionRef}
          <ExternalLink className="h-2.5 w-2.5" aria-hidden="true" />
        </a>
      ) : (
        <>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            {instructionRef}
          </span>
          {instructionPaywall && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-normal">
              (Available via {instructionPaywall})
            </span>
          )}
        </>
      )}
    </div>
  );
}
