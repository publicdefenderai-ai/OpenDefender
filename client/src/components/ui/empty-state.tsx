import { cn } from "@/lib/utils";
import { 
  Search, 
  FileQuestion, 
  MapPin, 
  MessageSquare, 
  Scale, 
  Users,
  FileText,
  AlertCircle
} from "lucide-react";
import { Button } from "./button";

type EmptyStateVariant = 
  | "search" 
  | "no-results" 
  | "location" 
  | "chat" 
  | "legal" 
  | "community"
  | "documents"
  | "error";

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: React.ReactNode;
}

const variantIcons: Record<EmptyStateVariant, typeof Search> = {
  search: Search,
  "no-results": FileQuestion,
  location: MapPin,
  chat: MessageSquare,
  legal: Scale,
  community: Users,
  documents: FileText,
  error: AlertCircle,
};

const variantStyles: Record<EmptyStateVariant, React.CSSProperties> = {
  search: { color: "hsl(var(--primary) / 0.3)" },
  "no-results": { color: "hsl(var(--muted-foreground) / 0.3)" },
  location: { color: "hsl(210 100% 50% / 0.3)" },
  chat: { color: "hsl(142 76% 36% / 0.3)" },
  legal: { color: "hsl(var(--primary) / 0.3)" },
  community: { color: "hsl(270 76% 60% / 0.3)" },
  documents: { color: "hsl(38 92% 50% / 0.3)" },
  error: { color: "hsl(var(--destructive) / 0.3)" },
};

export function EmptyState({
  variant = "no-results",
  title,
  description,
  action,
  className,
  children,
}: EmptyStateProps) {
  const Icon = variantIcons[variant];
  const iconStyle = variantStyles[variant];

  return (
    <div className={cn("empty-state animate-fade-in", className)} data-testid="empty-state">
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-primary rounded-full scale-150" />
        <Icon className="empty-state-icon relative" style={iconStyle} strokeWidth={1.5} />
      </div>
      
      <h3 className="empty-state-title text-balance" data-testid="empty-state-title">
        {title}
      </h3>
      
      {description && (
        <p className="empty-state-description text-pretty" data-testid="empty-state-description">
          {description}
        </p>
      )}
      
      {action && (
        <Button 
          onClick={action.onClick}
          className="mt-6 btn-bounce"
          data-testid="empty-state-action"
        >
          {action.label}
        </Button>
      )}
      
      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
}

export function NoSearchResults({ 
  searchTerm,
  onClear,
  suggestions,
}: { 
  searchTerm?: string;
  onClear?: () => void;
  suggestions?: string[];
}) {
  return (
    <EmptyState
      variant="search"
      title={searchTerm ? `No results for "${searchTerm}"` : "No results found"}
      description="Try adjusting your search terms or filters"
      action={onClear ? { label: "Clear search", onClick: onClear } : undefined}
    >
      {suggestions && suggestions.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion) => (
              <span 
                key={suggestion}
                className="px-3 py-1 bg-muted rounded-full text-foreground"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
    </EmptyState>
  );
}

export function NoLocationResults({ 
  zipCode,
  onRetry,
}: { 
  zipCode?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      variant="location"
      title="No locations found nearby"
      description={zipCode 
        ? `We couldn't find any results near ${zipCode}. Try a different ZIP code or expand your search radius.`
        : "Enter a ZIP code to search for locations near you."
      }
      action={onRetry ? { label: "Try different location", onClick: onRetry } : undefined}
    />
  );
}
