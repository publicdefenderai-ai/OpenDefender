import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Copy,
  Check,
  Printer,
  Phone,
  Mail,
  ChevronDown,
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
              h1 { font-size: 18px; color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 8px; }
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
            <p class="note">${t("support.familyCare.commsSection.personalizeNote")}</p>
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
            <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 text-xs gap-1.5">
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied
                ? t("support.familyCare.commsSection.copied")
                : t("support.familyCare.commsSection.copyButton")}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 text-xs gap-1.5">
              <Printer className="h-3.5 w-3.5" />
              {t("support.familyCare.commsSection.printButton")}
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
        ? t("support.familyCare.commsSection.copied")
        : t("support.familyCare.commsSection.copyButton")}
    </Button>
  );
}

function FamilyCareCommsSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"written" | "call">("written");
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const callTips = ["tip1", "tip2", "tip3", "tip4"];
  const callScripts = ["family", "aaa"] as const;
  const writtenTemplates = ["primaryHelper", "secondaryHelper", "provider"] as const;

  return (
    <section className="py-10 md:py-14 bg-background" id="family-care-comms">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("support.familyCare.commsSection.sectionTitle")}
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("support.familyCare.commsSection.sectionDescription")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 flex items-start gap-3">
            <Badge
              variant="outline"
              className="shrink-0 mt-0.5 border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40"
            >
              {t("support.familyCare.commsSection.tipLabel")}
            </Badge>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {t("support.familyCare.commsSection.personalizeNote")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex gap-2 mb-6" role="tablist">
            <Button
              variant={activeTab === "written" ? "default" : "outline"}
              onClick={() => setActiveTab("written")}
              className="gap-2"
              role="tab"
              aria-selected={activeTab === "written"}
            >
              <Mail className="h-4 w-4" />
              {t("support.familyCare.commsSection.emailTemplates.title")}
            </Button>
            <Button
              variant={activeTab === "call" ? "default" : "outline"}
              onClick={() => setActiveTab("call")}
              className="gap-2"
              role="tab"
              aria-selected={activeTab === "call"}
            >
              <Phone className="h-4 w-4" />
              {t("support.familyCare.commsSection.callScripts.title")}
            </Button>
          </div>
        </ScrollReveal>

        {activeTab === "written" && (
          <div className="space-y-4">
            {writtenTemplates.map((key) => (
              <ScrollReveal key={key}>
                <TemplateCard
                  label={t(`support.familyCare.commsSection.emailTemplates.${key}.label`)}
                  subject={
                    t(`support.familyCare.commsSection.emailTemplates.${key}.subject`) || undefined
                  }
                  body={t(`support.familyCare.commsSection.emailTemplates.${key}.body`)}
                  t={t}
                />
              </ScrollReveal>
            ))}
          </div>
        )}

        {activeTab === "call" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              {t("support.familyCare.commsSection.callScripts.description")}
            </p>

            {callScripts.map((key) => (
              <ScrollReveal key={key}>
                <Card className="border border-border/60 dark:border-border/40 shadow-sm">
                  <CardHeader className="pb-3">
                    <button
                      type="button"
                      className="flex items-center justify-between w-full text-left"
                      onClick={() =>
                        setExpandedScript(expandedScript === key ? null : key)
                      }
                      aria-expanded={expandedScript === key}
                    >
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        {t(`support.familyCare.commsSection.callScripts.${key}.label`)}
                      </CardTitle>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          expandedScript === key ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </CardHeader>
                  {expandedScript === key && (
                    <CardContent>
                      <div className="bg-muted/40 dark:bg-muted/20 rounded-lg p-4 border border-border/40">
                        <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                          {t(`support.familyCare.commsSection.callScripts.${key}.script`)}
                        </pre>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <CopyScriptButton
                          text={t(`support.familyCare.commsSection.callScripts.${key}.script`)}
                          t={t}
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              </ScrollReveal>
            ))}

            <ScrollReveal>
              <Card className="border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    {t("support.familyCare.commsSection.callScripts.tips.label")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {callTips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-indigo-500 mt-1 shrink-0">•</span>
                        {t(`support.familyCare.commsSection.callScripts.tips.items.${tip}`)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        )}

        <ScrollReveal>
          <Card className="border border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/10 shadow-sm mt-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                You don't have to solve this alone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Caregiving is already one of the most demanding things a person can do. Going through a legal challenge on top of it is genuinely hard. The resources on this page exist because caregivers facing disruptions are not unusual — and you deserve the same support you work so hard to give others.
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function FamilyCareSupport() {
  const { t } = useTranslation();

  const startHereItems: ActionItem[] = [
    {
      id: "needs-sheet",
      title: t("support.familyCare.actions.needsSheet.title"),
      description: t("support.familyCare.actions.needsSheet.description"),
      priority: "high",
      timeframe: t("support.familyCare.actions.needsSheet.timeframe"),
    },
    {
      id: "identify-caregiver",
      title: t("support.familyCare.actions.identifyCaregiver.title"),
      description: t("support.familyCare.actions.identifyCaregiver.description"),
      priority: "high",
      timeframe: t("support.familyCare.actions.identifyCaregiver.timeframe"),
    },
    {
      id: "notify-providers",
      title: t("support.familyCare.actions.notifyProviders.title"),
      description: t("support.familyCare.actions.notifyProviders.description"),
      priority: "high",
    },
    {
      id: "contact-aaa",
      title: t("support.familyCare.actions.contactAAA.title"),
      description: t("support.familyCare.actions.contactAAA.description"),
      priority: "medium",
    },
    {
      id: "respite-care",
      title: t("support.familyCare.actions.respiteCare.title"),
      description: t("support.familyCare.actions.respiteCare.description"),
      priority: "medium",
    },
    {
      id: "legal-documents",
      title: t("support.familyCare.actions.legalDocuments.title"),
      description: t("support.familyCare.actions.legalDocuments.description"),
      priority: "medium",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "Eldercare Locator",
      description: t("support.familyCare.resources.eldercareLocator.description"),
      url: "https://eldercare.acl.gov/",
      phone: "1-800-677-1116",
      type: "national",
      free: true,
    },
    {
      name: "AARP Caregiver Support Line",
      description: t("support.familyCare.resources.aarp.description"),
      url: "https://www.aarp.org/caregiving/",
      phone: "1-877-333-5885",
      type: "national",
      free: true,
    },
    {
      name: "Caregiver Action Network",
      description: t("support.familyCare.resources.can.description"),
      url: "https://www.caregiveraction.org/",
      phone: "1-855-227-3640",
      type: "national",
      free: true,
    },
    {
      name: "National Respite Network (ARCH)",
      description: t("support.familyCare.resources.archRespite.description"),
      url: "https://archrespite.org/",
      type: "national",
      free: true,
    },
    {
      name: "211 / United Way — Local Care Services",
      description: t("support.familyCare.resources.unitedWay.description"),
      url: "https://www.211.org/",
      phone: "211",
      type: "local",
      free: true,
    },
    {
      name: "BenefitsCheckup.org",
      description: t("support.familyCare.resources.benefits.description"),
      url: "https://www.benefitscheckup.org/",
      type: "online",
      free: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t("support.familyCare.faq.q1.question"),
      answer: t("support.familyCare.faq.q1.answer"),
    },
    {
      question: t("support.familyCare.faq.q2.question"),
      answer: t("support.familyCare.faq.q2.answer"),
    },
    {
      question: t("support.familyCare.faq.q3.question"),
      answer: t("support.familyCare.faq.q3.answer"),
    },
    {
      question: t("support.familyCare.faq.q4.question"),
      answer: t("support.familyCare.faq.q4.answer"),
    },
  ];

  const tips: string[] = [
    t("support.familyCare.tips.tip1"),
    t("support.familyCare.tips.tip2"),
    t("support.familyCare.tips.tip3"),
    t("support.familyCare.tips.tip4"),
    t("support.familyCare.tips.tip5"),
  ];

  return (
    <ResourcePageTemplate
      categoryId="familyCare"
      icon={Users}
      iconColor="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
      heroGradient="bg-gradient-to-br from-indigo-500/5 via-background to-background"
      overview={t("support.familyCare.overview")}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      relatedLinks={[
        { label: t("support.relatedLinks.mentalHealth"), href: "/support/mental-health" },
        { label: t("support.relatedLinks.finances"), href: "/support/finances" },
        { label: t("support.relatedLinks.childcare"), href: "/support/childcare" },
      ]}
      customSections={<FamilyCareCommsSection />}
    />
  );
}
