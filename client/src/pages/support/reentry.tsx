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
  children,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={`h-4 w-4 flex-shrink-0 ${color}`} strokeWidth={1.75} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
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
      className="flex items-start gap-1.5 text-primary hover:underline underline-offset-2 font-medium"
    >
      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
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

      <div className="grid sm:grid-cols-2 gap-4">
        <ScrollReveal delay={0.1}>
          <TopicSection icon={IdCard} title="Get Your ID First" color="text-orange-600 dark:text-orange-400">
            <p>Everything else requires a government-issued photo ID. Do this before applying for housing, jobs, or benefits.</p>
            <ol className="space-y-1.5 list-none">
              <li>
                <span className="font-semibold text-foreground">1. Birth certificate:</span> Order through your state's vital records office or{" "}
                <ActionLink href="https://www.vitalchek.com/">VitalChek.com</ActionLink>, the official birth certificate partner for most U.S. states.
              </li>
              <li>
                <span className="font-semibold text-foreground">2. Social Security card:</span> Replace it free at{" "}
                <ActionLink href="https://www.ssa.gov/ssnumber/">ssa.gov/ssnumber</ActionLink> or any Social Security office (1-800-772-1213).
              </li>
              <li>
                <span className="font-semibold text-foreground">3. State ID or driver's license:</span> Bring your birth certificate and Social Security card to your state DMV. Many states offer fee waivers for people recently released — call 211 to ask about programs near you.
              </li>
            </ol>
          </TopicSection>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <TopicSection icon={Home} title="Housing" color="text-amber-600 dark:text-amber-400">
            <p>Many landlords run background checks. Your rights depend on your state and the type of housing.</p>
            <ul className="space-y-1.5 list-none">
              <li>
                <span className="font-semibold text-foreground">Know your rights:</span> Federal fair housing rules prohibit blanket bans based on arrest records for federally assisted housing.{" "}
                <ActionLink href="https://www.hud.gov/program_offices/fair_housing_equal_opp/criminal_records">HUD fair housing guidance →</ActionLink>
              </li>
              <li>
                <span className="font-semibold text-foreground">Find local help:</span> Call or text 211 to find transitional housing, re-entry housing programs, and emergency shelter near you.
              </li>
              <li>
                <span className="font-semibold text-foreground">Local protections:</span> Many cities and states have "fair chance" housing ordinances. Search "[your city] fair chance housing" or ask a local legal aid office.
              </li>
            </ul>
          </TopicSection>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <TopicSection icon={Briefcase} title="Employment" color="text-blue-600 dark:text-blue-400">
            <p>Federal law and many state laws limit how employers can use your criminal history.</p>
            <ul className="space-y-1.5 list-none">
              <li>
                <span className="font-semibold text-foreground">Your EEOC rights:</span> Employers must assess whether a criminal record is relevant to the specific job. Blanket rejections are often illegal.{" "}
                <ActionLink href="https://www.eeoc.gov/laws/guidance/questions-and-answers-clarifying-guidance-use-arrest-conviction-records">EEOC guidance →</ActionLink>
              </li>
              <li>
                <span className="font-semibold text-foreground">Ban the Box:</span> Over 35 states and 150+ cities limit when employers can ask about your record — often not until a conditional job offer is made. Check your state's rules at{" "}
                <ActionLink href="https://www.nelp.org/policy-issue/fair-chance-ban-the-box/">NELP →</ActionLink> (Source: NELP, 2024.)
              </li>
              <li>
                <span className="font-semibold text-foreground">Job search and training:</span>{" "}
                <ActionLink href="https://www.careeronestop.org/">CareerOneStop</ActionLink> (U.S. Dept. of Labor) has a re-entry job search section and helps you find local American Job Centers.
              </li>
            </ul>
          </TopicSection>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <TopicSection icon={Vote} title="Voting Rights" color="text-green-600 dark:text-green-400">
            <p>Many people don't know their right to vote was automatically restored. Eligibility varies by state.</p>
            <ul className="space-y-1.5 list-none">
              <li>
                <span className="font-semibold text-foreground">Check your state:</span> Most states restore voting rights when you leave prison. Some require finishing parole or probation. Maine and Vermont never suspend them. A few states require a separate application.{" "}
                <ActionLink href="https://www.ncsl.org/elections-and-campaigns/felon-voting-rights">State-by-state chart →</ActionLink> (Source: NCSL, 2024.)
              </li>
              <li>
                <span className="font-semibold text-foreground">Register if eligible:</span>{" "}
                <ActionLink href="https://vote.gov/">Vote.gov</ActionLink> — the official U.S. government voter registration portal. Many states offer online registration.
              </li>
              <li>
                <span className="font-semibold text-foreground">Need help?</span> Your state's election office can confirm your eligibility. Many legal aid organizations also assist with voter registration restoration.
              </li>
            </ul>
          </TopicSection>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.3}>
        <Alert className="border-border bg-muted/50">
          <AlertDescription className="text-muted-foreground text-sm">
            Re-entry resources vary significantly by state and county. The links above are national starting points. Call 211 to connect with programs specific to your location.
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
