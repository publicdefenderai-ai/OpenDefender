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
} from "lucide-react";

const contentPages = [
  {
    section: "Constitutional Rights",
    pages: [
      { route: "/rights-info", title: "Know Your Rights", description: "Miranda, right to remain silent, right to an attorney, protection from unreasonable searches. The main rights hub." },
      { route: "/search-seizure", title: "Search & Seizure Rights", description: "Scenario-based guide: stop and frisk, vehicle searches, home searches, phone searches. Includes what to do and what not to do." },
      { route: "/right-to-counsel", title: "Right to an Attorney", description: "5th vs. 6th Amendment right to counsel explained. When Miranda applies, what 'custody' means, how to invoke clearly." },
      { route: "/warrants", title: "Warrants & Your Rights", description: "What a valid warrant must contain, ICE administrative vs. judicial warrants, warrant exceptions (exigent circumstances, plain view, consent), and step-by-step door guidance." },
    ],
  },
  {
    section: "Post-Arrest Guides",
    pages: [
      { route: "/first-24-hours", title: "First 24 Hours After Arrest", description: "Step-by-step guide from moment of arrest through booking, first phone call, bail hearing, and arraignment." },
      { route: "/jail-phone-call", title: "Jail Phone Call Guide", description: "What to say and what never to say on a recorded jail call. What to ask family. How attorney calls differ." },
      { route: "/quick-reference", title: "Quick Reference Cards", description: "Printable scenario cards for police stops, arraignment, bail hearing, pretrial, plea, and sentencing. Available in tabbed and print-all views." },
      { route: "/case-timeline", title: "Case Timeline", description: "Interactive timeline of the criminal justice process from arrest to sentencing with state-specific deadline information." },
      { route: "/collateral-consequences", title: "Hidden Consequences of a Conviction", description: "Employment, housing, voting rights, professional licenses, immigration, public benefits, and more. Organized by category with jurisdiction notes." },
    ],
  },
  {
    section: "Record Relief",
    pages: [
      { route: "/diversion-programs", title: "Diversion Programs", description: "73 pre-trial diversion and alternative sentencing programs across major U.S. metros. Filterable by state, county, and program type." },
      { route: "/record-expungement", title: "Record Expungement", description: "Eligibility rules and waiting periods for all 50 states plus DC. Searchable by state." },
    ],
  },
  {
    section: "Immigration",
    pages: [
      { route: "/immigration-guidance", title: "Immigration Hub", description: "Central hub linking to all immigration resources." },
      { route: "/immigration-guidance/know-your-rights", title: "ICE Encounter Rights", description: "Script-based guide for ICE encounters. Administrative vs. judicial warrant distinction. Printable red card." },
      { route: "/immigration-guidance/raids-toolkit", title: "Raids Preparedness Toolkit", description: "Family safety planning, emergency contacts, power of attorney, community rapid response." },
      { route: "/immigration-guidance/bond-hearings", title: "Immigration Bond Hearings", description: "Bond hearing process, how to request bond, factors judges consider." },
      { route: "/immigration-guidance/daca-tps", title: "DACA and TPS", description: "Current eligibility requirements, renewal timelines, and status updates." },
      { route: "/immigration-guidance/family-planning", title: "Family Immigration Planning", description: "Emergency planning for families facing enforcement: power of attorney, childcare, documents." },
    ],
  },
  {
    section: "Legal Resources",
    pages: [
      { route: "/legal-glossary", title: "Legal Glossary", description: "46 plain-language definitions written at a 6th grade reading level. Filterable by letter and category. Trilingual (EN/ES/ZH). Terms link to relevant content pages." },
      { route: "/statutes", title: "Federal Statutes", description: "Complete verbatim text of key federal criminal statutes sourced from Cornell LII. Quarterly URL validation via GitHub Actions." },
      { route: "/legal-aid", title: "Legal Aid Directory", description: "24 verified legal aid organizations with addresses, phone numbers, and websites. Quarterly link checks." },
      { route: "/court-locator", title: "Court & Resource Locator", description: "Find courts, public defender offices, and legal aid organizations near you." },
      { route: "/process", title: "Criminal Justice Process", description: "Overview of the full criminal justice process with mock Q&A preparation for each stage." },
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
            Resources for developers and organizations integrating with or replicating OpenDefender
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
                Complete reference for our public API including search, charges, diversion programs,
                glossary terms, and bulk data export endpoints. No authentication required.
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
                JSON Schema definitions for all API data models including CriminalCharge,
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
                into tools like Postman or Swagger UI.
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
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">4,144+</div>
                <div className="text-sm text-muted-foreground">Criminal Charges</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">51</div>
                <div className="text-sm text-muted-foreground">Jurisdictions</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">73</div>
                <div className="text-sm text-muted-foreground">Diversion Programs</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">46</div>
                <div className="text-sm text-muted-foreground">Glossary Terms</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Pages */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-2">Content Pages</h2>
          <p className="text-sm text-muted-foreground mb-6">
            All content pages are publicly accessible with no authentication. Organizations replicating the site should be aware of the full page inventory. Pages are built in React (TypeScript), use Wouter for routing, and support trilingual rendering via react-i18next where translations have been added.
          </p>
          <div className="space-y-6">
            {contentPages.map((section) => (
              <Card key={section.section}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{section.section}</CardTitle>
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
            Features beyond static content pages. Organizations forking the project should review which of these they intend to include and what configuration or credentials each requires.
          </p>

          <div className="space-y-4">

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-base">AI Case Guidance</CardTitle>
                  <Badge variant="outline" className="text-xs">Requires Anthropic API key</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Session-based AI guidance powered by Claude. Users describe their situation and receive scenario-specific information about their rights, likely charges, and process. Available at <code className="bg-muted px-1 rounded text-xs">/case-guidance</code>.</p>
                <p><strong className="text-foreground">Two-tier accuracy validation:</strong> AI output is validated against the statute database (citations, penalties) and, where available, against CourtListener via semantic search. Output that fails validation is flagged with a "requires confirmation" banner rather than suppressed.</p>
                <p><strong className="text-foreground">Sensitivity handling:</strong> The system detects high-distress indicators (immediate family detention, active deportation proceedings, custody of a child) and adjusts tone. It will not provide legal advice, predict outcomes, or recommend specific attorneys.</p>
                <p><strong className="text-foreground">Cost controls:</strong> Per-request ceiling of $0.25. Session-level budget cap configurable via environment variable. All costs are written to the database and awaited to prevent loss on crash.</p>
                <p><strong className="text-foreground">Privacy:</strong> No conversation content is stored. Input is deleted after the session ends. The AI is not given any persistent user identity.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-base">Document Summarizer</CardTitle>
                  <Badge variant="outline" className="text-xs">Requires Anthropic API key</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Allows users to paste or upload a legal document (charging document, court order, plea agreement) and receive a plain-language summary written at a 6th grade reading level. Available at <code className="bg-muted px-1 rounded text-xs">/document-summarizer</code>. Subject to the same privacy architecture as Case Guidance — no document content is retained after the session.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="text-base">Attorney Portal</CardTitle>
                  <Badge variant="outline" className="text-xs">Verified access</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>A separate authenticated section for verified defense attorneys and legal aid organizations. Available at <code className="bg-muted px-1 rounded text-xs">/attorney</code>.</p>
                <p><strong className="text-foreground">Attorney Playbooks:</strong> Curated strategy guides for common charge types, organized by jurisdiction. Includes defense angles, common defenses, and sentencing considerations.</p>
                <p><strong className="text-foreground">Document Generation:</strong> Motion templates (suppression, dismissal, bail reduction, continuance, probation violation response, notice of appeal) with jurisdiction-specific customization across all 50 states and DC. Output in PDF via jsPDF.</p>
                <p><strong className="text-foreground">Extended sessions:</strong> Attorney sessions are extended to one hour. All attorney access requires verification; authentication can be disabled per-deployment via the <code className="bg-muted px-1 rounded text-xs">ADMIN_DISABLE_AUTH</code> environment variable (never via <code className="bg-muted px-1 rounded text-xs">NODE_ENV</code>).</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <CardTitle className="text-base">Search</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Full-text search across all content types: charges, glossary, diversion programs, expungement rules, rights pages, immigration pages, and site pages. Implemented server-side in <code className="bg-muted px-1 rounded text-xs">server/services/search-indexer.ts</code>.</p>
                <p><strong className="text-foreground">Legal synonym expansion:</strong> Queries are expanded using a curated synonym map (e.g., "lawyer" finds "attorney", "counsel"). Multi-word queries are also scored on individual meaningful terms.</p>
                <p><strong className="text-foreground">Scoring:</strong> Exact title match (100pts) → alias match (80pts) → title partial (50pts) → alias partial (40pts) → tag match (30pts) → content frequency (up to 25pts). Type boosts applied: charges 1.3×, glossary 1.2×, rights_info 1.15×.</p>
                <p><strong className="text-foreground">Manual indexing required:</strong> New pages must be added to the <code className="bg-muted px-1 rounded text-xs">sitePages</code> array in search-indexer.ts — the system does not auto-discover routes.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <CardTitle className="text-base">Privacy Architecture</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>The platform is designed for users in legal distress who may be at risk. No user-identifying data is logged or stored beyond the session.</p>
                <ul className="space-y-1 list-none">
                  <li>— All AI input and output is deleted after the session ends</li>
                  <li>— No analytics identifiers or fingerprinting</li>
                  <li>— Session cache keys are prefixed by session ID to prevent cross-session data leakage</li>
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
            <p>Three GitHub Actions workflows run quarterly to flag stale external data. They do not auto-update content — they open a GitHub Issue with items requiring manual review.</p>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">check-legal-aid.ts</code>
                <span>HTTP checks all 24 legal aid organization URLs. Outputs <code className="bg-background px-1 rounded text-xs">legal-aid-diff.json</code> with any that return non-200 or redirect.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">check-federal-statutes.ts</code>
                <span>HEAD checks all Cornell LII statute URLs in the database. Outputs <code className="bg-background px-1 rounded text-xs">statutes-diff.json</code>.</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <code className="text-xs bg-background px-2 py-1 rounded font-mono shrink-0">generate-report.ts</code>
                <span>Reads both diff outputs and opens a GitHub Issue listing items needing manual review.</span>
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
              <li>— <strong className="text-foreground">6th grade reading level:</strong> All user-facing content, AI prompts, and tooltip text. Legal terms may appear as labels but must be explained immediately in plain language.</li>
              <li>— <strong className="text-foreground">No placeholder or fabricated data:</strong> If real data is unavailable for a jurisdiction, surface a "data not available" message. Do not invent phone numbers, addresses, or contact info.</li>
              <li>— <strong className="text-foreground">Source and date all statistics:</strong> Any statistic shown to users must name the source organization and data year.</li>
              <li>— <strong className="text-foreground">Complete statute text:</strong> Statute entries must contain the full verbatim text of the statute, not excerpts. Truncation with "..." is not permitted.</li>
              <li>— <strong className="text-foreground">Verified external contacts:</strong> Legal aid organization addresses, phone numbers, and websites must be verified against the organization's live website before publishing.</li>
              <li>— <strong className="text-foreground">Jurisdiction defaults:</strong> Forms must default to "Other / Generic" unless the user has specified a state. Do not default to any specific jurisdiction.</li>
            </ul>
            <p className="mt-2">These rules are documented in detail in <code className="bg-muted px-1 rounded text-xs">CLAUDE.md</code> at the project root.</p>
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
