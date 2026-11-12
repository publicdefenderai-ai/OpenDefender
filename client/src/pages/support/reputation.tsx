import { NrrcResources } from "@/components/nrrc-resources";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { reputationDesignCopy } from "@/locales/reputation-design";
import {
  ShieldCheck,
  Copy,
  Check,
  Printer,
  MessageSquare,
  Mail,
  ChevronDown,
  BookOpen,
  ExternalLink,
  ArrowRight,
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
  onBodyChange,
  t,
}: {
  label: string;
  subject?: string;
  body: string;
  onBodyChange: (value: string) => void;
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
            <title></title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; max-width: 700px; margin: 0 auto; }
              h1 { font-size: 18px; color: #333; border-bottom: 1px solid #777; padding-bottom: 8px; }
              .subject { font-weight: bold; margin-bottom: 16px; }
              .body { white-space: pre-wrap; overflow-wrap: anywhere; }
              .note { font-size: 12px; color: #666; margin-top: 24px; padding-top: 12px; border-top: 1px solid #ddd; font-style: italic; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>
            <h1></h1>
            <p class="subject"></p>
            <div class="body"></div>
            <p class="note"></p>
          </body>
        </html>
      `);
      const page = printWindow.document;
      page.documentElement.lang = document.documentElement.lang;
      page.title = label;
      page.querySelector("h1")!.textContent = label;
      const subjectLine = page.querySelector<HTMLElement>(".subject")!;
      subjectLine.hidden = !subject;
      subjectLine.textContent = subject ?? "";
      page.querySelector(".body")!.textContent = body;
      page.querySelector(".note")!.textContent = t("support.reputation.commsSection.personalizeNote");
      page.close();
      printWindow.print();
    }
  };

  return (
    <Card role="group" aria-label={label} className="border border-border/60 dark:border-border/40 shadow-sm">
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
        <textarea aria-label={label} value={body} onChange={event => onBodyChange(event.target.value)}
          className="w-full min-h-72 p-3 text-sm leading-relaxed border border-border bg-background" />

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
          <h2 className="mb-2 text-xl font-bold text-foreground">{t(`${ns}.sectionTitle`)}</h2>
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
          <details className="reputation-disclosure">
            <summary>{t(`${ns}.statesTitle`)}</summary>
            <div>
              <ul className="space-y-1.5">
                {statesList.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-3 italic">{t(`${ns}.statesNote`)}</p>
            </div>
          </details>
        </ScrollReveal>

        <ScrollReveal>
          <details className="reputation-disclosure">
            <summary>{t(`${ns}.checkTitle`)}</summary>
            <div>
              <ol className="space-y-2">
                {checkSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground flex-shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </details>
        </ScrollReveal>

        <ScrollReveal>
          <div className="rounded-xl border border-border bg-muted p-5 mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">{t(`${ns}.screenerLabel`)}</h3>
            <p className="text-sm text-muted-foreground mb-3">{t(`${ns}.screenerDesc`)}</p>
            <a href="/support/reputation/eligibility" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-colors">
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
                <Card className="h-full hover:border-primary transition-colors cursor-pointer">
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
          <h2 className="mb-2 text-xl font-bold text-foreground">{t(`${ns}.sectionTitle`)}</h2>
          <p className="text-muted-foreground mb-8">{t(`${ns}.sectionSubtitle`)}</p>
        </ScrollReveal>

        <div className="mb-6">
          {[
            { title: t(`${ns}.adverseActionTitle`), body: t(`${ns}.adverseActionBody`) },
            { title: t(`${ns}.disputeTitle`), body: t(`${ns}.disputeBody`) },
            { title: t(`${ns}.lookbackTitle`), body: t(`${ns}.lookbackBody`) },
          ].map(({ title, body }) => (
            <details className="reputation-disclosure" key={title}>
              <summary>{title}</summary>
              <p>{body}</p>
            </details>
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
          <details className="reputation-disclosure">
            <summary>{t(`${ns}.whatToDoTitle`)}</summary>
            <div>
              <ol className="space-y-2">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground flex-shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </details>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: t(`${ns}.cfpbLabel`), desc: t(`${ns}.cfpbDesc`), url: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/" },
              { label: t(`${ns}.eeocLabel`), desc: t(`${ns}.eeocDesc`), url: "https://www.eeoc.gov/laws/guidance/questions-and-answers-clarify-and-provide-common-interpretation-uniform-guidelines" },
              { label: t(`${ns}.nelp2Label`), desc: t(`${ns}.nelp2Desc`), url: "https://www.nelp.org/publication/fair-chance-hiring-criminal-records/" },
            ].map(({ label, desc, url }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer">
                <Card className="h-full hover:border-primary transition-colors cursor-pointer">
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

function RapSheetSection() {
  const { t } = useTranslation();
  const ns = "support.reputation.rapSheet";

  const errors = ["error1", "error2", "error3"] as const;

  return (
    <section className="py-10 md:py-14 bg-background border-t border-border/30" id="rap-sheet">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <h2 className="mb-2 text-xl font-bold text-foreground">{t(`${ns}.sectionTitle`)}</h2>
          <p className="text-muted-foreground mb-8">{t(`${ns}.sectionSubtitle`)}</p>
        </ScrollReveal>

        {/* Step 1 */}
        <ScrollReveal>
          <div className="mb-8">
            <h3 className="text-base font-semibold text-foreground mb-3">{t(`${ns}.step1Title`)}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t(`${ns}.step1Intro`)}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm font-semibold text-foreground mb-1">{t(`${ns}.fbiTitle`)}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t(`${ns}.fbiBody`)}</p>
                  <a
                    href="https://www.fbi.gov/services/cjis/identity-history-summary-checks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    IdentityHistory.fbi.gov <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm font-semibold text-foreground mb-1">{t(`${ns}.stateTitle`)}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`${ns}.stateBody`)}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollReveal>

        {/* Step 2 */}
        <ScrollReveal>
          <div className="mb-8">
            <h3 className="text-base font-semibold text-foreground mb-1">{t(`${ns}.step2Title`)}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t(`${ns}.step2Intro`)}</p>
            <div className="space-y-3">
              {errors.map(key => (
                <details key={key} className="reputation-disclosure">
                  <summary>{t(`${ns}.${key}Title`)}</summary>
                  <p>{t(`${ns}.${key}Body`)}</p>
                  <p>{t(`${ns}.${key}Fix`)}</p>
                </details>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Step 3 */}
        <ScrollReveal>
          <div className="mb-6">
            <h3 className="text-base font-semibold text-foreground mb-1">{t(`${ns}.step3Title`)}</h3>
            <p className="text-sm text-muted-foreground mb-3">{t(`${ns}.step3Intro`)}</p>
            <Card>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {[
                    t(`${ns}.fbiFix`),
                    t(`${ns}.stateFix`),
                    t(`${ns}.fcraNote`),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Timing callout */}
        <ScrollReveal>
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-4">
              <p className="text-sm font-semibold text-foreground mb-1">{t(`${ns}.timingTitle`)}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(`${ns}.timingBody`)}</p>
            </CardContent>
          </Card>
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
          <h2 className="mb-2 text-xl font-bold text-foreground">{t(`${ns}.sectionTitle`)}</h2>
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
          <details className="reputation-disclosure">
            <summary>{t(`${ns}.statesTitle`)}</summary>
            <div>
              <ul className="space-y-1.5">
                {statesList.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-3 italic">{t(`${ns}.statesNote`)}</p>
            </div>
          </details>
        </ScrollReveal>

        <ScrollReveal>
          <details className="reputation-disclosure">
            <summary>{t(`${ns}.howTitle`)}</summary>
            <div>
              <ol className="space-y-2">
                {howSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground flex-shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </details>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: t(`${ns}.ccrcLabel`), desc: t(`${ns}.ccrcDesc`), url: "https://ccrcatlaw.org/resources/" },
              { label: t(`${ns}.cleanSlateLink`), desc: t(`${ns}.cleanSlateLinkDesc`), url: "https://cleanslateinitiative.org/states/" },
            ].map(({ label, desc, url }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer">
                <Card className="h-full hover:border-primary transition-colors cursor-pointer">
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
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<"written" | "conversation">("written");
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const callTips = ["tip1", "tip2", "tip3", "tip4"];
  const conversationScripts = ["unexpected", "interview"] as const;
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [selectedLetter, setSelectedLetter] = useState("closeFriend");
  const draftId = `${i18n.resolvedLanguage ?? i18n.language}:${selectedLetter}`;
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
          <div className="flex flex-wrap gap-2 mb-6" role="tablist">
            <Button
              variant={activeTab === "written" ? "default" : "outline"}
              onClick={() => setActiveTab("written")}
              className="h-auto min-h-11 max-w-full whitespace-normal gap-2 text-left"
              role="tab"
              aria-selected={activeTab === "written"}
            >
              <Mail className="h-4 w-4" />
              {t("support.reputation.commsSection.emailTemplates.title")}
            </Button>
            <Button
              variant={activeTab === "conversation" ? "default" : "outline"}
              onClick={() => setActiveTab("conversation")}
              className="h-auto min-h-11 max-w-full whitespace-normal gap-2 text-left"
              role="tab"
              aria-selected={activeTab === "conversation"}
            >
              <MessageSquare className="h-4 w-4" />
              {t("support.reputation.commsSection.callScripts.title")}
            </Button>
          </div>
        </ScrollReveal>

        {activeTab === "written" && (
          <div className="reputation-letter">
            <label htmlFor="reputation-letter-choice">{t("support.reputation.commsSection.emailTemplates.title")}</label>
            <select id="reputation-letter-choice" value={selectedLetter} onChange={event => setSelectedLetter(event.target.value)}>
              {writtenTemplates.map(key => (
                <option key={key} value={key}>{t(`support.reputation.commsSection.emailTemplates.${key}.label`)}</option>
              ))}
            </select>
            <TemplateCard
              key={draftId}
              label={t(`support.reputation.commsSection.emailTemplates.${selectedLetter}.label`)}
              subject={t(`support.reputation.commsSection.emailTemplates.${selectedLetter}.subject`)}
              body={drafts[draftId] ?? t(`support.reputation.commsSection.emailTemplates.${selectedLetter}.body`)}
              onBodyChange={value => setDrafts(current => ({ ...current, [draftId]: value }))}
              t={t}
            />
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

export default function ReputationSupport() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const copy = language.startsWith("es") ? reputationDesignCopy.es : language.startsWith("zh") ? reputationDesignCopy.zh : reputationDesignCopy.en;
  const sections = [
    { id: "clean-slate", label: t("support.reputation.cleanSlate.sectionTitle") },
    { id: "fcra-rights", label: t("support.reputation.fcraRights.sectionTitle") },
    { id: "rap-sheet", label: t("support.reputation.rapSheet.sectionTitle") },
    { id: "certificates-of-relief", label: t("support.reputation.certificatesOfRelief.sectionTitle") },
    { id: "reputation-comms", label: t("support.reputation.commsSection.sectionTitle") },
  ];

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
      mainClassName="reputation-page"
      actionHeading={copy.start}
      customNavItems={sections}
      introduction={<>
        <Link className="reputation-back" href="/support">{t("support.backToSupport")}</Link>
        <section className="reputation-hero">
          <div>
            <p>{t("support.relatedLinks.reputation")}</p>
            <h1>{copy.title}<br /><em>{copy.accent}</em></h1>
            <p>{t("support.reputation.overview")}</p>
          </div>
          <img src="/images/design/reputation.svg" alt="" width="240" height="220" />
        </section>
      </>}
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
      customSections={<>
        <NrrcResources ids={["consequences"]} />
        <CleanSlateSection />
        <FcraRightsSection />
        <RapSheetSection />
        <CertificatesOfReliefSection />
        <ReputationCommsSection />
      </>}
    />
  );
}
