import { useState } from "react";
import { useTranslation } from "react-i18next";
import housingHero from "@assets/stock_images/housing.png";
import {
  Home,
  Copy,
  Check,
  Printer,
  Phone,
  Mail,
  ChevronDown,
  Users,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Link } from "wouter";
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
              h1 { font-size: 18px; color: #333; border-bottom: 2px solid #d97706; padding-bottom: 8px; }
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
            <p class="note">${t("support.housing.networkSection.personalizeNote")}</p>
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
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold">{label}</CardTitle>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
            <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 text-xs gap-1.5">
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied
                ? t("support.housing.networkSection.copied")
                : t("support.housing.networkSection.copyButton")}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 text-xs gap-1.5">
              <Printer className="h-3.5 w-3.5" />
              {t("support.housing.networkSection.printButton")}
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
        ? t("support.housing.networkSection.copied")
        : t("support.housing.networkSection.copyButton")}
    </Button>
  );
}

function HomeownerSection() {
  return (
    <div className="mb-8">
      <ScrollReveal>
        <h2 className="text-xl font-bold text-foreground mb-1">If you own your home</h2>
        <p className="text-sm text-muted-foreground mb-4">The content above focuses on renters. If you own your home, your concerns are different — here's where to start.</p>
      </ScrollReveal>
      <div className="grid sm:grid-cols-3 gap-4">
        <ScrollReveal delay={0.05}>
          <Card className="h-full">
            <CardContent className="p-4">
              <p className="font-semibold text-sm text-foreground mb-1.5">Contact your mortgage servicer</p>
              <p className="text-sm text-muted-foreground">Call the number on your mortgage statement and ask about hardship options. Most servicers have forbearance programs that let you pause or reduce payments temporarily — you typically must request this; it is not automatic.</p>
            </CardContent>
          </Card>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Card className="h-full">
            <CardContent className="p-4">
              <p className="font-semibold text-sm text-foreground mb-1.5">Know your forbearance rights</p>
              <p className="text-sm text-muted-foreground">The CFPB (Consumer Financial Protection Bureau) provides free guidance on mortgage forbearance and your rights as a homeowner facing hardship. Visit <a href="https://www.consumerfinance.gov/housing/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 font-medium">consumerfinance.gov/housing</a> or call 1-855-411-2372.</p>
            </CardContent>
          </Card>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <Card className="h-full">
            <CardContent className="p-4">
              <p className="font-semibold text-sm text-foreground mb-1.5">Free HUD-approved counseling</p>
              <p className="text-sm text-muted-foreground">HUD-approved housing counselors can help you understand your options at no cost. Call <strong>1-800-569-4287</strong> or visit <a href="https://www.hud.gov/findacounselor" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 font-medium">hud.gov/findacounselor</a> to find someone in your area.</p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}

function HousingInstabilitySection() {
  return (
    <div className="mb-8 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-900/10 p-5">
      <ScrollReveal>
        <h2 className="text-base font-bold text-foreground mb-1">If you don't have stable housing</h2>
        <p className="text-sm text-muted-foreground mb-4">If you're currently without stable housing, that's the most urgent thing to address — it also affects your ability to receive court notices and meet bail conditions.</p>
        <ul className="space-y-2.5 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="font-semibold text-foreground flex-shrink-0">Call or text 211</span>
            <span>Free, 24/7, available in most of the US. Tell them you need emergency housing — they can connect you to shelters, transitional housing, and local programs.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-foreground flex-shrink-0">HUD emergency resources</span>
            <span className="min-w-0 break-words">Visit <a href="https://www.hud.gov/topics/homelessness" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 font-medium break-words">hud.gov/topics/homelessness</a> to find emergency housing assistance programs in your area.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-foreground flex-shrink-0">Keep a mailing address</span>
            <span>Court notices and case documents must reach you. A trusted contact's address, a shelter's address, or a local post office box all work. Let your attorney and the court know immediately if your address changes.</span>
          </li>
        </ul>
      </ScrollReveal>
    </div>
  );
}

function HousingNetworkSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"written" | "call">("written");
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const callTips = ["tip1", "tip2", "tip3", "tip4"];
  const callScripts = ["network", "landlord"] as const;
  const writtenTemplates = ["friendFamily", "landlordHardship", "landlordPaymentPlan"] as const;

  return (
    <section className="py-10 md:py-14 bg-background" id="housing-network">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("support.housing.networkSection.sectionTitle")}
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("support.housing.networkSection.sectionDescription")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 flex items-start gap-3">
            <Badge
              variant="outline"
              className="shrink-0 mt-0.5 border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40"
            >
              {t("support.housing.networkSection.tipLabel")}
            </Badge>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {t("support.housing.networkSection.personalizeNote")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex flex-wrap gap-2 mb-6" role="tablist">
            <Button
              variant={activeTab === "written" ? "default" : "outline"}
              onClick={() => setActiveTab("written")}
              className="h-auto min-h-11 max-w-full whitespace-normal gap-2 text-left"
              role="tab"
              aria-selected={activeTab === "written"}
            >
              <Mail className="h-4 w-4" />
              {t("support.housing.networkSection.emailTemplates.title")}
            </Button>
            <Button
              variant={activeTab === "call" ? "default" : "outline"}
              onClick={() => setActiveTab("call")}
              className="h-auto min-h-11 max-w-full whitespace-normal gap-2 text-left"
              role="tab"
              aria-selected={activeTab === "call"}
            >
              <Phone className="h-4 w-4" />
              {t("support.housing.networkSection.callScripts.title")}
            </Button>
          </div>
        </ScrollReveal>

        {activeTab === "written" && (
          <div className="space-y-4">
            {writtenTemplates.map((key) => (
              <ScrollReveal key={key}>
                <TemplateCard
                  label={t(`support.housing.networkSection.emailTemplates.${key}.label`)}
                  subject={
                    t(`support.housing.networkSection.emailTemplates.${key}.subject`) || undefined
                  }
                  body={t(`support.housing.networkSection.emailTemplates.${key}.body`)}
                  t={t}
                />
              </ScrollReveal>
            ))}
          </div>
        )}

        {activeTab === "call" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              {t("support.housing.networkSection.callScripts.description")}
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
                        <Phone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        {t(`support.housing.networkSection.callScripts.${key}.label`)}
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
                          {t(`support.housing.networkSection.callScripts.${key}.script`)}
                        </pre>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <CopyScriptButton
                          text={t(`support.housing.networkSection.callScripts.${key}.script`)}
                          t={t}
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              </ScrollReveal>
            ))}

            <ScrollReveal>
              <Card className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    {t("support.housing.networkSection.callScripts.tips.label")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {callTips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-amber-500 mt-1 shrink-0">•</span>
                        {t(`support.housing.networkSection.callScripts.tips.items.${tip}`)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        )}

        <ScrollReveal>
          <Card className="border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 shadow-sm mt-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                Know Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  t("support.housing.faq.q1.answer").split(".")[0] + ".",
                  "Your landlord cannot remove you, change locks, or shut off utilities without a court order — this is illegal in all states.",
                  "An eviction notice starts a process, not an end — you have the right to respond in court and seek legal help.",
                  "Free tenant legal aid exists in most areas for people facing eviction.",
                ].map((right, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-green-500 font-bold mt-0.5 shrink-0">✓</span>
                    <span>{right}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}

function HousingCollateralCallout() {
  return (
    <section className="py-10 md:py-12 bg-amber-50/60 dark:bg-amber-900/10 border-y border-amber-200 dark:border-amber-800/40">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold text-foreground mb-1">Before any plea: protect your housing</h2>
            <p className="text-sm text-muted-foreground">A conviction can trigger automatic housing consequences that go far beyond anything the court orders. These can affect your entire household — not just you — and often cannot be undone after the fact.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-white dark:bg-background border border-amber-200 dark:border-amber-800/50 rounded-lg p-3">
            <p className="text-xs font-semibold text-foreground mb-1">Public housing eviction</p>
            <p className="text-xs text-muted-foreground">Many public housing authorities are required by federal regulation to terminate leases after certain convictions, especially drug or violent felonies. The entire household can be displaced, not just the person convicted.</p>
          </div>
          <div className="bg-white dark:bg-background border border-amber-200 dark:border-amber-800/50 rounded-lg p-3">
            <p className="text-xs font-semibold text-foreground mb-1">Section 8 / Housing Choice Voucher</p>
            <p className="text-xs text-muted-foreground">Certain convictions — including manufacturing methamphetamine on federally assisted premises or lifetime sex offender registry — are grounds for mandatory denial or termination of housing vouchers under federal law.</p>
          </div>
          <div className="bg-white dark:bg-background border border-amber-200 dark:border-amber-800/50 rounded-lg p-3">
            <p className="text-xs font-semibold text-foreground mb-1">Private rentals</p>
            <p className="text-xs text-muted-foreground">Private landlords can legally screen for criminal history. A conviction — especially a felony — can make finding private rental housing significantly harder. Some cities have "ban the box" rules that limit when landlords can ask; check your local laws.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Ask your attorney specifically: "Will this charge or plea affect my housing or my family's housing?"before any decision.{' '}
          <Link href="/collateral-consequences" className="text-amber-700 dark:text-amber-400 underline font-medium">See all collateral consequences.</Link>
        </p>
      </div>
    </section>
  );
}

export default function HousingSupport() {
  const { t } = useTranslation();

  const startHereItems: ActionItem[] = [
    {
      id: "review-lease",
      title: t("support.housing.actions.reviewLease.title"),
      description: t("support.housing.actions.reviewLease.description"),
      priority: "high",
      timeframe: t("support.housing.actions.reviewLease.timeframe"),
    },
    {
      id: "talk-landlord",
      title: t("support.housing.actions.talkLandlord.title"),
      description: t("support.housing.actions.talkLandlord.description"),
      priority: "high",
      timeframe: t("support.housing.actions.talkLandlord.timeframe"),
    },
    {
      id: "know-eviction",
      title: t("support.housing.actions.knowEvictionProcess.title"),
      description: t("support.housing.actions.knowEvictionProcess.description"),
      priority: "high",
    },
    {
      id: "talk-network",
      title: t("support.housing.actions.talkNetwork.title"),
      description: t("support.housing.actions.talkNetwork.description"),
      priority: "medium",
    },
    {
      id: "apply-assistance",
      title: t("support.housing.actions.applyAssistance.title"),
      description: t("support.housing.actions.applyAssistance.description"),
      priority: "medium",
    },
    {
      id: "tenant-legal-aid",
      title: t("support.housing.actions.tenantLegalAid.title"),
      description: t("support.housing.actions.tenantLegalAid.description"),
      priority: "medium",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "211 / United Way — Emergency Rental Assistance",
      description: t("support.housing.resources.unitedWay.description"),
      url: "https://www.211.org/",
      phone: "211",
      type: "local",
      free: true,
    },
    {
      name: "HUD Rental Assistance Programs",
      description: t("support.housing.resources.era.description"),
      url: "https://www.hud.gov/topics/rental_assistance",
      type: "national",
      free: true,
    },
    {
      name: "National Low Income Housing Coalition",
      description: t("support.housing.resources.nlihc.description"),
      url: "https://nlihc.org/rental-assistance",
      type: "national",
      free: true,
    },
    {
      name: "HUD-Approved Housing Counselors",
      description: t("support.housing.resources.hud.description"),
      url: "https://www.hud.gov/i_want_to/talk_to_a_housing_counselor",
      phone: "1-800-569-4287",
      type: "national",
      free: true,
    },
    {
      name: "Tenant Legal Aid (Find Local Help)",
      description: t("support.housing.resources.tenantLegal.description"),
      url: "https://www.lawhelp.org/",
      type: "local",
      free: true,
    },
    {
      name: "BenefitsCheckup.org",
      description: t("support.housing.resources.benefits.description"),
      url: "https://www.benefitscheckup.org/",
      type: "online",
      free: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t("support.housing.faq.q1.question"),
      answer: t("support.housing.faq.q1.answer"),
    },
    {
      question: t("support.housing.faq.q2.question"),
      answer: t("support.housing.faq.q2.answer"),
    },
    {
      question: t("support.housing.faq.q3.question"),
      answer: t("support.housing.faq.q3.answer"),
    },
    {
      question: t("support.housing.faq.q4.question"),
      answer: t("support.housing.faq.q4.answer"),
    },
  ];

  const tips: string[] = [
    t("support.housing.tips.tip1"),
    t("support.housing.tips.tip2"),
    t("support.housing.tips.tip3"),
    t("support.housing.tips.tip4"),
    t("support.housing.tips.tip5"),
  ];

  return (
    <ResourcePageTemplate
      categoryId="housing"
      heroImage={housingHero}
      icon={Home}
      iconColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
      heroGradient="bg-gradient-to-br from-amber-500/5 via-background to-background"
      overview={t("support.housing.overview")}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      relatedLinks={[
        { label: t("support.relatedLinks.finances"), href: "/support/finances" },
        { label: t("support.relatedLinks.employment"), href: "/support/employment" },
        { label: t("support.relatedLinks.mentalHealth"), href: "/support/mental-health" },
      ]}
      customSections={
        <>
          <HomeownerSection />
          <HousingInstabilitySection />
          <HousingNetworkSection />
          <HousingCollateralCallout />
        </>
      }
    />
  );
}
