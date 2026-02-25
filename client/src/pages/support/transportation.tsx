import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Car, Copy, Check, Printer, Phone, Mail, ChevronDown, AlertTriangle } from "lucide-react";
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
              h1 { font-size: 18px; color: #333; border-bottom: 2px solid #0891b2; padding-bottom: 8px; }
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
            <p class="note">${t("support.transportation.commsSection.personalizeNote")}</p>
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
                ? t("support.transportation.commsSection.copied")
                : t("support.transportation.commsSection.copyButton")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              {t("support.transportation.commsSection.printButton")}
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

function CopyScriptButton({ text, t }: { text: string; t: (key: string) => string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 text-xs gap-1.5">
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied
        ? t("support.transportation.commsSection.copied")
        : t("support.transportation.commsSection.copyButton")}
    </Button>
  );
}

function TransportationCommsSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"email" | "call">("email");
  const [dmvExpanded, setDmvExpanded] = useState(false);

  const callTips = ["tip1", "tip2", "tip3", "tip4"];

  return (
    <section className="py-10 md:py-14 bg-background" id="transport-comms">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Mail className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("support.transportation.commsSection.sectionTitle")}
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("support.transportation.commsSection.sectionDescription")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 flex items-start gap-3">
            <Badge
              variant="outline"
              className="shrink-0 mt-0.5 border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40"
            >
              {t("support.transportation.commsSection.tipLabel")}
            </Badge>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {t("support.transportation.commsSection.personalizeNote")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex gap-2 mb-6" role="tablist">
            <Button
              variant={activeTab === "email" ? "default" : "outline"}
              onClick={() => setActiveTab("email")}
              className="gap-2"
              role="tab"
              aria-selected={activeTab === "email"}
            >
              <Mail className="h-4 w-4" />
              {t("support.transportation.commsSection.emailTemplates.title")}
            </Button>
            <Button
              variant={activeTab === "call" ? "default" : "outline"}
              onClick={() => setActiveTab("call")}
              className="gap-2"
              role="tab"
              aria-selected={activeTab === "call"}
            >
              <Phone className="h-4 w-4" />
              {t("support.transportation.commsSection.callScripts.title")}
            </Button>
          </div>
        </ScrollReveal>

        {activeTab === "email" && (
          <div className="space-y-4">
            {(["employer", "family"] as const).map((key) => (
              <ScrollReveal key={key}>
                <TemplateCard
                  label={t(
                    `support.transportation.commsSection.emailTemplates.${key}.label`
                  )}
                  subject={
                    t(`support.transportation.commsSection.emailTemplates.${key}.subject`) ||
                    undefined
                  }
                  body={t(`support.transportation.commsSection.emailTemplates.${key}.body`)}
                  t={t}
                />
              </ScrollReveal>
            ))}
          </div>
        )}

        {activeTab === "call" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              {t("support.transportation.commsSection.callScripts.description")}
            </p>

            <ScrollReveal>
              <Card className="border border-border/60 dark:border-border/40 shadow-sm">
                <CardHeader className="pb-3">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full text-left"
                    onClick={() => setDmvExpanded(!dmvExpanded)}
                    aria-expanded={dmvExpanded}
                  >
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Phone className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      {t("support.transportation.commsSection.callScripts.dmv.label")}
                    </CardTitle>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${dmvExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                </CardHeader>
                {dmvExpanded && (
                  <CardContent>
                    <div className="bg-muted/40 dark:bg-muted/20 rounded-lg p-4 border border-border/40">
                      <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                        {t("support.transportation.commsSection.callScripts.dmv.script")}
                      </pre>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <CopyScriptButton
                        text={t("support.transportation.commsSection.callScripts.dmv.script")}
                        t={t}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            </ScrollReveal>

            <ScrollReveal>
              <Card className="border border-cyan-200 dark:border-cyan-800 bg-cyan-50/50 dark:bg-cyan-950/20 shadow-sm mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    {t("support.transportation.commsSection.callScripts.tips.label")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {callTips.map((tip) => (
                      <li
                        key={tip}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-cyan-500 mt-1 shrink-0">•</span>
                        {t(
                          `support.transportation.commsSection.callScripts.tips.items.${tip}`
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        )}

        <ScrollReveal>
          <Card className="border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 shadow-sm mt-8">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                  {t("support.transportation.tips.tip1")}
                </p>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function TransportationSupport() {
  const { t } = useTranslation();

  const startHereItems: ActionItem[] = [
    {
      id: "check-license",
      title: t("support.transportation.actions.checkLicense.title"),
      description: t("support.transportation.actions.checkLicense.description"),
      priority: "high",
      timeframe: t("support.transportation.actions.checkLicense.timeframe"),
    },
    {
      id: "hardship-license",
      title: t("support.transportation.actions.hardshipLicense.title"),
      description: t("support.transportation.actions.hardshipLicense.description"),
      priority: "high",
      timeframe: t("support.transportation.actions.hardshipLicense.timeframe"),
    },
    {
      id: "plan-court-travel",
      title: t("support.transportation.actions.planCourtTravel.title"),
      description: t("support.transportation.actions.planCourtTravel.description"),
      priority: "high",
    },
    {
      id: "notify-dependents",
      title: t("support.transportation.actions.notifyDependents.title"),
      description: t("support.transportation.actions.notifyDependents.description"),
      priority: "medium",
    },
    {
      id: "explore-alternatives",
      title: t("support.transportation.actions.exploreAlternatives.title"),
      description: t("support.transportation.actions.exploreAlternatives.description"),
      priority: "medium",
    },
    {
      id: "budget-transport",
      title: t("support.transportation.actions.budgetTransport.title"),
      description: t("support.transportation.actions.budgetTransport.description"),
      priority: "medium",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "National Center for Mobility Management (NCMM)",
      description: t("support.transportation.resources.ncmm.description"),
      url: "https://nationalcenterformobilitymanagement.org/",
      type: "national",
      free: true,
    },
    {
      name: "211 / United Way — Local Transportation Help",
      description: t("support.transportation.resources.unitedWay.description"),
      url: "https://www.211.org/",
      phone: "211",
      type: "local",
      free: true,
    },
    {
      name: "Google Maps / Transit App",
      description: t("support.transportation.resources.transit.description"),
      url: "https://maps.google.com/",
      type: "online",
      free: true,
    },
    {
      name: "Lyft Healthcare Transportation",
      description: t("support.transportation.resources.lyft.description"),
      url: "https://www.lyft.com/rider/lyft-healthcare",
      type: "national",
      free: false,
    },
    {
      name: "Your State DMV",
      description: t("support.transportation.resources.dmv.description"),
      url: "https://www.usa.gov/motor-vehicle-services",
      type: "state",
      free: true,
    },
    {
      name: "BenefitsCheckup.org",
      description: t("support.transportation.resources.benefits.description"),
      url: "https://www.benefitscheckup.org/",
      type: "online",
      free: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t("support.transportation.faq.q1.question"),
      answer: t("support.transportation.faq.q1.answer"),
    },
    {
      question: t("support.transportation.faq.q2.question"),
      answer: t("support.transportation.faq.q2.answer"),
    },
    {
      question: t("support.transportation.faq.q3.question"),
      answer: t("support.transportation.faq.q3.answer"),
    },
    {
      question: t("support.transportation.faq.q4.question"),
      answer: t("support.transportation.faq.q4.answer"),
    },
  ];

  const tips: string[] = [
    t("support.transportation.tips.tip2"),
    t("support.transportation.tips.tip3"),
    t("support.transportation.tips.tip4"),
  ];

  return (
    <ResourcePageTemplate
      categoryId="transportation"
      icon={Car}
      iconColor="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
      heroGradient="bg-gradient-to-br from-cyan-500/5 via-background to-background"
      overview={t("support.transportation.overview")}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      relatedLinks={[
        { label: t("support.relatedLinks.finances"), href: "/support/finances" },
        { label: t("support.relatedLinks.courtLogistics"), href: "/support/court-logistics" },
        { label: t("support.relatedLinks.childcare"), href: "/support/childcare" },
      ]}
      customSections={<TransportationCommsSection />}
    />
  );
}
