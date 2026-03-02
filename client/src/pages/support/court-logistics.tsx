import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";
import {
  ResourcePageTemplate,
  ActionItem,
  ExternalResource,
  FAQ,
} from "@/components/support/resource-page-template";

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
      name: "Court Locator (PublicDefenderAI)",
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
      icon={Calendar}
      iconColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
      heroGradient="bg-gradient-to-br from-purple-500/5 via-background to-background"
      overview={t('support.courtLogistics.overview')}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      relatedLinks={[
        { label: t('support.relatedLinks.process'), href: "/process" },
        { label: t('support.relatedLinks.rights'), href: "/rights-info" },
        { label: t('support.relatedLinks.courtLocator'), href: "/court-locator" },
      ]}
    />
  );
}
