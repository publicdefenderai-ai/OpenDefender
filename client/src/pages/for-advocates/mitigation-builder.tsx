import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Copy,
  Check,
  Printer,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Download,
  Sparkles,
  Loader2,
  SquarePen,
} from "lucide-react";
import {
  Document,
  Header as DocxHeader,
  Footer as DocxFooter,
  Paragraph,
  TextRun,
  AlignmentType,
  Packer,
  PageNumber,
  BorderStyle,
  ShadingType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun,
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  TextWrappingType,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
} from "docx";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { TurnstileCaptcha, useCaptcha } from "@/components/captcha/turnstile";

/* ─── Types ─── */

interface FormState {
  clientName: string;
  caseNumber: string;
  caseContext: string;
  // Community ties
  yearsInCommunity: string;
  familyNearby: string;
  communityInvolvement: string;
  // Housing
  housingStatus: string;
  housingDuration: string;
  dependentsAtHome: string;
  // Employment
  employmentStatus: string;
  employer: string;
  employmentDuration: string;
  employerNote: string;
  // Treatment
  mentalHealthTreatment: string;
  substanceTreatment: string;
  treatmentDocumentation: string;
  // Family responsibilities
  caregiverStatus: string;
  numberOfDependents: string;
  providerStatus: string;
  familyContext: string;
  // Character references
  references: string;
  // Additional context
  additionalContext: string;
}

const EMPTY: FormState = {
  clientName: "",
  caseNumber: "",
  caseContext: "",
  yearsInCommunity: "",
  familyNearby: "",
  communityInvolvement: "",
  housingStatus: "",
  housingDuration: "",
  dependentsAtHome: "",
  employmentStatus: "",
  employer: "",
  employmentDuration: "",
  employerNote: "",
  mentalHealthTreatment: "",
  substanceTreatment: "",
  treatmentDocumentation: "",
  caregiverStatus: "",
  numberOfDependents: "",
  providerStatus: "",
  familyContext: "",
  references: "",
  additionalContext: "",
};

/* ─── Output generator ─── */

function generateOutput(f: FormState): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lines: string[] = [];

  lines.push("MITIGATION SUMMARY — DRAFT");
  lines.push("Review every line before use. Do not file without attorney verification.");
  lines.push(`Prepared: ${today}`);
  if (f.clientName) lines.push(`Client: ${f.clientName}`);
  if (f.caseNumber) lines.push(`Case No.: ${f.caseNumber}`);
  if (f.caseContext) lines.push(`Context: ${f.caseContext}`);
  lines.push("");

  // Community ties
  const hasCommunity = f.yearsInCommunity || f.familyNearby || f.communityInvolvement;
  if (hasCommunity) {
    lines.push("COMMUNITY TIES");
    lines.push("─".repeat(40));
    if (f.yearsInCommunity) lines.push(`• Time in community: ${f.yearsInCommunity}`);
    if (f.familyNearby) lines.push(`• Family in area: ${f.familyNearby}`);
    if (f.communityInvolvement) lines.push(`• Community involvement: ${f.communityInvolvement}`);
    lines.push("");
  }

  // Housing
  const hasHousing = f.housingStatus || f.housingDuration || f.dependentsAtHome;
  if (hasHousing) {
    lines.push("HOUSING STABILITY");
    lines.push("─".repeat(40));
    if (f.housingStatus) lines.push(`• Current status: ${f.housingStatus}`);
    if (f.housingDuration) lines.push(`• Duration at current address: ${f.housingDuration}`);
    if (f.dependentsAtHome) lines.push(`• Dependents at home: ${f.dependentsAtHome}`);
    lines.push("");
  }

  // Employment
  const hasEmployment = f.employmentStatus || f.employer || f.employmentDuration || f.employerNote;
  if (hasEmployment) {
    lines.push("EMPLOYMENT");
    lines.push("─".repeat(40));
    if (f.employmentStatus) lines.push(`• Employment status: ${f.employmentStatus}`);
    if (f.employer) lines.push(`• Employer: ${f.employer}`);
    if (f.employmentDuration) lines.push(`• Duration: ${f.employmentDuration}`);
    if (f.employerNote) lines.push(`• Employer note: ${f.employerNote}`);
    lines.push("");
  }

  // Treatment
  const hasTreatment = f.mentalHealthTreatment || f.substanceTreatment || f.treatmentDocumentation;
  if (hasTreatment) {
    lines.push("TREATMENT PARTICIPATION");
    lines.push("─".repeat(40));
    if (f.mentalHealthTreatment) lines.push(`• Mental health: ${f.mentalHealthTreatment}`);
    if (f.substanceTreatment) lines.push(`• Substance use: ${f.substanceTreatment}`);
    if (f.treatmentDocumentation) lines.push(`• Documentation: ${f.treatmentDocumentation}`);
    lines.push("");
  }

  // Family
  const hasFamily = f.caregiverStatus || f.numberOfDependents || f.providerStatus || f.familyContext;
  if (hasFamily) {
    lines.push("FAMILY RESPONSIBILITIES");
    lines.push("─".repeat(40));
    if (f.caregiverStatus) lines.push(`• Primary caregiver: ${f.caregiverStatus}`);
    if (f.numberOfDependents) lines.push(`• Number of dependents: ${f.numberOfDependents}`);
    if (f.providerStatus) lines.push(`• Financial provider: ${f.providerStatus}`);
    if (f.familyContext) lines.push(`• Additional context: ${f.familyContext}`);
    lines.push("");
  }

  // References
  if (f.references) {
    lines.push("CHARACTER REFERENCES");
    lines.push("─".repeat(40));
    lines.push(f.references);
    lines.push("");
  }

  // Additional context
  if (f.additionalContext) {
    lines.push("ADDITIONAL CONTEXT");
    lines.push("─".repeat(40));
    lines.push(f.additionalContext);
    lines.push("");
  }

  if (lines.length <= 6) return "";

  lines.push("─".repeat(40));
  lines.push("This summary contains only information provided by the advocate.");
  lines.push("Verify every claim independently before including in any court filing.");

  return lines.join("\n");
}

/* ─── Field components ─── */

function Label({
  children,
  hint,
  htmlFor,
}: {
  children: React.ReactNode;
  hint?: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block">
      <span className="text-sm font-medium text-foreground">{children}</span>
      {hint && <span className="text-xs text-muted-foreground ml-2">{hint}</span>}
    </label>
  );
}

function Input({
  id,
  value,
  onChange,
  placeholder,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
    />
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <option value="">{placeholder ?? "Select…"}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/* ─── Collapsible domain section ─── */

function Domain({
  title,
  filled,
  children,
  defaultOpen = false,
}: {
  title: string;
  filled: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm text-foreground">{title}</span>
          {filled > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              {filled} {filled === 1 ? "field" : "fields"} filled
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {open && <div className="px-5 py-5 space-y-4 bg-background">{children}</div>}
    </div>
  );
}

/* ─── Docx builder (client-side, nothing sent to server) ─── */

// Word repeats the default header on every page. The anchored SVG is kept
// behind document text so the watermark behaves like the browser print view.
// A raster fallback is supplied because docx requires one for SVG images.
// It uses the same full-page, diagonal treatment for Word versions that do
// not render the SVG alternative.
const DRAFT_WATERMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="816" height="1056" viewBox="0 0 816 1056"><text x="408" y="528" text-anchor="middle" dominant-baseline="middle" transform="rotate(-35 408 528)" font-family="Arial, Helvetica, sans-serif" font-size="128" font-weight="900" letter-spacing="15" fill="#000000" fill-opacity="0.045">DRAFT</text></svg>`;
const DRAFT_WATERMARK_PNG =
  "data:image/png;base64,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";

function createDraftWatermark(): ImageRun {
  return new ImageRun({
    type: "svg",
    data: `data:image/svg+xml;base64,${btoa(DRAFT_WATERMARK_SVG)}`,
    fallback: {
      type: "png",
      data: DRAFT_WATERMARK_PNG,
    },
    transformation: { width: 816, height: 1056 },
    floating: {
      horizontalPosition: {
        relative: HorizontalPositionRelativeFrom.PAGE,
        align: HorizontalPositionAlign.CENTER,
      },
      verticalPosition: {
        relative: VerticalPositionRelativeFrom.PAGE,
        align: VerticalPositionAlign.CENTER,
      },
      behindDocument: true,
      allowOverlap: true,
      lockAnchor: true,
      layoutInCell: true,
      wrap: { type: TextWrappingType.NONE },
      zIndex: 0,
    },
    altText: {
      name: "Draft watermark",
      title: "Draft watermark",
      description: "Diagonal DRAFT watermark indicating this document requires review.",
    },
  });
}

function createDraftWatermarkHeader(): DocxHeader {
  return new DocxHeader({
    children: [
      new Paragraph({
        children: [createDraftWatermark()],
      }),
    ],
  });
}

function createPageNumberFooter(): DocxFooter {
  const footerTextRun = {
    font: "Arial",
    size: 18,
    color: "666666",
  };

  return new DocxFooter({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({ text: "Page ", ...footerTextRun }),
          new TextRun({ children: [PageNumber.CURRENT], ...footerTextRun }),
          new TextRun({ text: " of ", ...footerTextRun }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], ...footerTextRun }),
        ],
      }),
    ],
  });
}

function buildDocxParagraphs(output: string, form: FormState): (Paragraph | Table)[] {
  const nodes: (Paragraph | Table)[] = [];

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ── Header block: centred title + bottom rule ──────────────────────────────
  nodes.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 140 },
      border: { bottom: { color: "111111", size: 12, style: BorderStyle.SINGLE } },
      children: [
        new TextRun({ text: "Sentencing Mitigation Memorandum", bold: true, size: 32, font: "Times New Roman" }),
      ],
    })
  );

  // Metadata rows (bold label + plain value)
  const addMeta = (label: string, value: string) => {
    nodes.push(
      new Paragraph({
        spacing: { after: 40 },
        wordWrap: true,
        children: [
          new TextRun({ text: `${label}  `, bold: true, size: 22, font: "Times New Roman" }),
          new TextRun({ text: value, size: 22, font: "Times New Roman" }),
        ],
      })
    );
  };
  addMeta("Prepared:", today);
  if (form.clientName) addMeta("Client:", form.clientName);
  if (form.caseNumber) addMeta("Case No.:", form.caseNumber);
  if (form.caseContext) addMeta("Context:", form.caseContext);

  // Rule after metadata
  nodes.push(
    new Paragraph({
      spacing: { before: 100, after: 180 },
      border: { bottom: { color: "111111", size: 8, style: BorderStyle.SINGLE } },
      children: [],
    })
  );

  // ── DRAFT callout: shaded table cell with amber border ────────────────────
  nodes.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: "FEF9C3", type: ShadingType.CLEAR, color: "auto" },
              borders: {
                top:    { style: BorderStyle.SINGLE, size: 6,  color: "CA8A04" },
                bottom: { style: BorderStyle.SINGLE, size: 6,  color: "CA8A04" },
                left:   { style: BorderStyle.THICK,  size: 24, color: "B45309" },
                right:  { style: BorderStyle.SINGLE, size: 6,  color: "CA8A04" },
              },
              margins: { top: 80, bottom: 80, left: 140, right: 140 },
              children: [
                new Paragraph({
                  spacing: { after: 40 },
                  children: [
                    new TextRun({
                      text: "DRAFT — Review before use",
                      bold: true,
                      size: 20,
                      font: "Arial",
                      color: "92400E",
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { after: 0 },
                  children: [
                    new TextRun({
                      text: "Review every line before use. Do not file without attorney verification.",
                      italics: true,
                      size: 18,
                      font: "Arial",
                      color: "78350F",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // Spacer after callout
  nodes.push(new Paragraph({ spacing: { after: 200 }, children: [] }));

  // ── Body content ───────────────────────────────────────────────────────────
  const KNOWN_HEADERS = [
    "COMMUNITY TIES", "HOUSING STABILITY", "EMPLOYMENT",
    "TREATMENT PARTICIPATION", "FAMILY RESPONSIBILITIES",
    "CHARACTER REFERENCES", "ADDITIONAL CONTEXT",
  ];

  for (const rawLine of output.split("\n")) {
    const trimmed = rawLine.trim();

    // Skip dividers, title, metadata, and draft warning (already in header/callout)
    if (/^─+$/.test(trimmed)) continue;
    if (trimmed === "MITIGATION SUMMARY — DRAFT") continue;
    if (trimmed.startsWith("Review every line")) continue;
    if (
      trimmed.startsWith("Prepared:") ||
      trimmed.startsWith("Client:") ||
      trimmed.startsWith("Case No.:") ||
      trimmed.startsWith("Context:")
    ) continue;

    // Section headers — bold, with bottom border
    if (KNOWN_HEADERS.includes(trimmed)) {
      nodes.push(
        new Paragraph({
          spacing: { before: 280, after: 80 },
          border: { bottom: { color: "444444", size: 6, style: BorderStyle.SINGLE } },
          children: [new TextRun({ text: trimmed, bold: true, size: 22, font: "Times New Roman" })],
        })
      );
      continue;
    }

    // Bullet items
    if (trimmed.startsWith("• ")) {
      nodes.push(
        new Paragraph({
          indent: { left: 360 },
          spacing: { after: 60 },
          children: [new TextRun({ text: trimmed, size: 22, font: "Times New Roman" })],
        })
      );
      continue;
    }

    // Footer verification lines — italic, with top border
    if (trimmed.startsWith("Verify every claim") || trimmed.startsWith("This summary contains")) {
      nodes.push(
        new Paragraph({
          spacing: { before: 240, after: 60 },
          border: { top: { color: "CCCCCC", size: 6, style: BorderStyle.SINGLE } },
          children: [
            new TextRun({ text: trimmed, italics: true, size: 18, font: "Times New Roman", color: "555555" }),
          ],
        })
      );
      continue;
    }

    // Blank line
    if (trimmed === "") {
      nodes.push(new Paragraph({ children: [] }));
      continue;
    }

    // Free-form text (references, additional context)
    nodes.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: trimmed, size: 22, font: "Times New Roman" })],
      })
    );
  }

  return nodes;
}

/* ─── Docx builder for polished (free-form narrative) draft ─── */

function buildPolishDocxParagraphs(editedText: string, form: FormState): (Paragraph | Table)[] {
  const nodes: (Paragraph | Table)[] = [];

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ── Header block: centred title + bottom rule ──────────────────────────────
  nodes.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 140 },
      border: { bottom: { color: "111111", size: 12, style: BorderStyle.SINGLE } },
      children: [
        new TextRun({ text: "Sentencing Mitigation Memorandum", bold: true, size: 32, font: "Times New Roman" }),
      ],
    })
  );

  // Metadata rows (bold label + plain value)
  const addMeta = (label: string, value: string) => {
    nodes.push(
      new Paragraph({
        spacing: { after: 40 },
        wordWrap: true,
        children: [
          new TextRun({ text: `${label}  `, bold: true, size: 22, font: "Times New Roman" }),
          new TextRun({ text: value, size: 22, font: "Times New Roman" }),
        ],
      })
    );
  };
  addMeta("Prepared:", today);
  if (form.clientName) addMeta("Client:", form.clientName);
  if (form.caseNumber) addMeta("Case No.:", form.caseNumber);
  if (form.caseContext) addMeta("Context:", form.caseContext);

  // Rule after metadata
  nodes.push(
    new Paragraph({
      spacing: { before: 100, after: 180 },
      border: { bottom: { color: "111111", size: 8, style: BorderStyle.SINGLE } },
      children: [],
    })
  );

  // ── DRAFT callout: shaded table cell with amber border ────────────────────
  nodes.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: "FEF9C3", type: ShadingType.CLEAR, color: "auto" },
              borders: {
                top:    { style: BorderStyle.SINGLE, size: 6,  color: "CA8A04" },
                bottom: { style: BorderStyle.SINGLE, size: 6,  color: "CA8A04" },
                left:   { style: BorderStyle.THICK,  size: 24, color: "B45309" },
                right:  { style: BorderStyle.SINGLE, size: 6,  color: "CA8A04" },
              },
              margins: { top: 80, bottom: 80, left: 140, right: 140 },
              children: [
                new Paragraph({
                  spacing: { after: 40 },
                  children: [
                    new TextRun({
                      text: "AI-POLISHED DRAFT: NOT FOR FILING WITHOUT ATTORNEY REVIEW",
                      bold: true,
                      size: 20,
                      font: "Arial",
                      color: "92400E",
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { after: 0 },
                  children: [
                    new TextRun({
                      text: "AI-generated. You must edit and verify every claim before use. Do not file without attorney review.",
                      italics: true,
                      size: 18,
                      font: "Arial",
                      color: "78350F",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // Spacer after callout
  nodes.push(new Paragraph({ spacing: { after: 200 }, children: [] }));

  // ── Body: render free-form narrative paragraphs ───────────────────────────
  // Skip header lines that are already rendered above
  const skipPrefixes = [
    "AI-POLISHED DRAFT",
    "Prepared:",
    "Client:",
    "Case No.:",
    "Context:",
  ];

  for (const rawLine of editedText.split("\n")) {
    const trimmed = rawLine.trim();

    // Skip header metadata lines
    if (skipPrefixes.some((p) => trimmed.startsWith(p))) continue;

    // Blank line — spacer
    if (trimmed === "") {
      nodes.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
      continue;
    }

    // Free-form narrative paragraph
    nodes.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: trimmed, size: 22, font: "Times New Roman" })],
      })
    );
  }

  return nodes;
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── Polish with AI panel ─── */

const POLISH_COOLDOWN_MS = 5_000;

type PolishState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; text: string }
  | { status: "error"; message: string };

function PolishPanel({ form }: { form: FormState }) {
  const [polish, setPolish] = useState<PolishState>({ status: "idle" });
  const [editedText, setEditedText] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [polishCopied, setPolishCopied] = useState(false);
  const [polishDocxLoading, setPolishDocxLoading] = useState(false);
  const { token: captchaToken, setToken: setCaptchaToken, isRequired: captchaRequired, reset: resetCaptcha } = useCaptcha();
  const [captchaAttempt, setCaptchaAttempt] = useState(0);
  const [polishCooldown, setPolishCooldown] = useState(false);
  const polishRequestInFlightRef = useRef(false);
  const polishCooldownRef = useRef(false);
  const polishCooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (polishCooldownTimerRef.current) {
        clearTimeout(polishCooldownTimerRef.current);
      }
    };
  }, []);

  const handlePolish = async () => {
    if (polishRequestInFlightRef.current || polishCooldownRef.current) return;
    if (captchaRequired && !captchaToken) {
      setPolish({ status: "error", message: "Please complete the verification below before generating." });
      return;
    }
    polishRequestInFlightRef.current = true;
    setPolish({ status: "loading" });
    setCheckboxChecked(false);

    try {
      const res = await fetch("/api/mitigation/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...(captchaToken && captchaToken !== "not-required" ? { captchaToken } : {}),
        }),
      });
      const data = await res.json();
      if (data.success) {
        const today = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const header = [
          "AI-POLISHED DRAFT: NOT FOR FILING WITHOUT ATTORNEY REVIEW",
          `Prepared: ${today}`,
          ...(form.clientName ? [`Client: ${form.clientName}`] : []),
          ...(form.caseNumber ? [`Case No.: ${form.caseNumber}`] : []),
          ...(form.caseContext ? [`Context: ${form.caseContext}`] : []),
          "",
        ].join("\n");
        const full = header + data.polishedText;
        setEditedText(full);
        setPolish({ status: "done", text: full });
      } else {
        setPolish({ status: "error", message: data.error ?? "Unknown error." });
        // The Turnstile token is single-use — force a fresh widget rather
        // than let the user retry with an already-spent token.
        resetCaptcha();
        setCaptchaAttempt((n) => n + 1);
      }
    } catch {
      setPolish({ status: "error", message: "Network error. Please try again." });
      resetCaptcha();
      setCaptchaAttempt((n) => n + 1);
    } finally {
      polishRequestInFlightRef.current = false;
      polishCooldownRef.current = true;
      setPolishCooldown(true);
      polishCooldownTimerRef.current = setTimeout(() => {
        polishCooldownRef.current = false;
        polishCooldownTimerRef.current = null;
        setPolishCooldown(false);
      }, POLISH_COOLDOWN_MS);
    }
  };

  const handlePolishCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
    } catch {
      const el = document.createElement("textarea");
      el.value = editedText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setPolishCopied(true);
    setTimeout(() => setPolishCopied(false), 2000);
  };

  const handleDownloadPolishDocx = async () => {
    setPolishDocxLoading(true);
    try {
      const doc = new Document({
        creator: "OpenDefender Advocate Hub",
        title: "AI-Polished Mitigation Draft",
        sections: [
          {
            properties: {
              page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
            },
            headers: { default: createDraftWatermarkHeader() },
            footers: { default: createPageNumberFooter() },
            children: buildPolishDocxParagraphs(editedText, form),
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      const safeName = form.clientName
        ? `mitigation-polished-draft-${form.clientName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.docx`
        : "mitigation-polished-draft.docx";
      triggerDownload(blob, safeName);
    } finally {
      setPolishDocxLoading(false);
    }
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;

    const lines = editedText.split("\n");
    let clientName = "";
    let preparedDate = "";
    let caseNumber = "";
    let proceedingContext = "";

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith("Client:")) clientName = line.replace("Client:", "").trim();
      if (line.startsWith("Prepared:")) preparedDate = line.replace("Prepared:", "").trim();
      if (line.startsWith("Case No.:")) caseNumber = line.replace("Case No.:", "").trim();
      if (line.startsWith("Context:")) proceedingContext = line.replace("Context:", "").trim();
    }

    // Keep blank-line paragraph breaks while folding wrapped lines into one
    // printable narrative paragraph.
    const paragraphs: string[] = [];
    let currentParagraph: string[] = [];
    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join("\n"));
        currentParagraph = [];
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();

      // These lines are rendered in the print header or AI-specific callout.
      if (
        line.startsWith("AI-POLISHED DRAFT") ||
        line.startsWith("Prepared:") ||
        line.startsWith("Client:") ||
        line.startsWith("Case No.:") ||
        line.startsWith("Context:") ||
        line.startsWith("AI-generated.")
      ) {
        continue;
      }

      if (line === "") {
        flushParagraph();
        continue;
      }

      currentParagraph.push(line);
    }
    flushParagraph();

    const bodyContent = paragraphs
      .map((paragraph) => `<p class="narrative-para">${escHtml(paragraph)}</p>`)
      .join("\n");

    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>AI-Polished Sentencing Mitigation Memorandum${clientName ? `: ${escHtml(clientName)}` : ""}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: "Times New Roman", Times, Georgia, serif;
      font-size: 12pt;
      line-height: 1.7;
      color: #111;
      background: #fff;
      padding: 1in;
      max-width: 8.5in;
      margin: 0 auto;
      position: relative;
    }

    @media print {
      body::before {
        content: "DRAFT";
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-35deg);
        font-size: 96pt;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 900;
        color: rgba(0,0,0,0.045);
        letter-spacing: 0.12em;
        pointer-events: none;
        z-index: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    .doc-header {
      border-bottom: 2.5px solid #111;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .doc-header-title {
      text-align: center;
      font-size: 14pt;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .doc-header-meta {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      gap: 2px 12px;
      font-size: 10.5pt;
    }
    .doc-header-meta .meta-label {
      font-weight: bold;
      white-space: nowrap;
      color: #333;
    }
    .doc-header-meta .meta-value {
      min-width: 0;
      color: #111;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .draft-callout {
      display: flex;
      flex-direction: column;
      gap: 3px;
      background: #fef9c3;
      border: 1.5px solid #ca8a04;
      border-left: 5px solid #b45309;
      padding: 10px 14px;
      border-radius: 3px;
      margin-bottom: 22px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .draft-label {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #92400e;
    }
    .draft-body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9pt;
      color: #78350f;
    }

    .narrative-para {
      font-size: 11.5pt;
      margin-bottom: 12px;
      white-space: pre-wrap;
      orphans: 3;
      widows: 3;
    }

    @page {
      size: letter portrait;
      margin: 1in;
      @bottom-center {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 9pt;
        font-family: Arial, Helvetica, sans-serif;
        color: #666;
      }
    }
    @page :first { @top-right { content: ""; } }

    @media print {
      body {
        padding: 0;
        max-width: none;
      }
      .draft-callout {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="doc-header">
    <div class="doc-header-title">Sentencing Mitigation Memorandum</div>
    <div class="doc-header-meta">
      ${preparedDate ? `<span class="meta-label">Prepared:</span><span class="meta-value">${escHtml(preparedDate)}</span>` : ""}
      ${clientName ? `<span class="meta-label">Client:</span><span class="meta-value">${escHtml(clientName)}</span>` : ""}
      ${caseNumber ? `<span class="meta-label">Case No.:</span><span class="meta-value">${escHtml(caseNumber)}</span>` : ""}
      ${proceedingContext ? `<span class="meta-label">Context:</span><span class="meta-value">${escHtml(proceedingContext)}</span>` : ""}
    </div>
  </div>
  <div class="draft-callout" role="note">
    <span class="draft-label">AI-POLISHED DRAFT: Not for filing without attorney review</span>
    <span class="draft-body">AI-generated. You must edit and verify every claim before use. Do not file without attorney review.</span>
  </div>
  ${bodyContent}
</body>
</html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  return (
    <div className="mt-4 rounded-xl border border-violet-200 dark:border-violet-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-violet-50 dark:bg-violet-950/40 border-b border-violet-200 dark:border-violet-800">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          <span className="text-sm font-semibold text-violet-900 dark:text-violet-200">
            Polish with AI
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 uppercase tracking-wide">
            Beta
          </span>
        </div>
        {polish.status !== "loading" && (
          <button
            type="button"
            onClick={handlePolish}
            disabled={!!(captchaRequired && !captchaToken) || polishCooldown}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {polishCooldown ? "Please wait…" : polish.status === "idle" ? "Generate narrative" : "Regenerate"}
          </button>
        )}
      </div>

      {/* Info banner */}
      <div className="px-4 py-2.5 bg-violet-50/60 dark:bg-violet-950/20 border-b border-violet-100 dark:border-violet-900/50">
        <p className="text-[11px] text-violet-800 dark:text-violet-300 leading-relaxed">
          <span className="font-semibold">Field-locked:</span> Claude will only use information you entered; empty fields are skipped and nothing is inferred. Output is unlabeled prose; your structured summary above remains unchanged. Anthropic may retain API data for up to 30 days under its standard terms.
        </p>
      </div>

      {/* CAPTCHA verification — shown whenever the Generate/Regenerate button above is active */}
      {captchaRequired && polish.status !== "loading" && (
        <div className="px-4 py-3 bg-background border-b border-violet-100 dark:border-violet-900/50 flex justify-center">
          <TurnstileCaptcha key={captchaAttempt} onVerify={setCaptchaToken} size="normal" />
        </div>
      )}

      {/* Body */}
      <div className="px-4 py-4 bg-background space-y-4">
        {polish.status === "idle" && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Click <span className="font-semibold text-violet-700 dark:text-violet-400">"Generate narrative"</span> above to convert your filled fields into court-ready prose.
          </p>
        )}

        {polish.status === "loading" && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
            Generating narrative…
          </div>
        )}

        {polish.status === "error" && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-300">{polish.message}</p>
          </div>
        )}

        {polish.status === "done" && (
          <>
            {/* DRAFT label */}
            <div className="flex items-center gap-2 rounded-md border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 px-3 py-2">
              <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                ⚠ DRAFT
              </span>
              <span className="text-xs text-red-700 dark:text-red-400">
                AI-generated. You must edit and verify every claim before use. Do not file without attorney review.
              </span>
            </div>

            {/* Editable textarea */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <SquarePen className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Edit before copying
                </span>
              </div>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={14}
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            {/* Pre-copy checklist */}
            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 space-y-2">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                Before copying — confirm:
              </p>
              <label className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed group-hover:text-amber-900 dark:group-hover:text-amber-200 transition-colors">
                  I have read and edited every sentence. Every factual claim is accurate and was provided by me. No statement implies guilt, admission, or wrongdoing.
                </span>
              </label>
            </div>

            {/* Copy + download actions */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handlePolishCopy}
                disabled={!checkboxChecked}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {polishCopied ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {polishCopied ? "Copied" : "Copy polished draft"}
              </button>
              <button
                type="button"
                onClick={handleDownloadPolishDocx}
                disabled={!checkboxChecked || polishDocxLoading}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="h-3.5 w-3.5" />
                {polishDocxLoading ? "Building…" : "Download .docx"}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                disabled={!checkboxChecked}
                title="Opens your browser's print dialog. Choose 'Save as PDF' for a PDF copy."
                aria-label="Print or save polished draft as PDF: opens browser print dialog"
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Printer className="h-3.5 w-3.5" />
                Print / PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Output panel ─── */

function OutputPanel({ output, form }: { output: string; form: FormState }) {
  const [copied, setCopied] = useState(false);
  const [docxLoading, setDocxLoading] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      const el = document.createElement("textarea");
      el.value = output;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    triggerDownload(blob, "mitigation-summary-draft.txt");
  };

  const handleDownloadDocx = async () => {
    setDocxLoading(true);
    try {
      const doc = new Document({
        creator: "OpenDefender Advocate Hub",
        title: "Mitigation Summary — Draft",
        sections: [
          {
            properties: {
              page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
            },
            headers: { default: createDraftWatermarkHeader() },
            footers: { default: createPageNumberFooter() },
            children: buildDocxParagraphs(output, form),
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      triggerDownload(blob, "mitigation-summary-draft.docx");
    } finally {
      setDocxLoading(false);
    }
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;

    // Parse output lines into structured HTML sections
    const KNOWN_HEADERS = [
      "COMMUNITY TIES", "HOUSING STABILITY", "EMPLOYMENT",
      "TREATMENT PARTICIPATION", "FAMILY RESPONSIBILITIES",
      "CHARACTER REFERENCES", "ADDITIONAL CONTEXT",
    ];

    const lines = output.split("\n");
    const htmlParts: string[] = [];

    // Extract header metadata first so it can live in the header block
    let clientName = "";
    let preparedDate = "";
    let caseNumber = "";
    let proceedingContext = "";
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith("Client:")) clientName = line.replace("Client:", "").trim();
      if (line.startsWith("Prepared:")) preparedDate = line.replace("Prepared:", "").trim();
      if (line.startsWith("Case No.:")) caseNumber = line.replace("Case No.:", "").trim();
      if (line.startsWith("Context:")) proceedingContext = line.replace("Context:", "").trim();
    }

    let inList = false;
    const closeList = () => {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();

      // Skip dividers, title, and metadata lines (rendered in header block)
      if (/^─+$/.test(line)) continue;
      if (line === "MITIGATION SUMMARY — DRAFT") continue;
      if (line.startsWith("Prepared:") || line.startsWith("Client:") || line.startsWith("Case No.:") || line.startsWith("Context:")) continue;

      // Draft warning — render as prominent callout
      if (line.startsWith("Review every line")) {
        closeList();
        htmlParts.push(
          `<div class="draft-callout" role="note">` +
          `<span class="draft-label">DRAFT — Review before use</span>` +
          `<span class="draft-body">${escHtml(line)}</span>` +
          `</div>`
        );
        continue;
      }

      // Section headers — each gets a page-break hint
      if (KNOWN_HEADERS.includes(line)) {
        closeList();
        htmlParts.push(`<h2 class="section-head">${escHtml(line)}</h2>`);
        continue;
      }

      // Bullet items
      if (line.startsWith("• ")) {
        if (!inList) { htmlParts.push('<ul class="fact-list">'); inList = true; }
        htmlParts.push(`<li>${escHtml(line.slice(2))}</li>`);
        continue;
      }

      // Footer verification line
      if (line.startsWith("Verify every claim") || line.startsWith("This summary contains")) {
        closeList();
        htmlParts.push(`<p class="footer-note">${escHtml(line)}</p>`);
        continue;
      }

      // Blank line — spacer
      if (line === "") {
        closeList();
        continue;
      }

      // Free-form text (references, additional context)
      closeList();
      htmlParts.push(`<p class="body-para">${escHtml(line)}</p>`);
    }
    closeList();

    const bodyContent = htmlParts.join("\n");

    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Sentencing Mitigation Memorandum${clientName ? `: ${clientName}` : ""}</title>
  <style>
    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Body — screen preview ── */
    body {
      font-family: "Times New Roman", Times, Georgia, serif;
      font-size: 12pt;
      line-height: 1.7;
      color: #111;
      background: #fff;
      padding: 1in;
      max-width: 8.5in;
      margin: 0 auto;
      position: relative;
    }

    /* ── DRAFT watermark — shows on every printed page ── */
    @media print {
      body::before {
        content: "DRAFT";
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-35deg);
        font-size: 96pt;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 900;
        color: rgba(0,0,0,0.045);
        letter-spacing: 0.12em;
        pointer-events: none;
        z-index: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    /* ── Document header block ── */
    .doc-header {
      border-bottom: 2.5px solid #111;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .doc-header-title {
      text-align: center;
      font-size: 14pt;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .doc-header-meta {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      gap: 2px 12px;
      font-size: 10.5pt;
    }
    .doc-header-meta .meta-label {
      font-weight: bold;
      white-space: nowrap;
      color: #333;
    }
    .doc-header-meta .meta-value {
      min-width: 0;
      color: #111;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    /* ── DRAFT callout ── */
    .draft-callout {
      display: flex;
      flex-direction: column;
      gap: 3px;
      background: #fef9c3;
      border: 1.5px solid #ca8a04;
      border-left: 5px solid #b45309;
      padding: 10px 14px;
      border-radius: 3px;
      margin-bottom: 20px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .draft-label {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #92400e;
    }
    .draft-body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9pt;
      color: #78350f;
    }

    /* ── Section headings ── */
    .section-head {
      font-size: 10.5pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: bold;
      border-bottom: 1px solid #444;
      padding-bottom: 3px;
      margin-top: 26px;
      margin-bottom: 8px;
      break-after: avoid;
      page-break-after: avoid;
      orphans: 3;
      widows: 3;
    }

    /* ── Bullet lists ── */
    .fact-list {
      list-style: none;
      padding-left: 0;
      margin: 4px 0 10px 0;
    }
    .fact-list li {
      padding-left: 1.3em;
      text-indent: -1.3em;
      margin-bottom: 5px;
      font-size: 11pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .fact-list li::before { content: "\\2022\\00A0"; }

    /* ── Body paragraphs ── */
    .body-para {
      font-size: 11pt;
      margin-bottom: 7px;
    }

    /* ── Footer note ── */
    .footer-note {
      font-size: 9pt;
      font-style: italic;
      color: #555;
      margin-top: 28px;
      border-top: 1px solid #ccc;
      padding-top: 10px;
    }

    /* ── @page: letter with 1-inch margins + page numbers ── */
    @page {
      size: letter portrait;
      margin: 1in;
      @bottom-center {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 9pt;
        font-family: Arial, Helvetica, sans-serif;
        color: #666;
      }
    }
    @page :first {
      @top-right { content: ""; }
    }

    @media print {
      body {
        padding: 0;
        max-width: none;
      }
      .draft-callout {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .section-head {
        break-after: avoid;
        page-break-after: avoid;
      }
      .fact-list li {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="doc-header">
    <div class="doc-header-title">Sentencing Mitigation Memorandum</div>
    <div class="doc-header-meta">
      ${preparedDate ? `<span class="meta-label">Prepared:</span><span class="meta-value">${escHtml(preparedDate)}</span>` : ""}
      ${clientName ? `<span class="meta-label">Client:</span><span class="meta-value">${escHtml(clientName)}</span>` : ""}
      ${caseNumber ? `<span class="meta-label">Case No.:</span><span class="meta-value">${escHtml(caseNumber)}</span>` : ""}
      ${proceedingContext ? `<span class="meta-label">Context:</span><span class="meta-value">${escHtml(proceedingContext)}</span>` : ""}
    </div>
  </div>
  ${bodyContent}
</body>
</html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  const empty = !output;

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Summary output</span>
        </div>
      </div>
      {!empty && (
        <div className="flex flex-wrap gap-2 px-4 py-2.5 border-b border-border bg-muted/10">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            .txt
          </button>
          <button
            type="button"
            onClick={handleDownloadDocx}
            disabled={docxLoading}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            {docxLoading ? "Building…" : ".docx"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            title="Opens your browser's print dialog. Choose 'Save as PDF' for a PDF copy."
            aria-label="Print or save as PDF: opens browser print dialog"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / PDF
          </button>
        </div>
      )}

      {empty ? (
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">
          Fill in fields on the left and your summary will appear here.
        </div>
      ) : (
        <>
          <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <span className="font-semibold">Draft only.</span> This summary contains only information you entered. Verify every claim independently before including it in any court filing or communication.
            </p>
          </div>
          <pre className="px-5 py-5 text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {output}
          </pre>
        </>
      )}
    </div>
  );
}

/* ─── Polish wrapper (only rendered when there is output) ─── */

function OutputWithPolish({ output, form }: { output: string; form: FormState }) {
  return (
    <>
      <OutputPanel output={output} form={form} />
      {output && <PolishPanel form={form} />}
    </>
  );
}

/* ─── Main page ─── */

export default function MitigationBuilder() {
  useScrollToTop();
  const [form, setForm] = useState<FormState>(EMPTY);

  function set(key: keyof FormState) {
    return (value: string) => setForm((f) => ({ ...f, [key]: value }));
  }

  function countFilled(...keys: (keyof FormState)[]): number {
    return keys.filter((k) => form[k].trim() !== "").length;
  }

  const output = generateOutput(form);

  const hasAnyInput = Object.values(form).some((v) => v.trim() !== "");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page header */}
      <section className="vivid-header-purple py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 vivid-header-content">
          <Link
            href="/for-advocates"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold mb-5 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Advocate Hub
          </Link>
          <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-2">
            Advocate tool
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
            Mitigation Builder
          </h1>
          <p className="text-sm md:text-base text-white/75 max-w-2xl leading-relaxed">
            A structured intake form covering the social history domains courts respond to. Fill in what you know and your formatted summary appears on the right, ready to copy or print.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white/80">
              Nothing is saved or sent anywhere
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white/80">
              For use at bail, diversion, and sentencing hearings
            </span>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <span className="font-semibold">For attorney use or use under direct attorney supervision.</span> This tool does not create legal advice, and documents it produces are not automatically privileged. If you are the attorney of record, printed output may constitute attorney work product. If you are not an attorney, this document is not privileged and may be subject to disclosure. Review any output with supervising counsel before retaining or sharing it.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Left: form */}
          <div className="space-y-3">
            {/* Header fields */}
            <div className="rounded-xl border border-border px-5 py-5 space-y-4 bg-background">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Header information
              </p>
              <div>
                <Label htmlFor="mitigation-client-name" hint="optional">Client name or identifier</Label>
                <Input
                  id="mitigation-client-name"
                  value={form.clientName}
                  onChange={set("clientName")}
                  placeholder="e.g. J. Smith — or leave blank"
                />
              </div>
              <div>
                <Label hint="optional">Case / docket number</Label>
                <Input
                  value={form.caseNumber}
                  onChange={set("caseNumber")}
                  placeholder="e.g. 2024-CR-00512"
                />
              </div>
              <div>
                <Label hint="optional">Proceeding context</Label>
                <Input
                  value={form.caseContext}
                  onChange={set("caseContext")}
                  placeholder="e.g. Bail hearing, diversion application, sentencing memo"
                />
              </div>
            </div>

            {/* Domain 1 — Community Ties */}
            <Domain
              title="Community Ties"
              filled={countFilled("yearsInCommunity", "familyNearby", "communityInvolvement")}
              defaultOpen
            >
              <div>
                <Label htmlFor="mitigation-years-in-community" hint="optional">Time in community</Label>
                <Input
                  id="mitigation-years-in-community"
                  value={form.yearsInCommunity}
                  onChange={set("yearsInCommunity")}
                  placeholder="e.g. 12 years in [city/neighborhood]"
                />
              </div>
              <div>
                <Label hint="optional">Family members in the area</Label>
                <Input
                  value={form.familyNearby}
                  onChange={set("familyNearby")}
                  placeholder="e.g. Mother, two siblings, spouse"
                />
              </div>
              <div>
                <Label hint="optional">Civic, religious, or community involvement</Label>
                <Textarea
                  value={form.communityInvolvement}
                  onChange={set("communityInvolvement")}
                  placeholder="e.g. Volunteer at local food pantry, active member of church, coaches youth soccer"
                  rows={2}
                />
              </div>
            </Domain>

            {/* Domain 2 — Housing */}
            <Domain
              title="Housing Stability"
              filled={countFilled("housingStatus", "housingDuration", "dependentsAtHome")}
            >
              <div>
                <Label>Current housing status</Label>
                <Select
                  value={form.housingStatus}
                  onChange={set("housingStatus")}
                  placeholder="Select status…"
                  options={[
                    "Stable — own home",
                    "Stable — renting",
                    "Living with family",
                    "Transitional housing",
                    "Housing at risk",
                    "Currently unhoused",
                    "Other (describe in notes)",
                  ]}
                />
              </div>
              <div>
                <Label hint="optional">Duration at current address</Label>
                <Input
                  value={form.housingDuration}
                  onChange={set("housingDuration")}
                  placeholder="e.g. 3 years, 8 months"
                />
              </div>
              <div>
                <Label hint="optional">Dependents living at home</Label>
                <Input
                  value={form.dependentsAtHome}
                  onChange={set("dependentsAtHome")}
                  placeholder="e.g. Two minor children, ages 4 and 7"
                />
              </div>
            </Domain>

            {/* Domain 3 — Employment */}
            <Domain
              title="Employment"
              filled={countFilled("employmentStatus", "employer", "employmentDuration", "employerNote")}
            >
              <div>
                <Label>Employment status</Label>
                <Select
                  value={form.employmentStatus}
                  onChange={set("employmentStatus")}
                  placeholder="Select status…"
                  options={[
                    "Employed full-time",
                    "Employed part-time",
                    "Self-employed",
                    "Unemployed — actively seeking",
                    "Unemployed — unable to work",
                    "Student",
                    "Retired",
                  ]}
                />
              </div>
              <div>
                <Label hint="optional">Employer (only if client consents to disclosure)</Label>
                <Input
                  value={form.employer}
                  onChange={set("employer")}
                  placeholder="Employer name or industry"
                />
              </div>
              <div>
                <Label hint="optional">Duration of employment</Label>
                <Input
                  value={form.employmentDuration}
                  onChange={set("employmentDuration")}
                  placeholder="e.g. 4 years, 6 months"
                />
              </div>
              <div>
                <Label hint="optional">Employer relationship or willingness to retain</Label>
                <Textarea
                  value={form.employerNote}
                  onChange={set("employerNote")}
                  placeholder="e.g. Supervisor has expressed willingness to hold position pending resolution"
                  rows={2}
                />
              </div>
            </Domain>

            {/* Domain 4 — Treatment */}
            <Domain
              title="Treatment Participation"
              filled={countFilled("mentalHealthTreatment", "substanceTreatment", "treatmentDocumentation")}
            >
              <div>
                <Label hint="optional">Mental health treatment</Label>
                <Textarea
                  value={form.mentalHealthTreatment}
                  onChange={set("mentalHealthTreatment")}
                  placeholder="e.g. Engaged in weekly outpatient therapy since [date]; diagnosis not required"
                  rows={2}
                />
              </div>
              <div>
                <Label hint="optional">Substance use treatment</Label>
                <Textarea
                  value={form.substanceTreatment}
                  onChange={set("substanceTreatment")}
                  placeholder="e.g. Completed 6-month outpatient program at [program]; currently attending weekly meetings"
                  rows={2}
                />
              </div>
              <div>
                <Label hint="optional">Documentation available</Label>
                <Input
                  value={form.treatmentDocumentation}
                  onChange={set("treatmentDocumentation")}
                  placeholder="e.g. Attendance records, provider letter, program certificate"
                />
              </div>
            </Domain>

            {/* Domain 5 — Family responsibilities */}
            <Domain
              title="Family Responsibilities"
              filled={countFilled("caregiverStatus", "numberOfDependents", "providerStatus", "familyContext")}
            >
              <div>
                <Label>Primary caregiver role</Label>
                <Select
                  value={form.caregiverStatus}
                  onChange={set("caregiverStatus")}
                  placeholder="Select…"
                  options={[
                    "Yes — primary caregiver",
                    "Yes — co-caregiver",
                    "No caregiver role",
                  ]}
                />
              </div>
              <div>
                <Label hint="optional">Number and ages of dependents</Label>
                <Input
                  value={form.numberOfDependents}
                  onChange={set("numberOfDependents")}
                  placeholder="e.g. 3 children (ages 2, 5, 9); elderly parent"
                />
              </div>
              <div>
                <Label>Financial provider role</Label>
                <Select
                  value={form.providerStatus}
                  onChange={set("providerStatus")}
                  placeholder="Select…"
                  options={[
                    "Sole financial provider",
                    "Primary financial provider",
                    "Co-provider",
                    "Not primary provider",
                  ]}
                />
              </div>
              <div>
                <Label hint="optional">Additional family context</Label>
                <Textarea
                  value={form.familyContext}
                  onChange={set("familyContext")}
                  placeholder="e.g. Caring for parent with dementia; only licensed driver in household"
                  rows={2}
                />
              </div>
            </Domain>

            {/* Domain 6 — Character references */}
            <Domain
              title="Character References"
              filled={countFilled("references")}
            >
              <div>
                <Label hint="list one per line">
                  References — name, relationship, capacity to speak
                </Label>
                <Textarea
                  value={form.references}
                  onChange={set("references")}
                  placeholder={
                    "Maria Gonzalez — employer of 4 years — can speak to work ethic and reliability\n" +
                    "Pastor James Hill — faith community leader — can speak to character and community ties\n" +
                    "Dr. Sarah Park — therapist — can provide letter regarding treatment progress"
                  }
                  rows={5}
                />
              </div>
            </Domain>

            {/* Domain 7 — Additional context */}
            <Domain
              title="Additional Context"
              filled={countFilled("additionalContext")}
            >
              <div>
                <Label hint="advocate's discretion">
                  Trauma history, health context, or other relevant background
                </Label>
                <Textarea
                  value={form.additionalContext}
                  onChange={set("additionalContext")}
                  placeholder="Include only what the advocate has determined is appropriate to disclose and has been discussed with the client. This section is free-form."
                  rows={4}
                />
              </div>
            </Domain>

            {/* Clear button */}
            {hasAnyInput && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Clear all fields? This cannot be undone.")) {
                    setForm(EMPTY);
                  }
                }}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors underline underline-offset-2"
              >
                Clear all fields
              </button>
            )}
          </div>

          {/* Right: output (sticky on desktop) */}
          <div className="lg:sticky lg:top-6">
            <OutputWithPolish output={output} form={form} />

            {/* Cross-links to reputation page */}
            <div className="mt-4 rounded-xl border border-border/60 px-5 py-4 bg-muted/20">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                After the case resolves
              </p>
              <div className="space-y-2">
                {[
                  { label: "Expungement & record sealing eligibility", href: "/support/reputation/eligibility" },
                  { label: "Rap sheet review & error correction", href: "/support/reputation#rap-sheet" },
                  { label: "Background check rights (FCRA)", href: "/support/reputation#fcra-rights" },
                  { label: "Certificates of relief", href: "/support/reputation#certificates-of-relief" },
                  { label: "Employer & landlord communication templates", href: "/support/reputation#reputation-comms" },
                ].map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors py-1 border-b border-border/30 last:border-0"
                  >
                    {label}
                    <span className="text-muted-foreground/50 ml-2">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
