/**
 * Internal provider operations report.
 *
 * This page intentionally renders only aggregate counts and timings returned
 * by the protected admin endpoint. It never receives or displays case data.
 */

import { useCallback, useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Clock3, RefreshCw, ShieldCheck } from "lucide-react";

type ProviderName = "CourtListener" | "OpenLaws" | "GuidanceEnrichment";

interface ProviderSummary {
  provider: ProviderName;
  requestCount: number;
  successCount: number;
  failureCount: number;
  timeoutCount: number;
  clientErrorCount: number;
  cancelledCount: number;
  durationTotalMs: number;
  durationMaxMs: number;
  averageDurationMs: number;
  availabilityPercent: number | null;
}

interface DailyMetric {
  provider: ProviderName;
  operation: "api_request" | "source_enrichment";
  bucketStart: string;
  requestCount: number;
  successCount: number;
  failureCount: number;
  timeoutCount: number;
  clientErrorCount: number;
  cancelledCount: number;
  durationTotalMs: number;
  durationMaxMs: number;
  lastOutcome: string;
}

interface MetricsReport {
  from: string;
  to: string;
  days: number;
  providers: ProviderSummary[];
  daily: DailyMetric[];
}

function useAdminNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);
}

function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) return `${milliseconds} ms`;
  return `${(milliseconds / 1000).toFixed(1)} s`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function providerLabel(provider: ProviderName): string {
  return provider === "GuidanceEnrichment" ? "Source enrichment" : provider;
}

function MetricCard({ summary }: { summary: ProviderSummary }) {
  const hasData = summary.requestCount > 0;
  const healthy = hasData && (summary.availabilityPercent === null || summary.availabilityPercent >= 99);
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{providerLabel(summary.provider)}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            {summary.availabilityPercent === null ? "N/A" : `${summary.availabilityPercent}%`}
          </p>
          <p className="mt-1 text-xs text-slate-500">availability</p>
        </div>
        {!hasData ? (
          <Activity className="h-5 w-5 text-slate-400" aria-label="No data" />
        ) : healthy ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-label="Healthy" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-600" aria-label="Degraded" />
        )}
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-slate-500">Requests</dt>
          <dd className="font-medium text-slate-900">{summary.requestCount.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Failures</dt>
          <dd className="font-medium text-slate-900">{summary.failureCount.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Avg latency</dt>
          <dd className="font-medium text-slate-900">{formatDuration(summary.averageDurationMs)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Slowest</dt>
          <dd className="font-medium text-slate-900">{formatDuration(summary.durationMaxMs)}</dd>
        </div>
      </dl>
      {summary.timeoutCount > 0 && (
        <p className="mt-4 text-xs text-amber-700">
          {summary.timeoutCount.toLocaleString()} timeout{summary.timeoutCount === 1 ? "" : "s"} recorded
        </p>
      )}
    </article>
  );
}

export default function AdminProviderMetrics() {
  useAdminNoIndex();
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem("adminKey") ?? "");
  const [keyInput, setKeyInput] = useState("");
  const [report, setReport] = useState<MetricsReport | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReport = useCallback(async (key: string, range: number) => {
    if (!key) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/provider-metrics?days=${range}`, {
        headers: { "x-admin-api-key": key },
      });
      const body = await response.json() as MetricsReport & { success?: boolean; error?: string };
      if (!response.ok || !body.success) {
        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem("adminKey");
          setAdminKey("");
        }
        throw new Error(body.error || "Unable to load metrics");
      }
      setReport(body);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) void loadReport(adminKey, days);
  }, [adminKey, days, loadReport]);

  function signIn(event: React.FormEvent) {
    event.preventDefault();
    const key = keyInput.trim();
    if (!key) return;
    sessionStorage.setItem("adminKey", key);
    setAdminKey(key);
    setKeyInput("");
  }

  if (!adminKey) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <form onSubmit={signIn} className="mx-auto max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            <h1 className="text-lg font-semibold text-slate-900">Provider operations</h1>
          </div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="admin-key">Admin token</label>
          <input
            id="admin-key"
            type="password"
            value={keyInput}
            onChange={(event) => setKeyInput(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            autoComplete="off"
          />
          <button type="submit" className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Sign in
          </button>
        </form>
      </main>
    );
  }

  const apiSummaries = report?.providers.filter((item) => item.provider !== "GuidanceEnrichment") ?? [];
  const dailyRows = report?.daily.filter((item) => item.operation === "api_request" && item.provider !== "GuidanceEnrichment") ?? [];

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">ADMIN</span>
              <h1 className="text-lg font-semibold text-slate-900">Provider operations</h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">Availability and enrichment latency, aggregated in UTC.</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700"
              aria-label="Metrics range"
            >
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
            <button
              type="button"
              onClick={() => void loadReport(adminKey, days)}
              disabled={loading}
              className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              aria-label="Refresh metrics"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={() => { sessionStorage.removeItem("adminKey"); setAdminKey(""); setReport(null); }}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-6 sm:px-6">
        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        <section className="grid gap-4 md:grid-cols-3" aria-label="Provider summaries">
          {apiSummaries.map((summary) => <MetricCard key={summary.provider} summary={summary} />)}
          {report && report.providers.find((item) => item.provider === "GuidanceEnrichment") && (
            <MetricCard summary={report.providers.find((item) => item.provider === "GuidanceEnrichment")!} />
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              <h2 className="font-semibold text-slate-900">Daily provider activity</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">Use this table to compare source availability over time.</p>
          </div>
          {dailyRows.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">No provider requests recorded in this period.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">UTC day</th>
                    <th className="px-5 py-3 font-medium">Provider</th>
                    <th className="px-5 py-3 font-medium">Requests</th>
                    <th className="px-5 py-3 font-medium">Failures</th>
                    <th className="px-5 py-3 font-medium">Avg latency</th>
                    <th className="px-5 py-3 font-medium">Max latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dailyRows.map((row) => (
                    <tr key={`${row.bucketStart}-${row.provider}`}>
                      <td className="px-5 py-3 text-slate-600">{formatDate(row.bucketStart)}</td>
                      <td className="px-5 py-3 font-medium text-slate-900">{providerLabel(row.provider)}</td>
                      <td className="px-5 py-3 text-slate-600">{row.requestCount.toLocaleString()}</td>
                      <td className="px-5 py-3 text-slate-600">{row.failureCount.toLocaleString()}</td>
                      <td className="px-5 py-3 text-slate-600">{formatDuration(row.requestCount ? Math.round(row.durationTotalMs / row.requestCount) : 0)}</td>
                      <td className="px-5 py-3 text-slate-600">{formatDuration(row.durationMaxMs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
          Metrics retain daily aggregate counters and bounded timings only. Prompts, citations, URLs, session identifiers, and case narratives are not stored in this path.
        </p>
      </div>
    </main>
  );
}