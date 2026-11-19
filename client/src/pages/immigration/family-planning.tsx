import "./family-planning.css";
import { useEffect } from "react";
import { BrandShieldIcon } from "@/components/brand-logo";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { ScanFirstPageFrame, PageSectionNav } from "@/components/layout/scan-first-page-frame";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { RapidlyEvolvingNotice } from "@/components/immigration/rapidly-evolving-notice";
import { POAGenerator } from "@/components/immigration/poa-generator";
import { immigrationFamilyCopy } from "@/locales/immigration-family-design";

export default function FamilyPlanning() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("es") ? "es" : i18n.language?.startsWith("zh") ? "zh" : "en";
  const design = immigrationFamilyCopy[locale];

  // Include every explanation in browser print, then restore the reader's choices.
  useEffect(() => {
    let openedForPrint: HTMLDetailsElement[] = [];
    const beforePrint = () => {
      const closed = Array.from(document.querySelectorAll<HTMLDetailsElement>(".immigration-family-document:not([open])"));
      openedForPrint.push(...closed);
      closed.forEach(detail => { detail.open = true; });
    };
    const afterPrint = () => {
      openedForPrint.forEach(detail => { detail.open = false; });
      openedForPrint = [];
    };
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
      afterPrint();
    };
  }, []);

  return (
    <ScanFirstPageFrame mainClassName="immigration-family-page">
      <PageBreadcrumb items={[
        { label: design.home, href: "/" },
        { label: design.immigration, href: "/immigration-guidance" }
      ]} currentPage={t("immigration.family.title")} />
      <header className="immigration-family-hero">
        <div>
          <h1 data-testid="immigration-detail-title">{design.title}<span>{design.accent}</span></h1>
          <p data-testid="immigration-detail-subtitle">{t("immigration.family.subtitle")}</p>
        </div>
        <img className="immigration-family-art" src="/images/design/immigration-family.svg" width="280" height="230" alt="" aria-hidden="true" />
      </header>
      <Alert className="border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40">
        <AlertDescription className="text-blue-900 dark:text-blue-200" data-testid="alert-family-planning">
          <div className="flex items-start gap-3">
            <BrandShieldIcon size={20} className="mt-0.5 shrink-0" />
            <span><strong>{t("immigration.family.planningAlert")}</strong> {t("immigration.family.planningAlertText")}</span>
          </div>
        </AlertDescription>
      </Alert>
      <PageSectionNav ariaLabel={design.nav} items={[
        { id: "fp-plan", label: design.sections[0] },
        { id: "fp-documents", label: design.sections[1] },
        { id: "generator", label: design.sections[2] },
        { id: "fp-practical", label: design.sections[3] },
        { id: "fp-help", label: design.sections[4] }
      ]} />
      <RapidlyEvolvingNotice />

      <section id="fp-plan" tabIndex={-1} className="immigration-family-section">
        <h2 data-testid="text-emergency-plan-title">{t("immigration.family.emergencyPlan.title")}</h2>
        <div className="immigration-family-columns">
          {(["communication", "documentPrep"] as const).map(topic => (
            <div key={topic}>
              <h3>{t(`immigration.family.emergencyPlan.${topic}.title`)}</h3>
              <ol className="immigration-family-steps">
                {[1, 2, 3].map(step => (
                  <li key={step}>
                    <strong>{t(`immigration.family.emergencyPlan.${topic}.step${step}`)}</strong>
                    <p>{t(`immigration.family.emergencyPlan.${topic}.step${step}Text`)}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section id="fp-documents" tabIndex={-1} className="immigration-family-section">
        <h2 data-testid="text-essential-documents-title">{t("immigration.family.documents.title")}</h2>
        {(["poa", "caregiver", "guardianship"] as const).map(document => (
          <details className="immigration-family-document" key={document}>
            <summary>{t(`immigration.family.documents.${document}.title`)}<span aria-hidden="true" /></summary>
            <div>
              <p>{t(`immigration.family.documents.${document}.description`)}</p>
              <ul>
                {Array.from({ length: document === "guardianship" ? 4 : 3 }, (_, index) => (
                  <li key={index}>{t(`immigration.family.documents.${document}.item${index + 1}`)}</li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </section>

      <section id="generator" tabIndex={-1} className="immigration-family-section">
        <h2 data-testid="text-generator-title">{t("immigration.family.generator.title")}</h2>
        <p className="immigration-family-tool-intro">{t("immigration.family.generator.description")}</p>
        {/* Keep the current official-form selector, not the superseded preview generator. */}
        <POAGenerator />
      </section>

      <section id="fp-practical" tabIndex={-1} className="immigration-family-section">
        <h2 data-testid="text-financial-planning-title">{t("immigration.family.financial.title")}</h2>
        <div className="immigration-family-needs">
          {(["bank", "property", "medical"] as const).map(topic => (
            <article key={topic}>
              <h3>{t(`immigration.family.financial.${topic}`)}</h3>
              <p>{t(`immigration.family.financial.${topic}Text`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="fp-help" tabIndex={-1} className="immigration-family-section">
        <h2>{design.help}</h2>
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800">
          <AlertTriangle className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>{t("immigration.family.freeHelp")}</strong> {t("immigration.family.freeHelpText")}
          </AlertDescription>
        </Alert>
      </section>
    </ScanFirstPageFrame>
  );
}
