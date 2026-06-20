import type { ListingResult } from "./types"

// Amazon listing character/byte limits
export const AMAZON_LIMITS = {
  title: 75,
  bullet: 500,
  description: 2000,
  searchTerms: 200, // bytes
} as const

const byteLength = (str: string) => new TextEncoder().encode(str).length

// Trim a string to a maximum number of bytes without splitting words mid-way
const clampBytes = (str: string, maxBytes: number): string => {
  if (byteLength(str) <= maxBytes) return str
  let result = str
  while (byteLength(result) > maxBytes && result.length > 0) {
    result = result.slice(0, result.lastIndexOf(" ") > 0 ? result.lastIndexOf(" ") : result.length - 1)
  }
  return result.trim()
}

// Trim a string to a maximum number of characters at a word boundary
const clampChars = (str: string, maxChars: number): string => {
  if (str.length <= maxChars) return str
  const slice = str.slice(0, maxChars)
  const lastSpace = slice.lastIndexOf(" ")
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim()
}

const MODEL = "gemini-2.5-flash"
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const SYSTEM_INSTRUCTION = `You are an expert Amazon listing copywriter and SEO specialist.
Given raw product details provided by a seller, you generate a high-converting,
fully Amazon-compliant product listing.

Rules:
- Infer the product category, audience, and keywords ONLY from the details the user provides. Never invent unrelated facts.
- Strictly follow Amazon's character limits below. Count characters carefully and stay within every limit. Never exceed them.
- Amazon Product Name (title): compelling and keyword-rich, MUST be 200 characters or fewer (including spaces). Aim for 65-75 characters.
- Bullet Points: provide EXACTLY 5. Each bullet MUST be 500 characters or fewer; aim for 400-450 characters. Lead with a benefit in a short capitalized phrase, then a concise explanation. No leading symbols, numbers, or bullet characters.
- Description: 4-5 short paragraphs of persuasive, scannable copy. Plain text only (no HTML). MUST be 2000 characters or fewer.
- Backend Search Terms: a single space-separated string of relevant keywords. No commas, no repetition, no brand names, no quotes. MUST be 200 bytes or fewer.
- Respond ONLY with valid JSON matching the requested schema. No markdown, no commentary.`

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
    finishReason?: string
  }>
  promptFeedback?: { blockReason?: string }
  error?: { message?: string }
}

const responseSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    bullets: {
      type: "ARRAY",
      items: { type: "STRING" },
      minItems: 5,
      maxItems: 5,
    },
    description: { type: "STRING" },
    searchTerms: { type: "STRING" },
  },
  required: ["title", "bullets", "description", "searchTerms"],
}

export async function generateListing(
  productDetails: string,
): Promise<ListingResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      "Gemini API key is not configured. Please set the VITE_GEMINI_API_KEY environment variable.",
    )
  }

  let res: Response
  try {
    res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Generate an Amazon listing for the following product details:\n\n${productDetails}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema,
        },
      }),
    })
  } catch {
    throw new Error(
      "Unable to reach the Gemini API. Check your internet connection and try again.",
    )
  }

  const data: GeminiResponse = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message =
      data?.error?.message ||
      `Gemini API request failed with status ${res.status}.`
    throw new Error(message)
  }

  if (data.promptFeedback?.blockReason) {
    throw new Error(
      `The request was blocked by Gemini (${data.promptFeedback.blockReason}). Try rephrasing your product details.`,
    )
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error("Gemini returned an empty response. Please try again.")
  }

  let parsed: ListingResult
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error(
      "Gemini returned a response that could not be read. Please try again.",
    )
  }

  if (
    !parsed.title ||
    !Array.isArray(parsed.bullets) ||
    !parsed.description ||
    !parsed.searchTerms
  ) {
    throw new Error("Gemini returned an incomplete listing. Please try again.")
  }

  // Hard-enforce Amazon limits as a safety net in case the model overshoots
  return {
    title: clampChars(parsed.title.trim(), AMAZON_LIMITS.title),
    bullets: parsed.bullets
      .map((b) => clampChars(b.trim(), AMAZON_LIMITS.bullet))
      .filter(Boolean),
    description: clampChars(parsed.description.trim(), AMAZON_LIMITS.description),
    searchTerms: clampBytes(parsed.searchTerms.trim(), AMAZON_LIMITS.searchTerms),
  }
}
