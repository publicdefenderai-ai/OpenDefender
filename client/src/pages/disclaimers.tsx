import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Link } from "wouter";

export default function Disclaimers() {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Colored Header */}
      <section className="vivid-header-alt py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
            Legal Notice & Disclaimers
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            Important information about using PublicDefenderAI
          </p>
          <p className="text-sm text-white/60 mt-2">
            Last updated: February 12, 2026
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
                  PublicDefenderAI is a free, open source tool that helps people understand and navigate the U.S. criminal justice and immigration systems. Think of it as a "public defender in your pocket." You're welcome to use it, share it, change it, or build on it however you'd like.
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
                  PublicDefenderAI is not the same as getting advice from a lawyer and does not establish an attorney-client relationship. We provide general information only. If you have a specific legal problem, it's best to talk to a qualified attorney.
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
                  We try to keep PublicDefenderAI working well, but it might not always be updated or available. Things can change without notice.
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
                  Use PublicDefenderAI at your own risk, and we are not responsible if something doesn't go as expected, or for any other problems or losses you might have from using this site.
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
                  PublicDefenderAI uses artificial intelligence to help generate legal guidance. Specifically, we use <strong className="text-foreground">Anthropic's Claude Sonnet 4</strong>, a large language model, to analyze your situation and provide information.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Important:</strong> AI-generated guidance is not a substitute for advice from a licensed attorney. While we verify responses against legal databases, AI can make mistakes. Always consult with a qualified lawyer for legal decisions.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Your privacy:</strong> Before your case details are sent to the AI, we automatically remove personal information like names, phone numbers, and addresses. See our{" "}
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                    Privacy Policy
                  </Link>{" "}
                  for details.
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
                  We provide content in English, Spanish, and Simplified Chinese to make legal information more accessible.
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
              Open Source Freedom
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Because PublicDefenderAI is open source and public domain under CC0, anyone can freely use or change it without any restrictions or promises. The public repository is available{" "}
                  <a 
                    href="https://github.com/shahabasghar/PublicDefenderAI" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    here
                  </a>.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Acknowledgement */}
        <ScrollReveal>
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong className="font-semibold">Acknowledgement of Disclosures:</strong> By using this site, you acknowledge these disclaimers and understand the open source nature and limits of the platform.
            </AlertDescription>
          </Alert>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
