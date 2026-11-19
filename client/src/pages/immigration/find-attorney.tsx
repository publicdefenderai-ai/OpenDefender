import "./find-attorney.css";
import {
  AlertTriangle,
  ExternalLink,
  Phone
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from 'react-i18next';

import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { ClickToCall } from "@/components/ui/click-to-call";
import { ScanFirstPageFrame, PageSectionNav } from '@/components/layout/scan-first-page-frame';
import { PageBreadcrumb } from '@/components/navigation/page-breadcrumb';
import { RapidlyEvolvingNotice } from '@/components/immigration/rapidly-evolving-notice';
import { immigrationAttorneyCopy } from '@/locales/immigration-attorney-design';

export default function FindAttorney() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith('es') ? 'es' : i18n.language?.startsWith('zh') ? 'zh' : 'en';
  const design = immigrationAttorneyCopy[locale];

  const breadcrumbItems = [
    { label: t('breadcrumb.home', 'Home'), href: '/' },
    { label: t('breadcrumb.immigrationGuidance', 'Immigration Guidance'), href: '/immigration-guidance' }
  ];

  return (
    <ScanFirstPageFrame mainClassName="immigration-attorney-page">
      <PageBreadcrumb items={breadcrumbItems} currentPage={t('immigration.attorney.title')} />
      <header className="immigration-attorney-hero">
        <div>
          <h1 data-testid="immigration-detail-title">{design.title}{" "}<span>{design.accent}</span></h1>
          <p data-testid="immigration-detail-subtitle">{t('immigration.attorney.subtitle')}</p>
        </div>
        <img className="immigration-attorney-art" src="/images/design/immigration-attorney.svg" width="260" height="230" alt="" aria-hidden="true" />
      </header>
      <div className="immigration-attorney-notice">
        <Alert className="border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/40">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-900 dark:text-red-200" data-testid="alert-scam-warning">
            <strong>{t('immigration.attorney.scamWarning')}</strong> {t('immigration.attorney.scamWarningText')}
          </AlertDescription>
        </Alert>
      </div>
      <div className="immigration-attorney-paths">
        <a href="#affordable-help"><span>{design.affordable}</span><strong>{design.affordableAction}</strong></a>
        <a href="https://www.ailalawyer.com/" target="_blank" rel="noopener noreferrer"><span>{design.private}</span><strong>{t('immigration.attorney.verify.aila.link')}</strong></a>
      </div>
      <PageSectionNav ariaLabel={design.nav} items={[
        {id:'who-can-help',label:design.sections[0]},
        {id:'check-credentials',label:design.sections[1]},
        {id:'warning-signs',label:design.sections[2]},
        {id:'affordable-help',label:design.sections[3]},
        {id:'report-fraud',label:design.sections[4]}
      ]} />
      <RapidlyEvolvingNotice />
      <section id="who-can-help" tabIndex={-1} className="immigration-attorney-section">
        <div className="min-w-0">
            <h2 className="text-2xl font-bold mb-8" data-testid="text-who-can-help-title">
              {t('immigration.attorney.whoCanHelp.title')}
            </h2>


          <div className="grid lg:grid-cols-2 gap-8">
              <Card className="immigration-attorney-plain h-full">
                <CardHeader>
                  <h3 data-testid="text-attorneys-title">
                    {t('immigration.attorney.whoCanHelp.attorneys.title')}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t('immigration.attorney.whoCanHelp.attorneys.description')}
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                    <li>{t('immigration.attorney.whoCanHelp.attorneys.item1')}</li>
                    <li>{t('immigration.attorney.whoCanHelp.attorneys.item2')}</li>
                    <li>{t('immigration.attorney.whoCanHelp.attorneys.item3')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="immigration-attorney-plain h-full">
                <CardHeader>
                  <h3 data-testid="text-accredited-reps-title">
                    {t('immigration.attorney.whoCanHelp.accredited.title')}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t('immigration.attorney.whoCanHelp.accredited.description')}
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                    <li>{t('immigration.attorney.whoCanHelp.accredited.item1')}</li>
                    <li>{t('immigration.attorney.whoCanHelp.accredited.item2')}</li>
                    <li>{t('immigration.attorney.whoCanHelp.accredited.item3')}</li>
                  </ul>
                </CardContent>
              </Card>

          </div>
        </div>
      </section>

      <section id="check-credentials" tabIndex={-1} className="immigration-attorney-section">
        <div className="min-w-0">
            <h2 className="text-2xl font-bold mb-8" data-testid="text-how-to-verify-title">
              {t('immigration.attorney.verify.title')}
            </h2>


          <div className="grid md:grid-cols-3 gap-6">
              <Card className="immigration-attorney-plain h-full">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{t('immigration.attorney.verify.stateBar.title')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('immigration.attorney.verify.stateBar.description')}
                  </p>
                  <a
                    href="https://www.americanbar.org/groups/legal_services/flh-home/flh-bar-directories-and-lawyer-finders/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                    data-testid="link-bar-directory"
                  >
                    {t('immigration.attorney.verify.stateBar.link')}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </CardContent>
              </Card>

              <Card className="immigration-attorney-plain h-full">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{t('immigration.attorney.verify.eoir.title')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('immigration.attorney.verify.eoir.description')}
                  </p>
                  <a
                    href="https://www.justice.gov/eoir/recognized-organizations-and-accredited-representatives-roster-state-and-city"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                    data-testid="link-eoir-roster"
                  >
                    {t('immigration.attorney.verify.eoir.link')}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </CardContent>
              </Card>

              <Card className="immigration-attorney-plain h-full">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{t('immigration.attorney.verify.aila.title')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('immigration.attorney.verify.aila.description')}
                  </p>
                  <a
                    href="https://www.ailalawyer.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                    data-testid="link-aila-search"
                  >
                    {t('immigration.attorney.verify.aila.link')}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </CardContent>
              </Card>

          </div>
        </div>
      </section>

      <section id="warning-signs" tabIndex={-1} className="immigration-attorney-section">
        <div className="min-w-0">
            <h2 className="text-2xl font-bold mb-8" data-testid="text-red-flags-title">
              {t('immigration.attorney.redFlags.title')}
            </h2>


          <div className="grid md:grid-cols-2 gap-8">
              <Card className="h-full border-l-4 border-l-red-500">
                <CardHeader>
                  <h3 className="text-red-700 dark:text-red-400">
                    {t('immigration.attorney.redFlags.warnings.title')}
                  </h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>{t('immigration.attorney.redFlags.warnings.item1')}</li>
                    <li>{t('immigration.attorney.redFlags.warnings.item2')}</li>
                    <li>{t('immigration.attorney.redFlags.warnings.item3')}</li>
                    <li>{t('immigration.attorney.redFlags.warnings.item4')}</li>
                    <li>{t('immigration.attorney.redFlags.warnings.item5')}</li>
                    <li>{t('immigration.attorney.redFlags.warnings.item6')}</li>
                    <li>{t('immigration.attorney.redFlags.warnings.item7')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="h-full border-l-4 border-l-green-500">
                <CardHeader>
                  <h3 className="text-green-700 dark:text-green-400">
                    {t('immigration.attorney.redFlags.legitimate.title')}
                  </h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>{t('immigration.attorney.redFlags.legitimate.item1')}</li>
                    <li>{t('immigration.attorney.redFlags.legitimate.item2')}</li>
                    <li>{t('immigration.attorney.redFlags.legitimate.item3')}</li>
                    <li>{t('immigration.attorney.redFlags.legitimate.item4')}</li>
                    <li>{t('immigration.attorney.redFlags.legitimate.item5')}</li>
                    <li>{t('immigration.attorney.redFlags.legitimate.item6')}</li>
                    <li>{t('immigration.attorney.redFlags.legitimate.item7')}</li>
                  </ul>
                </CardContent>
              </Card>

          </div>
        </div>
      </section>

      <section id="affordable-help" tabIndex={-1} className="immigration-attorney-section">
        <div className="min-w-0">
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
              <CardHeader>
                <h2 className="flex items-center gap-3 text-blue-800 dark:text-blue-300">
                  <Phone className="h-5 w-5" />
                  {t('immigration.attorney.freeHelp.title')}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-200">{t('immigration.attorney.freeHelp.organizations')}</h3>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300 list-disc list-inside">
                      <li>{t('immigration.attorney.freeHelp.org1')}</li>
                      <li>{t('immigration.attorney.freeHelp.org2')}</li>
                      <li>{t('immigration.attorney.freeHelp.org3')}</li>
                      <li>{t('immigration.attorney.freeHelp.org4')}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-200">{t('immigration.attorney.freeHelp.findingHelp')}</h3>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300 list-disc list-inside">
                      <li>{t('immigration.attorney.freeHelp.find1')}</li>
                      <li>{t('immigration.attorney.freeHelp.find2')}</li>
                      <li>{t('immigration.attorney.freeHelp.find3')}</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-700">
                  <h3 className="font-semibold mb-4 text-blue-900 dark:text-blue-200">
                    {t('immigration.attorney.freeHelp.hotlines', 'Emergency Hotlines')}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <ClickToCall
                      variant="outline"
                      phoneNumber="1-800-354-0365"
                      label={t('immigration.attorney.freeHelp.nilfHotline', 'NILF Hotline')}
                      data-testid="button-call-nilf"
                    />
                    <ClickToCall
                      variant="outline"
                      phoneNumber="1-888-839-8682"
                      label={t('immigration.attorney.freeHelp.immigrantDefense', 'Immigrant Defense')}
                      data-testid="button-call-immigrant-defense"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

        </div>
      </section>

      <section id="report-fraud" tabIndex={-1} className="immigration-attorney-section">
        <div className="min-w-0">
            <h2 className="text-2xl font-bold mb-6">{t('immigration.attorney.reportFraud.title')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('immigration.attorney.reportFraud.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.ftc.gov/complaint"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                data-testid="link-ftc-complaint"
              >
                {t('immigration.attorney.reportFraud.ftc')}
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://www.justice.gov/eoir/immigration-court-information"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                data-testid="link-eoir-complaint"
              >
                {t('immigration.attorney.reportFraud.eoir')}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

        </div>
      </section>

    </ScanFirstPageFrame>
  );
}
