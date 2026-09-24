/** State-neutral: resolve only against a recorded publisher order, never numeric guesses. */
export function resolveRecordedRange(orderedIds: readonly string[], from: string, to: string) {
  if (new Set(orderedIds).size !== orderedIds.length) throw new Error("Duplicate identities in recorded range order");
  const start = orderedIds.indexOf(from), end = orderedIds.indexOf(to);
  const missing = [from, to].filter(id => !orderedIds.includes(id));
  if (missing.length) return { status: "missing_endpoint" as const, members: [] as string[], missing };
  if (start > end) return { status: "reversed_order" as const, members: [] as string[], missing };
  return { status: "bounded_by_recorded_order" as const, members: orderedIds.slice(start, end + 1), missing };
}
