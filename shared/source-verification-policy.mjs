/** Scheduling policy only. Never establishes substantive legal approval. */
export const QUARTERLY_POLICY = 'quarterly-v1';
export const LEGACY_WINDOW_MS = 7 * 86400000;
export const SOURCE_POLICY_JURISDICTIONS = 'AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC US'.split(' ');
/** Three calendar months, clamped to the destination month's last day, UTC. */
export function quarterlyDeadline(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error('Invalid source verification time');
  const day = date.getUTCDate();
  date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() + 3);
  const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, last));
  return date.toISOString();
}
/** Legacy receipts retain their exact windows. Unknown policies fail closed. */
export function validVerificationWindow(receipt, oldest = receipt?.checkedAt) {
  const checked = Date.parse(receipt?.checkedAt), expires = Date.parse(receipt?.expiresAt), anchor = Date.parse(oldest);
  if (![checked, expires, anchor].every(Number.isFinite) || expires <= checked || anchor > checked) return false;
  if (receipt.verificationPolicy === undefined) return expires <= anchor + LEGACY_WINDOW_MS;
  if (receipt.verificationPolicy !== QUARTERLY_POLICY) return false;
  return expires <= Date.parse(quarterlyDeadline(anchor));
}
export function verificationSchedule(receipt, now = new Date()) {
  if (!validVerificationWindow(receipt) || Date.parse(receipt.checkedAt) > now.getTime() || !Number.isFinite(now.getTime())) return {status:'invalid', dueAt:null};
  return {status: now.getTime() >= Date.parse(receipt.expiresAt) ? 'overdue' : 'scheduled', dueAt:receipt.expiresAt,
    policy:receipt.verificationPolicy ?? 'legacy-seven-day', approval:'not_determined_by_schedule'};
}
