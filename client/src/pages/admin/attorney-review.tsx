/**
 * Admin: Attorney Pre-Launch Review Checklist
 *
 * Internal-only page for tracking attorney sign-off on every legally sensitive
 * content area before launch. Not visible to the public. Requires ADMIN_API_KEY.
 *
 * Access: /admin/attorney-review
 * Auth:   Enter your ADMIN_API_KEY when prompted. Stored in sessionStorage.
 * Status: Persisted per-item in localStorage under key `atty-review-v1`.
 */

import { useState, useEffect } from "react";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

// Prevent search engines from indexing this internal admin tool.
function useAdminNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);
}

// ── Data ──────────────────────────────────────────────────────────────────────

type RiskLevel = "high" | "medium";
type ReviewStatus = "pending" | "in-review" | "cleared";

interface ChecklistItem {
  id: string;
  risk: RiskLevel;
  title: string;
  description: string;
  sourceFiles: { label: string; path: string; note?: string }[];
  legalQuestion: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // ── HIGH RISK ──────────────────────────────────────────────────────────────
  {
    id: "H-1",
    risk: "high",
    title: 'Core "Not Legal Advice" Disclaimer',
    description:
      "The site's primary liability shield. Disclaims attorney-client relationship formation, legal privilege, and distinguishes information from advice. Appears on multiple pages.",
    sourceFiles: [
      { label: "en.ts:2592–2597", path: "client/src/locales/en.ts", note: "Main rights-info disclaimer" },
      { label: "en.ts:2018–2019", path: "client/src/locales/en.ts", note: "Case guidance consent header" },
      { label: "en.ts:2456", path: "client/src/locales/en.ts", note: "Privacy page footer disclaimer" },
      { label: "en.ts:5355", path: "client/src/locales/en.ts", note: "First 24 Hours guide disclaimer" },
      { label: "en.ts:6491", path: "client/src/locales/en.ts", note: "Record clearance screener disclaimer" },
      { label: "disclaimers.tsx:499", path: "client/src/pages/disclaimers.tsx", note: "Site disclaimers page" },
    ],
    legalQuestion:
      "Do the disclaimer statements in each location adequately disclaim attorney-client relationship formation, disclaim legal privilege, and convey that the site provides information rather than advice? Are there jurisdictions where this language would be legally insufficient?",
  },
  {
    id: "H-2",
    risk: "high",
    title: "AI Guidance Disclosure & Anthropic Data Retention Notice",
    description:
      "Users are told their inputs are processed by Anthropic and retained up to 30 days. This disclosure must be accurate and appear at a point where users can meaningfully choose not to proceed.",
    sourceFiles: [
      { label: "en.ts:2026", path: "client/src/locales/en.ts", note: "AI guidance card retention disclosure" },
      { label: "en.ts:4949–4950", path: "client/src/locales/en.ts", note: "Chat privilege warning" },
      { label: "en.ts:5238–5239", path: "client/src/locales/en.ts", note: "notLegalAdvice keys" },
      { label: "claude-guidance.ts", path: "server/services/claude-guidance.ts", note: "AI context builder" },
      { label: "ai-model.ts", path: "server/config/ai-model.ts", note: "Model config (Claude Sonnet 4.6)" },
    ],
    legalQuestion:
      "Is the Anthropic 30-day data retention disclosure accurate per Anthropic's current API terms? Is it displayed before users share sensitive information? Is the attorney-client privilege language clear enough for a layperson to understand they should not share privileged information?",
  },
  {
    id: "H-3",
    risk: "high",
    title: "AI Guidance Output Quality (Sample Review)",
    description:
      "The AI generates jurisdiction-specific guidance about charges, rights, deadlines, and next steps. Inaccurate guidance could cause users to miss deadlines, waive rights, or take harmful action. Attorney should generate and review sample outputs.",
    sourceFiles: [
      { label: "claude-guidance.ts", path: "server/services/claude-guidance.ts", note: "Guidance prompt and context builder" },
      { label: "case-guidance.tsx", path: "client/src/pages/case-guidance.tsx", note: "Guidance flow UI" },
    ],
    legalQuestion:
      "Generate sample guidance at /case-guidance for: (1) CA felony DUI pre-arraignment, (2) NY drug possession felony arraignment, (3) TX assault plea stage, (4) FL grand theft sentencing, (5) IL domestic battery post-conviction, (6) any state non-citizen with felony. Do outputs contain accurate legal information? Do they stay in bounds of general information vs. advice? Do they flag attorney consultation appropriately?",
  },
  {
    id: "H-4",
    risk: "high",
    title: "Document Templates — Criminal Motions (AI-Generated Sections)",
    description:
      "38 templates have AI-generated argument sections used by licensed attorneys to generate court filings. Errors could result in ineffective motions or professional responsibility issues.",
    sourceFiles: [
      { label: "motion-to-suppress.ts", path: "shared/templates/motion-to-suppress.ts" },
      { label: "motion-for-discovery.ts", path: "shared/templates/motion-for-discovery.ts" },
      { label: "sentencing-memorandum.ts", path: "shared/templates/sentencing-memorandum.ts" },
      { label: "habeas-corpus-petition.ts", path: "shared/templates/habeas-corpus-petition.ts" },
      { label: "motion-to-dismiss.ts", path: "shared/templates/motion-to-dismiss.ts" },
      { label: "motion-to-withdraw-plea.ts", path: "shared/templates/motion-to-withdraw-plea.ts" },
      { label: "attorney/index.tsx:135", path: "client/src/pages/attorney/index.tsx", note: "Attorney tools disclaimer" },
      { label: "attorney-context.tsx", path: "client/src/contexts/attorney-context.tsx", note: "Bar attestation state" },
    ],
    legalQuestion:
      "Review AI-generated argument sections in motion-to-suppress, motion-for-discovery, sentencing-memorandum, habeas-corpus-petition, and motion-to-dismiss. Are argument sections legally sound? Does the bar membership attestation adequately gate these from lay users? Are there sections containing jurisdiction-specific assertions that could be incorrect?",
  },
  {
    id: "H-5",
    risk: "high",
    title: "Document Templates — Immigration (EOIR Format)",
    description:
      "14 templates for EOIR immigration court filings. These must comply with current BIA Practice Manual requirements. Errors could directly affect immigration outcomes.",
    sourceFiles: [
      { label: "bond-motion-eoir.ts", path: "shared/templates/bond-motion-eoir.ts" },
      { label: "motion-for-withholding-removal-cat.ts", path: "shared/templates/motion-for-withholding-removal-cat.ts" },
      { label: "notice-of-appeal-bia.ts", path: "shared/templates/notice-of-appeal-bia.ts" },
      { label: "motion-to-reopen-eoir.ts", path: "shared/templates/motion-to-reopen-eoir.ts" },
      { label: "nta-pleadings.ts", path: "shared/templates/nta-pleadings.ts" },
      { label: "motion-for-stay-of-removal-eoir.ts", path: "shared/templates/motion-for-stay-of-removal-eoir.ts" },
      { label: "immigration-court-data.ts", path: "shared/templates/immigration-court-data.ts", note: "Legal standard references" },
    ],
    legalQuestion:
      "Do the EOIR-format templates comply with current BIA Practice Manual requirements (2024–2025)? Are legal standards cited in argument sections accurate for current Ninth/Fifth/Second Circuit precedent? Is the withholding-of-removal/CAT template legally sound under current DHS v. Thuraissigiam and related case law?",
  },
  {
    id: "H-6",
    risk: "high",
    title: "Know Your Rights — ICE Encounters",
    description:
      "Tells users what they are legally permitted to do during ICE encounters. Inaccurate information could lead users to waive rights or take action that worsens their legal situation.",
    sourceFiles: [
      { label: "know-your-rights.tsx:341", path: "client/src/pages/immigration/know-your-rights.tsx", note: "NILC source attribution" },
      { label: "know-your-rights.tsx (full)", path: "client/src/pages/immigration/know-your-rights.tsx" },
      { label: "raids-toolkit.tsx", path: "client/src/pages/immigration/raids-toolkit.tsx" },
      { label: "workplace-raids.tsx", path: "client/src/pages/immigration/workplace-raids.tsx" },
      { label: "en.ts:2600–2870", path: "client/src/locales/en.ts", note: "All immigration locale keys" },
    ],
    legalQuestion:
      "Is the ICE encounter guidance accurate under current Fourth and Fifth Amendment precedent? Does the platform correctly describe judicial warrant vs. administrative warrant? Is the NILC December 2025 source current? Does the raids-toolkit/workplace-raids content stay within rights education rather than legal strategy?",
  },
  {
    id: "H-7",
    risk: "high",
    title: "Immigration Pages — DACA/TPS, Bond Hearings, Family Planning",
    description:
      "Pages describing immigration law eligibility requirements, procedural rights, and post-deportation options. Immigration law changes frequently and outdated content can cause users to miss deadlines.",
    sourceFiles: [
      { label: "daca-tps.tsx", path: "client/src/pages/immigration/daca-tps.tsx" },
      { label: "bond-hearings.tsx", path: "client/src/pages/immigration/bond-hearings.tsx" },
      { label: "family-planning.tsx", path: "client/src/pages/immigration/family-planning.tsx" },
      { label: "after-deportation.tsx", path: "client/src/pages/immigration/after-deportation.tsx" },
      { label: "en.ts:2877", path: "client/src/locales/en.ts", note: 'DACA disclaimer: "Immigration law changes frequently"' },
    ],
    legalQuestion:
      "Are DACA eligibility requirements (birth after June 15, 1981; U.S. presence since June 15, 2007) current? Are bond hearing procedures consistent with INA § 236(a) and current BIA precedent? Does family planning content stay in general preparation vs. legal strategy? Is after-deportation content accurate on re-entry bars?",
  },
  {
    id: "H-8",
    risk: "high",
    title: "Site Disclaimers Page",
    description:
      "The /disclaimers page is the site's comprehensive liability disclosure, referenced from multiple pages. It is the authoritative statement of what the platform does and does not provide.",
    sourceFiles: [
      { label: "disclaimers.tsx", path: "client/src/pages/disclaimers.tsx", note: "Full disclaimers page (~500 lines)" },
    ],
    legalQuestion:
      'Does the disclaimers page adequately cover the platform\'s liability exposure? Are there content areas not addressed that should be? Is the "Acknowledgement of Disclosures" closing language legally effective as constructive notice to users who use the site?',
  },
  {
    id: "H-9",
    risk: "high",
    title: "Attorney Portal Bar Attestation & Disclaimer",
    description:
      "The Attorney Portal gates document generation behind a bar membership attestation. If inadequate, lay users could access and rely on attorney-only tools without the expertise to use them safely.",
    sourceFiles: [
      { label: "attorney/index.tsx:135", path: "client/src/pages/attorney/index.tsx", note: "Attorney tools disclaimer" },
      { label: "attorney-context.tsx", path: "client/src/contexts/attorney-context.tsx", note: "Bar attestation state management" },
      { label: "en.ts:5252", path: "client/src/locales/en.ts", note: "attorney.disclaimer locale key" },
    ],
    legalQuestion:
      "Is the bar membership attestation legally adequate to restrict attorney-only document generation? Does the attestation language create attorney responsibility for use of AI-generated document sections? Is there an unauthorized practice of law concern if the attestation gate is bypassed?",
  },

  // ── MEDIUM RISK ────────────────────────────────────────────────────────────
  {
    id: "M-1",
    risk: "medium",
    title: "Collateral Consequences Data — All Nine Categories",
    description:
      "The screener presents risk assessments across nine life areas. Seven question-driven categories (supervision, immigration, children, housing, employment, benefits, professional license) are answered via yes/no questions. Two charge-type-driven categories are surfaced automatically based on the charge selection: driver's license suspension (DUI / drug possession / drug trafficking) and sex offender registry (sex offense charges). Inaccurate or overstated risk information causes unnecessary alarm; understated risk causes users to miss important consequences.",
    sourceFiles: [
      { label: "collateral-consequences.tsx (lines ~59–109)", path: "client/src/pages/collateral-consequences.tsx", note: "Question-driven risk data (RISKS array)" },
      { label: "collateral-consequences.tsx (lines ~140–155)", path: "client/src/pages/collateral-consequences.tsx", note: "Charge-type-driven risk data (CHARGE_TYPE_RISKS array)" },
      { label: "collateral-consequences.tsx (lines ~157–207)", path: "client/src/pages/collateral-consequences.tsx", note: "Charge-type pre-step and risk filtering logic" },
    ],
    legalQuestion:
      'Are the risk level assignments (critical/warning) for each of the nine consequence categories appropriate? Is flagging immigration as "critical" for all non-citizens regardless of charge type correct? Are all nine consequence descriptions legally accurate as general educational statements? For the two charge-type-driven categories: is driver\'s license suspension correctly limited to DUI, drug possession, and drug trafficking charges? Is the sex offender registry risk correctly limited to sex offense charges? Does the screener appropriately disclaim that it provides a preliminary risk flag only, not a legal determination?',
  },
  {
    id: "M-2",
    risk: "medium",
    title: "Charge Citations Flagged needs_review (548 entries)",
    description:
      "548 entries in shared/criminal-charge-citations.ts carry confidence: 'needs_review' because OpenLaws API returned not_found. They are not shown to users but inform AI guidance context. Top states: ME(23), HI(23), OK(22), DC(21), ID(20), VT(19), OR(19), UT(18).",
    sourceFiles: [
      { label: "criminal-charge-citations.ts", path: "shared/criminal-charge-citations.ts", note: "Filter for confidence: 'needs_review' — 548 entries" },
    ],
    legalQuestion:
      "For a representative sample — all DC entries (21), all DE entries (15), 10 random entries from ME/HI/OK — are the statute citations correct? Should any be corrected before AI guidance uses them as context? Use /admin/citation-review for interactive verification against official state legislature sites.",
  },
  {
    id: "M-3",
    risk: "medium",
    title: "Record Clearance Screener",
    description:
      "The screener at /support/reputation/eligibility gives users a preliminary indication of whether their record may be eligible for expungement or sealing. Incorrect signals could cause users to pursue wrong remedies or give up on legitimate ones.",
    sourceFiles: [
      { label: "record-clearance-screener.tsx", path: "client/src/pages/support/record-clearance-screener.tsx" },
      { label: "en.ts:6427", path: "client/src/locales/en.ts", note: "Screener subtitle" },
      { label: "en.ts:6491", path: "client/src/locales/en.ts", note: "Screener disclaimer" },
    ],
    legalQuestion:
      "Are the eligibility logic pathways consistent with general expungement/record sealing rules in the most common states? Does the screener appropriately disclaim that results are preliminary? Is the disclaimer at en.ts:6491 sufficient to prevent users from relying on it as a definitive eligibility determination?",
  },
  {
    id: "M-4",
    risk: "medium",
    title: "Diversion Programs Directory",
    description:
      "Lists 111 diversion programs with self-reported eligibility criteria across all 50 states + DC + Federal. Users may rely on this when deciding whether to request a diversion program.",
    sourceFiles: [
      { label: "diversion-programs.ts", path: "server/data/diversion-programs.ts", note: "Program data (111 entries)" },
      { label: "diversion-programs.tsx", path: "client/src/pages/diversion-programs.tsx" },
      { label: "en.ts:4011", path: "client/src/locales/en.ts", note: "Directory disclaimer" },
    ],
    legalQuestion:
      "Is the disclaimer at en.ts:4011 adequate for a self-reported eligibility directory? Are there eligibility criteria that appear legally incorrect? Should the directory more prominently state that diversion participation typically requires prosecutorial agreement?",
  },
  {
    id: "M-5",
    risk: "medium",
    title: "Public Defender Intake Checklist — Padilla Flag",
    description:
      "Used by public defenders. The Padilla immigration flag (auto-raised for non-citizen clients) is a specific constitutional obligation under Padilla v. Kentucky. If it fires incorrectly, defenders could miss or over-trigger a required inquiry.",
    sourceFiles: [
      { label: "intake-checklist.tsx", path: "client/src/pages/for-advocates/intake-checklist.tsx" },
      { label: "en.ts:6738", path: "client/src/locales/en.ts", note: "Checklist disclaimer" },
    ],
    legalQuestion:
      "Does the Padilla flag trigger correctly for non-citizen status (not just immigration-related charges)? Does the flag description accurately convey that Padilla v. Kentucky requires counsel to advise non-citizen clients of deportation consequences of guilty pleas? Is the tool's disclaimer adequate for use by licensed attorneys?",
  },
  {
    id: "M-6",
    risk: "medium",
    title: "Privacy Policy",
    description:
      "Describes how user data is handled. Inaccuracies — particularly around data ephemerality or Anthropic retention — could create FTC or state consumer protection exposure.",
    sourceFiles: [
      { label: "privacy-policy.tsx", path: "client/src/pages/privacy-policy.tsx" },
    ],
    legalQuestion:
      "Does the policy accurately describe the data lifecycle: session storage, 24-hour server-side TTL, Anthropic 30-day AI processing retention? Are there claims inconsistent with the actual technical implementation? Does it comply with CCPA for California users and applicable state privacy laws?",
  },
];

// ── Persistence ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "atty-review-v1";

interface ItemState {
  status: ReviewStatus;
  reviewedBy: string;
  reviewedDate: string;
  notes: string;
}

type StoredState = Record<string, ItemState>;

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable
  }
}

function defaultItemState(): ItemState {
  return { status: "pending", reviewedBy: "", reviewedDate: "", notes: "" };
}

// ── Sub-components ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ReviewStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  pending:   { label: "Pending",   color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",  dot: "bg-red-500"    },
  "in-review": { label: "In Review", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-500" },
  cleared:   { label: "Cleared",   color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200", dot: "bg-green-500"  },
};

const NEXT_STATUS: Record<ReviewStatus, ReviewStatus> = {
  pending: "in-review",
  "in-review": "cleared",
  cleared: "pending",
};

function StatusBadge({ status }: { status: ReviewStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function ReviewCard({
  item,
  state,
  onChange,
}: {
  item: ChecklistItem;
  state: ItemState;
  onChange: (next: ItemState) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[state.status];

  function cycleStatus() {
    const next = NEXT_STATUS[state.status];
    onChange({
      ...state,
      status: next,
      reviewedDate: next === "cleared" ? new Date().toISOString().slice(0, 10) : state.reviewedDate,
    });
  }

  return (
    <div className={`rounded-lg border-2 ${cfg.border} ${cfg.bg} overflow-hidden transition-all`}>
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className={`shrink-0 text-xs font-bold font-mono px-2 py-0.5 rounded ${
          item.risk === "high" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
        }`}>
          {item.id}
        </span>
        <span className="font-semibold text-sm flex-1 text-gray-900">{item.title}</span>
        <StatusBadge status={state.status} />
        <button
          onClick={() => setExpanded(e => !e)}
          className="shrink-0 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-white/60 transition-colors"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? "▲ Hide" : "▼ Details"}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-current/10 px-4 py-4 space-y-4 bg-white/40">
          {/* Description */}
          <p className="text-sm text-gray-700">{item.description}</p>

          {/* Source files */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Source Files</p>
            <ul className="space-y-1">
              {item.sourceFiles.map((f, i) => (
                <li key={i} className="flex items-baseline gap-2 text-xs">
                  <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded font-mono text-[11px]">{f.label}</code>
                  {f.note && <span className="text-gray-500">— {f.note}</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal question */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Legal Question</p>
            <p className="text-sm text-gray-800 bg-white/70 rounded p-3 border border-gray-200 italic">{item.legalQuestion}</p>
          </div>

          {/* Status controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Reviewed by (initials)</label>
              <input
                type="text"
                value={state.reviewedBy}
                onChange={e => onChange({ ...state, reviewedBy: e.target.value })}
                placeholder="e.g. J.D.S."
                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Date cleared</label>
              <input
                type="date"
                value={state.reviewedDate}
                onChange={e => onChange({ ...state, reviewedDate: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={cycleStatus}
                className={`w-full text-sm font-semibold py-1.5 px-3 rounded border-2 transition-colors ${
                  state.status === "pending"
                    ? "border-yellow-400 bg-yellow-50 text-yellow-800 hover:bg-yellow-100"
                    : state.status === "in-review"
                    ? "border-green-400 bg-green-50 text-green-800 hover:bg-green-100"
                    : "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                {state.status === "pending" && "→ Mark In Review"}
                {state.status === "in-review" && "✓ Mark Cleared"}
                {state.status === "cleared" && "↺ Reset to Pending"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Attorney notes</label>
            <textarea
              value={state.notes}
              onChange={e => onChange({ ...state, notes: e.target.value })}
              placeholder="Observations, required changes, follow-up items…"
              rows={3}
              className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

/**
 * Verify an admin key against the server by calling a protected endpoint.
 * Uses the same x-admin-api-key header pattern as /admin/citation-review.
 * Returns true if the server responds 200, false on 401/403/network error.
 */
async function verifyAdminKey(key: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/verify-key", {
      method: "GET",
      headers: { "x-admin-api-key": key },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Auth gate ─────────────────────────────────────────────────────────────────

function AdminAuthGate({ onAuth }: { onAuth: (key: string) => void }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    setChecking(true);
    const valid = await verifyAdminKey(key);
    setChecking(false);
    if (valid) {
      sessionStorage.setItem("adminKey", key);
      onAuth(key);
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Attorney Review — Admin Access</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your admin key to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={e => { setKey(e.target.value); setError(false); }}
            placeholder="Admin API key (ADMIN_TOKEN)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            autoFocus
          />
          {error && (
            <p className="text-xs text-red-600">Invalid key. Check your ADMIN_TOKEN environment variable.</p>
          )}
          <button
            type="submit"
            disabled={!key || checking}
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {checking ? "Verifying…" : "Access Checklist"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminAttorneyReview() {
  useScrollToTop();
  useAdminNoIndex();

  // "checking" = on mount, re-verifying stored key server-side before showing content.
  // Never trust sessionStorage alone — always confirm with /api/admin/verify-key first.
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [itemStates, setItemStates] = useState<StoredState>({});

  useEffect(() => {
    setItemStates(loadState());
    const stored = sessionStorage.getItem("adminKey");
    if (!stored) {
      // No key stored — go straight to login form
      setChecking(false);
      return;
    }
    // Re-verify the stored key against the server on every mount.
    // A stale or forged sessionStorage value is rejected here.
    verifyAdminKey(stored).then(valid => {
      if (valid) {
        setAuthed(true);
      } else {
        // Key is invalid or expired — clear it and show the login form
        sessionStorage.removeItem("adminKey");
      }
      setChecking(false);
    });
  }, []);

  function updateItem(id: string, next: ItemState) {
    const updated = { ...itemStates, [id]: next };
    setItemStates(updated);
    saveState(updated);
  }

  function getState(id: string): ItemState {
    return itemStates[id] ?? defaultItemState();
  }

  // While verifying stored key against server, show a neutral loading screen.
  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Verifying access…</p>
      </div>
    );
  }

  if (!authed) {
    return <AdminAuthGate onAuth={(_key: string) => setAuthed(true)} />;
  }

  const highItems = CHECKLIST_ITEMS.filter(i => i.risk === "high");
  const medItems  = CHECKLIST_ITEMS.filter(i => i.risk === "medium");

  const cleared = CHECKLIST_ITEMS.filter(i => getState(i.id).status === "cleared").length;
  const inReview = CHECKLIST_ITEMS.filter(i => getState(i.id).status === "in-review").length;
  const total = CHECKLIST_ITEMS.length;
  const highCleared = highItems.filter(i => getState(i.id).status === "cleared").length;
  const allHighCleared = highCleared === highItems.length;

  function handlePrint() {
    window.print();
  }

  function handleReset() {
    if (confirm("Reset ALL item statuses to pending? This cannot be undone.")) {
      setItemStates({});
      saveState({});
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 print:static">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">ADMIN</span>
              <h1 className="text-base font-bold text-gray-900">Attorney Pre-Launch Review</h1>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Source of truth: <code className="bg-gray-100 px-1 rounded">docs/attorney-review-checklist.md</code>
              {" · "}Status persisted in <code className="bg-gray-100 px-1 rounded">localStorage</code>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            >
              Print / Export
            </button>
            <button
              onClick={handleReset}
              className="text-xs px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={() => { sessionStorage.removeItem("adminKey"); setAuthed(false); }}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-8">

        {/* Launch readiness bar */}
        <div className={`rounded-xl border-2 p-5 ${allHighCleared ? "border-green-300 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-gray-900">
                {allHighCleared ? "✅ HIGH-Risk Items Cleared — Ready for Launch Gate" : "🔴 Launch Blocked — HIGH-Risk Items Pending"}
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">All 9 HIGH-risk items must be cleared before the site goes public.</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-3xl font-bold text-gray-900">{cleared}</span>
              <span className="text-lg text-gray-400">/{total}</span>
              <p className="text-xs text-gray-500">items cleared</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(cleared / total) * 100}%` }}
            />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Cleared", value: cleared, color: "text-green-700", bg: "bg-green-100" },
              { label: "In Review", value: inReview, color: "text-yellow-700", bg: "bg-yellow-100" },
              { label: "Pending", value: total - cleared - inReview, color: "text-red-700", bg: "bg-red-100" },
            ].map(s => (
              <div key={s.label} className={`rounded-lg py-2 px-3 ${s.bg}`}>
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HIGH risk section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              High Risk — {highCleared}/{highItems.length} Cleared
            </h2>
          </div>
          <div className="space-y-3">
            {highItems.map(item => (
              <ReviewCard
                key={item.id}
                item={item}
                state={getState(item.id)}
                onChange={next => updateItem(item.id, next)}
              />
            ))}
          </div>
        </section>

        {/* MEDIUM risk section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              Medium Risk — {medItems.filter(i => getState(i.id).status === "cleared").length}/{medItems.length} Cleared
            </h2>
          </div>
          <div className="space-y-3">
            {medItems.map(item => (
              <ReviewCard
                key={item.id}
                item={item}
                state={getState(item.id)}
                onChange={next => updateItem(item.id, next)}
              />
            ))}
          </div>
        </section>

        {/* Footer note */}
        <p className="text-xs text-gray-400 text-center pb-4">
          Status is stored locally in this browser only. To share progress with the team, use the print/export button above to generate a PDF.
          Full checklist with file line ranges: <code>docs/attorney-review-checklist.md</code>
        </p>
      </div>
    </div>
  );
}
