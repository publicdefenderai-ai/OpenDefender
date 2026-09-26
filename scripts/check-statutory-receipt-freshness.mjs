/** Read-only deadline alarm. Does not validate legal content or renew evidence. */
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED = ["ohio-chapter-2903-refresh-receipt.json", "ohio-reviewed-refresh-receipt.json", "florida-reviewed-refresh-receipt.json"];
export function checkStatutoryReceipts(root = process.cwd(), now = new Date()) {
  if (!Number.isFinite(now.getTime())) throw new Error("Invalid check time");
  const directory = resolve(root, "scripts/data-review/output");
  // Explicit required receipts catch deletion; discovery covers future receipts too.
  const names = [...new Set([...REQUIRED, ...readdirSync(directory).filter(name => name.endsWith("-refresh-receipt.json"))])].sort();
  const receipts = names.map(name => {
    try {
      const receipt = JSON.parse(readFileSync(resolve(directory, name), "utf8"));
      const checkedAt = Date.parse(receipt.checkedAt), expiresAt = Date.parse(receipt.expiresAt);
      if (typeof receipt.checkedAt !== "string" || typeof receipt.expiresAt !== "string" || !Number.isFinite(checkedAt) || !Number.isFinite(expiresAt) || checkedAt > now.getTime() || expiresAt <= checkedAt) throw new Error("Invalid receipt dates");
      const remainingHours = (expiresAt - now.getTime()) / 3_600_000;
      return { name, expiresAt: receipt.expiresAt, remainingHours, status: remainingHours <= 0 ? "expired" : remainingHours <= 48 ? "due" : "current" };
    } catch {
      return { name, expiresAt: null, remainingHours: null, status: "invalid_or_missing" };
    }
  });
  return { checkedAt: now.toISOString(), leadHours: 48, ok: receipts.every(row => row.status === "current"), receipts };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const report = checkStatutoryReceipts();
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.ok ? 0 : 1;
  } catch (error) {
    console.error(`Statutory receipt monitor failed: ${error.message}`);
    process.exitCode = 1;
  }
}
