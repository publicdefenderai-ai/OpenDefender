import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-xl border border-border/50 p-6 space-y-4", className)}>
      <div className="flex items-center gap-4">
        <div className="skeleton-avatar" />
        <div className="flex-1 space-y-2">
          <div className="skeleton-title w-3/4" />
          <div className="skeleton-text-sm w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton-text w-full" />
        <div className="skeleton-text w-5/6" />
        <div className="skeleton-text w-4/6" />
      </div>
    </div>
  );
}

export function ListItemSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("flex items-center gap-4 p-4 rounded-lg border border-border/30", className)}>
      <div className="skeleton-avatar" />
      <div className="flex-1 space-y-2">
        <div className="skeleton-text w-2/3" />
        <div className="skeleton-text-sm w-1/2" />
      </div>
      <div className="skeleton-button w-20" />
    </div>
  );
}

export function TextBlockSkeleton({ lines = 3, className }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "skeleton-text",
            i === lines - 1 ? "w-4/6" : i % 2 === 0 ? "w-full" : "w-5/6"
          )} 
        />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ columns = 4, className }: SkeletonProps & { columns?: number }) {
  return (
    <div className={cn("flex items-center gap-4 p-4 border-b border-border/30", className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "skeleton-text",
            i === 0 ? "w-1/4" : "flex-1"
          )} 
        />
      ))}
    </div>
  );
}

export function GridSkeleton({ 
  count = 6, 
  columns = 3,
  className 
}: SkeletonProps & { count?: number; columns?: number }) {
  return (
    <div className={cn(
      "grid gap-6",
      columns === 2 && "md:grid-cols-2",
      columns === 3 && "md:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "md:grid-cols-2 lg:grid-cols-4",
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SearchResultsSkeleton({ count = 5, className }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  );
}
