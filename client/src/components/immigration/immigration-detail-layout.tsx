import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageBreadcrumb, BreadcrumbItem } from "@/components/navigation/page-breadcrumb";
import { RapidlyEvolvingNotice } from "@/components/immigration/rapidly-evolving-notice";

interface ImmigrationDetailLayoutProps {
  title: string;
  subtitle: string;
  breadcrumbItems: BreadcrumbItem[];
  icon: ReactNode;
  eyebrow?: ReactNode;
  alert?: ReactNode;
  children: ReactNode;
}

/**
 * Shared frame for immigration detail guides.
 *
 * The hub uses a quiet editorial surface rather than a second visual system.
 * Keeping the frame here means translated titles, source notices, and the
 * spacing around page-specific tools stay consistent across every guide.
 */
export function ImmigrationDetailLayout({
  title,
  subtitle,
  breadcrumbItems,
  icon,
  eyebrow,
  alert,
  children,
}: ImmigrationDetailLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb items={breadcrumbItems} currentPage={title} />

      <header className="border-b border-border/60 bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
          <div className="flex items-start gap-4 md:gap-5">
            <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-primary md:h-14 md:w-14">
              {icon}
            </div>
            <div className="min-w-0">
              {eyebrow}
              <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl" data-testid="immigration-detail-title">
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg" data-testid="immigration-detail-subtitle">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </header>

      {alert && (
        <div className="mx-auto max-w-4xl px-4 pt-6">
          {alert}
        </div>
      )}

      <RapidlyEvolvingNotice />

      <main className="editorial-reading">
        {children}
      </main>

      <Footer />
    </div>
  );
}