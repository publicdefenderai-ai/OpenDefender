import { useState, useEffect } from "react";
import { CardSkeleton, GridSkeleton, TextBlockSkeleton } from "./loading-skeletons";

interface DeferredContentProps {
  children: React.ReactNode;
  delay?: number;
  skeleton?: "card" | "grid" | "text" | "custom";
  customSkeleton?: React.ReactNode;
  gridCount?: number;
  gridColumns?: number;
  textLines?: number;
}

export function DeferredContent({
  children,
  delay = 100,
  skeleton = "card",
  customSkeleton,
  gridCount = 6,
  gridColumns = 3,
  textLines = 3,
}: DeferredContentProps) {
  const [isReady, setIsReady] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!isReady) {
    if (customSkeleton) {
      return <>{customSkeleton}</>;
    }

    switch (skeleton) {
      case "grid":
        return <GridSkeleton count={gridCount} columns={gridColumns} />;
      case "text":
        return <TextBlockSkeleton lines={textLines} />;
      case "card":
      default:
        return <CardSkeleton />;
    }
  }

  return <>{children}</>;
}

interface ProgressiveListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  initialCount?: number;
  batchSize?: number;
  batchDelay?: number;
  skeleton?: React.ReactNode;
  keyExtractor: (item: T) => string;
}

export function ProgressiveList<T>({
  items,
  renderItem,
  initialCount = 6,
  batchSize = 6,
  batchDelay = 150,
  skeleton,
  keyExtractor,
}: ProgressiveListProps<T>) {
  const [visibleCount, setVisibleCount] = useState(Math.min(initialCount, items.length));

  useEffect(() => {
    if (visibleCount >= items.length) return;

    const timer = setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + batchSize, items.length));
    }, batchDelay);

    return () => clearTimeout(timer);
  }, [visibleCount, items.length, batchSize, batchDelay]);

  const visibleItems = items.slice(0, visibleCount);
  const remainingCount = items.length - visibleCount;

  return (
    <>
      {visibleItems.map((item, index) => (
        <div key={keyExtractor(item)}>{renderItem(item, index)}</div>
      ))}
      {remainingCount > 0 && skeleton && (
        <>
          {Array.from({ length: Math.min(remainingCount, batchSize) }).map((_, i) => (
            <div key={`skeleton-${i}`}>{skeleton}</div>
          ))}
        </>
      )}
    </>
  );
}

interface CriticalContentProps {
  children: React.ReactNode;
  priority?: "high" | "normal" | "low";
}

export function CriticalContent({ children, priority = "high" }: CriticalContentProps) {
  const delay = priority === "high" ? 0 : priority === "normal" ? 50 : 150;
  
  return <DeferredContent delay={delay}>{children}</DeferredContent>;
}
