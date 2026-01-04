import { motion } from "framer-motion";
import { 
  Shield, 
  AlertTriangle, 
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function DacaTps() {
  useScrollToTop();
  const { t } = useTranslation();
  
  const breadcrumbItems = [
    { label: t('breadcrumb.home', 'Home'), href: '/' },
    { label: t('breadcrumb.immigrationGuidance', 'Immigration Guidance'), href: '/immigration-guidance' }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb 
        items={breadcrumbItems} 
        currentPage={t('immigration.daca.title')} 
      />

      <section className="vivid-header text-white py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-transparent flex items-center justify-center ring-1 ring-white/20">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white" data-testid="text-daca-tps-title">
                {t('immigration.daca.title')}
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-3xl" data-testid="text-daca-tps-subtitle">
              {t('immigration.daca.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <Alert className="max-w-4xl mx-auto px-4 mt-6 mb-8 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200" data-testid="alert-daca-disclaimer">
          <strong>{t('immigration.common.importantLabel')}</strong> {t('immigration.daca.disclaimer')}
        </AlertDescription>
      </Alert>

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
                    <div className="flex flex-wrap gap-2">
                      {['Afghanistan', 'Cameroon', 'El Salvador', 'Ethiopia', 'Haiti', 'Honduras', 'Myanmar', 'Nepal', 'Nicaragua', 'Somalia', 'South Sudan', 'Sudan', 'Syria', 'Ukraine', 'Venezuela', 'Yemen'].map((country) => (
                        <Badge key={country} variant="outline" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('immigration.daca.tpsSection.countriesNote')}
                    </p>
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

      <Footer />
    </div>
  );
}
