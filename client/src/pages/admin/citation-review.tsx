/**
 * Admin: Citation Review Interface
 *
 * Internal-only page for manually verifying criminal charge statute citations.
 * Not visible to the public. Requires ADMIN_API_KEY to use.
 *
 * Access: /admin/citation-review
 * Auth:   Enter your ADMIN_API_KEY when prompted. Stored in sessionStorage.
 */

import { useState, useEffect, useCallback } from "react";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

// ── Official state legislature URLs ──────────────────────────────────────────
// Primary lookup URL per jurisdiction. Opens the state's official code search
// or the specific code section closest to what we can derive from the citation.

const STATE_LEGISLATURE_URLS: Record<string, string> = {
  AL: "https://alisondb.legislature.state.al.us/alison/codeofalabama/1975/coatoc.htm",
  AK: "https://www.akleg.gov/basis/folio.asp",
  AZ: "https://www.azleg.gov/arstitle/",
  AR: "https://www.arkleg.state.ar.us/legislation/CriminalCode",
  CA: "https://leginfo.legislature.ca.gov/faces/codedisplayexpand.xhtml?tocCode=PEN",
  CO: "https://leg.colorado.gov/colorado-revised-statutes",
  CT: "https://www.cga.ct.gov/current/pub/titles.htm",
  DE: "https://delcode.delaware.gov/title11/",
  DC: "https://code.dccouncil.gov/us/dc/council/code/titles/22/",
  FL: "https://www.flsenate.gov/Laws/Statutes",
  GA: "https://law.justia.com/codes/georgia/",
  HI: "https://www.capitol.hawaii.gov/hrscurrent/",
  ID: "https://legislature.idaho.gov/statutesrules/idstat/title18/",
  IL: "https://www.ilga.gov/legislation/ilcs/ilcs2.asp?ChapterID=53",
  IN: "https://iga.in.gov/laws/2024/ic/titles/35",
  IA: "https://www.legis.iowa.gov/law/iowaCode/sections?codeChapter=708&session=90",
  KS: "https://www.kslegislature.org/li/b2023_24/statute/021_000_0000_chapter/",
  KY: "https://apps.legislature.ky.gov/law/statutes/chapter.aspx?id=39730",
  LA: "https://www.legis.la.gov/Legis/Law.aspx?d=78337",
  ME: "https://legislature.maine.gov/statutes/17-A/",
  MD: "https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gcr&section=2-201",
  MA: "https://malegislature.gov/Laws/GeneralLaws/PartIV/TitleI/Chapter265",
  MI: "https://www.legislature.mi.gov/Laws/MCL/Act/29-of-1931",
  MN: "https://www.revisor.mn.gov/statutes/cite/609",
  MS: "https://law.justia.com/codes/mississippi/title-97/",
  MO: "https://revisor.mo.gov/main/OneChapter.aspx?chapter=565",
  MT: "https://leg.mt.gov/bills/mca/title_0450/chapters_index.html",
  NE: "https://nebraskalegislature.gov/laws/statutes.php?stat=28-301",
  NV: "https://www.leg.state.nv.us/NRS/NRS-200.html",
  NH: "https://www.gencourt.state.nh.us/rsa/html/NHTOC/NHTOC-XII-629-630.htm",
  NJ: "https://law.justia.com/codes/new-jersey/title-2c/",
  NM: "https://law.justia.com/codes/new-mexico/chapter-30/",
  NY: "https://www.nysenate.gov/legislation/laws/PEN",
  NC: "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/ByChapter/Chapter_14.html",
  ND: "https://www.legis.nd.gov/cencode/t12-1c16.pdf",
  OH: "https://codes.ohio.gov/ohio-revised-code/chapter-2903",
  OK: "https://www.oscn.net/applications/oscn/index.asp?level=1&type=TITLE&title=21",
  OR: "https://www.oregonlegislature.gov/bills_laws/ors/ors163.html",
  PA: "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=18&div=0&chpt=25",
  RI: "https://law.justia.com/codes/rhode-island/title-11/chapter-11-23/",
  SC: "https://www.scstatehouse.gov/code/t16c003.php",
  SD: "https://sdlegislature.gov/Statutes/22/Group",
  TN: "https://law.justia.com/codes/tennessee/title-39/chapter-13/",
  TX: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.19.htm",
  UT: "https://le.utah.gov/xcode/Title76/Chapter5/C76-5_1800010118000101.pdf",
  VT: "https://legislature.vermont.gov/statutes/chapter/13/053",
  VA: "https://law.lis.virginia.gov/vacode/title18.2/",
  WA: "https://app.leg.wa.gov/rcw/default.aspx?cite=9A.32",
  WV: "https://code.wvlegislature.gov/61-2/",
  WI: "https://docs.legis.wisconsin.gov/statutes/statutes/940",
  WY: "https://wyoleg.gov/statutes/compress/title06.pdf",
  FED: "https://uscode.house.gov/view.xhtml?path=/prelim@title18/part2&edition=prelim",
  PR: "https://bvirtualogp.pr.gov/ogp/Bvirtual/leyesreferencia/PDF/Ingles/0/2004-149.pdf",
  AS: "https://www.asbar.org/code",
  GU: "https://www.guamlegislature.com/guam-code-annotated/",
  MP: "https://www.cnmilaw.org/commonwealthcode.html",
  VI: "https://law.justia.com/codes/virgin-islands/",
};

// Justia fallback for all states — reliable secondary source
function justiaUrl(jurisdiction: string, citation: string): string {
  const stateSlugMap: Record<string, string> = {
    AL: "alabama", AK: "alaska", AZ: "arizona", AR: "arkansas", CA: "california",
    CO: "colorado", CT: "connecticut", DE: "delaware", FL: "florida", GA: "georgia",
    HI: "hawaii", ID: "idaho", IL: "illinois", IN: "indiana", IA: "iowa",
    KS: "kansas", KY: "kentucky", LA: "louisiana", ME: "maine", MD: "maryland",
    MA: "massachusetts", MI: "michigan", MN: "minnesota", MS: "mississippi",
    MO: "missouri", MT: "montana", NE: "nebraska", NV: "nevada", NH: "new-hampshire",
    NJ: "new-jersey", NM: "new-mexico", NY: "new-york", NC: "north-carolina",
    ND: "north-dakota", OH: "ohio", OK: "oklahoma", OR: "oregon", PA: "pennsylvania",
    RI: "rhode-island", SC: "south-carolina", SD: "south-dakota", TN: "tennessee",
    TX: "texas", UT: "utah", VT: "vermont", VA: "virginia", WA: "washington",
    WV: "west-virginia", WI: "wisconsin", WY: "wyoming", DC: "district-of-columbia",
  };
  const slug = stateSlugMap[jurisdiction];
  if (!slug) return `https://law.justia.com/search/?q=${encodeURIComponent(citation)}`;
  // Extract section number from citation for direct Justia section URL
  const sectionM = citation.match(/§\s*([\d.:\-A-Za-z]+)/);
  if (sectionM) {
    const sec = sectionM[1].replace(/[.:]/g, "-").toLowerCase();
    return `https://law.justia.com/codes/${slug}/section-${sec}/`;
  }
  return `https://law.justia.com/codes/${slug}/`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface CitationEntry {
  id: string;
  jurisdiction: string;
  slug: string;
  citation: string;
  alternateCitations?: string[];
  confidence: string;
  lastVerified: string;
  source: string;
  reviewStatus: "pending" | "verified" | "corrected" | "flagged";
  reviewedAt: string | null;
  correctedCitation: string | null;
  sourceUrl: string | null;
  notes: string | null;
}

interface SlugStat {
  slug: string;
  total: number;
  reviewed: number;
  verified: number;
  flagged: number;
}

interface Progress {
  total: number;
  reviewed: number;
  pending: number;
  verified: number;
  corrected: number;
  flagged: number;
  percentComplete: string;
  uniqueChargeSlugs: number;
  lastUpdated: string | null;
}

// ── Charge category grouping ──────────────────────────────────────────────────

function getCategory(slug: string): string {
  if (/murder|homicide|manslaughter/.test(slug)) return "Homicide";
  if (/sexual|rape|statutory-rape|child-rape|lewd|indecent/.test(slug)) return "Sexual Offenses";
  if (/assault|battery|domestic/.test(slug)) return "Assault / Battery / DV";
  if (/dui|dwi|drug|possession|trafficking|distribution/.test(slug)) return "Drug / DUI";
  if (/robbery|burglary|arson|kidnap|carjack/.test(slug)) return "Major Violent / Property";
  if (/theft|larceny|fraud|embezzle|forgery|identity|shoplifting/.test(slug)) return "Theft / Fraud";
  if (/trespass|disorderly|loiter|intoxic|vandal|mischief|disturbing/.test(slug)) return "Public Order";
  if (/firearm|weapon|gun|concealed/.test(slug)) return "Weapons";
  if (/driving|license|reckless|hit.and|suspended|vehicular/.test(slug)) return "Traffic";
  if (/juvenile|minor/.test(slug)) return "Juvenile";
  return "Other";
}

const CATEGORY_ORDER = [
  "Homicide", "Sexual Offenses", "Assault / Battery / DV", "Drug / DUI",
  "Major Violent / Property", "Theft / Fraud", "Public Order", "Weapons",
  "Traffic", "Juvenile", "Other",
];

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-gray-100 text-gray-600",
    verified: "bg-green-100 text-green-800",
    corrected: "bg-blue-100 text-blue-800",
    flagged: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    pending: "Pending",
    verified: "Verified",
    corrected: "Corrected",
    flagged: "Flagged",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${styles[status] ?? styles.pending}`}>
      {labels[status] ?? status}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function CitationReview() {
  useScrollToTop();

  // Auth
  const [adminKey, setAdminKey] = useState<string>(
    () => sessionStorage.getItem("adminKey") ?? ""
  );
  const [keyInput, setKeyInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Data
  const [slugs, setSlugs] = useState<SlugStat[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [entries, setEntries] = useState<CitationEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [slugSearch, setSlugSearch] = useState("");

  // Per-row edit state
  const [edits, setEdits] = useState<Record<string, {
    status: "pending" | "verified" | "corrected" | "flagged";
    correctedCitation: string;
    sourceUrl: string;
    notes: string;
  }>>({});

  const headers: Record<string, string> = adminKey ? { "x-admin-api-key": adminKey } : {};

  const apiFetch = useCallback(async (url: string, opts?: RequestInit) => {
    const res = await fetch(url, { ...opts, headers: { ...headers, ...(opts?.headers ?? {}) } });
    if (res.status === 401) { setAdminKey(""); sessionStorage.removeItem("adminKey"); }
    return res;
  }, [adminKey]);

  // Load slugs + progress on auth
  useEffect(() => {
    if (!adminKey) return;
    Promise.all([
      apiFetch("/api/admin/citation-review/slugs").then(r => r.json()),
      apiFetch("/api/admin/citation-review/progress").then(r => r.json()),
    ]).then(([s, p]) => {
      if (s.success) setSlugs(s.slugs);
      if (p.success) setProgress(p);
    }).catch(() => {});
  }, [adminKey, apiFetch]);

  // Load entries for selected slug
  useEffect(() => {
    if (!adminKey || !selectedSlug) return;
    setLoading(true);
    apiFetch(`/api/admin/citation-review/charges?slug=${encodeURIComponent(selectedSlug)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setEntries(data.entries);
          // Seed edits from existing review state
          const newEdits: typeof edits = {};
          for (const e of data.entries as CitationEntry[]) {
            newEdits[e.id] = {
              status: e.reviewStatus,
              correctedCitation: e.correctedCitation ?? "",
              sourceUrl: e.sourceUrl ?? "",
              notes: e.notes ?? "",
            };
          }
          setEdits(newEdits);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedSlug, adminKey]);

  function handleLogin() {
    if (!keyInput.trim()) { setAuthError("Enter your admin key."); return; }
    setAdminKey(keyInput.trim());
    sessionStorage.setItem("adminKey", keyInput.trim());
    setAuthError("");
  }

  function setEntryStatus(id: string, status: "pending" | "verified" | "corrected" | "flagged") {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], status } }));
  }

  async function saveAll() {
    setSaving(true);
    setSaveMsg("");
    const reviews = Object.entries(edits).map(([id, e]) => ({
      id,
      status: e.status,
      correctedCitation: e.correctedCitation || null,
      sourceUrl: e.sourceUrl || null,
      notes: e.notes || null,
    }));
    try {
      const res = await apiFetch("/api/admin/citation-review/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg(`Saved ${data.saved} entries.`);
        // Refresh progress
        apiFetch("/api/admin/citation-review/progress").then(r => r.json()).then(p => {
          if (p.success) setProgress(p);
        });
        // Refresh slug stats
        apiFetch("/api/admin/citation-review/slugs").then(r => r.json()).then(s => {
          if (s.success) setSlugs(s.slugs);
        });
      } else {
        setSaveMsg("Error saving. Check console.");
      }
    } finally {
      setSaving(false);
    }
  }

  // Group slugs by category for nav
  const categories: Record<string, SlugStat[]> = {};
  for (const s of slugs) {
    const cat = getCategory(s.slug);
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(s);
  }

  const filteredSlugs = slugs.filter(s => {
    if (categoryFilter !== "All" && getCategory(s.slug) !== categoryFilter) return false;
    if (statusFilter === "Pending" && s.reviewed === s.total) return false;
    if (statusFilter === "Complete" && s.reviewed < s.total) return false;
    if (slugSearch && !s.slug.includes(slugSearch.toLowerCase())) return false;
    return true;
  });

  // ── Auth gate ────────────────────────────────────────────────────────────────

  if (!adminKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm">
          <h1 className="text-xl font-semibold mb-1">Citation Review</h1>
          <p className="text-sm text-gray-500 mb-6">Internal admin tool. Enter your admin key to continue.</p>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 text-sm mb-3"
            placeholder="Admin API key"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            autoFocus
          />
          {authError && <p className="text-red-600 text-xs mb-3">{authError}</p>}
          <button
            className="w-full bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-700"
            onClick={handleLogin}
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  // ── Main UI ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-gray-900">Citation Review</h1>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">ADMIN ONLY</span>
        </div>
        {progress && (
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>{progress.percentComplete}% complete</span>
            <span className="text-green-700">{progress.verified} verified</span>
            <span className="text-blue-700">{progress.corrected} corrected</span>
            <span className="text-red-600">{progress.flagged} flagged</span>
            <span className="text-gray-400">{progress.pending} pending</span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{ width: `${progress.percentComplete}%` }}
              />
            </div>
          </div>
        )}
        <button
          className="text-xs text-gray-400 hover:text-gray-600"
          onClick={() => { setAdminKey(""); sessionStorage.removeItem("adminKey"); }}
        >
          Sign out
        </button>
      </div>

      <div className="flex h-[calc(100vh-52px)]">
        {/* Sidebar: charge slug list */}
        <div className="w-72 bg-white border-r flex flex-col flex-shrink-0">
          <div className="p-3 border-b space-y-2">
            <input
              type="text"
              placeholder="Search charge types..."
              className="w-full border rounded px-2 py-1.5 text-xs"
              value={slugSearch}
              onChange={e => setSlugSearch(e.target.value)}
            />
            <div className="flex gap-2">
              <select
                className="flex-1 border rounded px-2 py-1 text-xs"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="All">All categories</option>
                {CATEGORY_ORDER.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="flex-1 border rounded px-2 py-1 text-xs"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="All">All statuses</option>
                <option value="Pending">Has pending</option>
                <option value="Complete">Fully reviewed</option>
              </select>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 text-xs">
            {filteredSlugs.map(s => {
              const pct = s.total > 0 ? Math.round((s.reviewed / s.total) * 100) : 0;
              return (
                <button
                  key={s.slug}
                  onClick={() => setSelectedSlug(s.slug)}
                  className={`w-full text-left px-3 py-2 border-b hover:bg-gray-50 flex items-center justify-between gap-2 ${selectedSlug === s.slug ? "bg-blue-50 border-l-2 border-l-blue-500" : ""}`}
                >
                  <span className="truncate text-gray-800">{s.slug}</span>
                  <span className={`flex-shrink-0 text-xs ${pct === 100 ? "text-green-600" : s.flagged > 0 ? "text-red-500" : "text-gray-400"}`}>
                    {pct}%
                  </span>
                </button>
              );
            })}
            {filteredSlugs.length === 0 && (
              <p className="p-4 text-gray-400">No charges match filters.</p>
            )}
          </div>
        </div>

        {/* Main panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedSlug && (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a charge type from the sidebar to begin reviewing.
            </div>
          )}

          {selectedSlug && loading && (
            <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>
          )}

          {selectedSlug && !loading && entries.length > 0 && (
            <div className="space-y-4">
              {/* Charge header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 capitalize">
                    {selectedSlug.replace(/-/g, " ")}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {entries.length} jurisdictions — {entries.filter(e => (edits[e.id]?.status ?? e.reviewStatus) !== "pending").length} reviewed
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {saveMsg && <span className="text-sm text-green-700">{saveMsg}</span>}
                  <button
                    onClick={saveAll}
                    disabled={saving}
                    className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save all"}
                  </button>
                </div>
              </div>

              {/* How-to note */}
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-800">
                <strong>Review process:</strong> For each row, click the official source link to open the statute in a new tab.
                Confirm the section heading matches the charge. Click <strong>Verify</strong> if correct,
                <strong> Correct</strong> to fix the citation, or <strong>Flag</strong> if it needs deeper research.
                Click <strong>Save all</strong> when done with this charge type.
              </div>

              {/* Citation table */}
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-600 w-16">State</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-600">Citation</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-600 w-24">Source</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-600 w-28">Official Link</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-600 w-20">Status</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-600 w-56">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, i) => {
                      const edit = edits[entry.id] ?? {
                        status: entry.reviewStatus,
                        correctedCitation: entry.correctedCitation ?? "",
                        sourceUrl: entry.sourceUrl ?? "",
                        notes: entry.notes ?? "",
                      };
                      const officialUrl = STATE_LEGISLATURE_URLS[entry.jurisdiction];
                      const justia = justiaUrl(entry.jurisdiction, entry.citation);
                      const sourceLabel = entry.source?.includes("Training data") ? "AI" :
                        entry.source?.includes("Justia") ? "Justia" :
                        entry.source?.includes("legislature") || entry.source?.includes("Legislature") ? "Legislature" : "Other";
                      const sourceBg = sourceLabel === "AI" ? "bg-red-50 text-red-700" :
                        sourceLabel === "Legislature" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600";

                      return (
                        <tr key={entry.id} className={`border-b ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                          <td className="px-4 py-3 font-mono font-bold text-gray-700">{entry.jurisdiction}</td>
                          <td className="px-4 py-3">
                            {edit.status === "corrected" ? (
                              <div className="space-y-1">
                                <div className="line-through text-gray-400 text-xs">{entry.citation}</div>
                                <input
                                  className="border rounded px-2 py-1 text-xs w-full"
                                  value={edit.correctedCitation}
                                  onChange={e => setEdits(prev => ({ ...prev, [entry.id]: { ...prev[entry.id], correctedCitation: e.target.value } }))}
                                  placeholder="Corrected citation..."
                                />
                              </div>
                            ) : (
                              <span className="font-mono text-xs">{entry.citation}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${sourceBg}`}>{sourceLabel}</span>
                          </td>
                          <td className="px-4 py-3 space-y-1">
                            {officialUrl && (
                              <a href={officialUrl} target="_blank" rel="noreferrer"
                                className="block text-xs text-blue-600 hover:underline truncate" title="Official state legislature">
                                Official code
                              </a>
                            )}
                            <a href={justia} target="_blank" rel="noreferrer"
                              className="block text-xs text-indigo-500 hover:underline truncate" title="Justia">
                              Justia
                            </a>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={edit.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 flex-wrap">
                              <button
                                onClick={() => setEntryStatus(entry.id, "verified")}
                                className={`text-xs px-2 py-1 rounded border ${edit.status === "verified" ? "bg-green-600 text-white border-green-600" : "border-green-500 text-green-700 hover:bg-green-50"}`}
                              >
                                Verify
                              </button>
                              <button
                                onClick={() => setEntryStatus(entry.id, "corrected")}
                                className={`text-xs px-2 py-1 rounded border ${edit.status === "corrected" ? "bg-blue-600 text-white border-blue-600" : "border-blue-500 text-blue-700 hover:bg-blue-50"}`}
                              >
                                Correct
                              </button>
                              <button
                                onClick={() => setEntryStatus(entry.id, "flagged")}
                                className={`text-xs px-2 py-1 rounded border ${edit.status === "flagged" ? "bg-red-600 text-white border-red-600" : "border-red-400 text-red-600 hover:bg-red-50"}`}
                              >
                                Flag
                              </button>
                              {edit.status !== "pending" && (
                                <button
                                  onClick={() => setEntryStatus(entry.id, "pending")}
                                  className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                            {edit.status === "corrected" && (
                              <input
                                className="mt-1 border rounded px-2 py-1 text-xs w-full"
                                value={edit.sourceUrl}
                                onChange={e => setEdits(prev => ({ ...prev, [entry.id]: { ...prev[entry.id], sourceUrl: e.target.value } }))}
                                placeholder="Official URL (paste from tab)"
                              />
                            )}
                            {edit.status === "flagged" && (
                              <input
                                className="mt-1 border rounded px-2 py-1 text-xs w-full"
                                value={edit.notes}
                                onChange={e => setEdits(prev => ({ ...prev, [entry.id]: { ...prev[entry.id], notes: e.target.value } }))}
                                placeholder="Note what needs research..."
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
