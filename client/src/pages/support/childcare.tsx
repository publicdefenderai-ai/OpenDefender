import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Baby,
  Copy,
  Check,
  Printer,
  Mail,
  ClipboardList,
  Heart,
} from "lucide-react";
import {
  ResourcePageTemplate,
  ActionItem,
  ExternalResource,
  FAQ,
} from "@/components/support/resource-page-template";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

function TemplateCard({
  label,
  subject,
  body,
  t,
}: {
  label: string;
  subject?: string;
  body: string;
  t: (key: string) => string;
}) {
  const [copied, setCopied] = useState(false);
  const fullText = subject ? `${subject}\n\n${body}` : body;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = fullText;
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
              h1 { font-size: 18px; color: #333; border-bottom: 2px solid #ec4899; padding-bottom: 8px; }
              .subject { font-weight: bold; margin-bottom: 16px; }
              .body { white-space: pre-wrap; }
              .note { font-size: 12px; color: #666; margin-top: 24px; padding-top: 12px; border-top: 1px solid #ddd; font-style: italic; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>
            <h1>${label}</h1>
            ${subject ? `<p class="subject">${subject}</p>` : ""}
            <div class="body">${body.replace(/\n/g, "<br>")}</div>
            <p class="note">${t("support.childcare.commsSection.personalizeNote")}</p>
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
              {copied
                ? t("support.childcare.commsSection.copied")
                : t("support.childcare.commsSection.copyButton")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              {t("support.childcare.commsSection.printButton")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {subject && (
          <p className="font-medium text-sm text-foreground mb-3 bg-muted/50 dark:bg-muted/30 px-3 py-2 rounded-md">
            {subject}
          </p>
        )}
        <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">
          {body}
        </pre>
      </CardContent>
    </Card>
  );
}

function NeedsCardSection() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const template = t("support.childcare.needsCard.template");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = template;
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
            <title>${t("support.childcare.needsCard.sectionTitle")}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.8; max-width: 700px; margin: 0 auto; }
              h1 { font-size: 18px; color: #333; border-bottom: 2px solid #ec4899; padding-bottom: 8px; margin-bottom: 20px; }
              .card { white-space: pre-wrap; font-size: 13px; }
              .note { font-size: 11px; color: #666; margin-top: 24px; padding-top: 12px; border-top: 1px solid #ddd; font-style: italic; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>
            <h1>${t("support.childcare.needsCard.sectionTitle")}</h1>
            <div class="card">${template.replace(/\n/g, "<br>")}</div>
            <p class="note">${t("support.childcare.needsCard.printInstructions")}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <section className="py-10 md:py-14 bg-pink-50/40 dark:bg-pink-950/10" id="needs-card">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <ClipboardList className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("support.childcare.needsCard.sectionTitle")}
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("support.childcare.needsCard.sectionDescription")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <Card className="border border-pink-200 dark:border-pink-800 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  {t("support.childcare.needsCard.sectionTitle")}
                </CardTitle>
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
                    {copied
                      ? t("support.childcare.needsCard.copied")
                      : t("support.childcare.needsCard.copyButton")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="h-8 text-xs gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    {t("support.childcare.needsCard.printButton")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/40 dark:bg-muted/20 rounded-lg p-4 border border-border/40">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-loose">
                  {template}
                </pre>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                {t("support.childcare.needsCard.printInstructions")}
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ChildcareCommsSection() {
  const { t } = useTranslation();

  const emailTemplates = ["school", "daycare", "doctor"] as const;

  return (
    <section className="py-10 md:py-14 bg-background" id="childcare-comms">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <Mail className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("support.childcare.commsSection.sectionTitle")}
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("support.childcare.commsSection.sectionDescription")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 flex items-start gap-3">
            <Badge
              variant="outline"
              className="shrink-0 mt-0.5 border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40"
            >
              {t("support.childcare.commsSection.tipLabel")}
            </Badge>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {t("support.childcare.commsSection.personalizeNote")}
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {emailTemplates.map((key) => (
            <ScrollReveal key={key}>
              <TemplateCard
                label={t(`support.childcare.commsSection.emailTemplates.${key}.label`)}
                subject={
                  t(`support.childcare.commsSection.emailTemplates.${key}.subject`) || undefined
                }
                body={t(`support.childcare.commsSection.emailTemplates.${key}.body`)}
                t={t}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ChildcareSupport() {
  const { t } = useTranslation();

  const startHereItems: ActionItem[] = [
    {
      id: "needs-sheet",
      title: t("support.childcare.actions.needsSheet.title"),
      description: t("support.childcare.actions.needsSheet.description"),
      priority: "high",
      timeframe: t("support.childcare.actions.needsSheet.timeframe"),
    },
    {
      id: "confirm-caregiver",
      title: t("support.childcare.actions.confirmCaregiver.title"),
      description: t("support.childcare.actions.confirmCaregiver.description"),
      priority: "high",
      timeframe: t("support.childcare.actions.confirmCaregiver.timeframe"),
    },
    {
      id: "notify-school",
      title: t("support.childcare.actions.notifySchool.title"),
      description: t("support.childcare.actions.notifySchool.description"),
      priority: "high",
    },
    {
      id: "schedule-appointments",
      title: t("support.childcare.actions.scheduleAppointments.title"),
      description: t("support.childcare.actions.scheduleAppointments.description"),
      priority: "medium",
    },
    {
      id: "talk-to-child",
      title: t("support.childcare.actions.talkToChild.title"),
      description: t("support.childcare.actions.talkToChild.description"),
      priority: "medium",
    },
    {
      id: "know-custody",
      title: t("support.childcare.actions.knowCustodyRules.title"),
      description: t("support.childcare.actions.knowCustodyRules.description"),
      priority: "medium",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "Child Care Aware of America",
      description: t("support.childcare.resources.childCareAware.description"),
      url: "https://www.childcareaware.org/",
      phone: "1-800-424-2246",
      type: "national",
      free: true,
    },
    {
      name: "Child Welfare Information Gateway",
      description: t("support.childcare.resources.childWelfare.description"),
      url: "https://www.childwelfare.gov/",
      type: "national",
      free: true,
    },
    {
      name: "211 / United Way — Local Family Support",
      description: t("support.childcare.resources.unitedWay.description"),
      url: "https://www.211.org/",
      phone: "211",
      type: "local",
      free: true,
    },
    {
      name: "Head Start Program",
      description: t("support.childcare.resources.headStart.description"),
      url: "https://www.acf.hhs.gov/ohs",
      type: "national",
      free: true,
    },
    {
      name: "ParentHelp123 / Childhelp National Parent Hotline",
      description: t("support.childcare.resources.parentHelp.description"),
      url: "https://www.childhelphotline.org/",
      phone: "1-855-427-2736",
      type: "national",
      free: true,
    },
    {
      name: "State Child Support Services",
      description: t("support.childcare.resources.childSupport.description"),
      url: "https://www.acf.hhs.gov/css/contact-information/state-and-tribal-child-support-agency-contacts",
      type: "state",
      free: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t("support.childcare.faq.q1.question"),
      answer: t("support.childcare.faq.q1.answer"),
    },
    {
      question: t("support.childcare.faq.q2.question"),
      answer: t("support.childcare.faq.q2.answer"),
    },
    {
      question: t("support.childcare.faq.q3.question"),
      answer: t("support.childcare.faq.q3.answer"),
    },
    {
      question: t("support.childcare.faq.q4.question"),
      answer: t("support.childcare.faq.q4.answer"),
    },
  ];

  const tips: string[] = [
    t("support.childcare.tips.tip1"),
    t("support.childcare.tips.tip2"),
    t("support.childcare.tips.tip3"),
    t("support.childcare.tips.tip4"),
    t("support.childcare.tips.tip5"),
  ];

  return (
    <ResourcePageTemplate
      categoryId="childcare"
      icon={Baby}
      iconColor="bg-pink-500/10 text-pink-600 dark:text-pink-400"
      heroGradient="bg-gradient-to-br from-pink-500/5 via-background to-background"
      overview={t("support.childcare.overview")}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      relatedLinks={[
        { label: t("support.relatedLinks.transportation"), href: "/support/transportation" },
        { label: t("support.relatedLinks.mentalHealth"), href: "/support/mental-health" },
        { label: t("support.relatedLinks.finances"), href: "/support/finances" },
      ]}
      customSections={
        <>
          <NeedsCardSection />
          <ChildcareCommsSection />
        </>
      }
    />
  );
}
