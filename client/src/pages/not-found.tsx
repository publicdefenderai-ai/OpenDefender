import { Link } from "wouter";
import { FileWarning } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function NotFound() {
  useScrollToTop();
  const { t } = useTranslation();

  return (
    <ScanFirstPageFrame>
      <section className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-10 sm:py-24" aria-labelledby="missing-page-title">
        <FileWarning aria-hidden="true" className="mb-8 h-16 w-16 text-primary" strokeWidth={1.25} />
        <p className="mb-3 text-sm text-muted-foreground">404</p>
        <h1 id="missing-page-title" className="text-4xl font-medium tracking-tight sm:text-5xl">{t("missingPage.title")}</h1>
        <p className="mb-8 mt-5 max-w-prose text-lg leading-relaxed text-muted-foreground">{t("missingPage.description")}</p>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90">{t("missingPage.home")}</Link>
          <Link href="/directory" className="inline-flex min-h-11 items-center py-3 text-primary underline underline-offset-4">{t("missingPage.resources")}</Link>
        </div>
      </section>
    </ScanFirstPageFrame>
  );
}
