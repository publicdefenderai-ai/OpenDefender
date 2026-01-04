import { Link } from "wouter";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigationGuard } from "@/contexts/navigation-guard";
import { useTranslation } from "react-i18next";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
  currentPage: string;
  className?: string;
}

export function PageBreadcrumb({ items, currentPage, className }: PageBreadcrumbProps) {
  const { attemptNavigation } = useNavigationGuard();
  const { t } = useTranslation();

  if (items.length === 0) return null;

  const lastItem = items[items.length - 1];

  const handleNavigate = (href: string) => {
    attemptNavigation(() => {
      window.location.href = href;
    });
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("border-b border-border/40 bg-muted/20", className)}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        {/* Mobile: Back link only */}
        <div className="md:hidden">
          <button
            onClick={() => handleNavigate(lastItem.href)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="breadcrumb-back-mobile"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{lastItem.label}</span>
          </button>
        </div>

        {/* Desktop: Full breadcrumb trail */}
        <ol className="hidden md:flex items-center gap-1.5 text-sm">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1.5">
              <button
                onClick={() => handleNavigate(item.href)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`breadcrumb-link-${index}`}
              >
                {item.label}
              </button>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            </li>
          ))}
          <li>
            <span 
              className="font-medium text-foreground"
              aria-current="page"
              data-testid="breadcrumb-current"
            >
              {currentPage}
            </span>
          </li>
        </ol>
      </div>
    </nav>
  );
}
