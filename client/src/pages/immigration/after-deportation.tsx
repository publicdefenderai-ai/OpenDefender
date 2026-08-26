import { useEffect, useState } from "react";
import {
  Home,
  Clock,
  FileText,
  DollarSign,
  Users,
  Phone,
  BookOpen,
  HelpCircle,
  Building2,
  Scale,
  ExternalLink,
  ChevronDown,
  Info,
  AlertCircle,
  HeartHandshake,
  Landmark,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { ImmigrationDetailLayout } from "@/components/immigration/immigration-detail-layout";

/* ── Sidebar section map ───────────────────────────────────────── */

const TOP_SECTIONS = [
  { id: "overview",     label: "sidebar.overview",    indent: false },
  { id: "if-deported",  label: "sidebar.ifDeported",  indent: false },
  { id: "first-72",     label: "sidebar.first72",     indent: true  },
  { id: "grew-up-in-us",label: "sidebar.grewUpInUs",  indent: true  },
  { id: "documents",    label: "sidebar.documents",   indent: true  },
  { id: "money",        label: "sidebar.money",       indent: true  },
  { id: "family-in-us", label: "sidebar.familyInUs",  indent: false },
  { id: "contact",      label: "sidebar.contact",     indent: true  },
  { id: "financial",    label: "sidebar.financial",   indent: true  },
  { id: "children",     label: "sidebar.children",    indent: true  },
  { id: "legal-next",   label: "sidebar.legalNext",   indent: true  },
  { id: "organizations",label: "sidebar.organizations",indent: false },
  { id: "faq",          label: "sidebar.faq",         indent: false },
] as const;

type SectionId = typeof TOP_SECTIONS[number]["id"];

/* ── Sidebar component ─────────────────────────────────────────── */

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
    <aside className="hidden lg:block w-56 flex-shrink-0" aria-label="Page navigation">
      <div className="sticky top-6 space-y-0.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">
          {t("afterDeportation.sidebar.onThisPage")}
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
              <span className="truncate text-xs leading-snug">{t(`afterDeportation.${label}`)}</span>
            </button>
          );
        })}

        {/* Quick links */}
        <div className="pt-3 mt-3 border-t border-border/60">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">
            {t("afterDeportation.sidebar.quickLinks")}
          </p>
          <Link href="/immigration-guidance">
            <span className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
              {t("afterDeportation.sidebar.immigrationGuidance")}
            </span>
          </Link>
          <Link href="/support">
            <span className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <HeartHandshake className="w-3.5 h-3.5 flex-shrink-0" />
              {t("afterDeportation.sidebar.lifeFamily")}
            </span>
          </Link>
          <Link href="/legal-aid">
            <span className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Scale className="w-3.5 h-3.5 flex-shrink-0" />
              {t("afterDeportation.sidebar.findLawyer")}
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

/* ── Organizations data ────────────────────────────────────────── */

const ORGS = [
  { key: "alOtroLado", url: "https://alotrolado.org" },
  { key: "raices",     url: "https://raicestexas.org" },
  { key: "nilc",       url: "https://nilc.org" },
  { key: "clinic",     url: "https://cliniclegal.org" },
  { key: "ian",        url: "https://immigrationadvocates.org" },
  { key: "twoEleven",  url: "https://211.org" },
  { key: "nlihc",      url: "https://nlihc.org" },
  { key: "vera",       url: "https://vera.org" },
] as const;

/* ── Page ──────────────────────────────────────────────────────── */

export default function AfterDeportation() {
  useScrollToTop();
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<SectionId | null>("overview");

  // Scroll listener: pick the last section whose top <= 120px
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

  const breadcrumbItems = [
    { label: t("breadcrumb.home", "Home"), href: "/" },
    { label: t("breadcrumb.immigrationGuidance", "Immigration Guidance"), href: "/immigration-guidance" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  };

  return (
    <ImmigrationDetailLayout
      title={t("afterDeportation.heroTitle")}
      subtitle={t("afterDeportation.heroSubtitle")}
      breadcrumbItems={breadcrumbItems}
      icon={<Users className="h-7 w-7" />}
      eyebrow={
        <Badge variant="outline" className="mb-3 text-xs font-medium text-muted-foreground">
          {t("afterDeportation.heroTagline")}
        </Badge>
      }
    >

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
                {t(`afterDeportation.${label}`)}
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

            {/* ── OVERVIEW ─────────────────────────────────────── */}
            <ScrollReveal>
              <section id="overview" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {t("afterDeportation.overview.title")}
                </h2>
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex gap-3">
                      <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t("afterDeportation.overview.body")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </ScrollReveal>

            {/* ── IF YOU WERE DEPORTED ─────────────────────────── */}
            <section id="if-deported" className="scroll-mt-24">
              <ScrollReveal>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Home className="h-5 w-5 text-amber-600" />
                  {t("afterDeportation.ifDeported.sectionTitle")}
                </h2>
              </ScrollReveal>

              {/* First 72 hours */}
              <ScrollReveal>
                <div id="first-72" className="scroll-mt-24 mb-6">
                  <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    {t("afterDeportation.ifDeported.first72.title")}
                  </h3>
                  <div className="space-y-3">
                    {(["step1", "step2", "step3", "step4"] as const).map((step, i) => (
                      <Card key={step} className="border-amber-100 dark:border-amber-900/30">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex gap-3">
                            <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {t(`afterDeportation.ifDeported.first72.${step}Title`)}
                              </p>
                              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                                {t(`afterDeportation.ifDeported.first72.${step}Body`)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Grew up in US */}
              <ScrollReveal>
                <div id="grew-up-in-us" className="scroll-mt-24 mb-6">
                  <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-amber-600" />
                    {t("afterDeportation.ifDeported.grewUpInUs.title")}
                  </h3>
                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                      {t("afterDeportation.ifDeported.grewUpInUs.body")}
                    </AlertDescription>
                  </Alert>
                </div>
              </ScrollReveal>

              {/* Documents */}
              <ScrollReveal>
                <div id="documents" className="scroll-mt-24 mb-6">
                  <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-600" />
                    {t("afterDeportation.ifDeported.documents.title")}
                  </h3>
                  <Card>
                    <CardContent className="pt-4 pb-4">
                      <ul className="space-y-3">
                        {(["item1", "item2", "item3"] as const).map((item) => (
                          <li key={item} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                            <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                            {t(`afterDeportation.ifDeported.documents.${item}`)}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs text-muted-foreground italic border-t border-border/50 pt-3">
                        {t("afterDeportation.ifDeported.documents.note")}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              {/* Receiving money */}
              <ScrollReveal>
                <div id="money" className="scroll-mt-24">
                  <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-amber-600" />
                    {t("afterDeportation.ifDeported.money.title")}
                  </h3>
                  <Card>
                    <CardContent className="pt-4 pb-4">
                      <ul className="space-y-3">
                        {(["item1", "item2", "item3", "item4"] as const).map((item) => (
                          <li key={item} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                            <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                            {t(`afterDeportation.ifDeported.money.${item}`)}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>
            </section>

            {/* ── FAMILY IN THE US ─────────────────────────────── */}
            <section id="family-in-us" className="scroll-mt-24">
              <ScrollReveal>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-slate-600" />
                  {t("afterDeportation.familyInUs.sectionTitle")}
                </h2>
              </ScrollReveal>

              {/* Contact */}
              <ScrollReveal>
                <div id="contact" className="scroll-mt-24 mb-6">
                  <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-600" />
                    {t("afterDeportation.familyInUs.contact.title")}
                  </h3>
                  <Card>
                    <CardContent className="pt-4 pb-4">
                      <ul className="space-y-3">
                        {(["item1", "item2", "item3", "item4"] as const).map((item) => (
                          <li key={item} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                            <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
                            {t(`afterDeportation.familyInUs.contact.${item}`)}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              {/* Financial */}
              <ScrollReveal>
                <div id="financial" className="scroll-mt-24 mb-6">
                  <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-600" />
                    {t("afterDeportation.familyInUs.financial.title")}
                  </h3>
                  <Card>
                    <CardContent className="pt-4 pb-4">
                      <ul className="space-y-3">
                        {(["item1", "item2", "item3", "item4"] as const).map((item) => (
                          <li key={item} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                            <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
                            {t(`afterDeportation.familyInUs.financial.${item}`)}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              {/* Children */}
              <ScrollReveal>
                <div id="children" className="scroll-mt-24 mb-6">
                  <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <HeartHandshake className="h-4 w-4 text-slate-600" />
                    {t("afterDeportation.familyInUs.children.title")}
                  </h3>
                  <Card>
                    <CardContent className="pt-4 pb-4">
                      <ul className="space-y-3">
                        {(["item1", "item2", "item3", "item4"] as const).map((item) => (
                          <li key={item} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                            <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
                            {t(`afterDeportation.familyInUs.children.${item}`)}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              {/* Legal next steps */}
              <ScrollReveal>
                <div id="legal-next" className="scroll-mt-24">
                  <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Scale className="h-4 w-4 text-slate-600" />
                    {t("afterDeportation.familyInUs.legalNext.title")}
                  </h3>
                  <Alert className="border-slate-200 bg-slate-50 dark:bg-slate-900/30 dark:border-slate-700">
                    <Info className="h-4 w-4 text-slate-600" />
                    <AlertDescription className="text-slate-700 dark:text-slate-300">
                      <ul className="space-y-2 mt-1">
                        {(["item1", "item2", "item3"] as const).map((item) => (
                          <li key={item} className="flex gap-2 text-sm leading-relaxed">
                            <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
                            {t(`afterDeportation.familyInUs.legalNext.${item}`)}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </ScrollReveal>
            </section>

            {/* ── ORGANIZATIONS ────────────────────────────────── */}
            <ScrollReveal>
              <section id="organizations" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-amber-600" />
                  {t("afterDeportation.organizations.title")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ORGS.map(({ key, url }) => (
                    <Card key={key} className="border-border hover:border-amber-200 dark:hover:border-amber-800 transition-colors">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground">
                              {t(`afterDeportation.organizations.${key}.name`)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                              {t(`afterDeportation.organizations.${key}.description`)}
                            </p>
                          </div>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-amber-600 hover:text-amber-700"
                            aria-label={`Visit ${t(`afterDeportation.organizations.${key}.name`)}`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  {t("afterDeportation.organizations.note")}
                </p>
              </section>
            </ScrollReveal>

            {/* ── FAQ ──────────────────────────────────────────── */}
            <ScrollReveal>
              <section id="faq" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-amber-600" />
                  {t("afterDeportation.faq.title")}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {(["q1","q2","q3","q4","q5","q6","q7"] as const).map((q) => (
                    <AccordionItem
                      key={q}
                      value={q}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="px-4 py-3 text-sm font-semibold text-foreground text-left hover:bg-muted/30 hover:no-underline">
                        {t(`afterDeportation.faq.${q}.question`)}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed">
                        {t(`afterDeportation.faq.${q}.answer`)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            </ScrollReveal>

          </div>
        </div>
      </div>

    </ImmigrationDetailLayout>
  );
}
