import "./diversion-programs.css";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { diversionPrograms, searchDiversionPrograms, searchDiversionProgramsExpanded, getAvailableStates, type ExpandedSearchResult } from "@/lib/diversion-programs-data";
import { DiversionProgramCard } from "@/components/legal/diversion-program-card";

function normalizeProgramContact(contact: unknown) {
  if (!contact || typeof contact !== "object") return undefined;

  const value = contact as Record<string, unknown>;
  return {
    phone: typeof value.phone === "string" ? value.phone : undefined,
    email: typeof value.email === "string" ? value.email : undefined,
    url: typeof value.url === "string" ? value.url : undefined,
  };
}

export default function DiversionPrograms() {
  useScrollToTop();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedProgramType, setSelectedProgramType] = useState("");
  const query = searchQuery.trim();
  const isZip = /^\d{5}$/.test(query);
  const [zipResult, setZipResult] = useState<ExpandedSearchResult | null>(null);

  useEffect(() => {
    if (!isZip) return;
    let active = true;
    const timer = window.setTimeout(async () => {
      const result = await searchDiversionProgramsExpanded(query);
      if (active) setZipResult({ ...result, searchedZipCode: query });
    }, 500);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, isZip]);

  const currentZip = isZip && zipResult?.searchedZipCode === query ? zipResult : null;
  const searching = isZip && !currentZip;
  const hasFilters = Boolean(query || selectedState || selectedProgramType);
  const availableTypes = useMemo(() => Array.from(new Set(diversionPrograms.flatMap(program => program.programTypes))).sort(), []);
  const programs = useMemo(() => {
    if (!hasFilters || searching) return [];
    const matches = currentZip?.programs ?? searchDiversionPrograms(query);
    return matches.filter(program =>
      (!selectedState || program.state === selectedState) &&
      (!selectedProgramType || program.programTypes.includes(selectedProgramType))
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [hasFilters, searching, currentZip, query, selectedState, selectedProgramType]);

  function clearFilters() {
    setSearchQuery("");
    setSelectedState("");
    setSelectedProgramType("");
    setZipResult(null);
  }

  return (
    <ScanFirstPageFrame>
      <PageBreadcrumb items={[{ label: t("breadcrumb.home"), href: "/" }]} currentPage={t("diversionPrograms.hero.title")} />
      <div className="diversion-directory">
        <header>
          <h1>{t("diversionPrograms.directory.title")} <span>{t("diversionPrograms.directory.accent")}</span></h1>
          <p>{t("diversionPrograms.directory.intro")}</p>
        </header>
        <div className="diversion-filters">
          <label>{t("diversionPrograms.directory.location")}
            <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} data-testid="input-location-search" />
          </label>
          <div className="diversion-filter-row">
            <label>{t("diversionPrograms.search.filterByState")}
              <select value={selectedState} onChange={e => setSelectedState(e.target.value)} data-testid="select-state-filter">
                <option value="">{t("diversionPrograms.search.allStates")}</option>
                {getAvailableStates().map(state => <option key={state} value={state}>{state === "Federal" ? t("diversionPrograms.search.federalPrograms") : state}</option>)}
              </select>
            </label>
            <label>{t("diversionPrograms.search.filterByProgramType")}
              <select value={selectedProgramType} onChange={e => setSelectedProgramType(e.target.value)} data-testid="select-program-type-filter">
                <option value="">{t("diversionPrograms.search.allProgramTypes")}</option>
                {availableTypes.map(type => <option key={type} lang="en">{type}</option>)}
              </select>
            </label>
            <button type="button" disabled={!hasFilters} onClick={clearFilters} data-testid="button-clear-filters">{t("diversionPrograms.search.clearAllFilters")}</button>
          </div>
        </div>
        <div role="status" className="diversion-count">
          {searching ? t("diversionPrograms.search.searching") : t(hasFilters ? "diversionPrograms.navigation.programsCount" : "diversionPrograms.navigation.totalPrograms", { count: programs.length, total: diversionPrograms.length })}
          {currentZip?.expandedToState && <p>{t("diversionPrograms.expandedSearch.message", { zipCode: query, state: currentZip.expandedToState, count: currentZip.programs.length })}</p>}
        </div>
        {!searching && !programs.length && <section className="diversion-empty">
          <h2>{t(hasFilters ? "diversionPrograms.emptyState.title" : "diversionPrograms.initialState.title")}</h2>
          <p>{t(hasFilters ? "diversionPrograms.emptyState.description" : "diversionPrograms.initialState.description")}</p>
        </section>}
        {programs.map(program => <DiversionProgramCard key={program.id} program={{
          ...program, county: program.county ?? undefined, cities: program.cities ?? undefined,
          eligibilityNotes: program.eligibilityNotes ?? undefined, contact: normalizeProgramContact(program.contact),
        }} />)}
        <p className="diversion-notice">{t("diversionPrograms.directory.notice")}</p>
        <nav aria-label={t("diversionPrograms.directory.related")}>
          <Link href="/case-guidance">{t("diversionPrograms.quickNav.legalGuidanceButton")}</Link>
          <Link href="/support/reputation/eligibility">{t("diversionPrograms.quickNav.recordClearingTitle")}</Link>
          <a href="https://diversion.ndaa.org/" target="_blank" rel="noopener noreferrer">{t("diversionPrograms.emptyState.ndaaLink")}</a>
        </nav>
      </div>
    </ScanFirstPageFrame>
  );
}
