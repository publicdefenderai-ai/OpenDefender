import { useEffect, useState } from "react";
import {
  Home,
  Users,
  Briefcase,
  Building2,
  Heart,
  Calendar,
  Scale,
  DollarSign,
  Copy,
  Check,
  Printer,
  FileText,
  Info,
  ExternalLink,
  CheckSquare,
  Shield,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

/* -- Sidebar section map ------------------------------------------------- */

const TOP_SECTIONS = [
  { id: "overview",            label: "sidebar.overview",         indent: false },
  { id: "what-judges-consider",label: "sidebar.whatJudgesConsider",indent: false },
  { id: "documentation",       label: "sidebar.documentation",    indent: false },
  { id: "templates",           label: "sidebar.templates",        indent: false },
  { id: "release-types",       label: "sidebar.releaseTypes",     indent: false },
  { id: "bail-help",           label: "sidebar.bailHelp",         indent: false },
  { id: "print-checklist",     label: "sidebar.printChecklist",   indent: false },
] as const;

type SectionId = typeof TOP_SECTIONS[number]["id"];

/* -- Sidebar component --------------------------------------------------- */

function PageSidebar({ activeId }: { activeId: SectionId | null }) {
  const { t } = useTranslation();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  };

  return (
    <aside className="hidden lg:block w-52 flex-shrink-0" aria-label="Page navigation">
      <div className="sticky top-6 space-y-0.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">
          {t("bailPrep.sidebar.onThisPage")}
        </p>

        {TOP_SECTIONS.map(({ id, label, indent }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`w-full flex items-center gap-2 text-left rounded-lg transition-all duration-150 ${
                indent ? "pl-6 pr-2 py-1.5" : "px-2 py-2"
              } ${
                isActive
                  ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {isActive && !indent && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
              )}
              <span className="truncate text-xs leading-snug">{t(`bailPrep.${label}`)}</span>
            </button>
          );
        })}

        {/* Quick links */}
        <div className="pt-3 mt-3 border-t border-border/60">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">
            {t("bailPrep.sidebar.quickLinks")}
          </p>
          <Link href="/first-24-hours">
            <span className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              {t("bailPrep.sidebar.first24Hours")}
            </span>
          </Link>
          <Link href="/support/court-logistics">
            <span className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Scale className="w-3.5 h-3.5 flex-shrink-0" />
              {t("bailPrep.sidebar.courtLogistics")}
            </span>
          </Link>
          <Link href="/friends-family">
            <span className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Heart className="w-3.5 h-3.5 flex-shrink-0" />
              {t("bailPrep.sidebar.friendsFamily")}
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

/* -- TemplateCard component ----------------------------------------------- */

function TemplateCard({
  label,
  body,
  printNoteKey,
}: {
  label: string;
  body: string;
  printNoteKey: string;
}) {
  const { t } = useTranslation();
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
              h1 { font-size: 18px; color: #333; border-bottom: 2px solid #d97706; padding-bottom: 8px; }
              .body { white-space: pre-wrap; }
              .note { font-size: 12px; color: #666; margin-top: 24px; padding-top: 12px; border-top: 1px solid #ddd; font-style: italic; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>
            <h1>${label}</h1>
            <div class="body">${body.replace(/\n/g, "<br>")}</div>
            <p class="note">${t(printNoteKey)}</p>
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
                ? t("bailPrep.templates.copied")
                : t("bailPrep.templates.copyButton")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              {t("bailPrep.templates.printButton")}
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

/* -- Checklist item component -------------------------------------------- */

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex gap-3 items-start py-1.5">
      <span className="mt-0.5 flex-shrink-0 w-4 h-4 border border-amber-400 rounded-sm print:border-gray-400" />
      <span className="text-sm text-foreground leading-snug">{text}</span>
    </li>
  );
}

/* -- Page ----------------------------------------------------------------- */

export default function BailPreparation() {
  useScrollToTop();
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<SectionId | null>("overview");

  const handlePrintChecklist = () => {
    const subsections = [
      { key: "employment",     label: t("bailPrep.documentation.employment.title") },
      { key: "housing",        label: t("bailPrep.documentation.housing.title") },
      { key: "communityTies",  label: t("bailPrep.documentation.communityTies.title") },
      { key: "supportNetwork", label: t("bailPrep.documentation.supportNetwork.title") },
    ];

    const sectionsHtml = subsections.map(({ key, label }) => {
      const items = t(`bailPrep.documentation.${key}.items`, { returnObjects: true }) as string[];
      const itemsHtml = items.map(item =>
        `<li style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;">
           <span style="flex-shrink:0;width:14px;height:14px;border:1px solid #666;border-radius:3px;margin-top:2px;"></span>
           <span style="font-size:13px;line-height:1.5;">${item}</span>
         </li>`
      ).join('');
      return `<div style="margin-bottom:24px;">
        <h3 style="font-size:15px;font-weight:600;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #ddd;">${label}</h3>
        <ul style="list-style:none;padding:0;margin:0;">${itemsHtml}</ul>
      </div>`;
    }).join('');

    const disclaimer = t("bailPrep.printChecklist.disclaimer");
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Bail Preparation Checklist</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; max-width: 680px; margin: 0 auto; color: #111; }
    h1 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
    .subtitle { font-size: 13px; color: #555; margin-bottom: 28px; }
    .footer { font-size: 11px; color: #777; font-style: italic; margin-top: 28px; border-top: 1px solid #ddd; padding-top: 10px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>Bail Preparation Checklist</h1>
  <p class="subtitle">opendefender.ai/support/court-logistics/bail-preparation</p>
  ${sectionsHtml}
  <p class="footer">${disclaimer}</p>
</body>
</html>`);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    const handleScroll = () => {
      const ids = TOP_SECTIONS.map((s) => s.id);
      let current: SectionId | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          current = id as SectionId;
        }
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  };

  const breadcrumbItems = [
    { label: t("breadcrumb.home", "Home"), href: "/" },
    { label: t("breadcrumb.courtLogistics", "Court Logistics"), href: "/support/court-logistics" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb
        items={breadcrumbItems}
        currentPage={t("bailPrep.breadcrumb")}
      />

      {/* Hero */}
      <section className="vivid-header-alt py-14 md:py-18">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <Badge className="mb-4 bg-amber-500/20 text-amber-200 border-amber-400/30 text-xs">
            {t("bailPrep.heroTagline")}
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-5 text-white">
            {t("bailPrep.heroTitle")}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t("bailPrep.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Mobile pill nav */}
      <div className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto py-2.5 no-scrollbar">
            {TOP_SECTIONS.filter((s) => !s.indent).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border flex-shrink-0 transition-colors ${
                  activeId === id
                    ? "border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                    : "border-border hover:bg-muted hover:border-foreground/20 text-muted-foreground"
                }`}
              >
                {t(`bailPrep.${label}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layout: sidebar + content */}
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="flex gap-12 items-start">

          {/* Sidebar */}
          <PageSidebar activeId={activeId} />

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* -- OVERVIEW ------------------------------------------------ */}
            <ScrollReveal>
              <section id="overview" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-amber-600" />
                  {t("bailPrep.overview.title")}
                </h2>
                <div className="space-y-3">
                  <Card>
                    <CardContent className="pt-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t("bailPrep.overview.body1")}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t("bailPrep.overview.body2")}
                      </p>
                    </CardContent>
                  </Card>
                  <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
                    <Scale className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                      {t("bailPrep.overview.attorneyNote")}
                    </AlertDescription>
                  </Alert>
                </div>
              </section>
            </ScrollReveal>

            {/* -- WHAT JUDGES CONSIDER ------------------------------------ */}
            <ScrollReveal>
              <section id="what-judges-consider" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-amber-600" />
                  {t("bailPrep.whatJudgesConsider.title")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      { key: "communityTies", icon: Home },
                      { key: "employment",    icon: Briefcase },
                      { key: "housing",       icon: Building2 },
                      { key: "supportNetwork",icon: Users },
                      { key: "courtAppearances", icon: Calendar },
                      { key: "chargesNature", icon: FileText },
                    ] as const
                  ).map(({ key, icon: Icon }) => (
                    <Card key={key} className="border-border hover:border-amber-200 dark:hover:border-amber-800 transition-colors">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex gap-3 items-start">
                          <Icon className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {t(`bailPrep.whatJudgesConsider.factors.${key}.title`)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                              {t(`bailPrep.whatJudgesConsider.factors.${key}.body`)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            {/* -- DOCUMENTATION ------------------------------------------ */}
            <ScrollReveal>
              <section id="documentation" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-amber-600" />
                  {t("bailPrep.documentation.title")}
                </h2>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  {t("bailPrep.documentation.intro")}
                </p>

                <div className="space-y-5">
                  {(
                    [
                      { subsection: "employment",     icon: Briefcase },
                      { subsection: "housing",        icon: Building2 },
                      { subsection: "communityTies",  icon: Home },
                      { subsection: "supportNetwork", icon: Users },
                    ] as const
                  ).map(({ subsection, icon: Icon }) => (
                    <Card key={subsection}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Icon className="h-4 w-4 text-amber-600" />
                          {t(`bailPrep.documentation.${subsection}.title`)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-0.5">
                          {(
                            t(`bailPrep.documentation.${subsection}.items`, {
                              returnObjects: true,
                            }) as string[]
                          ).map((item, i) => (
                            <CheckItem key={i} text={item} />
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            {/* -- TEMPLATES ---------------------------------------------- */}
            <ScrollReveal>
              <section id="templates" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-600" />
                  {t("bailPrep.templates.title")}
                </h2>
                <Alert className="mb-5 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                    {t("bailPrep.templates.personalizeNote")}
                  </AlertDescription>
                </Alert>
                <div className="space-y-4">
                  {(["employer", "character", "family"] as const).map((key) => (
                    <TemplateCard
                      key={key}
                      label={t(`bailPrep.templates.${key}.label`)}
                      body={t(`bailPrep.templates.${key}.body`)}
                      printNoteKey="bailPrep.templates.printNote"
                    />
                  ))}
                </div>
              </section>
            </ScrollReveal>

            {/* -- RELEASE TYPES ------------------------------------------ */}
            <ScrollReveal>
              <section id="release-types" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-600" />
                  {t("bailPrep.releaseTypes.title")}
                </h2>
                <div className="space-y-3">
                  {(["ror", "unsecured", "cash", "bond", "conditional"] as const).map((key) => (
                    <Card key={key} className="border-border">
                      <CardContent className="pt-4 pb-4">
                        <p className="text-sm font-semibold text-foreground">
                          {t(`bailPrep.releaseTypes.types.${key}.title`)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {t(`bailPrep.releaseTypes.types.${key}.body`)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            {/* -- BAIL HELP ---------------------------------------------- */}
            <ScrollReveal>
              <section id="bail-help" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                  {t("bailPrep.bailHelp.title")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      { key: "bailProject", url: "https://bailproject.org" },
                      { key: "nationalBailFund", url: "https://www.communityjusticeexchange.org/en/nbfn-directory" },
                      { key: "legalAid", url: "/legal-aid" },
                      { key: "publicDefender", url: null },
                    ] as const
                  ).map(({ key, url }) => (
                    <Card key={key} className="border-border hover:border-amber-200 dark:hover:border-amber-800 transition-colors">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground">
                              {t(`bailPrep.bailHelp.resources.${key}.name`)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                              {t(`bailPrep.bailHelp.resources.${key}.description`)}
                            </p>
                          </div>
                          {url && (
                            url.startsWith("/") ? (
                              <Link href={url}>
                                <span className="flex-shrink-0 text-amber-600 hover:text-amber-700">
                                  <ExternalLink className="h-4 w-4" />
                                </span>
                              </Link>
                            ) : (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 text-amber-600 hover:text-amber-700"
                                aria-label={t(`bailPrep.bailHelp.resources.${key}.name`)}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            {/* -- PRINT CHECKLIST ---------------------------------------- */}
            <ScrollReveal>
              <section id="print-checklist" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Printer className="h-5 w-5 text-amber-600" />
                  {t("bailPrep.printChecklist.title")}
                </h2>

                {/* Screen intro (hidden on print) */}
                <div className="print:hidden mb-4">
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {t("bailPrep.printChecklist.intro")}
                  </p>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handlePrintChecklist}
                  >
                    <Printer className="h-4 w-4" />
                    {t("bailPrep.printChecklist.button")}
                  </Button>
                </div>

                {/* Printable checklist */}
                <div className="mt-5 space-y-5">
                  {(
                    [
                      { subsection: "employment",     icon: Briefcase },
                      { subsection: "housing",        icon: Building2 },
                      { subsection: "communityTies",  icon: Home },
                      { subsection: "supportNetwork", icon: Users },
                    ] as const
                  ).map(({ subsection, icon: Icon }) => (
                    <Card key={subsection} className="print:shadow-none print:border-gray-300">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Icon className="h-4 w-4 text-amber-600 print:text-gray-600" />
                          {t(`bailPrep.documentation.${subsection}.title`)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-0.5">
                          {(
                            t(`bailPrep.documentation.${subsection}.items`, {
                              returnObjects: true,
                            }) as string[]
                          ).map((item, i) => (
                            <CheckItem key={i} text={item} />
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mt-4 italic">
                  {t("bailPrep.printChecklist.disclaimer")}
                </p>
              </section>
            </ScrollReveal>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
