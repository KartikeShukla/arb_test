import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-sm animate-pulse",
        className,
      )}
    >
      <div className="h-4 w-1/2 bg-muted rounded mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded"></div>
        <div className="h-3 bg-muted rounded w-5/6"></div>
        <div className="h-3 bg-muted rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-10 bg-muted rounded-t-md mb-1"></div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 bg-muted/50 mb-1 rounded"></div>
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 w-full animate-pulse">
      <div className="h-8 w-1/4 bg-muted rounded"></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg"></div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 h-64 bg-muted rounded-lg"></div>
        <div className="col-span-3 h-64 bg-muted rounded-lg"></div>
      </div>
    </div>
  );
}
