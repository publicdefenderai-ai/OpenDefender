import { BrandShieldIcon } from "@/components/brand-logo";
import { motion } from "framer-motion";
import { 
  
  AlertTriangle, 
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from 'react-i18next';
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { ImmigrationDetailLayout } from "@/components/immigration/immigration-detail-layout";

export default function DacaTps() {
  useScrollToTop();
  const { t } = useTranslation();
  
  const breadcrumbItems = [
    { label: t('breadcrumb.home', 'Home'), href: '/' },
    { label: t('breadcrumb.immigrationGuidance', 'Immigration Guidance'), href: '/immigration-guidance' }
  ];
  
  return (
    <ImmigrationDetailLayout
      title={t('immigration.daca.title')}
      subtitle={t('immigration.daca.subtitle')}
      breadcrumbItems={breadcrumbItems}
      icon={<BrandShieldIcon size={28} />}
      alert={
        <Alert className="border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-900 dark:text-amber-200" data-testid="alert-daca-disclaimer">
            <strong>{t('immigration.common.importantLabel')}</strong> {t('immigration.daca.disclaimer')}
          </AlertDescription>
        </Alert>
      }
    >

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <ScrollReveal>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle data-testid="text-daca-title">
                    {t('immigration.daca.dacaSection.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-foreground">{t('immigration.daca.dacaSection.whatIs')}</h4>
                    <p className="text-muted-foreground text-sm">
                      {t('immigration.daca.dacaSection.whatIsText')}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-foreground">{t('immigration.daca.dacaSection.eligibility')}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li>{t('immigration.daca.dacaSection.req1')}</li>
                      <li>{t('immigration.daca.dacaSection.req2')}</li>
                      <li>{t('immigration.daca.dacaSection.req3')}</li>
                      <li>{t('immigration.daca.dacaSection.req4')}</li>
                      <li>{t('immigration.daca.dacaSection.req5')}</li>
                      <li>{t('immigration.daca.dacaSection.req6')}</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Legal Framework — What DACA Is and Is Not
                    </h4>
                    <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1.5 list-disc list-inside">
                      <li>DACA is a <strong>DHS enforcement policy</strong> established by a June 2012 memorandum — it is not a law passed by Congress and does not provide a path to citizenship or permanent legal status.</li>
                      <li>The Supreme Court ruled in <em>DHS v. Regents of the Univ. of Cal.</em> (2020) that the 2017 attempt to rescind DACA was procedurally flawed — the Court did not rule that DHS must permanently maintain the program.</li>
                      <li><strong>New DACA applications remain blocked</strong> by a federal court order (5th Circuit, <em>Texas v. U.S.</em>). Only current recipients can renew.</li>
                      <li>Renewals have continued but the program's legal status is subject to ongoing litigation. Verify current status with an immigration attorney or <a href="https://www.uscis.gov/DACA" target="_blank" rel="noopener noreferrer" className="underline font-semibold">USCIS</a>.</li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">{t('immigration.daca.dacaSection.renewal')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('immigration.daca.dacaSection.renewalText')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle data-testid="text-tps-title">
                    {t('immigration.daca.tpsSection.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-foreground">{t('immigration.daca.tpsSection.whatIs')}</h4>
                    <p className="text-muted-foreground text-sm">
                      {t('immigration.daca.tpsSection.whatIsText')}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-foreground">{t('immigration.daca.tpsSection.countries')}</h4>
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                        <strong>TPS country designations change frequently.</strong> Countries may be added, removed, or have their TPS extended or terminated at any time based on current conditions. A static list here would become inaccurate.
                      </p>
                      <a
                        href="https://www.uscis.gov/humanitarian/temporary-protected-status"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-amber-700 dark:bg-amber-800 text-white rounded-lg text-sm font-medium hover:bg-amber-800 dark:hover:bg-amber-700 transition-colors"
                      >
                        View Current TPS Country List on USCIS
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-foreground">{t('immigration.daca.tpsSection.benefits')}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li>{t('immigration.daca.tpsSection.benefit1')}</li>
                      <li>{t('immigration.daca.tpsSection.benefit2')}</li>
                      <li>{t('immigration.daca.tpsSection.benefit3')}</li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">{t('immigration.daca.tpsSection.reregistration')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('immigration.daca.tpsSection.reregistrationText')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-what-if-status-lapses">
              {t('immigration.daca.statusLapse.title')}
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-6">
            <ScrollReveal delay={0.1}>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{t('immigration.daca.statusLapse.dontPanic')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('immigration.daca.statusLapse.dontPanicText')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{t('immigration.daca.statusLapse.gatherDocs')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('immigration.daca.statusLapse.gatherDocsText')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{t('immigration.daca.statusLapse.seekHelp')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('immigration.daca.statusLapse.seekHelpText')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-6">{t('immigration.daca.resources')}</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://www.uscis.gov/DACA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                data-testid="link-uscis-daca"
              >
                USCIS DACA Page
                <ExternalLink className="h-4 w-4" />
              </a>
              <a 
                href="https://www.uscis.gov/humanitarian/temporary-protected-status" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                data-testid="link-uscis-tps"
              >
                USCIS TPS Page
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </ImmigrationDetailLayout>
  );
}
