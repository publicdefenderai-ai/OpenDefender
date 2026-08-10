import { useState, useRef } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  AlertTriangle, CheckCircle, XCircle, Info,
  ChevronDown, FileText, Search, User, Globe, BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";

const SECTION_IDS = [
  { id: "at-the-door",         Icon: AlertTriangle, urgent: true  },
  { id: "what-is-warrant",     Icon: FileText,      urgent: false },
  { id: "search-warrants",     Icon: Search,        urgent: false },
  { id: "arrest-warrants",     Icon: User,          urgent: false },
  { id: "no-warrant-needed",   Icon: XCircle,       urgent: false },
  { id: "ice-warrants",        Icon: Globe,         urgent: false },
  { id: "documented-concerns", Icon: BookOpen,      urgent: false },
  { id: "what-to-do",          Icon: CheckCircle,   urgent: false },
] as const;

const QUICK_LINK_HREFS = [
  "/immigration-guidance/know-your-rights",
  "/immigration-guidance/raids-toolkit",
  "/first-24-hours",
  "/right-to-counsel",
  "/search-seizure",
] as const;

const RELATED_GUIDE_HREFS = [
  "/search-seizure",
  "/right-to-counsel",
  "/rights-info",
  "/immigration-guidance/know-your-rights",
  "/immigration-guidance/raids-toolkit",
  "/first-24-hours",
] as const;

function useStringArray(key: string): string[] {
  const { t } = useTranslation();
  const raw = t(key, { returnObjects: true });
  return Array.isArray(raw) ? raw : [];
}

/* ── Sub-components ────────────────────────────────────────────── */

function AtTheDoorSteps() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const steps = useStringArray("warrants.atTheDoor.steps");

  return (
    <div className="relative" ref={ref}>
      <motion.div
        className="absolute left-[13px] top-[13px] bottom-[13px] w-0.5 bg-amber-200 dark:bg-amber-800 origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: inView ? 1 : 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      <ol className="space-y-4">
        {steps.map((text, i) => (
          <motion.li
            key={i}
            className="flex items-start gap-4"
            initial={{ opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.35, delay: i * 0.12 }}
          >
            <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5 relative z-10">
              {i + 1}
            </span>
            <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

interface ExceptionItem {
  title: string;
  description: string;
  limit: string;
}

function ExceptionCards() {
  const { t } = useTranslation();
  const raw = t("warrants.exceptions.items", { returnObjects: true });
  const items: ExceptionItem[] = Array.isArray(raw) ? raw : [];
  const [visibleCount, setVisibleCount] = useState(1);
  const advance = () => setVisibleCount((c) => Math.min(c + 1, items.length));

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {items.slice(0, visibleCount).map((item, i) => {
          const isActive = i === visibleCount - 1;
          const hasMore = visibleCount < items.length;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38 }}
            >
              <Card
                className={`transition-shadow ${isActive && hasMore ? "cursor-pointer hover:shadow-md ring-1 ring-amber-200 dark:ring-amber-800" : ""}`}
                onClick={isActive && hasMore ? advance : undefined}
              >
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{t("warrants.exceptions.limitLabel")} </span>
                    {item.limit}
                  </p>
                  {isActive && hasMore && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 font-medium">
                      {t("warrants.exceptions.tapNext")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ── SectionPanel ──────────────────────────────────────────────── */

interface SectionPanelProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  urgent?: boolean;
}

function SectionPanel({ id, title, icon, isOpen, onToggle, children, urgent }: SectionPanelProps) {
  const { t } = useTranslation();
  return (
    <div
      id={id}
      className={`rounded-xl border overflow-hidden scroll-mt-20 transition-colors duration-200 ${
        isOpen
          ? urgent
            ? "border-amber-300 dark:border-amber-700"
            : "border-primary/25 dark:border-primary/20"
          : "border-border"
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full text-left flex items-center justify-between px-5 py-4 gap-3 transition-colors ${
          isOpen
            ? urgent
              ? "bg-amber-50 dark:bg-amber-900/15"
              : "bg-primary/5 dark:bg-primary/10"
            : "bg-background hover:bg-muted/30"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            urgent
              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
              : "bg-primary/10 dark:bg-primary/15 text-primary"
          }`}>
            {icon}
          </div>
          <h2 className="text-base font-bold text-foreground leading-snug">{title}</h2>
          {urgent && (
            <span className="hidden sm:inline text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded-full flex-shrink-0">
              {t("warrants.ifNowBadge")}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-6 pt-4 border-t border-border/50 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sidebar ───────────────────────────────────────────────────── */

function PageSidebar({ openIds, onOpen }: { openIds: Set<string>; onOpen: (id: string) => void }) {
  const { t } = useTranslation();
  return (
    <nav aria-label="Page sections">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">
        {t("warrants.sidebar.onThisPage")}
      </p>
      <div className="space-y-0.5">
        {SECTION_IDS.map(({ id, Icon, urgent }) => {
          const active = openIds.has(id);
          return (
            <button
              key={id}
              onClick={() => onOpen(id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors text-sm ${
                active
                  ? urgent
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 font-semibold"
                    : "bg-primary/8 text-primary dark:text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${active && urgent ? "text-amber-600 dark:text-amber-400" : active ? "text-primary" : ""}`} />
              <span className="leading-snug text-xs">{t(`warrants.sections.${toCamel(id)}.shortLabel`)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-border/50">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">
          {t("warrants.sidebar.related")}
        </p>
        <div className="space-y-0.5">
          {QUICK_LINK_HREFS.map((href, i) => (
            <Link key={href} href={href}>
              <span className="block px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors leading-snug">
                {t(`warrants.quickLinks.${QUICK_LINK_KEYS[i]}`)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

const QUICK_LINK_KEYS = ["iceEncounter", "raidsToolkit", "first24Hours", "rightToCounsel", "searchSeizure"] as const;

/** Converts a kebab-case section id (e.g. "at-the-door") to the camelCase key
 *  used in the warrants.sections.* / warrants.<section>.* i18n namespaces. */
function toCamel(id: string): string {
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function Warrants() {
  useScrollToTop();
  const { t } = useTranslation();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["at-the-door"]));

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: Math.max(0, top) });
    }
  };

  const openAndScroll = (id: string) => {
    scrollToSection(id);
    setOpenIds(prev => new Set([...prev, id]));
  };

  const toggleSection = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const breadcrumbItems = [
    { label: t("warrants.breadcrumb.home"), href: "/" },
    { label: t("warrants.breadcrumb.knowYourRights"), href: "/rights-info" },
  ];

  const searchWarrantRequirements = useStringArray("warrants.searchWarrants.requirements");
  const searchWarrantCanDo = useStringArray("warrants.searchWarrants.canDo");
  const searchWarrantCannotDo = useStringArray("warrants.searchWarrants.cannotDo");
  const documentedConcernsItemsRaw = t("warrants.documentedConcerns.items", { returnObjects: true });
  const documentedConcernsItems: { title: string; body: string }[] = Array.isArray(documentedConcernsItemsRaw) ? documentedConcernsItemsRaw : [];
  const atHomeSteps = useStringArray("warrants.whatToDo.atHome.steps");
  const onStreetSteps = useStringArray("warrants.whatToDo.onStreet.steps");
  const arrestWarrantSteps = useStringArray("warrants.whatToDo.arrestWarrant.steps");
  const relatedGuideKeys = ["searchSeizure", "rightToCounsel", "knowYourRights", "iceEncounter", "raidsToolkit", "first24"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb items={breadcrumbItems} currentPage={t("warrants.breadcrumb.current")} />

      {/* Hero */}
      <section className="vivid-header py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            {t("warrants.hero.title")}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            {t("warrants.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Mobile pill nav */}
      <div className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto py-2.5 no-scrollbar">
            {SECTION_IDS.map(({ id, urgent }) => (
              <button
                key={id}
                onClick={() => openAndScroll(id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border flex-shrink-0 transition-colors ${
                  openIds.has(id)
                    ? urgent
                      ? "border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                      : "border-primary/50 bg-primary/10 text-primary"
                    : urgent
                    ? "border-amber-300 bg-amber-50/50 text-amber-700 dark:bg-amber-900/10 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                    : "border-border hover:bg-muted hover:border-foreground/20 text-muted-foreground"
                }`}
              >
                {t(`warrants.sections.${toCamel(id)}.shortLabel`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layout: sidebar + content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="flex gap-10">

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <PageSidebar openIds={openIds} onOpen={openAndScroll} />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-3">

            {/* ── AT THE DOOR ─────────────────────────────────────── */}
            <SectionPanel
              id="at-the-door"
              title={t("warrants.sections.atTheDoor.label")}
              icon={<AlertTriangle className="h-4 w-4" />}
              isOpen={openIds.has("at-the-door")}
              onToggle={() => toggleSection("at-the-door")}
              urgent
            >
              <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <strong>{t("warrants.atTheDoor.alertBold")}</strong> {t("warrants.atTheDoor.alertRest")}
                </AlertDescription>
              </Alert>
              <Card>
                <CardContent className="p-6">
                  <AtTheDoorSteps />
                  <p className="text-xs text-muted-foreground mt-6 pt-4 border-t border-border">
                    {t("warrants.atTheDoor.seeFullGuidePrefix")}{" "}
                    <button
                      onClick={() => openAndScroll("what-to-do")}
                      className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700"
                    >
                      {t("warrants.atTheDoor.seeFullGuideLink")}
                    </button>{" "}
                    {t("warrants.atTheDoor.seeFullGuideSuffix")}
                  </p>
                </CardContent>
              </Card>
            </SectionPanel>

            {/* ── WHAT IS A WARRANT ───────────────────────────────── */}
            <SectionPanel
              id="what-is-warrant"
              title={t("warrants.sections.whatIsWarrant.label")}
              icon={<FileText className="h-4 w-4" />}
              isOpen={openIds.has("what-is-warrant")}
              onToggle={() => toggleSection("what-is-warrant")}
            >
              <Card>
                <CardContent className="p-6 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("warrants.whatIsWarrant.intro1")}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("warrants.whatIsWarrant.intro2")}
                  </p>
                  <div className="overflow-x-auto mt-2">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 font-semibold text-foreground">{t("warrants.whatIsWarrant.table.headerType")}</th>
                          <th className="text-left py-2 pr-4 font-semibold text-foreground">{t("warrants.whatIsWarrant.table.headerWhoSigns")}</th>
                          <th className="text-left py-2 font-semibold text-foreground">{t("warrants.whatIsWarrant.table.headerWhatItAllows")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="py-2.5 pr-4 text-foreground font-medium">{t("warrants.whatIsWarrant.table.searchWarrant.type")}</td>
                          <td className="py-2.5 pr-4 text-muted-foreground">{t("warrants.whatIsWarrant.table.searchWarrant.whoSigns")}</td>
                          <td className="py-2.5 text-muted-foreground">{t("warrants.whatIsWarrant.table.searchWarrant.whatItAllows")}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-4 text-foreground font-medium">{t("warrants.whatIsWarrant.table.arrestWarrant.type")}</td>
                          <td className="py-2.5 pr-4 text-muted-foreground">{t("warrants.whatIsWarrant.table.arrestWarrant.whoSigns")}</td>
                          <td className="py-2.5 text-muted-foreground">{t("warrants.whatIsWarrant.table.arrestWarrant.whatItAllows")}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-4 text-foreground font-medium">{t("warrants.whatIsWarrant.table.iceAdmin.type")}</td>
                          <td className="py-2.5 pr-4 text-muted-foreground">{t("warrants.whatIsWarrant.table.iceAdmin.whoSigns")}</td>
                          <td className="py-2.5 text-muted-foreground">
                            {t("warrants.whatIsWarrant.table.iceAdmin.whatItAllowsPre")} <strong>{t("warrants.whatIsWarrant.table.iceAdmin.whatItAllowsBold")}</strong> {t("warrants.whatIsWarrant.table.iceAdmin.whatItAllowsPost")}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-4 text-foreground font-medium">{t("warrants.whatIsWarrant.table.iceJudicial.type")}</td>
                          <td className="py-2.5 pr-4 text-muted-foreground">{t("warrants.whatIsWarrant.table.iceJudicial.whoSigns")}</td>
                          <td className="py-2.5 text-muted-foreground">{t("warrants.whatIsWarrant.table.iceJudicial.whatItAllows")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </SectionPanel>

            {/* ── SEARCH WARRANTS ─────────────────────────────────── */}
            <SectionPanel
              id="search-warrants"
              title={t("warrants.sections.searchWarrants.label")}
              icon={<Search className="h-4 w-4" />}
              isOpen={openIds.has("search-warrants")}
              onToggle={() => toggleSection("search-warrants")}
            >
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{t("warrants.searchWarrants.requirementsTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    <ul className="space-y-2">
                      {searchWarrantRequirements.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <span className="flex-shrink-0 mt-0.5">–</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-green-700 dark:text-green-400">{t("warrants.searchWarrants.canDoTitle")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1.5">
                      {searchWarrantCanDo.map((item, i) => (
                        <p key={i} className="text-sm text-muted-foreground">– {item}</p>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-red-700 dark:text-red-400">{t("warrants.searchWarrants.cannotDoTitle")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1.5">
                      {searchWarrantCannotDo.map((item, i) => (
                        <p key={i} className="text-sm text-muted-foreground">– {item}</p>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>{t("warrants.searchWarrants.checkingBold")}</strong> {t("warrants.searchWarrants.checkingRest")}
                  </AlertDescription>
                </Alert>
              </div>
            </SectionPanel>

            {/* ── ARREST WARRANTS ─────────────────────────────────── */}
            <SectionPanel
              id="arrest-warrants"
              title={t("warrants.sections.arrestWarrants.label")}
              icon={<User className="h-4 w-4" />}
              isOpen={openIds.has("arrest-warrants")}
              onToggle={() => toggleSection("arrest-warrants")}
            >
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6 space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t("warrants.arrestWarrants.p1Pre")} <strong className="text-foreground">{t("warrants.arrestWarrants.p1Bold")}</strong> {t("warrants.arrestWarrants.p1Post")}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t("warrants.arrestWarrants.p2")}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t("warrants.arrestWarrants.p3")}
                    </p>
                  </CardContent>
                </Card>

                <Alert className="border-slate-200 dark:border-slate-700">
                  <AlertDescription className="text-sm text-muted-foreground">
                    <strong className="text-foreground">{t("warrants.arrestWarrants.relatedBold")}</strong> {t("warrants.arrestWarrants.relatedPre")}{" "}
                    <Link href="/first-24-hours" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">
                      {t("warrants.arrestWarrants.relatedLink1")}
                    </Link>{" "}
                    {t("warrants.arrestWarrants.relatedMid")}{" "}
                    <Link href="/right-to-counsel" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">
                      {t("warrants.arrestWarrants.relatedLink2")}
                    </Link>.
                  </AlertDescription>
                </Alert>
              </div>
            </SectionPanel>

            {/* ── NO WARRANT NEEDED ───────────────────────────────── */}
            <SectionPanel
              id="no-warrant-needed"
              title={t("warrants.sections.noWarrantNeeded.label")}
              icon={<XCircle className="h-4 w-4" />}
              isOpen={openIds.has("no-warrant-needed")}
              onToggle={() => toggleSection("no-warrant-needed")}
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("warrants.noWarrantNeeded.intro")}
              </p>
              <ExceptionCards />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("warrants.noWarrantNeeded.outro")}
              </p>
            </SectionPanel>

            {/* ── ICE WARRANTS ────────────────────────────────────── */}
            <SectionPanel
              id="ice-warrants"
              title={t("warrants.sections.iceWarrants.label")}
              icon={<Globe className="h-4 w-4" />}
              isOpen={openIds.has("ice-warrants")}
              onToggle={() => toggleSection("ice-warrants")}
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("warrants.iceWarrants.intro")}
              </p>

              <Alert className="border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
                  <strong>{t("warrants.iceWarrants.criticalBold")}</strong> {t("warrants.iceWarrants.criticalRest")}
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-5">
                <Card className="border-red-200 dark:border-red-900">
                  <CardHeader className="pb-3">
                    <Badge className="w-fit bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-0 text-xs mb-1">{t("warrants.iceWarrants.adminCard.badge")}</Badge>
                    <CardTitle className="text-sm">{t("warrants.iceWarrants.adminCard.title")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{t("warrants.iceWarrants.adminCard.point1")}</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{t("warrants.iceWarrants.adminCard.point2")}</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{t("warrants.iceWarrants.adminCard.point3")}</span>
                    </div>
                    <div className="mt-3 p-3 bg-muted/50 rounded-md">
                      <p className="text-xs font-medium text-foreground mb-1">{t("warrants.iceWarrants.adminCard.howToIdentifyLabel")}</p>
                      <p className="text-xs text-muted-foreground">{t("warrants.iceWarrants.adminCard.howToIdentifyText")}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-900">
                  <CardHeader className="pb-3">
                    <Badge className="w-fit bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0 text-xs mb-1">{t("warrants.iceWarrants.judicialCard.badge")}</Badge>
                    <CardTitle className="text-sm">{t("warrants.iceWarrants.judicialCard.title")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{t("warrants.iceWarrants.judicialCard.point1")}</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{t("warrants.iceWarrants.judicialCard.point2")}</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{t("warrants.iceWarrants.judicialCard.point3")}</span>
                    </div>
                    <div className="mt-3 p-3 bg-muted/50 rounded-md">
                      <p className="text-xs font-medium text-foreground mb-1">{t("warrants.iceWarrants.judicialCard.howToIdentifyLabel")}</p>
                      <p className="text-xs text-muted-foreground">{t("warrants.iceWarrants.judicialCard.howToIdentifyText")}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-5 space-y-3">
                  <p className="text-sm font-semibold text-foreground">{t("warrants.iceWarrants.rightsApply.title")}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("warrants.iceWarrants.rightsApply.p1")}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("warrants.iceWarrants.rightsApply.p2")}
                  </p>
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("warrants.iceWarrants.resourcesPre")}{" "}
                <Link href="/immigration-guidance/know-your-rights" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">
                  {t("warrants.iceWarrants.resourcesLink1")}
                </Link>{" "}
                {t("warrants.iceWarrants.resourcesMid")}{" "}
                <Link href="/immigration-guidance/raids-toolkit" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">
                  {t("warrants.iceWarrants.resourcesLink2")}
                </Link>.
              </p>
            </SectionPanel>

            {/* ── DOCUMENTED CONCERNS ─────────────────────────────── */}
            <SectionPanel
              id="documented-concerns"
              title={t("warrants.sections.documentedConcerns.label")}
              icon={<BookOpen className="h-4 w-4" />}
              isOpen={openIds.has("documented-concerns")}
              onToggle={() => toggleSection("documented-concerns")}
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("warrants.documentedConcerns.intro")}
              </p>
              <div className="space-y-3">
                {documentedConcernsItems.map((item, i) => (
                  <Card key={i}>
                    <CardContent className="p-5 space-y-2">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                    </CardContent>
                  </Card>
                ))}

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>{t("warrants.documentedConcerns.violatedBold")}</strong> {t("warrants.documentedConcerns.violatedRest")}
                  </AlertDescription>
                </Alert>
              </div>
            </SectionPanel>

            {/* ── TONE DIVIDER ────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
              className="relative flex items-center justify-center py-2"
            >
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative bg-background px-5 py-2 rounded-full border border-border/60 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground tracking-wide">{t("warrants.divider.nowWhat")}</p>
              </div>
            </motion.div>

            {/* ── WHAT TO DO ──────────────────────────────────────── */}
            <SectionPanel
              id="what-to-do"
              title={t("warrants.sections.whatToDo.label")}
              icon={<CheckCircle className="h-4 w-4" />}
              isOpen={openIds.has("what-to-do")}
              onToggle={() => toggleSection("what-to-do")}
            >
              <p className="text-sm text-muted-foreground mb-4">{t("warrants.whatToDo.intro")}</p>
              <div className="space-y-5">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{t("warrants.whatToDo.atHome.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {atHomeSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{t("warrants.whatToDo.onStreet.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {onStreetSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{t("warrants.whatToDo.arrestWarrant.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {arrestWarrantSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                <Alert className="border-slate-200 dark:border-slate-700">
                  <AlertDescription className="text-sm text-muted-foreground">
                    <strong className="text-foreground">{t("warrants.whatToDo.alwaysBold")}</strong> {t("warrants.whatToDo.alwaysRest")}
                  </AlertDescription>
                </Alert>
              </div>
            </SectionPanel>

            {/* ── RELATED GUIDES ──────────────────────────────────── */}
            <div className="border-t border-border pt-8 mt-4">
              <h2 className="text-lg font-semibold mb-3">{t("warrants.relatedGuides.title")}</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {RELATED_GUIDE_HREFS.map((href, i) => (
                  <Link key={href} href={href}>
                    <div className="px-3 py-2.5 rounded-md border border-border/60 hover:border-border hover:bg-muted/30 transition-colors cursor-pointer">
                      <span className="text-sm text-foreground">{t(`warrants.relatedGuides.${relatedGuideKeys[i]}`)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── DISCLAIMER ──────────────────────────────────────── */}
            <Alert className="border-slate-200 dark:border-slate-700">
              <AlertDescription className="text-muted-foreground text-sm">
                {t("warrants.disclaimer")}
              </AlertDescription>
            </Alert>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
