import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, ArrowRight, ArrowLeft, Copy, Check,
  Printer, Info, Home, Briefcase, Globe2,
  DollarSign, Users, Scale, Award, CheckCircle2, Shield, Lock,
  Car, AlertOctagon, ChevronRight,
} from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { buildPlainText } from "@/lib/build-plain-text";
import { DRIVERS_LICENSE_RULES } from "@/lib/collateral-consequences-data";
import { useJurisdiction } from "@/hooks/use-jurisdiction";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

type Answer = "yes" | "no" | null;
type QuestionId =
  | "housing"
  | "employment"
  | "immigration"
  | "benefits"
  | "children"
  | "supervision"
  | "license";

interface QuestionMeta {
  id: QuestionId;
  Icon: React.ElementType;
  hasPrivacyNote: boolean;
}

interface RiskMeta {
  id: QuestionId;
  urgency: number;
  Icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  linkHref: string;
}

/* ------------------------------------------------------------------ */
/* Static structural data (text comes from i18n)                       */
/* ------------------------------------------------------------------ */

const QUESTIONS: QuestionMeta[] = [
  { id: "housing",    Icon: Home,       hasPrivacyNote: false },
  { id: "employment", Icon: Briefcase,  hasPrivacyNote: false },
  { id: "immigration",Icon: Globe2,     hasPrivacyNote: true  },
  { id: "benefits",   Icon: DollarSign, hasPrivacyNote: false },
  { id: "children",   Icon: Users,      hasPrivacyNote: false },
  { id: "supervision",Icon: Scale,      hasPrivacyNote: false },
  { id: "license",    Icon: Award,      hasPrivacyNote: false },
];

const RISKS: RiskMeta[] = [
  {
    id: "supervision", urgency: 1, Icon: Scale,
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    linkHref: "/case-guidance",
  },
  {
    id: "immigration", urgency: 2, Icon: Globe2,
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
    linkHref: "/immigration-guidance",
  },
  {
    id: "children", urgency: 3, Icon: Users,
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    linkHref: "/support/childcare",
  },
  {
    id: "housing", urgency: 4, Icon: Home,
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    linkHref: "/support/housing",
  },
  {
    id: "employment", urgency: 5, Icon: Briefcase,
    color: "text-teal-700 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "border-teal-200 dark:border-teal-800",
    linkHref: "/support/employment",
  },
  {
    id: "benefits", urgency: 6, Icon: DollarSign,
    color: "text-violet-700 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800",
    linkHref: "/support/finances",
  },
  {
    id: "license", urgency: 7, Icon: Award,
    color: "text-slate-700 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-950/30",
    border: "border-slate-200 dark:border-slate-800",
    linkHref: "/legal-aid",
  },
];

const QUESTION_ORDER: QuestionId[] = [
  "housing", "employment", "immigration", "benefits", "children", "supervision", "license",
];

/** Maps the lowercase full-state-name stored by useJurisdiction → 2-letter abbr used by DRIVERS_LICENSE_RULES. */
const STATE_NAME_TO_ABBR: Record<string, string> = {
  "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR",
  "california": "CA", "colorado": "CO", "connecticut": "CT", "delaware": "DE",
  "florida": "FL", "georgia": "GA", "hawaii": "HI", "idaho": "ID",
  "illinois": "IL", "indiana": "IN", "iowa": "IA", "kansas": "KS",
  "kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
  "massachusetts": "MA", "michigan": "MI", "minnesota": "MN", "mississippi": "MS",
  "missouri": "MO", "montana": "MT", "nebraska": "NE", "nevada": "NV",
  "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
  "north carolina": "NC", "north dakota": "ND", "ohio": "OH", "oklahoma": "OK",
  "oregon": "OR", "pennsylvania": "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", "tennessee": "TN", "texas": "TX", "utah": "UT",
  "vermont": "VT", "virginia": "VA", "washington": "WA", "west virginia": "WV",
  "wisconsin": "WI", "wyoming": "WY", "district of columbia": "DC",
};

/* ------------------------------------------------------------------ */
/* Charge-type pre-step types and constants                            */
/* ------------------------------------------------------------------ */

type ChargeType =
  | "dui"
  | "drug_possession"
  | "drug_trafficking"
  | "theft_property"
  | "domestic_violence"
  | "sex_offense"
  | "other";

/** Risk cards that are surfaced purely from the charge type selection,
 *  not from yes/no question answers. Same shape as RiskMeta. */
interface ChargeRiskMeta {
  id: "driverLicense" | "driverLicenseCheck" | "sexOffender";
  urgency: number;
  Icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  linkHref: string;
}

const CHARGE_TYPE_RISKS: ChargeRiskMeta[] = [
  {
    id: "sexOffender", urgency: 0.5, Icon: AlertOctagon,
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    linkHref: "/legal-aid",
  },
  {
    id: "driverLicense", urgency: 1.5, Icon: Car,
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    linkHref: "/support/transportation",
  },
  {
    id: "driverLicenseCheck", urgency: 1.5, Icon: Car,
    color: "text-slate-700 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-950/30",
    border: "border-slate-200 dark:border-slate-800",
    linkHref: "/support/transportation",
  },
];

const CHARGE_TYPE_OPTION_KEYS: ChargeType[] = [
  "dui", "drug_possession", "drug_trafficking",
  "theft_property", "domestic_violence", "sex_offense", "other",
];

/* ------------------------------------------------------------------ */
/* Privacy note sub-component                                          */
/* ------------------------------------------------------------------ */

function PrivacyNote({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 px-3 py-2.5 mt-3">
      <Lock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">{text}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export default function CollateralConsequences() {
  useScrollToTop();
  const { t, i18n } = useTranslation();

  const { jurisdiction } = useJurisdiction();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<QuestionId, Answer>>({
    housing: null, employment: null, immigration: null,
    benefits: null, children: null, supervision: null, license: null,
  });
  const [copied, setCopied] = useState(false);
  const [chargeType, setChargeType] = useState<ChargeType | null>(null);
  const [chargeTypeSelected, setChargeTypeSelected] = useState(false);

  const isResults = chargeTypeSelected && step === QUESTION_ORDER.length;
  const progress = Math.round((step / QUESTION_ORDER.length) * 100);
  const currentMeta = QUESTIONS[step];
  const currentId = QUESTION_ORDER[step];

  const chargeRisks: ChargeRiskMeta[] = CHARGE_TYPE_RISKS.filter(r => {
    if (!chargeTypeSelected) return false;

    if (r.id === "driverLicense") {
      if (chargeType === "dui") return true;
      if (chargeType === "drug_possession" || chargeType === "drug_trafficking") {
        // Only show the full warning when the user's state has an explicit drug-conviction suspension law.
        // jurisdiction is stored as a lowercase full name (e.g. "california") by useJurisdiction.
        const abbr = jurisdiction ? STATE_NAME_TO_ABBR[jurisdiction.toLowerCase()] : undefined;
        if (!abbr) return false; // no/unknown jurisdiction → show soft check card instead
        return DRIVERS_LICENSE_RULES[abbr]?.drugConvictionSuspension === true;
      }
      return false;
    }

    if (r.id === "driverLicenseCheck") {
      // Soft "check your state" variant — only for drug charges with no recognisable jurisdiction entered
      if (chargeType === "drug_possession" || chargeType === "drug_trafficking") {
        const abbr = jurisdiction ? STATE_NAME_TO_ABBR[jurisdiction.toLowerCase()] : undefined;
        return !abbr; // show only when state is unknown or not in map
      }
      return false;
    }

    if (r.id === "sexOffender") return chargeType === "sex_offense";
    return false;
  });

  const activeRisks: (RiskMeta | ChargeRiskMeta)[] = [
    ...chargeRisks,
    ...RISKS.filter(r => answers[r.id] === "yes"),
  ].sort((a, b) => a.urgency - b.urgency);

  /* Plain-text export — delegates to the exported pure helper */
  function buildPlainTextForExport(): string {
    return buildPlainText(t, activeRisks, i18n.language);
  }

  function handleAnswer(ans: "yes" | "no") {
    setAnswers(prev => ({ ...prev, [currentId]: ans }));
    setStep(s => s + 1);
  }

  function handleBack() {
    if (step > 0) {
      setStep(s => s - 1);
    } else {
      // Back from first question — return to charge type selector
      setChargeTypeSelected(false);
    }
  }

  function handleRestart() {
    setStep(0);
    setAnswers({
      housing: null, employment: null, immigration: null,
      benefits: null, children: null, supervision: null, license: null,
    });
    setChargeType(null);
    setChargeTypeSelected(false);
  }

  async function handleCopy() {
    const text = buildPlainTextForExport();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  function handlePrint() {
    const text = buildPlainTextForExport();
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Risk Summary</title>` +
      `<style>body{font-family:Georgia,serif;font-size:13px;line-height:1.75;max-width:680px;margin:48px auto;padding:0 24px;color:#111}` +
      `pre{white-space:pre-wrap;word-break:break-word}</style></head><body>` +
      `<pre>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body></html>`
    );
    win.document.close();
    win.print();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="vivid-header-rose py-12 md:py-16" aria-labelledby="screener-heading">
        <div className="max-w-2xl mx-auto px-4 vivid-header-content text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white/80 text-xs font-semibold uppercase tracking-wider mb-4">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              {t("collateralConsequences.badge")}
            </div>
            <h1 id="screener-heading" className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
              {t("collateralConsequences.pageTitle")}
            </h1>
            <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl mx-auto">
              {t("collateralConsequences.pageDesc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Screener body */}
      <section className="py-10 md:py-14">
        <div className="max-w-xl mx-auto px-4">

          {/* ---------- CHARGE TYPE PRE-STEP ---------- */}
          {!chargeTypeSelected ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="rounded-2xl border border-border bg-card shadow-sm p-6 md:p-8 mb-5">
                <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-5">
                  <Scale className="h-6 w-6 text-rose-600 dark:text-rose-400" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h2 className="text-lg font-bold text-foreground leading-snug mb-2">
                  {t("collateralConsequences.chargeType.heading")}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {t("collateralConsequences.chargeType.sub")}
                </p>
                <div className="space-y-2">
                  {CHARGE_TYPE_OPTION_KEYS.map(key => (
                    <button
                      key={key}
                      onClick={() => { setChargeType(key); setChargeTypeSelected(true); }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-background text-sm font-medium text-foreground hover:border-rose-300 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 dark:hover:border-rose-700 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      <span>{t(`collateralConsequences.chargeType.options.${key}`)}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => { setChargeType(null); setChargeTypeSelected(true); }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("collateralConsequences.chargeType.skip")}
              </button>
            </motion.div>
          ) : !isResults ? (
            <>
              {/* ---------- QUESTION FLOW ---------- */}
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="font-semibold">
                    {t("collateralConsequences.qOf", { n: step + 1, total: QUESTION_ORDER.length })}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div
                  className="h-1.5 rounded-full bg-muted overflow-hidden"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <motion.div
                    className="h-full bg-rose-500 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Question card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="rounded-2xl border border-border bg-card shadow-sm p-6 md:p-8 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-5">
                      <currentMeta.Icon
                        className="h-6 w-6 text-rose-600 dark:text-rose-400"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </div>
                    <h2 className="text-lg font-bold text-foreground leading-snug mb-2">
                      {t(`collateralConsequences.questions.${currentId}.question`)}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`collateralConsequences.questions.${currentId}.sub`)}
                    </p>
                    {currentMeta.hasPrivacyNote && (
                      <PrivacyNote
                        text={t(`collateralConsequences.questions.${currentId}.privacyNote`)}
                      />
                    )}
                  </div>

                  {/* Yes / No */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => handleAnswer("yes")}
                      className="flex items-center justify-center py-4 rounded-xl border-2 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-bold text-base hover:border-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      {t("collateralConsequences.yes")}
                    </button>
                    <button
                      onClick={() => handleAnswer("no")}
                      className="flex items-center justify-center py-4 rounded-xl border-2 border-border bg-background text-foreground font-bold text-base hover:border-muted-foreground hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t("collateralConsequences.no")}
                    </button>
                  </div>

                  {/* Back */}
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("collateralConsequences.back")}
                  </button>
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            /* ---------- RESULTS ---------- */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {activeRisks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-3">
                    {t("collateralConsequences.noRiskTitle")}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto mb-6">
                    {t("collateralConsequences.noRiskDesc")}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      {t("collateralConsequences.resultsTitle")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t("collateralConsequences.resultsDesc")}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {activeRisks.map((risk, i) => (
                      <motion.div
                        key={risk.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.22 }}
                        className={`rounded-xl border p-5 ${risk.bg} ${risk.border}`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <risk.Icon
                            className={`h-5 w-5 flex-shrink-0 mt-0.5 ${risk.color}`}
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                          <h3 className={`font-bold text-sm leading-snug ${risk.color}`}>
                            {t(`collateralConsequences.risks.${risk.id}.title`)}
                          </h3>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                              {t("collateralConsequences.whatLabel")}
                            </p>
                            <p className="text-foreground leading-relaxed">
                              {t(`collateralConsequences.risks.${risk.id}.what`)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                              {t("collateralConsequences.timelineLabel")}
                            </p>
                            <p className="text-foreground leading-relaxed">
                              {t(`collateralConsequences.risks.${risk.id}.clock`)}
                            </p>
                          </div>
                          <div className={`rounded-lg border p-3 ${risk.bg} ${risk.border}`}>
                            <p className="text-xs font-bold uppercase tracking-wider mb-0.5 text-muted-foreground">
                              {t("collateralConsequences.actionLabel")}
                            </p>
                            <p className="text-foreground leading-relaxed">
                              {t(`collateralConsequences.risks.${risk.id}.action`)}
                            </p>
                          </div>
                          <Link href={risk.linkHref}>
                            <span className={`text-xs font-semibold flex items-center gap-1 ${risk.color} hover:underline cursor-pointer`}>
                              {t(`collateralConsequences.risks.${risk.id}.linkLabel`)}
                              <ArrowRight className="h-3 w-3" aria-hidden="true" />
                            </span>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 mb-5" role="note" aria-label="Not legal advice">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed space-y-1">
                  <p className="font-semibold">{t("collateralConsequences.disclaimer")}</p>
                  <p>{t("collateralConsequences.generalInfo")}</p>
                </div>
              </div>

              {/* Export controls */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
                  aria-live="polite"
                >
                  {copied ? (
                    <><Check className="h-4 w-4 text-green-600" aria-hidden="true" />{t("collateralConsequences.copiedBtn")}</>
                  ) : (
                    <><Copy className="h-4 w-4" aria-hidden="true" />{t("collateralConsequences.copyBtn")}</>
                  )}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
                >
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  {t("collateralConsequences.printBtn")}
                </button>
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  {t("collateralConsequences.restart")}
                </button>
              </div>

              {/* Back to advocate hub */}
              <div className="border-t border-border pt-5">
                <Link href="/for-advocates">
                  <span className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer">
                    <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                    {t("collateralConsequences.backToHub")}
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Privacy strip */}
      <section className="py-8 border-t border-border/30 bg-muted/20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <Shield className="h-5 w-5 text-muted-foreground mx-auto mb-2" aria-hidden="true" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("collateralConsequences.privacyStrip")}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
