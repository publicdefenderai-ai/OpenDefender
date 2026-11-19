import "./bond-hearings.css";
import { immigrationUpdates } from "@/locales/immigration-updates";

import {
  Gavel,
  Scale,
  Phone,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from 'react-i18next';

import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { ScanFirstPageFrame, PageSectionNav } from '@/components/layout/scan-first-page-frame';
import { PageBreadcrumb } from '@/components/navigation/page-breadcrumb';
import { RapidlyEvolvingNotice } from '@/components/immigration/rapidly-evolving-notice';
import { immigrationBondCopy } from '@/locales/immigration-bond-design';

export default function BondHearings() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const copy = immigrationUpdates[i18n.language?.startsWith('es') ? 'es' : i18n.language?.startsWith('zh') ? 'zh' : 'en'];

  const locale = i18n.language?.startsWith('es') ? 'es' : i18n.language?.startsWith('zh') ? 'zh' : 'en';
  const design = immigrationBondCopy[locale];

  return (
    <ScanFirstPageFrame mainClassName="immigration-bond-page">
      <PageBreadcrumb items={[{ label: design.home, href: '/' }, { label: design.immigration, href: '/immigration-guidance' }]} currentPage={design.title} />
      <header className="immigration-bond-hero">
        <div>
          <h1 data-testid="immigration-detail-title">{design.title} <span>{design.accent}</span></h1>
          <p  data-testid="immigration-detail-subtitle">{t('immigration.bond.subtitle')}</p>

        </div>
        <img className="immigration-bond-art" src="/images/design/immigration-bond.svg" alt="" aria-hidden="true" width="260" height="230" />
      </header>

      <PageSectionNav ariaLabel={design.nav} items={[{ id: "bond-basics", label: design.sections[0] }, { id: "eligibility", label: design.sections[1] }, { id: "hearing-process", label: design.sections[2] }, { id: "bond-denied", label: design.sections[3] }, { id: "find-help", label: design.sections[4] }]} />
      <div className="immigration-bond-notice" >
        <Alert className="border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40">
          <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-900 dark:text-blue-200" data-testid="alert-bond-info">
            <strong>{t('immigration.common.importantLabel')}</strong> {t('immigration.bond.importantAlert')}
          </AlertDescription>
        </Alert>
      </div>
      <RapidlyEvolvingNotice />
      <div className="immigration-bond-reading" >


      <section id="bond-basics" tabIndex={-1} className="immigration-bond-section">
        <div className="min-w-0">

            <h2 className="text-2xl font-bold mb-8" data-testid="text-what-is-bond-title">
              {t('immigration.bond.whatIsBond.title')}
            </h2>


          <div className="grid lg:grid-cols-2 gap-8 mb-6">

              <Card className="immigration-bond-plain h-full">
                <CardHeader>
                  <CardTitle>
                    {t('immigration.bond.whatIsBond.delivery.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('immigration.bond.whatIsBond.delivery.description')}
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm"><strong>{t('immigration.bond.whatIsBond.delivery.amount')}</strong> {t('immigration.bond.whatIsBond.delivery.amountValue')}</p>
                    <p className="text-sm"><strong>{t('immigration.bond.whatIsBond.delivery.setter')}</strong> {t('immigration.bond.whatIsBond.delivery.setterValue')}</p>
                  </div>
                </CardContent>
              </Card>



              <Card className="immigration-bond-plain h-full">
                <CardHeader>
                  <CardTitle>
                    {t('immigration.bond.whatIsBond.voluntary.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('immigration.bond.whatIsBond.voluntary.description')}
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm"><strong>{t('immigration.bond.whatIsBond.voluntary.amount')}</strong> {t('immigration.bond.whatIsBond.voluntary.amountValue')}</p>
                    <p className="text-sm"><strong>{t('immigration.bond.whatIsBond.voluntary.benefit')}</strong> {t('immigration.bond.whatIsBond.voluntary.benefitValue')}</p>
                  </div>
                </CardContent>
              </Card>

          </div>


            <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-700 mb-4">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
                <strong>About these amounts:</strong> The figures shown are typical historical starting ranges only. Immigration judges have broad discretion and may set bond significantly higher — or deny it entirely — based on flight risk, community ties, and danger to the community. Your actual bond will depend on your specific circumstances. Consult an immigration attorney for a realistic assessment.
              </AlertDescription>
            </Alert>

        </div>
      </section>

      <section id="eligibility" tabIndex={-1} className="immigration-bond-section">
        <div className="min-w-0">

            <h2 className="text-2xl font-bold mb-8" data-testid="text-eligibility-title">
              {t('immigration.bond.eligibility.title')}
            </h2>


          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-4 text-sm text-amber-800 dark:text-amber-200">
            <p>{copy.bondNotice}</p>
            <p className="mt-3">{copy.postOrder}</p>
            <a href="https://www.law.cornell.edu/uscode/text/8/1226" target="_blank" rel="noopener noreferrer" className="underline">8 U.S.C. § 1226</a>{" · "}
            <a href="https://www.law.cornell.edu/uscode/text/8/1231" target="_blank" rel="noopener noreferrer" className="underline">8 U.S.C. § 1231</a>

          </div>

          <div className="grid lg:grid-cols-2 gap-8">

              <Card className="h-full border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-400">
                    {t('immigration.bond.eligibility.mayBeEligible')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>{t('immigration.bond.eligibility.eligible1')}</li>
                    <li>{t('immigration.bond.eligibility.eligible2')}</li>
                    <li>{t('immigration.bond.eligibility.eligible3')}</li>
                    <li>{t('immigration.bond.eligibility.eligible4')}</li>
                    <li>{t('immigration.bond.eligibility.eligible5')}</li>
                  </ul>
                </CardContent>
              </Card>



              <Card className="h-full border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400">
                    {t('immigration.bond.eligibility.mandatoryDetention')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>{t('immigration.bond.eligibility.mandatory1')}</li>
                    <li>{t('immigration.bond.eligibility.mandatory2')}</li>
                    <li>{t('immigration.bond.eligibility.mandatory3')}</li>
                    <li>{t('immigration.bond.eligibility.mandatory4')}</li>
                    <li>{t('immigration.bond.eligibility.mandatory5')}</li>
                  </ul>
                </CardContent>
              </Card>

          </div>
        </div>
      </section>

      <section id="hearing-process" tabIndex={-1} className="immigration-bond-section">
        <div className="min-w-0">

            <h2 className="text-2xl font-bold mb-8" data-testid="text-hearing-process-title">
              {t('immigration.bond.process.title')}
            </h2>


          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <Card className="immigration-bond-plain flex-1 min-w-0">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{t('immigration.bond.process.step1')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('immigration.bond.process.step1Text')}
                      </p>
                    </CardContent>
                  </Card>
                </div>



                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <Card className="immigration-bond-plain flex-1 min-w-0">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{t('immigration.bond.process.step2')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('immigration.bond.process.step2Text')}
                      </p>
                    </CardContent>
                  </Card>
                </div>



                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <Card className="immigration-bond-plain flex-1 min-w-0">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{t('immigration.bond.process.step3')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('immigration.bond.process.step3Text')}
                      </p>
                    </CardContent>
                  </Card>
                </div>



                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    4
                  </div>
                  <Card className="immigration-bond-plain flex-1 min-w-0">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{t('immigration.bond.process.step4')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('immigration.bond.process.step4Text')}
                      </p>
                    </CardContent>
                  </Card>
                </div>

            </div>
          </div>
        </div>
      </section>

      <section id="bond-denied" tabIndex={-1} className="immigration-bond-section">
        <div className="min-w-0">

            <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="h-5 w-5" />
                  {t('immigration.bond.denied.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-amber-900 dark:text-amber-200">{t('immigration.bond.denied.options')}</h4>
                    <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300 list-disc list-inside">
                      <li>{t('immigration.bond.denied.option1')}</li>
                      <li>{t('immigration.bond.denied.option2')}</li>
                      <li>{t('immigration.bond.denied.option3')}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-amber-900 dark:text-amber-200">{t('immigration.bond.denied.timeline')}</h4>
                    <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300 list-disc list-inside">
                      <li>{t('immigration.bond.denied.time1')}</li>
                      <li>{t('immigration.bond.denied.time2')}</li>
                      <li>{t('immigration.bond.denied.time3')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

        </div>
      </section>

      <section id="find-help" tabIndex={-1} className="immigration-bond-section">
        <div className="min-w-0">

            <h2 className="text-2xl font-bold mb-6">{t('immigration.bond.resources.title')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('immigration.bond.resources.subtitle')}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="immigration-bond-plain">
                <CardContent className="pt-6">
                  <Phone className="h-6 w-6 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold">{t('immigration.bond.resources.bailFund')}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('immigration.bond.resources.bailFundText')}
                  </p>
                </CardContent>
              </Card>
              <Card className="immigration-bond-plain">
                <CardContent className="pt-6">
                  <Scale className="h-6 w-6 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold">{t('immigration.bond.resources.raices')}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('immigration.bond.resources.raicesText')}
                  </p>
                </CardContent>
              </Card>
            </div>

        </div>
      </section>

    </div>
    </ScanFirstPageFrame>
  );
}
