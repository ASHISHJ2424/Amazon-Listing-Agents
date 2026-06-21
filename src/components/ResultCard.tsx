import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface ResultCardProps {
  title: string
  copyText: string
  children: React.ReactNode
}

export default function ResultCard(props: ResultCardProps) {
  const { title, copyText, children } = props

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="rounded-xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 border rounded px-3 py-1"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div>{children}</div>
    </section>
  )
}
