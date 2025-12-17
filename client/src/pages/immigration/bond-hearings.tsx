import { motion } from "framer-motion";
import { 
  Gavel, 
  Scale, 
  AlertTriangle, 
  ArrowLeft,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function BondHearings() {
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
                <Gavel className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white" data-testid="text-bond-hearings-title">
                {t('immigration.bond.title')}
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-3xl" data-testid="text-bond-hearings-subtitle">
              {t('immigration.bond.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <Alert className="max-w-4xl mx-auto px-4 mt-6 mb-8 bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800">
        <Scale className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200" data-testid="alert-bond-info">
          <strong>{t('immigration.common.importantLabel')}</strong> {t('immigration.bond.importantAlert')}
        </AlertDescription>
      </Alert>

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-what-is-bond-title">
              {t('immigration.bond.whatIsBond.title')}
            </h2>
          </ScrollReveal>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
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
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-eligibility-title">
              {t('immigration.bond.eligibility.title')}
            </h2>
          </ScrollReveal>
          
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

      <Footer />
    </div>
  );
}
