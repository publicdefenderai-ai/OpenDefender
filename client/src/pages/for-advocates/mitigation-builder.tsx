import { useState } from "react";
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
} from "lucide-react";
import { Document, Paragraph, TextRun, AlignmentType, Packer } from "docx";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

/* ─── Types ─── */

interface FormState {
  clientName: string;
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

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1">
      <span className="text-sm font-medium text-foreground">{children}</span>
      {hint && <span className="text-xs text-muted-foreground ml-2">{hint}</span>}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
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

function buildDocxParagraphs(output: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const lines = output.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip the divider lines
    if (/^─+$/.test(trimmed)) continue;

    // Title line
    if (trimmed === "MITIGATION SUMMARY — DRAFT") {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: trimmed, bold: true, size: 28, font: "Times New Roman" })],
        })
      );
      continue;
    }

    // Warning / footer verification line
    if (
      trimmed.startsWith("Review every line") ||
      trimmed.startsWith("Verify every claim")
    ) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: trimmed, italics: true, size: 20, font: "Times New Roman", color: "CC0000" })],
        })
      );
      continue;
    }

    // Domain section headers (ALL CAPS, no bullet)
    const knownHeaders = [
      "COMMUNITY TIES", "HOUSING STABILITY", "EMPLOYMENT",
      "TREATMENT PARTICIPATION", "FAMILY RESPONSIBILITIES",
      "CHARACTER REFERENCES", "ADDITIONAL CONTEXT",
    ];
    if (knownHeaders.includes(trimmed)) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 240, after: 80 },
          children: [new TextRun({ text: trimmed, bold: true, size: 24, font: "Times New Roman" })],
        })
      );
      continue;
    }

    // Bullet items
    if (trimmed.startsWith("• ")) {
      paragraphs.push(
        new Paragraph({
          indent: { left: 360 },
          spacing: { after: 40 },
          children: [new TextRun({ text: trimmed, size: 24, font: "Times New Roman" })],
        })
      );
      continue;
    }

    // Prepared / Client / Context header lines
    if (
      trimmed.startsWith("Prepared:") ||
      trimmed.startsWith("Client:") ||
      trimmed.startsWith("Context:")
    ) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: trimmed, size: 24, font: "Times New Roman" })],
        })
      );
      continue;
    }

    // Blank line
    if (trimmed === "") {
      paragraphs.push(new Paragraph({ children: [] }));
      continue;
    }

    // Everything else (free-form reference text, additional context)
    paragraphs.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: trimmed, size: 24, font: "Times New Roman" })],
      })
    );
  }

  return paragraphs;
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

/* ─── Output panel ─── */

function OutputPanel({ output }: { output: string }) {
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
            children: buildDocxParagraphs(output),
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
    let proceedingContext = "";
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith("Client:")) clientName = line.replace("Client:", "").trim();
      if (line.startsWith("Prepared:")) preparedDate = line.replace("Prepared:", "").trim();
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
      if (line.startsWith("Prepared:") || line.startsWith("Client:") || line.startsWith("Context:")) continue;

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
  <title>Sentencing Mitigation Memorandum${clientName ? ` \u2014 ${clientName}` : ""}</title>
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
      grid-template-columns: auto 1fr;
      gap: 2px 12px;
      font-size: 10.5pt;
    }
    .doc-header-meta .meta-label {
      font-weight: bold;
      white-space: nowrap;
      color: #333;
    }
    .doc-header-meta .meta-value {
      color: #111;
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
            title="Opens your browser's print dialog — choose 'Save as PDF' for a PDF copy."
            aria-label="Print or save as PDF — opens browser print dialog"
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
                <Label hint="optional">Client name or identifier</Label>
                <Input
                  value={form.clientName}
                  onChange={set("clientName")}
                  placeholder="e.g. J. Smith — or leave blank"
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
                <Label hint="optional">Time in community</Label>
                <Input
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
            <OutputPanel output={output} />

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
