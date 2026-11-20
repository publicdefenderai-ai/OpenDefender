import "./workplace-raids.css";
import { BrandShieldIcon } from "@/components/brand-logo";
import { Building2, AlertTriangle, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { ScanFirstPageFrame, PageSectionNav } from "@/components/layout/scan-first-page-frame";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { RapidlyEvolvingNotice } from "@/components/immigration/rapidly-evolving-notice";
import { workplaceRaidsCopy } from "@/locales/workplace-raids-design";
export default function WorkplaceRaids() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("es") ? "es" : i18n.language?.startsWith("zh") ? "zh" : "en";
  const lang = locale === "es" ? "es" : "en";
  const copy = workplaceRaidsCopy[locale];
  return <ScanFirstPageFrame mainClassName="workplace-page">
    <PageBreadcrumb items={[
      {label: copy.home, href: "/"},
      {label: copy.immigration, href: "/immigration-guidance"}
    ]} currentPage={t("immigration.raids.title")} />
    <header className="workplace-hero">
      <div><h1 data-testid="immigration-detail-title">{t("immigration.raids.title")}</h1>
      <p data-testid="immigration-detail-subtitle">{t("immigration.raids.subtitle")}</p></div>
      <img className="workplace-art" src="/images/design/workplace-raids.svg" width="240" height="220" alt="" aria-hidden="true" />
    </header>
    <Alert className="border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/40">
      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
      <AlertDescription className="text-red-900 dark:text-red-200" data-testid="alert-workplace-critical">
        <strong>{t("immigration.raids.criticalAlert")}</strong>{" "}{t("immigration.raids.criticalAlertText")}
      </AlertDescription>
    </Alert>
    <PageSectionNav ariaLabel={copy.nav} items={[
      {id: "workplace-encounter", label: copy.sections[0]},
      {id: "workplace-employer", label: copy.sections[1]},
      {id: "workplace-after", label: copy.sections[2]},
      {id: "work-authorization", label: copy.sections[3]},
      {id: "workplace-help", label: copy.sections[4]}
    ]} />
    <RapidlyEvolvingNotice />
    <section id="workplace-encounter" className="workplace-section workplace-columns" tabIndex={-1}>
      {(["yourRights", "whatNotToDo"] as const).map((group,index) => <div key={group}>
        <h2 data-testid={index === 0 ? "text-your-rights-title" : "text-what-not-to-do-title"}>{t(`immigration.raids.${group}.title`)}</h2>
        {(index === 0 ? ["silent","refuse","attorney","basis"] : ["run","falseDocs","lie","sign"]).map(key => <div className="workplace-item" key={key}>
          <h3>{t(`immigration.raids.${group}.${key}`)}</h3><p>{t(`immigration.raids.${group}.${key}Text`)}</p>
        </div>)}
      </div>)}
    </section>
    <section id="workplace-employer" className="workplace-section" tabIndex={-1}>
      <h2 data-testid="text-employer-obligations-title">{t("immigration.raids.employer.title")}</h2>
      <div className="workplace-columns">
        {(["must", "can"] as const).map(group => <div key={group}>
          <h3>{t(`immigration.raids.employer.${group === "must" ? "mustProvide" : "canDo"}`)}</h3>
          <ul>{Array.from({length: group === "must" ? 3 : 4}, (_,i) => <li key={i}>{t(`immigration.raids.employer.${group}${i+1}`)}</li>)}</ul>
        </div>)}
      </div>
    </section>
    <section id="workplace-after" className="workplace-section" tabIndex={-1}>
      <h2 data-testid="text-after-raid-title">{t("immigration.raids.afterRaid.title")}</h2>
      <div className="workplace-columns">
        {(["detained", "notDetained"] as const).map(group => <div key={group}>
          <h3>{t(`immigration.raids.afterRaid.${group}`)}</h3>
          <ul>{[1,2,3,4,5].map(i => <li key={i}>{t(`immigration.raids.afterRaid.${group}${i}`)}</li>)}</ul>
        </div>)}
      </div>
      <div className="workplace-links"><a href="/immigration-guidance/find-detained">{copy.detention}</a><a href="/immigration-guidance/family-planning">{copy.family}</a></div>
    </section>
    {locale === "zh" && <p className="workplace-language">{copy.englishNotice}</p>}
      {/* Work Authorization Rights Section */}
      <section className="workplace-section" id="work-authorization" tabIndex={-1} lang={locale === "zh" ? "en" : undefined}>
        <div className="workplace-authorization">
            <h2 className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              {lang === 'es' ? 'Sus Derechos de Autorización de Trabajo' : 'Your Work Authorization Rights'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Conozca sus derechos si su permiso de trabajo expira, es revocado, o su empleador inicia una auditoría de I-9.'
                : 'Know your rights if your work permit expires, is revoked, or your employer initiates an I-9 audit.'}
            </p>
          <div className="workplace-columns">
              <div className="workplace-detail">
                  <h3>
                    <BrandShieldIcon size={20} />
                    {lang === 'es' ? 'Derechos del Trabajador' : 'Worker Rights'}
                  </h3>
                  <div className="workplace-item">
                    <strong className="text-foreground">
                      {lang === 'es' ? 'Usted elige los documentos' : 'You choose the documents'}
                    </strong>
                    <p className="text-sm text-muted-foreground">
                      {lang === 'es'
                        ? 'Bajo la ley federal I-9, usted tiene el derecho de elegir qué documentos de la lista aceptable presentar. Los empleadores no pueden exigir un documento específico ni pedir más de lo requerido.'
                        : 'Under federal I-9 law, you have the right to choose which documents from the acceptable list to present. Employers cannot demand a specific document or ask for more than required.'}
                    </p>
                    <a
                      href="https://www.uscis.gov/i-9-central"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary underline underline-offset-2 mt-1 inline-block"
                    >
                      {lang === 'es' ? 'USCIS I-9 Central →' : 'USCIS I-9 Central →'}
                    </a>
                  </div>
                  <div className="workplace-item">
                    <strong className="text-foreground">
                      {lang === 'es' ? 'Puede tener otra autorización' : 'You may still have authorization'}
                    </strong>
                    <p className="text-sm text-muted-foreground">
                      {lang === 'es'
                        ? 'Incluso si su permiso de trabajo ha expirado o sido revocado, podría seguir autorizado para trabajar por otros medios, como una renovación de permiso, protecciones temporales, asilo, o ajuste de estatus a residencia permanente. Antes de que un empleador lo despida, debe tener la oportunidad de presentar otra documentación.'
                        : 'Even when your work permit has expired or been revoked, you might still be legally authorized to work through other means, such as a work permit renewal, temporary protections, asylum, or adjusting status to permanent residency. Before an employer fires you, you should have the chance to present other documentation.'}
                    </p>
                  </div>
                  <div className="workplace-item">
                    <strong className="text-foreground">
                      {lang === 'es' ? 'Protección contra represalias' : 'Anti-retaliation protection'}
                    </strong>
                    <p className="text-sm text-muted-foreground">
                      {lang === 'es'
                        ? 'Un empleador no puede usar una auditoría de I-9 como pretexto para despedir empleados porque han exigido salarios no pagados o han ejercido sus derechos laborales. Empleadores inescrupulosos a veces usan auditorías internas de I-9 para tomar represalias contra trabajadores que se quejan o toman acción colectiva.'
                        : 'An employer cannot use an I-9 audit as a pretext to fire employees because they have demanded unpaid wages or exercised their workplace rights. Unscrupulous employers sometimes use internal I-9 audits to retaliate against workers who complain or take collective action.'}
                    </p>
                  </div>
                  <div className="workplace-item">
                    <strong className="text-foreground">
                      {lang === 'es' ? 'Derechos sindicales' : 'Union protections'}
                    </strong>
                    <p className="text-sm text-muted-foreground">
                      {lang === 'es'
                        ? 'Los trabajadores sindicalizados pueden tener derechos adicionales bajo convenios colectivos. Contacte a su sindicato directamente para más información.'
                        : 'Union members may have additional rights under collective bargaining agreements. Contact your union directly for more information.'}
                    </p>
                  </div>
              </div>
              <div className="workplace-detail">
                  <h3>
                    <Building2 className="h-5 w-5 text-blue-600" />
                    {lang === 'es' ? 'Reverificación del I-9' : 'I-9 Reverification'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'es'
                      ? 'Si al momento de ser contratado presentó un documento con fecha de vencimiento (como un permiso de trabajo), la ley federal requiere que su empleador verifique sus documentos nuevamente antes de que expire. Esto se llama reverificación.'
                      : 'If at the time of hire you presented a document with an expiration date (like a work permit), federal law requires your employer to check your documents again before it expires. This is called reverification.'}
                  </p>
                  <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
                      <strong>{lang === 'es' ? 'Revocación de permisos:' : 'Permit revocation:'}</strong>{' '}
                      {lang === 'es'
                        ? 'Un permiso de trabajo puede ser invalidado antes de su fecha de vencimiento si ha sido "revocado". Si su permiso es revocado, ya no puede usarse para demostrar autorización de trabajo, y su empleador puede requerir reverificación.'
                        : 'A work permit can become invalid before its expiration date if it has been "revoked." If your permit is revoked, it can no longer be used to show work authorization, and your employer may require reverification.'}
                    </AlertDescription>
                  </Alert>
                  <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
                      <strong>{lang === 'es' ? 'E-Verify y reportes de cambio de estatus:' : 'E-Verify & status change reports:'}</strong>{' '}
                      {lang === 'es'
                        ? 'En junio de 2025, DHS emitió orientación específica sobre revocaciones de permisos de trabajo para empleadores de E-Verify, alertándolos sobre un nuevo "Reporte de Cambio de Estatus." Ha habido casos de personas identificadas erróneamente en este reporte. Esta orientación solo aplica a empleadores de E-Verify.'
                        : 'In June 2025, DHS issued specific guidance about work permit revocations for E-Verify employers, alerting them to a "Status Change Report." There have been instances of individuals being erroneously identified in this report. This guidance only applies to E-Verify employers.'}
                    </AlertDescription>
                  </Alert>
                  <Alert className="bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
                      <strong>{lang === 'es' ? 'Extensiones automáticas eliminadas:' : 'Automatic extensions eliminated:'}</strong>{' '}
                      {lang === 'es'
                        ? 'En octubre de 2025, USCIS eliminó la extensión automática de permisos de trabajo (anteriormente hasta 540 días) para personas que solicitaron renovación. Verifique el estado actual de su permiso con un abogado.'
                        : 'In October 2025, USCIS eliminated the automatic work permit extension (previously up to 540 days) for people who applied to renew. Verify your current permit status with an attorney.'}
                    </AlertDescription>
                  </Alert>
              </div>
          </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="text-xs py-1 px-3">
                {lang === 'es'
                  ? 'Fuente: NILC, "Understanding Your Rights When Losing Work Authorization" (dic. 2025)'
                  : 'Source: NILC, "Understanding Your Rights When Losing Work Authorization" (Dec. 2025)'}
              </Badge>
            </div>
        </div>
      </section>
    <section id="workplace-help" className="workplace-section" tabIndex={-1}>
      <h2>{copy.help}</h2><p>{copy.helpNote}</p>
      <div className="workplace-resources">
        <a href="/immigration-guidance/find-attorney">{copy.legalHelp}</a>
        <a href="https://www.nilc.org/request-for-legal-assistance/" target="_blank" rel="noopener noreferrer">{copy.nilc}</a>
        <a href="https://www.aclu.org/affiliates" target="_blank" rel="noopener noreferrer">{copy.aclu}</a>
        <a href="/immigration-guidance/raids-toolkit">{copy.toolkit}</a>
      </div>
    </section>
  </ScanFirstPageFrame>;
}
