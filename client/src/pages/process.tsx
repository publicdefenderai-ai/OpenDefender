import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Shield, Scale, AlertTriangle, Users, ArrowRight, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { LegalTextHighlighter } from "@/components/legal-term-highlighter";

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
            <CardContent className="space-y-4">
              <LegalTextHighlighter text={description} as="p" className="text-muted-foreground" />
              
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  {t('process.steps.yourRights')}
                </h4>
                <ul className="space-y-1">
                  {rights.map((right, index) => (
                    <li key={index} className="text-sm text-blue-800 dark:text-blue-200">
                      • <LegalTextHighlighter text={right} />
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

      <section className="py-8 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/case-timeline">
                <Card className="hover:shadow-md hover:border-teal-400 dark:hover:border-teal-600 transition-all duration-200 cursor-pointer group h-full">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="bg-teal-100 dark:bg-teal-900/40 p-3 rounded-lg shrink-0">
                      <Clock className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                        {t('caseTimeline.title', 'Case Timeline')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t('process.crossLinks.timeline', 'Interactive guide — select your stage to see rights and tips')}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </Link>
              <Link href="/quick-reference">
                <Card className="hover:shadow-md hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-200 cursor-pointer group h-full">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="bg-rose-100 dark:bg-rose-900/40 p-3 rounded-lg shrink-0">
                      <FileText className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors">
                        {t('quickRef.title', 'Quick-Reference Cards')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t('process.crossLinks.quickRef', 'Printable cards with your rights at every stage')}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </Link>
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

      {/* Detailed Guides Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              {t('process.guides.title')}
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              {t('process.guides.subtitle')}
            </p>
          </ScrollReveal>

          <div className="space-y-8">
            {/* Cash Bail Guide */}
            <ScrollReveal delay={0.1}>
              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardHeader className="bg-green-50 dark:bg-green-950/50">
                  <CardTitle className="text-green-800 dark:text-green-200">
                    {t('process.guides.bail.title')}
                  </CardTitle>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                    {t('process.guides.bail.intro')}
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="bail-what">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('process.guides.bail.whatIs.title')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.bail.whatIs.description')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {(t('process.guides.bail.whatIs.points', { returnObjects: true }) as string[]).map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="bail-set">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('process.guides.bail.howSet.title')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.bail.howSet.description')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {(t('process.guides.bail.howSet.factors', { returnObjects: true }) as string[]).map((factor, idx) => (
                            <li key={idx}>{factor}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="bail-options">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('process.guides.bail.options.title')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4 pl-6">
                        {(t('process.guides.bail.options.types', { returnObjects: true }) as { name: string; description: string }[]).map((option, idx) => (
                          <div key={idx} className="border-l-2 border-green-300 pl-3">
                            <strong className="text-foreground">{option.name}</strong>
                            <p className="text-sm mt-1">{option.description}</p>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="bail-afford">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('process.guides.bail.cantAfford.title')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.bail.cantAfford.description')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {(t('process.guides.bail.cantAfford.options', { returnObjects: true }) as string[]).map((opt, idx) => (
                            <li key={idx}>{opt}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="bail-conditions">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('process.guides.bail.conditions.title')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.bail.conditions.description')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {(t('process.guides.bail.conditions.examples', { returnObjects: true }) as string[]).map((ex, idx) => (
                            <li key={idx}>{ex}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="bail-miss">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('process.guides.bail.missCourt.title')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.bail.missCourt.description')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {(t('process.guides.bail.missCourt.consequences', { returnObjects: true }) as string[]).map((con, idx) => (
                            <li key={idx}>{con}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Plea Bargain Guide */}
            <ScrollReveal delay={0.2}>
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader className="bg-blue-50 dark:bg-blue-950/50">
                  <CardTitle className="text-blue-800 dark:text-blue-200">
                    {t('process.guides.plea.title')}
                  </CardTitle>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                    {t('process.guides.plea.intro')}
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="plea-what">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('process.guides.plea.whatIs.title')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.plea.whatIs.description')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {(t('process.guides.plea.whatIs.points', { returnObjects: true }) as string[]).map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="plea-types">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('process.guides.plea.types.title')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4 pl-6">
                        {(t('process.guides.plea.types.deals', { returnObjects: true }) as { name: string; description: string }[]).map((deal, idx) => (
                          <div key={idx} className="border-l-2 border-blue-300 pl-3">
                            <strong className="text-foreground">{deal.name}</strong>
                            <p className="text-sm mt-1">{deal.description}</p>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="plea-rights">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('process.guides.plea.rights.title')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.plea.rights.description')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {(t('process.guides.plea.rights.list', { returnObjects: true }) as string[]).map((right, idx) => (
                            <li key={idx}>{right}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="plea-questions">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('process.guides.plea.questions.title')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.plea.questions.description')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {(t('process.guides.plea.questions.list', { returnObjects: true }) as string[]).map((q, idx) => (
                            <li key={idx}>{q}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="plea-collateral">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('process.guides.plea.collateral.title')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.plea.collateral.description')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {(t('process.guides.plea.collateral.consequences', { returnObjects: true }) as string[]).map((con, idx) => (
                            <li key={idx}>{con}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="plea-decide">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('process.guides.plea.decide.title')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.plea.decide.description')}</p>
                        <div className="grid md:grid-cols-2 gap-4 mt-3">
                          <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                            <strong className="text-green-700 dark:text-green-300 text-sm">{t('process.guides.plea.decide.acceptTitle')}</strong>
                            <ul className="list-disc pl-4 mt-2 space-y-1 text-sm">
                              {(t('process.guides.plea.decide.acceptReasons', { returnObjects: true }) as string[]).map((r, idx) => (
                                <li key={idx}>{r}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                            <strong className="text-blue-700 dark:text-blue-300 text-sm">{t('process.guides.plea.decide.trialTitle')}</strong>
                            <ul className="list-disc pl-4 mt-2 space-y-1 text-sm">
                              {(t('process.guides.plea.decide.trialReasons', { returnObjects: true }) as string[]).map((r, idx) => (
                                <li key={idx}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Quick Reference Cards */}
          <ScrollReveal delay={0.3}>
            <div className="grid md:grid-cols-2 gap-6 mt-10">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Clock className="h-5 w-5 text-green-600 mr-2" />
                    {t('process.additionalInfo.speedyTrial.title')}
                  </h3>
                  <LegalTextHighlighter text={t('process.additionalInfo.speedyTrial.text')} as="p" className="text-sm text-muted-foreground" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    {t('process.additionalInfo.publicDefender.title')}
                  </h3>
                  <LegalTextHighlighter text={t('process.additionalInfo.publicDefender.text')} as="p" className="text-sm text-muted-foreground" />
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
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
