import { BrandShieldIcon } from "@/components/brand-logo";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  AlertTriangle,
  Scale,
  Gavel,
  FileText,
  Users,
  Search,
  BookOpen,
  HandMetal,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { LegalTextHighlighter } from "@/components/legal-term-highlighter";
import { useJurisdiction } from "@/hooks/use-jurisdiction";
import { JurisdictionSelector } from "@/components/ui/jurisdiction-selector";
import { JurisdictionCallout } from "@/components/ui/jurisdiction-callout";

interface TimelineStage {
  id: string;
  number: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const stages: TimelineStage[] = [
  { id: "arrest", number: 1, icon: <HandMetal className="h-5 w-5" />, color: "text-red-700 dark:text-red-300", bgColor: "bg-red-100 dark:bg-red-900/40", borderColor: "border-red-300 dark:border-red-700" },
  { id: "booking", number: 2, icon: <FileText className="h-5 w-5" />, color: "text-orange-700 dark:text-orange-300", bgColor: "bg-orange-100 dark:bg-orange-900/40", borderColor: "border-orange-300 dark:border-orange-700" },
  { id: "firstAppearance", number: 3, icon: <Gavel className="h-5 w-5" />, color: "text-amber-700 dark:text-amber-300", bgColor: "bg-amber-100 dark:bg-amber-900/40", borderColor: "border-amber-300 dark:border-amber-700" },
  { id: "pretrial", number: 4, icon: <Scale className="h-5 w-5" />, color: "text-blue-700 dark:text-blue-300", bgColor: "bg-blue-100 dark:bg-blue-900/40", borderColor: "border-blue-300 dark:border-blue-700" },
  { id: "discovery", number: 5, icon: <Search className="h-5 w-5" />, color: "text-indigo-700 dark:text-indigo-300", bgColor: "bg-indigo-100 dark:bg-indigo-900/40", borderColor: "border-indigo-300 dark:border-indigo-700" },
  { id: "trial", number: 6, icon: <Users className="h-5 w-5" />, color: "text-purple-700 dark:text-purple-300", bgColor: "bg-purple-100 dark:bg-purple-900/40", borderColor: "border-purple-300 dark:border-purple-700" },
  { id: "sentencing", number: 7, icon: <BookOpen className="h-5 w-5" />, color: "text-slate-700 dark:text-slate-300", bgColor: "bg-slate-100 dark:bg-slate-800/60", borderColor: "border-slate-300 dark:border-slate-700" },
];

export default function CaseTimeline() {
  useScrollToTop();
  const { t } = useTranslation();
  const { jurisdiction } = useJurisdiction();
  const [selectedStage, setSelectedStage] = useState<string>("arrest");
  const [direction, setDirection] = useState<number>(1);
  const prevStageRef = useRef<string>("arrest");

  const handleStageSelect = (stageId: string) => {
    const prevIdx = stages.findIndex(s => s.id === prevStageRef.current);
    const nextIdx = stages.findIndex(s => s.id === stageId);
    setDirection(nextIdx >= prevIdx ? 1 : -1);
    prevStageRef.current = stageId;
    setSelectedStage(stageId);
  };

  const breadcrumbItems = [
    { label: t("breadcrumb.home", "Home"), href: "/" },
  ];

  const currentStage = stages.find((s) => s.id === selectedStage) || stages[0];
  const stageIndex = stages.findIndex((s) => s.id === selectedStage);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb
        items={breadcrumbItems}
        currentPage={t("caseTimeline.title", "Case Timeline & Process")}
      />

      <section className="vivid-header py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                {t("caseTimeline.title", "Case Timeline & Process")}
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                {t("caseTimeline.subtitle", "Follow the stages of a criminal case from start to finish. Select your current stage to see what to expect and your rights.")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal>
            <div className="mb-8 text-center">
              <p className="text-muted-foreground">
                {t("caseTimeline.selectStage", "Select a stage to learn what happens and what your rights are")}
              </p>
            </div>

            <div className="relative mb-12">
              <div className="hidden md:block absolute top-6 left-[calc(100%/14)] right-[calc(100%/14)] h-1 bg-muted rounded-full" />
              <div
                className="hidden md:block absolute top-6 left-[calc(100%/14)] h-1 bg-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(stageIndex / (stages.length - 1)) * (100 - 100 / 7)}%` }}
              />

              <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0">
                {stages.map((stage, idx) => {
                  const isActive = stage.id === selectedStage;
                  const isPast = idx < stageIndex;
                  return (
                    <button
                      key={stage.id}
                      onClick={() => handleStageSelect(stage.id)}
                      className="flex md:flex-col items-center gap-3 md:gap-2 group focus-visible:outline-none"
                      aria-label={t(`caseTimeline.stages.${stage.id}.title`, stage.id)}
                      aria-current={isActive ? "step" : undefined}
                    >
                      <div
                        className={`
                          relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold
                          transition-all duration-300 shrink-0
                          ${isActive
                            ? "bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-800 scale-110"
                            : isPast
                              ? "bg-blue-500 text-white"
                              : "bg-muted text-muted-foreground group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-blue-700 dark:group-hover:text-blue-300"
                          }
                          group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2
                        `}
                      >
                        {stage.number}
                      </div>
                      <span
                        className={`text-xs md:text-sm font-medium transition-colors md:text-center md:max-w-[100px]
                          ${isActive ? "text-blue-700 dark:text-blue-300" : "text-muted-foreground group-hover:text-foreground"}
                        `}
                      >
                        {t(`caseTimeline.stages.${stage.id}.title`, stage.id)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={selectedStage}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -60 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <Card className="editorial-card border-l-4 border-l-primary">
                <CardHeader className="bg-muted/30">
                  <CardTitle className={`flex items-center gap-3 ${currentStage.color}`}>
                    {currentStage.icon}
                    <span>
                      {t(`caseTimeline.stages.${selectedStage}.title`, selectedStage)}
                    </span>
                    <Badge variant="secondary" className="ml-auto">
                      <Clock className="h-3 w-3 mr-1" />
                      {t(`caseTimeline.stages.${selectedStage}.timeframe`, "")}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <LegalTextHighlighter
                    text={t(`caseTimeline.stages.${selectedStage}.description`, "")}
                    as="p"
                    className="text-muted-foreground text-lg leading-relaxed"
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="editorial-card p-5 border-l-4 border-l-emerald-600">
                      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                        <BrandShieldIcon size={16} />
                        {t("caseTimeline.yourRights", "Your Rights")}
                      </h3>
                      <ul className="space-y-2">
                        {(t(`caseTimeline.stages.${selectedStage}.rights`, { returnObjects: true }) as string[]).map(
                          (right, idx) => (
                            <li key={idx} className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
                              <span className="text-green-500 mt-0.5 shrink-0">&#10003;</span>
                              <LegalTextHighlighter text={right} />
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="editorial-card p-5 border-l-4 border-l-amber-500">
                      <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {t("caseTimeline.whatToKnow", "What to Know")}
                      </h3>
                      <ul className="space-y-2">
                        {(t(`caseTimeline.stages.${selectedStage}.tips`, { returnObjects: true }) as string[]).map(
                          (tip, idx) => (
                            <li key={idx} className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5 shrink-0">&#9679;</span>
                              <LegalTextHighlighter text={tip} />
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  {selectedStage === 'sentencing' && (
                    <div className="mt-4 p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30 flex items-start gap-3">
                      <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          Court fines and fees are set at sentencing
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Fines, probation fees, restitution, and surcharges are typically ordered here.
                          Many courts offer fee waivers and payment plans for those who qualify.
                        </p>
                        <Link href="/support/finances">
                          <Button variant="link" size="sm" className="p-0 h-auto text-amber-700 dark:text-amber-400 font-medium">
                            Learn about managing court costs →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    {stageIndex > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStageSelect(stages[stageIndex - 1].id)}
                      >
                        ← {t(`caseTimeline.stages.${stages[stageIndex - 1].id}.title`, "Previous")}
                      </Button>
                    )}
                    {stageIndex < stages.length - 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStageSelect(stages[stageIndex + 1].id)}
                      >
                        {t(`caseTimeline.stages.${stages[stageIndex + 1].id}.title`, "Next")} →
                      </Button>
                    )}
                    <Link href="/quick-reference">
                      <Button variant="secondary" size="sm" className="ml-auto">
                        <FileText className="h-4 w-4 mr-1" />
                        {t("caseTimeline.viewQuickRef", "Quick-Reference Card")}
                      </Button>
                    </Link>
                  </div>

                  {selectedStage === 'booking' && (
                    <a href="#bail-guide" className="inline-flex items-center gap-2 text-sm text-green-700 dark:text-green-400 hover:underline font-medium mt-2">
                      <DollarSign className="h-4 w-4" />
                      How bail works — types, options if you can't pay, and conditions ↓
                    </a>
                  )}

                  {(selectedStage === 'booking' || selectedStage === 'firstAppearance') && (
                    <div className="mt-4">
                      <JurisdictionCallout
                        jurisdiction={jurisdiction}
                        topic={selectedStage === 'booking' ? 'bail' : 'arraignment'}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <ScrollReveal delay={0.2}>
            <Alert className="mt-8 border-border">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-muted-foreground">
                <strong>{t("caseTimeline.disclaimer.title", "Important:")}</strong>{" "}
                {t("caseTimeline.disclaimer.text", "Every case is different. The stages shown are a general guide for a typical criminal case. Your case may have additional or fewer steps. Always consult with your attorney about your specific situation.")}
                {" "}
                {t("caseTimeline.disclaimer.deadlines", "Timeframes may be estimates or outdated; verify every deadline in your court papers or with an attorney or official court source.")}{" "}
                <Link href="/data-sources" className="font-medium text-primary underline underline-offset-2">
                  {t("disclosure.sources", "Sources")}
                </Link>
              </AlertDescription>
            </Alert>
          </ScrollReveal>
        </div>
      </section>

      {/* Detailed Guides */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              {t('process.guides.title')}
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('process.guides.subtitle')}
            </p>
          </ScrollReveal>

          <JurisdictionSelector label="See rules for your state (optional)" />

          <ScrollReveal>
            <Alert className="my-8 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
              <Scale className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>{t('process.alert.important')}</strong> {t('process.alert.text')}
              </AlertDescription>
            </Alert>
          </ScrollReveal>

          <div className="space-y-8">
            {/* Bail Guide */}
            <ScrollReveal delay={0.1}>
              <div id="bail-guide" className="scroll-mt-20">
              <Card className="editorial-card border-l-4 border-l-green-600">
                  <CardHeader className="bg-muted/30">
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
                        <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.bail.whatIs.title')}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                          <p>{t('process.guides.bail.whatIs.description')}</p>
                          <ul className="list-disc pl-4 space-y-1">
                            {(t('process.guides.bail.whatIs.points', { returnObjects: true }) as string[]).map((point, idx) => <li key={idx}>{point}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="bail-set">
                        <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.bail.howSet.title')}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                          <p>{t('process.guides.bail.howSet.description')}</p>
                          <ul className="list-disc pl-4 space-y-1">
                            {(t('process.guides.bail.howSet.factors', { returnObjects: true }) as string[]).map((factor, idx) => <li key={idx}>{factor}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="bail-options">
                        <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.bail.options.title')}</AccordionTrigger>
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
                        <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.bail.cantAfford.title')}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                          <p>{t('process.guides.bail.cantAfford.description')}</p>
                          <ul className="list-disc pl-4 space-y-1">
                            {(t('process.guides.bail.cantAfford.options', { returnObjects: true }) as string[]).map((opt, idx) => <li key={idx}>{opt}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="bail-conditions">
                        <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.bail.conditions.title')}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                          <p>{t('process.guides.bail.conditions.description')}</p>
                          <ul className="list-disc pl-4 space-y-1">
                            {(t('process.guides.bail.conditions.examples', { returnObjects: true }) as string[]).map((ex, idx) => <li key={idx}>{ex}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="bail-miss">
                        <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.bail.missCourt.title')}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                          <p>{t('process.guides.bail.missCourt.description')}</p>
                          <ul className="list-disc pl-4 space-y-1">
                            {(t('process.guides.bail.missCourt.consequences', { returnObjects: true }) as string[]).map((con, idx) => <li key={idx}>{con}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="bail-deny">
                        <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.bail.preventiveDetention.title')}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                          <p>{t('process.guides.bail.preventiveDetention.description')}</p>
                          <ul className="list-disc pl-4 space-y-1">
                            {(t('process.guides.bail.preventiveDetention.points', { returnObjects: true }) as string[]).map((point, idx) => <li key={idx}>{point}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="bail-schedule">
                        <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.bail.schedule.title')}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                          <p>{t('process.guides.bail.schedule.description')}</p>
                          <ul className="list-disc pl-4 space-y-1">
                            {(t('process.guides.bail.schedule.points', { returnObjects: true }) as string[]).map((point, idx) => <li key={idx}>{point}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="bail-landscape">
                        <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.bail.landscape.title')}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                          <p>{t('process.guides.bail.landscape.description')}</p>
                          <ul className="list-disc pl-4 space-y-1">
                            {(t('process.guides.bail.landscape.points', { returnObjects: true }) as string[]).map((point, idx) => <li key={idx}>{point}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="bail-risk">
                        <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.bail.riskAssessment.title')}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                          <p>{t('process.guides.bail.riskAssessment.description')}</p>
                          <ul className="list-disc pl-4 space-y-1">
                            {(t('process.guides.bail.riskAssessment.points', { returnObjects: true }) as string[]).map((point, idx) => <li key={idx}>{point}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>

            {/* Plea Bargain Guide */}
            <ScrollReveal delay={0.2}>
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardHeader className="bg-muted/30">
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
                      <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.plea.whatIs.title')}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.plea.whatIs.description')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {(t('process.guides.plea.whatIs.points', { returnObjects: true }) as string[]).map((point, idx) => <li key={idx}>{point}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="plea-types">
                      <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.plea.types.title')}</AccordionTrigger>
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
                      <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.plea.rights.title')}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.plea.rights.description')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {(t('process.guides.plea.rights.list', { returnObjects: true }) as string[]).map((right, idx) => <li key={idx}>{right}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="plea-questions">
                      <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.plea.questions.title')}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.plea.questions.description')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {(t('process.guides.plea.questions.list', { returnObjects: true }) as string[]).map((q, idx) => <li key={idx}>{q}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="plea-collateral">
                      <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.plea.collateral.title')}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.plea.collateral.description')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {(t('process.guides.plea.collateral.consequences', { returnObjects: true }) as string[]).map((con, idx) => <li key={idx}>{con}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="plea-decide">
                      <AccordionTrigger className="text-left hover:no-underline">{t('process.guides.plea.decide.title')}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-3 pl-6">
                        <p>{t('process.guides.plea.decide.description')}</p>
                        <div className="grid md:grid-cols-2 gap-4 mt-3">
                          <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                            <strong className="text-green-700 dark:text-green-300 text-sm">{t('process.guides.plea.decide.acceptTitle')}</strong>
                            <ul className="list-disc pl-4 mt-2 space-y-1 text-sm">
                              {(t('process.guides.plea.decide.acceptReasons', { returnObjects: true }) as string[]).map((r, idx) => <li key={idx}>{r}</li>)}
                            </ul>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                            <strong className="text-blue-700 dark:text-blue-300 text-sm">{t('process.guides.plea.decide.trialTitle')}</strong>
                            <ul className="list-disc pl-4 mt-2 space-y-1 text-sm">
                              {(t('process.guides.plea.decide.trialReasons', { returnObjects: true }) as string[]).map((r, idx) => <li key={idx}>{r}</li>)}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Speedy Trial + Public Defender */}
            <ScrollReveal delay={0.3}>
              <div className="grid md:grid-cols-2 gap-6">
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
          </div>

          <ScrollReveal delay={0.4}>
            <Alert className="mt-8 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>{t('process.legalDisclaimer.title')}</strong> {t('process.legalDisclaimer.text')}
              </AlertDescription>
            </Alert>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <div className="mt-6 rounded-xl border border-orange-200 dark:border-orange-800/60 bg-orange-50/60 dark:bg-orange-950/20 p-4 flex items-start gap-3">
              <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Planning for what comes after sentencing?</p>
                <p className="text-sm text-muted-foreground mb-2">
                  The Re-entry Resources hub covers ID restoration, housing, employment with a record, and voting rights — with direct action steps and verified resources.
                </p>
                <Link href="/support/reentry">
                  <Button variant="link" size="sm" className="p-0 h-auto text-orange-700 dark:text-orange-400 font-medium">
                    Go to Re-entry Resources →
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
