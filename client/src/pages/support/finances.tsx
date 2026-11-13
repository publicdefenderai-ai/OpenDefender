import { NrrcResources } from "@/components/nrrc-resources";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { financesDesignCopy } from "@/locales/finances-design";
import {
  CheckCircle, CheckCircle2, Calendar, ExternalLink,
  Info,
  Lightbulb, Phone, AlertCircle,
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
import {
  PageSectionNav,
  ScanFirstPageFrame,
} from "@/components/layout/scan-first-page-frame";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import {
  getCourtFeesForState, courtFeesByState,
  ALL_STATE_CODES, NATIONAL_ASSISTANCE_ORGS,
} from "@shared/court-fees-data";

/* ── Section map ───────────────────────────────────────────────── */

const SECTIONS = [
  { id: "quick-actions", shortLabel: "Quick Actions" },
  { id: "benefits",      shortLabel: "Benefits" },
  { id: "court-fees",    shortLabel: "Court Fees" },
  { id: "resources",     shortLabel: "Resources" },
  { id: "faqs",          shortLabel: "FAQs & Tips" },
];

const BENEFIT_IDS = ["snap", "medicaid", "tanf", "socialSecurity", "banking"] as const;
const FEE_TYPE_IDS = ["filing", "probation", "publicDefender", "restitution", "labFees", "surcharges"] as const;

const PRIORITY_COLORS: Record<string, string> = {
  high:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  low:    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

/* ── SectionPanel ──────────────────────────────────────────────── */

function SectionPanel({
  id, title, isOpen, onToggle, children,
}: {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="finances-panel">
      <button onClick={onToggle} aria-expanded={isOpen} aria-controls={`${id}-body`} id={`${id}-trigger`}>
        <h2>{title}</h2><span className="finances-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div id={`${id}-body`} aria-labelledby={`${id}-trigger`} className="finances-panel-body">{children}</div>}
    </section>
  );
}

/* ── Sidebar ───────────────────────────────────────────────────── */

/* ── Page ──────────────────────────────────────────────────────── */

export default function FinancesSupport() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const copy=financesDesignCopy[i18n.language.startsWith('es')?'es':i18n.language.startsWith('zh')?'zh':'en'];
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["quick-actions"]));
  const [selectedState, setSelectedState] = useState("");

  const toggleSection = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  useEffect(()=>{
    const reveal=()=>{const id=window.location.hash.slice(1);if(!SECTIONS.some(section=>section.id===id))return;
      setOpenIds(prev=>new Set([...prev,id]));requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start'}));};
    reveal();window.addEventListener('hashchange',reveal);return()=>window.removeEventListener('hashchange',reveal);
  },[]);

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
    <ScanFirstPageFrame mainClassName="finances-page">

      <Link className="finances-back" href="/support">{t('support.backToSupport')}</Link>
      <section className="finances-hero"><div><p>{copy.category}</p>
        <h1>{copy.heading}<br/><em>{copy.accent}</em></h1>
        <p>{t('support.finances.overview')}</p>
        <a className="finances-start" href="#quick-actions" onClick={()=>setOpenIds(prev=>new Set([...prev,'quick-actions']))}>{t('support.finances.nextStep')}</a>
      </div><img src="/images/design/finances.svg" alt="" aria-hidden="true" width="240" height="220"/></section>

      <div onClickCapture={event=>{const anchor=(event.target as HTMLElement).closest('a[href^="#"]');const id=anchor?.getAttribute('href')?.slice(1);if(id&&SECTIONS.some(section=>section.id===id)){setOpenIds(prev=>new Set([...prev,id]));requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start'}));}}}>
      <PageSectionNav
        ariaLabel={t("support.pageSections", "On this page")}
        items={SECTIONS.map(({ id }) => ({
          id,
          label: t(`support.finances.navigation.${id}`, SECTIONS.find(section => section.id === id)?.shortLabel ?? id),
        }))}
      />

      </div>

      {/* Content */}
      <div className="finances-content">
        <div className="space-y-3">

            {/* ── QUICK ACTIONS ─────────────────────────────────── */}
            <SectionPanel
              id="quick-actions"
              title={copy.quick}

              isOpen={openIds.has("quick-actions")}
              onToggle={() => toggleSection("quick-actions")}
            >
              <div className="space-y-3">
                {actionItems.map((item) => (
                  <div key={item.id} className="finances-action">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-1.5">
                      <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {item.timeframe && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{item.timeframe}</span>
                        )}
                        <Badge className={`text-xs border-0 ${PRIORITY_COLORS[item.priority]}`}>
                          {copy[item.priority as 'high'|'medium'|'low']}
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

              isOpen={openIds.has("benefits")}
              onToggle={() => toggleSection("benefits")}
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('support.finances.benefits.sectionSubtitle')}
              </p>
              <div className="space-y-3">
                {BENEFIT_IDS.map((id) => (
                  <div key={id} className="finances-benefit">
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

              isOpen={openIds.has("court-fees")}
              onToggle={() => toggleSection("court-fees")}
            >
              {/* Fee types accordion */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  {copy.types}
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
                <label htmlFor="finances-state" className="text-sm font-medium text-foreground mb-2 block">
                  {t('support.finances.courtFees.stateSelector.label')}
                </label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger id="finances-state" className="w-full md:w-72">
                    <SelectValue placeholder={t('support.finances.courtFees.stateSelector.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_STATE_CODES.map(code => (
                      <SelectItem key={code} value={code}>{courtFeesByState[code].stateName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {feeData && (
                  <Card lang="en" className="finances-state">
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
                          <div key={label} className="finances-fee-row">
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
                              <span><span lang="en"><strong>{org.name}</strong> — {org.description}</span></span>
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
                <p className="text-sm font-semibold text-muted-foreground mb-3">
                  {copy.national}
                </p>
                <div className="space-y-2">
                  {NATIONAL_ASSISTANCE_ORGS.map(org => (
                    <a key={org.name} href={org.url} target="_blank" rel="noopener noreferrer"
                       className="flex items-start gap-2 text-sm hover:underline">
                      <ExternalLink className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                      <span><span lang="en"><strong>{org.name}</strong> — {org.description}</span></span>
                    </a>
                  ))}
                </div>
              </div>
            </SectionPanel>

            {/* ── RESOURCES ─────────────────────────────────────── */}
            <SectionPanel
              id="resources"
              title={copy.resources}

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
                    className="finances-resource group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p lang="en" className="text-sm font-semibold text-foreground">
                            {resource.name}
                          </p>
                          {resource.free && (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-xs">
                              {t('support.free')}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs capitalize">{t(`support.resourceType.${resource.type}`)}</Badge>
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
              title={t('support.finances.navigation.faqs')}

              isOpen={openIds.has("faqs")}
              onToggle={() => toggleSection("faqs")}
            >
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-3">
                  {t('support.faq.title')}
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

              <div className="finances-tips">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-semibold text-foreground">{t('support.tips.title')}</p>
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
            <div lang="en" className="finances-warning">
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
                  <p className="text-xs text-muted-foreground">SSI and SSDI have different confinement rules. After 12 consecutive months of SSI suspension, a new application is generally required. Contact SSA about release documentation.</p>
                </div>
                <div className="bg-white dark:bg-background border border-amber-200 dark:border-amber-800/40 rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground mb-1">Public housing / Section 8</p>
                  <p className="text-xs text-muted-foreground">Housing admission and ending an existing tenancy have different rules. Evidence of qualifying conduct can lead to action; an arrest record alone does not establish that conduct.</p>
                </div>
                <div className="bg-white dark:bg-background border border-amber-200 dark:border-amber-800/40 rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground mb-1">Student financial aid (Pell Grants / loans)</p>
                  <p className="text-xs text-muted-foreground">The former automatic federal student aid restriction for drug convictions has been removed. A separate court order denying federal benefits can still affect eligibility.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Ask your attorney specifically about how any plea will affect your benefits before signing anything.{' '}
                <Link href="/collateral-consequences" className="text-amber-700 dark:text-amber-400 underline font-medium">Learn more about collateral consequences.</Link>
              </p>
            </div>

            {/* Disclaimer */}
            <Alert lang="en" className="border-slate-200 dark:border-slate-700">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-muted-foreground text-sm">
                This page provides general legal information, not legal advice. Financial and legal situations vary by jurisdiction. Always consult a licensed attorney or accredited financial counselor about your specific situation.
              </AlertDescription>
            </Alert>

          </div>
      </div>

      <NrrcResources ids={["consequences"]} />
    </ScanFirstPageFrame>
  );
}
