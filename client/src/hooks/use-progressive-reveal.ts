import { useState, useEffect, useRef } from "react";

interface UseProgressiveRevealOptions {
  initialCount?: number;
  batchSize?: number;
  batchDelayMs?: number;
}

export function useProgressiveReveal<T>(
  items: T[],
  options: UseProgressiveRevealOptions = {}
) {
  const {
    initialCount = 5,
    batchSize = 3,
    batchDelayMs = 100,
  } = options;

  const [visibleCount, setVisibleCount] = useState(initialCount);
  const prevLengthRef = useRef(items.length);

  useEffect(() => {
    if (items.length < prevLengthRef.current) {
      setVisibleCount(initialCount);
    }
    prevLengthRef.current = items.length;
  }, [items.length, initialCount]);

  useEffect(() => {
    if (visibleCount >= items.length) return;

    const timer = setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + batchSize, items.length));
    }, batchDelayMs);

    return () => clearTimeout(timer);
  }, [visibleCount, items.length, batchSize, batchDelayMs]);

  const effectiveVisibleCount = Math.min(visibleCount, items.length);
  const hiddenCount = Math.max(0, items.length - effectiveVisibleCount);
  const visibleItems = hiddenCount > 0 ? items.slice(hiddenCount) : items;

  return {
    visibleItems,
    pendingCount: hiddenCount,
    isFullyRevealed: hiddenCount === 0,
  };
}
