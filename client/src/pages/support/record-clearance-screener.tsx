import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// States with active automatic clearance programs
const AUTO_CLEARANCE_STATES = new Set(["CA", "IL", "NY", "PA", "MI", "CT", "DE", "NJ"]);
// Cannabis-only automatic clearance
const CANNABIS_AUTO_STATES = new Set(["CA", "IL", "NY"]);
// States with misdemeanor automatic clearance after waiting period
const MISDEMEANOR_AUTO_STATES = new Set(["PA", "MI", "CT", "DE", "NJ"]);

// States that typically do not allow felony expungement at all
const NO_FELONY_EXPUNGE_STATES = new Set([
  "AK", "AL", "CO", "HI", "ID", "KS", "LA", "ME", "MN", "MS",
  "MT", "ND", "NE", "NH", "OH", "OR", "SC", "SD", "TN", "TX",
  "UT", "VT", "WV", "WY",
]);

type Step = 1 | 2 | 3 | 4;
type RecordType = "arrest" | "misdemeanor" | "felony" | "marijuana";
type TimeframeType = "lt1" | "1to3" | "3to7" | "gt7";
type SentenceType = "complete" | "fines" | "probation";

type ResultType = "A" | "B" | "C" | "D";

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

function determineResult(answers: Answers): ResultType {
  const { state, recordType, timeframe, sentence } = answers;

  // Check for automatic clearance eligibility
  if (recordType === "marijuana" && AUTO_CLEARANCE_STATES.has(state)) {
    return "A";
  }
  if (recordType === "arrest" && AUTO_CLEARANCE_STATES.has(state)) {
    return "A";
  }
  if (
    recordType === "misdemeanor" &&
    MISDEMEANOR_AUTO_STATES.has(state) &&
    (timeframe === "3to7" || timeframe === "gt7") &&
    sentence === "complete"
  ) {
    return "A";
  }

  // Limited or no pathway for violent felonies
  if (recordType === "felony" && NO_FELONY_EXPUNGE_STATES.has(state)) {
    return "D";
  }

  // Not yet eligible
  if (sentence === "probation") {
    return "C";
  }
  if (timeframe === "lt1" || (timeframe === "1to3" && sentence !== "complete")) {
    return "C";
  }

  // Petition-based expungement may be available
  if (
    sentence === "complete" &&
    (timeframe === "3to7" || timeframe === "gt7")
  ) {
    return "B";
  }
  if (sentence === "complete" && timeframe === "1to3") {
    return "B";
  }
  if (sentence === "fines" && (timeframe === "3to7" || timeframe === "gt7")) {
    return "C";
  }

  return "C";
}

function ResultCard({ result }: { result: ResultType }) {
  const { t } = useTranslation();

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

  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Answers>({
    state: "",
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
              {result && <ResultCard result={result} />}
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
