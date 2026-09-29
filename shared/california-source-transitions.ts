import transitions from './california-source-transitions.json';
import pins from './california-retained-pins.json';
import {californiaLawCode} from './california-law-codes';

/** Validate the entire inventory, including entries not used by the current request. */
export function validateCaliforniaSourceTransitions(input: unknown, knownKeys: readonly string[] = Object.keys(pins)) {
  if (!Array.isArray(input)) throw new Error('Invalid California transition inventory');
  const seen = new Set<string>();
  return input.map(row => {
    if (!row || typeof row !== 'object' || typeof row.key !== 'string' ||
        !/^[A-Z]+:\d+(?:\.\d+)*[a-z]*$/.test(row.key)) throw new Error('Invalid California transition key');
    californiaLawCode(row.key.split(':')[0]);
    // Syntax alone cannot catch a mistyped but plausible section number.
    if (!knownKeys.includes(row.key) || seen.has(row.key)) throw new Error('Unknown or duplicate California transition key');
    seen.add(row.key);
    if (typeof row.reviewBefore !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(row.reviewBefore)) throw new Error('Invalid California transition date');
    const date = Date.parse(`${row.reviewBefore}T00:00:00Z`);
    if (!Number.isFinite(date) || new Date(date).toISOString().slice(0, 10) !== row.reviewBefore) throw new Error('Invalid California transition date');
    if (typeof row.reason !== 'string' || !row.reason.trim()) throw new Error('Missing California transition reason');
    // Resolve California midnight, including summer dates. At 08:00 UTC Los Angeles
    // is at 00:00 or 01:00; subtracting that hour also handles DST transition days.
    const probe = date + 8 * 60 * 60 * 1000;
    const localHour = Number(new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles', hour: 'numeric', hourCycle: 'h23',
    }).format(new Date(probe)));
    if (localHour !== 0 && localHour !== 1) throw new Error('Unsupported California transition timezone offset');
    return {key: row.key as string, reviewAt: probe - localHour * 60 * 60 * 1000};
  });
}
const validatedTransitions = validateCaliforniaSourceTransitions(transitions);
/** A fresh download cannot approve a known future operative change. */
export function californiaTransitionRequiresReview(requiredKeys: readonly string[], now: Date): boolean {
  if (!Number.isFinite(now.getTime())) return true;
  return validatedTransitions.some(row => requiredKeys.includes(row.key) && now.getTime() >= row.reviewAt);
}
