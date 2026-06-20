const SKELETON = ["SEO Title", "Bullet Points", "Description", "Search Terms"]

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-muted-foreground">
        <span
          className="loading-dot h-2 w-2 rounded-full bg-primary"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="loading-dot h-2 w-2 rounded-full bg-primary"
          style={{ animationDelay: "0.15s" }}
        />
        <span
          className="loading-dot h-2 w-2 rounded-full bg-primary"
          style={{ animationDelay: "0.3s" }}
        />
        <span className="ml-2">Generating your listing</span>
      </div>

      {SKELETON.map((label) => (
        <div
          key={label}
          className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6"
        >
          <div className="mb-4 h-3 w-28 animate-pulse rounded bg-muted" />
          <div className="flex flex-col gap-2.5">
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
