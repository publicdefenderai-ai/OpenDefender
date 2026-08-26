import { motion } from "framer-motion";
import { 
  Gavel, 
  Scale, 
  Phone,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from 'react-i18next';
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { ImmigrationDetailLayout } from "@/components/immigration/immigration-detail-layout";

export default function BondHearings() {
  useScrollToTop();
  const { t } = useTranslation();
  
  const breadcrumbItems = [
    { label: t('breadcrumb.home', 'Home'), href: '/' },
    { label: t('breadcrumb.immigrationGuidance', 'Immigration Guidance'), href: '/immigration-guidance' }
  ];
  
  return (
    <ImmigrationDetailLayout
      title={t('immigration.bond.title')}
      subtitle={t('immigration.bond.subtitle')}
      breadcrumbItems={breadcrumbItems}
      icon={<Gavel className="h-7 w-7" />}
      alert={
        <Alert className="border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40">
          <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-900 dark:text-blue-200" data-testid="alert-bond-info">
            <strong>{t('immigration.common.importantLabel')}</strong> {t('immigration.bond.importantAlert')}
          </AlertDescription>
        </Alert>
      }
    >

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-what-is-bond-title">
              {t('immigration.bond.whatIsBond.title')}
            </h2>
          </ScrollReveal>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-6">
            <ScrollReveal delay={0.1}>
              <Card className="h-full">
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
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="h-full">
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
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-700 mb-4">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
                <strong>About these amounts:</strong> The figures shown are typical historical starting ranges only. Immigration judges have broad discretion and may set bond significantly higher — or deny it entirely — based on flight risk, community ties, and danger to the community. Your actual bond will depend on your specific circumstances. Consult an immigration attorney for a realistic assessment.
              </AlertDescription>
            </Alert>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-eligibility-title">
              {t('immigration.bond.eligibility.title')}
            </h2>
          </ScrollReveal>
          
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-4 text-sm text-amber-800 dark:text-amber-200">
            <strong>These are general indicators, not a determination.</strong> Mandatory detention is defined by statute (<a href="https://uscode.house.gov/view.xhtml?req=(title:8+section:1226+edition:prelim)" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 font-medium">8 U.S.C. § 1226(c)</a>), but courts apply it inconsistently and enforcement can be broader than these categories suggest. Whether you qualify for bond depends on how the law is applied to your specific conviction. An immigration attorney must evaluate your situation before any bond hearing.
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
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
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-hearing-process-title">
              {t('immigration.bond.process.title')}
            </h2>
          </ScrollReveal>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <ScrollReveal delay={0.1}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <Card className="flex-1">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{t('immigration.bond.process.step1')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('immigration.bond.process.step1Text')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <Card className="flex-1">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{t('immigration.bond.process.step2')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('immigration.bond.process.step2Text')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <Card className="flex-1">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{t('immigration.bond.process.step3')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('immigration.bond.process.step3Text')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    4
                  </div>
                  <Card className="flex-1">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{t('immigration.bond.process.step4')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('immigration.bond.process.step4Text')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
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
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-6">{t('immigration.bond.resources.title')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('immigration.bond.resources.subtitle')}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <Phone className="h-6 w-6 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold">{t('immigration.bond.resources.bailFund')}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('immigration.bond.resources.bailFundText')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Scale className="h-6 w-6 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold">{t('immigration.bond.resources.raices')}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('immigration.bond.resources.raicesText')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </ImmigrationDetailLayout>
  );
}
