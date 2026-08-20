import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Code,
  FileJson,
  Layout,
  Database,
  ExternalLink,
  BookOpen,
  Download,
  Search,
  Shield,
  RefreshCw,
  UserCheck,
  FileText,
  Scale,
  Lock,
  AlertTriangle,
  Layers,
  Clock,
  MessageSquare,
  Mail,
  Heart,
  Compass,
  ArrowRight,
} from "lucide-react";

const contentPages = [
  {
    section: "Constitutional Rights",
    pages: [
      {
        route: "/rights-info",
        title: "Know Your Rights",
        description: "Main rights hub. Covers Miranda rights, right to remain silent, right to an attorney, and protection from unreasonable searches. Includes scenario-based guidance for stop and frisk, vehicle searches, home searches, and phone searches — formerly split across /search-seizure, which now redirects here.",
      },
      {
        route: "/right-to-counsel",
        title: "Right to an Attorney",
        description: "5th vs. 6th Amendment right to counsel explained. When Miranda applies, what 'custody' means, how to invoke clearly, and the gap between arrest and arraignment. State-specific notes for CA, NY, TX, FL, and federal courts.",
      },
      {
        route: "/warrants",
        title: "Warrants & Your Rights",
        description: "What a valid warrant must contain, ICE administrative vs. judicial warrants, warrant exceptions (exigent circumstances, plain view, consent), and step-by-step door guidance.",
      },
    ],
  },
  {
    section: "Post-Arrest Guides",
    pages: [
      {
        route: "/first-24-hours",
        title: "First 24 Hours After Arrest",
        description: "Flagship feature. 7-step guide from arrest through booking, first phone call (with sample script and never-say categories), bail, and arraignment. Includes a state-by-state facility and inmate locator widget (all 50 states + DC + Federal via VINELink), a juvenile arrest callout, and three deep-dive accordion sections: when your right to counsel begins, what to do if arrested on probation or parole, and your first appearance before a magistrate.",
      },
      {
        route: "/case-timeline",
        title: "Criminal Case Timeline",
        description: "Interactive 7-stage visual timeline from arrest to sentencing with rights, tips, and jurisdiction-specific callouts per stage. Includes detailed bail and plea bargain accordion guides, speedy trial and public defender info cards, and a state selector. Formerly at /process, which redirects here.",
      },
      {
        route: "/collateral-consequences",
        title: "Collateral Consequences Screener",
        description: "Arrest-stage screener. Seven yes/no questions cover the life areas most immediately at risk from a criminal charge: active supervision (probation/parole), immigration status, children/custody, housing, employment, public benefits, and professional licenses. Answers produce a prioritized risk panel — urgent risks shown first with direct links to the relevant support pages. No AI, no login. The former /collateral-consequences-screener route redirects here.",
      },
      {
        route: "/case-guidance",
        title: "Case Roadmap",
        description: "Structured Q&A intake flow. Users select jurisdiction, charge type, and case stage; the platform surfaces relevant content, rights, and next steps organized for that stage of the process. Not a guidance or advice engine — it routes users to the right information. Powered by Claude with output validated against the statute database and CourtListener. Available at /case-guidance.",
      },
    ],
  },
  {
    section: "Life & Family Support",
    pages: [
      {
        route: "/support",
        title: "Life Support Hub",
        description: "Central hub linking to 11 support categories. Covers every major life area affected by a criminal charge or immigration matter. Each sub-page provides immediate action items, resource links, and plain-language explanations written at a 6th–8th grade reading level.",
      },
      {
        route: "/support/employment",
        title: "Employment & Work",
        description: "How to tell an employer about a criminal charge, employee rights during court proceedings, background check disclosures, and protections for workers with pending cases.",
      },
      {
        route: "/support/finances",
        title: "Financial Support",
        description: "Assessing legal costs, exploring public defender options, emergency financial assistance programs, and managing income disruption during court proceedings.",
      },
      {
        route: "/support/court-logistics",
        title: "Court Logistics",
        description: "Practical planning for court attendance: what to bring, what to wear, how to get there, how to arrange childcare and time off work. Includes three sub-pages: PD Intake Form (/intake-form), Court Date Guide (/court-date-guide), and Bail Preparation (/bail-preparation).",
      },
      {
        route: "/support/mental-health",
        title: "Mental Health",
        description: "Coping resources, crisis line contacts, and guidance on managing stress and anxiety during legal proceedings.",
      },
      {
        route: "/support/housing",
        title: "Housing",
        description: "Tenant rights during a criminal case, navigating lease agreements, and emergency housing resources.",
      },
      {
        route: "/support/childcare",
        title: "Childcare",
        description: "Emergency childcare planning, custody considerations during incarceration, and resources for parents navigating the system.",
      },
      {
        route: "/support/family-care",
        title: "Family Care",
        description: "Planning for dependents, communicating with family, and resources for families navigating a loved one's case.",
      },
      {
        route: "/support/transportation",
        title: "Transportation",
        description: "Getting to court without a car, transportation assistance programs, and license suspension resources.",
      },
      {
        route: "/support/reputation",
        title: "Record Clearance & Reputation",
        description: "Expungement and sealing eligibility rules for all 50 states + DC, organized by state. Covers the long-term collateral consequences of a conviction on employment, housing, voting rights, professional licenses, immigration, and public benefits. Includes a record clearance eligibility screener at /support/reputation/eligibility. The legacy /record-expungement route redirects here.",
      },
      {
        route: "/support/reentry",
        title: "Reentry",
        description: "Resources and action items for the transition after release: housing, employment, benefits restoration, and community support.",
      },
      {
        route: "/support/personal-health",
        title: "Personal Health",
        description: "Healthcare access during and after legal proceedings, prescription continuity, and health resources for people in the system.",
      },
      {
        route: "/friends-family",
        title: "For Friends & Family",
        description: "Orientation hub for people supporting someone who has been arrested. Covers what to do in the first 24 hours, how to communicate safely, and how to use the platform. Links to the full Life Support Hub and the Family Toolkit.",
      },
      {
        route: "/friends-family/toolkit",
        title: "Family Toolkit",
        description: "Practical toolkit for family members: contact scripts, facility lookup, document checklists, and a step-by-step guide for the days following an arrest.",
      },
    ],
  },
  {
    section: "Record Relief",
    pages: [
      {
        route: "/diversion-programs",
        title: "Diversion Programs",
        description: "111 pre-trial diversion and alternative sentencing programs covering all 50 states + DC + Federal. Includes metro-area drug courts and statewide specialty court portals. Filterable by state, county, and program type.",
      },
    ],
  },
  {
    section: "Immigration",
    pages: [
      {
        route: "/immigration-guidance",
        title: "Immigration Hub",
        description: "Central hub linking to all immigration resources. Includes a rapid-response hotlines widget with region selector.",
      },
      {
        route: "/immigration-guidance/know-your-rights",
        title: "ICE Encounter Rights",
        description: "Script-based guide for ICE encounters. Administrative vs. judicial warrant distinction. Printable red card.",
      },
      {
        route: "/immigration-guidance/raids-toolkit",
        title: "Raids Preparedness Toolkit",
        description: "Family safety planning, emergency contacts, power of attorney, and community rapid response coordination.",
      },
      {
        route: "/immigration-guidance/workplace-raids",
        title: "Workplace Raids",
        description: "Rights during an ICE workplace enforcement action, what employers can and cannot do, and immediate steps for workers and co-workers.",
      },
      {
        route: "/immigration-guidance/bond-hearings",
        title: "Immigration Bond Hearings",
        description: "Bond hearing process, how to request bond, factors immigration judges consider, and how to prepare.",
      },
      {
        route: "/immigration-guidance/daca-tps",
        title: "DACA and TPS",
        description: "Current eligibility requirements, renewal timelines, and status updates for Deferred Action for Childhood Arrivals and Temporary Protected Status.",
      },
      {
        route: "/immigration-guidance/family-planning",
        title: "Family Immigration Planning",
        description: "Emergency planning for families facing enforcement: power of attorney, childcare designations, document preparation.",
      },
      {
        route: "/immigration-guidance/find-attorney",
        title: "Find an Immigration Attorney",
        description: "How to find a qualified immigration attorney, including EOIR accredited representatives and pro bono resources.",
      },
      {
        route: "/immigration-guidance/find-detained",
        title: "Find a Detained Person",
        description: "Step-by-step guide to locating someone detained by ICE using the EOIR detainee locator and DHS tools.",
      },
      {
        route: "/immigration-guidance/after-deportation",
        title: "After Deportation",
        description: "Rights and resources for people who have been deported or who have a loved one facing deportation.",
      },
    ],
  },
  {
    section: "For Advocates",
    note: "Tools for public defenders, legal aid attorneys, and advocates. Core intake and document formatting run client-side. The optional AI Polish feature sends the entered mitigation fields to Anthropic through the OpenDefender server.",
    pages: [
      {
        route: "/for-advocates",
        title: "Advocate Tools Hub",
        description: "Landing page for public defenders and legal advocates. Links to the Intake Checklist and Mitigation Builder. Describes the intended audience and use cases for each tool.",
      },
      {
        route: "/for-advocates/intake-checklist",
        title: "Public Defender Intake Checklist",
        description: "Comprehensive first-meeting intake form covering: case identifiers (charges, court date, case number, jurisdiction), criminal history (probation, parole, open warrants, prior convictions), immigration status with automatic Padilla screening flag, housing stability, mental health and substance use history, medications if detained, dependent and caregiver status, and document collection checklist (ID, address, employment, character references, treatment records). Flag computation automatically raises critical alerts for active supervision, open warrants, and non-citizen status. Output can be printed or exported to .docx via the docx npm package.",
      },
      {
        route: "/for-advocates/mitigation-builder",
        title: "Mitigation Memo Builder",
        description: "Generates a formatted sentencing mitigation memo from structured form input. Core formatting and .docx export run in the browser. An optional AI Polish action sends populated fields to Claude to produce narrative prose; users should avoid unnecessary sensitive information and review the result.",
      },
    ],
  },
  {
    section: "Legal Resources",
    pages: [
      {
        route: "/legal-glossary",
        title: "Legal Glossary",
        description: "50 plain-language definitions written at a 6th grade reading level. Filterable by letter and category. Trilingual (EN/ES/ZH). Terms link to relevant content pages.",
      },
      {
        route: "/statutes",
        title: "Federal Statutes",
        description: "Complete verbatim text of key federal criminal statutes sourced from Cornell LII. Quarterly URL validation via GitHub Actions.",
      },
      {
        route: "/legal-aid",
        title: "Legal Aid Directory",
        description: "195+ verified organizations including federal public defenders, county public defenders, court-appointed programs, and EOIR/LSC legal aid providers. Quarterly link and phone number checks. Formerly at /resources, which redirects here.",
      },
      {
        route: "/court-locator",
        title: "Court & Resource Locator",
        description: "Find courts, public defender offices, and legal aid organizations near you. Uses OpenStreetMap/Nominatim for geocoding.",
      },
      {
        route: "/document-library",
        title: "Document Library",
        description: "Reference library of standard legal documents with plain-language explanations of what each document is, when it is issued, and what it means.",
      },
    ],
  },
  {
    section: "AI-Assisted Tools",
    note: "Identified features use Claude (claude-sonnet-4-6) through the Anthropic API and require ANTHROPIC_API_KEY. OpenDefender holds some inputs and outputs temporarily in server memory; Anthropic may retain API data for up to 30 days under its standard terms.",
    pages: [
      {
        route: "/case-guidance",
        title: "Case Roadmap",
        description: "Structured Q&A intake that routes users to relevant content based on jurisdiction, charge type, and case stage. See Platform Features for full details.",
      },
      {
        route: "/chat",
        title: "AI Chat",
        description: "Conversational case intake flow. Uses quick replies and guided steps to help users describe their situation and reach relevant resources. Includes a state selector, charge selector, case status panel, and document phase recommendations.",
      },
      {
        route: "/document-summarizer",
        title: "Document Summarizer",
        description: "Paste or upload a legal document (charging document, court order, plea agreement) and receive a plain-language summary at a 6th grade reading level.",
      },
      {
        route: "/letter-generator",
        title: "Letter Generator",
        description: "AI-assisted templates for letters to employers (court date notice, absence explanation, record disclosure), landlords (payment plan request, situation notice), and utility providers (hardship request). Copy, print, or save output.",
      },
      {
        route: "/for-advocates/mitigation-builder",
        title: "Mitigation Memo — AI Polish",
        description: "Optional action that sends populated mitigation fields to Claude to produce a narrative draft. The core builder and .docx export remain client-side.",
      },
      {
        route: "/attorney/documents",
        title: "Attorney Document Generation",
        description: "Creates legal filing drafts for verified attorney sessions using Claude and jurisdiction-specific templates. Attorneys must review facts, citations, formatting, privilege, and filing decisions.",
      },
      {
        route: "/attorney/document-summarizer",
        title: "Attorney Document Summarization",
        description: "Uses the same Anthropic-backed document summarization and question-answering service for verified attorney sessions.",
      },
    ],
  },
];

export default function TechDocs() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Technical Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Reference for developers, advocates, and organizations building on or forking OpenDefender
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            OpenDefender is an organized legal information platform — not a personalized guidance or advice engine.
            It helps users understand what is happening, what their options are, and where to find support.
            AI is used in a small number of specific, bounded features described below.
          </p>
        </div>

        {/* Developer Tools Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>REST API endpoints and usage</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Complete reference for the public API: search, charges, diversion programs,
                glossary terms, and bulk data export. No authentication required for read endpoints.
              </p>
              <Button asChild>
                <Link href="/api-docs">View API Docs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Layout className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Embeddable Widgets</CardTitle>
                  <CardDescription>Add legal resources to your website</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Embed search, Know Your Rights cards, and legal glossary widgets via iframe.
                Customizable themes, compact/full variants, and trilingual support (EN/ES/ZH).
              </p>
              <Button asChild>
                <Link href="/widgets">View Widgets</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <FileJson className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle>JSON Schemas</CardTitle>
                  <CardDescription>Data model specifications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                JSON Schema definitions for all API data models: CriminalCharge,
                DiversionProgram, GlossaryTerm, and ExpungementRule.
              </p>
              <Button variant="outline" asChild>
                <a href="/api/v1/schemas" target="_blank">
                  <FileJson className="h-4 w-4 mr-2" />
                  View Schemas
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                  <Download className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle>OpenAPI Specification</CardTitle>
                  <CardDescription>Machine-readable API definition</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download the OpenAPI 3.0 specification to generate client libraries or import
                into Postman or Swagger UI.
              </p>
              <Button variant="outline" asChild>
                <a href="/api/v1/openapi.json" target="_blank">
                  <Download className="h-4 w-4 mr-2" />
                  Download OpenAPI Spec
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Data Coverage */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">7,155</div>
                <div className="text-sm text-muted-foreground">Criminal Charges</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">57</div>
                <div className="text-sm text-muted-foreground">Jurisdictions</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">111</div>
                <div className="text-sm text-muted-foreground">Diversion Programs</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">195+</div>
                <div className="text-sm text-muted-foreground">Legal Aid Organizations</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">5,956</div>
                <div className="text-sm text-muted-foreground">Verified Statutes</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">50</div>
                <div className="text-sm text-muted-foreground">Glossary Terms</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">58+</div>
                <div className="text-sm text-muted-foreground">Content Pages</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Pages */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-2">Content Pages</h2>
          <p className="text-sm text-muted-foreground mb-6">
            All content pages are publicly accessible with no authentication required. Pages are built in React (TypeScript),
            use Wouter for routing, and support trilingual rendering via react-i18next where translations have been added.
            Organizations replicating the site should review the full route inventory below.
            Several legacy routes are permanent redirects and are noted where applicable rather than listed as active pages.
          </p>
          <div className="space-y-6">
            {contentPages.map((section) => (
              <Card key={section.section}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base">{section.section}</CardTitle>
                    {section.section === "AI-Assisted Tools" && (
                      <Badge variant="outline" className="text-xs shrink-0">Requires Anthropic API key</Badge>
                    )}
                  </div>
                  {"note" in section && section.note && (
                    <p className="text-xs text-muted-foreground mt-1">{section.note}</p>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {section.pages.map((page) => (
                      <div key={page.route} className="px-6 py-3 grid sm:grid-cols-[180px_1fr] gap-2 items-start">
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono self-start mt-0.5 break-all">
                          {page.route}
                        </code>
                        <div>
                          <p className="text-sm font-medium text-foreground">{page.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{page.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-2">Platform Features</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Features beyond static content pages. Each entry notes what credentials or configuration it requires.
            Organizations forking the project should review which of these they intend to include.
          </p>

          <div className="space-y-4">

            {/* First 24 Hours Hub */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <CardTitle className="text-base">First 24 Hours Hub</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">Flagship feature</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  The platform's primary resource for people immediately after an arrest. Available at{" "}
                  <code className="bg-muted px-1 rounded text-xs">/first-24-hours</code>. No AI, no login.
                </p>
                <ul className="space-y-1 list-none">
                  <li>
                    <ArrowRight className="inline h-3 w-3 mr-1" />
                    <strong className="text-foreground">7-step arrest-to-arraignment guide</strong> — arrest, booking, first phone call (with a sample script and a "never say" category list), bail hearing, right to counsel, arraignment, and post-arraignment.
                  </li>
                  <li>
                    <ArrowRight className="inline h-3 w-3 mr-1" />
                    <strong className="text-foreground">State-by-state facility and inmate locator</strong> — all 50 states + DC + Federal system via VINELink and direct DOC links. Implemented as a standalone widget at <code className="bg-muted px-1 rounded text-xs">components/legal/facility-lookup-widget.tsx</code>.
                  </li>
                  <li>
                    <ArrowRight className="inline h-3 w-3 mr-1" />
                    <strong className="text-foreground">Deep-dive accordion sections</strong> — when the right to counsel begins (5th vs. 6th Amendment, the arrest-to-arraignment gap), what to do if arrested while on probation or parole, and first appearance before a magistrate with jurisdiction-by-jurisdiction breakdown.
                  </li>
                  <li>
                    <ArrowRight className="inline h-3 w-3 mr-1" />
                    <strong className="text-foreground">Juvenile arrest callout</strong> and full EN/ES/ZH i18n support throughout.
                  </li>
                </ul>
                <p className="text-xs pt-1">
                  The former <code className="bg-muted px-1 rounded text-xs">/jail-phone-call</code> route permanently redirects to{" "}
                  <code className="bg-muted px-1 rounded text-xs">/first-24-hours#phone-call</code>.
                </p>
              </CardContent>
            </Card>

            {/* Life Support Hub */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  <CardTitle className="text-base">Life Support Hub</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  11 pages covering every major life area disrupted by a criminal charge or immigration matter: employment, finances, court logistics,
                  mental health, transportation, childcare, housing, family care, reputation and record clearance, reentry, and personal health.
                  Accessed at <code className="bg-muted px-1 rounded text-xs">/support</code> (hub) and individual sub-pages.
                </p>
                <p>
                  <strong className="text-foreground">Court Logistics</strong> includes three sub-pages: a public defender intake form
                  (<code className="bg-muted px-1 rounded text-xs">/support/court-logistics/intake-form</code>), a court date preparation guide
                  (<code className="bg-muted px-1 rounded text-xs">/support/court-logistics/court-date-guide</code>), and a bail preparation guide
                  (<code className="bg-muted px-1 rounded text-xs">/support/court-logistics/bail-preparation</code>).
                </p>
                <p>
                  <strong className="text-foreground">Reputation & Record Clearance</strong> (<code className="bg-muted px-1 rounded text-xs">/support/reputation</code>) consolidates
                  expungement eligibility rules for all 50 states + DC with the collateral consequences guide. A record clearance eligibility screener lives at
                  <code className="bg-muted px-1 rounded text-xs"> /support/reputation/eligibility</code>. The legacy route <code className="bg-muted px-1 rounded text-xs">/record-expungement</code> redirects
                  permanently to the eligibility screener. <code className="bg-muted px-1 rounded text-xs">/collateral-consequences</code> is a separate, live page (the consequence-risk screener), not a redirect.
                </p>
                <p>No AI, no login required for any page in this section.</p>
              </CardContent>
            </Card>

            {/* Case Roadmap */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Compass className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-base">Case Roadmap</CardTitle>
                  <Badge variant="outline" className="text-xs">Requires Anthropic API key</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  A structured Q&A intake flow at <code className="bg-muted px-1 rounded text-xs">/case-guidance</code>. Users select a jurisdiction, charge type, and case stage.
                  The platform then surfaces rights, deadlines, immediate actions, and resource recommendations relevant to that specific intersection — drawing from the statute database
                  and the content library. This is an <strong className="text-foreground">orientation tool</strong>, not a legal advice or personalized guidance engine.
                  It tells users what is typically true for their situation, not what they should do.
                </p>
                <p>
                  <strong className="text-foreground">AI role:</strong> Claude generates the structured output (rights list, action items, deadlines, resources) for a given jurisdiction/charge/stage combination.
                  Output is cross-referenced against the statute database before display. A rule-based fallback engine activates when the AI is unavailable.
                </p>
                <p>
                  <strong className="text-foreground">Privacy:</strong> No permanent case database is used. Case records are held in temporary server memory and generally expire within 24 hours or on service restart.
                  No user identity is passed to the AI.
                </p>
                <p>
                  <strong className="text-foreground">Cost controls:</strong> Per-request ceiling of $0.25. Session-level budget cap configurable via environment variable.
                </p>
              </CardContent>
            </Card>

            {/* AI Chat */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <CardTitle className="text-base">AI Chat</CardTitle>
                  <Badge variant="outline" className="text-xs">Requires Anthropic API key</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Conversational case intake at <code className="bg-muted px-1 rounded text-xs">/chat</code>. Uses a guided quick-reply flow with a state selector, charge selector,
                  and case status panel to help users describe their situation step by step. Surfaces relevant legal documents by case phase via{" "}
                  <code className="bg-muted px-1 rounded text-xs">shared/legal-documents.ts</code>. Includes a progress indicator and a typing indicator for pacing.
                </p>
                <p>
                  Like the Case Roadmap, this is an orientation and routing tool — not a legal advice interface. Case records are held in server memory and generally expire within 24 hours or on service restart.
                </p>
              </CardContent>
            </Card>

            {/* Document Summarizer */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <CardTitle className="text-base">Document Summarizer</CardTitle>
                  <Badge variant="outline" className="text-xs">Requires Anthropic API key</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  Available at <code className="bg-muted px-1 rounded text-xs">/document-summarizer</code>. Users paste or upload a legal document
                  (charging document, court order, plea agreement) and receive a plain-language summary written at a 6th grade reading level.
                  Document bytes and extracted text are processed temporarily in server memory rather than saved to a persistent document database. Anthropic may retain API inputs for up to 30 days under its standard terms.
                  Uses prompt caching on the system prompt to reduce latency on repeated calls.
                </p>
              </CardContent>
            </Card>

            {/* Letter Generator */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-base">Letter Generator</CardTitle>
                  <Badge variant="outline" className="text-xs">Requires Anthropic API key</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Available at <code className="bg-muted px-1 rounded text-xs">/letter-generator</code>. Generates ready-to-send letters for three contexts people commonly face during a criminal case:
                </p>
                <ul className="space-y-1 list-none">
                  <li>— <strong className="text-foreground">Employer letters</strong> — court date notice, absence explanation, record disclosure</li>
                  <li>— <strong className="text-foreground">Landlord letters</strong> — payment plan request, situation notice</li>
                  <li>— <strong className="text-foreground">Utility provider letters</strong> — hardship request</li>
                </ul>
                <p>
                  Users complete a short form; AI fills in the letter body. Output can be copied, printed, or saved. The request is processed by Anthropic; users should avoid unnecessary sensitive details and review the output.
                </p>
              </CardContent>
            </Card>

            {/* Jury Instruction References */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <CardTitle className="text-base">Jury Instruction References</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Pattern jury instructions — the exact standards a jury must apply to convict on a given charge — are surfaced alongside charge information throughout the platform.
                  Each entry in <code className="bg-muted px-1 rounded text-xs">shared/criminal-charge-citations.ts</code> supports two optional fields:
                </p>
                <ul className="space-y-1 list-none">
                  <li>— <strong className="text-foreground">instructionRef</strong> — the instruction number in its official set (e.g., "CALCRIM 1600", "CJI2d 125.25", "OUJI-CR 4-18", "WPIC 35.50")</li>
                  <li>— <strong className="text-foreground">instructionUrl</strong> — direct link to the court-hosted HTML or PDF where available</li>
                </ul>
                <p>
                  When present, these appear in three surfaces: (1) the guidance dashboard charges card with an info tooltip explaining what jury instructions are (trilingual EN/ES/ZH), (2) the Q&A flow charge selector, and (3) the public charge search API widget.
                  For paywalled instruction sets — such as Kentucky (LexisNexis) or Oregon (LexisNexis) — the reference label is shown without a link, with a note indicating availability via Westlaw or LexisNexis.
                </p>
                <p>
                  <strong className="text-foreground">Testing:</strong> Vitest regression tests in <code className="bg-muted px-1 rounded text-xs">tests/jury-instructions.test.ts</code> cover display logic and link validation.
                  A link checker script (<code className="bg-muted px-1 rounded text-xs">scripts/check-jury-instruction-links.ts</code>) can be run manually to flag broken instruction URLs before release.
                </p>
              </CardContent>
            </Card>

            {/* LOCUS Municipal Ordinance Context */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle className="text-base">LOCUS Municipal Ordinance Context</CardTitle>
                  <Badge variant="secondary" className="text-xs">No API key required</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  For charges with local-ordinance-relevant keywords (loitering, trespass, disorderly conduct, public intoxication, noise, curfew, park rules), the platform queries the{" "}
                  <strong className="text-foreground">LOCUS-v1</strong> dataset (LocalLaws / UC Berkeley) for the actual municipal ordinance text and injects it into Claude's prompt as context.
                  This gives AI guidance access to the specific local ordinance rather than relying on general statutory knowledge.
                </p>
                <p>
                  <strong className="text-foreground">Data source:</strong> HuggingFace Datasets Server API — <code className="bg-muted px-1 rounded text-xs">LocalLaws/LOCUS-v1</code>. Free, no API key.
                  License: CC-BY-NC-4.0. Citation: Peskoff, Barrow, Vu &amp; Davenport et al. (2026), <em>Freeing the Law with LOCUS</em>, arXiv:2606.19334.
                </p>
                <p>
                  <strong className="text-foreground">Implementation:</strong> <code className="bg-muted px-1 rounded text-xs">server/services/locus-lookup.ts</code>.
                  Results are cached for 10 minutes per keyword/state pair. Lookup has an 8-second timeout; on failure, guidance proceeds without ordinance context.
                  When an ordinance is found, the metadata (section number, jurisdiction) surfaces in the guidance dashboard as a MapPin attribution line and inside the sourcing collapsible.
                </p>
              </CardContent>
            </Card>

            {/* AI Accuracy */}
            <Card id="ai-validation">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <CardTitle className="text-base">AI Output Validation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  AI is used in four features: Case Roadmap, AI Chat, Document Summarizer, and Letter Generator. In all cases, the AI's role is bounded and the output is structured.
                  It does not provide open-ended legal analysis.
                </p>

                <div className="space-y-3">
                  <div className="border-l-2 border-teal-400 pl-4 space-y-1">
                    <p className="font-medium text-foreground">Statute database check (Case Roadmap)</p>
                    <p>
                      Statutory citations in Case Roadmap output are cross-referenced against a database of 5,956 statute records spanning 51 jurisdictions (all 50 states + DC).
                      The check verifies that cited code sections exist and that the AI's description of the penalty or element is consistent with the statute's text.
                      Output that fails this check triggers a "requires confirmation" banner rather than being suppressed.
                    </p>
                  </div>

                  <div className="border-l-2 border-blue-400 pl-4 space-y-1">
                    <p className="font-medium text-foreground">Safety scanner (all AI features)</p>
                    <p>
                      Before delivery, every AI response is run through a rule-based scanner that removes content crossing defined harm thresholds
                      (e.g., suggestions to destroy evidence, resist arrest, or make false statements).
                      When content is removed, the user sees a notice. The scanner does not rewrite AI analysis — it removes only.
                    </p>
                  </div>
                </div>

                <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-3 text-amber-800 dark:text-amber-200 text-xs">
                  <p>
                    <strong>Always verify:</strong> Treat AI-generated deadlines, timelines, and procedural descriptions as a starting point to confirm with a public defender or legal aid attorney — not a final answer.
                    When you see the "requires confirmation" banner, that is a signal that the AI was less certain about that specific jurisdiction.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Alternative AI Providers */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <CardTitle className="text-base">Alternative AI Providers (OpenRouter)</CardTitle>
                  <Badge variant="secondary" className="text-xs">For forks only</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  OpenDefender uses Anthropic's Claude API directly. <strong className="text-foreground">We do not use OpenRouter</strong> and do not plan to.
                  OpenRouter is a third-party proxy — user-submitted case data passes through an intermediary before reaching the model.
                  For a platform serving people in legal distress, that intermediary layer is an unacceptable privacy risk.
                </p>
                <p>If you are forking this project and want to use OpenRouter or a different provider:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">1.</code>
                    <span>Set your provider key (e.g., <code className="bg-background px-1 rounded text-xs">OPENROUTER_API_KEY</code>) in place of <code className="bg-background px-1 rounded text-xs">ANTHROPIC_API_KEY</code>.</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">2.</code>
                    <span>Replace the Anthropic SDK client in <code className="bg-background px-1 rounded text-xs">server/services/</code> with an OpenAI-compatible client pointed at your provider's base URL, using your key as the bearer token.</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">3.</code>
                    <span>Update <code className="bg-background px-1 rounded text-xs">server/config/ai-model.ts</code> to export the model string for your provider (e.g., <code className="bg-background px-1 rounded text-xs">anthropic/claude-sonnet-4-6</code>, <code className="bg-background px-1 rounded text-xs">openai/gpt-4o</code>).</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">4.</code>
                    <span>Prompt caching (used in the Document Summarizer and Case Roadmap system prompts) is Anthropic-specific. Cache control headers are silently ignored by other providers — this is safe but increases latency and token cost on repeated calls.</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">5.</code>
                    <span>Update your privacy disclosure to reflect which providers your deployment uses and their data retention policies. Do not carry forward Anthropic's 30-day retention language if you are routing through a different provider.</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attorney Document Generation */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="text-base">Attorney Document Generation</CardTitle>
                  <Badge variant="outline" className="text-xs">Verified access</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Available through the Legal Aid Directory (<code className="bg-muted px-1 rounded text-xs">/directory</code>) to verified defense attorneys and legal aid organizations.
                  Provides jurisdiction-specific motion templates across all 50 states + DC.
                </p>
                <p>
                  <strong className="text-foreground">Motion templates:</strong> Suppression, dismissal, bail reduction, continuance, probation violation response, notice of appeal, and 20+ additional templates.
                  Output formatted as PDF via jsPDF with jurisdiction-specific customization applied by Claude.
                </p>
                <p>
                  <strong className="text-foreground">Sessions:</strong> Attorney sessions are extended to one hour. Authentication can be disabled per-deployment via the{" "}
                  <code className="bg-muted px-1 rounded text-xs">ADMIN_DISABLE_AUTH</code> environment variable — never via <code className="bg-muted px-1 rounded text-xs">NODE_ENV</code>.
                </p>
              </CardContent>
            </Card>

            {/* Search */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <CardTitle className="text-base">Search</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Full-text search across all content types: charges, glossary terms, diversion programs, expungement rules, rights pages, immigration pages, and all 58+ site pages.
                  Implemented server-side in <code className="bg-muted px-1 rounded text-xs">server/services/search-indexer.ts</code>. Index is built at server startup in approximately 15ms.
                </p>
                <p>
                  <strong className="text-foreground">Fuzzy typo tolerance:</strong> A Levenshtein distance algorithm corrects single-character typos in non-trivial query terms against the full indexed vocabulary before scoring runs. This means misspellings like "assaul" or "tresapss" still return correct results.
                </p>
                <p>
                  <strong className="text-foreground">Legal synonym expansion:</strong> Queries are expanded via a curated synonym map (e.g., "lawyer" finds "attorney", "counsel"). Multi-word queries are also scored on individual meaningful terms.
                </p>
                <p>
                  <strong className="text-foreground">Scoring:</strong> Exact title match (100pts) → alias match (80pts) → title partial (50pts) → alias partial (40pts) → tag match (30pts) → content frequency (up to 25pts). Type boosts: charges 1.3×, glossary 1.2×, rights_info 1.15×.
                </p>
                <p>
                  <strong className="text-foreground">Manual indexing required:</strong> New pages must be added to the <code className="bg-muted px-1 rounded text-xs">sitePages</code> array in search-indexer.ts — routes are not auto-discovered.
                </p>
              </CardContent>
            </Card>

            {/* Privacy Architecture */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <CardTitle className="text-base">Privacy Architecture</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>The platform is designed for users in legal distress who may be at risk. It minimizes data but still uses an essential session cookie, temporary in-memory records, standard operational logs, and disclosed third-party processors.</p>
                <ul className="space-y-1 list-none">
                  <li>— Case and feedback records are held in server memory and generally expire within 24 hours; guidance responses may be cached in memory for about 15 minutes</li>
                  <li>— Some consent and audit metadata may remain in memory until service restart; infrastructure providers may retain operational logs</li>
                  <li>— Anthropic may retain AI inputs and outputs for up to 30 days under its standard commercial API terms</li>
                  <li>— No analytics identifiers or fingerprinting</li>
                  <li>— An essential <code className="bg-muted px-1 rounded text-xs">od.sid</code> cookie, normally valid for 24 hours, provides session security and record ownership</li>
                  <li>— Session cache keys are prefixed by session ID to prevent cross-session data leakage</li>
                  <li>— An NLP-based redactor (<code className="bg-muted px-1 rounded text-xs">compromise.js</code>) attempts to remove common identifiers before AI processing, but automated redaction may miss sensitive details</li>
                  <li>— CSS color injection uses an allowlist (<code className="bg-muted px-1 rounded text-xs">sanitizeColor()</code>) to prevent XSS</li>
                  <li>— No test or admin routes exposed in production</li>
                  <li>— Admin auth requires explicit <code className="bg-muted px-1 rounded text-xs">ADMIN_DISABLE_AUTH=true</code> env var, never gated on <code className="bg-muted px-1 rounded text-xs">NODE_ENV</code></li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Data Quality */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Data Quality & Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Five GitHub Actions workflows run quarterly to flag stale external data. They do not auto-update content — they open a GitHub Issue listing items requiring manual review.</p>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">check-legal-aid.ts</code>
                <span>HTTP checks all legal aid organization URLs (195+ entries). Outputs <code className="bg-background px-1 rounded text-xs">legal-aid-diff.json</code> with any that return non-200 or redirect.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">check-public-defenders.ts</code>
                <span>HTTP checks all public defender and court-appointed program websites; flags entries with missing phone numbers. Outputs <code className="bg-background px-1 rounded text-xs">public-defenders-diff.json</code>.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">check-federal-statutes.ts</code>
                <span>HEAD checks all Cornell LII statute URLs in the database. Outputs <code className="bg-background px-1 rounded text-xs">statutes-diff.json</code>.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">check-diversion-programs.ts</code>
                <span>HEAD/GET checks all 111 diversion program contact URLs. Treats 403/999 CDN bot-blocks as live; exits non-zero on true 404/error. Outputs <code className="bg-background px-1 rounded text-xs">diversion-link-report.json</code>.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">check-detention-facilities.ts</code>
                <span>
                  Three-phase audit for the <code className="bg-background px-1 rounded text-xs">/find-detained</code> page.
                  (1) HEAD-checks the ICE Online Detainee Locator URL and ICE/NIJC reference pages.
                  (2) Fetches the ICE ERO contact page and NIJC website and scans for the two hardcoded hotline numbers
                  (<code className="bg-background px-1 rounded text-xs">1-888-351-4024</code>, <code className="bg-background px-1 rounded text-xs">312-660-1370</code>) — flags if either is absent.
                  (3) Prints all 27 detention facility records (30 phone numbers) grouped by state for manual cross-check against
                  <code className="bg-background px-1 rounded text-xs">ice.gov/detention-facilities</code>.
                  Outputs <code className="bg-background px-1 rounded text-xs">detention-facilities-report.json</code>.
                  Note: phone numbers cannot be verified programmatically — manual review is always required for the facility table.
                </span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">generate-report.ts</code>
                <span>Reads all diff outputs and opens a GitHub Issue listing items needing manual review.</span>
              </div>
            </div>
            <p>Organizations forking this project should retain these workflows or implement equivalent checks. Statute content uses complete verbatim text — no excerpts or truncation.</p>
          </CardContent>
        </Card>

        {/* Content Standards */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Content Standards for Forks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>If you are deploying a fork, the following standards are built into the platform and should not be removed:</p>
            <ul className="space-y-2 list-none">
              <li>— <strong className="text-foreground">6th–8th grade reading level:</strong> All user-facing content, AI prompts, and tooltip text. Legal terms may appear as labels but must be explained immediately in plain language.</li>
              <li>— <strong className="text-foreground">No placeholder or fabricated data:</strong> If real data is unavailable for a jurisdiction, surface a "data not available" message. Do not invent phone numbers, addresses, or contact info.</li>
              <li>— <strong className="text-foreground">Source and date all statistics:</strong> Any statistic shown to users must name the source organization and data year.</li>
              <li>— <strong className="text-foreground">Complete statute text:</strong> Statute entries must contain the full verbatim text of the statute, not excerpts. Truncation with "..." is not permitted.</li>
              <li>— <strong className="text-foreground">Verified external contacts:</strong> Legal aid organization addresses, phone numbers, and websites must be verified against the organization's live website before publishing.</li>
              <li>— <strong className="text-foreground">Jurisdiction defaults:</strong> Forms must default to "Other / Generic" unless the user has specified a state. Do not default to any specific jurisdiction.</li>
              <li>— <strong className="text-foreground">Platform scope:</strong> OpenDefender is an orientation tool. If your fork adds AI guidance that goes beyond orientation and information delivery, you are responsible for complying with applicable rules on the unauthorized practice of law.</li>
            </ul>
            <p className="mt-2">These rules are documented in detail in <code className="bg-muted px-1 rounded text-xs">CLAUDE.md</code> at the project root.</p>
          </CardContent>
        </Card>

        {/* Reusing Individual Features */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Reusing Individual Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <p className="text-muted-foreground">
              OpenDefender is MIT-licensed. You are free to copy any part of the site into your own project.
              Each significant feature lives in its own component file with a documented header listing
              exactly which files, i18n keys, npm packages, and backend calls it needs. The table below
              covers the most portable standalone features.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-semibold">Feature</th>
                    <th className="text-left py-2 pr-4 font-semibold">Component file</th>
                    <th className="text-left py-2 pr-4 font-semibold">Backend?</th>
                    <th className="text-left py-2 font-semibold">i18n namespace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {[
                    {
                      feature: "Facility / Inmate Locator",
                      file: "components/legal/facility-lookup-widget.tsx",
                      backend: "None",
                      i18n: "first24Hours.facilityLookup.*",
                    },
                    {
                      feature: "Rapid Response Hotlines",
                      file: "components/immigration/rapid-response-section.tsx",
                      backend: "None",
                      i18n: "immigration.rapidResponse.*",
                    },
                    {
                      feature: "Know Your Rights Card",
                      file: "components/widgets/rights-card.tsx",
                      backend: "None",
                      i18n: "None (content hardcoded)",
                    },
                    {
                      feature: "Legal Glossary Widget",
                      file: "components/widgets/glossary-widget.tsx",
                      backend: "GET /api/v1/glossary",
                      i18n: "None (content from API)",
                    },
                    {
                      feature: "Site Search Widget",
                      file: "components/widgets/embeddable-search.tsx",
                      backend: "GET /api/v1/search",
                      i18n: "None (labels hardcoded)",
                    },
                    {
                      feature: "Diversion Program Card",
                      file: "components/legal/diversion-program-card.tsx",
                      backend: "None",
                      i18n: "diversionPrograms.programCard.*",
                    },
                    {
                      feature: "Deportation Phase Carousel",
                      file: "pages/immigration-guidance.tsx → DeportationPhasesCarousel",
                      backend: "None",
                      i18n: "immigration.deportationPhases.*",
                    },
                    {
                      feature: "Case Timeline",
                      file: "pages/case-timeline.tsx",
                      backend: "None",
                      i18n: "caseTimeline.*",
                    },
                    {
                      feature: "Collateral Consequences Screener",
                      file: "pages/collateral-consequences.tsx",
                      backend: "None",
                      i18n: "collateralConsequences.*",
                    },
                    {
                      feature: "Public Defender Intake Checklist",
                      file: "pages/for-advocates/intake-checklist.tsx",
                      backend: "None (.docx export only)",
                      i18n: "None (content hardcoded)",
                    },
                    {
                      feature: "Mitigation Memo Builder",
                      file: "pages/for-advocates/mitigation-builder.tsx",
                      backend: "None (.docx export only)",
                      i18n: "None (content hardcoded)",
                    },
                  ].map((row) => (
                    <tr key={row.feature}>
                      <td className="py-2 pr-4 font-medium">{row.feature}</td>
                      <td className="py-2 pr-4 font-mono text-muted-foreground">{row.file}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{row.backend}</td>
                      <td className="py-2 font-mono text-muted-foreground">{row.i18n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm">How to copy a feature into your project</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-xs leading-relaxed">
                <li>
                  <strong className="text-foreground">Copy the component file</strong> listed above into your project.
                  Read its <code className="bg-muted px-1 rounded">@standalone-use</code> JSDoc header —
                  it lists every dependency explicitly.
                </li>
                <li>
                  <strong className="text-foreground">Install npm packages</strong> listed in the header
                  (shadcn/ui, lucide-react, react-i18next, and @tanstack/react-query are the most common).
                </li>
                <li>
                  <strong className="text-foreground">Copy i18n keys</strong> from{" "}
                  <code className="bg-muted px-1 rounded">client/src/locales/en.ts</code> under the namespace
                  listed in the table. Spanish and Chinese translations are in{" "}
                  <code className="bg-muted px-1 rounded">es.ts</code> and{" "}
                  <code className="bg-muted px-1 rounded">zh.ts</code>.
                </li>
                <li>
                  <strong className="text-foreground">For API-dependent widgets</strong>, point{" "}
                  <code className="bg-muted px-1 rounded">baseUrl</code> at your own OpenDefender instance
                  or at <code className="bg-muted px-1 rounded">https://opendefender.io</code> (subject to rate limits).
                </li>
                <li>
                  <strong className="text-foreground">Adapt the Tailwind theme</strong> — components use
                  CSS variables (<code className="bg-muted px-1 rounded">--background</code>,{" "}
                  <code className="bg-muted px-1 rounded">--foreground</code>, etc.) from shadcn's default theme.
                  Override them in your CSS to match your brand.
                </li>
              </ol>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-4 text-xs text-amber-900 dark:text-amber-200">
              <strong>Content standards apply to reuse.</strong> If you display legal information derived
              from OpenDefender, you must follow the same accuracy rules: no placeholder data, statutory
              citations must be verified, and reading level must remain accessible (6th–8th grade).
              See the Content Standards for Forks section above.
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              <a
                href="/api/v1/search?q=theft"
                target="_blank"
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Try Search API</span>
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </a>
              <a
                href="/api/v1/charges?jurisdiction=CA&limit=5"
                target="_blank"
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <Code className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Sample Charges (CA)</span>
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </a>
              <a
                href="/api/v1/glossary"
                target="_blank"
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Legal Glossary</span>
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </a>
              <a
                href="/api/v1/export/charges?format=csv&limit=100"
                target="_blank"
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Export Sample (CSV)</span>
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </a>
              <Link
                href="/data-sources"
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Data Sources &amp; Methodology</span>
              </Link>
              <a
                href="https://github.com/publicdefenderai-ai/OpenDefender"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">GitHub Repository</span>
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </a>
              <a
                href="/api/v1/openapi.json"
                target="_blank"
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <FileJson className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">OpenAPI JSON</span>
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
