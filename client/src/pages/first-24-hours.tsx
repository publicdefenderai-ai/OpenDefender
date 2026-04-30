import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Check, X, Phone, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BrandShieldIcon } from "@/components/brand-logo";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useTranslation } from "react-i18next";
import { Shield, Scale, MessageSquare, BookOpen } from "lucide-react";
import { LegalTerm } from "@/components/ui/legal-term";
import { JurisdictionSelector } from "@/components/ui/jurisdiction-selector";
import { JurisdictionCallout } from "@/components/ui/jurisdiction-callout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lookupZip, isStatewideUrl } from "@/lib/zip-county-data";

// State-level VINELink fallbacks for state dropdown
const STATE_LOCATORS: Record<string, { name: string; url: string; note?: string }> = {
  AL: { name: "Alabama", url: "https://vinelink.vineapps.com/search/AL/Person" },
  AK: { name: "Alaska", url: "https://vinelink.vineapps.com/search/AK/Person" },
  AZ: { name: "Arizona", url: "https://corrections.az.gov/public-inmate-search" },
  AR: { name: "Arkansas", url: "https://vinelink.vineapps.com/search/AR/Person" },
  CA: { name: "California", url: "https://vinelink.vineapps.com/search/CA/Person", note: "For county jails. State prison: inmatelocator.cdcr.ca.gov" },
  CO: { name: "Colorado", url: "https://www.colorado.gov/apps/offender/public/#/" },
  CT: { name: "Connecticut", url: "https://www.ctinmateinfo.state.ct.us/" },
  DE: { name: "Delaware", url: "https://vinelink.vineapps.com/search/DE/Person" },
  FL: { name: "Florida", url: "https://vinelink.vineapps.com/search/FL/Person" },
  GA: { name: "Georgia", url: "https://vinelink.vineapps.com/search/GA/Person" },
  HI: { name: "Hawaii", url: "https://vinelink.vineapps.com/search/HI/Person" },
  ID: { name: "Idaho", url: "https://vinelink.vineapps.com/search/ID/Person" },
  IL: { name: "Illinois", url: "https://vinelink.vineapps.com/search/IL/Person" },
  IN: { name: "Indiana", url: "https://vinelink.vineapps.com/search/IN/Person" },
  IA: { name: "Iowa", url: "https://vinelink.vineapps.com/search/IA/Person" },
  KS: { name: "Kansas", url: "https://vinelink.vineapps.com/search/KS/Person" },
  KY: { name: "Kentucky", url: "https://corrections.ky.gov/depts/facilityops/Pages/kool.aspx" },
  LA: { name: "Louisiana", url: "https://vinelink.vineapps.com/search/LA/Person" },
  ME: { name: "Maine", url: "https://vinelink.vineapps.com/search/ME/Person" },
  MD: { name: "Maryland", url: "https://vinelink.vineapps.com/search/MD/Person" },
  MA: { name: "Massachusetts", url: "https://vinelink.vineapps.com/search/MA/Person" },
  MI: { name: "Michigan", url: "https://mdocweb.state.mi.us/otis2/otis2.aspx" },
  MN: { name: "Minnesota", url: "https://vinelink.vineapps.com/search/MN/Person" },
  MS: { name: "Mississippi", url: "https://vinelink.vineapps.com/search/MS/Person" },
  MO: { name: "Missouri", url: "https://vinelink.vineapps.com/search/MO/Person" },
  MT: { name: "Montana", url: "https://vinelink.vineapps.com/search/MT/Person" },
  NE: { name: "Nebraska", url: "https://vinelink.vineapps.com/search/NE/Person" },
  NV: { name: "Nevada", url: "https://vinelink.vineapps.com/search/NV/Person" },
  NH: { name: "New Hampshire", url: "https://vinelink.vineapps.com/search/NH/Person" },
  NJ: { name: "New Jersey", url: "https://www.njinmateinfo.com/" },
  NM: { name: "New Mexico", url: "https://vinelink.vineapps.com/search/NM/Person" },
  NY: { name: "New York", url: "https://vinelink.vineapps.com/search/NY/Person", note: "County jails. State prison: nysdoccslookup.doccs.ny.gov" },
  NC: { name: "North Carolina", url: "https://webapps.doc.state.nc.us/opi/offendersearch.do" },
  ND: { name: "North Dakota", url: "https://vinelink.vineapps.com/search/ND/Person" },
  OH: { name: "Ohio", url: "https://appgateway.drc.ohio.gov/OffenderSearch" },
  OK: { name: "Oklahoma", url: "https://vinelink.vineapps.com/search/OK/Person" },
  OR: { name: "Oregon", url: "https://vinelink.vineapps.com/search/OR/Person" },
  PA: { name: "Pennsylvania", url: "https://vinelink.vineapps.com/search/PA/Person" },
  RI: { name: "Rhode Island", url: "https://vinelink.vineapps.com/search/RI/Person" },
  SC: { name: "South Carolina", url: "https://vinelink.vineapps.com/search/SC/Person" },
  SD: { name: "South Dakota", url: "https://vinelink.vineapps.com/search/SD/Person" },
  TN: { name: "Tennessee", url: "https://vinelink.vineapps.com/search/TN/Person" },
  TX: { name: "Texas", url: "https://vinelink.vineapps.com/search/TX/Person", note: "County jails. State prison: offender.tdcj.texas.gov" },
  UT: { name: "Utah", url: "https://vinelink.vineapps.com/search/UT/Person" },
  VT: { name: "Vermont", url: "https://vinelink.vineapps.com/search/VT/Person" },
  VA: { name: "Virginia", url: "https://vadoc.virginia.gov/offenders/locator/" },
  WA: { name: "Washington", url: "https://vinelink.vineapps.com/search/WA/Person" },
  WV: { name: "West Virginia", url: "https://vinelink.vineapps.com/search/WV/Person" },
  WI: { name: "Wisconsin", url: "https://vinelink.vineapps.com/search/WI/Person" },
  WY: { name: "Wyoming", url: "https://vinelink.vineapps.com/search/WY/Person" },
  DC: { name: "Washington D.C.", url: "https://vinelink.vineapps.com/search/DC/Person" },
  FED: { name: "Federal (BOP)", url: "https://www.bop.gov/inmateloc/", note: "Federal custody only. Search by name or register number." },
};

function FacilityLookupWidget() {
  const { t } = useTranslation();
  const [zip, setZip] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [result, setResult] = useState<ReturnType<typeof lookupZip> | null | undefined>(undefined);

  function handleZipSearch() {
    if (zip.replace(/\D/g, "").length < 5) return;
    setResult(lookupZip(zip));
  }

  const stateLocator = selectedState ? STATE_LOCATORS[selectedState] : null;

  return (
    <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-semibold text-foreground">{t('first24Hours.facilityLookup.title')}</p>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{t('first24Hours.facilityLookup.subtitle')}</p>

      {/* ZIP lookup */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          value={zip}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 5);
            setZip(v);
            setResult(undefined);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleZipSearch()}
          placeholder={t('first24Hours.facilityLookup.zipPlaceholder')}
          aria-label={t('first24Hours.facilityLookup.zipLabel')}
          className="flex-1 text-sm rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          size="sm"
          onClick={handleZipSearch}
          disabled={zip.replace(/\D/g, "").length < 5}
          className="shrink-0"
        >
          <Phone className="w-3.5 h-3.5 mr-1.5" />
          {t('first24Hours.facilityLookup.goToLocator')}
        </Button>
      </div>

      {/* Result area */}
      {result !== undefined && (
        <div className="rounded-md bg-background border border-border p-3 mb-3">
          {result ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{t('first24Hours.facilityLookup.countyFound')}</span>{" "}
                {result.county}, {result.state}
              </p>
              <a
                href={result.inmateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                <Phone className="w-3.5 h-3.5" />
                {isStatewideUrl(result.inmateUrl)
                  ? `${result.state} ${t('first24Hours.facilityLookup.statewideLocatorSuffix')}`
                  : `${result.county} ${t('first24Hours.facilityLookup.countyLocatorSuffix')}`}
              </a>
              {result.urlNote && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">{t('first24Hours.facilityLookup.urlNote')}:</span> {result.urlNote}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-amber-700 dark:text-amber-300">{t('first24Hours.facilityLookup.zipNotFound')}</p>
          )}
        </div>
      )}

      {/* State selector fallback */}
      <div className="border-t border-border/60 pt-3 mt-1">
        <p className="text-xs text-muted-foreground mb-2">{t('first24Hours.facilityLookup.stateSelect')}</p>
        <div className="flex gap-2">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="flex-1 text-sm rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={t('first24Hours.facilityLookup.stateSelect')}
          >
            <option value="">—</option>
            {Object.entries(STATE_LOCATORS).map(([code, { name }]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
          {stateLocator && (
            <a
              href={stateLocator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              {t('first24Hours.facilityLookup.stateGoButton')}
            </a>
          )}
        </div>
        {stateLocator?.note && (
          <p className="text-xs text-muted-foreground mt-2">
            <span className="font-medium">{t('first24Hours.facilityLookup.urlNote')}:</span> {stateLocator.note}
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3">{t('first24Hours.facilityLookup.fallbackNote')}</p>
    </div>
  );
}

interface StepProps {
  number: number;
  title: string;
  timeframe: string;
  context: string;
  dos: string[];
  donts: string[];
  isLast?: boolean;
  id?: string;
  highlighted?: boolean;
  priorityLabel?: string;
  children?: React.ReactNode;
}

function Step({ number, title, timeframe, context, dos, donts, isLast, id, highlighted, priorityLabel, children }: StepProps) {
  return (
    <div className="relative" id={id}>
      <div className="flex items-start gap-5">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md z-10 transition-colors ${
            highlighted
              ? 'bg-blue-600 dark:bg-blue-500 ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-background'
              : 'bg-slate-800 dark:bg-slate-700'
          }`}>
            {number}
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 min-h-[80px] mt-3" />
          )}
        </div>

        <div className="flex-1 pb-10">
          {highlighted && priorityLabel && (
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1.5">
              ↑ {priorityLabel}
            </p>
          )}
          <div className="mb-3">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <span className="text-xs text-muted-foreground">{timeframe}</span>
          </div>

          <p className="text-muted-foreground mb-5 leading-relaxed text-sm">{context}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-900/10 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-emerald-200 dark:border-emerald-800/60">
                <div className="w-5 h-5 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Do</p>
              </div>
              <ul className="space-y-2.5">
                {dos.map((item, i) => (
                  <li key={i} className="text-sm text-foreground/80 dark:text-foreground/75 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-rose-200 dark:border-rose-800/60 bg-rose-50/70 dark:bg-rose-900/10 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-rose-200 dark:border-rose-800/60">
                <div className="w-5 h-5 rounded-full bg-rose-500 dark:bg-rose-600 flex items-center justify-center flex-shrink-0">
                  <X className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">Don't</p>
              </div>
              <ul className="space-y-2.5">
                {donts.map((item, i) => (
                  <li key={i} className="text-sm text-foreground/80 dark:text-foreground/75 flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}

export default function FirstTwentyFourHours() {
  useScrollToTop();
  const { t } = useTranslation();
  const [jurisdiction, setJurisdiction] = useState<string>("");
  const [stageSelection, setStageSelection] = useState<'custody' | 'released' | 'arraignment' | null>(null);

  // Scroll to first priority step when stage is selected
  useEffect(() => {
    if (!stageSelection) return;
    const scrollTargets: Record<string, string> = {
      custody: 'step-booking',
      released: 'step-lawyer',
      arraignment: 'step-lawyer',
    };
    const targetId = scrollTargets[stageSelection];
    if (targetId) {
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [stageSelection]);

  // Which steps to highlight per stage selection
  const HIGHLIGHTED: Record<string, number[]> = {
    custody: [2, 3, 4],
    released: [4, 5, 6],
    arraignment: [5, 6, 7],
  };
  const isHighlighted = (n: number) =>
    stageSelection != null && (HIGHLIGHTED[stageSelection]?.includes(n) ?? false);
  const priorityLabel = t('first24Hours.stageSelector.priorityLabel');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="vivid-header-alt py-14 md:py-18">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white">
            {t('first24Hours.title')}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            {t('first24Hours.subtitle')}
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">

        {/* Calm intro */}
        <ScrollReveal>
          <div className="mb-6 rounded-xl border border-teal-200/70 dark:border-teal-800/30 bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-950/20 dark:to-sky-950/10 p-5 flex items-start gap-3 shadow-sm">
            <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <p className="text-base text-foreground/90 font-medium leading-relaxed">
              {t('first24Hours.calmIntro')}
            </p>
          </div>
        </ScrollReveal>

        {/* Family path callout */}
        <ScrollReveal delay={0.01}>
          <div className="mb-6 rounded-lg border border-blue-200 dark:border-blue-800/60 bg-blue-50/60 dark:bg-blue-900/10 p-4">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3">
              {t('first24Hours.familyCallout.title')}
            </p>
            <ul className="space-y-1.5 mb-3">
              {(['task1', 'task2', 'task3'] as const).map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">→</span>
                  <span>{t(`first24Hours.familyCallout.${key}`)}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 flex-wrap">
              <Link href="/friends-family">
                <Button variant="outline" size="sm">{t('first24Hours.familyCallout.fullGuide')}</Button>
              </Link>
              <Link href="#phone-call">
                <Button variant="outline" size="sm">{t('first24Hours.familyCallout.jailCallGuide')}</Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.015}>
          <Alert className="mb-8 border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              {t('first24Hours.alert')}
            </AlertDescription>
          </Alert>
        </ScrollReveal>

        {/* Stage selector */}
        <ScrollReveal delay={0.018}>
          <div className="mb-8 rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm font-semibold text-foreground mb-1">{t('first24Hours.stageSelector.prompt')}</p>
            <p className="text-xs text-muted-foreground mb-3">{t('first24Hours.stageSelector.detail')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {([
                { key: 'custody', label: t('first24Hours.stageSelector.custody'), desc: t('first24Hours.stageSelector.custodyDesc') },
                { key: 'released', label: t('first24Hours.stageSelector.released'), desc: t('first24Hours.stageSelector.releasedDesc') },
                { key: 'arraignment', label: t('first24Hours.stageSelector.arraignment'), desc: t('first24Hours.stageSelector.arraignmentDesc') },
              ] as const).map(({ key, label, desc }) => (
                <button
                  key={key}
                  onClick={() => setStageSelection(stageSelection === key ? null : key)}
                  className={`text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                    stageSelection === key
                      ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:border-blue-500 shadow-sm'
                      : 'border-blue-200/80 dark:border-blue-800/50 bg-blue-50/70 dark:bg-blue-950/20 hover:border-blue-400/70 dark:hover:border-blue-600/60 hover:bg-blue-100/60 dark:hover:bg-blue-900/20 shadow-sm'
                  }`}
                >
                  <p className={`font-semibold mb-0.5 ${stageSelection === key ? 'text-blue-700 dark:text-blue-300' : 'text-foreground'}`}>{label}</p>
                  <p className="text-muted-foreground leading-tight">{desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-muted-foreground">{t('first24Hours.stageSelector.preArrestNote')}</p>
              {stageSelection && (
                <button onClick={() => setStageSelection(null)} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 flex-shrink-0">
                  {t('first24Hours.stageSelector.clear')}
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Before-arrest section */}
        <ScrollReveal delay={0.02}>
          <div id="before-arrest" className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-1">{t('first24Hours.beforeArrest.heading')}</h2>
            <p className="text-sm text-muted-foreground mb-4">{t('first24Hours.beforeArrest.subheading')}</p>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {[
                {
                  value: 'police-talk',
                  title: t('first24Hours.beforeArrest.policeWantToTalkTitle'),
                  context: t('first24Hours.beforeArrest.policeWantToTalkContext'),
                  dos: [
                    t('first24Hours.beforeArrest.policeWantToTalkDo1'),
                    t('first24Hours.beforeArrest.policeWantToTalkDo2'),
                    t('first24Hours.beforeArrest.policeWantToTalkDo3'),
                  ],
                  donts: [
                    t('first24Hours.beforeArrest.policeWantToTalkDont1'),
                    t('first24Hours.beforeArrest.policeWantToTalkDont2'),
                    t('first24Hours.beforeArrest.policeWantToTalkDont3'),
                  ],
                },
                {
                  value: 'target-letter',
                  title: t('first24Hours.beforeArrest.targetLetterTitle'),
                  context: t('first24Hours.beforeArrest.targetLetterContext'),
                  dos: [
                    t('first24Hours.beforeArrest.targetLetterDo1'),
                    t('first24Hours.beforeArrest.targetLetterDo2'),
                  ],
                  donts: [
                    t('first24Hours.beforeArrest.targetLetterDont1'),
                    t('first24Hours.beforeArrest.targetLetterDont2'),
                    t('first24Hours.beforeArrest.targetLetterDont3'),
                  ],
                },
                {
                  value: 'warrant',
                  title: t('first24Hours.beforeArrest.warrantTitle'),
                  context: t('first24Hours.beforeArrest.warrantContext'),
                  dos: [
                    t('first24Hours.beforeArrest.warrantDo1'),
                    t('first24Hours.beforeArrest.warrantDo2'),
                    t('first24Hours.beforeArrest.warrantDo3'),
                  ],
                  donts: [
                    t('first24Hours.beforeArrest.warrantDont1'),
                    t('first24Hours.beforeArrest.warrantDont2'),
                    t('first24Hours.beforeArrest.warrantDont3'),
                  ],
                },
                {
                  value: 'detained',
                  title: t('first24Hours.beforeArrest.detainedTitle'),
                  context: t('first24Hours.beforeArrest.detainedContext'),
                  dos: [
                    t('first24Hours.beforeArrest.detainedDo1'),
                    t('first24Hours.beforeArrest.detainedDo2'),
                    t('first24Hours.beforeArrest.detainedDo3'),
                  ],
                  donts: [
                    t('first24Hours.beforeArrest.detainedDont1'),
                    t('first24Hours.beforeArrest.detainedDont2'),
                    t('first24Hours.beforeArrest.detainedDont3'),
                  ],
                },
              ].map(({ value, title, context, dos, donts }) => (
                <AccordionItem key={value} value={value} className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left hover:no-underline py-3">
                    <span className="font-semibold text-sm">{title}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{context}</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-900/10 p-3">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-emerald-200 dark:border-emerald-800/60">
                          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Do</p>
                        </div>
                        <ul className="space-y-2">
                          {dos.map((item, i) => (
                            <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-rose-200 dark:border-rose-800/60 bg-rose-50/70 dark:bg-rose-900/10 p-3">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-rose-200 dark:border-rose-800/60">
                          <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
                            <X className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                          <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">Don't</p>
                        </div>
                        <ul className="space-y-2">
                          {donts.map((item, i) => (
                            <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                              <X className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.025}>
          <JurisdictionSelector
            label="See state-specific rules for your location (optional)"
            value={jurisdiction}
            onChange={setJurisdiction}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.03}>
          <div className="mb-8 rounded-lg border-2 border-amber-400 bg-amber-50 dark:bg-amber-900/20 p-5">
            <h3 className="text-base font-bold text-amber-800 dark:text-amber-200 mb-3">{t('first24Hours.juvenile.title')}</h3>
            <p className="text-sm text-amber-900 dark:text-amber-100 mb-3">{t('first24Hours.juvenile.intro')}</p>
            <ul className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
              <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0">•</span><span>{t('first24Hours.juvenile.bullet1')}</span></li>
              <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0">•</span><span>{t('first24Hours.juvenile.bullet2')}</span></li>
              <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0">•</span><span>{t('first24Hours.juvenile.bullet3')}</span></li>
              <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0">•</span><span>{t('first24Hours.juvenile.bullet4')}</span></li>
              <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0">•</span><span>{t('first24Hours.juvenile.bullet5')}</span></li>
            </ul>
          </div>
        </ScrollReveal>

        <div>
          {/* STEP 1 */}
          <ScrollReveal delay={0.05}>
            <Step
              number={1}
              id="step-arrest"
              highlighted={isHighlighted(1)}
              priorityLabel={priorityLabel}
              title={t('first24Hours.steps.step1.title')}
              timeframe={t('first24Hours.steps.step1.timeframe')}
              context={t('first24Hours.steps.step1.context')}
              dos={[
                t('first24Hours.steps.step1.do1'),
                t('first24Hours.steps.step1.do2'),
                t('first24Hours.steps.step1.do3'),
              ]}
              donts={[
                t('first24Hours.steps.step1.dont1'),
                t('first24Hours.steps.step1.dont2'),
                t('first24Hours.steps.step1.dont3'),
              ]}
            >
              <div className="mt-2 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t('first24Hours.steps.step1.note')}
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/right-to-counsel">
                    <Button variant="outline" size="sm">{t('first24Hours.links.rightToCounsel')}</Button>
                  </Link>
                  <Link href="/warrants">
                    <Button variant="outline" size="sm">{t('first24Hours.links.warrants')}</Button>
                  </Link>
                </div>
              </div>
            </Step>
          </ScrollReveal>

          {/* STEP 2 */}
          <ScrollReveal delay={0.1}>
            <Step
              number={2}
              id="step-booking"
              highlighted={isHighlighted(2)}
              priorityLabel={priorityLabel}
              title={t('first24Hours.steps.step2.title')}
              timeframe={t('first24Hours.steps.step2.timeframe')}
              context={t('first24Hours.steps.step2.context')}
              dos={[
                t('first24Hours.steps.step2.do1'),
                t('first24Hours.steps.step2.do2'),
                t('first24Hours.steps.step2.do3'),
                t('first24Hours.steps.step2.do4'),
                t('first24Hours.steps.step2.do5'),
                t('first24Hours.steps.step2.do6'),
                t('first24Hours.steps.step2.do7'),
              ]}
              donts={[
                t('first24Hours.steps.step2.dont1'),
                t('first24Hours.steps.step2.dont2'),
                t('first24Hours.steps.step2.dont3'),
                t('first24Hours.steps.step2.dont4'),
                t('first24Hours.steps.step2.dont5'),
              ]}
            >
              <JurisdictionCallout jurisdiction={jurisdiction} topic="phone_call" />
            </Step>
          </ScrollReveal>

          {/* STEP 3 — with phone-call anchor */}
          <ScrollReveal delay={0.15}>
            <Step
              number={3}
              id="phone-call"
              highlighted={isHighlighted(3)}
              priorityLabel={priorityLabel}
              title={t('first24Hours.steps.step3.title')}
              timeframe={t('first24Hours.steps.step3.timeframe')}
              context={t('first24Hours.steps.step3.context')}
              dos={[
                t('first24Hours.steps.step3.do1'),
                t('first24Hours.steps.step3.do2'),
                t('first24Hours.steps.step3.do3'),
                t('first24Hours.steps.step3.do4'),
                t('first24Hours.steps.step3.do5'),
                t('first24Hours.steps.step3.do6'),
              ]}
              donts={[
                t('first24Hours.steps.step3.dont1'),
                t('first24Hours.steps.step3.dont2'),
                t('first24Hours.steps.step3.dont3'),
                t('first24Hours.steps.step3.dont4'),
                t('first24Hours.steps.step3.dont5'),
                t('first24Hours.steps.step3.dont6'),
              ]}
            >
              <div className="space-y-4 mt-2">
                {/* Warning banner */}
                <Alert className="border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
                  <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
                    <strong>{t('first24Hours.phoneCall.warningTitle')}</strong>{" "}
                    {t('first24Hours.phoneCall.warningBody')}
                  </AlertDescription>
                </Alert>

                {/* Script */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">{t('first24Hours.phoneCall.scriptTitle')}</p>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 font-mono text-sm leading-relaxed text-foreground space-y-2">
                    <p>{t('first24Hours.script.line1')}</p>
                    <p>{t('first24Hours.script.line2')}</p>
                    <p>{t('first24Hours.script.line3')}</p>
                    <p>{t('first24Hours.script.line4')}</p>
                    <p>{t('first24Hours.script.line5')}</p>
                    <p>{t('first24Hours.script.line6')}</p>
                  </div>
                </div>

                {/* What never to say */}
                <div className="rounded-lg border border-red-200 dark:border-red-900 overflow-hidden">
                  <div className="bg-red-50/60 dark:bg-red-950/30 px-4 py-3 border-b border-red-200 dark:border-red-900">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300">{t('first24Hours.phoneCall.neverSayTitle')}</p>
                  </div>
                  <div className="p-4 space-y-3">
                    {[
                      { title: t('first24Hours.phoneCall.neverSay.factsTitle'), detail: t('first24Hours.phoneCall.neverSay.factsDetail') },
                      { title: t('first24Hours.phoneCall.neverSay.alibiTitle'), detail: t('first24Hours.phoneCall.neverSay.alibiDetail') },
                      { title: t('first24Hours.phoneCall.neverSay.codefTitle'), detail: t('first24Hours.phoneCall.neverSay.codefDetail') },
                      { title: t('first24Hours.phoneCall.neverSay.evidenceTitle'), detail: t('first24Hours.phoneCall.neverSay.evidenceDetail') },
                      { title: t('first24Hours.phoneCall.neverSay.victimTitle'), detail: t('first24Hours.phoneCall.neverSay.victimDetail') },
                      { title: t('first24Hours.phoneCall.neverSay.frustrationTitle'), detail: t('first24Hours.phoneCall.neverSay.frustrationDetail') },
                    ].map(({ title, detail }) => (
                      <div key={title} className="flex items-start gap-2.5">
                        <span className="flex-shrink-0 mt-0.5 text-red-500 font-medium text-sm">–</span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Facility lookup */}
                <FacilityLookupWidget />
              </div>
            </Step>
          </ScrollReveal>

          {/* STEP 4 */}
          <ScrollReveal delay={0.2}>
            <Step
              number={4}
              id="step-bail"
              highlighted={isHighlighted(4)}
              priorityLabel={priorityLabel}
              title={t('first24Hours.steps.step4.title')}
              timeframe={t('first24Hours.steps.step4.timeframe')}
              context={t('first24Hours.steps.step4.context')}
              dos={[
                t('first24Hours.steps.step4.do1'),
                t('first24Hours.steps.step4.do2'),
                t('first24Hours.steps.step4.do3'),
              ]}
              donts={[
                t('first24Hours.steps.step4.dont1'),
                t('first24Hours.steps.step4.dont2'),
                t('first24Hours.steps.step4.dont3'),
              ]}
            >
              <div className="mt-2">
                <p className="text-sm font-semibold text-foreground mb-3">{t('first24Hours.steps.step4.bailHeader')}</p>
                <ol className="space-y-2.5 text-sm text-foreground/80 dark:text-foreground/75 list-none">
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">1.</span><span>{t('first24Hours.steps.step4.bail1')}</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">2.</span><span>{t('first24Hours.steps.step4.bail2')}</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">3.</span><span>{t('first24Hours.steps.step4.bail3')}</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">4.</span><span>{t('first24Hours.steps.step4.bail4')}</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">5.</span><span>{t('first24Hours.steps.step4.bail5')}</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">6.</span><span>{t('first24Hours.steps.step4.bail6')}</span></li>
                </ol>
                <div className="flex gap-3 flex-wrap mt-3">
                  <Link href="/case-timeline#bail-guide">
                    <Button variant="outline" size="sm">{t('first24Hours.links.howBailWorks')}</Button>
                  </Link>
                </div>
                <JurisdictionCallout jurisdiction={jurisdiction} topic="bail" />
              </div>
            </Step>
          </ScrollReveal>

          {/* STEP 5 */}
          <ScrollReveal delay={0.25}>
            <Step
              number={5}
              id="step-lawyer"
              highlighted={isHighlighted(5)}
              priorityLabel={priorityLabel}
              title={t('first24Hours.steps.step5.title')}
              timeframe={t('first24Hours.steps.step5.timeframe')}
              context={t('first24Hours.steps.step5.context')}
              dos={[
                t('first24Hours.steps.step5.do1'),
                t('first24Hours.steps.step5.do2'),
                t('first24Hours.steps.step5.do3'),
              ]}
              donts={[
                t('first24Hours.steps.step5.dont1'),
                t('first24Hours.steps.step5.dont2'),
                t('first24Hours.steps.step5.dont3'),
              ]}
            >
              <div className="space-y-4 mt-2">
                <div className="rounded-lg border border-blue-200 dark:border-blue-800/60 bg-blue-50/60 dark:bg-blue-900/10 p-4">
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1.5">
                    {t('first24Hours.steps.step5.attorneyUrgencyTitle')}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('first24Hours.steps.step5.attorneyUrgencyBody')}
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/?search=public-defender">
                    <Button variant="outline" size="sm">{t('first24Hours.links.findDefender')}</Button>
                  </Link>
                  <Link href="/case-guidance">
                    <Button variant="outline" size="sm">{t('first24Hours.links.getGuidance')}</Button>
                  </Link>
                  <Link href="/right-to-counsel">
                    <Button variant="outline" size="sm">{t('first24Hours.links.rightToCounsel')}</Button>
                  </Link>
                </div>
                {/* Item 7 — AI guidance CTA */}
                <div className="rounded-lg border border-border bg-background p-4 text-center">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {t('first24Hours.guidanceCta.title')}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {t('first24Hours.guidanceCta.body')}
                  </p>
                  <Link href="/case-guidance">
                    <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600">
                      {t('first24Hours.guidanceCta.button')} →
                    </Button>
                  </Link>
                </div>
              </div>
            </Step>
          </ScrollReveal>

          {/* STEP 6 */}
          <ScrollReveal delay={0.3}>
            <Step
              number={6}
              id="step-arraignment"
              highlighted={isHighlighted(6)}
              priorityLabel={priorityLabel}
              title={t('first24Hours.steps.step6.title')}
              timeframe={t('first24Hours.steps.step6.timeframe')}
              context={t('first24Hours.steps.step6.context')}
              dos={[
                t('first24Hours.steps.step6.do1'),
                t('first24Hours.steps.step6.do2'),
                t('first24Hours.steps.step6.do3'),
              ]}
              donts={[
                t('first24Hours.steps.step6.dont1'),
                t('first24Hours.steps.step6.dont2'),
                t('first24Hours.steps.step6.dont3'),
              ]}
            >
              <JurisdictionCallout jurisdiction={jurisdiction} topic="arraignment" />
            </Step>
          </ScrollReveal>

          {/* STEP 7 */}
          <ScrollReveal delay={0.35}>
            <Step
              number={7}
              id="step-ongoing"
              highlighted={isHighlighted(7)}
              priorityLabel={priorityLabel}
              title={t('first24Hours.steps.step7.title')}
              timeframe={t('first24Hours.steps.step7.timeframe')}
              context={t('first24Hours.steps.step7.context')}
              dos={[
                t('first24Hours.steps.step7.do1'),
                t('first24Hours.steps.step7.do2'),
                t('first24Hours.steps.step7.do3'),
                t('first24Hours.steps.step7.do4'),
              ]}
              donts={[
                t('first24Hours.steps.step7.dont1'),
                t('first24Hours.steps.step7.dont2'),
                t('first24Hours.steps.step7.dont3'),
                t('first24Hours.steps.step7.dont4'),
              ]}
              isLast
            />
          </ScrollReveal>
        </div>

        {/* DEEP-DIVE ACCORDIONS */}
        <ScrollReveal delay={0.4}>
          <div className="mt-4 border-t border-border pt-10">
            <h2 className="text-xl font-bold text-foreground mb-2">{t('first24Hours.deepDiveTitle')}</h2>
            <p className="text-sm text-muted-foreground mb-6">{t('first24Hours.deepDiveSubtitle')}</p>

            <Accordion type="single" collapsible className="w-full space-y-3">

              {/* ACCORDION 1: When does right to a lawyer begin */}
              <AccordionItem value="right-to-counsel-timing" className="border border-border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-semibold text-base">{t('first24Hours.accordion.counselTitle')}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('first24Hours.accordion.counselIntro')}
                  </p>

                  <div className="space-y-3">
                    <div className="rounded-lg bg-muted/40 p-4 border border-border/60">
                      <p className="text-sm font-semibold text-foreground mb-1.5">{t('first24Hours.accordion.counselFifthTitle')}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('first24Hours.accordion.counselFifthBody')}
                      </p>
                    </div>

                    <div className="rounded-lg bg-muted/40 p-4 border border-border/60">
                      <p className="text-sm font-semibold text-foreground mb-1.5">{t('first24Hours.accordion.counselSixthTitle')}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('first24Hours.accordion.counselSixthBody')}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-900/10 p-4">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">{t('first24Hours.accordion.counselGapTitle')}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('first24Hours.accordion.counselGapBody')}{" "}
                      <strong>{t('first24Hours.accordion.counselGapWarning')}</strong>
                    </p>
                  </div>

                  {(() => {
                    const allCounselStates = [
                      { state: "California", noteKey: "counselStateCA", code: "california" },
                      { state: "New York", noteKey: "counselStateNY", code: "new york" },
                      { state: "Texas", noteKey: "counselStateTX", code: "texas" },
                      { state: "Florida", noteKey: "counselStateFL", code: "florida" },
                      { state: "Federal", noteKey: "counselStateFed", code: "federal" },
                    ];
                    const visibleStates = jurisdiction
                      ? allCounselStates.filter(s => s.code === jurisdiction)
                      : allCounselStates;
                    const stateName = jurisdiction
                      ? jurisdiction.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                      : "";
                    return (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">
                          {jurisdiction && visibleStates.length > 0
                            ? `Rules for ${stateName}`
                            : t('first24Hours.accordion.counselVariationsTitle')}
                        </p>
                        {visibleStates.length > 0 ? (
                          <div className="grid sm:grid-cols-2 gap-2 text-sm">
                            {visibleStates.map(({ state, noteKey }) => (
                              <div key={state} className="rounded-md border border-border/60 bg-background p-3">
                                <p className="text-xs font-bold text-foreground mb-1">{state}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{t(`first24Hours.accordion.${noteKey}`)}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-md border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
                            <strong>{stateName}</strong> does not have a specific state rule catalogued here — your rights during this stage are governed by the federal constitutional rules described above.{" "}
                            <Link href="/case-guidance" className="underline underline-offset-2 font-medium">Get personalized guidance</Link> for {stateName}-specific details.
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="flex gap-2 flex-wrap pt-1">
                    <Link href="/right-to-counsel">
                      <Button variant="outline" size="sm">{t('first24Hours.accordion.counselCtaButton')}</Button>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* ACCORDION 2: On probation or parole */}
              <AccordionItem value="probation-parole" className="border border-border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-semibold text-base">{t('first24Hours.accordion.probationTitle')}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-4">
                  <Alert className="border-orange-300 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700">
                    <AlertDescription className="text-orange-800 dark:text-orange-200 text-sm">
                      <strong>{t('first24Hours.accordion.probationAlert')}</strong>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <Card className="border-border/60">
                      <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-sm font-semibold">{t('first24Hours.accordion.probationImmediateTitle')}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 pb-4">
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-foreground/40">•</span><span>{t('first24Hours.accordion.probationImmediate1')}</span></li>
                          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-foreground/40">•</span><span>{t('first24Hours.accordion.probationImmediate2')}</span></li>
                          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-foreground/40">•</span><span>{t('first24Hours.accordion.probationImmediate3')}</span></li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-border/60">
                      <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-sm font-semibold">{t('first24Hours.accordion.probationRightsTitle')}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 pb-4">
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-foreground/40">•</span><span>{t('first24Hours.accordion.probationRights1')}</span></li>
                          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-foreground/40">•</span><span>{t('first24Hours.accordion.probationRights2')}</span></li>
                          <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-foreground/40">•</span><span>{t('first24Hours.accordion.probationRights3')}</span></li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-border/60">
                      <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-sm font-semibold">{t('first24Hours.accordion.probationWhatToDoTitle')}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 pb-4">
                        <ol className="space-y-2 text-sm text-muted-foreground list-none">
                          <li className="flex items-start gap-2"><span className="font-bold text-foreground flex-shrink-0">1.</span><span>{t('first24Hours.accordion.probationStep1')}</span></li>
                          <li className="flex items-start gap-2"><span className="font-bold text-foreground flex-shrink-0">2.</span><span>{t('first24Hours.accordion.probationStep2')}</span></li>
                          <li className="flex items-start gap-2"><span className="font-bold text-foreground flex-shrink-0">3.</span><span>{t('first24Hours.accordion.probationStep3')}</span></li>
                          <li className="flex items-start gap-2"><span className="font-bold text-foreground flex-shrink-0">4.</span><span>{t('first24Hours.accordion.probationStep4')}</span></li>
                        </ol>
                      </CardContent>
                    </Card>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {t('first24Hours.accordion.probationDisclaimer')}
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* ACCORDION 3: First appearance */}
              <AccordionItem value="first-appearance" className="border border-border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-semibold text-base">{t('first24Hours.accordion.firstAppearanceTitle')}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('first24Hours.accordion.firstAppearanceIntro')}
                  </p>

                  <div className="space-y-3">
                    <div className="rounded-lg bg-muted/40 p-4 border border-border/60">
                      <p className="text-sm font-semibold text-foreground mb-2">{t('first24Hours.accordion.firstAppearanceDecidesTitle')}</p>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-foreground/40">•</span><span>{t('first24Hours.accordion.firstAppearanceDecides1')}</span></li>
                        <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-foreground/40">•</span><span>{t('first24Hours.accordion.firstAppearanceDecides2')}</span></li>
                        <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-foreground/40">•</span><span>{t('first24Hours.accordion.firstAppearanceDecides3')}</span></li>
                        <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-foreground/40">•</span><span>{t('first24Hours.accordion.firstAppearanceDecides4')}</span></li>
                      </ul>
                    </div>

                    <div className="rounded-lg bg-muted/40 p-4 border border-border/60">
                      <p className="text-sm font-semibold text-foreground mb-2">{t('first24Hours.accordion.firstAppearanceNotTitle')}</p>
                      <p className="text-sm text-muted-foreground">{t('first24Hours.accordion.firstAppearanceNotBody')}</p>
                    </div>

                    {(() => {
                      const allAppearanceStates = [
                        { state: "California", noteKey: "firstAppearanceStateCA", code: "california" },
                        { state: "New York", noteKey: "firstAppearanceStateNY", code: "new york" },
                        { state: "Texas", noteKey: "firstAppearanceStateTX", code: "texas" },
                        { state: "Florida", noteKey: "firstAppearanceStateFL", code: "florida" },
                        { state: "Federal", noteKey: "firstAppearanceStateFed", code: "federal" },
                      ];
                      const visibleStates = jurisdiction
                        ? allAppearanceStates.filter(s => s.code === jurisdiction)
                        : allAppearanceStates;
                      const stateName = jurisdiction
                        ? jurisdiction.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                        : "";
                      return (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">
                            {jurisdiction && visibleStates.length > 0
                              ? `Rules for ${stateName}`
                              : t('first24Hours.accordion.firstAppearanceVariationsTitle')}
                          </p>
                          {visibleStates.length > 0 ? (
                            <div className="grid sm:grid-cols-2 gap-2 text-sm">
                              {visibleStates.map(({ state, noteKey }) => (
                                <div key={state} className="rounded-md border border-border/60 bg-background p-3">
                                  <p className="text-xs font-bold text-foreground mb-1">{state}</p>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{t(`first24Hours.accordion.${noteKey}`)}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-md border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
                              <strong>{stateName}</strong> does not have a specific first appearance timeline catalogued here — the federal constitutional standard applies (appearance "without unnecessary delay," typically within 48 hours).{" "}
                              <Link href="/case-guidance" className="underline underline-offset-2 font-medium">Get personalized guidance</Link> for {stateName}-specific details.
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    <div className="rounded-lg border border-blue-200 dark:border-blue-800/60 bg-blue-50/60 dark:bg-blue-900/10 p-4">
                      <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">{t('first24Hours.accordion.firstAppearanceHowTitle')}</p>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-blue-500">•</span><span>{t('first24Hours.accordion.firstAppearanceHow1')}</span></li>
                        <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-blue-500">•</span><span>{t('first24Hours.accordion.firstAppearanceHow2')}</span></li>
                        <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-blue-500">•</span><span>{t('first24Hours.accordion.firstAppearanceHow3')}</span></li>
                        <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0 text-blue-500">•</span><span>{t('first24Hours.accordion.firstAppearanceHow4')}</span></li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap pt-1">
                    <Link href="/case-timeline">
                      <Button variant="outline" size="sm">{t('first24Hours.links.caseTimeline')}</Button>
                    </Link>
                    <Link href="/case-guidance">
                      <Button variant="outline" size="sm">{t('first24Hours.links.getGuidance')}</Button>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>
        </ScrollReveal>

        {/* Related Guides */}
        <ScrollReveal delay={0.45}>
          <div className="mt-10 border-t border-border pt-10">
            <h2 className="text-lg font-semibold mb-3">{t('first24Hours.relatedGuides')}</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { href: "/case-timeline", icon: Scale, title: "Criminal Justice Process" },
                { href: "/rights-info", icon: Shield, title: "Your Constitutional Rights" },
                { href: "/right-to-counsel", icon: Shield, title: "Right to an Attorney" },
                { href: "/collateral-consequences", icon: BookOpen, title: "Hidden Consequences of a Conviction" },
                { href: "/case-guidance", icon: MessageSquare, title: "Get Personalized Guidance" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-border/60 hover:border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <Alert className="mt-8 border-slate-200 dark:border-slate-700">
            <AlertDescription className="text-muted-foreground text-sm">
              <div className="flex items-start gap-3">
                <BrandShieldIcon size={16} className="mt-0.5 flex-shrink-0 opacity-60" />
                <span>{t('first24Hours.disclaimer')}</span>
              </div>
            </AlertDescription>
          </Alert>
        </ScrollReveal>

      </main>

      <Footer />
    </div>
  );
}
