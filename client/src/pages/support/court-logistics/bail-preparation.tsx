import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import "./bail-preparation.css";

const groups = ["employment", "housing", "communityTies", "supportNetwork"];
const factors = ["communityTies", "employment", "housing", "supportNetwork", "courtAppearances", "chargesNature"];
const letters = ["employer", "character", "family"];
const releases = ["ror", "unsecured", "cash", "bond", "conditional"];
const help = [
  ["bailProject", "https://bailproject.org"],
  ["nationalBailFund", "https://www.communityjusticeexchange.org/en/nbfn-directory"],
  ["legalAid", "/legal-aid"],
  ["publicDefender", ""],
];
const sections = [
  ["what-judges-consider", "whatJudgesConsider"], ["documentation", "documentation"],
  ["release-types", "releaseTypes"], ["bail-help", "bailHelp"],
];

export default function BailPreparation() {
  useScrollToTop();
  const { t, i18n } = useTranslation("translation", { keyPrefix: "bailPrep" });
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [letter, setLetter] = useState(letters[0]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [copyStatus, setCopyStatus] = useState("");
  const [printTarget, setPrintTarget] = useState("checklist");
  const editor = useRef<HTMLTextAreaElement>(null);
  const draftKey = i18n.language + ":" + letter;
  const body = drafts[draftKey] ?? t("templates." + letter + ".body");
  const letterTitle = t("templates." + letter + ".label");

  function print(target: string) {
    flushSync(() => setPrintTarget(target));
    window.print();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(body);
      setCopyStatus("templates.copied");
    } catch {
      editor.current?.focus();
      editor.current?.select();
      setCopyStatus(document.execCommand("copy") ? "templates.copied" : "design.copyManually");
    }
  }

  return (
    <ScanFirstPageFrame mainClassName="bail-prep">
      <div className="bail-prep-screen">
        <header>
          <nav aria-label={t("breadcrumb")}><Link href="/">{t("breadcrumb.home", { keyPrefix: "", defaultValue: "Home" })}</Link> / <Link href="/support/court-logistics">{t("sidebar.courtLogistics")}</Link> / {t("breadcrumb")}</nav>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSubtitle")}</p>
          <div className="bail-prep-actions"><a className="bail-prep-primary" href="#documentation">{t("design.start")}</a><a href="#templates">{t("sidebar.templates")}</a></div>
          <p className="bail-prep-note">{t("overview.attorneyNote")}</p>
        </header>
        <nav className="bail-prep-nav" aria-label={t("sidebar.onThisPage")}>{sections.map(([id, label]) =>
          <a key={id} href={"#" + id}>{t("sidebar." + label)}</a>)}</nav>
        <section id="overview"><h2>{t("overview.title")}</h2><div><p>{t("overview.body1")}</p><p>{t("overview.body2")}</p></div></section>
        <section id="what-judges-consider"><h2>{t("whatJudgesConsider.title")}</h2><dl className="bail-prep-grid">
          {factors.map(key => <div key={key}><dt>{t("whatJudgesConsider.factors." + key + ".title")}</dt><dd>{t("whatJudgesConsider.factors." + key + ".body")}</dd></div>)}
        </dl></section>
        <section id="documentation"><h2>{t("documentation.title")}</h2><div>
          <p>{t("documentation.intro")}</p>
          <div className="bail-prep-grid">{groups.map(group => <fieldset key={group}><legend>{t("documentation." + group + ".title")}</legend>
            {(t("documentation." + group + ".items", { returnObjects: true }) as string[]).map((item, i) => {
              const id = group + i;
              return <label key={id}><input type="checkbox" checked={!!checked[id]} onChange={event => setChecked({ ...checked, [id]: event.target.checked })} />{item}</label>;
            })}
          </fieldset>)}</div>
          <div id="print-checklist"><h3>{t("printChecklist.title")}</h3><p>{t("printChecklist.intro")}</p>
            <Button variant="outline" onClick={() => print("checklist")}>{t("printChecklist.button")}</Button><p className="bail-prep-note">{t("printChecklist.disclaimer")}</p>
          </div>
        </div></section>
        <section id="templates"><h2>{t("templates.title")}</h2><div>
          <p>{t("templates.personalizeNote")}</p>
          <label htmlFor="bail-letter-select">{t("design.choose")}</label>
          <select id="bail-letter-select" value={letter} onChange={event => { setLetter(event.target.value); setCopyStatus(""); }}>
            {letters.map(key => <option key={key} value={key}>{t("templates." + key + ".label")}</option>)}
          </select>
          <textarea ref={editor} aria-label={letterTitle} value={body} onChange={event => { setDrafts({ ...drafts, [draftKey]: event.target.value }); setCopyStatus(""); }} />
          <div className="bail-prep-actions"><Button onClick={copy}>{t("templates.copyButton")}</Button><Button variant="outline" onClick={() => print("letter")}>{t("templates.printButton")}</Button>
            <span role="status">{copyStatus && t(copyStatus)}</span>
          </div>
        </div></section>
        <section id="release-types"><h2>{t("releaseTypes.title")}</h2><div>{releases.map(key =>
          <details key={key}><summary>{t("releaseTypes.types." + key + ".title")}</summary><p>{t("releaseTypes.types." + key + ".body")}</p></details>)}</div></section>
        <section id="bail-help"><h2>{t("bailHelp.title")}</h2><dl>{help.map(([key, url]) => {
          const name = t("bailHelp.resources." + key + ".name");
          return <div key={key}><dt>{url.startsWith("/") ? <Link href={url}>{name}</Link> : url ? <a href={url} target="_blank" rel="noopener noreferrer">{name}</a> : name}</dt><dd>{t("bailHelp.resources." + key + ".description")}</dd></div>;
        })}</dl></section>
        <nav className="bail-prep-nav" aria-label={t("sidebar.quickLinks")}><Link href="/first-24-hours">{t("sidebar.first24Hours")}</Link><Link href="/support/court-logistics">{t("sidebar.courtLogistics")}</Link><Link href="/friends-family">{t("sidebar.friendsFamily")}</Link></nav>
      </div>
      <article className="bail-prep-print">
        {printTarget === "letter" ? <>
          <h1>{letterTitle}</h1><p className="bail-prep-letter">{body}</p><p>{t("templates.printNote")}</p>
        </> : <>
          <h1>{t("design.checklist")}</h1><p>{t("heroTitle")}</p>
          {groups.map(group => <div key={group}><h2>{t("documentation." + group + ".title")}</h2><ul>
            {(t("documentation." + group + ".items", { returnObjects: true }) as string[]).map((item, i) => <li key={i}>{checked[group + i] ? "☑" : "☐"} {item}</li>)}
          </ul></div>)}
          <p>{t("printChecklist.disclaimer")}</p>
        </>}
      </article>
    </ScanFirstPageFrame>
  );
}
