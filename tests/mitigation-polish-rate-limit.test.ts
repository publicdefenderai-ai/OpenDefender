import { describe, expect, it } from "vitest";
import {
  consumePolishDailyUsage,
  POLISH_DAILY_LIMIT,
  POLISH_DAILY_USAGE_STORAGE_KEY,
  readPolishDailyUsage,
} from "../client/src/lib/mitigation-polish-rate-limit";

function memoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
    key: (index) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
  };
}

describe("mitigation polish client daily limit", () => {
  it("counts requests through the configured daily limit and never beyond it", () => {
    const storage = memoryStorage();
    const date = new Date(2026, 7, 31);

    for (let count = 1; count <= POLISH_DAILY_LIMIT; count += 1) {
      expect(consumePolishDailyUsage(storage, date).count).toBe(count);
    }

    expect(consumePolishDailyUsage(storage, date).count).toBe(POLISH_DAILY_LIMIT);
    expect(readPolishDailyUsage(storage, date)).toEqual({
      dateKey: "2026-08-31",
      count: POLISH_DAILY_LIMIT,
    });
  });

  it("resets usage when the local calendar day changes", () => {
    const storage = memoryStorage();
    const firstDay = new Date(2026, 7, 31);
    const nextDay = new Date(2026, 8, 1);

    consumePolishDailyUsage(storage, firstDay);
    expect(readPolishDailyUsage(storage, nextDay)).toEqual({
      dateKey: "2026-09-01",
      count: 0,
    });
  });

  it("ignores malformed or over-limit stored values", () => {
    const storage = memoryStorage();
    const date = new Date(2026, 7, 31);
    storage.setItem(
      POLISH_DAILY_USAGE_STORAGE_KEY,
      JSON.stringify({ dateKey: "2026-08-31", count: 999 }),
    );
    expect(readPolishDailyUsage(storage, date).count).toBe(POLISH_DAILY_LIMIT);

    storage.setItem(
      POLISH_DAILY_USAGE_STORAGE_KEY,
      JSON.stringify({ dateKey: "2026-08-31", count: -1 }),
    );
    expect(readPolishDailyUsage(storage, date).count).toBe(0);
  });
});