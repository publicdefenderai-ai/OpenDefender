import { describe, expect, it, vi } from "vitest";
import {
  freshDocument, quoteLines, runSourceBatch, textHash,
  type BatchDocument, type SourceAdapter, type SourceCache,
} from "../scripts/data-review/batch/source-batch";
import { createOhioAdapter, ohioIncorporatedReferences, sectionReferences } from "../scripts/data-review/batch/ohio-adapter";
import {
  buildOhioBatchReview, extractOffenseUnits, ohioTargets, reviewCsv,
} from "../scripts/data-review/batch/ohio-review-report";
import { reconcileReviewLedger, selectedReferences } from "../scripts/data-review/batch/review-ledger";
import { extractOhioChapterDocuments } from "../scripts/data-review/batch/ohio-bulk-source";
import { checkOhioChapterIndex } from "../scripts/data-review/batch/ohio-index";

const maxAgeMs = 7 * 24 * 60 * 60_000;
function document(section = "2903.16", body = "(A) No person shall knowingly do the prohibited act.\n(B) Whoever violates division (A) of this section is guilty of example offense, a misdemeanor of the first degree."): BatchDocument {
  const text = `Section ${section} | Example offense.\nEffective: 2023-04-06\n${body}`;
  return {
    section, title: "Example offense", text, contentHash: textHash(text),
    sourceUrl: `https://codes.ohio.gov/ohio-revised-code/section-${section}`,
    retrievedAt: new Date(Date.now() - 1000).toISOString(), effectiveDateStart: "2023-04-06",
  };
}
const emptyCache = (): SourceCache => ({ schemaVersion: 1, documents: {}, failures: {} });
function options(cache = emptyCache()) {
  const adapter: SourceAdapter = {
    validate: createOhioAdapter().validate,
    references: () => [],
    acquire: vi.fn(async section => document(section)),
  };
  return {
    roots: ["2903.16"], cache, adapter, now: new Date(), maxAgeMs,
    maxRequests: 20, maxDepth: 1, acquire: true,
  };
}

describe("resumable source batch", () => {
  it("deduplicates roots and shared dependencies, then reuses every fresh document", async () => {
    const setup = options();
    setup.roots = ["2903.16", "2903.16", "2903.341"];
    setup.adapter.references = doc => doc.section === "2901.01" ? [] : ["2901.01", "2901.01"];
    const first = await runSourceBatch(setup);
    expect(first.metrics.requests).toBe(3);
    expect(first.documents.size).toBe(3);
    const second = await runSourceBatch({ ...setup, now: new Date() });
    expect(second.metrics.requests).toBe(0);
    expect(second.metrics.reused).toBe(3);
    expect(setup.adapter.acquire).toHaveBeenCalledTimes(3);
  });

  it("does not spend requests in offline mode or beyond a budget", async () => {
    const setup = options();
    const offline = await runSourceBatch({ ...setup, acquire: false });
    expect(offline.statuses["2903.16"]).toBe("acquisition_required");
    const budget = await runSourceBatch({ ...setup, maxRequests: 0 });
    expect(budget.statuses["2903.16"]).toBe("request_budget_deferred");
    expect(setup.adapter.acquire).not.toHaveBeenCalled();
  });

  it("rejects corrupt, future-dated and expired cached evidence", () => {
    const setup = options();
    const original = document();
    expect(freshDocument(original, setup.now, maxAgeMs, setup.adapter)).toBe(true);
    expect(freshDocument({ ...original, text: original.text + "x" }, setup.now, maxAgeMs, setup.adapter)).toBe(false);
    expect(freshDocument({ ...original, retrievedAt: new Date(Date.now() + 60_000).toISOString() }, setup.now, maxAgeMs, setup.adapter)).toBe(false);
    expect(freshDocument({ ...original, retrievedAt: new Date(Date.now() - maxAgeMs).toISOString() }, new Date(), maxAgeMs, setup.adapter)).toBe(false);
    expect(freshDocument({ ...original, sourceUrl: "https://example.com" }, setup.now, maxAgeMs, setup.adapter)).toBe(false);
    expect(freshDocument({ ...original, title: "Wrong official title" }, setup.now, maxAgeMs, setup.adapter)).toBe(false);
  });

  it("removes stale evidence on refresh failure, caches failures and retries explicitly", async () => {
    const setup = options();
    setup.cache.documents["2903.16"] = { ...document(), retrievedAt: "2020-01-01" };
    setup.adapter.acquire = vi.fn().mockRejectedValue(new Error("HTTP 429"));
    const first = await runSourceBatch(setup);
    expect(first.documents.size).toBe(0);
    expect(setup.cache.documents["2903.16"]).toBeUndefined();
    const second = await runSourceBatch({ ...setup, now: new Date() });
    expect(second.metrics.cachedFailures).toBe(1);
    expect(setup.adapter.acquire).toHaveBeenCalledTimes(1);
    await runSourceBatch({ ...setup, retryFailures: true, now: new Date() });
    expect(setup.adapter.acquire).toHaveBeenCalledTimes(2);
  });

  it("rejects an acquisition returning a different section", async () => {
    const setup = options();
    setup.adapter.acquire = async () => document("2903.34");
    const result = await runSourceBatch(setup);
    expect(result.metrics.failed).toBe(1);
    expect(result.documents.size).toBe(0);
  });

  it("revokes approval receipt on changed pins or failed pinned-source refresh", async () => {
    const setup = options();
    const onPinnedFailure = vi.fn();
    const result = await runSourceBatch({
      ...setup, pinnedHashes: { "2903.16": "different-approved-hash" }, onPinnedFailure,
    });
    expect(result.changedPinnedSources).toEqual(["2903.16"]);
    expect(onPinnedFailure).toHaveBeenCalledTimes(1);
    setup.adapter.acquire = async () => { throw new Error("HTTP 500"); };
    await runSourceBatch({ ...setup, force: true, pinnedHashes: { "2903.16": "pin" }, onPinnedFailure });
    expect(onPinnedFailure).toHaveBeenCalledTimes(2);
  });

  it("reports references outside depth instead of pretending the graph is closed", async () => {
    const setup = options();
    setup.adapter.references = () => ["2901.01"];
    const result = await runSourceBatch({ ...setup, maxDepth: 0 });
    expect(result.unexpandedReferences).toEqual(["2901.01"]);
  });
  it("one grouped download satisfies multiple primary sections and checkpoints siblings", async () => {
    const setup = options();
    setup.roots = ["2903.16", "2903.341"];
    const acquireGroup = vi.fn(async () => ({
      documents: [document("2903.16"), document("2903.341")], requests: 1,
    }));
    const result = await runSourceBatch({ ...setup, adapter: { ...setup.adapter, acquireGroup } });
    expect(acquireGroup).toHaveBeenCalledTimes(1);
    expect(result.metrics.requests).toBe(1);
    expect(result.metrics.bulkDocumentsCached).toBe(2);
    expect(result.documents.size).toBe(2);
    expect(setup.cache.documents["2903.341"]).toBeDefined();
  });
  it("counts failed grouped-plus-fallback requests against the same budget", async () => {
    const setup = options();
    const acquireGroup = vi.fn(async () => {
      throw Object.assign(new Error("Chapter and exact section unavailable"), { requestsUsed: 2 });
    });
    const result = await runSourceBatch({
      ...setup, roots: ["2903.16", "2903.341"], maxRequests: 2,
      adapter: { ...setup.adapter, acquireGroup },
    });
    expect(result.metrics.requests).toBe(2);
    expect(result.metrics.deferred).toBe(1);
    expect(acquireGroup).toHaveBeenCalledTimes(1);
  });
});

describe("Ohio review preparation, not automatic legal approval", () => {
  it("preserves short and long Ohio section identifiers", () => {
    expect(sectionReferences("section 1.59, 9.68, 3301.0711 and 2903.34")).toEqual(["1.59", "9.68", "3301.0711", "2903.34"]);
    expect(sectionReferences("MPC § 2.06 / OH accomplice statute")).toEqual([]);
    expect(sectionReferences('As defined in 45 C.F.R. 160.103 or section 2921.01 of the Revised Code')).toEqual(["2921.01"]);
  });
  it("does not expand incidental citations and honors hash-bound reference decisions", () => {
    const source = document("2903.16", '(A) Detention has the same meaning as in section 2921.01.\n(B) Prior convictions under section 2903.13 may affect this rule.');
    expect(ohioIncorporatedReferences(source)).toEqual(["2921.01"]);
    const ledger = { schemaVersion: 1 as const, decisions: {
      "2903.16": { sourceHash: source.contentHash, references: {
        "2903.13": { decision: "include" as const, reason: "Reviewed grading dependency" },
      } },
    } };
    expect(selectedReferences(source.section, source.contentHash, ["2921.01"], ["2921.01", "2903.13"], ledger)).toEqual(["2903.13", "2921.01"]);
    expect(selectedReferences(source.section, "changed", ["2921.01"], ["2921.01", "2903.13"], ledger)).toEqual(["2921.01"]);
  });
  it("extracts literal guilt names with verifiable offsets and excludes bare grades", () => {
    const source = document();
    const units = extractOffenseUnits(source);
    expect(units[0].name).toBe("example offense");
    expect(units[0].conductReference).toBe("division (A)");
    for (const quote of quoteLines(source, /guilty|misdemeanor/)) {
      expect(source.text.slice(quote.start, quote.end)).toBe(quote.text);
      expect(quote.sourceHash).toBe(textHash(source.text));
    }
    expect(extractOffenseUnits(document("2903.16", "(B) Whoever violates this section is guilty of a felony of the fifth degree."))).toEqual([]);
  });
  it("accounts for every row and both sides of conflicting citation identities", () => {
    const targets = ohioTargets([
      { chargeId: "a", catalogLabel: "Example", catalogCode: "2903.16", disposition: "require_exact_reselection", dispositionReason: "wrong citation", mapping: { candidateCitations: ["Ohio Rev. Code Ann. § 2903.34"] } },
      { chargeId: "b", catalogLabel: "Other", catalogCode: "2903.341", disposition: "retain", dispositionReason: "verified" },
    ], [{ section: "2903.22", heading: "Menacing", status: "withheld_from_source_first_publication" }]);
    expect(targets).toHaveLength(3);
    expect(targets[0].sections).toEqual(["2903.16", "2903.34"]);
    expect(targets[1].status).toBe("configured");
    expect(targets[2].origin).toBe("chapter_discovery");
  });
  it("a literal name match remains unapproved; groups same-section review once", async () => {
    const batch = await runSourceBatch(options());
    const targets = ["a", "b"].map(id => ({
      id, label: "Example offense", sections: ["2903.16"], status: "withheld" as const,
      origin: "catalog" as const, reason: "requires review",
    }));
    const report = buildOhioBatchReview(targets, batch);
    expect(report.summary.reviewGroups).toBe(1);
    expect(report.summary.literalNameMatches).toBe(2);
    expect(report.targets.every(target => target.reviewStatus === "evidence_prepared_not_approved")).toBe(true);
    expect(report.groups[0].decision).toBe("");
    expect(report.publicationStatus).toBe("review_only_no_catalog_or_database_changes");
  });
  it("separates primary-source technical blockers from attorney questions", async () => {
    const batch = await runSourceBatch({ ...options(), acquire: false });
    const report = buildOhioBatchReview([{
      id: "held", label: "Example", sections: ["2903.16"], status: "withheld",
      origin: "catalog", reason: "requires source",
    }], batch);
    expect(report.summary.targetsWithPrimarySourceBlockers).toBe(1);
    expect(report.groups[0].manualQuestions).toEqual([]);
    expect(reviewCsv(report)).toContain("Primary official text unavailable");
  });
  it("preserves review decisions on rerun and invalidates only changed section evidence", async () => {
    const batch = await runSourceBatch(options());
    const report = buildOhioBatchReview([{
      id: "held", label: "Example offense", sections: ["2903.16"], status: "withheld",
      origin: "catalog", reason: "requires review",
    }], batch);
    const first = reconcileReviewLedger(report);
    first.ledger.decisions["2903.16"].decision = "hold";
    first.ledger.decisions["2903.16"].note = "Keep this legal concern";
    expect(reconcileReviewLedger(report, first.ledger).reviewState[0].status).toBe("decision_recorded_not_published");
    report.groups[0].sourceHash = "changed";
    const changed = reconcileReviewLedger(report, first.ledger);
    expect(changed.reviewState[0].status).toBe("evidence_changed_review_again");
    expect(changed.ledger.decisions["2903.16"].note).toBe("Keep this legal concern");
    expect(changed.ledger.decisions["2903.16"].decision).toBe("hold");
  });
});

describe("chapter-level extraction and current enumeration", () => {
  const section = (id: string) => `<tr><td><div class="list-content"><span class="content-head-text"><a href="section-${id}">Section ${id} | Example offense.</a></span><div class="content-body"><div class="label">Effective:</div><div class="value">April 6, 2023</div><section class="laws-body"><p>No person shall knowingly commit the prohibited act under this section.</p></section></div></div></td></tr>`;
  const html = `<h1>Chapter 2903 | Homicide and Assault.</h1><table class="laws-table">${section("2903.16")}${section("2903.341")}</table>`;
  it("keeps section identity, text, source URL and dates bounded to each sibling", () => {
    const docs = extractOhioChapterDocuments(html, "2903", new Date());
    expect(docs.map(doc => doc.section)).toEqual(["2903.16", "2903.341"]);
    expect(docs.every(doc => createOhioAdapter().validate(doc))).toBe(true);
    expect(docs[0].text).not.toContain("2903.341");
    expect(docs[0].acquiredFrom).toBe("https://codes.ohio.gov/ohio-revised-code/chapter-2903");
    expect(() => extractOhioChapterDocuments(html, "2905", new Date())).toThrow("Wrong official chapter");
    expect(() => extractOhioChapterDocuments(html.replace("section-2903.16", "section-2903.17"), "2903", new Date())).toThrow("identity mismatch");
  });
  it("detects added sections and does not claim completeness with a missing/stale index", async () => {
    const fetchPage = vi.fn(async () => new Response(html));
    const first = await checkOhioChapterIndex(["2903.16"], undefined, true, new Date(), maxAgeMs, fetchPage);
    expect(first.status).toBe("enumeration_changed");
    expect(first.added).toEqual(["2903.341"]);
    const reused = await checkOhioChapterIndex(["2903.16", "2903.341"], first.receipt, false, new Date(), maxAgeMs, fetchPage);
    expect(reused.status).toBe("reused_fresh_index");
    expect(fetchPage).toHaveBeenCalledTimes(1);
    const missing = await checkOhioChapterIndex(["2903.16"], undefined, false, new Date(), maxAgeMs, fetchPage);
    expect(missing.status).toBe("index_refresh_required");
  });
});