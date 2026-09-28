import transitions from './california-source-transitions.json';
/** A fresh download cannot approve a known future operative change. */
export function californiaTransitionRequiresReview(requiredKeys: readonly string[], now: Date): boolean {
  return transitions.some(row => requiredKeys.includes(row.key) && now.getTime() >= Date.parse(`${row.reviewBefore}T00:00:00-08:00`));
}
