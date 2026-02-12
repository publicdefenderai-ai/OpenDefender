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
                  Our platform provides general information about immigration topics including Know Your Rights materials, DACA/TPS guidance, workplace raid preparedness, bond hearings, and Red Card resources. Please be aware that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Immigration law is highly complex and changes frequently through executive orders, policy memos, and court rulings</li>
                  <li>Know Your Rights cards and related materials are informational resources, not a legal shield — presenting them does not guarantee any particular outcome during an encounter with immigration authorities</li>
                  <li>Information about DACA, TPS, bond hearings, and other immigration programs may become outdated as policies change</li>
                  <li>Every immigration case is unique, and general guidance cannot account for the specific facts of your situation</li>
                  <li>You should consult with a qualified immigration attorney before making any decisions that could affect your immigration status</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Important:</strong> If you are in removal proceedings or facing immigration enforcement, seek legal counsel immediately. Our{" "}
                  <Link href="/immigration-guidance/find-attorney" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                    Find an Attorney
                  </Link>{" "}
                  page can help you locate immigration legal services in your area.
                </p>
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
                  PublicDefenderAI provides content in English, Spanish, and Simplified Chinese to make legal information more accessible. Please note:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Translations are provided for accessibility purposes and may not be word-for-word legal translations</li>
                  <li>Legal terms can have specific meanings that do not translate precisely between languages</li>
                  <li>In the event of any discrepancy between language versions, the English version should be considered authoritative</li>
                  <li>Court filings, legal documents, and official proceedings in the United States generally require English</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  We strive to make our translations as accurate as possible, but we recommend consulting a bilingual attorney if you need legal guidance in a language other than English.
                </p>
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
                  Our Document Summarizer uses AI to create condensed summaries of legal documents you upload. When using this feature, please understand that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Summaries are AI-generated interpretations and may omit important details, nuances, or qualifications present in the original document</li>
                  <li>A summary is not a substitute for reading the full document, especially for court filings, plea agreements, or contracts</li>
                  <li>Legal documents often contain interconnected clauses where context matters — a summary may not capture these relationships</li>
                  <li>Always review the original document with your attorney before making decisions based on a summary</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  See our{" "}
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                    Privacy Policy
                  </Link>{" "}
                  for details on how uploaded documents are handled and protected.
                </p>
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
                  PublicDefenderAI retrieves court records, case law, and docket information from external sources including the RECAP Archive, CourtListener, and PACER. Please be aware that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Court records retrieved through these services may be incomplete, delayed, or contain errors</li>
                  <li>Not all federal or state court records are available through these databases</li>
                  <li>Docket entries and case documents may not reflect the most recent filings or rulings</li>
                  <li>Case law search results are provided for informational purposes and should not be relied upon as a comprehensive legal research tool</li>
                  <li>Always verify court records directly with the relevant court clerk's office for official and up-to-date information</li>
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
                  Licensed attorneys may use our document generation tools to draft legal filings. By using these tools, attorneys acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Documents are generated as drafts only and require professional review before filing</li>
                  <li>Attorneys are solely responsible for verifying accuracy before filing</li>
                  <li>Attorneys must provide truthful attestation of bar membership</li>
                  <li>We are not liable for false attestations or unauthorized use</li>
                  <li>We do not verify bar credentials against external databases</li>
                  <li>Attorney-client privilege protections depend on proper use by the attorney</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Warning:</strong> Misrepresenting bar membership or using these tools without authorization may violate state bar rules and applicable laws.
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
