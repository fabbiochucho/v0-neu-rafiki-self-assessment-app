import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { getAdministeredOrg, otherMembers } from "@/lib/organizations"

// POST /api/organizations/:id/transfer { user_id } -- the primary admin hands
// the organisation to another existing member, who becomes an admin.
export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })

  const service = createServiceRoleClient()
  const org = await getAdministeredOrg(service, params.id, user.id)
  if (!org) return NextResponse.json({ error: "Only the organisation's primary admin can do this." }, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const target = (await otherMembers(service, org.id, user.id)).find((m) => m.user_id === body.user_id)
  if (!target) return NextResponse.json({ error: "Choose someone who is already a member." }, { status: 400 })

  const { error: roleError } = await service
    .from("organization_members")
    .update({ role: "admin" })
    .eq("organization_id", org.id)
    .eq("user_id", target.user_id)
  if (roleError) return NextResponse.json({ error: "Couldn't hand over. Nothing changed." }, { status: 500 })

  const { error } = await service
    .from("organizations")
    .update({ admin_user_id: target.user_id, closing_at: null, updated_at: new Date().toISOString() })
    .eq("id", org.id)
  if (error) return NextResponse.json({ error: "Couldn't hand over. Please try again." }, { status: 500 })
  return NextResponse.json({ ok: true })
}
