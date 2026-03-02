import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Briefcase, Mail, Phone, Copy, Check, Printer, ChevronDown, Shield, FileText } from "lucide-react";
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

function TemplateCard({ label, subject, body, t }: { label: string; subject?: string; body: string; t: (key: string) => string }) {
  const [copied, setCopied] = useState(false);
  const fullText = subject ? `${subject}\n\n${body}` : body;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = fullText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${label}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; max-width: 700px; margin: 0 auto; }
              h1 { font-size: 18px; color: #333; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
              .subject { font-weight: bold; margin-bottom: 16px; }
              .body { white-space: pre-wrap; }
              .note { font-size: 12px; color: #666; margin-top: 24px; padding-top: 12px; border-top: 1px solid #ddd; font-style: italic; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>
            <h1>${label}</h1>
            ${subject ? `<p class="subject">${subject}</p>` : ''}
            <div class="body">${body.replace(/\n/g, '<br>')}</div>
            <p class="note">${t('support.employment.courtTimeOff.personalizeNote')}</p>
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
              aria-label={copied ? t('support.employment.courtTimeOff.copied') : t('support.employment.courtTimeOff.copyButton')}
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t('support.employment.courtTimeOff.copied') : t('support.employment.courtTimeOff.copyButton')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs gap-1.5"
              aria-label={t('support.employment.courtTimeOff.printButton')}
            >
              <Printer className="h-3.5 w-3.5" />
              {t('support.employment.courtTimeOff.printButton')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {subject && (
          <p className="font-medium text-sm text-foreground mb-3 bg-muted/50 dark:bg-muted/30 px-3 py-2 rounded-md">{subject}</p>
        )}
        <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">{body}</pre>
      </CardContent>
    </Card>
  );
}

function CourtTimeOffSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'email' | 'call'>('email');
  const [expandedScript, setExpandedScript] = useState<string | null>(null);

  const emailTemplates = [
    { key: 'formal', hasSubject: true },
    { key: 'brief', hasSubject: true },
    { key: 'multipleDate', hasSubject: true },
  ];

  const callScripts = [
    { key: 'manager' },
    { key: 'hr' },
  ];

  const callTips = ['tip1', 'tip2', 'tip3', 'tip4', 'tip5'];

  const rights = ['r1', 'r2', 'r3', 'r4', 'r5'];

  return (
    <section className="py-10 md:py-14 bg-background" id="court-time-off">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {t('support.employment.courtTimeOff.sectionTitle')}
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('support.employment.courtTimeOff.sectionDescription')}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 flex items-start gap-3">
            <Badge variant="outline" className="shrink-0 mt-0.5 border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40">
              {t('support.employment.courtTimeOff.tipLabel')}
            </Badge>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {t('support.employment.courtTimeOff.personalizeNote')}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex gap-2 mb-6" role="tablist" aria-label="Template type">
            <Button
              variant={activeTab === 'email' ? 'default' : 'outline'}
              onClick={() => setActiveTab('email')}
              className="gap-2"
              role="tab"
              id="email-tab"
              aria-selected={activeTab === 'email'}
              aria-controls="email-panel"
            >
              <Mail className="h-4 w-4" />
              {t('support.employment.courtTimeOff.emailTemplates.title')}
            </Button>
            <Button
              variant={activeTab === 'call' ? 'default' : 'outline'}
              onClick={() => setActiveTab('call')}
              className="gap-2"
              role="tab"
              id="call-tab"
              aria-selected={activeTab === 'call'}
              aria-controls="call-panel"
            >
              <Phone className="h-4 w-4" />
              {t('support.employment.courtTimeOff.callScripts.title')}
            </Button>
          </div>
        </ScrollReveal>

        {activeTab === 'email' && (
          <div id="email-panel" role="tabpanel" aria-labelledby="email-tab" className="space-y-4">
            {emailTemplates.map((tmpl) => (
              <ScrollReveal key={tmpl.key}>
                <TemplateCard
                  label={t(`support.employment.courtTimeOff.emailTemplates.${tmpl.key}.label`)}
                  subject={tmpl.hasSubject ? t(`support.employment.courtTimeOff.emailTemplates.${tmpl.key}.subject`) : undefined}
                  body={t(`support.employment.courtTimeOff.emailTemplates.${tmpl.key}.body`)}
                  t={t}
                />
              </ScrollReveal>
            ))}
          </div>
        )}

        {activeTab === 'call' && (
          <div id="call-panel" role="tabpanel" aria-labelledby="call-tab" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              {t('support.employment.courtTimeOff.callScripts.description')}
            </p>

            {callScripts.map((script) => (
              <ScrollReveal key={script.key}>
                <Card className="border border-border/60 dark:border-border/40 shadow-sm">
                  <CardHeader className="pb-3">
                    <button
                      type="button"
                      className="flex items-center justify-between w-full text-left"
                      onClick={() => setExpandedScript(expandedScript === script.key ? null : script.key)}
                      aria-expanded={expandedScript === script.key}
                    >
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        {t(`support.employment.courtTimeOff.callScripts.${script.key}.label`)}
                      </CardTitle>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedScript === script.key ? 'rotate-180' : ''}`} />
                    </button>
                  </CardHeader>
                  {expandedScript === script.key && (
                    <CardContent>
                      <div className="bg-muted/40 dark:bg-muted/20 rounded-lg p-4 border border-border/40">
                        <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                          {t(`support.employment.courtTimeOff.callScripts.${script.key}.script`)}
                        </pre>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <CopyScriptButton
                          text={t(`support.employment.courtTimeOff.callScripts.${script.key}.script`)}
                          t={t}
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              </ScrollReveal>
            ))}

            <ScrollReveal>
              <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    {t('support.employment.courtTimeOff.callScripts.tips.label')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {callTips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-blue-500 mt-1 shrink-0">•</span>
                        {t(`support.employment.courtTimeOff.callScripts.tips.items.${tip}`)}
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
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                {t('support.employment.courtTimeOff.legalRights.title')}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('support.employment.courtTimeOff.legalRights.description')}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {rights.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm">
                    <span className="text-green-500 mt-0.5 shrink-0 font-bold">✓</span>
                    <span className="text-muted-foreground">
                      {t(`support.employment.courtTimeOff.legalRights.rights.${r}`)}
                    </span>
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

function CopyScriptButton({ text, t }: { text: string; t: (key: string) => string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 text-xs gap-1.5">
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? t('support.employment.courtTimeOff.copied') : t('support.employment.courtTimeOff.copyButton')}
    </Button>
  );
}

export default function EmploymentSupport() {
  const { t } = useTranslation();

  const startHereItems: ActionItem[] = [
    {
      id: "know-rights",
      title: t('support.employment.actions.knowRights.title'),
      description: t('support.employment.actions.knowRights.description'),
      priority: "high",
      timeframe: t('support.employment.actions.knowRights.timeframe'),
    },
    {
      id: "review-policy",
      title: t('support.employment.actions.reviewPolicy.title'),
      description: t('support.employment.actions.reviewPolicy.description'),
      priority: "high",
      timeframe: t('support.employment.actions.reviewPolicy.timeframe'),
    },
    {
      id: "document",
      title: t('support.employment.actions.document.title'),
      description: t('support.employment.actions.document.description'),
      priority: "medium",
    },
    {
      id: "plan-absence",
      title: t('support.employment.actions.planAbsence.title'),
      description: t('support.employment.actions.planAbsence.description'),
      priority: "medium",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "Partners for Justice",
      description: "A national nonprofit working inside public defender offices to connect clients to employment, housing, health, and other services. Their trained Advocates help clients access job support as part of holistic case representation. Ask your public defender if their office works with PFJ. Operating in 20+ states. (Source: partnersforjustice.org)",
      url: "https://www.partnersforjustice.org/",
      type: "national",
      free: true,
    },
    {
      name: "U.S. Equal Employment Opportunity Commission (EEOC)",
      description: t('support.employment.resources.eeoc.description'),
      url: "https://www.eeoc.gov/",
      phone: "1-800-669-4000",
      type: "national",
      free: true,
    },
    {
      name: "National Employment Law Project (NELP)",
      description: t('support.employment.resources.nelp.description'),
      url: "https://www.nelp.org/",
      type: "national",
      free: true,
    },
    {
      name: "Workplace Fairness",
      description: t('support.employment.resources.workplaceFairness.description'),
      url: "https://www.workplacefairness.org/",
      type: "online",
      free: true,
    },
    {
      name: "Legal Aid at Work",
      description: t('support.employment.resources.legalAidWork.description'),
      url: "https://legalaidatwork.org/",
      phone: "1-415-864-8848",
      type: "national",
      free: true,
    },
    {
      name: "CareerOneStop (U.S. Dept. of Labor)",
      description: t('support.employment.resources.careerOneStop.description'),
      url: "https://www.careeronestop.org/",
      type: "national",
      free: true,
    },
    {
      name: "America's Job Centers",
      description: t('support.employment.resources.jobCenters.description'),
      url: "https://www.careeronestop.org/LocalHelp/AmericanJobCenters/find-american-job-centers.aspx",
      type: "local",
      free: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t('support.employment.faq.q1.question'),
      answer: t('support.employment.faq.q1.answer'),
    },
    {
      question: t('support.employment.faq.q2.question'),
      answer: t('support.employment.faq.q2.answer'),
    },
    {
      question: t('support.employment.faq.q3.question'),
      answer: t('support.employment.faq.q3.answer'),
    },
    {
      question: t('support.employment.faq.q4.question'),
      answer: t('support.employment.faq.q4.answer'),
    },
  ];

  const tips: string[] = [
    t('support.employment.tips.tip1'),
    t('support.employment.tips.tip2'),
    t('support.employment.tips.tip3'),
    t('support.employment.tips.tip4'),
  ];

  return (
    <ResourcePageTemplate
      categoryId="employment"
      icon={Briefcase}
      iconColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
      heroGradient="bg-gradient-to-br from-blue-500/5 via-background to-background"
      overview={t('support.employment.overview')}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      relatedLinks={[
        { label: t('support.relatedLinks.finances'), href: "/support/finances" },
        { label: t('support.relatedLinks.courtLogistics'), href: "/support/court-logistics" },
      ]}
      customSections={<CourtTimeOffSection />}
    />
  );
}
