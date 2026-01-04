import { motion } from "framer-motion";
import { 
  UserCheck, 
  AlertTriangle, 
  ExternalLink,
  Phone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from 'react-i18next';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function FindAttorney() {
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
        currentPage={t('immigration.attorney.title')} 
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
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white" data-testid="text-find-attorney-title">
                {t('immigration.attorney.title')}
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-3xl" data-testid="text-find-attorney-subtitle">
              {t('immigration.attorney.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <Alert className="max-w-4xl mx-auto px-4 mt-6 mb-8 bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200" data-testid="alert-scam-warning">
          <strong>{t('immigration.attorney.scamWarning')}</strong> {t('immigration.attorney.scamWarningText')}
        </AlertDescription>
      </Alert>

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-who-can-help-title">
              {t('immigration.attorney.whoCanHelp.title')}
            </h2>
          </ScrollReveal>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle data-testid="text-attorneys-title">
                    {t('immigration.attorney.whoCanHelp.attorneys.title')}
                  </CardTitle>
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
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle data-testid="text-accredited-reps-title">
                    {t('immigration.attorney.whoCanHelp.accredited.title')}
                  </CardTitle>
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-how-to-verify-title">
              {t('immigration.attorney.verify.title')}
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-6">
            <ScrollReveal delay={0.1}>
              <Card className="h-full">
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
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="h-full">
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
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="h-full">
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-red-flags-title">
              {t('immigration.attorney.redFlags.title')}
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="h-full border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400">
                    {t('immigration.attorney.redFlags.warnings.title')}
                  </CardTitle>
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
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="h-full border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-400">
                    {t('immigration.attorney.redFlags.legitimate.title')}
                  </CardTitle>
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-800 dark:text-blue-300">
                  <Phone className="h-5 w-5" />
                  {t('immigration.attorney.freeHelp.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-200">{t('immigration.attorney.freeHelp.organizations')}</h4>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300 list-disc list-inside">
                      <li>{t('immigration.attorney.freeHelp.org1')}</li>
                      <li>{t('immigration.attorney.freeHelp.org2')}</li>
                      <li>{t('immigration.attorney.freeHelp.org3')}</li>
                      <li>{t('immigration.attorney.freeHelp.org4')}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-200">{t('immigration.attorney.freeHelp.findingHelp')}</h4>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300 list-disc list-inside">
                      <li>{t('immigration.attorney.freeHelp.find1')}</li>
                      <li>{t('immigration.attorney.freeHelp.find2')}</li>
                      <li>{t('immigration.attorney.freeHelp.find3')}</li>
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
            <h2 className="text-2xl font-bold mb-6">{t('immigration.attorney.reportFraud.title')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('immigration.attorney.reportFraud.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
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
                href="https://www.justice.gov/eoir/office-of-the-chief-immigration-judge-background" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                data-testid="link-eoir-complaint"
              >
                {t('immigration.attorney.reportFraud.eoir')}
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
