import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface RecordMatch {
  id: number;
  absolute_url?: string;
  case_name?: string;
  caseName?: string;
  caseNameFull?: string;
  court_id?: string;
  docket_number?: string;
  dateFiled?: string;
  date_filed?: string;
  citation?: string[];
  nature_of_suit?: string;
  assigned_to_str?: string;
  snippet?: string;
}

interface SearchResponse {
  success: boolean;
  message?: string;
  hasRecapAccess?: boolean;
  partialFailure?: boolean;
  failedServices?: { recap?: boolean; opinions?: boolean };
  recap: { count: number; results: RecordMatch[] };
  opinions: { count: number; results: RecordMatch[] };
}

function RecordRow({ record, opinion, index }: { record: RecordMatch; opinion: boolean; index: number }) {
  const { t, i18n } = useTranslation();
  const filed = record.dateFiled || record.date_filed;
  const date = filed && new Date(filed);
  const formatted = date && Number.isFinite(date.getTime())
    ? date.toLocaleDateString(i18n.language, { dateStyle: "medium", timeZone: "UTC" }) : filed;
  const path = record.absolute_url;
  return (
    <li className="records-match">
      <div>
        <h4 data-testid={`text-${opinion ? "opinion" : "case"}-name-${index}`}>{record.caseName || record.caseNameFull || record.case_name}</h4>
        <div className="records-metadata">
          {record.court_id && <span>{record.court_id}</span>}
          {record.docket_number && <span data-testid={`badge-docket-${index}`}>{record.docket_number}</span>}
          {record.citation?.[0] && <span>{record.citation[0]}</span>}
          {formatted && <span>{t("courtRecords.results.filed", { date: formatted })}</span>}
        </div>
        {record.nature_of_suit && <p>{t("courtRecords.results.natureOfSuit")} {record.nature_of_suit}</p>}
        {record.assigned_to_str && <p>{t("courtRecords.results.assignedTo")} {record.assigned_to_str}</p>}
        {record.snippet && <p>{record.snippet}</p>}
      </div>
      {path?.startsWith("/") && <a href={`https://www.courtlistener.com${path}`} target="_blank" rel="noopener noreferrer"
        data-testid={`button-view-${opinion ? "opinion" : "recap"}-${index}`}>
        {t(opinion ? "courtRecords.results.viewOpinion" : "courtRecords.design.viewDocket")}
      </a>}
    </li>
  );
}

export default function CourtRecords() {
  useScrollToTop();
  const { t } = useTranslation();
  const [fields, setFields] = useState({ searchTerm: "", caseName: "", docketNumber: "" });
  const [semantic, setSemantic] = useState(false);
  const search = useMutation({
    mutationFn: async (params: URLSearchParams): Promise<SearchResponse> => {
      const response = await fetch(`/api/court-records/search?${params}`, { credentials: "include" });
      if (!response.ok) throw new Error("Court records search failed");
      const result: SearchResponse = await response.json();
      if (!result.success) throw new Error("Court records search failed");
      return result;
    },
  });
  const ready = Object.values(fields).some(value => value.trim());
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || search.isPending) return;
    const params = new URLSearchParams();
    if (fields.searchTerm.trim()) params.set("q", fields.searchTerm.trim());
    if (fields.caseName.trim()) params.set("case_name", fields.caseName.trim());
    if (fields.docketNumber.trim()) params.set("docket_number", fields.docketNumber.trim());
    if (semantic) params.set("search_type", "semantic");
    search.mutate(params);
  }
  const data = search.data;
  const total = data ? data.recap.count + data.opinions.count : 0;

  return (
    <ScanFirstPageFrame mainClassName="records-page">
      <section className="records-opening">
        <h1>{t("courtRecords.hero.title")}</h1>
        <p>{t("courtRecords.hero.subtitle")}</p>
      </section>
      <p className="records-free"><strong>{t("courtRecords.freeFirstAlert.title")}</strong>{" "}
        {t("courtRecords.freeFirstAlert.text1")} <Link href="/recap-extensions">{t("courtRecords.freeFirstAlert.linkText")}</Link>{" "}
        {t("courtRecords.freeFirstAlert.text2")}
      </p>
      <form onSubmit={submit} className="records-form" aria-label={t("courtRecords.searchParams.title")}>
        <div className="records-mode">
          <Switch id="semantic-search" aria-describedby="records-mode-desc" data-testid="switch-semantic-search"
            checked={semantic} onCheckedChange={setSemantic} />
          <label htmlFor="semantic-search">{t("courtRecords.searchParams.semanticSearchLabel")}</label>
        </div>
        <p id="records-mode-desc">{t(semantic ? "courtRecords.searchParams.semanticSearchOnDesc" : "courtRecords.searchParams.semanticSearchOffDesc")}</p>
        <p>{t("courtRecords.searchParams.description")}</p>
        <div className="records-fields">
          {([["searchTerm", "input-search-term"], ["caseName", "input-case-name"], ["docketNumber", "input-docket-number"]] as const).map(([key, id]) => (
            <div key={key}>
              <label htmlFor={id}>{t(`courtRecords.searchParams.${key}`)}</label>
              <Input id={id} data-testid={id} value={fields[key]} autoComplete="off"
                placeholder={t(`courtRecords.searchParams.${semantic && key === "searchTerm" ? "semanticSearch" : key}Placeholder`)}
                onChange={event => setFields({ ...fields, [key]: event.target.value })} />
            </div>
          ))}
        </div>
        <Button type="submit" disabled={!ready || search.isPending} data-testid="button-search">{t("courtRecords.searchParams.searchButton")}</Button>
      </form>
      <p role="status">{search.isPending ? t("courtRecords.design.searching") : data ? t("courtRecords.results.totalResults", { count: total }) : ""}</p>
      {search.isError && <p role="alert" className="records-warning">{t("courtRecords.results.searchFailed")}</p>}
      {data && <section className="records-results">
        <h2>{t("courtRecords.results.title")}</h2>
        {typeof data.hasRecapAccess === "boolean"
          ? <p>{t(data.hasRecapAccess ? "courtRecords.design.fullAccess" : "courtRecords.design.limitedAccess")}</p>
          : data.message && <p>{data.message}</p>}
        {data.partialFailure && <div role="alert" className="records-warning">
          <strong>{t("courtRecords.partialFailure.title")}</strong> {t("courtRecords.partialFailure.text")}{" "}
          {data.failedServices?.recap && t("courtRecords.partialFailure.recapFailed")}{" "}
          {data.failedServices?.opinions && t("courtRecords.partialFailure.opinionsFailed")}{" "}
          {t("courtRecords.partialFailure.incomplete")}
        </div>}
        {(["recap", "opinions"] as const).map(key => data[key].count > 0 && <section key={key}>
          <h3>{t(key === "recap" ? "courtRecords.results.recapSection" : "courtRecords.results.opinionsSection", { count: data[key].count })}</h3>
          <ul>{data[key].results.map((record, index) => <RecordRow key={`${record.id}-${index}`} record={record} index={index} opinion={key === "opinions"} />)}</ul>
        </section>)}
        {!total && !data.partialFailure && <>
          <p>{t("courtRecords.results.noResults")}</p>
          <Button variant="outline" onClick={() => {
            setFields({ searchTerm: "", caseName: "", docketNumber: "" });
            search.reset();
          }}>{t("common.back")}</Button>
        </>}
      </section>}
      <div className="records-links">
        <Link href="/recap-extensions">{t("courtRecords.design.about")}</Link>
        <Link href="/court-locator">{t("courtRecords.design.locator")}</Link>
        <Link href="/data-sources">{t("courtRecords.design.sources")}</Link>
      </div>
    </ScanFirstPageFrame>
  );
}
