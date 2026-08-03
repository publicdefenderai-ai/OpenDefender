import { useTranslation } from "react-i18next";
import { Compass, IdCard, FileX, Home, Briefcase, Vote, ExternalLink } from "lucide-react";
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

interface TopicStep {
  label: string;
  text: string;
  linkLabel?: string;
  linkHref?: string;
  afterText?: string;
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

function InternalActionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-2 font-medium">
      {children}
    </Link>
  );
}

function TopicSection({
  icon: Icon,
  title,
  color,
  borderColor,
  intro,
  steps,
  ordered,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  borderColor: string;
  intro: string;
  steps: TopicStep[];
  ordered?: boolean;
}) {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <Card className="h-full border-l-4 overflow-hidden" style={{ borderLeftColor: borderColor }}>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Icon className={`h-4 w-4 flex-shrink-0 ${color}`} strokeWidth={1.75} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4 space-y-2 text-sm text-muted-foreground">
        <p>{intro}</p>
        <ListTag className="space-y-1.5 list-none">
          {steps.map((step, i) => (
            <li key={i}>
              <span className="font-semibold text-foreground">{step.label}</span> {step.text}
              {step.linkLabel && step.linkHref && (
                <>
                  {" "}
                  {step.linkHref.startsWith("http") ? (
                    <ActionLink href={step.linkHref}>{step.linkLabel}</ActionLink>
                  ) : (
                    <InternalActionLink href={step.linkHref}>{step.linkLabel}</InternalActionLink>
                  )}
                </>
              )}
              {step.afterText && <> {step.afterText}</>}
            </li>
          ))}
        </ListTag>
      </CardContent>
    </Card>
  );
}

function CustomSections() {
  const { t } = useTranslation();
  const ns = "support.reentry.topics";

  return (
    <div className="space-y-4 mb-8">
      <ScrollReveal>
        <h2 className="text-xl font-bold text-foreground mb-4">{t(`${ns}.sectionTitle`)}</h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
        <ScrollReveal delay={0.1}>
          <TopicSection
            icon={IdCard}
            title={t(`${ns}.id.title`)}
            color="text-orange-600 dark:text-orange-400"
            borderColor="#ea580c"
            intro={t(`${ns}.id.intro`)}
            ordered
            steps={[
              { label: t(`${ns}.id.step1Label`), text: t(`${ns}.id.step1Text`), linkLabel: "VitalChek.com", linkHref: "https://www.vitalchek.com/" },
              { label: t(`${ns}.id.step2Label`), text: t(`${ns}.id.step2Text`), linkLabel: "ssa.gov/ssnumber", linkHref: "https://www.ssa.gov/ssnumber/", afterText: t(`${ns}.id.step2AfterText`) },
              { label: t(`${ns}.id.step3Label`), text: t(`${ns}.id.step3Text`) },
            ]}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.13}>
          <TopicSection
            icon={FileX}
            title={t(`${ns}.recordClearing.title`)}
            color="text-teal-600 dark:text-teal-400"
            borderColor="#0d9488"
            intro={t(`${ns}.recordClearing.intro`)}
            steps={[
              { label: t(`${ns}.recordClearing.item1Label`), text: t(`${ns}.recordClearing.item1Text`), linkLabel: t(`${ns}.recordClearing.item1LinkLabel`), linkHref: "/support/reputation/eligibility" },
              { label: t(`${ns}.recordClearing.item2Label`), text: t(`${ns}.recordClearing.item2Text`), linkLabel: t(`${ns}.recordClearing.item2LinkLabel`), linkHref: "/support/reputation#clean-slate" },
              { label: t(`${ns}.recordClearing.item3Label`), text: t(`${ns}.recordClearing.item3Text`), linkLabel: "Clean Slate Initiative", linkHref: "https://cleanslateinitiative.org/states/" },
            ]}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.16}>
          <TopicSection
            icon={Home}
            title={t(`${ns}.housing.title`)}
            color="text-amber-600 dark:text-amber-400"
            borderColor="#d97706"
            intro={t(`${ns}.housing.intro`)}
            steps={[
              { label: t(`${ns}.housing.item1Label`), text: t(`${ns}.housing.item1Text`), linkLabel: t(`${ns}.housing.item1LinkLabel`), linkHref: "https://www.hud.gov/program_offices/fair_housing_equal_opp" },
              { label: t(`${ns}.housing.item2Label`), text: t(`${ns}.housing.item2Text`) },
              { label: t(`${ns}.housing.item3Label`), text: t(`${ns}.housing.item3Text`) },
            ]}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.19}>
          <TopicSection
            icon={Briefcase}
            title={t(`${ns}.employment.title`)}
            color="text-blue-600 dark:text-blue-400"
            borderColor="#2563eb"
            intro={t(`${ns}.employment.intro`)}
            steps={[
              { label: t(`${ns}.employment.item1Label`), text: t(`${ns}.employment.item1Text`), linkLabel: t(`${ns}.employment.item1LinkLabel`), linkHref: "https://www.eeoc.gov/laws/guidance/questions-and-answers-clarifying-guidance-use-arrest-conviction-records" },
              { label: t(`${ns}.employment.item2Label`), text: t(`${ns}.employment.item2Text`), linkLabel: t(`${ns}.employment.item2LinkLabel`), linkHref: "https://www.nelp.org/policy-issue/fair-chance-ban-the-box/" },
              { label: t(`${ns}.employment.item3Label`), text: t(`${ns}.employment.item3Text`), linkLabel: "CareerOneStop", linkHref: "https://www.careeronestop.org/", afterText: t(`${ns}.employment.item3AfterText`) },
            ]}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.22}>
          <TopicSection
            icon={Vote}
            title={t(`${ns}.voting.title`)}
            color="text-green-600 dark:text-green-400"
            borderColor="#16a34a"
            intro={t(`${ns}.voting.intro`)}
            steps={[
              { label: t(`${ns}.voting.item1Label`), text: t(`${ns}.voting.item1Text`), linkLabel: t(`${ns}.voting.item1LinkLabel`), linkHref: "https://www.ncsl.org/elections-and-campaigns/felon-voting-rights" },
              { label: t(`${ns}.voting.item2Label`), text: t(`${ns}.voting.item2Text`), linkLabel: "Vote.gov", linkHref: "https://vote.gov/", afterText: t(`${ns}.voting.item2AfterText`) },
              { label: t(`${ns}.voting.item3Label`), text: t(`${ns}.voting.item3Text`) },
            ]}
          />
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.3}>
        <Alert className="border-border bg-muted/50">
          <AlertDescription className="text-muted-foreground text-sm">
            {t(`${ns}.footnote`)}
          </AlertDescription>
        </Alert>
      </ScrollReveal>
    </div>
  );
}

export default function ReentrySupport() {
  const { t } = useTranslation();

  const startHereItems: ActionItem[] = [
    {
      id: "get-id",
      title: t("support.reentry.actions.getId.title"),
      description: t("support.reentry.actions.getId.description"),
      priority: "high",
      timeframe: t("support.reentry.actions.getId.timeframe"),
    },
    {
      id: "call-211",
      title: t("support.reentry.actions.call211.title"),
      description: t("support.reentry.actions.call211.description"),
      priority: "high",
      timeframe: t("support.reentry.actions.call211.timeframe"),
    },
    {
      id: "record-clearing",
      title: t("support.reentry.actions.recordClearing.title"),
      description: t("support.reentry.actions.recordClearing.description"),
      priority: "high",
      timeframe: t("support.reentry.actions.recordClearing.timeframe"),
      url: "/support/reputation/eligibility",
    },
    {
      id: "check-voting",
      title: t("support.reentry.actions.checkVoting.title"),
      description: t("support.reentry.actions.checkVoting.description"),
      priority: "medium",
      timeframe: t("support.reentry.actions.checkVoting.timeframe"),
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "211 — Local Services Locator",
      description: t("support.reentry.resources.211.description"),
      url: "https://www.211.org/",
      type: "national",
      free: true,
    },
    {
      name: "Code for America — Clear My Record",
      description: t("support.reentry.resources.clearMyRecord.description"),
      url: "https://www.codeforamerica.org/programs/clear-my-record/",
      type: "national",
      free: true,
    },
    {
      name: "CareerOneStop (U.S. Dept. of Labor)",
      description: t("support.reentry.resources.careerOneStop.description"),
      url: "https://www.careeronestop.org/",
      type: "national",
      free: true,
    },
    {
      name: "Social Security Administration — Replace Your Card",
      description: t("support.reentry.resources.ssa.description"),
      url: "https://www.ssa.gov/ssnumber/",
      phone: "1-800-772-1213",
      type: "national",
      free: true,
    },
    {
      name: "HUD — Criminal Records and Fair Housing",
      description: t("support.reentry.resources.hud.description"),
      url: "https://www.hud.gov/program_offices/fair_housing_equal_opp",
      type: "national",
      free: true,
    },
    {
      name: "NCSL — Felon Voting Rights by State",
      description: t("support.reentry.resources.ncsl.description"),
      url: "https://www.ncsl.org/elections-and-campaigns/felon-voting-rights",
      type: "online",
      free: true,
    },
    {
      name: "Vote.gov",
      description: t("support.reentry.resources.voteGov.description"),
      url: "https://vote.gov/",
      type: "national",
      free: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t("support.reentry.faq.q1.question"),
      answer: t("support.reentry.faq.q1.answer"),
    },
    {
      question: t("support.reentry.faq.qRecord.question"),
      answer: t("support.reentry.faq.qRecord.answer"),
    },
    {
      question: t("support.reentry.faq.q2.question"),
      answer: t("support.reentry.faq.q2.answer"),
    },
    {
      question: t("support.reentry.faq.q3.question"),
      answer: t("support.reentry.faq.q3.answer"),
    },
    {
      question: t("support.reentry.faq.q4.question"),
      answer: t("support.reentry.faq.q4.answer"),
    },
  ];

  return (
    <ResourcePageTemplate
      categoryId="reentry"
      icon={Compass}
      iconColor="bg-orange-500/10 text-orange-600 dark:text-orange-400"
      heroGradient="bg-gradient-to-br from-orange-500/5 via-background to-background"
      overview={t("support.reentry.overview")}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      customSections={<CustomSections />}
      relatedLinks={[
        { label: t("support.relatedLinks.recordClearing"), href: "/support/reputation/eligibility" },
        { label: t("support.relatedLinks.reputation"), href: "/support/reputation" },
        { label: t("support.relatedLinks.employment"), href: "/support/employment" },
        { label: t("support.relatedLinks.housing"), href: "/support/housing" },
      ]}
    />
  );
}
