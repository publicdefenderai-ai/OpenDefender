/**
 * Admin: Texas Source Review Dashboard
 *
 * Internal-only review screen for the Texas authority source snapshots.
 * Not visible in public navigation. The API remains the source of truth and
 * requires the same admin key used by the other admin pages.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, ExternalLink, FileCheck2, History, Loader2, RefreshCw, ShieldAlert, X } from "lucide-react";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

type SnapshotStatus = "current" | "superseded";

interface Predecessor {
  id: string;
  contentHash: string;
  hashBasis: string;
  citation: string;
  section: string;
  officialTitle: string;
  sourceUrl: string;
  retrievedAt: string | null;
  manifestImportedAt: string;
  effectiveDateStart: string | null;
  effectiveDateEnd: string | null;
  status: SnapshotStatus;
}

interface PendingSnapshot {
  id: string;
  sourceKey: string;
  jurisdiction: string;
  publisher: string;
  citation: string;
  section: string;
  officialTitle: string;
  sourceUrl: string;
  contentHash: string;
  hashBasis: string;
  retrievedAt: string | null;
  manifestImportedAt: string;
  effectiveDateStart: string | null;
  effectiveDateEnd: string | null;
  supersedesSnapshotId: string | null;
  metadata: unknown;
  predecessor: Predecessor | null;
}

interface ReviewDecision {
  id: string;
  snapshotId: string;
  jurisdiction: string;
  decision: "approve" | "reject";
  reviewer: string;
  note: string;
  snapshotHash: string;
  previousSnapshotId: string | null;
  decidedAt: string;
}

interface ReviewResult {
  decision: "approve" | "reject";
  affectedChargeIds: string[];
  restoredLinkCount: number;
  auditId: string;
}

function useAdminNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
}

function shortHash(value: string) {
  return value.length > 22 ? `${value.slice(0, 12)}…${value.slice(-8)}` : value;
}

function AuthGate({
  keyInput,
  setKeyInput,
  onSubmit,
  error,
  checking,
}: {
  keyInput: string;
  setKeyInput: (value: string) => void;
  onSubmit: () => void;
  error: string;
  checking: boolean;
}) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-amber-400/15 p-3 text-amber-300">
            <ShieldAlert aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Admin only</p>
            <h1 className="text-xl font-bold">Texas source review</h1>
          </div>
        </div>
        <p className="mb-6 text-sm leading-6 text-slate-300">
          Enter the administrative key to review Texas source snapshots. This page is not part of the public site.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium text-slate-200" htmlFor="texas-admin-key">
            Administrative key
          </label>
          <input
            id="texas-admin-key"
            data-testid="texas-admin-key"
            type="password"
            autoComplete="current-password"
            value={keyInput}
            onChange={(event) => setKeyInput(event.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none ring-amber-300 focus:ring-2"
          />
          {error && <p className="text-sm text-red-300" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={checking}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checking && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Continue
          </button>
        </form>
      </div>
    </main>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-slate-200 py-3 last:border-0 sm:grid-cols-[9rem_1fr] sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="min-w-0 text-sm text-slate-800">{children}</dd>
    </div>
  );
}

function SnapshotCard({
  snapshot,
  reviewer,
  note,
  busy,
  onNoteChange,
  onReview,
}: {
  snapshot: PendingSnapshot;
  reviewer: string;
  note: string;
  busy: boolean;
  onNoteChange: (value: string) => void;
  onReview: (decision: "approve" | "reject") => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const canApprove = Boolean(snapshot.predecessor);

  return (
    <article className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm" data-testid={`pending-snapshot-${snapshot.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-amber-100 bg-amber-50/70 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">Pending review</span>
            <span className="font-mono text-xs text-slate-500">{snapshot.sourceKey}</span>
          </div>
          <h2 className="text-lg font-bold leading-snug text-slate-950">{snapshot.officialTitle}</h2>
          <p className="mt-1 font-mono text-sm font-semibold text-slate-700">{snapshot.citation}</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          aria-expanded={expanded}
        >
          {expanded ? "Hide details" : "Show details"}
          {expanded ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      {expanded && (
        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h3 className="mb-2 text-sm font-bold text-slate-950">Pending snapshot</h3>
            <dl className="rounded-xl border border-slate-200 bg-slate-50 px-4">
              <DetailRow label="Content hash">
                <code className="block break-all rounded bg-slate-200/70 px-2 py-1 font-mono text-xs" title={snapshot.contentHash}>
                  {snapshot.contentHash}
                </code>
              </DetailRow>
              <DetailRow label="Hash basis">{snapshot.hashBasis.replaceAll("_", " ")}</DetailRow>
              <DetailRow label="Official source">
                <a
                  href={snapshot.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex max-w-full items-center gap-1 break-all font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900"
                >
                  {snapshot.sourceUrl}
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>
              </DetailRow>
              <DetailRow label="Publisher">{snapshot.publisher}</DetailRow>
              <DetailRow label="Section">{snapshot.section}</DetailRow>
              <DetailRow label="Imported">{formatDate(snapshot.manifestImportedAt)}</DetailRow>
              <DetailRow label="Retrieved">{formatDate(snapshot.retrievedAt)}</DetailRow>
              {(snapshot.effectiveDateStart || snapshot.effectiveDateEnd) && (
                <DetailRow label="Effective dates">
                  {snapshot.effectiveDateStart ?? "Open"} to {snapshot.effectiveDateEnd ?? "Open"}
                </DetailRow>
              )}
            </dl>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-bold text-slate-950">Predecessor</h3>
            {snapshot.predecessor ? (
              <dl className="rounded-xl border border-slate-200 bg-slate-50 px-4">
                <DetailRow label="Status">
                  <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                    {snapshot.predecessor.status}
                  </span>
                </DetailRow>
                <DetailRow label="Hash">
                  <code className="font-mono text-xs" title={snapshot.predecessor.contentHash}>{shortHash(snapshot.predecessor.contentHash)}</code>
                </DetailRow>
                <DetailRow label="Title">{snapshot.predecessor.officialTitle}</DetailRow>
                <DetailRow label="Citation">{snapshot.predecessor.citation}</DetailRow>
                <DetailRow label="Source">
                  <a
                    href={snapshot.predecessor.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-700 underline underline-offset-2 hover:text-blue-900"
                  >
                    Open predecessor
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </DetailRow>
                <DetailRow label="Snapshot date">{formatDate(snapshot.predecessor.manifestImportedAt)}</DetailRow>
                <DetailRow label="Snapshot ID">
                  <code className="break-all font-mono text-xs text-slate-600">{snapshot.predecessor.id}</code>
                </DetailRow>
              </dl>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
                No current predecessor is attached. Approval is unavailable until the source has a current predecessor.
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 pt-5 lg:col-span-2">
            <label htmlFor={`review-note-${snapshot.id}`} className="mb-2 block text-sm font-bold text-slate-950">
              Review note <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <textarea
              id={`review-note-${snapshot.id}`}
              data-testid={`review-note-${snapshot.id}`}
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              maxLength={10000}
              rows={3}
              placeholder="Explain the source comparison or why the snapshot should be rejected…"
              className="w-full resize-y rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-300 placeholder:text-slate-400 focus:ring-2"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Reviewing as <strong className="text-slate-700">{reviewer || "not set"}</strong>. Decisions are recorded in the audit history.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onReview("reject")}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3.5 py-2 text-sm font-bold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <X className="h-4 w-4" aria-hidden="true" />}
                  Reject
                </button>
                <button
                  type="button"
                  disabled={busy || !canApprove}
                  onClick={() => onReview("approve")}
                  title={!canApprove ? "A current predecessor is required before approval" : undefined}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default function TexasSourceReview() {
  useScrollToTop();
  useAdminNoIndex();

  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState("");
  const [pending, setPending] = useState<PendingSnapshot[]>([]);
  const [decisions, setDecisions] = useState<ReviewDecision[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busySnapshotId, setBusySnapshotId] = useState<string | null>(null);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [resultMessage, setResultMessage] = useState("");

  const apiFetch = useCallback(async (url: string, options?: RequestInit) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        "x-admin-api-key": adminKey,
      },
    });
    if (response.status === 401) {
      sessionStorage.removeItem("adminKey");
      setAdminKey("");
      setAuthError("Your administrative key is no longer valid.");
    }
    return response;
  }, [adminKey]);

  const verifyKey = useCallback(async (key: string) => {
    if (!key.trim()) return false;
    const response = await fetch("/api/admin/verify-key", {
      headers: { "x-admin-api-key": key.trim() },
    });
    return response.ok;
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!adminKey) return;
    setLoading(true);
    setLoadError("");
    try {
      const [pendingResponse, decisionsResponse] = await Promise.all([
        apiFetch("/api/statutes/sources/texas/pending-review"),
        apiFetch("/api/statutes/sources/texas/review-decisions"),
      ]);
      const [pendingData, decisionsData] = await Promise.all([
        pendingResponse.json(),
        decisionsResponse.json(),
      ]);
      if (!pendingResponse.ok || !pendingData.success) {
        throw new Error(pendingData.error || "Unable to load pending snapshots.");
      }
      if (!decisionsResponse.ok || !decisionsData.success) {
        throw new Error(decisionsData.error || "Unable to load review history.");
      }
      setPending(pendingData.snapshots);
      setDecisions(decisionsData.decisions);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load Texas source review data.");
    } finally {
      setLoading(false);
    }
  }, [adminKey, apiFetch]);

  useEffect(() => {
    const stored = sessionStorage.getItem("adminKey");
    if (!stored) {
      setAuthChecking(false);
      return;
    }
    verifyKey(stored).then((valid) => {
      if (valid) {
        setAdminKey(stored);
      } else {
        sessionStorage.removeItem("adminKey");
        setAuthError("Enter a valid administrative key.");
      }
      setAuthChecking(false);
    }).catch(() => {
      setAuthError("Could not verify the administrative key.");
      setAuthChecking(false);
    });
  }, [verifyKey]);

  useEffect(() => {
    if (adminKey) void loadDashboard();
  }, [adminKey, loadDashboard]);

  const recentDecisions = useMemo(() => decisions.slice(0, 50), [decisions]);

  async function handleLogin() {
    const key = keyInput.trim();
    if (!key) {
      setAuthError("Enter your administrative key.");
      return;
    }
    setAuthChecking(true);
    setAuthError("");
    try {
      if (!(await verifyKey(key))) {
        setAuthError("Enter a valid administrative key.");
        return;
      }
      sessionStorage.setItem("adminKey", key);
      setAdminKey(key);
      setKeyInput("");
    } catch {
      setAuthError("Could not verify the administrative key.");
    } finally {
      setAuthChecking(false);
    }
  }

  async function handleReview(snapshot: PendingSnapshot, decision: "approve" | "reject") {
    if (!reviewer.trim()) {
      setResultMessage("Enter your reviewer name before recording a decision.");
      return;
    }
    if (decision === "approve" && !snapshot.predecessor) return;
    const confirmation = decision === "approve"
      ? `Approve the Texas snapshot for ${snapshot.citation}? This will make it current and update its linked charges.`
      : `Reject the Texas snapshot for ${snapshot.citation}? The current predecessor will be retained.`;
    if (!window.confirm(confirmation)) return;

    setBusySnapshotId(snapshot.id);
    setResult(null);
    setResultMessage("");
    try {
      const response = await apiFetch(`/api/statutes/sources/texas/review/${encodeURIComponent(snapshot.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          reviewer: reviewer.trim(),
          note: notes[snapshot.id]?.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "The review decision could not be saved.");
      }
      setResult(data as ReviewResult);
      setResultMessage(decision === "approve" ? "Snapshot approved and promoted." : "Snapshot rejected; predecessor retained.");
      setNotes((current) => {
        const next = { ...current };
        delete next[snapshot.id];
        return next;
      });
      await loadDashboard();
    } catch (error) {
      setResultMessage(error instanceof Error ? error.message : "The review decision could not be saved.");
    } finally {
      setBusySnapshotId(null);
    }
  }

  if (authChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <Loader2 className="h-8 w-8 animate-spin text-amber-300" aria-label="Checking administrative access" />
      </main>
    );
  }
  if (!adminKey) {
    return (
      <AuthGate
        keyInput={keyInput}
        setKeyInput={setKeyInput}
        onSubmit={() => void handleLogin()}
        error={authError}
        checking={authChecking}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 pb-16 text-slate-900">
      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-950">Admin</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Texas authority</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Source review dashboard</h1>
            <p className="mt-1 text-sm text-slate-300">Compare pending TCSS snapshots before they become current.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadDashboard()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("adminKey");
                setAdminKey("");
              }}
              className="rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending snapshots</p>
            <p className="mt-2 text-3xl font-black text-amber-700">{pending.length}</p>
            <p className="mt-1 text-sm text-slate-600">Require a reviewer decision before promotion.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent decisions</p>
            <p className="mt-2 text-3xl font-black text-slate-800">{decisions.length}</p>
            <p className="mt-1 text-sm text-slate-600">Immutable Texas source audit records.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 sm:px-5">
          <div className="flex items-start gap-3">
            <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
            <div className="text-sm leading-6 text-blue-950">
              <p className="font-bold">Review the official link and hash together.</p>
              <p>
                Approval promotes the exact pending snapshot and moves its predecessor to superseded. Rejection keeps the predecessor current.
                The source text itself is intentionally not displayed in this dashboard.
              </p>
            </div>
          </div>
        </section>

        {resultMessage && (
          <section
            className={`rounded-2xl border px-4 py-4 text-sm ${result ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`}
            role="status"
          >
            <p className="font-bold">{resultMessage}</p>
            {result && (
              <p className="mt-1 leading-6">
                {result.affectedChargeIds.length === 0
                  ? "No predecessor-linked charges were affected."
                  : `${result.affectedChargeIds.length} affected charge${result.affectedChargeIds.length === 1 ? "" : "s"}: `}
                {result.affectedChargeIds.length > 0 && (
                  <span className="font-mono text-xs">{result.affectedChargeIds.join(", ")}</span>
                )}
                {" "}({result.restoredLinkCount} link{result.restoredLinkCount === 1 ? "" : "s"} updated)
              </p>
            )}
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Pending Texas snapshots</h2>
              <p className="mt-1 text-sm text-slate-600">Each row represents an exact source change awaiting review.</p>
            </div>
            <div className="w-full sm:w-64">
              <label htmlFor="reviewer-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Reviewer name</label>
              <input
                id="reviewer-name"
                data-testid="reviewer-name"
                value={reviewer}
                onChange={(event) => setReviewer(event.target.value)}
                maxLength={200}
                placeholder="Your name or initials"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
              />
            </div>
          </div>

          {loadError && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{loadError}</p>}
          {loading && pending.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Loading review queue…
            </div>
          ) : pending.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center">
              <Check className="mx-auto h-8 w-8 text-emerald-600" aria-hidden="true" />
              <p className="mt-3 font-bold text-slate-900">No Texas snapshots are waiting for review.</p>
              <p className="mt-1 text-sm text-slate-600">New source changes will appear here after the next import.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {pending.map((snapshot) => (
                <SnapshotCard
                  key={snapshot.id}
                  snapshot={snapshot}
                  reviewer={reviewer}
                  note={notes[snapshot.id] ?? ""}
                  busy={busySnapshotId === snapshot.id}
                  onNoteChange={(value) => setNotes((current) => ({ ...current, [snapshot.id]: value }))}
                  onReview={(decision) => void handleReview(snapshot, decision)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-slate-700" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-bold text-slate-950">Recent decisions</h2>
              <p className="mt-1 text-sm text-slate-600">Reviewer, timestamp, decision, and exact snapshot hash.</p>
            </div>
          </div>
          {recentDecisions.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">No Texas source decisions have been recorded yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-bold">Decided</th>
                    <th className="px-4 py-3 font-bold">Reviewer</th>
                    <th className="px-4 py-3 font-bold">Decision</th>
                    <th className="px-4 py-3 font-bold">Snapshot hash</th>
                    <th className="px-4 py-3 font-bold">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentDecisions.map((decision) => (
                    <tr key={decision.id} className="align-top">
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(decision.decidedAt)}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{decision.reviewer}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${decision.decision === "approve" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                          {decision.decision === "approve" ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <X className="h-3.5 w-3.5" aria-hidden="true" />}
                          {decision.decision}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <code className="font-mono text-xs text-slate-700" title={decision.snapshotHash}>{shortHash(decision.snapshotHash)}</code>
                      </td>
                      <td className="max-w-sm whitespace-pre-wrap px-4 py-3 text-slate-600">{decision.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}