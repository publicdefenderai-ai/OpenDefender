import { type Ref, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearch } from "wouter";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Scale,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { clearanceDesignCopy } from "@/locales/clearance-design";
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

function ResultCard({ result, state, recordType, headingRef }: { headingRef: Ref<HTMLHeadingElement>; result: ResultType; state: string; recordType: RecordType | "" }) {
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

  return (
    <div className="clearance-results space-y-6">
      <section className="clearance-outcome">
        <h2 ref={headingRef} tabIndex={-1}>{t(`screener.results.${result}.title`)}</h2>
        <p>{t(`screener.results.${result}.message`)}</p>
      </section>

      {showAutoClearance && autoInfo && (
        <Card className="clearance-result-section">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              {t("screener.autoClearance.heading", { state: stateName })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {autoInfo.legislation && (
              <p>
                <span className="font-semibold text-foreground">{t("screener.autoClearance.legislationLabel")}</span>{" "}
                <span lang="en" className="text-muted-foreground">{autoInfo.legislation}</span>
              </p>
            )}
            <p>
              <span className="font-semibold text-foreground">{t("screener.autoClearance.offenseTypesLabel")}</span>{" "}
              <span lang="en" className="text-muted-foreground">{autoInfo.offenseTypes.join(", ")}</span>
            </p>
            {autoInfo.waitingPeriodNote && (
              <p>
                <span className="font-semibold text-foreground">{t("screener.autoClearance.waitingPeriodLabel")}</span>{" "}
                <span lang="en" className="text-muted-foreground">{autoInfo.waitingPeriodNote}</span>
              </p>
            )}
            {autoInfo.notes && <p lang="en" className="text-muted-foreground">{autoInfo.notes}</p>}
            {autoInfo.link && (
              <a
                href={autoInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {t("screener.autoClearance.linkLabel")}
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {rule ? (
        <Card className="clearance-result-section">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4 shrink-0" />
              {t("screener.stateInfo.heading", { state: stateName })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p lang="en" className="text-sm text-muted-foreground leading-relaxed">{rule.overview}</p>

            {visibleExclusions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  {t("screener.stateInfo.exclusionsLabel")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {visibleExclusions.map((exclusion, i) => (
                    <Badge key={i} lang="en" variant="outline" className="text-xs font-normal">
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
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                  {t("screener.stateInfo.sourcesLabel")}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {rule.sources.map((source, i) => (
                    <span key={i} lang="en" className="text-xs text-muted-foreground">
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

      <Card className="clearance-result-section">
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
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const labels = lang.startsWith("es") ? clearanceDesignCopy.es : lang.startsWith("zh") ? clearanceDesignCopy.zh : clearanceDesignCopy.en;
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
  const question = useRef<HTMLHeadingElement>(null);
  const view = showResult ? "result" : step;
  const previousView = useRef(view);
  useEffect(() => {
    if (previousView.current !== view) question.current?.focus();
    previousView.current = view;
  }, [view]);

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

  const choices = step === 2 ? ["arrest", "misdemeanor", "felony", "marijuana"] as const
    : step === 3 ? ["lt1", "1to3", "3to7", "gt7"] as const
    : ["complete", "fines", "probation"] as const;
  const field = step === 2 ? "recordType" : step === 3 ? "timeframe" : "sentence";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div data-skip-content tabIndex={-1} className="clearance-page flex-1">
        <h1>{t("screener.title")}</h1>
        <p className="clearance-intro">{t("screener.subtitle")}</p>
        <Link href="/support/reputation" className="clearance-return">{t("screener.backToReputation")}</Link>
        <section className="clearance-work">
          {!showResult ? (
            <>
              <ol className="clearance-progress">
                {(["state", "recordType", "timeframe", "sentence"] as const).map((key, index) => (
                  <li key={key} aria-current={step === index + 1 ? "step" : undefined}>{labels[key]}</li>
                ))}
              </ol>
              <p className="clearance-step">{t("screener.stepIndicator", { current: step, total: totalSteps })}</p>
              <h2 id="clearance-question" ref={question} tabIndex={-1}>{t(`screener.step${step}.question`)}</h2>
              {step !== 2 && <p id="clearance-hint" className="clearance-hint">{t(`screener.step${step}.hint`)}</p>}
              {step === 1 ? (
                <select data-testid="record-clearance-state" aria-labelledby="clearance-question" aria-describedby="clearance-hint"
                  value={answers.state} onChange={event => handleStateChange(event.target.value)}>
                  <option value="">{t("screener.step1.placeholder")}</option>
                  {US_STATES.map(state => <option key={state.code} value={state.code}>{state.name}</option>)}
                </select>
              ) : (
                <div className="clearance-choices" role="radiogroup" aria-labelledby="clearance-question"
                  aria-describedby={step === 2 ? undefined : "clearance-hint"}>
                  {choices.map(value => (
                    <label key={value}>
                      <input type="radio" name={field} value={value} checked={answers[field] === value}
                        onChange={() => setAnswers(prev => ({ ...prev, [field]: value }))} />
                      {t(`screener.step${step}.options.${value}`)}
                    </label>
                  ))}
                </div>
              )}
              <div className="clearance-controls">
                <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                  <ChevronLeft aria-hidden="true" />{t("screener.back")}
                </Button>
                <Button onClick={handleNext} disabled={!canProceed()}>
                  {step === totalSteps ? t("screener.seeResult") : t("screener.next")}
                  {step < totalSteps && <ChevronRight aria-hidden="true" />}
                </Button>
              </div>
              <p className="clearance-note">{t("screener.disclaimer")}</p>
            </>
          ) : result && (
            <>
              <ResultCard headingRef={question} result={result} state={answers.state} recordType={answers.recordType} />
              <div className="clearance-controls">
                <Button variant="outline" onClick={handleBack}>{t("screener.back")}</Button>
                <Button variant="outline" onClick={handleReset}>{t("screener.startOver")}</Button>
              </div>
            </>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
