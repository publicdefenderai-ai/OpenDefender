import { useState } from "react";
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

// ── Types ─────────────────────────────────────────────────────────────────────

type LetterType =
  | "employer-court-dates"
  | "employer-explain-absence"
  | "employer-record-disclosure"
  | "landlord-payment-plan"
  | "landlord-situation-notice"
  | "utility-hardship";

type FieldType = "select" | "text" | "textarea";

interface Field {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  optional?: boolean;
}

interface LetterTypeDef {
  id: LetterType;
  icon: React.ElementType;
  iconColor: string;
  borderColor: string;
  title: string;
  description: string;
  fields: Field[];
}

type PageState = "select" | "intake" | "loading" | "result";

// ── Letter type definitions ───────────────────────────────────────────────────

const LETTER_TYPES: LetterTypeDef[] = [
  {
    id: "employer-court-dates",
    icon: Briefcase,
    iconColor: "text-blue-600 dark:text-blue-400",
    borderColor: "#3b82f6",
    title: "Request time off for court",
    description:
      "Ask your employer for time off to attend court appearances, without over-sharing the details.",
    fields: [
      {
        key: "Frequency",
        label: "How often will you need time off?",
        type: "select",
        options: [
          "A single appearance",
          "A few appearances over the next several weeks",
          "Roughly once a month for several months",
          "Ongoing — not yet certain",
        ],
      },
      {
        key: "Whose case",
        label: "Whose legal matter is this?",
        type: "select",
        options: ["My own", "A close family member I need to support"],
      },
      {
        key: "Documentation",
        label: "Can you provide court documentation if asked?",
        type: "select",
        options: ["Yes", "Possibly", "No"],
      },
      {
        key: "Additional context",
        label: "Anything else to address in the letter? (optional)",
        type: "textarea",
        placeholder: "e.g., requesting to make up missed work, flexible scheduling, etc.",
        optional: true,
      },
    ],
  },
  {
    id: "employer-explain-absence",
    icon: Briefcase,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    borderColor: "#6366f1",
    title: "Explain an absence to your employer",
    description:
      "Explain a recent absence related to a legal matter. Professional and brief — honest without over-sharing.",
    fields: [
      {
        key: "Duration",
        label: "How long were you absent?",
        type: "select",
        options: ["A few hours", "One day", "Two to three days", "More than three days"],
      },
      {
        key: "Reason to share",
        label: "What can you share about why?",
        type: "select",
        options: [
          "A legal matter that required my attendance",
          "A personal matter that required my immediate attention and has since been addressed",
          "A family emergency",
          "A personal matter I would prefer not to detail",
        ],
      },
      {
        key: "Current status",
        label: "What is your situation now?",
        type: "select",
        options: [
          "I am back at work and the situation is resolved",
          "I am back at work but may need occasional time off",
          "I am still managing the situation",
        ],
      },
      {
        key: "Additional context",
        label: "Anything else to address? (optional)",
        type: "textarea",
        placeholder: "e.g., offering to make up work, noting strong performance history, etc.",
        optional: true,
      },
    ],
  },
  {
    id: "employer-record-disclosure",
    icon: Briefcase,
    iconColor: "text-teal-600 dark:text-teal-400",
    borderColor: "#14b8a6",
    title: "Disclose a record to an employer",
    description:
      "Proactively and professionally share a criminal record when applying for a job. Confident and forward-looking.",
    fields: [
      {
        key: "Type of role",
        label: "What type of job are you applying for?",
        type: "text",
        placeholder: "e.g., warehouse worker, delivery driver, retail associate",
      },
      {
        key: "Time since offense",
        label: "How long ago did the incident occur?",
        type: "select",
        options: [
          "Less than 1 year ago",
          "1 to 3 years ago",
          "3 to 5 years ago",
          "More than 5 years ago",
        ],
      },
      {
        key: "General category",
        label: "General category of the offense",
        type: "select",
        options: [
          "Drug-related",
          "Theft or financial",
          "DUI or traffic-related",
          "Assault or disorderly conduct",
          "Other non-violent offense",
        ],
      },
      {
        key: "Steps since then",
        label: "What positive steps have you taken since?",
        type: "select",
        options: [
          "Completed my sentence and have been working steadily since",
          "Completed job training or education",
          "Volunteered or contributed to my community",
          "Several of these",
        ],
      },
    ],
  },
  {
    id: "landlord-payment-plan",
    icon: Home,
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "#f59e0b",
    title: "Request a rent payment plan",
    description:
      "Ask your landlord for a deferral or payment arrangement. Professional, honest, with a concrete plan.",
    fields: [
      {
        key: "How far behind",
        label: "How far behind on rent are you?",
        type: "select",
        options: [
          "Less than one month",
          "About one to two months",
          "Two to three months",
          "More than three months",
        ],
      },
      {
        key: "Reason",
        label: "Main reason for the shortfall",
        type: "select",
        options: [
          "Job loss or reduced hours",
          "Legal costs from a recent case",
          "Medical expenses",
          "Other unexpected expenses",
        ],
      },
      {
        key: "Partial payment",
        label: "Can you make a partial payment now?",
        type: "select",
        options: [
          "Yes — I can pay a portion immediately",
          "Not immediately, but within a few weeks",
          "No — I need a full deferral for now",
        ],
      },
      {
        key: "Catch-up plan",
        label: "How do you plan to catch up?",
        type: "text",
        placeholder: "e.g., Starting a new job next week, receiving assistance, can catch up in 2 months",
      },
    ],
  },
  {
    id: "landlord-situation-notice",
    icon: Home,
    iconColor: "text-orange-600 dark:text-orange-400",
    borderColor: "#f97316",
    title: "Notify landlord of changed circumstances",
    description:
      "Proactively inform your landlord of a change in your situation to maintain a good relationship.",
    fields: [
      {
        key: "What to communicate",
        label: "What are you telling your landlord?",
        type: "select",
        options: [
          "A change in personal circumstances that may temporarily affect my situation",
          "A possible disruption to upcoming rent payments",
          "A need to explain a recent absence from the unit",
          "A change in household circumstances",
        ],
      },
      {
        key: "Current status",
        label: "How is the situation right now?",
        type: "select",
        options: [
          "The situation is stabilizing",
          "I am actively working to resolve it",
          "The situation has been resolved",
        ],
      },
      {
        key: "What you are asking",
        label: "What are you asking from your landlord?",
        type: "select",
        options: [
          "Understanding and patience while I work through this",
          "A brief extension on the next payment",
          "Nothing specific — I just want to be transparent",
        ],
      },
      {
        key: "Additional context",
        label: "Anything else to address? (optional)",
        type: "textarea",
        placeholder: "e.g., strong payment history, long tenancy, etc.",
        optional: true,
      },
    ],
  },
  {
    id: "utility-hardship",
    icon: Zap,
    iconColor: "text-yellow-600 dark:text-yellow-400",
    borderColor: "#eab308",
    title: "Request utility hardship assistance",
    description:
      "Contact a utility company to request a payment plan, deferral, or hardship program to avoid disconnection.",
    fields: [
      {
        key: "Utility type",
        label: "Type of utility",
        type: "select",
        options: ["Electric", "Gas", "Water", "Phone or internet", "Multiple utilities"],
      },
      {
        key: "Current situation",
        label: "Payment situation",
        type: "select",
        options: [
          "One month behind",
          "Two to three months behind",
          "Received a disconnect or shutoff notice",
          "Not yet behind but anticipating difficulty",
        ],
      },
      {
        key: "Reason",
        label: "Reason for hardship",
        type: "select",
        options: [
          "Job loss or reduced income",
          "Legal costs",
          "Medical expenses",
          "Other unexpected circumstances",
        ],
      },
      {
        key: "What I am requesting",
        label: "What you are asking for",
        type: "select",
        options: [
          "A payment plan to catch up gradually",
          "A one-time deferral",
          "Information about hardship or assistance programs",
          "An extension before any disconnection",
        ],
      },
    ],
  },
];

// ── Selection card ────────────────────────────────────────────────────────────

function TypeCard({
  def,
  onSelect,
}: {
  def: LetterTypeDef;
  onSelect: (id: LetterType) => void;
}) {
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
          <p className="font-semibold text-foreground text-sm mb-1">{def.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{def.description}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-foreground transition-colors" />
      </div>
    </button>
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
}: {
  def: LetterTypeDef;
  answers: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}) {
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
          Back
        </button>
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${def.iconColor}`} strokeWidth={1.75} />
          <h2 className="font-semibold text-foreground">{def.title}</h2>
        </div>
      </div>

      {isDisclosure ? (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
            This letter intentionally discloses a criminal record. Review the final draft carefully before sending. If you are unsure whether or when to disclose, speak with your attorney first.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Note:</strong> These letters use general language. Do not include specific facts about your case — what you are charged with, what happened, or anything related to the underlying dispute. The letter will say "a legal matter" rather than specific details, which protects your legal position.
          </AlertDescription>
        </Alert>
      )}

      {isEmployerLetter && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-800 dark:text-orange-200 text-sm">
            <strong>Check your employee handbook first.</strong> Some employers require employees to report certain types of arrests or legal matters — for example, a DUI for someone in a driving role, or a financial offense for someone in a financial role. Review your company policy or contract before sending, and contact HR or a union representative if you are unsure what is required. This letter template covers the basics but may not meet all employer-specific requirements.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {def.fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {field.label}
              {field.optional && (
                <span className="text-muted-foreground font-normal ml-1">(optional)</span>
              )}
            </label>
            {field.type === "select" && field.options ? (
              <select
                value={answers[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select an option...</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                value={answers[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                maxLength={400}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            ) : (
              <input
                type="text"
                value={answers[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                maxLength={200}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={onSubmit}
        disabled={!allRequiredFilled || loading}
        className="w-full gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Generate my letter
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
  const [copied, setCopied] = useState(false);

  const fullText = subject ? `Subject: ${subject}\n\n${letter}` : letter;

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
      win.document.write(`<html><head><title>Letter</title>
        <style>body{font-family:Arial,sans-serif;padding:40px;max-width:700px;margin:0 auto;line-height:1.6}
        .subject{font-weight:bold;margin-bottom:20px}
        .body{white-space:pre-wrap}
        .note{font-size:12px;color:#666;margin-top:24px;border-top:1px solid #ddd;padding-top:12px;font-style:italic}
        </style></head><body>
        ${subject ? `<p class="subject">Subject: ${subject}</p>` : ""}
        <div class="body">${letter.replace(/\n/g, "<br>")}</div>
        <p class="note">Replace all [bracketed] text with your own details before sending.</p>
        </body></html>`);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Your draft letter</h2>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Write another
        </button>
      </div>

      {subject && (
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-2.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mr-2">
            Subject:
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
          {copied ? "Copied" : "Copy letter"}
        </Button>
        <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      {tips.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Before you send
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
          This is a communication draft, not legal advice. Replace all [bracketed] text with your own details before sending. Review the letter carefully — if anything in it describes facts about your case that you did not intend to disclose, remove or replace it with general language before sending. You are never required to explain more than the practical need.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LetterGenerator() {
  useScrollToTop();

  const [state, setState] = useState<PageState>("select");
  const [selectedType, setSelectedType] = useState<LetterType | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    letter: string;
    subject?: string;
    tips: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setState("loading");
    setError(null);

    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letterType: selectedType, answers }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Failed to generate letter");
      }

      setResult({ letter: data.letter, subject: data.subject, tips: data.tips });
      setState("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("intake");
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
                Life Support Tool
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Letter Generator
            </h1>
            <p className="text-base md:text-lg text-white/85 max-w-xl mx-auto">
              Generate a personalized letter for your specific situation — to your employer, landlord, or utility company.
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
                <strong className="text-foreground">Privacy:</strong> No personal information is collected. The letter uses [YOUR NAME] and similar placeholders — you fill in the real details before sending. Nothing is stored after your session ends.
              </p>
            </div>
          </ScrollReveal>

          {/* State: select */}
          {state === "select" && (
            <ScrollReveal>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                What kind of letter do you need?
              </h2>
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
                  <CardTitle className="text-base">{selectedDef.title}</CardTitle>
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
                  />
                </CardContent>
              </Card>
            </ScrollReveal>
          )}

          {/* State: loading */}
          {state === "loading" && !selectedDef && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Writing your letter...</p>
            </div>
          )}

          {/* Generating overlay when selectedDef exists */}
          {state === "loading" && selectedDef && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground animate-pulse">Writing your letter...</p>
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
              <strong>Privacy First:</strong> We do not store your personal data — all input deleted after session.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
