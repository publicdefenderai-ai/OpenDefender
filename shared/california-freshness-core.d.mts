export const CALIFORNIA_ARCHIVE: Readonly<{url: string; sha256: string; bytes: number; acquiredAt: string}>;
export const CALIFORNIA_MAX_AGE_MS: number;
export function californiaReceiptStatus(receipt: unknown, now?: Date): "current" | "stale" | "invalid";
