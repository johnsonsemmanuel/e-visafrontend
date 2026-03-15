"use client";

function Pulse({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-border/60 ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-3">
        <Pulse className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Pulse className="h-4 w-2/3" />
          <Pulse className="h-3 w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <Pulse className="h-3 w-full" />
        <Pulse className="h-3 w-5/6" />
        <Pulse className="h-3 w-4/6" />
      </div>
    </div>
  );
}

export function MetricsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-3">
              <Pulse className="w-10 h-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Pulse className="h-3 w-1/2" />
                <Pulse className="h-6 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <Pulse className="h-5 w-32" />
        <Pulse className="h-8 w-24 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <Pulse className="h-4 w-1/4" />
            <Pulse className="h-4 w-1/4" />
            <Pulse className="h-4 w-1/6" />
            <Pulse className="h-4 w-1/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
