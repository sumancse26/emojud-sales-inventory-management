export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800/60 ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#0d1729] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        ))}
      </div>
      {/* Chart */}
      <Skeleton className="h-64 w-full" />
      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {[0, 1].map(i => (
          <div key={i} className="bg-white dark:bg-[#0d1729] rounded-2xl border border-slate-200/80 dark:border-slate-800/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/50">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, r) => (
                <div key={r} className="flex gap-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 flex-1" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
