import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Clock,
  ChevronRight,
  AlertTriangle,
  Scale,
  Gavel,
  UserCheck,
  FileText,
  Users,
  Search,
  BookOpen,
  HandMetal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { LegalTextHighlighter } from "@/components/legal-term-highlighter";

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
    { label: t("process.hero.title", "Criminal Justice Process"), href: "/process" },
  ];

  const currentStage = stages.find((s) => s.id === selectedStage) || stages[0];
  const stageIndex = stages.findIndex((s) => s.id === selectedStage);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb
        items={breadcrumbItems}
        currentPage={t("caseTimeline.title", "Case Timeline")}
      />

      <section className="vivid-header py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                {t("caseTimeline.title", "Case Timeline")}
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
              <Card className={`border-2 ${currentStage.borderColor}`}>
                <CardHeader className={currentStage.bgColor}>
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
                    <div className="bg-green-50 dark:bg-green-950/30 p-5 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
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

                    <div className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-lg border border-amber-200 dark:border-amber-800">
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
              </AlertDescription>
            </Alert>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
