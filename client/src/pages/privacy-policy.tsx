import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useTranslation } from "react-i18next";
import { privacySupplementCopy } from "./privacy-supplement-copy";

const ANTHROPIC_COMMERCIAL_TERMS_URL = "https://www.anthropic.com/legal/commercial-terms";

export default function PrivacyPolicy() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const language = i18n.language.startsWith("es") ? "es" : i18n.language.startsWith("zh") ? "zh" : "en";
  const copy = privacySupplementCopy[language];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="editorial-page-intro py-12 md:py-16">
        <div className="editorial-page-intro-inner max-w-4xl mx-auto px-4">
          <p className="editorial-kicker mb-3">{t('privacyPolicy.hero.lastUpdated')}</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-5">
            {t('privacyPolicy.hero.title')}
          </h1>
          <p className="text-base md:text-lg max-w-2xl">
            {t('privacyPolicy.hero.subtitle')}
          </p>
        </div>
      </section>
      
      <main className="editorial-document max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* Core Principles */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('privacyPolicy.principles.title')}
            </h2>
            
            <div className="space-y-6">
              {/* Data Minimization */}
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
                    {t('privacyPolicy.caseData.memoryOnly.description', 'Case inputs are held in temporary server memory rather than a persistent case database and generally expire within 24 hours or on service restart.')}
                  </p>
                </CardContent>
              </Card>

              {/* PII Redaction */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.caseData.piiRedaction.title', 'Automated Redaction Safeguard')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.caseData.piiRedaction.description', 'Before AI processing, we attempt to redact common identifiers. Automated redaction may miss sensitive details, and AI inputs are processed by Anthropic.')}
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
                    {t('privacyPolicy.caseData.autoDelete.description', 'Case and feedback records generally expire from server memory within 24 hours. Some consent, audit, security, and provider records follow separate disclosed retention periods.')}
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
                    {t('privacyPolicy.caseData.serverRestart.description', 'A service restart clears OpenDefender case records held in that process. Provider logs and some operational records can follow separate retention periods.')}
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
              {t('privacyPolicy.documentSummarizer.summary', 'The Document Summarizer sends extracted document text to Anthropic for summaries and question answering. The safeguards and limits below apply.')}
            </p>

            <div className="space-y-4">
              {/* No Storage */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.documentSummarizer.noStorage.title', 'Temporary Document Processing')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.documentSummarizer.noStorage.description', 'Uploaded document bytes and extracted text are processed in temporary server memory rather than saved to a persistent document database.')}
                  </p>
                </CardContent>
              </Card>

              {/* User Copy */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.documentSummarizer.summaryNotStored.title', 'Your Copy Remains Under Your Control')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.documentSummarizer.summaryNotStored.description', 'OpenDefender does not create a permanent document or summary library. Copies you download, print, or save remain on your device or with services you choose.')}
                  </p>
                </CardContent>
              </Card>

              {/* Anthropic Processing */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('privacyPolicy.documentSummarizer.aiProcessing.title', 'AI Processing by Anthropic')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.documentSummarizer.aiProcessing.description', 'Document text and questions are sent to Anthropic. Automated redaction may miss sensitive details, and Anthropic may retain API data for up to 30 days under its standard terms.')}
                  </p>
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

        {/* Government & Legal Requests */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {copy.government.title}
            </h2>

            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">{copy.government.body}</p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* No Attorney-Client Privilege */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {copy.privilege.title}
            </h2>

            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">{copy.privilege.body}</p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* How We Use AI Services */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {copy.aiUse.title}
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {copy.aiUse.intro}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                  {copy.aiUse.bullets.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {copy.aiUse.callout}
                </p>
              </CardContent>
            </Card>
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
                    <li>
                      {t('privacyPolicy.technical.external.services.anthropic')}
                      <a
                        href={ANTHROPIC_COMMERCIAL_TERMS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                      >
                        {t('privacyPolicy.technical.external.services.anthropicTermsLink')}
                      </a>
                      {t('privacyPolicy.technical.external.services.anthropicTermsSuffix')}
                    </li>
                    <li>{t('privacyPolicy.technical.external.services.govInfo')}</li>
                    <li>{t('privacyPolicy.technical.external.services.courtListener')}</li>
                    <li>{t('privacyPolicy.technical.external.services.recap')}</li>
                    <li>{t('privacyPolicy.technical.external.services.cornell')}</li>
                    <li>{t('privacyPolicy.technical.external.services.openLaws')}</li>
                    <li>{t('privacyPolicy.technical.external.services.legiScan')}</li>
                    <li>{t('privacyPolicy.technical.external.services.bjs')}</li>
                    <li>{t('privacyPolicy.technical.external.services.lsc')}</li>
                    <li>{t('privacyPolicy.technical.external.services.eoir')}</li>
                    <li>{t('privacyPolicy.technical.external.services.nominatim')}</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-2">
                    {t('privacyPolicy.technical.external.note')}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t('privacyPolicy.technical.captcha.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.technical.captcha.description')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Public API Privacy */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {copy.api.title}
            </h2>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">{copy.api.body}</p>
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

        {/* AI Feature Reference Table */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {copy.inventory.title}
            </h2>
            <p className="text-muted-foreground mb-4">{copy.inventory.subtitle}</p>
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {copy.inventory.headers.map((header) => (
                        <th key={header} className="text-left px-4 py-3 font-semibold text-foreground">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {copy.inventory.rows.map(([feature, sent, retention]) => (
                      <tr key={feature}>
                        <td className="px-4 py-3 text-foreground">{feature}</td>
                        <td className="px-4 py-3 text-muted-foreground">{sent}</td>
                        <td className="px-4 py-3 text-muted-foreground">{retention}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              {copy.inventory.termsBeforeLink}
              <a
                href={ANTHROPIC_COMMERCIAL_TERMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                {copy.inventory.termsLink}
              </a>
              {copy.inventory.termsAfterLink}
            </p>
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
