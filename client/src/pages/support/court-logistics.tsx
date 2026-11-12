import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { courtLogisticsDesignCopy } from "@/locales/court-logistics-design";
import { Calendar } from "lucide-react";
import {
  ResourcePageTemplate,
  ActionItem,
  ExternalResource,
  FAQ,
} from "@/components/support/resource-page-template";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type DesignCopy = typeof courtLogisticsDesignCopy.en;

function RemindersSection({ copy }: { copy: DesignCopy }) {
  const { t } = useTranslation();
  const ns = "support.courtLogistics.reminders";
  const selfHelpItems = t(`${ns}.selfHelpItems`, { returnObjects: true }) as string[];

  return (
    <section className="court-logistics-section" id="court-reminders">
      <div><h2>{t(`${ns}.sectionTitle`)}</h2><p>{t(`${ns}.sectionSubtitle`)}</p></div>
      <div>
        <h3>{t(`${ns}.servicesTitle`)}</h3>
        {["bailProject", "stateCourts", "pdOffice"].map(key => (
          <div key={key} className="court-logistics-service">
            <h4>{key === "bailProject" ? (
              <a href={t(`${ns}.bailProject.url`)} target="_blank" rel="noopener noreferrer">{t(`${ns}.bailProject.name`)}</a>
            ) : t(`${ns}.${key}.name`)}</h4>
            <p>{t(`${ns}.${key}.desc`)}</p>
          </div>
        ))}
        <h3>{t(`${ns}.selfHelpTitle`)}</h3>
        <ul className="list-disc pl-5 space-y-2">{selfHelpItems.map(item => <li key={item}>{item}</li>)}</ul>
        <details className="court-logistics-research"><summary>{copy.research}</summary><p>{t(`${ns}.researchNote`)}</p></details>
        <h3><Link href="/support/court-logistics/intake-form">{copy.intake}</Link></h3>
        <p>{copy.intakeDetail}</p>
        <h3><Link href="/support/court-logistics/court-date-guide">{t(`${ns}.guideLabel`)}</Link></h3>
        <p>{t(`${ns}.guideDesc`)}</p>
      </div>
    </section>
  );
}

function CourtRequirementsSection() {
  const { t } = useTranslation();
  const r = 'support.courtLogistics.requirements';

  const sections = [
    {
      value: 'court-ordered',
      title: t(`${r}.courtOrdered.title`),
      context: t(`${r}.courtOrdered.context`),
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">{t(`${r}.courtOrdered.verifyTitle`)}</p>
            <ol className="space-y-2">
              {(t(`${r}.courtOrdered.verifySteps`, { returnObjects: true }) as string[]).map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="flex-shrink-0 font-bold text-foreground">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">{t(`${r}.courtOrdered.enrollTitle`)}</p>
            <ul className="space-y-1.5">
              {(t(`${r}.courtOrdered.enrollQuestions`, { returnObjects: true }) as string[]).map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-muted-foreground/60 mt-0.5 flex-shrink-0">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-muted/40 p-3 border border-border/60">
            <p className="text-sm font-semibold text-foreground mb-1">{t(`${r}.courtOrdered.completionTitle`)}</p>
            <p className="text-sm text-muted-foreground">{t(`${r}.courtOrdered.completionNote`)}</p>
          </div>
        </div>
      ),
    },
    {
      value: 'community-service',
      title: t(`${r}.communityService.title`),
      context: t(`${r}.communityService.context`),
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">{t(`${r}.communityService.findTitle`)}</p>
            <ol className="space-y-2">
              {(t(`${r}.communityService.findSteps`, { returnObjects: true }) as string[]).map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="flex-shrink-0 font-bold text-foreground">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-lg bg-muted/40 p-3 border border-border/60">
            <p className="text-sm font-semibold text-foreground mb-1">{t(`${r}.communityService.docsTitle`)}</p>
            <p className="text-sm text-muted-foreground">{t(`${r}.communityService.docsNote`)}</p>
          </div>
          <p className="text-sm text-muted-foreground">{t(`${r}.communityService.turnedAwayNote`)}</p>
        </div>
      ),
    },
    {
      value: 'property-retrieval',
      title: t(`${r}.propertyRetrieval.title`),
      context: t(`${r}.propertyRetrieval.context`),
      content: (
        <div className="space-y-4">
          <ol className="space-y-2">
            {(t(`${r}.propertyRetrieval.steps`, { returnObjects: true }) as string[]).map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="flex-shrink-0 font-bold text-foreground">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="rounded-lg bg-muted/40 p-3 border border-border/60">
            <p className="text-sm font-semibold text-foreground mb-1">{t(`${r}.propertyRetrieval.carTitle`)}</p>
            <p className="text-sm text-muted-foreground">{t(`${r}.propertyRetrieval.carNote`)}</p>
          </div>
          <p className="text-sm text-muted-foreground">{t(`${r}.propertyRetrieval.missingNote`)}</p>
        </div>
      ),
    },
    {
      value: 'id-replacement',
      title: t(`${r}.idReplacement.title`),
      context: t(`${r}.idReplacement.context`),
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            {(t(`${r}.idReplacement.items`, { returnObjects: true }) as { name: string; detail: string }[]).map((item, i) => (
              <div key={i} className="rounded-lg bg-muted/40 p-3 border border-border/60">
                <p className="text-sm font-semibold text-foreground mb-1">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{t(`${r}.idReplacement.helpNote`)}</p>
        </div>
      ),
    },
  ];

  return (
    <section id="court-requirements" className="court-logistics-section">
      <div><h2>{t(`${r}.sectionTitle`)}</h2><p>{t(`${r}.sectionSubtitle`)}</p></div>
      <div>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {sections.map(({ value, title, context, content }) => (
              <AccordionItem key={value} value={value} className="border-t border-border">
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-base">{title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{context}</p>
                  {content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
      </div>
    </section>
  );
}

export default function CourtLogisticsSupport() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const copy = language.startsWith("es") ? courtLogisticsDesignCopy.es : language.startsWith("zh") ? courtLogisticsDesignCopy.zh : courtLogisticsDesignCopy.en;
  const startHereItems: ActionItem[] = [
    {
      id: "pd-intake-form",
      title: copy.intakeAction,
      description: copy.intakeActionNote,
      priority: "high",
      timeframe: copy.intakeTime,
      url: "/support/court-logistics/intake-form",
    },
    {
      id: "bail-preparation",
      title: copy.bailAction,
      description: copy.bailActionNote,
      priority: "high",
      timeframe: copy.bailTime,
      url: "/support/court-logistics/bail-preparation",
    },
    {
      id: "find-court",
      url: "/court-locator",
      title: t('support.courtLogistics.actions.findCourt.title'),
      description: t('support.courtLogistics.actions.findCourt.description'),
      priority: "high",
      timeframe: t('support.courtLogistics.actions.findCourt.timeframe'),
    },
    {
      id: "check-date",
      title: t('support.courtLogistics.actions.checkDate.title'),
      description: t('support.courtLogistics.actions.checkDate.description'),
      priority: "high",
      timeframe: t('support.courtLogistics.actions.checkDate.timeframe'),
    },
    {
      id: "plan-arrival",
      title: t('support.courtLogistics.actions.planArrival.title'),
      description: t('support.courtLogistics.actions.planArrival.description'),
      priority: "medium",
    },
    {
      id: "dress-code",
      title: t('support.courtLogistics.actions.dressCode.title'),
      description: t('support.courtLogistics.actions.dressCode.description'),
      priority: "medium",
    },
    {
      id: "what-to-bring",
      title: t('support.courtLogistics.actions.whatToBring.title'),
      description: t('support.courtLogistics.actions.whatToBring.description'),
      priority: "medium",
    },
    {
      id: "what-to-expect",
      title: t('support.courtLogistics.actions.whatToExpect.title'),
      description: t('support.courtLogistics.actions.whatToExpect.description'),
      priority: "low",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "Partners for Justice",
      description: copy.pfj,
      url: "https://www.partnersforjustice.org/",
      type: "national",
      free: true,
    },
    {
      name: copy.courtFinder,
      description: t('support.courtLogistics.resources.courtLocator.description'),
      url: "/court-locator",
      type: "online",
      free: true,
    },
    {
      name: copy.usFinder,
      description: t('support.courtLogistics.resources.usCourts.description'),
      url: "https://www.uscourts.gov/about-federal-courts/federal-courts-public/court-website-links",
      type: "national",
      free: true,
    },
    {
      name: "NCSC Court Statistics Project",
      description: t('support.courtLogistics.resources.ncsc.description'),
      url: "https://www.courtstatistics.org/",
      type: "national",
      free: true,
    },
    {
      name: copy.selfHelp,
      description: t('support.courtLogistics.resources.selfHelp.description'),
      url: "https://www.lawhelp.org/",
      type: "state",
      free: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t('support.courtLogistics.faq.q1.question'),
      answer: t('support.courtLogistics.faq.q1.answer'),
    },
    {
      question: t('support.courtLogistics.faq.q2.question'),
      answer: t('support.courtLogistics.faq.q2.answer'),
    },
    {
      question: t('support.courtLogistics.faq.q3.question'),
      answer: t('support.courtLogistics.faq.q3.answer'),
    },
    {
      question: t('support.courtLogistics.faq.q4.question'),
      answer: t('support.courtLogistics.faq.q4.answer'),
    },
    {
      question: t('support.courtLogistics.faq.q5.question'),
      answer: t('support.courtLogistics.faq.q5.answer'),
    },
  ];

  const tips: string[] = [
    t('support.courtLogistics.tips.tip1'),
    t('support.courtLogistics.tips.tip2'),
    t('support.courtLogistics.tips.tip3'),
    t('support.courtLogistics.tips.tip4'),
    t('support.courtLogistics.tips.tip5'),
  ];

  return (
    <ResourcePageTemplate
      categoryId="courtLogistics"
      mainClassName="court-logistics-page"
      actionHeading={copy.before}
      customNavItems={[
        { id: "court-reminders", label: t("support.courtLogistics.reminders.sectionTitle") },
        { id: "court-requirements", label: t("support.courtLogistics.requirements.sectionTitle") },
      ]}
      introduction={<>
        <Link href="/support">{t("support.backToSupport")}</Link>
        <section className="court-logistics-hero">
          <div>
            <p>{t("legalGuidance.qaFlow.additionalDetails.concernsCategories.courtLogistics.label")}</p>
            <h1>{copy.title}<br/><em>{copy.accent}</em></h1>
            <p>{t("support.courtLogistics.overview")}</p>
          </div>
          <img src="/images/design/court-logistics.svg" width="240" height="220" alt="" />
        </section>
        <nav className="court-logistics-paths" aria-label={copy.guides}>
          {[
            ["court-date-guide", copy.date, copy.dateNote],
            ["bail-preparation", copy.bail, copy.bailNote],
            ["intake-form", copy.intake, copy.intakeNote],
          ].map(([path, title, description]) => (
            <Link key={path} href={`/support/court-logistics/${path}`}><strong>{title}</strong><span>{description}</span></Link>
          ))}
        </nav>
      </>}
      icon={Calendar}
      iconColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
      heroGradient="bg-gradient-to-br from-purple-500/5 via-background to-background"
      overview={t('support.courtLogistics.overview')}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      customSections={<><RemindersSection copy={copy} /><CourtRequirementsSection /></>}
      relatedLinks={[
        { label: t('support.relatedLinks.process'), href: "/case-timeline" },
        { label: t('support.relatedLinks.rights'), href: "/rights-info" },
        { label: t('support.relatedLinks.courtLocator'), href: "/court-locator" },
      ]}
    />
  );
}
