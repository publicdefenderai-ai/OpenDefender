import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, CheckCircle, CheckCircle2, Calendar, ExternalLink,
  Info, ChevronDown, Zap, HeartHandshake, Scale, Globe,
  HelpCircle, Lightbulb, ArrowLeft, Phone, AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import {
  getCourtFeesForState, courtFeesByState,
  ALL_STATE_CODES, NATIONAL_ASSISTANCE_ORGS,
} from "@shared/court-fees-data";

/* ── Section map ───────────────────────────────────────────────── */

const SECTIONS = [
  { id: "quick-actions", shortLabel: "Quick Actions",  Icon: Zap           },
  { id: "benefits",      shortLabel: "Benefits",       Icon: HeartHandshake },
  { id: "court-fees",    shortLabel: "Court Fees",     Icon: Scale          },
  { id: "resources",     shortLabel: "Resources",      Icon: Globe          },
  { id: "faqs",          shortLabel: "FAQs & Tips",    Icon: HelpCircle     },
];

const RELATED_LINKS = [
  { href: "/support/employment",  label: "Employment Support"     },
  { href: "/resources",           label: "Find a Public Defender" },
  { href: "/support",             label: "All Life Support Topics" },
];

const BENEFIT_IDS = ["snap", "medicaid", "tanf", "socialSecurity", "banking"] as const;
const FEE_TYPE_IDS = ["filing", "probation", "publicDefender", "restitution", "labFees", "surcharges"] as const;

const PRIORITY_LABELS: Record<string, string> = {
  high:   "Do first",
  medium: "Important",
  low:    "When ready",
};
const PRIORITY_COLORS: Record<string, string> = {
  high:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  low:    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

/* ── SectionPanel ──────────────────────────────────────────────── */

function SectionPanel({
  id, title, icon, isOpen, onToggle, children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className={`rounded-xl border overflow-hidden scroll-mt-20 transition-colors duration-200 ${
        isOpen ? "border-emerald-300/60 dark:border-emerald-700/40" : "border-border"
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full text-left flex items-center justify-between px-5 py-4 gap-3 transition-colors ${
          isOpen ? "bg-emerald-50/60 dark:bg-emerald-900/15" : "bg-background hover:bg-muted/30"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isOpen
              ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
              : "bg-muted text-muted-foreground"
          }`}>
            {icon}
          </div>
          <h2 className="text-base font-bold text-foreground leading-snug">{title}</h2>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
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

function PageSidebar({
  openIds, onOpen,
}: {
  openIds: Set<string>;
  onOpen: (id: string) => void;
}) {
  return (
    <nav aria-label="Page sections">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">
        On this page
      </p>
      <div className="space-y-0.5">
        {SECTIONS.map(({ id, shortLabel, Icon }) => {
          const active = openIds.has(id);
          return (
            <button
              key={id}
              onClick={() => onOpen(id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                active
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 font-semibold"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${
                active ? "text-emerald-600 dark:text-emerald-400" : ""
              }`} />
              <span className="leading-snug text-xs">{shortLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-border/50">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">
          Related
        </p>
        <div className="space-y-0.5">
          {RELATED_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>
              <span className="block px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors leading-snug">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function FinancesSupport() {
  useScrollToTop();
  const { t } = useTranslation();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["quick-actions"]));
  const [selectedState, setSelectedState] = useState("");

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

  const feeData = selectedState ? getCourtFeesForState(selectedState) : null;

  const actionItems = [
    { id: "assess-costs",  priority: "high",   timeframe: t('support.finances.actions.assessCosts.timeframe'),  title: t('support.finances.actions.assessCosts.title'),  description: t('support.finances.actions.assessCosts.description') },
    { id: "explore-pd",    priority: "high",   timeframe: t('support.finances.actions.explorePD.timeframe'),    title: t('support.finances.actions.explorePD.title'),    description: t('support.finances.actions.explorePD.description') },
    { id: "fee-waiver",    priority: "medium", timeframe: undefined,                                            title: t('support.finances.actions.feeWaiver.title'),    description: t('support.finances.actions.feeWaiver.description') },
    { id: "payment-plan",  priority: "medium", timeframe: undefined,                                            title: t('support.finances.actions.paymentPlan.title'),  description: t('support.finances.actions.paymentPlan.description') },
    { id: "emergency-aid", priority: "medium", timeframe: undefined,                                            title: t('support.finances.actions.emergencyAid.title'), description: t('support.finances.actions.emergencyAid.description') },
    { id: "income-loss",   priority: "low",    timeframe: undefined,                                            title: t('support.finances.actions.incomeLoss.title'),   description: t('support.finances.actions.incomeLoss.description') },
  ];

  const externalResources = [
    { name: "FindLaw Free Legal Aid Directory",              description: t('support.finances.resources.findLaw.description'),   url: "https://www.findlaw.com/",          phone: undefined, type: "national", free: true  },
    { name: "LawHelp.org",                                   description: t('support.finances.resources.lawHelp.description'),   url: "https://www.lawhelp.org/",          phone: undefined, type: "national", free: true  },
    { name: "Benefits.gov",                                  description: t('support.finances.resources.benefits.description'),  url: "https://www.benefits.gov/",         phone: undefined, type: "national", free: true  },
    { name: "211 United Way",                                description: t('support.finances.resources.unitedWay.description'), url: "https://www.211.org/",              phone: "211",     type: "local",    free: true  },
    { name: "Modest Means Program (State Bar)",              description: t('support.finances.resources.modestMeans.description'), url: "https://www.americanbar.org/groups/probono_public_service/resources/directory_of_law_school_public_interest_pro_bono_programs/", phone: undefined, type: "state", free: false },
    { name: "Consumer Financial Protection Bureau (CFPB)",  description: t('support.finances.resources.cfpb.description'),      url: "https://www.consumerfinance.gov/",  phone: undefined, type: "national", free: true  },
  ];

  const faqs = [
    { question: t('support.finances.faq.q1.question'), answer: t('support.finances.faq.q1.answer') },
    { question: t('support.finances.faq.q2.question'), answer: t('support.finances.faq.q2.answer') },
    { question: t('support.finances.faq.q3.question'), answer: t('support.finances.faq.q3.answer') },
    { question: t('support.finances.faq.q4.question'), answer: t('support.finances.faq.q4.answer') },
  ];

  const tips = [
    t('support.finances.tips.tip1'),
    t('support.finances.tips.tip2'),
    t('support.finances.tips.tip3'),
    t('support.finances.tips.tip4'),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="vivid-header py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 mb-5">
            <DollarSign className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Financial Support After Arrest
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t('support.finances.overview')}
          </p>
        </div>
      </section>

      {/* Back link */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Link href="/support">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Life Support
          </span>
        </Link>
      </div>

      {/* Mobile pill nav */}
      <div className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border shadow-sm mt-4">
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto py-2.5 no-scrollbar">
            {SECTIONS.map(({ id, shortLabel }) => (
              <button
                key={id}
                onClick={() => openAndScroll(id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border flex-shrink-0 transition-colors ${
                  openIds.has(id)
                    ? "border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : "border-border hover:bg-muted hover:border-foreground/20 text-muted-foreground"
                }`}
              >
                {shortLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layout: sidebar + content */}
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="flex gap-10">

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <PageSidebar openIds={openIds} onOpen={openAndScroll} />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-3">

            {/* ── QUICK ACTIONS ─────────────────────────────────── */}
            <SectionPanel
              id="quick-actions"
              title="Quick Actions"
              icon={<Zap className="h-4 w-4" />}
              isOpen={openIds.has("quick-actions")}
              onToggle={() => toggleSection("quick-actions")}
            >
              <div className="space-y-3">
                {actionItems.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border bg-muted/20 p-4">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.timeframe && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{item.timeframe}</span>
                        )}
                        <Badge className={`text-xs border-0 ${PRIORITY_COLORS[item.priority]}`}>
                          {PRIORITY_LABELS[item.priority]}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </SectionPanel>

            {/* ── BENEFITS ──────────────────────────────────────── */}
            <SectionPanel
              id="benefits"
              title={t('support.finances.benefits.sectionTitle')}
              icon={<HeartHandshake className="h-4 w-4" />}
              isOpen={openIds.has("benefits")}
              onToggle={() => toggleSection("benefits")}
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('support.finances.benefits.sectionSubtitle')}
              </p>
              <div className="space-y-3">
                {BENEFIT_IDS.map((id) => (
                  <div key={id} className="rounded-lg border border-border bg-background p-4">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      {t(`support.finances.benefits.${id}.name`)}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                      {t(`support.finances.benefits.${id}.what`)}
                    </p>
                    <div className="flex items-start gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-md p-2.5">
                      <Info className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t(`support.finances.benefits.${id}.action`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionPanel>

            {/* ── COURT FEES ────────────────────────────────────── */}
            <SectionPanel
              id="court-fees"
              title={t('support.finances.courtFees.sectionTitle')}
              icon={<Scale className="h-4 w-4" />}
              isOpen={openIds.has("court-fees")}
              onToggle={() => toggleSection("court-fees")}
            >
              {/* Fee types accordion */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Types of Court Fees
                </p>
                <Accordion type="single" collapsible>
                  {FEE_TYPE_IDS.map(id => (
                    <AccordionItem key={id} value={id}>
                      <AccordionTrigger>{t(`support.finances.courtFees.types.${id}.title`)}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          {t(`support.finances.courtFees.types.${id}.description`)}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1 italic">
                          {t(`support.finances.courtFees.types.${id}.note`)}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* State selector */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t('support.finances.courtFees.stateSelector.label')}
                </label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-full md:w-72">
                    <SelectValue placeholder={t('support.finances.courtFees.stateSelector.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_STATE_CODES.map(code => (
                      <SelectItem key={code} value={code}>{courtFeesByState[code].stateName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {feeData && (
                  <Card className="mt-4 border-emerald-200 dark:border-emerald-800">
                    <CardContent className="p-5">
                      <h4 className="font-semibold mb-3">{feeData.stateName} — Typical Court Costs</h4>
                      <div className="divide-y divide-border text-sm mb-4">
                        {([
                          ["Court filing fee",           feeData.filingFee],
                          ["Probation supervision",      feeData.probationFee],
                          ["Public defender fee",        feeData.publicDefenderFee],
                          ["Fines",                      feeData.fineRange],
                          ["Surcharges / assessments",   feeData.surcharges],
                        ] as [string, string][]).map(([label, value]) => (
                          <div key={label} className="flex justify-between py-2">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-medium text-right ml-4">{value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-sm mb-4">
                        <p className="font-medium mb-1">Fee Waiver in {feeData.stateName}</p>
                        <p className="text-muted-foreground">
                          Form: <strong>{feeData.waiverForm}</strong> · Threshold: {feeData.waiverIncome}
                        </p>
                      </div>
                      {feeData.assistanceOrgs.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {feeData.stateName} Assistance Programs
                          </p>
                          {feeData.assistanceOrgs.map(org => (
                            <a key={org.name} href={org.url} target="_blank" rel="noopener noreferrer"
                               className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-400 hover:underline">
                              <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <span><strong>{org.name}</strong> — {org.description}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {t('support.finances.courtFees.stateSelector.disclaimer')}
                </p>
              </div>

              {/* Fee waivers + payment plans */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-5">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      {t('support.finances.courtFees.waiver.title')}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t('support.finances.courtFees.waiver.description')}
                    </p>
                    <ol className="space-y-1.5">
                      {(t('support.finances.courtFees.waiver.steps', { returnObjects: true }) as string[])
                        .map((step, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="text-muted-foreground font-medium">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      {t('support.finances.courtFees.paymentPlan.title')}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t('support.finances.courtFees.paymentPlan.description')}
                    </p>
                    <ul className="space-y-1.5">
                      {(t('support.finances.courtFees.paymentPlan.tips', { returnObjects: true }) as string[])
                        .map((tip, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* National assistance orgs */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  National Resources
                </p>
                <div className="space-y-2">
                  {NATIONAL_ASSISTANCE_ORGS.map(org => (
                    <a key={org.name} href={org.url} target="_blank" rel="noopener noreferrer"
                       className="flex items-start gap-2 text-sm hover:underline">
                      <ExternalLink className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                      <span><strong>{org.name}</strong> — {org.description}</span>
                    </a>
                  ))}
                </div>
              </div>
            </SectionPanel>

            {/* ── RESOURCES ─────────────────────────────────────── */}
            <SectionPanel
              id="resources"
              title="Resources & Organizations"
              icon={<Globe className="h-4 w-4" />}
              isOpen={openIds.has("resources")}
              onToggle={() => toggleSection("resources")}
            >
              <div className="space-y-3">
                {externalResources.map((resource) => (
                  <a
                    key={resource.name}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-border hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm bg-background p-4 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-sm font-semibold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            {resource.name}
                          </p>
                          {resource.free && (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-xs">
                              Free
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs capitalize">{resource.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{resource.description}</p>
                        {resource.phone && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {resource.phone}
                          </p>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            </SectionPanel>

            {/* ── FAQS & TIPS ───────────────────────────────────── */}
            <SectionPanel
              id="faqs"
              title="FAQs & Tips"
              icon={<HelpCircle className="h-4 w-4" />}
              isOpen={openIds.has("faqs")}
              onToggle={() => toggleSection("faqs")}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Frequently Asked Questions
                </p>
                <Accordion type="single" collapsible>
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-sm text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-semibold text-foreground">Practical Tips</p>
                </div>
                <ul className="space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionPanel>

            {/* Collateral consequences callout */}
            <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/60 dark:bg-amber-900/10 p-5">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-foreground">Before any plea: know the benefit impacts</p>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Certain convictions can reduce or eliminate eligibility for federal benefits — sometimes automatically. These consequences are separate from fines and court fees and may affect your household for years.
              </p>
              <div className="grid sm:grid-cols-2 gap-2 mb-3">
                <div className="bg-white dark:bg-background border border-amber-200 dark:border-amber-800/40 rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground mb-1">SNAP (food stamps)</p>
                  <p className="text-xs text-muted-foreground">Federal law restricts SNAP for people with certain drug felony convictions. Some states have opted out of this restriction — check your state's rules. A drug felony plea without checking the SNAP impact first can affect your family's food access.</p>
                </div>
                <div className="bg-white dark:bg-background border border-amber-200 dark:border-amber-800/40 rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground mb-1">SSI / Social Security Disability</p>
                  <p className="text-xs text-muted-foreground">SSI payments are suspended during incarceration of 30 days or more. They are not terminated — but they must be reinstated, which takes time after release. Planning ahead helps avoid a payment gap.</p>
                </div>
                <div className="bg-white dark:bg-background border border-amber-200 dark:border-amber-800/40 rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground mb-1">Public housing / Section 8</p>
                  <p className="text-xs text-muted-foreground">Certain convictions — especially drug or violent felonies — can trigger mandatory eviction from public housing or disqualification from the Section 8 voucher program. This can affect all household members.</p>
                </div>
                <div className="bg-white dark:bg-background border border-amber-200 dark:border-amber-800/40 rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground mb-1">Student financial aid (Pell Grants / loans)</p>
                  <p className="text-xs text-muted-foreground">Drug convictions while receiving federal student aid can result in temporary ineligibility for Pell Grants and federal student loans. Completing a drug treatment program can restore eligibility in some cases.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Ask your attorney specifically about how any plea will affect your benefits before signing anything.{' '}
                <Link href="/collateral-consequences" className="text-amber-700 dark:text-amber-400 underline font-medium">Learn more about collateral consequences.</Link>
              </p>
            </div>

            {/* Disclaimer */}
            <Alert className="border-slate-200 dark:border-slate-700">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-muted-foreground text-sm">
                This page provides general legal information, not legal advice. Financial and legal situations vary by jurisdiction. Always consult a licensed attorney or accredited financial counselor about your specific situation.
              </AlertDescription>
            </Alert>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
