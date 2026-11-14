import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearch } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { getAvailableLetters, legalGlossaryTerms, searchGlossaryTerms } from "@/lib/legal-glossary-data";
import "./legal-glossary.css";

const letters = getAvailableLetters();
const topics = [...new Set(legalGlossaryTerms.flatMap(term => term.tags ?? []))].sort();

export default function LegalGlossary() {
  useScrollToTop();
  const { t } = useTranslation();
  const searchParams = useSearch();
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("");
  const [topic, setTopic] = useState("");
  const search = useRef<HTMLInputElement>(null);
  const selector = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setQuery(new URLSearchParams(searchParams).get("search") ?? "");
    setLetter("");
    setTopic("");
    let frame = 0;
    function openAnchor() {
      const slug = window.location.hash.slice(1);
      if (!legalGlossaryTerms.some(term => term.slug === slug)) return;
      setQuery("");
      setLetter("");
      setTopic("");
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const entry = document.getElementById(slug);
        if (entry instanceof HTMLDetailsElement) {
          entry.open = true;
          entry.querySelector("summary")?.focus({ preventScroll: true });
          entry.scrollIntoView({ block: "start" });
        }
      });
    }
    openAnchor();
    window.addEventListener("hashchange", openAnchor);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", openAnchor);
    };
  }, [searchParams]);

  const matches = searchGlossaryTerms(query.trim()).filter(term =>
    (!letter || term.term[0].toLowerCase() === letter) && (!topic || term.tags?.includes(topic))
  ).sort((a, b) => a.term.localeCompare(b.term));
  const count = t("legalGlossary.navigation.termsCount", { count: matches.length, total: legalGlossaryTerms.length });
  function clearFilters() {
    setQuery("");
    setLetter("");
    setTopic("");
    search.current?.focus();
  }

  return (
    <>
      <Header />
      <div data-skip-content tabIndex={-1} className="glossary-reader">
        <header className="glossary-intro">
          <div>
            <p>{t("legalGlossary.hero.title")}</p>
            <h1>{t("legalGlossary.reader.heading")} <span>{t("legalGlossary.reader.accent")}</span></h1>
            <p>{t("legalGlossary.reader.intro")}</p>
          </div>
          <span className="glossary-specimen" aria-hidden="true">Aa</span>
        </header>
        <div className="glossary-controls">
          <label>{t("legalGlossary.reader.search")}
            <input type="search" ref={search} value={query} placeholder={t("legalGlossary.search.placeholder")}
              onChange={event => setQuery(event.target.value)} data-testid="input-glossary-search" />
          </label>
          <label>{t("legalGlossary.reader.topic")}
            <select ref={selector} value={topic} onChange={event => setTopic(event.target.value)}>
              <option value="">{t("legalGlossary.reader.allTopics")}</option>
              {topics.map(tag => <option lang="en" key={tag} value={tag}>{tag}</option>)}
            </select>
          </label>
          <button type="button" data-testid="button-clear-filters" onClick={clearFilters} disabled={!query && !letter && !topic}>{t("legalGlossary.search.clearFilters")}</button>
        </div>
        <div className="glossary-alphabet" role="group" aria-label={t("legalGlossary.search.browseByLetter")}>
          <button type="button" aria-pressed={!letter} onClick={() => setLetter("")}>{t("legalGlossary.reader.all")}</button>
          {Array.from("abcdefghijklmnopqrstuvwxyz", initial => (
            <button type="button" key={initial} disabled={!letters.includes(initial)} aria-pressed={letter === initial}
              data-testid={`button-letter-${initial}`} onClick={() => setLetter(letter === initial ? "" : initial)}>{initial.toUpperCase()}</button>
          ))}
        </div>
        <p role="status" className="glossary-count">{count}</p>
        {!matches.length && <div><h2>{t("legalGlossary.results.noResults")}</h2><p>{t("legalGlossary.results.tryDifferentSearch")}</p></div>}
        {letters.map(initial => {
          const terms = matches.filter(term => term.term[0].toLowerCase() === initial);
          if (!terms.length) return null;
          return <section key={initial} className="glossary-group">
            <h2>{initial.toUpperCase()}</h2>
            <div>{terms.map(term => <details key={term.id} id={term.slug}>
              <summary lang="en" data-testid={`accordion-term-${term.slug}`}>{term.term}</summary>
              {term.aliases?.length ? <p>{t("legalGlossary.terms.aliases")} <span lang="en">{term.aliases.join(", ")}</span></p> : null}
              <p lang="en">{term.definition}</p>
              {term.learnMoreUrl && <Link href={term.learnMoreUrl}>{t("legalGlossary.reader.guide")}</Link>}
              <div className="glossary-tags">{term.tags?.map(tag => (
                <button type="button" lang="en" key={tag} onClick={() => {
                  setTopic(tag); setLetter(""); selector.current?.focus();
                }}>{tag}</button>
              ))}</div>
            </details>)}</div>
          </section>;
        })}
        <nav className="glossary-links" aria-label={t("legalGlossary.reader.related")}>
          <Link href="/document-library">{t("documentLibrary.title")}</Link>
          <Link href="/rights-info">{t("legalGlossary.reader.rights")}</Link>
          <Link href="/directory">{t("legalGlossary.reader.resources")}</Link>
          <Link href="/case-guidance">{t("legalGlossary.reader.guidance")}</Link>
          <Link href="/">{t("legalGlossary.navigation.backToHome")}</Link>
        </nav>
      </div>
      <Footer />
    </>
  );
}
