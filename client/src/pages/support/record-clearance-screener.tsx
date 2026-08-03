import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearch } from "wouter";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Scale,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getExpungementByState,
  hasAutomaticClearance,
  automaticClearanceData,
} from "@/lib/expungement-data";

type Step = 1 | 2 | 3 | 4;
type RecordType = "arrest" | "misdemeanor" | "felony" | "marijuana";
type TimeframeType = "lt1" | "1to3" | "3to7" | "gt7";
type SentenceType = "complete" | "fines" | "probation";

type ResultType = "A" | "B" | "C" | "D";

// Lower-bound months for each timeframe bucket, checked against each state's
// real waitingPeriods data (client/src/lib/expungement-data.ts) — conservative
// on purpose so the tool never tells someone they're eligible before they are.
const TIMEFRAME_MONTHS: Record<TimeframeType, number> = {
  lt1: 0,
  "1to3": 12,
  "3to7": 36,
  gt7: 84,
};

interface Answers {
  state: string;
  recordType: RecordType | "";
  timeframe: TimeframeType | "";
  sentence: SentenceType | "";
}

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "Washington D.C." },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

// Determines the coarse A/B/C/D bucket for the result headline, backed by
// each state's real waitingPeriods/automatic-clearance data instead of
// hardcoded, uncited state lists. The full state-specific overview,
// exclusions, and sources (from getExpungementByState) are shown alongside
// this bucket in ResultCard — the bucket is a starting signal, not the
// whole answer.
function determineResult(answers: Answers): ResultType {
  const { state, recordType, timeframe, sentence } = answers;
  if (!state || !recordType || !timeframe || !sentence) return "C";

  const rule = getExpungementByState(state);
  const autoInfo = automaticClearanceData[state];
  const monthsSince = TIMEFRAME_MONTHS[timeframe];

  // Automatic clearance — only when the state's program actually covers this
  // offense type (client/src/lib/expungement-data.ts automaticClearanceData).
  if (hasAutomaticClearance(state) && autoInfo) {
    const types = autoInfo.offenseTypes.map((o) => o.toLowerCase());
    if (recordType === "marijuana" && types.some((t) => t.includes("marijuana") || t.includes("cannabis"))) {
      return "A";
    }
    if (recordType === "arrest") {
      return "A";
    }
    if (
      sentence === "complete" &&
      ((recordType === "misdemeanor" && types.some((t) => t.includes("misdemeanor"))) ||
        (recordType === "felony" && types.some((t) => t.includes("felon"))))
    ) {
      return "A";
    }
  }

  // Still under supervision
  if (sentence === "probation") {
    return "C";
  }

  const waitingPeriods = rule?.waitingPeriods as
    | { misdemeanorMonths?: number; felonyMonths?: number }
    | undefined;
  const requiredMonths =
    recordType === "felony"
      ? waitingPeriods?.felonyMonths
      : recordType === "misdemeanor"
        ? waitingPeriods?.misdemeanorMonths
        : 0; // arrests and marijuana-only records without an automatic program are treated as petition-eligible once complete

  // Our data shows no defined felony waiting period for this state — limited
  // or no pathway, rather than guessing.
  if (recordType === "felony" && !requiredMonths) {
    return "D";
  }

  if (sentence === "fines") {
    return "C";
  }

  if (requiredMonths !== undefined && monthsSince < requiredMonths) {
    return "C";
  }

  return "B";
}

function ResultCard({ result, state, recordType }: { result: ResultType; state: string; recordType: RecordType | "" }) {
  const { t } = useTranslation();
  const rule = getExpungementByState(state);
  const autoInfo = automaticClearanceData[state];
  const showAutoClearance =
    hasAutomaticClearance(state) &&
    autoInfo &&
    (result === "A" ||
      (recordType === "marijuana" && autoInfo.offenseTypes.some((o) => o.toLowerCase().includes("marijuana") || o.toLowerCase().includes("cannabis"))));
  const stateName = US_STATES.find((s) => s.code === state)?.name ?? state;
  const visibleExclusions = rule?.exclusions?.slice(0, 5) ?? [];
  const remainingExclusions = (rule?.exclusions?.length ?? 0) - visibleExclusions.length;

  const configs = {
    A: {
      icon: CheckCircle,
      colorClass: "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30",
      iconClass: "text-green-600 dark:text-green-400",
      badgeClass: "border-green-400 text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40",
    },
    B: {
      icon: CheckCircle,
      colorClass: "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30",
      iconClass: "text-green-600 dark:text-green-400",
      badgeClass: "border-green-400 text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40",
    },
    C: {
      icon: Clock,
      colorClass: "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30",
      iconClass: "text-amber-600 dark:text-amber-400",
      badgeClass: "border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40",
    },
    D: {
      icon: AlertTriangle,
      colorClass: "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/30",
      iconClass: "text-slate-600 dark:text-slate-400",
      badgeClass: "border-slate-400 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/40",
    },
  };

  const config = configs[result];
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      <Card className={`border-2 ${config.colorClass}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 shrink-0 ${config.iconClass}`} />
            <CardTitle className="text-lg">
              {t(`screener.results.${result}.title`)}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(`screener.results.${result}.message`)}
          </p>
        </CardContent>
      </Card>

      {showAutoClearance && autoInfo && (
        <Card className="border-teal-300 dark:border-teal-700 bg-teal-50/60 dark:bg-teal-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
              {t("screener.autoClearance.heading", { state: stateName })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {autoInfo.legislation && (
              <p>
                <span className="font-semibold text-foreground">{t("screener.autoClearance.legislationLabel")}</span>{" "}
                <span className="text-muted-foreground">{autoInfo.legislation}</span>
              </p>
            )}
            <p>
              <span className="font-semibold text-foreground">{t("screener.autoClearance.offenseTypesLabel")}</span>{" "}
              <span className="text-muted-foreground">{autoInfo.offenseTypes.join(", ")}</span>
            </p>
            {autoInfo.waitingPeriodNote && (
              <p>
                <span className="font-semibold text-foreground">{t("screener.autoClearance.waitingPeriodLabel")}</span>{" "}
                <span className="text-muted-foreground">{autoInfo.waitingPeriodNote}</span>
              </p>
            )}
            {autoInfo.notes && <p className="text-muted-foreground">{autoInfo.notes}</p>}
            {autoInfo.link && (
              <a
                href={autoInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-medium hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {t("screener.autoClearance.linkLabel")}
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {rule ? (
        <Card className="border border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4 shrink-0" />
              {t("screener.stateInfo.heading", { state: stateName })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{rule.overview}</p>

            {visibleExclusions.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  {t("screener.stateInfo.exclusionsLabel")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {visibleExclusions.map((exclusion, i) => (
                    <Badge key={i} variant="outline" className="text-xs font-normal">
                      {exclusion}
                    </Badge>
                  ))}
                  {remainingExclusions > 0 && (
                    <Badge variant="outline" className="text-xs font-normal">
                      {t("screener.stateInfo.moreExclusions", { count: remainingExclusions })}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {rule.sources && rule.sources.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  {t("screener.stateInfo.sourcesLabel")}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {rule.sources.map((source, i) => (
                    <span key={i} className="text-xs text-muted-foreground">
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Alert className="border-border bg-muted/40">
          <AlertDescription className="text-sm text-muted-foreground">
            {t("screener.stateInfo.noDataNote", { state: stateName })}
          </AlertDescription>
        </Alert>
      )}

      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("screener.resources.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li>
              <a
                href="https://www.codeforamerica.org/programs/clear-my-record/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{t("screener.resources.clearMyRecord")}</span>
              </a>
            </li>
            <li>
              <a
                href="https://cleanslateinitiative.org/states/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{t("screener.resources.cleanSlate")}</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.lawhelp.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{t("screener.resources.lawHelp")}</span>
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
        <AlertDescription className="text-xs text-amber-800 dark:text-amber-300">
          {t("screener.disclaimer")}
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default function RecordClearanceScreener() {
  const { t } = useTranslation();
  useScrollToTop();

  // Deep-linking support (e.g. from site search: /support/reputation/eligibility?state=CA)
  // pre-selects the state and skips straight to step 2 instead of making the
  // user re-pick a state they already told us via the link.
  const searchParams = new URLSearchParams(useSearch());
  const stateFromUrl = searchParams.get("state")?.toUpperCase() ?? "";
  const isValidStateFromUrl = US_STATES.some((s) => s.code === stateFromUrl);

  const [step, setStep] = useState<Step>(isValidStateFromUrl ? 2 : 1);
  const [answers, setAnswers] = useState<Answers>({
    state: isValidStateFromUrl ? stateFromUrl : "",
    recordType: "",
    timeframe: "",
    sentence: "",
  });
  const [showResult, setShowResult] = useState(false);

  const totalSteps = 4;

  const handleStateChange = (state: string) => {
    setAnswers((prev) => ({ ...prev, state }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => (prev + 1) as Step);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
    } else if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({ state: "", recordType: "", timeframe: "", sentence: "" });
    setShowResult(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canProceed = () => {
    if (step === 1) return answers.state !== "";
    if (step === 2) return answers.recordType !== "";
    if (step === 3) return answers.timeframe !== "";
    if (step === 4) return answers.sentence !== "";
    return false;
  };

  const result = showResult ? determineResult(answers) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-amber-500/5 via-background to-background border-b border-border/40">
          <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <ShieldCheck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {t("screener.title")}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {t("screener.subtitle")}
              </p>
              <div className="mt-3">
                <Link href="/support/reputation" className="text-sm text-primary hover:underline">
                  {t("screener.backToReputation")}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Screener Body */}
        <div className="max-w-2xl mx-auto px-4 py-10">
          {!showResult ? (
            <ScrollReveal>
              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        s === step
                          ? "bg-amber-500 text-white"
                          : s < step
                          ? "bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s < step ? <CheckCircle className="h-4 w-4" /> : s}
                    </div>
                    {s < 4 && (
                      <div
                        className={`h-1 w-8 rounded-full ${
                          s < step ? "bg-amber-300 dark:bg-amber-700" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {t("screener.stepIndicator", { current: step, total: totalSteps })}
                </span>
              </div>

              {/* Step 1: State */}
              {step === 1 && (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">{t("screener.step1.question")}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t("screener.step1.hint")}</p>
                  </CardHeader>
                  <CardContent>
                    <select
                      value={answers.state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="">{t("screener.step1.placeholder")}</option>
                      {US_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Record Type */}
              {step === 2 && (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">{t("screener.step2.question")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(["arrest", "misdemeanor", "felony", "marijuana"] as RecordType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, recordType: type }))}
                          className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                            answers.recordType === type
                              ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100"
                              : "border-border hover:border-amber-300 hover:bg-muted/50"
                          }`}
                        >
                          {t(`screener.step2.options.${type}`)}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Timeframe */}
              {step === 3 && (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">{t("screener.step3.question")}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t("screener.step3.hint")}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(["lt1", "1to3", "3to7", "gt7"] as TimeframeType[]).map((tf) => (
                        <button
                          key={tf}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, timeframe: tf }))}
                          className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                            answers.timeframe === tf
                              ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100"
                              : "border-border hover:border-amber-300 hover:bg-muted/50"
                          }`}
                        >
                          {t(`screener.step3.options.${tf}`)}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Sentence completion */}
              {step === 4 && (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">{t("screener.step4.question")}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t("screener.step4.hint")}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(["complete", "fines", "probation"] as SentenceType[]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, sentence: s }))}
                          className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                            answers.sentence === s
                              ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100"
                              : "border-border hover:border-amber-300 hover:bg-muted/50"
                          }`}
                        >
                          {t(`screener.step4.options.${s}`)}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t("screener.back")}
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {step === totalSteps ? t("screener.seeResult") : t("screener.next")}
                  {step < totalSteps && <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal>
              {result && <ResultCard result={result} state={answers.state} recordType={answers.recordType} />}
              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" onClick={handleBack} className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  {t("screener.back")}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2"
                >
                  {t("screener.startOver")}
                </Button>
              </div>
            </ScrollReveal>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
