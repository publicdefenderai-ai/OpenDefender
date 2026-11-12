import { NrrcResources } from "@/components/nrrc-resources";
import { useTranslation } from "react-i18next";
import { Compass } from "lucide-react";
import { Link } from "wouter";
import { reentryDesignCopy } from "@/locales/reentry-design";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ResourcePageTemplate,
  type ActionItem,
  type ExternalResource,
  type FAQ,
} from "@/components/support/resource-page-template";

interface TopicStep {
  label: string;
  text: string;
  linkLabel?: string;
  linkHref?: string;
  afterText?: string;
}

function TopicSection({
  initiallyOpen = false,
  title,
  intro,
  steps,
  ordered,
}: {
  initiallyOpen?: boolean;
  title: string;
  intro: string;
  steps: TopicStep[];
  ordered?: boolean;
}) {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <details className="reentry-topic" open={initiallyOpen}>
      <summary>{title}</summary>
      <div className="reentry-topic-body">
        <p>{intro}</p>
        <ListTag className="space-y-3">
          {steps.map((step, i) => (
            <li key={i}>
              <span className="font-semibold text-foreground">{step.label}</span> {step.text}
              {step.linkLabel && step.linkHref && (
                <>
                  {" "}
                  {step.linkHref.startsWith("http") ? (
                    <a href={step.linkHref} target="_blank" rel="noopener noreferrer">{step.linkLabel}</a>
                  ) : (
                    <Link href={step.linkHref}>{step.linkLabel}</Link>
                  )}
                </>
              )}
              {step.afterText && <> {step.afterText}</>}
            </li>
          ))}
        </ListTag>
      </div>
    </details>
  );
}

function CustomSections() {
  const { t } = useTranslation();
  const ns = "support.reentry.topics";

  return (
    <section id="reentry-topics" className="reentry-topics">
      <h2>{t(`${ns}.sectionTitle`)}</h2>
      <div>
        <TopicSection
          initiallyOpen
          title={t(`${ns}.id.title`)}
          intro={t(`${ns}.id.intro`)}
          ordered
          steps={[
            { label: t(`${ns}.id.step1Label`), text: t(`${ns}.id.step1Text`), linkLabel: "VitalChek.com", linkHref: "https://www.vitalchek.com/" },
            { label: t(`${ns}.id.step2Label`), text: t(`${ns}.id.step2Text`), linkLabel: "ssa.gov/ssnumber", linkHref: "https://www.ssa.gov/ssnumber/", afterText: t(`${ns}.id.step2AfterText`) },
            { label: t(`${ns}.id.step3Label`), text: t(`${ns}.id.step3Text`) },
          ]}
        />
        <TopicSection
          title={t(`${ns}.recordClearing.title`)}
          intro={t(`${ns}.recordClearing.intro`)}
          steps={[
            { label: t(`${ns}.recordClearing.item1Label`), text: t(`${ns}.recordClearing.item1Text`), linkLabel: t(`${ns}.recordClearing.item1LinkLabel`), linkHref: "/support/reputation/eligibility" },
            { label: t(`${ns}.recordClearing.item2Label`), text: t(`${ns}.recordClearing.item2Text`), linkLabel: t(`${ns}.recordClearing.item2LinkLabel`), linkHref: "/support/reputation#clean-slate" },
            { label: t(`${ns}.recordClearing.item3Label`), text: t(`${ns}.recordClearing.item3Text`), linkLabel: t(`${ns}.recordClearing.item3LinkLabel`), linkHref: "https://cleanslateinitiative.org/states/" },
          ]}
        />
        <TopicSection
          title={t(`${ns}.housing.title`)}
          intro={t(`${ns}.housing.intro`)}
          steps={[
            { label: t(`${ns}.housing.item1Label`), text: t(`${ns}.housing.item1Text`), linkLabel: t(`${ns}.housing.item1LinkLabel`), linkHref: "https://www.hud.gov/program_offices/fair_housing_equal_opp" },
            { label: t(`${ns}.housing.item2Label`), text: t(`${ns}.housing.item2Text`) },
            { label: t(`${ns}.housing.item3Label`), text: t(`${ns}.housing.item3Text`) },
          ]}
        />
        <TopicSection
          title={t(`${ns}.employment.title`)}
          intro={t(`${ns}.employment.intro`)}
          steps={[
            { label: t(`${ns}.employment.item1Label`), text: t(`${ns}.employment.item1Text`), linkLabel: t(`${ns}.employment.item1LinkLabel`), linkHref: "https://www.eeoc.gov/laws/guidance/questions-and-answers-clarifying-guidance-use-arrest-conviction-records" },
            { label: t(`${ns}.employment.item2Label`), text: t(`${ns}.employment.item2Text`), linkLabel: t(`${ns}.employment.item2LinkLabel`), linkHref: "https://www.nelp.org/policy-issue/fair-chance-ban-the-box/" },
            { label: t(`${ns}.employment.item3Label`), text: t(`${ns}.employment.item3Text`), linkLabel: "CareerOneStop", linkHref: "https://www.careeronestop.org/", afterText: t(`${ns}.employment.item3AfterText`) },
          ]}
        />
        <TopicSection
          title={t(`${ns}.voting.title`)}
          intro={t(`${ns}.voting.intro`)}
          steps={[
            { label: t(`${ns}.voting.item1Label`), text: t(`${ns}.voting.item1Text`), linkLabel: t(`${ns}.voting.item1LinkLabel`), linkHref: "https://www.ncsl.org/elections-and-campaigns/felon-voting-rights" },
            { label: t(`${ns}.voting.item2Label`), text: t(`${ns}.voting.item2Text`), linkLabel: "Vote.gov", linkHref: "https://vote.gov/", afterText: t(`${ns}.voting.item2AfterText`) },
            { label: t(`${ns}.voting.item3Label`), text: t(`${ns}.voting.item3Text`) },
          ]}
        />
      </div>

      <Alert className="border-border bg-muted/50">
        <AlertDescription className="text-muted-foreground text-sm">
          {t(`${ns}.footnote`)}
        </AlertDescription>
      </Alert>

    </section>
  );
}

export default function ReentrySupport() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const copy = lang.startsWith("es") ? reentryDesignCopy.es : lang.startsWith("zh") ? reentryDesignCopy.zh : reentryDesignCopy.en;

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
      mainClassName="reentry-page"
      actionHeading={copy.essentials}
      customNavItems={[{ id: "reentry-topics", label: t("support.reentry.topics.sectionTitle") }]}
      introduction={<>
        <Link className="reentry-back" href="/support">{t("support.backToSupport")}</Link>
        <section className="reentry-hero">
          <div>
            <h1><small>{t("legalGuidance.qaFlow.additionalDetails.concernsCategories.reentry.label")}</small>{copy.title}<br /><em>{copy.accent}</em></h1>
            <p>{t("support.reentry.overview")}</p>
          </div>
          <img src="/images/design/reentry.svg" alt="" aria-hidden="true" width="240" height="220" />
        </section>
      </>}
      icon={Compass}
      iconColor="bg-orange-500/10 text-orange-600 dark:text-orange-400"
      heroGradient="bg-gradient-to-br from-orange-500/5 via-background to-background"
      overview={t("support.reentry.overview")}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      customSections={<><CustomSections /><NrrcResources ids={["home", "consequences", "housing"]} /></>}
      relatedLinks={[
        { label: t("support.relatedLinks.recordClearing"), href: "/support/reputation/eligibility" },
        { label: t("support.relatedLinks.reputation"), href: "/support/reputation" },
        { label: t("support.relatedLinks.employment"), href: "/support/employment" },
        { label: t("support.relatedLinks.housing"), href: "/support/housing" },
      ]}
    />
  );
}
