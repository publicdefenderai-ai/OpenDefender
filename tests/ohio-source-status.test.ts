import { createHash } from "node:crypto";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { interpretOhioSectionStatus as status, statusSuppressesDiscovery } from "../scripts/data-review/ohio-discovery/section-status";
import { parseOhioChapterPage } from "../scripts/data-review/ohio-discovery/chapter-parser";
import { readParsedChapter } from "../scripts/data-review/acquire-ohio-code";
import { verifyRecordedPage } from "../scripts/data-review/reparse-ohio-snapshot";

const AS_OF = "2026-09-23";
const body = "No person shall disclose protected information.";
describe("Ohio source status at the recorded retrieval date", () => {
  it("retains operative text under a new number despite renumbering history", () => {
    expect(status("[Former R.C. 128.32, amended and renumbered effective 10/3/2023] Immunity", body, "2023-10-03", AS_OF).kind).toBe("operative_text");
    expect(status("[Renumbered as R.C. 128.96]", "", null, AS_OF).kind).toBe("renumbered_away");
  });
  it.each(["Lots may be revised and renumbered", "Repealed laws have no effect on actions taken", "Rules to remain in effect until repealed or superseded"])("does not treat incidental words as a status notice: %s", heading => {
    expect(status(heading, "Rules remain in effect until repealed.", null, AS_OF).kind).toBe("operative_text");
  });
  it("distinguishes scheduled, effective and past repeal at a deterministic date boundary", () => {
    const heading = "[Repealed effective 10/09/2026] Program";
    expect(status(heading, body, "2020-01-01", AS_OF)).toMatchObject({ kind: "scheduled_repeal", transitionDate: "2026-10-09" });
    expect(status(heading, body, "2020-01-01", "2026-10-09").kind).toBe("repealed");
    expect(status("[Repealed effective 2/11/2022] Definitions", body, "2011-09-29", AS_OF).kind).toBe("repealed");
  });
  it("retains evidence spans in the original heading or body", () => {
    const heading = "Testing [repealed 4/3/2033]";
    const s = status(heading, body, null, AS_OF);
    expect(s.kind).toBe("scheduled_repeal");
    expect(s.evidence!.text).toBe(heading.slice(s.evidence!.start, s.evidence!.end));
    expect(status("Former provision", "Repealed.", null, AS_OF)).toMatchObject({ kind: "repealed", evidence: { field: "text" } });
  });
  it("holds ambiguous or malformed notices instead of assuming active or repealed", () => {
    expect(status("[Repealed effective February 2027] Program", body, null, AS_OF).kind).toBe("uncertain");
    expect(status("[Repealed effective 2/30/2026] Program", body, null, AS_OF).kind).toBe("uncertain");
    expect(status("[Repealed effective 10/09/2026]", "", null, AS_OF).kind).toBe("uncertain");
    expect(status("[Renumbered effective 10/09/2026 as 128.96]", body, null, AS_OF).kind).toBe("uncertain");
    expect(status("Reserved", "", null, AS_OF).kind).toBe("reserved");
    expect(status("Program", "", null, AS_OF).kind).toBe("uncertain");
  });
  it("holds future-effective versions even when they have substantive text", () => {
    const s = status("Program", body, "2027-01-01", AS_OF);
    expect(s.kind).toBe("not_yet_effective");
    expect(statusSuppressesDiscovery(s)).toBe(true);
    expect(statusSuppressesDiscovery(status("[Repealed effective 10/09/2026] Program", body, "2020-01-01", AS_OF))).toBe(false);
    expect(() => status("Program", body, null, "2026-02-30")).toThrow(/snapshot date/);
  });
  it("integrates status into chapter parsing without changing body evidence", () => {
    const html = `<h1>Chapter 128 | Emergency services.</h1><table class="laws-table"><tr><td><div class="list-content"><div class="content-head-text"><a href="/ohio-revised-code/section-128.96">Section 128.96 | [Former R.C. 128.32, amended and renumbered] Immunity.</a></div><div class="laws-section-info">Effective: October 3, 2023</div><section class="laws-body">${body}</section></div></td></tr></table>`;
    const row = parseOhioChapterPage(html, "128", AS_OF).sections[0];
    expect(row).toMatchObject({ repealed: false, text: body, sourceStatus: { kind: "operative_text", asOf: AS_OF } });
    expect(row.contentHash).toBe(createHash("sha256").update(body).digest("hex"));
  });
  it("invalidates old parser caches without forcing a network refresh", () => {
    const dir = mkdtempSync(join(tmpdir(), "ohio-parser-test-"));
    const p = join(dir, "chapter.json");
    try {
      const cache = { retrievedAt: new Date().toISOString(), sections: [{}] };
      writeFileSync(p, JSON.stringify(cache)); expect(readParsedChapter(p)).toBeNull();
      writeFileSync(p, JSON.stringify({ ...cache, parserVersion: 2 })); expect(readParsedChapter(p)).not.toBeNull();
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  it("requires original page bytes, URL and retrieval timestamp for offline replay", () => {
    const page = { schemaVersion: 1, sourceUrl: "https://codes.ohio.gov/ohio-revised-code/chapter-128", retrievedAt: "2026-09-23T00:00:00Z", html: "<h1>Official page</h1>" };
    const chapter = { chapterNumber: "128", titleNumber: "1", sectionCount: 1, chapterName: "Emergency services", sourceUrl: page.sourceUrl, retrievedAt: page.retrievedAt, pageHash: createHash("sha256").update(page.html).digest("hex") };
    expect(() => verifyRecordedPage(page, chapter)).not.toThrow();
    for (const change of [{ html: "other" }, { retrievedAt: "2026-09-24T00:00:00Z" }, { sourceUrl: "https://example.com" }]) {
      expect(() => verifyRecordedPage({ ...page, ...change }, chapter)).toThrow(/does not match/);
    }
  });
});
