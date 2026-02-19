import { useTranslation } from "react-i18next";
import { DollarSign } from "lucide-react";
import {
  ResourcePageTemplate,
  ActionItem,
  ExternalResource,
  FAQ,
} from "@/components/support/resource-page-template";

export default function FinancesSupport() {
  const { t } = useTranslation();

  const startHereItems: ActionItem[] = [
    {
      id: "assess-costs",
      title: t('support.finances.actions.assessCosts.title'),
      description: t('support.finances.actions.assessCosts.description'),
      priority: "high",
      timeframe: t('support.finances.actions.assessCosts.timeframe'),
    },
    {
      id: "explore-pd",
      title: t('support.finances.actions.explorePD.title'),
      description: t('support.finances.actions.explorePD.description'),
      priority: "high",
      timeframe: t('support.finances.actions.explorePD.timeframe'),
    },
    {
      id: "fee-waiver",
      title: t('support.finances.actions.feeWaiver.title'),
      description: t('support.finances.actions.feeWaiver.description'),
      priority: "medium",
    },
    {
      id: "payment-plan",
      title: t('support.finances.actions.paymentPlan.title'),
      description: t('support.finances.actions.paymentPlan.description'),
      priority: "medium",
    },
    {
      id: "emergency-aid",
      title: t('support.finances.actions.emergencyAid.title'),
      description: t('support.finances.actions.emergencyAid.description'),
      priority: "medium",
    },
    {
      id: "income-loss",
      title: t('support.finances.actions.incomeLoss.title'),
      description: t('support.finances.actions.incomeLoss.description'),
      priority: "low",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "FindLaw Free Legal Aid Directory",
      description: t('support.finances.resources.findLaw.description'),
      url: "https://www.findlaw.com/",
      type: "national",
      free: true,
    },
    {
      name: "LawHelp.org",
      description: t('support.finances.resources.lawHelp.description'),
      url: "https://www.lawhelp.org/",
      type: "national",
      free: true,
    },
    {
      name: "Benefits.gov",
      description: t('support.finances.resources.benefits.description'),
      url: "https://www.benefits.gov/",
      type: "national",
      free: true,
    },
    {
      name: "211 United Way",
      description: t('support.finances.resources.unitedWay.description'),
      url: "https://www.211.org/",
      phone: "211",
      type: "local",
      free: true,
    },
    {
      name: "Modest Means Program (State Bar)",
      description: t('support.finances.resources.modestMeans.description'),
      url: "https://www.americanbar.org/groups/probono_public_service/resources/directory_of_law_school_public_interest_pro_bono_programs/",
      type: "state",
      free: false,
    },
    {
      name: "Consumer Financial Protection Bureau (CFPB)",
      description: t('support.finances.resources.cfpb.description'),
      url: "https://www.consumerfinance.gov/",
      type: "national",
      free: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t('support.finances.faq.q1.question'),
      answer: t('support.finances.faq.q1.answer'),
    },
    {
      question: t('support.finances.faq.q2.question'),
      answer: t('support.finances.faq.q2.answer'),
    },
    {
      question: t('support.finances.faq.q3.question'),
      answer: t('support.finances.faq.q3.answer'),
    },
    {
      question: t('support.finances.faq.q4.question'),
      answer: t('support.finances.faq.q4.answer'),
    },
  ];

  const tips: string[] = [
    t('support.finances.tips.tip1'),
    t('support.finances.tips.tip2'),
    t('support.finances.tips.tip3'),
    t('support.finances.tips.tip4'),
  ];

  return (
    <ResourcePageTemplate
      categoryId="finances"
      icon={DollarSign}
      iconColor="bg-green-500/10 text-green-600 dark:text-green-400"
      heroGradient="bg-gradient-to-br from-green-500/5 via-background to-background"
      overview={t('support.finances.overview')}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      relatedLinks={[
        { label: t('support.relatedLinks.employment'), href: "/support/employment" },
        { label: t('support.relatedLinks.publicDefender'), href: "/resources" },
      ]}
    />
  );
}
