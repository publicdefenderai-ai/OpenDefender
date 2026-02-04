import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, FileText, Shield, ArrowRight, FileSearch } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { DocumentSummarizer } from "@/components/document-summarizer";

export default function AttorneyPortal() {
  useScrollToTop();
  const { t } = useTranslation();
  const [showDocumentSummarizerModal, setShowDocumentSummarizerModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-600 rounded-2xl mb-6">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              {t('attorneyPortal.hero.title', 'Attorney Tools')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('attorneyPortal.hero.subtitle', 'Resources and tools for licensed attorneys representing clients in criminal and immigration matters.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Disclaimer */}
          <Alert className="mb-8 border-slate-200 bg-slate-50 dark:bg-slate-900/50">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              {t('attorneyPortal.disclaimer', 'These tools are designed for licensed attorneys. Document generation features require attestation of bar membership.')}
            </AlertDescription>
          </Alert>

          {/* Tools Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Document Generation - Available */}
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>{t('attorneyPortal.documentGeneration.title', 'Document Generation')}</CardTitle>
                <CardDescription>
                  {t('attorneyPortal.documentGeneration.description', 'AI-powered drafting for common criminal and immigration filings. Generate motions, notices, and other documents tailored to your client\'s case.')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {t('attorneyPortal.documentGeneration.feature1', 'Motions to Continue, Discovery, Bail Reduction')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {t('attorneyPortal.documentGeneration.feature2', 'Immigration court filings (EOIR-28, Bond Memos)')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {t('attorneyPortal.documentGeneration.feature3', 'Jurisdiction-specific formatting (CA, NY, TX, FL)')}
                  </li>
                </ul>
                <Link href="/attorney/verify">
                  <Button className="w-full">
                    {t('attorneyPortal.documentGeneration.getStarted', 'Get Started')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Court Records - Available */}
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-3">
                  <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>{t('attorneyPortal.courtRecords.title', 'Court Records Lookup')}</CardTitle>
                <CardDescription>
                  {t('attorneyPortal.courtRecords.description', 'Search federal court records through PACER and access free documents via RECAP. Research case history, docket entries, and filed documents.')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {t('attorneyPortal.courtRecords.feature1', 'PACER integration for federal courts')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {t('attorneyPortal.courtRecords.feature2', 'Free access via RECAP archive')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {t('attorneyPortal.courtRecords.feature3', 'Docket search and document retrieval')}
                  </li>
                </ul>
                <Link href="/court-records">
                  <Button className="w-full">
                    {t('attorneyPortal.courtRecords.button', 'Search Court Records')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Document Summarizer - Available */}
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg flex items-center justify-center mb-3">
                  <FileSearch className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <CardTitle>{t('attorneyPortal.documentSummarizer.title', 'Document Summarizer')}</CardTitle>
                <CardDescription>
                  {t('attorneyPortal.documentSummarizer.description', 'Upload client documents and get AI-powered summaries to quickly understand filings, reports, and evidence. Documents are never stored.')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {t('attorneyPortal.documentSummarizer.feature1', 'PDF, DOCX, and image support')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {t('attorneyPortal.documentSummarizer.feature2', 'Extracts key dates and deadlines')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {t('attorneyPortal.documentSummarizer.feature3', 'Privacy-first: no document storage')}
                  </li>
                </ul>
                <Button className="w-full" onClick={() => setShowDocumentSummarizerModal(true)}>
                  {t('attorneyPortal.documentSummarizer.button', 'Summarize Document')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Shared Resources Section */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              {t('attorneyPortal.sharedResources.title', 'Shared Resources')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('attorneyPortal.sharedResources.description', 'These resources are available to everyone and may be useful for your practice.')}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/statutes">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">{t('attorneyPortal.sharedResources.statutes', 'Statute Lookup')}</h3>
                    <p className="text-sm text-muted-foreground">{t('attorneyPortal.sharedResources.statutesDesc', 'Search state and federal laws')}</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/document-library">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">{t('attorneyPortal.sharedResources.documents', 'Document Library')}</h3>
                    <p className="text-sm text-muted-foreground">{t('attorneyPortal.sharedResources.documentsDesc', 'Legal forms and templates')}</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/legal-glossary">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">{t('attorneyPortal.sharedResources.glossary', 'Legal Glossary')}</h3>
                    <p className="text-sm text-muted-foreground">{t('attorneyPortal.sharedResources.glossaryDesc', 'Legal term definitions')}</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/court-locator">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">{t('attorneyPortal.sharedResources.courts', 'Court Locator')}</h3>
                    <p className="text-sm text-muted-foreground">{t('attorneyPortal.sharedResources.courtsDesc', 'Find court locations')}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Personalized Guidance Note */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {t('attorneyPortal.guidanceNote.title', 'Personalized Guidance')}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              {t('attorneyPortal.guidanceNote.description', 'Our AI-powered guidance chat is also available for attorneys to quickly understand a client\'s situation or research rights and procedures.')}
            </p>
            <Link href="/chat">
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/50">
                {t('attorneyPortal.guidanceNote.button', 'Get Guidance')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Document Summarizer Modal - Uses public endpoint, shows privacy disclosure */}
      <Dialog open={showDocumentSummarizerModal} onOpenChange={setShowDocumentSummarizerModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <DocumentSummarizer
            isAttorneyMode={false}
            onClose={() => setShowDocumentSummarizerModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
