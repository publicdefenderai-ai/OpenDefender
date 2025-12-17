import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  icon?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, icon, className = "" }: PageHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <div className={`bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-3" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center hover:text-foreground transition-colors" data-testid="breadcrumb-home">
              <Home className="h-4 w-4" />
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4" />
                {crumb.href ? (
                  <Link 
                    href={crumb.href} 
                    className="hover:text-foreground transition-colors"
                    data-testid={`breadcrumb-${index}`}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium" data-testid={`breadcrumb-${index}`}>
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="page-title">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground mt-1" data-testid="page-subtitle">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
