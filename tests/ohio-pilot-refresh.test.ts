import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { refreshOhioChapter2903Pilot } from "../scripts/data-review/refresh-ohio-chapter-2903-pilot";
import { compareOhioChapter2903Sources } from "../server/data/ohio-chapter-2903-comparison";
import { validateOhioChapter2903RefreshReceipt } from "../server/data/ohio-chapter-2903-refresh";
import {
  OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS,
  ohioChapter2903Evidence,
  type OhioChapter2903OfficialDocument,
} from "../server/data/ohio-chapter-2903-source";

function expectedDocuments() {
  const documents = new Map<string, (typeof OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS)[number]["offense"]>();
  for (const record of OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS) {
    for (const { document } of ohioChapter2903Evidence(record)) {
      documents.set(document.section, document);
    }
  }
  return documents;
}

function officialPage(document: OhioChapter2903OfficialDocument, suffix = ""): string {
  const [heading, , effectiveDate, ...body] = document.text.split("\n");
  const date = new Date(`${effectiveDate.replace("Effective: ", "")}T00:00:00Z`);
  const formattedDate = date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `<h1>${heading}</h1><div class="label">Effective:</div><div class="value">${formattedDate}</div><section class="laws-body">${document.title}.<br>${body.join("<br>")}${suffix}</section>`;
}

describe("Ohio pilot live refresh revocation", () => {
  it("compares the full normalized text and includes the 2929.02 dependency", async () => {
    const documents = expectedDocuments();
    const result = await compareOhioChapter2903Sources((async (url: string) => {
      const section = url.match(/section-(.+)$/)?.[1] ?? "";
      const document = documents.get(section);
      return new Response(document ? officialPage(document) : "missing", {
        status: document ? 200 : 404,
      });
    }) as typeof fetch);

    expect(result.errors).toEqual([]);
    expect(result.receipt).not.toBeNull();
    const penaltyEvidence = result.evidence.find((item) => item.section === "2929.02");
    expect(penaltyEvidence?.observed?.text).toBe(documents.get("2929.02")?.text);
    expect(penaltyEvidence?.observed?.hash).toBe(documents.get("2929.02")?.contentHash);
    expect(penaltyEvidence?.observed?.title).toBe("Murder penalties");
    expect(penaltyEvidence?.observed?.effectiveDate).toBe("2021-04-12");
    expect(penaltyEvidence?.observed?.sourceUrl).toBe(
      "https://codes.ohio.gov/ohio-revised-code/section-2929.02",
    );
  });

  it("reports exact changed-section evidence without updating the pin", async () => {
    const documents = expectedDocuments();
    const result = await compareOhioChapter2903Sources((async (url: string) => {
      const section = url.match(/section-(.+)$/)?.[1] ?? "";
      const document = documents.get(section);
      return new Response(document
        ? officialPage(document, section === "2903.02" ? "<br>Changed official text." : "")
        : "missing", { status: document ? 200 : 404 });
    }) as typeof fetch);

    const changed = result.evidence.find((item) => item.section === "2903.02");
    expect(result.receipt).toBeNull();
    expect(result.errors.some((error) => error.includes("2903.02"))).toBe(true);
    expect(changed?.expected.text).toBe(documents.get("2903.02")?.text);
    expect(changed?.observed?.text).toContain("Changed official text.");
    expect(changed?.observed?.hash).not.toBe(changed?.expected.hash);
  });

  it.each([
    ["unavailable", new Response("Unavailable", { status: 503 })],
    ["changed content", new Response("<html>Changed official source</html>", { status: 200 })],
  ])("revokes an earlier receipt after %s, rather than leaving it usable", async (_label, response) => {
    const directory = mkdtempSync(join(tmpdir(), "ohio-pilot-refresh-"));
    const receiptPath = join(directory, "receipt.json");
    try {
      writeFileSync(receiptPath, JSON.stringify({ priorApproval: true }));
      await expect(refreshOhioChapter2903Pilot(
        (async () => response.clone()) as typeof fetch,
        receiptPath,
      )).rejects.toThrow();
      const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
      expect(receipt.status).toBe("blocked");
      expect(receipt.priorApproval).toBeUndefined();
      expect(validateOhioChapter2903RefreshReceipt(receipt)).not.toBeNull();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }, 20_000);

  it("rejects malformed receipts without throwing", () => {
    for (const value of [null, undefined, [], {}, { documents: [null] }]) {
      expect(validateOhioChapter2903RefreshReceipt(value)).not.toBeNull();
    }
  });
});