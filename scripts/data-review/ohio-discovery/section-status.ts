/** Source interpretation at the retrieval date, not a publication/legal decision. */
export const OHIO_CHAPTER_PARSER_VERSION = 2;
export type OhioSourceStatusKind = "operative_text" | "scheduled_repeal" | "repealed" |
  "renumbered_away" | "reserved" | "not_yet_effective" | "uncertain";
export interface OhioSourceStatus {
  kind: OhioSourceStatusKind;
  asOf: string;
  transitionDate?: string;
  evidence?: { field: "catchline" | "text"; start: number; end: number; text: string };
}

export function validDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value;
}

export function interpretOhioSectionStatus(catchline: string, text: string, effectiveDate: string | null, asOf: string): OhioSourceStatus {
  if (!validDate(asOf)) throw new Error("Ohio source status requires a valid snapshot date");
  const result = (kind: OhioSourceStatusKind, field?: "catchline" | "text", match?: RegExpMatchArray, transitionDate?: string): OhioSourceStatus => ({
    kind, asOf, ...(transitionDate ? { transitionDate } : {}),
    ...(field && match ? { evidence: { field, start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length, text: match[0] } } : {}),
  });
  // Dates belong to explicit status notices, not an incidental use of a word.
  const notice = catchline.match(/\[(?:repealed|renumbered|reserved)\b[^\]]*\]|^(?:repealed|reserved)(?:\s+effective\b.*|\s*$)|^renumbered\s+(?:as|to)\b.*/i);
  const bodyNotice = text.match(/^\s*(?:repealed|reserved)(?:\s*[.]?\s*)$|^\s*renumbered\s+(?:as|to)\s+(?:section\s+|R\.C\.\s*)?\d+\.\d+\s*[.]?\s*$/i);
  const match = notice ?? bodyNotice;
  const field = notice ? "catchline" : "text";
  if (match) {
    const date = match[0].match(/\b(?:effective\s+)?(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
    const transition = date ? `${date[3]}-${date[1].padStart(2, "0")}-${date[2].padStart(2, "0")}` : undefined;
    if (transition && !validDate(transition)) return result("uncertain", field, match);
    // A status notice with an unrecognized date is not treated as already effective.
    if (!transition && /\beffective\b|\d{4}/i.test(match[0])) return result("uncertain", field, match);
    if (transition && transition > asOf) {
      if (!text.trim() || (effectiveDate && effectiveDate > asOf) || !/repealed/i.test(match[0])) {
        return result("uncertain", field, match, transition);
      }
      return result("scheduled_repeal", field, match, transition);
    }
    const kind = /repealed/i.test(match[0]) ? "repealed" : /reserved/i.test(match[0]) ? "reserved" : "renumbered_away";
    return result(kind, field, match, transition);
  }
  if (effectiveDate && !validDate(effectiveDate)) return result("uncertain");
  if (effectiveDate && effectiveDate > asOf) return result("not_yet_effective", undefined, undefined, effectiveDate);
  if (!text.trim()) return result("uncertain");
  // Former-number history and incidental words do not suppress operative text.
  return result("operative_text");
}

export function statusSuppressesDiscovery(status?: OhioSourceStatus): boolean {
  return !!status && status.kind !== "operative_text" && status.kind !== "scheduled_repeal";
}
export function statusIsInactive(status: OhioSourceStatus): boolean {
  return ["repealed", "reserved", "renumbered_away"].includes(status.kind);
}
