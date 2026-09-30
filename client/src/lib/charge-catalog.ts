/** Load the complete matching catalog before making any choices available.
 * A failed or changed page rejects the entire result, never a partial catalog.
 */
export async function fetchChargeCatalog<T extends { id: string } = { id: string }>(
  filters: Record<string, string>, signal?: AbortSignal,
): Promise<{ charges: T[]; count: number; totalAvailable: number }> {
  const params = new URLSearchParams(filters);
  params.set("limit", "500");
  params.delete("snapshot");
  const charges: T[] = [];
  const ids = new Set<string>();
  let offset = 0;
  let snapshot: string | undefined;
  let totalMatches: number | undefined;
  let totalAvailable: number | undefined;
  // Bound requests even if a broken server advertises an endless catalog.
  for (let page = 0; page < 100; page++) {
    params.set("offset", String(offset));
    if (snapshot) params.set("snapshot", snapshot);
    const response = await fetch(`/api/criminal-charges?${params}`, { signal });
    if (!response.ok) throw new Error("Current charge catalog could not be loaded");
    const body = await response.json();
    const p = body.pagination;
    if (body.success !== true || !Array.isArray(body.charges) || !p ||
        p.offset !== offset || p.limit !== 500 ||
        !Number.isSafeInteger(p.totalMatches) || p.totalMatches < 0 || p.totalMatches > 50000 ||
        !Number.isSafeInteger(body.totalAvailable) || body.totalAvailable < p.totalMatches ||
        typeof p.snapshot !== "string" || !/^[a-f0-9]{64}$/.test(p.snapshot) ||
        (snapshot !== undefined && (snapshot !== p.snapshot || totalMatches !== p.totalMatches || totalAvailable !== body.totalAvailable)) ||
        body.count !== body.charges.length || body.charges.length !== Math.min(500, p.totalMatches - offset)) {
      throw new Error("Incomplete or changed charge catalog");
    }
    snapshot = p.snapshot;
    totalMatches = p.totalMatches;
    totalAvailable = body.totalAvailable;
    for (const charge of body.charges) {
      if (!charge || typeof charge.id !== "string" || !charge.id || ids.has(charge.id)) {
        throw new Error("Invalid or duplicate charge identity");
      }
      ids.add(charge.id);
      charges.push(charge);
    }
    const end = offset + body.charges.length;
    if (p.nextOffset !== (end < p.totalMatches ? end : null)) throw new Error("Invalid charge page continuation");
    if (p.nextOffset === null) return { charges, count: charges.length, totalAvailable: body.totalAvailable };
    offset = p.nextOffset;
  }
  throw new Error("Charge catalog exceeded the request bound");
}
