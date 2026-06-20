import { useEffect, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"

const PLACEHOLDERS = [
  "Describe your product...",
  "Stainless steel water bottle",
  "Wireless gaming headset",
  "Organic green tea pack",
  "Leather laptop sleeve",
  "Yoga mat with strap",
  "Ceramic coffee mug set",
]

interface PromptInputProps {
  onSubmit: (value: string) => void
  loading: boolean
}

export default function PromptInput({ onSubmit, loading }: PromptInputProps) {
  const [value, setValue] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Rotate placeholders
  useEffect(() => {
    if (value.length > 0) return
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length)
    }, 2600)
    return () => clearInterval(id)
  }, [value])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`
  }, [value])

  const canSubmit = value.trim().length > 0 && !loading

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit(value.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="w-full">
      <div className="relative flex items-end gap-2 rounded-[1.75rem] border border-border bg-input p-2 shadow-sm transition-shadow focus-within:border-foreground/20 focus-within:shadow-md">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
            aria-label="Product details"
            className="block w-full resize-none bg-transparent px-3 py-2.5 text-base leading-relaxed text-foreground outline-none placeholder:text-transparent disabled:opacity-60"
          />
          {value.length === 0 && (
            <div
              className="pointer-events-none absolute inset-0 flex items-start px-3 py-2.5"
              aria-hidden="true"
            >
              <span
                key={placeholderIndex}
                className="text-base leading-relaxed text-muted-foreground"
                style={{ animation: "placeholder-fade 2.6s ease-in-out" }}
              >
                {PLACEHOLDERS[placeholderIndex]}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          aria-label="Generate listing"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted-foreground/30 disabled:text-background"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>
      <p className="mt-2 px-2 text-center text-xs text-muted-foreground">
        Paste your raw product details — title, dimensions, material &amp; more.
      </p>
    </div>
  )
}
