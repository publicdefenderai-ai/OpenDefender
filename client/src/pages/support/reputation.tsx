import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import reputationHero from "@assets/stock_images/reputation.jpg";
import {
  ShieldCheck,
  Copy,
  Check,
  Printer,
  MessageSquare,
  Mail,
  ChevronDown,
  BookOpen,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  FileSearch,
  Award,
  Info,
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
              h1 { font-size: 18px; color: #333; border-bottom: 2px solid #64748b; padding-bottom: 8px; }
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
            <p class="note">${t("support.reputation.commsSection.personalizeNote")}</p>
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
                ? t("support.reputation.commsSection.copied")
                : t("support.reputation.commsSection.copyButton")}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 text-xs gap-1.5">
              <Printer className="h-3.5 w-3.5" />
              {t("support.reputation.commsSection.printButton")}
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
        ? t("support.reputation.commsSection.copied")
        : t("support.reputation.commsSection.copyButton")}
    </Button>
  );
}

function CleanSlateSection() {
  const { t } = useTranslation();
  const ns = "support.reputation.cleanSlate";
  const statesList = t(`${ns}.statesList`, { returnObjects: true }) as string[];
  const checkSteps = t(`${ns}.checkSteps`, { returnObjects: true }) as string[];

  return (
    <section className="py-10 md:py-14 bg-muted/20 border-t border-border/30" id="clean-slate">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-2">
            <RefreshCw className="h-5 w-5 text-teal-600" />
            <h2 className="text-xl font-bold text-foreground">{t(`${ns}.sectionTitle`)}</h2>
          </div>
          <p className="text-muted-foreground mb-8">{t(`${ns}.sectionSubtitle`)}</p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <ScrollReveal>
            <Card>
              <CardContent className="pt-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">{t(`${ns}.gapLabel`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`${ns}.gapBody`)}</p>
              </CardContent>
            </Card>
          </ScrollReveal>
          <ScrollReveal delay={0.07}>
            <Card>
              <CardContent className="pt-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">{t(`${ns}.autoLabel`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`${ns}.autoBody`)}</p>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t(`${ns}.statesTitle`)}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {statesList.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-teal-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-3 italic">{t(`${ns}.statesNote`)}</p>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal>
          <Card className="mb-6">
            <CardContent className="pt-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">{t(`${ns}.checkTitle`)}</h3>
              <ol className="space-y-2">
                {checkSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground flex-shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal>
          <div className="rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20 p-5 mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">{t(`${ns}.screenerLabel`)}</h3>
            <p className="text-sm text-muted-foreground mb-3">{t(`${ns}.screenerDesc`)}</p>
            <a href="/support/reputation/eligibility" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors">
              {t(`${ns}.screenerCta`)} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: t(`${ns}.cfaLabel`), desc: t(`${ns}.cfaDesc`), url: "https://www.codeforamerica.org/programs/clear-my-record/" },
              { label: t(`${ns}.cleanSlateLabel`), desc: t(`${ns}.cleanSlateDesc`), url: "https://cleanslateinitiative.org/states/" },
              { label: t(`${ns}.lawHelpLabel`), desc: t(`${ns}.lawHelpDesc`), url: "https://www.lawhelp.org/" },
            ].map(({ label, desc, url }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer">
                <Card className="h-full hover:border-teal-300 dark:hover:border-teal-700 transition-colors cursor-pointer">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{label}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function FcraRightsSection() {
  const { t } = useTranslation();
  const ns = "support.reputation.fcraRights";
  const steps = t(`${ns}.whatToDoSteps`, { returnObjects: true }) as string[];

  return (
    <section className="py-10 md:py-14 bg-background border-t border-border/30" id="fcra-rights">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-2">
            <FileSearch className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-foreground">{t(`${ns}.sectionTitle`)}</h2>
          </div>
          <p className="text-muted-foreground mb-8">{t(`${ns}.sectionSubtitle`)}</p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {[
            { title: t(`${ns}.adverseActionTitle`), body: t(`${ns}.adverseActionBody`) },
            { title: t(`${ns}.disputeTitle`), body: t(`${ns}.disputeBody`) },
            { title: t(`${ns}.lookbackTitle`), body: t(`${ns}.lookbackBody`) },
          ].map(({ title, body }, i) => (
            <ScrollReveal key={title} delay={i * 0.07}>
              <Card className="h-full">
                <CardContent className="pt-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
          <ScrollReveal delay={0.21}>
            <Card className="h-full border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20">
              <CardContent className="pt-5">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{t(`${ns}.rapSheetNote`)}</p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <Card className="mb-6">
            <CardContent className="pt-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">{t(`${ns}.whatToDoTitle`)}</h3>
              <ol className="space-y-2">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground flex-shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: t(`${ns}.cfpbLabel`), desc: t(`${ns}.cfpbDesc`), url: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/" },
              { label: t(`${ns}.eeocLabel`), desc: t(`${ns}.eeocDesc`), url: "https://www.eeoc.gov/laws/guidance/questions-and-answers-clarify-and-provide-common-interpretation-uniform-guidelines" },
              { label: t(`${ns}.nelp2Label`), desc: t(`${ns}.nelp2Desc`), url: "https://www.nelp.org/publication/fair-chance-hiring-criminal-records/" },
            ].map(({ label, desc, url }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer">
                <Card className="h-full hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{label}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function CertificatesOfReliefSection() {
  const { t } = useTranslation();
  const ns = "support.reputation.certificatesOfRelief";
  const statesList = t(`${ns}.statesList`, { returnObjects: true }) as string[];
  const howSteps = t(`${ns}.howSteps`, { returnObjects: true }) as string[];

  return (
    <section className="py-10 md:py-14 bg-muted/20 border-t border-border/30" id="certificates-of-relief">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-2">
            <Award className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-bold text-foreground">{t(`${ns}.sectionTitle`)}</h2>
          </div>
          <p className="text-muted-foreground mb-8">{t(`${ns}.sectionSubtitle`)}</p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <ScrollReveal>
            <Card className="h-full">
              <CardContent className="pt-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">{t(`${ns}.whatTitle`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`${ns}.whatBody`)}</p>
              </CardContent>
            </Card>
          </ScrollReveal>
          <ScrollReveal delay={0.07}>
            <Card className="h-full">
              <CardContent className="pt-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">{t(`${ns}.vsExpungementTitle`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`${ns}.vsExpungementBody`)}</p>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <Card className="mb-6">
            <CardContent className="pt-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">{t(`${ns}.statesTitle`)}</h3>
              <ul className="space-y-1.5">
                {statesList.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-3 italic">{t(`${ns}.statesNote`)}</p>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal>
          <Card className="mb-6">
            <CardContent className="pt-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">{t(`${ns}.howTitle`)}</h3>
              <ol className="space-y-2">
                {howSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground flex-shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: t(`${ns}.ccrcLabel`), desc: t(`${ns}.ccrcDesc`), url: "https://ccrcatlaw.org/resources/" },
              { label: t(`${ns}.cleanSlateLink`), desc: t(`${ns}.cleanSlateLinkDesc`), url: "https://cleanslateinitiative.org/states/" },
            ].map(({ label, desc, url }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer">
                <Card className="h-full hover:border-amber-300 dark:hover:border-amber-700 transition-colors cursor-pointer">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{label}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ReputationCommsSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"written" | "conversation">("written");
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const callTips = ["tip1", "tip2", "tip3", "tip4"];
  const conversationScripts = ["unexpected", "interview"] as const;
  const writtenTemplates = ["closeFriend", "professional", "mugshot"] as const;

  return (
    <section className="py-10 md:py-14 bg-background" id="reputation-comms">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-slate-500/10">
                <MessageSquare className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("support.reputation.commsSection.sectionTitle")}
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("support.reputation.commsSection.sectionDescription")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 flex items-start gap-3">
            <Badge
              variant="outline"
              className="shrink-0 mt-0.5 border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40"
            >
              {t("support.reputation.commsSection.tipLabel")}
            </Badge>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {t("support.reputation.commsSection.personalizeNote")}
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
              {t("support.reputation.commsSection.emailTemplates.title")}
            </Button>
            <Button
              variant={activeTab === "conversation" ? "default" : "outline"}
              onClick={() => setActiveTab("conversation")}
              className="gap-2"
              role="tab"
              aria-selected={activeTab === "conversation"}
            >
              <MessageSquare className="h-4 w-4" />
              {t("support.reputation.commsSection.callScripts.title")}
            </Button>
          </div>
        </ScrollReveal>

        {activeTab === "written" && (
          <div className="space-y-4">
            {writtenTemplates.map((key) => (
              <ScrollReveal key={key}>
                <TemplateCard
                  label={t(`support.reputation.commsSection.emailTemplates.${key}.label`)}
                  subject={
                    t(`support.reputation.commsSection.emailTemplates.${key}.subject`) || undefined
                  }
                  body={t(`support.reputation.commsSection.emailTemplates.${key}.body`)}
                  t={t}
                />
              </ScrollReveal>
            ))}
          </div>
        )}

        {activeTab === "conversation" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              {t("support.reputation.commsSection.callScripts.description")}
            </p>

            {conversationScripts.map((key) => (
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
                        <MessageSquare className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        {t(`support.reputation.commsSection.callScripts.${key}.label`)}
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
                          {t(`support.reputation.commsSection.callScripts.${key}.script`)}
                        </pre>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <CopyScriptButton
                          text={t(`support.reputation.commsSection.callScripts.${key}.script`)}
                          t={t}
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              </ScrollReveal>
            ))}

            <ScrollReveal>
              <Card className="border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/20 shadow-sm mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    {t("support.reputation.commsSection.callScripts.tips.label")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {callTips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-slate-500 mt-1 shrink-0">•</span>
                        {t(`support.reputation.commsSection.callScripts.tips.items.${tip}`)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        )}

        <ScrollReveal>
          <Card className="border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-950/10 shadow-sm mt-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                Charges are not convictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A charge means the government has accused you of something, not that you are guilty. You have the right to a presumption of innocence. You can say this clearly and accurately in any conversation, professional context, or written response. Many people are charged and never convicted, or have charges reduced or dismissed. Your story is not finished.
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}

const SIDEBAR_SECTIONS = [
  { id: "section-start-here", labelKey: "support.startHere",                      indent: false },
  { id: "clean-slate",        labelKey: "support.reputation.cleanSlate.sectionTitle", indent: false },
  { id: "fcra-rights",        labelKey: "support.reputation.fcraRights.sectionTitle", indent: false },
  { id: "certificates-of-relief", labelKey: "support.reputation.certificatesOfRelief.sectionTitle", indent: false },
  { id: "reputation-comms",   labelKey: "support.reputation.commsSection.sectionTitle", indent: false },
  { id: "section-resources",  labelKey: "support.helpfulResources",  indent: false },
  { id: "section-faq",        labelKey: "support.faq.title",         indent: false },
  { id: "section-tips",       labelKey: "support.tips.title",        indent: false },
] as const;

function ReputationSidebar({ activeId }: { activeId: string | null }) {
  const { t } = useTranslation();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  };

  return (
    <nav aria-label="Page sections" className="space-y-0.5">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-2">
        On this page
      </p>
      {SIDEBAR_SECTIONS.map(({ id, labelKey }) => {
        const isActive = activeId === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`w-full flex items-center gap-2 text-left rounded-lg px-2 py-1.5 transition-all duration-150 text-xs ${
              isActive
                ? "bg-slate-100 dark:bg-slate-800 text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" />}
            <span className="truncate leading-snug">{t(labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function ReputationSupport() {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string | null>("section-start-here");

  useEffect(() => {
    const handleScroll = () => {
      const ids = SIDEBAR_SECTIONS.map((s) => s.id);
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const startHereItems: ActionItem[] = [
    {
      id: "control-narrative",
      title: t("support.reputation.actions.controlNarrative.title"),
      description: t("support.reputation.actions.controlNarrative.description"),
      priority: "high",
      timeframe: t("support.reputation.actions.controlNarrative.timeframe"),
    },
    {
      id: "understand-record",
      title: t("support.reputation.actions.understandRecord.title"),
      description: t("support.reputation.actions.understandRecord.description"),
      priority: "high",
      timeframe: t("support.reputation.actions.understandRecord.timeframe"),
    },
    {
      id: "social-media",
      title: t("support.reputation.actions.socialMedia.title"),
      description: t("support.reputation.actions.socialMedia.description"),
      priority: "high",
    },
    {
      id: "prepare-response",
      title: t("support.reputation.actions.prepareResponse.title"),
      description: t("support.reputation.actions.prepareResponse.description"),
      priority: "medium",
    },
    {
      id: "document-positives",
      title: t("support.reputation.actions.documentPositives.title"),
      description: t("support.reputation.actions.documentPositives.description"),
      priority: "medium",
    },
    {
      id: "plan-record-relief",
      title: t("support.reputation.actions.planRecordRelief.title"),
      description: t("support.reputation.actions.planRecordRelief.description"),
      priority: "medium",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "Clear My Record / LawHelp.org",
      description: t("support.reputation.resources.recordClear.description"),
      url: "https://www.lawhelp.org/",
      type: "national",
      free: true,
    },
    {
      name: "National Employment Law Project (NELP)",
      description: t("support.reputation.resources.nelp.description"),
      url: "https://www.nelp.org/",
      type: "national",
      free: true,
    },
    {
      name: "EEOC: Criminal Background Checks",
      description: t("support.reputation.resources.eeoc.description"),
      url: "https://www.eeoc.gov/laws/guidance/questions-and-answers-clarify-and-provide-common-interpretation-uniform-guidelines",
      type: "national",
      free: true,
    },
    {
      name: "Mugshot Removal: Know Your State's Law",
      description: t("support.reputation.resources.mugRemoval.description"),
      url: "https://consumerfed.org/issues/privacy/",
      type: "online",
      free: true,
    },
    {
      name: "Online Reputation Management",
      description: t("support.reputation.resources.repDefender.description"),
      url: "https://support.google.com/websearch/troubleshooter/3111061",
      type: "online",
      free: true,
    },
    {
      name: "LawHelp.org: Expungement by State",
      description: t("support.reputation.resources.lawHelp.description"),
      url: "https://www.lawhelp.org/",
      type: "national",
      free: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t("support.reputation.faq.q1.question"),
      answer: t("support.reputation.faq.q1.answer"),
    },
    {
      question: t("support.reputation.faq.q2.question"),
      answer: t("support.reputation.faq.q2.answer"),
    },
    {
      question: t("support.reputation.faq.q3.question"),
      answer: t("support.reputation.faq.q3.answer"),
    },
    {
      question: t("support.reputation.faq.q4.question"),
      answer: t("support.reputation.faq.q4.answer"),
    },
  ];

  const tips: string[] = [
    t("support.reputation.tips.tip1"),
    t("support.reputation.tips.tip2"),
    t("support.reputation.tips.tip3"),
    t("support.reputation.tips.tip4"),
    t("support.reputation.tips.tip5"),
  ];

  return (
    <ResourcePageTemplate
      categoryId="reputation"
      heroImage={reputationHero}
      icon={ShieldCheck}
      iconColor="bg-slate-500/10 text-slate-600 dark:text-slate-400"
      heroGradient="bg-gradient-to-br from-slate-500/5 via-background to-background"
      overview={t("support.reputation.overview")}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      relatedLinks={[
        { label: t("support.relatedLinks.employment"), href: "/support/employment" },
        { label: t("support.relatedLinks.mentalHealth"), href: "/support/mental-health" },
        { label: t("support.relatedLinks.finances"), href: "/support/finances" },
      ]}
      customSections={<><CleanSlateSection /><FcraRightsSection /><CertificatesOfReliefSection /><ReputationCommsSection /></>}
      sidebar={<ReputationSidebar activeId={activeId} />}
    />
  );
}
