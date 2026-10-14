import { NextResponse, type NextRequest } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { isFederationEnabled } from "@/lib/federation/config"
import { verifyAllianceRequestToken } from "@/lib/federation/jwt"
import { entitlementsFor, getPlan } from "@/lib/entitlements"

const REQUIRED_SCOPE = "entitlements"

/**
 * GET: NeuRafiki plan + entitlements for a linked user, for ANDA's account
 * page. Signed like the existing pull API: `Authorization: Bearer <request
 * token>` minted by ANDA (iss "alliance", scope "entitlements",
 * requesting_user_id = ANDA user, target_remote_user_id = NeuRafiki user),
 * verified with ANDA's public key.
 *
 * 404 when there is no active link between those two users. Responses are
 * cacheable privately for 5 minutes. Billing stays separate: this only
 * reports NeuRafiki's own plan.
 */
export async function GET(request: NextRequest) {
  if (!isFederationEnabled()) {
    return NextResponse.json({ error: "Federation is not enabled on this deployment" }, { status: 503 })
  }

  const auth = request.headers.get("authorization")
  const token = auth?.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : null
  if (!token) return NextResponse.json({ error: "Missing bearer token" }, { status: 401 })

  let payload
  try {
    payload = await verifyAllianceRequestToken(token)
  } catch {
    return NextResponse.json({ error: "Invalid or expired request token" }, { status: 401 })
  }
  if (payload.scope !== REQUIRED_SCOPE) {
    return NextResponse.json({ error: "Token does not grant the required scope" }, { status: 403 })
  }

  const service = createServiceRoleClient()
  const { data: link } = await service
    .from("linked_accounts")
    .select("id")
    .eq("local_user_id", payload.target_remote_user_id)
    .eq("remote_app", "alliance")
    .eq("remote_user_id", payload.requesting_user_id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: "Not linked" }, { status: 404 })

  const plan = await getPlan(service, payload.target_remote_user_id)
  return NextResponse.json(
    { product: "neurafiki", plan, entitlements: entitlementsFor(plan) },
    { headers: { "Cache-Control": "private, max-age=300" } },
  )
}
