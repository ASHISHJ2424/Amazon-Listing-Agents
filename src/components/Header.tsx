export default function Header() {
  return (
    <header className="flex flex-col items-center text-center">
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        AI-Powered · Amazon SEO
      </span>
      <h1 className="animate-title text-balance text-4xl font-bold tracking-tight sm:text-5xl">
        Amazon Listing Agent
      </h1>
      <p className="mt-3 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
        Generate Amazon-ready listings in seconds.
      </p>
    </header>
  )
}
