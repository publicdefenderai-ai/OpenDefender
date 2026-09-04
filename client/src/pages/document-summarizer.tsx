import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { FileSearch, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
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

      {/* Editorial opening */}
      <section className="editorial-page-intro py-10 md:py-14">
        <div className="editorial-page-intro-inner max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="editorial-tool-icon w-12 h-12 mb-5">
              <FileSearch className="h-6 w-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              {t('privacyPolicy.documentSummarizer.tool.title')}
            </h1>
            <p className="text-lg max-w-2xl">
              {t('privacyPolicy.documentSummarizer.tool.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="editorial-workspace py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/legal-aid">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.backToResources', 'Back to Resources')}
              </Button>
            </Link>
          </div>

          {/* Document Summarizer Component */}
          <Suspense
            fallback={
              <div
                className="editorial-surface flex min-h-56 items-center justify-center rounded-lg px-4"
                role="status"
                aria-live="polite"
              >
                <span className="text-sm text-muted-foreground">{t("common.loading", "Loading...")}</span>
              </div>
            }
          >
            <DocumentSummarizer isAttorneyMode={false} />
          </Suspense>
        </div>
      </section>

      <Footer />
    </div>
  );
}
