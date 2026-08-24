import { useState } from "react";
import {
  FileText, Copy, Check, Printer, AlertTriangle, ChevronDown, ChevronUp,
  ArrowLeft, Download, Shield, Info,
} from "lucide-react";
import { Document, Paragraph, TextRun, AlignmentType, Packer } from "docx";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

/* -- Types ---------------------------------------------------------------- */

type TriValue = 'yes' | 'unknown' | 'no' | '';

interface IntakeState {
  clientId: string;
  charges: string;
  courtDate: string;
  caseNumber: string;
  jurisdiction: string;
  pdAssigned: TriValue;
  pdContact: string;
  onProbation: TriValue;
  onParole: TriValue;
  openWarrant: TriValue;
  priorFelony: TriValue;
  priorMisdemeanor: TriValue;
  usCitizen: TriValue;
  immigrationProceedings: TriValue;
  currentlyDetained: TriValue;
  stableHousing: TriValue;
  housingAtRisk: TriValue;
  mentalHealthHistory: TriValue;
  mentalHealthTreatment: TriValue;
  substanceUseHistory: TriValue;
  substanceUseTreatment: TriValue;
  medicationsIfDetained: TriValue;
  primaryCaregiver: TriValue;
  numberOfDependents: string;
  pregnantPostpartum: TriValue;
  soleProvider: TriValue;
  docsId: boolean;
  docsAddress: boolean;
  docsEmployment: boolean;
  docsCharacterRefs: boolean;
  docsTreatment: boolean;
  docsCommunityTies: boolean;
}

interface IntakeFlag {
  severity: 'critical' | 'warning';
  label: string;
  text: string;
  link?: { label: string; href: string };
}

const EMPTY: IntakeState = {
  clientId: '', charges: '', courtDate: '', caseNumber: '', jurisdiction: '', pdAssigned: '', pdContact: '',
  onProbation: '', onParole: '', openWarrant: '', priorFelony: '', priorMisdemeanor: '',
  usCitizen: '', immigrationProceedings: '',
  currentlyDetained: '', stableHousing: '', housingAtRisk: '',
  mentalHealthHistory: '', mentalHealthTreatment: '', substanceUseHistory: '', substanceUseTreatment: '', medicationsIfDetained: '',
  primaryCaregiver: '', numberOfDependents: '', pregnantPostpartum: '', soleProvider: '',
  docsId: false, docsAddress: false, docsEmployment: false, docsCharacterRefs: false, docsTreatment: false, docsCommunityTies: false,
};

/* -- Flag computation ----------------------------------------------------- */

function computeFlags(s: IntakeState): IntakeFlag[] {
  const flags: IntakeFlag[] = [];
  if (s.onProbation === 'yes' || s.onParole === 'yes') {
    flags.push({ severity: 'critical', label: 'Active supervision', text: 'A new conviction will automatically trigger a revocation proceeding. Notify the supervising attorney before any plea discussion.' });
  }
  if (s.openWarrant === 'yes') {
    flags.push({ severity: 'critical', label: 'Open warrant', text: 'Must be addressed before court date. Client may be re-arrested when appearing on the current charge.' });
  }
  if (s.usCitizen === 'no') {
    flags.push({ severity: 'critical', label: 'Padilla screening required', text: 'Non-citizen. Criminal conviction may trigger removal, inadmissibility, or loss of immigration status. Immigration counsel referral required before any plea.', link: { label: 'Immigration guidance', href: '/immigration-guidance' } });
  }
  if (s.immigrationProceedings === 'yes') {
    flags.push({ severity: 'critical', label: 'Active immigration proceedings', text: 'Criminal charge may compound immigration consequences. Coordinate with immigration counsel immediately.' });
  }
  if (s.currentlyDetained === 'yes') {
    flags.push({ severity: 'warning', label: 'Client currently detained', text: 'Bail preparation is the immediate priority. Pretrial detention is the single strongest predictor of case outcome.', link: { label: 'Bail preparation tool', href: '/support/court-logistics/bail-preparation' } });
  }
  if (s.housingAtRisk === 'yes') {
    flags.push({ severity: 'warning', label: 'Housing at risk', text: 'This case may trigger housing loss. Document for collateral consequence screen and bail argument.' });
  }
  if (s.mentalHealthHistory === 'yes' || s.substanceUseHistory === 'yes') {
    flags.push({ severity: 'warning', label: 'Treatment history', text: 'Treatment documentation may strengthen bail and diversion arguments. Obtain records with client consent.', link: { label: 'Mental health resources', href: '/support/mental-health' } });
  }
  if (s.primaryCaregiver === 'yes') {
    flags.push({ severity: 'warning', label: 'Primary caregiver', text: 'Detention or conviction directly impacts dependents. Document for bail argument and collateral consequence screen.' });
  }
  if (s.pregnantPostpartum === 'yes') {
    flags.push({ severity: 'warning', label: 'Pregnant or postpartum', text: 'Relevant to detention conditions, bail, and diversion eligibility in many jurisdictions. Raise with supervising attorney.' });
  }
  if (s.medicationsIfDetained === 'yes') {
    flags.push({ severity: 'warning', label: 'Medications needed', text: 'Client requires medication if detained. Notify jail medical staff and supervising attorney immediately.' });
  }
  return flags;
}

/* -- Output generation ---------------------------------------------------- */

function generateOutput(s: IntakeState, flags: IntakeFlag[]): string {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const RULE = "\u2500".repeat(48);
  const lines: string[] = [];

  lines.push("CLIENT INTAKE RECORD \u2014 DRAFT");
  lines.push("FOR ATTORNEY USE OR USE UNDER DIRECT ATTORNEY SUPERVISION");
  lines.push(`Prepared: ${today}`);
  lines.push("");

  if (flags.length > 0) {
    lines.push("FLAGS REQUIRING IMMEDIATE ATTENTION");
    lines.push(RULE);
    for (const f of flags) {
      lines.push(`\u26A0 ${f.label.toUpperCase()}: ${f.text}`);
    }
    lines.push("");
  }

  const hasCaseInfo = s.clientId || s.charges || s.courtDate || s.caseNumber || s.jurisdiction || s.pdAssigned;
  if (hasCaseInfo) {
    lines.push("CASE INFORMATION"); lines.push(RULE);
    if (s.clientId) lines.push(`Client identifier: ${s.clientId}`);
    if (s.charges) lines.push(`Charge(s): ${s.charges}`);
    if (s.courtDate) lines.push(`Court date: ${s.courtDate}`);
    if (s.caseNumber) lines.push(`Case number: ${s.caseNumber}`);
    if (s.jurisdiction) lines.push(`Jurisdiction: ${s.jurisdiction}`);
    if (s.pdAssigned) lines.push(`PD assigned: ${s.pdAssigned}`);
    if (s.pdContact) lines.push(`PD contact: ${s.pdContact}`);
    lines.push("");
  }

  const hasSuperv = s.onProbation || s.onParole || s.openWarrant || s.priorFelony || s.priorMisdemeanor;
  if (hasSuperv) {
    lines.push("SUPERVISION & RECORD"); lines.push(RULE);
    if (s.onProbation) lines.push(`On probation: ${s.onProbation}`);
    if (s.onParole) lines.push(`On parole: ${s.onParole}`);
    if (s.openWarrant) lines.push(`Open warrant: ${s.openWarrant}`);
    if (s.priorFelony) lines.push(`Prior felony: ${s.priorFelony}`);
    if (s.priorMisdemeanor) lines.push(`Prior misdemeanor: ${s.priorMisdemeanor}`);
    lines.push("");
  }

  const hasImmig = s.usCitizen || s.immigrationProceedings;
  if (hasImmig) {
    lines.push("IMMIGRATION"); lines.push(RULE);
    if (s.usCitizen) lines.push(`U.S. citizen: ${s.usCitizen}`);
    if (s.immigrationProceedings) lines.push(`Active immigration proceedings: ${s.immigrationProceedings}`);
    lines.push("");
  }

  const hasHousing = s.currentlyDetained || s.stableHousing || s.housingAtRisk;
  if (hasHousing) {
    lines.push("HOUSING & DETENTION"); lines.push(RULE);
    if (s.currentlyDetained) lines.push(`Currently detained: ${s.currentlyDetained}`);
    if (s.stableHousing) lines.push(`Stable housing: ${s.stableHousing}`);
    if (s.housingAtRisk) lines.push(`Housing at risk: ${s.housingAtRisk}`);
    lines.push("");
  }

  const hasHealth = s.mentalHealthHistory || s.mentalHealthTreatment || s.substanceUseHistory || s.substanceUseTreatment || s.medicationsIfDetained;
  if (hasHealth) {
    lines.push("HEALTH & TREATMENT"); lines.push(RULE);
    if (s.mentalHealthHistory) lines.push(`Mental health history: ${s.mentalHealthHistory}`);
    if (s.mentalHealthTreatment) lines.push(`In mental health treatment: ${s.mentalHealthTreatment}`);
    if (s.substanceUseHistory) lines.push(`Substance use history: ${s.substanceUseHistory}`);
    if (s.substanceUseTreatment) lines.push(`In substance use treatment: ${s.substanceUseTreatment}`);
    if (s.medicationsIfDetained) lines.push(`Medications needed if detained: ${s.medicationsIfDetained}`);
    lines.push("");
  }

  const hasFamily = s.primaryCaregiver || s.numberOfDependents || s.pregnantPostpartum || s.soleProvider;
  if (hasFamily) {
    lines.push("FAMILY & CAREGIVING"); lines.push(RULE);
    if (s.primaryCaregiver) lines.push(`Primary caregiver: ${s.primaryCaregiver}`);
    if (s.numberOfDependents) lines.push(`Number of dependents: ${s.numberOfDependents}`);
    if (s.pregnantPostpartum) lines.push(`Pregnant or postpartum: ${s.pregnantPostpartum}`);
    if (s.soleProvider) lines.push(`Sole financial provider: ${s.soleProvider}`);
    lines.push("");
  }

  const docsList = [
    s.docsId && "Photo ID",
    s.docsAddress && "Proof of address",
    s.docsEmployment && "Employment verification",
    s.docsCharacterRefs && "Character references",
    s.docsTreatment && "Treatment documentation (with client consent)",
    s.docsCommunityTies && "Proof of community ties",
  ].filter(Boolean) as string[];

  if (docsList.length > 0) {
    lines.push("DOCUMENTS TO OBTAIN"); lines.push(RULE);
    for (const d of docsList) lines.push(`\u2610 ${d}`);
    lines.push("");
  }

  const hasAny = hasCaseInfo || hasSuperv || hasImmig || hasHousing || hasHealth || hasFamily || docsList.length > 0 || flags.length > 0;
  if (!hasAny) return "";

  lines.push(RULE);
  lines.push("FOR ATTORNEY USE OR USE UNDER DIRECT ATTORNEY SUPERVISION");
  lines.push("If you are the attorney of record, this document may constitute attorney work product.");
  lines.push("If you are not an attorney, this document is not privileged and may be subject to disclosure.");
  lines.push("Do not retain, print, or share without first consulting the supervising attorney on this case.");
  lines.push("This record contains only screening flags. No client statements are recorded.");

  return lines.join("\n");
}

/* -- Docx builder --------------------------------------------------------- */

function buildDocxParagraphs(output: string, flags: IntakeFlag[]): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const SECTION_HEADERS = [
    "FLAGS REQUIRING IMMEDIATE ATTENTION", "CASE INFORMATION",
    "SUPERVISION & RECORD", "IMMIGRATION", "HOUSING & DETENTION",
    "HEALTH & TREATMENT", "FAMILY & CAREGIVING", "DOCUMENTS TO OBTAIN",
  ];

  for (const line of output.split("\n")) {
    const trimmed = line.trim();
    if (/^\u2500+$/.test(trimmed)) continue;

    if (trimmed === "CLIENT INTAKE RECORD \u2014 DRAFT") {
      paragraphs.push(new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: trimmed, bold: true, size: 28, font: "Times New Roman" })],
      }));
      continue;
    }

    if (
      trimmed === "FOR ATTORNEY USE OR USE UNDER DIRECT ATTORNEY SUPERVISION" ||
      trimmed.startsWith("If you are the attorney") ||
      trimmed.startsWith("If you are not an attorney") ||
      trimmed.startsWith("Do not retain") ||
      trimmed.startsWith("This record contains")
    ) {
      paragraphs.push(new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: trimmed, italics: true, size: 20, font: "Times New Roman", color: "CC0000" })],
      }));
      continue;
    }

    if (trimmed.startsWith("Prepared:")) {
      paragraphs.push(new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: trimmed, size: 22, font: "Times New Roman" })],
      }));
      continue;
    }

    if (SECTION_HEADERS.includes(trimmed)) {
      paragraphs.push(new Paragraph({
        spacing: { before: 240, after: 80 },
        children: [new TextRun({ text: trimmed, bold: true, size: 24, font: "Times New Roman" })],
      }));
      continue;
    }

    if (trimmed.startsWith("\u26A0 ")) {
      paragraphs.push(new Paragraph({
        indent: { left: 360 }, spacing: { after: 80 },
        children: [new TextRun({ text: trimmed, size: 22, font: "Times New Roman", bold: true, color: "CC0000" })],
      }));
      continue;
    }

    if (trimmed.startsWith("\u2610 ")) {
      paragraphs.push(new Paragraph({
        indent: { left: 360 }, spacing: { after: 60 },
        children: [new TextRun({ text: trimmed, size: 22, font: "Times New Roman" })],
      }));
      continue;
    }

    if (trimmed === "") {
      paragraphs.push(new Paragraph({ children: [] }));
      continue;
    }

    paragraphs.push(new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: trimmed, size: 22, font: "Times New Roman" })],
    }));
  }
  return paragraphs;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

/* -- UI components -------------------------------------------------------- */

function TriToggle({ value, onChange }: { value: TriValue; onChange: (v: TriValue) => void }) {
  const opts: { val: TriValue; label: string }[] = [
    { val: 'yes', label: 'Yes' },
    { val: 'unknown', label: 'Unknown' },
    { val: 'no', label: 'No' },
  ];
  return (
    <div className="flex rounded-lg border border-border overflow-hidden text-xs">
      {opts.map(({ val, label }) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(value === val ? '' : val)}
          className={`flex-1 px-2 py-2 font-semibold transition-colors border-r last:border-r-0 border-border leading-none
            ${value === val
              ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200'
              : 'bg-background text-muted-foreground hover:bg-muted/50'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function TriRow({
  label, value, onChange, flagValue, flagText, flagSeverity = 'warning', flagLink,
}: {
  label: string;
  value: TriValue;
  onChange: (v: TriValue) => void;
  flagValue?: TriValue;
  flagText?: string;
  flagSeverity?: 'critical' | 'warning';
  flagLink?: { label: string; href: string };
}) {
  const showFlag = flagValue && flagText && value === flagValue;
  return (
    <div className="space-y-1.5">
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <span className="min-w-0 text-sm text-foreground leading-snug flex-1">{label}</span>
        <div className="w-full sm:w-44 flex-shrink-0">
          <TriToggle value={value} onChange={onChange} />
        </div>
      </div>
      {showFlag && (
        <div className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs leading-relaxed
          ${flagSeverity === 'critical'
            ? 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
            : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
          }`}>
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          <div>
            <span>{flagText}</span>
            {flagLink && (
              <Link href={flagLink.href}>
                <span className="ml-1 font-semibold underline underline-offset-2 hover:no-underline">
                  {flagLink.label} &rarr;
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Domain({ title, filled, children, defaultOpen = false }: {
  title: string; filled: number; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm text-foreground">{title}</span>
          {filled > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
              {filled} {filled === 1 ? "field" : "fields"} filled
            </span>
          )}
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && <div className="px-5 py-5 space-y-4 bg-background">{children}</div>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1">
      <span className="text-sm font-medium text-foreground">{children}</span>
      {hint && <span className="text-xs text-muted-foreground ml-2">{hint}</span>}
    </div>
  );
}

function DocCheckbox({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <div
        onClick={() => onChange(!checked)}
        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors
          ${checked ? 'bg-violet-600 border-violet-600' : 'border-border group-hover:border-violet-400'}`}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </div>
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 px-3 py-2.5 mb-1">
      <Info className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">{children}</p>
    </div>
  );
}

/* -- Output panel --------------------------------------------------------- */

function OutputPanel({ output, flags }: { output: string; flags: IntakeFlag[] }) {
  const [copied, setCopied] = useState(false);
  const [docxLoading, setDocxLoading] = useState(false);
  const empty = !output;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(output); }
    catch {
      const el = document.createElement("textarea");
      el.value = output; document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    triggerDownload(new Blob([output], { type: "text/plain;charset=utf-8" }), "client-intake-record-draft.txt");
  };

  const handleDownloadDocx = async () => {
    setDocxLoading(true);
    try {
      const doc = new Document({
        creator: "OpenDefender Advocate Hub",
        title: "Client Intake Record \u2014 Draft",
        sections: [{
          properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
          children: buildDocxParagraphs(output, flags),
        }],
      });
      triggerDownload(await Packer.toBlob(doc), "client-intake-record-draft.docx");
    } finally { setDocxLoading(false); }
  };

  const handlePrint = () => {
    const flagsHtml = flags.map(f =>
      `<div style="background:${f.severity === 'critical' ? '#fef2f2' : '#fffbeb'};border:1px solid ${f.severity === 'critical' ? '#fca5a5' : '#fcd34d'};border-radius:4px;padding:8px 12px;margin-bottom:6px;font-size:12px;">
        <strong style="color:${f.severity === 'critical' ? '#991b1b' : '#92400e'};">\u26A0 ${f.label.toUpperCase()}</strong>
        <span style="color:${f.severity === 'critical' ? '#7f1d1d' : '#78350f'};"> ${f.text}</span>
       </div>`
    ).join('');

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Client Intake Record \u2014 Draft</title>
  <style>
    body{font-family:Arial,sans-serif;padding:32px;max-width:680px;margin:0 auto;color:#111;}
    .header{font-size:16px;font-weight:700;margin-bottom:2px;}
    .subheader{font-size:11px;color:#cc0000;font-style:italic;margin-bottom:4px;}
    .date{font-size:12px;color:#555;margin-bottom:20px;}
    .flags-title{font-size:13px;font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:.04em;}
    pre{white-space:pre-wrap;font-family:monospace;font-size:12px;line-height:1.7;}
    .disclaimer{font-size:10px;color:#cc0000;font-style:italic;margin-top:20px;padding-top:10px;border-top:1px solid #ddd;}
    @media print{body{padding:16px;}}
  </style>
</head>
<body>
  <div class="header">CLIENT INTAKE RECORD \u2014 DRAFT</div>
  <div class="subheader">FOR ATTORNEY USE OR USE UNDER DIRECT ATTORNEY SUPERVISION</div>
  <div class="date">Prepared: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
  ${flags.length > 0 ? `<div style="margin-bottom:20px;"><div class="flags-title">Flags Requiring Immediate Attention</div>${flagsHtml}</div>` : ''}
  <pre>${output.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
  <div class="disclaimer">If you are the attorney of record, this document may constitute attorney work product. If you are not an attorney, this document is not privileged and may be subject to disclosure. Do not retain, print, or share without first consulting the supervising attorney on this case. This record contains only screening flags. No client statements are recorded.</div>
</body>
</html>`);
    win.document.close(); win.print();
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Intake record output</span>
        </div>
      </div>

      {!empty && (
        <div className="flex flex-wrap gap-2 px-4 py-2.5 border-b border-border bg-muted/10">
          <button type="button" onClick={handleCopy} className="min-h-[44px] flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors">
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" onClick={handleDownloadTxt} className="min-h-[44px] flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors">
            <Download className="h-3.5 w-3.5" /> .txt
          </button>
          <button type="button" onClick={handleDownloadDocx} disabled={docxLoading} className="min-h-[44px] flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50">
            <Download className="h-3.5 w-3.5" /> {docxLoading ? "Building..." : ".docx"}
          </button>
          <button type="button" onClick={handlePrint} className="min-h-[44px] flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors">
            <Printer className="h-3.5 w-3.5" /> Print / PDF
          </button>
        </div>
      )}

      {flags.length > 0 && (
        <div className="px-4 py-3 border-b border-border space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Flags</p>
          {flags.map((f, i) => (
            <div key={i} className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs leading-relaxed
              ${f.severity === 'critical'
                ? 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
              }`}>
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{f.label}: </span>
                <span>{f.text}</span>
                {f.link && (
                  <Link href={f.link.href}>
                    <span className="ml-1 font-semibold underline underline-offset-2 hover:no-underline">
                      {f.link.label} &rarr;
                    </span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {empty ? (
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">
          Fill in screening questions and your intake record will appear here.
        </div>
      ) : (
        <>
          <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <span className="font-semibold">Draft only.</span> This record contains only screening flags, not client statements. Verify all items independently before taking any legal action.
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

/* -- Main page ------------------------------------------------------------ */

export default function IntakeChecklist() {
  useScrollToTop();
  const [s, setS] = useState<IntakeState>(EMPTY);

  function set<K extends keyof IntakeState>(key: K) {
    return (value: IntakeState[K]) => setS(prev => ({ ...prev, [key]: value }));
  }

  function countTri(...keys: (keyof IntakeState)[]): number {
    return keys.filter(k => (s[k] as TriValue) !== '').length;
  }
  function countText(...keys: (keyof IntakeState)[]): number {
    return keys.filter(k => String(s[k]).trim() !== '').length;
  }
  function countBool(...keys: (keyof IntakeState)[]): number {
    return keys.filter(k => s[k] === true).length;
  }

  const flags = computeFlags(s);
  const output = generateOutput(s, flags);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="vivid-header-purple py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 vivid-header-content">
          <Link href="/for-advocates" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold mb-5 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Advocate Hub
          </Link>
          <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-2">Advocate tool</p>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
            First Contact Intake Checklist
          </h1>
          <p className="text-sm md:text-base text-white/75 max-w-2xl leading-relaxed">
            A structured screening tool for the first meeting with a new client. Covers every legal-risk domain that must be identified before any plea discussion begins. Flags fire automatically for answers that require immediate legal attention.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white/80">Nothing is saved or sent anywhere</span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white/80">For defense counsel or use under attorney supervision</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
          <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <span className="font-semibold">For attorney use or use under direct attorney supervision.</span> This tool does not create legal advice, and documents it produces are not automatically privileged. If you are the attorney of record, printed output may constitute attorney work product. If you are not an attorney, this document is not privileged and may be subject to disclosure. Review any output with supervising counsel before retaining or sharing it.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          <div className="space-y-3">

            <Domain
              title="Case & Identification"
              filled={countText('clientId', 'charges', 'courtDate', 'caseNumber', 'jurisdiction', 'pdContact') + countTri('pdAssigned')}
              defaultOpen
            >
              <div>
                <FieldLabel hint="optional">Client name or identifier</FieldLabel>
                <TextInput value={s.clientId} onChange={set('clientId')} placeholder="e.g. J. Smith or leave blank" />
              </div>
              <div>
                <FieldLabel>Charge(s)</FieldLabel>
                <TextInput value={s.charges} onChange={set('charges')} placeholder="e.g. Burglary in the second degree" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Court date</FieldLabel>
                  <TextInput value={s.courtDate} onChange={set('courtDate')} placeholder="e.g. July 14, 2026" />
                </div>
                <div>
                  <FieldLabel>Case number</FieldLabel>
                  <TextInput value={s.caseNumber} onChange={set('caseNumber')} placeholder="e.g. 26-CR-00421" />
                </div>
              </div>
              <div>
                <FieldLabel>Jurisdiction</FieldLabel>
                <TextInput value={s.jurisdiction} onChange={set('jurisdiction')} placeholder="e.g. Cook County, IL" />
              </div>
              <div>
                <FieldLabel>Public defender assigned?</FieldLabel>
                <TriToggle value={s.pdAssigned} onChange={set('pdAssigned')} />
              </div>
              {s.pdAssigned === 'yes' && (
                <div>
                  <FieldLabel hint="optional">PD name / contact</FieldLabel>
                  <TextInput value={s.pdContact} onChange={set('pdContact')} placeholder="e.g. P.D. Martinez, (312) 555-0100" />
                </div>
              )}
            </Domain>

            <Domain
              title="Supervision & Record"
              filled={countTri('onProbation', 'onParole', 'openWarrant', 'priorFelony', 'priorMisdemeanor')}
            >
              <InfoNote>
                Flag only — no details recorded. Follow up verbally to avoid creating a written record of client admissions.
              </InfoNote>
              <div className="space-y-4">
                <TriRow label="Currently on probation?" value={s.onProbation} onChange={set('onProbation')}
                  flagValue="yes" flagSeverity="critical"
                  flagText="Active supervision. A new conviction triggers revocation proceedings. Notify supervising attorney before any plea." />
                <TriRow label="Currently on parole?" value={s.onParole} onChange={set('onParole')}
                  flagValue="yes" flagSeverity="critical"
                  flagText="Active supervision. A new conviction triggers revocation proceedings. Notify supervising attorney before any plea." />
                <TriRow label="Open warrant(s)?" value={s.openWarrant} onChange={set('openWarrant')}
                  flagValue="yes" flagSeverity="critical"
                  flagText="Open warrant must be addressed before court date. Client may be re-arrested when appearing on this charge." />
                <TriRow label="Prior felony conviction?" value={s.priorFelony} onChange={set('priorFelony')} />
                <TriRow label="Prior misdemeanor conviction?" value={s.priorMisdemeanor} onChange={set('priorMisdemeanor')} />
              </div>
            </Domain>

            <Domain
              title="Immigration"
              filled={countTri('usCitizen', 'immigrationProceedings')}
            >
              <InfoNote>
                Padilla v. Kentucky requires defense counsel to advise non-citizen clients of deportation risk before any plea. Flag only — no status details recorded.
              </InfoNote>
              <div className="space-y-4">
                <TriRow label="U.S. citizen?" value={s.usCitizen} onChange={set('usCitizen')}
                  flagValue="no" flagSeverity="critical"
                  flagText="Padilla screening required before any plea. Criminal conviction may trigger removal, inadmissibility, or loss of status."
                  flagLink={{ label: 'Immigration guidance', href: '/immigration-guidance' }} />
                <TriRow label="Active immigration proceedings?" value={s.immigrationProceedings} onChange={set('immigrationProceedings')}
                  flagValue="yes" flagSeverity="critical"
                  flagText="Criminal charge may compound immigration consequences. Coordinate with immigration counsel immediately." />
              </div>
            </Domain>

            <Domain
              title="Housing & Detention"
              filled={countTri('currentlyDetained', 'stableHousing', 'housingAtRisk')}
            >
              <div className="space-y-4">
                <TriRow label="Currently detained?" value={s.currentlyDetained} onChange={set('currentlyDetained')}
                  flagValue="yes" flagSeverity="warning"
                  flagText="Bail preparation is the immediate priority. Pretrial detention is the single strongest predictor of case outcome."
                  flagLink={{ label: 'Bail preparation tool', href: '/support/court-logistics/bail-preparation' }} />
                <TriRow label="Stable housing?" value={s.stableHousing} onChange={set('stableHousing')} />
                <TriRow label="Housing at risk due to this case?" value={s.housingAtRisk} onChange={set('housingAtRisk')}
                  flagValue="yes" flagSeverity="warning"
                  flagText="Housing loss is a collateral consequence. Document for bail argument and collateral consequence screen." />
              </div>
            </Domain>

            <Domain
              title="Health & Treatment"
              filled={countTri('mentalHealthHistory', 'mentalHealthTreatment', 'substanceUseHistory', 'substanceUseTreatment', 'medicationsIfDetained')}
            >
              <InfoNote>
                Flag only — no diagnoses or substances recorded. Follow up verbally. Treatment participation strengthens both bail and diversion arguments.
              </InfoNote>
              <div className="space-y-4">
                <TriRow label="Mental health history or diagnosis?" value={s.mentalHealthHistory} onChange={set('mentalHealthHistory')}
                  flagValue="yes" flagSeverity="warning"
                  flagText="Treatment documentation may strengthen bail and diversion arguments. Obtain records with client consent."
                  flagLink={{ label: 'Mental health resources', href: '/support/mental-health' }} />
                <TriRow label="Currently in mental health treatment?" value={s.mentalHealthTreatment} onChange={set('mentalHealthTreatment')} />
                <TriRow label="Substance use history?" value={s.substanceUseHistory} onChange={set('substanceUseHistory')}
                  flagValue="yes" flagSeverity="warning"
                  flagText="Treatment participation may support diversion eligibility. Obtain records with client consent." />
                <TriRow label="Currently in substance use treatment?" value={s.substanceUseTreatment} onChange={set('substanceUseTreatment')} />
                <TriRow label="Medications needed if detained?" value={s.medicationsIfDetained} onChange={set('medicationsIfDetained')}
                  flagValue="yes" flagSeverity="warning"
                  flagText="Notify jail medical staff and supervising attorney immediately." />
              </div>
            </Domain>

            <Domain
              title="Family & Caregiving"
              filled={countTri('primaryCaregiver', 'pregnantPostpartum', 'soleProvider') + countText('numberOfDependents')}
            >
              <div className="space-y-4">
                <TriRow label="Primary caregiver for dependents?" value={s.primaryCaregiver} onChange={set('primaryCaregiver')}
                  flagValue="yes" flagSeverity="warning"
                  flagText="Detention or conviction directly impacts dependents. Document for bail argument and collateral consequence screen." />
                {(s.primaryCaregiver === 'yes' || s.numberOfDependents) && (
                  <div>
                    <FieldLabel hint="optional">Number of dependents</FieldLabel>
                    <TextInput value={s.numberOfDependents} onChange={set('numberOfDependents')} placeholder="e.g. 2 children, ages 4 and 7" />
                  </div>
                )}
                <TriRow label="Pregnant or recently gave birth?" value={s.pregnantPostpartum} onChange={set('pregnantPostpartum')}
                  flagValue="yes" flagSeverity="warning"
                  flagText="Relevant to detention conditions, bail, and diversion eligibility in many jurisdictions. Raise with supervising attorney." />
                <TriRow label="Sole financial provider for household?" value={s.soleProvider} onChange={set('soleProvider')}
                  flagValue="yes" flagSeverity="warning"
                  flagText="Sole provider status strengthens bail argument and is relevant to collateral consequence screen." />
              </div>
            </Domain>

            <Domain
              title="Documents to Obtain"
              filled={countBool('docsId', 'docsAddress', 'docsEmployment', 'docsCharacterRefs', 'docsTreatment', 'docsCommunityTies')}
            >
              <p className="text-xs text-muted-foreground leading-relaxed">Check items needed. These appear in the intake record as a follow-up to-do list.</p>
              <div className="space-y-1">
                <DocCheckbox checked={s.docsId} onChange={set('docsId')} label="Photo ID" />
                <DocCheckbox checked={s.docsAddress} onChange={set('docsAddress')} label="Proof of address" />
                <DocCheckbox checked={s.docsEmployment} onChange={set('docsEmployment')} label="Employment verification" />
                <DocCheckbox checked={s.docsCharacterRefs} onChange={set('docsCharacterRefs')} label="Character references" />
                <DocCheckbox checked={s.docsTreatment} onChange={set('docsTreatment')} label="Treatment documentation (with client consent)" />
                <DocCheckbox checked={s.docsCommunityTies} onChange={set('docsCommunityTies')} label="Proof of community ties" />
              </div>
            </Domain>

          </div>

          <div className="lg:sticky lg:top-6 space-y-4">
            <OutputPanel output={output} flags={flags} />

            <div className="rounded-xl border border-border px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Next steps</p>
              <div className="space-y-1">
                {[
                  { href: '/for-advocates/mitigation-builder', label: 'Build mitigation summary', desc: 'For bail, diversion, and sentencing' },
                  { href: '/support/court-logistics/bail-preparation', label: 'Bail preparation tool', desc: 'If client is detained' },
                  { href: '/diversion-programs', label: 'Diversion programs', desc: '111 programs across all 50 states + DC' },
                  { href: '/immigration-guidance', label: 'Immigration guidance', desc: 'If Padilla flag fired' },
                  { href: '/support/reputation/eligibility', label: 'Expungement screener', desc: 'Post-resolution record relief' },
                ].map(({ href, label, desc }) => (
                  <Link key={href} href={href}>
                    <div className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors group cursor-pointer">
                      <div>
                        <p className="text-xs font-semibold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{label}</p>
                        <p className="text-[11px] text-muted-foreground">{desc}</p>
                      </div>
                      <ArrowLeft className="h-3.5 w-3.5 rotate-180 text-muted-foreground flex-shrink-0" />
                    </div>
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
