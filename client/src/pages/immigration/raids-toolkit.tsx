import {
  AlertTriangle,
  Phone,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import "./raids-toolkit.css";
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { ScenarioGuide } from '@/components/immigration/scenario-guide';
import { SafetyChecklist } from '@/components/immigration/safety-checklist';
import { EmergencyCard } from '@/components/immigration/emergency-card';
import { ScanFirstPageFrame, PageSectionNav } from '@/components/layout/scan-first-page-frame';
import { PageBreadcrumb } from '@/components/navigation/page-breadcrumb';
import { RapidlyEvolvingNotice } from '@/components/immigration/rapidly-evolving-notice';
import { immigrationToolkitCopy } from '@/locales/immigration-toolkit-design';
import { translationUnavailableNotice } from '@shared/translation-unavailable-notice';
import { ClickToCallLink } from '@/components/ui/click-to-call';

export default function RaidsToolkit() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const locale = i18n.language?.startsWith('zh') ? 'zh' : lang;
  const design = immigrationToolkitCopy[locale];



  return (
    <ScanFirstPageFrame mainClassName="immigration-toolkit-page">
      <PageBreadcrumb items={[{label:design.home,href:'/'},{label:design.immigration,href:'/immigration-guidance'}]} currentPage={design.page} />
      <header className="immigration-toolkit-hero">
        <div>
          <h1>{design.title}<span>{design.accent}</span></h1>
          {locale === 'zh' && <p role="note" lang="zh" data-testid="toolkit-translation-notice">{translationUnavailableNotice(i18n.language)}</p>}
          <p lang={lang}>{lang === 'es'
              ? 'Recursos de preparación comunitaria y orientación específica para diferentes escenarios de encuentro con ICE. Prepárese antes de que ocurra una emergencia.'
              : 'Community preparedness resources and scenario-specific guidance for different ICE encounters. Prepare before an emergency happens.'}</p>
        </div>
        <img className="immigration-toolkit-art" src="/images/design/immigration-toolkit.svg" width="260" height="240" alt="" aria-hidden="true" />
      </header>
      <div lang={lang} className="immigration-toolkit-notice">
        <Alert className="border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/40">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-900 dark:text-red-200">
            <strong>{lang === 'es' ? 'RECUERDE:' : 'REMEMBER:'}</strong>{' '}
            {lang === 'es'
              ? 'La preparación es clave. Tenga un plan antes de que ocurra una emergencia. Estos derechos aplican a TODAS las personas en Estados Unidos.'
              : 'Preparation is key. Have a plan before an emergency happens. These rights apply to ALL persons in the United States.'}
          </AlertDescription>
        </Alert>
      </div>
      <PageSectionNav ariaLabel={design.nav} items={[{id:'scenarios',label:design.sections[0]},{id:'checklist',label:design.sections[1]},{id:'emergency-card',label:design.sections[2]},{id:'resources',label:design.sections[3]}]} />
      <a className="immigration-toolkit-rights" href="/immigration-guidance/know-your-rights">{design.rights}</a>
      <RapidlyEvolvingNotice />
      <div lang={lang}>
      {/* Scenario Guides Section */}
      <section id="scenarios" tabIndex={-1} className="immigration-toolkit-section">
        <div className="min-w-0">
            <h2 className="text-2xl font-bold mb-2">
              {lang === 'es' ? 'Guías por Escenario' : 'Scenario Guides'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Seleccione un escenario para ver instrucciones paso a paso sobre qué hacer durante un encuentro con ICE.'
                : 'Select a scenario to see step-by-step instructions on what to do during an ICE encounter.'}
            </p>

            <ScenarioGuide />

        </div>
      </section>

      {/* Safety Checklist Section */}
      <section id="checklist" tabIndex={-1} className="immigration-toolkit-section">
        <div className="min-w-0">
            <h2 className="text-2xl font-bold mb-2">
              {lang === 'es' ? 'Lista de Preparación de Seguridad' : 'Safety Preparedness Checklist'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Use esta lista interactiva para prepararse para posibles encuentros de inmigración. Su progreso se guarda en su dispositivo.'
                : 'Use this interactive checklist to prepare for potential immigration encounters. Your progress is saved on your device.'}
            </p>

            <SafetyChecklist />

        </div>
      </section>

      {/* Emergency Card Section */}
      <section id="emergency-card" tabIndex={-1} className="immigration-toolkit-section">
        <div className="min-w-0">
            <h2 className="text-2xl font-bold mb-2">
              {lang === 'es' ? 'Tarjeta de Contacto de Emergencia' : 'Emergency Contact Card'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Cree una tarjeta personalizada con sus contactos de emergencia para tenerla a mano.'
                : 'Create a personalized card with your emergency contacts to have ready.'}
            </p>

            <EmergencyCard />

        </div>
      </section>

      {/* Additional Resources */}
      <section id="resources" tabIndex={-1} className="immigration-toolkit-section">
        <div className="min-w-0">
            <h2 className="text-2xl font-bold mb-6">
              {lang === 'es' ? 'Recursos Adicionales' : 'Additional Resources'}
            </h2>


          <div className="grid md:grid-cols-3 gap-6">
              <Card className="immigration-toolkit-resource h-full">
                <CardHeader>
                  <h3 className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    {lang === 'es' ? 'Líneas de Emergencia' : 'Emergency Hotlines'}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm">NILC</p>
                    <ClickToCallLink
                      phoneNumber="213-639-3900"
                      className="font-bold"
                      data-testid="link-hotline-nilc"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">United We Dream</p>
                    <ClickToCallLink
                      phoneNumber="1-844-363-1423"
                      className="font-bold"
                      data-testid="link-hotline-uwd"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">ACLU</p>
                    <ClickToCallLink
                      phoneNumber="212-549-2660"
                      className="font-bold"
                      data-testid="link-hotline-aclu"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="immigration-toolkit-resource h-full">
                <CardHeader>
                  <h3 className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    {lang === 'es' ? 'Materiales Imprimibles' : 'Printable Materials'}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href="/immigration-guidance/know-your-rights"
                    className="block text-sm text-primary hover:underline"
                  >
                    {lang === 'es' ? '→ Tarjetas Rojas (Conozca Sus Derechos)' : '→ Red Cards (Know Your Rights)'}
                  </a>
                  <a
                    href="/immigration-guidance/family-planning"
                    className="block text-sm text-primary hover:underline"
                  >
                    {lang === 'es' ? '→ Plantillas de Autorización de Cuidador' : '→ Caregiver Authorization Templates'}
                  </a>
                  <a
                    href="#emergency-card"
                    className="block text-sm text-primary hover:underline"
                  >
                    {lang === 'es' ? '→ Tarjeta de Contacto de Emergencia' : '→ Emergency Contact Card'}
                  </a>
                </CardContent>
              </Card>

              <Card className="immigration-toolkit-resource h-full">
                <CardHeader>
                  <h3 className="flex items-center gap-2 text-lg">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    {lang === 'es' ? 'Enlaces Externos' : 'External Links'}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href="https://www.ilrc.org/red-cards"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                    data-testid="link-ilrc-red-cards"
                  >
                    ILRC Red Cards <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href="https://www.nilc.org/issues/immigration-enforcement/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                    data-testid="link-nilc-enforcement"
                  >
                    NILC Enforcement Resources <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href="https://www.aclu.org/know-your-rights/immigrants-rights"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                    data-testid="link-aclu-immigrant-rights"
                  >
                    ACLU Immigrants' Rights <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="family-help" tabIndex={-1} className="immigration-toolkit-section">
        <div className="min-w-0">
            <h2 className="text-2xl font-bold mb-4">
              {lang === 'es' ? 'Preparación Familiar' : 'Family Preparedness'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Cree un plan completo para su familia, incluyendo poderes notariales y planes de cuidado de niños.'
                : 'Create a comprehensive plan for your family, including power of attorney and childcare plans.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <a href="/immigration-guidance/family-planning">
                  {lang === 'es' ? 'Crear Plan Familiar' : 'Create Family Plan'}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/immigration-guidance/find-attorney">
                  {lang === 'es' ? 'Encontrar un Abogado' : 'Find an Attorney'}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/warrants">
                  {lang === 'es' ? 'Órdenes Judiciales y Sus Derechos' : 'Warrants & Your Rights'}
                </a>
              </Button>
            </div>

        </div>
      </section>

    </div>
    </ScanFirstPageFrame>
  );
}
