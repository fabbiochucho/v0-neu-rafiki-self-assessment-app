import { describe, it, expect, vi, beforeAll } from "vitest"
import { SignJWT, exportSPKI, generateKeyPair } from "jose"
import { NextRequest } from "next/server"

// Fake service-role client: linked_accounts returns `link`, subscriptions returns `sub`.
const db: { link: unknown; sub: unknown } = { link: null, sub: null }
vi.mock("@/lib/supabase/service", () => ({
  createServiceRoleClient: () => {
    const builder = (table: string): any => {
      const b: any = {
        select: () => b,
        eq: () => b,
        order: () => b,
        limit: () => b,
        maybeSingle: () => Promise.resolve({ data: table === "linked_accounts" ? db.link : db.sub, error: null }),
      }
      return b
    }
    return { from: builder }
  },
}))

let andaPrivateKey: CryptoKey

beforeAll(async () => {
  const { publicKey, privateKey } = await generateKeyPair("EdDSA", { extractable: true })
  andaPrivateKey = privateKey as CryptoKey
  process.env.FEDERATION_ALLIANCE_PUBLIC_KEY = (await exportSPKI(publicKey)).replace(/\n/g, "\\n")
  process.env.NEXT_PUBLIC_ANDA_APP_URL = "https://anda.example"
})

async function call(scope: string) {
  const token = await new SignJWT({ requesting_user_id: "anda-user", target_remote_user_id: "nr-user", scope })
    .setProtectedHeader({ alg: "EdDSA" })
    .setIssuer("alliance")
    .setIssuedAt()
    .setExpirationTime("2m")
    .sign(andaPrivateKey)
  const { GET } = await import("@/app/api/federation/entitlements/route")
  return GET(new NextRequest("https://nr.example/api/federation/entitlements", { headers: { authorization: `Bearer ${token}` } }))
}

describe("GET /api/federation/entitlements", () => {
  it("401s without a token", async () => {
    const { GET } = await import("@/app/api/federation/entitlements/route")
    const res = await GET(new NextRequest("https://nr.example/api/federation/entitlements"))
    expect(res.status).toBe(401)
  })

  it("403s for the wrong scope", async () => {
    expect((await call("assessment_sync")).status).toBe(403)
  })

  it("404s when the two users aren't linked", async () => {
    db.link = null
    expect((await call("entitlements")).status).toBe(404)
  })

  it("returns plan + entitlements, cacheable for 5 minutes", async () => {
    db.link = { id: "link-1" }
    db.sub = { tier: "premium", status: "active" }
    const res = await call("entitlements")
    expect(res.status).toBe(200)
    expect(res.headers.get("cache-control")).toBe("private, max-age=300")
    const body = await res.json()
    expect(body).toMatchObject({ product: "neurafiki", plan: "premium" })
    expect(Object.keys(body.entitlements).sort()).toEqual(["ai_companion", "assessment", "check_ins", "follow_up"])
  })
})
