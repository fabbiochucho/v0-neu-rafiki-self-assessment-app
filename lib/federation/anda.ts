// Outbound calls from Neu Rafiki to ANDA (server-only). Each call carries a
// request token signed with Neu Rafiki's Ed25519 key (lib/federation/jwt.ts).
import { getSiblingAppUrl } from "@/lib/federation/config"
import { signRequestToken } from "@/lib/federation/jwt"

interface Caller {
  localUserId: string
  remoteUserId: string
}

async function callAnda(caller: Caller, scope: string, path: string, init: RequestInit = {}) {
  const base = getSiblingAppUrl()
  if (!base) throw new Error("ANDA federation is not configured")
  const token = await signRequestToken({
    requesting_user_id: caller.localUserId,
    target_remote_user_id: caller.remoteUserId,
    scope,
  })
  return fetch(`${base}${path}`, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  })
}

export interface CheckInSummaryPayload {
  learner_ref: string
  date: string // ISO 8601
  goal_title: string
  summary: string
  answers: { question_key: string; question: string; answer: string | string[] }[]
}

/** POST {ANDA}/api/federation/check-in-summary. Resolves true when ANDA accepted it. */
export async function sendCheckInSummary(caller: Caller, payload: CheckInSummaryPayload): Promise<boolean> {
  const res = await callAnda(caller, "check_in_summary", "/api/federation/check-in-summary", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return res.ok
}

export interface AndaEntitlements {
  product: "anda"
  plan: string
  entitlements: { iep: boolean; goals: boolean; progress: boolean; reports: boolean; support_team: boolean }
}

// ponytail: per-server-instance memory cache (5 min, the contract's TTL).
// Instances don't share it; move to a shared store if ANDA load matters.
const CACHE_MS = 5 * 60 * 1000
const entitlementsCache = new Map<string, { at: number; value: AndaEntitlements | null }>()

/** GET {ANDA}/api/federation/entitlements. null when ANDA says not linked (404) or on any failure. */
export async function fetchAndaEntitlements(caller: Caller): Promise<AndaEntitlements | null> {
  const key = `${caller.localUserId}:${caller.remoteUserId}`
  const hit = entitlementsCache.get(key)
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.value

  let value: AndaEntitlements | null = null
  try {
    const res = await callAnda(caller, "entitlements", "/api/federation/entitlements")
    if (res.ok) {
      const body = await res.json()
      if (body?.product === "anda" && typeof body.plan === "string" && body.entitlements) value = body
    } else if (res.status !== 404) {
      return null // transient error: don't cache
    }
  } catch {
    return null
  }
  entitlementsCache.set(key, { at: Date.now(), value })
  return value
}
