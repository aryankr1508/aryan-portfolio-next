function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-3 animate-pulse rounded-full bg-slate-800 ${className}`}
    />
  );
}

export default function AdminPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading admin page" className="space-y-7">
      <div className="space-y-3">
        <SkeletonLine className="w-28" />
        <SkeletonLine className="h-8 w-64" />
        <SkeletonLine className="w-full max-w-2xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <div className="h-9 w-9 rounded-xl bg-slate-800" />
            <div className="mt-5 h-7 w-16 rounded-lg bg-slate-800" />
            <div className="mt-3 h-3 w-28 rounded-full bg-slate-800" />
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="h-56 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
          />
        ))}
      </div>
    </div>
  );
}
