import decisions from './california-attorney-decisions.json';
/** Successor interpretations preserve immutable historical publication batches. */
export function californiaAttorneyDecision(id: string) {
  return decisions.find(row => row.id === id);
}
export function reviewedCaliforniaPenalty(id: string, original: string): string {
  const decision = californiaAttorneyDecision(id);
  if (!decision) return original;
  if (decision.previousPenalty !== original) throw new Error(`California decision baseline drift: ${id}`);
  return decision.penalty;
}
