export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Heading */}
      <div>
        <div className="h-5 w-32 rounded bg-muted" />
        <div className="mt-1 h-4 w-48 rounded bg-muted" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-muted" />
        ))}
      </div>

      {/* Collections grid */}
      <div>
        <div className="mb-3 h-5 w-24 rounded bg-muted" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-muted" />
          ))}
        </div>
      </div>

      {/* Item rows */}
      <div>
        <div className="mb-3 h-5 w-20 rounded bg-muted" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
