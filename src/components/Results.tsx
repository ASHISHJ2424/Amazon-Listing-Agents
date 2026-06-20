import type { ListingResult } from "../lib/types"
import ResultCard from "./ResultCard"

interface ResultsProps {
  result: ListingResult
}

export default function Results({ result }: ResultsProps) {
  const bulletsText = result.bullets.map((b) => `• ${b}`).join("\n")

  return (
    <div className="flex flex-col gap-4">
      <ResultCard title="Amazon Product Name" copyText={result.title}>
        <p className="text-pretty text-base font-medium leading-relaxed text-foreground">
          {result.title}
        </p>
      </ResultCard>

      <ResultCard title="Bullet Points" copyText={bulletsText}>
        <ul className="flex flex-col gap-2.5">
          {result.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-foreground">{bullet}</span>
            </li>
          ))}
        </ul>
      </ResultCard>

      <ResultCard title="Description" copyText={result.description}>
        <div className="flex flex-col gap-3">
          {result.description.split(/\n{2,}|\n/).map(
            (para, i) =>
              para.trim() && (
                <p
                  key={i}
                  className="text-pretty text-sm leading-relaxed text-foreground"
                >
                  {para.trim()}
                </p>
              ),
          )}
        </div>
      </ResultCard>

      <ResultCard title="Backend Search Terms" copyText={result.searchTerms}>
        <p className="text-pretty break-words font-mono text-sm leading-relaxed text-muted-foreground">
          {result.searchTerms}
        </p>
      </ResultCard>
    </div>
  )
}
