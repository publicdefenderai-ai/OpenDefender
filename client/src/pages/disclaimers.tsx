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
              About This Project
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  OpenDefender is a free, open source resource for people navigating the U.S. criminal justice and immigration systems, and for the practical life disruptions those systems create. It provides general rights information, early advocacy guidance, and practical support resources covering housing, employment, finances, family, mental health, immigration, and record clearing. It is not a legal service and does not provide legal advice.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You're welcome to use it, share it, change it, or build on it however you'd like.
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
              No Guarantees
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  We do our best to provide accurate and helpful info, but sometimes there might be mistakes or outdated information. We can't promise everything here is perfect or up to date.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Updates and Availability */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              Updates and Availability
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  We try to keep OpenDefender working well, but it might not always be updated or available. Things can change without notice.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Limitation of Liability */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              Limitation of Liability
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Use OpenDefender at your own risk, and we are not responsible if something doesn't go as expected, or for any other problems or losses you might have from using this site.
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
                  {t('disclaimers.aiDisclosure.p6')}
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
              Immigration Guidance
            </h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Our immigration resources — including Know Your Rights materials, Red Cards, and program information — are for general informational purposes only.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Immigration law changes frequently and our information may not reflect the latest policies</li>
                  <li>These materials are not legal advice and are not a substitute for consulting with a qualified immigration attorney</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Trilingual Content */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              Translations & Multilingual Content
            </h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We provide content in English, Spanish, and Simplified Chinese to make information and resources more accessible.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Translations may not capture the precise legal meaning of every term — the English version is authoritative</li>
                  <li>If you need legal guidance in a language other than English, we recommend consulting a bilingual attorney</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Document Summarizer Accuracy */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              Document Summarizer
            </h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Our Document Summarizer uses AI to create condensed summaries of legal documents you upload.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Summaries are AI-generated and may omit important details — they are not a substitute for reading the full document</li>
                  <li>Always review the original document with your attorney before making any decisions based on a summary</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Court Records & RECAP */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              Court Records & Case Law
            </h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We retrieve court records and case law from third-party sources including CourtListener, the RECAP Archive, and PACER.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Records from these sources may be incomplete, delayed, or contain errors</li>
                  <li>Always verify court records directly with the relevant court clerk's office for official information</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Legal Data Sources */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              Legal Data Sources
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Statute citations, case law, and ordinance references on this platform draw from several authoritative sources.
                </p>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">OpenLaws:</strong> Live statute text across 50 states, D.C., Puerto Rico, and Federal law.
                  </li>
                  <li>
                    <strong className="text-foreground">GovInfo.gov (GPO):</strong> Federal criminal statutes (Title 18 U.S.C.) from the U.S. Government Publishing Office.
                  </li>
                  <li>
                    <strong className="text-foreground">CourtListener / RECAP Archive:</strong> Federal and state case law and court documents from the Free Law Project.
                  </li>
                  <li>
                    <strong className="text-foreground">LOCUS-v1 (LocalLaws / UC Berkeley):</strong> Municipal and county ordinance text used for local-ordinance charges
                    (loitering, trespass, disorderly conduct, and similar offenses commonly prosecuted under city or county code).
                    Citation: Peskoff, Barrow, Vu &amp; Davenport et al. (2026), <em>Freeing the Law with LOCUS</em>, arXiv:2606.19334.
                    Dataset:{" "}
                    <a
                      href="https://huggingface.co/datasets/LocalLaws/LOCUS-v1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    >
                      huggingface.co/datasets/LocalLaws/LOCUS-v1
                    </a>.
                    Licensed under{" "}
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
                    <strong className="text-foreground">Bureau of Justice Statistics (BJS):</strong> National crime statistics used for outcome data.
                  </li>
                  <li>
                    <strong className="text-foreground">LegiScan:</strong> Bill tracking for monitoring statute changes.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Statute and ordinance text may be outdated. Always verify citations directly with the official source before relying on them for legal decisions.
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
              About Third-Party Tools
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Some parts of the platform use other companies' services to work properly. You can learn about those and their privacy policies in our{" "}
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                    Privacy Policy
                  </Link>{" "}
                  page.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Open Source Freedom */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              Open Source Licensing
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  OpenDefender uses a dual-license structure to maximize both code reuse and access to justice:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Code (MIT License):</strong> All source code is open source under the MIT License, allowing free use, modification, and distribution with attribution.</li>
                  <li><strong className="text-foreground">Content (CC0 Public Domain):</strong> All non-code content — informational resources, practical guides, and templates — is released to the public domain under CC0, meaning anyone can use it without restrictions or attribution requirements.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  The public repository is available{" "}
                  <a
                    href="https://github.com/publicdefenderai-ai/OpenDefender"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    on GitHub
                  </a>.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Trademark */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              Trademark Notice
            </h2>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  The CC0 public domain dedication does not apply to the "OpenDefender" name or logo. Those are trademarks and are not included. You are free to use, adapt, and share the content and code, but please don't use the OpenDefender name or logo in a way that suggests your project is officially part of or affiliated with this one.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* No Endorsement */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              No Endorsement
            </h2>

            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Using or sharing OpenDefender's content or code does not mean we endorse your project, organization, or legal position. Please don't suggest or imply that OpenDefender backs anything you're doing.
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
