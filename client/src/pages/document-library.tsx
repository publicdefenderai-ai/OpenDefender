import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { ShareResource } from "@/components/ui/share-button";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { LEGAL_DOCUMENTS, PHASE_LABELS, type CasePhase, type DocumentCategory } from "@shared/legal-documents";
import "./document-library.css";

const categories: DocumentCategory[] = ["criminal", "immigration"];
const phases = Object.keys(PHASE_LABELS) as CasePhase[];
const documents = [...LEGAL_DOCUMENTS].sort((a, b) => a.displayOrder - b.displayOrder);
const normalize = (text: string) => text.normalize("NFKC").toLowerCase().trim();

export default function DocumentLibrary() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const language = i18n.language.startsWith("es") ? "es" : i18n.language.startsWith("zh") ? "zh" : "en";
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState("all");
  const [category, setCategory] = useState("all");
  const searchRef = useRef<HTMLInputElement>(null);

  function reset() {
    setQuery("");
    setPhase("all");
    setCategory("all");
  }

  useEffect(() => {
    let frame = 0;
    function openLinkedDocument() {
      const slug = window.location.hash.slice(1);
      if (!documents.some(doc => doc.slug === slug)) return;
      reset();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const row = document.getElementById(slug);
        if (row instanceof HTMLDetailsElement) {
          row.open = true;
          row.querySelector("summary")?.focus({ preventScroll: true });
          row.scrollIntoView({ block: "start" });
        }
      });
    }
    openLinkedDocument();
    window.addEventListener("hashchange", openLinkedDocument);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", openLinkedDocument);
    };
  }, []);

  const needle = normalize(query);
  const filtered = documents.filter(doc => {
    if (category !== "all" && category !== doc.category) return false;
    if (phase !== "all" && !doc.phases.some(item => item === phase)) return false;
    if (!needle) return true;
    const keys = [doc.titleKey, doc.descriptionKey, doc.purposeKey, doc.whatToDoKey,
      ...doc.sections.flatMap(section => [section.labelKey, section.explanationKey])];
    return [doc.formNumber || "", ...keys.map(key => t(key))].some(value => normalize(value).includes(needle));
  });

  return (
    <>
      <Header />
      <PageBreadcrumb items={[{ label: t("breadcrumb.home"), href: "/" }]} currentPage={t("documentLibrary.title")} />
      <div className="library-reader" data-skip-content tabIndex={-1}>
        <header className="library-intro">
          <div>
            <p>{t("documentLibrary.title")}</p>
            <h1>{t("documentLibrary.reader.heading")}</h1>
            <p>{t("documentLibrary.subtitle")}</p>
          </div>
          <dl>{categories.map(item => <div key={item}>
            <dt>{t(`documentLibrary.tabs.${item}`)}</dt>
            <dd>{documents.filter(doc => doc.category === item).length}</dd>
          </div>)}</dl>
        </header>
        <div className="library-filters">
          <label>{t("documentLibrary.reader.search")}
            <input ref={searchRef} type="search" value={query} onChange={event => setQuery(event.target.value)} />
          </label>
          <label>{t("documentLibrary.filter.phase")}
            <select data-testid="select-phase-filter" value={phase} onChange={event => setPhase(event.target.value)}>
              <option value="all">{t("documentLibrary.filter.allPhases")}</option>
              {phases.map(item => <option key={item} value={item}>{PHASE_LABELS[item][language]}</option>)}
            </select>
          </label>
          <label>{t("documentLibrary.filter.category")}
            <select data-testid="select-category-filter" value={category} onChange={event => setCategory(event.target.value)}>
              <option value="all">{t("documentLibrary.filter.allCategories")}</option>
              {categories.map(item => <option key={item} value={item}>{t(`documentLibrary.tabs.${item}`)}</option>)}
            </select>
          </label>
          <button type="button" disabled={!query && phase === "all" && category === "all"}
            onClick={() => { reset(); searchRef.current?.focus(); }}>{t("documentLibrary.reader.clear")}</button>
        </div>
        <p role="status" className="library-count">{filtered.length ? t("documentLibrary.filter.showing", { count: filtered.length }) : t("documentLibrary.noDocuments")}</p>
        {categories.map(item => {
          const matches = filtered.filter(doc => doc.category === item);
          if (!matches.length) return null;
          return <section className="library-group" key={item}>
            <h2>{t(`documentLibrary.tabs.${item}`)}</h2>
            {matches.map(doc => <details id={doc.slug} key={doc.slug} data-testid={`document-card-${doc.slug}`}>
              <summary data-testid={`button-expand-${doc.slug}`}>
                <span><strong>{t(doc.titleKey)} {doc.formNumber && <small>({doc.formNumber})</small>}</strong>
                  <span>{t(doc.descriptionKey)}</span></span>
              </summary>
              <div className="library-explanation">
                <h3>{t("documentLibrary.card.purpose")}</h3><p>{t(doc.purposeKey)}</p>
                <h3>{t("documentLibrary.card.whatToDo")}</h3><p>{t(doc.whatToDoKey)}</p>
                <h3>{t("documentLibrary.card.sections")}</h3>
                <dl>{doc.sections.map(section => <div key={section.id}><dt>{t(section.labelKey)}</dt><dd>{t(section.explanationKey)}</dd></div>)}</dl>
                <p>{t("documentLibrary.filter.phase")}: {doc.phases.map(key => PHASE_LABELS[key][language]).join(", ")}</p>
                <ShareResource resourceTitle={t(doc.titleKey)} resourceDescription={t(doc.descriptionKey)}
                  resourceId={doc.slug} url={new URL(`/document-library#${doc.slug}`, window.location.origin).href} />
              </div>
            </details>)}
          </section>;
        })}
        <p className="library-note">{t("documentLibrary.reader.note")}</p>
        <section className="library-help">
          <h2>{t("documentLibrary.reader.help")}</h2><p>{t("documentLibrary.reader.helpText")}</p>
          <Link data-testid="button-get-guidance" href="/chat">{t("documentLibrary.reader.chat")}</Link>
        </section>
      </div>
      <Footer />
    </>
  );
}
