import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

// Basic skeleton element
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton", className)} />;
}

// Text line skeleton
export function SkeletonLine({ className }: SkeletonProps) {
  return <div className={cn("skeleton-line", className)} />;
}

// Short text line skeleton
export function SkeletonLineShort({ className }: SkeletonProps) {
  return <div className={cn("skeleton-line-short", className)} />;
}

// Heading skeleton
export function SkeletonHeading({ className }: SkeletonProps) {
  return <div className={cn("skeleton-heading", className)} />;
}

// Circle skeleton (for avatars)
export function SkeletonCircle({ className, size = "md" }: SkeletonProps & { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };
  return <div className={cn("skeleton-circle", sizeClasses[size], className)} />;
}

// Card skeleton
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-xl border p-6 space-y-4", className)}>
      <div className="flex items-center gap-4">
        <SkeletonCircle size="md" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonLine />
        <SkeletonLineShort />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

// Search result skeleton
export function SkeletonSearchResult({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-lg border p-4 space-y-3", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonLine />
        <SkeletonLineShort />
      </div>
    </div>
  );
}

// List skeleton
export function SkeletonList({ count = 3, className }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonSearchResult key={i} />
      ))}
    </div>
  );
}

// Table skeleton
export function SkeletonTable({ rows = 5, cols = 4, className }: SkeletonProps & { rows?: number; cols?: number }) {
  return (
    <div className={cn("rounded-lg border overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-muted/50 p-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="p-4 flex gap-4 border-t">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Form skeleton
export function SkeletonForm({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  );
}

// Hero section skeleton
export function SkeletonHero({ className }: SkeletonProps) {
  return (
    <div className={cn("text-center py-12 space-y-6", className)}>
      <SkeletonCircle size="lg" className="mx-auto" />
      <Skeleton className="h-10 w-2/3 mx-auto" />
      <Skeleton className="h-6 w-1/2 mx-auto" />
    </div>
  );
}
