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
