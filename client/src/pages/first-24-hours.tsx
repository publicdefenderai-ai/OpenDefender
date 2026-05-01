import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Check, X, Phone, MapPin, MapPinned, Users, ShieldAlert, ClipboardList, Banknote, Landmark, CalendarCheck, ChevronDown as ChevronDownIcon, FileText, ExternalLink, AlertTriangle, Info, type LucideIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useTranslation } from "react-i18next";
import { Shield, Scale, MessageSquare, BookOpen } from "lucide-react";
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

// Step color palettes keyed by step number
const STEP_COLORS: Record<number, { border: string; iconBg: string; iconText: string; activeBg: string }> = {
  0: { border: "border-slate-300 dark:border-slate-600",  iconBg: "bg-slate-100 dark:bg-slate-800/50", iconText: "text-slate-600 dark:text-slate-400", activeBg: "bg-slate-50/60 dark:bg-slate-900/20" },
  1: { border: "border-red-200 dark:border-red-800/60",    iconBg: "bg-red-100 dark:bg-red-900/50",    iconText: "text-red-600 dark:text-red-400",    activeBg: "bg-red-50/60 dark:bg-red-900/10" },
  2: { border: "border-orange-200 dark:border-orange-800/60", iconBg: "bg-orange-100 dark:bg-orange-900/50", iconText: "text-orange-600 dark:text-orange-400", activeBg: "bg-orange-50/60 dark:bg-orange-900/10" },
  3: { border: "border-yellow-200 dark:border-yellow-800/60", iconBg: "bg-yellow-100 dark:bg-yellow-900/50", iconText: "text-yellow-600 dark:text-yellow-400", activeBg: "bg-yellow-50/60 dark:bg-yellow-900/10" },
  4: { border: "border-green-200 dark:border-green-800/60",  iconBg: "bg-green-100 dark:bg-green-900/50",  iconText: "text-green-600 dark:text-green-400",  activeBg: "bg-green-50/60 dark:bg-green-900/10" },
  5: { border: "border-blue-200 dark:border-blue-800/60",   iconBg: "bg-blue-100 dark:bg-blue-900/50",   iconText: "text-blue-600 dark:text-blue-400",   activeBg: "bg-blue-50/60 dark:bg-blue-900/10" },
  6: { border: "border-purple-200 dark:border-purple-800/60", iconBg: "bg-purple-100 dark:bg-purple-900/50", iconText: "text-purple-600 dark:text-purple-400", activeBg: "bg-purple-50/60 dark:bg-purple-900/10" },
  7: { border: "border-indigo-200 dark:border-indigo-800/60", iconBg: "bg-indigo-100 dark:bg-indigo-900/50", iconText: "text-indigo-600 dark:text-indigo-400", activeBg: "bg-indigo-50/60 dark:bg-indigo-900/10" },
};

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
  icon?: LucideIcon;
  children?: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

function Step({ number, title, timeframe, context, dos, donts, isLast, id, highlighted, priorityLabel, icon: Icon, children, isOpen, onToggle }: StepProps) {
  const colors = STEP_COLORS[number] ?? STEP_COLORS[7];
  const isAccordion = isOpen !== undefined && onToggle !== undefined;

  const headerContent = (
    <div className="flex items-center gap-4 w-full text-left">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${colors.iconBg} ${colors.border}`}>
        {Icon ? (
          <Icon className={`w-5 h-5 ${colors.iconText}`} />
        ) : (
          <span className="text-sm font-bold text-foreground">{number}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Step {number}</span>
          <span className="text-xs text-muted-foreground/60">·</span>
          <span className="text-xs text-muted-foreground">{timeframe}</span>
        </div>
        <h2 className="text-base font-bold text-foreground leading-snug">{title}</h2>
      </div>
      {isAccordion && (
        <ChevronDownIcon className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      )}
    </div>
  );

  const bodyContent = (
    <div className={isAccordion ? "px-5 pb-6 pt-1 border-t border-border/50" : ""}>
      <p className="text-muted-foreground mb-5 leading-relaxed text-sm mt-4">{context}</p>

      {(dos.length > 0 || donts.length > 0) && <div className="grid md:grid-cols-2 gap-4">
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
      </div>}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );

  if (isAccordion) {
    return (
      <div id={id} className={`rounded-xl border overflow-hidden transition-all duration-200 ${colors.border} ${isOpen ? colors.activeBg : "bg-background"}`}>
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full p-5 hover:opacity-90 transition-opacity"
        >
          {headerContent}
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: "hidden" }}
            >
              {bodyContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Legacy non-accordion mode (kept for backward compatibility)
  return (
    <div className="relative" id={id}>
      <div className="flex items-start gap-5">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md z-10 transition-all ${
            highlighted
              ? 'bg-blue-600 dark:bg-blue-500 ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-background scale-110'
              : 'bg-slate-700 dark:bg-slate-600'
          }`}>
            {number}
          </div>
          {!isLast && (
            <div className={`w-0.5 flex-1 min-h-[80px] mt-3 ${highlighted ? 'bg-blue-200 dark:bg-blue-800' : 'bg-slate-200 dark:bg-slate-700'}`} />
          )}
        </div>
        <div className="flex-1 pb-10">
          {highlighted && priorityLabel && (
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1.5">↑ {priorityLabel}</p>
          )}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-0.5">
              {Icon && <Icon className={`h-5 w-5 flex-shrink-0 ${highlighted ? 'text-blue-500 dark:text-blue-400' : 'text-muted-foreground'}`} />}
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
            </div>
            <span className="text-xs text-muted-foreground">{timeframe}</span>
          </div>
          <p className="text-muted-foreground mb-5 leading-relaxed text-sm">{context}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-900/10 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-emerald-200 dark:border-emerald-800/60">
                <div className="w-5 h-5 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Do</p>
              </div>
              <ul className="space-y-2.5">{dos.map((item, i) => (<li key={i} className="text-sm text-foreground/80 dark:text-foreground/75 flex items-start gap-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" /><span>{item}</span></li>))}</ul>
            </div>
            <div className="rounded-lg border border-rose-200 dark:border-rose-800/60 bg-rose-50/70 dark:bg-rose-900/10 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-rose-200 dark:border-rose-800/60">
                <div className="w-5 h-5 rounded-full bg-rose-500 dark:bg-rose-600 flex items-center justify-center flex-shrink-0"><X className="w-3 h-3 text-white" strokeWidth={3} /></div>
                <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">Don't</p>
              </div>
              <ul className="space-y-2.5">{donts.map((item, i) => (<li key={i} className="text-sm text-foreground/80 dark:text-foreground/75 flex items-start gap-2.5"><X className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" /><span>{item}</span></li>))}</ul>
            </div>
          </div>
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}

const US_STATES_SIDEBAR = [
  { code: "alabama", label: "Alabama" }, { code: "alaska", label: "Alaska" },
  { code: "arizona", label: "Arizona" }, { code: "arkansas", label: "Arkansas" },
  { code: "california", label: "California" }, { code: "colorado", label: "Colorado" },
  { code: "connecticut", label: "Connecticut" }, { code: "delaware", label: "Delaware" },
  { code: "florida", label: "Florida" }, { code: "georgia", label: "Georgia" },
  { code: "hawaii", label: "Hawaii" }, { code: "idaho", label: "Idaho" },
  { code: "illinois", label: "Illinois" }, { code: "indiana", label: "Indiana" },
  { code: "iowa", label: "Iowa" }, { code: "kansas", label: "Kansas" },
  { code: "kentucky", label: "Kentucky" }, { code: "louisiana", label: "Louisiana" },
  { code: "maine", label: "Maine" }, { code: "maryland", label: "Maryland" },
  { code: "massachusetts", label: "Massachusetts" }, { code: "michigan", label: "Michigan" },
  { code: "minnesota", label: "Minnesota" }, { code: "mississippi", label: "Mississippi" },
  { code: "missouri", label: "Missouri" }, { code: "montana", label: "Montana" },
  { code: "nebraska", label: "Nebraska" }, { code: "nevada", label: "Nevada" },
  { code: "new hampshire", label: "New Hampshire" }, { code: "new jersey", label: "New Jersey" },
  { code: "new mexico", label: "New Mexico" }, { code: "new york", label: "New York" },
  { code: "north carolina", label: "North Carolina" }, { code: "north dakota", label: "North Dakota" },
  { code: "ohio", label: "Ohio" }, { code: "oklahoma", label: "Oklahoma" },
  { code: "oregon", label: "Oregon" }, { code: "pennsylvania", label: "Pennsylvania" },
  { code: "rhode island", label: "Rhode Island" }, { code: "south carolina", label: "South Carolina" },
  { code: "south dakota", label: "South Dakota" }, { code: "tennessee", label: "Tennessee" },
  { code: "texas", label: "Texas" }, { code: "utah", label: "Utah" },
  { code: "vermont", label: "Vermont" }, { code: "virginia", label: "Virginia" },
  { code: "washington", label: "Washington" }, { code: "west virginia", label: "West Virginia" },
  { code: "wisconsin", label: "Wisconsin" }, { code: "wyoming", label: "Wyoming" },
  { code: "district of columbia", label: "Washington D.C." },
];

const STEP_TOC = [
  { n: 0, id: "step-before-arrest", label: "Before Arrest",   Icon: AlertTriangle },
  { n: 1, id: "step-arrest",      label: "Arrest",            Icon: ShieldAlert  },
  { n: 2, id: "step-booking",     label: "Booking",           Icon: ClipboardList },
  { n: 3, id: "phone-call",       label: "Phone Call",        Icon: Phone        },
  { n: 4, id: "step-bail",        label: "Bail",              Icon: Banknote     },
  { n: 5, id: "step-lawyer",      label: "Right to Counsel",  Icon: Scale        },
  { n: 6, id: "step-arraignment", label: "Arraignment",       Icon: Landmark     },
  { n: 7, id: "step-ongoing",     label: "After Arraignment", Icon: CalendarCheck },
];

function ResourcesCard() {
  const resources = [
    {
      Icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50",
      title: "Free Legal Aid",
      desc: "Find a public defender or legal aid organization near you — all 50 states.",
      link: "Browse legal aid →",
      href: "/legal-aid",
    },
    {
      Icon: MapPin,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50",
      title: "Inmate Locator",
      desc: "Locate an arrested person in any county jail or state prison across the US.",
      link: "Use the locator →",
      href: "#phone-call",
    },
    {
      Icon: FileText,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50",
      title: "Print Rights Card",
      desc: "A pocket-sized reference card of your rights during a police encounter.",
      link: "View rights cards →",
      href: "/rights-cards",
    },
    {
      Icon: BookOpen,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50",
      title: "Case Timeline",
      desc: "What happens after arraignment — bail hearings, motions, trial, and sentencing.",
      link: "View timeline →",
      href: "/case-timeline",
    },
  ];

  return (
    <div className="mt-8 rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <h2 className="text-base font-bold text-foreground">Resources &amp; Next Steps</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Everything you need — in one place. No searching required.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {resources.map((r, i) => (
          <Link key={i} href={r.href}>
            <div className={`p-5 flex gap-4 hover:bg-muted/30 transition-colors cursor-pointer group ${i >= 2 ? "border-t border-border/60" : ""} ${i % 2 === 0 && i < 2 ? "sm:border-r border-border/60" : ""} ${i === 2 ? "sm:border-r border-border/60" : ""}`}>
              <div className={`flex-shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center ${r.bg}`}>
                <r.Icon className={`w-4 h-4 ${r.color}`} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{r.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.desc}</p>
                <span className={`inline-flex items-center gap-1 text-xs font-medium mt-2 ${r.color} group-hover:underline`}>
                  {r.link} <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PageSidebar({
  jurisdiction,
  onJurisdictionChange,
  openStepId,
  onOpenStep,
  onOpenJuvenile,
}: {
  jurisdiction: string;
  onJurisdictionChange: (v: string) => void;
  openStepId: number;
  onOpenStep: (n: number) => void;
  onOpenJuvenile: () => void;
}) {
  return (
    <aside className="hidden lg:block w-56 flex-shrink-0" aria-label="Page navigation">
      <div className="sticky top-6 space-y-1">

        {/* State selector */}
        <div className="mb-4 rounded-lg border border-border bg-muted/30 p-3">
          <label htmlFor="sidebar-state-select" className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            <MapPinned className="w-3 h-3" />
            Your State
          </label>
          <select
            id="sidebar-state-select"
            value={jurisdiction || ""}
            onChange={(e) => onJurisdictionChange(e.target.value)}
            className="w-full text-sm rounded-md border border-input bg-background px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="Select your state for state-specific rules"
          >
            <option value="">All states (general)</option>
            {US_STATES_SIDEBAR.map(({ code, label }) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
          {jurisdiction && (
            <button
              onClick={() => onJurisdictionChange("")}
              className="mt-1.5 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Step TOC */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-1">Jump to step</p>
        {STEP_TOC.map(({ n, id, label, Icon }) => {
          const isActive = openStepId === n;
          return (
            <button
              key={id}
              onClick={() => {
                const el = document.getElementById(id);
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 88;
                  window.scrollTo({ top: Math.max(0, top) });
                }
                onOpenStep(n);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 text-sm ${
                isActive
                  ? "bg-primary/10 border border-primary/20 text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
              <span className="truncate flex-1">{label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
            </button>
          );
        })}

        {/* Quick links */}
        <div className="pt-3 mt-3 border-t border-border/60">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-1">Quick help</p>
          <Link href="/legal-aid" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Find a lawyer</span>
          </Link>
          <Link href="/case-guidance" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Get AI guidance</span>
          </Link>
        </div>

        {/* For Friends & Family */}
        <div className="pt-3 mt-1 border-t border-border/60">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-1">For family &amp; friends</p>
          <Link href="/friends-family" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
            <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Full Family Guide</span>
          </Link>
          <button
            onClick={() => document.getElementById("phone-call")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all text-left"
          >
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Inmate Locator</span>
          </button>
        </div>

        {/* Juveniles */}
        <div className="pt-3 mt-1 border-t border-border/60">
          <button
            onClick={onOpenJuvenile}
            className="w-full flex items-center gap-2 px-1 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left"
          >
            <Info className="w-3 h-3 flex-shrink-0" />
            <span>Juveniles</span>
          </button>
        </div>

      </div>
    </aside>
  );
}

export default function FirstTwentyFourHours() {
  useScrollToTop();
  const { t } = useTranslation();
  const [jurisdiction, setJurisdiction] = useState<string>("");
  const [openStepId, setOpenStepId] = useState<number>(1);
  const [juvenileOpen, setJuvenileOpen] = useState(false);

  const toggleStep = (n: number) => setOpenStepId((prev) => (prev === n ? -1 : n));
  const openStep = (n: number) => setOpenStepId(n);
  const openJuvenile = () => {
    setJuvenileOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="vivid-header-alt py-14 md:py-18">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-white">
            {t('first24Hours.title')}
          </h1>
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="h-px w-10 bg-amber-300/50 flex-shrink-0" />
            <p className="text-lg md:text-xl font-semibold tracking-[0.12em] text-amber-200 uppercase">
              {t('first24Hours.tagline')}
            </p>
            <span className="h-px w-10 bg-amber-300/50 flex-shrink-0" />
          </div>
          <p className="text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
            {t('first24Hours.subtitle')}
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="flex gap-12 items-start">
          <PageSidebar
            jurisdiction={jurisdiction}
            onJurisdictionChange={setJurisdiction}
            openStepId={openStepId}
            onOpenStep={openStep}
            onOpenJuvenile={openJuvenile}
          />
          <div className="flex-1 min-w-0">



        {/* Step quick-jump navigator — mobile only; sidebar handles desktop */}
        <div className="lg:hidden">
        <ScrollReveal delay={0.019}>
          <div className="mb-8">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Jump to any step</p>
            <div className="grid grid-cols-8 gap-1.5">
              {([
                { n: 0, id: 'step-before-arrest', label: 'Pre-Arrest', Icon: AlertTriangle },
                { n: 1, id: 'step-arrest',      label: 'Arrest',       Icon: ShieldAlert },
                { n: 2, id: 'step-booking',     label: 'Booking',      Icon: ClipboardList },
                { n: 3, id: 'phone-call',       label: 'Phone Call',   Icon: Phone },
                { n: 4, id: 'step-bail',        label: 'Bail',         Icon: Banknote },
                { n: 5, id: 'step-lawyer',      label: 'Lawyer',       Icon: Scale },
                { n: 6, id: 'step-arraignment', label: 'Arraignment',  Icon: Landmark },
                { n: 7, id: 'step-ongoing',     label: 'Next Steps',   Icon: CalendarCheck },
              ]).map(({ n, id, label, Icon }) => (
                <button
                  key={n}
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg border border-border/60 bg-muted/20 hover:border-primary/40 hover:bg-muted/60 transition-all text-center group"
                >
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-foreground leading-tight hidden sm:block">{label}</span>
                  <span className="text-[10px] font-bold text-muted-foreground sm:hidden">{n}</span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
        </div>{/* end lg:hidden step nav */}



        {/* STEP 0 — Before Arrest */}
        <Step
          number={0}
          id="step-before-arrest"
          icon={AlertTriangle}
          isOpen={openStepId === 0}
          onToggle={() => toggleStep(0)}
          title={t('first24Hours.beforeArrest.heading')}
          timeframe="Optional — if you haven't been arrested yet"
          context={t('first24Hours.beforeArrest.subheading')}
          dos={[]}
          donts={[]}
        >
          <Accordion type="single" collapsible className="w-full space-y-2 mt-1">
            {([
              {
                value: 'police-talk',
                title: t('first24Hours.beforeArrest.policeWantToTalkTitle'),
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
            ] as { value: string; title: string; dos: string[]; donts: string[] }[]).map(({ value, title, dos, donts }) => (
              <AccordionItem key={value} value={value} className="border border-border/70 rounded-lg px-4 bg-background/60">
                <AccordionTrigger className="text-left hover:no-underline py-3">
                  <span className="font-semibold text-sm">{title}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
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
        </Step>

        {/* Section header */}
        <div className="flex items-center gap-4 mb-8 mt-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 whitespace-nowrap">Your 7-Step Guide</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-3">
          {/* STEP 1 */}
            <Step
              number={1}
              id="step-arrest"
              icon={ShieldAlert}
              isOpen={openStepId === 1}
              onToggle={() => toggleStep(1)}
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

          {/* STEP 2 */}
            <Step
              number={2}
              id="step-booking"
              icon={ClipboardList}
              isOpen={openStepId === 2}
              onToggle={() => toggleStep(2)}
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
              <div className="space-y-3 mt-2">
                <div className="rounded-lg bg-muted/40 border border-border/60 p-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('first24Hours.steps.step2.propertyNote')}{' '}
                    <Link href="/support/court-logistics" className="underline underline-offset-2 font-medium hover:text-foreground transition-colors">
                      {t('first24Hours.links.courtLogistics')}
                    </Link>
                  </p>
                </div>
                <JurisdictionCallout jurisdiction={jurisdiction} topic="phone_call" />
              </div>
            </Step>

          {/* STEP 3 — with phone-call anchor */}
            <Step
              number={3}
              id="phone-call"
              icon={Phone}
              isOpen={openStepId === 3}
              onToggle={() => toggleStep(3)}
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

          {/* STEP 4 */}
            <Step
              number={4}
              id="step-bail"
              icon={Banknote}
              isOpen={openStepId === 4}
              onToggle={() => toggleStep(4)}
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

          {/* STEP 5 */}
            <Step
              number={5}
              id="step-lawyer"
              icon={Scale}
              isOpen={openStepId === 5}
              onToggle={() => toggleStep(5)}
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

          {/* STEP 6 */}
            <Step
              number={6}
              id="step-arraignment"
              icon={Landmark}
              isOpen={openStepId === 6}
              onToggle={() => toggleStep(6)}
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

          {/* STEP 7 */}
            <Step
              number={7}
              id="step-ongoing"
              icon={CalendarCheck}
              isOpen={openStepId === 7}
              onToggle={() => toggleStep(7)}
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
            >
              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('first24Hours.steps.step7.supportBridge')}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Link href="/support">
                    <Button variant="outline" size="sm">{t('first24Hours.steps.step7.supportBridgeLink')}</Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
                  {t('first24Hours.steps.step7.twoOneBridge')}
                </p>
              </div>
            </Step>
        </div>

        {/* Friends & Family callout — matches mockup */}
        <div className="mt-8 rounded-xl border border-teal-200 dark:border-teal-800/60 bg-teal-50/60 dark:bg-teal-900/10 overflow-hidden">
          <div className="flex gap-4 p-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/70 border border-teal-200 dark:border-teal-700 flex items-center justify-center">
              <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-teal-800 dark:text-teal-300">{t('first24Hours.familyCallout.title')}</h3>
              <p className="text-sm text-teal-700/80 dark:text-teal-200/80 mt-1">
                {t('first24Hours.familyCallout.task1')}. {t('first24Hours.familyCallout.task2')}.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="#phone-call" onClick={() => openStep(3)}>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-300 dark:border-teal-700 text-sm text-teal-700 dark:text-teal-300 hover:bg-teal-100/60 dark:hover:bg-teal-900/30 transition-colors">
                    <MapPin className="w-3.5 h-3.5" />
                    Inmate locator — all 50 states
                  </button>
                </Link>
                <Link href="/friends-family">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-300 dark:border-teal-700 text-sm text-teal-700 dark:text-teal-300 hover:bg-teal-100/60 dark:hover:bg-teal-900/30 transition-colors">
                    <BookOpen className="w-3.5 h-3.5" />
                    Full friends &amp; family guide
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Resources card */}
        <ResourcesCard />

        {/* Juvenile note — collapsible */}
        <div id="juvenile-note" className={`mt-8 rounded-xl border overflow-hidden transition-all duration-200 border-amber-200 dark:border-amber-800/60 ${juvenileOpen ? "bg-amber-50/60 dark:bg-amber-900/10" : "bg-background"}`}>
          <button
            onClick={() => setJuvenileOpen((v) => !v)}
            aria-expanded={juvenileOpen}
            className="w-full p-5 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-4 w-full text-left">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border bg-amber-100 dark:bg-amber-900/50 border-amber-200 dark:border-amber-700">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-foreground leading-snug">{t('first24Hours.juvenile.title')}</h3>
              </div>
              <ChevronDownIcon className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${juvenileOpen ? "rotate-180" : ""}`} />
            </div>
          </button>
          {juvenileOpen && (
            <div className="px-5 pb-6 pt-1 border-t border-amber-200/60 dark:border-amber-800/40">
              <p className="text-sm text-amber-800/80 dark:text-amber-200/70 mb-4 mt-4 leading-relaxed">{t('first24Hours.juvenile.intro')}</p>
              <ul className="space-y-3">
                {([1, 2, 3, 4, 5] as const).map((n) => (
                  <li key={n} className="flex items-start gap-2.5 text-sm text-amber-800/80 dark:text-amber-200/70">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span>{t(`first24Hours.juvenile.bullet${n}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer nudge */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t('first24Hours.disclaimer')}
        </p>

        {/* DEEP-DIVE ACCORDIONS — hidden but preserved */}
        <div className="hidden" aria-hidden="true"><div className="mt-4 border-t border-border pt-10">
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
          </div></div>{/* end hidden deep-dives */}

          </div>{/* end flex-1 content column */}
        </div>{/* end flex row */}
      </main>

      <Footer />
    </div>
  );
}
