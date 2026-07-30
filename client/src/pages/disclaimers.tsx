import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BrandShieldIcon } from "@/components/brand-logo";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function Disclaimers() {
  useScrollToTop();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Colored Header */}
      <section className="vivid-header py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
            {t('disclaimers.hero.title')}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            {t('disclaimers.hero.subtitle')}
          </p>
          <p className="text-sm text-white/60 mt-2">
            {t('disclaimers.hero.lastUpdated')}
          </p>
        </div>
      </section>
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* About This Project */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.aboutProject.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.aboutProject.p1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.aboutProject.p2')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Not Legal Advice */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.notLegalAdvice.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.notLegalAdvice.body')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* No Guarantees */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.noGuarantees.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.noGuarantees.body')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Updates and Availability */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.updatesAvailability.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.updatesAvailability.body')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Limitation of Liability */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.limitationOfLiability.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.limitationOfLiability.body')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* AI Technology Disclosure */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.aiDisclosure.title')}
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.aiDisclosure.p1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.aiDisclosure.p2')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.aiDisclosure.p3')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.aiDisclosure.p4')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.aiDisclosure.p5')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.aiDisclosure.p6_pre')}{' '}
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                    {t('footer.privacyPolicy')}
                  </Link>{' '}
                  {t('disclaimers.aiDisclosure.p6_post')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Record and Eligibility Tools */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.screeningTools.title')}
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.screeningTools.p1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.screeningTools.p2')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.screeningTools.p3')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.screeningTools.p4')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.screeningTools.p5')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Immigration Guidance */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.immigrationGuidance.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.immigrationGuidance.intro')}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>{t('disclaimers.immigrationGuidance.item1')}</li>
                  <li>{t('disclaimers.immigrationGuidance.item2')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Trilingual Content */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.multilingualContent.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.multilingualContent.intro')}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>{t('disclaimers.multilingualContent.item1')}</li>
                  <li>{t('disclaimers.multilingualContent.item2')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Document Summarizer Accuracy */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.documentSummarizer.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.documentSummarizer.intro')}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>{t('disclaimers.documentSummarizer.item1')}</li>
                  <li>{t('disclaimers.documentSummarizer.item2')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Court Records & RECAP */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.courtRecords.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.courtRecords.intro')}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>{t('disclaimers.courtRecords.item1')}</li>
                  <li>{t('disclaimers.courtRecords.item2')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Legal Data Sources */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.legalDataSources.title')}
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.legalDataSources.intro')}
                </p>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">OpenLaws:</strong> {t('disclaimers.legalDataSources.openlaws')}
                  </li>
                  <li>
                    <strong className="text-foreground">GovInfo.gov (GPO):</strong> {t('disclaimers.legalDataSources.govinfo')}
                  </li>
                  <li>
                    <strong className="text-foreground">CourtListener / RECAP Archive:</strong> {t('disclaimers.legalDataSources.courtlistener')}
                  </li>
                  <li>
                    <strong className="text-foreground">LOCUS-v1 (LocalLaws / UC Berkeley):</strong>{" "}
                    {t('disclaimers.legalDataSources.locusDesc')}{" "}
                    <em>Freeing the Law with LOCUS</em>, arXiv:2606.19334.
                    Dataset:{" "}
                    <a
                      href="https://huggingface.co/datasets/LocalLaws/LOCUS-v1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    >
                      huggingface.co/datasets/LocalLaws/LOCUS-v1
                    </a>.{" "}
                    {t('disclaimers.legalDataSources.locusLicensed')}{" "}
                    <a
                      href="https://creativecommons.org/licenses/by-nc/4.0/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    >
                      CC-BY-NC-4.0
                    </a>.
                  </li>
                  <li>
                    <strong className="text-foreground">Bureau of Justice Statistics (BJS):</strong> {t('disclaimers.legalDataSources.bjs')}
                  </li>
                  <li>
                    <strong className="text-foreground">LegiScan:</strong> {t('disclaimers.legalDataSources.legiscan')}
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {t('disclaimers.legalDataSources.footer')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Attorney Tools */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.attorneyTools.title')}
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.attorneyTools.intro')}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>{t('disclaimers.attorneyTools.item1')}</li>
                  <li>{t('disclaimers.attorneyTools.item2')}</li>
                  <li>{t('disclaimers.attorneyTools.item3')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Public API */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.publicApi.title')}
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.publicApi.intro')}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>{t('disclaimers.publicApi.item1')}</li>
                  <li>{t('disclaimers.publicApi.item2')}</li>
                  <li>{t('disclaimers.publicApi.item3')}</li>
                  <li>{t('disclaimers.publicApi.item4')}</li>
                  <li>{t('disclaimers.publicApi.item5')}</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {t('disclaimers.publicApi.footer')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* About Third-Party Tools */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.thirdPartyTools.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.thirdPartyTools.bodyPre')}{" "}
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                    {t('disclaimers.thirdPartyTools.bodyLink')}
                  </Link>{" "}
                  {t('disclaimers.thirdPartyTools.bodyPost')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Open Source Freedom */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.openSourceLicensing.title')}
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.openSourceLicensing.intro')}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">{t('disclaimers.openSourceLicensing.codeLicenseLabel')}</strong> {t('disclaimers.openSourceLicensing.codeLicenseBody')}</li>
                  <li><strong className="text-foreground">{t('disclaimers.openSourceLicensing.contentLicenseLabel')}</strong> {t('disclaimers.openSourceLicensing.contentLicenseBody')}</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.openSourceLicensing.githubPre')}{" "}
                  <a
                    href="https://github.com/publicdefenderai-ai/OpenDefender"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    {t('disclaimers.openSourceLicensing.githubLink')}
                  </a>{t('disclaimers.openSourceLicensing.githubPost')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Trademark */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.trademark.title')}
            </h2>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.trademark.body')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* No Endorsement */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('disclaimers.noEndorsement.title')}
            </h2>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimers.noEndorsement.body')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Acknowledgement */}
        <ScrollReveal>
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <div className="flex items-start gap-3">
                <BrandShieldIcon size={16} className="mt-0.5 flex-shrink-0" />
                <span><strong className="font-semibold">{t('disclaimers.acknowledgement.label')}</strong> {t('disclaimers.acknowledgement.body')}</span>
              </div>
            </AlertDescription>
          </Alert>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
