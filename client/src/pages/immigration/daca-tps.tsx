import { motion } from "framer-motion";
import { 
  Shield, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ArrowLeft,
  ExternalLink,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function DacaTps() {
  useScrollToTop();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="vivid-header text-white py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link href="/immigration-guidance">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-4" data-testid="button-back-immigration">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('immigration.hub.backButton')}
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-transparent flex items-center justify-center ring-1 ring-white/20">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">{t('immigration.daca.badge')}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-white" data-testid="text-daca-tps-title">
                  {t('immigration.daca.title')}
                </h1>
              </div>
            </div>
            <p className="text-lg text-white/90 max-w-3xl" data-testid="text-daca-tps-subtitle">
              {t('immigration.daca.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <Alert className="max-w-4xl mx-auto px-4 -mt-6 relative z-20 mb-8 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200" data-testid="alert-daca-disclaimer">
          <strong>Important:</strong> {t('immigration.daca.disclaimer')}
        </AlertDescription>
      </Alert>

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <ScrollReveal>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" data-testid="text-daca-title">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent flex items-center justify-center ring-1 ring-blue-500/20">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
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
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{t('immigration.daca.dacaSection.req1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{t('immigration.daca.dacaSection.req2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{t('immigration.daca.dacaSection.req3')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{t('immigration.daca.dacaSection.req4')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{t('immigration.daca.dacaSection.req5')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{t('immigration.daca.dacaSection.req6')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-foreground">{t('immigration.daca.dacaSection.renewal')}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('immigration.daca.dacaSection.renewalText')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" data-testid="text-tps-title">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent flex items-center justify-center ring-1 ring-green-500/20">
                      <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
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
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{t('immigration.daca.tpsSection.benefit1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{t('immigration.daca.tpsSection.benefit2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{t('immigration.daca.tpsSection.benefit3')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-foreground">{t('immigration.daca.tpsSection.reregistration')}</h4>
                    </div>
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
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('immigration.daca.statusLapse.dontPanic')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('immigration.daca.statusLapse.dontPanicText')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('immigration.daca.statusLapse.gatherDocs')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('immigration.daca.statusLapse.gatherDocsText')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
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
