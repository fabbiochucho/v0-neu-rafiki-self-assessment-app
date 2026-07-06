import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * PATCH: revokes a linked_accounts row (sets status = 'revoked' and
 * revoked_at = now()). Mirrors the consents table's revoke-don't-delete
 * convention (see scripts/009_create_consents_table.sql) so there's an audit
 * trail of when a connection was cut, rather than losing the row entirely.
 * The linked_accounts_update_own RLS policy already restricts this to the
 * caller's own rows; the explicit .eq("local_user_id", ...) below just gives
 * us a clean 404 instead of a silent no-op update when it isn't.
 */
export async function PATCH(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("linked_accounts")
    .update({ status: "revoked", revoked_at: new Date().toISOString() })
    .eq("id", id)
    .eq("local_user_id", user.id)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Linked account not found" }, { status: 404 })
  }

  return NextResponse.json({ linked_account: data })
}
