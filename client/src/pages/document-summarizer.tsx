import { motion } from "framer-motion";
import { FileSearch, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { DocumentSummarizer } from "@/components/document-summarizer";

export default function DocumentSummarizerPage() {
  useScrollToTop();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-8 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-cyan-100/50 to-cyan-50 dark:from-cyan-950 dark:via-cyan-900/50 dark:to-cyan-950" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-600 rounded-2xl mb-4">
              <FileSearch className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              {t('documentSummarizer.hero.title', 'Document Summarizer')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('documentSummarizer.hero.subtitle', 'Get AI-powered plain-English summaries of legal documents. Your documents are never stored.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/resources">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.backToResources', 'Back to Resources')}
              </Button>
            </Link>
          </div>

          {/* Document Summarizer Component */}
          <DocumentSummarizer isAttorneyMode={false} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
