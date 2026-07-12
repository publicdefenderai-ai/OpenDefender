import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BrandShieldIcon } from "@/components/brand-logo";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

const TRANSLATION_NOTICES: Record<string, { title: string; text: string }> = {
  es: {
    title: "Aviso de traducción",
    text: "Esta página se proporciona en español únicamente por conveniencia. La versión oficial y autorizada de estos avisos legales es la versión en inglés. Las traducciones pueden no reflejar el significado legal exacto del texto en inglés.",
  },
  zh: {
    title: "翻译声明",
    text: "本页面提供中文版本仅供参考。这些法律声明的官方权威版本为英文版本。翻译可能无法完全反映英文文本的确切法律含义。",
  },
};

export default function Disclaimers() {
  useScrollToTop();
  const { i18n } = useTranslation();
  const notice = TRANSLATION_NOTICES[i18n.language] ?? null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Colored Header */}
      <section className="vivid-header py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
            Legal Notice & Disclaimers
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            Important information about using OpenDefender
          </p>
          <p className="text-sm text-white/60 mt-2">
            Last updated: July 2026
          </p>
        </div>
      </section>
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* Translation notice — shown only for non-English languages */}
        {notice && (
          <Alert className="mb-10 border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong className="font-semibold">{notice.title}: </strong>
              {notice.text}
            </AlertDescription>
          </Alert>
        )}

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
              Not Legal Advice
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  OpenDefender provides general information and practical resources — it is not legal advice and does not establish an attorney-client relationship. Most of the platform covers practical support: understanding what is happening, knowing your rights, finding resources, and managing life disruptions that come with a legal case. For advice specific to your legal situation, consult a qualified attorney.
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
              AI Technology Disclosure
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Three features on OpenDefender use AI to generate content: the <strong className="text-foreground">Case Roadmap and guided case support tool</strong>, the <strong className="text-foreground">Attorney Document Generation</strong> tools in the Attorney Portal, and the <strong className="text-foreground">Document Summarizer</strong>. All three use <strong className="text-foreground">Anthropic's Claude Sonnet 4.6</strong>.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The <strong className="text-foreground">Case Roadmap</strong> also includes a <strong className="text-foreground">rule-based fallback engine</strong> that runs automatically when the AI service is unavailable. In fallback mode, guidance is generated from structured legal rules rather than a live AI model — no data is sent to Anthropic in that case. Attorney Document Generation and the Document Summarizer do not have this fallback and will display an error if the AI service is unavailable.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  All other content on this site — rights information, the record clearance screener, the court date guide, immigration guides, support resources, and all other static pages — does not use AI. It is manually researched and authored.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">The Case Roadmap</strong> also includes a civil emergency triage step that asks categorical questions about active situations (housing, employment, dependents, immigration). These answers follow the same session-only path as all other Case Roadmap inputs: held in server memory, auto-deleted in 24 hours, never written to a database.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  AI-generated guidance is not a substitute for advice from a licensed attorney. We cross-reference responses with legal databases to improve accuracy, but AI can make mistakes. Consult a qualified attorney before making legal decisions.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Before your inputs reach the AI, we automatically scan for and remove personal information (names, phone numbers, addresses, Social Security numbers). See our{" "}
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                    Privacy Policy
                  </Link>{" "}
                  for the full details on data handling.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Record and Eligibility Tools */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              Screening and Eligibility Tools
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  The <strong className="text-foreground">Record Clearance Eligibility Screener</strong> is a decision tree — it uses no AI and makes no server calls. It runs entirely in your browser. No data is transmitted or stored.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The <strong className="text-foreground">Collateral Consequences Screener</strong> is a yes/no questionnaire that flags life-area risks (housing, employment, immigration, custody, and more) based on your answers. It uses no AI and makes no server calls. Everything runs in your browser — no data leaves your device.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The <strong className="text-foreground">Public Defender Intake Checklist</strong> is an electronic intake form for attorneys and advocates. It runs entirely in your browser, makes no server calls, and generates a downloadable .docx file locally on your device. No data is transmitted or stored on our servers.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The <strong className="text-foreground">Mitigation Memo Builder</strong> helps attorneys and advocates structure client information into a formatted sentencing memo. It uses no AI and makes no server calls. The memo is generated as a .docx file entirely in your browser — no data is transmitted or stored on our servers.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The <strong className="text-foreground">Rap Sheet Error Identification Guide</strong> and <strong className="text-foreground">FCRA rights information</strong> are informational only. They describe general processes and rights. Verify all dispute procedures and deadlines directly with the relevant agency — the FBI, your state criminal repository, or the background check company.
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
              Attorney Tools
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Our document generation tools produce draft legal filings for use by licensed attorneys.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>All generated documents are drafts only — attorneys are solely responsible for reviewing and verifying accuracy before filing</li>
                  <li>We do not collect or store bar credentials, and we do not verify bar membership</li>
                  <li>Generated documents rely on jurisdiction-specific templates and third-party legal data that may contain errors or be outdated</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Public API */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              Public API
            </h2>

            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  OpenDefender offers a free, read-only public API at <code className="text-sm bg-muted px-1 py-0.5 rounded">/api/v1/</code> that lets third-party developers and legal aid organizations embed our legal reference data — charges, statutes, diversion programs, and glossary terms — into their own tools and websites.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>All API endpoints are <strong className="text-foreground">read-only</strong> — no user data is submitted or collected through the API</li>
                  <li>AI-powered guidance is not available through the public API — it requires direct use of the site</li>
                  <li>Data returned through the API is general legal reference information — it is not legal advice and does not establish an attorney-client relationship</li>
                  <li>Third parties who embed our data or widgets are responsible for including appropriate disclaimers in their own applications</li>
                  <li>Rate limits apply (60 requests per minute per IP) to ensure fair access</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  The same "general information only" limitation that applies on this site applies equally to any data accessed through the API. OpenDefender is not responsible for how third parties present or use data obtained through the public API.
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
                <span><strong className="font-semibold">Acknowledgement of Disclosures:</strong> By using this site, you acknowledge these disclaimers and understand the open source nature and limits of the platform.</span>
              </div>
            </AlertDescription>
          </Alert>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
