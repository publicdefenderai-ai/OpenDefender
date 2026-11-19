import { createHash } from "node:crypto";
import californiaReceipt from "../scripts/data-review/output/california-archive-refresh-receipt.json";
import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// @ts-expect-error Dependency-free operational script is intentionally plain Node.
import { checkStatutoryReceipts } from "../scripts/check-statutory-receipt-freshness.mjs";
import { requiredReceipts } from "../scripts/data-review/publication-batches.mjs";
const names = requiredReceipts.filter(name => name !== "california-archive-refresh-receipt.json");
function withReceipts(run: (root: string, dir: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "receipt-monitor-"));
  const dir = join(root, "scripts/data-review/output"); mkdirSync(dir, { recursive: true });
  for (const name of names) writeFileSync(join(dir, name), JSON.stringify({ checkedAt: "2026-09-24T00:00:00Z", expiresAt: "2026-10-01T00:00:00Z" }));
  writeFileSync(join(dir, "california-archive-refresh-receipt.json"), JSON.stringify({ ...californiaReceipt, verificationPolicy: undefined, status: "matched", method: "original_acquisition", checkedAt: "2026-09-24T22:10:49.174Z", expiresAt: "2026-10-01T22:10:49.174Z" }));

  const hash = (v:unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
  const documents = [{sourceKey:'fl:statute:1.01',contentHash:'a'.repeat(64),retrievedAt:'2026-09-24T00:00:00Z'}];
  const report = {sourceEvidence:{'fl:statute:1.01':documents[0]}};
  const eligibility = {reportHash:hash(report),decisions:[]};
  mkdirSync(join(root,'shared'),{recursive:true});
  writeFileSync(join(dir,'florida-reviewed-analysis.json'),JSON.stringify(report));
  writeFileSync(join(root,'shared/florida-reviewed-eligibility.json'),JSON.stringify(eligibility));
  writeFileSync(join(dir,'florida-reviewed-refresh-receipt.json'),JSON.stringify({checkedAt:'2026-09-24T00:00:00Z',expiresAt:'2026-10-01T00:00:00Z',reportHash:hash(report),eligibilityHash:hash(eligibility),documents}));
  try { run(root, dir); } finally { rmSync(root, { recursive: true, force: true }); }
}
describe("statutory receipt deadline alarm", () => {
  it("alarms exactly at 48 hours, including at and after expiry", () => withReceipts(root => {
    expect(checkStatutoryReceipts(root, new Date("2026-09-28T23:59:59.999Z")).ok).toBe(true);
    expect(checkStatutoryReceipts(root, new Date("2026-09-29T00:00:00Z")).ok).toBe(false);
    expect(checkStatutoryReceipts(root, new Date("2026-10-02T00:00:00Z")).receipts.every((r: any) => r.status === "expired")).toBe(true);
  }));
  it("alarms at fourteen days for a quarterly receipt independently of other states", () => withReceipts((root, dir) => {
    writeFileSync(join(dir, "california-archive-refresh-receipt.json"), JSON.stringify({
      ...californiaReceipt, method: "original_acquisition", verificationPolicy: "quarterly-v1",
      checkedAt: "2026-09-24T22:10:49.174Z", expiresAt: "2026-12-24T22:10:49.174Z",
    }));
    const state = (instant: string) => checkStatutoryReceipts(root, new Date(instant)).receipts
      .find((row: any) => row.name === "california-archive-refresh-receipt.json").status;
    expect(state("2026-12-10T22:10:49.173Z")).toBe("current");
    expect(state("2026-12-10T22:10:49.174Z")).toBe("due");
    expect(state("2026-12-24T22:10:49.174Z")).toBe("expired");
  }));
  it("does not silently pass missing, malformed, or future-dated receipts", () => withReceipts((root, dir) => {
    for (const name of names.filter((_, index) => index !== 1 && index !== 2))
      rmSync(join(dir, name));
    writeFileSync(join(dir, names[1]), "not json");
    writeFileSync(join(dir, names[2]), JSON.stringify({ checkedAt: "2026-10-02", expiresAt: "2026-10-01" }));
    rmSync(join(dir, "california-archive-refresh-receipt.json"));
    const report = checkStatutoryReceipts(root, new Date("2026-09-26"));
    expect(report.ok).toBe(false);
    expect(report.receipts.every((r: any) => r.status === "invalid_or_missing")).toBe(true);
  }));
  it("discovers a new jurisdiction receipt without removing the required ones", () => withReceipts((root, dir) => {
    writeFileSync(join(dir, "new-state-refresh-receipt.json"), JSON.stringify({ checkedAt: "2026-09-24", expiresAt: "2026-09-25" }));
    const report = checkStatutoryReceipts(root, new Date("2026-09-26"));
    expect(report.receipts).toHaveLength(names.length + 2); expect(report.ok).toBe(false);
  }));
});

it('does not call an unexpired Florida receipt current after its report binding changes',()=>withReceipts((root,dir)=>{
  const now=new Date('2026-09-26T00:00:00Z');
  const row=()=>checkStatutoryReceipts(root,now).receipts.find((r:any)=>r.name==='florida-reviewed-refresh-receipt.json');
  expect(row()).toMatchObject({status:'current',dateStatus:'current',bindingStatus:'matched'});
  writeFileSync(join(dir,'florida-reviewed-analysis.json'),JSON.stringify({sourceEvidence:{},changed:true}));
  expect(row()).toMatchObject({status:'binding_mismatch',dateStatus:'current',bindingStatus:'mismatched_or_missing'});
  expect(checkStatutoryReceipts(root,now).ok).toBe(false);
  expect(checkStatutoryReceipts(root,now).receipts.find((r:any)=>r.name==='ohio-reviewed-refresh-receipt.json').bindingStatus).toBe('not_checked');
}));
