import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { refreshOhioChapter2903Pilot } from "../scripts/data-review/refresh-ohio-chapter-2903-pilot";
import { validateOhioChapter2903RefreshReceipt } from "../server/data/ohio-chapter-2903-refresh";

describe("Ohio pilot live refresh revocation", () => {
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
  });

  it("rejects malformed receipts without throwing", () => {
    for (const value of [null, undefined, [], {}, { documents: [null] }]) {
      expect(validateOhioChapter2903RefreshReceipt(value)).not.toBeNull();
    }
  });
});