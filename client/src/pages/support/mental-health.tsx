import { useState } from "react";
import { useTranslation } from "react-i18next";
import mentalHealthHero from "@assets/stock_images/mental-health.png";
import { Heart, Phone, MessageCircle, ClipboardCheck, Copy, Check, Printer, ExternalLink, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import {
  ResourcePageTemplate,
  ActionItem,
  ExternalResource,
  FAQ,
} from "@/components/support/resource-page-template";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

function TemplateCard({ label, body }: { label: string; body: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(body); }
    catch { const t = document.createElement("textarea"); t.value = body; document.body.appendChild(t); t.select(); document.execCommand("copy"); document.body.removeChild(t); }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>${label}</title><style>body{font-family:Arial,sans-serif;padding:32px;max-width:640px;margin:0 auto;white-space:pre-wrap;font-size:13px;line-height:1.6;}</style></head><body>${body.replace(/\n/g, "<br>")}</body></html>`);
    w.document.close(); w.print();
  };
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold text-foreground">{label}</CardTitle>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handlePrint}>
              <Printer className="h-3 w-3" /> Print
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">{body}</pre>
      </CardContent>
    </Card>
  );
}

function TreatmentConnectionSection() {
  const { t } = useTranslation();
  const ns = "support.mentalHealth.treatmentConnection";
  const checklistItems = t(`${ns}.checklistItems`, { returnObjects: true }) as string[];
  const angerQuestions = t(`${ns}.angerQuestions`, { returnObjects: true }) as string[];

  return (
    <section className="py-10 md:py-14 bg-muted/20 border-t border-border/30" id="treatment-connection">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-2">
            <ClipboardCheck className="h-5 w-5 text-teal-600" />
            <h2 className="text-xl font-bold text-foreground">{t(`${ns}.sectionTitle`)}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">{t(`${ns}.sectionSubtitle`)}</p>
        </ScrollReveal>

        {/* Why this matters */}
        <ScrollReveal>
          <Alert className="border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20 mb-6">
            <AlertCircle className="h-4 w-4 text-teal-600" />
            <AlertDescription className="text-teal-800 dark:text-teal-200">
              <strong className="block mb-1">{t(`${ns}.whyTitle`)}</strong>
              {t(`${ns}.whyBody`)}
            </AlertDescription>
          </Alert>
        </ScrollReveal>

        {/* Checklist */}
        <ScrollReveal>
          <Card className="mb-6">
            <CardContent className="pt-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">{t(`${ns}.checklistTitle`)}</h3>
              <ul className="space-y-2">
                {checklistItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="flex-shrink-0 w-4 h-4 border border-teal-400 rounded-sm mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Finding programs */}
        <ScrollReveal>
          <div className="mb-6">
            <h3 className="text-base font-semibold text-foreground mb-4">{t(`${ns}.findTitle`)}</h3>
            <div className="space-y-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">SAMHSA Treatment Locator — findtreatment.gov</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t(`${ns}.findSamhsa`)}</p>
                      <p className="text-xs text-muted-foreground italic mt-1">{t(`${ns}.findSamhsaNote`)}</p>
                    </div>
                    <a href="https://findtreatment.gov" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-teal-600 hover:text-teal-500 mt-0.5">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
              {[
                { body: t(`${ns}.find211`) },
                { body: t(`${ns}.findAttorney`) },
                { body: t(`${ns}.findCourt`) },
              ].map(({ body }, i) => (
                <Card key={i}>
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm text-muted-foreground">{body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Anger management */}
        <ScrollReveal>
          <Card className="mb-6">
            <CardContent className="pt-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">{t(`${ns}.angerTitle`)}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t(`${ns}.angerBody`)}</p>
              <p className="text-xs font-semibold text-foreground mb-1.5">Questions to ask any anger management program:</p>
              <ul className="space-y-1">
                {angerQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-muted-foreground/50 flex-shrink-0">•</span>{q}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Templates */}
        <ScrollReveal>
          <h3 className="text-base font-semibold text-foreground mb-4">{t(`${ns}.scriptTitle`)}</h3>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground leading-relaxed italic">"{t(`${ns}.scriptBody`)}"</p>
              </CardContent>
            </Card>
            <TemplateCard label={t(`${ns}.letterLabel`)} body={t(`${ns}.letterBody`)} />
            <TemplateCard label={t(`${ns}.attorneyLabel`)} body={t(`${ns}.attorneyBody`)} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

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
      heroImage={mentalHealthHero}
      icon={Heart}
      iconColor="bg-rose-500/10 text-rose-600 dark:text-rose-400"
      heroGradient="bg-gradient-to-br from-rose-500/5 via-background to-background"
      overview={t('support.mentalHealth.overview')}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      customSections={<><TreatmentConnectionSection /><CrisisSection /></>}
      relatedLinks={[
        { label: t('support.relatedLinks.familyFriends'), href: "/friends-family" },
        { label: t('support.relatedLinks.finances'), href: "/support/finances" },
      ]}
    />
  );
}
