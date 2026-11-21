import "./after-deportation.css";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { ScanFirstPageFrame, PageSectionNav } from "@/components/layout/scan-first-page-frame";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { RapidlyEvolvingNotice } from "@/components/immigration/rapidly-evolving-notice";
import { afterDeportationDesign } from "@/locales/after-deportation-design";

const ORGS = [
  { key: "alOtroLado", url: "https://alotrolado.org" },
  { key: "raices",     url: "https://raicestexas.org" },
  { key: "nilc",       url: "https://nilc.org" },
  { key: "clinic",     url: "https://cliniclegal.org" },
  { key: "ian",        url: "https://immigrationadvocates.org" },
  { key: "twoEleven",  url: "https://211.org" },
  { key: "nlihc",      url: "https://nlihc.org" },
  { key: "vera",       url: "https://vera.org" },
] as const;

export default function AfterDeportation() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const language = i18n.language?.startsWith("es") ? "es" : i18n.language?.startsWith("zh") ? "zh" : "en";
  const design = afterDeportationDesign[language];
  useEffect(() => {
    const openedForPrint = new Set<HTMLDetailsElement>();
    const beforePrint = () => {
      document.querySelectorAll<HTMLDetailsElement>(".after-deportation-faq:not([open])").forEach(detail => {
        openedForPrint.add(detail); detail.open = true;
      });
    };
    const afterPrint = () => {
      openedForPrint.forEach(detail => { detail.open = false; }); openedForPrint.clear();
    };
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
      afterPrint();
    };
  }, []);
  const list = (prefix: string, count: number) => <ul>{Array.from({length:count},(_,i) => <li key={i}>{t(`${prefix}.item${i+1}`)}</li>)}</ul>;
  return <ScanFirstPageFrame mainClassName="after-deportation-page">
    <PageBreadcrumb items={[{label:design.home,href:"/"},{label:design.immigration,href:"/immigration-guidance"}]} currentPage={t("afterDeportation.heroTitle")} />
    <header className="after-deportation-hero">
      <div><p className="after-deportation-tagline">{t("afterDeportation.heroTagline")}</p>
        <h1 data-testid="immigration-detail-title">{t("afterDeportation.heroTitle")}</h1><p data-testid="immigration-detail-subtitle">{t("afterDeportation.heroSubtitle")}</p>
      </div>
      <img src="/images/design/after-deportation.svg" className="after-deportation-art" width="260" height="240" alt="" aria-hidden="true" />
    </header>
    <div className="after-deportation-paths">
      <a href="#if-deported">{t("afterDeportation.ifDeported.sectionTitle")}</a>
      <a href="#family-in-us">{t("afterDeportation.familyInUs.sectionTitle")}</a>
    </div>
    <PageSectionNav ariaLabel={t("afterDeportation.sidebar.onThisPage")} items={[
      {id:"overview",label:t("afterDeportation.sidebar.overview")},
      {id:"if-deported",label:t("afterDeportation.sidebar.ifDeported")},
      {id:"family-in-us",label:t("afterDeportation.sidebar.familyInUs")},
      {id:"organizations",label:t("afterDeportation.sidebar.organizations")},
      {id:"faq",label:t("afterDeportation.sidebar.faq")}
    ]} />
    <RapidlyEvolvingNotice />
    <section id="overview" className="after-deportation-section" tabIndex={-1}>
      <h2>{t("afterDeportation.overview.title")}</h2><p>{t("afterDeportation.overview.body")}</p>
    </section>
    <section id="if-deported" className="after-deportation-section" tabIndex={-1}>
      <h2>{t("afterDeportation.ifDeported.sectionTitle")}</h2>
      <div id="first-72" className="after-deportation-topic" tabIndex={-1}>
        <h3>{t("afterDeportation.ifDeported.first72.title")}</h3>
        <ol className="after-deportation-steps">{[1,2,3,4].map(i=><li key={i}>
          <h4>{t(`afterDeportation.ifDeported.first72.step${i}Title`)}</h4>
          <p>{t(`afterDeportation.ifDeported.first72.step${i}Body`)}</p>
        </li>)}</ol>
      </div>
      <div id="grew-up-in-us" className="after-deportation-topic" tabIndex={-1}>
        <h3>{t("afterDeportation.ifDeported.grewUpInUs.title")}</h3>
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800">
          <AlertDescription className="text-blue-800 dark:text-blue-200">{t("afterDeportation.ifDeported.grewUpInUs.body")}</AlertDescription>
        </Alert>
      </div>
      <div className="after-deportation-columns">
        <div id="documents" className="after-deportation-topic" tabIndex={-1}>
          <h3>{t("afterDeportation.ifDeported.documents.title")}</h3>{list("afterDeportation.ifDeported.documents",3)}
          <p className="after-deportation-note">{t("afterDeportation.ifDeported.documents.note")}</p>
        </div>
        <div id="money" className="after-deportation-topic" tabIndex={-1}>
          <h3>{t("afterDeportation.ifDeported.money.title")}</h3>{list("afterDeportation.ifDeported.money",4)}
        </div>
      </div>
    </section>
    <section id="family-in-us" className="after-deportation-section" tabIndex={-1}>
      <h2>{t("afterDeportation.familyInUs.sectionTitle")}</h2>
      <div className="after-deportation-columns">
        {(["contact","financial","children"] as const).map(topic=><div id={topic} className="after-deportation-topic" tabIndex={-1} key={topic}>
          <h3>{t(`afterDeportation.familyInUs.${topic}.title`)}</h3>{list(`afterDeportation.familyInUs.${topic}`,4)}
        </div>)}
        <div id="legal-next" className="after-deportation-topic" tabIndex={-1}>
          <h3>{t("afterDeportation.familyInUs.legalNext.title")}</h3>
          <Alert className="border-slate-200 bg-slate-50 dark:bg-slate-900/30 dark:border-slate-700">
            <AlertDescription className="text-slate-700 dark:text-slate-300">{list("afterDeportation.familyInUs.legalNext",3)}</AlertDescription>
          </Alert>
        </div>
      </div>
    </section>
    <section id="organizations" className="after-deportation-section" tabIndex={-1}>
      <h2>{t("afterDeportation.organizations.title")}</h2>
      <div className="after-deportation-organizations">{ORGS.map(({key,url})=><div key={key}>
        <h3><a href={url} target="_blank" rel="noopener noreferrer">{t(`afterDeportation.organizations.${key}.name`)}<span className="sr-only"> ({design.newTab})</span></a></h3>
        <p>{t(`afterDeportation.organizations.${key}.description`)}</p>
      </div>)}</div>
      <p className="after-deportation-note">{t("afterDeportation.organizations.note")}</p>
    </section>
    <section id="faq" className="after-deportation-section" tabIndex={-1}>
      <h2>{t("afterDeportation.faq.title")}</h2>
      {[1,2,3,4,5,6,7].map(i=><details className="after-deportation-faq" key={i}>
        <summary>{t(`afterDeportation.faq.q${i}.question`)}<span aria-hidden="true" /></summary>
        <p>{t(`afterDeportation.faq.q${i}.answer`)}</p>
      </details>)}
    </section>
    <nav className="after-deportation-related" aria-label={t("afterDeportation.sidebar.quickLinks")}>
      <h2>{t("afterDeportation.sidebar.quickLinks")}</h2>
      <a href="/immigration-guidance">{t("afterDeportation.sidebar.immigrationGuidance")}</a>
      <a href="/support">{t("afterDeportation.sidebar.lifeFamily")}</a>
      <a href="/legal-aid">{t("afterDeportation.sidebar.findLawyer")}</a>
    </nav>
  </ScanFirstPageFrame>;
}
