import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// @ts-expect-error Dependency-free operational script is intentionally plain Node.
import { checkStatutoryReceipts } from "../scripts/check-statutory-receipt-freshness.mjs";
const names = ["ohio-chapter-2903-refresh-receipt.json", "ohio-reviewed-refresh-receipt.json", "florida-reviewed-refresh-receipt.json"];
function withReceipts(run: (root: string, dir: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "receipt-monitor-"));
  const dir = join(root, "scripts/data-review/output"); mkdirSync(dir, { recursive: true });
  for (const name of names) writeFileSync(join(dir, name), JSON.stringify({ checkedAt: "2026-09-24T00:00:00Z", expiresAt: "2026-10-01T00:00:00Z" }));
  try { run(root, dir); } finally { rmSync(root, { recursive: true, force: true }); }
}
describe("statutory receipt deadline alarm", () => {
  it("alarms exactly at 48 hours, including at and after expiry", () => withReceipts(root => {
    expect(checkStatutoryReceipts(root, new Date("2026-09-28T23:59:59.999Z")).ok).toBe(true);
    expect(checkStatutoryReceipts(root, new Date("2026-09-29T00:00:00Z")).ok).toBe(false);
    expect(checkStatutoryReceipts(root, new Date("2026-10-01T00:00:00Z")).receipts.every((r: any) => r.status === "expired")).toBe(true);
  }));
  it("does not silently pass missing, malformed, or future-dated receipts", () => withReceipts((root, dir) => {
    rmSync(join(dir, names[0]));
    writeFileSync(join(dir, names[1]), "not json");
    writeFileSync(join(dir, names[2]), JSON.stringify({ checkedAt: "2026-10-02", expiresAt: "2026-10-01" }));
    const report = checkStatutoryReceipts(root, new Date("2026-09-26"));
    expect(report.ok).toBe(false);
    expect(report.receipts.every((r: any) => r.status === "invalid_or_missing")).toBe(true);
  }));
  it("discovers a new jurisdiction receipt without removing the required ones", () => withReceipts((root, dir) => {
    writeFileSync(join(dir, "new-state-refresh-receipt.json"), JSON.stringify({ checkedAt: "2026-09-24", expiresAt: "2026-09-25" }));
    const report = checkStatutoryReceipts(root, new Date("2026-09-26"));
    expect(report.receipts).toHaveLength(4); expect(report.ok).toBe(false);
  }));
});
