import { useTranslation } from "react-i18next";
import courtLogisticsHero from "@assets/stock_images/court-logistics.jpg";
import { Calendar, ClipboardCheck, Users, Package, CreditCard } from "lucide-react";
import {
  ResourcePageTemplate,
  ActionItem,
  ExternalResource,
  FAQ,
} from "@/components/support/resource-page-template";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

function CourtRequirementsSection() {
  const { t } = useTranslation();
  const r = 'support.courtLogistics.requirements';

  const sections = [
    {
      value: 'court-ordered',
      icon: ClipboardCheck,
      iconColor: 'text-purple-500',
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
      icon: Users,
      iconColor: 'text-blue-500',
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
      icon: Package,
      iconColor: 'text-amber-500',
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
      icon: CreditCard,
      iconColor: 'text-emerald-500',
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
    <section className="py-10 md:py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-xl font-bold text-foreground mb-1">{t(`${r}.sectionTitle`)}</h2>
          <p className="text-sm text-muted-foreground mb-6">{t(`${r}.sectionSubtitle`)}</p>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {sections.map(({ value, icon: Icon, iconColor, title, context, content }) => (
              <AccordionItem key={value} value={value} className="border border-border rounded-lg px-4 bg-background">
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 flex-shrink-0 ${iconColor}`} aria-hidden="true" />
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
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function CourtLogisticsSupport() {
  const { t } = useTranslation();

  const startHereItems: ActionItem[] = [
    {
      id: "find-court",
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
      description: "A national nonprofit that embeds trained, non-attorney Advocates inside public defender offices to help clients navigate their cases and connect to social services — housing, employment, health, and more. If your public defender's office partners with PFJ, ask them about wraparound support. Operating in 20+ states. (Source: partnersforjustice.org)",
      url: "https://www.partnersforjustice.org/",
      type: "national",
      free: true,
    },
    {
      name: "Court Locator (OpenDefender)",
      description: t('support.courtLogistics.resources.courtLocator.description'),
      url: "/court-locator",
      type: "online",
      free: true,
    },
    {
      name: "USCourts.gov - Court Finder",
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
      name: "Self-Help Law Centers",
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
      heroImage={courtLogisticsHero}
      icon={Calendar}
      iconColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
      heroGradient="bg-gradient-to-br from-purple-500/5 via-background to-background"
      overview={t('support.courtLogistics.overview')}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      customSections={<CourtRequirementsSection />}
      relatedLinks={[
        { label: t('support.relatedLinks.process'), href: "/case-timeline" },
        { label: t('support.relatedLinks.rights'), href: "/rights-info" },
        { label: t('support.relatedLinks.courtLocator'), href: "/court-locator" },
      ]}
    />
  );
}
