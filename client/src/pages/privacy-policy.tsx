import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  useScrollToTop();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Colored Header */}
      <section className="vivid-header-purple py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
            {t('privacyPolicy.hero.title')}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            {t('privacyPolicy.hero.subtitle')}
          </p>
          <p className="text-sm text-white/60 mt-2">
            {t('privacyPolicy.hero.lastUpdated')}
          </p>
        </div>
      </section>
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* Core Principles */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('privacyPolicy.principles.title')}
            </h2>
            
            <div className="space-y-6">
              {/* No Personal Data Collection */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.principles.noPersonalData.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.principles.noPersonalData.description')}
                  </p>
                </CardContent>
              </Card>

              {/* Anonymized Data Only */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.principles.anonymizedData.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    {t('privacyPolicy.principles.anonymizedData.description')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                    <li>{t('privacyPolicy.principles.anonymizedData.usage.metrics')}</li>
                    <li>{t('privacyPolicy.principles.anonymizedData.usage.improvements')}</li>
                    <li>{t('privacyPolicy.principles.anonymizedData.usage.integrations')}</li>
                  </ul>
                </CardContent>
              </Card>

              {/* No Third-Party Sharing */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.principles.noSharing.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.principles.noSharing.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollReveal>

        {/* Case Guidance Data Protection */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('privacyPolicy.caseData.title', 'How We Protect Your Case Information')}
            </h2>
            
            <p className="text-muted-foreground mb-6">
              {t('privacyPolicy.caseData.summary', 'When you use our legal guidance tool, your case information receives multiple layers of protection. Here\'s exactly what happens to your data:')}
            </p>

            <div className="space-y-4">
              {/* Memory-Only Storage */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.caseData.memoryOnly.title', 'Memory-Only Storage')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.caseData.memoryOnly.description', 'Your case information is stored only in temporary server memory - it is never written to a database or saved to disk. This means your data exists only while being processed and cannot be recovered after your session ends.')}
                  </p>
                </CardContent>
              </Card>

              {/* PII Redaction */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.caseData.piiRedaction.title', 'Personal Information Automatically Removed')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.caseData.piiRedaction.description', 'Before your case details are processed by our AI, we automatically detect and remove personal information like names, phone numbers, email addresses, and Social Security numbers. This redaction happens locally on our servers using machine learning - your personal details are never sent to external AI services.')}
                  </p>
                </CardContent>
              </Card>

              {/* Auto-Delete */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.caseData.autoDelete.title', 'Automatic 24-Hour Deletion')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.caseData.autoDelete.description', 'Even in memory, your case data has a maximum lifespan of 24 hours. After this time, it is automatically and permanently deleted. You don\'t need to take any action - deletion happens automatically.')}
                  </p>
                </CardContent>
              </Card>

              {/* Server Restart */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.caseData.serverRestart.title', 'Cleared on Server Restart')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.caseData.serverRestart.description', 'Because data is stored only in memory, any server restart or update completely clears all session data. This happens regularly as we improve the platform, providing an additional layer of data ephemerality.')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollReveal>

        {/* Document Summarizer Data Protection */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('privacyPolicy.documentSummarizer.title', 'Document Summarizer Privacy')}
            </h2>

            <p className="text-muted-foreground mb-6">
              {t('privacyPolicy.documentSummarizer.summary', 'Our Document Summarizer allows you to upload legal documents for AI-powered analysis. Here\'s how we protect your uploaded documents:')}
            </p>

            <div className="space-y-4">
              {/* No Storage */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.documentSummarizer.noStorage.title', 'Documents Are Never Stored')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.documentSummarizer.noStorage.description', 'Your uploaded documents are processed entirely in server memory and are never written to disk or saved in any database. The file data is immediately discarded after your summary is generated. We do not keep copies of your documents.')}
                  </p>
                </CardContent>
              </Card>

              {/* Summary Not Stored */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.documentSummarizer.summaryNotStored.title', 'Summaries Are Not Stored')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.documentSummarizer.summaryNotStored.description', 'The AI-generated summary exists only in your browser session. We do not save or cache summaries on our servers. If you want to keep your summary, use the download button - otherwise it will be lost when you close or refresh the page.')}
                  </p>
                </CardContent>
              </Card>

              {/* Anthropic Processing */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.documentSummarizer.anthropicProcessing.title', 'AI Processing by Anthropic')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.documentSummarizer.anthropicProcessing.description', 'To generate summaries, your document content is sent to Anthropic\'s Claude AI. Important privacy protections apply:')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2 mt-3">
                    <li>{t('privacyPolicy.documentSummarizer.anthropicProcessing.noTraining', 'Anthropic does not use your documents to train AI models')}</li>
                    <li>{t('privacyPolicy.documentSummarizer.anthropicProcessing.retention', 'Anthropic may temporarily retain data for up to 30 days for operational and safety purposes')}</li>
                    <li>{t('privacyPolicy.documentSummarizer.anthropicProcessing.autoDelete', 'After 30 days, any retained data is automatically and permanently deleted')}</li>
                    <li>{t('privacyPolicy.documentSummarizer.anthropicProcessing.piiRedaction', 'We remove personal information (SSN, phone numbers, emails) before sending to Anthropic')}</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Supported Files */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.documentSummarizer.supportedFiles.title', 'What You Can Upload')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.documentSummarizer.supportedFiles.description', 'We support PDF, DOCX, TXT, and image files (PNG, JPEG) up to 10MB. For your privacy, we recommend removing any unnecessary personal information from documents before uploading.')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollReveal>

        {/* Technical Details */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('privacyPolicy.technical.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Session Data */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t('privacyPolicy.technical.sessions.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.technical.sessions.description')}
                  </p>
                </div>

                {/* Server Logs */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t('privacyPolicy.technical.logs.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.technical.logs.description')}
                  </p>
                </div>

                {/* External Services */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t('privacyPolicy.technical.external.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    {t('privacyPolicy.technical.external.description')}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>{t('privacyPolicy.technical.external.services.anthropic')}</li>
                    <li>{t('privacyPolicy.technical.external.services.govInfo')}</li>
                    <li>{t('privacyPolicy.technical.external.services.courtListener')}</li>
                    <li>{t('privacyPolicy.technical.external.services.recap')}</li>
                    <li>{t('privacyPolicy.technical.external.services.cornell')}</li>
                    <li>{t('privacyPolicy.technical.external.services.openLaws')}</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-2">
                    {t('privacyPolicy.technical.external.note')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Your Rights */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('privacyPolicy.rights.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('privacyPolicy.rights.description')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                  <li>{t('privacyPolicy.rights.list.noDataStored')}</li>
                  <li>{t('privacyPolicy.rights.list.sessionControl')}</li>
                  <li>{t('privacyPolicy.rights.list.noTracking')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Changes to Policy */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('privacyPolicy.changes.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {t('privacyPolicy.changes.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Contact */}
        <ScrollReveal>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">{t('privacyPolicy.contact.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacyPolicy.contact.description')}
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
