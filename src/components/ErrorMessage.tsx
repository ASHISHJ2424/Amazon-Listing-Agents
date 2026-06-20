import { AlertTriangle, RotateCw } from "lucide-react"

interface ErrorMessageProps {
  message: string
  onRetry: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="animate-rise rounded-2xl border border-border bg-background p-6 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <AlertTriangle className="h-5 w-5 text-primary" />
      </div>
      <h2 className="text-base font-semibold text-foreground">
        Couldn&apos;t generate the listing
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <RotateCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  )
}
