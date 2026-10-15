import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { ADMIN_PANEL_ROLES } from "@/lib/auth/roles"
import { enrollMember, MEMBER_ROLES, type MemberRole } from "@/lib/organizations"

// /api/admin/organizations/:id/members -- list, invite, change role, remove.
// Caller must be an admin of THIS organisation (same check as bulk-enroll).
// The primary admin (organizations.admin_user_id) can't be removed or
// demoted here; they hand over from their account page instead.

type Ctx = { params: { id: string } }

async function authorise(orgId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: "Please sign in again." }, { status: 401 }) }
  const { data: membership } = await supabase
    .from("organization_members")
    .select("id")
    .eq("user_id", user.id)
    .eq("organization_id", orgId)
    .in("role", ADMIN_PANEL_ROLES)
    .maybeSingle()
  if (!membership) return { error: NextResponse.json({ error: "Only this organisation's admins can manage members." }, { status: 403 }) }
  const service = createServiceRoleClient()
  const { data: org } = await service.from("organizations").select("admin_user_id").eq("id", orgId).maybeSingle()
  if (!org) return { error: NextResponse.json({ error: "Organisation not found." }, { status: 404 }) }
  return { service, primaryAdmin: org.admin_user_id as string | null, userId: user.id }
}

const isRole = (v: unknown): v is MemberRole => typeof v === "string" && (MEMBER_ROLES as readonly string[]).includes(v)

export async function GET(_req: NextRequest, { params }: Ctx) {
  const a = await authorise(params.id)
  if ("error" in a) return a.error
  const { data, error } = await a.service
    .from("organization_members")
    .select("id, user_id, role, created_at")
    .eq("organization_id", params.id)
    .order("created_at", { ascending: true })
  if (error) return NextResponse.json({ error: "Couldn't load members." }, { status: 500 })
  const ids = (data ?? []).map((m) => m.user_id as string)
  const { data: profiles } = ids.length ? await a.service.from("profiles").select("id, email").in("id", ids) : { data: [] }
  const email = new Map((profiles ?? []).map((p) => [p.id as string, p.email as string | null]))
  return NextResponse.json({
    members: (data ?? []).map((m) => ({
      ...m,
      email: email.get(m.user_id as string) ?? null,
      primary: m.user_id === a.primaryAdmin,
      you: m.user_id === a.userId,
    })),
  })
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const a = await authorise(params.id)
  if ("error" in a) return a.error
  const body = await req.json().catch(() => ({}))
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  }
  const role = isRole(body.role) ? body.role : "member"
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) || undefined : undefined
  try {
    const { invited } = await enrollMember(a.service, params.id, { email, name, role })
    return NextResponse.json({ ok: true, invited }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Couldn't add that person. Please try again." }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const a = await authorise(params.id)
  if ("error" in a) return a.error
  const body = await req.json().catch(() => ({}))
  if (typeof body.memberId !== "string" || !isRole(body.role)) {
    return NextResponse.json({ error: "Choose a member and a role." }, { status: 400 })
  }
  const { data: member } = await a.service
    .from("organization_members")
    .select("user_id")
    .eq("id", body.memberId)
    .eq("organization_id", params.id)
    .maybeSingle()
  if (!member) return NextResponse.json({ error: "Member not found." }, { status: 404 })
  if (member.user_id === a.primaryAdmin && body.role !== "admin") {
    return NextResponse.json({ error: "The primary admin must stay an admin. Hand over from the account page first." }, { status: 409 })
  }
  const { error } = await a.service.from("organization_members").update({ role: body.role }).eq("id", body.memberId)
  if (error) return NextResponse.json({ error: "Couldn't change the role." }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const a = await authorise(params.id)
  if ("error" in a) return a.error
  const memberId = new URL(req.url).searchParams.get("memberId")
  if (!memberId) return NextResponse.json({ error: "Choose a member." }, { status: 400 })
  const { data: member } = await a.service
    .from("organization_members")
    .select("user_id")
    .eq("id", memberId)
    .eq("organization_id", params.id)
    .maybeSingle()
  if (!member) return NextResponse.json({ error: "Member not found." }, { status: 404 })
  if (member.user_id === a.primaryAdmin) {
    return NextResponse.json({ error: "The primary admin can't be removed. Hand over from the account page first." }, { status: 409 })
  }
  const { error } = await a.service.from("organization_members").delete().eq("id", memberId)
  if (error) return NextResponse.json({ error: "Couldn't remove that member." }, { status: 500 })
  return NextResponse.json({ ok: true })
}
