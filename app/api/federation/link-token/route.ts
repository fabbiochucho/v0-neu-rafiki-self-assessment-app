import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isFederationEnabled } from "@/lib/federation/config"
import { signLinkToken } from "@/lib/federation/jwt"

/**
 * POST: mints a short-lived (5 min) link token identifying the current
 * authenticated Neu Rafiki user, for use in the "Connect account" handshake.
 * The caller (app/dashboard/connections/page.tsx) redirects the browser to
 * `${allianceUrl}/connect?token=...` with the returned token so Alliance can
 * verify it was really issued by this app (via FEDERATION_ALLIANCE_PUBLIC_KEY
 * verifying our signature) and show its own consent screen.
 *
 * Body: { scopes: string[] } -- e.g. ["assessment_sync"].
 */
export async function POST(request: NextRequest) {
  if (!isFederationEnabled()) {
    return NextResponse.json({ error: "Federation is not enabled on this deployment" }, { status: 503 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  let body: { scopes?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const scopes = Array.isArray(body.scopes) ? body.scopes.filter((s): s is string => typeof s === "string") : []
  if (scopes.length === 0) {
    return NextResponse.json({ error: "scopes must be a non-empty array of strings" }, { status: 400 })
  }

  if (!user.email) {
    return NextResponse.json({ error: "Account has no email on file" }, { status: 400 })
  }

  try {
    const token = await signLinkToken({
      iss: "neurafiki",
      sub: user.id,
      email: user.email,
      scopes,
    })
    return NextResponse.json({ token })
  } catch (error) {
    console.error("[api/federation/link-token] failed to sign token:", error)
    return NextResponse.json({ error: "Failed to create link token" }, { status: 500 })
  }
}
