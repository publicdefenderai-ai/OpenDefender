import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Shield, Scale, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

// Process steps are now in i18n translations

function ProcessStep({ number, title, description, timeframe, rights, isLast, t }: {
  number: number;
  title: string;
  description: string;
  timeframe: string;
  rights: string[];
  isLast?: boolean;
  t: any;
}) {
  return (
    <div className="relative">
      <div className="flex items-start gap-6">
        {/* Timeline Marker */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
            {number}
          </div>
          {!isLast && (
            <div className="w-1 flex-1 bg-blue-300 dark:bg-blue-800 min-h-[100px] mt-4"></div>
          )}
        </div>

        {/* Content Card */}
        <div className="flex-1 pb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{title}</span>
                <Badge variant="secondary" className="ml-4">
                  <Clock className="h-3 w-3 mr-1" />
                  {timeframe}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{description}</p>
              
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  {t('process.steps.yourRights')}
                </h4>
                <ul className="space-y-1">
                  {rights.map((right, index) => (
                    <li key={index} className="text-sm text-blue-800 dark:text-blue-200">
                      • {right}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Process() {
  useScrollToTop();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Teal Vivid Header */}
      <section className="vivid-header-teal py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 vivid-header-content">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                <Calendar className="inline h-10 w-10 mr-2 mb-2" />
                {t('process.hero.title')}
              </h1>
              <p className="text-xl text-white/85 max-w-3xl mx-auto">
                {t('process.hero.subtitle')}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <Alert className="mb-12 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
              <Scale className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>{t('process.alert.important')}</strong> {t('process.alert.text')}
              </AlertDescription>
            </Alert>
          </ScrollReveal>

          <div className="space-y-0">
            {[1, 2, 3, 4, 5, 6, 7].map((stepNum) => (
              <ScrollReveal key={`step${stepNum}`} delay={(stepNum - 1) * 0.1}>
                <ProcessStep
                  number={stepNum}
                  title={t(`process.steps.step${stepNum}.title`)}
                  description={t(`process.steps.step${stepNum}.description`)}
                  timeframe={t(`process.steps.step${stepNum}.timeframe`)}
                  rights={t(`process.steps.step${stepNum}.rights`, { returnObjects: true }) as string[]}
                  isLast={stepNum === 7}
                  t={t}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              {t('process.additionalInfo.title')}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    {t('process.additionalInfo.pleaBargains.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('process.additionalInfo.pleaBargains.text')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Clock className="h-5 w-5 text-green-600 mr-2" />
                    {t('process.additionalInfo.speedyTrial.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('process.additionalInfo.speedyTrial.text')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <Alert className="mt-8 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>{t('process.legalDisclaimer.title')}</strong> {t('process.legalDisclaimer.text')}
              </AlertDescription>
            </Alert>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      {/* Privacy Footer Banner */}
      <div className="legal-blue text-white py-3 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">
              <strong>{t('common.privacyFirst')}:</strong> {t('footer.privacyNotice')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
