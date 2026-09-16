import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { OhioOfficialFetcher } from "../scripts/data-review/ohio-discovery/fetcher";
import {
  hasOhioRevisedCodeRootIdentity,
  parseOhioChapterSectionLinks,
  parseOhioRootTitleLinks,
  parseOhioSectionEvidence,
  parseOhioTitleChapterLinks,
  resolveOfficialOhioUrl,
} from "../scripts/data-review/ohio-discovery/parser";

const ROOT = "https://codes.ohio.gov/ohio-revised-code";
const TITLE_29 = `${ROOT}/title-29`;
const CHAPTER_2903 = `${ROOT}/chapter-2903`;

describe("Ohio Code discovery parsers", () => {
  it("enumerates only official title, chapter, and suffix-preserving section identities", () => {
    const root = `<a href="ohio-revised-code/title-29">Title 29 <span>|</span> Crimes-Procedure</a>
      <a href="https://example.invalid/title-7">Title 7 | Not official</a>
      <a href="ohio-revised-code/general-provisions">General Provisions</a>`;
    expect(parseOhioRootTitleLinks(root, ROOT)).toEqual([{
      id: "29",
      title: "Crimes-Procedure",
      sourceUrl: TITLE_29,
    }]);
    expect(hasOhioRevisedCodeRootIdentity("<h1>Ohio Revised Code</h1>")).toBe(true);
    expect(hasOhioRevisedCodeRootIdentity("<h1>Ohio Administrative Code</h1>")).toBe(false);

    const title = `<a href="chapter-2903">Chapter 2903 | Homicide and Assault</a>
      <a href="chapter-not-a-number">Chapter nope | Bad</a>`;
    expect(parseOhioTitleChapterLinks(title, TITLE_29)).toEqual([{
      id: "2903",
      title: "Homicide and Assault",
      sourceUrl: CHAPTER_2903,
    }]);

    const chapter = `<table class="laws-table"><tr><td><span class="content-head-text">
      <a href="section-2903.041">Section 2903.041 | Unlawful termination of another's pregnancy.</a>
      <a href="/ohio-revised-code/section-2903.02">Section 2903.02 | Murder.</a>
      </span></td></tr></table>
      <p><a href="/ohio-revised-code/section-2923.02">Cross-reference that is not a chapter index link.</a></p>`;
    expect(parseOhioChapterSectionLinks(chapter, CHAPTER_2903).map((link) => link.id))
      .toEqual(["2903.02", "2903.041"]);
  });

  it("extracts full normalized section evidence and rejects incomplete or mismatched pages", () => {
    const html = `<main><h1>Section 2903.041 <span>|</span> Unlawful termination of another's pregnancy.</h1>
      <div><div class="label">Effective:</div><div class="value">March 22, 2023</div></div>
      <section class="laws-body"><p>(A) No person shall knowingly cause.</p><p>(1) Complete statutory text.</p></section></main>`;
    const evidence = parseOhioSectionEvidence(
      html,
      "2903.041",
      `${ROOT}/section-2903.041`,
      "2026-09-16T00:00:00.000Z",
    );
    expect(evidence).toMatchObject({
      sectionId: "2903.041",
      title: "Unlawful termination of another's pregnancy",
      effectiveDate: "2023-03-22",
      status: "success",
    });
    expect(evidence?.normalizedText).toContain("(1) Complete statutory text.");
    expect(evidence?.normalizedTextSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(parseOhioSectionEvidence(
      html.replace("2903.041", "2903.042"),
      "2903.041",
      `${ROOT}/section-2903.041`,
      "2026-09-16T00:00:00.000Z",
    )).toBeNull();
    expect(parseOhioSectionEvidence(
      html.replace(/<section[\s\S]*?<\/section>/, ""),
      "2903.041",
      `${ROOT}/section-2903.041`,
      "2026-09-16T00:00:00.000Z",
    )).toBeNull();
  });

  it("refuses non-official navigation and same-host-invalid fetch redirects", async () => {
    expect(resolveOfficialOhioUrl("https://example.invalid/ohio-revised-code/title-29", ROOT)).toBeNull();
    expect(resolveOfficialOhioUrl("http://codes.ohio.gov/ohio-revised-code/title-29", ROOT)).toBeNull();

    const directory = mkdtempSync(join(tmpdir(), "ohio-discovery-"));
    const fetcher = new OhioOfficialFetcher({
      cacheDir: directory,
      minRequestIntervalMs: 0,
      maxRetries: 0,
      fetchImpl: async () => ({
        ok: true,
        status: 200,
        url: "https://example.invalid/redirected",
        headers: new Headers({ "content-type": "text/html" }),
        text: async () => "<html></html>",
      }) as unknown as Response,
    });
    try {
      await expect(fetcher.fetchPage(ROOT)).rejects.toThrow("Refusing non-official Ohio Code URL");
      expect(fetcher.metrics.failedRequests).toBe(1);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});