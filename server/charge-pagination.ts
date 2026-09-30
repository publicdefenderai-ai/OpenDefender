import { createHash } from "node:crypto";

export function parseChargePagination(query: { limit?: unknown; offset?: unknown; snapshot?: unknown }) {
  const integer = (value: unknown, fallback: number, minimum: number) => {
    if (value === undefined) return fallback;
    if (typeof value !== "string" || !/^\d+$/.test(value)) throw new Error("Invalid charge pagination");
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed) || parsed < minimum) throw new Error("Invalid charge pagination");
    return parsed;
  };
  const limit = Math.min(integer(query.limit, 200, 1), 500);
  const offset = integer(query.offset, 0, 0);
  const snapshot = query.snapshot;
  if ((snapshot !== undefined && (typeof snapshot !== "string" || !/^[a-f0-9]{64}$/.test(snapshot))) ||
      (offset > 0 && snapshot === undefined)) throw new Error("Invalid charge pagination");
  return { limit, offset, snapshot: snapshot as string | undefined };
}

/** Bind pages to the same filtered, authority-gated content and display language.
 * This is a consistency token, not authorization: every request rechecks authority.
 */
export function paginateCharges<T>(charges: T[], totalAvailable: number, language: string, request: ReturnType<typeof parseChargePagination>) {
  const snapshot = createHash("sha256").update(JSON.stringify({ charges, totalAvailable, language })).digest("hex");
  if (request.snapshot !== undefined && request.snapshot !== snapshot) return null;
  const page = charges.slice(request.offset, request.offset + request.limit);
  const end = request.offset + page.length;
  return {
    charges: page,
    pagination: {
      offset: request.offset, limit: request.limit, totalMatches: charges.length,
      nextOffset: end < charges.length ? end : null, snapshot,
    },
  };
}
