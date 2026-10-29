import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Clock, AlertTriangle, Scale, BookOpen, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { LegalTextHighlighter } from "@/components/legal-term-highlighter";
import { useJurisdiction } from "@/hooks/use-jurisdiction";
import { JurisdictionSelector } from "@/components/ui/jurisdiction-selector";
import { JurisdictionCallout } from "@/components/ui/jurisdiction-callout";

const stages = ["arrest", "booking", "firstAppearance", "pretrial", "discovery", "trial", "sentencing"] as const;
type Stage = typeof stages[number];

export default function CaseTimeline() {
  useScrollToTop();
  const { t } = useTranslation();
  const { jurisdiction, setJurisdiction } = useJurisdiction();
  const [selectedStage, setSelectedStage] = useState<Stage>("arrest");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusAfterChange = useRef(false);
  const stageIndex = stages.indexOf(selectedStage);
  const handleStageSelect = (stage: Stage, focusHeading = false) => {
    focusAfterChange.current = focusHeading;
    setSelectedStage(stage);
  };
  useEffect(() => {
    if (focusAfterChange.current) {
      headingRef.current?.focus();
      focusAfterChange.current = false;
    }
  }, [selectedStage]);
  return (
    <ScanFirstPageFrame mainClassName="timeline-page">
      <PageBreadcrumb items={[{ label: t("breadcrumb.home", "Home"), href: "/" }]} currentPage={t("caseTimeline.title", "Case Timeline & Process")} />
      <header className="timeline-width timeline-intro">
        <p className="timeline-label">{t("caseTimeline.title", "Case Timeline & Process")}</p>
        <h1>{t("caseTimeline.design.heading")}</h1>
        <p>{t("caseTimeline.subtitle", "Follow the stages of a criminal case from start to finish. Select your current stage to see what to expect and your rights.")}</p>
        <a className="timeline-link" href="#timeline-stages" data-testid="button-start-timeline">{t("caseTimeline.nextStep", "Choose your current stage")}</a>
      </header>
      <section id="timeline-stages" className="timeline-width timeline-layout" aria-label={t("caseTimeline.selectStage")}>
        <div>
          <nav className="timeline-stage-nav" aria-label={t("caseTimeline.selectStage")}>
            {stages.map((stage, i) => <button type="button" key={stage} aria-controls="timeline-panel" aria-current={selectedStage === stage ? "step" : undefined} onClick={() => handleStageSelect(stage)}>
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{t(`caseTimeline.stages.${stage}.title`)}
            </button>)}
          </nav>
          <label className="timeline-stage-mobile" htmlFor="timeline-stage-select">{t("caseTimeline.selectStage")}
            <select id="timeline-stage-select" value={selectedStage} onChange={e => handleStageSelect(e.target.value as Stage)} aria-controls="timeline-panel">
              {stages.map((stage, i) => <option key={stage} value={stage}>{i + 1}. {t(`caseTimeline.stages.${stage}.title`)}</option>)}
            </select>
          </label>
        </div>
        <section id="timeline-panel" className="timeline-panel" aria-labelledby="timeline-stage-heading">
          <p className="timeline-label" role="status">{t("caseTimeline.design.count", { step: stageIndex + 1, total: stages.length })}: {t(`caseTimeline.stages.${selectedStage}.title`)}</p>
          <h2 id="timeline-stage-heading" ref={headingRef} tabIndex={-1}>{t(`caseTimeline.stages.${selectedStage}.title`)}</h2>
          <LegalTextHighlighter text={t(`caseTimeline.stages.${selectedStage}.description`, "")} as="p" className="timeline-description" />
          <p className="timeline-time">{t(`caseTimeline.stages.${selectedStage}.timeframe`, "")}</p>
          <div className="timeline-jurisdiction">
            <JurisdictionSelector label={t("caseTimeline.design.state")} value={jurisdiction} onChange={setJurisdiction} />
          </div>
          <h3>{t("caseTimeline.yourRights", "Your Rights")}</h3>
          <ul className="timeline-rights">{(t(`caseTimeline.stages.${selectedStage}.rights`, { returnObjects: true }) as string[]).map((right, i) => <li key={i}><LegalTextHighlighter text={right} /></li>)}</ul>
          <details className="timeline-tips" open key={selectedStage}>
            <summary>{t("caseTimeline.whatToKnow", "What to Know")}</summary>
            <ul>{(t(`caseTimeline.stages.${selectedStage}.tips`, { returnObjects: true }) as string[]).map((tip, i) => <li key={i}><LegalTextHighlighter text={tip} /></li>)}</ul>
          </details>
          {selectedStage === "sentencing" && <div className="timeline-fees">
            <DollarSign className="h-4 w-4 shrink-0 mt-1" aria-hidden="true" /><div>
              <p className="font-medium">Court fines and fees are set at sentencing</p>
              <p>Fines, probation fees, restitution, and surcharges are typically ordered here. Many courts offer fee waivers and payment plans for those who qualify.</p>
              <Link href="/support/finances" className="timeline-link">Learn about managing court costs</Link>
            </div>
          </div>}
          {(selectedStage === "booking" || selectedStage === "firstAppearance") && <JurisdictionCallout jurisdiction={jurisdiction} topic={selectedStage === "booking" ? "bail" : "arraignment"} />}
          <div className="timeline-stage-actions">
            <button type="button" disabled={stageIndex === 0} onClick={() => handleStageSelect(stages[stageIndex - 1], true)} data-testid="timeline-previous">{t("caseTimeline.design.previous")}</button>
            <button type="button" disabled={stageIndex === stages.length - 1} onClick={() => handleStageSelect(stages[stageIndex + 1], true)} data-testid="timeline-next">{t("caseTimeline.design.next")}</button>
            <Link href="/quick-reference" className="timeline-link">{t("caseTimeline.viewQuickRef", "Quick-Reference Card")}</Link>
          </div>
          {selectedStage === "booking" && <a href="#bail-guide" className="timeline-link">{t("caseTimeline.design.bailLink")}</a>}
        </section>
      </section>
      <aside className="timeline-width timeline-caveat">
        <strong>{t("caseTimeline.disclaimer.title", "Important:")}</strong>{" "}
        {t("caseTimeline.disclaimer.text", "Every case is different. The stages shown are a general guide for a typical criminal case. Your case may have additional or fewer steps. Always consult with your attorney about your specific situation.")}{" "}
        {t("caseTimeline.disclaimer.deadlines", "Timeframes may be estimates or outdated; verify every deadline in your court papers or with an attorney or official court source.")}{" "}
        <Link href="/data-sources" className="timeline-link">{t("disclosure.sources", "Sources")}</Link>
      </aside>
      <nav className="timeline-width timeline-guide-links" aria-label={t("process.guides.title")}>
        <a className="timeline-link" href="#bail-guide">{t("process.guides.bail.title")}</a>
        <a className="timeline-link" href="#plea-guide">{t("process.guides.plea.title")}</a>
        <Link className="timeline-link" href="/case-guidance">{t("rights.disclaimer.caseGuidance")}</Link>
      </nav>
      {/* Detailed Guides */}
      <section className="timeline-guides" id="timeline-guides">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              {t('process.guides.title')}
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('process.guides.subtitle')}
            </p>
          </ScrollReveal>



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
              <Card className="timeline-guide-sheet">
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
              <Card className="timeline-guide-sheet" id="plea-guide">
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

    </ScanFirstPageFrame>
  );
}
