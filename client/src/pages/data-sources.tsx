import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { ExternalLink, Info, Mail, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import {
  DATA_SOURCE_CONFIDENCE,
  DATA_SOURCE_FACTS,
  DATA_SOURCE_IDS,
  DATA_SOURCE_LINKS,
  SOURCE_EVIDENCE,
  type DataSourceId,
  type SourceConfidence,
} from "@/lib/data-source-inventory";

const formatNumber = (value: number, language: string) =>
  new Intl.NumberFormat(language === "zh" ? "zh-CN" : language).format(value);

const confidenceClasses: Record<SourceConfidence, string> = {
  primary: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  secondary: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
  synthesized: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  availability: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200",
  conditional: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200",
  mixed: "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-200",
};

type CoverageKey =
  | "federalStatutes" | "charges" | "explanations" | "procedure" | "collateral"
  | "rights" | "expungement" | "diversion" | "legalAid" | "glossary"
  | "courtServices" | "statuteLinks" | "detention" | "consulates"
  | "publicResources" | "juryInstructions" | "validation" | "statistics" | "ai";

const coverageKeys: Record<DataSourceId, CoverageKey> = {
  federalStatutes: "federalStatutes", charges: "charges", explanations: "explanations",
  procedure: "procedure", collateral: "collateral", rights: "rights",
  expungement: "expungement", diversion: "diversion", legalAid: "legalAid",
  glossary: "glossary", courtServices: "courtServices", statuteLinks: "statuteLinks",
  detention: "detention", consulates: "consulates", publicResources: "publicResources",
  juryInstructions: "juryInstructions", validation: "validation", ai: "ai",
  statistics: "statistics",
};

const detailIds: Record<DataSourceId, string> = {
  federalStatutes: "federal-statutes", charges: "criminal-charges", explanations: "charge-explanations",
  procedure: "procedure-rules", collateral: "collateral-consequences", rights: "constitutional-rights",
  expungement: "expungement", diversion: "diversion", legalAid: "legal-aid",
  glossary: "glossary", courtServices: "court-services", statuteLinks: "statute-links",
  detention: "detention", consulates: "consulates", publicResources: "public-resources",
  juryInstructions: "jury-instructions", validation: "validation-apis", ai: "ai-guidance",
  statistics: "statistics",
};

function SourceCard({ id, t, language }: { id: DataSourceId; t: (key: string, options?: Record<string, unknown>) => string; language: string }) {
  const confidence = DATA_SOURCE_CONFIDENCE[id];
  const facts = DATA_SOURCE_FACTS;
  const evidence = SOURCE_EVIDENCE[id];
  const count = (key: CoverageKey): string => {
    switch (key) {
      case "federalStatutes": return formatNumber(facts.federalStatutes, language);
      case "charges": return `${formatNumber(facts.charges, language)} · ${formatNumber(facts.chargeTiers.felony, language)} / ${formatNumber(facts.chargeTiers.misdemeanor, language)} / ${formatNumber(facts.chargeTiers.infraction, language)}`;
      case "explanations": return `${formatNumber(facts.chargeExplanationsWithSources, language)} of ${formatNumber(facts.chargeExplanations, language)}`;
      case "procedure": return `${formatNumber(facts.procedureJurisdictions, language)} / ${formatNumber(facts.procedureMediumConfidence, language)}`;
      case "collateral": return `${formatNumber(facts.collateralJurisdictions, language)} / ${formatNumber(facts.driversLicenseJurisdictions, language)} / ${formatNumber(facts.immigrationJurisdictions, language)} / ${formatNumber(facts.sexOffenderJurisdictions, language)}`;
      case "rights": return "N/A";
      case "expungement": return formatNumber(facts.expungementJurisdictions, language);
      case "diversion": return `${formatNumber(facts.diversionPrograms, language)} / ${formatNumber(facts.activeDiversionPrograms, language)}`;
      case "legalAid": return `${formatNumber(facts.legalAidOrganizations, language)} / ${formatNumber(facts.legalAidJurisdictions, language)}`;
      case "glossary": return formatNumber(facts.glossaryTerms, language);
      case "courtServices": return formatNumber(facts.courtServices, language);
      case "statuteLinks": return formatNumber(facts.statuteLinkJurisdictions, language);
      case "detention": return `${formatNumber(facts.detentionFacilities, language)} / ${formatNumber(facts.detentionStates, language)}`;
      case "consulates": return formatNumber(facts.consulates, language);
      case "publicResources": return "N/A";
      case "juryInstructions": return "N/A";
      case "validation": return "3";
      case "statistics": return "N/A";
      case "ai": return "1";
    }
  };

  return (
    <article id={detailIds[id]} className="scroll-mt-24 rounded-2xl border border-border bg-card shadow-sm">
      <Card className="border-0 shadow-none">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">{t(`home.dataSources.transparency.items.${id}.title`)}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{t(`home.dataSources.transparency.items.${id}.summary`)}</p>
            </div>
            <Badge className={`w-fit shrink-0 border ${confidenceClasses[confidence]}`}>
              {t(`home.dataSources.transparency.confidence.${confidence}`)}
            </Badge>
          </div>

          <dl className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">{t("home.dataSources.transparency.labels.coverage")}</dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{t(`home.dataSources.transparency.coverage.${coverageKeys[id]}`, { count: count(coverageKeys[id]) })}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">{t("home.dataSources.transparency.labels.freshness")}</dt>
              <dd className="mt-1 text-sm text-foreground">{t(`home.dataSources.transparency.items.${id}.freshness`)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">{t("home.dataSources.transparency.labels.sourcePath")}</dt>
              <dd className="mt-1">
                <a href={DATA_SOURCE_LINKS[id]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {t("home.dataSources.transparency.openSource")} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">{t("home.dataSources.transparency.opensNewTab")}</span>
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-4 rounded-xl bg-muted/50 px-4 py-3">
            <p className="text-sm leading-6 text-muted-foreground">
              <span className="font-semibold text-foreground">{t("home.dataSources.transparency.labels.limitation")}: </span>
              {t(`home.dataSources.transparency.items.${id}.limitation`)}
            </p>
          </div>
          <div className="mt-4 grid gap-4 border-t border-border pt-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">{t("home.dataSources.transparency.labels.sourceType")}</p>
              <p className="mt-1 text-foreground">{t(`home.dataSources.transparency.sourceTypes.${evidence.sourceType}`)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">{t("home.dataSources.transparency.labels.sources")}</p>
              <p className="mt-1 leading-5 text-foreground">{evidence.sources.join(" · ")}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">{t("home.dataSources.transparency.labels.citations")}</p>
              <p className="mt-1 leading-5 text-foreground">{evidence.citations.join(" · ")}</p>
            </div>
          </div>
          {id === "ai" && (
            <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-3 dark:border-violet-900 dark:bg-violet-950/20">
              <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-violet-800 dark:text-violet-200">{t("home.dataSources.transparency.labels.providerDisclosure")}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{t(`home.dataSources.transparency.items.${id}.evidence`)}</p>
            </div>
          )}
          <details className="mt-3 group">
            <summary className="cursor-pointer list-none text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">{t("home.dataSources.transparency.showEvidence")}</span>
              <span className="hidden group-open:inline">{t("home.dataSources.transparency.hideEvidence")}</span>
            </summary>
            <p className="mt-3 border-l-2 border-primary/30 pl-4 text-sm leading-6 text-muted-foreground">{t(`home.dataSources.transparency.items.${id}.evidence`)}</p>
          </details>
        </CardContent>
      </Card>
    </article>
  );
}

export default function DataSources() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const language = i18n.language?.startsWith("zh") ? "zh" : i18n.language?.startsWith("es") ? "es" : "en";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t("home.dataSources.transparency.eyebrow")}</p>
            <div className="mt-3 max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">{t("home.dataSources.transparency.heading")}</h1>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">{t("home.dataSources.transparency.intro")}</p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Info className="h-4 w-4 text-primary" aria-hidden="true" />{t("home.dataSources.transparency.reviewed")}</span>
              <span className="hidden text-border sm:inline" aria-hidden="true">|</span>
              <span>{t("home.dataSources.transparency.disclaimer")}</span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
          <aside className="editorial-card border-amber-300/70 bg-amber-50/70 p-5 dark:border-amber-900 dark:bg-amber-950/20" aria-labelledby="limitations-heading">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
              <div>
                <h2 id="limitations-heading" className="font-semibold text-foreground">{t("home.dataSources.transparency.limitationsHeading")}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.limitationsIntro")}</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground md:grid-cols-2">
                  {(t("home.dataSources.transparency.limitations", { returnObjects: true }) as unknown as string[]).map((item, index) => <li key={index} className="flex gap-2"><span className="text-amber-700 dark:text-amber-300">•</span><span>{item}</span></li>)}
                </ul>
              </div>
            </div>
          </aside>

          <section
            id="new-york-charge-sources"
            className="mt-10 scroll-mt-24"
            aria-labelledby="new-york-charge-sources-heading"
          >
            <Card className="border-indigo-200/80 bg-indigo-50/40 dark:border-indigo-900 dark:bg-indigo-950/20">
              <CardContent className="p-6 sm:p-7">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-indigo-700 dark:text-indigo-300" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">
                      {t("home.dataSources.transparency.nySources.eyebrow")}
                    </p>
                    <h2 id="new-york-charge-sources-heading" className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                      {t("home.dataSources.transparency.nySources.title")}
                    </h2>
                    <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground sm:text-base">
                      {t("home.dataSources.transparency.nySources.intro")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {([
                    "authority",
                    "failClosed",
                    "catalog",
                    "review",
                  ] as const).map((key) => (
                    <div key={key} className="rounded-xl border border-indigo-200/70 bg-background/80 p-4 dark:border-indigo-900/70">
                      <h3 className="font-semibold text-foreground">
                        {t(`home.dataSources.transparency.nySources.${key}Title`)}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {t(`home.dataSources.transparency.nySources.${key}Body`)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-indigo-200/70 pt-5 dark:border-indigo-900/70">
                  <h3 className="font-semibold text-foreground">
                    {t("home.dataSources.transparency.nySources.linksTitle")}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {t("home.dataSources.transparency.nySources.linksIntro")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                    <a
                      href="https://legislation.nysenate.gov/api/3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t("home.dataSources.transparency.nySources.apiLink")}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">{t("home.dataSources.transparency.opensNewTab")}</span>
                    </a>
                    <a
                      href="https://www.nysenate.gov/legislation/laws/PEN/125.25"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t("home.dataSources.transparency.nySources.officialLink")}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">{t("home.dataSources.transparency.opensNewTab")}</span>
                    </a>
                    <a
                      href="#criminal-charges"
                      className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t("home.dataSources.transparency.nySources.inventoryLink")}
                    </a>
                    <a
                      href="#statute-links"
                      className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t("home.dataSources.transparency.nySources.statuteLink")}
                    </a>
                    <Link
                      href="/disclaimers"
                      className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t("home.dataSources.transparency.nySources.disclaimerLink")}
                    </Link>
                  </div>
                   <div className="mt-5 rounded-xl border border-indigo-200/70 bg-background/80 p-4 dark:border-indigo-900/70">
                     <h3 className="font-semibold text-foreground">
                       {t("home.dataSources.transparency.nySources.chargeLookupTitle")}
                     </h3>
                     <p className="mt-2 text-sm leading-6 text-muted-foreground">
                       {t("home.dataSources.transparency.nySources.chargeLookupBody")}
                     </p>
                     <p className="mt-3 break-all rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs text-foreground">
                       /api/criminal-charges/:chargeId/sources
                     </p>
                   </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section
            id="texas-charge-sources"
            className="mt-10 scroll-mt-24"
            aria-labelledby="texas-charge-sources-heading"
          >
            <Card className="border-teal-200/80 bg-teal-50/40 dark:border-teal-900 dark:bg-teal-950/20">
              <CardContent className="p-6 sm:p-7">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                      {t("home.dataSources.transparency.txSources.eyebrow")}
                    </p>
                    <h2 id="texas-charge-sources-heading" className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                      {t("home.dataSources.transparency.txSources.title")}
                    </h2>
                    <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground sm:text-base">
                      {t("home.dataSources.transparency.txSources.intro")}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {(["authority", "failClosed", "catalog", "review"] as const).map((key) => (
                    <div key={key} className="rounded-xl border border-teal-200/70 bg-background/80 p-4 dark:border-teal-900/70">
                      <h3 className="font-semibold text-foreground">
                        {t(`home.dataSources.transparency.txSources.${key}Title`)}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {t(`home.dataSources.transparency.txSources.${key}Body`)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-teal-200/70 pt-5 dark:border-teal-900/70">
                  <h3 className="font-semibold text-foreground">
                    {t("home.dataSources.transparency.txSources.linksTitle")}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {t("home.dataSources.transparency.txSources.linksIntro")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                    <a
                      href="https://tcss.legis.texas.gov/resources/PE/htm/PE.22.htm#22.02"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t("home.dataSources.transparency.txSources.officialLink")}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">{t("home.dataSources.transparency.opensNewTab")}</span>
                    </a>
                    <a href="#criminal-charges" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">
                      {t("home.dataSources.transparency.txSources.inventoryLink")}
                    </a>
                    <a href="#statute-links" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">
                      {t("home.dataSources.transparency.txSources.statuteLink")}
                    </a>
                    <Link href="/disclaimers" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">
                      {t("home.dataSources.transparency.txSources.disclaimerLink")}
                    </Link>
                  </div>
                  <div className="mt-5 rounded-xl border border-teal-200/70 bg-background/80 p-4 dark:border-teal-900/70">
                    <h3 className="font-semibold text-foreground">
                      {t("home.dataSources.transparency.txSources.chargeLookupTitle")}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {t("home.dataSources.transparency.txSources.chargeLookupBody")}
                    </p>
                    <p className="mt-3 break-all rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs text-foreground">
                      /api/criminal-charges/:chargeId/sources
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section
            id="florida-charge-sources"
            className="mt-10 scroll-mt-24"
            aria-labelledby="florida-charge-sources-heading"
          >
            <Card className="border-rose-200/80 bg-rose-50/40 dark:border-rose-900 dark:bg-rose-950/20">
              <CardContent className="p-6 sm:p-7">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-rose-700 dark:text-rose-300" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">
                      {t("home.dataSources.transparency.flSources.eyebrow")}
                    </p>
                    <h2 id="florida-charge-sources-heading" className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                      {t("home.dataSources.transparency.flSources.title")}
                    </h2>
                    <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground sm:text-base">
                      {t("home.dataSources.transparency.flSources.intro")}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {(["authority", "failClosed", "catalog", "review"] as const).map((key) => (
                    <div key={key} className="rounded-xl border border-rose-200/70 bg-background/80 p-4 dark:border-rose-900/70">
                      <h3 className="font-semibold text-foreground">{t(`home.dataSources.transparency.flSources.${key}Title`)}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(`home.dataSources.transparency.flSources.${key}Body`)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-rose-200/70 pt-5 dark:border-rose-900/70">
                  <h3 className="font-semibold text-foreground">{t("home.dataSources.transparency.flSources.linksTitle")}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.flSources.linksIntro")}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                    <a href="https://www.leg.state.fl.us/statutes/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {t("home.dataSources.transparency.flSources.officialLink")}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">{t("home.dataSources.transparency.opensNewTab")}</span>
                    </a>
                    <a href="#criminal-charges" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.flSources.inventoryLink")}</a>
                    <a href="#statute-links" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.flSources.statuteLink")}</a>
                    <Link href="/disclaimers" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.flSources.disclaimerLink")}</Link>
                  </div>
                  <div className="mt-5 rounded-xl border border-rose-200/70 bg-background/80 p-4 dark:border-rose-900/70">
                    <h3 className="font-semibold text-foreground">{t("home.dataSources.transparency.flSources.chargeLookupTitle")}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.flSources.chargeLookupBody")}</p>
                    <p className="mt-3 break-all rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs text-foreground">/api/criminal-charges/:chargeId/sources</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section
            id="south-carolina-charge-sources"
            className="mt-10 scroll-mt-24"
            aria-labelledby="south-carolina-charge-sources-heading"
          >
            <Card className="border-amber-200/80 bg-amber-50/40 dark:border-amber-900 dark:bg-amber-950/20">
              <CardContent className="p-6 sm:p-7">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                      {t("home.dataSources.transparency.scSources.eyebrow")}
                    </p>
                    <h2 id="south-carolina-charge-sources-heading" className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                      {t("home.dataSources.transparency.scSources.title")}
                    </h2>
                    <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground sm:text-base">
                      {t("home.dataSources.transparency.scSources.intro")}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {(["authority", "failClosed", "catalog", "review"] as const).map((key) => (
                    <div key={key} className="rounded-xl border border-amber-200/70 bg-background/80 p-4 dark:border-amber-900/70">
                      <h3 className="font-semibold text-foreground">{t(`home.dataSources.transparency.scSources.${key}Title`)}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(`home.dataSources.transparency.scSources.${key}Body`)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-amber-200/70 pt-5 dark:border-amber-900/70">
                  <h3 className="font-semibold text-foreground">{t("home.dataSources.transparency.scSources.linksTitle")}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.scSources.linksIntro")}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                    <a href="https://www.scstatehouse.gov/code/statmast.php" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {t("home.dataSources.transparency.scSources.officialLink")}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">{t("home.dataSources.transparency.opensNewTab")}</span>
                    </a>
                    <a href="#criminal-charges" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.scSources.inventoryLink")}</a>
                    <a href="#statute-links" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.scSources.statuteLink")}</a>
                    <Link href="/disclaimers" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.scSources.disclaimerLink")}</Link>
                  </div>
                  <div className="mt-5 rounded-xl border border-amber-200/70 bg-background/80 p-4 dark:border-amber-900/70">
                    <h3 className="font-semibold text-foreground">{t("home.dataSources.transparency.scSources.chargeLookupTitle")}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.scSources.chargeLookupBody")}</p>
                    <p className="mt-3 break-all rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs text-foreground">/api/criminal-charges/:chargeId/sources</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section
            id="illinois-charge-sources"
            className="mt-10 scroll-mt-24"
            aria-labelledby="illinois-charge-sources-heading"
          >
            <Card className="border-blue-200/80 bg-blue-50/40 dark:border-blue-900 dark:bg-blue-950/20">
              <CardContent className="p-6 sm:p-7">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">
                      {t("home.dataSources.transparency.ilSources.eyebrow")}
                    </p>
                    <h2 id="illinois-charge-sources-heading" className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                      {t("home.dataSources.transparency.ilSources.title")}
                    </h2>
                    <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground sm:text-base">
                      {t("home.dataSources.transparency.ilSources.intro")}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {(["authority", "failClosed", "catalog", "review"] as const).map((key) => (
                    <div key={key} className="rounded-xl border border-blue-200/70 bg-background/80 p-4 dark:border-blue-900/70">
                      <h3 className="font-semibold text-foreground">{t(`home.dataSources.transparency.ilSources.${key}Title`)}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(`home.dataSources.transparency.ilSources.${key}Body`)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-blue-200/70 pt-5 dark:border-blue-900/70">
                  <h3 className="font-semibold text-foreground">{t("home.dataSources.transparency.ilSources.linksTitle")}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.ilSources.linksIntro")}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                    <a href="https://www.ilga.gov/legislation/ilcs/ilcs.asp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {t("home.dataSources.transparency.ilSources.officialLink")}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">{t("home.dataSources.transparency.opensNewTab")}</span>
                    </a>
                    <a href="#criminal-charges" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.ilSources.inventoryLink")}</a>
                    <a href="#statute-links" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.ilSources.statuteLink")}</a>
                    <Link href="/disclaimers" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.ilSources.disclaimerLink")}</Link>
                  </div>
                  <div className="mt-5 rounded-xl border border-blue-200/70 bg-background/80 p-4 dark:border-blue-900/70">
                    <h3 className="font-semibold text-foreground">{t("home.dataSources.transparency.ilSources.chargeLookupTitle")}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.ilSources.chargeLookupBody")}</p>
                    <p className="mt-3 break-all rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs text-foreground">/api/criminal-charges/:chargeId/sources</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section
            id="ohio-charge-sources"
            className="mt-10 scroll-mt-24"
            aria-labelledby="ohio-charge-sources-heading"
          >
            <Card className="border-sky-200/80 bg-sky-50/40 dark:border-sky-900 dark:bg-sky-950/20">
              <CardContent className="p-6 sm:p-7">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
                      {t("home.dataSources.transparency.ohSources.eyebrow")}
                    </p>
                    <h2 id="ohio-charge-sources-heading" className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                      {t("home.dataSources.transparency.ohSources.title")}
                    </h2>
                    <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground sm:text-base">
                      {t("home.dataSources.transparency.ohSources.intro")}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {(["authority", "failClosed", "catalog", "review"] as const).map((key) => (
                    <div key={key} className="rounded-xl border border-sky-200/70 bg-background/80 p-4 dark:border-sky-900/70">
                      <h3 className="font-semibold text-foreground">{t(`home.dataSources.transparency.ohSources.${key}Title`)}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(`home.dataSources.transparency.ohSources.${key}Body`)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-sky-200/70 pt-5 dark:border-sky-900/70">
                  <h3 className="font-semibold text-foreground">{t("home.dataSources.transparency.ohSources.linksTitle")}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.ohSources.linksIntro")}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                    <a href="https://codes.ohio.gov/ohio-revised-code" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {t("home.dataSources.transparency.ohSources.officialLink")}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">{t("home.dataSources.transparency.opensNewTab")}</span>
                    </a>
                    <a href="#criminal-charges" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.ohSources.inventoryLink")}</a>
                    <a href="#statute-links" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.ohSources.statuteLink")}</a>
                    <Link href="/disclaimers" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.ohSources.disclaimerLink")}</Link>
                  </div>
                  <div className="mt-5 rounded-xl border border-sky-200/70 bg-background/80 p-4 dark:border-sky-900/70">
                    <h3 className="font-semibold text-foreground">{t("home.dataSources.transparency.ohSources.chargeLookupTitle")}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.ohSources.chargeLookupBody")}</p>
                    <p className="mt-3 break-all rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs text-foreground">/api/criminal-charges/:chargeId/sources</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section
            id="georgia-charge-sources"
            className="mt-10 scroll-mt-24"
            aria-labelledby="georgia-charge-sources-heading"
          >
            <Card className="border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20">
              <CardContent className="p-6 sm:p-7">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                      {t("home.dataSources.transparency.gaSources.eyebrow")}
                    </p>
                    <h2 id="georgia-charge-sources-heading" className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                      {t("home.dataSources.transparency.gaSources.title")}
                    </h2>
                    <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground sm:text-base">
                      {t("home.dataSources.transparency.gaSources.intro")}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {(["authority", "failClosed", "catalog", "review"] as const).map((key) => (
                    <div key={key} className="rounded-xl border border-emerald-200/70 bg-background/80 p-4 dark:border-emerald-900/70">
                      <h3 className="font-semibold text-foreground">{t(`home.dataSources.transparency.gaSources.${key}Title`)}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(`home.dataSources.transparency.gaSources.${key}Body`)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-emerald-200/70 pt-5 dark:border-emerald-900/70">
                  <h3 className="font-semibold text-foreground">{t("home.dataSources.transparency.gaSources.linksTitle")}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.gaSources.linksIntro")}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                    <a href="https://www.legis.ga.gov/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {t("home.dataSources.transparency.gaSources.officialLink")}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">{t("home.dataSources.transparency.opensNewTab")}</span>
                    </a>
                    <a href="#criminal-charges" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.gaSources.inventoryLink")}</a>
                    <a href="#statute-links" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.gaSources.statuteLink")}</a>
                    <Link href="/disclaimers" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.gaSources.disclaimerLink")}</Link>
                  </div>
                  <div className="mt-5 rounded-xl border border-emerald-200/70 bg-background/80 p-4 dark:border-emerald-900/70">
                    <h3 className="font-semibold text-foreground">{t("home.dataSources.transparency.gaSources.chargeLookupTitle")}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.gaSources.chargeLookupBody")}</p>
                    <p className="mt-3 break-all rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs text-foreground">/api/criminal-charges/:chargeId/sources</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section
            id="pennsylvania-charge-sources"
            className="mt-10 scroll-mt-24"
            aria-labelledby="pennsylvania-charge-sources-heading"
          >
            <Card className="border-indigo-200/80 bg-indigo-50/40 dark:border-indigo-900 dark:bg-indigo-950/20">
              <CardContent className="p-6 sm:p-7">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-indigo-700 dark:text-indigo-300" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">
                      {t("home.dataSources.transparency.paSources.eyebrow")}
                    </p>
                    <h2 id="pennsylvania-charge-sources-heading" className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                      {t("home.dataSources.transparency.paSources.title")}
                    </h2>
                    <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground sm:text-base">
                      {t("home.dataSources.transparency.paSources.intro")}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {(["authority", "failClosed", "catalog", "review"] as const).map((key) => (
                    <div key={key} className="rounded-xl border border-indigo-200/70 bg-background/80 p-4 dark:border-indigo-900/70">
                      <h3 className="font-semibold text-foreground">{t(`home.dataSources.transparency.paSources.${key}Title`)}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(`home.dataSources.transparency.paSources.${key}Body`)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-indigo-200/70 pt-5 dark:border-indigo-900/70">
                  <h3 className="font-semibold text-foreground">{t("home.dataSources.transparency.paSources.linksTitle")}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.paSources.linksIntro")}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                    <a href="https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=18&div=0&chpt=25&sctn=2&subsctn=0" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {t("home.dataSources.transparency.paSources.officialLink")}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">{t("home.dataSources.transparency.opensNewTab")}</span>
                    </a>
                    <a href="#criminal-charges" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.paSources.inventoryLink")}</a>
                    <a href="#statute-links" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.paSources.statuteLink")}</a>
                    <Link href="/disclaimers" className="font-semibold text-primary underline-offset-4 hover:bg-muted hover:underline">{t("home.dataSources.transparency.paSources.disclaimerLink")}</Link>
                  </div>
                  <div className="mt-5 rounded-xl border border-indigo-200/70 bg-background/80 p-4 dark:border-indigo-900/70">
                    <h3 className="font-semibold text-foreground">{t("home.dataSources.transparency.paSources.chargeLookupTitle")}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.paSources.chargeLookupBody")}</p>
                    <p className="mt-3 break-all rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs text-foreground">/api/criminal-charges/:chargeId/sources</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-10" aria-labelledby="legend-heading">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="legend-heading" className="text-2xl font-bold tracking-tight text-foreground">{t("home.dataSources.transparency.legendHeading")}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.legendIntro")}</p>
              </div>
              <a href="#inventory" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">{t("home.dataSources.transparency.skipToInventory")}</a>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(["primary", "secondary", "synthesized", "availability", "conditional", "mixed"] as SourceConfidence[]).map((key) => (
                <div key={key} className={`rounded-xl border px-4 py-3 ${confidenceClasses[key]}`}>
                  <p className="text-sm font-semibold">{t(`home.dataSources.transparency.confidence.${key}`)}</p>
                  <p className="mt-1 text-xs leading-5 opacity-85">{t(`home.dataSources.transparency.confidenceDescription.${key}`)}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="inventory" className="mt-12 scroll-mt-24" aria-labelledby="inventory-heading">
            <div className="max-w-3xl">
              <h2 id="inventory-heading" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t("home.dataSources.transparency.inventoryHeading")}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.inventoryIntro")}</p>
            </div>
            <nav aria-label={t("home.dataSources.transparency.topicNavigation")} className="editorial-surface mt-6 rounded-2xl p-4">
              <div className="grid gap-x-5 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {DATA_SOURCE_IDS.map((id) => <a key={id} href={`#${detailIds[id]}`} className="rounded-lg px-2 py-1.5 text-sm font-medium text-primary underline-offset-4 hover:bg-muted hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{t(`home.dataSources.transparency.items.${id}.title`)}</a>)}
              </div>
            </nav>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {DATA_SOURCE_IDS.map((id) => <SourceCard key={id} id={id} t={t} language={language} />)}
            </div>
          </section>

          <section className="mt-12 grid gap-5 lg:grid-cols-2" aria-label={t("home.dataSources.transparency.additionalInformation")}>
            <Card className="editorial-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground">{t("home.dataSources.transparency.outOfScopeHeading")}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.outOfScopeIntro")}</p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                  {(t("home.dataSources.transparency.outOfScope", { returnObjects: true }) as unknown as string[]).map((item, index) => <li key={index} className="flex gap-2"><span className="text-primary">•</span><span>{item}</span></li>)}
                </ul>
              </CardContent>
            </Card>
            <Card id="report-error" className="editorial-card scroll-mt-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground">{t("home.dataSources.transparency.reportHeading")}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("home.dataSources.transparency.reportBody")}</p>
                <a href="mailto:legal-data@opendefender.io" className="mt-4 inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Mail className="h-4 w-4" aria-hidden="true" /> legal-data@opendefender.io
                </a>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}