import { lazy, Suspense } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const DocumentSummarizer = lazy(() =>
  import("@/components/document-summarizer").then(({ DocumentSummarizer }) => ({ default: DocumentSummarizer }))
);

export default function DocumentSummarizerPage() {
  useScrollToTop();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="document-tool-page">
        <section className="editorial-page-intro document-tool-intro">
          <div className="document-tool-width">
            <p className="document-tool-label">{t('privacyPolicy.documentSummarizer.tool.title')}</p>
            <h1>{t('design.summaryHeadline')}</h1>
            <p className="document-tool-description">{t('design.summaryDescription')}</p>
            <aside className="document-tool-advisory" aria-label={t('design.beforeSharing')}>
              <strong>{t('design.beforeSharing')}</strong>
              <p>{t('design.aiSharingNotice')}</p>
            </aside>
          </div>
        </section>
        <section className="editorial-workspace document-tool-width document-tool-workspace" aria-label={t('privacyPolicy.documentSummarizer.tool.title')}>
          <Suspense fallback={<p role="status" className="py-12">{t('common.loading', 'Loading...')}</p>}>
            <DocumentSummarizer isAttorneyMode={false} presentation="page" />
          </Suspense>
        </section>
        <nav className="document-tool-width document-tool-related" aria-label={t('design.summaryRelated')}>
          <Link href="/legal-aid">{t('design.summaryLegalHelp')}</Link>
          <Link href="/document-library">{t('design.summaryExplainers')}</Link>
          <Link href="/directory">{t('design.summaryAllResources')}</Link>
        </nav>
      </div>
      <Footer />
    </div>
  );
}
