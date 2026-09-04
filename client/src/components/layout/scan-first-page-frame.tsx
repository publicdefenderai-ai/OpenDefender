import { useEffect, useState } from "react";
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

function useActiveSection(items: PageSectionNavItem[]) {
  const sectionIds = items.map(({ id }) => id).join("|");
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const ids = sectionIds.split("|").filter(Boolean);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const setActiveFromHash = () => {
      const hashId = window.location.hash.slice(1);
      if (hashId && ids.includes(hashId)) {
        setActiveId(hashId);
      }
    };

    setActiveFromHash();

    const updateActiveSection = () => {
      const anchor = window.innerHeight * 0.25;
      const measuredSections = sections.map((section) => ({
        section,
        rect: section.getBoundingClientRect(),
      }));
      const currentSection = measuredSections
        .filter(({ rect }) => rect.top <= anchor)
        .at(-1);
      const nearbySection = measuredSections.find(
        ({ rect }) => rect.bottom > window.innerHeight * 0.1 && rect.top < window.innerHeight * 0.4,
      );

      setActiveId((currentSection ?? nearbySection)?.section.id ?? ids[0]);
    };

    if (typeof IntersectionObserver === "undefined") {
      updateActiveSection();
      window.addEventListener("scroll", updateActiveSection, { passive: true });
    } else {
      const observer = new IntersectionObserver(updateActiveSection, {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 1],
      });
      sections.forEach((section) => observer.observe(section));

      window.addEventListener("resize", updateActiveSection);
      window.addEventListener("scroll", updateActiveSection, { passive: true });
      window.addEventListener("hashchange", setActiveFromHash);

      return () => {
        observer.disconnect();
        window.removeEventListener("resize", updateActiveSection);
        window.removeEventListener("scroll", updateActiveSection);
        window.removeEventListener("hashchange", setActiveFromHash);
      };
    }

    window.addEventListener("hashchange", setActiveFromHash);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", setActiveFromHash);
    };
  }, [sectionIds]);

  return [activeId, setActiveId] as const;
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
  const [activeId, setActiveId] = useActiveSection(items);
  if (items.length < 2) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className="overflow-hidden border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 lg:gap-8 lg:py-4">
        <span className="hidden shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:block">
          {ariaLabel}
        </span>
        <div className="flex min-w-0 gap-1.5 overflow-x-auto no-scrollbar lg:flex-wrap lg:gap-x-5 lg:gap-y-2">
          {items.map(({ id, label, icon: Icon }) => {
            const isActive = activeId === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveId(id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:min-h-0 lg:rounded-md lg:px-2 lg:py-1 ${
                  isActive ? "bg-muted text-foreground font-semibold" : accentClassName
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}