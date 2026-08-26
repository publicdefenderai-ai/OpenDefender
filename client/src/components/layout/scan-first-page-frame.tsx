import type { ElementType, ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export interface PageSectionNavItem {
  id: string;
  label: string;
  icon?: ElementType;
}

interface ScanFirstPageFrameProps {
  children: ReactNode;
  className?: string;
  mainClassName?: string;
}

/**
 * Shared shell for support and utility pages. Keeping the landmark and
 * vertical rhythm here makes specialized pages feel related without forcing
 * their content into one component.
 */
export function ScanFirstPageFrame({
  children,
  className = "",
  mainClassName = "",
}: ScanFirstPageFrameProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-background ${className}`}>
      <Header />
      <main id="main-content" className={`flex-1 ${mainClassName}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

interface PageSectionNavProps {
  items: PageSectionNavItem[];
  ariaLabel: string;
  accentClassName?: string;
}

/**
 * A quiet, responsive contents rail: a horizontal scroller on small screens
 * and a sticky list on larger screens. It is optional and only rendered by
 * pages with enough major sections to benefit from wayfinding.
 */
export function PageSectionNav({
  items,
  ariaLabel,
  accentClassName = "text-primary",
}: PageSectionNavProps) {
  if (items.length < 2) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className="border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 lg:gap-8 lg:py-4">
        <span className="hidden shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:block">
          {ariaLabel}
        </span>
        <div className="flex min-w-0 gap-1.5 overflow-x-auto no-scrollbar lg:flex-wrap lg:gap-x-5 lg:gap-y-2">
          {items.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:rounded-md lg:px-2 lg:py-1 ${accentClassName}`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}