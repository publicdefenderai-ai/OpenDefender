import { BrandShieldIcon } from "@/components/brand-logo";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { DocumentSummarizer } from "@/components/document-summarizer";
import { VerificationForm } from "@/components/attorney/verification-form";
import { useAttorneySession } from "@/hooks/use-attorney-session";

import "./workspace.css";

export default function AttorneyPortal() {
  useScrollToTop();
  const { t } = useTranslation();
  const [showDocumentSummarizerModal, setShowDocumentSummarizerModal] = useState(false);
  const { isVerified, isLoading } = useAttorneySession();
  const summarizerTrigger = useRef<HTMLButtonElement>(null);

  // Show loading state while checking verification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  // Show verification form if not verified
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="border-b border-border/60 bg-[var(--editorial-paper-deep)] py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-[var(--editorial-signal)] mb-6">
                <BrandShieldIcon size={32} light />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                {t("attorneyPortal.verify.title", "Attorney Verification")}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(
                  "attorney.verify.subtitle",
                  "Please verify your bar membership to access attorney tools."
                )}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Verification Form */}
        <section className="py-8 md:py-12">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <Card className="editorial-card">
              <CardHeader>
                <CardTitle>
                  {t("attorneyPortal.verify.formTitle", "Bar Membership Verification")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "attorney.verify.formDescription",
                    "Confirm the required attestations to access attorney tools."
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VerificationForm />
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Keep the existing verified-session boundary and tool handlers.
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="attorney-workspace" data-skip-content tabIndex={-1}>
        <header className="attorney-workspace-intro">
          <h1>{t('attorneyPortal.hero.title', 'Attorney Tools')}</h1>
          <p>{t('attorneyPortal.hero.subtitle', 'Resources and tools for licensed attorneys representing clients in criminal and immigration matters.')}</p>
        </header>
        <Alert className="attorney-workspace-notice">
          <AlertDescription>{t('attorneyPortal.disclaimer', 'These tools are designed for licensed attorneys. Document generation features require attestation of bar membership.')}</AlertDescription>
        </Alert>
        <section className="attorney-workspace-feature" aria-labelledby="workspace-documentGeneration">
          <h2 id="workspace-documentGeneration">{t('attorneyPortal.documentGeneration.title', 'Document Generation')}</h2>
          <div className="attorney-workspace-detail"><p>{t('attorneyPortal.documentGeneration.description', 'AI-powered drafting for common criminal and immigration filings. Generate motions, notices, and other documents tailored to your client\'s case.')}</p><ul>
            <li>{t('attorneyPortal.documentGeneration.feature1', 'Motions to Continue, Discovery, Bail Reduction')}</li>
            <li>{t('attorneyPortal.documentGeneration.feature2', 'Immigration court filings (EOIR-28, Bond Memos)')}</li>
            <li>{t('attorneyPortal.documentGeneration.feature3', 'Jurisdiction-specific formatting')}</li>
          </ul></div>
          <Link className="attorney-workspace-action" href="/attorney/documents">{t('attorneyPortal.documentGeneration.getStarted', 'Get Started')}</Link>
        </section>
        <section className="attorney-workspace-tool" aria-labelledby="workspace-courtRecords">
          <h2 id="workspace-courtRecords">{t('attorneyPortal.courtRecords.title', 'Court Records Lookup')}</h2>
          <div className="attorney-workspace-detail"><p>{t('attorneyPortal.courtRecords.description', 'Search federal court records through PACER and access free documents via RECAP. Research case history, docket entries, and filed documents.')}</p><ul>
            <li>{t('attorneyPortal.courtRecords.feature1', 'PACER integration for federal courts')}</li>
            <li>{t('attorneyPortal.courtRecords.feature2', 'Free access via RECAP archive')}</li>
            <li>{t('attorneyPortal.courtRecords.feature3', 'Docket search and document retrieval')}</li>
          </ul></div>
          <Link className="attorney-workspace-action" href="/court-records">{t('attorneyPortal.courtRecords.button', 'Search Court Records')}</Link>
        </section>
        <section className="attorney-workspace-tool" lang="en" aria-labelledby="workspace-documentSummarizer">
          <h2 id="workspace-documentSummarizer">{t('attorneyPortal.documentSummarizer.title', 'Document Summarizer')}</h2>
          <div className="attorney-workspace-detail"><p>{t('attorneyPortal.documentSummarizer.description', 'Upload authorized client documents for temporary processing and AI-powered summaries. Document text is sent to Anthropic as disclosed in the Privacy Policy.')}</p><ul>
            <li>{t('attorneyPortal.documentSummarizer.feature1', 'PDF, DOCX, and image support')}</li>
            <li>{t('attorneyPortal.documentSummarizer.feature2', 'Extracts key dates and deadlines')}</li>
            <li>{t('attorneyPortal.documentSummarizer.feature3', 'Privacy-first: no document storage')}</li>
          </ul></div>
          <button ref={summarizerTrigger} className="attorney-workspace-action" onClick={() => setShowDocumentSummarizerModal(true)}>{t('attorneyPortal.documentSummarizer.button', 'Summarize Document')}</button>
        </section>
        <section className="attorney-workspace-tool" aria-labelledby="workspace-playbooks">
          <h2 id="workspace-playbooks">{t('attorneyPortal.playbooks.title', 'Case Playbooks')}</h2>
          <div className="attorney-workspace-detail"><p>{t('attorneyPortal.playbooks.subtitle', 'Stage-by-stage strategic roadmaps for criminal and immigration defense.')}</p><ul>
            <li>{t('attorneyPortal.playbooks.feature1', 'Stage-by-stage case roadmaps')}</li>
            <li>{t('attorneyPortal.playbooks.feature2', 'Criminal & immigration defense')}</li>
            <li>{t('attorneyPortal.playbooks.feature3', 'Jurisdiction variation callouts')}</li>
          </ul></div>
          <Link className="attorney-workspace-action" href="/attorney/playbooks">{t('attorneyPortal.playbooks.button', 'Browse Playbooks')}</Link>
        </section>
        <section className="attorney-workspace-resources" aria-labelledby="workspace-resources">
          <h2 id="workspace-resources">{t('attorneyPortal.sharedResources.title', 'Shared Resources')}</h2>
          <p>{t('attorneyPortal.sharedResources.description', 'These resources are available to everyone and may be useful for your practice.')}</p>
          <div className="attorney-workspace-resource-list">
            <Link href="/statutes"><h3>{t('attorneyPortal.sharedResources.statutes', 'Statute Lookup')}</h3><p>{t('attorneyPortal.sharedResources.statutesDesc', 'Search state and federal laws')}</p></Link>
            <Link href="/document-library"><h3>{t('attorneyPortal.sharedResources.documents', 'Document Library')}</h3><p>{t('attorneyPortal.sharedResources.documentsDesc', 'Legal forms and templates')}</p></Link>
            <Link href="/legal-glossary"><h3>{t('attorneyPortal.sharedResources.glossary', 'Legal Glossary')}</h3><p>{t('attorneyPortal.sharedResources.glossaryDesc', 'Legal term definitions')}</p></Link>
            <Link href="/court-locator"><h3>{t('attorneyPortal.sharedResources.courts', 'Court Locator')}</h3><p>{t('attorneyPortal.sharedResources.courtsDesc', 'Find court locations')}</p></Link>
          </div>
        </section>
        <section className="attorney-workspace-guidance">
          <h2>{t('attorneyPortal.guidanceNote.title', 'Personalized Guidance')}</h2>
          <div><p>{t('attorneyPortal.guidanceNote.description', 'Our AI-powered guidance chat is also available for attorneys to quickly understand a client\'s situation or research rights and procedures.')}</p>
            <Link className="attorney-workspace-action" href="/chat">{t('attorneyPortal.guidanceNote.button', 'Get Guidance')}</Link>
          </div>
        </section>
      </div>
      <Dialog open={showDocumentSummarizerModal} onOpenChange={setShowDocumentSummarizerModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0" aria-describedby={undefined} onCloseAutoFocus={event => { event.preventDefault(); summarizerTrigger.current?.focus(); }}>
          <DialogTitle className="sr-only" lang="en">{t('attorneyPortal.documentSummarizer.title', 'Document Summarizer')}</DialogTitle>
          <DocumentSummarizer isAttorneyMode={false} onClose={() => setShowDocumentSummarizerModal(false)} />
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
