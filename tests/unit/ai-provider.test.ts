import { describe, expect, it } from "vitest"
import { aiProvider, cloudflareText, DEFAULT_CLOUDFLARE_MODEL, generate } from "@/lib/ai"

describe("AI provider", () => {
  it("prefers free Cloudflare AI, falls back to Anthropic, and is off with neither", () => {
    expect(aiProvider({ CLOUDFLARE_ACCOUNT_ID: "a", CLOUDFLARE_AI_TOKEN: "t", ANTHROPIC_API_KEY: "k" })).toBe("cloudflare")
    expect(aiProvider({ ANTHROPIC_API_KEY: "k" })).toBe("anthropic")
    expect(aiProvider({})).toBeNull()
  })

  it("reads Cloudflare replies in both response shapes", () => {
    expect(cloudflareText({ result: { response: "Hello" } })).toBe("Hello")
    expect(cloudflareText({ result: { choices: [{ message: { content: "Hi" } }] } })).toBe("Hi")
    expect(cloudflareText({ success: false })).toBeNull()
  })

  it("calls the configured Cloudflare model with the system prompt first", async () => {
    const calls: { url: string; body: { messages: { role: string }[] } }[] = []
    const realFetch = globalThis.fetch
    globalThis.fetch = (async (url: string, init: { body: string }) => {
      calls.push({ url, body: JSON.parse(init.body) })
      return new Response(JSON.stringify({ result: { response: "It means getting started." } }), { status: 200 })
    }) as unknown as typeof fetch
    try {
      const out = await generate({ system: "rules", messages: [{ role: "user", content: "What does initiating mean?" }], maxTokens: 50, env: { CLOUDFLARE_ACCOUNT_ID: "acc", CLOUDFLARE_AI_TOKEN: "tok" } })
      expect(out).toEqual({ ok: true, text: "It means getting started." })
      expect(calls[0].url).toBe(`https://api.cloudflare.com/client/v4/accounts/acc/ai/run/${DEFAULT_CLOUDFLARE_MODEL}`)
      expect(calls[0].body.messages[0].role).toBe("system")
    } finally {
      globalThis.fetch = realFetch
    }
  })

  it("treats the free daily limit running out as busy", async () => {
    const realFetch = globalThis.fetch
    globalThis.fetch = (async () => new Response("{}", { status: 429 })) as unknown as typeof fetch
    try {
      expect(await generate({ system: "s", messages: [{ role: "user", content: "hi" }], maxTokens: 5, env: { CLOUDFLARE_ACCOUNT_ID: "a", CLOUDFLARE_AI_TOKEN: "t" } })).toEqual({ ok: false, reason: "busy" })
    } finally {
      globalThis.fetch = realFetch
    }
  })
})
