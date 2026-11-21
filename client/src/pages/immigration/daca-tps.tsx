import "./daca-tps.css";
import { immigrationUpdates } from "@/locales/immigration-updates";
import { dacaTpsDesign } from "@/locales/daca-tps-design";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { ScanFirstPageFrame, PageSectionNav } from "@/components/layout/scan-first-page-frame";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { RapidlyEvolvingNotice } from "@/components/immigration/rapidly-evolving-notice";

export default function DacaTps() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const language = i18n.language?.startsWith("es") ? "es" : i18n.language?.startsWith("zh") ? "zh" : "en";
  const copy = immigrationUpdates[language];
  const design = dacaTpsDesign[language];
  return <ScanFirstPageFrame mainClassName="daca-tps-page">
    <PageBreadcrumb items={[
      { label: design.home, href: "/" },
      { label: design.immigration, href: "/immigration-guidance" }
    ]} currentPage={t("immigration.daca.title")} />
    <header className="daca-tps-hero">
      <h1 data-testid="immigration-detail-title">{design.title}{" "}<span>{design.accent}</span></h1>
      <p data-testid="immigration-detail-subtitle">{t("immigration.daca.subtitle")}</p>
    </header>
    <Alert className="border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40">
      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="text-amber-900 dark:text-amber-200" data-testid="alert-daca-disclaimer">
        <strong>{t("immigration.common.importantLabel")}</strong>{" "}{t("immigration.daca.disclaimer")}
      </AlertDescription>
    </Alert>
    <PageSectionNav ariaLabel={design.nav} items={[
      { id: "daca", label: design.sections[0] }, { id: "tps", label: design.sections[1] },
      { id: "protection-expires", label: design.sections[2] }, { id: "official-resources", label: design.sections[3] }
    ]} />
    <RapidlyEvolvingNotice />
    <section className="daca-tps-section" id="daca" tabIndex={-1}>
      <div className="daca-tps-intro">
        <h2 data-testid="text-daca-title">{t("immigration.daca.dacaSection.title")}</h2>
        <h3>{t("immigration.daca.dacaSection.whatIs")}</h3>
        <p>{t("immigration.daca.dacaSection.whatIsText")}</p>
      </div>
      <div className="daca-tps-reading">
        <div>
          <h3>{t("immigration.daca.dacaSection.eligibility")}</h3>
          <ul>{[1,2,3,4,5,6].map(i => <li key={i}>{t(`immigration.daca.dacaSection.req${i}`)}</li>)}</ul>
        </div>
        <div className="daca-tps-notice">
          <h3>{copy.frameworkTitle}</h3>
          <ul>{copy.framework.map(text => <li key={text}>{text}</li>)}</ul>
          <a href="https://www.uscis.gov/DACA" target="_blank" rel="noopener noreferrer">USCIS DACA<span className="sr-only"> ({design.newTab})</span></a>
        </div>
        <div>
          <h3>{t("immigration.daca.dacaSection.renewal")}</h3>
          <p>{t("immigration.daca.dacaSection.renewalText")}</p>
        </div>
      </div>
    </section>
    <section className="daca-tps-section" id="tps" tabIndex={-1}>
      <div className="daca-tps-intro">
        <h2 data-testid="text-tps-title">{t("immigration.daca.tpsSection.title")}</h2>
        <h3>{t("immigration.daca.tpsSection.whatIs")}</h3>
        <p>{t("immigration.daca.tpsSection.whatIsText")}</p>
      </div>
      <div className="daca-tps-reading">
        <div className="daca-tps-notice">
          <h3>{t("immigration.daca.tpsSection.countries")}</h3>
          <p>{copy.currentTps}</p>
          <a href="https://www.uscis.gov/humanitarian/temporary-protected-status" target="_blank" rel="noopener noreferrer">{copy.countryLink}<span className="sr-only"> ({design.newTab})</span></a>
        </div>
        <div>
          <h3>{t("immigration.daca.tpsSection.benefits")}</h3>
          <ul>{[1,2,3].map(i => <li key={i}>{t(`immigration.daca.tpsSection.benefit${i}`)}</li>)}</ul>
        </div>
        <div>
          <h3>{t("immigration.daca.tpsSection.reregistration")}</h3>
          <p>{t("immigration.daca.tpsSection.reregistrationText")}</p>
        </div>
      </div>
    </section>
    <section className="daca-tps-followup" id="protection-expires" tabIndex={-1}>
      <h2 data-testid="text-what-if-status-lapses">{t("immigration.daca.statusLapse.title")}</h2>
      <div className="daca-tps-topics">
        {["dontPanic", "gatherDocs", "seekHelp"].map(key => <div key={key}>
          <h3>{t(`immigration.daca.statusLapse.${key}`)}</h3>
          <p>{t(`immigration.daca.statusLapse.${key}Text`)}</p>
        </div>)}
      </div>
      <a href="/immigration-guidance/find-attorney">{design.legalHelp}</a>
    </section>
    <section className="daca-tps-followup" id="official-resources" tabIndex={-1}>
      <h2>{t("immigration.daca.resources")}</h2>
      <div className="daca-tps-resources">
        <a href="https://www.uscis.gov/DACA" target="_blank" rel="noopener noreferrer" data-testid="link-uscis-daca">{design.daca}<span className="sr-only"> ({design.newTab})</span></a>
        <a href="https://www.uscis.gov/humanitarian/temporary-protected-status" target="_blank" rel="noopener noreferrer" data-testid="link-uscis-tps">{design.tps}<span className="sr-only"> ({design.newTab})</span></a>
      </div>
    </section>
  </ScanFirstPageFrame>;
}
