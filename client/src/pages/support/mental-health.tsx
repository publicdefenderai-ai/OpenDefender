import { useTranslation } from "react-i18next";
import { Heart, Phone, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResourcePageTemplate,
  ActionItem,
  ExternalResource,
  FAQ,
} from "@/components/support/resource-page-template";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

function CrisisSection() {
  const { t } = useTranslation();

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <Card className="border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-700 dark:text-rose-400">
                <Phone className="h-5 w-5" />
                {t('support.mentalHealth.crisis.title')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('support.mentalHealth.crisis.description')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border">
                  <div className="font-semibold mb-1">{t('support.mentalHealth.crisis.hotline.name')}</div>
                  <a href="tel:988" className="text-2xl font-bold text-rose-600 dark:text-rose-400 hover:underline">
                    988
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('support.mentalHealth.crisis.hotline.availability')}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border">
                  <div className="font-semibold mb-1">{t('support.mentalHealth.crisis.text.name')}</div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-rose-600" />
                    <span className="text-lg font-bold">{t('support.mentalHealth.crisis.text.number')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('support.mentalHealth.crisis.text.instruction')}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border">
                  <div className="font-semibold mb-1">{t('support.mentalHealth.crisis.chat.name')}</div>
                  <a
                    href="https://988lifeline.org/chat/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    {t('support.mentalHealth.crisis.chat.link')}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('support.mentalHealth.crisis.chat.availability')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function MentalHealthSupport() {
  const { t } = useTranslation();

  const startHereItems: ActionItem[] = [
    {
      id: "acknowledge",
      title: t('support.mentalHealth.actions.acknowledge.title'),
      description: t('support.mentalHealth.actions.acknowledge.description'),
      priority: "high",
    },
    {
      id: "reach-out",
      title: t('support.mentalHealth.actions.reachOut.title'),
      description: t('support.mentalHealth.actions.reachOut.description'),
      priority: "high",
    },
    {
      id: "routine",
      title: t('support.mentalHealth.actions.routine.title'),
      description: t('support.mentalHealth.actions.routine.description'),
      priority: "medium",
    },
    {
      id: "counseling",
      title: t('support.mentalHealth.actions.counseling.title'),
      description: t('support.mentalHealth.actions.counseling.description'),
      priority: "medium",
    },
    {
      id: "limit-news",
      title: t('support.mentalHealth.actions.limitNews.title'),
      description: t('support.mentalHealth.actions.limitNews.description'),
      priority: "low",
    },
    {
      id: "support-group",
      title: t('support.mentalHealth.actions.supportGroup.title'),
      description: t('support.mentalHealth.actions.supportGroup.description'),
      priority: "low",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "988 Suicide & Crisis Lifeline",
      description: t('support.mentalHealth.resources.lifeline988.description'),
      url: "https://988lifeline.org/",
      phone: "988",
      type: "national",
      free: true,
    },
    {
      name: "SAMHSA National Helpline",
      description: t('support.mentalHealth.resources.samhsa.description'),
      url: "https://www.samhsa.gov/find-help/national-helpline",
      phone: "1-800-662-4357",
      type: "national",
      free: true,
    },
    {
      name: "NAMI (National Alliance on Mental Illness)",
      description: t('support.mentalHealth.resources.nami.description'),
      url: "https://www.nami.org/",
      phone: "1-800-950-6264",
      type: "national",
      free: true,
    },
    {
      name: "Open Path Collective",
      description: t('support.mentalHealth.resources.openPath.description'),
      url: "https://openpathcollective.org/",
      type: "online",
      free: false,
    },
    {
      name: "7 Cups",
      description: t('support.mentalHealth.resources.sevenCups.description'),
      url: "https://www.7cups.com/",
      type: "online",
      free: true,
    },
    {
      name: "Psychology Today Therapist Finder",
      description: t('support.mentalHealth.resources.psychToday.description'),
      url: "https://www.psychologytoday.com/us/therapists",
      type: "online",
      free: false,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t('support.mentalHealth.faq.q1.question'),
      answer: t('support.mentalHealth.faq.q1.answer'),
    },
    {
      question: t('support.mentalHealth.faq.q2.question'),
      answer: t('support.mentalHealth.faq.q2.answer'),
    },
    {
      question: t('support.mentalHealth.faq.q3.question'),
      answer: t('support.mentalHealth.faq.q3.answer'),
    },
    {
      question: t('support.mentalHealth.faq.q4.question'),
      answer: t('support.mentalHealth.faq.q4.answer'),
    },
  ];

  const tips: string[] = [
    t('support.mentalHealth.tips.tip1'),
    t('support.mentalHealth.tips.tip2'),
    t('support.mentalHealth.tips.tip3'),
    t('support.mentalHealth.tips.tip4'),
    t('support.mentalHealth.tips.tip5'),
  ];

  return (
    <ResourcePageTemplate
      categoryId="mentalHealth"
      icon={Heart}
      iconColor="bg-rose-500/10 text-rose-600 dark:text-rose-400"
      heroGradient="bg-gradient-to-br from-rose-500/5 via-background to-background"
      overview={t('support.mentalHealth.overview')}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      customSections={<CrisisSection />}
      relatedLinks={[
        { label: t('support.relatedLinks.familyFriends'), href: "/friends-family" },
        { label: t('support.relatedLinks.finances'), href: "/support/finances" },
      ]}
    />
  );
}
