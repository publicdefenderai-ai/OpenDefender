import { useState } from "react";
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
import { useJurisdiction } from "@/hooks/use-jurisdiction";
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
                  ? `${result.state} statewide inmate locator (VINELink)`
                  : `${result.county} inmate locator`}
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
  children?: React.ReactNode;
}

function Step({ number, title, timeframe, context, dos, donts, isLast, id, children }: StepProps) {
  return (
    <div className="relative" id={id}>
      <div className="flex items-start gap-5">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-9 h-9 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md z-10">
            {number}
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 min-h-[80px] mt-3" />
          )}
        </div>

        <div className="flex-1 pb-10">
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
  const { jurisdiction } = useJurisdiction();

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

        <ScrollReveal>
          <Alert className="mb-10 border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              {t('first24Hours.alert')}
            </AlertDescription>
          </Alert>
        </ScrollReveal>

        <ScrollReveal delay={0.02}>
          <JurisdictionSelector label="See state-specific rules for your location (optional)" />
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
              title="At the Moment of Arrest"
              timeframe="Immediately"
              context="Police are detaining you. Your rights exist right now, but they only protect you if you use them."
              dos={[
                'Say clearly: "I am invoking my right to remain silent" and "I want a lawyer."',
                "Comply physically. Do not resist, even if you believe the arrest is unlawful.",
                "Try to remember badge numbers, officer names, and everything that happens.",
              ]}
              donts={[
                'Don\'t try to explain, justify, or "clear things up." Anything you say can be used against you.',
                "Don't consent to any search of your person, vehicle, or home.",
                "Don't argue about whether the arrest is legal. That is your attorney's job.",
              ]}
            >
              <div className="mt-2 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your Fifth Amendment right to remain silent and your Sixth Amendment right to counsel apply from the moment of arrest. You don't need to wait for <LegalTerm term="Miranda rights">Miranda warnings</LegalTerm>. Note that an arrest warrant does not give officers the right to search your home.
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
              title="Booking"
              timeframe="Within a few hours of arrest"
              context="You'll be taken to a police station or jail for processing: fingerprints, photographs, personal property inventoried, and charges entered into the system."
              dos={[
                "Cooperate with the mechanical booking process (fingerprints, photos, property).",
                "Note the name of the facility, your booking number, and the charges. You'll need this information.",
                "Ask how family can find out where you are being held and how to contact you.",
                "If you take medication or have a medical condition, tell booking staff IN WRITING right away and ask to speak to medical staff. Jails are legally required to provide essential medication. Document every request.",
                "You have the right to at least one phone call. Timing varies by state — California sets a 3-hour limit; most other states require 'reasonable time.' Ask booking staff when you can make your call.",
                'If you don\'t speak English fluently, clearly say "I need an interpreter." You have the right to one at no cost.',
                'Invoke your right to remain silent for anything beyond your name and date of birth. Booking intake questions ("where were you tonight?") are interrogation.',
              ]}
              donts={[
                "Don't discuss your case with anyone: other detainees, intake officers, or jail staff.",
                "Don't sign anything you don't understand. You can ask what a form is for.",
                "Don't assume booking staff are neutral. Everything is documented.",
                "Don't answer questions about the incident, your whereabouts, or anyone else involved, even questions that seem routine or unrelated to the crime.",
                "Don't consent to DNA swabs, additional searches, or interrogations beyond the mechanical booking process without asking to speak to your attorney first.",
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
              title="Your First Phone Call"
              timeframe="During or shortly after booking"
              context="You'll typically be allowed at least one phone call. This call is almost certainly being recorded. Every subsequent call is recorded too. Use them wisely."
              dos={[
                "Call a family member or trusted friend — not your attorney (they likely won't answer an unfamiliar collect call).",
                "Give them: (1) the facility name, (2) your booking number, (3) the charges if known, (4) ask them to find a lawyer or contact the public defender's office in the county where you were arrested.",
                "Keep the call short and practical. Longer calls mean more recorded material.",
                "Ask family to write everything down and start finding legal help immediately.",
                "For ongoing calls: stick to practical matters — court dates, commissary, updates on legal counsel, family wellbeing.",
                "Verify with your attorney that their line is registered as an attorney-client call before discussing case details.",
              ]}
              donts={[
                'Don\'t say anything about what happened. Even "I didn\'t do it" can be used against you.',
                "Don't mention alibi information, co-defendants, or anyone else involved. Share that only with your attorney.",
                "Don't ask anyone to destroy, move, or hold onto any item related to the incident.",
                "Don't call the alleged victim, even to apologize or explain.",
                "Don't speak in code. Law enforcement is trained to interpret coded language, and a jury can draw adverse inferences from evasive speech.",
                "Don't assume letters, texts, or emails from jail are any more private than phone calls. They aren't.",
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
              title="Bail Hearing"
              timeframe="Usually within 24–48 hours"
              context="A judge will set the conditions of your release, or deny bail. This is often one of the most important early hearings because it determines whether you go home or stay in custody while your case proceeds."
              dos={[
                "If you have an attorney, have them argue for release on your own recognizance (OR) or lower bail.",
                "Be calm, respectful, and presentable. First impressions matter.",
                "If speaking, mention your ties to the community: family, job, how long you've lived in the area.",
              ]}
              donts={[
                "Don't say anything about the underlying facts of the case at the bail hearing.",
                "Don't waive your right to a bail hearing.",
                "Don't assume bail will be unaffordable. There are options if you can't pay.",
              ]}
            >
              <div className="mt-2">
                <p className="text-sm font-semibold text-foreground mb-3">If you can't afford <LegalTerm term="bail" />, here are your options:</p>
                <ol className="space-y-2.5 text-sm text-foreground/80 dark:text-foreground/75 list-none">
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">1.</span><span><strong>Request OR release</strong> (<LegalTerm term="release on own recognizance" />): ask your attorney to argue you are not a flight risk. No money required. Judge considers ties to community, employment, and family.</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">2.</span><span><strong>Request reduced bail:</strong> your attorney can argue bail is excessive relative to your income. Courts are required to consider your ability to pay.</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">3.</span><span><strong>Bail fund:</strong> nonprofit organizations that pay bail for people who can't afford it. Search "[your city] bail fund" or ask your attorney. Money is typically recycled after your case ends.</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">4.</span><span><strong>Bail bond company:</strong> a bondsman pays your full bail for a non-refundable fee (usually 10–15%). <strong>Warning:</strong> if you miss court, the bondsman can pursue you and take any collateral you pledged.</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">5.</span><span><strong>Property bond:</strong> use home equity as collateral instead of cash. Risk: the court can place a lien on the property if you miss a hearing.</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">6.</span><span><strong>Remain in custody temporarily.</strong> Sometimes the timeline to arraignment is short enough that fighting for release is less critical. Discuss with your attorney.</span></li>
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
              title="Getting Legal Representation"
              timeframe="Before your arraignment"
              context="You have the right to an attorney at every critical stage of your case. If you cannot afford one, a public defender will be appointed. Do not wait. Get this started immediately."
              dos={[
                "If you cannot afford an attorney, formally request a public defender at your first court appearance.",
                "If you can afford an attorney, have family start calling private criminal defense attorneys right away. Many offer emergency consultations.",
                "When you do speak with your attorney, tell them everything. Those conversations are protected by attorney-client privilege.",
              ]}
              donts={[
                "Don't waive your right to counsel. Representing yourself in a criminal case is almost never a good idea.",
                "Don't delay. The earlier an attorney is involved, the more they can do.",
                "Don't make any deals or statements to prosecutors without a lawyer present.",
              ]}
            >
              <div className="flex gap-3 flex-wrap mt-2">
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
            </Step>
          </ScrollReveal>

          {/* STEP 6 */}
          <ScrollReveal delay={0.3}>
            <Step
              number={6}
              title="Arraignment: Your First Court Appearance"
              timeframe="Within 48–72 hours (some states longer)"
              context="You will be formally read the charges against you and asked to enter a plea. This is not the time to fight your case. It is the time to preserve your options."
              dos={[
                'Plead "not guilty" at arraignment, unless your attorney has specifically advised otherwise after reviewing your case.',
                "This preserves every option available to you. You can always change a not-guilty plea later.",
                "Appear in clean, appropriate clothing if you have been released on bail.",
              ]}
              donts={[
                "Don't plead guilty at arraignment. You cannot take it back, and you haven't had time to evaluate the full case.",
                "Don't speak to the judge about the facts of your case.",
                "Don't miss this court date. A warrant will be issued for your arrest.",
              ]}
            >
              <JurisdictionCallout jurisdiction={jurisdiction} topic="arraignment" />
            </Step>
          </ScrollReveal>

          {/* STEP 7 */}
          <ScrollReveal delay={0.35}>
            <Step
              number={7}
              title="Between Now and Your Next Court Date"
              timeframe="Ongoing"
              context="After arraignment, your case enters the pre-trial phase. What you do and don't do during this period matters."
              dos={[
                "Attend every court date without exception. Missing a hearing results in an arrest warrant and forfeiture of any bail.",
                "Follow every condition of your bail or release exactly. Violations result in immediate re-arrest.",
                "Write down everything you remember about the incident as soon as possible while it is fresh.",
                "Communicate with your attorney promptly and honestly.",
              ]}
              donts={[
                "Don't contact any alleged victims or witnesses, even to apologize or explain.",
                "Don't post anything about your case on social media. Prosecutors monitor this.",
                "Don't discuss your case with family or friends. Prosecutors can subpoena them to testify about what you said.",
                "Don't pick up any new charges. Even minor incidents can affect your bail status and case outcome.",
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
                      <strong>Do not answer any questions during this period without an attorney present.</strong> Your invocation of silence must be clear and unambiguous.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">{t('first24Hours.accordion.counselVariationsTitle')}</p>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      {[
                        { state: "California", note: "Police must stop questioning immediately upon any invocation. CA also requires arraignment within 48 hours of arrest (excl. weekends/holidays). Post-Humphrey (2021): courts must consider your ability to pay before setting money bail." },
                        { state: "New York", note: "NY courts interpret the right to counsel broadly. Once you retain or request an attorney, police must contact that attorney before questioning — stronger than federal law." },
                        { state: "Texas", note: "Right to counsel attaches at arraignment. Until then, the Fifth Amendment is your main protection. TX magistration must occur within 48 hours of arrest." },
                        { state: "Florida", note: "First appearance before a magistrate within 24 hours for a first-appearance hearing. Arraignment is typically 21–33 days after filing." },
                        { state: "Federal", note: "Must appear before a magistrate 'without unnecessary delay' — courts interpret this as within 48 hours. Federal rules are strictly applied." },
                      ].map(({ state, note }) => (
                        <div key={state} className="rounded-md border border-border/60 bg-background p-3">
                          <p className="text-xs font-bold text-foreground mb-1">{state}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

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

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">{t('first24Hours.accordion.firstAppearanceVariationsTitle')}</p>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm">
                        {[
                          { state: "California", note: "First appearance typically within 48 hours (excl. weekends/holidays). Post-Humphrey (2021): courts must consider your ability to pay before setting money bail." },
                          { state: "New York", note: "Arraignment serves as first appearance in NY — typically within 24 hours in NYC, 24–48 hours upstate. Bail reform (2020): most misdemeanors and many non-violent felonies are non-bailable." },
                          { state: "Texas", note: "Magistration must occur within 48 hours. A magistrate sets initial bail per statutory factors (Tex. Code Crim. Proc. Art. 17.15)." },
                          { state: "Florida", note: "First appearance before a county judge within 24 hours. Judge must inform you of charges, set bail, and appoint counsel." },
                          { state: "Federal", note: "Initial appearance before a federal magistrate judge 'without unnecessary delay' — courts interpret this as within 48 hours." },
                        ].map(({ state, note }) => (
                          <div key={state} className="rounded-md border border-border/60 bg-background p-3">
                            <p className="text-xs font-bold text-foreground mb-1">{state}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>
                          </div>
                        ))}
                      </div>
                    </div>

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
                <span>This guide provides general information only and does not constitute legal advice. Laws and procedures vary by state and jurisdiction. Always consult a licensed attorney about your specific situation.</span>
              </div>
            </AlertDescription>
          </Alert>
        </ScrollReveal>

      </main>

      <Footer />
    </div>
  );
}
