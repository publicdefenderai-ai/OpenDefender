import { useTranslation } from "react-i18next";
import { Briefcase } from "lucide-react";
import {
  ResourcePageTemplate,
  ActionItem,
  ExternalResource,
  FAQ,
} from "@/components/support/resource-page-template";

export default function EmploymentSupport() {
  const { t } = useTranslation();

  const startHereItems: ActionItem[] = [
    {
      id: "know-rights",
      title: t('support.employment.actions.knowRights.title'),
      description: t('support.employment.actions.knowRights.description'),
      priority: "high",
      timeframe: t('support.employment.actions.knowRights.timeframe'),
    },
    {
      id: "review-policy",
      title: t('support.employment.actions.reviewPolicy.title'),
      description: t('support.employment.actions.reviewPolicy.description'),
      priority: "high",
      timeframe: t('support.employment.actions.reviewPolicy.timeframe'),
    },
    {
      id: "document",
      title: t('support.employment.actions.document.title'),
      description: t('support.employment.actions.document.description'),
      priority: "medium",
    },
    {
      id: "plan-absence",
      title: t('support.employment.actions.planAbsence.title'),
      description: t('support.employment.actions.planAbsence.description'),
      priority: "medium",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "U.S. Equal Employment Opportunity Commission (EEOC)",
      description: t('support.employment.resources.eeoc.description'),
      url: "https://www.eeoc.gov/",
      phone: "1-800-669-4000",
      type: "national",
      free: true,
    },
    {
      name: "National Employment Law Project (NELP)",
      description: t('support.employment.resources.nelp.description'),
      url: "https://www.nelp.org/",
      type: "national",
      free: true,
    },
    {
      name: "Workplace Fairness",
      description: t('support.employment.resources.workplaceFairness.description'),
      url: "https://www.workplacefairness.org/",
      type: "online",
      free: true,
    },
    {
      name: "Legal Aid at Work",
      description: t('support.employment.resources.legalAidWork.description'),
      url: "https://legalaidatwork.org/",
      phone: "1-415-864-8848",
      type: "national",
      free: true,
    },
    {
      name: "CareerOneStop (U.S. Dept. of Labor)",
      description: t('support.employment.resources.careerOneStop.description'),
      url: "https://www.careeronestop.org/",
      type: "national",
      free: true,
    },
    {
      name: "America's Job Centers",
      description: t('support.employment.resources.jobCenters.description'),
      url: "https://www.careeronestop.org/LocalHelp/AmericanJobCenters/find-american-job-centers.aspx",
      type: "local",
      free: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t('support.employment.faq.q1.question'),
      answer: t('support.employment.faq.q1.answer'),
    },
    {
      question: t('support.employment.faq.q2.question'),
      answer: t('support.employment.faq.q2.answer'),
    },
    {
      question: t('support.employment.faq.q3.question'),
      answer: t('support.employment.faq.q3.answer'),
    },
    {
      question: t('support.employment.faq.q4.question'),
      answer: t('support.employment.faq.q4.answer'),
    },
  ];

  const tips: string[] = [
    t('support.employment.tips.tip1'),
    t('support.employment.tips.tip2'),
    t('support.employment.tips.tip3'),
    t('support.employment.tips.tip4'),
  ];

  return (
    <ResourcePageTemplate
      categoryId="employment"
      icon={Briefcase}
      iconColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
      heroGradient="bg-gradient-to-br from-blue-500/5 via-background to-background"
      overview={t('support.employment.overview')}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      relatedLinks={[
        { label: t('support.relatedLinks.finances'), href: "/support/finances" },
        { label: t('support.relatedLinks.courtLogistics'), href: "/support/court-logistics" },
      ]}
    />
  );
}
