import { Compass, IdCard, Home, Briefcase, Vote, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ResourcePageTemplate,
  type ActionItem,
  type ExternalResource,
  type FAQ,
} from "@/components/support/resource-page-template";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const startHereItems: ActionItem[] = [
  {
    id: "get-id",
    title: "Get official ID first",
    description:
      "A government-issued photo ID is required for housing applications, employment paperwork, benefits enrollment, and bank accounts. Start with your birth certificate, then your Social Security card, then a state-issued photo ID. Everything else depends on this step.",
    priority: "high",
    timeframe: "Before anything else",
  },
  {
    id: "call-211",
    title: "Call or text 211",
    description:
      "Dial 211 (or text your ZIP code to 898-211) to find local re-entry programs, transitional housing, job training, and emergency help near you. Free and available 24/7 across most of the U.S.",
    priority: "high",
    timeframe: "Day 1",
  },
  {
    id: "check-voting",
    title: "Check whether your voting rights have been restored",
    description:
      "Many people don't know their rights came back automatically upon release. Eligibility varies by state — in most states, rights are restored when you leave prison. Check your status before your next election.",
    priority: "medium",
    timeframe: "Before your next election",
  },
];

const externalResources: ExternalResource[] = [
  {
    name: "211 — Local Services Locator",
    description:
      "Dial 211 or visit 211.org to find local re-entry programs, transitional housing, food assistance, and job training. Free, 24/7, available across most of the U.S.",
    url: "https://www.211.org/",
    type: "national",
    free: true,
  },
  {
    name: "CareerOneStop (U.S. Dept. of Labor)",
    description:
      "Job search, skills training, and career resources including a dedicated re-entry section. Use the locator to find an in-person American Job Center near you.",
    url: "https://www.careeronestop.org/",
    type: "national",
    free: true,
  },
  {
    name: "Social Security Administration — Replace Your Card",
    description:
      "Replace a lost Social Security card online or in person. You will need this before getting a state-issued ID. Call or visit any Social Security office.",
    url: "https://www.ssa.gov/ssnumber/",
    phone: "1-800-772-1213",
    type: "national",
    free: true,
  },
  {
    name: "HUD — Criminal Records and Fair Housing",
    description:
      "Federal guidance on tenant rights for people with criminal records in federally assisted housing. Blanket bans based on arrest records are not allowed under HUD policy.",
    url: "https://www.hud.gov/program_offices/fair_housing_equal_opp/criminal_records",
    type: "national",
    free: true,
  },
  {
    name: "NCSL — Felon Voting Rights by State",
    description:
      "State-by-state chart of voting rights restoration laws, maintained by the National Conference of State Legislatures. (Source: NCSL, updated annually.)",
    url: "https://www.ncsl.org/elections-and-campaigns/felon-voting-rights",
    type: "online",
    free: true,
  },
  {
    name: "Vote.gov",
    description:
      "Official U.S. government voting information. Check your state's registration requirements and register online where available.",
    url: "https://vote.gov/",
    type: "national",
    free: true,
  },
];

const faqs: FAQ[] = [
  {
    question: "Do I need ID to get housing or a job?",
    answer:
      "Yes, in almost all cases. A government-issued photo ID is required for housing applications, employment I-9 forms, bank accounts, and most public benefits. Getting your ID is the first step — everything else follows from it.",
  },
  {
    question: "Can a landlord refuse to rent to me because of my criminal record?",
    answer:
      "For federally assisted housing, blanket bans based on arrest records are not allowed under HUD guidance. For private landlords, it depends on your state and city — many have 'fair chance' housing laws that limit when and how records can be used. Call 211 to find housing programs that work with people with records.",
  },
  {
    question: "Can an employer reject me because of my record?",
    answer:
      "Employers can consider criminal history, but EEOC guidance says the record must be relevant to the specific job. Over 35 states and 150+ cities have Ban the Box laws that delay criminal history questions until later in the hiring process. Check NELP's tracker for your state's rules. (Source: National Employment Law Project, 2024.)",
  },
  {
    question: "When do my voting rights come back?",
    answer:
      "It depends on your state. Most states restore voting rights automatically when you are released from prison. Some require completing parole or probation first. A few require a separate application. Check the NCSL state-by-state chart or vote.gov for your specific state.",
  },
];

function TopicSection({
  icon: Icon,
  title,
  color,
  borderColor,
  children,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  borderColor: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="h-full border-l-4 overflow-hidden" style={{ borderLeftColor: borderColor }}>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Icon className={`h-4 w-4 flex-shrink-0 ${color}`} strokeWidth={1.75} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4 space-y-2 text-sm text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}

function ActionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-2 font-medium"
    >
      <ExternalLink className="h-3 w-3 flex-shrink-0" />
      <span>{children}</span>
    </a>
  );
}

function CustomSections() {
  return (
    <div className="space-y-4 mb-8">
      <ScrollReveal>
        <h2 className="text-xl font-bold text-foreground mb-4">Where to start, by topic</h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
        <ScrollReveal delay={0.1}>
          <TopicSection icon={IdCard} title="Get Your ID First" color="text-orange-600 dark:text-orange-400" borderColor="#ea580c">
            <p>Photo ID is required for housing, jobs, and benefits. Do this before anything else.</p>
            <ol className="space-y-1.5 list-none">
              <li><span className="font-semibold text-foreground">1. Birth certificate</span> — order via your state or <ActionLink href="https://www.vitalchek.com/">VitalChek.com</ActionLink></li>
              <li><span className="font-semibold text-foreground">2. Social Security card</span> — free at <ActionLink href="https://www.ssa.gov/ssnumber/">ssa.gov/ssnumber</ActionLink> or call 1-800-772-1213</li>
              <li><span className="font-semibold text-foreground">3. State ID</span> — bring both documents to the DMV. Call 211 to ask about fee waivers.</li>
            </ol>
          </TopicSection>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <TopicSection icon={Home} title="Housing" color="text-amber-600 dark:text-amber-400" borderColor="#d97706">
            <p>Your rights depend on the type of housing and your state.</p>
            <ul className="space-y-1.5 list-none">
              <li><span className="font-semibold text-foreground">Federally assisted housing</span> — blanket bans on arrest records are not allowed. <ActionLink href="https://www.hud.gov/program_offices/fair_housing_equal_opp/criminal_records">HUD guidance →</ActionLink></li>
              <li><span className="font-semibold text-foreground">Find programs</span> — call or text 211 for transitional housing and re-entry programs near you.</li>
              <li><span className="font-semibold text-foreground">Local protections</span> — many cities have "fair chance" housing laws. Ask a local legal aid office.</li>
            </ul>
          </TopicSection>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <TopicSection icon={Briefcase} title="Employment" color="text-blue-600 dark:text-blue-400" borderColor="#2563eb">
            <p>Federal law limits how employers can use your criminal history.</p>
            <ul className="space-y-1.5 list-none">
              <li><span className="font-semibold text-foreground">EEOC rights</span> — employers must show a record is relevant to the job. Blanket rejections are often illegal. <ActionLink href="https://www.eeoc.gov/laws/guidance/questions-and-answers-clarifying-guidance-use-arrest-conviction-records">EEOC guidance →</ActionLink></li>
              <li><span className="font-semibold text-foreground">Ban the Box</span> — 35+ states delay criminal history questions until after a job offer. <ActionLink href="https://www.nelp.org/policy-issue/fair-chance-ban-the-box/">Check your state →</ActionLink></li>
              <li><span className="font-semibold text-foreground">Job search</span> — <ActionLink href="https://www.careeronestop.org/">CareerOneStop</ActionLink> (Dept. of Labor) has a re-entry section and local job centers.</li>
            </ul>
          </TopicSection>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <TopicSection icon={Vote} title="Voting Rights" color="text-green-600 dark:text-green-400" borderColor="#16a34a">
            <p>Most states restore voting rights automatically when you leave prison.</p>
            <ul className="space-y-1.5 list-none">
              <li><span className="font-semibold text-foreground">Check your state</span> — some require finishing parole; Maine and Vermont never suspend rights. <ActionLink href="https://www.ncsl.org/elections-and-campaigns/felon-voting-rights">State-by-state chart →</ActionLink></li>
              <li><span className="font-semibold text-foreground">Register</span> — <ActionLink href="https://vote.gov/">Vote.gov</ActionLink> is the official U.S. registration portal. Many states allow online registration.</li>
              <li><span className="font-semibold text-foreground">Need help?</span> — your state election office or a local legal aid org can confirm your eligibility.</li>
            </ul>
          </TopicSection>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.3}>
        <Alert className="border-border bg-muted/50">
          <AlertDescription className="text-muted-foreground text-sm">
            Resources vary by state and county. Links above are national starting points. Call 211 for programs specific to your location.
          </AlertDescription>
        </Alert>
      </ScrollReveal>
    </div>
  );
}

export default function ReentrySupport() {
  return (
    <ResourcePageTemplate
      categoryId="reentry"
      icon={Compass}
      iconColor="bg-orange-500/10 text-orange-600 dark:text-orange-400"
      heroGradient="bg-gradient-to-br from-orange-500/5 via-background to-background"
      overview="Leaving incarceration or completing a sentence is a major transition. This guide covers the four areas that matter most first: getting official ID, finding housing, finding work, and knowing your voting rights. Start with ID — everything else requires it."
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      customSections={<CustomSections />}
      relatedLinks={[
        { label: "Employment Help", href: "/support/employment" },
        { label: "Housing Stability", href: "/support/housing" },
        { label: "Hidden Consequences", href: "/support/reputation" },
        { label: "Life Support Hub", href: "/support" },
      ]}
    />
  );
}
