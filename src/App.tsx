import { useState } from "react"
import Header from "./components/Header"
import PromptInput from "./components/PromptInput"
import Results from "./components/Results"
import Loading from "./components/Loading"
import ErrorMessage from "./components/ErrorMessage"
import { generateListing } from "./lib/gemini"
import type { ListingResult } from "./lib/types"
import { auth, provider, db } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
type Status = "idle" | "loading" | "success" | "error"

export default function App() {
  const [status, setStatus] = useState<Status>("idle")
  const [result, setResult] = useState<ListingResult | null>(null)
const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("")
  const [lastInput, setLastInput] = useState("")

  const handleGenerate = async (input: string) => {
    setStatus("loading")
    setResult(null)
    setError("")
    setLastInput(input)

    try {
      const data = await generateListing(input)
      setResult(data)
      setStatus("success")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while contacting the Gemini API.",
      )
      setStatus("error")
    }
  }

  const handleRetry = () => {
    if (lastInput) handleGenerate(lastInput)
  }

  const hasOutput = status !== "idle"

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-16 sm:px-6">
      <div
        className={`flex w-full flex-col items-center transition-all duration-500 ${
          hasOutput ? "pt-10 sm:pt-14" : "min-h-dvh justify-center"
        }`}
      >
        <Header />
        <div className="mt-8 w-full sm:mt-10">
          <PromptInput
            onSubmit={handleGenerate}
            loading={status === "loading"}
          />
        </div>
      </div>

      {hasOutput && (
        <div className="mt-8 w-full">
          {status === "loading" && <Loading />}
          {status === "error" && (
            <ErrorMessage message={error} onRetry={handleRetry} />
          )}
          {status === "success" && result && <Results result={result} />}
        </div>
      )}
    </main>
  )
}
