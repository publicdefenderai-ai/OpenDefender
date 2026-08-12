import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BrandShieldIcon } from "@/components/brand-logo";
import {
  Briefcase,
  Home,
  Zap,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Printer,
  RefreshCw,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { TurnstileCaptcha, useCaptcha } from "@/components/captcha/turnstile";

// ── Types ─────────────────────────────────────────────────────────────────────

type LetterType =
  | "employer-court-dates"
  | "employer-explain-absence"
  | "employer-record-disclosure"
  | "landlord-payment-plan"
  | "landlord-situation-notice"
  | "utility-hardship";

type FieldType = "select" | "text" | "textarea";

/** Structural definition — translated label/placeholder/options come from i18n
 *  at render time via the `key`, which is also the (untranslated, stable)
 *  identifier sent to the backend as the answers record's key. */
interface FieldDef {
  key: string;
  type: FieldType;
  i18nKey: string;
  optionCount?: number;
  optional?: boolean;
}

interface LetterTypeDef {
  id: LetterType;
  icon: React.ElementType;
  iconColor: string;
  borderColor: string;
  i18nKey: string;
  fields: FieldDef[];
}

type PageState = "select" | "intake" | "loading" | "result";

// ── Letter type definitions (structural — text comes from i18n) ───────────────

const LETTER_TYPES: LetterTypeDef[] = [
  {
    id: "employer-court-dates",
    icon: Briefcase,
    iconColor: "text-blue-600 dark:text-blue-400",
    borderColor: "#3b82f6",
    i18nKey: "employerCourtDates",
    fields: [
      { key: "Frequency", type: "select", i18nKey: "frequency", optionCount: 4 },
      { key: "Whose case", type: "select", i18nKey: "whoseCase", optionCount: 2 },
      { key: "Documentation", type: "select", i18nKey: "documentation", optionCount: 3 },
      { key: "Additional context", type: "textarea", i18nKey: "additionalContext", optional: true },
    ],
  },
  {
    id: "employer-explain-absence",
    icon: Briefcase,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    borderColor: "#6366f1",
    i18nKey: "employerExplainAbsence",
    fields: [
      { key: "Duration", type: "select", i18nKey: "duration", optionCount: 4 },
      { key: "Reason to share", type: "select", i18nKey: "reasonToShare", optionCount: 4 },
      { key: "Current status", type: "select", i18nKey: "currentStatus", optionCount: 3 },
      { key: "Additional context", type: "textarea", i18nKey: "additionalContext", optional: true },
    ],
  },
  {
    id: "employer-record-disclosure",
    icon: Briefcase,
    iconColor: "text-teal-600 dark:text-teal-400",
    borderColor: "#14b8a6",
    i18nKey: "employerRecordDisclosure",
    fields: [
      { key: "Type of role", type: "text", i18nKey: "typeOfRole" },
      { key: "Time since offense", type: "select", i18nKey: "timeSinceOffense", optionCount: 4 },
      { key: "General category", type: "select", i18nKey: "generalCategory", optionCount: 5 },
      { key: "Steps since then", type: "select", i18nKey: "stepsSinceThen", optionCount: 4 },
    ],
  },
  {
    id: "landlord-payment-plan",
    icon: Home,
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "#f59e0b",
    i18nKey: "landlordPaymentPlan",
    fields: [
      { key: "How far behind", type: "select", i18nKey: "howFarBehind", optionCount: 4 },
      { key: "Reason", type: "select", i18nKey: "reason", optionCount: 4 },
      { key: "Partial payment", type: "select", i18nKey: "partialPayment", optionCount: 3 },
      { key: "Catch-up plan", type: "text", i18nKey: "catchUpPlan" },
    ],
  },
  {
    id: "landlord-situation-notice",
    icon: Home,
    iconColor: "text-orange-600 dark:text-orange-400",
    borderColor: "#f97316",
    i18nKey: "landlordSituationNotice",
    fields: [
      { key: "What to communicate", type: "select", i18nKey: "whatToCommunicate", optionCount: 4 },
      { key: "Current status", type: "select", i18nKey: "currentStatus", optionCount: 3 },
      { key: "What you are asking", type: "select", i18nKey: "whatYouAreAsking", optionCount: 3 },
      { key: "Additional context", type: "textarea", i18nKey: "additionalContext", optional: true },
    ],
  },
  {
    id: "utility-hardship",
    icon: Zap,
    iconColor: "text-yellow-600 dark:text-yellow-400",
    borderColor: "#eab308",
    i18nKey: "utilityHardship",
    fields: [
      { key: "Utility type", type: "select", i18nKey: "utilityType", optionCount: 5 },
      { key: "Current situation", type: "select", i18nKey: "currentSituation", optionCount: 4 },
      { key: "Reason", type: "select", i18nKey: "reason", optionCount: 4 },
      { key: "What I am requesting", type: "select", i18nKey: "whatIAmRequesting", optionCount: 4 },
    ],
  },
];

const LETTER_TYPE_NS = "letterGenerator.types";

function useTypeText(typeKey: string, fieldKey?: string) {
  const { t } = useTranslation();
  const base = fieldKey ? `${LETTER_TYPE_NS}.${typeKey}.fields.${fieldKey}` : `${LETTER_TYPE_NS}.${typeKey}`;
  return (suffix: string) => t(`${base}.${suffix}`);
}

function useOptions(typeKey: string, fieldKey: string, count: number): string[] {
  const { t } = useTranslation();
  const options: string[] = [];
  for (let i = 0; i < count; i++) {
    options.push(t(`${LETTER_TYPE_NS}.${typeKey}.fields.${fieldKey}.options.${i}`));
  }
  return options;
}

// ── Selection card ────────────────────────────────────────────────────────────

function TypeCard({
  def,
  onSelect,
}: {
  def: LetterTypeDef;
  onSelect: (id: LetterType) => void;
}) {
  const { t } = useTranslation();
  const Icon = def.icon;
  return (
    <button
      onClick={() => onSelect(def.id)}
      className="w-full text-left rounded-xl border border-border bg-background p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
      style={{ borderLeftWidth: 4, borderLeftColor: def.borderColor }}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${def.iconColor}`} strokeWidth={1.75} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm mb-1">{t(`${LETTER_TYPE_NS}.${def.i18nKey}.title`)}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{t(`${LETTER_TYPE_NS}.${def.i18nKey}.description`)}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-foreground transition-colors" />
      </div>
    </button>
  );
}

// ── Field renderer ────────────────────────────────────────────────────────────

function IntakeField({
  typeKey,
  field,
  value,
  onChange,
}: {
  typeKey: string;
  field: FieldDef;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  const { t } = useTranslation();
  const text = useTypeText(typeKey, field.i18nKey);
  const options = useOptions(typeKey, field.i18nKey, field.optionCount ?? 0);

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {text("label")}
        {field.optional && (
          <span className="text-muted-foreground font-normal ml-1">{t("letterGenerator.optionalTag")}</span>
        )}
      </label>
      {field.type === "select" ? (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t("letterGenerator.selectPlaceholder")}</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={text("placeholder")}
          rows={3}
          maxLength={400}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      ) : (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={text("placeholder")}
          maxLength={200}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      )}
    </div>
  );
}

// ── Intake form ───────────────────────────────────────────────────────────────

function IntakeForm({
  def,
  answers,
  onChange,
  onSubmit,
  onBack,
  loading,
  captchaRequired,
  captchaToken,
  captchaAttempt,
  onCaptchaVerify,
}: {
  def: LetterTypeDef;
  answers: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  captchaRequired: boolean;
  captchaToken: string | null;
  captchaAttempt: number;
  onCaptchaVerify: (token: string) => void;
}) {
  const { t } = useTranslation();
  const Icon = def.icon;
  const requiredFields = def.fields.filter((f) => !f.optional);
  const allRequiredFilled = requiredFields.every(
    (f) => answers[f.key] && answers[f.key].trim()
  );

  const isDisclosure = def.id === "employer-record-disclosure";
  const isEmployerLetter = def.id.startsWith("employer-");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("letterGenerator.back")}
        </button>
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${def.iconColor}`} strokeWidth={1.75} />
          <h2 className="font-semibold text-foreground">{t(`${LETTER_TYPE_NS}.${def.i18nKey}.title`)}</h2>
        </div>
      </div>

      {isDisclosure ? (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
            {t("letterGenerator.disclosureAlert")}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>{t("letterGenerator.generalNoteBold")}</strong> {t("letterGenerator.generalNoteRest")}
          </AlertDescription>
        </Alert>
      )}

      {isEmployerLetter && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-800 dark:text-orange-200 text-sm">
            <strong>{t("letterGenerator.employerHandbookBold")}</strong> {t("letterGenerator.employerHandbookRest")}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {def.fields.map((field) => (
          <IntakeField
            key={field.key}
            typeKey={def.i18nKey}
            field={field}
            value={answers[field.key]}
            onChange={onChange}
          />
        ))}
      </div>

      {captchaRequired && (
        <div className="flex justify-center">
          <TurnstileCaptcha key={captchaAttempt} onVerify={onCaptchaVerify} />
        </div>
      )}

      <Button
        onClick={onSubmit}
        disabled={!allRequiredFilled || loading || (captchaRequired && !captchaToken)}
        className="w-full gap-2"
      >
        <Sparkles className="h-4 w-4" />
        {t("letterGenerator.generateButton")}
      </Button>
    </div>
  );
}

// ── Result display ────────────────────────────────────────────────────────────

function LetterResult({
  subject,
  letter,
  tips,
  onReset,
}: {
  subject?: string;
  letter: string;
  tips: string[];
  onReset: () => void;
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const subjectLabelText = t("letterGenerator.result.subjectLabel");
  const fullText = subject ? `${subjectLabelText} ${subject}\n\n${letter}` : letter;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
    } catch {
      const el = document.createElement("textarea");
      el.value = fullText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (win) {
      const printTitle = t("letterGenerator.result.printTitle");
      const printNote = t("letterGenerator.result.printNote");
      win.document.write(`<html><head><title>${printTitle}</title>
        <style>body{font-family:Arial,sans-serif;padding:40px;max-width:700px;margin:0 auto;line-height:1.6}
        .subject{font-weight:bold;margin-bottom:20px}
        .body{white-space:pre-wrap}
        .note{font-size:12px;color:#666;margin-top:24px;border-top:1px solid #ddd;padding-top:12px;font-style:italic}
        </style></head><body>
        ${subject ? `<p class="subject">${subjectLabelText} ${subject}</p>` : ""}
        <div class="body">${letter.replace(/\n/g, "<br>")}</div>
        <p class="note">${printNote}</p>
        </body></html>`);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">{t("letterGenerator.result.title")}</h2>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t("letterGenerator.result.writeAnother")}
        </button>
      </div>

      {subject && (
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-2.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mr-2">
            {t("letterGenerator.result.subjectLabel")}
          </span>
          <span className="text-sm text-foreground">{subject}</span>
        </div>
      )}

      <div className="rounded-xl border border-border bg-background p-5">
        <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
          {letter}
        </pre>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleCopy} variant="outline" size="sm" className="gap-2">
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          {copied ? t("letterGenerator.result.copiedButton") : t("letterGenerator.result.copyButton")}
        </Button>
        <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
          <Printer className="h-4 w-4" />
          {t("letterGenerator.result.printButton")}
        </Button>
      </div>

      {tips.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            {t("letterGenerator.result.beforeYouSend")}
          </p>
          <ul className="space-y-1.5">
            {tips.map((tip, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-foreground font-semibold flex-shrink-0">{i + 1}.</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Alert className="border-border bg-muted/50">
        <AlertDescription className="text-xs text-muted-foreground">
          {t("letterGenerator.result.disclaimer")}
        </AlertDescription>
      </Alert>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LetterGenerator() {
  useScrollToTop();
  const { t, i18n } = useTranslation();

  const [state, setState] = useState<PageState>("select");
  const [selectedType, setSelectedType] = useState<LetterType | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    letter: string;
    subject?: string;
    tips: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { token: captchaToken, setToken: setCaptchaToken, isRequired: captchaRequired, reset: resetCaptcha } = useCaptcha();
  // Bumped whenever the CAPTCHA needs to be redone (e.g. after a failed submit) —
  // used as the widget's React key to force a fresh Turnstile challenge, since
  // a token is single-use and silently retrying with a spent one would just
  // reproduce the "CAPTCHA verification required" error indefinitely.
  const [captchaAttempt, setCaptchaAttempt] = useState(0);

  const selectedDef = LETTER_TYPES.find((t) => t.id === selectedType) ?? null;

  const handleSelect = (id: LetterType) => {
    setSelectedType(id);
    setAnswers({});
    setError(null);
    setState("intake");
  };

  const handleChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    if (captchaRequired && !captchaToken) {
      setError(t("letterGenerator.captchaRequiredError"));
      return;
    }
    setState("loading");
    setError(null);

    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          letterType: selectedType,
          answers,
          language: i18n.language,
          ...(captchaToken && captchaToken !== "not-required" ? { captchaToken } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? t("letterGenerator.genericError"));
      }

      setResult({ letter: data.letter, subject: data.subject, tips: data.tips });
      setState("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("letterGenerator.genericError"));
      setState("intake");
      // The Turnstile token is single-use — after any failed attempt (including
      // a CAPTCHA rejection), force a fresh widget rather than let the user
      // retry with an already-spent token and hit the same error again.
      resetCaptcha();
      setCaptchaAttempt((n) => n + 1);
    }
  };

  const handleReset = () => {
    setSelectedType(null);
    setAnswers({});
    setResult(null);
    setError(null);
    setState("select");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="vivid-header py-14 md:py-18">
        <div className="max-w-3xl mx-auto px-4 vivid-header-content text-center">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-white/80" />
              <span className="text-sm font-medium text-white/80 uppercase tracking-widest">
                {t("letterGenerator.hero.badge")}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("letterGenerator.hero.title")}
            </h1>
            <p className="text-base md:text-lg text-white/85 max-w-xl mx-auto">
              {t("letterGenerator.hero.subtitle")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-2xl mx-auto px-4">

          {/* Privacy notice */}
          <ScrollReveal>
            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/30 p-4 mb-8">
              <BrandShieldIcon size={16} className="flex-shrink-0 mt-0.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">{t("letterGenerator.privacyNotice.bold")}</strong> {t("letterGenerator.privacyNotice.rest")}
              </p>
            </div>
          </ScrollReveal>

          {/* State: select */}
          {state === "select" && (
            <ScrollReveal>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                {t("letterGenerator.select.title")}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {t("letterGenerator.select.templatesPre")}{" "}
                <a href="/support/housing" className="underline underline-offset-2 font-medium text-foreground hover:text-foreground/80">
                  {t("letterGenerator.select.templatesHousingLink")}
                </a>{" "}
                {t("letterGenerator.select.templatesMid")}{" "}
                <a href="/support/employment" className="underline underline-offset-2 font-medium text-foreground hover:text-foreground/80">
                  {t("letterGenerator.select.templatesEmploymentLink")}
                </a>{" "}
                {t("letterGenerator.select.templatesPost")}
              </p>
              <div className="grid gap-3">
                {LETTER_TYPES.map((def) => (
                  <TypeCard key={def.id} def={def} onSelect={handleSelect} />
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* State: intake */}
          {(state === "intake" || (state === "loading" && selectedDef)) && selectedDef && (
            <ScrollReveal>
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">{t(`${LETTER_TYPE_NS}.${selectedDef.i18nKey}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  <IntakeForm
                    def={selectedDef}
                    answers={answers}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onBack={handleReset}
                    loading={state === "loading"}
                    captchaRequired={!!captchaRequired}
                    captchaToken={captchaToken}
                    captchaAttempt={captchaAttempt}
                    onCaptchaVerify={setCaptchaToken}
                  />
                </CardContent>
              </Card>
            </ScrollReveal>
          )}

          {/* State: loading */}
          {state === "loading" && !selectedDef && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">{t("letterGenerator.writingLetter")}</p>
            </div>
          )}

          {/* Generating overlay when selectedDef exists */}
          {state === "loading" && selectedDef && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground animate-pulse">{t("letterGenerator.writingLetter")}</p>
            </div>
          )}

          {/* State: result */}
          {state === "result" && result && (
            <ScrollReveal>
              <LetterResult
                subject={result.subject}
                letter={result.letter}
                tips={result.tips}
                onReset={handleReset}
              />
            </ScrollReveal>
          )}
        </div>
      </section>

      <Footer />

      {/* Privacy footer */}
      <div className="legal-blue text-white py-3 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2">
            <BrandShieldIcon size={16} />
            <span className="text-sm font-medium">
              <strong>{t("letterGenerator.privacyFooter.bold")}</strong> {t("letterGenerator.privacyFooter.rest")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
