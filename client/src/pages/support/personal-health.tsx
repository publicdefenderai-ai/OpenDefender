import { useState } from "react";
import { useTranslation } from "react-i18next";
import personalHealthHero from "@assets/stock_images/personal-health.png";
import { Activity, Pill, AlertTriangle, CheckCircle, Copy, Check, Printer, Phone, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

function CopyPrintCard({
  label,
  body,
  copyKey,
  copiedKey,
  printKey,
  t,
}: {
  label: string;
  body: string;
  copyKey: string;
  copiedKey: string;
  printKey: string;
  t: (key: string) => string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = body;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${label}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; max-width: 700px; margin: 0 auto; }
              h1 { font-size: 18px; color: #333; border-bottom: 2px solid #16a34a; padding-bottom: 8px; }
              .body { white-space: pre-wrap; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>
            <h1>${label}</h1>
            <div class="body">${body.replace(/\n/g, "<br>")}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Card className="border border-border/60 dark:border-border/40 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-semibold">{label}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 text-xs gap-1.5"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? t(copiedKey) : t(copyKey)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              {t(printKey)}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">
          {body}
        </pre>
      </CardContent>
    </Card>
  );
}

function TreatmentConnectionSection() {
  const { t, i18n } = useTranslation();

  const checklistItems = t('support.personalHealth.treatmentConnection.checklistItems', {
    returnObjects: true,
  }) as string[];

  const angerQuestions = t('support.personalHealth.treatmentConnection.angerQuestions', {
    returnObjects: true,
  }) as string[];

  const copyKey = 'support.personalHealth.treatmentConnection.copyButton';
  const copiedKey = 'support.personalHealth.treatmentConnection.copied';
  const printKey = 'support.personalHealth.treatmentConnection.printButton';

  return (
    <section className="py-10 md:py-14 bg-background" id="treatment-connection">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section header */}
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {t('support.personalHealth.treatmentConnection.sectionTitle')}
            </h2>
          </div>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {t('support.personalHealth.treatmentConnection.sectionSubtitle')}
          </p>
        </ScrollReveal>

        {/* Why this matters */}
        <ScrollReveal>
          <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 mb-8">
            <CardContent className="p-5">
              <h3 className="font-bold text-green-700 dark:text-green-400 mb-2">
                {t('support.personalHealth.treatmentConnection.whyTitle')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('support.personalHealth.treatmentConnection.whyBody')}
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Checklist */}
        <ScrollReveal>
          <div className="mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              {t('support.personalHealth.treatmentConnection.checklistTitle')}
            </h3>
            <ul className="space-y-3">
              {Array.isArray(checklistItems) && checklistItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* Finding programs */}
        <ScrollReveal>
          <div className="mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4">
              {t('support.personalHealth.treatmentConnection.findTitle')}
            </h3>
            <div className="space-y-4">
              <Card className="border border-border/60">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-foreground mb-1.5">SAMHSA — findtreatment.gov</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('support.personalHealth.treatmentConnection.findSamhsa')}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 italic">
                    {t('support.personalHealth.treatmentConnection.findSamhsaNote')}
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border/60">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-foreground mb-1.5 flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                    211
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('support.personalHealth.treatmentConnection.find211')}
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border/60">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-foreground mb-1.5">
                    {t('support.personalHealth.treatmentConnection.findAttorney').split('.')[0]}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('support.personalHealth.treatmentConnection.findAttorney')}
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                      {t('support.personalHealth.treatmentConnection.findCourt')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollReveal>

        {/* Anger management */}
        <ScrollReveal>
          <div className="mb-8">
            <h3 className="text-lg font-bold text-foreground mb-3">
              {t('support.personalHealth.treatmentConnection.angerTitle')}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {t('support.personalHealth.treatmentConnection.angerBody')}
            </p>
            <Card className="border border-border/60">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Questions to ask any anger management provider:
                </p>
                <ul className="space-y-2">
                  {Array.isArray(angerQuestions) && angerQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-green-500 mt-1 shrink-0">•</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Call script */}
        <ScrollReveal>
          <div className="mb-8">
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
              {t('support.personalHealth.treatmentConnection.scriptTitle')}
            </h3>
            <CopyPrintCard
              label={t('support.personalHealth.treatmentConnection.scriptTitle')}
              body={t('support.personalHealth.treatmentConnection.scriptBody')}
              copyKey={copyKey}
              copiedKey={copiedKey}
              printKey={printKey}
              t={t}
            />
          </div>
        </ScrollReveal>

        {/* Letter template */}
        <ScrollReveal>
          <div className="mb-8">
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              {t('support.personalHealth.treatmentConnection.letterTitle')}
            </h3>
            <CopyPrintCard
              label={t('support.personalHealth.treatmentConnection.letterLabel')}
              body={t('support.personalHealth.treatmentConnection.letterBody')}
              copyKey={copyKey}
              copiedKey={copiedKey}
              printKey={printKey}
              t={t}
            />
          </div>
        </ScrollReveal>

        {/* Attorney message */}
        <ScrollReveal>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              {t('support.personalHealth.treatmentConnection.attorneyTitle')}
            </h3>
            <CopyPrintCard
              label={t('support.personalHealth.treatmentConnection.attorneyLabel')}
              body={t('support.personalHealth.treatmentConnection.attorneyBody')}
              copyKey={copyKey}
              copiedKey={copiedKey}
              printKey={printKey}
              t={t}
            />
          </div>
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
    {
      id: "emergency-phone",
      title: t('support.personalHealth.actions.emergencyPhone.title'),
      description: t('support.personalHealth.actions.emergencyPhone.description'),
      priority: "low",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "Lifeline Program (Free Phone)",
      description: t('support.personalHealth.resources.lifeline.description'),
      url: "https://www.lifelinesupport.org/",
      phone: "1-800-234-9473",
      type: "national",
      free: true,
    },
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
      url: "https://drugfree.org/help/",
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
      heroImage={personalHealthHero}
      icon={Activity}
      iconColor="bg-green-500/10 text-green-600 dark:text-green-400"
      heroGradient="bg-gradient-to-br from-green-500/5 via-background to-background"
      overview={t('support.personalHealth.overview')}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      customSections={
        <>
          <MedicationPrepSection />
          <TreatmentConnectionSection />
        </>
      }
      relatedLinks={[
        { label: t('support.relatedLinks.mentalHealth'), href: "/support/mental-health" },
        { label: t('support.relatedLinks.finances'), href: "/support/finances" },
      ]}
    />
  );
}
