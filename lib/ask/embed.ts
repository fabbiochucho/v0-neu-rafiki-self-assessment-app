// Embeddings for approved-source search: Cloudflare Workers AI bge-m3 (multilingual, 1024 dimensions),
// on the same free account and token as lib/ai.ts. Not configured = null, and search uses full-text only.
export const EMBED_MODEL = "@cf/baai/bge-m3"
export const EMBED_DIMS = 1024
const BATCH = 20

export function embeddingsFrom(body: unknown): number[][] | null {
  const data = (body as { result?: { data?: unknown } })?.result?.data
  if (!Array.isArray(data) || !data.every((v) => Array.isArray(v) && v.length === EMBED_DIMS)) return null
  return data as number[][]
}

export async function embed(texts: string[], env: Record<string, string | undefined> = process.env): Promise<number[][] | null> {
  const account = env.CLOUDFLARE_ACCOUNT_ID?.trim()
  const token = env.CLOUDFLARE_AI_TOKEN?.trim()
  if (!account || !token || !texts.length) return null
  const out: number[][] = []
  for (let i = 0; i < texts.length; i += BATCH) {
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${EMBED_MODEL}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text: texts.slice(i, i + BATCH) }),
        cache: "no-store",
        signal: AbortSignal.timeout(30_000),
      })
      const vecs = res.ok ? embeddingsFrom(await res.json().catch(() => null)) : null
      if (!vecs) {
        console.error("ask: embedding error", res.status)
        return null
      }
      out.push(...vecs)
    } catch {
      console.error("ask: embedding network error")
      return null
    }
  }
  return out
}
