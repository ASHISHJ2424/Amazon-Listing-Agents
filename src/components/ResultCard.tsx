import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface ResultCardProps {
  title: string
  copyText: string
  /** Current usage count (characters or bytes) */
  count?: number
  /** Amazon maximum for this field */
  limit?: number
  children: React.ReactNode
}

export default function ResultCard({
  title,
  copyText,
  count,
  limit,
  children,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="animate-rise rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h2>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${title}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-border/60"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-primary" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      {children}
    </section>
  )
}
