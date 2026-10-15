import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { closingDate, getAdministeredOrg, otherMembers } from "@/lib/organizations"

async function authorise(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: "Please sign in again." }, { status: 401 }) }
  const service = createServiceRoleClient()
  const org = await getAdministeredOrg(service, id, user.id)
  if (!org) return { error: NextResponse.json({ error: "Only the organisation's primary admin can do this." }, { status: 403 }) }
  return { service, org, userId: user.id }
}

// POST /api/organizations/:id/closure -- schedule closure in 30 days. Only
// when the admin is the sole member; otherwise they must hand over first.
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const a = await authorise(params.id)
  if ("error" in a) return a.error
  if ((await otherMembers(a.service, a.org.id, a.userId)).length > 0) {
    return NextResponse.json({ error: "Other people are members. Hand the organisation over to one of them instead." }, { status: 409 })
  }
  const closing_at = closingDate()
  const { error } = await a.service.from("organizations").update({ closing_at }).eq("id", a.org.id)
  if (error) return NextResponse.json({ error: "Couldn't schedule the closure. Please try again." }, { status: 500 })
  return NextResponse.json({ ok: true, closing_at })
}

// DELETE /api/organizations/:id/closure -- cancel a scheduled closure.
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const a = await authorise(params.id)
  if ("error" in a) return a.error
  const { error } = await a.service.from("organizations").update({ closing_at: null }).eq("id", a.org.id)
  if (error) return NextResponse.json({ error: "Couldn't cancel. Please try again." }, { status: 500 })
  return NextResponse.json({ ok: true })
}
