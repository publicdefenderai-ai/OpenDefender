import { useTranslation } from "react-i18next";
import { Activity, Pill, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResourcePageTemplate,
  ActionItem,
  ExternalResource,
  FAQ,
} from "@/components/support/resource-page-template";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

function MedicationPrepSection() {
  const { t } = useTranslation();

  const steps = [
    {
      key: "step1",
      icon: <Pill className="h-5 w-5" />,
    },
    {
      key: "step2",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      key: "step3",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
  ];

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-green-700 dark:text-green-400">
                <Pill className="h-5 w-5" />
                {t('support.personalHealth.medicationSection.title')}
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                {t('support.personalHealth.medicationSection.description')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {steps.map((step, i) => (
                  <div key={step.key} className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-green-100 dark:border-green-900">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-sm shrink-0">
                        {i + 1}
                      </div>
                      <span className="font-semibold text-sm text-foreground">
                        {t(`support.personalHealth.medicationSection.${step.key}.title`)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t(`support.personalHealth.medicationSection.${step.key}.body`)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function PersonalHealthSupport() {
  const { t } = useTranslation();

  const startHereItems: ActionItem[] = [
    {
      id: "list-medications",
      title: t('support.personalHealth.actions.listMedications.title'),
      description: t('support.personalHealth.actions.listMedications.description'),
      priority: "high",
      timeframe: t('support.personalHealth.actions.listMedications.timeframe'),
    },
    {
      id: "contact-doctor",
      title: t('support.personalHealth.actions.contactDoctor.title'),
      description: t('support.personalHealth.actions.contactDoctor.description'),
      priority: "high",
      timeframe: t('support.personalHealth.actions.contactDoctor.timeframe'),
    },
    {
      id: "notify-jail-health",
      title: t('support.personalHealth.actions.notifyJailHealth.title'),
      description: t('support.personalHealth.actions.notifyJailHealth.description'),
      priority: "high",
    },
    {
      id: "get-refills",
      title: t('support.personalHealth.actions.getRefills.title'),
      description: t('support.personalHealth.actions.getRefills.description'),
      priority: "medium",
      timeframe: t('support.personalHealth.actions.getRefills.timeframe'),
    },
    {
      id: "substance-support",
      title: t('support.personalHealth.actions.substanceSupport.title'),
      description: t('support.personalHealth.actions.substanceSupport.description'),
      priority: "medium",
    },
    {
      id: "medication-storage",
      title: t('support.personalHealth.actions.medicationStorage.title'),
      description: t('support.personalHealth.actions.medicationStorage.description'),
      priority: "medium",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "SAMHSA National Helpline",
      description: t('support.personalHealth.resources.samhsa.description'),
      url: "https://www.samhsa.gov/find-help/national-helpline",
      phone: "1-800-662-4357",
      type: "national",
      free: true,
    },
    {
      name: "Partnership to End Addiction Helpline",
      description: t('support.personalHealth.resources.partnership.description'),
      url: "https://drugfree.org/article/get-help-and-find-treatment/",
      phone: "1-855-378-4373",
      type: "national",
      free: true,
    },
    {
      name: "SMART Recovery",
      description: t('support.personalHealth.resources.smartRecovery.description'),
      url: "https://www.smartrecovery.org/",
      type: "online",
      free: true,
    },
    {
      name: "Nar-Anon Family Groups",
      description: t('support.personalHealth.resources.nar.description'),
      url: "https://www.nar-anon.org/",
      type: "national",
      free: true,
    },
    {
      name: "NAMI (National Alliance on Mental Illness)",
      description: t('support.personalHealth.resources.nami.description'),
      url: "https://www.nami.org/",
      phone: "1-800-950-6264",
      type: "national",
      free: true,
    },
    {
      name: "GoodRx — Prescription Savings",
      description: t('support.personalHealth.resources.goodRx.description'),
      url: "https://www.goodrx.com/",
      type: "online",
      free: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t('support.personalHealth.faq.q1.question'),
      answer: t('support.personalHealth.faq.q1.answer'),
    },
    {
      question: t('support.personalHealth.faq.q2.question'),
      answer: t('support.personalHealth.faq.q2.answer'),
    },
    {
      question: t('support.personalHealth.faq.q3.question'),
      answer: t('support.personalHealth.faq.q3.answer'),
    },
    {
      question: t('support.personalHealth.faq.q4.question'),
      answer: t('support.personalHealth.faq.q4.answer'),
    },
  ];

  const tips: string[] = [
    t('support.personalHealth.tips.tip1'),
    t('support.personalHealth.tips.tip2'),
    t('support.personalHealth.tips.tip3'),
    t('support.personalHealth.tips.tip4'),
    t('support.personalHealth.tips.tip5'),
  ];

  return (
    <ResourcePageTemplate
      categoryId="personalHealth"
      icon={Activity}
      iconColor="bg-green-500/10 text-green-600 dark:text-green-400"
      heroGradient="bg-gradient-to-br from-green-500/5 via-background to-background"
      overview={t('support.personalHealth.overview')}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      customSections={<MedicationPrepSection />}
      relatedLinks={[
        { label: t('support.relatedLinks.mentalHealth'), href: "/support/mental-health" },
        { label: t('support.relatedLinks.finances'), href: "/support/finances" },
      ]}
    />
  );
}
