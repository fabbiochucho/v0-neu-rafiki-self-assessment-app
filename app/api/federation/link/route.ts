import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isFederationEnabled } from "@/lib/federation/config"

/**
 * POST: creates the linked_accounts row that records "this Neu Rafiki
 * account is connected to that Alliance account". Called from
 * app/connect/page.tsx after the user reviews and accepts the consent
 * screen shown for a link token the sibling app (Alliance) issued -- the
 * token itself was already verified (verifySiblingLinkToken) by the page
 * before it rendered that screen, so this route trusts the already-verified
 * payload fields passed in the request body rather than re-verifying the raw
 * token, since the token may be single-use/short-lived and the accept click
 * is a separate request.
 *
 * Body: { remote_user_id: string, remote_email: string, scopes: string[] }
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

  let body: { remote_user_id?: unknown; remote_email?: unknown; scopes?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { remote_user_id, remote_email, scopes } = body
  if (typeof remote_user_id !== "string" || !remote_user_id) {
    return NextResponse.json({ error: "remote_user_id is required" }, { status: 400 })
  }
  if (typeof remote_email !== "string" || !remote_email) {
    return NextResponse.json({ error: "remote_email is required" }, { status: 400 })
  }
  const scopeList = Array.isArray(scopes) ? scopes.filter((s): s is string => typeof s === "string") : []
  if (scopeList.length === 0) {
    return NextResponse.json({ error: "scopes must be a non-empty array of strings" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("linked_accounts")
    .upsert(
      {
        local_user_id: user.id,
        remote_app: "alliance",
        remote_user_id,
        remote_email,
        status: "active",
        scopes: scopeList,
        consent_version: "1.0",
        revoked_at: null,
      },
      { onConflict: "local_user_id,remote_app,remote_user_id" },
    )
    .select()
    .single()

  if (error) {
    console.error("[api/federation/link] failed to create linked_accounts row:", error)
    return NextResponse.json({ error: "Failed to link account" }, { status: 500 })
  }

  return NextResponse.json({ linked_account: data })
}
