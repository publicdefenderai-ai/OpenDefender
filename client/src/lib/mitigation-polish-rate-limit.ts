export const POLISH_DAILY_LIMIT = 20;
export const POLISH_DAILY_USAGE_STORAGE_KEY =
  "opendefender:mitigation-polish-daily-usage";

export interface PolishDailyUsage {
  dateKey: string;
  count: number;
}

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function readPolishDailyUsage(
  storage: StorageLike | null | undefined,
  date = new Date(),
): PolishDailyUsage {
  const dateKey = getLocalDateKey(date);
  if (!storage) return { dateKey, count: 0 };

  try {
    const raw = storage.getItem(POLISH_DAILY_USAGE_STORAGE_KEY);
    if (!raw) return { dateKey, count: 0 };
    const parsed = JSON.parse(raw) as { dateKey?: unknown; count?: unknown };
    if (
      parsed.dateKey !== dateKey ||
      !Number.isInteger(parsed.count) ||
      (parsed.count as number) < 0
    ) {
      return { dateKey, count: 0 };
    }
    return {
      dateKey,
      count: Math.min(parsed.count as number, POLISH_DAILY_LIMIT),
    };
  } catch {
    return { dateKey, count: 0 };
  }
}

export function consumePolishDailyUsage(
  storage: StorageLike | null | undefined,
  date = new Date(),
): PolishDailyUsage {
  const current = readPolishDailyUsage(storage, date);
  if (current.count >= POLISH_DAILY_LIMIT) return current;

  const next = { dateKey: current.dateKey, count: current.count + 1 };
  try {
    storage?.setItem(POLISH_DAILY_USAGE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The server-side limiter remains authoritative if browser storage is unavailable.
  }
  return next;
}